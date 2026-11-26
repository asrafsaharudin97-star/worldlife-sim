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
        feeRate: 1.5,
        yearsActive: 0,
        fundManager: null,
        underAudit: false,
        lapsed: false,
        lastPaidAge: null
      };
    }
    const ft = s.familyTrust;
    ft.active = Boolean(ft.active);
    ft.balance = Math.max(0, Math.round(Number(ft.balance) || 0));
    if (!Array.isArray(ft.assets)) ft.assets = [];
    ft.feeRate = 1.5;
    if (typeof ft.yearsActive !== 'number' || Number.isNaN(ft.yearsActive)) ft.yearsActive = 0;
    if (ft.fundManager && typeof ft.fundManager === 'object') {
      if (typeof ft.fundManager.yearsLeft !== 'number') ft.fundManager.yearsLeft = 5;
    } else {
      ft.fundManager = null;
    }
    ft.underAudit = Boolean(ft.underAudit);
    ft.lapsed = Boolean(ft.lapsed);
    if (ft.lastPaidAge === undefined) ft.lastPaidAge = null;

    // Migrasi selamat untuk simpanan lama yang pernah memilih pewaris tunggal 100%
    if (s.legal && s.legal.wasiat && (s.legal.wasiat.mode === 'sole_heir' || s.legal.wasiat.mode === 'single_child' || s.legal.wasiat.willType === 'sole_heir' || s.legal.wasiat.willType === 'single_child')) {
      s.legal.wasiat.mode = 'equal';
      s.legal.wasiat.willType = 'equal';
      s.legal.wasiat.soleHeirId = null;
      s.legal.wasiat.soleBeneficiaryId = null;
    }
    return ft;
  },

  getTrustAssetsValue(s) {
    if (!s || !s.familyTrust || !Array.isArray(s.familyTrust.assets)) return 0;
    return Math.round(s.familyTrust.assets.reduce((acc, a) => acc + Math.max(0, Number(a && a.value) || 0), 0));
  },

  getTrustNetWorth(s) {
    if (!s) return 0;
    this.ensureFamilyTrust(s);
    return Math.max(0, Math.round((s.familyTrust.balance || 0) + this.getTrustAssetsValue(s)));
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

  getFundManagerOffers(s) {
    this.ensureFamilyTrust(s);
    const cid = (s && s.countryId) || 'MY';
    const trustWealth = this.getTrustNetWorth(s);
    return [
      {
        tier: 'junior',
        icon: '📋',
        title: 'Pengurus Dana Junior',
        desc: 'Yuran lantikan murah; pengurusan asas tetapi terdedah kepada kesilapan audit dan risiko pecah amanah.',
        cost: Utils.usdToLocal(1800, cid) + Math.round(trustWealth * 0.008)
      },
      {
        tier: 'profesional',
        icon: '💼',
        title: 'Pengurus Korporat Profesional',
        desc: 'Yuran sederhana; pematuhan cukai lebih teratur dan risiko terkawal.',
        cost: Utils.usdToLocal(6500, cid) + Math.round(trustWealth * 0.022)
      },
      {
        tier: 'elit',
        icon: '🏆',
        title: 'Pengurus Dana Elit (Padu)',
        desc: 'Yuran lantikan sangat mahal; pengurusan aset mantap serta perlindungan kukuh terhadap audit cukai dan pecah amanah.',
        cost: Utils.usdToLocal(18000, cid) + Math.round(trustWealth * 0.045)
      }
    ];
  },

  hireFundManager(s, tier) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureFamilyTrust(s);
    if (s.age < 18) return { ok: false, msg: 'Hanya dibuka untuk umur 18 tahun ke atas.' };
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Tidak boleh melantik pengurus dana semasa dalam tahanan.' };
    if (!s.familyTrust.active) return { ok: false, msg: 'Sila tubuhkan Tabung Yayasan Keluarga dahulu.' };

    const offer = this.getFundManagerOffers(s).find(o => o.tier === tier);
    if (!offer) return { ok: false, msg: 'Pilihan pengurus dana tidak sah.' };
    if (s.money < offer.cost) {
      return { ok: false, msg: `Baki tidak mencukupi — yuran lantikan ialah ${Utils.formatMoney(offer.cost, s.countryId)}.` };
    }

    const names = {
      junior: ['Encik Hakim', 'Cik Nadia', 'Encik Faizal', 'Cik Aina'],
      profesional: ['Dato\' Farid', 'Puan Marisa', 'Encik Kenneth Tan', 'Puan Syafiqah'],
      elit: ['Tan Sri Dr. Iskandar', 'Puan Sri Evelyn Wong', 'Dato\' Seri Azlan', 'Dr. Marcus Vance']
    };
    s.money -= offer.cost;
    const mgrName = Utils.pick(names[tier] || names.junior);
    s.familyTrust.fundManager = {
      tier,
      name: mgrName,
      yearsLeft: 5
    };
    GameState.addJournalEntry(
      `👔 Anda melantik ${mgrName} (${offer.title}) sebagai Pengurus Dana Yayasan Keluarga untuk kontrak 5 tahun (${Utils.formatMoney(offer.cost, s.countryId)}).`,
      'milestone'
    );
    GameState.save();
    return { ok: true, msg: `${mgrName} (${offer.title}) dilantik untuk kontrak 5 tahun!` };
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

    GameState.addJournalEntry(`📤 Aset ${asset.name} dikeluarkan daripada Tabung Yayasan Keluarga ke pemilikan peribadi.`);
    GameState.save();
    return { ok: true, msg: `${asset.name} dikeluarkan ke aset peribadi.` };
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
    if (!s.familyTrust.feeRate || s.familyTrust.feeRate < 2.0) s.familyTrust.feeRate = 2.0;
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
    // Pulangkan semua aset yayasan ke aset peribadi
    if (!s.assets) s.assets = { properties: [], vehicles: [] };
    if (!Array.isArray(s.assets.properties)) s.assets.properties = [];
    if (!Array.isArray(s.assets.vehicles)) s.assets.vehicles = [];
    (s.familyTrust.assets || []).forEach(a => {
      const listKey = a.trustAssetType === 'property' ? 'properties' : 'vehicles';
      const copy = { ...a };
      delete copy.trustAssetType;
      s.assets[listKey].push(copy);
    });
    s.familyTrust.assets = [];
    s.familyTrust.balance = 0;
    s.familyTrust.active = false;
    s.familyTrust.lapsed = false;
    s.familyTrust.underAudit = false;
    s.familyTrust.fundManager = null;
    s.familyTrust.lastPaidAge = null;
    GameState.addJournalEntry(`❌ Tabung Yayasan Keluarga dibubarkan. Dana ${Utils.formatMoney(returned, s.countryId)} serta semua aset dikembalikan ke pemilikan peribadi.`, 'warning');
    GameState.save();
    return { ok: true, msg: `Yayasan Keluarga dibubarkan. ${Utils.formatMoney(returned, s.countryId)} dan semua aset dikembalikan.` };
  },

  tickYearlyFamilyTrust(s) {
    if (!s || !s.alive) return null;
    this.ensureFamilyTrust(s);
    const ft = s.familyTrust;
    if (!ft.active) return null;

    // 1. Yuran pengurusan tahunan tetap 1.5% setahun
    ft.yearsActive = (ft.yearsActive || 0) + 1;
    ft.feeRate = 1.5;

    const fee = this.getTrustAnnualFee(s);
    if (s.money >= fee) {
      s.money -= fee;
      ft.lapsed = false;
      ft.lastPaidAge = s.age;
      GameState.addJournalEntry(`🏛️ Yuran pengurusan tahunan Tabung Yayasan Keluarga (${ft.feeRate}% setahun) telah ditolak (-${Utils.formatMoney(fee, s.countryId)}).`);
    } else if (ft.balance >= fee) {
      ft.balance -= fee;
      ft.lapsed = false;
      ft.lastPaidAge = s.age;
      GameState.addJournalEntry(`🏛️ Yuran pengurusan tahunan Tabung Yayasan Keluarga (${ft.feeRate}% setahun) telah ditolak daripada dana yayasan (-${Utils.formatMoney(fee, s.countryId)}).`);
    } else {
      ft.lapsed = true;
      GameState.addJournalEntry(
        `⚠️ Gagal membayar yuran tahunan Tabung Yayasan Keluarga (${Utils.formatMoney(fee, s.countryId)}). Perlindungan bebas cukai kini digantung sehingga tunggakan dilangsaikan.`,
        'warning'
      );
    }

    // 2. Kontrak 5 tahun Pengurus Dana
    if (ft.fundManager) {
      ft.fundManager.yearsLeft = (ft.fundManager.yearsLeft || 1) - 1;
      if (ft.fundManager.yearsLeft <= 0) {
        ft.fundManager = null;
        GameState.addJournalEntry(
          '⚠️ Kontrak Pengurus Dana Yayasan Keluarga telah tamat (tempoh 5 tahun). Sila lantik pengurus baharu segera untuk mengelakkan risiko pecah amanah dan pemantauan kerajaan!',
          'warning'
        );
      }
    }

    // 3. Risiko Tadbir Urus (Pecah Amanah & Audit Lari Cukai) — hanya di luar penjara
    const trustNet = this.getTrustNetWorth(s);
    if ((s.prison && s.prison.inPrison) || trustNet <= 0 || s.age < 18) return null;

    const tier = ft.fundManager ? ft.fundManager.tier : 'none';
    const heat = (s.alignment && s.alignment.notoriety) || 0;
    const embezzleChance = tier === 'none' ? 0.22 : tier === 'junior' ? 0.14 : tier === 'profesional' ? 0.04 : 0.01;
    const auditChance = Math.min(0.42, (tier === 'none' ? 0.20 : tier === 'junior' ? 0.13 : tier === 'profesional' ? 0.05 : 0.015) + (heat * 0.002) + (ft.feeRate >= 15 ? 0.05 : 0));

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
              if (s.money >= legalFee) s.money -= legalFee;
              else ft.balance = Math.max(0, ft.balance - legalFee);
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

    // Peristiwa B: Pemantauan Kerajaan & Siasatan Lari Cukai
    if (Utils.chance(auditChance)) {
      ft.underAudit = true;
      const penalty = Math.max(Utils.usdToLocal(4000, s.countryId), Math.round(trustNet * 0.18));
      const lawyerFee = Utils.usdToLocal(5000, s.countryId);
      return {
        id: 'trust_tax_audit_' + s.year,
        icon: '🏛️',
        title: 'Pemantauan Kerajaan & Siasatan Lari Cukai!',
        text: `Pihak berkuasa hasil mengesyaki Tabung Yayasan Keluarga anda digunakan untuk mengelak cukai secara haram. Siasatan rasmi telah dibuka!`,
        choices: [
          {
            label: `💵 Bayar Penalti Cukai & Denda Penuh (${Utils.formatMoney(penalty, s.countryId)})`,
            action: () => {
              ft.underAudit = false;
              if (s.money >= penalty) s.money -= penalty;
              else {
                const rem = penalty - Math.max(0, s.money);
                s.money = Math.min(0, s.money);
                ft.balance = Math.max(0, ft.balance - rem);
              }
              if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: 12 });
              return `Anda melangsaikan penalti cukai ${Utils.formatMoney(penalty, s.countryId)} dan siasatan kerajaan ditutup secara rasmi.`;
            }
          },
          {
            label: `⚖️ Lantik Peguam Korporat Pertahankan Yayasan (${Utils.formatMoney(lawyerFee, s.countryId)})`,
            action: () => {
              ft.underAudit = false;
              if (s.money >= lawyerFee) s.money -= lawyerFee;
              else ft.balance = Math.max(0, ft.balance - lawyerFee);
              const smarts = (s.stats && s.stats.smarts) || 50;
              const winProb = (tier === 'elit' ? 0.80 : tier === 'profesional' ? 0.62 : tier === 'junior' ? 0.35 : 0.20) + (smarts >= 75 ? 0.10 : 0);
              if (Utils.chance(Math.min(0.92, winProb))) {
                return 'Peguam korporat membuktikan struktur Tabung Yayasan Keluarga anda mematuhi undang-undang! Tiada denda dikenakan.';
              }
              const fine = Math.round(penalty * 1.25);
              if (s.money >= fine) s.money -= fine;
              else ft.balance = Math.max(0, ft.balance - fine);
              if (window.KarmaEndings) KarmaEndings.adjustAlignment({ notoriety: 22, stress: 22 });
              if (Utils.chance(0.35) && window.PrisonFugitive && PrisonFugitive.enterPrisonState) {
                PrisonFugitive.enterPrisonState(s, 'Pengelakan Cukai & Penipuan Kewangan Yayasan', Utils.randInt(3, 6), 'medium');
                return 'Pembelaan gagal! Mahkamah menjatuhkan hukuman penjara dan denda berat atas kesalahan pengelakan cukai.';
              }
              return `Pembelaan gagal! Anda dikenakan denda berat ${Utils.formatMoney(fine, s.countryId)} dan rekod anda kini dipantau ketat pihak berkuasa.`;
            }
          },
          {
            label: '🕶️ Sorok Dokumen & Nafikan Dakwaan',
            action: () => {
              ft.underAudit = false;
              if (Utils.chance(0.18)) {
                if (window.KarmaEndings) KarmaEndings.adjustAlignment({ notoriety: 14, stress: 16 });
                return 'Anda berjaya mengelirukan juruaudit buat sementara waktu, namun nama anda kekal dalam senarai pemantauan.';
              }
              const fine = Math.round(penalty * 1.4);
              ft.balance = Math.max(0, ft.balance - fine);
              ft.lapsed = true;
              if (window.KarmaEndings) KarmaEndings.adjustAlignment({ notoriety: 35, stress: 28, karma: -18 });
              if (window.PrisonFugitive && PrisonFugitive.enterPrisonState) {
                PrisonFugitive.enterPrisonState(s, 'Penipuan Kewangan & Pengelakan Cukai Yayasan', Utils.randInt(4, 8), 'maximum');
              }
              return `BONGKAR! Dokumen palsu anda dikesan pihak berkuasa. Yayasan digantung, denda ${Utils.formatMoney(fine, s.countryId)} dikenakan, dan anda dijatuhi hukuman penjara!`;
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
    const totalDebt = Math.round(assetSum.totalDebt || 0) + (s.money < 0 ? Math.abs(Math.round(s.money)) : 0);
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
