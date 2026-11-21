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
        ${window.Quotes ? Quotes.renderQuoteCard(
          Quotes.getByCategory(d.legacyStatus === 'Tarnished' ? 'tarnished' : (d.legacyStatus === 'Redeemed' || Dynasty.isPrime(d.generation) ? 'redeemed_or_prime' : 'new_life')),
          d.legacyStatus === 'Tarnished' ? 'Renungan Saat Diuji' : 'Falsafah Dinasti'
        ) : ''}

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
  // 2. PAPAN AKTIVITI DINAMIK (7–8 Kad, Tenaga 3/3, Cari Idea Lain & Penapis Kategori)
  // --------------------------------------------------------------------------
  _activeCatFilter: 'ALL',

  renderDynamicActivitiesTab(s, c) {
    GameState.ensureUpgradedState();
    ActivitiesDeck.ensureActivityState(s);

    if (s.age >= 5 && (!Array.isArray(s.yearlyDeck) || s.yearlyDeck.length === 0)) {
      ActivitiesDeck.generateYearlyDeck(s);
    }

    const traits = s.traits || [];
    const traitsHtml = traits.map(tid => {
      const t = ActivitiesDeck.getTraitObj(tid);
      return `<span class="trait-chip" title="${Utils.escapeHtml(t.desc)}">${t.icon} ${Utils.escapeHtml(t.name)}</span>`;
    }).join('');

    const eLeft = s.activityEnergyLeft ?? 3;
    const eMax = s.activityEnergyMax ?? 3;
    const rLeft = s.activityRerollsLeft ?? 2;
    const stageLbl = ActivitiesDeck.getAgeStageLabel(s.age);

    const energyDots = Array.from({ length: eMax }, (_, idx) =>
      `<span class="energy-pip ${idx < eLeft ? 'full' : 'empty'}">⚡</span>`
    ).join('');

    const filterDefs = (window.ActivitiesData && ActivitiesData.CATEGORIES) ? ActivitiesData.CATEGORIES : [
      { id: 'ALL', label: 'Semua', icon: '✨' }
    ];
    const curFilter = this._activeCatFilter || 'ALL';
    const filterDef = filterDefs.find(f => f.id === curFilter) || filterDefs[0];

    const filterPillsHtml = filterDefs.map(f => `
      <button type="button" class="tab-pill act-cat-filter ${f.id === curFilter ? 'active' : ''}" data-act-cat="${f.id}">
        ${f.icon} ${Utils.escapeHtml(f.label)}
      </button>
    `).join('');

    if (s.age < 5) {
      return `
        <div class="info-banner highlight">
          <strong>👶 Peringkat Bayi &amp; Kanak-Kanak Awal (Umur ${s.age} Tahun)</strong><br/>
          Papan Aktiviti Dunia Sebenar akan dibuka bermula pada <strong>umur 5 tahun</strong>! Klik butang <strong>+UMUR</strong> untuk membesar.
          <div class="traits-row" style="margin-top:6px;">${traitsHtml}</div>
        </div>
      `;
    }

    const deckActivities = (s.yearlyDeck || [])
      .map(id => ActivitiesDeck.POOL.find(a => a.id === id))
      .filter(Boolean);

    const filtered = deckActivities.filter(act => {
      if (curFilter === 'ALL') return true;
      if (filterDef && Array.isArray(filterDef.match)) {
        return filterDef.match.includes(act.category);
      }
      return true;
    });

    const cardsHtml = filtered.map(act => {
      const done = Boolean(s.yearlyActions['deck_' + act.id]);
      const noEnergy = !done && eLeft < (act.energyCost || 1);
      const inPrison = Boolean(s.prison && s.prison.inPrison);
      const costLocal = ActivitiesDeck.getLocalCost(act, s);
      const pref = act.preferredTraits || (act.boostTrait ? [act.boostTrait] : []);
      const matchedTraitId = pref.find(t => traits.includes(t));
      const boostObj = matchedTraitId ? ActivitiesDeck.getTraitObj(matchedTraitId) : null;
      const descText = window.ActivitiesData
        ? ActivitiesData.formatFlavorText(act.desc, s.countryId)
        : act.desc;

      let rightBadge = '';
      if (done) {
        rightBadge = `<span class="act-status-pill done">✓ Sudah Dilakukan</span>`;
      } else if (costLocal === 0) {
        rightBadge = `<span class="act-status-pill free">Percuma</span>`;
      } else {
        rightBadge = `<span class="act-status-pill cost">${Utils.formatMoney(costLocal, s.countryId)}</span>`;
      }

      return `
        <button type="button" class="action-item deck-act-btn ${act.isRare ? 'rare-activity' : ''} ${done ? 'act-done-card' : ''}" data-deck-id="${act.id}" ${done || noEnergy || inPrison ? 'disabled' : ''}>
          <span class="ai-icon">${act.icon}</span>
          <span class="ai-content">
            <span class="ai-title">
              ${Utils.escapeHtml(act.title)}
              ${act.isRare ? '<span class="rare-gold-tag">🌟 PELUANG TERHAD</span>' : ''}
            </span>
            <span class="ai-desc">
              <span class="cat-badge ${act.isRare ? 'rare' : ''}">${Utils.escapeHtml(act.category || act.cat)}</span>
              ${boostObj ? `<span class="cat-badge synergy">${boostObj.icon} Serasi ${Utils.escapeHtml(boostObj.name)}</span>` : ''}
              <br/>${Utils.escapeHtml(descText)}
            </span>
          </span>
          <span class="ai-right">${rightBadge}</span>
        </button>
      `;
    }).join('');

    const emptyMsg = deckActivities.length === 0
      ? '<div class="info-banner">Tiada aktiviti untuk umur ini — klik +UMUR untuk melangkah ke tahun seterusnya!</div>'
      : `<div class="info-banner">Tiada kad dalam kategori <strong>${Utils.escapeHtml(filterDef.label)}</strong> pada dek semasa. Cuba pilih tab <strong>Semua</strong> atau klik <strong>🎲 Cari Idea Lain</strong>!</div>`;

    return `
      <div class="act-engine-header">
        <div class="aeh-top">
          <div>
            <div class="aeh-title">🌍 Aktiviti Tahun ${s.year} • ${Utils.escapeHtml(stageLbl)}</div>
            <div class="aeh-sub">${c.flag} ${Utils.escapeHtml(s.city)}, ${Utils.escapeHtml(c.name)} • ${deckActivities.length} Idea Segar</div>
          </div>
          <button type="button" class="reroll-idea-btn" id="btn-reroll-activities" ${rLeft <= 0 || (s.prison && s.prison.inPrison) ? 'disabled' : ''}>
            🎲 Cari Idea Lain (${rLeft}/2)
          </button>
        </div>
        <div class="aeh-energy-bar">
          <span class="aeh-energy-lbl">Tenaga Tahun Ini: <strong>${eLeft}/${eMax}</strong></span>
          <span class="aeh-energy-pips">${energyDots}</span>
        </div>
        <div class="traits-row" style="margin-top:6px;">${traitsHtml}</div>
      </div>

      <div class="tab-pills act-filter-bar" style="margin-bottom:10px;">
        ${filterPillsHtml}
      </div>

      <div class="action-list">${cardsHtml || emptyMsg}</div>
    `;
  },

  bindDynamicActivities(onRefresh) {
    document.querySelectorAll('.act-cat-filter').forEach(pill => {
      pill.addEventListener('click', () => {
        this._activeCatFilter = pill.dataset.actCat || 'ALL';
        if (typeof onRefresh === 'function') onRefresh();
      });
    });

    const rerollBtn = document.getElementById('btn-reroll-activities');
    if (rerollBtn) {
      rerollBtn.addEventListener('click', () => {
        this._activeCatFilter = 'ALL';
        const res = ActivitiesDeck.rerollDeck();
        App.toast(res.msg, res.ok ? 'culture' : 'error');
        if (typeof onRefresh === 'function') onRefresh();
      });
    }

    document.querySelectorAll('.deck-act-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = ActivitiesDeck.performActivity(btn.dataset.deckId);
        App.renderAll();

        // Jika mencetuskan Modal Pertemuan Mini Interaktif (Real-World Plot Twist!)
        if (res.encounterEvent) {
          Modals.showEvent(res.encounterEvent);
          return;
        }

        const msg = res.msg || '';
        App.toast(msg.slice(0, 96) + (msg.length > 96 ? '...' : ''), res.tier === 'win' ? 'success' : res.tier === 'fail' ? 'error' : 'culture');
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
