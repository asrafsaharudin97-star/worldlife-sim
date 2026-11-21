/* ==========================================================================
   WorldLife — Mod Dunia Bawah: Mod Jenayah, Mahkamah, Penjara & Mod Mafia
   Bahasa Melayu
   ========================================================================== */

window.UnderworldModes = {
  CRIME_OPS: [
    {
      id: 'petty_theft',
      name: 'Curi Kecil & Ragut Senyap',
      icon: '🥷',
      minAge: 15,
      minUsd: 250, maxUsd: 750,
      heat: 10, karma: -8,
      baseCatch: 0.24,
      sentence: 1,
      desc: 'Risiko rendah, hasil kecil tetapi masih menaikkan Haba Polis.'
    },
    {
      id: 'cyber_scam',
      name: 'Penipuan Siber & Phishing',
      icon: '💻',
      minAge: 17,
      reqSmarts: 55,
      minUsd: 2200, maxUsd: 8500,
      heat: 18, karma: -16,
      baseCatch: 0.30,
      sentence: 3,
      desc: 'Perlukan Kepintaran 55%+. Untung lumayan melalui godaman digital.'
    },
    {
      id: 'smuggling',
      name: 'Penyeludupan Kargo Pelabuhan',
      icon: '📦',
      minAge: 18,
      minUsd: 6500, maxUsd: 18500,
      heat: 24, karma: -20,
      baseCatch: 0.36,
      sentence: 5,
      desc: 'Operasi rentas sempadan — pulangan tinggi tetapi pengawasan kastam ketat.'
    },
    {
      id: 'bank_heist',
      name: 'Rompakan Bank / Bilik Kebal Berisiko Tinggi',
      icon: '🏦',
      minAge: 20,
      minUsd: 28000, maxUsd: 95000,
      heat: 36, karma: -32,
      baseCatch: 0.48,
      sentence: 8,
      desc: 'Sekali berjaya terus kaya raya — sekali kantoi, bertahun di tirai besi!'
    }
  ],

  MAFIA_RANKS: [
    { id: 'associate', title: 'Ahli Baru (Associate)', reqRespect: 0, annualUsd: 14000 },
    { id: 'soldier', title: 'Askar (Soldier)', reqRespect: 25, annualUsd: 32000 },
    { id: 'enforcer', title: 'Penguatkuasa (Enforcer)', reqRespect: 48, annualUsd: 62000 },
    { id: 'capo', title: 'Capo Wilayah', reqRespect: 70, annualUsd: 120000 },
    { id: 'underboss', title: 'Underboss', reqRespect: 86, annualUsd: 220000 },
    { id: 'godfather', title: 'Godfather / Ketua Sindiket', reqRespect: 96, annualUsd: 420000 }
  ],

  SYNDICATES: {
    MY: 'Kumpulan Naga Merah KL',
    SG: 'Sindiket Pelabuhan Timur',
    JP: 'Klan Kurokawa Yakuza',
    GB: 'Firma Bayangan London',
    US: 'Keluarga Moretti',
    AU: 'Kartel Dermaga Sydney',
    KR: 'Sindiket Malam Gangnam',
    ID: 'Jaringan Pelabuhan Nusantara',
    TH: 'Geng Lotus Emas Bangkok',
    AE: 'Konsortium Pasir Gelap'
  },

  // --------------------------------------------------------------------------
  // 1. OPERASI MOD JENAYAH
  // --------------------------------------------------------------------------
  commitCrimeOp(opId) {
    const s = GameState.current;
    GameState.ensureUpgradedState();
    if (s.prison.inPrison) return { ok: false, msg: 'Anda sedang menjalani hukuman di penjara!' };
    const op = this.CRIME_OPS.find(o => o.id === opId);
    if (!op) return { ok: false, msg: 'Operasi tidak dikenali.' };
    if (s.age < op.minAge) return { ok: false, msg: `Umur minimum ialah ${op.minAge} tahun.` };
    if (op.reqSmarts && s.stats.smarts < op.reqSmarts) return { ok: false, msg: `Perlukan sekurang-kurangnya ${op.reqSmarts}% Kepintaran.` };
    if (s.yearlyActions.crimeOp) return { ok: false, msg: 'Anda sudah melakukan operasi jenayah tahun ini — jaga-jaga dengan polis!' };

    s.yearlyActions.crimeOp = true;
    KarmaEndings.markModeVisited('crime');

    const strictCountries = ['SG', 'JP', 'KR', 'AE'];
    const countryMod = strictCountries.includes(s.countryId) ? 0.14 : 0;
    const heatMod = (s.alignment.notoriety || 0) * 0.0035;
    const smartsSave = (s.stats.smarts - 50) * 0.002;
    const catchProb = Math.max(0.12, Math.min(0.88, op.baseCatch + countryMod + heatMod - smartsSave));

    if (Utils.chance(catchProb)) {
      KarmaEndings.adjustAlignment({ notoriety: op.heat, karma: op.karma, stress: 16 });
      GameState.addJournalEntry(`🚔 POLIS MENYERBU! Anda diberkas semasa cubaan "${op.name}"!`, 'warning');
      GameState.save();
      return {
        ok: false,
        msg: `Diberkas polis semasa ${op.name}! Bersiap untuk perbicaraan mahkamah!`,
        followUpEvent: this.buildTrialEvent(s, op.name, op.sentence)
      };
    }

    const lootUsd = Utils.randInt(op.minUsd, op.maxUsd);
    const lootLocal = Utils.usdToLocal(lootUsd, s.countryId);
    s.money += lootLocal;
    s.modes.crime.opsSuccess += 1;
    if (op.id === 'bank_heist') s.modes.crime.heistsDone += 1;
    KarmaEndings.adjustAlignment({ notoriety: op.heat, karma: op.karma, stress: 8 });
    GameState.adjustStats({ happiness: 7 });
    if (op.id === 'bank_heist') {
      KarmaEndings.addHighlight('🏦', `Meloloskan diri dalam rompakan berisiko tinggi (${Utils.formatMoney(lootLocal, s.countryId)})`);
    }
    GameState.addJournalEntry(
      `${op.icon} Operasi "${op.name}" berjaya! Anda lolos dengan ${Utils.formatMoney(lootLocal, s.countryId)} (Haba Polis +${op.heat}%).`,
      'warning'
    );
    GameState.save();
    return { ok: true, msg: `Berjaya lolos dengan ${Utils.formatMoney(lootLocal, s.countryId)}!` };
  },

  // --------------------------------------------------------------------------
  // 2. MAHKAMAH & PENJARA (Peguam Murah vs Elit, Parol, Lari, Insaf)
  // --------------------------------------------------------------------------
  buildTrialEvent(s, crimeName, baseYears) {
    if (window.PrisonFugitive && PrisonFugitive.buildCourtTrialEvent) {
      return PrisonFugitive.buildCourtTrialEvent(s, crimeName, baseYears);
    }
    const privCost = Utils.usdToLocal(3500, s.countryId);
    const eliteCost = Utils.usdToLocal(18000, s.countryId);

    const runVerdict = (state, lawyerType, cost, winChance) => {
      if (cost > 0) state.money -= cost;
      if (Utils.chance(winChance)) {
        KarmaEndings.adjustAlignment({ notoriety: -10, stress: -6 });
        GameState.adjustStats({ happiness: 12 });
        return {
          outcome: `Peguam (${lawyerType}) berjaya mematahkan hujah pendakwa raya! Anda dibebaskan tanpa hukuman penjara!`,
          toastType: 'success'
        };
      } else {
        const years = Math.max(1, Math.round(baseYears * (lawyerType === 'Peguam Elit' ? 0.5 : lawyerType === 'Peguam Swasta' ? 0.75 : 1)));
        state.criminalRecord += 1;
        state.prison.inPrison = true;
        state.prison.yearsLeft = years;
        state.prison.totalServed = (state.prison.totalServed || 0) + years;
        state.prison.crimeName = crimeName;
        state.job = null;
        KarmaEndings.adjustAlignment({ stress: 20, notoriety: 8 });
        GameState.adjustStats({ happiness: -24, health: -6 });
        KarmaEndings.addHighlight('⛓️', `Dijatuhi hukuman penjara ${years} tahun (${crimeName})`);
        return {
          outcome: `BERSALAH! Hakim menjatuhkan hukuman penjara ${years} tahun atas kes "${crimeName}". Pintu tirai besi tertutup rapat di belakang anda.`,
          toastType: 'error'
        };
      }
    };

    return {
      id: 'court_trial_' + Date.now(),
      icon: '⚖️',
      title: 'Perbicaraan Mahkamah!',
      text: `Anda didakwa di mahkamah atas pertuduhan "${crimeName}" (ancaman hukuman ${baseYears} tahun penjara). Pilih pembelaan guaman anda!`,
      choices: [
        {
          label: '⚖️ Guna Peguam Awam Percuma',
          hint: 'Percuma, peluang bebas rendah (22%)',
          journalType: 'warning',
          customAction: (st) => runVerdict(st, 'Peguam Awam', 0, 0.22)
        },
        {
          label: `💼 Upah Peguam Swasta (${Utils.formatMoney(privCost, s.countryId)})`,
          hint: 'Peluang bebas sederhana (50%) atau hukuman dikurangkan',
          journalType: 'dilemma',
          customAction: (st) => {
            if (st.money < privCost) return runVerdict(st, 'Peguam Awam (Wang Tidak Cukup)', 0, 0.22);
            return runVerdict(st, 'Peguam Swasta', privCost, 0.50);
          }
        },
        {
          label: `👑 Upah Peguam Elit Ternama (${Utils.formatMoney(eliteCost, s.countryId)})`,
          hint: 'Peluang bebas sangat tinggi (78%)!',
          journalType: 'dilemma',
          customAction: (st) => {
            if (st.money < eliteCost) return runVerdict(st, 'Peguam Awam (Wang Tidak Cukup)', 0, 0.22);
            return runVerdict(st, 'Peguam Elit', eliteCost, 0.78);
          }
        }
      ]
    };
  },

  prisonAction(action) {
    const s = GameState.current;
    GameState.ensureUpgradedState();
    if (!s.prison.inPrison) return { ok: false, msg: 'Anda tidak berada di dalam penjara.' };
    if (s.yearlyActions.prisonAct) return { ok: false, msg: 'Anda sudah melakukan aktiviti penjara tahun ini.' };
    s.yearlyActions.prisonAct = true;

    if (action === 'rehab') {
      KarmaEndings.adjustAlignment({ karma: 18, notoriety: -12, stress: -10 });
      s.devotion = Utils.clamp((s.devotion || 40) + 12, 0, 100);
      GameState.adjustStats({ happiness: 8, smarts: 4 });
      if (s.prison.yearsLeft > 1 && Utils.chance(0.45)) {
        s.prison.yearsLeft -= 1;
        GameState.addJournalEntry('🕊️ Kelakuan terpuji dalam program pemulihan & keinsafan di penjara mengurangkan baki hukuman anda sebanyak 1 tahun!', 'spiritual');
        GameState.save();
        return { ok: true, msg: 'Keinsafan & kelakuan baik mengurangkan 1 tahun hukuman!' };
      }
      GameState.addJournalEntry('🕊️ Anda menyertai program pemulihan rohani & kemahiran di penjara. Karma anda meningkat ketara.', 'spiritual');
      GameState.save();
      return { ok: true, msg: 'Jiwa lebih tenang & Karma +18!' };
    }

    if (action === 'workout') {
      GameState.adjustStats({ health: 8, smarts: 5 });
      KarmaEndings.adjustAlignment({ stress: -5 });
      GameState.addJournalEntry('🏋️ Anda bersenam di halaman penjara dan membaca buku di perpustakaan sel.');
      GameState.save();
      return { ok: true, msg: 'Kesihatan & Kepintaran meningkat di penjara!' };
    }

    if (action === 'parole') {
      const chance = Math.min(0.80, 0.25 + (Math.max(0, s.alignment.karma) * 0.006));
      if (Utils.chance(chance)) {
        s.prison.inPrison = false;
        s.prison.yearsLeft = 0;
        KarmaEndings.adjustAlignment({ stress: -15 });
        GameState.adjustStats({ happiness: 18 });
        GameState.addJournalEntry('🔓 Permohonan parol anda DILULUSKAN! Anda dibebaskan awal dari penjara.', 'milestone');
        GameState.save();
        return { ok: true, msg: 'Parol diluluskan! Anda bebas!' };
      }
      GameState.adjustStats({ happiness: -6 });
      GameState.addJournalEntry('⛓️ Lembaga parol menolak permohonan pembebasan awal anda tahun ini.', 'warning');
      GameState.save();
      return { ok: false, msg: 'Permohonan parol ditolak tahun ini.' };
    }

    if (action === 'escape') {
      const chance = Math.min(0.48, 0.16 + (s.stats.smarts / 320));
      if (Utils.chance(chance)) {
        s.prison.inPrison = false;
        s.prison.yearsLeft = 0;
        KarmaEndings.adjustAlignment({ notoriety: 35, karma: -15, fame: 12 });
        KarmaEndings.addHighlight('🚨', 'Berjaya meloloskan diri dari penjara!');
        GameState.addJournalEntry('🚨 BOLOS PENJARA! Anda berjaya melarikan diri dari penjara! Nama anda kini menjadi buruan polis!', 'warning');
        GameState.save();
        return { ok: true, msg: 'Berjaya meloloskan diri! Haba Polis melonjak!' };
      } else {
        s.prison.yearsLeft += 2;
        s.prison.totalServed = (s.prison.totalServed || 0) + 2;
        GameState.adjustStats({ health: -12, happiness: -14 });
        KarmaEndings.adjustAlignment({ notoriety: 15, stress: 14 });
        GameState.addJournalEntry('🚔 Cubaan melarikan diri gagal! Anda ditangkap pengawal dan hukuman ditambah +2 tahun.', 'warning');
        GameState.save();
        return { ok: false, msg: 'Gagal melarikan diri! Hukuman ditambah +2 tahun.' };
      }
    }

    return { ok: false, msg: 'Tindakan tidak sah.' };
  },

  // --------------------------------------------------------------------------
  // 3. MOD MAFIA / SINDIKET
  // --------------------------------------------------------------------------
  joinMafia() {
    const s = GameState.current;
    GameState.ensureUpgradedState();
    if (s.prison.inPrison) return { ok: false, msg: 'Tidak boleh menyertai sindiket semasa dalam penjara.' };
    if (s.age < 18) return { ok: false, msg: 'Umur minimum untuk menyertai dunia sindiket ialah 18 tahun.' };
    if (s.modes.mafia.active) return { ok: false, msg: 'Anda sudah menjadi ahli sindiket!' };

    const synName = this.SYNDICATES[s.countryId] || 'Sindiket Bayangan';
    s.modes.mafia.active = true;
    s.modes.mafia.syndicateName = synName;
    s.modes.mafia.rankIndex = 0;
    s.modes.mafia.respect = 12;
    KarmaEndings.markModeVisited('mafia');
    KarmaEndings.adjustAlignment({ karma: -18, notoriety: 15, stress: 8 });
    KarmaEndings.addHighlight('🎩', `Mengangkat sumpah Omertà bersama ${synName}`);
    GameState.addJournalEntry(
      `🎩 Anda mengangkat sumpah setia (Omertà) dan menyertai ${synName} sebagai ${this.MAFIA_RANKS[0].title}!`,
      'warning'
    );
    GameState.save();
    return { ok: true, msg: `Anda kini ahli ${synName}!` };
  },

  _checkMafiaPromotion(s) {
    const m = s.modes.mafia;
    if (!m.active) return;
    while (m.rankIndex < this.MAFIA_RANKS.length - 1 && m.respect >= this.MAFIA_RANKS[m.rankIndex + 1].reqRespect) {
      m.rankIndex += 1;
      const r = this.MAFIA_RANKS[m.rankIndex];
      KarmaEndings.adjustAlignment({ fame: 8, notoriety: 10 });
      KarmaEndings.addHighlight('🎩', `Naik pangkat menjadi ${r.title} dalam ${m.syndicateName}`);
      GameState.addJournalEntry(`🎩 KENAIKAN PANGKAT SINDIKET! Anda kini bergelar ${r.title} dalam ${m.syndicateName}!`, 'milestone');
    }
  },

  mafiaAction(action) {
    const s = GameState.current;
    GameState.ensureUpgradedState();
    const m = s.modes.mafia;
    if (!m.active) return { ok: false, msg: 'Anda belum menyertai sindiket!' };
    if (s.prison.inPrison) return { ok: false, msg: 'Anda di penjara — tidak dapat jalankan operasi luar.' };
    if (action !== 'leave' && s.yearlyActions.mafiaAct) {
      return { ok: false, msg: 'Anda sudah menjalankan misi sindiket tahun ini.' };
    }

    const rankMult = 1 + m.rankIndex * 0.65;

    if (action === 'extort') {
      s.yearlyActions.mafiaAct = true;
      const earn = Utils.usdToLocal(Math.round(Utils.randInt(4500, 12000) * rankMult), s.countryId);
      s.money += earn;
      m.respect = Utils.clamp(m.respect + Utils.randInt(8, 14), 0, 100);
      KarmaEndings.adjustAlignment({ karma: -14, notoriety: 14, stress: 6 });
      this._checkMafiaPromotion(s);
      GameState.addJournalEntry(`💼 Mengutip wang perlindungan untuk ${m.syndicateName}: meraih ${Utils.formatMoney(earn, s.countryId)} (+Hormat).`, 'warning');
      GameState.save();
      return { ok: true, msg: `Kutip ${Utils.formatMoney(earn, s.countryId)} & Hormat meningkat!` };
    }

    if (action === 'launder') {
      s.yearlyActions.mafiaAct = true;
      const earn = Utils.usdToLocal(Math.round(Utils.randInt(7000, 18000) * rankMult), s.countryId);
      s.money += earn;
      m.respect = Utils.clamp(m.respect + Utils.randInt(7, 12), 0, 100);
      KarmaEndings.adjustAlignment({ karma: -16, notoriety: -6, stress: 8 });
      this._checkMafiaPromotion(s);
      GameState.addJournalEntry(`🏦 Menguruskan pengubahan wang haram melalui perniagaan proksi: meraih ${Utils.formatMoney(earn, s.countryId)} & mengurangkan Haba Polis.`, 'dilemma');
      GameState.save();
      return { ok: true, msg: `Berjaya cuci wang (+${Utils.formatMoney(earn, s.countryId)}, Haba Polis -6%)!` };
    }

    if (action === 'turf_war') {
      s.yearlyActions.mafiaAct = true;
      if (Utils.chance(0.32)) {
        GameState.adjustStats({ health: -22, happiness: -10 });
        KarmaEndings.adjustAlignment({ notoriety: 24, stress: 16 });
        GameState.addJournalEntry(`🔫 Perang wilayah ${m.syndicateName} bertukar berdarah! Anda cedera dan polis mengepung kawasan!`, 'warning');
        if (Utils.chance(0.45)) {
          GameState.save();
          return {
            ok: false,
            msg: 'Cedera & ditangkap dalam perang wilayah!',
            followUpEvent: this.buildTrialEvent(s, 'Perang Wilayah & Senjata Haram', 6)
          };
        }
        GameState.save();
        return { ok: false, msg: 'Anda cedera teruk dalam perang wilayah (-22% Kesihatan)!' };
      }
      const loot = Utils.usdToLocal(Math.round(Utils.randInt(14000, 32000) * rankMult), s.countryId);
      s.money += loot;
      m.respect = Utils.clamp(m.respect + Utils.randInt(16, 24), 0, 100);
      KarmaEndings.adjustAlignment({ karma: -24, notoriety: 22, fame: 6, stress: 12 });
      this._checkMafiaPromotion(s);
      GameState.addJournalEntry(`🔥 Kemenangan mutlak dalam Perang Wilayah! ${m.syndicateName} merampas kawasan baru & anda menerima ${Utils.formatMoney(loot, s.countryId)}!`, 'warning');
      GameState.save();
      return { ok: true, msg: `Menang Perang Wilayah (+${Utils.formatMoney(loot, s.countryId)})!` };
    }

    if (action === 'leave') {
      m.active = false;
      if (Utils.chance(0.55)) {
        GameState.adjustStats({ health: -18, happiness: -8 });
        KarmaEndings.adjustAlignment({ karma: 15, notoriety: -15, stress: 14 });
        GameState.addJournalEntry(`🚪 Anda meninggalkan ${m.syndicateName}! Sindiket tidak gembira — anda diserang sebagai amaran sebelum berjaya melarikan diri.`, 'warning');
        GameState.save();
        return { ok: true, msg: 'Keluar daripada sindiket dengan kecederaan amaran (-18% Kesihatan).' };
      }
      KarmaEndings.adjustAlignment({ karma: 18, notoriety: -18, stress: -10 });
      GameState.addJournalEntry(`🕊️ Anda berunding secara hormat dan berjaya bersara daripada ${m.syndicateName}.`, 'milestone');
      GameState.save();
      return { ok: true, msg: 'Berjaya meninggalkan sindiket dengan selamat!' };
    }

    return { ok: false, msg: 'Tindakan tidak sah.' };
  },

  // Peristiwa dramatik tahunan untuk dunia bawah (Federal raid / Omerta test)
  pickUnderworldEvent(s) {
    if (s.prison.inPrison) return null;
    if (s.alignment.notoriety >= 65 && Utils.chance(0.28)) {
      return {
        id: 'uw_fed_raid_' + s.age,
        icon: '🚔',
        title: 'Serbuan Pasukan Khas (Federal Takedown)!',
        text: `Haba Polis anda sudah melampaui batas (${s.alignment.notoriety}%)! Unit taktikal mengepung kediaman anda pada awal subuh!`,
        choices: [
          {
            label: 'Serah diri & hadapi perbicaraan di mahkamah',
            hint: 'Boleh guna peguam di mahkamah',
            journalType: 'warning',
            customAction: (st) => ({
              outcome: 'Anda menyerah diri dengan tangan di atas kepala.',
              nextEvent: this.buildTrialEvent(st, 'Operasi Jenayah Terancang', 6)
            })
          },
          {
            label: 'Bayar rasuah besar & larikan diri melalui laluan rahsia',
            hint: 'Wang ---, 50% peluang lolos',
            journalType: 'warning',
            customAction: (st) => {
              const bribe = Utils.usdToLocal(14000, st.countryId);
              st.money -= bribe;
              if (Utils.chance(0.52)) {
                KarmaEndings.adjustAlignment({ notoriety: -25, stress: 15, karma: -12 });
                return { outcome: `Anda hangus ${Utils.formatMoney(bribe, st.countryId)} tetapi berjaya lolos daripada serbuan dan menyejukkan Haba Polis!` };
              }
              return {
                outcome: 'Laluan rahsia anda sudah dikepung! Anda diberkas serta-merta!',
                nextEvent: this.buildTrialEvent(st, 'Melarikan Diri & Jenayah Terancang', 8)
              };
            }
          }
        ]
      };
    }

    if (s.modes.mafia.active && Utils.chance(0.24)) {
      return {
        id: 'uw_omerta_' + s.age,
        icon: '🎩',
        title: 'Ujian Kesetiaan Sindiket (Omertà)',
        text: `Ketua ${s.modes.mafia.syndicateName} mengesyaki ada ahli yang membocorkan maklumat kepada polis — dan anda diperintahkan menguruskan "masalah" itu untuk membuktikan kesetiaan.`,
        choices: [
          {
            label: 'Patuhi arahan tanpa banyak soal',
            hint: 'Hormat Sindiket +++, Karma ---, Haba Polis ++',
            journalType: 'warning',
            customAction: (st) => {
              st.modes.mafia.respect = Utils.clamp(st.modes.mafia.respect + 20, 0, 100);
              KarmaEndings.adjustAlignment({ karma: -24, notoriety: 18, stress: 14 });
              this._checkMafiaPromotion(st);
              return { outcome: 'Kesetiaan anda tidak lagi diragui. Pintu menuju kepimpinan tertinggi sindiket terbuka luas, tetapi jiwa anda makin gelap.' };
            }
          },
          {
            label: 'Bantu mangsa itu melarikan diri secara rahsia',
            hint: 'Karma ++, risiko dibongkar sindiket',
            journalType: 'dilemma',
            customAction: (st) => {
              if (Utils.chance(0.4)) {
                st.modes.mafia.respect = Math.max(0, st.modes.mafia.respect - 25);
                GameState.adjustStats({ health: -16 });
                return { outcome: 'Tindakan anda dihidu sindiket! Anda dipukul sebagai amaran keras dan hormat anda menjunam.' };
              }
              KarmaEndings.adjustAlignment({ karma: 16 });
              return { outcome: 'Anda berjaya menyelamatkan nyawanya tanpa dikesan sindiket. Sedikit sifat kemanusiaan masih hidup dalam diri anda.' };
            }
          }
        ]
      };
    }
    return null;
  }
};
