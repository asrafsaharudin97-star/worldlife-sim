/* ==========================================================================
   WorldLife — Sistem Keselamatan Diri, Ancaman Dendam, Bodyguard,
   Seni Pertahankan Diri, Siasatan & Laporan Polis
   ========================================================================== */

window.SecurityThreats = {
  COMPLEXITY_CLUES: {
    low: 2,
    medium: 3,
    high: 4
  },

  COMPLEXITY_LABELS: {
    low: 'Rendah',
    medium: 'Sederhana',
    high: 'Tinggi'
  },

  STATUS_LABELS: {
    vague: 'Samar',
    suspicious: 'Mencurigakan',
    strong: 'Bukti Kukuh'
  },

  BODYGUARD_CONTRACTS: [
    { years: 5, annualFeeUsd: 16000, label: '5 Tahun' }
  ],

  SUBTLE_CLUES: [
    'Anda perasan barang peribadi di rumah kelihatan sedikit beralih daripada kedudukan asal.',
    'Panggilan misteri tanpa suara masuk ke telefon anda lewat malam sebelum terus terputus.',
    'Seseorang kelihatan memerhati pergerakan kereta anda dari seberang jalan.',
    'Mesej tanpa pengirim mengandungi sindiran tajam tentang masa lalu anda.',
    'Jiran memaklumkan ada individu tidak dikenali bertanyakan jadual keluar masuk rumah anda.',
    'Kunci pintu pagar kelihatan mempunyai kesan calar baharu yang mencurigakan.'
  ],

  ensureFields(s) {
    if (!s) return;
    if (!Array.isArray(s.threats)) s.threats = [];
    if (!('bodyguard' in s)) s.bodyguard = null;
    if (typeof s.martialArtsLevel !== 'number' || Number.isNaN(s.martialArtsLevel)) s.martialArtsLevel = 0;
    s.martialArtsLevel = Utils.clamp(Math.floor(s.martialArtsLevel), 0, 5);
  },

  registerThreat(s, { targetId = null, targetName, relationType = 'Kenalan', motive = 'Dendam peribadi', complexity = 'medium' }) {
    if (!s || !targetName) return null;
    this.ensureFields(s);
    const exists = s.threats.some(t => t && !t.resolved && ((targetId && t.targetId === targetId) || t.targetName === targetName));
    if (exists) return null;
    const comp = ['low', 'medium', 'high'].includes(complexity) ? complexity : 'medium';
    const req = this.COMPLEXITY_CLUES[comp];
    const threat = {
      id: `thr_${Date.now()}_${Utils.randInt(10, 99)}`,
      targetId,
      targetName: String(targetName),
      relationType: String(relationType),
      motive: String(motive),
      complexity: comp,
      cluesFound: 0,
      cluesRequired: req,
      status: 'vague',
      cluesLog: [],
      resolved: false
    };
    s.threats.push(threat);
    return threat;
  },

  disownChild(s, childId) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureFields(s);
    const child = (s.relationships || []).find(r => r && r.id === childId && r.alive !== false);
    if (!child) return { ok: false, msg: 'Profil anak tidak ditemui.' };
    if (child.disowned) return { ok: false, msg: `${child.name} sudah pun dibuang daripada senarai keluarga.` };

    child.disowned = true;
    child.closeness = 0;
    child.trust = 0;
    child.role = 'Anak (Dibuang)';

    this.registerThreat(s, {
      targetId: child.id,
      targetName: child.name,
      relationType: 'Bekas Anak',
      motive: 'Dendam selepas dibuang keluarga dan digugurkan hak warisan',
      complexity: 'high'
    });

    GameState.adjustStats({ happiness: -10 });
    if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: 12, karma: -10 });
    GameState.addJournalEntry(
      `🚪 Anda membuang ${child.name} daripada keluarga dan menggugurkan semua hak warisannya. Hubungan kini terputus dan penuh permusuhan.`,
      'warning'
    );
    GameState.save();
    return { ok: true, msg: `${child.name} telah dibuang daripada keluarga dan hilang hak warisan.` };
  },

  hireBodyguard(s, years = 3) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureFields(s);
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Tidak tersedia semasa dalam tahanan.' };
    const plan = this.BODYGUARD_CONTRACTS[0]; // Dikunci 5 tahun sahaja
    const firstYearFee = Utils.usdToLocal(plan.annualFeeUsd, s.countryId || 'MY');
    if ((s.money || 0) < firstYearFee) {
      return { ok: false, msg: `Baki tidak mencukupi — yuran tahun pertama pengawal peribadi ialah ${Utils.formatMoney(firstYearFee, s.countryId)}.` };
    }
    s.money -= firstYearFee;
    if (window.GameState && GameState.recordCashFlow) GameState.recordCashFlow(s, { type: 'out', category: 'Yuran/Perkhidmatan', label: 'Yuran Pengawal Peribadi (Kontrak 5 Thn)', amount: firstYearFee });
    s.bodyguard = {
      active: true,
      yearsLeft: plan.years,
      contractYears: plan.years,
      annualFeeUsd: plan.annualFeeUsd,
      autoRenew: false
    };
    s.bodyguardReminder = null;
    GameState.addJournalEntry(
      `🛡️ Anda melantik Pengawal Peribadi (Kontrak ${plan.years} tahun, yuran ${Utils.formatMoney(firstYearFee, s.countryId)}/thn — pembaharuan manual apabila tamat).`,
      'milestone'
    );
    GameState.save();
    return { ok: true, msg: `Pengawal Peribadi dilantik untuk kontrak ${plan.years} tahun!` };
  },

  toggleBodyguardAutoRenew(s) {
    if (!s || !s.bodyguard || !s.bodyguard.active) return { ok: false, msg: 'Tiada kontrak pengawal peribadi aktif.' };
    s.bodyguard.autoRenew = !s.bodyguard.autoRenew;
    GameState.save();
    return { ok: true, msg: s.bodyguard.autoRenew ? 'Auto-perbaharui Pengawal Peribadi diaktifkan.' : 'Auto-perbaharui Pengawal Peribadi dimatikan.' };
  },

  trainMartialArts(s) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureFields(s);
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Tidak tersedia semasa dalam tahanan.' };
    if (s.martialArtsLevel >= 5) return { ok: false, msg: 'Anda sudah mencapai tahap tertinggi Seni Pertahankan Diri (Tahap 5).' };
    if (s.martialArtsLastTrainedAge === s.age) {
      return { ok: false, msg: 'Anda sudah menjalani latihan seni pertahankan diri tahun ini. Cuba lagi tahun hadapan.' };
    }
    const fee = Utils.usdToLocal(600 + (s.martialArtsLevel * 350), s.countryId || 'MY');
    if ((s.money || 0) < fee) {
      return { ok: false, msg: `Baki tidak mencukupi — yuran latihan ialah ${Utils.formatMoney(fee, s.countryId)}.` };
    }
    s.money -= fee;
    if (window.GameState && GameState.recordCashFlow) GameState.recordCashFlow(s, { type: 'out', category: 'Yuran/Perkhidmatan', label: 'Latihan Seni Pertahankan Diri', amount: fee });
    s.martialArtsLevel += 1;
    s.martialArtsLastTrainedAge = s.age;
    GameState.adjustStats({ health: 4, happiness: 2 });
    GameState.addJournalEntry(`🥋 Anda menjalani latihan Seni Pertahankan Diri (kini Tahap ${s.martialArtsLevel}/5) dengan yuran ${Utils.formatMoney(fee, s.countryId)}.`);
    GameState.save();
    return { ok: true, msg: `Latihan selesai! Seni Pertahankan Diri kini Tahap ${s.martialArtsLevel}/5.` };
  },

  acceptLegacyCase(s, threatId) {
    if (!s || !Array.isArray(s.threats)) return { ok: false, msg: 'Fail kes tidak ditemui.' };
    const thr = s.threats.find(t => t && t.id === threatId && !t.resolved);
    if (!thr) return { ok: false, msg: 'Fail kes tidak ditemui.' };
    thr.optInStatus = 'active';
    GameState.addJournalEntry(`📁 Anda membuka semula Fail Kes Legasi melibatkan ${thr.relationType} untuk siasatan lanjut.`);
    GameState.save();
    return { ok: true, msg: 'Fail Kes Legasi diaktifkan untuk siasatan.' };
  },

  archiveLegacyCase(s, threatId) {
    if (!s || !Array.isArray(s.threats)) return { ok: false, msg: 'Fail kes tidak ditemui.' };
    const thr = s.threats.find(t => t && t.id === threatId && !t.resolved);
    if (!thr) return { ok: false, msg: 'Fail kes tidak ditemui.' };
    thr.resolved = true;
    thr.optInStatus = 'archived';
    GameState.addJournalEntry('🗄️ Anda menutup dan mengarkibkan Fail Kes Legasi dengan tenang tanpa sebarang penalti.');
    GameState.save();
    return { ok: true, msg: 'Fail Kes Legasi telah ditutup dan diarkibkan.' };
  },

  investigateThreat(s, threatId) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureFields(s);
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Siasatan disekat semasa dalam tahanan.' };
    const thr = s.threats.find(t => t && t.id === threatId && !t.resolved);
    if (!thr) return { ok: false, msg: 'Kes ancaman tidak ditemui.' };
    if (thr.status === 'strong') return { ok: false, msg: 'Kes ini sudah mencapai tahap Bukti Kukuh — anda boleh terus membuat Laporan Polis.' };

    const fee = Utils.usdToLocal(1800, s.countryId || 'MY');
    if ((s.money || 0) < fee) {
      return { ok: false, msg: `Baki tidak mencukupi — kos siasatan persendirian ialah ${Utils.formatMoney(fee, s.countryId)}.` };
    }
    s.money -= fee;
    if (window.GameState && GameState.logCashFlow) GameState.logCashFlow(s, -fee, 'Yuran Siasatan Persendirian', 'guaman');
    thr.cluesFound = Math.min(thr.cluesRequired, (thr.cluesFound || 0) + 1);
    const clueText = Utils.pick(this.SUBTLE_CLUES);
    if (!Array.isArray(thr.cluesLog)) thr.cluesLog = [];
    thr.cluesLog.push(`Tahun ${s.year}: ${clueText}`);

    if (thr.cluesFound >= thr.cluesRequired) {
      thr.status = 'strong';
    } else if (thr.cluesFound >= Math.ceil(thr.cluesRequired / 2)) {
      thr.status = 'suspicious';
    } else {
      thr.status = 'vague';
    }

    GameState.addJournalEntry(`🔎 Siasatan kes ancaman (${this.STATUS_LABELS[thr.status]}): ${clueText}`);
    GameState.save();
    return { ok: true, status: thr.status, msg: `Petunjuk baharu ditemui! Status bukti kini: ${this.STATUS_LABELS[thr.status]}.` };
  },

  reportThreatToPolice(s, threatId, chosenSuspectName) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureFields(s);
    const thr = s.threats.find(t => t && t.id === threatId && !t.resolved);
    if (!thr) return { ok: false, msg: 'Kes ancaman tidak ditemui.' };
    if (thr.status !== 'strong') {
      return { ok: false, msg: 'Bukti belum mencukupi untuk tangkapan polis. Sila teruskan siasatan sehingga mencapai status Bukti Kukuh.' };
    }
    if (chosenSuspectName === thr.targetName) {
      thr.resolved = true;
      GameState.adjustStats({ happiness: 8 });
      if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: -10 });
      GameState.addJournalEntry(
        `🚓 LAPORAN POLIS BERJAYA: Berdasarkan bukti kukuh, polis menahan ${thr.targetName} (${thr.relationType}) atas cubaan ancaman terhadap anda. Ancaman kini tamat!`,
        'milestone'
      );
      GameState.save();
      return { ok: true, arrested: true, msg: `Tangkapan berjaya! ${thr.targetName} telah ditahan polis dan ancaman kini tamat.` };
    }
    GameState.addJournalEntry(
      `⚠️ Laporan polis terhadap ${chosenSuspectName} gagal menemui kaitan. Dalang sebenar kini lebih berwaspada dan ancaman masih aktif!`,
      'warning'
    );
    GameState.save();
    return { ok: false, arrested: false, msg: `Tangkapan gagal — ${chosenSuspectName} bukan dalang sebenar. Ancaman masih aktif!` };
  },

  tickYearlySecurity(s) {
    if (!s || !s.alive) return null;
    this.ensureFields(s);

    // 1. Yuran & Peringatan Tamat Tempoh Kontrak Pengawal Peribadi (tiada auto-renew)
    if (s.bodyguard && s.bodyguard.active) {
      s.bodyguard.autoRenew = false;
      s.bodyguard.yearsLeft = (s.bodyguard.yearsLeft || 1) - 1;
      const annualFee = Utils.usdToLocal(s.bodyguard.annualFeeUsd || 18000, s.countryId || 'MY');
      if (s.bodyguard.yearsLeft > 0) {
        if ((s.money || 0) >= annualFee) {
          s.money -= annualFee;
          if (window.GameState && GameState.logCashFlow) GameState.logCashFlow(s, -annualFee, 'Yuran Tahunan Pengawal Peribadi', 'gaya_hidup');
          if (s.bodyguard.yearsLeft === 1) {
            s.bodyguardReminder = 'expiring';
            GameState.addJournalEntry('🛡️⏳ Peringatan: Kontrak Pengawal Peribadi anda berbaki 1 tahun sahaja lagi. Sila bersedia untuk memperbaharui secara manual.', 'warning');
          } else {
            s.bodyguardReminder = null;
          }
        } else {
          s.bodyguard = null;
          s.bodyguardReminder = 'expired';
          GameState.addJournalEntry('🛡️⚠️ Kontrak Pengawal Peribadi ditamatkan awal kerana baki tunai tidak mencukupi untuk yuran tahunan.', 'warning');
        }
      } else {
        s.bodyguard = null;
        s.bodyguardReminder = 'expired';
        GameState.addJournalEntry('🛡️🚨 Kontrak Pengawal Peribadi anda telah tamat tempoh! Sila perbaharui secara manual di menu Keselamatan & Ancaman.', 'warning');
      }
    }

    // 2. Petunjuk halus & risiko serangan bagi ancaman aktif (had umur keselamatan kanak-kanak)
    if (s.prison && s.prison.inPrison) return null;
    if ((s.age || 0) < 12) return null;
    const activeThreats = s.threats.filter(t => t && !t.resolved);
    if (activeThreats.length === 0) return null;

    const thr = Utils.pick(activeThreats);
    if (Utils.chance(0.45)) {
      const clue = Utils.pick(this.SUBTLE_CLUES);
      GameState.addJournalEntry(`👁️ Firasat tidak sedap hati: ${clue}`, 'warning');
    }

    // Serangan fizikal / cubaan bunuh dendam HANYA dibenarkan untuk umur 18 tahun ke atas
    if ((s.age || 0) < 18) return null;
    if (!Utils.chance(0.18)) return null;

    const hasBodyguard = Boolean(s.bodyguard && s.bodyguard.active);
    const maLvl = s.martialArtsLevel || 0;

    if (hasBodyguard && Utils.chance(0.82)) {
      GameState.addJournalEntry('🛡️ SERANGAN DIPATAHKAN! Pengawal Peribadi anda berjaya memintas penyerang misteri sebelum sempat mencederakan anda!', 'milestone');
      return null;
    }

    // Seni pertahankan diri: membantu mengelak/kurangkan kecederaan, impak lebih rendah daripada bodyguard
    const evadeChance = Math.min(0.40, maLvl * 0.08);
    if (maLvl > 0 && Utils.chance(evadeChance)) {
      GameState.adjustStats({ health: -5 });
      GameState.addJournalEntry('🥋 Anda diserang hendap secara mengejut! Latihan Seni Pertahankan Diri membantu anda menepis serangan utama dengan kecederaan ringan sahaja.', 'warning');
      return null;
    }

    const dmg = hasBodyguard ? Utils.randInt(8, 16) : Math.max(12, Utils.randInt(22, 38) - (maLvl * 3));
    GameState.adjustStats({ health: -dmg, happiness: -12 });
    if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: 18 });
    GameState.addJournalEntry(
      `🚨 ANDA DISERANG! Penyerang tidak dikenali mencederakan anda secara mengejut. Segera siasat ancaman dan buat laporan polis!`,
      'warning'
    );
    return null;
  }
};
