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
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc
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
  db = getFirestore(app);
  provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  initialized = true;
} catch (err) {
  console.warn('[Firebase] Gagal memulakan SDK (mod luar talian aktif):', err);
}

const SLOT_IDS = ['slot_1', 'slot_2', 'slot_3', 'slot_4', 'slot_5'];

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
  syncState: 'idle', // 'idle' | 'syncing' | 'synced' | 'error'
  lastSyncAt: null,
  lastAuthError: null,
  _authListeners: [],
  _syncListeners: [],

  isLoggedIn() {
    return Boolean(this.user && this.user.uid);
  },

  clearAuthError() {
    this.lastAuthError = null;
  },

  _notifyAuthListeners() {
    this._authListeners.forEach(fn => {
      try { fn(this.user, this.lastAuthError); } catch (e) {}
    });
  },

  setSyncState(state) {
    this.syncState = state;
    if (state === 'synced') this.lastSyncAt = Date.now();
    this._syncListeners.forEach(fn => {
      try { fn(this.syncState, this.lastSyncAt); } catch (e) {}
    });
  },

  onAuthChange(cb) {
    if (typeof cb === 'function') {
      this._authListeners.push(cb);
      try { cb(this.user, this.lastAuthError); } catch (e) {}
    }
  },

  onSyncStateChange(cb) {
    if (typeof cb === 'function') {
      this._syncListeners.push(cb);
      try { cb(this.syncState, this.lastSyncAt); } catch (e) {}
    }
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
      this.setSyncState('synced');
      this._notifyAuthListeners();
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
      this.setSyncState('idle');
      this._notifyAuthListeners();
      return { ok: true, msg: 'Anda telah log keluar daripada akaun Google.' };
    } catch (err) {
      return { ok: false, msg: 'Gagal log keluar. Sila cuba lagi.' };
    }
  },

  async listCloudSlots() {
    if (!db || !this.isLoggedIn()) return {};
    this.setSyncState('syncing');
    try {
      const colRef = collection(db, 'users', this.user.uid, 'saves');
      const snap = await getDocs(colRef);
      const map = {};
      snap.forEach(d => {
        if (SLOT_IDS.includes(d.id)) {
          map[d.id] = { ...d.data(), slotId: d.id };
        }
      });
      this.setSyncState('synced');
      return map;
    } catch (err) {
      this.setSyncState('error');
      return {};
    }
  },

  async getCloudSlot(slotId) {
    if (!db || !this.isLoggedIn() || !SLOT_IDS.includes(slotId)) return null;
    try {
      const ref = doc(db, 'users', this.user.uid, 'saves', slotId);
      const snap = await getDoc(ref);
      return snap.exists() ? { ...snap.data(), slotId } : null;
    } catch (err) {
      return null;
    }
  },

  async saveCloudSlot(slotId, payload) {
    if (!db || !this.isLoggedIn() || !SLOT_IDS.includes(slotId)) {
      return { ok: false, msg: 'Sila log masuk Google untuk menyimpan ke Cloud.' };
    }
    this.setSyncState('syncing');
    try {
      const cleanPayload = JSON.parse(JSON.stringify({
        ...payload,
        slotId,
        updatedAt: payload.updatedAt || Date.now()
      }));
      const ref = doc(db, 'users', this.user.uid, 'saves', slotId);
      await setDoc(ref, cleanPayload);
      this.setSyncState('synced');
      return { ok: true, msg: `Slot ${slotId.replace('slot_', '')} berjaya disimpan ke Cloud!` };
    } catch (err) {
      this.setSyncState('error');
      return { ok: false, msg: 'Gagal menyegerakkan simpanan ke Cloud.' };
    }
  },

  async deleteCloudSlot(slotId) {
    if (!db || !this.isLoggedIn() || !SLOT_IDS.includes(slotId)) {
      return { ok: false, msg: 'Tidak log masuk ke Cloud.' };
    }
    this.setSyncState('syncing');
    try {
      const ref = doc(db, 'users', this.user.uid, 'saves', slotId);
      await deleteDoc(ref);
      this.setSyncState('synced');
      return { ok: true, msg: `Slot ${slotId.replace('slot_', '')} telah dipadam dari Cloud.` };
    } catch (err) {
      this.setSyncState('error');
      return { ok: false, msg: 'Gagal memadam slot di Cloud.' };
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
        FirebaseService.setSyncState('synced');
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
    if (user) FirebaseService.lastAuthError = null;
    FirebaseService.setSyncState(user ? 'synced' : 'idle');
    FirebaseService._notifyAuthListeners();
  });
}

window.FirebaseService = FirebaseService;
export default FirebaseService;
