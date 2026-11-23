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

    const fatherName = Utils.generateName(countryId, 'male', validHeritage);
    const motherName = Utils.generateName(countryId, 'female', validHeritage);

    const name = Utils.generateChildName({
      countryId,
      gender,
      heritageId: validHeritage,
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
        alive: true,
        job: fatherJob
      }
    ];

    if (Utils.chance(0.55)) {
      const sibGender = Utils.chance(0.5) ? 'male' : 'female';
      const sibName = Utils.generateChildName({
        countryId,
        gender: sibGender,
        heritageId: validHeritage
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
      maritalStatus: null,

      // Kesuburan, menopaus & kehamilan (untuk watak wanita)
      fertility: gender === 'female' ? Utils.randInt(58, 96) : null,
      isInfertile: gender === 'female' ? Utils.chance(0.065) : false,
      menopauseAge: gender === 'female' ? Utils.randInt(45, 52) : null,
      wantsChildren: Utils.chance(0.85),
      pregnancy: null,
      conceptionAttempts: 0,
      infertilityDiagnosed: false,

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
              text: `Membesar sebagai ${heritageObj.label} di ${country.name}: ${country.tagline}`
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
    if (window.SpecialModesEngine && SpecialModesEngine.maybeGrantBirthRoyalty) {
      SpecialModesEngine.maybeGrantBirthRoyalty(state);
    }
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

  ensureUpgradedState() {
    const s = this.current;
    if (!s) return;
    // Keserasian simpanan lama: medan legasi yang tidak digunakan diabaikan dengan selamat
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

    if (s.gender === 'female') {
      if (typeof s.fertility !== 'number') s.fertility = Utils.randInt(58, 96);
      if (typeof s.isInfertile !== 'boolean') s.isInfertile = Utils.chance(0.065);
      if (typeof s.menopauseAge !== 'number') s.menopauseAge = Utils.randInt(45, 52);
    }
    if (typeof s.wantsChildren !== 'boolean') s.wantsChildren = true;
    if (!('pregnancy' in s)) s.pregnancy = null;
    if (typeof s.conceptionAttempts !== 'number') s.conceptionAttempts = 0;
    if (typeof s.infertilityDiagnosed !== 'boolean') s.infertilityDiagnosed = false;
    if (!('maritalStatus' in s)) s.maritalStatus = null;

    if (window.LegalInheritanceEngine && LegalInheritanceEngine.ensureLegalFields) {
      LegalInheritanceEngine.ensureLegalFields(s);
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
    if (window.SpecialModesEngine && SpecialModesEngine.ensureFields) {
      SpecialModesEngine.ensureFields(s);
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
    const ceoEquity = (window.SpecialModesEngine && SpecialModesEngine.getCeoEquityLocal)
      ? SpecialModesEngine.getCeoEquityLocal(s)
      : 0;
    if (window.AssetsEngine && AssetsEngine.getAssetCashflowSummary) {
      const aSum = AssetsEngine.getAssetCashflowSummary(s);
      return Math.round((s.money || 0) + (s.retirementFund || 0) + aSum.totalAssetValue + ceoEquity - aSum.totalDebt);
    }
    let total = s.money + (s.investments || 0) + s.retirementFund + ceoEquity;
    for (const v of s.assets.vehicles) total += v.value;
    for (const p of s.assets.properties) total += p.value;
    return Math.round(total);
  },

  continueAsChild(childId, estateReport = null) {
    const parent = this.current;
    if (!parent) return null;
    const child = parent.relationships.find(r => r.id === childId && r.alive);
    if (!child) return null;

    const cId = child.countryId || parent.countryId;
    const country = Utils.getCountry(cId);
    const parentC = Utils.getCountry(parent.countryId);
    const city = cId === parent.countryId ? parent.city : Utils.pick(country.cities);

    const report = estateReport || (window.LegalInheritanceEngine
      ? LegalInheritanceEngine.calculateEstateStatement(parent)
      : null);
    const livingKids = parent.relationships.filter(r => (r.role === 'Anak Lelaki' || r.role === 'Anak Perempuan' || r.role === 'Son' || r.role === 'Daughter') && r.alive);
    const exactParentShare = report
      ? report.getHeirAmount(child.id)
      : Math.round(Math.max(0, this.getNetWorth()) / Math.max(1, livingKids.length));
    const shareLocal = Utils.convertMoney(exactParentShare, parent.countryId, cId);

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
        happiness: child.isDelinquent ? Utils.randInt(42, 64) : Utils.randInt(60, 82),
        health: (child.stats && typeof child.stats.health === 'number') ? Utils.clamp(child.stats.health, 25, 100) : Utils.randInt(78, 96),
        smarts: (child.stats && typeof child.stats.smarts === 'number') ? Utils.clamp(child.stats.smarts, 20, 100) : Utils.randInt(55, 88),
        looks: Utils.randInt(55, 88)
      },

      money: shareLocal,
      investments: 0,
      retirementFund: 0,
      annualExpensesMultiplier: 1,
      criminalRecord: child.isDelinquent ? 1 : 0,
      hasDriverLicense: childAge >= 18,
      generation: (parent.generation || 1) + 1,

      alignment: {
        karma: child.isDelinquent ? -30 : ((typeof child.morals === 'number' && child.morals >= 75) ? 20 : 0),
        fame: 0,
        peakFame: 0,
        notoriety: child.isDelinquent ? 25 : 0,
        stress: child.isDelinquent ? 35 : 12
      },

      fertility: child.gender === 'female' ? Utils.randInt(58, 96) : null,
      isInfertile: child.gender === 'female' ? Utils.chance(0.065) : false,
      menopauseAge: child.gender === 'female' ? Utils.randInt(45, 52) : null,
      wantsChildren: Utils.chance(0.85),
      pregnancy: null,
      conceptionAttempts: 0,
      infertilityDiagnosed: false,
      maritalStatus: null,

      education: this._buildChildHandoverEducation(child, city, country, parent),
      job: null,
      peakSalaryUsd: 0,

      assets: { vehicles: [], properties: [], collectibles: [] },
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
              text: report
                ? `📜 Penyata Harta Pusaka (${report.systemName || 'Undang-Undang Sivil & Wasiat'}): Anda mewarisi bahagian sebanyak ${Utils.formatMoney(shareLocal, cId)} daripada pusaka ${parent.name}.`
                : `💰 Anda mewarisi ${Utils.formatMoney(shareLocal, cId)} daripada harta pusaka ${parent.name}!`
            }
          ]
        }
      ]
    };

    this.current = state;
    this.ensureUpgradedState();

    // Pindahkan Pusaka Keluarga bertanda (Heirlooms) secara terus kepada pewaris terpilih
    const markedHeirlooms = ((parent.assets && parent.assets.collectibles) || []).filter(col => col && col.isHeirloom);
    if (markedHeirlooms.length > 0) {
      state.assets.collectibles = markedHeirlooms.map(col => ({
        ...col,
        ageInGenerations: (col.ageInGenerations || 1) + 1,
        value: Math.round(Utils.convertMoney(col.value, parent.countryId, cId) * 1.15)
      }));
      if (window.Dynasty) Dynasty.adjustReputation(Math.min(10, markedHeirlooms.length * 3));
      this.addJournalEntry(
        `🏛️ Anda turut mewarisi ${markedHeirlooms.length} Pusaka Keluarga bertanda (${markedHeirlooms.map(h => h.name).join(', ')})!`,
        'milestone'
      );
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
    this.syncActiveSlotToCloud('legacy');
    return state;
  },

  _buildChildHandoverEducation(child, city, country, parent) {
    const childAge = child.age || 0;
    const isDroppedOut = Boolean(child.droppedOut);
    const edStage = isDroppedOut
      ? (child.education === 'high_school' ? 'highschool_done' : 'dropped_out')
      : child.uniEnrolled && child.uniYearsLeft > 0
        ? 'university'
        : child.education === 'bachelor' || child.education === 'diploma'
          ? 'graduated'
          : childAge < 4 ? 'infant'
          : childAge <= 6 ? 'preschool'
          : childAge <= 12 ? 'primary'
          : childAge <= 17 ? 'secondary'
          : 'highschool_done';

    const schoolName = isDroppedOut
      ? null
      : (childAge >= 4 && childAge <= 17 && child.schoolLabel)
        ? `${child.schoolLabel} (${city})`
        : edStage === 'preschool' ? `${country.education.preschool.name} ${city}`
        : edStage === 'primary' ? `${city} ${country.education.primary.name}`
        : edStage === 'secondary' ? `${city} ${country.education.secondary.name}`
        : null;

    const cgpa = isDroppedOut
      ? null
      : typeof child.currentCgpa === 'number'
        ? Number(child.currentCgpa.toFixed(2))
        : (child.uniEnrolled ? 3.25 : null);

    const hasDeg = !isDroppedOut && (child.education === 'bachelor' || (childAge >= 23 && !child.uniEnrolled && child.education === 'bachelor'));
    const hasHs = isDroppedOut ? (child.education === 'high_school') : (childAge >= 18);
    const eduLevel = isDroppedOut
      ? (child.education === 'high_school' ? 'high_school' : 'none')
      : child.education === 'bachelor' ? 'bachelor'
      : child.education === 'diploma' ? 'diploma'
      : childAge >= 18 ? 'high_school'
      : 'none';

    const activeStudy = (!isDroppedOut && child.uniEnrolled && child.uniYearsLeft > 0)
      ? {
          level: child.majorId === 'trades_vocational' ? 'diploma' : 'bachelor',
          field: child.majorId || 'business_finance',
          fieldName: child.major || 'Perniagaan',
          mode: 'full_time',
          institution: child.university || (country.education.universities && country.education.universities[0]) || 'Universiti Awam (IPTA)',
          yearsTotal: child.uniYearsTotal || 3,
          yearsLeft: child.uniYearsLeft,
          annualFee: (child.uniSponsorMode === 'scholarship' || child.uniSponsorMode === 'parent' || child.uniSponsorMode === 'parent_cheaper') ? 0 : (child.yearlySchoolFee || 0),
          fundedByLoan: child.uniSponsorMode === 'loan',
          fundedByScholarship: child.uniSponsorMode === 'scholarship' || child.uniSponsorMode === 'parent' || child.uniSponsorMode === 'parent_cheaper',
          gpa: cgpa || 3.25,
          currentCgpa: cgpa || 3.25,
          studiedThisYear: true,
          academicWarningCount: 0
        }
      : null;

    const completedDegrees = [];
    if (!isDroppedOut && (child.education === 'bachelor' || child.education === 'diploma')) {
      completedDegrees.push({
        level: child.education,
        field: child.majorId || 'business_finance',
        institution: child.university || 'Universiti',
        year: (parent && parent.year) || 2026,
        gpa: cgpa || 3.40
      });
    }

    return {
      stage: edStage,
      isStudying: Boolean(activeStudy || ['preschool', 'primary', 'secondary'].includes(edStage)),
      droppedOut: isDroppedOut,
      educationLevel: eduLevel,
      educationField: child.majorId || (hasDeg ? 'business_finance' : null),
      schoolStage: child.schoolStage || edStage,
      schoolType: isDroppedOut ? 'none' : (child.schoolType || null),
      yearlySchoolFee: isDroppedOut ? 0 : (child.yearlySchoolFee || 0),
      schoolName,
      universityName: isDroppedOut ? null : (child.university || null),
      major: isDroppedOut ? null : (child.major || null),
      uniYearsLeft: isDroppedOut ? 0 : (child.uniYearsLeft || 0),
      hasHighSchool: hasHs,
      hasDegree: Boolean(hasDeg),
      examGrade: hasHs ? 'Lulus' : null,
      activeStudy,
      currentCgpa: cgpa,
      graduatedCgpa: (completedDegrees.length > 0 && cgpa) ? cgpa : null,
      completedDegrees,
      educationHistory: Array.isArray(child.educationHistory) ? [...child.educationHistory] : [],
      educationLoan: child.childStudentLoan || 0
    };
  },

  // Serah Legasi Semasa Hidup — tukar kawalan kepada anak hidup tanpa kematian pramatang
  switchToLivingChild(childId, giftCashLocal = 0) {
    const parent = this.current;
    if (!parent || !parent.alive) return null;
    const child = (parent.relationships || []).find(r =>
      r.id === childId && r.alive && ['Anak Lelaki', 'Anak Perempuan', 'Son', 'Daughter'].includes(r.role)
    );
    if (!child) return null;

    const cId = child.countryId || parent.countryId;
    const country = Utils.getCountry(cId);
    const parentC = Utils.getCountry(parent.countryId);
    const city = cId === parent.countryId ? parent.city : Utils.pick(country.cities);

    const maxGift = Math.max(0, Math.floor(parent.money || 0));
    const actualGiftParent = Math.max(0, Math.min(maxGift, Math.round(Number(giftCashLocal) || 0)));
    const remainingParentNetWorth = Math.max(0, this.getNetWorth() - actualGiftParent);
    const giftChildLocal = Utils.convertMoney(actualGiftParent, parent.countryId, cId);

    const livingKids = parent.relationships.filter(r =>
      ['Anak Lelaki', 'Anak Perempuan', 'Son', 'Daughter'].includes(r.role) && r.alive
    );

    const remappedRels = [];

    // 1. Pemain terdahulu kekal hidup sebagai NPC Bapa / Ibu dengan baki harta untuk pewarisan kelak
    remappedRels.push({
      id: 'rel_former_player_' + Date.now(),
      name: parent.name,
      role: parent.gender === 'male' ? 'Bapa' : 'Ibu',
      category: 'family',
      gender: parent.gender,
      age: parent.age,
      countryId: parent.countryId,
      closeness: Utils.clamp(child.closeness ?? 85, 20, 100),
      trust: Utils.clamp(child.trust ?? 85, 20, 100),
      compatibility: 90,
      alive: true,
      isAlive: true,
      job: (parent.job && parent.job.title) || 'Pesara / Ibu Bapa',
      stats: { health: (parent.stats && parent.stats.health) ?? 75, smarts: (parent.stats && parent.stats.smarts) ?? 70 },
      isFormerPlayerParent: true,
      savedEstateNetWorth: remainingParentNetWorth,
      savedCountryId: parent.countryId,
      savedHasSpouse: Boolean(parent.married && parent.partnerId),
      savedKidsCount: livingKids.length
    });

    // 2. Pasangan hidup pemain terdahulu -> Ibu / Bapa NPC
    const otherParent = (parent.married && parent.partnerId)
      ? parent.relationships.find(r => r.id === parent.partnerId && r.alive)
      : null;
    if (otherParent) {
      remappedRels.push({
        id: otherParent.id,
        name: otherParent.name,
        role: otherParent.gender === 'female' ? 'Ibu' : 'Bapa',
        category: 'family',
        gender: otherParent.gender,
        age: otherParent.age,
        countryId: otherParent.countryId || parent.countryId,
        closeness: Utils.randInt(75, 95),
        trust: Utils.randInt(75, 95),
        compatibility: 88,
        alive: true,
        isAlive: true,
        job: otherParent.job || 'Ibu Bapa'
      });
    }

    // 3. Anak-anak lain -> Adik-beradik NPC
    for (const k of livingKids) {
      if (k.id === child.id) continue;
      remappedRels.push({
        id: k.id,
        name: k.name,
        role: k.gender === 'male' ? 'Adik/Abang' : 'Adik/Kakak',
        category: 'family',
        gender: k.gender,
        age: k.age,
        countryId: k.countryId || cId,
        closeness: Utils.randInt(65, 92),
        trust: Utils.randInt(65, 90),
        compatibility: 82,
        alive: true,
        isAlive: true,
        job: k.age >= 22 ? Utils.pick(Utils.getCountry(k.countryId || cId).jobs).title : (k.age < 6 ? 'Kanak-kanak' : 'Pelajar')
      });
    }

    if (window.Dynasty && Dynasty.recordLivingHandover) {
      Dynasty.recordLivingHandover(parent, child);
    }

    const childAge = child.age;


    const state = {
      id: 'life_' + Date.now(),
      name: child.name,
      gender: child.gender,
      heritageId: country.heritages[0].id,
      heritageLabel: parent.heritageLabel,
      isAdopted: Boolean(child.isAdopted),
      isOutOfWedlock: Boolean(child.isOutOfWedlock),
      age: childAge,
      year: parent.year,
      alive: true,
      causeOfDeath: null,

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
        happiness: child.isDelinquent ? Utils.randInt(45, 65) : Utils.randInt(68, 88),
        health: (child.stats && typeof child.stats.health === 'number') ? Utils.clamp(child.stats.health, 25, 100) : Utils.randInt(78, 96),
        smarts: (child.stats && typeof child.stats.smarts === 'number') ? Utils.clamp(child.stats.smarts, 20, 100) : Utils.randInt(55, 88),
        looks: Utils.randInt(55, 88)
      },

      money: giftChildLocal,
      investments: 0,
      retirementFund: 0,
      annualExpensesMultiplier: 1,
      criminalRecord: child.isDelinquent ? 1 : 0,
      hasDriverLicense: childAge >= 18,
      generation: (parent.generation || 1) + 1,

      alignment: {
        karma: child.isDelinquent ? -30 : ((typeof child.morals === 'number' && child.morals >= 75) ? 20 : 0),
        fame: 0,
        peakFame: 0,
        notoriety: child.isDelinquent ? 25 : 0,
        stress: child.isDelinquent ? 30 : 10
      },

      fertility: child.gender === 'female' ? Utils.randInt(58, 96) : null,
      isInfertile: child.gender === 'female' ? Utils.chance(0.065) : false,
      menopauseAge: child.gender === 'female' ? Utils.randInt(45, 52) : null,
      wantsChildren: Utils.chance(0.85),
      pregnancy: null,
      conceptionAttempts: 0,
      infertilityDiagnosed: false,
      maritalStatus: null,

      education: this._buildChildHandoverEducation(child, city, country, parent),
      job: null,
      activeSpecialMode: null,
      peakSalaryUsd: 0,

      assets: { vehicles: [], properties: [], collectibles: [] },
      relationships: remappedRels,
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
              text: `🔄 Serah Legasi Generasi ${(parent.generation || 1) + 1}! Anda kini mengambil alih kawalan sebagai ${child.name} (Umur ${childAge}) di ${city}, ${country.name} ${country.flag}. ${parent.name} (${parentC.flag}) masih hidup sebagai ${parent.gender === 'male' ? 'Bapa' : 'Ibu'} anda.`
            },
            ...(giftChildLocal > 0 ? [{
              type: 'culture',
              text: `🎁 Anda menerima Hadiah Permulaan / Elaun sebanyak ${Utils.formatMoney(giftChildLocal, cId)} daripada ${parent.name}.`
            }] : [])
          ]
        }
      ]
    };

    this.current = state;
    this.ensureUpgradedState();
    if (window.Dynasty) {
      Dynasty.checkPrimeGeneration(state.generation, state);
    }
    if (window.ActivitiesDeck && ActivitiesDeck.generateYearlyDeck) {
      ActivitiesDeck.generateYearlyDeck(state);
    }
    this.save();
    this.syncActiveSlotToCloud('legacy');
    return state;
  },

  // Sambung Legasi Keluarga — gunakan anak hidup jika ada, atau pewaris waris terdekat jika tiada anak
  continueFamilyLegacy(childId = null, estateReport = null) {
    const parent = this.current;
    if (!parent) return null;
    if (window.Dynasty) Dynasty.recordMemberDeath(parent);

    if (childId) {
      return this.continueAsChild(childId, estateReport);
    }
    const livingKids = parent.relationships.filter(r => ['Anak Lelaki', 'Anak Perempuan', 'Son', 'Daughter'].includes(r.role) && r.alive);
    if (livingKids.length > 0) {
      return this.continueAsChild(livingKids[0].id, estateReport);
    }

    // Jika tiada anak hidup: lantik pewaris waris keluarga (anak saudara / waris terdekat) supaya dinasti tidak putus!
    const cId = parent.countryId;
    const country = Utils.getCountry(cId);
    const city = parent.city || Utils.pick(country.cities);
    const heirGender = Utils.chance(0.5) ? 'male' : 'female';
    const validHeritage = (parent.heritageId && country.names[parent.heritageId]) ? parent.heritageId : country.heritages[0].id;
    const fatherRef = parent.gender === 'male' ? parent.name : Utils.generateName(cId, 'male', validHeritage);
    const heirName = Utils.generateChildName({
      countryId: cId,
      gender: heirGender,
      heritageId: validHeritage,
      fatherFullName: fatherRef,
      isAdopted: false,
      isOutOfWedlock: false
    });

    const report = estateReport || (window.LegalInheritanceEngine
      ? LegalInheritanceEngine.calculateEstateStatement(parent)
      : null);
    const nonEntityShares = report ? report.shares.filter(sh => !sh.isEntity) : [];
    const inheritedAmount = report
      ? (nonEntityShares.length > 0 ? nonEntityShares[0].amount : 0)
      : Math.max(0, this.getNetWorth());
    const netWorth = inheritedAmount;
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
    if ((s.alignment && s.alignment.karma >= 85 && (s.alignment.stress || 0) <= 25)) {
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

  SLOT_IDS: ['slot_1', 'slot_2', 'slot_3', 'slot_4', 'slot_5'],
  ACTIVE_SLOT_KEY: 'worldlife_active_slot_v1',
  SLOT_KEY_PREFIX: 'worldlife_save_',

  getActiveSlotId() {
    const raw = window.SafeStorage
      ? SafeStorage.getRaw(this.ACTIVE_SLOT_KEY)
      : (typeof localStorage !== 'undefined' ? localStorage.getItem(this.ACTIVE_SLOT_KEY) : null);
    return this.SLOT_IDS.includes(raw) ? raw : 'slot_1';
  },

  setActiveSlotId(slotId) {
    const valid = this.SLOT_IDS.includes(slotId) ? slotId : 'slot_1';
    try {
      if (window.localStorage) localStorage.setItem(this.ACTIVE_SLOT_KEY, valid);
    } catch (e) {}
    return valid;
  },

  _slotStorageKey(slotId) {
    return `${this.SLOT_KEY_PREFIX}${slotId}`;
  },

  buildSlotPayload(slotId, stateObj = null) {
    const s = stateObj || this.current;
    if (!s) return null;
    const c = (window.Utils && Utils.getCountry) ? Utils.getCountry(s.countryId) : { name: s.countryId || 'Dunia', flag: '🌍' };
    let careerLabel = 'Tiada Kerjaya';
    if (s.activeSpecialMode && window.SpecialModesEngine && SpecialModesEngine.getActiveInfo) {
      const sp = SpecialModesEngine.getActiveInfo(s);
      if (sp) careerLabel = `${sp.def.icon} ${sp.rank.title}`;
    } else if (s.job && s.job.title) {
      careerLabel = s.job.title;
    } else if (s.education && s.education.stage && s.education.stage !== 'none' && s.education.stage !== 'done') {
      careerLabel = 'Pelajar';
    }
    const prevCurrent = this.current;
    this.current = s;
    let netWorth = s.money || 0;
    try { netWorth = this.getNetWorth(); } catch (e) {}
    this.current = prevCurrent;

    return {
      slotId,
      updatedAt: Date.now(),
      characterName: s.name || 'Watak Tanpa Nama',
      age: s.age ?? 0,
      country: c.name,
      countryId: s.countryId,
      countryFlag: c.flag || '🌍',
      career: careerLabel,
      netWorth: Math.round(netWorth),
      netWorthFormatted: (window.Utils && Utils.formatMoney) ? Utils.formatMoney(netWorth, s.countryId, true) : String(Math.round(netWorth)),
      generation: s.generation || 1,
      alive: Boolean(s.alive),
      gameState: JSON.parse(JSON.stringify(s))
    };
  },

  _migrateLegacySaveIfNeeded() {
    if (this._legacyMigrated) return;
    this._legacyMigrated = true;
    const slot1 = this.getLocalSlot('slot_1');
    if (slot1) return;
    try {
      const legacy = window.SafeStorage
        ? SafeStorage.getJSON(this.SAVE_KEY, null)
        : JSON.parse(localStorage.getItem(this.SAVE_KEY) || 'null');
      if (legacy && typeof legacy === 'object' && legacy.name) {
        const payload = this.buildSlotPayload('slot_1', legacy);
        if (payload) {
          if (window.SafeStorage) SafeStorage.setJSON(this._slotStorageKey('slot_1'), payload);
          else localStorage.setItem(this._slotStorageKey('slot_1'), JSON.stringify(payload));
        }
      }
    } catch (e) {}
  },

  getLocalSlot(slotId) {
    if (!this.SLOT_IDS.includes(slotId)) return null;
    try {
      const key = this._slotStorageKey(slotId);
      const data = window.SafeStorage
        ? SafeStorage.getJSON(key, null)
        : JSON.parse(localStorage.getItem(key) || 'null');
      return (data && typeof data === 'object' && data.gameState) ? { ...data, slotId } : null;
    } catch (e) {
      return null;
    }
  },

  getLocalSlots() {
    this._migrateLegacySaveIfNeeded();
    const map = {};
    this.SLOT_IDS.forEach(id => {
      map[id] = this.getLocalSlot(id);
    });
    return map;
  },

  hasAnyLocalSlot() {
    const slots = this.getLocalSlots();
    return this.SLOT_IDS.some(id => Boolean(slots[id]));
  },

  saveLocalSlot(slotId, stateObj = null) {
    const s = stateObj || this.current;
    if (!s || !this.SLOT_IDS.includes(slotId)) return false;
    this.trimJournal(s);
    const payload = this.buildSlotPayload(slotId, s);
    if (!payload) return false;
    const key = this._slotStorageKey(slotId);
    if (window.SafeStorage) {
      return SafeStorage.setJSON(key, payload, () => this.buildSlotPayload(slotId, s));
    }
    try {
      localStorage.setItem(key, JSON.stringify(payload));
      return true;
    } catch (e) {
      return false;
    }
  },

  deleteLocalSlot(slotId) {
    if (!this.SLOT_IDS.includes(slotId)) return;
    const key = this._slotStorageKey(slotId);
    if (window.SafeStorage) SafeStorage.remove(key);
    else { try { localStorage.removeItem(key); } catch (e) {} }
    if (this.getActiveSlotId() === slotId) {
      this.current = null;
      if (window.SafeStorage) SafeStorage.remove(this.SAVE_KEY);
      else { try { localStorage.removeItem(this.SAVE_KEY); } catch (e) {} }
    }
  },

  loadSlotPayload(slotId, payload) {
    if (!payload || !payload.gameState) return null;
    this.setActiveSlotId(slotId);
    this.current = JSON.parse(JSON.stringify(payload.gameState));
    this.ensureUpgradedState();
    this.trimJournal(this.current);
    this.save();
    return this.current;
  },

  async syncSlotToCloud(slotId, payloadOverride = null) {
    if (!window.FirebaseService || !FirebaseService.isLoggedIn()) {
      return { ok: false, msg: 'Log masuk Google untuk menggunakan Cloud Save.' };
    }
    const payload = payloadOverride || this.getLocalSlot(slotId) || (this.getActiveSlotId() === slotId && this.current ? this.buildSlotPayload(slotId, this.current) : null);
    if (!payload) return { ok: false, msg: 'Tiada data untuk disegerakkan.' };
    return await FirebaseService.saveCloudSlot(slotId, payload);
  },

  async syncActiveSlotToCloud(reason = 'manual') {
    if (!this.current) return { ok: false, msg: 'Tiada watak aktif.' };
    const slotId = this.getActiveSlotId();
    this.saveLocalSlot(slotId, this.current);
    if (!window.FirebaseService || !FirebaseService.isLoggedIn()) {
      return { ok: false, offline: true, msg: 'Disimpan secara tempatan.' };
    }
    return await this.syncSlotToCloud(slotId, this.buildSlotPayload(slotId, this.current));
  },

  async getMergedSlots() {
    const localMap = this.getLocalSlots();
    const isCloud = Boolean(window.FirebaseService && FirebaseService.isLoggedIn());
    const cloudMap = isCloud ? await FirebaseService.listCloudSlots() : {};
    const merged = {};
    const localOnlyIds = [];

    this.SLOT_IDS.forEach(id => {
      const loc = localMap[id];
      const cld = cloudMap[id];
      if (cld && loc) {
        const useCloud = (cld.updatedAt || 0) >= (loc.updatedAt || 0);
        merged[id] = { ...(useCloud ? cld : loc), slotId: id, source: useCloud ? 'cloud' : 'local', inCloud: true };
      } else if (cld) {
        merged[id] = { ...cld, slotId: id, source: 'cloud', inCloud: true };
      } else if (loc) {
        merged[id] = { ...loc, slotId: id, source: 'local', inCloud: false };
        if (isCloud) localOnlyIds.push(id);
      } else {
        merged[id] = null;
      }
    });

    return { slots: merged, localOnlyIds, isCloud };
  },

  async uploadLocalSlotsToCloud() {
    if (!window.FirebaseService || !FirebaseService.isLoggedIn()) {
      return { ok: false, uploaded: 0, msg: 'Sila log masuk Google dahulu.' };
    }
    const { slots, localOnlyIds } = await this.getMergedSlots();
    let uploaded = 0;
    for (const id of localOnlyIds) {
      const item = slots[id];
      if (item && item.gameState) {
        const res = await FirebaseService.saveCloudSlot(id, item);
        if (res.ok) uploaded += 1;
      }
    }
    return {
      ok: uploaded > 0,
      uploaded,
      msg: uploaded > 0
        ? `${uploaded} slot simpanan tempatan berjaya dimuat naik ke Cloud!`
        : 'Tiada slot tempatan baru untuk dimuat naik.'
    };
  },

  async deleteSlot(slotId) {
    this.deleteLocalSlot(slotId);
    if (window.FirebaseService && FirebaseService.isLoggedIn()) {
      await FirebaseService.deleteCloudSlot(slotId);
    }
    return { ok: true, msg: `Slot ${slotId.replace('slot_', '')} telah dipadam.` };
  },

  save() {
    if (this._saveTimer && typeof clearTimeout === 'function') {
      clearTimeout(this._saveTimer);
      this._saveTimer = null;
    }
    if (!this.current) return false;
    this.trimJournal(this.current);
    const activeSlot = this.getActiveSlotId();
    const okSlot = this.saveLocalSlot(activeSlot, this.current);
    if (window.SafeStorage) {
      SafeStorage.setJSON(this.SAVE_KEY, this.current, () => this.current);
      return okSlot;
    }
    try {
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(this.current));
      return okSlot;
    } catch (e) {
      return okSlot;
    }
  },

  load() {
    this._migrateLegacySaveIfNeeded();
    const activeSlot = this.getActiveSlotId();
    const slotData = this.getLocalSlot(activeSlot);
    if (slotData && slotData.gameState) {
      this.current = slotData.gameState;
      this.ensureUpgradedState();
      this.trimJournal(this.current);
      return this.current;
    }
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
    const activeSlot = this.getActiveSlotId();
    this.deleteLocalSlot(activeSlot);
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
