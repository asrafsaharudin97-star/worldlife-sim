/* ==========================================================================
   WorldLife — Antara Muka Hab Aset, Hartanah, Kenderaan, Pelaburan & Pusaka
   Bahasa Melayu (Responsif Mudah Alih & Desktop)
   ========================================================================== */

window.AssetModals = {
  _activeTab: 'portfolio',
  _vehSubTab: 'new',

  showHub(subTab = null) {
    const s = GameState.current;
    if (!s) return;
    AssetsEngine.ensureFields(s);
    if (s.assetMarket.lastYear !== s.year || s.assetMarket.properties.length === 0) {
      AssetsEngine.generateYearlyMarket(s, { isRefresh: false });
    }
    if (subTab) this._activeTab = subTab;
    const tab = this._activeTab;
    const c = Utils.getCountry(s.countryId);
    const sum = AssetsEngine.getAssetCashflowSummary(s);
    const netWorth = GameState.getNetWorth();
    const trend = AssetsEngine.getTrendObj(s);
    const rLeft = s.assetMarket.refreshesLeft ?? 2;

    const headerHtml = `
      <div class="summary-grid" style="margin-bottom:8px;">
        <div class="summary-stat">
          <span class="lbl">Jumlah Nilai Aset</span>
          <span class="val">${Utils.formatMoney(sum.totalAssetValue, s.countryId, true)}</span>
        </div>
        <div class="summary-stat">
          <span class="lbl">Pendapatan Pasif/Thn</span>
          <span class="val" style="color:${sum.rentalGross + sum.dividendGross > 0 ? '#16a34a' : '#334155'};">+${Utils.formatMoney(sum.rentalGross + sum.dividendGross, s.countryId, true)}</span>
        </div>
        <div class="summary-stat">
          <span class="lbl">Baki Pinjaman</span>
          <span class="val" style="color:${sum.totalDebt > 0 ? '#dc2626' : '#16a34a'};">${Utils.formatMoney(sum.totalDebt, s.countryId, true)}</span>
        </div>
        <div class="summary-stat">
          <span class="lbl">Nilai Bersih (${c.currency.code})</span>
          <span class="val">${Utils.formatMoney(netWorth, s.countryId, true)}</span>
        </div>
      </div>

      <div class="info-banner" style="border-left:4px solid ${trend.color};padding:8px 10px;margin-bottom:8px;">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;">
          <span><strong>${trend.icon} ${Utils.escapeHtml(trend.label)}</strong></span>
          <button type="button" class="reroll-idea-btn" id="btn-refresh-asset-market" style="padding:4px 9px;font-size:11px;" ${rLeft <= 0 ? 'disabled' : ''}>
            🔄 Segarkan Pasaran (${rLeft}/2)
          </button>
        </div>
        <div style="font-size:11.5px;margin-top:4px;opacity:0.9;">${Utils.escapeHtml(trend.headline)}</div>
      </div>

      <div class="tab-pills" style="margin-bottom:10px;">
        <button type="button" class="tab-pill asset-tab-pill ${tab === 'portfolio' ? 'active' : ''}" data-atab="portfolio">📊 Portfolio Saya</button>
        <button type="button" class="tab-pill asset-tab-pill ${tab === 'realestate' ? 'active' : ''}" data-atab="realestate">🏠 Hartanah</button>
        <button type="button" class="tab-pill asset-tab-pill ${tab === 'vehicles' ? 'active' : ''}" data-atab="vehicles">🚗 Kenderaan</button>
        <button type="button" class="tab-pill asset-tab-pill ${tab === 'investments' ? 'active' : ''}" data-atab="investments">📈 Pelaburan</button>
        <button type="button" class="tab-pill asset-tab-pill ${tab === 'collectibles' ? 'active' : ''}" data-atab="collectibles">💎 Koleksi</button>
      </div>
    `;

    let body = '';
    if (tab === 'portfolio') body = this._renderPortfolioTab(s, c);
    else if (tab === 'realestate') body = this._renderRealEstateTab(s, c);
    else if (tab === 'vehicles') body = this._renderVehiclesTab(s, c);
    else if (tab === 'investments') body = this._renderInvestmentsTab(s, c);
    else body = this._renderCollectiblesTab(s, c);

    Modals.open({
      icon: '🏛️',
      title: 'Aset, Pelaburan & Kekayaan',
      subtitle: `Tunai: ${Utils.formatMoney(s.money, s.countryId, true)} • ${c.flag} ${c.name}`,
      bodyHtml: headerHtml + body
    });

    this._bindHandlers(s, c, tab);
  },

  // --------------------------------------------------------------------------
  // TAB 1: PORTFOLIO SAYA (URUS SEMUA ASET DIMILIKI)
  // --------------------------------------------------------------------------
  _renderPortfolioTab(s, c) {
    let html = '';
    const hasAny = s.assets.properties.length > 0
      || s.assets.vehicles.length > 0
      || Object.keys(s.assets.portfolio || {}).length > 0
      || s.assets.collectibles.length > 0;

    if (!hasAny) {
      return `<div class="info-banner highlight">📊 Portfolio anda masih kosong! Mula bina kekayaan dengan membeli <strong>Hartanah</strong>, <strong>Kenderaan</strong>, <strong>Pelaburan</strong> atau <strong>Koleksi</strong> pada tab di atas.</div>`;
    }

    // 1) Hartanah Dimiliki
    if (s.assets.properties.length > 0) {
      html += `<div class="section-heading">🏠 Hartanah Dimiliki (${s.assets.properties.length})</div>`;
      s.assets.properties.forEach(p => {
        const estRent = Math.round(p.value * ((p.yieldPct || 5.5) / 100));
        html += `
          <div class="migration-card">
            <div class="mig-head">
              <div class="mig-title">${p.icon} ${Utils.escapeHtml(p.name)} ${p.rented ? '<span class="cat-badge synergy">🔑 Disewakan</span>' : ''}</div>
              <strong style="color:#16a34a;">${Utils.formatMoney(p.value, s.countryId, true)}</strong>
            </div>
            <div style="font-size:11.5px;color:#475569;margin-bottom:6px;">
              Keadaan: <strong>${p.condition}%</strong> • Sewa: <strong>${Utils.formatMoney(estRent, s.countryId, true)}/thn</strong>
              ${p.mortgage > 0 ? `<br/>🏦 Baki Pinjaman Bank: <strong style="color:#dc2626;">${Utils.formatMoney(p.mortgage, s.countryId, true)}</strong> (Ansuran ${Utils.formatMoney(p.annualMortgage, s.countryId, true)}/thn)` : ' • ✅ Bebas Hutang'}
            </div>
            <div class="mig-actions" style="grid-template-columns:repeat(4,1fr);">
              <button type="button" class="btn-sm primary prop-rent-btn" data-uid="${p.uid}">${p.rented ? 'Henti Sewa' : '🔑 Sewakan'}</button>
              <button type="button" class="btn-sm secondary prop-reno-btn" data-uid="${p.uid}">🔨 Ubah Suai</button>
              <button type="button" class="btn-sm secondary prop-maint-btn" data-uid="${p.uid}">🔧 Baiki</button>
              <button type="button" class="btn-sm secondary prop-sell-btn" data-uid="${p.uid}" style="color:#dc2626;">💵 Jual</button>
            </div>
          </div>
        `;
      });
    }

    // 2) Pelaburan Dimiliki
    const invEntries = Object.entries(s.assets.portfolio || {}).filter(([, pos]) => pos && pos.units > 0);
    if (invEntries.length > 0) {
      html += `<div class="section-heading">📈 Pegangan Pelaburan (${invEntries.length})</div>`;
      invEntries.forEach(([instId, pos]) => {
        const inst = AssetsData.INVESTMENTS.find(x => x.id === instId);
        const mPrice = (s.assetMarket.invPrices[instId] && s.assetMarket.invPrices[instId].price) || 100;
        const curVal = Math.round(pos.units * mPrice);
        const pl = curVal - Math.round(pos.totalCost);
        const plPct = pos.totalCost > 0 ? ((pl / pos.totalCost) * 100).toFixed(1) : '0.0';
        const avgBuy = Math.round(pos.totalCost / pos.units);

        html += `
          <div class="migration-card">
            <div class="mig-head">
              <div class="mig-title">${inst ? inst.icon : '📈'} ${Utils.escapeHtml(inst ? inst.name : instId)}</div>
              <strong style="color:${pl >= 0 ? '#16a34a' : '#dc2626'};">${Utils.formatMoney(curVal, s.countryId, true)} (${pl >= 0 ? '+' : ''}${plPct}%)</strong>
            </div>
            <div style="font-size:11.5px;color:#475569;margin-bottom:6px;">
              Harga Beli Purata: ${Utils.formatMoney(avgBuy, s.countryId)} • Harga Semasa: ${Utils.formatMoney(mPrice, s.countryId)} • Untung/Rugi: <strong style="color:${pl >= 0 ? '#16a34a' : '#dc2626'};">${pl >= 0 ? '+' : ''}${Utils.formatMoney(pl, s.countryId, true)}</strong>
            </div>
            <div class="mig-actions" style="grid-template-columns:repeat(3,1fr);">
              <button type="button" class="btn-sm secondary inv-sell-btn" data-inst="${instId}" data-frac="0.25">Jual 25%</button>
              <button type="button" class="btn-sm secondary inv-sell-btn" data-inst="${instId}" data-frac="0.5">Jual 50%</button>
              <button type="button" class="btn-sm primary inv-sell-btn" data-inst="${instId}" data-frac="1">Jual 100%</button>
            </div>
          </div>
        `;
      });
    }

    // 3) Kenderaan Dimiliki
    if (s.assets.vehicles.length > 0) {
      html += `<div class="section-heading">🚗 Kenderaan Dimiliki (${s.assets.vehicles.length})</div>`;
      s.assets.vehicles.forEach(v => {
        html += `
          <div class="migration-card">
            <div class="mig-head">
              <div class="mig-title">${v.icon} ${Utils.escapeHtml(v.name)} ${v.classic ? '<span class="cat-badge rare">⭐ Klasik</span>' : ''}</div>
              <strong>${Utils.formatMoney(v.value, s.countryId, true)}</strong>
            </div>
            <div style="font-size:11.5px;color:#475569;margin-bottom:6px;">
              Keadaan: <strong>${v.condition}%</strong> • Usia: ${v.ageYrs || 0} thn • Penyelenggaraan: ${Utils.formatMoney(v.upkeep || 0, s.countryId, true)}/thn
            </div>
            <div class="mig-actions">
              <button type="button" class="btn-sm primary veh-serv-btn" data-uid="${v.uid}">🔧 Servis &amp; Baiki</button>
              <button type="button" class="btn-sm secondary veh-sell-btn" data-uid="${v.uid}" style="color:#dc2626;">💵 Jual</button>
            </div>
          </div>
        `;
      });
    }

    // 4) Koleksi & Pusaka Keluarga
    if (s.assets.collectibles.length > 0) {
      html += `<div class="section-heading">💎 Koleksi &amp; Pusaka Keluarga (${s.assets.collectibles.length})</div>`;
      s.assets.collectibles.forEach(col => {
        html += `
          <div class="migration-card ${col.isHeirloom ? 'rare-activity' : ''}">
            <div class="mig-head">
              <div class="mig-title">${col.icon} ${Utils.escapeHtml(col.name)} ${col.isHeirloom ? `<span class="rare-gold-tag">👑 PUSAKA GEN ${col.ageInGenerations || 1}</span>` : ''}</div>
              <strong style="color:#16a34a;">${Utils.formatMoney(col.value, s.countryId, true)}</strong>
            </div>
            <div class="mig-actions" style="grid-template-columns:repeat(3,1fr);">
              <button type="button" class="btn-sm primary col-heir-btn" data-uid="${col.uid}">${col.isHeirloom ? '✓ Pusaka' : '👑 Jadikan Pusaka'}</button>
              <button type="button" class="btn-sm secondary col-disp-btn" data-uid="${col.uid}" ${s.yearlyActions.displayArt ? 'disabled' : ''}>🏛️ Pamerkan</button>
              <button type="button" class="btn-sm secondary col-sell-btn" data-uid="${col.uid}" style="color:#dc2626;">🔨 Lelong</button>
            </div>
          </div>
        `;
      });
    }

    return html;
  },

  // --------------------------------------------------------------------------
  // TAB 2: PASARAN HARTANAH (6–8 PENYENARAIAN RAWAK TAHUNAN)
  // --------------------------------------------------------------------------
  _renderRealEstateTab(s, c) {
    const list = s.assetMarket.properties || [];
    if (list.length === 0) return `<div class="info-banner">Semua hartanah tahun ini telah dibeli! Klik <strong>🔄 Segarkan Pasaran</strong> atau +UMUR.</div>`;

    return list.map(p => {
      const deposit = Math.round(p.price * 0.20);
      const estRent = Math.round(p.price * (p.yieldPct / 100));
      return `
        <div class="migration-card ${p.isAuction ? 'rare-activity' : ''}">
          <div class="mig-head">
            <div class="mig-title">${p.icon} ${Utils.escapeHtml(p.name)} ${p.isAuction ? '<span class="rare-gold-tag">🏷️ JUALAN LELONG!</span>' : ''}</div>
            <strong style="color:#1e293b;">${Utils.formatMoney(p.price, s.countryId, true)}</strong>
          </div>
          <div style="font-size:11.5px;color:#475569;margin-bottom:6px;">
            <span class="cat-badge">${p.sub}</span> Keadaan: <strong>${p.condition}% (${p.condLabel})</strong> • Anggaran Sewa: <strong style="color:#16a34a;">${Utils.formatMoney(estRent, s.countryId, true)}/thn (${p.yieldPct}%)</strong>
          </div>
          <div class="mig-actions">
            <button type="button" class="btn-sm primary prop-buy-cash" data-lid="${p.lid}">💵 Tunai (${Utils.formatMoney(p.price, s.countryId, true)})</button>
            <button type="button" class="btn-sm secondary prop-buy-mort" data-lid="${p.lid}">🏦 Pinjaman (Dep. ${Utils.formatMoney(deposit, s.countryId, true)})</button>
          </div>
        </div>
      `;
    }).join('');
  },

  // --------------------------------------------------------------------------
  // TAB 3: PENGEDAR KENDERAAN (BAHARU & TERPAKAI)
  // --------------------------------------------------------------------------
  _renderVehiclesTab(s, c) {
    const isUsed = this._vehSubTab === 'used';
    const list = isUsed ? (s.assetMarket.vehiclesUsed || []) : (s.assetMarket.vehiclesNew || []);

    let html = `
      <div class="tab-pills" style="margin-bottom:8px;">
        <button type="button" class="tab-pill veh-sub-pill ${!isUsed ? 'active' : ''}" data-vsub="new">✨ Kenderaan Baharu</button>
        <button type="button" class="tab-pill veh-sub-pill ${isUsed ? 'active' : ''}" data-vsub="used">🏷️ Terpakai (Used)</button>
      </div>
    `;

    if (list.length === 0) return html + `<div class="info-banner">Stok habis! Klik <strong>🔄 Segarkan Pasaran</strong> untuk stok baharu.</div>`;

    html += list.map(v => `
      <div class="migration-card">
        <div class="mig-head">
          <div class="mig-title">${v.icon} ${Utils.escapeHtml(v.name)} ${v.classic ? '<span class="cat-badge rare">⭐ Naik Nilai!</span>' : ''}</div>
          <strong>${Utils.formatMoney(v.price, s.countryId, true)}</strong>
        </div>
        <div style="font-size:11.5px;color:#475569;margin-bottom:6px;">
          <span class="cat-badge">${v.sub}</span> Keadaan: <strong>${v.condition}%</strong>
          ${v.used ? ` • Usia: ${v.ageYrs} thn • ${(v.mileageKm || 0).toLocaleString()} km` : ' • 0 km (Baharu)'}
        </div>
        <div class="mig-actions" style="grid-template-columns:1fr;">
          <button type="button" class="btn-sm primary veh-buy-btn" data-lid="${v.lid}" data-used="${isUsed ? '1' : '0'}">🚗 Beli (${Utils.formatMoney(v.price, s.countryId, true)})</button>
        </div>
      </div>
    `).join('');

    return html;
  },

  // --------------------------------------------------------------------------
  // TAB 4: PASARAN PELABURAN (15 INSTRUMEN DENGAN TREND LIVE)
  // --------------------------------------------------------------------------
  _renderInvestmentsTab(s, c) {
    const groups = [...new Set(AssetsData.INVESTMENTS.map(x => x.group))];
    let html = '';

    groups.forEach(grp => {
      html += `<div class="section-heading">📊 ${Utils.escapeHtml(grp)}</div>`;
      AssetsData.INVESTMENTS.filter(x => x.group === grp).forEach(inst => {
        const info = s.assetMarket.invPrices[inst.id] || { price: AssetsEngine._scaleUsdToLocal(inst.baseUnitUsd, s.countryId, false), changePct: 0 };
        const pos = s.assets.portfolio[inst.id];
        const heldVal = pos && pos.units > 0 ? Math.round(pos.units * info.price) : 0;
        const chColor = info.changePct >= 0 ? '#16a34a' : '#dc2626';

        html += `
          <div class="migration-card">
            <div class="mig-head">
              <div class="mig-title">${inst.icon} ${Utils.escapeHtml(inst.name)}</div>
              <span style="font-size:12px;font-weight:800;color:${chColor};">${Utils.formatMoney(info.price, s.countryId)} (${info.changePct >= 0 ? '+' : ''}${info.changePct}%)</span>
            </div>
            <div style="font-size:11.5px;color:#475569;margin-bottom:6px;">
              Risiko: <strong>${inst.risk}</strong>${inst.divPct > 0 ? ` • Dividen ~${(inst.divPct * 100).toFixed(1)}%/thn` : ''}${heldVal > 0 ? ` • Pegangan: <strong style="color:#16a34a;">${Utils.formatMoney(heldVal, s.countryId, true)}</strong>` : ''}<br/>
              ${Utils.escapeHtml(inst.desc)}
            </div>
            <div class="mig-actions" style="grid-template-columns:repeat(3,1fr);">
              <button type="button" class="btn-sm secondary inv-buy-btn" data-inst="${inst.id}" data-pct="0.10" ${s.money <= 0 ? 'disabled' : ''}>Labur 10%</button>
              <button type="button" class="btn-sm secondary inv-buy-btn" data-inst="${inst.id}" data-pct="0.25" ${s.money <= 0 ? 'disabled' : ''}>Labur 25%</button>
              <button type="button" class="btn-sm primary inv-buy-btn" data-inst="${inst.id}" data-pct="0.50" ${s.money <= 0 ? 'disabled' : ''}>Labur 50%</button>
            </div>
          </div>
        `;
      });
    });

    return html;
  },

  // --------------------------------------------------------------------------
  // TAB 5: BARANG MEWAH, SENI & LELONGAN MISTERI
  // --------------------------------------------------------------------------
  _renderCollectiblesTab(s, c) {
    const list = s.assetMarket.collectibles || [];
    if (list.length === 0) return `<div class="info-banner">Semua koleksi tahun ini sudah dibeli! Klik <strong>🔄 Segarkan Pasaran</strong>.</div>`;

    return list.map(col => `
      <div class="migration-card ${col.isMystery ? 'rare-activity' : ''}">
        <div class="mig-head">
          <div class="mig-title">${col.icon} ${Utils.escapeHtml(col.name)} ${col.isMystery ? '<span class="rare-gold-tag">🎁 LELONGAN EKSKLUSIF</span>' : ''}</div>
          <strong>${Utils.formatMoney(col.price, s.countryId, true)}</strong>
        </div>
        <div style="font-size:11.5px;color:#475569;margin-bottom:6px;">
          ${col.isMystery ? 'Peti misteri tertutup — potensi untung 2x–4x ATAU risiko barang tiruan!' : `Kenaikan nilai ~${Math.round(col.appRate * 100)}%/thn • Prestij Keluarga +${col.prestige}`}
        </div>
        <div class="mig-actions" style="grid-template-columns:1fr;">
          <button type="button" class="btn-sm primary col-buy-btn" data-lid="${col.lid}">💎 Beli (${Utils.formatMoney(col.price, s.countryId, true)})</button>
        </div>
      </div>
    `).join('');
  },

  // --------------------------------------------------------------------------
  // IKATAN PENDENGAR ACARA
  // --------------------------------------------------------------------------
  _bindHandlers(s, c, tab) {
    document.querySelectorAll('.asset-tab-pill').forEach(pill => {
      pill.addEventListener('click', () => this.showHub(pill.dataset.atab));
    });

    const refBtn = document.getElementById('btn-refresh-asset-market');
    if (refBtn) {
      refBtn.addEventListener('click', () => {
        const res = AssetsEngine.refreshMarket();
        App.toast(res.msg, res.ok ? 'culture' : 'error');
        this.showHub(tab);
      });
    }

    if (tab === 'portfolio') {
      document.querySelectorAll('.prop-rent-btn').forEach(b => b.addEventListener('click', () => {
        const r = AssetsEngine.toggleRentProperty(b.dataset.uid);
        App.toast(r.msg, r.ok ? 'success' : 'error'); App.renderAll(); this.showHub('portfolio');
      }));
      document.querySelectorAll('.prop-reno-btn').forEach(b => b.addEventListener('click', () => {
        const r = AssetsEngine.renovateProperty(b.dataset.uid);
        App.toast(r.msg, r.ok ? 'success' : 'error'); App.renderAll(); this.showHub('portfolio');
      }));
      document.querySelectorAll('.prop-maint-btn').forEach(b => b.addEventListener('click', () => {
        const r = AssetsEngine.maintainProperty(b.dataset.uid);
        App.toast(r.msg, r.ok ? 'success' : 'error'); App.renderAll(); this.showHub('portfolio');
      }));
      document.querySelectorAll('.prop-sell-btn').forEach(b => b.addEventListener('click', () => {
        const r = AssetsEngine.sellProperty(b.dataset.uid);
        App.toast(r.msg, r.ok ? 'success' : 'error'); App.renderAll(); this.showHub('portfolio');
      }));
      document.querySelectorAll('.veh-serv-btn').forEach(b => b.addEventListener('click', () => {
        const r = AssetsEngine.maintainVehicle(b.dataset.uid);
        App.toast(r.msg, r.ok ? 'success' : 'error'); App.renderAll(); this.showHub('portfolio');
      }));
      document.querySelectorAll('.veh-sell-btn').forEach(b => b.addEventListener('click', () => {
        const r = AssetsEngine.sellVehicle(b.dataset.uid);
        App.toast(r.msg, r.ok ? 'success' : 'error'); App.renderAll(); this.showHub('portfolio');
      }));
      document.querySelectorAll('.inv-sell-btn').forEach(b => b.addEventListener('click', () => {
        const r = AssetsEngine.sellInvestment(b.dataset.inst, Number(b.dataset.frac));
        App.toast(r.msg, r.ok ? 'success' : 'error'); App.renderAll(); this.showHub('portfolio');
      }));
      document.querySelectorAll('.col-heir-btn').forEach(b => b.addEventListener('click', () => {
        const r = AssetsEngine.toggleHeirloom(b.dataset.uid);
        App.toast(r.msg, r.ok ? 'success' : 'error'); App.renderAll(); this.showHub('portfolio');
      }));
      document.querySelectorAll('.col-disp-btn').forEach(b => b.addEventListener('click', () => {
        const r = AssetsEngine.displayCollectible(b.dataset.uid);
        App.toast(r.msg, r.ok ? 'success' : 'error'); App.renderAll(); this.showHub('portfolio');
      }));
      document.querySelectorAll('.col-sell-btn').forEach(b => b.addEventListener('click', () => {
        const r = AssetsEngine.sellCollectible(b.dataset.uid);
        App.toast(r.msg, r.ok ? 'success' : 'error'); App.renderAll(); this.showHub('portfolio');
      }));
    } else if (tab === 'realestate') {
      document.querySelectorAll('.prop-buy-cash').forEach(b => b.addEventListener('click', () => {
        const r = AssetsEngine.buyProperty(b.dataset.lid, false);
        App.toast(r.msg, r.ok ? 'success' : 'error'); App.renderAll(); this.showHub('realestate');
      }));
      document.querySelectorAll('.prop-buy-mort').forEach(b => b.addEventListener('click', () => {
        const r = AssetsEngine.buyProperty(b.dataset.lid, true);
        App.toast(r.msg, r.ok ? 'success' : 'error'); App.renderAll(); this.showHub('realestate');
      }));
    } else if (tab === 'vehicles') {
      document.querySelectorAll('.veh-sub-pill').forEach(p => p.addEventListener('click', () => {
        this._vehSubTab = p.dataset.vsub;
        this.showHub('vehicles');
      }));
      document.querySelectorAll('.veh-buy-btn').forEach(b => b.addEventListener('click', () => {
        const r = AssetsEngine.buyVehicle(b.dataset.lid, b.dataset.used === '1');
        App.toast(r.msg, r.ok ? 'success' : 'error'); App.renderAll(); this.showHub('vehicles');
      }));
    } else if (tab === 'investments') {
      document.querySelectorAll('.inv-buy-btn').forEach(b => b.addEventListener('click', () => {
        const spend = Math.round(s.money * Number(b.dataset.pct));
        const r = AssetsEngine.buyInvestment(b.dataset.inst, spend);
        App.toast(r.msg, r.ok ? 'success' : 'error'); App.renderAll(); this.showHub('investments');
      }));
    } else if (tab === 'collectibles') {
      document.querySelectorAll('.col-buy-btn').forEach(b => b.addEventListener('click', () => {
        const r = AssetsEngine.buyCollectible(b.dataset.lid);
        App.toast(r.msg, r.ok ? 'success' : 'error'); App.renderAll(); this.showHub('collectibles');
      }));
    }
  }
};
