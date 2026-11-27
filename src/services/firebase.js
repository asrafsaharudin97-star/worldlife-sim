/* ==========================================================================
   WorldLife — Perkhidmatan Firebase Auth (Google) & Cloud Firestore Save
   Firebase Modular SDK (v10+) • Struktur: users/{uid}/saves/{slotId}
   ========================================================================== */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import {
  getFirestore,
  initializeFirestore,
  collection,
  doc,
  getDocs,
  getDocsFromServer,
  getDoc,
  getDocFromServer,
  setDoc
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyDA67eMFqkDxkLDUM-xZIDKc0WBku3drt0",
  authDomain: "world-life-sim.firebaseapp.com",
  projectId: "world-life-sim",
  storageBucket: "world-life-sim.firebasestorage.app",
  messagingSenderId: "908168554093",
  appId: "1:908168554093:web:d0cfcbf71d3fe7a55b4164",
  measurementId: "G-3HEKY4X4D2"
};

let app = null;
let auth = null;
let db = null;
let provider = null;
let initialized = false;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  try {
    db = initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
  } catch (fsErr) {
    db = getFirestore(app);
  }
  provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  initialized = true;
} catch (err) {
  console.warn('[Firebase] Gagal memulakan SDK (mod luar talian aktif):', err);
}

const SLOT_IDS = ['slot_1', 'slot_2', 'slot_3', 'slot_4', 'slot_5'];
const TARGET_MAX_BYTES = 750 * 1024; // 750 KB sasaran selamat (< had 1MB Firestore)
const HARD_MAX_BYTES = 980 * 1024;   // 980 KB had keras sebelum penolakan pelayan

function utf8ByteLength(str) {
  if (typeof str !== 'string') return 0;
  try {
    if (typeof TextEncoder !== 'undefined') {
      return new TextEncoder().encode(str).length;
    }
  } catch (e) {}
  return str.length * 2;
}

function isOfflineLikeError(err, detail) {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return true;
  const code = String((err && err.code) || detail || '').toLowerCase();
  const msg = String((err && err.message) || '').toLowerCase();
  return code === 'unavailable'
    || code === 'timeout'
    || code === 'failed-precondition'
    || msg.includes('offline')
    || msg.includes('network')
    || msg.includes('could not reach cloud firestore');
}

function formatFirestoreError(err, fallbackDetail = 'unknown') {
  const code = (err && err.code) ? String(err.code) : String(fallbackDetail || 'unknown');
  const rawMsg = (err && err.message) ? String(err.message) : '';
  let reason = 'Ralat tidak diketahui semasa berhubung dengan pelayan Cloud.';
  if (code === 'timeout') {
    reason = 'Sambungan ke pelayan Cloud tamat masa (timeout).';
  } else if (code === 'unavailable' || isOfflineLikeError(err, code)) {
    reason = 'Tiada sambungan internet atau pelayan Cloud tidak dapat dicapai.';
  } else if (code === 'permission-denied') {
    reason = 'Akses ditolak oleh peraturan keselamatan Firestore (permission-denied).';
  } else if (code === 'unauthenticated') {
    reason = 'Sesi log masuk Google telah tamat. Sila log masuk semula.';
  } else if (code === 'invalid-argument') {
    reason = 'Struktur atau saiz data ditolak oleh Firestore (invalid-argument).';
  } else if (code === 'resource-exhausted') {
    reason = 'Kuota permintaan Firestore telah dicapai buat sementara waktu.';
  } else if (code === 'payload-too-large') {
    reason = 'Saiz data simpanan masih melebihi had maksimum 1 MB Firestore.';
  } else if (rawMsg) {
    reason = rawMsg.slice(0, 140);
  }
  return { code, reason, full: `${code}: ${reason}` };
}

function trimJournalBlocks(journal, maxEntries) {
  if (!Array.isArray(journal)) return [];
  const kept = [];
  let count = 0;
  for (let i = journal.length - 1; i >= 0 && count < maxEntries; i--) {
    const blk = journal[i];
    if (!blk || typeof blk !== 'object') continue;
    const entries = Array.isArray(blk.entries) ? blk.entries : [];
    const room = maxEntries - count;
    const slice = entries.length > room ? entries.slice(-room) : entries;
    kept.unshift({ ...blk, entries: slice });
    count += slice.length;
  }
  return kept;
}

function buildAuthDiagnostic(err) {
  const code = (err && err.code) ? String(err.code) : 'auth/unknown-error';
  const hostname = (typeof window !== 'undefined' && window.location && window.location.hostname)
    ? window.location.hostname
    : 'unknown-host';
  let hint = 'Sila cuba lagi sebentar lagi atau semak sambungan internet anda.';

  if (code === 'auth/unauthorized-domain') {
    hint = `Domain laman ini belum dibenarkan dalam Firebase. Sila salin domain "${hostname}" dan tambahkannya di Firebase Console → Authentication → Settings → Authorized domains.`;
  } else if (code === 'auth/operation-not-allowed') {
    hint = 'Log masuk Google belum diaktifkan dalam projek Firebase. Sila aktifkan Google Sign-In di Firebase Console → Authentication → Sign-in method.';
  } else if (code === 'auth/popup-closed-by-user') {
    hint = 'Tetingkap log masuk ditutup sebelum proses selesai. Klik semula butang Log Masuk untuk cuba lagi.';
  } else if (code === 'auth/network-request-failed') {
    hint = 'Sambungan internet terganggu atau disekat oleh pelayar/firewall.';
  }

  return {
    code,
    hostname,
    hint,
    msg: `Gagal log masuk Google (${code}) di domain ${hostname}.`
  };
}

const FirebaseService = {
  SLOT_IDS,
  initialized,
  user: null,
  syncState: 'idle', // 'idle' | 'syncing' | 'synced' | 'offline' | 'error'
  syncErrorDetail: null,
  syncErrorMsg: null,
  lastSyncAt: null,
  lastSyncSource: null, // 'server' | 'cache' | null
  lastPayloadBytes: 0,
  lastAuthError: null,
  _authListeners: [],
  _syncListeners: [],

  isLoggedIn() {
    return Boolean(this.user && this.user.uid);
  },

  getShortUid() {
    if (!this.user || !this.user.uid) return null;
    const uid = String(this.user.uid);
    return uid.length > 6 ? uid.slice(-6) : uid;
  },

  clearAuthError() {
    this.lastAuthError = null;
  },

  _notifyAuthListeners() {
    this._authListeners.forEach(fn => {
      try { fn(this.user, this.lastAuthError); } catch (e) {}
    });
  },

  setSyncState(state, errDetail = null, errMsg = null) {
    this.syncState = state;
    this.syncErrorDetail = (state === 'error' || state === 'offline') ? String(errDetail || 'unknown') : null;
    this.syncErrorMsg = (state === 'error' || state === 'offline') ? (errMsg ? String(errMsg) : null) : null;
    if (state === 'synced') this.lastSyncAt = Date.now();
    this._syncListeners.forEach(fn => {
      try { fn(this.syncState, this.lastSyncAt, this.syncErrorDetail, this.syncErrorMsg); } catch (e) {}
    });
  },

  onAuthChange(cb) {
    if (typeof cb === 'function') {
      this._authListeners.push(cb);
      try { cb(this.user, this.lastAuthError); } catch (e) {}
      return () => {
        this._authListeners = this._authListeners.filter(fn => fn !== cb);
      };
    }
    return () => {};
  },

  onSyncStateChange(cb) {
    if (typeof cb === 'function') {
      this._syncListeners.push(cb);
      try { cb(this.syncState, this.lastSyncAt, this.syncErrorDetail, this.syncErrorMsg); } catch (e) {}
      return () => {
        this._syncListeners = this._syncListeners.filter(fn => fn !== cb);
      };
    }
    return () => {};
  },

  async signInWithGoogle() {
    this.lastAuthError = null;
    if (!auth || !provider) {
      const diag = buildAuthDiagnostic({ code: 'auth/sdk-not-initialized' });
      this.lastAuthError = diag;
      this._notifyAuthListeners();
      return { ok: false, error: diag, msg: diag.msg };
    }

    try {
      const cred = await signInWithPopup(auth, provider);
      this.user = cred.user;
      this.lastAuthError = null;
      this.lastSyncSource = null;
      this.setSyncState('idle');
      return {
        ok: true,
        user: cred.user,
        msg: `Berjaya log masuk sebagai ${cred.user.displayName || cred.user.email}!`
      };
    } catch (err) {
      const code = (err && err.code) ? String(err.code) : '';
      // Fallback automatik ke signInWithRedirect jika popup disekat pelayar / mudah alih
      if (code === 'auth/popup-blocked' || code === 'auth/cancelled-popup-request') {
        try {
          await signInWithRedirect(auth, provider);
          return {
            ok: true,
            redirecting: true,
            msg: 'Tetingkap popup disekat — mengalihkan ke halaman log masuk Google...'
          };
        } catch (redirErr) {
          const diag = buildAuthDiagnostic(redirErr);
          this.lastAuthError = diag;
          this._notifyAuthListeners();
          return { ok: false, error: diag, msg: diag.msg };
        }
      }

      const diag = buildAuthDiagnostic(err);
      this.lastAuthError = diag;
      this._notifyAuthListeners();
      return { ok: false, error: diag, msg: diag.msg };
    }
  },

  async signOutUser() {
    if (!auth) return { ok: false, msg: 'Perkhidmatan Firebase tidak tersedia.' };
    try {
      await signOut(auth);
      this.user = null;
      this.lastAuthError = null;
      this.lastSyncAt = null;
      this.lastSyncSource = null;
      this.lastPayloadBytes = 0;
      this.setSyncState('idle');
      this._notifyAuthListeners();
      return { ok: true, msg: 'Anda telah log keluar daripada akaun Google.' };
    } catch (err) {
      return { ok: false, msg: 'Gagal log keluar. Sila cuba lagi.' };
    }
  },

  _withTimeout(promise, ms = 22000, code = 'timeout') {
    return Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => {
        const err = new Error(code);
        err.code = code;
        reject(err);
      }, ms))
    ]);
  },

  estimateBytes(data) {
    try {
      const replacer = (_, v) => {
        if (typeof v === 'number' && !Number.isFinite(v)) return 0;
        if (typeof v === 'function' || typeof v === 'symbol') return undefined;
        return v;
      };
      return utf8ByteLength(JSON.stringify(data, replacer));
    } catch (e) {
      return 0;
    }
  },

  sanitizeAndBoundPayload(data) {
    const replacer = (_, v) => {
      if (typeof v === 'number' && !Number.isFinite(v)) return 0;
      if (typeof v === 'function' || typeof v === 'symbol') return undefined;
      return v;
    };
    let jsonStr = JSON.stringify(data, replacer);
    const clean = JSON.parse(jsonStr);
    // Pastikan penanda tombstone lama dibuang bagi dokumen aktif
    if (clean && clean.gameState) {
      delete clean.deleted;
      delete clean.deletedAt;
    }

    let byteSize = utf8ByteLength(JSON.stringify(clean));
    let trimmed = false;

    // Had 750 KB: pangkas log diari/sejarah tahunan paling lama tanpa menyentuh watak, keluarga, aset, Yayasan, atau pusaka
    if (byteSize > TARGET_MAX_BYTES && clean && clean.gameState) {
      const gs = clean.gameState;
      const limits = [120, 100, 60, 30];
      for (let i = 0; i < limits.length && byteSize > TARGET_MAX_BYTES; i++) {
        if (Array.isArray(gs.journal)) {
          gs.journal = trimJournalBlocks(gs.journal, limits[i]);
          trimmed = true;
          byteSize = utf8ByteLength(JSON.stringify(clean));
        }
      }
      // Jika masih melebihi 750 KB (contoh: banyak generasi pastLives dengan log panjang), ringkaskan log dalam pastLives sahaja
      if (byteSize > TARGET_MAX_BYTES && Array.isArray(gs.pastLives)) {
        gs.pastLives = gs.pastLives.map(pl => {
          if (!pl || typeof pl !== 'object') return pl;
          const copy = { ...pl };
          if (Array.isArray(copy.journal)) copy.journal = trimJournalBlocks(copy.journal, 10);
          return copy;
        });
        trimmed = true;
        byteSize = utf8ByteLength(JSON.stringify(clean));
      }
    }

    return { payload: clean, byteSize, trimmed };
  },

  async listCloudSlots({ forceServer = true } = {}) {
    if (!db || !this.isLoggedIn()) {
      return { slots: {}, cloudError: false, offline: false, source: null, totalBytes: 0 };
    }
    this.setSyncState('syncing');
    const colRef = collection(db, 'users', this.user.uid, 'saves');

    try {
      const readPromise = forceServer ? getDocsFromServer(colRef) : getDocs(colRef);
      const snap = await this._withTimeout(readPromise, 22000, 'timeout');
      const map = {};
      snap.forEach(d => {
        if (SLOT_IDS.includes(d.id)) {
          map[d.id] = { ...d.data(), slotId: d.id };
        }
      });
      const totalBytes = this.estimateBytes(map);
      this.lastSyncSource = 'server';
      this.lastPayloadBytes = totalBytes;
      this.setSyncState('synced');
      return {
        slots: map,
        cloudError: false,
        offline: false,
        source: 'server',
        totalBytes
      };
    } catch (err) {
      const parsed = formatFirestoreError(err, 'unknown');
      const offline = isOfflineLikeError(err, parsed.code);
      console.error('[Firebase] listCloudSlots server error:', parsed.code, err);

      // Jika luar talian, cuba baca cache Firestore semata-mata untuk paparan Mod Luar Talian (BUKAN hijau Disegerakkan)
      if (offline) {
        try {
          const cacheSnap = await this._withTimeout(getDocs(colRef), 5000, 'cache-timeout');
          const cacheMap = {};
          cacheSnap.forEach(d => {
            if (SLOT_IDS.includes(d.id)) {
              cacheMap[d.id] = { ...d.data(), slotId: d.id };
            }
          });
          const totalBytes = this.estimateBytes(cacheMap);
          this.lastSyncSource = 'cache';
          this.lastPayloadBytes = totalBytes;
          this.setSyncState('offline', parsed.code, parsed.reason);
          return {
            slots: cacheMap,
            cloudError: true,
            offline: true,
            source: 'cache',
            totalBytes,
            errorDetail: parsed.code,
            errorMsg: parsed.reason
          };
        } catch (cacheErr) {
          // Tiada cache Firestore tersedia
        }
      }

      this.lastSyncSource = null;
      this.setSyncState(offline ? 'offline' : 'error', parsed.code, parsed.reason);
      return {
        slots: {},
        cloudError: true,
        offline,
        source: null,
        totalBytes: 0,
        errorDetail: parsed.code,
        errorMsg: parsed.reason
      };
    }
  },

  async getCloudSlot(slotId, { forceServer = true } = {}) {
    if (!db || !this.isLoggedIn() || !SLOT_IDS.includes(slotId)) return null;
    try {
      const ref = doc(db, 'users', this.user.uid, 'saves', slotId);
      const snap = await this._withTimeout(forceServer ? getDocFromServer(ref) : getDoc(ref), 22000, 'timeout');
      return snap.exists() ? { ...snap.data(), slotId } : null;
    } catch (err) {
      console.error('[Firebase] getCloudSlot error:', (err && (err.code || err.message)) || 'unknown', err);
      return null;
    }
  },

  async saveCloudSlot(slotId, payload) {
    if (!db || !this.isLoggedIn() || !SLOT_IDS.includes(slotId)) {
      return { ok: false, code: 'unauthenticated', msg: 'Sila log masuk Google untuk menyimpan ke Cloud.' };
    }
    this.setSyncState('syncing');
    try {
      const now = Date.now();
      const ts = Number((payload && (payload.savedAt || payload.updatedAt)) || now) || now;
      const raw = {
        ...(payload || {}),
        slotId,
        savedAt: ts,
        updatedAt: ts
      };
      const { payload: cleanPayload, byteSize, trimmed } = this.sanitizeAndBoundPayload(raw);

      if (byteSize > HARD_MAX_BYTES) {
        const parsed = formatFirestoreError(null, 'payload-too-large');
        this.setSyncState('error', parsed.code, parsed.reason);
        return {
          ok: false,
          code: parsed.code,
          byteSize,
          msg: `Ralat Sync (${parsed.code}): ${parsed.reason}`
        };
      }

      const ref = doc(db, 'users', this.user.uid, 'saves', slotId);
      await this._withTimeout(setDoc(ref, cleanPayload), 22000, 'timeout');
      this.lastSyncSource = 'server';
      this.lastPayloadBytes = byteSize;
      this.setSyncState('synced');
      return {
        ok: true,
        payload: cleanPayload,
        byteSize,
        trimmed,
        savedAt: ts,
        msg: `Slot ${slotId.replace('slot_', '')} berjaya disimpan ke pelayan Cloud!`
      };
    } catch (err) {
      const parsed = formatFirestoreError(err, 'unknown');
      const offline = isOfflineLikeError(err, parsed.code);
      console.error('[Firebase] saveCloudSlot error:', parsed.code, err);
      this.setSyncState(offline ? 'offline' : 'error', parsed.code, parsed.reason);
      return {
        ok: false,
        timeout: parsed.code === 'timeout',
        offline,
        code: parsed.code,
        msg: `Ralat Sync (${parsed.code}): ${parsed.reason}`
      };
    }
  },

  async deleteCloudSlot(slotId) {
    if (!db || !this.isLoggedIn() || !SLOT_IDS.includes(slotId)) {
      return { ok: false, code: 'unauthenticated', msg: 'Tidak log masuk ke Cloud.' };
    }
    this.setSyncState('syncing');
    try {
      const now = Date.now();
      const ref = doc(db, 'users', this.user.uid, 'saves', slotId);
      const tombstone = {
        slotId,
        deleted: true,
        deletedAt: now,
        updatedAt: now,
        savedAt: now,
        gameState: null
      };
      await this._withTimeout(setDoc(ref, tombstone), 22000, 'timeout');
      this.lastSyncSource = 'server';
      this.setSyncState('synced');
      return { ok: true, deletedAt: now, msg: `Slot ${slotId.replace('slot_', '')} telah dipadam dari pelayan Cloud.` };
    } catch (err) {
      const parsed = formatFirestoreError(err, 'unknown');
      const offline = isOfflineLikeError(err, parsed.code);
      console.error('[Firebase] deleteCloudSlot error:', parsed.code, err);
      this.setSyncState(offline ? 'offline' : 'error', parsed.code, parsed.reason);
      return {
        ok: false,
        offline,
        code: parsed.code,
        msg: `Gagal memadam slot di Cloud (${parsed.code}): ${parsed.reason}`
      };
    }
  }
};

if (auth) {
  // Proses hasil signInWithRedirect apabila halaman dimuatkan semula
  getRedirectResult(auth)
    .then((cred) => {
      if (cred && cred.user) {
        FirebaseService.user = cred.user;
        FirebaseService.lastAuthError = null;
        FirebaseService.lastSyncSource = null;
        FirebaseService.setSyncState('idle');
        FirebaseService._notifyAuthListeners();
        if (window.App && App.toast) {
          App.toast(`Berjaya log masuk sebagai ${cred.user.displayName || cred.user.email}!`, 'success');
        }
      }
    })
    .catch((err) => {
      const diag = buildAuthDiagnostic(err);
      FirebaseService.lastAuthError = diag;
      FirebaseService._notifyAuthListeners();
    });

  onAuthStateChanged(auth, (user) => {
    FirebaseService.user = user || null;
    if (user) {
      FirebaseService.lastAuthError = null;
      // Jangan tandakan 'synced' sebelum bacaan sebenar dari pelayan Firestore selesai
      if (FirebaseService.syncState !== 'syncing') {
        FirebaseService.setSyncState('idle');
      }
    } else {
      FirebaseService.lastSyncAt = null;
      FirebaseService.lastSyncSource = null;
      FirebaseService.lastPayloadBytes = 0;
      FirebaseService.setSyncState('idle');
    }
    FirebaseService._notifyAuthListeners();
  });
}

window.FirebaseService = FirebaseService;
export default FirebaseService;
