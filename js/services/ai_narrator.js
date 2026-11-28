/* ==========================================================================
   WorldLife — Servis Dialog AI Dinamik (Cloudflare Worker, Non-Blocking)
   Bahasa Melayu — Anti-Halusinasi Keluarga, Anti-Pengulangan & Sudut Sinematik
   ========================================================================== */

window.AINarrator = {
  ENDPOINT: 'https://worldlife-ai.asraf-saharudin97.workers.dev/',
  STORAGE_KEY: 'wl_ai_enabled',
  COOLDOWN_MS: 2500,
  TIMEOUT_MS: 4500,
  _lastCallTime: 0,
  _recentAiHistory: [],
  _lastSceneAngle: null,

  isEnabled() {
    // AI Dinamik (+Umur) sentiasa aktif secara kekal walaupun terdapat rekod lama 'false' dalam localStorage
    return true;
  },

  setEnabled() {
    return true;
  },

  _band(val) {
    const n = Number(val) || 0;
    if (n < 35) return 'rendah';
    if (n < 70) return 'sederhana';
    return 'tinggi';
  },

  _stripHtml(str) {
    return String(str || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  },

  _getWealthTier(s) {
    const nw = (window.GameState && GameState.getNetWorth) ? GameState.getNetWorth(s) : (s.money || 0);
    const usd = (window.Utils && Utils.localToUsd) ? Utils.localToUsd(nw, s.countryId) : (nw / 4.5);
    if (usd >= 1000000000) return 'bilionair';
    if (usd >= 1000000) return 'kaya';
    if (usd >= 25000) return 'sederhana';
    return 'miskin';
  },

  _extractLivingFamily(s) {
    const rels = Array.isArray(s.relationships)
      ? s.relationships.filter(r => r && r.alive !== false && !r.isDead && !r.deceased)
      : [];

    const parentRoleRe = /^(ibu|bapa|ayah|mak|mother|father|ibu tiri|bapa tiri|ibu angkat|bapa angkat)$/i;
    const childRoleRe = /^(anak|anak lelaki|anak perempuan|son|daughter|anak angkat)$/i;
    const siblingRoleRe = /^(abang|kakak|adik|adik lelaki|adik perempuan|brother|sister)$/i;

    const livingParents = rels
      .filter(r => parentRoleRe.test(String(r.role || '').trim()))
      .map(r => `${r.role}: ${r.name}`);

    const partner = s.partnerId ? rels.find(r => r.id === s.partnerId) : null;
    const livingSpouse = (s.married && partner) ? partner.name : null;
    const livingPartner = partner ? `${partner.name} (${partner.role || 'Pasangan'})` : null;

    const livingChildren = rels
      .filter(r => childRoleRe.test(String(r.role || '').trim()))
      .slice(0, 3)
      .map(r => r.name);

    const livingSiblings = rels
      .filter(r => siblingRoleRe.test(String(r.role || '').trim()))
      .slice(0, 2)
      .map(r => r.name);

    const hasLivingFamily = livingParents.length > 0 || Boolean(livingSpouse) || livingChildren.length > 0 || livingSiblings.length > 0;

    return {
      livingParents,
      livingSpouse,
      livingPartner,
      livingChildren,
      livingSiblings,
      hasLivingFamily,
      totalLivingFamily: rels.filter(r => r.category === 'family' || r.category === 'spouse').length
    };
  },

  _pickSceneAngle(ctx) {
    let pool = [];
    if (ctx.isInPrison) {
      pool = [
        'Suasana sunyi dan bunyi besi sel penjara pada waktu malam',
        'Perbualan pendek dan berhati-hati dengan banduan lain di halaman penjara',
        'Monolog dalaman menghitung hari bebas dan kesilapan silam',
        'Drama kecil di dewan makan penjara atau pemeriksaan mengejut warden'
      ];
    } else if (ctx.age <= 12) {
      pool = [
        'Gelagat lucu rakan sekelas dan suasana rehat di sekolah',
        'Rasa ingin tahu kanak-kanak meneroka lorong kejiranan atau taman permainan',
        'Mimpi besar zaman kecil yang polos tetapi mencuit hati',
        'Kejadian kecil di kedai runcit atau pasar tempatan bersama kawan'
      ];
      if (ctx.hasLivingFamily) {
        pool.push('Momen ringkas dan hangat bersama ahli keluarga yang masih hidup');
      }
    } else {
      pool = [
        'Suasana, bunyi, dan budaya harian bandar serta negara tempat tinggal semasa',
        'Drama kecil atau gosip halus di tempat kerja atau kampus',
        'Pertemuan singkat yang pelik atau bermakna dengan pemandu teksi atau jiran',
        'Perbualan spontan dengan pelanggan, barista, atau pengembara asing',
        'Monolog dalaman tentang perjalanan hidup, penyesalan kecil, atau cita-cita terpendam',
        'Sindiran halus dan humor kering berkaitan taraf kewangan semasa',
        'Kejadian kecil luar jangka di kafe, pasar malam, atau pengangkutan awam',
        'Khabar angin dunia, trend media sosial, atau perubahan wajah kejiranan',
        'Detik refleksi sunyi melihat langit petang atau hujan di tingkap',
        'Pemerhatian tajam terhadap ragam manusia di pusat bandar',
        'Cabaran kecil rutin harian yang tiba-tiba mencuit hati',
        'Perasaan bangga atau letih yang jujur terhadap fasa hidup sekarang',
        'Bau makanan tempatan dan hiruk-pikuk jalanan yang membangkitkan nostalgia',
        'Khabar tentang kejayaan atau kejatuhan kenalan lama dari jauh'
      ];
      if (ctx.hasLivingFamily) {
        pool.push('Momen spontan bersama ahli keluarga atau pasangan yang masih hidup');
      }
      if (ctx.isRoyal) {
        pool.push('Suasana protokol istana dan pandangan rakyat di luar pagar diraja');
      }
      if (ctx.isFamous) {
        pool.push('Reaksi peminat yang mengejutkan di tempat awam dan tekanan populariti');
      }
      if (ctx.hasOffshoreTrust) {
        pool.push('Bisikan tenang tentang percaturan kewangan antarabangsa dan rahsia kekayaan');
      }
    }

    const filtered = pool.length > 1
      ? pool.filter(a => a !== this._lastSceneAngle)
      : pool;
    const chosen = filtered[Math.floor(Math.random() * filtered.length)] || pool[0];
    this._lastSceneAngle = chosen;
    return chosen;
  },

  _isHallucinatedDeadParent(speaker, dialog, livingParents) {
    if (Array.isArray(livingParents) && livingParents.length > 0) return false;
    const spk = String(speaker || '');
    const dlg = String(dialog || '');
    const parentWord = /\b(ayah|ibu|mak|bapa|abah|mama|papa)\b/i;
    if (parentWord.test(spk)) return true;
    if (/\b(ayah|ibu|mak|bapa|abah|mama|papa)\s*:/i.test(dlg)) return true;
    if (/(ajak|makan bersama|masak|telefon|pesan|kata|tanya|senyum|peluk|pulang ke rumah).{0,25}\b(ayah|ibu|mak|bapa|abah)\b/i.test(dlg)) return true;
    if (/\b(ayah|ibu|mak|bapa|abah)\b.{0,25}(ajak|masak|telefon|pesan|kata|tanya|senyum|peluk|menunggu di rumah)/i.test(dlg)) return true;
    return false;
  },

  buildSummary(s, latestYearLogs = []) {
    if (!s) return {};
    const c = (window.Utils && Utils.getCountry) ? Utils.getCountry(s.countryId) : { name: s.countryId || 'Dunia' };

    let kerja = 'Tiada kerja';
    if (s.job && s.job.title) {
      kerja = s.job.isUnderground ? `${s.job.title} (Bawah Tanah)` : s.job.title;
    } else if (s.partTimeJob && s.partTimeJob.title) {
      kerja = `${s.partTimeJob.title} (Sambilan)`;
    }

    let pendidikan = 'Tiada';
    if (s.education) {
      if (s.education.activeStudy && s.education.activeStudy.title) {
        pendidikan = s.education.activeStudy.title;
      } else if (s.education.schoolName) {
        pendidikan = s.education.schoolName;
      } else if (s.education.stage && s.education.stage !== 'none' && s.education.stage !== 'done') {
        pendidikan = s.education.stage;
      }
    }

    const fam = this._extractLivingFamily(s);
    const illnesses = Array.isArray(s.illnesses) ? s.illnesses.map(i => i && i.name).filter(Boolean) : [];
    const loans = Array.isArray(s.loans) ? s.loans : [];
    const hutangAhLong = loans.some(l => l && l.lenderType === 'ahlong');
    const adaPinjamanBank = loans.some(l => l && l.lenderType === 'bank');

    const stats = s.stats || {};
    const stress = (s.alignment && s.alignment.stress) || 0;
    const isInPrison = Boolean(s.prison && s.prison.inPrison);
    const isSick = illnesses.length > 0;
    const isRoyal = Boolean(s.activeSpecialMode && s.activeSpecialMode.modeId === 'royalty');
    const isFamous = ((s.alignment && s.alignment.fame) || 0) >= 65 || Boolean(s.activeSpecialMode && s.activeSpecialMode.modeId === 'celebrity');
    const isMafia = Boolean(s.activeSpecialMode && s.activeSpecialMode.modeId === 'mafia');
    const hasOffshoreTrust = Boolean(window.LegalInheritanceEngine && LegalInheritanceEngine.isTrustOffshore && LegalInheritanceEngine.isTrustOffshore(s));
    const wealthTier = this._getWealthTier(s);

    const ageNum = Number(s.age) || 0;
    const looksVal = Math.max(0, Math.min(100, Math.round(Number(stats.looks ?? s.looks ?? 50) || 50)));
    const isEmployed = Boolean((s.job && s.job.title) || (s.partTimeJob && s.partTimeJob.title));
    const isStudent = Boolean(
      (s.education && s.education.activeStudy && s.education.activeStudy.title) ||
      (ageNum >= 7 && ageNum <= 17 && s.education && s.education.stage && s.education.stage !== 'none' && s.education.stage !== 'done')
    );
    const isRetired = Boolean(s.retired || (s.job && s.job.isRetired));
    const isUnemployedAdult = ageNum >= 18 && !isEmployed && !isStudent && !isRetired;
    const jobName = isEmployed ? String(kerja).slice(0, 70) : '';

    const sceneAngle = (ageNum <= 6 || isUnemployedAdult)
      ? ''
      : this._pickSceneAngle({
          age: ageNum,
          isInPrison,
          hasLivingFamily: fam.hasLivingFamily,
          isRoyal,
          isFamous,
          hasOffshoreTrust
        });

    const cleanLogs = (Array.isArray(latestYearLogs) ? latestYearLogs : [])
      .map(entry => this._stripHtml(typeof entry === 'string' ? entry : (entry && entry.text) || ''))
      .filter(Boolean)
      .slice(-3);

    const systemPrompt = [
      'Anda ialah pencerita kreatif permainan simulasi kehidupan WorldLife dalam Bahasa Melayu semula jadi (bebas unsur agama).',
      'PERATURAN KELUARGA MUTLAK: HANYA dibenarkan menyebut ahli keluarga yang disenaraikan dalam livingFamily. Jika livingParents kosong, DILARANG KERAS menyebut, memunculkan, atau menulis dialog Ibu, Ayah, Mak, atau Bapa.',
      'GAYA HIDUP & SINEMATIK: Tulis 1–2 ayat padat dan hidup (show, don\'t tell: suasana, bunyi, reaksi spontan, humor halus atau emosi jujur) berpandukan sceneAngle.',
      'LARANGAN KLISE & SKRIP KAKU: DILARANG menulis format skrip seperti "Ayah: ..." atau "Kawan: ...". DILARANG memulakan ayat dengan "Pada tahun ini", "Suatu hari", "Tiba-tiba", atau "Anda berasa".',
      'LARANGAN ULANG: Bandingkan dengan recentLines dan pastikan topik, struktur ayat, serta pembuka ayat 100% berbeza.'
    ].join(' ');

    return {
      nama: String(s.name || 'Watak').slice(0, 60),
      age: ageNum,
      umur: ageNum,
      looks: looksVal,
      generasi: Number(s.generation) || 1,
      negara: String(c.name || s.countryId || 'Dunia').slice(0, 50),
      bandar: String(s.city || '').slice(0, 50),
      job: jobName,
      kerja: String(kerja).slice(0, 70),
      isEmployed,
      isStudent,
      isRetired,
      pendidikan: String(pendidikan).slice(0, 70),
      wealthTier,
      stressLevel: this._band(stress),
      statusAktif: {
        isInPrison,
        isSick,
        isRoyal,
        isFamous,
        isMafia,
        hasOffshoreTrust,
        isEmployed,
        isStudent,
        isRetired
      },
      livingFamily: {
        livingParents: fam.livingParents,
        livingSpouse: fam.livingSpouse,
        livingChildren: fam.livingChildren,
        livingSiblings: fam.livingSiblings
      },
      ...(sceneAngle ? { sceneAngle } : {}),
      recentLines: this._recentAiHistory.slice(-5),
      systemPrompt,
      generationConfig: {
        temperature: 0.9,
        topP: 0.92
      },
      // Medan serasi ke belakang untuk Worker sedia ada
      penjara: {
        inPrison: isInPrison,
        deathRow: Boolean(s.prison && s.prison.deathRow)
      },
      buruan: Boolean(s.fugitive && s.fugitive.isFugitive),
      sakit: illnesses.slice(0, 3),
      hutangAhLong,
      adaPinjamanBank,
      pasangan: String(fam.livingPartner || 'Tiada').slice(0, 70),
      bilanganKeluarga: fam.totalLivingFamily,
      suasana: {
        kesihatan: this._band(stats.health ?? 70),
        kebahagiaan: this._band(stats.happiness ?? 70),
        stres: this._band(stress)
      },
      logTerkini: cleanLogs
    };
  },

  async generateDialogue(s, latestYearLogs = []) {
    try {
      if (!this.isEnabled()) return null;
      if (!s || !s.alive) return null;

      const now = Date.now();
      if (now - this._lastCallTime < this.COOLDOWN_MS) return null;
      this._lastCallTime = now;

      const payload = this.buildSummary(s, latestYearLogs);
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timer = controller ? setTimeout(() => controller.abort(), this.TIMEOUT_MS) : null;

      try {
        const resp = await fetch(this.ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller ? controller.signal : undefined
        });
        if (timer) clearTimeout(timer);
        if (!resp || !resp.ok) return null;

        const parsed = await resp.json();
        if (!parsed || typeof parsed.dialog !== 'string') return null;

        const cleanDialog = this._stripHtml(parsed.dialog).replace(/^["“]+|["”]+$/g, '').trim().slice(0, 240);
        if (!cleanDialog) return null;

        const cleanSpeaker = this._stripHtml(parsed.penutur || 'Pencerita').slice(0, 50) || 'Pencerita';

        // Penapis keselamatan frontend: sekat halusinasi ibu/ayah jika livingParents kosong
        const livingParents = (payload.livingFamily && payload.livingFamily.livingParents) || [];
        if (this._isHallucinatedDeadParent(cleanSpeaker, cleanDialog, livingParents)) {
          return null;
        }

        // Simpan dalam memori sesi (maks 5 baris terakhir, tidak disimpan ke Firestore)
        this._recentAiHistory.push(cleanDialog);
        if (this._recentAiHistory.length > 5) {
          this._recentAiHistory = this._recentAiHistory.slice(-5);
        }

        return {
          penutur: cleanSpeaker,
          dialog: cleanDialog
        };
      } catch (fetchErr) {
        if (timer) clearTimeout(timer);
        return null;
      }
    } catch (err) {
      return null;
    }
  }
,
  SCHOLARSHIP_IV_ANGLES: [
    'dilema etika pelajar dan integriti akademik',
    'kajian kes praktikal dalam bidang pengajian',
    'sumbangan konkrit kepada negara dan komuniti setempat',
    'pengalaman kegagalan dan strategi bangkit semula',
    'isu semasa dan cabaran industri di negara semasa',
    'pengurusan kewangan, disiplin, dan komitmen pengajian',
    'kerja berpasukan, kepimpinan, dan penyelesaian konflik'
  ],

  _recentIvQuestions: [],

  _getRecentIvQuestions() {
    const s = (window.GameState && GameState.current) ? GameState.current : null;
    if (s) {
      if (!Array.isArray(s.recentScholarshipIvQuestions)) s.recentScholarshipIvQuestions = [];
      return s.recentScholarshipIvQuestions;
    }
    return this._recentIvQuestions;
  },

  _recordRecentIvQuestions(questions = []) {
    const texts = questions.map(q => String(q && q.soalan || '').trim()).filter(Boolean);
    if (!texts.length) return;
    const s = (window.GameState && GameState.current) ? GameState.current : null;
    const prev = this._getRecentIvQuestions();
    const merged = [...texts, ...prev.filter(t => !texts.includes(t))].slice(0, 15);
    this._recentIvQuestions = merged;
    if (s) s.recentScholarshipIvQuestions = merged;
  },

  _parseWorkerJson(rawText) {
    const cleaned = String(rawText || '')
      .trim()
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    try {
      return JSON.parse(cleaned);
    } catch (_) {
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace > firstBrace) {
        try { return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1)); } catch (__) {}
      }
      const firstArr = cleaned.indexOf('[');
      const lastArr = cleaned.lastIndexOf(']');
      if (firstArr !== -1 && lastArr > firstArr) {
        try { return JSON.parse(cleaned.slice(firstArr, lastArr + 1)); } catch (__) {}
      }
      return null;
    }
  },

  SCHOLARSHIP_FALLBACK_BANK: {
    stem: [
      { soalan: 'Dalam kaedah saintifik, apakah tujuan utama kumpulan kawalan (control group) dalam sesuatu eksperimen?', pilihan: ['Mempercepatkan keputusan makmal', 'Menjadi penanda aras perbandingan bagi mengasingkan kesan pemboleh ubah', 'Menggantikan keperluan hipotesis', 'Mengurangkan bilangan sampel kajian'], jawapanBetul: 1, penjelasan: 'Kumpulan kawalan membolehkan penyelidik memastikan perubahan hasil benar-benar berpunca daripada pemboleh ubah yang diuji.' },
      { soalan: 'Apakah kelebihan utama algoritma yang mempunyai kerumitan masa O(log n) berbanding O(n²)?', pilihan: ['Ia sentiasa menggunakan memori sifar', 'Masa pemprosesannya berkembang jauh lebih perlahan apabila saiz data meningkat', 'Ia hanya berfungsi untuk data teks sahaja', 'Ia tidak memerlukan struktur data tersusun'], jawapanBetul: 1, penjelasan: 'Kerumitan logaritma kekal pantas walaupun set data membesar ke jutaan rekod.' },
      { soalan: 'Mengapakah faktor keselamatan (factor of safety) diterapkan dalam reka bentuk kejuruteraan struktur?', pilihan: ['Untuk menaikkan kos bahan binaan', 'Untuk menampung beban luar jangka dan ketidakpastian bahan', 'Untuk memendekkan jangka hayat struktur', 'Untuk mengelakkan pemeriksaan berkala'], jawapanBetul: 1, penjelasan: 'Faktor keselamatan melindungi struktur daripada kegagalan apabila menghadapi beban atau keadaan ekstrem.' },
      { soalan: 'Apakah risiko utama apabila model kecerdasan buatan dilatih menggunakan set data yang berat sebelah?', pilihan: ['Kelajuan komputer menjadi lebih perlahan', 'Keputusan model akan mewarisi dan memperbesar ketidakadilan data asal', 'Saiz fail model menjadi terlalu kecil', 'Model tidak lagi memerlukan elektrik'], jawapanBetul: 1, penjelasan: 'Bias dalam data latihan menghasilkan ramalan yang tidak adil dan kurang tepat dalam dunia sebenar.' },
      { soalan: 'Mengapakah ujian unit (unit testing) penting sebelum melancarkan sistem perisian berskala besar?', pilihan: ['Untuk menambah panjang kod sumber', 'Untuk mengesan ralat pada komponen kecil lebih awal sebelum digabungkan', 'Untuk mengelakkan keperluan dokumentasi', 'Untuk menggantikan peranan pengguna akhir'], jawapanBetul: 1, penjelasan: 'Ujian unit mengurangkan kos pembaikan pepijat dengan mengesahkan setiap modul berfungsi seperti dijangka.' },
      { soalan: 'Dalam penyelidikan makmal, apakah tindakan beretika jika data eksperimen bercanggah dengan hipotesis awal anda?', pilihan: ['Memadam data yang bercanggah supaya laporan kelihatan kemas', 'Melaporkan data sebenar secara telus dan menganalisis punca perbezaan', 'Mengubah angka supaya sepadan dengan jangkaan', 'Menyembunyikan kaedah eksperimen daripada penilai'], jawapanBetul: 1, penjelasan: 'Integriti saintifik menuntut pelaporan jujur kerana hasil negatif tetap bernilai kepada ilmu.' }
    ],
    business: [
      { soalan: 'Apakah maksud prinsip kepelbagaian (diversification) dalam pengurusan portfolio pelaburan?', pilihan: ['Melabur semua modal dalam satu saham berisiko tinggi', 'Mengagihkan pelaburan merentas pelbagai aset bagi mengurangkan risiko keseluruhan', 'Menyimpan keseluruhan dana dalam bentuk tunai sahaja', 'Meminjam modal maksimum untuk setiap transaksi'], jawapanBetul: 1, penjelasan: 'Kepelbagaian mengurangkan kesan kejatuhan satu aset terhadap keseluruhan portfolio.' },
      { soalan: 'Dalam perakaunan, apakah yang digambarkan oleh penyata aliran tunai (cash flow statement)?', pilihan: ['Nilai pasaran jenama syarikat', 'Pergerakan masuk dan keluar wang tunai dalam tempoh tertentu', 'Bilangan pekerja tetap organisasi', 'Kadar cukai pendapatan peribadi pengarah'], jawapanBetul: 1, penjelasan: 'Penyata aliran tunai mengukur kecairan sebenar operasi, pelaburan, dan pembiayaan.' },
      { soalan: 'Apakah tujuan utama kontrak bertulis yang jelas dalam urus niaga komersial?', pilihan: ['Mengelakkan pembayaran cukai jualan', 'Menetapkan hak, tanggungjawab, dan penyelesaian pertikaian secara sah', 'Menghapuskan keperluan invois rasmi', 'Memastikan harga tidak berubah selama 50 tahun'], jawapanBetul: 1, penjelasan: 'Kontrak bertulis melindungi kedua-dua pihak dengan terma yang boleh dikuatkuasakan.' },
      { soalan: 'Mengapakah analisis pulang modal (break-even analysis) kritikal sebelum melancarkan produk baharu?', pilihan: ['Untuk menentukan warna logo syarikat', 'Untuk mengetahui jumlah jualan minimum bagi menampung semua kos tetap dan berubah', 'Untuk menghapuskan semua kos pemasaran', 'Untuk menjamin keuntungan segera pada hari pertama'], jawapanBetul: 1, penjelasan: 'Titik pulang modal membantu pengurus menetapkan sasaran harga dan jualan yang realistik.' },
      { soalan: 'Apakah kesan jangka panjang jika sesebuah syarikat mengabaikan tadbir urus korporat yang telus?', pilihan: ['Keyakinan pelabur dan reputasi pasaran merosot ketara', 'Kos audit luaran menjadi sifar selama-lamanya', 'Permintaan pelanggan meningkat automatik', 'Pekerja tidak lagi memerlukan kontrak kerja'], jawapanBetul: 0, penjelasan: 'Tadbir urus yang lemah mendedahkan syarikat kepada skandal, denda, dan kehilangan kepercayaan pelabur.' },
      { soalan: 'Dalam strategi pemasaran moden, mengapakah segmentasi pelanggan penting?', pilihan: ['Untuk menyekat orang ramai membeli produk', 'Untuk menyesuaikan tawaran dan mesej mengikut keperluan kumpulan sasaran', 'Untuk menaikkan kos pengiklanan tanpa had', 'Untuk mengelakkan maklum balas pelanggan'], jawapanBetul: 1, penjelasan: 'Segmentasi memastikan sumber pemasaran tertumpu kepada kumpulan yang paling relevan.' }
    ],
    medical: [
      { soalan: 'Mengapakah rawatan antibiotik perlu dihabiskan mengikut tempoh preskripsi walaupun gejala sudah reda?', pilihan: ['Untuk menjimatkan kos farmasi', 'Untuk mencegah bakteria yang masih berbaki daripada membentuk kerintangan antibiotik', 'Untuk meningkatkan tekanan darah pesakit', 'Untuk menggantikan keperluan vaksinasi'], jawapanBetul: 1, penjelasan: 'Menghentikan antibiotik terlalu awal boleh meninggalkan bakteria tahan ubat yang lebih sukar dirawat.' },
      { soalan: 'Apakah peranan utama kajian klinikal rawak terkawal (RCT) dalam perubatan berasaskan bukti?', pilihan: ['Mengukur keberkesanan dan keselamatan rawatan dengan meminimumkan bias', 'Mempercepatkan pemasaran ubat tanpa ujian', 'Menggantikan diagnosis fizikal doktor', 'Menghapuskan keperluan rekod pesakit'], jawapanBetul: 0, penjelasan: 'RCT ialah piawaian emas bagi menilai keberkesanan intervensi perubatan secara objektif.' },
      { soalan: 'Apakah fungsi utama sistem imun adaptif dalam tubuh manusia?', pilihan: ['Mengawal kadar pernafasan ketika tidur', 'Mengenali dan mengingati patogen spesifik untuk tindak balas lebih pantas', 'Menghasilkan tenaga daripada cahaya matahari', 'Menggantikan fungsi buah pinggang'], jawapanBetul: 1, penjelasan: 'Imuniti adaptif membina memori imunologi bagi melindungi tubuh daripada jangkitan berulang.' },
      { soalan: 'Mengapakah persetujuan termaklum (informed consent) wajib diperoleh sebelum prosedur perubatan bukan kecemasan?', pilihan: ['Untuk mempercepatkan bil hospital', 'Untuk menghormati autonomi pesakit agar memahami risiko dan manfaat rawatan', 'Untuk mengelakkan doktor memberi penerangan', 'Untuk menggantikan ujian makmal'], jawapanBetul: 1, penjelasan: 'Persetujuan termaklum memastikan pesakit membuat keputusan kesihatan secara sedar dan sukarela.' },
      { soalan: 'Apakah manfaat utama pencegahan primer seperti saringan awal dan gaya hidup sihat terhadap sistem kesihatan awam?', pilihan: ['Mengurangkan beban penyakit kronik dan kos rawatan jangka panjang', 'Menghapuskan keperluan hospital sepenuhnya', 'Meningkatkan kadar kemasukan wad kecemasan', 'Mengurangkan bilangan doktor pakar'], jawapanBetul: 0, penjelasan: 'Pencegahan awal mengesan risiko sebelum komplikasi serius berlaku dan menjimatkan sumber kesihatan.' },
      { soalan: 'Apakah tindakan paling wajar jika seorang pengamal perubatan mengesan kesilapan dos ubat sebelum diberikan kepada pesakit?', pilihan: ['Meneruskan pemberian supaya tidak memalukan rakan sekerja', 'Menghentikan pemberian serta-merta, membetulkan dos, dan melaporkan mengikut protokol keselamatan', 'Mengabaikan rekod pesakit tersebut', 'Menyalahkan pesakit atas kekeliruan'], jawapanBetul: 1, penjelasan: 'Keselamatan pesakit adalah keutamaan tertinggi dan pelaporan telus mencegah kesilapan berulang.' }
    ],
    general: [
      { soalan: 'Apakah ciri utama hujah akademik yang kukuh dalam penulisan ilmiah?', pilihan: ['Bergantung sepenuhnya pada pendapat peribadi tanpa rujukan', 'Disokong oleh bukti empirikal, logik konsisten, dan sumber berwibawa', 'Menggunakan ayat yang terlalu panjang tanpa struktur', 'Mengabaikan sebarang pandangan balas'], jawapanBetul: 1, penjelasan: 'Penulisan ilmiah menuntut bukti sahih, penaakulan jelas, dan rujukan yang boleh disemak.' },
      { soalan: 'Dalam pengurusan projek, mengapakah penetapan garis masa dan pencapaian (milestones) amat penting?', pilihan: ['Untuk menambah kerja kertas pasukan', 'Untuk memantau kemajuan dan mengesan kelewatan lebih awal', 'Untuk mengelakkan perbincangan antara ahli pasukan', 'Untuk menghapuskan keperluan bajet projek'], jawapanBetul: 1, penjelasan: 'Pencapaian berkala membantu pasukan mengenal pasti risiko kelewatan sebelum menjejaskan tarikh akhir.' },
      { soalan: 'Apakah langkah paling berkesan apabila berdepan maklumat bercanggah semasa menjalankan penyelidikan?', pilihan: ['Memilih maklumat pertama yang ditemui sahaja', 'Menyemak silang sumber primer dan menilai metodologi setiap kajian', 'Memadam semua data yang tidak menyokong jangkaan awal', 'Meneka kesimpulan tanpa analisis lanjut'], jawapanBetul: 1, penjelasan: 'Semakan silang sumber primer dan metodologi memastikan kesimpulan kajian kekal objektif.' },
      { soalan: 'Jika rakan sepasukan gagal menyiapkan tugasan penting menjelang tarikh akhir, apakah pendekatan kepimpinan terbaik?', pilihan: ['Membiarkan projek gagal tanpa komunikasi', 'Berbincang secara konstruktif, kenal pasti halangan, dan agih semula keutamaan bersama', 'Menyalahkan rakan itu di hadapan khalayak umum', 'Menarik diri daripada kumpulan serta-merta'], jawapanBetul: 1, penjelasan: 'Komunikasi terbuka dan penyelarasan semula membantu pasukan menyelesaikan masalah tanpa menjejaskan kualiti.' },
      { soalan: 'Mengapakah kemahiran pembelajaran sepanjang hayat penting bagi penerima biasiswa moden?', pilihan: ['Kerana teknologi dan keperluan industri sentiasa berubah dengan pantas', 'Kerana sijil akademik hanya sah selama enam bulan', 'Untuk mengelakkan kerjasama dengan generasi baharu', 'Supaya tidak perlu mempraktikkan ilmu di tempat kerja'], jawapanBetul: 0, penjelasan: 'Keupayaan menyesuaikan diri dengan ilmu baharu memastikan graduan kekal relevan dan berdaya saing.' },
      { soalan: 'Apakah prinsip utama apabila menguruskan dana biasiswa sepanjang tempoh pengajian?', pilihan: ['Membelanjakan kesemua elaun pada minggu pertama', 'Menyusun bajet berkala untuk keperluan akademik, sara hidup, dan simpanan kecemasan', 'Mengabaikan rekod perbelanjaan bulanan', 'Menggunakan dana pengajian untuk spekulasi berisiko tinggi'], jawapanBetul: 1, penjelasan: 'Disiplin kewangan memastikan fokus pengajian tidak terganggu oleh masalah tunai.' }
    ]
  },

  _pickFallbackScholarshipQuestions(course = '', avoidList = []) {
    const c = String(course || '').toLowerCase();
    let key = 'general';
    if (/(kejuruteraan|sains|komputer|it|teknologi|data|fizik|kimia|matematik)/.test(c)) key = 'stem';
    else if (/(perniagaan|kewangan|ekonomi|akaun|undang|pengurusan|pemasaran)/.test(c)) key = 'business';
    else if (/(perubatan|kesihatan|farmasi|kejururawatan|pergigian|biologi)/.test(c)) key = 'medical';

    const pool = this.SCHOLARSHIP_FALLBACK_BANK[key] || this.SCHOLARSHIP_FALLBACK_BANK.general;
    const avoidSet = new Set((avoidList || []).map(x => String(x || '').trim()));
    const shuffleArr = (arr) => [...arr].sort(() => Math.random() - 0.5);
    const fresh = shuffleArr(pool.filter(q => !avoidSet.has(q.soalan)));
    const used = shuffleArr(pool.filter(q => avoidSet.has(q.soalan)));
    const picked = [...fresh, ...used].slice(0, 3);
    return picked.map(q => ({ ...q, pilihan: [...q.pilihan] }));
  },

  async fetchScholarshipIvQuestions({ course, level, country, age, smarts, achievements, avoidQuestions }) {
    const recentAvoid = Array.isArray(avoidQuestions) && avoidQuestions.length
      ? avoidQuestions.slice(0, 12)
      : this._getRecentIvQuestions().slice(0, 12);
    const fallback = this._pickFallbackScholarshipQuestions(course, recentAvoid);
    const angle = this.SCHOLARSHIP_IV_ANGLES[Math.floor(Math.random() * this.SCHOLARSHIP_IV_ANGLES.length)];
    const nonce = `${Date.now()}_${Math.floor(Math.random() * 1e6)}`;

    try {
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timer = controller ? setTimeout(() => controller.abort(), 10000) : null;
      try {
        const resp = await fetch(this.ENDPOINT, {
          method: 'POST',
          cache: 'no-store',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mode: 'scholarship_iv',
            course: String(course || 'Pengajian Am').slice(0, 80),
            level: String(level || 'Ijazah').slice(0, 60),
            country: String(country || 'Malaysia').slice(0, 50),
            age: Number(age) || 18,
            smarts: Number(smarts) || 70,
            achievements: String(achievements || '').slice(0, 140),
            angle,
            nonce,
            avoidQuestions: recentAvoid.map(q => String(q).slice(0, 120))
          }),
          signal: controller ? controller.signal : undefined
        });
        if (timer) clearTimeout(timer);
        if (!resp || !resp.ok) {
          console.warn('[AINarrator][scholarship_iv] Worker HTTP error, fallback digunakan:', resp ? resp.status : 'no-response');
          this._recordRecentIvQuestions(fallback);
          return { questions: fallback, source: 'fallback' };
        }
        const rawText = await resp.text();
        const data = this._parseWorkerJson(rawText);
        const list = Array.isArray(data)
          ? data
          : (Array.isArray(data && data.questions) ? data.questions : (Array.isArray(data && data.soalan) ? data.soalan : null));
        if (!list || list.length < 3) {
          console.warn('[AINarrator][scholarship_iv] Format JSON Worker tidak lengkap, fallback digunakan.', rawText.slice(0, 180));
          this._recordRecentIvQuestions(fallback);
          return { questions: fallback, source: 'fallback' };
        }
        const valid = list.slice(0, 3).map(q => {
          const text = this._stripHtml(q.soalan || q.question || '');
          const opts = Array.isArray(q.pilihan || q.options) ? (q.pilihan || q.options).map(o => this._stripHtml(o)) : [];
          const ans = Number(q.jawapanBetul ?? q.correctIndex ?? q.answer);
          const exp = this._stripHtml(q.penjelasan || q.explanation || 'Jawapan berdasarkan prinsip teras bidang ini.');
          if (!text || opts.length !== 4 || Number.isNaN(ans) || ans < 0 || ans > 3) return null;
          return { soalan: text, pilihan: opts, jawapanBetul: ans, penjelasan: exp };
        }).filter(Boolean);
        if (valid.length === 3) {
          this._recordRecentIvQuestions(valid);
          return { questions: valid, source: 'ai' };
        }
        console.warn('[AINarrator][scholarship_iv] Soalan Worker gagal pengesahan struktur (valid=' + valid.length + '), fallback digunakan.');
        this._recordRecentIvQuestions(fallback);
        return { questions: fallback, source: 'fallback' };
      } catch (e) {
        if (timer) clearTimeout(timer);
        console.warn('[AINarrator][scholarship_iv] Panggilan Worker gagal/timeout, fallback digunakan:', e && e.message ? e.message : e);
        this._recordRecentIvQuestions(fallback);
        return { questions: fallback, source: 'fallback' };
      }
    } catch (e) {
      console.warn('[AINarrator][scholarship_iv] Ralat luar jangka, fallback digunakan:', e && e.message ? e.message : e);
      this._recordRecentIvQuestions(fallback);
      return { questions: fallback, source: 'fallback' };
    }
  }
};
