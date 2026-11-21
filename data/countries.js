/* ==========================================================================
   WorldLife — Pangkalan Data Budaya 10 Negara (Bahasa Melayu)
   ========================================================================== */

window.COUNTRIES = {
  MY: {
    id: 'MY',
    name: 'Malaysia',
    demonym: 'Malaysia',
    flag: '🇲🇾',
    currency: { code: 'MYR', symbol: 'RM ', decimals: 0 },
    usdRate: 4.45,
    theme: { primary: '#cc0001', secondary: '#010066', accent: '#ffcc00' },
    tagline: 'Malaysia Truly Asia — Lepak Mamak, perayaan muhibbah, SPM & makanan paling padu!',
    highlights: ['Nasi Lemak & Teh Tarik', 'SPM & Matrikulasi', 'Raya, CNY, Deepavali & Gawai', 'MyVi King of the Road'],
    healthcare: { type: 'Klinik Kesihatan (KKM)', doctorCost: 5, privateCost: 180, desc: 'RM 1–5 di Klinik Kesihatan kerajaan; hospital pakar swasta turut tersedia.' },
    taxRate: 0.14,
    retirementScheme: 'KWSP (EPF)',
    lifeExpectancy: 77,
    costOfLivingIndex: 0.42,
    visaFeeUsd: 450,
    flightBaseUsd: 350,
    closeCultures: ['SG', 'ID', 'TH'],
    cities: ['Kuala Lumpur', 'George Town (Pulau Pinang)', 'Johor Bahru', 'Shah Alam', 'Kota Kinabalu', 'Kuching', 'Ipoh', 'Melaka', 'Subang Jaya', 'Putrajaya'],
    slang: ['lah', 'bossku', 'walao', 'syok', 'tapau', 'lepak', 'yumcha', 'mantap', 'boleh lah'],
    heritages: [
      { id: 'malay', label: 'Melayu' },
      { id: 'chinese_my', label: 'Cina-Malaysia' },
      { id: 'indian_my', label: 'India-Malaysia' },
      { id: 'borneo', label: 'Sabah / Sarawak (Borneo)' }
    ],
    names: {
      malay: {
        male: ['Aiman', 'Hakim', 'Danish', 'Irfan', 'Syafiq', 'Haziq', 'Amirul', 'Faris', 'Zul', 'Asraf', 'Faiz', 'Nabil'],
        female: ['Aisyah', 'Nurul', 'Sofea', 'Hana', 'Izzah', 'Balqis', 'Nadia', 'Syirah', 'Amira', 'Qistina', 'Farah', 'Liyana'],
        last: ['bin Abdullah', 'bin Ismail', 'bin Rahman', 'bin Hassan', 'bin Razak', 'bin Zainal', 'bin Yusof', 'bin Saharudin', 'bin Aziz'],
        lastFemale: ['binti Abdullah', 'binti Ismail', 'binti Rahman', 'binti Hassan', 'binti Razak', 'binti Zainal', 'binti Yusof', 'binti Aziz']
      },
      chinese_my: {
        male: ['Wei Jie', 'Jun Hao', 'Jia Wei', 'Marcus', 'Kenneth', 'Boon Kiat', 'Zhi Ming', 'Darren', 'Kah Heng', 'Jason'],
        female: ['Mei Ling', 'Xin Yi', 'Jia En', 'Chloe', 'Rachel', 'Siew Fong', 'Pei Shan', 'Vicky', 'Shu Ting', 'Audrey'],
        last: ['Tan', 'Lim', 'Lee', 'Wong', 'Ng', 'Chong', 'Ong', 'Goh', 'Teoh', 'Chan']
      },
      indian_my: {
        male: ['Arjun', 'Pravin', 'Vikram', 'Dinesh', 'Kavinesh', 'Suresh', 'Navin', 'Roshan', 'Harish', 'Shankar'],
        female: ['Priya', 'Kavitha', 'Divya', 'Shalini', 'Ananya', 'Deepa', 'Meena', 'Nisha', 'Tharshini', 'Lavanya'],
        last: ['a/l Subramaniam', 'a/l Krishnan', 'a/l Rajan', 'a/l Kumar', 'a/l Selvam', 'a/l Pillai'],
        lastFemale: ['a/p Subramaniam', 'a/p Krishnan', 'a/p Rajan', 'a/p Kumar', 'a/p Selvam', 'a/p Pillai']
      },
      borneo: {
        male: ['Alvin', 'Dexter', 'Gavin', 'Rizal', 'Edison', 'Kelvin', 'Aron', 'Zackry', 'Bryan', 'Ferdinand'],
        female: ['Evelyn', 'Brenda', 'Clarissa', 'Natasha', 'Siti', 'Valerie', 'Jessica', 'Mellisa', 'Audrina', 'Fionna'],
        last: ['Lajim', 'Masing', 'Mojigoh', 'Banting', 'Sagan', 'Uggah', 'Bujang', 'Gimbun', 'Daud']
      }
    },
    education: {
      preschool: { name: 'Tadika', startAge: 5 },
      primary: { name: 'Sekolah Kebangsaan (SK)', startAge: 7, examAge: 12, examName: 'Ujian Akhir Sekolah Rendah (UASA)' },
      secondary: { name: 'Sekolah Menengah Kebangsaan (SMK)', startAge: 13, examAge: 17, examName: 'SPM (Sijil Pelajaran Malaysia)' },
      preU: { name: 'Matrikulasi / STPM / Diploma', startAge: 18, duration: 2 },
      universities: ['Universiti Malaya (UM)', 'UTM Skudai', 'USM Pulau Pinang', 'UKM Bangi', 'Universiti Taylor\'s', 'Universiti Sunway', 'UTAR', 'UiTM'],
      uniTuitionAnnual: 4500,
      uniDuration: 4
    },
    festivals: [
      { name: 'Hari Raya Aidilfitri', icon: '🌙', desc: 'Balik kampung, rendang, lemang, rumah terbuka dan kutip Duit Raya!' },
      { name: 'Tahun Baru Cina', icon: '🧧', desc: 'Menggaul Yee Sang ("Loh Hei!"), tarian singa dan sampul Ang Pow merah!' },
      { name: 'Hari Deepavali', icon: '🪔', desc: 'Seni kolam berwarna-warni, murukku rangup dan rumah terbuka mesra!' },
      { name: 'Hari Merdeka (31 Ogos)', icon: '🇲🇾', desc: 'Laungan "Merdeka!" di Dataran Merdeka dengan bunga api dan Jalur Gemilang.' },
      { name: 'Pesta Kaamatan & Hari Gawai', icon: '🌾', desc: 'Pesta menuai meriah di Sabah & Sarawak dengan tarian tradisional.' }
    ],
    cultureActivities: [
      { id: 'my_mamak', title: 'Lepak Mamak 24 Jam', icon: '🫓', desc: 'Pesan Roti Canai Banjir, Maggi Goreng & Teh Tarik bersama kawan jam 1 pagi.', cost: 18, effects: { happiness: 11, health: -2, adaptation: 9 } },
      { id: 'my_pasar_malam', title: 'Jalan-jalan Pasar Malam', icon: '🍢', desc: 'Cari Apam Balik, Sate, Air Balang & barang RM10 di pasar malam.', cost: 35, effects: { happiness: 10, adaptation: 8 } },
      { id: 'my_durian', title: 'Pesta Durian Musang King', icon: '🍈', desc: 'Makan Musang King Pahang tepi jalan dengan buah manggis penyejuk badan.', cost: 120, effects: { happiness: 14, health: 1, adaptation: 10 } },
      { id: 'my_penang_trip', title: 'Jalan-jalan Cari Makan Penang', icon: '🍜', desc: 'Memandu ke utara untuk Char Kuey Teow, Cendol & Nasi Kandar beratur.', cost: 420, effects: { happiness: 16, adaptation: 11 } },
      { id: 'my_bm_class', title: 'Latih Bahasa Melayu & Slanga Tempatan', icon: '🗣️', desc: 'Kuasai "boleh", "lah", dan perbualan mesra harian Malaysia.', cost: 60, effects: { smarts: 4, adaptation: 15 } },
      { id: 'my_badminton', title: 'Main Badminton Malam', icon: '🏸', desc: 'Smash bulu tangkis di dewan kejiranan sampai tengah malam, lepas tu teh o ais limau.', cost: 25, effects: { health: 9, happiness: 9, adaptation: 7 } }
    ],
    jobs: [
      { id: 'my_grab', title: 'Pemandu / Rider Grab', icon: '🛵', minAge: 18, reqDegree: false, salary: 30000, desc: 'Kerja fleksibel meredah trafik Lembah Klang.' },
      { id: 'my_barista', title: 'Barista Kopitiam / Kafe', icon: '☕', minAge: 18, reqDegree: false, salary: 26400, desc: 'Membancuh Kopi Kaw & latte istimewa.' },
      { id: 'my_sales', title: 'Eksekutif Jualan Mall', icon: '🛍️', minAge: 18, reqDegree: false, salary: 32000, desc: 'Bekerja di Pavilion / Mid Valley Megamall.' },
      { id: 'my_teacher', title: 'Cikgu Sekolah', icon: '📚', minAge: 22, reqDegree: true, salary: 48000, desc: 'Mendidik generasi masa depan Malaysia.' },
      { id: 'my_software', title: 'Jurutera Perisian (Bangsar South)', icon: '💻', minAge: 22, reqDegree: true, salary: 84000, desc: 'Membina aplikasi fintech & teknologi di KL.' },
      { id: 'my_petronas', title: 'Jurutera Minyak & Gas', icon: '🛢️', minAge: 22, reqDegree: true, salary: 108000, desc: 'Kerjaya tenaga bergaji tinggi di KLCC / Kerteh.' },
      { id: 'my_doctor', title: 'Pegawai Perubatan (Hospital KL)', icon: '🩺', minAge: 24, reqDegree: true, reqSmarts: 75, salary: 96000, desc: 'Doktor berdedikasi berkhidmat di hospital & klinik.' },
      { id: 'my_banker', title: 'Penganalisis Pelaburan (KL Sentral)', icon: '📈', minAge: 22, reqDegree: true, reqSmarts: 65, salary: 102000, desc: 'Mengurus portfolio di hab kewangan Malaysia.' },
      { id: 'my_chef', title: 'Chef Nasi Lemak & Fusion', icon: '🍛', minAge: 19, reqDegree: false, salary: 52000, desc: 'Menguruskan restoran tempatan yang tular.' }
    ],
    assets: {
      vehicles: [
        { id: 'my_kapcai', name: 'Motosikal Honda EX5 Kapcai', icon: '🛵', price: 5200, upkeep: 450, happiness: 5 },
        { id: 'my_myvi', name: 'Perodua MyVi ("King of the Road")', icon: '🚗', price: 54000, upkeep: 3600, happiness: 14 },
        { id: 'my_x50', name: 'Proton X50 Flagship', icon: '🚙', price: 113000, upkeep: 6200, happiness: 18 },
        { id: 'my_alphard', name: 'Toyota Alphard VIP', icon: '🚐', price: 420000, upkeep: 18000, happiness: 26 }
      ],
      properties: [
        { id: 'my_flat', name: 'Apartmen di Cheras', icon: '🏢', price: 240000, upkeep: 4200, happiness: 10 },
        { id: 'my_terrace', name: 'Rumah Teres 2 Tingkat (Subang Jaya)', icon: '🏡', price: 780000, upkeep: 9500, happiness: 20 },
        { id: 'my_condo', name: 'Kondominium Mewah Mont Kiara', icon: '🏙️', price: 1150000, upkeep: 16000, happiness: 24 },
        { id: 'my_bungalow', name: 'Banglo Damansara Heights', icon: '🏰', price: 3800000, upkeep: 42000, happiness: 34 }
      ]
    }
  },

  SG: {
    id: 'SG',
    name: 'Singapura',
    demonym: 'Singapura',
    flag: '🇸🇬',
    currency: { code: 'SGD', symbol: 'S$', decimals: 0 },
    usdRate: 1.34,
    theme: { primary: '#ef3340', secondary: '#991b1b', accent: '#f8fafc' },
    tagline: 'Kota Singa — Hawker centre, flat HDB BTO, CPF, gaji SGD tinggi & serba pantas.',
    highlights: ['Nasi Ayam Hawker', 'PSLE & NUS/NTU', 'HDB BTO & MRT', 'Gaji SGD Kukuh'],
    healthcare: { type: 'Poliklinik / MediSave', doctorCost: 18, privateCost: 90, desc: 'Poliklinik bertaraf dunia disokong MediSave.' },
    taxRate: 0.11,
    retirementScheme: 'CPF',
    lifeExpectancy: 84,
    costOfLivingIndex: 1.05,
    visaFeeUsd: 550,
    flightBaseUsd: 260,
    closeCultures: ['MY', 'ID', 'TH'],
    cities: ['Tampines', 'Orchard', 'Tiong Bahru', 'Jurong East', 'Bedok', 'Woodlands', 'Punggol', 'Marina Bay', 'Clementi'],
    slang: ['lah', 'shiok', 'kiasu', 'chope', 'dabao', 'can', 'steady'],
    heritages: [
      { id: 'sg_chinese', label: 'Cina-Singapura' },
      { id: 'sg_malay', label: 'Melayu-Singapura' },
      { id: 'sg_indian', label: 'India-Singapura' }
    ],
    names: {
      sg_chinese: {
        male: ['Ryan', 'Marcus', 'Ethan', 'Jian Wei', 'Darren', 'Nicholas', 'Bryan', 'Caleb', 'Jun Jie'],
        female: ['Chloe', 'Rachel', 'Nicole', 'Hui Min', 'Valerie', 'Cheryl', 'Megan', 'Xin Yi', 'Amanda'],
        last: ['Tan', 'Lim', 'Lee', 'Ng', 'Ong', 'Wong', 'Goh', 'Chua', 'Chan', 'Koh']
      },
      sg_malay: {
        male: ['Farhan', 'Hafiz', 'Irfan', 'Syakir', 'Zulfiqar', 'Danial', 'Firdaus'],
        female: ['Nur', 'Siti', 'Aisyah', 'Farah', 'Nabila', 'Hana', 'Amirah'],
        last: ['bin Mohamed', 'bin Salleh', 'bin Ahmad', 'bin Rahman', 'bin Kassim'],
        lastFemale: ['binte Mohamed', 'binte Salleh', 'binte Ahmad', 'binte Rahman']
      },
      sg_indian: {
        male: ['Vikram', 'Rohan', 'Pranav', 'Arvind', 'Surya', 'Kiran', 'Nikhil'],
        female: ['Priya', 'Ananya', 'Shreya', 'Meera', 'Kavya', 'Deepika', 'Divya'],
        last: ['Nair', 'Pillai', 'Menon', 'Rajan', 'Subramaniam', 'Krishnan']
      }
    },
    education: {
      preschool: { name: 'Tadika PAP', startAge: 5 },
      primary: { name: 'Sekolah Rendah', startAge: 7, examAge: 12, examName: 'PSLE' },
      secondary: { name: 'Sekolah Menengah', startAge: 13, examAge: 16, examName: 'GCE O-Levels' },
      preU: { name: 'Junior College / Politeknik', startAge: 17, duration: 2 },
      universities: ['NUS (National University of Singapore)', 'NTU', 'SMU', 'SUTD'],
      uniTuitionAnnual: 9500,
      uniDuration: 4
    },
    festivals: [
      { name: 'Hari Kebangsaan (9 Ogos)', icon: '🇸🇬', desc: 'Baju merah putih, bunga api Marina Bay dan menyanyi lagu "Home"!' },
      { name: 'Tahun Baru Cina di Chinatown', icon: '🧧', desc: 'Tanglung River Hongbao, barisan panjang Bak Kwa dan ziarah keluarga.' },
      { name: 'Hari Raya di Geylang Serai', icon: '🌙', desc: 'Lampu bazar memukau, burger Ramly dan kuih raya.' },
      { name: 'Deepavali di Little India', icon: '🪔', desc: 'Gerbang cahaya Serangoon Road yang meriah dan manisan tradisi.' }
    ],
    cultureActivities: [
      { id: 'sg_hawker', title: 'Chope Meja di Hawker Centre', icon: '🍗', desc: 'Letak tisu dan nikmati Nasi Ayam Hainan serta Kopi-O.', cost: 10, effects: { happiness: 11, adaptation: 10 } },
      { id: 'sg_gardens', title: 'Bersantai di Gardens by the Bay', icon: '🌳', desc: 'Tonton pertunjukan cahaya Supertree ditemani bayu laut.', cost: 25, effects: { happiness: 12, health: 4, adaptation: 8 } },
      { id: 'sg_jb', title: 'Trip Hujung Minggu ke JB', icon: '🚌', desc: 'Redah Tambak Johor untuk kafe, urutan dan beli-belah berbaloi.', cost: 90, effects: { happiness: 14, adaptation: 9 } },
      { id: 'sg_singlish', title: 'Kuasai Singlish Tempatan', icon: '🗣️', desc: 'Fahami perbezaan "can lah", "can meh" dan "can lor".', cost: 20, effects: { smarts: 3, adaptation: 15 } },
      { id: 'sg_ecp', title: 'Berbasikal di East Coast Park', icon: '🚲', desc: 'Kayuh basikal di tepi pantai dan akhiri dengan Chili Crab.', cost: 55, effects: { health: 10, happiness: 10, adaptation: 7 } }
    ],
    jobs: [
      { id: 'sg_hawker_job', title: 'Perantis Gerai Hawker', icon: '🍜', minAge: 18, reqDegree: false, salary: 34000, desc: 'Meneruskan warisan kulinari UNESCO.' },
      { id: 'sg_retail', title: 'Ketua Jualan Orchard Road', icon: '🛍️', minAge: 18, reqDegree: false, salary: 38000, desc: 'Layanan mewah di sepanjang Orchard.' },
      { id: 'sg_nurse', title: 'Jururawat Berdaftar (SGH)', icon: '🩺', minAge: 21, reqDegree: true, salary: 58000, desc: 'Barisan hadapan di Hospital Besar Singapura.' },
      { id: 'sg_swe', title: 'Jurutera Perisian (One-North)', icon: '💻', minAge: 22, reqDegree: true, salary: 92000, desc: 'Membina platform teknologi serantau.' },
      { id: 'sg_finance', title: 'Pengurus Kekayaan (Raffles Place)', icon: '🏦', minAge: 22, reqDegree: true, reqSmarts: 70, salary: 125000, desc: 'Sektor kewangan elit di Marina Bay.' },
      { id: 'sg_civil', title: 'Pegawai Dasar Perkhidmatan Awam', icon: '🏛️', minAge: 22, reqDegree: true, reqSmarts: 65, salary: 84000, desc: 'Merancang masa depan bandar Singapura.' }
    ],
    assets: {
      vehicles: [
        { id: 'sg_ezlink', name: 'Basikal Lipat Brompton + Pas MRT', icon: '🚲', price: 2600, upkeep: 400, happiness: 8 },
        { id: 'sg_toyota', name: 'Toyota Corolla Altis (termasuk COE!)', icon: '🚗', price: 158000, upkeep: 9500, happiness: 17 },
        { id: 'sg_merc', name: 'Mercedes-Benz E-Class (termasuk COE!)', icon: '🚘', price: 360000, upkeep: 18000, happiness: 24 }
      ],
      properties: [
        { id: 'sg_bto', name: 'Flat HDB 4-Bilik di Tampines', icon: '🏢', price: 540000, upkeep: 5200, happiness: 18 },
        { id: 'sg_condo', name: 'Kondominium di Tiong Bahru', icon: '🏙️', price: 1650000, upkeep: 16000, happiness: 26 },
        { id: 'sg_sentosa', name: 'Vila Tepi Air Sentosa Cove', icon: '🏝️', price: 6200000, upkeep: 55000, happiness: 36 }
      ]
    }
  },

  JP: {
    id: 'JP',
    name: 'Jepun',
    demonym: 'Jepun',
    flag: '🇯🇵',
    currency: { code: 'JPY', symbol: '¥', decimals: 0 },
    usdRate: 152,
    theme: { primary: '#bc002d', secondary: '#1e293b', accent: '#fbcfe8' },
    tagline: 'Negara Matahari Terbit — Kedai Konbini, Shinkansen tepat masa, Hanami & Onsen tenang.',
    highlights: ['Konbini & Ramen', 'Peperiksaan Todai', 'Sakura Hanami & Matsuri', 'Onsen & Shinkansen'],
    healthcare: { type: 'Insurans Kesihatan Nasional (70%)', doctorCost: 3500, privateCost: 14000, desc: 'Klinik bersih dan cekap dengan bayaran 30% sahaja.' },
    taxRate: 0.22,
    retirementScheme: 'Nenkin (Pencen)',
    lifeExpectancy: 85,
    costOfLivingIndex: 0.88,
    visaFeeUsd: 650,
    flightBaseUsd: 620,
    closeCultures: ['KR'],
    cities: ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Fukuoka', 'Sapporo', 'Nagoya', 'Kobe'],
    slang: ['sugoi', 'otsukaresama', 'yabai', 'kawaii', 'kampai', 'shoganai'],
    heritages: [{ id: 'jp_local', label: 'Jepun' }],
    names: {
      jp_local: {
        male: ['Haruto', 'Ren', 'Sota', 'Yuto', 'Kaito', 'Riku', 'Takumi', 'Kenji', 'Daiki', 'Shota'],
        female: ['Yui', 'Hina', 'Sakura', 'Aoi', 'Mio', 'Yuna', 'Rina', 'Haruka', 'Mei', 'Natsuki'],
        last: ['Sato', 'Suzuki', 'Takahashi', 'Tanaka', 'Watanabe', 'Ito', 'Yamamoto', 'Nakamura', 'Kobayashi', 'Kato']
      }
    },
    education: {
      preschool: { name: 'Yochien', startAge: 5 },
      primary: { name: 'Shogakko (Sekolah Rendah)', startAge: 6, examAge: 12, examName: 'Ujian Masuk Menengah' },
      secondary: { name: 'Chugakko & Koko', startAge: 12, examAge: 18, examName: 'Ujian Kyotsu Universiti' },
      preU: { name: 'Senmon Gakko (Vokasional)', startAge: 18, duration: 2 },
      universities: ['Universiti Tokyo (Todai)', 'Universiti Kyoto', 'Universiti Waseda', 'Universiti Keio', 'Universiti Osaka'],
      uniTuitionAnnual: 580000,
      uniDuration: 4
    },
    festivals: [
      { name: 'Oshogatsu (Tahun Baru Jepun)', icon: '⛩️', desc: 'Kunjungan kuil Hatsumode, ramalan Omikuji dan sampul Otoshidama!' },
      { name: 'Musim Sakura Hanami', icon: '🌸', desc: 'Berkelah di bawah bunga sakura mekar bersama rakan.' },
      { name: 'Matsuri Musim Panas & Bunga Api', icon: '🎆', desc: 'Memakai Yukata, makan Takoyaki dan menonton bunga api tepi sungai.' },
      { name: 'Musim Luruh Momiji', icon: '🍁', desc: 'Mengembara menyaksikan daun maple merah menyala.' }
    ],
    cultureActivities: [
      { id: 'jp_konbini', title: 'Snek Tengah Malam Konbini', icon: '🍙', desc: 'Beli onigiri salmon, ayam goreng & puding matcha di 7-Eleven.', cost: 1100, effects: { happiness: 10, adaptation: 8 } },
      { id: 'jp_onsen', title: 'Percutian Onsen Hakone', icon: '♨️', desc: 'Berendam di kolam air panas mineral dan bersantai memakai Yukata.', cost: 16000, effects: { health: 12, happiness: 15, adaptation: 11 } },
      { id: 'jp_izakaya', title: 'Makan Malam di Lorong Izakaya', icon: '🍢', desc: 'Yakitori panas, ramen dan suasana lorong tanglung klasik.', cost: 4500, effects: { happiness: 12, health: -2, adaptation: 10 } },
      { id: 'jp_lang', title: 'Belajar Bahasa Jepun & Keigo', icon: '🈶', desc: 'Berlatih tulisan Kanji dan bahasa sopan harian.', cost: 6000, effects: { smarts: 5, adaptation: 16 } },
      { id: 'jp_shinkansen', title: 'Lawatan Shinkansen ke Kyoto', icon: '🚄', desc: 'Naik kereta api laju ke hutan buluh Arashiyama & kuil bersejarah.', cost: 28000, effects: { happiness: 16, smarts: 2, adaptation: 12 } }
    ],
    jobs: [
      { id: 'jp_konbini_staff', title: 'Pekerja Konbini (Baito)', icon: '🏪', minAge: 18, reqDegree: false, salary: 2800000, desc: 'Layanan pelanggan pantas dan serba kemas.' },
      { id: 'jp_ramen', title: 'Perantis Kedai Ramen', icon: '🍜', minAge: 18, reqDegree: false, salary: 3400000, desc: 'Mereneh sup ramen berkrim 18 jam.' },
      { id: 'jp_alt', title: 'Guru Bahasa Inggeris / Melayu', icon: '📝', minAge: 21, reqDegree: true, salary: 3800000, desc: 'Mengajar kelas ceria di sekolah Jepun.' },
      { id: 'jp_salaryman', title: 'Eksekutif Korporat (Marunouchi)', icon: '💼', minAge: 22, reqDegree: true, salary: 6200000, desc: 'Kerjaya stabil di syarikat besar Tokyo.' },
      { id: 'jp_gamedev', title: 'Jurutera Permainan / Robotik', icon: '🎮', minAge: 22, reqDegree: true, reqSmarts: 65, salary: 8800000, desc: 'Mencipta permainan video & robotik terkenal di Shibuya.' },
      { id: 'jp_architect', title: 'Arkitek Bandar', icon: '🏯', minAge: 23, reqDegree: true, reqSmarts: 70, salary: 9600000, desc: 'Menggabungkan reka bentuk minimalis & kalis gempa.' }
    ],
    assets: {
      vehicles: [
        { id: 'jp_mamachari', name: 'Basikal Elektrik Mamachari', icon: '🚲', price: 130000, upkeep: 12000, happiness: 7 },
        { id: 'jp_kei', name: 'Kereta Kei Honda N-Box', icon: '🚐', price: 1950000, upkeep: 220000, happiness: 14 },
        { id: 'jp_gtr', name: 'Nissan Skyline / GR Supra', icon: '🏎️', price: 7800000, upkeep: 580000, happiness: 26 }
      ],
      properties: [
        { id: 'jp_1k', name: 'Apartmen Moden 1LDK Tokyo', icon: '🏢', price: 38000000, upkeep: 520000, happiness: 16 },
        { id: 'jp_machiya', name: 'Rumah Tradisional Kyoto Machiya', icon: '🏮', price: 72000000, upkeep: 880000, happiness: 24 },
        { id: 'jp_minato', name: 'Penthouse Menara Minato-ku', icon: '🗼', price: 210000000, upkeep: 2400000, happiness: 35 }
      ]
    }
  },

  GB: {
    id: 'GB',
    name: 'United Kingdom',
    demonym: 'British',
    flag: '🇬🇧',
    currency: { code: 'GBP', symbol: '£', decimals: 0 },
    usdRate: 0.78,
    theme: { primary: '#c8102e', secondary: '#012169', accent: '#ffffff' },
    tagline: 'Hujan renyai, rawatan percuma NHS, bola sepak Liga Perdana & universiti bersejarah.',
    highlights: ['Rawatan Percuma NHS', 'GCSE & A-Levels', 'Sunday Roast & Teh', 'Liga Perdana Inggeris'],
    healthcare: { type: 'NHS (Percuma)', doctorCost: 0, privateCost: 140, desc: 'Rawatan klinik & hospital percuma di bawah sistem NHS.' },
    taxRate: 0.25,
    retirementScheme: 'Pencen Tempat Kerja / ISA',
    lifeExpectancy: 81,
    costOfLivingIndex: 1.0,
    visaFeeUsd: 1100,
    flightBaseUsd: 820,
    closeCultures: ['AU', 'US'],
    cities: ['London', 'Manchester', 'Edinburgh', 'Bristol', 'Birmingham', 'Oxford', 'Liverpool', 'Leeds'],
    slang: ['mate', 'cheeky', 'innit', 'brilliant', 'cuppa', 'sorted', 'proper'],
    heritages: [
      { id: 'gb_local', label: 'British' },
      { id: 'gb_asian', label: 'British-Asia' }
    ],
    names: {
      gb_local: {
        male: ['Oliver', 'George', 'Arthur', 'Harry', 'Callum', 'Jack', 'Alfie', 'Liam', 'Theo', 'Charlie'],
        female: ['Olivia', 'Amelia', 'Isla', 'Freya', 'Poppy', 'Charlotte', 'Grace', 'Sophie', 'Emily', 'Lily'],
        last: ['Smith', 'Jones', 'Taylor', 'Williams', 'Brown', 'Davies', 'Evans', 'Wilson', 'Clarke', 'Wright']
      },
      gb_asian: {
        male: ['Zayn', 'Aarav', 'Tariq', 'Rohan', 'Imran', 'Dev', 'Kieran'],
        female: ['Amina', 'Zara', 'Anaya', 'Maya', 'Sana', 'Priya', 'Nadia'],
        last: ['Patel', 'Khan', 'Ahmed', 'Singh', 'Hussain', 'Shah', 'Begum']
      }
    },
    education: {
      preschool: { name: 'Reception', startAge: 4 },
      primary: { name: 'Sekolah Rendah UK', startAge: 5, examAge: 11, examName: 'SATs / 11+' },
      secondary: { name: 'Sekolah Menengah UK', startAge: 11, examAge: 16, examName: 'GCSE' },
      preU: { name: 'Sixth Form (A-Levels)', startAge: 16, duration: 2 },
      universities: ['Universiti Oxford', 'Universiti Cambridge', 'Imperial College London', 'UCL', 'Universiti Manchester', 'Universiti Edinburgh'],
      uniTuitionAnnual: 9250,
      uniDuration: 3
    },
    festivals: [
      { name: 'Malam Bonfire (5 Nov)', icon: '🎆', desc: 'Unggun api meriah dan pertunjukan bunga api di malam dingin.' },
      { name: 'Krismas & Boxing Day', icon: '🎄', desc: 'Cuti musim sejuk dan perlawanan bola sepak Boxing Day.' },
      { name: 'Cuti Musim Panas Bank Holiday', icon: '⛱️', desc: 'Seluruh penduduk keluar berkelah di taman sebaik matahari muncul!' }
    ],
    cultureActivities: [
      { id: 'gb_pub', title: 'Kuiz Trivia & Sunday Roast', icon: '🍽️', desc: 'Puding Yorkshire, sos gravy dan pertandingan kuiz hujung minggu.', cost: 28, effects: { happiness: 12, adaptation: 11 } },
      { id: 'gb_football', title: 'Tonton Bola Sepak Liga Perdana', icon: '⚽', desc: 'Bersorak di stadium bersama ribuan penyokong setia.', cost: 65, effects: { happiness: 14, adaptation: 10 } },
      { id: 'gb_tea', title: 'Minum Petang Teh & Skon', icon: '🫖', desc: 'Nikmati skon hangat dengan krim dan jem strawberi.', cost: 34, effects: { happiness: 10, adaptation: 9 } },
      { id: 'gb_museum', title: 'Lawatan Muzium Percuma London', icon: '🏛️', desc: 'Terokai British Museum dan pelajari adab beratur British.', cost: 10, effects: { smarts: 5, adaptation: 14 } },
      { id: 'gb_fishchips', title: 'Fish & Chips Tepi Pantai', icon: '🍟', desc: 'Garam, cuka dan elak burung camar nakal di Brighton.', cost: 16, effects: { happiness: 10, health: -1, adaptation: 8 } }
    ],
    jobs: [
      { id: 'gb_barista', title: 'Penyelia Kafe High Street', icon: '☕', minAge: 18, reqDegree: false, salary: 25500, desc: 'Menghidang kopi panas di pagi hujan.' },
      { id: 'gb_trades', title: 'Juruteknik Elektrik', icon: '🔧', minAge: 18, reqDegree: false, salary: 42000, desc: 'Kemahiran tinggi yang sentiasa diperlukan.' },
      { id: 'gb_nhs', title: 'Doktor NHS / Pakar Klinikal', icon: '🩺', minAge: 23, reqDegree: true, reqSmarts: 72, salary: 64000, desc: 'Tunjang kesihatan awam United Kingdom.' },
      { id: 'gb_swe', title: 'Jurutera Perisian (Shoreditch)', icon: '💻', minAge: 21, reqDegree: true, salary: 68000, desc: 'Membangunkan syarikat fintech & AI UK.' },
      { id: 'gb_canary', title: 'Pegawai Bank Pelaburan (Canary Wharf)', icon: '🏦', minAge: 21, reqDegree: true, reqSmarts: 70, salary: 95000, desc: 'Kewangan pantas di pusat kewangan London.' },
      { id: 'gb_barrister', title: 'Peguam Cara / Barrister', icon: '⚖️', minAge: 22, reqDegree: true, reqSmarts: 72, salary: 82000, desc: 'Berhujah di mahkamah bersejarah British.' }
    ],
    assets: {
      vehicles: [
        { id: 'gb_mini', name: 'MINI Cooper', icon: '🚗', price: 24000, upkeep: 2200, happiness: 14 },
        { id: 'gb_range', name: 'Range Rover Evoque', icon: '🚙', price: 48000, upkeep: 4600, happiness: 22 },
        { id: 'gb_aston', name: 'Aston Martin Vantage', icon: '🏎️', price: 165000, upkeep: 12000, happiness: 32 }
      ],
      properties: [
        { id: 'gb_flat', name: 'Flat London Zon 3', icon: '🏢', price: 380000, upkeep: 5200, happiness: 16 },
        { id: 'gb_terrace', name: 'Rumah Teres Victoria', icon: '🏘️', price: 520000, upkeep: 6800, happiness: 22 },
        { id: 'gb_cotswolds', name: 'Rumah Agam Batu Cotswolds', icon: '🏡', price: 1450000, upkeep: 16000, happiness: 34 }
      ]
    }
  },

  US: {
    id: 'US',
    name: 'Amerika Syarikat',
    demonym: 'Amerika',
    flag: '🇺🇸',
    currency: { code: 'USD', symbol: '$', decimals: 0 },
    usdRate: 1.0,
    theme: { primary: '#b22234', secondary: '#0a3161', accent: '#ffffff' },
    tagline: 'Impian besar, gaji Silicon Valley tinggi, jelajah jalan raya & jamuan Thanksgiving.',
    highlights: ['Gaji Teknologi Tinggi', 'SAT & Universiti Ivy', 'Thanksgiving & 4 Julai', 'Kesihatan Swasta'],
    healthcare: { type: 'Insurans Swasta / Kopay', doctorCost: 160, privateCost: 850, desc: 'Rawatan canggih, namun bil hospital agak tinggi.' },
    taxRate: 0.24,
    retirementScheme: '401(k) & Roth IRA',
    lifeExpectancy: 79,
    costOfLivingIndex: 1.12,
    visaFeeUsd: 1200,
    flightBaseUsd: 980,
    closeCultures: ['GB', 'AU'],
    cities: ['New York City', 'Los Angeles', 'Austin', 'San Francisco', 'Chicago', 'Seattle', 'Miami', 'Boston'],
    slang: ['awesome', 'y\'all', 'no cap', 'bro', 'lit', 'totally'],
    heritages: [
      { id: 'us_general', label: 'Amerika' },
      { id: 'us_asian', label: 'Asia-Amerika' },
      { id: 'us_hispanic', label: 'Hispanik-Amerika' }
    ],
    names: {
      us_general: {
        male: ['Liam', 'Noah', 'Ethan', 'Mason', 'Lucas', 'Caleb', 'Jordan', 'Tyler', 'Dylan'],
        female: ['Emma', 'Ava', 'Sophia', 'Mia', 'Harper', 'Madison', 'Chloe', 'Avery', 'Zoe'],
        last: ['Johnson', 'Miller', 'Davis', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin']
      },
      us_asian: {
        male: ['Kevin', 'Justin', 'Daniel', 'Brandon', 'Eric', 'Andrew', 'Jason'],
        female: ['Grace', 'Emily', 'Michelle', 'Jessica', 'Hannah', 'Tiffany', 'Claire'],
        last: ['Chen', 'Kim', 'Nguyen', 'Patel', 'Wang', 'Park', 'Lin']
      },
      us_hispanic: {
        male: ['Mateo', 'Diego', 'Carlos', 'Luis', 'Sebastian', 'Gabriel', 'Miguel'],
        female: ['Sofia', 'Camila', 'Valentina', 'Lucia', 'Elena', 'Isabella', 'Maya'],
        last: ['Garcia', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gomez', 'Rivera']
      }
    },
    education: {
      preschool: { name: 'Prasekolah', startAge: 4 },
      primary: { name: 'Elementary School', startAge: 5, examAge: 11, examName: 'Tamat Gred 5' },
      secondary: { name: 'Middle & High School', startAge: 11, examAge: 18, examName: 'SAT & Diploma Sekolah Menengah' },
      preU: { name: 'Kolej Komuniti', startAge: 18, duration: 2 },
      universities: ['Universiti Stanford', 'MIT', 'UC Berkeley', 'NYU', 'UT Austin', 'Universiti Harvard'],
      uniTuitionAnnual: 24000,
      uniDuration: 4
    },
    festivals: [
      { name: 'Jamuan Thanksgiving', icon: '🦃', desc: 'Ayam belanda panggang, pai labu dan jualan murah Black Friday!' },
      { name: 'Hari Kemerdekaan 4 Julai', icon: '🎆', desc: 'BBQ di laman rumah dan bunga api meriah.' },
      { name: 'Malam Halloween', icon: '🎃', desc: 'Kostum kreatif, ukiran labu dan gula-gula.' },
      { name: 'Ahad Super Bowl', icon: '🏈', desc: 'Sayap ayam pedas dan konsert separuh masa gergasi.' }
    ],
    cultureActivities: [
      { id: 'us_bbq', title: 'BBQ Asap Texas', icon: '🍖', desc: 'Daging brisket lembut, mac & cheese serta tip 20%.', cost: 48, effects: { happiness: 12, health: -2, adaptation: 10 } },
      { id: 'us_roadtrip', title: 'Jelajah Taman Negara', icon: '🏜️', desc: 'Memandu lebuh raya luas ke Yosemite atau Grand Canyon.', cost: 340, effects: { happiness: 16, health: 5, adaptation: 12 } },
      { id: 'us_game', title: 'Malam Stadium NBA / Besbol', icon: '🏀', desc: 'Suasana stadium gamat dan sorakan saat akhir.', cost: 95, effects: { happiness: 14, adaptation: 10 } },
      { id: 'us_diner', title: 'Penkek Diner Klasik 24 Jam', icon: '🥞', desc: 'Kopi tanpa had, sirap mapel dan perbualan mesra.', cost: 26, effects: { happiness: 9, adaptation: 8 } },
      { id: 'us_network', title: 'Acara Jaringan Startup', icon: '🚀', desc: 'Bentangkan idea bisnes bersama pengasas bercita-cita tinggi.', cost: 35, effects: { smarts: 4, adaptation: 14 } }
    ],
    jobs: [
      { id: 'us_server', title: 'Pelayan Diner (Dengan Tip!)', icon: '🍽️', minAge: 18, reqDegree: false, salary: 38000, desc: 'Kerja pantas dengan tip lumayan.' },
      { id: 'us_realtor', title: 'Ejen Hartanah', icon: '🏡', minAge: 19, reqDegree: false, salary: 68000, desc: 'Mengurus jualan rumah & komisen tinggi.' },
      { id: 'us_swe', title: 'Jurutera Perisian Big Tech', icon: '💻', minAge: 22, reqDegree: true, reqSmarts: 65, salary: 148000, desc: 'Saham syarikat & skala Silicon Valley.' },
      { id: 'us_doctor', title: 'Doktor Pakar', icon: '🩺', minAge: 25, reqDegree: true, reqSmarts: 80, salary: 235000, desc: 'Kerjaya perubatan elit bergaji tinggi.' },
      { id: 'us_finance', title: 'Penganalisis Wall Street', icon: '📈', minAge: 22, reqDegree: true, reqSmarts: 70, salary: 135000, desc: 'Bonus besar di pusat kewangan Manhattan.' },
      { id: 'us_creator', title: 'Penerbit Digital / Hollywood', icon: '🎬', minAge: 19, reqDegree: false, salary: 82000, desc: 'Menghasilkan rancangan tular & filem.' }
    ],
    assets: {
      vehicles: [
        { id: 'us_f150', name: 'Trak Pikap Ford F-150', icon: '🛻', price: 46000, upkeep: 3800, happiness: 16 },
        { id: 'us_tesla', name: 'Tesla Model Y', icon: '⚡', price: 49000, upkeep: 2600, happiness: 18 },
        { id: 'us_porsche', name: 'Porsche 911 Carrera', icon: '🏎️', price: 135000, upkeep: 9500, happiness: 30 }
      ],
      properties: [
        { id: 'us_condo', name: 'Apartmen Loft Pusat Bandar', icon: '🏢', price: 460000, upkeep: 8500, happiness: 17 },
        { id: 'us_suburb', name: 'Rumah Pinggir Bandar 4-Bilik', icon: '🏡', price: 680000, upkeep: 11000, happiness: 23 },
        { id: 'us_malibu', name: 'Vila Tepi Laut California', icon: '🏖️', price: 2900000, upkeep: 34000, happiness: 36 }
      ]
    }
  },

  AU: {
    id: 'AU',
    name: 'Australia',
    demonym: 'Australia',
    flag: '🇦🇺',
    currency: { code: 'AUD', symbol: 'A$', decimals: 0 },
    usdRate: 1.53,
    theme: { primary: '#00843d', secondary: '#012169', accent: '#ffcd00' },
    tagline: 'Gaya hidup pantai santai — Kopi Flat White Melbourne, BBQ pantai & gaji lumayan.',
    highlights: ['Kopi Flat White', 'Medicare & Super', 'BBQ Pantai', 'Keseimbangan Kerja-Hidup'],
    healthcare: { type: 'Medicare (Awam)', doctorCost: 15, privateCost: 120, desc: 'Klinik GP subsidi dan hospital awam cemerlang.' },
    taxRate: 0.24,
    retirementScheme: 'Superannuation (11.5%)',
    lifeExpectancy: 83,
    costOfLivingIndex: 1.02,
    visaFeeUsd: 950,
    flightBaseUsd: 540,
    closeCultures: ['GB', 'US', 'MY'],
    cities: ['Melbourne', 'Sydney', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Canberra'],
    slang: ['mate', 'arvo', 'no worries', 'servo', 'brekkie', 'heaps good'],
    heritages: [
      { id: 'au_local', label: 'Australia' },
      { id: 'au_asian', label: 'Asia-Australia' }
    ],
    names: {
      au_local: {
        male: ['Lachlan', 'Jack', 'Liam', 'Cooper', 'Noah', 'Toby', 'Mitchell', 'Callum', 'Brodie'],
        female: ['Charlotte', 'Matilda', 'Chloe', 'Ruby', 'Grace', 'Sienna', 'Zoe', 'Harper', 'Willow'],
        last: ['Smith', 'Wilson', 'Taylor', 'Brown', 'Mitchell', 'Kelly', 'Walker', 'Campbell', 'Murphy']
      },
      au_asian: {
        male: ['Ethan', 'Ryan', 'Daniel', 'Aaron', 'Jayden', 'Nathan', 'Alex'],
        female: ['Chloe', 'Sophie', 'Audrey', 'Jasmine', 'Natalie', 'Grace', 'Maya'],
        last: ['Nguyen', 'Tan', 'Chen', 'Lim', 'Wong', 'Tran', 'Singh']
      }
    },
    education: {
      preschool: { name: 'Kindy / Prep', startAge: 5 },
      primary: { name: 'Sekolah Rendah', startAge: 6, examAge: 12, examName: 'NAPLAN' },
      secondary: { name: 'Sekolah Menengah', startAge: 12, examAge: 18, examName: 'ATAR / VCE / HSC' },
      preU: { name: 'Diploma Vokasional TAFE', startAge: 18, duration: 2 },
      universities: ['Universiti Melbourne', 'Universiti Sydney', 'UNSW', 'Universiti Queensland', 'Universiti Monash'],
      uniTuitionAnnual: 11000,
      uniDuration: 3
    },
    festivals: [
      { name: 'Krismas Musim Panas di Pantai', icon: '🎅', desc: 'Udang bakar BBQ, kriket pantai dan matahari terik Disember!' },
      { name: 'Hujung Minggu Panjang Pantai', icon: '🏖️', desc: 'Perkhemahan pesisir dan meluncur ombak musim panas.' },
      { name: 'Hari Akhir AFL Grand Final', icon: '🏉', desc: 'Cuti umum khas untuk perlawanan akhir bola sepak Aussie!' }
    ],
    cultureActivities: [
      { id: 'au_bunnings', title: 'Sosej Panggang Bunnings', icon: '🌭', desc: 'Roti sosej bawang goreng — tradisi wajib hujung minggu Aussie.', cost: 8, effects: { happiness: 11, adaptation: 12 } },
      { id: 'au_coffee', title: 'Sarapan Kafe Lorong Melbourne', icon: '☕', desc: 'Roti avokado & kopi Flat White di lorong seni grafiti.', cost: 32, effects: { happiness: 11, adaptation: 10 } },
      { id: 'au_surf', title: 'Luncur Ombak di Bondi / Byron Bay', icon: '🏄', desc: 'Menawan ombak pagi di bawah langit biru cerah.', cost: 45, effects: { health: 12, happiness: 13, adaptation: 10 } },
      { id: 'au_slang', title: 'Latih Slanga Santai Aussie', icon: '🦘', desc: 'Fahami "arvo", "brekkie", "macca\'s" dan "no worries mate".', cost: 15, effects: { smarts: 2, adaptation: 15 } }
    ],
    jobs: [
      { id: 'au_barista', title: 'Barista Kopi Spesialti', icon: '☕', minAge: 18, reqDegree: false, salary: 58000, desc: 'Gaji minimum tinggi & bayaran hujung minggu lumayan!' },
      { id: 'au_fifo', title: 'Juruteknik Lombong FIFO (WA)', icon: '⛏️', minAge: 19, reqDegree: false, salary: 125000, desc: 'Syif terbang masuk-keluar Pilbara dengan gaji lumayan.' },
      { id: 'au_nurse', title: 'Jururawat Berdaftar (Medicare)', icon: '🩺', minAge: 21, reqDegree: true, salary: 86000, desc: 'Kerjaya kesihatan berpermintaan tinggi.' },
      { id: 'au_swe', title: 'Jurutera Perisian (Sydney/Melb)', icon: '💻', minAge: 21, reqDegree: true, salary: 122000, desc: 'Membina teknologi global seperti Canva & Atlassian.' },
      { id: 'au_architect', title: 'Jurutera Awam & Pesisir', icon: '🏗️', minAge: 22, reqDegree: true, reqSmarts: 65, salary: 115000, desc: 'Mereka jambatan, rel dan bandar hijau.' }
    ],
    assets: {
      vehicles: [
        { id: 'au_hilux', name: 'Trak Toyota HiLux Ute', icon: '🛻', price: 54000, upkeep: 4200, happiness: 16 },
        { id: 'au_subaru', name: 'Subaru Outback AWD', icon: '🚙', price: 48000, upkeep: 3600, happiness: 15 },
        { id: 'au_bmw', name: 'BMW M3 Touring', icon: '🏎️', price: 175000, upkeep: 11000, happiness: 28 }
      ],
      properties: [
        { id: 'au_unit', name: 'Apartmen Pinggir Bandar', icon: '🏢', price: 650000, upkeep: 8200, happiness: 17 },
        { id: 'au_house', name: 'Rumah Bertaman Luas', icon: '🏡', price: 1120000, upkeep: 12500, happiness: 24 },
        { id: 'au_beach', name: 'Rumah Tepi Pantai', icon: '🏖️', price: 2800000, upkeep: 26000, happiness: 35 }
      ]
    }
  },

  KR: {
    id: 'KR',
    name: 'Korea Selatan',
    demonym: 'Korea',
    flag: '🇰🇷',
    currency: { code: 'KRW', symbol: '₩', decimals: 0 },
    usdRate: 1380,
    theme: { primary: '#cd2e3a', secondary: '#0047a0', accent: '#ffffff' },
    tagline: 'Korea Dinamik — Malam neon Seoul, K-BBQ, berkelah Sungai Han, Suneung & budaya K-Pop.',
    highlights: ['K-BBQ & Ayam Goreng', 'Suneung & Universiti SKY', 'PC Bang & Noraebang', 'Chuseok & Seollal'],
    healthcare: { type: 'NHIS Kesihatan Sejagat', doctorCost: 12000, privateCost: 65000, desc: 'Hospital berteknologi tinggi dan klinik pantas.' },
    taxRate: 0.21,
    retirementScheme: 'Pencen Nasional (NPS)',
    lifeExpectancy: 84,
    costOfLivingIndex: 0.85,
    visaFeeUsd: 520,
    flightBaseUsd: 520,
    closeCultures: ['JP'],
    cities: ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Pulau Jeju', 'Suwon'],
    slang: ['daebak', 'fighting!', 'ppalli-ppalli', 'heol', 'jjang', 'kamsahamnida'],
    heritages: [{ id: 'kr_local', label: 'Korea' }],
    names: {
      kr_local: {
        male: ['Minjun', 'Seojun', 'Jihoon', 'Dohyun', 'Hyunwoo', 'Jimin', 'Taehyung', 'Junseo', 'Yejun'],
        female: ['Seoyeon', 'Jiyeon', 'Haerin', 'Sujin', 'Minji', 'Yuna', 'Chaewon', 'Jisoo', 'Eunbi'],
        last: ['Kim', 'Lee', 'Park', 'Choi', 'Jung', 'Kang', 'Cho', 'Yoon', 'Jang', 'Lim']
      }
    },
    education: {
      preschool: { name: 'Yuchiwon', startAge: 5 },
      primary: { name: 'Chodeung Hakgyo', startAge: 7, examAge: 12, examName: 'Tamat Sekolah Rendah' },
      secondary: { name: 'Jung & Godeung Hakgyo', startAge: 13, examAge: 18, examName: 'Suneung (CSAT)' },
      preU: { name: 'Kolej Junior', startAge: 18, duration: 2 },
      universities: ['Universiti Kebangsaan Seoul (SNU)', 'KAIST', 'Universiti Yonsei', 'Universiti Korea', 'Universiti Sungkyunkwan'],
      uniTuitionAnnual: 7500000,
      uniDuration: 4
    },
    festivals: [
      { name: 'Seollal (Tahun Baru Lunar)', icon: '🧧', desc: 'Memakai Hanbok, makan sup Tteokguk dan terima Sebaetdon!' },
      { name: 'Pesta Menuai Chuseok', icon: '🌕', desc: 'Membuat kuih Songpyeon dan berkumpul bersama keluarga besar.' },
      { name: 'Bunga Api Sungai Han Seoul', icon: '🎆', desc: 'Sungai Han Yeouido bermandikan cahaya bunga api musim luruh.' }
    ],
    cultureActivities: [
      { id: 'kr_chimaek', title: 'Berkelah Ayam Goreng Sungai Han', icon: '🍗', desc: 'Pesan ayam goreng rangup dihantar terus ke tikar Sungai Han!', cost: 28000, effects: { happiness: 14, adaptation: 11 } },
      { id: 'kr_bbq', title: 'K-BBQ Hongdae & Noraebang', icon: '🥩', desc: 'Makan panggang Korea diikuti 2 jam karaoke bilik syiling.', cost: 45000, effects: { happiness: 14, health: -2, adaptation: 11 } },
      { id: 'kr_pcbang', title: 'Sesi Gaming di PC Bang', icon: '🖥️', desc: 'Main perlawanan ranked sambil pesan ramyeon panas ke meja.', cost: 14000, effects: { happiness: 10, smarts: 2, adaptation: 8 } },
      { id: 'kr_hangul', title: 'Kelas Bahasa Korea & Hangul', icon: '🇰🇷', desc: 'Kuasai tulisan Hangul dan bahasa sopan Jondaetmal.', cost: 50000, effects: { smarts: 5, adaptation: 16 } },
      { id: 'kr_jeju', title: 'Percutian Pulau Jeju', icon: '🍊', desc: 'Ladang limau tangerine, pantai gunung berapi dan mendaki Hallasan.', cost: 320000, effects: { happiness: 16, health: 7, adaptation: 12 } }
    ],
    jobs: [
      { id: 'kr_cafe', title: 'Barista Kafe Seongsu-dong', icon: '☕', minAge: 18, reqDegree: false, salary: 32000000, desc: 'Menyediakan Iced Americano walaupun musim salji.' },
      { id: 'kr_esports', title: 'Penerbit E-Sukan / Penstrim', icon: '🎮', minAge: 18, reqDegree: false, salary: 48000000, desc: 'Berkembang maju di ibu kota e-sukan dunia.' },
      { id: 'kr_chaebol', title: 'Pakar Konglomerat Teknologi', icon: '📱', minAge: 22, reqDegree: true, reqSmarts: 65, salary: 78000000, desc: 'Kerjaya berprestij di syarikat gergasi Gangnam / Suwon.' },
      { id: 'kr_kpop', title: 'Pengarah Kreatif K-Hiburan', icon: '🎤', minAge: 21, reqDegree: false, salary: 72000000, desc: 'Mencipta konsep muzik & jelajah dunia.' },
      { id: 'kr_doctor', title: 'Doktor Pakar Gangnam', icon: '🩺', minAge: 25, reqDegree: true, reqSmarts: 78, salary: 145000000, desc: 'Kepakaran perubatan & dermatologi terkemuka.' }
    ],
    assets: {
      vehicles: [
        { id: 'kr_avante', name: 'Hyundai Avante / Elantra', icon: '🚗', price: 24000000, upkeep: 2400000, happiness: 14 },
        { id: 'kr_ioniq', name: 'Hyundai IONIQ 5 EV', icon: '⚡', price: 54000000, upkeep: 3200000, happiness: 20 },
        { id: 'kr_genesis', name: 'Genesis G90 Eksekutif', icon: '🚘', price: 110000000, upkeep: 7500000, happiness: 28 }
      ],
      properties: [
        { id: 'kr_officetel', name: 'Officetel Moden Seoul', icon: '🏢', price: 320000000, upkeep: 4800000, happiness: 16 },
        { id: 'kr_apt', name: 'Apartmen Keluarga Mapo-gu', icon: '🏙️', price: 980000000, upkeep: 11000000, happiness: 25 },
        { id: 'kr_gangnam', name: 'Penthouse Langit Gangnam', icon: '🌆', price: 2800000000, upkeep: 28000000, happiness: 36 }
      ]
    }
  },

  ID: {
    id: 'ID',
    name: 'Indonesia',
    demonym: 'Indonesia',
    flag: '🇮🇩',
    currency: { code: 'IDR', symbol: 'Rp ', decimals: 0 },
    usdRate: 15800,
    theme: { primary: '#ce1126', secondary: '#7f1d1d', accent: '#ffffff' },
    tagline: 'Zamrud Khatulistiwa — Nasi Goreng, pesona Bali, Mudik Lebaran & kemesraan gotong-royong.',
    highlights: ['Warung & Nasi Goreng', 'Mudik & Bonus THR', 'Bali & Yogyakarta', 'Semangat Gotong-Royong'],
    healthcare: { type: 'BPJS Kesehatan', doctorCost: 50000, privateCost: 450000, desc: 'Puskesmas mampu milik & hospital swasta moden.' },
    taxRate: 0.15,
    retirementScheme: 'BPJS Ketenagakerjaan',
    lifeExpectancy: 73,
    costOfLivingIndex: 0.34,
    visaFeeUsd: 380,
    flightBaseUsd: 240,
    closeCultures: ['MY', 'SG', 'TH'],
    cities: ['Jakarta', 'Bali (Denpasar)', 'Bandung', 'Surabaya', 'Yogyakarta', 'Medan', 'Makassar'],
    slang: ['santuy', 'mantap', 'gaspol', 'nongkrong', 'wkwk', 'siap bos'],
    heritages: [
      { id: 'id_general', label: 'Indonesia (Jawa/Sunda/Melayu)' },
      { id: 'id_chinese', label: 'Tionghoa-Indonesia' },
      { id: 'id_bali', label: 'Bali' }
    ],
    names: {
      id_general: {
        male: ['Rizky', 'Budi', 'Dimas', 'Fajar', 'Bagas', 'Aditya', 'Reza', 'Arif', 'Satria'],
        female: ['Putri', 'Siti', 'Ayu', 'Nadia', 'Rani', 'Dewi', 'Fitri', 'Laras', 'Nabila'],
        last: ['Pratama', 'Saputra', 'Wijaya', 'Santoso', 'Hidayat', 'Nugroho', 'Kusuma', 'Setiawan']
      },
      id_chinese: {
        male: ['Kevin', 'Hendra', 'Steven', 'Vincent', 'William', 'Daniel'],
        female: ['Jessica', 'Michelle', 'Felicia', 'Stephanie', 'Clarissa', 'Cindy'],
        last: ['Tanuwijaya', 'Salim', 'Hartono', 'Gunawan', 'Halim', 'Tanjung']
      },
      id_bali: {
        male: ['I Made', 'I Wayan', 'I Putu', 'I Ketut', 'Gede', 'Komang'],
        female: ['Ni Luh', 'Ni Putu', 'Ni Made', 'Ni Komang', 'Ayu'],
        last: ['Suardana', 'Mahendra', 'Wiguna', 'Surya', 'Darmawan', 'Yasa']
      }
    },
    education: {
      preschool: { name: 'TK (Taman Kanak-Kanak)', startAge: 5 },
      primary: { name: 'SD (Sekolah Dasar)', startAge: 6, examAge: 12, examName: 'Ujian SD' },
      secondary: { name: 'SMP & SMA', startAge: 12, examAge: 18, examName: 'SNBT / UTBK' },
      preU: { name: 'Politeknik / Diploma', startAge: 18, duration: 2 },
      universities: ['Universitas Indonesia (UI)', 'ITB Bandung', 'UGM Yogyakarta', 'Binus University', 'ITS Surabaya'],
      uniTuitionAnnual: 14000000,
      uniDuration: 4
    },
    festivals: [
      { name: 'Idul Fitri & Mudik Lebaran', icon: '🌙', desc: 'Ketupat, Opor Ayam, bonus THR dan pulang kampung merentasi Nusantara!' },
      { name: 'Hari Kemerdekaan (17 Agustus)', icon: '🇮🇩', desc: 'Lomba Panjat Pinang, lari guni dan bendera merah putih di mana-mana.' },
      { name: 'Hari Nyepi di Bali', icon: '🕯️', desc: 'Perarakan Ogoh-Ogoh diikuti 24 jam ketenangan penuh di pulau.' }
    ],
    cultureActivities: [
      { id: 'id_warung', title: 'Nongkrong Warkop & Indomie', icon: '🍜', desc: 'Indomie Telur Kornet, Es Teh Manis & petikan gitar akustik malam.', cost: 40000, effects: { happiness: 11, adaptation: 10 } },
      { id: 'id_bali', title: 'Percutian Matahari Terbenam Bali', icon: '🏝️', desc: 'Saksikan senja keemasan Uluwatu sambil hirup kelapa muda segar.', cost: 1800000, effects: { happiness: 16, health: 6, adaptation: 11 } },
      { id: 'id_padang', title: 'Jamuan Nasi Padang', icon: '🍛', desc: 'Rendang, Ayam Pop, Sambal Hijau — pinggan bertingkat di meja!', cost: 85000, effects: { happiness: 12, adaptation: 9 } },
      { id: 'id_bahasa', title: 'Latih Bahasa Indonesia Harian', icon: '🗣️', desc: 'Kuasai perbualan santai Jakarta dan adab mesra Nusantara.', cost: 150000, effects: { smarts: 4, adaptation: 16 } }
    ],
    jobs: [
      { id: 'id_ojol', title: 'Rakan Ojek Online', icon: '🛵', minAge: 18, reqDegree: false, salary: 68000000, desc: 'Meredah jalan pintas kota berjaket hijau.' },
      { id: 'id_barista', title: 'Barista Kopi Susu Gula Aren', icon: '☕', minAge: 18, reqDegree: false, salary: 62000000, desc: 'Membancuh Es Kopi Susu kegemaran ramai.' },
      { id: 'id_swe', title: 'Jurutera Startup Teknologi (SCBD)', icon: '💻', minAge: 22, reqDegree: true, salary: 210000000, desc: 'Membina superapp Asia Tenggara.' },
      { id: 'id_hospitality', title: 'Pengurus Resort Bali', icon: '🏖️', minAge: 21, reqDegree: true, salary: 185000000, desc: 'Menerajui hospitaliti mewah tepi pantai.' },
      { id: 'id_finance', title: 'Pegawai Bank Korporat (Sudirman)', icon: '🏦', minAge: 22, reqDegree: true, reqSmarts: 65, salary: 245000000, desc: 'Urus niaga besar di segi tiga emas Jakarta.' }
    ],
    assets: {
      vehicles: [
        { id: 'id_vespa', name: 'Skuter Honda Vario / Vespa', icon: '🛵', price: 32000000, upkeep: 2500000, happiness: 10 },
        { id: 'id_avanza', name: 'MPV Keluarga Toyota Avanza', icon: '🚐', price: 265000000, upkeep: 16000000, happiness: 16 },
        { id: 'id_fortuner', name: 'Toyota Fortuner GR Sport', icon: '🚙', price: 680000000, upkeep: 38000000, happiness: 25 }
      ],
      properties: [
        { id: 'id_apt', name: 'Apartmen Jakarta Selatan', icon: '🏢', price: 850000000, upkeep: 18000000, happiness: 16 },
        { id: 'id_house', name: 'Rumah Kluster Bandung', icon: '🏡', price: 1650000000, upkeep: 28000000, happiness: 22 },
        { id: 'id_villa', name: 'Vila Peribadi Canggu Bali', icon: '🌴', price: 4800000000, upkeep: 65000000, happiness: 34 }
      ]
    }
  },

  TH: {
    id: 'TH',
    name: 'Thailand',
    demonym: 'Thailand',
    flag: '🇹🇭',
    currency: { code: 'THB', symbol: '฿', decimals: 0 },
    usdRate: 34.5,
    theme: { primary: '#a51931', secondary: '#2d2a4a', accent: '#ffffff' },
    tagline: 'Negara Senyuman — Makanan jalanan Bangkok, pesta air Songkran, Muay Thai & pulau tropika.',
    highlights: ['Pad Thai & Pasar Malam', 'Songkran & Loy Krathong', 'Muay Thai & Pulau', 'Gaya Hidup Sabai-Sabai'],
    healthcare: { type: 'Kad Emas / Hospital Swasta', doctorCost: 300, privateCost: 2200, desc: 'Klinik berpatutan dan hospital swasta Bangkok terkenal.' },
    taxRate: 0.15,
    retirementScheme: 'Dana Keselamatan Sosial (SSF)',
    lifeExpectancy: 79,
    costOfLivingIndex: 0.45,
    visaFeeUsd: 420,
    flightBaseUsd: 260,
    closeCultures: ['MY', 'SG', 'ID'],
    cities: ['Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya', 'Hat Yai', 'Khon Kaen', 'Krabi'],
    slang: ['sabai-sabai', 'aroi mak', 'mai pen rai', 'sawadee', 'su su!'],
    heritages: [
      { id: 'th_local', label: 'Thai' },
      { id: 'th_chinese', label: 'Thai-Cina' }
    ],
    names: {
      th_local: {
        male: ['Somchai', 'Nattapong', 'Kittisak', 'Arthit', 'Chaiwat', 'Prawit', 'Tanakorn', 'Wichai'],
        female: ['Ploy', 'Nattaya', 'Siriporn', 'Kanya', 'Mali', 'Pimchanok', 'Suda', 'Benjawan'],
        last: ['Charoenpura', 'Suwannapong', 'Srisai', 'Rattanakul', 'Boonmee', 'Wattana', 'Prasert']
      },
      th_chinese: {
        male: ['Win', 'Bright', 'Tor', 'Bank', 'Pete', 'Ken', 'Ton'],
        female: ['Baifern', 'Yaya', 'Fern', 'May', 'Mint', 'Bow', 'Nicha'],
        last: ['Tang', 'Lim', 'Chaiyaporn', 'Wongsuwan', 'Sae-Lim', 'Lert']
      }
    },
    education: {
      preschool: { name: 'Anuban (Tadika)', startAge: 5 },
      primary: { name: 'Prathom (Sekolah Rendah)', startAge: 6, examAge: 12, examName: 'O-NET Rendah' },
      secondary: { name: 'Matthayom (Sekolah Menengah)', startAge: 12, examAge: 18, examName: 'Ujian Universiti TCAS' },
      preU: { name: 'Kolej Vokasional', startAge: 18, duration: 2 },
      universities: ['Universiti Chulalongkorn', 'Universiti Mahidol', 'Universiti Thammasat', 'Universiti Chiang Mai'],
      uniTuitionAnnual: 48000,
      uniDuration: 4
    },
    festivals: [
      { name: 'Pesta Air Songkran', icon: '💦', desc: 'Tahun Baru Thai — pesta perang air meriah seluruh negara!' },
      { name: 'Pesta Tanglung Loy Krathong', icon: '🏮', desc: 'Melepaskan teratai berlilin di sungai di bawah bulan purnama.' },
      { name: 'Tanglung Langit Yi Peng', icon: '✨', desc: 'Ribuan tanglung bercahaya melayang ke langit malam Chiang Mai.' }
    ],
    cultureActivities: [
      { id: 'th_streetfood', title: 'Jelajah Makanan Malam Yaowarat', icon: '🍜', desc: 'Nikmati Pad Thai panas, Boat Noodles & Pulut Mangga.', cost: 280, effects: { happiness: 13, adaptation: 11 } },
      { id: 'th_muaythai', title: 'Kelas Latihan Muay Thai', icon: '🥊', desc: 'Berlatih tendangan & teknik bersama jurulatih Kru berpengalaman.', cost: 500, effects: { health: 13, looks: 4, happiness: 8, adaptation: 10 } },
      { id: 'th_island', title: 'Percutian Pulau Krabi / Phuket', icon: '🏝️', desc: 'Menaiki bot panjang merentasi teluk batu kapur biru jernih.', cost: 4800, effects: { happiness: 16, health: 5, adaptation: 10 } },
      { id: 'th_lang', title: 'Belajar Bahasa Thai & Adab Wai', icon: '🙏', desc: 'Kuasai ucapan sopan "khrap/kha" dan senyuman mesra.', cost: 400, effects: { smarts: 4, adaptation: 16 } }
    ],
    jobs: [
      { id: 'th_chef', title: 'Pemilik Gerai & Kafe Thai', icon: '🍛', minAge: 18, reqDegree: false, salary: 340000, desc: 'Menghidang Tom Yum & Teh Ais Thai legenda.' },
      { id: 'th_nomad', title: 'Nomad Digital / Ketua Kreatif', icon: '💻', minAge: 19, reqDegree: false, salary: 680000, desc: 'Bekerja dari kafe estetik Chiang Mai & Bangkok.' },
      { id: 'th_hotel', title: 'Pengarah Resort Mewah (Phuket)', icon: '🏖️', minAge: 22, reqDegree: true, salary: 960000, desc: 'Menerajui hospitaliti bertaraf dunia.' },
      { id: 'th_swe', title: 'Jurutera Teknologi Kanan (Sukhumvit)', icon: '🚀', minAge: 22, reqDegree: true, reqSmarts: 65, salary: 1250000, desc: 'Membina platform fintech di Bangkok.' }
    ],
    assets: {
      vehicles: [
        { id: 'th_scooter', name: 'Skuter Honda PCX 160', icon: '🛵', price: 95000, upkeep: 6500, happiness: 10 },
        { id: 'th_civic', name: 'Honda Civic RS', icon: '🚗', price: 1150000, upkeep: 58000, happiness: 17 },
        { id: 'th_porsche', name: 'Porsche Taycan', icon: '🏎️', price: 6500000, upkeep: 280000, happiness: 30 }
      ],
      properties: [
        { id: 'th_condo', name: 'Kondominium BTS Sukhumvit', icon: '🏙️', price: 4800000, upkeep: 65000, happiness: 19 },
        { id: 'th_chiangmai', name: 'Vila Taman Chiang Mai', icon: '🏡', price: 7900000, upkeep: 90000, happiness: 24 },
        { id: 'th_phuket', name: 'Vila Kolam Tepi Laut Phuket', icon: '🏝️', price: 28000000, upkeep: 320000, happiness: 36 }
      ]
    }
  },

  AE: {
    id: 'AE',
    name: 'UAE (Dubai)',
    demonym: 'UAE',
    flag: '🇦🇪',
    currency: { code: 'AED', symbol: 'AED ', decimals: 0 },
    usdRate: 3.67,
    theme: { primary: '#00732f', secondary: '#111827', accent: '#f59e0b' },
    tagline: 'Cita-cita bebas cukai — 0% cukai pendapatan, Teh Karak, safari gurun & kemewahan global.',
    highlights: ['0% Cukai Pendapatan!', 'Burj Khalifa & Marina', 'Shawarma & Teh Karak', 'Hab Golden Visa'],
    healthcare: { type: 'Insurans Kesihatan Majikan', doctorCost: 75, privateCost: 420, desc: 'Hospital serba moden dilindungi insurans wajib.' },
    taxRate: 0.0,
    retirementScheme: 'Ganjaran Tamat Perkhidmatan',
    lifeExpectancy: 80,
    costOfLivingIndex: 1.04,
    visaFeeUsd: 880,
    flightBaseUsd: 620,
    closeCultures: ['MY', 'GB'],
    cities: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ras Al Khaimah', 'Al Ain'],
    slang: ['yalla', 'habibi', 'insya-Allah', 'khalas', 'masya-Allah', 'wallah'],
    heritages: [
      { id: 'ae_emirati', label: 'Emirati' },
      { id: 'ae_expat', label: 'Ekspatriat Antarabangsa' }
    ],
    names: {
      ae_emirati: {
        male: ['Rashid', 'Hamdan', 'Omar', 'Khalid', 'Tariq', 'Zayed', 'Sultan', 'Mansoor'],
        female: ['Fatima', 'Mariam', 'Amna', 'Noora', 'Aisha', 'Latifa', 'Hessa', 'Reem'],
        last: ['Al Maktoum', 'Al Nahyan', 'Al Mansoori', 'Al Suwaidi', 'Al Dhaheri', 'Al Shamsi']
      },
      ae_expat: {
        male: ['Aarav', 'Adam', 'Daniel', 'Rami', 'Zain', 'Faris', 'Lucas'],
        female: ['Layla', 'Maya', 'Nadia', 'Priya', 'Sofia', 'Chloe', 'Yasmin'],
        last: ['Haddad', 'Khoury', 'Malik', 'Sharma', 'Reyes', 'Bennett']
      }
    },
    education: {
      preschool: { name: 'Tadika Antarabangsa', startAge: 4 },
      primary: { name: 'Sekolah Rendah Antarabangsa', startAge: 6, examAge: 12, examName: 'Checkpoint Rendah' },
      secondary: { name: 'Sekolah Menengah (IB / A-Level)', startAge: 12, examAge: 18, examName: 'Diploma IB / EmSAT' },
      preU: { name: 'Kolej Teknologi Tinggi', startAge: 18, duration: 2 },
      universities: ['NYU Abu Dhabi', 'Universiti Khalifa', 'Universiti Amerika Sharjah', 'Universiti UAE'],
      uniTuitionAnnual: 42000,
      uniDuration: 4
    },
    festivals: [
      { name: 'Hari Raya Aidilfitri & Aidiladha', icon: '🌙', desc: 'Bunga api gemilang, jamuan keluarga, majlis mesra dan kemurahan hati.' },
      { name: 'Hari Kebangsaan UAE (2 Dis)', icon: '🇦🇪', desc: 'Pertunjukan dron luar biasa, perarakan dan kampung warisan.' },
      { name: 'Tahun Baru di Burj Khalifa', icon: '🎆', desc: 'Pertunjukan laser & bunga api paling terkenal di dunia!' }
    ],
    cultureActivities: [
      { id: 'ae_karak', title: 'Teh Karak & Shawarma Tengah Malam', icon: '🌯', desc: 'Hon sekali di kafe untuk Teh Karak AED 2 & shawarma panas!', cost: 25, effects: { happiness: 12, adaptation: 12 } },
      { id: 'ae_desert', title: 'Safari Gurun Pasir Merah', icon: '🐪', desc: 'Pacuan bukit pasir waktu senja diikuti kopi Arab, kurma & bintang.', cost: 220, effects: { happiness: 15, health: 3, adaptation: 12 } },
      { id: 'ae_mall', title: 'Dubai Mall & Air Pancut Menari', icon: '🏙️', desc: 'Bersiar di pusat beli-belah terbesar dunia menonton air pancut muzik.', cost: 140, effects: { happiness: 11, adaptation: 8 } },
      { id: 'ae_arabic', title: 'Belajar Ucapan Arab & Adab Majlis', icon: '🗣️', desc: 'Kuasai "Ahlan wa Sahlan" dan adat layanan mesra Timur Tengah.', cost: 180, effects: { smarts: 5, adaptation: 16 } }
    ],
    jobs: [
      { id: 'ae_cabin', title: 'Kru Kabin Emirates / Etihad', icon: '✈️', minAge: 20, reqDegree: false, salary: 145000, desc: 'Gaji bebas cukai + penginapan sambil terbang ke seluruh dunia!' },
      { id: 'ae_realtor', title: 'Broker Hartanah Mewah Dubai', icon: '🏙️', minAge: 19, reqDegree: false, salary: 220000, desc: 'Menjual unit Palm Jumeirah & Downtown (0% cukai!).' },
      { id: 'ae_swe', title: 'Jurutera AI & Awan (DIFC)', icon: '💻', minAge: 22, reqDegree: true, reqSmarts: 65, salary: 340000, desc: 'Menerajui transformasi digital di Dubai Internet City.' },
      { id: 'ae_finance', title: 'Pengarah Kewangan Global', icon: '🏦', minAge: 23, reqDegree: true, reqSmarts: 72, salary: 460000, desc: 'Pasaran modal antarabangsa di Abu Dhabi & DIFC.' }
    ],
    assets: {
      vehicles: [
        { id: 'ae_patrol', name: 'Nissan Patrol ("Raja Gurun")', icon: '🚙', price: 245000, upkeep: 16000, happiness: 20 },
        { id: 'ae_gwagon', name: 'Mercedes-AMG G63', icon: '🚘', price: 890000, upkeep: 48000, happiness: 28 },
        { id: 'ae_lambo', name: 'Lamborghini Huracán', icon: '🏎️', price: 1150000, upkeep: 75000, happiness: 34 }
      ],
      properties: [
        { id: 'ae_jvc', name: 'Apartmen Moden 1-Bilik (JVC)', icon: '🏢', price: 950000, upkeep: 18000, happiness: 17 },
        { id: 'ae_marina', name: 'Apartmen Langit Dubai Marina', icon: '🏙️', price: 2400000, upkeep: 38000, happiness: 26 },
        { id: 'ae_palm', name: 'Vila Mewah Palm Jumeirah', icon: '🌴', price: 14500000, upkeep: 180000, happiness: 38 }
      ]
    }
  }
};

window.COUNTRY_INVESTMENTS = {
  MY: { name: 'ASB / Indeks Bursa Malaysia', icon: '🇲🇾', minYield: 4, maxYield: 10, desc: 'Dividen stabil & pertumbuhan saham utama Malaysia.' },
  SG: { name: 'Bon Simpanan Singapura & STI ETF', icon: '🇸🇬', minYield: 3, maxYield: 9, desc: 'Pulangan SGD kukuh & dividen REIT.' },
  JP: { name: 'Portfolio NISA & Nikkei 225', icon: '🇯🇵', minYield: 2, maxYield: 11, desc: 'Pelaburan ekuiti Jepun bercukai rendah.' },
  GB: { name: 'Stocks & Shares ISA (FTSE)', icon: '🇬🇧', minYield: 4, maxYield: 11, desc: 'Pelaburan ISA UK bebas cukai.' },
  US: { name: 'ETF S&P 500 & Nasdaq', icon: '🇺🇸', minYield: 5, maxYield: 14, desc: 'Pertumbuhan tinggi Wall Street & Silicon Valley.' },
  AU: { name: 'ETF Dividen ASX 200', icon: '🇦🇺', minYield: 4, maxYield: 11, desc: 'Dividen syarikat utama & perlombongan Australia.' },
  KR: { name: 'ETF Teknologi & Semikonduktor KOSPI', icon: '🇰🇷', minYield: 3, maxYield: 13, desc: 'Peneraju teknologi & bateri global Korea.' },
  ID: { name: 'Indeks IDX & Bon SBN', icon: '🇮🇩', minYield: 5, maxYield: 12, desc: 'Pertumbuhan ekonomi Nusantara & bon kerajaan.' },
  TH: { name: 'Indeks SET & REIT Thailand', icon: '🇹🇭', minYield: 3, maxYield: 10, desc: 'Dividen pelancongan, runcit & infrastruktur.' },
  AE: { name: 'Portfolio Bebas Cukai DFM / ADX', icon: '🇦🇪', minYield: 5, maxYield: 13, desc: '0% cukai keuntungan modal di UAE!' }
};
