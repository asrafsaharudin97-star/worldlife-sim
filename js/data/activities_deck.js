/* ==========================================================================
   WorldLife — Enjin Aktiviti Dinamik (Anti-Ulang, Tenaga Tahunan 3/3,
   Reroll "Cari Idea Lain" & Pertemuan Mini Interaktif)
   Bahasa Melayu
   ========================================================================== */

window.ActivitiesDeck = {
  // --------------------------------------------------------------------------
  // 1. CIRI PERSONALITI / TABIAT UNIK (2–3 diberi secara rawak sejak lahir)
  // --------------------------------------------------------------------------
  TRAITS: [
    { id: 'risk_taker', name: 'Berani Risiko', icon: '🎲', desc: 'Suka cabaran ekstrem & peluang berisiko tinggi.' },
    { id: 'charismatic', name: 'Berkarisma', icon: '✨', desc: 'Mudah memikat hati ramai, rundingan & dunia sosial.' },
    { id: 'cunning', name: 'Licik & Strategik', icon: '🦊', desc: 'Cepat menghidu peluang wang & helah lawan.' },
    { id: 'creative', name: 'Berjiwa Kreatif', icon: '🎨', desc: 'Kaya idea seni, konten & rekaan unik.' },
    { id: 'ambitious', name: 'Bercita-cita Tinggi', icon: '🚀', desc: 'Laparkan kejayaan, kerjaya & legasi besar.' },
    { id: 'eccentric', name: 'Unik & Eksentrik', icon: '🌀', desc: 'Berfikir luar kotak dan menarik kejadian pelik!' },
    { id: 'devout', name: 'Berpegang Teguh', icon: '🕊️', desc: 'Tenang, jujur dan kuat ketahanan rohani.' },
    { id: 'empathetic', name: 'Berhati Mulia', icon: '💛', desc: 'Disenangi masyarakat dan tinggi nilai karma.' }
  ],

  MAX_YEARLY_ENERGY: 3,
  MAX_YEARLY_REROLLS: 2,

  pickInitialTraits() {
    const count = Utils.chance(0.55) ? 3 : 2;
    const copy = [...this.TRAITS];
    const picked = [];
    while (picked.length < count && copy.length > 0) {
      const idx = Utils.randInt(0, copy.length - 1);
      picked.push(copy.splice(idx, 1)[0].id);
    }
    return picked;
  },

  getTraitObj(id) {
    return this.TRAITS.find(t => t.id === id) || this.TRAITS[0];
  },

  get POOL() {
    return (window.ActivitiesData && ActivitiesData.ACTIVITIES) ? ActivitiesData.ACTIVITIES : [];
  },

  ensureActivityState(s) {
    if (!s) return;
    if (!Array.isArray(s.recentActivityIds)) s.recentActivityIds = [];
    if (typeof s.activityEnergyLeft !== 'number') s.activityEnergyLeft = this.MAX_YEARLY_ENERGY;
    if (typeof s.activityEnergyMax !== 'number') s.activityEnergyMax = this.MAX_YEARLY_ENERGY;
    if (typeof s.activityRerollsLeft !== 'number') s.activityRerollsLeft = this.MAX_YEARLY_REROLLS;
    if (!Array.isArray(s.yearlyDeck)) s.yearlyDeck = [];
  },

  getAgeStageLabel(age) {
    if (age <= 12) return 'Kanak-kanak (5–12)';
    if (age <= 17) return 'Remaja (13–17)';
    if (age <= 59) return 'Dewasa (18–59)';
    return 'Warga Emas (60+)';
  },

  getLocalCost(act, s) {
    if (!act || !s) return 0;
    const baseUsd = act.cost ?? act.costUsd ?? 0;
    if (baseUsd <= 0) return 0;
    if (s.age < 15 && baseUsd <= 40 && window.GameState && GameState.hasLivingParent(s)) return 0; // ditanggung ibu bapa untuk kanak-kanak/remaja awal
    return Utils.usdToLocal(baseUsd, s.countryId);
  },

  // --------------------------------------------------------------------------
  // 2. ENJIN ROMBAKAN ANTI-ULANG (7–8 Aktiviti + Jaminan Alam/Travel + 20% Nadir)
  // --------------------------------------------------------------------------
  generateYearlyDeck(s, opts = {}) {
    if (!s) return [];
    GameState.ensureUpgradedState();
    this.ensureActivityState(s);

    // Jika tahun baharu (bukan reroll), tetapkan semula Tenaga 3/3 & Reroll 2/2
    if (!opts.isReroll) {
      s.activityEnergyMax = this.MAX_YEARLY_ENERGY;
      s.activityEnergyLeft = this.MAX_YEARLY_ENERGY;
      s.activityRerollsLeft = this.MAX_YEARLY_REROLLS;

      // Simpan dek tahun lepas ke dalam sejarah anti-ulang (simpan ~20 ID terakhir = 2–3 tahun)
      if (Array.isArray(s.yearlyDeck) && s.yearlyDeck.length > 0) {
        s.recentActivityIds = [...s.yearlyDeck, ...(s.recentActivityIds || [])].slice(0, 20);
      }
    } else {
      // Semasa reroll, elak kad yang sedang dipaparkan sekarang
      if (Array.isArray(s.yearlyDeck) && s.yearlyDeck.length > 0) {
        s.recentActivityIds = [...s.yearlyDeck, ...(s.recentActivityIds || [])].slice(0, 22);
      }
    }

    if (s.age < 5) {
      s.yearlyDeck = [];
      return [];
    }

    const pool = this.POOL;
    const traits = s.traits || [];
    const recentSet = new Set(s.recentActivityIds || []);
    const bonuses = window.Dynasty ? Dynasty.getBloodlineBonuses() : {};

    const isEligible = (a, ignoreRecent = false) => {
      if (s.age < (a.minAge || 5)) return false;
      if (s.age > (a.maxAge || 99)) return false;
      if (!ignoreRecent && recentSet.has(a.id)) return false;
      return true;
    };

    let normalPool = pool.filter(a => !a.isRare && isEligible(a, false));
    // Jika kolam terlalu kecil selepas tapisan anti-ulang, longgarkan kepada separuh sejarah
    if (normalPool.length < 10) {
      const veryRecent = new Set((s.recentActivityIds || []).slice(0, 7));
      normalPool = pool.filter(a => !a.isRare && isEligible(a, true) && !veryRecent.has(a.id));
    }

    const rarePool = pool.filter(a => a.isRare && isEligible(a, false));
    const fallbackRare = rarePool.length > 0 ? rarePool : pool.filter(a => a.isRare && isEligible(a, true));

    const scoreActivity = (a) => {
      let score = Math.random();
      const pref = a.preferredTraits || (a.boostTrait ? [a.boostTrait] : []);
      if (pref.some(t => traits.includes(t))) score += 0.28;
      // Sesuaikan sedikit dengan peringkat umur & kemampuan kewangan
      const costLocal = this.getLocalCost(a, s);
      if (costLocal === 0 || s.money >= costLocal * 2) score += 0.10;
      else if (s.money < costLocal) score -= 0.18;
      if (s.age >= 60 && (a.category === 'Kesihatan, Sukan & Jiwa' || a.category === 'Travel & Jalan-Jalan')) score += 0.15;
      if (s.age >= 18 && s.age <= 35 && (a.category === 'Alam & Pengembaraan' || a.category === 'Side Hustle & Kemahiran Santai')) score += 0.12;
      return score;
    };

    const deckSize = Utils.randInt(7, 8);
    const chosenIds = [];
    const addPick = (item) => {
      if (item && !chosenIds.includes(item.id)) chosenIds.push(item.id);
    };

    // 1) 20% peluang muncul kad emas "Peluang Terhad" (+ bonus Gen 5 Darah Dinasti)
    const rareChance = Math.min(0.45, 0.20 + (bonuses.rareActivityBonus || 0));
    if (fallbackRare.length > 0 && Utils.chance(rareChance)) {
      addPick(Utils.pick(fallbackRare));
    }

    // 2) Jaminan 1–2 aktiviti Alam & Pengembaraan / Travel & Jalan-Jalan
    const outdoorPool = normalPool.filter(a => a.category === 'Alam & Pengembaraan').sort((a, b) => scoreActivity(b) - scoreActivity(a));
    const travelPool = normalPool.filter(a => a.category === 'Travel & Jalan-Jalan').sort((a, b) => scoreActivity(b) - scoreActivity(a));
    if (outdoorPool.length > 0) addPick(outdoorPool[0]);
    if (travelPool.length > 0) addPick(travelPool[0]);

    // 3) Jaminan 1 aktiviti Hobi / Gaya Hidup & 1 Sosial / Kesihatan untuk kepelbagaian
    const hobbyPool = normalPool.filter(a => a.category === 'Hobi, Gaya Hidup & Kreatif' && !chosenIds.includes(a.id)).sort((a, b) => scoreActivity(b) - scoreActivity(a));
    if (hobbyPool.length > 0) addPick(hobbyPool[0]);

    const socialOrHealth = normalPool.filter(a => (a.category === 'Sosial, Komuniti & Hiburan' || a.category === 'Kesihatan, Sukan & Jiwa') && !chosenIds.includes(a.id)).sort((a, b) => scoreActivity(b) - scoreActivity(a));
    if (socialOrHealth.length > 0) addPick(socialOrHealth[0]);

    // 4) Penuhkan baki sehingga 7–8 kad mengikut skor tertinggi
    const remaining = normalPool
      .filter(a => !chosenIds.includes(a.id))
      .sort((a, b) => scoreActivity(b) - scoreActivity(a));

    for (const act of remaining) {
      if (chosenIds.length >= deckSize) break;
      addPick(act);
    }

    s.yearlyDeck = chosenIds;
    return chosenIds;
  },

  // --------------------------------------------------------------------------
  // 3. "🎲 CARI IDEA LAIN" (REROLL — Maksimum 2 Kali Setahun)
  // --------------------------------------------------------------------------
  rerollDeck() {
    const s = GameState.current;
    if (!s) return { ok: false, msg: 'Tiada watak aktif.' };
    this.ensureActivityState(s);

    if (s.age < 5) return { ok: false, msg: 'Tunggu umur 5 tahun untuk mula meneroka aktiviti!' };
    if (s.activityRerollsLeft <= 0) {
      return { ok: false, msg: 'Anda telah menggunakan kesemua 2 tukaran "Cari Idea Lain" untuk tahun ini!' };
    }

    s.activityRerollsLeft -= 1;
    this.generateYearlyDeck(s, { isReroll: true });
    GameState.save();
    return {
      ok: true,
      msg: `🎲 Senarai aktiviti dirombak! (Baki tukar idea tahun ini: ${s.activityRerollsLeft}/${this.MAX_YEARLY_REROLLS})`
    };
  },

  // --------------------------------------------------------------------------
  // 4. LAKSANAKAN AKTIVITI + 40% PELUANG PERTEMUAN MINI INTERAKTIF
  // --------------------------------------------------------------------------
  performActivity(actId) {
    const s = GameState.current;
    GameState.ensureUpgradedState();
    this.ensureActivityState(s);

    if (s.prison && s.prison.inPrison) {
      return { ok: false, msg: '⛓️ Anda sedang berada di dalam penjara — gunakan Hab Penjara!' };
    }
    const act = this.POOL.find(a => a.id === actId);
    if (!act) return { ok: false, msg: 'Aktiviti tidak ditemui.' };

    const doneKey = 'deck_' + act.id;
    if (s.yearlyActions[doneKey]) {
      return { ok: false, msg: 'Anda sudah melakukan aktiviti ini tahun ini!' };
    }

    const eCost = act.energyCost || 1;
    if ((s.activityEnergyLeft || 0) < eCost) {
      return {
        ok: false,
        msg: `⚡ Tenaga aktiviti tahun ini telah habis (0/${s.activityEnergyMax || 3})! Klik +UMUR untuk melangkah ke tahun baharu.`
      };
    }

    const costLocal = this.getLocalCost(act, s);
    if (costLocal > 0 && s.money < costLocal) {
      return {
        ok: false,
        msg: `Perlukan ${Utils.formatMoney(costLocal, s.countryId)} untuk melakukan aktiviti ini.`
      };
    }

    // Tolak kos & tenaga, tandakan sudah dilakukan
    if (costLocal > 0) {
      s.money -= costLocal;
      if (window.GameState && GameState.logCashFlow) GameState.logCashFlow(s, -costLocal, `Aktiviti: ${act.title}`, 'gaya_hidup');
    }
    s.activityEnergyLeft = Math.max(0, (s.activityEnergyLeft || 0) - eCost);
    s.yearlyActions[doneKey] = true;
    if (!s.recentActivityIds.includes(act.id)) {
      s.recentActivityIds.unshift(act.id);
      if (s.recentActivityIds.length > 22) s.recentActivityIds.length = 22;
    }

    // 40% peluang mencetuskan Modal Pertemuan Mini Interaktif (Real-World Plot Twist!)
    const encounter = this._maybeBuildMiniEncounter(act, s);
    if (encounter) {
      GameState.save();
      return {
        ok: true,
        tier: 'encounter',
        encounterEvent: encounter,
        msg: `⚡ Pertemuan mengejut semasa ${act.title}!`
      };
    }

    return this._resolveDirectOutcome(act, s);
  },

  _resolveDirectOutcome(act, s) {
    const traits = s.traits || [];
    const pref = act.preferredTraits || (act.boostTrait ? [act.boostTrait] : []);
    const hasSynergy = pref.some(t => traits.includes(t));
    const isTarnished = window.Dynasty && Dynasty.getData().legacyStatus === 'Tarnished';

    let greatProb = 0.30 + (hasSynergy ? 0.14 : 0) + ((s.stats.smarts - 50) * 0.002);
    let twistProb = 0.22 - (hasSynergy ? 0.07 : 0);
    if (isTarnished && (act.isRare || act.category === 'Sosial, Komuniti & Hiburan')) {
      greatProb -= 0.08;
      twistProb += 0.08;
    }

    const roll = Math.random();
    let tierKey = 'normal';
    if (roll < Math.max(0.12, greatProb)) tierKey = 'great';
    else if (roll > 1 - Math.max(0.10, twistProb)) tierKey = 'twist';

    let out = null;
    if (Array.isArray(act.outcomes)) {
      out = act.outcomes.find(o => o.tier === tierKey) || act.outcomes[1] || act.outcomes[0];
    } else if (act.outcomes) {
      const legacyKey = tierKey === 'great' ? 'win' : tierKey === 'twist' ? 'fail' : 'normal';
      out = act.outcomes[legacyKey] || act.outcomes.normal;
    }

    const flavorText = window.ActivitiesData
      ? ActivitiesData.formatFlavorText(out.text, s.countryId)
      : out.text;

    this._applyEffects(s, out);

    const tierTag = tierKey === 'great' ? '🌟 HASIL HEBAT' : tierKey === 'twist' ? '💥 PLOT TWIST' : '✨';
    const jType = tierKey === 'great' ? 'milestone' : tierKey === 'twist' ? 'warning' : 'culture';
    GameState.addJournalEntry(`${act.icon} ${act.title} (${tierTag}): ${flavorText}`, jType);

    if (act.isRare && tierKey === 'great' && window.KarmaEndings) {
      KarmaEndings.addHighlight(act.icon, `Menang besar dalam peluang terhad: ${act.title.replace('✨ ', '')}`);
    }
    GameState.save();

    return {
      ok: tierKey !== 'twist',
      tier: tierKey === 'great' ? 'win' : tierKey === 'twist' ? 'fail' : 'normal',
      msg: `${tierTag}: ${flavorText}`
    };
  },

  _applyEffects(s, eff) {
    if (!eff) return '';
    if (eff.stats) {
      const statsAdj = { ...eff.stats };
      if (typeof statsAdj.smarts === 'number' && statsAdj.smarts > 0) {
        statsAdj.smarts = Utils.clamp(Math.round(statsAdj.smarts / 3), 1, 3);
      }
      GameState.adjustStats(statsAdj);
    }
    if (eff.moneyUsd) {
      s.money += Utils.usdToLocal(eff.moneyUsd, s.countryId);
    }
    if (eff.followers && s.socialMedia) {
      s.socialMedia.followers = (s.socialMedia.followers || 0) + eff.followers;
    }
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
    }

    let extraLog = '';
    if (eff.addFriend) {
      const added = this._spawnActivityNpc(s, eff.addFriend, false);
      if (added) extraLog = ` 🤝 Kenalan baru ditambah: ${added.name} (${added.origin})!`;
    } else if (eff.addRomanticOrFriend) {
      const canRomance = !s.partnerId && s.age >= 16 && Utils.chance(0.45);
      const added = this._spawnActivityNpc(s, 'Kenalan Kembara', canRomance);
      if (added) {
        extraLog = canRomance
          ? ` 💘 Anda mula mengenali ${added.name} dengan lebih rapat!`
          : ` 🤝 Sahabat kembara baru ditambah: ${added.name}!`;
      }
    }
    return extraLog;
  },

  _spawnActivityNpc(s, originLabel, asPartner = false) {
    if (!window.Relationships) return null;
    Relationships.ensureRelationshipFields(s);
    const c = Utils.getCountry(s.countryId);

    if (asPartner && !s.partnerId) {
      const targetGender = s.gender === 'male' ? 'female' : 'male';
      const heritage = Utils.pick(c.heritages).id;
      const name = Utils.generateName(s.countryId, targetGender, heritage);
      const age = Utils.clamp(s.age + Utils.randInt(-3, 4), 18, 75);
      const job = Utils.pick(c.jobs).title;
      const partner = {
        id: 'rel_partner_' + Date.now() + '_' + Utils.randInt(10, 99),
        name,
        role: 'Sesi Date',
        category: 'partner',
        stage: 'dating',
        origin: originLabel,
        gender: targetGender,
        age,
        countryId: s.countryId,
        closeness: Utils.randInt(64, 82),
        trust: Utils.randInt(64, 84),
        compatibility: Utils.randInt(58, 95),
        alive: true,
        job
      };
      s.relationships.push(partner);
      s.partnerId = partner.id;
      return partner;
    }

    const activeFriends = s.relationships.filter(r => r.alive && r.category === 'friend');
    if (activeFriends.length >= 8) return null;

    const gender = Utils.chance(0.5) ? 'male' : 'female';
    const heritage = Utils.pick(c.heritages).id;
    const name = Utils.generateName(s.countryId, gender, heritage);
    const age = Utils.clamp(s.age + Utils.randInt(-4, 5), 7, 82);
    const job = age < 18 ? 'Pelajar' : Utils.pick(c.jobs).title;
    const friend = {
      id: 'rel_friend_' + Date.now() + '_' + Utils.randInt(10, 99),
      name,
      role: 'Rakan',
      category: 'friend',
      origin: originLabel || 'Komuniti Aktiviti',
      gender,
      age,
      countryId: s.countryId,
      closeness: Utils.randInt(55, 78),
      trust: Utils.randInt(55, 78),
      compatibility: Utils.randInt(55, 92),
      alive: true,
      job
    };
    s.relationships.push(friend);
    return friend;
  },

  _maybeBuildMiniEncounter(act, s, forceTrigger = false) {
    if (!window.ActivitiesData || !Array.isArray(ActivitiesData.MINI_ENCOUNTERS)) return null;
    if (!forceTrigger && !Utils.chance(0.40)) return null;

    const group = act.encounterGroup || 'social';
    const candidates = ActivitiesData.MINI_ENCOUNTERS.filter(e => e.groups && e.groups.includes(group));
    if (candidates.length === 0) return null;

    const template = Utils.pick(candidates);
    const format = (txt) => ActivitiesData.formatFlavorText(txt, s.countryId);

    return {
      id: `${template.id}_${s.age}_${Date.now()}`,
      icon: template.icon || act.icon,
      title: `${act.icon} ${template.title}`,
      text: format(template.text),
      choices: template.choices.map(ch => ({
        label: format(ch.label),
        hint: ch.hint ? format(ch.hint) : '',
        journalType: (ch.effect && ch.effect.karma && ch.effect.karma < 0) ? 'warning' : 'milestone',
        customAction: () => {
          const extra = this._applyEffects(s, ch.effect);
          const outMsg = format((ch.effect && ch.effect.outcomeText) || 'Satu pengalaman yang tidak dapat dilupakan!') + extra;
          if (act.isRare && window.KarmaEndings) {
            KarmaEndings.addHighlight(act.icon, `${act.title.replace('✨ ', '')}: ${outMsg.slice(0, 80)}`);
          }
          return {
            outcome: outMsg,
            toastType: (ch.effect && ch.effect.karma && ch.effect.karma < 0) ? 'error' : 'success'
          };
        }
      }))
    };
  }
};
