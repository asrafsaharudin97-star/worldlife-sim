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

    partner.type = 'ex';
    partner.role = 'Bekas Pasangan';
    partner.stage = 'divorced';
    partner.closeness = Math.max(5, (partner.closeness || 40) - 40);
    s.married = false;
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

  getWasiatSummary(s) {
    this.ensureLegalFields(s);
    const mode = (s.legal.wasiat && (s.legal.wasiat.willType || s.legal.wasiat.mode)) || 'equal';
    const soleId = (s.legal.wasiat && (s.legal.wasiat.soleHeirId || s.legal.wasiat.soleBeneficiaryId)) || null;
    if ((mode === 'sole_heir' || mode === 'single_child') && soleId) {
      const livingFamily = this._getLivingFamilyHeirs(s);
      const chosen = livingFamily.find(rel => rel.id === soleId);
      return chosen
        ? `100% Kepada ${chosen.name} (Ahli Waris Pilihan)`
        : '100% Kepada Ahli Waris Pilihan';
    }
    const labels = {
      equal: 'Pembahagian Sama Rata',
      spouse_all: '100% Kepada Pasangan',
      charity: '100% Yayasan Kebajikan',
      sole_heir: '100% Kepada Ahli Waris Pilihan',
      single_child: '100% Kepada Ahli Waris Pilihan'
    };
    return labels[mode] || labels.equal;
  },

  // --------------------------------------------------------------------------
  // 6. PENGURUSAN WASIAT SIVIL (CUSTOMIZABLE WILL)
  // --------------------------------------------------------------------------
  setCivilWasiat(s, mode, soleBeneficiaryId = null) {
    this.ensureLegalFields(s);
    const validModes = ['equal', 'spouse_all', 'single_child', 'sole_heir', 'charity'];
    if (!validModes.includes(mode)) {
      return { ok: false, msg: 'Mod wasiat tidak sah.' };
    }
    const isSoleMode = mode === 'sole_heir' || mode === 'single_child';
    const nextSoleId = isSoleMode ? soleBeneficiaryId : null;
    if (isSoleMode && !nextSoleId) {
      return { ok: false, msg: 'Sila pilih seorang pewaris tunggal.' };
    }

    const prevMode = s.legal.wasiat.mode;
    const prevSoleId = s.legal.wasiat.soleHeirId || s.legal.wasiat.soleBeneficiaryId || null;
    const isSameSelection = prevMode === mode && prevSoleId === nextSoleId;

    s.legal.wasiat.mode = mode;
    s.legal.wasiat.willType = mode;
    s.legal.wasiat.soleBeneficiaryId = nextSoleId;
    s.legal.wasiat.soleHeirId = nextSoleId;
    s.legal.wasiat.charityPct = mode === 'charity' ? 100 : 0;

    if (isSoleMode) {
      const livingFamily = this._getLivingFamilyHeirs(s);
      const chosen = livingFamily.find(r => r.id === nextSoleId);
      const chosenName = chosen ? chosen.name : 'Pewaris Pilihan';
      if (!isSameSelection) {
        const others = livingFamily.filter(r => r.id !== nextSoleId);
        if (others.length > 0) {
          others.forEach(rel => {
            const dropClose = Utils.randInt(25, 40);
            const dropTrust = Utils.randInt(25, 40);
            rel.closeness = Utils.clamp((rel.closeness ?? 60) - dropClose, 0, 100);
            rel.trust = Utils.clamp((rel.trust ?? 60) - dropTrust, 0, 100);
          });
          const stressGain = Utils.randInt(15, 25);
          if (window.KarmaEndings) {
            KarmaEndings.adjustAlignment({ stress: stressGain });
          } else if (s.alignment) {
            s.alignment.stress = Utils.clamp((s.alignment.stress || 0) + stressGain, 0, 100);
          }
          GameState.addJournalEntry(
            `🔥 KONFLIK KELUARGA (WASIAT): Keputusan anda menyerahkan 100% harta kepada ${chosenName} menimbulkan kemarahan ${others.length} ahli keluarga lain (Kepercayaan & Kemesraan merosot teruk, Stres +${stressGain}%).`,
            'warning'
          );
          GameState.save();
          return {
            ok: true,
            msg: `Wasiat 100% ditetapkan kepada ${chosenName}! Ahli keluarga lain berang (+${stressGain}% Stres).`
          };
        }
      }
      GameState.addJournalEntry(`📜 Wasiat sivil dikemas kini: 100% harta diserahkan kepada pewaris tunggal, ${chosenName}.`, 'milestone');
      GameState.save();
      return { ok: true, msg: `Wasiat 100% ditetapkan kepada ${chosenName}.` };
    }

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
    const countryId = s.countryId || 'MY';
    const c = (window.Utils && Utils.getCountry) ? Utils.getCountry(countryId) : { name: countryId };
    const cash = Math.max(0, Math.round(s.money || 0));
    const assetSum = window.AssetsEngine ? AssetsEngine.getAssetCashflowSummary(s) : { totalAssetValue: 0, totalDebt: 0 };
    const grossEstate = cash + Math.round(assetSum.totalAssetValue || 0);
    const totalDebt = Math.round(assetSum.totalDebt || 0) + (s.money < 0 ? Math.abs(Math.round(s.money)) : 0);
    const netBeforeTax = Math.max(0, grossEstate - totalDebt);

    const netUsd = Utils.localToUsd ? Utils.localToUsd(netBeforeTax, countryId) : netBeforeTax;
    const taxRate = this.getCountryEstateTaxRate(countryId, netUsd);
    const estateTax = Math.round(netBeforeTax * taxRate);
    const distributable = Math.max(0, netBeforeTax - estateTax);

    const spouse = s.married && s.partnerId
      ? (s.relationships || []).find(r => r.id === s.partnerId && r.alive)
      : null;
    const children = (s.relationships || []).filter(r => this._isChildRel(r) && r.alive);
    const parents = (s.relationships || []).filter(r => this._isParentRel(r) && r.alive);
    const livingFamily = this._getLivingFamilyHeirs(s);

    const mode = (s.legal.wasiat && (s.legal.wasiat.willType || s.legal.wasiat.mode)) || 'equal';
    const soleId = (s.legal.wasiat && (s.legal.wasiat.soleHeirId || s.legal.wasiat.soleBeneficiaryId)) || null;
    const wasiatLabels = {
      equal: 'Pembahagian Sama Rata (Sivil)',
      spouse_all: '100% Kepada Pasangan',
      single_child: '100% Kepada Pewaris Tunggal',
      sole_heir: '100% Kepada Pewaris Tunggal',
      charity: '100% Yayasan Kebajikan'
    };
    const shares = [];

    if (distributable > 0) {
      if (mode === 'charity') {
        shares.push({ id: 'charity', isEntity: true, name: 'Yayasan Kebajikan Awam', role: 'Derma Wasiat', fractionLabel: 'Wasiat Kebajikan', pct: 100, amount: distributable });
      } else if (mode === 'spouse_all' && spouse) {
        shares.push({ id: spouse.id, isEntity: false, name: spouse.name, role: spouse.role || 'Pasangan', fractionLabel: 'Wasiat Penuh Pasangan', pct: 100, amount: distributable });
      } else if ((mode === 'sole_heir' || mode === 'single_child') && soleId) {
        const chosen = livingFamily.find(rel => rel.id === soleId);
        if (chosen) {
          shares.push({ id: chosen.id, isEntity: false, name: chosen.name, role: chosen.isAdopted ? 'Anak Angkat' : (chosen.role || 'Pewaris'), fractionLabel: 'Pewaris Tunggal Wasiat (100%)', pct: 100, amount: distributable });
        }
      }

      if (shares.length === 0) {
        // Pembahagian sivil adil: Pasangan + semua anak (kandung & angkat sama rata)
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
    const systemName = 'Undang-Undang Sivil & Wasiat';

    return {
      countryId,
      countryName: c.name || countryId,
      systemName,
      systemLabel: systemName,
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
        const found = shares.find(sh => sh.id === heirId);
        return found ? found.amount : 0;
      }
    };
  }
};
