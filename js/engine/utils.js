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
      if (abs >= 1e9) formatted = (abs / 1e9).toFixed(2).replace(/\.00$/, '') + 'B';
      else if (abs >= 1e6) formatted = (abs / 1e6).toFixed(2).replace(/\.00$/, '') + 'M';
      else if (abs >= 1e4 && c.usdRate > 100) formatted = (abs / 1e3).toFixed(0) + 'K';
      else formatted = abs.toLocaleString('en-US');
    } else {
      formatted = abs.toLocaleString('en-US');
    }

    return `${neg ? '-' : ''}${c.currency.symbol}${formatted}`;
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

  formatIslamicName(givenName, gender, fatherFullName, { isAdopted = false, isOutOfWedlock = false } = {}) {
    const connector = gender === 'female' ? 'binti' : 'bin';
    const cleanGiven = this.extractGivenName(givenName) || 'Ahmad';
    if (isAdopted || isOutOfWedlock || !fatherFullName) {
      return `${cleanGiven} ${connector} Abdullah`;
    }
    const fatherGiven = this.extractGivenName(fatherFullName) || 'Abdullah';
    return `${cleanGiven} ${connector} ${fatherGiven}`;
  },

  generateChildName({ countryId, gender, heritageId = null, belief = 'unassigned', fatherFullName = null, isAdopted = false, isOutOfWedlock = false, customGivenName = null }) {
    if (belief === 'islam') {
      const trimmedCustom = customGivenName && customGivenName.trim();
      if (trimmedCustom && /\s+(?:bin|binti|binte)\s+/i.test(trimmedCustom)) {
        return trimmedCustom;
      }
      const given = trimmedCustom || this.generateGivenName(countryId, gender, heritageId);
      return this.formatIslamicName(given, gender, fatherFullName, { isAdopted, isOutOfWedlock });
    }
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

  playTone(type = 'tap') {
    try {
      if (window._wlMuted) return;
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!this._audioCtx) this._audioCtx = new Ctx();
      const ctx = this._audioCtx;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'age') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(760, now + 0.08);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
        osc.start(now);
        osc.stop(now + 0.11);
      } else if (type === 'success' || type === 'culture') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587, now);
        osc.frequency.setValueAtTime(880, now + 0.07);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(160, now + 0.12);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.start(now);
        osc.stop(now + 0.14);
      }
    } catch (e) {}
  }
};
