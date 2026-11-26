/* ==========================================================================
   WorldLife — Servis Dialog AI Dinamik (Cloudflare Worker, Non-Blocking)
   Bahasa Melayu
   ========================================================================== */

window.AINarrator = {
  ENDPOINT: 'https://worldlife-ai.asraf-saharudin97.workers.dev/',
  STORAGE_KEY: 'wl_ai_enabled',
  COOLDOWN_MS: 2500,
  TIMEOUT_MS: 4500,
  _lastCallTime: 0,

  isEnabled() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw === null) return true;
      return raw !== 'false' && raw !== '0';
    } catch (e) {
      return true;
    }
  },

  setEnabled(val) {
    const next = Boolean(val);
    try {
      localStorage.setItem(this.STORAGE_KEY, next ? 'true' : 'false');
    } catch (e) {}
    return next;
  },

  _band(val) {
    const n = Number(val) || 0;
    if (n < 35) return 'rendah';
    if (n < 70) return 'sederhana';
    return 'tinggi';
  },

  _stripHtml(str) {
    return String(str || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  },

  buildSummary(s, latestYearLogs = []) {
    if (!s) return {};
    const c = (window.Utils && Utils.getCountry) ? Utils.getCountry(s.countryId) : { name: s.countryId || 'Dunia' };

    let kerja = 'Tiada kerja';
    if (s.job && s.job.title) {
      kerja = s.job.isUnderground ? `${s.job.title} (Bawah Tanah)` : s.job.title;
    } else if (s.partTimeJob && s.partTimeJob.title) {
      kerja = `${s.partTimeJob.title} (Sambilan)`;
    }

    let pendidikan = 'Tiada';
    if (s.education) {
      if (s.education.activeStudy && s.education.activeStudy.title) {
        pendidikan = s.education.activeStudy.title;
      } else if (s.education.schoolName) {
        pendidikan = s.education.schoolName;
      } else if (s.education.stage && s.education.stage !== 'none' && s.education.stage !== 'done') {
        pendidikan = s.education.stage;
      }
    }

    const rels = Array.isArray(s.relationships) ? s.relationships.filter(r => r && r.alive !== false) : [];
    const partner = s.partnerId ? rels.find(r => r.id === s.partnerId) : null;
    const pasangan = partner ? `${partner.name} (${partner.role || 'Pasangan'})` : 'Tiada';
    const bilanganKeluarga = rels.filter(r => r.category === 'family' || r.category === 'spouse').length;

    const illnesses = Array.isArray(s.illnesses) ? s.illnesses.map(i => i && i.name).filter(Boolean) : [];
    const loans = Array.isArray(s.loans) ? s.loans : [];
    const hutangAhLong = loans.some(l => l && l.lenderType === 'ahlong');
    const adaPinjamanBank = loans.some(l => l && l.lenderType === 'bank');

    const stats = s.stats || {};
    const stress = (s.alignment && s.alignment.stress) || 0;

    const cleanLogs = (Array.isArray(latestYearLogs) ? latestYearLogs : [])
      .map(entry => this._stripHtml(typeof entry === 'string' ? entry : (entry && entry.text) || ''))
      .filter(Boolean)
      .slice(-3);

    return {
      nama: String(s.name || 'Watak').slice(0, 60),
      umur: Number(s.age) || 0,
      generasi: Number(s.generation) || 1,
      negara: String(c.name || s.countryId || 'Dunia').slice(0, 50),
      bandar: String(s.city || '').slice(0, 50),
      kerja: String(kerja).slice(0, 70),
      pendidikan: String(pendidikan).slice(0, 70),
      penjara: {
        inPrison: Boolean(s.prison && s.prison.inPrison),
        deathRow: Boolean(s.prison && s.prison.deathRow)
      },
      buruan: Boolean(s.fugitive && s.fugitive.isFugitive),
      sakit: illnesses.slice(0, 3),
      hutangAhLong,
      adaPinjamanBank,
      pasangan: String(pasangan).slice(0, 70),
      bilanganKeluarga,
      suasana: {
        kesihatan: this._band(stats.health ?? 70),
        kebahagiaan: this._band(stats.happiness ?? 70),
        stres: this._band(stress)
      },
      logTerkini: cleanLogs
    };
  },

  async generateDialogue(s, latestYearLogs = []) {
    try {
      if (!this.isEnabled()) return null;
      if (!s || !s.alive || (Number(s.age) || 0) < 5) return null;

      const now = Date.now();
      if (now - this._lastCallTime < this.COOLDOWN_MS) return null;
      this._lastCallTime = now;

      const payload = this.buildSummary(s, latestYearLogs);
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timer = controller ? setTimeout(() => controller.abort(), this.TIMEOUT_MS) : null;

      try {
        const resp = await fetch(this.ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller ? controller.signal : undefined
        });
        if (timer) clearTimeout(timer);
        if (!resp || !resp.ok) return null;

        const parsed = await resp.json();
        if (!parsed || typeof parsed.dialog !== 'string') return null;

        const cleanDialog = this._stripHtml(parsed.dialog).replace(/^["“]+|["”]+$/g, '').trim().slice(0, 240);
        if (!cleanDialog) return null;

        const cleanSpeaker = this._stripHtml(parsed.penutur || 'Seseorang').slice(0, 50) || 'Seseorang';
        return {
          penutur: cleanSpeaker,
          dialog: cleanDialog
        };
      } catch (fetchErr) {
        if (timer) clearTimeout(timer);
        return null;
      }
    } catch (err) {
      return null;
    }
  }
};
