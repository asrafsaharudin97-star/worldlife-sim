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

    // Migrasi selamat untuk simpanan lama yang pernah memilih pewaris tunggal 100%
    if (s.legal && s.legal.wasiat && (s.legal.wasiat.mode === 'sole_heir' || s.legal.wasiat.mode === 'single_child' || s.legal.wasiat.willType === 'sole_heir' || s.legal.wasiat.willType === 'single_child')) {
      s.legal.wasiat.mode = 'equal';
      s.legal.wasiat.willType = 'equal';
      s.legal.wasiat.soleHeirId = null;
      s.legal.wasiat.soleBeneficiaryId = null;
    }
    return ft;
  },

  getCorporateTaxRate(s) {
    const c = (s && window.Utils && Utils.getCountry) ? Utils.getCountry(s.countryId) : null;
    const raw = (c && typeof c.corporateTaxRate === 'number')
      ? c.corporateTaxRate
      : (c && typeof c.taxRate === 'number' ? c.taxRate : 0.20);
    return Math.min(0.25, Math.max(0.15, Number(raw) || 0.20));
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
    const cid = s.countryId || 'MY';
    const baseFee = Utils.usdToLocal(450, cid);
    const trustWealth = this.getTrustNetWorth(s);
    return Math.max(baseFee, Math.round(trustWealth * 0.015));
  },

  getFundManagerOffers(s, selectedYears = 1) {
    this.ensureFamilyTrust(s);
    const yrs = [1, 2, 3, 5].includes(Number(selectedYears)) ? Number(selectedYears) : 1;
    const disc = yrs === 5 ? 0.90 : yrs === 3 ? 0.94 : 1.0;
    const cid = (s && s.countryId) || 'MY';
    const trustWealth = this.getTrustNetWorth(s);
    const tiers = [
      {
        tier: 'junior',
        icon: '📋',
        title: 'Pengurus Dana Junior',
        desc: 'Yuran lantikan mampu milik; pengurusan asas tetapi terdedah kepada kesilapan audit dan risiko pecah amanah.',
        annualCost: Utils.usdToLocal(600, cid) + Math.round(trustWealth * 0.003)
      },
      {
        tier: 'profesional',
        icon: '💼',
        title: 'Pengurus Korporat Profesional',
        desc: 'Yuran sederhana; pematuhan cukai lebih teratur dan risiko terkawal.',
        annualCost: Utils.usdToLocal(2200, cid) + Math.round(trustWealth * 0.008)
      },
      {
        tier: 'elit',
        icon: '🏆',
        title: 'Pengurus Dana Elit (Padu)',
        desc: 'Yuran lantikan premium; pengurusan aset mantap serta perlindungan kukuh terhadap audit cukai dan pecah amanah.',
        annualCost: Utils.usdToLocal(5500, cid) + Math.round(trustWealth * 0.015)
      }
    ];
    return tiers.map(t => ({
      ...t,
      years: yrs,
      cost: Math.max(1, Math.round(t.annualCost * yrs * disc))
    }));
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

  transferAssetToTrust(s, assetType, uid) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureFamilyTrust(s);
    if (s.age < 18) return { ok: false, msg: 'Hanya dibuka untuk umur 18 tahun ke atas.' };
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Pemindahan aset disekat semasa dalam tahanan.' };
    if (!s.familyTrust.active) return { ok: false, msg: 'Sila tubuhkan Tabung Yayasan Keluarga dahulu.' };

    const listKey = assetType === 'property' ? 'properties' : 'vehicles';
    if (!s.assets || !Array.isArray(s.assets[listKey])) return { ok: false, msg: 'Aset tidak ditemui.' };
    const idx = s.assets[listKey].findIndex(x => x && x.uid === uid);
    if (idx === -1) return { ok: false, msg: 'Aset tidak ditemui.' };

    const [asset] = s.assets[listKey].splice(idx, 1);
    s.familyTrust.assets.push({
      ...asset,
      trustAssetType: assetType
    });
    this._adjustTrustBasis(s, Math.max(0, Math.round(asset.value || 0)));
    GameState.addJournalEntry(`🏛️ Aset ${asset.name} (${Utils.formatMoney(asset.value || 0, s.countryId)}) dipindahkan ke dalam Tabung Yayasan Keluarga.`);
    GameState.save();
    return { ok: true, msg: `${asset.name} berjaya dipindahkan ke Yayasan Keluarga!` };
  },

  withdrawAssetFromTrust(s, uid) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureFamilyTrust(s);
    if (s.age < 18) return { ok: false, msg: 'Hanya dibuka untuk umur 18 tahun ke atas.' };
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Pengeluaran aset disekat semasa dalam tahanan.' };
    if (!s.familyTrust.active) return { ok: false, msg: 'Tabung Yayasan Keluarga tidak aktif.' };

    const idx = s.familyTrust.assets.findIndex(x => x && x.uid === uid);
    if (idx === -1) return { ok: false, msg: 'Aset yayasan tidak ditemui.' };

    const [asset] = s.familyTrust.assets.splice(idx, 1);
    const listKey = asset.trustAssetType === 'property' ? 'properties' : 'vehicles';
    delete asset.trustAssetType;
    if (!s.assets) s.assets = { properties: [], vehicles: [] };
    if (!Array.isArray(s.assets[listKey])) s.assets[listKey] = [];
    s.assets[listKey].push(asset);
    this._adjustTrustBasis(s, -Math.max(0, Math.round(asset.value || 0)));

    GameState.addJournalEntry(`📤 Aset ${asset.name} dikeluarkan daripada Tabung Yayasan Keluarga ke pemilikan peribadi.`);
    GameState.save();
    return { ok: true, msg: `${asset.name} dikeluarkan ke aset peribadi.` };
  },

  transferInvestmentToTrust(s, instId) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureFamilyTrust(s);
    if (s.age < 18) return { ok: false, msg: 'Hanya dibuka untuk umur 18 tahun ke atas.' };
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Pemindahan pelaburan disekat semasa dalam tahanan.' };
    if (!s.familyTrust.active) return { ok: false, msg: 'Sila tubuhkan Tabung Yayasan Keluarga dahulu.' };

    const portfolio = s.assets && s.assets.portfolio;
    if (!portfolio || !portfolio[instId] || portfolio[instId].units <= 0) {
      return { ok: false, msg: 'Pegangan pelaburan tidak ditemui.' };
    }
    const pos = portfolio[instId];
    const existing = s.familyTrust.investments.find(x => x && x.instId === instId);
    const unitPrice = this.getTrustInvestmentUnitPrice(s, { instId, units: pos.units, totalCost: pos.totalCost });
    const moveVal = Math.round(pos.units * unitPrice);

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

  withdrawInvestmentFromTrust(s, instId) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureFamilyTrust(s);
    if (s.age < 18) return { ok: false, msg: 'Hanya dibuka untuk umur 18 tahun ke atas.' };
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Pengeluaran pelaburan disekat semasa dalam tahanan.' };
    if (!s.familyTrust.active) return { ok: false, msg: 'Tabung Yayasan Keluarga tidak aktif.' };

    const idx = s.familyTrust.investments.findIndex(x => x && x.instId === instId);
    if (idx === -1) return { ok: false, msg: 'Pelaburan yayasan tidak ditemui.' };
    const [holding] = s.familyTrust.investments.splice(idx, 1);
    const unitPrice = this.getTrustInvestmentUnitPrice(s, holding);
    const moveVal = Math.round(holding.units * unitPrice);

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

  setupFamilyTrust(s) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureLegalFields(s);
    this.ensureFamilyTrust(s);
    if (s.age < 18) return { ok: false, msg: 'Anda mesti berumur 18 tahun ke atas untuk menubuhkan Yayasan Keluarga.' };
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Tidak boleh menubuhkan Yayasan Keluarga semasa dalam tahanan.' };
    if (s.familyTrust.active) return { ok: false, msg: 'Tabung Yayasan Keluarga sudah pun aktif.' };
    const fee = this.getTrustSetupFee(s);
    if (s.money < fee) {
      return { ok: false, msg: `Baki tidak mencukupi — kos penubuhan ialah ${Utils.formatMoney(fee, s.countryId)}.` };
    }
    s.money -= fee;
    s.familyTrust.active = true;
    s.familyTrust.lapsed = false;
    s.familyTrust.lastPaidAge = s.age;
    s.familyTrust.feeRate = 1.5;
    s.familyTrust.yearsActive = 0;
    s.familyTrust.founderName = s.name || 'Pengasas';
    s.familyTrust.founderGen = s.generation || 1;
    s.familyTrust.foundedYear = s.year || 2026;
    s.familyTrust.prevTotalValue = 0;
    s.familyTrust.baselineValue = 0;
    GameState.addJournalEntry(
      `🏛️ Anda menubuhkan Tabung Yayasan Keluarga dengan yuran pendaftaran ${Utils.formatMoney(fee, s.countryId)}. Harta dalam yayasan kini dilindungi bebas cukai pusaka untuk pewaris pemain!`,
      'milestone'
    );
    GameState.save();
    return { ok: true, msg: 'Tabung Yayasan Keluarga berjaya ditubuhkan!' };
  },

  depositFamilyTrust(s, amount) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureFamilyTrust(s);
    if (s.age < 18) return { ok: false, msg: 'Hanya dibuka untuk umur 18 tahun ke atas.' };
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Transaksi yayasan disekat semasa dalam tahanan.' };
    if (!s.familyTrust.active) return { ok: false, msg: 'Sila tubuhkan Tabung Yayasan Keluarga dahulu.' };
    const amt = Math.round(Number(amount) || 0);
    if (amt <= 0) return { ok: false, msg: 'Masukkan jumlah dana yang sah.' };
    if (s.money < amt) return { ok: false, msg: 'Baki bank tidak mencukupi.' };
    s.money -= amt;
    s.familyTrust.balance += amt;
    this._adjustTrustBasis(s, amt);
    GameState.addJournalEntry(`🏛️ Memasukkan ${Utils.formatMoney(amt, s.countryId)} ke dalam Tabung Yayasan Keluarga (Dana Yayasan: ${Utils.formatMoney(s.familyTrust.balance, s.countryId)}).`);
    GameState.save();
    return { ok: true, msg: `Dana ${Utils.formatMoney(amt, s.countryId)} dimasukkan ke Yayasan Keluarga.` };
  },

  withdrawFamilyTrust(s, amount) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureFamilyTrust(s);
    if (s.age < 18) return { ok: false, msg: 'Hanya dibuka untuk umur 18 tahun ke atas.' };
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Transaksi yayasan disekat semasa dalam tahanan.' };
    if (!s.familyTrust.active) return { ok: false, msg: 'Tabung Yayasan Keluarga tidak aktif.' };
    const amt = Math.round(Number(amount) || 0);
    if (amt <= 0) return { ok: false, msg: 'Masukkan jumlah pengeluaran yang sah.' };
    if (s.familyTrust.balance < amt) return { ok: false, msg: 'Dana dalam Yayasan Keluarga tidak mencukupi.' };
    s.familyTrust.balance -= amt;
    s.money += amt;
    this._adjustTrustBasis(s, -amt);
    GameState.addJournalEntry(`💵 Mengeluarkan ${Utils.formatMoney(amt, s.countryId)} daripada Tabung Yayasan Keluarga ke akaun bank.`);
    GameState.save();
    return { ok: true, msg: `Dana ${Utils.formatMoney(amt, s.countryId)} dikeluarkan ke akaun bank.` };
  },

  payTrustArrearsAndReactivate(s) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureFamilyTrust(s);
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Tidak boleh mengaktifkan semula yayasan semasa dalam tahanan.' };
    if (!s.familyTrust.active || !s.familyTrust.lapsed) return { ok: false, msg: 'Yayasan tidak mempunyai tunggakan yuran.' };
    const fee = this.getTrustAnnualFee(s);
    if (s.money >= fee) {
      s.money -= fee;
    } else if (s.familyTrust.balance >= fee) {
      s.familyTrust.balance -= fee;
    } else {
      return { ok: false, msg: `Baki tidak mencukupi — perlukan ${Utils.formatMoney(fee, s.countryId)} untuk melangsaikan yuran.` };
    }
    s.familyTrust.lapsed = false;
    s.familyTrust.lastPaidAge = s.age;
    GameState.addJournalEntry(`🔄 Tunggakan yuran Tabung Yayasan Keluarga (${Utils.formatMoney(fee, s.countryId)}) dilangsaikan. Perlindungan bebas cukai pusaka kini aktif semula!`, 'milestone');
    GameState.save();
    return { ok: true, msg: 'Tabung Yayasan Keluarga berjaya diaktifkan semula!' };
  },

  dissolveFamilyTrust(s) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureFamilyTrust(s);
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Tidak boleh membubarkan yayasan semasa dalam tahanan.' };
    if (!s.familyTrust.active) return { ok: false, msg: 'Tabung Yayasan Keluarga tidak aktif.' };
    const returned = Math.max(0, Math.round(s.familyTrust.balance || 0));
    s.money += returned;
    if (!s.assets) s.assets = { properties: [], vehicles: [], portfolio: {} };
    if (!Array.isArray(s.assets.properties)) s.assets.properties = [];
    if (!Array.isArray(s.assets.vehicles)) s.assets.vehicles = [];
    if (!s.assets.portfolio) s.assets.portfolio = {};
    (s.familyTrust.assets || []).forEach(a => {
      const listKey = a.trustAssetType === 'property' ? 'properties' : 'vehicles';
      const copy = { ...a };
      delete copy.trustAssetType;
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
    if (!ft.active) return null;

    // 0. Simpan nilai tahun sebelumnya untuk kiraan prestasi
    const valueBeforeYear = this.getTrustNetWorth(s);
    if (valueBeforeYear > 0) ft.prevTotalValue = valueBeforeYear;

    // 1. Pengasingan Aliran Tunai Ketat: semua sewa hartanah yayasan & dividen/faedah pelaburan masuk ke ft.balance
    let trustRentNet = 0;
    let trustDivIncome = 0;
    for (const a of ft.assets) {
      if (!a || a.trustAssetType !== 'property') continue;
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

    const totalTrustYield = trustRentNet + trustDivIncome;
    if (totalTrustYield !== 0) {
      ft.balance = Math.max(0, Math.round(ft.balance + totalTrustYield));
      if (totalTrustYield > 0) {
        GameState.addJournalEntry(`🏛️ Pendapatan Pasif Yayasan: +${Utils.formatMoney(totalTrustYield, s.countryId)} (Sewa Bersih & Dividen/Faedah) dikreditkan terus ke Tabung Yayasan Keluarga.`);
      }
    }

    // 2. Yuran pengurusan tahunan tetap 1.5% setahun
    ft.yearsActive = (ft.yearsActive || 0) + 1;
    ft.feeRate = 1.5;

    const fee = this.getTrustAnnualFee(s);
    if (s.money >= fee) {
      s.money -= fee;
      ft.lapsed = false;
      ft.lastPaidAge = s.age;
      GameState.addJournalEntry(`🏛️ Yuran pengurusan tahunan Tabung Yayasan Keluarga (1.5% setahun) telah ditolak (-${Utils.formatMoney(fee, s.countryId)}).`);
    } else if (ft.balance >= fee) {
      ft.balance -= fee;
      ft.lapsed = false;
      ft.lastPaidAge = s.age;
      GameState.addJournalEntry(`🏛️ Yuran pengurusan tahunan Tabung Yayasan Keluarga (1.5% setahun) telah ditolak daripada dana yayasan (-${Utils.formatMoney(fee, s.countryId)}).`);
    } else {
      ft.lapsed = true;
      GameState.addJournalEntry(
        `⚠️ Gagal membayar yuran tahunan Tabung Yayasan Keluarga (${Utils.formatMoney(fee, s.countryId)}). Perlindungan bebas cukai kini digantung sehingga tunggakan dilangsaikan.`,
        'warning'
      );
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

    // Peristiwa B: Pemantauan Kerajaan & Siasatan Lari Cukai (2 PILIHAN SAHAJA)
    if (Utils.chance(auditChance)) {
      ft.underAudit = true;
      const penalty = Math.max(Utils.usdToLocal(4000, s.countryId), Math.round(trustNet * 0.18));
      const hideSuccessChance = tier === 'elit' ? 0.55 : tier === 'profesional' ? 0.40 : tier === 'junior' ? 0.25 : 0.15;
      return {
        id: 'trust_tax_audit_' + s.year,
        icon: '🏛️',
        title: 'Pemantauan Kerajaan & Siasatan Lari Cukai!',
        text: `Pihak berkuasa hasil mengesyaki Tabung Yayasan Keluarga anda digunakan untuk mengelak cukai secara haram. Siasatan rasmi telah dibuka!`,
        choices: [
          {
            label: `💵 Bayar Denda (${Utils.formatMoney(penalty, s.countryId)})`,
            action: () => {
              ft.underAudit = false;
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
    return Boolean(r && (r.type === 'child' || ['Anak Lelaki', 'Anak Perempuan', 'Son', 'Daughter'].includes(r.role)));
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
    const cash = Math.max(0, Math.round(s.money || 0));
    const trustBalance = Math.max(0, Math.round((s.familyTrust && s.familyTrust.balance) || 0));
    const trustAssetsVal = this.getTrustAssetsValue(s);
    const trustNetWorth = trustBalance + trustAssetsVal;
    const trustProtected = Boolean(s.familyTrust && s.familyTrust.active && !s.familyTrust.lapsed);
    const assetSum = window.AssetsEngine ? AssetsEngine.getAssetCashflowSummary(s) : { totalAssetValue: 0, totalDebt: 0 };
    const personalGross = cash + Math.round(assetSum.totalAssetValue || 0);
    // Harta dalam Tabung Yayasan Keluarga (aktif & tiada tunggakan) dikecualikan sepenuhnya daripada pembahagian NPC & cukai pusaka
    const grossEstate = trustProtected ? personalGross : (personalGross + trustNetWorth);
    const personalLoans = (window.LoansEngine && LoansEngine.getTotalDebt) ? LoansEngine.getTotalDebt(s) : 0;
    const totalDebt = Math.round(assetSum.totalDebt || 0) + personalLoans + (s.money < 0 ? Math.abs(Math.round(s.money)) : 0);
    const netBeforeTax = Math.max(0, grossEstate - totalDebt);

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
      if (mode === 'charity' && !trustProtected) {
        shares.push({ id: 'charity', isEntity: true, name: 'Yayasan Kebajikan Awam', role: 'Derma Wasiat', fractionLabel: 'Wasiat Kebajikan', pct: 100, amount: distributable });
      } else if (mode === 'spouse_all' && spouse && !trustProtected) {
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
    const systemName = trustProtected ? 'Tabung Yayasan Keluarga (Bebas Cukai Pusaka)' : 'Undang-Undang Sivil & Wasiat';

    return {
      countryId,
      countryName: c.name || countryId,
      systemName,
      systemLabel: systemName,
      trustProtected,
      trustBalance,
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
        if (trustProtected) return distributable;
        const found = shares.find(sh => sh.id === heirId);
        return found ? found.amount : 0;
      }
    };
  }
};
