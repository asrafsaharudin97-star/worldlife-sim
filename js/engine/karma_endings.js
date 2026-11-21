/* ==========================================================================
   WorldLife — Sistem Karma, Ujian Takdir, Arka Cerita & Penamat Legasi
   Bahasa Melayu
   ========================================================================== */

window.KarmaEndings = {
  UNLOCKED_KEY: 'worldlife_unlocked_v1',

  // --------------------------------------------------------------------------
  // KATALOG 12 PENAMAT RAHSIA / ARKETAIP KEHIDUPAN
  // --------------------------------------------------------------------------
  ENDINGS_CATALOG: [
    {
      id: 'untouchable_godfather',
      title: 'Godfather Yang Tidak Tersentuh',
      icon: '🎩',
      desc: 'Menguasai puncak dunia sindiket tanpa pernah tumbang kepada undang-undang.',
      publicMemory: 'Namanya disebut dengan bisikan hormat dan gerun di lorong gelap serta bilik mesyuarat kuasa.'
    },
    {
      id: 'cancelled_viral_legend',
      title: 'Legenda Viral Terkena Cancel',
      icon: '📱',
      desc: 'Mencapai kemasyhuran internet yang meletup sebelum drama dan kontroversi mengubah segalanya.',
      publicMemory: 'Dokumentari mengenai jatuh bangun tularnya masih ditonton jutaan warganet.'
    },
    {
      id: 'peoples_reformer',
      title: 'Reformis Rakyat Berjiwa Besar',
      icon: '🏛️',
      desc: 'Memimpin politik dengan integriti tinggi dan meninggalkan dasar yang mengubah nasib rakyat.',
      publicMemory: 'Rakyat mengingatinya sebagai pemimpin bersih yang tidak pernah tunduk kepada rasuah.'
    },
    {
      id: 'corrupt_tyrant',
      title: 'Ahli Politik Licik & Kontroversi',
      icon: '💼',
      desc: 'Berkuasa di pentas politik melalui lobi gelap, strategi licik dan skandal yang mengejutkan.',
      publicMemory: 'Sejarah mencatat kebijaksanaannya berpolitik, namun dibayangi skandal dan dakwaan rasuah.'
    },
    {
      id: 'prisoner_turned_saint',
      title: 'Banduan Berubah Jadi Insan Mulia',
      icon: '🕊️',
      desc: 'Pernah jatuh ke penjara tetapi bangkit menebus dosa dan berakhir dengan karma mulia.',
      publicMemory: 'Kisah taubat dan kebangkitannya dijadikan inspirasi kepada ribuan jiwa yang hampir putus asa.'
    },
    {
      id: 'shadow_billionaire',
      title: 'Jutawan Bayangan',
      icon: '💰',
      desc: 'Mengumpul kekayaan luar biasa di sebalik tabir tanpa mengejar lampu sorot.',
      publicMemory: 'Hanya segelintir tahu betapa besarnya empayar kewangan yang dibinanya secara senyap.'
    },
    {
      id: 'cultural_art_icon',
      title: 'Ikon Seni & Muzik Abadi',
      icon: '🎵',
      desc: 'Mencipta karya agung yang menembusi zaman dan menyentuh jiwa jutaan peminat.',
      publicMemory: 'Lagu dan karyanya terus dimainkan di seluruh dunia meskipun jasadnya sudah tiada.'
    },
    {
      id: 'global_cinema_legend',
      title: 'Bintang Layar Perak Global',
      icon: '🎬',
      desc: 'Menakluk industri perfileman dunia dan merangkul pengiktirafan berprestij.',
      publicMemory: 'Filem-filem lakonannya kekal menjadi klasik yang dipelajari generasi pengarah baru.'
    },
    {
      id: 'underworld_outlaw',
      title: 'Penjenayah Licin Dunia Bawah',
      icon: '🕶️',
      desc: 'Hidup penuh adrenalin di pinggir undang-undang dengan rekod jenayah yang digeruni.',
      publicMemory: 'Kisah rompakan dan kejar-mengejar polisnya menjadi legenda bandar.'
    },
    {
      id: 'world_nomad',
      title: 'Pengembara Rentas Benua',
      icon: '🌍',
      desc: 'Menghayati kehidupan di pelbagai negara dan menyatukan budaya dunia dalam dirinya.',
      publicMemory: 'Pasportnya penuh cop kenangan daripada sahabat dan keluarga merentas benua.'
    },
    {
      id: 'spiritual_seeker',
      title: 'Pencari Makna & Jiwa Tenang',
      icon: '🌌',
      desc: 'Menempuh perjalanan rohani yang mendalam dan kekal tabah menghadapi ujian kehidupan.',
      publicMemory: 'Orang sekeliling mengenangnya sebagai jiwa yang damai, pemaaf dan penuh hikmah.'
    },
    {
      id: 'humble_soul',
      title: 'Jiwa Sederhana Penuh Berkat',
      icon: '✨',
      desc: 'Menjalani kehidupan yang jujur, penuh kasih sayang dan memberi makna kepada insan tersayang.',
      publicMemory: 'Walaupun tidak menghiasi dada akhbar, kehilangannya amat dirasai oleh keluarga dan sahabat.'
    }
  ],

  MODES_LIST: [
    { id: 'politics', name: 'Politik & Kepimpinan', icon: '🏛️' },
    { id: 'ceo', name: 'Usahawan & CEO', icon: '🏢' },
    { id: 'fund_manager', name: 'Jerung Pasaran', icon: '📈' },
    { id: 'celebrity', name: 'Selebriti & Konten', icon: '🌟' },
    { id: 'athlete', name: 'Atlet Pro & E-Sukan', icon: '🏆' },
    { id: 'social', name: 'Laman Sosial / Viral', icon: '📱' }
  ],

  // --------------------------------------------------------------------------
  // PENYELARASAN METER & REKOD SOROTAN HIDUP
  // --------------------------------------------------------------------------
  adjustAlignment(deltas = {}) {
    const s = GameState.current;
    if (!s) return;
    GameState.ensureUpgradedState();
    const a = s.alignment;
    if (deltas.karma) a.karma = Utils.clamp(a.karma + deltas.karma, -100, 100);
    if (deltas.fame) {
      a.fame = Utils.clamp(a.fame + deltas.fame, 0, 100);
      if (a.fame > (a.peakFame || 0)) a.peakFame = a.fame;
    }
    if (deltas.notoriety) a.notoriety = Utils.clamp(a.notoriety + deltas.notoriety, 0, 100);
    if (deltas.stress) {
      let d = deltas.stress;
      // Ketahanan jiwa/pegangan membantu mengurangkan lonjakan stres
      if (d > 0 && s.belief && s.belief !== 'unassigned') {
        const b = GameState.getBeliefObj(s.belief);
        const factor = Math.min(0.25, (b.resilienceBonus || 0.1) * ((s.devotion || 40) / 100));
        d = Math.max(1, Math.round(d * (1 - factor)));
      }
      a.stress = Utils.clamp(a.stress + d, 0, 100);
    }
  },

  addHighlight(icon, text) {
    const s = GameState.current;
    if (!s) return;
    GameState.ensureUpgradedState();
    s.highlights.push({ age: s.age, year: s.year, icon, text });
    if (s.highlights.length > 18) s.highlights = s.highlights.slice(-18);
  },

  markModeVisited(modeId) {
    const s = GameState.current;
    if (!s || !modeId) return;
    GameState.ensureUpgradedState();
    if (!s.modesVisited.includes(modeId)) s.modesVisited.push(modeId);
    const unlocked = this.getUnlocked();
    if (!unlocked.modes.includes(modeId)) {
      unlocked.modes.push(modeId);
      this._saveUnlocked(unlocked);
    }
  },

  getKarmaLabel(karma) {
    if (karma >= 55) return { text: 'Mulia & Berintegriti', color: '#16a34a', icon: '😇' };
    if (karma >= 15) return { text: 'Cenderung Baik', color: '#22c55e', icon: '🌿' };
    if (karma > -15) return { text: 'Seimbang / Kelabu', color: '#64748b', icon: '⚖️' };
    if (karma > -55) return { text: 'Licik & Berisiko', color: '#ea580c', icon: '🦊' };
    return { text: 'Korup / Gelap', color: '#dc2626', icon: '🔥' };
  },

  // --------------------------------------------------------------------------
  // ARKA CERITA BERBILANG TAHUN & PERISTIWA "WOW" (CLIFFHANGERS)
  // --------------------------------------------------------------------------
  pickKarmaOrArcEvent(s, c) {
    if (s.age < 15) return null;
    GameState.ensureUpgradedState();

    // 1. Sambung Arka Cerita yang sedang menunggu tahun susulan (Cliffhanger payoff!)
    const active = s.activeArcs || {};
    for (const [arcId, arcState] of Object.entries(active)) {
      if (!arcState || arcState.done) continue;
      if (s.age >= arcState.nextAge) {
        const ev = this._buildArcStepEvent(arcId, arcState, s, c);
        if (ev) return ev;
      }
    }

    // 2. Mula Arka Cerita "Wow" baharu (umur 19+, peluang terkawal)
    if (s.age >= 19 && Object.values(active).filter(a => a && !a.done).length < 2 && Utils.chance(0.14)) {
      const candidates = [];
      const am = s.activeSpecialMode;
      if (!active.mysterious_investor && s.age <= 55) candidates.push('mysterious_investor');
      if (!active.hidden_family_secret && s.age <= 65) candidates.push('hidden_family_secret');
      if (!active.undercover_informant && (s.alignment.notoriety >= 25 || (s.criminalRecord || 0) > 0 || (am && am.modeId === 'fund_manager'))) candidates.push('undercover_informant');
      if (!active.framed_for_crime && s.age >= 22 && s.age <= 60) candidates.push('framed_for_crime');
      if (!active.betrayal_attempt && (s.alignment.notoriety >= 45 || (am && am.rankIndex >= 2))) candidates.push('betrayal_attempt');
      if (!active.overnight_viral && s.age >= 16 && s.age <= 48) candidates.push('overnight_viral');

      if (candidates.length > 0) {
        const chosen = Utils.pick(candidates);
        s.activeArcs[chosen] = { step: 1, startAge: s.age, nextAge: s.age + 1, done: false, data: {} };
        return this._buildArcStepEvent(chosen, s.activeArcs[chosen], s, c);
      }
    }

    // 3. Ujian Karma (Good Path Trials vs Bad Path Escalation)
    if (s.age >= 18 && Utils.chance(0.16)) {
      if (s.alignment.karma >= 25) {
        return this._pickGoodPathTrial(s, c);
      }
      if (s.alignment.karma <= -25 || s.alignment.notoriety >= 35) {
        return this._pickBadPathTrial(s, c);
      }
    }

    return null;
  },

  _buildArcStepEvent(arcId, arc, s, c) {
    // --- ARKA 1: PELABUR MISTERI ---
    if (arcId === 'mysterious_investor') {
      if (arc.step === 1) {
        return {
          id: 'arc_inv_1_' + s.age,
          icon: '🕶️',
          title: 'Cliffhanger: Sampul Hitam Pelabur Misteri',
          text: `Satu sampul hitam mewah dihantar ke pintu rumah anda di ${s.city} tanpa nama pengirim. Di dalamnya ada kad emas bertulis: "Kami memerhatikan bakat anda. Temui kami malam ini — satu tawaran bakal mengubah hidup anda selamanya."`,
          choices: [
            {
              label: 'Hadiri pertemuan rahsia di tingkat teratas hotel',
              hint: 'Arka bersambung tahun depan — risiko & ganjaran gergasi!',
              journalType: 'dilemma',
              customAction: (st) => {
                arc.step = 2;
                arc.nextAge = st.age + Utils.randInt(1, 2);
                arc.data.accepted = true;
                KarmaEndings.adjustAlignment({ stress: 8 });
                KarmaEndings.addHighlight('🕶️', 'Menerima jemputan misteri daripada pelabur bayangan');
                return { outcome: 'Seorang tokoh misteri menawarkan modal besar untuk projek anda tanpa syarat jelas... Apa agenda sebenar mereka? Jawapannya bakal terbongkar tidak lama lagi!' };
              }
            },
            {
              label: 'Siasat latar belakang kad itu dahulu bersama rakan / peguam',
              hint: 'Pintar +, lebih berhati-hati',
              journalType: 'dilemma',
              customAction: (st) => {
                arc.step = 2;
                arc.nextAge = st.age + Utils.randInt(1, 2);
                arc.data.investigated = true;
                GameState.adjustStats({ smarts: 5 });
                return { outcome: 'Siasatan awal mengesan syarikat cengkerang luar pesisir... namun mereka masih berminat menghubungi anda semula.' };
              }
            },
            {
              label: 'Koyakkan kad & abaikan permainan orang misteri',
              hint: 'Selamat, Karma +, arka tamat',
              journalType: 'normal',
              customAction: () => {
                arc.done = true;
                KarmaEndings.adjustAlignment({ karma: 6, stress: -4 });
                return { outcome: 'Anda memilih ketenangan hidup daripada umpan yang terlalu mencurigakan.' };
              }
            }
          ]
        };
      }
      if (arc.step === 2) {
        arc.done = true;
        const isLegit = arc.data.investigated ? Utils.chance(0.72) : Utils.chance(0.50);
        return {
          id: 'arc_inv_2_' + s.age,
          icon: isLegit ? '💎' : '💣',
          title: isLegit ? 'Kejutan: Pelabur Misteri Rupanya Jutawan Dermawan!' : 'Plot Twist: Perangkap Pengubahan Wang Haram!',
          text: isLegit
            ? 'Pelabur misteri itu akhirnya mendedahkan identiti — seorang bilionair teknologi yang mencari rakan kongsi jujur untuk projek serantau!'
            : 'Rupa-rupanya pelabur misteri itu ialah sindiket kewangan gelap yang mahu menggunakan nama anda sebagai proksi pengubahan wang haram!',
          choices: isLegit ? [
            {
              label: 'Tandatangani kerjasama rasmi & lancarkan projek',
              hint: 'Tunai +++, Populariti ++, Karma +',
              journalType: 'milestone',
              customAction: (st) => {
                const payout = Utils.usdToLocal(Utils.randInt(35000, 95000), st.countryId);
                st.money += payout;
                KarmaEndings.adjustAlignment({ fame: 18, karma: 8 });
                GameState.adjustStats({ happiness: 22, smarts: 6 });
                KarmaEndings.addHighlight('💎', `Meraih kerjasama pelabur bilionair (${Utils.formatMoney(payout, st.countryId)})`);
                return { outcome: `Langkah berani anda membuahkan hasil luar biasa! Anda meraih ${Utils.formatMoney(payout, st.countryId)} dan melonjak ke radar tokoh korporat!` };
              }
            }
          ] : [
            {
              label: 'Bocor maklumat mereka kepada pihak berkuasa',
              hint: 'Karma +++, Haba Polis -, risiko ancaman',
              journalType: 'milestone',
              customAction: (st) => {
                const reward = Utils.usdToLocal(8000, st.countryId);
                st.money += reward;
                KarmaEndings.adjustAlignment({ karma: 22, fame: 10, stress: 12 });
                KarmaEndings.addHighlight('⚖️', 'Membongkar sindiket pelabur haram kepada pihak berkuasa');
                return { outcome: `Pihak berkuasa memuji keberanian anda dan memberi ganjaran perlindungan saksi ${Utils.formatMoney(reward, st.countryId)}!` };
              }
            },
            {
              label: 'Sertai permainan mereka demi wang cepat yang lumayan',
              hint: 'Tunai +++, Karma ---, Haba Polis +++',
              journalType: 'warning',
              setFlag: 'took_bribe',
              customAction: (st) => {
                const dirty = Utils.usdToLocal(Utils.randInt(45000, 110000), st.countryId);
                st.money += dirty;
                KarmaEndings.adjustAlignment({ karma: -28, notoriety: 30, stress: 16 });
                KarmaEndings.addHighlight('💵', 'Menerima wang haram daripada pelabur bayangan');
                return { outcome: `Akaun anda dibanjiri ${Utils.formatMoney(dirty, st.countryId)}, tetapi nama anda kini terikat dengan dunia gelap!` };
              }
            }
          ]
        };
      }
    }

    // --- ARKA 2: RAHSIA KELUARGA & WASIAT TERSEMBUNYI ---
    if (arcId === 'hidden_family_secret') {
      if (arc.step === 1) {
        return {
          id: 'arc_fam_1_' + s.age,
          icon: '🗝️',
          title: 'Cliffhanger: Peti Besi Rahsia Keluarga',
          text: 'Ketika mengemas barang lama keluarga, anda terjumpa sepucuk surat berdebu dan kunci peti deposit bank luar negara yang menyimpan rahsia besar tentang moyang anda!',
          choices: [
            {
              label: 'Ikuti petunjuk & buka peti deposit itu secara senyap',
              hint: 'Bongkar rahsia besar dalam 1–2 tahun lagi',
              journalType: 'dilemma',
              customAction: (st) => {
                arc.step = 2;
                arc.nextAge = st.age + Utils.randInt(1, 2);
                arc.data.secret = true;
                GameState.adjustStats({ smarts: 3 });
                return { outcome: 'Anda menyimpan kunci itu dengan teliti. Dokumen guaman memerlukan sedikit masa untuk disahkan — debaran semakin memuncak!' };
              }
            },
            {
              label: 'Kongsikan penemuan ini secara telus dengan ahli keluarga',
              hint: 'Karma +, hubungan keluarga erat, harta dikongsi',
              journalType: 'culture',
              customAction: (st) => {
                arc.step = 2;
                arc.nextAge = st.age + 1;
                arc.data.shared = true;
                KarmaEndings.adjustAlignment({ karma: 10 });
                st.relationships.filter(r => r.alive && r.category === 'family').forEach(r => {
                  r.closeness = Utils.clamp(r.closeness + 10);
                });
                return { outcome: 'Keluarga anda terkejut besar dan bersama-sama melantik peguam bagi menjejaki asal-usul peti besi tersebut.' };
              }
            }
          ]
        };
      }
      if (arc.step === 2) {
        arc.done = true;
        return {
          id: 'arc_fam_2_' + s.age,
          icon: '📜',
          title: 'Plot Twist: Isi Sebenar Peti Besi Keluarga!',
          text: 'Peti deposit akhirnya dibuka! Di dalamnya terdapat geran tanah bersejarah bernilai tinggi — BESERTA surat pengakuan bahawa ada waris rahsia lain yang tidak pernah diketahui sesiapa!',
          choices: [
            {
              label: 'Jejaki waris rahsia itu & bahagikan pusaka secara adil',
              hint: 'Karma +++, Tunai +, ketenangan hati',
              journalType: 'milestone',
              customAction: (st) => {
                const share = Utils.usdToLocal(Utils.randInt(14000, 32000), st.countryId);
                st.money += share;
                KarmaEndings.adjustAlignment({ karma: 22, stress: -8 });
                GameState.adjustStats({ happiness: 18 });
                KarmaEndings.addHighlight('📜', 'Menunaikan amanah wasiat rahsia keluarga secara adil');
                return { outcome: `Waris yang terpisah itu menangis terharu! Anda tetap menerima bahagian halal ${Utils.formatMoney(share, st.countryId)} bersama keberkatan jiwa.` };
              }
            },
            {
              label: 'Sorok surat pengakuan & bolot keseluruhan harta pusaka',
              hint: 'Tunai +++, Karma ---, risiko saman masa depan',
              journalType: 'warning',
              setFlag: 'took_bribe',
              customAction: (st) => {
                const full = Utils.usdToLocal(Utils.randInt(45000, 110000), st.countryId);
                st.money += full;
                KarmaEndings.adjustAlignment({ karma: -25, stress: 14 });
                KarmaEndings.addHighlight('🗝️', `Membolot harta pusaka rahsia (${Utils.formatMoney(full, st.countryId)})`);
                return { outcome: `Anda mengaut keseluruhan ${Utils.formatMoney(full, st.countryId)}, tetapi rahsia yang dibakar itu menghantui tidur anda.` };
              }
            }
          ]
        };
      }
    }

    // --- ARKA 3: DANIAYA / DIFITNAH JENAYAH ---
    if (arcId === 'framed_for_crime') {
      if (arc.step === 1) {
        return {
          id: 'arc_frame_1_' + s.age,
          icon: '🚨',
          title: 'Cliffhanger: Anda Difitnah Dalam Kes Penipuan Besar!',
          text: `Berita gempar! Seseorang telah memalsukan tandatangan digital anda dalam satu skandal kewangan besar di ${s.city}. Polis sudah membuka kertas siasatan terhadap anda!`,
          choices: [
            {
              label: 'Upah penyiasat persendirian & lawan di mahkamah',
              hint: 'Kos tinggi, peluang bersih nama & saman balas',
              journalType: 'dilemma',
              customAction: (st) => {
                const cost = Utils.usdToLocal(2200, st.countryId);
                st.money -= cost;
                arc.step = 2;
                arc.nextAge = st.age + 1;
                arc.data.mode = 'fight';
                KarmaEndings.adjustAlignment({ stress: 16, karma: 6 });
                return { outcome: `Anda melabur ${Utils.formatMoney(cost, st.countryId)} untuk mengumpul bukti forensik. Perbicaraan penentu akan berlangsung tahun hadapan!` };
              }
            },
            {
              label: 'Cari dalang sebenar melalui saluran dunia bawah',
              hint: 'Karma --, Haba Polis +, cara keras',
              journalType: 'warning',
              customAction: (st) => {
                arc.step = 2;
                arc.nextAge = st.age + 1;
                arc.data.mode = 'street';
                KarmaEndings.adjustAlignment({ karma: -14, notoriety: 18, stress: 12 });
                return { outcome: 'Anda menghubungi kenalan gelap untuk mengugut dalang sebenar. Keadaan menjadi semakin tegang!' };
              }
            }
          ]
        };
      }
      if (arc.step === 2) {
        arc.done = true;
        const cleared = arc.data.mode === 'fight' ? Utils.chance(0.75) : Utils.chance(0.60);
        return {
          id: 'arc_frame_2_' + s.age,
          icon: cleared ? '⚖️' : '⛓️',
          title: cleared ? 'Kebenaran Terbongkar: Nama Anda Dibersihkan!' : 'Tragedi: Sabitan Salah & Hukuman!',
          text: cleared
            ? 'Bukti rakaman CCTV dan jejak digital berjaya membuktikan anda tidak bersalah! Media memberi liputan meluas tentang kemenangan anda.'
            : 'Dalang sebenar berjaya memusnahkan bukti utama. Mahkamah menjatuhkan denda berat dan hukuman penjara terhadap anda!',
          choices: [
            {
              label: cleared ? 'Terima ganti rugi malu & teruskan hidup dengan megah' : 'Terima takdir & rancang kebangkitan dari sebalik tirai besi',
              hint: cleared ? 'Tunai ++, Populariti ++' : 'Penjara 2 tahun, Rekod Jenayah +',
              journalType: cleared ? 'milestone' : 'warning',
              customAction: (st) => {
                if (cleared) {
                  const comp = Utils.usdToLocal(Utils.randInt(12000, 28000), st.countryId);
                  st.money += comp;
                  KarmaEndings.adjustAlignment({ fame: 16, karma: 10, stress: -15 });
                  GameState.adjustStats({ happiness: 20 });
                  KarmaEndings.addHighlight('⚖️', 'Membersihkan nama daripada fitnah jenayah besar');
                  return { outcome: `Anda memenangi saman malu bernilai ${Utils.formatMoney(comp, st.countryId)} dan dihormati ramai!` };
                } else {
                  st.criminalRecord += 1;
                  st.prison.inPrison = true;
                  st.prison.yearsLeft = 2;
                  st.prison.totalServed = (st.prison.totalServed || 0) + 2;
                  st.prison.crimeName = 'Difitnah Dalam Skandal Kewangan';
                  st.job = null;
                  KarmaEndings.adjustAlignment({ stress: 22, notoriety: 15 });
                  GameState.adjustStats({ happiness: -24, health: -6 });
                  KarmaEndings.addHighlight('⛓️', 'Dipenjarakan akibat fitnah skandal kewangan');
                  return { outcome: 'Anda dihantar ke penjara selama 2 tahun walaupun tidak bersalah. Ini ujian paling berat dalam hidup anda.' };
                }
              }
            }
          ]
        };
      }
    }

    // --- ARKA 4: PEMBELOT / INFORMAN DALAM LINGKARAN ---
    if (arcId === 'undercover_informant') {
      if (arc.step === 1) {
        return {
          id: 'arc_rat_1_' + s.age,
          icon: '🕵️',
          title: 'Cliffhanger: Ada Informan Polis Dalam Lingkaran Anda!',
          text: 'Sumber rahsia membisikkan berita ngeri — salah seorang kenalan rapat dalam operasi anda rupa-rupanya memakai mikrofon tersembunyi untuk pihak berkuasa!',
          choices: [
            {
              label: 'Umpan maklumat palsu untuk memerangkap si pembelot',
              hint: 'Pintar ++, debaran bersambung tahun depan',
              journalType: 'warning',
              customAction: (st) => {
                arc.step = 2;
                arc.nextAge = st.age + 1;
                arc.data.plan = 'trap';
                KarmaEndings.adjustAlignment({ stress: 14 });
                return { outcome: 'Anda menyebarkan tiga versi maklumat berbeza. Tidak lama lagi siapa pengkhianat sebenar akan terjawab!' };
              }
            },
            {
              label: 'Bakar semua bukti & keluar daripada aktiviti gelap sementara',
              hint: 'Haba Polis --, rugi wang operasi',
              journalType: 'dilemma',
              customAction: (st) => {
                arc.done = true;
                const burn = Utils.usdToLocal(3500, st.countryId);
                st.money -= burn;
                KarmaEndings.adjustAlignment({ notoriety: -22, karma: 8, stress: -6 });
                return { outcome: `Anda memusnahkan semua jejak (${Utils.formatMoney(burn, st.countryId)} rugi) sebelum serbuan sempat berlaku.` };
              }
            }
          ]
        };
      }
      if (arc.step === 2) {
        arc.done = true;
        const caughtRat = Utils.chance(0.58 + (s.stats.smarts / 350));
        return {
          id: 'arc_rat_2_' + s.age,
          icon: caughtRat ? '🎯' : '🚔',
          title: caughtRat ? 'Pengkhianat Terperangkap!' : 'Serbuan Besar-Besaran Tengah Malam!',
          text: caughtRat
            ? 'Perangkap anda mengena! Pembelot itu gagal menjawab soalan dan identitinya terbongkar sebelum serbuan berlaku.'
            : 'Sudah terlambat! Pasukan khas merempuh masuk dengan waran tangkap berdasarkan rakaman informan!',
          choices: [
            {
              label: caughtRat ? 'Singkirkan dia daripada lingkaran & kunci keselamatan' : 'Hadapi pendakwaan di mahkamah',
              hint: caughtRat ? 'Haba Polis -, Hormat Sindiket ++' : 'Masuk perbicaraan mahkamah!',
              journalType: caughtRat ? 'dilemma' : 'warning',
              customAction: (st) => {
                if (caughtRat) {
                  KarmaEndings.adjustAlignment({ notoriety: -10, stress: -8, power: 8 });
                  KarmaEndings.addHighlight('🎯', 'Berjaya memerangkap informan rahsia dalam lingkaran');
                  return { outcome: 'Kepintaran anda menyelamatkan seluruh operasi. Pengaruh anda digeruni kawan dan lawan.' };
                } else {
                  return {
                    outcome: 'Anda digari dan dihadapkan ke mahkamah!',
                    nextEvent: window.PrisonFugitive ? PrisonFugitive.buildCourtTrialEvent({
                      crimeLabel: 'Konspirasi & Bukti Informan',
                      minYears: 3,
                      maxYears: 7,
                      security: 'medium',
                      heat: 45
                    }) : null
                  };
                }
              }
            }
          ]
        };
      }
    }

    // --- ARKA 5: PERCUBAAN KHIANAT / SERANGAN ---
    if (arcId === 'betrayal_attempt') {
      arc.done = true;
      return {
        id: 'arc_hit_' + s.age,
        icon: '💥',
        title: 'Plot Twist: Percubaan Serangan Hendap!',
        text: `Ketika anda keluar dari sebuah restoran di ${s.city}, sebuah kenderaan gelap meluru laju menghampiri anda — pesaing lama menghantar orang upahan untuk menamatkan riwayat anda!`,
        choices: [
          {
            label: 'Berlindung & hubungi pihak keselamatan / pengawal peribadi',
            hint: 'Kesihatan -, selamat dengan parut trauma',
            journalType: 'warning',
            customAction: (st) => {
              const sec = Utils.usdToLocal(2500, st.countryId);
              st.money -= sec;
              GameState.adjustStats({ health: -14, happiness: -10 });
              KarmaEndings.adjustAlignment({ stress: 18 });
              KarmaEndings.addHighlight('💥', 'Terselamat daripada percubaan serangan hendap');
              return { outcome: `Anda terselamat dengan kecederaan ringan dan terus mengupah pengawal peribadi (${Utils.formatMoney(sec, st.countryId)}).` };
            }
          },
          {
            label: 'Balas serangan & hantar mesej keras kepada musuh',
            hint: 'Risiko cedera parah, Haba Polis ++, Hormat +++',
            journalType: 'warning',
            customAction: (st) => {
              const hurt = Utils.chance(0.45) ? -28 : -10;
              GameState.adjustStats({ health: hurt, happiness: -4 });
              KarmaEndings.adjustAlignment({ karma: -20, notoriety: 24, stress: 14, power: 15 });
              KarmaEndings.addHighlight('🔥', 'Mematahkan serangan hendap musuh dengan tangan sendiri');
              return { outcome: hurt < -20 ? 'Anda parah dan terpaksa dirawat secara rahsia, namun nama anda kini menjadi igauan musuh!' : 'Anda berjaya lolos tanpa cedera berat — seluruh dunia bawah tahu anda bukan calang-calang!' };
            }
          }
        ]
      };
    }

    // --- ARKA 6: VIRAL SEMALAMAN ---
    if (arcId === 'overnight_viral') {
      arc.done = true;
      return {
        id: 'arc_viral_' + s.age,
        icon: '⚡',
        title: 'Kejutan: Video Anda Tular 5 Juta Tontonan Semalaman!',
        text: `Klip spontan anda di ${s.city} tiba-tiba meletup di seluruh media sosial! Peti masuk anda dibanjiri tawaran jenama, wartawan dan ratusan ribu pengikut baru!`,
        choices: [
          {
            label: 'Manfaatkan momentum & bina empayar Laman Sosial!',
            hint: 'Pengikut +++, Populariti ++, Tunai +',
            journalType: 'milestone',
            customAction: (st) => {
              const gainFollowers = Utils.randInt(45000, 160000);
              const deal = Utils.usdToLocal(Utils.randInt(3500, 9000), st.countryId);
              st.socialMedia.hasAccount = true;
              if (!st.socialMedia.platforms.includes('vibetok')) st.socialMedia.platforms.push('vibetok');
              st.socialMedia.followers += gainFollowers;
              st.money += deal;
              KarmaEndings.adjustAlignment({ fame: 24, stress: 8 });
              KarmaEndings.markModeVisited('social');
              KarmaEndings.addHighlight('⚡', `Tular semalaman dengan +${gainFollowers.toLocaleString('en-US')} pengikut baru`);
              GameState.adjustStats({ happiness: 18 });
              return { outcome: `Anda meraih +${gainFollowers.toLocaleString('en-US')} pengikut dan tajaan pertama ${Utils.formatMoney(deal, st.countryId)}! Buka Laman Sosial untuk kembangkan empayar!` };
            }
          },
          {
            label: 'Tutup akaun & lindungi privasi hidup anda',
            hint: 'Ketenangan +, Stres --, peluang viral berlalu',
            journalType: 'normal',
            customAction: () => {
              KarmaEndings.adjustAlignment({ stress: -10, karma: 6 });
              GameState.adjustStats({ happiness: 6 });
              return { outcome: 'Anda menolak dunia populariti sementara demi menjaga ketenangan privasi diri dan keluarga.' };
            }
          }
        ]
      };
    }

    arc.done = true;
    return null;
  },

  _pickGoodPathTrial(s, c) {
    const trials = [
      {
        id: 'trial_good_patience_' + s.age,
        icon: '🌿',
        title: 'Ujian Insan Baik: Hasad Dengki & Sabar',
        text: `Kejujuran dan sikap baik anda di ${s.city} membuatkan seseorang yang iri hati menyebarkan fitnah untuk menjatuhkan maruah anda.`,
        choices: [
          {
            label: 'Bersabar, buktikan dengan tindakan & maafkan',
            hint: 'Karma ++, ganjaran tertunda yang besar',
            journalType: 'spiritual',
            customAction: (st) => {
              KarmaEndings.adjustAlignment({ karma: 14, fame: 6, stress: -5 });
              GameState.adjustStats({ happiness: 8, smarts: 3 });
              const gift = Utils.usdToLocal(Utils.randInt(1500, 4500), st.countryId);
              st.money += gift;
              return { outcome: `Kesabaran anda membuka mata ramai! Seorang kenalan terharu dengan akhlak anda dan menghadiahkan peluang bernilai ${Utils.formatMoney(gift, st.countryId)}.` };
            }
          },
          {
            label: 'Balas balik dengan serangan peribadi di khalayak',
            hint: 'Karma --, Stres +',
            journalType: 'warning',
            customAction: () => {
              KarmaEndings.adjustAlignment({ karma: -12, stress: 10 });
              GameState.adjustStats({ happiness: -6 });
              return { outcome: 'Kemarahan anda memuaskan ego seketika, tetapi merosakkan reputasi tenang yang anda bina bertahun-tahun.' };
            }
          }
        ]
      },
      {
        id: 'trial_good_temptation_' + s.age,
        icon: '⚖️',
        title: 'Ujian Integriti: Jalan Pintas Kaya Cepat',
        text: 'Anda menemui kesilapan sistem transaksi yang membolehkan anda mengambil wang besar tanpa dikesan serta-merta.',
        choices: [
          {
            label: 'Laporkan pepijat itu dengan jujur kepada pemilik sistem',
            hint: 'Karma +++, ganjaran halal & hormat',
            journalType: 'milestone',
            customAction: (st) => {
              const bounty = Utils.usdToLocal(Utils.randInt(2000, 6500), st.countryId);
              st.money += bounty;
              KarmaEndings.adjustAlignment({ karma: 18, fame: 5 });
              GameState.adjustStats({ happiness: 14, smarts: 4 });
              return { outcome: `Pihak syarikat amat kagum dengan kejujuran anda dan menganugerahkan ganjaran bug-bounty halal sebanyak ${Utils.formatMoney(bounty, st.countryId)}!` };
            }
          },
          {
            label: 'Ambil kesempatan & pindahkan wang ke akaun rahsia',
            hint: 'Tunai +++, Karma ---, Haba Polis ++',
            journalType: 'warning',
            setFlag: 'took_bribe',
            customAction: (st) => {
              const stolen = Utils.usdToLocal(Utils.randInt(12000, 30000), st.countryId);
              st.money += stolen;
              KarmaEndings.adjustAlignment({ karma: -25, notoriety: 22, stress: 14 });
              return { outcome: `Anda mengaut ${Utils.formatMoney(stolen, st.countryId)}, tetapi hati anda mula gelisah menanti audit mengejut.` };
            }
          }
        ]
      }
    ];
    return Utils.pick(trials);
  },

  _pickBadPathTrial(s, c) {
    const trials = [
      {
        id: 'trial_bad_paranoia_' + s.age,
        icon: '👁️',
        title: 'Ujian Jalan Gelap: Paranoia & Serbuan',
        text: 'Aktiviti gelap dan karma buruk anda mula menarik perhatian polis serta musuh lama. Kereta tidak dikenali kelihatan berkeliaran di luar rumah anda setiap malam.',
        choices: [
          {
            label: 'Bayar rasuah / wang tutup mulut untuk redakan haba',
            hint: 'Wang --, Haba Polis --, Karma -',
            journalType: 'warning',
            customAction: (st) => {
              const bribe = Utils.usdToLocal(Utils.randInt(2500, 6000), st.countryId);
              st.money -= bribe;
              KarmaEndings.adjustAlignment({ notoriety: -18, karma: -8, stress: 6 });
              return { outcome: `Anda membayar ${Utils.formatMoney(bribe, st.countryId)} untuk menutup mulut beberapa pihak. Haba polis mereda buat sementara.` };
            }
          },
          {
            label: 'Bertaubat, derma besar & perlahankan jalan gelap',
            hint: 'Karma ++, Wang -, Stres --',
            journalType: 'spiritual',
            customAction: (st) => {
              const charity = Utils.usdToLocal(1500, st.countryId);
              st.money -= charity;
              KarmaEndings.adjustAlignment({ karma: 18, notoriety: -10, stress: -12 });
              GameState.adjustStats({ happiness: 8 });
              return { outcome: `Anda menyalurkan ${Utils.formatMoney(charity, st.countryId)} untuk kebajikan dan mula meninggalkan lingkaran toksik. Hati terasa lebih lapang.` };
            }
          }
        ]
      }
    ];
    return Utils.pick(trials);
  },

  // --------------------------------------------------------------------------
  // PENILAIAN PENAMAT & PENJEJAK PENAMAT RAHSIA (localStorage)
  // --------------------------------------------------------------------------
  evaluateEnding(s) {
    GameState.ensureUpgradedState();
    const netUsd = Utils.localToUsd(GameState.getNetWorth(), s.countryId);
    const a = s.alignment;
    const am = s.activeSpecialMode;
    const exited = Array.isArray(s.exitedModeIds) ? s.exitedModeIds : [];
    const wasPolitics = (am && am.modeId === 'politics' && am.rankIndex >= 2) || s.formerLeaderPension > 0 || exited.includes('politics');
    const wasCelebrity = (am && am.modeId === 'celebrity' && am.rankIndex >= 2) || exited.includes('celebrity');
    const wasAthlete = (am && am.modeId === 'athlete' && am.rankIndex >= 2) || exited.includes('athlete');
    const wasFinanceOrCeo = (am && (am.modeId === 'ceo' || am.modeId === 'fund_manager') && am.rankIndex >= 2) || exited.includes('ceo') || exited.includes('fund_manager');
    let id = 'humble_soul';

    if (s.socialMedia && s.socialMedia.cancelledCount >= 1 && (a.peakFame || a.fame) >= 55) {
      id = 'cancelled_viral_legend';
    } else if (wasPolitics && a.karma >= 25) {
      id = 'peoples_reformer';
    } else if (wasPolitics && a.karma <= -15) {
      id = 'corrupt_tyrant';
    } else if ((s.prison.totalServed || 0) > 0 && a.karma >= 35) {
      id = 'prisoner_turned_saint';
    } else if (wasCelebrity && (a.peakFame || a.fame) >= 75) {
      id = 'global_cinema_legend';
    } else if (wasAthlete && (a.peakFame || a.fame) >= 60) {
      id = 'cultural_art_icon';
    } else if ((wasFinanceOrCeo || netUsd >= 900000) && netUsd >= 900000 && (a.peakFame || a.fame) < 55) {
      id = 'shadow_billionaire';
    } else if ((s.criminalRecord || 0) >= 2 || (s.fugitive && s.fugitive.wanted)) {
      id = 'underworld_outlaw';
    } else if (s.countriesLivedIn.length >= 3 || s.citizenships.length >= 3) {
      id = 'world_nomad';
    } else if ((s.spiritualHistory && s.spiritualHistory.length >= 2) || (s.devotion >= 82 && s.belief !== 'unassigned')) {
      id = 'spiritual_seeker';
    }

    const ending = this.ENDINGS_CATALOG.find(e => e.id === id) || this.ENDINGS_CATALOG[this.ENDINGS_CATALOG.length - 1];
    this.unlockEnding(ending.id);
    return ending;
  },

  getFamilyMemory(s) {
    const aliveFam = s.relationships.filter(r => r.alive && ['family', 'spouse'].includes(r.category));
    if (aliveFam.length === 0) return 'Anda mengakhiri perjalanan dalam kesunyian, ditemani kenangan silam.';
    const avg = Math.round(aliveFam.reduce((acc, r) => acc + (r.closeness || 50), 0) / aliveFam.length);
    if (avg >= 78) return 'Keluarga dan insan tersayang mengenang anda dengan air mata kasih sayang serta doa yang tidak putus.';
    if (avg >= 50) return 'Keluarga anda menghormati perjuangan hidup anda walaupun ada beberapa kenangan yang teruji.';
    return 'Hubungan keluarga anda agak renggang di penghujung usia — namun kisah anda tetap terpahat dalam ingatan mereka.';
  },

  getUnlocked() {
    const parsed = window.SafeStorage
      ? SafeStorage.getJSON(this.UNLOCKED_KEY, null)
      : (() => { try { return JSON.parse(localStorage.getItem(this.UNLOCKED_KEY) || 'null'); } catch (e) { return null; } })();
    if (parsed && typeof parsed === 'object') {
      return {
        endings: Array.isArray(parsed.endings) ? parsed.endings : [],
        modes: Array.isArray(parsed.modes) ? parsed.modes : []
      };
    }
    return { endings: [], modes: [] };
  },

  unlockEnding(endingId) {
    const unlocked = this.getUnlocked();
    if (!unlocked.endings.includes(endingId)) {
      unlocked.endings.push(endingId);
      this._saveUnlocked(unlocked);
      if (window.Utils && Utils.playTone) Utils.playTone('achievement');
    }
  },

  _saveUnlocked(obj) {
    if (window.SafeStorage) {
      SafeStorage.setJSON(this.UNLOCKED_KEY, obj);
      return;
    }
    try {
      localStorage.setItem(this.UNLOCKED_KEY, JSON.stringify(obj));
    } catch (e) {}
  }
};
