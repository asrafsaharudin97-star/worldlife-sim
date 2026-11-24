/* ==========================================================================
   WorldLife — Laman Sosial, Kerjaya Viral & Aplikasi Sesi Date
   Bahasa Melayu
   ========================================================================== */

window.SocialMedia = {
  PLATFORMS: [
    { id: 'vibetok', name: 'VibeTok', icon: '🎵', type: 'Video Pendek', viralBoost: 1.35, desc: 'Peluang tular semalaman paling tinggi!' },
    { id: 'streamlive', name: 'StreamLive', icon: '🎮', type: 'Penstriman Langsung', viralBoost: 1.0, desc: 'Sumbangan penonton & komuniti tegar.' },
    { id: 'instax', name: 'InstaX', icon: '📸', type: 'Foto & Mikroblog', viralBoost: 1.15, desc: 'Tajaan jenama mewah & drama netizen pantas.' }
  ],

  STRATEGIES: [
    { id: 'wholesome', name: 'Positif & Inspirasi', icon: '🌟', karma: 6, stress: -2, viralChance: 0.14, cancelRisk: 0.03, desc: 'Kandungan sihat, selamat & mesra penaja.' },
    { id: 'educational', name: 'Pendidikan & Ilmu', icon: '📚', karma: 8, stress: 2, viralChance: 0.12, cancelRisk: 0.02, desc: 'Naikkan Kepintaran & pengikut berkualiti.' },
    { id: 'controversial', name: 'Kontroversi & Sensasi', icon: '🔥', karma: -8, stress: 10, viralChance: 0.28, cancelRisk: 0.22, desc: 'Pengikut naik laju, tetapi risiko kena "Cancel" tinggi!' },
    { id: 'ragebait', name: 'Rage-Bait & Drama', icon: '💣', karma: -14, stress: 14, viralChance: 0.34, cancelRisk: 0.32, desc: 'Meletup sekelip mata atau disaman & diboikot warganet!' }
  ],

  VIRAL_CAREERS: [
    {
      id: 'viral_influencer',
      title: 'Pencipta Kandungan / Influencer',
      icon: '📱',
      minFollowers: 10000,
      minFame: 15,
      baseSalaryUsd: 26000,
      desc: 'Menjana pendapatan melalui tajaan jenama, reviu produk & konten tular.'
    },
    {
      id: 'viral_streamer',
      title: 'Streamer Profesional',
      icon: '🎮',
      minFollowers: 35000,
      minFame: 28,
      baseSalaryUsd: 48000,
      desc: 'Strim langsung harian dengan langganan peminat & tajaan e-sukan.'
    },
    {
      id: 'viral_entrepreneur',
      title: 'Usahawan Selebriti Viral',
      icon: '👑',
      minFollowers: 150000,
      minFame: 55,
      baseSalaryUsd: 135000,
      desc: 'Lancarkan jenama produk sendiri hasil jutaan pengikut & pengaruh besar!'
    }
  ],

  formatFollowers(n) {
    if (n >= 1e6) return (n / 1e6).toFixed(2).replace(/\.00$/, '') + 'J';
    if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
    return String(Math.round(n || 0));
  },

  joinPlatform(platformId) {
    const s = GameState.current;
    GameState.ensureUpgradedState();
    if (s.age < 13) return { ok: false, msg: 'Tunggu umur 13 tahun untuk mendaftar akaun Laman Sosial!' };
    const plat = this.PLATFORMS.find(p => p.id === platformId);
    if (!plat) return { ok: false, msg: 'Platform tidak ditemui.' };
    if (s.socialMedia.platforms.includes(platformId)) return { ok: false, msg: `Anda sudah mempunyai akaun ${plat.name}!` };

    s.socialMedia.hasAccount = true;
    s.socialMedia.platforms.push(platformId);
    const starter = Utils.randInt(120, 650) + (s.alignment.fame * 40);
    s.socialMedia.followers += starter;
    KarmaEndings.markModeVisited('social');
    GameState.addJournalEntry(`${plat.icon} Anda membuka akaun rasmi di ${plat.name} (${plat.type}) dan mengumpul ${starter} pengikut pertama!`, 'culture');
    GameState.save();
    return { ok: true, msg: `Akaun ${plat.name} dibuka (+${starter} pengikut)!` };
  },

  postContent(strategyId) {
    const s = GameState.current;
    GameState.ensureUpgradedState();
    if (s.prison.inPrison) return { ok: false, msg: 'Anda tidak boleh memuat naik konten dari dalam penjara!' };
    if (!s.socialMedia.platforms.length) return { ok: false, msg: 'Daftar sekurang-kurangnya satu platform Laman Sosial dahulu!' };
    if (s.yearlyActions.socialPost) return { ok: false, msg: 'Anda sudah memuat naik kempen konten utama tahun ini.' };

    const strat = this.STRATEGIES.find(x => x.id === strategyId) || this.STRATEGIES[0];
    s.yearlyActions.socialPost = true;
    s.socialMedia.posts += 1;

    const looksFactor = (s.stats.looks + s.stats.smarts) / 140;
    const platBonus = 1 + (s.socialMedia.platforms.length - 1) * 0.25;
    const wentViral = Utils.chance(strat.viralChance * platBonus);
    const gotCancelled = Utils.chance(strat.cancelRisk + (s.alignment.fame > 40 && strat.karma < 0 ? 0.08 : 0));

    KarmaEndings.adjustAlignment({ karma: strat.karma, stress: strat.stress });

    if (gotCancelled) {
      const lost = Math.round(s.socialMedia.followers * Utils.randInt(18, 42) / 100);
      const lawsuit = Utils.chance(0.45) ? Utils.usdToLocal(Utils.randInt(1800, 7500), s.countryId) : 0;
      s.socialMedia.followers = Math.max(0, s.socialMedia.followers - lost);
      s.socialMedia.cancelledCount += 1;
      if (lawsuit > 0) s.money -= lawsuit;
      KarmaEndings.adjustAlignment({ fame: -10, stress: 18, karma: -8 });
      GameState.adjustStats({ happiness: -18 });
      KarmaEndings.addHighlight('🚨', `Terkena Cancel Culture selepas strategi ${strat.name}`);
      GameState.addJournalEntry(
        `🚨 CANCEL CULTURE! Konten "${strat.name}" dan tangkap layar mesej lama anda dibongkar netizen! Anda hilang ${this.formatFollowers(lost)} pengikut${lawsuit > 0 ? ` dan membayar saman ${Utils.formatMoney(lawsuit, s.countryId)}` : ''}.`,
        'warning'
      );
      GameState.save();
      return { ok: false, msg: `Terkena Cancel Culture! Hilang ${this.formatFollowers(lost)} pengikut.` };
    }

    let gained;
    if (wentViral) {
      gained = Math.round((Utils.randInt(12000, 75000) + s.socialMedia.followers * 0.35) * looksFactor);
      s.socialMedia.viralHits += 1;
      KarmaEndings.adjustAlignment({ fame: Utils.randInt(12, 22) });
      GameState.adjustStats({ happiness: 14, smarts: strategyId === 'educational' ? 4 : 0 });
      KarmaEndings.addHighlight('🔥', `Konten tular besar-besaran (+${this.formatFollowers(gained)} pengikut)`);
      GameState.addJournalEntry(
        `⚡ TULAR! Konten "${strat.name}" anda meletup di garis masa dengan +${this.formatFollowers(gained)} pengikut baru!`,
        'milestone'
      );
    } else {
      gained = Math.round((Utils.randInt(600, 4800) + s.socialMedia.followers * 0.12) * looksFactor * platBonus);
      KarmaEndings.adjustAlignment({ fame: Utils.randInt(2, 6) });
      GameState.adjustStats({ happiness: 5, smarts: strategyId === 'educational' ? 3 : 0 });
      GameState.addJournalEntry(
        `📱 Anda menerbitkan siri konten "${strat.name}" dan menarik +${this.formatFollowers(gained)} pengikut baru.`,
        'culture'
      );
    }

    s.socialMedia.followers += gained;
    GameState.save();
    return {
      ok: true,
      msg: wentViral
        ? `TULAR! +${this.formatFollowers(gained)} pengikut baru!`
        : `+${this.formatFollowers(gained)} pengikut baru!`
    };
  },

  takeSponsorship() {
    const s = GameState.current;
    GameState.ensureUpgradedState();
    if (s.prison.inPrison) return { ok: false, msg: 'Tidak boleh terima tajaan semasa di penjara.' };
    if (s.socialMedia.followers < 3000) return { ok: false, msg: 'Perlukan sekurang-kurangnya 3,000 pengikut untuk tajaan jenama!' };
    if (s.yearlyActions.socialSponsor) return { ok: false, msg: 'Anda sudah melengkapkan tajaan jenama tahun ini.' };

    s.yearlyActions.socialSponsor = true;
    const payUsd = Math.min(85000, Math.round(400 + (s.socialMedia.followers / 1000) * Utils.randInt(38, 72)));
    const payLocal = Utils.usdToLocal(payUsd, s.countryId);
    s.money += payLocal;
    KarmaEndings.adjustAlignment({ fame: 4 });
    GameState.adjustStats({ happiness: 8 });
    GameState.addJournalEntry(
      `💰 Anda mempromosikan kempen jenama tajaan di Laman Sosial dan meraih ${Utils.formatMoney(payLocal, s.countryId)}!`,
      'milestone'
    );
    GameState.save();
    return { ok: true, msg: `Meraih tajaan ${Utils.formatMoney(payLocal, s.countryId)}!` };
  },

  joinViralCareer(careerId) {
    const s = GameState.current;
    GameState.ensureUpgradedState();
    if (s.prison.inPrison) return { ok: false, msg: 'Tidak boleh menyertai kerjaya ketika di penjara.' };
    if (s.age < 16) return { ok: false, msg: 'Tunggu umur 16 tahun untuk kerjaya viral sepenuh masa!' };
    const def = this.VIRAL_CAREERS.find(c => c.id === careerId);
    if (!def) return { ok: false, msg: 'Kerjaya tidak ditemui.' };
    if (s.socialMedia.followers < def.minFollowers || s.alignment.fame < def.minFame) {
      return {
        ok: false,
        msg: `Perlukan ${this.formatFollowers(def.minFollowers)} pengikut & ${def.minFame}% Populariti!`
      };
    }

    const followerBonusUsd = Math.min(180000, Math.round((s.socialMedia.followers / 10000) * 2800));
    const localSalary = Utils.usdToLocal(def.baseSalaryUsd + followerBonusUsd, s.countryId);
    s.job = {
      id: def.id,
      title: def.title,
      icon: def.icon,
      salary: localSalary,
      years: 0,
      performance: 75,
      countryId: s.countryId,
      isViralCareer: true
    };
    KarmaEndings.markModeVisited('social');
    KarmaEndings.addHighlight(def.icon, `Memulakan kerjaya viral sebagai ${def.title}`);
    GameState.addJournalEntry(
      `${def.icon} Anda kini bergelar ${def.title} sepenuh masa dengan anggaran pendapatan ${Utils.formatMoney(localSalary, s.countryId)}/thn!`,
      'milestone'
    );
    GameState.adjustStats({ happiness: 14 });
    GameState.save();
    return { ok: true, msg: `Anda kini ${def.title}!` };
  },

  // --------------------------------------------------------------------------
  // APLIKASI SESI DATE (SwipeMatch)
  // --------------------------------------------------------------------------
  HIDDEN_TRAITS: [
    { id: 'soulmate', label: 'Jodoh Sejati', isRedFlag: false, desc: 'Setia, penyayang & menyokong jatuh bangun anda.' },
    { id: 'gold_digger', label: 'Kaki Kikis (Gold-Digger)', isRedFlag: true, desc: 'Lebih berminat pada baki bank daripada hati anda.' },
    { id: 'catfish', label: 'Catfish / Profil Palsu', isRedFlag: true, desc: 'Foto dan latar belakang profil rupanya jauh berbeza!' },
    { id: 'secret_married', label: 'Rahsia Sudah Berkahwin', isRedFlag: true, desc: 'Menyembunyikan status perkahwinan sebenar!' },
    { id: 'toxic_ex', label: 'Bekas Pasangan Toksik', isRedFlag: true, desc: 'Membawa drama bekas pasangan yang suka mengugut.' }
  ],

  DATING_AGE_RANGES: [
    { id: 'all', label: 'Semua Umur (18+ Tahun)', min: 18, max: 75 },
    { id: '18_24', label: '18 – 24 Tahun', min: 18, max: 24 },
    { id: '25_34', label: '25 – 34 Tahun', min: 25, max: 34 },
    { id: '35_49', label: '35 – 49 Tahun', min: 35, max: 49 },
    { id: '50_64', label: '50 – 64 Tahun', min: 50, max: 64 },
    { id: '65_plus', label: '65+ Tahun', min: 65, max: 80 }
  ],

  MAX_DATING_SEARCHES_YEAR: 8,

  generateDatingCandidates(minAgeInput, maxAgeInput) {
    const s = GameState.current;
    GameState.ensureUpgradedState();
    const c = Utils.getCountry(s.countryId);
    const targetGender = s.gender === 'male' ? 'female' : 'male';
    const defaultMin = Math.max(18, Math.min(80, (s.age || 22) - 4));
    const defaultMax = Math.max(defaultMin, Math.min(90, (s.age || 22) + 8));
    const min = Utils.clamp(Number(minAgeInput ?? s._datingMinAge ?? defaultMin) || 18, 18, 90);
    const max = Utils.clamp(Number(maxAgeInput ?? s._datingMaxAge ?? defaultMax) || 35, min, 90);
    s._datingMinAge = min;
    s._datingMaxAge = max;

    const wealthTiers = ['Sederhana', 'Stabil', 'Berada', 'Mewah'];
    const heritage = Utils.pick(c.heritages).id;
    const name = Utils.generateName(s.countryId, targetGender, heritage);
    const job = Utils.pick(c.jobs).title;
    const age = Utils.randInt(min, max);
    const looks = Utils.randInt(45, 96);
    const wealth = Utils.pick(wealthTiers);
    const traitPool = Utils.chance(0.55) ? [this.HIDDEN_TRAITS[0]] : this.HIDDEN_TRAITS.slice(1);
    const hiddenTrait = Utils.pick(traitPool);

    const cand = {
      uid: `cand_${Date.now()}_${Utils.randInt(10, 99)}`,
      name,
      gender: targetGender,
      age,
      job,
      looks,
      wealth,
      compatibility: Utils.randInt(55, 96),
      hiddenTraitId: hiddenTrait.id
    };

    s._datingPool = [cand];
    return s._datingPool;
  },

  skipCandidate(uid) {
    const s = GameState.current;
    GameState.ensureUpgradedState();
    const used = s.yearlyActions.datingSearches || 0;
    if (used >= this.MAX_DATING_SEARCHES_YEAR) {
      return { ok: false, msg: `Had carian pasangan tahun ini (${this.MAX_DATING_SEARCHES_YEAR}x) telah tamat. Cuba lagi tahun hadapan.` };
    }
    s.yearlyActions.datingSearches = used + 1;
    this.generateDatingCandidates(s._datingMinAge, s._datingMaxAge);
    GameState.save();
    return { ok: true, msg: 'Calon baharu ditemui!' };
  },

  matchCandidate(uid) {
    const s = GameState.current;
    GameState.ensureUpgradedState();
    const minAge = 18;
    if (s.age < minAge) return { ok: false, msg: `Aplikasi Janji Temu dibuka pada umur ${minAge}+ tahun!` };
    if (s.partnerId) return { ok: false, msg: 'Anda sudah mempunyai pasangan aktif!' };

    const cand = (s._datingPool || []).find(x => x.uid === uid);
    if (!cand) return { ok: false, msg: 'Profil ini sudah tamat tempoh — jana calon baru.' };

    // Semak Catfish / Rahsia Sudah Berkahwin terus pada pertemuan pertama!
    if (cand.hiddenTraitId === 'catfish' && Utils.chance(0.75)) {
      GameState.adjustStats({ happiness: -8 });
      KarmaEndings.adjustAlignment({ stress: 6 });
      GameState.addJournalEntry(
        `🐟 CATFISH! Semasa pertemuan pertama dengan ${cand.name}, rupa dan pekerjaannya langsung tidak sama dengan profil aplikasi! Anda terus angkat kaki.`,
        'warning'
      );
      s._datingPool = [];
      GameState.save();
      return { ok: false, msg: `Kena Catfish oleh ${cand.name}! Profil palsu terbongkar.` };
    }

    // Peluang diterima ikut rupa, kewangan & jurang umur
    const looksFactor = ((s.stats && s.stats.looks) || 50) * 0.0045;
    const usdMoney = Utils.localToUsd(s.money || 0, s.countryId);
    const wealthFactor = usdMoney >= 100000 ? 0.20 : usdMoney >= 25000 ? 0.12 : usdMoney >= 5000 ? 0.05 : -0.05;
    const ageGap = Math.abs((s.age || 20) - (cand.age || 20));
    const gapPenalty = ageGap > 15 ? -0.22 : ageGap > 8 ? -0.10 : 0.04;
    const acceptChance = Utils.clamp(0.38 + looksFactor + wealthFactor + gapPenalty, 0.12, 0.90);

    if (!Utils.chance(acceptChance)) {
      s._datingPool = [];
      GameState.adjustStats({ happiness: -3 });
      GameState.addJournalEntry(`💔 ${cand.name} (${cand.age} thn) menolak pelawaan bercinta anda dengan sopan.`, 'normal');
      GameState.save();
      return { ok: false, msg: `${cand.name} menolak pelawaan anda. Cuba cari calon lain!` };
    }

    if (cand.hiddenTraitId === 'secret_married' && Utils.chance(0.65)) {
      GameState.adjustStats({ happiness: -10 });
      KarmaEndings.adjustAlignment({ stress: 8 });
      GameState.addJournalEntry(
        `🚨 BAHAYA! Anda mendapat tahu ${cand.name} rupa-rupanya sudah berkahwin secara rahsia! Anda segera menjauhkan diri sebelum terjerat skandal.`,
        'warning'
      );
      s._datingPool = (s._datingPool || []).filter(x => x.uid !== uid);
      GameState.save();
      return { ok: false, msg: `${cand.name} rupanya sudah berkahwin secara rahsia! Dibatalkan.` };
    }

    // Semak penerimaan atau penolakan semasa Sesi Date
    if (window.Relationships && Relationships.evaluateCourtingAcceptance) {
      const courtRes = Relationships.evaluateCourtingAcceptance(s, {
        name: cand.name,
        age: cand.age,
        job: cand.job
      });
      if (!courtRes.accepted) {
        GameState.adjustStats({ happiness: -Utils.randInt(5, 11) });
        if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: 4 });
        GameState.addJournalEntry(courtRes.logText, 'warning');
        s._datingPool = (s._datingPool || []).filter(x => x.uid !== uid);
        GameState.save();
        return {
          ok: false,
          rejected: true,
          reasonTag: courtRes.reasonTag,
          msg: courtRes.shortMsg
        };
      }
    }

    const roleLabel = cand.gender === 'female' ? 'Teman Wanita (Sesi Date)' : 'Teman Lelaki (Sesi Date)';
    const partner = {
      id: 'rel_partner_' + Date.now(),
      name: cand.name,
      role: roleLabel,
      category: 'partner',
      stage: 'dating',
      origin: 'Sesi Date',
      gender: cand.gender,
      age: cand.age,
      countryId: s.countryId,
      closeness: cand.hiddenTraitId === 'soulmate' ? Utils.randInt(72, 88) : Utils.randInt(54, 72),
      trust: cand.hiddenTraitId === 'soulmate' ? Utils.randInt(78, 92) : Utils.randInt(42, 68),
      compatibility: cand.compatibility,
      yearsTogether: 0,
      unresolvedConflict: false,
      hiddenTraitId: cand.hiddenTraitId,
      traitRevealed: false,
      alive: true,
      job: cand.job
    };

    s.relationships.push(partner);
    s.partnerId = partner.id;
    s._datingPool = [];

    GameState.adjustStats({ happiness: 13 });
    GameState.addJournalEntry(
      `💘 Melalui Sesi Date, anda mula mengenali ${cand.name} (${cand.age} thn, ${cand.job}) dan keluar bersama!`,
      'romance'
    );
    GameState.save();
    return { ok: true, msg: `Mula Sesi Date bersama ${cand.name}!` };
  },

  // Peristiwa tahunan red-flag tersembunyi pasangan dari aplikasi jodoh
  checkPartnerHiddenTraitEvent(s) {
    if (!s.partnerId) return null;
    const p = s.relationships.find(r => r.id === s.partnerId && r.alive);
    if (!p || !p.hiddenTraitId || p.traitRevealed) return null;
    if (!Utils.chance(0.35)) return null;

    p.traitRevealed = true;
    if (p.hiddenTraitId === 'gold_digger') {
      return {
        id: 'app_redflag_gold_' + s.age,
        icon: '💸',
        title: 'Red Flag Terbongkar: Kaki Kikis!',
        text: `Anda mula sedar ${p.name} hanya muncul ketika mahukan beg berjenama dan wang tunai, malah memaksa anda membelikan barang mewah mahal hari ini!`,
        choices: [
          {
            label: 'Bersemuka & putuskan hubungan toksik ini',
            hint: 'Wang selamat, hati pedih seketika',
            journalType: 'warning',
            customAction: (st) => {
              st.partnerId = null;
              st.married = false;
              p.category = 'ex';
              p.role = 'Bekas Pasangan';
              p.closeness = 10;
              GameState.adjustStats({ happiness: -10 });
              GameState.recordCrisis('heartbreak');
              return { outcome: `Anda menamatkan hubungan dengan ${p.name} sebelum akaun bank anda kering!` };
            }
          },
          {
            label: 'Turuti sahaja kemahuannya demi menjaga hati',
            hint: 'Wang ---, Kepercayaan -',
            journalType: 'dilemma',
            customAction: (st) => {
              const spend = Utils.usdToLocal(2200, st.countryId);
              st.money -= spend;
              p.trust = Utils.clamp((p.trust || 50) - 20, 5, 100);
              GameState.adjustStats({ happiness: -6 });
              return { outcome: `Anda menghabiskan ${Utils.formatMoney(spend, st.countryId)} untuk memuaskan ${p.name}, tetapi rasa sangsi semakin menebal.` };
            }
          }
        ]
      };
    }

    if (p.hiddenTraitId === 'toxic_ex') {
      return {
        id: 'app_redflag_ex_' + s.age,
        icon: '🌪️',
        title: 'Drama Aplikasi Jodoh: Bekas Pasangan Toksik!',
        text: `Bekas pasangan ${p.name} yang obses muncul di tempat kerja anda membuat kecoh dan mengugut mahu memburukkan nama anda!`,
        choices: [
          {
            label: 'Buat laporan polis & lindungi keselamatan bersama',
            hint: 'Kemesraan +, Stres +',
            journalType: 'dilemma',
            customAction: () => {
              p.closeness = Utils.clamp(p.closeness + 10);
              KarmaEndings.adjustAlignment({ stress: 10, karma: 4 });
              return { outcome: `Polis memberi amaran keras kepada bekas pasangan ${p.name}. Keberanian anda membuatkan ${p.name} amat menghargai anda.` };
            }
          },
          {
            label: 'Undur diri daripada drama ini demi ketenangan hidup',
            hint: 'Hubungan tamat, Stres --',
            journalType: 'warning',
            customAction: (st) => {
              st.partnerId = null;
              st.married = false;
              p.category = 'ex';
              p.role = 'Bekas Pasangan';
              GameState.adjustStats({ happiness: -8 });
              return { outcome: `Anda memilih untuk keluar daripada drama yang terlalu berat bersama ${p.name}.` };
            }
          }
        ]
      };
    }

    if (p.hiddenTraitId === 'soulmate') {
      return {
        id: 'app_soulmate_' + s.age,
        icon: '💖',
        title: 'Anugerah Takdir: Jodoh Sejati!',
        text: `Melalui detik sukar dan senang bersama, anda sedar ${p.name} benar-benar ikhlas, setia dan menjadi penyokong paling kuat dalam hidup anda!`,
        choices: [
          {
            label: 'Hargai anugerah ini sepenuh hati',
            hint: 'Gembira +++, Kepercayaan 100%, Stres --',
            journalType: 'romance',
            customAction: () => {
              p.closeness = 100;
              p.trust = 100;
              KarmaEndings.adjustAlignment({ stress: -15, karma: 8 });
              GameState.adjustStats({ happiness: 22 });
              return { outcome: `Ikatan anda bersama ${p.name} kini tidak tergoyah — benar-benar jodoh sejati!` };
            }
          }
        ]
      };
    }

    return null;
  }
};
