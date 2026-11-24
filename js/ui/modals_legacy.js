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

    const darkSectionHtml = (() => {
      const inPrison = Boolean(s.prison && s.prison.inPrison);
      const isMafiaMember = Boolean(s.activeSpecialMode && s.activeSpecialMode.modeId === 'mafia');
      const spInfo = isMafiaMember && window.SpecialModesEngine ? SpecialModesEngine.getActiveInfo(s) : null;
      const mafiaTopCard = isMafiaMember && spInfo ? `
        <button type="button" class="action-item" id="deck-open-mafia-panel" ${inPrison ? 'disabled' : ''}>
          <span class="ai-icon">🕶️</span>
          <span class="ai-content">
            <span class="ai-title">Panel Sindiket Mafia • ${Utils.escapeHtml(spInfo.rank.title)}</span>
            <span class="ai-desc">Pangkat ${spInfo.state.rankIndex + 1}/${spInfo.def.ranks.length} • Buka Misi Sindiket, Sumbangan Ketua &amp; Pilihan Keluar Mafia</span>
          </span>
          <span class="ai-right"><span class="act-status-pill free">Buka Panel →</span></span>
        </button>
      ` : s.age < 18 ? `
        <button type="button" class="action-item" disabled>
          <span class="ai-icon">🕶️</span>
          <span class="ai-content">
            <span class="ai-title">Sertai Mafia / Sindiket</span>
            <span class="ai-desc">Laluan organisasi jenayah terancang</span>
          </span>
          <span class="ai-right"><span class="act-status-pill done">Terbuka umur 18+</span></span>
        </button>
      ` : `
        <button type="button" class="action-item" id="deck-join-mafia" ${s.yearlyActions.mafiaApply || inPrison ? 'disabled' : ''}>
          <span class="ai-icon">🕶️</span>
          <span class="ai-content">
            <span class="ai-title">Cuba Sertai Mafia / Sindiket</span>
            <span class="ai-desc">${s.yearlyActions.mafiaApply ? 'Cubaan tahun ini sudah digunakan (had 1x setahun)' : 'Mohon menyertai organisasi Mafia (peluang rawak • had 1x setahun)'}</span>
          </span>
          <span class="ai-right"><span class="act-status-pill ${s.yearlyActions.mafiaApply ? 'done' : 'free'}">${s.yearlyActions.mafiaApply ? 'Selesai tahun ini' : 'Cuba Sertai →'}</span></span>
        </button>
      `;

      const darkList = (s.age >= 7 && window.Sim && Sim.getYearlyDarkActivities) ? Sim.getYearlyDarkActivities(s) : [];
      const doneDark = Array.isArray(s.yearlyActions.darkDoneIds) ? s.yearlyActions.darkDoneIds : [];
      const darkUsed = s.yearlyActions.darkCount || 0;
      return `
        <div class="section-heading" style="margin-top:14px;">🕶️ Aktiviti Gelap &amp; Sindiket Mafia${darkList.length > 0 ? ` (${darkUsed}/3)` : ''}</div>
        <div class="action-list">
          ${mafiaTopCard}
          ${darkList.map(act => {
            const isDone = doneDark.includes(act.id) || darkUsed >= 3 || inPrison;
            return `
              <button type="button" class="action-item dark-deck-btn ${doneDark.includes(act.id) ? 'act-done-card' : ''}" data-dark-id="${act.id}" ${isDone ? 'disabled' : ''}>
                <span class="ai-icon">${act.icon}</span>
                <span class="ai-content">
                  <span class="ai-title">${Utils.escapeHtml(act.title)}</span>
                  <span class="ai-desc">${Utils.escapeHtml(act.desc)}</span>
                </span>
              </button>
            `;
          }).join('')}
        </div>
      `;
    })();

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
      ${darkSectionHtml}
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

    const deckJoinMafia = document.getElementById('deck-join-mafia');
    if (deckJoinMafia) {
      deckJoinMafia.addEventListener('click', () => {
        const res = Sim.applyToJoinMafia(GameState.current);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        if (res.ok && window.SpecialModeModals) {
          SpecialModeModals.showDashboard();
        } else if (typeof onRefresh === 'function') {
          onRefresh();
        }
      });
    }

    const deckOpenMafia = document.getElementById('deck-open-mafia-panel');
    if (deckOpenMafia) {
      deckOpenMafia.addEventListener('click', () => {
        if (window.SpecialModeModals) SpecialModeModals.showDashboard();
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

    const showVerdict = (verdictModal) => {
      Modals.open({
        icon: verdictModal.icon,
        title: verdictModal.title,
        subtitle: verdictModal.subtitle,
        bodyHtml: `
          <div class="info-banner" style="background:#fef2f2;border-color:#fecaca;color:#991b1b;white-space:pre-line;line-height:1.55;">
            ${Utils.escapeHtml(verdictModal.text)}
          </div>
          <button type="button" id="btn-verdict-ok" class="primary-btn" style="width:100%;margin-top:10px;">Faham</button>
        `
      });
      const okBtn = document.getElementById('btn-verdict-ok');
      if (okBtn) okBtn.addEventListener('click', () => Modals.close(true));
    };

    const runDark = (darkId, targetLabel = null) => {
      const res = Sim.performDarkActivity(darkId, targetLabel);
      App.renderAll();

      if (res.escapePrompt) {
        const ep = res.escapePrompt;
        Modals.open({
          icon: '🚨',
          title: 'Anda Dikesan!',
          subtitle: `${ep.countryFlag} ${ep.countryName}`,
          locked: true,
          bodyHtml: `
            <div class="info-banner" style="background:#fffbeb;border-color:#fde68a;color:#92400e;line-height:1.55;">
              Tindakan anda semasa <strong>${Utils.escapeHtml(ep.crimeLabel)}</strong> telah dikesan! Pilih tindakan pantas anda sebelum ditahan.
            </div>
            <div class="action-list" style="margin-top:10px;">
              <button type="button" class="action-item dark-escape-btn" data-choice="run">
                <span class="ai-icon">🏃</span>
                <span class="ai-content">
                  <span class="ai-title">Pecut Lari</span>
                  <span class="ai-desc">Cuba melarikan diri secepat mungkin dari lokasi kejadian</span>
                </span>
              </button>
              <button type="button" class="action-item dark-escape-btn" data-choice="bluff">
                <span class="ai-icon">🗣️</span>
                <span class="ai-content">
                  <span class="ai-title">Berdalih</span>
                  <span class="ai-desc">Cuba pujuk dan beri alasan meyakinkan untuk dilepaskan</span>
                </span>
              </button>
              <button type="button" class="action-item dark-escape-btn" data-choice="surrender">
                <span class="ai-icon">✋</span>
                <span class="ai-content">
                  <span class="ai-title">Serah Diri</span>
                  <span class="ai-desc">Mengaku salah dan beri kerjasama penuh tanpa melawan</span>
                </span>
              </button>
            </div>
          `
        });
        document.querySelectorAll('.dark-escape-btn').forEach(eb => {
          eb.addEventListener('click', () => {
            const escRes = Sim.resolveDarkEscape(ep.actId, eb.dataset.choice, ep.targetLabel);
            App.renderAll();
            if (escRes.verdictModal) {
              showVerdict(escRes.verdictModal);
            } else {
              Modals.close(true);
              App.toast(escRes.msg, escRes.ok ? 'culture' : 'error');
            }
          });
        });
        return;
      }

      if (res.verdictModal) {
        showVerdict(res.verdictModal);
        return;
      }
      App.toast(res.msg, res.ok ? 'culture' : 'error');
      if (typeof onRefresh === 'function') onRefresh();
    };

    document.querySelectorAll('.dark-deck-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const darkId = btn.dataset.darkId;
        const def = Sim.DARK_ACTIVITIES_POOL.find(a => a.id === darkId);
        if (def && def.requiresTarget) {
          const targets = ['Orang Awam Rawak', 'Pesaing / Musuh', 'Kenalan'];
          Modals.open({
            icon: '⚠️',
            title: def.title,
            subtitle: 'Pilih sasaran tindakan anda',
            bodyHtml: `
              <div class="action-list">
                ${targets.map(t => `
                  <button type="button" class="action-item dark-target-btn" data-target="${Utils.escapeHtml(t)}">
                    <span class="ai-icon">🎯</span>
                    <span class="ai-content">
                      <span class="ai-title">${Utils.escapeHtml(t)}</span>
                    </span>
                  </button>
                `).join('')}
              </div>
              <button type="button" id="btn-dark-target-cancel" class="secondary-btn" style="width:100%;margin-top:8px;">Batal</button>
            `
          });
          document.querySelectorAll('.dark-target-btn').forEach(tb => {
            tb.addEventListener('click', () => runDark(darkId, tb.dataset.target));
          });
          const cancelBtn = document.getElementById('btn-dark-target-cancel');
          if (cancelBtn) cancelBtn.addEventListener('click', () => { if (typeof onRefresh === 'function') onRefresh(); });
          return;
        }
        runDark(darkId);
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
