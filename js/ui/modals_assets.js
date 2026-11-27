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
    const netWorth = GameState.getPersonalNetWorth ? GameState.getPersonalNetWorth(s) : GameState.getNetWorth();
    const trend = AssetsEngine.getTrendObj(s);
    const rLeft = s.assetMarket.refreshesLeft ?? 2;

    const headerHtml = `
      <div class="summary-grid" style="margin-bottom:0;">
        <div class="summary-stat">
          <span class="lbl">Jumlah Nilai Aset</span>
          <span class="val">${Utils.formatMoney(sum.totalAssetValue, s.countryId, true)}</span>
        </div>
        <div class="summary-stat" id="btn-passive-breakdown" role="button" tabindex="0" style="cursor:pointer;border:1px solid #cbd5e1;" title="Klik untuk lihat pecahan pendapatan pasif">
          <span class="lbl">Pendapatan Pasif/Thn <span style="font-size:10px;opacity:0.75;">ℹ️</span></span>
          <span class="val" style="color:${(sum.rentalGross + sum.dividendGross + (sum.displayRoyaltyGross || 0)) > 0 ? '#16a34a' : '#334155'};">+${Utils.formatMoney(sum.rentalGross + sum.dividendGross + (sum.displayRoyaltyGross || 0), s.countryId, true)}</span>
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

      <div id="passive-breakdown-panel" class="info-banner hidden" style="background:#f8fafc;border-color:#cbd5e1;font-size:12px;line-height:1.65;margin-bottom:0;">
        <strong>📊 Pecahan Pendapatan Pasif Tahunan</strong><br/>
        🏠 Sewaan Hartanah: <strong style="color:#16a34a;">+${Utils.formatMoney(sum.rentalGross, s.countryId)}</strong><br/>
        📈 Dividen &amp; Faedah Pelaburan: <strong style="color:#16a34a;">+${Utils.formatMoney(sum.dividendGross, s.countryId)}</strong><br/>
        🏛️ Royalti Pameran Galeri: <strong style="color:#16a34a;">+${Utils.formatMoney(sum.displayRoyaltyGross || 0, s.countryId)}</strong><br/>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:4px 0;" />
        Jumlah Pendapatan Pasif/Thn: <strong style="color:#16a34a;">+${Utils.formatMoney(sum.rentalGross + sum.dividendGross + (sum.displayRoyaltyGross || 0), s.countryId)}</strong>
      </div>

      <div class="info-banner" style="border-left:4px solid ${trend.color};padding:8px 10px;margin-bottom:0;">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;">
          <span><strong>${trend.icon} ${Utils.escapeHtml(trend.label)}</strong></span>
          <button type="button" class="reroll-idea-btn" id="btn-refresh-asset-market" style="padding:4px 9px;font-size:11px;" ${rLeft <= 0 ? 'disabled' : ''}>
            🔄 Segarkan Pasaran (${rLeft}/2)
          </button>
        </div>
        <div style="font-size:11.5px;margin-top:4px;opacity:0.9;">${Utils.escapeHtml(trend.headline)}</div>
      </div>

      <div class="tab-pills" style="margin-bottom:0;">
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

    const layoutHtml = `
      <div class="assets-modal-layout">
        <div class="assets-modal-top">
          ${headerHtml}
        </div>
        <div class="assets-tab-scroll" id="assets-tab-scroll">
          ${body}
        </div>
      </div>
    `;

    Modals.open({
      icon: '🏛️',
      title: 'Aset, Pelaburan & Kekayaan',
      subtitle: `Tunai: ${Utils.formatMoney(s.money, s.countryId, true)} • ${c.flag} ${c.name}`,
      bodyHtml: layoutHtml
    });

    const scrollEl = document.getElementById('assets-tab-scroll');
    if (scrollEl) scrollEl.scrollTop = 0;

    this._bindHandlers(s, c, tab);
  },

  // --------------------------------------------------------------------------
  // TAB 1: PORTFOLIO SAYA (URUS SEMUA ASET DIMILIKI)
  // --------------------------------------------------------------------------
  _renderPortfolioTab(s, c) {
    let html = '';
    const invEntries = Object.entries(s.assets.portfolio || {}).filter(([, pos]) => pos && pos.units > 0);
    const hasAny = s.assets.properties.length > 0
      || s.assets.vehicles.length > 0
      || invEntries.length > 0
      || s.assets.collectibles.length > 0;

    if (!hasAny) {
      return `
        <div class="assets-portfolio-section">
          <div class="info-banner highlight">📊 Portfolio anda masih kosong! Mula bina kekayaan dengan membeli <strong>Hartanah</strong>, <strong>Kenderaan</strong>, <strong>Pelaburan</strong> atau <strong>Koleksi</strong> pada tab di atas.</div>
        </div>
      `;
    }

    // 1) Hartanah Dimiliki
    if (s.assets.properties.length > 0) {
      html += `<div class="assets-portfolio-section">`;
      html += `<div class="section-heading">🏠 Hartanah Dimiliki (${s.assets.properties.length})</div>`;
      s.assets.properties.forEach(p => {
        const estRent = Math.round(p.value * ((p.yieldPct || 5.5) / 100));
        const cukaiPintu = Math.round((p.value || 0) * 0.0035);
        const cukaiTanah = Math.round((p.value || 0) * 0.0015);
        const showLemon = Boolean(p.isLemon && p.lemonRevealed);
        html += `
          <div class="migration-card">
            <div class="mig-head">
              <div class="mig-title">
                ${p.icon} ${Utils.escapeHtml(p.name)}
                ${p.rented ? '<span class="cat-badge synergy">🔑 Disewakan</span>' : ''}
                ${showLemon ? '<span class="cat-badge" style="background:#fee2e2;color:#b91c1c;border:1px solid #fca5a5;">⚠️ Aset Bermasalah</span>' : ''}
              </div>
              <strong style="color:#16a34a;">${Utils.formatMoney(p.value, s.countryId, true)}</strong>
            </div>
            ${(() => {
              const cond = Utils.clamp(typeof p.condition === 'number' ? p.condition : 80, 0, 100);
              const barColor = cond > 65 ? '#22c55e' : cond > 50 ? '#eab308' : '#ef4444';
              const repairCost = AssetsEngine.getPropertyRepairCost(s, p);
              const resaleVal = AssetsEngine.getPropertyResalePrice(p);
              const inPrison = Boolean(s.prison && s.prison.inPrison);
              return `
            <div style="margin:6px 0;">
              <div class="ph-bar-lbl" style="font-size:11.5px;">
                <span>Kondisi Rumah</span>
                <strong style="color:${barColor};">${cond}%</strong>
              </div>
              <div class="mini-track" style="height:6px;"><div class="mini-fill" style="width:${cond}%;background:${barColor};"></div></div>
            </div>
            ${p.rented && cond >= 51 && cond <= 60 ? `<div style="font-size:11px;font-weight:700;color:#92400e;background:#fef3c7;border:1px solid #fde68a;border-radius:6px;padding:4px 7px;margin-bottom:6px;">⚠️ Penyewa mula mengadu — perlu diselenggara</div>` : ''}
            ${cond <= 50 ? `<div style="font-size:11px;font-weight:700;color:#991b1b;background:#fee2e2;border:1px solid #fca5a5;border-radius:6px;padding:4px 7px;margin-bottom:6px;">🚨 Keadaan rumah teruk (≤50%) — tidak boleh disewakan &amp; harga jualan jatuh!</div>` : ''}
            <div style="font-size:11.5px;color:#475569;margin-bottom:6px;">
              Nilai Pasaran: <strong>${Utils.formatMoney(p.value, s.countryId, true)}</strong> • Harga Jualan Sebenar: <strong style="color:${cond <= 50 ? '#dc2626' : '#0f172a'};">${Utils.formatMoney(resaleVal, s.countryId, true)}</strong><br/>
              Sewa: <strong>${p.rented ? `${Utils.formatMoney(estRent, s.countryId, true)}/thn` : 'Tidak Disewakan'}</strong> • Pegangan: ${p.yearsHeld || 0} thn<br/>
              🏛️ Cukai Pintu (0.35%): <strong>${Utils.formatMoney(cukaiPintu, s.countryId)}/thn</strong> • Cukai Tanah (0.15%): <strong>${Utils.formatMoney(cukaiTanah, s.countryId)}/thn</strong>
              ${showLemon ? `<br/><span style="color:#b91c1c;font-weight:700;">⚠️ Isu: ${Utils.escapeHtml(p.lemonFlaw || 'Kerosakan tersembunyi')} (Kos senggara tinggi)</span>` : ''}
              ${p.mortgage > 0 ? `<br/>🏦 Baki Pinjaman Bank: <strong style="color:#dc2626;">${Utils.formatMoney(p.mortgage, s.countryId, true)}</strong> (Ansuran ${Utils.formatMoney(p.annualMortgage, s.countryId, true)}/thn)` : ' • ✅ Bebas Hutang'}
            </div>
            <div class="mig-actions" style="grid-template-columns:repeat(2,1fr);gap:6px;">
              <button type="button" class="btn-sm primary prop-rent-btn" data-uid="${p.uid}" ${inPrison ? 'disabled' : ''}>${p.rented ? 'Henti Sewa' : '🔑 Sewakan'}</button>
              <button type="button" class="btn-sm secondary prop-maint-btn" data-uid="${p.uid}" ${inPrison || cond >= 100 ? 'disabled' : ''}>🔧 Baik Pulih &amp; Selenggara${cond < 100 ? ` (${Utils.formatMoney(repairCost, s.countryId, true)})` : ''}</button>
              <button type="button" class="btn-sm secondary prop-reno-btn" data-uid="${p.uid}" ${inPrison ? 'disabled' : ''}>🔨 Ubah Suai</button>
              <button type="button" class="btn-sm secondary prop-sell-btn" data-uid="${p.uid}" style="color:#dc2626;" ${inPrison ? 'disabled' : ''}>💵 Jual</button>
            </div>`;
            })()}
          </div>
        `;
      });
      html += `</div>`;
    }

    // 2) Pelaburan Dimiliki
    if (invEntries.length > 0) {
      html += `<div class="assets-portfolio-section">`;
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
      html += `</div>`;
    }

    // 3) Kenderaan Dimiliki
    if (s.assets.vehicles.length > 0) {
      html += `<div class="assets-portfolio-section">`;
      html += `<div class="section-heading">🚗 Kenderaan Dimiliki (${s.assets.vehicles.length})</div>`;
      s.assets.vehicles.forEach(v => {
        const showLemon = Boolean(v.isLemon && v.lemonRevealed);
        const hasLic = AssetsEngine.hasMatchingLicense(s, v);
        const reqLic = AssetsEngine.getRequiredLicenseType(v);
        const licBadge = !reqLic
          ? '<span class="cat-badge synergy">✓ Tanpa Lesen</span>'
          : hasLic
            ? `<span class="cat-badge synergy">🪪 Lesen ${reqLic === 'moto' ? 'Motosikal' : 'Kereta'} Sah</span>`
            : `<span class="cat-badge" style="background:#fef3c7;color:#92400e;border:1px solid #fcd34d;">⚠️ Tiada Lesen ${reqLic === 'moto' ? 'Motosikal' : 'Kereta'}</span>`;
        html += `
          <div class="migration-card">
            <div class="mig-head">
              <div class="mig-title">
                ${v.icon} ${Utils.escapeHtml(v.name)}
                ${v.classic ? '<span class="cat-badge rare">⭐ Klasik</span>' : ''}
                ${showLemon ? '<span class="cat-badge" style="background:#fee2e2;color:#b91c1c;border:1px solid #fca5a5;">⚠️ Aset Bermasalah</span>' : ''}
              </div>
              <strong>${Utils.formatMoney(v.value, s.countryId, true)}</strong>
            </div>
            <div style="font-size:11.5px;color:#475569;margin-bottom:8px;">
              ${licBadge} • Kondisi: <strong>${v.condition}%</strong> • Usia: ${v.ageYrs || 0} thn • Kos Tahunan: ${Utils.formatMoney(v.upkeep || 0, s.countryId, true)}/thn
              ${showLemon ? `<br/><span style="color:#b91c1c;font-weight:700;">⚠️ Isu: ${Utils.escapeHtml(v.lemonFlaw || 'Enjin bermasalah')} (Kos senggara tinggi)</span>` : ''}
            </div>
            <button type="button" class="btn-sm primary veh-detail-btn" data-uid="${v.uid}" style="width:100%;margin-bottom:6px;">
              🛣️ Pandu &amp; Urus Kenderaan
            </button>
            <div class="mig-actions">
              <button type="button" class="btn-sm secondary veh-serv-btn" data-uid="${v.uid}">🔧 Servis &amp; Baiki</button>
              <button type="button" class="btn-sm secondary veh-sell-btn" data-uid="${v.uid}" style="color:#dc2626;">💰 Jual Kenderaan</button>
            </div>
          </div>
        `;
      });
      html += `</div>`;
    }

    // 4) Koleksi & Pusaka Keluarga
    if (s.assets.collectibles.length > 0) {
      const hasTrustActive = Boolean(s.familyTrust && s.familyTrust.active && s.age >= 18 && !(s.prison && s.prison.inPrison));
      html += `<div class="assets-portfolio-section">`;
      html += `<div class="section-heading">💎 Koleksi &amp; Pusaka Keluarga (${s.assets.collectibles.length})</div>`;
      s.assets.collectibles.forEach(col => {
        const fin = AssetsEngine.getCollectibleDisplayFinances(s, col);
        html += `
          <div class="migration-card ${col.isHeirloom ? 'rare-activity' : ''}">
            <div class="mig-head">
              <div class="mig-title">
                ${col.icon} ${Utils.escapeHtml(col.name)}
                ${col.isHeirloom ? `<span class="rare-gold-tag">👑 PUSAKA GEN ${col.ageInGenerations || 1}</span>` : ''}
                ${col.isDisplayed ? `<span class="cat-badge synergy">🏛️ Dipamerkan</span>` : ''}
              </div>
              <strong style="color:#16a34a;">${Utils.formatMoney(col.value, s.countryId, true)}</strong>
            </div>
            ${col.isDisplayed
              ? `<div style="font-size:11px;color:#475569;margin-bottom:6px;">🏛️ Dipamerkan di Galeri • Royalti Bersih: <strong style="color:#16a34a;">+${Utils.formatMoney(fin.netRoyalty, s.countryId, true)}/thn</strong> (Insurans: -${Utils.formatMoney(fin.annualInsurance, s.countryId, true)}/thn)</div>`
              : `<div style="font-size:11px;color:#64748b;margin-bottom:6px;">📦 Disimpan dalam peti • Tekan Pamerkan untuk jana royalti galeri tahunan</div>`}
            <div class="mig-actions" style="grid-template-columns:repeat(2,1fr);gap:6px;">
              <button type="button" class="btn-sm primary col-heir-btn" data-uid="${col.uid}">${col.isHeirloom ? '✓ Pusaka' : '👑 Jadikan Pusaka'}</button>
              <button type="button" class="btn-sm secondary col-disp-btn" data-uid="${col.uid}">${col.isDisplayed ? '📦 Henti Pamer' : '🏛️ Pamerkan'}</button>
              ${hasTrustActive ? `<button type="button" class="btn-sm secondary col-trust-btn" data-uid="${col.uid}">🏛️ Pindah ke Yayasan</button>` : ''}
              <button type="button" class="btn-sm secondary col-sell-btn" data-uid="${col.uid}" style="color:#dc2626;${hasTrustActive ? '' : 'grid-column:span 2;'}">🔨 Lelong</button>
            </div>
          </div>
        `;
      });
      html += `</div>`;
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
    AssetsEngine.ensureFields(s);
    const isUsed = this._vehSubTab === 'used';
    const list = isUsed ? (s.assetMarket.vehiclesUsed || []) : (s.assetMarket.vehiclesNew || []);
    const hasMoto = Boolean(s.licenses && s.licenses.moto);
    const hasCar = Boolean(s.licenses && s.licenses.car);
    const inPrison = Boolean(s.prison && s.prison.inPrison);

    let html = `
      <div class="info-banner highlight" style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
        <div style="font-size:12px;line-height:1.5;">
          <strong>🪪 Status Lesen Memandu</strong><br/>
          🛵 Motosikal: <strong>${hasMoto ? '✓ Lulus Sah' : 'Belum Ada'}</strong> • 🚗 Kereta: <strong>${hasCar ? '✓ Lulus Sah' : 'Belum Ada'}</strong>
        </div>
        <button type="button" class="btn-sm primary open-license-hub-btn" ${inPrison || (hasMoto && hasCar) ? 'disabled' : ''}>
          ${hasMoto && hasCar ? '✓ Lesen Lengkap' : '🪪 Ambil Lesen Memandu'}
        </button>
      </div>

      ${s.assets.vehicles.length > 0 ? `
        <div class="section-heading">🚘 Garaj Saya (${s.assets.vehicles.length} Kenderaan)</div>
        ${s.assets.vehicles.map(v => `
          <div class="migration-card" style="padding:10px 12px;margin-bottom:8px;">
            <div class="mig-head">
              <div class="mig-title">${v.icon} ${Utils.escapeHtml(v.name)}</div>
              <strong>${Utils.formatMoney(v.value, s.countryId, true)}</strong>
            </div>
            <div style="font-size:11.5px;color:#475569;margin-bottom:6px;">
              Kondisi: <strong>${v.condition}%</strong> • Kos Tahunan: ${Utils.formatMoney(v.upkeep || 0, s.countryId, true)}/thn
            </div>
            <button type="button" class="btn-sm primary veh-detail-btn" data-uid="${v.uid}" style="width:100%;">
              🛣️ Pandu &amp; Urus Kenderaan
            </button>
          </div>
        `).join('')}
        <div class="section-heading">🏪 Pengedar Kenderaan</div>
      ` : ''}

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
  // MODAL PENGESAHAN PEMBELIAN (PILIHAN INSPEKSI 1% ELAK "ASET BUSUK")
  // --------------------------------------------------------------------------
  showPurchaseConfirmModal({ assetType, listingId, useMortgage = false, isUsed = false }) {
    const s = GameState.current;
    if (!s) return;
    AssetsEngine.ensureFields(s);
    const isProp = assetType === 'property';
    const item = isProp
      ? (s.assetMarket.properties || []).find(x => x.lid === listingId)
      : ((isUsed ? s.assetMarket.vehiclesUsed : s.assetMarket.vehiclesNew) || []).find(x => x.lid === listingId);
    if (!item) return;

    const baseUpfront = (isProp && useMortgage) ? Math.round(item.price * 0.20) : item.price;
    const inspFee = Math.max(isProp ? 100 : 50, Math.round(item.price * 0.01));
    const cukaiPintu = isProp ? Math.round(item.price * 0.0035) : 0;
    const cukaiTanah = isProp ? Math.round(item.price * 0.0015) : 0;

    Modals.open({
      icon: item.icon || (isProp ? '🏠' : '🚗'),
      title: `Pengesahan Pembelian ${isProp ? 'Hartanah' : 'Kenderaan'}`,
      subtitle: `${item.name} • ${Utils.formatMoney(item.price, s.countryId)}`,
      bodyHtml: `
        <div class="info-banner highlight" style="line-height:1.6;">
          <strong>${item.icon} ${Utils.escapeHtml(item.name)}</strong> (${Utils.escapeHtml(item.sub || '')})<br/>
          Harga Pasaran: <strong>${Utils.formatMoney(item.price, s.countryId)}</strong> • Keadaan: <strong>${item.condition}%</strong><br/>
          Kaedah Bayaran: <strong>${isProp && useMortgage ? `Pinjaman Bank (Deposit 20%: ${Utils.formatMoney(baseUpfront, s.countryId)})` : `Tunai Penuh (${Utils.formatMoney(baseUpfront, s.countryId)})`}</strong>
          ${isProp ? `<br/>🏛️ Cukai Tahunan: Cukai Pintu (0.35%: ${Utils.formatMoney(cukaiPintu, s.countryId)}/thn) + Cukai Tanah (0.15%: ${Utils.formatMoney(cukaiTanah, s.countryId)}/thn)` : ''}
        </div>

        <label class="info-banner" style="display:flex;align-items:flex-start;gap:10px;cursor:pointer;background:#fffbeb;border-color:#fde68a;">
          <input type="checkbox" id="chk-asset-inspection" style="margin-top:4px;transform:scale(1.2);" checked />
          <div style="font-size:12.5px;line-height:1.5;">
            <strong>🔍 Upah Pemeriksa / Inspeksi (Kos 1%: ${Utils.formatMoney(inspFee, s.countryId)})</strong><br/>
            <span style="opacity:0.88;">Mengurangkan risiko terbeli <strong>"Aset Busuk"</strong> (${isProp ? 'struktur retak / kawasan banjir / pemaju bermasalah' : 'kereta banjir / enjin & gearbox bermasalah'}) daripada <strong>~18%</strong> turun kepada <strong>~3%</strong>.</span>
          </div>
        </label>

        <div id="buy-total-display" class="info-banner" style="font-weight:700;text-align:center;">
          Jumlah Bayaran Semasa: ${Utils.formatMoney(baseUpfront + inspFee, s.countryId)}
        </div>

        <button type="button" class="primary-btn" id="btn-confirm-asset-purchase">✅ Sahkan Pembelian</button>
        <button type="button" class="ghost-btn" id="btn-cancel-asset-purchase" style="margin-top:8px;">← Batal &amp; Kembali</button>
      `
    });

    const chk = document.getElementById('chk-asset-inspection');
    const disp = document.getElementById('buy-total-display');
    if (chk && disp) {
      chk.addEventListener('change', () => {
        const tot = baseUpfront + (chk.checked ? inspFee : 0);
        disp.textContent = `Jumlah Bayaran Semasa: ${Utils.formatMoney(tot, s.countryId)}`;
      });
    }

    document.getElementById('btn-confirm-asset-purchase').addEventListener('click', () => {
      const useInspection = Boolean(chk && chk.checked);
      const res = isProp
        ? AssetsEngine.buyProperty(listingId, useMortgage, { useInspection })
        : AssetsEngine.buyVehicle(listingId, isUsed, { useInspection });
      App.toast(res.msg, res.ok ? (res.lemonRevealed ? 'error' : 'success') : 'error');
      App.renderAll();
      this.showHub(isProp ? 'realestate' : 'vehicles');
    });

    document.getElementById('btn-cancel-asset-purchase').addEventListener('click', () => {
      this.showHub(isProp ? 'realestate' : 'vehicles');
    });
  },

  // --------------------------------------------------------------------------
  // MODAL RINGKASAN JUALAN ASET (POTONGAN YURAN GUAMAN, S&P, CKHT & CUKAI 2.5%)
  // --------------------------------------------------------------------------
  showSaleBreakdownModal(assetType, uidOrInstId, sellFraction = 1) {
    const s = GameState.current;
    if (!s) return;
    const prev = AssetsEngine.previewAssetSale(s, assetType, uidOrInstId, sellFraction);
    if (!prev) return;

    const fmt = (v) => Utils.formatMoney(v, s.countryId);

    Modals.open({
      icon: '🧾',
      title: 'Ringkasan Jualan Aset',
      subtitle: `${prev.icon} ${prev.name}`,
      bodyHtml: `
        <div class="info-banner highlight" style="line-height:1.75;">
          <strong>🧾 Penyata Terperinci Jualan (${Utils.escapeHtml(prev.name)})</strong><br/>
          ${prev.assetType === 'property' ? `Nilai Pasaran: <strong>${fmt(prev.marketValue)}</strong> (Kondisi: <strong>${prev.condition}%</strong>)<br/>` : ''}
          ${prev.assetType === 'property' ? 'Harga Jualan Sebenar' : 'Harga Jualan Kasar'}: <strong style="color:${prev.poorConditionDiscount ? '#dc2626' : 'inherit'};">${fmt(prev.grossPrice)}</strong><br/>
          ${prev.poorConditionDiscount ? `<span style="color:#b91c1c;font-size:11.5px;font-weight:700;">⚠️ Harga jatuh kerana keadaan rumah teruk (≤50%)</span><br/>` : ''}
          ${prev.legalFee > 0 ? `Potongan Yuran Guaman &amp; S&amp;P (${prev.legalFeePct.toFixed(1)}%): <strong style="color:#dc2626;">-${fmt(prev.legalFee)}</strong><br/>` : ''}
          Potongan ${Utils.escapeHtml(prev.taxLabel)}: <strong style="color:#dc2626;">-${fmt(prev.saleTax)}</strong><br/>
          ${prev.mortgagePayoff > 0 ? `Pelunasan Baki Pinjaman Bank: <strong style="color:#dc2626;">-${fmt(prev.mortgagePayoff)}</strong><br/>` : ''}
          <hr style="border:none;border-top:1px solid #cbd5e1;margin:6px 0;" />
          Jumlah Yuran &amp; Cukai Jualan: <strong style="color:#dc2626;">-${fmt(prev.totalFeesAndTaxes)}</strong><br/>
          <span style="font-size:14px;">💰 Tunai Bersih Diterima: <strong style="color:#16a34a;">${fmt(prev.netProceeds)}</strong></span>
        </div>

        <button type="button" class="primary-btn" id="btn-confirm-asset-sale">💵 Sahkan Jualan (${fmt(prev.netProceeds)})</button>
        <button type="button" class="ghost-btn" id="btn-cancel-asset-sale" style="margin-top:8px;">← Batal &amp; Kembali</button>
      `
    });

    document.getElementById('btn-confirm-asset-sale').addEventListener('click', () => {
      let r;
      if (assetType === 'property') r = AssetsEngine.sellProperty(uidOrInstId);
      else if (assetType === 'vehicle') r = AssetsEngine.sellVehicle(uidOrInstId);
      else if (assetType === 'collectible') r = AssetsEngine.sellCollectible(uidOrInstId);
      else if (assetType === 'investment') r = AssetsEngine.sellInvestment(uidOrInstId, sellFraction);
      App.toast(r ? r.msg : 'Jualan selesai', r && r.ok ? 'success' : 'error');
      App.renderAll();
      this.showHub('portfolio');
    });

    document.getElementById('btn-cancel-asset-sale').addEventListener('click', () => {
      this.showHub('portfolio');
    });
  },

  // --------------------------------------------------------------------------
  // MODAL SISTEM LESEN MEMANDU & INTERAKSI KENDERAAN
  // --------------------------------------------------------------------------
  showLicenseHubModal(returnFn = null) {
    const s = GameState.current;
    if (!s) return;
    AssetsEngine.ensureFields(s);
    const c = Utils.getCountry(s.countryId);
    const inPrison = Boolean(s.prison && s.prison.inPrison);

    const motoElig = AssetsEngine.checkLicenseTestEligibility(s, 'moto');
    const carElig = AssetsEngine.checkLicenseTestEligibility(s, 'car');
    const motoFee = AssetsEngine.getLicenseFee(s, 'moto');
    const carFee = AssetsEngine.getLicenseFee(s, 'car');
    const hasMoto = Boolean(s.licenses && s.licenses.moto);
    const hasCar = Boolean(s.licenses && s.licenses.car);

    Modals.open({
      icon: '🪪',
      title: 'Institut Memandu & Ujian Lesen',
      subtitle: `Tunai: ${Utils.formatMoney(s.money, s.countryId, true)} • ${c.flag} ${c.name}`,
      bodyHtml: `
        <div class="info-banner highlight">
          <strong>🪪 Ambil Lesen Memandu Sah</strong><br/>
          Jawab soalan peraturan jalan raya dan lulus ujian praktikal untuk mendapatkan lesen memandu kekal. Memandu tanpa lesen mengundang risiko sekatan jalan raya, saman berat dan kenderaan disita!
        </div>

        <div class="action-list">
          <button type="button" class="action-item start-lic-test-btn ${hasMoto ? 'act-done-card' : ''}" data-ltype="moto" ${!motoElig.ok || inPrison ? 'disabled' : ''}>
            <span class="ai-icon">🛵</span>
            <span class="ai-content">
              <span class="ai-title">Lesen Motosikal</span>
              <span class="ai-desc">
                ${hasMoto
                  ? '<span class="cat-badge synergy">✓ Lesen Motosikal Dimiliki</span>'
                  : motoElig.ok
                    ? '<span class="cat-badge synergy">✓ Layak Menduduki Ujian (Umur 16+)</span>'
                    : `<span class="cat-badge">🔒 ${Utils.escapeHtml(motoElig.reason)}</span>`}
                <br/>Melayakkan anda menunggang motosikal secara sah dan bekerja sambilan sebagai penghantar.
              </span>
            </span>
            <span class="ai-right">
              <span class="act-status-pill ${hasMoto ? 'done' : 'cost'}">${hasMoto ? '✓ Sah' : Utils.formatMoney(motoFee, s.countryId)}</span>
            </span>
          </button>

          <button type="button" class="action-item start-lic-test-btn ${hasCar ? 'act-done-card' : ''}" data-ltype="car" ${!carElig.ok || inPrison ? 'disabled' : ''}>
            <span class="ai-icon">🚗</span>
            <span class="ai-content">
              <span class="ai-title">Lesen Kereta</span>
              <span class="ai-desc">
                ${hasCar
                  ? '<span class="cat-badge synergy">✓ Lesen Kereta Dimiliki</span>'
                  : carElig.ok
                    ? '<span class="cat-badge synergy">✓ Layak Menduduki Ujian (Umur 17+)</span>'
                    : `<span class="cat-badge">🔒 ${Utils.escapeHtml(carElig.reason)}</span>`}
                <br/>Melayakkan anda memandu kereta secara sah, membawa keluarga berjalan-jalan dan memandu e-hailing.
              </span>
            </span>
            <span class="ai-right">
              <span class="act-status-pill ${hasCar ? 'done' : 'cost'}">${hasCar ? '✓ Sah' : Utils.formatMoney(carFee, s.countryId)}</span>
            </span>
          </button>
        </div>

        <button type="button" id="btn-back-from-license" class="secondary-btn" style="width:100%;margin-top:10px;">← Kembali</button>
      `
    });

    document.querySelectorAll('.start-lic-test-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.showDrivingTestModal(btn.dataset.ltype, returnFn);
      });
    });

    const backBtn = document.getElementById('btn-back-from-license');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (typeof returnFn === 'function') returnFn();
        else this.showHub('vehicles');
      });
    }
  },

  showDrivingTestModal(type = 'car', returnFn = null) {
    const s = GameState.current;
    if (!s) return;
    const elig = AssetsEngine.checkLicenseTestEligibility(s, type);
    if (!elig.ok) {
      App.toast(elig.reason, 'error');
      return;
    }

    const questions = AssetsEngine.pickDrivingTestQuestions(type);
    let step = 0;
    let correctCount = 0;
    const label = type === 'moto' ? 'Lesen Motosikal' : 'Lesen Kereta';

    const renderQuestion = () => {
      const qObj = questions[step];
      const optsHtml = qObj.options.map((opt, idx) => `
        <button type="button" class="choice-btn lic-ans-btn" data-idx="${idx}" style="white-space:normal;word-break:break-word;text-align:left;">
          <span class="choice-title">${Utils.escapeHtml(opt.text)}</span>
        </button>
      `).join('');

      Modals.open({
        icon: type === 'moto' ? '🛵' : '🚗',
        title: `Ujian ${label} (Soalan ${step + 1}/${questions.length})`,
        subtitle: `Yuran Ujian: ${Utils.formatMoney(elig.fee, s.countryId)}`,
        locked: true,
        bodyHtml: `
          <div class="event-text" style="font-weight:600;">${Utils.escapeHtml(qObj.q)}</div>
          <div class="action-list">${optsHtml}</div>
        `
      });

      document.querySelectorAll('.lic-ans-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const picked = qObj.options[Number(btn.dataset.idx)];
          if (picked && picked.correct) correctCount += 1;
          step += 1;
          if (step < questions.length) {
            renderQuestion();
          } else {
            Modals.locked = false;
            const res = AssetsEngine.submitDrivingLicenseTest(type, correctCount, questions.length);
            App.toast(res.msg, res.ok ? 'success' : 'error');
            App.renderAll();
            this.showLicenseHubModal(returnFn);
          }
        });
      });
    };

    renderQuestion();
  },

  showVehicleDetailModal(uid, fromTab = 'portfolio') {
    const s = GameState.current;
    if (!s) return;
    AssetsEngine.ensureFields(s);
    const v = s.assets.vehicles.find(x => x.uid === uid);
    if (!v) {
      this.showHub(fromTab);
      return;
    }

    const inPrison = Boolean(s.prison && s.prison.inPrison);
    const reqType = AssetsEngine.getRequiredLicenseType(v);
    const hasLic = AssetsEngine.hasMatchingLicense(s, v);
    const licName = reqType === 'moto' ? 'Lesen Motosikal' : 'Lesen Kereta';
    const servCost = Math.max(Utils.usdToLocal(120, s.countryId), Math.round(v.value * 0.06));
    const cruiseUsed = (s.yearlyActions.vehCruiseCount && s.yearlyActions.vehCruiseCount[uid]) || 0;
    const outingUsed = Boolean(s.yearlyActions.vehFamilyOuting);
    const gigUsed = Boolean(s.yearlyActions.vehSideGig);
    const minGigAge = reqType === 'moto' ? 16 : 18;
    const canDoGig = Boolean(reqType && v.sub === 'Darat' && hasLic && v.condition >= 40 && s.age >= minGigAge && !gigUsed && !inPrison);
    const canDoOuting = Boolean(hasLic && !outingUsed && !inPrison);
    const showLemon = Boolean(v.isLemon && v.lemonRevealed);

    let warnHtml = '';
    if (!hasLic && reqType) {
      warnHtml += `
        <div class="info-banner" style="background:#fef3c7;border-color:#fcd34d;color:#92400e;margin-bottom:8px;">
          ⚠️ <strong>Amaran Tanpa Lesen:</strong> Anda belum memiliki <strong>${licName}</strong>. Memandu atau menunggang tanpa lesen sah membawa risiko tinggi ditahan dalam Sekatan Jalan Raya, disaman berat atau kenderaan disita!
        </div>
      `;
    }
    if (v.condition < 35) {
      warnHtml += `
        <div class="info-banner" style="background:#fef2f2;border-color:#fecaca;color:#991b1b;margin-bottom:8px;">
          🛠️ <strong>Kondisi Kritikal (${v.condition}%):</strong> Kenderaan ini berisiko tinggi rosak di tengah jalan atau terlibat kemalangan. Sila servis segera!
        </div>
      `;
    }

    Modals.open({
      icon: v.icon || '🚗',
      title: v.name,
      subtitle: `Kondisi: ${v.condition}% • Nilai Semasa: ${Utils.formatMoney(v.value, s.countryId, true)}`,
      bodyHtml: `
        <div class="summary-grid" style="margin-bottom:10px;">
          <div class="summary-stat">
            <span class="lbl">Kondisi Semasa</span>
            <span class="val" style="color:${v.condition >= 70 ? '#16a34a' : v.condition >= 35 ? '#d97706' : '#dc2626'};">${v.condition}%</span>
          </div>
          <div class="summary-stat">
            <span class="lbl">Nilai Semasa</span>
            <span class="val">${Utils.formatMoney(v.value, s.countryId, true)}</span>
          </div>
          <div class="summary-stat">
            <span class="lbl">Kos Tahunan</span>
            <span class="val">${Utils.formatMoney(v.upkeep || 0, s.countryId, true)}/thn</span>
          </div>
          <div class="summary-stat">
            <span class="lbl">Status Lesen</span>
            <span class="val" style="color:${hasLic ? '#16a34a' : '#dc2626'};">${!reqType ? 'Tiada Syarat' : (hasLic ? 'Sah' : 'Tiada Lesen')}</span>
          </div>
        </div>
        ${showLemon ? `<div class="info-banner" style="background:#fee2e2;border-color:#fca5a5;color:#991b1b;margin-bottom:8px;">⚠️ <strong>Isu Tersembunyi:</strong> ${Utils.escapeHtml(v.lemonFlaw || 'Kerosakan komponen dalaman')}</div>` : ''}
        ${warnHtml}

        <div class="action-list">
          <button type="button" class="action-item" id="btn-veh-act-cruise" ${cruiseUsed >= 2 || inPrison ? 'disabled' : ''}>
            <span class="ai-icon">🛣️</span>
            <span class="ai-content">
              <span class="ai-title">Pandu / Tunggang Bersiar-siar</span>
              <span class="ai-desc">${cruiseUsed >= 2 ? 'Sudah cukup bersiar-siar tahun ini' : (!hasLic && reqType ? 'Pandu secara haram tanpa lesen (berisiko sekatan jalan raya)' : 'Ambil angin petang untuk menenangkan fikiran')}</span>
            </span>
          </button>

          <button type="button" class="action-item" id="btn-veh-act-outing" ${!canDoOuting ? 'disabled' : ''}>
            <span class="ai-icon">🚗</span>
            <span class="ai-content">
              <span class="ai-title">Bawa Keluarga / Pasangan Jalan-jalan</span>
              <span class="ai-desc">${!hasLic && reqType ? `Perlu memiliki ${licName} dahulu` : outingUsed ? 'Sudah dilakukan tahun ini' : 'Luangkan masa berkualiti bersama insan tersayang'}</span>
            </span>
          </button>

          ${reqType && v.sub === 'Darat' ? `
            <button type="button" class="action-item" id="btn-veh-act-gig" ${!canDoGig ? 'disabled' : ''}>
              <span class="ai-icon">🛵</span>
              <span class="ai-content">
                <span class="ai-title">Buat Kerja Sambilan (${reqType === 'moto' ? 'Rider Penghantaran' : 'Pemandu E-Hailing'})</span>
                <span class="ai-desc">${!hasLic ? `Perlu memiliki ${licName} dahulu` : s.age < minGigAge ? `Umur minimum ${minGigAge} tahun` : v.condition < 40 ? 'Servis kenderaan dahulu untuk bekerja sambilan' : gigUsed ? 'Sudah dilakukan tahun ini' : 'Jana pendapatan sampingan menggunakan kenderaan sendiri'}</span>
              </span>
            </button>
          ` : ''}

          <button type="button" class="action-item" id="btn-veh-act-service" ${v.condition >= 100 || s.money < servCost || inPrison ? 'disabled' : ''}>
            <span class="ai-icon">🔧</span>
            <span class="ai-content">
              <span class="ai-title">Servis &amp; Baiki Kenderaan</span>
              <span class="ai-desc">${v.condition >= 100 ? 'Kenderaan berada dalam keadaan terbaik' : 'Pulihkan keadaan mekanikal dan enjin di bengkel'}</span>
            </span>
            <span class="ai-right"><span class="act-status-pill cost">${Utils.formatMoney(servCost, s.countryId)}</span></span>
          </button>

          <button type="button" class="action-item" id="btn-veh-act-sell" ${inPrison ? 'disabled' : ''}>
            <span class="ai-icon">💰</span>
            <span class="ai-content">
              <span class="ai-title">Jual Kenderaan</span>
              <span class="ai-desc">Jual pada nilai pasaran semasa</span>
            </span>
            <span class="ai-right"><span class="act-status-pill">${Utils.formatMoney(v.value, s.countryId, true)}</span></span>
          </button>
        </div>

        <button type="button" id="btn-veh-detail-back" class="secondary-btn" style="width:100%;margin-top:10px;">← Kembali</button>
      `
    });

    const cruiseBtn = document.getElementById('btn-veh-act-cruise');
    if (cruiseBtn) {
      cruiseBtn.addEventListener('click', () => {
        if (!hasLic && reqType) {
          const ok = window.confirm(`Anda belum mempunyai ${licName}! Teruskan memandu tanpa lesen dengan risiko ditahan Sekatan Jalan Raya?`);
          if (!ok) return;
        }
        const r = AssetsEngine.cruiseWithVehicle(uid);
        App.toast(r.msg, r.ok ? 'success' : 'error');
        App.renderAll();
        if (r.impounded) this.showHub(fromTab);
        else this.showVehicleDetailModal(uid, fromTab);
      });
    }

    const outingBtn = document.getElementById('btn-veh-act-outing');
    if (outingBtn) {
      outingBtn.addEventListener('click', () => {
        const r = AssetsEngine.familyOutingWithVehicle(uid);
        App.toast(r.msg, r.ok ? 'success' : 'error');
        App.renderAll();
        this.showVehicleDetailModal(uid, fromTab);
      });
    }

    const gigBtn = document.getElementById('btn-veh-act-gig');
    if (gigBtn) {
      gigBtn.addEventListener('click', () => {
        const r = AssetsEngine.sideGigWithVehicle(uid);
        App.toast(r.msg, r.ok ? 'success' : 'error');
        App.renderAll();
        this.showVehicleDetailModal(uid, fromTab);
      });
    }

    const servBtn = document.getElementById('btn-veh-act-service');
    if (servBtn) {
      servBtn.addEventListener('click', () => {
        const r = AssetsEngine.maintainVehicle(uid);
        App.toast(r.msg, r.ok ? 'success' : 'error');
        App.renderAll();
        this.showVehicleDetailModal(uid, fromTab);
      });
    }

    const sellBtn = document.getElementById('btn-veh-act-sell');
    if (sellBtn) {
      sellBtn.addEventListener('click', () => {
        this.showSaleBreakdownModal('vehicle', uid);
      });
    }

    const backBtn = document.getElementById('btn-veh-detail-back');
    if (backBtn) {
      backBtn.addEventListener('click', () => this.showHub(fromTab));
    }
  },

  // --------------------------------------------------------------------------
  // IKATAN PENDENGAR ACARA
  // --------------------------------------------------------------------------
  _bindHandlers(s, c, tab) {
    document.querySelectorAll('.asset-tab-pill').forEach(pill => {
      pill.addEventListener('click', () => this.showHub(pill.dataset.atab));
    });

    const passiveBtn = document.getElementById('btn-passive-breakdown');
    const passivePanel = document.getElementById('passive-breakdown-panel');
    if (passiveBtn && passivePanel) {
      passiveBtn.addEventListener('click', () => {
        passivePanel.classList.toggle('hidden');
      });
    }

    const refBtn = document.getElementById('btn-refresh-asset-market');
    if (refBtn) {
      refBtn.addEventListener('click', () => {
        const res = AssetsEngine.refreshMarket();
        App.toast(res.msg, res.ok ? 'culture' : 'error');
        this.showHub(tab);
      });
    }

    document.querySelectorAll('.open-license-hub-btn').forEach(b => {
      b.addEventListener('click', () => this.showLicenseHubModal(() => this.showHub(tab)));
    });

    document.querySelectorAll('.veh-detail-btn').forEach(b => {
      b.addEventListener('click', () => this.showVehicleDetailModal(b.dataset.uid, tab));
    });

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
        this.showSaleBreakdownModal('property', b.dataset.uid);
      }));
      document.querySelectorAll('.veh-serv-btn').forEach(b => b.addEventListener('click', () => {
        const r = AssetsEngine.maintainVehicle(b.dataset.uid);
        App.toast(r.msg, r.ok ? 'success' : 'error'); App.renderAll(); this.showHub('portfolio');
      }));
      document.querySelectorAll('.veh-sell-btn').forEach(b => b.addEventListener('click', () => {
        this.showSaleBreakdownModal('vehicle', b.dataset.uid);
      }));
      document.querySelectorAll('.inv-sell-btn').forEach(b => b.addEventListener('click', () => {
        this.showSaleBreakdownModal('investment', b.dataset.inst, Number(b.dataset.frac));
      }));
      document.querySelectorAll('.col-heir-btn').forEach(b => b.addEventListener('click', () => {
        const r = AssetsEngine.toggleHeirloom(b.dataset.uid);
        App.toast(r.msg, r.ok ? 'success' : 'error'); App.renderAll(); this.showHub('portfolio');
      }));
      document.querySelectorAll('.col-disp-btn').forEach(b => b.addEventListener('click', () => {
        const col = (s.assets.collectibles || []).find(x => x && x.uid === b.dataset.uid);
        if (!col) return;
        if (col.isDisplayed) {
          const r = AssetsEngine.displayCollectible(b.dataset.uid);
          App.toast(r.msg, r.ok ? 'culture' : 'error'); App.renderAll(); this.showHub('portfolio');
          return;
        }
        const fin = AssetsEngine.getCollectibleDisplayFinances(s, col);
        Modals.open({
          icon: '🏛️',
          title: 'Pengesahan Pameran Galeri',
          subtitle: `${col.icon} ${col.name}`,
          bodyHtml: `
            <div class="info-banner highlight" style="line-height:1.65;">
              <strong>🏛️ Butiran Pameran Tahunan</strong><br/>
              Kadar Royalti Pameran: <strong style="color:#16a34a;">${fin.royaltyRatePct}% setahun</strong> (~+${Utils.formatMoney(fin.annualRoyalty, s.countryId)}/thn)<br/>
              Anggaran Kos Penjagaan &amp; Insurans: <strong style="color:#dc2626;">${fin.insuranceRatePct}% setahun</strong> (-${Utils.formatMoney(fin.annualInsurance, s.countryId)}/thn)<br/>
              <small>Jika baki tunai tidak mencukupi pada +Umur untuk menampung insurans, barang akan ditarik balik dari galeri secara automatik.</small>
            </div>
            <button type="button" class="primary-btn" id="btn-confirm-display-col" style="width:100%;">🏛️ Sahkan &amp; Pamerkan</button>
            <button type="button" class="ghost-btn" id="btn-cancel-display-col" style="width:100%;margin-top:8px;">← Batal</button>
          `
        });
        document.getElementById('btn-confirm-display-col').addEventListener('click', () => {
          const r = AssetsEngine.displayCollectible(b.dataset.uid);
          App.toast(r.msg, r.ok ? 'success' : 'error'); App.renderAll(); this.showHub('portfolio');
        });
        document.getElementById('btn-cancel-display-col').addEventListener('click', () => this.showHub('portfolio'));
      }));
      document.querySelectorAll('.col-trust-btn').forEach(b => b.addEventListener('click', () => {
        if (!window.LegalInheritanceEngine) return;
        if (LegalInheritanceEngine.isTrustOffshore && LegalInheritanceEngine.isTrustOffshore(s) && ((s.familyTrust && s.familyTrust.unpaidFees) || 0) <= 0) {
          const item = ((s.assets && s.assets.collectibles) || []).find(x => x && x.uid === b.dataset.uid);
          if (item && window.Modals && Modals.showOffshoreProxyModal) {
            Modals.showOffshoreProxyModal('deposit', Math.max(0, Math.round(item.value || 0)), null, { kind: 'asset', direction: 'in', assetType: 'collectible', uid: b.dataset.uid, name: item.name, onDone: () => this.showAssets('collectibles') });
            return;
          }
        }
        const r = LegalInheritanceEngine.transferAssetToTrust(s, 'collectible', b.dataset.uid);
        App.toast(r.msg, r.ok ? 'success' : 'error'); App.renderAll(); this.showHub('portfolio');
      }));
      document.querySelectorAll('.col-sell-btn').forEach(b => b.addEventListener('click', () => {
        this.showSaleBreakdownModal('collectible', b.dataset.uid);
      }));
    } else if (tab === 'realestate') {
      document.querySelectorAll('.prop-buy-cash').forEach(b => b.addEventListener('click', () => {
        this.showPurchaseConfirmModal({ assetType: 'property', listingId: b.dataset.lid, useMortgage: false });
      }));
      document.querySelectorAll('.prop-buy-mort').forEach(b => b.addEventListener('click', () => {
        this.showPurchaseConfirmModal({ assetType: 'property', listingId: b.dataset.lid, useMortgage: true });
      }));
    } else if (tab === 'vehicles') {
      document.querySelectorAll('.veh-sub-pill').forEach(p => p.addEventListener('click', () => {
        this._vehSubTab = p.dataset.vsub;
        this.showHub('vehicles');
      }));
      document.querySelectorAll('.veh-buy-btn').forEach(b => b.addEventListener('click', () => {
        this.showPurchaseConfirmModal({ assetType: 'vehicle', listingId: b.dataset.lid, isUsed: b.dataset.used === '1' });
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
