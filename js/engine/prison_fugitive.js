/* ==========================================================================
   WorldLife — Sistem Mahkamah, Penjara, Pelarian, Pembedahan Plastik,
   Identiti Palsu & Mini-Permainan Lari/Rusuhan (Ala BitLife — Bahasa Melayu)
   ========================================================================== */

window.PrisonFugitive = {
  SECURITY_LABELS: {
    minimum: { name: 'Keselamatan Minimum', icon: '🔓', riotTarget: 10, badgeColor: '#eab308' },
    medium:  { name: 'Keselamatan Sederhana', icon: '🔒', riotTarget: 15, badgeColor: '#ea580c' },
    maximum: { name: 'Keselamatan Maksimum', icon: '⛓️', riotTarget: 20, badgeColor: '#dc2626' }
  },

  GANG_NAMES: [
    'Geng Rimau Besi',
    'Kumpulan Blok C',
    'Persaudaraan Tedung',
    'Skuad Tembok Gelap',
    'Geng Bintang Pecah'
  ],

  // --------------------------------------------------------------------------
  // 8 PETA LABIRIN LARI PENJARA (7x7) YANG DISAHKAN BOLEH DIMENANGI
  // Simbol: '#' = Dinding, '.' = Laluan, 'P' = Banduan, 'G' = Pengawal, 'E' = Pintu Keluar
  // Peraturan BitLife: Banduan gerak 1 petak; Pengawal gerak maks 2 petak
  // (utamakan lajur X/mendatar dahulu, kemudian baris Y/menegak — boleh diperangkap di belakang dinding!)
  // --------------------------------------------------------------------------
  ESCAPE_MAZES: {
    minimum: [
      {
        name: 'Blok A — Lorong Dobi',
        grid: [
          'P......',
          '...#...',
          '..###..',
          '#.#.#.#',
          '.#..#..',
          '##...G.',
          '#...##E'
        ]
      },
      {
        name: 'Blok B — Taman Terbuka',
        grid: [
          '#.....#',
          '...##G.',
          '....##.',
          '..#...#',
          '.......',
          '#...#.#',
          'P.#.#.E'
        ]
      },
      {
        name: 'Blok C — Dewan Makan',
        grid: [
          '#...#.P',
          '#...#.#',
          '..#G#..',
          '#..#..#',
          '.#..#..',
          '##....#',
          'E.....#'
        ]
      }
    ],
    medium: [
      {
        name: 'Penjara Sederhana — Sayap Utara',
        grid: [
          'E....#.',
          '.###..#',
          '...#G##',
          '.#.....',
          '.##.#G.',
          '.#...##',
          '......P'
        ]
      },
      {
        name: 'Penjara Sederhana — Bengkel Besi',
        grid: [
          'P.....#',
          '...#...',
          '.#....#',
          '.G#.#.#',
          '....#..',
          '.G..#..',
          '##....E'
        ]
      },
      {
        name: 'Penjara Sederhana — Koridor Tengah',
        grid: [
          '.##.#.E',
          '#..###.',
          '.......',
          '...##.#',
          '#.#G.#.',
          '..#.G..',
          'P...##.'
        ]
      }
    ],
    maximum: [
      {
        name: 'Keselamatan Maksimum — Kubu Besi',
        grid: [
          'E#.#...',
          '.#....#',
          '.#.#GG.',
          '..#..#.',
          '..#.##.',
          '......#',
          '###...P'
        ]
      },
      {
        name: 'Keselamatan Maksimum — Menara Kawalan',
        grid: [
          '.#.#..P',
          '.##..#.',
          '#...#..',
          '....##.',
          '....#..',
          '.G...G#',
          '#..#..E'
        ]
      }
    ]
  },

  ensureFields(s) {
    if (!s) return;
    if (!s.prison || typeof s.prison !== 'object') {
      s.prison = {
        inPrison: false, yearsLeft: 0, originalSentence: 0, yearsServed: 0, totalServed: 0,
        crimeName: null, securityLevel: 'minimum', detentionType: 'prison', transferAt18: false,
        isLife: false, isDeathPenalty: false, lawTierLabel: null,
        respect: 25, behavior: 65, gangName: null, lastAppealYear: -99
      };
    } else {
      if (typeof s.prison.originalSentence !== 'number') s.prison.originalSentence = s.prison.yearsLeft || 0;
      if (typeof s.prison.yearsServed !== 'number') s.prison.yearsServed = 0;
      if (!s.prison.securityLevel) s.prison.securityLevel = 'minimum';
      if (!s.prison.detentionType) s.prison.detentionType = (s.age < 18 ? 'juvenile' : 'prison');
      if (typeof s.prison.transferAt18 !== 'boolean') s.prison.transferAt18 = false;
      if (typeof s.prison.respect !== 'number') s.prison.respect = 25;
      if (typeof s.prison.behavior !== 'number') s.prison.behavior = 65;
      if (typeof s.prison.lastAppealYear !== 'number') s.prison.lastAppealYear = -99;
    }

    if (!s.fugitive || typeof s.fugitive !== 'object') {
      s.fugitive = {
        isFugitive: false, hiddenPast: false, recaptureRisk: 0,
        escapedFromCountryId: null, smuggledAbroad: false, hadPlasticSurgery: false,
        fakeIdentityTier: null, aliasName: null, trueName: null, avatarOverride: null
      };
    }
  },

  STRICT_LAW_COUNTRIES: ['MY','SG','ID','SA','JP','CN','US','KR','TH','VN','AE','QA','KW','BN','IR','IQ','EG','PK','BD','PH','TW','RU','TR','NG','IN','KP'],
  REHAB_LAW_COUNTRIES: ['NO','SE','FI','DK','IS','NL','PT','CH'],
  MODERATE_LAW_COUNTRIES: ['GB','UK','CA','AU','NZ','DE','FR','IT','ES','BR','BE','AT','IE','PL','CZ','GR','MX','AR','CL','CO','ZA'],

  getCountryLawTier(country) {
    const cid = typeof country === 'string' ? country : (country && country.id);
    if (this.STRICT_LAW_COUNTRIES.includes(cid)) return 'strict';
    if (this.REHAB_LAW_COUNTRIES.includes(cid)) return 'rehabilitative';
    if (this.MODERATE_LAW_COUNTRIES.includes(cid)) return 'moderate';
    const cObj = typeof country === 'object' && country ? country : (window.Utils ? Utils.getCountry(cid) : null);
    if (cObj && cObj.continent === 'Europe' && (cObj.safetyIndex || 70) >= 80) return 'rehabilitative';
    if (cObj && (cObj.safetyIndex || 70) >= 65) return 'moderate';
    return 'strict';
  },

  getCountrySentence(country, crimeSeverity = 'minor', isJuvenile = false) {
    const cObj = typeof country === 'object' && country ? country : (window.Utils ? Utils.getCountry(country) : { id: 'MY', name: 'Negara Ini' });
    const tier = this.getCountryLawTier(cObj);
    const tierLabel = tier === 'strict'
      ? 'Undang-Undang Ketat / Berat'
      : tier === 'rehabilitative'
        ? 'Undang-Undang Rehabilitatif / Ringan'
        : 'Undang-Undang Sederhana';
    const detentionType = isJuvenile ? 'juvenile' : 'prison';

    let years = 0;
    let fineOnly = false;
    let isLife = false;
    let isDeathPenalty = false;
    let transferAt18 = false;

    if (tier === 'strict') {
      if (crimeSeverity === 'minor') {
        if (isJuvenile) { fineOnly = Utils.chance(0.55); years = fineOnly ? 0 : 1; }
        else { fineOnly = Utils.chance(0.35); years = fineOnly ? 0 : Utils.randInt(1, 2); }
      } else if (crimeSeverity === 'medium' || crimeSeverity === 'major') {
        years = isJuvenile ? Utils.randInt(1, 4) : Utils.randInt(3, 10);
      } else if (crimeSeverity === 'murder') {
        if (isJuvenile) {
          years = Utils.randInt(5, 12);
          transferAt18 = true;
        } else {
          const roll = Math.random();
          if (roll < 0.25) { isDeathPenalty = true; years = 30; }
          else if (roll < 0.55) { isLife = true; years = 40; }
          else { years = Utils.randInt(20, 30); }
        }
      }
    } else if (tier === 'rehabilitative') {
      if (crimeSeverity === 'minor') {
        fineOnly = true;
        years = 0;
      } else if (crimeSeverity === 'medium' || crimeSeverity === 'major') {
        years = isJuvenile ? Utils.randInt(1, 2) : Utils.randInt(1, 5);
      } else if (crimeSeverity === 'murder') {
        years = isJuvenile ? Utils.randInt(2, 5) : Utils.randInt(10, 21);
      }
    } else {
      // moderate
      if (crimeSeverity === 'minor') {
        fineOnly = Utils.chance(0.50);
        years = fineOnly ? 0 : 1;
      } else if (crimeSeverity === 'medium' || crimeSeverity === 'major') {
        years = isJuvenile ? Utils.randInt(1, 3) : Utils.randInt(2, 8);
      } else if (crimeSeverity === 'murder') {
        if (isJuvenile) {
          years = Utils.randInt(3, 8);
        } else if (Utils.chance(0.28)) {
          isLife = true;
          years = 35;
        } else {
          years = Utils.randInt(15, 25);
        }
      }
    }

    const facilityName = isJuvenile ? 'Sekolah Juvana' : 'penjara';
    let verdictSummary = '';
    if (fineOnly) {
      verdictSummary = `Mahkamah ${cObj.name} menjatuhkan hukuman denda dan khidmat masyarakat di bawah ${tierLabel}.`;
    } else if (isDeathPenalty) {
      verdictSummary = `Mahkamah ${cObj.name} menjatuhkan Hukuman Mati (boleh memfailkan rayuan peguam) di bawah ${tierLabel}.`;
    } else if (isLife) {
      verdictSummary = `Mahkamah ${cObj.name} menjatuhkan hukuman Penjara Seumur Hidup (${years} tahun) di bawah ${tierLabel}.`;
    } else {
      verdictSummary = `Mahkamah ${cObj.name} menjatuhkan hukuman ${years} tahun ${facilityName} di bawah ${tierLabel}.`;
    }

    return {
      countryName: cObj.name,
      tier,
      tierLabel,
      detentionType,
      years,
      fineOnly,
      isLife,
      isDeathPenalty,
      transferAt18,
      verdictSummary
    };
  },

  getSecurityTierForYears(years) {
    if (years >= 7) return 'maximum';
    if (years >= 3) return 'medium';
    return 'minimum';
  },

  // --------------------------------------------------------------------------
  // 1. SISTEM PERBICARAAN MAHKAMAH & PEGUAM (5 PILIHAN PEMBELAAN)
  // --------------------------------------------------------------------------
  buildCourtTrialEvent(s, crimeName, baseYears = 3, forcedSecurity = null) {
    this.ensureFields(s);
    const c = Utils.getCountry(s.countryId);
    const secLevel = forcedSecurity || this.getSecurityTierForYears(baseYears);
    const secInfo = this.SECURITY_LABELS[secLevel] || this.SECURITY_LABELS.minimum;
    const minY = Math.max(1, baseYears - 1);
    const maxY = baseYears + 2;

    const bonuses = window.Dynasty ? Dynasty.getBloodlineBonuses() : {};
    const discount = 1 - (bonuses.legalCostDiscount || 0);
    const econScale = Math.max(0.45, c.salaryMultiplier || 0.7);

    const privCost = Utils.usdToLocal(Math.round(4500 * econScale * discount), s.countryId);
    const sharkCost = Utils.usdToLocal(Math.round(24000 * econScale * discount), s.countryId);
    const bribeCost = Utils.usdToLocal(Math.round(8000 * econScale), s.countryId);

    // Kadar kejayaan rasuah bergantung kepada indeks keselamatan/rasuah negara
    const safety = c.safetyIndex || 70;
    const bribeWinChance = Math.max(0.14, Math.min(0.72, (105 - safety) / 100));

    const finishAcquittal = (st, label, fineLocal = 0) => {
      if (fineLocal > 0) st.money -= fineLocal;
      if (window.KarmaEndings) KarmaEndings.adjustAlignment({ notoriety: -10, stress: -8 });
      if (window.Dynasty) Dynasty.adjustReputation(-3);
      GameState.adjustStats({ happiness: 12 });
      return {
        outcome: `TIDAK BERSALAH! Melalui ${label}, anda dibebaskan daripada pertuduhan "${crimeName}"${fineLocal > 0 ? ` (bayaran denda/kompaun ${Utils.formatMoney(fineLocal, st.countryId)})` : ''}!`,
        toastType: 'success'
      };
    };

    const enterPrison = (st, years, level, reasonText) => {
      this.enterPrisonState(st, crimeName, years, level);
      return {
        outcome: `${reasonText} Anda dihantar ke Penjara ${this.SECURITY_LABELS[level].name} selama ${years} tahun!`,
        toastType: 'error'
      };
    };

    return {
      id: 'court_trial_' + Date.now(),
      icon: '⚖️',
      title: 'Perbicaraan Mahkamah!',
      text: `Pertuduhan: "${crimeName}"\nAnggaran Hukuman: ${minY}–${maxY} tahun • Tahap: ${secInfo.icon} ${secInfo.name}\nPilih strategi pembelaan anda di hadapan hakim!`,
      choices: [
        {
          label: '⚖️ Peguam Bantuan Guaman (Percuma)',
          hint: 'Peluang bebas 15–22% • Peluang kecil hukuman diringankan',
          journalType: 'warning',
          customAction: (st) => {
            if (Utils.chance(0.18 + (st.stats.smarts / 1400))) {
              return finishAcquittal(st, 'Peguam Bantuan Guaman');
            }
            const yrs = Utils.chance(0.30) ? minY : Utils.randInt(minY, maxY);
            return enterPrison(st, yrs, secLevel, 'BERSALAH! Pembelaan percuma gagal mematahkan pendakwaan.');
          }
        },
        {
          label: `💼 Peguam Swasta (${Utils.formatMoney(privCost, s.countryId)})`,
          hint: `Peluang bebas 42–52%${bonuses.legalCostDiscount ? ' • Diskaun Gen 11 -25%!' : ''}`,
          journalType: 'dilemma',
          customAction: (st) => {
            if (st.money < privCost) {
              return enterPrison(st, Utils.randInt(minY, maxY), secLevel, 'Wang tidak mencukupi untuk Peguam Swasta — anda dibela peguam awam dan didapati BERSALAH.');
            }
            st.money -= privCost;
            if (Utils.chance(0.45 + (st.stats.smarts / 1000))) {
              return finishAcquittal(st, 'Peguam Swasta');
            }
            const yrs = Math.max(1, Math.round(Utils.randInt(minY, maxY) * 0.8));
            return enterPrison(st, yrs, secLevel, 'BERSALAH! Namun Peguam Swasta berjaya meringankan sedikit tempoh hukuman.');
          }
        },
        {
          label: `🦈 Peguam Elit / "Peguam Jerung" (${Utils.formatMoney(sharkCost, s.countryId)})`,
          hint: 'Peluang bebas 75–85% atau ditukar kepada denda sahaja!',
          journalType: 'dilemma',
          customAction: (st) => {
            if (st.money < sharkCost) {
              return enterPrison(st, Utils.randInt(minY, maxY), secLevel, 'Dana tidak mencukupi untuk Peguam Jerung — anda didapati BERSALAH.');
            }
            st.money -= sharkCost;
            if (Utils.chance(0.76)) {
              return finishAcquittal(st, 'Peguam Jerung Elit');
            }
            if (Utils.chance(0.55)) {
              const fine = Utils.usdToLocal(Math.round(3500 * econScale), st.countryId);
              return finishAcquittal(st, 'rundingan Peguam Jerung (ditukar kepada denda/bon berkelakuan baik)', fine);
            }
            const yrs = Math.max(1, Math.round(minY * 0.65));
            return enterPrison(st, yrs, secLevel === 'maximum' ? 'medium' : secLevel, 'BERSALAH, namun Peguam Jerung berjaya mengurangkan hukuman secara drastik.');
          }
        },
        {
          label: '🙇 Mengaku Bersalah (Plead Guilty)',
          hint: 'Langkau perbicaraan • Hukuman dikurangkan 25–35%!',
          journalType: 'warning',
          customAction: (st) => {
            const reduced = Math.max(1, Math.round(baseYears * 0.68));
            if (window.KarmaEndings) KarmaEndings.adjustAlignment({ karma: 4 });
            return enterPrison(st, reduced, secLevel, `Anda mengaku bersalah dan hakim meringankan hukuman sebanyak 30%.`);
          }
        },
        {
          label: `💵 Cuba Rasuah Pegawai (${Utils.formatMoney(bribeCost, s.countryId)})`,
          hint: `Berisiko! Peluang ~${Math.round(bribeWinChance * 100)}% (Indeks Keselamatan ${c.name}: ${safety}%)`,
          journalType: 'warning',
          customAction: (st) => {
            if (st.money < bribeCost) {
              return enterPrison(st, maxY, secLevel, 'Anda tiada wang cukup untuk merasuah dan terus disabitkan BERSALAH.');
            }
            st.money -= bribeCost;
            if (window.KarmaEndings) KarmaEndings.adjustAlignment({ karma: -22, notoriety: 14 });
            if (Utils.chance(bribeWinChance)) {
              GameState.addJournalEntry(`💵 Fail kes anda "hilang secara misteri" selepas bayaran bawah meja di ${c.name}!`, 'warning');
              return finishAcquittal(st, 'urus niaga gelap bawah meja');
            }
            const harsh = maxY + Utils.randInt(2, 4);
            return enterPrison(st, harsh, 'maximum', 'KANTOI MERASUAH! Hakim murka dan menambah pertuduhan rasuah!');
          }
        }
      ]
    };
  },

  enterPrisonState(s, crimeName, years, securityLevel = 'minimum', opts = {}) {
    this.ensureFields(s);
    const detentionType = opts.detentionType || (s.age < 18 ? 'juvenile' : 'prison');
    const isJuv = detentionType === 'juvenile';
    if (window.CharacterStatus) CharacterStatus.syncCharacterModeTransitions(s, 'enter_prison');
    if (!isJuv && window.AssetsEngine && (years >= 5 || securityLevel === 'maximum')) {
      AssetsEngine.handleCrimeAssetFreeze(s);
    }
    s.criminalRecord = (s.criminalRecord || 0) + 1;
    if (!isJuv) {
      s.job = null;
      if (s.education && (s.education.stage === 'university' || s.education.isStudying)) {
        s.education.isStudying = false;
        s.education.stage = 'done';
      }
    }
    s.fugitive.isFugitive = false;
    s.fugitive.recaptureRisk = 0;

    s.prison.inPrison = true;
    s.prison.detentionType = detentionType;
    s.prison.transferAt18 = Boolean(opts.transferAt18);
    s.prison.isLife = Boolean(opts.isLife);
    s.prison.isDeathPenalty = Boolean(opts.isDeathPenalty);
    s.prison.lawTierLabel = opts.lawTierLabel || null;
    s.prison.yearsLeft = Math.max(1, years);
    s.prison.originalSentence = Math.max(1, years);
    s.prison.yearsServed = 0;
    s.prison.totalServed = (s.prison.totalServed || 0) + years;
    s.prison.crimeName = crimeName;
    s.prison.securityLevel = securityLevel;
    s.prison.respect = Utils.clamp(s.prison.respect || 25, 10, 100);
    s.prison.behavior = Utils.clamp(65 - (securityLevel === 'maximum' ? 15 : 0), 20, 90);
    s.prison.gangName = null;

    GameState.adjustStats({ happiness: -22, health: -5 });
    const placeName = isJuv ? 'Sekolah Juvana' : `Penjara ${this.SECURITY_LABELS[securityLevel].name}`;
    if (window.KarmaEndings) {
      KarmaEndings.adjustAlignment({ stress: 18, notoriety: 10 });
      KarmaEndings.addHighlight(isJuv ? '🔒' : '⛓️', `Ditahan ${years} tahun di ${placeName} (${crimeName})`);
    }
    if (window.Dynasty) {
      const repHit = securityLevel === 'maximum' ? -22 : securityLevel === 'medium' ? -15 : -10;
      Dynasty.adjustReputation(repHit);
      const d = Dynasty.getData();
      if (d.familyReputation <= 25 && d.legacyStatus !== 'Tarnished') {
        Dynasty._tarnishLegacy(`Sabitan jenayah berat & tahanan (${crimeName})`, 0);
      }
    }
    GameState.save();
  },

  // --------------------------------------------------------------------------
  // 2. AKTIVITI PENJARA / SEKOLAH JUVANA
  // --------------------------------------------------------------------------
  doPrisonActivity(action) {
    const s = GameState.current;
    this.ensureFields(s);
    if (!s.prison.inPrison) return { ok: false, msg: 'Anda tidak berada dalam tahanan.' };
    const p = s.prison;
    const isJuv = p.detentionType === 'juvenile';

    if (action === 'appeal') {
      if ((s.year - (p.lastAppealYear || -99)) < 2) {
        return { ok: false, msg: 'Rayuan mahkamah hanya boleh difailkan sekali setiap 2 tahun!' };
      }
      const c = Utils.getCountry(s.countryId);
      const bonuses = window.Dynasty ? Dynasty.getBloodlineBonuses() : {};
      const cost = Utils.usdToLocal(Math.round(6500 * Math.max(0.45, c.salaryMultiplier || 0.7) * (1 - (bonuses.legalCostDiscount || 0))), s.countryId);
      if (s.money < cost) return { ok: false, msg: `Kos peguam rayuan ialah ${Utils.formatMoney(cost, s.countryId)}.` };
      s.money -= cost;
      p.lastAppealYear = s.year;
      const winChance = Math.min(0.55, 0.24 + (p.behavior / 350) + (s.stats.smarts / 500));
      if (Utils.chance(winChance)) {
        if (p.isDeathPenalty) {
          p.isDeathPenalty = false;
          p.yearsLeft = Math.max(15, Math.round(p.yearsLeft * 0.7));
          GameState.adjustStats({ happiness: 18 });
          GameState.addJournalEntry(`⚖️ RAYUAN BERJAYA! Hukuman mati diringankan kepada penjara ${p.yearsLeft} tahun.`, 'milestone');
          GameState.save();
          return { ok: true, msg: `Rayuan berjaya! Hukuman mati diringankan kepada ${p.yearsLeft} tahun.` };
        }
        p.inPrison = false;
        p.yearsLeft = 0;
        GameState.adjustStats({ happiness: 24 });
        if (window.KarmaEndings) KarmaEndings.addHighlight('⚖️', 'Berjaya memenangi rayuan dan dibebaskan daripada tahanan');
        GameState.addJournalEntry('⚖️ RAYUAN BERJAYA! Mahkamah Rayuan membatalkan sabitan anda dan anda dibebaskan hari ini!', 'milestone');
        GameState.save();
        return { ok: true, msg: 'Rayuan DILULUSKAN! Anda dibebaskan serta-merta!' };
      }
      GameState.adjustStats({ happiness: -8 });
      GameState.addJournalEntry('⚖️ Mahkamah Rayuan menolak permohonan anda. Anda perlu menunggu 2 tahun sebelum memfailkan rayuan lagi.', 'warning');
      GameState.save();
      return { ok: false, msg: 'Rayuan ditolak oleh hakim.' };
    }

    if (action === 'parole') {
      const reqServed = Math.max(1, Math.ceil((p.originalSentence || 2) * 0.5));
      if ((p.yearsServed || 0) < reqServed) {
        return { ok: false, msg: `Parol hanya dibuka selepas menjalani sekurang-kurangnya 50% hukuman (${p.yearsServed}/${reqServed} tahun).` };
      }
      if (s.yearlyActions.prisonParole) return { ok: false, msg: 'Anda sudah memohon parol tahun ini.' };
      s.yearlyActions.prisonParole = true;
      const chance = Math.min(0.90, Math.max(0.10, (p.behavior / 115) + (Math.max(0, s.alignment.karma) / 350)));
      if (Utils.chance(chance)) {
        p.inPrison = false;
        p.yearsLeft = 0;
        GameState.adjustStats({ happiness: 20 });
        GameState.addJournalEntry('🔓 PAROL DILULUSKAN! Rekod kelakuan baik anda meyakinkan lembaga parol untuk membebaskan anda lebih awal.', 'milestone');
        GameState.save();
        return { ok: true, msg: 'Parol DILULUSKAN! Anda kini bebas!' };
      }
      GameState.adjustStats({ happiness: -6 });
      GameState.addJournalEntry('⛓️ Permohonan parol ditolak — tingkatkan Rekod Kelakuan anda.', 'warning');
      GameState.save();
      return { ok: false, msg: 'Parol ditolak tahun ini.' };
    }

    const actKey = 'prison_' + action;
    if (s.yearlyActions[actKey]) return { ok: false, msg: 'Anda sudah melakukan aktiviti tahanan ini tahun ini.' };
    s.yearlyActions[actKey] = true;

    if (action === 'good_behavior') {
      p.behavior = Utils.clamp((p.behavior || 60) + Utils.randInt(10, 16), 0, 100);
      if (window.KarmaEndings) KarmaEndings.adjustAlignment({ karma: 5, stress: -6 });
      GameState.adjustStats({ happiness: 5 });
      if (p.yearsLeft >= 1 && !p.isDeathPenalty && Utils.chance(0.38 + (p.behavior / 300))) {
        p.yearsLeft = Math.max(0, p.yearsLeft - 1);
        if (p.yearsLeft <= 0) {
          this.releaseFromDetention(s, `😇 Kelakuan baik anda diiktiraf — anda dibebaskan awal dari ${isJuv ? 'Sekolah Juvana' : 'Penjara'}!`);
          return { ok: true, msg: 'Kelakuan cemerlang! Anda dibebaskan awal!' };
        }
        GameState.addJournalEntry(`😇 Berkelakuan Baik di ${isJuv ? 'Sekolah Juvana' : 'Penjara'}: Pihak pengurusan berpuas hati dan mengurangkan tempoh tahanan anda sebanyak 1 tahun (baki ${p.yearsLeft} thn)!`, 'milestone');
        GameState.save();
        return { ok: true, msg: `Kelakuan cemerlang! Hukuman dikurangkan 1 tahun (baki ${p.yearsLeft} thn).` };
      }
      GameState.addJournalEntry(`😇 Anda mematuhi semua peraturan di ${isJuv ? 'Sekolah Juvana' : 'Penjara'} dan menunjukkan perubahan sikap yang positif.`);
      GameState.save();
      return { ok: true, msg: 'Rekod kelakuan baik meningkat!' };
    }

    if (action === 'gym') {
      p.respect = Utils.clamp(p.respect + Utils.randInt(7, 13), 0, 100);
      GameState.adjustStats({ health: 8, looks: 3, happiness: 5 });
      if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: -6 });
      GameState.addJournalEntry(`🏋️ Anda bersenam di halaman ${isJuv ? 'Sekolah Juvana' : 'Penjara'}! Kesihatan dan kecergasan meningkat.`);
      GameState.save();
      return { ok: true, msg: `Kesihatan +8% & Hormat Banduan kini ${p.respect}%!` };
    }

    if (action === 'library') {
      p.behavior = Utils.clamp(p.behavior + Utils.randInt(7, 13), 0, 100);
      GameState.adjustStats({ smarts: 7, happiness: 4 });
      if (window.KarmaEndings) KarmaEndings.adjustAlignment({ karma: 6, stress: -6 });
      GameState.addJournalEntry('📚 Anda tekun membaca buku undang-undang dan ilmu di Perpustakaan Penjara (Kepintaran +7%, Kelakuan +).');
      GameState.save();
      return { ok: true, msg: `Kepintaran +7% & Rekod Kelakuan kini ${p.behavior}%!` };
    }

    if (action === 'work') {
      const wage = Utils.usdToLocal(Utils.randInt(280, 620), s.countryId);
      s.money += wage;
      p.behavior = Utils.clamp(p.behavior + Utils.randInt(6, 11), 0, 100);
      if (window.KarmaEndings) KarmaEndings.adjustAlignment({ karma: 5 });
      GameState.addJournalEntry(`🧹 Anda bekerja di bengkel & dapur penjara: menerima upah ${Utils.formatMoney(wage, s.countryId)} & Rekod Kelakuan meningkat.`);
      GameState.save();
      return { ok: true, msg: `Upah ${Utils.formatMoney(wage, s.countryId)} & Kelakuan kini ${p.behavior}%!` };
    }

    if (action === 'gang') {
      if (!p.gangName) {
        p.gangName = Utils.pick(this.GANG_NAMES);
        p.respect = Utils.clamp(p.respect + 18, 0, 100);
        p.behavior = Utils.clamp(p.behavior - 14, 0, 100);
        if (window.KarmaEndings) KarmaEndings.adjustAlignment({ karma: -10, notoriety: 8 });
        GameState.addJournalEntry(`👊 Anda menyertai geng penjara "${p.gangName}"! Hormat Banduan melonjak tetapi Rekod Kelakuan merosot.`, 'warning');
        GameState.save();
        return { ok: true, msg: `Anda kini ahli ${p.gangName} (Hormat ${p.respect}%)!` };
      } else {
        p.respect = Utils.clamp(p.respect + 12, 0, 100);
        p.behavior = Utils.clamp(p.behavior - 10, 0, 100);
        const stash = Utils.usdToLocal(Utils.randInt(450, 1100), s.countryId);
        s.money += stash;
        if (window.KarmaEndings) KarmaEndings.adjustAlignment({ karma: -8 });
        GameState.addJournalEntry(`👊 Anda melaksanakan tugasan rahsia untuk ${p.gangName} dan menerima habuan ${Utils.formatMoney(stash, s.countryId)}.`, 'warning');
        GameState.save();
        return { ok: true, msg: `Misi ${p.gangName} selesai (+${Utils.formatMoney(stash, s.countryId)})!` };
      }
    }

    if (action === 'socialize') {
      if (Utils.chance(0.7)) {
        p.respect = Utils.clamp((p.respect || 0) + Utils.randInt(8, 14), 0, 100);
        GameState.adjustStats({ happiness: 6 });
        if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: -4 });
        GameState.addJournalEntry(`🤝 Anda berbual dan berkongsi cerita dengan ${isJuv ? 'rakan sebilik' : 'rakan sel'} — hubungan dalam tahanan semakin kukuh.`);
        GameState.save();
        return { ok: true, msg: 'Anda mendapat kenalan baharu di dalam tahanan.' };
      }
      p.behavior = Utils.clamp((p.behavior || 60) - 8, 0, 100);
      GameState.adjustStats({ health: -6, happiness: -5 });
      if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: 6 });
      GameState.addJournalEntry('👊 Perbualan bertukar tegang dan anda terlibat dalam pergelutan kecil dengan banduan lain.', 'warning');
      GameState.save();
      return { ok: false, msg: 'Perbualan bertukar menjadi pergelutan!' };
    }

    if (action === 'cell_fight') {
      p.behavior = Utils.clamp((p.behavior || 60) - 18, 0, 100);
      if (window.KarmaEndings) KarmaEndings.adjustAlignment({ karma: -10, stress: 8 });
      if (Utils.chance(0.4)) {
        p.respect = Utils.clamp((p.respect || 0) + 15, 0, 100);
        GameState.adjustStats({ health: -5 });
        GameState.addJournalEntry('🥊 Anda menang pergaduhan di sel — banduan lain kini menghormati dan menggeruni anda.', 'warning');
        GameState.save();
        return { ok: true, msg: 'Anda menang pergaduhan itu.' };
      }
      GameState.adjustStats({ health: -15, happiness: -10 });
      if (Utils.chance(0.5)) {
        const add = Utils.randInt(1, 2);
        p.yearsLeft += add;
        p.originalSentence = (p.originalSentence || 0) + add;
        GameState.addJournalEntry(`🚨 Pergaduhan di sel dihentikan warden. Anda cedera dan hukuman ditambah ${add} tahun!`, 'warning');
        GameState.save();
        return { ok: false, msg: `Cedera dan hukuman ditambah ${add} tahun!` };
      }
      GameState.addJournalEntry('🩹 Anda kalah dalam pergaduhan di sel dan cedera teruk.', 'warning');
      GameState.save();
      return { ok: false, msg: 'Anda kalah dan cedera teruk.' };
    }

    if (action === 'quick_escape') {
      const st = s.stats || {};
      const chance = Math.max(0.08, Math.min(0.4, 0.12 + ((st.health || 50) - 50) / 400 + ((st.smarts || 50) - 50) / 400 + (p.respect || 0) / 800));
      const won = Utils.chance(chance);
      const res = this.resolveEscapeResult(won);
      if (!won && window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: 6 });
      return res;
    }

    return { ok: false, msg: 'Aktiviti tidak dikenali.' };
  },

  // Bersihkan keadaan tahanan dan pulihkan akses dunia luar
  releaseFromDetention(s, journalMsg) {
    if (!s || !s.prison) return;
    s.prison.inPrison = false;
    s.prison.yearsLeft = 0;
    if ('detentionYearsLeft' in s) s.detentionYearsLeft = 0;
    GameState.adjustStats({ happiness: 18 });
    if (journalMsg) GameState.addJournalEntry(journalMsg, 'milestone');
    GameState.save();
  },

  // Peristiwa tahunan rawak di dalam penjara
  pickPrisonEvent(s) {
    if (!s.prison || !s.prison.inPrison || !Utils.chance(0.55)) return null;
    const p = s.prison;
    const events = [
      {
        id: 'pris_fight_' + s.age,
        icon: '🥊',
        title: 'Pergaduhan Di Dewan Makan Penjara!',
        text: 'Seorang banduan samseng merampas dulang makanan anda dan mencabar anda bergaduh di hadapan puluhan banduan lain!',
        choices: [
          {
            label: 'Lawan balik habis-habisan demi maruah!',
            hint: 'Hormat ++, Kelakuan --, risiko cedera',
            journalType: 'warning',
            customAction: () => {
              const win = Utils.chance(0.45 + (s.stats.health / 250) + (p.gangName ? 0.18 : 0));
              p.behavior = Utils.clamp(p.behavior - 14, 0, 100);
              if (win) {
                p.respect = Utils.clamp(p.respect + 18, 0, 100);
                GameState.adjustStats({ health: -8, happiness: 6 });
                return { outcome: 'Anda menumbangkannya! Seluruh blok kini menghormati anda (Hormat +18%).' };
              }
              GameState.adjustStats({ health: -18, happiness: -10 });
              return { outcome: 'Anda dibelasah teruk sebelum pengawal meleraikan pergaduhan (-18% Kesihatan).' };
            }
          },
          {
            label: 'Bertenang & laporkan kepada pengawal penjara',
            hint: 'Kelakuan +, Hormat -- (dicop pembelot)',
            journalType: 'dilemma',
            customAction: () => {
              p.behavior = Utils.clamp(p.behavior + 10, 0, 100);
              p.respect = Utils.clamp(p.respect - 15, 0, 100);
              return { outcome: 'Pengawal memuji disiplin anda, tetapi beberapa banduan mula memandang sinis.' };
            }
          }
        ]
      },
      {
        id: 'pris_shakedown_' + s.age,
        icon: '🔦',
        title: 'Pemeriksaan Sel Mengejut (Shakedown)!',
        text: 'Warden mengarahkan pemeriksaan sel secara mengejut! Rakan sel anda merayu agar anda menyorokkan telefon seludup miliknya buat sementara.',
        choices: [
          {
            label: 'Tolong sorokkan barang seludup itu',
            hint: 'Hormat +, risiko hukuman tambahan jika kantoi',
            journalType: 'warning',
            customAction: () => {
              if (Utils.chance(0.42)) {
                p.yearsLeft += 1;
                p.behavior = Utils.clamp(p.behavior - 18, 0, 100);
                return { outcome: 'KANTOI! Warden menemui telefon itu di bawah tilam anda — hukuman ditambah +1 tahun!' };
              }
              p.respect = Utils.clamp(p.respect + 14, 0, 100);
              return { outcome: 'Selamat! Pengawal tidak menjumpainya dan rakan sel anda terhutang budi besar.' };
            }
          },
          {
            label: 'Enggan terlibat & jaga rekod bersih sendiri',
            hint: 'Selamat, Kelakuan +',
            journalType: 'normal',
            customAction: () => {
              p.behavior = Utils.clamp(p.behavior + 8, 0, 100);
              p.respect = Utils.clamp(p.respect - 6, 0, 100);
              return { outcome: 'Sel anda disahkan bersih tanpa barang larangan. Peluang parol kekal cerah.' };
            }
          }
        ]
      }
    ];
    return Utils.pick(events);
  },

  // --------------------------------------------------------------------------
  // 3. HASIL MINI-PERMAINAN LARI PENJARA & RUSUHAN
  // --------------------------------------------------------------------------
  resolveEscapeResult(won) {
    const s = GameState.current;
    this.ensureFields(s);
    const p = s.prison;

    if (won) {
      p.inPrison = false;
      p.yearsLeft = 0;
      if ('detentionYearsLeft' in s) s.detentionYearsLeft = 0;
      s.fugitive.isFugitive = true;
      s.fugitive.hiddenPast = false;
      s.fugitive.recaptureRisk = Utils.randInt(26, 35);
      s.fugitive.escapedFromCountryId = s.countryId;
      s.fugitive.smuggledAbroad = false;
      s.fugitive.hadPlasticSurgery = false;
      s.fugitive.fakeIdentityTier = null;

      GameState.adjustStats({ happiness: 22 });
      if (window.KarmaEndings) {
        KarmaEndings.adjustAlignment({ notoriety: 32, fame: 14, karma: -12, stress: 16 });
        KarmaEndings.addHighlight('🚨', `Berjaya meloloskan diri dari Penjara ${this.SECURITY_LABELS[p.securityLevel].name}!`);
      }
      if (window.Dynasty) {
        Dynasty.adjustReputation(-14);
        const d = Dynasty.getData();
        if (d.familyReputation <= 30 && d.legacyStatus !== 'Tarnished') {
          Dynasty._tarnishLegacy('Menjadi pelarian buruan polis selepas meloloskan diri dari penjara', 0);
        }
      }
      GameState.addJournalEntry(
        `🚨 BOLOS BERJAYA! Anda melepasi pengawal dan kini berstatus PELARIAN (Risiko Dikesan: ${s.fugitive.recaptureRisk}%/thn)! Gunakan Akses Pasaran Gelap untuk terus hidup!`,
        'warning'
      );
      GameState.save();
      return { ok: true, msg: `BERJAYA BOLOS! Anda kini PELARIAN (Risiko Dikesan ${s.fugitive.recaptureRisk}%).` };
    } else {
      const addYears = Utils.randInt(2, 5);
      p.yearsLeft += addYears;
      p.originalSentence += addYears;
      p.totalServed = (p.totalServed || 0) + addYears;
      p.behavior = Utils.clamp(p.behavior - 22, 0, 100);
      if (p.securityLevel === 'minimum') p.securityLevel = 'medium';
      else if (p.securityLevel === 'medium' && Utils.chance(0.55)) p.securityLevel = 'maximum';

      GameState.adjustStats({ health: -12, happiness: -18 });
      if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: 18, notoriety: 10 });
      GameState.addJournalEntry(
        `⛓️ CUBAAAN LARI GAGAL! Anda diberkas pengawal, dihantar ke Kurungan Bersendirian & hukuman ditambah +${addYears} tahun (${this.SECURITY_LABELS[p.securityLevel].name})!`,
        'warning'
      );
      GameState.save();
      return { ok: false, msg: `Ditangkap! Kurungan Bersendirian & +${addYears} tahun hukuman!` };
    }
  },

  resolveRiotResult(won, collected, target) {
    const s = GameState.current;
    this.ensureFields(s);
    const p = s.prison;
    s.yearlyActions.prisonRiot = true;

    if (won) {
      p.respect = Utils.clamp(p.respect + 26, 0, 100);
      p.behavior = Utils.clamp(p.behavior - 25, 0, 100);
      if (window.KarmaEndings) KarmaEndings.adjustAlignment({ notoriety: 22, fame: 10, karma: -14 });
      if (window.Dynasty) Dynasty.adjustReputation(-8);

      // 42% peluang bonus bolos dalam kekecohan rusuhan!
      if (Utils.chance(0.42)) {
        this.resolveEscapeResult(true);
        GameState.addJournalEntry(
          `🔥 RUSUHAN BERJAYA (${collected}/${target} banduan)! Dalam kepulan asap dan kekecohan pengawal, anda turut berjaya MELOLOSKAN DIRI menjadi PELARIAN!`,
          'milestone'
        );
        GameState.save();
        return { ok: true, escaped: true, msg: 'RUSUHAN BERJAYA & ANDA BOLOS DALAM KEKECOHAN!' };
      }

      GameState.adjustStats({ happiness: 14 });
      if (window.KarmaEndings) KarmaEndings.addHighlight('🔥', `Mengetuai rusuhan besar penjara (${collected} banduan)`);
      GameState.addJournalEntry(
        `🔥 RUSUHAN BERJAYA (${collected}/${target} banduan)! Anda kini digelar legenda banduan di blok (Hormat ${p.respect}%)!`,
        'warning'
      );
      GameState.save();
      return { ok: true, escaped: false, msg: `RUSUHAN BERJAYA! Hormat Banduan melonjak ke ${p.respect}%!` };
    } else {
      const addYears = Utils.randInt(3, 6);
      const dmg = p.securityLevel === 'maximum' ? Utils.randInt(26, 40) : Utils.randInt(16, 28);
      p.yearsLeft += addYears;
      p.originalSentence += addYears;
      p.totalServed = (p.totalServed || 0) + addYears;
      p.behavior = Utils.clamp(p.behavior - 25, 0, 100);
      GameState.adjustStats({ health: -dmg, happiness: -20 });
      if (window.Dynasty) Dynasty.adjustReputation(-12);

      // Peluang kecil maut jika di Keselamatan Maksimum & kesihatan merosot ke 0
      if (s.stats.health <= 0) {
        s.alive = false;
        s.causeOfDeath = 'Terbunuh ketika rusuhan penjara dipatahkan';
        GameState.archiveCurrentLife();
      }

      GameState.addJournalEntry(
        `💥 RUSUHAN DIPATAHKAN (${collected}/${target})! Anda cedera parah (-${dmg}% Kesihatan), dimasukkan ke Kurungan Bersendirian & ditambah +${addYears} tahun hukuman!`,
        'warning'
      );
      GameState.save();
      return { ok: false, escaped: false, died: !s.alive, msg: `Rusuhan gagal! Cedera -${dmg}% & +${addYears} tahun hukuman!` };
    }
  },

  // --------------------------------------------------------------------------
  // 4. HIDUP DALAM PELARIAN (PASARAN GELAP: LARI LUAR NEGARA, PLASTIK, IDENTITI PALSU)
  // --------------------------------------------------------------------------
  tickFugitiveYear(s) {
    this.ensureFields(s);
    const f = s.fugitive;
    if (!f.isFugitive) return;

    const riskProb = Utils.clamp(f.recaptureRisk || 25, 2, 90) / 100;
    if (Utils.chance(riskProb)) {
      const extraYears = Utils.randInt(4, 8);
      f.isFugitive = false;
      f.recaptureRisk = 0;
      GameState.addJournalEntry(
        `🚔 BURUAN TAMAT! Polis berjaya menjejaki lokasi persembunyian anda! Anda ditangkap semula dan dihantar terus ke Penjara Keselamatan Maksimum (${extraYears} tahun)!`,
        'warning'
      );
      this.enterPrisonState(s, 'Melarikan Diri Dari Tahanan (Pelarian)', extraYears, 'maximum');
    } else {
      GameState.addJournalEntry(
        `🕶️ Tahun berlalu dalam pelarian... Anda kekal berwaspada (Risiko Dikesan Polis: ${f.recaptureRisk}%).`,
        'dilemma'
      );
    }
  },

  _checkHiddenPastSynergy(s) {
    const f = s.fugitive;
    if (f.isFugitive && f.smuggledAbroad && f.hadPlasticSurgery && f.fakeIdentityTier === 'pro') {
      f.isFugitive = false;
      f.hiddenPast = true;
      f.recaptureRisk = 0;
      if (window.KarmaEndings) {
        KarmaEndings.adjustAlignment({ stress: -22, notoriety: -45 });
        KarmaEndings.addHighlight('🕶️', `Berjaya menghilangkan jejak & memulakan IDENTITI BAHARU sebagai ${s.name}`);
      }
      GameState.adjustStats({ happiness: 24 });
      GameState.addJournalEntry(
        `🌟 IDENTITI BAHARU SEMPURNA! Gabungan hijrah haram, wajah baharu & dokumen gred profesional berjaya memadam jejak lama anda! Polis menghentikan buruan aktif dan anda kini boleh membina hidup baharu sebagai ${s.name}!`,
        'milestone'
      );
      return true;
    }
    return false;
  },

  smuggleAbroad(destCountryId) {
    const s = GameState.current;
    this.ensureFields(s);
    const f = s.fugitive;
    if (!f.isFugitive) return { ok: false, msg: 'Hanya untuk watak berstatus Pelarian!' };
    if (destCountryId === s.countryId) return { ok: false, msg: 'Pilih negara lain daripada lokasi semasa!' };

    const fromC = Utils.getCountry(s.countryId);
    const toC = Utils.getCountry(destCountryId);
    const costLocal = Utils.usdToLocal(Math.round(2600 + (toC.flightBaseUsd || 600)), s.countryId);
    if (s.money < costLocal) {
      return { ok: false, msg: `Penyeludup sempadan meminta ${Utils.formatMoney(costLocal, s.countryId)}.` };
    }
    s.money -= costLocal;

    // Risiko sekatan sempadan (14–22%)
    const borderRisk = Math.min(0.24, 0.12 + ((toC.safetyIndex || 70) / 800));
    if (Utils.chance(borderRisk)) {
      const yrs = Utils.randInt(4, 7);
      this.enterPrisonState(s, 'Cuba Menyeludup Keluar Negara Sebagai Pelarian', yrs, 'maximum');
      return { ok: false, caught: true, msg: `KANTOI DI SEMPADAN! Anda ditangkap imigresen dan dihantar ke Penjara Maksimum (${yrs} thn)!` };
    }

    // Tukar negara & mata wang
    s.money = Utils.convertMoney(s.money, fromC.id, toC.id);
    s.investments = Utils.convertMoney(s.investments || 0, fromC.id, toC.id);
    s.retirementFund = Utils.convertMoney(s.retirementFund || 0, fromC.id, toC.id);
    s.countryId = toC.id;
    s.city = Utils.pick(toC.cities);
    s.residencyStatus = 'Work Visa';
    s.yearsInCurrentCountry = 0;
    if (!s.countriesLivedIn.includes(toC.id)) s.countriesLivedIn.push(toC.id);
    if (s.culturalAdaptation[toC.id] == null) s.culturalAdaptation[toC.id] = 20;

    const drop = f.smuggledAbroad ? 4 : Utils.randInt(12, 15);
    f.smuggledAbroad = true;
    f.recaptureRisk = Math.max(4, (f.recaptureRisk || 25) - drop);
    GameState.addJournalEntry(
      `🚤 BERHIJRAH SECARA HARAM! Anda menyusup masuk ke ${s.city}, ${toC.name} ${toC.flag}! Risiko Dikesan Polis turun -${drop}% (kini ${f.recaptureRisk}%).`,
      'migration'
    );
    const cleared = this._checkHiddenPastSynergy(s);
    GameState.save();
    return {
      ok: true,
      msg: cleared
        ? `IDENTITI BAHARU AKTIF di ${toC.name}! Buruan polis tamat!`
        : `Berjaya lolos ke ${toC.name} ${toC.flag}! Risiko dikesan turun ke ${f.recaptureRisk}%.`
    };
  },

  doPlasticSurgery(tier = 'alley') {
    const s = GameState.current;
    this.ensureFields(s);
    const f = s.fugitive;
    if (!f.isFugitive) return { ok: false, msg: 'Hanya untuk watak berstatus Pelarian!' };

    const isElite = tier === 'elite';
    const costLocal = Utils.usdToLocal(isElite ? 16000 : 2400, s.countryId);
    if (s.money < costLocal) {
      return { ok: false, msg: `Kos pembedahan plastik ini ialah ${Utils.formatMoney(costLocal, s.countryId)}.` };
    }
    s.money -= costLocal;

    const failChance = isElite ? 0.12 : 0.40;
    if (Utils.chance(failChance)) {
      GameState.adjustStats({ looks: -18, health: -12, happiness: -14 });
      if (!isElite && Utils.chance(0.45)) {
        f.recaptureRisk = Math.min(85, (f.recaptureRisk || 25) + 14);
        GameState.addJournalEntry('🏥 PEMBEDAHAN GAGAL & BOCOR! Doktor lorong gelap merosakkan wajah anda dan membocorkan maklumat lokasi kepada polis (+14% Risiko Dikesan)!', 'warning');
      } else {
        GameState.addJournalEntry('🏥 PEMBEDAHAN PLASTIK GAGAL! Komplikasi serius menjejaskan penampilan (-18%) dan kesihatan (-12%) anda!', 'warning');
      }
      GameState.save();
      return { ok: false, msg: 'Pembedahan plastik GAGAL! Penampilan & Kesihatan terjejas teruk!' };
    }

    const firstTime = !f.hadPlasticSurgery;
    f.hadPlasticSurgery = true;
    f.avatarOverride = s.gender === 'female' ? '🕵️‍♀️' : '🕵️‍♂️';
    GameState.adjustStats({ looks: isElite ? 14 : 6, happiness: 10 });
    if (firstTime) {
      f.recaptureRisk = Math.max(3, Math.round((f.recaptureRisk || 25) * 0.5));
    }
    GameState.addJournalEntry(
      `🎭 TUKAR WAJAH BERJAYA (${isElite ? 'Klinik Rahsia Elit' : 'Klinik Haram'})! Wajah anda berubah sepenuhnya dan Risiko Dikesan Polis jatuh mendadak ke ${f.recaptureRisk}%!`,
      'milestone'
    );
    const cleared = this._checkHiddenPastSynergy(s);
    GameState.save();
    return {
      ok: true,
      msg: cleared
        ? 'Wajah berubah & IDENTITI BAHARU AKTIF! Buruan polis tamat!'
        : `Tukar wajah berjaya! Risiko dikesan kini ${f.recaptureRisk}%.`
    };
  },

  buyFakeIdentity(tier = 'cheap', customAlias = '') {
    const s = GameState.current;
    this.ensureFields(s);
    const f = s.fugitive;
    if (!f.isFugitive) return { ok: false, msg: 'Hanya untuk watak berstatus Pelarian!' };

    const isPro = tier === 'pro';
    const costLocal = Utils.usdToLocal(isPro ? 22000 : 2800, s.countryId);
    if (s.money < costLocal) {
      return { ok: false, msg: `Kos dokumen identiti ini ialah ${Utils.formatMoney(costLocal, s.countryId)}.` };
    }
    s.money -= costLocal;

    const newAlias = (customAlias && customAlias.trim())
      ? customAlias.trim()
      : Utils.generateName(s.countryId, s.gender);

    if (!f.trueName) f.trueName = s.name;
    f.aliasName = newAlias;
    f.fakeIdentityTier = tier;
    s.name = newAlias;

    if (isPro) {
      f.recaptureRisk = Math.max(2, (f.recaptureRisk || 25) - 20);
      GameState.addJournalEntry(
        `🪪 IDENTITI GRED PROFESIONAL! Anda kini memiliki pasport & rekod bersih atas nama samaran "${newAlias}"! Kerjaya normal dibuka semula (Risiko Dikesan: ${f.recaptureRisk}%).`,
        'milestone'
      );
    } else {
      f.recaptureRisk = Math.max(5, (f.recaptureRisk || 25) - 9);
      GameState.addJournalEntry(
        `🪪 DOKUMEN MURAHAN! Anda kini menggunakan nama samaran "${newAlias}", namun awas — dokumen murah ini berisiko gagal semakan latar belakang (Risiko Dikesan: ${f.recaptureRisk}%).`,
        'dilemma'
      );
    }

    const cleared = this._checkHiddenPastSynergy(s);
    GameState.save();
    return {
      ok: true,
      msg: cleared
        ? `IDENTITI BAHARU SEMPURNA sebagai ${newAlias}! Buruan polis tamat!`
        : `Nama samaran "${newAlias}" aktif (Risiko dikesan ${f.recaptureRisk}%).`
    };
  },

  // Peristiwa nadir 1.5% apabila hidup dengan IDENTITI BAHARU (Hidden Past)
  pickHiddenPastEvent(s) {
    if (!s.fugitive || !s.fugitive.hiddenPast || !Utils.chance(0.018)) return null;
    const hushCost = Utils.usdToLocal(8500, s.countryId);
    return {
      id: 'hidden_past_spotted_' + s.age,
      icon: '👁️',
      title: 'Kejutan Masa Silam: Seseorang Mengenali Anda!',
      text: `Ketika anda minum di sebuah kafe di ${s.city}, seorang kenalan lama daripada zaman penjara merenung wajah anda dan berbisik: "Aku tahu siapa kau sebenarnya, ${s.fugitive.trueName || s.name}..."`,
      choices: [
        {
          label: `💵 Bayar wang tutup mulut (${Utils.formatMoney(hushCost, s.countryId)})`,
          hint: 'Rahsia kekal selamat, wang berkurang',
          journalType: 'dilemma',
          customAction: (st) => {
            st.money -= hushCost;
            return { outcome: `Anda membayar ${Utils.formatMoney(hushCost, st.countryId)} dan dia berjanji melupakan pertemuan itu buat selamanya.` };
          }
        },
        {
          label: '🧊 Nafi sekeras-kerasnya & terus pergi',
          hint: '50% dia keliru dan pergi; 50% dia melapor polis!',
          journalType: 'warning',
          customAction: (st) => {
            if (Utils.chance(0.55)) {
              return { outcome: 'Keyakinan lakonan anda membuatkannya ragu-ragu dan meminta maaf kerana "tersalah orang"!' };
            }
            st.fugitive.hiddenPast = false;
            st.fugitive.isFugitive = true;
            st.fugitive.recaptureRisk = 28;
            return { outcome: 'Dia melaporkan anda kepada pihak berkuasa! Status PELARIAN kembali aktif (Risiko 28%)!' };
          }
        }
      ]
    };
  }
};
