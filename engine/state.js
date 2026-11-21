/* ==========================================================================
   WorldLife — Pengurusan Keadaan, Simpanan & Reben Legasi (Bahasa Melayu)
   ========================================================================== */

window.GameState = {
  SAVE_KEY: 'worldlife_current_save_v1',
  HISTORY_KEY: 'worldlife_graveyard_v1',
  current: null,

  createNewLife({ countryId, gender, heritageId, customName }) {
    const country = Utils.getCountry(countryId);
    const validHeritage = heritageId && country.names[heritageId]
      ? heritageId
      : country.heritages[0].id;
    const heritageObj = country.heritages.find(h => h.id === validHeritage) || country.heritages[0];
    const city = Utils.pick(country.cities);
    const name = (customName && customName.trim())
      ? customName.trim()
      : Utils.generateName(countryId, gender, validHeritage);

    const startYear = 2004 + Utils.randInt(0, 20);

    const fatherName = Utils.generateName(countryId, 'male', validHeritage);
    const motherName = Utils.generateName(countryId, 'female', validHeritage);
    const fatherJob = Utils.pick(country.jobs).title;
    const motherJob = Utils.pick(country.jobs).title;

    const relationships = [
      {
        id: 'rel_mom',
        name: motherName,
        role: 'Ibu',
        gender: 'female',
        age: Utils.randInt(25, 36),
        countryId,
        closeness: Utils.randInt(75, 95),
        alive: true,
        job: motherJob
      },
      {
        id: 'rel_dad',
        name: fatherName,
        role: 'Ayah',
        gender: 'male',
        age: Utils.randInt(26, 39),
        countryId,
        closeness: Utils.randInt(72, 94),
        alive: true,
        job: fatherJob
      }
    ];

    if (Utils.chance(0.55)) {
      const sibGender = Utils.chance(0.5) ? 'male' : 'female';
      relationships.push({
        id: 'rel_sib_1',
        name: Utils.generateName(countryId, sibGender, validHeritage),
        role: sibGender === 'male' ? 'Abang' : 'Kakak',
        gender: sibGender,
        age: Utils.randInt(2, 6),
        countryId,
        closeness: Utils.randInt(65, 90),
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
      age: 0,
      year: startYear,
      alive: true,
      causeOfDeath: null,

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
              text: `Membesar sebagai ${heritageObj.label} di ${country.name}: ${country.tagline}`
            }
          ]
        }
      ]
    };

    this.current = state;
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
    this.save();
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

  adjustStats(effects = {}) {
    const s = this.current;
    if (!s) return;
    if (effects.happiness) s.stats.happiness = Utils.clamp(s.stats.happiness + effects.happiness);
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
      age: childAge,
      year: parent.year,
      alive: true,
      causeOfDeath: null,

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
    this.save();
    return state;
  },

  computeRibbon(s) {
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
    return { name: 'Jiwa Seimbang', icon: '✨', desc: 'Melalui perjalanan hidup yang bermakna dengan budaya, pilihan dan pengalaman.' };
  },

  archiveCurrentLife() {
    const s = this.current;
    if (!s) return;
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
    try {
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
    } catch (e) {}
  },

  getHistory() {
    try {
      const raw = localStorage.getItem(this.HISTORY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  save() {
    if (!this.current) return;
    try {
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(this.current));
    } catch (e) {}
  },

  load() {
    try {
      const raw = localStorage.getItem(this.SAVE_KEY);
      if (raw) {
        this.current = JSON.parse(raw);
        return this.current;
      }
    } catch (e) {}
    return null;
  },

  clearSave() {
    this.current = null;
    try {
      localStorage.removeItem(this.SAVE_KEY);
    } catch (e) {}
  }
};
