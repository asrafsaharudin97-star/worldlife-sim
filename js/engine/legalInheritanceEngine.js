/* ==========================================================================
   WorldLife — Enjin Undang-Undang Sivil, Perceraian & Pewarisan Wasiat
   Sistem Sivil & Wasiat Seragam untuk Semua Negara (Bahasa Melayu)
   ========================================================================== */

window.LegalInheritanceEngine = {

  // --------------------------------------------------------------------------
  // 1. INISIALISASI MEDAN UNDANG-UNDANG SIVIL & WASIAT
  // --------------------------------------------------------------------------
  ensureLegalFields(s) {
    if (!s) return;
    if (!s.legal || typeof s.legal !== 'object') {
      s.legal = {};
    }
    if (typeof s.legal.prenup !== 'boolean') s.legal.prenup = false;
    if (s.legal.prenupPartnerId === undefined) s.legal.prenupPartnerId = null;
    if (s.legal.marriedYear === undefined) s.legal.marriedYear = null;
    if (typeof s.legal.divorceCount !== 'number') s.legal.divorceCount = 0;
    if (!Array.isArray(s.legal.alimonyObligations)) s.legal.alimonyObligations = [];
    if (!Array.isArray(s.legal.alimonyIncome)) s.legal.alimonyIncome = [];
    if (!s.legal.wasiat || typeof s.legal.wasiat !== 'object') {
      s.legal.wasiat = {
        mode: 'equal', // 'equal' | 'spouse_all' | 'single_child' | 'charity'
        soleBeneficiaryId: null,
        charityPct: 0
      };
    }
    // Bersihkan medan warisan lama jika wujud daripada simpanan terdahulu
    delete s.legal.rujukDeadlineYear;
    delete s.legal.rujukExId;
    delete s.legal.rujukExName;
  },

  // --------------------------------------------------------------------------
  // 2. CUKAI HARTA PUSAKA MENGIKUT NEGARA (SIVIL)
  // --------------------------------------------------------------------------
  getCountryEstateTaxRate(countryId, netEstateUsd = 0) {
    if (netEstateUsd <= 0) return 0;
    const zeroTaxCountries = ['MY', 'SG', 'AU', 'NZ', 'CA', 'AE', 'SA', 'QA', 'KW', 'BN', 'ID', 'CN', 'IN', 'SE', 'NO'];
    if (zeroTaxCountries.includes(countryId)) return 0;
    if (countryId === 'US') return netEstateUsd > 1000000 ? 0.18 : 0.05;
    if (countryId === 'GB' || countryId === 'UK') return netEstateUsd > 400000 ? 0.20 : 0.05;
    if (countryId === 'JP' || countryId === 'KR') return netEstateUsd > 300000 ? 0.22 : 0.08;
    if (countryId === 'DE' || countryId === 'FR') return netEstateUsd > 400000 ? 0.15 : 0.05;
    return netEstateUsd > 500000 ? 0.10 : 0;
  },

  // --------------------------------------------------------------------------
  // 3. PERJANJIAN PRA-PERKAHWINAN (PRENUP) & REKOD PERKAHWINAN SIVIL
  // --------------------------------------------------------------------------
  getPrenupFeeLocal(countryId) {
    return Utils.usdToLocal(650, countryId);
  },

  recordMarriageStart(s, partner, hasPrenup = false) {
    this.ensureLegalFields(s);
    s.legal.prenup = Boolean(hasPrenup);
    s.legal.prenupPartnerId = hasPrenup && partner ? partner.id : null;
    s.legal.marriedYear = s.year;
    s.legal.preMarriageNetWorth = Math.max(0, GameState.getNetWorth());
  },

  // --------------------------------------------------------------------------
  // 4. PRATONTON & PELAKSANAAN PERCERAIAN SIVIL
  // --------------------------------------------------------------------------
  previewDivorce(s, partner, opts = {}) {
    this.ensureLegalFields(s);
    const mode = opts.settlementMode || 'mutual'; // 'mutual' | 'contested'
    const netWorth = Math.max(0, GameState.getNetWorth());
    const hasPrenup = Boolean(s.legal.prenup && (!s.legal.prenupPartnerId || s.legal.prenupPartnerId === (partner && partner.id)));
    const yearsMarried = Math.max(1, (s.year || 2025) - (s.legal.marriedYear || s.year || 2025));

    const legalFeeUsd = mode === 'contested' ? 2800 : 850;
    const legalFeeLocal = Utils.usdToLocal(legalFeeUsd, s.countryId);

    let splitPct = 0.50;
    if (hasPrenup) {
      splitPct = 0.10;
    } else if (mode === 'mutual') {
      splitPct = Math.min(0.45, 0.20 + yearsMarried * 0.03);
    } else {
      splitPct = 0.50;
    }

    const settlementLocal = Math.round(Math.max(0, s.money) * splitPct);
    const children = (s.relationships || []).filter(r => this._isChildRel(r) && r.alive && r.age < 18);
    const baseAlimony = hasPrenup ? 0 : Math.round(((s.job && s.job.salary) || 0) * (children.length > 0 ? 0.15 : 0.08));
    const alimonyYears = baseAlimony > 0 ? Math.min(8, Math.max(2, yearsMarried)) : 0;

    return {
      courtLabel: 'Mahkamah Sivil',
      hasPrenup,
      yearsMarried,
      splitPct: Math.round(splitPct * 100),
      legalFeeLocal,
      settlementLocal,
      alimonyAnnualLocal: baseAlimony,
      alimonyYears,
      childrenCount: children.length,
      summary: hasPrenup
        ? 'Perjanjian Pra-Perkahwinan aktif — sebahagian besar aset asal anda dilindungi.'
        : (mode === 'mutual'
          ? 'Perceraian persetujuan bersama — kos guaman lebih rendah dan pembahagian harta secara rundingan.'
          : 'Perceraian bertikai di Mahkamah Sivil — pembahagian harta sepencarian 50/50 serta kos guaman lebih tinggi.')
    };
  },

  executeDivorce(s, partnerId, opts = {}) {
    this.ensureLegalFields(s);
    const partner = (s.relationships || []).find(r => r.id === partnerId);
    if (!partner) return { ok: false, msg: 'Pasangan tidak ditemui.' };

    const prev = this.previewDivorce(s, partner, opts);
    const totalDeduct = prev.legalFeeLocal + prev.settlementLocal;
    s.money = Math.round(s.money - totalDeduct);

    if (prev.alimonyAnnualLocal > 0 && prev.alimonyYears > 0) {
      s.legal.alimonyObligations.push({
        exId: partner.id,
        exName: partner.name,
        annualLocal: prev.alimonyAnnualLocal,
        yearsLeft: prev.alimonyYears
      });
    }

    s.relationships = (s.relationships || []).filter(r => r && r.id !== partner.id);
    s.married = false;
    s.maritalStatus = 'divorced';
    s.partnerId = null;
    s.legal.prenup = false;
    s.legal.prenupPartnerId = null;
    s.legal.marriedYear = null;
    s.legal.divorceCount = (s.legal.divorceCount || 0) + 1;

    GameState.adjustStats({ happiness: -22 });
    if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: 18 });

    const fmtCost = Utils.formatMoney(totalDeduct, s.countryId);
    GameState.addJournalEntry(
      `⚖️ Perceraian sivil dengan ${partner.name} dimuktamadkan di Mahkamah Sivil. Kos guaman & penyelesaian harta: ${fmtCost}.${prev.alimonyAnnualLocal > 0 ? ` Nafkah tahunan: ${Utils.formatMoney(prev.alimonyAnnualLocal, s.countryId)}/thn selama ${prev.alimonyYears} tahun.` : ''}`,
      'warning'
    );
    GameState.save();

    return {
      ok: true,
      msg: `Perceraian sivil dengan ${partner.name} selesai (${fmtCost}).`
    };
  },

  // --------------------------------------------------------------------------
  // 5. KUTIPAN / BAYARAN NAFKAH TAHUNAN
  // --------------------------------------------------------------------------
  tickYearlyLegal(s) {
    this.ensureLegalFields(s);
    if (s.legal.alimonyObligations.length > 0) {
      s.legal.alimonyObligations = s.legal.alimonyObligations.filter(ob => {
        if (ob.yearsLeft <= 0) return false;
        const pay = Math.max(0, Math.round(ob.annualLocal || 0));
        if (pay > 0) s.money = Math.round(s.money - pay);
        ob.yearsLeft -= 1;
        return ob.yearsLeft > 0;
      });
    }
    if (s.legal.alimonyIncome.length > 0) {
      s.legal.alimonyIncome = s.legal.alimonyIncome.filter(inc => {
        if (inc.yearsLeft <= 0) return false;
        const gain = Math.max(0, Math.round(inc.annualLocal || 0));
        if (gain > 0) s.money = Math.round(s.money + gain);
        inc.yearsLeft -= 1;
        return inc.yearsLeft > 0;
      });
    }
  },

  _getLivingFamilyHeirs(s) {
    return (s.relationships || []).filter(r =>
      r && r.alive && (
        r.id === s.partnerId ||
        r.category === 'family' ||
        r.category === 'spouse' ||
        r.category === 'partner' ||
        r.type === 'sibling' ||
        this._isChildRel(r) ||
        this._isParentRel(r)
      )
    );
  },

  ensureFamilyTrust(s) {
    if (!s) return null;
    if (!s.familyTrust || typeof s.familyTrust !== 'object') {
      s.familyTrust = { active: false, balance: 0, lapsed: false, lastPaidAge: null };
    }
    s.familyTrust.active = Boolean(s.familyTrust.active);
    s.familyTrust.balance = Math.max(0, Math.round(Number(s.familyTrust.balance) || 0));
    s.familyTrust.lapsed = Boolean(s.familyTrust.lapsed);
    if (s.familyTrust.lastPaidAge === undefined) s.familyTrust.lastPaidAge = null;
    // Migrasi selamat untuk simpanan lama yang pernah memilih pewaris tunggal 100%
    if (s.legal && s.legal.wasiat && (s.legal.wasiat.mode === 'sole_heir' || s.legal.wasiat.mode === 'single_child' || s.legal.wasiat.willType === 'sole_heir' || s.legal.wasiat.willType === 'single_child')) {
      s.legal.wasiat.mode = 'equal';
      s.legal.wasiat.willType = 'equal';
      s.legal.wasiat.soleHeirId = null;
      s.legal.wasiat.soleBeneficiaryId = null;
    }
    return s.familyTrust;
  },

  getTrustSetupFee(s) {
    if (!s) return 0;
    return Utils.usdToLocal(5000, s.countryId || 'MY');
  },

  getTrustAnnualFee(s) {
    if (!s) return 0;
    this.ensureFamilyTrust(s);
    const cid = s.countryId || 'MY';
    const baseFee = Utils.usdToLocal(450, cid);
    const protectedWealth = Math.max(0, s.familyTrust.balance || 0) + Math.max(0, Math.round(s.money || 0));
    const variableFee = Math.round(protectedWealth * 0.0175);
    const capFee = Utils.usdToLocal(75000, cid);
    return Math.min(capFee, baseFee + variableFee);
  },

  setupFamilyTrust(s) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureLegalFields(s);
    this.ensureFamilyTrust(s);
    if (s.age < 18) return { ok: false, msg: 'Anda mesti berumur 18 tahun ke atas untuk menubuhkan Yayasan Keluarga.' };
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Tidak boleh menubuhkan Yayasan Keluarga semasa dalam tahanan.' };
    if (s.familyTrust.active) return { ok: false, msg: 'Tabung Yayasan Keluarga sudah pun aktif.' };
    const fee = this.getTrustSetupFee(s);
    if (s.money < fee) {
      return { ok: false, msg: `Baki tidak mencukupi — kos penubuhan ialah ${Utils.formatMoney(fee, s.countryId)}.` };
    }
    s.money -= fee;
    s.familyTrust.active = true;
    s.familyTrust.lapsed = false;
    s.familyTrust.lastPaidAge = s.age;
    GameState.addJournalEntry(
      `🏛️ Anda menubuhkan Tabung Yayasan Keluarga dengan yuran pendaftaran ${Utils.formatMoney(fee, s.countryId)}. Harta pusaka anda kini dilindungi bebas cukai pusaka selagi yuran tahunan dibayar!`,
      'milestone'
    );
    GameState.save();
    return { ok: true, msg: 'Tabung Yayasan Keluarga berjaya ditubuhkan!' };
  },

  depositFamilyTrust(s, amount) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureFamilyTrust(s);
    if (s.age < 18) return { ok: false, msg: 'Hanya dibuka untuk umur 18 tahun ke atas.' };
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Transaksi yayasan disekat semasa dalam tahanan.' };
    if (!s.familyTrust.active) return { ok: false, msg: 'Sila tubuhkan Tabung Yayasan Keluarga dahulu.' };
    const amt = Math.round(Number(amount) || 0);
    if (amt <= 0) return { ok: false, msg: 'Masukkan jumlah dana yang sah.' };
    if (s.money < amt) return { ok: false, msg: 'Baki bank tidak mencukupi.' };
    s.money -= amt;
    s.familyTrust.balance += amt;
    GameState.addJournalEntry(`🏛️ Memasukkan ${Utils.formatMoney(amt, s.countryId)} ke dalam Tabung Yayasan Keluarga (Dana Yayasan: ${Utils.formatMoney(s.familyTrust.balance, s.countryId)}).`);
    GameState.save();
    return { ok: true, msg: `Dana ${Utils.formatMoney(amt, s.countryId)} dimasukkan ke Yayasan Keluarga.` };
  },

  withdrawFamilyTrust(s, amount) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureFamilyTrust(s);
    if (s.age < 18) return { ok: false, msg: 'Hanya dibuka untuk umur 18 tahun ke atas.' };
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Transaksi yayasan disekat semasa dalam tahanan.' };
    if (!s.familyTrust.active) return { ok: false, msg: 'Tabung Yayasan Keluarga tidak aktif.' };
    const amt = Math.round(Number(amount) || 0);
    if (amt <= 0) return { ok: false, msg: 'Masukkan jumlah pengeluaran yang sah.' };
    if (s.familyTrust.balance < amt) return { ok: false, msg: 'Dana dalam Yayasan Keluarga tidak mencukupi.' };
    s.familyTrust.balance -= amt;
    s.money += amt;
    GameState.addJournalEntry(`💵 Mengeluarkan ${Utils.formatMoney(amt, s.countryId)} daripada Tabung Yayasan Keluarga ke akaun bank.`);
    GameState.save();
    return { ok: true, msg: `Dana ${Utils.formatMoney(amt, s.countryId)} dikeluarkan ke akaun bank.` };
  },

  payTrustArrearsAndReactivate(s) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureFamilyTrust(s);
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Tidak boleh mengaktifkan semula yayasan semasa dalam tahanan.' };
    if (!s.familyTrust.active || !s.familyTrust.lapsed) return { ok: false, msg: 'Yayasan tidak mempunyai tunggakan yuran.' };
    const fee = this.getTrustAnnualFee(s);
    if (s.money >= fee) {
      s.money -= fee;
    } else if (s.familyTrust.balance >= fee) {
      s.familyTrust.balance -= fee;
    } else {
      return { ok: false, msg: `Baki tidak mencukupi — perlukan ${Utils.formatMoney(fee, s.countryId)} untuk melangsaikan yuran.` };
    }
    s.familyTrust.lapsed = false;
    s.familyTrust.lastPaidAge = s.age;
    GameState.addJournalEntry(`🔄 Tunggakan yuran Tabung Yayasan Keluarga (${Utils.formatMoney(fee, s.countryId)}) dilangsaikan. Perlindungan bebas cukai pusaka kini aktif semula!`, 'milestone');
    GameState.save();
    return { ok: true, msg: 'Tabung Yayasan Keluarga berjaya diaktifkan semula!' };
  },

  dissolveFamilyTrust(s) {
    if (!s) return { ok: false, msg: 'Keadaan watak tidak sah.' };
    this.ensureFamilyTrust(s);
    if (s.prison && s.prison.inPrison) return { ok: false, msg: 'Tidak boleh membubarkan yayasan semasa dalam tahanan.' };
    if (!s.familyTrust.active) return { ok: false, msg: 'Tabung Yayasan Keluarga tidak aktif.' };
    const returned = Math.max(0, Math.round(s.familyTrust.balance || 0));
    s.money += returned;
    s.familyTrust.balance = 0;
    s.familyTrust.active = false;
    s.familyTrust.lapsed = false;
    s.familyTrust.lastPaidAge = null;
    GameState.addJournalEntry(`❌ Tabung Yayasan Keluarga dibubarkan. Dana ${Utils.formatMoney(returned, s.countryId)} dikembalikan ke akaun bank anda (harta kini tertakluk cukai pusaka biasa).`, 'warning');
    GameState.save();
    return { ok: true, msg: `Yayasan Keluarga dibubarkan. ${Utils.formatMoney(returned, s.countryId)} dikembalikan ke akaun bank.` };
  },

  tickYearlyFamilyTrust(s) {
    if (!s || !s.alive) return;
    this.ensureFamilyTrust(s);
    if (!s.familyTrust.active) return;

    const fee = this.getTrustAnnualFee(s);
    if (s.money >= fee) {
      s.money -= fee;
      s.familyTrust.lapsed = false;
      s.familyTrust.lastPaidAge = s.age;
      GameState.addJournalEntry(`🏛️ Yuran pengurusan tahunan Tabung Yayasan Keluarga telah ditolak (-${Utils.formatMoney(fee, s.countryId)}).`);
    } else if (s.familyTrust.balance >= fee) {
      s.familyTrust.balance -= fee;
      s.familyTrust.lapsed = false;
      s.familyTrust.lastPaidAge = s.age;
      GameState.addJournalEntry(`🏛️ Yuran pengurusan tahunan Tabung Yayasan Keluarga telah ditolak daripada dana yayasan (-${Utils.formatMoney(fee, s.countryId)}).`);
    } else {
      s.familyTrust.lapsed = true;
      GameState.addJournalEntry(
        `⚠️ Gagal membayar yuran tahunan Tabung Yayasan Keluarga (${Utils.formatMoney(fee, s.countryId)}). Perlindungan bebas cukai kini digantung sehingga tunggakan dilangsaikan.`,
        'warning'
      );
    }
  },

  getWasiatSummary(s) {
    this.ensureLegalFields(s);
    this.ensureFamilyTrust(s);
    const mode = (s.legal.wasiat && (s.legal.wasiat.willType || s.legal.wasiat.mode)) || 'equal';
    const labels = {
      equal: 'Pembahagian Sama Rata',
      spouse_all: '100% Kepada Pasangan',
      charity: '100% Yayasan Kebajikan'
    };
    const base = labels[mode] || labels.equal;
    if (s.familyTrust.active && !s.familyTrust.lapsed) {
      return `${base} + Tabung Yayasan Keluarga (Bebas Cukai Pusaka)`;
    }
    return base;
  },

  // --------------------------------------------------------------------------
  // 6. PENGURUSAN WASIAT SIVIL (CUSTOMIZABLE WILL)
  // --------------------------------------------------------------------------
  setCivilWasiat(s, mode) {
    this.ensureLegalFields(s);
    this.ensureFamilyTrust(s);
    const validModes = ['equal', 'spouse_all', 'charity'];
    if (!validModes.includes(mode)) {
      return { ok: false, msg: 'Mod wasiat tidak sah.' };
    }

    s.legal.wasiat.mode = mode;
    s.legal.wasiat.willType = mode;
    s.legal.wasiat.soleBeneficiaryId = null;
    s.legal.wasiat.soleHeirId = null;
    s.legal.wasiat.charityPct = mode === 'charity' ? 100 : 0;

    const labels = {
      equal: 'Pembahagian Sama Rata (Pasangan & Semua Anak)',
      spouse_all: '100% Kepada Pasangan',
      charity: '100% Didermakan Kepada Yayasan Kebajikan'
    };
    GameState.addJournalEntry(`📜 Wasiat sivil dikemas kini: ${labels[mode]}.`, 'milestone');
    GameState.save();
    return { ok: true, msg: `Wasiat sivil ditetapkan: ${labels[mode]}.` };
  },

  _isChildRel(r) {
    return Boolean(r && (r.type === 'child' || ['Anak Lelaki', 'Anak Perempuan', 'Son', 'Daughter'].includes(r.role)));
  },

  _isParentRel(r) {
    return Boolean(r && (r.type === 'parent' || ['Ibu', 'Ayah', 'Bapa', 'Ibu Angkat', 'Ayah Angkat', 'Mother', 'Father'].includes(r.role)));
  },

  // --------------------------------------------------------------------------
  // 7. PENYATA & PEMBAHAGIAN HARTA PUSAKA (UNDANG-UNDANG SIVIL & WASIAT)
  // --------------------------------------------------------------------------
  calculateEstateStatement(s) {
    this.ensureLegalFields(s);
    this.ensureFamilyTrust(s);
    const countryId = s.countryId || 'MY';
    const c = (window.Utils && Utils.getCountry) ? Utils.getCountry(countryId) : { name: countryId };
    const cash = Math.max(0, Math.round(s.money || 0));
    const trustBalance = Math.max(0, Math.round((s.familyTrust && s.familyTrust.balance) || 0));
    const trustProtected = Boolean(s.familyTrust && s.familyTrust.active && !s.familyTrust.lapsed);
    const assetSum = window.AssetsEngine ? AssetsEngine.getAssetCashflowSummary(s) : { totalAssetValue: 0, totalDebt: 0 };
    const grossEstate = cash + trustBalance + Math.round(assetSum.totalAssetValue || 0);
    const totalDebt = Math.round(assetSum.totalDebt || 0) + (s.money < 0 ? Math.abs(Math.round(s.money)) : 0);
    const netBeforeTax = Math.max(0, grossEstate - totalDebt);

    const netUsd = Utils.localToUsd ? Utils.localToUsd(netBeforeTax, countryId) : netBeforeTax;
    const taxRate = trustProtected ? 0 : this.getCountryEstateTaxRate(countryId, netUsd);
    const estateTax = trustProtected ? 0 : Math.round(netBeforeTax * taxRate);
    const distributable = Math.max(0, netBeforeTax - estateTax);

    const spouse = s.married && s.partnerId
      ? (s.relationships || []).find(r => r.id === s.partnerId && r.alive)
      : null;
    const children = (s.relationships || []).filter(r => this._isChildRel(r) && r.alive);
    const parents = (s.relationships || []).filter(r => this._isParentRel(r) && r.alive);

    const mode = (s.legal.wasiat && (s.legal.wasiat.willType || s.legal.wasiat.mode)) || 'equal';
    const shares = [];

    if (distributable > 0) {
      if (mode === 'charity' && !trustProtected) {
        shares.push({ id: 'charity', isEntity: true, name: 'Yayasan Kebajikan Awam', role: 'Derma Wasiat', fractionLabel: 'Wasiat Kebajikan', pct: 100, amount: distributable });
      } else if (mode === 'spouse_all' && spouse && !trustProtected) {
        shares.push({ id: spouse.id, isEntity: false, name: spouse.name, role: spouse.role || 'Pasangan', fractionLabel: 'Wasiat Penuh Pasangan', pct: 100, amount: distributable });
      }

      if (shares.length === 0) {
        if (spouse && children.length > 0) {
          const spouseAmt = Math.round(distributable * 0.5);
          const childPool = distributable - spouseAmt;
          const perChild = Math.round(childPool / children.length);
          shares.push({ id: spouse.id, isEntity: false, name: spouse.name, role: spouse.role || 'Pasangan', fractionLabel: 'Bahagian Pasangan (1/2)', pct: 50, amount: spouseAmt });
          children.forEach(ch => {
            shares.push({
              id: ch.id,
              isEntity: false,
              name: ch.name,
              role: ch.isAdopted ? 'Anak Angkat' : (ch.role || 'Anak'),
              fractionLabel: `Bahagian Anak (1/${children.length * 2})`,
              pct: Math.round((50 / children.length) * 10) / 10,
              amount: perChild
            });
          });
        } else if (children.length > 0) {
          const perChild = Math.round(distributable / children.length);
          children.forEach(ch => {
            shares.push({
              id: ch.id,
              isEntity: false,
              name: ch.name,
              role: ch.isAdopted ? 'Anak Angkat' : (ch.role || 'Anak'),
              fractionLabel: `Bahagian Sama Rata (1/${children.length})`,
              pct: Math.round((100 / children.length) * 10) / 10,
              amount: perChild
            });
          });
        } else if (spouse) {
          shares.push({ id: spouse.id, isEntity: false, name: spouse.name, role: spouse.role || 'Pasangan', fractionLabel: 'Waris Tunggal Pasangan', pct: 100, amount: distributable });
        } else if (parents.length > 0) {
          const perParent = Math.round(distributable / parents.length);
          parents.forEach(par => {
            shares.push({
              id: par.id,
              isEntity: false,
              name: par.name,
              role: par.role || 'Ibu Bapa',
              fractionLabel: `Bahagian Ibu Bapa (1/${parents.length})`,
              pct: Math.round((100 / parents.length) * 10) / 10,
              amount: perParent
            });
          });
        } else {
          shares.push({ id: 'state', isEntity: true, name: 'Tabung Amanah Awam', role: 'Tiada Waris Kandung', fractionLabel: 'Pewaris Waris Jauh / Amanah', pct: 100, amount: distributable });
        }
      }
    }

    const heirlooms = ((s.assets && s.assets.collectibles) || []).filter(col => col && col.isHeirloom);
    const taxRatePct = Math.round(taxRate * 100);
    const systemName = trustProtected ? 'Tabung Yayasan Keluarga (Bebas Cukai Pusaka)' : 'Undang-Undang Sivil & Wasiat';

    return {
      countryId,
      countryName: c.name || countryId,
      systemName,
      systemLabel: systemName,
      trustProtected,
      trustBalance,
      grossEstate,
      totalDebt,
      totalDebts: totalDebt,
      netBeforeTax,
      netEstate: netBeforeTax,
      taxRatePct,
      estateTaxRate: taxRatePct,
      estateTax,
      estateTaxAmount: estateTax,
      distributable,
      distributableEstate: distributable,
      wasiatMode: mode,
      wasiatLabel: this.getWasiatSummary(s),
      heirlooms,
      shares,
      getHeirAmount(heirId) {
        if (trustProtected) return distributable;
        const found = shares.find(sh => sh.id === heirId);
        return found ? found.amount : 0;
      }
    };
  }
};
