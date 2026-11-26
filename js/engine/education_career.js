/* ==========================================================================
   WorldLife — Enjin Pendidikan Sepanjang Hayat (Sehingga PhD), Sijil Bidang,
   Pasaran Kerja Rawak Dinamik, Temu Duga & Tangga Kenaikan Pangkat
   Bahasa Melayu
   ========================================================================== */

window.EduCareerEngine = {
  MAX_MARKET_REFRESHES: 0,
  MAX_APPLICATIONS_YEAR: 2,

  // 6 Pekerjaan Sambilan (Umur 15+ & 18+) — Gaji 25%–45% gaji permulaan
  PART_TIME_JOBS: [
    {
      id: 'pt_cafe_crew',
      icon: '☕',
      title: 'Kru Kafe & Restoran',
      minAge: 15,
      reqSmarts: 0,
      payRatio: 0.26,
      stressGain: 4,
      healthDrop: 0,
      desc: 'Melayan pelanggan dan menyediakan minuman di kafe tempatan mengikut syif fleksibel.'
    },
    {
      id: 'pt_convenience_cashier',
      icon: '🛒',
      title: 'Juruwang Kedai Serbaneka',
      minAge: 15,
      reqSmarts: 0,
      payRatio: 0.28,
      stressGain: 3,
      healthDrop: 0,
      desc: 'Menguruskan kaunter bayaran dan menyusun rak barangan harian di kedai serbaneka.'
    },
    {
      id: 'pt_weekend_warehouse',
      icon: '📦',
      title: 'Pembantu Gudang Hujung Minggu',
      minAge: 15,
      reqSmarts: 0,
      payRatio: 0.34,
      stressGain: 5,
      healthDrop: 2,
      desc: 'Membantu menyusun dan memuatkan bungkusan penghantaran pada hujung minggu.'
    },
    {
      id: 'pt_tutor',
      icon: '📚',
      title: 'Tutor Sambilan',
      minAge: 18,
      reqSmarts: 55,
      allowStudentBypass: true,
      payRatio: 0.38,
      stressGain: 4,
      healthDrop: 0,
      desc: 'Mengajar kelas tuisyen sambilan bagi pelajar sekolah dalam subjek teras.'
    },
    {
      id: 'pt_freelance_digital',
      icon: '💻',
      title: 'Pekerja Bebas (Freelance Digital)',
      minAge: 18,
      reqSmarts: 50,
      payRatio: 0.40,
      stressGain: 4,
      healthDrop: 0,
      desc: 'Mengambil tugasan reka bentuk, penulisan atau pengurusan media secara bebas.'
    },
    {
      id: 'pt_night_guard',
      icon: '🌙',
      title: 'Pengawal / Syif Malam Sambilan',
      minAge: 18,
      reqSmarts: 0,
      payRatio: 0.45,
      stressGain: 6,
      healthDrop: 3,
      desc: 'Bertugas mengawal premis atau syif lewat malam dengan bayaran sambilan lebih tinggi.'
    }
  ],

  // 12 Senario Penolakan / Ghosting HR Realistik (Tahap 1: Saringan CV)
  REJECTION_SCENARIOS: [
    'HR langsung tidak membalas e-mel atau panggilan anda (kena ghosted sepenuhnya!).',
    'Syarikat mahukan 5 tahun pengalaman kerja walaupun ini hanyalah jawatan junior.',
    'Syarikat mengumumkan pembekuan pengambilan pekerja (hiring freeze) pada saat akhir.',
    'Lebih 400+ pemohon lain menghantar CV — permohonan anda tenggelam di dalam sistem ATS.',
    'HR menyatakan anda "terlalu berkelayakan (overqualified)" untuk bajet gaji jawatan ini.',
    'Jawatan ini rupa-rupanya telah diisi oleh calon dalaman melalui kabel pengurusan.',
    'E-mel automatik tiba selepas 3 minggu: "Kami telah memilih calon yang lebih sepadan."',
    'Bajet jabatan dibekukan secara mengejut akibat penyusunan semula syarikat.',
    'Pengurus pengambilan pekerja membatalkan kekosongan jawatan selepas anda mengisi borang 10 muka surat.',
    'HR mendakwa jurang pengalaman anda tidak menepati skop tugasan spesifik mereka.',
    'Tiada sebarang maklum balas selepas ujian saringan dalam talian selama 2 jam.',
    'Syarikat mengurangkan jumlah pengambilan tahun ini kerana persaingan pasaran kerja yang sangat sengit.'
  ],

  // --------------------------------------------------------------------------
  // 1. PENYELARASAN MEDAN KEADAAN WATAK (SERASI DENGAN SAVE LAMA)
  // --------------------------------------------------------------------------
  ensureFields(s) {
    if (!s) return;
    if (!s.education) {
      s.education = {
        stage: 'infant',
        schoolName: null,
        universityName: null,
        uniYearsLeft: 0,
        hasHighSchool: false,
        hasDegree: false,
        examGrade: null
      };
    }
    const ed = s.education;
    if (!ed.educationLevel) {
      if (ed.hasDegree) ed.educationLevel = 'bachelor';
      else if (ed.hasHighSchool) ed.educationLevel = 'high_school';
      else ed.educationLevel = 'none';
    }
    if (!('educationField' in ed)) ed.educationField = ed.hasDegree ? 'business_finance' : null;
    if (!('activeStudy' in ed)) ed.activeStudy = null;
    if (!Array.isArray(ed.completedDegrees)) {
      ed.completedDegrees = [];
      if (ed.hasDegree) {
        ed.completedDegrees.push({
          level: 'bachelor',
          field: ed.educationField || 'business_finance',
          institution: ed.universityName || 'Universiti',
          year: s.year,
          gpa: 3.4
        });
      }
    }
    if (!Array.isArray(ed.certificates)) ed.certificates = [];
    if (!Array.isArray(ed.educationHistory)) ed.educationHistory = [];
    if (typeof ed.educationLoan !== 'number') ed.educationLoan = 0;
    if (typeof ed.hasDoctorateTitle !== 'boolean') ed.hasDoctorateTitle = ed.educationLevel === 'phd';
    if (typeof ed.hasDeansAward !== 'boolean') {
      ed.hasDeansAward = ed.completedDegrees.some(d => Number(d.gpa) >= 4.0 || d.deansAward);
    }
    if (typeof ed.deansAwardCount !== 'number') {
      ed.deansAwardCount = ed.completedDegrees.filter(d => Number(d.gpa) >= 4.0 || d.deansAward).length;
    }
    if (typeof ed.studiedThisYear !== 'boolean') ed.studiedThisYear = Boolean(s.yearlyActions && s.yearlyActions.studyHard);
    if (ed.activeStudy) {
      if (typeof ed.activeStudy.currentCgpa !== 'number') {
        ed.activeStudy.currentCgpa = Number(Math.max(0, Math.min(4.0, ed.activeStudy.gpa ?? 3.15)).toFixed(2));
      }
      ed.activeStudy.gpa = ed.activeStudy.currentCgpa;
      if (typeof ed.activeStudy.studiedThisYear !== 'boolean') {
        ed.activeStudy.studiedThisYear = Boolean(ed.studiedThisYear);
      }
      if (typeof ed.activeStudy.academicWarningCount !== 'number') ed.activeStudy.academicWarningCount = 0;
      ed.currentCgpa = ed.activeStudy.currentCgpa;
      ed.isStudying = true;
    } else {
      if (typeof ed.currentCgpa !== 'number') ed.currentCgpa = null;
      if (typeof ed.isStudying !== 'boolean') {
        ed.isStudying = ['preschool', 'primary', 'secondary', 'university', 'adult_school'].includes(ed.stage);
      }
    }
    if (typeof ed.graduatedCgpa !== 'number') {
      const lastDeg = ed.completedDegrees.length > 0 ? ed.completedDegrees[ed.completedDegrees.length - 1] : null;
      ed.graduatedCgpa = (lastDeg && typeof lastDeg.gpa === 'number') ? Number(lastDeg.gpa.toFixed(2)) : null;
    }

    if (!('secondaryTrack' in ed)) ed.secondaryTrack = null;
    if (typeof ed.technicalBonus !== 'boolean') ed.technicalBonus = ed.secondaryTrack === 'teknik';
    if (typeof ed.pendingSecondaryChoice !== 'boolean') ed.pendingSecondaryChoice = false;
    if (ed.droppedOut || ed.stage === 'dropped_out' || ed.secondaryTrack === 'none') {
      ed.pendingSecondaryChoice = false;
    }

    // Fix nama sekolah untuk tahap menengah / save lama yang sudah umur sekolah menengah
    const c = window.Utils && Utils.getCountry ? Utils.getCountry(s.countryId) : null;
    if (c && c.education && c.education.secondary && c.education.primary && !ed.droppedOut && !ed.activeStudy && !ed.hasHighSchool) {
      const secStart = c.education.secondary.startAge || 13;
      const secExam = c.education.secondary.examAge || 17;
      if (ed.stage === 'primary' && s.age >= secStart && s.age <= secExam && !ed.pendingSecondaryChoice) {
        ed.stage = 'secondary';
      }
      if (ed.stage === 'secondary') {
        const primaryName = c.education.primary.name || '';
        const needsNameFix = !ed.schoolName
          || /sekolah rendah/i.test(ed.schoolName)
          || (primaryName && ed.schoolName.includes(primaryName));
        if (needsNameFix) {
          ed.schoolName = this.getSecondarySchoolName(s, c, ed.secondaryTrack || 'harian');
        }
      }
    }

    // Kekalkan flag serasi versi lama
    const rank = window.EducationData ? EducationData.levelRank(ed.educationLevel) : 0;
    if (rank >= 1) ed.hasHighSchool = true;
    if (rank >= 3) ed.hasDegree = true;

    if (!s.careerMarket) {
      s.careerMarket = {
        openings: [],
        recentJobIds: [],
        refreshesLeft: this.MAX_MARKET_REFRESHES,
        applicationsLeft: this.MAX_APPLICATIONS_YEAR,
        appliedJobIdsThisYear: [],
        lastMarketYear: -1
      };
    }
    if (!Array.isArray(s.careerMarket.openings)) s.careerMarket.openings = [];
    if (!Array.isArray(s.careerMarket.recentJobIds)) s.careerMarket.recentJobIds = [];
    if (typeof s.careerMarket.refreshesLeft !== 'number') s.careerMarket.refreshesLeft = this.MAX_MARKET_REFRESHES;
    if (typeof s.careerMarket.applicationsLeft !== 'number') s.careerMarket.applicationsLeft = this.MAX_APPLICATIONS_YEAR;
    if (!Array.isArray(s.careerMarket.appliedJobIdsThisYear)) s.careerMarket.appliedJobIdsThisYear = [];

    if (!Array.isArray(s.careerHistory)) s.careerHistory = [];
    const currentTenure = (s.job && typeof s.job.years === 'number') ? s.job.years : 0;
    if (typeof s.yearsInCurrentJob !== 'number') {
      s.yearsInCurrentJob = currentTenure;
    } else if (s.job && s.yearsInCurrentJob !== currentTenure) {
      s.yearsInCurrentJob = currentTenure;
    } else if (!s.job) {
      s.yearsInCurrentJob = 0;
    }

    if (typeof s.totalYearsWorked !== 'number' || s.totalYearsWorked <= 0) {
      const pastSum = s.careerHistory.reduce((acc, ch) => acc + (Number(ch.years ?? ch.yearsInRole) || 0), 0);
      const retroTotal = pastSum + currentTenure;
      if (typeof s.totalYearsWorked !== 'number' || retroTotal > 0) {
        s.totalYearsWorked = retroTotal;
      }
    }
    if (typeof s.isRetired !== 'boolean') s.isRetired = Boolean(s.retired);
    if (typeof s.retired !== 'boolean') s.retired = Boolean(s.isRetired);
    if (typeof s.pensionAnnual !== 'number') s.pensionAnnual = 0;
    if (typeof s.mandatoryRetirementAge !== 'number') s.mandatoryRetirementAge = 60;
  },

  // Paparkan gelaran "Dr." pada nama watak yang telah menamatkan PhD
  getDisplayName(s) {
    if (!s) return '';
    const hasDr = Boolean(s.education && (s.education.hasDoctorateTitle || s.education.educationLevel === 'phd'));
    if (hasDr && !/^Dr\.\s/i.test(s.name)) {
      return `Dr. ${s.name}`;
    }
    return s.name;
  },

  // --------------------------------------------------------------------------
  // 2. PENGIRAAN YURAN & PENDAFTARAN PENDIDIKAN SEPANJANG HAYAT
  // --------------------------------------------------------------------------
  getProgramDuration(s, level, fieldId, mode = 'full_time') {
    const ed = s.education;
    const prog = EducationData.PROGRAMS.find(p => p.id === level);
    if (!prog) return 2;

    let yrs = prog.baseYears;
    // Laluan pantas 2 tahun jika naik taraf daripada Diploma bidang sama ke Ijazah!
    if (level === 'bachelor' && ed.educationLevel === 'diploma' && ed.educationField === fieldId) {
      yrs = prog.fastTrackYears || 2;
    }
    if (level === 'phd' && s.stats.smarts < 75) {
      yrs = 4;
    }
    if (mode === 'part_time') {
      yrs += 1;
    }
    return yrs;
  },

  getTuitionAnnual(s, level, fieldId) {
    const c = Utils.getCountry(s.countryId);
    const prog = EducationData.PROGRAMS.find(p => p.id === level);
    const field = EducationData.getField(fieldId);
    const isLocal = s.citizenships.includes(s.countryId) || s.residencyStatus === 'PR';
    const baseAnnual = (c.education && c.education.uniTuitionAnnual) ? c.education.uniTuitionAnnual : Utils.usdToLocal(4500, s.countryId);
    const factor = (prog ? prog.tuitionFactor : 1) * (field ? field.tuitionMult : 1) * (isLocal ? 1 : 1.65);
    const qualityMult = 0.85 + ((c.educationQuality || 75) / 300);
    return Math.max(0, Math.round(baseAnnual * factor * qualityMult));
  },

  canUseFamilyFunding(s) {
    const hasParent = s.relationships && s.relationships.some(r => ['Ibu', 'Ayah', 'Mother', 'Father'].includes(r.role) && r.alive);
    const highRep = window.Dynasty && Dynasty.getData().familyReputation >= 65;
    return Boolean(hasParent && (s.age <= 28 || highRep));
  },

  checkProgramEligibility(s, level, fieldId) {
    this.ensureFields(s);
    const ed = s.education;
    const prog = EducationData.PROGRAMS.find(p => p.id === level);
    if (!prog) return { ok: false, reason: 'Program tidak dikenali.' };
    if (s.fugitive && s.fugitive.isFugitive) {
      return { ok: false, reason: 'Pendaftaran fizikal disekat ketika berstatus Pelarian — risiko tinggi dikesan & ditangkap polis.' };
    }
    if (s.prison && s.prison.inPrison) {
      if (level !== 'high_school') {
        return { ok: false, reason: 'Pengajian tinggi (Diploma/Ijazah/Master/PhD) tidak tersedia di dalam penjara. Sertai Program Pemulihan & Kemahiran Penjara (Kelas Dewasa / Sijil Vokasional).' };
      }
    }
    if (ed.activeStudy) return { ok: false, reason: 'Anda sedang mengikuti pengajian aktif sekarang.' };
    if (s.age < prog.minAge) return { ok: false, reason: `Umur minimum ialah ${prog.minAge} tahun.` };
    if (prog.exactLevelOnly && ed.educationLevel !== prog.exactLevelOnly) {
      return { ok: false, reason: 'Anda sudah memiliki kelayakan sekolah menengah atau lebih tinggi.' };
    }
    if (!EducationData.hasMinLevel(ed.educationLevel, prog.reqLevel)) {
      let reason = 'Kelayakan minimum tidak dipenuhi.';
      if (level === 'foundation' || level === 'diploma') {
        reason = 'Perlu tamat Sekolah Menengah dahulu';
      } else if (level === 'bachelor') {
        reason = 'Perlu tamat Asasi atau Diploma dahulu';
      } else if (level === 'master') {
        reason = 'Perlu tamat Ijazah Sarjana Muda dahulu';
      } else if (level === 'phd') {
        reason = 'Perlu tamat Sarjana (Master) dahulu';
      } else {
        const reqInfo = EducationData.LEVEL_INFO[prog.reqLevel];
        reason = `Perlu tamat ${reqInfo ? reqInfo.label : prog.reqLevel} dahulu`;
      }
      return { ok: false, reason };
    }
    if (prog.needsField && !fieldId) {
      return { ok: false, reason: 'Sila pilih bidang pengajian terlebih dahulu.' };
    }
    // Elak ulang tahap & bidang yang sama tepat
    if (ed.completedDegrees.some(d => d.level === level && (!prog.needsField || d.field === fieldId))) {
      return { ok: false, reason: 'Anda sudah memiliki kelayakan ini dalam bidang yang sama!' };
    }
    return { ok: true, reason: '' };
  },

  enrollProgram({ level, fieldId = null, mode = 'full_time', funding = 'cash' }) {
    const s = GameState.current;
    this.ensureFields(s);
    const elig = this.checkProgramEligibility(s, level, fieldId);
    if (!elig.ok) return { ok: false, msg: elig.reason };

    const c = Utils.getCountry(s.countryId);
    const prog = EducationData.PROGRAMS.find(p => p.id === level);
    const fieldObj = fieldId ? EducationData.getField(fieldId) : null;
    const annualTuition = this.getTuitionAnnual(s, level, fieldId);
    const totalYears = this.getProgramDuration(s, level, fieldId, mode);
    const uniName = (c.education && c.education.universities && c.education.universities.length > 0)
      ? Utils.pick(c.education.universities)
      : `Universiti ${s.city}`;
    const instName = level === 'high_school' ? `Pusat Pendidikan Dewasa ${s.city}` : uniName;

    // Semak pilihan pembiayaan yuran
    let fundingLabel = 'Bayar Tunai';
    if (funding === 'scholarship') {
      const reqSmarts = Math.max(55, (prog.minSmarts || 40) + 18);
      const chance = s.stats.smarts >= reqSmarts ? 0.72 : (s.stats.smarts >= reqSmarts - 10 ? 0.35 : 0.08);
      if (!Utils.chance(chance)) {
        return {
          ok: false,
          msg: `Permohonan biasiswa ditolak (Kepintaran anda ${s.stats.smarts}%, disyorkan ${reqSmarts}%+). Cuba Pinjaman Pendidikan atau Bayar Tunai!`
        };
      }
      fundingLabel = 'Biasiswa Penuh';
    } else if (funding === 'family') {
      if (!this.canUseFamilyFunding(s)) {
        return { ok: false, msg: 'Tajaan keluarga tidak tersedia (perlukan ibu/bapa masih hidup atau Reputasi Keluarga tinggi).' };
      }
      fundingLabel = 'Tajaan Keluarga';
    } else if (funding === 'loan') {
      fundingLabel = 'Pinjaman Pendidikan';
    } else {
      if (annualTuition > 0 && s.money < annualTuition) {
        return {
          ok: false,
          msg: `Baki tidak mencukupi untuk yuran tahun pertama (${Utils.formatMoney(annualTuition, s.countryId)}). Cuba Pinjaman Pendidikan atau Biasiswa!`
        };
      }
    }

    // Jika sedang dalam Mod Khas, kekalkan Mod Khas dan jalani pengajian secara Separuh Masa
    let effectiveMode = mode;
    if (s.activeSpecialMode && effectiveMode === 'full_time') {
      effectiveMode = 'part_time';
    }
    const finalTotalYears = this.getProgramDuration(s, level, fieldId, effectiveMode);

    // Jika Sepenuh Masa dan sedang bekerja biasa, beri tahu atau lepaskan kerja
    if (effectiveMode === 'full_time' && s.job) {
      GameState.addJournalEntry(`🚪 Anda meletak jawatan sebagai ${s.job.title} untuk fokus pengajian Sepenuh Masa.`, 'culture');
      s.job = null;
    }

    const baseGpa = Number(Math.max(3.0, Math.min(3.4, 3.0 + ((s.stats.smarts || 60) / 100) * 0.4)).toFixed(2));
    s.education.activeStudy = {
      level,
      field: fieldId,
      fieldName: fieldObj ? fieldObj.name : 'Pendidikan Am',
      institution: instName,
      yearsCompleted: 0,
      totalYears: finalTotalYears,
      mode: effectiveMode,
      funding,
      fundingLabel,
      annualTuition,
      currentCgpa: baseGpa,
      gpa: baseGpa,
      studiedThisYear: false,
      academicWarningCount: 0,
      publications: 0
    };
    s.education.currentCgpa = baseGpa;
    s.education.studiedThisYear = false;
    s.education.isStudying = true;
    s.education.droppedOut = false;
    s.education.stage = level === 'high_school' ? 'adult_school' : 'university';
    s.education.universityName = instName;
    s.education.uniYearsLeft = finalTotalYears;

    const modeTxt = effectiveMode === 'part_time'
      ? (s.activeSpecialMode ? 'Separuh Masa (Sambil Mod Khas)' : 'Separuh Masa (Sambil Bekerja)')
      : 'Sepenuh Masa';
    GameState.addJournalEntry(
      `🎓 Anda mendaftar ${prog.title}${fieldObj ? ` (${fieldObj.name})` : ''} di ${instName}, ${c.name} ${c.flag} — ${modeTxt}, ${finalTotalYears} tahun (${fundingLabel})!`,
      'milestone'
    );
    GameState.adjustStats({ happiness: 8 });
    GameState.save();
    return { ok: true, msg: `Berjaya mendaftar ${prog.title} (${finalTotalYears} tahun, ${fundingLabel})!` };
  },

  getSecondarySchoolName(s, c, track = 'harian') {
    const city = (s && s.city) || '';
    const secBase = (c && c.education && c.education.secondary && c.education.secondary.name) || 'Sekolah Menengah';
    const isMY = c && c.id === 'MY';
    if (track === 'berasrama') {
      return isMY ? `Sekolah Berasrama Penuh (SBP) ${city}`.trim() : `Sekolah Berasrama ${secBase} ${city}`.trim();
    }
    if (track === 'teknik') {
      return isMY ? `Sekolah Menengah Teknik / Kolej Vokasional ${city}`.trim() : `Sekolah Teknik & Vokasional ${city}`.trim();
    }
    return `${secBase} ${city}`.trim();
  },

  getBoardingSchoolFee(countryId) {
    return Utils.usdToLocal(100, countryId);
  },

  chooseSecondarySchool(choice) {
    const s = GameState.current;
    if (!s) return { ok: false, msg: 'Tiada permainan aktif.' };
    this.ensureFields(s);
    const ed = s.education;
    const c = Utils.getCountry(s.countryId);

    if (choice === 'berasrama') {
      const fee = this.getBoardingSchoolFee(s.countryId);
      if ((s.stats && s.stats.smarts || 0) < 70) {
        return { ok: false, msg: 'Syarat Sekolah Berasrama tidak dipenuhi: Kepintaran minimum 70%.' };
      }
      if ((s.money || 0) < fee) {
        return { ok: false, msg: `Baki tidak mencukupi untuk yuran Sekolah Berasrama (${Utils.formatMoney(fee, s.countryId)}).` };
      }
      s.money -= fee;
      ed.stage = 'secondary';
      ed.secondaryTrack = 'berasrama';
      ed.technicalBonus = false;
      ed.schoolName = this.getSecondarySchoolName(s, c, 'berasrama');
      ed.isStudying = true;
      ed.droppedOut = false;
      ed.pendingSecondaryChoice = false;
      GameState.adjustStats({ happiness: 3 });
      GameState.addJournalEntry(
        `🏛️ Anda diterima masuk ke ${ed.schoolName} (Sekolah Berasrama)! Yuran ${Utils.formatMoney(fee, s.countryId)} dibayar. Bonus akademik aktif!`,
        'milestone'
      );
      GameState.save();
      return { ok: true, msg: `Berjaya mendaftar ke ${ed.schoolName}!` };
    }

    if (choice === 'teknik') {
      ed.stage = 'secondary';
      ed.secondaryTrack = 'teknik';
      ed.technicalBonus = true;
      ed.schoolName = this.getSecondarySchoolName(s, c, 'teknik');
      ed.isStudying = true;
      ed.droppedOut = false;
      ed.pendingSecondaryChoice = false;
      GameState.adjustStats({ health: 4 });
      GameState.addJournalEntry(
        `🔧 Anda mendaftar masuk ke ${ed.schoolName} (Sekolah Teknik/Vokasional)! Bonus kemahiran & kerja teknikal aktif.`,
        'milestone'
      );
      GameState.save();
      return { ok: true, msg: `Berjaya mendaftar ke ${ed.schoolName}!` };
    }

    if (choice === 'tidak_belajar') {
      ed.stage = 'dropped_out';
      ed.secondaryTrack = 'none';
      ed.technicalBonus = false;
      ed.schoolName = null;
      ed.isStudying = false;
      ed.droppedOut = true;
      ed.hasHighSchool = false;
      ed.pendingSecondaryChoice = false;
      ed.educationHistory.push({
        type: 'dropout',
        label: 'Tidak menyambung ke Sekolah Menengah',
        courseLabel: 'Sekolah Menengah',
        age: s.age,
        year: s.year
      });
      GameState.addJournalEntry(
        `🚪 Anda memilih untuk tidak menyambung ke sekolah menengah pada umur ${s.age} tahun. Persekolahan tamat tanpa sijil menengah.`,
        'warning'
      );
      GameState.save();
      return { ok: true, msg: 'Anda memilih untuk tidak menyambung ke sekolah menengah.' };
    }

    // Default: Sekolah Menengah Harian
    ed.stage = 'secondary';
    ed.secondaryTrack = 'harian';
    ed.technicalBonus = false;
    ed.schoolName = this.getSecondarySchoolName(s, c, 'harian');
    ed.isStudying = true;
    ed.droppedOut = false;
    ed.pendingSecondaryChoice = false;
    GameState.addJournalEntry(
      `🏫 Anda melangkah ke ${ed.schoolName} (Sekolah Menengah Harian)! Zaman remaja bermula.`,
      'milestone'
    );
    GameState.save();
    return { ok: true, msg: `Berjaya mendaftar ke ${ed.schoolName}!` };
  },

  canDropOut(s = GameState.current) {
    if (!s || !s.education) return false;
    const ed = s.education;
    if (ed.activeStudy) return true;
    if (ed.stage === 'university') return true;
    if (ed.stage === 'secondary') return true;
    return false;
  },

  getActiveStudyLabel(s = GameState.current) {
    if (!s || !s.education) return 'Pengajian Semasa';
    const ed = s.education;
    if (ed.activeStudy) {
      const st = ed.activeStudy;
      const prog = window.EducationData && EducationData.PROGRAMS.find(p => p.id === st.level);
      const progTitle = prog ? prog.title : st.level;
      return st.fieldName ? `${progTitle} (${st.fieldName}) — ${st.institution}` : `${progTitle} — ${st.institution}`;
    }
    if (ed.stage === 'university') {
      return ed.universityName || 'Universiti';
    }
    if (ed.stage === 'secondary') {
      return ed.schoolName || 'Sekolah Menengah';
    }
    return 'Pengajian Semasa';
  },

  dropOutOfStudy() {
    const s = GameState.current;
    if (!s) return { ok: false, msg: 'Tiada permainan aktif.' };
    this.ensureFields(s);
    if (!this.canDropOut(s)) {
      return { ok: false, msg: 'Anda tidak berada dalam pengajian yang boleh diberhentikan buat masa ini.' };
    }

    const ed = s.education;
    const wasSecondary = ed.stage === 'secondary' && !ed.activeStudy;
    const courseLabel = this.getActiveStudyLabel(s);

    // Kosongkan status pengajian aktif & hentikan yuran tahunan
    ed.isStudying = false;
    ed.activeStudy = null;
    ed.currentCgpa = null;
    ed.studiedThisYear = false;
    ed.uniYearsLeft = 0;
    ed.universityName = null;
    ed.droppedOut = true;
    ed.pendingSecondaryChoice = false;

    if (wasSecondary) {
      ed.stage = 'dropped_out';
      ed.schoolName = null;
    } else {
      ed.stage = ed.hasDegree ? 'graduated' : (ed.hasHighSchool ? 'highschool_done' : 'dropped_out');
    }

    // Kurangkan stres (-15 hingga -25)
    const stressDrop = Utils.randInt(15, 25);
    if (s.alignment) {
      s.alignment.stress = Utils.clamp((s.alignment.stress || 0) - stressDrop, 0, 100);
    }

    // Jika masih muda / di bawah tanggungan ibu bapa (umur < 23), hubungan ibu bapa terjejas sedikit (-10 hingga -20)
    let parentHitNote = '';
    if (s.age < 23 && Array.isArray(s.relationships)) {
      const parents = s.relationships.filter(r => r.alive && ['Ibu', 'Ayah', 'Mother', 'Father'].includes(r.role));
      if (parents.length > 0) {
        const relHit = Utils.randInt(10, 20);
        parents.forEach(p => {
          p.closeness = Utils.clamp((p.closeness ?? 75) - relHit, 0, 100);
        });
        parentHitNote = ` • Hubungan ibu bapa -${relHit}%`;
      }
    }

    // Rekod dalam Sejarah Pendidikan & Log Kehidupan
    ed.educationHistory.push({
      type: 'dropout',
      label: wasSecondary ? `Berhenti sekolah daripada ${courseLabel}` : `Berhenti belajar daripada ${courseLabel}`,
      courseLabel,
      age: s.age,
      year: s.year
    });

    const logMsg = wasSecondary
      ? `🚪 Anda berhenti sekolah daripada ${courseLabel} pada umur ${s.age} tahun tanpa sijil menengah (Stres -${stressDrop}%${parentHitNote}).`
      : `🚪 Berhenti belajar daripada ${courseLabel} pada umur ${s.age} tahun tanpa sijil/ijazah (Stres -${stressDrop}%${parentHitNote}). Yuran tahunan dihentikan dan anda bebas memohon pekerjaan sepenuh masa!`;
    GameState.addJournalEntry(logMsg, 'warning');
    GameState.save();

    return {
      ok: true,
      stressDrop,
      courseLabel,
      msg: `🚪 Anda berhenti belajar daripada ${courseLabel} (Stres -${stressDrop}%${parentHitNote}).`
    };
  },

  studyHarder() {
    const s = GameState.current;
    this.ensureFields(s);
    if (s.yearlyActions.studyHard || (s.education.activeStudy && s.education.activeStudy.studiedThisYear)) {
      return { ok: false, msg: 'Anda sudah mengulang kaji intensif tahun ini!' };
    }
    s.yearlyActions.studyHard = true;
    s.education.studiedThisYear = true;
    const gain = Utils.randInt(1, 3);
    GameState.adjustStats({ smarts: gain, happiness: -2 });
    if (s.alignment) s.alignment.stress = Utils.clamp((s.alignment.stress || 0) + 4, 0, 100);

    if (s.education.activeStudy) {
      const st = s.education.activeStudy;
      st.studiedThisYear = true;
      const smartsBoost = 0.20 + Math.min(0.25, ((s.stats.smarts || 55) / 100) * 0.25);
      const nextCgpa = Number(Math.max(0, Math.min(4.0, (st.currentCgpa ?? st.gpa ?? 3.1) + smartsBoost)).toFixed(2));
      st.currentCgpa = nextCgpa;
      st.gpa = nextCgpa;
      s.education.currentCgpa = nextCgpa;
      GameState.addJournalEntry(
        `📖 Anda mengulang kaji bersungguh-sungguh untuk ${st.institution} (Kepintaran +${gain}%, PNGK kini ${nextCgpa.toFixed(2)}).`
      );
      GameState.save();
      return { ok: true, msg: `📖 Ulang kaji berjaya! Kepintaran +${gain}%, PNGK kini ${nextCgpa.toFixed(2)}.` };
    } else {
      GameState.addJournalEntry(`📖 Anda belajar bersungguh-sungguh tahun ini (Kepintaran +${gain}%)!`);
    }
    GameState.save();
    return { ok: true, msg: `Kepintaran +${gain}%!` };
  },

  // Dipanggil setiap tahun dari Sim._processEducation
  tickYearlyEducation(s, c) {
    this.ensureFields(s);
    const ed = s.education;

    // 1) Bayaran balik Pinjaman Pendidikan automatik apabila bekerja
    if (ed.educationLoan > 0 && s.job && s.job.salary > 0) {
      const installment = Math.min(ed.educationLoan, Math.max(Utils.usdToLocal(800, s.countryId), Math.round(s.job.salary * 0.08)));
      s.money -= installment;
      ed.educationLoan = Math.max(0, ed.educationLoan - installment);
      if (ed.educationLoan === 0) {
        GameState.addJournalEntry('🎉 Pinjaman Pendidikan anda telah DILUNASKAN sepenuhnya!', 'milestone');
      }
    }

    // 2) Kemajuan pengajian aktif (Kelas Dewasa / Diploma / Ijazah / Master / PhD)
    const st = ed.activeStudy;
    if (!st) {
      ed.studiedThisYear = false;
      return false;
    }

    // Proses yuran tahunan
    if (st.annualTuition > 0) {
      if (st.funding === 'cash') {
        s.money -= st.annualTuition;
      } else if (st.funding === 'loan') {
        ed.educationLoan = (ed.educationLoan || 0) + st.annualTuition;
      }
    }

    // Separuh masa sambil bekerja menambah sedikit stres
    if (st.mode === 'part_time') {
      if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: 8 });
      GameState.adjustStats({ health: -2 });
    }

    const didStudy = Boolean(st.studiedThisYear || ed.studiedThisYear || (s.yearlyActions && s.yearlyActions.studyHard));
    const curCgpa = typeof st.currentCgpa === 'number' ? st.currentCgpa : (typeof st.gpa === 'number' ? st.gpa : 3.15);

    if (!didStudy) {
      const drop = 0.50 + (Math.random() * 0.30);
      st.currentCgpa = Number(Math.max(0.0, curCgpa - drop).toFixed(2));
      st.gpa = st.currentCgpa;
      ed.currentCgpa = st.currentCgpa;
      GameState.adjustStats({ happiness: -4 });
      GameState.addJournalEntry(
        `📉 Anda langsung tidak mengulang kaji tahun ini — PNGK jatuh mendadak kepada ${st.currentCgpa.toFixed(2)}!`,
        'warning'
      );
    } else {
      const boost = 0.15 + (Math.random() * 0.20);
      st.currentCgpa = Number(Math.min(4.0, curCgpa + boost).toFixed(2));
      st.gpa = st.currentCgpa;
      ed.currentCgpa = st.currentCgpa;
    }

    // Tetapkan semula status ulang kaji bagi tahun baharu
    st.studiedThisYear = false;
    ed.studiedThisYear = false;

    st.yearsCompleted += 1;
    ed.uniYearsLeft = Math.max(0, st.totalYears - st.yearsCompleted);

    // Semak Amaran Akademik jika PNGK < 2.00
    if (st.currentCgpa < 2.0) {
      st.academicWarningCount = (st.academicWarningCount || 0) + 1;
      if (st.academicWarningCount >= 2 && !didStudy) {
        st.totalYears += 1;
        ed.uniYearsLeft = Math.max(1, st.totalYears - st.yearsCompleted);
        if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: 10 });
        GameState.adjustStats({ happiness: -10 });
        GameState.addJournalEntry(
          `⚠️ Amaran Akademik Kritikal: PNGK anda (${st.currentCgpa.toFixed(2)}) kekal di bawah 2.00 akibat tidak mengulang kaji — anda gagal dan terpaksa mengulang 1 tahun pengajian!`,
          'warning'
        );
      } else {
        GameState.addJournalEntry(
          `⚠️ Amaran Akademik: PNGK anda jatuh di bawah 2.00 (${st.currentCgpa.toFixed(2)})! Sila tekan "📖 Belajar / Ulang Kaji" setiap tahun atau anda berisiko gagal dan mengulang tahun.`,
          'warning'
        );
      }
    } else {
      st.academicWarningCount = 0;
    }

    // Semak Anugerah Dekan (PNGK 4.00)
    let deansAwardedThisYear = false;
    if (st.currentCgpa >= 4.0) {
      ed.hasDeansAward = true;
      ed.deansAwardCount = (ed.deansAwardCount || 0) + 1;
      deansAwardedThisYear = true;
      GameState.adjustStats({ happiness: 10 });
      if (window.Dynasty) Dynasty.adjustReputation(2);
      if (window.KarmaEndings) KarmaEndings.adjustAlignment({ fame: 2 });
      if (window.Utils && Utils.playTone) Utils.playTone('achievement');
      GameState.addJournalEntry(
        `🏅 ANUGERAH DEKAN! Pencapaian cemerlang PNGK 4.00 di ${st.institution} melayakkan anda menerima Anugerah Dekan (Jumlah: ${ed.deansAwardCount}x)!`,
        'milestone'
      );
    }

    // Peristiwa tahunan khas penyelidikan PhD (tesis, penerbitan jurnal)
    if (st.level === 'phd' && st.yearsCompleted < st.totalYears) {
      if (Utils.chance(0.55)) {
        st.publications = (st.publications || 0) + 1;
        GameState.adjustStats({ happiness: 5 });
        if (window.Dynasty) Dynasty.adjustReputation(2);
        GameState.addJournalEntry(
          `📄 Kajian PhD (${st.fieldName}): Kertas penyelidikan anda berjaya diterbitkan dalam jurnal antarabangsa (Jumlah penerbitan: ${st.publications})!`,
          'milestone'
        );
      } else {
        if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: 7 });
        GameState.addJournalEntry(
          `🔬 Tahun ${st.yearsCompleted}/${st.totalYears} PhD di ${st.institution}: Anda bertungkus-lumus membaiki bab metodologi tesis selepas semakan penyelia.`,
          'culture'
        );
      }
    }

    // Tamat pengajian!
    if (st.yearsCompleted >= st.totalYears) {
      const prog = EducationData.PROGRAMS.find(p => p.id === st.level);
      // Ujian Viva PhD
      if (st.level === 'phd') {
        const vivaPass = Utils.chance(0.82 + (s.stats.smarts / 500));
        if (!vivaPass) {
          st.totalYears += 1;
          ed.uniYearsLeft = 1;
          if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: 12 });
          GameState.addJournalEntry(
            `🎓 Ujian Viva PhD: Panel pemeriksa meminta pindaan besar tesis anda — pengajian disambung 1 tahun lagi!`,
            'warning'
          );
          return true;
        }
      }

      const finalCgpa = Number((st.currentCgpa ?? st.gpa ?? 3.0).toFixed(2));
      const graduatedWithDeans = finalCgpa >= 4.0;
      if (graduatedWithDeans && !deansAwardedThisYear) {
        ed.hasDeansAward = true;
        ed.deansAwardCount = (ed.deansAwardCount || 0) + 1;
      }
      ed.graduatedCgpa = finalCgpa;
      ed.currentCgpa = null;

      const prevRank = EducationData.levelRank(ed.educationLevel);
      const newRank = EducationData.levelRank(st.level);
      if (newRank >= prevRank) {
        ed.educationLevel = st.level;
        if (st.field) ed.educationField = st.field;
      }
      if (newRank >= 1) ed.hasHighSchool = true;
      if (newRank >= 3) ed.hasDegree = true;

      ed.completedDegrees.push({
        level: st.level,
        title: prog ? prog.title : st.level,
        field: st.field,
        fieldName: st.fieldName,
        institution: st.institution,
        year: s.year,
        gpa: finalCgpa,
        deansAward: graduatedWithDeans,
        publications: st.publications || 0
      });

      const deansTag = graduatedWithDeans ? ' — 🏅 Anugerah Dekan!' : '';
      if (st.level === 'phd') {
        ed.hasDoctorateTitle = true;
        if (window.Dynasty) Dynasty.adjustReputation(10);
        if (window.KarmaEndings) {
          KarmaEndings.adjustAlignment({ fame: 8, karma: 6 });
          KarmaEndings.addHighlight('👑', `Menggenggam PhD (${st.fieldName}) & gelaran Dr. dari ${st.institution} (PNGK ${finalCgpa.toFixed(2)})`);
        }
        if (window.Utils && Utils.playTone) Utils.playTone('achievement');
        GameState.addJournalEntry(
          `👑 TAHNIAH ${this.getDisplayName(s)}! Anda lulus ujian Viva PhD (${st.fieldName}) di ${st.institution} (PNGK ${finalCgpa.toFixed(2)}${deansTag}) dengan ${st.publications || 1} penerbitan jurnal! Gelaran "Dr." rasmi dianugerahkan & Reputasi Keluarga +10%!`,
          'milestone'
        );
      } else {
        if (window.Utils && Utils.playTone) Utils.playTone('achievement');
        GameState.addJournalEntry(
          `🎓 KONVOKESYEN! Anda menamatkan ${prog ? prog.title : st.level}${st.field ? ` (${st.fieldName})` : ''} di ${st.institution} (PNGK ${finalCgpa.toFixed(2)}${deansTag})!`,
          'milestone'
        );
      }

      GameState.adjustStats({ happiness: graduatedWithDeans ? 24 : 18 });
      ed.activeStudy = null;
      ed.isStudying = false;
      ed.stage = newRank >= 3 ? 'graduated' : 'highschool_done';
    }
    return true;
  },

  // --------------------------------------------------------------------------
  // 3. SIJIL PROFESIONAL & KEMAHIRAN BERASASKAN BIDANG
  // --------------------------------------------------------------------------
  isPrisonRehabCourse(cert) {
    if (!cert) return false;
    return cert.group === 'Asas & Vokasional' || (cert.minEducation === 'none' && (cert.costUsd || 0) <= 1000);
  },

  checkCertificateEligibility(s, cert) {
    this.ensureFields(s);
    const ed = s.education;
    if (s.fugitive && s.fugitive.isFugitive) {
      return { ok: false, reason: 'Pendaftaran kursus disekat ketika berstatus Pelarian — risiko tinggi dikesan & ditangkap polis.' };
    }
    if (!cert.noAgeLimit && s.age < 17) return { ok: false, reason: 'Dibuka bermula umur 17 tahun.' };
    if (s.prison && s.prison.inPrison) {
      if (!this.isPrisonRehabCourse(cert)) {
        return { ok: false, reason: 'Hanya Program Pemulihan & Kemahiran Penjara (kursus asas/vokasional) dibenarkan ketika di dalam penjara.' };
      }
    }
    if (ed.certificates.includes(cert.id)) return { ok: false, reason: 'Sudah Dimiliki' };

    if (!EducationData.hasMinLevel(ed.educationLevel, cert.minEducation)) {
      const lvl = EducationData.LEVEL_INFO[cert.minEducation];
      return { ok: false, reason: `Perlukan: ${lvl ? lvl.short : cert.minEducation}` };
    }

    if (cert.requiredFields !== 'any' && Array.isArray(cert.requiredFields) && !cert.requiredFields.includes('any')) {
      const earnedFields = new Set([
        ed.educationField,
        ...(ed.completedDegrees || []).map(d => d.field)
      ].filter(Boolean));
      const matched = cert.requiredFields.some(f => earnedFields.has(f));
      if (!matched) {
        const names = cert.requiredFields.map(fid => {
          const fo = EducationData.getField(fid);
          return fo ? fo.short : fid;
        }).join(' / ');
        const lvl = EducationData.LEVEL_INFO[cert.minEducation];
        return { ok: false, reason: `Perlukan: ${lvl ? lvl.short : ''} ${names}`.trim() };
      }
    }

    return { ok: true, reason: '' };
  },

  getMatchedCertificatesForCareer(s, career) {
    const certs = (s && s.education && s.education.certificates) || [];
    if (!certs.length || !career || !window.EducationData) return [];
    const reqFields = Array.isArray(career.requiredFields) ? career.requiredFields : [];
    const prefCerts = Array.isArray(career.preferredCerts) ? career.preferredCerts : [];
    const matched = [];
    for (const cid of certs) {
      if (prefCerts.includes(cid)) {
        matched.push(cid);
        continue;
      }
      const cObj = EducationData.CERTIFICATES.find(x => x.id === cid);
      if (cObj && Array.isArray(cObj.matchFields) && reqFields.length > 0 && cObj.matchFields.some(f => reqFields.includes(f))) {
        matched.push(cid);
      }
    }
    return matched;
  },

  takeCertificate(certId) {
    const s = GameState.current;
    this.ensureFields(s);
    const cert = EducationData.CERTIFICATES.find(c => c.id === certId);
    if (!cert) return { ok: false, msg: 'Sijil / kursus tidak ditemui.' };
    if (s.yearlyActions.tookCert && !cert.isModernCourse) {
      return { ok: false, msg: 'Anda hanya boleh mengambil 1 peperiksaan sijil profesional setahun!' };
    }
    if (cert.isModernCourse && (s.yearlyActions.modernCoursesTaken || 0) >= 2) {
      return { ok: false, msg: 'Had 2 Kursus Profesional setahun telah dicapai.' };
    }

    const elig = this.checkCertificateEligibility(s, cert);
    if (!elig.ok) return { ok: false, msg: elig.reason };

    const inPrison = Boolean(s.prison && s.prison.inPrison);
    const costLocal = inPrison ? 0 : Utils.usdToLocal(cert.costUsd, s.countryId);
    if (s.money < costLocal) {
      return { ok: false, msg: `Yuran kursus & pensijilan ialah ${Utils.formatMoney(costLocal, s.countryId)}.` };
    }

    s.money -= costLocal;
    if (typeof s.activityEnergyLeft === 'number' && s.activityEnergyLeft > 0) {
      s.activityEnergyLeft -= 1;
    }
    if (cert.isModernCourse) {
      s.yearlyActions.modernCoursesTaken = (s.yearlyActions.modernCoursesTaken || 0) + 1;
    } else {
      s.yearlyActions.tookCert = true;
    }

    const passChance = Math.max(0.30, Math.min(0.96, 0.65 + ((s.stats.smarts - (cert.smartsReq || 40)) * 0.008)));
    if (Utils.chance(passChance)) {
      s.education.certificates.push(cert.id);
      GameState.adjustStats({ smarts: Utils.randInt(4, 7), happiness: 11 });
      if (inPrison && s.prison) {
        const behavGain = Utils.randInt(8, 12);
        s.prison.behavior = Utils.clamp((s.prison.behavior ?? 60) + behavGain, 0, 100);
        if (s.alignment) s.alignment.karma = Utils.clamp((s.alignment.karma || 0) + 5, -100, 100);
        GameState.addJournalEntry(
          `⛓️📜 PROGRAM PEMULIHAN PENJARA: Anda menamatkan ${cert.icon} ${cert.title} di dalam penjara! Rekod Kelakuan +${behavGain}% (${s.prison.behavior}%) — peluang parol meningkat.`,
          'milestone'
        );
        GameState.save();
        return { ok: true, msg: `Lulus Program Pemulihan Penjara: ${cert.title} (Kelakuan ${s.prison.behavior}% • Peluang Parol +)!` };
      }
      if (window.Dynasty) Dynasty.adjustReputation(2);
      if (window.Utils && Utils.playTone) Utils.playTone('achievement');
      GameState.addJournalEntry(
        `📜 TAMAT KURSUS & SIJIL! Anda memperoleh ${cert.icon} ${cert.title} (Umur ${s.age} thn)! Bonus gaji +${cert.salaryBonusPct}% & kelebihan temu duga dalam bidang berkaitan.`,
        'milestone'
      );
      GameState.save();
      return { ok: true, msg: `Tahniah! Memperoleh ${cert.title} (+${cert.salaryBonusPct}% bonus gaji)!` };
    } else {
      GameState.adjustStats({ smarts: 2, happiness: -4 });
      if (inPrison && s.prison) {
        s.prison.behavior = Utils.clamp((s.prison.behavior ?? 60) + 3, 0, 100);
      }
      GameState.addJournalEntry(
        `📜 Anda tidak sempat mencapai markah lulus untuk pensijilan ${cert.title} kali ini, namun ilmu kursus meningkatkan Kepintaran (+2%).`,
        'warning'
      );
      GameState.save();
      return { ok: false, msg: `Belum lulus penilaian ${cert.title} kali ini — tingkatkan Kepintaran & cuba lagi!` };
    }
  },

  // --------------------------------------------------------------------------
  // 4. PASARAN KERJA RAWAK DINAMIK (10–12 JAWATAN/TAHUN + ANTI-ULANG + 2 REFRESH)
  // --------------------------------------------------------------------------
  getCareerSalaryLocal(s, career, rankIndex = 0) {
    const c = Utils.getCountry(s.countryId);
    const mult = c.salaryMultiplier || 0.55;
    const rankMult = 1 + (rankIndex * 0.28);
    let certBonus = 1;
    const matchedCerts = this.getMatchedCertificatesForCareer(s, career);
    for (const cid of matchedCerts) {
      const cObj = EducationData.CERTIFICATES.find(x => x.id === cid);
      certBonus += ((cObj ? cObj.salaryBonusPct : 12) / 100);
    }
    certBonus = Math.min(1.45, certBonus);
    const usdAnnual = Math.round(career.baseSalary * mult * rankMult * certBonus);
    return Utils.usdToLocal(usdAnnual, s.countryId);
  },

  isCareerFieldMatched(s, career) {
    this.ensureFields(s);
    const ed = s.education;
    if (!EducationData.hasMinLevel(ed.educationLevel, career.minEducation)) return false;
    if (career.requiredFields === 'any') return true;
    const earnedFields = new Set([
      ed.educationField,
      ...(ed.completedDegrees || []).map(d => d.field)
    ].filter(Boolean));
    return Array.isArray(career.requiredFields) && career.requiredFields.some(f => earnedFields.has(f));
  },

  generateYearlyJobMarket(s, opts = {}) {
    if (!s || !window.CareersData) return [];
    this.ensureFields(s);
    const cm = s.careerMarket;

    // Jika papan tahun ini sudah dijana, jangan jana semula apabila modal ditutup & dibuka
    if (!opts.force && cm.lastMarketYear === s.year && Array.isArray(cm.openings) && cm.openings.length > 0 && Array.isArray(cm.partTimeOpenings)) {
      return cm.openings;
    }

    cm.refreshesLeft = 0;
    cm.applicationsLeft = this.MAX_APPLICATIONS_YEAR;
    cm.appliedJobIdsThisYear = [];
    cm.lastMarketYear = s.year;
    s.jobAppsThisYear = 0;

    if (cm.openings.length > 0) {
      cm.recentJobIds = [...cm.openings, ...cm.recentJobIds].slice(0, 20);
    }

    const recentSet = new Set(cm.recentJobIds || []);
    const all = CareersData.CAREERS;
    const fresh = all.filter(j => !recentSet.has(j.id));
    const pool = fresh.length >= 10 ? fresh : all;
    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

    const picked = [];
    const addPick = (j) => {
      if (j && !picked.includes(j.id)) picked.push(j.id);
    };

    // 1) 1–2 jawatan sesuai kelayakan/bidang watak
    const matching = shuffle(pool.filter(j => !j.isRare && this.isCareerFieldMatched(s, j)));
    for (const j of matching.slice(0, 2)) addPick(j);

    // 2) 1 jawatan permulaan / umum
    const entryPool = shuffle(pool.filter(j => !picked.includes(j.id) && (j.industry === 'unskilled' || j.industry === 'semi_skilled' || j.minEducation === 'none' || j.minEducation === 'high_school')));
    if (entryPool[0]) addPick(entryPool[0]);

    // 3) Cukupkan kepada tepat 4–5 kekosongan sepenuh masa tahun ini
    const targetFullTime = Utils.randInt(4, 5);
    for (const j of shuffle(pool)) {
      if (picked.length >= targetFullTime) break;
      addPick(j);
    }
    cm.openings = picked;

    // 4) Jana 2–3 kekosongan Pekerjaan Sambilan mengikut umur
    const age = s.age || 0;
    const ptEligible = this.PART_TIME_JOBS.filter(pt => age >= pt.minAge);
    const ptSource = ptEligible.length > 0 ? ptEligible : this.PART_TIME_JOBS.filter(pt => pt.minAge <= 15);
    const ptTarget = Math.min(ptSource.length, Utils.randInt(2, 3));
    cm.partTimeOpenings = shuffle(ptSource).slice(0, ptTarget).map(pt => pt.id);

    return picked;
  },

  getPartTimeSalaryLocal(s, ptJob) {
    const c = Utils.getCountry(s.countryId);
    const entryBaseUsd = 14000 * Math.max(0.28, c.salaryMultiplier || 0.55);
    const ratio = (ptJob && ptJob.payRatio) || 0.30;
    return Math.max(80, Utils.usdToLocal(Math.round(entryBaseUsd * ratio), s.countryId));
  },

  applyForPartTimeJob(ptId) {
    const s = GameState.current;
    this.ensureFields(s);
    if (s.prison && s.prison.inPrison) {
      return { ok: false, msg: 'Tidak boleh memohon pekerjaan sambilan semasa berada dalam tahanan.' };
    }
    if (s.fugitive && s.fugitive.isFugitive) {
      return { ok: false, msg: 'Majikan sah menolak permohonan anda kerana status buruan polis.' };
    }
    if (s.age < 15) {
      return { ok: false, msg: 'Umur minimum untuk pekerjaan sambilan ialah 15 tahun.' };
    }
    if (s.partTimeJob) {
      return { ok: false, msg: `Anda sudah bekerja sambilan sebagai ${s.partTimeJob.title}. Berhenti dahulu sebelum memohon kerja sambilan lain.` };
    }
    const appsUsed = typeof s.jobAppsThisYear === 'number' ? s.jobAppsThisYear : 0;
    if (appsUsed >= this.MAX_APPLICATIONS_YEAR) {
      return { ok: false, msg: 'Had Permohonan Tahun Ini Tamat. Cuba lagi tahun hadapan.' };
    }
    if (s.careerMarket.appliedJobIdsThisYear.includes(ptId)) {
      return { ok: false, msg: 'Anda sudah memohon kekosongan ini tahun ini.' };
    }

    const pt = this.PART_TIME_JOBS.find(x => x.id === ptId);
    if (!pt) return { ok: false, msg: 'Kekosongan sambilan tidak ditemui.' };
    if (s.age < pt.minAge) {
      return { ok: false, msg: `Umur minimum untuk jawatan ini ialah ${pt.minAge} tahun.` };
    }

    const isCollegeStudent = Boolean(s.education && (s.education.activeStudy || s.education.stage === 'university'));
    const smarts = (s.stats && s.stats.smarts) || 50;
    if (pt.reqSmarts > 0 && smarts < pt.reqSmarts && !(pt.allowStudentBypass && isCollegeStudent)) {
      return { ok: false, msg: 'Kelayakan kepintaran anda belum mencukupi untuk jawatan sambilan ini.' };
    }

    // Guna 1 kuota permohonan tahunan JobHunter
    s.jobAppsThisYear = appsUsed + 1;
    s.careerMarket.applicationsLeft = Math.max(0, this.MAX_APPLICATIONS_YEAR - s.jobAppsThisYear);
    s.careerMarket.appliedJobIdsThisYear.push(ptId);

    // Penilaian pengambilan realistik (tersembunyi)
    const looks = (s.stats && s.stats.looks) || 50;
    const karma = (s.alignment && s.alignment.karma) || 0;
    const heat = (s.alignment && s.alignment.notoriety) || 0;
    let chance = 0.68;
    if (smarts < 45) chance -= 0.20;
    if (looks < 40) chance -= 0.14;
    if (karma < 0) chance -= 0.14;
    if (heat >= 35) chance -= 0.28;
    if (s.hasCriminalRecord) chance -= 0.24;
    chance = Utils.clamp(chance, 0.08, 0.88);

    if (!Utils.chance(chance)) {
      const reason = (s.hasCriminalRecord || heat >= 35)
        ? 'Majikan menolak permohonan selepas semakan latar belakang mendapati rekod anda membimbangkan.'
        : (looks < 40)
          ? 'Penemu duga merasakan imej dan penampilan anda kurang meyakinkan bagi posisi ini.'
          : (karma < 0)
            ? 'Semakan rujukan dan perwatakan tidak memihak kepada permohonan anda.'
            : 'Majikan memilih calon lain yang dirasakan lebih sesuai untuk syif kali ini.';
      GameState.adjustStats({ happiness: -3 });
      GameState.addJournalEntry(`📄 Permohonan sambilan (${pt.title}) ditolak: ${reason}`, 'warning');
      GameState.save();
      return { ok: false, msg: `Permohonan ditolak: ${reason}` };
    }

    const salary = this.getPartTimeSalaryLocal(s, pt);
    s.partTimeJob = {
      id: pt.id,
      title: pt.title,
      icon: pt.icon,
      salary,
      years: 0,
      stressGain: pt.stressGain,
      healthDrop: pt.healthDrop,
      countryId: s.countryId
    };
    GameState.adjustStats({ happiness: 5 });
    GameState.addJournalEntry(
      `🕒 Anda diterima bekerja sambilan sebagai ${pt.icon} ${pt.title} dengan upah ${Utils.formatMoney(salary, s.countryId)}/thn!`,
      'milestone'
    );
    GameState.save();
    return { ok: true, msg: `Tahniah! Anda diterima bekerja sambilan sebagai ${pt.title}.` };
  },

  quitPartTimeJob() {
    const s = GameState.current;
    if (!s || !s.partTimeJob) return { ok: false, msg: 'Tiada pekerjaan sambilan aktif.' };
    const title = s.partTimeJob.title;
    s.partTimeJob = null;
    GameState.addJournalEntry(`🚪 Anda telah berhenti daripada pekerjaan sambilan sebagai ${title}.`);
    GameState.save();
    return { ok: true, msg: `Anda telah berhenti daripada kerja sambilan (${title}).` };
  },

  refreshJobMarket() {
    const s = GameState.current;
    this.ensureFields(s);
    if (s.careerMarket.refreshesLeft <= 0) {
      return { ok: false, msg: 'Anda sudah menggunakan kesemua 2 segaran Pasaran Kerja tahun ini!' };
    }
    s.careerMarket.refreshesLeft -= 1;
    this.generateYearlyJobMarket(s, { isRefresh: true });
    GameState.save();
    return { ok: true, msg: `🔄 Pasaran kerja disegarkan! (Baki: ${s.careerMarket.refreshesLeft}/${this.MAX_MARKET_REFRESHES})` };
  },

  // --------------------------------------------------------------------------
  // 5. KUNCI PERANAN KETAT ("WAJIB LETAK JAWATAN DAHULU") & SARINGAN CV REALISTIK
  // --------------------------------------------------------------------------
  getActiveRoleLock(s) {
    if (!s) return { locked: false, roleName: '', type: null };
    if (s.activeSpecialMode && window.SpecialModesEngine) {
      const info = SpecialModesEngine.getActiveInfo(s);
      if (info) {
        return {
          locked: true,
          roleName: `${info.rank.title} (${info.def.title})`,
          shortName: info.def.shortLabel,
          type: 'special_mode'
        };
      }
    }
    if (s.job) {
      return {
        locked: true,
        roleName: s.job.title,
        shortName: s.job.title,
        type: 'job'
      };
    }
    return { locked: false, roleName: '', type: null };
  },

  getEffectiveCgpa(s) {
    if (!s || !s.education) return null;
    const ed = s.education;
    if (typeof ed.graduatedCgpa === 'number') return ed.graduatedCgpa;
    if (Array.isArray(ed.completedDegrees) && ed.completedDegrees.length > 0) {
      const last = ed.completedDegrees[ed.completedDegrees.length - 1];
      if (last && typeof last.gpa === 'number') return last.gpa;
    }
    return null;
  },

  calculateScreeningChance(s, career) {
    this.ensureFields(s);
    const ed = s.education;
    // Peluang asas mengikut peringkat jawatan
    let base;
    if (career.isRare || career.baseSalary >= 80000 || career.minEducation === 'phd' || career.minEducation === 'master') {
      base = Utils.randInt(10, 25); // Senior / Elit / Nadir: 10–25%
    } else if (career.minEducation !== 'none' || career.baseSalary >= 38000) {
      base = Utils.randInt(22, 38); // Pertengahan / Profesional: 22–38%
    } else {
      base = Utils.randInt(40, 55); // Peringkat Permulaan (Entry-Level): 40–55%
    }

    let mod = 0;

    // 1) Ijazah / PhD / Bidang Sepadan (+10% hingga +15%)
    const lvlRank = EducationData.levelRank(ed.educationLevel);
    const reqRank = EducationData.levelRank(career.minEducation);
    if (this.isCareerFieldMatched(s, career) && lvlRank >= 2) {
      mod += (lvlRank >= 4 || lvlRank > reqRank) ? 15 : 10;
    }

    // 1B) Kesan Nyata PNGK (CGPA) & Anugerah Dekan dalam saringan resume majikan
    const cgpa = this.getEffectiveCgpa(s);
    let maxCap = 85;
    if (cgpa !== null) {
      if (cgpa >= 4.0) {
        mod += Utils.randInt(25, 35); // Anugerah Dekan: keutamaan tinggi (+25% hingga +35%)
        maxCap = 95;
      } else if (cgpa >= 3.0) {
        mod += Math.round((cgpa - 3.0) * 10); // 3.00–3.99: skala positif ringan (+0% hingga +10%)
      } else {
        mod -= Utils.randInt(25, 40); // PNGK < 3.00: penalti berat (-25% hingga -40%)
      }
    }

    // 2) Sijil & Kursus Profesional Sepadan (+8% hingga +14%)
    const matchedCerts = this.getMatchedCertificatesForCareer(s, career);
    if (matchedCerts.length > 0) {
      mod += matchedCerts.length >= 2 ? 14 : 9;
    }

    // 3) Kepintaran / Penampilan / Karma / Pengalaman (Penalti berat jika lemah)
    let statBoost = 0;
    const smarts = (s.stats && s.stats.smarts) || 50;
    const looks = (s.stats && s.stats.looks) || 50;
    const karma = (s.alignment && s.alignment.karma) || 0;
    const heat = (s.alignment && s.alignment.notoriety) || 0;

    if (smarts >= 75) statBoost += 5;
    if (smarts >= 90) statBoost += 3;
    if (smarts < 45) mod -= 24;
    if (looks >= 75) statBoost += 2;
    if (looks < 40) {
      const looksSensitive = ['finance', 'creative', 'hospitality', 'business'].includes(career.industry);
      mod -= looksSensitive ? 22 : 12;
    }
    if (karma < 0) mod -= Math.min(20, Math.round(Math.abs(karma) * 0.35));
    if (heat >= 35) mod -= Math.min(35, Math.round(heat * 0.45));
    if ((s.age - 18) >= 6) statBoost += 2;
    mod += Math.min(12, statBoost);

    // 4) Kemelesetan Ekonomi / Trend Pasaran Menurun (-15%)
    const mktTrend = (s.assetMarket && s.assetMarket.trend) || '';
    if (['recession', 'crash', 'bear', 'downturn'].includes(mktTrend)) {
      mod -= 15;
    }

    // 5) Stigma Rekod Jenayah Dewasa & Reputasi Keluarga Tercemar (Rekod juvana kekal dirahsiakan/ringan)
    const hasCleanId = Boolean(s.fugitive && (s.fugitive.fakeIdentityTier === 'pro' || s.fugitive.hiddenPast));
    const hasAdultRecord = Boolean(s.hasCriminalRecord || ((s.criminalRecord || 0) > 0 && s.age >= 18));
    const isHighTierOrGov = Boolean(
      career.isRare ||
      career.baseSalary >= 45000 ||
      ['government', 'law', 'finance', 'healthcare', 'education'].includes(career.industry) ||
      ['bachelor', 'master', 'phd'].includes(career.minEducation)
    );
    let penalty = 0;
    if (hasAdultRecord && !hasCleanId) {
      const recCount = Math.max(1, s.criminalRecord || 1);
      penalty += isHighTierOrGov
        ? Math.min(58, 34 + (recCount * 8))
        : Math.min(24, 12 + (recCount * 5));
    }
    if (window.Dynasty && Dynasty.getFamilyReputation && Dynasty.getFamilyReputation() < 30) {
      penalty += 15;
    }
    mod -= Math.min(62, penalty);

    // 6) Penalti Stres Tinggi (50–74%: -10% peluang; >= 75% Burnout: -15% peluang)
    const curStress = (s.alignment && s.alignment.stress) || 0;
    if (curStress >= 75) mod -= 15;
    else if (curStress >= 50) mod -= 10;

    return Utils.clamp(base + mod, 5, maxCap);
  },

  checkJobEligibility(s, career) {
    this.ensureFields(s);
    const roleLock = this.getActiveRoleLock(s);
    if (roleLock.locked) {
      return {
        ok: false,
        msg: `🔒 Anda sedang memegang jawatan ${roleLock.roleName}. Anda mesti letak jawatan atau keluar daripada mod semasa terlebih dahulu sebelum boleh memohon pekerjaan lain.`
      };
    }
    if (s.prison && s.prison.inPrison) {
      return { ok: false, msg: '⛓️ Anda berada di dalam penjara dan tidak boleh memohon kerja biasa.' };
    }
    if (s.fugitive && s.fugitive.isFugitive) {
      if (s.fugitive.fakeIdentityTier === 'cheap') {
        if (Utils.chance(0.65)) {
          s.fugitive.recaptureRisk = Utils.clamp((s.fugitive.recaptureRisk || 25) + 10, 0, 99);
          GameState.addJournalEntry(
            `🚨 Majikan mengesyaki dokumen palsu murahan anda semasa semakan latar belakang untuk jawatan ${career.title}! Risiko dikesan polis naik kepada ${s.fugitive.recaptureRisk}%.`,
            'warning'
          );
          GameState.save();
          return { ok: false, msg: '🚨 Dokumen palsu murahan anda gagal semakan latar belakang! Risiko dikesan polis meningkat.' };
        }
      } else if (s.fugitive.fakeIdentityTier !== 'pro') {
        return {
          ok: false,
          msg: '🚨 Majikan sah menolak permohonan anda kerana status buruan polis.'
        };
      }
    }
    if (s.age < 18) return { ok: false, msg: 'Pekerjaan sepenuh masa dibuka pada umur 18 tahun.' };
    if (s.education.activeStudy && s.education.activeStudy.mode === 'full_time') {
      return { ok: false, msg: 'Anda sedang belajar Sepenuh Masa! Tamatkan pengajian dahulu atau daftar Separuh Masa untuk bekerja.' };
    }
    if (s.careerMarket.appliedJobIdsThisYear.includes(career.id)) {
      return { ok: false, msg: '❌ Permohonan anda untuk jawatan ini telah ditolak / tiada maklum balas tahun ini.' };
    }
    if ((typeof s.jobAppsThisYear === 'number' ? s.jobAppsThisYear : 0) >= this.MAX_APPLICATIONS_YEAR) {
      return { ok: false, msg: 'Had Permohonan Tahun Ini Tamat. Cuba lagi tahun hadapan.' };
    }

    if (!EducationData.hasMinLevel(s.education.educationLevel, career.minEducation)) {
      const req = EducationData.LEVEL_INFO[career.minEducation];
      return { ok: false, msg: `Jawatan ini memerlukan kelayakan minimum: ${req ? req.label : career.minEducation}.` };
    }

    if (!this.isCareerFieldMatched(s, career)) {
      const fNames = (career.requiredFields || []).map(fid => {
        const f = EducationData.getField(fid);
        return f ? f.short : fid;
      }).join(' / ');
      return { ok: false, msg: `Jawatan ini memerlukan bidang pengajian: ${fNames}.` };
    }

    return { ok: true, msg: '' };
  },

  // --------------------------------------------------------------------------
  // 4B. KERJA BAWAH TANAH / TANPA DOKUMEN (KHAS PELARIAN & REKOD JENAYAH)
  // --------------------------------------------------------------------------
  UNDERGROUND_JOBS: [
    {
      id: 'ug_dishwasher',
      icon: '🍽️',
      title: 'Tukang Cuci Pinggan Dapur Belakang',
      payRatio: 0.15,
      raidChance: 0.14,
      stressGain: 4,
      healthDrop: 0,
      fameDrop: 2,
      desc: 'Menyorok di dapur lorong belakang mencuci timbunan pinggan dengan upah sekadar lepas makan.'
    },
    {
      id: 'ug_warehouse',
      icon: '📦',
      title: 'Buruh Angkat Barang Stor Gelap',
      payRatio: 0.20,
      raidChance: 0.18,
      stressGain: 6,
      healthDrop: 3,
      fameDrop: 2,
      desc: 'Kerja berat mengangkat kotak di gudang haram waktu malam tanpa sebarang dokumen pengenalan.'
    },
    {
      id: 'ug_chopshop',
      icon: '🔧',
      title: 'Pembantu Bengkel Haram / Besi Buruk',
      payRatio: 0.25,
      raidChance: 0.24,
      stressGain: 5,
      healthDrop: 1,
      fameDrop: 4,
      desc: 'Membantu meleraikan komponen besi buruk di bengkel tersembunyi dengan bayaran tunai harian.'
    }
  ],

  getUndergroundSalaryLocal(s, ugJob) {
    const c = Utils.getCountry(s.countryId);
    const entryBaseUsd = 12000 * Math.max(0.25, c.salaryMultiplier || 0.5);
    const ratio = (ugJob && ugJob.payRatio) || 0.18;
    return Math.max(50, Utils.usdToLocal(Math.round(entryBaseUsd * ratio), s.countryId));
  },

  takeUndergroundJob(ugId) {
    const s = GameState.current;
    this.ensureFields(s);
    if (s.prison && s.prison.inPrison) {
      return { ok: false, msg: 'Tidak boleh mengambil kerja bawah tanah semasa berada dalam tahanan.' };
    }
    const roleLock = this.getActiveRoleLock(s);
    if (roleLock.locked) {
      return { ok: false, msg: `Anda sedang memegang jawatan ${roleLock.roleName}. Letak jawatan dahulu sebelum bertukar kerja.` };
    }
    if (s.age < 16) {
      return { ok: false, msg: 'Umur minimum untuk kerja bawah tanah ialah 16 tahun.' };
    }
    const ug = this.UNDERGROUND_JOBS.find(x => x.id === ugId);
    if (!ug) return { ok: false, msg: 'Kerja bawah tanah tidak ditemui.' };

    const salary = this.getUndergroundSalaryLocal(s, ug);
    s.job = {
      id: ug.id,
      title: ug.title,
      icon: ug.icon,
      salary,
      years: 0,
      performance: 65,
      countryId: s.countryId,
      isUnderground: true,
      undergroundMeta: {
        raidChance: ug.raidChance,
        stressGain: ug.stressGain,
        healthDrop: ug.healthDrop,
        fameDrop: ug.fameDrop
      },
      ladder: null
    };
    GameState.addJournalEntry(
      `🕶️ Anda mula bekerja secara senyap tanpa dokumen sebagai ${ug.icon} ${ug.title} dengan upah sekadar sara hidup (${Utils.formatMoney(salary, s.countryId)}/thn).`,
      'warning'
    );
    GameState.save();
    return { ok: true, msg: `Anda mula bekerja sebagai ${ug.title}!` };
  },

  maybeTriggerUndergroundRaidEvent(s) {
    if (!s || !s.job || !s.job.isUnderground) return null;
    if (s.prison && s.prison.inPrison) return null;

    const meta = s.job.undergroundMeta || { raidChance: 0.45 };
    const isFug = Boolean(s.fugitive && s.fugitive.isFugitive);
    const heat = (s.alignment && s.alignment.notoriety) || 0;
    const baseRisk = Math.max(0.40, Math.min(0.60, (meta.raidChance || 0.20) + 0.30));
    const chance = Math.min(0.85, baseRisk + (isFug ? 0.10 : 0) + (heat > 50 ? 0.10 : 0));
    if (!Utils.chance(chance)) return null;

    const bribeCost = Math.max(Utils.usdToLocal(450, s.countryId), Math.round((s.job.salary || 1000) * 0.55));
    const jobTitle = s.job.title;

    return {
      id: `ug_raid_${s.age}_${Date.now()}`,
      icon: '🚨',
      title: 'Serbuan Polis & Perangkap Siasatan!',
      text: `Lampu biru polis berkelip di lorong belakang tempat anda bekerja sebagai ${jobTitle}! Majikan anda kelihatan cemas dan sedia menyerahkan anda kepada pihak berkuasa demi menyelamatkan dirinya sendiri.`,
      choices: [
        {
          label: '🏃 Lari Tinggalkan Lokasi',
          journalType: 'warning',
          customAction: (st) => {
            const health = (st.stats && st.stats.health) || 55;
            const curHeat = (st.alignment && st.alignment.notoriety) || 0;
            const fastVeh = (window.AssetsEngine && AssetsEngine.hasFastWorkingVehicle && AssetsEngine.hasFastWorkingVehicle(st)) ? 0.10 : 0;
            const escapeChance = Math.max(0.14, Math.min(0.62, 0.24 + (health / 260) + fastVeh - (curHeat * 0.003)));

            if (Utils.chance(escapeChance)) {
              st.job = null;
              if (window.KarmaEndings) KarmaEndings.adjustAlignment({ notoriety: 16, stress: 16 });
              GameState.adjustStats({ happiness: -8 });
              GameState.save();
              return {
                outcome: 'Anda merempuh pintu belakang dan berjaya meloloskan diri ke lorong gelap! Anda kehilangan kerja bawah tanah itu dan buruan polis semakin ketat.',
                toastType: 'culture'
              };
            }

            st.job = null;
            const extraYears = Utils.randInt(4, 8);
            if (window.PrisonFugitive && PrisonFugitive.enterPrisonState) {
              PrisonFugitive.enterPrisonState(st, 'Ditangkap Semasa Serbuan Tempat Kerja Haram', extraYears, 'maximum');
            }
            GameState.save();
            return {
              outcome: `Anda dikepung di hujung lorong dan diberkas! Mahkamah menjatuhkan hukuman penjara tambahan selama ${extraYears} tahun.`,
              toastType: 'error'
            };
          }
        },
        {
          label: '⚖️ Serah Diri Kepada Polis',
          journalType: 'warning',
          customAction: (st) => {
            st.job = null;
            const yrs = Utils.randInt(2, 5);
            if (window.PrisonFugitive && PrisonFugitive.enterPrisonState) {
              PrisonFugitive.enterPrisonState(st, 'Serah Diri Semasa Serbuan Kerja Haram', yrs, 'medium');
            }
            GameState.save();
            return {
              outcome: `Anda mengangkat tangan dan menyerah diri tanpa melawan. Anda dibawa ke balai dan dijatuhi hukuman tahanan selama ${yrs} tahun.`,
              toastType: 'warning'
            };
          }
        },
        {
          label: `💵 Rasuah Majikan / Pegawai (${Utils.formatMoney(bribeCost, s.countryId)})`,
          journalType: 'warning',
          customAction: (st) => {
            if ((st.money || 0) < bribeCost) {
              st.job = null;
              const extraYears = Utils.randInt(3, 6);
              if (window.PrisonFugitive && PrisonFugitive.enterPrisonState) {
                PrisonFugitive.enterPrisonState(st, 'Ditangkap Semasa Serbuan Kerja Haram', extraYears, 'maximum');
              }
              GameState.save();
              return {
                outcome: `Wang tunai tidak mencukupi untuk menutup mulut mereka — anda terus digari dan dijatuhi hukuman penjara ${extraYears} tahun!`,
                toastType: 'error'
              };
            }
            st.money -= bribeCost;
            if (window.KarmaEndings) KarmaEndings.adjustAlignment({ karma: -10, stress: 10 });
            if (Utils.chance(0.52)) {
              GameState.save();
              return {
                outcome: `Wang ${Utils.formatMoney(bribeCost, st.countryId)} bertukar tangan di belakang stor — mereka mengalihkan perhatian serbuan dan anda kekal bersembunyi buat setahun lagi.`,
                toastType: 'culture'
              };
            }
            st.job = null;
            const extraYears = Utils.randInt(4, 7);
            if (window.PrisonFugitive && PrisonFugitive.enterPrisonState) {
              PrisonFugitive.enterPrisonState(st, 'Serbuan Kerja Haram + Cubaan Rasuah', extraYears, 'maximum');
            }
            GameState.save();
            return {
              outcome: `Wang ${Utils.formatMoney(bribeCost, st.countryId)} dirampas sebagai bahan bukti dan anda terus digari! Hukuman penjara ditambah ${extraYears} tahun.`,
              toastType: 'error'
            };
          }
        }
      ]
    };
  },

  applyForCareer(careerId) {
    const s = GameState.current;
    this.ensureFields(s);
    const career = CareersData.CAREERS.find(c => c.id === careerId);
    if (!career) return { ok: false, msg: 'Jawatan tidak ditemui.' };

    const elig = this.checkJobEligibility(s, career);
    if (!elig.ok) return elig;

    // Tolak kuota permohonan tahunan JobHunter (maksimum 2/2)
    s.jobAppsThisYear = (typeof s.jobAppsThisYear === 'number' ? s.jobAppsThisYear : 0) + 1;
    s.careerMarket.applicationsLeft = Math.max(0, this.MAX_APPLICATIONS_YEAR - s.jobAppsThisYear);
    if (!s.careerMarket.appliedJobIdsThisYear.includes(career.id)) {
      s.careerMarket.appliedJobIdsThisYear.push(career.id);
    }

    // TAHAP 1: SARINGAN CV BERPEMBERAT (termasuk kesan PNGK & Anugerah Dekan)
    const screeningPct = this.calculateScreeningChance(s, career);
    const shortlisted = Utils.chance(screeningPct / 100);
    const cgpa = this.getEffectiveCgpa(s);

    if (!shortlisted) {
      const hasCleanId = Boolean(s.fugitive && (s.fugitive.fakeIdentityTier === 'pro' || s.fugitive.hiddenPast));
      const hasAdultRecord = Boolean(s.hasCriminalRecord || ((s.criminalRecord || 0) > 0 && s.age >= 18));
      const heat = (s.alignment && s.alignment.notoriety) || 0;
      const smarts = (s.stats && s.stats.smarts) || 50;
      const looks = (s.stats && s.stats.looks) || 50;
      const karma = (s.alignment && s.alignment.karma) || 0;
      const reason = ((hasAdultRecord || heat >= 35) && !hasCleanId)
        ? 'Gagal tapisan latar belakang kerana rekod jenayah atau pemantauan pihak berkuasa.'
        : (smarts < 45)
          ? 'Prestasi penilaian dan temu duga teknikal anda dinilai masih lemah oleh panel HR.'
          : (looks < 40)
            ? 'Imej profesional dan keyakinan diri anda kurang meyakinkan di hadapan penemu duga.'
            : (karma < 0)
              ? 'Semakan rujukan peribadi memberikan maklum balas negatif terhadap perwatakan anda.'
              : (cgpa !== null && cgpa < 3.0)
                ? 'Keputusan akademik terdahulu anda tidak melepasi tahap saringan majikan.'
                : Utils.pick(this.REJECTION_SCENARIOS);
      const hapDip = Utils.randInt(2, 4);
      GameState.adjustStats({ happiness: -hapDip });
      GameState.addJournalEntry(
        `📄 Permohonan JobHunter ditolak (${career.title}): ${reason}`,
        'warning'
      );
      GameState.save();
      return {
        ok: false,
        rejected: true,
        screeningPct,
        msg: `❌ Ditolak / Tiada Maklum Balas (${career.title}): ${reason}`
      };
    }

    // TAHAP 2: LULUS SARINGAN CV -> BUKA MODAL TEMU DUGA KERJA KOMPETITIF!
    GameState.save();
    return {
      ok: true,
      screeningPct,
      interviewEvent: this.buildInterviewEvent(s, career),
      msg: `🎉 CV anda disenarai pendek untuk ${career.title}! Bersedia untuk Temu Duga Kerja.`
    };
  },

  buildInterviewEvent(s, career) {
    const q = Utils.pick(CareersData.INTERVIEW_QUESTIONS);
    const salaryLocal = this.getCareerSalaryLocal(s, career, 0);
    const shuffledOpts = [...q.options].sort(() => Math.random() - 0.5);
    const cgpa = this.getEffectiveCgpa(s);

    return {
      id: `interview_${career.id}_${Date.now()}`,
      icon: career.icon,
      title: `Temu Duga Kerja: ${career.title}`,
      text: `${q.prompt}\n\n(Gaji ditawarkan: ${Utils.formatMoney(salaryLocal, s.countryId)}/thn • Persaingan sengit dengan calon lain!${cgpa !== null ? ` • PNGK Anda: ${cgpa.toFixed(2)}${cgpa >= 4.0 ? ' 🏅 Anugerah Dekan' : ''}` : ''})`,
      choices: shuffledOpts.map(opt => ({
        label: opt.label,
        hint: 'Jawapan temu duga',
        journalType: 'culture',
        customAction: () => {
          // Tahap 2 RNG Kompetitif dengan kesan PNGK, Anugerah Dekan & Penalti Stres
          let offerChance;
          if (opt.bonus >= 15) {
            offerChance = Utils.randInt(65, 80);
          } else if (opt.bonus >= 0) {
            offerChance = Utils.randInt(25, 40);
          } else {
            offerChance = Utils.randInt(5, 10);
          }

          if (cgpa !== null) {
            if (cgpa >= 4.0) offerChance += Utils.randInt(25, 35);
            else if (cgpa >= 3.0) offerChance += Math.round((cgpa - 3.0) * 8);
            else offerChance -= Utils.randInt(25, 40);
          }

          // Penalti Stres Tinggi (50–74%: -10%; >= 75%: -15%)
          const curStress = (s.alignment && s.alignment.stress) || 0;
          if (curStress >= 75) offerChance -= 15;
          else if (curStress >= 50) offerChance -= 10;

          offerChance = Utils.clamp(offerChance, 5, cgpa !== null && cgpa >= 4.0 ? 96 : 88);

          const hired = Utils.chance(offerChance / 100);
          if (hired) {
            const res = this.hireCharacter(s, career, opt.bonus);
            return { outcome: res.msg, toastType: 'success' };
          }

          // Gagal temu duga: kunci jawatan untuk tahun ini + pelipur lara +1 Kepintaran sekali-sekala
          if (!s.careerMarket.appliedJobIdsThisYear.includes(career.id)) {
            s.careerMarket.appliedJobIdsThisYear.push(career.id);
          }
          const learned = Utils.chance(0.45);
          GameState.adjustStats({ happiness: -3, smarts: learned ? 1 : 0 });
          const failReasons = (cgpa !== null && cgpa < 3.0)
            ? [
                `PNGK bawah 3.00 (${cgpa.toFixed(2)}) tidak melepasi saringan akhir majikan untuk jawatan ${career.title}.`,
                `Panel temu duga bimbang dengan pencapaian akademik anda (PNGK ${cgpa.toFixed(2)}) dan memilih calon berprestasi lebih tinggi.`
              ]
            : [
                `Panel temu duga berpuas hati dengan anda, tetapi syarikat memilih calon dalaman pada saat akhir untuk jawatan ${career.title}.`,
                `Persaingan sangat ketat! Syarikat memilih calon lain yang menawarkan jangkaan gaji lebih rendah untuk ${career.title}.`,
                `Selepas seminggu menunggu, HR memaklumkan posisi ${career.title} diberikan kepada calon yang mempunyai lebih banyak pengalaman.`
              ];
          const failMsg = Utils.pick(failReasons) + (learned ? ' Pengalaman temu duga tetap mengasah minda anda (Kepintaran +1%).' : '');
          GameState.save();
          return {
            outcome: failMsg,
            toastType: 'error'
          };
        }
      }))
    };
  },

  hireCharacter(s, career, bonusScore = 0) {
    const c = Utils.getCountry(s.countryId);
    // Pemegang PhD atau sijil relevan boleh bermula terus pada tangga pangkat ke-2!
    let startRank = 0;
    if (s.education.educationLevel === 'phd' && career.promotionLadder.length > 2) startRank = 1;
    const rankTitle = career.promotionLadder[startRank] || career.title;
    const salaryLocal = this.getCareerSalaryLocal(s, career, startRank);

    s.job = {
      id: career.id,
      careerId: career.id,
      title: rankTitle,
      baseTitle: career.title,
      industry: career.industry,
      icon: career.icon,
      salary: salaryLocal,
      years: 0,
      performance: Utils.clamp(65 + Math.round(bonusScore / 4), 55, 88),
      rankIndex: startRank,
      ladder: [...career.promotionLadder],
      stressLevel: career.stressLevel || 50,
      countryId: s.countryId
    };

    s.yearsInCurrentJob = 0;
    s.retired = false;
    s.isRetired = false;
    if (window.CharacterStatus) CharacterStatus.recordPeakRole(s);
    if (window.Utils && Utils.playTone) Utils.playTone('achievement');
    GameState.addJournalEntry(
      `🎉 TAWARAN KERJA DITERIMA! Anda rasmi memulakan tugas sebagai ${rankTitle} di ${s.city}, ${c.name} dengan gaji ${Utils.formatMoney(salaryLocal, s.countryId)}/thn!`,
      'milestone'
    );
    GameState.adjustStats({ happiness: 14 });
    if (career.isRare && window.KarmaEndings) {
      KarmaEndings.addHighlight(career.icon, `Berjaya menyandang kerjaya nadir: ${rankTitle}`);
    }
    GameState.save();
    return { ok: true, msg: `🎉 TAHNIAH! Surat tawaran diterima — anda kini ${rankTitle} dengan gaji ${Utils.formatMoney(salaryLocal, s.countryId)}/thn!` };
  },

  networkAtWork() {
    const s = GameState.current;
    if (!s.job) return { ok: false, msg: 'Tiada pekerjaan aktif.' };
    if (s.yearlyActions.workNetwork) return { ok: false, msg: 'Anda sudah membina rangkaian kerja tahun ini.' };
    s.yearlyActions.workNetwork = true;

    s.job.performance = Utils.clamp((s.job.performance || 65) + Utils.randInt(6, 12), 0, 100);
    GameState.adjustStats({ happiness: 6, adaptation: 4 });
    if (window.Dynasty) Dynasty.adjustReputation(2);
    GameState.addJournalEntry(
      `🤝 Anda aktif membina rangkaian profesional bersama pengarah dan rakan industri sebagai ${s.job.title} (Prestasi ${s.job.performance}%).`,
      'culture'
    );
    GameState.save();
    return { ok: true, msg: 'Rangkaian profesional diperkukuh & peluang kenaikan pangkat meningkat!' };
  },

  tryPromote(s, forceAttempt = false) {
    if (!s || !s.job || !Array.isArray(s.job.ladder)) return { ok: false, msg: 'Tiada laluan pangkat lanjut.' };
    const nextIdx = (s.job.rankIndex || 0) + 1;
    if (nextIdx >= s.job.ladder.length) {
      return { ok: false, msg: 'Anda sudah berada di puncak tertinggi tangga kerjaya ini!' };
    }
    if (!forceAttempt && (s.job.performance < 78 || s.job.years < (nextIdx * 2))) {
      return { ok: false, msg: 'Teruskan prestasi cemerlang untuk layak naik pangkat.' };
    }

    s.job.rankIndex = nextIdx;
    const newTitle = s.job.ladder[nextIdx];
    s.job.title = newTitle;
    const bump = Utils.randInt(18, 30);
    s.job.salary = Math.round(s.job.salary * (1 + bump / 100));
    s.job.performance = 70;

    // Jawatan berprestij tinggi menaikkan Reputasi Keluarga!
    const isPrestigious = /Profesor|Ketua Saintis|Hakim|Pengarah|CTO|CFO|CISO|CEO|CPO|CMO|CHRO|COO|Duta|Kapten|Komander|Naib Canselor|Legenda/i.test(newTitle);
    if (isPrestigious && window.Dynasty) {
      Dynasty.adjustReputation(6);
    }
    if (window.Utils && Utils.playTone) Utils.playTone('achievement');
    GameState.adjustStats({ happiness: 15 });
    GameState.addJournalEntry(
      `🏆 NAIK PANGKAT! Anda dinaikkan pangkat menjadi ${newTitle} dengan gaji baharu ${Utils.formatMoney(s.job.salary, s.countryId)}/thn (+${bump}%)${isPrestigious ? ' — Reputasi Keluarga +6%!' : '!'}`,
      'milestone'
    );
    GameState.save();
    return { ok: true, msg: `🏆 Naik pangkat ke ${newTitle} (+${bump}% gaji)!` };
  },

  // --------------------------------------------------------------------------
  // 6. SISTEM BERSARA & PENCEN ("BERSARA & PENCEN")
  // --------------------------------------------------------------------------
  canRetire(s = GameState.current) {
    if (!s || !s.job) return { ok: false, reason: 'Anda tidak memegang pekerjaan aktif.' };
    this.ensureFields(s);
    const totalYrs = Math.max(s.totalYearsWorked || 0, s.job.years || 0);
    if (s.age >= 55 || totalYrs >= 20) {
      return { ok: true, totalYrs };
    }
    return {
      ok: false,
      totalYrs,
      reason: `Layak bersara penuh pada umur 55+ tahun atau 20+ tahun berkhidmat (Kini: Umur ${s.age}, ${totalYrs} tahun berkhidmat).`
    };
  },

  CONTRACT_JOBS: [
    { id: 'contract_consultant', icon: '💼', title: 'Perunding Kontrak', desc: 'Khidmat nasihat profesional secara kontrak fleksibel.', mult: 1.25 },
    { id: 'contract_lecturer', icon: '🎓', title: 'Tutor / Pensyarah Sambilan', desc: 'Mengajar dan membimbing pelajar secara kontrak sambilan.', mult: 1.12 },
    { id: 'contract_supervisor', icon: '📋', title: 'Penyelia Kontrak', desc: 'Menyelia operasi projek dan pasukan secara berkala.', mult: 1.0 },
    { id: 'contract_assistant', icon: '🤝', title: 'Pembantu Am Kontrak', desc: 'Tugasan pentadbiran dan sokongan operasi kontrak.', mult: 0.85 }
  ],

  getContractJobsForPlayer(s = GameState.current) {
    if (!s) return [];
    this.ensureFields(s);
    const c = Utils.getCountry(s.countryId);
    const lvl = (s.education && s.education.educationLevel) || (s.education && s.education.hasDegree ? 'bachelor' : s.education && s.education.hasHighSchool ? 'high_school' : 'none');
    const eduBaseUsdMap = {
      none: 9000,
      primary: 9500,
      high_school: 14000,
      diploma: 21000,
      bachelor: 32000,
      master: 46000,
      phd: 64000
    };
    const eduLabelMap = {
      none: 'Tiada/Rendah',
      primary: 'Sekolah Rendah',
      high_school: 'Menengah',
      diploma: 'Diploma',
      bachelor: 'Ijazah',
      master: 'Sarjana',
      phd: 'PhD'
    };
    const baseUsd = eduBaseUsdMap[lvl] || 11000;
    const econScale = Math.max(0.45, c.salaryMultiplier || 0.7);
    const eduLabel = eduLabelMap[lvl] || 'Asas';
    return this.CONTRACT_JOBS.map(j => ({
      ...j,
      eduLabel,
      salary: Utils.usdToLocal(Math.round(baseUsd * j.mult * econScale), s.countryId)
    }));
  },

  acceptContractJob(contractId, s = GameState.current) {
    if (!s) return { ok: false, msg: 'Tiada watak aktif.' };
    if (s.age < 60) return { ok: false, msg: 'Kerja kontrak pesara dibuka pada umur 60+.' };
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Tidak boleh mengambil kerja kontrak semasa dalam penjara.' };
    if (s.job) return { ok: false, msg: 'Tamatkan kerja semasa dahulu sebelum mengambil kontrak baharu.' };
    const list = this.getContractJobsForPlayer(s);
    const picked = list.find(j => j.id === contractId);
    if (!picked) return { ok: false, msg: 'Tawaran kerja kontrak tidak ditemui.' };

    s.job = {
      id: picked.id,
      title: picked.title,
      icon: picked.icon,
      salary: picked.salary,
      years: 0,
      performance: 75,
      countryId: s.countryId,
      isContract: true,
      ladder: [picked.title],
      rankIndex: 0
    };
    s.retired = true;
    s.isRetired = true;
    GameState.addJournalEntry(
      `📋 Anda menerima Kerja Kontrak sebagai ${picked.title} (Gaji ${Utils.formatMoney(picked.salary, s.countryId)}/thn berdasarkan kelulusan ${picked.eduLabel}). Pencen sedia ada kekal aktif!`,
      'milestone'
    );
    GameState.save();
    return { ok: true, msg: `Berjaya memulakan ${picked.title}! Pencen anda kekal aktif.` };
  },

  retireFromJob(s = GameState.current, { isMandatory = false } = {}) {
    if (!s || !s.job) return { ok: false, msg: 'Tiada pekerjaan aktif untuk bersara.' };
    this.ensureFields(s);
    if (s.job.isContract) {
      const cTitle = s.job.title;
      s.job = null;
      s.yearsInCurrentJob = 0;
      s.retired = true;
      s.isRetired = true;
      GameState.addJournalEntry(
        `🏖️ Anda menamatkan kerja kontrak (${cTitle}) dan kembali berehat sebagai Pesara. Pencen tahunan anda kekal aktif.`,
        'culture'
      );
      GameState.save();
      return {
        ok: true,
        lumpSum: 0,
        pensionAnnual: s.pensionAnnual || 0,
        msg: `🏖️ Kontrak ${cTitle} ditamatkan! Pencen tahunan anda kekal aktif.`
      };
    }

    const elig = this.canRetire(s);
    if (!isMandatory && !elig.ok) {
      return { ok: false, msg: elig.reason };
    }

    const c = Utils.getCountry(s.countryId);
    const jobTitle = s.job.title;
    const jobIcon = s.job.icon || '💼';
    const finalSalary = s.job.salary || 0;
    const jobYrs = s.job.years || 0;
    const totalYrs = Math.max(s.totalYearsWorked || 0, jobYrs);

    // 1. Bayar keluar simpanan persaraan (KWSP/EPF) + ganjaran perkhidmatan
    const epfLumpSum = Math.max(0, Math.round(s.retirementFund || 0));
    const gratuity = Math.round(finalSalary * Math.min(1.5, totalYrs * 0.04));
    const totalLumpSum = epfLumpSum + gratuity;
    s.money = Math.round((s.money || 0) + totalLumpSum);
    s.retirementFund = 0;

    // 2. Pencen Tahunan Berulang (wajib pada umur >= 60 atau >= 55 & >= 15 thn bekerja)
    let pensionAnnual = s.pensionAnnual || 0;
    let pensionPct = 0;
    if ((s.age >= 60 && totalYrs >= 1) || (s.age >= 55 && totalYrs >= 15)) {
      pensionPct = totalYrs >= 15
        ? Math.min(60, Math.max(30, 30 + Math.round((totalYrs - 15) * 1.5)))
        : Math.min(28, Math.max(12, 10 + totalYrs * 1.2));
      const rawPension = Math.round(finalSalary * (pensionPct / 100));
      const maxCap = Utils.usdToLocal(180000, s.countryId);
      pensionAnnual = Math.min(maxCap, rawPension);
      s.pensionAnnual = Math.max(s.pensionAnnual || 0, pensionAnnual);
    }

    // 3. Rekod dalam Sejarah Kerjaya
    s.careerHistory.unshift({
      title: jobTitle,
      icon: jobIcon,
      years: jobYrs,
      totalYearsWorked: totalYrs,
      finalSalary,
      lumpSumPaid: totalLumpSum,
      pensionAnnual: s.pensionAnnual || 0,
      yearRetired: s.year,
      ageRetired: s.age,
      countryId: s.countryId
    });

    // 4. Kemas kini status Pesara & kurangkan stres
    s.job = null;
    s.yearsInCurrentJob = 0;
    s.retired = true;
    s.isRetired = true;
    if (s.alignment) {
      s.alignment.stress = Utils.clamp((s.alignment.stress || 0) - 18, 0, 100);
    }
    GameState.adjustStats({ happiness: 14 });
    if (window.CharacterStatus) CharacterStatus.recordPeakRole(s);

    const schemeName = c.retirementScheme || 'Tabung Persaraan';
    const pensionNote = s.pensionAnnual > 0
      ? ` Anda turut menerima Pencen Tahunan sebanyak ${Utils.formatMoney(s.pensionAnnual, s.countryId)}/thn (${Math.round(pensionPct)}% gaji akhir) sepanjang hayat!`
      : '';

    GameState.addJournalEntry(
      `🏖️ ${isMandatory ? 'BERSARA WAJIB (UMUR 60+)' : 'BERSARA RASMI'}: Selepas ${totalYrs} tahun berkhidmat, anda bersara daripada jawatan ${jobTitle} pada usia ${s.age} tahun. Bayaran sekali gus (${schemeName} + Ganjaran) berjumlah ${Utils.formatMoney(totalLumpSum, s.countryId)} telah dikreditkan ke akaun anda.${pensionNote}`,
      'milestone'
    );
    GameState.save();
    return {
      ok: true,
      lumpSum: totalLumpSum,
      pensionAnnual: s.pensionAnnual || 0,
      msg: `🏖️ Selamat bersara! ${Utils.formatMoney(totalLumpSum, s.countryId)} dikreditkan${s.pensionAnnual > 0 ? ` + Pencen ${Utils.formatMoney(s.pensionAnnual, s.countryId)}/thn` : ''}!`
    };
  },

  checkMandatoryRetirementEvent(s = GameState.current) {
    if (!s || !s.job || (s.prison && s.prison.inPrison)) return null;
    this.ensureFields(s);
    // Langkau persaraan wajib bagi pemilik perniagaan/CEO/ahli politik dalam Mod Khas
    if (s.activeSpecialMode && ['politics', 'ceo'].includes(s.activeSpecialMode.modeId)) return null;

    const targetAge = Math.max(60, s.mandatoryRetirementAge || 60);
    if (s.age < targetAge) return null;

    const jobTitle = s.job.title;
    const totalYrs = Math.max(s.totalYearsWorked || 0, s.job.years || 0);
    const canExtend = s.age < 65;

    return {
      id: `mandatory_retire_${s.age}_${Date.now()}`,
      icon: '🏖️',
      title: 'Umur Persaraan Rasmi',
      text: `Anda telah mencapai usia ${s.age} tahun sebagai ${jobTitle} (${totalYrs} tahun berkhidmat). Mengikut polisi perkhidmatan, anda telah tiba pada umur persaraan wajib.${canExtend ? ' Pihak pengurusan menawarkan pilihan untuk bersara penuh dengan ganjaran & pencen, atau memohon sambungan kontrak jangka pendek (2 tahun).' : ' Anda telah mencapai had maksimum umur perkhidmatan (65 tahun) untuk bersara rasmi.'}`,
      choices: [
        {
          label: '🏖️ Bersara Rasmi Sekarang (Terima Simpanan & Pencen)',
          hint: 'Keluarkan simpanan persaraan sekali gus + pencen tahunan (jika layak)',
          customAction: (state) => {
            const res = this.retireFromJob(state, { isMandatory: true });
            return { outcome: res.msg, toastType: 'success' };
          }
        },
        ...(canExtend ? [{
          label: '📝 Mohon Sambung Kontrak (2 Tahun Lagi)',
          hint: 'Teruskan bekerja & kumpul caruman persaraan sehingga umur ' + Math.min(65, s.age + 2) + ' tahun',
          customAction: (state) => {
            state.mandatoryRetirementAge = Math.min(65, state.age + 2);
            if (state.job) state.job.performance = Utils.clamp((state.job.performance || 70) + 4, 0, 100);
            return {
              outcome: `Permohonan sambungan kontrak anda sebagai ${jobTitle} diluluskan sehingga umur ${state.mandatoryRetirementAge} tahun!`,
              toastType: 'culture'
            };
          }
        }] : [])
      ]
    };
  }
};
