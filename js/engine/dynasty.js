/* ==========================================================================
   WorldLife — Sistem Legasi Dinasti, Pencapaian Generasi Perdana,
   Sabotaj Legasi & Tetingkap Penebusan Rawak (Bahasa Melayu)
   ========================================================================== */

window.Dynasty = {
  STORAGE_KEY: 'worldlife_dynasty_v1',
  _cache: null,
  pendingPrimeAchievement: null,

  // --------------------------------------------------------------------------
  // 1. PENYIMPANAN KEKAL DINASTI (localStorage)
  // --------------------------------------------------------------------------
  _defaultData() {
    return {
      generation: 1,
      familyReputation: 50,
      legacyStatus: 'Intact', // 'Intact' | 'Tarnished' | 'Redeemed'
      tarnishReason: null,
      redemptionTimer: null, // 3–18 tahun apabila Tercemar (kekal merentas generasi!)
      lastSabotageAge: -99,
      dynastyHistory: [],
      primeAchievements: []
    };
  },

  getData() {
    if (this._cache) return this._cache;
    const parsed = window.SafeStorage
      ? SafeStorage.getJSON(this.STORAGE_KEY, null)
      : (() => { try { return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || 'null'); } catch (e) { return null; } })();
    this._cache = (parsed && typeof parsed === 'object')
      ? Object.assign(this._defaultData(), parsed)
      : this._defaultData();
    return this._cache;
  },

  save() {
    if (!this._cache) return false;
    if (window.SafeStorage) return SafeStorage.setJSON(this.STORAGE_KEY, this._cache, () => this._cache);
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._cache));
      return true;
    } catch (e) {
      return false;
    }
  },

  resetForFreshDynasty() {
    this._cache = this._defaultData();
    this.save();
    return this._cache;
  },

  getStatusBadge(status) {
    if (status === 'Tarnished') return { label: 'Tercemar', icon: '💔', cls: 'tarnished', color: '#dc2626' };
    if (status === 'Redeemed') return { label: 'Dipulihkan', icon: '🌟', cls: 'redeemed', color: '#7c3aed' };
    return { label: 'Utuh', icon: '🛡️', cls: 'intact', color: '#16a34a' };
  },

  adjustReputation(delta) {
    const d = this.getData();
    let eff = delta;
    const bonuses = this.getBloodlineBonuses();
    if (eff > 0) {
      if (bonuses.repGainMult) eff = Math.round(eff * (1 + bonuses.repGainMult));
      if (d.legacyStatus === 'Tarnished') eff = Math.max(1, Math.round(eff * 0.55));
    }
    d.familyReputation = Utils.clamp((d.familyReputation || 50) + eff, 0, 100);
    this.save();
    return d.familyReputation;
  },

  // --------------------------------------------------------------------------
  // 2. SEMAKAN NOMBOR PERDANA & PENCAPAIAN GENERASI PERDANA
  // --------------------------------------------------------------------------
  isPrime(n) {
    const num = Math.floor(Number(n));
    if (num < 2) return false;
    if (num === 2 || num === 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i += 6) {
      if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
  },

  PRIME_MILESTONES: {
    2: {
      title: 'Pewaris Sulung — Darah Perintis',
      icon: '🥈',
      bonusDesc: '+12% bonus harta permulaan pewaris setiap generasi baru'
    },
    3: {
      title: 'Tiga Serangkai — Dinasti Kukuh',
      icon: '🏛️',
      bonusDesc: '+8 Reputasi asas & +20% kadar kenaikan Reputasi Keluarga'
    },
    5: {
      title: 'Bintang Lima — Tuah Dinasti',
      icon: '⭐',
      bonusDesc: '+10% peluang kemunculan Peluang Nadir dalam Dek Aktiviti'
    },
    7: {
      title: 'Perisai Tujuh — Benteng Maruah',
      icon: '🛡️',
      bonusDesc: '+12% pertahanan kejayaan menentang Sabotaj Legasi'
    },
    11: {
      title: 'Kesebelas Kebal — Peguam Elit',
      icon: '⚖️',
      bonusDesc: '-25% diskaun kos guaman & PR ketika krisis sabotaj'
    },
    13: {
      title: 'Tiga Belas Berani — Nadi Krisis',
      icon: '🔥',
      bonusDesc: '+12% kadar kejayaan dalam pilihan krisis & penebusan berisiko'
    }
  },

  getBloodlineBonuses() {
    const d = this.getData();
    const unlockedGens = (d.primeAchievements || []).map(a => a.gen);
    const higherPrimesCount = unlockedGens.filter(g => g >= 17).length;
    return {
      startingWealthMult: unlockedGens.includes(2) ? 0.12 : 0,
      repGainMult: unlockedGens.includes(3) ? 0.20 : 0,
      rareActivityBonus: unlockedGens.includes(5) ? 0.10 : 0,
      sabotageDefenseBonus: unlockedGens.includes(7) ? 0.12 : 0,
      legalCostDiscount: unlockedGens.includes(11) ? 0.25 : 0,
      riskyCrisisBonus: unlockedGens.includes(13) ? 0.12 : 0,
      higherStatBuff: higherPrimesCount * 2
    };
  },

  checkPrimeGeneration(gen, state) {
    const d = this.getData();
    d.generation = gen;
    if (!this.isPrime(gen)) {
      this.save();
      return null;
    }

    const already = d.primeAchievements.find(a => a.gen === gen);
    const preset = this.PRIME_MILESTONES[gen];
    const badge = preset
      ? { gen, title: preset.title, icon: preset.icon, bonusDesc: preset.bonusDesc, unlockedYear: state ? state.year : new Date().getFullYear() }
      : {
          gen,
          title: `Dinasti Perdana Generasi ${gen}`,
          icon: '👑',
          bonusDesc: `Bonus kekal +2 Kepintaran & +2 Penampilan untuk semua pewaris (Tindan!)`,
          unlockedYear: state ? state.year : new Date().getFullYear()
        };

    if (!already) {
      d.primeAchievements.push(badge);
      if (gen === 3) {
        d.familyReputation = Utils.clamp(d.familyReputation + 8, 0, 100);
      }
      this.pendingPrimeAchievement = badge;
      if (window.Utils && Utils.playTone) Utils.playTone('achievement');
    }

    // Terapkan buff stat kekal untuk perdana tinggi (17, 19, 23+)
    const bonuses = this.getBloodlineBonuses();
    if (state && bonuses.higherStatBuff > 0) {
      state.stats.smarts = Utils.clamp(state.stats.smarts + bonuses.higherStatBuff);
      state.stats.looks = Utils.clamp(state.stats.looks + bonuses.higherStatBuff);
    }

    if (state && !already) {
      GameState.addJournalEntry(
        `👑 PENCAPAIAN GENERASI PERDANA (GEN ${gen})! "${badge.title}" dibuka! Bonus Kekal: ${badge.bonusDesc}.`,
        'milestone'
      );
    }

    this.save();
    return badge;
  },

  recordMemberDeath(s) {
    const d = this.getData();
    const c = Utils.getCountry(s.countryId);
    const ending = window.KarmaEndings ? KarmaEndings.evaluateEnding(s) : { title: 'Jiwa Seimbang', icon: '✨' };
    const clip = (t, n = 140) => {
      const str = String(t || '');
      return str.length > n ? str.slice(0, n - 1) + '…' : str;
    };

    // 1–2 sorotan utama sahaja (bukan log penuh tahun demi tahun)
    const hl = Array.isArray(s.highlights) ? s.highlights.slice(-2).reverse().map(h => clip(h.text || h, 120)) : [];
    let topHighlight = hl.length > 0 ? hl[0] : (s.causeOfDeath || 'Menjalani kehidupan penuh warna');

    const posthumous = (window.CharacterStatus && CharacterStatus.evaluatePosthumousDegree)
      ? CharacterStatus.evaluatePosthumousDegree(s)
      : null;

    const alias = (s.fugitive && s.fugitive.aliasName) ? s.fugitive.aliasName : null;
    const trueName = (s.fugitive && s.fugitive.trueName) ? s.fugitive.trueName : s.name;
    const titledName = window.CharacterStatus ? CharacterStatus.getDisplayNameWithTitles(s) : s.name;
    const finalOcc = window.CharacterStatus ? CharacterStatus.getDisplayOccupation(s) : { title: 'Tiada Pekerjaan' };
    const peakRole = s.peakRole || finalOcc.title;
    if (posthumous) {
      topHighlight = `${posthumous.icon} ${posthumous.legacyNote}`;
    } else if (alias) {
      topHighlight = `Hidup dalam buangan dengan nama samaran ${alias} (Nama asal: ${trueName}) • ${topHighlight}`;
    } else if (peakRole && peakRole !== 'Tiada Pekerjaan') {
      topHighlight = `Peranan Utama: ${peakRole} • ${topHighlight}`;
    }

    const netWorth = GameState.getNetWorth();
    const peakNetWorth = Math.max(netWorth, s.peakNetWorth || 0);

    // Elak duplikat untuk watak yang sama
    if (!d.dynastyHistory.some(h => h.id === s.id)) {
      d.dynastyHistory.unshift({
        id: s.id,
        generation: s.generation || d.generation || 1,
        name: alias ? `${trueName} (a.k.a. ${alias})` : titledName,
        alias,
        peakRole,
        age: s.age,
        lifespan: s.age,
        yearDied: s.year,
        countryFlag: c.flag,
        peakNetWorth,
        peakWealthFormatted: Utils.formatMoney(peakNetWorth, s.countryId, true),
        endingTitle: `${ending.icon} ${ending.title}`,
        notableEvent: clip(topHighlight, 200),
        highlights: hl,
        legacyStatusAtDeath: d.legacyStatus
      });
      if (d.dynastyHistory.length > this.MAX_HISTORY) d.dynastyHistory = d.dynastyHistory.slice(0, this.MAX_HISTORY);
    }
    this.save();
    return d.dynastyHistory[0];
  },

  // Had rekod ringkas salasilah (cukup untuk 50+ generasi tanpa membebankan storan)
  MAX_HISTORY: 60,

  // --------------------------------------------------------------------------
  // 3. 8 SENARIO SABOTAJ LEGASI (Gen >= 2 atau Reputasi >= 60, 15%/tahun)
  // --------------------------------------------------------------------------
  SABOTAGE_SCENARIOS: [
    {
      id: 'sab_viral_slander',
      icon: '📱',
      title: 'Sabotaj Legasi: Kempen Fitnah Viral!',
      reason: 'Fitnah tular media sosial yang memburukkan nama baik keluarga',
      text: 'Akaun palsu berbayar melancarkan kempen fitnah tular yang mendakwa kekayaan dan reputasi keluarga anda dibina atas penipuan! Ribuan netizen mula menyerang nama keluarga anda.'
    },
    {
      id: 'sab_business_boycott',
      icon: '📉',
      title: 'Sabotaj Legasi: Boikot & Sabotaj Perniagaan!',
      reason: 'Sabotaj pesaing korporat & kempen boikot terancang',
      text: 'Pesaing lama yang cemburu dengan kejayaan dinasti anda menyebarkan laporan palsu kepada rakan niaga dan pengguna sehingga mencetuskan kempen boikot besar-besaran!'
    },
    {
      id: 'sab_framed_scandal',
      icon: '🕵️',
      title: 'Sabotaj Legasi: Skandal Palsu & Bukti Terubah Suai!',
      reason: 'Diperangkap dalam skandal dokumen palsu oleh musuh keluarga',
      text: 'Musuh dalam selimut membocorkan dokumen kontrak yang telah dipalsukan dengan nama keluarga anda kepada akhbar utama — media kini mengepung rumah anda!'
    },
    {
      id: 'sab_blackmail',
      icon: '✉️',
      title: 'Sabotaj Legasi: Ugutan Peras Ugut Misteri!',
      reason: 'Enggan tunduk kepada ugutan lalu aib keluarga disebarkan',
      text: 'Seorang pemeras ugut menghantar fail rahsia lama milik keluarga anda dan menuntut wang tutup mulut besar — jika gagal, semuanya akan didedahkan kepada umum esok!'
    },
    {
      id: 'sab_jealous_relative',
      icon: '🐍',
      title: 'Sabotaj Legasi: Saudara Iri Hati Membocor Rahsia!',
      reason: 'Pengkhianatan saudara sendiri yang menjual rahsia keluarga kepada tabloid',
      text: 'Seorang saudara jauh yang iri hati dengan harta dan nama baik keluarga anda tampil dalam wawancara televisyen memburuk-burukkan salasilah keluarga anda!'
    },
    {
      id: 'sab_political_smear',
      icon: '🏛️',
      title: 'Sabotaj Legasi: Kempen Fitnah Politik & Tabloid!',
      reason: 'Serangan propaganda politik yang mencemarkan maruah dinasti',
      text: 'Kumpulan berkepentingan melancarkan serangan propaganda dan papan iklan sindiran bagi menjatuhkan pengaruh keluarga anda di mata masyarakat!'
    },
    {
      id: 'sab_former_partner',
      icon: '💼',
      title: 'Sabotaj Legasi: Khianat Bekas Rakan Kongsi!',
      reason: 'Tuduhan pecah amanah oleh bekas rakan kongsi yang berdendam',
      text: 'Bekas rakan kongsi yang pernah ditolak oleh keluarga anda memfailkan saman gempar di khalayak media bagi memalukan seluruh dinasti anda!'
    },
    {
      id: 'sab_tax_smear',
      icon: '⚖️',
      title: 'Sabotaj Legasi: Tuduhan Lari Cukai Di Media!',
      reason: 'Aduan palsu pengelakan cukai yang mencetuskan kecaman awam',
      text: 'Satu aduan tanpa nama mendakwa keluarga anda menyembunyikan aset di luar negara — tajuk utama berita hari ini terus menghukum sebelum siasatan selesai!'
    }
  ],

  // --------------------------------------------------------------------------
  // 4. 5 SENARIO PELUANG PENEBUSAN LEGASI (Apabila redemptionTimer === 0)
  // --------------------------------------------------------------------------
  REDEMPTION_SCENARIOS: [
    {
      id: 'red_whistleblower',
      icon: '🎙️',
      title: 'Peluang Penebusan: Pembocor Maklumat Mahu Mengaku!',
      text: 'Salah seorang dalang yang pernah mensabotaj nama keluarga anda kini dilanda rasa bersalah dan sanggup tampil membuat pengakuan bersumpah — tetapi memerlukan perlindungan guaman segera!'
    },
    {
      id: 'red_heroic_crisis',
      icon: '🚒',
      title: 'Peluang Penebusan: Detik Wira Di Krisis Awam!',
      text: 'Bencana banjir & kecemasan melanda bandar anda! Seluruh media sedang membuat liputan — inilah peluang bersejarah untuk keluarga anda memimpin bantuan dan memulihkan maruah dinasti!'
    },
    {
      id: 'red_proof_innocence',
      icon: '📂',
      title: 'Peluang Penebusan: Penemuan Bukti Forensik Tidak Bersalah!',
      text: 'Arkib digital lama akhirnya mendedahkan bukti forensik kukuh yang membuktikan keluarga anda difitnah bertahun-tahun lalu! Anda perlu mengemukakannya di sidang media nasional.'
    },
    {
      id: 'red_legacy_comeback',
      icon: '🏆',
      title: 'Peluang Penebusan: Kebangkitan Besar & Projek Legasi!',
      text: 'Sebuah badan kebangsaan mempelawa keluarga anda menaja dan memimpin projek pendidikan serta kebajikan rakyat yang bakal menjadi tumpuan seluruh negara!'
    },
    {
      id: 'red_independent_audit',
      icon: '⚖️',
      title: 'Peluang Penebusan: Siasatan Bebas Membongkar Dalang!',
      text: 'Wartawan penyiasat bebas menghubungi anda — mereka hampir membongkar sindiket fitnah yang mencemarkan nama keluarga anda dan memerlukan kerjasama penuh anda.'
    }
  ],

  // --------------------------------------------------------------------------
  // 5. PROSES TAHUNAN: KURANGKAN TIMER PENEBUSAN & CETUS SABOTAJ / PENEBUSAN
  // --------------------------------------------------------------------------
  tickYear(s) {
    const d = this.getData();
    d.generation = Math.max(d.generation || 1, s.generation || 1);

    if (d.legacyStatus === 'Tarnished') {
      if (typeof d.redemptionTimer !== 'number' || d.redemptionTimer === null) {
        d.redemptionTimer = Utils.randInt(3, 18);
      } else if (d.redemptionTimer > 0) {
        d.redemptionTimer -= 1;
      }

      // Kesan sosial semasa Tercemar: sekali-sekala komen sinis masyarakat
      if (s.age >= 16 && Utils.chance(0.20)) {
        GameState.addJournalEntry(
          `💬 Maruah Tercemar: Anda mendengar bisikan sinis orang sekeliling mengenai skandal lama keluarga (${d.tarnishReason || 'nama keluarga tercalar'}). Peluang elit terasa lebih sukar.`,
          'warning'
        );
        GameState.adjustStats({ happiness: -4 });
      }
    }
    this.save();
  },

  pickLegacyEvent(s, c) {
    if (!s || s.age < 16 || (s.prison && s.prison.inPrison)) return null;
    const d = this.getData();

    // A. Tetingkap Penebusan Tiba (redemptionTimer === 0)
    if (d.legacyStatus === 'Tarnished' && typeof d.redemptionTimer === 'number' && d.redemptionTimer <= 0) {
      return this._buildRedemptionEvent(s, c);
    }

    // B. Sabotaj Legasi (Gen >= 2 ATAU Reputasi >= 60, kebarangkalian 15% setahun, cooldown 4 tahun)
    const eligibleSabotage = (d.generation >= 2 || d.familyReputation >= 60) && d.legacyStatus !== 'Tarnished';
    const cooldownOk = (s.age - (d.lastSabotageAge ?? -99)) >= 4;
    if (eligibleSabotage && cooldownOk && Utils.chance(0.16)) {
      d.lastSabotageAge = s.age;
      this.save();
      return this._buildSabotageEvent(s, c);
    }

    return null;
  },

  _tarnishLegacy(reason, repDrop = 28) {
    const d = this.getData();
    d.legacyStatus = 'Tarnished';
    d.tarnishReason = reason;
    d.familyReputation = Utils.clamp((d.familyReputation || 50) - repDrop, 5, 100);
    d.redemptionTimer = Utils.randInt(3, 18); // Tetingkap rawak tersembunyi 3–18 tahun (kekal merentas generasi!)
    this.save();
  },

  _buildSabotageEvent(s, c) {
    const scen = Utils.pick(this.SABOTAGE_SCENARIOS);
    const d = this.getData();
    const bonuses = this.getBloodlineBonuses();
    const traits = s.traits || [];

    const basePrUsd = 4200;
    const prCost = Utils.usdToLocal(Math.round(basePrUsd * (1 - (bonuses.legalCostDiscount || 0))), s.countryId);

    const resolveDefense = (st, winProb, costLocal, methodLabel) => {
      if (costLocal > 0) st.money -= costLocal;
      if (Utils.chance(winProb)) {
        const repGain = Utils.randInt(9, 15);
        this.adjustReputation(repGain);
        GameState.adjustStats({ happiness: 14 });
        if (window.KarmaEndings) {
          KarmaEndings.adjustAlignment({ fame: 8, stress: -6, karma: 6 });
          KarmaEndings.addHighlight('🛡️', `Berjaya mematahkan ${scen.title}`);
        }
        return {
          outcome: `BERJAYA! Melalui ${methodLabel}, anda mematahkan cubaan sabotaj itu dan membuktikan kebenaran! Reputasi Keluarga melonjak +${repGain}% (kini ${d.familyReputation}%).`,
          toastType: 'success'
        };
      } else {
        this._tarnishLegacy(scen.reason, Utils.randInt(24, 34));
        GameState.adjustStats({ happiness: -16 });
        if (window.KarmaEndings) {
          KarmaEndings.adjustAlignment({ stress: 18, fame: -8 });
          KarmaEndings.addHighlight('💔', `Gagal mematahkan sabotaj — legasi keluarga tercemar`);
        }
        return {
          outcome: `GAGAL! Meskipun telah berusaha melalui ${methodLabel}, gelombang kecaman terlalu kuat. Status Legasi kini TERCEMAR dan Reputasi Keluarga jatuh ke ${d.familyReputation}%!`,
          toastType: 'error'
        };
      }
    };

    const lawyerProb = Math.min(0.90, 0.58 + (s.stats.smarts / 320) + (bonuses.sabotageDefenseBonus || 0) + (traits.includes('ambitious') ? 0.06 : 0));
    const karmaProb = Math.min(0.88, 0.32 + (Math.max(0, s.alignment.karma) / 180) + (d.familyReputation / 280) + (bonuses.sabotageDefenseBonus || 0) + (traits.includes('charismatic') || traits.includes('devout') ? 0.09 : 0));
    const riskyProb = Math.min(0.84, 0.38 + (s.stats.smarts / 260) + (bonuses.riskyCrisisBonus || 0) + (traits.includes('risk_taker') || traits.includes('cunning') ? 0.12 : 0));

    return {
      id: 'dynasty_sabotage_' + scen.id + '_' + s.age,
      icon: scen.icon,
      title: scen.title,
      text: `${scen.text} (Reputasi Keluarga semasa: ${d.familyReputation}%${bonuses.sabotageDefenseBonus ? ' • Bonus Perisai Tujuh Aktif!' : ''})`,
      choices: [
        {
          label: `⚖️ Pertahankan: Upah Peguam Elit & Pasukan PR (${Utils.formatMoney(prCost, s.countryId)})`,
          hint: `Peluang menang ~${Math.round(lawyerProb * 100)}%${bonuses.legalCostDiscount ? ' (Diskaun Gen 11 -25%!)' : ''}`,
          journalType: 'dilemma',
          customAction: (st) => {
            if (st.money < prCost) {
              return resolveDefense(st, Math.max(0.25, lawyerProb - 0.30), 0, 'pembelaan bajet terhad (wang tidak cukup)');
            }
            return resolveDefense(st, lawyerProb, prCost, 'Peguam Elit & Pasukan PR');
          }
        },
        {
          label: '🕊️ Pertahankan: Jawab Telus Guna Reputasi & Karma Tinggi',
          hint: `Percuma • Peluang menang ~${Math.round(karmaProb * 100)}% (bergantung Karma & Reputasi)`,
          journalType: 'spiritual',
          customAction: (st) => resolveDefense(st, karmaProb, 0, 'penjelasan telus & rekod integriti')
        },
        {
          label: '🔥 Pertahankan: Konfrontasi Terus Berisiko Terhadap Dalang',
          hint: `Percuma • Peluang menang ~${Math.round(riskyProb * 100)}% (risiko tinggi, ganjaran besar)`,
          journalType: 'dilemma',
          customAction: (st) => resolveDefense(st, riskyProb, 0, 'konfrontasi terus membongkar dalang')
        },
        {
          label: '😔 Berdiam Diri & Biarkan Legasi Tercemar',
          hint: 'Tiada kos segera, tetapi Legasi jadi TERCEMAR & Reputasi jatuh teruk',
          journalType: 'warning',
          customAction: () => {
            this._tarnishLegacy(scen.reason, Utils.randInt(26, 35));
            GameState.adjustStats({ happiness: -12 });
            if (window.KarmaEndings) {
              KarmaEndings.adjustAlignment({ stress: 10 });
              KarmaEndings.addHighlight('💔', `Legasi keluarga tercemar: ${scen.reason}`);
            }
            return {
              outcome: `Anda memilih untuk tidak melawan demi mengelak kos dan pergaduhan. Nama keluarga kini berstatus TERCEMAR (Reputasi: ${d.familyReputation}%). Hanya masa yang menentukan bila peluang penebusan akan muncul...`,
              toastType: 'error'
            };
          }
        }
      ]
    };
  },

  _buildRedemptionEvent(s, c) {
    const scen = Utils.pick(this.REDEMPTION_SCENARIOS);
    const d = this.getData();
    const bonuses = this.getBloodlineBonuses();
    const traits = s.traits || [];
    const investCost = Utils.usdToLocal(Math.round(2800 * (1 - (bonuses.legalCostDiscount || 0))), s.countryId);

    const resolveRedeem = (st, prob, costLocal, label) => {
      if (costLocal > 0) st.money -= costLocal;
      if (Utils.chance(prob)) {
        d.legacyStatus = 'Redeemed';
        d.redemptionTimer = null;
        const oldReason = d.tarnishReason;
        d.tarnishReason = null;
        d.familyReputation = Utils.clamp(Math.max(68, d.familyReputation + Utils.randInt(32, 46)), 0, 100);
        d.dynastyHistory.unshift({
          id: 'redeem_' + Date.now(),
          generation: d.generation,
          name: st.name,
          age: st.age,
          yearDied: st.year,
          countryFlag: '🌟',
          peakWealthFormatted: Utils.formatMoney(GameState.getNetWorth(), st.countryId, true),
          endingTitle: '🌟 Kebangkitan & Penebusan Legasi',
          notableEvent: `Membersihkan nama keluarga daripada: ${oldReason || 'skandal lalu'} melalui ${label}`,
          legacyStatusAtDeath: 'Redeemed'
        });
        this.save();
        GameState.adjustStats({ happiness: 24 });
        if (window.KarmaEndings) {
          KarmaEndings.adjustAlignment({ karma: 22, fame: 16, stress: -18 });
          KarmaEndings.addHighlight('🌟', `Berjaya memulihkan maruah dinasti (${scen.title})`);
        }
        return {
          outcome: `KEBANGKITAN BERSEJARAH! Melalui ${label}, nama baik keluarga anda dibersihkan sepenuhnya! Status Legasi kini DIPULIHKAN dan Reputasi Keluarga melonjak ke ${d.familyReputation}%!`,
          toastType: 'success'
        };
      } else {
        d.redemptionTimer = Utils.randInt(4, 15);
        this.save();
        GameState.adjustStats({ happiness: -10 });
        if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: 10 });
        return {
          outcome: `Sayang sekali — usaha melalui ${label} masih belum cukup meyakinkan orang ramai. Nama keluarga kekal Tercemar buat sementara; peluang baharu mungkin muncul bertahun-tahun lagi.`,
          toastType: 'error'
        };
      }
    };

    const fundedProb = Math.min(0.92, 0.68 + (bonuses.riskyCrisisBonus || 0) + (s.stats.smarts / 350));
    const gritProb = Math.min(0.86, 0.48 + (Math.max(0, s.alignment.karma) / 220) + (bonuses.riskyCrisisBonus || 0) + (traits.includes('charismatic') || traits.includes('empathetic') || traits.includes('risk_taker') ? 0.10 : 0));

    return {
      id: 'dynasty_redemption_' + scen.id + '_' + s.age,
      icon: scen.icon,
      title: scen.title,
      text: `${scen.text} (Peluang keemasan untuk memulihkan status Legasi daripada TERCEMAR kepada DIPULIHKAN!)`,
      choices: [
        {
          label: `💎 Sambar Peluang Dengan Sokongan Dana & Pakar (${Utils.formatMoney(investCost, s.countryId)})`,
          hint: `Peluang berjaya tinggi (~${Math.round(fundedProb * 100)}%)`,
          journalType: 'milestone',
          customAction: (st) => {
            if (st.money < investCost) {
              return resolveRedeem(st, gritProb, 0, 'usaha gigih tanpa dana besar');
            }
            return resolveRedeem(st, fundedProb, investCost, 'kempen bukti & sokongan pakar');
          }
        },
        {
          label: '🔥 Tampil Sendiri Dengan Keberanian & Kejujuran',
          hint: `Percuma • Peluang berjaya ~${Math.round(gritProb * 100)}%`,
          journalType: 'spiritual',
          customAction: (st) => resolveRedeem(st, gritProb, 0, 'keberanian dan kejujuran peribadi')
        },
        {
          label: '🌫️ Tangguhkan — Belum Bersedia Menghadapi Umum',
          hint: 'Legasi kekal Tercemar; peluang baru muncul 4–15 tahun lagi',
          journalType: 'normal',
          customAction: () => {
            d.redemptionTimer = Utils.randInt(4, 15);
            this.save();
            return {
              outcome: 'Anda membiarkan peluang itu berlalu buat masa ini. Semoga generasi ini atau pewaris akan datang mendapat detik penebusan seterusnya.'
            };
          }
        }
      ]
    };
  }
};
