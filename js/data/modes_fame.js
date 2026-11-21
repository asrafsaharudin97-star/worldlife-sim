/* ==========================================================================
   WorldLife — Mod Kemasyhuran & Kuasa: Mod Artis, Mod Pelakon & Mod Politik
   Bahasa Melayu
   ========================================================================== */

window.FameModes = {
  // --------------------------------------------------------------------------
  // 1. MOD ARTIS & MUZIK
  // --------------------------------------------------------------------------
  ARTIST_RANKS: [
    { id: 'indie', title: 'Artis Jalanan / Indie', reqSkill: 0, annualUsd: 9000 },
    { id: 'viral', title: 'Single / Pameran Viral', reqSkill: 28, annualUsd: 28000 },
    { id: 'label', title: 'Artis Kontrak Rakaman', reqSkill: 52, annualUsd: 68000 },
    { id: 'arena', title: 'Bintang Jelajah Arena', reqSkill: 76, annualUsd: 165000 },
    { id: 'icon', title: 'Ikon Budaya Abadi', reqSkill: 92, annualUsd: 340000 }
  ],

  startArtist() {
    const s = GameState.current;
    GameState.ensureUpgradedState();
    if (s.prison.inPrison) return { ok: false, msg: 'Anda di penjara!' };
    if (s.age < 15) return { ok: false, msg: 'Tunggu umur 15 tahun untuk memulakan perjalanan sebagai Artis!' };
    if (s.modes.artist.active) return { ok: false, msg: 'Anda sudah bergiat dalam Mod Artis!' };

    s.modes.artist.active = true;
    s.modes.artist.rankIndex = 0;
    s.modes.artist.skill = Math.max(12, Math.round((s.stats.smarts + s.stats.looks) / 6));
    KarmaEndings.markModeVisited('artist');
    KarmaEndings.addHighlight('🎵', 'Memulakan kerjaya seni sebagai Artis Jalanan / Indie');
    GameState.addJournalEntry('🎵 Anda memulakan perjalanan dalam Mod Artis & Muzik sebagai Artis Jalanan / Indie!', 'milestone');
    GameState.save();
    return { ok: true, msg: 'Mod Artis dibuka!' };
  },

  _checkArtistPromo(s) {
    const a = s.modes.artist;
    while (a.rankIndex < this.ARTIST_RANKS.length - 1 && a.skill >= this.ARTIST_RANKS[a.rankIndex + 1].reqSkill) {
      a.rankIndex += 1;
      const r = this.ARTIST_RANKS[a.rankIndex];
      KarmaEndings.adjustAlignment({ fame: 14 });
      KarmaEndings.addHighlight('🎵', `Mencapai tahap ${r.title} dalam dunia seni`);
      GameState.addJournalEntry(`🌟 TAHAP ARTIS BARU! Anda kini bergelar ${r.title}!`, 'milestone');
    }
  },

  artistAction(action) {
    const s = GameState.current;
    GameState.ensureUpgradedState();
    const a = s.modes.artist;
    if (!a.active) return { ok: false, msg: 'Aktifkan Mod Artis dahulu!' };
    if (s.prison.inPrison) return { ok: false, msg: 'Tidak boleh berkarya dari penjara.' };
    if (s.yearlyActions.artistAct) return { ok: false, msg: 'Anda sudah menjalankan aktiviti seni utama tahun ini.' };
    s.yearlyActions.artistAct = true;

    const mult = 1 + a.rankIndex * 0.7;

    if (action === 'release') {
      const hitChance = 0.25 + (a.skill / 220) + (s.stats.smarts / 350);
      const isHit = Utils.chance(hitChance);
      a.releases = (a.releases || 0) + 1;
      a.skill = Utils.clamp(a.skill + Utils.randInt(10, 18), 0, 100);
      const royaltiesUsd = Math.round((isHit ? Utils.randInt(14000, 42000) : Utils.randInt(2500, 8000)) * mult * (a.contractType === 'predatory' ? 0.55 : 1));
      const localPay = Utils.usdToLocal(royaltiesUsd, s.countryId);
      s.money += localPay;
      if (isHit) {
        s.socialMedia.followers += Utils.randInt(15000, 65000);
        KarmaEndings.adjustAlignment({ fame: 16, stress: 8 });
        GameState.adjustStats({ happiness: 14 });
        if (Utils.chance(0.42)) {
          a.awards = (a.awards || 0) + 1;
          KarmaEndings.addHighlight('🏆', `Memenangi Anugerah Muzik/Seni (#${a.awards})`);
          GameState.addJournalEntry(`🏆 ANUGERAH BERPRESTIJ! Karya terbaru anda meletup di carta dan merangkul Anugerah Seni Tahun Ini (+${Utils.formatMoney(localPay, s.countryId)})!`, 'milestone');
        } else {
          GameState.addJournalEntry(`🔥 Karya/Single terbaru anda menjadi HIT! Royalti masuk ${Utils.formatMoney(localPay, s.countryId)}!`, 'milestone');
        }
      } else {
        KarmaEndings.adjustAlignment({ fame: 5, stress: 5 });
        GameState.addJournalEntry(`🎵 Anda melancarkan karya baru dan meraih ${Utils.formatMoney(localPay, s.countryId)}. Bakat anda semakin matang!`);
      }
      this._checkArtistPromo(s);
      GameState.save();
      return { ok: true, msg: isHit ? `Karya HIT! +${Utils.formatMoney(localPay, s.countryId)}` : `Karya dilancarkan (+${Utils.formatMoney(localPay, s.countryId)})` };
    }

    if (action === 'tour') {
      if (a.rankIndex < 1) return { ok: false, msg: 'Capai sekurang-kurangnya tahap Single Viral dahulu untuk jelajah konsert!' };
      const pay = Utils.usdToLocal(Math.round(Utils.randInt(18000, 52000) * mult), s.countryId);
      s.money += pay;
      a.skill = Utils.clamp(a.skill + 8, 0, 100);
      KarmaEndings.adjustAlignment({ fame: 14, stress: 16 });
      GameState.adjustStats({ health: -8, happiness: 10 });
      this._checkArtistPromo(s);
      GameState.addJournalEntry(`🎤 Jelajah konsert / pameran arena anda habis terjual! Meraih ${Utils.formatMoney(pay, s.countryId)}, namun badan keletihan (burnout).`, 'milestone');
      GameState.save();
      return { ok: true, msg: `Konsert habis terjual! +${Utils.formatMoney(pay, s.countryId)}` };
    }

    if (action === 'diss') {
      const dramaWin = Utils.chance(0.55);
      KarmaEndings.adjustAlignment({ fame: 16, karma: -12, stress: 14 });
      s.socialMedia.followers += Utils.randInt(18000, 55000);
      if (dramaWin) {
        const pay = Utils.usdToLocal(Math.round(9000 * mult), s.countryId);
        s.money += pay;
        GameState.addJournalEntry(`🔥 Lagu sindiran (Diss Track) anda terhadap pesaing tular seluruh negara! Strim melonjak (+${Utils.formatMoney(pay, s.countryId)}).`, 'dilemma');
      } else {
        const fine = Utils.usdToLocal(4500, s.countryId);
        s.money -= fine;
        GameState.adjustStats({ happiness: -10 });
        GameState.addJournalEntry(`⚖️ Pesaing anda memfailkan saman fitnah & plagiat! Anda rugi ${Utils.formatMoney(fine, s.countryId)} tetapi nama makin disebut ramai.`, 'warning');
      }
      GameState.save();
      return { ok: true, msg: dramaWin ? 'Diss track anda tular besar!' : 'Terjerat drama saman tetapi populariti naik!' };
    }

    return { ok: false, msg: 'Tindakan tidak sah.' };
  },

  // --------------------------------------------------------------------------
  // 2. MOD PELAKON & FILEM
  // --------------------------------------------------------------------------
  ACTOR_RANKS: [
    { id: 'extra', title: 'Pelakon Tambahan (Extra)', reqSkill: 0, annualUsd: 10000 },
    { id: 'commercial', title: 'Model & Iklan Komersial', reqSkill: 25, annualUsd: 26000 },
    { id: 'tv', title: 'Pelakon Siri TV Popular', reqSkill: 50, annualUsd: 72000 },
    { id: 'lead', title: 'Bintang Utama Filem', reqSkill: 74, annualUsd: 190000 },
    { id: 'global', title: 'Ikon Global / Pengarah', reqSkill: 92, annualUsd: 380000 }
  ],

  startActor() {
    const s = GameState.current;
    GameState.ensureUpgradedState();
    if (s.prison.inPrison) return { ok: false, msg: 'Anda di penjara!' };
    if (s.age < 15) return { ok: false, msg: 'Tunggu umur 15 tahun untuk menyertai Mod Pelakon!' };
    if (s.modes.actor.active) return { ok: false, msg: 'Anda sudah bergiat dalam Mod Pelakon!' };

    s.modes.actor.active = true;
    s.modes.actor.rankIndex = 0;
    s.modes.actor.skill = Math.max(12, Math.round(s.stats.looks / 3));
    KarmaEndings.markModeVisited('actor');
    KarmaEndings.addHighlight('🎬', 'Memulakan kerjaya lakonan sebagai Pelakon Tambahan');
    GameState.addJournalEntry('🎬 Anda melangkah ke dunia perfileman dalam Mod Pelakon sebagai Pelakon Tambahan!', 'milestone');
    GameState.save();
    return { ok: true, msg: 'Mod Pelakon dibuka!' };
  },

  _checkActorPromo(s) {
    const ac = s.modes.actor;
    while (ac.rankIndex < this.ACTOR_RANKS.length - 1 && ac.skill >= this.ACTOR_RANKS[ac.rankIndex + 1].reqSkill) {
      ac.rankIndex += 1;
      const r = this.ACTOR_RANKS[ac.rankIndex];
      KarmaEndings.adjustAlignment({ fame: 15 });
      KarmaEndings.addHighlight('🎬', `Naik taraf lakonan menjadi ${r.title}`);
      GameState.addJournalEntry(`🌟 BINTANG BARU! Anda kini diiktiraf sebagai ${r.title}!`, 'milestone');
    }
  },

  actorAction(action) {
    const s = GameState.current;
    GameState.ensureUpgradedState();
    const ac = s.modes.actor;
    if (!ac.active) return { ok: false, msg: 'Aktifkan Mod Pelakon dahulu!' };
    if (s.prison.inPrison) return { ok: false, msg: 'Anda di penjara!' };
    if (s.yearlyActions.actorAct) return { ok: false, msg: 'Anda sudah melengkapkan projek lakonan utama tahun ini.' };
    s.yearlyActions.actorAct = true;

    const mult = 1 + ac.rankIndex * 0.75;

    if (action === 'audition') {
      const passChance = Math.min(0.88, 0.42 + (s.stats.looks / 240) + (ac.skill / 220));
      if (Utils.chance(passChance)) {
        const pay = Utils.usdToLocal(Math.round(Utils.randInt(9000, 32000) * mult), s.countryId);
        s.money += pay;
        ac.skill = Utils.clamp(ac.skill + Utils.randInt(12, 20), 0, 100);
        ac.films = (ac.films || 0) + 1;
        KarmaEndings.adjustAlignment({ fame: 12, stress: 7 });
        GameState.adjustStats({ happiness: 12 });
        if (ac.rankIndex >= 2 && Utils.chance(0.35)) {
          ac.awards = (ac.awards || 0) + 1;
          KarmaEndings.addHighlight('🏆', `Memenangi Anugerah Pelakon Terbaik (#${ac.awards})`);
          GameState.addJournalEntry(`🏆 TROFI FILEM! Lakonan mantap anda merangkul Anugerah Pelakon Terbaik & bayaran ${Utils.formatMoney(pay, s.countryId)}!`, 'milestone');
        } else {
          GameState.addJournalEntry(`🎬 Lulus uji bakat dan membintangi produksi hebat! Bayaran: ${Utils.formatMoney(pay, s.countryId)}.`, 'milestone');
        }
        this._checkActorPromo(s);
        GameState.save();
        return { ok: true, msg: `Lulus uji bakat! +${Utils.formatMoney(pay, s.countryId)}` };
      } else {
        ac.skill = Utils.clamp(ac.skill + 4, 0, 100);
        GameState.adjustStats({ happiness: -6 });
        GameState.addJournalEntry('🎬 Uji bakat anda ditolak pengarah — "Maaf, kami cari wajah lain." Anda terus mengasah bakat.');
        GameState.save();
        return { ok: false, msg: 'Uji bakat ditolak — cuba lagi tahun depan!' };
      }
    }

    if (action === 'indie_challenge') {
      const pay = Utils.usdToLocal(Math.round(5000 * mult), s.countryId);
      s.money += pay;
      ac.skill = Utils.clamp(ac.skill + 18, 0, 100);
      KarmaEndings.adjustAlignment({ fame: 8, karma: 6, stress: 4 });
      GameState.adjustStats({ smarts: 4, happiness: 8 });
      this._checkActorPromo(s);
      GameState.addJournalEntry(`🎭 Anda mengambil watak berat filem indie untuk memecah stereotaip (typecasting)! Pengkritik memuji mutu lakonan anda (+${Utils.formatMoney(pay, s.countryId)}).`, 'culture');
      GameState.save();
      return { ok: true, msg: 'Dipuji pengkritik! Kemahiran lakonan melonjak!' };
    }

    if (action === 'pr_stunt') {
      KarmaEndings.adjustAlignment({ fame: 18, karma: -8, stress: 12 });
      s.socialMedia.followers += Utils.randInt(20000, 70000);
      GameState.addJournalEntry('📸 Gimik paparazi & gosip panas bersama rakan pelakon melonjakkan nama anda ke muka depan tabloid!', 'dilemma');
      GameState.save();
      return { ok: true, msg: 'Populariti meletup di media tabloid!' };
    }

    return { ok: false, msg: 'Tindakan tidak sah.' };
  },

  // --------------------------------------------------------------------------
  // 3. MOD POLITIK & KEPIMPINAN
  // --------------------------------------------------------------------------
  POLITIC_RANKS: [
    { id: 'activist', title: 'Aktivis Belia & Komuniti', reqApproval: 0, annualUsd: 16000 },
    { id: 'council', title: 'Ahli Majlis Tempatan', reqApproval: 35, annualUsd: 38000 },
    { id: 'mp', title: 'Ahli Parlimen / ADUN', reqApproval: 52, annualUsd: 78000 },
    { id: 'minister', title: 'Menteri Kabinet', reqApproval: 66, annualUsd: 135000 },
    { id: 'leader', title: 'Perdana Menteri / Presiden', reqApproval: 78, annualUsd: 240000 }
  ],

  startPolitic(faction = 'Reformasi Rakyat') {
    const s = GameState.current;
    GameState.ensureUpgradedState();
    if (s.prison.inPrison) return { ok: false, msg: 'Anda di penjara!' };
    if (s.age < 21) return { ok: false, msg: 'Umur minimum menyertai Mod Politik ialah 21 tahun.' };
    if (s.modes.politic.active) return { ok: false, msg: 'Anda sudah bergiat dalam Mod Politik!' };

    s.modes.politic.active = true;
    s.modes.politic.rankIndex = 0;
    s.modes.politic.approval = 42;
    s.modes.politic.faction = faction;
    if (window.CharacterStatus) CharacterStatus.recordPeakRole(s);
    KarmaEndings.markModeVisited('politic');
    KarmaEndings.adjustAlignment({ fame: 8 });
    KarmaEndings.addHighlight('🏛️', `Menyertai arena politik melalui kem ${faction}`);
    GameState.addJournalEntry(`🏛️ Anda menyertai arena politik bersama kem "${faction}" sebagai ${this.POLITIC_RANKS[0].title}!`, 'milestone');
    GameState.save();
    return { ok: true, msg: `Mod Politik dibuka (${faction})!` };
  },

  politicAction(action) {
    const s = GameState.current;
    GameState.ensureUpgradedState();
    const p = s.modes.politic;
    if (!p.active) return { ok: false, msg: 'Sertai Mod Politik dahulu!' };
    if (s.prison.inPrison) return { ok: false, msg: 'Anda di penjara!' };
    if (action === 'leave') {
      if (window.CharacterStatus) CharacterStatus.syncCharacterModeTransitions(s, 'leave_politic');
      else p.active = false;
      GameState.save();
      return { ok: true, msg: 'Anda telah meletak jawatan daripada arena politik.' };
    }
    if (s.yearlyActions.politicAct) return { ok: false, msg: 'Anda sudah menjalankan kempen/dasar utama tahun ini.' };
    s.yearlyActions.politicAct = true;

    if (action === 'campaign') {
      if (p.rankIndex >= this.POLITIC_RANKS.length - 1) return { ok: false, msg: 'Anda sudah berada di puncak kepimpinan negara!' };
      const cost = Utils.usdToLocal(1800 * (p.rankIndex + 1), s.countryId);
      if (s.money < cost) return { ok: false, msg: `Dana kempen pilihan raya memerlukan ${Utils.formatMoney(cost, s.countryId)}.` };
      s.money -= cost;

      const nextRank = this.POLITIC_RANKS[p.rankIndex + 1];
      const winChance = Math.min(0.88, Math.max(0.15, 0.35 + ((p.approval - nextRank.reqApproval) * 0.015) + (s.alignment.fame * 0.003) - (s.criminalRecord * 0.14)));
      if (Utils.chance(winChance)) {
        p.rankIndex += 1;
        p.approval = Utils.clamp(p.approval + 10, 0, 100);
        if (p.rankIndex >= 2 && window.CharacterStatus) {
          CharacterStatus.syncCharacterModeTransitions(s, 'enter_politic_office');
        } else if (window.CharacterStatus) {
          CharacterStatus.recordPeakRole(s);
        }
        KarmaEndings.adjustAlignment({ fame: 18, stress: 12 });
        KarmaEndings.addHighlight('🏛️', `Menang pilihan raya sebagai ${nextRank.title}`);
        GameState.adjustStats({ happiness: 20 });
        GameState.addJournalEntry(`🎉 KEMENANGAN PILIHAN RAYA! Rakyat memilih anda sebagai ${nextRank.title}!`, 'milestone');
        GameState.save();
        return { ok: true, msg: `Tahniah! Anda kini ${nextRank.title}!` };
      } else {
        p.approval = Utils.clamp(p.approval - 6, 5, 100);
        KarmaEndings.adjustAlignment({ stress: 10 });
        GameState.adjustStats({ happiness: -10 });
        GameState.addJournalEntry(`🗳️ Anda tewas tipis dalam persaingan merebut kerusi ${nextRank.title}. Bina sokongan rakyat lagi!`);
        GameState.save();
        return { ok: false, msg: `Tewas dalam pilihan raya ${nextRank.title}.` };
      }
    }

    if (action === 'clean_reform') {
      p.approval = Utils.clamp(p.approval + Utils.randInt(10, 16), 0, 100);
      p.policiesPassed = (p.policiesPassed || 0) + 1;
      KarmaEndings.adjustAlignment({ karma: 16, fame: 8, stress: 6 });
      GameState.adjustStats({ happiness: 10, smarts: 3 });
      GameState.addJournalEntry('🌿 Anda memperjuangkan dasar reformasi bersih, ketelusan tender dan kebajikan rakyat! Sokongan rakyat melonjak!', 'milestone');
      GameState.save();
      return { ok: true, msg: `Dasar bersih lulus! Sokongan rakyat kini ${p.approval}%.` };
    }

    if (action === 'media_debate') {
      const win = Utils.chance(0.45 + (s.stats.smarts / 220));
      if (win) {
        p.approval = Utils.clamp(p.approval + 12, 0, 100);
        KarmaEndings.adjustAlignment({ fame: 12, stress: 5 });
        GameState.addJournalEntry('🎙️ Hujah tajam anda dalam Debat Media Nasional memukau penonton seluruh negara!', 'milestone');
        GameState.save();
        return { ok: true, msg: `Menang debat! Sokongan kini ${p.approval}%.` };
      } else {
        p.approval = Utils.clamp(p.approval - 10, 5, 100);
        KarmaEndings.adjustAlignment({ stress: 12 });
        GameState.addJournalEntry('🎙️ Anda tersasul semasa Debat Media Nasional dan menjadi bahan meme warganet.', 'warning');
        GameState.save();
        return { ok: false, msg: `Tersasul di debat! Sokongan turun ke ${p.approval}%.` };
      }
    }

    if (action === 'dirty_lobby') {
      const bribe = Utils.usdToLocal(Utils.randInt(16000, 48000) * (p.rankIndex + 1), s.countryId);
      s.money += bribe;
      p.corruptionCount = (p.corruptionCount || 0) + 1;
      p.approval = Utils.clamp(p.approval - 8, 5, 100);
      KarmaEndings.adjustAlignment({ karma: -22, notoriety: 20, stress: 12 });
      GameState.setHiddenFlag('took_bribe');
      GameState.addJournalEntry(`💼 Anda menerima dana lobi korporat gelap bernilai ${Utils.formatMoney(bribe, s.countryId)} di sebalik tabir. Risiko siasatan rasuah meningkat!`, 'warning');
      GameState.save();
      return { ok: true, msg: `Dana lobi gelap +${Utils.formatMoney(bribe, s.countryId)} (risiko siasatan!).` };
    }

    return { ok: false, msg: 'Tindakan tidak sah.' };
  },

  // Peristiwa tahunan khusus Mod Artis / Pelakon / Politik
  pickFameModeEvent(s) {
    if (s.prison.inPrison) return null;

    if (s.modes.artist.active && !s.modes.artist.contractType && s.modes.artist.rankIndex >= 1 && Utils.chance(0.45)) {
      return {
        id: 'fm_artist_contract_' + s.age,
        icon: '📝',
        title: 'Tawaran Kontrak Syarikat Rakaman!',
        text: 'Dua syarikat rakaman menawarkan kontrak kepada anda: Syarikat Mega menawarkan pendahuluan tunai gergasi tetapi mengambil 45% royalti (kontrak eksploitasi), manakala Label Indie menawarkan royalti adil.',
        choices: [
          {
            label: 'Tandatangan Kontrak Mega (Tunai besar segera, royalti dipotong)',
            hint: 'Tunai +++, Populariti ++, royalti masa depan berkurang',
            journalType: 'dilemma',
            customAction: (st) => {
              const adv = Utils.usdToLocal(32000, st.countryId);
              st.money += adv;
              st.modes.artist.contractType = 'predatory';
              KarmaEndings.adjustAlignment({ fame: 18, stress: 12 });
              return { outcome: `Anda menerima pendahuluan ${Utils.formatMoney(adv, st.countryId)}, tetapi syarat kontrak yang ketat mula menekan kebebasan kreatif anda!` };
            }
          },
          {
            label: 'Pilih Kontrak Adil & Kekalkan Hak Cipta Sendiri',
            hint: 'Tunai sederhana, royalti penuh jangka panjang',
            journalType: 'milestone',
            customAction: (st) => {
              const adv = Utils.usdToLocal(8000, st.countryId);
              st.money += adv;
              st.modes.artist.contractType = 'fair';
              KarmaEndings.adjustAlignment({ fame: 8, karma: 6 });
              return { outcome: `Langkah bijak! Anda mengekalkan hak cipta penuh karya sendiri bersama dana ${Utils.formatMoney(adv, st.countryId)}.` };
            }
          }
        ]
      };
    }

    if (s.modes.politic.active && s.modes.politic.rankIndex >= 2 && (s.modes.politic.corruptionCount > 0 || Utils.chance(0.20))) {
      return {
        id: 'fm_politic_probe_' + s.age,
        icon: '🏛️',
        title: 'Krisis Politik: Siasatan Rasuah & Usul Undi Tidak Percaya!',
        text: 'Pihak pembangkang dan media melancarkan desakan siasatan terhadap rekod kepimpinan anda!',
        choices: [
          {
            label: 'Buka semua fail secara telus kepada jawatankuasa bebas',
            hint: s.modes.politic.corruptionCount > 0 ? 'BAHAYA jika pernah terima lobi kotor!' : 'Sokongan rakyat +++ jika bersih!',
            journalType: 'dilemma',
            customAction: (st) => {
              if ((st.modes.politic.corruptionCount || 0) === 0) {
                st.modes.politic.approval = Utils.clamp(st.modes.politic.approval + 20, 0, 100);
                KarmaEndings.adjustAlignment({ karma: 18, fame: 14, stress: -10 });
                return { outcome: 'Siasatan mengesahkan anda 100% BERSIH! Populariti dan penghormatan rakyat terhadap anda memuncak!' };
              } else {
                st.modes.politic.rankIndex = Math.max(0, st.modes.politic.rankIndex - 2);
                st.modes.politic.approval = 18;
                KarmaEndings.addHighlight('🏛️', 'Digugurkan jawatan selepas siasatan rasuah');
                return {
                  outcome: 'Bukti dana lobi gelap ditemui! Anda dipecat daripada jawatan dan didakwa di mahkamah!',
                  nextEvent: window.UnderworldModes.buildTrialEvent(st, 'Salah Guna Kuasa & Rasuah Politik', 4)
                };
              }
            }
          },
          {
            label: 'Gunakan pengaruh politik untuk menyekat siasatan',
            hint: 'Jawatan selamat sementara, Karma ---, Sokongan turun',
            journalType: 'warning',
            customAction: (st) => {
              st.modes.politic.approval = Utils.clamp(st.modes.politic.approval - 16, 5, 100);
              KarmaEndings.adjustAlignment({ karma: -22, notoriety: 18, stress: 14 });
              return { outcome: 'Siasatan berjaya ditutup secara senyap, namun rakyat semakin hilang kepercayaan terhadap anda.' };
            }
          }
        ]
      };
    }

    return null;
  }
};
