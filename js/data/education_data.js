/* ==========================================================================
   WorldLife — Pangkalan Data Pendidikan Sepanjang Hayat (Sehingga PhD)
   & 28 Sijil Profesional / Kemahiran Berasaskan Bidang (Bahasa Melayu)
   ========================================================================== */

window.EducationData = {
  LEVEL_ORDER: ['none', 'high_school', 'foundation', 'diploma', 'bachelor', 'master', 'phd'],

  LEVEL_INFO: {
    none:        { id: 'none',        label: 'Tiada Pendidikan Formal', short: 'Tiada',       icon: '📄', rank: 0 },
    high_school: { id: 'high_school', label: 'Sekolah Menengah / SPM',  short: 'Menengah',    icon: '🏫', rank: 1 },
    foundation:  { id: 'foundation',  label: 'Asasi / Matrikulasi',     short: 'Asasi',       icon: '📗', rank: 2 },
    diploma:     { id: 'diploma',     label: 'Diploma / Vokasional',    short: 'Diploma',     icon: '📘', rank: 2 },
    bachelor:    { id: 'bachelor',    label: 'Ijazah Sarjana Muda',     short: 'Ijazah',      icon: '🎓', rank: 3 },
    master:      { id: 'master',      label: 'Ijazah Sarjana (Master)', short: 'Master',      icon: '🏛️', rank: 4 },
    phd:         { id: 'phd',         label: 'Doktor Falsafah (PhD)',   short: 'PhD (Dr.)',   icon: '👑', rank: 5 }
  },

  // --------------------------------------------------------------------------
  // 1. 10 BIDANG PENGAJIAN UTAMA
  // --------------------------------------------------------------------------
  FIELDS: [
    { id: 'engineering',          name: 'Kejuruteraan & Teknologi',      short: 'Kejuruteraan',  icon: '⚙️', tuitionMult: 1.18 },
    { id: 'science_research',     name: 'Sains & Data',                  short: 'Sains & Data',  icon: '🔬', tuitionMult: 1.12 },
    { id: 'business_finance',     name: 'Perniagaan & Kewangan',         short: 'Perniagaan',    icon: '📊', tuitionMult: 1.10 },
    { id: 'medicine',             name: 'Kesihatan & Perubatan',         short: 'Perubatan',     icon: '🩺', tuitionMult: 1.55 },
    { id: 'law',                  name: 'Undang-Undang & Dasar Awam',    short: 'Undang-Undang', icon: '⚖️', tuitionMult: 1.25 },
    { id: 'arts_media',           name: 'Kemanusiaan & Seni',            short: 'Kemanusiaan',   icon: '🎬', tuitionMult: 0.95 },
    { id: 'computer_science',     name: 'Sains Komputer & IT',           short: 'Sains Komputer',icon: '💻', tuitionMult: 1.15 },
    { id: 'culinary_hospitality', name: 'Kulinari & Pengurusan Hotel',   short: 'Kulinari',      icon: '👨‍🍳', tuitionMult: 0.95 },
    { id: 'education',            name: 'Pendidikan & Perguruan',        short: 'Pendidikan',    icon: '📚', tuitionMult: 0.85 },
    { id: 'trades_vocational',    name: 'Teknikal, Kemahiran & Vokasional', short: 'Vokasional', icon: '🔧', tuitionMult: 0.72 }
  ],

  getField(id) {
    return this.FIELDS.find(f => f.id === id) || null;
  },

  levelRank(level) {
    const idx = this.LEVEL_ORDER.indexOf(level || 'none');
    return idx >= 0 ? idx : 0;
  },

  hasMinLevel(currentLevel, requiredLevel) {
    return this.levelRank(currentLevel) >= this.levelRank(requiredLevel);
  },

  // --------------------------------------------------------------------------
  // 2. TANGGA PROGRAM AKADEMIK (KELAS DEWASA -> DIPLOMA -> DEGREE -> MASTER -> PhD)
  // --------------------------------------------------------------------------
  PROGRAMS: [
    {
      id: 'high_school',
      title: 'Kelas Dewasa / SPM Ulangan',
      icon: '📝',
      minAge: 18,
      reqLevel: 'none',
      exactLevelOnly: 'none',
      needsField: false,
      baseYears: 1,
      tuitionFactor: 0.18,
      minSmarts: 15,
      desc: 'Peluang kedua bagi orang dewasa tanpa kelulusan sekolah menengah untuk melayakkan diri ke pengajian tinggi.'
    },
    {
      id: 'foundation',
      title: 'Asasi / Matrikulasi',
      icon: '📗',
      minAge: 17,
      reqLevel: 'high_school',
      needsField: true,
      baseYears: 1,
      tuitionFactor: 0.45,
      minSmarts: 35,
      desc: 'Program pra-universiti 1 tahun selepas Sekolah Menengah untuk melayakkan diri ke Ijazah Sarjana Muda.'
    },
    {
      id: 'diploma',
      title: 'Diploma / Kolej Vokasional',
      icon: '📘',
      minAge: 17,
      reqLevel: 'high_school',
      needsField: true,
      baseYears: 2,
      tuitionFactor: 0.62,
      minSmarts: 30,
      desc: 'Program kemahiran & akademik 2–3 tahun. Membolehkan laluan pantas (2 tahun) jika menyambung Ijazah dalam bidang sama!'
    },
    {
      id: 'bachelor',
      title: 'Ijazah Sarjana Muda (Degree)',
      icon: '🎓',
      minAge: 18,
      reqLevel: 'foundation',
      needsField: true,
      baseYears: 3,
      fastTrackYears: 2,
      tuitionFactor: 1.0,
      minSmarts: 42,
      desc: 'Kelayakan teras profesional (3–4 tahun, atau 2 tahun laluan pantas jika naik taraf daripada Diploma bidang sama).'
    },
    {
      id: 'master',
      title: 'Ijazah Sarjana (Master)',
      icon: '🏛️',
      minAge: 21,
      reqLevel: 'bachelor',
      needsField: true,
      baseYears: 2,
      tuitionFactor: 1.28,
      minSmarts: 55,
      desc: 'Pengkhususan lanjutan 1–2 tahun untuk jawatan kanan, penyelidikan dan syarat kemasukan PhD.'
    },
    {
      id: 'phd',
      title: 'Doktor Falsafah (PhD)',
      icon: '👑',
      minAge: 23,
      reqLevel: 'master',
      needsField: true,
      baseYears: 3,
      tuitionFactor: 1.15,
      minSmarts: 68,
      desc: 'Puncak akademik (3–4 tahun) dengan kajian tesis, penerbitan jurnal & ujian Viva. Menganugerahkan gelaran "Dr." & menaikkan Reputasi Keluarga!'
    }
  ],

  // --------------------------------------------------------------------------
  // 3. 28 SIJIL PROFESIONAL & KEMAHIRAN (DIKUNCI MENGIKUT TAHAP & BIDANG)
  // --------------------------------------------------------------------------
  CERTIFICATES: [
    // === A. TAHAP ASAS / VOKASIONAL (Terbuka kepada semua dewasa — 7 Sijil) ===
    {
      id: 'cert_wireman',
      title: 'Sijil Pendawaian Elektrik (Wireman PW2/PW4)',
      icon: '⚡',
      group: 'Asas & Vokasional',
      minEducation: 'none',
      requiredFields: 'any',
      costUsd: 650,
      smartsReq: 25,
      salaryBonusPct: 14,
      interviewBonus: 14,
      desc: 'Lesen rasmi pendawaian elektrik kediaman dan industri. Sangat dicari dalam sektor teknikal.'
    },
    {
      id: 'cert_welding',
      title: 'Sijil Kimpalan Industri (6G Welding)',
      icon: '🔥',
      group: 'Asas & Vokasional',
      minEducation: 'none',
      requiredFields: 'any',
      costUsd: 950,
      smartsReq: 25,
      salaryBonusPct: 18,
      interviewBonus: 16,
      desc: 'Kepakaran kimpalan paip minyak, gas dan struktur keluli bertaraf antarabangsa.'
    },
    {
      id: 'cert_barista_culinary',
      title: 'Sijil Barista & Kulinari Profesional',
      icon: '☕',
      group: 'Asas & Vokasional',
      minEducation: 'none',
      requiredFields: 'any',
      costUsd: 520,
      smartsReq: 20,
      salaryBonusPct: 12,
      interviewBonus: 15,
      desc: 'Latihan seni membancuh kopi, keselamatan makanan dan teknik dapur komersial.'
    },
    {
      id: 'cert_commercial_driver',
      title: 'Lesen Kenderaan Komersial (GDL / PSV)',
      icon: '🚛',
      group: 'Asas & Vokasional',
      minEducation: 'none',
      requiredFields: 'any',
      costUsd: 420,
      smartsReq: 20,
      salaryBonusPct: 12,
      interviewBonus: 14,
      desc: 'Melayakkan anda memandu lori kontena, bas ekspres dan kenderaan logistik berat.'
    },
    {
      id: 'cert_fitness_trainer',
      title: 'Sijil Jurulatih Kecergasan Bertauliah (CPT)',
      icon: '🏋️',
      group: 'Asas & Vokasional',
      minEducation: 'none',
      requiredFields: 'any',
      costUsd: 580,
      smartsReq: 28,
      salaryBonusPct: 15,
      interviewBonus: 16,
      desc: 'Tauliah anatomi senaman, pemakanan sukan dan bimbingan kecergasan peribadi.'
    },
    {
      id: 'cert_digital_marketing',
      title: 'Sijil Asas Pemasaran Digital & SEO',
      icon: '📣',
      group: 'Asas & Vokasional',
      minEducation: 'high_school',
      requiredFields: 'any',
      costUsd: 480,
      smartsReq: 35,
      salaryBonusPct: 12,
      interviewBonus: 14,
      desc: 'Kemahiran iklan berbayar, analitik data media sosial dan strategi jenama dalam talian.'
    },
    {
      id: 'cert_machine_maintenance',
      title: 'Sijil Penyelenggaraan Mesin & CNC',
      icon: '🔧',
      group: 'Asas & Vokasional',
      minEducation: 'none',
      requiredFields: 'any',
      costUsd: 780,
      smartsReq: 32,
      salaryBonusPct: 15,
      interviewBonus: 15,
      desc: 'Kemahiran pengendalian mesin kilang automasi, hidraulik dan pembaikan CNC.'
    },

    // === B. KEJURUTERAAN & PEMBUATAN (4 Sijil) ===
    {
      id: 'cert_lean_six_sigma',
      title: 'Lean Six Sigma (Green / Black Belt)',
      icon: '📐',
      group: 'Kejuruteraan',
      minEducation: 'diploma',
      requiredFields: ['engineering', 'business_finance'],
      costUsd: 1650,
      smartsReq: 55,
      salaryBonusPct: 18,
      interviewBonus: 18,
      desc: 'Pensijilan kawalan kualiti dan pengoptimuman operasi kilang bertaraf global.'
    },
    {
      id: 'cert_pe_ir',
      title: 'Sijil Jurutera Profesional (Ir. / P.Eng)',
      icon: '🏗️',
      group: 'Kejuruteraan',
      minEducation: 'bachelor',
      requiredFields: ['engineering'],
      costUsd: 2400,
      smartsReq: 68,
      salaryBonusPct: 24,
      interviewBonus: 22,
      desc: 'Pengiktirafan tertinggi badan kejuruteraan yang membolehkan anda mengesahkan pelan projek mega.'
    },
    {
      id: 'cert_sho_safety',
      title: 'Pegawai Keselamatan & Kesihatan (SHO / NEBOSH)',
      icon: '🦺',
      group: 'Kejuruteraan',
      minEducation: 'diploma',
      requiredFields: ['engineering', 'science_research', 'trades_vocational'],
      costUsd: 1450,
      smartsReq: 48,
      salaryBonusPct: 16,
      interviewBonus: 18,
      desc: 'Kelayakan wajib untuk mengawal selia keselamatan tapak pembinaan, kilang dan pelantar minyak.'
    },
    {
      id: 'cert_semiconductor_auto',
      title: 'Sijil Automasi, PLC & Fabrikasi Semikonduktor',
      icon: '🔌',
      group: 'Kejuruteraan',
      minEducation: 'diploma',
      requiredFields: ['engineering', 'computer_science'],
      costUsd: 1950,
      smartsReq: 60,
      salaryBonusPct: 22,
      interviewBonus: 20,
      desc: 'Kepakaran bilik bersih (cleanroom), robotik industri dan proses cip semikonduktor.'
    },

    // === C. IT & SAINS KOMPUTER (4 Sijil) ===
    {
      id: 'cert_cloud_architect',
      title: 'Sijil Arkitek Awan (Cloud Architect AWS/GCP)',
      icon: '☁️',
      group: 'IT & Sains Komputer',
      minEducation: 'diploma',
      requiredFields: ['computer_science', 'engineering'],
      costUsd: 1600,
      smartsReq: 60,
      salaryBonusPct: 20,
      interviewBonus: 20,
      desc: 'Kepakaran mereka bentuk infrastruktur pelayan awan berskala jutaan pengguna.'
    },
    {
      id: 'cert_cybersecurity',
      title: 'Sijil Keselamatan Siber (CISSP / CEH)',
      icon: '🛡️',
      group: 'IT & Sains Komputer',
      minEducation: 'diploma',
      requiredFields: ['computer_science', 'engineering'],
      costUsd: 1850,
      smartsReq: 64,
      salaryBonusPct: 22,
      interviewBonus: 22,
      desc: 'Tauliah pertahanan rangkaian, ujian penembusan dan keselamatan siber perusahaan.'
    },
    {
      id: 'cert_data_ai',
      title: 'Sijil Kejuruteraan Data & Kecerdasan Buatan (AI)',
      icon: '🤖',
      group: 'IT & Sains Komputer',
      minEducation: 'bachelor',
      requiredFields: ['computer_science', 'science_research', 'engineering'],
      costUsd: 2100,
      smartsReq: 68,
      salaryBonusPct: 25,
      interviewBonus: 22,
      desc: 'Pengkhususan pembelajaran mesin (Machine Learning), LLM dan saluran data raya.'
    },
    {
      id: 'cert_devops_k8s',
      title: 'Sijil Jurutera DevOps & Kubernetes',
      icon: '🐳',
      group: 'IT & Sains Komputer',
      minEducation: 'diploma',
      requiredFields: ['computer_science'],
      costUsd: 1400,
      smartsReq: 56,
      salaryBonusPct: 18,
      interviewBonus: 18,
      desc: 'Automasi CI/CD, kontena dan kestabilan sistem pengeluaran tanpa henti.'
    },

    // === D. PERNIAGAAN & KEWANGAN (4 Sijil) ===
    {
      id: 'cert_acca_cpa',
      title: 'Akauntan Bertauliah (ACCA / CPA)',
      icon: '🧮',
      group: 'Perniagaan & Kewangan',
      minEducation: 'bachelor',
      requiredFields: ['business_finance'],
      costUsd: 2600,
      smartsReq: 65,
      salaryBonusPct: 24,
      interviewBonus: 22,
      desc: 'Kelayakan perakaunan bertauliah antarabangsa untuk firma audit besar dan CFO.'
    },
    {
      id: 'cert_cfa',
      title: 'Penganalisis Kewangan Bertauliah (CFA)',
      icon: '📈',
      group: 'Perniagaan & Kewangan',
      minEducation: 'bachelor',
      requiredFields: ['business_finance', 'science_research'],
      costUsd: 2900,
      smartsReq: 70,
      salaryBonusPct: 25,
      interviewBonus: 24,
      desc: 'Standard emas dunia perbankan pelaburan, pengurusan dana dan modal teroka.'
    },
    {
      id: 'cert_pmp',
      title: 'Pengurusan Projek Profesional (PMP)',
      icon: '📋',
      group: 'Perniagaan & Kewangan',
      minEducation: 'diploma',
      requiredFields: ['business_finance', 'engineering', 'computer_science'],
      costUsd: 1500,
      smartsReq: 52,
      salaryBonusPct: 16,
      interviewBonus: 18,
      desc: 'Diiktiraf seluruh dunia untuk memimpin projek korporat dan teknologi bernilai jutaan.'
    },
    {
      id: 'cert_ethical_finance',
      title: 'Sijil Kewangan Lestari & ESG (CESGA)',
      icon: '🌙',
      group: 'Perniagaan & Kewangan',
      minEducation: 'bachelor',
      requiredFields: ['business_finance', 'law'],
      costUsd: 1750,
      smartsReq: 58,
      salaryBonusPct: 18,
      interviewBonus: 18,
      desc: 'Kepakaran perbankan lestari, bon hijau dan struktur pelaburan beretika ESG.'
    },

    // === E. PERUBATAN & KESIHATAN (3 Sijil) ===
    {
      id: 'cert_emergency_med',
      title: 'Sijil Pakar Perubatan Kecemasan (ACLS / Trauma)',
      icon: '🚑',
      group: 'Perubatan & Kesihatan',
      minEducation: 'bachelor',
      requiredFields: ['medicine', 'science_research'],
      costUsd: 2200,
      smartsReq: 66,
      salaryBonusPct: 20,
      interviewBonus: 20,
      desc: 'Tauliah pengendalian kes kritikal ICU, trauma kemalangan dan kecemasan hospital.'
    },
    {
      id: 'cert_board_surgeon',
      title: 'Sijil Pakar Bedah Bertauliah (FRCS / Board)',
      icon: '🩺',
      group: 'Perubatan & Kesihatan',
      minEducation: 'master',
      requiredFields: ['medicine'],
      costUsd: 3800,
      smartsReq: 76,
      salaryBonusPct: 25,
      interviewBonus: 25,
      desc: 'Kelayakan pembedahan pakar peringkat tertinggi yang membuka gaji elit di hospital pakar.'
    },
    {
      id: 'cert_clinical_pharmacy',
      title: 'Sijil Farmasi Klinikal & Bioteknologi',
      icon: '💊',
      group: 'Perubatan & Kesihatan',
      minEducation: 'bachelor',
      requiredFields: ['medicine', 'science_research'],
      costUsd: 1800,
      smartsReq: 62,
      salaryBonusPct: 18,
      interviewBonus: 18,
      desc: 'Lesen amalan farmasi klinikal dan pembangunan formulasi ubat-ubatan moden.'
    },

    // === F. UNDANG-UNDANG (2 Sijil) ===
    {
      id: 'cert_bar_clp',
      title: 'Sijil Amalan Guaman (Peperiksaan Bar / CLP)',
      icon: '⚖️',
      group: 'Undang-Undang',
      minEducation: 'bachelor',
      requiredFields: ['law'],
      costUsd: 2300,
      smartsReq: 66,
      salaryBonusPct: 22,
      interviewBonus: 24,
      desc: 'Syarat rasmi untuk berhujah di mahkamah tinggi sebagai Peguambela & Peguamcara.'
    },
    {
      id: 'cert_corp_arbitration',
      title: 'Sijil Timbang Tara & Undang-Undang Korporat',
      icon: '🏛️',
      group: 'Undang-Undang',
      minEducation: 'bachelor',
      requiredFields: ['law', 'business_finance'],
      costUsd: 2500,
      smartsReq: 68,
      salaryBonusPct: 20,
      interviewBonus: 20,
      desc: 'Pengkhususan penyelesaian pertikaian kontrak antarabangsa dan penggabungan korporat.'
    },

    // === G. SENI, MEDIA, PENERBANGAN & KHUSUS (4 Sijil) ===
    {
      id: 'cert_ux_ui',
      title: 'Sijil Reka Bentuk Produk UX/UI Profesional',
      icon: '🎨',
      group: 'Seni, Media & Khusus',
      minEducation: 'high_school',
      requiredFields: ['arts_media', 'computer_science', 'any'],
      costUsd: 950,
      smartsReq: 45,
      salaryBonusPct: 16,
      interviewBonus: 18,
      desc: 'Portfolio kajian pengguna, sistem rekaan aplikasi dan antara muka digital moden.'
    },
    {
      id: 'cert_cpl_pilot',
      title: 'Lesen Juruterbang Komersial (CPL / ATPL)',
      icon: '✈️',
      group: 'Seni, Media & Khusus',
      minEducation: 'high_school',
      requiredFields: 'any',
      costUsd: 6800,
      smartsReq: 58,
      salaryBonusPct: 25,
      interviewBonus: 25,
      desc: 'Lesen penerbangan pesawat komersial berlesen penuh — membuka laluan Kapten Penerbangan.'
    },
    {
      id: 'cert_commercial_diver',
      title: 'Sijil Penyelam Komersial & Laut Dalam (IMCA)',
      icon: '🤿',
      group: 'Seni, Media & Khusus',
      minEducation: 'high_school',
      requiredFields: 'any',
      costUsd: 2900,
      smartsReq: 42,
      salaryBonusPct: 22,
      interviewBonus: 20,
      desc: 'Tauliah selaman pembinaan bawah laut, pemeriksaan kapal dan penyelidikan marin.'
    },
    {
      id: 'cert_teaching_pedagogy',
      title: 'Sijil Perguruan & Pedagogi Kebangsaan',
      icon: '🍎',
      group: 'Seni, Media & Khusus',
      minEducation: 'diploma',
      requiredFields: ['education', 'arts_media', 'science_research'],
      costUsd: 800,
      smartsReq: 45,
      salaryBonusPct: 15,
      interviewBonus: 18,
      desc: 'Tauliah mengajar bertauliah untuk sekolah kerajaan, sekolah antarabangsa dan kolej.'
    },

    // === H. KURSUS PROFESIONAL MODEN (TIADA HAD UMUR — TERBUKA KEPADA SEMUA DEWASA/PESARA) ===
    {
      id: 'cert_ai_prompt',
      title: 'AI & Prompt Engineering',
      icon: '🧠',
      group: 'Teknologi, AI & IT',
      isModernCourse: true,
      noAgeLimit: true,
      minEducation: 'none',
      requiredFields: 'any',
      matchFields: ['computer_science', 'engineering', 'science_research', 'business_finance'],
      costUsd: 650,
      smartsReq: 35,
      salaryBonusPct: 16,
      interviewBonus: 16,
      desc: 'Kursus pantas menguasai model AI generatif, automasi aliran kerja dan kejuruteraan prompt profesional.'
    },
    {
      id: 'cert_plc_labview',
      title: 'PLC / Industrial Automation & LabVIEW',
      icon: '🎛️',
      group: 'Teknologi, AI & IT',
      isModernCourse: true,
      noAgeLimit: true,
      minEducation: 'none',
      requiredFields: 'any',
      matchFields: ['engineering', 'computer_science', 'trades_vocational'],
      costUsd: 980,
      smartsReq: 42,
      salaryBonusPct: 18,
      interviewBonus: 18,
      desc: 'Pengaturcaraan PLC kilang pintar, kawalan automasi industri dan instrumentasi ujian LabVIEW.'
    },
    {
      id: 'cert_data_ml',
      title: 'Data Analytics & Machine Learning',
      icon: '📊',
      group: 'Teknologi, AI & IT',
      isModernCourse: true,
      noAgeLimit: true,
      minEducation: 'none',
      requiredFields: 'any',
      matchFields: ['computer_science', 'science_research', 'business_finance', 'engineering'],
      costUsd: 1150,
      smartsReq: 48,
      salaryBonusPct: 20,
      interviewBonus: 18,
      desc: 'Analitik data lanjutan, pemodelan ramalan dan algoritma pembelajaran mesin untuk keputusan perniagaan.'
    },
    {
      id: 'cert_cyber_soc',
      title: 'Cybersecurity & SOC',
      icon: '🔐',
      group: 'Teknologi, AI & IT',
      isModernCourse: true,
      noAgeLimit: true,
      minEducation: 'none',
      requiredFields: 'any',
      matchFields: ['computer_science', 'engineering'],
      costUsd: 1200,
      smartsReq: 46,
      salaryBonusPct: 19,
      interviewBonus: 18,
      desc: 'Operasi Pusat Keselamatan Siber (SOC), pengesanan ancaman masa nyata dan tindak balas insiden.'
    },
    {
      id: 'cert_doe_spc',
      title: 'Design of Experiments (DOE) & SPC',
      icon: '📈',
      group: 'Kejuruteraan & Industri',
      isModernCourse: true,
      noAgeLimit: true,
      minEducation: 'none',
      requiredFields: 'any',
      matchFields: ['engineering', 'science_research'],
      costUsd: 1050,
      smartsReq: 46,
      salaryBonusPct: 17,
      interviewBonus: 17,
      desc: 'Reka bentuk eksperimen statistik (DOE) dan Kawalan Proses Statistik (SPC) untuk kualiti pembuatan.'
    },
    {
      id: 'cert_semi_yield',
      title: 'Semiconductor Process & Yield',
      icon: '🔬',
      group: 'Kejuruteraan & Industri',
      isModernCourse: true,
      noAgeLimit: true,
      minEducation: 'none',
      requiredFields: 'any',
      matchFields: ['engineering', 'science_research', 'computer_science'],
      costUsd: 1350,
      smartsReq: 50,
      salaryBonusPct: 21,
      interviewBonus: 19,
      desc: 'Proses wafer semikonduktor, analisis kecacatan cip dan pengoptimuman hasil pengeluaran (yield).'
    },
    {
      id: 'cert_iso_compliance',
      title: 'ISO / Regulatory Compliance',
      icon: '✅',
      group: 'Kejuruteraan & Industri',
      isModernCourse: true,
      noAgeLimit: true,
      minEducation: 'none',
      requiredFields: 'any',
      matchFields: ['engineering', 'business_finance', 'law', 'medicine'],
      costUsd: 850,
      smartsReq: 38,
      salaryBonusPct: 15,
      interviewBonus: 16,
      desc: 'Audit pematuhan piawaian ISO 9001/14001/27001 serta tadbir urus regulatori industri.'
    },
    {
      id: 'cert_fin_modeling',
      title: 'Financial Modeling & Valuation',
      icon: '💹',
      group: 'Perniagaan & Kewangan',
      isModernCourse: true,
      noAgeLimit: true,
      minEducation: 'none',
      requiredFields: 'any',
      matchFields: ['business_finance'],
      costUsd: 1100,
      smartsReq: 45,
      salaryBonusPct: 18,
      interviewBonus: 18,
      desc: 'Pemodelan kewangan 3-penyata, penilaian DCF dan analisis penggabungan korporat (M&A).'
    },
    {
      id: 'cert_quant_trading',
      title: 'Quantitative / Algorithmic Trading',
      icon: '⚡',
      group: 'Perniagaan & Kewangan',
      isModernCourse: true,
      noAgeLimit: true,
      minEducation: 'none',
      requiredFields: 'any',
      matchFields: ['business_finance', 'computer_science', 'science_research'],
      costUsd: 1450,
      smartsReq: 54,
      salaryBonusPct: 22,
      interviewBonus: 19,
      desc: 'Strategi dagangan algoritmik, ujian belakang (backtesting) dan pengurusan risiko kuantitatif.'
    },
    {
      id: 'cert_product_mgmt',
      title: 'Product Management',
      icon: '🧭',
      group: 'Perniagaan & Kewangan',
      isModernCourse: true,
      noAgeLimit: true,
      minEducation: 'none',
      requiredFields: 'any',
      matchFields: ['business_finance', 'computer_science', 'engineering', 'arts_media'],
      costUsd: 900,
      smartsReq: 40,
      salaryBonusPct: 16,
      interviewBonus: 17,
      desc: 'Strategi pelan hala tuju produk, penemuan pelanggan dan pertumbuhan produk digital.'
    },
    {
      id: 'cert_esg_sustainability',
      title: 'ESG & Sustainability',
      icon: '🌱',
      group: 'Perniagaan & Kewangan',
      isModernCourse: true,
      noAgeLimit: true,
      minEducation: 'none',
      requiredFields: 'any',
      matchFields: ['business_finance', 'engineering', 'law', 'science_research'],
      costUsd: 880,
      smartsReq: 38,
      salaryBonusPct: 15,
      interviewBonus: 16,
      desc: 'Pelaporan kelestarian alam sekitar, sosial dan tadbir urus (ESG) serta strategi karbon sifar.'
    },
    {
      id: 'cert_digital_health',
      title: 'Digital Health & Clinical Analytics',
      icon: '🩺',
      group: 'Kesihatan, Kreatif & Kepimpinan',
      isModernCourse: true,
      noAgeLimit: true,
      minEducation: 'none',
      requiredFields: 'any',
      matchFields: ['medicine', 'science_research', 'computer_science'],
      costUsd: 1100,
      smartsReq: 45,
      salaryBonusPct: 18,
      interviewBonus: 18,
      desc: 'Analitik data klinikal, teleperubatan dan pendigitalan sistem rekod kesihatan hospital.'
    },
    {
      id: 'cert_content_strategy',
      title: 'Content Strategy & Brand Growth',
      icon: '🎯',
      group: 'Kesihatan, Kreatif & Kepimpinan',
      isModernCourse: true,
      noAgeLimit: true,
      minEducation: 'none',
      requiredFields: 'any',
      matchFields: ['arts_media', 'business_finance'],
      costUsd: 700,
      smartsReq: 34,
      salaryBonusPct: 15,
      interviewBonus: 16,
      desc: 'Strategi penceritaan jenama, pertumbuhan organik rentas platform dan pengewangan konten.'
    },
    {
      id: 'cert_public_policy',
      title: 'Public Policy & Strategic Leadership',
      icon: '🏛️',
      group: 'Kesihatan, Kreatif & Kepimpinan',
      isModernCourse: true,
      noAgeLimit: true,
      minEducation: 'none',
      requiredFields: 'any',
      matchFields: ['law', 'business_finance', 'education'],
      costUsd: 1050,
      smartsReq: 44,
      salaryBonusPct: 17,
      interviewBonus: 18,
      desc: 'Penggubalan dasar awam, tadbir urus sektor awam dan kepimpinan strategik peringkat eksekutif.'
    }
  ]
};
