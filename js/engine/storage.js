/* ==========================================================================
   WorldLife — Penyimpanan Selamat (localStorage) dengan Perlindungan Kuota
   - Semua getItem/setItem dibalut try/catch
   - Jika QuotaExceededError berlaku, log kehidupan lama yang tidak penting
     dipangkas secara berperingkat dan simpanan dicuba semula tanpa crash
   ========================================================================== */

window.SafeStorage = {
  // Peringkat pemangkasan kecemasan (dipanggil mengikut turutan sehingga simpanan berjaya)
  _trimmers: [],

  registerTrimmer(fn) {
    if (typeof fn === 'function') this._trimmers.push(fn);
  },

  isQuotaError(e) {
    if (!e) return false;
    return e.name === 'QuotaExceededError'
      || e.name === 'NS_ERROR_DOM_QUOTA_REACHED'
      || e.code === 22
      || e.code === 1014;
  },

  getRaw(key) {
    try {
      return window.localStorage ? localStorage.getItem(key) : null;
    } catch (e) {
      return null;
    }
  },

  getJSON(key, fallback = null) {
    const raw = this.getRaw(key);
    if (raw == null) return fallback;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  },

  remove(key) {
    try {
      if (window.localStorage) localStorage.removeItem(key);
    } catch (e) {}
  },

  /**
   * Simpan nilai (objek akan di-JSON-kan). `rebuild` ialah fungsi pilihan yang
   * menjana semula nilai selepas pemangkasan (supaya data dipangkas turut disimpan).
   * Pulangkan true jika berjaya.
   */
  setJSON(key, value, rebuild) {
    let payload;
    try {
      payload = typeof value === 'string' ? value : JSON.stringify(value);
    } catch (e) {
      return false;
    }
    if (this._trySet(key, payload) === true) return true;

    // Kuota penuh — pangkas log lama secara berperingkat & cuba lagi
    for (let level = 0; level < this._trimmers.length; level++) {
      try {
        this._trimmers[level](level);
      } catch (e) {}
      try {
        const next = rebuild ? rebuild() : value;
        payload = typeof next === 'string' ? next : JSON.stringify(next);
      } catch (e) {
        continue;
      }
      if (this._trySet(key, payload) === true) return true;
    }
    return false;
  },

  _trySet(key, payload) {
    try {
      if (!window.localStorage) return false;
      localStorage.setItem(key, payload);
      return true;
    } catch (e) {
      return this.isQuotaError(e) ? 'quota' : false;
    }
  },

  // Anggaran saiz (bait) simpanan WorldLife — berguna untuk ujian & diagnostik
  estimateUsageBytes() {
    let total = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.indexOf('worldlife_') === 0) {
          total += (k.length + (localStorage.getItem(k) || '').length) * 2;
        }
      }
    } catch (e) {}
    return total;
  }
};
