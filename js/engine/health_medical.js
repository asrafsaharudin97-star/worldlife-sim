/* ==========================================================================
   WorldLife — Enjin Kesihatan, Penyakit Rawak, Hospital/Klinik & Cuti Sakit (MC)
   Bahasa Melayu
   ========================================================================== */

window.HealthMedicalEngine = {
  MAX_MC_PER_YEAR: 4,

  ILLNESS_CATALOG: [
    // RINGAN
    { id: 'demam_panas', name: 'Demam Panas', severity: 'ringan', icon: '🤒' },
    { id: 'selesema_teruk', name: 'Selesema Teruk', severity: 'ringan', icon: '🤧' },
    { id: 'keracunan_makanan', name: 'Keracunan Makanan', severity: 'ringan', icon: '🤢' },
    { id: 'migrain_kronik', name: 'Migrain Kronik', severity: 'ringan', icon: '🤕' },
    { id: 'jangkitan_tekak', name: 'Jangkitan Tekak', severity: 'ringan', icon: '😷' },

    // SEDERHANA
    { id: 'demam_denggi', name: 'Demam Denggi', severity: 'sederhana', icon: '🦟' },
    { id: 'asma', name: 'Asma', severity: 'sederhana', icon: '😮‍💨' },
    { id: 'gastrik_teruk', name: 'Gastrik Teruk', severity: 'sederhana', icon: '😣' },
    { id: 'batu_karang', name: 'Batu Karang', severity: 'sederhana', icon: '🩺' },
    { id: 'tekanan_darah_tinggi', name: 'Tekanan Darah Tinggi', severity: 'sederhana', icon: '❤️‍🩹' },
    { id: 'burnout', name: 'Keletihan Melampau (Burnout)', severity: 'sederhana', icon: '😵' },

    // KRITIKAL
    { id: 'pneumonia', name: 'Radang Paru-paru (Pneumonia)', severity: 'kritikal', icon: '🫁' },
    { id: 'serangan_jantung', name: 'Serangan Jantung', severity: 'kritikal', icon: '💔' },
    { id: 'kegagalan_buah_pinggang', name: 'Kegagalan Buah Pinggang', severity: 'kritikal', icon: '🏥' },
    { id: 'kanser', name: 'Kanser', severity: 'kritikal', icon: '🎗️' }
  ],

  SEVERITY_META: {
    ringan: { label: 'Ringan', bg: '#fef9c3', color: '#854d0e', border: '#fde047' },
    sederhana: { label: 'Sederhana', bg: '#ffedd5', color: '#9a3412', border: '#fdba74' },
    kritikal: { label: 'Kritikal', bg: '#fee2e2', color: '#991b1b', border: '#fca5a5' }
  },

  ensureFields(s) {
    if (!s) return;
    if (!Array.isArray(s.illnesses)) s.illnesses = [];
    if (typeof s.mcCountThisYear !== 'number') s.mcCountThisYear = 0;
    if (typeof s.mcTotalInJob !== 'number') s.mcTotalInJob = 0;
    if (typeof s.mcWarnings !== 'number') s.mcWarnings = 0;
  },

  resetJobMcStats(s) {
    if (!s) return;
    s.mcTotalInJob = 0;
    s.mcWarnings = 0;
  },

  hasLegitimateJob(s) {
    if (!s) return false;
    if (s.prison && s.prison.inPrison) return false;
    const hasFullTime = Boolean(s.job && !s.job.isUnderground);
    const hasPartTime = Boolean(s.partTimeJob);
    return hasFullTime || hasPartTime;
  },

  tickYearlyHealth(s, c) {
    if (!s || !s.alive) return;
    this.ensureFields(s);

    // Tetapkan semula kaunter MC tahunan pada +Umur
    s.mcCountThisYear = 0;
    s.illnesses.forEach(ill => {
      ill.mcTakenThisYear = false;
    });

    // 1. Perkembangan penyakit sedia ada yang tidak dirawat
    const remaining = [];
    for (const ill of s.illnesses) {
      ill.yearsActive = (ill.yearsActive || 0) + 1;

      if (ill.severity === 'ringan') {
        if (ill.yearsActive >= 1 && Utils.chance(ill.yearsActive >= 2 ? 0.65 : 0.35)) {
          GameState.addJournalEntry(`🌿 ${ill.name} anda beransur pulih dengan sendirinya selepas berehat secukupnya.`, 'health');
          continue;
        }
        GameState.adjustStats({ health: -Utils.randInt(2, 4), happiness: -Utils.randInt(2, 4) });
      } else if (ill.severity === 'sederhana') {
        const extra = Math.min(6, ill.yearsActive * 2);
        GameState.adjustStats({ health: -(Utils.randInt(5, 8) + extra), happiness: -Utils.randInt(4, 7) });
        if (ill.yearsActive >= 2) {
          GameState.addJournalEntry(`⚠️ ${ill.name} yang tidak dirawat semakin memudaratkan kesihatan anda.`, 'warning');
        }
      } else {
        // Kritikal
        const extra = Math.min(12, ill.yearsActive * 4);
        GameState.adjustStats({ health: -(Utils.randInt(12, 18) + extra), happiness: -Utils.randInt(7, 12) });
        GameState.addJournalEntry(`🚨 ${ill.name} berada pada tahap kritikal dan menjejaskan kesihatan anda secara serius!`, 'warning');
      }
      remaining.push(ill);
    }
    s.illnesses = remaining;

    // 2. Peluang mendapat penyakit baharu (elakkan pendua & hadkan maks 3 penyakit serentak)
    if (s.age >= 2 && s.illnesses.length < 3) {
      const health = s.stats ? (s.stats.health ?? 70) : 70;
      const stress = (s.alignment && s.alignment.stress) || 0;
      const hq = (c && typeof c.healthcareQuality === 'number') ? c.healthcareQuality : 65;

      let chance = 0.08;
      if (health < 50) chance += 0.12;
      if (health < 30) chance += 0.10;
      if (stress > 70) chance += 0.09;
      if (s.age >= 55) chance += 0.08;
      if (s.age >= 70) chance += 0.10;
      if (hq < 50) chance += 0.06;
      if (s.prison && s.prison.inPrison) chance += 0.07;

      if (Utils.chance(Math.min(0.45, chance))) {
        let tier = 'ringan';
        const r = Math.random();
        const critWeight = (s.age >= 55 || health < 35 || stress > 85) ? 0.14 : (s.age >= 35 ? 0.05 : 0.015);
        const modWeight = (s.age >= 30 || health < 55 || stress > 65) ? 0.34 : 0.22;

        if (r < critWeight && s.age >= 18) {
          tier = 'kritikal';
        } else if (r < critWeight + modWeight && s.age >= 8) {
          tier = 'sederhana';
        }

        const activeIds = new Set(s.illnesses.map(x => x.id));
        const pool = this.ILLNESS_CATALOG.filter(x => x.severity === tier && !activeIds.has(x.id));
        if (pool.length > 0) {
          const picked = Utils.pick(pool);
          s.illnesses.push({
            id: picked.id,
            name: picked.name,
            severity: picked.severity,
            icon: picked.icon,
            yearsActive: 0,
            mcTakenThisYear: false
          });
          const sevLbl = this.SEVERITY_META[picked.severity].label;
          GameState.addJournalEntry(
            `${picked.icon} Anda disahkan menghidap ${picked.name} (${sevLbl}). Segera dapatkan rawatan di Hospital & Klinik.`,
            picked.severity === 'kritikal' ? 'warning' : 'health'
          );
        }
      }
    }
  },

  getTreatmentCost(s, tier) {
    if (!s) return { cost: 0, parentCovers: false };
    if (tier === 'prison') return { cost: 0, parentCovers: false };

    const parentCovers = s.age < 18 && window.GameState && GameState.hasLivingParent(s);
    if (parentCovers) return { cost: 0, parentCovers: true };

    const baseUsd = tier === 'private' ? 850 : tier === 'checkup' ? 95 : 140;
    return {
      cost: Utils.usdToLocal(baseUsd, s.countryId),
      parentCovers: false
    };
  },

  treatIllness(s, illnessId, tier) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureFields(s);
    const inPrison = Boolean(s.prison && s.prison.inPrison);
    if (inPrison && tier !== 'prison') {
      return { ok: false, msg: 'Anda hanya dibenarkan mendapatkan rawatan asas di Klinik Penjara semasa dalam tahanan.' };
    }

    const idx = s.illnesses.findIndex(x => x.id === illnessId);
    if (idx === -1) return { ok: false, msg: 'Penyakit tersebut telah pun sembuh.' };
    const ill = s.illnesses[idx];

    const { cost, parentCovers } = this.getTreatmentCost(s, tier);
    if (!parentCovers && cost > 0 && s.money < cost) {
      return { ok: false, msg: `Baki tidak mencukupi — perlukan ${Utils.formatMoney(cost, s.countryId)}.` };
    }

    if (!parentCovers && cost > 0) s.money -= cost;

    // Kadar kesembuhan tersembunyi (tiada % pada UI)
    let cureChance = 0.75;
    if (tier === 'prison') {
      cureChance = ill.severity === 'ringan' ? 0.55 : ill.severity === 'sederhana' ? 0.25 : 0.08;
    } else if (tier === 'public') {
      cureChance = ill.severity === 'ringan' ? 0.85 : ill.severity === 'sederhana' ? 0.55 : 0.28;
    } else if (tier === 'private') {
      cureChance = ill.severity === 'ringan' ? 0.96 : ill.severity === 'sederhana' ? 0.85 : 0.65;
    }

    const facilityName = tier === 'prison'
      ? 'Klinik Penjara'
      : tier === 'private'
        ? 'Hospital Pakar Swasta'
        : 'Klinik / Hospital Kerajaan';

    if (Utils.chance(cureChance)) {
      s.illnesses.splice(idx, 1);
      const hGain = ill.severity === 'kritikal' ? 14 : ill.severity === 'sederhana' ? 9 : 5;
      GameState.adjustStats({ health: hGain, happiness: 5 });
      GameState.addJournalEntry(
        `🏥 Rawatan di ${facilityName} berjaya menyembuhkan ${ill.name} anda sepenuhnya!`,
        'health'
      );
      GameState.save();
      return { ok: true, cured: true, msg: `Syukur! Rawatan di ${facilityName} berjaya menyembuhkan ${ill.name} anda.` };
    }

    // Tidak sembuh sepenuhnya — masih perlukan rawatan susulan
    GameState.adjustStats({ health: tier === 'prison' ? 1 : 3 });
    GameState.addJournalEntry(
      `🩺 Anda menerima rawatan untuk ${ill.name} di ${facilityName}, namun doktor memaklumkan anda masih memerlukan rawatan susulan.`,
      'health'
    );
    GameState.save();
    return { ok: true, cured: false, msg: `Keadaan ${ill.name} sedikit lega, tetapi masih belum sembuh sepenuhnya dan memerlukan rawatan susulan.` };
  },

  doHealthCheckup(s) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    if (s.yearlyActions && s.yearlyActions.healthCheckup) {
      return { ok: false, msg: 'Anda sudah menjalani pemeriksaan kesihatan tahun ini.' };
    }
    const inPrison = Boolean(s.prison && s.prison.inPrison);
    const { cost, parentCovers } = this.getTreatmentCost(s, inPrison ? 'prison' : 'checkup');
    if (!parentCovers && cost > 0 && s.money < cost) {
      return { ok: false, msg: `Baki tidak mencukupi — perlukan ${Utils.formatMoney(cost, s.countryId)}.` };
    }
    if (!parentCovers && cost > 0) s.money -= cost;

    if (!s.yearlyActions) s.yearlyActions = {};
    s.yearlyActions.healthCheckup = true;
    GameState.adjustStats({ health: inPrison ? 3 : 6, happiness: 2 });
    GameState.addJournalEntry(
      inPrison
        ? '🏥 Anda menjalani pemeriksaan kesihatan asas di Klinik Penjara.'
        : '🩺 Anda menjalani pemeriksaan kesihatan berkala di klinik dan mendapat nasihat pemakanan serta gaya hidup sihat.',
      'health'
    );
    GameState.save();
    return { ok: true, msg: 'Pemeriksaan kesihatan selesai! Tahap kesihatan anda bertambah baik.' };
  },

  requestMedicalLeave(s) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureFields(s);

    if (s.prison && s.prison.inPrison) {
      return { ok: false, msg: 'Cuti sakit (MC) tidak terpakai semasa berada di dalam tahanan.' };
    }
    if (!this.hasLegitimateJob(s)) {
      return { ok: false, msg: 'Anda memerlukan pekerjaan sah untuk memohon Sijil Cuti Sakit (MC).' };
    }
    if (s.illnesses.length === 0) {
      return { ok: false, msg: 'Anda sedang sihat dan tidak memerlukan Sijil Cuti Sakit (MC).' };
    }
    if (s.mcCountThisYear >= this.MAX_MC_PER_YEAR) {
      return { ok: false, msg: 'Had permohonan Sijil Cuti Sakit (MC) bagi tahun ini telah tamat.' };
    }

    s.mcCountThisYear += 1;
    s.mcTotalInJob += 1;
    s.illnesses.forEach(ill => { ill.mcTakenThisYear = true; });

    // Kesan positif rehat MC
    GameState.adjustStats({ health: Utils.randInt(3, 6), happiness: 2 });
    if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: -Utils.randInt(8, 14) });

    const jobTitle = (s.job && !s.job.isUnderground) ? s.job.title : (s.partTimeJob ? s.partTimeJob.title : 'Pekerjaan');

    // Risiko dibuang kerja jika MC berlebihan
    let fired = false;
    if (s.mcCountThisYear >= 4 || s.mcWarnings >= 2) {
      fired = Utils.chance(0.75);
    } else if (s.mcCountThisYear === 3 || s.mcTotalInJob >= 5) {
      s.mcWarnings += 1;
      if (!s.yearlyActions) s.yearlyActions = {};
      s.yearlyActions.askedRaise = true;
      if (s.job && typeof s.job.performance === 'number') {
        s.job.performance = Utils.clamp(s.job.performance - 12, 0, 100);
      }
      fired = Utils.chance(0.30);
    }

    if (fired) {
      if (s.job && !s.job.isUnderground) {
        if (!Array.isArray(s.careerHistory)) s.careerHistory = [];
        s.careerHistory.push({
          title: s.job.title,
          years: s.job.years || 0,
          salary: s.job.salary || 0,
          endedReason: 'Diberhentikan (MC Berlebihan)'
        });
        s.job = null;
      } else if (s.partTimeJob) {
        s.partTimeJob = null;
      }
      this.resetJobMcStats(s);
      GameState.adjustStats({ happiness: -16 });
      if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: 18 });
      const dismissMsg = 'Anda telah diberhentikan kerja oleh majikan kerana terlalu kerap mengambil cuti sakit (MC) sehingga menjejaskan prestasi syarikat.';
      GameState.addJournalEntry(`📄🚨 DIBERHENTIKAN KERJA (${jobTitle}): ${dismissMsg}`, 'warning');
      GameState.save();
      return { ok: false, fired: true, msg: dismissMsg };
    }

    if (s.mcCountThisYear === 3 || s.mcTotalInJob >= 5) {
      const warnMsg = `Sijil Cuti Sakit (MC ke-${s.mcCountThisYear} tahun ini) diluluskan, namun HR mengeluarkan Surat Amaran kerana rekod kehadiran anda semakin merosot.`;
      GameState.addJournalEntry(`📄⚠️ SURAT AMARAN HR (${jobTitle}): ${warnMsg}`, 'warning');
      GameState.save();
      return { ok: true, warning: true, msg: warnMsg };
    }

    const okMsg = `Sijil Cuti Sakit (MC ke-${s.mcCountThisYear} tahun ini) diterima oleh pihak HR. Anda mendapat masa rehat yang diperlukan.`;
    GameState.addJournalEntry(`📄 Anda mengambil Sijil Cuti Sakit (MC) daripada tugas sebagai ${jobTitle} untuk berehat dan memulihkan kesihatan.`, 'health');
    GameState.save();
    return { ok: true, msg: okMsg };
  }
};
