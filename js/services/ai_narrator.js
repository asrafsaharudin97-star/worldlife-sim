/* ==========================================================================
   WorldLife — Servis Dialog AI Dinamik (Cloudflare Worker, Non-Blocking)
   Bahasa Melayu — Anti-Halusinasi Keluarga, Anti-Pengulangan & Sudut Sinematik
   ========================================================================== */

window.AINarrator = {
  ENDPOINT: 'https://worldlife-ai.asraf-saharudin97.workers.dev/',
  STORAGE_KEY: 'wl_ai_enabled',
  COOLDOWN_MS: 2500,
  TIMEOUT_MS: 4500,
  _lastCallTime: 0,
  _recentAiHistory: [],
  _lastSceneAngle: null,

  isEnabled() {
    // AI Dinamik (+Umur) sentiasa aktif secara kekal walaupun terdapat rekod lama 'false' dalam localStorage
    return true;
  },

  setEnabled() {
    return true;
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

  _getWealthTier(s) {
    const nw = (window.GameState && GameState.getNetWorth) ? GameState.getNetWorth(s) : (s.money || 0);
    const usd = (window.Utils && Utils.localToUsd) ? Utils.localToUsd(nw, s.countryId) : (nw / 4.5);
    if (usd >= 1000000000) return 'bilionair';
    if (usd >= 1000000) return 'kaya';
    if (usd >= 25000) return 'sederhana';
    return 'miskin';
  },

  _extractLivingFamily(s) {
    const rels = Array.isArray(s.relationships)
      ? s.relationships.filter(r => r && r.alive !== false && !r.isDead && !r.deceased)
      : [];

    const parentRoleRe = /^(ibu|bapa|ayah|mak|mother|father|ibu tiri|bapa tiri|ibu angkat|bapa angkat)$/i;
    const childRoleRe = /^(anak|anak lelaki|anak perempuan|son|daughter|anak angkat)$/i;
    const siblingRoleRe = /^(abang|kakak|adik|adik lelaki|adik perempuan|brother|sister)$/i;

    const livingParents = rels
      .filter(r => parentRoleRe.test(String(r.role || '').trim()))
      .map(r => `${r.role}: ${r.name}`);

    const partner = s.partnerId ? rels.find(r => r.id === s.partnerId) : null;
    const livingSpouse = (s.married && partner) ? partner.name : null;
    const livingPartner = partner ? `${partner.name} (${partner.role || 'Pasangan'})` : null;

    const livingChildren = rels
      .filter(r => childRoleRe.test(String(r.role || '').trim()))
      .slice(0, 3)
      .map(r => r.name);

    const livingSiblings = rels
      .filter(r => siblingRoleRe.test(String(r.role || '').trim()))
      .slice(0, 2)
      .map(r => r.name);

    const hasLivingFamily = livingParents.length > 0 || Boolean(livingSpouse) || livingChildren.length > 0 || livingSiblings.length > 0;

    return {
      livingParents,
      livingSpouse,
      livingPartner,
      livingChildren,
      livingSiblings,
      hasLivingFamily,
      totalLivingFamily: rels.filter(r => r.category === 'family' || r.category === 'spouse').length
    };
  },

  _pickSceneAngle(ctx) {
    let pool = [];
    if (ctx.isInPrison) {
      pool = [
        'Suasana sunyi dan bunyi besi sel penjara pada waktu malam',
        'Perbualan pendek dan berhati-hati dengan banduan lain di halaman penjara',
        'Monolog dalaman menghitung hari bebas dan kesilapan silam',
        'Drama kecil di dewan makan penjara atau pemeriksaan mengejut warden'
      ];
    } else if (ctx.age <= 12) {
      pool = [
        'Gelagat lucu rakan sekelas dan suasana rehat di sekolah',
        'Rasa ingin tahu kanak-kanak meneroka lorong kejiranan atau taman permainan',
        'Mimpi besar zaman kecil yang polos tetapi mencuit hati',
        'Kejadian kecil di kedai runcit atau pasar tempatan bersama kawan'
      ];
      if (ctx.hasLivingFamily) {
        pool.push('Momen ringkas dan hangat bersama ahli keluarga yang masih hidup');
      }
    } else {
      pool = [
        'Suasana, bunyi, dan budaya harian bandar serta negara tempat tinggal semasa',
        'Drama kecil atau gosip halus di tempat kerja atau kampus',
        'Pertemuan singkat yang pelik atau bermakna dengan pemandu teksi atau jiran',
        'Perbualan spontan dengan pelanggan, barista, atau pengembara asing',
        'Monolog dalaman tentang perjalanan hidup, penyesalan kecil, atau cita-cita terpendam',
        'Sindiran halus dan humor kering berkaitan taraf kewangan semasa',
        'Kejadian kecil luar jangka di kafe, pasar malam, atau pengangkutan awam',
        'Khabar angin dunia, trend media sosial, atau perubahan wajah kejiranan',
        'Detik refleksi sunyi melihat langit petang atau hujan di tingkap',
        'Pemerhatian tajam terhadap ragam manusia di pusat bandar',
        'Cabaran kecil rutin harian yang tiba-tiba mencuit hati',
        'Perasaan bangga atau letih yang jujur terhadap fasa hidup sekarang',
        'Bau makanan tempatan dan hiruk-pikuk jalanan yang membangkitkan nostalgia',
        'Khabar tentang kejayaan atau kejatuhan kenalan lama dari jauh'
      ];
      if (ctx.hasLivingFamily) {
        pool.push('Momen spontan bersama ahli keluarga atau pasangan yang masih hidup');
      }
      if (ctx.isRoyal) {
        pool.push('Suasana protokol istana dan pandangan rakyat di luar pagar diraja');
      }
      if (ctx.isFamous) {
        pool.push('Reaksi peminat yang mengejutkan di tempat awam dan tekanan populariti');
      }
      if (ctx.hasOffshoreTrust) {
        pool.push('Bisikan tenang tentang percaturan kewangan antarabangsa dan rahsia kekayaan');
      }
    }

    const filtered = pool.length > 1
      ? pool.filter(a => a !== this._lastSceneAngle)
      : pool;
    const chosen = filtered[Math.floor(Math.random() * filtered.length)] || pool[0];
    this._lastSceneAngle = chosen;
    return chosen;
  },

  _isHallucinatedDeadParent(speaker, dialog, livingParents) {
    if (Array.isArray(livingParents) && livingParents.length > 0) return false;
    const spk = String(speaker || '');
    const dlg = String(dialog || '');
    const parentWord = /\b(ayah|ibu|mak|bapa|abah|mama|papa)\b/i;
    if (parentWord.test(spk)) return true;
    if (/\b(ayah|ibu|mak|bapa|abah|mama|papa)\s*:/i.test(dlg)) return true;
    if (/(ajak|makan bersama|masak|telefon|pesan|kata|tanya|senyum|peluk|pulang ke rumah).{0,25}\b(ayah|ibu|mak|bapa|abah)\b/i.test(dlg)) return true;
    if (/\b(ayah|ibu|mak|bapa|abah)\b.{0,25}(ajak|masak|telefon|pesan|kata|tanya|senyum|peluk|menunggu di rumah)/i.test(dlg)) return true;
    return false;
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

    const fam = this._extractLivingFamily(s);
    const illnesses = Array.isArray(s.illnesses) ? s.illnesses.map(i => i && i.name).filter(Boolean) : [];
    const loans = Array.isArray(s.loans) ? s.loans : [];
    const hutangAhLong = loans.some(l => l && l.lenderType === 'ahlong');
    const adaPinjamanBank = loans.some(l => l && l.lenderType === 'bank');

    const stats = s.stats || {};
    const stress = (s.alignment && s.alignment.stress) || 0;
    const isInPrison = Boolean(s.prison && s.prison.inPrison);
    const isSick = illnesses.length > 0;
    const isRoyal = Boolean(s.activeSpecialMode && s.activeSpecialMode.modeId === 'royalty');
    const isFamous = ((s.alignment && s.alignment.fame) || 0) >= 65 || Boolean(s.activeSpecialMode && s.activeSpecialMode.modeId === 'celebrity');
    const isMafia = Boolean(s.activeSpecialMode && s.activeSpecialMode.modeId === 'mafia');
    const hasOffshoreTrust = Boolean(window.LegalInheritanceEngine && LegalInheritanceEngine.isTrustOffshore && LegalInheritanceEngine.isTrustOffshore(s));
    const wealthTier = this._getWealthTier(s);

    const sceneAngle = this._pickSceneAngle({
      age: Number(s.age) || 0,
      isInPrison,
      hasLivingFamily: fam.hasLivingFamily,
      isRoyal,
      isFamous,
      hasOffshoreTrust
    });

    const cleanLogs = (Array.isArray(latestYearLogs) ? latestYearLogs : [])
      .map(entry => this._stripHtml(typeof entry === 'string' ? entry : (entry && entry.text) || ''))
      .filter(Boolean)
      .slice(-3);

    const systemPrompt = [
      'Anda ialah pencerita kreatif permainan simulasi kehidupan WorldLife dalam Bahasa Melayu semula jadi (bebas unsur agama).',
      'PERATURAN KELUARGA MUTLAK: HANYA dibenarkan menyebut ahli keluarga yang disenaraikan dalam livingFamily. Jika livingParents kosong, DILARANG KERAS menyebut, memunculkan, atau menulis dialog Ibu, Ayah, Mak, atau Bapa.',
      'GAYA HIDUP & SINEMATIK: Tulis 1–2 ayat padat dan hidup (show, don\'t tell: suasana, bunyi, reaksi spontan, humor halus atau emosi jujur) berpandukan sceneAngle.',
      'LARANGAN KLISE & SKRIP KAKU: DILARANG menulis format skrip seperti "Ayah: ..." atau "Kawan: ...". DILARANG memulakan ayat dengan "Pada tahun ini", "Suatu hari", "Tiba-tiba", atau "Anda berasa".',
      'LARANGAN ULANG: Bandingkan dengan recentLines dan pastikan topik, struktur ayat, serta pembuka ayat 100% berbeza.'
    ].join(' ');

    return {
      nama: String(s.name || 'Watak').slice(0, 60),
      umur: Number(s.age) || 0,
      generasi: Number(s.generation) || 1,
      negara: String(c.name || s.countryId || 'Dunia').slice(0, 50),
      bandar: String(s.city || '').slice(0, 50),
      kerja: String(kerja).slice(0, 70),
      pendidikan: String(pendidikan).slice(0, 70),
      wealthTier,
      stressLevel: this._band(stress),
      statusAktif: {
        isInPrison,
        isSick,
        isRoyal,
        isFamous,
        isMafia,
        hasOffshoreTrust
      },
      livingFamily: {
        livingParents: fam.livingParents,
        livingSpouse: fam.livingSpouse,
        livingChildren: fam.livingChildren,
        livingSiblings: fam.livingSiblings
      },
      sceneAngle,
      recentLines: this._recentAiHistory.slice(-5),
      systemPrompt,
      generationConfig: {
        temperature: 0.9,
        topP: 0.92
      },
      // Medan serasi ke belakang untuk Worker sedia ada
      penjara: {
        inPrison: isInPrison,
        deathRow: Boolean(s.prison && s.prison.deathRow)
      },
      buruan: Boolean(s.fugitive && s.fugitive.isFugitive),
      sakit: illnesses.slice(0, 3),
      hutangAhLong,
      adaPinjamanBank,
      pasangan: String(fam.livingPartner || 'Tiada').slice(0, 70),
      bilanganKeluarga: fam.totalLivingFamily,
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

        const cleanSpeaker = this._stripHtml(parsed.penutur || 'Pencerita').slice(0, 50) || 'Pencerita';

        // Penapis keselamatan frontend: sekat halusinasi ibu/ayah jika livingParents kosong
        const livingParents = (payload.livingFamily && payload.livingFamily.livingParents) || [];
        if (this._isHallucinatedDeadParent(cleanSpeaker, cleanDialog, livingParents)) {
          return null;
        }

        // Simpan dalam memori sesi (maks 5 baris terakhir, tidak disimpan ke Firestore)
        this._recentAiHistory.push(cleanDialog);
        if (this._recentAiHistory.length > 5) {
          this._recentAiHistory = this._recentAiHistory.slice(-5);
        }

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
