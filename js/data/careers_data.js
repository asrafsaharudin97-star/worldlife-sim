/* ==========================================================================
   WorldLife — Pangkalan Data Pasaran Kerjaya Global (80 Kerjaya Unik)
   12 Industri + Tangga Kenaikan Pangkat + 16 Soalan Temu Duga (Bahasa Melayu)
   ========================================================================== */

window.CareersData = {
  INDUSTRIES: [
    { id: 'ALL',         label: 'Semua',         icon: '✨' },
    { id: 'tech',        label: 'Teknologi & Cip', icon: '💻' },
    { id: 'engineering', label: 'Kejuruteraan',  icon: '⚙️' },
    { id: 'medical',     label: 'Perubatan',     icon: '🩺' },
    { id: 'finance',     label: 'Kewangan',      icon: '📊' },
    { id: 'law_gov',     label: 'Undang & Kerajaan', icon: '⚖️' },
    { id: 'creative',    label: 'Kreatif & Media', icon: '🎬' },
    { id: 'aviation',    label: 'Penerbangan & Laut', icon: '✈️' },
    { id: 'academia',    label: 'Sains & Akademia', icon: '🔬' },
    { id: 'hospitality', label: 'Kulinari & Hotel', icon: '👨‍🍳' },
    { id: 'trades',      label: 'Kemahiran',     icon: '🔧' },
    { id: 'sports',      label: 'Sukan & Sihat', icon: '🏅' },
    { id: 'rare',        label: 'Nadir & Unik',  icon: '🌟' }
  ],

  // --------------------------------------------------------------------------
  // 80 KERJAYA DUNIA SEBENAR (TIADA PLACEHOLDER — LENGKAP DENGAN TANGGA PANGKAT)
  // --------------------------------------------------------------------------
  CAREERS: [
    // === 1. TEKNOLOGI & SEMIKONDUKTOR (9 Kerjaya) ===
    {
      id: 'car_swe', title: 'Jurutera Perisian (Software Engineer)', industry: 'tech', icon: '💻',
      minEducation: 'diploma', requiredFields: ['computer_science', 'engineering'], preferredCerts: ['cert_cloud_architect', 'cert_devops_k8s'],
      baseSalary: 56000, stressLevel: 55, isRare: false,
      promotionLadder: ['Jurutera Perisian Muda', 'Jurutera Perisian Kanan', 'Jurutera Utama (Staff)', 'Pengurus Kejuruteraan', 'Ketua Pegawai Teknologi (CTO)'],
      desc: 'Membangunkan sistem aplikasi, API dan perisian berskala besar.'
    },
    {
      id: 'car_ai_ml', title: 'Jurutera AI & Pembelajaran Mesin', industry: 'tech', icon: '🤖',
      minEducation: 'bachelor', requiredFields: ['computer_science', 'science_research', 'engineering'], preferredCerts: ['cert_data_ai'],
      baseSalary: 74000, stressLevel: 65, isRare: false,
      promotionLadder: ['Jurutera AI Muda', 'Saintis Pembelajaran Mesin', 'Arkitek AI Kanan', 'Ketua Penyelidikan AI', 'Naib Presiden AI'],
      desc: 'Melatih model pintar, pemprosesan bahasa dan sistem automasi masa depan.'
    },
    {
      id: 'car_semicon_ic', title: 'Jurutera Reka Bentuk Cip (IC / Semikonduktor)', industry: 'tech', icon: '🔌',
      minEducation: 'bachelor', requiredFields: ['engineering', 'computer_science'], preferredCerts: ['cert_semiconductor_auto'],
      baseSalary: 68000, stressLevel: 62, isRare: false,
      promotionLadder: ['Jurutera IC Muda', 'Jurutera Silikon Kanan', 'Arkitek Cip Utama', 'Pengurus Fabrikasi Cip', 'Pengarah Semikonduktor'],
      desc: 'Mereka bentuk litar mikro, ujian wafer dan pemproses semikonduktor berteknologi tinggi.'
    },
    {
      id: 'car_cyber_analyst', title: 'Penganalisis Keselamatan Siber', industry: 'tech', icon: '🛡️',
      minEducation: 'diploma', requiredFields: ['computer_science', 'engineering'], preferredCerts: ['cert_cybersecurity'],
      baseSalary: 60000, stressLevel: 60, isRare: false,
      promotionLadder: ['Penganalisis SOC', 'Jurutera Keselamatan Kanan', 'Ketua Pertahanan Siber', 'Pengurus Keselamatan Maklumat', 'Ketua Pegawai Keselamatan (CISO)'],
      desc: 'Mempertahankan rangkaian syarikat daripada serangan penggodam dan kebocoran data.'
    },
    {
      id: 'car_cloud_eng', title: 'Arkitek Infrastruktur Awan (Cloud)', industry: 'tech', icon: '☁️',
      minEducation: 'bachelor', requiredFields: ['computer_science', 'engineering'], preferredCerts: ['cert_cloud_architect', 'cert_devops_k8s'],
      baseSalary: 66000, stressLevel: 58, isRare: false,
      promotionLadder: ['Jurutera Awan', 'Jurutera Awan Kanan', 'Arkitek Awan Utama', 'Pengarah Infrastruktur Global', 'Naib Presiden Awan'],
      desc: 'Mengurus pelayan awan berskala global dengan kestabilan 99.99%.'
    },
    {
      id: 'car_data_scientist', title: 'Saintis Data (Data Scientist)', industry: 'tech', icon: '📈',
      minEducation: 'bachelor', requiredFields: ['computer_science', 'science_research', 'business_finance'], preferredCerts: ['cert_data_ai'],
      baseSalary: 64000, stressLevel: 54, isRare: false,
      promotionLadder: ['Penganalisis Data', 'Saintis Data', 'Saintis Data Kanan', 'Ketua Analitik Data', 'Ketua Pegawai Data (CDO)'],
      desc: 'Menukar jutaan rekod data raya kepada strategi keputusan perniagaan.'
    },
    {
      id: 'car_ux_designer', title: 'Pereka Produk UX/UI', industry: 'tech', icon: '🎨',
      minEducation: 'high_school', requiredFields: 'any', preferredCerts: ['cert_ux_ui'],
      baseSalary: 46000, stressLevel: 44, isRare: false,
      promotionLadder: ['Pereka UI Muda', 'Pereka Produk UX/UI', 'Pereka Produk Kanan', 'Ketua Reka Bentuk', 'Pengarah Reka Bentuk Produk'],
      desc: 'Mencipta pengalaman aplikasi mudah alih dan laman web yang intuitif dan memikat.'
    },
    {
      id: 'car_it_support', title: 'Juruteknik Sokongan IT & Rangkaian', industry: 'tech', icon: '🖥️',
      minEducation: 'high_school', requiredFields: 'any', preferredCerts: ['cert_cloud_architect'],
      baseSalary: 32000, stressLevel: 42, isRare: false,
      promotionLadder: ['Sokongan Meja Bantuan IT', 'Juruteknik Rangkaian', 'Pentadbir Sistem Kanan', 'Pengurus Operasi IT', 'Pengarah IT'],
      desc: 'Menyelenggara pelayan, komputer pejabat dan rangkaian harian syarikat.'
    },
    {
      id: 'car_product_mgr', title: 'Pengurus Produk Teknologi', industry: 'tech', icon: '🧭',
      minEducation: 'bachelor', requiredFields: ['computer_science', 'business_finance', 'engineering'], preferredCerts: ['cert_pmp', 'cert_ux_ui'],
      baseSalary: 65000, stressLevel: 64, isRare: false,
      promotionLadder: ['Penolong Pengurus Produk', 'Pengurus Produk', 'Pengurus Produk Kanan', 'Pengarah Produk', 'Ketua Pegawai Produk (CPO)'],
      desc: 'Menerajui hala tuju ciri aplikasi bersama pasukan jurutera dan pereka.'
    },

    // === 2. KEJURUTERAAN & PEMBUATAN (8 Kerjaya) ===
    {
      id: 'car_mech_eng', title: 'Jurutera Mekanikal & Pembuatan', industry: 'engineering', icon: '⚙️',
      minEducation: 'bachelor', requiredFields: ['engineering'], preferredCerts: ['cert_pe_ir', 'cert_lean_six_sigma'],
      baseSalary: 54000, stressLevel: 54, isRare: false,
      promotionLadder: ['Jurutera Mekanikal Muda', 'Jurutera Mekanikal Kanan', 'Jurutera Utama (Ir.)', 'Pengurus Kilang', 'Pengarah Kejuruteraan'],
      desc: 'Mereka bentuk sistem mesin, pengeluaran kilang dan jentera industri.'
    },
    {
      id: 'car_civil_eng', title: 'Jurutera Awam & Struktur', industry: 'engineering', icon: '🏗️',
      minEducation: 'bachelor', requiredFields: ['engineering'], preferredCerts: ['cert_pe_ir', 'cert_sho_safety'],
      baseSalary: 52000, stressLevel: 58, isRare: false,
      promotionLadder: ['Jurutera Tapak', 'Jurutera Struktur', 'Jurutera Residen Kanan', 'Pengurus Projek Infrastruktur', 'Pengarah Kejuruteraan Awam'],
      desc: 'Membina jambatan, lebuh raya, pencakar langit dan infrastruktur bandar.'
    },
    {
      id: 'car_elec_eng', title: 'Jurutera Elektrik & Tenaga', industry: 'engineering', icon: '⚡',
      minEducation: 'bachelor', requiredFields: ['engineering'], preferredCerts: ['cert_pe_ir', 'cert_semiconductor_auto'],
      baseSalary: 56000, stressLevel: 56, isRare: false,
      promotionLadder: ['Jurutera Elektrik Muda', 'Jurutera Kuasa Kanan', 'Jurutera Grid Utama', 'Pengurus Tenaga', 'Pengarah Kejuruteraan Tenaga'],
      desc: 'Mengurus grid elektrik, loji tenaga solar dan sistem voltan tinggi.'
    },
    {
      id: 'car_chem_oil', title: 'Jurutera Kimia & Petroleum', industry: 'engineering', icon: '🛢️',
      minEducation: 'bachelor', requiredFields: ['engineering', 'science_research'], preferredCerts: ['cert_sho_safety', 'cert_lean_six_sigma'],
      baseSalary: 72000, stressLevel: 68, isRare: false,
      promotionLadder: ['Jurutera Proses', 'Jurutera Pelantar Kanan', 'Ketua Operasi Loji', 'Pengurus Aset Tenaga', 'Naib Presiden Petroleum'],
      desc: 'Mengendalikan proses penapisan tenaga, petrokimia dan operasi luar pesisir.'
    },
    {
      id: 'car_robotics_eng', title: 'Jurutera Automasi & Robotik', industry: 'engineering', icon: '🦾',
      minEducation: 'bachelor', requiredFields: ['engineering', 'computer_science'], preferredCerts: ['cert_semiconductor_auto'],
      baseSalary: 62000, stressLevel: 58, isRare: false,
      promotionLadder: ['Jurutera Automasi Muda', 'Jurutera Robotik', 'Ketua Sistem Automasi', 'Pengurus R&D Robotik', 'Pengarah Robotik'],
      desc: 'Membina lengan robotik, sistem PLC dan kilang pintar generasi baharu.'
    },
    {
      id: 'car_aerospace_eng', title: 'Jurutera Aeroangkasa', industry: 'engineering', icon: '🚀',
      minEducation: 'bachelor', requiredFields: ['engineering', 'science_research'], preferredCerts: ['cert_pe_ir'],
      baseSalary: 70000, stressLevel: 64, isRare: false,
      promotionLadder: ['Jurutera Aerodinamik', 'Jurutera Sistem Pesawat', 'Ketua Jurutera Pesawat', 'Pengurus Program Aeroangkasa', 'Pengarah Aeroangkasa'],
      desc: 'Merekabentuk enjin jet, satelit dan sistem kawalan penerbangan.'
    },
    {
      id: 'car_sho_officer', title: 'Pegawai Keselamatan & Kesihatan (SHO)', industry: 'engineering', icon: '🦺',
      minEducation: 'diploma', requiredFields: ['engineering', 'science_research', 'trades_vocational'], preferredCerts: ['cert_sho_safety'],
      baseSalary: 48000, stressLevel: 52, isRare: false,
      promotionLadder: ['Penolong Pegawai HSE', 'Pegawai Keselamatan (SHO)', 'Pengurus HSE Kanan', 'Ketua Keselamatan Serantau', 'Pengarah HSE Korporat'],
      desc: 'Memastikan pematuhan keselamatan nyawa di tapak bina, kilang dan minyak & gas.'
    },
    {
      id: 'car_qa_industrial', title: 'Jurutera Kualiti & Lean Six Sigma', industry: 'engineering', icon: '📐',
      minEducation: 'diploma', requiredFields: ['engineering', 'business_finance'], preferredCerts: ['cert_lean_six_sigma'],
      baseSalary: 50000, stressLevel: 50, isRare: false,
      promotionLadder: ['Jurutera QA', 'Jurutera Kualiti Kanan', 'Pakar Lean Black Belt', 'Pengurus Kualiti Global', 'Pengarah Operasi'],
      desc: 'Memastikan produk kilang bebas kecacatan dan mengoptimumkan kos pengeluaran.'
    },

    // === 3. PERUBATAN & KESIHATAN (7 Kerjaya) ===
    {
      id: 'car_doctor_gp', title: 'Doktor Perubatan Am', industry: 'medical', icon: '🩺',
      minEducation: 'bachelor', requiredFields: ['medicine'], preferredCerts: ['cert_emergency_med'],
      baseSalary: 78000, stressLevel: 72, isRare: false,
      promotionLadder: ['Pegawai Perubatan Pelatih', 'Pegawai Perubatan', 'Doktor Pakar Klinikal', 'Ketua Jabatan Perubatan', 'Pengarah Hospital'],
      desc: 'Merawat pesakit, mendiagnosis penyakit dan menyelamatkan nyawa di klinik serta hospital.'
    },
    {
      id: 'car_surgeon', title: 'Pakar Bedah Hospital', industry: 'medical', icon: '🏥',
      minEducation: 'master', requiredFields: ['medicine'], preferredCerts: ['cert_board_surgeon', 'cert_emergency_med'],
      baseSalary: 118000, stressLevel: 82, isRare: false,
      promotionLadder: ['Pendaftar Pembedahan', 'Pakar Bedah', 'Pakar Bedah Kanan', 'Ketua Pembedahan', 'Profesor & Ketua Pakar Bedah'],
      desc: 'Menjalankan pembedahan kompleks berisiko tinggi demi menyelamatkan nyawa pesakit.'
    },
    {
      id: 'car_pharmacist', title: 'Ahli Farmasi Klinikal', industry: 'medical', icon: '💊',
      minEducation: 'bachelor', requiredFields: ['medicine', 'science_research'], preferredCerts: ['cert_clinical_pharmacy'],
      baseSalary: 62000, stressLevel: 48, isRare: false,
      promotionLadder: ['Farmasi Pelatih', 'Ahli Farmasi Berdaftar', 'Ahli Farmasi Klinikal Kanan', 'Pengurus Farmasi', 'Pengarah Farmaseutikal'],
      desc: 'Mengurus preskripsi ubat, keselamatan dos dan formulasi kesihatan pesakit.'
    },
    {
      id: 'car_nurse', title: 'Jururawat Berdaftar', industry: 'medical', icon: '👩‍⚕️',
      minEducation: 'diploma', requiredFields: ['medicine', 'science_research'], preferredCerts: ['cert_emergency_med'],
      baseSalary: 42000, stressLevel: 66, isRare: false,
      promotionLadder: ['Jururawat Pelatih', 'Jururawat Terlatih', 'Ketua Jururawat Wad', 'Penyelia Jururawat', 'Pengarah Kejururawatan'],
      desc: 'Penjaga barisan hadapan yang memberi rawatan penuh kasih sayang kepada pesakit.'
    },
    {
      id: 'car_dentist', title: 'Doktor Pergigian', industry: 'medical', icon: '🦷',
      minEducation: 'bachelor', requiredFields: ['medicine'], preferredCerts: [],
      baseSalary: 82000, stressLevel: 54, isRare: false,
      promotionLadder: ['Doktor Gigi Muda', 'Doktor Pergigian', 'Pakar Ortodontik', 'Pemilik Klinik Pergigian', 'Pengarah Rangkaian Klinik'],
      desc: 'Menjaga kesihatan mulut, pembedahan gusi dan mencipta senyuman menawan.'
    },
    {
      id: 'car_psychologist', title: 'Ahli Psikologi Klinikal', industry: 'medical', icon: '🧠',
      minEducation: 'master', requiredFields: ['medicine', 'science_research', 'education'], preferredCerts: [],
      baseSalary: 60000, stressLevel: 52, isRare: false,
      promotionLadder: ['Kaunselor Klinikal', 'Ahli Psikologi Klinikal', 'Ahli Psikologi Kanan', 'Ketua Kesihatan Mental', 'Pengarah Pusat Terapi'],
      desc: 'Membantu pesakit memulihkan kesihatan mental, trauma dan tekanan hidup.'
    },
    {
      id: 'car_paramedic', title: 'Paramedik & Penyelamat Kecemasan', industry: 'medical', icon: '🚑',
      minEducation: 'high_school', requiredFields: 'any', preferredCerts: ['cert_emergency_med', 'cert_commercial_driver'],
      baseSalary: 38000, stressLevel: 70, isRare: false,
      promotionLadder: ['Pembantu Ambulans', 'Paramedik', 'Paramedik Kanan ICU', 'Ketua Operasi Kecemasan', 'Pengarah Respons Perubatan'],
      desc: 'Bertindak pantas menyelamatkan mangsa kemalangan dan kes kecemasan kritikal.'
    },

    // === 4. KEWANGAN & KORPORAT (8 Kerjaya) ===
    {
      id: 'car_accountant', title: 'Akauntan Bertauliah & Juruaudit', industry: 'finance', icon: '🧮',
      minEducation: 'bachelor', requiredFields: ['business_finance'], preferredCerts: ['cert_acca_cpa'],
      baseSalary: 52000, stressLevel: 60, isRare: false,
      promotionLadder: ['Eksekutif Audit', 'Akauntan Kanan', 'Pengurus Kewangan', 'Rakan Kongsi Audit', 'Ketua Pegawai Kewangan (CFO)'],
      desc: 'Mengurus laporan kewangan korporat, cukai dan audit syarikat tersenarai.'
    },
    {
      id: 'car_invest_banker', title: 'Pegawai Bank Pelaburan (Investment Banker)', industry: 'finance', icon: '🏦',
      minEducation: 'bachelor', requiredFields: ['business_finance', 'law'], preferredCerts: ['cert_cfa', 'cert_acca_cpa'],
      baseSalary: 84000, stressLevel: 80, isRare: false,
      promotionLadder: ['Penganalisis Pelaburan', 'Bersekutu Perbankan', 'Naib Presiden Pelaburan', 'Pengarah Urusan (MD)', 'Ketua Perbankan Global'],
      desc: 'Mengurus penyenaraian IPO, penggabungan syarikat dan urus niaga bilion ringgit.'
    },
    {
      id: 'car_mgmt_consultant', title: 'Perunding Strategi Pengurusan', industry: 'finance', icon: '💼',
      minEducation: 'bachelor', requiredFields: ['business_finance', 'engineering', 'computer_science'], preferredCerts: ['cert_pmp', 'cert_cfa'],
      baseSalary: 72000, stressLevel: 74, isRare: false,
      promotionLadder: ['Penganalisis Strategi', 'Perunding Pengurusan', 'Pengurus Projek Strategi', 'Rakan Kongsi (Partner)', 'Pengarah Urusan Firma'],
      desc: 'Menasihati CEO syarikat multinasional menyelesaikan masalah perniagaan rumit.'
    },
    {
      id: 'car_shariah_finance', title: 'Eksekutif Perbankan Islam & Sukuk', industry: 'finance', icon: '🌙',
      minEducation: 'bachelor', requiredFields: ['business_finance', 'law'], preferredCerts: ['cert_islamic_finance', 'cert_cfa'],
      baseSalary: 58000, stressLevel: 52, isRare: false,
      promotionLadder: ['Pegawai Kewangan Islam', 'Penganalisis Sukuk Kanan', 'Pengurus Produk Syariah', 'Ketua Perbankan Islam', 'Pengarah Kewangan Islam'],
      desc: 'Merangka instrumen pelaburan patuh Syariah, takaful dan sukuk global.'
    },
    {
      id: 'car_marketing_mgr', title: 'Pengurus Pemasaran & Jenama Digital', industry: 'finance', icon: '📣',
      minEducation: 'diploma', requiredFields: ['business_finance', 'arts_media'], preferredCerts: ['cert_digital_marketing'],
      baseSalary: 45000, stressLevel: 52, isRare: false,
      promotionLadder: ['Eksekutif Pemasaran', 'Pengurus Kempen Digital', 'Pengurus Jenama Kanan', 'Pengarah Pemasaran', 'Ketua Pegawai Pemasaran (CMO)'],
      desc: 'Membina kempen iklan tular dan mengembangkan pasaran jenama di seluruh negara.'
    },
    {
      id: 'car_hr_director', title: 'Pengurus Sumber Manusia (HR)', industry: 'finance', icon: '🤝',
      minEducation: 'diploma', requiredFields: ['business_finance', 'law', 'education'], preferredCerts: ['cert_pmp'],
      baseSalary: 44000, stressLevel: 48, isRare: false,
      promotionLadder: ['Eksekutif HR', 'Rakan Niaga HR', 'Pengurus HR Kanan', 'Pengarah Bakat', 'Ketua Pegawai Sumber Manusia (CHRO)'],
      desc: 'Mengambil bakat terbaik, membina budaya kerja sihat dan menjaga kebajikan pekerja.'
    },
    {
      id: 'car_real_estate', title: 'Perunding Hartanah Berlesen', industry: 'finance', icon: '🏢',
      minEducation: 'high_school', requiredFields: 'any', preferredCerts: ['cert_digital_marketing'],
      baseSalary: 40000, stressLevel: 56, isRare: false,
      promotionLadder: ['Ejen Hartanah', 'Perunding Hartanah Kanan', 'Ketua Pasukan Jualan', 'Pengurus Agensi', 'Pengarah Agensi Hartanah'],
      desc: 'Menjual kediaman mewah dan hartanah komersial dengan potensi komisen tinggi.'
    },
    {
      id: 'car_supply_chain', title: 'Pengurus Rantaian Bekalan & Logistik', industry: 'finance', icon: '📦',
      minEducation: 'diploma', requiredFields: ['business_finance', 'engineering'], preferredCerts: ['cert_lean_six_sigma', 'cert_pmp'],
      baseSalary: 49000, stressLevel: 56, isRare: false,
      promotionLadder: ['Eksekutif Logistik', 'Perancang Bekalan', 'Pengurus Rantaian Bekalan', 'Pengarah Logistik Serantau', 'Ketua Pegawai Operasi (COO)'],
      desc: 'Mengawal pergerakan kontena, gudang pintar dan penghantaran merentasi sempadan.'
    },

    // === 5. UNDANG-UNDANG & KERAJAAN (6 Kerjaya) ===
    {
      id: 'car_corp_lawyer', title: 'Peguam Korporat & Peguambela', industry: 'law_gov', icon: '⚖️',
      minEducation: 'bachelor', requiredFields: ['law'], preferredCerts: ['cert_bar_clp', 'cert_corp_arbitration'],
      baseSalary: 74000, stressLevel: 74, isRare: false,
      promotionLadder: ['Peguam Pelatih', 'Peguambela & Peguamcara', 'Peguam Kanan', 'Rakan Kongsi Firma Guaman', 'Peguam Diraja / Hakim Mahkamah Tinggi'],
      desc: 'Berhujah di mahkamah dan mewakili syarikat besar dalam kes undang-undang.'
    },
    {
      id: 'car_prosecutor', title: 'Timbalan Pendakwa Raya', industry: 'law_gov', icon: '🏛️',
      minEducation: 'bachelor', requiredFields: ['law'], preferredCerts: ['cert_bar_clp'],
      baseSalary: 60000, stressLevel: 68, isRare: false,
      promotionLadder: ['Pegawai Undang-Undang', 'Timbalan Pendakwa Raya', 'Pendakwa Raya Kanan', 'Ketua Bahagian Pendakwaan', 'Peguam Negara / Hakim'],
      desc: 'Menegakkan keadilan awam dan mendakwa kes jenayah berat di mahkamah.'
    },
    {
      id: 'car_diplomat', title: 'Pegawai Diplomatik & Hubungan Luar', industry: 'law_gov', icon: '🌍',
      minEducation: 'bachelor', requiredFields: ['law', 'business_finance', 'arts_media'], preferredCerts: ['cert_corp_arbitration'],
      baseSalary: 56000, stressLevel: 56, isRare: false,
      promotionLadder: ['Atase Kedutaan', 'Setiausaha Kedua', 'Kaunselor Kedutaan', 'Timbalan Duta', 'Duta Besar Negara'],
      desc: 'Mewakili negara di kedutaan luar negara dan merunding perjanjian antarabangsa.'
    },
    {
      id: 'car_police_insp', title: 'Inspektor Polis & Pegawai Siasatan', industry: 'law_gov', icon: '👮',
      minEducation: 'high_school', requiredFields: 'any', preferredCerts: ['cert_cybersecurity'],
      baseSalary: 40000, stressLevel: 66, isRare: false,
      promotionLadder: ['Konstabel / Sarjan', 'Inspektor Siasatan', 'Asisten Superintenden (ASP)', 'Ketua Polis Daerah', 'Ketua Polis Negara'],
      desc: 'Menjaga ketenteraman awam dan membanteras sindiket jenayah.'
    },
    {
      id: 'car_firefighter', title: 'Pegawai Bomba & Penyelamat', industry: 'law_gov', icon: '🚒',
      minEducation: 'high_school', requiredFields: 'any', preferredCerts: ['cert_emergency_med', 'cert_sho_safety'],
      baseSalary: 38000, stressLevel: 68, isRare: false,
      promotionLadder: ['Ahli Bomba', 'Ketua Pasukan Operasi', 'Komander Balai', 'Pengarah Negeri', 'Ketua Pengarah Bomba'],
      desc: 'Memadam kebakaran besar dan menjalankan operasi menyelamat bencana alam.'
    },
    {
      id: 'car_urban_planner', title: 'Perancang Bandar & Pegawai Dasar Awam', industry: 'law_gov', icon: '🗺️',
      minEducation: 'bachelor', requiredFields: ['engineering', 'business_finance', 'law'], preferredCerts: ['cert_pmp'],
      baseSalary: 48000, stressLevel: 44, isRare: false,
      promotionLadder: ['Penolong Perancang Bandar', 'Perancang Bandar', 'Perancang Kanan', 'Pengarah Pembangunan Bandar', 'Datuk Bandar / Ketua Setiausaha'],
      desc: 'Merangka pengangkutan awam, taman hijau dan pelan bandar mampan.'
    },

    // === 6. KREATIF, MEDIA & PERMAINAN (7 Kerjaya) ===
    {
      id: 'car_game_dev', title: 'Pembangun Permainan Video (Game Dev)', industry: 'creative', icon: '🎮',
      minEducation: 'diploma', requiredFields: ['computer_science', 'arts_media'], preferredCerts: ['cert_ux_ui'],
      baseSalary: 50000, stressLevel: 60, isRare: false,
      promotionLadder: ['Pembangun Permainan Muda', 'Pereka Tahap & Mekanik', 'Pembangun Utama', 'Pengarah Kreatif Permainan', 'Pengasas Studio Permainan'],
      desc: 'Mencipta dunia permainan video AAA dan indie yang dimainkan seluruh dunia.'
    },
    {
      id: 'car_animator_3d', title: 'Artis Animasi 3D & Kesan Khas (VFX)', industry: 'creative', icon: '🎞️',
      minEducation: 'diploma', requiredFields: ['arts_media', 'computer_science'], preferredCerts: ['cert_ux_ui'],
      baseSalary: 44000, stressLevel: 58, isRare: false,
      promotionLadder: ['Artis 3D Muda', 'Animator Kanan', 'Penyelia VFX', 'Pengarah Animasi', 'Ketua Studio Animasi'],
      desc: 'Menghidupkan watak animasi dan kesan khas sinematik untuk filem pawagam.'
    },
    {
      id: 'car_journalist', title: 'Wartawan Penyiasat & Penyampai Berita', industry: 'creative', icon: '📰',
      minEducation: 'bachelor', requiredFields: ['arts_media', 'law'], preferredCerts: ['cert_digital_marketing'],
      baseSalary: 42000, stressLevel: 60, isRare: false,
      promotionLadder: ['Wartawan Muda', 'Wartawan Penyiasat', 'Penyampai Berita Utama', 'Pengarang Kanan', 'Ketua Pengarang Media'],
      desc: 'Membongkar berita penting negara dan melaporkan secara langsung di kaca TV.'
    },
    {
      id: 'car_graphic_brand', title: 'Pereka Grafik & Pengarah Seni', industry: 'creative', icon: '🖌️',
      minEducation: 'high_school', requiredFields: 'any', preferredCerts: ['cert_ux_ui', 'cert_digital_marketing'],
      baseSalary: 36000, stressLevel: 46, isRare: false,
      promotionLadder: ['Pereka Grafik', 'Pereka Visual Kanan', 'Pengarah Seni', 'Pengarah Kreatif', 'Pengarah Agensi Kreatif'],
      desc: 'Mereka identiti visual, poster kempen dan penjenamaan kreatif.'
    },
    {
      id: 'car_music_prod', title: 'Penerbit Muzik & Jurutera Bunyi', industry: 'creative', icon: '🎧',
      minEducation: 'high_school', requiredFields: 'any', preferredCerts: [],
      baseSalary: 40000, stressLevel: 50, isRare: false,
      promotionLadder: ['Pembantu Studio', 'Jurutera Bunyi', 'Penerbit Muzik', 'Penerbit Eksekutif', 'Pengarah Label Rakaman'],
      desc: 'Menggubah susunan lagu hit dan mengendalikan rakaman artis popular.'
    },
    {
      id: 'car_photographer_pro', title: 'Jurugambar Komersial & Fesyen', industry: 'creative', icon: '📸',
      minEducation: 'high_school', requiredFields: 'any', preferredCerts: ['cert_digital_marketing'],
      baseSalary: 38000, stressLevel: 44, isRare: false,
      promotionLadder: ['Pembantu Kamera', 'Jurugambar Komersial', 'Jurugambar Majalah', 'Pengarah Fotografi', 'Jurugambar Ikonik Antarabangsa'],
      desc: 'Merakam kempen jenama fesyen, potret selebriti dan dokumentari visual.'
    },
    {
      id: 'car_copywriter', title: 'Penulis Skrip & Pencipta Konten Kreatif', industry: 'creative', icon: '✍️',
      minEducation: 'high_school', requiredFields: 'any', preferredCerts: ['cert_digital_marketing'],
      baseSalary: 38000, stressLevel: 46, isRare: false,
      promotionLadder: ['Penulis Konten', 'Penulis Skrip Drama', 'Ketua Penulis Kreatif', 'Pengarah Kandungan', 'Penerbit Kreatif Eksekutif'],
      desc: 'Menghasilkan skrip drama, kempen iklan dan penceritaan yang memukau.'
    },

    // === 7. PENERBANGAN & MARITIM (5 Kerjaya) ===
    {
      id: 'car_pilot', title: 'Juruterbang Penerbangan Komersial', industry: 'aviation', icon: '✈️',
      minEducation: 'high_school', requiredFields: 'any', preferredCerts: ['cert_cpl_pilot'],
      baseSalary: 88000, stressLevel: 68, isRare: false,
      promotionLadder: ['Pegawai Kedua', 'Pegawai Pertama (Co-Pilot)', 'Kapten Pesawat Domestik', 'Kapten Pesawat Jarak Jauh', 'Ketua Juruterbang Syarikat'],
      desc: 'Menerbangkan pesawat penumpang merentasi benua dengan tanggungjawab tinggi.'
    },
    {
      id: 'car_atc', title: 'Pengawal Trafik Udara (ATC)', industry: 'aviation', icon: '🗼',
      minEducation: 'diploma', requiredFields: ['engineering', 'computer_science', 'science_research'], preferredCerts: ['cert_cpl_pilot'],
      baseSalary: 68000, stressLevel: 78, isRare: false,
      promotionLadder: ['Pelatih Menara Kawalan', 'Pengawal Trafik Udara', 'Pengawal Radar Kanan', 'Penyelia Menara Kawalan', 'Pengarah Ruang Udara'],
      desc: 'Mengawal ratusan pendaratan dan pelepasan pesawat dengan ketepatan sesaat.'
    },
    {
      id: 'car_cabin_crew', title: 'Pramugara / Pramugari Antarabangsa', industry: 'aviation', icon: '🛫',
      minEducation: 'high_school', requiredFields: 'any', preferredCerts: ['cert_barista_culinary'],
      baseSalary: 38000, stressLevel: 54, isRare: false,
      promotionLadder: ['Kru Kabin Muda', 'Kru Kabin Kelas Perniagaan', 'Ketua Kru Kabin (Purser)', 'Jurulatih Kabin', 'Pengurus Perkhidmatan Penerbangan'],
      desc: 'Menjaga keselamatan dan keselesaan penumpang sambil mengembara ke seluruh dunia.'
    },
    {
      id: 'car_ship_captain', title: 'Pegawai Dek & Kapten Kapal Kargo', industry: 'aviation', icon: '🚢',
      minEducation: 'diploma', requiredFields: ['engineering', 'trades_vocational'], preferredCerts: ['cert_sho_safety'],
      baseSalary: 66000, stressLevel: 66, isRare: false,
      promotionLadder: ['Kadet Dek', 'Pegawai Ketiga', 'Pegawai Pertama', 'Kapten Kapal (Master Mariner)', 'Pengarah Armada Maritim'],
      desc: 'Mengemudi kapal dagang gergasi merentasi lautan perdagangan dunia.'
    },
    {
      id: 'car_commercial_diver', title: 'Penyelam Komersial & Bawah Laut', industry: 'aviation', icon: '🤿',
      minEducation: 'high_school', requiredFields: 'any', preferredCerts: ['cert_commercial_diver', 'cert_welding'],
      baseSalary: 64000, stressLevel: 72, isRare: false,
      promotionLadder: ['Penyelam Pembantu', 'Penyelam Komersial', 'Penyelam Kimpalan Laut Dalam', 'Penyelia Selaman', 'Pengurus Operasi Bawah Laut'],
      desc: 'Membaiki saluran paip dasar laut dan struktur pelantar dengan bayaran lumayan.'
    },

    // === 8. SAINS, AKADEMIA & PENYELIDIKAN PhD (6 Kerjaya) ===
    {
      id: 'car_university_prof', title: 'Pensyarah Universiti & Profesor', industry: 'academia', icon: '🎓',
      minEducation: 'master', requiredFields: 'any', preferredCerts: ['cert_teaching_pedagogy'],
      baseSalary: 62000, stressLevel: 52, isRare: false,
      promotionLadder: ['Pensyarah Muda', 'Pensyarah Kanan', 'Profesor Madya', 'Profesor Penuh', 'Naib Canselor Universiti'],
      desc: 'Mendidik mahasiswa, menyelia tesis PhD dan menerbitkan penyelidikan berimpak.'
    },
    {
      id: 'car_chief_scientist', title: 'Saintis Penyelidik Utama (R&D PhD)', industry: 'academia', icon: '🔬',
      minEducation: 'phd', requiredFields: ['science_research', 'engineering', 'medicine', 'computer_science'], preferredCerts: ['cert_data_ai', 'cert_clinical_pharmacy'],
      baseSalary: 94000, stressLevel: 62, isRare: false,
      promotionLadder: ['Felo Pasca-Kedoktoran', 'Saintis Penyelidik Kanan', 'Ketua Makmal R&D', 'Ketua Saintis', 'Pengarah Institut Sains Kebangsaan'],
      desc: 'Menerajui penemuan saintifik bertaraf dunia, paten inovasi dan geran penyelidikan.'
    },
    {
      id: 'car_biotech_res', title: 'Saintis Bioteknologi & Genetik', industry: 'academia', icon: '🧬',
      minEducation: 'bachelor', requiredFields: ['science_research', 'medicine'], preferredCerts: ['cert_clinical_pharmacy'],
      baseSalary: 64000, stressLevel: 56, isRare: false,
      promotionLadder: ['Pembantu Makmal Bio', 'Saintis Bioteknologi', 'Penyelidik Genetik Kanan', 'Ketua Bioteknologi', 'Pengarah Penyelidikan Bio'],
      desc: 'Membangunkan vaksin, terapi gen dan inovasi pertanian moden.'
    },
    {
      id: 'car_school_teacher', title: 'Guru Sekolah & Pendidik', industry: 'academia', icon: '🍎',
      minEducation: 'diploma', requiredFields: ['education', 'science_research', 'arts_media'], preferredCerts: ['cert_teaching_pedagogy'],
      baseSalary: 36000, stressLevel: 54, isRare: false,
      promotionLadder: ['Guru Permulaan', 'Guru Cemerlang', 'Ketua Panitia', 'Penolong Kanan', 'Pengetua Sekolah'],
      desc: 'Membentuk generasi masa depan dengan ilmu, akhlak dan kasih sayang.'
    },
    {
      id: 'car_climate_sci', title: 'Saintis Iklim & Alam Sekitar', industry: 'academia', icon: '🌿',
      minEducation: 'bachelor', requiredFields: ['science_research', 'engineering'], preferredCerts: ['cert_sho_safety'],
      baseSalary: 56000, stressLevel: 48, isRare: false,
      promotionLadder: ['Pegawai Alam Sekitar', 'Saintis Iklim', 'Penasihat Kelestarian Kanan', 'Ketua Dasar Iklim', 'Pengarah Alam Sekitar Global'],
      desc: 'Mengkaji perubahan cuaca, tenaga boleh diperbaharui dan pemuliharaan bumi.'
    },
    {
      id: 'car_archaeologist', title: 'Ahli Arkeologi & Kurator Muzium', industry: 'academia', icon: '🏺',
      minEducation: 'bachelor', requiredFields: ['arts_media', 'science_research', 'education'], preferredCerts: [],
      baseSalary: 44000, stressLevel: 38, isRare: false,
      promotionLadder: ['Pembantu Galian', 'Ahli Arkeologi', 'Kurator Kanan', 'Ketua Ekspedisi Sejarah', 'Pengarah Muzium Negara'],
      desc: 'Menggali artifak tamadun purba dan memelihara khazanah warisan dunia.'
    },

    // === 9. HOSPITALITI & KULINARI (5 Kerjaya) ===
    {
      id: 'car_exec_chef', title: 'Chef Kulinari & Dapur Hotel', industry: 'hospitality', icon: '👨‍🍳',
      minEducation: 'none', requiredFields: 'any', preferredCerts: ['cert_barista_culinary'],
      baseSalary: 36000, stressLevel: 64, isRare: false,
      promotionLadder: ['Pembantu Dapur (Commis)', 'Chef De Partie', 'Sous Chef', 'Chef Eksekutif', 'Chef Selebriti & Pemilik Restoran'],
      desc: 'Mencipta menu gastronomi memukau di dapur restoran dan hotel lima bintang.'
    },
    {
      id: 'car_hotel_mgr', title: 'Pengurus Hotel & Resort Mewah', industry: 'hospitality', icon: '🏨',
      minEducation: 'diploma', requiredFields: ['culinary_hospitality', 'business_finance'], preferredCerts: ['cert_pmp'],
      baseSalary: 46000, stressLevel: 58, isRare: false,
      promotionLadder: ['Penyambut Tetamu', 'Penyelia Operasi Hotel', 'Pengurus Bilik & Acara', 'Pengurus Besar Hotel', 'Pengarah Kumpulan Resort'],
      desc: 'Mengurus hospitaliti tetamu VIP dan operasi resort percutian antarabangsa.'
    },
    {
      id: 'car_barista_roaster', title: 'Barista Pakar & Pemanggang Kopi', industry: 'hospitality', icon: '☕',
      minEducation: 'none', requiredFields: 'any', preferredCerts: ['cert_barista_culinary'],
      baseSalary: 28000, stressLevel: 40, isRare: false,
      promotionLadder: ['Barista Pelatih', 'Ketua Barista', 'Pemanggang Kopi (Roaster)', 'Pengurus Rangkaian Kafe', 'Pengasas Jenama Kopi'],
      desc: 'Menghasilkan seni latte sempurna dan memanggang biji kopi istimewa.'
    },
    {
      id: 'car_pastry_chef', title: 'Chef Pastri & Artisan Bakeri', industry: 'hospitality', icon: '🥐',
      minEducation: 'none', requiredFields: 'any', preferredCerts: ['cert_barista_culinary'],
      baseSalary: 32000, stressLevel: 52, isRare: false,
      promotionLadder: ['Pembantu Bakeri', 'Pembuat Pastri', 'Chef Pastri Kanan', 'Ketua Patisserie', 'Pemilik Rangkaian Bakeri'],
      desc: 'Membakar croissant rangup, kek perkahwinan mewah dan pencuci mulut artisan.'
    },
    {
      id: 'car_tour_director', title: 'Pengarah Pelancongan & Pemandu Ekspedisi', industry: 'hospitality', icon: '🧳',
      minEducation: 'high_school', requiredFields: 'any', preferredCerts: ['cert_digital_marketing'],
      baseSalary: 34000, stressLevel: 44, isRare: false,
      promotionLadder: ['Pemandu Pelancong', 'Ketua Rombongan', 'Perancang Percutian VIP', 'Pengurus Agensi Pelancongan', 'Pengarah Pelancongan'],
      desc: 'Membawa pelancong meneroka destinasi ikonik dan keajaiban budaya dunia.'
    },

    // === 10. KEMAHIRAN TEKNIKAL & KOLAR BIRU (6 Kerjaya) ===
    {
      id: 'car_electrician', title: 'Juruteknik Elektrik & Wireman', industry: 'trades', icon: '⚡',
      minEducation: 'none', requiredFields: 'any', preferredCerts: ['cert_wireman'],
      baseSalary: 38000, stressLevel: 48, isRare: false,
      promotionLadder: ['Perantis Elektrik', 'Wireman Bertauliah', 'Juruteknik Voltan Tinggi', 'Penyelia Elektrik', 'Kontraktor Elektrik Utama'],
      desc: 'Memasang dan menyelenggara sistem pendawaian bangunan serta kilang.'
    },
    {
      id: 'car_welder_6g', title: 'Pengimpal Industri & Pelantar (6G)', industry: 'trades', icon: '🔥',
      minEducation: 'none', requiredFields: 'any', preferredCerts: ['cert_welding', 'cert_sho_safety'],
      baseSalary: 46000, stressLevel: 60, isRare: false,
      promotionLadder: ['Pengimpal Bengkel', 'Pengimpal Struktur', 'Pengimpal Paip 6G', 'Pemeriksa Kimpalan Kanan', 'Kontraktor Fabrikasi Keluli'],
      desc: 'Kemahiran kimpalan berketepatan tinggi dengan bayaran lumayan di sektor minyak & gas.'
    },
    {
      id: 'car_auto_mechanic', title: 'Mekanik Automotif & Kenderaan EV', industry: 'trades', icon: '🔧',
      minEducation: 'none', requiredFields: 'any', preferredCerts: ['cert_machine_maintenance', 'cert_wireman'],
      baseSalary: 35000, stressLevel: 46, isRare: false,
      promotionLadder: ['Pembantu Bengkel', 'Mekanik Bertauliah', 'Pakar Diagnostik EV', 'Ketua Foreman', 'Pemilik Pusat Servis Automotif'],
      desc: 'Membaiki enjin prestasi tinggi, sistem brek dan kenderaan elektrik moden.'
    },
    {
      id: 'car_cnc_machinist', title: 'Juruteknik Mesin CNC & Kilang', industry: 'trades', icon: '🛠️',
      minEducation: 'none', requiredFields: 'any', preferredCerts: ['cert_machine_maintenance', 'cert_semiconductor_auto'],
      baseSalary: 40000, stressLevel: 48, isRare: false,
      promotionLadder: ['Operator Pengeluaran', 'Juruteknik CNC', 'Pengaturcara CNC Kanan', 'Penyelia Bengkel Kejuruteraan', 'Pengurus Pengeluaran'],
      desc: 'Mengendalikan mesin pemotong logam berketepatan mikron untuk industri aero & cip.'
    },
    {
      id: 'car_logistics_driver', title: 'Pemandu Logistik & Pengangkutan Berat', industry: 'trades', icon: '🚛',
      minEducation: 'none', requiredFields: 'any', preferredCerts: ['cert_commercial_driver'],
      baseSalary: 34000, stressLevel: 54, isRare: false,
      promotionLadder: ['Pemandu Penghantaran', 'Pemandu Treler Komersial', 'Ketua Pemandu Kontena', 'Penyelia Armada', 'Pengurus Syarikat Pengangkutan'],
      desc: 'Memastikan barang dagangan dan bekalan negara tiba tepat pada masanya.'
    },
    {
      id: 'car_carpenter_artisan', title: 'Tukang Kayu & Kontraktor Ubah Suai', industry: 'trades', icon: '🪚',
      minEducation: 'none', requiredFields: 'any', preferredCerts: ['cert_sho_safety'],
      baseSalary: 36000, stressLevel: 46, isRare: false,
      promotionLadder: ['Pembantu Tukang', 'Tukang Kayu Mahir', 'Pakar Kabinet & Interior', 'Penyelia Tapak Ubah Suai', 'Kontraktor Binaan Utama'],
      desc: 'Membina perabot kayu tempahan khas dan mengubah suai kediaman moden.'
    },

    // === 11. SUKAN & KECERGASAN (4 Kerjaya) ===
    {
      id: 'car_personal_trainer', title: 'Jurulatih Kecergasan Peribadi', industry: 'sports', icon: '🏋️',
      minEducation: 'none', requiredFields: 'any', preferredCerts: ['cert_fitness_trainer'],
      baseSalary: 36000, stressLevel: 40, isRare: false,
      promotionLadder: ['Instruktor Gim', 'Jurulatih Kecergasan', 'Jurulatih Selebriti', 'Pengurus Kelab Kecergasan', 'Pengasas Rangkaian Gim'],
      desc: 'Membimbing klien mencapai badan sihat, kuat dan gaya hidup cergas.'
    },
    {
      id: 'car_physio', title: 'Ahli Fisioterapi Sukan', industry: 'sports', icon: '🏃',
      minEducation: 'bachelor', requiredFields: ['medicine', 'science_research'], preferredCerts: ['cert_fitness_trainer'],
      baseSalary: 52000, stressLevel: 46, isRare: false,
      promotionLadder: ['Fisioterapis Muda', 'Ahli Fisioterapi Sukan', 'Ketua Pemulihan Atlet', 'Fisioterapis Pasukan Kebangsaan', 'Pengarah Klinik Rehabilitasi'],
      desc: 'Memulihkan kecederaan otot dan sendi atlet profesional.'
    },
    {
      id: 'car_pro_coach', title: 'Jurulatih Sukan Profesional', industry: 'sports', icon: '🏅',
      minEducation: 'high_school', requiredFields: 'any', preferredCerts: ['cert_fitness_trainer'],
      baseSalary: 48000, stressLevel: 62, isRare: false,
      promotionLadder: ['Jurulatih Akademi Belia', 'Penolong Jurulatih Kelab', 'Ketua Jurulatih Kelab', 'Jurulatih Skuad Kebangsaan', 'Pengarah Teknikal Sukan'],
      desc: 'Merancang taktikal kemenangan dan melatih atlet juara.'
    },
    {
      id: 'car_nutritionist', title: 'Pakar Pemakanan & Dietetik', industry: 'sports', icon: '🥗',
      minEducation: 'bachelor', requiredFields: ['medicine', 'science_research', 'culinary_hospitality'], preferredCerts: ['cert_fitness_trainer'],
      baseSalary: 48000, stressLevel: 38, isRare: false,
      promotionLadder: ['Pegawai Dietetik', 'Pakar Pemakanan', 'Perunding Nutrisi Atlet', 'Ketua Pemakanan Kesihatan', 'Pengarah Kesihatan & Nutrisi'],
      desc: 'Menyusun pelan diet saintifik untuk hospital, atlet dan kesihatan awam.'
    },

    // === 12. KERJAYA NADIR & LUAR BIASA (8 Kerjaya — Headhunter / Rare!) ===
    {
      id: 'car_ethical_hacker', title: 'Penggodam Beretika (White-Hat Hacker)', industry: 'rare', icon: '🕶️',
      minEducation: 'diploma', requiredFields: ['computer_science', 'engineering'], preferredCerts: ['cert_cybersecurity'],
      baseSalary: 88000, stressLevel: 64, isRare: true,
      promotionLadder: ['Pemburu Pepijat (Bug Bounty)', 'Penguji Penembusan (Pentester)', 'Ketua Red Team', 'Arkitek Keselamatan Elit', 'Penasihat Siber Antarabangsa'],
      desc: 'Dibayar lumayan oleh gergasi teknologi untuk menggodam sistem mereka sebelum penjenayah sempat melakukannya.'
    },
    {
      id: 'car_private_investigator', title: 'Penyiasat Persendirian (PI)', industry: 'rare', icon: '🕵️',
      minEducation: 'high_school', requiredFields: 'any', preferredCerts: ['cert_cybersecurity'],
      baseSalary: 56000, stressLevel: 66, isRare: true,
      promotionLadder: ['Pembantu Siasatan', 'Penyiasat Persendirian Berlesen', 'Penyiasat Korporat', 'Ketua Agensi Risik', 'Pengarah Agensi Siasatan Elit'],
      desc: 'Menyiasat kes misteri, penipuan korporat dan mengesan jejak orang hilang.'
    },
    {
      id: 'car_luxury_watchmaker', title: 'Pembuat Jam Tangan Mewah (Horologist)', industry: 'rare', icon: '⌚',
      minEducation: 'diploma', requiredFields: ['engineering', 'trades_vocational', 'arts_media'], preferredCerts: ['cert_machine_maintenance'],
      baseSalary: 78000, stressLevel: 44, isRare: true,
      promotionLadder: ['Perantis Horologi', 'Pembuat Jam Mekanikal', 'Master Watchmaker', 'Ketua Atelier Jam Mewah', 'Pengarah Kreatif Horologi'],
      desc: 'Memasang ratusan gear mikroskopik jam tangan mekanikal mewah bernilai ratusan ribu.'
    },
    {
      id: 'car_marine_biologist', title: 'Ahli Biologi Marin & Ekspedisi Laut Dalam', industry: 'rare', icon: '🐋',
      minEducation: 'bachelor', requiredFields: ['science_research'], preferredCerts: ['cert_commercial_diver'],
      baseSalary: 62000, stressLevel: 48, isRare: true,
      promotionLadder: ['Penyelidik Terumbu Karang', 'Ahli Biologi Marin', 'Ketua Ekspedisi Oseanografi', 'Saintis Marin Utama', 'Pengarah Institut Oseanografi'],
      desc: 'Menyelam mengkaji paus, terumbu karang dan spesies misteri di dasar lautan.'
    },
    {
      id: 'car_astronaut', title: 'Angkasawan & Pakar Misi Angkasa', industry: 'rare', icon: '🧑‍🚀',
      minEducation: 'master', requiredFields: ['engineering', 'science_research', 'computer_science', 'medicine'], preferredCerts: ['cert_cpl_pilot', 'cert_commercial_diver'],
      baseSalary: 125000, stressLevel: 80, isRare: true,
      promotionLadder: ['Calon Angkasawan', 'Pakar Misi Orbit', 'Jurutera Stesen Angkasa', 'Komander Misi Angkasa', 'Pengarah Agensi Angkasa'],
      desc: 'Menjalani latihan graviti sifar dan melancarkan misi bersejarah ke orbit bumi!'
    },
    {
      id: 'car_film_director', title: 'Pengarah Filem Pawagam', industry: 'rare', icon: '🎬',
      minEducation: 'high_school', requiredFields: 'any', preferredCerts: ['cert_ux_ui'],
      baseSalary: 76000, stressLevel: 72, isRare: true,
      promotionLadder: ['Penolong Pengarah', 'Pengarah Filem Indie', 'Pengarah Filem Box Office', 'Pengarah Pemenang Anugerah', 'Legenda Sinema Antarabangsa'],
      desc: 'Mengarahkan kru produksi besar dan menghasilkan karya filem pecah panggung.'
    },
    {
      id: 'car_esports_coach', title: 'Jurulatih & Penganalisis E-Sukan Dunia', industry: 'rare', icon: '🎮',
      minEducation: 'high_school', requiredFields: 'any', preferredCerts: ['cert_digital_marketing'],
      baseSalary: 58000, stressLevel: 62, isRare: true,
      promotionLadder: ['Penganalisis Pasukan', 'Jurulatih E-Sukan', 'Ketua Jurulatih Liga Utama', 'Pengurus Pasukan Juara Dunia', 'Pengarah Organisasi E-Sukan'],
      desc: 'Merancang strategi perlawanan kejohanan e-sukan global bernilai jutaan dolar.'
    },
    {
      id: 'car_venture_capitalist', title: 'Pemodal Teroka (Venture Capitalist)', industry: 'rare', icon: '💎',
      minEducation: 'bachelor', requiredFields: ['business_finance', 'computer_science', 'engineering'], preferredCerts: ['cert_cfa', 'cert_acca_cpa'],
      baseSalary: 112000, stressLevel: 74, isRare: true,
      promotionLadder: ['Penganalisis Startup', 'Bersekutu Pelaburan VC', 'Prinsipal Dana', 'Rakan Kongsi Umum (GP)', 'Pengarah Urusan Dana Bilion'],
      desc: 'Menilai syarikat pemula (startup) unicorn masa depan dan melabur dana besar.'
    }
  ],

  // --------------------------------------------------------------------------
  // 16 SOALAN TEMU DUGA KERJA (SITUASI DUNIA SEBENAR — BAHASA MELAYU)
  // --------------------------------------------------------------------------
  INTERVIEW_QUESTIONS: [
    {
      prompt: 'Panel penemu duga bertanya: "Apakah kelemahan terbesar anda dan bagaimana anda mengatasinya?"',
      options: [
        { label: 'Kongsi kelemahan sebenar berserta sistem & langkah konkrit yang anda guna untuk memperbaikinya.', bonus: 22 },
        { label: 'Jawab klise: "Saya terlalu rajin dan terlalu mementingkan kesempurnaan."', bonus: 4 },
        { label: 'Mengaku anda tiada sebarang kelemahan langsung.', bonus: -18 }
      ]
    },
    {
      prompt: 'Pengurus pengambilan menguji anda: "Jika tarikh akhir projek penting diawalkan secara mengejut, apakah tindakan pertama anda?"',
      options: [
        { label: 'Susun keutamaan tugasan kritikal, maklumkan skop realistik kepada ketua & selaraskan pasukan segera.', bonus: 24 },
        { label: 'Bekerja seorang diri tanpa tidur dan berharap semuanya sempat siap.', bonus: 5 },
        { label: 'Beritahu ketua bahawa permintaan itu tidak masuk akal dan enggan melakukannya.', bonus: -20 }
      ]
    },
    {
      prompt: 'Penemu duga mengajukan situasi: "Rakan sepasukan anda membuat kesilapan besar yang menjejaskan klien. Apa anda lakukan?"',
      options: [
        { label: 'Fokus selesaikan masalah klien dahulu secara berpasukan, kemudian buat semakan proses tanpa menyalahkan peribadi.', bonus: 24 },
        { label: 'Diamkan sahaja dan berharap tiada sesiapa perasan kesilapan itu.', bonus: -16 },
        { label: 'Hantar e-mel kepada semua pengarah untuk mendedahkan kesilapannya serta-merta.', bonus: -12 }
      ]
    },
    {
      prompt: 'Ketua jabatan bertanya: "Mengapakah kami patut memilih anda berbanding 50 calon lain yang mempunyai kelayakan serupa?"',
      options: [
        { label: 'Hubungkan pengalaman, kemahiran khusus & hasil kerja anda terus kepada masalah utama syarikat ini.', bonus: 22 },
        { label: 'Beritahu bahawa anda sangat memerlukan gaji bulanan untuk bayar bil.', bonus: -12 },
        { label: 'Katakan anda seorang yang cepat belajar dan ramah dengan semua orang.', bonus: 8 }
      ]
    },
    {
      prompt: 'Penemu duga menguji etika anda: "Bagaimana jika anda diminta meluluskan kerja yang tidak menepati piawaian kualiti demi mengejar sasaran?"',
      options: [
        { label: 'Tegaskan keselamatan & kualiti tidak boleh dikompromi, sambil cadangkan jalan penyelesaian pantas yang mematuhi piawaian.', bonus: 24 },
        { label: 'Ikut sahaja arahan asalkan nama anda tidak ditulis pada laporan.', bonus: -18 },
        { label: 'Tangguhkan jawapan dan tunggu orang lain membuat keputusan.', bonus: 0 }
      ]
    },
    {
      prompt: 'Panel teknikal bertanya: "Ceritakan saat anda gagal dalam satu tugasan dan apa yang anda pelajari."',
      options: [
        { label: 'Terangkan punca kegagalan dengan jujur, tanggungjawab anda, dan bagaimana pengajaran itu menjadikan projek seterusnya berjaya.', bonus: 22 },
        { label: 'Salahkan bekas majikan dan rakan sekerja lama atas kegagalan tersebut.', bonus: -20 },
        { label: 'Katakan anda tidak pernah gagal dalam apa-apa tugasan sepanjang hidup.', bonus: -10 }
      ]
    },
    {
      prompt: 'Pengurus HR bertanya: "Di manakah anda melihat diri anda dalam tempoh 5 tahun akan datang?"',
      options: [
        { label: 'Menjadi pakar yang menyumbang impak besar, membimbing junior dan berkembang seiring pertumbuhan syarikat.', bonus: 22 },
        { label: 'Mungkin sudah berhenti dan buka perniagaan sendiri tahun depan.', bonus: -14 },
        { label: 'Belum fikir lagi, ikut sahaja arus semasa.', bonus: -4 }
      ]
    },
    {
      prompt: 'Situasi pelanggan: "Seorang pelanggan VIP sedang marah besar di hadapan anda. Bagaimana anda menanganinya?"',
      options: [
        { label: 'Dengar dengan tenang dan empati, akui kesulitan beliau, lalu tawarkan pelan penyelesaian segera yang jelas.', bonus: 24 },
        { label: 'Minta beliau bertenang dengan nada tegas kerana beliau mengganggu orang lain.', bonus: -12 },
        { label: 'Pindahkan terus kepada staf lain tanpa mendengar aduannya.', bonus: -16 }
      ]
    },
    {
      prompt: 'Penemu duga bertanya: "Apakah yang mendorong anda memohon di syarikat kami khususnya?"',
      options: [
        { label: 'Sebut pencapaian terkini syarikat, produk/misi mereka dan bagaimana kepakaran anda dapat membantu projek akan datang.', bonus: 24 },
        { label: 'Pejabat ini dekat dengan rumah dan nampak selesa.', bonus: 4 },
        { label: 'Sebenarnya saya hantar resume secara rawak ke semua tempat.', bonus: -22 }
      ]
    },
    {
      prompt: 'Ujian tekanan: "Anda menerima 3 tugasan penting serentak daripada 3 pengurus berbeza. Apa strategi anda?"',
      options: [
        { label: 'Nilai tahap kepentingan & impak setiap tugasan, kemudian bincang keutamaan secara telus bersama pengurus terlibat.', bonus: 22 },
        { label: 'Buat mana yang paling senang dahulu dan biarkan yang susah.', bonus: -6 },
        { label: 'Tolak dua tugasan terus tanpa perbincangan.', bonus: -16 }
      ]
    },
    {
      prompt: 'Panel bertanya: "Jika teknologi atau peraturan industri berubah mendadak tahun depan, bagaimana anda menyesuaikan diri?"',
      options: [
        { label: 'Sentiasa melabur dalam pembelajaran berterusan, sijil baharu dan cepat menguji aliran kerja moden.', bonus: 22 },
        { label: 'Tunggu syarikat hantar kursus berbayar barulah saya belajar.', bonus: 2 },
        { label: 'Saya lebih suka kekal dengan cara lama yang sudah biasa.', bonus: -16 }
      ]
    },
    {
      prompt: 'Soalan kepimpinan: "Bagaimana gaya anda bekerjasama dengan rakan sepasukan yang mempunyai pendapat bertentangan?"',
      options: [
        { label: 'Dengar hujah berasaskan data daripada kedua-dua pihak dan cari titik persetujuan terbaik untuk matlamat bersama.', bonus: 24 },
        { label: 'Ikut sahaja pendapat majoriti supaya cepat habis mesyuarat.', bonus: 6 },
        { label: 'Pertahankan idea sendiri sampai semua orang mengalah.', bonus: -14 }
      ]
    },
    {
      prompt: 'Soalan bajet: "Projek anda melebihi bajet sebanyak 15% di pertengahan jalan. Apa langkah anda?"',
      options: [
        { label: 'Audit pecahan kos segera, kenal pasti pembaziran, bentangkan pilihan penjimatan & maklumkan pihak pengurusan awal.', bonus: 24 },
        { label: 'Teruskan perbelanjaan dan maklumkan hanya selepas projek tamat.', bonus: -20 },
        { label: 'Potong kualiti bahan secara senyap-senyap supaya bajet cukup.', bonus: -16 }
      ]
    },
    {
      prompt: 'Soalan inisiatif: "Apakah pencapaian yang paling anda banggakan setakat ini?"',
      options: [
        { label: 'Kongsikan contoh spesifik menggunakan kaedah Situasi-Tindakan-Hasil yang jelas dan terukur.', bonus: 22 },
        { label: 'Ceritakan secara umum bahawa anda sentiasa datang awal ke tempat kerja.', bonus: 6 },
        { label: 'Tidak pasti, rasa semuanya biasa-biasa sahaja.', bonus: -10 }
      ]
    },
    {
      prompt: 'Penemu duga memberi ruang: "Ada sebarang soalan yang anda ingin tanyakan kepada kami sebelum temu duga tamat?"',
      options: [
        { label: 'Tanya: "Apakah ukuran kejayaan utama untuk jawatan ini dalam 90 hari pertama dan cabaran terbesar pasukan sekarang?"', bonus: 24 },
        { label: 'Tanya: "Berapa hari cuti tahunan dan bila waktu rehat makan tengah hari?"', bonus: 2 },
        { label: 'Jawab: "Tiada soalan apa-apa, terima kasih."', bonus: -6 }
      ]
    },
    {
      prompt: 'Soalan rundingan: "Bagaimanakah anda memastikan keseimbangan antara kelajuan kerja dan ketelitian?"',
      options: [
        { label: 'Gunakan senarai semak piawai dan semakan berkala supaya kerja pantas tetapi bebas kesilapan kritikal.', bonus: 22 },
        { label: 'Siapkan secepat mungkin, kalau ada salah baru baiki kemudian.', bonus: -10 },
        { label: 'Ambil masa selama mungkin walaupun melepasi tarikh akhir.', bonus: -12 }
      ]
    }
  ]
};
