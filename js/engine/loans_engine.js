/* ==========================================================================
   WorldLife — Enjin Pinjaman Bank, Skor Kredit & Pinjaman Ah Long
   Bahasa Melayu
   ========================================================================== */

window.LoansEngine = {
  MAX_BANK_LOANS: 2,
  MAX_AHLONG_LOANS: 2,

  ensureFields(s) {
    if (!s) return;
    if (typeof s.creditScore !== 'number' || Number.isNaN(s.creditScore)) s.creditScore = 620;
    s.creditScore = Utils.clamp(Math.round(s.creditScore), 300, 850);
    if (!Array.isArray(s.loans)) s.loans = [];
    if (typeof s.loanBlacklisted !== 'boolean') s.loanBlacklisted = false;
  },

  getTotalDebt(s) {
    if (!s || !Array.isArray(s.loans)) return 0;
    return Math.round(s.loans.reduce((acc, l) => acc + Math.max(0, l.balance || 0), 0));
  },

  calculateCreditProfile(s) {
    this.ensureFields(s);
    const inPrison = Boolean(s.prison && s.prison.inPrison);
    const isFugitive = Boolean(s.fugitive && s.fugitive.isFugitive);

    if (s.age < 18) {
      return { score: s.creditScore, tier: 'blocked', label: 'Belum Layak (Umur < 18)', color: '#64748b', bg: '#f1f5f9', autoReject: true, reason: 'Pinjaman hanya dibuka untuk individu berumur 18 tahun ke atas.' };
    }
    if (inPrison) {
      return { score: s.creditScore, tier: 'blocked', label: 'Disekat (Dalam Tahanan)', color: '#991b1b', bg: '#fee2e2', autoReject: true, reason: 'Permohonan pinjaman baharu disekat sepanjang tempoh tahanan.' };
    }
    if (isFugitive) {
      return { score: 300, tier: 'blacklisted', label: 'Disenarai Hitam (Buruan Polis)', color: '#991b1b', bg: '#fee2e2', autoReject: true, reason: 'Bank menolak permohonan secara automatik kerana status buruan polis.' };
    }
    if (s.loanBlacklisted) {
      return { score: Math.min(420, s.creditScore), tier: 'blacklisted', label: 'Disenarai Hitam / Risiko Melampau', color: '#991b1b', bg: '#fee2e2', autoReject: true, reason: 'Rekod anda disenarai hitam oleh pihak bank akibat tunggakan bayaran berulang.' };
    }

    let score = s.creditScore;
    const hasLegitJob = Boolean(s.job && !s.job.isUnderground);
    if (hasLegitJob) {
      score += 35 + Math.min(35, (s.job.years || 0) * 6);
    } else {
      score -= 45; // Tiada slip gaji rasmi (termasuk kerja bawah tanah)
    }

    const propCount = (s.assets && Array.isArray(s.assets.properties)) ? s.assets.properties.length : 0;
    const vehCount = (s.assets && Array.isArray(s.assets.vehicles)) ? s.assets.vehicles.length : 0;
    score += Math.min(50, propCount * 25 + vehCount * 10);

    if (s.money < 0) score -= 60;
    else if (s.money >= Utils.usdToLocal(20000, s.countryId)) score += 30;
    else if (s.money >= Utils.usdToLocal(5000, s.countryId)) score += 15;

    const totalDebt = this.getTotalDebt(s);
    if (totalDebt > 0) score -= Math.min(80, Math.round(totalDebt / Math.max(1, Utils.usdToLocal(10000, s.countryId)) * 18));

    const totalMissed = s.loans.reduce((acc, l) => acc + (l.missedPayments || 0), 0);
    if (totalMissed > 0) score -= totalMissed * 45;

    const heat = (s.alignment && s.alignment.notoriety) || 0;
    const karma = (s.alignment && s.alignment.karma) || 0;
    if (heat >= 40) score -= 45;
    if (s.hasCriminalRecord && s.age >= 18) score -= 65;
    if (karma < -20) score -= 25;

    score = Utils.clamp(Math.round(score), 300, 850);

    if (score >= 720) {
      return { score, tier: 'low', label: 'Risiko Rendah', color: '#166534', bg: '#dcfce7', autoReject: false, interestRate: 0.085, capMult: 1.5 };
    }
    if (score >= 580) {
      return { score, tier: 'medium', label: 'Risiko Sederhana', color: '#92400e', bg: '#fef3c7', autoReject: false, interestRate: 0.165, capMult: 1.0 };
    }
    if (score >= 450) {
      return { score, tier: 'high', label: 'Risiko Tinggi', color: '#9a3412', bg: '#ffedd5', autoReject: false, interestRate: 0.25, capMult: 0.55 };
    }
    return { score, tier: 'blacklisted', label: 'Disenarai Hitam / Risiko Melampau', color: '#991b1b', bg: '#fee2e2', autoReject: true, reason: 'Skor kredit anda terlalu rendah untuk kelulusan pinjaman bank.' };
  },

  getBankOffers(s) {
    const prof = this.calculateCreditProfile(s);
    const mult = prof.capMult || 1.0;
    const rate = prof.interestRate || 0.165;
    const presets = [
      { id: 'bank_small', title: 'Pinjaman Peribadi Kecil', baseUsd: Math.round(3500 * mult), years: 3 },
      { id: 'bank_med', title: 'Pinjaman Peribadi Sederhana', baseUsd: Math.round(12000 * mult), years: 5 },
      { id: 'bank_large', title: 'Pinjaman Modal Besar', baseUsd: Math.round(30000 * mult), years: 7 }
    ];
    return presets.map(p => {
      const principal = Utils.usdToLocal(p.baseUsd, s.countryId);
      const totalRepay = Math.round(principal * (1 + rate * (p.years * 0.6)));
      const yearlyDue = Math.max(1, Math.round(totalRepay / p.years));
      return { ...p, principal, interestRate: rate, yearlyDue };
    });
  },

  getAhLongOffers(s) {
    const presets = [
      { id: 'al_small', title: 'Wang Cepat (Kecil)', baseUsd: 2500, rate: 0.55 },
      { id: 'al_med', title: 'Wang Kecemasan (Sederhana)', baseUsd: 8000, rate: 0.70 },
      { id: 'al_large', title: 'Wang Segera (Besar)', baseUsd: 20000, rate: 0.85 }
    ];
    return presets.map(p => {
      const principal = Utils.usdToLocal(p.baseUsd, s.countryId);
      const yearlyDue = Math.max(1, Math.round(principal * (0.45 + p.rate * 0.5)));
      return { ...p, principal, interestRate: p.rate, yearlyDue };
    });
  },

  takeBankLoan(s, offerId) {
    this.ensureFields(s);
    const prof = this.calculateCreditProfile(s);
    if (prof.autoReject) return { ok: false, msg: prof.reason || 'Permohonan pinjaman bank ditolak.' };

    const bankCount = s.loans.filter(l => l.lenderType === 'bank').length;
    if (bankCount >= this.MAX_BANK_LOANS) {
      return { ok: false, msg: `Anda telah mencapai had maksimum ${this.MAX_BANK_LOANS} pinjaman bank aktif serentak.` };
    }

    const offer = this.getBankOffers(s).find(o => o.id === offerId);
    if (!offer) return { ok: false, msg: 'Pakej pinjaman tidak sah.' };

    if (prof.tier === 'high' && Utils.chance(0.45)) {
      return { ok: false, msg: 'Permohonan ditolak oleh pihak bank kerana tahap risiko kredit anda terlalu tinggi.' };
    }

    const c = Utils.getCountry(s.countryId);
    const lenderName = `Bank Nasional ${c.name}`;
    s.money += offer.principal;
    s.loans.push({
      id: 'bank_' + Date.now() + '_' + Utils.randInt(10, 99),
      lenderType: 'bank',
      lenderName,
      principal: offer.principal,
      balance: Math.round(offer.principal * (1 + offer.interestRate)),
      interestRate: offer.interestRate,
      yearlyDue: offer.yearlyDue,
      yearsElapsed: 0,
      missedPayments: 0,
      paidThisYear: false
    });
    GameState.addJournalEntry(
      `🏦 Pinjaman daripada ${lenderName} sebanyak ${Utils.formatMoney(offer.principal, s.countryId)} telah diluluskan dan dikreditkan ke akaun anda.`,
      'milestone'
    );
    GameState.save();
    return { ok: true, msg: `Pinjaman ${Utils.formatMoney(offer.principal, s.countryId)} diluluskan!` };
  },

  takeAhLongLoan(s, offerId) {
    this.ensureFields(s);
    if (s.age < 18) return { ok: false, msg: 'Anda mesti berumur 18 tahun ke atas.' };
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Tidak boleh membuat pinjaman baharu semasa dalam tahanan.' };

    const alCount = s.loans.filter(l => l.lenderType === 'ahlong').length;
    if (alCount >= this.MAX_AHLONG_LOANS) {
      return { ok: false, msg: `Sindiket Ah Long menolak — anda sudah mempunyai ${this.MAX_AHLONG_LOANS} hutang Ah Long aktif.` };
    }

    const offer = this.getAhLongOffers(s).find(o => o.id === offerId);
    if (!offer) return { ok: false, msg: 'Pakej pinjaman tidak sah.' };

    const names = ['Ah Long Naga Merah', 'Ceti Harimau Malam', 'Kumpulan Wang Segera 99', 'Sindiket Ah Long Utara'];
    const lenderName = Utils.pick(names);
    s.money += offer.principal;
    s.loans.push({
      id: 'al_' + Date.now() + '_' + Utils.randInt(10, 99),
      lenderType: 'ahlong',
      lenderName,
      principal: offer.principal,
      balance: Math.round(offer.principal * (1 + offer.interestRate)),
      interestRate: offer.interestRate,
      yearlyDue: offer.yearlyDue,
      yearsElapsed: 0,
      missedPayments: 0,
      paidThisYear: false
    });
    if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: 8 });
    GameState.addJournalEntry(
      `🦈 Anda meminjam ${Utils.formatMoney(offer.principal, s.countryId)} daripada ${lenderName} tanpa syarat. Kadar faedah amat tinggi dan berisiko besar jika gagal membayar!`,
      'warning'
    );
    GameState.save();
    return { ok: true, msg: `Wang tunai ${Utils.formatMoney(offer.principal, s.countryId)} daripada ${lenderName} diterima!` };
  },

  payInstallment(s, loanId) {
    this.ensureFields(s);
    const idx = s.loans.findIndex(l => l.id === loanId);
    if (idx === -1) return { ok: false, msg: 'Rekod hutang tidak ditemui.' };
    const loan = s.loans[idx];
    if (loan.paidThisYear) return { ok: false, msg: 'Ansuran tahun ini sudah pun dibayar.' };

    const due = Math.min(loan.balance, loan.yearlyDue);
    if (s.money < due) {
      return { ok: false, msg: `Baki tidak mencukupi — perlukan ${Utils.formatMoney(due, s.countryId)}.` };
    }

    s.money -= due;
    loan.balance = Math.max(0, Math.round(loan.balance - due));
    loan.paidThisYear = true;
    loan.missedPayments = 0;

    if (loan.lenderType === 'bank') {
      s.creditScore = Utils.clamp(s.creditScore + 18, 300, 850);
    }

    if (loan.balance <= 0) {
      s.loans.splice(idx, 1);
      GameState.adjustStats({ happiness: 8 });
      if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: -10 });
      GameState.addJournalEntry(`💰 Anda berjaya melangsaikan sepenuhnya hutang dengan ${loan.lenderName}!`, 'milestone');
      GameState.save();
      return { ok: true, msg: `Hutang ${loan.lenderName} telah langsai sepenuhnya!` };
    }

    GameState.addJournalEntry(`💵 Membayar ansuran tahunan ${Utils.formatMoney(due, s.countryId)} kepada ${loan.lenderName}.`, 'milestone');
    GameState.save();
    return { ok: true, msg: `Ansuran ${Utils.formatMoney(due, s.countryId)} berjaya dibayar.` };
  },

  payOffLoan(s, loanId) {
    this.ensureFields(s);
    const idx = s.loans.findIndex(l => l.id === loanId);
    if (idx === -1) return { ok: false, msg: 'Rekod hutang tidak ditemui.' };
    const loan = s.loans[idx];
    const amt = Math.max(0, Math.round(loan.balance));
    if (s.money < amt) {
      return { ok: false, msg: `Baki tidak mencukupi — perlukan ${Utils.formatMoney(amt, s.countryId)} untuk langsai penuh.` };
    }

    s.money -= amt;
    s.loans.splice(idx, 1);
    if (loan.lenderType === 'bank') {
      s.creditScore = Utils.clamp(s.creditScore + 35, 300, 850);
    }
    GameState.adjustStats({ happiness: 10 });
    if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: -14 });
    GameState.addJournalEntry(`💰 Anda melangsaikan penuh baki hutang ${Utils.formatMoney(amt, s.countryId)} kepada ${loan.lenderName}. Lega rasanya bebas hutang!`, 'milestone');
    GameState.save();
    return { ok: true, msg: `Hutang ${loan.lenderName} langsai sepenuhnya!` };
  },

  tickYearlyLoans(s) {
    if (!s || !s.alive) return null;
    this.ensureFields(s);
    if (s.loans.length === 0) return null;

    const inPrison = Boolean(s.prison && s.prison.inPrison);
    let dilemmaEvent = null;
    const surviving = [];

    for (const loan of s.loans) {
      loan.yearsElapsed = (loan.yearsElapsed || 0) + 1;

      if (!loan.paidThisYear) {
        if (loan.lenderType === 'bank') {
          const due = Math.min(loan.balance, loan.yearlyDue);
          if (!inPrison && s.money >= due) {
            s.money -= due;
            loan.balance = Math.max(0, Math.round(loan.balance - due));
            loan.missedPayments = 0;
            s.creditScore = Utils.clamp(s.creditScore + 12, 300, 850);
            GameState.addJournalEntry(`🏦 Potongan automatik ansuran ${loan.lenderName}: -${Utils.formatMoney(due, s.countryId)}.`);
          } else {
            loan.missedPayments = (loan.missedPayments || 0) + 1;
            const lateFee = Math.round(loan.balance * (loan.interestRate + 0.08));
            loan.balance = Math.round(loan.balance + lateFee);
            s.creditScore = Utils.clamp(s.creditScore - Utils.randInt(45, 75), 300, 850);
            if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: 14 });
            GameState.addJournalEntry(
              `⚠️ TUNGGAKAN BANK (${loan.lenderName}): Gagal membayar ansuran tahunan! Baki hutang meningkat kepada ${Utils.formatMoney(loan.balance, s.countryId)} dan skor kredit merosot teruk.`,
              'warning'
            );

            if (loan.missedPayments >= 2) {
              s.loanBlacklisted = true;
              if (s.assets && Array.isArray(s.assets.vehicles) && s.assets.vehicles.length > 0) {
                const seized = s.assets.vehicles.pop();
                loan.balance = Math.max(0, loan.balance - Math.round((seized.value || 0) * 0.7));
                GameState.addJournalEntry(`🚨 SITAAN ASET BANK: Kenderaan anda (${seized.name}) telah disita oleh pihak bank bagi menampung tunggakan hutang!`, 'warning');
              } else if (s.assets && Array.isArray(s.assets.properties) && s.assets.properties.length > 0) {
                const seized = s.assets.properties.pop();
                loan.balance = Math.max(0, loan.balance - Math.round((seized.value || 0) * 0.7));
                GameState.addJournalEntry(`🚨 SITAAN ASET BANK: Hartanah anda (${seized.name}) dilelong oleh pihak bank akibat tunggakan hutang!`, 'warning');
              } else {
                const garnish = Math.min(Math.max(0, s.money), Math.round(loan.yearlyDue * 0.5));
                if (garnish > 0) s.money -= garnish;
                if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: 15 });
                GameState.addJournalEntry(`⚖️ TINDAKAN UNDANG-UNDANG BANK: Nama anda disenarai hitam dan akaun anda dikenakan tindakan pemotongan paksa.`, 'warning');
              }
            }
          }
        } else {
          // AH LONG — faedah berganda kejam + gangguan meningkat
          loan.missedPayments = (loan.missedPayments || 0) + 1;
          const compound = Math.round(loan.balance * (loan.interestRate + 0.15));
          loan.balance = Math.round(loan.balance + compound);
          loan.yearlyDue = Math.max(loan.yearlyDue, Math.round(loan.balance * 0.45));

          if (inPrison) {
            if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: 18 });
            GameState.addJournalEntry(
              `🦈 Hutang ${loan.lenderName} terus berganda menjadi ${Utils.formatMoney(loan.balance, s.countryId)} walaupun anda di dalam penjara. Surat ugutan turut dihantar kepada keluarga anda.`,
              'warning'
            );
          } else if (loan.missedPayments === 1) {
            if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: Utils.randInt(18, 26) });
            GameState.adjustStats({ happiness: -Utils.randInt(10, 15) });
            GameState.addJournalEntry(
              `🦈🚨 PANGGILAN UGUTAN AH LONG (${loan.lenderName}): Anda diganggu siang dan malam akibat lewat bayar! Baki hutang melonjak kepada ${Utils.formatMoney(loan.balance, s.countryId)}.`,
              'warning'
            );
          } else if (loan.missedPayments === 2) {
            if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: Utils.randInt(25, 35) });
            GameState.adjustStats({ happiness: -16 });
            if (Array.isArray(s.relationships)) {
              s.relationships.forEach(r => {
                if (r && r.alive && (r.category === 'family' || r.category === 'spouse')) {
                  r.closeness = Utils.clamp((r.closeness || 50) - 18, 0, 100);
                }
              });
            }
            let jobNote = '';
            if (s.job && !s.job.isUnderground && Utils.chance(0.55)) {
              const title = s.job.title;
              s.job = null;
              if (window.HealthMedicalEngine) HealthMedicalEngine.resetJobMcStats(s);
              jobNote = ` Majikan memecat anda daripada jawatan ${title} kerana konco Ah Long membuat kecoh di pejabat!`;
            }
            GameState.addJournalEntry(
              `🦈🎨 SIMBAH CAT MERAH (${loan.lenderName}): Konco Ah Long menyimbah cat merah di rumah dan mengganggu tempat kerja anda!${jobNote} Baki hutang kini ${Utils.formatMoney(loan.balance, s.countryId)}.`,
              'warning'
            );
          } else {
            if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: Utils.randInt(30, 40) });
            GameState.adjustStats({ health: -Utils.randInt(18, 32), happiness: -20 });
            GameState.addJournalEntry(
              `🦈🩸 SERANGAN KONCO AH LONG (${loan.lenderName}): Konco Ah Long menyerang dan mengugut nyawa anda akibat tunggakan ${Utils.formatMoney(loan.balance, s.countryId)}!`,
              'warning'
            );

            if (!dilemmaEvent) {
              const halfAmt = Math.round(loan.balance * 0.5);
              const isFug = Boolean(s.fugitive && s.fugitive.isFugitive);
              const choices = [
                {
                  label: `💵 Bayar Separuh Sekarang (${Utils.formatMoney(halfAmt, s.countryId)})`,
                  action: () => {
                    if (s.money >= halfAmt) {
                      s.money -= halfAmt;
                      loan.balance = Math.max(0, loan.balance - halfAmt);
                      loan.missedPayments = 1;
                      return `Anda menyerahkan ${Utils.formatMoney(halfAmt, s.countryId)} kepada konco ${loan.lenderName} untuk meredakan keadaan buat sementara waktu.`;
                    }
                    if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: 15 });
                    GameState.adjustStats({ health: -10 });
                    return 'Wang anda tidak mencukupi! Konco Ah Long merampas barang berharga anda dan memberi amaran terakhir.';
                  }
                },
                {
                  label: '🙏 Merayu Tangguh (Faedah Naik Lagi)',
                  action: () => {
                    loan.balance = Math.round(loan.balance * 1.35);
                    if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: 16 });
                    return `Mereka bersetuju menangguhkan tindakan, tetapi menggandakan lagi baki hutang anda kepada ${Utils.formatMoney(loan.balance, s.countryId)}!`;
                  }
                }
              ];
              if (!isFug) {
                choices.push({
                  label: '🚓 Lapor Kepada Polis (Risiko Balas Dendam)',
                  action: () => {
                    if (Utils.chance(0.45)) {
                      loan.missedPayments = 1;
                      return 'Polis melakukan rondaan di kawasan anda. Konco Ah Long berundur buat sementara waktu, tetapi hutang anda masih belum selesai.';
                    }
                    GameState.adjustStats({ health: -15 });
                    if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: 22 });
                    return 'Ah Long mengetahui laporan anda dan bertindak balas dengan lebih ganas!';
                  }
                });
              }
              dilemmaEvent = {
                id: 'ahlong_attack_' + s.year,
                icon: '🦈',
                title: `Konco ${loan.lenderName} Mengepung Anda!`,
                text: `Anda gagal membayar hutang Ah Long sebanyak ${Utils.formatMoney(loan.balance, s.countryId)} selama ${loan.missedPayments} tahun berturut-turut. Konco mereka kini mengugut keselamatan anda!`,
                choices
              };
            }
          }
        }
      }

      if (loan.balance > 0) {
        loan.paidThisYear = false;
        surviving.push(loan);
      }
    }

    s.loans = surviving;
    return dilemmaEvent;
  }
};
