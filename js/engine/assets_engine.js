/* ==========================================================================
   WorldLife — Enjin Aset, Pasaran Dinamik, Pinjaman Bank, Pelaburan,
   Pusaka Keluarga (Heirlooms) & Pewarisan Rentas Generasi (Bahasa Melayu)
   ========================================================================== */

window.AssetsEngine = {
  MAX_MARKET_REFRESHES: 2,

  ensureFields(s) {
    if (!s) return;
    if (!s.assets || typeof s.assets !== 'object') {
      s.assets = { properties: [], vehicles: [], collectibles: [], portfolio: {} };
    }
    if (!Array.isArray(s.assets.properties)) s.assets.properties = [];
    if (!Array.isArray(s.assets.vehicles)) s.assets.vehicles = [];
    if (!Array.isArray(s.assets.collectibles)) s.assets.collectibles = [];
    if (!s.assets.portfolio || typeof s.assets.portfolio !== 'object') s.assets.portfolio = {};

    // Kekalkan medan ringkas untuk setiap hartanah/kenderaan lama
    s.assets.properties.forEach((p, idx) => {
      if (!p.uid) p.uid = `prop_mig_${idx}_${Date.now()}`;
      if (typeof p.condition !== 'number') p.condition = 85;
      if (typeof p.mortgage !== 'number') p.mortgage = 0;
      if (typeof p.annualMortgage !== 'number') p.annualMortgage = 0;
      if (typeof p.rented !== 'boolean') p.rented = false;
      if (typeof p.yieldPct !== 'number') p.yieldPct = 5.5;
      if (typeof p.purchasePrice !== 'number') p.purchasePrice = p.value || 0;
    });
    s.assets.vehicles.forEach((v, idx) => {
      if (!v.uid) v.uid = `veh_mig_${idx}_${Date.now()}`;
      if (typeof v.condition !== 'number') v.condition = 82;
      if (typeof v.purchasePrice !== 'number') v.purchasePrice = v.value || 0;
    });

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
    AssetsData.INVESTMENTS.forEach(inst => {
      const prev = m.invPrices[inst.id];
      const basePrice = this._scaleUsdToLocal(inst.baseUnitUsd, s.countryId, false);
      if (!prev || opts.isRefresh) {
        if (!prev) m.invPrices[inst.id] = { price: basePrice, changePct: 0 };
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
      const nextPrice = Math.max(Math.round(basePrice * 0.12), Math.round(prev.price * (1 + pct)));
      m.invPrices[inst.id] = { price: nextPrice, changePct: Number((pct * 100).toFixed(1)) };
    });

    // 4) Barang Mewah & Koleksi (5–6 pilihan + 20% peluang Lelongan Misteri!)
    const normalCols = shuffle(AssetsData.COLLECTIBLES.filter(c => !c.isMystery)).slice(0, 5);
    const mysteryTpl = AssetsData.COLLECTIBLES.find(c => c.isMystery);
    const colList = [...normalCols];
    if (mysteryTpl && Utils.chance(0.20)) colList.unshift(mysteryTpl);

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
  // 2. TINDAKAN HARTANAH (TUNAI / PINJAMAN BANK, SEWA, UBAH SUAI, BAIKI, JUAL)
  // --------------------------------------------------------------------------
  buyProperty(listingId, useMortgage = false) {
    const s = GameState.current;
    this.ensureFields(s);
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Tidak boleh membeli hartanah dari penjara.' };
    if (s.age < 18) return { ok: false, msg: 'Umur minimum membeli hartanah ialah 18 tahun.' };

    const item = s.assetMarket.properties.find(x => x.lid === listingId);
    if (!item) return { ok: false, msg: 'Penyenaraian hartanah tidak ditemui.' };

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

    if (s.money < downPay) {
      return { ok: false, msg: `Baki tidak mencukupi! Perlukan ${Utils.formatMoney(downPay, s.countryId)} (${useMortgage ? 'Deposit 20%' : 'Tunai penuh'}).` };
    }

    s.money -= downPay;
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
      countryId: s.countryId
    };
    s.assets.properties.push(prop);
    s.assetMarket.properties = s.assetMarket.properties.filter(x => x.lid !== listingId);

    if (item.prestige >= 7 && window.Dynasty) Dynasty.adjustReputation(Math.min(6, Math.round(item.prestige / 3)));
    GameState.adjustStats({ happiness: 10 });
    GameState.addJournalEntry(
      `🏠 Anda membeli ${prop.icon} ${prop.name} bernilai ${Utils.formatMoney(prop.value, s.countryId)} secara ${useMortgage ? `Pinjaman Bank (Deposit ${Utils.formatMoney(downPay, s.countryId)})` : 'Bayar Tunai'}!`,
      'milestone'
    );
    GameState.save();
    return { ok: true, msg: `Tahniah! Anda kini memiliki ${prop.name}!` };
  },

  toggleRentProperty(uid) {
    const s = GameState.current;
    this.ensureFields(s);
    const p = s.assets.properties.find(x => x.uid === uid);
    if (!p) return { ok: false, msg: 'Hartanah tidak ditemui.' };
    if (!p.rented && p.condition < 40) {
      return { ok: false, msg: 'Keadaan hartanah terlalu usang (<40%)! Baiki atau Ubah Suai dahulu sebelum disewakan.' };
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
    const p = s.assets.properties.find(x => x.uid === uid);
    if (!p) return { ok: false, msg: 'Hartanah tidak ditemui.' };
    const cost = Math.max(Utils.usdToLocal(250, s.countryId), Math.round(p.value * 0.03));
    if (s.money < cost) return { ok: false, msg: `Kos penyelenggaraan ialah ${Utils.formatMoney(cost, s.countryId)}.` };
    s.money -= cost;
    p.condition = Utils.clamp(p.condition + Utils.randInt(14, 24), 0, 100);
    GameState.save();
    return { ok: true, msg: `Hartanah diselenggara (Keadaan kini ${p.condition}%).` };
  },

  sellProperty(uid) {
    const s = GameState.current;
    this.ensureFields(s);
    const idx = s.assets.properties.findIndex(x => x.uid === uid);
    if (idx < 0) return { ok: false, msg: 'Hartanah tidak ditemui.' };
    const p = s.assets.properties[idx];
    const netProceeds = p.value - (p.mortgage || 0);
    s.money += netProceeds;
    s.assets.properties.splice(idx, 1);
    GameState.addJournalEntry(
      `💵 Anda menjual ${p.name} pada harga ${Utils.formatMoney(p.value, s.countryId)}${p.mortgage > 0 ? ` (tolak baki pinjaman ${Utils.formatMoney(p.mortgage, s.countryId)})` : ''} — tunai bersih ${Utils.formatMoney(netProceeds, s.countryId)}.`,
      'milestone'
    );
    GameState.save();
    return { ok: true, msg: `Terjual! Tunai bersih ${Utils.formatMoney(netProceeds, s.countryId)}.` };
  },

  // --------------------------------------------------------------------------
  // 3. TINDAKAN KENDERAAN (BELI BAHARU/TERPAKAI, SERVIS & JUAL)
  // --------------------------------------------------------------------------
  buyVehicle(listingId, isUsed = false) {
    const s = GameState.current;
    this.ensureFields(s);
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Tidak boleh membeli kenderaan dari penjara.' };
    if (s.age < 16) return { ok: false, msg: 'Umur minimum membeli kenderaan ialah 16 tahun.' };

    const arr = isUsed ? s.assetMarket.vehiclesUsed : s.assetMarket.vehiclesNew;
    const item = arr.find(x => x.lid === listingId);
    if (!item) return { ok: false, msg: 'Kenderaan tidak ditemui.' };
    if (s.money < item.price) return { ok: false, msg: `Perlukan ${Utils.formatMoney(item.price, s.countryId)}.` };

    s.money -= item.price;
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
      classic: Boolean(item.classic)
    };
    s.assets.vehicles.push(veh);
    if (isUsed) s.assetMarket.vehiclesUsed = s.assetMarket.vehiclesUsed.filter(x => x.lid !== listingId);
    else s.assetMarket.vehiclesNew = s.assetMarket.vehiclesNew.filter(x => x.lid !== listingId);

    if (veh.looksBonus > 0) GameState.adjustStats({ looks: Math.min(8, veh.looksBonus), happiness: 10 });
    if (veh.looksBonus >= 10 && window.Dynasty) Dynasty.adjustReputation(4);
    GameState.addJournalEntry(`🚗 Anda membeli ${veh.icon} ${veh.name} (${isUsed ? 'Terpakai' : 'Baharu'}) pada harga ${Utils.formatMoney(veh.value, s.countryId)}!`, 'milestone');
    GameState.save();
    return { ok: true, msg: `Tahniah! ${veh.name} kini milik anda!` };
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
    s.money += v.value;
    s.assets.vehicles.splice(idx, 1);
    GameState.addJournalEntry(`💵 Anda menjual ${v.name} dengan harga ${Utils.formatMoney(v.value, s.countryId)}.`);
    GameState.save();
    return { ok: true, msg: `Terjual dengan harga ${Utils.formatMoney(v.value, s.countryId)}!` };
  },

  // --------------------------------------------------------------------------
  // 4. TINDAKAN PELABURAN (BELI / JUAL 25% / 50% / 100% / AMAUN + UNTUNG/RUGI %)
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
    const mPrice = (s.assetMarket.invPrices[instId] && s.assetMarket.invPrices[instId].price)
      || this._scaleUsdToLocal(inst ? inst.baseUnitUsd : 100, s.countryId, false);

    const frac = Math.max(0.05, Math.min(1, Number(sellFraction) || 1));
    const unitsSold = pos.units * frac;
    const proceeds = Math.round(unitsSold * mPrice);
    const costPortion = Math.round(pos.totalCost * frac);
    const profit = proceeds - costPortion;

    s.money += proceeds;
    if (frac >= 0.99) {
      delete s.assets.portfolio[instId];
    } else {
      pos.units -= unitsSold;
      pos.totalCost -= costPortion;
    }

    GameState.addJournalEntry(
      `💵 Anda menjual ${Math.round(frac * 100)}% pegangan ${inst ? inst.name : instId} bernilai ${Utils.formatMoney(proceeds, s.countryId)} (${profit >= 0 ? 'Untung +' : 'Rugi '}${Utils.formatMoney(profit, s.countryId)}).`,
      profit >= 0 ? 'milestone' : 'warning'
    );
    GameState.save();
    return { ok: true, msg: `Jualan berjaya: ${Utils.formatMoney(proceeds, s.countryId)} (${profit >= 0 ? '+' : ''}${Utils.formatMoney(profit, s.countryId)})!` };
  },

  // --------------------------------------------------------------------------
  // 5. KOLEKSI, LELONGAN MISTERI & PUSAKA KELUARGA (HEIRLOOMS)
  // --------------------------------------------------------------------------
  buyCollectible(listingId) {
    const s = GameState.current;
    this.ensureFields(s);
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Tidak tersedia ketika di penjara.' };
    const item = s.assetMarket.collectibles.find(x => x.lid === listingId);
    if (!item) return { ok: false, msg: 'Item koleksi tidak ditemui.' };
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

  displayCollectible(uid) {
    const s = GameState.current;
    this.ensureFields(s);
    if (s.yearlyActions.displayArt) return { ok: false, msg: 'Anda sudah mempamerkan koleksi tahun ini.' };
    const c = s.assets.collectibles.find(x => x.uid === uid);
    if (!c) return { ok: false, msg: 'Koleksi tidak ditemui.' };
    s.yearlyActions.displayArt = true;
    const repGain = Math.min(8, Math.max(2, Math.round((c.prestige || 4) / 2) + (c.ageInGenerations || 1)));
    if (window.Dynasty) Dynasty.adjustReputation(repGain);
    if (window.KarmaEndings) KarmaEndings.adjustAlignment({ fame: 5 });
    GameState.adjustStats({ happiness: 8 });
    GameState.addJournalEntry(`🏛️ Anda mempamerkan ${c.icon} ${c.name} di galeri awam — Reputasi Keluarga +${repGain}%!`, 'milestone');
    GameState.save();
    return { ok: true, msg: `Pameran berjaya! Reputasi Keluarga +${repGain}%!` };
  },

  sellCollectible(uid) {
    const s = GameState.current;
    this.ensureFields(s);
    const idx = s.assets.collectibles.findIndex(x => x.uid === uid);
    if (idx < 0) return { ok: false, msg: 'Koleksi tidak ditemui.' };
    const col = s.assets.collectibles[idx];
    s.money += col.value;
    s.assets.collectibles.splice(idx, 1);
    GameState.addJournalEntry(`🔨 Anda melelong ${col.name} pada harga ${Utils.formatMoney(col.value, s.countryId)}!`, 'milestone');
    GameState.save();
    return { ok: true, msg: `Berjaya dilelong: ${Utils.formatMoney(col.value, s.countryId)}!` };
  },

  // --------------------------------------------------------------------------
  // 6. RINGKASAN NILAI BERSIH, ALIRAN TUNAI PASIF & KEMASKINI TAHUNAN
  // --------------------------------------------------------------------------
  getAssetCashflowSummary(s) {
    this.ensureFields(s);
    let propVal = 0, vehVal = 0, invVal = 0, colVal = 0;
    let totalMortgage = 0, mortgagePayment = 0, rentalGross = 0, dividendGross = 0, maintenanceCost = 0;

    for (const p of s.assets.properties) {
      propVal += (p.value || 0);
      totalMortgage += (p.mortgage || 0);
      if (p.mortgage > 0) mortgagePayment += Math.min(p.mortgage, p.annualMortgage || Math.round(p.mortgage / 15));
      if (p.rented) rentalGross += Math.round((p.value || 0) * ((p.yieldPct || 5.5) / 100));
      maintenanceCost += (p.upkeep || 0);
    }

    for (const v of s.assets.vehicles) {
      vehVal += (v.value || 0);
      maintenanceCost += (v.upkeep || 0);
    }

    for (const [instId, pos] of Object.entries(s.assets.portfolio || {})) {
      if (!pos || pos.units <= 0) continue;
      const inst = AssetsData.INVESTMENTS.find(x => x.id === instId);
      const mPrice = (s.assetMarket.invPrices[instId] && s.assetMarket.invPrices[instId].price)
        || this._scaleUsdToLocal(inst ? inst.baseUnitUsd : 100, s.countryId, false);
      const curVal = Math.round(pos.units * mPrice);
      invVal += curVal;
      if (inst && inst.divPct > 0) {
        dividendGross += Math.round(curVal * inst.divPct);
      }
    }

    for (const c of s.assets.collectibles) {
      colVal += (c.value || 0);
    }

    const totalAssetValue = propVal + vehVal + invVal + colVal + (s.investments || 0);
    const totalDebt = totalMortgage + ((s.education && s.education.educationLoan) || 0);
    const netPassiveAnnual = rentalGross + dividendGross - maintenanceCost - mortgagePayment;

    return {
      propVal, vehVal, invVal, colVal,
      totalAssetValue, totalMortgage, totalDebt,
      rentalGross, dividendGross, maintenanceCost, mortgagePayment,
      netPassiveAnnual
    };
  },

  tickYearlyAssets(s, c) {
    this.ensureFields(s);
    // 1) Jana trend pasaran & harga baharu tahun ini
    this.generateYearlyMarket(s, { isRefresh: false });
    const trend = this.getTrendObj(s);

    // 2) Kemas kini Hartanah (hargai pasaran, sewa, ansuran bank & peristiwa penyewa)
    const propShift = trend.propertyShift[0] + Math.random() * (trend.propertyShift[1] - trend.propertyShift[0]);
    for (const p of s.assets.properties) {
      const condFactor = p.condition >= 80 ? 1.02 : (p.condition < 45 ? 0.96 : 1.0);
      p.value = Math.max(1000, Math.round(p.value * (1 + propShift) * condFactor));
      p.condition = Utils.clamp(p.condition - Utils.randInt(2, 5), 10, 100);

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

    // 3) Kemas kini Kenderaan (susut nilai atau naik nilai bagi Kereta Klasik/Hypercar kondisi >= 80%!)
    for (const v of s.assets.vehicles) {
      v.ageYrs = (v.ageYrs || 0) + 1;
      v.condition = Utils.clamp(v.condition - Utils.randInt(4, 9), 5, 100);
      if (v.classic && v.condition >= 75) {
        v.value = Math.round(v.value * (1 + 0.05 + Math.random() * 0.04));
      } else {
        v.value = Math.max(500, Math.round(v.value * (1 - Math.max(0.03, v.depRate || 0.08))));
      }
      if (v.condition < 30 && Utils.chance(0.35)) {
        const fix = Math.max(Utils.usdToLocal(250, s.countryId), Math.round(v.value * 0.12));
        s.money -= fix;
        GameState.addJournalEntry(`🛠️ ${v.name} rosak di tepi jalan kerana kurang servis! Kos tunda & baiki: ${Utils.formatMoney(fix, s.countryId)}.`, 'warning');
      }
    }

    // 4) Kemas kini Koleksi & Pusaka Keluarga (naik nilai setiap tahun!)
    for (const col of s.assets.collectibles) {
      const heirBonus = col.isHeirloom ? 0.03 : 0;
      col.value = Math.round(col.value * (1 + (col.appRate || 0.06) + heirBonus));
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
