/* ==========================================================================
   WorldLife — Enjin Agama, Penceraian (Syariah & Sivil) & Harta Pusaka (Faraid & Sivil)
   Bahasa Melayu
   ========================================================================== */

window.LegalInheritanceEngine = {
  RELIGIONS: [
    { id: 'Islam', label: 'Islam', icon: '☪️', beliefId: 'islam' },
    { id: 'Kristian', label: 'Kristian', icon: '✝️', beliefId: 'christianity' },
    { id: 'Buddha', label: 'Buddha', icon: '☸️', beliefId: 'buddhism' },
    { id: 'Hindu', label: 'Hindu', icon: '🕉️', beliefId: 'hinduism' },
    { id: 'Lain-lain', label: 'Lain-lain', icon: '🕊️', beliefId: 'spiritual' },
    { id: 'Tiada', label: 'Tiada', icon: '⚛️', beliefId: 'agnostic' }
  ],

  getReligionMeta(religion) {
    return this.RELIGIONS.find(r => r.id === religion) || this.RELIGIONS[5];
  },

  religionToBelief(religion) {
    const meta = this.RELIGIONS.find(r => r.id === religion);
    return meta ? meta.beliefId : 'unassigned';
  },

  beliefToReligion(belief) {
    if (belief === 'islam') return 'Islam';
    if (belief === 'christianity') return 'Kristian';
    if (belief === 'buddhism') return 'Buddha';
    if (belief === 'hinduism') return 'Hindu';
    if (belief === 'spiritual') return 'Lain-lain';
    return 'Tiada';
  },

  MUSLIM_COUNTRIES: new Set([
    'MY', 'ID', 'BN', 'SA', 'AE', 'QA', 'KW', 'BH', 'OM', 'YE',
    'JO', 'EG', 'MA', 'DZ', 'TN', 'LY', 'SD', 'IQ', 'SY', 'PS',
    'LB', 'TR', 'IR', 'PK', 'BD', 'AF', 'MV', 'KZ', 'UZ', 'AZ',
    'NG', 'SN', 'ML', 'NE', 'SO', 'MR', 'KM', 'DJ', 'GM', 'GN',
    'TD', 'BF', 'SL', 'AL', 'BA', 'XK', 'TM', 'KG', 'TJ'
  ]),

  isIslamic(s) {
    if (!s) return false;
    if (s.religion) return s.religion === 'Islam';
    return s.belief === 'islam';
  },

  isMuslimCountry(country) {
    if (!country) return false;
    const cid = typeof country === 'string' ? country : country.id;
    return this.MUSLIM_COUNTRIES.has(String(cid || '').toUpperCase());
  },

  isSyariahApplicable(s, country = null) {
    if (!s) return false;
    return this.isIslamic(s) && this.isMuslimCountry(country || s.countryId);
  },

  // --------------------------------------------------------------------------
  // 1. PENENTUAN AGAMA AUTOMATIK MENGIKUT DEMOGRAFI NEGARA KELAHIRAN
  // --------------------------------------------------------------------------
  pickReligionByDemographics(countryId, heritageId) {
    if (countryId === 'MY') {
      if (heritageId === 'malay') return 'Islam';
      if (heritageId === 'chinese') return Utils.chance(0.68) ? 'Buddha' : (Utils.chance(0.65) ? 'Kristian' : 'Tiada');
      if (heritageId === 'indian') return Utils.chance(0.78) ? 'Hindu' : (Utils.chance(0.55) ? 'Kristian' : 'Islam');
      return Utils.chance(0.63) ? 'Islam' : Utils.pick(['Buddha', 'Kristian', 'Hindu']);
    }
    if (countryId === 'ID') {
      if (heritageId === 'chinese_id') return Utils.chance(0.5) ? 'Kristian' : 'Buddha';
      return Utils.chance(0.87) ? 'Islam' : Utils.pick(['Kristian', 'Hindu', 'Buddha']);
    }
    if (countryId === 'BN' || countryId === 'SA' || countryId === 'AE' || countryId === 'QA' || countryId === 'KW' || countryId === 'OM' || countryId === 'EG' || countryId === 'TR' || countryId === 'PK' || countryId === 'BD' || countryId === 'MA' || countryId === 'DZ' || countryId === 'IR' || countryId === 'IQ' || countryId === 'JO') {
      if (countryId === 'AE' && heritageId && heritageId !== 'emirati') {
        return Utils.pick(['Islam', 'Kristian', 'Hindu', 'Lain-lain']);
      }
      return Utils.chance(0.90) ? 'Islam' : Utils.pick(['Kristian', 'Lain-lain', 'Tiada']);
    }
    if (countryId === 'SG') {
      if (heritageId === 'malay_sg') return 'Islam';
      if (heritageId === 'indian_sg') return Utils.chance(0.68) ? 'Hindu' : Utils.pick(['Islam', 'Kristian']);
      return Utils.pick(['Buddha', 'Kristian', 'Tiada', 'Lain-lain']);
    }
    if (countryId === 'TH' || countryId === 'MM' || countryId === 'KH' || countryId === 'LA' || countryId === 'LK' || countryId === 'BT') {
      return Utils.chance(0.84) ? 'Buddha' : Utils.pick(['Islam', 'Hindu', 'Kristian', 'Lain-lain']);
    }
    if (countryId === 'IN' || countryId === 'NP') {
      return Utils.chance(0.79) ? 'Hindu' : Utils.pick(['Islam', 'Kristian', 'Buddha', 'Lain-lain']);
    }
    if (countryId === 'JP') {
      return Utils.chance(0.55) ? 'Buddha' : Utils.pick(['Lain-lain', 'Tiada', 'Tiada']);
    }
    if (countryId === 'KR') {
      return Utils.pick(['Tiada', 'Tiada', 'Kristian', 'Buddha']);
    }
    if (countryId === 'CN') {
      return Utils.pick(['Tiada', 'Tiada', 'Buddha', 'Lain-lain']);
    }
    if (countryId === 'PH' || countryId === 'BR' || countryId === 'MX' || countryId === 'IT' || countryId === 'ES' || countryId === 'PL' || countryId === 'AR' || countryId === 'CO') {
      return Utils.chance(0.85) ? 'Kristian' : Utils.pick(['Tiada', 'Lain-lain']);
    }
    if (countryId === 'US' || countryId === 'GB' || countryId === 'AU' || countryId === 'CA' || countryId === 'NZ' || countryId === 'DE' || countryId === 'FR') {
      return Utils.pick(['Kristian', 'Kristian', 'Tiada', 'Tiada', 'Islam', 'Hindu', 'Lain-lain']);
    }
    if (countryId === 'IL') {
      return Utils.chance(0.74) ? 'Lain-lain' : Utils.pick(['Islam', 'Kristian', 'Tiada']);
    }

    const c = window.COUNTRIES && window.COUNTRIES[countryId];
    const cg = c && c.cultureGroup;
    if (cg === 'malay_sea' || cg === 'arabic_me' || cg === 'south_asian_muslim' || cg === 'persian_turkic') {
      return Utils.chance(0.88) ? 'Islam' : Utils.pick(['Kristian', 'Lain-lain', 'Tiada']);
    }
    if (cg === 'south_asian') return Utils.chance(0.75) ? 'Hindu' : Utils.pick(['Islam', 'Buddha', 'Kristian']);
    if (cg === 'thai_sea') return Utils.chance(0.82) ? 'Buddha' : Utils.pick(['Islam', 'Kristian', 'Lain-lain']);
    if (cg === 'east_asian_cn' || cg === 'vietnamese') return Utils.pick(['Buddha', 'Tiada', 'Lain-lain', 'Kristian']);
    if (cg === 'latin_american' || cg === 'filipino' || cg === 'southern_europe' || cg === 'pacific_islander') {
      return Utils.chance(0.84) ? 'Kristian' : Utils.pick(['Tiada', 'Lain-lain']);
    }
    if (cg === 'western_europe' || cg === 'nordic' || cg === 'slavic_east_eu' || cg === 'anglosphere') {
      return Utils.pick(['Kristian', 'Kristian', 'Tiada', 'Lain-lain', 'Islam']);
    }
    if (cg === 'west_african' || cg === 'east_african' || cg === 'southern_african') {
      if (['SN', 'ML', 'NE', 'GM', 'GN', 'SO', 'DJ', 'KM', 'TD', 'SD'].includes(countryId)) return 'Islam';
      return Utils.pick(['Kristian', 'Kristian', 'Islam', 'Lain-lain']);
    }
    return Utils.pick(['Islam', 'Kristian', 'Buddha', 'Hindu', 'Lain-lain', 'Tiada']);
  },

  // --------------------------------------------------------------------------
  // 2. INISIALISASI MEDAN UNDANG-UNDANG, IDAH, NAFKAH & WASIAT
  // --------------------------------------------------------------------------
  ensureLegalFields(s) {
    if (!s) return;
    if (!s.religion) {
      s.religion = s.belief && s.belief !== 'unassigned'
        ? this.beliefToReligion(s.belief)
        : this.pickReligionByDemographics(s.birthCountryId || s.countryId, s.heritageId);
    }
    if (!s.marriageMeta || typeof s.marriageMeta !== 'object') {
      s.marriageMeta = null;
    }
    if (!s.idahState || typeof s.idahState !== 'object') {
      s.idahState = null;
    }
    if (!Array.isArray(s.yearlyObligations)) {
      s.yearlyObligations = [];
    }
    if (!Array.isArray(s.divorceHistory)) {
      s.divorceHistory = [];
    }
    if (!s.wasiat || typeof s.wasiat !== 'object') {
      s.wasiat = {
        islamicPct: 0,      // 0 hingga 33.33 (maksimum 1/3 harta bersih)
        islamicBeneficiary: 'Wakaf & Kebajikan',
        civilMode: 'none',  // 'none' | 'equal' | 'single_heir' | 'charity'
        civilTargetHeirId: null
      };
    }
  },

  getPrenupFeeLocal(countryId) {
    return Utils.usdToLocal(600, countryId);
  },

  recordMarriageStart(s, partner, hasPrenup = false) {
    this.ensureLegalFields(s);
    const prevRecord = (s.divorceHistory || []).find(d => d.partnerId === partner.id);
    const priorTalak = prevRecord ? (prevRecord.talakCount || 0) : (partner.talakCount || 0);
    const netNow = Math.max(0, GameState.getNetWorth());
    const spouseInc = Utils.usdToLocal(Utils.randInt(16000, 46000), s.countryId);

    s.marriageMeta = {
      partnerId: partner.id,
      marriedYear: s.year,
      marriedAge: s.age,
      preMaritalNetWorth: netNow,
      preMaritalMoney: Math.max(0, s.money || 0),
      preMaritalPropertyIds: ((s.assets && s.assets.properties) || []).map(p => p.id),
      hasPrenup: Boolean(hasPrenup && !this.isSyariahApplicable(s)),
      talakCount: priorTalak,
      spouseIncomeEst: spouseInc
    };
    partner.inIdah = false;
    s.idahState = null;
  },

  // --------------------------------------------------------------------------
  // 3. ENJIN PENCERAIAN (MAHKAMAH SYARIAH & MAHKAMAH SIVIL)
  // --------------------------------------------------------------------------
  _getLegalDiscount(s) {
    if (window.Dynasty && Dynasty.getBloodlineBonuses) {
      const b = Dynasty.getBloodlineBonuses();
      if (b && b.legalCostDiscount) return 0.75;
    }
    return 1.0;
  },

  _getPlayerAnnualIncome(s) {
    if (window.CharacterStatus && CharacterStatus.getTotalAnnualIncome) {
      return CharacterStatus.getTotalAnnualIncome(s).grossLocal || 0;
    }
    return (s.job && s.job.salary) || 0;
  },

  _getMinorChildren(s) {
    return (s.relationships || []).filter(r =>
      ['Anak Lelaki', 'Anak Perempuan', 'Son', 'Daughter'].includes(r.role) && r.alive && r.age < 18
    );
  },

  previewDivorce(s, partner, options = {}) {
    this.ensureLegalFields(s);
    const c = Utils.getCountry(s.countryId);
    const islamic = this.isSyariahApplicable(s);
    const meta = s.marriageMeta || {
      marriedYear: Math.max(s.year - 2, s.year),
      preMaritalNetWorth: Math.round(Math.max(0, GameState.getNetWorth()) * 0.4),
      hasPrenup: false,
      talakCount: partner.talakCount || 0,
      spouseIncomeEst: Utils.usdToLocal(24000, s.countryId)
    };

    const yearsMarried = Math.max(1, s.year - (meta.marriedYear || s.year));
    const currentNet = Math.max(0, GameState.getNetWorth());
    const maritalAssets = Math.max(
      0,
      currentNet > meta.preMaritalNetWorth
        ? currentNet - meta.preMaritalNetWorth
        : Math.round(Math.max(0, s.money || 0) * 0.45)
    );
    const minorKids = this._getMinorChildren(s);
    const playerIncome = this._getPlayerAnnualIncome(s);
    const spouseIncome = meta.spouseIncomeEst || Utils.usdToLocal(24000, s.countryId);
    const disc = this._getLegalDiscount(s);

    // ===== A. MAHKAMAH SYARIAH (ISLAM) =====
    if (islamic) {
      const isHusband = s.gender === 'male';
      const currentTalak = Math.max(meta.talakCount || 0, partner.talakCount || 0);
      const path = options.path || (isHusband ? (currentTalak >= 2 ? 'talak3' : 'talak1') : 'fasakh');
      const mode = options.settlementMode || 'sulh'; // 'sulh' (Runding) | 'peguam' (Peguam Syariah)

      const legalFee = Math.round(Utils.usdToLocal(mode === 'peguam' ? 1200 : 250, s.countryId) * disc);

      // Harta Sepencarian: 30%–50% daripada aset perkahwinan
      let sepencarianPct = mode === 'peguam'
        ? (isHusband ? 0.35 : 0.48)
        : 0.35;
      if (path === 'khuluk' && !isHusband) sepencarianPct = 0.30;
      const hartaSepencarian = Math.round(maritalAssets * sepencarianPct);
      // Suami membayar atau isteri menerima/membahagi secara saksama
      const sepencarianDelta = isHusband ? -hartaSepencarian : Math.round(hartaSepencarian * 0.6);

      // Mutaah & Nafkah Idah (Suami bayar kepada isteri; Khuluk -> isteri tebus talak)
      const baseMutaah = Math.max(
        Utils.usdToLocal(400, s.countryId),
        Math.round(Math.min(Utils.usdToLocal(18000, s.countryId), (playerIncome * 0.12) + yearsMarried * Utils.usdToLocal(220, s.countryId)))
      );
      let mutaahIdahDelta = 0;
      let mutaahLabel = 'Mutaah & Nafkah Idah';
      if (path === 'khuluk') {
        const tebus = Math.round(baseMutaah * 0.65);
        mutaahIdahDelta = isHusband ? tebus : -tebus;
        mutaahLabel = 'Bayaran Tebus Talak (Khuluk)';
      } else {
        mutaahIdahDelta = isHusband ? -baseMutaah : baseMutaah;
      }

      // Nafkah Anak Tahunan & Hadanah
      let nafkahAnakAnnual = 0;
      let nafkahYears = 0;
      let hadanahText = 'Tiada anak bawah umur';
      if (minorKids.length > 0) {
        const youngestAge = Math.min(...minorKids.map(k => k.age));
        nafkahYears = Math.max(1, 18 - youngestAge);
        const perKidAnnual = Math.max(
          Utils.usdToLocal(1200, s.countryId),
          Math.round((Math.max(playerIncome, spouseIncome) * 0.08))
        );
        const rawNafkah = perKidAnnual * minorKids.length;
        nafkahAnakAnnual = isHusband ? -rawNafkah : rawNafkah;
        hadanahText = youngestAge < 7
          ? `Hadanah diserahkan kepada Ibu (${isHusband ? partner.name : 'Anda'}) bagi anak mumaiyiz/bawah 7 tahun dengan hak lawatan bapa.`
          : `Hadanah bersama dipersetujui Mahkamah Syariah demi kebajikan ${minorKids.length} orang anak.`;
      }

      // Kiraan Talak & Idah
      let nextTalakCount = currentTalak;
      let inIdah = false;
      let isPermanent = false;
      let pathLabel = '';
      if (path === 'talak1') {
        nextTalakCount = Math.min(3, currentTalak + 1);
        if (nextTalakCount >= 3) {
          isPermanent = true;
          inIdah = false;
          pathLabel = 'Lafaz Talak 3 (Talak Bain Kubra — Kekal)';
        } else {
          inIdah = true;
          pathLabel = `Lafaz Talak ${nextTalakCount} (Talak Raj'ie — Boleh Rujuk Dalam Tempoh Idah)`;
        }
      } else if (path === 'talak3') {
        nextTalakCount = 3;
        isPermanent = true;
        inIdah = false;
        pathLabel = 'Lafaz Talak 3 (Talak Bain Kubra — Kekal)';
      } else if (path === 'fasakh') {
        isPermanent = true;
        inIdah = false;
        pathLabel = 'Pembubaran Nikah Secara Fasakh';
      } else {
        isPermanent = true;
        inIdah = false;
        pathLabel = 'Penceraian Secara Khuluk (Tebus Talak)';
      }

      const netCashDelta = sepencarianDelta + mutaahIdahDelta - legalFee;

      return {
        system: 'syariah',
        courtName: 'Mahkamah Syariah',
        path,
        pathLabel,
        settlementMode: mode,
        yearsMarried,
        maritalAssets,
        sepencarianPct: Math.round(sepencarianPct * 100),
        hartaSepencarian,
        sepencarianDelta,
        mutaahLabel,
        mutaahIdahDelta,
        legalFee,
        nafkahAnakAnnual,
        nafkahYears,
        hadanahText,
        minorKidsCount: minorKids.length,
        nextTalakCount,
        inIdah,
        isPermanent,
        netCashDelta
      };
    }

    // ===== B. MAHKAMAH SIVIL {NEGARA} (BUKAN ISLAM) =====
    const hasPrenup = Boolean(meta.hasPrenup);
    const mode = options.settlementMode || 'mediasi'; // 'mediasi' | 'litigasi'
    const legalFee = Math.round(Utils.usdToLocal(mode === 'litigasi' ? 2400 : 750, s.countryId) * disc);

    let splitPct = 0.45;
    let protectedAmount = 0;
    let splittablePool = maritalAssets;

    if (hasPrenup) {
      protectedAmount = meta.preMaritalNetWorth || 0;
      splittablePool = Math.max(0, currentNet - protectedAmount);
      splitPct = 0.20;
    } else {
      splitPct = mode === 'litigasi' ? 0.50 : 0.42;
    }

    const assetSplitLoss = Math.round(splittablePool * splitPct);

    // Alimony jika wujud jurang pendapatan ketara (dan tiada Prenup)
    let alimonyAnnual = 0;
    let alimonyYears = 0;
    const incomeGap = playerIncome - spouseIncome;
    if (!hasPrenup && Math.abs(incomeGap) > Math.max(Utils.usdToLocal(8000, s.countryId), Math.max(playerIncome, spouseIncome) * 0.25)) {
      alimonyYears = Math.min(5, Math.max(2, Math.ceil(yearsMarried / 2)));
      const rawAlimony = Math.round(Math.abs(incomeGap) * 0.18);
      alimonyAnnual = incomeGap > 0 ? -rawAlimony : rawAlimony;
    }

    // Hak Jagaan & Nafkah Anak Sivil
    let childSupportAnnual = 0;
    let childSupportYears = 0;
    let custodyText = 'Tiada anak bawah umur';
    if (minorKids.length > 0) {
      const youngestAge = Math.min(...minorKids.map(k => k.age));
      childSupportYears = Math.max(1, 18 - youngestAge);
      const rawSupport = Math.max(
        Utils.usdToLocal(1500, s.countryId),
        Math.round(Math.max(playerIncome, spouseIncome) * 0.09)
      ) * minorKids.length;
      childSupportAnnual = playerIncome >= spouseIncome ? -rawSupport : rawSupport;
      custodyText = mode === 'mediasi'
        ? `Hak jagaan bersama (Joint Custody) ditetapkan oleh Mahkamah Sivil ${c.name}.`
        : `Hak jagaan utama diberikan kepada penjaga primer dengan hak lawatan berjadual di ${c.name}.`;
    }

    const netCashDelta = -assetSplitLoss - legalFee;

    return {
      system: 'civil',
      courtName: `Mahkamah Sivil ${c.name}`,
      path: 'civil',
      pathLabel: hasPrenup ? 'Penceraian Sivil (Dilindungi Prenup)' : 'Penceraian Sivil (Tanpa Prenup)',
      settlementMode: mode,
      hasPrenup,
      protectedAmount,
      yearsMarried,
      maritalAssets: splittablePool,
      splitPct: Math.round(splitPct * 100),
      assetSplitLoss,
      alimonyAnnual,
      alimonyYears,
      childSupportAnnual,
      childSupportYears,
      custodyText,
      minorKidsCount: minorKids.length,
      legalFee,
      inIdah: false,
      isPermanent: true,
      netCashDelta
    };
  },

  executeDivorce(s, partnerId, options = {}) {
    this.ensureLegalFields(s);
    const partner = (s.relationships || []).find(r => r.id === partnerId);
    if (!partner) return { ok: false, msg: 'Pasangan tidak ditemui.' };

    const preview = this.previewDivorce(s, partner, options);

    // Laksanakan pemindahan kewangan
    s.money = Math.round((s.money || 0) + preview.netCashDelta);

    // Rekod obligasi tahunan (Nafkah Anak / Alimony)
    if (preview.system === 'syariah' && preview.nafkahAnakAnnual !== 0 && preview.nafkahYears > 0) {
      s.yearlyObligations.push({
        id: 'obl_' + Date.now(),
        type: 'nafkah_anak',
        label: `Nafkah Anak (${partner.name})`,
        amountLocal: preview.nafkahAnakAnnual, // negatif = bayar, positif = terima
        yearsLeft: preview.nafkahYears,
        countryId: s.countryId
      });
    }
    if (preview.system === 'civil') {
      if (preview.alimonyAnnual !== 0 && preview.alimonyYears > 0) {
        s.yearlyObligations.push({
          id: 'obl_ali_' + Date.now(),
          type: 'alimony',
          label: `Alimoni (${partner.name})`,
          amountLocal: preview.alimonyAnnual,
          yearsLeft: preview.alimonyYears,
          countryId: s.countryId
        });
      }
      if (preview.childSupportAnnual !== 0 && preview.childSupportYears > 0) {
        s.yearlyObligations.push({
          id: 'obl_cs_' + Date.now() + '_1',
          type: 'nafkah_anak',
          label: `Nafkah Anak Sivil (${partner.name})`,
          amountLocal: preview.childSupportAnnual,
          yearsLeft: preview.childSupportYears,
          countryId: s.countryId
        });
      }
    }

    // Kemas kini status perkahwinan & bekas pasangan
    s.partnerId = null;
    s.married = false;
    s.marriageMeta = null;
    partner.category = 'ex';
    partner.stage = 'divorced';
    partner.closeness = Math.min(partner.closeness || 20, 22);
    partner.trust = Math.min(partner.trust || 20, 20);

    if (preview.system === 'syariah') {
      partner.talakCount = preview.nextTalakCount;
      partner.inIdah = Boolean(preview.inIdah);
      partner.role = preview.inIdah
        ? `Bekas Pasangan (Idah — Talak ${preview.nextTalakCount})`
        : (preview.nextTalakCount >= 3 ? 'Bekas Pasangan (Talak 3 Kekal)' : 'Bekas Pasangan (Cerai Syariah)');

      if (preview.inIdah) {
        s.idahState = {
          active: true,
          inIdah: true,
          yearsLeft: 1,
          exSpouseId: partner.id,
          exSpouseName: partner.name,
          talakCount: preview.nextTalakCount,
          canRujuk: true
        };
      } else {
        s.idahState = null;
      }
    } else {
      partner.inIdah = false;
      partner.role = 'Bekas Pasangan (Cerai Sivil)';
      s.idahState = null;
    }

    s.divorceHistory.push({
      year: s.year,
      age: s.age,
      partnerId: partner.id,
      partnerName: partner.name,
      system: preview.system,
      path: preview.path,
      talakCount: preview.nextTalakCount || 0,
      hasPrenup: Boolean(preview.hasPrenup),
      netCashDelta: preview.netCashDelta
    });

    GameState.adjustStats({ happiness: -18 });
    if (s.alignment) s.alignment.stress = Utils.clamp((s.alignment.stress || 0) + 14, 0, 100);
    GameState.recordCrisis('heartbreak');

    const deltaStr = preview.netCashDelta >= 0
      ? `+${Utils.formatMoney(preview.netCashDelta, s.countryId)}`
      : `-${Utils.formatMoney(Math.abs(preview.netCashDelta), s.countryId)}`;

    if (preview.system === 'syariah') {
      GameState.addJournalEntry(
        `⚖️ ${preview.courtName}: ${preview.pathLabel} bersama ${partner.name} telah disahkan. Harta Sepencarian (${preview.sepencarianPct}%), ${preview.mutaahLabel} & kos guaman dimuktamadkan (Kesan tunai: ${deltaStr}).${preview.inIdah ? ' Tempoh Idah aktif selama 1 tahun — pilihan Rujuk Semula dibuka.' : ''}`,
        'warning'
      );
    } else {
      GameState.addJournalEntry(
        `⚖️ ${preview.courtName}: ${preview.pathLabel} bersama ${partner.name} selesai. Pembahagian aset ${preview.splitPct}%${preview.hasPrenup ? ' (Aset pranikah dilindungi Prenup!)' : ''} & kos guaman dimuktamadkan (Kesan tunai: ${deltaStr}).`,
        'warning'
      );
    }

    GameState.save();
    return { ok: true, preview, msg: `Prosiding di ${preview.courtName} telah dimuktamadkan.` };
  },

  // --------------------------------------------------------------------------
  // 4. RUJUK SEMULA (DALAM TEMPOH IDAH 1 TAHUN — TALAK 1 & TALAK 2)
  // --------------------------------------------------------------------------
  canRujuk(s) {
    this.ensureLegalFields(s);
    if (!s || !this.isSyariahApplicable(s) || s.married || s.partnerId) return false;
    if (!s.idahState || !s.idahState.active || !s.idahState.inIdah || s.idahState.yearsLeft <= 0) return false;
    if ((s.idahState.talakCount || 0) >= 3) return false;
    const ex = (s.relationships || []).find(r => r.id === s.idahState.exSpouseId && r.alive);
    return Boolean(ex);
  },

  rujukSpouse(s) {
    if (!this.canRujuk(s)) {
      return { ok: false, msg: 'Tempoh Idah telah tamat atau tidak layak untuk rujuk semula.' };
    }
    const ex = s.relationships.find(r => r.id === s.idahState.exSpouseId && r.alive);
    const talakCount = s.idahState.talakCount || 1;

    s.married = true;
    s.partnerId = ex.id;
    ex.category = 'spouse';
    ex.stage = 'married';
    ex.role = ex.gender === 'female' ? 'Isteri' : 'Suami';
    ex.inIdah = false;
    ex.closeness = Math.max(ex.closeness || 20, 56);
    ex.trust = Math.max(ex.trust || 20, 50);

    // Batalkan obligasi nafkah anak daripada penceraian terdahulu dengan pasangan yang sama
    s.yearlyObligations = (s.yearlyObligations || []).filter(o => !String(o.label || '').includes(ex.name));

    this.recordMarriageStart(s, ex, false);
    s.marriageMeta.talakCount = talakCount;
    s.idahState = null;

    GameState.adjustStats({ happiness: 18 });
    if (s.alignment) s.alignment.stress = Utils.clamp((s.alignment.stress || 0) - 10, 0, 100);
    GameState.addJournalEntry(
      `💍 Alhamdulillah! Anda dan ${ex.name} telah sah Rujuk Semula dalam tempoh Idah (rekod terdahulu: Talak ${talakCount}). Semoga rumah tangga kali ini lebih harmoni.`,
      'romance'
    );
    GameState.save();
    return { ok: true, msg: `Anda dan ${ex.name} telah sah Rujuk Semula!` };
  },

  // --------------------------------------------------------------------------
  // 5. KEMAS KINI TAHUNAN (IDAH & NAFKAH/ALIMONI)
  // --------------------------------------------------------------------------
  tickYearlyLegal(s) {
    this.ensureLegalFields(s);

    // 1. Kiraan tempoh Idah (1 tahun)
    if (s.idahState && s.idahState.active) {
      s.idahState.yearsLeft -= 1;
      if (s.idahState.yearsLeft <= 0) {
        const ex = (s.relationships || []).find(r => r.id === s.idahState.exSpouseId);
        if (ex) {
          ex.inIdah = false;
          ex.role = `Bekas Pasangan (Tamat Idah — Talak ${s.idahState.talakCount || 1})`;
        }
        GameState.addJournalEntry(
          `⏳ Tempoh Idah bersama ${s.idahState.exSpouseName} telah tamat. Pilihan Rujuk Semula tidak lagi tersedia.`,
          'culture'
        );
        s.idahState = null;
      }
    }

    // 2. Obligasi Tahunan (Nafkah Anak / Alimoni)
    if (s.yearlyObligations && s.yearlyObligations.length > 0) {
      const remaining = [];
      let totalDelta = 0;
      const labels = [];

      for (const obl of s.yearlyObligations) {
        if (obl.yearsLeft <= 0) continue;
        const amtLocal = obl.countryId && obl.countryId !== s.countryId
          ? Utils.convertMoney(obl.amountLocal, obl.countryId, s.countryId)
          : obl.amountLocal;
        s.money = Math.round((s.money || 0) + amtLocal);
        totalDelta += amtLocal;
        labels.push(obl.label);
        obl.yearsLeft -= 1;
        if (obl.yearsLeft > 0) remaining.push(obl);
      }

      s.yearlyObligations = remaining;
      if (totalDelta !== 0) {
        GameState.addJournalEntry(
          totalDelta < 0
            ? `⚖️ Pembayaran tahunan ${labels.join(', ')}: -${Utils.formatMoney(Math.abs(totalDelta), s.countryId)}.`
            : `⚖️ Menerima bayaran tahunan ${labels.join(', ')}: +${Utils.formatMoney(totalDelta, s.countryId)}.`,
          totalDelta < 0 ? 'normal' : 'culture'
        );
      }
    }
  },

  // --------------------------------------------------------------------------
  // 6. PENGURUSAN WASIAT SEMASA HIDUP
  // --------------------------------------------------------------------------
  setIslamicWasiat(s, pct, beneficiary = 'Wakaf & Kebajikan') {
    this.ensureLegalFields(s);
    if (!this.isSyariahApplicable(s)) {
      return { ok: false, msg: 'Wasiat Islam hanya untuk watak beragama Islam.' };
    }
    const clamped = Math.max(0, Math.min(33.33, Number(pct) || 0));
    s.wasiat.islamicPct = Math.round(clamped * 100) / 100;
    s.wasiat.islamicBeneficiary = beneficiary || 'Wakaf & Kebajikan';
    GameState.addJournalEntry(
      s.wasiat.islamicPct > 0
        ? `📜 Wasiat Islam dikemas kini: ${s.wasiat.islamicPct}% daripada harta pusaka bersih diperuntukkan kepada ${s.wasiat.islamicBeneficiary} (had maksimum 1/3 syarak).`
        : '📜 Peruntukan Wasiat Islam dibatalkan — 100% harta bersih akan dibahagikan mengikut Faraid.',
      'culture'
    );
    GameState.save();
    return { ok: true, msg: 'Wasiat Islam berjaya disimpan!' };
  },

  setCivilWasiat(s, mode, targetHeirId = null) {
    this.ensureLegalFields(s);
    if (this.isSyariahApplicable(s)) {
      return { ok: false, msg: 'Watak beragama Islam menggunakan Wasiat Islam & Hukum Faraid.' };
    }
    const validModes = ['none', 'equal', 'single_heir', 'charity'];
    s.wasiat.civilMode = validModes.includes(mode) ? mode : 'none';
    s.wasiat.civilTargetHeirId = mode === 'single_heir' ? targetHeirId : null;
    const labels = {
      none: 'Tiada Wasiat (Undang-undang Intestate)',
      equal: 'Wasiat Sama Rata kepada semua waris',
      single_heir: 'Wasiat 1 Waris Utama',
      charity: 'Wasiat Amal & Kebajikan (100%)'
    };
    GameState.addJournalEntry(`📜 Wasiat Sivil dikemas kini: ${labels[s.wasiat.civilMode]}.`, 'culture');
    GameState.save();
    return { ok: true, msg: `Wasiat Sivil dikemas kini (${labels[s.wasiat.civilMode]}).` };
  },

  setAdoptedHibahPct(s, pct) {
    this.ensureLegalFields(s);
    if (!this.isSyariahApplicable(s)) {
      return { ok: false, msg: 'Hibah Anak Angkat hanya tersedia di bawah Undang-Undang Syariah.' };
    }
    const val = Math.max(0, Math.min(10, Number(pct) || 0));
    s.wasiat.hibahAdoptedPct = val;
    GameState.addJournalEntry(
      val > 0
        ? `🎁 Peruntukan Hibah Anak Angkat ditetapkan kepada ${val}% daripada baki harta bersih sebelum agihan Faraid.`
        : '🎁 Peruntukan Hibah Anak Angkat ditetapkan kepada 0% (tiada potongan sebelum Faraid).',
      'culture'
    );
    GameState.save();
    return { ok: true, msg: `Hibah Anak Angkat dikemas kini (${val}%).` };
  },

  giveLivingHibah(s, { recipientId, type = 'cash', amountLocal = 0, assetId = null } = {}) {
    this.ensureLegalFields(s);
    if (!this.isSyariahApplicable(s)) {
      return { ok: false, msg: 'Hibah Semasa Hidup hanya tersedia di bawah Undang-Undang Syariah.' };
    }
    const recipient = (s.relationships || []).find(r =>
      r.id === recipientId && r.alive && (
        (s.married && r.id === s.partnerId) ||
        ['Anak Lelaki', 'Anak Perempuan', 'Son', 'Daughter'].includes(r.role)
      )
    );
    if (!recipient) {
      return { ok: false, msg: 'Sila pilih pasangan atau anak yang masih hidup sebagai penerima Hibah.' };
    }
    if (!Array.isArray(s.hibahHistory)) s.hibahHistory = [];

    if (type === 'cash') {
      const amt = Math.round(Number(amountLocal) || 0);
      if (amt <= 0 || (s.money || 0) < amt) {
        return { ok: false, msg: 'Baki tunai tidak mencukupi untuk Hibah ini.' };
      }
      s.money -= amt;
      recipient.closeness = Utils.clamp((recipient.closeness ?? 70) + 10, 0, 100);
      recipient.trust = Utils.clamp((recipient.trust ?? 70) + 8, 0, 100);
      s.hibahHistory.push({ year: s.year, recipientId: recipient.id, recipientName: recipient.name, type: 'cash', label: Utils.formatMoney(amt, s.countryId), value: amt });
      GameState.adjustStats({ happiness: 8 });
      GameState.addJournalEntry(
        `🎁 Hibah Semasa Hidup: Anda menghibahkan wang tunai ${Utils.formatMoney(amt, s.countryId)} kepada ${recipient.name} (${recipient.role}). Aset ini telah dipindah milik dan dikecualikan daripada Faraid kelak.`,
        'milestone'
      );
      GameState.save();
      return { ok: true, msg: `Hibah tunai ${Utils.formatMoney(amt, s.countryId)} berjaya diserahkan kepada ${recipient.name}!` };
    }

    let list = null;
    if (type === 'property' && s.assets && Array.isArray(s.assets.properties)) list = s.assets.properties;
    else if (type === 'vehicle' && s.assets && Array.isArray(s.assets.vehicles)) list = s.assets.vehicles;
    else if (type === 'heirloom' && s.assets && Array.isArray(s.assets.collectibles)) list = s.assets.collectibles;

    const idx = list ? list.findIndex(x => x && x.id === assetId) : -1;
    if (idx < 0) return { ok: false, msg: 'Aset yang dipilih tidak ditemui.' };
    const [asset] = list.splice(idx, 1);

    recipient.closeness = Utils.clamp((recipient.closeness ?? 70) + 16, 0, 100);
    recipient.trust = Utils.clamp((recipient.trust ?? 70) + 12, 0, 100);
    s.hibahHistory.push({ year: s.year, recipientId: recipient.id, recipientName: recipient.name, type, label: asset.name, value: asset.value || 0 });
    GameState.adjustStats({ happiness: 12 });
    GameState.addJournalEntry(
      `🎁 Hibah Semasa Hidup: Anda menghibahkan ${asset.name} (${Utils.formatMoney(asset.value || 0, s.countryId)}) kepada ${recipient.name} (${recipient.role}). Aset ini telah dipindah milik sepenuhnya dan dikecualikan daripada Faraid.`,
      'milestone'
    );
    GameState.save();
    return { ok: true, msg: `Hibah ${asset.name} berjaya diserahkan kepada ${recipient.name}!` };
  },

  // --------------------------------------------------------------------------
  // 7. CUKAI PUSAKA SIVIL & ENJIN PENYATA HARTA PUSAKA (FARAID & SIVIL)
  // --------------------------------------------------------------------------
  getCountryEstateTaxRate(countryId, netEstateUsd) {
    const zeroTax = ['MY', 'SG', 'BN', 'AU', 'NZ', 'CA', 'AE', 'SA', 'QA', 'KW', 'OM', 'HK', 'MO', 'SE', 'NO', 'PT', 'ID'];
    if (zeroTax.includes(countryId)) return 0;
    if (netEstateUsd < 100000) return 0;
    const map = {
      JP: 0.25,
      KR: 0.22,
      GB: 0.20,
      US: 0.18,
      FR: 0.18,
      DE: 0.15,
      BE: 0.16,
      ES: 0.12,
      NL: 0.12,
      CH: 0.08
    };
    if (map[countryId] !== undefined) return map[countryId];
    const c = Utils.getCountry(countryId);
    return (c && c.salaryMultiplier >= 0.9) ? 0.10 : 0.05;
  },

  calculateEstateStatement(s) {
    this.ensureLegalFields(s);
    const c = Utils.getCountry(s.countryId);
    const islamic = this.isSyariahApplicable(s);

    // 1. Kira Harta Kasar & Tolak Hutang / Gadai Janji terlebih dahulu
    const ceoEquity = (window.SpecialModesEngine && SpecialModesEngine.getCeoEquityLocal)
      ? SpecialModesEngine.getCeoEquityLocal(s)
      : 0;
    const aSum = (window.AssetsEngine && AssetsEngine.getAssetCashflowSummary)
      ? AssetsEngine.getAssetCashflowSummary(s)
      : { totalAssetValue: 0, totalMortgage: 0, totalDebt: 0 };

    const cashPositive = Math.max(0, s.money || 0);
    const cashDebt = Math.max(0, -(s.money || 0));
    const retire = Math.max(0, s.retirementFund || 0);
    const grossEstate = Math.round(cashPositive + retire + (aSum.totalAssetValue || 0) + ceoEquity);
    const totalDebts = Math.round((aSum.totalDebt || 0) + cashDebt);
    const netEstate = Math.max(0, grossEstate - totalDebts);

    // Pusaka Keluarga bertanda (Heirlooms)
    const heirlooms = ((s.assets && s.assets.collectibles) || []).filter(col => col && col.isHeirloom);

    // Senarai ahli keluarga hidup
    const livingSpouse = (s.married && s.partnerId)
      ? (s.relationships || []).find(r => r.id === s.partnerId && r.alive)
      : null;
    const livingMother = (s.relationships || []).find(r => r.role === 'Ibu' && r.alive) || null;
    const livingFather = (s.relationships || []).find(r => (r.role === 'Ayah' || r.role === 'Bapa') && r.alive) || null;
    const allLivingKids = (s.relationships || []).filter(r =>
      ['Anak Lelaki', 'Anak Perempuan', 'Son', 'Daughter'].includes(r.role) && r.alive
    );
    const bioKids = allLivingKids.filter(k => !k.isAdopted);
    const adoptedKids = allLivingKids.filter(k => k.isAdopted);
    const livingSiblings = (s.relationships || []).filter(r =>
      ['Abang', 'Kakak', 'Adik/Abang', 'Adik/Kakak'].includes(r.role) && r.alive
    );

    const shares = [];
    let wasiatAmount = 0;
    let wasiatLabel = 'Tiada Wasiat';
    let hibahAnakAngkatAmount = 0;
    let hibahAnakAngkatPct = 0;
    let hibahAnakAngkatLabel = null;
    let estateTaxRate = 0;
    let estateTaxAmount = 0;
    let distributableEstate = netEstate;

    // ===== A. PENGIRAAN FARAID (ISLAM) =====
    if (islamic) {
      const wasiatPct = Math.max(0, Math.min(33.33, (s.wasiat && s.wasiat.islamicPct) || 0));
      if (wasiatPct > 0 && netEstate > 0) {
        const cappedFrac = Math.min(1 / 3, wasiatPct / 100);
        wasiatAmount = Math.round(netEstate * cappedFrac);
        wasiatLabel = `Wasiat Islam (${wasiatPct}% — ${s.wasiat.islamicBeneficiary || 'Wakaf & Kebajikan'})`;
      }
      const afterWasiat = Math.max(0, netEstate - wasiatAmount);

      // Hibah Anak Angkat (Khas untuk watak Islam di negara Islam: Anak angkat bukan waris Faraid,
      // diagihkan sebagai Hibah sebelum Faraid; boleh dilaras 0%, 5%, atau 10%)
      if (adoptedKids.length > 0 && afterWasiat > 0) {
        const chosenPct = (s.wasiat && typeof s.wasiat.hibahAdoptedPct === 'number')
          ? Math.max(0, Math.min(10, s.wasiat.hibahAdoptedPct))
          : (adoptedKids.length === 1 ? 8 : 10);
        hibahAnakAngkatPct = chosenPct;
        if (hibahAnakAngkatPct > 0) {
          const pctPool = Math.round(afterWasiat * (hibahAnakAngkatPct / 100));
          hibahAnakAngkatAmount = Math.min(afterWasiat, pctPool);
          hibahAnakAngkatLabel = `Hibah Anak Angkat (${hibahAnakAngkatPct}% — ${adoptedKids.length} anak angkat)`;
        }
      }

      distributableEstate = Math.max(0, afterWasiat - hibahAnakAngkatAmount);

      const hasKids = bioKids.length > 0;
      let fixedEntries = [];
      let fixedSum = 0;

      // 1. Pasangan (Isteri 1/8 dgn anak, 1/4 tiada anak; Suami 1/4 dgn anak, 1/2 tiada anak)
      if (livingSpouse) {
        const isWife = livingSpouse.gender === 'female';
        const frac = isWife ? (hasKids ? 1 / 8 : 1 / 4) : (hasKids ? 1 / 4 : 1 / 2);
        const fracLbl = isWife ? (hasKids ? '1/8' : '1/4') : (hasKids ? '1/4' : '1/2');
        fixedEntries.push({
          id: livingSpouse.id,
          name: livingSpouse.name,
          role: isWife ? 'Isteri' : 'Suami',
          fraction: frac,
          fractionLabel: fracLbl,
          isPlayableHeir: false
        });
        fixedSum += frac;
      }

      // 2. Ibu (1/6 jika hidup)
      if (livingMother) {
        fixedEntries.push({
          id: livingMother.id,
          name: livingMother.name,
          role: 'Ibu',
          fraction: 1 / 6,
          fractionLabel: '1/6',
          isPlayableHeir: false
        });
        fixedSum += 1 / 6;
      }

      // 3. Bapa (1/6 jika hidup)
      if (livingFather) {
        fixedEntries.push({
          id: livingFather.id,
          name: livingFather.name,
          role: 'Bapa',
          fraction: 1 / 6,
          fractionLabel: '1/6',
          isPlayableHeir: false
        });
        fixedSum += 1 / 6;
      }

      // Normalisasi Aul jika jumlah fardhu melebihi 1
      if (fixedSum > 1) {
        for (const e of fixedEntries) e.fraction = e.fraction / fixedSum;
        fixedSum = 1;
      }

      const remainder = Math.max(0, 1 - fixedSum);

      // Tambah penerima fardhu ke senarai shares
      for (const e of fixedEntries) {
        shares.push({
          id: e.id,
          name: e.name,
          role: e.role,
          fraction: e.fraction,
          fractionLabel: e.fractionLabel,
          pct: Math.round(e.fraction * 1000) / 10,
          amount: Math.round(distributableEstate * e.fraction),
          isPlayableHeir: false,
          isEntity: false
        });
      }

      // 4. Asabah: Anak-anak (Nisbah 2:1 Lelaki : Perempuan)
      if (hasKids && remainder > 0) {
        const sons = bioKids.filter(k => k.gender === 'male');
        const daughters = bioKids.filter(k => k.gender === 'female');
        const totalUnits = sons.length * 2 + daughters.length * 1;
        for (const kid of bioKids) {
          const weight = kid.gender === 'male' ? 2 : 1;
          const frac = remainder * (weight / totalUnits);
          shares.push({
            id: kid.id,
            name: kid.name,
            role: kid.gender === 'male' ? 'Anak Lelaki' : 'Anak Perempuan',
            fraction: frac,
            fractionLabel: sons.length > 0 && daughters.length > 0
              ? `Asabah 2:1 (${weight}/${totalUnits} baki)`
              : `Asabah (${weight}/${totalUnits} baki)`,
            pct: Math.round(frac * 1000) / 10,
            amount: Math.round(distributableEstate * frac),
            isPlayableHeir: true,
            isEntity: false
          });
        }
      } else if (remainder > 0) {
        // Fallback: Bapa sebagai Asabah -> Adik-beradik -> Baitulmal
        if (livingFather) {
          const dadShare = shares.find(x => x.id === livingFather.id);
          if (dadShare) {
            dadShare.fraction += remainder;
            dadShare.fractionLabel = '1/6 + Asabah';
            dadShare.pct = Math.round(dadShare.fraction * 1000) / 10;
            dadShare.amount = Math.round(distributableEstate * dadShare.fraction);
          }
        } else if (livingSiblings.length > 0) {
          const totalUnits = livingSiblings.reduce((acc, sb) => acc + (sb.gender === 'male' ? 2 : 1), 0);
          for (const sb of livingSiblings) {
            const w = sb.gender === 'male' ? 2 : 1;
            const frac = remainder * (w / totalUnits);
            shares.push({
              id: sb.id,
              name: sb.name,
              role: sb.role,
              fraction: frac,
              fractionLabel: `Asabah Waris (${w}/${totalUnits} baki)`,
              pct: Math.round(frac * 1000) / 10,
              amount: Math.round(distributableEstate * frac),
              isPlayableHeir: false,
              isEntity: false
            });
          }
        } else {
          shares.push({
            id: 'entity_baitulmal',
            name: 'Baitulmal',
            role: 'Institusi Islam',
            fraction: remainder,
            fractionLabel: 'Baki Faraid',
            pct: Math.round(remainder * 1000) / 10,
            amount: Math.round(distributableEstate * remainder),
            isPlayableHeir: false,
            isEntity: true
          });
        }
      }

      // Anak angkat (bukan waris Faraid — menerima peruntukan Hibah Anak Angkat sebelum Faraid)
      const perAdoptedHibah = adoptedKids.length > 0 ? Math.round(hibahAnakAngkatAmount / adoptedKids.length) : 0;
      const perAdoptedPct = adoptedKids.length > 0 ? Math.round((hibahAnakAngkatPct / adoptedKids.length) * 10) / 10 : 0;
      for (const ak of adoptedKids) {
        shares.push({
          id: ak.id,
          name: ak.name,
          role: `${ak.role} (Anak Angkat)`,
          fraction: 0,
          isHibah: true,
          fractionLabel: perAdoptedHibah > 0
            ? 'Hibah Anak Angkat (Bukan Waris Faraid)'
            : 'Bukan Waris Faraid (0%)',
          pct: perAdoptedPct,
          amount: perAdoptedHibah,
          isPlayableHeir: true,
          isEntity: false
        });
      }
    } else {
      // ===== B. PENGIRAAN SIVIL ({NEGARA}) =====
      const netUsd = Utils.localToUsd(netEstate, s.countryId);
      estateTaxRate = this.getCountryEstateTaxRate(s.countryId, netUsd);
      estateTaxAmount = Math.round(netEstate * estateTaxRate);
      distributableEstate = Math.max(0, netEstate - estateTaxAmount);

      const civilMode = (s.wasiat && s.wasiat.civilMode) || 'none';
      const hasKids = allLivingKids.length > 0;

      if (civilMode === 'charity') {
        wasiatLabel = 'Wasiat Sivil: 100% Amal & Kebajikan';
        wasiatAmount = distributableEstate;
        shares.push({
          id: 'entity_charity',
          name: `Tabung Kebajikan ${c.name}`,
          role: 'Badan Amal (Wasiat)',
          fraction: 1,
          fractionLabel: '100% Wasiat',
          pct: 100,
          amount: distributableEstate,
          isPlayableHeir: false,
          isEntity: true
        });
        for (const k of allLivingKids) {
          shares.push({
            id: k.id,
            name: k.name,
            role: k.role,
            fraction: 0,
            fractionLabel: '0% (Harta Diwasiatkan ke Amal)',
            pct: 0,
            amount: 0,
            isPlayableHeir: true,
            isEntity: false
          });
        }
      } else if (civilMode === 'single_heir') {
        const target = allLivingKids.find(k => k.id === s.wasiat.civilTargetHeirId)
          || allLivingKids[0]
          || livingSpouse;
        wasiatLabel = `Wasiat Sivil: 1 Waris Utama (${target ? target.name : 'Tiada'})`;
        if (target) {
          shares.push({
            id: target.id,
            name: target.name,
            role: target.role,
            fraction: 1,
            fractionLabel: '100% Waris Tunggal (Wasiat)',
            pct: 100,
            amount: distributableEstate,
            isPlayableHeir: allLivingKids.some(k => k.id === target.id),
            isEntity: false
          });
          for (const k of allLivingKids) {
            if (k.id === target.id) continue;
            shares.push({
              id: k.id,
              name: k.name,
              role: k.role,
              fraction: 0,
              fractionLabel: '0% (Tidak Dinamakan Dalam Wasiat)',
              pct: 0,
              amount: 0,
              isPlayableHeir: true,
              isEntity: false
            });
          }
        }
      } else if (civilMode === 'equal') {
        wasiatLabel = 'Wasiat Sivil: Pembahagian Sama Rata';
        const beneficiaries = [];
        if (livingSpouse) beneficiaries.push({ obj: livingSpouse, playable: false });
        for (const k of allLivingKids) beneficiaries.push({ obj: k, playable: true });

        if (beneficiaries.length > 0) {
          const frac = 1 / beneficiaries.length;
          for (const b of beneficiaries) {
            shares.push({
              id: b.obj.id,
              name: b.obj.name,
              role: b.obj.role,
              fraction: frac,
              fractionLabel: `Sama Rata (1/${beneficiaries.length})`,
              pct: Math.round(frac * 1000) / 10,
              amount: Math.round(distributableEstate * frac),
              isPlayableHeir: b.playable,
              isEntity: false
            });
          }
        } else {
          shares.push({
            id: 'entity_state',
            name: `Perbendaharaan Negara ${c.name}`,
            role: 'Kerajaan',
            fraction: 1,
            fractionLabel: 'Tiada Waris',
            pct: 100,
            amount: distributableEstate,
            isPlayableHeir: false,
            isEntity: true
          });
        }
      } else {
        // INTESTATE DEFAULT: 50% pasangan + 50% anak-anak (atau 100% anak-anak jika tiada pasangan)
        wasiatLabel = `Tiada Wasiat (Undang-undang Intestate ${c.name})`;
        if (livingSpouse && hasKids) {
          shares.push({
            id: livingSpouse.id,
            name: livingSpouse.name,
            role: livingSpouse.role,
            fraction: 0.5,
            fractionLabel: '50% (Pasangan Intestate)',
            pct: 50,
            amount: Math.round(distributableEstate * 0.5),
            isPlayableHeir: false,
            isEntity: false
          });
          const kidFrac = 0.5 / allLivingKids.length;
          for (const k of allLivingKids) {
            shares.push({
              id: k.id,
              name: k.name,
              role: k.role,
              fraction: kidFrac,
              fractionLabel: `50% ÷ ${allLivingKids.length} Anak`,
              pct: Math.round(kidFrac * 1000) / 10,
              amount: Math.round(distributableEstate * kidFrac),
              isPlayableHeir: true,
              isEntity: false
            });
          }
        } else if (hasKids) {
          const kidFrac = 1 / allLivingKids.length;
          for (const k of allLivingKids) {
            shares.push({
              id: k.id,
              name: k.name,
              role: k.role,
              fraction: kidFrac,
              fractionLabel: `100% ÷ ${allLivingKids.length} Anak`,
              pct: Math.round(kidFrac * 1000) / 10,
              amount: Math.round(distributableEstate * kidFrac),
              isPlayableHeir: true,
              isEntity: false
            });
          }
        } else if (livingSpouse) {
          shares.push({
            id: livingSpouse.id,
            name: livingSpouse.name,
            role: livingSpouse.role,
            fraction: 1,
            fractionLabel: '100% (Pasangan Intestate)',
            pct: 100,
            amount: distributableEstate,
            isPlayableHeir: false,
            isEntity: false
          });
        } else if (livingMother || livingFather || livingSiblings.length > 0) {
          const kin = [livingMother, livingFather, ...livingSiblings].filter(Boolean);
          const kFrac = 1 / kin.length;
          for (const r of kin) {
            shares.push({
              id: r.id,
              name: r.name,
              role: r.role,
              fraction: kFrac,
              fractionLabel: `Waris Terdekat (1/${kin.length})`,
              pct: Math.round(kFrac * 1000) / 10,
              amount: Math.round(distributableEstate * kFrac),
              isPlayableHeir: false,
              isEntity: false
            });
          }
        } else {
          shares.push({
            id: 'entity_state',
            name: `Perbendaharaan Negara ${c.name}`,
            role: 'Kerajaan',
            fraction: 1,
            fractionLabel: 'Tiada Waris',
            pct: 100,
            amount: distributableEstate,
            isPlayableHeir: false,
            isEntity: true
          });
        }
      }
    }

    return {
      isIslamic: islamic,
      systemLabel: islamic ? 'Hukum Faraid (Mahkamah Syariah)' : `Undang-undang Sivil ${c.name}`,
      countryId: s.countryId,
      countryName: c.name,
      countryFlag: c.flag,
      grossEstate,
      totalDebts,
      netEstate,
      wasiatAmount,
      wasiatLabel,
      hibahAnakAngkatAmount,
      hibahAnakAngkatPct,
      hibahAnakAngkatLabel,
      estateTaxRate: Math.round(estateTaxRate * 100),
      estateTaxAmount,
      distributableEstate,
      shares,
      heirlooms,
      getHeirAmount(heirId) {
        const found = shares.find(x => x.id === heirId);
        return found ? found.amount : 0;
      }
    };
  }
};
