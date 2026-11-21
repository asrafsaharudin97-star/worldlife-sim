/* ==========================================================================
   WorldLife — Pangkalan Data Aset & Kekayaan Global (82 Aset Lengkap)
   Hartanah (21), Kenderaan (26), Pelaburan (15), Koleksi & Lelongan (20)
   Bahasa Melayu — Sifar Placeholder
   ========================================================================== */

window.AssetsData = {
  // --------------------------------------------------------------------------
  // 1. TREND PASARAN EKONOMI TAHUNAN (MARKET TREND ENGINE)
  // --------------------------------------------------------------------------
  MARKET_TRENDS: [
    {
      id: 'bull_run',
      label: 'Pasaran Melonjak (Bull Run)',
      icon: '🚀',
      color: '#16a34a',
      headline: '📈 Ekonomi rancak! Pasaran saham, teknologi & hartanah mencatat kenaikan memberangsangkan tahun ini.',
      stockShift: [0.08, 0.24],
      cryptoShift: [0.15, 0.65],
      goldShift: [-0.02, 0.06],
      propertyShift: [0.05, 0.11]
    },
    {
      id: 'stable',
      label: 'Ekonomi Stabil',
      icon: '⚖️',
      color: '#2563eb',
      headline: '⚖️ Pasaran kewangan stabil dengan kadar inflasi terkawal dan pulangan konsisten.',
      stockShift: [0.02, 0.10],
      cryptoShift: [-0.10, 0.22],
      goldShift: [0.02, 0.07],
      propertyShift: [0.03, 0.07]
    },
    {
      id: 'high_inflation',
      label: 'Inflasi Tinggi',
      icon: '🔥',
      color: '#d97706',
      headline: '🔥 Inflasi melonjak! Harga emas, komoditi & sewa hartanah meningkat manakala saham tidak menentu.',
      stockShift: [-0.07, 0.06],
      cryptoShift: [-0.18, 0.28],
      goldShift: [0.08, 0.18],
      propertyShift: [0.04, 0.09]
    },
    {
      id: 'correction',
      label: 'Pembetulan Pasaran',
      icon: '📉',
      color: '#ea580c',
      headline: '📉 Pembetulan pasaran melanda! Pelabur mengambil untung — peluang membeli aset pada harga diskaun.',
      stockShift: [-0.14, 0.02],
      cryptoShift: [-0.35, 0.08],
      goldShift: [0.03, 0.10],
      propertyShift: [-0.04, 0.02]
    },
    {
      id: 'recession',
      label: 'Kejatuhan Ekonomi (Resesi)',
      icon: '🌪️',
      color: '#dc2626',
      headline: '🌪️ AMARAN RESESI! Pasaran saham & kripto merudum, namun emas & bon kerajaan kekal sebagai pelindung nilai.',
      stockShift: [-0.26, -0.06],
      cryptoShift: [-0.55, -0.15],
      goldShift: [0.09, 0.22],
      propertyShift: [-0.10, -0.02]
    }
  ],

  // --------------------------------------------------------------------------
  // 2. HARTANAH — 21 JENIS (12 KEDIAMAN + 9 KOMERSIAL & TANAH)
  // --------------------------------------------------------------------------
  REAL_ESTATE: [
    // Kediaman (12)
    { id: 're_lowcost_flat',    sub: 'Kediaman',  icon: '🏢', name: 'Rumah Kos Rendah / Flat',        baseUsd: 26000,   yieldPct: 6.5, upkeepPct: 1.4, prestige: 0 },
    { id: 're_village_house',   sub: 'Kediaman',  icon: '🏡', name: 'Rumah Kampung Tradisional',      baseUsd: 38000,   yieldPct: 5.0, upkeepPct: 1.3, prestige: 1 },
    { id: 're_studio_apt',      sub: 'Kediaman',  icon: '🏙️', name: 'Pangsapuri Studio Bandar',       baseUsd: 58000,   yieldPct: 6.8, upkeepPct: 1.6, prestige: 1 },
    { id: 're_terrace_1s',      sub: 'Kediaman',  icon: '🏠', name: 'Rumah Teres 1 Tingkat',          baseUsd: 88000,   yieldPct: 5.4, upkeepPct: 1.4, prestige: 2 },
    { id: 're_terrace_2s',      sub: 'Kediaman',  icon: '🏘️', name: 'Rumah Teres 2 Tingkat',          baseUsd: 145000,  yieldPct: 5.2, upkeepPct: 1.5, prestige: 3 },
    { id: 're_modern_condo',    sub: 'Kediaman',  icon: '🏬', name: 'Kondominium Moden Lengkap Fasiliti', baseUsd: 185000, yieldPct: 6.0, upkeepPct: 1.9, prestige: 4 },
    { id: 're_semid',           sub: 'Kediaman',  icon: '🏡', name: 'Rumah Berkembar (Semi-D)',       baseUsd: 290000,  yieldPct: 4.8, upkeepPct: 1.6, prestige: 5 },
    { id: 're_bungalow',        sub: 'Kediaman',  icon: '🏛️', name: 'Banglo Eksklusif Berhalaman Luas', baseUsd: 540000, yieldPct: 4.5, upkeepPct: 1.8, prestige: 7 },
    { id: 're_penthouse',       sub: 'Kediaman',  icon: '🌆', name: 'Penthouse Mewah Puncak Menara',  baseUsd: 980000,  yieldPct: 5.5, upkeepPct: 2.2, prestige: 10 },
    { id: 're_beach_villa',     sub: 'Kediaman',  icon: '🏖️', name: 'Vila Mewah Tepi Pantai',         baseUsd: 1450000, yieldPct: 6.8, upkeepPct: 2.3, prestige: 12 },
    { id: 're_hill_villa',      sub: 'Kediaman',  icon: '⛰️', name: 'Vila Persendirian Tanah Tinggi', baseUsd: 1180000, yieldPct: 5.8, upkeepPct: 2.0, prestige: 11 },
    { id: 're_private_palace',  sub: 'Kediaman',  icon: '🏰', name: 'Istana / Agam Persendirian',     baseUsd: 4800000, yieldPct: 3.5, upkeepPct: 2.6, prestige: 20 },
    // Komersial & Tanah (9)
    { id: 're_agri_orchard',    sub: 'Komersial', icon: '🌳', name: 'Tanah Pertanian & Dusun Buah',   baseUsd: 72000,   yieldPct: 6.2, upkeepPct: 1.1, prestige: 2 },
    { id: 're_shoplot',         sub: 'Komersial', icon: '🏪', name: 'Rumah Kedai 2 Tingkat (Shoplot)',baseUsd: 240000,  yieldPct: 7.4, upkeepPct: 1.6, prestige: 4 },
    { id: 're_cafe_lot',        sub: 'Komersial', icon: '☕', name: 'Lot Komersial Kafe & Runcit',    baseUsd: 175000,  yieldPct: 7.8, upkeepPct: 1.7, prestige: 3 },
    { id: 're_warehouse',       sub: 'Komersial', icon: '🏭', name: 'Gudang Logistik & Perindustrian',baseUsd: 620000,  yieldPct: 8.2, upkeepPct: 1.8, prestige: 6 },
    { id: 're_petrol_station',  sub: 'Komersial', icon: '⛽', name: 'Stesen Minyak & Hentian Lebuh Raya', baseUsd: 890000, yieldPct: 8.6, upkeepPct: 2.1, prestige: 7 },
    { id: 're_boutique_hotel',  sub: 'Komersial', icon: '🏨', name: 'Hotel Butik Pusat Bandar',       baseUsd: 1850000, yieldPct: 9.0, upkeepPct: 2.5, prestige: 12 },
    { id: 're_office_tower',    sub: 'Komersial', icon: '🏢', name: 'Bangunan Pejabat Korporat',      baseUsd: 3600000, yieldPct: 8.4, upkeepPct: 2.4, prestige: 16 },
    { id: 're_luxury_resort',   sub: 'Komersial', icon: '🏝️', name: 'Resort Mewah Tepi Laut',         baseUsd: 6500000, yieldPct: 9.2, upkeepPct: 2.8, prestige: 22 },
    { id: 're_private_island',  sub: 'Komersial', icon: '🗺️', name: 'Pulau Persendirian Eksklusif',   baseUsd: 14000000, yieldPct: 5.0, upkeepPct: 2.5, prestige: 30 }
  ],

  // --------------------------------------------------------------------------
  // 3. KENDERAAN DARAT, LAUT & UDARA — 26 JENIS
  // --------------------------------------------------------------------------
  VEHICLES: [
    // Darat (16)
    { id: 'veh_road_bike',      sub: 'Darat', icon: '🚲', name: 'Basikal Lumba Gentian Karbon',   baseUsd: 1800,    upkeepPct: 3.0, depRate: 0.08, looksBonus: 1, classic: false },
    { id: 'veh_kapcai',         sub: 'Darat', icon: '🛵', name: 'Motosikal Kapcai Jimat Minyak',  baseUsd: 2400,    upkeepPct: 4.5, depRate: 0.09, looksBonus: 0, classic: false },
    { id: 'veh_scooter',        sub: 'Darat', icon: '🛵', name: 'Skuter Bandar Automatik',        baseUsd: 3600,    upkeepPct: 4.5, depRate: 0.09, looksBonus: 1, classic: false },
    { id: 'veh_touring_moto',   sub: 'Darat', icon: '🏍️', name: 'Motosikal Kembara (Touring)',    baseUsd: 11500,   upkeepPct: 5.0, depRate: 0.08, looksBonus: 2, classic: false },
    { id: 'veh_superbike',      sub: 'Darat', icon: '🏍️', name: 'Superbike 1000cc Berkuasa Tinggi', baseUsd: 24000, upkeepPct: 6.0, depRate: 0.08, looksBonus: 4, classic: false },
    { id: 'veh_budget_used',    sub: 'Darat', icon: '🚗', name: 'Kereta Kompak Bajet',            baseUsd: 9500,    upkeepPct: 5.5, depRate: 0.10, looksBonus: 0, classic: false },
    { id: 'veh_hatchback',      sub: 'Darat', icon: '🚗', name: 'Hatchback Bandar Moden',         baseUsd: 16500,   upkeepPct: 5.0, depRate: 0.09, looksBonus: 1, classic: false },
    { id: 'veh_family_sedan',   sub: 'Darat', icon: '🚙', name: 'Sedan Keluarga Selesa',          baseUsd: 27000,   upkeepPct: 5.0, depRate: 0.09, looksBonus: 2, classic: false },
    { id: 'veh_ev_modern',      sub: 'Darat', icon: '🔋', name: 'Kereta Elektrik Pintar (EV)',    baseUsd: 42000,   upkeepPct: 3.2, depRate: 0.09, looksBonus: 4, classic: false },
    { id: 'veh_family_suv',     sub: 'Darat', icon: '🚙', name: 'SUV Keluarga 7 Tempat Duduk',    baseUsd: 48000,   upkeepPct: 5.5, depRate: 0.08, looksBonus: 3, classic: false },
    { id: 'veh_pickup_4x4',     sub: 'Darat', icon: '🛻', name: 'Trak Pikap 4x4 Lasak',           baseUsd: 44000,   upkeepPct: 5.5, depRate: 0.07, looksBonus: 3, classic: false },
    { id: 'veh_luxury_suv',     sub: 'Darat', icon: '🚘', name: 'SUV Mewah Eksekutif',            baseUsd: 115000,  upkeepPct: 6.5, depRate: 0.08, looksBonus: 6, classic: false },
    { id: 'veh_classic_vintage',sub: 'Darat', icon: '🏎️', name: 'Kereta Klasik / Vintage 1969 (Naik Nilai!)', baseUsd: 88000, upkeepPct: 6.0, depRate: -0.06, looksBonus: 7, classic: true },
    { id: 'veh_sport_gt',       sub: 'Darat', icon: '🏎️', name: 'Kereta Sport GT Coupe',          baseUsd: 135000,  upkeepPct: 7.0, depRate: 0.07, looksBonus: 7, classic: false },
    { id: 'veh_supercar',       sub: 'Darat', icon: '🏎️', name: 'Supercar Enjin V10 Eksotik',     baseUsd: 340000,  upkeepPct: 8.0, depRate: 0.05, looksBonus: 10, classic: false },
    { id: 'veh_hypercar',       sub: 'Darat', icon: '⚡', name: 'Hypercar Edisi Terhad Dunia',    baseUsd: 1950000, upkeepPct: 7.5, depRate: -0.05, looksBonus: 15, classic: true },
    // Laut (6)
    { id: 'veh_fishing_boat',   sub: 'Laut',  icon: '🚣', name: 'Bot Memancing Gentian Kaca',     baseUsd: 14000,   upkeepPct: 6.0, depRate: 0.08, looksBonus: 2, classic: false },
    { id: 'veh_jetski',         sub: 'Laut',  icon: '🚤', name: 'Jet Ski Prestasi Tinggi',        baseUsd: 18500,   upkeepPct: 7.0, depRate: 0.10, looksBonus: 3, classic: false },
    { id: 'veh_speedboat',      sub: 'Laut',  icon: '🚤', name: 'Bot Laju Persiaran (Speedboat)', baseUsd: 68000,   upkeepPct: 7.5, depRate: 0.08, looksBonus: 5, classic: false },
    { id: 'veh_sailboat',       sub: 'Laut',  icon: '⛵', name: 'Kapal Layar Krew Samudera',      baseUsd: 195000,  upkeepPct: 7.5, depRate: 0.06, looksBonus: 7, classic: false },
    { id: 'veh_yacht',          sub: 'Laut',  icon: '🛥️', name: 'Kapal Layar Mewah (Yacht)',      baseUsd: 1250000, upkeepPct: 8.5, depRate: 0.06, looksBonus: 12, classic: false },
    { id: 'veh_superyacht',     sub: 'Laut',  icon: '🚢', name: 'Superyacht Bilionair 60 Meter',  baseUsd: 12500000, upkeepPct: 9.0, depRate: 0.05, looksBonus: 20, classic: false },
    // Udara (4)
    { id: 'veh_light_aircraft', sub: 'Udara', icon: '🛩️', name: 'Pesawat Ringan Persendirian',    baseUsd: 380000,  upkeepPct: 8.5, depRate: 0.06, looksBonus: 9, classic: false },
    { id: 'veh_helicopter',     sub: 'Udara', icon: '🚁', name: 'Helikopter Peribadi VIP',        baseUsd: 1650000, upkeepPct: 9.5, depRate: 0.05, looksBonus: 14, classic: false },
    { id: 'veh_light_jet',      sub: 'Udara', icon: '✈️', name: 'Jet Perniagaan Ringan',          baseUsd: 4800000, upkeepPct: 9.5, depRate: 0.05, looksBonus: 18, classic: false },
    { id: 'veh_private_jet',    sub: 'Udara', icon: '🛫', name: 'Jet Peribadi Jarak Jauh Global', baseUsd: 18500000, upkeepPct: 9.0, depRate: 0.04, looksBonus: 25, classic: false }
  ],

  // --------------------------------------------------------------------------
  // 4. PELABURAN & KEWANGAN — 15 INSTRUMEN
  // --------------------------------------------------------------------------
  INVESTMENTS: [
    // Risiko Rendah (3)
    { id: 'inv_fd_bank',        group: 'Risiko Rendah', icon: '🏦', name: 'Simpanan Tetap Bank (FD)',         baseUnitUsd: 100,  risk: 'Rendah',  kind: 'safe',   minRet: 0.035, maxRet: 0.055, divPct: 0.04, desc: 'Pulangan tetap selamat 3.5–5.5%/thn tanpa risiko rugi pokok.' },
    { id: 'inv_unit_trust',     group: 'Risiko Rendah', icon: '🛡️', name: 'Amanah Saham Kebangsaan',          baseUnitUsd: 100,  risk: 'Rendah',  kind: 'safe',   minRet: 0.045, maxRet: 0.075, divPct: 0.05, desc: 'Dana amanah stabil dengan dividen tahunan konsisten 4.5–7.5%.' },
    { id: 'inv_gov_bond',       group: 'Risiko Rendah', icon: '📜', name: 'Bon & Sukuk Kerajaan',             baseUnitUsd: 250,  risk: 'Rendah',  kind: 'safe',   minRet: 0.04,  maxRet: 0.065, divPct: 0.045, desc: 'Dijamin kerajaan — kalis kejatuhan pasaran saham.' },
    // Komoditi (3)
    { id: 'inv_gold',           group: 'Komoditi',      icon: '🥇', name: 'Emas Fizikal & Akaun Emas',        baseUnitUsd: 200,  risk: 'Sederhana', kind: 'gold', minRet: -0.03, maxRet: 0.14,  divPct: 0,    desc: 'Pelindung inflasi utama — sering melonjak ketika krisis ekonomi!' },
    { id: 'inv_silver',         group: 'Komoditi',      icon: '🥈', name: 'Perak Industri & Logam Mulia',     baseUnitUsd: 80,   risk: 'Sederhana', kind: 'gold', minRet: -0.06, maxRet: 0.16,  divPct: 0,    desc: 'Logam penting untuk panel solar dan elektronik moden.' },
    { id: 'inv_oil_energy',     group: 'Komoditi',      icon: '🛢️', name: 'Komoditi Minyak & Tenaga Global',  baseUnitUsd: 150,  risk: 'Tinggi',  kind: 'stock',  minRet: -0.15, maxRet: 0.25,  divPct: 0.02, desc: 'Harga sensitif terhadap geopolitik dan permintaan tenaga dunia.' },
    // Pasaran Saham (6)
    { id: 'inv_bluechip',       group: 'Pasaran Saham', icon: '🏢', name: 'Saham Blue Chip Indeks Utama',     baseUnitUsd: 180,  risk: 'Sederhana', kind: 'stock', minRet: -0.08, maxRet: 0.16, divPct: 0.03, desc: 'Syarikat gergasi mantap dengan dividen tahunan yang kukuh.' },
    { id: 'inv_semicon_ai',     group: 'Pasaran Saham', icon: '🤖', name: 'Saham Semikonduktor & AI Global',  baseUnitUsd: 240,  risk: 'Tinggi',  kind: 'stock',  minRet: -0.18, maxRet: 0.38,  divPct: 0.01, desc: 'Sektor pertumbuhan terpantas dunia — potensi lonjakan besar!' },
    { id: 'inv_banking',        group: 'Pasaran Saham', icon: '🏛️', name: 'Saham Perbankan & Kewangan',       baseUnitUsd: 140,  risk: 'Sederhana', kind: 'stock', minRet: -0.09, maxRet: 0.14, divPct: 0.045, desc: 'Menjana dividen tunai yang menarik setiap tahun.' },
    { id: 'inv_reits',          group: 'Pasaran Saham', icon: '🏙️', name: 'Saham Amanah Hartanah (REITs)',    baseUnitUsd: 120,  risk: 'Sederhana', kind: 'reit', minRet: -0.06, maxRet: 0.12,  divPct: 0.055, desc: 'Miliki pecahan pusat beli-belah dan menara pejabat dengan dividen sewa.' },
    { id: 'inv_biotech',        group: 'Pasaran Saham', icon: '🧬', name: 'Saham Farmaseutikal & Biotek',     baseUnitUsd: 160,  risk: 'Tinggi',  kind: 'stock',  minRet: -0.16, maxRet: 0.30,  divPct: 0.015, desc: 'Melonjak apabila penemuan ubat baharu diluluskan.' },
    { id: 'inv_startup_vc',     group: 'Pasaran Saham', icon: '🚀', name: 'Saham Permulaan (Startup Berisiko)', baseUnitUsd: 300, risk: 'Sangat Tinggi', kind: 'startup', minRet: -0.45, maxRet: 0.95, divPct: 0, desc: 'Boleh berganda jadi unicorn atau jatuh merudum!' },
    // Aset Digital / Volatil (3)
    { id: 'inv_btc',            group: 'Aset Digital',  icon: '₿',  name: 'Kripto Utama (Bitcoin)',           baseUnitUsd: 500,  risk: 'Sangat Tinggi', kind: 'crypto', minRet: -0.38, maxRet: 0.78, divPct: 0, desc: 'Aset digital paling terkenal — turun naik ekstrem tetapi pulangan gergasi.' },
    { id: 'inv_eth',            group: 'Aset Digital',  icon: '💠', name: 'Rangkaian Kontrak Pintar (ETH)',   baseUnitUsd: 260,  risk: 'Sangat Tinggi', kind: 'crypto', minRet: -0.42, maxRet: 0.85, divPct: 0, desc: 'Tulang belakang aplikasi Web3 dengan risiko volatiliti tinggi.' },
    { id: 'inv_altcoin',        group: 'Aset Digital',  icon: '🪙', name: 'Altcoin Spekulatif (Risiko Rug-Pull)', baseUnitUsd: 40, risk: 'Ekstrem', kind: 'altcoin', minRet: -0.75, maxRet: 1.65, divPct: 0, desc: 'Peluang "to the moon" +165% atau risiko rug-pull jatuh menjunam!' }
  ],

  // --------------------------------------------------------------------------
  // 5. BARANG MEWAH, SENI & KOLEKSI — 20 JENIS (TERMASUK LELONGAN MISTERI!)
  // --------------------------------------------------------------------------
  COLLECTIBLES: [
    { id: 'col_mech_watch',     icon: '⌚', name: 'Jam Tangan Mekanikal Swiss',       baseUsd: 14500,  appRate: 0.06, prestige: 4, isMystery: false },
    { id: 'col_chrono_ltd',     icon: '⏱️', name: 'Jam Kronograf Edisi Terhad',       baseUsd: 42000,  appRate: 0.08, prestige: 7, isMystery: false },
    { id: 'col_diamond_set',    icon: '💎', name: 'Set Barang Kemas & Berlian Asli',  baseUsd: 28000,  appRate: 0.05, prestige: 6, isMystery: false },
    { id: 'col_emerald_ring',   icon: '💍', name: 'Cincin Zamrud Potongan Klasik',    baseUsd: 19500,  appRate: 0.06, prestige: 5, isMystery: false },
    { id: 'col_luxury_bag',     icon: '👜', name: 'Beg Tangan Kulit Edisi Terhad',    baseUsd: 22000,  appRate: 0.07, prestige: 5, isMystery: false },
    { id: 'col_fine_painting',  icon: '🖼️', name: 'Lukisan Seni Halus Maestro',       baseUsd: 65000,  appRate: 0.09, prestige: 9, isMystery: false },
    { id: 'col_abstract_art',   icon: '🎨', name: 'Lukisan Abstrak Kontemporari',     baseUsd: 24000,  appRate: 0.07, prestige: 5, isMystery: false },
    { id: 'col_keris_antique',  icon: '🗡️', name: 'Keris Pusaka Berpamor Abad ke-18', baseUsd: 18000,  appRate: 0.09, prestige: 8, isMystery: false },
    { id: 'col_ceramic_vase',   icon: '🏺', name: 'Pasu Seramik Dinasti Antik',       baseUsd: 52000,  appRate: 0.08, prestige: 8, isMystery: false },
    { id: 'col_rare_sport_card',icon: '🃏', name: 'Kad Koleksi Sukan Gred Mint 10',   baseUsd: 12000,  appRate: 0.08, prestige: 4, isMystery: false },
    { id: 'col_tcg_first_ed',   icon: '✨', name: 'Kad Permainan Edisi Pertama Nadir',baseUsd: 16500,  appRate: 0.09, prestige: 4, isMystery: false },
    { id: 'col_leica_camera',   icon: '📷', name: 'Kamera Filem Klasik Edisi Pengumpul', baseUsd: 8800, appRate: 0.06, prestige: 3, isMystery: false },
    { id: 'col_vinyl_record',   icon: '💿', name: 'Koleksi Piring Hitam Vinyl Asli 1960-an', baseUsd: 4200, appRate: 0.06, prestige: 2, isMystery: false },
    { id: 'col_gold_coins',     icon: '🪙', name: 'Syiling Emas Bersejarah Empayar Lama', baseUsd: 26000, appRate: 0.08, prestige: 6, isMystery: false },
    { id: 'col_gold_bullion',   icon: '🥇', name: 'Jongkong Emas Tulen 1 Kilogram',   baseUsd: 78000,  appRate: 0.07, prestige: 8, isMystery: false },
    { id: 'col_wood_sculpture', icon: '🗿', name: 'Ukiran Kayu & Patung Warisan',     baseUsd: 15500,  appRate: 0.06, prestige: 5, isMystery: false },
    { id: 'col_signed_guitar',  icon: '🎸', name: 'Gitar Bertandatangan Legenda Muzik', baseUsd: 32000, appRate: 0.08, prestige: 7, isMystery: false },
    { id: 'col_rare_manuscript',icon: '📜', name: 'Manuskrip & Buku Nadir Abad Silam',baseUsd: 85000,  appRate: 0.10, prestige: 11, isMystery: false },
    { id: 'col_royal_tiara',    icon: '👑', name: 'Mahkota Miniatur Antik Bertatah Permata', baseUsd: 160000, appRate: 0.09, prestige: 14, isMystery: false },
    { id: 'col_mystery_auction',icon: '🎁', name: '🌟 LELONGAN MISTERI: Peti Khazanah Tertutup', baseUsd: 35000, appRate: 0.12, prestige: 10, isMystery: true }
  ]
};
