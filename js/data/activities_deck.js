/* ==========================================================================
   WorldLife — Dek Aktiviti Dinamik (40+ Aktiviti), Personaliti & Peluang Nadir
   Bahasa Melayu
   ========================================================================== */

window.ActivitiesDeck = {
  // --------------------------------------------------------------------------
  // 1. CIRI PERSONALITI / TABIAT UNIK (2–3 diberi secara rawak sejak lahir)
  // --------------------------------------------------------------------------
  TRAITS: [
    { id: 'risk_taker', name: 'Berani Risiko', icon: '🎲', desc: 'Suka cabaran ekstrem & peluang berisiko tinggi.' },
    { id: 'charismatic', name: 'Berkarisma', icon: '✨', desc: 'Mudah memikat hati ramai, rundingan & dunia sosial.' },
    { id: 'cunning', name: 'Licik & Strategik', icon: '🦊', desc: 'Cepat menghidu peluang wang & helah lawan.' },
    { id: 'creative', name: 'Berjiwa Kreatif', icon: '🎨', desc: 'Kaya idea seni, konten & rekaan unik.' },
    { id: 'ambitious', name: 'Bercita-cita Tinggi', icon: '🚀', desc: 'Laparkan kejayaan, kerjaya & legasi besar.' },
    { id: 'eccentric', name: 'Unik & Eksentrik', icon: '🌀', desc: 'Berfikir luar kotak dan menarik kejadian pelik!' },
    { id: 'devout', name: 'Berpegang Teguh', icon: '🕊️', desc: 'Tenang, jujur dan kuat ketahanan rohani.' },
    { id: 'empathetic', name: 'Berhati Mulia', icon: '💛', desc: 'Disenangi masyarakat dan tinggi nilai karma.' }
  ],

  pickInitialTraits() {
    const count = Utils.chance(0.55) ? 3 : 2;
    const copy = [...this.TRAITS];
    const picked = [];
    while (picked.length < count && copy.length > 0) {
      const idx = Utils.randInt(0, copy.length - 1);
      picked.push(copy.splice(idx, 1)[0].id);
    }
    return picked;
  },

  getTraitObj(id) {
    return this.TRAITS.find(t => t.id === id) || this.TRAITS[0];
  },

  // --------------------------------------------------------------------------
  // 2. KOLAM 41 AKTIVITI PELBAGAI KATEGORI + PELUANG NADIR
  // --------------------------------------------------------------------------
  POOL: [
    // === A. SANTAI & GAYA HIDUP (Daily Fun / Lifestyle) ===
    {
      id: 'act_gokart_night', cat: 'Santai', icon: '🏎️', title: 'Lumba Go-Kart Tengah Malam',
      minAge: 13, costUsd: 35, boostTrait: 'risk_taker',
      desc: 'Uji kelajuan bersama rakan di litar go-kart bandar.',
      outcomes: {
        win: { text: 'Anda mencatat masa terpantas malam itu dan menang baucar hadiah!', stats: { happiness: 14, looks: 2 }, moneyUsd: 90, rep: 1 },
        normal: { text: 'Lumba yang menyeronokkan! Adrenalin naik dan stres kerja hilang seketika.', stats: { happiness: 9 }, stress: -8 },
        fail: { text: 'Kart anda terbabas melanggar tayar penghadang — sakit pinggang dan kena gelak!', stats: { health: -6, happiness: -3 }, stress: 4 }
      }
    },
    {
      id: 'act_food_hunt', cat: 'Santai', icon: '🍜', title: 'Jelajah Food Hunting 5 Gerai Viral',
      minAge: 10, costUsd: 28, boostTrait: 'creative',
      desc: 'Redah trafik demi mencuba makanan paling tular minggu ini.',
      outcomes: {
        win: { text: 'Semua 5 gerai memang padu! Ulasan ringkas anda turut tular dan menaikkan pengikut!', stats: { happiness: 14 }, fame: 4, followers: 1800 },
        normal: { text: 'Perut kenyang hati senang, walaupun beratur hampir sejam di gerai terakhir.', stats: { happiness: 10, health: -1 }, stress: -6 },
        fail: { text: 'Alamak! Sambal gerai keempat terlalu pedas sehingga anda sakit perut sepanjang malam!', stats: { health: -8, happiness: -5 } }
      }
    },
    {
      id: 'act_mountain_camp', cat: 'Santai', icon: '⛺', title: 'Perkhemahan Hujung Minggu Di Gunung',
      minAge: 12, costUsd: 45, boostTrait: 'devout',
      desc: 'Tinggalkan bunyi kota dan nikmati udara dingin di puncak bukit.',
      outcomes: {
        win: { text: 'Pemandangan matahari terbit dari puncak menginsafkan jiwa — kesihatan & ketenangan melonjak!', stats: { health: 10, happiness: 14 }, stress: -16, karma: 3 },
        normal: { text: 'Unggun api dan kopi panas di malam sejuk menyegarkan fikiran anda.', stats: { health: 6, happiness: 8 }, stress: -10 },
        fail: { text: 'Hujan ribut melanda! Khemah bocor dan anda terpaksa turun dalam keadaan basah kuyup.', stats: { health: -7, happiness: -6 }, stress: 6 }
      }
    },
    {
      id: 'act_karaoke_marathon', cat: 'Santai', icon: '🎤', title: 'Maraton Karaoke Sampai Pagi',
      minAge: 14, costUsd: 25, boostTrait: 'charismatic',
      desc: 'Lepaskan tekanan dengan lagu rock kapak dan balada sepenuh jiwa.',
      outcomes: {
        win: { text: 'Suara anda memukau bilik sebelah — malah seorang penerbit muzik memuji bakat anda!', stats: { happiness: 13, looks: 2 }, fame: 3, stress: -12 },
        normal: { text: 'Tekak agak perit esok pagi, tetapi hati terasa sangat ringan!', stats: { happiness: 9 }, stress: -8 },
        fail: { text: 'Anda tersalah tarik nota tinggi sehingga suara hilang selama 3 hari.', stats: { health: -3, happiness: -2 } }
      }
    },
    {
      id: 'act_paragliding', cat: 'Santai', icon: '🪂', title: 'Terjun Paragliding Dari Bukit Tinggi',
      minAge: 16, costUsd: 110, boostTrait: 'risk_taker',
      desc: 'Melayang di udara menikmati panorama bandar dan laut.',
      outcomes: {
        win: { text: 'Pengalaman seumur hidup! Anda merakam video epik dan rasa berani menakluk dunia!', stats: { happiness: 18, looks: 3 }, fame: 4, stress: -15 },
        normal: { text: 'Pendaratan lancar dan pemandangan dari langit amat mempesonakan.', stats: { happiness: 12, health: 3 }, stress: -10 },
        fail: { text: 'Angin lintang menolak anda ke semak belukar! Nasib baik cuma calar-balar ringan.', stats: { health: -11, happiness: -4 }, stress: 8 }
      }
    },
    {
      id: 'act_coffee_workshop', cat: 'Santai', icon: '☕', title: 'Bengkel Barista & Seni Latte',
      minAge: 15, costUsd: 40, boostTrait: 'creative',
      desc: 'Pelajari rahsia biji kopi panggang dan corak buih susu.',
      outcomes: {
        win: { text: 'Seni latte anda dipuji instruktor dan dipaparkan di laman rasmi kafe!', stats: { smarts: 5, happiness: 11 }, fame: 2, rep: 2 },
        normal: { text: 'Kini anda boleh membancuh kopi setaraf kafe mahal di rumah sendiri.', stats: { smarts: 3, happiness: 7 }, stress: -6 },
        fail: { text: 'Anda tertumpahkan susu panas dan memecahkan cawan seramik mahal.', stats: { happiness: -4 }, moneyUsd: -25 }
      }
    },
    {
      id: 'act_budget_flight', cat: 'Santai', icon: '🧳', title: 'Percutian Spontan Tiket Promosi',
      minAge: 18, costUsd: 190, boostTrait: 'eccentric',
      desc: 'Beli tiket tambang murah saat akhir ke pulau berdekatan.',
      outcomes: {
        win: { text: 'Anda dinaik taraf ke kelas bisnes secara percuma dan berkenalan dengan tokoh industri!', stats: { happiness: 18 }, rep: 4, stress: -16 },
        normal: { text: 'Angin pantai dan tidur tanpa penggera memulihkan tenaga anda sepenuhnya.', stats: { happiness: 13, health: 4 }, stress: -12 },
        fail: { text: 'Penerbangan ditunda 9 jam dan bagasi anda tersesat ke lapangan terbang lain!', stats: { happiness: -9 }, stress: 12, moneyUsd: -60 }
      }
    },
    {
      id: 'act_retro_arcade', cat: 'Santai', icon: '🕹️', title: 'Pertandingan Arked & E-Sukan Tempatan',
      minAge: 8, costUsd: 15, boostTrait: 'eccentric',
      desc: 'Sertai kejohanan permainan video hujung minggu di pusat beli-belah.',
      outcomes: {
        win: { text: 'JUARA! Anda menyapu bersih pusingan akhir dan membawa pulang hadiah tunai!', stats: { happiness: 15, smarts: 4 }, moneyUsd: 260, fame: 3 },
        normal: { text: 'Tewas di suku akhir tetapi dapat ramai kenalan baru yang sekepala.', stats: { happiness: 8, smarts: 2 }, stress: -6 },
        fail: { text: 'Tewas 0-3 pada pusingan pertama di hadapan penonton yang bersorak.', stats: { happiness: -5 }, stress: 4 }
      }
    },

    // === B. SIDE HUSTLE & DUIT TAMBAHAN (Side Hustles) ===
    {
      id: 'act_vintage_flip', cat: 'Side Hustle', icon: '🧥', title: 'Buru & Jual Barangan Bundle / Vintage',
      minAge: 15, costUsd: 60, boostTrait: 'cunning',
      desc: 'Selongkar pasar karat mencari jaket dan jam lama untuk dijual mahal.',
      outcomes: {
        win: { text: 'JACKPOT! Anda terjumpa jaket edisi 1980-an asli dan menjualnya kepada pengumpul!', stats: { happiness: 12, smarts: 4 }, moneyUsd: 950 },
        normal: { text: 'Beberapa helai baju laku keras di pasaran dalam talian — untung bersih lumayan.', stats: { happiness: 6, smarts: 2 }, moneyUsd: 240 },
        fail: { text: 'Barangan yang anda beli rupa-rupanya tiruan gred rendah dan langsung tidak laku.', stats: { happiness: -6 }, moneyUsd: -70 }
      }
    },
    {
      id: 'act_weekend_stall', cat: 'Side Hustle', icon: '🧋', title: 'Buka Gerai Air Balang & Snek Hujung Minggu',
      minAge: 16, costUsd: 90, boostTrait: 'ambitious',
      desc: 'Berniaga di bazar hujung minggu untuk tambah duit poket.',
      outcomes: {
        win: { text: 'Gerai anda diserbu pelanggan selepas seorang food vlogger merakam video!', stats: { happiness: 14, smarts: 4 }, moneyUsd: 1100, fame: 4, rep: 3 },
        normal: { text: 'Penat berdiri seharian tetapi jualan habis licin menjelang petang!', stats: { health: -3, happiness: 7 }, moneyUsd: 380 },
        fail: { text: 'Ribut petir melanda bazar — khemah terbang dan banyak stok terpaksa dibuang.', stats: { health: -4, happiness: -8 }, moneyUsd: -110 }
      }
    },
    {
      id: 'act_sneaker_flip', cat: 'Side Hustle', icon: '👟', title: 'Flip Kasut Edisi Terhad',
      minAge: 16, costUsd: 180, boostTrait: 'cunning',
      desc: 'Beratur awal pagi merebut kasut koleksi terhad untuk dijual semula.',
      outcomes: {
        win: { text: 'Harga pasaran melonjak 4 kali ganda! Pembeli sanggup bayar tunai hari itu juga!', stats: { happiness: 12 }, moneyUsd: 1350 },
        normal: { text: 'Dapat jual semula dengan keuntungan sederhana yang memuaskan.', stats: { happiness: 5 }, moneyUsd: 320 },
        fail: { text: 'Syarikat tiba-tiba mengeluarkan stok tambahan — harga jatuh menjunam!', stats: { happiness: -7 }, moneyUsd: -140 }
      }
    },
    {
      id: 'act_freelance_design', cat: 'Side Hustle', icon: '💻', title: 'Projek Freelance Rekaan & Kod Hujung Minggu',
      minAge: 16, costUsd: 0, boostTrait: 'creative',
      desc: 'Terima tempahan pelanggan antarabangsa secara dalam talian.',
      outcomes: {
        win: { text: 'Pelanggan dari luar negara amat kagum dan membayar bonus berganda dalam USD!', stats: { smarts: 6, happiness: 11 }, moneyUsd: 1400, rep: 3 },
        normal: { text: 'Siap tepat pada masa! Pendapatan sampingan masuk terus ke akaun bank.', stats: { smarts: 3, health: -2 }, moneyUsd: 420 },
        fail: { text: 'Pelanggan meminta 19 pindaan lalu lesap tanpa membayar baki bayaran!', stats: { happiness: -8 }, stress: 12 }
      }
    },
    {
      id: 'act_secret_baking', cat: 'Side Hustle', icon: '🍰', title: 'Jual Kek & Kuih Resipi Keluarga',
      minAge: 14, costUsd: 45, boostTrait: 'empathetic',
      desc: 'Bakar kuih tradisional dan buka tempahan kepada jiran & pejabat.',
      outcomes: {
        win: { text: 'Tempahan majlis kenduri masuk mencurah-curah! Nama keluarga dipuji satu kawasan!', stats: { happiness: 13 }, moneyUsd: 820, rep: 5, karma: 4 },
        normal: { text: 'Jiran-jiran menyukai rasanya dan anda mendapat untung bersih yang manis.', stats: { happiness: 7 }, moneyUsd: 260, rep: 2 },
        fail: { text: 'Ketuhar rosak di tengah malam — separuh tempahan hangus dan terpaksa pulangkan deposit.', stats: { happiness: -7 }, moneyUsd: -80, stress: 8 }
      }
    },
    {
      id: 'act_event_mc', cat: 'Side Hustle', icon: '🎙️', title: 'Jadi Pengacara Majlis & Kenduri',
      minAge: 18, costUsd: 0, boostTrait: 'charismatic',
      desc: 'Gunakan bakat bercakap anda untuk mengendalikan acara tempatan.',
      outcomes: {
        win: { text: 'Gaya penyampaian anda mencuit hati hadirin — 3 penganjur terus menempah anda!', stats: { happiness: 12, looks: 2 }, moneyUsd: 780, fame: 5, rep: 3 },
        normal: { text: 'Majlis berjalan lancar dan tuan rumah memberi bayaran saguhati lumayan.', stats: { happiness: 6 }, moneyUsd: 290 },
        fail: { text: 'Anda tersilap menyebut nama VIP utama di atas pentas! Suasana jadi sunyi sepi...', stats: { happiness: -9 }, rep: -3, stress: 10 }
      }
    },
    {
      id: 'act_day_trading', cat: 'Side Hustle', icon: '📊', title: 'Dagangan Saham & Kripto Harian',
      minAge: 18, costUsd: 300, boostTrait: 'ambitious',
      desc: 'Cuba nasib menganalisis carta pasaran yang bergerak pantas.',
      outcomes: {
        win: { text: 'Analisis anda tepat! Saham meletup hijau dan anda kaut untung besar sebelum pasaran tutup!', stats: { smarts: 5, happiness: 14 }, moneyUsd: 2400 },
        normal: { text: 'Untung kecil tetapi cukup untuk membayar bil bulanan.', stats: { smarts: 2 }, moneyUsd: 480, stress: 4 },
        fail: { text: 'Pasaran menjunam merah mengejut! Modal anda hangus dalam masa 15 minit!', stats: { happiness: -12 }, moneyUsd: -550, stress: 15 }
      }
    },
    {
      id: 'act_tutor_kids', cat: 'Side Hustle', icon: '📖', title: 'Kelas Tuisyen Separuh Masa',
      minAge: 17, costUsd: 0, boostTrait: 'devout',
      desc: 'Bantu pelajar sekolah menguasai subjek peperiksaan utama.',
      outcomes: {
        win: { text: 'Anak murid anda mendapat semua A! Ibu bapa menghadiahkan bonus besar dan memuji anda!', stats: { smarts: 5, happiness: 12 }, moneyUsd: 650, karma: 8, rep: 4 },
        normal: { text: 'Pengalaman mengajar yang berkat dan menambah pendapatan sampingan.', stats: { smarts: 3, happiness: 6 }, moneyUsd: 240, karma: 4 },
        fail: { text: 'Ibu bapa pelajar terlalu cerewet dan menyalahkan anda atas markah kuiz anak mereka.', stats: { happiness: -6 }, stress: 8 }
      }
    },

    // === C. SOSIAL & DRAMA (Social / Drama) ===
    {
      id: 'act_vip_party', cat: 'Sosial & Drama', icon: '🥂', title: 'Sertai Majlis Eksklusif Golongan Elit',
      minAge: 19, costUsd: 160, boostTrait: 'charismatic',
      desc: 'Rapatkan diri dengan ahli perniagaan, selebriti dan tokoh berpengaruh.',
      outcomes: {
        win: { text: 'Pesona anda memikat hadirin! Anda pulang dengan kad nama jutawan & reputasi melambung!', stats: { happiness: 14, looks: 3 }, fame: 8, rep: 7 },
        normal: { text: 'Perbualan menarik dan hidangan mewah yang membuka mata tentang dunia korporat.', stats: { happiness: 7 }, fame: 3, rep: 2 },
        fail: { text: 'Anda tertumpahkan minuman ke atas baju pereka terkenal — jadi bahan gosip satu dewan!', stats: { happiness: -9 }, rep: -5, stress: 10 }
      }
    },
    {
      id: 'act_school_reunion', cat: 'Sosial & Drama', icon: '🏫', title: 'Reunion Sekolah Lama Penuh Drama',
      minAge: 22, costUsd: 55, boostTrait: 'charismatic',
      desc: 'Temui semula bekas rakan sekelas — siapa paling berjaya sekarang?',
      outcomes: {
        win: { text: 'Anda menjadi tumpuan malam itu! Rakan lama menawarkan kerjasama projek menguntungkan!', stats: { happiness: 14 }, moneyUsd: 600, rep: 4 },
        normal: { text: 'Gelak tawa mengimbau kenangan nakal zaman sekolah sangat mencuit hati.', stats: { happiness: 9 }, stress: -6 },
        fail: { text: 'Bekas musuh sekolah cuba memperlekehkan hidup anda di depan semua orang — perang mulut tercetus!', stats: { happiness: -10 }, stress: 12, karma: -3 }
      }
    },
    {
      id: 'act_community_debate', cat: 'Sosial & Drama', icon: '🗣️', title: 'Debat Panas Di Forum Komuniti',
      minAge: 18, costUsd: 0, boostTrait: 'ambitious',
      desc: 'Suarakan pandangan lantang anda mengenai isu tempatan yang tular.',
      outcomes: {
        win: { text: 'Hujah bernas anda tular dan dipuji pemimpin masyarakat! Reputasi keluarga melonjak!', stats: { smarts: 6, happiness: 11 }, fame: 6, rep: 6, karma: 5 },
        normal: { text: 'Perbincangan hangat tetapi berakhir dengan cadangan yang membina.', stats: { smarts: 3, happiness: 4 }, rep: 2 },
        fail: { text: 'Klip kata-kata anda dipotong di luar konteks dan dikecam hebat warganet!', stats: { happiness: -10 }, rep: -6, stress: 12 }
      }
    },
    {
      id: 'act_local_podcast', cat: 'Sosial & Drama', icon: '🎧', title: 'Jadi Tetamu Podcast Tempatan',
      minAge: 17, costUsd: 0, boostTrait: 'eccentric',
      desc: 'Kongsi kisah hidup dan pandangan luar kotak anda secara langsung.',
      outcomes: {
        win: { text: 'Episod anda mencapai 500K tontonan! Peminat baru membanjiri profil anda!', stats: { happiness: 13 }, fame: 10, followers: 14000, rep: 4 },
        normal: { text: 'Perbualan santai selama sejam yang menyeronokkan dan menambah kenalan.', stats: { happiness: 7 }, fame: 3, followers: 1500 },
        fail: { text: 'Anda terlepas cakap tentang rahsia orang lain secara langsung — terpaksa mohon maaf terbuka!', stats: { happiness: -9 }, rep: -5, karma: -5, stress: 10 }
      }
    },
    {
      id: 'act_help_move', cat: 'Sosial & Drama', icon: '📦', title: 'Bantu Jiran & Rakan Pindah Rumah',
      minAge: 14, costUsd: 0, boostTrait: 'empathetic',
      desc: 'Korbankan hujung minggu mengangkat perabot berat demi silaturahim.',
      outcomes: {
        win: { text: 'Mereka amat terharu dan menghadiahkan perabot antik berharga sebagai tanda terima kasih!', stats: { health: 3, happiness: 11 }, moneyUsd: 350, karma: 10, rep: 4 },
        normal: { text: 'Penat tetapi puas hati — dibelanja makan tengah hari yang sedap!', stats: { happiness: 8 }, karma: 6, rep: 2 },
        fail: { text: 'Anda terseliuh belakang ketika mengangkat peti sejuk berat.', stats: { health: -8, happiness: -3 }, karma: 4 }
      }
    },
    {
      id: 'act_office_gossip', cat: 'Sosial & Drama', icon: '☕', title: 'Dengar Gosip Panas & Politik Pejabat',
      minAge: 19, costUsd: 10, boostTrait: 'cunning',
      desc: 'Rakan mengajak anda minum petang sambil membongkar rahsia pihak atasan.',
      outcomes: {
        win: { text: 'Maklumat dalaman itu menyelamatkan anda daripada perangkap projek gagal!', stats: { smarts: 6, happiness: 8 }, stress: -4 },
        normal: { text: 'Cerita yang menghiburkan walaupun separuh daripadanya jelas ditokok tambah.', stats: { happiness: 4 } },
        fail: { text: 'Bos terdengar perbualan anda! Suasana kerja menjadi tegang dan reputasi tercalar.', stats: { happiness: -8 }, rep: -4, karma: -6, stress: 10 }
      }
    },
    {
      id: 'act_car_club', cat: 'Sosial & Drama', icon: '🚗', title: 'Konvoi Kelab Kereta & Motosikal',
      minAge: 18, costUsd: 50, boostTrait: 'risk_taker',
      desc: 'Sertai konvoi hujung minggu merentasi lebuh raya bersama peminat automotif.',
      outcomes: {
        win: { text: 'Konvoi paling meriah! Anda dilantik sebagai AJK kelab dan terkenal dalam komuniti!', stats: { happiness: 14, looks: 2 }, fame: 4, rep: 3 },
        normal: { text: 'Pemanduan lancar, kopi tepi jalan dan foto kenangan yang gempak.', stats: { happiness: 9 }, stress: -6 },
        fail: { text: 'Salah seorang ahli memandu melulu sehingga semua konvoi ditahan sekatan jalan polis!', stats: { happiness: -8 }, moneyUsd: -140, notoriety: 6, stress: 8 }
      }
    },

    // === D. BERISIKO TINGGI & LIAR (High-Risk / Wild) ===
    {
      id: 'act_storage_auction', cat: 'Berisiko Tinggi', icon: '🔐', title: 'Lelongan Kontena Misteri',
      minAge: 18, costUsd: 450, boostTrait: 'risk_taker',
      desc: 'Bida kontena terbiar tanpa tahu apa di dalamnya — emas atau sampah?',
      outcomes: {
        win: { text: 'LUAR BIASA! Di sebalik kotak usang ada jam tangan mewah & koleksi vintaj bernilai tinggi!', stats: { happiness: 18 }, moneyUsd: 4800 },
        normal: { text: 'Isi kontena sekadar perabot terpakai — cukup untuk pulang modal sedikit untung.', stats: { happiness: 4 }, moneyUsd: 620 },
        fail: { text: 'Hanya dipenuhi surat khabar lama dan tikus! Modal lelongan anda hangus begitu sahaja!', stats: { happiness: -12 }, stress: 10 }
      }
    },
    {
      id: 'act_haunted_explore', cat: 'Berisiko Tinggi', icon: '🏚️', title: 'Teroka Bangunan Lama Terbiar Tengah Malam',
      minAge: 15, costUsd: 0, boostTrait: 'eccentric',
      desc: 'Cabaran keberanian merakam suasana seram di bangunan tinggal.',
      outcomes: {
        win: { text: 'Rakaman "kelibat misteri" anda tular jutaan tontonan di media sosial!', stats: { happiness: 12 }, fame: 9, followers: 18000 },
        normal: { text: 'Jantung berdegup kencang mendengar bunyi angin, tetapi anda berjaya keluar dengan selamat.', stats: { happiness: 7 }, stress: 4 },
        fail: { text: 'Pengawal keselamatan menangkap anda atas tuduhan menceroboh dan mengenakan kompaun!', stats: { happiness: -10, health: -4 }, moneyUsd: -250, notoriety: 8 }
      }
    },
    {
      id: 'act_spicy_challenge', cat: 'Berisiko Tinggi', icon: '🌶️', title: 'Cabaran Mi Pedas Maut (Hadiah Tunai)',
      minAge: 14, costUsd: 20, boostTrait: 'risk_taker',
      desc: 'Habiskan semangkuk mi cili paling pedas di bandar dalam 10 minit.',
      outcomes: {
        win: { text: 'LIDAH BESI! Anda habiskan sampai titisan terakhir — menang hadiah tunai & gambar di dinding!', stats: { happiness: 14 }, moneyUsd: 350, fame: 4 },
        normal: { text: 'Berpeluh sakan dan mata berair tetapi berjaya menamatkan cabaran.', stats: { happiness: 7, health: -3 }, moneyUsd: 80 },
        fail: { text: 'Anda menyerah pada suapan ketiga dan terpaksa ke klinik akibat gastrik teruk!', stats: { health: -12, happiness: -7 }, moneyUsd: -90 }
      }
    },
    {
      id: 'act_street_race', cat: 'Berisiko Tinggi', icon: '🏁', title: 'Lumba Jalanan Tengah Malam',
      minAge: 18, costUsd: 120, boostTrait: 'risk_taker',
      desc: 'Perlumbaan haram dengan hadiah wang tunai — awas perangkap polis!',
      outcomes: {
        win: { text: 'Anda meluncur laju meninggalkan semua pencabar dan mengaut hadiah tunai besar!', stats: { happiness: 14 }, moneyUsd: 1800, notoriety: 12, karma: -8 },
        normal: { text: 'Perlumbaan dibatalkan saat akhir selepas siren polis kedengaran dari jauh.', stats: { happiness: -2 }, stress: 6, notoriety: 4 },
        fail: { text: 'Saman berat & kereta hampir disita dalam operasi besar-besaran polis trafik!', stats: { health: -8, happiness: -12 }, moneyUsd: -700, notoriety: 18, karma: -10 }
      }
    },
    {
      id: 'act_underground_bet', cat: 'Berisiko Tinggi', icon: '🃏', title: 'Taruhan Sukan Bawah Meja',
      minAge: 19, costUsd: 250, boostTrait: 'cunning', nonMuslimOnly: true,
      desc: 'Pertaruhkan wang anda pada perlawanan besar malam ini.',
      outcomes: {
        win: { text: 'Pasukan bukan pilihan menang mengejut — pulangan taruhan anda berganda lumayan!', stats: { happiness: 14 }, moneyUsd: 2100, karma: -6 },
        normal: { text: 'Keputusan seri — wang anda dipulangkan semula tanpa untung.', stats: { happiness: 1 } },
        fail: { text: 'Kalah teruk pada minit akhir! Wang anda lebur dan stres melonjak!', stats: { happiness: -13 }, moneyUsd: -300, stress: 12, karma: -8 }
      }
    },
    {
      id: 'act_grey_import', cat: 'Berisiko Tinggi', icon: '📦', title: 'Borong Gajet Tanpa Permit Rasmi',
      minAge: 19, costUsd: 350, boostTrait: 'cunning',
      desc: 'Jual gajet import murah secara pantas — untung besar jika tidak diserbu.',
      outcomes: {
        win: { text: 'Stok habis dijual dalam 48 jam dengan margin keuntungan yang menggiurkan!', stats: { happiness: 11 }, moneyUsd: 2200, karma: -8, notoriety: 8 },
        normal: { text: 'Terpaksa jual pada harga kos selepas pesaing menurunkan harga.', stats: { happiness: 2 }, moneyUsd: 380 },
        fail: { text: 'Pihak penguatkuasa merampas stok anda dan mengenakan kompaun berat!', stats: { happiness: -12 }, moneyUsd: -600, notoriety: 15, rep: -6 }
      }
    },

    // === E. PEMBANGUNAN DIRI (Personal Growth) ===
    {
      id: 'act_leadership_camp', cat: 'Pembangunan Diri', icon: '🏆', title: 'Kem Kepimpinan & Pidato Awam',
      minAge: 14, costUsd: 75, boostTrait: 'ambitious',
      desc: 'Asah keyakinan diri, gaya kepimpinan dan seni berucap di khalayak.',
      outcomes: {
        win: { text: 'Anda dinobatkan Peserta Terbaik! Keyakinan, kepintaran dan reputasi keluarga meningkat!', stats: { smarts: 8, looks: 4, happiness: 12 }, rep: 6, fame: 4 },
        normal: { text: 'Banyak ilmu komunikasi berkesan yang berguna untuk kerjaya anda.', stats: { smarts: 5, happiness: 7 }, rep: 2 },
        fail: { text: 'Anda gugup teruk di pentas utama dan terlupa teks ucapan di hadapan semua peserta.', stats: { happiness: -6 }, stress: 6 }
      }
    },
    {
      id: 'act_martial_arts', cat: 'Pembangunan Diri', icon: '🥋', title: 'Kelas Seni Bela Diri / Silat',
      minAge: 9, costUsd: 45, boostTrait: 'devout',
      desc: 'Bina disiplin, ketahanan fizikal dan kemahiran mempertahankan diri.',
      outcomes: {
        win: { text: 'Anda naik tali pinggang dengan cemerlang! Tubuh lebih cergas dan penampilan kian segak!', stats: { health: 12, looks: 6, happiness: 11 }, stress: -10 },
        normal: { text: 'Latihan intensif yang membina stamina dan keyakinan diri.', stats: { health: 8, looks: 3, happiness: 6 }, stress: -6 },
        fail: { text: 'Tersalah langkah semasa sparring — buku lali bengkak selama seminggu.', stats: { health: -6, happiness: -3 } }
      }
    },
    {
      id: 'act_soup_kitchen', cat: 'Pembangunan Diri', icon: '🍲', title: 'Sukarelawan Dapur Jalanan & Kebajikan',
      minAge: 12, costUsd: 15, boostTrait: 'empathetic',
      desc: 'Agihkan makanan panas kepada gelandangan dan keluarga memerlukan.',
      outcomes: {
        win: { text: 'Aksi murni anda menyentuh hati ramai! Karma & reputasi keluarga melonjak tinggi!', stats: { happiness: 16 }, karma: 16, rep: 8, stress: -10 },
        normal: { text: 'Senyuman penerima bantuan mengisi hati anda dengan rasa syukur yang mendalam.', stats: { happiness: 11 }, karma: 10, rep: 4, stress: -6 },
        fail: { text: 'Hujan lebat menyukarkan agihan, namun usaha ikhlas anda tetap membawa keberkatan.', stats: { health: -3, happiness: 5 }, karma: 8, rep: 2 }
      }
    },
    {
      id: 'act_finance_course', cat: 'Pembangunan Diri', icon: '📈', title: 'Kursus Pengurusan Kekayaan & Pelaburan',
      minAge: 18, costUsd: 130, boostTrait: 'ambitious',
      desc: 'Pelajari strategi hartanah, cukai dan pelaburan jangka panjang.',
      outcomes: {
        win: { text: 'Anda menemui kesilapan cukai lama dan mendapat pulangan rebat tunai yang besar!', stats: { smarts: 9, happiness: 11 }, moneyUsd: 950, rep: 2 },
        normal: { text: 'Ilmu kewangan anda semakin mantap untuk membina empayar keluarga.', stats: { smarts: 6, happiness: 5 } },
        fail: { text: 'Rupa-rupanya penceramah lebih banyak menjual buku mahal daripada berkongsi ilmu sebenar.', stats: { happiness: -6, smarts: 1 } }
      }
    },
    {
      id: 'act_digital_detox', cat: 'Pembangunan Diri', icon: '🌲', title: 'Retret Detoks Digital 3 Hari',
      minAge: 15, costUsd: 60, boostTrait: 'devout',
      desc: 'Matikan telefon bimbit sepenuhnya untuk menyegarkan minda dan jiwa.',
      outcomes: {
        win: { text: 'Ketenangan mutlak! Stres menjunam, idea bernas mencurah dan tidur kembali lena!', stats: { health: 9, happiness: 14, smarts: 4 }, stress: -24, karma: 4 },
        normal: { text: 'Fikiran jauh lebih tenang tanpa gangguan notifikasi media sosial.', stats: { health: 5, happiness: 9 }, stress: -14 },
        fail: { text: 'Sekembalinya anda, 140 mesej kecemasan kerja sedang menunggu dalam peti masuk!', stats: { happiness: -4 }, stress: 6 }
      }
    },
    {
      id: 'act_new_language', cat: 'Pembangunan Diri', icon: '🌐', title: 'Kelas Bahasa Asing & Budaya Dunia',
      minAge: 10, costUsd: 55, boostTrait: 'creative',
      desc: 'Kuasai bahasa baharu untuk membuka pintu kerjaya dan hijrah.',
      outcomes: {
        win: { text: 'Anda cepat fasih! Penyesuaian budaya, kepintaran dan peluang global meningkat!', stats: { smarts: 9, happiness: 10, adaptation: 12 }, rep: 2 },
        normal: { text: 'Kini anda boleh berbual asas dengan penuh yakin bersama penutur jati.', stats: { smarts: 5, happiness: 6, adaptation: 7 } },
        fail: { text: 'Anda tersalah sebut perkataan sensitif di hadapan guru — malu tetapi jadi pengajaran!', stats: { smarts: 2, happiness: -3 } }
      }
    },

    // === F. PELUANG NADIR / WILDCARD (Rare Opportunities — 15–20% spawn!) ===
    {
      id: 'rare_antique_find', cat: 'Peluang Nadir', icon: '🏺', title: '✨ Lelongan Barang Antik Tersembunyi',
      isRare: true, minAge: 18, costUsd: 500, boostTrait: 'cunning',
      desc: 'Peluang jarang! Seorang pengumpul warga emas melelong pasu & lukisan lama tanpa penilaian pakar.',
      outcomes: {
        win: { text: 'HARTA KARUN! Pakar muzium mengesahkan ia artifak asli bernilai luar biasa!', stats: { happiness: 22, smarts: 5 }, moneyUsd: 16500, fame: 8, rep: 8 },
        normal: { text: 'Ia replika berkualiti tinggi — anda menjualnya semula dengan untung sederhana.', stats: { happiness: 8 }, moneyUsd: 1200 },
        fail: { text: 'Ternyata barang tiruan baru yang sengaja diusangkan! Pengajaran mahal.', stats: { happiness: -10 }, stress: 8 }
      }
    },
    {
      id: 'rare_billionaire_dinner', cat: 'Peluang Nadir', icon: '💎', title: '✨ Jemputan Makan Malam Jutawan Misteri',
      isRare: true, minAge: 20, costUsd: 120, boostTrait: 'charismatic',
      desc: 'Satu kerusi kosong di meja tokoh korporat terkenal ditawarkan kepada anda malam ini!',
      outcomes: {
        win: { text: 'Tokoh itu kagum dengan wawasan anda dan melabur terus dalam dana peribadi anda!', stats: { happiness: 20, smarts: 6 }, moneyUsd: 12000, fame: 12, rep: 12 },
        normal: { text: 'Anda mendapat nasihat emas dan jaringan kenalan elit yang amat bernilai.', stats: { smarts: 6, happiness: 11 }, fame: 5, rep: 6 },
        fail: { text: 'Anda terasa kekok dengan protokol mewah dan tersilap topik sensitif di meja makan.', stats: { happiness: -8 }, rep: -4, stress: 8 }
      }
    },
    {
      id: 'rare_pre_ipo', cat: 'Peluang Nadir', icon: '🚀', title: '✨ Tawaran Saham Pra-IPO Startup Teknologi',
      isRare: true, minAge: 19, costUsd: 1200, boostTrait: 'ambitious',
      desc: 'Kenalan pengasas startup AI menawarkan slot pelaburan awal sebelum penyenaraian bursa!',
      outcomes: {
        win: { text: 'UNICORN! Startup itu melonjak 10x ganda pada hari penyenaraian — durian runtuh!', stats: { happiness: 24, smarts: 5 }, moneyUsd: 24000, rep: 6 },
        normal: { text: 'Penyenaraian sederhana — anda meraih pulangan hampir 2 kali ganda.', stats: { happiness: 10 }, moneyUsd: 2600 },
        fail: { text: 'Startup itu gagal melancarkan produk dan ditutup! Pelaburan anda hangus.', stats: { happiness: -14 }, stress: 14 }
      }
    },
    {
      id: 'rare_lost_wallet', cat: 'Peluang Nadir', icon: '👛', title: '✨ Temui Dompet Penuh Wang Tunai & Kad VIP',
      isRare: true, minAge: 10, costUsd: 0, boostTrait: 'devout',
      desc: 'Anda menemui dompet kulit mewah berisi tunai tebal di lorong sunyi — pulangkan atau simpan?',
      outcomes: {
        win: { text: 'Anda memulangkannya kepada pemilik jutawan! Dia memberi ganjaran besar & memuji maruah keluarga anda di media!', stats: { happiness: 20 }, moneyUsd: 5500, karma: 24, fame: 10, rep: 14 },
        normal: { text: 'Anda memulangkannya di balai polis dan menerima ucapan terima kasih serta saguhati.', stats: { happiness: 12 }, moneyUsd: 400, karma: 14, rep: 6 },
        fail: { text: 'Anda gagal menjejaki pemilik dan menyerahkannya kepada badan amal — hati tetap tenang.', stats: { happiness: 7 }, karma: 10, rep: 3 }
      }
    },
    {
      id: 'rare_global_ad', cat: 'Peluang Nadir', icon: '🎬', title: '✨ Uji Bakat Iklan Antarabangsa Saat Akhir',
      isRare: true, minAge: 15, costUsd: 0, boostTrait: 'creative',
      desc: 'Pengarah iklan jenama global mencari wajah segar di bandar anda hari ini juga!',
      outcomes: {
        win: { text: 'TERPILIH! Wajah anda menghiasi papan iklan gergasi seluruh negara dengan bayaran lumayan!', stats: { happiness: 20, looks: 4 }, moneyUsd: 9500, fame: 18, followers: 32000, rep: 8 },
        normal: { text: 'Terpilih sebagai pelakon sokongan — bayaran masih sangat lumayan!', stats: { happiness: 10 }, moneyUsd: 1600, fame: 6 },
        fail: { text: 'Menunggu 6 jam di lokasi tetapi produksi membatalkan penggambaran saat akhir.', stats: { happiness: -6 }, stress: 6 }
      }
    },
    {
      id: 'rare_celeb_collab', cat: 'Peluang Nadir', icon: '🌟', title: '✨ Tawaran Kolaborasi Mengejut Selebriti',
      isRare: true, minAge: 16, costUsd: 0, boostTrait: 'eccentric',
      desc: 'Seorang bintang terkenal tertarik dengan personaliti unik anda dan mengajak berkolaborasi!',
      outcomes: {
        win: { text: 'Kolaborasi meletup seluruh internet! Pengikut, reputasi dan tajaan mencurah masuk!', stats: { happiness: 20 }, moneyUsd: 7200, fame: 16, followers: 45000, rep: 9 },
        normal: { text: 'Sesi rakaman yang menyeronokkan dan menaikkan profil anda di mata umum.', stats: { happiness: 11 }, moneyUsd: 1100, fame: 7, followers: 8500 },
        fail: { text: 'Selebriti itu terpalit kontroversi keesokan harinya dan anda turut terkena tempias netizen!', stats: { happiness: -9 }, rep: -5, stress: 10 }
      }
    }
  ],

  // --------------------------------------------------------------------------
  // 3. JANA DEK RAWAK TAHUNAN (5–7 Aktiviti + 15–20% Peluang Nadir)
  // --------------------------------------------------------------------------
  generateYearlyDeck(s) {
    if (!s) return [];
    GameState.ensureUpgradedState();
    const muslim = s.belief === 'islam';
    const traits = s.traits || [];
    const bonuses = window.Dynasty ? Dynasty.getBloodlineBonuses() : {};

    const normalEligible = this.POOL.filter(a => {
      if (a.isRare) return false;
      if (s.age < (a.minAge || 0)) return false;
      if (muslim && a.nonMuslimOnly) return false;
      return true;
    });

    const rareEligible = this.POOL.filter(a => {
      if (!a.isRare) return false;
      if (s.age < (a.minAge || 0)) return false;
      return true;
    });

    const deckSize = Utils.randInt(5, 7);
    const chosen = [];

    // 15–20% peluang muncul Peluang Nadir (+ bonus Gen 5 Darah Dinasti!)
    const rareChance = Math.min(0.45, 0.18 + (bonuses.rareActivityBonus || 0));
    if (rareEligible.length > 0 && Utils.chance(rareChance)) {
      chosen.push(Utils.pick(rareEligible).id);
    }

    // Beri keutamaan sedikit kepada aktiviti yang serasi dengan personaliti watak
    const shuffled = [...normalEligible].sort((a, b) => {
      const aBoost = traits.includes(a.boostTrait) ? 0.25 : 0;
      const bBoost = traits.includes(b.boostTrait) ? 0.25 : 0;
      return (Math.random() + bBoost) - (Math.random() + aBoost);
    });

    for (const act of shuffled) {
      if (chosen.length >= deckSize) break;
      if (!chosen.includes(act.id)) chosen.push(act.id);
    }

    s.yearlyDeck = chosen;
    return chosen;
  },

  // --------------------------------------------------------------------------
  // 4. JALANKAN AKTIVITI DENGAN HASIL RNG BERCABANG
  // --------------------------------------------------------------------------
  performActivity(actId) {
    const s = GameState.current;
    GameState.ensureUpgradedState();
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Anda di dalam penjara — tidak dapat keluar melakukan aktiviti!' };
    const act = this.POOL.find(a => a.id === actId);
    if (!act) return { ok: false, msg: 'Aktiviti tidak ditemui.' };
    const doneKey = 'deck_' + act.id;
    if (s.yearlyActions[doneKey]) return { ok: false, msg: 'Anda sudah melakukan aktiviti ini tahun ini!' };

    const costLocal = (s.age < 18 && act.costUsd <= 60) ? 0 : Utils.usdToLocal(act.costUsd || 0, s.countryId);
    if (costLocal > 0 && s.money < costLocal) {
      return { ok: false, msg: `Perlukan ${Utils.formatMoney(costLocal, s.countryId)} untuk menyertai aktiviti ini.` };
    }

    if (costLocal > 0) s.money -= costLocal;
    s.yearlyActions[doneKey] = true;

    const traits = s.traits || [];
    const hasSynergy = act.boostTrait && traits.includes(act.boostTrait);
    const isTarnished = window.Dynasty && Dynasty.getData().legacyStatus === 'Tarnished';

    // Kebarangkalian hasil bercabang (Big Win / Normal / Chaotic Fail)
    let winProb = 0.28 + (hasSynergy ? 0.14 : 0) + ((s.stats.smarts - 50) * 0.002);
    let failProb = 0.24 - (hasSynergy ? 0.07 : 0);
    if (isTarnished && (act.isRare || act.cat === 'Sosial & Drama')) {
      winProb -= 0.09;
      failProb += 0.08;
    }

    const roll = Math.random();
    let tier = 'normal';
    if (roll < Math.max(0.10, winProb)) tier = 'win';
    else if (roll > 1 - Math.max(0.10, failProb)) tier = 'fail';

    const out = act.outcomes[tier] || act.outcomes.normal;

    if (out.stats) GameState.adjustStats(out.stats);
    if (out.moneyUsd) {
      const delta = Utils.usdToLocal(out.moneyUsd, s.countryId);
      s.money += delta;
    }
    if (out.followers && s.socialMedia) {
      s.socialMedia.followers = (s.socialMedia.followers || 0) + out.followers;
    }
    if (window.KarmaEndings && (out.karma || out.fame || out.notoriety || out.stress)) {
      KarmaEndings.adjustAlignment({
        karma: out.karma || 0,
        fame: out.fame || 0,
        notoriety: out.notoriety || 0,
        stress: out.stress || 0
      });
    }
    if (out.rep && window.Dynasty) {
      Dynasty.adjustReputation(out.rep);
    }

    const tierTag = tier === 'win' ? '🌟 HASIL LUAR BIASA' : tier === 'fail' ? '💥 PLOT TWIST' : '✨';
    const jType = tier === 'win' ? 'milestone' : tier === 'fail' ? 'warning' : 'culture';
    GameState.addJournalEntry(`${act.icon} ${act.title} (${tierTag}): ${out.text}`, jType);
    if (act.isRare && tier === 'win' && window.KarmaEndings) {
      KarmaEndings.addHighlight(act.icon, `Menang besar dalam peluang nadir: ${act.title.replace('✨ ', '')}`);
    }
    GameState.save();

    return {
      ok: tier !== 'fail',
      tier,
      msg: `${tierTag}: ${out.text}`
    };
  }
};
