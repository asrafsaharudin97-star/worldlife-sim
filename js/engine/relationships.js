/* ==========================================================================
   WorldLife — Enjin Hubungan Sosial, Rakan, Pasangan & Perkahwinan
   ========================================================================== */

window.Relationships = {

  ensureRelationshipFields(s) {
    if (!s || !Array.isArray(s.relationships)) return;
    for (const r of s.relationships) {
      if (typeof r.trust !== 'number') r.trust = Utils.clamp((r.closeness || 65) + Utils.randInt(-8, 8), 20, 100);
      if (typeof r.compatibility !== 'number') r.compatibility = Utils.randInt(55, 95);
      if (!r.category) {
        if (r.id === s.partnerId) r.category = s.married ? 'spouse' : 'partner';
        else if (r.role === 'Rakan' || r.role === 'Sahabat Karib') r.category = 'friend';
        else if (r.role === 'Bekas Pasangan') r.category = 'ex';
        else r.category = 'family';
      }
      if (r.id === s.partnerId && !r.stage) {
        if (s.married) r.stage = 'married';
        else r.stage = 'dating';
      }
      if (typeof r.isAlive !== 'boolean') r.isAlive = Boolean(r.alive);
      if (r.category === 'partner' || r.category === 'spouse' || r.id === s.partnerId) {
        if (typeof r.yearsTogether !== 'number') r.yearsTogether = s.married ? Math.max(1, (s.year - ((s.marriageMeta && s.marriageMeta.marriedYear) || (s.year - 1)))) : 0;
        if (typeof r.unresolvedConflict !== 'boolean') r.unresolvedConflict = false;
        if (typeof r.wantsChildren !== 'boolean') r.wantsChildren = Utils.chance(0.85);
        if (r.gender === 'female') {
          if (typeof r.fertility !== 'number') r.fertility = Utils.randInt(58, 96);
          if (typeof r.isInfertile !== 'boolean') r.isInfertile = Utils.chance(0.065);
          if (typeof r.menopauseAge !== 'number') r.menopauseAge = Utils.randInt(45, 52);
        }
      }
      if (['Anak Lelaki', 'Anak Perempuan', 'Son', 'Daughter'].includes(r.role)) {
        if (typeof r.educationCare !== 'number') r.educationCare = Utils.randInt(58, 76);
        if (typeof r.healthCare !== 'number') r.healthCare = Utils.randInt(66, 86);
        if (typeof r.morals !== 'number') r.morals = Utils.randInt(60, 80);
        if (typeof r.rebelliousness !== 'number') r.rebelliousness = Utils.randInt(5, 18);
        if (typeof r.isDelinquent !== 'boolean') r.isDelinquent = false;
        if (!r.stats || typeof r.stats !== 'object') {
          r.stats = { smarts: Utils.randInt(52, 85), health: Utils.randInt(74, 96) };
        }
        this.ensureChildEducationFields(s, r);
      }
    }
  },

  // --------------------------------------------------------------------------
  // 0A. SKEMA PERSEKOLAHAN (UMUR 4–17) & UNIVERSITI ANAK (UMUR 18–22)
  // --------------------------------------------------------------------------
  SCHOOL_OPTIONS: {
    tadika: [
      {
        id: 'tadika_awam',
        label: 'Tadika / Prasekolah (Awam)',
        short: 'Tadika Awam',
        icon: '🎒',
        feeUsd: 0,
        smartsBonus: [2, 4],
        moralsBonus: [1, 2],
        rebelDelta: -1,
        desc: 'Prasekolah kerajaan (Percuma / kos amat rendah) • Pertumbuhan asas membaca & mengira'
      },
      {
        id: 'tadika_swasta',
        label: 'Tadika / Prasekolah (Swasta)',
        short: 'Tadika Swasta',
        icon: '🎨',
        feeUsd: 420,
        smartsBonus: [4, 7],
        moralsBonus: [2, 4],
        rebelDelta: -2,
        desc: 'Tadika swasta interaktif • +Kepintaran & +Akhlak lebih tinggi'
      }
    ],
    primary: [
      {
        id: 'sk_awam',
        label: 'Sekolah Rendah (Awam)',
        short: 'Sekolah Kebangsaan (Awam)',
        icon: '🏫',
        feeUsd: 0,
        smartsBonus: [2, 4],
        moralsBonus: [1, 2],
        rebelDelta: -1,
        desc: 'Sekolah Kebangsaan kerajaan (Percuma) • Pertumbuhan Kepintaran standard'
      },
      {
        id: 'sekolah_swasta',
        label: 'Sekolah Rendah Swasta',
        short: 'Sekolah Swasta',
        icon: '🕌',
        feeUsd: 850,
        smartsBonus: [4, 6],
        moralsBonus: [4, 7],
        rebelDelta: -4,
        desc: 'Yuran tahunan sederhana • Meningkatkan +Kepintaran & +Akhlak/Moral'
      },
      {
        id: 'sekolah_antarabangsa',
        label: 'Sekolah Rendah (Antarabangsa)',
        short: 'Sekolah Antarabangsa',
        icon: '🌍',
        feeUsd: 2600,
        smartsBonus: [6, 9],
        moralsBonus: [1, 3],
        rebelDelta: -2,
        prestigeBonus: 2,
        desc: 'Yuran tahunan tinggi • Pertumbuhan +Kepintaran tinggi & lonjakan prestij keluarga'
      }
    ],
    secondary: [
      {
        id: 'smk_awam',
        label: 'SMK / Sekolah Menengah (Awam)',
        short: 'SMK (Awam)',
        icon: '🏫',
        feeUsd: 0,
        smartsBonus: [2, 4],
        moralsBonus: [1, 2],
        rebelDelta: 0,
        desc: 'Sekolah Menengah Kebangsaan (Percuma) • Pertumbuhan Kepintaran standard'
      },
      {
        id: 'sbp_mrsm',
        label: 'SMK / Asrama Penuh (SBP / MRSM)',
        short: 'SBP / MRSM',
        icon: '🏅',
        feeUsd: 240,
        minSmarts: 75,
        smartsBonus: [6, 9],
        moralsBonus: [3, 5],
        rebelDelta: -6,
        prestigeBonus: 2,
        desc: 'Syarat Kepintaran >= 75% • Kos rendah, lonjakan kuat +Kepintaran & disiplin tinggi'
      },
      {
        id: 'sekolah_swasta',
        label: 'Sekolah Menengah Swasta',
        short: 'Sekolah Swasta',
        icon: '🕌',
        feeUsd: 1100,
        smartsBonus: [4, 7],
        moralsBonus: [5, 8],
        rebelDelta: -5,
        desc: 'Yuran tahunan sederhana • Mengukuhkan +Kepintaran & +Akhlak/Moral remaja'
      },
      {
        id: 'sekolah_antarabangsa',
        label: 'Sekolah Menengah (Antarabangsa)',
        short: 'Sekolah Antarabangsa',
        icon: '🌍',
        feeUsd: 3400,
        smartsBonus: [7, 10],
        moralsBonus: [1, 3],
        rebelDelta: -2,
        prestigeBonus: 3,
        desc: 'Yuran tahunan tinggi • +Kepintaran tinggi, silibus global & prestij keluarga'
      }
    ]
  },

  CHILD_UNI_MAJORS: [
    { id: 'medicine',             label: 'Perubatan',             fieldId: 'medicine',          minSmarts: 82, years: 4, feeMult: 1.45, careerTitle: 'Doktor Perubatan' },
    { id: 'engineering',          label: 'Kejuruteraan',          fieldId: 'engineering',       minSmarts: 72, years: 4, feeMult: 1.18, careerTitle: 'Jurutera' },
    { id: 'law',                  label: 'Undang-Undang',         fieldId: 'law',               minSmarts: 74, years: 4, feeMult: 1.22, careerTitle: 'Peguam' },
    { id: 'computer_science',     label: 'Sains Komputer',        fieldId: 'computer_science',  minSmarts: 68, years: 3, feeMult: 1.15, careerTitle: 'Jurutera Perisian' },
    { id: 'business_finance',     label: 'Perniagaan',            fieldId: 'business_finance',  minSmarts: 55, years: 3, feeMult: 1.05, careerTitle: 'Eksekutif Perniagaan' },
    { id: 'arts_media',           label: 'Seni / Reka Bentuk',    fieldId: 'arts_media',        minSmarts: 45, years: 3, feeMult: 0.92, careerTitle: 'Pereka Kreatif' },
    { id: 'trades_vocational',    label: 'Latihan Kemahiran / Terus Bekerja', fieldId: 'trades_vocational', minSmarts: 0, years: 2, feeMult: 0.60, careerTitle: 'Juruteknik Mahir' }
  ],

  CHILD_UNI_TIERS: {
    ipta: {
      id: 'ipta',
      label: 'Universiti Awam (IPTA)',
      short: 'IPTA',
      icon: '🏛️',
      baseFeeUsd: 1100,
      minSmarts: 50
    },
    ipts: {
      id: 'ipts',
      label: 'Universiti Swasta (IPTS)',
      short: 'IPTS',
      icon: '🎓',
      baseFeeUsd: 3200,
      minSmarts: 42
    },
    overseas: {
      id: 'overseas',
      label: 'Universiti Luar Negara',
      short: 'Luar Negara',
      icon: '✈️',
      baseFeeUsd: 7500,
      minSmarts: 80
    }
  },

  getSchoolStageForAge(age) {
    const a = Number(age) || 0;
    if (a < 4) return 'infant';
    if (a <= 6) return 'tadika';
    if (a <= 12) return 'primary';
    if (a <= 17) return 'secondary';
    return 'completed';
  },

  getSchoolOptionsForStage(stage, child) {
    const list = this.SCHOOL_OPTIONS[stage] || [];
    const smarts = (child && child.stats && child.stats.smarts) ?? 65;
    return list.map(opt => ({
      ...opt,
      locked: Boolean(opt.minSmarts && smarts < opt.minSmarts),
      lockReason: (opt.minSmarts && smarts < opt.minSmarts) ? `Perlu Kepintaran >= ${opt.minSmarts}% (Semasa: ${smarts}%)` : null
    }));
  },

  ensureChildEducationFields(s, child) {
    if (!child) return;
    const cId = (s && s.countryId) || child.countryId || 'MY';
    const age = Number(child.age) || 0;
    const expectedStage = this.getSchoolStageForAge(age);

    if (child.droppedOut) {
      child.uniEnrolled = false;
      child.uniYearsLeft = 0;
      child.yearlySchoolFee = 0;
      child.schoolStage = 'dropped_out';
      child.schoolType = 'none';
      if (!child.schoolLabel) child.schoolLabel = 'Berhenti Belajar';
      child.currentCgpa = null;
    } else if (age < 4) {
      child.schoolStage = 'infant';
      child.schoolType = 'none';
      child.schoolLabel = 'Belum Bersekolah (Bayi / Kanak-kanak)';
      child.yearlySchoolFee = 0;
    } else if (age >= 4 && age <= 17) {
      const stageOpts = this.SCHOOL_OPTIONS[expectedStage] || [];
      const currentValid = stageOpts.find(o => o.id === child.schoolType);
      if (child.schoolStage !== expectedStage || !currentValid) {
        child.schoolStage = expectedStage;
        // Jika umur 4-6 dan belum didaftarkan ke tadika, benarkan status belum daftar atau kekalkan pilihan terdahulu
        if (expectedStage === 'tadika' && !child.schoolType) {
          child.schoolType = 'not_enrolled';
          child.schoolLabel = 'Belum Mendaftar Tadika';
          child.yearlySchoolFee = 0;
        } else {
          // Bawa jenis sekolah setara jika bertukar dari rendah ke menengah (cth: swasta atau antarabangsa)
          let fallbackOpt = stageOpts[0];
          if (child.schoolType && stageOpts.some(o => o.id === child.schoolType)) {
            fallbackOpt = stageOpts.find(o => o.id === child.schoolType);
          }
          child.schoolType = fallbackOpt.id;
          child.schoolLabel = fallbackOpt.label;
          child.yearlySchoolFee = fallbackOpt.feeUsd > 0 ? Utils.usdToLocal(fallbackOpt.feeUsd, cId) : 0;
        }
      } else {
        child.schoolLabel = currentValid.label;
        child.yearlySchoolFee = currentValid.feeUsd > 0 ? Utils.usdToLocal(currentValid.feeUsd, cId) : 0;
      }
    } else {
      // Umur >= 18
      if (child.uniEnrolled && child.uniYearsLeft > 0) {
        child.schoolStage = 'university';
      } else if (child.education === 'bachelor' || child.education === 'diploma') {
        child.schoolStage = 'graduated';
        child.yearlySchoolFee = 0;
      } else {
        child.schoolStage = 'completed';
        child.yearlySchoolFee = 0;
      }
    }

    if (!('university' in child)) child.university = null;
    if (!('major' in child)) child.major = null;
    if (!('majorId' in child)) child.majorId = null;
    if (!('education' in child)) child.education = (age >= 18 && !child.droppedOut) ? 'high_school' : 'none';
    if (!Array.isArray(child.educationHistory)) child.educationHistory = [];
    if (typeof child.currentCgpa !== 'number') {
      child.currentCgpa = (child.uniEnrolled && !child.droppedOut)
        ? Number((3.0 + (((child.stats && child.stats.smarts) || 65) / 100) * 0.7).toFixed(2))
        : null;
    }
  },

  enrollChildSchool(childId, schoolTypeId) {
    const s = GameState.current;
    if (!s) return { ok: false, msg: 'Tiada permainan aktif.' };
    const child = (s.relationships || []).find(r => r.id === childId && r.alive);
    if (!child) return { ok: false, msg: 'Anak tidak ditemui.' };

    const stage = this.getSchoolStageForAge(child.age);
    const stageOpts = this.SCHOOL_OPTIONS[stage] || [];
    const chosen = stageOpts.find(o => o.id === schoolTypeId);
    if (!chosen) return { ok: false, msg: 'Pilihan sekolah tidak sah untuk peringkat umur ini.' };

    const smarts = (child.stats && child.stats.smarts) ?? 65;
    if (chosen.minSmarts && smarts < chosen.minSmarts) {
      return {
        ok: false,
        msg: `${child.name} memerlukan Kepintaran sekurang-kurangnya ${chosen.minSmarts}% untuk memasuki ${chosen.label} (Semasa: ${smarts}%).`
      };
    }

    const feeLocal = chosen.feeUsd > 0 ? Utils.usdToLocal(chosen.feeUsd, s.countryId) : 0;
    child.schoolStage = stage;
    child.schoolType = chosen.id;
    child.schoolLabel = chosen.label;
    child.yearlySchoolFee = feeLocal;
    child.job = stage === 'tadika' ? 'Pelajar Tadika' : 'Pelajar';

    const feeStr = feeLocal > 0 ? `${Utils.formatMoney(feeLocal, s.countryId)}/thn` : 'Percuma';
    GameState.addJournalEntry(
      `${chosen.icon} Anda mendaftarkan ${child.name} (${child.age} thn) ke ${chosen.label} (Yuran: ${feeStr}).`,
      'milestone'
    );
    GameState.save();
    return {
      ok: true,
      child,
      chosen,
      msg: `${child.name} kini bersekolah di ${chosen.label} (${feeStr})!`
    };
  },

  generateChildUniPreference(s, child) {
    const cId = (s && s.countryId) || child.countryId || 'MY';
    const smarts = (child && child.stats && child.stats.smarts) ?? 65;
    const rebel = child.rebelliousness ?? 10;
    const morals = child.morals ?? 70;
    const isDelinq = Boolean(child.isDelinquent);

    // Jika Kepintaran rendah (< 45) atau sangat memberontak/delinkuen -> cenderung Latihan Kemahiran / Terus Bekerja
    let chosenMajor;
    let wantsWorkDirectly = false;

    if (smarts < 44 || (isDelinq && rebel >= 75 && smarts < 65)) {
      chosenMajor = this.CHILD_UNI_MAJORS.find(m => m.id === 'trades_vocational');
      wantsWorkDirectly = smarts < 38 || isDelinq;
    } else if (smarts >= 84) {
      const topPool = this.CHILD_UNI_MAJORS.filter(m => ['medicine', 'engineering', 'law', 'computer_science'].includes(m.id));
      // Deterministic pick based on child id/name charCode or smarts
      const idx = ((child.name ? child.name.charCodeAt(0) : 0) + smarts) % topPool.length;
      chosenMajor = topPool[idx];
    } else if (smarts >= 70) {
      const midHighPool = this.CHILD_UNI_MAJORS.filter(m => ['engineering', 'law', 'computer_science', 'business_finance'].includes(m.id));
      const idx = ((child.name ? child.name.charCodeAt(0) : 0) + smarts) % midHighPool.length;
      chosenMajor = midHighPool[idx];
    } else if (rebel >= 55 || morals < 50) {
      chosenMajor = this.CHILD_UNI_MAJORS.find(m => m.id === 'arts_media') || this.CHILD_UNI_MAJORS[4];
    } else {
      const stdPool = this.CHILD_UNI_MAJORS.filter(m => ['business_finance', 'computer_science', 'arts_media'].includes(m.id));
      const idx = ((child.name ? child.name.charCodeAt(0) : 0) + smarts) % stdPool.length;
      chosenMajor = stdPool[idx];
    }

    let tierKey = 'ipta';
    if (wantsWorkDirectly) {
      tierKey = 'ipta';
    } else if (smarts >= 85 && (child.schoolType === 'sekolah_antarabangsa' || child.schoolType === 'sbp_mrsm' || smarts >= 90)) {
      tierKey = 'overseas';
    } else if (smarts >= 68 && rebel < 55) {
      tierKey = 'ipta';
    } else {
      tierKey = 'ipts';
    }

    const tier = this.CHILD_UNI_TIERS[tierKey] || this.CHILD_UNI_TIERS.ipta;
    const yearlyFeeLocal = Utils.usdToLocal(Math.round(tier.baseFeeUsd * (chosenMajor.feeMult || 1.0)), cId);

    // Pilihan lebih murah untuk Pilihan 3 ("Cadang Universiti / Bidang Lebih Murah")
    const cheaperTier = this.CHILD_UNI_TIERS.ipta;
    const cheaperMajor = (chosenMajor.id === 'medicine' || chosenMajor.id === 'law' || chosenMajor.id === 'engineering')
      ? this.CHILD_UNI_MAJORS.find(m => m.id === 'business_finance')
      : this.CHILD_UNI_MAJORS.find(m => m.id === 'trades_vocational');
    const cheaperFeeLocal = Utils.usdToLocal(Math.round(cheaperTier.baseFeeUsd * (cheaperMajor.feeMult || 0.8) * 0.75), cId);

    return {
      wantsWorkDirectly,
      major: chosenMajor,
      tier,
      yearlyFeeLocal,
      totalFeeLocal: yearlyFeeLocal * (chosenMajor.years || 3),
      cheaperTier,
      cheaperMajor,
      cheaperFeeLocal
    };
  },

  resolveChildUniversityChoice(childId, decision) {
    const s = GameState.current;
    if (!s) return { ok: false, msg: 'Tiada permainan aktif.' };
    const child = (s.relationships || []).find(r => r.id === childId && r.alive);
    if (!child) return { ok: false, msg: 'Anak tidak ditemui.' };

    const pref = child._uniPref || this.generateChildUniPreference(s, child);
    const smarts = (child.stats && child.stats.smarts) ?? 65;
    const initCgpa = Number(Math.max(2.5, Math.min(3.95, 2.75 + (smarts / 100) * 1.1)).toFixed(2));

    if (decision === 'sponsor_full') {
      const firstYearFee = pref.yearlyFeeLocal;
      s.money = (s.money || 0) - firstYearFee;
      child.closeness = Utils.clamp((child.closeness ?? 75) + 20, 0, 100);
      child.trust = Utils.clamp((child.trust ?? 75) + 15, 0, 100);
      child.uniEnrolled = true;
      child.university = `${pref.tier.label}`;
      child.uniTier = pref.tier.id;
      child.major = pref.major.label;
      child.majorId = pref.major.fieldId;
      child.uniCareerTitle = pref.major.careerTitle;
      child.uniYearsTotal = pref.major.years || 3;
      child.uniYearsLeft = (pref.major.years || 3) - 1; // Tahun pertama dibayar sekarang
      child.yearlySchoolFee = firstYearFee;
      child.uniSponsorMode = 'parent';
      child.education = 'high_school';
      child.schoolStage = 'university';
      child.schoolLabel = `${pref.tier.short} (${pref.major.label})`;
      child.currentCgpa = initCgpa;
      child.job = `Mahasiswa (${pref.major.label})`;
      GameState.adjustStats({ happiness: 12 });

      const msg = `💰 Anda menaja sepenuhnya pengajian ${child.name} dalam bidang ${pref.major.label} di ${pref.tier.label} (Yuran: ${Utils.formatMoney(firstYearFee, s.countryId)}/thn • Hubungan +20%).`;
      GameState.addJournalEntry(msg, 'milestone');
      GameState.save();
      return { ok: true, msg };
    }

    if (decision === 'scholarship_loan') {
      const scholChance = smarts >= 85 ? 0.82 : smarts >= 80 ? 0.68 : smarts >= 72 ? 0.30 : 0.10;
      const gotScholarship = Utils.chance(scholChance);
      child.closeness = Utils.clamp((child.closeness ?? 75) + (gotScholarship ? 10 : 4), 0, 100);
      child.uniEnrolled = true;
      child.university = `${pref.tier.label}`;
      child.uniTier = pref.tier.id;
      child.major = pref.major.label;
      child.majorId = pref.major.fieldId;
      child.uniCareerTitle = pref.major.careerTitle;
      child.uniYearsTotal = pref.major.years || 3;
      child.uniYearsLeft = (pref.major.years || 3) - 1;
      child.yearlySchoolFee = 0; // Kos sifar kepada ibu bapa
      child.uniSponsorMode = gotScholarship ? 'scholarship' : 'loan';
      child.childStudentLoan = gotScholarship ? 0 : pref.totalFeeLocal;
      child.education = 'high_school';
      child.schoolStage = 'university';
      child.schoolLabel = `${pref.tier.short} (${pref.major.label} • ${gotScholarship ? 'Biasiswa' : 'Pinjaman'})`;
      child.currentCgpa = initCgpa;
      child.job = `Mahasiswa (${pref.major.label})`;
      GameState.adjustStats({ happiness: gotScholarship ? 14 : 6 });

      const msg = gotScholarship
        ? `📜🎉 Tahniah! Berkat Kepintaran tinggi (${smarts}%), ${child.name} berjaya meraih Biasiswa Penuh untuk melanjutkan pengajian ${pref.major.label} di ${pref.tier.label} tanpa membebankan kewangan anda!`
        : `📜 ${child.name} mengambil Pinjaman Pelajaran (${Utils.formatMoney(pref.totalFeeLocal, s.countryId)}) untuk membiayai pengajian ${pref.major.label} di ${pref.tier.label} (Tiada kos kepada anda).`;
      GameState.addJournalEntry(msg, 'milestone');
      GameState.save();
      return { ok: true, gotScholarship, msg };
    }

    if (decision === 'suggest_cheaper') {
      const acceptChance = Utils.clamp(0.48 + ((child.closeness ?? 70) - 60) * 0.008 - ((child.rebelliousness ?? 15) * 0.006), 0.25, 0.85);
      const smoothlyAccepted = Utils.chance(acceptChance);
      const relDrop = smoothlyAccepted ? -10 : -Utils.randInt(14, 20);
      child.closeness = Utils.clamp((child.closeness ?? 75) + relDrop, 10, 100);

      const fee = pref.cheaperFeeLocal;
      s.money = (s.money || 0) - fee;
      child.uniEnrolled = true;
      child.university = pref.cheaperTier.label;
      child.uniTier = pref.cheaperTier.id;
      child.major = pref.cheaperMajor.label;
      child.majorId = pref.cheaperMajor.fieldId;
      child.uniCareerTitle = pref.cheaperMajor.careerTitle;
      child.uniYearsTotal = pref.cheaperMajor.years || 3;
      child.uniYearsLeft = (pref.cheaperMajor.years || 3) - 1;
      child.yearlySchoolFee = fee;
      child.uniSponsorMode = 'parent_cheaper';
      child.education = 'high_school';
      child.schoolStage = 'university';
      child.schoolLabel = `${pref.cheaperTier.short} (${pref.cheaperMajor.label})`;
      child.currentCgpa = initCgpa;
      child.job = `Mahasiswa (${pref.cheaperMajor.label})`;

      const msg = smoothlyAccepted
        ? `🔄 ${child.name} akur dengan cadangan anda untuk mengambil bidang ${pref.cheaperMajor.label} di ${pref.cheaperTier.label} yang lebih jimat (${Utils.formatMoney(fee, s.countryId)}/thn), walaupun sedikit terkilan (Hubungan ${relDrop}%).`
        : `🔄😔 ${child.name} berasa kecewa kerana terpaksa melupakan bidang ${pref.major.label} dan beralih ke ${pref.cheaperMajor.label} di ${pref.cheaperTier.label} (${Utils.formatMoney(fee, s.countryId)}/thn • Hubungan ${relDrop}%).`;
      GameState.addJournalEntry(msg, smoothlyAccepted ? 'normal' : 'warning');
      GameState.save();
      return { ok: true, msg };
    }

    // decision === 'work_immediately'
    const wantedUni = !pref.wantsWorkDirectly;
    const relHit = wantedUni ? -25 : -5;
    child.closeness = Utils.clamp((child.closeness ?? 75) + relHit, 5, 100);
    child.uniEnrolled = false;
    child.uniYearsLeft = 0;
    child.yearlySchoolFee = 0;
    child.schoolStage = 'completed';
    child.schoolLabel = 'Tamat Sekolah Menengah (Terus Bekerja)';
    child.education = 'high_school';
    const c = Utils.getCountry(s.countryId);
    const entryJobs = (c && Array.isArray(c.jobs)) ? c.jobs.filter(j => !j.reqDegree) : [];
    const starterTitle = entryJobs.length > 0 ? Utils.pick(entryJobs).title : 'Pekerja Muda';
    child.job = starterTitle;
    if (wantedUni) GameState.adjustStats({ happiness: -6 });

    const msg = wantedUni
      ? `💼😔 Anda menyuruh ${child.name} melupakan hasrat ke universiti (${pref.major.label}) dan terus bekerja sebagai ${starterTitle}. ${child.name} amat berkecil hati dengan keputusan anda (Hubungan -25%).`
      : `💼 ${child.name} memilih untuk terus memasuki alam pekerjaan sebagai ${starterTitle} selepas tamat sekolah menengah.`;
    GameState.addJournalEntry(msg, wantedUni ? 'warning' : 'normal');
    GameState.save();
    return { ok: true, msg };
  },

  computeChildDropoutChance(child) {
    if (!child || !child.alive || child.droppedOut) return 0;
    const age = Number(child.age) || 0;
    const inSec = age >= 15 && age <= 17 && child.schoolStage === 'secondary' && child.schoolType && child.schoolType !== 'none' && child.schoolType !== 'not_enrolled';
    const inUni = age >= 18 && age <= 22 && Boolean(child.uniEnrolled) && (child.uniYearsLeft || 0) > 0;
    if (!inSec && !inUni) return 0;

    const smarts = (child.stats && typeof child.stats.smarts === 'number') ? child.stats.smarts : 65;
    const rebel = typeof child.rebelliousness === 'number' ? child.rebelliousness : 10;
    const closeness = typeof child.closeness === 'number' ? child.closeness : 75;
    const cgpa = typeof child.currentCgpa === 'number' ? child.currentCgpa : null;
    const isDelinq = Boolean(child.isDelinquent);

    let riskFactors = 0;
    if (isDelinq || rebel >= 55) riskFactors += 1;
    if (smarts < 48) riskFactors += 1;
    if (cgpa !== null && cgpa < 2.0) riskFactors += 1;
    if (closeness < 45) riskFactors += 1;

    if (riskFactors === 0) {
      // Anak berkelakuan baik, pintar & rapat dengan ibu bapa: peluang rendah ~2%–4%
      return (smarts >= 75 && closeness >= 70 && rebel <= 20) ? 0.02 : 0.035;
    }

    // Risiko tinggi (~15%–30%) bergantung kepada tahap pemberontakan, PNGK, kepintaran & hubungan
    let prob = 0.15 + ((riskFactors - 1) * 0.05);
    if (isDelinq || rebel >= 75) prob += 0.05;
    if (cgpa !== null && cgpa < 2.0) prob += 0.04;
    return Math.max(0.15, Math.min(0.30, prob));
  },

  pickChildDropoutReason(child) {
    const rebel = child.rebelliousness ?? 10;
    const smarts = (child.stats && child.stats.smarts) ?? 65;
    const cgpa = typeof child.currentCgpa === 'number' ? child.currentCgpa : null;

    const pool = [];
    if (child.isDelinquent || rebel >= 60) {
      pool.push('terpengaruh dengan rakan sebaya yang sudah berhenti belajar dan mahu hidup bebas');
    }
    if (cgpa !== null && cgpa < 2.0) {
      pool.push(`tertekan dengan keputusan pengajian yang merosot (PNGK ${cgpa.toFixed(2)}) dan rasa tidak mampu meneruskan kursus`);
    }
    if (smarts < 50) {
      pool.push('hilang minat belajar dan merasakan pelajaran akademik terlalu sukar diikuti');
    }
    pool.push(
      'hilang minat belajar dan merasakan pengajian formal tidak sesuai dengan jiwanya',
      'tertekan dengan beban tugasan serta peperiksaan yang terlalu berat',
      'mahu terus bekerja atau memulakan perniagaan kecil bagi mencari pendapatan sendiri'
    );
    return Utils.pick(pool);
  },

  _pickChildEntryWorkTitle(child) {
    if (window.CareersData && Array.isArray(CareersData.CAREERS)) {
      const smarts = (child && child.stats && child.stats.smarts) ?? 55;
      const preferredInd = smarts >= 55 ? ['semi_skilled', 'unskilled'] : ['unskilled'];
      const list = CareersData.CAREERS.filter(c => preferredInd.includes(c.industry));
      if (list.length > 0) return Utils.pick(list).title;
    }
    return Utils.pick([
      'Penghantar Makanan (Rider)',
      'Kru Restoran Makanan Segera',
      'Pembantu Kedai Runcit',
      'Operator Pengeluaran Kilang',
      'Barista & Pembantu Dapur',
      'Juruwang (Cashier) Pasar Raya'
    ]);
  },

  _applyChildDropout(s, child, reason) {
    const wasUni = Boolean(child.uniEnrolled) || child.schoolStage === 'university';
    const prevInstitution = wasUni
      ? `${child.university || 'Universiti'}${child.major ? ` (${child.major})` : ''}`
      : (child.schoolLabel || 'Sekolah Menengah');

    child.droppedOut = true;
    child.droppedOutFrom = prevInstitution;
    child.uniEnrolled = false;
    child.uniYearsLeft = 0;
    child.yearlySchoolFee = 0;
    child.currentCgpa = null;
    child.schoolStage = 'dropped_out';
    child.schoolType = 'none';
    child.schoolLabel = wasUni ? 'Berhenti Universiti' : 'Berhenti Sekolah Menengah';
    child.education = wasUni ? 'high_school' : 'none';

    const starterJob = this._pickChildEntryWorkTitle(child);
    child.job = starterJob;

    if (!Array.isArray(child.educationHistory)) child.educationHistory = [];
    child.educationHistory.push({
      type: 'dropout',
      label: `Berhenti belajar daripada ${prevInstitution}`,
      courseLabel: prevInstitution,
      reason,
      age: child.age,
      year: s.year
    });

    return { wasUni, prevInstitution, starterJob };
  },

  resolveChildDropoutChoice(childId, decision, reason = '', opts = {}) {
    const s = GameState.current;
    if (!s) return { ok: false, msg: 'Tiada permainan aktif.' };
    const child = (s.relationships || []).find(r => r.id === childId && r.alive);
    if (!child) return { ok: false, msg: 'Anak tidak ditemui.' };

    const rebel = typeof child.rebelliousness === 'number' ? child.rebelliousness : 15;
    const closeness = typeof child.closeness === 'number' ? child.closeness : 70;
    const playerSmarts = (s.stats && s.stats.smarts) ?? 60;
    const wasUni = Boolean(child.uniEnrolled) || child.schoolStage === 'university';
    const placeLabel = wasUni
      ? `${child.university || 'universiti'}${child.major ? ` (${child.major})` : ''}`
      : (child.schoolLabel || 'sekolah menengah');

    if (decision === 'persuade') {
      const persuadeChance = Math.max(
        0.15,
        Math.min(
          0.88,
          0.32 + ((closeness - 50) * 0.007) + ((playerSmarts - 50) * 0.005) - ((rebel - 40) * 0.004) - (child.isDelinquent ? 0.12 : 0)
        )
      );
      const succeeded = typeof opts.forceSuccess === 'boolean' ? opts.forceSuccess : Utils.chance(persuadeChance);

      if (succeeded) {
        child.closeness = Utils.clamp(closeness + 5, 0, 100);
        child.rebelliousness = Utils.clamp(rebel - Utils.randInt(6, 12), 0, 100);
        if (child.rebelliousness <= 55 && (child.morals ?? 60) >= 45) child.isDelinquent = false;
        GameState.adjustStats({ happiness: 6 });
        const msg = `💬✅ Nasihat lembut anda menyentuh hati ${child.name}! Dia bersetuju membatalkan niat berhenti belajar dan meneruskan pengajian di ${placeLabel} (Hubungan +5%).`;
        GameState.addJournalEntry(msg, 'milestone');
        GameState.save();
        return { ok: true, stayed: true, droppedOut: false, msg };
      }

      const info = this._applyChildDropout(s, child, reason);
      GameState.adjustStats({ happiness: -6 });
      const msg = `💬😔 Anda sudah cuba memujuk dengan baik, namun ${child.name} tetap berkeras berhenti belajar daripada ${info.prevInstitution}. Yuran tahunan dihentikan dan dia mula bekerja sebagai ${info.starterJob}.`;
      GameState.addJournalEntry(msg, 'warning');
      GameState.save();
      return { ok: true, stayed: false, droppedOut: true, msg };
    }

    if (decision === 'respect') {
      child.closeness = Utils.clamp(closeness + 10, 0, 100);
      const info = this._applyChildDropout(s, child, reason);
      const msg = `🤝 Anda menghormati keputusan ${child.name} untuk berhenti belajar daripada ${info.prevInstitution} (Hubungan +10%). Yuran tahunan dihentikan dan ${child.name} kini memasuki alam pekerjaan sebagai ${info.starterJob}.`;
      GameState.addJournalEntry(msg, 'culture');
      GameState.save();
      return { ok: true, stayed: false, droppedOut: true, msg };
    }

    // decision === 'force'
    const isHighlyRebellious = Boolean(child.isDelinquent || rebel >= 65);
    if (!isHighlyRebellious) {
      const relHit = Utils.randInt(15, 20);
      const rebelGain = Utils.randInt(10, 16);
      child.closeness = Utils.clamp(closeness - relHit, 0, 100);
      child.rebelliousness = Utils.clamp(rebel + rebelGain, 0, 100);
      const msg = `😠 Anda bertegas memaksa ${child.name} meneruskan pengajian di ${placeLabel}. Dia akur dengan berat hati tetapi mula memendam rasa (Hubungan -${relHit}%, Pemberontakan +${rebelGain}%).`;
      GameState.addJournalEntry(msg, 'warning');
      GameState.save();
      return { ok: true, stayed: true, droppedOut: false, msg };
    }

    child.closeness = Utils.clamp(closeness - 30, 0, 100);
    child.rebelliousness = Utils.clamp(rebel + 12, 0, 100);
    const info = this._applyChildDropout(s, child, reason);
    GameState.adjustStats({ happiness: -10 });
    const msg = `😠💥 ${child.name} membantah keras paksaan anda dan tetap berhenti belajar daripada ${info.prevInstitution} (Hubungan -30%)! Yuran tahunan dihentikan dan dia memilih bekerja sendiri sebagai ${info.starterJob}.`;
    GameState.addJournalEntry(msg, 'warning');
    GameState.save();
    return { ok: true, stayed: false, droppedOut: true, msg };
  },

  computeCompatibility(s) {
    return Utils.randInt(52, 95);
  },

  // --------------------------------------------------------------------------
  // 0B. PENGIRAAN PELUANG PENOLAKAN SESI DATE & LAMARAN
  // --------------------------------------------------------------------------
  evaluateCourtingAcceptance(s, candidate = {}) {
    const looks = (s.stats && s.stats.looks) ?? 65;
    const smarts = (s.stats && s.stats.smarts) ?? 65;
    const karma = (s.alignment && s.alignment.karma) ?? 0;
    const notoriety = (s.alignment && s.alignment.notoriety) ?? 0;
    const crim = (s.criminalRecord || 0) + ((s.prison && s.prison.timesImprisoned) || 0);
    const candAge = candidate.age ?? s.age;
    const ageGap = Math.abs(s.age - candAge);
    const hasIncomeOrFunds = Boolean(s.job || s.activeSpecialMode || (s.money || 0) >= Utils.usdToLocal(1500, s.countryId));

    let acceptProb = 0.74;
    acceptProb += ((looks - 55) / 100) * 0.16;
    acceptProb += ((smarts - 55) / 100) * 0.10;
    acceptProb += (karma / 100) * 0.10;
    if (hasIncomeOrFunds) acceptProb += 0.06;
    else if (s.age >= 23) acceptProb -= 0.14;
    if ((s.money || 0) < 0) acceptProb -= 0.12;


    if (ageGap >= 15) acceptProb -= 0.25;
    else if (ageGap >= 9) acceptProb -= 0.12;

    if (crim > 0 || notoriety >= 30 || (s.fugitive && s.fugitive.isFugitive)) {
      acceptProb -= Math.min(0.42, 0.22 + crim * 0.08);
    }

    acceptProb = Math.max(0.14, Math.min(0.93, acceptProb));
    if (Utils.chance(acceptProb)) {
      return { accepted: true, prob: acceptProb };
    }

    // Pilih sebab penolakan yang paling berpadanan
    let reasonTag;
    let logText;
    let shortMsg;
    const cName = candidate.name || 'Calon kenalan';

    if (crim > 0 || notoriety >= 30 || (s.fugitive && s.fugitive.isFugitive)) {
      reasonTag = 'criminal_record';
      shortMsg = `${cName} menolak perkenalan: "Tolak sebab rekod jenayah / latar belakang"`;
      logText = `🚫 ${cName} (${candAge} thn) menolak untuk keluar bersama selepas mengetahui rekod jenayah dan reputasi buruk anda.`;
    } else if (ageGap >= 10) {
      reasonTag = 'age_gap';
      shortMsg = `${cName} menolak: "Tolak sebab jurang umur & perbezaan latar belakang"`;
      logText = `💔 ${cName} (${candAge} thn) menolak secara sopan untuk meneruskan perkenalan kerana merasakan jurang umur (${ageGap} tahun) serta perbezaan latar belakang terlalu ketara.`;
    } else if (!hasIncomeOrFunds && s.age >= 23 && Utils.chance(0.55)) {
      reasonTag = 'financial_background';
      shortMsg = `${cName} menolak: "Tolak sebab latar belakang kewangan belum stabil"`;
      logText = `😔 ${cName} menolak ajakan bercinta kerana merasakan kedudukan kerjaya serta kewangan anda belum cukup kukuh.`;
    } else if (Utils.chance(0.45)) {
      reasonTag = 'ghosted';
      shortMsg = `Kena ghost selepas sesi perkenalan dengan ${cName}!`;
      logText = `👻 Kena ghost selepas berkenalan! ${cName} terus hilang tanpa berita dan menyekat mesej anda selepas pertemuan pertama.`;
    } else {
      reasonTag = 'friendzone';
      shortMsg = `${cName}: "Tiada keserasian / Hanya anggap kawan"`;
      logText = `🕊️ ${cName} berterus terang bahawa tiada keserasian romantik antara kalian — "Maaf, saya hanya anggap awak sebagai kawan."`;
    }

    return {
      accepted: false,
      prob: acceptProb,
      reasonTag,
      shortMsg,
      logText
    };
  },

  buildFamilyRejectionEvent(s, rel, stageLabel = 'Merisik & Bertunang') {
    const hasCrime = (s.criminalRecord || 0) > 0 || ((s.alignment && s.alignment.notoriety) || 0) >= 25 || Boolean(s.fugitive && s.fugitive.isFugitive);
    const reasonDesc = hasCrime
      ? 'rekod jenayah serta reputasi buruk anda'
      : (!s.job && !s.activeSpecialMode)
        ? 'ketiadaan pekerjaan tetap dan jaminan nafkah masa depan'
        : 'kebimbangan terhadap kestabilan hidup dan latar belakang anda';

    return {
      id: `family_reject_${rel.id}_${s.age}_${Date.now()}`,
      icon: '🛑',
      title: `Penolakan Keluarga Pasangan (${stageLabel})`,
      text: `Ibu bapa ${rel.name} tidak merestui hubungan ini! Dalam pertemuan bersama keluarga, wakil keluarga ${rel.name} menyuarakan bantahan tegas kerana ${reasonDesc}.\n\n"Kami tidak merestui hubungan kamu berdua selagi keadaan hidup dan reputasi kamu masih begini."`,
      choices: [
        {
          label: '💪 Pujuk & Buktikan Diri (Cuba Semula Tahun Depan)',
          hint: 'Kekalkan hubungan • Perbaiki kerjaya, kewangan & kemesraan sebelum meminang semula',
          customAction: (state) => {
            const p = state.relationships.find(r => r.id === rel.id && r.alive);
            if (p) {
              p.closeness = Utils.clamp((p.closeness || 65) - 6, 15, 100);
              p.trust = Utils.clamp((p.trust || 65) - 4, 15, 100);
              p.familyApprovalPending = true;
            }
            if (state.alignment) state.alignment.stress = Utils.clamp((state.alignment.stress || 0) + 8, 0, 100);
            GameState.adjustStats({ happiness: -8 });
            const msg = `Anda berjanji di hadapan keluarga ${rel.name} untuk memperbaiki diri dan membuktikan kesungguhan sebelum mencuba semula tahun hadapan.`;
            GameState.addJournalEntry(`🤝 ${msg}`, 'dilemma');
            return { outcome: msg, toastType: 'culture' };
          }
        },
        {
          label: '💔 Undur Diri & Putus',
          hint: 'Tamatkan hubungan kerana tiada restu keluarga',
          journalType: 'warning',
          customAction: (state) => {
            const p = state.relationships.find(r => r.id === rel.id && r.alive);
            if (p) {
              state.partnerId = null;
              state.married = false;
              p.category = 'ex';
              p.role = 'Bekas Pasangan';
              p.closeness = 15;
              p.trust = 20;
            }
            GameState.adjustStats({ happiness: -18 });
            GameState.recordCrisis('heartbreak');
            const msg = `Akur dengan tentangan hebat keluarga ${rel.name}, anda memilih untuk mengundur diri dan membawa haluan masing-masing.`;
            GameState.addJournalEntry(`💔 ${msg}`, 'warning');
            return { outcome: msg, toastType: 'error' };
          }
        }
      ]
    };
  },

  // --------------------------------------------------------------------------
  // 1. RAKAN-RAKAN (Sekolah, Tempat Kerja, Komuniti)
  // --------------------------------------------------------------------------
  meetFriend(source = 'auto') {
    const s = GameState.current;
    GameState.ensureUpgradedState();
    this.ensureRelationshipFields(s);

    if (s.prison && s.prison.inPrison) return { ok: false, msg: '⛓️ Tidak boleh mencari kawan luar semasa berada di dalam penjara.' };
    if (s.age < 7) return { ok: false, msg: 'Anda masih terlalu kecil — tunggu umur 7 tahun untuk cari kawan baru!' };
    if (s.yearlyActions.meetFriend) return { ok: false, msg: 'Anda sudah berkenalan dengan rakan baru tahun ini.' };

    const activeFriends = s.relationships.filter(r => r.alive && r.category === 'friend');
    if (activeFriends.length >= 6) {
      return { ok: false, msg: 'Lingkaran rakan anda sudah penuh (maksimum 6 rakan aktif).' };
    }

    const c = Utils.getCountry(s.countryId);
    let origin = source;
    if (origin === 'auto') {
      if (s.age < 18 || s.education.stage === 'university') origin = 'Sekolah / Kampus';
      else if (s.job && Utils.chance(0.55)) origin = 'Tempat Kerja';
      else origin = 'Komuniti';
    }

    const gender = Utils.chance(0.5) ? 'male' : 'female';
    const heritage = Utils.pick(c.heritages).id;
    const name = Utils.generateName(s.countryId, gender, heritage);
    const age = Utils.clamp(s.age + Utils.randInt(-4, 5), 7, 82);
    const job = age < 18 ? 'Pelajar' : (origin === 'Tempat Kerja' && s.job ? `Rakan Sekerja (${s.job.title})` : Utils.pick(c.jobs).title);
    const compat = this.computeCompatibility(s);

    const friend = {
      id: 'rel_friend_' + Date.now() + '_' + Utils.randInt(10, 99),
      name,
      role: 'Rakan',
      category: 'friend',
      origin,
      gender,
      age,
      countryId: s.countryId,
      closeness: Utils.randInt(45, 70),
      trust: Utils.randInt(45, 72),
      compatibility: compat,
      alive: true,
      job
    };

    s.relationships.push(friend);
    s.yearlyActions.meetFriend = true;
    GameState.adjustStats({ happiness: 7, adaptation: 6 });
    GameState.addJournalEntry(
      `🤝 Anda berkenalan dengan rakan baru, ${name} (${age} thn, ${origin}) di ${s.city}.`,
      'culture'
    );
    GameState.save();
    return { ok: true, msg: `Anda kini berkawan dengan ${name} (${origin})!` };
  },

  // --------------------------------------------------------------------------
  // 2. CARI PASANGAN / SESI DATE (Risiko Penolakan Realistik)
  // --------------------------------------------------------------------------
  meetLocalDate() {
    const s = GameState.current;
    GameState.ensureUpgradedState();
    this.ensureRelationshipFields(s);
    const c = Utils.getCountry(s.countryId);

    if (s.prison && s.prison.inPrison) {
      return { ok: false, msg: '⛓️ Tidak boleh menghadiri Sesi Date semasa berada di dalam penjara.' };
    }
    const minAge = 16;
    if (s.age < minAge) {
      return {
        ok: false,
        msg: 'Tunggu sehingga umur 16 tahun untuk memulakan Sesi Date!'
      };
    }
    if (s.partnerId) return { ok: false, msg: 'Anda sudah mempunyai pasangan!' };

    const targetGender = s.gender === 'male' ? 'female' : 'male';
    const heritage = Utils.pick(c.heritages).id;
    const name = Utils.generateName(s.countryId, targetGender, heritage);
    const job = Utils.pick(c.jobs).title;
    const age = Utils.clamp(s.age + Utils.randInt(-4, 7), minAge, 75);


    // Semak penerimaan atau penolakan semasa Sesi Date
    const courtRes = this.evaluateCourtingAcceptance(s, { name, age, job });
    if (!courtRes.accepted) {
      const hapHit = -Utils.randInt(5, 11);
      GameState.adjustStats({ happiness: hapHit });
      if (s.alignment) s.alignment.stress = Utils.clamp((s.alignment.stress || 0) + 4, 0, 100);
      GameState.addJournalEntry(courtRes.logText, 'warning');
      GameState.save();
      return {
        ok: false,
        rejected: true,
        reasonTag: courtRes.reasonTag,
        msg: courtRes.shortMsg
      };
    }

    const compat = this.computeCompatibility(s);
    const roleLabel = (targetGender === 'female' ? 'Teman Wanita' : 'Teman Lelaki');

    const partner = {
      id: 'rel_partner_' + Date.now(),
      name,
      role: roleLabel,
      category: 'partner',
      stage: 'dating',
      origin: 'Sesi Date',
      gender: targetGender,
      age,
      countryId: s.countryId,
      closeness: Utils.randInt(54, 76),
      trust: Utils.randInt(58, 82),
      compatibility: compat,
      yearsTogether: 0,
      unresolvedConflict: false,
      wantsChildren: Utils.chance(0.85),
      fertility: targetGender === 'female' ? Utils.randInt(58, 96) : null,
      isInfertile: targetGender === 'female' ? Utils.chance(0.065) : false,
      menopauseAge: targetGender === 'female' ? Utils.randInt(45, 52) : null,
      alive: true,
      isAlive: true,
      job
    };

    s.relationships.push(partner);
    s.partnerId = partner.id;
    GameState.adjustStats({ happiness: 12, adaptation: 8 });


    GameState.addJournalEntry(
      `💘 Anda memulakan Sesi Date bersama ${name} (${age} thn, ${job}) di ${s.city}!`,
      'romance'
    );
    GameState.save();
    return {
      ok: true,
      msg: `Mula Sesi Date bersama ${name}!`
    };
  },

  // --------------------------------------------------------------------------
  // 3. INTERAKSI HUBUNGAN (Keluarga, Rakan, Pasangan, Suami/Isteri)
  // --------------------------------------------------------------------------
  interactRelation(relId, action, opts = {}) {
    const s = GameState.current;
    GameState.ensureUpgradedState();
    this.ensureRelationshipFields(s);

    const rel = s.relationships.find(r => r.id === relId);
    if (!rel || !rel.alive) return { ok: false, msg: 'Tidak dapat berinteraksi.' };

    const nonRepeatable = !['engage', 'propose', 'have_kid', 'breakup', 'cohabit', 'cut_ties', 'steal_money'].includes(action);
    const key = `rel_${relId}_${action}`;
    if (nonRepeatable && s.yearlyActions[key]) {
      return { ok: false, msg: `Anda sudah melakukan ini dengan ${rel.name} tahun ini.` };
    }

    const c = Utils.getCountry(s.countryId);
    const longDist = rel.countryId !== s.countryId;

    // --- Luangkan masa ---
    if (action === 'spend_time') {
      s.yearlyActions[key] = true;
      rel.closeness = Utils.clamp(rel.closeness + Utils.randInt(8, 15));
      rel.trust = Utils.clamp((rel.trust || 60) + Utils.randInt(4, 10));
      if (rel.category === 'friend' && rel.closeness >= 85 && rel.trust >= 80) {
        rel.role = 'Sahabat Karib';
      }
      GameState.adjustStats({ happiness: 7 });
      const text = longDist
        ? `📱 Membuat panggilan video mesra bertanya khabar ${rel.name} di ${Utils.getCountry(rel.countryId).name}!`
        : (rel.category === 'partner' && !s.married)
          ? `☕ Berbual secara sopan dengan ${rel.name} (ditemani keluarga/di tempat awam) untuk saling mengenali hati budi.`
          : `😊 Meluangkan masa berkualiti bersama ${rel.name} di ${s.city}.`;
      GameState.addJournalEntry(text);
      GameState.save();
      return { ok: true, msg: `Hubungan dengan ${rel.name} makin erat!` };
    }

    // --- Hadiah ---
    if (action === 'gift') {
      const cost = Utils.usdToLocal(45, s.countryId);
      if (s.money < cost) return { ok: false, msg: `Perlukan ${Utils.formatMoney(cost, s.countryId)} untuk hadiah.` };
      s.yearlyActions[key] = true;
      s.money -= cost;
      rel.closeness = Utils.clamp(rel.closeness + Utils.randInt(12, 18));
      rel.trust = Utils.clamp((rel.trust || 60) + Utils.randInt(5, 10));
      GameState.adjustStats({ happiness: 6 });
      GameState.addJournalEntry(`🎁 Menghadiahkan cenderahati (${Utils.formatMoney(cost, s.countryId)}) kepada ${rel.name}!`);
      GameState.save();
      return { ok: true, msg: `${rel.name} amat menyukai hadiah anda!` };
    }

    // --- Rakan: Minta Rujukan Kerja / Peluang Bisnes ---
    if (action === 'ask_referral') {
      if (rel.category !== 'friend') return { ok: false, msg: 'Hanya untuk rakan!' };
      if (s.age < 18) return { ok: false, msg: 'Tunggu umur 18 tahun!' };
      if (rel.closeness < 70 || (rel.trust || 0) < 70) {
        return { ok: false, msg: `Perlukan Kemesraan 70%+ & Kepercayaan 70%+ bersama ${rel.name} dahulu!` };
      }
      s.yearlyActions[key] = true;
      if (s.job) {
        const bonus = Utils.usdToLocal(Utils.randInt(600, 2200), s.countryId);
        s.money += bonus;
        s.job.performance = Utils.clamp(s.job.performance + 8);
        GameState.adjustStats({ happiness: 8 });
        GameState.addJournalEntry(
          `🤝 Rakan anda, ${rel.name}, memperkenalkan pelanggan & rujukan projek yang memberi anda pendapatan tambahan ${Utils.formatMoney(bonus, s.countryId)}!`,
          'milestone'
        );
        GameState.save();
        return { ok: true, msg: `${rel.name} membantu anda meraih ${Utils.formatMoney(bonus, s.countryId)}!` };
      } else {
        const eligible = c.jobs.filter(j => (!j.reqDegree || s.education.hasDegree));
        const picked = Utils.pick(eligible) || c.jobs[0];
        s.job = {
          id: picked.id,
          title: picked.title,
          icon: picked.icon,
          salary: Math.round(picked.salary * 1.08),
          years: 0,
          performance: 72,
          countryId: s.countryId
        };
        GameState.adjustStats({ happiness: 14 });
        GameState.addJournalEntry(
          `💼 Melalui rujukan kuat daripada sahabat anda ${rel.name}, anda terus diterima bekerja sebagai ${picked.title} (${Utils.formatMoney(s.job.salary, s.countryId)}/thn)!`,
          'milestone'
        );
        GameState.save();
        return { ok: true, msg: `Berjaya dapat kerja sebagai ${picked.title} hasil rujukan ${rel.name}!` };
      }
    }

    // --- Rakan: Putuskan Persahabatan ---
    if (action === 'cut_ties') {
      rel.alive = false; // keluarkan daripada senarai aktif
      rel.category = 'ex';
      GameState.adjustStats({ happiness: -4 });
      GameState.addJournalEntry(`🚪 Anda memilih untuk menjauhkan diri daripada ${rel.name} demi ketenangan hidup.`);
      GameState.save();
      return { ok: true, msg: `Anda tidak lagi berkawan dengan ${rel.name}.` };
    }

    // --- Tinggal Bersama Sebelum Kahwin ---
    if (action === 'cohabit') {
      if (s.married || rel.stage === 'cohabiting') return { ok: false, msg: 'Anda sudah tinggal bersama!' };
      if (rel.closeness < 65) return { ok: false, msg: 'Eratkan kemesraan ke 65%+ dahulu!' };
      rel.stage = 'cohabiting';
      rel.closeness = Utils.clamp(rel.closeness + 10);
      GameState.adjustStats({ happiness: 10 });
      GameState.addJournalEntry(`🏠 Anda dan ${rel.name} memutuskan untuk tinggal sebumbung di ${s.city}.`, 'romance');
      GameState.save();
      return { ok: true, msg: `Anda kini tinggal bersama ${rel.name}!` };
    }

    // --- Merisik & Bertunang ---
    if (action === 'engage') {
      if (s.married) return { ok: false, msg: 'Anda sudah berkahwin!' };
      if (rel.stage === 'engaged') return { ok: false, msg: 'Anda sudah bertunang!' };
      const cost = Utils.usdToLocal(350, s.countryId);
      const closeness = rel.closeness ?? 60;
      const trust = rel.trust ?? 60;
      const yrsTogether = rel.yearsTogether ?? 0;
      const hasCrime = (s.criminalRecord || 0) > 0 || ((s.alignment && s.alignment.notoriety) || 0) >= 25 || Boolean(s.fugitive && s.fugitive.isFugitive);
      const isUnemployed = !s.job && !s.activeSpecialMode && !(s.isRetired || s.retired);
      const hasHeavyDebt = (s.money || 0) < cost || ((s.education && s.education.educationLoan > Utils.usdToLocal(25000, s.countryId)) && (s.money || 0) < cost * 2);

      // Jika gagal sediakan kos cincin & pertunangan
      if ((s.money || 0) < cost) {
        const hapLoss = -Utils.randInt(15, 25);
        const relLoss = Utils.randInt(20, 35);
        rel.closeness = Utils.clamp(closeness - relLoss, 0, 100);
        rel.trust = Utils.clamp(trust - Utils.randInt(10, 18), 0, 100);
        GameState.adjustStats({ happiness: hapLoss });
        if (s.alignment) s.alignment.stress = Utils.clamp((s.alignment.stress || 0) + 10, 0, 100);

        if (rel.closeness < 25) {
          s.partnerId = null;
          rel.category = 'ex';
          rel.role = 'Bekas Pasangan';
          GameState.recordCrisis('heartbreak');
          const brkMsg = `💔 Pinangan ditolak & hubungan putus! Anda gagal menyediakan kos cincin pertunangan (${Utils.formatMoney(cost, s.countryId)}) lalu ${rel.name} hilang keyakinan dan terus memutuskan hubungan.`;
          GameState.addJournalEntry(brkMsg, 'warning');
          GameState.save();
          return { ok: false, rejected: true, brokeUp: true, msg: brkMsg };
        }

        const rejMsg = `💔 Lamaran ditolak kerana anda tidak mampu menyediakan kos cincin pertunangan (${Utils.formatMoney(cost, s.countryId)})! (Gembira ${hapLoss}, Kemesraan -${relLoss}%)`;
        GameState.addJournalEntry(rejMsg, 'warning');
        GameState.save();
        return { ok: false, rejected: true, msg: rejMsg };
      }

      // Kira risiko penolakan semasa Merisik & Bertunang (0% jika Kemesraan >= 80%, Kepercayaan >= 75%, >=1 thn kenal, kerja stabil & tiada rekod jenayah)
      let rejectRisk = 0;
      const smoothReady = closeness >= 80 && trust >= 75 && yrsTogether >= 1 && !isUnemployed && !hasCrime && !hasHeavyDebt && !rel.unresolvedConflict;

      if (!smoothReady) {
        if (closeness < 70) rejectRisk += (70 - closeness) * 0.018;
        if (trust < 60) rejectRisk += (60 - trust) * 0.018;
        if (yrsTogether < 1) rejectRisk += 0.32;
        if (isUnemployed) rejectRisk += 0.28;
        if (hasHeavyDebt) rejectRisk += 0.20;
        if (hasCrime) rejectRisk += 0.38;
        if (rel.unresolvedConflict) rejectRisk += 0.22;
      }

      if (rejectRisk > 0 && Utils.chance(Math.min(0.92, rejectRisk))) {
        // Semak jika berpunca daripada Penolakan Keluarga Pasangan (rekod jenayah / reputasi buruk / tiada kerja)
        if (hasCrime || (isUnemployed && Utils.chance(0.65))) {
          const famEv = this.buildFamilyRejectionEvent(s, rel, 'Pertunangan');
          GameState.addJournalEntry(
            `🛑 PENOLAKAN KELUARGA PASANGAN: Ibu bapa ${rel.name} tidak merestui hubungan ini apabila anda hadir untuk melamar pertunangan!`,
            'warning'
          );
          GameState.save();
          return {
            ok: false,
            rejected: true,
            familyRejection: true,
            msg: `Ibu bapa ${rel.name} tidak merestui hubungan ini!`,
            followUpEvent: famEv
          };
        }

        // Penolakan oleh pasangan sendiri (terlalu awal / belum cukup kenal / kemesraan & kepercayaan rendah)
        const hapLoss = -Utils.randInt(15, 25);
        const relLoss = Utils.randInt(20, 35);
        rel.closeness = Utils.clamp(closeness - relLoss, 0, 100);
        rel.trust = Utils.clamp(trust - Utils.randInt(8, 16), 0, 100);
        GameState.adjustStats({ happiness: hapLoss });
        if (s.alignment) s.alignment.stress = Utils.clamp((s.alignment.stress || 0) + 10, 0, 100);

        let reasonText = 'hatinya masih ragu-ragu dan belum bersedia';
        if (yrsTogether < 1) reasonText = '"Terlalu awal / belum cukup kenal hati budi masing-masing"';
        else if (closeness < 70 || trust < 60) reasonText = 'kemesraan serta kepercayaan antara kalian masih goyah';
        else if (isUnemployed || hasHeavyDebt) reasonText = 'kedudukan kewangan dan kerjaya anda masih belum meyakinkan';

        if (rel.closeness < 25 || (rel.closeness < 38 && Utils.chance(0.45))) {
          s.partnerId = null;
          rel.category = 'ex';
          rel.role = 'Bekas Pasangan';
          GameState.recordCrisis('heartbreak');
          const brkLog = `💔 Lamaran pertunangan ditolak oleh ${rel.name} (${reasonText}). Ketegangan tersebut menyebabkan hubungan kalian terus terputus! (Gembira ${hapLoss})`;
          GameState.addJournalEntry(brkLog, 'warning');
          GameState.save();
          return { ok: false, rejected: true, brokeUp: true, msg: `Lamaran ditolak (${reasonText}) — ${rel.name} memutuskan hubungan!` };
        }

        const rejLog = `💔 ${rel.name} menolak hasrat bertunang buat masa ini kerana ${reasonText}. (Gembira ${hapLoss}, Kemesraan -${relLoss}%)`;
        GameState.addJournalEntry(rejLog, 'warning');
        GameState.save();
        return { ok: false, rejected: true, msg: `Lamaran ditolak: ${reasonText}` };
      }

      s.money -= cost;
      rel.stage = 'engaged';
      rel.role = 'Tunang';
      rel.engagedYear = s.year;
      rel.unresolvedConflict = false;
      rel.familyApprovalPending = false;
      rel.closeness = Utils.clamp(rel.closeness + 14);
      rel.trust = Utils.clamp((rel.trust || 65) + 12);
      GameState.adjustStats({ happiness: 16 });
      GameState.addJournalEntry(
        `💍 Anda dan ${rel.name} kini rasmi bertunang di ${s.city}!`,
        'romance'
      );
      GameState.save();
      return { ok: true, msg: `Tahniah! Anda kini bertunang dengan ${rel.name}!` };
    }

    // --- Lamar & Majlis Perkahwinan ---
    if (action === 'propose') {
      if (s.prison && s.prison.inPrison) return { ok: false, msg: '⛓️ Tidak boleh melangsungkan perkahwinan semasa berada di dalam penjara.' };
      if (s.married) return { ok: false, msg: 'Anda sudah berkahwin!' };

      const ringCost = Utils.usdToLocal(1800, s.countryId);
      const usePrenup = Boolean(opts && opts.hasPrenup);
      const prenupFee = (usePrenup && window.LegalInheritanceEngine)
        ? LegalInheritanceEngine.getPrenupFeeLocal(s.countryId)
        : 0;
      const totalCost = ringCost + prenupFee;
      const closeness = rel.closeness ?? 65;
      const trust = rel.trust ?? 65;
      const yrsTogether = rel.yearsTogether ?? 0;
      const hasCrime = (s.criminalRecord || 0) > 0 || ((s.alignment && s.alignment.notoriety) || 0) >= 25 || Boolean(s.fugitive && s.fugitive.isFugitive);
      const isUnemployed = !s.job && !s.activeSpecialMode && !(s.isRetired || s.retired);

      // Jika tidak mampu menyediakan Kos Majlis Perkahwinan & Cincin
      if (s.money < totalCost) {
        if (rel.stage !== 'engaged') {
          const hapLoss = -Utils.randInt(15, 25);
          const relLoss = Utils.randInt(20, 35);
          rel.closeness = Utils.clamp(closeness - relLoss, 0, 100);
          rel.trust = Utils.clamp(trust - Utils.randInt(10, 18), 0, 100);
          GameState.adjustStats({ happiness: hapLoss });
          const msg = `💔 Lamaran ditolak kerana anda tidak mampu menyediakan kos cincin & perkahwinan (${Utils.formatMoney(totalCost, s.countryId)})!`;
          GameState.addJournalEntry(`${msg} (Gembira ${hapLoss}, Kemesraan -${relLoss}%)`, 'warning');
          if (rel.closeness < 25) {
            s.partnerId = null;
            rel.category = 'ex';
            rel.role = 'Bekas Pasangan';
            GameState.recordCrisis('heartbreak');
          }
          GameState.save();
          return { ok: false, rejected: true, msg };
        }
        return { ok: false, msg: `Kos perkahwinan${usePrenup ? ' + Prenup' : ''} ialah ${Utils.formatMoney(totalCost, s.countryId)}.` };
      }

      // 1) Jika BELUM bertunang dan terus melamar: semak risiko penolakan lamaran / keluarga
      const smoothMarriageReady = closeness >= 80 && trust >= 75 && (yrsTogether >= 1 || rel.stage === 'engaged') && !isUnemployed && !hasCrime && !rel.unresolvedConflict;

      if (rel.stage !== 'engaged' && !smoothMarriageReady) {
        let propRejectRisk = 0;
        if (closeness < 70) propRejectRisk += (70 - closeness) * 0.02;
        if (trust < 60) propRejectRisk += (60 - trust) * 0.02;
        if (yrsTogether < 1) propRejectRisk += 0.35;
        if (isUnemployed) propRejectRisk += 0.30;
        if (hasCrime) propRejectRisk += 0.40;
        if (rel.unresolvedConflict) propRejectRisk += 0.25;

        if (propRejectRisk > 0 && Utils.chance(Math.min(0.92, propRejectRisk))) {
          if (hasCrime || (isUnemployed && Utils.chance(0.60))) {
            const famEv = this.buildFamilyRejectionEvent(s, rel, 'Lamaran Perkahwinan');
            GameState.addJournalEntry(
              `🛑 PENOLAKAN KELUARGA PASANGAN: Ibu bapa ${rel.name} menolak pinangan perkahwinan anda kerana tidak merestui latar belakang dan kedudukan semasa anda!`,
              'warning'
            );
            GameState.save();
            return {
              ok: false,
              rejected: true,
              familyRejection: true,
              msg: `Ibu bapa ${rel.name} tidak merestui perkahwinan ini!`,
              followUpEvent: famEv
            };
          }

          const hapLoss = -Utils.randInt(15, 25);
          const relLoss = Utils.randInt(20, 35);
          rel.closeness = Utils.clamp(closeness - relLoss, 0, 100);
          rel.trust = Utils.clamp(trust - Utils.randInt(10, 18), 0, 100);
          GameState.adjustStats({ happiness: hapLoss });
          if (s.alignment) s.alignment.stress = Utils.clamp((s.alignment.stress || 0) + 12, 0, 100);
          const why = yrsTogether < 1
            ? '"Terlalu awal / belum cukup kenal untuk berkahwin"'
            : (closeness < 70 || trust < 60)
              ? 'hubungan serta kepercayaan belum cukup kukuh'
              : 'kebimbangan terhadap kestabilan masa depan';

          if (rel.closeness < 25 || (rel.closeness < 38 && Utils.chance(0.5))) {
            s.partnerId = null;
            rel.category = 'ex';
            rel.role = 'Bekas Pasangan';
            GameState.recordCrisis('heartbreak');
            const brkMsg = `💔 Lamaran perkahwinan ditolak oleh ${rel.name} (${why}) dan hubungan kalian terus berakhir! (Gembira ${hapLoss})`;
            GameState.addJournalEntry(brkMsg, 'warning');
            GameState.save();
            return { ok: false, rejected: true, brokeUp: true, msg: brkMsg };
          }

          const rejMsg = `💔 Cincin lamaran ditolak oleh ${rel.name} kerana ${why}! (Gembira ${hapLoss}, Kemesraan -${relLoss}%)`;
          GameState.addJournalEntry(rejMsg, 'warning');
          GameState.save();
          return { ok: false, rejected: true, msg: rejMsg };
        }
      }

      // 2) SEMAKAN HARI PERKAHWINAN: Risiko "Putus Tunang / Batal Perkahwinan / Cold Feet Saat Akhir"
      // Hanya berlaku jika Kepercayaan < 55%, Kemesraan < 65%, konflik curang/persiapan belum selesai, atau tiada restu keluarga
      let coldFeetRisk = 0;
      if (!smoothMarriageReady) {
        if (trust < 55) coldFeetRisk += 0.45 + (55 - trust) * 0.012;
        if (closeness < 65) coldFeetRisk += 0.35 + (65 - closeness) * 0.012;
        if (rel.unresolvedConflict) coldFeetRisk += 0.35;
        if (rel.familyApprovalPending && (isUnemployed || hasCrime)) coldFeetRisk += 0.35;
      }

      if (coldFeetRisk > 0 && Utils.chance(Math.min(0.95, coldFeetRisk))) {
        const depositLost = Math.min(s.money, Math.round(ringCost * 0.55));
        s.money = Math.max(0, s.money - depositLost);
        const hapHit = -Utils.randInt(30, 45);
        const stressHit = Utils.randInt(18, 28);
        GameState.adjustStats({ happiness: hapHit });
        if (s.alignment) s.alignment.stress = Utils.clamp((s.alignment.stress || 0) + stressHit, 0, 100);
        GameState.recordCrisis('heartbreak');

        const isColdFeet = Utils.chance(0.5);
        const cancelCause = rel.unresolvedConflict
          ? 'isu kecurangan dan konflik lama yang tidak selesai'
          : (trust < 55)
            ? 'kepercayaan yang sudah retak'
            : 'pertelingkahan keluarga serta isu persiapan majlis saat akhir';

        s.partnerId = null;
        s.married = false;
        rel.category = 'ex';
        rel.stage = 'ex';
        rel.role = 'Bekas Tunang';
        rel.closeness = 10;
        rel.trust = 10;

        const cancelLog = isColdFeet
          ? `🚨 PASANGAN TARIK DIRI SAAT AKHIR (Cold Feet)! Pada hari majlis perkahwinan, ${rel.name} membatalkan perkahwinan akibat ${cancelCause}. Majlis terpaksa dibatalkan, deposit hangus sebanyak ${Utils.formatMoney(depositLost, s.countryId)}, dan hati anda hancur luluh (Gembira ${hapHit}, Stres +${stressHit}%).`
          : `💔 PUTUS TUNANG & BATAL PERKAHWINAN! Menjelang hari perkahwinan, pertelingkahan mengenai ${cancelCause} menyebabkan pertunangan bersama ${rel.name} terputus. Deposit majlis ${Utils.formatMoney(depositLost, s.countryId)} hangus tidak dapat dikembalikan (Gembira ${hapHit}, Stres +${stressHit}%).`;

        GameState.addJournalEntry(cancelLog, 'warning');
        GameState.save();
        return {
          ok: false,
          rejected: true,
          weddingCancelled: true,
          depositLost,
          msg: isColdFeet
            ? `🚨 ${rel.name} tarik diri saat akhir (Cold Feet)! Majlis batal & deposit ${Utils.formatMoney(depositLost, s.countryId)} hangus.`
            : `💔 Putus Tunang & Batal Perkahwinan! Deposit majlis ${Utils.formatMoney(depositLost, s.countryId)} hangus.`
        };
      }

      if (window.LegalInheritanceEngine && LegalInheritanceEngine.recordMarriageStart) {
        LegalInheritanceEngine.recordMarriageStart(s, rel, usePrenup);
      }
      s.money -= totalCost;
      s.married = true;
      s.maritalStatus = null;
      rel.category = 'spouse';
      rel.stage = 'married';
      rel.role = rel.gender === 'female' ? 'Isteri' : 'Suami';
      rel.closeness = 100;
      rel.trust = Utils.clamp((rel.trust || 75) + 15);
      rel.unresolvedConflict = false;
      rel.familyApprovalPending = false;
      GameState.adjustStats({ happiness: 24, adaptation: 12 });
      GameState.addJournalEntry(
        `💍 Anda selamat berkahwin dengan ${rel.name} dalam majlis perkahwinan indah di ${s.city}, ${c.name} ${c.flag}!${usePrenup ? ' (Perjanjian Pra-Perkahwinan / Prenup ditandatangani untuk melindungi aset sebelum kahwin).' : ''}`,
        'romance'
      );
      GameState.save();
      return { ok: true, msg: `Tahniah! Selamat pengantin baru bersama ${rel.name}!` };
    }

    // --- Percutian / Luangkan Masa Rumah Tangga ---
    if (action === 'family_trip') {
      if (!s.married) return { ok: false, msg: 'Hanya untuk pasangan berkahwin!' };
      const cost = Utils.usdToLocal(450, s.countryId);
      if (s.money < cost) return { ok: false, msg: `Perlukan ${Utils.formatMoney(cost, s.countryId)} untuk percutian keluarga.` };
      s.yearlyActions[key] = true;
      s.money -= cost;
      rel.closeness = Utils.clamp(rel.closeness + 18);
      rel.trust = Utils.clamp((rel.trust || 70) + 12);
      GameState.adjustStats({ happiness: 14, health: 4 });
      GameState.addJournalEntry(`✈️ Percutian manis bersama ${rel.role.toLowerCase()} anda, ${rel.name}, menyegarkan semula keharmonian rumah tangga!`, 'romance');
      GameState.save();
      return { ok: true, msg: 'Rumah tangga semakin harmoni!' };
    }

    // --- Timang Cahaya Mata (Kesuburan Realistik, Menopaus, Ketidaksuburan & Pasangan Tidak Mahu Anak) ---
    if (action === 'have_kid') {
      if (s.age < 18) return { ok: false, msg: 'Tunggu sehingga dewasa!' };
      if (s.pregnancy && s.pregnancy.active) {
        return { ok: false, msg: 'Kehamilan sedang berlangsung — bayi akan dilahirkan pada tahun hadapan!' };
      }
      if (s.yearlyActions.tried_kid || s.yearlyActions.had_kid) {
        return { ok: false, msg: 'Anda sudah mencuba untuk mendapatkan cahaya mata tahun ini.' };
      }

      // 1. Semak jika pasangan tidak mahu anak
      if (rel.wantsChildren === false) {
        return {
          ok: false,
          msg: 'Pasangan anda tidak mahu mempunyai anak.',
          followUpEvent: window.RelationshipDramaData
            ? RelationshipDramaData.buildChildfreeRefusalEvent(s, rel)
            : null
        };
      }

      // 2. Kenal pasti pihak ibu (wanita)
      const mother = s.gender === 'female' ? s : (rel.gender === 'female' ? rel : null);
      if (!mother) {
        return {
          ok: false,
          msg: 'Kehamilan semula jadi memerlukan pasangan berlawanan jantina. Anda boleh pertimbangkan Ambil Anak Angkat.'
        };
      }

      // 3. Semak fasa menopaus
      const menoAge = mother.menopauseAge || 49;
      if (mother.age >= menoAge) {
        const msg = 'Sudah mencapai fasa menopaus — tidak lagi boleh mengandung secara semula jadi.';
        GameState.addJournalEntry(`🩺 ${mother === s ? 'Anda' : rel.name} (${mother.age} thn): ${msg}`, 'culture');
        GameState.save();
        return { ok: false, msg };
      }

      s.yearlyActions.tried_kid = true;

      // 4. Semak ketidaksuburan (isInfertile)
      if (mother.isInfertile) {
        s.conceptionAttempts = (s.conceptionAttempts || 0) + 1;
        if (s.conceptionAttempts >= 2) {
          s.infertilityDiagnosed = true;
          const diagMsg = `🩺 Diagnosis Pakar Kesuburan: ${mother === s ? 'Anda' : rel.name} disahkan mengalami masalah ketidaksuburan dan tidak dapat hamil secara semula jadi. Anda boleh mempertimbangkan alternatif Ambil Anak Angkat di tab Hubungan.`;
          GameState.addJournalEntry(diagMsg, 'warning');
          GameState.save();
          return {
            ok: false,
            diagnosedInfertile: true,
            msg: 'Disahkan mengalami masalah ketidaksuburan — pertimbangkan Ambil Anak Angkat sebagai alternatif.'
          };
        }
        GameState.addJournalEntry(`💭 Percubaan untuk mendapatkan cahaya mata bersama ${rel.name} belum membuahkan hasil tahun ini.`, 'normal');
        GameState.save();
        return { ok: false, msg: 'Belum ada rezeki kehamilan tahun ini. Cuba lagi atau jalani pemeriksaan kesihatan.' };
      }

      // 5. Kira peluang kesuburan mengikut usia (menurun perlahan selepas 35, mendadak selepas 40)
      const chance = this.computeConceptionChance(mother);
      if (!Utils.chance(chance)) {
        GameState.addJournalEntry(`💭 Anda dan ${rel.name} mencuba untuk menimang cahaya mata tahun ini, namun belum ada rezeki kehamilan.`, 'normal');
        GameState.save();
        return { ok: false, msg: 'Belum ada rezeki kehamilan tahun ini. Cuba lagi tahun hadapan!' };
      }

      // 6. Kehamilan berjaya! Bayi akan dilahirkan (atau diuji risiko keguguran) semasa +UMUR
      s.pregnancy = {
        active: true,
        partnerId: rel.id,
        partnerName: rel.name,
        motherIsPlayer: mother === s,
        motherAge: mother.age,
        isOutOfWedlock: !s.married,
        conceivedYear: s.year,
        countryId: s.countryId
      };
      s.yearlyActions.had_kid = true;
      GameState.adjustStats({ happiness: 14 });
      GameState.addJournalEntry(
        `🤰 Berita gembira! ${mother === s ? 'Anda' : rel.name} telah disahkan hamil (usia ibu ${mother.age} thn)! Jaga kesihatan & kurangkan stres sementara menanti kelahiran tahun hadapan.`,
        'milestone'
      );
      GameState.save();
      return { ok: true, msg: `🤰 Tahniah! ${mother === s ? 'Anda' : rel.name} disahkan hamil — bayi bakal lahir tahun hadapan!` };
    }

    // --- Putus / Bercerai ---
    if (action === 'ask_money') {
      if (s.age < 6) return { ok: false, msg: 'Anda masih terlalu kecil untuk meminta duit.' };
      const isParent = ['Ibu', 'Ayah', 'Mother', 'Father'].includes(rel.role);
      const isPartner = rel.id === s.partnerId;
      const isSibling = /Abang|Kakak|Adik|Sibling/i.test(rel.role || '');
      const isFriend = rel.category === 'friend';
      if (!isParent && !isPartner && !isSibling && !isFriend) {
        return { ok: false, msg: 'Anda tidak boleh meminta duit daripada kenalan ini.' };
      }
      s.askedMoneyCountThisYear = s.askedMoneyCountThisYear || 0;
      if (s.askedMoneyCountThisYear >= 3) {
        return { ok: false, msg: 'Anda sudah terlalu kerap meminta duit daripada orang lain tahun ini.' };
      }
      s.askedMoneyCountThisYear += 1;
      const cl = rel.closeness ?? 50;
      const isYoung = s.age < 18;
      let chance = isParent
        ? Math.max(0.25, Math.min(0.90, 0.28 + cl / 125))
        : Math.max(0.15, Math.min(0.78, 0.18 + cl / 145));

      if (Utils.chance(chance)) {
        let usd = 0;
        let partial = false;
        if (isParent) {
          if (isYoung) {
            usd = Utils.randInt(5, 15 + Math.min(30, s.age * 2));
          } else {
            usd = Utils.randInt(120, Math.round(350 + cl * 5));
          }
        } else {
          // Pasangan atau Adik-Beradik: boleh beri jumlah penuh atau lebih kecil
          partial = Utils.chance(0.42);
          if (isYoung) {
            usd = partial ? Utils.randInt(3, 10) : Utils.randInt(8, 25);
          } else {
            usd = partial ? Utils.randInt(25, 110) : Utils.randInt(80, Math.round(220 + cl * 3));
          }
        }
        const amount = Math.max(1, Utils.usdToLocal(usd, s.countryId));
        s.money += amount;
        rel._askMoneyRefusals = 0;
        const formatted = Utils.formatMoney(amount, s.countryId);
        const msg = partial
          ? `${rel.name} tidak mampu beri banyak, tetapi tetap menghulurkan ${formatted} untuk membantu anda.`
          : `${rel.name} bermurah hati memberikan anda ${formatted}.`;
        GameState.addJournalEntry(`💸 Minta Duit (${rel.name}): ${msg}`, 'culture');
        GameState.save();
        return { ok: true, msg };
      }

      // Ditolak
      rel._askMoneyRefusals = (rel._askMoneyRefusals || 0) + 1;
      const dropRel = cl < 55 || rel._askMoneyRefusals >= 2;
      if (dropRel) {
        rel.closeness = Utils.clamp(cl - Utils.randInt(3, 6), 0, 100);
      }
      const rejectLines = isParent
        ? [
            `${rel.name} menolak dengan tegas dan menasihati anda supaya belajar berdikari.`,
            `${rel.name} berkata perbelanjaan keluarga agak ketat bulan ini dan tidak dapat memberi wang.`
          ]
        : [
            `${rel.name} menolak permintaan anda kerana kewangannya sendiri sedang sempit.`,
            `${rel.name} menggeleng kepala dan meminta maaf kerana tidak dapat meminjamkan duit buat masa ini.`
          ];
      const msg = Utils.pick(rejectLines);
      GameState.addJournalEntry(`💸 Minta Duit (${rel.name}): ${msg}`, 'warning');
      GameState.save();
      return { ok: false, msg };
    }

    if (action === 'steal_money') {
      if (s.age < 7) return { ok: false, msg: 'Anda masih terlalu kecil untuk melakukan tindakan ini.' };
      const isParent = ['Ibu', 'Ayah', 'Mother', 'Father'].includes(rel.role);
      const isPartner = rel.id === s.partnerId;
      const isSibling = /Abang|Kakak|Adik|Sibling/i.test(rel.role || '');
      const isFriend = rel.category === 'friend';
      if (!isParent && !isPartner && !isSibling && !isFriend) {
        return { ok: false, msg: 'Anda tidak boleh mencuri duit daripada kenalan ini.' };
      }
      if (!Array.isArray(s.stoleMoneyIdsThisYear)) s.stoleMoneyIdsThisYear = [];
      if (s.stoleMoneyIdsThisYear.includes(rel.id)) {
        return { ok: false, msg: `Anda sudah mencuba mencuri wang daripada ${rel.name} tahun ini.` };
      }
      s.stoleMoneyIdsThisYear.push(rel.id);

      const smarts = (s.stats && s.stats.smarts) || 50;
      const trust = rel.trust ?? 60;
      // Peluang berjaya senyap-senyap (dipengaruhi kepintaran & tahap kepercayaan mangsa)
      const successChance = Math.max(0.22, Math.min(0.68, 0.36 + (smarts - 50) / 260 + (trust >= 60 ? 0.08 : -0.06)));
      const usd = s.age < 18 ? Utils.randInt(5, 35) : Utils.randInt(20, 160);
      const stolenLocal = Math.max(1, Utils.usdToLocal(usd, s.countryId));

      if (Utils.chance(successChance)) {
        s.money += stolenLocal;
        if (window.KarmaEndings) KarmaEndings.adjustAlignment({ karma: -Utils.randInt(14, 20), stress: 5 });
        const formatted = Utils.formatMoney(stolenLocal, s.countryId);
        const msg = `Anda berjaya menyelinap dan mencuri ${formatted} daripada dompet ${rel.name} tanpa disedari.`;
        GameState.addJournalEntry(`🕵️ Curi Duit (${rel.name}): ${msg}`, 'warning');
        GameState.save();
        return { ok: true, msg };
      }

      // KANTOI!
      rel.closeness = 0;
      rel.trust = 0;
      const heatAdd = (isFriend || isPartner) ? Utils.randInt(4, 7) : 0;
      if (window.KarmaEndings) {
        KarmaEndings.adjustAlignment({ karma: -Utils.randInt(22, 30), stress: 12, notoriety: heatAdd });
      }

      if (isPartner) {
        if (Utils.chance(0.80)) {
          const wasMarried = Boolean(s.married);
          this._endPartnerFromCheating(s, rel, { lessDrama: false, keepZeroStats: true });
          const msg = wasMarried
            ? `KANTOI! ${rel.name} menangkap anda mencuri wangnya, memfailkan penceraian serta-merta dan mengugut melaporkannya kepada polis!`
            : `KANTOI! ${rel.name} menangkap anda mencuri wangnya dan terus memutuskan hubungan serta-merta!`;
          GameState.addJournalEntry(`🕵️💔 ${msg}`, 'warning');
          GameState.save();
          return { ok: false, brokeUp: true, msg };
        }
        GameState.adjustStats({ happiness: -12 });
        const msg = `KANTOI! ${rel.name} menangkap anda mencuri wangnya. Kepercayaan dan kemesraan kini jatuh ke 0%!`;
        GameState.addJournalEntry(`🕵️ ${msg}`, 'warning');
        GameState.save();
        return { ok: false, msg };
      }

      if (isFriend) {
        if (Utils.chance(0.80)) {
          s.relationships = s.relationships.filter(r => r.id !== rel.id);
          GameState.adjustStats({ happiness: -10 });
          const msg = `KANTOI! ${rel.name} menangkap anda mencuri duitnya, memutuskan persahabatan serta-merta dan mengugut melaporkan kepada polis!`;
          GameState.addJournalEntry(`🕵️💔 ${msg}`, 'warning');
          GameState.save();
          return { ok: false, brokeUp: true, msg };
        }
        GameState.adjustStats({ happiness: -8 });
        const msg = `KANTOI! ${rel.name} menangkap anda mencuri duitnya. Kepercayaan terhadap anda kini 0%!`;
        GameState.addJournalEntry(`🕵️ ${msg}`, 'warning');
        GameState.save();
        return { ok: false, msg };
      }

      // Famili (Ibu/Bapa/Adik-Beradik)
      GameState.adjustStats({ happiness: -10 });
      const msg = `KANTOI! ${rel.name} menangkap anda mencuri wang keluarga! ${rel.name} amat kecewa dan marah — kepercayaan terhadap anda kini 0%!`;
      GameState.addJournalEntry(`🕵️ ${msg}`, 'warning');
      GameState.save();
      return { ok: false, msg };
    }

    if (action === 'breakup') {
      const wasMarried = s.married;
      if (wasMarried && window.LegalInheritanceEngine && !(opts && opts.forceSimple)) {
        return {
          ok: true,
          msg: 'Membuka prosiding penceraian mahkamah...',
          openDivorceModal: { partnerId: rel.id, initiatedBy: 'player', reason: 'Permohonan penceraian' }
        };
      }
      s.partnerId = null;
      s.married = false;
      rel.category = 'ex';
      rel.role = wasMarried ? 'Bekas Pasangan (Cerai)' : 'Bekas Pasangan';
      rel.closeness = 15;
      rel.trust = 20;
      if (wasMarried && s.money > 0) {
        const settle = Math.round(s.money * 0.15);
        s.money -= settle;
      }
      GameState.adjustStats({ happiness: wasMarried ? -18 : -12 });
      GameState.recordCrisis('heartbreak');
      GameState.addJournalEntry(
        wasMarried
          ? `💔 Perkahwinan anda dan ${rel.name} berakhir dengan penceraian. Hati terasa berat namun hidup mesti diteruskan.`
          : `💔 Anda dan ${rel.name} membawa haluan masing-masing.`,
        'warning'
      );
      GameState.save();
      return { ok: true, msg: wasMarried ? `Anda dan ${rel.name} telah bercerai.` : `Hubungan dengan ${rel.name} berakhir.` };
    }

    return { ok: false, msg: 'Tindakan tidak dikenali.' };
  },


  _endPartnerFromCheating(s, partner, opts = {}) {
    const wasMarried = Boolean(s.married);
    s.partnerId = null;
    s.married = false;
    partner.category = 'ex';
    partner.role = wasMarried ? 'Bekas Pasangan (Cerai)' : 'Bekas Pasangan';
    partner.closeness = opts.keepZeroStats ? 0 : 5;
    partner.trust = opts.keepZeroStats ? 0 : 5;
    if (wasMarried && s.money > 0) {
      s.money -= Math.round(s.money * 0.20);
    }
    if (opts.lessDrama) {
      GameState.adjustStats({ happiness: wasMarried ? -12 : -8 });
      if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: 4 });
    } else {
      GameState.adjustStats({ happiness: wasMarried ? -24 : -18 });
      if (window.KarmaEndings) KarmaEndings.adjustAlignment({ fame: -10, stress: 12 });
    }
    GameState.recordCrisis('heartbreak');
  },

  attemptCheat() {
    const s = GameState.current;
    if (!s || !s.partnerId) return { ok: false, msg: 'Anda tidak mempunyai pasangan buat masa ini.' };
    if (s.yearlyActions.cheatedThisYear) return { ok: false, msg: 'Anda sudah bermain kayu tiga tahun ini.' };
    const partner = s.relationships.find(r => r.id === s.partnerId && r.alive);
    if (!partner) return { ok: false, msg: 'Pasangan tidak ditemui.' };

    s.yearlyActions.cheatedThisYear = true;
    const karmaDrop = -Utils.randInt(12, 18);
    if (window.KarmaEndings) KarmaEndings.adjustAlignment({ karma: karmaDrop });

    const smarts = (s.stats && s.stats.smarts) || 50;
    const cl = partner.closeness ?? 60;
    const caughtChance = Math.max(0.28, Math.min(0.75, 0.52 - (smarts - 50) / 300 + (cl - 50) / 400));

    if (!Utils.chance(caughtChance)) {
      if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: 6 });
      GameState.addJournalEntry(
        `💔 Anda menjalin hubungan sulit di belakang ${partner.name}. Buat masa ini, rahsia anda masih tersimpan rapi.`,
        'warning'
      );
      GameState.save();
      return { ok: true, caught: false, msg: 'Anda berjaya menyembunyikan kecurangan anda buat masa ini.' };
    }

    // Kantoi! Pilih sama ada terus putus/cerai atau konfrontasi 3 pilihan
    const instantChance = cl < 65 ? 0.48 : 0.32;
    if (Utils.chance(instantChance)) {
      const wasMarried = Boolean(s.married);
      this._endPartnerFromCheating(s, partner, { lessDrama: false });
      const msg = wasMarried
        ? `KANTOI! ${partner.name} menangkap anda curang dan terus memfailkan penceraian serta mendedahkan skandal anda!`
        : `KANTOI! ${partner.name} menangkap anda bermesra dengan orang lain dan terus memutuskan hubungan!`;
      GameState.addJournalEntry(`💔 ${msg}`, 'warning');
      GameState.save();
      return { ok: false, caught: true, instantBreakup: true, msg };
    }

    GameState.save();
    return {
      ok: false,
      caught: true,
      confrontation: {
        partnerId: partner.id,
        partnerName: partner.name,
        wasMarried: Boolean(s.married)
      }
    };
  },

  resolveCheatConfrontation(partnerId, choice) {
    const s = GameState.current;
    const partner = s && s.relationships.find(r => r.id === partnerId && r.alive);
    if (!partner) return { ok: false, msg: 'Pasangan tidak ditemui.' };
    const wasMarried = Boolean(s.married);
    const smarts = (s.stats && s.stats.smarts) || 50;
    const cl = partner.closeness ?? 60;

    if (choice === 'lie') {
      const chance = Math.max(0.15, Math.min(0.62, 0.18 + smarts / 240 + cl / 450));
      if (Utils.chance(chance)) {
        partner.closeness = Utils.clamp(cl - 28, 5, 100);
        partner.trust = Utils.clamp((partner.trust ?? 65) - 35, 5, 100);
        if (window.KarmaEndings) KarmaEndings.adjustAlignment({ karma: -6, stress: 14 });
        const msg = `${partner.name} kelihatan masih sangsi, tetapi akhirnya termakan alasan anda. Hubungan terselamat namun sangat renggang.`;
        GameState.addJournalEntry(`🤥 Konfrontasi Curang: ${msg}`, 'warning');
        GameState.save();
        return { ok: true, brokeUp: false, msg };
      }
      this._endPartnerFromCheating(s, partner, { lessDrama: false });
      const msg = wasMarried
        ? `Penipuan anda terbongkar di depan mata! ${partner.name} berang dan menamatkan perkahwinan serta-merta.`
        : `Penipuan anda tidak menjadi! ${partner.name} terus memutuskan hubungan dengan anda.`;
      GameState.addJournalEntry(`💔 Konfrontasi Curang: ${msg}`, 'warning');
      GameState.save();
      return { ok: false, brokeUp: true, msg };
    }

    if (choice === 'apologize') {
      const forgiveChance = Math.max(0.12, Math.min(0.38, 0.14 + cl / 350));
      if (Utils.chance(forgiveChance)) {
        partner.closeness = Utils.clamp(cl - 35, 5, 100);
        partner.trust = Utils.clamp((partner.trust ?? 65) - 42, 5, 100);
        if (window.KarmaEndings) KarmaEndings.adjustAlignment({ karma: 2, stress: 8 });
        const msg = `Dengan linangan air mata, ${partner.name} memilih untuk memberi peluang kedua — namun kepercayaan telah retak teruk.`;
        GameState.addJournalEntry(`😔 Konfrontasi Curang: ${msg}`, 'warning');
        GameState.save();
        return { ok: true, brokeUp: false, msg };
      }
      this._endPartnerFromCheating(s, partner, { lessDrama: false });
      const msg = wasMarried
        ? `${partner.name} tidak sanggup memaafkan pengkhianatan anda dan memilih untuk bercerai.`
        : `${partner.name} menolak permohonan maaf anda dan menamatkan hubungan.`;
      GameState.addJournalEntry(`💔 Konfrontasi Curang: ${msg}`, 'warning');
      GameState.save();
      return { ok: false, brokeUp: true, msg };
    }

    // breakup: Mengaku & Putus Terus
    this._endPartnerFromCheating(s, partner, { lessDrama: true });
    const msg = wasMarried
      ? `Anda mengaku salah dan bersetuju bercerai secara baik dengan ${partner.name} tanpa memanjangkan drama.`
      : `Anda mengaku salah dan mengakhiri hubungan dengan ${partner.name} secara terus terang.`;
    GameState.addJournalEntry(`🚪 Konfrontasi Curang: ${msg}`, 'warning');
    GameState.save();
    return { ok: true, brokeUp: true, msg };
  },

  computeConceptionChance(mother) {
    if (!mother || mother.isInfertile) return 0;
    const menoAge = mother.menopauseAge || 49;
    if (mother.age >= menoAge) return 0;
    const baseFertility = Utils.clamp(mother.fertility ?? 75, 5, 100) / 100;
    let ageFactor = 1.0;
    if (mother.age > 40) {
      ageFactor = Math.max(0.10, 0.55 - (mother.age - 40) * 0.10);
    } else if (mother.age > 35) {
      ageFactor = 1.0 - (mother.age - 35) * 0.09;
    }
    return Math.max(0.05, Math.min(0.92, baseFertility * ageFactor * 0.90));
  },

  generateBabyDraft(s, opts = {}) {
    const c = Utils.getCountry(s.countryId);
    const gender = opts.gender || (Utils.chance(0.5) ? 'male' : 'female');
    const isAdopted = Boolean(opts.isAdopted);
    const isOutOfWedlock = Boolean(opts.isOutOfWedlock);
    const kidAge = typeof opts.kidAge === 'number' ? opts.kidAge : 0;
    const partner = opts.partnerId ? (s.relationships || []).find(r => r.id === opts.partnerId) : null;
    const heritage = (s.heritageId && c.names[s.heritageId]) ? s.heritageId : Utils.pick(c.heritages).id;
    const fatherFullName = isAdopted
      ? null
      : (s.gender === 'male' ? s.name : (partner ? partner.name : null));

    const suggestedName = Utils.generateChildName({
      countryId: s.countryId,
      gender,
      heritageId: heritage,
      fatherFullName,
      isAdopted,
      isOutOfWedlock
    });

    const stats = opts.stats || {
      smarts: Utils.randInt(48, 92),
      health: Utils.randInt(72, 98),
      looks: Utils.randInt(50, 94)
    };

    return {
      gender,
      isAdopted,
      isOutOfWedlock,
      kidAge,
      partnerId: opts.partnerId || null,
      partnerName: partner ? partner.name : (opts.partnerName || null),
      heritage,
      fatherFullName,
      suggestedName,
      stats
    };
  },

  finalizeChildBirth(s, draft, customInputName = '') {
    if (!s || !draft) return { ok: false, msg: 'Data kelahiran tidak sah.' };
    const c = Utils.getCountry(s.countryId);
    const trimmed = String(customInputName || '').trim();
    let finalName = draft.suggestedName;

    if (trimmed) {
      // Jika pemain memasukkan nama penuh sendiri (ada bin/binti atau ruang nama keluarga), kekalkan;
      // jika hanya nama panggilan tunggal, formatkan dengan bin/binti atau nama keluarga dengan kemas.
      if (/\s+(?:bin|binti|binte)\s+/i.test(trimmed) || trimmed.includes(' ')) {
        finalName = trimmed;
      } else {
        finalName = Utils.generateChildName({
          countryId: s.countryId,
          gender: draft.gender,
          heritageId: draft.heritage,
              fatherFullName: draft.fatherFullName,
          isAdopted: draft.isAdopted,
          isOutOfWedlock: draft.isOutOfWedlock,
          customGivenName: trimmed
        });
      }
    }

    if (draft.isAdopted) {
      const fee = Utils.usdToLocal(900, s.countryId);
      if (s.money < fee) return { ok: false, msg: `Kos dokumentasi pengambilan anak angkat ialah ${Utils.formatMoney(fee, s.countryId)}.` };
      s.money -= fee;
      s.yearlyActions.adoptedChild = true;
    }

    const childObj = {
      id: (draft.isAdopted ? 'rel_adopt_' : 'rel_kid_') + Date.now() + '_' + Utils.randInt(10, 99),
      name: finalName,
      role: draft.gender === 'male' ? 'Anak Lelaki' : 'Anak Perempuan',
      category: 'family',
      gender: draft.gender,
      age: draft.kidAge || 0,
      countryId: s.countryId,
      closeness: draft.isAdopted ? 90 : 100,
      trust: draft.isAdopted ? 90 : 100,
      compatibility: 95,
      isAdopted: Boolean(draft.isAdopted),
      isOutOfWedlock: Boolean(draft.isOutOfWedlock),
      educationCare: 68,
      healthCare: 78,
      morals: 72,
      rebelliousness: 8,
      isDelinquent: false,
      stats: {
        smarts: (draft.stats && draft.stats.smarts) || Utils.randInt(55, 88),
        health: (draft.stats && draft.stats.health) || Utils.randInt(76, 98)
      },
      alive: true,
      isAlive: true,
      job: (draft.kidAge || 0) < 4 ? 'Bayi' : 'Pelajar'
    };
    this.ensureChildEducationFields(s, childObj);

    s.relationships.push(childObj);
    GameState.adjustStats({ happiness: draft.isAdopted ? 20 : 24 });
    GameState.addJournalEntry(
      draft.isAdopted
        ? `🏡 Anda mengambil seorang anak angkat ${draft.gender === 'male' ? 'lelaki' : 'perempuan'} berusia ${draft.kidAge} tahun, ${finalName}, ke dalam keluarga anda di ${s.city}!`
        : `👶 Tahniah! Bayi ${draft.gender === 'male' ? 'lelaki' : 'perempuan'} anda${draft.partnerName ? ` bersama ${draft.partnerName}` : ''}, ${finalName}, selamat dilahirkan di ${s.city}, ${c.name} ${c.flag}!`,
      'milestone'
    );
    GameState.save();
    return { ok: true, child: childObj, msg: `Selamat datang ke keluarga, ${finalName}!` };
  },

  // --------------------------------------------------------------------------
  // 4. AMBIL ANAK ANGKAT (Membuka Modal Penamaan Anak)
  // --------------------------------------------------------------------------
  adoptChild() {
    const s = GameState.current;
    GameState.ensureUpgradedState();
    this.ensureRelationshipFields(s);

    if (s.prison && s.prison.inPrison) return { ok: false, msg: '⛓️ Tidak boleh mengambil anak angkat semasa berada di dalam penjara.' };
    if (s.age < 21) return { ok: false, msg: 'Anda perlu berumur sekurang-kurangnya 21 tahun untuk mengambil anak angkat.' };
    if (s.yearlyActions.adoptedChild) return { ok: false, msg: 'Anda sudah mengambil anak angkat tahun ini.' };

    const fee = Utils.usdToLocal(900, s.countryId);
    if (s.money < fee) return { ok: false, msg: `Kos dokumentasi pengambilan anak angkat ialah ${Utils.formatMoney(fee, s.countryId)}.` };

    const draft = this.generateBabyDraft(s, {
      isAdopted: true,
      kidAge: Utils.randInt(0, 5)
    });
    return { ok: true, msg: 'Sila namakan anak angkat baharu anda!', openBabyNamingModal: draft };
  },

  // --------------------------------------------------------------------------
  // 5. KEIBUBAPAAN & DIDIKAN ANAK (UMUR 0–17, MAKSIMUM 3 TINDAKAN/TAHUN/ANAK)
  // --------------------------------------------------------------------------
  getChildEduActionMeta(age) {
    const a = Number(age) || 0;
    if (a <= 3) {
      return {
        icon: '🧸',
        title: 'Stimulasi Awal & Rangsangan Bayi',
        desc: 'Rangsang perkembangan otak, deria & kemahiran motor bayi',
        costUsd: 75,
        smartsBoost: [3, 6],
        logFn: (name, costStr) => `🧸 Anda menyediakan aktiviti stimulasi awal & rangsangan minda untuk ${name} (${costStr}). Perkembangan awal bayinya amat memberangsangkan!`,
        toastFn: (name, care) => `Perkembangan awal ${name} meningkat (${care}%)!`
      };
    }
    if (a <= 6) {
      return {
        icon: '📖',
        title: 'Buku Cerita & Latihan Membaca di Rumah',
        desc: 'Aktiviti tambahan di rumah untuk mengukuhkan asas membaca & mengira',
        costUsd: 80,
        smartsBoost: [3, 5],
        logFn: (name, costStr) => `📖 Anda membeli buku cerita & melatih ${name} membaca di rumah (${costStr}). Asas pembelajarannya semakin kukuh!`,
        toastFn: (name, care) => `Minat belajar ${name} meningkat (${care}%)!`
      };
    }
    if (a <= 12) {
      return {
        icon: '📚',
        title: 'Kelas Tuisyen Tambahan (Pilihan)',
        desc: 'Tuisyen sampingan luar waktu sekolah (+3 hingga +5% Kepintaran)',
        costUsd: 110,
        smartsBoost: [3, 5],
        logFn: (name, costStr) => `📚 Anda menghantar ${name} ke kelas tuisyen tambahan (${costStr}) sebagai sokongan sampingan kepada pembelajaran sekolah rendahnya.`,
        toastFn: (name, care) => `Tuisyen tambahan ${name} selesai (${care}%)!`
      };
    }
    return {
      icon: '📝',
      title: 'Tuisyen Tambahan Peperiksaan (Pilihan)',
      desc: 'Kelas tambahan pilihan luar waktu sekolah (+3 hingga +5% Kepintaran)',
      costUsd: 130,
      smartsBoost: [3, 5],
      logFn: (name, costStr) => `📝 Anda mendaftarkan ${name} ke kelas tuisyen tambahan peperiksaan (${costStr}) sebagai latihan sampingan sekolah menengah.`,
      toastFn: (name, care) => `Tuisyen tambahan ${name} selesai (${care}%)!`
    };
  },

  parentChild(childId, action) {
    const s = GameState.current;
    GameState.ensureUpgradedState();
    this.ensureRelationshipFields(s);

    const child = (s.relationships || []).find(r => r.id === childId && r.alive);
    if (!child) return { ok: false, msg: 'Anak tidak ditemui.' };
    if (child.age >= 18) return { ok: false, msg: `${child.name} sudah dewasa (${child.age} tahun).` };

    const countKey = `parent_cnt_${childId}`;
    const used = s.yearlyActions[countKey] || 0;
    if (used >= 3) {
      return { ok: false, msg: `Anda sudah mencapai had 3 tindakan didikan tahun ini untuk ${child.name}.` };
    }

    const actKey = `parent_${childId}_${action}`;
    if (s.yearlyActions[actKey]) {
      return { ok: false, msg: `Anda sudah melakukan tindakan ini untuk ${child.name} tahun ini.` };
    }

    if (!child.stats) child.stats = { smarts: 65, health: 80 };

    if (action === 'education') {
      const eduMeta = this.getChildEduActionMeta(child.age);
      const cost = Utils.usdToLocal(eduMeta.costUsd, s.countryId);
      if (s.money < cost) return { ok: false, msg: `Kos ${eduMeta.title} ialah ${Utils.formatMoney(cost, s.countryId)}.` };
      s.money -= cost;
      s.yearlyActions[actKey] = true;
      s.yearlyActions[countKey] = used + 1;
      const [minSm, maxSm] = eduMeta.smartsBoost || [3, 5];
      child.educationCare = Utils.clamp((child.educationCare ?? 60) + Utils.randInt(12, 18), 0, 100);
      child.stats.smarts = Utils.clamp((child.stats.smarts ?? 65) + Utils.randInt(minSm, maxSm), 0, 100);
      child.rebelliousness = Utils.clamp((child.rebelliousness ?? 10) - 3, 0, 100);
      GameState.addJournalEntry(eduMeta.logFn(child.name, Utils.formatMoney(cost, s.countryId)));
      GameState.save();
      return { ok: true, msg: eduMeta.toastFn(child.name, child.educationCare) };
    }

    if (action === 'health') {
      const cost = Utils.usdToLocal(120, s.countryId);
      if (s.money < cost) return { ok: false, msg: `Kos pemeriksaan & rawatan kesihatan ialah ${Utils.formatMoney(cost, s.countryId)}.` };
      s.money -= cost;
      s.yearlyActions[actKey] = true;
      s.yearlyActions[countKey] = used + 1;
      child.healthCare = Utils.clamp((child.healthCare ?? 70) + Utils.randInt(14, 22), 0, 100);
      child.stats.health = Utils.clamp((child.stats.health ?? 80) + Utils.randInt(6, 12), 0, 100);
      GameState.addJournalEntry(`🩺 Anda membawa ${child.name} menjalani pemeriksaan kesihatan & rawatan berkhasiat (${Utils.formatMoney(cost, s.countryId)}).`);
      GameState.save();
      return { ok: true, msg: `Kesihatan ${child.name} semakin baik (${child.healthCare}%)!` };
    }

    if (action === 'morals') {
      s.yearlyActions[actKey] = true;
      s.yearlyActions[countKey] = used + 1;
      child.morals = Utils.clamp((child.morals ?? 65) + Utils.randInt(12, 20), 0, 100);
      child.rebelliousness = Utils.clamp((child.rebelliousness ?? 10) - Utils.randInt(10, 18), 0, 100);
      if (child.rebelliousness <= 55 && child.morals >= 45) child.isDelinquent = false;
      GameState.adjustStats({ happiness: 4 });
      GameState.addJournalEntry(`🌟 Anda meluangkan masa mendidik akhlak, adab dan nilai murni kepada ${child.name} (Akhlak ${child.morals}%, Pemberontakan ${child.rebelliousness}%).`);
      GameState.save();
      return { ok: true, msg: `Akhlak ${child.name} bertambah baik (${child.morals}%)!` };
    }

    if (action === 'quality_time') {
      s.yearlyActions[actKey] = true;
      s.yearlyActions[countKey] = used + 1;
      child.closeness = Utils.clamp((child.closeness ?? 75) + Utils.randInt(10, 16), 0, 100);
      child.trust = Utils.clamp((child.trust ?? 75) + Utils.randInt(8, 14), 0, 100);
      child.rebelliousness = Utils.clamp((child.rebelliousness ?? 10) - Utils.randInt(5, 10), 0, 100);
      GameState.adjustStats({ happiness: 9 });
      GameState.addJournalEntry(`🎡 Anda meluangkan masa berkualiti yang menggembirakan bersama ${child.name}!`);
      GameState.save();
      return { ok: true, msg: `Ikatan kasih sayang dengan ${child.name} makin erat!` };
    }

    return { ok: false, msg: 'Tindakan keibubapaan tidak dikenali.' };
  }
};
