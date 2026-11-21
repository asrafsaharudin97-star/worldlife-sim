/* ==========================================================================
   WorldLife — Enjin Simulasi Utama (Umur, Budaya, Kerjaya & Hijrah)
   Bahasa Melayu
   ========================================================================== */

window.Sim = {
  ageUp() {
    const s = GameState.current;
    if (!s || !s.alive) return { event: null, died: false };
    GameState.ensureUpgradedState();

    s.age += 1;
    s.year += 1;
    s.yearsInCurrentCountry += 1;
    s.yearlyActions = {};

    const c = Utils.getCountry(s.countryId);

    s.journal.push({
      age: s.age,
      year: s.year,
      countryId: s.countryId,
      city: s.city,
      entries: []
    });

    // Jejak harta bersih puncak sepanjang hayat (untuk ringkasan salasilah yang padat)
    try {
      s.peakNetWorth = Math.max(s.peakNetWorth || 0, GameState.getNetWorth());
    } catch (e) {}

    // 1. Umur ahli keluarga, pasangan & rakan
    for (const rel of s.relationships) {
      if (!rel.alive) continue;
      rel.age += 1;
      if (rel.age > 74 && Utils.chance((rel.age - 72) * 0.025)) {
        rel.alive = false;
        const wasSpouse = s.partnerId === rel.id && s.married;
        GameState.addJournalEntry(
          wasSpouse
            ? `🕊️💔 Pasangan hidup anda, ${rel.name} (${rel.role}), telah menghembuskan nafas terakhir pada usia ${rel.age} tahun. Anda kini hidup sebagai ${s.gender === 'male' ? 'duda' : 'balu'}.`
            : `💔 ${rel.role} anda, ${rel.name}, telah meninggal dunia dengan tenang pada usia ${rel.age} tahun.`,
          'warning'
        );
        GameState.adjustStats({ happiness: wasSpouse ? -26 : -18 });
        GameState.recordCrisis('grief');
        if (s.partnerId === rel.id) {
          s.partnerId = null;
          s.married = false;
        }
      } else if (rel.countryId !== s.countryId) {
        rel.closeness = Utils.clamp(rel.closeness - Utils.randInt(1, 3), 10, 100);
      } else if (rel.category === 'friend') {
        rel.closeness = Utils.clamp(rel.closeness - Utils.randInt(1, 3), 10, 100);
      }
    }

    // 2. Pendidikan (mengikut negara semasa)
    this._processEducation(s, c);

    // 3. Gaji, pelaburan, cukai & kos sara hidup
    this._processFinances(s, c);
    if (s.age >= 18 && s.money < 0) {
      GameState.recordCrisis('bankruptcy');
    }

    // 4. Perayaan & penyesuaian budaya tempatan
    if (!s.prison.inPrison) {
      this._processCultureAndFestivals(s, c);
    }

    // 4B. Penjara, Pendapatan 5 Mod Khas, Laman Sosial & Penyelarasan Stres/Haba Polis
    this._processModesAndAlignment(s, c);

    // 4C. Rombak Dek Aktiviti Tahunan, Pasaran Kerja Dinamik, Papan Mod Dinamik & Kemas Kini Dinasti
    if (window.ActivitiesDeck && ActivitiesDeck.generateYearlyDeck) {
      ActivitiesDeck.generateYearlyDeck(s);
    }
    if (s.age >= 18 && window.EduCareerEngine && EduCareerEngine.generateYearlyJobMarket) {
      EduCareerEngine.generateYearlyJobMarket(s);
    }
    if (window.SpecialModesEngine && SpecialModesEngine.tickYearlySpecialMode) {
      SpecialModesEngine.tickYearlySpecialMode(s);
    }
    if (window.CharacterStatus && CharacterStatus.recordPeakRole) {
      CharacterStatus.recordPeakRole(s);
    }
    if (window.Dynasty && Dynasty.tickYear) {
      Dynasty.tickYear(s);
    }

    // 5. Perubahan statistik semula jadi & ketahanan rohani
    if (s.age > 55) {
      const healthDrop = Utils.randInt(1, Math.min(8, Math.floor((s.age - 50) / 5) + 1));
      s.stats.health = Utils.clamp(s.stats.health - healthDrop);
      s.stats.looks = Utils.clamp(s.stats.looks - Utils.randInt(0, 2));
    } else if (s.age >= 13 && s.age <= 24) {
      s.stats.looks = Utils.clamp(s.stats.looks + Utils.randInt(-2, 3));
    }

    if (s.stats.health <= 30) {
      GameState.recordCrisis('illness');
    }

    // Pemulihan emosi hasil pegangan hidup / ketenangan batin
    if (s.age >= 15 && s.belief && s.belief !== 'unassigned' && s.devotion >= 55 && s.stats.happiness < 55) {
      const b = GameState.getBeliefObj(s.belief);
      const recovery = Utils.randInt(2, 5);
      s.stats.happiness = Utils.clamp(s.stats.happiness + recovery);
      if (Utils.chance(0.35)) {
        GameState.addJournalEntry(
          `${b.icon} Pegangan ${b.name} membantu menenangkan jiwa anda di tengah tekanan hidup (+${recovery}% Gembira).`,
          'spiritual'
        );
      }
    }

    // 6. Semak kematian
    const deathCause = this._checkDeath(s, c);
    if (deathCause) {
      s.alive = false;
      s.causeOfDeath = deathCause;
      GameState.addJournalEntry(
        `🕊️ Anda menghembuskan nafas terakhir di ${s.city}, ${c.name} ${c.flag} pada umur ${s.age} tahun. Punca: ${deathCause}.`,
        'warning'
      );
      GameState.archiveCurrentLife();
      GameState.save();
      return { event: null, died: true };
    }

    // 7. Pilih peristiwa pilihan tahunan
    const event = this._pickYearlyEvent(s, c);

    const curBlock = s.journal[s.journal.length - 1];
    if (curBlock.entries.length === 0) {
      GameState.addJournalEntry(
        `Setahun lagi berlalu di ${s.city}, ${c.name} ${c.flag}. Anda rasa ${s.stats.happiness >= 60 ? 'bersemangat dan gembira' : 'tenang merenung masa depan'}.`
      );
    }

    GameState.save();
    return { event, died: false };
  },

  _processEducation(s, c) {
    const ed = s.education;
    const ced = c.education;

    if (s.age === ced.preschool.startAge && ed.stage === 'infant') {
      ed.stage = 'preschool';
      ed.schoolName = `${ced.preschool.name} ${s.city}`;
      GameState.addJournalEntry(`🎒 Anda memulakan alam persekolahan di ${ed.schoolName}, ${c.name}!`, 'milestone');
      GameState.adjustStats({ smarts: 4, happiness: 3 });
    } else if (s.age === ced.primary.startAge && (ed.stage === 'infant' || ed.stage === 'preschool')) {
      ed.stage = 'primary';
      ed.schoolName = `${ced.primary.name} ${s.city}`;
      GameState.addJournalEntry(`📚 Anda mendaftar masuk ke ${ed.schoolName}.`, 'milestone');
      GameState.adjustStats({ smarts: 5 });
    } else if (s.age === ced.primary.examAge && ed.stage === 'primary') {
      const score = Utils.clamp(s.stats.smarts + Utils.randInt(-10, 12), 20, 100);
      const grade = score >= 80 ? 'Semua A Cemerlang!' : score >= 60 ? 'Lulus Dengan Baik' : 'Lulus Sederhana';
      GameState.addJournalEntry(
        `📝 Anda menduduki ${ced.primary.examName} di ${c.name} dan memperoleh keputusan: ${grade}`,
        'milestone'
      );
      GameState.adjustStats({ happiness: score >= 60 ? 8 : -4, smarts: 3 });
    } else if (s.age === ced.secondary.startAge && ed.stage === 'primary') {
      ed.stage = 'secondary';
      ed.schoolName = `${ced.secondary.name} ${s.city}`;
      GameState.addJournalEntry(`🏫 Anda melangkah ke ${ed.schoolName}! Zaman remaja bermula.`, 'milestone');
    } else if (s.age === ced.secondary.examAge && ed.stage === 'secondary') {
      const score = Utils.clamp(s.stats.smarts + Utils.randInt(-8, 12), 20, 100);
      let gradeText;
      if (c.id === 'MY') {
        gradeText = score >= 85 ? '9A+ (Pelajar Cemerlang SPM!)' : score >= 70 ? '6A 3B (Keputusan SPM Mantap!)' : score >= 50 ? 'Kepujian BM & Matematik' : 'Lulus Asas';
      } else if (c.id === 'KR') {
        gradeText = score >= 85 ? 'Top 2% Suneung (Layak Universiti SKY!)' : score >= 65 ? 'Skor Universiti Baik' : 'Skor Suneung Sederhana';
      } else if (c.id === 'GB') {
        gradeText = score >= 85 ? 'Semua Gred 9 Cemerlang!' : score >= 65 ? 'Gred 7–8 Kukuh' : 'Lulus Biasa';
      } else {
        gradeText = score >= 85 ? 'Cemerlang Kepujian!' : score >= 65 ? 'Keputusan Baik' : 'Tamat Sekolah';
      }
      ed.hasHighSchool = true;
      if (!ed.educationLevel || ed.educationLevel === 'none') ed.educationLevel = 'high_school';
      ed.examGrade = gradeText;
      ed.stage = 'highschool_done';
      ed.schoolName = null;
      GameState.addJournalEntry(
        `🎓 Anda menamatkan ${ced.secondary.examName} di ${c.name} dengan keputusan: ${gradeText}! Anda kini boleh mohon Diploma/Universiti, ambil Sijil, mula bekerja, atau berhijrah pada umur 18.`,
        'milestone'
      );
      GameState.adjustStats({ happiness: score >= 65 ? 12 : 2, smarts: 5 });
    }

    // Enjin Pendidikan Sepanjang Hayat (Kelas Dewasa, Diploma, Ijazah, Master, PhD & Bayaran Balik Pinjaman)
    if (window.EduCareerEngine && EduCareerEngine.tickYearlyEducation) {
      const handled = EduCareerEngine.tickYearlyEducation(s, c);
      if (handled) return;
    }

    if (ed.stage === 'university' && !ed.activeStudy) {
      const isLocal = s.citizenships.includes(s.countryId) || s.residencyStatus === 'PR';
      const tuition = Math.round(ced.uniTuitionAnnual * (isLocal ? 1 : 1.75));
      if (s.age <= 22 && s.money < tuition && s.relationships.some(r => ['Ibu', 'Ayah', 'Mother', 'Father'].includes(r.role) && r.alive)) {
        GameState.addJournalEntry(`🎓 Ibu bapa membantu membayar yuran ${Utils.formatMoney(tuition, s.countryId)} anda di ${ed.universityName}.`);
      } else {
        s.money -= tuition;
        GameState.addJournalEntry(`🎓 Membayar yuran ${Utils.formatMoney(tuition, s.countryId)} di ${ed.universityName} (${isLocal ? 'Kadar tempatan' : 'Kadar antarabangsa'}).`);
      }
      GameState.adjustStats({ smarts: Utils.randInt(4, 7) });
      ed.uniYearsLeft -= 1;
      if (ed.uniYearsLeft <= 0) {
        ed.stage = 'graduated';
        ed.hasDegree = true;
        ed.educationLevel = 'bachelor';
        GameState.addJournalEntry(
          `🎉 Tahniah! Anda berjaya menamatkan pengajian di ${ed.universityName} (${c.name} ${c.flag}) dan menggenggam Ijazah Sarjana Muda!`,
          'milestone'
        );
        GameState.adjustStats({ happiness: 18, smarts: 6 });
      }
    }
  },

  _processFinances(s, c) {
    // Gunakan CharacterStatus.getTotalAnnualIncome sebagai SUMBER TUNGGAL untuk semua pendapatan!
    const inc = window.CharacterStatus
      ? CharacterStatus.getTotalAnnualIncome(s)
      : { grossLocal: s.job ? s.job.salary : 0, netLocal: s.job ? Math.round(s.job.salary * (1 - c.taxRate)) : 0, retireContribLocal: s.job ? Math.round(s.job.salary * 0.09) : 0 };

    if (inc.netLocal > 0) {
      s.money += inc.netLocal;
      s.retirementFund += (inc.retireContribLocal || 0);
      const usdGross = Utils.localToUsd(inc.grossLocal, s.countryId);
      if (usdGross > s.peakSalaryUsd) s.peakSalaryUsd = Math.round(usdGross);
    }

    if (s.job && !(s.prison && s.prison.inPrison)) {
      s.job.years += 1;
      const retireContrib = Math.round(s.job.salary * 0.09);

      let promoted = false;
      if (window.EduCareerEngine && Array.isArray(s.job.ladder) && s.job.performance >= 78 && Utils.chance(0.45)) {
        const pRes = EduCareerEngine.tryPromote(s, false);
        promoted = Boolean(pRes && pRes.ok);
      }

      if (!promoted && s.job.performance >= 72 && Utils.chance(0.55)) {
        const bump = Utils.randInt(4, 10);
        s.job.salary = Math.round(s.job.salary * (1 + bump / 100));
        GameState.addJournalEntry(
          `💼 Prestasi cemerlang sebagai ${s.job.title}! Gaji anda naik ${bump}% kepada ${Utils.formatMoney(s.job.salary, s.countryId)}/thn (+${Utils.formatMoney(retireContrib, s.countryId)} ke ${c.retirementScheme}).`,
          'milestone'
        );
      }
      s.job.performance = Utils.clamp(s.job.performance + Utils.randInt(-3, 3), 20, 100);
    }

    if (s.investments > 0) {
      const inv = (window.COUNTRY_INVESTMENTS && window.COUNTRY_INVESTMENTS[s.countryId]) || { name: 'Pasaran Tempatan', minYield: 4, maxYield: 10 };
      const dip = Utils.chance(0.14);
      const ratePct = dip ? -Utils.randInt(2, 6) : Utils.randInt(inv.minYield, inv.maxYield);
      const gain = Math.round(s.investments * (ratePct / 100));
      s.investments = Math.max(0, s.investments + gain);
      if (Math.abs(gain) > Utils.usdToLocal(200, s.countryId)) {
        GameState.addJournalEntry(
          `📈 Portfolio ${inv.name} anda ${gain >= 0 ? 'meningkat' : 'menurun'} sebanyak ${ratePct >= 0 ? '+' : ''}${ratePct}% (${gain >= 0 ? '+' : ''}${Utils.formatMoney(gain, s.countryId)}).`
        );
      }
    }

    if (s.age === 60 && s.retirementFund > 0) {
      s.money += s.retirementFund;
      GameState.addJournalEntry(
        `🏦 Anda mengeluarkan simpanan persaraan ${c.retirementScheme} berjumlah ${Utils.formatMoney(s.retirementFund, s.countryId)}!`,
        'milestone'
      );
      s.retirementFund = 0;
    }

    if (s.age >= 19) {
      const hasHome = s.assets.properties.length > 0;
      const baseLivingUsd = (hasHome ? 6500 : 12500) * c.costOfLivingIndex;
      const livingLocal = Utils.usdToLocal(baseLivingUsd, s.countryId);
      let assetUpkeep = 0;

      for (const v of s.assets.vehicles) assetUpkeep += (v.upkeep || 0);
      for (const p of s.assets.properties) assetUpkeep += (p.upkeep || 0);

      if (inc.grossLocal > 0 || s.money > livingLocal) {
        s.money -= (livingLocal + assetUpkeep);
      } else if (s.education.stage === 'university' || s.education.activeStudy) {
        s.money -= Math.round(livingLocal * 0.35);
      } else {
        s.money -= Math.round(livingLocal * 0.65);
      }
    }

    // Kemas kini tahunan Enjin Aset (Trend Pasaran, Pinjaman Bank, Sewa, Penyusutan Kenderaan & Pusaka)
    if (window.AssetsEngine && AssetsEngine.tickYearlyAssets) {
      AssetsEngine.tickYearlyAssets(s, c);
    }

    if (s.age >= 8 && s.age <= 17 && Utils.chance(0.7)) {
      const allowance = Utils.usdToLocal(Utils.randInt(40, 140), s.countryId);
      s.money += allowance;
    }
  },

  _processCultureAndFestivals(s, c) {
    if (s.age >= 3 && Utils.chance(0.55)) {
      const fest = Utils.pick(c.festivals);
      let extra = '';
      if (s.age <= 18 && (fest.name.includes('Raya') || fest.name.includes('New Year') || fest.name.includes('Tahun Baru') || fest.name.includes('Seollal') || fest.name.includes('Oshogatsu') || fest.name.includes('Idul Fitri'))) {
        const gift = Utils.usdToLocal(Utils.randInt(35, 110), s.countryId);
        s.money += gift;
        extra = ` Anda menerima ${Utils.formatMoney(gift, s.countryId)} duit raya / sampul perayaan!`;
      }
      GameState.addJournalEntry(
        `${fest.icon} Menyambut ${fest.name} di ${c.name}: ${fest.desc}${extra}`,
        'culture'
      );
      GameState.adjustStats({ happiness: Utils.randInt(3, 7), adaptation: 4 });
    }

    if (s.countryId !== s.birthCountryId) {
      const gain = Utils.randInt(5, 9);
      GameState.adjustAdaptation(gain);
      const adapt = GameState.getCurrentAdaptation();

      if (s.residencyStatus.includes('Visa') && s.yearsInCurrentCountry === 2 && adapt >= 40) {
        GameState.addJournalEntry(
          `🛂 Kemas Kini Imigresen: Anda sudah 2 tahun menetap di ${c.name}! Buka Pasport & PR di tab Aktiviti untuk memohon Penduduk Tetap (PR).`,
          'migration'
        );
      }
      if (s.residencyStatus === 'PR' && s.yearsInCurrentCountry === 5 && adapt >= 65 && !s.citizenships.includes(s.countryId)) {
        GameState.addJournalEntry(
          `🛂 Layak Kewarganegaraan! Anda kini layak memohon taraf Warganegara ${c.name} di tab Pasport & PR!`,
          'migration'
        );
      }
    }
  },

  _checkDeath(s, c) {
    if (s.stats.health <= 0) return 'Komplikasi kesihatan serius';
    if (s.age >= c.lifeExpectancy + 18) return 'Faktor usia tua dengan tenang';
    if (s.age >= c.lifeExpectancy - 4) {
      const over = s.age - (c.lifeExpectancy - 5);
      const healthFactor = (100 - s.stats.health) / 140;
      const prob = Math.min(0.45, 0.025 * over + healthFactor * 0.14);
      if (Utils.chance(prob)) return 'Sakit tua secara semula jadi';
    }
    return null;
  },

  _processModesAndAlignment(s, c) {
    // 1. Hukuman Penjara
    if (s.prison && s.prison.inPrison) {
      s.prison.yearsServed = (s.prison.yearsServed || 0) + 1;
      s.prison.yearsLeft = Math.max(0, (s.prison.yearsLeft || 1) - 1);
      if (s.prison.yearsLeft <= 0) {
        s.prison.inPrison = false;
        s.alignment.notoriety = Math.max(0, s.alignment.notoriety - 20);
        GameState.adjustStats({ happiness: 14 });
        GameState.addJournalEntry('🔓 Anda tamat menjalani hukuman penjara dan melangkah keluar sebagai insan bebas! Masa untuk memulakan bab baru.', 'milestone');
      } else {
        GameState.adjustStats({ happiness: -4, health: -2 });
        GameState.addJournalEntry(`⛓️ Menjalani hukuman di penjara (${s.prison.yearsLeft} tahun lagi). Klik bar PENJARA untuk Gim, Perpustakaan, Rayuan, Parol, Lari atau Rusuhan.`, 'warning');
      }
      return;
    }

    // 1B. Semakan Risiko Dikesan Polis bagi PELARIAN
    if (s.fugitive && s.fugitive.isFugitive && window.PrisonFugitive) {
      PrisonFugitive.tickFugitiveYear(s);
      if (s.prison && s.prison.inPrison) return;
    }

    // (Pendapatan tahunan semua Mod Khas kini dikreditkan secara bersepadu melalui CharacterStatus.getTotalAnnualIncome dalam _processFinances!)

    // 3. Pertumbuhan pasif Laman Sosial
    if (s.socialMedia && s.socialMedia.hasAccount && s.socialMedia.followers > 0) {
      const passive = Math.round(s.socialMedia.followers * Utils.randInt(2, 6) / 100);
      s.socialMedia.followers += passive;
    }

    // 4. Penyejukan semula jadi Haba Polis & Stres
    if (s.alignment.notoriety > 0) {
      s.alignment.notoriety = Math.max(0, s.alignment.notoriety - Utils.randInt(2, 5));
    }
    if (s.alignment.stress > 15) {
      s.alignment.stress = Math.max(10, s.alignment.stress - Utils.randInt(2, 5));
    }

    // 5. Kesan Stres Melampau (Burnout)
    if (s.alignment.stress >= 85) {
      GameState.adjustStats({ health: -8, happiness: -10 });
      GameState.addJournalEntry('🧠 Tekanan mental (Stres) anda berada pada tahap kritikal! Luangkan masa berehat atau tenangkan jiwa.', 'warning');
    }
  },

  _pickWeighted(pool) {
    if (!pool || !pool.length) return null;
    const total = pool.reduce((acc, item) => acc + (item.weight || 10), 0);
    let r = Math.random() * total;
    for (const item of pool) {
      r -= (item.weight || 10);
      if (r <= 0) return item;
    }
    return pool[pool.length - 1];
  },

  _pickYearlyEvent(s, c) {
    if (s.age < 5) return null;
    if (s.prison && s.prison.inPrison) {
      return (window.PrisonFugitive && PrisonFugitive.pickPrisonEvent) ? PrisonFugitive.pickPrisonEvent(s) : null;
    }

    // 00. Kejutan Masa Silam (1–2% peluang nadir bagi IDENTITI BAHARU)
    if (window.PrisonFugitive && PrisonFugitive.pickHiddenPastEvent) {
      const hpEv = PrisonFugitive.pickHiddenPastEvent(s);
      if (hpEv) return hpEv;
    }

    // 0A. Sabotaj Legasi & Peluang Penebusan Dinasti (Timer Penebusan / Serangan Musuh)
    if (window.Dynasty && Dynasty.pickLegacyEvent) {
      const legEv = Dynasty.pickLegacyEvent(s, c);
      if (legEv) return legEv;
    }

    // 0. Tawaran "Peluang Sekali Seumur Hidup" Mod Khas (Umur 14+, tiada menu statik!)
    if (window.SpecialModesEngine && SpecialModesEngine.maybeTriggerLifetimeOffer) {
      const offerEv = SpecialModesEngine.maybeTriggerLifetimeOffer(s);
      if (offerEv) return offerEv;
    }

    // 0A. Risiko Berterusan "Burn Notice" Bekas Perisik (8–12% setahun)
    if (window.SpecialModesEngine && SpecialModesEngine.maybeTriggerBurnNoticeEvent) {
      const bnEv = SpecialModesEngine.maybeTriggerBurnNoticeEvent(s);
      if (bnEv) return bnEv;
    }

    // 0B. Red Flag / Jodoh Sejati Terbongkar daripada Aplikasi Jodoh / Ta'aruf
    if (window.SocialMedia) {
      const rfEv = SocialMedia.checkPartnerHiddenTraitEvent(s);
      if (rfEv) return rfEv;
    }

    // 0C. Arka Cerita Cliffhanger "Wow" & Ujian Karma (Good vs Bad Trials)
    if (window.KarmaEndings) {
      const kaEv = KarmaEndings.pickKarmaOrArcEvent(s, c);
      if (kaEv) return kaEv;
    }

    // 1. KESAN RAMA-RAMA (Akibat Tersembunyi 3–15 tahun kemudian)
    if (window.LIFE_EVENTS && window.LIFE_EVENTS.butterflyEffects && s.hiddenFlags) {
      const dueFlags = Object.entries(s.hiddenFlags).filter(([key, flag]) => {
        if (!flag || flag.resolved) return false;
        const diff = s.age - flag.setAge;
        if (diff < 3 || diff > 15) return false;
        const def = window.LIFE_EVENTS.butterflyEffects[key];
        if (!def) return false;
        if (def.condition && !def.condition(s, flag)) return false;
        return true;
      });

      if (dueFlags.length > 0) {
        const [flagKey, flagData] = Utils.pick(dueFlags);
        const ageDiff = s.age - flagData.setAge;
        const triggerProb = ageDiff >= 13 ? 0.85 : 0.34;
        if (Utils.chance(triggerProb)) {
          const def = window.LIFE_EVENTS.butterflyEffects[flagKey];
          return {
            id: `bf_${flagKey}_${s.age}`,
            icon: def.icon,
            title: def.title,
            text: def.textFn ? def.textFn(s, flagData) : def.text,
            choices: def.choices
          };
        }
      }
    }

    // 2. PERSIMPANGAN ROHANI & KEPERCAYAAN (KETAT: hanya umur >= 15, dengan tempoh bertenang)
    if (s.age >= 15 && window.LIFE_EVENTS && window.LIFE_EVENTS.buildSpiritualCrossroadsEvent) {
      const sinceLast = s.age - (s.lastSpiritualAge ?? -99);
      const cooldownOk = sinceLast >= 7;
      if (cooldownOk) {
        const recentCrisis = (s.recentCrises || []).find(cr => (s.age - cr.age) <= 2);
        const isOldAgeReflection = s.age >= 60 && sinceLast >= 10;
        let spiritualProb = 0.09; // peluang asas rawak sepanjang hidup (umur 15+)
        let crisisType = null;

        if (recentCrisis) {
          spiritualProb = 0.32;
          crisisType = recentCrisis.type;
        } else if (isOldAgeReflection) {
          spiritualProb = 0.24;
          crisisType = 'old_age';
        }

        if (Utils.chance(spiritualProb)) {
          s.lastSpiritualAge = s.age;
          return window.LIFE_EVENTS.buildSpiritualCrossroadsEvent(s, c, crisisType);
        }
      }
    }

    // 3. Peristiwa Hijrah (bila baru tinggal di luar negara)
    const isAbroad = s.countryId !== s.birthCountryId;
    if (isAbroad && s.yearsInCurrentCountry <= 5 && Utils.chance(0.42)) {
      const migPool = GAME_EVENTS.migration.filter(e => !s.seenEventIds.includes(e.id + '_' + s.countryId));
      if (migPool.length > 0) {
        const picked = Utils.pick(migPool);
        s.seenEventIds.push(picked.id + '_' + s.countryId);
        return this._hydrateDynamicEvent(picked, s, c);
      }
    }

    // 4. Dilema Moral & Pertukaran Sukar (Umur 18+)
    if (s.age >= 18 && window.LIFE_EVENTS && window.LIFE_EVENTS.moralDilemmas && Utils.chance(0.24)) {
      const dilPool = window.LIFE_EVENTS.moralDilemmas.filter(
        e => s.age >= e.minAge && s.age <= e.maxAge && !s.seenEventIds.includes(e.id) && (!e.condition || e.condition(s))
      );
      if (dilPool.length > 0) {
        const picked = Utils.pick(dilPool);
        s.seenEventIds.push(picked.id);
        return picked;
      }
    }

    // 5. Kejutan "Black Swan" / Konflik / Tuah Luar Jangkaan (Umur 18+)
    if (s.age >= 18 && window.LIFE_EVENTS && window.LIFE_EVENTS.blackSwans && Utils.chance(0.20)) {
      const bsPool = window.LIFE_EVENTS.blackSwans.filter(
        e => s.age >= e.minAge && s.age <= e.maxAge && !s.seenEventIds.includes(e.id) && (!e.condition || e.condition(s))
      );
      if (bsPool.length > 0) {
        const picked = this._pickWeighted(bsPool);
        s.seenEventIds.push(picked.id);
        return picked;
      }
    }

    // 5B. Peristiwa Lingkaran Rakan & Rumah Tangga
    if (s.age >= 14 && window.LIFE_EVENTS && window.LIFE_EVENTS.relationshipEvents && Utils.chance(0.24)) {
      const relPool = window.LIFE_EVENTS.relationshipEvents.filter(
        e => s.age >= e.minAge && s.age <= e.maxAge && !s.seenEventIds.includes(e.id) && (!e.condition || e.condition(s))
      );
      if (relPool.length > 0) {
        const picked = Utils.pick(relPool);
        s.seenEventIds.push(picked.id);
        return this._hydrateDynamicEvent(picked, s, c);
      }
    }

    // 6. Peristiwa Budaya Negara & Universal (sedia ada)
    const countryPool = (GAME_EVENTS.country[s.countryId] || []).filter(
      e => s.age >= e.minAge && s.age <= e.maxAge && !s.seenEventIds.includes(e.id)
    );
    if (countryPool.length > 0 && Utils.chance(0.58)) {
      const picked = Utils.pick(countryPool);
      s.seenEventIds.push(picked.id);
      return picked;
    }

    const uniPool = GAME_EVENTS.universal.filter(
      e => s.age >= e.minAge && s.age <= e.maxAge && !s.seenEventIds.includes(e.id)
    );
    if (uniPool.length > 0 && Utils.chance(0.62)) {
      const picked = Utils.pick(uniPool);
      s.seenEventIds.push(picked.id);
      return picked;
    }

    const anyCountry = (GAME_EVENTS.country[s.countryId] || []).filter(
      e => s.age >= e.minAge && s.age <= e.maxAge
    );
    if (anyCountry.length > 0 && Utils.chance(0.30)) {
      return Utils.pick(anyCountry);
    }

    return null;
  },

  _hydrateDynamicEvent(ev, s, curr) {
    const birth = Utils.getCountry(s.birthCountryId);
    return {
      id: ev.id,
      icon: ev.icon,
      title: ev.title,
      text: ev.textFn ? ev.textFn(s, curr, birth) : ev.text,
      choices: ev.choices.map(ch => ({
        ...ch,
        outcome: ch.outcomeFn ? ch.outcomeFn(s, curr, birth) : ch.outcome
      }))
    };
  },

  resolveEventChoice(event, choice) {
    const s = GameState.current;
    if (!s) return { outcome: '', nextEvent: null, toastType: 'culture' };

    const c = Utils.getCountry(s.countryId);

    if (choice.effects) GameState.adjustStats(choice.effects);
    if (choice.moneyUsd) {
      const localDelta = Utils.usdToLocal(choice.moneyUsd, s.countryId);
      s.money += localDelta;
    }
    if (choice.setFlag) {
      if (typeof choice.setFlag === 'string') {
        GameState.setHiddenFlag(choice.setFlag);
      } else if (choice.setFlag.key) {
        GameState.setHiddenFlag(choice.setFlag.key, choice.setFlag.data || {});
      }
    }
    if (choice.resolveFlag && s.hiddenFlags && s.hiddenFlags[choice.resolveFlag]) {
      s.hiddenFlags[choice.resolveFlag].resolved = true;
    }

    let outcome = choice.outcome || '';
    let nextEvent = null;
    let toastType = choice.journalType === 'warning' ? 'error' : 'culture';

    if (typeof choice.customAction === 'function') {
      const res = choice.customAction(s, c) || {};
      if (res.outcome) outcome = res.outcome;
      if (res.nextEvent) nextEvent = res.nextEvent;
      if (res.toastType) toastType = res.toastType;
    }

    if (!nextEvent && outcome) {
      GameState.addJournalEntry(`${event.icon} ${event.title}: ${outcome}`, choice.journalType || 'culture');
    }
    GameState.save();
    return { outcome, nextEvent, toastType };
  },

  // --------------------------------------------------------------------------
  // ENJIN HIJRAH — Pertukaran Budaya Penuh Sebaik Tiba!
  // --------------------------------------------------------------------------
  getMigrationCostLocal(targetCountryId) {
    const s = GameState.current;
    const target = Utils.getCountry(targetCountryId);
    const alreadyCitizen = s.citizenships.includes(targetCountryId);
    const totalUsd = target.flightBaseUsd + (alreadyCitizen ? 0 : target.visaFeeUsd);
    return Utils.usdToLocal(totalUsd, s.countryId);
  },

  migrateToCountry(targetCountryId, visaType = 'work') {
    const s = GameState.current;
    if (!s || s.age < 18) return { ok: false, msg: 'Anda mesti berumur sekurang-kurangnya 18 tahun untuk berhijrah.' };
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Anda di dalam penjara — tidak boleh berhijrah secara sah!' };
    if (s.fugitive && s.fugitive.isFugitive) {
      return { ok: false, msg: 'Status PELARIAN! Perjalanan sah disekat — guna Akses Pasaran Gelap → Lari Ke Luar Negara!' };
    }
    if (s.spyBurnNotice && s.spyBurnNotice.active && s.spyBurnNotice.travelBlockYears > 0) {
      return {
        ok: false,
        msg: `🕵️ BURN NOTICE AKTIF: Perjalanan luar negara anda disekat oleh agensi risikan (baki ${s.spyBurnNotice.travelBlockYears} tahun)!`
      };
    }
    if (targetCountryId === s.countryId) return { ok: false, msg: 'Anda sudah menetap di negara ini!' };

    const fromC = Utils.getCountry(s.countryId);
    const toC = Utils.getCountry(targetCountryId);
    const alreadyCitizen = s.citizenships.includes(targetCountryId);
    const costLocal = this.getMigrationCostLocal(targetCountryId);

    if (s.money < costLocal) {
      return {
        ok: false,
        msg: `Anda perlukan ${Utils.formatMoney(costLocal, s.countryId)} untuk tiket & yuran visa.`
      };
    }

    let approvalChance = 0.85;
    let statusLabel = 'Citizen';

    if (!alreadyCitizen) {
      if (visaType === 'work') {
        statusLabel = 'Work Visa';
        const destStrictness = ((toC.salaryMultiplier || 0.7) * 0.14) + (((toC.safetyIndex || 70) - 60) * 0.002);
        const wealthBoost = Utils.localToUsd(GameState.getNetWorth(), s.countryId) >= 25000 ? 0.08 : 0;
        approvalChance = (s.education.hasDegree ? 0.88 : 0.58) + (s.stats.smarts - 50) * 0.004 + wealthBoost - destStrictness;
      } else if (visaType === 'student') {
        statusLabel = 'Student Visa';
        approvalChance = 0.88 - Math.max(0, ((toC.educationQuality || 75) - 85) * 0.006);
      } else if (visaType === 'investor') {
        const netUsd = Utils.localToUsd(GameState.getNetWorth(), s.countryId);
        const reqUsd = Math.round(90000 + (toC.salaryMultiplier || 0.7) * 80000);
        if (netUsd < reqUsd) {
          return {
            ok: false,
            msg: `Visa Pelabur ke ${toC.name} memerlukan nilai harta sekurang-kurangnya ${Utils.formatMoney(Utils.usdToLocal(reqUsd, s.countryId), s.countryId)}.`
          };
        }
        statusLabel = 'Investor Visa';
        approvalChance = 0.96;
      } else {
        statusLabel = 'Work Visa';
        approvalChance = 0.72;
      }

      if (s.criminalRecord > 0) approvalChance -= s.criminalRecord * 0.25;
      approvalChance = Math.max(0.1, Math.min(0.98, approvalChance));

      if (!Utils.chance(approvalChance)) {
        const appFee = Math.round(costLocal * 0.35);
        s.money -= appFee;
        GameState.addJournalEntry(
          `🛂 Permohonan ${App._residencyLabel(statusLabel)} anda ke ${toC.name} ${toC.flag} ditolak. Anda kerugian ${Utils.formatMoney(appFee, s.countryId)} yuran permohonan.`,
          'warning'
        );
        GameState.adjustStats({ happiness: -7 });
        GameState.save();
        return {
          ok: false,
          msg: `Visa ditolak oleh imigresen ${toC.name}! Tingkatkan Kepintaran, dapatkan Ijazah, atau kekalkan rekod bersih.`
        };
      }
    }

    s.money -= costLocal;

    let liquidated = 0;
    for (const v of s.assets.vehicles) liquidated += v.value;
    for (const p of s.assets.properties) liquidated += p.value;
    s.assets.vehicles = [];
    s.assets.properties = [];
    s.money += liquidated;

    const oldMoneyFormatted = Utils.formatMoney(s.money, fromC.id);
    s.money = Utils.convertMoney(s.money, fromC.id, toC.id);
    s.investments = Utils.convertMoney(s.investments || 0, fromC.id, toC.id);
    s.retirementFund = Utils.convertMoney(s.retirementFund, fromC.id, toC.id);
    const newMoneyFormatted = Utils.formatMoney(s.money, toC.id);

    const newCity = Utils.pick(toC.cities);
    s.countryId = toC.id;
    s.city = newCity;
    s.residencyStatus = statusLabel;
    s.yearsInCurrentCountry = 0;

    if (!s.countriesLivedIn.includes(toC.id)) {
      s.countriesLivedIn.push(toC.id);
    }

    if (s.culturalAdaptation[toC.id] == null) {
      if (alreadyCitizen) {
        s.culturalAdaptation[toC.id] = 100;
      } else if (fromC.closeCultures && fromC.closeCultures.includes(toC.id)) {
        s.culturalAdaptation[toC.id] = Utils.randInt(38, 52);
      } else {
        s.culturalAdaptation[toC.id] = Utils.randInt(14, 26);
      }
    }

    s.passportStamps.push({
      countryId: toC.id,
      city: newCity,
      year: s.year,
      age: s.age,
      type: alreadyCitizen ? 'Pulang Tanah Air' : `Hijrah (${App._residencyLabel(statusLabel)})`,
      status: statusLabel
    });

    s.job = null;
    let arrivalRoleNote = '';
    if (visaType === 'student' && !s.education.hasDegree) {
      const uni = Utils.pick(toC.education.universities);
      s.education.stage = 'university';
      s.education.universityName = uni;
      s.education.uniYearsLeft = toC.education.uniDuration;
      arrivalRoleNote = ` Anda mendaftar di ${uni}!`;
    } else {
      if (s.education.stage === 'university') {
        s.education.stage = 'highschool_done';
        s.education.universityName = null;
        s.education.uniYearsLeft = 0;
      }
      if (visaType === 'work') {
        const eligible = toC.jobs.filter(j => (!j.reqDegree || s.education.hasDegree) && (!j.reqSmarts || s.stats.smarts >= j.reqSmarts));
        const starter = eligible.length ? Utils.pick(eligible) : toC.jobs[0];
        s.job = {
          id: starter.id,
          title: starter.title,
          icon: starter.icon,
          salary: starter.salary,
          years: 0,
          performance: 68,
          countryId: toC.id
        };
        arrivalRoleNote = ` Anda mendapat pekerjaan tajaan sebagai ${starter.title} dengan gaji ${Utils.formatMoney(starter.salary, toC.id)}/thn!`;
      }
    }

    const liqNote = liquidated > 0 ? ' (termasuk jualan hartanah/kenderaan)' : '';
    GameState.addJournalEntry(
      `✈️ BERHIJRAH KE ${toC.name.toUpperCase()} ${toC.flag}! Anda selamat tiba di ${newCity} dengan ${App._residencyLabel(statusLabel)}. Wang anda ditukar daripada ${oldMoneyFormatted} kepada ${newMoneyFormatted}${liqNote}.${arrivalRoleNote} Budaya, kerja, hartanah & perayaan kini mengikut budaya ${toC.name}!`,
      'migration'
    );
    GameState.adjustStats({ happiness: 14 });
    GameState.save();

    return {
      ok: true,
      msg: `Selamat tiba di ${newCity}, ${toC.name} ${toC.flag}!`,
      toCountry: toC,
      newCity,
      arrivalEvent: (!alreadyCitizen && GAME_EVENTS.arrival) ? GAME_EVENTS.arrival[toC.id] : null
    };
  },

  upgradeResidency() {
    const s = GameState.current;
    const c = Utils.getCountry(s.countryId);
    const adapt = GameState.getCurrentAdaptation();

    if (s.citizenships.includes(s.countryId)) {
      return { ok: false, msg: `Anda sudah menjadi Warganegara ${c.name}!` };
    }

    if (s.residencyStatus !== 'PR') {
      if (s.yearsInCurrentCountry < 2 || adapt < 40) {
        return {
          ok: false,
          msg: `PR memerlukan sekurang-kurangnya 2 tahun di ${c.name} dan 40% Penyesuaian Budaya (kini ${s.yearsInCurrentCountry} thn, ${adapt}%).`
        };
      }
      const fee = Utils.usdToLocal(600, s.countryId);
      if (s.money < fee) return { ok: false, msg: `Yuran permohonan PR ialah ${Utils.formatMoney(fee, s.countryId)}.` };
      s.money -= fee;
      s.residencyStatus = 'PR';
      GameState.adjustAdaptation(12);
      GameState.adjustStats({ happiness: 14 });
      GameState.addJournalEntry(
        `🪪 Taraf Penduduk Tetap (PR) Diluluskan! Anda kini PR ${c.name} ${c.flag}, layak menikmati kadar yuran tempatan dan kestabilan jangka panjang.`,
        'migration'
      );
      GameState.save();
      return { ok: true, msg: `Tahniah! Anda kini Penduduk Tetap (PR) ${c.name}!` };
    }

    if (s.yearsInCurrentCountry < 5 || adapt < 65) {
      return {
        ok: false,
        msg: `Warganegara memerlukan 5+ tahun di ${c.name} & 65%+ Penyesuaian Budaya (kini ${s.yearsInCurrentCountry} thn, ${adapt}%).`
      };
    }
    const fee = Utils.usdToLocal(900, s.countryId);
    if (s.money < fee) return { ok: false, msg: `Yuran kewarganegaraan ialah ${Utils.formatMoney(fee, s.countryId)}.` };
    s.money -= fee;
    s.residencyStatus = 'Citizen';
    s.citizenships.push(s.countryId);
    s.culturalAdaptation[s.countryId] = Math.max(adapt, 92);
    s.passportStamps.push({
      countryId: s.countryId,
      city: s.city,
      year: s.year,
      age: s.age,
      type: 'Angkat Sumpah Warganegara',
      status: 'Citizen'
    });
    GameState.adjustStats({ happiness: 22 });
    GameState.addJournalEntry(
      `🎉 MAJLIS KEWARGANEGARAAN! Anda melafazkan ikrar di ${s.city} dan rasmi bergelar Warganegara ${c.name} ${c.flag}!`,
      'milestone'
    );
    GameState.save();
    return { ok: true, msg: `Tahniah, Warganegara rasmi ${c.name} ${c.flag}!` };
  },

  enrollUniversity(uniName) {
    const s = GameState.current;
    const c = Utils.getCountry(s.countryId);
    if (s.age < 17) return { ok: false, msg: 'Tamatkan sekolah menengah dahulu!' };
    if (s.education.stage === 'university') return { ok: false, msg: 'Anda sudah belajar di universiti!' };
    if (s.education.hasDegree) return { ok: false, msg: 'Anda sudah memiliki ijazah universiti!' };

    s.education.stage = 'university';
    s.education.universityName = uniName;
    s.education.uniYearsLeft = c.education.uniDuration;
    GameState.addJournalEntry(`🎓 Anda mendaftar masuk ke ${uniName} di ${c.name} ${c.flag}!`, 'milestone');
    GameState.adjustStats({ happiness: 10, smarts: 4 });
    GameState.save();
    return { ok: true, msg: `Berjaya mendaftar di ${uniName}!` };
  },

  applyJob(jobDef) {
    const s = GameState.current;
    const c = Utils.getCountry(s.countryId);
    if (s.prison && s.prison.inPrison) {
      return { ok: false, msg: '⛓️ Anda sedang berada di dalam penjara dan tidak boleh memohon kerja biasa.' };
    }
    if (s.fugitive && s.fugitive.isFugitive) {
      if (s.fugitive.fakeIdentityTier === 'cheap') {
        if (Utils.chance(0.65)) {
          s.fugitive.recaptureRisk = Utils.clamp((s.fugitive.recaptureRisk || 25) + 10, 0, 99);
          GameState.addJournalEntry(
            `🚨 Majikan mengesyaki dokumen palsu murahan anda semasa semakan latar belakang untuk jawatan ${jobDef.title}! Risiko dikesan polis naik kepada ${s.fugitive.recaptureRisk}%.`,
            'bad'
          );
          GameState.save();
          return { ok: false, msg: '🚨 Dokumen palsu murahan anda gagal semakan latar belakang! Risiko dikesan polis meningkat.' };
        }
      } else if (s.fugitive.fakeIdentityTier !== 'pro') {
        return {
          ok: false,
          msg: '🚨 Status PELARIAN: Anda disenarai hitam daripada pekerjaan rasmi! Beli Identiti Palsu Gred Profesional di Pasaran Gelap.'
        };
      }
    }
    if (s.age < jobDef.minAge) return { ok: false, msg: `Umur minimum ialah ${jobDef.minAge} tahun.` };
    if (jobDef.reqDegree && !s.education.hasDegree) return { ok: false, msg: 'Memerlukan Ijazah Universiti!' };
    if (jobDef.reqSmarts && s.stats.smarts < jobDef.reqSmarts) {
      return { ok: false, msg: `Memerlukan sekurang-kurangnya ${jobDef.reqSmarts}% Kepintaran.` };
    }
    if (s.criminalRecord > 0 && !(s.fugitive && (s.fugitive.fakeIdentityTier === 'pro' || s.fugitive.hiddenPast)) && jobDef.reqDegree && Utils.chance(0.5)) {
      return { ok: false, msg: 'Semakan latar belakang mengesan rekod jenayah anda.' };
    }

    s.job = {
      id: jobDef.id,
      title: jobDef.title,
      icon: jobDef.icon,
      salary: jobDef.salary,
      years: 0,
      performance: 65,
      countryId: s.countryId
    };
    GameState.addJournalEntry(
      `💼 Diterima bekerja sebagai ${jobDef.title} di ${s.city}, ${c.name} dengan gaji ${Utils.formatMoney(jobDef.salary, s.countryId)}/thn!`,
      'milestone'
    );
    GameState.adjustStats({ happiness: 10 });
    GameState.save();
    return { ok: true, msg: `Anda mendapat kerja: ${jobDef.title}!` };
  },

  workHarder() {
    const s = GameState.current;
    if (!s.job) return { ok: false, msg: 'Tiada pekerjaan aktif.' };
    if (s.yearlyActions.workHard) return { ok: false, msg: 'Anda sudah bekerja lebih masa tahun ini!' };
    s.yearlyActions.workHard = true;
    s.job.performance = Utils.clamp(s.job.performance + Utils.randInt(10, 18));
    GameState.adjustStats({ health: -3, happiness: -2, smarts: 2, adaptation: 4 });
    if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: 6 });
    GameState.addJournalEntry(`💼 Anda bekerja lebih masa sebagai ${s.job.title}. Majikan anda amat berpuas hati!`);
    GameState.save();
    return { ok: true, msg: 'Prestasi kerja meningkat!' };
  },

  askForRaise() {
    const s = GameState.current;
    if (!s.job) return { ok: false, msg: 'Tiada pekerjaan aktif.' };
    if (s.yearlyActions.askedRaise) return { ok: false, msg: 'Anda sudah meminta kenaikan gaji tahun ini.' };
    s.yearlyActions.askedRaise = true;
    if (s.job.performance >= 72 || Utils.chance(0.35)) {
      const pct = Utils.randInt(6, 14);
      s.job.salary = Math.round(s.job.salary * (1 + pct / 100));
      GameState.adjustStats({ happiness: 10 });
      GameState.addJournalEntry(`💰 Kenaikan gaji diluluskan! Gaji anda naik ${pct}% kepada ${Utils.formatMoney(s.job.salary, s.countryId)}/thn.`, 'milestone');
      GameState.save();
      return { ok: true, msg: `Kenaikan gaji diluluskan (+${pct}%)!` };
    }
    GameState.adjustStats({ happiness: -4 });
    GameState.addJournalEntry(`💼 Majikan menolak permohonan naik gaji anda. Terus tingkatkan prestasi!`);
    GameState.save();
    return { ok: false, msg: 'Permohonan naik gaji ditolak tahun ini.' };
  },

  doCultureActivity(act) {
    const s = GameState.current;
    const c = Utils.getCountry(s.countryId);
    if (s.yearlyActions[act.id]) return { ok: false, msg: 'Anda sudah melakukan aktiviti ini tahun ini!' };
    if (s.money < act.cost && s.age >= 18) {
      return { ok: false, msg: `Anda perlukan ${Utils.formatMoney(act.cost, s.countryId)}.` };
    }
    s.yearlyActions[act.id] = true;
    if (s.age >= 18) s.money -= act.cost;
    GameState.adjustStats(act.effects);
    GameState.addJournalEntry(`${act.icon} ${act.title} (${c.name}): ${act.desc}`, 'culture');
    GameState.save();
    return { ok: true, msg: `Seronok menikmati ${act.title}!` };
  },

  buyAsset(category, item) {
    const s = GameState.current;
    if (s.money < item.price) return { ok: false, msg: `Wang tidak cukup! Perlukan ${Utils.formatMoney(item.price, s.countryId)}.` };
    s.money -= item.price;
    const owned = {
      uid: category + '_' + Date.now(),
      id: item.id,
      name: item.name,
      icon: item.icon,
      value: item.price,
      upkeep: item.upkeep,
      countryId: s.countryId
    };
    s.assets[category].push(owned);
    GameState.adjustStats({ happiness: item.happiness });
    GameState.addJournalEntry(
      `${item.icon} Membeli ${item.name} di ${s.city} pada harga ${Utils.formatMoney(item.price, s.countryId)}!`,
      'milestone'
    );
    GameState.save();
    return { ok: true, msg: `Berjaya membeli ${item.name}!` };
  },

  sellAsset(category, uid) {
    const s = GameState.current;
    const idx = s.assets[category].findIndex(a => a.uid === uid);
    if (idx === -1) return { ok: false, msg: 'Aset tidak ditemui.' };
    const [asset] = s.assets[category].splice(idx, 1);
    s.money += asset.value;
    GameState.addJournalEntry(`💵 Menjual ${asset.name} pada harga ${Utils.formatMoney(asset.value, s.countryId)}.`);
    GameState.save();
    return { ok: true, msg: `Dijual dengan harga ${Utils.formatMoney(asset.value, s.countryId)}!` };
  },

  meetFriend(source = 'auto') {
    return Relationships.meetFriend(source);
  },

  meetLocalDate() {
    return Relationships.meetLocalDate();
  },

  interactRelation(relId, action) {
    return Relationships.interactRelation(relId, action);
  },

  adoptChild() {
    return Relationships.adoptChild();
  },

  visitDoctor(isPrivate = false) {
    const s = GameState.current;
    const c = Utils.getCountry(s.countryId);
    const cost = isPrivate ? c.healthcare.privateCost : c.healthcare.doctorCost;
    if (s.money < cost && s.age >= 18) {
      return { ok: false, msg: `Perlukan ${Utils.formatMoney(cost, s.countryId)} untuk rawatan ini.` };
    }
    if (s.age >= 18) s.money -= cost;
    const heal = isPrivate ? Utils.randInt(14, 24) : Utils.randInt(9, 16);
    GameState.adjustStats({ health: heal, happiness: 3 });
    GameState.addJournalEntry(
      `🏥 Mendapatkan rawatan di ${isPrivate ? 'hospital pakar swasta' : c.healthcare.type} di ${c.name} (${Utils.formatMoney(cost, s.countryId)}). Kesihatan meningkat +${heal}%!`
    );
    GameState.save();
    return { ok: true, msg: `Kesihatan meningkat +${heal}%!` };
  },

  commitCrime(type) {
    const s = GameState.current;
    const c = Utils.getCountry(s.countryId);
    if (s.yearlyActions.crime) return { ok: false, msg: 'Tunggu tahun depan dahulu!' };
    s.yearlyActions.crime = true;

    const strictCountries = ['SG', 'JP', 'KR'];
    const catchChance = strictCountries.includes(c.id) ? 0.62 : 0.42;

    if (Utils.chance(catchChance)) {
      const fine = Utils.usdToLocal(type === 'rompakan' ? 2400 : 450, s.countryId);
      s.money -= fine;
      s.criminalRecord += 1;
      GameState.adjustStats({ happiness: -16, health: -4 });
      GameState.addJournalEntry(
        `🚓 Ditangkap polis ${c.name} kerana ${type}! Anda didenda ${Utils.formatMoney(fine, s.countryId)} dan kini mempunyai rekod jenayah (menyukarkan permohonan visa!).`,
        'warning'
      );
      GameState.save();
      return { ok: false, msg: `Kantoi! Didenda ${Utils.formatMoney(fine, s.countryId)}.` };
    } else {
      const loot = Utils.usdToLocal(type === 'rompakan' ? 3500 : 320, s.countryId);
      s.money += loot;
      GameState.adjustStats({ happiness: 8 });
      GameState.addJournalEntry(`🕶️ Anda berjaya melakukan ${type} dan mengaut ${Utils.formatMoney(loot, s.countryId)} tanpa dikesan.`);
      GameState.save();
      return { ok: true, msg: `Berjaya lolos dengan ${Utils.formatMoney(loot, s.countryId)}!` };
    }
  },

  investMoney(fraction = 0.5) {
    const s = GameState.current;
    if (s.money <= 0) return { ok: false, msg: 'Tiada wang tunai untuk dilaburkan!' };
    const amount = Math.round(s.money * fraction);
    if (amount <= 0) return { ok: false, msg: 'Jumlah terlalu kecil untuk dilaburkan.' };
    const inv = window.COUNTRY_INVESTMENTS[s.countryId];
    s.money -= amount;
    s.investments = (s.investments || 0) + amount;
    GameState.addJournalEntry(`📈 Melabur ${Utils.formatMoney(amount, s.countryId)} ke dalam ${inv.name}.`);
    GameState.save();
    return { ok: true, msg: `Berjaya melabur ${Utils.formatMoney(amount, s.countryId)}!` };
  },

  withdrawInvestment() {
    const s = GameState.current;
    if (!s.investments || s.investments <= 0) return { ok: false, msg: 'Tiada pelaburan untuk dikeluarkan.' };
    const amt = s.investments;
    s.money += amt;
    s.investments = 0;
    GameState.addJournalEntry(`💵 Mengeluarkan ${Utils.formatMoney(amt, s.countryId)} daripada portfolio pelaburan.`);
    GameState.save();
    return { ok: true, msg: `Berjaya mengeluarkan ${Utils.formatMoney(amt, s.countryId)}!` };
  },

  takeDrivingTest() {
    const s = GameState.current;
    const c = Utils.getCountry(s.countryId);
    if (s.hasDriverLicense) return { ok: false, msg: 'Anda sudah memiliki lesen memandu!' };
    if (s.age < 17) return { ok: false, msg: 'Tunggu umur 17 tahun untuk ambil lesen memandu!' };
    const fee = Utils.usdToLocal(220, s.countryId);
    if (s.money < fee && s.age >= 18) return { ok: false, msg: `Yuran ujian memandu ialah ${Utils.formatMoney(fee, s.countryId)}.` };
    if (s.age >= 18) s.money -= fee;

    const passChance = Math.min(0.95, 0.55 + s.stats.smarts * 0.004);
    const localTestName = c.id === 'MY' ? 'Ujian Bukit & Jalan Raya JPJ'
      : c.id === 'GB' ? 'Ujian Memandu Praktikal DVSA'
      : c.id === 'JP' ? 'Ujian Lesen Memandu Menkyo'
      : c.id === 'SG' ? 'Ujian Praktikal Polis Trafik (BBDC)'
      : `Ujian Lesen Memandu ${c.name}`;

    if (Utils.chance(passChance)) {
      s.hasDriverLicense = true;
      GameState.adjustStats({ happiness: 12, smarts: 2, adaptation: 8 });
      GameState.addJournalEntry(`🚗 Lulus ${localTestName} di ${c.name} ${c.flag}! Anda kini memiliki lesen memandu sah!`, 'milestone');
      GameState.save();
      return { ok: true, msg: `Lulus ${localTestName}!` };
    } else {
      GameState.adjustStats({ happiness: -4 });
      GameState.addJournalEntry(`🚗 Kereta termati enjin di bukit semasa ${localTestName} — cuba lagi nanti!`);
      GameState.save();
      return { ok: false, msg: `Gagal ${localTestName}! Cuba lagi.` };
    }
  },

  doSpiritualPractice() {
    const s = GameState.current;
    GameState.ensureUpgradedState();
    if (s.yearlyActions.spiritualPractice) {
      return { ok: false, msg: 'Anda sudah meluangkan masa untuk amalan jiwa & kebajikan tahun ini.' };
    }
    const b = GameState.getBeliefObj(s.belief);
    const charityCost = s.age >= 18 ? Utils.usdToLocal(35, s.countryId) : 0;
    if (s.age >= 18 && s.money < charityCost) {
      // Boleh lakukan tanpa derma tunai jika poket sempit
      s.yearlyActions.spiritualPractice = true;
      s.devotion = Utils.clamp((s.devotion || 40) + Utils.randInt(6, 12), 0, 100);
      GameState.adjustStats({ happiness: 7, health: 3 });
      GameState.addJournalEntry(`${b.icon} ${b.practiceTitle}: Anda menenangkan fikiran dan mengukuhkan ketahanan jiwa.`, 'spiritual');
      GameState.save();
      return { ok: true, msg: `Jiwa lebih tenang (${b.name})!` };
    }
    if (charityCost > 0) s.money -= charityCost;
    s.yearlyActions.spiritualPractice = true;
    s.devotion = Utils.clamp((s.devotion || 40) + Utils.randInt(8, 15), 0, 100);
    GameState.adjustStats({ happiness: 10, health: 3, smarts: b.isReligious ? 1 : 3 });
    GameState.addJournalEntry(
      `${b.icon} ${b.practiceTitle}${charityCost > 0 ? ` (${b.charityLabel}: ${Utils.formatMoney(charityCost, s.countryId)})` : ''}: Hati terasa lapang dan ketahanan emosi anda semakin teguh.`,
      'spiritual'
    );
    GameState.save();
    return { ok: true, msg: `${b.practiceTitle} selesai! Ketahanan jiwa meningkat.` };
  }
};
