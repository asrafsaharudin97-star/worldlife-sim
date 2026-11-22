/* ==========================================================================
   WorldLife — Enjin 10 Mod Khas "Peluang Sekali Seumur Hidup"
   Tiada Menu Statik — Tawaran Rawak Sekali Seumur Hidup, Kelahiran Diraja,
   Integrasi 195 Negara (Perisik & Pengembara), Burn Notice, Risiko Keluar Mod,
   Kunci Kekal Sepanjang Hayat & Migrasi Selamat Simpanan Lama (Bahasa Melayu)
   ========================================================================== */

window.SpecialModesEngine = {
  MAX_ACTIONS_YEAR: 3,
  MAX_REROLLS_YEAR: 1,

  // --------------------------------------------------------------------------
  // 1. PENYELARASAN KEADAAN & MIGRASI BERSIH SIMPANAN LAMA (5 MOD LAMA DIBUANG)
  // --------------------------------------------------------------------------
  ensureFields(s) {
    if (!s) return;
    if (!('activeSpecialMode' in s)) s.activeSpecialMode = null;
    if (!Array.isArray(s.offeredModeIds)) s.offeredModeIds = [];
    if (!Array.isArray(s.exitedModeIds)) s.exitedModeIds = [];
    if (typeof s.formerLeaderPension !== 'number') s.formerLeaderPension = 0;
    if (!Array.isArray(s.countriesVisited)) {
      s.countriesVisited = Array.isArray(s.countriesLivedIn) ? [...new Set(s.countriesLivedIn)] : [s.countryId].filter(Boolean);
    }
    if (s.countryId && !s.countriesVisited.includes(s.countryId)) {
      s.countriesVisited.push(s.countryId);
    }
    if (!('spyBurnNotice' in s)) s.spyBurnNotice = null;
    if (typeof s.nobelDisqualified !== 'boolean') s.nobelDisqualified = false;
    if (typeof s.bornRoyal !== 'boolean') s.bornRoyal = false;

    // Migrasi automatik: buang medan 5 mod lama yang telah ditamatkan tanpa ralat
    if (s.modes || s.modeBoards) {
      delete s.modes;
      delete s.modeBoards;
    }

    if (s.activeSpecialMode) {
      const am = s.activeSpecialMode;
      if (!Array.isArray(am.recentActionIds)) am.recentActionIds = [];
      if (!Array.isArray(am.currentBoard)) am.currentBoard = [];
      if (typeof am.rerollsLeft !== 'number') am.rerollsLeft = this.MAX_REROLLS_YEAR;
      if (typeof am.actionsLeftThisYear !== 'number') am.actionsLeftThisYear = this.MAX_ACTIONS_YEAR;
      if (!am.flags || typeof am.flags !== 'object') am.flags = {};
    }
  },

  getModeDef(modeId) {
    return (window.SpecialModesData && SpecialModesData.MODES[modeId]) || null;
  },

  getActiveInfo(s) {
    if (!s || !s.activeSpecialMode) return null;
    const def = this.getModeDef(s.activeSpecialMode.modeId);
    if (!def) return null;
    const am = s.activeSpecialMode;
    const rank = def.ranks[am.rankIndex] || def.ranks[0];
    return { def, state: am, rank };
  },

  getActiveAnnualUsd(s) {
    const info = this.getActiveInfo(s);
    if (!info) return 0;
    let usd = info.rank.annualUsd || 0;
    if (info.def.id === 'ceo') {
      usd = Math.round(usd * (0.7 + (info.state.metric1 / 100)));
    } else if (info.def.id === 'fund_manager') {
      usd = Math.round(usd * (0.8 + (info.state.metric1 / 120)));
    } else if (info.def.id === 'royalty') {
      usd = Math.round(usd * (0.65 + (info.state.metric2 / 110)));
    } else if (info.def.id === 'explorer') {
      usd = Math.round(usd * (0.75 + (info.state.metric2 / 120)));
    }
    return usd;
  },

  getCeoEquityLocal(s) {
    const info = this.getActiveInfo(s);
    if (!info || info.def.id !== 'ceo') return 0;
    const baseUsd = 85000 * Math.pow(2.4, info.state.rankIndex || 0) * Math.max(0.3, info.state.metric1 / 50);
    return Utils.usdToLocal(Math.round(baseUsd), s.countryId);
  },

  // --------------------------------------------------------------------------
  // 1B. PEMBANTU 195 NEGARA (PERISIK & PENGEMBARA) + KELAHIRAN DIRAJA (2–4%)
  // --------------------------------------------------------------------------
  _getAllCountriesList() {
    if (window.COUNTRIES && typeof window.COUNTRIES === 'object') {
      return Object.values(window.COUNTRIES);
    }
    return [];
  },

  _pickForeignCountry(s, preferUnvisited = false) {
    const all = this._getAllCountriesList().filter(c => c && c.id && c.id !== s.countryId);
    if (all.length === 0) return { id: 'CH', name: 'Switzerland', flag: '🇨🇭' };
    if (preferUnvisited && Array.isArray(s.countriesVisited)) {
      const visitedSet = new Set(s.countriesVisited);
      const unvisited = all.filter(c => !visitedSet.has(c.id));
      if (unvisited.length > 0) return Utils.pick(unvisited);
    }
    return Utils.pick(all);
  },

  _recordExploredCountries(s, count = 1) {
    this.ensureFields(s);
    const newlyDiscovered = [];
    for (let i = 0; i < count; i++) {
      const target = this._pickForeignCountry(s, true);
      if (target && !s.countriesVisited.includes(target.id)) {
        s.countriesVisited.push(target.id);
        newlyDiscovered.push(`${target.flag || '🌍'} ${target.name}`);
      }
    }
    if (s.activeSpecialMode && s.activeSpecialMode.modeId === 'explorer') {
      // Segerakkan metric1 dengan jumlah negara unik daripada 195 negara (60+ negara = 100% tangga pangkat)
      const pct = Math.min(100, Math.round((s.countriesVisited.length / 60) * 100));
      s.activeSpecialMode.metric1 = Math.max(s.activeSpecialMode.metric1, pct);
    }
    return newlyDiscovered;
  },

  maybeGrantBirthRoyalty(s, force = false) {
    if (!s || !window.SpecialModesData) return false;
    this.ensureFields(s);
    const monarchies = SpecialModesData.MONARCHY_COUNTRY_IDS || [];
    if (!monarchies.includes(s.countryId)) return false;
    // Peluang nadir 3% (dalam julat 2–4%) semasa kelahiran di negara beraja!
    if (!force && !Utils.chance(0.03)) return false;

    const c = Utils.getCountry(s.countryId);
    s.bornRoyal = true;
    this.enterMode(s, 'royalty', { silent: true, startRank: 1 });
    s.money += Utils.usdToLocal(45000, s.countryId);
    if (window.Dynasty) Dynasty.adjustReputation(15);
    if (window.KarmaEndings) {
      KarmaEndings.adjustAlignment({ fame: 35 });
      KarmaEndings.addHighlight('👑', `Dilahirkan sebagai Kerabat Diraja di ${c.name}!`);
    }
    GameState.addJournalEntry(
      `👑 KELAHIRAN DIRAJA! Anda ditakdirkan lahir dalam lingkungan istana sebagai Putera/Puteri Kerabat Diraja ${c.name} ${c.flag}!`,
      'milestone'
    );
    GameState.save();
    return true;
  },

  // --------------------------------------------------------------------------
  // 2. ENJIN TAWARAN "PELUANG SEKALI SEUMUR HIDUP" (PADA AGE-UP, UMUR 14+)
  // --------------------------------------------------------------------------
  maybeTriggerLifetimeOffer(s, forceModeId = null) {
    if (!s || !window.SpecialModesData) return null;
    this.ensureFields(s);
    if (s.activeSpecialMode) return null;
    if (s.prison && s.prison.inPrison) return null;
    if (s.age < 14) return null;

    const allDefs = Object.values(SpecialModesData.MODES);
    const eligible = allDefs.filter(m => {
      if (s.offeredModeIds.includes(m.id)) return false;
      if (s.exitedModeIds.includes(m.id)) return false;
      if (s.age < m.minAge || s.age > m.maxAge) return false;
      if (m.id === 'explorer' && s.nobelDisqualified) return false;
      return true;
    });
    if (eligible.length === 0) return null;

    let picked = null;
    if (forceModeId) {
      picked = eligible.find(m => m.id === forceModeId) || null;
      if (!picked) return null;
    } else {
      // 14% peluang asas + lonjakan belas kasihan lembut (pity) selepas umur 30 jika belum pernah ditawarkan mod!
      const neverOffered = s.offeredModeIds.length === 0;
      const prob = (neverOffered && s.age >= 30) ? 0.24 : 0.14;
      if (!Utils.chance(prob)) return null;

      // Pemberat pintar mengikut profil watak (Mafia lebih kerap jika karma rendah/rekod jenayah, Perisik jika pintar & sihat, Diraja jarang)
      const weighted = [];
      const karma = (s.alignment && s.alignment.karma) || 0;
      const fame = (s.alignment && s.alignment.fame) || 0;
      eligible.forEach(m => {
        let w = 10;
        if (m.id === 'mafia') {
          w = (karma <= -10 || (s.criminalRecord || 0) > 0) ? 22 : 4;
        } else if (m.id === 'spy') {
          w = (s.stats.smarts >= 65 && s.stats.health >= 65) ? 18 : 5;
        } else if (m.id === 'royalty') {
          w = (s.stats.looks >= 75 || fame >= 45) ? 7 : 3;
        } else if (m.id === 'athlete') {
          w = s.stats.health >= 70 ? 15 : 8;
        } else if (m.id === 'celebrity') {
          w = (s.stats.looks >= 70 || (s.socialMedia && s.socialMedia.followers >= 5000)) ? 16 : 9;
        }
        for (let i = 0; i < w; i++) weighted.push(m);
      });
      picked = Utils.pick(weighted);
    }

    // Rekodkan sebagai sudah ditawarkan dalam hayat ini
    s.offeredModeIds.push(picked.id);
    GameState.save();

    return {
      id: `lifetime_offer_${picked.id}_${s.age}`,
      icon: picked.icon,
      title: `✨ PELUANG SEKALI SEUMUR HIDUP: ${picked.title}`,
      text: `${picked.offerHeadline}\n\n${picked.offerPitch}\n\n⚠️ AMARAN TAKDIR: Peluang ini hanya hadir SEKALI SEUMUR HIDUP bagi watak ini. Jika anda menolak sekarang, pintu ke Mod ${picked.title} akan tertutup SELAMANYA!`,
      choices: [
        {
          label: `✨ Terima Takdir Ini — Sertai ${picked.title}!`,
          hint: `Mulakan sebagai ${picked.ranks[0].title} (${Utils.formatMoney(Utils.usdToLocal(picked.ranks[0].annualUsd, s.countryId), s.countryId)}/thn)`,
          journalType: 'milestone',
          customAction: (st) => {
            this.enterMode(st, picked.id);
            return {
              outcome: `✨ TAKDIR DITERIMA! Anda rasmi melangkah ke Mod Khas ${picked.icon} ${picked.title} sebagai ${picked.ranks[0].title}!`,
              toastType: 'success'
            };
          }
        },
        {
          label: `🚪 Tolak Peluang (Tutup Pintu Ini Selamanya)`,
          hint: `Mod ${picked.title} akan dikunci kekal untuk sepanjang hayat watak ini`,
          journalType: 'dilemma',
          customAction: (st) => {
            if (!st.exitedModeIds.includes(picked.id)) st.exitedModeIds.push(picked.id);
            GameState.save();
            return {
              outcome: `Anda memilih untuk menolak tawaran ${picked.title}. Peluang itu berlalu pergi dan tidak akan muncul lagi dalam hidup ini.`,
              toastType: 'culture'
            };
          }
        }
      ]
    };
  },

  enterMode(s, modeId, opts = {}) {
    this.ensureFields(s);
    const def = this.getModeDef(modeId);
    if (!def) return { ok: false, msg: 'Mod tidak dikenali.' };
    if (s.exitedModeIds.includes(modeId)) return { ok: false, msg: 'Peluang mod ini sudah tertutup selamanya untuk watak ini.' };

    // Tamatkan kerja biasa yang bercanggah secara bersih
    if (s.job) {
      GameState.addJournalEntry(`🚪 Anda meletak jawatan sebagai ${s.job.title} untuk menyambut peluang sekali seumur hidup: ${def.title}!`, 'culture');
      s.job = null;
    }
    s.retired = false;

    const startRank = Math.max(0, Math.min(def.ranks.length - 1, opts.startRank || 0));
    const initM1 = modeId === 'explorer'
      ? Math.max(def.metric1.init, Math.min(100, Math.round((s.countriesVisited.length / 60) * 100)))
      : def.metric1.init;

    s.activeSpecialMode = {
      modeId,
      rankIndex: startRank,
      yearsInMode: 0,
      metric1: initM1,
      metric2: def.metric2.init,
      recentActionIds: [],
      currentBoard: [],
      rerollsLeft: this.MAX_REROLLS_YEAR,
      actionsLeftThisYear: this.MAX_ACTIONS_YEAR,
      flags: {}
    };

    if (!s.offeredModeIds.includes(modeId)) s.offeredModeIds.push(modeId);
    this.generateBoard(s, false);

    if (window.KarmaEndings) {
      KarmaEndings.markModeVisited(modeId);
      if (!opts.silent) {
        KarmaEndings.addHighlight(def.icon, `Menyambut Peluang Sekali Seumur Hidup: ${def.title}`);
      }
    }
    if (window.CharacterStatus) CharacterStatus.recordPeakRole(s);
    if (!opts.silent && window.Utils && Utils.playTone) Utils.playTone('achievement');
    GameState.save();
    return { ok: true, msg: `Mod ${def.title} diaktifkan!` };
  },

  // --------------------------------------------------------------------------
  // 3. PAPAN TINDAKAN ANTI-ULANG (4–5 TINDAKAN/TAHUN, 3/3 TENAGA, 1/1 REROLL, 15% NADIR)
  // --------------------------------------------------------------------------
  generateBoard(s, isReroll = false) {
    const info = this.getActiveInfo(s);
    if (!info) return [];
    const { def, state: am } = info;

    const prevSet = new Set(am.currentBoard || []);
    if (!isReroll) {
      am.actionsLeftThisYear = this.MAX_ACTIONS_YEAR;
      am.rerollsLeft = this.MAX_REROLLS_YEAR;
      if (am.currentBoard.length > 0) {
        am.recentActionIds = [...am.currentBoard, ...am.recentActionIds].slice(0, 10);
      }
    } else if (am.currentBoard.length > 0) {
      am.recentActionIds = [...am.currentBoard, ...am.recentActionIds].slice(0, 10);
    }

    const recentSet = new Set(am.recentActionIds || []);
    const lowPoolFresh = def.actions.filter(a => !a.isRare && a.risk === 'low' && !recentSet.has(a.id));
    const lowPoolFallback = lowPoolFresh.length >= 2
      ? lowPoolFresh
      : def.actions.filter(a => !a.isRare && a.risk === 'low' && !prevSet.has(a.id));
    const allLowPool = lowPoolFallback.length > 0
      ? lowPoolFallback
      : def.actions.filter(a => !a.isRare && a.risk === 'low');

    const otherPoolFresh = def.actions.filter(a => !a.isRare && a.risk !== 'low' && !recentSet.has(a.id));
    const otherPoolFallback = otherPoolFresh.length >= 4
      ? otherPoolFresh
      : def.actions.filter(a => !a.isRare && a.risk !== 'low' && !prevSet.has(a.id));
    const rarePool = def.actions.filter(a => a.isRare && !prevSet.has(a.id));

    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
    const targetSize = Utils.randInt(4, 5);
    const picked = [];

    // 15% peluang muncul slot Emas (Rare Wildcard)
    if (rarePool.length > 0 && Utils.chance(0.15)) {
      picked.push(Utils.pick(rarePool).id);
    }

    // Pastikan sekurang-kurangnya 1–2 misi berisiko rendah (rutin/selamat) disertakan
    const lowTarget = Math.min(allLowPool.length, Utils.randInt(1, 2));
    for (const a of shuffle(allLowPool)) {
      if (picked.filter(id => {
        const obj = def.actions.find(x => x.id === id);
        return obj && obj.risk === 'low';
      }).length >= lowTarget) break;
      if (!picked.includes(a.id)) picked.push(a.id);
    }

    // Penuhkan baki dengan misi sederhana & tinggi
    for (const a of shuffle(otherPoolFallback)) {
      if (picked.length >= targetSize) break;
      if (!picked.includes(a.id)) picked.push(a.id);
    }

    // Fallback jika masih belum cukup 4–5 tindakan
    if (picked.length < targetSize) {
      for (const a of shuffle(def.actions.filter(x => !x.isRare))) {
        if (picked.length >= targetSize) break;
        if (!picked.includes(a.id)) picked.push(a.id);
      }
    }

    am.currentBoard = shuffle(picked);
    return am.currentBoard;
  },

  rerollBoard() {
    const s = GameState.current;
    const info = this.getActiveInfo(s);
    if (!info) return { ok: false, msg: 'Tiada mod khas aktif.' };
    if (info.state.rerollsLeft <= 0) {
      return { ok: false, msg: 'Anda sudah menggunakan tukaran papan tindakan (1/1) tahun ini!' };
    }
    info.state.rerollsLeft -= 1;
    this.generateBoard(s, true);
    GameState.save();
    return { ok: true, msg: '🎲 Senarai tindakan mod disegarkan!' };
  },

  // --------------------------------------------------------------------------
  // 3B. PENGIRAAN RISIKO MISI (TIADA LAGI 100% AUTO-BERJAYA) & KRISIS MOD KHAS
  // --------------------------------------------------------------------------
  isHighDangerMode(modeId) {
    return ['mafia', 'spy', 'military', 'crime', 'assassin', 'cartel'].includes(modeId);
  },

  getActionRiskProfile(s, def, am, act) {
    const modeId = def.id;
    const isDanger = this.isHighDangerMode(modeId);
    const smarts = (s.stats && s.stats.smarts) ?? 60;
    const health = (s.stats && s.stats.health) ?? 70;
    const looks = (s.stats && s.stats.looks) ?? 65;
    const stress = (s.alignment && s.alignment.stress) ?? 20;
    const rankBonus = (am.rankIndex || 0) * 4;

    // Tentukan tahap kesukaran misi
    let tier = 'low';
    let baseSuccess = 88;
    if (act.risk === 'low') {
      tier = 'low';
      baseSuccess = typeof act.baseSuccess === 'number' ? act.baseSuccess : 90;
    } else if (act.risk === 'high') {
      tier = 'high';
      baseSuccess = typeof act.baseSuccess === 'number' ? act.baseSuccess : 44;
    } else if (act.risk === 'medium') {
      tier = 'medium';
      baseSuccess = typeof act.baseSuccess === 'number' ? act.baseSuccess : 62;
    } else {
      let diffScore = 0;
      if (act.isRare) diffScore += 2;
      if (act.foreignMission) diffScore += 1;
      if ((act.notoriety || 0) >= 8 || (act.stress || 0) >= 10) diffScore += 1;
      if (Math.abs(act.moneyUsd || 0) >= 20000 || (act.m1 || 0) >= 12) diffScore += 1;
      if (isDanger) diffScore += 1;

      if (diffScore >= 3) {
        tier = 'high';
        baseSuccess = 44;
      } else if (diffScore >= 1) {
        tier = 'medium';
        baseSuccess = 60;
      } else {
        tier = 'low';
        baseSuccess = 88;
      }
    }

    // Skala mengikut statistik watak yang relevan + pangkat - penalti stres/keletihan
    const primaryStat = isDanger
      ? (health * 0.55 + smarts * 0.45)
      : (['celebrity', 'royalty'].includes(modeId) ? (looks * 0.55 + smarts * 0.45) : (smarts * 0.65 + health * 0.35));

    const statMod = Math.round(((primaryStat - 60) / 100) * (tier === 'low' ? 12 : 26));
    const stressPenalty = stress >= 75 ? (tier === 'low' ? 6 : 18) : stress >= 50 ? (tier === 'low' ? 3 : 10) : stress >= 35 ? (tier === 'low' ? 1 : 4) : 0;

    const maxSuccessCap = tier === 'low' ? 96 : 86;
    const minSuccessFloor = tier === 'low' ? 78 : 18;
    const successPct = Utils.clamp(baseSuccess + statMod + rankBonus - stressPenalty, minSuccessFloor, maxSuccessCap);
    const partialPct = tier === 'high' ? 22 : (tier === 'medium' ? 20 : Math.min(8, 100 - successPct - 2));
    const failPct = Math.max(2, 100 - successPct - partialPct);

    const badge = tier === 'high'
      ? { text: '🔴 Risiko Tinggi', bg: '#fee2e2', color: '#b91c1c', border: '#fca5a5' }
      : tier === 'medium'
        ? { text: '🟡 Risiko Sederhana', bg: '#fef3c7', color: '#92400e', border: '#fde68a' }
        : { text: '🟢 Risiko Rendah', bg: '#dcfce7', color: '#166534', border: '#86efac' };

    return {
      tier,
      isDanger,
      successPct,
      partialPct,
      failPct,
      badge
    };
  },

  performAction(actId, opts = {}) {
    const s = GameState.current;
    const info = this.getActiveInfo(s);
    if (!info) return { ok: false, msg: 'Tiada mod khas aktif.' };
    const { def, state: am } = info;
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Anda berada di dalam penjara!' };

    if (!am.cooldowns || typeof am.cooldowns !== 'object') am.cooldowns = {};
    if ((am.cooldowns[actId] || 0) > 0) {
      return { ok: false, msg: `⏳ Misi ini masih dalam tempoh bertenang (${am.cooldowns[actId]} tahun lagi) selepas kegagalan baru-baru ini.` };
    }

    const doneKey = `sp_${def.id}_${actId}`;
    if (s.yearlyActions[doneKey]) return { ok: false, msg: 'Anda sudah melaksanakan tindakan ini tahun ini.' };
    if (am.actionsLeftThisYear <= 0) {
      return { ok: false, msg: `⚡ Tindakan Mod tahun ini sudah habis (0/${this.MAX_ACTIONS_YEAR})! Klik +UMUR untuk tahun baharu.` };
    }

    const act = def.actions.find(a => a.id === actId);
    if (!act) return { ok: false, msg: 'Tindakan tidak ditemui.' };

    am.actionsLeftThisYear -= 1;
    s.yearlyActions[doneKey] = true;
    if (!am.recentActionIds.includes(act.id)) {
      am.recentActionIds.unshift(act.id);
      if (am.recentActionIds.length > 10) am.recentActionIds.length = 10;
    }

    // 25% peluang mencetuskan Dilema Bercabang Khusus Mod (kecuali jika paksa uji outcome atau misi rutin risiko rendah)
    if (!opts.skipDilemma && act.risk !== 'low' && def.dilemmas && def.dilemmas.length > 0 && Utils.chance(0.25)) {
      const dil = this.buildDilemmaEvent(s, def, Utils.pick(def.dilemmas));
      GameState.save();
      return { ok: true, dilemmaEvent: dil, msg: `⚡ Dilema ${def.shortLabel}!` };
    }

    const risk = this.getActionRiskProfile(s, def, am, act);
    const roll = typeof opts.forceRoll === 'number' ? opts.forceRoll : (Math.random() * 100);

    // 1) BERJAYA PENUH (Success)
    if (roll < risk.successPct) {
      am.consecutiveFailures = 0;
      const summary = this._applyEffects(s, def, am, act);
      GameState.addJournalEntry(
        `✅ [${def.shortLabel}] ${act.title} BERJAYA! ${summary}`,
        act.isRare ? 'milestone' : 'culture'
      );
      this._checkRankUp(s);
      GameState.save();
      return {
        ok: true,
        outcomeTier: 'success',
        risk,
        msg: `✅ ${act.title} BERJAYA! ${summary}`
      };
    }

    // 2) BERJAYA SEPARA / KOS TINGGI (Partial Success, ~15%–25%)
    if (roll < risk.successPct + risk.partialPct) {
      am.consecutiveFailures = 0;
      const scaledEff = {
        ...act,
        m1: act.m1 ? Math.max(1, Math.round(act.m1 * 0.65)) : 0,
        moneyUsd: act.moneyUsd ? Math.round(act.moneyUsd * 0.65) : 0,
        rep: act.rep ? Math.max(1, Math.round(act.rep * 0.5)) : 0
      };
      const baseSummary = this._applyEffects(s, def, am, scaledEff);
      const extraStress = risk.tier === 'low' ? Utils.randInt(3, 6) : Utils.randInt(8, 15);
      const extraCost = Utils.usdToLocal(risk.tier === 'low' ? Utils.randInt(150, 500) : Utils.randInt(450, 1800), s.countryId);
      let setbackText = '';

      if (risk.isDanger && risk.tier !== 'low') {
        const minorInjury = Utils.randInt(6, 12);
        GameState.adjustStats({ health: -minorInjury, happiness: -4 });
        if (s.alignment) s.alignment.stress = Utils.clamp((s.alignment.stress || 0) + extraStress, 0, 100);
        setbackText = `Kecederaan ringan (-${minorInjury}% Kesihatan) & Stres +${extraStress}%`;
      } else {
        s.money = Math.max(0, (s.money || 0) - extraCost);
        if (s.alignment) s.alignment.stress = Utils.clamp((s.alignment.stress || 0) + extraStress, 0, 100);
        GameState.adjustStats({ happiness: -2 });
        setbackText = `Kos tambahan -${Utils.formatMoney(extraCost, s.countryId)} & Stres +${extraStress}%`;
      }

      const logMsg = `⚠️ [${def.shortLabel}] ${act.title} — BERJAYA SEPARA (Kos Tinggi): Objektif tercapai (${baseSummary}), namun terpaksa menanggung ${setbackText}.`;
      GameState.addJournalEntry(logMsg, 'dilemma');
      this._checkRankUp(s);
      GameState.save();
      return {
        ok: true,
        outcomeTier: 'partial',
        risk,
        msg: `⚠️ Berjaya Separa (${act.title}): ${setbackText}.`
      };
    }

    // 3) GAGAL / TERKANTOI (Failure / Backfire)
    if (risk.tier === 'low') {
      // Penalti sangat minimum untuk tugasan rutin / risiko rendah
      const minHap = -Utils.randInt(3, 6);
      const minStress = Utils.randInt(3, 7);
      GameState.adjustStats({ happiness: minHap });
      if (s.alignment) s.alignment.stress = Utils.clamp((s.alignment.stress || 0) + minStress, 0, 100);
      am.metric1 = Utils.clamp((am.metric1 || 50) - Utils.randInt(2, 4), 0, 100);
      const lowFailNotes = [`${def.metric1.label} -3%`, `Gembira ${minHap}%`, `Stres +${minStress}%`];
      const lowFailLog = `⚠️ [${def.shortLabel}] ${act.title}: Tugasan rutin kurang memuaskan (${lowFailNotes.join(' • ')}).`;
      GameState.addJournalEntry(lowFailLog, 'warning');
      GameState.save();
      return {
        ok: false,
        outcomeTier: 'failure',
        risk,
        died: false,
        msg: `⚠️ Tugasan Kurang Menjadi (${act.title}): ${lowFailNotes.join(' • ')}`
      };
    }

    am.consecutiveFailures = (am.consecutiveFailures || 0) + 1;
    am.cooldowns[act.id] = 1; // Cooldown 1 tahun selepas gagal

    const hapDrop = -Utils.randInt(10, 25);
    const stressSpike = Utils.randInt(10, 25);
    GameState.adjustStats({ happiness: hapDrop });
    if (s.alignment) s.alignment.stress = Utils.clamp((s.alignment.stress || 0) + stressSpike, 0, 100);

    const failNotes = [];
    let diedFromMission = false;

    if (risk.isDanger) {
      // Mod Berbahaya (Mafia / Perisik / Ketenteraan): Kecederaan berat, rampasan tunai, pengkhianatan, turun pangkat, penjara, atau risiko maut nadir
      const healthLoss = Utils.randInt(15, 40);
      GameState.adjustStats({ health: -healthLoss });
      failNotes.push(`Kesihatan -${healthLoss}%`);

      const fineLoss = Math.min(Math.max(0, s.money || 0), Utils.usdToLocal(Utils.randInt(1200, 6500), s.countryId));
      if (fineLoss > 0) {
        s.money -= fineLoss;
        failNotes.push(`Rampasan/Denda -${Utils.formatMoney(fineLoss, s.countryId)}`);
      }
      am.metric1 = Utils.clamp((am.metric1 || 50) - Utils.randInt(10, 20), 0, 100);
      if (def.metric2.dangerHigh) {
        am.metric2 = Utils.clamp((am.metric2 || 20) + Utils.randInt(12, 22), 0, 100);
      }

      if (am.rankIndex > 0 && (risk.tier === 'high' || am.consecutiveFailures >= 2) && Utils.chance(0.45)) {
        am.rankIndex = Math.max(0, am.rankIndex - 1);
        failNotes.push(`Diturunkan pangkat ke ${def.ranks[am.rankIndex].title}`);
      }

      if (risk.tier === 'high' && Utils.chance(0.22) && window.PrisonFugitive && PrisonFugitive.imprisonCharacter) {
        PrisonFugitive.imprisonCharacter(s, Utils.randInt(2, 5), `Terkantoi dalam operasi ${def.title}: ${act.title}`);
        failNotes.push('Ditangkap & Dipenjarakan!');
      } else if (risk.tier === 'high' && s.stats.health <= 5 && Utils.chance(0.15)) {
        s.alive = false;
        s.causeOfDeath = `Terbunuh dalam operasi berbahaya (${act.title})`;
        diedFromMission = true;
        failNotes.push('Kecederaan kritikal membawa maut!');
      }
    } else {
      // Mod Awam (Politik / CEO / Selebriti / Diraja / dll): Skandal awam, reputasi jatuh (-15 hingga -35), saman/kerugian, atau risiko dipecat
      const repDrop = Utils.randInt(15, 35);
      am.metric1 = Utils.clamp((am.metric1 || 50) - repDrop, 0, 100);
      if (window.Dynasty) Dynasty.adjustReputation(-Math.min(12, Math.round(repDrop / 3)));
      failNotes.push(`${def.metric1.label} -${repDrop}%`);

      const legalLoss = Math.min(Math.max(0, s.money || 0), Utils.usdToLocal(Utils.randInt(1500, 9000), s.countryId));
      if (legalLoss > 0) {
        s.money -= legalLoss;
        failNotes.push(`Saman/Kerugian -${Utils.formatMoney(legalLoss, s.countryId)}`);
      }

      if (am.consecutiveFailures >= 3 && am.rankIndex > 0) {
        am.rankIndex = Math.max(0, am.rankIndex - 1);
        am.consecutiveFailures = 0;
        failNotes.push(`Skandal berulang: Dilucutkan/diturunkan ke ${def.ranks[am.rankIndex].title}`);
      }
    }

    failNotes.push(`Gembira ${hapDrop}%`, `Stres +${stressSpike}%`);
    const failLog = `❌ GAGAL / TERKANTOI [${def.shortLabel}] ${act.title}: Misi menemui kegagalan! (${failNotes.join(' • ')})`;
    GameState.addJournalEntry(failLog, 'warning');
    GameState.save();

    return {
      ok: false,
      outcomeTier: 'failure',
      risk,
      died: diedFromMission,
      msg: `❌ Misi Gagal (${act.title}): ${failNotes.slice(0, 3).join(' • ')}`
    };
  },

  // --------------------------------------------------------------------------
  // 3C. KRISIS MOD KHAS MENGEJUT PADA AGE-UP (15%–25% PELUANG SETAHUN)
  // --------------------------------------------------------------------------
  maybeTriggerYearlyCrisisEvent(s = GameState.current) {
    const info = this.getActiveInfo(s);
    if (!info || (s.prison && s.prison.inPrison)) return null;
    const { def, state: am } = info;

    // Turunkan cooldown misi setiap Age-Up
    if (am.cooldowns && typeof am.cooldowns === 'object') {
      for (const k of Object.keys(am.cooldowns)) {
        if (am.cooldowns[k] > 0) am.cooldowns[k] -= 1;
      }
    }

    const stress = (s.alignment && s.alignment.stress) || 0;
    const crisisProb = stress >= 60 ? 0.25 : 0.19; // Dalam julat 15%–25%
    if (!Utils.chance(crisisProb)) return null;

    const isDanger = this.isHighDangerMode(def.id);
    const fixCost = Utils.usdToLocal(isDanger ? 2800 : 3500, s.countryId);

    const scenario = isDanger
      ? Utils.pick([
          {
            icon: '🚨',
            title: `Krisis ${def.shortLabel}: Operasi Bocor!`,
            text: `Maklumat sulit operasi anda dalam ${def.title} telah bocor kepada pihak musuh dan agensi penguatkuasa! Masa semakin suntuk untuk bertindak sebelum lokasi anda diserbu.`
          },
          {
            icon: '🩸',
            title: `Krisis ${def.shortLabel}: Kecederaan & Serangan Hendap`,
            text: `Ketika menjalankan tugas rahsia dalam ${def.title}, pasukan anda diserang hendap secara mengejut! Anda perlu membuat keputusan pantas di bawah tekanan hebat.`
          }
        ])
      : Utils.pick([
          {
            icon: '📸',
            title: `Krisis ${def.shortLabel}: Skandal Media Tular!`,
            text: `Sebuah rakaman luar konteks mengenai anda dalam ${def.title} tular di media sosial dan mencetuskan kecaman hebat orang ramai serta tekanan penaja!`
          },
          {
            icon: '📉',
            title: `Krisis ${def.shortLabel}: Sabotaj Pesaing!`,
            text: `Pesaing utama anda melancarkan kempen sabotaj terancang untuk menjatuhkan kedudukan dan reputasi anda dalam ${def.title}.`
          }
        ]);

    return {
      id: `sp_crisis_${def.id}_${s.age}_${Date.now()}`,
      icon: scenario.icon,
      title: scenario.title,
      text: scenario.text,
      choices: [
        {
          label: `🛡️ Kawal Kerosakan Dengan Dana Kecemasan (${Utils.formatMoney(fixCost, s.countryId)})`,
          hint: 'Selamat • Bayar kos guaman/PR/keselamatan untuk meredakan krisis serta-merta',
          customAction: (st) => {
            const cur = this.getActiveInfo(st);
            if ((st.money || 0) >= fixCost) {
              st.money -= fixCost;
              if (st.alignment) st.alignment.stress = Utils.clamp((st.alignment.stress || 0) + 5, 0, 100);
              return {
                outcome: `Anda bertindak pantas melabur ${Utils.formatMoney(fixCost, st.countryId)} bagi mengawal kerosakan. Krisis berjaya diredakan sebelum merebak!`,
                toastType: 'culture'
              };
            }
            if (cur) cur.state.metric1 = Utils.clamp((cur.state.metric1 || 50) - 15, 0, 100);
            GameState.adjustStats({ happiness: -12 });
            return {
              outcome: `Dana tidak mencukupi! Krisis merebak dan menjatuhkan ${cur ? cur.def.metric1.label : 'reputasi'} sebanyak -15%.`,
              toastType: 'error'
            };
          }
        },
        {
          label: '🎲 Ambil Risiko Balas Serangan (Taruhan Tinggi)',
          hint: '50/50 • Berjaya: Reputasi & Ganjaran ++ | Gagal: Kesan berganda!',
          journalType: 'dilemma',
          customAction: (st) => {
            const cur = this.getActiveInfo(st);
            const win = Utils.chance(0.48 + ((st.stats.smarts || 60) - 60) / 300);
            if (win) {
              if (cur) cur.state.metric1 = Utils.clamp((cur.state.metric1 || 50) + 14, 0, 100);
              const bonus = Utils.usdToLocal(4500, st.countryId);
              st.money += bonus;
              GameState.adjustStats({ happiness: 10 });
              return {
                outcome: `Langkah berani anda membalikkan keadaan! Krisis bertukar menjadi kemenangan besar (+14% ${cur ? cur.def.metric1.label : 'Prestasi'} & +${Utils.formatMoney(bonus, st.countryId)})!`,
                toastType: 'success'
              };
            }
            if (cur) cur.state.metric1 = Utils.clamp((cur.state.metric1 || 50) - 24, 0, 100);
            GameState.adjustStats({ happiness: -18, health: isDanger ? -20 : -4 });
            if (st.alignment) st.alignment.stress = Utils.clamp((st.alignment.stress || 0) + 18, 0, 100);
            return {
              outcome: `Serangan balas anda gagal teruk! Anda menanggung kerugian reputasi besar (-24%) dan tekanan melampau.`,
              toastType: 'error'
            };
          }
        },
        {
          label: '🤝 Berundur Sementara & Mohon Maaf Secara Terbuka',
          hint: 'Kesan sederhana • Reputasi turun sedikit, elak kehancuran total',
          customAction: (st) => {
            const cur = this.getActiveInfo(st);
            if (cur) cur.state.metric1 = Utils.clamp((cur.state.metric1 || 50) - 10, 0, 100);
            GameState.adjustStats({ happiness: -8 });
            if (st.alignment) st.alignment.stress = Utils.clamp((st.alignment.stress || 0) + 8, 0, 100);
            return {
              outcome: `Anda merendahkan diri dan menangani krisis secara tenang. Reputasi tercalar sedikit (-10%), namun kedudukan anda masih terselamat.`,
              toastType: 'culture'
            };
          }
        }
      ]
    };
  },

  buildDilemmaEvent(s, def, d) {
    return {
      id: `${d.id}_${s.age}_${Date.now()}`,
      icon: d.icon || def.icon,
      title: d.title,
      text: d.text,
      choices: d.choices.map(ch => ({
        label: ch.label,
        hint: ch.hint || '',
        journalType: (ch.karma || 0) < -10 ? 'warning' : 'milestone',
        customAction: (st) => {
          const curInfo = this.getActiveInfo(st);
          const sum = curInfo ? this._applyEffects(st, curInfo.def, curInfo.state, ch) : '';
          this._checkRankUp(st);
          return {
            outcome: `${ch.outcome}${sum ? ` (${sum})` : ''}`,
            toastType: (ch.karma || 0) < -10 ? 'error' : 'success'
          };
        }
      }))
    };
  },

  _applyEffects(s, def, am, eff) {
    const notes = [];
    if (eff.foreignMission) {
      const target = this._pickForeignCountry(s, false);
      if (target) {
        if (!s.countriesVisited.includes(target.id)) s.countriesVisited.push(target.id);
        notes.push(`Lokasi Misi: ${target.flag || '🌍'} ${target.name}`);
      }
    }
    if (eff.exploreCountries && eff.exploreCountries > 0) {
      const found = this._recordExploredCountries(s, eff.exploreCountries);
      if (found.length > 0) {
        notes.push(`Terokai: ${found.join(', ')} (${s.countriesVisited.length}/195 negara)`);
      }
    }
    if (eff.m1) {
      am.metric1 = Utils.clamp(am.metric1 + eff.m1, 0, 100);
      notes.push(`${def.metric1.label} ${eff.m1 >= 0 ? '+' : ''}${eff.m1}%`);
    }
    if (eff.m2) {
      am.metric2 = Utils.clamp(am.metric2 + eff.m2, 0, 100);
      notes.push(`${def.metric2.label} ${eff.m2 >= 0 ? '+' : ''}${eff.m2}%`);
    }
    if (eff.flag) am.flags[eff.flag] = true;
    if (eff.moneyUsd) {
      const local = Utils.usdToLocal(eff.moneyUsd, s.countryId);
      s.money += local;
      notes.push(`${local >= 0 ? '+' : ''}${Utils.formatMoney(local, s.countryId)}`);
    }
    if (eff.followers && s.socialMedia) {
      s.socialMedia.followers = Math.max(0, (s.socialMedia.followers || 0) + eff.followers);
      notes.push(`Pengikut +${eff.followers.toLocaleString()}`);
    }
    const statDelta = {};
    if (eff.happiness) statDelta.happiness = eff.happiness;
    if (eff.health) statDelta.health = eff.health;
    if (eff.smarts) statDelta.smarts = eff.smarts;
    if (eff.looks) statDelta.looks = eff.looks;
    if (Object.keys(statDelta).length > 0) GameState.adjustStats(statDelta);

    if (window.KarmaEndings && (eff.karma || eff.fame || eff.stress || eff.notoriety)) {
      KarmaEndings.adjustAlignment({
        karma: eff.karma || 0,
        fame: eff.fame || 0,
        stress: eff.stress || 0,
        notoriety: eff.notoriety || 0
      });
    }
    if (eff.rep && window.Dynasty) {
      Dynasty.adjustReputation(eff.rep);
      notes.push(`Reputasi Keluarga ${eff.rep >= 0 ? '+' : ''}${eff.rep}%`);
    }
    return notes.join(' • ');
  },

  _checkRankUp(s) {
    const info = this.getActiveInfo(s);
    if (!info) return;
    const { def, state: am } = info;
    while (am.rankIndex < def.ranks.length - 1) {
      const next = def.ranks[am.rankIndex + 1];
      if (am.yearsInMode >= next.reqYears && am.metric1 >= next.reqM1) {
        am.rankIndex += 1;
        if (window.Dynasty) Dynasty.adjustReputation(5);
        if (window.KarmaEndings) {
          KarmaEndings.adjustAlignment({ fame: 10 });
          KarmaEndings.addHighlight(def.icon, `Naik pangkat ke ${next.title} dalam ${def.title}`);
        }
        if (window.CharacterStatus) CharacterStatus.recordPeakRole(s);
        if (window.Utils && Utils.playTone) Utils.playTone('achievement');
        GameState.addJournalEntry(
          `🏆 KENAIKAN PANGKAT MOD KHAS! Anda kini bergelar ${def.icon} ${next.title} dalam ${def.title}!`,
          'milestone'
        );
      } else {
        break;
      }
    }
  },

  tickYearlySpecialMode(s) {
    this.ensureFields(s);
    // Kurangkan tempoh sekatan perjalanan Burn Notice walaupun mod Perisik sudah keluar
    if (s.spyBurnNotice && s.spyBurnNotice.active && s.spyBurnNotice.travelBlockYears > 0) {
      s.spyBurnNotice.travelBlockYears -= 1;
      if (s.spyBurnNotice.travelBlockYears === 0) {
        GameState.addJournalEntry('🕵️ Sekatan perjalanan rasmi Burn Notice telah tamat, namun pemantauan & risiko musuh asing lama masih berterusan!', 'culture');
      }
    }

    const info = this.getActiveInfo(s);
    if (!info) return;
    const { def, state: am } = info;
    am.yearsInMode += 1;
    this._checkRankUp(s);
    this.generateBoard(s, false);

    // Risiko tahunan khusus mod jika metrik bahaya terlalu tinggi
    if (def.id === 'athlete' && am.metric2 >= 80 && Utils.chance(0.45)) {
      GameState.adjustStats({ health: -16, happiness: -12 });
      GameState.addJournalEntry('🩹 KECEDERAAN SERIUS ATLET! Risiko kecederaan yang tinggi memaksa anda menjalani pembedahan lutut.', 'warning');
    } else if (def.id === 'celebrity' && am.metric2 >= 75 && Utils.chance(0.40)) {
      am.metric1 = Math.max(10, am.metric1 - 14);
      if (window.Dynasty) Dynasty.adjustReputation(-5);
      GameState.addJournalEntry('🔥 SERANGAN CANCEL CULTURE! Beberapa penaja menggantung kempen anda — Populariti merosot!', 'warning');
    } else if (def.id === 'mafia' && am.metric2 >= 80 && Utils.chance(0.35)) {
      GameState.adjustStats({ health: -12, happiness: -10 });
      GameState.addJournalEntry('🚨 SERBUAN KILAT POLIS! Salah satu gudang sindiket anda dirampas — anda nyaris lolos!', 'warning');
    } else if (def.id === 'cult' && am.metric2 >= 80 && Utils.chance(0.35)) {
      const fine = Utils.usdToLocal(25000, s.countryId);
      s.money -= fine;
      GameState.addJournalEntry(`🚔 SIASATAN PIHAK BERKUASA! Anda terpaksa membayar kos guaman kecemasan ${Utils.formatMoney(fine, s.countryId)} bagi menepis serbuan markas!`, 'warning');
    }
  },

  // Risiko berterusan 8–12% SETIAP TAHUN selepas keluar Mod Perisik (Burn Notice)
  maybeTriggerBurnNoticeEvent(s, force = false) {
    if (!s || !s.spyBurnNotice || !s.spyBurnNotice.active) return null;
    if (s.prison && s.prison.inPrison) return null;
    const prob = s.spyBurnNotice.yearlyAmbushRisk || 0.10;
    if (!force && !Utils.chance(prob)) return null;

    const enemyCountry = this._pickForeignCountry(s, false);
    const bribeCost = Utils.usdToLocal(18000, s.countryId);
    return {
      id: `burn_notice_ambush_${s.age}_${Date.now()}`,
      icon: '🕵️',
      title: '🚨 AMARAN BURN NOTICE: Musuh Risikan Lama Menjejak Anda!',
      text: `Seorang ejen pembalas dendam daripada operasi silam anda di ${enemyCountry.flag || '🌍'} ${enemyCountry.name} berjaya mengesan lokasi anda tanpa perlindungan agensi!`,
      choices: [
        {
          label: 'Hadapi & patahkan serangan hendap dengan kemahiran tempur lama',
          hint: 'Risiko cedera (-12 hingga -26 Kesihatan), selamat tanpa bayar wang',
          journalType: 'warning',
          customAction: () => {
            const dmg = Utils.randInt(12, 26);
            GameState.adjustStats({ health: -dmg, happiness: -8 });
            return { outcome: `Pertempuran sengit berlaku! Anda menewaskan penyerang itu tetapi mengalami kecederaan (Kesihatan -${dmg}%).`, toastType: 'error' };
          }
        },
        {
          label: `Bayar broker maklumat bawah tanah (${Utils.formatMoney(bribeCost, s.countryId)}) untuk lenyapkan jejak`,
          hint: 'Selamat secara fizikal, kos wang',
          journalType: 'culture',
          customAction: (st) => {
            st.money -= bribeCost;
            GameState.adjustStats({ happiness: -4 });
            return { outcome: `Anda menukar lokasi dan memadam jejak digital tepat pada waktunya (-${Utils.formatMoney(bribeCost, st.countryId)}).`, toastType: 'culture' };
          }
        }
      ]
    };
  },

  // --------------------------------------------------------------------------
  // 4. KELUAR MOD DENGAN RISIKO REALISTIK & KUNCI KEKAL SEPANJANG HAYAT
  // --------------------------------------------------------------------------
  exitSpecialMode(exitChoice = 'standard') {
    const s = GameState.current;
    const info = this.getActiveInfo(s);
    if (!info) return { ok: false, msg: 'Tiada mod khas aktif.' };
    const { def, state: am, rank } = info;

    let msg = '';
    let followUpEvent = null;

    if (def.id === 'politics') {
      const cleanLongService = am.yearsInMode >= 5 && am.metric2 <= 30 && !am.flags.corrupt_deal;
      if (cleanLongService) {
        s.formerLeaderPension = Utils.usdToLocal(18000 + am.rankIndex * 9000, s.countryId);
        if (window.Dynasty) Dynasty.adjustReputation(6);
        msg = `Anda bersara dengan terhormat sebagai bekas ${rank.title}! Layak menerima Pencen Bekas Pemimpin (${Utils.formatMoney(s.formerLeaderPension, s.countryId)}/thn).`;
        GameState.addJournalEntry(`🏛️ ${msg}`, 'milestone');
      } else if (am.metric2 > 30 || am.flags.corrupt_deal || am.yearsInMode < 2) {
        if (window.Dynasty) Dynasty.adjustReputation(-8);
        if ((am.metric2 > 45 || am.flags.corrupt_deal) && window.PrisonFugitive) {
          msg = 'Sebaik hilang kekebalan politik, pihak berkuasa membuka fail siasatan rasuah ke atas anda — bersedia ke Mahkamah!';
          followUpEvent = PrisonFugitive.buildCourtTrialEvent({
            crimeLabel: 'Salah Guna Kuasa & Skandal Politik',
            minYears: 2,
            maxYears: 6,
            security: 'medium',
            heat: 45
          });
        } else {
          msg = `Anda meletak jawatan awal sebagai ${rank.title}. Media mengkritik tindakan anda (-8% Reputasi Keluarga).`;
        }
        GameState.addJournalEntry(`🏛️ ${msg}`, 'warning');
      } else {
        msg = `Anda meletak jawatan daripada arena politik sebagai bekas ${rank.title}.`;
        GameState.addJournalEntry(`🏛️ ${msg}`, 'culture');
      }
    } else if (def.id === 'ceo') {
      const equity = this.getCeoEquityLocal(s);
      if (exitChoice === 'sell') {
        const capTax = Math.round(equity * 0.20);
        const netSale = equity - capTax;
        s.money += netSale;
        msg = `Anda menjual syarikat pada nilai bersih ${Utils.formatMoney(netSale, s.countryId)} (selepas cukai keuntungan modal 20%)!`;
        if (am.metric1 < 35 && Utils.chance(0.55)) {
          const suitFine = Math.round(netSale * 0.25);
          s.money -= suitFine;
          if (window.Dynasty) Dynasty.adjustReputation(-6);
          msg += ` Namun pelabur memfailkan saman kerugian penilaian (-${Utils.formatMoney(suitFine, s.countryId)})!`;
        }
        GameState.addJournalEntry(`💼 ${msg}`, 'milestone');
      } else {
        const debtCost = Utils.usdToLocal(12000 * (am.rankIndex + 1), s.countryId);
        s.money -= debtCost;
        if (window.Dynasty) Dynasty.adjustReputation(-8);
        msg = `Anda menutup operasi syarikat. Penyelesaian hutang & pampasan pekerja menelan ${Utils.formatMoney(debtCost, s.countryId)} (-8% Reputasi Keluarga).`;
        GameState.addJournalEntry(`💼 ${msg}`, 'warning');
      }
    } else if (def.id === 'fund_manager') {
      let penalty = 0;
      if (am.yearsInMode < 3) {
        penalty = Utils.usdToLocal(22000, s.countryId);
        s.money -= penalty;
      }
      if ((am.flags.insider_trading || am.metric2 >= 45) && window.PrisonFugitive) {
        msg = `Audit wajib regulator semasa keluar mengesan bukti Insider Trading!${penalty > 0 ? ` Penalti kontrak -${Utils.formatMoney(penalty, s.countryId)}.` : ''} Anda diheret ke Mahkamah!`;
        followUpEvent = PrisonFugitive.buildCourtTrialEvent({
          crimeLabel: 'Dagangan Orang Dalam (Insider Trading)',
          minYears: 3,
          maxYears: 8,
          security: 'medium',
          heat: 55
        });
        GameState.addJournalEntry(`📈 ${msg}`, 'warning');
      } else {
        msg = `Anda menamatkan kerjaya Jerung Pasaran & lulus audit regulator dengan bersih!${penalty > 0 ? ` (Penalti keluar awal: -${Utils.formatMoney(penalty, s.countryId)})` : ''}`;
        GameState.addJournalEntry(`📈 ${msg}`, 'culture');
      }
    } else if (def.id === 'celebrity') {
      const fine = Utils.usdToLocal(10000 * (am.rankIndex + 1), s.countryId);
      s.money -= fine;
      if (window.KarmaEndings) KarmaEndings.adjustAlignment({ fame: -22 });
      msg = `Anda berundur daripada dunia hiburan (pampasan tamat tajaan -${Utils.formatMoney(fine, s.countryId)}).`;
      if (Utils.chance(0.35) || am.metric2 >= 45) {
        GameState.adjustStats({ happiness: -12 });
        if (window.Dynasty) Dynasty.adjustReputation(-6);
        msg += ' Drama media dan kecaman peminat turut menjejaskan emosi & Reputasi Keluarga!';
      }
      GameState.addJournalEntry(`⭐ ${msg}`, 'warning');
    } else if (def.id === 'athlete') {
      if (am.yearsInMode >= 8) {
        if (window.Dynasty) Dynasty.adjustReputation(8);
        msg = `Anda bersara dengan penuh penghormatan sebagai Legenda Sukan (${am.yearsInMode} tahun beraksi)! Reputasi Keluarga +8% & prestij kejurulatihan dibuka!`;
        GameState.addJournalEntry(`🏅 ${msg}`, 'milestone');
      } else {
        const buyout = Utils.usdToLocal(15000 * (am.rankIndex + 1), s.countryId);
        s.money -= buyout;
        if (window.KarmaEndings) KarmaEndings.adjustAlignment({ fame: -14 });
        msg = `Anda meninggalkan kelab sebelum kontrak tamat — yuran tebus kontrak -${Utils.formatMoney(buyout, s.countryId)} & populariti merosot.`;
        GameState.addJournalEntry(`🏅 ${msg}`, 'warning');
      }
    } else if (def.id === 'mafia') {
      // BAHAYA TERTINGGI: Wang Cuci Tangan berat + 35–50% serangan balas / pembelot ke polis
      const tribute = Utils.usdToLocal(35000 + (am.rankIndex * 28000), s.countryId);
      s.money -= tribute;
      const ambushChance = 0.35 + (am.rankIndex * 0.05); // 35% -> 50% di pangkat Godfather
      msg = `Anda membayar "Wang Cuci Tangan" sebanyak ${Utils.formatMoney(tribute, s.countryId)} untuk meninggalkan sindiket.`;
      if (Utils.chance(ambushChance)) {
        const roll = Math.random();
        if (am.rankIndex >= 3 && roll < 0.14) {
          // Risiko maut kecil di pangkat Godfather
          GameState.addJournalEntry(`🕶️ SERANGAN BALAS MAUT SINDIKET! Bekas pengikut yang marah melepaskan tembakan hendap sebaik anda meninggalkan markas.`, 'warning');
          s.exitedModeIds.push('mafia');
          s.activeSpecialMode = null;
          if (window.Sim && Sim.triggerDeath) {
            Sim.triggerDeath('Serangan Hendap Balas Dendam Sindiket Mafia');
          } else {
            s.alive = false;
            s.causeOfDeath = 'Serangan Hendap Balas Dendam Sindiket Mafia';
          }
          GameState.save();
          return { ok: true, msg: 'Anda terkorban dalam serangan balas dendam sindiket!', died: true };
        } else if (roll < 0.58) {
          const dmg = Utils.randInt(28, 44);
          GameState.adjustStats({ health: -dmg, happiness: -16 });
          msg += ` AMARAN: Skuad pembunuh sindiket menyerang hendap anda di jalan raya (Kesihatan -${dmg}%) — anda nyaris maut!`;
        } else if (window.PrisonFugitive) {
          msg += ' Seorang ahli sindiket yang berdendam membocorkan fail jenayah anda kepada polis — anda diheret ke Mahkamah!';
          followUpEvent = PrisonFugitive.buildCourtTrialEvent({
            crimeLabel: 'Konspirasi Jenayah Terancang & Sindiket Mafia',
            minYears: 4,
            maxYears: 12,
            security: 'max',
            heat: 70
          });
        }
      } else {
        msg += ' Anda bernasib baik — keluarga sindiket menghormati bayaran anda dan melepaskan anda hidup-hidup!';
      }
      GameState.addJournalEntry(`🕶️ ${msg}`, 'warning');
    } else if (def.id === 'cult') {
      // Tindak balas pengikut fanatik: Reputasi & Karma merosot + risiko tinggi saman penipuan / serbuan polis
      if (window.Dynasty) Dynasty.adjustReputation(-12);
      if (window.KarmaEndings) KarmaEndings.adjustAlignment({ karma: -20, fame: -10 });
      msg = 'Anda membubarkan kepimpinan pertubuhan rahsia. Pengikut fanatik meradang — Reputasi Keluarga -12% & Karma -20!';
      const risk = (am.flags.cult_fraud || am.metric2 >= 40) ? 0.80 : 0.55;
      if (Utils.chance(risk)) {
        if (Utils.chance(0.55) || !window.PrisonFugitive) {
          const lawsuit = Utils.usdToLocal(40000 + (am.rankIndex * 18000), s.countryId);
          s.money -= lawsuit;
          msg += ` Bekas pengikut memfailkan saman penipuan sivil bernilai ${Utils.formatMoney(lawsuit, s.countryId)}!`;
        } else {
          msg += ' Pihak berkuasa melancarkan serbuan ke atas markas & mendakwa anda di Mahkamah!';
          followUpEvent = PrisonFugitive.buildCourtTrialEvent({
            crimeLabel: 'Penipuan Dana Pertubuhan Rahsia',
            minYears: 2,
            maxYears: 7,
            security: 'medium',
            heat: 50
          });
        }
      }
      GameState.addJournalEntry(`🔮 ${msg}`, 'warning');
    } else if (def.id === 'spy') {
      // BURN NOTICE / PEMANTAUAN KETAT
      s.spyBurnNotice = {
        active: true,
        travelBlockYears: 3,
        yearlyAmbushRisk: am.flags.double_agent ? 0.12 : 0.10
      };
      msg = 'AGENSI MENGELUARKAN "BURN NOTICE / PEMANTAUAN KETAT"! Pelepasan keselamatan & gaji ditarik balik, sekatan perjalanan luar negara 3 tahun dikenakan, dan musuh asing lama berisiko 10% setahun menjejak anda!';
      GameState.addJournalEntry(`🕵️ ${msg}`, 'warning');
    } else if (def.id === 'royalty') {
      // BUANG GELARAN / RENOUNCE TITLE
      // Retakkan hubungan keluarga diraja
      (s.relationships || []).forEach(r => {
        if (r.alive && (r.category === 'family' || r.category === 'spouse')) {
          r.closeness = Utils.clamp((r.closeness || 50) - 20, 5, 100);
        }
      });
      if (Utils.chance(0.50)) {
        if (window.KarmaEndings) KarmaEndings.adjustAlignment({ fame: 12 });
        if (window.Dynasty) Dynasty.adjustReputation(4);
        GameState.adjustStats({ happiness: 8 });
        msg = 'Anda rasmi MEMBUANG GELARAN DIRAJA! Elaun & keistimewaan istana luput selamanya dan hubungan keluarga retak, namun media dunia memuji keberanian anda memilih hidup bebas (+4% Reputasi)!';
      } else {
        if (window.Dynasty) Dynasty.adjustReputation(-10);
        GameState.adjustStats({ happiness: -10 });
        msg = 'Anda rasmi MEMBUANG GELARAN DIRAJA! Elaun & keistimewaan istana luput selamanya, hubungan keluarga retak, dan badai media mengkritik keputusan anda (-10% Reputasi Keluarga)!';
      }
      GameState.addJournalEntry(`👑 ${msg}`, 'milestone');
    } else if (def.id === 'explorer') {
      // Penalti pecah kontrak penaja + lucut kelayakan Hadiah Nobel / Legenda Dunia selamanya
      const penalty = Utils.usdToLocal(18000 + (am.rankIndex * 12000), s.countryId);
      s.money -= penalty;
      s.nobelDisqualified = true;
      msg = `Anda menamatkan ekspedisi lebih awal — penalti pecah kontrak penaja -${Utils.formatMoney(penalty, s.countryId)}, semua geran dibatalkan, dan kelayakan Hadiah Nobel / Legenda Dunia dilucutkan SELAMANYA bagi hayat ini.`;
      GameState.addJournalEntry(`🧭 ${msg}`, 'warning');
    }

    // Kunci mod ini SELAMANYA bagi watak ini!
    if (!s.exitedModeIds.includes(def.id)) s.exitedModeIds.push(def.id);
    s.activeSpecialMode = null;
    if (window.CharacterStatus) CharacterStatus.recordPeakRole(s);
    GameState.save();

    return { ok: true, msg, followUpEvent };
  }
};
