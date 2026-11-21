/* ==========================================================================
   WorldLife — Antara Muka Dek Aktiviti Dinamik & Legasi Dinasti Keluarga
   Bahasa Melayu
   ========================================================================== */

window.LegacyModals = {
  // --------------------------------------------------------------------------
  // 1. MODAL LEGASI KELUARGA, SALASILAH & PENCAPAIAN GENERASI PERDANA
  // --------------------------------------------------------------------------
  showFamilyLegacy() {
    const s = GameState.current;
    GameState.ensureUpgradedState();
    const d = Dynasty.getData();
    const status = Dynasty.getStatusBadge(d.legacyStatus);
    const bonuses = Dynasty.getBloodlineBonuses();

    const activeBonuses = [];
    if (bonuses.startingWealthMult) activeBonuses.push('🥈 +12% Harta Permulaan Pewaris');
    if (bonuses.repGainMult) activeBonuses.push('🏛️ +20% Kenaikan Reputasi Keluarga');
    if (bonuses.rareActivityBonus) activeBonuses.push('⭐ +10% Peluang Aktiviti Nadir');
    if (bonuses.sabotageDefenseBonus) activeBonuses.push('🛡️ +12% Pertahanan Sabotaj Legasi');
    if (bonuses.legalCostDiscount) activeBonuses.push('⚖️ -25% Diskaun Kos Guaman & PR');
    if (bonuses.riskyCrisisBonus) activeBonuses.push('🔥 +12% Kejayaan Pilihan Krisis Berisiko');
    if (bonuses.higherStatBuff) activeBonuses.push(`👑 +${bonuses.higherStatBuff} Kepintaran & Penampilan Kekal`);

    const primeKeyList = [2, 3, 5, 7, 11, 13];
    const unlockedMap = new Map((d.primeAchievements || []).map(a => [a.gen, a]));
    const higherUnlocked = (d.primeAchievements || []).filter(a => a.gen >= 17);

    const primeGridHtml = [
      ...primeKeyList.map(g => {
        const has = unlockedMap.get(g);
        const info = Dynasty.PRIME_MILESTONES[g];
        return `
          <div class="prime-card ${has ? 'unlocked' : 'locked'}">
            <div class="pc-head">
              <span>${has ? info.icon : '🔒'} <strong>Gen ${g}</strong></span>
              <span class="pc-tag">${has ? 'DIBUKA' : 'TERKUNCI'}</span>
            </div>
            <div class="pc-title">${Utils.escapeHtml(info.title)}</div>
            <div class="pc-desc">${Utils.escapeHtml(info.bonusDesc)}</div>
          </div>
        `;
      }),
      ...higherUnlocked.map(a => `
        <div class="prime-card unlocked">
          <div class="pc-head">
            <span>${a.icon} <strong>Gen ${a.gen}</strong></span>
            <span class="pc-tag">PERDANA TINGGI</span>
          </div>
          <div class="pc-title">${Utils.escapeHtml(a.title)}</div>
          <div class="pc-desc">${Utils.escapeHtml(a.bonusDesc)}</div>
        </div>
      `)
    ].join('');

    const historyHtml = (d.dynastyHistory && d.dynastyHistory.length > 0)
      ? d.dynastyHistory.map(h => `
          <div class="dynasty-node">
            <div class="dn-top">
              <strong>${h.countryFlag || '👑'} Gen ${h.generation}: ${Utils.escapeHtml(h.name)}</strong>
              <span class="dn-meta">Umur ${h.age} • ${h.yearDied}</span>
            </div>
            <div class="dn-sub">${Utils.escapeHtml(h.endingTitle)} • Harta: <strong>${Utils.escapeHtml(h.peakWealthFormatted)}</strong></div>
            <div class="dn-event">${Utils.escapeHtml(h.notableEvent)}</div>
          </div>
        `).join('')
      : `<div class="info-banner">Anda ialah pengasas Generasi 1! Apabila watak ini menamatkan hayatnya, teruskan sebagai pewaris untuk membina salasilah dinasti anda.</div>`;

    const traitsHtml = (s && s.traits && s.traits.length > 0)
      ? `<div class="traits-row">${s.traits.map(tid => {
          const t = ActivitiesDeck.getTraitObj(tid);
          return `<span class="trait-chip" title="${Utils.escapeHtml(t.desc)}">${t.icon} ${Utils.escapeHtml(t.name)}</span>`;
        }).join('')}</div>`
      : '';

    Modals.open({
      icon: '👑',
      title: 'Legasi Keluarga & Pencapaian',
      subtitle: `Dinasti Generasi ${d.generation} • Status: ${status.icon} ${status.label}`,
      bodyHtml: `
        <div class="legacy-hero ${status.cls}">
          <div class="lh-row">
            <div>
              <div class="lh-gen">👑 GENERASI ${d.generation}</div>
              <div class="lh-name">${s ? Utils.escapeHtml(s.name) : 'Pengasas Dinasti'}</div>
            </div>
            <span class="legacy-status-pill ${status.cls}">${status.icon} ${status.label}</span>
          </div>
          <div class="lh-rep-label">
            <span>Reputasi Keluarga</span>
            <strong>${d.familyReputation}%</strong>
          </div>
          <div class="mini-track" style="height:8px;background:rgba(255,255,255,0.22);">
            <div class="mini-fill" style="width:${d.familyReputation}%;background:${status.color};"></div>
          </div>
          ${d.legacyStatus === 'Tarnished' ? `
            <div class="lh-tarnish-note">
              💔 <strong>Punca Tercemar:</strong> ${Utils.escapeHtml(d.tarnishReason || 'Skandal sabotaj lalu')}<br/>
              <small>Peluang elit menjadi lebih sukar. Teruskan hidup — tetingkap peluang penebusan akan muncul secara rawak pada masa hadapan (termasuk merentas generasi)!</small>
            </div>
          ` : ''}
          ${traitsHtml}
        </div>

        ${activeBonuses.length > 0 ? `
          <div class="section-heading">🧬 Bonus Darah Dinasti Aktif (${activeBonuses.length})</div>
          <div class="info-banner highlight" style="line-height:1.6;">
            ${activeBonuses.map(b => `• ${b}`).join('<br/>')}
          </div>
        ` : ''}

        <div class="section-heading">🌟 Pencapaian Generasi Nombor Perdana (${d.primeAchievements.length} dibuka)</div>
        <div class="prime-grid">${primeGridHtml}</div>

        <div class="section-heading">🌳 Salasilah &amp; Sejarah Dinasti (${d.dynastyHistory.length})</div>
        <div class="dynasty-timeline">${historyHtml}</div>
      `
    });
  },

  // --------------------------------------------------------------------------
  // 2. DEK AKTIVITI RAWAK TAHUNAN (5–7 Aktiviti + Peluang Nadir)
  // --------------------------------------------------------------------------
  renderDynamicActivitiesTab(s, c) {
    GameState.ensureUpgradedState();
    if (!Array.isArray(s.yearlyDeck) || s.yearlyDeck.length === 0) {
      ActivitiesDeck.generateYearlyDeck(s);
    }

    const traits = s.traits || [];
    const traitsHtml = traits.map(tid => {
      const t = ActivitiesDeck.getTraitObj(tid);
      return `<span class="trait-chip" title="${Utils.escapeHtml(t.desc)}">${t.icon} ${Utils.escapeHtml(t.name)}</span>`;
    }).join('');

    const cardsHtml = s.yearlyDeck.map(actId => {
      const act = ActivitiesDeck.POOL.find(a => a.id === actId);
      if (!act) return '';
      const done = Boolean(s.yearlyActions['deck_' + act.id]);
      const costLocal = (s.age < 18 && act.costUsd <= 60) ? 0 : Utils.usdToLocal(act.costUsd || 0, s.countryId);
      const hasSynergy = act.boostTrait && traits.includes(act.boostTrait);
      const boostObj = act.boostTrait ? ActivitiesDeck.getTraitObj(act.boostTrait) : null;

      return `
        <button class="action-item deck-act-btn ${act.isRare ? 'rare-activity' : ''}" data-deck-id="${act.id}" ${done || (s.prison && s.prison.inPrison) ? 'disabled' : ''}>
          <span class="ai-icon">${act.icon}</span>
          <span class="ai-content">
            <span class="ai-title">${Utils.escapeHtml(act.title)}</span>
            <span class="ai-desc">
              <span class="cat-badge ${act.isRare ? 'rare' : ''}">${Utils.escapeHtml(act.cat)}</span>
              ${hasSynergy && boostObj ? `<span class="cat-badge synergy">${boostObj.icon} Serasi ${boostObj.name}</span>` : ''}
              <br/>${Utils.escapeHtml(act.desc)}
            </span>
          </span>
          <span class="ai-right ${costLocal > 0 ? 'cost' : ''}">${done ? '✓ Selesai' : (costLocal === 0 ? 'Percuma' : Utils.formatMoney(costLocal, s.countryId))}</span>
        </button>
      `;
    }).join('');

    return `
      <div class="info-banner highlight">
        <strong>🎲 Dek Aktiviti Rawak Tahun ${s.year} (${s.yearlyDeck.length} Pilihan)</strong><br/>
        Dek ini dirombak setiap tahun mengikut umur, personaliti &amp; tuah anda. Setiap pilihan mempunyai hasil <em>Kemenangan Besar</em>, <em>Biasa</em> atau <em>Plot Twist</em>!
        <div class="traits-row" style="margin-top:6px;">${traitsHtml}</div>
      </div>
      <div class="action-list">${cardsHtml || '<div class="info-banner">Tiada aktiviti sesuai untuk umur anda sekarang — klik +UMUR untuk membesar!</div>'}</div>
    `;
  },

  bindDynamicActivities(onRefresh) {
    document.querySelectorAll('.deck-act-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = ActivitiesDeck.performActivity(btn.dataset.deckId);
        App.toast(res.msg.slice(0, 96) + (res.msg.length > 96 ? '...' : ''), res.tier === 'win' ? 'success' : res.tier === 'fail' ? 'error' : 'culture');
        App.renderAll();
        if (typeof onRefresh === 'function') onRefresh();
      });
    });
  },

  checkAndToastPendingPrime() {
    if (window.Dynasty && Dynasty.pendingPrimeAchievement) {
      const b = Dynasty.pendingPrimeAchievement;
      Dynasty.pendingPrimeAchievement = null;
      App.toast(`👑 PENCAPAIAN PERDANA GEN ${b.gen}: ${b.title}! (${b.bonusDesc})`, 'success');
    }
  }
};
