/* ==========================================================================
   WorldLife — Pangkalan Data Aktiviti Dunia Sebenar (70 Aktiviti Lengkap)
   7 Kategori + Peluang Terhad + Perisa Negara Dinamik (195 Negara)
   Bahasa Melayu
   ========================================================================== */

window.ActivitiesData = {
  // --------------------------------------------------------------------------
  // 1. KATEGORI & PENAPIS PANTAS
  // --------------------------------------------------------------------------
  CATEGORIES: [
    { id: 'ALL', label: 'Semua', icon: '✨' },
    { id: 'outdoor_travel', label: 'Alam & Travel', icon: '🏔️', match: ['Alam & Pengembaraan', 'Travel & Jalan-Jalan'] },
    { id: 'hobby_health', label: 'Hobi & Santai', icon: '🎨', match: ['Hobi, Gaya Hidup & Kreatif', 'Kesihatan, Sukan & Jiwa'] },
    { id: 'social', label: 'Sosial', icon: '🤝', match: ['Sosial, Komuniti & Hiburan'] },
    { id: 'hustle', label: 'Side Hustle', icon: '💼', match: ['Side Hustle & Kemahiran Santai'] },
    { id: 'rare', label: 'Peluang Terhad', icon: '🌟', match: ['Peluang Terhad'] }
  ],

  // --------------------------------------------------------------------------
  // 2. PERISA LOKASI MENGIKUT NEGARA (195 NEGARA + perincian khas rantau popular)
  // --------------------------------------------------------------------------
  COUNTRY_FLAVOR: {
    MY: {
      mountain: 'Bukit Broga & Gunung Kinabalu',
      coast: 'Pulau Perhentian & Pantai Cherating',
      foodSpot: 'gerai nasi lemak, char kuey teow & sate malam di Pulau Pinang dan KL',
      heritage: 'bandar warisan Melaka & George Town',
      rail: 'tren ETS merentasi sawah padi Kedah & Perak',
      market: 'Pasar Karat Ipoh & bundle Chow Kit'
    },
    ID: {
      mountain: 'Gunung Bromo & Kawah Ijen',
      coast: 'Nusa Penida & Pantai Lombok',
      foodSpot: 'warung bakso, sate madura & nasi padang asli',
      heritage: 'kawasan budaya Yogyakarta & Candi Borobudur',
      rail: 'kereta api panorama merentasi lembah Jawa Barat',
      market: 'Pasar Senen & bazar malam Bandung'
    },
    SG: {
      mountain: 'Bukit Timah Nature Reserve & MacRitchie Treetop',
      coast: 'Pulau Ubin & Pantai Sentosa',
      foodSpot: 'pusat penjaja Maxwell, Lau Pa Sat & laksa Katong',
      heritage: 'Kampong Glam, Chinatown & Tiong Bahru',
      rail: 'laluan MRT merentasi Marina Bay',
      market: 'pasar lambak Bugis & Haji Lane'
    },
    JP: {
      mountain: 'lembah Hakone & denai kaki Gunung Fuji',
      coast: 'pesisir Okinawa & Teluk Kamakura',
      foodSpot: 'kedai ramen lorong sempit, takoyaki Dotonbori & pasar Tsukiji',
      heritage: 'kuil klasik Kyoto & pekan lama Takayama',
      rail: 'kereta api Shinkansen & tren desa tempatan',
      market: 'kedai vintage Shimokitazawa & pasar Ameyoko'
    },
    KR: {
      mountain: 'Taman Negara Bukhansan & Seoraksan',
      coast: 'pesisir Pulau Jeju & Pantai Haeundae Busan',
      foodSpot: 'gerai tteokbokki Myeongdong, BBQ Korea & pasar Gwangjang',
      heritage: 'Perkampungan Hanok Bukchon & Gyeongju',
      rail: 'tren KTX merentasi Semenanjung Korea',
      market: 'pasar bundle Dongmyo & Hongdae'
    },
    TH: {
      mountain: 'pergunungan Doi Inthanon Chiang Mai',
      coast: 'Pulau Krabi & Teluk Phang Nga',
      foodSpot: 'gerai pad thai, tomyam pekat & pulut mangga jalanan Bangkok',
      heritage: 'kota purba Ayutthaya & kuil lama',
      rail: 'kereta api malam dari Bangkok ke Chiang Mai',
      market: 'Pasar Minggu Chatuchak & pasar malam Jodd Fairs'
    },
    GB: {
      mountain: 'Peak District & tanah tinggi Scotland',
      coast: 'tebing kapur Dover & pantai Cornwall',
      foodSpot: 'pasar Borough Market, fish & chips tepi pantai serta kafe bebas',
      heritage: 'kota bersejarah Oxford, Edinburgh & muzium London',
      rail: 'kereta api merentasi desa berkabus Yorkshire',
      market: 'Portobello Road & pasar vintage Brick Lane'
    },
    US: {
      mountain: 'denai Yosemite & pergunungan Blue Ridge',
      coast: 'pesisir Big Sur California & Florida Keys',
      foodSpot: 'food truck tempatan, smokehouse BBQ & diner klasik',
      heritage: 'Muzium Smithsonian & daerah bersejarah Boston',
      rail: 'laluan Amtrak & lebuh raya Route 66',
      market: 'Rose Bowl Flea Market & kedai thrift Brooklyn'
    },
    AE: {
      mountain: 'Pergunungan Hajar & Jebel Jais Ras Al Khaimah',
      coast: 'pantai Jumeirah & perairan Fujairah',
      foodSpot: 'restoran shawarma, mandi Arab & bazar rempah Deira',
      heritage: 'Daerah Bersejarah Al Fahidi & Qasr Al Hosn',
      rail: 'Metro Dubai & laluan lebuh raya gurun',
      market: 'Souk Madinat & pasar malam Karama'
    },
    AU: {
      mountain: 'Blue Mountains & Grampians',
      coast: 'Great Ocean Road & terumbu karang Queensland',
      foodSpot: 'kafe brunch Melbourne & pasar makanan laut Sydney',
      heritage: 'The Rocks Sydney & galeri warisan',
      rail: 'kereta api pesisir timur Australia',
      market: 'Queen Victoria Market & pasar lambak Glebe'
    },
    TR: {
      mountain: 'lembah batu Cappadocia & Gunung Uludag',
      coast: 'perairan biru Antalya & Selat Bosphorus',
      foodSpot: 'gerai kebab asli, baklava & teh epal di Istanbul',
      heritage: 'Hagia Sophia, Topkapi & kota purba Ephesus',
      rail: 'kereta api Anatolia & feri antara benua',
      market: 'Grand Bazaar & pasar antik Kadikoy'
    },
    SA: {
      mountain: 'pergunungan sejuk Abha & Edge of the World Riyadh',
      coast: 'pesisir Laut Merah Jeddah & Yanbu',
      foodSpot: 'hidangan kabsah, mutabbaq & kopi Arab kurma',
      heritage: 'Al-Balad Jeddah & tapak warisan Diriyah',
      rail: 'kereta api laju Haramain merentasi padang pasir',
      market: 'Souq Al-Zal & bazar tradisional'
    }
  },

  getFlavor(countryId) {
    const c = Utils.getCountry(countryId);
    const custom = this.COUNTRY_FLAVOR[countryId];
    const city = (c.cities && c.cities[0]) || c.name;
    const city2 = (c.cities && c.cities[1]) || city;
    if (custom) {
      return Object.assign({ country: c.name, flag: c.flag, city, city2 }, custom);
    }
    return {
      country: c.name,
      flag: c.flag,
      city,
      city2,
      mountain: `pergunungan dan bukit hijau di sekitar ${city}`,
      coast: `pesisir pantai serta tasik semula jadi di ${c.name}`,
      foodSpot: `gerai makanan tempatan dan hidangan tradisi popular di ${city}`,
      heritage: `muzium nasional dan tapak warisan sejarah di ${c.name}`,
      rail: `rangkaian tren dan jalan darat antara ${city} dengan ${city2}`,
      market: `pasar malam dan bazar barangan terpakai di ${city}`
    };
  },

  formatFlavorText(template, countryId) {
    if (!template) return '';
    const f = this.getFlavor(countryId);
    return String(template)
      .replace(/\{country\}/g, f.country)
      .replace(/\{flag\}/g, f.flag)
      .replace(/\{city\}/g, f.city)
      .replace(/\{city2\}/g, f.city2)
      .replace(/\{mountain\}/g, f.mountain)
      .replace(/\{coast\}/g, f.coast)
      .replace(/\{foodSpot\}/g, f.foodSpot)
      .replace(/\{heritage\}/g, f.heritage)
      .replace(/\{rail\}/g, f.rail)
      .replace(/\{market\}/g, f.market);
  },

  // --------------------------------------------------------------------------
  // 3. SENARAI 70 AKTIVITI DUNIA SEBENAR (TIADA PLACEHOLDER — LENGKAP!)
  // --------------------------------------------------------------------------
  ACTIVITIES: [
    // ========================================================================
    // KATEGORI 1: ALAM & PENGEMBARAAN (10 Aktiviti)
    // ========================================================================
    {
      id: 'act_hiking_peak',
      title: 'Hiking Bukit & Puncak Gunung',
      category: 'Alam & Pengembaraan',
      icon: '🥾',
      minAge: 8,
      maxAge: 78,
      cost: 12,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['risk_taker', 'devout'],
      encounterGroup: 'hiking',
      desc: 'Mendaki denai semula jadi di {mountain} sambil menghirup udara pagi yang segar.',
      outcomes: [
        { tier: 'great', text: 'Anda tiba di puncak {mountain} tepat ketika matahari terbit di sebalik awan karpet! Pemandangan luar biasa menyegarkan tubuh dan jiwa.', stats: { health: 10, happiness: 14 }, stress: -15, karma: 2 },
        { tier: 'normal', text: 'Pendakian di {mountain} berpeluh lencun tetapi sangat memuaskan hati.', stats: { health: 6, happiness: 8 }, stress: -9 },
        { tier: 'twist', text: 'Hujan turun mengejut di pertengahan trek {mountain}! Kasut licin menyebabkan anda tergelincir dan terseliuh buku lali sedikit.', stats: { health: -7, happiness: -3 }, stress: 5 }
      ]
    },
    {
      id: 'act_camping_wild',
      title: 'Camping Tepi Hutan & Pantai',
      category: 'Alam & Pengembaraan',
      icon: '⛺',
      minAge: 10,
      maxAge: 75,
      cost: 35,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['devout', 'eccentric'],
      encounterGroup: 'hiking',
      desc: 'Pasang khemah di {coast}, nyalakan unggun api dan tidur ditemani bunyi alam.',
      outcomes: [
        { tier: 'great', text: 'Malam yang cukup damai di {coast}! Kopi panas di tepi unggun api dan bunyi ombak memulihkan semangat anda sepenuhnya.', stats: { health: 9, happiness: 15 }, stress: -18, karma: 3 },
        { tier: 'normal', text: 'Berjaya memasang khemah dan memasak mi segera panas di bawah langit malam {country}.', stats: { health: 5, happiness: 9 }, stress: -10 },
        { tier: 'twist', text: 'Angin ribut malam menerbangkan kanvas khemah anda dan monyet liar melarikan sebungkus roti!', stats: { health: -5, happiness: -5 }, stress: 6 }
      ]
    },
    {
      id: 'act_snorkeling_dive',
      title: 'Snorkeling & Selam Terumbu Karang',
      category: 'Alam & Pengembaraan',
      icon: '🤿',
      minAge: 10,
      maxAge: 70,
      cost: 65,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['risk_taker', 'creative'],
      encounterGroup: 'outdoor',
      desc: 'Terokai keindahan hidupan laut dan air jernih di {coast}.',
      outcomes: [
        { tier: 'great', text: 'Anda berenang bersebelahan penyu laut gergasi di {coast}! Rakaman bawah air anda memukau semua rakan.', stats: { health: 8, happiness: 16, looks: 2 }, fame: 3, stress: -14 },
        { tier: 'normal', text: 'Air laut di {coast} sangat jernih dan dipenuhi ikan berwarna-warni.', stats: { health: 5, happiness: 10 }, stress: -9 },
        { tier: 'twist', text: 'Kulit belakang anda terbakar teruk akibat terlupa sapu krim pelindung matahari dan kaki terkena obor-obor kecil!', stats: { health: -8, happiness: -4 }, stress: 5 }
      ]
    },
    {
      id: 'act_fishing_jetty',
      title: 'Memancing Santai Di Jeti & Tasik',
      category: 'Alam & Pengembaraan',
      icon: '🎣',
      minAge: 7,
      maxAge: 88,
      cost: 18,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['devout', 'cunning'],
      encounterGroup: 'outdoor',
      desc: 'Labuhkan joran di perairan tenang {country} sambil melatih kesabaran.',
      outcomes: [
        { tier: 'great', text: 'Joran melentur kuat! Anda berjaya mendaratkan ikan bersaiz mega yang menjadi bualan kaki pancing di {city}!', stats: { happiness: 14, smarts: 2 }, moneyUsd: 75, stress: -14 },
        { tier: 'normal', text: 'Dapat beberapa ekor ikan segar untuk dibawa pulang sambil menikmati angin petang.', stats: { happiness: 8, health: 2 }, stress: -10 },
        { tier: 'twist', text: 'Empat jam menunggu, umpan habis dimakan ikan kecil dan mata kail tersangkut pada kayu buruk!', stats: { happiness: -3 }, stress: 3 }
      ]
    },
    {
      id: 'act_long_cycling',
      title: 'Kayuhan Basikal Jarak Jauh',
      category: 'Alam & Pengembaraan',
      icon: '🚴',
      minAge: 8,
      maxAge: 78,
      cost: 15,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['ambitious', 'risk_taker'],
      encounterGroup: 'outdoor',
      desc: 'Kayuh basikal merentasi laluan indah di pinggir {city} bersama angin pagi.',
      outcomes: [
        { tier: 'great', text: 'Anda menamatkan kayuhan 60km tanpa henti! Stamina meningkat mendadak dan badan terasa jauh lebih cergas.', stats: { health: 12, happiness: 11, looks: 3 }, stress: -12 },
        { tier: 'normal', text: 'Kayuhan lancar melewati kawasan desa {country} dan singgah minum air kelapa segar.', stats: { health: 7, happiness: 8 }, stress: -8 },
        { tier: 'twist', text: 'Tayar basikal pancit 10km dari rumah di tengah panas terik — terpaksa menolak basikal berpeluh-peluh!', stats: { health: -4, happiness: -5 }, moneyUsd: -20, stress: 6 }
      ]
    },
    {
      id: 'act_kayak_rafting',
      title: 'Berkayak & Redah Jeram Sungai',
      category: 'Alam & Pengembaraan',
      icon: '🛶',
      minAge: 12,
      maxAge: 68,
      cost: 50,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['risk_taker', 'charismatic'],
      encounterGroup: 'outdoor',
      desc: 'Dayung kayak merentasi jeram sungai dan teluk semula jadi di {country}.',
      outcomes: [
        { tier: 'great', text: 'Kerjasama dayungan yang mantap berjaya menawan jeram deras! Adrenalin dan semangat berkumpulan memuncak!', stats: { health: 9, happiness: 15 }, stress: -13, rep: 2 },
        { tier: 'normal', text: 'Lengan agak lenguh mendayung, tetapi pemandangan tebing sungai amat menenangkan.', stats: { health: 6, happiness: 9 }, stress: -8 },
        { tier: 'twist', text: 'Kayak terbalik ketika melanggar arus pusar! Anda basah kuyup dan cermin mata hitam hanyut dibawa arus.', stats: { health: -5, happiness: -4 }, moneyUsd: -30, stress: 5 }
      ]
    },
    {
      id: 'act_stargazing_night',
      title: 'Malam Memerhati Bintang (Stargazing)',
      category: 'Alam & Pengembaraan',
      icon: '🔭',
      minAge: 6,
      maxAge: 90,
      cost: 10,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['creative', 'devout'],
      encounterGroup: 'outdoor',
      desc: 'Bentang tikar di kawasan gelap luar {city} untuk melihat gugusan Bima Sakti.',
      outcomes: [
        { tier: 'great', text: 'Langit malam di {country} sangat cerah! Anda menyaksikan pancuran tahi bintang yang menginsafkan jiwa.', stats: { happiness: 14, smarts: 5 }, stress: -16, karma: 4 },
        { tier: 'normal', text: 'Berjaya mengenal pasti beberapa buruj bintang sambil berbual santai di bawah langit malam.', stats: { happiness: 8, smarts: 3 }, stress: -10 },
        { tier: 'twist', text: 'Awan tebal menutup seluruh langit dan nyamuk hutan menyerang kaki anda tanpa henti!', stats: { happiness: -3, health: -2 }, stress: 3 }
      ]
    },
    {
      id: 'act_paragliding_ridge',
      title: 'Paragliding Di Puncak Tebing',
      category: 'Alam & Pengembaraan',
      icon: '🪂',
      minAge: 16,
      maxAge: 65,
      cost: 110,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['risk_taker'],
      encounterGroup: 'outdoor',
      desc: 'Melayang di udara menikmati panorama {mountain} dan pesisir {country} dari langit.',
      outcomes: [
        { tier: 'great', text: 'Terbang bebas bak helang di ruang udara {country}! Video kamera aksi anda menjadi tular!', stats: { happiness: 18, looks: 3 }, fame: 5, followers: 2200, stress: -15 },
        { tier: 'normal', text: 'Pendaratan lembut di padang rumput selepas 20 minit menikmati pemandangan indah dari udara.', stats: { happiness: 12, health: 3 }, stress: -10 },
        { tier: 'twist', text: 'Angin lintang menolak payung terjun ke semak berduri ketika mendarat — nasib baik hanya luka calar!', stats: { health: -10, happiness: -4 }, stress: 8 }
      ]
    },
    {
      id: 'act_hidden_waterfall',
      title: 'Ekspedisi Air Terjun Tersembunyi',
      category: 'Alam & Pengembaraan',
      icon: '🏞️',
      minAge: 9,
      maxAge: 72,
      cost: 15,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['risk_taker', 'eccentric'],
      encounterGroup: 'hiking',
      desc: 'Menjejaki lata air terjun rahsia di pedalaman hutan {mountain}.',
      outcomes: [
        { tier: 'great', text: 'Anda menemui kolam air terjun biru kehijauan yang tiada orang lain! Mandi air gunung yang sejuk menyegarkan seluruh badan.', stats: { health: 9, happiness: 15 }, stress: -16 },
        { tier: 'normal', text: 'Perjalanan meredah anak sungai berbaloi apabila disambut deruan air terjun yang jernih.', stats: { health: 6, happiness: 10 }, stress: -10 },
        { tier: 'twist', text: 'Beberapa ekor pacat kenyang melekat di betis anda dan batu licin membuatkan anda terduduk di dalam air!', stats: { health: -4, happiness: -3 }, stress: 4 }
      ]
    },
    {
      id: 'act_trail_running',
      title: 'Lari Denai Hutan (Trail Running)',
      category: 'Alam & Pengembaraan',
      icon: '🏃',
      minAge: 12,
      maxAge: 68,
      cost: 10,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['ambitious', 'risk_taker'],
      encounterGroup: 'hiking',
      desc: 'Berlari merentasi akar kayu, anak sungai dan cerun bukit di {mountain}.',
      outcomes: [
        { tier: 'great', text: 'Rentak larian anda sangat pantas dan stabil! Paru-paru terasa lapang dan stamina melonjak tinggi.', stats: { health: 12, happiness: 11, looks: 2 }, stress: -12 },
        { tier: 'normal', text: 'Berjaya menamatkan pusingan denai 10km dengan kasut penuh lumpur tetapi hati puas.', stats: { health: 8, happiness: 7 }, stress: -8 },
        { tier: 'twist', text: 'Kaki tersadung akar kayu besar lalu tersungkur di atas tanah berselut!', stats: { health: -7, happiness: -4 }, stress: 5 }
      ]
    },

    // ========================================================================
    // KATEGORI 2: TRAVEL & JALAN-JALAN (10 Aktiviti)
    // ========================================================================
    {
      id: 'act_solo_domestic_travel',
      title: 'Travel Solo Dalam Negeri',
      category: 'Travel & Jalan-Jalan',
      icon: '🚆',
      minAge: 16,
      maxAge: 82,
      cost: 85,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['eccentric', 'creative'],
      encounterGroup: 'travel',
      desc: 'Kemas satu beg galas dan naik {rail} seorang diri untuk meneroka sisi baru {country}.',
      outcomes: [
        { tier: 'great', text: 'Perjalanan solo dengan {rail} membuka mata dan memberi ketenangan luar biasa! Anda pulang ke {city} dengan perspektif hidup yang baharu.', stats: { happiness: 16, smarts: 5 }, stress: -18, karma: 3 },
        { tier: 'normal', text: 'Menikmati pemandangan indah sepanjang {rail} sambil mendengar lagu kegemaran di tepi tingkap.', stats: { happiness: 11, smarts: 3 }, stress: -11 },
        { tier: 'twist', text: 'Tren mengalami kelewatan 4 jam dan anda tertinggal pengecas telefon di ruang menunggu stesen!', stats: { happiness: -4 }, moneyUsd: -25, stress: 6 }
      ]
    },
    {
      id: 'act_spontaneous_roadtrip',
      title: 'Roadtrip Spontan Tanpa Peta',
      category: 'Travel & Jalan-Jalan',
      icon: '🚗',
      minAge: 17,
      maxAge: 78,
      cost: 75,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['risk_taker', 'charismatic'],
      encounterGroup: 'travel',
      desc: 'Isi minyak penuh dan memandu keluar dari {city} menuju ke pekan-pekan kecil di {country}.',
      outcomes: [
        { tier: 'great', text: 'Anda terjumpa jalan pesisir pantai yang sangat cantik dan kedai makan kampung terbaik di {country}!', stats: { happiness: 15, health: 3 }, stress: -15 },
        { tier: 'normal', text: 'Menyanyi sepanjang lebuh raya menuju {city2} sambil berhenti membeli buah-buahan tempatan di tepi jalan.', stats: { happiness: 10 }, stress: -10 },
        { tier: 'twist', text: 'Tersalah masuk simpang jalan mati dan terperangkap dalam kesesakan trafik selama 3 jam!', stats: { happiness: -5 }, moneyUsd: -35, stress: 7 }
      ]
    },
    {
      id: 'act_food_hunting_town',
      title: 'Food Hunting Ke Bandar Sebelah',
      category: 'Travel & Jalan-Jalan',
      icon: '🍜',
      minAge: 8,
      maxAge: 85,
      cost: 32,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['creative', 'charismatic'],
      encounterGroup: 'food',
      desc: 'Menjelajah {foodSpot} untuk mencuba hidangan paling padu dan tular.',
      outcomes: [
        { tier: 'great', text: 'Semua hidangan di {foodSpot} memang luar biasa sedap! Gambar ulasan makanan anda mendapat ribuan tanda suka!', stats: { happiness: 15 }, fame: 4, followers: 1600, stress: -12 },
        { tier: 'normal', text: 'Perut kenyang dan puas dapat menikmati sajian asli di {foodSpot}.', stats: { happiness: 10 }, stress: -8 },
        { tier: 'twist', text: 'Beratur lebih sejam di bawah terik matahari tetapi hidangan utamanya baru sahaja habis terjual!', stats: { happiness: -5, health: -2 }, stress: 5 }
      ]
    },
    {
      id: 'act_staycation_hotel',
      title: 'Staycation Hotel Hujung Minggu',
      category: 'Travel & Jalan-Jalan',
      icon: '🏨',
      minAge: 16,
      maxAge: 90,
      cost: 120,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['ambitious', 'empathetic'],
      encounterGroup: 'travel',
      desc: 'Daftar masuk hotel selesa di {city}, mandi kolam renang dan tidur di tilam empuk tanpa gangguan.',
      outcomes: [
        { tier: 'great', text: 'Pihak hotel menaik taraf bilik anda ke suite panorama secara percuma! Sarapan bufet mewah dan rehat berkualiti memulihkan tenaga.', stats: { happiness: 17, health: 7, looks: 3 }, stress: -20 },
        { tier: 'normal', text: 'Tidur lena, berendam di kolam renang dan menonton filem di bilik berhawa dingin yang nyaman.', stats: { happiness: 11, health: 4 }, stress: -13 },
        { tier: 'twist', text: 'Bilik sebelah membuat bising sehingga jam 3 pagi dan penghawa dingin pula kurang sejuk!', stats: { happiness: -4 }, stress: 5 }
      ]
    },
    {
      id: 'act_glamping_retreat',
      title: 'Glamping Hujung Minggu Tepi Sungai',
      category: 'Travel & Jalan-Jalan',
      icon: '🏕️',
      minAge: 10,
      maxAge: 80,
      cost: 95,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['creative', 'empathetic'],
      encounterGroup: 'travel',
      desc: 'Nikmati suasana alam semula jadi di {mountain} dengan khemah glamping lengkap katil empuk dan lampu hiasan.',
      outcomes: [
        { tier: 'great', text: 'Malam BBQ di tepi sungai {mountain} bawah lampu kuning sangat estetik! Foto percutian anda memukau rakan-rakan.', stats: { happiness: 15, looks: 3, health: 5 }, followers: 1200, stress: -15 },
        { tier: 'normal', text: 'Gabungan sempurna antara keselesaan moden dan udara hutan yang dingin.', stats: { happiness: 10, health: 4 }, stress: -10 },
        { tier: 'twist', text: 'Bekalan elektrik tapak glamping terputus ketika hujan lebat dan serangga hutan memenuhi lampu khemah.', stats: { happiness: -4 }, stress: 4 }
      ]
    },
    {
      id: 'act_backpacking_neighbor',
      title: 'Backpacking Bajet Ke Negara Jiran',
      category: 'Travel & Jalan-Jalan',
      icon: '🎒',
      minAge: 18,
      maxAge: 70,
      cost: 195,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['risk_taker', 'eccentric'],
      encounterGroup: 'travel',
      desc: 'Mengembara secara bajet dari {country} ke negara berdekatan, menginap di hostel dan meneroka budaya asing.',
      outcomes: [
        { tier: 'great', text: 'Pengembaraan bajet yang membuka minda! Anda belajar bahasa baharu, makan makanan jalanan unik dan pulang penuh inspirasi.', stats: { happiness: 18, smarts: 6 }, stress: -16, rep: 2 },
        { tier: 'normal', text: 'Berjaya melawat banyak lokasi menarik dengan bajet jimat menggunakan pengangkutan awam.', stats: { happiness: 12, smarts: 4 }, stress: -10 },
        { tier: 'twist', text: 'Anda tersalah naik bas ekspres ke arah bertentangan dan terpaksa mengeluarkan belanja tambahan untuk tiket pulang!', stats: { happiness: -5 }, moneyUsd: -70, stress: 8 }
      ]
    },
    {
      id: 'act_heritage_museum',
      title: 'Lawat Muzium & Tapak Warisan',
      category: 'Travel & Jalan-Jalan',
      icon: '🏛️',
      minAge: 6,
      maxAge: 95,
      cost: 14,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['creative', 'devout'],
      encounterGroup: 'travel',
      desc: 'Menghayati khazanah sejarah, seni bina klasik dan pameran budaya di {heritage}.',
      outcomes: [
        { tier: 'great', text: 'Anda sempat mengikuti sesi lawatan khas kurator di {heritage}! Pengetahuan sejarah dan rasa cinta akan budaya meningkat.', stats: { smarts: 8, happiness: 11 }, stress: -9, karma: 3 },
        { tier: 'normal', text: 'Banyak kisah silam menarik yang anda pelajari sepanjang melawat {heritage}.', stats: { smarts: 5, happiness: 7 }, stress: -6 },
        { tier: 'twist', text: 'Separuh galeri utama di {heritage} ditutup kerana kerja penyelenggaraan dan kaki anda lenguh berjalan.', stats: { smarts: 2, happiness: -2 } }
      ]
    },
    {
      id: 'act_island_ferry',
      title: 'Naik Feri Ke Pulau Terpencil',
      category: 'Travel & Jalan-Jalan',
      icon: '⛴️',
      minAge: 8,
      maxAge: 82,
      cost: 55,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['eccentric', 'devout'],
      encounterGroup: 'travel',
      desc: 'Menyeberangi laut dengan feri pagi menuju pulau tenang di {coast}.',
      outcomes: [
        { tier: 'great', text: 'Dolfin liar melompat mengiringi feri anda menuju {coast}! Pantai yang sunyi memberikan ketenangan luar biasa.', stats: { happiness: 16, health: 5 }, stress: -17 },
        { tier: 'normal', text: 'Angin laut di atas dek feri dan makan tengah hari makanan laut segar di pulau sangat menyelerakan.', stats: { happiness: 10, health: 3 }, stress: -11 },
        { tier: 'twist', text: 'Gelombang laut agak bergelora sehingga anda mabuk laut sepanjang perjalanan feri!', stats: { health: -6, happiness: -5 }, stress: 5 }
      ]
    },
    {
      id: 'act_old_village_visit',
      title: 'Ziarah Kampung Lama & Pekan Klasik',
      category: 'Travel & Jalan-Jalan',
      icon: '🏡',
      minAge: 6,
      maxAge: 95,
      cost: 22,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['empathetic', 'devout'],
      encounterGroup: 'travel',
      desc: 'Menyusuri pekan lama di luar {city}, melihat rumah tradisional dan suasana desa yang nostalgik.',
      outcomes: [
        { tier: 'great', text: 'Penduduk kampung menyambut anda dengan mesra dan menjamu kuih tradisional panas! Hati terasa sangat tenang dan bersyukur.', stats: { happiness: 14, health: 3 }, stress: -15, karma: 5, rep: 2 },
        { tier: 'normal', text: 'Berjalan kaki mengambil gambar kedai-kedai papan klasik yang masih kekal sejak puluhan tahun lalu.', stats: { happiness: 9, smarts: 2 }, stress: -10 },
        { tier: 'twist', text: 'Cuaca terik melampau dan banyak kedai tradisional tutup pada hari lawatan anda.', stats: { happiness: -2 }, stress: 2 }
      ]
    },
    {
      id: 'act_scenic_night_train',
      title: 'Ekspedisi Tren Malam Panorama',
      category: 'Travel & Jalan-Jalan',
      icon: '🛤️',
      minAge: 14,
      maxAge: 85,
      cost: 70,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['eccentric', 'creative'],
      encounterGroup: 'travel',
      desc: 'Naik gerabak tidur di {rail} sambil melihat lampu-lampu pekan kecil berlalu di balik tingkap malam.',
      outcomes: [
        { tier: 'great', text: 'Tidur dibuai hayunan tren dan bangun melihat kabus pagi menyelimuti bukit-bukau {country} dari katil gerabak!', stats: { happiness: 15, smarts: 3 }, stress: -16 },
        { tier: 'normal', text: 'Pengalaman klasik yang unik menikmati makan malam di gerabak kafe tren.', stats: { happiness: 10 }, stress: -10 },
        { tier: 'twist', text: 'Bunyi landasan agak bising dan penumpang katil atas berdengkur kuat sepanjang malam!', stats: { happiness: -4, health: -3 }, stress: 5 }
      ]
    },

    // ========================================================================
    // KATEGORI 3: HOBI, GAYA HIDUP & KREATIF (11 Aktiviti)
    // ========================================================================
    {
      id: 'act_thrift_bundle_hunt',
      title: 'Thrift & Bundle Hunting',
      category: 'Hobi, Gaya Hidup & Kreatif',
      icon: '🧥',
      minAge: 12,
      maxAge: 75,
      cost: 25,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['cunning', 'creative'],
      encounterGroup: 'thrift',
      desc: 'Selongkar rak pakaian terpakai dan barangan retro di {market} untuk mencari harta karun tersembunyi.',
      outcomes: [
        { tier: 'great', text: 'Rezeki terpijak! Anda menjumpai jaket berjenama vintaj asli pada harga murah di {market} — gaya anda terus naik kelas!', stats: { happiness: 13, looks: 6 }, moneyUsd: 120, stress: -8 },
        { tier: 'normal', text: 'Dapat dua helai baju retro yang unik dan masih berkualiti tinggi pada harga berpatutan.', stats: { happiness: 8, looks: 3 }, stress: -6 },
        { tier: 'twist', text: 'Dua jam menyelak timbunan kain berhabuk sehingga anda bersin tak berhenti tanpa jumpa saiz yang sesuai!', stats: { health: -3, happiness: -3 } }
      ]
    },
    {
      id: 'act_cafe_hopping',
      title: 'Cafe Hopping Cari Kopi & Pastri',
      category: 'Hobi, Gaya Hidup & Kreatif',
      icon: '☕',
      minAge: 13,
      maxAge: 82,
      cost: 22,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['creative', 'charismatic'],
      encounterGroup: 'food',
      desc: 'Terokai kafe-kafe estetik tersembunyi di lorong sekitar {city}.',
      outcomes: [
        { tier: 'great', text: 'Anda menemui kafe rahsia dengan kopi panggang terbaik di {city}! Barista siap belanja sepotong kek keju.', stats: { happiness: 13, looks: 2 }, followers: 700, stress: -12 },
        { tier: 'normal', text: 'Aroma kopi segar dan muzik latar yang tenang membuatkan petang anda sangat santai.', stats: { happiness: 8 }, stress: -8 },
        { tier: 'twist', text: 'Kopi berharga mahal tetapi rasanya tawar dan anda pula terlebih kafein sehingga berdebar-debar malam itu!', stats: { happiness: -4, health: -2 }, stress: 5 }
      ]
    },
    {
      id: 'act_street_photography',
      title: 'Fotografi Jalanan (Street Photography)',
      category: 'Hobi, Gaya Hidup & Kreatif',
      icon: '📷',
      minAge: 11,
      maxAge: 85,
      cost: 0,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['creative', 'eccentric'],
      encounterGroup: 'creative',
      desc: 'Merakam detik spontan manusia, cahaya senja dan seni bina jalanan di sekitar {city}.',
      outcomes: [
        { tier: 'great', text: 'Sekeping foto hitam-putih anda di jalanan {city} dipilih untuk dipamerkan oleh halaman seni tempatan!', stats: { happiness: 14, smarts: 4 }, fame: 4, followers: 1900, rep: 2, stress: -10 },
        { tier: 'normal', text: 'Dapat beberapa keping gambar menarik yang merakam suasana harian penduduk {country}.', stats: { happiness: 8, smarts: 2 }, stress: -7 },
        { tier: 'twist', text: 'Seorang peniaga garang memarahi anda kerana menyangka anda mengambil gambar gerainya tanpa izin!', stats: { happiness: -5 }, stress: 6 }
      ]
    },
    {
      id: 'act_cook_new_recipe',
      title: 'Belajar Masak Resipi Baru Di Rumah',
      category: 'Hobi, Gaya Hidup & Kreatif',
      icon: '🍳',
      minAge: 9,
      maxAge: 90,
      cost: 16,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['creative', 'empathetic'],
      encounterGroup: 'food',
      desc: 'Beli bahan segar dan cuba masak hidangan istimewa mengikut resipi warisan dan moden.',
      outcomes: [
        { tier: 'great', text: 'Masakan anda menjadi sangat sedap seperti restoran mewah! Keluarga dan jiran memuji air tangan anda.', stats: { happiness: 13, smarts: 4, health: 3 }, rep: 2, karma: 2, stress: -10 },
        { tier: 'normal', text: 'Hidangan siap dengan jayanya — lebih jimat dan sihat berbanding makan di luar.', stats: { happiness: 8, health: 3 }, stress: -7 },
        { tier: 'twist', text: 'Terleka melihat telefon sehingga bawang hangus rentung dan penggera asap berbunyi satu rumah!', stats: { happiness: -5 }, stress: 5 }
      ]
    },
    {
      id: 'act_latte_pottery_class',
      title: 'Kelas Seni Tembikar & Latte Art',
      category: 'Hobi, Gaya Hidup & Kreatif',
      icon: '🏺',
      minAge: 12,
      maxAge: 85,
      cost: 42,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['creative'],
      encounterGroup: 'creative',
      desc: 'Sertai bengkel kraf tangan membentuk tanah liat dan melukis corak buih kopi di studio kreatif {city}.',
      outcomes: [
        { tier: 'great', text: 'Mangkuk seramik buatan tangan dan corak latte anda menjadi sangat kemas! Pengajar memuji bakat semula jadi anda.', stats: { happiness: 14, smarts: 5 }, stress: -13 },
        { tier: 'normal', text: 'Aktiviti kraf yang sangat menenangkan fikiran sambil membawa pulang hasil karya sendiri.', stats: { happiness: 9, smarts: 3 }, stress: -9 },
        { tier: 'twist', text: 'Tanah liat di atas roda pemutar terpelanting mengotori baju kesayangan anda!', stats: { happiness: -3 }, stress: 3 }
      ]
    },
    {
      id: 'act_stray_cat_plants',
      title: 'Santuni Kucing Jalanan & Jaga Tanaman',
      category: 'Hobi, Gaya Hidup & Kreatif',
      icon: '🐈',
      minAge: 5,
      maxAge: 95,
      cost: 10,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['empathetic', 'devout'],
      encounterGroup: 'volunteer',
      desc: 'Beri makan kucing jalanan di kawasan kejiranan {city} dan siram pokok hiasan di halaman.',
      outcomes: [
        { tier: 'great', text: 'Seekor kucing comel yang anda rawat kini sihat dan setia menunggu anda setiap petang, manakala pokok bunga anda mekar subur!', stats: { happiness: 15, health: 4 }, karma: 8, stress: -16, rep: 2 },
        { tier: 'normal', text: 'Melihat kucing-kucing jalanan makan dengan berselera membuatkan hati anda rasa lapang dan damai.', stats: { happiness: 10 }, karma: 5, stress: -11 },
        { tier: 'twist', text: 'Seekor kucing liar yang terkejut mencakar sedikit tangan anda ketika anda menghulurkan makanan.', stats: { health: -3, happiness: -2 }, karma: 2 }
      ]
    },
    {
      id: 'act_movie_book_marathon',
      title: 'Maraton Filem Klasik & Buku Pilihan',
      category: 'Hobi, Gaya Hidup & Kreatif',
      icon: '📚',
      minAge: 7,
      maxAge: 95,
      cost: 8,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['creative', 'eccentric'],
      encounterGroup: 'creative',
      desc: 'Luangkan hujung minggu dengan membaca buku bermutu dan menonton karya filem terbaik di rumah.',
      outcomes: [
        { tier: 'great', text: 'Sebuah buku falsafah dan filem hebat yang anda tonton mengubah cara anda melihat kehidupan serta kerjaya!', stats: { smarts: 8, happiness: 12 }, stress: -14 },
        { tier: 'normal', text: 'Rehat di sofa sambil menghabiskan bab terakhir buku dengan secawan teh panas.', stats: { smarts: 4, happiness: 8 }, stress: -10 },
        { tier: 'twist', text: 'Terlajak menonton siri sehingga jam 4 pagi — bangun esoknya dengan mata lebam dan kepala pening!', stats: { health: -4, happiness: -2 }, stress: 4 }
      ]
    },
    {
      id: 'act_busking_music',
      title: 'Busking & Belajar Alat Muzik',
      category: 'Hobi, Gaya Hidup & Kreatif',
      icon: '🎸',
      minAge: 10,
      maxAge: 80,
      cost: 15,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['creative', 'charismatic'],
      encounterGroup: 'creative',
      desc: 'Berlatih bermain gitar atau papan nada dan cuba membuat persembahan santai di sudut seni {city}.',
      outcomes: [
        { tier: 'great', text: 'Persembahan akustik anda menarik ramai penonton di {city}! Bekas gitar penuh dengan wang sumbangan dan tepukan gemuruh.', stats: { happiness: 16, looks: 3, smarts: 3 }, moneyUsd: 110, fame: 4, followers: 1400, stress: -12 },
        { tier: 'normal', text: 'Jari semakin cekap memetik kord lagu kegemaran selepas latihan tekun.', stats: { happiness: 10, smarts: 3 }, stress: -8 },
        { tier: 'twist', text: 'Tali gitar putus di tengah-tengah lagu dan hujan mula renyai-renyai memaksa anda berkemas awal.', stats: { happiness: -3 }, moneyUsd: -12 }
      ]
    },
    {
      id: 'act_vlog_journal',
      title: 'Rakam Konten Vlog & Tulis Jurnal',
      category: 'Hobi, Gaya Hidup & Kreatif',
      icon: '🎬',
      minAge: 12,
      maxAge: 82,
      cost: 0,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['creative', 'charismatic'],
      encounterGroup: 'creative',
      desc: 'Rakam kisah harian di {city}, sunting video pendek kreatif dan catat refleksi diri dalam jurnal.',
      outcomes: [
        { tier: 'great', text: 'Vlog jujur anda tentang kehidupan di {city} meletup di algoritma! Ribuan penonton baru meninggalkan komen positif.', stats: { happiness: 14, smarts: 4 }, fame: 6, followers: 3800, moneyUsd: 95, stress: -10 },
        { tier: 'normal', text: 'Menulis jurnal membantu anda menyusun matlamat hidup dengan lebih jelas dan tenang.', stats: { happiness: 8, smarts: 3 }, stress: -9 },
        { tier: 'twist', text: 'Aplikasi suntingan video terpadam secara tiba-tiba sebelum sempat disimpan — 2 jam kerja hilang begitu sahaja!', stats: { happiness: -6 }, stress: 7 }
      ]
    },
    {
      id: 'act_room_makeover',
      title: 'Kemas & Ubah Suai Dekorasi Bilik',
      category: 'Hobi, Gaya Hidup & Kreatif',
      icon: '🛋️',
      minAge: 8,
      maxAge: 85,
      cost: 30,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['creative', 'ambitious'],
      encounterGroup: 'thrift',
      desc: 'Susun semula perabot, buang barang tidak perlu dan tambah lampu hangat supaya bilik lebih selesa.',
      outcomes: [
        { tier: 'great', text: 'Bilik anda kelihatan seperti ruang majalah hiasan dalaman! Semasa mengemas, anda turut terjumpa wang tunai lama terselit di laci!', stats: { happiness: 14, health: 3 }, moneyUsd: 65, stress: -15 },
        { tier: 'normal', text: 'Ruang yang bersih dan kemas membuatkan tidur malam anda jauh lebih lena.', stats: { happiness: 9, health: 2 }, stress: -10 },
        { tier: 'twist', text: 'Sakit pinggang kerana mengangkat almari berat seorang diri dan jari tersepit sedikit!', stats: { health: -5, happiness: -3 }, stress: 4 }
      ]
    },
    {
      id: 'act_diy_upcycle_craft',
      title: 'Projek DIY & Baik Pulih Perabot Lama',
      category: 'Hobi, Gaya Hidup & Kreatif',
      icon: '🪚',
      minAge: 14,
      maxAge: 80,
      cost: 28,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['creative', 'cunning'],
      encounterGroup: 'creative',
      desc: 'Gosok kertas pasir dan cat semula meja kayu atau barangan lama supaya tampak baharu dan bernilai.',
      outcomes: [
        { tier: 'great', text: 'Hasil kemasan kayu anda sangat halus sehingga seorang kenalan sanggup membelinya pada harga tinggi!', stats: { happiness: 12, smarts: 5 }, moneyUsd: 160, stress: -9 },
        { tier: 'normal', text: 'Puas hati melihat perabot lama bertukar wajah hasil titik peluh sendiri.', stats: { happiness: 9, smarts: 3 }, stress: -7 },
        { tier: 'twist', text: 'Cat tertumpah di atas lantai dan ukuran kayu yang dipotong senget sebelah!', stats: { happiness: -4 }, moneyUsd: -20, stress: 4 }
      ]
    },

    // ========================================================================
    // KATEGORI 4: SOSIAL, KOMUNITI & HIBURAN (10 Aktiviti)
    // ========================================================================
    {
      id: 'act_join_run_club',
      title: 'Sertai Kelab Larian (Run Club)',
      category: 'Sosial, Komuniti & Hiburan',
      icon: '👟',
      minAge: 13,
      maxAge: 75,
      cost: 0,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['charismatic', 'ambitious'],
      encounterGroup: 'social',
      desc: 'Berlari santai 5km setiap hujung minggu bersama komuniti kelab larian di taman utama {city}.',
      outcomes: [
        { tier: 'great', text: 'Suasana kelab larian di {city} sangat meriah! Anda bukan sahaja makin cergas malah dapat rangkaian kenalan profesional yang hebat.', stats: { health: 10, happiness: 13, looks: 3 }, rep: 3, stress: -12 },
        { tier: 'normal', text: 'Larian berkumpulan diikuti sesi sarapan pagi bersama ahli kelab sangat menceriakan.', stats: { health: 7, happiness: 9 }, stress: -8 },
        { tier: 'twist', text: 'Anda cuba mengikut rentak pelari pecut di hadapan sehingga mengalami kekejangan betis di kilometer ke-3!', stats: { health: -5, happiness: -3 }, stress: 4 }
      ]
    },
    {
      id: 'act_indie_concert_gig',
      title: 'Pergi Konsert & Gig Muzik Indie',
      category: 'Sosial, Komuniti & Hiburan',
      icon: '🎸',
      minAge: 15,
      maxAge: 68,
      cost: 45,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['creative', 'charismatic'],
      encounterGroup: 'social',
      desc: 'Menikmati persembahan muzik secara langsung bersama ratusan peminat muzik di {city}.',
      outcomes: [
        { tier: 'great', text: 'Tenaga muzik langsung yang luar biasa! Anda dapat bergambar dengan kumpulan muzik kegemaran dan menyanyi sekuat hati!', stats: { happiness: 17 }, fame: 2, stress: -16 },
        { tier: 'normal', text: 'Malam yang penuh muzik hebat dan suasana penonton yang sangat sporting.', stats: { happiness: 11 }, stress: -10 },
        { tier: 'twist', text: 'Telinga berdengung kerana berdiri terlalu rapat dengan pembesar suara dan tempat parkir sesak teruk!', stats: { health: -3, happiness: -3 }, stress: 4 }
      ]
    },
    {
      id: 'act_late_night_hangout',
      title: 'Lepak Santai Sampai Lewat Malam',
      category: 'Sosial, Komuniti & Hiburan',
      icon: '🌙',
      minAge: 14,
      maxAge: 75,
      cost: 15,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['charismatic', 'empathetic'],
      encounterGroup: 'food',
      desc: 'Minum teh tarik atau kopi panas di kedai makan malam {city} sambil berborak panjang tentang kehidupan.',
      outcomes: [
        { tier: 'great', text: 'Perbualan hati ke hati sehingga lewat malam mengeratkan persahabatan dan melahirkan satu idea projek yang bernas!', stats: { happiness: 14, smarts: 3 }, stress: -14, rep: 1 },
        { tier: 'normal', text: 'Gelak ketawa bersama rakan-rakan menghilangkan segala penat bekerja sepanjang minggu.', stats: { happiness: 10 }, stress: -10 },
        { tier: 'twist', text: 'Balik terlalu lewat sehingga mengantuk berat keesokan paginya dan perut pula kembung!', stats: { health: -4, happiness: -2 }, stress: 3 }
      ]
    },
    {
      id: 'act_volunteer_community',
      title: 'Kerja Sukarela: Dapur Jalanan & Pantai',
      category: 'Sosial, Komuniti & Hiburan',
      icon: '🍲',
      minAge: 10,
      maxAge: 85,
      cost: 10,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['empathetic', 'devout'],
      encounterGroup: 'volunteer',
      desc: 'Turun padang mengagihkan makanan panas kepada golongan memerlukan atau membersihkan pantai di {country}.',
      outcomes: [
        { tier: 'great', text: 'Doa dan senyuman mereka yang dibantu menyentuh hati anda. Usaha murni komuniti anda turut mendapat pujian ramai di {city}!', stats: { happiness: 16, health: 3 }, karma: 14, rep: 6, stress: -14 },
        { tier: 'normal', text: 'Penat bekerja seharian, tetapi hati terasa sangat bersih dan bermakna.', stats: { happiness: 11 }, karma: 9, rep: 3, stress: -9 },
        { tier: 'twist', text: 'Cuaca panas terik membuatkan anda hampir pitam akibat dehidrasi ringan semasa bertugas.', stats: { health: -5, happiness: 4 }, karma: 7 }
      ]
    },
    {
      id: 'act_board_game_night',
      title: 'Malam Board Game Bersama Kawan',
      category: 'Sosial, Komuniti & Hiburan',
      icon: '🎲',
      minAge: 8,
      maxAge: 85,
      cost: 12,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['cunning', 'charismatic'],
      encounterGroup: 'social',
      desc: 'Berkumpul bermain permainan papan strategi dan teka-teki penuh gelak tawa.',
      outcomes: [
        { tier: 'great', text: 'Strategi licik anda menyapu bersih tiga pusingan berturut-turut! Semua kawan tabik dengan kepintaran anda.', stats: { happiness: 14, smarts: 5 }, stress: -12 },
        { tier: 'normal', text: 'Malam yang riuh-rendah dengan jenaka dan snek ringan bersama kawan-kawan.', stats: { happiness: 10, smarts: 2 }, stress: -9 },
        { tier: 'twist', text: 'Seorang kawan terlalu emosi kerana kalah sehingga suasana bertukar tegang seketika!', stats: { happiness: -3 }, stress: 4 }
      ]
    },
    {
      id: 'act_night_flea_market',
      title: 'Jalan-Jalan Pasar Malam & Pasar Karat',
      category: 'Sosial, Komuniti & Hiburan',
      icon: '🏮',
      minAge: 6,
      maxAge: 88,
      cost: 18,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['cunning', 'eccentric'],
      encounterGroup: 'thrift',
      desc: 'Menyusuri kemeriahan lampu, aroma makanan jalanan dan gerai barangan unik di {market}.',
      outcomes: [
        { tier: 'great', text: 'Makanan pasar malam di {market} sangat menyelerakan dan anda dapat tawar-menawar barangan unik pada harga separuh!', stats: { happiness: 13, smarts: 2 }, moneyUsd: 40, stress: -10 },
        { tier: 'normal', text: 'Pulang dengan tangan penuh bungkusan makanan panas dan buah-buahan segar.', stats: { happiness: 9 }, stress: -7 },
        { tier: 'twist', text: 'Kesesakan orang terlalu padat dan hujan turun tiba-tiba menyebabkan jalan pasar malam becak!', stats: { happiness: -3 }, stress: 3 }
      ]
    },
    {
      id: 'act_speed_dating_mixer',
      title: 'AcaraSuai Kenal & Jumpa Kenalan Baru',
      category: 'Sosial, Komuniti & Hiburan',
      icon: '💬',
      minAge: 18,
      maxAge: 65,
      cost: 30,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['charismatic', 'ambitious'],
      encounterGroup: 'social',
      desc: 'Hadir ke majlis jaringan sosial dan suai kenal santai di kafe {city} untuk meluaskan kenalan.',
      outcomes: [
        { tier: 'great', text: 'Karisma anda menyerlah! Anda berbual rancak dengan beberapa individu menarik dan bertukar nombor telefon.', stats: { happiness: 15, looks: 3 }, rep: 3, stress: -10 },
        { tier: 'normal', text: 'Berjaya mengatasi rasa malu dan mendapat beberapa kenalan baharu yang ramah.', stats: { happiness: 9, smarts: 2 }, stress: -6 },
        { tier: 'twist', text: 'Teman semeja anda asyik bercakap tentang dirinya sendiri tanpa henti selama sejam — sangat memenatkan!', stats: { happiness: -4 }, stress: 5 }
      ]
    },
    {
      id: 'act_book_debate_club',
      title: 'Sertai Kelab Buku & Wacana Idea',
      category: 'Sosial, Komuniti & Hiburan',
      icon: '🗣️',
      minAge: 12,
      maxAge: 88,
      cost: 0,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['ambitious', 'cunning'],
      encounterGroup: 'social',
      desc: 'Bincangkan buku, isu semasa dan falsafah bersama komuniti pembaca di perpustakaan {city}.',
      outcomes: [
        { tier: 'great', text: 'Hujah bernas dan bernasib baik anda mendapat tepukan gemuruh ahli kelab! Pemikiran kritis anda semakin tajam.', stats: { smarts: 9, happiness: 11 }, rep: 4, stress: -8 },
        { tier: 'normal', text: 'Perbincangan yang membuka minda dengan pelbagai sudut pandang menarik.', stats: { smarts: 5, happiness: 7 }, stress: -6 },
        { tier: 'twist', text: 'Perbahasan menjadi terlalu hangat sehingga moderator terpaksa menenangkan dua ahli yang bertikam lidah.', stats: { smarts: 2, happiness: -2 }, stress: 4 }
      ]
    },
    {
      id: 'act_animal_shelter_help',
      title: 'Bantu Pusat Perlindungan Haiwan',
      category: 'Sosial, Komuniti & Hiburan',
      icon: '🐾',
      minAge: 8,
      maxAge: 85,
      cost: 12,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['empathetic', 'devout'],
      encounterGroup: 'volunteer',
      desc: 'Mandikan, beri makan dan bermain dengan haiwan terbiar di pusat jagaan haiwan {city}.',
      outcomes: [
        { tier: 'great', text: 'Gambar haiwan comel yang anda kongsikan membantu pusat itu mendapat keluarga angkat baharu dan sumbangan ramai!', stats: { happiness: 16, health: 3 }, karma: 12, rep: 5, followers: 1100, stress: -15 },
        { tier: 'normal', text: 'Meluangkan masa dengan haiwan-haiwan manja mengubati keletihan emosi anda.', stats: { happiness: 11 }, karma: 7, stress: -10 },
        { tier: 'twist', text: 'Baju anda kotor terkena lumpur dan bulu haiwan, tetapi hati tetap rasa puas membantu.', stats: { happiness: 4, health: -2 }, karma: 5 }
      ]
    },
    {
      id: 'act_standup_comedy_night',
      title: 'Malam Komedi Stand-Up & Open Mic',
      category: 'Sosial, Komuniti & Hiburan',
      icon: '🎭',
      minAge: 16,
      maxAge: 78,
      cost: 24,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['charismatic', 'eccentric'],
      encounterGroup: 'social',
      desc: 'Ketawa sepuas hati menonton pelawak tempatan atau beranikan diri mencuba slot 3 minit di pentas {city}!',
      outcomes: [
        { tier: 'great', text: 'Anda spontan naik ke pentas open mic dan jenaka anda membuatkan seluruh dewan pecah perut ketawa!', stats: { happiness: 17, looks: 2 }, fame: 4, rep: 2, stress: -16 },
        { tier: 'normal', text: 'Ketawa tanpa henti selama dua jam — terapi terbaik untuk melepaskan tekanan!', stats: { happiness: 12 }, stress: -13 },
        { tier: 'twist', text: 'Pelawak di pentas menjadikan anda bahan usikan mesra di hadapan penonton sehingga muka anda merah padam!', stats: { happiness: -2 }, stress: 3 }
      ]
    },

    // ========================================================================
    // KATEGORI 5: KESIHATAN, SUKAN & JIWA (10 Aktiviti)
    // ========================================================================
    {
      id: 'act_muay_thai_boxing',
      title: 'Kelas Muay Thai & Tinju Kecergasan',
      category: 'Kesihatan, Sukan & Jiwa',
      icon: '🥊',
      minAge: 12,
      maxAge: 62,
      cost: 28,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['risk_taker', 'ambitious'],
      encounterGroup: 'fitness',
      desc: 'Pelajari teknik tumbukan, tendangan padu dan ketahanan fizikal di gimnasium seni mempertahankan diri {city}.',
      outcomes: [
        { tier: 'great', text: 'Jurulatih memuji kepantasan refleks dan kekuatan tumbukan anda! Badan semakin tegap dan keyakinan diri melonjak.', stats: { health: 13, looks: 4, happiness: 10 }, stress: -14 },
        { tier: 'normal', text: 'Sesi latihan intensif yang membakar ratusan kalori dan mengeluarkan peluh toksin.', stats: { health: 9, looks: 2, happiness: 6 }, stress: -10 },
        { tier: 'twist', text: 'Tersalah teknik sepakan pada beg pasir menyebabkan pergelangan kaki anda sengal selama beberapa hari!', stats: { health: -6, happiness: -3 }, stress: 4 }
      ]
    },
    {
      id: 'act_marathon_10k_21k',
      title: 'Sertai Larian Maraton 10K / 21K',
      category: 'Kesihatan, Sukan & Jiwa',
      icon: '🏅',
      minAge: 14,
      maxAge: 72,
      cost: 35,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['ambitious', 'risk_taker'],
      encounterGroup: 'fitness',
      desc: 'Sarung nombor bib dan berlari merentasi jalan utama {city} bersama ribuan peserta maraton.',
      outcomes: [
        { tier: 'great', text: 'REKOD PERIBADI BAHARU! Anda melintasi garisan penamat dengan pingat kebanggaan dan rasa sangat bertenaga!', stats: { health: 14, happiness: 15, looks: 3 }, rep: 3, stress: -14 },
        { tier: 'normal', text: 'Berjaya menamatkan larian tanpa berhenti berjalan dan membawa pulang pingat penamat.', stats: { health: 9, happiness: 10 }, stress: -9 },
        { tier: 'twist', text: 'Kaki melecet teruk dan kekejangan otot menyerang pada kilometer terakhir sehingga pasukan medik perlu menyembur ubat kebas!', stats: { health: -7, happiness: -3 }, stress: 5 }
      ]
    },
    {
      id: 'act_yoga_pilates',
      title: 'Sesi Yoga & Pilates Regangan Badan',
      category: 'Kesihatan, Sukan & Jiwa',
      icon: '🧘',
      minAge: 12,
      maxAge: 85,
      cost: 22,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['devout', 'empathetic'],
      encounterGroup: 'fitness',
      desc: 'Latih kelenturan otot, postur tulang belakang dan kawalan pernafasan di studio tenang {city}.',
      outcomes: [
        { tier: 'great', text: 'Sakit belakang dan lenguh bahu hilang serta-merta! Postur badan anda kelihatan lebih segak dan fikiran sangat hening.', stats: { health: 11, looks: 4, happiness: 11 }, stress: -17 },
        { tier: 'normal', text: 'Regangan mendalam dan teknik pernafasan membuatkan tidur malam anda sangat berkualiti.', stats: { health: 7, happiness: 8 }, stress: -12 },
        { tier: 'twist', text: 'Cuba membuat posisi imbangan sukar lalu tumbang tergolek di atas tikar sebelah!', stats: { health: -3, happiness: -2 } }
      ]
    },
    {
      id: 'act_reflexology_spa',
      title: 'Urutan Refleksologi & Rawatan Spa',
      category: 'Kesihatan, Sukan & Jiwa',
      icon: '💆',
      minAge: 16,
      maxAge: 92,
      cost: 48,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['empathetic', 'charismatic'],
      encounterGroup: 'fitness',
      desc: 'Manjakan diri dengan urutan tradisional, rendaman kaki herba dan terapi aroma di pusat kesihatan {city}.',
      outcomes: [
        { tier: 'great', text: 'Tukang urut berpengalaman berjaya mengurai semua simpulan urat tegang! Anda keluar dengan wajah berseri-seri dan tubuh ringan.', stats: { health: 11, happiness: 14, looks: 4 }, stress: -22 },
        { tier: 'normal', text: 'Satu jam setengah urutan yang melegakan keletihan otot dan menenangkan fikiran.', stats: { health: 7, happiness: 10, looks: 2 }, stress: -15 },
        { tier: 'twist', text: 'Tekanan urutan terlalu kuat sehingga bahu anda terasa lebam keesokan harinya!', stats: { health: -3, happiness: -2 } }
      ]
    },
    {
      id: 'act_digital_detox',
      title: 'Digital Detox Hujung Minggu (Tutup Telefon)',
      category: 'Kesihatan, Sukan & Jiwa',
      icon: '📵',
      minAge: 10,
      maxAge: 92,
      cost: 0,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['devout', 'eccentric'],
      encounterGroup: 'fitness',
      desc: 'Simpan telefon pintar selama 48 jam — tiada media sosial, tiada notifikasi, hanya dunia sebenar.',
      outcomes: [
        { tier: 'great', text: 'Ketenangan luar biasa! Tanpa gangguan skrin, fikiran anda menjadi sangat tajam, tidur lena dan kebimbangan hilang.', stats: { happiness: 15, smarts: 5, health: 5 }, stress: -24, karma: 3 },
        { tier: 'normal', text: 'Hari pertama agak janggal tanpa telefon, tetapi hari kedua terasa sangat bebas dan damai.', stats: { happiness: 10, smarts: 3 }, stress: -16 },
        { tier: 'twist', text: 'Rasa gelisah (FOMO) melanda dan apabila membuka semula telefon, terdapat 90 mesej tertangguh yang perlu dijawab!', stats: { happiness: -2 }, stress: 4 }
      ]
    },
    {
      id: 'act_bouldering_climb',
      title: 'Bouldering & Panjat Dinding (Wall Climbing)',
      category: 'Kesihatan, Sukan & Jiwa',
      icon: '🧗',
      minAge: 10,
      maxAge: 62,
      cost: 24,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['risk_taker', 'cunning'],
      encounterGroup: 'fitness',
      desc: 'Uji kekuatan genggaman jari dan strategi memanjat laluan dinding batu buatan di gim {city}.',
      outcomes: [
        { tier: 'great', text: 'Anda berjaya menawan laluan gred sukar sehingga ke puncak dinding! Sorakan rakan pemanjat lain menaikkan semangat.', stats: { health: 11, smarts: 4, happiness: 13 }, stress: -11 },
        { tier: 'normal', text: 'Latihan seluruh badan yang mencabar minda dan menguatkan otot lengan serta belakang.', stats: { health: 8, smarts: 2, happiness: 8 }, stress: -8 },
        { tier: 'twist', text: 'Tapak tangan melecet dan anda terlepas pijakan lalu jatuh ke atas tilam tebal dengan agak kuat!', stats: { health: -6, happiness: -2 }, stress: 4 }
      ]
    },
    {
      id: 'act_long_distance_swim',
      title: 'Renang Jarak Jauh & Terapi Air',
      category: 'Kesihatan, Sukan & Jiwa',
      icon: '🏊',
      minAge: 7,
      maxAge: 85,
      cost: 10,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['ambitious', 'devout'],
      encounterGroup: 'fitness',
      desc: 'Lengkapkan puluhan pusingan renang di kolam kompleks sukan {city} untuk kesihatan jantung dan sendi.',
      outcomes: [
        { tier: 'great', text: 'Kapasiti pernafasan dan kecergasan kardio anda meningkat ketara! Tubuh terasa segar tanpa sebarang sakit sendi.', stats: { health: 13, looks: 3, happiness: 10 }, stress: -14 },
        { tier: 'normal', text: 'Berenang selama sejam di dalam air sejuk melapangkan dada dan menenangkan fikiran.', stats: { health: 8, happiness: 8 }, stress: -10 },
        { tier: 'twist', text: 'Air berklorin masuk ke hidung dan telinga tersumbat air sehingga berdesing sepanjang petang!', stats: { health: -3, happiness: -2 } }
      ]
    },
    {
      id: 'act_morning_meditation_park',
      title: 'Meditasi Pagi & Pernafasan Di Taman',
      category: 'Kesihatan, Sukan & Jiwa',
      icon: '🌅',
      minAge: 8,
      maxAge: 95,
      cost: 0,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['devout', 'empathetic'],
      encounterGroup: 'fitness',
      desc: 'Duduk bersila di bawah pokok rendang taman {city} ketika embun pagi sambil menghayati kesyukuran.',
      outcomes: [
        { tier: 'great', text: 'Hati terasa amat lapang dan bersyukur. Segala kekusutan emosi terlerai dan anda mendapat ilham baharu untuk hidup.', stats: { happiness: 14, health: 6, smarts: 3 }, karma: 6, stress: -20 },
        { tier: 'normal', text: 'Udara pagi yang segar dan bunyi kicauan burung memberikan permulaan hari yang tenang.', stats: { happiness: 9, health: 4 }, karma: 3, stress: -13 },
        { tier: 'twist', text: 'Kaki kebas semut-semut kerana duduk terlalu lama dan mesin pemotong rumput pula bising berdekatan!', stats: { happiness: 2 }, stress: -3 }
      ]
    },
    {
      id: 'act_badminton_futsal_night',
      title: 'Malam Badminton & Futsal Bersama Geng',
      category: 'Kesihatan, Sukan & Jiwa',
      icon: '🏸',
      minAge: 8,
      maxAge: 70,
      cost: 12,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['charismatic', 'risk_taker'],
      encounterGroup: 'fitness',
      desc: 'Tempah gelanggang malam di {city} untuk perlawanan persahabatan yang penuh peluh dan sorakan.',
      outcomes: [
        { tier: 'great', text: 'Pukulan smash dan jaringan kemenangan saat akhir anda menjadi bualan! Peluh keluar mencurah-curah dan hati puas.', stats: { health: 11, happiness: 14 }, stress: -13, rep: 1 },
        { tier: 'normal', text: 'Dua jam berlari di gelanggang diikuti minum ringan bersama rakan sepasukan.', stats: { health: 7, happiness: 9 }, stress: -9 },
        { tier: 'twist', text: 'Terpijak garisan licin ketika mengejar bola lalu jatuh terduduk dan lutut calar sedikit!', stats: { health: -6, happiness: -2 }, stress: 3 }
      ]
    },
    {
      id: 'act_full_health_checkup',
      title: 'Saringan Kesihatan & Pelan Nutrisi',
      category: 'Kesihatan, Sukan & Jiwa',
      icon: '🩺',
      minAge: 18,
      maxAge: 95,
      cost: 60,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['ambitious', 'cunning'],
      encounterGroup: 'fitness',
      desc: 'Jalani pemeriksaan darah lengkap, tahap kecergasan dan konsultasi pemakanan sihat di klinik {city}.',
      outcomes: [
        { tier: 'great', text: 'Keputusan ujian sangat cemerlang! Doktor memberi pelan vitamin dan pemakanan tepat yang melonjakkan kecergasan harian anda.', stats: { health: 15, smarts: 3, happiness: 9 }, stress: -10 },
        { tier: 'normal', text: 'Semua bacaan kesihatan terkawal dan anda lebih berdisiplin menjaga waktu tidur serta makan.', stats: { health: 10, happiness: 5 }, stress: -6 },
        { tier: 'twist', text: 'Doktor menegur paras kolesterol dan gula anda agak tinggi — terpaksa kurangkan makanan bergoreng kegemaran!', stats: { health: 4, happiness: -4 }, stress: 4 }
      ]
    },

    // ========================================================================
    // KATEGORI 6: SIDE HUSTLE & KEMAHIRAN SANTAI (10 Aktiviti)
    // ========================================================================
    {
      id: 'act_flip_preloved_vintage',
      title: 'Jual Barang Preloved & Flip Vintage',
      category: 'Side Hustle & Kemahiran Santai',
      icon: '🏷️',
      minAge: 14,
      maxAge: 80,
      cost: 40,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['cunning', 'ambitious'],
      encounterGroup: 'thrift',
      desc: 'Beli barangan lama bernilai tinggi di {market}, bersihkan dan jual semula di platform dalam talian.',
      outcomes: [
        { tier: 'great', text: 'JACKPOT! Seorang pengumpul tegar membeli koleksi vintaj anda pada harga 5 kali ganda modal asal!', stats: { happiness: 13, smarts: 4 }, moneyUsd: 780, stress: -6 },
        { tier: 'normal', text: 'Beberapa barangan preloved terjual pantas — dapat untung bersih yang lumayan untuk simpanan.', stats: { happiness: 7, smarts: 2 }, moneyUsd: 230 },
        { tier: 'twist', text: 'Barang yang dibeli rupa-rupanya mempunyai kerosakan dalaman dan pembeli menuntut pulangan wang!', stats: { happiness: -6 }, moneyUsd: -55, stress: 6 }
      ]
    },
    {
      id: 'act_ehailing_delivery_weekend',
      title: 'Pemandu E-Hailing / Rider Hujung Minggu',
      category: 'Side Hustle & Kemahiran Santai',
      icon: '🛵',
      minAge: 18,
      maxAge: 70,
      cost: 15,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['ambitious', 'empathetic'],
      encounterGroup: 'hustle',
      desc: 'Hidupkan aplikasi penghantaran dan e-hailing pada waktu puncak hujung minggu di sekitar {city}.',
      outcomes: [
        { tier: 'great', text: 'Pesanan masuk bertali arus ditambah tip besar daripada pelanggan korporat yang menghargai layanan sopan anda!', stats: { happiness: 10, health: -2 }, moneyUsd: 520, karma: 3, rep: 2 },
        { tier: 'normal', text: 'Penat meredah jalan raya {city}, tetapi bayaran insentif mingguan masuk terus ke akaun.', stats: { health: -2, happiness: 5 }, moneyUsd: 240 },
        { tier: 'twist', text: 'Hujan lebat, alamat pelanggan mengelirukan dan tayar pula pancit terkena paku di jalan!', stats: { health: -5, happiness: -6 }, moneyUsd: 40, stress: 8 }
      ]
    },
    {
      id: 'act_weekend_market_stall',
      title: 'Buka Gerai Kecil Di Pasar Hujung Minggu',
      category: 'Side Hustle & Kemahiran Santai',
      icon: '🎪',
      minAge: 15,
      maxAge: 78,
      cost: 75,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['ambitious', 'charismatic'],
      encounterGroup: 'hustle',
      desc: 'Sewa tapak khemah di bazar {city} untuk menjual minuman segar, snek atau barangan kraf.',
      outcomes: [
        { tier: 'great', text: 'Gerai anda diserbu pengunjung selepas tular di media sosial tempatan! Semua stok habis licin sebelum petang!', stats: { happiness: 15, smarts: 4 }, moneyUsd: 920, fame: 4, rep: 3 },
        { tier: 'normal', text: 'Jualan memberangsangkan dan anda belajar cara melayan karenah pelanggan dengan bijak.', stats: { happiness: 8, smarts: 3 }, moneyUsd: 310 },
        { tier: 'twist', text: 'Ribut petang melanda tapak bazar menyebabkan jualan perlahan dan sebahagian modal tidak balik.', stats: { happiness: -6, health: -3 }, moneyUsd: -65, stress: 7 }
      ]
    },
    {
      id: 'act_quiz_esports_tourney',
      title: 'Masuk Pertandingan Kuiz & E-Sukan',
      category: 'Side Hustle & Kemahiran Santai',
      icon: '🕹️',
      minAge: 9,
      maxAge: 60,
      cost: 15,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['cunning', 'eccentric'],
      encounterGroup: 'hustle',
      desc: 'Uji ketangkasan strategi dan pengetahuan umum dalam kejohanan komuniti di {city}.',
      outcomes: [
        { tier: 'great', text: 'JUARA KEJOHANAN! Anda menewaskan pilihan utama pada pusingan akhir dan membawa pulang trofi serta wang tunai!', stats: { happiness: 16, smarts: 6 }, moneyUsd: 550, fame: 4, rep: 2, stress: -10 },
        { tier: 'normal', text: 'Mara sehingga separuh akhir dan membawa pulang hadiah saguhati serta kenalan gamer baru.', stats: { happiness: 9, smarts: 3 }, moneyUsd: 110, stress: -5 },
        { tier: 'twist', text: 'Sambungan internet terputus pada saat genting perlawanan menyebabkan anda tersingkir awal!', stats: { happiness: -6 }, stress: 6 }
      ]
    },
    {
      id: 'act_skill_workshop_bootcamp',
      title: 'Bengkel Kemahiran Baru (Coding / Grafik / Baik Pulih)',
      category: 'Side Hustle & Kemahiran Santai',
      icon: '🛠️',
      minAge: 13,
      maxAge: 80,
      cost: 55,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['ambitious', 'creative'],
      encounterGroup: 'hustle',
      desc: 'Hadir ke kelas praktikal intensif hujung minggu untuk menguasai kemahiran teknikal dan digital terkini.',
      outcomes: [
        { tier: 'great', text: 'Projek mini anda dipilih sebagai projek terbaik bengkel! Pengajar terus mencadangkan nama anda kepada pelanggan sebenar.', stats: { smarts: 11, happiness: 11 }, moneyUsd: 220, rep: 3 },
        { tier: 'normal', text: 'Anda berjaya menguasai ilmu baharu yang sangat berguna untuk kerjaya dan projek sampingan.', stats: { smarts: 7, happiness: 6 } },
        { tier: 'twist', text: 'Topik bengkel terlalu padat sehingga kepala anda pening, namun anda tetap dapat asas yang berguna.', stats: { smarts: 4, happiness: -2 }, stress: 4 }
      ]
    },
    {
      id: 'act_short_freelance_gig',
      title: 'Projek Kerja Bebas (Freelance) Singkat',
      category: 'Side Hustle & Kemahiran Santai',
      icon: '💻',
      minAge: 16,
      maxAge: 82,
      cost: 0,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['creative', 'cunning'],
      encounterGroup: 'hustle',
      desc: 'Ambil tugasan penulisan, terjemahan, reka bentuk atau perundingan jangka pendek dari rumah.',
      outcomes: [
        { tier: 'great', text: 'Pelanggan sangat berpuas hati dengan kualiti kerja pantas anda dan memberikan bayaran bonus bersama ulasan 5 bintang!', stats: { smarts: 6, happiness: 12 }, moneyUsd: 840, rep: 3 },
        { tier: 'normal', text: 'Tugasan selesai mengikut jadual dan bayaran masuk dengan lancar.', stats: { smarts: 3, happiness: 6 }, moneyUsd: 320 },
        { tier: 'twist', text: 'Pelanggan cerewet meminta tukar konsep saat akhir sehingga anda terpaksa berjaga malam!', stats: { happiness: -5, health: -3 }, moneyUsd: 120, stress: 9 }
      ]
    },
    {
      id: 'act_private_tutor_coach',
      title: 'Jadi Tutor Persendirian & Kelas Tuisyen',
      category: 'Side Hustle & Kemahiran Santai',
      icon: '📝',
      minAge: 16,
      maxAge: 85,
      cost: 0,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['empathetic', 'ambitious'],
      encounterGroup: 'hustle',
      desc: 'Ajar subjek akademik, bahasa atau kemahiran muzik kepada pelajar di sekitar {city}.',
      outcomes: [
        { tier: 'great', text: 'Pelajar bimbingan anda mendapat keputusan cemerlang! Ibu bapa lain berebut-rebut mahu mendaftar dengan anda.', stats: { smarts: 6, happiness: 13 }, moneyUsd: 480, rep: 5, karma: 5 },
        { tier: 'normal', text: 'Mengajar mengukuhkan lagi kefahaman ilmu anda sambil menjana pendapatan bersih.', stats: { smarts: 4, happiness: 7 }, moneyUsd: 210, karma: 3 },
        { tier: 'twist', text: 'Pelajar anda asyik bermain telefon dan membatalkan kelas saat akhir.', stats: { happiness: -3 }, moneyUsd: 60, stress: 4 }
      ]
    },
    {
      id: 'act_event_photographer_gig',
      title: 'Jurugambar Sambilan Majlis & Konvokesyen',
      category: 'Side Hustle & Kemahiran Santai',
      icon: '📸',
      minAge: 16,
      maxAge: 75,
      cost: 20,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['creative', 'charismatic'],
      encounterGroup: 'hustle',
      desc: 'Ambil tempahan merakam gambar potret graduan, pertunangan atau acara korporat di {city}.',
      outcomes: [
        { tier: 'great', text: 'Hasil gambar potret anda tular kerana pencahayaan yang sangat cantik! Tempahan masuk penuh untuk bulan hadapan.', stats: { happiness: 13, smarts: 4 }, moneyUsd: 690, fame: 4, followers: 1500, rep: 3 },
        { tier: 'normal', text: 'Pelanggan gembira dengan album gambar yang diserahkan dan membayar penuh.', stats: { happiness: 8, smarts: 2 }, moneyUsd: 280 },
        { tier: 'twist', text: 'Kad memori kamera mengalami ralat teknikal — terpaksa bekerja keras memulihkan fail gambar semalaman!', stats: { happiness: -6 }, moneyUsd: 90, stress: 10 }
      ]
    },
    {
      id: 'act_home_bakery_orders',
      title: 'Ambil Tempahan Kek & Biskut Homemade',
      category: 'Side Hustle & Kemahiran Santai',
      icon: '🧁',
      minAge: 14,
      maxAge: 82,
      cost: 35,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['empathetic', 'creative'],
      encounterGroup: 'food',
      desc: 'Bakar brownies, biskut mentega dan kek segar dari dapur rumah untuk dijual kepada rakan serta jiran di {city}.',
      outcomes: [
        { tier: 'great', text: 'Sebuah syarikat di {city} menempah 150 kotak kudapan anda untuk majlis tahunan mereka! Untung bersih melambung!', stats: { happiness: 14, smarts: 3 }, moneyUsd: 740, rep: 4, karma: 3 },
        { tier: 'normal', text: 'Semua kotak tempahan habis terjual dan pelanggan memuji keenakan resipi anda.', stats: { happiness: 8 }, moneyUsd: 240, rep: 2 },
        { tier: 'twist', text: 'Harga bahan mentah naik mendadak dan satu dulang kek bantat kerana tersilap sukatan!', stats: { happiness: -5 }, moneyUsd: -45, stress: 6 }
      ]
    },
    {
      id: 'act_pet_house_sitting',
      title: 'Jaga Rumah & Haiwan Peliharaan Jiran',
      category: 'Side Hustle & Kemahiran Santai',
      icon: '🐕',
      minAge: 10,
      maxAge: 80,
      cost: 0,
      energyCost: 1,
      isRare: false,
      preferredTraits: ['empathetic', 'devout'],
      encounterGroup: 'volunteer',
      desc: 'Ambil upah menjaga kucing, haiwan kesayangan dan menyiram tanaman pemilik rumah yang bercuti.',
      outcomes: [
        { tier: 'great', text: 'Pemilik rumah sangat berpuas hati melihat haiwan peliharaan mereka sihat dan rumah bersih — mereka memberi bonus berganda!', stats: { happiness: 12, health: 3 }, moneyUsd: 320, karma: 5, rep: 3, stress: -8 },
        { tier: 'normal', text: 'Kerja santai yang menyeronokkan sambil bermain dengan haiwan comel dan dibayar upah tunai.', stats: { happiness: 8 }, moneyUsd: 140, karma: 2, stress: -5 },
        { tier: 'twist', text: 'Kucing jagaan anda memecahkan pasu hiasan — terpaksa menggantikannya dengan wang upah sendiri!', stats: { happiness: -4 }, moneyUsd: 25, stress: 5 }
      ]
    },

    // ========================================================================
    // KATEGORI 7: PELUANG TERHAD / RARE WILDCARDS (9 Aktiviti — Emas 15–20%)
    // ========================================================================
    {
      id: 'rare_flash_sale_flight',
      title: '✨ Tiket Penerbangan "Flash Sale" Saat Akhir',
      category: 'Peluang Terhad',
      icon: '✈️',
      minAge: 18,
      maxAge: 80,
      cost: 95,
      energyCost: 1,
      isRare: true,
      preferredTraits: ['risk_taker', 'eccentric'],
      encounterGroup: 'travel',
      desc: 'PELUANG TERHAD: Syarikat penerbangan menawarkan tiket pergi-balik antarabangsa pada diskaun 90% untuk pelepasan malam ini!',
      outcomes: [
        { tier: 'great', text: 'LUAR BIASA! Anda bukan sahaja dapat bercuti mewah pada harga bajet, malah dinaik taraf ke Kelas Pertama dan berkenalan dengan tokoh korporat!', stats: { happiness: 22, health: 6, smarts: 5 }, fame: 6, rep: 7, stress: -22 },
        { tier: 'normal', text: 'Percutian mengejut yang sangat mengujakan! Anda pulang dengan ratusan kenangan manis dan fikiran segar.', stats: { happiness: 16, health: 4 }, stress: -15 },
        { tier: 'twist', text: 'Cuaca buruk menyebabkan penerbangan transit tertunda 14 jam di lapangan terbang!', stats: { happiness: -5 }, moneyUsd: -60, stress: 9 }
      ]
    },
    {
      id: 'rare_vip_closed_gala',
      title: '✨ Jemputan Majlis Tertutup Orang Berpengaruh',
      category: 'Peluang Terhad',
      icon: '🥂',
      minAge: 18,
      maxAge: 88,
      cost: 80,
      energyCost: 1,
      isRare: true,
      preferredTraits: ['charismatic', 'ambitious'],
      encounterGroup: 'social',
      desc: 'PELUANG TERHAD: Anda menerima pas jemputan eksklusif ke malam gala tertutup tokoh industri, usahawan dan pemimpin di {city}!',
      outcomes: [
        { tier: 'great', text: 'Karisma anda memukau dewan gala! Seorang pelabur utama menawarkan kerjasama projek bernilai tinggi dan reputasi keluarga melonjak!', stats: { happiness: 18, smarts: 5, looks: 4 }, moneyUsd: 3800, fame: 10, rep: 12, stress: -10 },
        { tier: 'normal', text: 'Anda membina rangkaian kenalan elit yang kukuh sambil menikmati hidangan gala bertaraf lima bintang.', stats: { happiness: 12, smarts: 3 }, moneyUsd: 650, rep: 5 },
        { tier: 'twist', text: 'Anda tertumpahkan minuman di atas permaidani utama di hadapan jurugambar media!', stats: { happiness: -7 }, rep: -4, stress: 9 }
      ]
    },
    {
      id: 'rare_mystery_box_auction',
      title: '✨ Lelongan Kotak Misteri & Peti Simpanan Lama',
      category: 'Peluang Terhad',
      icon: '📦',
      minAge: 16,
      maxAge: 85,
      cost: 220,
      energyCost: 1,
      isRare: true,
      preferredTraits: ['cunning', 'risk_taker'],
      encounterGroup: 'thrift',
      desc: 'PELUANG TERHAD: Gudang kastam dan stor lama di {city} membuka bidaan peti simpanan tidak dituntut!',
      outcomes: [
        { tier: 'great', text: 'JACKPOT BESAR! Di dalam peti berhabuk itu tersimpan jam tangan mekanikal Swiss tulen dan kepingan syiling emas antik!', stats: { happiness: 22, smarts: 4 }, moneyUsd: 5400, fame: 5, rep: 4 },
        { tier: 'normal', text: 'Peti itu mengandungi peralatan elektronik dan kamera vintaj yang berjaya dijual semula dengan untung berganda.', stats: { happiness: 11 }, moneyUsd: 820 },
        { tier: 'twist', text: 'Apabila kunci peti dibuka... isinya hanyalah timbunan majalah lama dan pakaian usang!', stats: { happiness: -8 }, moneyUsd: -150, stress: 7 }
      ]
    },
    {
      id: 'rare_vip_concert_backstage',
      title: '✨ Pas Konsert VIP & Akses Belakang Pentas',
      category: 'Peluang Terhad',
      icon: '🎟️',
      minAge: 14,
      maxAge: 75,
      cost: 0,
      energyCost: 1,
      isRare: true,
      preferredTraits: ['charismatic', 'creative'],
      encounterGroup: 'social',
      desc: 'PELUANG TERHAD: Anda memenangi sepasang pas VIP percuma lengkap akses belakang pentas konsert mega di {city}!',
      outcomes: [
        { tier: 'great', text: 'Artis utama menjemput anda naik ke pentas dan memuat naik swafoto bersama anda! Akaun sosial anda meletup!', stats: { happiness: 22, looks: 4 }, fame: 14, followers: 18000, rep: 5, stress: -18 },
        { tier: 'normal', text: 'Menonton konsert dari barisan hadapan VIP dengan layanan eksklusif — malam yang tidak akan dilupakan!', stats: { happiness: 16 }, fame: 4, followers: 2400, stress: -14 },
        { tier: 'twist', text: 'Pengawal keselamatan tersalah semak senarai nama menyebabkan anda terpaksa menunggu lama di pintu masuk VIP.', stats: { happiness: 5 }, stress: 4 }
      ]
    },
    {
      id: 'rare_movie_set_cameo',
      title: '✨ Terserempak Penggambaran Filem (Pelakon Tambahan)',
      category: 'Peluang Terhad',
      icon: '🎥',
      minAge: 10,
      maxAge: 82,
      cost: 0,
      energyCost: 1,
      isRare: true,
      preferredTraits: ['charismatic', 'eccentric'],
      encounterGroup: 'creative',
      desc: 'PELUANG TERHAD: Kru produksi filem besar sedang merakam babak di {city} dan pengarah mencari wajah spontan untuk babak berdialog!',
      outcomes: [
        { tier: 'great', text: 'Lakonan spontan anda sangat semula jadi sehingga pengarah menaikkan peranan anda dengan bayaran lumayan dan kredit nama!', stats: { happiness: 20, looks: 5 }, moneyUsd: 2200, fame: 12, followers: 9500, rep: 6 },
        { tier: 'normal', text: 'Pengalaman seronok berada di set filem sebenar, dapat elaun harian dan melihat bintang filem dari dekat.', stats: { happiness: 13 }, moneyUsd: 380, fame: 4 },
        { tier: 'twist', text: 'Anda gemuruh di hadapan kamera sehingga tersasul dialog 9 kali berturut-turut dan babak anda dipotong!', stats: { happiness: -5 }, moneyUsd: 80, stress: 8 }
      ]
    },
    {
      id: 'rare_iconic_summit_expedition',
      title: '✨ Tawaran Ekspedisi Puncak Ikonik Ditaja',
      category: 'Peluang Terhad',
      icon: '🏔️',
      minAge: 16,
      maxAge: 65,
      cost: 140,
      energyCost: 1,
      isRare: true,
      preferredTraits: ['risk_taker', 'ambitious'],
      encounterGroup: 'hiking',
      desc: 'PELUANG TERHAD: Pasukan ekspedisi mempunyai satu slot kosong bersubsidi untuk menawan puncak tertinggi di {mountain}!',
      outcomes: [
        { tier: 'great', text: 'KEJAYAAN BERSEJARAH! Anda mengibarkan bendera {flag} di puncak tertinggi! Ketahanan fizikal, mental dan reputasi anda dikagumi ramai!', stats: { health: 16, happiness: 22, looks: 4 }, fame: 11, rep: 10, karma: 5, stress: -18 },
        { tier: 'normal', text: 'Ekspedisi mencabar yang berjaya ditamatkan dengan selamat bersama rakan pendaki berpengalaman.', stats: { health: 10, happiness: 14 }, rep: 4, stress: -10 },
        { tier: 'twist', text: 'Ribut salji dan penyakit ketinggian (AMS) memaksa pasukan berpatah balik 300 meter sebelum puncak demi keselamatan.', stats: { health: -11, happiness: -5 }, stress: 10 }
      ]
    },
    {
      id: 'rare_viral_podcast_guest',
      title: '✨ Jemputan Tetamu Podcast Nombor 1 Negara',
      category: 'Peluang Terhad',
      icon: '🎙️',
      minAge: 16,
      maxAge: 85,
      cost: 0,
      energyCost: 1,
      isRare: true,
      preferredTraits: ['charismatic', 'cunning'],
      encounterGroup: 'social',
      desc: 'PELUANG TERHAD: Hos podcast paling popular di {country} menjemput anda berkongsi kisah hidup dan pandangan secara langsung!',
      outcomes: [
        { tier: 'great', text: 'Klip petikan kata-kata anda dalam episod itu tular jutaan tontonan! Anda dihujani pujian, pengikut baru dan tawaran kerjasama!', stats: { happiness: 19, smarts: 5 }, moneyUsd: 1600, fame: 15, followers: 26000, rep: 9 },
        { tier: 'normal', text: 'Perbualan sejam yang lancar dan menghiburkan — ramai pendengar menghantar mesej positif.', stats: { happiness: 12, smarts: 3 }, moneyUsd: 350, fame: 6, followers: 4200, rep: 3 },
        { tier: 'twist', text: 'Satu kenyataan spontan anda disalah tafsir oleh netizen sehingga mencetuskan perdebatan hangat di ruangan komen!', stats: { happiness: -7 }, fame: 5, rep: -5, stress: 11 }
      ]
    },
    {
      id: 'rare_angel_hackathon_pitch',
      title: '✨ Pitch Idea Di Hadapan Pelabur Angel',
      category: 'Peluang Terhad',
      icon: '🚀',
      minAge: 17,
      maxAge: 75,
      cost: 50,
      energyCost: 1,
      isRare: true,
      preferredTraits: ['ambitious', 'cunning'],
      encounterGroup: 'hustle',
      desc: 'PELUANG TERHAD: Anda diberi slot 5 minit di pentas inovasi {city} untuk membentangkan idea projek kepada panel pemodal teroka!',
      outcomes: [
        { tier: 'great', text: 'GERAN PELABURAN DILULUSKAN! Panel pelabur terpukau dengan pembentangan anda dan menyuntik dana tunai serta bimbingan!', stats: { smarts: 10, happiness: 20 }, moneyUsd: 6500, fame: 8, rep: 10, stress: -8 },
        { tier: 'normal', text: 'Anda memenangi anugerah idea harapan berserta hadiah wang tunai dan kad nama pelabur.', stats: { smarts: 6, happiness: 12 }, moneyUsd: 1100, rep: 4 },
        { tier: 'twist', text: 'Slaid pembentangan gagal berfungsi dan panel pelabur mengkritik unjuran kewangan anda secara terbuka!', stats: { happiness: -8, smarts: 3 }, stress: 11 }
      ]
    },
    {
      id: 'rare_lost_heirloom_reward',
      title: '✨ Terjumpa Barang Berharga Milik Tokoh Ternama',
      category: 'Peluang Terhad',
      icon: '💎',
      minAge: 10,
      maxAge: 90,
      cost: 0,
      energyCost: 1,
      isRare: true,
      preferredTraits: ['empathetic', 'devout'],
      encounterGroup: 'volunteer',
      desc: 'PELUANG TERHAD: Semasa berjalan di {city}, anda terjumpa beg dokumen dan barang kemas pusaka milik keluarga tokoh terkemuka!',
      outcomes: [
        { tier: 'great', text: 'Anda memulangkan semula kesemuanya dengan penuh amanah! Tokoh tersebut sangat terharu lalu memberi ganjaran besar dan memuji nama keluarga anda!', stats: { happiness: 20 }, moneyUsd: 4200, karma: 18, rep: 12, fame: 6, stress: -14 },
        { tier: 'normal', text: 'Pemiliknya mengucapkan ribuan terima kasih atas kejujuran anda dan menghulurkan saguhati penghargaan.', stats: { happiness: 13 }, moneyUsd: 900, karma: 12, rep: 5, stress: -8 },
        { tier: 'twist', text: 'Anda menunggu lama di balai polis untuk urusan penyerahan rasmi, namun hati tetap tenang kerana berlaku jujur.', stats: { happiness: 7 }, karma: 10, rep: 3 }
      ]
    }
  ],

  // --------------------------------------------------------------------------
  // 4. 24 PERTEMUAN MINI INTERAKTIF (REAL-WORLD PLOT TWISTS — 35–45% PELUANG)
  // --------------------------------------------------------------------------
  MINI_ENCOUNTERS: [
    // === A. HIKING & OUTDOOR (5 Pertemuan) ===
    {
      id: 'enc_hike_injured_stranger',
      groups: ['hiking', 'outdoor'],
      icon: '⛈️',
      title: 'Hujan Lebat & Pendaki Terseliuh Kaki!',
      text: 'Ketika berada di pertengahan denai {mountain}, hujan mula turun dengan lebat. Anda terserempak dengan seorang pendaki lain yang terduduk kesakitan kerana buku lalinya terseliuh teruk!',
      choices: [
        {
          label: 'Tolong papah dia turun perlahan-lahan ke kaki bukit',
          hint: 'Karma ++, Reputasi Keluarga +, peluang dapat Kawan Baru!',
          effect: { stats: { health: -4, happiness: 12 }, karma: 12, rep: 5, addFriend: 'Rakan Pendaki', outcomeText: 'Anda membatalkan hasrat ke puncak demi memapah pendaki itu turun dengan selamat. Dia amat terhutang budi dan kini menjadi sahabat baharu anda!' }
        },
        {
          label: 'Kongsi bekalan ubat & baju hujan, kemudian panggil renjer',
          hint: 'Seimbang, Karma +, selamat',
          effect: { stats: { happiness: 9, smarts: 3 }, karma: 7, rep: 2, outcomeText: 'Anda membalut kakinya, memberikan baju hujan dan menghubungi pasukan renjer sebelum meneruskan perjalanan dengan berhati-hati.' }
        },
        {
          label: 'Teruskan pendakian ke puncak sebelum cuaca makin buruk',
          hint: 'Capai puncak (Kesihatan +), tetapi Karma -',
          effect: { stats: { health: 8, happiness: 5 }, karma: -8, stress: 4, outcomeText: 'Anda nekad meneruskan larian ke puncak {mountain}, namun rasa bersalah sedikit mengganggu fikiran anda.' }
        }
      ]
    },
    {
      id: 'enc_hike_fork_trail',
      groups: ['hiking'],
      icon: '🧭',
      title: 'Persimpangan Denai Lama Tidak Bertanda',
      text: 'Di laluan {mountain}, anda menjumpai satu simpang denai lama yang dipenuhi bunga hutan liar tetapi tiada dalam peta aplikasi anda.',
      choices: [
        {
          label: 'Teroka denai rahsia itu dengan berhati-hati',
          hint: 'Peluang jumpa pemandangan epik atau tersesat sedikit',
          effect: { stats: { happiness: 14, health: 4 }, fame: 4, followers: 1200, outcomeText: 'Keberanian berbaloi! Denai itu membawa anda ke tebing batu dengan panorama paling indah di {mountain} yang belum pernah tular!' }
        },
        {
          label: 'Tandakan koordinat GPS & kekal di laluan utama yang selamat',
          hint: 'Kepintaran +, Kesihatan +, tiada risiko',
          effect: { stats: { smarts: 4, health: 6, happiness: 7 }, stress: -8, outcomeText: 'Anda membuat keputusan bijak kekal di laluan rasmi dan menamatkan pendakian dengan lancar.' }
        },
        {
          label: 'Tanya kumpulan pendaki tempatan yang baru tiba',
          hint: 'Sosial +, peluang kenal Rakan Baru',
          effect: { stats: { happiness: 10 }, addFriend: 'Komuniti Hiking', outcomeText: 'Pendaki tempatan itu mengajak anda mendaki bersama-sama melalui laluan rahsia dengan selamat sambil berkongsi cerita!' }
        }
      ]
    },
    {
      id: 'enc_outdoor_rare_wildlife',
      groups: ['hiking', 'outdoor'],
      icon: '🦌',
      title: 'Terserempak Hidupan Liar Nadir!',
      text: 'Suasana tiba-tiba sunyi. Hanya beberapa meter di hadapan anda di {mountain}, muncul seekor haiwan liar nadir yang sangat sukar ditemui!',
      choices: [
        {
          label: 'Rakam foto & video secara senyap tanpa mengganggunya',
          hint: 'Potensi tular di media sosial (Populariti & Pengikut ++)',
          effect: { stats: { happiness: 15 }, fame: 7, followers: 3500, moneyUsd: 120, outcomeText: 'Rakaman jarak dekat anda sangat jelas dan tular di portal pencinta alam {country}!' }
        },
        {
          label: 'Simpan telefon dan hayati detik ajaib itu dengan mata sendiri',
          hint: 'Ketenangan Jiwa ++, Stres --',
          effect: { stats: { happiness: 16, health: 4 }, karma: 5, stress: -18, outcomeText: 'Anda bertentang mata dengan hidupan liar itu dalam keheningan hutan — satu kenangan jiwa yang tidak ternilai.' }
        },
        {
          label: 'Berundur perlahan-lahan demi keselamatan',
          hint: 'Selamat & berdisiplin',
          effect: { stats: { smarts: 4, happiness: 6 }, stress: -6, outcomeText: 'Anda berundur dengan tenang tanpa mengejutkan haiwan tersebut.' }
        }
      ]
    },
    {
      id: 'enc_outdoor_lost_gear',
      groups: ['outdoor', 'hiking'],
      icon: '🎒',
      title: 'Beg Kamera Tercicir Di Tepi Tebing',
      text: 'Semasa berehat di {coast}, anda ternampak sebuah beg kalis air berisi kamera mahal dan dompet tersangkut di celah batu berhampiran air.',
      choices: [
        {
          label: 'Panjat turun ambil & cari pemiliknya melalui kad pengenalan',
          hint: 'Karma ++, Reputasi ++, saguhati tunai',
          effect: { stats: { happiness: 14 }, moneyUsd: 260, karma: 14, rep: 5, outcomeText: 'Pemiliknya seorang jurugambar pelancong yang hampir menangis kegembiraan! Dia menghulurkan wang saguhati dan memuji kejujuran anda.' }
        },
        {
          label: 'Serahkan terus kepada pondok pengawal / renjer kawasan',
          hint: 'Karma +, selamat tanpa risiko',
          effect: { stats: { happiness: 8 }, karma: 8, rep: 2, outcomeText: 'Renjer bertugas merekodkan penyerahan anda dan mengucapkan terima kasih atas sikap bertanggungjawab.' }
        },
        {
          label: 'Ambil wang tunai di dalamnya dan tinggalkan beg di situ',
          hint: 'Dapat duit segera, tetapi Karma --',
          effect: { stats: { happiness: 2 }, moneyUsd: 180, karma: -16, stress: 6, outcomeText: 'Anda mengambil wang tunai di dalamnya secara senyap-senyap, namun hati terasa tidak tenteram.' }
        }
      ]
    },
    {
      id: 'enc_outdoor_sunset_campfire',
      groups: ['outdoor', 'hiking'],
      icon: '🔥',
      title: 'Jemputan Unggun Api Kumpulan Pengembara',
      text: 'Menjelang senja di {coast}, sekumpulan pengembara ramah menjemput anda menyertai bulatan unggun api mereka yang sedang memanggang makanan laut segar.',
      choices: [
        {
          label: 'Sertai mereka, kongsi makanan & bertukar kisah hidup',
          hint: 'Gembira ++, peluang dapat Kawan / Kenalan Baru!',
          effect: { stats: { happiness: 15, health: 4 }, addFriend: 'Kembara Pantai', stress: -14, outcomeText: 'Malam yang penuh gelak tawa, ikan bakar segar dan muzik gitar akustik! Anda mendapat sahabat baru yang sekepala.' }
        },
        {
          label: 'Berbual sekejap dengan sopan sebelum kembali ke khemah sendiri',
          hint: 'Santai & tenang',
          effect: { stats: { happiness: 10 }, stress: -10, outcomeText: 'Anda menikmati sepotong hidangan bakar bersama mereka sebelum berehat dengan tenang di khemah.' }
        },
        {
          label: 'Tolak dengan baik kerana mahu menikmati malam bersendirian',
          hint: 'Fokus ketenangan diri (Stres --)',
          effect: { stats: { happiness: 8, smarts: 3 }, stress: -12, outcomeText: 'Anda menikmati keheningan malam seorang diri sambil mendengar deruan ombak.' }
        }
      ]
    },

    // === B. TRAVEL & JALAN-JALAN (5 Pertemuan) ===
    {
      id: 'enc_travel_bus_breakdown',
      groups: ['travel'],
      icon: '🚌',
      title: 'Bas / Tren Tergendala Di Pekan Kecil!',
      text: 'Dalam perjalanan merentasi {country}, pengangkutan yang anda naiki mengalami kerosakan teknikal di sebuah pekan kecil yang tenang selama 3 jam.',
      choices: [
        {
          label: 'Berbual dengan pengembara di sebelah & teroka pekan bersama',
          hint: 'Peluang tinggi dapat Kawan Baru atau Calon Pasangan!',
          effect: { stats: { happiness: 15 }, addRomanticOrFriend: true, stress: -10, outcomeText: 'Rupa-rupanya penumpang di sebelah anda sangat serasi! Anda berdua meneroka kafe klasik pekan itu dan bertukar nombor telefon!' }
        },
        {
          label: 'Jalan solo teroka pasar tempatan & warung pekan itu',
          hint: 'Gembira +, Kepintaran +, jumpa juadah unik',
          effect: { stats: { happiness: 12, smarts: 4 }, stress: -8, outcomeText: 'Kerosakan itu membawa hikmah — anda menemui warung tradisional yang sangat sedap dan murah di pekan kecil tersebut!' }
        },
        {
          label: 'Tuntut pampasan tiket & sewa kereta sewa kongsi ke destinasi',
          hint: 'Kepintaran +, jimat masa',
          effect: { stats: { smarts: 5, happiness: 6 }, moneyUsd: 25, outcomeText: 'Anda bijak menguruskan tuntutan bayaran balik dan berkongsi teksi dengan penumpang lain untuk tiba tepat pada waktunya.' }
        }
      ]
    },
    {
      id: 'enc_travel_hostel_backpacker',
      groups: ['travel'],
      icon: '🧳',
      title: 'Kenalan Pengembara Di Ruang Tamu Penginapan',
      text: 'Di ruang santai penginapan anda di {city2}, seorang pengembara solo yang peramah menyapa anda dan mengajak berkongsi jadual jalan-jalan esok.',
      choices: [
        {
          label: 'Setuju jelajah bersama & tukar nombor telefon!',
          hint: 'Tambah Rakan / Kenalan Istimewa dalam senarai Hubungan!',
          effect: { stats: { happiness: 16 }, addRomanticOrFriend: true, stress: -12, outcomeText: 'Anda berdua menjelajah sudut tersembunyi bandar sepanjang hari! Hubungan baharu yang bermakna bermula dari pertemuan spontan ini.' }
        },
        {
          label: 'Bertukar tip lokasi rahsia & peta makanan sahaja',
          hint: 'Kepintaran +, Gembira +',
          effect: { stats: { happiness: 10, smarts: 4 }, stress: -7, outcomeText: 'Dia memberikan senarai lokasi makan rahsia penduduk tempatan yang menjimatkan banyak wang anda!' }
        },
        {
          label: 'Kekal dengan rancangan solo anda sendiri',
          hint: 'Kebebasan penuh, Stres --',
          effect: { stats: { happiness: 9 }, stress: -10, outcomeText: 'Anda mengucapkan selamat maju jaya kepadanya dan menikmati kebebasan jadual solo anda.' }
        }
      ]
    },
    {
      id: 'enc_travel_local_festival',
      groups: ['travel'],
      icon: '🎊',
      title: 'Terserempak Pesta Budaya Tahunan!',
      text: 'Sebaik tiba di dataran utama {city2}, jalan raya ditutup untuk perarakan pesta budaya dan muzik tradisional tahunan {country} yang penuh warna-warni!',
      choices: [
        {
          label: 'Menari, cuba pakaian tradisi & sertai acara penduduk tempatan!',
          hint: 'Gembira ++, Penyesuaian Budaya ++, Populariti +',
          effect: { stats: { happiness: 17, looks: 2, adaptation: 10 }, fame: 4, followers: 1400, stress: -14, outcomeText: 'Penduduk tempatan bersorak gembira melihat anda turut serta meraikan budaya mereka!' }
        },
        {
          label: 'Rakam dokumentari pendek suasana pesta untuk media sosial',
          hint: 'Pengikut ++, Kepintaran +',
          effect: { stats: { happiness: 12, smarts: 4 }, fame: 6, followers: 2800, moneyUsd: 80, outcomeText: 'Video suasana pesta budaya yang anda sunting menerima ribuan perkongsian!' }
        },
        {
          label: 'Nikmati juadah pesta dari tepi dataran dengan santai',
          hint: 'Gembira +, Stres -',
          effect: { stats: { happiness: 10, health: 2 }, stress: -9, outcomeText: 'Anda menikmati pelbagai juadah perayaan sambil menyaksikan persembahan dari tempat duduk yang selesa.' }
        }
      ]
    },
    {
      id: 'enc_travel_seat_upgrade',
      groups: ['travel'],
      icon: '💺',
      title: 'Tawaran Tukar Tempat Duduk Dengan Usahawan',
      text: 'Semasa di dalam perjalanan di {country}, seorang ahli perniagaan meminta izin bertukar tempat duduk dengan anda supaya dia dapat duduk bersebelahan rakan kongsinya.',
      choices: [
        {
          label: 'Setuju dengan senyuman mesra & berbual ringkas',
          hint: 'Karma +, peluang dapat tip bisnes / wang saguhati!',
          effect: { stats: { happiness: 12, smarts: 4 }, moneyUsd: 250, karma: 6, rep: 3, outcomeText: 'Ahli perniagaan itu sangat menghargai budi bahasa anda lalu menghadiahkan baucar eksklusif serta berkongsi peluang pelaburan!' }
        },
        {
          label: 'Setuju dengan syarat dapat tempat duduk tepi tingkap yang selesa',
          hint: 'Gembira +, Stres -',
          effect: { stats: { happiness: 10 }, stress: -8, outcomeText: 'Anda mendapat tempat duduk tepi tingkap yang lebih luas dan menikmati pemandangan sepanjang perjalanan.' }
        },
        {
          label: 'Kekal di tempat duduk asal yang telah anda tempah',
          hint: 'Tiada perubahan',
          effect: { stats: { happiness: 5 }, outcomeText: 'Anda menolak dengan sopan dan meneruskan perjalanan di tempat duduk pilihan anda.' }
        }
      ]
    },
    {
      id: 'enc_travel_souvenir_artisan',
      groups: ['travel'],
      icon: '🧿',
      title: 'Tukang Kraf Tua Di Lorong Warisan',
      text: 'Di sebuah lorong tenang berhampiran {heritage}, seorang tukang kraf warga emas memanggil anda melihat hasil ukiran tangan warisan keluarganya.',
      choices: [
        {
          label: 'Beli hasil krafnya tanpa menawar harga & dengar kisahnya',
          hint: 'Karma ++, Kepintaran +, cenderahati bernilai',
          effect: { stats: { happiness: 14, smarts: 5 }, moneyUsd: -30, karma: 10, rep: 3, stress: -10, outcomeText: 'Pakcik itu sebak kerana anda menghargai seni warisannya dan menghadiahkan satu ukiran khas tambahan yang sangat bernilai!' }
        },
        {
          label: 'Bantu ambil gambar kedainya & tularkan di media sosial',
          hint: 'Karma ++, Pengikut +, Reputasi Keluarga +',
          effect: { stats: { happiness: 13 }, karma: 9, fame: 4, followers: 1800, rep: 4, outcomeText: 'Hantaran anda membuatkan kedai kecil tukang kraf itu diserbu pelancong keesokan harinya!' }
        },
        {
          label: 'Tawar-menawar untuk dapatkan harga paling murah',
          hint: 'Jimat wang, untung jual semula',
          effect: { stats: { happiness: 7, smarts: 2 }, moneyUsd: 65, outcomeText: 'Anda berjaya membeli kraf tersebut pada harga diskaun dan menjualnya semula kepada pengumpul.' }
        }
      ]
    },

    // === C. THRIFT / BUNDLE & BARANG ANTIK (4 Pertemuan) ===
    {
      id: 'enc_thrift_antique_watch_jacket',
      groups: ['thrift'],
      icon: '⌚',
      title: 'Terjumpa Jam & Jaket Antik Bernilai Tinggi!',
      text: 'Ketika menyelak timbunan barang di {market}, mata anda tertancap pada seutas jam mekanikal lama dan sehelai jaket kulit vintaj yang dijual pada harga sangat murah kerana penjual menyangka ia barang biasa!',
      choices: [
        {
          label: 'Beli segera & jual semula kepada pengumpul barang antik',
          hint: 'Untung tunai besar ($$$)!',
          effect: { stats: { happiness: 15, smarts: 4 }, moneyUsd: 880, outcomeText: 'Tepat sangkaan anda! Pengumpul vintaj mengesahkan ia edisi nadir 1970-an dan membelinya dengan harga tunai yang sangat lumayan!' }
        },
        {
          label: 'Beli dan simpan untuk dipakai sendiri sebagai koleksi peribadi',
          hint: 'Penampilan ++, Gembira ++, Reputasi +',
          effect: { stats: { happiness: 14, looks: 8 }, rep: 3, stress: -8, outcomeText: 'Jaket dan jam vintaj itu sangat padan dengan gaya anda — semua orang memuji penampilan klasik anda!' }
        },
        {
          label: 'Cuba tawar harga lebih rendah lagi daripada penjual',
          hint: 'Berisiko disambar pembeli lain!',
          effect: { stats: { happiness: 6, smarts: 2 }, moneyUsd: 350, outcomeText: 'Semasa anda sibuk menawar, pembeli sebelah menyambar jam tersebut — mujur anda masih sempat membeli jaket kulit itu dan mendapat untung sederhana!' }
        }
      ]
    },
    {
      id: 'enc_thrift_rival_collector',
      groups: ['thrift'],
      icon: '🕶️',
      title: 'Perebutan Barang Rare Dengan Pembeli Lain!',
      text: 'Anda dan seorang lagi pemburu bundle di {market} memegang item edisi terhad yang sama pada masa yang serentak!',
      choices: [
        {
          label: 'Cadangkan kerjasama: kongsi katalog & jual bersama',
          hint: 'Dapat Kawan Baru + kongsi untung!',
          effect: { stats: { happiness: 12, smarts: 4 }, moneyUsd: 260, addFriend: 'Komuniti Bundle', outcomeText: 'Dia bersetuju! Anda berdua berkongsi rangkaian pembeli vintaj dan menjadi rakan niaga bundle yang rapat.' }
        },
        {
          label: 'Tawar harga sedikit lebih tinggi kepada pemilik gerai',
          hint: 'Pastikan barang milik anda (Penampilan + / Untung +)',
          effect: { stats: { happiness: 10, looks: 4 }, moneyUsd: 320, outcomeText: 'Pemilik gerai terus menyerahkan item itu kepada anda dan anda berjaya menjualnya semula dengan untung bersih.' }
        },
        {
          label: 'Mengalah dengan senyuman — cari di rak sebelah',
          hint: 'Karma +, kejutan rezeki lain',
          effect: { stats: { happiness: 11 }, moneyUsd: 190, karma: 6, outcomeText: 'Kerana sikap tenang anda, pemilik gerai mengeluarkan satu kotak stok baru dari belakang kedai khas untuk anda pilih dahulu!' }
        }
      ]
    },
    {
      id: 'enc_thrift_hidden_cash_pocket',
      groups: ['thrift'],
      icon: '💵',
      title: 'Sampul Wang Lama Di Dalam Poket Kot!',
      text: 'Semasa mencuba sehelai kot tebal terpakai di {market}, jari anda terasa satu sampul surat lama berisi kepingan wang tunai dan sekeping gambar keluarga lama di dalam poket dalam!',
      choices: [
        {
          label: 'Cari waris pemilik asal melalui nama di belakang gambar',
          hint: 'Karma +++, Reputasi Keluarga ++, kisah menyentuh hati',
          effect: { stats: { happiness: 16 }, moneyUsd: 200, karma: 16, rep: 6, outcomeText: 'Waris keluarga itu sangat terharu menerima semula gambar kenangan arwah datuk mereka dan menghadiahkan wang tersebut kepada anda sebagai tanda kasih!' }
        },
        {
          label: 'Serahkan kepada pemilik kedai bundle untuk disimpan',
          hint: 'Karma +, jujur',
          effect: { stats: { happiness: 9 }, karma: 8, rep: 2, outcomeText: 'Pemilik kedai memuji kejujuran anda dan memberikan kot tersebut secara percuma kepada anda!' }
        },
        {
          label: 'Beli kot itu seperti biasa dan simpan wang di dalamnya',
          hint: 'Dapat wang tunai terus, Karma -',
          effect: { stats: { happiness: 8 }, moneyUsd: 340, karma: -6, outcomeText: 'Anda membeli kot tersebut dengan harga murah dan membawa pulang wang tunai yang terselit di dalamnya.' }
        }
      ]
    },

    // === D. FOOD HUNTING & KAFE (4 Pertemuan) ===
    {
      id: 'enc_food_viral_disappointment_or_gem',
      groups: ['food'],
      icon: '🍲',
      title: 'Drama Kedai Makan Viral & Resipi Rahsia!',
      text: 'Anda tiba di {foodSpot}. Kedai viral pertama yang mempunyai barisan panjang rupa-rupanya agak indah khabar dari rupa, tetapi di sebelahnya ada warung kecil milik seorang tukang masak veteran yang bau masakannya sangat memikat!',
      choices: [
        {
          label: 'Singgah warung tukang masak veteran & puji masakannya',
          hint: 'Makanan luar biasa sedap + dapat Resipi Rahsia!',
          effect: { stats: { happiness: 16, smarts: 5, health: 3 }, karma: 5, stress: -12, outcomeText: 'Hidangannya jauh lebih sedap! Tukang masak tua itu sangat gembira lalu membisikkan petua rempah rahsia keluarganya kepada anda!' }
        },
        {
          label: 'Buat ulasan jujur & tularkan warung kecil sebelah itu',
          hint: 'Pengikut ++, Karma ++, Reputasi +',
          effect: { stats: { happiness: 14 }, fame: 6, followers: 2600, karma: 9, rep: 4, outcomeText: 'Video ulasan jujur anda mengangkat warung kecil itu menjadi tumpuan ramai dan netizen memuji keikhlasan anda!' }
        },
        {
          label: 'Tegur pemilik kedai viral dengan kritikan membina secara tertutup',
          hint: 'Kepintaran +, dapat baucar ganti rugi',
          effect: { stats: { happiness: 9, smarts: 4 }, moneyUsd: 45, outcomeText: 'Pengurus kedai viral itu memohon maaf secara profesional, memulangkan wang anda dan menghidangkan menu baharu yang lebih baik.' }
        }
      ]
    },
    {
      id: 'enc_food_share_table_stranger',
      groups: ['food'],
      icon: '☕',
      title: 'Kongsi Meja Di Kafe Yang Penuh Sesak',
      text: 'Kafe popular di {city} penuh sesak pada waktu puncak. Seorang pelanggan yang kelihatan kemas dan ramah bertanya sama ada dia boleh berkongsi meja dua kerusi dengan anda.',
      choices: [
        {
          label: 'Pelawa duduk dengan mesra & mulakan perbualan santai',
          hint: 'Peluang dapat Kawan Baru / Calon Pasangan / Rangkaian!',
          effect: { stats: { happiness: 14 }, addRomanticOrFriend: true, rep: 2, stress: -8, outcomeText: 'Perbualan mengenai kopi bertukar menjadi sembang rancak selama sejam! Dia belanja kopi anda dan anda berdua bertukar nombor telefon.' }
        },
        {
          label: 'Benarkan duduk sambil masing-masing fokus buat kerja sendiri',
          hint: 'Tenang & sopan (Karma +)',
          effect: { stats: { happiness: 8, smarts: 3 }, karma: 3, stress: -6, outcomeText: 'Suasana tenang dan harmoni — dia mengucapkan terima kasih sebelum beredar.' }
        },
        {
          label: 'Bungkus minuman dan jalan-jalan di taman berdekatan',
          hint: 'Kesihatan +, Stres -',
          effect: { stats: { happiness: 9, health: 3 }, stress: -9, outcomeText: 'Anda menikmati kopi sambil berjalan santai menghirup udara petang di taman {city}.' }
        }
      ]
    },
    {
      id: 'enc_food_secret_menu_challenge',
      groups: ['food'],
      icon: '🌶️',
      title: 'Cabaran Menu Rahsia Pedas Berapi!',
      text: 'Pemilik restoran di {foodSpot} mencabar pelanggan mencuba hidangan "Menu Rahsia Tahap Maksimum" — sesiapa yang habis dalam masa 15 minit makan percuma dan dapat hadiah!',
      choices: [
        {
          label: 'Sahut cabaran! Habiskan sampai licin!',
          hint: 'Menang wang & populariti, tetapi pedas menyengat!',
          effect: { stats: { happiness: 14, health: -4 }, moneyUsd: 100, fame: 5, followers: 1500, outcomeText: 'Peluh memercik di dahi, tetapi anda BERJAYA menghabiskan suapan terakhir! Seluruh restoran bertepuk tangan dan gambar anda digantung di dinding juara!' }
        },
        {
          label: 'Minta tahap kepedasan sederhana untuk nikmati rasa sebenar',
          hint: 'Gembira ++, Kesihatan selamat',
          effect: { stats: { happiness: 12, health: 2 }, stress: -9, outcomeText: 'Pilihan bijak! Anda dapat menikmati keenakan rempah sebenar tanpa menyeksa perut.' }
        },
        {
          label: 'Rakam gelagat pelanggan lain yang menyahut cabaran',
          hint: 'Hiburan + Pengikut media sosial',
          effect: { stats: { happiness: 10 }, followers: 900, stress: -6, outcomeText: 'Gelagat lucu peserta cabaran pedas itu mencuit hati semua orang di restoran.' }
        }
      ]
    },

    // === E. SUKARELAWAN, SOSIAL & KOMUNITI (3 Pertemuan) ===
    {
      id: 'enc_vol_reporter_interview',
      groups: ['volunteer', 'social'],
      icon: '📰',
      title: 'Wartawan Tempatan Merakam Kebaikan Anda!',
      text: 'Semasa anda sedang tekun membantu komuniti di {city}, seorang wartawan dan jurukamera akhbar utama {country} menghampiri anda untuk membuat liputan khas!',
      choices: [
        {
          label: 'Beri temu bual ikhlas & ajak orang ramai turut membantu',
          hint: 'Reputasi Keluarga +++, Karma ++, Populariti ++',
          effect: { stats: { happiness: 16 }, karma: 12, rep: 9, fame: 8, followers: 3200, outcomeText: 'Temu bual penuh rendah diri anda disiarkan di berita utama! Nama baik keluarga anda harum di seluruh {city}.' }
        },
        {
          label: 'Minta wartawan fokus kepada penganjur & golongan yang dibantu',
          hint: 'Karma +++, ketenangan jiwa mendalam',
          effect: { stats: { happiness: 15 }, karma: 16, rep: 5, stress: -14, outcomeText: 'Sikap ikhlas anda yang tidak mengejar publisiti sangat dihormati oleh seluruh ahli komuniti.' }
        },
        {
          label: 'Gunakan peluang itu untuk bina rangkaian dengan penaja korporat',
          hint: 'Reputasi ++, peluang projek/dana tambahan',
          effect: { stats: { happiness: 12, smarts: 4 }, moneyUsd: 350, rep: 6, karma: 6, outcomeText: 'Seorang pengarah CSR korporat tertarik dengan kepimpinan anda dan menawarkan elaun kerjasama projek komuniti!' }
        }
      ]
    },
    {
      id: 'enc_social_Networking_mentor',
      groups: ['social', 'creative'],
      icon: '🤝',
      title: 'Teguran Tokoh Berpengalaman Di Acara Komuniti',
      text: 'Dalam suasana santai di {city}, seorang tokoh senior yang disegani dalam bidang profesional memuji cara anda membawa diri dan mengajak berbual.',
      choices: [
        {
          label: 'Minta nasihat kerjaya & tawarkan diri untuk belajar',
          hint: 'Kepintaran ++, Reputasi Keluarga ++, peluang mentor',
          effect: { stats: { smarts: 8, happiness: 12 }, rep: 6, moneyUsd: 200, outcomeText: 'Beliau berkongsi ilmu berharga selama sejam dan memperkenalkan anda kepada lingkaran profesionalnya di {city}!' }
        },
        {
          label: 'Berbual mesra seperti kawan & tukar hubungan',
          hint: 'Tambah Rakan Baru berpengaruh + Gembira +',
          effect: { stats: { happiness: 13 }, addFriend: 'Kenalan Profesional', rep: 4, outcomeText: 'Hubungan persahabatan yang baik terjalin dan beliau sering menjemput anda ke acara tertutup.' }
        },
        {
          label: 'Bentangkan idea projek sampingan anda secara spontan',
          hint: 'Berani! Untung tunai jika berjaya',
          effect: { stats: { happiness: 11, smarts: 4 }, moneyUsd: 450, rep: 3, outcomeText: 'Beliau kagum dengan keberanian anda dan terus menempah perkhidmatan projek sampingan anda!' }
        }
      ]
    },
    {
      id: 'enc_social_lost_child_mall',
      groups: ['social', 'volunteer'],
      icon: '🧒',
      title: 'Kanak-Kanak Sesat Menangis Di Tempat Awam',
      text: 'Di tengah orang ramai di {city}, anda ternampak seorang kanak-kanak kecil menangis ketakutan kerana terlepas daripada pegangan tangan ibu bapanya.',
      choices: [
        {
          label: 'Tenangkan kanak-kanak itu & bawa ke kaunter keselamatan',
          hint: 'Karma +++, Reputasi Keluarga ++',
          effect: { stats: { happiness: 15 }, karma: 15, rep: 6, stress: -8, outcomeText: 'Ibu bapanya berlari memeluk anak mereka sambil menangis kesyukuran dan mendoakan kesejahteraan hidup anda sekeluarga!' }
        },
        {
          label: 'Belikan aiskrim sementara pengawal membuat pengumuman pembesar suara',
          hint: 'Karma ++, Gembira ++',
          effect: { stats: { happiness: 14 }, moneyUsd: -5, karma: 12, rep: 4, outcomeText: 'Kanak-kanak itu berhenti menangis dan tersenyum sehinggalah ibunya tiba beberapa minit kemudian.' }
        }
      ]
    },

    // === F. KESIHATAN, SUKAN & SIDE HUSTLE (3 Pertemuan) ===
    {
      id: 'enc_fitness_coach_scout',
      groups: ['fitness'],
      icon: '🏆',
      title: 'Jurulatih Sukan Kagum Dengan Stamina Anda!',
      text: 'Selepas sesi latihan di {city}, seorang jurulatih kecergasan bertauliah menghampiri anda kerana kagum dengan disiplin dan stamina fizikal anda.',
      choices: [
        {
          label: 'Terima jemputan sesi latihan elit percuma bersama pasukannya',
          hint: 'Kesihatan +++, Penampilan ++',
          effect: { stats: { health: 14, looks: 4, happiness: 11 }, stress: -10, outcomeText: 'Teknik latihan profesional yang diajarkannya melonjakkan tahap kecergasan dan bentuk badan anda!' }
        },
        {
          label: 'Jadi duta komuniti gimnasium / kelab sukan mereka',
          hint: 'Dapat elaun tajaan + Populariti + Kawan Baru',
          effect: { stats: { health: 8, happiness: 12 }, moneyUsd: 280, fame: 4, addFriend: 'Rakan Sukan', outcomeText: 'Anda menerima tajaan pakaian sukan, elaun bulanan dan rakan latihan baharu!' }
        },
        {
          label: 'Kekal berlatih mengikut rentak santai sendiri',
          hint: 'Stres --, tiada tekanan jadual',
          effect: { stats: { health: 7, happiness: 9 }, stress: -14, outcomeText: 'Anda mengucapkan terima kasih dan terus menikmati rutin senaman bebas tekanan.' }
        }
      ]
    },
    {
      id: 'enc_hustle_big_client_offer',
      groups: ['hustle', 'creative'],
      icon: '💼',
      title: 'Tawaran Kontrak Mengejut Daripada Pelanggan Besar!',
      text: 'Seorang pelanggan korporat di {city} sangat tertarik dengan hasil kerja sampingan anda dan menawarkan kontrak ekspres bernilai tinggi yang perlu disiapkan dalam masa 48 jam!',
      choices: [
        {
          label: 'Terima cabaran & pulun siapkan dengan kualiti terbaik!',
          hint: 'Bayaran tunai lumayan ($$$) + Reputasi ++ (Stres + sedikit)',
          effect: { stats: { smarts: 6, happiness: 13, health: -3 }, moneyUsd: 950, rep: 5, stress: 6, outcomeText: 'Dua malam kurang tidur berbaloi apabila pelanggan membayar penuh bersama bonus prestasi yang sangat lumayan!' }
        },
        {
          label: 'Runding tempoh masa lebih munasabah dengan bayaran sederhana',
          hint: 'Seimbang: dapat wang + kesihatan terjaga',
          effect: { stats: { smarts: 5, happiness: 10 }, moneyUsd: 520, rep: 3, stress: -4, outcomeText: 'Pelanggan menghormati sikap profesional anda dan bersetuju memberi tempoh seminggu.' }
        },
        {
          label: 'Ajak rakan bekerjasama & bahagi dua keuntungan',
          hint: 'Dapat wang + erat persahabatan + tiada stres',
          effect: { stats: { happiness: 12 }, moneyUsd: 420, karma: 5, rep: 3, stress: -6, outcomeText: 'Kerja siap separuh masa dengan bantuan rakan dan kedua-dua pihak gembira menerima bahagian masing-masing!' }
        }
      ]
    },
    {
      id: 'enc_hustle_viral_customer_review',
      groups: ['hustle'],
      icon: '🌟',
      title: 'Pelanggan Rupa-Rupanya Pempengaruh Terkenal!',
      text: 'Ketika anda sedang menguruskan side hustle anda di {city}, anda menyedari pelanggan di hadapan anda ialah seorang pempengaruh terkenal dengan ratusan ribu pengikut!',
      choices: [
        {
          label: 'Beri layanan terbaik tanpa meminta sebarang promosi percuma',
          hint: 'Dia kagum dengan keikhlasan anda -> ulasan tular organik!',
          effect: { stats: { happiness: 15 }, moneyUsd: 580, fame: 7, followers: 3400, rep: 5, karma: 4, outcomeText: 'Kerana layanan jujur anda, dia memuat naik video pujian secara sukarela sehingga pelanggan baru berpusu-pusu masuk!' }
        },
        {
          label: 'Hadiahkan sampel produk/servis tambahan & ajak bergambar',
          hint: 'Untung ++, Pengikut ++',
          effect: { stats: { happiness: 13, smarts: 3 }, moneyUsd: 440, fame: 5, followers: 2100, rep: 3, outcomeText: 'Dia gembira menanda akaun anda dalam hantarannya dan jualan minggu itu meningkat dua kali ganda!' }
        }
      ]
    }
  ]
};
