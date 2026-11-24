/* ==========================================================================
   WorldLife — Enjin Simulasi Utama (Umur, Budaya, Kerjaya & Hijrah)
   Bahasa Melayu
   ========================================================================== */

window.Sim = {
  ageUp() {
    const s = GameState.current;
    if (!s || !s.alive) return { event: null, died: false };
    GameState.ensureUpgradedState();

    const prevYearlyActions = { ...(s.yearlyActions || {}) };
    s.age += 1;
    s.year += 1;
    s.yearsInCurrentCountry += 1;
    const didCrimeLastYear = Boolean(
      s.yearlyActions && (
        (s.yearlyActions.crimeCount || 0) > 0 ||
        (Array.isArray(s.yearlyActions.crimesDoneIds) && s.yearlyActions.crimesDoneIds.length > 0)
      )
    );
    s.yearlyActions = {};
    s.stoleMoneyIdsThisYear = [];
    s.askedMoneyCountThisYear = 0;

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

    let priorityNpcDeathEvent = null;
    let priorityMiscarriageEvent = null;
    let priorityTeenEvent = null;
    let babyBirth = null;
    const childMilestoneQueue = [];
    let totalNpcDeathHappyPenalty = 0;
    let totalNpcDeathStressGain = 0;

    // 1. Umur ahli keluarga, pasangan & rakan + Kematian Orang Terdekat Realistik
    for (const rel of s.relationships) {
      if (!rel.alive) continue;
      rel.age += 1;
      const isChild = ['Anak Lelaki', 'Anak Perempuan', 'Son', 'Daughter'].includes(rel.role);

      // Kemas kini kerja anak bila membesar
      if (isChild) {
        if (rel.age >= 18 && rel.job === 'Pelajar' && !rel.uniEnrolled) {
          rel.job = rel.isDelinquent ? 'Penganggur / Berisiko' : 'Belia / Bekerja';
        } else if (rel.age >= 4 && rel.job === 'Bayi') {
          rel.job = rel.age <= 6 ? 'Pelajar Tadika' : 'Pelajar';
        }
      }

      const deathInfo = this._rollNpcMortality(rel, isChild);
      if (deathInfo) {
        rel.alive = false;
        rel.isAlive = false;
        rel.deathCause = deathInfo.cause;
        const wasSpouse = s.partnerId === rel.id && s.married;
        rel._wasSpouse = wasSpouse;
        const isCloseFamily = wasSpouse
          || isChild
          || (window.RelationshipDramaData && RelationshipDramaData.isCloseFamilyMember
              ? RelationshipDramaData.isCloseFamilyMember(s, rel)
              : ['Ibu', 'Ayah', 'Bapa', 'Abang', 'Kakak', 'Adik/Abang', 'Adik/Kakak'].includes(rel.role));

        if (window.GameState && GameState.recordDeceased) {
          GameState.recordDeceased(rel, deathInfo.cause);
        }

        if (s.partnerId === rel.id) {
          if (wasSpouse) {
            s.maritalStatus = s.gender === 'male' ? 'Duda' : 'Balu';
          }
          s.partnerId = null;
          s.married = false;
          s.marriageMeta = null;
          s.idahState = null;
          if (s.pregnancy && s.pregnancy.partnerId === rel.id && !s.pregnancy.motherIsPlayer) {
            s.pregnancy = null;
          }
        }

        if (isCloseFamily) {
          const isSpouseOrChild = Boolean(wasSpouse || isChild);
          const happyDrop = isSpouseOrChild ? -Utils.randInt(40, 60) : -Utils.randInt(25, 40);
          const stressGain = isSpouseOrChild ? Utils.randInt(20, 30) : Utils.randInt(10, 20);
          totalNpcDeathHappyPenalty += happyDrop;
          totalNpcDeathStressGain += stressGain;

          GameState.addJournalEntry(
            wasSpouse
              ? `🕊️💔 Berita Duka: Pasangan hidup anda, ${rel.name} (${rel.role}, ${rel.age} thn), telah meninggal dunia akibat ${deathInfo.cause}. Status anda kini ialah ${s.gender === 'male' ? 'Duda' : 'Balu'} (${happyDrop}% Kegembiraan, +${stressGain}% Stres).`
              : `🕊️💔 Berita Duka: ${rel.role} anda, ${rel.name} (${rel.age} thn), telah meninggal dunia akibat ${deathInfo.cause} (${happyDrop}% Kegembiraan, +${stressGain}% Stres).`,
            'warning'
          );
          if (rel.isFormerPlayerParent && rel.savedEstateNetWorth > 0) {
            const kidsN = Math.max(1, rel.savedKidsCount || 1);
            const netUsd = Utils.localToUsd(rel.savedEstateNetWorth, rel.savedCountryId || s.countryId);
            const taxR = window.LegalInheritanceEngine ? LegalInheritanceEngine.getCountryEstateTaxRate(rel.savedCountryId || s.countryId, netUsd) : 0;
            const frac = ((1 - taxR) * (rel.savedHasSpouse ? 0.5 : 1.0)) / kidsN;
            const shareLocal = Utils.convertMoney(Math.round(rel.savedEstateNetWorth * frac), rel.savedCountryId || s.countryId, s.countryId);
            if (shareLocal > 0) {
              s.money = Math.round((s.money || 0) + shareLocal);
              GameState.addJournalEntry(
                `📜 Pewarisan Harta Pusaka (Undang-Undang Sivil & Wasiat): Anda menerima bahagian pusaka sebanyak ${Utils.formatMoney(shareLocal, s.countryId)} daripada mendiang ${rel.name}.`,
                'milestone'
              );
            }
          }
          GameState.recordCrisis('grief');

          if (!priorityNpcDeathEvent && window.RelationshipDramaData && RelationshipDramaData.buildNpcDeathEvent) {
            priorityNpcDeathEvent = RelationshipDramaData.buildNpcDeathEvent(s, rel, deathInfo.cause, happyDrop, stressGain);
          }
        } else {
          // Bukan ahli keluarga (rakan, kenalan, rakan sekerja, bekas pasangan): tolak -10% hingga -18% Kegembiraan (minimum ketat -10%)
          const lightDrop = -Utils.randInt(10, 18);
          const lightStress = Utils.randInt(3, 7);
          totalNpcDeathHappyPenalty += lightDrop;
          totalNpcDeathStressGain += lightStress;
          GameState.addJournalEntry(
            `🕊️ Anda berkabung atas pemergian ${rel.name} (${rel.role}, ${rel.age} thn) yang telah meninggal dunia akibat ${deathInfo.cause} (${lightDrop}% Kegembiraan).`,
            'normal'
          );
        }
        continue;
      }

      if (rel.countryId !== s.countryId) {
        rel.closeness = Utils.clamp(rel.closeness - Utils.randInt(1, 3), 10, 100);
      } else if (rel.category === 'friend') {
        rel.closeness = Utils.clamp(rel.closeness - Utils.randInt(1, 3), 10, 100);
      }

      // 1A. PERSEKOLAHAN ANAK (UMUR 4–17) & UNIVERSITI ANAK (UMUR 18–22)
      if (isChild && window.Relationships && Relationships.ensureChildEducationFields) {
        if (!rel.stats) rel.stats = { smarts: 65, health: 80 };

        // Gesaan pemilihan sekolah apabila anak mencecah umur 4 (Tadika), 7 (Sekolah Rendah), atau 13 (Sekolah Menengah)
        if (rel.age === 4) {
          rel.schoolStage = 'tadika';
          if (!rel.schoolType || rel.schoolType === 'none' || rel.schoolType === 'not_enrolled') {
            rel.schoolType = 'tadika_awam';
            rel.schoolLabel = 'Tadika / Prasekolah (Awam)';
            rel.yearlySchoolFee = 0;
          }
          childMilestoneQueue.push({ type: 'school', childId: rel.id, stage: 'tadika' });
        } else if (rel.age === 7) {
          rel.schoolStage = 'primary';
          // Tetapkan lalai sementara Sekolah Kebangsaan (Awam) sebelum modal pilihan dibuka
          rel.schoolType = 'sk_awam';
          rel.schoolLabel = 'Sekolah Rendah (Awam)';
          rel.yearlySchoolFee = 0;
          childMilestoneQueue.push({ type: 'school', childId: rel.id, stage: 'primary' });
        } else if (rel.age === 13) {
          rel.schoolStage = 'secondary';
          rel.schoolType = 'smk_awam';
          rel.schoolLabel = 'SMK / Sekolah Menengah (Awam)';
          rel.yearlySchoolFee = 0;
          childMilestoneQueue.push({ type: 'school', childId: rel.id, stage: 'secondary' });
        } else if (rel.age === 18 && !rel.droppedOut) {
          // Anak menamatkan Sekolah Menengah -> cetuskan modal Pilihan Universiti Anak!
          rel.schoolStage = 'completed';
          rel.yearlySchoolFee = 0;
          rel.education = 'high_school';
          rel._uniPref = Relationships.generateChildUniPreference(s, rel);
          childMilestoneQueue.push({ type: 'university', childId: rel.id });
        }

        Relationships.ensureChildEducationFields(s, rel);

        // Pertumbuhan tahunan sekolah (umur 4–17) & penolakan yuran sekolah tahunan
        if (!rel.droppedOut && rel.age >= 4 && rel.age <= 17 && rel.schoolType && rel.schoolType !== 'not_enrolled' && rel.schoolType !== 'none') {
          const stOpts = Relationships.SCHOOL_OPTIONS[rel.schoolStage] || [];
          const activeOpt = stOpts.find(o => o.id === rel.schoolType) || stOpts[0];
          if (activeOpt) {
            const feeLocal = activeOpt.feeUsd > 0 ? Utils.usdToLocal(activeOpt.feeUsd, s.countryId) : 0;
            rel.yearlySchoolFee = feeLocal;
            if (feeLocal > 0) {
              s.money = (s.money || 0) - feeLocal;
              GameState.addJournalEntry(
                `${activeOpt.icon} Membayar yuran tahunan ${activeOpt.label} untuk ${rel.name} (${rel.age} thn): ${Utils.formatMoney(feeLocal, s.countryId)}.`
              );
            }
            const [sMin, sMax] = activeOpt.smartsBonus || [2, 4];
            const [mMin, mMax] = activeOpt.moralsBonus || [1, 2];
            rel.stats.smarts = Utils.clamp((rel.stats.smarts ?? 65) + Utils.randInt(sMin, sMax), 0, 100);
            rel.morals = Utils.clamp((rel.morals ?? 70) + Utils.randInt(mMin, mMax), 0, 100);
            rel.educationCare = Utils.clamp((rel.educationCare ?? 65) + 4, 0, 100);
            if (activeOpt.rebelDelta) {
              rel.rebelliousness = Utils.clamp((rel.rebelliousness ?? 10) + activeOpt.rebelDelta, 0, 100);
            }
            if (activeOpt.prestigeBonus && window.Dynasty && Utils.chance(0.4)) {
              Dynasty.adjustReputation(1);
            }
          }
        }

        // Kemajuan pengajian universiti anak (umur 19–23 jika sedang belajar di universiti)
        if (!rel.droppedOut && rel.age > 18 && rel.uniEnrolled) {
          const uniFee = Number(rel.yearlySchoolFee) || 0;
          if (uniFee > 0 && (rel.uniSponsorMode === 'parent' || rel.uniSponsorMode === 'parent_cheaper')) {
            s.money = (s.money || 0) - uniFee;
            GameState.addJournalEntry(
              `🎓 Membayar yuran tahunan universiti (${rel.university} — ${rel.major}) untuk ${rel.name}: ${Utils.formatMoney(uniFee, s.countryId)}.`
            );
          }
          rel.stats.smarts = Utils.clamp((rel.stats.smarts ?? 70) + Utils.randInt(2, 5), 0, 100);
          const cgpaDelta = ((rel.stats.smarts ?? 70) >= 75 ? Utils.randInt(2, 10) : Utils.randInt(-5, 6)) / 100;
          rel.currentCgpa = Number(Math.max(1.5, Math.min(4.0, (rel.currentCgpa || 3.2) + cgpaDelta)).toFixed(2));
          rel.uniYearsLeft = Math.max(0, (rel.uniYearsLeft || 1) - 1);

          if (rel.uniYearsLeft <= 0) {
            rel.uniEnrolled = false;
            rel.yearlySchoolFee = 0;
            rel.schoolStage = 'graduated';
            rel.education = rel.majorId === 'trades_vocational' ? 'diploma' : 'bachelor';
            rel.schoolLabel = `Graduan ${rel.university} (${rel.major} • PNGK ${rel.currentCgpa.toFixed(2)})`;
            const gradJob = rel.uniCareerTitle || 'Eksekutif Muda';
            rel.job = gradJob;
            GameState.adjustStats({ happiness: 10 });
            if (window.Dynasty) Dynasty.adjustReputation(3);
            GameState.addJournalEntry(
              `🎓🎉 KONVOKESYEN ANAK! ${rel.name} (${rel.age} thn) telah berjaya bergraduasi dari ${rel.university} dalam bidang ${rel.major} (PNGK ${rel.currentCgpa.toFixed(2)}) dan memulakan kerjaya sebagai ${gradJob}!`,
              'milestone'
            );
          }
        }

        // Semakan kebarangkalian anak mahu berhenti belajar (Sekolah Menengah umur 15–17 atau Universiti umur 18–22)
        if (!rel.droppedOut && rel.age >= 15 && rel.age <= 22 && Relationships.computeChildDropoutChance) {
          const dropProb = Relationships.computeChildDropoutChance(rel);
          if (dropProb > 0 && Utils.chance(dropProb)) {
            const reason = Relationships.pickChildDropoutReason(rel);
            childMilestoneQueue.push({ type: 'dropout', childId: rel.id, reason });
          }
        }
      }

      // 1B. Penjagaan & Didikan Anak (Umur 1–17) + Kesan Pengabaian
      if (isChild && rel.age >= 1 && rel.age <= 17) {
        const caredEdu = Boolean(prevYearlyActions[`parent_${rel.id}_education`]);
        const caredHealth = Boolean(prevYearlyActions[`parent_${rel.id}_health`]);
        const caredMorals = Boolean(prevYearlyActions[`parent_${rel.id}_morals`]);

        if (!caredEdu) rel.educationCare = Utils.clamp((rel.educationCare ?? 65) - Utils.randInt(5, 9), 0, 100);
        if (!caredHealth) rel.healthCare = Utils.clamp((rel.healthCare ?? 75) - Utils.randInt(6, 10), 0, 100);
        if (!caredMorals) rel.morals = Utils.clamp((rel.morals ?? 70) - Utils.randInt(6, 10), 0, 100);

        const neglected = (rel.educationCare < 35) || (rel.healthCare < 35) || (rel.morals < 35);
        if (neglected) {
          rel.rebelliousness = Utils.clamp((rel.rebelliousness ?? 10) + Utils.randInt(14, 24), 0, 100);
          rel.closeness = Utils.clamp((rel.closeness ?? 80) - Utils.randInt(5, 10), 0, 100);
          if (rel.healthCare < 30 && rel.stats) {
            rel.stats.health = Utils.clamp((rel.stats.health ?? 75) - Utils.randInt(6, 12), 10, 100);
          }
        } else if (rel.rebelliousness > 10) {
          rel.rebelliousness = Utils.clamp(rel.rebelliousness - Utils.randInt(2, 5), 0, 100);
        }

        if (rel.rebelliousness > 80 || rel.morals < 25) {
          if (!rel.isDelinquent) {
            rel.isDelinquent = true;
            GameState.addJournalEntry(
              `⚠️ Amaran Didikan: Akibat kurang perhatian, ${rel.name} (${rel.age} thn) kini terjerumus sebagai remaja bermasalah (Delinkuen)!`,
              'warning'
            );
          }
          if (rel.age >= 13 && Utils.chance(0.35)) {
            if (window.Dynasty) Dynasty.adjustReputation(-6);
            GameState.addJournalEntry(
              `🚔 ${rel.name} (${rel.age} thn) ditahan pihak berkuasa atas kesalahan juvana! Reputasi keluarga turut tercalar.`,
              'warning'
            );
          }
        }

        if (!priorityTeenEvent && rel.age >= 10 && rel.age <= 17 && (rel.rebelliousness > 65 || rel.isDelinquent) && Utils.chance(0.70)) {
          if (window.RelationshipDramaData && RelationshipDramaData.buildChildRebellionEvent) {
            priorityTeenEvent = RelationshipDramaData.buildChildRebellionEvent(s, rel);
          }
        }
      }
    }

    // 1C. Semakan Kehamilan & Risiko Keguguran (sebelum kelahiran)
    if (s.pregnancy && s.pregnancy.active) {
      const preg = s.pregnancy;
      s.pregnancy = null;
      const partner = preg.partnerId ? s.relationships.find(r => r.id === preg.partnerId && r.alive) : null;
      const motherAge = (preg.motherAge || s.age) + 1;
      const miscChance = this.computeMiscarriageChance(s, motherAge);

      if (Utils.chance(miscChance)) {
        GameState.adjustStats({ happiness: -Utils.randInt(18, 26), health: -Utils.randInt(6, 12) });
        GameState.recordCrisis('grief');
        GameState.addJournalEntry(
          `🕊️💔 Dugaan berat: Kehamilan (usia ibu ${motherAge} tahun) berakhir dengan keguguran. Semoga anda${partner ? ` dan ${partner.name}` : ''} diberi ketabahan.`,
          'warning'
        );
        if (window.RelationshipDramaData && RelationshipDramaData.buildMiscarriageEvent) {
          priorityMiscarriageEvent = RelationshipDramaData.buildMiscarriageEvent(s, partner, motherAge);
        }
      } else if (window.Relationships && Relationships.generateBabyDraft) {
        babyBirth = Relationships.generateBabyDraft(s, {
          partnerId: preg.partnerId,
          partnerName: preg.partnerName,
          isOutOfWedlock: preg.isOutOfWedlock,
          isAdopted: false,
          kidAge: 0
        });
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
    if (window.LegalInheritanceEngine && LegalInheritanceEngine.tickYearlyLegal) {
      LegalInheritanceEngine.tickYearlyLegal(s);
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

    // 5B. Terapkan kesan emosi/kegembiraan & stres kematian NPC SELEPAS semua kemas kini tahunan supaya tidak ditimpa/dipulihkan!
    if (totalNpcDeathHappyPenalty < 0) {
      s.stats.happiness = Utils.clamp((s.stats.happiness ?? 70) + totalNpcDeathHappyPenalty, 0, 100);
    }
    if (totalNpcDeathStressGain > 0 && s.alignment) {
      s.alignment.stress = Utils.clamp((s.alignment.stress || 0) + totalNpcDeathStressGain, 0, 100);
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

    // 7. Pilih peristiwa pilihan tahunan (utamakan Berita Duka / Keguguran / Krisis Remaja) & hadkan tepat 3 pilihan rawak tanpa spoiler!
    let event = priorityNpcDeathEvent
      || priorityMiscarriageEvent
      || priorityTeenEvent
      || this._pickYearlyEvent(s, c);

    if (event) {
      event = this._enforceExactlyThreeChoices(event, s, c);
    }

    const curBlock = s.journal[s.journal.length - 1];
    if (curBlock.entries.length === 0) {
      GameState.addJournalEntry(
        `Setahun lagi berlalu di ${s.city}, ${c.name} ${c.flag}. Anda rasa ${s.stats.happiness >= 60 ? 'bersemangat dan gembira' : 'tenang merenung masa depan'}.`
      );
    }

    GameState.save();
    return { event, died: false, babyBirth, childMilestoneQueue, secondarySchoolChoice: Boolean(s.education && s.education.pendingSecondaryChoice) };
  },

  triggerDeath(cause) {
    const s = GameState.current;
    if (!s || !s.alive) return;
    s.alive = false;
    s.causeOfDeath = cause || 'Sebab tidak diketahui';
    GameState.archiveCurrentLife();
    GameState.save();
  },

  computeMiscarriageChance(s, motherAge) {
    let base = 0.09; // 8–10% (umur < 35)
    if (motherAge > 42) base = 0.38; // 35%+ (umur > 42)
    else if (motherAge >= 35) base = 0.18 + ((motherAge - 35) / 7) * 0.07; // 18–25% (umur 35–42)

    if (s.stats && s.stats.health < 30) base += 0.07;
    if (s.alignment && s.alignment.stress >= 70) base += 0.06;
    return Math.max(0.05, Math.min(0.72, base));
  },

  _rollNpcMortality(rel, isChild) {
    if (!rel || !rel.alive) return null;

    // 1. Kematian faktor usia tua (bermula umur 65+)
    if (rel.age >= 65) {
      const oldProb = Math.min(0.38, 0.012 + (rel.age - 65) * 0.014);
      if (Utils.chance(oldProb)) {
        return { cause: 'sakit tua secara semula jadi' };
      }
    }

    // 2. Tragedi mengejut (kemalangan / sakit tenat): 0.5–1.5%/thn, lebih tinggi jika kesihatan/healthCare amat rendah
    let suddenProb = 0.008;
    if (isChild && (rel.healthCare ?? 75) < 25) {
      suddenProb += 0.025;
    } else if (rel.stats && typeof rel.stats.health === 'number' && rel.stats.health < 30) {
      suddenProb += 0.022;
    }

    if (Utils.chance(suddenProb)) {
      const cause = (isChild && (rel.healthCare ?? 75) < 25)
        ? 'komplikasi sakit tenat akibat kurang rawatan kesihatan'
        : Utils.pick(['kemalangan jalan raya mengejut', 'komplikasi sakit tenat mengejut', 'serangan jantung mengejut']);
      return { cause };
    }
    return null;
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
      ed.pendingSecondaryChoice = true;
    } else if (s.age === ced.secondary.examAge && ed.stage === 'secondary') {
      const trackBonus = ed.secondaryTrack === 'berasrama' ? 8 : 0;
      const score = Utils.clamp(s.stats.smarts + trackBonus + Utils.randInt(-8, 12), 20, 100);
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
    } else if (ed.stage === 'secondary' && !ed.activeStudy) {
      if (ed.secondaryTrack === 'berasrama') {
        GameState.adjustStats({ smarts: 3 });
      } else if (ed.secondaryTrack === 'teknik') {
        GameState.adjustStats({ smarts: 2 });
      }
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

    if ((s.retired || s.isRetired) && !s.job && (s.pensionAnnual || 0) > 0 && !(s.prison && s.prison.inPrison)) {
      GameState.addJournalEntry(
        `🏖️ Pencen Persaraan tahunan anda berjumlah ${Utils.formatMoney(s.pensionAnnual, s.countryId)} telah dikreditkan secara automatik ke akaun tunai anda.`
      );
    }

    if (s.job && !(s.prison && s.prison.inPrison)) {
      s.job.years = (s.job.years || 0) + 1;
      s.yearsInCurrentJob = s.job.years;
      s.totalYearsWorked = (s.totalYearsWorked || 0) + 1;
      const retireContrib = Math.round(s.job.salary * 0.12);

      let promoted = false;
      const curStress = (s.alignment && s.alignment.stress) || 0;
      const promoChance = curStress >= 50 ? 0.35 : 0.45; // -10% peluang naik pangkat jika Stres >= 50%
      if (window.EduCareerEngine && Array.isArray(s.job.ladder) && s.job.performance >= 78 && Utils.chance(promoChance)) {
        const pRes = EduCareerEngine.tryPromote(s, false);
        promoted = Boolean(pRes && pRes.ok);
      }

      const raiseChance = curStress >= 50 ? 0.45 : 0.55; // -10% peluang naik gaji automatik jika Stres >= 50%
      if (!promoted && s.job.performance >= 72 && Utils.chance(raiseChance)) {
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

    if (s.age === 60 && s.retirementFund > 0 && !s.job) {
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
    if (s._lethalStressCause) return s._lethalStressCause;
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
    if (!Array.isArray(s.stressIllnesses)) s.stressIllnesses = [];
    s._lethalStressCause = null;

    // 1. Hukuman Penjara / Sekolah Juvana
    if (s.prison && s.prison.inPrison) {
      const isJuv = s.prison.detentionType === 'juvenile';
      s.prison.yearsServed = (s.prison.yearsServed || 0) + 1;
      s.prison.yearsLeft = Math.max(0, (s.prison.yearsLeft || 1) - 1);

      // Jika di Sekolah Juvana dan mencecah umur 18 tahun dengan baki hukuman berat
      if (isJuv && s.age >= 18 && s.prison.yearsLeft > 0) {
        if (s.prison.transferAt18) {
          s.prison.detentionType = 'prison';
          s.prison.transferAt18 = false;
          GameState.addJournalEntry(
            `⚖️ PEMINDAHAN KE PENJARA DEWASA: Setelah mencecah umur 18 tahun, anda dipindahkan daripada Sekolah Juvana ke Penjara dewasa untuk menyambung baki hukuman ${s.prison.yearsLeft} tahun.`,
            'warning'
          );
        } else {
          // Negara ringan/sederhana: hadkan baki juvana supaya bebas pada umur 18–21
          const maxLeft = Math.max(0, 21 - s.age);
          if (s.prison.yearsLeft > maxLeft) s.prison.yearsLeft = maxLeft;
        }
      }

      if (s.prison.yearsLeft <= 0) {
        const releasedFrom = s.prison.detentionType === 'juvenile' ? 'Sekolah Juvana' : 'Penjara';
        s.prison.inPrison = false;
        s.prison.isDeathPenalty = false;
        s.prison.isLife = false;
        s.alignment.notoriety = Math.max(0, s.alignment.notoriety - 20);
        GameState.adjustStats({ happiness: 14 });
        GameState.addJournalEntry(
          `🔓 Anda tamat menjalani tempoh tahanan di ${releasedFrom} dan dibebaskan hari ini! Masa untuk memulakan lembaran baharu.`,
          'milestone'
        );
      } else {
        const placeName = s.prison.detentionType === 'juvenile' ? 'Sekolah Juvana' : 'Penjara';
        GameState.adjustStats({ happiness: -4, health: -2 });
        GameState.addJournalEntry(
          `🔒 Menjalani tahanan di ${placeName} (baki ${s.prison.yearsLeft} tahun). Klik bar ${placeName.toUpperCase()} untuk aktiviti tahanan atau rayuan.`,
          'warning'
        );
      }
      return;
    }

    // 1B. Semakan Risiko Dikesan Polis bagi PELARIAN
    if (s.fugitive && s.fugitive.isFugitive && window.PrisonFugitive) {
      PrisonFugitive.tickFugitiveYear(s);
      if (s.prison && s.prison.inPrison) return;
    }

    // 3. Pertumbuhan pasif Laman Sosial
    if (s.socialMedia && s.socialMedia.hasAccount && s.socialMedia.followers > 0) {
      const passive = Math.round(s.socialMedia.followers * Utils.randInt(2, 6) / 100);
      s.socialMedia.followers += passive;
    }

    // 4. Penyejukan semula jadi Haba Polis (-10 hingga -15 jika tiada jenayah tahun itu)
    if (s.alignment.notoriety > 0 && !didCrimeLastYear) {
      s.alignment.notoriety = Math.max(0, s.alignment.notoriety - Utils.randInt(10, 15));
    }

    // 5. KESAN STRES BERPERINGKAT (TIERED STRESS CONSEQUENCES) SEBELUM PENYEJUKAN RINGAN
    const stressNow = s.alignment.stress || 0;

    if (stressNow >= 90) {
      // PERINGKAT 3: 90–100% (TEKANAN MELAMPAU / BURNOUT TERUK)
      const hDrop = Utils.randInt(12, 18);
      const hapDrop = Utils.randInt(14, 20);
      GameState.adjustStats({ health: -hDrop, happiness: -hapDrop });

      // Risiko Serangan Jantung / Strok (meningkat bagi umur 40+)
      const strokeChance = s.age >= 40
        ? Math.min(0.28, 0.08 + ((s.age - 40) * 0.006))
        : 0.03;

      if (Utils.chance(strokeChance)) {
        const ConditionName = Utils.pick(['Serangan Jantung Mengejut', 'Strok Akibat Tekanan Melampau']);
        const fatalRoll = s.age >= 45 ? 0.35 : 0.15;
        if (Utils.chance(fatalRoll) || s.stats.health <= 15) {
          s.stats.health = 0;
          s._lethalStressCause = `${ConditionName} (Stres ${stressNow}%)`;
          GameState.addJournalEntry(
            `🚨💔 TRAGEDI TEKANAN MELAMPAU (Stres ${stressNow}%): Anda rebah secara mengejut akibat ${ConditionName}!`,
            'warning'
          );
          return;
        }
        const emergBill = Utils.usdToLocal(Utils.randInt(1800, 4200), s.countryId);
        s.money = Math.max(0, (s.money || 0) - emergBill);
        GameState.adjustStats({ health: -15 });
        s.alignment.stress = Utils.clamp(stressNow - 18, 50, 100);
        GameState.addJournalEntry(
          `🚑⚠️ ${ConditionName.toUpperCase()} (Stres ${stressNow}%): Anda dikejarkan ke ICU! Mujur nyawa anda sempat diselamatkan, namun kesihatan merosot teruk dan bil hospital kecemasan berjumlah ${Utils.formatMoney(emergBill, s.countryId)}.`,
          'warning'
        );
      } else if (Utils.chance(0.75)) {
        // Burnout / Masuk Hospital (bil perubatan + rehat paksa)
        const hospBill = Utils.usdToLocal(Utils.randInt(650, 1800), s.countryId);
        s.money = Math.max(0, (s.money || 0) - hospBill);
        s.alignment.stress = Utils.clamp(stressNow - 15, 55, 100);
        if (s.job) s.job.performance = Utils.clamp((s.job.performance || 70) - 10, 15, 100);
        GameState.addJournalEntry(
          `🏥⚠️ BURNOUT & MASUK HOSPITAL (Stres ${stressNow}%): Akibat tekanan melampau, anda rebah keletihan dan terpaksa dimasukkan ke wad untuk rehat paksa! Bil rawatan: ${Utils.formatMoney(hospBill, s.countryId)} (Kesihatan -${hDrop}%, Gembira -${hapDrop}%).`,
          'warning'
        );
      } else {
        GameState.addJournalEntry(
          `🚨⚠️ AMARAN TEKANAN MELAMPAU (Stres ${stressNow}%): Tubuh dan minda anda berada di ambang kehancuran (Kesihatan -${hDrop}%, Gembira -${hapDrop}%)! Segera ambil Cuti Rehat atau Sesi Kaunseling sebelum terkena serangan jantung/strok!`,
          'warning'
        );
      }
    } else if (stressNow >= 75) {
      // PERINGKAT 2: 75–89% (BURNOUT / KRITIKAL)
      const hDrop = Utils.randInt(8, 15);
      const hapDrop = Utils.randInt(10, 15);
      GameState.adjustStats({ health: -hDrop, happiness: -hapDrop });

      const extraWarnings = [];

      // Peluang menghidap penyakit berkaitan stres (Darah Tinggi, Insomnia, Kemurungan)
      const possibleIllnesses = ['Darah Tinggi', 'Insomnia', 'Kemurungan'].filter(il => !s.stressIllnesses.includes(il));
      if (possibleIllnesses.length > 0 && Utils.chance(0.45)) {
        const newIllness = Utils.pick(possibleIllnesses);
        s.stressIllnesses.push(newIllness);
        extraWarnings.push(`Disahkan menghidap ${newIllness}`);
      }

      // Peluang cepat marah / bergaduh dengan pasangan atau keluarga (-10 Hubungan)
      const familyOrSpouse = (s.relationships || []).filter(r => r.alive && (r.id === s.partnerId || r.category === 'family' || r.category === 'spouse'));
      if (familyOrSpouse.length > 0 && Utils.chance(0.50)) {
        const targetRel = s.partnerId
          ? (familyOrSpouse.find(r => r.id === s.partnerId) || Utils.pick(familyOrSpouse))
          : Utils.pick(familyOrSpouse);
        if (targetRel) {
          targetRel.closeness = Utils.clamp((targetRel.closeness ?? 70) - 10, 5, 100);
          extraWarnings.push(`Pertengkaran emosi dengan ${targetRel.name} (-10% Hubungan)`);
        }
      }

      // Peluang menerima amaran prestasi di tempat kerja
      if (s.job && Utils.chance(0.45)) {
        s.job.performance = Utils.clamp((s.job.performance || 70) - 12, 15, 100);
        extraWarnings.push(`Amaran prestasi kerja sebagai ${s.job.title} (-12% Prestasi)`);
      }

      const detailTxt = extraWarnings.length > 0 ? ` Kesan sampingan: ${extraWarnings.join(' • ')}.` : '';
      GameState.addJournalEntry(
        `⚠️🧠 BURNOUT / STRES KRITIKAL (${stressNow}%): Tekanan melampau menjejaskan kesihatan (-${hDrop}%) dan kegembiraan (-${hapDrop}%) anda.${detailTxt}`,
        'warning'
      );
    } else if (stressNow >= 50) {
      // PERINGKAT 1: 50–74% (STRES TINGGI)
      const hapDrop = Utils.randInt(5, 10);
      GameState.adjustStats({ happiness: -hapDrop });
      GameState.addJournalEntry(
        `😓 Stres Tinggi (${stressNow}%): Beban tekanan tahun ini menurunkan kegembiraan anda (-${hapDrop}% Gembira) serta mengurangkan -10% peluang kenaikan pangkat, temu duga kerja dan misi Mod Khas.`,
        'warning'
      );
    }

    // Kesan berterusan penyakit stres aktif jika belum dirawat melalui Kaunseling/Terapi atau Doktor
    if (s.stressIllnesses.length > 0 && stressNow >= 50) {
      GameState.adjustStats({ health: -3, happiness: -3 });
    }

    // Penyejukan semula jadi ringan (hanya jika stres < 75%; jika >= 75% pemain perlu aktif berehat/bersenam/kaunseling)
    if (s.alignment.stress > 10 && stressNow < 75) {
      const stressCool = (s.retired || s.isRetired) ? Utils.randInt(4, 8) : Utils.randInt(2, 4);
      s.alignment.stress = Math.max(5, s.alignment.stress - stressCool);
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

    // 000. Gesaan Persaraan Wajib (Umur 60–65 bagi pekerjaan standard)
    if (window.EduCareerEngine && EduCareerEngine.checkMandatoryRetirementEvent) {
      const retEv = EduCareerEngine.checkMandatoryRetirementEvent(s);
      if (retEv) return retEv;
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

    // 0. Jemputan Sindiket Mafia (jika pemain aktif dalam jenayah: >= 3 jenayah berjaya / reputasi gelap tinggi)
    if (window.SpecialModesEngine && SpecialModesEngine.maybeTriggerMafiaRecruitmentEvent) {
      const mafiaEv = SpecialModesEngine.maybeTriggerMafiaRecruitmentEvent(s);
      if (mafiaEv) return mafiaEv;
    }

    // 0B. Tawaran "Peluang Sekali Seumur Hidup" Mod Khas (Umur 14+, tiada menu statik!)
    if (window.SpecialModesEngine && SpecialModesEngine.maybeTriggerLifetimeOffer) {
      const offerEv = SpecialModesEngine.maybeTriggerLifetimeOffer(s);
      if (offerEv) return offerEv;
    }

    // 0A. Risiko Berterusan "Burn Notice" Bekas Perisik (8–12% setahun)
    if (window.SpecialModesEngine && SpecialModesEngine.maybeTriggerBurnNoticeEvent) {
      const bnEv = SpecialModesEngine.maybeTriggerBurnNoticeEvent(s);
      if (bnEv) return bnEv;
    }

    // 0A1. Haba Polis > 70%: Risiko Dibuang Kerja (Nego 50/50) atau Ditangkap Polis (Rasuah 50/50, Lari 50/50, Penjara)
    const heatEv = this._maybeTriggerHighPoliceHeatEvent(s, c);
    if (heatEv) return heatEv;

    // 0A2. Krisis Mod Khas Mengejut pada Age-Up (15%–25% peluang setahun)
    if (window.SpecialModesEngine && SpecialModesEngine.maybeTriggerYearlyCrisisEvent) {
      const spCrisis = SpecialModesEngine.maybeTriggerYearlyCrisisEvent(s);
      if (spCrisis) return spCrisis;
    }

    // 0B. Red Flag / Jodoh Sejati Terbongkar daripada Aplikasi Sesi Date
    if (window.SocialMedia) {
      const rfEv = SocialMedia.checkPartnerHiddenTraitEvent(s);
      if (rfEv) return rfEv;
    }

    // 0B2. Konflik Hubungan / Rumah Tangga Tahunan (20–30%+ peluang jika stres/jenayah/Mod Khas)
    if (window.RelationshipDramaData && RelationshipDramaData.maybeBuildYearlyConflictEvent) {
      const dramaEv = RelationshipDramaData.maybeBuildYearlyConflictEvent(s);
      if (dramaEv) return dramaEv;
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

    // 6. Kolam Peristiwa Rawak Tahunan (Anti-Ulang 15 peristiwa terakhir — sentiasa segar setiap Age-Up!)
    if (!Array.isArray(s.recentRandomEventIds)) s.recentRandomEventIds = [];
    const recentSet = new Set(s.recentRandomEventIds);
    const recordRecent = (ev) => {
      if (!ev || !ev.id) return ev;
      s.recentRandomEventIds = [ev.id, ...s.recentRandomEventIds.filter(id => id !== ev.id)].slice(0, 15);
      const shuffledChoices = Array.isArray(ev.choices) ? [...ev.choices] : ev.choices;
      if (Array.isArray(shuffledChoices) && shuffledChoices.length > 1) {
        for (let i = shuffledChoices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledChoices[i], shuffledChoices[j]] = [shuffledChoices[j], shuffledChoices[i]];
        }
      }
      return { ...ev, choices: shuffledChoices, isAgeUpRandom: true };
    };

    const customRandomPool = (GAME_EVENTS.ageUpRandomPool || []).filter(
      e => s.age >= e.minAge && s.age <= e.maxAge && !recentSet.has(e.id)
    );
    if (customRandomPool.length > 0 && Utils.chance(0.75)) {
      return recordRecent(Utils.pick(customRandomPool));
    }

    const countryPool = (GAME_EVENTS.country[s.countryId] || []).filter(
      e => s.age >= e.minAge && s.age <= e.maxAge && !recentSet.has(e.id) && !s.seenEventIds.includes(e.id)
    );
    if (countryPool.length > 0 && Utils.chance(0.55)) {
      const picked = Utils.pick(countryPool);
      s.seenEventIds.push(picked.id);
      return recordRecent(picked);
    }

    const uniPool = (GAME_EVENTS.universal || []).filter(
      e => s.age >= e.minAge && s.age <= e.maxAge && !recentSet.has(e.id) && !s.seenEventIds.includes(e.id)
    );
    if (uniPool.length > 0 && Utils.chance(0.55)) {
      const picked = Utils.pick(uniPool);
      s.seenEventIds.push(picked.id);
      return recordRecent(picked);
    }

    // Jika masih ada dalam ageUpRandomPool yang belum baru muncul, pilih segera
    if (customRandomPool.length > 0) {
      return recordRecent(Utils.pick(customRandomPool));
    }

    // Gabungkan semua peristiwa sesuai umur yang tidak muncul dalam 15 pusingan terakhir
    const combinedFresh = [
      ...(GAME_EVENTS.ageUpRandomPool || []),
      ...(GAME_EVENTS.country[s.countryId] || []),
      ...(GAME_EVENTS.universal || [])
    ].filter(e => s.age >= e.minAge && s.age <= e.maxAge && !recentSet.has(e.id));

    if (combinedFresh.length > 0) {
      return recordRecent(Utils.pick(combinedFresh));
    }

    // Fallback mutlak jika kolam umur hampir habis: elakkan ulangan tahun sebelumnya sahaja
    const lastId = s.recentRandomEventIds[0] || null;
    const anyAgeAppropriate = [
      ...(GAME_EVENTS.ageUpRandomPool || []),
      ...(GAME_EVENTS.country[s.countryId] || []),
      ...(GAME_EVENTS.universal || [])
    ].filter(e => s.age >= e.minAge && s.age <= e.maxAge && e.id !== lastId);

    if (anyAgeAppropriate.length > 0) {
      return recordRecent(Utils.pick(anyAgeAppropriate));
    }

    return recordRecent(this._buildProceduralFiveChoiceEvent(s, c));
  },

  _maybeTriggerHighPoliceHeatEvent(s, c) {
    if (!s || (s.prison && s.prison.inPrison)) return null;
    const heat = (s.alignment && typeof s.alignment.notoriety === 'number') ? s.alignment.notoriety : 0;
    if (heat < 70 || s.age < 13) return null;
    if (!Utils.chance(0.55)) return null;

    const hasJob = Boolean(s.job);
    const triggerFiring = hasJob && Utils.chance(0.50);

    if (triggerFiring) {
      const jobTitle = s.job.title || 'pekerjaan semasa';
      return {
        id: `high_heat_job_firing_${s.year}`,
        icon: '📋',
        title: 'Notis Pemecatan Akibat Rekod Bermasalah',
        text: `Majikan mengetahui rekod bermasalah dan Haba Polis anda kini melebihi 70% (${heat}%). Pihak pengurusan memanggil anda untuk menamatkan jawatan ${jobTitle} serta-merta.`,
        choices: [
          {
            label: '🤝 Cuba Nego Dengan Majikan (50/50)',
            customAction: (st) => {
              if (Utils.chance(0.50)) {
                if (window.KarmaEndings) KarmaEndings.adjustAlignment({ notoriety: -5, stress: 6 });
                return {
                  outcome: `Rundingan berjaya! Majikan bersetuju memberi peluang terakhir untuk anda kekal sebagai ${jobTitle}.`,
                  toastType: 'success'
                };
              }
              st.job = null;
              st.jobTenure = 0;
              GameState.adjustStats({ happiness: -14 });
              if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: 12 });
              return {
                outcome: `Rundingan gagal! Majikan tetap memecat anda daripada jawatan ${jobTitle} serta-merta.`,
                toastType: 'error'
              };
            }
          },
          {
            label: '📦 Terima Pemecatan & Kemas Meja',
            customAction: (st) => {
              st.job = null;
              st.jobTenure = 0;
              GameState.adjustStats({ happiness: -10 });
              if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: 6 });
              return {
                outcome: `Anda menerima surat pemecatan daripada jawatan ${jobTitle} dan meninggalkan pejabat dengan hati berat.`,
                toastType: 'error'
              };
            }
          }
        ]
      };
    }

    if (window.PrisonFugitive && PrisonFugitive.buildPoliceArrestEvent) {
      return PrisonFugitive.buildPoliceArrestEvent(s, 'Rekod Haba Polis Tinggi', Utils.randInt(2, 5));
    }

    const bribeLocal = Utils.usdToLocal(s.age < 18 ? 300 : 2500, s.countryId);
    const bribeFormatted = Utils.formatMoney(bribeLocal, s.countryId);
    return {
      id: `high_heat_police_arrest_${s.year}`,
      icon: '🚨',
      title: 'Serbuan & Tangkapan Polis!',
      text: `Haba Polis anda sudah melebihi 70% (${heat}%)! Pasukan polis mengepung lokasi anda untuk membuat tangkapan atas rekod bermasalah anda. Apa tindakan anda?`,
      choices: [
        {
          label: `💵 Cuba Rasuah Pegawai (50/50) — ${bribeFormatted}`,
          customAction: (st) => {
            if (st.money < bribeLocal) {
              const yrs = Utils.randInt(2, 4);
              if (window.PrisonFugitive && PrisonFugitive.enterPrisonState) {
                PrisonFugitive.enterPrisonState(st, 'Rekod Haba Polis Tinggi & Cubaan Rasuah Gagal', yrs, 'medium');
              }
              return {
                outcome: `Wang tunai tidak mencukupi (${bribeFormatted}) untuk merasuah! Anda terus digari dan dijatuhi hukuman ${yrs} tahun.`,
                toastType: 'error'
              };
            }
            st.money -= bribeLocal;
            if (Utils.chance(0.50)) {
              if (window.KarmaEndings) KarmaEndings.adjustAlignment({ notoriety: -15, karma: -10, stress: 8 });
              return {
                outcome: `Rasuah ${bribeFormatted} berjaya! Pegawai itu menutup sebelah mata dan anda terlepas daripada tangkapan kali ini.`,
                toastType: 'success'
              };
            }
            const yrs = Utils.randInt(2, 5);
            if (window.PrisonFugitive && PrisonFugitive.enterPrisonState) {
              PrisonFugitive.enterPrisonState(st, 'Rekod Jenayah & Cubaan Rasuah Polis', yrs, 'medium');
            }
            return {
              outcome: `KANTOI MERASUAH! Pegawai itu menolak wang ${bribeFormatted}, menambah pertuduhan rasuah dan anda dihumban ke tahanan selama ${yrs} tahun!`,
              toastType: 'error'
            };
          }
        },
        {
          label: '🏃 Cuba Lari Daripada Polis (50/50)',
          customAction: (st) => {
            if (Utils.chance(0.50)) {
              if (window.KarmaEndings) KarmaEndings.adjustAlignment({ notoriety: -8, stress: 10 });
              return {
                outcome: 'Anda memecut melalui lorong belakang dan berjaya meloloskan diri daripada kepungan polis!',
                toastType: 'success'
              };
            }
            const yrs = Utils.randInt(2, 4);
            if (window.PrisonFugitive && PrisonFugitive.enterPrisonState) {
              PrisonFugitive.enterPrisonState(st, 'Melarikan Diri Daripada Tangkapan Polis', yrs, 'medium');
            }
            return {
              outcome: `Gagal melarikan diri! Polis berjaya memberkas anda dan anda dijatuhi hukuman tahanan selama ${yrs} tahun.`,
              toastType: 'error'
            };
          }
        },
        {
          label: '⛓️ Menyerah Diri & Masuk Penjara',
          customAction: (st) => {
            const yrs = Utils.randInt(1, 3);
            if (window.PrisonFugitive && PrisonFugitive.enterPrisonState) {
              PrisonFugitive.enterPrisonState(st, 'Siasatan Haba Polis Tinggi', yrs, 'minimum');
            }
            return {
              outcome: `Anda menyerah diri secara baik dan menerima hukuman tahanan selama ${yrs} tahun.`,
              toastType: 'error'
            };
          }
        }
      ]
    };
  },

  _buildProceduralFiveChoiceEvent(s, c) {
    const isChild = s.age < 13;
    const isTeen = s.age >= 13 && s.age < 18;
    const isSenior = s.age >= 60;
    const spendAmt = Utils.usdToLocal(isChild ? 15 : isTeen ? 45 : isSenior ? 180 : 140, s.countryId);

    if (isChild) {
      return {
        id: `proc_child_${s.age}_${Date.now()}`,
        icon: '🎈',
        title: `Pertandingan & Aktiviti Sekolah di ${s.city}`,
        text: `Guru kelas di ${c.name} mengajak murid-murid menyertai hari terbuka sekolah yang menawarkan pertandingan bakat, gerai buku, dan permainan kumpulan.`,
        choices: [
          {
            label: '🌟 Tampil Berani Menyertai Pertandingan Bakat',
            hint: 'Proaktif/Berani • Pintar ++, Gembira ++',
            outcome: 'Anda naik ke pentas dengan penuh yakin dan menerima tepukan gemuruh daripada guru serta rakan-rakan!',
            effects: { smarts: 6, happiness: 10 }
          },
          {
            label: '🤝 Bantu Guru & Bekerjasama Dalam Kumpulan',
            hint: 'Selamat/Diplomatik • Karma +, Kemesraan Rakan +',
            outcome: 'Sikap ringan tulang dan sopan santun anda dipuji oleh guru kelas serta mengeratkan hubungan dengan rakan sebaya.',
            effects: { happiness: 7, smarts: 4 },
            customAction: (state) => {
              if (state.alignment) state.alignment.karma = Utils.clamp((state.alignment.karma || 0) + 4, -100, 100);
              return {};
            }
          },
          {
            label: `📚 Beli Buku & Kit Eksperimen Sains (${Utils.formatMoney(spendAmt, s.countryId)})`,
            hint: 'Guna Wang/Sumber • Pintar +++',
            outcome: 'Anda menggunakan duit tabung untuk membeli buku rujukan menarik yang meluaskan pengetahuan anda.',
            effects: { smarts: 9, happiness: 5 },
            moneyUsd: -15
          },
          {
            label: '😜 Buat Nakal &Sorok Barang Kawan',
            hint: 'Berisiko/Nakal • Gembira +, Karma -',
            journalType: 'warning',
            outcome: 'Gurauan nakal anda membuat sebahagian kawan ketawa, tetapi guru disiplin memberi teguran tegas kepada anda.',
            effects: { happiness: 4, smarts: -2 },
            customAction: (state) => {
              if (state.alignment) state.alignment.karma = Utils.clamp((state.alignment.karma || 0) - 5, -100, 100);
              return {};
            }
          },
          {
            label: '😶 Duduk Diam di Sudut Kelas & Perhatikan Sahaja',
            hint: 'Abaikan/Elak • Tiada risiko, berehat',
            outcome: 'Anda memilih untuk berehat dengan tenang sambil memerhatikan gelagat rakan-rakan dari jauh.',
            effects: { health: 2 }
          }
        ]
      };
    }

    if (isTeen) {
      return {
        id: `proc_teen_${s.age}_${Date.now()}`,
        icon: '🎒',
        title: `Cabaran Remaja & Projek Belia ${s.city}`,
        text: `Sekumpulan pelajar dan belia di ${s.city}, ${c.name} sedang menganjurkan kem kepimpinan, bengkel kemahiran, serta aktiviti malam hujung minggu.`,
        choices: [
          {
            label: '🔥 Pimpin Kumpulan & Bentangkan Idea Utama',
            hint: 'Proaktif/Berani • Pintar ++, Populariti +',
            outcome: 'Kepimpinan berani anda menyerlahkan bakat sebenar dan menarik perhatian guru serta rakan-rakan!',
            effects: { smarts: 7, happiness: 8 },
            customAction: (state) => {
              if (state.alignment) state.alignment.fame = Utils.clamp((state.alignment.fame || 0) + 3, 0, 100);
              return {};
            }
          },
          {
            label: '🕊️ Jadi Pendamai & Bina Persahabatan Sihat',
            hint: 'Selamat/Diplomatik • Gembira ++, Karma +',
            outcome: 'Anda menjaga hubungan baik dengan semua pihak dan dihormati sebagai rakan yang matang.',
            effects: { happiness: 9, smarts: 3 },
            customAction: (state) => {
              if (state.alignment) state.alignment.karma = Utils.clamp((state.alignment.karma || 0) + 5, -100, 100);
              return {};
            }
          },
          {
            label: `💻 Daftar Bengkel Kemahiran & Tuisyen Khas (${Utils.formatMoney(spendAmt, s.countryId)})`,
            hint: 'Guna Wang/Sumber • Pintar +++, Penampilan +',
            outcome: 'Pelaburan ilmu pada usia remaja memberi kelebihan besar kepada persediaan peperiksaan anda.',
            effects: { smarts: 10, looks: 3, happiness: 4 },
            moneyUsd: -45
          },
          {
            label: '🏍️ Ponteng Sesi & Ikut Geng Melepak Lewat Malam',
            hint: 'Berisiko/Nakal • Keseronokan segera, Karma -, Risiko Stres',
            journalType: 'warning',
            outcome: 'Anda berseronok melepak sehingga lewat malam, namun hampir kantoi dengan peronda keselamatan tempatan!',
            effects: { happiness: 6, smarts: -3, health: -2 },
            customAction: (state) => {
              if (state.alignment) {
                state.alignment.karma = Utils.clamp((state.alignment.karma || 0) - 6, -100, 100);
                state.alignment.stress = Utils.clamp((state.alignment.stress || 0) + 5, 0, 100);
              }
              return {};
            }
          },
          {
            label: '🎧 Balik Awal & Berehat di Rumah Sahaja',
            hint: 'Abaikan/Elak • Stres -, Kesihatan +',
            outcome: 'Anda memilih untuk tidak terlibat dan meluangkan masa mendengar muzik serta berehat di bilik.',
            effects: { health: 4, happiness: 2 },
            customAction: (state) => {
              if (state.alignment) state.alignment.stress = Utils.clamp((state.alignment.stress || 0) - 4, 0, 100);
              return {};
            }
          }
        ]
      };
    }

    if (isSenior) {
      return {
        id: `proc_senior_${s.age}_${Date.now()}`,
        icon: '🌅',
        title: `Wacana Komuniti & Kesihatan Warga Emas di ${s.city}`,
        text: `Komuniti setempat di ${s.city}, ${c.name} menjemput warga berpengalaman untuk berkongsi nasihat kehidupan, menyertai pemeriksaan kesihatan, atau menyumbang kepada dana kebajikan.`,
        choices: [
          {
            label: '🎙️ Tampil Berucap & Kongsi Pengalaman Hidup',
            hint: 'Proaktif/Berani • Gembira ++, Reputasi Keluarga +',
            outcome: 'Kisah pengalaman hidup anda memberi inspirasi mendalam kepada generasi muda di komuniti tersebut!',
            effects: { happiness: 11, smarts: 3 },
            customAction: (state) => {
              if (window.Dynasty) Dynasty.adjustReputation(3);
              if (state.alignment) state.alignment.karma = Utils.clamp((state.alignment.karma || 0) + 5, -100, 100);
              return {};
            }
          },
          {
            label: '🍵 Berbual Mesra &Jalin Silaturahim Bersama Jiran',
            hint: 'Selamat/Diplomatik • Gembira +, Stres -',
            outcome: 'Suasana petang yang harmoni bersama rakan seusia membuatkan hati anda tenang dan dihargai.',
            effects: { happiness: 8, health: 3 },
            customAction: (state) => {
              if (state.alignment) state.alignment.stress = Utils.clamp((state.alignment.stress || 0) - 6, 0, 100);
              return {};
            }
          },
          {
            label: `🩺 Ambil Pakej Pemeriksaan & Terapi Kesihatan (${Utils.formatMoney(spendAmt, s.countryId)})`,
            hint: 'Guna Wang/Sumber • Kesihatan +++, Gembira +',
            outcome: 'Rawatan fisioterapi dan saringan kesihatan menyeluruh memastikan tubuh anda kekal cergas.',
            effects: { health: 12, happiness: 6 },
            moneyUsd: -180
          },
          {
            label: '🎲 Cuba Pelaburan Spekulatif Jangka Pendek',
            hint: 'Berisiko/Nakal • Peluang untung tunai atau rugi kecil',
            journalType: 'dilemma',
            customAction: (state) => {
              const win = Utils.chance(0.45);
              const delta = Utils.usdToLocal(win ? 420 : -260, state.countryId);
              state.money += delta;
              GameState.adjustStats({ happiness: win ? 7 : -6 });
              return {
                outcome: win
                  ? `Langkah berani anda membuahkan hasil tambahan ${Utils.formatMoney(delta, state.countryId)}!`
                  : `Keputusan terburu-buru menyebabkan anda kerugian ${Utils.formatMoney(Math.abs(delta), state.countryId)}.`,
                toastType: win ? 'success' : 'error'
              };
            }
          },
          {
            label: '🏡 Berehat Tenang di Rumah Bersama Keluarga',
            hint: 'Abaikan/Elak • Tiada risiko, ketenangan jiwa',
            outcome: 'Anda memilih untuk berehat di rumah sambil menikmati udara segar tanpa sebarang gangguan.',
            effects: { health: 4, happiness: 3 }
          }
        ]
      };
    }

    return {
      id: `proc_adult_${s.age}_${Date.now()}`,
      icon: '🌆',
      title: `Peluang & Dilema Harian di ${s.city}`,
      text: `Ketika menjalani rutin tahun ini di ${s.city}, ${c.name}, anda berdepan dengan peluang jaringan profesional, cabaran komuniti setempat, serta tawaran urus niaga sampingan.`,
      choices: [
        {
          label: '🚀 Sahut Cabaran & Ambil Langkah Proaktif',
          hint: 'Proaktif/Berani • Pintar ++, Gembira ++, Peluang Reputasi',
          outcome: 'Keberanian anda mengambil inisiatif membuka ruang baharu dan meningkatkan keyakinan diri!',
          effects: { smarts: 6, happiness: 9, adaptation: 5 },
          customAction: (state) => {
            if (state.job) state.job.performance = Utils.clamp((state.job.performance || 70) + 5, 0, 100);
            return {};
          }
        },
        {
          label: '🤝 Gunakan Pendekatan Diplomatik & Berhemah',
          hint: 'Selamat/Diplomatik • Karma +, Hubungan +, Stres -',
          outcome: 'Pendekatan berhemah anda menyelesaikan situasi dengan harmoni dan disenangi semua pihak.',
          effects: { happiness: 7, adaptation: 4 },
          customAction: (state) => {
            if (state.alignment) {
              state.alignment.karma = Utils.clamp((state.alignment.karma || 0) + 5, -100, 100);
              state.alignment.stress = Utils.clamp((state.alignment.stress || 0) - 4, 0, 100);
            }
            return {};
          }
        },
        {
          label: `💼 Laburkan Wang Untuk Urusan & Kemudahan (${Utils.formatMoney(spendAmt, s.countryId)})`,
          hint: 'Guna Wang/Sumber • Selesai pantas, Pintar +, Kesihatan +',
          outcome: 'Anda menggunakan sumber kewangan dengan bijak untuk melancarkan urusan dan menjaga keselesaan diri.',
          effects: { smarts: 5, health: 5, happiness: 6 },
          moneyUsd: -140
        },
        {
          label: '🕶️ Ambil Jalan Pintas Berisiko Tinggi',
          hint: 'Berisiko/Nakal • Peluang wang segera tetapi Karma - & Stres +',
          journalType: 'dilemma',
          customAction: (state) => {
            const win = Utils.chance(0.50);
            const amt = Utils.usdToLocal(win ? 550 : -320, state.countryId);
            state.money += amt;
            if (state.alignment) {
              state.alignment.karma = Utils.clamp((state.alignment.karma || 0) - 6, -100, 100);
              state.alignment.stress = Utils.clamp((state.alignment.stress || 0) + 7, 0, 100);
            }
            GameState.adjustStats({ happiness: win ? 6 : -7 });
            return {
              outcome: win
                ? `Jalan pintas berisiko memberikan anda keuntungan segera ${Utils.formatMoney(amt, state.countryId)}, walaupun hati sedikit gusar.`
                : `Rancangan berisiko gagal dan menyebabkan anda kerugian ${Utils.formatMoney(Math.abs(amt), state.countryId)}!`,
              toastType: win ? 'culture' : 'error'
            };
          }
        },
        {
          label: '🚶 Abaikan & Fokus Pada Rutin Sendiri',
          hint: 'Abaikan/Elak • Kekal selamat tanpa gangguan',
          outcome: 'Anda memilih untuk tidak mencampuri urusan tersebut dan meneruskan kehidupan harian dengan tenang.',
          effects: { health: 2, happiness: 2 }
        }
      ]
    };
  },

  _ensureAtLeastFiveChoices(ev, s, c) {
    if (!ev || !Array.isArray(ev.choices)) return ev;
    if (ev.choices.length >= 5) return ev;

    const existingLabels = new Set(ev.choices.map(ch => (ch.label || '').trim().toLowerCase()));
    const isChild = s.age < 13;
    const isTeen = s.age >= 13 && s.age < 18;
    const isSenior = s.age >= 60;
    const resourceCostLocal = Utils.usdToLocal(isChild ? 12 : isTeen ? 35 : 120, s.countryId);

    const candidateExtras = [
      {
        label: isChild
          ? '🌟 Cuba Selesaikan Sendiri Dengan Berani'
          : isTeen
            ? '🔥 Tampil Berani Mengambil Inisiatif'
            : '🚀 Ambil Langkah Proaktif & Berani Hadapi Situasi',
        hint: 'Tindakan proaktif • Pintar +, Gembira +',
        journalType: 'culture',
        customAction: (state) => {
          GameState.adjustStats({ smarts: 4, happiness: 6 });
          if (state.alignment) state.alignment.fame = Utils.clamp((state.alignment.fame || 0) + 2, 0, 100);
          return {
            outcome: `Anda mengambil pendekatan proaktif dan berani menghadapi situasi tersebut dengan penuh keyakinan.`,
            toastType: 'culture'
          };
        }
      },
      {
        label: isChild
          ? '🤝 Minta Nasihat Ibu Bapa & Guru Secara Sopan'
          : '🕊️ Gunakan Pendekatan Diplomatik & Berbincang Baik-Baik',
        hint: 'Pendekatan selamat/diplomatik • Karma +, Stres -',
        journalType: 'culture',
        customAction: (state) => {
          GameState.adjustStats({ happiness: 5, smarts: 2 });
          if (state.alignment) {
            state.alignment.karma = Utils.clamp((state.alignment.karma || 0) + 5, -100, 100);
            state.alignment.stress = Utils.clamp((state.alignment.stress || 0) - 4, 0, 100);
          }
          return {
            outcome: `Pendekatan diplomatik dan berbudi bahasa membantu menjernihkan keadaan tanpa mencetuskan sebarang konflik.`,
            toastType: 'success'
          };
        }
      },
      {
        label: isChild
          ? `🎁 Gunakan Duit Tabung Untuk Selesaikan (${Utils.formatMoney(resourceCostLocal, s.countryId)})`
          : `💳 Gunakan Wang & Sumber Untuk Selesaikan Segera (${Utils.formatMoney(resourceCostLocal, s.countryId)})`,
        hint: 'Guna wang/sumber • Pantas & mengurangkan tekanan',
        journalType: 'culture',
        customAction: (state) => {
          if ((state.money || 0) >= resourceCostLocal) {
            state.money -= resourceCostLocal;
            GameState.adjustStats({ happiness: 7, health: 3 });
            if (state.alignment) state.alignment.stress = Utils.clamp((state.alignment.stress || 0) - 6, 0, 100);
            return {
              outcome: `Anda membelanjakan ${Utils.formatMoney(resourceCostLocal, state.countryId)} bagi menyelesaikan urusan tersebut dengan pantas dan selesa.`,
              toastType: 'success'
            };
          }
          GameState.adjustStats({ happiness: -3 });
          return {
            outcome: `Baki tunai tidak mencukupi (${Utils.formatMoney(resourceCostLocal, state.countryId)}), lalu anda terpaksa mencari jalan alternatif.`,
            toastType: 'error'
          };
        }
      },
      {
        label: isChild
          ? '😜 Bertindak Nakal & Ikut Kata Hati'
          : isSenior
            ? '🎲 Ambil Risiko Berani TanpaPedulikan Kritikan'
            : '🕶️ Ambil Jalan Pintas Berisiko Demi Kelebihan Diri',
        hint: 'Tindakan berisiko/nakal • Peluang untung atau padah (Karma -)',
        journalType: 'dilemma',
        customAction: (state) => {
          const lucky = Utils.chance(0.48);
          const cashDelta = isChild ? 0 : Utils.usdToLocal(lucky ? 280 : -180, state.countryId);
          state.money = (state.money || 0) + cashDelta;
          if (state.alignment) {
            state.alignment.karma = Utils.clamp((state.alignment.karma || 0) - 5, -100, 100);
            state.alignment.stress = Utils.clamp((state.alignment.stress || 0) + 5, 0, 100);
          }
          GameState.adjustStats({ happiness: lucky ? 6 : -6 });
          return {
            outcome: lucky
              ? `Langkah berisiko anda berhasil memberi kelebihan${cashDelta > 0 ? ` (+${Utils.formatMoney(cashDelta, state.countryId)})` : ''}, walaupun sedikit mencalar reputasi.`
              : `Tindakan berisiko itu memakan diri dan menimbulkan rasa kurang senang orang sekeliling.`,
            toastType: lucky ? 'culture' : 'error'
          };
        }
      },
      {
        label: '🚶 Abaikan & Elak Daripada Terlibat',
        hint: 'Abaikan/elak • Kekal tenang & jaga kesihatan diri',
        journalType: 'normal',
        customAction: (state) => {
          GameState.adjustStats({ health: 2, happiness: 1 });
          if (state.alignment) state.alignment.stress = Utils.clamp((state.alignment.stress || 0) - 3, 0, 100);
          return {
            outcome: `Anda memilih untuk tidak mencampuri hal tersebut dan meneruskan rutin harian dengan tenang.`,
            toastType: 'culture'
          };
        }
      }
    ];

    const newChoices = [...ev.choices];
    for (const extra of candidateExtras) {
      if (newChoices.length >= 5) break;
      const norm = extra.label.trim().toLowerCase();
      if (!existingLabels.has(norm)) {
        existingLabels.add(norm);
        newChoices.push(extra);
      }
    }

    return {
      ...ev,
      choices: newChoices
    };
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

  _enforceExactlyThreeChoices(ev, s, c) {
    if (!ev || !Array.isArray(ev.choices)) return ev;
    if (ev.id && /^(uni_child_talent|npc_death_|court_trial_|police_arrest_)/.test(ev.id)) {
      return ev;
    }

    const shuffle = (arr) => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };

    // Salin pilihan & buang sebarang hint spoiler
    let pool = ev.choices.map(ch => {
      const cleaned = { ...ch };
      delete cleaned.hint;
      return cleaned;
    });

    // Jika kurang daripada 3 pilihan, tambah pilihan kontekstual Bahasa Melayu
    if (pool.length < 3) {
      const existingLabels = new Set(pool.map(ch => (ch.label || '').trim().toLowerCase()));
      const isChild = s.age < 13;
      const fallbacks = [
        {
          label: isChild ? 'Bertenang dan minta nasihat orang dewasa' : 'Tarik nafas tenang dan ambil pendekatan berkecuali',
          tone: 'neutral',
          outcome: isChild
            ? 'Anda memilih untuk bertenang dan mendapatkan pandangan orang dewasa sebelum bertindak.'
            : 'Anda memilih untuk kekal tenang dan memerhati keadaan tanpa terburu-buru.'
        },
        {
          label: isChild ? 'Cuba selesaikan sendiri dengan cara paling baik' : 'Bantu selesaikan keadaan secara berhemah',
          tone: 'helpful',
          outcome: 'Pendekatan berhemah anda memberi kesan positif terhadap keadaan sekeliling.'
        },
        {
          label: isChild ? 'Buat keputusan spontan tanpa berfikir panjang' : 'Bertindak berani di luar kebiasaan walaupun berisiko',
          tone: 'risky',
          outcome: 'Langkah spontan anda mencetuskan reaksi yang tidak dijangka daripada orang di sekeliling!'
        }
      ];
      for (const fb of fallbacks) {
        if (pool.length >= 3) break;
        if (!existingLabels.has(fb.label.toLowerCase())) {
          pool.push(fb);
          existingLabels.add(fb.label.toLowerCase());
        }
      }
    }

    // Jika lebih daripada 3 pilihan, sampel 3 secara rawak; sentiasa kocok susunan paparan
    const selected = shuffle(pool).slice(0, 3);
    return {
      ...ev,
      isAgeUpRandom: true,
      choices: selected
    };
  },

  _inferChoiceTone(choice) {
    if (choice && choice.tone) return choice.tone;
    if (choice && choice.journalType === 'warning') return 'risky';
    const lbl = ((choice && choice.label) || '').toLowerCase();
    if (/tolong|bantu|serah|pulang|jujur|sopan|maaf|nasihat|tenang|derma|pertahan|tegur/.test(lbl)) return 'helpful';
    if (/curi|ambil wang|tipu|gaduh|kasar|marah|kejar|baling|ponteng|sorok|bawah meja|sindiran|bising|nakal|lari/.test(lbl)) return 'risky';
    return 'neutral';
  },

  _applyRandomizedAgeUpOutcome(s, choice, event) {
    if (!s) return '';
    if (!s.alignment || typeof s.alignment !== 'object') {
      s.alignment = { karma: 0, fame: 0, peakFame: 0, notoriety: 0, stress: 10 };
    }
    const a = s.alignment;
    if (typeof a.karma !== 'number') a.karma = 0;
    if (typeof a.fame !== 'number') a.fame = 0;
    if (typeof a.notoriety !== 'number') a.notoriety = 0;
    if (typeof a.stress !== 'number') a.stress = 10;

    const tone = this._inferChoiceTone(choice);
    // Haba Polis hanya boleh terkesan oleh pilihan berisiko/jenayah — BUKAN kematian semula jadi, kemalangan atau kematian NPC
    const evText = `${(event && event.title) || ''} ${(event && event.text) || ''} ${(event && event.id) || ''}`.toLowerCase();
    const isDeathEvent = /meninggal|kematian|arwah|pemergian|maut|jenazah|pengebumian|berkabung|death|died|funeral|bereave/.test(evText);
    const statKeys = (tone === 'risky' && !isDeathEvent)
      ? ['karma', 'fame', 'notoriety', 'smarts', 'stress']
      : ['karma', 'fame', 'smarts', 'stress'];
    // Kocok susunan dan pilih 2–4 statistik untuk dikemas kini secara rawak
    for (let i = statKeys.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [statKeys[i], statKeys[j]] = [statKeys[j], statKeys[i]];
    }
    const pickedKeys = statKeys.slice(0, Math.min(statKeys.length, Utils.randInt(2, 4)));

    const labelMap = {
      karma: 'Karma',
      fame: 'Populariti',
      notoriety: 'Haba Polis',
      smarts: 'Kepintaran',
      stress: 'Stres'
    };

    if (!s.stats) s.stats = { health: 80, happiness: 80, smarts: 50, looks: 50 };
    if (typeof s.stats.smarts !== 'number') s.stats.smarts = 50;

    const parts = [];
    for (const key of pickedKeys) {
      const mag = Utils.randInt(5, 15);
      const twist = Utils.chance(0.22);
      let sign = 1;

      if (tone === 'helpful') {
        if (key === 'karma') sign = twist ? -1 : 1;
        else if (key === 'fame') sign = twist ? -1 : 1;
        else if (key === 'smarts') sign = twist ? -1 : 1;
        else if (key === 'notoriety') sign = twist ? 1 : -1;
        else if (key === 'stress') sign = twist ? 1 : -1;
      } else if (tone === 'risky') {
        if (key === 'karma') sign = twist ? 1 : -1;
        else if (key === 'fame') sign = Utils.chance(0.35) ? 1 : -1;
        else if (key === 'smarts') sign = twist ? 1 : -1;
        else if (key === 'notoriety') sign = twist ? -1 : 1;
        else if (key === 'stress') sign = twist ? -1 : 1;
      } else {
        // neutral: campuran rawak ringan
        if (key === 'karma') sign = Utils.chance(0.55) ? 1 : -1;
        else if (key === 'fame') sign = Utils.chance(0.50) ? 1 : -1;
        else if (key === 'smarts') sign = Utils.chance(0.50) ? 1 : -1;
        else if (key === 'notoriety') sign = Utils.chance(0.35) ? 1 : -1;
        else if (key === 'stress') sign = Utils.chance(0.45) ? 1 : -1;
      }

      const prevVal = key === 'smarts' ? s.stats.smarts : a[key];
      let delta = sign * mag;

      // Kendali statistik 0–100 yang bermula pada 0 (atau 100) supaya kesan sentiasa nyata
      if (key !== 'karma') {
        if (prevVal <= 0 && delta < 0) delta = Math.abs(delta);
        else if (prevVal >= 100 && delta > 0) delta = -Math.abs(delta);
      } else {
        if (prevVal <= -100 && delta < 0) delta = Math.abs(delta);
        else if (prevVal >= 100 && delta > 0) delta = -Math.abs(delta);
      }

      const nextVal = key === 'karma'
        ? Math.max(-100, Math.min(100, prevVal + delta))
        : Math.max(0, Math.min(100, prevVal + delta));
      const actualDelta = nextVal - prevVal;
      if (key === 'smarts') {
        s.stats.smarts = nextVal;
      } else {
        a[key] = nextVal;
      }
      if (key === 'fame') {
        a.peakFame = Math.max(a.peakFame || 0, nextVal);
      }
      if (actualDelta !== 0) {
        parts.push(`${labelMap[key]} ${actualDelta > 0 ? `+${actualDelta}` : actualDelta}`);
      }
    }

    return parts.join(' • ');
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
    let openDivorceModal = null;
    let toastType = choice.journalType === 'warning' ? 'error' : 'culture';

    if (typeof choice.customAction === 'function') {
      const res = choice.customAction(s, c) || {};
      if (res.outcome) outcome = res.outcome;
      if (res.nextEvent) nextEvent = res.nextEvent;
      if (res.openDivorceModal) openDivorceModal = res.openDivorceModal;
      if (res.toastType) toastType = res.toastType;
    }

    // Untuk peristiwa rawak Age-Up, laksanakan kemas kini dinamik Karma, Populariti, Haba Polis & Stres
    if (event && event.isAgeUpRandom && !nextEvent) {
      const statSummary = this._applyRandomizedAgeUpOutcome(s, choice, event);
      if (statSummary) {
        outcome = outcome ? `${outcome} (${statSummary})` : statSummary;
      }
    }

    if (!nextEvent && outcome) {
      GameState.addJournalEntry(`${event.icon} ${event.title}: ${outcome}`, choice.journalType || 'culture');
    }
    GameState.save();
    return { outcome, nextEvent, openDivorceModal, toastType };
  },

  // --------------------------------------------------------------------------
  // ENJIN HIJRAH — Pertukaran Budaya Penuh Sebaik Tiba! (Termasuk Perbincangan Pasangan & Anak-Anak)
  // --------------------------------------------------------------------------
  getMigrationCostLocal(targetCountryId) {
    const s = GameState.current;
    const target = Utils.getCountry(targetCountryId);
    const alreadyCitizen = s.citizenships.includes(targetCountryId);
    const totalUsd = target.flightBaseUsd + (alreadyCitizen ? 0 : target.visaFeeUsd);
    return Utils.usdToLocal(totalUsd, s.countryId);
  },

  getMarriedSpouse(s = GameState.current) {
    if (!s || !s.married || !s.partnerId || !Array.isArray(s.relationships)) return null;
    return s.relationships.find(r => r.id === s.partnerId && r.alive) || null;
  },

  getDependentChildren(s = GameState.current) {
    if (!s || !Array.isArray(s.relationships)) return [];
    return s.relationships.filter(r =>
      ['Anak Lelaki', 'Anak Perempuan', 'Son', 'Daughter'].includes(r.role) && r.alive && r.age < 18
    );
  },

  rollSpouseMigrationDecision(s = GameState.current, targetCountryId) {
    const spouse = this.getMarriedSpouse(s);
    const toC = Utils.getCountry(targetCountryId);
    const fromC = Utils.getCountry(s.countryId);
    // Peluang asas 50% setuju ikut vs 50% enggan
    const agreed = Utils.chance(0.50);
    const refusalReasons = [
      `Saya sudah selesa dengan kerjaya saya sebagai ${spouse ? (spouse.job || 'pekerja tetap') : 'pekerja'} di ${fromC.name} dan berat hati mahu memulakan semula dari kosong di ${toC.name}.`,
      `Ibu bapa dan keluarga saya semuanya berada di ${fromC.name}. Saya tidak sanggup berjauhan dengan mereka di tanah air.`,
      `Kos sara hidup dan perbezaan budaya di ${toC.name} terlalu asing bagi saya — saya lebih bahagia kita kekal menetap di ${fromC.name}.`
    ];
    const agreeReasons = [
      `Ke mana sahaja awak pergi demi masa depan keluarga kita, saya sanggup ikut berhijrah ke ${toC.name} bersama anak-anak!`,
      `Walaupun berat meninggalkan ${fromC.name}, saya yakin penghijrahan ke ${toC.name} akan membuka rezeki dan peluang baharu untuk keluarga kita.`
    ];
    return {
      agreed,
      spouse,
      dialogue: agreed ? Utils.pick(agreeReasons) : Utils.pick(refusalReasons)
    };
  },

  persuadeSpouseToMigrate(s = GameState.current, targetCountryId) {
    const spouse = this.getMarriedSpouse(s);
    if (!spouse) return { ok: false, agreed: false, msg: 'Tiada pasangan berkahwin.' };
    const toC = Utils.getCountry(targetCountryId);
    // Peluang pujukan ~30%–45% mengikut Kemesraan, Kepercayaan & Kepintaran
    const closeness = spouse.closeness ?? 70;
    const trust = spouse.trust ?? 70;
    const smarts = (s.stats && s.stats.smarts) ?? 65;
    const chance = Math.max(0.28, Math.min(0.48, 0.25 + ((closeness - 50) / 100) * 0.12 + ((trust - 50) / 100) * 0.12 + ((smarts - 50) / 100) * 0.08));

    if (Utils.chance(chance)) {
      spouse.closeness = Utils.clamp(closeness + 4, 0, 100);
      GameState.addJournalEntry(
        `💬 Selepas dipujuk dengan penuh kasih sayang dan jaminan masa depan yang kukuh, ${spouse.name} akhirnya lembut hati dan bersetuju mengikut anda berhijrah ke ${toC.name} ${toC.flag}!`,
        'romance'
      );
      GameState.save();
      return {
        ok: true,
        agreed: true,
        chance,
        dialogue: `"Baiklah sayang... melihat kesungguhan awak merancang masa depan keluarga kita, saya setuju ikut berpindah ke ${toC.name} bersama anak-anak!"`,
        msg: `${spouse.name} lembut hati dan bersetuju mengikut anda ke ${toC.name}!`
      };
    }

    spouse.closeness = Utils.clamp(closeness - 8, 10, 100);
    spouse.trust = Utils.clamp(trust - 6, 10, 100);
    GameState.addJournalEntry(
      `💔 Pujukan anda gagal melembutkan hati ${spouse.name}. Dia tetap berkeras enggan meninggalkan tanah air untuk berpindah ke ${toC.name}.`,
      'warning'
    );
    GameState.save();
    return {
      ok: false,
      agreed: false,
      chance,
      dialogue: `"Keputusan saya muktamad! Saya tetap tidak mahu berpindah ke ${toC.name}. Kalau awak berkeras mahu pergi juga, terpaksalah kita membawa haluan masing-masing!"`,
      msg: `Pujukan gagal — ${spouse.name} tetap enggan berhijrah ke ${toC.name}.`
    };
  },

  migrateToCountry(targetCountryId, visaType = 'work', opts = {}) {
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

    const travelHeat = (s.alignment && s.alignment.notoriety) || 0;
    if (travelHeat >= 70 && Utils.chance(0.55)) {
      const yrs = Utils.randInt(1, 3);
      if (window.PrisonFugitive && PrisonFugitive.enterPrisonState) {
        PrisonFugitive.enterPrisonState(s, 'Ditahan Imigresen di Sempadan (Haba Polis Tinggi)', yrs, 'medium');
      } else if (window.PrisonEngine && PrisonEngine.sendToPrison) {
        PrisonEngine.sendToPrison(s, 'Ditahan di Sempadan (Haba Polis Tinggi)', yrs);
      }
      GameState.addJournalEntry(
        `🚨 DITAHAN DI SEMPADAN! Pihak imigresen mengesan Haba Polis anda (${travelHeat}%) ketika cuba keluar negara dan menyerahkan anda kepada polis (penjara ${yrs} tahun).`,
        'warning'
      );
      GameState.save();
      return { ok: false, msg: `🚨 DITAHAN DI SEMPADAN! Imigresen mengesan Haba Polis anda (${travelHeat}%) dan menahan anda!` };
    }

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

    const spouse = this.getMarriedSpouse(s);
    const dependentKids = this.getDependentChildren(s);

    // Jika berkeras berhijrah walaupun pasangan menolak -> laksanakan Auto-Cerai di negara asal sebelum berlepas!
    let divorcedExSpouse = null;
    if (spouse && opts && opts.stubbornAutoDivorce) {
      divorcedExSpouse = spouse;
      spouse.countryId = fromC.id;
      spouse.country = fromC.id;
      if (window.LegalInheritanceEngine && LegalInheritanceEngine.executeDivorce) {
        LegalInheritanceEngine.executeDivorce(s, spouse.id, {
          settlementMode: 'mutual'
        });
      } else {
        s.partnerId = null;
        s.married = false;
        spouse.category = 'ex';
        spouse.role = 'Bekas Pasangan (Cerai)';
      }
      // Pastikan baki tunai masih mencukupi untuk kos tiket atau benarkan diteruskan selepas penyelesaian harta
      if (s.money < costLocal) {
        s.money = costLocal;
      }
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
    s.country = toC.id;
    s.city = newCity;
    s.residencyStatus = statusLabel;
    s.yearsInCurrentCountry = 0;

    // Kemas kini negara bagi pasangan (jika ikut bersama) & semua anak tanggungan (umur < 18 sentiasa ikut pemain!)
    const activeSpouseNow = this.getMarriedSpouse(s);
    if (activeSpouseNow && (!opts || opts.spouseFollows !== false)) {
      activeSpouseNow.countryId = toC.id;
      activeSpouseNow.country = toC.id;
    }
    for (const kid of dependentKids) {
      kid.countryId = toC.id;
      kid.country = toC.id;
    }

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

    let familyMoveNote = '';
    if (divorcedExSpouse) {
      const kidsNote = dependentKids.length > 0
        ? `; anak-anak (${dependentKids.map(k => k.name).join(', ')}) ikut berpindah bersama anda`
        : '';
      GameState.addJournalEntry(
        `💔✈️ Bercerai kerana pasangan (${divorcedExSpouse.name}) enggan mengikut berhijrah ke ${toC.name} ${toC.flag}${kidsNote}. ${divorcedExSpouse.name} kekal menetap di ${fromC.name}.`,
        'warning'
      );
      familyMoveNote = dependentKids.length > 0
        ? ` Anak-anak bawah umur (${dependentKids.length} orang) turut berpindah bersama anda.`
        : '';
    } else if (activeSpouseNow) {
      familyMoveNote = dependentKids.length > 0
        ? ` Pasangan anda (${activeSpouseNow.name}) dan ${dependentKids.length} orang anak turut berhijrah bersama-sama!`
        : ` Pasangan anda (${activeSpouseNow.name}) turut berhijrah bersama-sama!`;
    } else if (dependentKids.length > 0) {
      familyMoveNote = ` Anak-anak tanggungan anda (${dependentKids.length} orang) turut berpindah bersama anda!`;
    }

    const liqNote = liquidated > 0 ? ' (termasuk jualan hartanah/kenderaan)' : '';
    GameState.addJournalEntry(
      `✈️ BERHIJRAH KE ${toC.name.toUpperCase()} ${toC.flag}! Anda selamat tiba di ${newCity} dengan ${App._residencyLabel(statusLabel)}.${familyMoveNote} Wang anda ditukar daripada ${oldMoneyFormatted} kepada ${newMoneyFormatted}${liqNote}.${arrivalRoleNote} Budaya, kerja, hartanah & perayaan kini mengikut budaya ${toC.name}!`,
      'migration'
    );
    GameState.adjustStats({ happiness: divorcedExSpouse ? -8 : 14 });
    GameState.save();

    return {
      ok: true,
      divorcedOnMigration: Boolean(divorcedExSpouse),
      movedKidsCount: dependentKids.length,
      msg: divorcedExSpouse
        ? `Berhijrah ke ${newCity}, ${toC.name} ${toC.flag} selepas bercerai dengan ${divorcedExSpouse.name}${dependentKids.length > 0 ? ` (${dependentKids.length} anak ikut bersama)` : ''}.`
        : `Selamat tiba di ${newCity}, ${toC.name} ${toC.flag}!`,
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
    const jobHeat = (s.alignment && s.alignment.notoriety) || 0;
    if (jobHeat >= 40 && !(s.fugitive && (s.fugitive.fakeIdentityTier === 'pro' || s.fugitive.hiddenPast))) {
      const heatRejectChance = jobHeat >= 70 ? 0.85 : 0.65;
      if (Utils.chance(heatRejectChance)) {
        GameState.addJournalEntry(
          `🚔 Permohonan kerja "${jobDef.title}" ditolak selepas semakan latar belakang mengesan Haba Polis anda (${jobHeat}%).`,
          'warning'
        );
        GameState.save();
        return { ok: false, msg: `🚔 Permohonan ditolak! Haba Polis anda terlalu tinggi (${jobHeat}%) semasa semakan latar belakang.` };
      }
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
    const curStress = (s.alignment && s.alignment.stress) || 0;
    const baseRaiseChance = curStress >= 50 ? 0.25 : 0.35; // -10% jika Stres >= 50%
    if ((s.job.performance >= 72 && (curStress < 50 || Utils.chance(0.90))) || Utils.chance(baseRaiseChance)) {
      const pct = Utils.randInt(6, 14);
      s.job.salary = Math.round(s.job.salary * (1 + pct / 100));
      GameState.adjustStats({ happiness: 10 });
      GameState.addJournalEntry(`💰 Kenaikan gaji diluluskan! Gaji anda naik ${pct}% kepada ${Utils.formatMoney(s.job.salary, s.countryId)}/thn.`, 'milestone');
      GameState.save();
      return { ok: true, msg: `Kenaikan gaji diluluskan (+${pct}%)!` };
    }
    GameState.adjustStats({ happiness: -4 });
    GameState.addJournalEntry(`💼 Majikan menolak permohonan naik gaji anda. Terus tingkatkan prestasi & kawal tekanan kerja!`);
    GameState.save();
    return { ok: false, msg: 'Permohonan naik gaji ditolak tahun ini.' };
  },

  // --------------------------------------------------------------------------
  // AKTIVITI PENGURANGAN STRES (COUNTER-PLAY)
  // --------------------------------------------------------------------------
  doExerciseJogging() {
    const s = GameState.current;
    if (!s) return { ok: false, msg: 'Tiada watak aktif.' };
    if (s.yearlyActions.gym) return { ok: false, msg: 'Anda sudah bersenam / joging tahun ini!' };
    const cost = s.age < 18 ? 0 : Utils.usdToLocal(25, s.countryId);
    if (s.money < cost) return { ok: false, msg: `Perlukan ${Utils.formatMoney(cost, s.countryId)} untuk keahlian gim & peralatan senaman.` };

    s.money -= cost;
    s.yearlyActions.gym = true;
    const stressDrop = Utils.randInt(8, 12);
    const healthGain = Utils.randInt(6, 10);
    s.alignment.stress = Utils.clamp((s.alignment.stress || 0) - stressDrop, 0, 100);
    GameState.adjustStats({ health: healthGain, looks: 4, happiness: 5 });

    // Membantu mengawal Darah Tinggi
    let curedNote = '';
    if (Array.isArray(s.stressIllnesses) && s.stressIllnesses.includes('Darah Tinggi') && Utils.chance(0.50)) {
      s.stressIllnesses = s.stressIllnesses.filter(x => x !== 'Darah Tinggi');
      curedNote = ' Senaman konsisten turut memulihkan masalah Darah Tinggi anda!';
    }

    GameState.addJournalEntry(
      `🏃‍♂️ Bersenam & Joging di ${s.city}: Stres berkurang -${stressDrop}% (kini ${s.alignment.stress}%) dan Kesihatan meningkat +${healthGain}%!${curedNote}`
    );
    GameState.save();
    return {
      ok: true,
      stressDrop,
      msg: `🏃‍♂️ Bersenam selesai! Stres -${stressDrop}%, Kesihatan +${healthGain}%!${curedNote}`
    };
  },

  takeVacationRest() {
    const s = GameState.current;
    if (!s) return { ok: false, msg: 'Tiada watak aktif.' };
    if (s.yearlyActions.vacationRest) return { ok: false, msg: 'Anda sudah mengambil cuti rehat tahun ini!' };
    const cost = s.age < 18 ? 0 : Utils.usdToLocal(180, s.countryId);
    if (s.money < cost) return { ok: false, msg: `Perlukan ${Utils.formatMoney(cost, s.countryId)} untuk pakej bercuti & rehat.` };

    s.money -= cost;
    s.yearlyActions.vacationRest = true;
    const stressDrop = Utils.randInt(20, 35);
    const hapGain = Utils.randInt(12, 18);
    s.alignment.stress = Utils.clamp((s.alignment.stress || 0) - stressDrop, 0, 100);
    GameState.adjustStats({ happiness: hapGain, health: 5 });

    GameState.addJournalEntry(
      `🏖️ Bercuti & Berehat (${cost > 0 ? Utils.formatMoney(cost, s.countryId) : 'Tajaan Keluarga'}): Percutian tenang memulihkan tenaga anda — Stres turun mendadak -${stressDrop}% (kini ${s.alignment.stress}%) & Gembira +${hapGain}%!`,
      'culture'
    );
    GameState.save();
    return {
      ok: true,
      stressDrop,
      msg: `🏖️ Percutian menyegarkan! Stres -${stressDrop}%, Gembira +${hapGain}%!`
    };
  },

  attendCounselingTherapy() {
    const s = GameState.current;
    if (!s) return { ok: false, msg: 'Tiada watak aktif.' };
    if (s.yearlyActions.counselingTherapy) return { ok: false, msg: 'Anda sudah menghadiri sesi kaunseling / terapi tahun ini!' };
    const fee = s.age < 18 ? 0 : Utils.usdToLocal(140, s.countryId);
    if (s.money < fee) return { ok: false, msg: `Perlukan ${Utils.formatMoney(fee, s.countryId)} untuk yuran sesi kaunseling & terapi.` };

    s.money -= fee;
    s.yearlyActions.counselingTherapy = true;
    const stressDrop = Utils.randInt(25, 40);
    s.alignment.stress = Utils.clamp((s.alignment.stress || 0) - stressDrop, 0, 100);
    GameState.adjustStats({ happiness: 10, health: 6 });

    if (!Array.isArray(s.stressIllnesses)) s.stressIllnesses = [];
    const cured = s.stressIllnesses.filter(x => ['Kemurungan', 'Insomnia', 'Darah Tinggi'].includes(x));
    s.stressIllnesses = [];
    const cureTxt = cured.length > 0 ? ` Rawatan terapi turut menyembuhkan ${cured.join(' & ')} anda!` : '';

    GameState.addJournalEntry(
      `🛋️ Sesi Kaunseling & Terapi Profesional (${fee > 0 ? Utils.formatMoney(fee, s.countryId) : 'Percuma'}): Stres anda turun -${stressDrop}% (kini ${s.alignment.stress}%).${cureTxt}`,
      'milestone'
    );
    GameState.save();
    return {
      ok: true,
      stressDrop,
      cured,
      msg: `🛋️ Terapi berkesan! Stres -${stressDrop}%${cureTxt ? ` • Pulih: ${cured.join(', ')}` : ''}!`
    };
  },

  spendFamilyHobbyTime() {
    const s = GameState.current;
    if (!s) return { ok: false, msg: 'Tiada watak aktif.' };
    if (s.yearlyActions.familyHobby) return { ok: false, msg: 'Anda sudah meluangkan masa bersama keluarga & hobi tahun ini!' };

    s.yearlyActions.familyHobby = true;
    const stressDrop = Utils.randInt(10, 15);
    s.alignment.stress = Utils.clamp((s.alignment.stress || 0) - stressDrop, 0, 100);
    GameState.adjustStats({ happiness: 9, health: 3 });

    // Eratkan hubungan dengan ahli keluarga / pasangan hidup
    const closeOnes = (s.relationships || []).filter(r => r.alive && (r.id === s.partnerId || r.category === 'family' || r.category === 'spouse'));
    closeOnes.forEach(r => {
      r.closeness = Utils.clamp((r.closeness ?? 70) + 6, 0, 100);
    });

    GameState.addJournalEntry(
      `🎨👨‍👩‍👧‍👦 Meluangkan Masa Berkualiti Bersama Keluarga & Hobi: Fikiran kembali tenang — Stres berkurang -${stressDrop}% (kini ${s.alignment.stress}%) dan hubungan keluarga semakin erat!`
    );
    GameState.save();
    return {
      ok: true,
      stressDrop,
      msg: `🎨 Masa bersama keluarga & hobi mengurangkan Stres -${stressDrop}%!`
    };
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

  interactRelation(relId, action, opts) {
    return Relationships.interactRelation(relId, action, opts);
  },

  adoptChild() {
    return Relationships.adoptChild();
  },

  parentChild(childId, action) {
    return Relationships.parentChild(childId, action);
  },

  visitDoctor(isPrivate = false) {
    const s = GameState.current;
    const c = Utils.getCountry(s.countryId);
    const actId = isPrivate ? 'doc_priv' : 'doc_pub';
    if (!Array.isArray(s.yearlyActions.usedActivitiesThisYear)) s.yearlyActions.usedActivitiesThisYear = [];
    if (s.yearlyActions.usedActivitiesThisYear.includes(actId)) {
      return { ok: false, msg: 'Aktiviti ini sudah selesai tahun ini.' };
    }
    const cost = isPrivate ? c.healthcare.privateCost : c.healthcare.doctorCost;
    if (cost > 0 && s.money < cost) {
      return { ok: false, msg: `Wang tidak mencukupi! Perlukan ${Utils.formatMoney(cost, s.countryId)}.` };
    }
    if (cost > 0) s.money -= cost;
    s.yearlyActions.usedActivitiesThisYear.push(actId);
    const heal = isPrivate ? Utils.randInt(14, 24) : Utils.randInt(9, 16);
    GameState.adjustStats({ health: heal, happiness: 3 });
    GameState.addJournalEntry(
      `🏥 Mendapatkan rawatan di ${isPrivate ? 'hospital pakar swasta' : c.healthcare.type} di ${c.name} (${Utils.formatMoney(cost, s.countryId)}). Kesihatan meningkat +${heal}%!`
    );
    GameState.save();
    return { ok: true, msg: `Kesihatan meningkat +${heal}%!` };
  },

  DARK_ACTIVITIES_POOL: [
    // Tier 1 — Kanak-Kanak (Umur 7–12)
    { id: 'dark_k_steal_allowance', icon: '✏️', title: 'Curi Duit Belanja / Alat Tulis Rakan', desc: 'Mengambil duit belanja atau alat tulis rakan sekelas ketika dia tiada di meja.', minAge: 7, maxAge: 12, severity: 'minor', baseCatch: 0.30, lootUsd: [5, 25], fineUsd: [30, 80], karma: -6, heat: 4, fame: -3, rep: 5, stress: 4 },
    { id: 'dark_k_steal_candy', icon: '🍬', title: 'Curi Gula-Gula / Mainan di Kedai Runcit', desc: 'Menyorokkan gula-gula atau mainan kecil dari rak kedai runcit kejiranan.', minAge: 7, maxAge: 12, severity: 'minor', baseCatch: 0.34, lootUsd: [8, 30], fineUsd: [50, 140], karma: -7, heat: 6, fame: -4, rep: 6, stress: 5 },
    { id: 'dark_k_bully', icon: '😠', title: 'Buli & Ugut Budak Lebih Kecil', desc: 'Menakut-nakutkan pelajar lebih muda di kawasan sekolah untuk merampas barang mereka.', minAge: 7, maxAge: 12, severity: 'minor', baseCatch: 0.32, lootUsd: [5, 20], fineUsd: [40, 120], karma: -9, heat: 5, fame: -6, rep: 7, stress: 4 },
    { id: 'dark_k_vandal_school', icon: '🖍️', title: 'Conteng Dinding / Rosakkan Harta Sekolah', desc: 'Menconteng dinding tandas atau merosakkan kerusi meja sekolah secara sembunyi.', minAge: 7, maxAge: 12, severity: 'minor', baseCatch: 0.35, lootUsd: [0, 0], fineUsd: [80, 220], karma: -8, heat: 6, fame: -5, rep: 6, stress: 5 },
    { id: 'dark_k_smash_car', icon: '🪨', title: 'Baling Batu / Pecahkan Cermin Kereta Jiran', desc: 'Membaling batu ke arah kenderaan jiran di tepi jalan lalu melarikan diri.', minAge: 7, maxAge: 12, severity: 'medium', baseCatch: 0.40, lootUsd: [0, 0], fineUsd: [200, 550], karma: -11, heat: 10, fame: -7, rep: 9, stress: 7 },

    // Tier 2 — Remaja (Umur 13–17)
    { id: 'dark_t_shoplift', icon: '🛍️', title: 'Seluk Saku / Curi Barang Kedai', desc: 'Menyasarkan barangan kedai atau dompet pengunjung di pusat beli-belah.', minAge: 13, maxAge: 17, severity: 'minor', baseCatch: 0.28, lootUsd: [80, 350], fineUsd: [200, 600], karma: -8, heat: 8, fame: -5, rep: 10, stress: 6 },
    { id: 'dark_t_vandal', icon: '🎨', title: 'Vandalisme & Sabotaj Harta Awam', desc: 'Merobohkan papan tanda dan menconteng kemudahan awam pada lewat malam.', minAge: 13, maxAge: 17, severity: 'minor', baseCatch: 0.30, lootUsd: [0, 0], fineUsd: [300, 900], karma: -9, heat: 9, fame: -6, rep: 10, stress: 6 },
    { id: 'dark_t_cyberbully', icon: '📱', title: 'Sebar Fitnah & Buli Siber', desc: 'Membuka akaun palsu untuk menyebarkan gosip palsu dan mengaibkan rakan sebaya.', minAge: 13, maxAge: 17, severity: 'minor', baseCatch: 0.25, lootUsd: [0, 0], fineUsd: [250, 750], karma: -12, heat: 7, fame: -10, rep: 9, stress: 6 },
    { id: 'dark_t_steal_bike', icon: '🚲', title: 'Curi Basikal / Motosikal', desc: 'Memotong kunci basikal atau motosikal di kawasan parkir sunyi untuk dijual semula.', minAge: 13, maxAge: 17, severity: 'medium', baseCatch: 0.36, lootUsd: [350, 1400], fineUsd: [600, 1800], karma: -13, heat: 14, fame: -8, rep: 15, stress: 8 },
    { id: 'dark_t_brawl', icon: '👊', title: 'Gaduh Berkumpulan / Pukul Orang', desc: 'Terlibat dalam pergaduhan jalanan bersama kumpulan remaja lain di luar sekolah.', minAge: 13, maxAge: 17, severity: 'major', baseCatch: 0.42, lootUsd: [0, 0], fineUsd: [700, 2000], karma: -16, heat: 18, fame: -12, rep: 18, stress: 11 },
    { id: 'dark_t_murder', icon: '⚠️', title: 'Jenayah Ekstrem: Bunuh Orang', desc: 'Tindakan paling ekstrem yang boleh membawa kepada siasatan berat pihak berkuasa.', minAge: 14, maxAge: 17, severity: 'murder', baseCatch: 0.64, lootUsd: [0, 0], fineUsd: [2000, 6000], karma: -45, heat: 42, fame: -25, rep: 32, stress: 22 },

    // Tier 3 — Dewasa (Umur 18+)
    { id: 'dark_a_streetrace', icon: '🏎️', title: 'Lumba Haram Jalanan', desc: 'Menyertai perlumbaan haram bertaruh wang tunai di lebuh raya pada waktu malam.', minAge: 18, maxAge: 99, severity: 'minor', baseCatch: 0.30, lootUsd: [900, 3200], fineUsd: [1200, 3500], karma: -10, heat: 12, fame: -6, rep: 13, stress: 7 },
    { id: 'dark_a_scam', icon: '💻', title: 'Skim Penipuan Dalam Talian', desc: 'Mengendalikan tawaran pelaburan palsu secara digital terhadap mangsa rawak.', minAge: 18, maxAge: 99, severity: 'medium', baseCatch: 0.34, lootUsd: [2500, 8500], fineUsd: [3000, 9000], karma: -16, heat: 15, fame: -12, rep: 19, stress: 9 },
    { id: 'dark_a_burglary', icon: '🚗', title: 'Pecah Masuk / Curi Kenderaan', desc: 'Memecah masuk premis atau melarikan kenderaan bernilai tinggi secara senyap.', minAge: 18, maxAge: 99, severity: 'major', baseCatch: 0.38, lootUsd: [2800, 9000], fineUsd: [3200, 8500], karma: -16, heat: 18, fame: -10, rep: 20, stress: 10 },
    { id: 'dark_a_extortion', icon: '💼', title: 'Peras Ugut & Ugutan Awam', desc: 'Memaksa mangsa atau pemilik premis menyerahkan wang secara ugutan.', minAge: 18, maxAge: 99, severity: 'major', baseCatch: 0.40, lootUsd: [3000, 9500], fineUsd: [3500, 9500], karma: -18, heat: 20, fame: -14, rep: 22, stress: 11 },
    { id: 'dark_a_heist', icon: '🚢', title: 'Rompakan Bersenjata / Seludup Kontraband', desc: 'Operasi berskala besar melibatkan rompakan atau penyeludupan barangan larangan.', minAge: 18, maxAge: 99, severity: 'major', baseCatch: 0.46, lootUsd: [6000, 18000], fineUsd: [7000, 18000], karma: -22, heat: 26, fame: -18, rep: 28, stress: 14 },
    { id: 'dark_a_murder', icon: '⚠️', title: 'Jenayah Paling Ekstrem: Bunuh Orang', desc: 'Tindakan paling ekstrem — pilih sasaran anda dengan penuh sedar akan akibatnya.', minAge: 18, maxAge: 99, severity: 'murder', requiresTarget: true, baseCatch: 0.66, lootUsd: [0, 0], fineUsd: [5000, 15000], karma: -50, heat: 48, fame: -30, rep: 35, stress: 25 }
  ],

  getYearlyDarkActivities(s) {
    if (!s || s.age < 7) return [];
    const eligible = this.DARK_ACTIVITIES_POOL.filter(a => s.age >= a.minAge && s.age <= a.maxAge);
    if (s.darkDeckYear === s.year && Array.isArray(s.darkDeckIds) && s.darkDeckIds.length >= 3) {
      const resolved = s.darkDeckIds.map(id => eligible.find(a => a.id === id)).filter(Boolean);
      if (resolved.length >= 3) return resolved;
    }

    const desiredCount = Math.min(eligible.length, Utils.randInt(3, 5));
    const prev = Array.isArray(s.darkDeckIds) ? s.darkDeckIds : [];
    const fresh = eligible.filter(a => !prev.includes(a.id));
    const pool = fresh.length >= desiredCount ? [...fresh] : [...eligible];
    pool.sort(() => Math.random() - 0.5);
    const picked = pool.slice(0, desiredCount);

    // Pastikan pilihan ekstrem (Bunuh Orang) juga berpeluang muncul jelas untuk 14+
    const murderOpt = eligible.find(a => a.severity === 'murder');
    if (murderOpt && !picked.some(a => a.id === murderOpt.id) && picked.length < 5) {
      picked.push(murderOpt);
    }

    s.darkDeckIds = picked.map(a => a.id);
    s.darkDeckYear = s.year;
    return picked;
  },

  performDarkActivity(actId, targetLabel = null, opts = {}) {
    const s = GameState.current;
    const c = Utils.getCountry(s.countryId);
    if (s.prison && s.prison.inPrison) {
      return { ok: false, msg: 'Anda sedang berada dalam tahanan!' };
    }
    const def = this.DARK_ACTIVITIES_POOL.find(a => a.id === actId);
    if (!def) return { ok: false, msg: 'Aktiviti tidak ditemui.' };
    if (s.age < def.minAge) return { ok: false, msg: `Aktiviti ini tidak tersedia untuk umur ${s.age} tahun.` };

    if (!Array.isArray(s.yearlyActions.darkDoneIds)) s.yearlyActions.darkDoneIds = [];
    if (s.yearlyActions.darkDoneIds.includes(actId)) {
      return { ok: false, msg: 'Aktiviti ini sudah dilakukan tahun ini.' };
    }
    const maxPerYear = 3;
    if ((s.yearlyActions.darkCount || 0) >= maxPerYear) {
      return { ok: false, msg: 'Had aktiviti gelap tahun ini telah tamat. Tunggu tahun hadapan.' };
    }

    s.yearlyActions.darkCount = (s.yearlyActions.darkCount || 0) + 1;
    s.yearlyActions.darkDoneIds.push(actId);

    // Peluang lolos asas mengikut tahap: Ringan ~70%, Sederhana ~55%, Berat ~40%, Bunuh ~30%
    const baseUncaughtMap = { minor: 0.70, medium: 0.55, major: 0.40, murder: 0.30 };
    const baseUncaught = baseUncaughtMap[def.severity] ?? 0.55;
    const currentHeat = (s.alignment && s.alignment.notoriety) || 0;
    const smarts = (s.stats && s.stats.smarts) || 50;
    const smartsAdj = (smarts - 50) * 0.0025;
    const heatPenalty = currentHeat * 0.003;
    const uncaughtChance = Math.min(0.88, Math.max(0.10, baseUncaught + smartsAdj - heatPenalty));

    const isCaught = typeof opts.forceCaught === 'boolean' ? opts.forceCaught : !Utils.chance(uncaughtChance);
    const crimeLabel = targetLabel ? `${def.title} (${targetLabel})` : def.title;

    if (!isCaught) {
      let loot = 0;
      if (def.lootUsd && def.lootUsd[1] > 0) {
        loot = Utils.usdToLocal(Utils.randInt(def.lootUsd[0], def.lootUsd[1]), s.countryId);
        s.money += loot;
      }
      s.crimesCommitted = (s.crimesCommitted || 0) + 1;
      s.criminalRep = Math.min(100, (s.criminalRep || 0) + def.rep);
      GameState.adjustStats({ happiness: def.severity === 'murder' ? -6 : 5 });
      if (window.KarmaEndings) {
        KarmaEndings.adjustAlignment({
          karma: def.karma,
          notoriety: Math.max(3, Math.round(def.heat * 0.65)),
          fame: Math.round(def.fame * 0.3),
          stress: def.stress
        });
      }
      const lootNote = loot > 0 ? ` dan memperoleh ${Utils.formatMoney(loot, s.countryId)}` : '';
      GameState.addJournalEntry(
        `🕶️ Anda melakukan "${crimeLabel}"${lootNote} tanpa dikesan pihak berkuasa.`,
        'warning'
      );
      GameState.save();
      return { ok: true, caught: false, msg: `Berjaya lolos daripada "${def.title}"${lootNote}.` };
    }

    // Dikesan / Kantoi -> tunjukkan modal pilihan melarikan diri (3 butang) sebelum hukuman
    GameState.save();
    return {
      ok: false,
      caught: true,
      escapePrompt: {
        actId: def.id,
        title: def.title,
        crimeLabel,
        targetLabel,
        countryName: c.name,
        countryFlag: c.flag
      }
    };
  },

  resolveDarkEscape(actId, choice, targetLabel = null) {
    const s = GameState.current;
    const c = Utils.getCountry(s.countryId);
    const def = this.DARK_ACTIVITIES_POOL.find(a => a.id === actId);
    if (!def) return { ok: false, msg: 'Aktiviti tidak ditemui.' };

    const crimeLabel = targetLabel ? `${def.title} (${targetLabel})` : def.title;
    const health = (s.stats && s.stats.health) || 60;
    const smarts = (s.stats && s.stats.smarts) || 50;
    const fame = (s.alignment && s.alignment.fame) || 0;
    const fineLocal = Utils.usdToLocal(Utils.randInt(def.fineUsd[0], def.fineUsd[1]), s.countryId);
    const isJuvenile = s.age < 18;

    let extraPenaltyYears = 0;
    let lighterPenalty = false;

    if (choice === 'run') {
      const runChance = Math.min(0.82, Math.max(0.18, 0.28 + (health / 220) + (smarts / 320) - (def.severity === 'murder' ? 0.14 : 0)));
      if (Utils.chance(runChance)) {
        if (window.KarmaEndings) {
          KarmaEndings.adjustAlignment({ karma: def.karma, notoriety: 20, stress: def.stress + 8 });
        }
        GameState.addJournalEntry(
          `🏃 Anda memecut lari daripada lokasi "${crimeLabel}" dan berjaya melepaskan diri daripada tangkapan!`,
          'warning'
        );
        GameState.save();
        return {
          ok: true,
          escaped: true,
          msg: 'Berjaya memecut lari daripada tangkapan!',
          verdictModal: {
            icon: '🏃',
            title: 'Berjaya Meloloskan Diri!',
            subtitle: `${c.flag} ${c.name}`,
            text: `Anda memecut lari sekuat hati dan berjaya meloloskan diri daripada kejadian "${crimeLabel}". Namun pihak berkuasa kini meningkatkan pemantauan terhadap anda.`
          }
        };
      }
      extraPenaltyYears = def.severity === 'minor' ? 1 : 2;
    } else if (choice === 'bluff') {
      const bluffChance = Math.min(0.78, Math.max(0.12, 0.22 + (smarts / 220) + (fame / 300) - (def.severity === 'murder' ? 0.25 : def.severity === 'major' ? 0.10 : 0)));
      if (Utils.chance(bluffChance)) {
        if (window.KarmaEndings) {
          KarmaEndings.adjustAlignment({ karma: Math.round(def.karma * 0.7), notoriety: Math.round(def.heat * 0.5), stress: def.stress + 3 });
        }
        GameState.addJournalEntry(
          `🗣️ Anda berdalih dengan tenang selepas dikesan dalam "${crimeLabel}" dan hanya menerima amaran keras.`,
          'warning'
        );
        GameState.save();
        return {
          ok: true,
          escaped: true,
          msg: 'Berjaya berdalih! Anda hanya diberikan amaran.',
          verdictModal: {
            icon: '🗣️',
            title: 'Terlepas Dengan Amaran',
            subtitle: `${c.flag} ${c.name}`,
            text: `Helah dan alasan anda berjaya meyakinkan pihak yang menahan anda berhubung "${crimeLabel}". Anda dilepaskan dengan amaran keras kali ini.`
          }
        };
      }
    } else if (choice === 'surrender') {
      lighterPenalty = true;
    }

    // Gagal lari / gagal berdalih / serah diri -> jatuhkan hukuman
    if (window.KarmaEndings) {
      KarmaEndings.adjustAlignment({
        karma: def.karma,
        notoriety: Math.round(def.heat * (choice === 'run' ? 1.5 : 1.1)),
        fame: def.fame,
        stress: def.stress + 8
      });
    }

    // Serah diri kesalahan ringan kali pertama umur 7–12: amaran / denda ibu bapa (bukan Sekolah Juvana)
    if ((choice === 'surrender' && s.age <= 12 && def.severity === 'minor' && (s.minorOffenses || 0) === 0)
      || (s.age <= 9 && def.severity === 'minor' && (s.minorOffenses || 0) === 0)) {
      s.minorOffenses = (s.minorOffenses || 0) + 1;
      GameState.adjustStats({ happiness: -10 });
      const verdictText = `Anda menyerah diri dan mengaku salah atas "${crimeLabel}". Pihak berkuasa memberi amaran keras serta mengenakan ganti rugi ${Utils.formatMoney(fineLocal, s.countryId)} kepada ibu bapa tanpa menghantar anda ke Sekolah Juvana.`;
      GameState.addJournalEntry(`✋ ${verdictText}`, 'warning');
      GameState.save();
      return {
        ok: false,
        caught: true,
        msg: 'Diberi amaran & denda ibu bapa.',
        verdictModal: { icon: '⚠️', title: 'Amaran & Denda Ibu Bapa', subtitle: `${c.flag} ${c.name}`, text: verdictText }
      };
    }

    s.minorOffenses = (s.minorOffenses || 0) + 1;
    const sent = window.PrisonFugitive
      ? PrisonFugitive.getCountrySentence(c, def.severity, isJuvenile)
      : { countryName: c.name, tierLabel: 'Undang-Undang Tempatan', detentionType: isJuvenile ? 'juvenile' : 'prison', years: isJuvenile ? 2 : 5, fineOnly: false, isLife: false, isDeathPenalty: false, transferAt18: false, verdictSummary: `Mahkamah ${c.name} menjatuhkan hukuman tahanan.` };

    if (!sent.fineOnly && sent.years > 0) {
      if (extraPenaltyYears > 0) {
        sent.years += extraPenaltyYears;
      } else if (lighterPenalty && sent.years > 1) {
        sent.years = Math.max(1, sent.years - (sent.years >= 10 ? 2 : 1));
      }
    }

    if (sent.fineOnly || sent.years <= 0) {
      s.money = Math.max(0, s.money - fineLocal);
      s.criminalRecord = (s.criminalRecord || 0) + 1;
      GameState.adjustStats({ happiness: -14 });
      const verdictText = `${sent.verdictSummary} Anda dikenakan denda ${Utils.formatMoney(fineLocal, s.countryId)} atas kesalahan "${crimeLabel}".`;
      GameState.addJournalEntry(`⚖️ ${verdictText}`, 'warning');
      GameState.save();
      return {
        ok: false,
        caught: true,
        sentence: sent,
        msg: `Didenda ${Utils.formatMoney(fineLocal, s.countryId)} di Mahkamah ${c.name}.`,
        verdictModal: { icon: '⚖️', title: `Keputusan Mahkamah ${c.name}`, subtitle: sent.tierLabel, text: verdictText }
      };
    }

    const secLevel = PrisonFugitive.getSecurityTierForYears(sent.years);
    PrisonFugitive.enterPrisonState(s, crimeLabel, sent.years, secLevel, {
      detentionType: sent.detentionType,
      transferAt18: sent.transferAt18,
      isLife: sent.isLife,
      isDeathPenalty: sent.isDeathPenalty,
      lawTierLabel: sent.tierLabel
    });

    const facilityText = sent.detentionType === 'juvenile' ? 'Sekolah Juvana' : 'Penjara';
    const note = extraPenaltyYears > 0
      ? `\n\nCubaan melarikan diri gagal dan hukuman ditambah kepada ${sent.years} tahun.`
      : lighterPenalty
        ? `\n\nKerjasama anda menyerah diri meringankan tempoh hukuman kepada ${sent.years} tahun.`
        : '';
    const verdictText = `Anda ditahan atas kesalahan "${crimeLabel}".\n\nMahkamah ${c.name} menjatuhkan hukuman ${sent.years} tahun ${facilityText} di bawah ${sent.tierLabel}.${note}`;
    GameState.addJournalEntry(`⚖️ Mahkamah ${c.name} menjatuhkan hukuman ${sent.years} tahun ${facilityText} (Kes: ${crimeLabel}).`, 'warning');
    GameState.save();

    return {
      ok: false,
      caught: true,
      sentence: sent,
      msg: `Dijatuhi hukuman ${sent.years} tahun di ${facilityText}!`,
      verdictModal: {
        icon: '⚖️',
        title: `Keputusan Mahkamah ${c.name}`,
        subtitle: `${c.flag} ${sent.tierLabel}`,
        text: verdictText
      }
    };
  },

  CRIME_POOL: [
    // Ringan / Awal (Umur 14+)
    { id: 'pickpocket', icon: '🤏', title: 'Seluk Saku (Pickpocket)', desc: 'Menyelit di kawasan sesak untuk menyasarkan dompet pejalan kaki yang leka.', minAge: 14, tier: 'minor', baseCatch: 0.24, lootUsd: [120, 420], fineUsd: [250, 600], karma: -6, heat: 5, rep: 8, stress: 4 },
    { id: 'shoplift', icon: '🛍️', title: 'Curi Barang Kedai', desc: 'Menyorokkan barangan bernilai daripada rak kedai tanpa pengetahuan juruwang.', minAge: 14, tier: 'minor', baseCatch: 0.26, lootUsd: [150, 500], fineUsd: [300, 750], karma: -7, heat: 6, rep: 9, stress: 5 },
    { id: 'vandalism', icon: '🎨', title: 'Vandalisme & Sabotaj', desc: 'Menconteng dan merosakkan harta benda awam atau premis sasaran pada waktu malam.', minAge: 14, tier: 'minor', baseCatch: 0.22, lootUsd: [100, 350], fineUsd: [350, 900], karma: -8, heat: 7, rep: 10, stress: 4 },
    { id: 'counterfeit', icon: '📦', title: 'Jual Barangan Tiruan / Seludup Kecil', desc: 'Mengedarkan barangan tiruan dan stok gelap secara senyap di pasaran jalanan.', minAge: 14, tier: 'minor', baseCatch: 0.28, lootUsd: [300, 950], fineUsd: [500, 1200], karma: -8, heat: 8, rep: 12, stress: 5 },
    // Sederhana / Berat (Umur 18+)
    { id: 'car_theft', icon: '🚗', title: 'Curi Kenderaan', desc: 'Memecah masuk dan melarikan kenderaan mewah yang diparkir di kawasan sunyi.', minAge: 18, tier: 'major', baseCatch: 0.36, lootUsd: [2200, 6500], fineUsd: [2500, 6000], karma: -14, heat: 14, rep: 18, stress: 9, jailYears: [1, 3] },
    { id: 'burglary', icon: '🏠', title: 'Pecah Masuk Rumah', desc: 'Menyelinap masuk ke kediaman yang ditinggalkan kosong untuk mencari barang berharga.', minAge: 18, tier: 'major', baseCatch: 0.38, lootUsd: [1800, 5200], fineUsd: [2000, 5000], karma: -15, heat: 15, rep: 17, stress: 10, jailYears: [1, 4] },
    { id: 'cyber_scam', icon: '💻', title: 'Penipuan Siber / Skim Palsu', desc: 'Mengendalikan pancingan data dan skim pelaburan palsu secara dalam talian.', minAge: 18, tier: 'major', baseCatch: 0.32, lootUsd: [2800, 8500], fineUsd: [3500, 9000], karma: -16, heat: 13, rep: 19, stress: 8, jailYears: [2, 4] },
    { id: 'extortion', icon: '💼', title: 'Peras Ugut Perniagaan', desc: 'Mengutip wang perlindungan daripada pemilik premis tempatan secara paksaan.', minAge: 18, tier: 'major', baseCatch: 0.37, lootUsd: [2400, 7000], fineUsd: [2800, 6500], karma: -18, heat: 16, rep: 22, stress: 9, jailYears: [2, 5] },
    { id: 'smuggling', icon: '🚢', title: 'Seludup Kontraband', desc: 'Menguruskan penghantaran barangan larangan merentasi pintu masuk pelabuhan.', minAge: 18, tier: 'major', baseCatch: 0.42, lootUsd: [4500, 12500], fineUsd: [5000, 12000], karma: -18, heat: 18, rep: 25, stress: 11, jailYears: [3, 6] },
    { id: 'money_laundering', icon: '🏦', title: 'Pengubahan Wang Haram', desc: 'Menyalurkan wang gelap melalui syarikat cengkerang untuk membersihkan sumbernya.', minAge: 18, tier: 'major', baseCatch: 0.35, lootUsd: [5500, 15000], fineUsd: [6000, 15000], karma: -16, heat: 15, rep: 24, stress: 10, jailYears: [2, 6] }
  ],

  getYearlyCrimeOptions(s) {
    if (!s || s.age < 14) return [];
    const eligible = this.CRIME_POOL.filter(cr => s.age >= cr.minAge);
    if (s.crimeBoardYear === s.year && Array.isArray(s.crimeBoardIds) && s.crimeBoardIds.length === 3) {
      const resolved = s.crimeBoardIds.map(id => eligible.find(cr => cr.id === id)).filter(Boolean);
      if (resolved.length === 3) return resolved;
    }

    const prev = Array.isArray(s.crimeBoardIds) ? s.crimeBoardIds : [];
    const fresh = eligible.filter(cr => !prev.includes(cr.id));
    const pool = fresh.length >= 3 ? [...fresh] : [...eligible];
    pool.sort(() => Math.random() - 0.5);
    const picked = pool.slice(0, 3);

    s.prevCrimeBoardIds = prev;
    s.crimeBoardIds = picked.map(cr => cr.id);
    s.crimeBoardYear = s.year;
    return picked;
  },

  commitCrime(crimeId) {
    const s = GameState.current;
    const c = Utils.getCountry(s.countryId);
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Anda sedang berada di dalam penjara!' };

    const maxAttempts = 3;
    const usedCount = s.yearlyActions.crimeCount || 0;
    if (usedCount >= maxAttempts) {
      return { ok: false, msg: 'Had percubaan aktiviti gelap tahun ini telah tamat. Tunggu tahun hadapan.' };
    }
    if (!Array.isArray(s.yearlyActions.crimesDoneIds)) s.yearlyActions.crimesDoneIds = [];
    if (s.yearlyActions.crimesDoneIds.includes(crimeId)) {
      return { ok: false, msg: 'Aktiviti ini sudah dicuba tahun ini.' };
    }

    const def = this.CRIME_POOL.find(cr => cr.id === crimeId) || this.CRIME_POOL[0];
    if (s.age < def.minAge) return { ok: false, msg: `Umur minimum untuk aktiviti ini ialah ${def.minAge} tahun.` };

    s.yearlyActions.crimeCount = usedCount + 1;
    s.yearlyActions.crimesDoneIds.push(def.id);

    const strictCountries = ['SG', 'JP', 'KR', 'AE', 'SA'];
    const currentHeat = (s.alignment && s.alignment.notoriety) || 0;
    const highHeatPenalty = currentHeat >= 70 ? 0.28 : currentHeat >= 40 ? 0.18 : 0;
    const smartsBonus = Math.max(0, ((s.stats && s.stats.smarts) || 50) - 50) * 0.002;
    const catchChance = Math.min(
      0.95,
      Math.max(0.12, def.baseCatch + (strictCountries.includes(c.id) ? 0.14 : 0) + (currentHeat * 0.003) + highHeatPenalty - smartsBonus)
    );

    if (Utils.chance(catchChance)) {
      const fineUsd = Utils.randInt(def.fineUsd[0], def.fineUsd[1]);
      const fine = Utils.usdToLocal(fineUsd, s.countryId);
      s.money -= fine;
      s.criminalRecord = (s.criminalRecord || 0) + 1;
      GameState.adjustStats({ happiness: -16, health: -4 });
      if (window.KarmaEndings) {
        KarmaEndings.adjustAlignment({ karma: def.karma, notoriety: Math.round(def.heat * 1.4), stress: def.stress + 8 });
      }

      // Risiko hukuman penjara bagi jenayah berat (18+) atau pusat juvana bagi bawah umur berulang
      const shouldJail = s.age >= 18 && def.jailYears && (currentHeat >= 45 || Utils.chance(0.45));
      if (shouldJail && window.PrisonFugitive && PrisonFugitive.enterPrisonState) {
        const yrs = Utils.randInt(def.jailYears[0], def.jailYears[1]);
        PrisonFugitive.enterPrisonState(s, def.title, yrs, this.CRIME_POOL && yrs >= 6 ? 'maximum' : 'medium');
        const isMafiaLife = Boolean(s.prison && s.prison.isLife);
        const termLabel = isMafiaLife ? 'SEUMUR HIDUP (Ahli Mafia)' : `${yrs} tahun`;
        GameState.addJournalEntry(
          `🚓 DICEKUP POLIS! Anda gagal dalam "${def.title}" di ${c.name}, didenda ${Utils.formatMoney(fine, s.countryId)} dan dijatuhi hukuman penjara ${termLabel}!`,
          'warning'
        );
        GameState.save();
        return { ok: false, msg: `Kantoi! Dipenjara ${termLabel} & didenda ${Utils.formatMoney(fine, s.countryId)}.` };
      }

      if (s.age < 18 && currentHeat >= 30 && Utils.chance(0.4)) {
        GameState.adjustStats({ happiness: -10 });
        GameState.addJournalEntry(
          `🚓 TAHANAN JUVANA: Anda ditahan sementara di pusat pemulihan juvana ${c.name} akibat "${def.title}" dan keluarga anda terpaksa membayar denda ${Utils.formatMoney(fine, s.countryId)}.`,
          'warning'
        );
        GameState.save();
        return { ok: false, msg: `Ditahan juvana sementara & didenda ${Utils.formatMoney(fine, s.countryId)}.` };
      }

      GameState.addJournalEntry(
        `🚓 Ditangkap polis ${c.name} semasa cubaan "${def.title}"! Anda didenda ${Utils.formatMoney(fine, s.countryId)} dan rekod jenayah bertambah.`,
        'warning'
      );
      GameState.save();
      return { ok: false, msg: `Kantoi! Didenda ${Utils.formatMoney(fine, s.countryId)}.` };
    } else {
      const lootUsd = Utils.randInt(def.lootUsd[0], def.lootUsd[1]);
      const loot = Utils.usdToLocal(lootUsd, s.countryId);
      s.money += loot;
      s.crimesCommitted = (s.crimesCommitted || 0) + 1;
      s.criminalRep = Math.min(100, (s.criminalRep || 0) + def.rep);
      GameState.adjustStats({ happiness: 6 });
      if (window.KarmaEndings) {
        KarmaEndings.adjustAlignment({ karma: def.karma, notoriety: def.heat, stress: def.stress });
      }
      GameState.addJournalEntry(
        `🕶️ Berjaya melakukan "${def.title}" dan mengaut wang gelap ${Utils.formatMoney(loot, s.countryId)} tanpa dikesan pihak berkuasa.`,
        'warning'
      );
      GameState.save();
      return { ok: true, msg: `Berjaya lolos dengan ${Utils.formatMoney(loot, s.countryId)}!` };
    }
  },

  canJoinMafiaDirectly(s) {
    if (!s || s.age < 18) return false;
    if (s.prison && s.prison.inPrison) return false;
    if (s.activeSpecialMode && s.activeSpecialMode.modeId === 'mafia') return false;
    return true;
  },

  applyToJoinMafia(s) {
    const st = s || GameState.current;
    if (!this.canJoinMafiaDirectly(st)) {
      return { ok: false, msg: 'Anda tidak layak memohon menyertai Sindiket Mafia buat masa ini.' };
    }
    if (st.yearlyActions.mafiaApply) {
      return { ok: false, msg: 'Had cubaan 1 kali setahun telah digunakan. Cuba lagi tahun hadapan.' };
    }
    st.yearlyActions.mafiaApply = true;

    const record = st.criminalRecord || 0;
    const crimes = st.crimesCommitted || 0;
    const karma = (st.alignment && st.alignment.karma) || 0;
    const karmaBoost = karma < 0 ? Math.min(0.18, Math.abs(karma) * 0.002) : 0;
    const crimeBoost = Math.min(0.22, record * 0.06 + crimes * 0.03);
    const passProb = Math.min(0.75, 0.28 + karmaBoost + crimeBoost);
    if (Utils.chance(passProb) && window.SpecialModesEngine) {
      SpecialModesEngine.enterMode(st, 'mafia');
      GameState.addJournalEntry(
        '🕶️ UJIAN KESETIAAN LULUS! Anda berjaya meyakinkan ketua sindiket dan rasmi diterima menyertai Sindiket Mafia!',
        'milestone'
      );
      GameState.save();
      return { ok: true, msg: 'Tahniah! Anda rasmi diterima menyertai Sindiket Mafia!' };
    }

    if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: 8, notoriety: 5 });
    GameState.addJournalEntry(
      '🕶️ Permohonan anda untuk menyertai Sindiket Mafia ditolak tahun ini — mereka masih meragui kelayakan anda.',
      'warning'
    );
    GameState.save();
    return { ok: false, msg: 'Permohonan ditolak. Rekod jenayah/karma rendah membantu peluang — cuba lagi tahun hadapan.' };
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
    if (s.yearlyActions.drivingTest) return { ok: false, msg: 'Ujian memandu sudah diambil tahun ini.' };
    const fee = Utils.usdToLocal(220, s.countryId);
    if (s.money < fee && s.age >= 18) return { ok: false, msg: `Wang tidak mencukupi! Yuran ujian memandu ialah ${Utils.formatMoney(fee, s.countryId)}.` };
    if (s.age >= 18) s.money -= fee;
    s.yearlyActions.drivingTest = true;

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
      return { ok: false, msg: `Gagal ${localTestName}! Cuba lagi tahun hadapan.` };
    }
  },

  doCommunityCharity() {
    const s = GameState.current;
    GameState.ensureUpgradedState();
    if (s.yearlyActions.communityCharity) {
      return { ok: false, msg: 'Anda sudah menyertai aktiviti kebajikan komuniti tahun ini.' };
    }
    const charityCost = s.age >= 18 ? Utils.usdToLocal(35, s.countryId) : 0;
    if (charityCost > 0 && s.money < charityCost) {
      return { ok: false, msg: `Wang tidak mencukupi! Perlukan ${Utils.formatMoney(charityCost, s.countryId)}.` };
    }
    if (charityCost > 0) s.money -= charityCost;
    s.yearlyActions.communityCharity = true;
    GameState.adjustStats({ happiness: 10, health: 3, smarts: 2 });
    if (window.KarmaEndings) KarmaEndings.adjustAlignment({ karma: 8, stress: -5 });
    GameState.addJournalEntry(
      `🤝 Sumbangan & Sukarelawan Komuniti${charityCost > 0 ? ` (Derma: ${Utils.formatMoney(charityCost, s.countryId)})` : ''}: Hati terasa lapang setelah membantu golongan memerlukan.`,
      'mindful'
    );
    GameState.save();
    return { ok: true, msg: 'Aktiviti kebajikan komuniti selesai!' };
  }
};
