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

    let priorityNpcDeathEvent = null;
    let priorityMiscarriageEvent = null;
    let priorityTeenEvent = null;
    let babyBirth = null;
    let totalNpcDeathHappyPenalty = 0;
    let totalNpcDeathStressGain = 0;

    // 1. Umur ahli keluarga, pasangan & rakan + Kematian Orang Terdekat Realistik
    for (const rel of s.relationships) {
      if (!rel.alive) continue;
      rel.age += 1;
      const isChild = ['Anak Lelaki', 'Anak Perempuan', 'Son', 'Daughter'].includes(rel.role);

      // Kemas kini kerja anak bila membesar
      if (isChild) {
        if (rel.age >= 18 && rel.job === 'Pelajar') rel.job = rel.isDelinquent ? 'Penganggur / Berisiko' : 'Belia / Bekerja';
        else if (rel.age >= 6 && rel.job === 'Bayi') rel.job = 'Pelajar';
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
            const syariahParent = window.LegalInheritanceEngine
              && LegalInheritanceEngine.isSyariahApplicable({ religion: rel.savedReligion, countryId: rel.savedCountryId || s.countryId });
            const kidsN = Math.max(1, rel.savedKidsCount || 1);
            let frac = 1 / kidsN;
            if (syariahParent) {
              if (s.isAdopted) frac = 0.08; // Hibah Anak Angkat
              else frac = (rel.savedHasSpouse ? 0.875 : 1.0) / kidsN;
            } else {
              const netUsd = Utils.localToUsd(rel.savedEstateNetWorth, rel.savedCountryId || s.countryId);
              const taxR = window.LegalInheritanceEngine ? LegalInheritanceEngine.getCountryEstateTaxRate(rel.savedCountryId || s.countryId, netUsd) : 0;
              frac = ((1 - taxR) * (rel.savedHasSpouse ? 0.5 : 1.0)) / kidsN;
            }
            const shareLocal = Utils.convertMoney(Math.round(rel.savedEstateNetWorth * frac), rel.savedCountryId || s.countryId, s.countryId);
            if (shareLocal > 0) {
              s.money = Math.round((s.money || 0) + shareLocal);
              GameState.addJournalEntry(
                `📜 Pewarisan Harta Pusaka (${syariahParent ? (s.isAdopted ? 'Hibah Anak Angkat' : 'Faraid') : 'Undang-Undang Sivil'}): Anda menerima bahagian pusaka sebanyak ${Utils.formatMoney(shareLocal, s.countryId)} daripada arwah ${rel.name}.`,
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

      // 1B. Penjagaan & Didikan Anak (Umur 1–17) + Kesan Pengabaian
      if (isChild && rel.age >= 1 && rel.age <= 17) {
        const caredEdu = Boolean(prevYearlyActions[`parent_${rel.id}_education`]);
        const caredHealth = Boolean(prevYearlyActions[`parent_${rel.id}_health`]);
        const caredMorals = Boolean(prevYearlyActions[`parent_${rel.id}_morals`]);

        if (!caredEdu) rel.educationCare = Utils.clamp((rel.educationCare ?? 65) - Utils.randInt(7, 12), 0, 100);
        if (!caredHealth) rel.healthCare = Utils.clamp((rel.healthCare ?? 75) - Utils.randInt(6, 10), 0, 100);
        if (!caredMorals) rel.morals = Utils.clamp((rel.morals ?? 70) - Utils.randInt(7, 12), 0, 100);

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

    // Pemulihan emosi hasil pegangan hidup / ketenangan batin (dilangkau jika sedang berkabung kematian tahun ini)
    if (totalNpcDeathHappyPenalty === 0 && s.age >= 15 && s.belief && s.belief !== 'unassigned' && s.devotion >= 55 && s.stats.happiness < 55) {
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

    // 7. Pilih peristiwa pilihan tahunan (utamakan Berita Duka / Keguguran / Krisis Remaja) & pastikan sekurang-kurangnya 5 pilihan berbeza!
    let event = priorityNpcDeathEvent
      || priorityMiscarriageEvent
      || priorityTeenEvent
      || this._pickYearlyEvent(s, c);

    if (event) {
      event = this._ensureAtLeastFiveChoices(event, s, c);
    }

    const curBlock = s.journal[s.journal.length - 1];
    if (curBlock.entries.length === 0) {
      GameState.addJournalEntry(
        `Setahun lagi berlalu di ${s.city}, ${c.name} ${c.flag}. Anda rasa ${s.stats.happiness >= 60 ? 'bersemangat dan gembira' : 'tenang merenung masa depan'}.`
      );
    }

    GameState.save();
    return { event, died: false, babyBirth };
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

    // 4. Penyejukan semula jadi Haba Polis & Stres (pesara mendapat pengurangan stres tambahan)
    if (s.alignment.notoriety > 0) {
      s.alignment.notoriety = Math.max(0, s.alignment.notoriety - Utils.randInt(2, 5));
    }
    const stressCool = (s.retired || s.isRetired) ? Utils.randInt(4, 8) : Utils.randInt(2, 5);
    if (s.alignment.stress > 10) {
      s.alignment.stress = Math.max(5, s.alignment.stress - stressCool);
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
    if (anyCountry.length > 0 && Utils.chance(0.45)) {
      return Utils.pick(anyCountry);
    }

    const anyUni = (GAME_EVENTS.universal || []).filter(
      e => s.age >= e.minAge && s.age <= e.maxAge
    );
    if (anyUni.length > 0 && Utils.chance(0.55)) {
      return Utils.pick(anyUni);
    }

    return this._buildProceduralFiveChoiceEvent(s, c);
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
        const syariah = LegalInheritanceEngine.isSyariahApplicable(s);
        const divPath = syariah
          ? (s.gender === 'male' ? 'talak1' : 'fasakh')
          : 'civil';
        LegalInheritanceEngine.executeDivorce(s, spouse.id, {
          path: divPath,
          settlementMode: syariah ? 'sulh' : 'mediasi'
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
