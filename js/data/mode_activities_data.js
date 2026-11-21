/* ==========================================================================
   WorldLife — Pangkalan Data Aktiviti & Dilema Dinamik Mod Khas (120+ Aktiviti)
   20 Aktiviti Unik + 6 Dilema Bercabang untuk SETIAP Mod:
   Politik, Mafia, Jenayah, Artis, Pelakon & Penjara (Bahasa Melayu — Sifar Placeholder)
   ========================================================================== */

window.ModeActivitiesData = {
  // --------------------------------------------------------------------------
  // 1. 120 AKTIVITI KHUSUS MOD (20 SETIAP MOD, BERPERINGKAT TIER 1 / 2 / 3)
  // --------------------------------------------------------------------------
  POOLS: {
    // ========================================================================
    // MOD POLITIK / MENTERI (20 Aktiviti)
    // ========================================================================
    politic: [
      { id: 'pol_turun_padang', tier: 1, isRare: false, icon: '🤝', title: 'Lawatan Turun Padang Mengejut', desc: 'Tinjau pasar awam dan klinik desa tanpa protokol rasmi.', effects: { approval: 7, karma: 6, fame: 4, rep: 3, stress: 4 } },
      { id: 'pol_viral_sosmed', tier: 1, isRare: false, icon: '📱', title: 'Kempen Video Pendek Viral', desc: 'Terangkan dasar rakyat dengan bahasa mudah dan santai di media sosial.', effects: { approval: 6, fame: 8, followers: 8500, stress: 3 } },
      { id: 'pol_dialog_belia', tier: 1, isRare: false, icon: '🎓', title: 'Sesi Townhall Bersama Mahasiswa', desc: 'Jawab soalan pedas anak muda mengenai kos sara hidup dan peluang kerja.', effects: { approval: 7, smarts: 3, karma: 5, rep: 2, stress: 5 } },
      { id: 'pol_bantu_mangsa', tier: 1, isRare: false, icon: '🌧️', title: 'Bantu Mangsa Banjir & Bencana', desc: 'Turun mengharung air menghantar bekalan makanan kepada rakyat terjejas.', effects: { approval: 10, karma: 10, health: -3, rep: 4, stress: 5 } },
      { id: 'pol_ceramah_malam', tier: 1, isRare: false, icon: '🎙️', title: 'Ceramah Perdana Kawasan', desc: 'Berpidato membakar semangat pengundi akar umbi di padang awam.', effects: { approval: 6, fame: 5, happiness: 5, stress: 5 } },
      { id: 'pol_audit_peruntukan', tier: 1, isRare: false, icon: '📋', title: 'Audit Telus Peruntukan Kawasan', desc: 'Dedahkan laporan perbelanjaan awam secara terbuka kepada penduduk.', effects: { approval: 8, karma: 8, rep: 4, smarts: 2 } },
      { id: 'pol_jamuan_elit', tier: 1, isRare: false, icon: '🍽️', title: 'Majlis Makan Malam Penderma Parti', desc: 'Kumpul dana politik dan bina sokongan usahawan tempatan.', effects: { moneyUsd: 9500, approval: -2, fame: 3, stress: 4 } },
      { id: 'pol_debat_parlimen', tier: 2, isRare: false, icon: '🏛️', title: 'Debat Hangat Di Parlimen', desc: 'Berhujah mempertahankan usul dasar ekonomi menentang pembangkang.', effects: { approval: 9, fame: 10, smarts: 4, stress: 8 } },
      { id: 'pol_ruu_kontroversi', tier: 2, isRare: false, icon: '📜', title: 'Bentang Rang Undang-Undang Pembaharuan', desc: 'Perkenalkan akta baharu yang mengubah landskap industri negara.', effects: { approval: 8, karma: 7, rep: 5, stress: 9 } },
      { id: 'pol_sidang_media', tier: 2, isRare: false, icon: '📸', title: 'Sidang Media Khas Isu Semasa', desc: 'Hadapi puluhan wartawan untuk menjelaskan pendirian rasmi kementerian.', effects: { approval: 6, fame: 9, stress: 7 } },
      { id: 'pol_siasat_ketirisan', tier: 2, isRare: false, icon: '🔍', title: 'Siasat Ketirisan Dalaman Kementerian', desc: 'Bongkar kartel projek kerajaan yang memakan dana awam.', effects: { approval: 11, karma: 12, rep: 6, stress: 10, notoriety: -5 } },
      { id: 'pol_lobi_korporat', tier: 2, isRare: false, icon: '💼', title: 'Rundingan Lobi Korporat Tertutup', desc: 'Terima sumbangan dana besar daripada konglomerat dengan syarat projek.', effects: { moneyUsd: 26000, approval: -6, karma: -14, notoriety: 12, stress: 7 } },
      { id: 'pol_kawal_inflasi', tier: 2, isRare: false, icon: '🛒', title: 'Pelan Kawalan Harga & Inflasi', desc: 'Lancar subsidi bersasar untuk meringankan beban barang keperluan rakyat.', effects: { approval: 11, karma: 8, rep: 5, stress: 8 } },
      { id: 'pol_rombakan_kecil', tier: 2, isRare: false, icon: '🔄', title: 'Rombakan Pegawai Kanan Kementerian', desc: 'Lantik pasukan teknokrat baharu untuk mempercepatkan prestasi kementerian.', effects: { approval: 7, smarts: 3, stress: 6, rep: 3 } },
      { id: 'pol_projek_mega', tier: 3, isRare: false, icon: '🚄', title: 'Lancar Projek Mega Infrastruktur Negara', desc: 'Rasmikan jaringan rel laju dan pelabuhan pintar bernilai bilion.', effects: { approval: 13, fame: 14, rep: 8, stress: 10 } },
      { id: 'pol_lawatan_diplomatik', tier: 3, isRare: false, icon: '✈️', title: 'Lawatan Diplomatik & Sidang Kemuncak Dunia', desc: 'Meterai perjanjian pelaburan asing berbilion bersama pemimpin dunia.', effects: { approval: 10, fame: 15, rep: 9, smarts: 4, stress: 8 } },
      { id: 'pol_ucapan_pbb', tier: 3, isRare: false, icon: '🌍', title: 'Ucapan Bersejarah Di Pentas Antarabangsa', desc: 'Suarakan pendirian tegas negara mengenai keamanan dan keadilan global.', effects: { approval: 14, fame: 18, karma: 10, rep: 10, stress: 6 } },
      { id: 'pol_rare_krisis_negara', tier: 2, isRare: true, icon: '🚨', title: '🌟 KRISIS BESAR: Kemelesetan & Krisis Nasional!', desc: 'PELUANG EMAS / KRISIS: Negara berdepan krisis mengejut — tindakan pantas anda akan dikenang sejarah!', effects: { approval: 16, fame: 18, rep: 12, karma: 10, stress: 14 } },
      { id: 'pol_rare_rasuah_jutaan', tier: 2, isRare: true, icon: '💰', title: '🌟 PELUANG GELAP: Tawaran Rasuah Bernilai Jutaan!', desc: 'PELUANG TERHAD: Broker antarabangsa menawarkan dana rahsia luar negara demi satu tandatangan.', effects: { moneyUsd: 95000, karma: -28, notoriety: 24, approval: -10, stress: 12 } },
      { id: 'pol_rare_anugerah_negarawan', tier: 3, isRare: true, icon: '👑', title: '🌟 PENGIKTIRAFAN: Calon Anugerah Negarawan Dunia', desc: 'PELUANG EMAS: Nama anda dicalonkan sebagai tokoh kepimpinan paling berpengaruh tahun ini!', effects: { approval: 15, fame: 20, rep: 14, happiness: 18, karma: 10 } }
    ],

    // ========================================================================
    // MOD MAFIA / SINDIKET (20 Aktiviti)
    // ========================================================================
    mafia: [
      { id: 'maf_wang_perlindungan', tier: 1, isRare: false, icon: '💵', title: 'Kutip Wang Perlindungan Daerah', desc: 'Lawati premis komersial di kawasan jajahan sindiket untuk kutipan mingguan.', effects: { moneyUsd: 5500, respect: 7, notoriety: 8, karma: -10 } },
      { id: 'maf_rekrut_ahli', tier: 1, isRare: false, icon: '👥', title: 'Rekrut & Uji Ahli Baharu Jalanan', desc: 'Pilih anak muda setia untuk memperkukuh barisan sindiket.', effects: { respect: 8, notoriety: 5, karma: -6, stress: 4 } },
      { id: 'maf_judi_bawah_tanah', tier: 1, isRare: false, icon: '🃏', title: 'Urus Kelab Permainan Bawah Tanah', desc: 'Kendalikan meja VIP persendirian untuk tetamu berduit di lorong rahsia.', effects: { moneyUsd: 9200, respect: 6, notoriety: 9, karma: -9 } },
      { id: 'maf_seludup_barangan', tier: 1, isRare: false, icon: '📦', title: 'Seludup Barangan Mewah Tanpa Cukai', desc: 'Bawa masuk jam mewah dan elektronik melalui laluan tikus pelabuhan.', effects: { moneyUsd: 11500, respect: 7, notoriety: 10, karma: -10 } },
      { id: 'maf_hapus_jejak', tier: 1, isRare: false, icon: '🧹', title: 'Hapus Jejak Digital & Bukti Lama', desc: 'Upah pakar IT gelap membersihkan rekod transaksi dan kamera CCTV.', effects: { moneyUsd: -2500, notoriety: -14, respect: 4, stress: -6 } },
      { id: 'maf_cari_markas', tier: 1, isRare: false, icon: '🏚️', title: 'Bina Rumah Selamat (Safe House) Baharu', desc: 'Sediakan lokasi persembunyian rahsia sekiranya polis menyerbu.', effects: { moneyUsd: -3500, notoriety: -10, respect: 5, stress: -8 } },
      { id: 'maf_kutip_hutang', tier: 1, isRare: false, icon: '🔨', title: 'Operasi Kutip Hutang Ceti Haram', desc: 'Paksa peminjam tegar melunaskan bayaran tertunggak sindiket.', effects: { moneyUsd: 7800, respect: 9, notoriety: 9, karma: -14 } },
      { id: 'maf_cuci_duit_bisnes', tier: 2, isRare: false, icon: '🏦', title: 'Cuci Duit Melalui Bisnes Hadapan', desc: 'Salurkan wang tunai gelap melalui rangkaian restoran dan cuci kereta.', effects: { moneyUsd: 18000, notoriety: -10, respect: 8, smarts: 3 } },
      { id: 'maf_siasat_snitch', tier: 2, isRare: false, icon: '🐀', title: 'Siasat Pembelot (Snitch) Dalam Geng', desc: 'Kesan siapa yang membocorkan maklumat pergerakan sindiket kepada polis.', effects: { respect: 12, notoriety: -8, stress: 10, karma: -12 } },
      { id: 'maf_gencatan_senjata', tier: 2, isRare: false, icon: '🤝', title: 'Runding Gencatan Senjata Geng Musuh', desc: 'Duduk semeja di restoran berkecuali untuk membahagi kawasan secara aman.', effects: { respect: 11, notoriety: -6, smarts: 4, stress: -5 } },
      { id: 'maf_rasuah_sempadan', tier: 2, isRare: false, icon: '🛂', title: 'Rasuah Pegawai Kastam & Sempadan', desc: 'Buka laluan hijau untuk kontena sindiket melintasi pelabuhan tanpa pemeriksaan.', effects: { moneyUsd: 24000, respect: 9, notoriety: 12, karma: -16 } },
      { id: 'maf_rampas_gudang', tier: 2, isRare: false, icon: '🔥', title: 'Serbuan Rampas Gudang Pesaing', desc: 'Lancar serangan kilat merampas stok bernilai tinggi milik kartel musuh.', effects: { moneyUsd: 32000, respect: 14, notoriety: 18, health: -8, karma: -18 } },
      { id: 'maf_jamuan_keluarga', tier: 2, isRare: false, icon: '🍷', title: 'Majlis Sumpah Setia Keluarga Sindiket', desc: 'Kukuhkan kesetiaan para kapten dengan jamuan mewah tertutup.', effects: { moneyUsd: -6000, respect: 13, happiness: 8, stress: -8 } },
      { id: 'maf_manipulasi_tender', tier: 2, isRare: false, icon: '🏗️', title: 'Kawal Tender Pembinaan Bandar', desc: 'Gunakan ugutan senyap agar syarikat proksi sindiket menang kontrak besar.', effects: { moneyUsd: 36000, respect: 10, notoriety: 14, karma: -16 } },
      { id: 'maf_kartel_global', tier: 3, isRare: false, icon: '🌐', title: 'Perikatan Kartel Rentas Benua', desc: 'Meterai rangkaian pengedaran antarabangsa bersama ketua sindiket luar negara.', effects: { moneyUsd: 68000, respect: 15, notoriety: 18, fame: 6, karma: -20 } },
      { id: 'maf_bank_pesisir', tier: 3, isRare: false, icon: '🏝️', title: 'Pindah Aset Ke Bank Pesisir Luar Negara', desc: 'Lindungi kekayaan empayar gelap daripada pembekuan aset pihak berkuasa.', effects: { moneyUsd: 45000, notoriety: -12, respect: 10, smarts: 4 } },
      { id: 'maf_kawal_pelabuhan', tier: 3, isRare: false, icon: '🚢', title: 'Monopoli Laluan Kargo Pelabuhan Utama', desc: 'Setiap kontena gelap yang masuk kini membayar ufti terus kepada anda.', effects: { moneyUsd: 82000, respect: 16, notoriety: 20, karma: -22 } },
      { id: 'maf_rare_pengkhianatan', tier: 2, isRare: true, icon: '🗡️', title: '🌟 KRISIS BESAR: Pengkhianatan Orang Kanan!', desc: 'KRISIS SINDIKET: Orang kepercayaan anda merancang rampasan kuasa malam ini!', effects: { respect: 18, moneyUsd: 40000, notoriety: 14, health: -6, stress: 14 } },
      { id: 'maf_rare_rompakan_kereta_kebal', tier: 2, isRare: true, icon: '💰', title: '🌟 PELUANG EMAS: Konvoi Emas Bank Pusat!', desc: 'PELUANG TERHAD: Maklumat dalaman mendedahkan laluan rahsia van jongkong emas!', effects: { moneyUsd: 115000, respect: 20, notoriety: 28, karma: -28, stress: 15 } },
      { id: 'maf_rare_tahta_godfather', tier: 3, isRare: true, icon: '👑', title: '🌟 SIDANG KEMUNCAK: Mesyuarat 5 Ketua Sindiket', desc: 'PELUANG EMAS: Tuntut penghormatan tertinggi dunia bawah sebagai Ketua Agung!', effects: { respect: 22, moneyUsd: 90000, fame: 10, notoriety: 16, rep: -6 } }
    ],

    // ========================================================================
    // MOD JENAYAH / PASARAN GELAP (20 Aktiviti)
    // ========================================================================
    crime: [
      { id: 'crm_seluk_saku', tier: 1, isRare: false, icon: '🥷', title: 'Operasi Seluk Saku Kawasan Sesak', desc: 'Sasarkan dompet pelancong leka di stesen tren waktu puncak.', effects: { moneyUsd: 850, notoriety: 8, karma: -8 } },
      { id: 'crm_curi_motor', tier: 1, isRare: false, icon: '🏍️', title: 'Curi & Lerai Motosikal Di Lorong Gelap', desc: 'Jual komponen alat ganti terpakai di bengkel haram.', effects: { moneyUsd: 2400, notoriety: 11, karma: -11 } },
      { id: 'crm_tiket_palsu', tier: 1, isRare: false, icon: '🎟️', title: 'Jual Tiket Konsert & Bola Palsu', desc: 'Cetak tiket tiruan berkualiti tinggi dan jual secara tunai di luar stadium.', effects: { moneyUsd: 3100, notoriety: 10, karma: -12, smarts: 2 } },
      { id: 'crm_barangan_curi', tier: 1, isRare: false, icon: '📱', title: 'Jadi Orang Tengah Barangan Curian', desc: 'Beli telefon dan gajet panas pada harga murah lalu jual ke luar bandar.', effects: { moneyUsd: 3600, notoriety: 12, karma: -10 } },
      { id: 'crm_phishing_siber', tier: 1, isRare: false, icon: '💻', title: 'Skim Phishing & Pautan Palsu', desc: 'Hantar mesej perbankan palsu yang memerangkap mangsa cuai.', effects: { moneyUsd: 5200, notoriety: 14, karma: -15, smarts: 3 } },
      { id: 'crm_pecah_kedai', tier: 1, isRare: false, icon: '🔓', title: 'Pecah Masuk Kedai Gajet Tengah Malam', desc: 'Matikan penggera dan sapu bersih stok telefon baharu dalam 3 minit.', effects: { moneyUsd: 6800, notoriety: 16, karma: -14, stress: 7 } },
      { id: 'crm_sembunyi_jejak', tier: 1, isRare: false, icon: '🕶️', title: 'Tukar Nombor & Padam Jejak Jalanan', desc: 'Bertenang seketika dan sejukkan buruan unit peronda polis.', effects: { moneyUsd: -600, notoriety: -14, stress: -8 } },
      { id: 'crm_klon_kad', tier: 2, isRare: false, icon: '💳', title: 'Operasi Klon Kad Kredit & ATM', desc: 'Pasang alat pengimbas halus pada mesin ATM terpencil.', effects: { moneyUsd: 12500, notoriety: 18, karma: -18, smarts: 3 } },
      { id: 'crm_curi_kereta_mewah', tier: 2, isRare: false, icon: '🏎️', title: 'Curi Kereta Sport Mewah Pesanan Khas', desc: 'Gunakan penggodam kunci tanpa wayar untuk melarikan kereta bernilai tinggi.', effects: { moneyUsd: 19500, notoriety: 20, karma: -18, stress: 9 } },
      { id: 'crm_pasar_gelap_seni', tier: 2, isRare: false, icon: '🖼️', title: 'Seludup Lukisan & Artifak Galeri', desc: 'Tukar lukisan asli di galeri kecil dengan salinan palsu secara licik.', effects: { moneyUsd: 26000, notoriety: 22, karma: -20, smarts: 4 } },
      { id: 'crm_godam_kripto', tier: 2, isRare: false, icon: '🪙', title: 'Godam Dompet Kripto Jutawan', desc: 'Cari kelemahan keselamatan pelayan dan pindahkan aset digital dalam senyap.', effects: { moneyUsd: 34000, notoriety: 22, karma: -22, smarts: 5 } },
      { id: 'crm_rompak_kedai_emas', tier: 2, isRare: false, icon: '💍', title: 'Rompakan Kilat Kedai Emas', desc: 'Operasi bertopeng penuh yang memerlukan ketepatan masa sesaat.', effects: { moneyUsd: 29000, notoriety: 26, karma: -24, stress: 12 } },
      { id: 'crm_dokumen_palsu', tier: 2, isRare: false, icon: '🪪', title: 'Bengkel Pemalsuan Dokumen & Pasport', desc: 'Bina rangkaian pelanggan pasaran gelap yang perlukan identiti segera.', effects: { moneyUsd: 16500, notoriety: 18, karma: -16, smarts: 3 } },
      { id: 'crm_rasuah_informan', tier: 2, isRare: false, icon: '🕵️', title: 'Beli Maklumat Jadual Serbuan Polis', desc: 'Bayar informan untuk tahu bila dan di mana sekatan jalan raya diadakan.', effects: { moneyUsd: -4000, notoriety: -18, stress: -10 } },
      { id: 'crm_rompakan_bank_mega', tier: 3, isRare: false, icon: '🏦', title: 'Rompakan Bilik Kebal Bank Utama', desc: 'Rancang terowong dan pasukan pakar untuk memecah bilik kebal utama.', effects: { moneyUsd: 78000, notoriety: 34, karma: -30, stress: 16 } },
      { id: 'crm_ransomware_korporat', tier: 3, isRare: false, icon: '🦠', title: 'Serangan Ransomware Konglomerat Besar', desc: 'Kunci pangkalan data gergasi korporat dan tuntut tebusan kripto.', effects: { moneyUsd: 64000, notoriety: 30, karma: -28, smarts: 5 } },
      { id: 'crm_curi_berlian_pameran', tier: 3, isRare: false, icon: '💎', title: 'Pencurian Berlian Pameran Antarabangsa', desc: 'Menyusup melepasi sistem laser untuk menyambar berlian lagenda.', effects: { moneyUsd: 92000, notoriety: 32, karma: -28, fame: 8 } },
      { id: 'crm_rare_van_tunai', tier: 1, isRare: true, icon: '🚚', title: '🌟 PELUANG EMAS: Van Tunai Terkandas Tanpa Pengiring!', desc: 'PELUANG TERHAD: Pintu belakang van keselamatan rosak di lorong sunyi!', effects: { moneyUsd: 48000, notoriety: 22, karma: -22, stress: 12 } },
      { id: 'crm_rare_pelanggan_misteri', tier: 2, isRare: true, icon: '✉️', title: '🌟 TAWARAN SULIT: Kontrak "Pencuri Hantu" Bilionair', desc: 'PELUANG TERHAD: Seorang pengumpul rahsia membayar lumayan untuk satu fail sulit.', effects: { moneyUsd: 85000, notoriety: 24, karma: -24, smarts: 4 } },
      { id: 'crm_rare_cuci_rekod', tier: 2, isRare: true, icon: '🧼', title: '🌟 PELUANG NADIR: Penggodam Hapus Semua Rekod Polis!', desc: 'PELUANG EMAS: Kenalan bawah tanah menawarkan pemadaman penuh fail siasatan anda.', effects: { moneyUsd: -12000, notoriety: -45, stress: -18 } }
    ],

    // ========================================================================
    // MOD ARTIS & MUZIK (20 Aktiviti)
    // ========================================================================
    artist: [
      { id: 'art_busking_viral', tier: 1, isRare: false, icon: '🎸', title: 'Sesi Busking Akustik & Rakaman Live', desc: 'Buat persembahan jalanan penuh jiwa dan muat naik klip pendeknya.', effects: { skill: 8, moneyUsd: 1600, fame: 5, followers: 4200, happiness: 8 } },
      { id: 'art_tulis_lagu', tier: 1, isRare: false, icon: '🎼', title: 'Berkampung Di Studio Tulis Lagu Baharu', desc: 'Cipta melodi dan lirik jujur berdasarkan kisah hidup sebenar.', effects: { skill: 11, smarts: 3, happiness: 6, stress: 4 } },
      { id: 'art_cover_trending', tier: 1, isRare: false, icon: '🎧', title: 'Rakam Lagu Cover Gaya Unik', desc: 'Ubah suai lagu tular semasa dengan susunan muzik identiti anda sendiri.', effects: { skill: 6, fame: 6, followers: 7500, moneyUsd: 1200 } },
      { id: 'art_gig_indie', tier: 1, isRare: false, icon: '🎤', title: 'Persembahan Gig Pentas Indie', desc: 'Bina peminat setia di kelab muzik bebas hujung minggu.', effects: { skill: 8, moneyUsd: 2200, fame: 5, happiness: 9 } },
      { id: 'art_kelas_vokal', tier: 1, isRare: false, icon: '🎶', title: 'Latihan Vokal & Penguasaan Pentas', desc: 'Asah pernafasan, julat suara dan karisma di hadapan penonton.', effects: { skill: 12, looks: 2, health: 2, moneyUsd: -800 } },
      { id: 'art_jual_merch', tier: 1, isRare: false, icon: '👕', title: 'Lancar Barangan Merch Edisi Peminat', desc: 'Jual baju-T, topi dan kaset edisi terhad kepada peminat setia.', effects: { moneyUsd: 4800, fame: 4, followers: 2600, happiness: 6 } },
      { id: 'art_live_amal', tier: 1, isRare: false, icon: '💛', title: 'Konsert Live Amal Kutip Derma', desc: 'Gunakan bakat muzik untuk membantu keluarga susah dan hospital.', effects: { karma: 14, fame: 8, rep: 6, followers: 6000, happiness: 12 } },
      { id: 'art_mv_bajet_tinggi', tier: 2, isRare: false, icon: '🎬', title: 'Rakam Video Muzik Sinematik', desc: 'Hasilkan visual memukau yang menjadi bualan hangat carta hiburan.', effects: { skill: 10, moneyUsd: 14000, fame: 12, followers: 22000, looks: 3 } },
      { id: 'art_kolab_bintang', tier: 2, isRare: false, icon: '🌟', title: 'Kolaborasi Duet Bersama Bintang Carta', desc: 'Gabungkan dua pangkalan peminat besar dalam satu single meletup!', effects: { skill: 9, moneyUsd: 22000, fame: 15, followers: 35000 } },
      { id: 'art_festival_muzik', tier: 2, isRare: false, icon: '🎪', title: 'Tampil Di Festival Muzik Terbesar Negara', desc: 'Gegarkan puluhan ribu penonton yang menyanyi bersama setiap bait lagu anda.', effects: { skill: 10, moneyUsd: 26000, fame: 14, happiness: 14, stress: 8 } },
      { id: 'art_tajaan_jenama', tier: 2, isRare: false, icon: '👜', title: 'Jadi Duta Jenama Fesyen & Gaya Hidup', desc: 'Tandatangan kempen pengiklanan besar di papan iklan seluruh bandar.', effects: { moneyUsd: 32000, fame: 10, looks: 4, rep: 3 } },
      { id: 'art_tepis_gosip', tier: 2, isRare: false, icon: '📰', title: 'Tepis Gosip Paparazi Dengan Elegan', desc: 'Tukar kontroversi murahan menjadi publisiti positif melalui temu bual matang.', effects: { fame: 8, rep: 5, stress: -6, happiness: 6 } },
      { id: 'art_album_konsep', tier: 2, isRare: false, icon: '💿', title: 'Lancar Album Penuh 12 Lagu', desc: 'Karya agung yang mempamerkan kematangan seni dan penceritaan anda.', effects: { skill: 14, moneyUsd: 35000, fame: 14, followers: 28000, stress: 10 } },
      { id: 'art_temubual_radio', tier: 2, isRare: false, icon: '📻', title: 'Jelajah Promosi Radio & Podcast Hiburan', desc: 'Kongsikan kisah di sebalik tabir karya anda kepada jutaan pendengar.', effects: { fame: 9, followers: 14000, happiness: 7 } },
      { id: 'art_jelajah_dunia', tier: 3, isRare: false, icon: '✈️', title: 'Konsert Jelajah Stadium Antarabangsa', desc: 'Tiket habis dijual di 12 bandar utama dunia dalam masa 10 minit!', effects: { skill: 12, moneyUsd: 95000, fame: 20, followers: 85000, health: -6, stress: 12 } },
      { id: 'art_jenama_sendiri', tier: 3, isRare: false, icon: '💎', title: 'Lancar Jenama Minyak Wangi & Fesyen Sendiri', desc: 'Bina empayar perniagaan menggunakan pengaruh nama besar anda.', effects: { moneyUsd: 82000, fame: 14, rep: 7, smarts: 3 } },
      { id: 'art_label_muzik', tier: 3, isRare: false, icon: '🏢', title: 'Tubuhkan Label Rakaman Untuk Bakat Baru', desc: 'Bimbing generasi artis muda sambil menjana royalti katalog jangka panjang.', effects: { moneyUsd: 55000, karma: 10, rep: 9, fame: 10 } },
      { id: 'art_rare_grammy', tier: 2, isRare: true, icon: '🏆', title: '🌟 PELUANG EMAS: Persembahan Pentas Anugerah Utama!', desc: 'PELUANG TERHAD: Penganjur memilih anda membuat persembahan penutup paling dinantikan!', effects: { moneyUsd: 48000, fame: 24, followers: 95000, rep: 10, happiness: 20 } },
      { id: 'art_rare_cancel', tier: 2, isRare: true, icon: '🔥', title: '🌟 KRISIS BESAR: Serangan Cancel Culture Tular!', desc: 'KRISIS MEDIA: Klip lama disunting luar konteks — cara anda menjawab menentukan karier anda!', effects: { fame: 12, rep: 6, stress: 14, followers: 20000 } },
      { id: 'art_rare_soundtrack_global', tier: 3, isRare: true, icon: '🌍', title: '🌟 TAWARAN IKONIK: Lagu Tema Filem Blockbuster Dunia!', desc: 'PELUANG EMAS: Studio gergasi memilih lagu anda sebagai tema rasmi filem terbesar tahun ini!', effects: { moneyUsd: 120000, fame: 25, followers: 140000, rep: 12, skill: 10 } }
    ],

    // ========================================================================
    // MOD PELAKON & FILEM (20 Aktiviti)
    // ========================================================================
    actor: [
      { id: 'actr_ujibakat_iklan', tier: 1, isRare: false, icon: '📺', title: 'Ujibakat Iklan Komersial & Kempen TV', desc: 'Tunjukkan ekspresi wajah semula jadi di hadapan pengarah iklan.', effects: { skill: 7, moneyUsd: 2400, fame: 4, looks: 2 } },
      { id: 'actr_bengkel_teater', tier: 1, isRare: false, icon: '🎭', title: 'Sertai Bengkel Teater & Method Acting', desc: 'Dalami penghayatan watak, lontaran suara dan emosi pentas.', effects: { skill: 13, smarts: 3, happiness: 7, moneyUsd: -700 } },
      { id: 'actr_filem_pendek', tier: 1, isRare: false, icon: '🎞️', title: 'Berlakon Filem Pendek Festival Indie', desc: 'Bekerjasama dengan pengarah muda berbakat demi portfolio mantap.', effects: { skill: 10, fame: 5, followers: 4800, rep: 3 } },
      { id: 'actr_latihan_aksi', tier: 1, isRare: false, icon: '🥋', title: 'Latihan Koreografi Aksi & Stunt', desc: 'Kuasai babak lawan dan aksi lasak tanpa pelakon lagak ngeri.', effects: { skill: 9, health: 6, looks: 3, stress: 4 } },
      { id: 'actr_watak_pembantu', tier: 1, isRare: false, icon: '🎬', title: 'Watak Pembantu Drama Petang', desc: 'Curi tumpuan penonton dengan lakonan jujur walaupun babak singkat.', effects: { skill: 8, moneyUsd: 4200, fame: 6, followers: 6500 } },
      { id: 'actr_sesi_fotografi', tier: 1, isRare: false, icon: '📸', title: 'Sesi Fotografi Kulit Majalah Gaya Hidup', desc: 'Naikkan profil visual dan tarik perhatian ejen pencarian bakat.', effects: { looks: 5, fame: 6, moneyUsd: 2800, followers: 5200 } },
      { id: 'actr_suara_animasi', tier: 1, isRare: false, icon: '🎙️', title: 'Jadi Pelakon Suara Filem Animasi', desc: 'Hidupkan watak animasi keluarga yang digemari kanak-kanak.', effects: { skill: 8, moneyUsd: 4600, happiness: 10, karma: 4 } },
      { id: 'actr_hero_siri_tv', tier: 2, isRare: false, icon: '📡', title: 'Terajui Siri Drama Penstriman Popular', desc: 'Siri 10 episod anda menduduki tangga #1 tontonan serantau!', effects: { skill: 11, moneyUsd: 28000, fame: 16, followers: 42000, stress: 8 } },
      { id: 'actr_karpet_merah', tier: 2, isRare: false, icon: '✨', title: 'Hadir Malam Gala Karpet Merah', desc: 'Bergaya memukau di hadapan lensa antarabangsa dan pengarah terkenal.', effects: { fame: 11, looks: 4, rep: 5, followers: 18000, happiness: 10 } },
      { id: 'actr_filem_aksi', tier: 2, isRare: false, icon: '💥', title: 'Penggambaran Filem Aksi Bajet Besar', desc: 'Babak letupan dan kejar-mengejar lasak di lokasi eksotik.', effects: { skill: 10, moneyUsd: 38000, fame: 15, health: -4, stress: 9 } },
      { id: 'actr_biopik_serius', tier: 2, isRare: false, icon: '📜', title: 'Watak Biopik Sejarah Berat', desc: 'Transformasi fizikal dan emosi mendalam yang memikat pengkritik filem.', effects: { skill: 14, moneyUsd: 26000, fame: 13, rep: 8, smarts: 4 } },
      { id: 'actr_duta_mewah', tier: 2, isRare: false, icon: '⌚', title: 'Kontrak Duta Jam & Rumah Fesyen Mewah', desc: 'Wajah anda menghiasi kempen butik elit di seluruh negara.', effects: { moneyUsd: 42000, fame: 10, looks: 5, rep: 4 } },
      { id: 'actr_tepis_paparazi', tier: 2, isRare: false, icon: '🕶️', title: 'Kawal Naratif Media & Gosip Set', desc: 'Tangani khabar angin lokasi penggambaran secara matang dan profesional.', effects: { fame: 7, rep: 5, stress: -5 } },
      { id: 'actr_bual_bicara', tier: 2, isRare: false, icon: '🎤', title: 'Tetamu Rancangan Bual Bicara Tengah Malam', desc: 'Pesona dan humor spontan anda membuatkan klip temu bual tular!', effects: { fame: 11, followers: 24000, happiness: 9 } },
      { id: 'actr_blockbuster_dunia', tier: 3, isRare: false, icon: '🌍', title: 'Bintang Utama Filem Blockbuster Global', desc: 'Filem anda mengutip ratusan juta di pawagam seluruh dunia!', effects: { skill: 12, moneyUsd: 115000, fame: 22, followers: 120000, rep: 10 } },
      { id: 'actr_arah_filem', tier: 3, isRare: false, icon: '🎥', title: 'Arah & Terbit Filem Karya Sendiri', desc: 'Duduk di kerusi pengarah menerbitkan naskhah impian peribadi.', effects: { skill: 15, moneyUsd: 88000, fame: 16, rep: 11, smarts: 5 } },
      { id: 'actr_festival_cannes', tier: 3, isRare: false, icon: '🏛️', title: 'Tayangan Perdana Festival Filem Antarabangsa', desc: 'Menerima tepukan berdiri 8 minit daripada pengkritik sinema dunia!', effects: { fame: 20, rep: 14, happiness: 18, skill: 10 } },
      { id: 'actr_rare_ujibakat_hollywood', tier: 2, isRare: true, icon: '🌟', title: '🌟 PELUANG EMAS: Ujibakat Produksi Antarabangsa!', desc: 'PELUANG TERHAD: Pengarah terkenal dunia mencari pelakon baharu untuk francais mega!', effects: { moneyUsd: 65000, fame: 22, followers: 90000, skill: 12, rep: 10 } },
      { id: 'actr_rare_oscar_nom', tier: 3, isRare: true, icon: '🏆', title: '🌟 PENCALONAN: Anugerah Pelakon Terbaik Tahun Ini!', desc: 'PELUANG EMAS: Lakonan anda dicalonkan dalam malam anugerah perfileman paling berprestij!', effects: { moneyUsd: 75000, fame: 26, followers: 130000, rep: 15, happiness: 22 } },
      { id: 'actr_rare_stunt_kecemasan', tier: 2, isRare: true, icon: '🚨', title: '🌟 KRISIS SET: Kemalangan Babak Aksi Di Lokasi!', desc: 'KRISIS PENGAMBARAN: Prop terbakar tiba-tiba — tindakan berani anda menyelamatkan kru!', effects: { karma: 14, fame: 16, rep: 10, health: -5, happiness: 10 } }
    ],

    // ========================================================================
    // MOD PENJARA (20 Aktiviti Dinamik Banduan)
    // ========================================================================
    prison: [
      { id: 'prs_seludup_kantin', tier: 1, isRare: false, icon: '📦', title: 'Urus Niaga Snek & Barang Seludup Sel', desc: 'Tukar barangan kantin dengan banduan blok lain untuk untung kecil.', effects: { moneyUsd: 650, respect: 7, behavior: -6 } },
      { id: 'prs_latihan_sel', tier: 1, isRare: false, icon: '💪', title: 'Latihan Kalistenik Intensif Di Dalam Sel', desc: 'Bina kekuatan fizikal dan daya tahan tanpa sebarang alatan.', effects: { health: 8, respect: 6, stress: -6 } },
      { id: 'prs_tulis_memoir', tier: 1, isRare: false, icon: '✍️', title: 'Tulis Buku & Memoir Dari Dalam Sel', desc: 'Catat kisah silam, keinsafan dan pengajaran hidup untuk diterbitkan.', effects: { smarts: 6, karma: 6, behavior: 7, happiness: 7, stress: -8 } },
      { id: 'prs_kelas_pemulihan', tier: 1, isRare: false, icon: '🕊️', title: 'Sertai Kelas Pemulihan & Kaunseling Khas', desc: 'Tunjukkan keinsafan tulen demi mempercepatkan peluang parol.', effects: { behavior: 12, karma: 10, stress: -10, happiness: 6 } },
      { id: 'prs_bengkel_dobi', tier: 1, isRare: false, icon: '🧺', title: 'Kerja Lebih Masa Di Dobi & Dapur Penjara', desc: 'Kumpul upah simpanan dan raih kepercayaan pegawai penjara.', effects: { moneyUsd: 550, behavior: 9, karma: 4 } },
      { id: 'prs_siasat_paip', tier: 1, isRare: false, icon: '🗺️', title: 'Siasat Pelan Laluan Paip & Dapur', desc: 'Perhatikan jadual pertukaran pengawal dan kelemahan tembok blok.', effects: { smarts: 5, respect: 5, behavior: -4 } },
      { id: 'prs_baca_undang', tier: 1, isRare: false, icon: '⚖️', title: 'Kaji Fail Rayuan Di Perpustakaan Penjara', desc: 'Cari lompong teknikal kes anda untuk mengukuhkan rayuan mahkamah.', effects: { smarts: 8, behavior: 6, happiness: 4 } },
      { id: 'prs_gelanggang_bawah', tier: 2, isRare: false, icon: '🥊', title: 'Pertarungan Gelanggang Bawah Tanah', desc: 'Sahut cabaran banduan paling digeruni di laman belakang blok.', effects: { respect: 15, health: -8, behavior: -12, moneyUsd: 1200 } },
      { id: 'prs_orang_tengah_geng', tier: 2, isRare: false, icon: '🤝', title: 'Jadi Orang Tengah Rundingan Dua Geng', desc: 'Leraikan ketegangan antara dua blok untuk meraih hormat kedua-dua pihak.', effects: { respect: 14, smarts: 4, karma: 4, rep: 2 } },
      { id: 'prs_pakatan_warden', tier: 2, isRare: false, icon: '🔑', title: 'Buat Pakatan Sulit Dengan Pengawal Korup', desc: 'Bayar sedikit wang untuk mendapat kemudahan sel dan berita luar.', effects: { moneyUsd: -900, respect: 10, happiness: 8, behavior: -8, notoriety: 6 } },
      { id: 'prs_mentor_banduan', tier: 2, isRare: false, icon: '📚', title: 'Ajar Banduan Muda Membaca & Mengira', desc: 'Bantu rakan sel mendapatkan kelulusan pendidikan semasa di dalam.', effects: { behavior: 14, karma: 14, respect: 8, rep: 4, happiness: 10 } },
      { id: 'prs_rangkaian_telefon', tier: 2, isRare: false, icon: '📱', title: 'Kawal Rangkaian Telefon Seludup Blok', desc: 'Jana bayaran sewa daripada banduan lain yang mahu menghubungi keluarga.', effects: { moneyUsd: 2100, respect: 11, behavior: -10, notoriety: 5 } },
      { id: 'prs_tukang_tatu', tier: 2, isRare: false, icon: '🎨', title: 'Lukis Potret Keluarga Untuk Banduan Lain', desc: 'Gunakan bakat seni anda untuk menambah pendapatan dan kawan di dalam.', effects: { moneyUsd: 950, respect: 9, happiness: 8, stress: -6 } },
      { id: 'prs_protes_makanan', tier: 2, isRare: false, icon: '🥣', title: 'Pimpin Petisyen Kualiti Makanan Penjara', desc: 'Suarakan hak asas banduan secara berhemah kepada pengarah penjara.', effects: { respect: 12, behavior: 5, karma: 6, health: 4 } },
      { id: 'prs_raja_blok', tier: 3, isRare: false, icon: '👑', title: 'Kukuhkan Pengaruh Sebagai "O.G." Blok', desc: 'Semua pertikaian di sayap keselamatan tinggi kini dirujuk kepada anda.', effects: { respect: 18, moneyUsd: 3200, behavior: -8, happiness: 8 } },
      { id: 'prs_temubual_dokumen', tier: 3, isRare: false, icon: '🎥', title: 'Temu Bual Dokumentari Kehidupan Penjara', desc: 'Kisah hidup anda disiarkan di TV dan meraih simpati masyarakat luar.', effects: { fame: 12, karma: 6, rep: 5, behavior: 8 } },
      { id: 'prs_surat_pengampunan', tier: 3, isRare: false, icon: '📜', title: 'Kumpul Sokongan Untuk Petisyen Pengampunan', desc: 'Dapatkan sokongan warden dan peguam untuk memohon pengurangan hukuman.', effects: { behavior: 14, karma: 8, happiness: 9 } },
      { id: 'prs_rare_selamat_warden', tier: 1, isRare: true, icon: '🛡️', title: '🌟 PELUANG EMAS: Selamatkan Pengawal Ketika Serangan!', desc: 'KRISIS BLOK: Seorang pengawal dikepung — menyelamatkannya membuka peluang pengurangan hukuman!', effects: { behavior: 25, karma: 18, rep: 8, reduceYears: 1, happiness: 14 } },
      { id: 'prs_rare_terowong_lama', tier: 2, isRare: true, icon: '🕳️', title: '🌟 PENEMUAN RAHSIA: Peta Laluan Bawah Tanah Lama!', desc: 'PELUANG TERHAD: Di balik batu longgar sel lama tersorok peta rahsia banduan era 1980-an!', effects: { smarts: 8, respect: 12, happiness: 10 } },
      { id: 'prs_rare_amnesti', tier: 2, isRare: true, icon: '🕊️', title: '🌟 PELUANG NADIR: Semakan Pengurangan Hukuman Diraja!', desc: 'PELUANG EMAS: Sempena hari kebesaran negara, banduan berkelakuan baik dipertimbangkan pengurangan hukuman!', effects: { behavior: 15, reduceYears: 2, happiness: 20, karma: 10 } }
    ]
  },

  // --------------------------------------------------------------------------
  // 2. 36 DILEMA INTERAKTIF KHUSUS MOD (6 SETIAP MOD — 3 PENDEKATAN BERBEZA!)
  //    Setiap dilema menawarkan: Cara Jujur/Selamat, Cara Berani/Berisiko, Cara Licik/Kotor
  // --------------------------------------------------------------------------
  DILEMMAS: {
    politic: [
      {
        id: 'dil_pol_tender', icon: '🏗️', title: 'Dilema Menteri: Tender Projek Bernilai Ratusan Juta',
        text: 'Dua syarikat membida projek hospital awam: Syarikat A menawarkan harga telus & berkualiti, manakala Syarikat B (milik kroni) menawarkan "derma politik" rahsia yang lumayan.',
        choices: [
          { label: 'Luluskan Syarikat A melalui tender terbuka 100% telus', hint: 'Cara Jujur: Sokongan ++, Karma ++, Reputasi Keluarga ++', effects: { approval: 12, karma: 16, rep: 7 }, outcome: 'Rakyat memuji ketelusan anda! Hospital siap tepat masa dan nama keluarga anda harum.' },
          { label: 'Paksa kedua-dua syarikat bergabung & potong kos 20% demi rakyat', hint: 'Cara Berani: Kepintaran +, Sokongan +, Stres +', effects: { approval: 9, smarts: 5, stress: 8, rep: 4 }, outcome: 'Langkah berani anda menjimatkan jutaan dana awam walaupun menekan jadual kementerian.' },
          { label: 'Terima "derma" rahsia Syarikat B & luluskan di sebalik tabir', hint: 'Cara Licik: Wang +++, tetapi Karma --- & Haba Polis ++', effects: { moneyUsd: 65000, karma: -22, notoriety: 20, approval: -8, rep: -6 }, outcome: 'Wang besar masuk ke akaun proksi anda, namun risiko siasatan anti-rasuah kini menghantui!' }
        ]
      },
      {
        id: 'dil_pol_media_leak', icon: '📰', title: 'Kebocoran Memo Dalaman Kementerian!',
        text: 'Seorang pembocor maklumat menyerahkan draf memo sensitif kementerian anda kepada akhbar utama sebelum dasar dimuktamadkan.',
        choices: [
          { label: 'Adakan sidang media terbuka & jelaskan draf sebenar secara jujur', hint: 'Cara Jujur: Sokongan +, Karma +, Reputasi +', effects: { approval: 9, karma: 10, rep: 4 }, outcome: 'Kejujuran anda meredakan panik dan wartawan menghormati keterbukaan anda.' },
          { label: 'Pusing naratif: bentangkan versi lebih berani terus di Parlimen!', hint: 'Cara Berani: Populariti ++, Sokongan ++, Stres +', effects: { approval: 12, fame: 12, stress: 9 }, outcome: 'Serangan balas politik anda mengejutkan pembangkang dan meraih pujian ramai!' },
          { label: 'Gunakan lobi media untuk menyekat berita & buru pembocor maklumat', hint: 'Cara Licik: Kawalan sementara, Karma --, Haba +', effects: { approval: -5, karma: -14, notoriety: 12, stress: 8 }, outcome: 'Berita berjaya diredam sementara, tetapi desas-desus mula tersebar di media sosial.' }
        ]
      },
      {
        id: 'dil_pol_strike', icon: '🪧', title: 'Mogok Besar Pekerja Sektor Awam!',
        text: 'Ribuan pekerja berhimpun di hadapan bangunan kementerian menuntut pelarasan gaji dan elaun segera.',
        choices: [
          { label: 'Turun sendiri berdialog & tandatangani pelan kenaikan berperingkat', hint: 'Cara Jujur: Sokongan +++, Karma ++, Reputasi +', effects: { approval: 15, karma: 14, rep: 6, stress: 6 }, outcome: 'Penunjuk perasaan bersorak menghargai keberanian anda turun mendengar keluhan mereka!' },
          { label: 'Tawarkan bonus prestasi khas bersyarat reformasi produktiviti', hint: 'Cara Berani: Kepintaran +, Sokongan +', effects: { approval: 8, smarts: 5, rep: 3, stress: 7 }, outcome: 'Kesatuan pekerja bersetuju kembali bertugas selepas rundingan sengit.' },
          { label: 'Arahkan tindakan tegas & ugut potong gaji peserta mogok', hint: 'Cara Kotor: Sokongan ---, Karma --, Stres +', effects: { approval: -14, karma: -16, notoriety: 8, stress: 10 }, outcome: 'Mogok bersurai secara paksa tetapi imej anda di mata rakyat tercalar teruk.' }
        ]
      },
      {
        id: 'dil_pol_ally_scandal', icon: '⚖️', title: 'Rakan Sekutu Parti Terpalit Skandal!',
        text: 'Seorang sekutu rapat yang pernah membantu kempen anda kini disiasat atas penyelewengan dana.',
        choices: [
          { label: 'Tegas menyokong siasatan bebas tanpa melindungi sesiapa', hint: 'Cara Jujur: Sokongan ++, Karma ++, Reputasi Keluarga ++', effects: { approval: 13, karma: 15, rep: 8 }, outcome: 'Prinsip integriti anda dipuji seluruh negara — kepercayaan rakyat melonjak!' },
          { label: 'Minta beliau bercuti rehat sementara menunggu keputusan mahkamah', hint: 'Cara Selamat: Seimbang', effects: { approval: 5, smarts: 3, stress: 4 }, outcome: 'Keputusan diplomatik anda menenangkan kedua-dua pihak buat sementara waktu.' },
          { label: 'Pertahankan beliau habis-habisan demi undi dalaman parti', hint: 'Cara Licik: Dana parti +, Sokongan --, Reputasi -', effects: { moneyUsd: 18000, approval: -10, karma: -14, rep: -5 }, outcome: 'Anda kekal disokong panglima parti tetapi dikritik hebat oleh orang awam.' }
        ]
      },
      {
        id: 'dil_pol_foreign_deal', icon: '🌏', title: 'Perjanjian Pelaburan Asing Gergasi',
        text: 'Syarikat teknologi gergasi asing mahu membina kilang cip bernilai bilion, tetapi meminta pengecualian cukai selama 10 tahun.',
        choices: [
          { label: 'Luluskan dengan syarat wajib pemindahan teknologi & 80% pekerja tempatan', hint: 'Cara Jujur & Bijak: Sokongan +++, Reputasi ++, Kepintaran +', effects: { approval: 14, smarts: 6, rep: 8, fame: 10 }, outcome: 'Perjanjian menang-menang bersejarah yang mencipta ribuan pekerjaan bergaji tinggi!' },
          { label: 'Tuntut mereka bayar cukai penuh atau cari pelabur lain', hint: 'Cara Berani: Sokongan +, risiko pelabur tarik diri', effects: { approval: 6, karma: 6, stress: 6 }, outcome: 'Pendirian tegas anda dihormati walaupun rundingan mengambil masa lebih lama.' },
          { label: 'Luluskan syarat mereka serta-merta dengan balasan saham proksi', hint: 'Cara Kotor: Wang +++, Karma ---, Haba ++', effects: { moneyUsd: 80000, karma: -22, notoriety: 18, approval: -7 }, outcome: 'Kilang dibuka segera dan poket rahsia anda tebal, namun kesannya berisiko tinggi.' }
        ]
      },
      {
        id: 'dil_pol_disaster_budget', icon: '🚑', title: 'Krisis Kecemasan: Dana Bantuan Hampir Kering',
        text: 'Bencana luar jangka melanda tiga negeri serentak dan bajet kecemasan hampir habis.',
        choices: [
          { label: 'Potong elaun menteri & salurkan segera kepada tabung bencana', hint: 'Cara Jujur: Sokongan +++, Karma +++, Reputasi ++', effects: { moneyUsd: -6000, approval: 18, karma: 18, rep: 9 }, outcome: 'Pengorbanan anda menjadi contoh teladan dan tular dengan pujian rakyat!' },
          { label: 'Lancar kerjasama kecemasan awam-swasta dalam 24 jam', hint: 'Cara Berani: Kepintaran +, Sokongan ++, Populariti +', effects: { approval: 12, smarts: 5, fame: 9, rep: 5 }, outcome: 'Syarikat korporat dan NGO bersatu padu menghantar bantuan pantas!' },
          { label: 'Gunakan dana darurat untuk projek kroni sambil bergambar di pusat pemindahan', hint: 'Cara Kotor: Wang ++, Sokongan ---, Karma ---', effects: { moneyUsd: 35000, approval: -16, karma: -24, rep: -9, notoriety: 14 }, outcome: 'Warganet membongkar taktik anda dan kemarahan rakyat memuncak!' }
        ]
      }
    ],

    mafia: [
      {
        id: 'dil_maf_snitch', icon: '🐀', title: 'Dilema Sindiket: Pembelot Dikesan!',
        text: 'Anda mendapati salah seorang ahli muda sindiket sedang membocorkan maklumat kepada detektif polis kerana keluarganya diugut.',
        choices: [
          { label: 'Bantu selesaikan masalah keluarganya & beri peluang kedua sebagai ejen ganda', hint: 'Cara Bijak: Hormat ++, Haba --, Karma +', effects: { respect: 14, notoriety: -12, karma: 6, smarts: 4 }, outcome: 'Dia bersumpah setia seumur hidup dan kini menyalurkan maklumat palsu kepada polis!' },
          { label: 'Halau dia keluar dari bandar tanpa mencederakannya', hint: 'Cara Selamat: Hormat +, Haba -', effects: { respect: 6, notoriety: -6, karma: 2 }, outcome: 'Dia melarikan diri jauh dan rahsia sindiket kekal selamat.' },
          { label: 'Hukum dia dengan keras sebagai amaran kepada semua ahli', hint: 'Cara Kejam: Hormat +++, Haba ++, Karma ---', effects: { respect: 20, notoriety: 18, karma: -24, rep: -6 }, outcome: 'Seluruh dunia bawah gerun dengan ketegasan anda, namun polis makin menghidu jejak anda!' }
        ]
      },
      {
        id: 'dil_maf_turf', icon: '🔥', title: 'Pencerobohan Kawasan Oleh Kartel Jiran',
        text: 'Kumpulan musuh mula memungut wang di kelab malam yang berada di bawah perlindungan sindiket anda.',
        choices: [
          { label: 'Ajak ketua mereka berunding & tawarkan perkongsian hasil 70/30', hint: 'Cara Diplomatik: Wang +, Hormat +, Haba -', effects: { moneyUsd: 16000, respect: 10, notoriety: -5, smarts: 4 }, outcome: 'Perang berdarah dielakkan dan aliran wang tunai kekal stabil!' },
          { label: 'Lancar serangan kilat merampas semua kelab mereka malam ini!', hint: 'Cara Berani: Wang +++, Hormat +++, Haba ++', effects: { moneyUsd: 42000, respect: 18, notoriety: 22, health: -7, karma: -18 }, outcome: 'Kemenangan mutlak! Seluruh daerah kini tunduk kepada sindiket anda!' },
          { label: 'Bocor lokasi gudang musuh kepada polis secara anonim', hint: 'Cara Licik: Musuh lumpuh, Hormat ++, Haba -', effects: { moneyUsd: 22000, respect: 14, notoriety: -8, karma: -12, smarts: 5 }, outcome: 'Polis menyerbu kartel musuh dan anda mengambil alih kawasan mereka tanpa sebutir peluru!' }
        ]
      },
      {
        id: 'dil_maf_police_bribe', icon: '👮', title: 'Pegawai Penyiasat Meminta "Bayaran Tutup Fail"',
        text: 'Seorang pegawai korup mendakwa memiliki rakaman transaksi gelap anda dan meminta wang sogokan besar.',
        choices: [
          { label: 'Bayar jumlah penuh untuk memastikan semua bukti dimusnahkan', hint: 'Cara Selamat: Wang --, Haba ---', effects: { moneyUsd: -14000, notoriety: -24, stress: -10 }, outcome: 'Fail siasatan lenyap daripada sistem dan anda boleh bernafas lega.' },
          { label: 'Rakam perbualan rasuahnya & jadikan dia tali barut tetap anda!', hint: 'Cara Licik: Kepintaran +, Hormat ++, Haba --', effects: { respect: 15, notoriety: -18, smarts: 5, karma: -12 }, outcome: 'Kini giliran anda memegang rahsianya — dia bekerja di bawah telunjuk anda!' },
          { label: 'Enggan bayar & berpindah operasi ke daerah lain serta-merta', hint: 'Cara Berani: Wang selamat, Haba +', effects: { notoriety: 10, respect: 8, stress: 8 }, outcome: 'Anda memindahkan gudang semalaman sebelum pasukan polis tiba.' }
        ]
      },
      {
        id: 'dil_maf_charity_front', icon: '🍲', title: 'Cadangan Menaja Yayasan Kebajikan Kejiranan',
        text: 'Penasihat anda mencadangkan sindiket menaja dapur percuma untuk penduduk miskin demi mengaburi mata pihak berkuasa.',
        choices: [
          { label: 'Taja secara jujur tanpa mengambil sebarang keuntungan gelap', hint: 'Cara Jujur: Karma ++, Reputasi Keluarga +, Haba -', effects: { moneyUsd: -8000, karma: 14, rep: 6, notoriety: -10, respect: 8 }, outcome: 'Penduduk tempatan menyayangi anda dan polis sukar mendapatkan saksi menentang anda.' },
          { label: 'Gunakan yayasan itu sebagai saluran cuci wang besar-besaran', hint: 'Cara Licik: Wang +++, Haba --, Karma -', effects: { moneyUsd: 32000, notoriety: -12, karma: -14, smarts: 4 }, outcome: 'Berpuluh ribu wang gelap bertukar menjadi aset sah yang bersih!' },
          { label: 'Tolak cadangan — kekalkan profil rendah tanpa publisiti', hint: 'Cara Selamat: Stres -', effects: { notoriety: -6, stress: -6 }, outcome: 'Anda memilih bergerak dalam bayang-bayang tanpa menarik perhatian kamera.' }
        ]
      },
      {
        id: 'dil_maf_heist_split', icon: '💎', title: 'Pertikaian Pembahagian Hasil Rompakan',
        text: 'Selepas operasi besar berjaya, dua orang kapten bertengkar hebat menuntut bahagian keuntungan lebih besar.',
        choices: [
          { label: 'Bahagi sama rata & beri bonus tambahan daripada bahagian anda', hint: 'Cara Adil: Hormat +++, Kesetiaan kukuh', effects: { moneyUsd: 12000, respect: 18, karma: 4, stress: -6 }, outcome: 'Kedua-dua kapten menunduk hormat atas kepimpinan adil anda.' },
          { label: 'Uji mereka dengan misi baharu — siapa berjaya dapat bahagian terbesar', hint: 'Cara Berani: Wang ++, Hormat ++', effects: { moneyUsd: 28000, respect: 14, smarts: 4 }, outcome: 'Persaingan sihat itu menggandakan lagi keuntungan sindiket!' },
          { label: 'Rampas 80% untuk diri sendiri & ugut sesiapa yang membantah', hint: 'Cara Kotor: Wang +++, Hormat --, Stres +', effects: { moneyUsd: 48000, respect: -8, karma: -16, stress: 12 }, outcome: 'Poket anda penuh tetapi rasa tidak puas hati mula membara di kalangan anak buah.' }
        ]
      },
      {
        id: 'dil_maf_rival_offer', icon: '💼', title: 'Tawaran Penggabungan Sindiket Antarabangsa',
        text: 'Utusan kartel luar negara menawarkan senjata, laluan laut dan modal besar jika anda berkongsi 30% kuasa.',
        choices: [
          { label: 'Tolak campur tangan luar & pertahankan kemerdekaan sindiket tempatan', hint: 'Cara Berani: Hormat +++, Reputasi Jalanan +', effects: { respect: 18, notoriety: 6, happiness: 10 }, outcome: 'Ahli sindiket bersorak bangga — anda kekal tuan di tanah sendiri!' },
          { label: 'Terima perkongsian strategik dengan syarat anda kekal Ketua Utama', hint: 'Cara Bijak: Wang +++, Hormat ++', effects: { moneyUsd: 55000, respect: 14, notoriety: 14, smarts: 4 }, outcome: 'Empayar anda berkembang pesat dengan sokongan rangkaian antarabangsa!' },
          { label: 'Pura-pura setuju lalu rampas kargo pertama mereka!', hint: 'Cara Licik: Wang ++++, Haba +++, risiko besar', effects: { moneyUsd: 85000, respect: 12, notoriety: 26, karma: -22, stress: 14 }, outcome: 'Rampasan gergasi berjaya, namun musuh baharu kini memburu anda!' }
        ]
      }
    ],

    crime: [
      {
        id: 'dil_crm_witness', icon: '👀', title: 'Saksi Mata Terlihat Anda Di Lorong!',
        text: 'Sejurus selepas operasi anda, seorang pekerja kedai yang pulang lewat malam ternampak wajah anda memegang beg hasil!',
        choices: [
          { label: 'Hulurkan sebahagian wang tunai untuk menutup mulutnya secara tenang', hint: 'Cara Licik: Wang -, Haba tidak naik', effects: { moneyUsd: -1500, notoriety: -6, stress: -4 }, outcome: 'Dia mengangguk cepat, mengambil wang dan berpura-pura tidak nampak apa-apa.' },
          { label: 'Pecut lari menyusuri lorong gelap sebelum dia sempat merakam gambar', hint: 'Cara Berani: Wang penuh, Kesihatan -2, Haba +6', effects: { moneyUsd: 4500, notoriety: 6, health: -2 }, outcome: 'Anda berjaya menghilangkan diri dalam kegelapan malam!' },
          { label: 'Tinggalkan beg hasil & pura-pura sedang mencari kucing hilang', hint: 'Cara Selamat: Tiada Haba, Karma +', effects: { notoriety: -10, karma: 4, smarts: 3 }, outcome: 'Lakonan selamba anda berjaya mengelirukan saksi dan anda selamat tanpa rekod!' }
        ]
      },
      {
        id: 'dil_crm_partner_greed', icon: '💰', title: 'Rakan Subahat Cuba Melarikan Semua Hasil!',
        text: 'Selepas memecah masuk gudang, rakan kongsi anda cuba memecut van bersama semua barang berharga meninggalkan anda!',
        choices: [
          { label: 'Pintas van menggunakan jalan pintas & tuntut bahagian anda 50/50', hint: 'Cara Berani: Wang ++, Kepintaran +', effects: { moneyUsd: 12000, smarts: 4, stress: 6 }, outcome: 'Dia terkejut melihat anda sudah menunggu di simpang dan terpaksa menyerahkan separuh hasil!' },
          { label: 'Biarkan dia pergi tetapi godam e-dompet simpanannya malam itu', hint: 'Cara Licik: Wang +++, Kepintaran ++, Karma -', effects: { moneyUsd: 18500, smarts: 5, karma: -12 }, outcome: 'Pembalasan digital yang sangat bersih — anda dapat lebih daripada bahagian asal!' },
          { label: 'Berundur segera sebelum siren polis tiba di lokasi', hint: 'Cara Selamat: Haba --, Kesihatan selamat', effects: { notoriety: -12, stress: -6 }, outcome: 'Rakan tamak anda diberkas polis 2 kilometer kemudian manakala anda bebas selamat!' }
        ]
      },
      {
        id: 'dil_crm_fence_scam', icon: '💎', title: 'Pembeli Pasaran Gelap Menawarkan Harga Terlalu Rendah',
        text: 'Peniaga barang panas cuba memeras anda dengan hanya membayar 20% daripada nilai sebenar barang rampasan anda.',
        choices: [
          { label: 'Gunakan data pasaran & berunding dengan tegas untuk 70% nilai', hint: 'Cara Bijak: Wang ++, Kepintaran +', effects: { moneyUsd: 14000, smarts: 4, happiness: 8 }, outcome: 'Dia akur dengan kepintaran rundingan anda dan membayar tunai penuh!' },
          { label: 'Cari pembeli persendirian di negara jiran melalui pasaran gelap dalam talian', hint: 'Cara Berani: Wang +++, Haba +8', effects: { moneyUsd: 24000, notoriety: 8, stress: 6 }, outcome: 'Jualan terus menghasilkan pulangan berganda!' },
          { label: 'Terima sahaja tawaran rendah demi melupuskan bukti dengan pantas', hint: 'Cara Selamat: Wang kecil, Haba --', effects: { moneyUsd: 3500, notoriety: -10 }, outcome: 'Bukti lenyap serta-merta dan anda bebas daripada risiko serbuan.' }
        ]
      },
      {
        id: 'dil_crm_roadblock', icon: '🚔', title: 'Sekatan Jalan Raya Mengejut Di Hadapan!',
        text: 'Lampu biru polis berkilauan 200 meter di hadapan sedangkan bonet kereta anda penuh barang panas!',
        choices: [
          { label: 'Tenang, senyum mesra & berbual santai dengan pegawai di sekatan', hint: 'Cara Tenang: Bergantung pada ketenangan & kepintaran', effects: { moneyUsd: 6000, notoriety: -5, stress: 6 }, outcome: 'Wajah tenang anda meyakinkan pegawai bertugas dan anda dilepaskan tanpa pemeriksaan bonet!' },
          { label: 'Belok mengejut masuk lorong ladang & matikan lampu kenderaan', hint: 'Cara Berani: Haba +8, adrenalin tinggi', effects: { moneyUsd: 9500, notoriety: 8, stress: 10 }, outcome: 'Pemanduan berani anda meloloskan diri melalui jalan belakang!' },
          { label: 'Sorokkan bungkusan di semak tepi jalan & ambil semula keesokan hari', hint: 'Cara Licik: Selamat, Kepintaran +', effects: { moneyUsd: 7500, smarts: 4, notoriety: -8 }, outcome: 'Anda melalui sekatan dengan bonet kosong dan mengambil semula barang dengan selamat esoknya!' }
        ]
      },
      {
        id: 'dil_crm_victim_note', icon: '✉️', title: 'Beg Yang Dicuri Mengandungi Ubat Kritikal!',
        text: 'Apabila membuka beg yang diragut, anda terjumpa ubat jantung penting dan bil hospital seorang warga emas.',
        choices: [
          { label: 'Pulangkan beg & ubat itu terus ke klinik bersama wang tambahan!', hint: 'Cara Jujur & Insaf: Karma +++, Reputasi +, Haba -', effects: { moneyUsd: -500, karma: 20, rep: 5, notoriety: -10, happiness: 14 }, outcome: 'Hati anda tersentuh — kebaikan kecil ini membersihkan jiwa anda dan meredakan stres.' },
          { label: 'Tinggalkan beg di pondok pengawal hospital secara senyap', hint: 'Cara Selamat: Karma +', effects: { karma: 10, notoriety: -6 }, outcome: 'Ubat sampai tepat pada masanya kepada pemiliknya.' },
          { label: 'Ambil wang tunai sahaja dan buang beg di tepi jalan', hint: 'Cara Kotor: Wang +, Karma ---', effects: { moneyUsd: 1800, karma: -22, stress: 8 }, outcome: 'Anda menyimpan wang tunai tersebut tetapi rasa bersalah menghantui tidur anda.' }
        ]
      },
      {
        id: 'dil_crm_hacker_collab', icon: '💻', title: 'Jemputan Kumpulan Penggodam Tanpa Nama',
        text: 'Satu saluran terenkripsi mengajak anda menyertai serangan siber terancang ke atas sistem pembayaran antarabangsa.',
        choices: [
          { label: 'Sertai sebagai pakar strategi & bahagi hasil kripto', hint: 'Cara Berani: Wang +++, Kepintaran +, Haba ++', effects: { moneyUsd: 32000, smarts: 5, notoriety: 18, karma: -18 }, outcome: 'Serangan berjaya memindahkan dana besar ke dompet tanpa nama anda!' },
          { label: 'Laporkan kelemahan sistem itu kepada syarikat demi ganjaran Bug Bounty sah!', hint: 'Cara Jujur: Wang ++, Karma ++, Haba --, Reputasi +', effects: { moneyUsd: 14000, karma: 16, notoriety: -14, rep: 5, smarts: 4 }, outcome: 'Syarikat membayar ganjaran beretika kepada anda atas pendedahan keselamatan tersebut!' },
          { label: 'Tolak pelawaan & padam saluran komunikasi demi keselamatan', hint: 'Cara Selamat: Haba --, Stres -', effects: { notoriety: -10, stress: -6 }, outcome: 'Anda kekal selamat apabila kumpulan tersebut dikesan pihak berkuasa sebulan kemudian.' }
        ]
      }
    ],

    artist: [
      {
        id: 'dil_art_plagiarism', icon: '⚖️', title: 'Tuduhan Plagiat Melodi Lagu Hit Anda!',
        text: 'Sebuah syarikat muzik asing mendakwa korus lagu hit terbaru anda menyerupai lagu lama mereka dan mengancam saman.',
        choices: [
          { label: 'Dedahkan fail rakaman asal & proses ciptaan studio secara telus', hint: 'Cara Jujur: Bakat +, Reputasi ++, Populariti +', effects: { fame: 10, rep: 7, karma: 8, skill: 5 }, outcome: 'Pakar muzik mengesahkan karya anda 100% asli dan peminat semakin menghormati anda!' },
          { label: 'Tawarkan kredit kolaborasi & hasilkan versi remix bersama mereka!', hint: 'Cara Berani & Bijak: Wang ++, Pengikut ++', effects: { moneyUsd: 26000, fame: 14, followers: 32000, smarts: 4 }, outcome: 'Versi remix itu meletup di seluruh dunia dan menggandakan royalti kedua-dua pihak!' },
          { label: 'Lancarkan serangan balas sindiran di media sosial untuk alih isu', hint: 'Cara Licik: Populariti ++, Karma -, Reputasi -', effects: { fame: 14, followers: 18000, karma: -10, rep: -5, stress: 8 }, outcome: 'Drama panas menaikkan jumlah strim tetapi memecahbelahkan komen netizen.' }
        ]
      },
      {
        id: 'dil_art_lip_sync', icon: '🎤', title: 'Tekak Sakit Teruk Sebelum Konsert Sold-Out!',
        text: 'Dua jam sebelum konsert mega anda, doktor menasihatkan anda berehat kerana pita suara anda meradang.',
        choices: [
          { label: 'Nyanyi secara langsung versi akustik lembut & jujur dengan peminat', hint: 'Cara Jujur: Karma ++, Reputasi ++, Gembira ++', effects: { fame: 12, rep: 8, karma: 10, happiness: 14, health: -3 }, outcome: 'Puluhan ribu peminat menyanyi bersama menggantikan suara anda — detik paling menyentuh hati!' },
          { label: 'Gunakan rakaman vokal (lip-sync) supaya persembahan nampak sempurna', hint: 'Cara Licik: Wang penuh, risiko kantoi di media sosial!', effects: { moneyUsd: 24000, fame: 4, karma: -8, rep: -6, stress: 8 }, outcome: 'Konsert tamat lancar tetapi beberapa klip netizen mempertikaikan vokal anda.' },
          { label: 'Tunda konsert 2 minggu demi menjaga kesihatan & beri cenderahati percuma', hint: 'Cara Selamat: Kesihatan ++, Wang -', effects: { health: 8, moneyUsd: -4000, rep: 4, stress: -8 }, outcome: 'Peminat memahami dan konsert gantian anda kemudiannya lebih bertenaga!' }
        ]
      },
      {
        id: 'dil_art_sponsor_ethics', icon: '💼', title: 'Tawaran Tajaan Jutaan Daripada Jenama Kontroversi',
        text: 'Sebuah syarikat dengan rekod alam sekitar buruk menawarkan kontrak duta lumayan untuk jelajah anda.',
        choices: [
          { label: 'Tolak secara terbuka & pilih penaja tempatan yang beretika', hint: 'Cara Jujur: Karma ++, Reputasi Keluarga ++, Populariti +', effects: { karma: 14, rep: 8, fame: 8, moneyUsd: 9000 }, outcome: 'Prinsip teguh anda dipuji ramai dan menaikkan nilai jenama jangka panjang anda!' },
          { label: 'Terima dengan syarat mereka wajib menyumbang 30% kepada tabung hijau', hint: 'Cara Berani: Wang ++, Reputasi +', effects: { moneyUsd: 35000, rep: 5, karma: 5, smarts: 4 }, outcome: 'Mereka bersetuju dan kempen anda dipuji kerana membawa perubahan nyata!' },
          { label: 'Terima wang penuh & abaikan kritikan peminat', hint: 'Cara Kotor: Wang +++, Reputasi --, Karma --', effects: { moneyUsd: 68000, rep: -8, karma: -16, followers: -8000 }, outcome: 'Akaun bank melonjak tetapi sebahagian peminat setia kecewa.' }
        ]
      },
      {
        id: 'dil_art_fan_gift', icon: '🎁', title: 'Peminat Muda Berkongsi Demo Lagu Berbakat Besar',
        text: 'Selepas konsert, seorang remaja berbakat menyerahkan rakaman demo lagu ciptaannya yang sangat luar biasa.',
        choices: [
          { label: 'Ajak dia rakam bersama secara rasmi & beri kredit penuh 50/50', hint: 'Cara Jujur: Karma ++, Bakat +, Populariti ++', effects: { karma: 14, fame: 12, followers: 26000, moneyUsd: 18000, rep: 7 }, outcome: 'Kisah anda mengangkat bakat muda tular dan lagu duet anda menjuarai carta!' },
          { label: 'Beli hak cipta lagunya pada harga adil & bimbing dia di studio', hint: 'Cara Selamat: Wang ++, Bakat +', effects: { moneyUsd: 22000, skill: 8, karma: 6, rep: 3 }, outcome: 'Lagu itu menjadi hit dan remaja tersebut memulakan kerjaya baharu.' },
          { label: 'Ubah suai melodi itu sedikit & terbitkan atas nama anda sendiri', hint: 'Cara Kotor: Wang +++, Karma ---, Reputasi --', effects: { moneyUsd: 34000, karma: -22, rep: -9, fame: 6 }, outcome: 'Lagu itu laku keras tetapi rahsia itu menghantui reputasi seni anda.' }
        ]
      },
      {
        id: 'dil_art_burnout', icon: '🧠', title: 'Jadual Konsert Padat Mengundang Burnout',
        text: 'Pengurus anda mendesak anda menambah 15 lagi tarikh konsert ketika anda hampir rebah kepenatan.',
        choices: [
          { label: 'Bertegas ambil cuti rehat sebulan untuk pulihkan kesihatan & jiwa', hint: 'Cara Selamat: Kesihatan ++, Stres ---, Gembira ++', effects: { health: 12, happiness: 14, stress: -22 }, outcome: 'Anda kembali dengan semangat baharu dan karya yang jauh lebih bermutu!' },
          { label: 'Kurangkan separuh jadual & naikkan harga tiket eksklusif VIP', hint: 'Cara Bijak: Wang ++, Stres terkawal', effects: { moneyUsd: 32000, stress: -4, smarts: 4 }, outcome: 'Keuntungan kekal tinggi tanpa mengorbankan kesihatan anda!' },
          { label: 'Paksa diri teruskan semua 15 konsert demi rekod kutipan!', hint: 'Cara Berisiko: Wang +++, Kesihatan --, Stres ++', effects: { moneyUsd: 62000, fame: 14, health: -12, stress: 16 }, outcome: 'Kutipan pecah rekod tetapi anda terpaksa dimasukkan ke wad akibat keletihan melampau!' }
        ]
      },
      {
        id: 'dil_art_rival_feud', icon: '🔥', title: 'Pesaing Hiburan Menyindir Anda Di Siaran Langsung!',
        text: 'Seorang artis terkenal mendakwa kejayaan anda hanyalah nasib semata-mata di hadapan jutaan penonton.',
        choices: [
          { label: 'Balas dengan kejayaan: lancarkan karya berkualiti tinggi tanpa mencerca', hint: 'Cara Matang: Bakat ++, Reputasi ++, Populariti ++', effects: { skill: 10, fame: 14, rep: 8, karma: 10 }, outcome: 'Kematangan anda membuatkan netizen berpihak sepenuhnya kepada anda!' },
          { label: 'Cabar dia berduet secara langsung di pentas amal!', hint: 'Cara Berani: Populariti +++, Pengikut +++, Wang ++', effects: { moneyUsd: 28000, fame: 18, followers: 45000, rep: 6 }, outcome: 'Pentas amal pecah rekod tontonan dan anda berdua menjadi tajuk utama!' },
          { label: 'Lancarkan lagu sindiran pedas membongkar rahsia silamnya!', hint: 'Cara Licik: Populariti +++, Karma --, Stres +', effects: { moneyUsd: 24000, fame: 20, followers: 52000, karma: -14, stress: 10 }, outcome: 'Internet meletup membincangkan pertelingkahan anda selama berminggu-minggu!' }
        ]
      }
    ],

    actor: [
      {
        id: 'dil_actr_script', icon: '📜', title: 'Pilihan Dua Skrip Besar Serentak!',
        text: 'Anda ditawarkan dua watak utama pada tarikh sama: filem seni berprestij (gaji sederhana, potensi anugerah) atau filem komersial aksi (bayaran gergasi).',
        choices: [
          { label: 'Pilih filem seni berprestij demi legasi lakonan & anugerah', hint: 'Cara Berprinsip: Bakat ++, Reputasi ++, Anugerah +', effects: { skill: 14, rep: 10, fame: 14, moneyUsd: 20000, happiness: 14 }, outcome: 'Pengkritik memuji lakonan anda sebagai antara yang terbaik dekad ini!' },
          { label: 'Pilih filem aksi komersial dengan bayaran lumayan & bonus tiket', hint: 'Cara Komersial: Wang +++, Pengikut ++', effects: { moneyUsd: 68000, fame: 16, followers: 48000, skill: 6 }, outcome: 'Filem pecah panggung dan bayaran bonus anda melambung tinggi!' },
          { label: 'Runding jadual padat untuk berlakon kedua-duanya sekali!', hint: 'Cara Berani: Wang ++, Bakat +, Stres ++', effects: { moneyUsd: 52000, skill: 10, fame: 18, health: -6, stress: 14 }, outcome: 'Walaupun hampir tidak tidur, anda berjaya mencipta sejarah dalam kedua-dua filem!' }
        ]
      },
      {
        id: 'dil_actr_director_clash', icon: '🎥', title: 'Pertelingkahan Kreatif Dengan Pengarah Terkenal',
        text: 'Pengarah mahu anda melakonkan babak yang anda rasa merosakkan mesej watak dan bertentangan dengan nilai anda.',
        choices: [
          { label: 'Bincang secara profesional & cadangkan alternatif babak lebih kuat', hint: 'Cara Jujur & Bijak: Bakat ++, Reputasi ++', effects: { skill: 10, rep: 7, karma: 6, smarts: 4 }, outcome: 'Pengarah kagum dengan cadangan anda dan babak itu menjadi adegan paling ikonik!' },
          { label: 'Ikut arahan pengarah sepenuhnya demi menjaga hubungan produksi', hint: 'Cara Selamat: Wang penuh, Stres -', effects: { moneyUsd: 18000, fame: 6 }, outcome: 'Penggambaran selesai tepat jadual dan penerbit berpuas hati.' },
          { label: 'Bocor ketidakpuasan hati kepada media hiburan untuk beri tekanan', hint: 'Cara Licik: Populariti ++, Reputasi --, Karma -', effects: { fame: 12, rep: -7, karma: -10, stress: 8 }, outcome: 'Pengarah terpaksa mengalah tetapi nama anda dilabel cerewet di industri.' }
        ]
      },
      {
        id: 'dil_actr_stunt_risk', icon: '💥', title: 'Babak Aksi Berbahaya Tanpa Pelakon Lagak Ngeri',
        text: 'Penerbit bertanya sama ada anda berani melakukan aksi terjunan bangunan sendiri untuk realisme kamera.',
        choices: [
          { label: 'Berlatih 2 minggu dengan pakar keselamatan & lakukan sendiri!', hint: 'Cara Berani: Populariti +++, Bakat ++, Kesihatan -3', effects: { skill: 12, fame: 18, followers: 38000, moneyUsd: 24000, health: -3 }, outcome: 'Klip di sebalik tabir keberanian anda tular seluruh dunia!' },
          { label: 'Serahkan kepada pelakon lagak ngeri profesional demi keselamatan', hint: 'Cara Selamat: Kesihatan terjaga, Karma +', effects: { health: 4, karma: 5, rep: 3, moneyUsd: 14000 }, outcome: 'Anda menghormati kepakaran kru stunt dan penggambaran berjalan selamat.' },
          { label: 'Tuntut bayaran insurans & bonus bahaya berganda dahulu', hint: 'Cara Licik: Wang +++, Kepintaran +', effects: { moneyUsd: 38000, smarts: 4, fame: 8 }, outcome: 'Penerbit bersetuju membayar bonus besar untuk babak tersebut!' }
        ]
      },
      {
        id: 'dil_actr_costar_rumor', icon: '💘', title: 'Gimik Cinta Lokasi Bersama Pelakon Gandingan?',
        text: 'Pasukan pemasaran mencadangkan anda berpura-pura bercinta dengan pasangan lakonan demi melariskan kutipan tiket.',
        choices: [
          { label: 'Tolak gimik palsu — promosikan filem berdasarkan kualiti cerita', hint: 'Cara Jujur: Karma ++, Reputasi Keluarga ++', effects: { karma: 12, rep: 8, fame: 8, skill: 5 }, outcome: 'Penonton menghargai keikhlasan anda dan tetap memenuhi pawagam!' },
          { label: 'Gunakan humor mesra & konten di sebalik tabir tanpa menipu peminat', hint: 'Cara Bijak: Pengikut ++, Gembira ++', effects: { fame: 12, followers: 28000, happiness: 10, rep: 4 }, outcome: 'Keserasian profesional anda berdua memikat hati peminat!' },
          { label: 'Setuju jalankan gimik sensasi untuk meletupkan publisiti!', hint: 'Cara Licik: Wang ++, Populariti +++, Karma --', effects: { moneyUsd: 32000, fame: 20, followers: 55000, karma: -12, rep: -5 }, outcome: 'Filem pecah panggung tetapi kehidupan peribadi anda dikejar paparazi!' }
        ]
      },
      {
        id: 'dil_actr_crew_unpaid', icon: '🎬', title: 'Kru Belakang Tabir Belum Dibayar Gaji!',
        text: 'Anda mendapat tahu penerbit menangguhkan bayaran jurukamera dan kru teknikal manakala gaji bintang utama dibayar awal.',
        choices: [
          { label: 'Gunakan pengaruh anda & enggan sambung penggambaran sehingga kru dibayar!', hint: 'Cara Jujur & Berani: Karma +++, Reputasi +++, Populariti ++', effects: { karma: 18, rep: 12, fame: 14, happiness: 14 }, outcome: 'Penerbit segera melunaskan semua gaji kru dan seluruh industri menyanjung pembelaan anda!' },
          { label: 'Dahulukan wang sendiri membantu kru yang terdesak secara senyap', hint: 'Cara Mulia: Karma +++, Wang -', effects: { moneyUsd: -6000, karma: 20, rep: 8, happiness: 12 }, outcome: 'Doa para pekerja belakang tabir mengiringi kerjaya anda.' },
          { label: 'Diamkan diri kerana itu bukan urusan kontrak anda', hint: 'Cara Selamat/Dingin: Wang terjaga, Karma --', effects: { moneyUsd: 16000, karma: -14, rep: -4 }, outcome: 'Filem siap tetapi suasana di set menjadi dingin.' }
        ]
      },
      {
        id: 'dil_actr_award_speech', icon: '🏆', title: 'Saat Penentuan Di Pentas Anugerah Utama',
        text: 'Nama anda diumumkan di hadapan jutaan penonton TV — seluruh dewan menanti ucapan anda.',
        choices: [
          { label: 'Dedikasikan kejayaan kepada keluarga, guru & kru belakang tabir', hint: 'Cara Jujur: Reputasi Keluarga +++, Karma ++, Gembira ++', effects: { rep: 12, karma: 12, fame: 14, happiness: 18 }, outcome: 'Ucapan penuh rendah diri anda menitiskan air mata penonton dan menaikkan maruah keluarga!' },
          { label: 'Sampaikan seruan berani mengenai isu kemanusiaan & keadilan sosial', hint: 'Cara Berani: Populariti +++, Karma ++, Pengikut ++', effects: { fame: 20, followers: 48000, karma: 14, rep: 8 }, outcome: 'Petikan ucapan anda menjadi tajuk muka hadapan akhbar antarabangsa!' },
          { label: 'Gunakan pentas untuk mempromosikan projek peribadi & menyindir pengkritik', hint: 'Cara Licik: Populariti ++, Reputasi -', effects: { fame: 16, moneyUsd: 18000, rep: -5, karma: -6 }, outcome: 'Ucapan kontroversi anda hangat diperkatakan sepanjang minggu!' }
        ]
      }
    ],

    prison: [
      {
        id: 'dil_prs_smuggle_phone', icon: '📱', title: 'Rakan Sel Menawarkan Kongsi Bisnes Telefon Seludup',
        text: 'Seorang banduan senior mengajak anda menguruskan telefon seludup dengan upah lumayan di blok keselamatan.',
        choices: [
          { label: 'Tolak dengan tegas — fokus jaga Rekod Kelakuan untuk Parol awal', hint: 'Cara Jujur: Kelakuan ++, Karma ++', effects: { behavior: 14, karma: 10, stress: -6 }, outcome: 'Warden memuji disiplin anda dan catatan kelakuan baik anda semakin cerah!' },
          { label: 'Sertai tetapi simpan rekod rahsia untuk melindungi diri jika diserbu', hint: 'Cara Licik: Wang ++, Hormat ++, Kelakuan -', effects: { moneyUsd: 1800, respect: 12, behavior: -8, smarts: 3 }, outcome: 'Anda meraih simpanan tunai dan pengaruh di dalam blok tanpa dikesan.' },
          { label: 'Laporkan secara rahsia kepada warden demi pengurangan hukuman', hint: 'Cara Berisiko: Kelakuan +++, tetapi Hormat ---!', effects: { behavior: 20, respect: -16, karma: 4 }, outcome: 'Warden menghargai maklumat anda tetapi banduan lain mula berwaspada dengan anda.' }
        ]
      },
      {
        id: 'dil_prs_yard_bully', icon: '🥊', title: 'Banduan Baharu Dibuli Di Laman Penjara!',
        text: 'Tiga samseng blok mengepung seorang banduan muda yang baru masuk untuk merampas kasut dan makanannya.',
        choices: [
          { label: 'Masuk campur & pertahankan banduan muda itu dengan berani!', hint: 'Cara Berani: Hormat +++, Karma ++, risiko cedera sedikit', effects: { respect: 16, karma: 14, rep: 4, health: -5 }, outcome: 'Keberanian anda membuatkan samseng itu berundur dan banduan muda itu setia bersama anda!' },
          { label: 'Gunakan diplomasi & tawarkan rokok/snek kantin untuk meredakan keadaan', hint: 'Cara Bijak: Hormat +, Kelakuan +, selamat', effects: { respect: 8, behavior: 6, karma: 8, moneyUsd: -150 }, outcome: 'Pertumpahan darah dielakkan dengan cara matang!' },
          { label: 'Abaikan sahaja — jaga hal sendiri demi keselamatan', hint: 'Cara Selamat: Tiada risiko kecederaan', effects: { stress: -4, karma: -4 }, outcome: 'Anda meneruskan langkah tanpa terlibat dalam pergaduhan blok.' }
        ]
      },
      {
        id: 'dil_prs_warden_favor', icon: '🔑', title: 'Warden Menawarkan Tugas Khas "Banduan Amanah"',
        text: 'Ketua pengawal melihat disiplin anda dan menawarkan tugas mengurus perpustakaan serta rekod stor penjara.',
        choices: [
          { label: 'Laksanakan amanah dengan cemerlang demi surat sokongan Parol!', hint: 'Cara Jujur: Kelakuan +++, Kepintaran +, Karma +', effects: { behavior: 18, smarts: 6, karma: 10, happiness: 10 }, outcome: 'Rekod anda diiktiraf cemerlang oleh lembaga parol!' },
          { label: 'Gunakan akses stor untuk membantu rakan blok secara senyap', hint: 'Cara Licik: Hormat ++, Wang +, Kelakuan -', effects: { respect: 14, moneyUsd: 900, behavior: -6 }, outcome: 'Pengaruh anda di kalangan banduan meningkat mendadak!' },
          { label: 'Gunakan akses itu untuk menyalin pelan lantai keselamatan penjara!', hint: 'Cara Berani: Kepintaran ++, persediaan bolos', effects: { smarts: 8, respect: 8, behavior: -4 }, outcome: 'Anda kini menghafal setiap laluan pengawal sekiranya memilih untuk bolos!' }
        ]
      },
      {
        id: 'dil_prs_gang_war', icon: '🔥', title: 'Ketegangan Antara Dua Geng Blok Memuncak!',
        text: 'Kedua-dua ketua geng mendesak anda memilih pihak sebelum pergaduhan besar tercetus di dewan makan.',
        choices: [
          { label: 'Berdiri di tengah sebagai pendamai & runding pembahagian masa laman', hint: 'Cara Bijak: Hormat ++, Kelakuan ++, Karma ++', effects: { respect: 15, behavior: 10, karma: 12, smarts: 4 }, outcome: 'Kedua-dua geng menghormati kewibawaan anda dan ketegangan reda!' },
          { label: 'Sertai pihak paling kuat untuk meluaskan kuasa di blok', hint: 'Cara Berani: Hormat +++, Kelakuan --', effects: { respect: 18, behavior: -14, health: -6 }, outcome: 'Anda kini antara nama paling digeruni di dalam penjara!' },
          { label: 'Mohon tukar ke blok pemulihan yang lebih tenang', hint: 'Cara Selamat: Kesihatan +, Kelakuan +', effects: { behavior: 10, health: 5, stress: -10 }, outcome: 'Anda menjauhkan diri daripada keganasan geng dengan selamat.' }
        ]
      },
      {
        id: 'dil_prs_family_letter', icon: '✉️', title: 'Surat Menyentuh Hati Daripada Keluarga Di Luar',
        text: 'Anda menerima surat daripada keluarga yang menceritakan kesusahan mereka dan mendoakan anda berubah menjadi insan lebih baik.',
        choices: [
          { label: 'Balas dengan janji taubat & sertai semua program kemahiran penjara', hint: 'Cara Jujur: Karma +++, Kelakuan ++, Reputasi Keluarga +', effects: { karma: 16, behavior: 14, rep: 5, happiness: 12, stress: -10 }, outcome: 'Semangat anda pulih untuk membina hidup baharu sebaik sahaja bebas nanti.' },
          { label: 'Kirimkan semua wang upah bengkel penjara anda kepada keluarga', hint: 'Cara Mulia: Karma +++, Reputasi Keluarga ++', effects: { moneyUsd: -400, karma: 18, rep: 7, happiness: 10 }, outcome: 'Keluarga anda amat terharu dengan keprihatinan anda walaupun dari balik tirai besi.' },
          { label: 'Simpan surat itu diam-diam & fokus bertahan hidup di dalam', hint: 'Cara Tegas: Stres -', effects: { respect: 5, stress: -4 }, outcome: 'Anda menguatkan hati menghadapi baki hukuman hari demi hari.' }
        ]
      },
      {
        id: 'dil_prs_kitchen_fire', icon: '🚨', title: 'Kebakaran Kecil Di Dapur Penjara!',
        text: 'Kuali minyak di dapur penjara menyambar api besar dan seorang tukang masak terperangkap dalam asap tebal!',
        choices: [
          { label: 'Redah asap & tarik keluar mangsa menggunakan selimut basah!', hint: 'Cara Berani & Mulia: Kelakuan +++, Hormat ++, Reputasi ++, -1 thn hukuman!', effects: { behavior: 22, respect: 14, karma: 18, rep: 8, reduceYears: 1, health: -4 }, outcome: 'Tindakan wira anda dipuji Pengarah Penjara dan hukuman anda dikurangkan 1 tahun!' },
          { label: 'Bantu arahkan semua banduan keluar secara teratur ikut laluan kecemasan', hint: 'Cara Bijak: Kelakuan ++, Karma +', effects: { behavior: 14, karma: 10, rep: 3 }, outcome: 'Tiada kecederaan berlaku hasil kepimpinan tenang anda.' },
          { label: 'Gunakan kekecohan untuk menyelinap ambil barang berharga di stor', hint: 'Cara Licik: Wang ++, Kelakuan --, Karma --', effects: { moneyUsd: 1600, behavior: -12, karma: -14 }, outcome: 'Anda mendapat habuan pantas di tengah kekecohan asap!' }
        ]
      }
    ]
  }
};
