/* ==========================================================================
   WorldLife — Enjin Aset, Pasaran Dinamik, Pinjaman Bank, Pelaburan,
   Pusaka Keluarga (Heirlooms) & Pewarisan Rentas Generasi (Bahasa Melayu)
   ========================================================================== */

window.AssetsEngine = {
  MAX_MARKET_REFRESHES: 2,

  PROPERTY_LEMON_FLAWS: [
    'Struktur retak / kawasan banjir kerap',
    'Pemaju bermasalah & sistem perpaipan bocor teruk',
    'Mendapan tanah & kerosakan pendawaian tersembunyi',
    'Masalah anai-anai kritikal & bumbung reput'
  ],

  VEHICLE_LEMON_FLAWS: [
    'Kereta banjir / enjin bermasalah',
    'Kotak gear (gearbox) rosak & casis pernah kemalangan teruk',
    'Sistem elektronik &ECU bermasalah kronik',
    'Odometer diputar & kebocoran enjin tersembunyi'
  ],

  ensureFields(s) {
    if (!s) return;
    if (!s.assets || typeof s.assets !== 'object') {
      s.assets = { properties: [], vehicles: [], collectibles: [], portfolio: {} };
    }
    if (!Array.isArray(s.assets.properties)) s.assets.properties = [];
    if (!Array.isArray(s.assets.vehicles)) s.assets.vehicles = [];
    if (!Array.isArray(s.assets.collectibles)) s.assets.collectibles = [];
    if (!s.assets.portfolio || typeof s.assets.portfolio !== 'object') s.assets.portfolio = {};
    if (typeof s.assets.unpaidTaxDebt !== 'number') s.assets.unpaidTaxDebt = 0;

    // Kekalkan medan ringkas untuk setiap hartanah/kenderaan lama
    s.assets.properties.forEach((p, idx) => {
      if (!p.uid) p.uid = `prop_mig_${idx}_${Date.now()}`;
      if (typeof p.condition !== 'number') p.condition = 85;
      if (typeof p.mortgage !== 'number') p.mortgage = 0;
      if (typeof p.annualMortgage !== 'number') p.annualMortgage = 0;
      if (typeof p.rented !== 'boolean') p.rented = false;
      if (typeof p.yieldPct !== 'number') p.yieldPct = 5.5;
      if (typeof p.purchasePrice !== 'number') p.purchasePrice = p.value || 0;
      if (typeof p.purchasedYear !== 'number') p.purchasedYear = s.year || 2026;
      if (typeof p.yearsHeld !== 'number') p.yearsHeld = Math.max(0, (s.year || 2026) - p.purchasedYear);
      if (typeof p.isLemon !== 'boolean') p.isLemon = false;
      if (typeof p.lemonRevealed !== 'boolean') p.lemonRevealed = Boolean(p.isLemon);
    });
    s.assets.vehicles.forEach((v, idx) => {
      if (!v.uid) v.uid = `veh_mig_${idx}_${Date.now()}`;
      if (typeof v.condition !== 'number') v.condition = 82;
      if (typeof v.purchasePrice !== 'number') v.purchasePrice = v.value || 0;
      if (typeof v.purchasedYear !== 'number') v.purchasedYear = s.year || 2026;
      if (typeof v.isLemon !== 'boolean') v.isLemon = false;
      if (typeof v.lemonRevealed !== 'boolean') v.lemonRevealed = Boolean(v.isLemon);
    });
    if (!s.licenses || typeof s.licenses !== 'object') {
      s.licenses = { moto: false, car: Boolean(s.hasDriverLicense) };
    } else {
      if (typeof s.licenses.moto !== 'boolean') s.licenses.moto = false;
      if (typeof s.licenses.car !== 'boolean') s.licenses.car = Boolean(s.hasDriverLicense);
    }
    s.hasDriverLicense = Boolean(s.licenses.car || s.licenses.moto);

    if (!s.assetMarket || typeof s.assetMarket !== 'object') {
      s.assetMarket = {
        trendId: 'stable',
        lastYear: -1,
        refreshesLeft: this.MAX_MARKET_REFRESHES,
        properties: [],
        vehiclesNew: [],
        vehiclesUsed: [],
        collectibles: [],
        invPrices: {}
      };
    }
    if (!s.assetMarket.invPrices || typeof s.assetMarket.invPrices !== 'object') {
      s.assetMarket.invPrices = {};
    }
    // Pemulihan automatik untuk simpanan lama: Simpanan Tetap Bank (FD) tidak boleh rugi pokok
    const fdPos = s.assets && s.assets.portfolio && s.assets.portfolio.inv_fd_bank;
    if (fdPos && fdPos.units > 0) {
      const avgBuy = Math.round(fdPos.totalCost / fdPos.units);
      const curFd = s.assetMarket.invPrices.inv_fd_bank;
      if (!curFd || (curFd.price || 0) < avgBuy || (curFd.changePct || 0) < 0) {
        s.assetMarket.invPrices.inv_fd_bank = {
          price: Math.max(avgBuy, (curFd && curFd.price) || 0),
          changePct: Math.max(0, (curFd && curFd.changePct) || 0)
        };
      }
    }
  },

  _scaleUsdToLocal(usd, countryId, useCol = true) {
    const c = Utils.getCountry(countryId);
    const col = useCol ? Math.max(0.35, Math.min(2.2, c.costOfLivingIndex || 0.75)) : 1;
    return Math.max(100, Utils.usdToLocal(Math.round(usd * col), countryId));
  },

  getTrendObj(s) {
    this.ensureFields(s);
    return AssetsData.MARKET_TRENDS.find(t => t.id === s.assetMarket.trendId) || AssetsData.MARKET_TRENDS[1];
  },

  // --------------------------------------------------------------------------
  // 1. PASARAN ASET DINAMIK TAHUNAN (HARTANAH, KENDERAAN, PELABURAN, KOLEKSI)
  // --------------------------------------------------------------------------
  generateYearlyMarket(s, opts = {}) {
    if (!s || !window.AssetsData) return;
    this.ensureFields(s);
    const m = s.assetMarket;

    if (!opts.isRefresh) {
      m.refreshesLeft = this.MAX_MARKET_REFRESHES;
      m.lastYear = s.year;
      // Pilih trend ekonomi baharu setiap tahun (wajaran realistik)
      const roll = Math.random();
      if (roll < 0.28) m.trendId = 'bull_run';
      else if (roll < 0.62) m.trendId = 'stable';
      else if (roll < 0.78) m.trendId = 'high_inflation';
      else if (roll < 0.91) m.trendId = 'correction';
      else m.trendId = 'recession';
    }

    const trend = this.getTrendObj(s);
    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

    // 1) Pasaran Hartanah (6–8 penyenaraian rawak dengan kondisi & Jualan Lelong!)
    const condTiers = [
      { label: 'Usang (Perlu Baik Pulih)', minC: 35, maxC: 55, priceMult: 0.76 },
      { label: 'Sederhana',                minC: 60, maxC: 78, priceMult: 0.94 },
      { label: 'Baharu',                   minC: 84, maxC: 96, priceMult: 1.06 },
      { label: 'Mewah & Eksklusif',        minC: 92, maxC: 100, priceMult: 1.16 }
    ];
    const propCount = Utils.randInt(6, 8);
    const pickedProps = shuffle(AssetsData.REAL_ESTATE).slice(0, propCount);
    m.properties = pickedProps.map((tpl, i) => {
      const ct = Utils.pick(condTiers);
      const isAuction = Utils.chance(0.20);
      const fluct = 0.92 + Math.random() * 0.16;
      const baseLocal = this._scaleUsdToLocal(tpl.baseUsd, s.countryId, true);
      const price = Math.round(baseLocal * ct.priceMult * fluct * (isAuction ? 0.78 : 1));
      const cond = Utils.randInt(ct.minC, ct.maxC);
      return {
        lid: `pl_${s.year}_${i}_${tpl.id}`,
        tplId: tpl.id,
        name: tpl.name,
        sub: tpl.sub,
        icon: tpl.icon,
        price,
        condition: cond,
        condLabel: ct.label,
        isAuction,
        yieldPct: Number((tpl.yieldPct + (Math.random() * 1.4 - 0.6)).toFixed(1)),
        upkeepPct: tpl.upkeepPct,
        prestige: tpl.prestige
      };
    });

    // 2) Pengedar Kenderaan: 5 Baharu + 5 Terpakai (mileage/usia/kondisi)
    const pickedNew = shuffle(AssetsData.VEHICLES).slice(0, 5);
    m.vehiclesNew = pickedNew.map((tpl, i) => {
      const price = Math.round(this._scaleUsdToLocal(tpl.baseUsd, s.countryId, false) * (0.95 + Math.random() * 0.12));
      return {
        lid: `vn_${s.year}_${i}_${tpl.id}`,
        tplId: tpl.id,
        name: tpl.name,
        sub: tpl.sub,
        icon: tpl.icon,
        price,
        condition: Utils.randInt(95, 100),
        used: false,
        mileageKm: 0,
        ageYrs: 0,
        upkeepPct: tpl.upkeepPct,
        depRate: tpl.depRate,
        looksBonus: tpl.looksBonus,
        classic: tpl.classic
      };
    });

    const pickedUsed = shuffle(AssetsData.VEHICLES.filter(v => !v.classic || Utils.chance(0.4))).slice(0, 5);
    m.vehiclesUsed = pickedUsed.map((tpl, i) => {
      const ageYrs = Utils.randInt(2, 11);
      const cond = Utils.clamp(Utils.randInt(40, 86) - Math.round(ageYrs * 1.5), 25, 88);
      const discount = Math.max(0.32, 0.85 - (ageYrs * 0.05));
      const price = Math.round(this._scaleUsdToLocal(tpl.baseUsd, s.countryId, false) * discount);
      return {
        lid: `vu_${s.year}_${i}_${tpl.id}`,
        tplId: tpl.id,
        name: tpl.name,
        sub: tpl.sub,
        icon: tpl.icon,
        price,
        condition: cond,
        used: true,
        mileageKm: ageYrs * Utils.randInt(11000, 22000),
        ageYrs,
        upkeepPct: tpl.upkeepPct,
        depRate: tpl.depRate,
        looksBonus: tpl.looksBonus,
        classic: tpl.classic
      };
    });

    // 3) Harga Semasa 15 Instrumen Pelaburan (ikut Trend Pasaran!)
    const allSectors = ['Teknologi', 'Tenaga', 'Kesihatan', 'Kewangan', 'Hartanah', 'Pengguna'];
    const pickedSectors = shuffle(allSectors).slice(0, 2);
    m.sectorSentiments = pickedSectors.map((sec, idx) => ({
      sector: sec,
      mood: idx === 0 ? 'Rancak' : 'Perlahan',
      delta: idx === 0 ? 0.05 : -0.04
    }));
    const hasFinCert = Boolean(s.education && Array.isArray(s.education.certificates) && s.education.certificates.some(cid => /cfa|cpa|fin|akaun|kewangan|pelaburan|bisnes/i.test(String(cid))));
    AssetsData.INVESTMENTS.forEach(inst => {
      const prev = m.invPrices[inst.id];
      const basePrice = this._scaleUsdToLocal(inst.baseUnitUsd, s.countryId, false);
      if (!prev || opts.isRefresh) {
        if (!prev) m.invPrices[inst.id] = { price: basePrice, changePct: 0 };
        return;
      }
      // Simpanan Tetap Bank (FD): modal dilindungi sepenuhnya (0% risiko rugi pokok)
      if (inst.id === 'inv_fd_bank') {
        const pos = s.assets && s.assets.portfolio && s.assets.portfolio[inst.id];
        const avgBuy = (pos && pos.units > 0) ? Math.round(pos.totalCost / pos.units) : basePrice;
        const protectedFloor = Math.max(basePrice, prev.price || 0, avgBuy);
        m.invPrices[inst.id] = { price: protectedFloor, changePct: 0 };
        return;
      }
      let range = [inst.minRet, inst.maxRet];
      if (inst.kind === 'stock' || inst.kind === 'reit') {
        range = [inst.minRet + trend.stockShift[0] * 0.5, inst.maxRet + trend.stockShift[1] * 0.5];
      } else if (inst.kind === 'gold') {
        range = [inst.minRet + trend.goldShift[0] * 0.6, inst.maxRet + trend.goldShift[1] * 0.6];
      } else if (inst.kind === 'crypto' || inst.kind === 'altcoin') {
        range = [inst.minRet + trend.cryptoShift[0] * 0.5, inst.maxRet + trend.cryptoShift[1] * 0.5];
      }
      let pct = range[0] + Math.random() * (range[1] - range[0]);
      // Altcoin: peluang 10% rug-pull (-80%) atau 8% pump (+140%)!
      if (inst.kind === 'altcoin') {
        if (Utils.chance(0.10)) pct = -0.82;
        else if (Utils.chance(0.08)) pct = 1.45;
      }
      const certEdge = hasFinCert ? 0.015 : 0;
      const nextPrice = Math.max(Math.round(basePrice * 0.12), Math.round(prev.price * (1 + pct + certEdge)));
      m.invPrices[inst.id] = { price: nextPrice, changePct: Number((pct * 100).toFixed(1)) };
    });

    if (!opts.isRefresh) { m.globalProperties = []; m.globalVehicles = []; this.ensureGlobalMarkets(s); }

    // 4) Pasaran Lelongan Pusaka & Koleksi Tahunan Terhad (1–3 item unik setahun; tidak ditambah semasa refresh)
    if (!opts.isRefresh) {
      const ownedSet = this._getOwnedCollectibleKeys(s);
      const availCols = shuffle(AssetsData.COLLECTIBLES.filter(c => !c.isMystery && !ownedSet.has(c.id) && !ownedSet.has(c.name)));
      const pickCount = Utils.randInt(1, 3);
      const colList = availCols.slice(0, pickCount);
      const mysteryTpl = AssetsData.COLLECTIBLES.find(c => c.isMystery);
      if (mysteryTpl && colList.length < 3 && Utils.chance(0.18)) colList.unshift(mysteryTpl);

      m.collectibles = colList.map((tpl, i) => ({
        lid: `cl_${s.year}_${i}_${tpl.id}`,
        tplId: tpl.id,
        name: tpl.name,
        icon: tpl.icon,
        price: Math.round(this._scaleUsdToLocal(tpl.baseUsd, s.countryId, false) * (0.9 + Math.random() * 0.22)),
        appRate: tpl.appRate,
        prestige: tpl.prestige,
        isMystery: Boolean(tpl.isMystery)
      }));
    }
  },

  refreshMarket() {
    const s = GameState.current;
    this.ensureFields(s);
    if (s.assetMarket.refreshesLeft <= 0) {
      return { ok: false, msg: 'Anda sudah menggunakan kesemua 2 segaran Pasaran Aset tahun ini!' };
    }
    s.assetMarket.refreshesLeft -= 1;
    this.generateYearlyMarket(s, { isRefresh: true });
    GameState.save();
    return { ok: true, msg: `🔄 Pasaran aset disegarkan! (Baki: ${s.assetMarket.refreshesLeft}/${this.MAX_MARKET_REFRESHES})` };
  },

  // --------------------------------------------------------------------------
  // 1B. LOGIK "ASET BUSUK" (LEMON) & PRATONTON POTONGAN JUALAN ASET
  // --------------------------------------------------------------------------
  revealLemonAsset(s, asset, assetType = 'property') {
    if (!asset || !asset.isLemon || asset.lemonRevealed) return null;
    asset.lemonRevealed = true;
    const dropPct = Utils.randInt(20, 35);
    const oldVal = asset.value || asset.purchasePrice || 0;
    asset.value = Math.max(500, Math.round(oldVal * (1 - dropPct / 100)));
    const upkeepMult = Number((1.5 + Math.random() * 0.5).toFixed(2));
    asset.upkeep = Math.round((asset.upkeep || Math.round(oldVal * 0.02)) * upkeepMult);
    asset.condition = Utils.clamp((asset.condition || 75) - Utils.randInt(12, 22), 10, 100);

    const warnMsg = `⚠️ ASET BUSUK TERBONGKAR! ${asset.icon || '⚠️'} ${asset.name} yang anda beli didapati mempunyai kecacatan tersembunyi (${asset.lemonFlaw || 'kerosakan struktur/mekanikal'})! Nilai pasaran jatuh mendadak -${dropPct}% kepada ${Utils.formatMoney(asset.value, s.countryId)} dan kos penyelenggaraan meningkat ${upkeepMult}x.`;
    GameState.adjustStats({ happiness: -10 });
    if (s.alignment) s.alignment.stress = Utils.clamp((s.alignment.stress || 0) + 8, 0, 100);
    GameState.addJournalEntry(warnMsg, 'warning');
    return warnMsg;
  },

  getPropertyResalePrice(p) {
    if (!p) return 0;
    const marketVal = Math.max(0, Math.round(p.value || 0));
    const cond = Utils.clamp(typeof p.condition === 'number' ? p.condition : 80, 0, 100);
    let mult = 1.0;
    if (cond >= 80) {
      mult = 1.0;
    } else if (cond >= 51) {
      mult = 0.80 + ((cond - 51) / 28) * 0.16; // 80%–96%
    } else {
      mult = 0.40 + (cond / 50) * 0.30; // 40%–70%
    }
    return Math.max(0, Math.round(marketVal * mult));
  },

  getPropertyRepairCost(s, p) {
    if (!s || !p) return 0;
    const cond = Utils.clamp(typeof p.condition === 'number' ? p.condition : 80, 0, 100);
    if (cond >= 100) return 0;
    const damageRatio = (100 - cond) / 100;
    return Math.max(
      Utils.usdToLocal(200, s.countryId),
      Math.round((p.value || 0) * (0.015 + damageRatio * 0.08))
    );
  },

  previewAssetSale(s, assetType, uidOrInstId, sellFraction = 1) {
    this.ensureFields(s);
    if (assetType === 'property') {
      const p = s.assets.properties.find(x => x.uid === uidOrInstId);
      if (!p) return null;
      const marketValue = Math.max(0, Math.round(p.value || 0));
      const cond = Utils.clamp(typeof p.condition === 'number' ? p.condition : 80, 0, 100);
      const grossPrice = this.getPropertyResalePrice(p);
      const yearsHeld = Math.max(0, typeof p.yearsHeld === 'number' ? p.yearsHeld : ((s.year || 2026) - (p.purchasedYear || s.year || 2026)));
      const legalFeePct = 2.0;
      const ckhtPct = yearsHeld < 5 ? 5.0 : 3.5;
      const legalFee = Math.round(grossPrice * (legalFeePct / 100));
      const ckhtTax = Math.round(grossPrice * (ckhtPct / 100));
      const totalFeesAndTaxes = legalFee + ckhtTax;
      const mortgagePayoff = Math.max(0, Math.round(p.mortgage || 0));
      const netProceeds = grossPrice - totalFeesAndTaxes - mortgagePayoff;

      return {
        assetType: 'property',
        uid: p.uid,
        name: p.name,
        icon: p.icon || '🏠',
        isLemon: Boolean(p.isLemon && p.lemonRevealed),
        lemonFlaw: p.lemonFlaw || null,
        yearsHeld,
        condition: cond,
        marketValue,
        poorConditionDiscount: cond <= 50,
        grossPrice,
        legalFeePct,
        legalFee,
        taxPct: ckhtPct,
        taxLabel: `Cukai Jualan / CKHT (${ckhtPct.toFixed(1)}%${yearsHeld < 5 ? ' • Pegangan < 5 thn' : ' • Pegangan ≥ 5 thn'})`,
        saleTax: ckhtTax,
        totalFeesAndTaxes,
        mortgagePayoff,
        netProceeds
      };
    }

    if (assetType === 'vehicle') {
      const v = s.assets.vehicles.find(x => x.uid === uidOrInstId);
      if (!v) return null;
      const grossPrice = Math.max(0, Math.round(v.value || 0));
      const taxPct = 2.5;
      const saleTax = Math.round(grossPrice * (taxPct / 100));
      return {
        assetType: 'vehicle',
        uid: v.uid,
        name: v.name,
        icon: v.icon || '🚗',
        isLemon: Boolean(v.isLemon && v.lemonRevealed),
        lemonFlaw: v.lemonFlaw || null,
        grossPrice,
        legalFeePct: 0,
        legalFee: 0,
        taxPct,
        taxLabel: 'Cukai Jualan Aset (2.5%)',
        saleTax,
        totalFeesAndTaxes: saleTax,
        mortgagePayoff: 0,
        netProceeds: grossPrice - saleTax
      };
    }

    if (assetType === 'collectible') {
      const col = s.assets.collectibles.find(x => x.uid === uidOrInstId);
      if (!col) return null;
      const grossPrice = Math.max(0, Math.round(col.value || 0));
      const taxPct = 2.5;
      const saleTax = Math.round(grossPrice * (taxPct / 100));
      return {
        assetType: 'collectible',
        uid: col.uid,
        name: col.name,
        icon: col.icon || '💎',
        isLemon: false,
        grossPrice,
        legalFeePct: 0,
        legalFee: 0,
        taxPct,
        taxLabel: 'Cukai Jualan Aset (2.5%)',
        saleTax,
        totalFeesAndTaxes: saleTax,
        mortgagePayoff: 0,
        netProceeds: grossPrice - saleTax
      };
    }

    if (assetType === 'investment') {
      const pos = s.assets.portfolio[uidOrInstId];
      if (!pos || pos.units <= 0) return null;
      const inst = AssetsData.INVESTMENTS.find(x => x.id === uidOrInstId);
      const mPrice = (s.assetMarket.invPrices[uidOrInstId] && s.assetMarket.invPrices[uidOrInstId].price)
        || this._scaleUsdToLocal(inst ? inst.baseUnitUsd : 100, s.countryId, false);
      const frac = Math.max(0.05, Math.min(1, Number(sellFraction) || 1));
      const unitsSold = pos.units * frac;
      const grossPrice = Math.round(unitsSold * mPrice);
      const costPortion = Math.round(pos.totalCost * frac);
      const taxPct = 2.5;
      const saleTax = Math.round(grossPrice * (taxPct / 100));
      const netProceeds = grossPrice - saleTax;
      return {
        assetType: 'investment',
        instId: uidOrInstId,
        sellFraction: frac,
        name: `${inst ? inst.name : uidOrInstId} (${Math.round(frac * 100)}%)`,
        icon: inst ? inst.icon : '📈',
        grossPrice,
        costPortion,
        profitBeforeTax: grossPrice - costPortion,
        legalFeePct: 0,
        legalFee: 0,
        taxPct,
        taxLabel: 'Cukai Jualan Aset (2.5%)',
        saleTax,
        totalFeesAndTaxes: saleTax,
        mortgagePayoff: 0,
        netProceeds
      };
    }

    return null;
  },

  // --------------------------------------------------------------------------
  // 2. TINDAKAN HARTANAH (TUNAI / PINJAMAN BANK, INSPEKSI, SEWA, UBAH SUAI, BAIKI, JUAL)
  // --------------------------------------------------------------------------
  buyProperty(listingId, useMortgage = false, opts = {}) {
    const s = GameState.current;
    this.ensureFields(s);
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Tidak boleh membeli hartanah dari penjara.' };
    if (s.age < 18) return { ok: false, msg: 'Umur minimum membeli hartanah ialah 18 tahun.' };

    const item = s.assetMarket.properties.find(x => x.lid === listingId);
    if (!item) return { ok: false, msg: 'Penyenaraian hartanah tidak ditemui.' };

    const useInspection = Boolean(opts && opts.useInspection);
    const inspectionFee = useInspection ? Math.max(100, Math.round(item.price * 0.01)) : 0;

    let downPay = item.price;
    let mortgage = 0;
    let annualMortgage = 0;

    if (useMortgage) {
      const inc = window.CharacterStatus ? CharacterStatus.getTotalAnnualIncome(s) : { grossLocal: 0 };
      if (inc.grossLocal <= 0 && s.money < item.price * 0.5) {
        return { ok: false, msg: 'Bank menolak pinjaman: perlukan pendapatan tahunan aktif untuk kelulusan pinjaman!' };
      }
      downPay = Math.round(item.price * 0.20);
      mortgage = item.price - downPay;
      annualMortgage = Math.round((mortgage / 20) * 1.18); // tempoh 20 tahun termasuk kadar faedah/keuntungan
    }

    const totalUpfront = downPay + inspectionFee;
    if (s.money < totalUpfront) {
      return { ok: false, msg: `Baki tidak mencukupi! Perlukan ${Utils.formatMoney(totalUpfront, s.countryId)} (${useMortgage ? 'Deposit 20%' : 'Tunai penuh'}${useInspection ? ' + Inspeksi 1%' : ''}).` };
    }

    s.money -= totalUpfront;

    // Risiko "Aset Busuk" (15%–20% peluang tersembunyi; turun kepada ~3% jika mengupah pemeriksa/inspeksi!)
    const lemonProb = useInspection ? 0.03 : 0.18;
    const isLemon = (typeof opts.forceLemon === 'boolean') ? opts.forceLemon : Utils.chance(lemonProb);
    const lemonFlaw = isLemon ? Utils.pick(this.PROPERTY_LEMON_FLAWS) : null;

    const prop = {
      uid: `prop_${Date.now()}_${Utils.randInt(10, 99)}`,
      tplId: item.tplId,
      name: item.name,
      sub: item.sub,
      icon: item.icon,
      purchasePrice: item.price,
      value: item.price,
      condition: item.condition,
      mortgage,
      annualMortgage,
      rented: false,
      yieldPct: item.yieldPct,
      upkeep: Math.round(item.price * ((item.upkeepPct || 1.5) / 100)),
      prestige: item.prestige || 0,
      purchasedYear: s.year,
      yearsHeld: 0,
      isLemon,
      lemonFlaw,
      lemonRevealed: false,
      inspected: useInspection,
      countryId: s.countryId
    };
    s.assets.properties.push(prop);
    s.assetMarket.properties = s.assetMarket.properties.filter(x => x.lid !== listingId);

    if (item.prestige >= 7 && window.Dynasty) Dynasty.adjustReputation(Math.min(6, Math.round(item.prestige / 3)));
    GameState.adjustStats({ happiness: 10 });
    const inspNote = useInspection ? ` (Termasuk Inspeksi ${Utils.formatMoney(inspectionFee, s.countryId)})` : '';
    GameState.addJournalEntry(
      `🏠 Anda membeli ${prop.icon} ${prop.name} bernilai ${Utils.formatMoney(prop.value, s.countryId)} secara ${useMortgage ? `Pinjaman Bank (Deposit ${Utils.formatMoney(downPay, s.countryId)})` : 'Bayar Tunai'}${inspNote}!`,
      'milestone'
    );

    // Dedahkan kecacatan sejurus selepas pembelian (55% peluang) atau pada Age-Up seterusnya
    let lemonMsg = null;
    if (isLemon && (opts.revealImmediately || Utils.chance(0.55))) {
      lemonMsg = this.revealLemonAsset(s, prop, 'property');
    }

    GameState.save();
    return {
      ok: true,
      prop,
      isLemon,
      lemonRevealed: prop.lemonRevealed,
      msg: lemonMsg || `Tahniah! Anda kini memiliki ${prop.name}!`
    };
  },

  toggleRentProperty(uid) {
    const s = GameState.current;
    this.ensureFields(s);
    if (s.prison && s.prison.inPrison) {
      return { ok: false, msg: 'Tidak boleh menguruskan penyewaan hartanah semasa dalam tahanan.' };
    }
    const p = s.assets.properties.find(x => x.uid === uid);
    if (!p) return { ok: false, msg: 'Hartanah tidak ditemui.' };
    if (!p.rented && (p.condition ?? 80) <= 50) {
      return { ok: false, msg: 'Keadaan rumah terlalu daif (≤50%). Sila baik pulih dahulu sebelum disewakan.' };
    }
    p.rented = !p.rented;
    const estRent = Math.round(p.value * ((p.yieldPct || 5.5) / 100));
    GameState.addJournalEntry(
      p.rented
        ? `🔑 Anda menyewakan ${p.name} dengan anggaran pulangan sewa ${Utils.formatMoney(estRent, s.countryId)}/thn.`
        : `🏠 Anda menamatkan penyewaan ${p.name} untuk kegunaan sendiri.`
    );
    GameState.save();
    return { ok: true, msg: p.rented ? `Hartanah disewakan (~${Utils.formatMoney(estRent, s.countryId)}/thn)!` : 'Penyewaan ditamatkan.' };
  },

  renovateProperty(uid) {
    const s = GameState.current;
    this.ensureFields(s);
    const p = s.assets.properties.find(x => x.uid === uid);
    if (!p) return { ok: false, msg: 'Hartanah tidak ditemui.' };
    const cost = Math.round(p.value * 0.14);
    if (s.money < cost) return { ok: false, msg: `Kos ubah suai ialah ${Utils.formatMoney(cost, s.countryId)}.` };
    s.money -= cost;
    p.condition = Utils.clamp(p.condition + Utils.randInt(18, 30), 0, 100);
    const valueBoost = Math.round(cost * (1.25 + Math.random() * 0.35));
    p.value += valueBoost;
    GameState.adjustStats({ happiness: 6 });
    GameState.addJournalEntry(`🔨 Ubah suai ${p.name} selesai! Keadaan kini ${p.condition}% & nilai pasaran melonjak ke ${Utils.formatMoney(p.value, s.countryId)}!`, 'milestone');
    GameState.save();
    return { ok: true, msg: `Nilai hartanah naik ke ${Utils.formatMoney(p.value, s.countryId)}!` };
  },

  maintainProperty(uid) {
    const s = GameState.current;
    this.ensureFields(s);
    if (s.prison && s.prison.inPrison) {
      return { ok: false, msg: 'Tidak boleh membaik pulih hartanah semasa dalam tahanan.' };
    }
    const p = s.assets.properties.find(x => x.uid === uid);
    if (!p) return { ok: false, msg: 'Hartanah tidak ditemui.' };
    if ((p.condition ?? 80) >= 100) {
      return { ok: false, msg: 'Hartanah sudah berada dalam keadaan terbaik (100%).' };
    }
    const cost = this.getPropertyRepairCost(s, p);
    if (s.money < cost) return { ok: false, msg: `Baki tidak mencukupi — kos baik pulih ialah ${Utils.formatMoney(cost, s.countryId)}.` };
    s.money -= cost;
    p.condition = 100;
    GameState.addJournalEntry(`🔧 Anda membaik pulih dan menyelenggara ${p.name} dengan kos ${Utils.formatMoney(cost, s.countryId)}. Keadaan rumah kini pulih sepenuhnya (100%)!`);
    GameState.save();
    return { ok: true, msg: `${p.name} selesai dibaik pulih (Kondisi kini 100%)!` };
  },

  sellProperty(uid) {
    const s = GameState.current;
    this.ensureFields(s);
    const idx = s.assets.properties.findIndex(x => x.uid === uid);
    if (idx < 0) return { ok: false, msg: 'Hartanah tidak ditemui.' };
    const p = s.assets.properties[idx];
    const prev = this.previewAssetSale(s, 'property', uid);
    s.money += prev.netProceeds;
    s.assets.properties.splice(idx, 1);
    GameState.addJournalEntry(
      `💵 Jualan Hartanah (${p.name}): Harga Kasar ${Utils.formatMoney(prev.grossPrice, s.countryId)} — Potongan Yuran Guaman & S&P (2.0%: -${Utils.formatMoney(prev.legalFee, s.countryId)}), Cukai Jualan/CKHT (${prev.taxPct.toFixed(1)}%: -${Utils.formatMoney(prev.saleTax, s.countryId)})${prev.mortgagePayoff > 0 ? `, Pelunasan Pinjaman (-${Utils.formatMoney(prev.mortgagePayoff, s.countryId)})` : ''} → Tunai Bersih Diterima: ${Utils.formatMoney(prev.netProceeds, s.countryId)}.`,
      'milestone'
    );
    GameState.save();
    return {
      ok: true,
      breakdown: prev,
      msg: `Terjual! Tunai bersih diterima: ${Utils.formatMoney(prev.netProceeds, s.countryId)} (selepas Yuran S&P & CKHT).`
    };
  },

  // --------------------------------------------------------------------------
  // 3. TINDAKAN KENDERAAN (BELI BAHARU/TERPAKAI, INSPEKSI, SERVIS & JUAL)
  // --------------------------------------------------------------------------
  buyVehicle(listingId, isUsed = false, opts = {}) {
    const s = GameState.current;
    this.ensureFields(s);
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Tidak boleh membeli kenderaan dari penjara.' };
    if (s.age < 16) return { ok: false, msg: 'Umur minimum membeli kenderaan ialah 16 tahun.' };

    const arr = isUsed ? s.assetMarket.vehiclesUsed : s.assetMarket.vehiclesNew;
    const item = arr.find(x => x.lid === listingId);
    if (!item) return { ok: false, msg: 'Kenderaan tidak ditemui.' };

    const useInspection = Boolean(opts && opts.useInspection);
    const inspectionFee = useInspection ? Math.max(50, Math.round(item.price * 0.01)) : 0;
    const totalCost = item.price + inspectionFee;

    if (s.money < totalCost) {
      return { ok: false, msg: `Perlukan ${Utils.formatMoney(totalCost, s.countryId)}${useInspection ? ' (termasuk Inspeksi 1%)' : ''}.` };
    }

    s.money -= finalCost;

    // Risiko "Aset Busuk" (15%–20% peluang; turun ke ~3% jika mengupah pemeriksa/inspeksi!)
    const lemonProb = useInspection ? 0.03 : 0.18;
    const isLemon = (typeof opts.forceLemon === 'boolean') ? opts.forceLemon : Utils.chance(lemonProb);
    const lemonFlaw = isLemon ? Utils.pick(this.VEHICLE_LEMON_FLAWS) : null;

    const veh = {
      uid: `veh_${Date.now()}_${Utils.randInt(10, 99)}`,
      tplId: item.tplId,
      name: item.name,
      sub: item.sub,
      icon: item.icon,
      purchasePrice: item.price,
      value: item.price,
      condition: item.condition,
      ageYrs: item.ageYrs || 0,
      upkeep: Math.round(item.price * ((item.upkeepPct || 5) / 100)),
      depRate: item.depRate,
      looksBonus: item.looksBonus || 0,
      classic: Boolean(item.classic),
      purchasedYear: s.year,
      isLemon,
      lemonFlaw,
      lemonRevealed: false,
      inspected: useInspection
    };
    s.assets.vehicles.push(veh);
    if (isUsed) s.assetMarket.vehiclesUsed = s.assetMarket.vehiclesUsed.filter(x => x.lid !== listingId);
    else s.assetMarket.vehiclesNew = s.assetMarket.vehiclesNew.filter(x => x.lid !== listingId);

    if (veh.looksBonus > 0) GameState.adjustStats({ looks: Math.min(8, veh.looksBonus), happiness: 10 });
    if (veh.looksBonus >= 10 && window.Dynasty) Dynasty.adjustReputation(4);
    const inspNote = useInspection ? ` (Termasuk Inspeksi ${Utils.formatMoney(inspectionFee, s.countryId)})` : '';
    GameState.addJournalEntry(`🚗 Anda membeli ${veh.icon} ${veh.name} (${isUsed ? 'Terpakai' : 'Baharu'}) pada harga ${Utils.formatMoney(veh.value, s.countryId)}${inspNote}!`, 'milestone');

    let lemonMsg = null;
    if (isLemon && (opts.revealImmediately || Utils.chance(0.55))) {
      lemonMsg = this.revealLemonAsset(s, veh, 'vehicle');
    }

    GameState.save();
    return {
      ok: true,
      veh,
      isLemon,
      lemonRevealed: veh.lemonRevealed,
      msg: lemonMsg || `Tahniah! ${veh.name} kini milik anda!`
    };
  },

  maintainVehicle(uid) {
    const s = GameState.current;
    this.ensureFields(s);
    const v = s.assets.vehicles.find(x => x.uid === uid);
    if (!v) return { ok: false, msg: 'Kenderaan tidak ditemui.' };
    const cost = Math.max(Utils.usdToLocal(120, s.countryId), Math.round(v.value * 0.06));
    if (s.money < cost) return { ok: false, msg: `Kos servis ialah ${Utils.formatMoney(cost, s.countryId)}.` };
    s.money -= cost;
    v.condition = Utils.clamp(v.condition + Utils.randInt(18, 28), 0, 100);
    GameState.save();
    return { ok: true, msg: `${v.name} diservis! Keadaan kini ${v.condition}%.` };
  },

  sellVehicle(uid) {
    const s = GameState.current;
    this.ensureFields(s);
    const idx = s.assets.vehicles.findIndex(x => x.uid === uid);
    if (idx < 0) return { ok: false, msg: 'Kenderaan tidak ditemui.' };
    const v = s.assets.vehicles[idx];
    const prev = this.previewAssetSale(s, 'vehicle', uid);
    s.money += prev.netProceeds;
    s.assets.vehicles.splice(idx, 1);
    GameState.addJournalEntry(
      `💵 Jualan Kenderaan (${v.name}): Harga Kasar ${Utils.formatMoney(prev.grossPrice, s.countryId)} — Potongan Cukai Jualan Aset (2.5%: -${Utils.formatMoney(prev.saleTax, s.countryId)}) → Tunai Bersih Diterima: ${Utils.formatMoney(prev.netProceeds, s.countryId)}.`
    );
    GameState.save();
    return {
      ok: true,
      breakdown: prev,
      msg: `Terjual! Tunai bersih diterima: ${Utils.formatMoney(prev.netProceeds, s.countryId)} (selepas Cukai Jualan 2.5%).`
    };
  },

  // --------------------------------------------------------------------------
  // 3B. SISTEM LESEN MEMANDU & INTERAKSI KENDERAAN AKTIF
  // --------------------------------------------------------------------------
  DRIVING_QUESTIONS: {
    moto: [
      {
        q: 'Ketika menunggang motosikal dalam hujan lebat di jalan licin, apakah tindakan paling selamat?',
        options: [
          { text: 'Kurangkan kelajuan, jaga jarak selamat dan elakkan brek mengejut', correct: true },
          { text: 'Pecut lebih laju supaya cepat sampai sebelum hujan makin lebat', correct: false },
          { text: 'Tarik brek hadapan sekuat hati di selekoh tajam', correct: false }
        ]
      },
      {
        q: 'Sebuah lori besar berada di hadapan anda dan mahu membelok ke kiri di simpang. Apakah yang patut anda lakukan?',
        options: [
          { text: 'Jangan menyelit di titik buta sebelah kiri lori dan tunggu sehingga ia selesai membelok', correct: true },
          { text: 'Menyelit rapat di sebelah kiri lori dengan segera', correct: false },
          { text: 'Membunyikan hon berterusan sambil memotong dari bahu jalan', correct: false }
        ]
      },
      {
        q: 'Sebelum menukar lorong ke kanan di jalan raya utama, apakah urutan langkah yang betul?',
        options: [
          { text: 'Beri lampu isyarat awal, periksa cermin sisi dan toleh titik buta sebelum masuk lorong', correct: true },
          { text: 'Terus masuk lorong dengan pantas kemudian baru beri lampu isyarat', correct: false },
          { text: 'Hanya lihat hadapan tanpa perlu memeriksa cermin sisi', correct: false }
        ]
      }
    ],
    car: [
      {
        q: 'Lampu isyarat bertukar kuning ketika anda menghampiri garisan berhenti pada kelajuan sederhana. Apakah tindakan yang betul?',
        options: [
          { text: 'Perlahankan kereta dan berhenti dengan selamat sebelum garisan berhenti', correct: true },
          { text: 'Tekan minyak sekuat hati untuk melepasi simpang sebelum lampu merah', correct: false },
          { text: 'Berhenti mengejut di tengah-tengah petak kuning simpang', correct: false }
        ]
      },
      {
        q: 'Ketika memandu di bulatan jalan raya (roundabout), kenderaan manakah yang mempunyai hak laluan utama?',
        options: [
          { text: 'Kenderaan yang sudah berada di dalam bulatan dari arah kanan', correct: true },
          { text: 'Kenderaan yang memandu paling laju dari jalan masuk', correct: false },
          { text: 'Kenderaan paling besar tanpa mengira arah', correct: false }
        ]
      },
      {
        q: 'Kereta anda mula tergelincir ketika melalui permukaan jalan yang bertakung air. Apakah reaksi pemanduan yang betul?',
        options: [
          { text: 'Lepaskan pedal minyak perlahan-lahan dan pegang stereng dengan kemas mengikut arah laluan', correct: true },
          { text: 'Tekan brek kecemasan secara mengejut dan pusing stereng secara mendadak', correct: false },
          { text: 'Tukar gear undur serta-merta untuk memperlahankan kereta', correct: false }
        ]
      }
    ]
  },

  getRequiredLicenseType(v) {
    if (!v) return null;
    const tplId = v.tplId || v.id || '';
    if (tplId === 'veh_road_bike') return null; // Basikal tidak memerlukan lesen memandu
    if (['veh_kapcai', 'veh_scooter', 'veh_touring_moto', 'veh_superbike'].includes(tplId)) return 'moto';
    if (v.sub === 'Laut' || v.sub === 'Udara') return 'car';
    return 'car';
  },

  hasMatchingLicense(s, v) {
    this.ensureFields(s);
    const req = this.getRequiredLicenseType(v);
    if (!req) return true;
    return Boolean(s.licenses && s.licenses[req]);
  },

  isFastVehicle(v) {
    if (!v) return false;
    const tplId = v.tplId || v.id || '';
    return ['veh_superbike', 'veh_sport_gt', 'veh_supercar', 'veh_hypercar', 'veh_ev_modern', 'veh_touring_moto'].includes(tplId);
  },

  hasFastWorkingVehicle(s) {
    if (!s || !s.assets || !Array.isArray(s.assets.vehicles)) return false;
    return s.assets.vehicles.some(v => v && v.condition >= 40 && this.isFastVehicle(v) && this.hasMatchingLicense(s, v));
  },

  hasLuxuryWorkingVehicle(s) {
    if (!s || !s.assets || !Array.isArray(s.assets.vehicles)) return false;
    return s.assets.vehicles.some(v => v && v.condition >= 45 && (v.looksBonus || 0) >= 6);
  },

  getLicenseFee(s, type = 'car') {
    const usd = type === 'moto' ? 85 : 220;
    return Math.max(20, Utils.usdToLocal(usd, s.countryId));
  },

  checkLicenseTestEligibility(s, type = 'car') {
    this.ensureFields(s);
    if (s.prison && s.prison.inPrison) {
      return { ok: false, reason: 'Tidak boleh mengambil ujian lesen memandu semasa dalam tahanan.' };
    }
    const minAge = type === 'moto' ? 16 : 17;
    if (s.age < minAge) {
      return { ok: false, reason: `Umur minimum untuk lesen ini ialah ${minAge} tahun.` };
    }
    if (s.licenses && s.licenses[type]) {
      return { ok: false, reason: 'Anda sudah memiliki lesen ini secara sah.' };
    }
    const cdKey = type === 'moto' ? 'licenseTestMoto' : 'licenseTestCar';
    if (s.yearlyActions && s.yearlyActions[cdKey]) {
      return { ok: false, reason: 'Anda sudah menduduki ujian lesen kategori ini tahun ini. Cuba lagi tahun hadapan.' };
    }
    const fee = this.getLicenseFee(s, type);
    if ((s.money || 0) < fee) {
      return { ok: false, reason: `Baki tidak mencukupi. Yuran ujian ialah ${Utils.formatMoney(fee, s.countryId)}.` };
    }
    return { ok: true, fee };
  },

  pickDrivingTestQuestions(type = 'car') {
    const bank = this.DRIVING_QUESTIONS[type] || this.DRIVING_QUESTIONS.car;
    const shuffled = [...bank].sort(() => Math.random() - 0.5).slice(0, 2);
    return shuffled.map(item => ({
      q: item.q,
      options: [...item.options].sort(() => Math.random() - 0.5)
    }));
  },

  submitDrivingLicenseTest(type = 'car', correctCount = 0, totalQuestions = 2) {
    const s = GameState.current;
    const elig = this.checkLicenseTestEligibility(s, type);
    if (!elig.ok) return { ok: false, msg: elig.reason };

    const c = Utils.getCountry(s.countryId);
    const cdKey = type === 'moto' ? 'licenseTestMoto' : 'licenseTestCar';
    s.yearlyActions[cdKey] = true;
    s.money -= elig.fee;

    const label = type === 'moto' ? 'Lesen Motosikal' : 'Lesen Kereta';
    const agency = c.id === 'MY' ? 'JPJ' : c.name;
    const smarts = (s.stats && s.stats.smarts) || 50;

    // Wajib jawab betul senario peraturan jalan raya + ujian praktikal dipengaruhi Kepintaran
    const theoryPassed = correctCount >= totalQuestions;
    const practicalChance = Math.min(0.95, 0.58 + (smarts * 0.0035));
    const passed = theoryPassed && Utils.chance(practicalChance);

    if (passed) {
      s.licenses[type] = true;
      s.hasDriverLicense = Boolean(s.licenses.car || s.licenses.moto);
      GameState.adjustStats({ happiness: 10 });
      GameState.addJournalEntry(
        `🪪 LULUS UJIAN MEMANDU! Anda berjaya memperoleh ${label} sah (${agency}) selepas membayar yuran ${Utils.formatMoney(elig.fee, s.countryId)}.`,
        'milestone'
      );
      GameState.save();
      return {
        ok: true,
        passed: true,
        msg: `Tahniah! Anda lulus ujian dan memperoleh ${label} sah!`
      };
    }

    const failReason = !theoryPassed
      ? 'gagal menjawab soalan peraturan jalan raya dengan tepat'
      : 'melakukan kesilapan semasa ujian praktikal di litar dan jalan raya';
    GameState.adjustStats({ happiness: -4 });
    GameState.addJournalEntry(
      `🪪 Gagal ujian ${label} (${agency}) kerana ${failReason}. Yuran ${Utils.formatMoney(elig.fee, s.countryId)} hangus — sila ambil semula tahun hadapan.`,
      'warning'
    );
    GameState.save();
    return {
      ok: false,
      passed: false,
      msg: `Gagal ujian ${label} (${failReason}). Cuba lagi tahun hadapan.`
    };
  },

  cruiseWithVehicle(uid) {
    const s = GameState.current;
    this.ensureFields(s);
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Tidak boleh memandu ketika berada dalam tahanan.' };
    const v = s.assets.vehicles.find(x => x.uid === uid);
    if (!v) return { ok: false, msg: 'Kenderaan tidak ditemui.' };

    const usedMap = s.yearlyActions.vehCruiseCount || {};
    const used = usedMap[uid] || 0;
    if (used >= 2) {
      return { ok: false, msg: `Anda sudah memandu atau menunggang ${v.name} bersiar-siar sebanyak 2 kali tahun ini.` };
    }
    usedMap[uid] = used + 1;
    s.yearlyActions.vehCruiseCount = usedMap;

    const hasLic = this.hasMatchingLicense(s, v);
    const reqType = this.getRequiredLicenseType(v);
    const wear = Utils.randInt(2, 4);
    v.condition = Utils.clamp((v.condition || 80) - wear, 5, 100);

    // 1) Risiko Sekatan Jalan Raya jika tiada lesen sah!
    if (!hasLic && reqType) {
      const licLabel = reqType === 'moto' ? 'Lesen Motosikal' : 'Lesen Kereta';
      if (Utils.chance(0.55)) {
        const fineLocal = Math.max(Utils.usdToLocal(220, s.countryId), Math.round(v.value * 0.05));
        s.money -= fineLocal;
        if (window.KarmaEndings) KarmaEndings.adjustAlignment({ notoriety: 16, stress: 10, karma: -5 });
        GameState.adjustStats({ happiness: -12 });

        // Peluang kenderaan disita jika kesalahan berulang atau nasib buruk
        if (Utils.chance(0.32)) {
          s.assets.vehicles = s.assets.vehicles.filter(x => x.uid !== uid);
          GameState.addJournalEntry(
            `🚓🚨 SEKATAN JALAN RAYA! Anda ditahan memandu/menunggang ${v.name} tanpa ${licLabel}! Anda didenda ${Utils.formatMoney(fineLocal, s.countryId)} dan kenderaan anda DISITA oleh pihak berkuasa!`,
            'warning'
          );
          GameState.save();
          return {
            ok: false,
            impounded: true,
            msg: `Kantoi Sekatan Jalan Raya tanpa ${licLabel}! Didenda ${Utils.formatMoney(fineLocal, s.countryId)} & ${v.name} disita!`
          };
        }

        GameState.addJournalEntry(
          `🚓 SEKATAN JALAN RAYA! Anda ditahan memandu/menunggang ${v.name} tanpa ${licLabel} sah dan dikenakan saman berat ${Utils.formatMoney(fineLocal, s.countryId)}.`,
          'warning'
        );
        GameState.save();
        return {
          ok: false,
          msg: `Ditahan di Sekatan Jalan Raya tanpa ${licLabel}! Saman ${Utils.formatMoney(fineLocal, s.countryId)} dikenakan.`
        };
      }
    }

    // 2) Risiko kerosakan / kemalangan jika kondisi kenderaan rendah (< 35%)
    if (v.condition < 35 && Utils.chance(0.52)) {
      const repairBill = Math.max(Utils.usdToLocal(280, s.countryId), Math.round(v.value * 0.11));
      s.money -= repairBill;
      GameState.adjustStats({ health: -Utils.randInt(8, 16), happiness: -10 });
      if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: 12 });
      GameState.addJournalEntry(
        `💥🔧 KEMALANGAN KECIL & ROSAK TERUK! ${v.name} yang uzur gagal berfungsi dengan baik di jalan raya — anda cedera ringan dan terpaksa menanggung bil tunda serta pembaikan ${Utils.formatMoney(repairBill, s.countryId)}.`,
        'warning'
      );
      GameState.save();
      return {
        ok: false,
        msg: `${v.name} mengalami kerosakan/kemalangan kerana kondisi terlalu rendah! Kos baiki: ${Utils.formatMoney(repairBill, s.countryId)}.`
      };
    }

    // Perjalanan lancar & menenangkan
    GameState.adjustStats({ happiness: Utils.randInt(6, 11) });
    if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: -Utils.randInt(6, 11) });
    const illegalNote = (!hasLic && reqType) ? ' (Mujur tidak terserempak sekatan jalan raya walaupun tiada lesen!)' : '';
    GameState.addJournalEntry(
      `🛣️ Anda bersiar-siar mengambil angin bersama ${v.icon} ${v.name} di sekitar ${s.city}${illegalNote}. Fikiran terasa lebih segar dan tenang!`,
      'culture'
    );
    GameState.save();
    return {
      ok: true,
      msg: `Seronok bersiar-siar dengan ${v.name}! Fikiran kembali tenang.`
    };
  },

  familyOutingWithVehicle(uid) {
    const s = GameState.current;
    this.ensureFields(s);
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Tidak boleh membawa keluarga berjalan semasa dalam tahanan.' };
    const v = s.assets.vehicles.find(x => x.uid === uid);
    if (!v) return { ok: false, msg: 'Kenderaan tidak ditemui.' };
    if (!this.hasMatchingLicense(s, v)) {
      const req = this.getRequiredLicenseType(v);
      return { ok: false, msg: `Anda memerlukan ${req === 'moto' ? 'Lesen Motosikal' : 'Lesen Kereta'} sah untuk membawa keluarga atau pasangan.` };
    }
    if (s.yearlyActions.vehFamilyOuting) {
      return { ok: false, msg: 'Anda sudah membawa keluarga atau pasangan berjalan-jalan tahun ini.' };
    }

    const lovedOnes = (s.relationships || []).filter(r => r.alive && (r.id === s.partnerId || r.category === 'family' || r.category === 'spouse' || r.category === 'partner'));
    if (lovedOnes.length === 0) {
      return { ok: false, msg: 'Tiada ahli keluarga atau pasangan aktif untuk dibawa berjalan-jalan.' };
    }

    s.yearlyActions.vehFamilyOuting = true;
    v.condition = Utils.clamp((v.condition || 80) - Utils.randInt(2, 5), 5, 100);

    if (v.condition < 30 && Utils.chance(0.45)) {
      const towCost = Math.max(Utils.usdToLocal(200, s.countryId), Math.round(v.value * 0.08));
      s.money -= towCost;
      GameState.adjustStats({ happiness: -6 });
      if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: 8 });
      GameState.addJournalEntry(
        `🛠️ Perjalanan bersama keluarga menaiki ${v.name} tergendala apabila kenderaan meragam di tepi jalan! Kos baiki kecemasan: ${Utils.formatMoney(towCost, s.countryId)}.`,
        'warning'
      );
      GameState.save();
      return { ok: false, msg: `${v.name} rosak di pertengahan jalan! Kos baiki: ${Utils.formatMoney(towCost, s.countryId)}.` };
    }

    lovedOnes.forEach(r => {
      r.closeness = Utils.clamp((r.closeness ?? 70) + Utils.randInt(6, 11), 0, 100);
      if (typeof r.trust === 'number') r.trust = Utils.clamp(r.trust + 4, 0, 100);
    });
    GameState.adjustStats({ happiness: Utils.randInt(8, 13) });
    if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: -Utils.randInt(5, 9) });

    GameState.addJournalEntry(
      `🚗👨‍👩‍👧‍👦 Anda membawa insan tersayang berjalan-jalan menaiki ${v.icon} ${v.name}. Hubungan kekeluargaan dan kemesraan bertambah erat!`,
      'culture'
    );
    GameState.save();
    return {
      ok: true,
      msg: `Perjalanan hujung minggu menaiki ${v.name} mengeratkan hubungan keluarga & pasangan!`
    };
  },

  sideGigWithVehicle(uid) {
    const s = GameState.current;
    this.ensureFields(s);
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Tidak boleh melakukan kerja sambilan semasa dalam tahanan.' };
    const v = s.assets.vehicles.find(x => x.uid === uid);
    if (!v) return { ok: false, msg: 'Kenderaan tidak ditemui.' };

    const req = this.getRequiredLicenseType(v);
    if (!req || v.sub !== 'Darat') {
      return { ok: false, msg: 'Hanya motosikal atau kereta darat sesuai untuk kerja sambilan penghantaran dan e-hailing.' };
    }
    const minAge = req === 'moto' ? 16 : 18;
    if (s.age < minAge) {
      return { ok: false, msg: `Umur minimum untuk kerja sambilan ini ialah ${minAge} tahun.` };
    }
    if (!this.hasMatchingLicense(s, v)) {
      return { ok: false, msg: `Syarat pendaftaran memerlukan ${req === 'moto' ? 'Lesen Motosikal' : 'Lesen Kereta'} yang sah.` };
    }
    if ((v.condition || 0) < 40) {
      return { ok: false, msg: 'Kondisi kenderaan terlalu rendah untuk kerja sambilan. Sila servis kenderaan anda dahulu.' };
    }
    if (s.yearlyActions.vehSideGig) {
      return { ok: false, msg: 'Anda sudah melakukan kerja sambilan kenderaan tahun ini.' };
    }

    s.yearlyActions.vehSideGig = true;
    const isMoto = req === 'moto';
    const earnUsd = isMoto ? Utils.randInt(950, 2100) : Utils.randInt(1800, 3800);
    const earnLocal = Math.max(50, Utils.usdToLocal(earnUsd, s.countryId));
    const wear = Utils.randInt(7, 13);

    s.money += earnLocal;
    v.condition = Utils.clamp((v.condition || 80) - wear, 5, 100);
    GameState.adjustStats({ health: -Utils.randInt(2, 5) });
    if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: Utils.randInt(5, 9) });

    const roleName = isMoto ? 'Penghantar Makanan / Barangan (Rider)' : 'Pemandu E-Hailing Sambilan';
    GameState.addJournalEntry(
      `🛵💵 Kerja Sambilan (${roleName}) menggunakan ${v.name}: Anda memperoleh pendapatan tambahan ${Utils.formatMoney(earnLocal, s.countryId)} hasil titik peluh di jalan raya.`,
      'culture'
    );
    GameState.save();
    return {
      ok: true,
      earnLocal,
      msg: `Kerja sambilan selesai! Anda memperoleh ${Utils.formatMoney(earnLocal, s.countryId)}.`
    };
  },

  // --------------------------------------------------------------------------
  // 4. TINDAKAN PELABURAN (BELI / JUAL 25% / 50% / 100% / AMAUN + CUKAI JUALAN 2.5%)
  // --------------------------------------------------------------------------
  buyInvestment(instId, amountLocal) {
    const s = GameState.current;
    this.ensureFields(s);
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Akaun dagangan disekat semasa di penjara.' };
    const inst = AssetsData.INVESTMENTS.find(x => x.id === instId);
    if (!inst) return { ok: false, msg: 'Instrumen tidak ditemui.' };
    const mPrice = (s.assetMarket.invPrices[instId] && s.assetMarket.invPrices[instId].price)
      || this._scaleUsdToLocal(inst.baseUnitUsd, s.countryId, false);

    const spend = Math.min(s.money, Math.round(amountLocal));
    if (spend <= 0 || s.money < spend) return { ok: false, msg: 'Baki tunai tidak mencukupi untuk melabur.' };

    const unitsBought = spend / mPrice;
    const prev = s.assets.portfolio[instId] || { units: 0, totalCost: 0 };
    prev.units += unitsBought;
    prev.totalCost += spend;
    s.assets.portfolio[instId] = prev;
    s.money -= spend;

    GameState.addJournalEntry(`📈 Anda melabur ${Utils.formatMoney(spend, s.countryId)} dalam ${inst.icon} ${inst.name}.`);
    GameState.save();
    return { ok: true, msg: `Berjaya melabur ${Utils.formatMoney(spend, s.countryId)} dalam ${inst.name}!` };
  },

  sellInvestment(instId, sellFraction = 1) {
    const s = GameState.current;
    this.ensureFields(s);
    const pos = s.assets.portfolio[instId];
    if (!pos || pos.units <= 0) return { ok: false, msg: 'Anda tidak memegang pelaburan ini.' };
    const inst = AssetsData.INVESTMENTS.find(x => x.id === instId);
    const prev = this.previewAssetSale(s, 'investment', instId, sellFraction);
    if (!prev) return { ok: false, msg: 'Gagal mengira jualan pelaburan.' };

    const frac = prev.sellFraction;
    const unitsSold = pos.units * frac;
    const costPortion = prev.costPortion;
    const profit = prev.netProceeds - costPortion;

    s.money += prev.netProceeds;
    if (frac >= 0.99) {
      delete s.assets.portfolio[instId];
    } else {
      pos.units -= unitsSold;
      pos.totalCost -= costPortion;
    }

    GameState.addJournalEntry(
      `💵 Jualan Pelaburan (${Math.round(frac * 100)}% ${inst ? inst.name : instId}): Harga Kasar ${Utils.formatMoney(prev.grossPrice, s.countryId)} — Potongan Cukai Jualan Aset (2.5%: -${Utils.formatMoney(prev.saleTax, s.countryId)}) → Tunai Bersih Diterima: ${Utils.formatMoney(prev.netProceeds, s.countryId)} (${profit >= 0 ? 'Untung Bersih +' : 'Rugi Bersih '}${Utils.formatMoney(profit, s.countryId)}).`,
      profit >= 0 ? 'milestone' : 'warning'
    );
    GameState.save();
    return {
      ok: true,
      breakdown: prev,
      msg: `Jualan berjaya! Tunai bersih: ${Utils.formatMoney(prev.netProceeds, s.countryId)} (selepas Cukai Jualan 2.5%).`
    };
  },

  // --------------------------------------------------------------------------
  // 5. KOLEKSI, LELONGAN MISTERI & PUSAKA KELUARGA (HEIRLOOMS)
  // --------------------------------------------------------------------------
  GLOBAL_PROPERTIES_CATALOG: [
    { id: 'gp_jp_ryokan',   countryId: 'JP', flag: '🇯🇵', countryName: 'Jepun',        name: 'Ryokan Tradisional Kyoto',     icon: '🏯', baseUsd: 680000,  yieldPct: 6.2, tag: '📈 Lokasi Pelancongan' },
    { id: 'gp_us_loft',     countryId: 'US', flag: '🇺🇸', countryName: 'AS',           name: 'Loft Mewah Manhattan',         icon: '🏙️', baseUsd: 1450000, yieldPct: 5.5, tag: '✨ Pegangan Bebas' },
    { id: 'gp_gb_town',     countryId: 'GB', flag: '🇬🇧', countryName: 'UK',           name: 'Townhouse Kensington London',  icon: '🏘️', baseUsd: 1850000, yieldPct: 4.8, tag: '✨ Pegangan Bebas' },
    { id: 'gp_ch_chalet',   countryId: 'CH', flag: '🇨🇭', countryName: 'Switzerland',  name: 'Chalet Alpine Zermatt',        icon: '🏔️', baseUsd: 2200000, yieldPct: 5.0, tag: '📈 Lokasi Pelancongan' },
    { id: 'gp_it_villa',    countryId: 'IT', flag: '🇮🇹', countryName: 'Itali',        name: 'Vila Tuscany & Ladang Anggur', icon: '🏡', baseUsd: 950000,  yieldPct: 5.8, tag: '📈 Lokasi Pelancongan' },
    { id: 'gp_fr_paris',    countryId: 'FR', flag: '🇫🇷', countryName: 'Perancis',     name: 'Apartmen Haussmann Paris',     icon: '🗼', baseUsd: 1250000, yieldPct: 4.9, tag: '✨ Pegangan Bebas' },
    { id: 'gp_sg_condo',    countryId: 'SG', flag: '🇸🇬', countryName: 'Singapura',    name: 'Penthouse Marina Bay',         icon: '🏢', baseUsd: 2600000, yieldPct: 4.5, tag: '✨ Pegangan Bebas' },
    { id: 'gp_au_sydney',   countryId: 'AU', flag: '🇦🇺', countryName: 'Australia',    name: 'Vila Pinggir Pantai Bondi',    icon: '🏖️', baseUsd: 1350000, yieldPct: 5.4, tag: '📈 Lokasi Pelancongan' },
    { id: 'gp_ae_dubai',    countryId: 'AE', flag: '🇦🇪', countryName: 'UAE',          name: 'Vila Palm Jumeirah Dubai',     icon: '🌴', baseUsd: 2900000, yieldPct: 6.5, tag: '✨ Pegangan Bebas' },
    { id: 'gp_bs_island',   countryId: 'BS', flag: '🇧🇸', countryName: 'Bahamas',      name: 'Vila Persendirian Nassau',     icon: '🏝️', baseUsd: 1750000, yieldPct: 6.0, tag: '📈 Lokasi Pelancongan' }
  ],

  GLOBAL_VEHICLES_CATALOG: [
    { id: 'gv_jp_jdm',      countryId: 'JP', flag: '🇯🇵', countryName: 'Jepun',        name: 'JDM Klasik Skyline GT-R',      icon: '🏎️', baseUsd: 145000, upkeepPct: 0.03 },
    { id: 'gv_it_super',    countryId: 'IT', flag: '🇮🇹', countryName: 'Itali',        name: 'Supercar V12 Maranello',       icon: '🏎️', baseUsd: 420000, upkeepPct: 0.04 },
    { id: 'gv_us_muscle',   countryId: 'US', flag: '🇺🇸', countryName: 'AS',           name: 'Muscle Car V8 Klasik 1969',    icon: '🚗', baseUsd: 115000, upkeepPct: 0.03 },
    { id: 'gv_de_coupe',    countryId: 'DE', flag: '🇩🇪', countryName: 'Jerman',       name: 'Coupe Mewah Stuttgart GT',     icon: '🚘', baseUsd: 230000, upkeepPct: 0.035 },
    { id: 'gv_gb_gt',       countryId: 'GB', flag: '🇬🇧', countryName: 'UK',           name: 'Grand Tourer Klasik Britain',  icon: '🚘', baseUsd: 285000, upkeepPct: 0.035 }
  ],

  ensureGlobalMarkets(s) {
    if (!s || !s.assetMarket) return;
    const m = s.assetMarket;
    if (!Array.isArray(m.globalProperties) || m.globalProperties.length === 0) {
      const pool = this.GLOBAL_PROPERTIES_CATALOG.filter(x => x.countryId !== s.countryId);
      const picked = [...pool].sort(() => Math.random() - 0.5).slice(0, Utils.randInt(3, 5));
      m.globalProperties = picked.map((tpl, i) => {
        const basePrice = Math.round(Utils.usdToLocal(tpl.baseUsd, s.countryId) * (0.92 + Math.random() * 0.16));
        return {
          lid: `gp_${s.year}_${i}_${tpl.id}`,
          tplId: tpl.id,
          countryId: tpl.countryId,
          flag: tpl.flag,
          countryName: tpl.countryName,
          name: tpl.name,
          icon: tpl.icon,
          price: basePrice,
          dutyFee: Math.round(basePrice * 0.05),
          totalCost: Math.round(basePrice * 1.05),
          yieldPct: tpl.yieldPct,
          upkeep: Math.round(basePrice * 0.012),
          tag: tpl.tag
        };
      });
    }
    if (!Array.isArray(m.globalVehicles) || m.globalVehicles.length === 0) {
      const pool = this.GLOBAL_VEHICLES_CATALOG.filter(x => x.countryId !== s.countryId);
      const picked = [...pool].sort(() => Math.random() - 0.5).slice(0, Utils.randInt(2, 3));
      m.globalVehicles = picked.map((tpl, i) => {
        const basePrice = Math.round(Utils.usdToLocal(tpl.baseUsd, s.countryId) * (0.94 + Math.random() * 0.14));
        return {
          lid: `gv_${s.year}_${i}_${tpl.id}`,
          tplId: tpl.id,
          countryId: tpl.countryId,
          flag: tpl.flag,
          countryName: tpl.countryName,
          name: tpl.name,
          icon: tpl.icon,
          price: basePrice,
          importFee: Math.round(basePrice * 0.12),
          totalCost: Math.round(basePrice * 1.12),
          upkeep: Math.round(basePrice * tpl.upkeepPct)
        };
      });
    }
  },

  buyGlobalProperty(listingId) {
    const s = GameState.current;
    this.ensureFields(s);
    this.ensureGlobalMarkets(s);
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Tidak tersedia ketika di penjara.' };
    const item = (s.assetMarket.globalProperties || []).find(x => x.lid === listingId);
    if (!item) return { ok: false, msg: 'Tawaran hartanah luar negara tidak ditemui.' };
    if (s.money < item.totalCost) {
      return { ok: false, msg: `Baki tidak mencukupi — jumlah kos (termasuk Duti Pembeli Asing & Broker 5%) ialah ${Utils.formatMoney(item.totalCost, s.countryId)}.` };
    }
    s.money -= item.totalCost;
    s.assets.properties.push({
      uid: `prop_glb_${Date.now()}_${Utils.randInt(10, 99)}`,
      id: item.tplId,
      name: `${item.flag} ${item.name}`,
      icon: item.icon,
      assetCountry: item.countryId,
      assetCountryName: item.countryName,
      assetCountryFlag: item.flag,
      purchasePrice: item.price,
      value: item.price,
      mortgage: 0,
      annualMortgage: 0,
      upkeep: item.upkeep,
      yieldPct: item.yieldPct,
      rented: false,
      condition: 95,
      isGlobal: true
    });
    s.assetMarket.globalProperties = s.assetMarket.globalProperties.filter(x => x.lid !== listingId);
    GameState.adjustStats({ happiness: 8 });
    GameState.addJournalEntry(`🌍 Anda membeli hartanah luar negara ${item.flag} ${item.name} (${item.countryName}) dengan jumlah kos ${Utils.formatMoney(item.totalCost, s.countryId)} (termasuk Duti Asing & Broker 5%).`, 'milestone');
    GameState.save();
    return { ok: true, msg: `${item.flag} ${item.name} berjaya dibeli!` };
  },

  buyGlobalVehicle(listingId) {
    const s = GameState.current;
    this.ensureFields(s);
    this.ensureGlobalMarkets(s);
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Tidak tersedia ketika di penjara.' };
    const item = (s.assetMarket.globalVehicles || []).find(x => x.lid === listingId);
    if (!item) return { ok: false, msg: 'Tawaran kenderaan import tidak ditemui.' };
    if (s.money < item.totalCost) {
      return { ok: false, msg: `Baki tidak mencukupi — jumlah kos (termasuk Caj Import & Penghantaran 12%) ialah ${Utils.formatMoney(item.totalCost, s.countryId)}.` };
    }
    s.money -= item.totalCost;
    s.assets.vehicles.push({
      uid: `veh_glb_${Date.now()}_${Utils.randInt(10, 99)}`,
      id: item.tplId,
      name: `${item.flag} ${item.name}`,
      icon: item.icon,
      originCountry: item.countryId,
      originCountryName: item.countryName,
      originFlag: item.flag,
      purchasePrice: item.price,
      value: item.price,
      upkeep: item.upkeep,
      condition: 98,
      isGlobal: true
    });
    s.assetMarket.globalVehicles = s.assetMarket.globalVehicles.filter(x => x.lid !== listingId);
    GameState.adjustStats({ happiness: 7 });
    GameState.addJournalEntry(`🌍 Anda mengimport kenderaan ${item.flag} ${item.name} (${item.countryName}) dengan jumlah kos ${Utils.formatMoney(item.totalCost, s.countryId)} (termasuk Caj Import 12%).`, 'culture');
    GameState.save();
    return { ok: true, msg: `${item.flag} ${item.name} berjaya diimport!` };
  },

  MAX_PERSONAL_COLLECTIBLES: 10,

  _getOwnedCollectibleKeys(s) {
    const set = new Set();
    if (!s) return set;
    const add = (x) => {
      if (!x) return;
      if (x.tplId) set.add(x.tplId);
      if (x.id) set.add(x.id);
      if (x.name) set.add(x.name);
    };
    ((s.assets && s.assets.collectibles) || []).forEach(add);
    ((s.familyTrust && s.familyTrust.assets) || []).filter(x => x && x.trustAssetType === 'collectible').forEach(add);
    return set;
  },

  buyCollectible(listingId) {
    const s = GameState.current;
    this.ensureFields(s);
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Tidak tersedia ketika di penjara.' };
    if ((s.assets.collectibles || []).length >= this.MAX_PERSONAL_COLLECTIBLES) {
      return { ok: false, msg: `Peti besi koleksi peribadi penuh (${s.assets.collectibles.length}/${this.MAX_PERSONAL_COLLECTIBLES}). Jual atau lelong item lama dahulu.` };
    }
    const item = s.assetMarket.collectibles.find(x => x.lid === listingId);
    if (!item) return { ok: false, msg: 'Item koleksi tidak ditemui.' };
    if (!item.isMystery) {
      const owned = this._getOwnedCollectibleKeys(s);
      if (owned.has(item.tplId) || owned.has(item.name)) {
        return { ok: false, msg: 'Anda sudah memiliki jenis koleksi ini (had 1 unit bagi setiap jenis).' };
      }
    }
    if (s.money < item.price) return { ok: false, msg: `Perlukan ${Utils.formatMoney(item.price, s.countryId)}.` };

    s.money -= item.price;
    let finalValue = item.price;
    let finalName = item.name;
    let mysteryNote = '';

    // Lelongan Misteri: peluang jackpot 2.5x–4x ATAU risiko barang tiruan (0.25x)!
    if (item.isMystery) {
      if (Utils.chance(0.62)) {
        const mult = 2.2 + Math.random() * 1.8;
        finalValue = Math.round(item.price * mult);
        finalName = 'Khazanah Antik Tulen (Lelongan Misteri)';
        mysteryNote = ` 🌟 JACKPOT LELONGAN! Penilai mengesahkan ia artifak tulen bernilai ${Utils.formatMoney(finalValue, s.countryId)}!`;
      } else {
        finalValue = Math.round(item.price * 0.25);
        finalName = 'Replika Antik (Lelongan Misteri)';
        mysteryNote = ` 💥 ALAMAK! Penilai mengesahkan ia replika tiruan bernilai hanya ${Utils.formatMoney(finalValue, s.countryId)}!`;
      }
    }

    const col = {
      uid: `col_${Date.now()}_${Utils.randInt(10, 99)}`,
      tplId: item.tplId,
      name: finalName,
      icon: item.icon,
      purchasePrice: item.price,
      value: finalValue,
      appRate: item.appRate || 0.06,
      prestige: item.prestige || 4,
      isHeirloom: false,
      ageInGenerations: 1
    };
    s.assets.collectibles.push(col);
    s.assetMarket.collectibles = s.assetMarket.collectibles.filter(x => x.lid !== listingId);

    GameState.adjustStats({ happiness: 9 });
    GameState.addJournalEntry(`${col.icon} Anda memperoleh ${col.name} (${Utils.formatMoney(item.price, s.countryId)}).${mysteryNote}`, item.isMystery ? 'milestone' : 'culture');
    GameState.save();
    return { ok: true, msg: mysteryNote ? mysteryNote.trim() : `${col.name} ditambah ke koleksi anda!` };
  },

  toggleHeirloom(uid) {
    const s = GameState.current;
    this.ensureFields(s);
    const c = s.assets.collectibles.find(x => x.uid === uid);
    if (!c) return { ok: false, msg: 'Koleksi tidak ditemui.' };
    c.isHeirloom = !c.isHeirloom;
    if (c.isHeirloom && window.Dynasty) Dynasty.adjustReputation(3);
    GameState.addJournalEntry(
      c.isHeirloom
        ? `👑 Anda mengisytiharkan ${c.icon} ${c.name} sebagai PUSAKA KELUARGA yang akan diwarisi merentas generasi!`
        : `📦 ${c.name} dikeluarkan daripada senarai Pusaka Keluarga.`,
      'milestone'
    );
    GameState.save();
    return { ok: true, msg: c.isHeirloom ? 'Ditandakan sebagai Pusaka Keluarga!' : 'Status Pusaka dikeluarkan.' };
  },

  getCollectibleDisplayFinances(s, col) {
    if (!s || !col) return { royaltyRatePct: 2.5, insuranceRatePct: 0.5, annualRoyalty: 0, annualInsurance: 0, netRoyalty: 0 };
    const val = Math.max(0, Math.round(col.value || 0));
    const royaltyRate = 0.025;
    const insuranceRate = 0.005;
    const capNet = Utils.usdToLocal(500000, s.countryId || 'MY');
    const rawNet = Math.max(0, Math.round(val * (royaltyRate - insuranceRate)));
    const netRoyalty = Math.min(capNet, rawNet);
    const annualInsurance = Math.min(Math.round(capNet * 0.25), Math.max(0, Math.round(val * insuranceRate)));
    const annualRoyalty = netRoyalty + annualInsurance;
    return {
      royaltyRatePct: 2.5,
      insuranceRatePct: 0.5,
      annualRoyalty,
      annualInsurance,
      netRoyalty
    };
  },

  applyCollectibleYearlyAppreciation(s, col) {
    if (!s || !col) return;
    const curVal = Math.max(0, Math.round(col.value || 0));
    if (curVal <= 0) return;
    const tmpl = (window.AssetsData && Array.isArray(AssetsData.COLLECTIBLES))
      ? AssetsData.COLLECTIBLES.find(x => x.id === col.id)
      : null;
    const baseUsd = (tmpl && tmpl.baseUsd)
      ? tmpl.baseUsd
      : Math.max(500, Math.round((window.Utils && Utils.localToUsd) ? Utils.localToUsd(col.purchasePrice || curVal, s.countryId) : (curVal / 4.5)));
    const maxLocalVal = Utils.usdToLocal(baseUsd * 10, s.countryId || 'MY');
    // Bekukan pertumbuhan (0%) jika nilai save lama sudah melepasi siling 10x harga asas USD
    if (curVal >= maxLocalVal) return;
    const rate = Utils.clamp(Number(col.appRate) || 0.025, 0.01, 0.04);
    col.value = Math.min(maxLocalVal, Math.round(curVal * (1 + rate)));
  },

  displayCollectible(uid) {
    const s = GameState.current;
    this.ensureFields(s);
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Tidak boleh menguruskan pameran galeri semasa dalam tahanan.' };
    const c = s.assets.collectibles.find(x => x.uid === uid);
    if (!c) return { ok: false, msg: 'Koleksi tidak ditemui.' };
    c.isDisplayed = !c.isDisplayed;
    const fin = this.getCollectibleDisplayFinances(s, c);
    if (c.isDisplayed) {
      GameState.addJournalEntry(
        `🏛️ Anda mempamerkan ${c.icon} ${c.name} di galeri awam (Royalti ~${Utils.formatMoney(fin.annualRoyalty, s.countryId)}/thn, Insurans ${Utils.formatMoney(fin.annualInsurance, s.countryId)}/thn).`,
        'milestone'
      );
    } else {
      GameState.addJournalEntry(`📦 Anda menarik balik ${c.icon} ${c.name} daripada pameran galeri.`);
    }
    GameState.save();
    return {
      ok: true,
      msg: c.isDisplayed
        ? `${c.name} kini dipamerkan di galeri!`
        : `${c.name} ditarik balik daripada pameran.`
    };
  },

  sellCollectible(uid) {
    const s = GameState.current;
    this.ensureFields(s);
    const idx = s.assets.collectibles.findIndex(x => x.uid === uid);
    if (idx < 0) return { ok: false, msg: 'Koleksi tidak ditemui.' };
    const col = s.assets.collectibles[idx];
    const prev = this.previewAssetSale(s, 'collectible', uid);
    s.money += prev.netProceeds;
    s.assets.collectibles.splice(idx, 1);
    GameState.addJournalEntry(
      `🔨 Jualan Koleksi (${col.name}): Harga Kasar ${Utils.formatMoney(prev.grossPrice, s.countryId)} — Potongan Cukai Jualan Aset (2.5%: -${Utils.formatMoney(prev.saleTax, s.countryId)}) → Tunai Bersih Diterima: ${Utils.formatMoney(prev.netProceeds, s.countryId)}!`,
      'milestone'
    );
    GameState.save();
    return {
      ok: true,
      breakdown: prev,
      msg: `Berjaya dijual! Tunai bersih diterima: ${Utils.formatMoney(prev.netProceeds, s.countryId)} (selepas Cukai Jualan 2.5%).`
    };
  },

  // --------------------------------------------------------------------------
  // 6. RINGKASAN NILAI BERSIH, ALIRAN TUNAI PASIF & KEMASKINI TAHUNAN
  // --------------------------------------------------------------------------
  getAssetCashflowSummary(s) {
    this.ensureFields(s);
    let propVal = 0, vehVal = 0, invVal = 0, colVal = 0;
    let totalMortgage = 0, mortgagePayment = 0, rentalGross = 0, dividendGross = 0, maintenanceCost = 0;
    let cukaiPintuAnnual = 0, cukaiTanahAnnual = 0;

    for (const p of s.assets.properties) {
      if (!p || p.inTrust || p.isInTrust || p.inFoundation || p.owner === 'trust') continue;
      const pv = p.value || 0;
      propVal += pv;
      totalMortgage += (p.mortgage || 0);
      if (p.mortgage > 0) mortgagePayment += Math.min(p.mortgage, p.annualMortgage || Math.round(p.mortgage / 15));
      if (p.rented) rentalGross += Math.round(pv * ((p.yieldPct || 5.5) / 100));
      maintenanceCost += (p.upkeep || 0);
      cukaiPintuAnnual += Math.round(pv * 0.0035);
      cukaiTanahAnnual += Math.round(pv * 0.0015);
    }

    for (const v of s.assets.vehicles) {
      if (!v || v.inTrust || v.isInTrust || v.inFoundation || v.owner === 'trust') continue;
      vehVal += (v.value || 0);
      maintenanceCost += (v.upkeep || 0);
    }

    for (const [instId, pos] of Object.entries(s.assets.portfolio || {})) {
      if (!pos || pos.units <= 0 || pos.inTrust || pos.isInTrust || pos.inFoundation || pos.owner === 'trust') continue;
      const inst = AssetsData.INVESTMENTS.find(x => x.id === instId);
      const mPrice = (s.assetMarket.invPrices[instId] && s.assetMarket.invPrices[instId].price)
        || this._scaleUsdToLocal(inst ? inst.baseUnitUsd : 100, s.countryId, false);
      const curVal = Math.round(pos.units * mPrice);
      invVal += curVal;
      if (inst && inst.divPct > 0) {
        dividendGross += Math.round(curVal * inst.divPct);
      }
    }

    let displayRoyaltyGross = 0, displayInsuranceCost = 0;
    for (const c of s.assets.collectibles) {
      if (!c || c.inTrust || c.isInTrust || c.inFoundation || c.owner === 'trust') continue;
      colVal += (c.value || 0);
      if (c.isDisplayed) {
        const fin = this.getCollectibleDisplayFinances(s, c);
        displayRoyaltyGross += fin.annualRoyalty;
        displayInsuranceCost += fin.annualInsurance;
      }
    }

    const totalPropertyTaxAnnual = cukaiPintuAnnual + cukaiTanahAnnual;
    const totalAssetValue = propVal + vehVal + invVal + colVal + (s.investments || 0);
    const totalDebt = totalMortgage + ((s.education && s.education.educationLoan) || 0) + (s.assets.unpaidTaxDebt || 0);
    const netPassiveAnnual = rentalGross + dividendGross + displayRoyaltyGross - maintenanceCost - displayInsuranceCost - mortgagePayment - totalPropertyTaxAnnual;

    return {
      propVal, vehVal, invVal, colVal,
      totalAssetValue, totalMortgage, totalDebt,
      rentalGross, dividendGross, displayRoyaltyGross, displayInsuranceCost, maintenanceCost, mortgagePayment,
      cukaiPintuAnnual, cukaiTanahAnnual, totalPropertyTaxAnnual,
      netPassiveAnnual
    };
  },

  tickYearlyAssets(s, c) {
    this.ensureFields(s);
    // 1) Jana trend pasaran & harga baharu tahun ini
    this.generateYearlyMarket(s, { isRefresh: false });
    const trend = this.getTrendObj(s);

    // 2) Kemas kini Hartanah (hargai pasaran, Cukai Pintu & Cukai Tanah, Aset Busuk, sewa, ansuran bank & peristiwa penyewa)
    const propShift = trend.propertyShift[0] + Math.random() * (trend.propertyShift[1] - trend.propertyShift[0]);
    let totalCukaiPintu = 0;
    let totalCukaiTanah = 0;

    for (const p of s.assets.properties) {
      p.yearsHeld = (p.yearsHeld || 0) + 1;

      // Dedahkan "Aset Busuk" yang belum terbongkar pada Age-Up ini
      if (p.isLemon && !p.lemonRevealed) {
        this.revealLemonAsset(s, p, 'property');
      }

      // Kira Cukai Pintu (0.35%) & Cukai Tanah (0.15%) berdasarkan nilai semasa hartanah
      const pintu = Math.round((p.value || 0) * 0.0035);
      const tanah = Math.round((p.value || 0) * 0.0015);
      totalCukaiPintu += pintu;
      totalCukaiTanah += tanah;

      // Aset Busuk naik nilai lebih perlahan (-4% penalti pertumbuhan setiap tahun)
      const lemonPenalty = p.isLemon ? -0.04 : 0;
      const condFactor = p.condition >= 80 ? 1.02 : (p.condition <= 50 ? 0.96 : 1.0);
      p.value = Math.max(1000, Math.round(p.value * (1 + propShift + lemonPenalty) * condFactor));
      const wearDrop = p.rented ? Utils.randInt(6, 12) : Utils.randInt(4, 9);
      p.condition = Utils.clamp((typeof p.condition === 'number' ? p.condition : 80) - wearDrop - (p.isLemon ? 2 : 0), 0, 100);

      // Penyewa mengadu & terus keluar jika kondisi rumah jatuh <= 50%
      if (p.rented && p.condition <= 50) {
        p.rented = false;
        GameState.adjustStats({ happiness: -Utils.randInt(5, 8) });
        if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: Utils.randInt(6, 10) });
        GameState.addJournalEntry(
          `🏠⚠️ Penyewa di ${p.name} mengadu keadaan rumah terlalu uzur dan terus keluar berpindah. Anda kehilangan pendapatan sewa!`,
          'warning'
        );
      }

      // Bil pembaikan mengejut bagi Aset Busuk (30% peluang setahun)
      if (p.isLemon && Utils.chance(0.30)) {
        const surpriseBill = Math.max(Utils.usdToLocal(350, s.countryId), Math.round(p.value * (0.03 + Math.random() * 0.03)));
        s.money -= surpriseBill;
        GameState.addJournalEntry(
          `🛠️ Bil Pembaikan Mengejut (${p.name} — Aset Bermasalah): Kos membaiki ${p.lemonFlaw || 'kerosakan struktur'} menelan belanja ${Utils.formatMoney(surpriseBill, s.countryId)}!`,
          'warning'
        );
      }

      // Bayar ansuran pinjaman bank
      if (p.mortgage > 0) {
        const pay = Math.min(p.mortgage, p.annualMortgage || Math.round(p.mortgage / 15));
        s.money -= pay;
        p.mortgage = Math.max(0, p.mortgage - pay);
        if (p.mortgage === 0) {
          GameState.addJournalEntry(`🎉 Pinjaman bank untuk ${p.name} telah DILUNASKAN sepenuhnya!`, 'milestone');
        }
      }

      // Peristiwa penyewa rawak (18% peluang)
      if (p.rented && Utils.chance(0.18)) {
        const r = Math.random();
        if (r < 0.45) {
          p.condition = Utils.clamp(p.condition + 4, 0, 100);
          GameState.addJournalEntry(`😊 Penyewa ${p.name} sangat bertanggungjawab — membayar tepat masa dan menjaga rumah dengan bersih!`);
        } else if (r < 0.75) {
          const repair = Math.round(p.value * 0.025);
          s.money -= repair;
          p.condition = Utils.clamp(p.condition - 8, 10, 100);
          GameState.addJournalEntry(`🔧 Penyewa ${p.name} menyebabkan kerosakan kecil — kos pembaikan ${Utils.formatMoney(repair, s.countryId)}.`, 'warning');
        } else {
          const lateLoss = Math.round(p.value * 0.02);
          s.money -= lateLoss;
          GameState.addJournalEntry(`⚠️ Penyewa ${p.name} lewat membayar sewa beberapa bulan (-${Utils.formatMoney(lateLoss, s.countryId)}).`, 'warning');
        }
      }
    }

    // Tolak Cukai Pintu (0.35%) & Cukai Tanah (0.15%) untuk semua hartanah dimiliki
    const totalHoldingTax = totalCukaiPintu + totalCukaiTanah;
    if (totalHoldingTax > 0) {
      s.money -= totalHoldingTax;
      if (s.money < 0) {
        const unpaid = Math.min(totalHoldingTax, Math.abs(s.money));
        s.assets.unpaidTaxDebt = (s.assets.unpaidTaxDebt || 0) + unpaid;
        GameState.addJournalEntry(
          `🏛️⚠️ Cukai Hartanah Tahunan (${s.assets.properties.length} hartanah): Cukai Pintu (0.35%: ${Utils.formatMoney(totalCukaiPintu, s.countryId)}) + Cukai Tanah (0.15%: ${Utils.formatMoney(totalCukaiTanah, s.countryId)}) = ${Utils.formatMoney(totalHoldingTax, s.countryId)}. Baki tunai negatif — tunggakan cukai ${Utils.formatMoney(unpaid, s.countryId)} ditambah ke hutang tertunggak!`,
          'warning'
        );
      } else {
        GameState.addJournalEntry(
          `🏛️ Cukai Hartanah Tahunan (${s.assets.properties.length} hartanah): Cukai Pintu (0.35%: ${Utils.formatMoney(totalCukaiPintu, s.countryId)}) + Cukai Tanah (0.15%: ${Utils.formatMoney(totalCukaiTanah, s.countryId)}) = -${Utils.formatMoney(totalHoldingTax, s.countryId)} ditolak secara automatik.`
        );
      }
    }

    // 3) Kemas kini Kenderaan (Insurans/Cukai Jalan/Minyak, Susut Nilai, Kondisi -6 hingga -14 & Kelebihan Pasif)
    const isDetained = Boolean(s.prison && s.prison.inPrison);
    let totalVehicleUpkeep = 0;
    let hasWorkingLicensedVehicle = false;
    let hasLuxuryWorking = false;

    for (const v of s.assets.vehicles) {
      if (v.isLemon && !v.lemonRevealed) {
        this.revealLemonAsset(s, v, 'vehicle');
      }
      v.ageYrs = (v.ageYrs || 0) + 1;
      const wearDrop = Utils.randInt(v.isLemon ? 9 : 6, 14);
      v.condition = Utils.clamp((v.condition || 80) - wearDrop, 5, 100);

      if (v.classic && v.condition >= 75 && !v.isLemon) {
        v.value = Math.round(v.value * (1 + 0.05 + Math.random() * 0.04));
      } else {
        const baseDep = Math.max(0.04, v.depRate || 0.09);
        const effDep = v.isLemon ? Math.min(0.32, baseDep * 1.65) : baseDep;
        v.value = Math.max(500, Math.round(v.value * (1 - effDep)));
      }

      const annualVehUpkeep = Math.max(0, Math.round(v.upkeep || 0));
      totalVehicleUpkeep += annualVehUpkeep;

      if (v.condition >= 40 && this.hasMatchingLicense(s, v)) {
        hasWorkingLicensedVehicle = true;
      }
      if (v.condition >= 45 && (v.looksBonus || 0) >= 6) {
        hasLuxuryWorking = true;
      }

      if ((v.isLemon && Utils.chance(0.38)) || (v.condition < 30 && Utils.chance(0.35))) {
        const fix = Math.max(Utils.usdToLocal(250, s.countryId), Math.round(v.value * (v.isLemon ? 0.16 : 0.12)));
        s.money -= fix;
        GameState.addJournalEntry(
          v.isLemon
            ? `🛠️ Bil Pembaikan Mengejut (${v.name} — Aset Bermasalah): Kerosakan ${v.lemonFlaw || 'enjin'} memerlukan pembaikan segera bernilai ${Utils.formatMoney(fix, s.countryId)}!`
            : `🛠️ ${v.name} rosak di tepi jalan kerana kurang servis! Kos tunda & baiki: ${Utils.formatMoney(fix, s.countryId)}.`,
          'warning'
        );
      }
    }

    // Tolak kos tahunan insurans, cukai jalan & minyak secara telus jika memiliki kenderaan
    if (s.assets.vehicles.length > 0 && totalVehicleUpkeep > 0 && !isDetained) {
      s.money -= totalVehicleUpkeep;
      GameState.addJournalEntry(
        `⛽ Kos Kenderaan Tahunan (${s.assets.vehicles.length} kenderaan — insurans, cukai jalan & minyak): -${Utils.formatMoney(totalVehicleUpkeep, s.countryId)}.`
      );
    }

    // Kelebihan pasif memiliki kenderaan berfungsi dengan lesen sah
    if (!isDetained) {
      if (hasWorkingLicensedVehicle && (s.job || s.activeSpecialMode) && s.alignment) {
        s.alignment.stress = Utils.clamp((s.alignment.stress || 0) - Utils.randInt(2, 4), 0, 100);
      }
      if (hasLuxuryWorking && window.KarmaEndings) {
        KarmaEndings.adjustAlignment({ fame: Utils.randInt(1, 2) });
      }
    }

    // 4) Kemas kini Koleksi & Pusaka Keluarga (had kenaikan 1%–4%/thn + siling 10x + royalti pameran)
    let personalDisplayedCount = 0;
    for (const col of s.assets.collectibles) {
      this.applyCollectibleYearlyAppreciation(s, col);
      if (col.isDisplayed) {
        const fin = this.getCollectibleDisplayFinances(s, col);
        if (s.money < fin.annualInsurance) {
          col.isDisplayed = false;
          GameState.addJournalEntry(
            `🏛️⚠️ Pameran ${col.name} di galeri dibatalkan secara automatik kerana baki tidak mencukupi untuk kos penjagaan & insurans (${Utils.formatMoney(fin.annualInsurance, s.countryId)}). Barang telah ditarik balik.`,
            'warning'
          );
        } else {
          s.money -= fin.annualInsurance;
          s.money += fin.annualRoyalty;
          personalDisplayedCount++;
          GameState.addJournalEntry(
            `🏛️ Royalti Pameran Galeri (${col.name}): +${Utils.formatMoney(fin.netRoyalty, s.countryId)} bersih (Insurans: -${Utils.formatMoney(fin.annualInsurance, s.countryId)}).`
          );
        }
      }
    }
    if (personalDisplayedCount > 0 && window.KarmaEndings) {
      KarmaEndings.adjustAlignment({ fame: 1 });
    }
  },

  // Pembekuan/rampasan aset tempatan jika menjadi Pelarian atau penjara jenayah berat
  handleCrimeAssetFreeze(s) {
    this.ensureFields(s);
    if (s.assets.properties.length > 0 && Utils.chance(0.30)) {
      const seized = s.assets.properties.pop();
      GameState.addJournalEntry(`🚨 RAMPASAN ASET! Pihak berkuasa membekukan dan menyita ${seized.name} (${Utils.formatMoney(seized.value, s.countryId)}) akibat siasatan jenayah!`, 'warning');
    }
  },

  // --------------------------------------------------------------------------
  // 7. PEWARISAN ASET & PUSAKA KELUARGA RENTAS GENERASI
  // --------------------------------------------------------------------------
  transferInheritanceToHeir(parent, heirState) {
    if (!parent || !heirState) return;
    this.ensureFields(parent);
    this.ensureFields(heirState);

    // Pindahkan hartanah, kenderaan, portfolio pelaburan & koleksi (termasuk Pusaka Keluarga!)
    heirState.assets.properties = (parent.assets.properties || []).map(p => ({
      ...p,
      value: Utils.convertMoney(p.value, parent.countryId, heirState.countryId),
      purchasePrice: Utils.convertMoney(p.purchasePrice || p.value, parent.countryId, heirState.countryId),
      mortgage: Utils.convertMoney(p.mortgage || 0, parent.countryId, heirState.countryId),
      annualMortgage: Utils.convertMoney(p.annualMortgage || 0, parent.countryId, heirState.countryId),
      upkeep: Utils.convertMoney(p.upkeep || 0, parent.countryId, heirState.countryId),
      countryId: heirState.countryId
    }));

    heirState.assets.vehicles = (parent.assets.vehicles || []).map(v => ({
      ...v,
      value: Utils.convertMoney(v.value, parent.countryId, heirState.countryId),
      purchasePrice: Utils.convertMoney(v.purchasePrice || v.value, parent.countryId, heirState.countryId),
      upkeep: Utils.convertMoney(v.upkeep || 0, parent.countryId, heirState.countryId)
    }));

    heirState.assets.portfolio = JSON.parse(JSON.stringify(parent.assets.portfolio || {}));

    let heirloomCount = 0;
    heirState.assets.collectibles = (parent.assets.collectibles || []).map(col => {
      const nextGenAge = (col.ageInGenerations || 1) + (col.isHeirloom ? 1 : 0);
      const historicMult = col.isHeirloom ? 1.15 : 1.0; // +15% nilai sejarah setiap generasi bertahan!
      if (col.isHeirloom) heirloomCount += 1;
      return {
        ...col,
        ageInGenerations: nextGenAge,
        value: Math.round(Utils.convertMoney(col.value, parent.countryId, heirState.countryId) * historicMult)
      };
    });

    if (heirloomCount > 0 && window.Dynasty) {
      Dynasty.adjustReputation(Math.min(10, heirloomCount * 3));
    }
    return {
      props: heirState.assets.properties.length,
      vehs: heirState.assets.vehicles.length,
      cols: heirState.assets.collectibles.length,
      heirlooms: heirloomCount
    };
  }
};
