/* ==========================================================================
   WorldLife — Pengurusan Keadaan, Simpanan & Reben Legasi (Bahasa Melayu)
   ========================================================================== */

window.GameState = {
  SAVE_KEY: 'worldlife_current_save_v1',
  HISTORY_KEY: 'worldlife_graveyard_v1',
  current: null,

  createNewLife({ countryId, gender, heritageId, customName, isAdopted = false, isOutOfWedlock = false }) {
    const country = Utils.getCountry(countryId);
    const validHeritage = heritageId && country.names[heritageId]
      ? heritageId
      : country.heritages[0].id;
    const heritageObj = country.heritages.find(h => h.id === validHeritage) || country.heritages[0];
    const city = Utils.pick(country.cities);
    const startYear = 2004 + Utils.randInt(0, 20);

    const familyBelief = window.LIFE_EVENTS
      ? window.LIFE_EVENTS.pickFamilyBelief(countryId, validHeritage)
      : 'unassigned';
    const beliefObj = (window.BELIEFS && window.BELIEFS[familyBelief]) || { icon: '❔', name: 'Belum Ditentukan' };

    const rawFatherName = Utils.generateName(countryId, 'male', validHeritage);
    const rawMotherName = Utils.generateName(countryId, 'female', validHeritage);
    const fatherName = (familyBelief === 'islam' && !/\s+bin\s+/i.test(rawFatherName))
      ? Utils.formatIslamicName(Utils.extractGivenName(rawFatherName), 'male', Utils.generateGivenName(countryId, 'male', validHeritage))
      : rawFatherName;
    const motherName = (familyBelief === 'islam' && !/\s+(?:binti|binte)\s+/i.test(rawMotherName))
      ? Utils.formatIslamicName(Utils.extractGivenName(rawMotherName), 'female', Utils.generateGivenName(countryId, 'male', validHeritage))
      : rawMotherName;

    const name = Utils.generateChildName({
      countryId,
      gender,
      heritageId: validHeritage,
      belief: familyBelief,
      fatherFullName: fatherName,
      isAdopted,
      isOutOfWedlock,
      customGivenName: customName
    });

    const fatherJob = Utils.pick(country.jobs).title;
    const motherJob = Utils.pick(country.jobs).title;

    const relationships = [
      {
        id: 'rel_mom',
        name: motherName,
        role: 'Ibu',
        category: 'family',
        gender: 'female',
        age: Utils.randInt(25, 36),
        countryId,
        closeness: Utils.randInt(75, 95),
        trust: Utils.randInt(78, 96),
        compatibility: Utils.randInt(70, 95),
        belief: familyBelief,
        alive: true,
        job: motherJob
      },
      {
        id: 'rel_dad',
        name: fatherName,
        role: 'Ayah',
        category: 'family',
        gender: 'male',
        age: Utils.randInt(26, 39),
        countryId,
        closeness: Utils.randInt(72, 94),
        trust: Utils.randInt(75, 95),
        compatibility: Utils.randInt(68, 94),
        belief: familyBelief,
        alive: true,
        job: fatherJob
      }
    ];

    if (Utils.chance(0.55)) {
      const sibGender = Utils.chance(0.5) ? 'male' : 'female';
      const sibName = Utils.generateChildName({
        countryId,
        gender: sibGender,
        heritageId: validHeritage,
        belief: familyBelief,
        fatherFullName: fatherName,
        isAdopted: false,
        isOutOfWedlock: false
      });
      relationships.push({
        id: 'rel_sib_1',
        name: sibName,
        role: sibGender === 'male' ? 'Abang' : 'Kakak',
        category: 'family',
        gender: sibGender,
        age: Utils.randInt(2, 6),
        countryId,
        closeness: Utils.randInt(65, 90),
        trust: Utils.randInt(68, 92),
        compatibility: Utils.randInt(65, 92),
        belief: familyBelief,
        isAdopted: false,
        isOutOfWedlock: false,
        alive: true,
        job: 'Pelajar'
      });
    }

    const state = {
      id: 'life_' + Date.now(),
      name,
      gender,
      heritageId: validHeritage,
      heritageLabel: heritageObj.label,
      isAdopted: Boolean(isAdopted),
      isOutOfWedlock: Boolean(isOutOfWedlock),
      age: 0,
      year: startYear,
      alive: true,
      causeOfDeath: null,

      belief: familyBelief,
      familyBelief,
      devotion: familyBelief === 'unassigned' ? 20 : Utils.randInt(35, 65),
      lastSpiritualAge: -99,
      spiritualHistory: [],
      hiddenFlags: {},
      recentCrises: [],

      birthCountryId: countryId,
      birthCity: city,
      countryId,
      city,
      residencyStatus: 'Citizen',
      yearsInCurrentCountry: 0,
      citizenships: [countryId],
      culturalAdaptation: { [countryId]: 100 },
      passportStamps: [
        {
          countryId,
          city,
          year: startYear,
          age: 0,
          type: 'Kelahiran',
          status: 'Citizen'
        }
      ],
      countriesLivedIn: [countryId],

      stats: {
        happiness: Utils.randInt(72, 92),
        health: Utils.randInt(76, 96),
        smarts: Utils.randInt(48, 86),
        looks: Utils.randInt(48, 88)
      },

      money: 0,
      investments: 0,
      retirementFund: 0,
      annualExpensesMultiplier: 1,
      criminalRecord: 0,
      hasDriverLicense: false,
      generation: 1,

      education: {
        stage: 'infant',
        schoolName: null,
        universityName: null,
        uniYearsLeft: 0,
        hasHighSchool: false,
        hasDegree: false,
        examGrade: null
      },
      job: null,
      peakSalaryUsd: 0,

      assets: {
        vehicles: [],
        properties: []
      },

      relationships,
      partnerId: null,
      married: false,

      yearlyActions: {},
      seenEventIds: [],

      journal: [
        {
          age: 0,
          year: startYear,
          countryId,
          city,
          entries: [
            {
              type: 'milestone',
              text: `Anda dilahirkan di ${city}, ${country.name} ${country.flag}. Ibu anda ialah ${motherName} (${motherJob}) dan ayah anda ialah ${fatherName} (${fatherJob}).`
            },
            {
              type: 'culture',
              text: `Membesar sebagai ${heritageObj.label} (latar keluarga: ${beliefObj.icon} ${beliefObj.name}) di ${country.name}: ${country.tagline}`
            }
          ]
        }
      ]
    };

    if (window.Dynasty && Dynasty.resetForFreshDynasty) {
      Dynasty.resetForFreshDynasty();
    }
    this.current = state;
    this.ensureUpgradedState();
    if (window.ActivitiesDeck && ActivitiesDeck.generateYearlyDeck) {
      ActivitiesDeck.generateYearlyDeck(state);
    }
    this.save();
    return state;
  },

  addJournalEntry(text, type = 'normal') {
    const s = this.current;
    if (!s) return;
    let block = s.journal[s.journal.length - 1];
    if (!block || block.age !== s.age || block.countryId !== s.countryId) {
      block = {
        age: s.age,
        year: s.year,
        countryId: s.countryId,
        city: s.city,
        entries: []
      };
      s.journal.push(block);
    }
    block.entries.push({ type, text });
    this.scheduleSave();
  },

  // Gabungkan banyak panggilan simpan (cth. berbilang catatan log dalam satu tahun)
  // kepada satu operasi JSON.stringify sahaja untuk prestasi yang lancar.
  _saveTimer: null,
  scheduleSave() {
    if (typeof setTimeout !== 'function') {
      this.save();
      return;
    }
    if (this._saveTimer) return;
    this._saveTimer = setTimeout(() => {
      this._saveTimer = null;
      this.save();
    }, 0);
  },

  flushSave() {
    if (this._saveTimer) {
      clearTimeout(this._saveTimer);
      this._saveTimer = null;
    }
    return this.save();
  },

  getCurrentAdaptation() {
    const s = this.current;
    if (!s) return 100;
    return s.culturalAdaptation[s.countryId] ?? 100;
  },

  adjustAdaptation(delta) {
    const s = this.current;
    if (!s) return;
    const cur = s.culturalAdaptation[s.countryId] ?? 20;
    s.culturalAdaptation[s.countryId] = Utils.clamp(cur + delta, 0, 100);
  },

  getBeliefObj(beliefId) {
    const id = beliefId || (this.current && this.current.belief) || 'unassigned';
    return (window.BELIEFS && window.BELIEFS[id]) || {
      id: 'unassigned',
      name: 'Belum Ditentukan',
      icon: '❔',
      isReligious: false,
      resilienceBonus: 0.05,
      practiceTitle: 'Merenung Makna Hidup',
      practiceDesc: 'Ambil masa mengenali nilai diri dan bantu komuniti',
      charityLabel: 'Kebajikan',
      desc: 'Masih mencari pegangan hidup.'
    };
  },

  ensureUpgradedState() {
    const s = this.current;
    if (!s) return;
    if (!s.familyBelief) {
      s.familyBelief = window.LIFE_EVENTS
        ? window.LIFE_EVENTS.pickFamilyBelief(s.birthCountryId || s.countryId, s.heritageId)
        : 'unassigned';
    }
    if (!s.belief) s.belief = s.familyBelief;
    if (typeof s.devotion !== 'number') s.devotion = 45;
    if (typeof s.lastSpiritualAge !== 'number') s.lastSpiritualAge = -99;
    if (!Array.isArray(s.spiritualHistory)) s.spiritualHistory = [];
    if (!s.hiddenFlags || typeof s.hiddenFlags !== 'object') s.hiddenFlags = {};
    if (!Array.isArray(s.recentCrises)) s.recentCrises = [];

    if (!s.alignment || typeof s.alignment !== 'object') {
      s.alignment = { karma: 0, fame: 0, peakFame: 0, notoriety: 0, stress: 10 };
    }
    if (!s.socialMedia || typeof s.socialMedia !== 'object') {
      s.socialMedia = { hasAccount: false, platforms: [], followers: 0, posts: 0, viralHits: 0, cancelledCount: 0 };
    }
    if (!s.prison || typeof s.prison !== 'object') {
      s.prison = { inPrison: false, yearsLeft: 0, totalServed: 0, crimeName: null };
    }
    if (!s.modes || typeof s.modes !== 'object') {
      s.modes = {
        crime: { opsSuccess: 0, heistsDone: 0 },
        mafia: { active: false, syndicateName: null, rankIndex: 0, respect: 0 },
        artist: { active: false, rankIndex: 0, skill: 0, releases: 0, awards: 0, contractType: null },
        actor: { active: false, rankIndex: 0, skill: 0, films: 0, awards: 0 },
        politic: { active: false, rankIndex: 0, approval: 40, faction: null, policiesPassed: 0, corruptionCount: 0 }
      };
    }
    if (!s.activeArcs || typeof s.activeArcs !== 'object') s.activeArcs = {};
    if (!Array.isArray(s.highlights)) s.highlights = [];
    if (!Array.isArray(s.modesVisited)) s.modesVisited = [];
    if (!Array.isArray(s.traits) || s.traits.length === 0) {
      s.traits = (window.ActivitiesDeck && ActivitiesDeck.pickInitialTraits)
        ? ActivitiesDeck.pickInitialTraits()
        : ['ambitious', 'charismatic'];
    }
    if (!Array.isArray(s.yearlyDeck)) {
      s.yearlyDeck = [];
    }

    if (window.Relationships && Relationships.ensureRelationshipFields) {
      Relationships.ensureRelationshipFields(s);
    }
    if (window.PrisonFugitive && PrisonFugitive.ensureFields) {
      PrisonFugitive.ensureFields(s);
    }
    if (window.EduCareerEngine && EduCareerEngine.ensureFields) {
      EduCareerEngine.ensureFields(s);
    }
    if (window.AssetsEngine && AssetsEngine.ensureFields) {
      AssetsEngine.ensureFields(s);
    }
    if (window.ModeEngine && ModeEngine.ensureFields) {
      ModeEngine.ensureFields(s);
    }
    if (window.CharacterStatus && CharacterStatus.reconcileCharacterState) {
      CharacterStatus.reconcileCharacterState(s);
    }
  },

  setHiddenFlag(key, data = {}) {
    const s = this.current;
    if (!s || !key) return;
    if (!s.hiddenFlags) s.hiddenFlags = {};
    s.hiddenFlags[key] = {
      setAge: s.age,
      setYear: s.year,
      data,
      resolved: false
    };
  },

  recordCrisis(type) {
    const s = this.current;
    if (!s || !type) return;
    if (!Array.isArray(s.recentCrises)) s.recentCrises = [];
    s.recentCrises.push({ type, age: s.age });
    if (s.recentCrises.length > 8) s.recentCrises = s.recentCrises.slice(-8);
  },

  adjustStats(effects = {}) {
    const s = this.current;
    if (!s) return;
    if (effects.happiness) {
      let delta = effects.happiness;
      // Ketahanan mental hasil pegangan hidup & kekuatan jiwa melembutkan kejutan negatif
      if (delta <= -6 && s.belief && s.belief !== 'unassigned') {
        const b = this.getBeliefObj(s.belief);
        const devotionFactor = Utils.clamp(s.devotion || 40, 0, 100) / 100;
        const mitigation = Math.min(0.28, (b.resilienceBonus || 0.1) * (0.5 + devotionFactor * 0.7));
        delta = Math.round(delta * (1 - mitigation));
      }
      s.stats.happiness = Utils.clamp(s.stats.happiness + delta);
    }
    if (effects.health) s.stats.health = Utils.clamp(s.stats.health + effects.health);
    if (effects.smarts) s.stats.smarts = Utils.clamp(s.stats.smarts + effects.smarts);
    if (effects.looks) s.stats.looks = Utils.clamp(s.stats.looks + effects.looks);
    if (effects.adaptation && s.countryId !== s.birthCountryId) {
      this.adjustAdaptation(effects.adaptation);
    } else if (effects.adaptation && s.countryId === s.birthCountryId) {
      s.stats.happiness = Utils.clamp(s.stats.happiness + Math.round(effects.adaptation / 4));
    }
  },

  getNetWorth() {
    const s = this.current;
    if (!s) return 0;
    if (window.AssetsEngine && AssetsEngine.getAssetCashflowSummary) {
      const aSum = AssetsEngine.getAssetCashflowSummary(s);
      return Math.round((s.money || 0) + (s.retirementFund || 0) + aSum.totalAssetValue - aSum.totalDebt);
    }
    let total = s.money + (s.investments || 0) + s.retirementFund;
    for (const v of s.assets.vehicles) total += v.value;
    for (const p of s.assets.properties) total += p.value;
    return Math.round(total);
  },

  continueAsChild(childId) {
    const parent = this.current;
    if (!parent) return null;
    const child = parent.relationships.find(r => r.id === childId && r.alive);
    if (!child) return null;

    const cId = child.countryId || parent.countryId;
    const country = Utils.getCountry(cId);
    const parentC = Utils.getCountry(parent.countryId);
    const city = cId === parent.countryId ? parent.city : Utils.pick(country.cities);

    const livingKids = parent.relationships.filter(r => (r.role === 'Anak Lelaki' || r.role === 'Anak Perempuan' || r.role === 'Son' || r.role === 'Daughter') && r.alive);
    const parentNet = Math.max(0, this.getNetWorth());
    const shareLocal = Utils.convertMoney(Math.round(parentNet / Math.max(1, livingKids.length)), parent.countryId, cId);

    const siblings = livingKids
      .filter(k => k.id !== child.id)
      .map(k => ({
        id: k.id,
        name: k.name,
        role: k.gender === 'male' ? 'Adik/Abang' : 'Adik/Kakak',
        gender: k.gender,
        age: k.age,
        countryId: k.countryId,
        closeness: Utils.randInt(65, 92),
        alive: true,
        job: k.age >= 22 ? Utils.pick(Utils.getCountry(k.countryId).jobs).title : 'Pelajar'
      }));

    const otherParent = parent.relationships.find(r => r.id === parent.partnerId && r.alive);
    if (otherParent) {
      siblings.unshift({
        id: otherParent.id,
        name: otherParent.name,
        role: otherParent.gender === 'female' ? 'Ibu' : 'Ayah',
        gender: otherParent.gender,
        age: otherParent.age,
        countryId: otherParent.countryId,
        closeness: Utils.randInt(75, 95),
        alive: true,
        job: otherParent.job
      });
    }

    const childAge = child.age;
    const edStage = childAge < 5 ? 'infant'
      : childAge < 12 ? 'primary'
      : childAge < 18 ? 'secondary'
      : 'highschool_done';

    const state = {
      id: 'life_' + Date.now(),
      name: child.name,
      gender: child.gender,
      heritageId: country.heritages[0].id,
      heritageLabel: `${parent.heritageLabel} (${country.name})`,
      isAdopted: Boolean(child.isAdopted),
      isOutOfWedlock: Boolean(child.isOutOfWedlock),
      age: childAge,
      year: parent.year,
      alive: true,
      causeOfDeath: null,

      belief: parent.belief || 'unassigned',
      familyBelief: parent.belief || 'unassigned',
      devotion: Utils.randInt(35, 65),
      lastSpiritualAge: -99,
      spiritualHistory: [],
      hiddenFlags: {},
      recentCrises: [],

      birthCountryId: cId,
      birthCity: city,
      countryId: cId,
      city,
      residencyStatus: 'Citizen',
      yearsInCurrentCountry: childAge,
      citizenships: [cId],
      culturalAdaptation: { [cId]: 100 },
      passportStamps: [
        { countryId: cId, city, year: parent.year - childAge, age: 0, type: 'Kelahiran', status: 'Citizen' }
      ],
      countriesLivedIn: [cId],

      stats: {
        happiness: Utils.randInt(60, 82),
        health: Utils.randInt(78, 96),
        smarts: Utils.randInt(55, 88),
        looks: Utils.randInt(55, 88)
      },

      money: shareLocal,
      investments: 0,
      retirementFund: 0,
      annualExpensesMultiplier: 1,
      criminalRecord: 0,
      hasDriverLicense: childAge >= 18,
      generation: (parent.generation || 1) + 1,

      education: {
        stage: edStage,
        schoolName: edStage === 'primary' ? `${city} ${country.education.primary.name}`
          : edStage === 'secondary' ? `${city} ${country.education.secondary.name}` : null,
        universityName: null,
        uniYearsLeft: 0,
        hasHighSchool: childAge >= 18,
        hasDegree: childAge >= 23 && Utils.chance(0.5),
        examGrade: childAge >= 18 ? 'Lulus' : null
      },
      job: null,
      peakSalaryUsd: 0,

      assets: { vehicles: [], properties: [] },
      relationships: siblings,
      partnerId: null,
      married: false,

      yearlyActions: {},
      seenEventIds: [],

      journal: [
        {
          age: childAge,
          year: parent.year,
          countryId: cId,
          city,
          entries: [
            {
              type: 'milestone',
              text: `👑 Legasi Generasi ${(parent.generation || 1) + 1}! Anda menyambung kehidupan sebagai ${child.name} (Umur ${childAge}) di ${city}, ${country.name} ${country.flag} selepas pemergian ${parent.name} (${parentC.flag}).`
            },
            {
              type: 'culture',
              text: `💰 Anda mewarisi ${Utils.formatMoney(shareLocal, cId)} daripada harta pusaka ${parent.name}!`
            }
          ]
        }
      ]
    };

    this.current = state;
    this.ensureUpgradedState();
    if (window.AssetsEngine && AssetsEngine.transferInheritanceToHeir) {
      const inh = AssetsEngine.transferInheritanceToHeir(parent, state);
      if (inh && (inh.props > 0 || inh.vehs > 0 || inh.heirlooms > 0)) {
        this.addJournalEntry(
          `🏛️ Pewarisan Aset Keluarga: ${inh.props} Hartanah, ${inh.vehs} Kenderaan & ${inh.heirlooms} Pusaka Keluarga berjaya diwarisi!`,
          'milestone'
        );
      }
    }
    if (window.Dynasty) {
      const bonuses = Dynasty.getBloodlineBonuses();
      if (bonuses.startingWealthMult && state.money > 0) {
        state.money = Math.round(state.money * (1 + bonuses.startingWealthMult));
      }
      Dynasty.checkPrimeGeneration(state.generation, state);
    }
    if (window.ActivitiesDeck && ActivitiesDeck.generateYearlyDeck) {
      ActivitiesDeck.generateYearlyDeck(state);
    }
    this.save();
    return state;
  },

  // Sambung Legasi Keluarga — gunakan anak hidup jika ada, atau pewaris waris terdekat jika tiada anak
  continueFamilyLegacy(childId = null) {
    const parent = this.current;
    if (!parent) return null;
    if (window.Dynasty) Dynasty.recordMemberDeath(parent);

    if (childId) {
      return this.continueAsChild(childId);
    }
    const livingKids = parent.relationships.filter(r => ['Anak Lelaki', 'Anak Perempuan', 'Son', 'Daughter'].includes(r.role) && r.alive);
    if (livingKids.length > 0) {
      return this.continueAsChild(livingKids[0].id);
    }

    // Jika tiada anak hidup: lantik pewaris waris keluarga (anak saudara / waris terdekat) supaya dinasti tidak putus!
    const cId = parent.countryId;
    const country = Utils.getCountry(cId);
    const city = parent.city || Utils.pick(country.cities);
    const heirGender = Utils.chance(0.5) ? 'male' : 'female';
    const validHeritage = (parent.heritageId && country.names[parent.heritageId]) ? parent.heritageId : country.heritages[0].id;
    const belief = parent.belief || parent.familyBelief || 'unassigned';
    const fatherRef = parent.gender === 'male' ? parent.name : Utils.generateName(cId, 'male', validHeritage);
    const heirName = Utils.generateChildName({
      countryId: cId,
      gender: heirGender,
      heritageId: validHeritage,
      belief,
      fatherFullName: fatherRef,
      isAdopted: false,
      isOutOfWedlock: false
    });

    const netWorth = this.getNetWorth(); // Kekalkan harta ATAU hutang legasi!
    const newGen = (parent.generation || 1) + 1;
    const heirAge = Utils.randInt(16, 22);

    const state = {
      id: 'life_' + Date.now(),
      name: heirName,
      gender: heirGender,
      heritageId: validHeritage,
      heritageLabel: parent.heritageLabel,
      isAdopted: false,
      isOutOfWedlock: false,
      age: heirAge,
      year: parent.year,
      alive: true,
      causeOfDeath: null,

      belief,
      familyBelief: belief,
      devotion: Utils.randInt(35, 65),
      lastSpiritualAge: -99,
      spiritualHistory: [],
      hiddenFlags: {},
      recentCrises: [],

      birthCountryId: cId,
      birthCity: city,
      countryId: cId,
      city,
      residencyStatus: 'Citizen',
      yearsInCurrentCountry: heirAge,
      citizenships: [cId],
      culturalAdaptation: { [cId]: 100 },
      passportStamps: [
        { countryId: cId, city, year: parent.year - heirAge, age: 0, type: 'Kelahiran Pewaris', status: 'Citizen' }
      ],
      countriesLivedIn: [cId],

      stats: {
        happiness: Utils.randInt(60, 82),
        health: Utils.randInt(78, 96),
        smarts: Utils.randInt(55, 88),
        looks: Utils.randInt(55, 88)
      },

      money: netWorth,
      investments: 0,
      retirementFund: 0,
      annualExpensesMultiplier: 1,
      criminalRecord: 0,
      hasDriverLicense: heirAge >= 18,
      generation: newGen,

      education: {
        stage: heirAge < 18 ? 'secondary' : 'highschool_done',
        schoolName: heirAge < 18 ? `${city} ${country.education.secondary.name}` : null,
        universityName: null,
        uniYearsLeft: 0,
        hasHighSchool: heirAge >= 18,
        hasDegree: false,
        examGrade: heirAge >= 18 ? 'Lulus' : null
      },
      job: null,
      peakSalaryUsd: 0,

      assets: { vehicles: [], properties: [] },
      relationships: [],
      partnerId: null,
      married: false,

      yearlyActions: {},
      seenEventIds: [],

      journal: [
        {
          age: heirAge,
          year: parent.year,
          countryId: cId,
          city,
          entries: [
            {
              type: 'milestone',
              text: `👑 Legasi Dinasti Generasi ${newGen}! Sebagai pewaris waris keluarga, ${heirName} (Umur ${heirAge}) menyambung obor keluarga selepas pemergian ${parent.name}.`
            },
            {
              type: netWorth >= 0 ? 'culture' : 'warning',
              text: netWorth >= 0
                ? `💰 Anda mewarisi harta pusaka bernilai ${Utils.formatMoney(netWorth, cId)} daripada ${parent.name}!`
                : `💸 Anda terpaksa menanggung legasi hutang sebanyak ${Utils.formatMoney(netWorth, cId)} daripada ${parent.name}!`
            }
          ]
        }
      ]
    };

    this.current = state;
    this.ensureUpgradedState();
    if (window.AssetsEngine && AssetsEngine.transferInheritanceToHeir) {
      const inh = AssetsEngine.transferInheritanceToHeir(parent, state);
      if (inh && (inh.props > 0 || inh.vehs > 0 || inh.heirlooms > 0)) {
        this.addJournalEntry(
          `🏛️ Pewarisan Aset Dinasti: ${inh.props} Hartanah, ${inh.vehs} Kenderaan & ${inh.heirlooms} Pusaka Keluarga diwarisi ke Generasi ${newGen}!`,
          'milestone'
        );
      }
    }
    if (window.Dynasty) {
      const bonuses = Dynasty.getBloodlineBonuses();
      if (bonuses.startingWealthMult && state.money > 0) {
        state.money = Math.round(state.money * (1 + bonuses.startingWealthMult));
      }
      Dynasty.checkPrimeGeneration(newGen, state);
    }
    if (window.ActivitiesDeck && ActivitiesDeck.generateYearlyDeck) {
      ActivitiesDeck.generateYearlyDeck(state);
    }
    this.save();
    return state;
  },

  computeRibbon(s) {
    if (window.KarmaEndings && KarmaEndings.evaluateEnding) {
      const end = KarmaEndings.evaluateEnding(s);
      return { name: end.title, icon: end.icon, desc: end.desc };
    }
    const netUsd = Utils.localToUsd(this.getNetWorth(), s.countryId);
    const countriesCount = s.countriesLivedIn.length;
    const citizenCount = s.citizenships.length;
    const kidsCount = s.relationships.filter(r => ['Anak Lelaki', 'Anak Perempuan', 'Son', 'Daughter'].includes(r.role)).length;

    if (countriesCount >= 3 || citizenCount >= 3) {
      return { name: 'Pengembara Dunia', icon: '🌍', desc: `Menetap di ${countriesCount} negara dan menghayati pelbagai budaya dunia!` };
    }
    if (countriesCount >= 2 && (s.culturalAdaptation[s.countryId] || 0) >= 85) {
      return { name: 'Bunglon Budaya', icon: '🎭', desc: 'Berhijrah ke luar negara dan menyesuaikan diri bagaikan anak jati!' };
    }
    if (netUsd >= 1200000) {
      return { name: 'Jutawan Global', icon: '💰', desc: 'Berjaya membina kekayaan luar biasa merentasi sempadan!' };
    }
    if (s.birthCountryId === 'MY' && s.countryId === 'MY' && s.age >= 60) {
      return { name: 'Anak Malaysia Sejati', icon: '🇲🇾', desc: 'Menjalani hidup Malaysia yang penuh warna dari lepak Mamak hingga hari tua!' };
    }
    if (s.education.hasDegree && s.stats.smarts >= 85) {
      return { name: 'Cendekiawan Terbilang', icon: '🎓', desc: 'Berdedikasi tinggi terhadap ilmu dan kecemerlangan akademik.' };
    }
    if (s.married && kidsCount >= 2 && s.stats.happiness >= 70) {
      return { name: 'Keluarga Utama', icon: '❤️', desc: 'Membina keluarga yang bahagia dan penuh kasih sayang.' };
    }
    if (s.criminalRecord >= 2) {
      return { name: 'Pemberontak Licik', icon: '🕶️', desc: 'Hidup penuh risiko di pinggir undang-undang.' };
    }
    if ((s.spiritualHistory && s.spiritualHistory.length >= 2) || (s.devotion >= 85 && s.belief && s.belief !== 'unassigned')) {
      return { name: 'Pencari Makna', icon: '🌌', desc: 'Menghayati perjalanan jiwa dan pegangan hidup dengan penuh kesedaran.' };
    }
    return { name: 'Jiwa Seimbang', icon: '✨', desc: 'Melalui perjalanan hidup yang bermakna dengan budaya, pilihan dan pengalaman.' };
  },

  archiveCurrentLife() {
    const s = this.current;
    if (!s) return;
    if (window.Dynasty && Dynasty.recordMemberDeath) {
      Dynasty.recordMemberDeath(s);
    }
    const ribbon = this.computeRibbon(s);
    const history = this.getHistory();
    history.unshift({
      id: s.id,
      name: s.name,
      age: s.age,
      birthCountryId: s.birthCountryId,
      finalCountryId: s.countryId,
      countriesLivedIn: s.countriesLivedIn,
      netWorthFormatted: Utils.formatMoney(this.getNetWorth(), s.countryId, true),
      ribbon,
      causeOfDeath: s.causeOfDeath
    });
    const store = window.SafeStorage;
    const trimmed = history.slice(0, this.MAX_HISTORY);
    if (store) {
      store.setJSON(this.HISTORY_KEY, trimmed, () => trimmed.slice(0, 8));
    } else {
      try { localStorage.setItem(this.HISTORY_KEY, JSON.stringify(trimmed)); } catch (e) {}
    }
  },

  getHistory() {
    if (window.SafeStorage) {
      const h = SafeStorage.getJSON(this.HISTORY_KEY, []);
      return Array.isArray(h) ? h : [];
    }
    try {
      const raw = localStorage.getItem(this.HISTORY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  // --------------------------------------------------------------------------
  // HAD MEMORI LOG KEHIDUPAN (maks 250 catatan aktif dalam memori)
  // --------------------------------------------------------------------------
  MAX_JOURNAL_ENTRIES: 250,
  MAX_HISTORY: 20,

  countJournalEntries(s) {
    if (!s || !Array.isArray(s.journal)) return 0;
    let n = 0;
    for (const b of s.journal) n += (b.entries ? b.entries.length : 0);
    return n;
  },

  // Buang catatan paling lama (blok tahun terawal dahulu) sehingga jumlah <= max.
  // Blok tahun semasa (terakhir) sentiasa dikekalkan.
  trimJournal(s, max = this.MAX_JOURNAL_ENTRIES) {
    if (!s || !Array.isArray(s.journal)) return 0;
    let total = this.countJournalEntries(s);
    let removed = 0;
    while (total > max && s.journal.length > 1) {
      const first = s.journal[0];
      const n = first.entries ? first.entries.length : 0;
      if (total - n >= max || !first.entries || n === 0) {
        s.journal.shift();
        total -= n;
        removed += n;
      } else {
        const drop = total - max;
        first.entries.splice(0, drop);
        total -= drop;
        removed += drop;
      }
    }
    // Kes ekstrem: satu blok tahun sahaja tetapi melebihi had
    if (total > max && s.journal.length === 1 && s.journal[0].entries) {
      const drop = total - max;
      s.journal[0].entries.splice(0, drop);
      removed += drop;
    }
    if (removed > 0) s.journalTrimmedCount = (s.journalTrimmedCount || 0) + removed;
    return removed;
  },

  save() {
    if (this._saveTimer && typeof clearTimeout === 'function') {
      clearTimeout(this._saveTimer);
      this._saveTimer = null;
    }
    if (!this.current) return false;
    this.trimJournal(this.current);
    if (window.SafeStorage) {
      return SafeStorage.setJSON(this.SAVE_KEY, this.current, () => this.current);
    }
    try {
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(this.current));
      return true;
    } catch (e) {
      return false;
    }
  },

  load() {
    try {
      const parsed = window.SafeStorage
        ? SafeStorage.getJSON(this.SAVE_KEY, null)
        : JSON.parse(localStorage.getItem(this.SAVE_KEY) || 'null');
      if (parsed && typeof parsed === 'object') {
        this.current = parsed;
        this.ensureUpgradedState();
        this.trimJournal(this.current);
        return this.current;
      }
    } catch (e) {}
    return null;
  },

  clearSave() {
    this.current = null;
    if (window.SafeStorage) {
      SafeStorage.remove(this.SAVE_KEY);
      return;
    }
    try {
      localStorage.removeItem(this.SAVE_KEY);
    } catch (e) {}
  },

  // --------------------------------------------------------------------------
  // EKSPORT & IMPORT SIMPANAN (.json)
  // --------------------------------------------------------------------------
  EXPORT_FORMAT: 'worldlife-save',
  EXPORT_VERSION: 1,

  buildExportBundle() {
    if (this.current) this.save();
    const store = window.SafeStorage;
    const read = (k, fb) => (store ? store.getJSON(k, fb) : fb);
    return {
      format: this.EXPORT_FORMAT,
      version: this.EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      current: this.current ? JSON.parse(JSON.stringify(this.current)) : null,
      dynasty: window.Dynasty ? JSON.parse(JSON.stringify(Dynasty.getData())) : read('worldlife_dynasty_v1', null),
      history: this.getHistory(),
      unlocked: window.KarmaEndings ? KarmaEndings.getUnlocked() : read('worldlife_unlocked_v1', null),
      settings: { muted: !!window._wlMuted }
    };
  },

  // Sahkan bundle sebelum dipulihkan. Pulangkan { ok, msg }
  validateImportBundle(bundle) {
    if (!bundle || typeof bundle !== 'object') return { ok: false, msg: 'Fail tidak sah: kandungan bukan objek JSON.' };
    if (bundle.format !== this.EXPORT_FORMAT) return { ok: false, msg: 'Fail ini bukan fail simpanan WorldLife.' };
    if (typeof bundle.version !== 'number' || bundle.version > this.EXPORT_VERSION) {
      return { ok: false, msg: 'Versi fail simpanan tidak disokong.' };
    }
    const c = bundle.current;
    if (c !== null && c !== undefined) {
      if (typeof c !== 'object') return { ok: false, msg: 'Data watak rosak.' };
      if (typeof c.name !== 'string' || !c.name) return { ok: false, msg: 'Data watak rosak: nama tiada.' };
      if (typeof c.age !== 'number' || c.age < 0 || c.age > 150) return { ok: false, msg: 'Data watak rosak: umur tidak sah.' };
      if (!c.stats || typeof c.stats !== 'object') return { ok: false, msg: 'Data watak rosak: statistik tiada.' };
      if (!Array.isArray(c.journal)) return { ok: false, msg: 'Data watak rosak: log kehidupan tiada.' };
      if (!c.countryId || !window.COUNTRIES || !window.COUNTRIES[c.countryId]) {
        return { ok: false, msg: 'Data watak rosak: negara tidak dikenali.' };
      }
    }
    if (bundle.dynasty != null) {
      const d = bundle.dynasty;
      if (typeof d !== 'object' || !Array.isArray(d.dynastyHistory || []) || !Array.isArray(d.primeAchievements || [])) {
        return { ok: false, msg: 'Data legasi dinasti rosak.' };
      }
    }
    if (bundle.history != null && !Array.isArray(bundle.history)) return { ok: false, msg: 'Data Dewan Kehidupan Lalu rosak.' };
    return { ok: true, msg: 'Fail simpanan sah.' };
  },

  importBundle(bundle) {
    const v = this.validateImportBundle(bundle);
    if (!v.ok) return v;
    const store = window.SafeStorage;

    if (bundle.dynasty) {
      if (window.Dynasty) {
        Dynasty._cache = Object.assign(Dynasty._defaultData(), bundle.dynasty);
        Dynasty.save();
      } else if (store) {
        store.setJSON('worldlife_dynasty_v1', bundle.dynasty);
      }
    }
    if (Array.isArray(bundle.history) && store) {
      store.setJSON(this.HISTORY_KEY, bundle.history.slice(0, this.MAX_HISTORY));
    }
    if (bundle.unlocked && window.KarmaEndings && KarmaEndings.UNLOCKED_KEY && store) {
      store.setJSON(KarmaEndings.UNLOCKED_KEY, bundle.unlocked);
    }
    if (bundle.settings && typeof bundle.settings.muted === 'boolean' && window.Utils && Utils.setMuted) {
      Utils.setMuted(bundle.settings.muted);
    }

    if (bundle.current) {
      this.current = JSON.parse(JSON.stringify(bundle.current));
      this.ensureUpgradedState();
      this.trimJournal(this.current);
      this.save();
    } else {
      this.clearSave();
    }
    return { ok: true, msg: 'Simpanan berjaya dipulihkan!' };
  }
};

// Peringkat pemangkasan kecemasan apabila kuota localStorage penuh
if (window.SafeStorage) {
  SafeStorage.registerTrimmer(() => {
    if (GameState.current) GameState.trimJournal(GameState.current, 120);
  });
  SafeStorage.registerTrimmer(() => {
    if (GameState.current) GameState.trimJournal(GameState.current, 60);
    const h = GameState.getHistory();
    if (h.length > 8) {
      try { localStorage.setItem(GameState.HISTORY_KEY, JSON.stringify(h.slice(0, 8))); } catch (e) {}
    }
  });
  SafeStorage.registerTrimmer(() => {
    if (GameState.current) {
      GameState.trimJournal(GameState.current, 25);
      const s = GameState.current;
      if (Array.isArray(s.seenEventIds) && s.seenEventIds.length > 150) s.seenEventIds = s.seenEventIds.slice(-150);
    }
    if (window.Dynasty && Dynasty._cache && Array.isArray(Dynasty._cache.dynastyHistory) && Dynasty._cache.dynastyHistory.length > 15) {
      Dynasty._cache.dynastyHistory = Dynasty._cache.dynastyHistory.slice(0, 15);
      try { localStorage.setItem(Dynasty.STORAGE_KEY, JSON.stringify(Dynasty._cache)); } catch (e) {}
    }
  });
  SafeStorage.registerTrimmer(() => {
    if (GameState.current) GameState.trimJournal(GameState.current, 8);
    try { localStorage.setItem(GameState.HISTORY_KEY, '[]'); } catch (e) {}
  });
}
