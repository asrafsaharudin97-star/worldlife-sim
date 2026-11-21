/* ==========================================================================
   WorldLife — Pusat Sumber Kebenaran Tunggal (Single Source of Truth)
   Penyelarasan Pekerjaan, Gelaran, Pendapatan Tahunan, Peralihan Mod & Migrasi Save
   Bahasa Melayu
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

    // Semak peranan sampingan (Pelajar Separuh Masa, Laman Sosial aktif, dll.)
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

    // KEUTAMAAN 2: MOD KHAS AKTIF (Politik > Mafia > Pelakon > Artis)
    const activeSpecial = [];
    if (s.modes && s.modes.politic && s.modes.politic.active && window.FameModes) {
      const r = FameModes.POLITIC_RANKS[s.modes.politic.rankIndex] || FameModes.POLITIC_RANKS[0];
      activeSpecial.push({
        title: r.title,
        category: 'politic',
        badge: `🏛️ Politik • Sokongan ${s.modes.politic.approval}%`,
        icon: '🏛️',
        modeId: 'politic'
      });
    }
    if (s.modes && s.modes.mafia && s.modes.mafia.active && window.UnderworldModes) {
      const r = UnderworldModes.MAFIA_RANKS[s.modes.mafia.rankIndex] || UnderworldModes.MAFIA_RANKS[0];
      activeSpecial.push({
        title: `${r.title} (${s.modes.mafia.syndicateName || 'Sindiket'})`,
        category: 'mafia',
        badge: `🎩 Sindiket • Hormat ${s.modes.mafia.respect}%`,
        icon: '🎩',
        modeId: 'mafia'
      });
    }
    if (s.modes && s.modes.actor && s.modes.actor.active && window.FameModes) {
      const r = FameModes.ACTOR_RANKS[s.modes.actor.rankIndex] || FameModes.ACTOR_RANKS[0];
      activeSpecial.push({
        title: r.title,
        category: 'actor',
        badge: `🎬 Pelakon • Bakat ${s.modes.actor.skill}%`,
        icon: '🎬',
        modeId: 'actor'
      });
    }
    if (s.modes && s.modes.artist && s.modes.artist.active && window.FameModes) {
      const r = FameModes.ARTIST_RANKS[s.modes.artist.rankIndex] || FameModes.ARTIST_RANKS[0];
      activeSpecial.push({
        title: r.title,
        category: 'artist',
        badge: `🎵 Artis • Bakat ${s.modes.artist.skill}%`,
        icon: '🎵',
        modeId: 'artist'
      });
    }

    if (activeSpecial.length > 0) {
      const primary = activeSpecial[0];
      if (activeSpecial.length > 1) {
        secRoles.unshift(activeSpecial[1].title);
      }
      if (s.job && s.job.title) {
        secRoles.unshift(s.job.title);
      }
      return {
        title: primary.title,
        category: primary.category,
        badge: primary.badge,
        secondaryRole: secRoles.length > 0 ? secRoles.join(' • ') : null,
        icon: primary.icon,
        modeId: primary.modeId
      };
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
    if (s.retired) {
      return {
        title: 'Pesara',
        category: 'retired',
        badge: '🌅 Bersara',
        secondaryRole: secRoles.length > 0 ? secRoles.join(' • ') : null,
        icon: '🌅',
        modeId: 'retired'
      };
    }

    // Pempengaruh Sepenuh Masa jika pengikut besar tanpa kerja lain
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

    // Jika di penjara, tiada gaji luar (hanya upah kerja penjara apabila dilakukan)
    if (s.prison && s.prison.inPrison) {
      return { grossLocal: 0, netLocal: 0, taxLocal: 0, retireContribLocal: 0, breakdown: [] };
    }

    // 1) Gaji Kerjaya Rasmi
    if (s.job && s.job.salary > 0) {
      const g = Math.round(s.job.salary);
      const t = Math.round(g * taxRate);
      const ret = Math.round(g * 0.09);
      grossLocal += g;
      taxLocal += t;
      retireContribLocal += ret;
      breakdown.push({ label: s.job.title, gross: g, net: g - t - Math.round(ret * 0.5), icon: s.job.icon || '💼' });
    }

    // 2) Elaun & Gaji Mod Politik / Menteri
    if (s.modes && s.modes.politic && s.modes.politic.active && window.FameModes) {
      const r = FameModes.POLITIC_RANKS[s.modes.politic.rankIndex] || FameModes.POLITIC_RANKS[0];
      const g = Utils.usdToLocal(r.annualUsd, s.countryId);
      const t = Math.round(g * (taxRate * 0.6));
      grossLocal += g;
      taxLocal += t;
      breakdown.push({ label: `Elaun ${r.title}`, gross: g, net: g - t, icon: '🏛️' });
    }

    // 3) Pendapatan Mod Mafia / Sindiket (Wang gelap — tanpa cukai rasmi)
    if (s.modes && s.modes.mafia && s.modes.mafia.active && window.UnderworldModes) {
      const r = UnderworldModes.MAFIA_RANKS[s.modes.mafia.rankIndex] || UnderworldModes.MAFIA_RANKS[0];
      const g = Utils.usdToLocal(r.annualUsd, s.countryId);
      grossLocal += g;
      breakdown.push({ label: `Bahagian Sindiket (${r.title})`, gross: g, net: g, icon: '🎩' });
    }

    // 4) Royalti Mod Artis
    if (s.modes && s.modes.artist && s.modes.artist.active && window.FameModes) {
      const r = FameModes.ARTIST_RANKS[s.modes.artist.rankIndex] || FameModes.ARTIST_RANKS[0];
      const mult = s.modes.artist.contractType === 'predatory' ? 0.6 : 1;
      const g = Utils.usdToLocal(Math.round(r.annualUsd * mult), s.countryId);
      const t = Math.round(g * taxRate * 0.7);
      grossLocal += g;
      taxLocal += t;
      breakdown.push({ label: `Royalti ${r.title}`, gross: g, net: g - t, icon: '🎵' });
    }

    // 5) Bayaran Mod Pelakon
    if (s.modes && s.modes.actor && s.modes.actor.active && window.FameModes) {
      const r = FameModes.ACTOR_RANKS[s.modes.actor.rankIndex] || FameModes.ACTOR_RANKS[0];
      const g = Utils.usdToLocal(r.annualUsd, s.countryId);
      const t = Math.round(g * taxRate * 0.7);
      grossLocal += g;
      taxLocal += t;
      breakdown.push({ label: `Bayaran ${r.title}`, gross: g, net: g - t, icon: '🎬' });
    }

    // 6) Pendapatan Pasif Media Sosial (jika >= 10,000 pengikut)
    if (s.socialMedia && s.socialMedia.hasAccount && s.socialMedia.followers >= 10000) {
      const usdSponsor = Math.min(85000, Math.round((s.socialMedia.followers / 10000) * 1800));
      const g = Utils.usdToLocal(usdSponsor, s.countryId);
      grossLocal += g;
      breakdown.push({ label: 'Tajaan & Iklan Media Sosial', gross: g, net: g, icon: '📱' });
    }

    // 7) Pencen Persaraan (jika bersara)
    if (s.retired && s.pensionAnnual > 0) {
      const g = Math.round(s.pensionAnnual);
      grossLocal += g;
      breakdown.push({ label: 'Pencen Persaraan', gross: g, net: g, icon: '🌅' });
    }

    const netLocal = breakdown.reduce((acc, b) => acc + b.net, 0);
    return { grossLocal, netLocal, taxLocal, retireContribLocal, breakdown };
  },

  // --------------------------------------------------------------------------
  // 3. NAMA PAPARAN LENGKAP DENGAN GELARAN (YAB / YB / Dr. / ALIAS PELARIAN)
  // --------------------------------------------------------------------------
  getDisplayNameWithTitles(s) {
    if (!s) return '';
    let baseName = s.name || '';
    const prefixes = [];

    // Gelaran Politik aktif
    if (s.modes && s.modes.politic && s.modes.politic.active && !(s.prison && s.prison.inPrison)) {
      const idx = s.modes.politic.rankIndex || 0;
      if (idx >= 4) prefixes.push('YAB');
      else if (idx >= 2) prefixes.push('YB');
    }

    // Gelaran Akademik PhD
    const hasDr = Boolean(s.education && (s.education.hasDoctorateTitle || s.education.educationLevel === 'phd'));
    if (hasDr && !/^Dr\.\s/i.test(baseName)) {
      prefixes.push('Dr.');
    }

    return prefixes.length > 0 ? `${prefixes.join(' ')} ${baseName}` : baseName;
  },

  // --------------------------------------------------------------------------
  // 4. PERALIHAN MOD YANG BERSIH (TIADA GELARAN BASI ATAU GAJI HANTU)
  // --------------------------------------------------------------------------
  syncCharacterModeTransitions(s, transition, opts = {}) {
    if (!s) return;
    GameState.ensureUpgradedState();

    if (transition === 'enter_prison') {
      if (s.job) {
        GameState.addJournalEntry(`🚪 Jawatan anda sebagai ${s.job.title} ditamatkan serta-merta kerana sabitan penjara.`, 'warning');
        s.job = null;
      }
      if (s.modes.politic && s.modes.politic.active) {
        s.modes.politic.active = false;
        GameState.addJournalEntry('🏛️ Anda dilucutkan daripada jawatan politik ekoran hukuman penjara.', 'warning');
      }
    } else if (transition === 'enter_politic_office') {
      // Apabila menjadi Ahli Parlimen / Menteri / PM (rank >= 2), tamatkan kerja rasmi yang bercanggah
      if (s.job) {
        GameState.addJournalEntry(`🏛️ Anda meletak jawatan sebagai ${s.job.title} bagi menumpukan sepenuh masa kepada tugas kepimpinan negara.`, 'milestone');
        s.job = null;
      }
      s.retired = false;
    } else if (transition === 'leave_politic') {
      if (s.modes.politic) {
        s.modes.politic.active = false;
        GameState.addJournalEntry('🏛️ Anda meletak jawatan dan bersara daripada arena politik aktif.', 'culture');
      }
    } else if (transition === 'enter_mafia') {
      if (s.modes.politic && s.modes.politic.active) {
        s.modes.politic.active = false;
      }
      s.retired = false;
    } else if (transition === 'leave_mafia') {
      if (s.modes.mafia) {
        s.modes.mafia.active = false;
        s.modes.mafia.syndicateName = null;
        s.modes.mafia.rankIndex = 0;
      }
    } else if (transition === 'leave_artist') {
      if (s.modes.artist) s.modes.artist.active = false;
    } else if (transition === 'leave_actor') {
      if (s.modes.actor) s.modes.actor.active = false;
    } else if (transition === 'enter_career') {
      s.retired = false;
    } else if (transition === 'quit_job') {
      s.job = null;
    } else if (transition === 'retire') {
      const inc = this.getTotalAnnualIncome(s);
      s.pensionAnnual = Math.max(Utils.usdToLocal(6000, s.countryId), Math.round(inc.grossLocal * 0.35));
      s.job = null;
      if (s.modes.politic) s.modes.politic.active = false;
      s.retired = true;
      GameState.addJournalEntry(`🌅 Anda memilih untuk bersara dengan pencen ${Utils.formatMoney(s.pensionAnnual, s.countryId)}/thn!`, 'milestone');
    }

    this.recordPeakRole(s);
  },

  // Rekodkan peranan tertinggi sepanjang hayat untuk Obituari & Salasilah Dinasti
  recordPeakRole(s) {
    if (!s) return;
    const occ = this.getDisplayOccupation(s);
    if (!occ || ['none', 'unemployed', 'child', 'school'].includes(occ.category)) return;
    const weightMap = { politic: 5, mafia: 4, actor: 4, artist: 4, career: 3, education: 2, retired: 1, prison: 1 };
    const newWeight = (weightMap[occ.category] || 1) * 10 + (s.modes && s.modes.politic && s.modes.politic.active ? (s.modes.politic.rankIndex || 0) : 0);
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
    if (window.EduCareerEngine && EduCareerEngine.ensureFields) {
      EduCareerEngine.ensureFields(s);
    }
    if (window.PrisonFugitive && PrisonFugitive.ensureFields) {
      PrisonFugitive.ensureFields(s);
    }
    // Pastikan save lama dengan Mod Politik / Mafia / Artis / Pelakon aktif terus diselaraskan
    this.recordPeakRole(s);
    return s;
  }
};
