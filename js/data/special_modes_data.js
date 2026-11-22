/* ==========================================================================
   WorldLife — Pangkalan Data 10 Mod Khas "Peluang Sekali Seumur Hidup"
   1. Politik & Kepimpinan Negara  2. Usahawan & CEO  3. Jerung Pasaran / Trader Pro
   4. Selebriti & Content Creator  5. Atlet Pro & E-Sukan
   6. Sindiket & Mafia             7. Pemimpin Pertubuhan Rahsia / Kultus
   8. Perisik Rahsia & Operasi Elit 9. Kerabat Diraja / Royalty
   10. Pengembara & Pemburu Rekod Dunia
   Bahasa Melayu — Sifar Placeholder
   ========================================================================== */

window.SpecialModesData = {
  // Negara beraja / monarki berdaulat daripada pangkalan data 195 negara (untuk pencetus Kelahiran Diraja 2–4%)
  MONARCHY_COUNTRY_IDS: [
    'MY', 'GB', 'JP', 'TH', 'BN', 'SA', 'AE', 'QA', 'KW', 'BH', 'OM', 'JO', 'MA',
    'ES', 'SE', 'NO', 'DK', 'NL', 'BE', 'LU', 'MC', 'LI', 'AD', 'KH', 'BT', 'TO', 'SZ', 'LS'
  ],

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
        { id: 'pol_semak_aduan',   icon: '📋', risk: 'low', baseSuccess: 92, title: 'Semakan Aduan Rakyat Di Pusat Khidmat', desc: 'Tugasan rutin mendengar masalah penduduk setempat dan membantu urusan borang kebajikan.', m1: 4, m2: -2, karma: 4, rep: 2, stress: 1 },
        { id: 'pol_mesyuarat_jawatankuasa', icon: '🗂️', risk: 'low', baseSuccess: 90, title: 'Mesyuarat Jawatankuasa Dasar Harian', desc: 'Teliti kertas kerja kementerian dan selaraskan peruntukan kecil daerah secara teratur.', m1: 4, m2: -1, smarts: 2, rep: 1, stress: 1 },
        { id: 'pol_ziarah_komuniti', icon: '🕌', risk: 'low', baseSuccess: 93, title: 'Santuni Majlis Kenduri & Komuniti Setempat', desc: 'Hadir beramah mesra bersama warga emas dan belia di kawasan parlimen.', m1: 5, m2: -2, karma: 4, happiness: 3 },
        { id: 'pol_kajian_data_undi', icon: '📊', risk: 'low', baseSuccess: 89, title: 'Analisis Kajian Sentimen Pengundi Rutin', desc: 'Semak laporan bancian isu kos sara hidup bersama pasukan penyelidik.', m1: 3, m2: -2, smarts: 3, stress: 1 },
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
        { id: 'ceo_semak_kpi',      icon: '📊', risk: 'low', baseSuccess: 92, title: 'Semakan Laporan KPI & Aliran Tunai Mingguan', desc: 'Pantau penyata kewangan rutin dan selaraskan bajet operasi harian bersama ketua jabatan.', m1: 4, m2: 2, moneyUsd: 5500, smarts: 2 },
        { id: 'ceo_townhall_staf',  icon: '☕', risk: 'low', baseSuccess: 93, title: 'Sesi Townhall Santai & Sarapan Bersama Staf', desc: 'Dengar maklum balas pekerja secara terbuka bagi mengekalkan suasana kerja harmoni.', m1: 3, m2: 6, karma: 4, stress: -2 },
        { id: 'ceo_kemas_sop',      icon: '📁', risk: 'low', baseSuccess: 90, title: 'Penambahbaikan SOP Khidmat Pelanggan', desc: 'Perkemas proses maklum balas pelanggan untuk mengekalkan langganan sedia ada.', m1: 4, m2: 3, moneyUsd: 4800, rep: 2 },
        { id: 'ceo_latihan_dalaman',icon: '🎓', risk: 'low', baseSuccess: 91, title: 'Bengkel Latihan Kemahiran Pasukan Dalaman', desc: 'Anjur latihan mingguan untuk meningkatkan kecekapan jurutera dan jurujual.', m1: 4, m2: 5, smarts: 2 },
        { id: 'ceo_lancar_produk',  icon: '🚀', title: 'Lancar Produk Edisi Baharu', desc: 'Perkenalkan produk utama yang dinantikan pasaran tempatan dan serantau.', m1: 11, m2: 4, moneyUsd: 24000, fame: 6, stress: 6 },
        { id: 'ceo_pitch_vc',       icon: '💰', title: 'Pitch Siri Pelaburan Kepada VC', desc: 'Bentangkan pertumbuhan syarikat untuk menyuntik dana pengembangan.', m1: 13, m2: 2, moneyUsd: 45000, smarts: 3, stress: 7 },
        { id: 'ceo_eksport_global', icon: '🚢', title: 'Runding Kontrak Eksport Antarabangsa', desc: 'Tembusi pasaran luar negara dengan pengedar strategik.', m1: 10, m2: 3, moneyUsd: 36000, rep: 5, stress: 6 },
        { id: 'ceo_perang_harga',   icon: '⚔️', title: 'Lancarkan Perang Harga Dengan Pesaing', desc: 'Potong margin sementara untuk merampas bahagian pasaran pesaing.', m1: 8, m2: -6, moneyUsd: -8000, stress: 8 },
        { id: 'ceo_pemasaran_gerila',icon: '📣', title: 'Kempen Pemasaran Gerila Viral', desc: 'Cipta iklan kreatif kos rendah yang meletup di media sosial.', m1: 8, m2: 5, fame: 9, followers: 15000, moneyUsd: 14000 },
        { id: 'ceo_audit_syarikat', icon: '📋', risk: 'low', baseSuccess: 89, title: 'Audit Dalaman & Kecekapan Operasi', desc: 'Tutup kebocoran kos dan kukuhkan tadbir urus korporat.', m1: 5, m2: 4, smarts: 3, karma: 5, rep: 2 },
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
        { id: 'fm_rebalance_rutin', icon: '⚖️', risk: 'low', baseSuccess: 92, title: 'Imbangan Semula Portfolio Dividen & Bon', desc: 'Laraskan pegangan aset berisiko rendah untuk menjana dividen stabil kepada pelabur.', m1: 4, m2: -3, moneyUsd: 7500, smarts: 2 },
        { id: 'fm_laporan_klien',   icon: '📑', risk: 'low', baseSuccess: 93, title: 'Bentang Laporan Suku Tahunan Kepada Pelabur', desc: 'Kemas kini prestasi dana secara telus dan kukuhkan kepercayaan pemegang unit.', m1: 4, m2: -4, rep: 2, karma: 3 },
        { id: 'fm_kajian_sektor',   icon: '🔍', risk: 'low', baseSuccess: 90, title: 'Analisis Penyata Kewangan Syarikat Blue-Chip', desc: 'Semak kunci kira-kira saham kukuh sebelum membuat pelaburan jangka panjang.', m1: 4, m2: -2, moneyUsd: 6200, smarts: 3 },
        { id: 'fm_audit_patuh',    icon: '🛡️', risk: 'low', baseSuccess: 94, title: 'Semakan Pematuhan & Audit Regulator', desc: 'Pastikan semua rekod dagangan bersih dan sejukkan perhatian pengawal selia.', m1: 3, m2: -12, karma: 6, rep: 3, stress: -3 },
        { id: 'fm_analisis_makro', icon: '📊', title: 'Dagangan Makro Mata Wang & Bon', desc: 'Jangka perubahan kadar faedah bank pusat dengan ketepatan tinggi.', m1: 10, m2: 1, moneyUsd: 26000, smarts: 4, stress: 6 },
        { id: 'fm_short_saham',    icon: '📉', title: 'Short-Selling Syarikat Terlebih Nilai', desc: 'Dedahkan laporan lemah syarikat gelembung dan kaut untung semasa jatuh.', m1: 12, m2: 6, moneyUsd: 38000, fame: 5, stress: 8 },
        { id: 'fm_algo_bot',       icon: '🤖', title: 'Bina Algoritma Dagangan Frekuensi Tinggi', desc: 'Automasi strategi kuantitatif untuk keuntungan mikro sesaat.', m1: 11, m2: 2, moneyUsd: 32000, smarts: 5, stress: 5 },
        { id: 'fm_insider_tip',    icon: '🤫', title: 'Gunakan Maklumat Dalaman (Insider Trading)', desc: 'Beli opsyen saham sehari sebelum pengumuman penggabungan rahsia!', m1: 18, m2: 26, moneyUsd: 95000, karma: -24, flag: 'insider_trading', stress: 10 },
        { id: 'fm_tarik_bilionair',icon: '🥂', title: 'Bentang Prestasi Dana Kepada Bilionair', desc: 'Yakinkan keluarga kaya raya untuk memasukkan dana baharu ke dalam portfolio.', m1: 13, m2: 0, moneyUsd: 22000, rep: 4 },
        { id: 'fm_dagang_komoditi',icon: '🛢️', title: 'Spekulasi Niaga Hadapan Emas & Minyak', desc: 'Kaut peluang pergerakan harga tenaga dunia.', m1: 9, m2: 3, moneyUsd: 30000, stress: 7 },
        { id: 'fm_lindung_krisis', icon: '☂️', risk: 'low', baseSuccess: 89, title: 'Strategi Lindung Nilai (Hedging) Risiko', desc: 'Lindungi modal pelabur daripada kejutan pasaran mengejut.', m1: 5, m2: -5, smarts: 3, rep: 3, stress: -4 },
        { id: 'fm_dana_kripto',    icon: '₿',  title: 'Buka Meja Arbitraj Aset Digital', desc: 'Eksploitasi perbezaan harga antara bursa kripto global.', m1: 11, m2: 7, moneyUsd: 42000, stress: 8 },
        { id: 'fm_sidang_kewangan',icon: '🎤', title: 'Panelis Utama Sidang Kewangan Global', desc: 'Pandangan pasaran anda menggerakkan indeks bursa seluruh rantau!', m1: 8, m2: -2, fame: 11, rep: 6 },
        { id: 'fm_ethical_fund',   icon: '🌿', title: 'Lancar Dana Pelaburan Etika & Lestari ESG', desc: 'Tarik pelabur institusi beretika dengan pulangan mantap.', m1: 9, m2: -6, karma: 10, rep: 6, moneyUsd: 20000 },
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
        { id: 'cel_vlog_harian',    icon: '📱', risk: 'low', baseSuccess: 93, title: 'Muat Naik Vlog Rutin & Di Sebalik Tabir', desc: 'Kongsikan rutin harian yang santai untuk mengekalkan interaksi mesra bersama peminat.', m1: 4, m2: -2, moneyUsd: 4500, followers: 8500, happiness: 3 },
        { id: 'cel_balas_komen',    icon: '💬', risk: 'low', baseSuccess: 94, title: 'Sesi Soal Jawab (Q&A) Mesra Peminat', desc: 'Luangkan masa membalas komen dan menghargai kelab peminat setia anda.', m1: 4, m2: -5, karma: 4, followers: 6000, stress: -2 },
        { id: 'cel_kelas_vokal',    icon: '🎭', risk: 'low', baseSuccess: 91, title: 'Latihan Vokal, Lakonan & Penampilan Diri', desc: 'Asah bakat seni di studio latihan secara konsisten tanpa tekanan kamera.', m1: 4, m2: -2, looks: 2, smarts: 2 },
        { id: 'cel_tepis_paparazi',icon: '🕶️', risk: 'low', baseSuccess: 90, title: 'Tepis Gosip Paparazi Dengan Matang', desc: 'Kawal naratif media dengan kenyataan tenang dan berkelas.', m1: 4, m2: -8, rep: 3, stress: -4 },
        { id: 'cel_kolab_mega',    icon: '🎬', title: 'Kolaborasi Konten Mega Bersama Bintang', desc: 'Gabungkan dua pangkalan peminat dalam video bajet besar!', m1: 12, m2: 2, moneyUsd: 22000, followers: 48000, fame: 10 },
        { id: 'cel_karpet_merah',  icon: '✨', title: 'Hadir Acara Karpet Merah & Gala', desc: 'Tampil memukau di hadapan jurugambar antarabangsa.', m1: 9, m2: 1, looks: 4, fame: 9, rep: 4, followers: 22000 },
        { id: 'cel_jenama_sendiri',icon: '👜', title: 'Lancar Jenama Fesyen & Kosmetik Sendiri', desc: 'Jualan hari pertama habis licin diserbu peminat setia!', m1: 10, m2: 3, moneyUsd: 55000, fame: 8, rep: 5 },
        { id: 'cel_live_amal',     icon: '💛', title: 'Siaran Langsung Amal 12 Jam', desc: 'Kutip ratusan ribu untuk hospital dan keluarga memerlukan.', m1: 11, m2: -12, karma: 16, rep: 8, followers: 32000, happiness: 12 },
        { id: 'cel_ujibakat_filem',icon: '🎥', title: 'Ujibakat Produksi Filem Antarabangsa', desc: 'Kembangkan bakat daripada skrin telefon ke layar perak dunia!', m1: 13, m2: 0, moneyUsd: 38000, fame: 12, rep: 5 },
        { id: 'cel_single_hit',    icon: '🎵', title: 'Lancar Lagu Single & Video Muzik', desc: 'Lagu anda menjuarai carta strim digital seluruh negara!', m1: 14, m2: 2, moneyUsd: 34000, followers: 55000, fame: 12 },
        { id: 'cel_tajaan_mewah',  icon: '⌚', title: 'Kontrak Duta Jenama Mewah Global', desc: 'Wajah anda menghiasi papan iklan di ibu kota utama dunia.', m1: 10, m2: 2, moneyUsd: 48000, looks: 3, rep: 4 },
        { id: 'cel_drama_gimik',   icon: '🔥', title: 'Cipta Gimik Kontroversi Untuk Tontonan', desc: 'Tingkatkan trafik mendadak tetapi menaikkan risiko kecaman netizen!', m1: 15, m2: 20, moneyUsd: 26000, followers: 60000, karma: -12 },
        { id: 'cel_podcast_jujur', icon: '🎙️', risk: 'low', baseSuccess: 89, title: 'Temu Bual Podcast Hati Ke Hati', desc: 'Kongsi perjuangan sebenar hidup anda dan menangi hati penonton.', m1: 6, m2: -7, karma: 5, rep: 4, happiness: 6 },
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
        { id: 'ath_latihan_pagi',    icon: '🏃', risk: 'low', baseSuccess: 93, title: 'Latihan Stamina & Regangan Rutin Pagi', desc: 'Kekalkan kecergasan asas dan koordinasi otot bersama jurulatih kecergasan kelab.', m1: 4, m2: -4, health: 4, stress: -2 },
        { id: 'ath_pemulihan_hi',   icon: '🧊', risk: 'low', baseSuccess: 94, title: 'Terapi Pemulihan & Fisioterapi Moden', desc: 'Rawatan krioterapi dan regangan pakar untuk menurunkan risiko cedera.', m1: 3, m2: -14, health: 8, moneyUsd: -1500, stress: -6 },
        { id: 'ath_motivasi_belia', icon: '💛', risk: 'low', baseSuccess: 92, title: 'Klinik Sukan & Motivasi Belia Sekolah', desc: 'Kongsikan ilmu dan inspirasi kepada atlet muda negara.', m1: 3, m2: -3, karma: 10, rep: 5, happiness: 8 },
        { id: 'ath_analisis_taktik',icon: '🧠', risk: 'low', baseSuccess: 90, title: 'Sesi Analisis Taktikal & Video Lawan', desc: 'Kaji kelemahan pihak lawan untuk menguasai gelanggang dengan bijak.', m1: 6, m2: -3, smarts: 4 },
        { id: 'ath_nutrisi_ketat',  icon: '🥗', risk: 'low', baseSuccess: 93, title: 'Pelan Pemakanan & Disiplin Tidur Atlet', desc: 'Tingkatkan stamina puncak dan panjangkan usia kerjaya sukan anda.', m1: 5, m2: -8, health: 6, looks: 2 },
        { id: 'ath_kem_luar_negara',icon: '✈️', title: 'Kem Latihan Intensif Luar Negara', desc: 'Berlatih bersama jurulatih elit dunia untuk melonjakkan prestasi.', m1: 13, m2: 6, health: 6, moneyUsd: -4500, stress: 5 },
        { id: 'ath_derbi_besar',    icon: '🏟️', title: 'Perlawanan Derbi Berprofil Tinggi', desc: 'Tampilkan aksi memukau di hadapan puluhan ribu penyokong!', m1: 12, m2: 9, moneyUsd: 28000, fame: 12, followers: 32000 },
        { id: 'ath_tajaan_sukan',   icon: '👟', title: 'Tajaan Jenama Kasut & Pakaian Sukan', desc: 'Tandatangan kontrak kasut edisi tandatangan peribadi anda!', m1: 5, m2: 0, moneyUsd: 42000, fame: 10, looks: 3, rep: 4 },
        { id: 'ath_runding_kontrak',icon: '📝', title: 'Runding Kontrak Baharu Bersama Kelab', desc: 'Gunakan statistik cemerlang anda untuk menuntut bonus penampilan.', m1: 6, m2: 2, moneyUsd: 35000, rep: 3 },
        { id: 'ath_kejohanan_serantau',icon: '🏆', title: 'Sertai Kejohanan Terbuka Antarabangsa', desc: 'Harumkan nama negara di pentas kejohanan utama!', m1: 14, m2: 10, moneyUsd: 46000, fame: 14, rep: 7 },
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
    },

    // ========================================================================
    // 6. SINDIKET & MAFIA
    // ========================================================================
    mafia: {
      id: 'mafia',
      icon: '🕶️',
      title: 'Sindiket & Mafia',
      shortLabel: 'Mafia',
      minAge: 18,
      maxAge: 62,
      offerHeadline: 'Jemputan Sulit Keluarga Bawah Tanah!',
      offerPitch: 'Seorang utusan berpakaian sut hitam menyerahkan sekeping kad tanpa nama di sebuah lorong sunyi. Ketua sindiket kota mengenali keberanian anda dan menawarkan tempat dalam keluarga — tetapi ingat, sekali masuk amat sukar untuk keluar!',
      metric1: { label: 'Hormat Geng',          icon: '🎩', init: 40, dangerHigh: false },
      metric2: { label: 'Tekanan Polis (Heat)', icon: '🚨', init: 18, dangerHigh: true },
      ranks: [
        { title: 'Orang Suruhan',           annualUsd: 42000,  reqYears: 0, reqM1: 0,  prefix: '' },
        { title: 'Ketua Kawasan',           annualUsd: 105000, reqYears: 2, reqM1: 58, prefix: '' },
        { title: 'Orang Kanan (Underboss)', annualUsd: 220000, reqYears: 5, reqM1: 72, prefix: '' },
        { title: 'Ketua Sindiket (Godfather)', annualUsd: 450000, reqYears: 9, reqM1: 86, prefix: '' }
      ],
      exitWarning: 'BAHAYA TERTINGGI! Meninggalkan sindiket memerlukan bayaran berat "Wang Cuci Tangan" serta membawa risiko 35–50% diserang hendap (cedera parah, risiko maut di pangkat Godfather, ATAU pembelot melapor kepada polis hingga anda diburu/didakwa di Mahkamah!). Mod Mafia akan dikunci SELAMANYA.',
      actions: [
        { id: 'maf_ronda_kawasan',     icon: '🚶', risk: 'low', baseSuccess: 92, title: 'Rondaan Rutin & Pantau Sempadan Wilayah', desc: 'Tinjau keadaan kedai dan lorong di kawasan jagaan tanpa mencetuskan kekecohan.', m1: 4, m2: -3, moneyUsd: 4200, stress: 1 },
        { id: 'maf_urus_restoran',     icon: '🍝', risk: 'low', baseSuccess: 93, title: 'Selia Operasi Restoran & Dobi Hadapan', desc: 'Urus akaun perniagaan sah milik keluarga bagi menutup perhatian pihak berkuasa.', m1: 3, m2: -6, moneyUsd: 5500, smarts: 2 },
        { id: 'maf_jamuan_keluarga',   icon: '🍷', risk: 'low', baseSuccess: 94, title: 'Majlis Makan Malam Tertutup Keluarga', desc: 'Kukuhkan kesetiaan ahli kanan dan selesaikan pertikaian dalaman secara aman.', m1: 6, m2: -4, happiness: 5 },
        { id: 'maf_jaga_komuniti',     icon: '🏘️', risk: 'low', baseSuccess: 91, title: 'Derma Rahsia Kepada Penduduk Kawasan', desc: 'Bina sokongan penduduk tempatan supaya mereka menutup mulut di depan polis.', m1: 5, m2: -8, moneyUsd: -4000, karma: 5 },
        { id: 'maf_latih_pengawal',    icon: '🛡️', risk: 'low', baseSuccess: 90, title: 'Perkukuh Skuad Pengawal Peribadi', desc: 'Latih orang kepercayaan untuk menghadapi serangan balas musuh.', m1: 5, m2: -3, health: 4, moneyUsd: -3500, stress: -4 },
        { id: 'maf_wang_perlindungan', icon: '💵', title: 'Kutip Wang Perlindungan Wilayah', desc: 'Kutip bayaran bulanan daripada kelab malam dan gudang di kawasan jajahan anda.', m1: 9, m2: 10, moneyUsd: 28000, karma: -12, notoriety: 8 },
        { id: 'maf_cuci_wang',         icon: '🧺', title: 'Operasi Cuci Wang Melalui Perniagaan Sah', desc: 'Salurkan dana gelap melalui rangkaian restoran dan hartanah untuk sejukkan Heat.', m1: 6, m2: -12, moneyUsd: 18000, smarts: 3, karma: -8 },
        { id: 'maf_buru_pembelot',     icon: '🎯', title: 'Buru Pembelot & Informan Rahsia', desc: 'Kesan kebocoran maklumat dalaman sebelum serbuan polis berlaku.', m1: 12, m2: -8, notoriety: 10, stress: 10, karma: -14 },
        { id: 'maf_perang_wilayah',    icon: '⚔️', title: 'Serbu Wilayah Sindiket Saingan', desc: 'Rampas laluan penyeludupan utama demi kuasa dan rasa hormat geng.', m1: 15, m2: 18, moneyUsd: 46000, health: -8, notoriety: 15, karma: -18 },
        { id: 'maf_seludup_pelabuhan', icon: '🚢', title: 'Seludup Kontena Barangan Mewah Di Pelabuhan', desc: 'Uruskan laluan gelap kastam untuk barangan bernilai jutaan.', m1: 10, m2: 12, moneyUsd: 54000, karma: -14, notoriety: 10 },
        { id: 'maf_rasuah_pegawai',    icon: '🤝', title: 'Bayar Sagu Hati Pegawai Berkuasa', desc: 'Gunakan wang untuk melengahkan siasatan dan memadam jejak sindiket.', m1: 5, m2: -16, moneyUsd: -18000, karma: -12 },
        { id: 'maf_kasino_bawah_tanah',icon: '🎲', title: 'Buka Kasino VIP Bawah Tanah', desc: 'Tarik hartawan dan tokoh gelap untuk menjana aliran tunai konsisten.', m1: 11, m2: 11, moneyUsd: 62000, karma: -12, notoriety: 9 },
        { id: 'maf_rampas_lori',       icon: '🚚', title: 'Pintasan Konvoi Barangan Elektronik', desc: 'Operasi kilat tengah malam tanpa meninggalkan saksi.', m1: 9, m2: 14, moneyUsd: 38000, karma: -15, notoriety: 12 },
        { id: 'maf_runding_damai',     icon: '🕊️', title: 'Sidang Damai Antara 5 Keluarga', desc: 'Bahagikan sempadan operasi secara diplomatik bagi mengelak pertumpahan darah.', m1: 13, m2: -10, smarts: 4, karma: 2 },
        { id: 'maf_rare_rompakan_abad',icon: '💎', isRare: true, title: '🌟 ROMPAKAN ABAD INI: Bilik Kebal Berlian Antarabangsa!', desc: 'PELUANG EMAS: Operasi berprofil tinggi paling licik dalam sejarah dunia bawah!', m1: 22, m2: 20, moneyUsd: 165000, notoriety: 22, karma: -22, stress: 14 }
      ],
      dilemmas: [
        {
          id: 'sp_maf_snitch', icon: '🐀', title: 'Dilema Sindiket: Sahabat Lama Jadi Informan Polis!',
          text: 'Risikan dalaman membuktikan rakan seperjuangan yang membesar bersama anda sedang membekalkan rakaman rahsia kepada detektif.',
          choices: [
            { label: 'Beri amaran keras & halau dia jauh ke luar negara', hint: 'Hormat +, Tekanan Polis -, Karma +', m1: 6, m2: -10, karma: 8, outcome: 'Dia melarikan diri dengan ketakutan dan semua rakaman berjaya dimusnahkan.' },
            { label: 'Umpan dia dengan maklumat palsu untuk kelirukan polis', hint: 'Hormat ++, Tekanan Polis --, Kepintaran ++', m1: 12, m2: -16, smarts: 5, outcome: 'Operasi serbuan polis menemui bilik kosong — kebijaksanaan anda dipuji ketua!' },
            { label: 'Hapuskan ancaman secara muktamad tanpa belas kasihan', hint: 'Hormat +++, tetapi Tekanan Polis +++ & Karma ---', m1: 18, m2: 20, karma: -28, notoriety: 18, flag: 'mafia_blood', outcome: 'Seluruh dunia bawah gerun mendengar ketegasan anda, namun polis kini memburu anda lebih rapat.' }
          ]
        },
        {
          id: 'sp_maf_turf_war', icon: '🔥', title: 'Perang Wilayah Meletus Di Pelabuhan!',
          text: 'Sindiket luar cuba merampas gudang utama anda dan mencabar kepimpinan keluarga di hadapan semua ahli.',
          choices: [
            { label: 'Lancar serangan balas taktikal pada waktu subuh', hint: 'Hormat +++, Wang ++, Risiko Cedera & Heat ++', m1: 16, m2: 18, moneyUsd: 45000, health: -10, notoriety: 14, outcome: 'Gudang kembali ke tangan anda — musuh berundur dengan kekalahan teruk!' },
            { label: 'Tawarkan perkongsian untung 20% demi keamanan jangka panjang', hint: 'Hormat +, Tekanan Polis --, Wang +', m1: 7, m2: -12, moneyUsd: 22000, smarts: 4, outcome: 'Perjanjian damai mengelakkan serbuan besar-besaran pihak berkuasa.' },
            { label: 'Bocor lokasi gudang musuh kepada polis secara tanpa nama', hint: 'Tekanan Polis -, Hormat ++, Kepintaran +', m1: 10, m2: -8, smarts: 5, karma: -10, outcome: 'Polis menyerbu markas pesaing anda dan anda mengambil alih wilayah mereka dengan mudah!' }
          ]
        },
        {
          id: 'sp_maf_launder_bank', icon: '🏦', title: 'Tawaran Pengurus Bank Korup!',
          text: 'Seorang pengurus bank antarabangsa menawarkan saluran cuci wang bernilai jutaan dengan komisen 15%, tetapi audit kewangan mungkin datang bila-bila masa.',
          choices: [
            { label: 'Gunakan saluran bank untuk bersihkan semua dana gelap', hint: 'Wang +++, Tekanan Polis --, risiko kecil', m1: 10, m2: -14, moneyUsd: 80000, karma: -14, outcome: 'Akaun sah anda kini berkilat bersih dengan aliran tunai yang kukuh!' },
            { label: 'Guna hanya separuh & simpan selebihnya dalam aset fizikal', hint: 'Seimbang: Wang ++, Tekanan Polis -', m1: 8, m2: -8, moneyUsd: 40000, smarts: 4, outcome: 'Langkah berhati-hati anda melindungi sindiket daripada risiko audit mengejut.' },
            { label: 'Tolak tawaran — jangan percaya orang luar!', hint: 'Hormat +, selamat daripada perangkap', m1: 5, m2: -4, karma: 2, outcome: 'Ternyata pengurus bank itu memang di bawah pemantauan agensi kewangan!' }
          ]
        },
        {
          id: 'sp_maf_racket_shop', icon: '🏪', title: 'Pemilik Kedai Keluarga Enggan Membayar!',
          text: 'Seorang warga emas pemilik kedai roti di wilayah anda enggan membayar wang perlindungan kerana perniagaannya hampir muflis.',
          choices: [
            { label: 'Kecualikan dia & lindungi kedainya secara percuma', hint: 'Karma ++, Tekanan Polis --, Hormat +', m1: 6, m2: -10, karma: 14, rep: 4, outcome: 'Penduduk kawasan menghormati belas ihsan anda dan tidak lagi takut pada nama keluarga.' },
            { label: 'Beri pinjaman modal kecil untuk bantu kedainya bangkit', hint: 'Wang -, Karma +, Hormat ++', m1: 10, m2: -6, moneyUsd: -8000, karma: 10, outcome: 'Kedainya kembali maju dan dia menjadi sekutu paling setia di jalan itu.' },
            { label: 'Paksa bayar juga sebagai contoh kepada peniaga lain', hint: 'Wang +, Hormat +, tetapi Karma --- & Heat ++', m1: 8, m2: 14, moneyUsd: 15000, karma: -22, notoriety: 10, outcome: 'Semua kedai kini membayar tepat pada masanya kerana ketakutan, namun aduan polis meningkat.' }
          ]
        }
      ]
    },

    // ========================================================================
    // 7. PEMIMPIN PERTUBUHAN RAHSIA / KULTUS
    // ========================================================================
    cult: {
      id: 'cult',
      icon: '🔮',
      title: 'Pemimpin Pertubuhan Rahsia / Kultus',
      shortLabel: 'Kultus',
      minAge: 20,
      maxAge: 75,
      offerHeadline: 'Pengikut Misteri Mengangkat Anda Sebagai Guru!',
      offerPitch: 'Ucapan karismatik anda tentang "pencerahan jiwa dan kekayaan sejagat" tular dalam sebuah kumpulan eksklusif. Puluhan pengikut kaya kini merayu anda memimpin pertubuhan rahsia mereka!',
      metric1: { label: 'Kesetiaan Pengikut',       icon: '🕯️', init: 50, dangerHigh: false },
      metric2: { label: 'Perhatian Pihak Berkuasa', icon: '🚔', init: 14, dangerHigh: true },
      ranks: [
        { title: 'Pengasas Komuniti Eksklusif', annualUsd: 48000,  reqYears: 0, reqM1: 0,  prefix: '' },
        { title: 'Guru Agung',                  annualUsd: 120000, reqYears: 2, reqM1: 60, prefix: '' },
        { title: 'Pemimpin Markas Terpencil',   annualUsd: 240000, reqYears: 5, reqM1: 74, prefix: '' },
        { title: 'Ikon Pertubuhan Global',      annualUsd: 420000, reqYears: 9, reqM1: 86, prefix: '' }
      ],
      exitWarning: 'Keluar daripada pertubuhan rahsia mencetuskan tindak balas pengikut fanatik — Reputasi Keluarga (-12%) & Karma (-20) merosot mendadak, ditambah risiko tinggi saman penipuan bernilai besar ATAU serbuan polis ke Mahkamah! Mod ini akan dikunci SELAMANYA.',
      actions: [
        { id: 'clt_meditasi_pagi',  icon: '🧘', risk: 'low', baseSuccess: 93, title: 'Kelas Meditasi & Pernafasan Harian', desc: 'Bimbing sesi ketenangan minda pagi bersama ahli komuniti dalam suasana aman.', m1: 4, m2: -3, moneyUsd: 4000, stress: -4 },
        { id: 'clt_kebun_organik',  icon: '🌿', risk: 'low', baseSuccess: 94, title: 'Projek Kebun Organik & Sara Diri Markas', desc: 'Aktiviti bercucuk tanam bersama pengikut yang menampilkan imej komuniti sihat.', m1: 4, m2: -5, health: 3, karma: 3 },
        { id: 'clt_amal_awam',      icon: '🍲', risk: 'low', baseSuccess: 92, title: 'Program Dapur Percuma Untuk Imej Awam', desc: 'Tunjukkan sisi kebajikan pertubuhan bagi menenangkan pihak berkuasa.', m1: 5, m2: -12, moneyUsd: -5000, karma: 8, rep: 4 },
        { id: 'clt_buletin_dalaman',icon: '📜', risk: 'low', baseSuccess: 90, title: 'Edar Risalah Falsafah & Jadual Mingguan', desc: 'Susun jadual kelas motivasi dan kutip yuran keahlian asas secara teratur.', m1: 4, m2: -2, moneyUsd: 5200, smarts: 2 },
        { id: 'clt_retret_hutan',   icon: '🏕️', title: 'Anjur Retret Pencerahan Di Hutan Terpencil', desc: 'Kumpul pengikut untuk meditasi 7 hari tanpa telefon bimbit.', m1: 12, m2: 5, moneyUsd: 26000, stress: -5 },
        { id: 'clt_derma_mewah',    icon: '💎', title: 'Kempen "Sumbangan Pembersihan Harta"', desc: 'Galakkan pengikut kaya menderma jam mewah dan dana demi ketenangan jiwa.', m1: -3, m2: 14, moneyUsd: 58000, karma: -16, flag: 'cult_fraud' },
        { id: 'clt_buku_ajaran',    icon: '📖', title: 'Terbit Buku Falsafah & Rahsia Alam', desc: 'Jual buku kulit keras edisi terhad berharga mahal kepada pengikut baharu.', m1: 10, m2: 2, moneyUsd: 32000, fame: 10, smarts: 3 },
        { id: 'clt_upacara_bulan',  icon: '🌕', title: 'Upacara Lilin Tengah Malam Eksklusif', desc: 'Ritual penuh simbolik dan jubah serba putih yang mengukuhkan kesetiaan.', m1: 13, m2: 6, fame: 6, karma: -6 },
        { id: 'clt_rekrut_selebriti',icon:'🌟', title: 'Rekrut Selebriti & Jutawan Muda', desc: 'Jemput tokoh terkenal menghadiri sesi VIP tertutup pertubuhan.', m1: 11, m2: 8, moneyUsd: 45000, fame: 14 },
        { id: 'clt_bina_markas',    icon: '🏛️', title: 'Bina Kompleks Markas Kalis Dunia Luar', desc: 'Beli tanah ladang terpencil dengan pagar keselamatan persendirian.', m1: 14, m2: 12, moneyUsd: -25000, stress: 6 },
        { id: 'clt_air_berkat',     icon: '🧴', title: 'Jual "Air Tenaga Kosmik" Edisi Khas', desc: 'Air mineral biasa dibungkus dalam botol kristal dengan harga 50 kali ganda.', m1: 4, m2: 12, moneyUsd: 42000, karma: -14, flag: 'cult_fraud' },
        { id: 'clt_peguam_korporat',icon: '⚖️', title: 'Upah Firma Peguam & Penasihat PR', desc: 'Tepis laporan media penyiasat dan pastikan dokumen pertubuhan nampak sah.', m1: 5, m2: -15, moneyUsd: -22000, smarts: 3 },
        { id: 'clt_podcast_misteri',icon: '🎙️', title: 'Siri Podcast "Kebangkitan Minda"', desc: 'Tarik ribuan pendengar baharu secara dalam talian dengan nada tenang.', m1: 9, m2: 3, fame: 10, followers: 18000 },
        { id: 'clt_audit_pengikut', icon: '🔍', title: 'Tapis Pengikut Yang Mula Ragu-Ragu', desc: 'Kenal pasti ahli yang cuba membocorkan rahsia markas kepada wartawan.', m1: 8, m2: -7, karma: -8, stress: 6 },
        { id: 'clt_rare_ramalan',   icon: '☄️', isRare: true, title: '🌟 FENOMENA GERHANA: Ramalan Kebetulan Anda Jadi Kenyataan!', desc: 'PELUANG EMAS: Pengikut menganggap anda benar-benar berkuasa luar biasa dan sumbangan mencurah!', m1: 24, m2: 10, moneyUsd: 120000, fame: 20, followers: 40000 }
      ],
      dilemmas: [
        {
          id: 'sp_clt_docu', icon: '🎬', title: 'Dilema Kultus: Kru Dokumentari Mengetuk Pintu Markas!',
          text: 'Penerbit dokumentari terkenal mahu merakam kehidupan dalam markas anda — mereka terkenal suka mendedahkan sisi pelik pertubuhan rahsia.',
          choices: [
            { label: 'Buka pintu & tunjukkan aktiviti yoga, kebun organik & derma sahaja', hint: 'Perhatian Polis --, Populariti ++, Kesetiaan +', m1: 8, m2: -14, fame: 14, smarts: 4, outcome: 'Dokumentari itu memaparkan komuniti anda kelihatan damai dan eksklusif!' },
            { label: 'Halang masuk dengan pengawal & ancaman saman peguam', hint: 'Kesetiaan ++, tetapi Perhatian Polis ++', m1: 10, m2: 14, karma: -8, outcome: 'Pengikut kagum dengan ketegasan anda, namun pihak berkuasa mula curiga.' },
            { label: 'Tawarkan mereka pakej VIP "pencerahan percuma" 3 hari', hint: 'Komedi gelap! Peluang wartawan pula terpikat!', m1: 14, m2: -6, fame: 12, moneyUsd: 15000, outcome: 'Salah seorang jurukamera dokumentari itu sendiri akhirnya mendaftar menjadi ahli!' }
          ]
        },
        {
          id: 'sp_clt_yacht', icon: '🛥️', title: 'Pengikut Hadiahkan Kapal Layar Mewah Kepada "Guru Agung"!',
          text: 'Sekumpulan ahli jutawan membelikan kapal layar untuk anda, tetapi ahli biasa mula tertanya-tanya mengapa guru hidup terlalu mewah.',
          choices: [
            { label: 'Terima & namakannya "Kapal Meditasi Lautan Untuk Semua"', hint: 'Wang +++, Kesetiaan +, Perhatian Polis ++', moneyUsd: 70000, m1: 6, m2: 14, karma: -14, flag: 'cult_fraud', outcome: 'Anda berlayar penuh gaya sambil berkhutbah tentang melepaskan harta duniawi!' },
            { label: 'Jual kapal layar & bina pusat kebajikan komuniti', hint: 'Kesetiaan +++, Perhatian Polis --, Karma ++', m1: 14, m2: -16, karma: 16, rep: 8, outcome: 'Pengikut makin taksub dengan sifat rendah diri anda dan polis membatalkan siasatan!' },
            { label: 'Terima secara senyap di bawah nama syarikat luar pesisir', hint: 'Wang ++, Perhatian Polis +', moneyUsd: 55000, m1: 2, m2: 8, karma: -12, flag: 'cult_fraud', outcome: 'Tiada siapa perasan buat masa ini, namun rekod kewangan semakin rumit.' }
          ]
        },
        {
          id: 'sp_clt_raid_rumor', icon: '🚨', title: 'Khabar Angin Serbuan Pihak Berkuasa Hujung Minggu Ini!',
          text: 'Seorang bekas ahli yang marah telah membuat laporan penipuan kepada polis tempatan.',
          choices: [
            { label: 'Pulangkan sumbangan bekas ahli itu & selesai di luar mahkamah', hint: 'Wang -, Perhatian Polis ---, selamat!', moneyUsd: -24000, m1: 4, m2: -22, karma: 4, outcome: 'Aduan ditarik balik dan markas anda terselamat daripada serbuan.' },
            { label: 'Pindahkan semua dokumen & anjur "Hari Terbuka Komuniti"', hint: 'Kepintaran ++, Perhatian Polis --, Kesetiaan +', m1: 8, m2: -14, smarts: 5, outcome: 'Apabila pegawai tiba, mereka hanya nampak jamuan teh dan kelas lukisan!' },
            { label: 'Arahkan pengikut berarak membantah siasatan', hint: 'Kesetiaan ++, tetapi Perhatian Polis +++', m1: 12, m2: 24, fame: 10, karma: -12, outcome: 'Berita utama penuh dengan wajah anda — pihak berkuasa kini membuka fail siasatan penuh!' }
          ]
        }
      ]
    },

    // ========================================================================
    // 8. PERISIK RAHSIA & OPERASI ELIT
    // ========================================================================
    spy: {
      id: 'spy',
      icon: '🕵️',
      title: 'Perisik Rahsia & Operasi Elit',
      shortLabel: 'Perisik',
      minAge: 21,
      maxAge: 58,
      offerHeadline: 'Rekrutmen Sulit Agensi Perisikan Negara!',
      offerPitch: 'Kepintaran dan ketahanan fizikal anda menarik perhatian Pengarah Operasi Khas. Anda ditawarkan identiti rahsia, pasport diplomatik bayangan, dan misi sulit merentasi 195 negara di seluruh dunia!',
      metric1: { label: 'Kerahsiaan Identiti', icon: '🎭', init: 78, dangerHigh: false },
      metric2: { label: 'Kepercayaan Agensi',  icon: '🛡️', init: 52, dangerHigh: false },
      ranks: [
        { title: 'Ejen Lapangan',      annualUsd: 68000,  reqYears: 0, reqM1: 0,  prefix: '' },
        { title: 'Ejen Operasi Khas',  annualUsd: 135000, reqYears: 2, reqM1: 60, prefix: '' },
        { title: 'Komander Misi',      annualUsd: 225000, reqYears: 5, reqM1: 72, prefix: '' },
        { title: 'Pengarah Risikan',   annualUsd: 360000, reqYears: 9, reqM1: 84, prefix: '' }
      ],
      exitWarning: 'Agensi akan mengeluarkan "BURN NOTICE / PEMANTAUAN KETAT" sebaik anda keluar! Anda hilang pelepasan keselamatan & gaji serta-merta, dikenakan sekatan perjalanan sementara (3 tahun), dan berdepan risiko berterusan 8–12% SETIAP TAHUN musuh asing lama menjejak anda! Mod Perisik dikunci SELAMANYA.',
      actions: [
        { id: 'spy_analisis_rutin',  icon: '📂', risk: 'low', baseSuccess: 93, title: 'Analisis Laporan Risikan Rutin', desc: 'Teliti dokumen risikan meja dan susun taklimat harian untuk pegawai atasan di ibu pejabat.', m1: 3, m2: 5, moneyUsd: 4200, smarts: 3 },
        { id: 'spy_semak_pangkalan', icon: '🔐', risk: 'low', baseSuccess: 92, title: 'Semakan Keselamatan Pangkalan Data', desc: 'Audit log akses pelayan sulit agensi dan kemas kini penyulitan kata laluan dalaman.', m1: 5, m2: 4, smarts: 3, stress: 1 },
        { id: 'spy_latihan_tempur', icon: '🥋', risk: 'low', baseSuccess: 94, title: 'Latihan Menembak & Taktikal', desc: 'Kekalkan refleks tahap elit dan ketahanan fizikal di fasiliti latihan rahsia agensi.', m1: 3, m2: 6, health: 6, stress: -3 },
        { id: 'spy_pantau_terbuka',  icon: '📻', risk: 'low', baseSuccess: 91, title: 'Pemantauan Komunikasi Terbuka', desc: 'Saring siaran radio, berita asing dan trafik frekuensi awam dari bilik kawalan selamat.', m1: 4, m2: 5, moneyUsd: 3800, smarts: 2 },
        { id: 'spy_gajet_rahsia',   icon: '⌚', risk: 'low', baseSuccess: 90, title: 'Uji Gajet Prototaip Makmal Q-Branch', desc: 'Kuasai jam laser, dron mikro dan peranti penyamaran generasi baharu di makmal.', m1: 5, m2: 5, smarts: 4, happiness: 4 },
        { id: 'spy_misi_asing',     icon: '🌍', title: 'Misi Penyusupan Sulit Luar Negara', desc: 'Terbang dengan identiti palsu ke negara sasaran untuk mengumpul fail rahsia.', m1: -5, m2: 13, moneyUsd: 24000, smarts: 4, stress: 9, foreignMission: true },
        { id: 'spy_padam_jejak',    icon: '💻', title: 'Padam Jejak Digital & Tukar Identiti Bayangan', desc: 'Bersihkan rekod biometrik dan pasport samaran daripada pangkalan data musuh.', m1: 15, m2: 4, smarts: 4, stress: 5 },
        { id: 'spy_pintasan_siber', icon: '📡', title: 'Operasi Pintasan Isyarat Satelit', desc: 'Dekod komunikasi sulit sindiket pengganas antarabangsa.', m1: 4, m2: 12, smarts: 6, karma: 6, stress: 7, foreignMission: true },
        { id: 'spy_ekstraksi_vip',  icon: '🚁', title: 'Misi Menyelamat Sumber Maklumat (VIP)', desc: 'Keluarkan aset risikan dari zon konflik antarabangsa pada waktu malam.', m1: -7, m2: 15, moneyUsd: 32000, karma: 10, health: -4, foreignMission: true },
        { id: 'spy_ejen_berkembar', icon: '🐍', title: 'Jual Maklumat Sampingan Sebagai Ejen Berkembar', desc: 'Godaan berbahaya! Terima bayaran kripto gergasi daripada agensi asing.', m1: -14, m2: -12, moneyUsd: 95000, karma: -22, flag: 'double_agent', foreignMission: true },
        { id: 'spy_majlis_diplomat',icon: '🥂', title: 'Penyamaran Di Majlis Gala Diplomatik', desc: 'Pikat sasaran dengan karisma dan curi kod akses secara senyap.', m1: 6, m2: 11, looks: 3, smarts: 3, foreignMission: true },
        { id: 'spy_sabotaj_senjata',icon: '💣', title: 'Sabotaj Kilang Senjata Haram', desc: 'Lumpuhkan rangkaian penyeludupan senjata sebelum sampai ke pasaran gelap.', m1: -4, m2: 14, karma: 12, rep: 4, stress: 9, foreignMission: true },
        { id: 'spy_audit_kesetiaan',icon: '🧪', title: 'Lulus Ujian Poligraf & Penilaian Agensi', desc: 'Buktikan kesetiaan mutlak anda kepada ibu pejabat risikan.', m1: 8, m2: 12, stress: 6 },
        { id: 'spy_rekod_palsu',    icon: '🪪', title: 'Bina Rangkaian Rumah Selamat (Safe House)', desc: 'Sediakan pasport kecemasan dan lokasi persembunyian di benua berbeza.', m1: 12, m2: 5, moneyUsd: -12000, foreignMission: true },
        { id: 'spy_bongkar_tahi',   icon: '🔎', title: 'Bongkar Pengkhianat Di Dalam Ibu Pejabat', desc: 'Tangkap ejen musuh yang menyusup ke dalam bilik kawalan agensi.', m1: 6, m2: 16, smarts: 5, karma: 8 },
        { id: 'spy_rare_krisis_dunia',icon:'☢️', isRare: true, title: '🌟 OPERASI OMEGA: Hentikan Krisis Serangan Siber Global!', desc: 'PELUANG EMAS: Hanya anda berada di lokasi sasaran untuk menyelamatkan jutaan nyawa!', m1: 12, m2: 24, moneyUsd: 110000, karma: 20, rep: 10, stress: 14, foreignMission: true }
      ],
      dilemmas: [
        {
          id: 'sp_spy_double', icon: '🐍', title: 'Dilema Perisik: Tawaran Ejen Berkembar Di Negara Asing!',
          text: 'Ketika menjalankan misi sulit di luar negara, ketua risikan musuh mengepung hotel anda — tetapi bukannya menangkap anda, dia menawarkan wang rahsia gergasi untuk maklumat agensi anda.',
          choices: [
            { label: 'Berpura-pura setuju & salurkan maklumat palsu kepada mereka!', hint: 'Kepercayaan Agensi +++, Kerahsiaan ++, Kepintaran ++', m1: 12, m2: 16, smarts: 6, karma: 10, outcome: 'Helah berganda anda memperdaya seluruh agensi musuh! Pengarah memuji kebijaksanaan anda.' },
            { label: 'Lawan jalan keluar & hubungi pasukan ekstraksi kecemasan', hint: 'Kepercayaan ++, Kesihatan -, Kerahsiaan -', m1: -8, m2: 12, health: -10, stress: 10, outcome: 'Anda berjaya lolos dengan aksi mendebarkan melalui bumbung bangunan!' },
            { label: 'Terima bayaran & jual maklumat sulit agensi sendiri', hint: 'Wang +++, tetapi Kerahsiaan --, Kepercayaan --- & tanda Ejen Berkembar!', moneyUsd: 120000, m1: -16, m2: -22, karma: -26, flag: 'double_agent', outcome: 'Wang besar masuk ke akaun rahsia, tetapi anda kini hidup dalam ketakutan diburu kedua-dua pihak!' }
          ]
        },
        {
          id: 'sp_spy_cover_blown', icon: '📸', title: 'Wajah Anda Dirakam Kamera Keselamatan Lapangan Terbang!',
          text: 'Seorang ejen pesaing hampir mengecam identiti sebenar anda semasa pemeriksaan transit antarabangsa.',
          choices: [
            { label: 'Aktifkan protokol identiti kecemasan & lenyap di celah orang ramai', hint: 'Kerahsiaan ++, Stres +', m1: 14, m2: 6, smarts: 4, stress: 8, outcome: 'Anda menukar penampilan dalam 90 saat dan hilang tanpa dikesan!' },
            { label: 'Minta unit siber ibu pejabat memadam rakaman CCTV secara langsung', hint: 'Kerahsiaan +, Kepercayaan +, selamat', m1: 10, m2: 8, outcome: 'Semua rakaman terpadam dalam beberapa saat — identiti anda kekal selamat.' },
            { label: 'Bersemuka & umpan ejen pesaing itu ke perangkap polis tempatan', hint: 'Kepercayaan ++, Kerahsiaan -, risiko', m1: -6, m2: 14, notoriety: 6, outcome: 'Pesaing anda ditahan pihak berkuasa tempatan manakala anda meneruskan misi!' }
          ]
        },
        {
          id: 'sp_spy_family_lie', icon: '🏠', title: 'Keluarga Mula Curiga Dengan "Kerja Konsultan" Anda!',
          text: 'Kekerapan anda hilang tanpa berita membuatkan keluarga mengesyaki anda terlibat dengan sesuatu yang berbahaya.',
          choices: [
            { label: 'Cipta cerita lindungan meyakinkan dengan bantuan HR palsu agensi', hint: 'Kerahsiaan ++, Gembira +', m1: 12, m2: 6, happiness: 6, outcome: 'Keluarga anda lega dan menyangka anda hanyalah juruaudit antarabangsa yang sibuk.' },
            { label: 'Ambil cuti singkat bersama keluarga untuk tenangkan hati mereka', hint: 'Gembira ++, Stres --, Kepercayaan -3', m1: 4, m2: -3, happiness: 14, stress: -12, outcome: 'Momen bersama keluarga memulihkan jiwa anda walaupun misi ditangguh seketika.' },
            { label: 'Beritahu separuh kebenaran kepada pasangan', hint: 'Gembira +, tetapi Kerahsiaan --- & Kepercayaan --', m1: -18, m2: -12, happiness: 8, outcome: 'Pasangan anda terkejut — agensi memberi amaran keras tentang pelanggaran kerahsiaan!' }
          ]
        },
        {
          id: 'sp_spy_rogue_target', icon: '🎯', title: 'Arahan Senyap Terhadap Sasaran Yang Rupanya Tidak Bersalah!',
          text: 'Fail risikan lapangan membuktikan sasaran yang diarahkan untuk ditangkap sebenarnya seorang pemberi maklumat yang cuba mendedahkan rasuah.',
          choices: [
            { label: 'Lindungi dia & serahkan bukti sebenar kepada Pengarah Risikan', hint: 'Karma +++, Kepercayaan ++, Reputasi +', m1: 4, m2: 14, karma: 18, rep: 6, outcome: 'Keberanian moral anda membongkar konspirasi dalaman dan menyelamatkan insan tidak bersalah!' },
            { label: 'Bantu dia melarikan diri dengan identiti baharu secara rahsia', hint: 'Karma ++, tetapi Kepercayaan Agensi --', m1: 6, m2: -12, karma: 14, outcome: 'Dia terselamat, namun ibu pejabat mempertikaikan kegagalan tangkapan anda.' },
            { label: 'Patuhi arahan tanpa soal demi rekod sempurna', hint: 'Kepercayaan ++, tetapi Karma --- & Stres ++', m1: 4, m2: 12, karma: -20, stress: 14, outcome: 'Misi dicatat berjaya, tetapi rasa bersalah menghantui fikiran anda.' }
          ]
        }
      ]
    },

    // ========================================================================
    // 9. KERABAT DIRAJA / ROYALTY
    // ========================================================================
    royalty: {
      id: 'royalty',
      icon: '👑',
      title: 'Kerabat Diraja / Royalty',
      shortLabel: 'Diraja',
      minAge: 18,
      maxAge: 65,
      offerHeadline: 'Jemputan Istana & Ikatan Kerabat Diraja!',
      offerPitch: 'Karisma dan reputasi anda memikat perhatian kalangan istana! Anda dijemput menyertai lingkungan rasmi Kerabat Diraja — kehidupan penuh kemewahan, protokol ketat, dan tanggungjawab terhadap negara!',
      metric1: { label: 'Restu Istana & Rakyat', icon: '👑', init: 62, dangerHigh: false },
      metric2: { label: 'Elaun Diraja',          icon: '💰', init: 60, dangerHigh: false },
      ranks: [
        { title: 'Kerabat Muda / Pasangan Diraja', annualUsd: 140000, reqYears: 0, reqM1: 0,  prefix: 'YM' },
        { title: 'Putera / Puteri',                annualUsd: 280000, reqYears: 3, reqM1: 64, prefix: 'YAM' },
        { title: 'Pewaris Takhta',                 annualUsd: 480000, reqYears: 7, reqM1: 76, prefix: 'DYTM' },
        { title: 'Raja / Sultan / Ketua Diraja',   annualUsd: 850000, reqYears: 12, reqM1: 88, prefix: 'DYMM' }
      ],
      exitWarning: 'BUANG GELARAN DIRAJA (RENOUNCE TITLE): Anda akan kehilangan Elaun Diraja & segala keistimewaan istana SELAMANYA, hubungan keluarga diraja retak, dan badai media global akan tercetus (sama ada dipuji berani ATAU Reputasi Keluarga merosot!). Mod Diraja dikunci SELAMANYA.',
      actions: [
        { id: 'roy_terima_mengadap', icon: '🏛️', risk: 'low', baseSuccess: 94, title: 'Terima Mengadap Perwakilan & Duta Di Istana', desc: 'Pertemuan rasmi berprotokol tinggi yang berjalan lancar di balai penghadapan.', m1: 4, m2: 3, rep: 3, smarts: 2 },
        { id: 'roy_pendidikan_elit', icon: '🎓', risk: 'low', baseSuccess: 93, title: 'Latihan Kepimpinan & Bahasa Diplomatik', desc: 'Kuasai etiket antarabangsa, sejarah perlembagaan dan rundingan.', m1: 5, m2: 4, smarts: 5 },
        { id: 'roy_warisan_budaya',  icon: '🎭', risk: 'low', baseSuccess: 92, title: 'Naungi Seni, Muzium & Warisan Bangsa', desc: 'Pelihara khazanah sejarah dan seni kraf tradisional negara.', m1: 6, m2: 3, karma: 6, rep: 4, happiness: 5 },
        { id: 'roy_sukan_polo',      icon: '🐎', risk: 'low', baseSuccess: 91, title: 'Kejohanan Polo & Ekuestrian Amal Diraja', desc: 'Sertai sukan tradisi bangsawan sambil mengumpul dana kebajikan.', m1: 5, m2: 3, health: 5, fame: 5, happiness: 6 },
        { id: 'roy_santapan_rakyat', icon: '🤝', title: 'Lawatan Mesra Rakyat & Kampung Pedalaman', desc: 'Mencemar duli menziarahi rakyat jelata serta menghulurkan sumbangan.', m1: 13, m2: 3, karma: 12, fame: 10, rep: 8 },
        { id: 'roy_yayasan_amal',    icon: '🏥', title: 'Lancar Yayasan Kesihatan & Biasiswa Diraja', desc: 'Biayai hospital kanak-kanak dan pendidikan anak kurang berkemampuan.', m1: 14, m2: -2, moneyUsd: -25000, karma: 15, rep: 10 },
        { id: 'roy_majlis_istiadat', icon: '🏰', title: 'Hadir Istiadat Rasmi & Jamuan Negara', desc: 'Tampilkan adab, wibawa dan protokol diraja di hadapan duta asing.', m1: 10, m2: 8, fame: 10, looks: 3, stress: 5 },
        { id: 'roy_diplomasi_raja',  icon: '✈️', title: 'Lawatan Rasmi Ke Istana Negara Sahabat', desc: 'Kukuhkan hubungan diplomatik antara monarki dan ketua negara dunia.', m1: 11, m2: 9, fame: 12, rep: 7, smarts: 3 },
        { id: 'roy_urus_hartanah',   icon: '🏛️', title: 'Selia Portfolio Harta & Amanah Diraja', desc: 'Optimumkan hasil ladang, pelaburan berdaulat dan elaun rasmi istana.', m1: 4, m2: 14, moneyUsd: 45000, smarts: 4 },
        { id: 'roy_titah_nasional',  icon: '📜', title: 'Titah Khas Perpaduan Nasional', desc: 'Sampaikan amanat penyatuan yang menenangkan ketegangan masyarakat.', m1: 15, m2: 6, fame: 14, rep: 9, karma: 10 },
        { id: 'roy_beli_istana_mini',icon: '💎', title: 'Anjur Pesta Mewah Tertutup Bangsawan', desc: 'Nikmati kemewahan kelas pertama — namun awas kritikan rakyat jika berlebihan.', m1: -8, m2: 6, happiness: 14, moneyUsd: -18000, fame: 6 },
        { id: 'roy_bantuan_bencana', icon: '🌧️', title: 'Gerakkan Tabung Kecemasan Diraja', desc: 'Salurkan helikopter dan bekalan makanan terus ke kawasan banjir.', m1: 14, m2: 4, karma: 14, rep: 8, health: -2 },
        { id: 'roy_rare_pertabalan', icon: '👑', isRare: true, title: '🌟 JUBLI EMAS DIRAJA: Sambutan Mega Seluruh Negara!', desc: 'PELUANG EMAS: Perarakan bersejarah yang disiarkan ke seluruh dunia menaikkan darjat anda!', m1: 22, m2: 16, fame: 25, rep: 14, happiness: 15 }
      ],
      dilemmas: [
        {
          id: 'sp_roy_paparazzi', icon: '📸', title: 'Dilema Istana: Foto Percutian Peribadi Bocor Ke Tabloid!',
          text: 'Paparazi merakam gambar santai anda di sebuah pulau mewah ketika ekonomi negara sedang perlahan, mencetuskan perdebatan di media sosial.',
          choices: [
            { label: 'Akui kesilapan, potong 20% elaun tahun ini & derma kepada rakyat', hint: 'Restu Rakyat +++, Karma ++, Elaun -8', m1: 16, m2: -8, karma: 16, rep: 10, outcome: 'Kerendahan hati anda menukar kritikan menjadi pujian meluas di seluruh negara!' },
            { label: 'Keluarkan kenyataan rasmi tenang melalui Pejabat Istana', hint: 'Restu +, protokol terjaga', m1: 6, m2: 2, rep: 2, outcome: 'Isu reda secara profesional dalam masa beberapa hari.' },
            { label: 'Saman media tabloid & biarkan kritikan berlalu', hint: 'Elaun +, tetapi Restu Rakyat --', m1: -10, m2: 6, happiness: -4, rep: -5, outcome: 'Anda menang saman privasi tetapi sebahagian rakyat masih kurang senang.' }
          ]
        },
        {
          id: 'sp_roy_protocol', icon: '📜', title: 'Protokol Tradisi Vs Pilihan Hati Moden!',
          text: 'Majlis Penasihat Istana membantah rancangan anda untuk memodenkan adat istiadat rasmi agar lebih dekat dengan generasi muda.',
          choices: [
            { label: 'Gabungkan keagungan tradisi dengan pendekatan digital moden', hint: 'Restu +++, Elaun ++, Kepintaran ++', m1: 14, m2: 8, smarts: 5, fame: 12, outcome: 'Golongan tua dan muda sama-sama terpikat dengan kebijaksanaan pembaharuan anda!' },
            { label: 'Kekalkan protokol tradisi 100% demi menghormati majlis', hint: 'Elaun ++, Restu Istana +, selamat', m1: 6, m2: 10, rep: 4, outcome: 'Majlis Penasihat Istana amat berpuas hati dan menaikkan peruntukan anda.' },
            { label: 'Langgar protokol secara terbuka demi kebebasan diri', hint: 'Populariti ++, Gembira ++, tetapi Restu Istana -- & Elaun --', m1: -8, m2: -12, fame: 16, happiness: 12, outcome: 'Media dunia memuji keberanian anda, tetapi suasana di istana menjadi tegang.' }
          ]
        },
        {
          id: 'sp_roy_allowance_debate', icon: '💰', title: 'Perbahasan Awam Mengenai Bajet Istana!',
          text: 'Sekumpulan aktivis mempersoalkan kos penyelenggaraan istana dan mencadangkan pengurangan elaun diraja.',
          choices: [
            { label: 'Buka sebahagian istana sebagai muzium pelancongan untuk jana hasil negara', hint: 'Restu +++, Elaun ++, Reputasi +++', m1: 16, m2: 10, rep: 10, smarts: 5, outcome: 'Pelancong membanjiri istana — hasil tiket melebihi kos penyelenggaraan!' },
            { label: 'Bentangkan laporan audit telus sumbangan amal diraja', hint: 'Restu ++, Karma +', m1: 10, m2: 4, karma: 8, outcome: 'Rakyat terkejut melihat besarnya dana kebajikan yang telah disalurkan istana.' },
            { label: 'Pertahankan peruntukan sedia ada melalui saluran rasmi', hint: 'Elaun +, tetapi Restu -5', m1: -5, m2: 6, outcome: 'Elaun dikekalkan, namun sentimen media sosial kekal berbelah bahagi.' }
          ]
        },
        {
          id: 'sp_roy_heir_duty', icon: '👑', title: 'Krisis Politik Negara — Rakyat Memandang Ke Arah Istana!',
          text: 'Kebuntuan politik berlaku dan semua pihak menantikan nasihat bijaksana serta ketenangan daripada keluarga diraja.',
          choices: [
            { label: 'Panggil semua pemimpin bermesyuarat & serukan perpaduan adil', hint: 'Restu +++, Reputasi +++, Karma +++', m1: 18, m2: 10, karma: 18, rep: 12, fame: 16, outcome: 'Kebijaksanaan anda meredakan krisis negara dan tercatat dalam buku sejarah!' },
            { label: 'Kekal berkecuali sepenuhnya & serahkan kepada perlembagaan', hint: 'Restu ++, selamat', m1: 9, m2: 4, karma: 6, outcome: 'Sikap berkecuali anda dihormati sebagai lambang kestabilan negara.' }
          ]
        }
      ]
    },

    // ========================================================================
    // 10. PENGEMBARA & PEMBURU REKOD DUNIA
    // ========================================================================
    explorer: {
      id: 'explorer',
      icon: '🧭',
      title: 'Pengembara & Pemburu Rekod Dunia',
      shortLabel: 'Pengembara',
      minAge: 18,
      maxAge: 70,
      offerHeadline: 'Tajaan Ekspedisi Penjelajahan 195 Negara!',
      offerPitch: 'Semangat kembara dan ketahanan anda memikat saluran dokumentari antarabangsa! Mereka menaja misi seumur hidup anda untuk menjelajah 7 benua, menawan 195 negara, dan memburu pengiktirafan Legenda Dunia / Hadiah Nobel!',
      metric1: { label: 'Negara Diterokai', icon: '🌍', init: 10, dangerHigh: false },
      metric2: { label: 'Prestij Global',   icon: '🏆', init: 42, dangerHigh: false },
      ranks: [
        { title: 'Penjelajah Bebas',                  annualUsd: 46000,  reqYears: 0, reqM1: 0,  prefix: '' },
        { title: 'Dokumentaris Dunia',                annualUsd: 110000, reqYears: 2, reqM1: 25, prefix: '' },
        { title: 'Penakluk 7 Benua',                  annualUsd: 210000, reqYears: 5, reqM1: 50, prefix: '' },
        { title: 'Legenda Dunia / Calon Hadiah Nobel',annualUsd: 380000, reqYears: 9, reqM1: 75, prefix: '' }
      ],
      exitWarning: 'Keluar daripada Mod Pengembara akan mengenakan penalti pecah kontrak penaja ekspedisi, membatalkan semua geran penyelidikan, dan MELUCUTKAN KELAYAKAN Hadiah Nobel / Legenda Dunia SELAMANYA bagi watak ini! Mod Pengembara akan dikunci SELAMANYA.',
      actions: [
        { id: 'exp_arkib_peta',      icon: '🗺️', risk: 'low', baseSuccess: 93, title: 'Kemaskini Jurnal Peta & Arkib Geografi', desc: 'Susun nota lapangan, katalog foto dan koordinat laluan ekspedisi dengan teliti.', m1: 2, m2: 5, smarts: 3, stress: -2 },
        { id: 'exp_selenggara_gear', icon: '🎒', risk: 'low', baseSuccess: 94, title: 'Penyelenggaraan Kelengkapan & Latihan Kembara', desc: 'Periksa khemah ekstrem, kompas satelit dan stamina sebelum ekspedisi besar.', m1: 2, m2: 4, health: 5, stress: -2 },
        { id: 'exp_ceramah_ted',     icon: '🎤', risk: 'low', baseSuccess: 91, title: 'Syarahan Global & Pameran Fotografi Dunia', desc: 'Inspirasi universiti antarabangsa dengan kisah kembara anda.', m1: 0, m2: 7, moneyUsd: 9500, fame: 6, smarts: 3 },
        { id: 'exp_tajaan_jenama',   icon: '🏕️', risk: 'low', baseSuccess: 90, title: 'Tandatangan Penajaan Peralatan Ekspedisi', desc: 'Dapatkan geran kewangan dan kelengkapan kembara canggih percuma.', m1: 0, m2: 5, moneyUsd: 12000, fame: 4 },
        { id: 'exp_jelajah_negara',  icon: '✈️', title: 'Ekspedisi Rasmi Ke Negara Baharu', desc: 'Terokai budaya, geografi dan komuniti di negara yang belum pernah anda jejak.', m1: 8, m2: 9, happiness: 8, smarts: 4, exploreCountries: 2 },
        { id: 'exp_jelajah_serantau',icon: '🧭', title: 'Jelajah Rentas Sempadan 3 Negara Sekaligus', desc: 'Kembara darat merentasi 3 negara berjiran sambil merakam dokumentari.', m1: 12, m2: 11, health: -3, fame: 8, exploreCountries: 3 },
        { id: 'exp_puncak_gunung',   icon: '🏔️', title: 'Daki Puncak Tertinggi Benua', desc: 'Tawan puncak bersalji ekstrem untuk mencipta rekod dunia baharu.', m1: 5, m2: 14, health: 5, fame: 12, rep: 6, stress: 7, exploreCountries: 1 },
        { id: 'exp_rakam_dokumen',   icon: '🎥', title: 'Terbit Dokumentari Eksklusif National Globe', desc: 'Kongsi rakaman flora, fauna dan sejarah dunia kepada jutaan penonton.', m1: 3, m2: 13, moneyUsd: 36000, fame: 14, followers: 22000 },
        { id: 'exp_selam_lautan',    icon: '🤿', title: 'Ekspedisi Penyelaman Jurang Laut Dalam', desc: 'Kumpul sampel spesies marin nadir bersama saintis oseanografi.', m1: 4, m2: 13, smarts: 6, karma: 6, exploreCountries: 1 },
        { id: 'exp_hutan_amazon',    icon: '🌿', title: 'Penyelidikan Ekosistem Hutan Hujan Dara', desc: 'Temui spesies tumbuhan perubatan dan dokumentasikan usaha pemuliharaan.', m1: 5, m2: 12, karma: 10, smarts: 5, rep: 5, exploreCountries: 1 },
        { id: 'exp_kutub_selatan',   icon: '🧊', title: 'Rentas Gurun Ais Antartika / Artik', desc: 'Kaji perubahan iklim global dalam suhu bawah -40°C.', m1: 4, m2: 15, health: -5, fame: 12, karma: 10, rep: 8 },
        { id: 'exp_buku_atlas',      icon: '📚', title: 'Tulis Buku Best-Seller "195 Wajah Dunia"', desc: 'Abadikan pengalaman budaya setiap negara yang telah anda jelajahi.', m1: 2, m2: 12, moneyUsd: 38000, fame: 12, smarts: 5 },
        { id: 'exp_rekod_guinness',  icon: '🏅', title: 'Pecahkan Rekod Dunia Ketahanan Kembara', desc: 'Catat rekod rasmi baharu merentasi lautan atau gurun Sahara.', m1: 6, m2: 15, fame: 14, health: -4, rep: 7, exploreCountries: 2 },
        { id: 'exp_misi_kemanusiaan',icon: '🤝', title: 'Bawa Bekalan Air Bersih Ke Wilayah Terpencil', desc: 'Gabungkan ekspedisi sains dengan misi kemanusiaan bertaraf Nobel.', m1: 4, m2: 14, karma: 16, rep: 10, exploreCountries: 1 },
        { id: 'exp_rare_penemuan',   icon: '🏺', isRare: true, title: '🌟 PENEMUAN BERSEJARAH: Kota Purba & Pencalonan Hadiah Nobel!', desc: 'PELUANG EMAS: Penemuan arkeologi & iklim anda menggegarkan seluruh dunia sains!', m1: 10, m2: 26, moneyUsd: 130000, fame: 26, rep: 16, karma: 14, smarts: 8, exploreCountries: 3 }
      ],
      dilemmas: [
        {
          id: 'sp_exp_blizzard', icon: '🌨️', title: 'Dilema Ekspedisi: Ribut Salji Mengganas 300 Meter Dari Puncak!',
          text: 'Oksigen semakin tipis dan ribut salji tiba-tiba melanda. Anda hanya 300 meter daripada mencipta rekod dunia, tetapi ahli pasukan mula keletihan.',
          choices: [
            { label: 'Batalkan pendakian & selamatkan semua ahli pasukan turun dahulu!', hint: 'Karma +++, Reputasi ++, Prestij +, selamat', m1: 2, m2: 10, karma: 18, rep: 10, health: 4, outcome: 'Kepimpinan berjiwa besar anda dipuji komuniti pendaki dunia — semua pulang selamat!' },
            { label: 'Berlindung di khemah kecemasan & cuba puncak selepas ribut reda', hint: 'Prestij +++, Kepintaran ++, Kesihatan -6', m1: 5, m2: 18, smarts: 5, health: -6, fame: 14, exploreCountries: 1, outcome: 'Kesabaran taktikal anda membuahkan hasil — bendera anda berkibar di puncak!' },
            { label: 'Redah ribut seorang diri demi rekod dunia!', hint: 'Prestij +++, tetapi Kesihatan --- & risiko cedera parah', m1: 5, m2: 20, health: -20, fame: 18, karma: -8, outcome: 'Anda mencipta rekod yang mustahil, namun jari anda hampir beku dan terpaksa diterbangkan ke hospital!' }
          ]
        },
        {
          id: 'sp_exp_artifact', icon: '🏺', title: 'Penemuan Artifak Emas Purba Di Gua Terpencil!',
          text: 'Pasukan anda menemui artifak tamadun hilang. Pengumpul persendirian menawarkan jutaan secara rahsia, manakala muzium tempatan mahu memuliharanya.',
          choices: [
            { label: 'Serahkan 100% kepada muzium negara tuan rumah secara rasmi!', hint: 'Prestij +++, Karma +++, Reputasi Keluarga +++', m1: 4, m2: 18, karma: 20, rep: 14, fame: 16, outcome: 'Anda dianugerahkan pingat penghormatan negara dan semakin hampir dengan pencalonan Nobel!' },
            { label: 'Bekerjasama dengan universiti antarabangsa untuk pameran jelajah dunia', hint: 'Prestij ++, Wang ++, Kepintaran ++', m1: 4, m2: 14, moneyUsd: 45000, smarts: 6, fame: 12, outcome: 'Pameran jelajah dunia menaikkan nama anda sebagai penyelidik terkemuka!' },
            { label: 'Jual satu kepingan kecil secara rahsia untuk tampung dana ekspedisi', hint: 'Wang +++, tetapi Karma --- & risiko skandal', moneyUsd: 95000, m1: 0, m2: -10, karma: -22, rep: -8, outcome: 'Dana ekspedisi penuh, namun komuniti arkeologi mula mempertikaikan etika anda.' }
          ]
        },
        {
          id: 'sp_exp_nobel_forum', icon: '🏅', title: 'Jemputan Forum Sains & Hadiah Nobel Di Stockholm!',
          text: 'Rekod penjelajahan dan data perubahan iklim anda dari puluhan negara menarik perhatian jawatankuasa antarabangsa.',
          choices: [
            { label: 'Buka semua data penyelidikan anda secara percuma kepada dunia!', hint: 'Prestij +++, Karma +++, Reputasi +++, Calon Nobel!', m1: 4, m2: 22, karma: 20, rep: 15, fame: 20, smarts: 6, outcome: 'Tindakan terbuka anda mencetuskan tepukan gemuruh berdiri — nama anda tersenarai dalam calon utama Hadiah Nobel!' },
            { label: 'Patenkan data & jual lesen kepada syarikat teknologi hijau', hint: 'Wang +++, Prestij +', moneyUsd: 110000, m1: 2, m2: 8, smarts: 4, outcome: 'Anda meraih kekayaan besar untuk membiayai lebih banyak ekspedisi masa depan.' }
          ]
        },
        {
          id: 'sp_exp_sponsor_clash', icon: '📺', title: 'Penaja Mahu Anda Memalsukan Aksi Bahaya Demi Rating!',
          text: 'Penerbit TV mahu anda melakonkan adegan "sesat di gurun" supaya tontonan melonjak.',
          choices: [
            { label: 'Tolak tegas — dokumentari anda mesti 100% asli dan jujur!', hint: 'Prestij ++, Karma ++, Reputasi +', m1: 4, m2: 12, karma: 12, rep: 8, outcome: 'Keaslian anda membuatkan penonton lebih menghormati integriti setiap episod!' },
            { label: 'Setuju untuk sedikit drama demi tambahan bajet ekspedisi', hint: 'Wang ++, Populariti +, tetapi Prestij -6', moneyUsd: 48000, m1: 2, m2: -6, fame: 10, karma: -8, outcome: 'Tontonan melonjak tinggi, namun pengkritik menyedari beberapa babak kelihatan dirancang.' }
          ]
        }
      ]
    }
  }
};
