/* ==========================================================================
   WorldLife — Enjin Aktiviti Mod Dinamik (Anti-Ulang, Reroll 2/2, Tenaga 3/3,
   Peringkat Tahap 1–3 & Dilema Interaktif 40% untuk Semua Mod Khas)
   Bahasa Melayu
   ========================================================================== */

window.ModeEngine = {
  MAX_ACTIONS_PER_YEAR: 3,
  MAX_REROLLS_PER_YEAR: 2,
  ALL_MODES: ['politic', 'mafia', 'crime', 'artist', 'actor', 'prison'],

  ensureFields(s) {
    if (!s) return;
    if (!s.modeBoards || typeof s.modeBoards !== 'object') s.modeBoards = {};
    for (const m of this.ALL_MODES) {
      if (!s.modeBoards[m]) {
        s.modeBoards[m] = {
          actions: [],
          recentIds: [],
          actionsLeft: this.MAX_ACTIONS_PER_YEAR,
          rerollsLeft: this.MAX_REROLLS_PER_YEAR,
          lastYear: -1,
          highestTierSeen: 1,
          newTierBadge: false
        };
      }
    }
  },

  // Tentukan Tahap (Tier 1 / 2 / 3) berdasarkan pangkat/kemajuan semasa dalam mod!
  getModeTier(s, modeKey) {
    if (!s) return 1;
    if (modeKey === 'politic' && s.modes && s.modes.politic) {
      const idx = s.modes.politic.rankIndex || 0;
      return idx >= 4 ? 3 : idx >= 2 ? 2 : 1;
    }
    if (modeKey === 'mafia' && s.modes && s.modes.mafia) {
      const idx = s.modes.mafia.rankIndex || 0;
      return idx >= 4 ? 3 : idx >= 2 ? 2 : 1;
    }
    if (modeKey === 'crime' && s.modes && s.modes.crime) {
      const ops = (s.modes.crime.opsSuccess || 0) + ((s.modes.crime.heistsDone || 0) * 2);
      return ops >= 6 ? 3 : ops >= 2 ? 2 : 1;
    }
    if (modeKey === 'artist' && s.modes && s.modes.artist) {
      const idx = s.modes.artist.rankIndex || 0;
      return idx >= 3 ? 3 : idx >= 1 ? 2 : 1;
    }
    if (modeKey === 'actor' && s.modes && s.modes.actor) {
      const idx = s.modes.actor.rankIndex || 0;
      return idx >= 3 ? 3 : idx >= 1 ? 2 : 1;
    }
    if (modeKey === 'prison' && s.prison) {
      const resp = s.prison.respect || 0;
      return resp >= 70 ? 3 : resp >= 35 ? 2 : 1;
    }
    return 1;
  },

  // Jana papan 5–6 tindakan segar tahunan dengan penapis anti-ulang & Tahap 1–3
  generateBoard(s, modeKey, opts = {}) {
    if (!s || !window.ModeActivitiesData || !ModeActivitiesData.POOLS[modeKey]) return [];
    this.ensureFields(s);
    const mb = s.modeBoards[modeKey];
    const currentTier = this.getModeTier(s, modeKey);

    if (currentTier > (mb.highestTierSeen || 1)) {
      mb.highestTierSeen = currentTier;
      mb.newTierBadge = true;
    } else if (!opts.isReroll) {
      mb.newTierBadge = false;
    }

    if (!opts.isReroll) {
      mb.actionsLeft = this.MAX_ACTIONS_PER_YEAR;
      mb.rerollsLeft = this.MAX_REROLLS_PER_YEAR;
      mb.lastYear = s.year;
      if (mb.actions.length > 0) {
        mb.recentIds = [...mb.actions, ...(mb.recentIds || [])].slice(0, 12);
      }
    } else if (mb.actions.length > 0) {
      mb.recentIds = [...mb.actions, ...(mb.recentIds || [])].slice(0, 12);
    }

    const pool = ModeActivitiesData.POOLS[modeKey];
    const prevSet = new Set(mb.actions || []);
    const recentSet = new Set(mb.recentIds || []);

    let eligibleNormal = pool.filter(a => !a.isRare && (a.tier || 1) <= currentTier && !recentSet.has(a.id));
    if (eligibleNormal.length < 6) {
      eligibleNormal = pool.filter(a => !a.isRare && (a.tier || 1) <= currentTier && !prevSet.has(a.id));
    }
    if (eligibleNormal.length < 5) {
      eligibleNormal = pool.filter(a => !a.isRare && (a.tier || 1) <= currentTier);
    }

    const eligibleRare = pool.filter(a => a.isRare && (a.tier || 1) <= Math.max(2, currentTier) && !prevSet.has(a.id));
    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

    const targetSize = Utils.randInt(5, 6);
    const chosen = [];
    const add = (item) => {
      if (item && !chosen.includes(item.id)) chosen.push(item.id);
    };

    // 18% peluang muncul 1 kad emas "Peluang Emas / Krisis Besar"
    if (eligibleRare.length > 0 && Utils.chance(0.18)) {
      add(Utils.pick(eligibleRare));
    }

    // Utamakan 1–2 aktiviti daripada tahap tertinggi yang baru dibuka!
    const topTierPool = shuffle(eligibleNormal.filter(a => (a.tier || 1) === currentTier));
    for (const a of topTierPool.slice(0, 2)) add(a);

    for (const a of shuffle(eligibleNormal)) {
      if (chosen.length >= targetSize) break;
      add(a);
    }

    mb.actions = chosen;
    return chosen;
  },

  refreshAllYearlyBoards(s) {
    if (!s) return;
    this.ensureFields(s);
    for (const m of this.ALL_MODES) {
      this.generateBoard(s, m, { isReroll: false });
    }
  },

  rerollBoard(modeKey) {
    const s = GameState.current;
    this.ensureFields(s);
    const mb = s.modeBoards[modeKey];
    if (!mb) return { ok: false, msg: 'Mod tidak dikenali.' };
    if (mb.rerollsLeft <= 0) {
      return { ok: false, msg: 'Anda telah menggunakan kesemua 2 tukaran "Cari Peluang Lain" tahun ini!' };
    }
    mb.rerollsLeft -= 1;
    this.generateBoard(s, modeKey, { isReroll: true });
    GameState.save();
    return { ok: true, msg: `🎲 Peluang mod disegarkan! (Baki: ${mb.rerollsLeft}/${this.MAX_REROLLS_PER_YEAR})` };
  },

  performModeAction(modeKey, actId) {
    const s = GameState.current;
    GameState.ensureUpgradedState();
    this.ensureFields(s);
    const mb = s.modeBoards[modeKey];
    if (!mb) return { ok: false, msg: 'Mod tidak dikenali.' };

    if (modeKey !== 'prison' && s.prison && s.prison.inPrison) {
      return { ok: false, msg: '⛓️ Anda sedang berada di dalam penjara!' };
    }
    if (modeKey === 'prison' && !(s.prison && s.prison.inPrison)) {
      return { ok: false, msg: 'Anda tidak berada di dalam penjara.' };
    }

    const doneKey = `mode_${modeKey}_${actId}`;
    if (s.yearlyActions[doneKey]) {
      return { ok: false, msg: 'Anda sudah melaksanakan tindakan ini tahun ini!' };
    }
    if ((mb.actionsLeft || 0) <= 0) {
      return { ok: false, msg: `⚡ Tindakan Mod tahun ini telah habis (0/${this.MAX_ACTIONS_PER_YEAR})! Klik +UMUR untuk tahun baharu.` };
    }

    const pool = ModeActivitiesData.POOLS[modeKey] || [];
    const act = pool.find(a => a.id === actId);
    if (!act) return { ok: false, msg: 'Tindakan tidak ditemui.' };

    mb.actionsLeft -= 1;
    s.yearlyActions[doneKey] = true;
    mb.newTierBadge = false;
    if (!mb.recentIds.includes(act.id)) {
      mb.recentIds.unshift(act.id);
      if (mb.recentIds.length > 14) mb.recentIds.length = 14;
    }

    // 40% peluang mencetuskan Modal Dilema Interaktif Khusus Mod!
    const dilemma = this._maybeBuildDilemma(s, modeKey, act, false);
    if (dilemma) {
      GameState.save();
      return { ok: true, dilemmaEvent: dilemma, msg: `⚡ Dilema Mod semasa ${act.title}!` };
    }

    const summary = this._applyModeEffects(s, modeKey, act.effects || {});
    GameState.addJournalEntry(`${act.icon} ${act.title}: ${summary}`, act.isRare ? 'milestone' : 'culture');
    if (window.CharacterStatus) CharacterStatus.recordPeakRole(s);
    GameState.save();
    return { ok: true, msg: `${act.icon} ${act.title} selesai! ${summary}` };
  },

  _applyModeEffects(s, modeKey, eff) {
    const notes = [];
    if (eff.moneyUsd) {
      const amt = Utils.usdToLocal(eff.moneyUsd, s.countryId);
      s.money += amt;
      notes.push(`${amt >= 0 ? '+' : ''}${Utils.formatMoney(amt, s.countryId)}`);
    }
    if (eff.approval && s.modes.politic && s.modes.politic.active) {
      s.modes.politic.approval = Utils.clamp((s.modes.politic.approval || 40) + eff.approval, 0, 100);
      notes.push(`Sokongan ${eff.approval >= 0 ? '+' : ''}${eff.approval}%`);
    }
    if (eff.respect) {
      if (modeKey === 'mafia' && s.modes.mafia && s.modes.mafia.active) {
        s.modes.mafia.respect = Utils.clamp((s.modes.mafia.respect || 10) + eff.respect, 0, 100);
        if (window.UnderworldModes && UnderworldModes._checkMafiaPromotion) UnderworldModes._checkMafiaPromotion(s);
        notes.push(`Hormat Sindiket ${eff.respect >= 0 ? '+' : ''}${eff.respect}%`);
      } else if (modeKey === 'prison' && s.prison && s.prison.inPrison) {
        s.prison.respect = Utils.clamp((s.prison.respect || 20) + eff.respect, 0, 100);
        notes.push(`Hormat Banduan ${eff.respect >= 0 ? '+' : ''}${eff.respect}%`);
      }
    }
    if (eff.behavior && s.prison && s.prison.inPrison) {
      s.prison.behavior = Utils.clamp((s.prison.behavior || 50) + eff.behavior, 0, 100);
      notes.push(`Kelakuan ${eff.behavior >= 0 ? '+' : ''}${eff.behavior}%`);
    }
    if (eff.reduceYears && s.prison && s.prison.inPrison) {
      s.prison.yearsLeft = Math.max(0, (s.prison.yearsLeft || 1) - eff.reduceYears);
      notes.push(`Hukuman -${eff.reduceYears} thn`);
    }
    if (eff.skill) {
      if (modeKey === 'artist' && s.modes.artist && s.modes.artist.active) {
        s.modes.artist.skill = Utils.clamp((s.modes.artist.skill || 10) + eff.skill, 0, 100);
        if (window.FameModes && FameModes._checkArtistPromo) FameModes._checkArtistPromo(s);
        notes.push(`Bakat Seni +${eff.skill}%`);
      } else if (modeKey === 'actor' && s.modes.actor && s.modes.actor.active) {
        s.modes.actor.skill = Utils.clamp((s.modes.actor.skill || 10) + eff.skill, 0, 100);
        if (window.FameModes && FameModes._checkActorPromo) FameModes._checkActorPromo(s);
        notes.push(`Bakat Lakonan +${eff.skill}%`);
      }
    }
    if (modeKey === 'crime' && (eff.moneyUsd || 0) > 0) {
      s.modes.crime.opsSuccess = (s.modes.crime.opsSuccess || 0) + 1;
    }
    if (eff.followers && s.socialMedia) {
      s.socialMedia.followers = Math.max(0, (s.socialMedia.followers || 0) + eff.followers);
      notes.push(`Pengikut ${eff.followers >= 0 ? '+' : ''}${eff.followers.toLocaleString()}`);
    }
    const statDelta = {};
    if (eff.happiness) statDelta.happiness = eff.happiness;
    if (eff.health) statDelta.health = eff.health;
    if (eff.smarts) statDelta.smarts = eff.smarts;
    if (eff.looks) statDelta.looks = eff.looks;
    if (Object.keys(statDelta).length > 0) GameState.adjustStats(statDelta);

    if (window.KarmaEndings && (eff.karma || eff.fame || eff.notoriety || eff.stress)) {
      KarmaEndings.adjustAlignment({
        karma: eff.karma || 0,
        fame: eff.fame || 0,
        notoriety: eff.notoriety || 0,
        stress: eff.stress || 0
      });
    }
    if (eff.rep && window.Dynasty) {
      Dynasty.adjustReputation(eff.rep);
      notes.push(`Reputasi Keluarga ${eff.rep >= 0 ? '+' : ''}${eff.rep}%`);
    }

    // Semak jika baru naik tahap (Tier 2 / Tier 3)
    const mb = s.modeBoards[modeKey];
    const nowTier = this.getModeTier(s, modeKey);
    if (mb && nowTier > (mb.highestTierSeen || 1)) {
      mb.highestTierSeen = nowTier;
      mb.newTierBadge = true;
      notes.push(`🆕 Tahap ${nowTier} Dibuka!`);
    }

    return notes.length > 0 ? notes.join(' • ') : 'Tindakan berjaya dilaksanakan.';
  },

  _maybeBuildDilemma(s, modeKey, act, force = false) {
    if (!window.ModeActivitiesData || !ModeActivitiesData.DILEMMAS[modeKey]) return null;
    if (!force && !Utils.chance(0.40)) return null;
    const list = ModeActivitiesData.DILEMMAS[modeKey];
    if (!list || list.length === 0) return null;

    const d = Utils.pick(list);
    return {
      id: `${d.id}_${s.age}_${Date.now()}`,
      icon: d.icon || act.icon,
      title: d.title,
      text: d.text,
      choices: d.choices.map(ch => ({
        label: ch.label,
        hint: ch.hint || '',
        journalType: (ch.effects && (ch.effects.karma || 0) < -8) ? 'warning' : 'milestone',
        customAction: () => {
          const summary = this._applyModeEffects(s, modeKey, ch.effects || {});
          if (window.CharacterStatus) CharacterStatus.recordPeakRole(s);
          return {
            outcome: `${ch.outcome} (${summary})`,
            toastType: (ch.effects && (ch.effects.karma || 0) < -8) ? 'error' : 'success'
          };
        }
      }))
    };
  },

  // --------------------------------------------------------------------------
  // KOMPONEN UI BOLEH GUNA SEMULA UNTUK SEMUA MOD
  // --------------------------------------------------------------------------
  renderDynamicBoardHtml(s, modeKey, labelTitle = 'Tindakan Mod Dinamik') {
    this.ensureFields(s);
    const mb = s.modeBoards[modeKey];
    if (mb.actions.length === 0 || mb.lastYear !== s.year) {
      this.generateBoard(s, modeKey, { isReroll: false });
    }
    const tier = this.getModeTier(s, modeKey);
    const pool = ModeActivitiesData.POOLS[modeKey] || [];
    const items = mb.actions.map(id => pool.find(a => a.id === id)).filter(Boolean);
    const aLeft = mb.actionsLeft ?? 3;
    const rLeft = mb.rerollsLeft ?? 2;
    const inPrison = Boolean(s.prison && s.prison.inPrison);
    const blockedByPrison = modeKey !== 'prison' && inPrison;

    const pips = Array.from({ length: this.MAX_ACTIONS_PER_YEAR }, (_, i) =>
      `<span class="energy-pip ${i < aLeft ? 'full' : 'empty'}">⚡</span>`
    ).join('');

    const cards = items.map(act => {
      const done = Boolean(s.yearlyActions[`mode_${modeKey}_${act.id}`]);
      const disabled = done || aLeft <= 0 || blockedByPrison;
      return `
        <button type="button" class="action-item mode-dyn-act-btn ${act.isRare ? 'rare-activity' : ''} ${done ? 'act-done-card' : ''}" data-mkey="${modeKey}" data-mact-id="${act.id}" ${disabled ? 'disabled' : ''}>
          <span class="ai-icon">${act.icon}</span>
          <span class="ai-content">
            <span class="ai-title">
              ${Utils.escapeHtml(act.title)}
              ${act.isRare ? '<span class="rare-gold-tag">🌟 PELUANG EMAS</span>' : ''}
            </span>
            <span class="ai-desc">
              <span class="cat-badge ${act.tier >= 3 ? 'rare' : act.tier === 2 ? 'synergy' : ''}">Tahap ${act.tier}</span>
              <br/>${Utils.escapeHtml(act.desc)}
            </span>
          </span>
          <span class="ai-right">
            <span class="act-status-pill ${done ? 'done' : 'free'}">${done ? '✓ Selesai' : 'Laksana →'}</span>
          </span>
        </button>
      `;
    }).join('');

    return `
      <div class="act-engine-header" style="margin-top:10px;">
        <div class="aeh-top">
          <div>
            <div class="aeh-title">
              🎯 ${Utils.escapeHtml(labelTitle)} (Tahap ${tier}/3)
              ${mb.newTierBadge ? '<span class="rare-gold-tag">🆕 Tindakan Tahap Baharu Dibuka!</span>' : ''}
            </div>
            <div class="aeh-sub">5–6 peluang rawak anti-ulang setiap tahun + Dilema Interaktif 40%</div>
          </div>
          <button type="button" class="reroll-idea-btn mode-reroll-btn" data-mkey="${modeKey}" ${rLeft <= 0 || blockedByPrison ? 'disabled' : ''}>
            🎲 Cari Peluang Lain (${rLeft}/2)
          </button>
        </div>
        <div class="aeh-energy-bar">
          <span class="aeh-energy-lbl">Tindakan Mod Tahun Ini: <strong>${aLeft}/${this.MAX_ACTIONS_PER_YEAR}</strong></span>
          <span class="aeh-energy-pips">${pips}</span>
        </div>
      </div>
      <div class="action-list">${cards}</div>
    `;
  },

  bindDynamicBoard(onRefresh) {
    document.querySelectorAll('.mode-reroll-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = this.rerollBoard(btn.dataset.mkey);
        App.toast(res.msg, res.ok ? 'culture' : 'error');
        if (typeof onRefresh === 'function') onRefresh();
      });
    });

    document.querySelectorAll('.mode-dyn-act-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = this.performModeAction(btn.dataset.mkey, btn.dataset.mactId);
        App.renderAll();
        if (res.dilemmaEvent) {
          Modals.showEvent(res.dilemmaEvent);
          return;
        }
        App.toast(res.msg, res.ok ? 'success' : 'error');
        if (typeof onRefresh === 'function') onRefresh();
      });
    });
  }
};
