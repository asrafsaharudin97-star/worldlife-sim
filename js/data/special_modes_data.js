/* ==========================================================================
   WorldLife — Pangkalan Data Mod Khas "Peluang Sekali Seumur Hidup" (Fasa 1: 5 Mod)
   1. Politik & Kepimpinan Negara  2. Usahawan & CEO  3. Jerung Pasaran / Trader Pro
   4. Selebriti & Content Creator  5. Atlet Pro & E-Sukan
   Bahasa Melayu — Sifar Placeholder
   ========================================================================== */

window.SpecialModesData = {
  MODES: {
    // ========================================================================
    // 1. POLITIK & KEPIMPINAN NEGARA
    // ========================================================================
    politics: {
      id: 'politics',
      icon: '🏛️',
      title: 'Politik & Kepimpinan Negara',
      shortLabel: 'Politik',
      minAge: 21,
      maxAge: 72,
      offerHeadline: 'Tawaran Pencalonan Parti Politik!',
      offerPitch: 'Pemimpin kanan parti tempatan melihat bakat kepimpinan anda dan menawarkan kerusi calon pilihan raya! Ini peluang sekali seumur hidup untuk naik sehingga ke puncak pemerintahan negara.',
      metric1: { label: 'Sokongan Rakyat', icon: '🗳️', init: 48, dangerHigh: false },
      metric2: { label: 'Risiko Skandal',  icon: '🚨', init: 8,  dangerHigh: true },
      ranks: [
        { title: 'Ahli Majlis',               annualUsd: 38000,  reqYears: 0, reqM1: 0,  prefix: '' },
        { title: 'Timbalan Menteri',          annualUsd: 88000,  reqYears: 2, reqM1: 58, prefix: 'YB' },
        { title: 'Menteri Kabinet',           annualUsd: 155000, reqYears: 5, reqM1: 70, prefix: 'YB' },
        { title: 'Perdana Menteri / Presiden',annualUsd: 280000, reqYears: 9, reqM1: 82, prefix: 'YAB' }
      ],
      exitWarning: 'Keluar daripada arena politik akan melucutkan jawatan dan kekebalan politik anda serta mengunci Mod Politik SELAMANYA bagi watak ini. Jika keluar awal atau Risiko Skandal > 30%, anda berdepan siasatan rasuah, skandal media & risiko Perbicaraan Mahkamah! Berkhidmat bersih 5+ tahun melayakkan Pencen Bekas Pemimpin.',
      actions: [
        { id: 'pol_turun_padang',  icon: '🤝', title: 'Lawatan Turun Padang Mengejut', desc: 'Tinjau pasar awam dan klinik desa tanpa protokol rasmi.', m1: 8, m2: -3, karma: 6, rep: 3, stress: 4 },
        { id: 'pol_debat_parlimen',icon: '🏛️', title: 'Debat Hangat Di Parlimen', desc: 'Pertahankan usul ekonomi negara menentang hujah pembangkang.', m1: 9, m2: 2, fame: 8, smarts: 3, stress: 7 },
        { id: 'pol_ruu_reformasi', icon: '📜', title: 'Bentang Rang Undang-Undang Pembaharuan', desc: 'Luluskan dasar ketelusan tender dan kebajikan rakyat.', m1: 10, m2: -5, karma: 10, rep: 5, stress: 8 },
        { id: 'pol_sidang_media',  icon: '📸', title: 'Sidang Media Khas Nasional', desc: 'Jawab soalan tajam media bagi menjelaskan hala tuju kerajaan.', m1: 6, m2: 3, fame: 7, stress: 6 },
        { id: 'pol_bantu_bencana', icon: '🌧️', title: 'Operasi Bantuan Mangsa Bencana', desc: 'Turun padang menyalurkan bantuan kecemasan kepada rakyat terjejas.', m1: 12, m2: -4, karma: 10, rep: 5, health: -3 },
        { id: 'pol_lobi_korporat', icon: '💼', title: 'Rundingan Dana Lobi Korporat', desc: 'Terima sumbangan dana politik besar daripada konglomerat di sebalik tabir.', m1: -5, m2: 18, moneyUsd: 42000, karma: -16, flag: 'corrupt_deal' },
        { id: 'pol_kawal_inflasi', icon: '🛒', title: 'Lancar Subsidi Bersasar & Kawal Harga', desc: 'Ringankan beban kos sara hidup rakyat berpendapatan rendah.', m1: 11, m2: -2, karma: 8, rep: 4, stress: 6 },
        { id: 'pol_diplomasi',     icon: '✈️', title: 'Lawatan Diplomatik & Pelaburan Asing', desc: 'Meterai perjanjian pelaburan teknologi berbilion bersama pemimpin dunia.', m1: 9, m2: 0, fame: 10, rep: 6, smarts: 3 },
        { id: 'pol_audit_dalaman', icon: '🔍', title: 'Bongkar Ketirisan Dalaman Kementerian', desc: 'Bersihkan kartel projek kerajaan walaupun mencetuskan kemarahan kroni.', m1: 12, m2: -8, karma: 12, rep: 6, stress: 9 },
        { id: 'pol_kempen_viral',  icon: '📱', title: 'Kempen Video Rakyat Di Media Sosial', desc: 'Sampaikan laporan prestasi kerja secara santai dan telus.', m1: 7, m2: 1, fame: 8, followers: 12000 },
        { id: 'pol_jamuan_elit',   icon: '🍽️', title: 'Majlis Makan Malam Tertutup Elit', desc: 'Kukuhkan sokongan dalaman parti bersama tokoh berpengaruh.', m1: 3, m2: 7, moneyUsd: 16000, rep: 2 },
        { id: 'pol_projek_mega',   icon: '🚄', title: 'Rasmikan Projek Mega Infrastruktur', desc: 'Buka laluan tren laju dan lebuh raya moden untuk ekonomi negara.', m1: 13, m2: 4, fame: 12, rep: 7, stress: 8 },
        { id: 'pol_rare_krisis',   icon: '🚨', isRare: true, title: '🌟 KRISIS NEGARA: Tangani Krisis Nasional Mengejut!', desc: 'PELUANG EMAS: Tindakan berani anda ketika krisis darurat akan mengangkat nama anda sebagai negarawan!', m1: 18, m2: -6, fame: 18, rep: 12, karma: 12, stress: 12 }
      ],
      dilemmas: [
        {
          id: 'sp_pol_tender', icon: '🏗️', title: 'Dilema Kabinet: Tender Projek Hospital Awam',
          text: 'Syarikat A membida secara telus dan berkualiti, manakala Syarikat B menawarkan dana rahsia luar negara yang lumayan untuk meluluskan kontrak mereka.',
          choices: [
            { label: 'Luluskan Syarikat A secara telus 100%', hint: 'Sokongan ++, Skandal --, Karma ++, Reputasi +', m1: 12, m2: -8, karma: 14, rep: 6, outcome: 'Ketelusan anda dipuji seluruh negara dan kepercayaan rakyat melonjak!' },
            { label: 'Paksa tender semula untuk potong kos awam 15%', hint: 'Kepintaran +, Sokongan +, Stres +', m1: 8, m2: -3, smarts: 4, stress: 7, outcome: 'Langkah tegas anda menjimatkan jutaan dana negara.' },
            { label: 'Terima dana rahsia Syarikat B di sebalik tabir', hint: 'Wang +++, tetapi Risiko Skandal +++ & Karma ---', moneyUsd: 75000, m1: -8, m2: 24, karma: -22, flag: 'corrupt_deal', outcome: 'Wang besar masuk ke akaun rahsia anda, namun bayang-bayang siasatan semakin dekat!' }
          ]
        },
        {
          id: 'sp_pol_leak', icon: '📰', title: 'Kebocoran Memo Dalaman Ke Media Utama!',
          text: 'Wartawan memperoleh draf memo kementerian anda yang belum diluluskan dan mengancam menerbitkannya malam ini.',
          choices: [
            { label: 'Buka sidang media & jelaskan draf sebenar dengan jujur', hint: 'Sokongan +, Skandal -, Reputasi +', m1: 9, m2: -6, karma: 8, rep: 4, outcome: 'Keterbukaan anda mematikan spekulasi dan meningkatkan kredibiliti.' },
            { label: 'Serang balas: bentangkan dasar lebih berani terus di Parlimen!', hint: 'Sokongan ++, Populariti ++, Stres +', m1: 12, m2: 2, fame: 12, stress: 9, outcome: 'Langkah politik berani anda mencuri tumpuan seluruh negara!' },
            { label: 'Gunakan pengaruh untuk menyekat penerbitan akhbar itu', hint: 'Skandal ++, Karma --', m1: -6, m2: 16, karma: -14, outcome: 'Berita disekat sementara tetapi desas-desus tular di media sosial.' }
          ]
        },
        {
          id: 'sp_pol_protest', icon: '🪧', title: 'Himpunan Besar Rakyat Di Ibu Kota!',
          text: 'Ribuan rakyat berhimpun menuntut pelarasan gaji minimum dan kawalan harga barang.',
          choices: [
            { label: 'Turun sendiri berdialog & umum pakej bantuan segera', hint: 'Sokongan +++, Karma ++, Reputasi ++', m1: 15, m2: -6, karma: 14, rep: 7, outcome: 'Keberanian anda turun mendengar suara rakyat mencetuskan tepukan gemuruh!' },
            { label: 'Tubuhkan jawatankuasa rundingan bersama wakil pekerja', hint: 'Sokongan +, Selamat', m1: 7, m2: -2, smarts: 3, outcome: 'Keadaan kembali tenang selepas rundingan rasmi dimulakan.' },
            { label: 'Arahkan pembubaran paksa himpunan', hint: 'Sokongan ---, Skandal ++, Karma ---', m1: -14, m2: 18, karma: -18, rep: -6, outcome: 'Tindakan keras itu dikecam hebat oleh masyarakat dan media.' }
          ]
        }
      ]
    },

    // ========================================================================
    // 2. USAHAWAN & CEO
    // ========================================================================
    ceo: {
      id: 'ceo',
      icon: '💼',
      title: 'Usahawan & CEO',
      shortLabel: 'CEO',
      minAge: 18,
      maxAge: 70,
      offerHeadline: 'Peluang Mengasaskan Syarikat Pemula (Startup)!',
      offerPitch: 'Seorang pelabur modal teroka (VC) tertarik dengan idea produk anda dan menawarkan modal benih awal untuk anda mengasaskan syarikat sendiri! Ekuiti syarikat anda boleh diwarisi ke generasi seterusnya.',
      metric1: { label: 'Penilaian Syarikat', icon: '📈', init: 25, dangerHigh: false },
      metric2: { label: 'Moral Pekerja',      icon: '👥', init: 72, dangerHigh: false },
      ranks: [
        { title: 'Pengasas Startup',     annualUsd: 42000,  reqYears: 0, reqM1: 0,  prefix: '' },
        { title: 'CEO Syarikat',         annualUsd: 115000, reqYears: 2, reqM1: 45, prefix: '' },
        { title: 'Tokoh Korporat (IPO)', annualUsd: 260000, reqYears: 5, reqM1: 72, prefix: '' },
        { title: 'Taikun Konglomerat',   annualUsd: 520000, reqYears: 9, reqM1: 90, prefix: '' }
      ],
      exitWarning: 'Keluar daripada Mod CEO akan menamatkan kepimpinan syarikat anda dan mengunci Mod CEO SELAMANYA bagi watak ini. Anda boleh memilih untuk Menjual Syarikat (tertakluk cukai keuntungan modal & risiko saman pelabur jika penilaian jatuh) atau Menutup Operasi (penyelesaian hutang & kesan reputasi).',
      actions: [
        { id: 'ceo_lancar_produk',  icon: '🚀', title: 'Lancar Produk Edisi Baharu', desc: 'Perkenalkan produk utama yang dinantikan pasaran tempatan dan serantau.', m1: 11, m2: 4, moneyUsd: 24000, fame: 6, stress: 6 },
        { id: 'ceo_pitch_vc',       icon: '💰', title: 'Pitch Siri Pelaburan Kepada VC', desc: 'Bentangkan pertumbuhan syarikat untuk menyuntik dana pengembangan.', m1: 13, m2: 2, moneyUsd: 45000, smarts: 3, stress: 7 },
        { id: 'ceo_eksport_global', icon: '🚢', title: 'Runding Kontrak Eksport Antarabangsa', desc: 'Tembusi pasaran luar negara dengan pengedar strategik.', m1: 10, m2: 3, moneyUsd: 36000, rep: 5, stress: 6 },
        { id: 'ceo_perang_harga',   icon: '⚔️', title: 'Lancarkan Perang Harga Dengan Pesaing', desc: 'Potong margin sementara untuk merampas bahagian pasaran pesaing.', m1: 8, m2: -6, moneyUsd: -8000, stress: 8 },
        { id: 'ceo_pemasaran_gerila',icon: '📣', title: 'Kempen Pemasaran Gerila Viral', desc: 'Cipta iklan kreatif kos rendah yang meletup di media sosial.', m1: 8, m2: 5, fame: 9, followers: 15000, moneyUsd: 14000 },
        { id: 'ceo_audit_syarikat', icon: '📋', title: 'Audit Dalaman & Kecekapan Operasi', desc: 'Tutup kebocoran kos dan kukuhkan tadbir urus korporat.', m1: 6, m2: 4, smarts: 4, karma: 6, rep: 3 },
        { id: 'ceo_ma_ambil_alih',  icon: '🏢', title: 'Ambil Alih Syarikat Pesaing Kecil (M&A)', desc: 'Gabungkan kepakaran dan pelanggan pesaing ke dalam empayar anda.', m1: 15, m2: -4, moneyUsd: -15000, rep: 6, stress: 9 },
        { id: 'ceo_bonus_pekerja',  icon: '🎁', title: 'Agih Bonus & Saham Pekerja (ESOP)', desc: 'Hargai tenaga kerja anda — moral dan produktiviti melonjak tinggi!', m1: 5, m2: 16, moneyUsd: -12000, karma: 10, rep: 5, stress: -5 },
        { id: 'ceo_ekspo_dunia',    icon: '🌍', title: 'Pameran Di Ekspo Teknologi Antarabangsa', desc: 'Pamerkan inovasi syarikat di hadapan pelabur global.', m1: 9, m2: 5, fame: 10, rep: 5 },
        { id: 'ceo_kolab_jenama',   icon: '🤝', title: 'Kolaborasi Bersama Jenama Gergasi', desc: 'Lancarkan produk edisi terhad bersama peneraju industri.', m1: 11, m2: 4, moneyUsd: 32000, fame: 8 },
        { id: 'ceo_pivot_model',    icon: '🔄', title: 'Pivot Model Bisnes Ke Langganan AI', desc: 'Ubah aliran pendapatan kepada model berulang yang lebih bernilai.', m1: 12, m2: -3, smarts: 5, stress: 7 },
        { id: 'ceo_csr_komuniti',   icon: '🌱', title: 'Program CSR & Biasiswa Syarikat', desc: 'Bantu komuniti setempat dan bina imej korporat disegani.', m1: 4, m2: 9, moneyUsd: -8000, karma: 12, rep: 7 },
        { id: 'ceo_rare_ipo_offer', icon: '👑', isRare: true, title: '🌟 PELUANG EMAS: Tawaran Penyenaraian IPO / Pengambilalihan Gergasi!', desc: 'PELUANG TERHAD: Bank pelaburan global menawarkan penyenaraian mega untuk melonjakkan penilaian syarikat!', m1: 22, m2: 8, moneyUsd: 120000, fame: 16, rep: 12 }
      ],
      dilemmas: [
        {
          id: 'sp_ceo_strike', icon: '🪧', title: 'Krisis Syarikat: Pekerja Mengugut Mogok!',
          text: 'Waktu kerja yang terlalu padat menyebabkan jabatan kejuruteraan dan operasi menuntut kenaikan gaji segera.',
          choices: [
            { label: 'Naikkan gaji 15% & perkenalkan waktu kerja fleksibel', hint: 'Moral +++, Reputasi ++, Kos tunai', moneyUsd: -18000, m1: 4, m2: 20, karma: 10, rep: 6, outcome: 'Moral pekerja melonjak dan produktiviti syarikat mencatat rekod baharu!' },
            { label: 'Tawarkan perkongsian keuntungan (ESOP) bersyarat sasaran', hint: 'Seimbang: Penilaian +, Moral +', m1: 8, m2: 10, smarts: 4, outcome: 'Pekerja bersetuju berkongsi kejayaan jangka panjang syarikat.' },
            { label: 'Pecat ketua kesatuan & gantikan dengan pekerja kontrak', hint: 'Moral ---, Karma --, Penilaian berisiko', m1: -5, m2: -22, karma: -16, rep: -8, outcome: 'Mogok terhenti tetapi syarikat anda dikecam hebat sebagai majikan toksik.' }
          ]
        },
        {
          id: 'sp_ceo_bug', icon: '⚠️', title: 'Kecacatan Produk Dikesan Sehari Sebelum Pelancaran!',
          text: 'Pasukan QA menemui pepijat serius pada produk utama anda, sedangkan ribuan pelanggan telah membuat prapesanan.',
          choices: [
            { label: 'Tunda pelancaran 2 minggu & baiki dengan telus', hint: 'Karma ++, Moral +, Reputasi ++', m1: 6, m2: 8, karma: 12, rep: 6, outcome: 'Pelanggan menghargai kejujuran anda dan produk dilancarkan tanpa sebarang kecacatan!' },
            { label: 'Lancar dahulu & hantar kemas kini tampalan malam ini juga', hint: 'Penilaian ++, Stres ++, Moral -', m1: 11, m2: -6, moneyUsd: 25000, stress: 10, outcome: 'Jualan meletup walaupun pasukan teknikal berjaga 48 jam membaiki sistem!' },
            { label: 'Sorokkan kecacatan & salahkan penggunaan pelanggan', hint: 'Wang +, tetapi Risiko saman & Reputasi ---', m1: -10, m2: -12, moneyUsd: 15000, karma: -20, rep: -10, outcome: 'Skandal produk tular dan beberapa pelabur mula hilang kepercayaan!' }
          ]
        },
        {
          id: 'sp_ceo_buyout', icon: '💼', title: 'Pesaing Cuba Mencuri Ketua Jurutera Anda!',
          text: 'Syarikat gergasi menawarkan gaji dua kali ganda kepada orang kanan terbaik anda.',
          choices: [
            { label: 'Tandingi tawaran & lantik beliau sebagai Rakan Kongsi Ekuiti', hint: 'Penilaian ++, Moral ++', moneyUsd: -15000, m1: 10, m2: 14, rep: 4, outcome: 'Kesetiaan beliau kekal utuh dan inovasi syarikat terus mendahului pesaing!' },
            { label: 'Lepaskan beliau secara profesional & naikkan pangkat bakat dalaman', hint: 'Moral +, Seimbang', m1: 4, m2: 8, karma: 6, outcome: 'Bakat muda dalaman anda menyerlah mengisi kekosongan dengan cemerlang.' },
            { label: 'Failkan saman halangan kontrak yang agresif', hint: 'Moral --, Kos guaman', moneyUsd: -12000, m1: -2, m2: -10, karma: -8, outcome: 'Kes berlarutan dan menimbulkan suasana tegang di pejabat.' }
          ]
        }
      ]
    },

    // ========================================================================
    // 3. JERUNG PASARAN / TRADER PRO (FUND MANAGER)
    // ========================================================================
    fund_manager: {
      id: 'fund_manager',
      icon: '📈',
      title: 'Jerung Pasaran / Trader Pro',
      shortLabel: 'Trader Pro',
      minAge: 20,
      maxAge: 68,
      offerHeadline: 'Tawaran Meja Dagangan Elit & Hedge Fund!',
      offerPitch: 'Firma dana lindung nilai (Hedge Fund) ternama mengesan ketajaman analisis anda dan menawarkan kerusi eksklusif mengurus dana jutaan dolar! Peluang menjadi Jerung Wall Street hanya datang sekali seumur hidup.',
      metric1: { label: 'Aset Diurus (AUM)', icon: '💰', init: 28, dangerHigh: false },
      metric2: { label: 'Risiko Regulator',  icon: '⚖️', init: 10, dangerHigh: true },
      ranks: [
        { title: 'Penganalisis Dana',        annualUsd: 68000,  reqYears: 0, reqM1: 0,  prefix: '' },
        { title: 'Pengurus Portfolio Elit',  annualUsd: 165000, reqYears: 2, reqM1: 48, prefix: '' },
        { title: 'Rakan Kongsi Hedge Fund',  annualUsd: 340000, reqYears: 5, reqM1: 74, prefix: '' },
        { title: 'Jerung Wall Street',       annualUsd: 680000, reqYears: 9, reqM1: 90, prefix: '' }
      ],
      exitWarning: 'Keluar daripada Mod Jerung Pasaran akan menamatkan kontrak pengurusan dana (penalti pemecahan kontrak jika < 3 tahun) dan mengunci mod ini SELAMANYA. Audit wajib badan regulator akan dijalankan — jika anda pernah terlibat dalam Insider Trading atau Risiko Regulator tinggi, anda berisiko tinggi didakwa di Mahkamah!',
      actions: [
        { id: 'fm_analisis_makro', icon: '📊', title: 'Dagangan Makro Mata Wang & Bon', desc: 'Jangka perubahan kadar faedah bank pusat dengan ketepatan tinggi.', m1: 10, m2: 1, moneyUsd: 26000, smarts: 4, stress: 6 },
        { id: 'fm_short_saham',    icon: '📉', title: 'Short-Selling Syarikat Terlebih Nilai', desc: 'Dedahkan laporan lemah syarikat gelembung dan kaut untung semasa jatuh.', m1: 12, m2: 6, moneyUsd: 38000, fame: 5, stress: 8 },
        { id: 'fm_algo_bot',       icon: '🤖', title: 'Bina Algoritma Dagangan Frekuensi Tinggi', desc: 'Automasi strategi kuantitatif untuk keuntungan mikro sesaat.', m1: 11, m2: 2, moneyUsd: 32000, smarts: 5, stress: 5 },
        { id: 'fm_insider_tip',    icon: '🤫', title: 'Gunakan Maklumat Dalaman (Insider Trading)', desc: 'Beli opsyen saham sehari sebelum pengumuman penggabungan rahsia!', m1: 18, m2: 26, moneyUsd: 95000, karma: -24, flag: 'insider_trading', stress: 10 },
        { id: 'fm_tarik_bilionair',icon: '🥂', title: 'Bentang Prestasi Dana Kepada Bilionair', desc: 'Yakinkan keluarga kaya raya untuk memasukkan dana baharu ke dalam portfolio.', m1: 13, m2: 0, moneyUsd: 22000, rep: 4 },
        { id: 'fm_audit_patuh',    icon: '🛡️', title: 'Semakan Pematuhan & Audit Regulator', desc: 'Pastikan semua rekod dagangan bersih dan sejukkan perhatian pengawal selia.', m1: 3, m2: -14, karma: 8, rep: 3, stress: -4 },
        { id: 'fm_dagang_komoditi',icon: '🛢️', title: 'Spekulasi Niaga Hadapan Emas & Minyak', desc: 'Kaut peluang pergerakan harga tenaga dunia.', m1: 9, m2: 3, moneyUsd: 30000, stress: 7 },
        { id: 'fm_lindung_krisis', icon: '☂️', title: 'Strategi Lindung Nilai (Hedging) Risiko', desc: 'Lindungi modal pelabur daripada kejutan pasaran mengejut.', m1: 7, m2: -5, smarts: 3, rep: 4, stress: -5 },
        { id: 'fm_dana_kripto',    icon: '₿',  title: 'Buka Meja Arbitraj Aset Digital', desc: 'Eksploitasi perbezaan harga antara bursa kripto global.', m1: 11, m2: 7, moneyUsd: 42000, stress: 8 },
        { id: 'fm_sidang_kewangan',icon: '🎤', title: 'Panelis Utama Sidang Kewangan Global', desc: 'Pandangan pasaran anda menggerakkan indeks bursa seluruh rantau!', m1: 8, m2: -2, fame: 11, rep: 6 },
        { id: 'fm_syariah_fund',   icon: '🌙', title: 'Lancar Dana Pelaburan Etika & Patuh Syariah', desc: 'Tarik pelabur institusi beretika dengan pulangan mantap.', m1: 9, m2: -6, karma: 10, rep: 6, moneyUsd: 20000 },
        { id: 'fm_rare_big_short', icon: '⚡', isRare: true, title: '🌟 PELUANG EMAS: Ramalan "The Big Short" Dekad Ini!', desc: 'PELUANG TERHAD: Data anda mengesan kejatuhan besar pasaran kredit — pertaruhan berani ini boleh mencipta sejarah!', m1: 24, m2: 6, moneyUsd: 165000, fame: 16, rep: 10, stress: 12 }
      ],
      dilemmas: [
        {
          id: 'sp_fm_insider', icon: '🤫', title: 'Bisikan Rahsia Penggabungan Korporat!',
          text: 'Seorang rakan lama di bank pelaburan secara "terlepas cakap" mendedahkan syarikat biotek bakal diambil alih esok pada harga 3 kali ganda!',
          choices: [
            { label: 'Tolak maklumat itu & rekodkan laporan pematuhan rasmi', hint: 'Cara Jujur: Regulator --, Karma ++, Reputasi ++', m1: 4, m2: -14, karma: 16, rep: 6, outcome: 'Integriti anda dipuji lembaga pengarah dan pelabur institusi!' },
            { label: 'Labur jumlah kecil sahaja supaya tidak mencurigakan', hint: 'Cara Licik: Wang ++, Risiko Regulator +15', moneyUsd: 42000, m1: 10, m2: 15, karma: -14, flag: 'insider_trading', outcome: 'Anda mengaut keuntungan pantas, tetapi corak dagangan anda direkodkan sistem bursa!' },
            { label: 'All-in dengan leveraj maksimum demi untung ratusan ribu!', hint: 'Cara Kotor: Wang ++++, Risiko Regulator +++!', moneyUsd: 135000, m1: 20, m2: 32, karma: -28, flag: 'insider_trading', outcome: 'Untung gergasi masuk dalam 24 jam — namun penyiasat kewangan mula meneliti fail anda!' }
          ]
        },
        {
          id: 'sp_fm_flash_crash', icon: '📉', title: 'Flash Crash Mengejut 18% Dalam 10 Minit!',
          text: 'Algoritma pasaran seluruh dunia panik dan klien utama anda menelefon meminta semua aset dijual segera.',
          choices: [
            { label: 'Tenangkan klien & beli saham berkualiti pada harga runtuh!', hint: 'Cara Berani: AUM +++, Wang +++, Kepintaran +', moneyUsd: 55000, m1: 16, m2: 2, smarts: 5, rep: 6, outcome: 'Pasaran melantun semula petang itu — klien menyanjung keberanian luar biasa anda!' },
            { label: 'Aktifkan pelan henti rugi (stop-loss) secara berdisiplin', hint: 'Cara Selamat: Lindungi modal, Stres -', m1: 5, m2: -4, stress: -6, outcome: 'Kerugian berjaya dihadkan dan dana anda kekal stabil.' },
            { label: 'Sorokkan laporan kerugian sementara dalam akaun luar pesisir', hint: 'Cara Kotor: Regulator +++, Karma ---', m1: 2, m2: 28, karma: -22, flag: 'insider_trading', outcome: 'Anda menyembunyikan kerugian buat sementara tetapi melanggar undang-undang kewangan!' }
          ]
        },
        {
          id: 'sp_fm_audit_visit', icon: '⚖️', title: 'Lawatan Mengejut Pegawai Pengawal Selia!',
          text: 'Suruhanjaya Sekuriti datang memeriksa buku dagangan firma anda tanpa notis awal.',
          choices: [
            { label: 'Beri kerjasama penuh & buka semua rekod dagangan', hint: 'Regulator -- (jika bersih), Reputasi +', m1: 5, m2: -15, karma: 10, rep: 4, outcome: 'Kerjasama telus anda meredakan pemeriksaan regulator.' },
            { label: 'Upah firma guaman korporat elit untuk mengendalikan semakan', hint: 'Kos tinggi, Risiko turun', moneyUsd: -24000, m1: 4, m2: -12, smarts: 3, outcome: 'Peguam korporat memastikan setiap prosedur mengikut undang-undang.' },
            { label: 'Padam log perbualan meja dagangan secara tergesa-gesa', hint: 'BAHAYA: Risiko Regulator +++, Karma ---', m1: -4, m2: 24, karma: -20, flag: 'insider_trading', outcome: 'Tindakan mencurigakan anda dikesan auditor forensik!' }
          ]
        }
      ]
    },

    // ========================================================================
    // 4. SELEBRITI & CONTENT CREATOR
    // ========================================================================
    celebrity: {
      id: 'celebrity',
      icon: '⭐',
      title: 'Selebriti & Content Creator',
      shortLabel: 'Selebriti',
      minAge: 15,
      maxAge: 62,
      offerHeadline: 'Klip Anda Meletup Jutaan Tontonan Semalaman!',
      offerPitch: 'Sebuah agensi bakat dan hiburan utama menghubungi anda selepas konten spontan anda tular seluruh negara! Ini peluang sekali seumur hidup menjadi Megabintang Global.',
      metric1: { label: 'Populariti',            icon: '⭐', init: 35, dangerHigh: false },
      metric2: { label: 'Risiko Cancel Culture', icon: '🔥', init: 10, dangerHigh: true },
      ranks: [
        { title: 'Pencipta Konten Viral', annualUsd: 34000,  reqYears: 0, reqM1: 0,  prefix: '' },
        { title: 'Bintang Tempatan',      annualUsd: 95000,  reqYears: 2, reqM1: 54, prefix: '' },
        { title: 'Ikon Serantau',         annualUsd: 210000, reqYears: 5, reqM1: 76, prefix: '' },
        { title: 'Megabintang Global',    annualUsd: 460000, reqYears: 8, reqM1: 92, prefix: '' }
      ],
      exitWarning: 'Keluar daripada Mod Selebriti akan menamatkan kontrak tajaan (penalti pembatalan tajaan), menurunkan populariti serta pendapatan hiburan, membawa 35% risiko drama media/cancel culture, dan mengunci Mod Selebriti SELAMANYA bagi watak ini.',
      actions: [
        { id: 'cel_kolab_mega',    icon: '🎬', title: 'Kolaborasi Konten Mega Bersama Bintang', desc: 'Gabungkan dua pangkalan peminat dalam video bajet besar!', m1: 12, m2: 2, moneyUsd: 22000, followers: 48000, fame: 10 },
        { id: 'cel_karpet_merah',  icon: '✨', title: 'Hadir Acara Karpet Merah & Gala', desc: 'Tampil memukau di hadapan jurugambar antarabangsa.', m1: 9, m2: 1, looks: 4, fame: 9, rep: 4, followers: 22000 },
        { id: 'cel_jenama_sendiri',icon: '👜', title: 'Lancar Jenama Fesyen & Kosmetik Sendiri', desc: 'Jualan hari pertama habis licin diserbu peminat setia!', m1: 10, m2: 3, moneyUsd: 55000, fame: 8, rep: 5 },
        { id: 'cel_live_amal',     icon: '💛', title: 'Siaran Langsung Amal 12 Jam', desc: 'Kutip ratusan ribu untuk hospital dan keluarga memerlukan.', m1: 11, m2: -12, karma: 16, rep: 8, followers: 32000, happiness: 12 },
        { id: 'cel_ujibakat_filem',icon: '🎥', title: 'Ujibakat Produksi Filem Antarabangsa', desc: 'Kembangkan bakat daripada skrin telefon ke layar perak dunia!', m1: 13, m2: 0, moneyUsd: 38000, fame: 12, rep: 5 },
        { id: 'cel_tepis_paparazi',icon: '🕶️', title: 'Tepis Gosip Paparazi Dengan Matang', desc: 'Kawal naratif media dengan kenyataan tenang dan berkelas.', m1: 5, m2: -10, rep: 4, stress: -6 },
        { id: 'cel_single_hit',    icon: '🎵', title: 'Lancar Lagu Single & Video Muzik', desc: 'Lagu anda menjuarai carta strim digital seluruh negara!', m1: 14, m2: 2, moneyUsd: 34000, followers: 55000, fame: 12 },
        { id: 'cel_tajaan_mewah',  icon: '⌚', title: 'Kontrak Duta Jenama Mewah Global', desc: 'Wajah anda menghiasi papan iklan di ibu kota utama dunia.', m1: 10, m2: 2, moneyUsd: 48000, looks: 3, rep: 4 },
        { id: 'cel_drama_gimik',   icon: '🔥', title: 'Cipta Gimik Kontroversi Untuk Tontonan', desc: 'Tingkatkan trafik mendadak tetapi menaikkan risiko kecaman netizen!', m1: 15, m2: 20, moneyUsd: 26000, followers: 60000, karma: -12 },
        { id: 'cel_podcast_jujur', icon: '🎙️', title: 'Temu Bual Podcast Hati Ke Hati', desc: 'Kongsi perjuangan sebenar hidup anda dan menangi hati penonton.', m1: 8, m2: -8, karma: 6, rep: 5, happiness: 8 },
        { id: 'cel_jelajah_peminat',icon: '🎤', title: 'Jelajah Jumpa Peminat (Fan Meet)', desc: 'Raikan peminat setia di 5 bandar besar dengan penuh mesra.', m1: 11, m2: -5, moneyUsd: 28000, happiness: 14, health: -3 },
        { id: 'cel_rare_anugerah', icon: '🏆', isRare: true, title: '🌟 PELUANG EMAS: Anugerah Ikon Hiburan Tahun Ini!', desc: 'PELUANG TERHAD: Anda dinobatkan sebagai bintang paling berpengaruh di pentas anugerah utama!', m1: 22, m2: -10, moneyUsd: 75000, fame: 20, followers: 120000, rep: 12 }
      ],
      dilemmas: [
        {
          id: 'sp_cel_cancel', icon: '🔥', title: 'Krisis Cancel Culture: Klip Lama Tular!',
          text: 'Seorang netizen memuat naik klip lama anda yang disunting separuh sehingga mencetuskan kemarahan ramai di media sosial!',
          choices: [
            { label: 'Tampil memohon maaf dengan ikhlas & jelaskan konteks penuh', hint: 'Cancel --, Karma ++, Reputasi pulih', m1: 6, m2: -18, karma: 12, rep: 6, outcome: 'Kematangan dan keikhlasan anda meredakan kemarahan dan meraih pujian ramai!' },
            { label: 'Muat naik bukti rakaman penuh tanpa suntingan', hint: 'Populariti ++, Risiko sederhana', m1: 14, m2: -10, fame: 12, followers: 30000, outcome: 'Kebenaran terbongkar dan penyebar fitnah dikecam netizen!' },
            { label: 'Lawan balik dengan sindiran pedas secara langsung!', hint: 'Populariti +, tetapi Cancel +++ & Reputasi --', m1: 8, m2: 24, karma: -14, rep: -8, outcome: 'Perang komen semakin panas dan beberapa penaja mula tarik diri!' }
          ]
        },
        {
          id: 'sp_cel_scam_sponsor', icon: '💰', title: 'Tawaran Tajaan Produk Meragukan Bernilai Besar!',
          text: 'Satu jenama suplemen yang belum disahkan keselamatannya menawarkan bayaran tajaan sangat lumayan untuk 3 hantaran.',
          choices: [
            { label: 'Tolak mentah-mentah demi keselamatan peminat anda', hint: 'Cancel --, Karma ++, Reputasi ++', m1: 8, m2: -12, karma: 16, rep: 8, outcome: 'Peminat memuji integriti anda apabila produk itu diharamkan sebulan kemudian!' },
            { label: 'Minta sijil ujian makmal sah dahulu sebelum mempertimbangkan', hint: 'Kepintaran +, Selamat', m1: 5, m2: -4, smarts: 4, outcome: 'Syarikat itu terus senyap — anda terselamat daripada skandal!' },
            { label: 'Terima bayaran penuh & muat naik iklan seperti diminta', hint: 'Wang +++, tetapi Cancel +++ & Karma ---', moneyUsd: 65000, m1: -6, m2: 28, karma: -22, rep: -10, outcome: 'Wang masuk penuh, tetapi ramai pembeli mengadu dan menuntut penjelasan anda!' }
          ]
        },
        {
          id: 'sp_cel_privacy', icon: '📸', title: 'Paparazi Mengekori Keluarga Anda Di Tempat Awam',
          text: 'Jurugambar hiburan merakam ahli keluarga anda tanpa izin ketika sedang makan malam.',
          choices: [
            { label: 'Tegur dengan tegas tetapi sopan demi melindungi privasi keluarga', hint: 'Reputasi ++, Karma +, Cancel -', m1: 8, m2: -6, karma: 8, rep: 7, outcome: 'Orang ramai menyokong pendirian anda mempertahankan privasi keluarga.' },
            { label: 'Lantik pengawal peribadi & peguam privasi media', hint: 'Selamat, Kos tunai', moneyUsd: -14000, m1: 4, m2: -8, stress: -8, outcome: 'Keluarga anda kini lebih selamat dan tenang daripada gangguan lensa.' },
            { label: 'Rampas kamera paparazi dalam keadaan marah!', hint: 'Cancel +++, Reputasi --, Risiko saman', m1: 4, m2: 26, moneyUsd: -18000, karma: -14, rep: -8, outcome: 'Video anda mengamuk tular dan anda terpaksa membayar ganti rugi kamera!' }
          ]
        }
      ]
    },

    // ========================================================================
    // 5. ATLET PRO & E-SUKAN
    // ========================================================================
    athlete: {
      id: 'athlete',
      icon: '🏅',
      title: 'Atlet Pro & E-Sukan',
      shortLabel: 'Atlet Pro',
      minAge: 14,
      maxAge: 26,
      offerHeadline: 'Pencari Bakat Kelab Profesional Mengesan Anda!',
      offerPitch: 'Jurulatih skuad profesional terpukau dengan refleks, stamina dan bakat semula jadi anda lalu menawarkan kontrak akademi pro! Peluang emas usia muda ini hanya hadir sekali seumur hidup.',
      metric1: { label: 'Prestasi Fizikal / Skil', icon: '⚡', init: 42, dangerHigh: false },
      metric2: { label: 'Risiko Kecederaan',       icon: '🩹', init: 12, dangerHigh: true },
      ranks: [
        { title: 'Bakat Muda Akademi',   annualUsd: 26000,  reqYears: 0, reqM1: 0,  prefix: '' },
        { title: 'Pemain Profesional',   annualUsd: 88000,  reqYears: 2, reqM1: 56, prefix: '' },
        { title: 'Bintang Antarabangsa', annualUsd: 225000, reqYears: 5, reqM1: 76, prefix: '' },
        { title: 'Legenda Dunia',        annualUsd: 480000, reqYears: 8, reqM1: 90, prefix: '' }
      ],
      exitWarning: 'Keluar daripada Mod Atlet Pro akan mengunci mod ini SELAMANYA bagi watak ini. Jika berhenti awal sebelum 8 tahun, anda tertakluk kepada yuran tebus kontrak kelab dan penurunan populariti; bersara secara terhormat selepas 8+ tahun menganugerahkan prestij Legenda Sukan & Reputasi Keluarga!',
      actions: [
        { id: 'ath_kem_luar_negara',icon: '✈️', title: 'Kem Latihan Intensif Luar Negara', desc: 'Berlatih bersama jurulatih elit dunia untuk melonjakkan prestasi.', m1: 13, m2: 6, health: 6, moneyUsd: -4500, stress: 5 },
        { id: 'ath_derbi_besar',    icon: '🏟️', title: 'Perlawanan Derbi Berprofil Tinggi', desc: 'Tampilkan aksi memukau di hadapan puluhan ribu penyokong!', m1: 12, m2: 9, moneyUsd: 28000, fame: 12, followers: 32000 },
        { id: 'ath_tajaan_sukan',   icon: '👟', title: 'Tajaan Jenama Kasut & Pakaian Sukan', desc: 'Tandatangan kontrak kasut edisi tandatangan peribadi anda!', m1: 5, m2: 0, moneyUsd: 42000, fame: 10, looks: 3, rep: 4 },
        { id: 'ath_pemulihan_hi',   icon: '🧊', title: 'Terapi Pemulihan & Fisioterapi Moden', desc: 'Rawatan krioterapi dan regangan pakar untuk menurunkan risiko cedera.', m1: 4, m2: -18, health: 10, moneyUsd: -3000, stress: -8 },
        { id: 'ath_runding_kontrak',icon: '📝', title: 'Runding Kontrak Baharu Bersama Kelab', desc: 'Gunakan statistik cemerlang anda untuk menuntut bonus penampilan.', m1: 6, m2: 2, moneyUsd: 35000, rep: 3 },
        { id: 'ath_motivasi_belia', icon: '💛', title: 'Klinik Sukan & Motivasi Belia Sekolah', desc: 'Kongsikan ilmu dan inspirasi kepada atlet muda negara.', m1: 4, m2: -4, karma: 14, rep: 8, happiness: 12 },
        { id: 'ath_analisis_taktik',icon: '🧠', title: 'Sesi Analisis Taktikal & Video Lawan', desc: 'Kaji kelemahan pihak lawan untuk menguasai gelanggang dengan bijak.', m1: 10, m2: -3, smarts: 5 },
        { id: 'ath_kejohanan_serantau',icon: '🏆', title: 'Sertai Kejohanan Terbuka Antarabangsa', desc: 'Harumkan nama negara di pentas kejohanan utama!', m1: 14, m2: 10, moneyUsd: 46000, fame: 14, rep: 7 },
        { id: 'ath_nutrisi_ketat',  icon: '🥗', title: 'Pelan Pemakanan & Disiplin Tidur Atlet', desc: 'Tingkatkan stamina puncak dan panjangkan usia kerjaya sukan anda.', m1: 8, m2: -10, health: 8, looks: 2 },
        { id: 'ath_suntikan_paksa', icon: '💉', title: 'Paksa Bermain Dengan Ubat Tahan Sakit', desc: 'Turun beraksi demi bonus menang walaupun badan belum pulih sepenuhnya!', m1: 12, m2: 24, moneyUsd: 32000, health: -10, stress: 10 },
        { id: 'ath_stream_latihan', icon: '🎮', title: 'Strim Langsung Latihan & Aksi Pemanasan', desc: 'Tarik ratusan ribu peminat sukan & e-sukan global.', m1: 6, m2: -2, fame: 8, followers: 28000, moneyUsd: 12000 },
        { id: 'ath_rare_piala_dunia',icon: '👑', isRare: true, title: '🌟 PELUANG EMAS: Pentas Final Kejohanan Dunia!', desc: 'PELUANG TERHAD: Anda melangkah ke perlawanan akhir paling berprestij dalam sejarah sukan!', m1: 22, m2: 10, moneyUsd: 135000, fame: 24, followers: 140000, rep: 15, happiness: 22 }
      ],
      dilemmas: [
        {
          id: 'sp_ath_injury_final', icon: '🩹', title: 'Kecederaan Hamstring Sehari Sebelum Final!',
          text: 'Fisioterapis memberi amaran risiko kecederaan jangka panjang jika anda bermain, tetapi pasukan amat memerlukan anda di final!',
          choices: [
            { label: 'Bermain separuh masa dengan strategi bijak & taktikal', hint: 'Prestasi ++, Reputasi ++, Risiko Cedera +10', m1: 14, m2: 10, fame: 14, rep: 7, moneyUsd: 35000, outcome: 'Aksi heroik anda membantu pasukan menang tanpa memburukkan kecederaan!' },
            { label: 'Utamakan kesihatan & sokong pasukan dari tepi padang', hint: 'Kecederaan --, Kesihatan ++', m1: 2, m2: -16, health: 10, karma: 6, outcome: 'Anda pulih sepenuhnya untuk musim hadapan yang lebih gemilang.' },
            { label: 'Ambil suntikan tahan sakit & bermain penuh 100%!', hint: 'Prestasi +++, tetapi Kecederaan +++ & Kesihatan --', m1: 18, m2: 28, health: -12, fame: 18, moneyUsd: 48000, outcome: 'Anda menjaringkan mata kemenangan tetapi terpaksa diusung keluar padang!' }
          ]
        },
        {
          id: 'sp_ath_match_fix', icon: '💵', title: 'Sindiket Menawarkan Wang Besar Untuk Mengatur Perlawanan!',
          text: 'Seorang ejen misteri menghubungi anda menawarkan wang tunai gergasi jika anda sengaja membuat kesilapan pada suku akhir.',
          choices: [
            { label: 'Tolak tegas & laporkan segera kepada badan integriti sukan!', hint: 'Karma +++, Reputasi Keluarga +++, Populariti ++', m1: 8, m2: -4, karma: 20, rep: 12, fame: 12, outcome: 'Integriti anda disanjung tinggi seluruh dunia sukan!' },
            { label: 'Abaikan mesej & sekat nombor tersebut', hint: 'Selamat, tiada risiko', m1: 4, m2: 0, karma: 6, outcome: 'Anda kekal fokus bermain dengan penuh semangat kesukanan.' },
            { label: 'Terima wang gelap & sengaja terlepas peluang mudah', hint: 'Wang +++, tetapi Karma --- & Reputasi ---', moneyUsd: 85000, m1: -12, m2: 6, karma: -28, rep: -14, outcome: 'Wang besar masuk tetapi persembahan janggal anda mencetuskan syak wasangka!' }
          ]
        },
        {
          id: 'sp_ath_transfer', icon: '✈️', title: 'Tawaran Perpindahan Kelab Gergasi Luar Negara!',
          text: 'Kelab ternama menawarkan gaji lebih tinggi, namun kelab asal yang membesarkan bakat anda merayu anda kekal.',
          choices: [
            { label: 'Terima cabaran kelab gergasi demi pentas dunia!', hint: 'Prestasi ++, Wang +++, Populariti ++', moneyUsd: 58000, m1: 14, m2: 4, fame: 14, outcome: 'Anda mencipta nama di liga paling kompetitif di dunia!' },
            { label: 'Kekal setia bersama kelab asal sebagai kapten pasukan', hint: 'Karma ++, Reputasi Keluarga ++, Gembira ++', moneyUsd: 22000, m1: 8, m2: -4, karma: 12, rep: 10, happiness: 14, outcome: 'Penyokong menobatkan anda sebagai legenda setia kelab!' },
            { label: 'Gunakan tawaran itu untuk menekan kelab asal naikkan gaji', hint: 'Wang ++, Kepintaran +', moneyUsd: 44000, m1: 6, m2: 0, smarts: 4, outcome: 'Kelab asal bersetuju menaikkan pakej gaji anda secara signifikan.' }
          ]
        }
      ]
    }
  }
};
