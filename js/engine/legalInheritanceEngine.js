/* ==========================================================================
   WorldLife — Enjin Undang-Undang Sivil, Perceraian & Pewarisan Wasiat
   Sistem Sivil & Wasiat Seragam untuk Semua Negara (Bahasa Melayu)
   ========================================================================== */

window.LegalInheritanceEngine = {

  // --------------------------------------------------------------------------
  // 1. INISIALISASI MEDAN UNDANG-UNDANG SIVIL & WASIAT
  // --------------------------------------------------------------------------
  ensureLegalFields(s) {
    if (!s) return;
    if (!s.legal || typeof s.legal !== 'object') {
      s.legal = {};
    }
    if (typeof s.legal.prenup !== 'boolean') s.legal.prenup = false;
    if (s.legal.prenupPartnerId === undefined) s.legal.prenupPartnerId = null;
    if (s.legal.marriedYear === undefined) s.legal.marriedYear = null;
    if (typeof s.legal.divorceCount !== 'number') s.legal.divorceCount = 0;
    if (!Array.isArray(s.legal.alimonyObligations)) s.legal.alimonyObligations = [];
    if (!Array.isArray(s.legal.alimonyIncome)) s.legal.alimonyIncome = [];
    if (!s.legal.wasiat || typeof s.legal.wasiat !== 'object') {
      s.legal.wasiat = {
        mode: 'equal', // 'equal' | 'spouse_all' | 'single_child' | 'charity'
        soleBeneficiaryId: null,
        charityPct: 0
      };
    }
    // Bersihkan medan warisan lama jika wujud daripada simpanan terdahulu
    delete s.legal.rujukDeadlineYear;
    delete s.legal.rujukExId;
    delete s.legal.rujukExName;
  },

  // --------------------------------------------------------------------------
  // 2. CUKAI HARTA PUSAKA MENGIKUT NEGARA (SIVIL)
  // --------------------------------------------------------------------------
  getCountryEstateTaxRate(countryId, netEstateUsd = 0) {
    if (netEstateUsd <= 0) return 0;
    const zeroTaxCountries = ['MY', 'SG', 'AU', 'NZ', 'CA', 'AE', 'SA', 'QA', 'KW', 'BN', 'ID', 'CN', 'IN', 'SE', 'NO'];
    if (zeroTaxCountries.includes(countryId)) return 0;
    if (countryId === 'US') return netEstateUsd > 1000000 ? 0.18 : 0.05;
    if (countryId === 'GB' || countryId === 'UK') return netEstateUsd > 400000 ? 0.20 : 0.05;
    if (countryId === 'JP' || countryId === 'KR') return netEstateUsd > 300000 ? 0.22 : 0.08;
    if (countryId === 'DE' || countryId === 'FR') return netEstateUsd > 400000 ? 0.15 : 0.05;
    return netEstateUsd > 500000 ? 0.10 : 0;
  },

  // --------------------------------------------------------------------------
  // 3. PERJANJIAN PRA-PERKAHWINAN (PRENUP) & REKOD PERKAHWINAN SIVIL
  // --------------------------------------------------------------------------
  getPrenupFeeLocal(countryId) {
    return Utils.usdToLocal(650, countryId);
  },

  recordMarriageStart(s, partner, hasPrenup = false) {
    this.ensureLegalFields(s);
    s.legal.prenup = Boolean(hasPrenup);
    s.legal.prenupPartnerId = hasPrenup && partner ? partner.id : null;
    s.legal.marriedYear = s.year;
    s.legal.preMarriageNetWorth = Math.max(0, GameState.getNetWorth());
  },

  // --------------------------------------------------------------------------
  // 4. PRATONTON & PELAKSANAAN PERCERAIAN SIVIL
  // --------------------------------------------------------------------------
  previewDivorce(s, partner, opts = {}) {
    this.ensureLegalFields(s);
    const mode = opts.settlementMode || 'mutual'; // 'mutual' | 'contested'
    const netWorth = Math.max(0, GameState.getNetWorth());
    const hasPrenup = Boolean(s.legal.prenup && (!s.legal.prenupPartnerId || s.legal.prenupPartnerId === (partner && partner.id)));
    const yearsMarried = Math.max(1, (s.year || 2025) - (s.legal.marriedYear || s.year || 2025));

    const legalFeeUsd = mode === 'contested' ? 2800 : 850;
    const legalFeeLocal = Utils.usdToLocal(legalFeeUsd, s.countryId);

    let splitPct = 0.50;
    if (hasPrenup) {
      splitPct = 0.10;
    } else if (mode === 'mutual') {
      splitPct = Math.min(0.45, 0.20 + yearsMarried * 0.03);
    } else {
      splitPct = 0.50;
    }

    const settlementLocal = Math.round(Math.max(0, s.money) * splitPct);
    const children = (s.relationships || []).filter(r => this._isChildRel(r) && r.alive && r.age < 18);
    const baseAlimony = hasPrenup ? 0 : Math.round(((s.job && s.job.salary) || 0) * (children.length > 0 ? 0.15 : 0.08));
    const alimonyYears = baseAlimony > 0 ? Math.min(8, Math.max(2, yearsMarried)) : 0;

    return {
      courtLabel: 'Mahkamah Sivil',
      hasPrenup,
      yearsMarried,
      splitPct: Math.round(splitPct * 100),
      legalFeeLocal,
      settlementLocal,
      alimonyAnnualLocal: baseAlimony,
      alimonyYears,
      childrenCount: children.length,
      summary: hasPrenup
        ? 'Perjanjian Pra-Perkahwinan aktif — sebahagian besar aset asal anda dilindungi.'
        : (mode === 'mutual'
          ? 'Perceraian persetujuan bersama — kos guaman lebih rendah dan pembahagian harta secara rundingan.'
          : 'Perceraian bertikai di Mahkamah Sivil — pembahagian harta sepencarian 50/50 serta kos guaman lebih tinggi.')
    };
  },

  executeDivorce(s, partnerId, opts = {}) {
    this.ensureLegalFields(s);
    const partner = (s.relationships || []).find(r => r.id === partnerId);
    if (!partner) return { ok: false, msg: 'Pasangan tidak ditemui.' };

    const prev = this.previewDivorce(s, partner, opts);
    const totalDeduct = prev.legalFeeLocal + prev.settlementLocal;
    s.money = Math.round(s.money - totalDeduct);

    if (prev.alimonyAnnualLocal > 0 && prev.alimonyYears > 0) {
      s.legal.alimonyObligations.push({
        exId: partner.id,
        exName: partner.name,
        annualLocal: prev.alimonyAnnualLocal,
        yearsLeft: prev.alimonyYears
      });
    }

    s.relationships = (s.relationships || []).filter(r => r && r.id !== partner.id);
    s.married = false;
    s.maritalStatus = 'divorced';
    s.partnerId = null;
    s.legal.prenup = false;
    s.legal.prenupPartnerId = null;
    s.legal.marriedYear = null;
    s.legal.divorceCount = (s.legal.divorceCount || 0) + 1;

    GameState.adjustStats({ happiness: -22 });
    if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: 18 });

    const fmtCost = Utils.formatMoney(totalDeduct, s.countryId);
    GameState.addJournalEntry(
      `⚖️ Perceraian sivil dengan ${partner.name} dimuktamadkan di Mahkamah Sivil. Kos guaman & penyelesaian harta: ${fmtCost}.${prev.alimonyAnnualLocal > 0 ? ` Nafkah tahunan: ${Utils.formatMoney(prev.alimonyAnnualLocal, s.countryId)}/thn selama ${prev.alimonyYears} tahun.` : ''}`,
      'warning'
    );
    GameState.save();

    return {
      ok: true,
      msg: `Perceraian sivil dengan ${partner.name} selesai (${fmtCost}).`
    };
  },

  // --------------------------------------------------------------------------
  // 5. KUTIPAN / BAYARAN NAFKAH TAHUNAN
  // --------------------------------------------------------------------------
  tickYearlyLegal(s) {
    this.ensureLegalFields(s);
    if (s.legal.alimonyObligations.length > 0) {
      s.legal.alimonyObligations = s.legal.alimonyObligations.filter(ob => {
        if (ob.yearsLeft <= 0) return false;
        const pay = Math.max(0, Math.round(ob.annualLocal || 0));
        if (pay > 0) s.money = Math.round(s.money - pay);
        ob.yearsLeft -= 1;
        return ob.yearsLeft > 0;
      });
    }
    if (s.legal.alimonyIncome.length > 0) {
      s.legal.alimonyIncome = s.legal.alimonyIncome.filter(inc => {
        if (inc.yearsLeft <= 0) return false;
        const gain = Math.max(0, Math.round(inc.annualLocal || 0));
        if (gain > 0) s.money = Math.round(s.money + gain);
        inc.yearsLeft -= 1;
        return inc.yearsLeft > 0;
      });
    }
  },

  _getLivingFamilyHeirs(s) {
    return (s.relationships || []).filter(r =>
      r && r.alive && (
        r.id === s.partnerId ||
        r.category === 'family' ||
        r.category === 'spouse' ||
        r.category === 'partner' ||
        r.type === 'sibling' ||
        this._isChildRel(r) ||
        this._isParentRel(r)
      )
    );
  },

  ensureFamilyTrust(s) {
    if (!s) return null;
    if (!s.familyTrust || typeof s.familyTrust !== 'object') {
      s.familyTrust = {
        active: false,
        balance: 0,
        assets: [],
        investments: [],
        feeRate: 1.5,
        yearsActive: 0,
        fundManager: null,
        underAudit: false,
        lapsed: false,
        lastPaidAge: null,
        founderName: null,
        founderGen: null,
        foundedYear: null,
        prevTotalValue: 0,
        baselineValue: 0
      };
    }
    const ft = s.familyTrust;
    ft.active = Boolean(ft.active);
    ft.balance = Math.max(0, Math.round(Number(ft.balance) || 0));
    if (!Array.isArray(ft.assets)) ft.assets = [];
    if (!Array.isArray(ft.investments)) ft.investments = [];
    ft.feeRate = 1.5;
    if (typeof ft.yearsActive !== 'number' || Number.isNaN(ft.yearsActive)) ft.yearsActive = 0;
    if (ft.fundManager && typeof ft.fundManager === 'object') {
      if (typeof ft.fundManager.yearsLeft !== 'number') ft.fundManager.yearsLeft = 1;
    } else {
      ft.fundManager = null;
    }
    ft.underAudit = Boolean(ft.underAudit);
    ft.lapsed = Boolean(ft.lapsed);
    if (ft.lastPaidAge === undefined) ft.lastPaidAge = null;
    if (ft.active && !ft.founderName) {
      ft.founderName = s.name || 'Pengasas';
      ft.founderGen = s.generation || 1;
      ft.foundedYear = s.year || 2026;
    }
    if (typeof ft.prevTotalValue !== 'number' || Number.isNaN(ft.prevTotalValue)) ft.prevTotalValue = 0;
    if (typeof ft.baselineValue !== 'number' || Number.isNaN(ft.baselineValue)) ft.baselineValue = 0;
    if (typeof ft.unpaidFees !== 'number' || Number.isNaN(ft.unpaidFees) || ft.unpaidFees < 0) ft.unpaidFees = 0;
    ft.unpaidFees = Math.round(ft.unpaidFees);
    // Selaraskan status Tergantung secara eksklusif dengan unpaidFees > 0 & bersihkan flag lama
    ft.lapsed = ft.unpaidFees > 0;
    if ('suspended' in ft) ft.suspended = false;
    if ('isSuspended' in ft) ft.isSuspended = false;
    if ('feeOverdue' in ft) ft.feeOverdue = false;
    if (!Array.isArray(s.trustHistory)) s.trustHistory = [];

    // Migrasi selamat untuk simpanan lama yang pernah memilih pewaris tunggal 100%
    if (s.legal && s.legal.wasiat && (s.legal.wasiat.mode === 'sole_heir' || s.legal.wasiat.mode === 'single_child' || s.legal.wasiat.willType === 'sole_heir' || s.legal.wasiat.willType === 'single_child')) {
      s.legal.wasiat.mode = 'equal';
      s.legal.wasiat.willType = 'equal';
      s.legal.wasiat.soleHeirId = null;
      s.legal.wasiat.soleBeneficiaryId = null;
    }
    this.deduplicateTrustAssets(s);
    return ft;
  },

  _isTrustFlagged(x) {
    return !!(x && (x.inTrust || x.isInTrust || x.inFoundation || x.owner === 'trust'));
  },

  // Sanitasi save lama: pastikan aset/pelaburan Yayasan tidak wujud serentak dalam inventori peribadi
  deduplicateTrustAssets(s) {
    if (!s || !s.familyTrust || !s.assets) return 0;
    const ft = s.familyTrust;
    const trustAssets = Array.isArray(ft.assets) ? ft.assets : [];
    const uidSet = new Set();
    const sigSet = new Set();
    const sig = (a, type) => `${type}|${a.name || ''}|${Math.round(a.value || 0)}`;
    trustAssets.forEach(a => {
      if (!a) return;
      const type = a.trustAssetType || 'vehicle';
      if (a.uid != null) uidSet.add(String(a.uid));
      if (a.id != null) uidSet.add('id:' + String(a.id));
      if (a.uid == null && a.id == null) sigSet.add(sig(a, type));
    });
    let removed = 0;
    [['properties', 'property'], ['vehicles', 'vehicle'], ['collectibles', 'collectible']].forEach(([key, type]) => {
      const list = s.assets[key];
      if (!Array.isArray(list)) return;
      s.assets[key] = list.filter(x => {
        if (!x) return false;
        const dup = this._isTrustFlagged(x)
          || (x.uid != null && uidSet.has(String(x.uid)))
          || (x.id != null && uidSet.has('id:' + String(x.id)))
          || (x.uid == null && x.id == null && sigSet.has(sig(x, type)));
        if (dup) removed++;
        return !dup;
      });
    });
    // Portfolio: buang pegangan peribadi yang bertanda milik Yayasan
    // (pegangan instId sama tanpa tanda adalah sah — dibeli semula selepas pemindahan)
    const pf = s.assets.portfolio;
    if (pf && typeof pf === 'object') {
      Object.keys(pf).forEach(k => {
        if (this._isTrustFlagged(pf[k])) { delete pf[k]; removed++; }
      });
    }
    return removed;
  },

  TRUST_MAX_ARREARS_USD: 100000000, // Had maksimum tunggakan: $100M USD

  getTrustMaxArrearsLocal(s) {
    const cid = (s && s.countryId) || 'MY';
    return Math.max(1, Math.round(Utils.usdToLocal(this.TRUST_MAX_ARREARS_USD, cid)));
  },

  TAX_HAVEN_ISLAND_IDS: [
    'BS', 'BB', 'SC', 'MV', 'MU', 'VU',
    'AG', 'KN', 'LC', 'GD', 'DM',
    'PW', 'MH', 'NR', 'WS', 'TO', 'TV', 'KI', 'FJ',
    'MT', 'CY'
  ],

  getTrustCountryRates(countryOrId) {
    let c = null;
    if (countryOrId && typeof countryOrId === 'object' && countryOrId.id) {
      c = countryOrId;
    } else if (typeof countryOrId === 'string' && window.Utils && Utils.getCountry) {
      c = Utils.getCountry(countryOrId);
    } else if (countryOrId && typeof countryOrId === 'object' && countryOrId.countryId && window.Utils && Utils.getCountry) {
      c = Utils.getCountry(countryOrId.countryId);
    }
    const cid = c && c.id ? String(c.id).toUpperCase() : '';
    if (cid && this.TAX_HAVEN_ISLAND_IDS.includes(cid)) {
      return {
        categoryLabel: 'Negara Pulau Bebas Cukai',
        annualFeeRate: 0,
        annualFeeCapUsd: 0,
        corporateTaxRate: 0,
        isTaxHaven: true
      };
    }

    const rawCorp = (c && typeof c.corporateTaxRate === 'number')
      ? c.corporateTaxRate
      : (c && typeof c.taxRate === 'number' ? c.taxRate : 0.20);
    const corporateTaxRate = Math.min(0.25, Math.max(0.15, Number(rawCorp) || 0.20));
    const salMult = Number((c && c.salaryMultiplier) || 0.5);

    if (salMult >= 1.1) {
      return {
        categoryLabel: 'Negara Maju',
        annualFeeRate: 0.015,
        annualFeeCapUsd: 25000000,
        corporateTaxRate,
        isTaxHaven: false
      };
    }
    if (salMult >= 0.45) {
      return {
        categoryLabel: 'Negara Membangun',
        annualFeeRate: 0.005,
        annualFeeCapUsd: 10000000,
        corporateTaxRate,
        isTaxHaven: false
      };
    }
    return {
      categoryLabel: 'Negara Mundur',
      annualFeeRate: 0.001,
      annualFeeCapUsd: 2000000,
      corporateTaxRate,
      isTaxHaven: false
    };
  },

  getTrustDomicileCountry(s) {
    if (!s) return null;
    const domId = (s.familyTrust && s.familyTrust.domicileCountry) || s.countryId || 'MY';
    return (window.Utils && Utils.getCountry) ? Utils.getCountry(domId) : null;
  },

  getCorporateTaxRate(s) {
    const c = this.getTrustDomicileCountry(s);
    return this.getTrustCountryRates(c).corporateTaxRate;
  },

  getTrustSetupCost(s, targetCountryId = null) {
    const cid = (s && s.countryId) || 'MY';
    const base = this.getTrustSetupFee(s);
    const destId = targetCountryId || cid;
    if (destId === cid) {
      return { total: base, base, proxyFee: 0, isOffshore: false, rates: this.getTrustCountryRates(cid) };
    }
    const rates = this.getTrustCountryRates(destId);
    const proxyUsd = rates.isTaxHaven ? 250000 : 100000;
    const proxyFee = Utils.usdToLocal(proxyUsd, cid);
    return { total: base + proxyFee, base, proxyFee, isOffshore: true, rates };
  },

  getTrustRelocateFee(s) {
    if (!s) return 0;
    const cid = s.countryId || 'MY';
    const raw = Math.round(this.getTrustNetWorth(s) * 0.005);
    const minFee = Utils.usdToLocal(150000, cid);
    const maxFee = Utils.usdToLocal(5000000, cid);
    return Math.min(maxFee, Math.max(minFee, raw));
  },

  toggleTrustDomicileLock(s) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureFamilyTrust(s);
    if (!s.familyTrust.active) return { ok: false, msg: 'Tabung Yayasan Keluarga tidak aktif.' };
    s.familyTrust.isDomicileLocked = !s.familyTrust.isDomicileLocked;
    const domC = this.getTrustDomicileCountry(s);
    const domName = domC ? `${domC.flag} ${domC.name}` : (s.familyTrust.domicileCountry || s.countryId);
    GameState.addJournalEntry(
      s.familyTrust.isDomicileLocked
        ? `🔒 Domisil Tabung Yayasan Keluarga dikunci di ${domName} — kekal di negara ini walaupun anda berhijrah.`
        : `🔓 Kunci domisil Tabung Yayasan Keluarga dibuka — pendaftaran Yayasan akan mengikut negara baharu jika anda berhijrah.`
    );
    GameState.save();
    return {
      ok: true,
      msg: s.familyTrust.isDomicileLocked
        ? `Domisil Yayasan dikunci di ${domName}.`
        : 'Kunci domisil Yayasan dibuka.'
    };
  },

  relocateTrustDomicile(s, targetCountryId = null, paySource = 'auto') {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureFamilyTrust(s);
    if (s.age < 18) return { ok: false, msg: 'Hanya dibuka untuk umur 18 tahun ke atas.' };
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Pemindahan pendaftaran disekat semasa dalam tahanan.' };
    if (!s.familyTrust.active) return { ok: false, msg: 'Tabung Yayasan Keluarga tidak aktif.' };
    if ((s.familyTrust.unpaidFees || 0) > 0) {
      return { ok: false, msg: `Pemindahan domisil dikunci selagi tunggakan yuran (${Utils.formatMoney(s.familyTrust.unpaidFees, s.countryId)}) belum dilangsaikan.` };
    }
    const destId = targetCountryId || s.countryId;
    if (s.familyTrust.domicileCountry === destId) {
      return { ok: false, msg: 'Yayasan sudah pun didaftarkan di negara tersebut.' };
    }
    const fee = this.getTrustRelocateFee(s);
    const trustBal = Math.max(0, Math.round(s.familyTrust.balance || 0));
    const persBal = Math.max(0, Math.round(s.money || 0));
    if (paySource === 'trust') {
      if (trustBal < fee) return { ok: false, msg: `Baki tunai Yayasan tidak mencukupi (Yuran Proksi: ${Utils.formatMoney(fee, s.countryId)}).` };
      s.familyTrust.balance -= fee;
    } else if (paySource === 'personal') {
      if (persBal < fee) return { ok: false, msg: `Baki tunai peribadi tidak mencukupi (Yuran Proksi: ${Utils.formatMoney(fee, s.countryId)}).` };
      s.money -= fee;
    } else {
      if (trustBal >= fee) {
        s.familyTrust.balance -= fee;
      } else if (persBal >= fee) {
        s.money -= fee;
      } else if (trustBal + persBal >= fee) {
        const rem = fee - trustBal;
        s.familyTrust.balance = 0;
        s.money -= rem;
      } else {
        return { ok: false, msg: `Baki tidak mencukupi — yuran penstrukturan proksi ialah ${Utils.formatMoney(fee, s.countryId)}.` };
      }
    }
    const newC = (window.Utils && Utils.getCountry) ? Utils.getCountry(destId) : null;
    s.familyTrust.domicileCountry = destId;
    s.familyTrust.isDomicileLocked = true;
    const newRates = this.getTrustCountryRates(newC);
    s.familyTrust.feeRate = Number((newRates.annualFeeRate * 100).toFixed(2));
    GameState.addJournalEntry(
      `🌐 Firma proksi berjaya memindahkan pendaftaran domisil Tabung Yayasan Keluarga ke ${newC ? `${newC.flag} ${newC.name}` : destId} (${newRates.categoryLabel} • Yuran ${s.familyTrust.feeRate}%/thn) dengan yuran penstrukturan ${Utils.formatMoney(fee, s.countryId)}.`,
      'milestone'
    );
    GameState.save();
    return { ok: true, msg: `Domisil Yayasan berjaya dipindahkan ke ${newC ? newC.name : destId}!` };
  },

  convertTrustCurrency(s, fromId, toId) {
    if (!s || !s.familyTrust || !fromId || !toId || fromId === toId) return;
    if (!window.Utils || !Utils.convertMoney) return;
    const ft = s.familyTrust;
    ft.balance = Math.max(0, Utils.convertMoney(ft.balance || 0, fromId, toId));
    if (ft.unpaidFees > 0) ft.unpaidFees = Math.max(0, Utils.convertMoney(ft.unpaidFees, fromId, toId));
    if (ft.prevTotalValue > 0) ft.prevTotalValue = Math.max(0, Utils.convertMoney(ft.prevTotalValue, fromId, toId));
    if (ft.baselineValue > 0) ft.baselineValue = Math.max(0, Utils.convertMoney(ft.baselineValue, fromId, toId));
    if (Array.isArray(ft.assets)) {
      ft.assets.forEach(a => {
        if (!a) return;
        if (typeof a.value === 'number') a.value = Math.max(0, Utils.convertMoney(a.value, fromId, toId));
        if (typeof a.purchasePrice === 'number') a.purchasePrice = Math.max(0, Utils.convertMoney(a.purchasePrice, fromId, toId));
        if (typeof a.upkeep === 'number') a.upkeep = Math.max(0, Utils.convertMoney(a.upkeep, fromId, toId));
      });
    }
    if (Array.isArray(ft.investments)) {
      ft.investments.forEach(h => {
        if (!h) return;
        if (typeof h.totalCost === 'number') h.totalCost = Math.max(0, Utils.convertMoney(h.totalCost, fromId, toId));
      });
    }
    ft.isDomicileLocked = true;
  },

  getTrustAssetsValue(s) {
    if (!s || !s.familyTrust || !Array.isArray(s.familyTrust.assets)) return 0;
    return Math.round(s.familyTrust.assets.reduce((acc, a) => acc + Math.max(0, Number(a && a.value) || 0), 0));
  },

  getTrustInvestmentUnitPrice(s, holding) {
    if (!s || !holding) return 100;
    const inst = (window.AssetsData && AssetsData.INVESTMENTS)
      ? AssetsData.INVESTMENTS.find(x => x.id === holding.instId)
      : null;
    const marketInfo = s.assetMarket && s.assetMarket.invPrices && s.assetMarket.invPrices[holding.instId];
    const fallback = (window.AssetsEngine && AssetsEngine._scaleUsdToLocal)
      ? AssetsEngine._scaleUsdToLocal(inst ? inst.baseUnitUsd : 100, s.countryId, false)
      : 100;
    let price = (marketInfo && marketInfo.price) || fallback;
    if (holding.instId === 'inv_fd_bank' && holding.units > 0) {
      const avgBuy = Math.round((holding.totalCost || 0) / holding.units);
      price = Math.max(price, avgBuy);
    }
    return Math.max(1, Math.round(price));
  },

  getTrustInvestmentsValue(s) {
    if (!s || !s.familyTrust || !Array.isArray(s.familyTrust.investments)) return 0;
    return Math.round(s.familyTrust.investments.reduce((acc, h) => {
      if (!h || (h.units || 0) <= 0) return acc;
      return acc + Math.round(h.units * this.getTrustInvestmentUnitPrice(s, h));
    }, 0));
  },

  getTrustNetWorth(s) {
    if (!s) return 0;
    this.ensureFamilyTrust(s);
    return Math.max(0, Math.round((s.familyTrust.balance || 0) + this.getTrustAssetsValue(s) + this.getTrustInvestmentsValue(s)));
  },

  getTrustPerformancePct(s) {
    if (!s) return { pct: 0, hasBaseline: false };
    this.ensureFamilyTrust(s);
    const ft = s.familyTrust;
    const currentVal = this.getTrustNetWorth(s);
    const refVal = ft.prevTotalValue > 0 ? ft.prevTotalValue : ft.baselineValue;
    if (!refVal || refVal <= 0) return { pct: 0, hasBaseline: false };
    const pct = ((currentVal - refVal) / refVal) * 100;
    return { pct: Number(pct.toFixed(1)), hasBaseline: true };
  },

  _adjustTrustBasis(s, delta) {
    if (!s || !s.familyTrust) return;
    const ft = s.familyTrust;
    if (ft.prevTotalValue > 0) ft.prevTotalValue = Math.max(0, Math.round(ft.prevTotalValue + delta));
    ft.baselineValue = Math.max(0, Math.round((ft.baselineValue || 0) + delta));
  },

  getTrustSetupFee(s) {
    if (!s) return 0;
    return Utils.usdToLocal(5000, s.countryId || 'MY');
  },

  getTrustAnnualFee(s) {
    if (!s) return 0;
    this.ensureFamilyTrust(s);
    const c = this.getTrustDomicileCountry(s);
    const rates = this.getTrustCountryRates(c);
    if (!rates || rates.annualFeeRate <= 0) return 0;
    const trustWealth = this.getTrustNetWorth(s);
    const rawFee = Math.max(0, Math.round(trustWealth * rates.annualFeeRate));
    if (rates.annualFeeCapUsd > 0) {
      const capLocal = Utils.usdToLocal(rates.annualFeeCapUsd, s.countryId || 'MY');
      return Math.min(rawFee, capLocal);
    }
    return rawFee;
  },

  FUND_MANAGER_CONTRACT_RATES: {
    1: 0.03,
    2: 0.055,
    3: 0.08,
    5: 0.12
  },

  getFundManagerOffers(s, selectedYears = 1) {
    this.ensureFamilyTrust(s);
    const yrs = [1, 2, 3, 5].includes(Number(selectedYears)) ? Number(selectedYears) : 1;
    const cid = (s && s.countryId) || 'MY';
    const trustNetWorth = Math.max(0, this.getTrustNetWorth(s));
    const contractRate = this.FUND_MANAGER_CONTRACT_RATES[yrs] || 0.03;
    const minBaseLocal = Utils.usdToLocal(15000 * yrs, cid);
    const baseContractCost = Math.max(minBaseLocal, Math.round(trustNetWorth * contractRate));
    const tiers = [
      {
        tier: 'junior',
        icon: '📋',
        title: 'Pengurus Dana Junior',
        desc: 'Yuran lantikan mampu milik; pengurusan asas tetapi terdedah kepada kesilapan audit dan risiko pecah amanah.',
        mult: 0.6
      },
      {
        tier: 'profesional',
        icon: '💼',
        title: 'Pengurus Korporat Profesional',
        desc: 'Yuran sederhana; pematuhan cukai lebih teratur dan risiko terkawal.',
        mult: 0.8
      },
      {
        tier: 'elit',
        icon: '🏆',
        title: 'Pengurus Dana Elit (Padu)',
        desc: 'Yuran lantikan premium; pengurusan aset mantap serta perlindungan kukuh terhadap audit cukai dan pecah amanah.',
        mult: 1.0
      }
    ];
    return tiers.map(t => {
      const effPct = Number((contractRate * t.mult * 100).toFixed(1));
      const cost = Math.max(Math.round(minBaseLocal * t.mult), Math.round(baseContractCost * t.mult));
      return {
        ...t,
        years: yrs,
        ratePct: effPct,
        rateLabel: `${effPct}%`,
        cost
      };
    });
  },

  hireFundManager(s, tier, selectedYears = 1) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureFamilyTrust(s);
    if (s.age < 18) return { ok: false, msg: 'Hanya dibuka untuk umur 18 tahun ke atas.' };
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Tidak boleh melantik pengurus dana semasa dalam tahanan.' };
    if (!s.familyTrust.active) return { ok: false, msg: 'Sila tubuhkan Tabung Yayasan Keluarga dahulu.' };

    const yrs = [1, 2, 3, 5].includes(Number(selectedYears)) ? Number(selectedYears) : 1;
    const offer = this.getFundManagerOffers(s, yrs).find(o => o.tier === tier);
    if (!offer) return { ok: false, msg: 'Pilihan pengurus dana tidak sah.' };

    if (s.money >= offer.cost) {
      s.money -= offer.cost;
    } else if (s.familyTrust.balance >= offer.cost) {
      s.familyTrust.balance -= offer.cost;
    } else {
      return { ok: false, msg: `Baki tidak mencukupi — yuran lantikan (${yrs} tahun) ialah ${Utils.formatMoney(offer.cost, s.countryId)}.` };
    }

    const names = {
      junior: ['Encik Hakim', 'Cik Nadia', 'Encik Faizal', 'Cik Aina'],
      profesional: ['Dato\' Farid', 'Puan Marisa', 'Encik Kenneth Tan', 'Puan Syafiqah'],
      elit: ['Tan Sri Dr. Iskandar', 'Puan Sri Evelyn Wong', 'Dato\' Seri Azlan', 'Dr. Marcus Vance']
    };
    const mgrName = Utils.pick(names[tier] || names.junior);
    s.familyTrust.fundManager = {
      tier,
      name: mgrName,
      yearsLeft: yrs
    };
    GameState.addJournalEntry(
      `👔 Anda melantik ${mgrName} (${offer.title}) sebagai Pengurus Dana Yayasan Keluarga untuk kontrak ${yrs} tahun (${Utils.formatMoney(offer.cost, s.countryId)}).`,
      'milestone'
    );
    GameState.save();
    return { ok: true, msg: `${mgrName} (${offer.title}) dilantik untuk kontrak ${yrs} tahun!` };
  },

  transferAssetToTrust(s, assetType, uid, proxyChannel = null) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureFamilyTrust(s);
    if (s.age < 18) return { ok: false, msg: 'Hanya dibuka untuk umur 18 tahun ke atas.' };
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Pemindahan aset disekat semasa dalam tahanan.' };
    if (!s.familyTrust.active) return { ok: false, msg: 'Sila tubuhkan Tabung Yayasan Keluarga dahulu.' };
    if ((s.familyTrust.unpaidFees || 0) > 0) {
      return { ok: false, msg: `Pemindahan aset dikunci selagi tunggakan yuran (${Utils.formatMoney(s.familyTrust.unpaidFees, s.countryId)}) belum dilangsaikan.` };
    }

    const listKey = assetType === 'property' ? 'properties' : assetType === 'collectible' ? 'collectibles' : 'vehicles';
    if (!s.assets || !Array.isArray(s.assets[listKey])) return { ok: false, msg: 'Aset tidak ditemui.' };
    const idx = s.assets[listKey].findIndex(x => x && x.uid === uid);
    if (idx === -1) return { ok: false, msg: 'Aset tidak ditemui.' };

    const targetAsset = s.assets[listKey][idx];
    let proxyRes = null;
    if (this.isTrustOffshore(s)) {
      proxyRes = this._chargeOffshoreAssetProxy(s, 'in', targetAsset.value || 0, proxyChannel);
      if (!proxyRes.ok) return proxyRes;
    }

    const [asset] = s.assets[listKey].splice(idx, 1);
    s.familyTrust.assets.push({
      ...asset,
      trustAssetType: assetType
    });
    this._adjustTrustBasis(s, Math.max(0, Math.round(asset.value || 0)));
    if (proxyRes) {
      const domC = this.getTrustDomicileCountry(s);
      const domName = domC ? domC.name : (s.familyTrust.domicileCountry || 'luar negara');
      GameState.addJournalEntry(`🌐 Anda memindahkan aset ${asset.name} (${Utils.formatMoney(asset.value || 0, s.countryId)}) ke Yayasan di ${domName} melalui ${proxyRes.channelLabel} (Yuran proksi: -${Utils.formatMoney(proxyRes.proxyFee, s.countryId)}).`);
      GameState.save();
      return { ok: true, msg: `${asset.name} dipindahkan ke Yayasan di ${domName} melalui ${proxyRes.channelLabel}!` };
    }
    GameState.addJournalEntry(`🏛️ Aset ${asset.name} (${Utils.formatMoney(asset.value || 0, s.countryId)}) dipindahkan ke dalam Tabung Yayasan Keluarga.`);
    GameState.save();
    return { ok: true, msg: `${asset.name} berjaya dipindahkan ke Yayasan Keluarga!` };
  },

  withdrawAssetFromTrust(s, uid, proxyChannel = null) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureFamilyTrust(s);
    if (s.age < 18) return { ok: false, msg: 'Hanya dibuka untuk umur 18 tahun ke atas.' };
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Pengeluaran aset disekat semasa dalam tahanan.' };
    if (!s.familyTrust.active) return { ok: false, msg: 'Tabung Yayasan Keluarga tidak aktif.' };
    if ((s.familyTrust.unpaidFees || 0) > 0) {
      return { ok: false, msg: `Pengeluaran aset dikunci selagi tunggakan yuran (${Utils.formatMoney(s.familyTrust.unpaidFees, s.countryId)}) belum dilangsaikan.` };
    }

    const idx = s.familyTrust.assets.findIndex(x => x && x.uid === uid);
    if (idx === -1) return { ok: false, msg: 'Aset yayasan tidak ditemui.' };

    const targetAsset = s.familyTrust.assets[idx];
    let proxyRes = null;
    if (this.isTrustOffshore(s)) {
      proxyRes = this._chargeOffshoreAssetProxy(s, 'out', targetAsset.value || 0, proxyChannel);
      if (!proxyRes.ok) return proxyRes;
    }

    const [asset] = s.familyTrust.assets.splice(idx, 1);
    const listKey = asset.trustAssetType === 'property' ? 'properties' : asset.trustAssetType === 'collectible' ? 'collectibles' : 'vehicles';
    delete asset.trustAssetType;
    delete asset.inTrust; delete asset.isInTrust; delete asset.inFoundation; if (asset.owner === 'trust') delete asset.owner;
    if (!s.assets) s.assets = { properties: [], vehicles: [], collectibles: [] };
    if (!Array.isArray(s.assets[listKey])) s.assets[listKey] = [];
    s.assets[listKey].push(asset);
    this._adjustTrustBasis(s, -Math.max(0, Math.round(asset.value || 0)));

    GameState.addJournalEntry(`📤 Aset ${asset.name} dikeluarkan daripada Tabung Yayasan Keluarga ke pemilikan peribadi.`);
    GameState.save();
    return { ok: true, msg: `${asset.name} dikeluarkan ke aset peribadi.` };
  },

  toggleDisplayTrustCollectible(s, uid) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureFamilyTrust(s);
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Tidak boleh menguruskan pameran semasa dalam tahanan.' };
    const col = (s.familyTrust.assets || []).find(x => x && x.uid === uid && x.trustAssetType === 'collectible');
    if (!col) return { ok: false, msg: 'Koleksi yayasan tidak ditemui.' };
    col.isDisplayed = !col.isDisplayed;
    GameState.addJournalEntry(
      col.isDisplayed
        ? `🏛️ Koleksi Yayasan (${col.name}) kini dipamerkan di galeri — royalti bersih akan dikreditkan terus ke Tabung Yayasan Keluarga.`
        : `📦 Koleksi Yayasan (${col.name}) ditarik balik daripada pameran galeri.`
    );
    GameState.save();
    return { ok: true, msg: col.isDisplayed ? `${col.name} (Yayasan) kini dipamerkan!` : `${col.name} ditarik balik daripada pameran.` };
  },

  transferInvestmentToTrust(s, instId, proxyChannel = null) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureFamilyTrust(s);
    if (s.age < 18) return { ok: false, msg: 'Hanya dibuka untuk umur 18 tahun ke atas.' };
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Pemindahan pelaburan disekat semasa dalam tahanan.' };
    if (!s.familyTrust.active) return { ok: false, msg: 'Sila tubuhkan Tabung Yayasan Keluarga dahulu.' };
    if ((s.familyTrust.unpaidFees || 0) > 0) {
      return { ok: false, msg: `Pemindahan pelaburan dikunci selagi tunggakan yuran (${Utils.formatMoney(s.familyTrust.unpaidFees, s.countryId)}) belum dilangsaikan.` };
    }

    const portfolio = s.assets && s.assets.portfolio;
    if (!portfolio || !portfolio[instId] || portfolio[instId].units <= 0) {
      return { ok: false, msg: 'Pegangan pelaburan tidak ditemui.' };
    }
    const pos = portfolio[instId];
    const existing = s.familyTrust.investments.find(x => x && x.instId === instId);
    const unitPrice = this.getTrustInvestmentUnitPrice(s, { instId, units: pos.units, totalCost: pos.totalCost });
    const moveVal = Math.round(pos.units * unitPrice);
    if (this.isTrustOffshore(s)) {
      const proxyRes = this._chargeOffshoreAssetProxy(s, 'in', moveVal, proxyChannel);
      if (!proxyRes.ok) return proxyRes;
    }

    if (existing) {
      existing.units += pos.units;
      existing.totalCost = Math.round((existing.totalCost || 0) + (pos.totalCost || 0));
    } else {
      s.familyTrust.investments.push({
        instId,
        units: pos.units,
        totalCost: Math.round(pos.totalCost || 0)
      });
    }
    delete portfolio[instId];
    this._adjustTrustBasis(s, moveVal);
    const inst = (window.AssetsData && AssetsData.INVESTMENTS) ? AssetsData.INVESTMENTS.find(x => x.id === instId) : null;
    GameState.addJournalEntry(`📈 Pelaburan ${inst ? inst.name : instId} (${Utils.formatMoney(moveVal, s.countryId)}) dipindahkan ke dalam Tabung Yayasan Keluarga.`);
    GameState.save();
    return { ok: true, msg: `${inst ? inst.name : instId} dipindahkan ke Yayasan Keluarga!` };
  },

  withdrawInvestmentFromTrust(s, instId, proxyChannel = null) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureFamilyTrust(s);
    if (s.age < 18) return { ok: false, msg: 'Hanya dibuka untuk umur 18 tahun ke atas.' };
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Pengeluaran pelaburan disekat semasa dalam tahanan.' };
    if (!s.familyTrust.active) return { ok: false, msg: 'Tabung Yayasan Keluarga tidak aktif.' };
    if ((s.familyTrust.unpaidFees || 0) > 0) {
      return { ok: false, msg: `Pengeluaran pelaburan dikunci selagi tunggakan yuran (${Utils.formatMoney(s.familyTrust.unpaidFees, s.countryId)}) belum dilangsaikan.` };
    }

    const idx = s.familyTrust.investments.findIndex(x => x && x.instId === instId);
    if (idx === -1) return { ok: false, msg: 'Pelaburan yayasan tidak ditemui.' };
    const previewHolding = s.familyTrust.investments[idx];
    const unitPrice = this.getTrustInvestmentUnitPrice(s, previewHolding);
    const moveVal = Math.round(previewHolding.units * unitPrice);
    if (this.isTrustOffshore(s)) {
      const proxyRes = this._chargeOffshoreAssetProxy(s, 'out', moveVal, proxyChannel);
      if (!proxyRes.ok) return proxyRes;
    }
    const [holding] = s.familyTrust.investments.splice(idx, 1);

    if (!s.assets) s.assets = { properties: [], vehicles: [], portfolio: {} };
    if (!s.assets.portfolio) s.assets.portfolio = {};
    if (s.assets.portfolio[instId]) {
      s.assets.portfolio[instId].units += holding.units;
      s.assets.portfolio[instId].totalCost = Math.round((s.assets.portfolio[instId].totalCost || 0) + (holding.totalCost || 0));
    } else {
      s.assets.portfolio[instId] = { units: holding.units, totalCost: Math.round(holding.totalCost || 0) };
    }
    this._adjustTrustBasis(s, -moveVal);
    const inst = (window.AssetsData && AssetsData.INVESTMENTS) ? AssetsData.INVESTMENTS.find(x => x.id === instId) : null;
    GameState.addJournalEntry(`📤 Pelaburan ${inst ? inst.name : instId} dikeluarkan daripada Yayasan Keluarga ke portfolio peribadi.`);
    GameState.save();
    return { ok: true, msg: `${inst ? inst.name : instId} dikeluarkan ke portfolio peribadi.` };
  },

  toggleRentTrustProperty(s, uid) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureFamilyTrust(s);
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Tidak boleh menguruskan penyewaan semasa dalam tahanan.' };
    const p = (s.familyTrust.assets || []).find(x => x && x.uid === uid && x.trustAssetType === 'property');
    if (!p) return { ok: false, msg: 'Hartanah yayasan tidak ditemui.' };
    if (!p.rented && (p.condition ?? 80) <= 50) {
      return { ok: false, msg: 'Keadaan rumah terlalu daif (≤50%). Sila baik pulih dahulu sebelum disewakan.' };
    }
    p.rented = !p.rented;
    const estRent = Math.round((p.value || 0) * ((p.yieldPct || 5.5) / 100));
    GameState.addJournalEntry(
      p.rented
        ? `🔑 Hartanah Yayasan (${p.name}) kini disewakan (~${Utils.formatMoney(estRent, s.countryId)}/thn terus ke akaun Yayasan).`
        : `🏠 Penyewaan hartanah Yayasan (${p.name}) ditamatkan.`
    );
    GameState.save();
    return { ok: true, msg: p.rented ? `Hartanah yayasan disewakan (~${Utils.formatMoney(estRent, s.countryId)}/thn)!` : 'Penyewaan hartanah yayasan ditamatkan.' };
  },

  repairTrustProperty(s, uid) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureFamilyTrust(s);
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Tidak boleh membaik pulih hartanah semasa dalam tahanan.' };
    const p = (s.familyTrust.assets || []).find(x => x && x.uid === uid && x.trustAssetType === 'property');
    if (!p) return { ok: false, msg: 'Hartanah yayasan tidak ditemui.' };
    if ((p.condition ?? 80) >= 100) return { ok: false, msg: 'Hartanah yayasan sudah berada pada kondisi 100%.' };
    const cost = (window.AssetsEngine && AssetsEngine.getPropertyRepairCost)
      ? AssetsEngine.getPropertyRepairCost(s, p)
      : Math.max(Utils.usdToLocal(200, s.countryId), Math.round((p.value || 0) * 0.04));

    if (s.familyTrust.balance >= cost) {
      s.familyTrust.balance -= cost;
    } else if (s.money >= cost) {
      s.money -= cost;
    } else {
      return { ok: false, msg: `Baki tidak mencukupi — kos baik pulih ialah ${Utils.formatMoney(cost, s.countryId)}.` };
    }
    p.condition = 100;
    GameState.addJournalEntry(`🔧 Hartanah Yayasan (${p.name}) dibaik pulih sepenuhnya (100%) dengan kos ${Utils.formatMoney(cost, s.countryId)}.`);
    GameState.save();
    return { ok: true, msg: `${p.name} selesai dibaik pulih (Kondisi kini 100%)!` };
  },

  sellTrustAsset(s, uid) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureFamilyTrust(s);
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Jualan aset yayasan disekat semasa dalam tahanan.' };
    const idx = (s.familyTrust.assets || []).findIndex(x => x && x.uid === uid);
    if (idx === -1) return { ok: false, msg: 'Aset yayasan tidak ditemui.' };
    const asset = s.familyTrust.assets[idx];
    const gross = (asset.trustAssetType === 'property' && window.AssetsEngine && AssetsEngine.getPropertyResalePrice)
      ? AssetsEngine.getPropertyResalePrice(asset)
      : Math.max(0, Math.round(asset.value || 0));
    const corpRate = this.getCorporateTaxRate(s);
    const corpTax = Math.round(gross * corpRate);
    const net = Math.max(0, gross - corpTax);

    s.familyTrust.assets.splice(idx, 1);
    s.familyTrust.balance += net;
    GameState.addJournalEntry(
      `💵 Jualan Terus Aset Yayasan (${asset.name}): Kasar ${Utils.formatMoney(gross, s.countryId)} — Cukai Korporat (${Math.round(corpRate * 100)}%: -${Utils.formatMoney(corpTax, s.countryId)}) → Bersih ${Utils.formatMoney(net, s.countryId)} dikreditkan ke Tabung Yayasan.`,
      'milestone'
    );
    GameState.save();
    return { ok: true, msg: `${asset.name} terjual! ${Utils.formatMoney(net, s.countryId)} dikreditkan ke Yayasan (selepas Cukai Korporat ${Math.round(corpRate * 100)}%).` };
  },

  sellTrustInvestment(s, instId, fraction = 1) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureFamilyTrust(s);
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Jualan pelaburan yayasan disekat semasa dalam tahanan.' };
    const idx = (s.familyTrust.investments || []).findIndex(x => x && x.instId === instId);
    if (idx === -1) return { ok: false, msg: 'Pelaburan yayasan tidak ditemui.' };
    const holding = s.familyTrust.investments[idx];
    const frac = Math.min(1, Math.max(0.1, Number(fraction) || 1));
    const sellUnits = frac >= 0.99 ? holding.units : Math.max(0.01, holding.units * frac);
    const unitPrice = this.getTrustInvestmentUnitPrice(s, holding);
    const gross = Math.round(sellUnits * unitPrice);
    const corpRate = this.getCorporateTaxRate(s);
    const corpTax = Math.round(gross * corpRate);
    const net = Math.max(0, gross - corpTax);

    if (frac >= 0.99 || sellUnits >= holding.units) {
      s.familyTrust.investments.splice(idx, 1);
    } else {
      holding.units = Math.max(0, holding.units - sellUnits);
      holding.totalCost = Math.round((holding.totalCost || 0) * (1 - frac));
    }
    s.familyTrust.balance += net;
    const inst = (window.AssetsData && AssetsData.INVESTMENTS) ? AssetsData.INVESTMENTS.find(x => x.id === instId) : null;
    GameState.addJournalEntry(
      `📈💵 Jualan Pelaburan Yayasan (${inst ? inst.name : instId} ${Math.round(frac * 100)}%): Kasar ${Utils.formatMoney(gross, s.countryId)} — Cukai Korporat (${Math.round(corpRate * 100)}%: -${Utils.formatMoney(corpTax, s.countryId)}) → Bersih ${Utils.formatMoney(net, s.countryId)} dikreditkan ke Yayasan.`
    );
    GameState.save();
    return { ok: true, msg: `Terjual! ${Utils.formatMoney(net, s.countryId)} dikreditkan ke Tabung Yayasan (Cukai Korporat ${Math.round(corpRate * 100)}%).` };
  },

  setupFamilyTrust(s, targetCountryId = null) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureLegalFields(s);
    this.ensureFamilyTrust(s);
    if (s.age < 18) return { ok: false, msg: 'Anda mesti berumur 18 tahun ke atas untuk menubuhkan Yayasan Keluarga.' };
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Tidak boleh menubuhkan Yayasan Keluarga semasa dalam tahanan.' };
    if (s.familyTrust.active) return { ok: false, msg: 'Tabung Yayasan Keluarga sudah pun aktif.' };
    const destId = targetCountryId || s.countryId || 'MY';
    const costInfo = this.getTrustSetupCost(s, destId);
    if (s.money < costInfo.total) {
      return { ok: false, msg: `Baki tidak mencukupi — jumlah kos penubuhan ialah ${Utils.formatMoney(costInfo.total, s.countryId)}.` };
    }
    s.money -= costInfo.total;
    s.familyTrust.active = true;
    s.familyTrust.lapsed = false;
    s.familyTrust.unpaidFees = 0;
    s.familyTrust.unpaidStreakYears = 0;
    s.familyTrust.lastPaidAge = s.age;
    s.familyTrust.feeRate = Number((costInfo.rates.annualFeeRate * 100).toFixed(2));
    s.familyTrust.yearsActive = 0;
    s.familyTrust.founderName = s.name || 'Pengasas';
    s.familyTrust.founderGen = s.generation || 1;
    s.familyTrust.foundedYear = s.year || 2026;
    s.familyTrust.prevTotalValue = 0;
    s.familyTrust.baselineValue = 0;
    s.familyTrust.domicileCountry = destId;
    s.familyTrust.isDomicileLocked = true;
    const destC = (window.Utils && Utils.getCountry) ? Utils.getCountry(destId) : null;
    const destName = destC ? `${destC.flag} ${destC.name}` : destId;
    GameState.addJournalEntry(
      costInfo.isOffshore
        ? `🌐 Anda menubuhkan Tabung Yayasan Keluarga Luar Pesisir di ${destName} melalui Proksi Guaman (Jumlah kos: ${Utils.formatMoney(costInfo.total, s.countryId)}).`
        : `🏛️ Anda menubuhkan Tabung Yayasan Keluarga di ${destName} dengan yuran pendaftaran ${Utils.formatMoney(costInfo.total, s.countryId)}. Harta dalam yayasan kini dilindungi bebas cukai pusaka untuk pewaris pemain!`,
      'milestone'
    );
    GameState.save();
    return { ok: true, msg: `Tabung Yayasan Keluarga berjaya ditubuhkan di ${destC ? destC.name : destId}!` };
  },

  OFFSHORE_PROXY_RATES: {
    official: 0.035,
    legal: 0.035,
    shadow: 0.015
  },

  OFFSHORE_PROXY_LIMITS: {
    official: { feeRate: 0.035, minTrustUsd: 1000000, minTxUsd: 100000, annualLimitUsd: 25000000 },
    shadow:   { feeRate: 0.015, minTrustUsd: 0,       minTxUsd: 10000,  annualLimitUsd: 5000000 }
  },

  getTrustNetWorthUsd(s) {
    if (!s) return 0;
    const localVal = this.getTrustNetWorth(s);
    return (window.Utils && Utils.localToUsd) ? Math.round(Utils.localToUsd(localVal, s.countryId)) : Math.round(localVal / 4.5);
  },

  validateOffshoreProxyTransfer(s, amt, proxyChannel) {
    this.ensureFamilyTrust(s);
    const channel = proxyChannel === 'shadow' ? 'shadow' : 'official';
    const cfg = this.OFFSHORE_PROXY_LIMITS[channel];
    const amountUsd = Math.round((window.Utils && Utils.localToUsd) ? Utils.localToUsd(amt, s.countryId) : (amt / 4.5));
    const trustUsd = this.getTrustNetWorthUsd(s);
    const usedUsd = Math.max(0, Math.round((s.familyTrust.proxyUsedUsdThisYear && s.familyTrust.proxyUsedUsdThisYear[channel]) || 0));
    const remainingUsd = Math.max(0, cfg.annualLimitUsd - usedUsd);

    if (cfg.minTrustUsd > 0 && trustUsd < cfg.minTrustUsd) {
      return { ok: false, msg: 'Firma Guaman Rasmi memerlukan Nilai Bersih Yayasan sekurang-kurangnya $1M USD.' };
    }
    if (remainingUsd <= 0) {
      return { ok: false, msg: 'Had pemindahan tahunan bagi saluran ini telah dicapai — akan reset tahun hadapan.' };
    }
    if (amountUsd < cfg.minTxUsd) {
      const minLocal = (window.Utils && Utils.usdToLocal) ? Utils.usdToLocal(cfg.minTxUsd, s.countryId) : cfg.minTxUsd;
      return { ok: false, msg: `Transaksi minimum bagi saluran ini ialah $${(cfg.minTxUsd / 1000).toLocaleString('en-US')}K USD (${Utils.formatMoney(minLocal, s.countryId)}).` };
    }
    if (usedUsd + amountUsd > cfg.annualLimitUsd) {
      const remLocal = (window.Utils && Utils.usdToLocal) ? Utils.usdToLocal(remainingUsd, s.countryId) : remainingUsd;
      return { ok: false, msg: `Jumlah melebihi baki had tahunan saluran ini (${Utils.formatMoney(remLocal, s.countryId)} / $${remainingUsd.toLocaleString('en-US')} USD).` };
    }
    return { ok: true, channel, cfg, amountUsd, usedUsd, remainingUsd };
  },

  isTrustOffshore(s) {
    return Boolean(
      s && s.familyTrust && s.familyTrust.active &&
      s.familyTrust.domicileCountry && s.familyTrust.domicileCountry !== s.countryId
    );
  },

  _chargeOffshoreAssetProxy(s, direction, assetValue, proxyChannel) {
    const val = Math.max(0, Math.round(Number(assetValue) || 0));
    const check = this.validateOffshoreProxyTransfer(s, val, proxyChannel);
    if (!check.ok) return check;
    const { channel, cfg, amountUsd } = check;
    const proxyFee = Math.max(1, Math.round(val * cfg.feeRate));
    if (direction === 'in') {
      if ((s.money || 0) < proxyFee) {
        return { ok: false, msg: `Tunai peribadi tidak cukup untuk yuran proksi (${Utils.formatMoney(proxyFee, s.countryId)}).` };
      }
      s.money -= proxyFee;
    } else {
      if ((s.familyTrust.balance || 0) >= proxyFee) {
        s.familyTrust.balance -= proxyFee;
      } else if ((s.money || 0) >= proxyFee) {
        s.money -= proxyFee;
      } else {
        return { ok: false, msg: `Baki tunai Yayasan dan tunai peribadi tidak mencukupi untuk yuran proksi (${Utils.formatMoney(proxyFee, s.countryId)}).` };
      }
    }
    s.familyTrust.proxyUsedUsdThisYear[channel] = Math.round((s.familyTrust.proxyUsedUsdThisYear[channel] || 0) + amountUsd);
    if (channel === 'shadow') this._applyShadowProxyRisk(s, val);
    const channelLabel = channel === 'shadow' ? 'Ejen Proksi Bayangan' : 'Firma Guaman Rasmi';
    return { ok: true, channel, proxyFee, channelLabel };
  },

  _applyShadowProxyRisk(s, amt) {
    const ft = s.familyTrust;
    const usdVal = (window.Utils && Utils.localToUsd) ? Utils.localToUsd(amt, s.countryId) : (amt / 4.5);
    let triggerProb = 0.16;
    if (usdVal >= 1000000) triggerProb += 0.22;
    else if (usdVal >= 100000) triggerProb += 0.10;
    triggerProb = Math.min(0.45, triggerProb);

    ft.offshoreAuditRisk = Math.min(0.60, Number(((ft.offshoreAuditRisk || 0) + 0.08).toFixed(2)));
    ft.auditHeat = Math.min(5, Number(((ft.auditHeat || 0) + 1).toFixed(2)));
    if (window.Utils && Utils.chance && Utils.chance(triggerProb)) {
      ft.underAudit = true;
      ft.offshoreAuditRisk = Math.min(0.85, Number(((ft.offshoreAuditRisk || 0) + 0.35).toFixed(2)));
      GameState.addJournalEntry(
        `⚠️ Pihak berkuasa cukai mengesan aliran dana rentas sempadan yang mencurigakan melalui ejen proksi bayangan. Tabung Yayasan Keluarga anda kini dalam pemerhatian audit!`,
        'warning'
      );
    }
  },

  depositFamilyTrust(s, amount, proxyChannel = null) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureFamilyTrust(s);
    if (s.age < 18) return { ok: false, msg: 'Hanya dibuka untuk umur 18 tahun ke atas.' };
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Transaksi yayasan disekat semasa dalam tahanan.' };
    if (!s.familyTrust.active) return { ok: false, msg: 'Sila tubuhkan Tabung Yayasan Keluarga dahulu.' };
    if ((s.familyTrust.unpaidFees || 0) > 0) {
      return { ok: false, msg: `Kemasukan dana dikunci selagi tunggakan yuran (${Utils.formatMoney(s.familyTrust.unpaidFees, s.countryId)}) belum dilangsaikan.` };
    }
    const amt = Math.round(Number(amount) || 0);
    if (amt <= 0) return { ok: false, msg: 'Masukkan jumlah dana yang sah.' };
    if (s.money < amt) return { ok: false, msg: 'Baki bank tidak mencukupi.' };

    if (this.isTrustOffshore(s)) {
      const check = this.validateOffshoreProxyTransfer(s, amt, proxyChannel);
      if (!check.ok) return check;
      const { channel, cfg, amountUsd } = check;
      const proxyFee = Math.max(1, Math.round(amt * cfg.feeRate));
      const netAmt = Math.max(0, amt - proxyFee);
      const domC = this.getTrustDomicileCountry(s);
      const domName = domC ? domC.name : (s.familyTrust.domicileCountry || 'luar negara');
      const channelLabel = channel === 'shadow' ? 'Ejen Proksi Bayangan' : 'Firma Guaman Rasmi';
      s.money -= amt;
      s.familyTrust.balance += netAmt;
      s.familyTrust.proxyUsedUsdThisYear[channel] = Math.round((s.familyTrust.proxyUsedUsdThisYear[channel] || 0) + amountUsd);
      this._adjustTrustBasis(s, netAmt);
      GameState.addJournalEntry(
        `🌐 Anda menyalurkan ${Utils.formatMoney(amt, s.countryId)} ke Yayasan di ${domName} melalui ${channelLabel} (Yuran proksi: -${Utils.formatMoney(proxyFee, s.countryId)} • Bersih diterima: ${Utils.formatMoney(netAmt, s.countryId)}).`
      );
      if (channel === 'shadow') this._applyShadowProxyRisk(s, amt);
      GameState.save();
      return { ok: true, msg: `Dana bersih ${Utils.formatMoney(netAmt, s.countryId)} disalurkan ke Yayasan di ${domName} melalui ${channelLabel}.` };
    }

    s.money -= amt;
    s.familyTrust.balance += amt;
    this._adjustTrustBasis(s, amt);
    GameState.addJournalEntry(`🏛️ Memasukkan ${Utils.formatMoney(amt, s.countryId)} ke dalam Tabung Yayasan Keluarga (Dana Yayasan: ${Utils.formatMoney(s.familyTrust.balance, s.countryId)}).`);
    GameState.save();
    return { ok: true, msg: `Dana ${Utils.formatMoney(amt, s.countryId)} dimasukkan ke Yayasan Keluarga.` };
  },

  withdrawFamilyTrust(s, amount, proxyChannel = null) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureFamilyTrust(s);
    if (s.age < 18) return { ok: false, msg: 'Hanya dibuka untuk umur 18 tahun ke atas.' };
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Transaksi yayasan disekat semasa dalam tahanan.' };
    if (!s.familyTrust.active) return { ok: false, msg: 'Tabung Yayasan Keluarga tidak aktif.' };
    if ((s.familyTrust.unpaidFees || 0) > 0) {
      return { ok: false, msg: `Pengeluaran dana dikunci selagi tunggakan yuran (${Utils.formatMoney(s.familyTrust.unpaidFees, s.countryId)}) belum dilangsaikan.` };
    }
    const amt = Math.round(Number(amount) || 0);
    if (amt <= 0) return { ok: false, msg: 'Masukkan jumlah pengeluaran yang sah.' };
    if (s.familyTrust.balance < amt) return { ok: false, msg: 'Dana dalam Yayasan Keluarga tidak mencukupi.' };

    if (this.isTrustOffshore(s)) {
      const check = this.validateOffshoreProxyTransfer(s, amt, proxyChannel);
      if (!check.ok) return check;
      const { channel, cfg, amountUsd } = check;
      const proxyFee = Math.max(1, Math.round(amt * cfg.feeRate));
      const netAmt = Math.max(0, amt - proxyFee);
      const domC = this.getTrustDomicileCountry(s);
      const domName = domC ? domC.name : (s.familyTrust.domicileCountry || 'luar negara');
      const channelLabel = channel === 'shadow' ? 'Ejen Proksi Bayangan' : 'Firma Guaman Rasmi';
      s.familyTrust.balance -= amt;
      s.money += netAmt;
      s.familyTrust.proxyUsedUsdThisYear[channel] = Math.round((s.familyTrust.proxyUsedUsdThisYear[channel] || 0) + amountUsd);
      this._adjustTrustBasis(s, -amt);
      GameState.addJournalEntry(
        `🌐 Anda mengeluarkan ${Utils.formatMoney(amt, s.countryId)} daripada Yayasan di ${domName} melalui ${channelLabel} (Yuran proksi: -${Utils.formatMoney(proxyFee, s.countryId)} • Bersih diterima: ${Utils.formatMoney(netAmt, s.countryId)}).`
      );
      if (channel === 'shadow') this._applyShadowProxyRisk(s, amt);
      GameState.save();
      return { ok: true, msg: `Dana bersih ${Utils.formatMoney(netAmt, s.countryId)} diterima ke akaun bank melalui ${channelLabel}.` };
    }

    s.familyTrust.balance -= amt;
    s.money += amt;
    this._adjustTrustBasis(s, -amt);
    GameState.addJournalEntry(`💵 Mengeluarkan ${Utils.formatMoney(amt, s.countryId)} daripada Tabung Yayasan Keluarga ke akaun bank.`);
    GameState.save();
    return { ok: true, msg: `Dana ${Utils.formatMoney(amt, s.countryId)} dikeluarkan ke akaun bank.` };
  },

  getBulkTransferPreview(s) {
    if (!s) return { cash: 0, invCount: 0, propCount: 0, vehCount: 0, colCount: 0, hasAny: false };
    const cash = Math.max(0, Math.floor(s.money || 0));
    const pf = (s.assets && s.assets.portfolio) || {};
    const invCount = Object.values(pf).filter(p => p && p.units > 0 && !this._isTrustFlagged(p)).length;
    const propCount = ((s.assets && s.assets.properties) || []).filter(x => x && !this._isTrustFlagged(x)).length;
    const vehCount = ((s.assets && s.assets.vehicles) || []).filter(x => x && !this._isTrustFlagged(x)).length;
    const colCount = ((s.assets && s.assets.collectibles) || []).filter(x => x && !this._isTrustFlagged(x)).length;
    return {
      cash,
      invCount,
      propCount,
      vehCount,
      colCount,
      hasAny: cash > 0 || (invCount + propCount + vehCount + colCount) > 0
    };
  },

  transferAllPersonalWealthToTrust(s, opts = {}) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureFamilyTrust(s);
    if (s.age < 18) return { ok: false, msg: 'Hanya dibuka untuk umur 18 tahun ke atas.' };
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Pemindahan aset disekat semasa dalam tahanan.' };
    if (!s.familyTrust.active) return { ok: false, msg: 'Sila tubuhkan Tabung Yayasan Keluarga dahulu.' };
    if ((s.familyTrust.unpaidFees || 0) > 0) {
      return { ok: false, msg: `Pemindahan pukal dikunci selagi tunggakan yuran (${Utils.formatMoney(s.familyTrust.unpaidFees, s.countryId)}) belum dilangsaikan.` };
    }
    if (this.isTrustOffshore(s)) {
      return { ok: false, msg: 'Pemindahan pukal semua harta hanya dibenarkan di negara domisil Yayasan. Untuk pemindahan tunai dari luar negara, gunakan saluran Proksi di atas.' };
    }
    const preview = this.getBulkTransferPreview(s);
    if (!preview.hasAny) {
      return { ok: false, msg: 'Tiada harta peribadi yang layak untuk dipindahkan.' };
    }

    let totalBasisDelta = 0;
    const keepPct = opts && opts.keepEmergency10 ? 0.10 : 0;
    if (preview.cash > 0) {
      const moveCash = keepPct > 0 ? Math.floor(preview.cash * (1 - keepPct)) : preview.cash;
      if (moveCash > 0) {
        s.money = Math.max(0, Math.round((s.money || 0) - moveCash));
        s.familyTrust.balance = Math.round((s.familyTrust.balance || 0) + moveCash);
        totalBasisDelta += moveCash;
      }
    }

    const pf = s.assets && s.assets.portfolio;
    if (pf && typeof pf === 'object') {
      Object.keys(pf).forEach(instId => {
        const pos = pf[instId];
        if (!pos || pos.units <= 0 || this._isTrustFlagged(pos)) return;
        const unitPrice = this.getTrustInvestmentUnitPrice(s, { instId, units: pos.units, totalCost: pos.totalCost });
        totalBasisDelta += Math.round(pos.units * unitPrice);
        const existing = s.familyTrust.investments.find(x => x && x.instId === instId);
        if (existing) {
          existing.units += pos.units;
          existing.totalCost = Math.round((existing.totalCost || 0) + (pos.totalCost || 0));
        } else {
          s.familyTrust.investments.push({ instId, units: pos.units, totalCost: Math.round(pos.totalCost || 0) });
        }
        delete pf[instId];
      });
    }

    [['properties', 'property'], ['vehicles', 'vehicle'], ['collectibles', 'collectible']].forEach(([listKey, assetType]) => {
      const list = s.assets && Array.isArray(s.assets[listKey]) ? s.assets[listKey] : null;
      if (!list || list.length === 0) return;
      list.forEach(item => {
        if (!item || this._isTrustFlagged(item)) return;
        s.familyTrust.assets.push({ ...item, trustAssetType: assetType });
        totalBasisDelta += Math.max(0, Math.round(item.value || 0));
      });
      s.assets[listKey] = [];
    });

    this.deduplicateTrustAssets(s);
    if (totalBasisDelta > 0) this._adjustTrustBasis(s, totalBasisDelta);
    GameState.addJournalEntry('📦 Semua harta peribadi layak telah dipindahkan serentak ke dalam Tabung Yayasan Keluarga.', 'milestone');
    GameState.save();
    return { ok: true, msg: 'Semua harta peribadi layak berjaya dipindahkan ke Tabung Yayasan Keluarga!' };
  },

  payTrustUnpaidFees(s, amount = null) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureFamilyTrust(s);
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Tidak boleh membayar tunggakan yayasan semasa dalam tahanan.' };
    const ft = s.familyTrust;
    const due = Math.max(0, Math.round(ft.unpaidFees || 0));
    if (!ft.active || due <= 0) {
      ft.unpaidFees = 0;
      ft.unpaidStreakYears = 0;
      ft.lapsed = false;
      return { ok: false, msg: 'Yayasan tidak mempunyai tunggakan yuran.' };
    }
    const availableTotal = Math.max(0, Math.round(ft.balance || 0)) + Math.max(0, Math.round(s.money || 0));
    if (availableTotal <= 0) {
      return { ok: false, msg: 'Tiada baki tunai peribadi atau tunai Yayasan untuk membayar tunggakan.' };
    }
    const requested = (amount !== null && amount !== undefined && Number(amount) > 0)
      ? Math.round(Number(amount))
      : due;
    const payAmt = Math.min(due, requested, availableTotal);
    if (payAmt <= 0) return { ok: false, msg: 'Masukkan jumlah bayaran yang sah.' };

    // Guna baki tunai Yayasan dahulu, selebihnya daripada tunai peribadi
    const fromTrust = Math.min(Math.max(0, Math.round(ft.balance || 0)), payAmt);
    const fromPersonal = payAmt - fromTrust;
    ft.balance = Math.max(0, Math.round((ft.balance || 0) - fromTrust));
    s.money = Math.round((s.money || 0) - fromPersonal);
    ft.unpaidFees = Math.max(0, due - payAmt);

    if (ft.unpaidFees <= 0) {
      ft.unpaidFees = 0;
      ft.lapsed = false;
      ft.lastPaidAge = s.age;
      GameState.addJournalEntry(
        `🔄 Tunggakan yuran Tabung Yayasan Keluarga (${Utils.formatMoney(payAmt, s.countryId)}) telah dilangsaikan sepenuhnya. Semua transaksi & perlindungan Yayasan dibuka semula!`,
        'milestone'
      );
      GameState.save();
      return { ok: true, cleared: true, paid: payAmt, msg: 'Semua tunggakan yuran Yayasan dilangsaikan! Akses dibuka semula.' };
    }

    GameState.addJournalEntry(
      `🏛️ Bayaran separa tunggakan yuran Yayasan (${Utils.formatMoney(payAmt, s.countryId)}) direkodkan. Baki tunggakan: ${Utils.formatMoney(ft.unpaidFees, s.countryId)}.`
    );
    GameState.save();
    return {
      ok: true,
      cleared: false,
      paid: payAmt,
      remaining: ft.unpaidFees,
      msg: `Bayaran separa ${Utils.formatMoney(payAmt, s.countryId)} berjaya. Baki tunggakan: ${Utils.formatMoney(ft.unpaidFees, s.countryId)}.`
    };
  },

  payTrustArrearsAndReactivate(s, amount = null) {
    return this.payTrustUnpaidFees(s, amount);
  },

  forceDissolveTrustForDebt(state) {
    if (!state || !state.familyTrust) return { triggered: false };
    this.ensureFamilyTrust(state);
    const ft = state.familyTrust;
    if (!ft.active) return { triggered: false };

    const totalTrustValue = this.getTrustNetWorth(state);
    const debtDue = Math.max(0, Math.round(ft.unpaidFees || 0));
    const countryId = state.countryId || 'MY';

    if (!Array.isArray(state.trustHistory)) state.trustHistory = [];
    state.trustHistory.push({
      year: state.year || 2026,
      age: state.age || 0,
      generation: state.generation || 1,
      founderName: ft.founderName || state.name || 'Pengasas',
      totalTrustValue,
      debtDue,
      reason: 'Dibubarkan secara paksa — gagal melangsaikan tunggakan yuran melebihi tempoh 3 tahun'
    });

    let surplus = 0;
    let shortfall = 0;
    if (totalTrustValue >= debtDue) {
      // KES A: Nilai Yayasan mencukupi — langsaikan hutang dan pulangkan baki lebihan ke tunai peribadi
      surplus = Math.max(0, totalTrustValue - debtDue);
      state.money = Math.round((state.money || 0) + surplus);
      GameState.addJournalEntry(
        `🚨🏛️ PEMBUBARAN PAKSA YAYASAN: Tunggakan yuran mencapai had maksimum $100M USD! Semua aset Yayasan dicairkan untuk melangsaikan hutang ${Utils.formatMoney(debtDue, countryId)}, dan baki lebihan ${Utils.formatMoney(surplus, countryId)} telah dipulangkan ke akaun tunai peribadi anda.`,
        'warning'
      );
    } else {
      // KES B: Nilai Yayasan tidak mencukupi — sita semua aset Yayasan dan jadikan baki kekurangan sebagai Hutang Generasi
      shortfall = Math.max(1, debtDue - totalTrustValue);
      if (!Array.isArray(state.loans)) state.loans = [];
      state.loans.push({
        id: 'gendebt_' + Date.now() + '_' + Utils.randInt(10, 99),
        lenderType: 'bank',
        isGenerational: true,
        lenderName: 'Hutang Generasi (Tunggakan Yayasan)',
        principal: shortfall,
        balance: shortfall,
        interestRate: 0.04,
        yearlyDue: Math.max(1, Math.round(shortfall / 5)),
        yearsElapsed: 0,
        missedPayments: 0,
        paidThisYear: false
      });
      GameState.addJournalEntry(
        `🚨🏛️ PEMBUBARAN PAKSA YAYASAN: Tunggakan yuran mencapai had maksimum $100M USD! Kesemua aset Yayasan (${Utils.formatMoney(totalTrustValue, countryId)}) telah disita dan baki kekurangan ${Utils.formatMoney(shortfall, countryId)} direkodkan sebagai Hutang Generasi yang akan diwarisi merentas generasi sehingga dilangsaikan.`,
        'warning'
      );
    }

    // Tutup dan reset familyTrust kepada tidak aktif
    ft.assets = [];
    ft.investments = [];
    ft.balance = 0;
    ft.unpaidFees = 0;
    ft.unpaidStreakYears = 0;
    ft.active = false;
    ft.lapsed = false;
    ft.underAudit = false;
    ft.fundManager = null;
    ft.lastPaidAge = null;
    ft.founderName = null;
    ft.founderGen = null;
    ft.foundedYear = null;
    ft.yearsActive = 0;
    ft.feeRate = 1.5;
    ft.prevTotalValue = 0;
    ft.baselineValue = 0;

    GameState.save();
    return { triggered: true, totalTrustValue, debtDue, surplus, shortfall };
  },

  dissolveFamilyTrust(s) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureFamilyTrust(s);
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Tidak boleh membubarkan yayasan semasa dalam tahanan.' };
    if (!s.familyTrust.active) return { ok: false, msg: 'Tabung Yayasan Keluarga tidak aktif.' };
    if ((s.familyTrust.unpaidFees || 0) > 0) {
      return { ok: false, msg: `Pembubaran sukarela dikunci selagi tunggakan yuran (${Utils.formatMoney(s.familyTrust.unpaidFees, s.countryId)}) belum dilangsaikan.` };
    }
    const returned = Math.max(0, Math.round(s.familyTrust.balance || 0));
    s.money += returned;
    if (!s.assets) s.assets = { properties: [], vehicles: [], collectibles: [], portfolio: {} };
    if (!Array.isArray(s.assets.properties)) s.assets.properties = [];
    if (!Array.isArray(s.assets.vehicles)) s.assets.vehicles = [];
    if (!Array.isArray(s.assets.collectibles)) s.assets.collectibles = [];
    if (!s.assets.portfolio) s.assets.portfolio = {};
    (s.familyTrust.assets || []).forEach(a => {
      const listKey = a.trustAssetType === 'property' ? 'properties' : a.trustAssetType === 'collectible' ? 'collectibles' : 'vehicles';
      const copy = { ...a };
      delete copy.trustAssetType;
      delete copy.inTrust; delete copy.isInTrust; delete copy.inFoundation; if (copy.owner === 'trust') delete copy.owner;
      s.assets[listKey].push(copy);
    });
    (s.familyTrust.investments || []).forEach(h => {
      if (!h || (h.units || 0) <= 0) return;
      if (s.assets.portfolio[h.instId]) {
        s.assets.portfolio[h.instId].units += h.units;
        s.assets.portfolio[h.instId].totalCost = Math.round((s.assets.portfolio[h.instId].totalCost || 0) + (h.totalCost || 0));
      } else {
        s.assets.portfolio[h.instId] = { units: h.units, totalCost: Math.round(h.totalCost || 0) };
      }
    });
    s.familyTrust.assets = [];
    s.familyTrust.investments = [];
    s.familyTrust.balance = 0;
    s.familyTrust.unpaidFees = 0;
    s.familyTrust.active = false;
    s.familyTrust.lapsed = false;
    s.familyTrust.underAudit = false;
    s.familyTrust.fundManager = null;
    s.familyTrust.lastPaidAge = null;
    s.familyTrust.founderName = null;
    s.familyTrust.founderGen = null;
    s.familyTrust.foundedYear = null;
    s.familyTrust.yearsActive = 0;
    s.familyTrust.feeRate = 1.5;
    s.familyTrust.prevTotalValue = 0;
    s.familyTrust.baselineValue = 0;
    GameState.addJournalEntry(`❌ Tabung Yayasan Keluarga dibubarkan. Dana ${Utils.formatMoney(returned, s.countryId)}, aset & pelaburan dikembalikan ke pemilikan peribadi.`, 'warning');
    GameState.save();
    return { ok: true, msg: `Yayasan Keluarga dibubarkan. ${Utils.formatMoney(returned, s.countryId)} serta semua aset & pelaburan dikembalikan.` };
  },

  tickYearlyFamilyTrust(s) {
    if (!s || !s.alive) return null;
    this.ensureFamilyTrust(s);
    const ft = s.familyTrust;
    ft.proxyUsedUsdThisYear = { official: 0, shadow: 0 };
    if (!ft.active) return null;

    // 0. Simpan nilai tahun sebelumnya untuk kiraan prestasi
    const valueBeforeYear = this.getTrustNetWorth(s);
    if (valueBeforeYear > 0) ft.prevTotalValue = valueBeforeYear;

    // 1. Pengasingan Aliran Tunai Ketat: semua sewa hartanah yayasan & dividen/faedah pelaburan masuk ke ft.balance
    let trustRentNet = 0;
    let trustDivIncome = 0;
    let trustDisplayNet = 0;
    let trustDisplayedCount = 0;
    for (const a of ft.assets) {
      if (!a) continue;
      if (a.trustAssetType === 'collectible') {
        if (window.AssetsEngine && AssetsEngine.applyCollectibleYearlyAppreciation) {
          AssetsEngine.applyCollectibleYearlyAppreciation(s, a);
        }
        if (a.isDisplayed && window.AssetsEngine && AssetsEngine.getCollectibleDisplayFinances) {
          const fin = AssetsEngine.getCollectibleDisplayFinances(s, a);
          if (ft.balance < fin.annualInsurance) {
            a.isDisplayed = false;
            GameState.addJournalEntry(
              `🏛️⚠️ Pameran koleksi Yayasan (${a.name}) dibatalkan secara automatik kerana baki Yayasan tidak mencukupi untuk insurans (${Utils.formatMoney(fin.annualInsurance, s.countryId)}).`,
              'warning'
            );
          } else {
            trustDisplayNet += fin.netRoyalty;
            trustDisplayedCount++;
          }
        }
        continue;
      }
      if (a.trustAssetType !== 'property') continue;
      const wear = a.rented ? Utils.randInt(6, 12) : Utils.randInt(4, 9);
      a.condition = Utils.clamp((typeof a.condition === 'number' ? a.condition : 80) - wear, 0, 100);
      if (a.rented && a.condition <= 50) {
        a.rented = false;
        GameState.addJournalEntry(`🏠⚠️ Penyewa di hartanah Yayasan (${a.name}) mengadu keadaan rumah terlalu uzur dan terus keluar berpindah!`, 'warning');
      }
      const tax = Math.round((a.value || 0) * 0.005);
      const upkeep = a.upkeep || 0;
      const rent = a.rented ? Math.round((a.value || 0) * ((a.yieldPct || 5.5) / 100)) : 0;
      trustRentNet += (rent - tax - upkeep);
    }

    for (const h of ft.investments) {
      if (!h || (h.units || 0) <= 0) continue;
      const inst = (window.AssetsData && AssetsData.INVESTMENTS) ? AssetsData.INVESTMENTS.find(x => x.id === h.instId) : null;
      if (inst && inst.divPct > 0) {
        const curVal = Math.round(h.units * this.getTrustInvestmentUnitPrice(s, h));
        trustDivIncome += Math.round(curVal * inst.divPct);
      }
    }

    const totalTrustYield = trustRentNet + trustDivIncome + trustDisplayNet;
    if (totalTrustYield !== 0) {
      ft.balance = Math.max(0, Math.round(ft.balance + totalTrustYield));
      if (trustRentNet + trustDivIncome > 0) {
        GameState.addJournalEntry(`🏛️ Pendapatan Pasif Yayasan: +${Utils.formatMoney(trustRentNet + trustDivIncome, s.countryId)} (Sewa Bersih & Dividen/Faedah) dikreditkan terus ke Tabung Yayasan Keluarga.`);
      }
    }
    if (trustDisplayNet > 0) {
      GameState.addJournalEntry(`🏛️ Pameran galeri pusaka Yayasan menjana royalti bersih sebanyak ${Utils.formatMoney(trustDisplayNet, s.countryId)} ke dalam akaun Yayasan.`);
    }
    if (trustDisplayedCount > 0 && window.KarmaEndings) {
      KarmaEndings.adjustAlignment({ fame: 1 });
    }

    // 2. Yuran pengurusan tahunan mengikut kategori ekonomi negara domisil Yayasan
    ft.yearsActive = (ft.yearsActive || 0) + 1;
    const domCountry = this.getTrustDomicileCountry(s);
    const rates = this.getTrustCountryRates(domCountry);
    ft.feeRate = Number((rates.annualFeeRate * 100).toFixed(2));

    if (rates.annualFeeRate > 0) {
      const fee = this.getTrustAnnualFee(s);
      if (fee > 0) {
        const paidFromTrust = Math.min(Math.max(0, Math.round(ft.balance || 0)), fee);
        ft.balance = Math.max(0, Math.round((ft.balance || 0) - paidFromTrust));
        const shortfall = Math.max(0, fee - paidFromTrust);
        if (shortfall === 0) {
          ft.lastPaidAge = s.age;
          if ((ft.unpaidFees || 0) <= 0) ft.lapsed = false;
          GameState.addJournalEntry(
            `🏛️ Yuran tahunan Tabung Yayasan Keluarga (${rates.categoryLabel} • ${ft.feeRate}%/thn) ditolak daripada dana Yayasan (-${Utils.formatMoney(fee, s.countryId)}).`
          );
        } else {
          ft.unpaidFees = Math.round((ft.unpaidFees || 0) + shortfall);
          ft.lapsed = true;
          GameState.addJournalEntry(
            `⚠️ Baki tunai Yayasan tidak mencukupi untuk yuran tahunan (${Utils.formatMoney(fee, s.countryId)}). Baki ${Utils.formatMoney(shortfall, s.countryId)} ditambah ke tunggakan yuran (Jumlah tunggakan: ${Utils.formatMoney(ft.unpaidFees, s.countryId)}).`,
            'warning'
          );
        }
      }
    }

    // Brek had hutang kumulatif: $100M USD (menghentikan pertambahan hutang tanpa bubar mengejut)
    const maxArrearsLocal = this.getTrustMaxArrearsLocal(s);
    if ((ft.unpaidFees || 0) > maxArrearsLocal) {
      ft.unpaidFees = maxArrearsLocal;
    }

    // Pencetus pembubaran paksa: tempoh bertenang 3 tahun berturut-turut (1 -> 2 -> 3 -> 4 Bubar)
    if ((ft.unpaidFees || 0) > 0) {
      ft.unpaidStreakYears = (ft.unpaidStreakYears || 0) + 1;
      const fmtM = (v) => Utils.formatMoney(v, s.countryId);
      const usdEq = (window.Utils && Utils.formatUsdEquivalent) ? Utils.formatUsdEquivalent(ft.unpaidFees, s.countryId) : null;
      const debtStr = `${fmtM(ft.unpaidFees)}${usdEq ? ` (${usdEq})` : ''}`;

      if (ft.unpaidStreakYears >= 4) {
        const diss = this.forceDissolveTrustForDebt(s);
        const summaryMsg = diss && diss.surplus > 0
          ? `Semua aset Yayasan dicairkan untuk melangsaikan hutang ${fmtM(diss.debtDue)}, dan baki lebihan ${fmtM(diss.surplus)} dipulangkan ke akaun tunai peribadi anda.`
          : `Semua aset Yayasan dicairkan dan baki kekurangan ${fmtM((diss && diss.shortfall) || 0)} direkodkan sebagai Hutang Generasi dalam menu Pinjaman & Hutang.`;
        return {
          id: 'trust_force_dissolve_' + s.year,
          icon: '🚨',
          title: 'Laporan Pembubaran Paksa Tabung Yayasan Keluarga',
          text: `Tabung Yayasan Keluarga telah dibubarkan secara paksa selepas gagal melangsaikan tunggakan yuran melebihi tempoh bertenang 3 tahun berturut-turut. ${summaryMsg}`,
          choices: [
            { label: 'Tutup', action: () => 'Tabung Yayasan Keluarga telah dibubarkan secara paksa.' }
          ]
        };
      }

      const remYears = Math.max(1, 4 - ft.unpaidStreakYears);
      const warnTitle = ft.unpaidStreakYears === 1
        ? '⚠️ Amaran Awal: Tunggakan Yuran Yayasan'
        : ft.unpaidStreakYears === 2
          ? '🟠 Amaran Keras: Tunggakan Tahun Kedua'
          : '🚨 NOTIS TERAKHIR: Pembubaran Paksa Yayasan';
      const warnText = ft.unpaidStreakYears === 1
        ? `Yuran tahunan Tabung Yayasan Keluarga anda tertunggak sebanyak ${debtStr}. Anda mempunyai baki ${remYears} tahun lagi sebelum pembubaran paksa dijalankan.`
        : ft.unpaidStreakYears === 2
          ? `Tunggakan yuran Yayasan (${debtStr}) kini memasuki tahun kedua! Sila langsaikan segera — baki ${remYears} tahun lagi sebelum pembubaran paksa.`
          : `AMARAN TERAKHIR! Tunggakan yuran Yayasan (${debtStr}) memasuki tahun ketiga. Baki ${remYears} tahun lagi sebelum semua aset Yayasan dicairkan secara paksa!`;
      return {
        id: `trust_arrears_warn_${ft.unpaidStreakYears}_${s.year}`,
        icon: ft.unpaidStreakYears === 3 ? '🚨' : '⚠️',
        title: warnTitle,
        text: warnText,
        choices: [
          {
            label: `💳 Langsaikan Tunggakan (${fmtM(ft.unpaidFees)})`,
            action: () => {
              const r = this.payTrustUnpaidFees(s);
              return r.msg;
            }
          },
          {
            label: '🏛️ Buka Tabung Yayasan',
            action: () => {
              setTimeout(() => { if (window.Modals && Modals.showWasiatModal) Modals.showWasiatModal(); }, 60);
              return 'Membuka papan pemuka Tabung Yayasan Keluarga untuk pengurusan tunggakan.';
            }
          },
          {
            label: 'Tutup',
            action: () => `Notis tunggakan yuran Yayasan (baki ${remYears} tahun lagi) direkodkan.`
          }
        ]
      };
    } else {
      ft.unpaidStreakYears = 0;
    }

    // 3. Kontrak Pengurus Dana
    if (ft.fundManager) {
      ft.fundManager.yearsLeft = (ft.fundManager.yearsLeft || 1) - 1;
      if (ft.fundManager.yearsLeft <= 0) {
        ft.fundManager = null;
        GameState.addJournalEntry(
          '⚠️ Kontrak Pengurus Dana Yayasan Keluarga telah tamat. Sila lantik pengurus baharu segera untuk mengelakkan risiko pecah amanah dan pemantauan kerajaan!',
          'warning'
        );
      }
    }

    // 4. Risiko Tadbir Urus (Pecah Amanah & Audit Lari Cukai — 2 pilihan sahaja)
    const trustNet = this.getTrustNetWorth(s);
    if ((s.prison && s.prison.inPrison) || trustNet <= 0 || s.age < 18) return null;

    const tier = ft.fundManager ? ft.fundManager.tier : 'none';
    const heat = (s.alignment && s.alignment.notoriety) || 0;
    const embezzleChance = tier === 'none' ? 0.20 : tier === 'junior' ? 0.13 : tier === 'profesional' ? 0.04 : 0.01;
    const auditChance = Math.min(0.38, (tier === 'none' ? 0.18 : tier === 'junior' ? 0.12 : tier === 'profesional' ? 0.05 : 0.015) + (heat * 0.002));

    // Peristiwa A: Skandal Pecah Amanah Yayasan
    if (ft.balance > 0 && Utils.chance(embezzleChance)) {
      const pct = 0.15 + Math.random() * 0.20;
      const stolen = Math.max(1, Math.round(ft.balance * pct));
      const legalFee = Utils.usdToLocal(3500, s.countryId);
      const culprit = ft.fundManager ? ft.fundManager.name : 'pemegang amanah luar';
      return {
        id: 'trust_embezzle_' + s.year,
        icon: '⚠️',
        title: 'Skandal Pecah Amanah Yayasan!',
        text: `Audit dalaman mendedahkan ${culprit} telah menyeleweng dana Tabung Yayasan Keluarga sebanyak ${Utils.formatMoney(stolen, s.countryId)}!`,
        choices: [
          {
            label: `⚖️ Bawa ke Mahkamah & Bekukan Akaun (${Utils.formatMoney(legalFee, s.countryId)})`,
            action: () => {
              if (ft.balance >= legalFee) ft.balance -= legalFee;
              else s.money -= legalFee;
              if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: 14 });
              if (Utils.chance(0.58)) {
                const recovered = Math.round(stolen * 0.65);
                const netLoss = stolen - recovered;
                ft.balance = Math.max(0, ft.balance - netLoss);
                return `Mahkamah berjaya membekukan sebahagian akaun suspek! Anda memulihkan ${Utils.formatMoney(recovered, s.countryId)}, namun kerugian bersih ialah ${Utils.formatMoney(netLoss, s.countryId)}.`;
              }
              ft.balance = Math.max(0, ft.balance - stolen);
              GameState.adjustStats({ happiness: -12 });
              return `Suspek melarikan wang ke akaun luar pesisir. Anda kehilangan ${Utils.formatMoney(stolen, s.countryId)} walaupun selepas prosiding mahkamah.`;
            }
          },
          {
            label: '🤐 Tutup Kes & Tanggung Kerugian',
            action: () => {
              ft.balance = Math.max(0, ft.balance - stolen);
              GameState.adjustStats({ happiness: -14 });
              if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: 18 });
              return `Anda memilih untuk menutup skandal ini bagi menjaga nama baik keluarga dan menanggung kerugian ${Utils.formatMoney(stolen, s.countryId)}.`;
            }
          }
        ]
      };
    }

    // Susutkan auditHeat secara perlahan setiap tahun (+Umur)
    ft.auditHeat = Math.max(0, Number(((ft.auditHeat || 0) - 0.25).toFixed(2)));

    // Peristiwa B: Pemantauan Kerajaan & Siasatan Lari Cukai (2 PILIHAN SAHAJA)
    const effectiveAuditChance = Math.min(0.92, auditChance + (ft.offshoreAuditRisk || 0));
    ft.offshoreAuditRisk = Math.max(0, Number(((ft.offshoreAuditRisk || 0) - 0.15).toFixed(2)));
    if (Utils.chance(effectiveAuditChance)) {
      ft.underAudit = true;
      ft.offshoreAuditRisk = 0;
      const penalty = Math.max(Utils.usdToLocal(4000, s.countryId), Math.round(trustNet * 0.18));
      const smartsBonus = ((s.stats && s.stats.smarts) || 0) >= 80 ? 0.05 : 0;
      const mgrBonus = tier === 'elit' ? 0.10 : tier === 'profesional' ? 0.06 : tier === 'junior' ? 0.03 : 0;
      const cappedBase = Math.min(0.58, 0.45 + Math.min(0.15, smartsBonus + mgrBonus));
      const heatPenalty = Math.floor(ft.auditHeat || 0) * 0.15;
      const hideSuccessChance = Math.max(0.10, Number((cappedBase - heatPenalty).toFixed(2)));
      const heatNarrative = (ft.auditHeat || 0) >= 2
        ? ' Pihak berkuasa kini memantau rapat rekod kewangan Yayasan anda.'
        : '';
      return {
        id: 'trust_tax_audit_' + s.year,
        icon: '🏛️',
        title: 'Pemantauan Kerajaan & Siasatan Lari Cukai!',
        text: `Pihak berkuasa hasil mengesyaki Tabung Yayasan Keluarga anda digunakan untuk mengelak cukai secara haram. Siasatan rasmi telah dibuka!${heatNarrative}`,
        choices: [
          {
            label: `💵 Bayar Denda (${Utils.formatMoney(penalty, s.countryId)})`,
            action: () => {
              ft.underAudit = false;
              ft.auditHeat = Math.max(0, Number(((ft.auditHeat || 0) - 2).toFixed(2)));
              if (ft.balance >= penalty) {
                ft.balance -= penalty;
              } else {
                const rem = penalty - ft.balance;
                ft.balance = 0;
                s.money -= rem;
              }
              if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: 10 });
              return `Anda melangsaikan denda cukai ${Utils.formatMoney(penalty, s.countryId)} dan siasatan kerajaan ditutup secara rasmi.`;
            }
          },
          {
            label: '🕶️ Sorokkan Dokumen',
            action: () => {
              ft.underAudit = false;
              if (Utils.chance(hideSuccessChance)) {
                ft.auditHeat = Math.min(5, Number(((ft.auditHeat || 0) + 1).toFixed(2)));
                if (window.KarmaEndings) KarmaEndings.adjustAlignment({ notoriety: 10, stress: 12 });
                return 'Anda berjaya menyembunyikan rekod kewangan dan melepasi audit tanpa dikenakan denda!';
              }
              const heavyFine = Math.round(penalty * 1.45);
              if (ft.balance >= heavyFine) {
                ft.balance -= heavyFine;
              } else {
                const rem = heavyFine - ft.balance;
                ft.balance = 0;
                s.money -= rem;
              }
              ft.lapsed = true;
              ft.auditHeat = 1;
              if (window.KarmaEndings) KarmaEndings.adjustAlignment({ notoriety: 35, stress: 28, karma: -18 });
              if (window.PrisonFugitive && PrisonFugitive.enterPrisonState) {
                PrisonFugitive.enterPrisonState(s, 'Pengelakan Cukai & Pemalsuan Dokumen Yayasan', 5, 'maximum');
              }
              return `KANTOI! Dokumen yang disorokkan terbongkar oleh juruaudit kerajaan. Penalti berat ${Utils.formatMoney(heavyFine, s.countryId)} dikenakan, yayasan digantung, dan anda dijatuhi hukuman PENJARA 5 TAHUN!`;
            }
          }
        ]
      };
    }

    return null;
  },

  getWasiatSummary(s) {
    this.ensureLegalFields(s);
    this.ensureFamilyTrust(s);
    const mode = (s.legal.wasiat && (s.legal.wasiat.willType || s.legal.wasiat.mode)) || 'equal';
    const labels = {
      equal: 'Pembahagian Sama Rata',
      spouse_all: '100% Kepada Pasangan',
      charity: '100% Yayasan Kebajikan'
    };
    const base = labels[mode] || labels.equal;
    if (s.familyTrust.active && !s.familyTrust.lapsed) {
      return `${base} + Tabung Yayasan Keluarga (Bebas Cukai Pusaka)`;
    }
    return base;
  },

  // --------------------------------------------------------------------------
  // 6. PENGURUSAN WASIAT SIVIL (CUSTOMIZABLE WILL)
  // --------------------------------------------------------------------------
  setCivilWasiat(s, mode) {
    this.ensureLegalFields(s);
    this.ensureFamilyTrust(s);
    const validModes = ['equal', 'spouse_all', 'charity'];
    if (!validModes.includes(mode)) {
      return { ok: false, msg: 'Mod wasiat tidak sah.' };
    }

    s.legal.wasiat.mode = mode;
    s.legal.wasiat.willType = mode;
    s.legal.wasiat.soleBeneficiaryId = null;
    s.legal.wasiat.soleHeirId = null;
    s.legal.wasiat.charityPct = mode === 'charity' ? 100 : 0;

    const labels = {
      equal: 'Pembahagian Sama Rata (Pasangan & Semua Anak)',
      spouse_all: '100% Kepada Pasangan',
      charity: '100% Didermakan Kepada Yayasan Kebajikan'
    };
    GameState.addJournalEntry(`📜 Wasiat sivil dikemas kini: ${labels[mode]}.`, 'milestone');
    GameState.save();
    return { ok: true, msg: `Wasiat sivil ditetapkan: ${labels[mode]}.` };
  },

  _isChildRel(r) {
    return Boolean(r && (r.type === 'child' || r.isAdopted === true || ['Anak', 'Anak Lelaki', 'Anak Perempuan', 'Anak Angkat', 'Son', 'Daughter', 'Adopted Son', 'Adopted Daughter'].includes(r.role)));
  },

  _isParentRel(r) {
    return Boolean(r && (r.type === 'parent' || ['Ibu', 'Ayah', 'Bapa', 'Ibu Angkat', 'Ayah Angkat', 'Mother', 'Father'].includes(r.role)));
  },

  // --------------------------------------------------------------------------
  // 7. PENYATA & PEMBAHAGIAN HARTA PUSAKA (UNDANG-UNDANG SIVIL & WASIAT)
  // --------------------------------------------------------------------------
  calculateEstateStatement(s) {
    this.ensureLegalFields(s);
    this.ensureFamilyTrust(s);
    const countryId = s.countryId || 'MY';
    const c = (window.Utils && Utils.getCountry) ? Utils.getCountry(countryId) : { name: countryId };
    const trustBalance = Math.max(0, Math.round((s.familyTrust && s.familyTrust.balance) || 0));
    const trustNetWorth = this.getTrustNetWorth(s);
    const trustActive = Boolean(s.familyTrust && s.familyTrust.active);
    const trustProtected = Boolean(trustActive && !s.familyTrust.lapsed && (s.familyTrust.unpaidFees || 0) <= 0);

    // PRINSIP WAJIB: Harta Peribadi dan Tabung Yayasan Keluarga ialah DUA ENTITI BERBEZA.
    // Cukai Pusaka & Wasiat HANYA dikenakan ke atas Harta Peribadi (getPersonalNetWorth) — TIDAK PERNAH termasuk familyTrust.
    const personalNet = (window.GameState && GameState.getPersonalNetWorth)
      ? GameState.getPersonalNetWorth(s)
      : Math.round(s.money || 0);
    const assetSum = window.AssetsEngine ? AssetsEngine.getAssetCashflowSummary(s) : { totalAssetValue: 0, totalDebt: 0 };
    const personalLoans = (window.LoansEngine && LoansEngine.getTotalDebt) ? LoansEngine.getTotalDebt(s) : 0;
    const totalDebt = Math.round(assetSum.totalDebt || 0) + personalLoans + (s.money < 0 ? Math.abs(Math.round(s.money)) : 0);
    const grossEstate = Math.max(0, personalNet + totalDebt);
    const netBeforeTax = Math.max(0, personalNet);

    const netUsd = Utils.localToUsd ? Utils.localToUsd(netBeforeTax, countryId) : netBeforeTax;
    const taxRate = this.getCountryEstateTaxRate(countryId, netUsd);
    const estateTax = Math.round(netBeforeTax * taxRate);
    const distributable = Math.max(0, netBeforeTax - estateTax);

    const spouse = s.married && s.partnerId
      ? (s.relationships || []).find(r => r.id === s.partnerId && r.alive)
      : null;
    const children = (s.relationships || []).filter(r => this._isChildRel(r) && r.alive);
    const parents = (s.relationships || []).filter(r => this._isParentRel(r) && r.alive);

    const mode = (s.legal.wasiat && (s.legal.wasiat.willType || s.legal.wasiat.mode)) || 'equal';
    const shares = [];

    if (distributable > 0) {
      if (mode === 'charity') {
        shares.push({ id: 'charity', isEntity: true, name: 'Yayasan Kebajikan Awam', role: 'Derma Wasiat', fractionLabel: 'Wasiat Kebajikan', pct: 100, amount: distributable });
      } else if (mode === 'spouse_all' && spouse) {
        shares.push({ id: spouse.id, isEntity: false, name: spouse.name, role: spouse.role || 'Pasangan', fractionLabel: 'Wasiat Penuh Pasangan', pct: 100, amount: distributable });
      }

      if (shares.length === 0) {
        if (spouse && children.length > 0) {
          const spouseAmt = Math.round(distributable * 0.5);
          const childPool = distributable - spouseAmt;
          const perChild = Math.round(childPool / children.length);
          shares.push({ id: spouse.id, isEntity: false, name: spouse.name, role: spouse.role || 'Pasangan', fractionLabel: 'Bahagian Pasangan (1/2)', pct: 50, amount: spouseAmt });
          children.forEach(ch => {
            shares.push({
              id: ch.id,
              isEntity: false,
              name: ch.name,
              role: ch.isAdopted ? 'Anak Angkat' : (ch.role || 'Anak'),
              fractionLabel: `Bahagian Anak (1/${children.length * 2})`,
              pct: Math.round((50 / children.length) * 10) / 10,
              amount: perChild
            });
          });
        } else if (children.length > 0) {
          const perChild = Math.round(distributable / children.length);
          children.forEach(ch => {
            shares.push({
              id: ch.id,
              isEntity: false,
              name: ch.name,
              role: ch.isAdopted ? 'Anak Angkat' : (ch.role || 'Anak'),
              fractionLabel: `Bahagian Sama Rata (1/${children.length})`,
              pct: Math.round((100 / children.length) * 10) / 10,
              amount: perChild
            });
          });
        } else if (spouse) {
          shares.push({ id: spouse.id, isEntity: false, name: spouse.name, role: spouse.role || 'Pasangan', fractionLabel: 'Waris Tunggal Pasangan', pct: 100, amount: distributable });
        } else if (parents.length > 0) {
          const perParent = Math.round(distributable / parents.length);
          parents.forEach(par => {
            shares.push({
              id: par.id,
              isEntity: false,
              name: par.name,
              role: par.role || 'Ibu Bapa',
              fractionLabel: `Bahagian Ibu Bapa (1/${parents.length})`,
              pct: Math.round((100 / parents.length) * 10) / 10,
              amount: perParent
            });
          });
        } else {
          shares.push({ id: 'state', isEntity: true, name: 'Tabung Amanah Awam', role: 'Tiada Waris Kandung', fractionLabel: 'Pewaris Waris Jauh / Amanah', pct: 100, amount: distributable });
        }
      }
    }

    const heirlooms = ((s.assets && s.assets.collectibles) || []).filter(col => col && col.isHeirloom);
    const taxRatePct = Math.round(taxRate * 100);
    const systemName = 'Undang-Undang Sivil & Wasiat';

    return {
      countryId,
      countryName: c.name || countryId,
      systemName,
      systemLabel: systemName,
      trustActive,
      trustProtected,
      trustBalance,
      trustNetWorth,
      personalNetWorth: personalNet,
      grossEstate,
      totalDebt,
      totalDebts: totalDebt,
      netBeforeTax,
      netEstate: netBeforeTax,
      taxRatePct,
      estateTaxRate: taxRatePct,
      estateTax,
      estateTaxAmount: estateTax,
      distributable,
      distributableEstate: distributable,
      wasiatMode: mode,
      wasiatLabel: this.getWasiatSummary(s),
      heirlooms,
      shares,
      getHeirAmount(heirId) {
        const found = shares.find(sh => sh.id === heirId);
        return found ? found.amount : 0;
      }
    };
  }
};
