/* ==========================================================================
   WorldLife — Utility Helpers, Currency Engine & Cultural Name Generator
   ========================================================================== */

window.Utils = {
  randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  pick(arr) {
    if (!arr || !arr.length) return null;
    return arr[Math.floor(Math.random() * arr.length)];
  },

  chance(prob) {
    return Math.random() < prob;
  },

  clamp(val, min = 0, max = 100) {
    return Math.max(min, Math.min(max, Math.round(val)));
  },

  getCountry(countryId) {
    return window.COUNTRIES[countryId] || window.COUNTRIES.MY;
  },

  usdToLocal(usdAmount, countryId) {
    const c = this.getCountry(countryId);
    return Math.round(usdAmount * c.usdRate);
  },

  localToUsd(localAmount, countryId) {
    const c = this.getCountry(countryId);
    return localAmount / c.usdRate;
  },

  convertMoney(amount, fromCountryId, toCountryId) {
    if (fromCountryId === toCountryId) return Math.round(amount);
    const usd = this.localToUsd(amount, fromCountryId);
    return Math.round(this.usdToLocal(usd, toCountryId));
  },

  formatMoney(amount, countryId, compact = false) {
    const c = this.getCountry(countryId);
    const neg = amount < 0;
    const abs = Math.abs(Math.round(amount));
    let formatted;

    if (compact || abs >= 100000000) {
      if (abs >= 1e12) formatted = (abs / 1e12).toFixed(2).replace(/\.00$/, '') + 'T';
      else if (abs >= 1e9) formatted = (abs / 1e9).toFixed(2).replace(/\.00$/, '') + 'B';
      else if (abs >= 1e6) formatted = (abs / 1e6).toFixed(2).replace(/\.00$/, '') + 'M';
      else if (abs >= 1e4 && c.usdRate > 100) formatted = (abs / 1e3).toFixed(0) + 'K';
      else formatted = abs.toLocaleString('en-US');
    } else {
      formatted = abs.toLocaleString('en-US');
    }

    const rawSymbol = String((c.currency && c.currency.symbol) || '');
    const hasRtl = /[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/.test(rawSymbol);
    const safeSymbol = hasRtl ? `\u2068${rawSymbol}\u2069\u200E` : rawSymbol;
    return `\u2066${neg ? '-' : ''}${safeSymbol}${formatted}\u2069`;
  },

  formatUsdEquivalent(localAmount, countryId) {
    const c = this.getCountry(countryId);
    if (!c || (c.currency && c.currency.code === 'USD') || Number(c.usdRate) === 1) return null;
    const usdVal = this.localToUsd(Number(localAmount) || 0, countryId);
    const compact = Math.abs(usdVal) >= 1000000;
    return `≈ ${this.formatMoney(usdVal, 'US', compact)} USD`;
  },

  generateName(countryId, gender, heritageId = null) {
    const c = this.getCountry(countryId);
    const hKey = heritageId && c.names[heritageId] ? heritageId : Object.keys(c.names)[0];
    const pool = c.names[hKey];
    const first = this.pick(gender === 'female' ? pool.female : pool.male);
    const lastPool = (gender === 'female' && pool.lastFemale) ? pool.lastFemale : pool.last;
    const last = this.pick(lastPool);

    // Handle patronymic styles like Malay "Aiman bin Abdullah" or Indian-MY "Priya a/p Rajan"
    if (last.startsWith('bin ') || last.startsWith('binti ') || last.startsWith('binte ') || last.startsWith('a/l ') || last.startsWith('a/p ')) {
      return `${first} ${last}`;
    }
    return `${first} ${last}`;
  },

  extractGivenName(fullName) {
    if (!fullName || typeof fullName !== 'string') return '';
    const trimmed = fullName.trim();
    const patronymicSplit = trimmed.split(/\s+(?:bin|binti|binte|a\/l|a\/p)\s+/i);
    if (patronymicSplit.length > 1) {
      return patronymicSplit[0].trim();
    }
    return trimmed.split(/\s+/)[0].trim();
  },

  generateGivenName(countryId, gender, heritageId = null) {
    const c = this.getCountry(countryId);
    const hKey = heritageId && c.names[heritageId] ? heritageId : Object.keys(c.names)[0];
    const pool = c.names[hKey];
    return this.pick(gender === 'female' ? pool.female : pool.male);
  },

  generateChildName({ countryId, gender, heritageId = null, customGivenName = null }) {
    if (customGivenName && customGivenName.trim()) {
      return customGivenName.trim();
    }
    return this.generateName(countryId, gender, heritageId);
  },

  getAvatar(age, gender) {
    if (age <= 2) return '👶';
    if (age <= 12) return gender === 'female' ? '👧' : '👦';
    if (age <= 22) return gender === 'female' ? '👩' : '👨';
    if (age <= 58) return gender === 'female' ? '👩‍💼' : '👨‍💼';
    return gender === 'female' ? '👵' : '👴';
  },

  getStatColor(val) {
    if (val >= 70) return '#16a34a';
    if (val >= 40) return '#eab308';
    return '#dc2626';
  },

  escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  // --------------------------------------------------------------------------
  // PENGHAD KADAR (DEBOUNCE) BERKUNCI — untuk carian negara tanpa lag DOM
  // --------------------------------------------------------------------------
  _debounceTimers: {},
  debounceKey(key, fn, wait = 180) {
    if (this._debounceTimers[key]) clearTimeout(this._debounceTimers[key]);
    this._debounceTimers[key] = setTimeout(() => {
      delete this._debounceTimers[key];
      try { fn(); } catch (e) { if (window.console) console.error(e); }
    }, wait);
  },

  // --------------------------------------------------------------------------
  // KESAN BUNYI RINGAN (Web Audio API — 0 KB fail audio) + TOGOL SENYAP
  // --------------------------------------------------------------------------
  MUTE_KEY: 'worldlife_muted_v1',

  loadMutePref() {
    const v = window.SafeStorage ? SafeStorage.getRaw(this.MUTE_KEY) : null;
    window._wlMuted = v === '1';
    return window._wlMuted;
  },

  setMuted(muted) {
    window._wlMuted = !!muted;
    if (window.SafeStorage) SafeStorage.setJSON(this.MUTE_KEY, window._wlMuted ? '1' : '0');
    if (window._wlMuted && this._audioCtx && this._audioCtx.state === 'running' && this._audioCtx.suspend) {
      try { this._audioCtx.suspend(); } catch (e) {}
    }
    return window._wlMuted;
  },

  isMuted() {
    return !!window._wlMuted;
  },

  _lastToneAt: 0,

  // Jadual nada: [jenis gelombang, [frekuensi...], tempoh setiap nota (s), kelantangan]
  TONES: {
    tap:         ['sine', [660], 0.035, 0.025],
    click:       ['sine', [700], 0.03, 0.022],
    age:         ['sine', [520, 760], 0.06, 0.06],
    success:     ['triangle', [587, 880], 0.08, 0.06],
    culture:     ['triangle', [587, 880], 0.08, 0.06],
    error:       ['sawtooth', [220, 160], 0.07, 0.04],
    achievement: ['triangle', [523, 659, 784, 1047], 0.09, 0.06],
    siren:       ['square', [880, 620, 880, 620], 0.14, 0.03]
  },

  playTone(type = 'tap') {
    try {
      if (window._wlMuted) return;
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const def = this.TONES[type];
      if (!def) return;

      // Elak bunyi bertindih berlebihan (cth. klik berganda pantas)
      const nowMs = Date.now();
      if ((type === 'click' || type === 'tap') && nowMs - this._lastToneAt < 60) return;
      this._lastToneAt = nowMs;

      if (!this._audioCtx) this._audioCtx = new Ctx();
      const ctx = this._audioCtx;
      if (ctx.state === 'suspended' && ctx.resume) ctx.resume();

      const [wave, freqs, noteLen, vol] = def;
      const start = ctx.currentTime;
      const total = freqs.length * noteLen;

      // Satu osilator + satu gain sahaja setiap bunyi; nod diputuskan selepas tamat (tiada kebocoran memori)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = wave;
      osc.connect(gain);
      gain.connect(ctx.destination);

      freqs.forEach((f, i) => osc.frequency.setValueAtTime(f, start + i * noteLen));
      gain.gain.setValueAtTime(vol, start);
      gain.gain.setValueAtTime(vol, start + Math.max(0, total - noteLen * 0.6));
      gain.gain.exponentialRampToValueAtTime(0.0008, start + total);

      osc.onended = () => {
        try { osc.disconnect(); gain.disconnect(); } catch (e) {}
      };
      osc.start(start);
      osc.stop(start + total + 0.02);
    } catch (e) {}
  },

  renderFlagHtml(countryId, fallbackFlag = '') {
    const code = String(countryId || 'MY').trim().toLowerCase();
    const iso = code === 'uk' ? 'gb' : code;
    if (!/^[a-z]{2}$/.test(iso)) return this.escapeHtml(fallbackFlag || '🌍');
    const safeAlt = this.escapeHtml(iso.toUpperCase());
    return `<img class="flag-img" src="https://flagcdn.com/w40/${iso}.png" srcset="https://flagcdn.com/w80/${iso}.png 2x" alt="${safeAlt}" width="20" height="14" loading="lazy" decoding="async" onerror="this.style.display='none'" />`;
  }
};
