/* ==========================================================================
   WorldLife — Pusat Sumber Kebenaran Tunggal (Single Source of Truth)
   Diselaraskan 100% dengan Enjin Mod Khas "Peluang Sekali Seumur Hidup",
   Kerjaya Rasmi, Pendidikan PhD, Aset, Penjara & Pelarian (Bahasa Melayu)
   ========================================================================== */

window.CharacterStatus = {
  // --------------------------------------------------------------------------
  // 1. PEKERJAAN & PERANAN PAPARAN (URUTAN KEUTAMAAN KETAT — SIFAR KONFLIK)
  // --------------------------------------------------------------------------
  getDisplayOccupation(s) {
    if (!s) {
      return { title: 'Tiada Pekerjaan', category: 'none', badge: '—', secondaryRole: null, icon: '👤', modeId: null };
    }
    const secRoles = [];

    if (s.education && s.education.activeStudy && s.education.activeStudy.mode === 'part_time') {
      const lvl = (window.EducationData && EducationData.LEVEL_INFO[s.education.activeStudy.level]) || { short: 'Pengajian' };
      secRoles.push(`Pelajar Separuh Masa ${lvl.short}`);
    }

    // KEUTAMAAN 1: PENJARA (Banduan)
    if (s.prison && s.prison.inPrison) {
      const secLbl = (window.PrisonFugitive && PrisonFugitive.SECURITY_LABELS[s.prison.securityLevel])
        ? PrisonFugitive.SECURITY_LABELS[s.prison.securityLevel].name
        : 'Penjara';
      const gangStr = s.prison.gangName ? `Ahli ${s.prison.gangName}` : null;
      return {
        title: `Banduan (${secLbl})`,
        category: 'prison',
        badge: `⛓️ Penjara • Baki ${s.prison.yearsLeft} thn`,
        secondaryRole: gangStr,
        icon: '⛓️',
        modeId: 'prison'
      };
    }

    // KEUTAMAAN 2: MOD KHAS AKTIF ("Peluang Sekali Seumur Hidup")
    if (s.activeSpecialMode && window.SpecialModesEngine) {
      const info = SpecialModesEngine.getActiveInfo(s);
      if (info) {
        if (s.job && s.job.title) secRoles.unshift(s.job.title);
        return {
          title: info.rank.title,
          category: info.def.id,
          badge: `${info.def.icon} ${info.def.shortLabel} • ${info.def.metric1.label} ${info.state.metric1}%`,
          secondaryRole: secRoles.length > 0 ? secRoles.join(' • ') : null,
          icon: info.def.icon,
          modeId: info.def.id
        };
      }
    }

    // KEUTAMAAN 3: KERJAYA RASMI (Standard Career)
    if (s.job && s.job.title) {
      if (s.socialMedia && s.socialMedia.hasAccount && s.socialMedia.followers >= 25000) {
        secRoles.push('Pempengaruh Sosial');
      }
      return {
        title: s.job.title,
        category: 'career',
        badge: `${s.job.icon || '💼'} Kerjaya Rasmi`,
        secondaryRole: secRoles.length > 0 ? secRoles.join(' • ') : null,
        icon: s.job.icon || '💼',
        modeId: 'career'
      };
    }

    // KEUTAMAAN 4: PELAJAR SEPENUH MASA (Universiti / PhD / Sekolah)
    if (s.education && s.education.activeStudy) {
      const st = s.education.activeStudy;
      const lvl = (window.EducationData && EducationData.LEVEL_INFO[st.level]) || { short: 'Pengajian' };
      return {
        title: `Pelajar ${lvl.short} ${st.fieldName || ''}`.trim(),
        category: 'education',
        badge: `🎓 ${st.mode === 'part_time' ? 'Separuh Masa' : 'Sepenuh Masa'}`,
        secondaryRole: st.institution || null,
        icon: '🎓',
        modeId: 'education'
      };
    }
    if (s.education && s.education.stage === 'university' && s.education.universityName) {
      return {
        title: `Pelajar di ${s.education.universityName}`,
        category: 'education',
        badge: '🎓 Mahasiswa',
        secondaryRole: null,
        icon: '🎓',
        modeId: 'education'
      };
    }
    if (s.education && s.education.schoolName) {
      return {
        title: s.education.schoolName,
        category: 'school',
        badge: '🏫 Pelajar Sekolah',
        secondaryRole: null,
        icon: '🏫',
        modeId: 'school'
      };
    }

    // KEUTAMAAN 5: PESARA (Retired)
    if (s.retired || s.isRetired) {
      return {
        title: 'Pesara',
        category: 'retired',
        badge: '🌅 Bersara',
        secondaryRole: secRoles.length > 0 ? secRoles.join(' • ') : null,
        icon: '🌅',
        modeId: 'retired'
      };
    }

    // Pempengaruh Sosial (jika pengikut >= 50k tanpa kerja lain)
    if (s.socialMedia && s.socialMedia.hasAccount && s.socialMedia.followers >= 50000) {
      return {
        title: 'Pempengaruh & Pencipta Konten',
        category: 'influencer',
        badge: '📱 Media Sosial',
        secondaryRole: secRoles.length > 0 ? secRoles.join(' • ') : null,
        icon: '📱',
        modeId: 'influencer'
      };
    }

    // KEUTAMAAN 6: FALLBACK
    if (s.age < 5) {
      return { title: 'Kanak-kanak', category: 'child', badge: '👶 Awal Usia', secondaryRole: null, icon: '👶', modeId: null };
    }
    return {
      title: 'Tiada Pekerjaan',
      category: 'unemployed',
      badge: '📄 Belum Bekerja',
      secondaryRole: secRoles.length > 0 ? secRoles.join(' • ') : null,
      icon: '👤',
      modeId: null
    };
  },

  // --------------------------------------------------------------------------
  // 2. JUMLAH PENDAPATAN TAHUNAN BERSEPADU (PAPARAN = KREDIT AGE-UP 100%)
  // --------------------------------------------------------------------------
  getTotalAnnualIncome(s) {
    if (!s) {
      return { grossLocal: 0, netLocal: 0, taxLocal: 0, retireContribLocal: 0, breakdown: [] };
    }
    const c = Utils.getCountry(s.countryId);
    const taxRate = c.taxRate || 0.15;
    const breakdown = [];
    let grossLocal = 0;
    let taxLocal = 0;
    let retireContribLocal = 0;

    if (s.prison && s.prison.inPrison) {
      return { grossLocal: 0, netLocal: 0, taxLocal: 0, retireContribLocal: 0, breakdown: [] };
    }

    // 1) Gaji Kerjaya Rasmi (~12% caruman KWSP/EPF ke retirementFund)
    if (s.job && s.job.salary > 0) {
      const g = Math.round(s.job.salary);
      const t = Math.round(g * taxRate);
      const ret = Math.round(g * 0.12);
      grossLocal += g;
      taxLocal += t;
      retireContribLocal += ret;
      breakdown.push({ label: s.job.title, gross: g, net: g - t - Math.round(ret * 0.5), icon: s.job.icon || '💼' });
    }

    // 2) Pendapatan Mod Khas Aktif (Politik / CEO / Trader Pro / Selebriti / Atlet Pro)
    if (s.activeSpecialMode && window.SpecialModesEngine) {
      const info = SpecialModesEngine.getActiveInfo(s);
      if (info) {
        const usd = SpecialModesEngine.getActiveAnnualUsd(s);
        const g = Utils.usdToLocal(usd, s.countryId);
        const t = Math.round(g * (taxRate * 0.75));
        grossLocal += g;
        taxLocal += t;
        breakdown.push({ label: `${info.rank.title}`, gross: g, net: g - t, icon: info.def.icon });
      }
    }

    // 3) Pencen Bekas Pemimpin (jika bersara bersih 5+ tahun dalam Politik)
    if (s.formerLeaderPension > 0) {
      const g = Math.round(s.formerLeaderPension);
      grossLocal += g;
      breakdown.push({ label: 'Pencen Bekas Pemimpin', gross: g, net: g, icon: '🏛️' });
    }

    // 4) Pendapatan Pasif Media Sosial (jika >= 10,000 pengikut)
    if (s.socialMedia && s.socialMedia.hasAccount && s.socialMedia.followers >= 10000) {
      const usdSponsor = Math.min(85000, Math.round((s.socialMedia.followers / 10000) * 1800));
      const g = Utils.usdToLocal(usdSponsor, s.countryId);
      grossLocal += g;
      breakdown.push({ label: 'Tajaan & Iklan Media Sosial', gross: g, net: g, icon: '📱' });
    }

    // 5) Pencen Persaraan (dibayar apabila bersara & tiada kerja aktif supaya tiada pertindihan gaji+pencen)
    if ((s.retired || s.isRetired) && !s.job && s.pensionAnnual > 0) {
      const g = Math.round(s.pensionAnnual);
      grossLocal += g;
      breakdown.push({ label: 'Pencen Persaraan', gross: g, net: g, icon: '🌅' });
    }

    // 6) Pendapatan Pasif Aset (Sewa Hartanah & Dividen Pelaburan)
    if (window.AssetsEngine && AssetsEngine.getAssetCashflowSummary) {
      const aSum = AssetsEngine.getAssetCashflowSummary(s);
      if (aSum.rentalGross > 0) {
        grossLocal += aSum.rentalGross;
        breakdown.push({ label: 'Sewa Hartanah', gross: aSum.rentalGross, net: aSum.rentalGross, icon: '🏠' });
      }
      if (aSum.dividendGross > 0) {
        grossLocal += aSum.dividendGross;
        breakdown.push({ label: 'Dividen Pelaburan', gross: aSum.dividendGross, net: aSum.dividendGross, icon: '📈' });
      }
    }

    const netLocal = breakdown.reduce((acc, b) => acc + b.net, 0);
    return { grossLocal, netLocal, taxLocal, retireContribLocal, breakdown };
  },

  // --------------------------------------------------------------------------
  // 3. NAMA PAPARAN LENGKAP DENGAN GELARAN (YAB / YB / Dr. / ALIAS PELARIAN)
  // --------------------------------------------------------------------------
  evaluatePosthumousDegree(s) {
    if (!s || s.alive || !s.education) return null;
    if (s.education.posthumousAward) return s.education.posthumousAward;
    const st = s.education.activeStudy;
    if (!st || !['bachelor', 'master', 'phd'].includes(st.level)) return null;

    const fieldName = st.fieldName || 'Pengajian Tinggi';
    const institution = st.institution || 'Universiti';
    const baseName = s.name || '';
    const drName = /^Dr\.\s/i.test(baseName) ? baseName : `Dr. ${baseName}`;

    let award = null;
    if (st.level === 'phd') {
      award = {
        level: 'phd',
        icon: '🎓',
        label: 'Anugerah PhD Anumerta',
        grantsDrTitle: true,
        fieldName,
        institution,
        displayLine: `Anugerah PhD Anumerta — ${drName}`,
        legacyNote: `Anugerah PhD Anumerta (${fieldName}) dianugerahkan oleh ${institution} sebagai penghormatan atas dedikasi penyelidikan & akademik.`
      };
    } else if (st.level === 'master') {
      award = {
        level: 'master',
        icon: '🏛️',
        label: 'Ijazah Sarjana Anumerta',
        grantsDrTitle: false,
        fieldName,
        institution,
        displayLine: `Ijazah Sarjana Anumerta (${fieldName})`,
        legacyNote: `Ijazah Sarjana Anumerta (${fieldName}) dianugerahkan oleh ${institution} atas kesungguhan pengajian sebelum pemergiannya.`
      };
    } else {
      award = {
        level: 'bachelor',
        icon: '🎓',
        label: 'Ijazah Sarjana Muda Anumerta',
        grantsDrTitle: false,
        fieldName,
        institution,
        displayLine: `Ijazah Sarjana Muda Anumerta (${fieldName})`,
        legacyNote: `Ijazah Sarjana Muda Anumerta (${fieldName}) dianugerahkan oleh ${institution} atas usaha akademiknya.`
      };
    }

    s.education.posthumousAward = award;
    return award;
  },

  getDisplayNameWithTitles(s) {
    if (!s) return '';
    let baseName = s.name || '';
    const prefixes = [];

    if (s.activeSpecialMode && window.SpecialModesEngine && !(s.prison && s.prison.inPrison)) {
      const info = SpecialModesEngine.getActiveInfo(s);
      if (info && info.rank && info.rank.prefix) {
        prefixes.push(info.rank.prefix);
      }
    }

    const hasPosthumousDr = Boolean(!s.alive && s.education && s.education.posthumousAward && s.education.posthumousAward.grantsDrTitle);
    const hasDr = Boolean(s.education && (s.education.hasDoctorateTitle || s.education.educationLevel === 'phd' || hasPosthumousDr));
    if (hasDr && !/^Dr\.\s/i.test(baseName)) {
      prefixes.push('Dr.');
    }

    return prefixes.length > 0 ? `${prefixes.join(' ')} ${baseName}` : baseName;
  },

  // --------------------------------------------------------------------------
  // 4. PERALIHAN MOD YANG BERSIH
  // --------------------------------------------------------------------------
  syncCharacterModeTransitions(s, transition) {
    if (!s) return;
    GameState.ensureUpgradedState();

    if (transition === 'enter_prison') {
      if (s.job) {
        GameState.addJournalEntry(`🚪 Jawatan anda sebagai ${s.job.title} ditamatkan serta-merta kerana sabitan penjara.`, 'warning');
        s.job = null;
      }
      if (s.activeSpecialMode && window.SpecialModesEngine) {
        const info = SpecialModesEngine.getActiveInfo(s);
        if (info) {
          if (!s.exitedModeIds.includes(info.def.id)) s.exitedModeIds.push(info.def.id);
          GameState.addJournalEntry(`⛓️ Anda dilucutkan daripada ${info.def.title} (${info.rank.title}) akibat sabitan penjara — mod ini dikunci selamanya.`, 'warning');
        }
        s.activeSpecialMode = null;
      }
    } else if (transition === 'enter_career') {
      s.retired = false;
      s.isRetired = false;
    } else if (transition === 'quit_job') {
      s.job = null;
    } else if (transition === 'retire') {
      if (window.EduCareerEngine && EduCareerEngine.retireFromJob) {
        EduCareerEngine.retireFromJob(s);
      } else {
        const inc = this.getTotalAnnualIncome(s);
        s.pensionAnnual = Math.max(Utils.usdToLocal(6000, s.countryId), Math.round(inc.grossLocal * 0.35));
        s.job = null;
        s.retired = true;
        s.isRetired = true;
      }
    }

    this.recordPeakRole(s);
  },

  recordPeakRole(s) {
    if (!s) return;
    const occ = this.getDisplayOccupation(s);
    if (!occ || ['none', 'unemployed', 'child', 'school'].includes(occ.category)) return;
    const isSpecial = Boolean(s.activeSpecialMode && occ.modeId === s.activeSpecialMode.modeId);
    const newWeight = isSpecial ? (60 + (s.activeSpecialMode.rankIndex || 0) * 10) : (occ.category === 'career' ? 35 : 15);
    if (!s.peakRole || newWeight >= (s.peakRoleWeight || 0)) {
      s.peakRole = occ.title;
      s.peakRoleIcon = occ.icon;
      s.peakRoleWeight = newWeight;
    }
  },

  // --------------------------------------------------------------------------
  // 5. MIGRASI AUTOMATIK SAVE LAMA (reconcileCharacterState)
  // --------------------------------------------------------------------------
  reconcileCharacterState(s) {
    if (!s || typeof s !== 'object') return s;
    if (window.SpecialModesEngine && SpecialModesEngine.ensureFields) {
      SpecialModesEngine.ensureFields(s);
    }
    if (window.EduCareerEngine && EduCareerEngine.ensureFields) {
      EduCareerEngine.ensureFields(s);
    }
    if (window.PrisonFugitive && PrisonFugitive.ensureFields) {
      PrisonFugitive.ensureFields(s);
    }
    if (window.AssetsEngine && AssetsEngine.ensureFields) {
      AssetsEngine.ensureFields(s);
    }
    this.recordPeakRole(s);
    return s;
  }
};
