/* ==========================================================================
   WorldLife — Modal Interaktif (Peristiwa, Kerjaya, Aset, Hijrah, Pasport)
   Bahasa Melayu
   ========================================================================== */

window.Modals = {
  locked: false,

  open({ icon = '✨', title, subtitle = '', bodyHtml = '', locked = false }) {
    this.locked = locked;
    document.getElementById('modal-icon').textContent = icon;
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-subtitle').textContent = subtitle;
    document.getElementById('modal-body').innerHTML = bodyHtml;
    document.getElementById('modal-close').classList.toggle('hidden', locked);
    document.getElementById('modal-backdrop').classList.remove('hidden');
  },

  close(force = false) {
    if (this.locked && !force) return;
    if (window.PrisonModals && typeof PrisonModals._cleanupMiniGame === 'function') {
      PrisonModals._cleanupMiniGame();
    }
    this.locked = false;
    document.getElementById('modal-backdrop').classList.add('hidden');
  },

  // --------------------------------------------------------------------------
  // 1. MODAL PERISTIWA PILIHAN
  // --------------------------------------------------------------------------
  showEvent(event) {
    const s = GameState.current;
    const c = Utils.getCountry(s.countryId);

    const choicesHtml = (event.choices || []).map((ch, idx) => `
      <button class="choice-btn" data-choice-idx="${idx}" style="white-space:normal;word-break:break-word;text-align:left;">
        <span class="choice-title" style="display:block;width:100%;max-width:100%;white-space:normal;word-break:break-word;">${Utils.escapeHtml(ch.label)}</span>
      </button>
    `).join('');

    this.open({
      icon: event.icon || '✨',
      title: event.title,
      subtitle: `Umur ${s.age} • ${s.city}, ${c.name} ${c.flag}`,
      locked: true,
      bodyHtml: `
        <div class="event-text">${Utils.escapeHtml(event.text)}</div>
        <div class="action-list event-choices-scroll" style="max-height:52vh;overflow-y:auto;padding-right:4px;">${choicesHtml}</div>
      `
    });

    document.querySelectorAll('#modal-body .choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.choiceIdx);
        const choice = event.choices[idx];
        const res = Sim.resolveEventChoice(event, choice) || {};
        if (res.openDivorceModal) {
          this.showDivorceModal(res.openDivorceModal.partnerId, res.openDivorceModal);
          return;
        }
        if (res.nextEvent) {
          this.showEvent(res.nextEvent);
          return;
        }
        this.close(true);
        App.renderAll();
        const msg = res.outcome || choice.outcome || '';
        if (msg) {
          App.toast(msg.slice(0, 88) + (msg.length > 88 ? '...' : ''), res.toastType || 'culture');
        }
      });
    });
  },

  // --------------------------------------------------------------------------
  // 2. MODAL SEKOLAH & KERJAYA (Mengikut Negara Semasa!)
  // --------------------------------------------------------------------------
  showOccupation(subTab = null) {
    if (window.CareerModals && CareerModals.showHub) {
      CareerModals.showHub(subTab);
      return;
    }
    const s = GameState.current;
    const c = Utils.getCountry(s.countryId);
    const ed = s.education;
    const isLocal = s.citizenships.includes(s.countryId) || s.residencyStatus === 'PR';
    const tuition = Math.round(c.education.uniTuitionAnnual * (isLocal ? 1 : 1.75));

    let html = '';

    html += `<div class="section-heading">🎓 Pendidikan (Sistem ${c.name})</div>`;
    if (ed.stage === 'infant') {
      html += `<div class="info-banner">Anda masih kecil! ${c.education.preschool.name} bermula pada umur ${c.education.preschool.startAge} tahun.</div>`;
    } else if (['preschool', 'primary', 'secondary'].includes(ed.stage)) {
      html += `
        <div class="info-banner">
          <strong>${Utils.escapeHtml(ed.schoolName)}</strong><br/>
          Sedang belajar dalam sistem sekolah ${c.name}. Peperiksaan utama seterusnya: <strong>${c.education.secondary.examName}</strong> pada umur ${c.education.secondary.examAge} tahun.
        </div>
        <div class="action-list">
          <button class="action-item" id="act-study-hard" ${s.yearlyActions.studyHard ? 'disabled' : ''}>
            <span class="ai-icon">📖</span>
            <span class="ai-content">
              <span class="ai-title">Belajar Bersungguh-sungguh</span>
              <span class="ai-desc">Pergi tuisyen &amp; ulang kaji nota untuk tingkatkan Kepintaran</span>
            </span>
            <span class="ai-right">Pintar +</span>
          </button>
        </div>
      `;
    } else if (ed.stage === 'university') {
      html += `
        <div class="info-banner highlight">
          <strong>${Utils.escapeHtml(ed.universityName)}</strong> (baki ${ed.uniYearsLeft} tahun)<br/>
          Yuran tahunan: <strong>${Utils.formatMoney(tuition, s.countryId)}</strong> (${isLocal ? 'Kadar tempatan' : 'Kadar antarabangsa'})
        </div>
        <div class="action-list">
          <button class="action-item" id="act-study-hard" ${s.yearlyActions.studyHard ? 'disabled' : ''}>
            <span class="ai-icon">📚</span>
            <span class="ai-content">
              <span class="ai-title">Ulang Kaji Lewat Malam</span>
              <span class="ai-desc">Tingkatkan Kepintaran untuk kerjaya bergaji tinggi</span>
            </span>
            <span class="ai-right">Pintar ++</span>
          </button>
        </div>
      `;
    } else if (ed.hasDegree) {
      html += `<div class="info-banner">🎓 <strong>Graduan Universiti</strong> (${Utils.escapeHtml(ed.universityName || c.name)}). Layak memohon kerjaya profesional di seluruh dunia!</div>`;
    } else if (s.age >= 17) {
      html += `
        <div class="info-banner">
          Tamat sekolah menengah (${Utils.escapeHtml(ed.examGrade || 'Lulus')}). Mahu sambung pengajian di universiti ${c.name}? Yuran: <strong>${Utils.formatMoney(tuition, s.countryId)}/thn</strong> (${c.education.uniDuration} tahun).
        </div>
        <div class="action-list">
          ${c.education.universities.map(u => `
            <button class="action-item uni-apply-btn" data-uni="${Utils.escapeHtml(u)}">
              <span class="ai-icon">🏛️</span>
              <span class="ai-content">
                <span class="ai-title">${Utils.escapeHtml(u)}</span>
                <span class="ai-desc">Program Ijazah ${c.education.uniDuration} Tahun di ${c.name}</span>
              </span>
              <span class="ai-right cost">${Utils.formatMoney(tuition, s.countryId)}/thn</span>
            </button>
          `).join('')}
        </div>
      `;
    }

    html += `<div class="section-heading">💼 Kerjaya di ${c.name} ${c.flag}</div>`;
    if (s.job) {
      html += `
        <div class="info-banner highlight">
          <strong>${s.job.icon} ${Utils.escapeHtml(s.job.title)}</strong><br/>
          Gaji: <strong>${Utils.formatMoney(s.job.salary, s.countryId)}/thn</strong> • Cukai: ${Math.round(c.taxRate * 100)}% • ${c.retirementScheme} Aktif<br/>
          Prestasi: <strong>${s.job.performance}%</strong> • Tempoh: ${s.job.years} tahun
        </div>
        <div class="action-list">
          <button class="action-item" id="act-work-hard" ${s.yearlyActions.workHard ? 'disabled' : ''}>
            <span class="ai-icon">⚡</span>
            <span class="ai-content">
              <span class="ai-title">Kerja Lebih Rajin</span>
              <span class="ai-desc">Tingkatkan prestasi kerja &amp; peluang kenaikan gaji</span>
            </span>
            <span class="ai-right">Prestasi ++</span>
          </button>
          <button class="action-item" id="act-raise" ${s.yearlyActions.askedRaise ? 'disabled' : ''}>
            <span class="ai-icon">💰</span>
            <span class="ai-content">
              <span class="ai-title">Minta Kenaikan Gaji</span>
              <span class="ai-desc">Berunding dengan majikan untuk naik gaji</span>
            </span>
            <span class="ai-right">+6–14%</span>
          </button>
          <button class="action-item" id="act-quit-job">
            <span class="ai-icon">🚪</span>
            <span class="ai-content">
              <span class="ai-title">Berhenti Kerja</span>
              <span class="ai-desc">Letak jawatan untuk cari peluang lain</span>
            </span>
            <span class="ai-right cost">Berhenti</span>
          </button>
        </div>
      `;
    } else if (s.age < 18) {
      html += `<div class="info-banner">Pekerjaan sepenuh masa di ${c.name} dibuka pada umur 18 tahun. Fokus pada pelajaran dahulu!</div>`;
    } else {
      html += `<div class="info-banner">Senarai jawatan kosong di <strong>${s.city}, ${c.name}</strong>:</div>`;
      html += `<div class="action-list">`;
      c.jobs.forEach(j => {
        const lockedDegree = j.reqDegree && !s.education.hasDegree;
        const lockedSmarts = j.reqSmarts && s.stats.smarts < j.reqSmarts;
        const reqNote = [
          j.reqDegree ? (s.education.hasDegree ? '✓ Ijazah' : '🔒 Perlu Ijazah') : null,
          j.reqSmarts ? `Pintar ${j.reqSmarts}%+` : null
        ].filter(Boolean).join(' • ');

        html += `
          <button class="action-item job-apply-btn" data-job-id="${j.id}" ${(lockedDegree || lockedSmarts) ? 'disabled' : ''}>
            <span class="ai-icon">${j.icon}</span>
            <span class="ai-content">
              <span class="ai-title">${Utils.escapeHtml(j.title)}</span>
              <span class="ai-desc">${Utils.escapeHtml(j.desc)} ${reqNote ? `(${reqNote})` : ''}</span>
            </span>
            <span class="ai-right">${Utils.formatMoney(j.salary, s.countryId)}/thn</span>
          </button>
        `;
      });
      html += `</div>`;
    }

    this.open({
      icon: '💼',
      title: 'Sekolah & Kerjaya',
      subtitle: `Pasaran Kerja & Pendidikan ${c.name} ${c.flag}`,
      bodyHtml: html
    });

    const studyBtn = document.getElementById('act-study-hard');
    if (studyBtn) {
      studyBtn.addEventListener('click', () => {
        s.yearlyActions.studyHard = true;
        GameState.adjustStats({ smarts: Utils.randInt(5, 9), happiness: -2 });
        GameState.addJournalEntry(`📖 Anda belajar bersungguh-sungguh tahun ini dan Kepintaran meningkat!`);
        GameState.save();
        App.renderAll();
        App.toast('Kepintaran meningkat!', 'success');
        this.showOccupation();
      });
    }

    document.querySelectorAll('.uni-apply-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = Sim.enrollUniversity(btn.dataset.uni);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showOccupation();
      });
    });

    document.querySelectorAll('.job-apply-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const jobDef = c.jobs.find(j => j.id === btn.dataset.jobId);
        const res = Sim.applyJob(jobDef);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showOccupation();
      });
    });

    const workBtn = document.getElementById('act-work-hard');
    if (workBtn) {
      workBtn.addEventListener('click', () => {
        const res = Sim.workHarder();
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showOccupation();
      });
    }

    const raiseBtn = document.getElementById('act-raise');
    if (raiseBtn) {
      raiseBtn.addEventListener('click', () => {
        const res = Sim.askForRaise();
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showOccupation();
      });
    }

    const quitBtn = document.getElementById('act-quit-job');
    if (quitBtn) {
      quitBtn.addEventListener('click', () => {
        GameState.addJournalEntry(`🚪 Anda meletak jawatan sebagai ${s.job.title}.`);
        s.job = null;
        GameState.save();
        App.renderAll();
        App.toast('Berhenti kerja.', 'culture');
        this.showOccupation();
      });
    }
  },

  // --------------------------------------------------------------------------
  // 3. MODAL ASET, PELABURAN & KEWANGAN
  // --------------------------------------------------------------------------
  showAssets(subTab = null) {
    if (window.AssetModals && AssetModals.showHub) {
      AssetModals.showHub(subTab);
      return;
    }
    const s = GameState.current;
    const c = Utils.getCountry(s.countryId);
    const netWorth = GameState.getNetWorth();

    let html = `
      <div class="summary-grid">
        <div class="summary-stat">
          <span class="lbl">Tunai Bank (${c.currency.code})</span>
          <span class="val">${Utils.formatMoney(s.money, s.countryId)}</span>
        </div>
        <div class="summary-stat">
          <span class="lbl">Nilai Bersih</span>
          <span class="val">${Utils.formatMoney(netWorth, s.countryId)}</span>
        </div>
        <div class="summary-stat">
          <span class="lbl">${c.retirementScheme}</span>
          <span class="val">${Utils.formatMoney(s.retirementFund, s.countryId)}</span>
        </div>
        <div class="summary-stat">
          <span class="lbl">Kadar Cukai Pendapatan</span>
          <span class="val">${Math.round(c.taxRate * 100)}%</span>
        </div>
      </div>
    `;

    const inv = window.COUNTRY_INVESTMENTS[s.countryId];
    if (inv) {
      html += `
        <div class="section-heading">📈 Pelaburan Tempatan (${c.name} ${c.flag})</div>
        <div class="migration-card">
          <div class="mig-head">
            <div class="mig-title">${inv.icon} ${Utils.escapeHtml(inv.name)}</div>
            <span style="font-size:13px;font-weight:800;color:#16a34a;">${Utils.formatMoney(s.investments || 0, s.countryId)}</span>
          </div>
          <div style="font-size:12px;color:#475569;">${Utils.escapeHtml(inv.desc)} (Purata ${inv.minYield}–${inv.maxYield}%/thn)</div>
          <div class="mig-actions">
            <button class="btn-sm primary" id="btn-invest-half" ${s.money <= 0 ? 'disabled' : ''}>📈 Labur 50% Tunai</button>
            <button class="btn-sm secondary" id="btn-withdraw-inv" ${(s.investments || 0) <= 0 ? 'disabled' : ''}>💵 Keluarkan Semua</button>
          </div>
        </div>
      `;
    }

    const ownedAll = [
      ...s.assets.properties.map(p => ({ ...p, cat: 'properties' })),
      ...s.assets.vehicles.map(v => ({ ...v, cat: 'vehicles' }))
    ];
    if (ownedAll.length > 0) {
      html += `<div class="section-heading">🔑 Aset Milik Anda</div><div class="action-list">`;
      ownedAll.forEach(a => {
        html += `
          <div class="action-item" style="cursor:default;">
            <span class="ai-icon">${a.icon}</span>
            <span class="ai-content">
              <span class="ai-title">${Utils.escapeHtml(a.name)}</span>
              <span class="ai-desc">Nilai: ${Utils.formatMoney(a.value, s.countryId)} • Kos jaga: ${Utils.formatMoney(a.upkeep, s.countryId)}/thn</span>
            </span>
            <button class="btn-sm secondary sell-asset-btn" data-cat="${a.cat}" data-uid="${a.uid}">Jual</button>
          </div>
        `;
      });
      html += `</div>`;
    }

    html += `<div class="section-heading">🚗 Kenderaan di ${c.name} ${c.flag}</div><div class="action-list">`;
    c.assets.vehicles.forEach(v => {
      html += `
        <button class="action-item buy-asset-btn" data-cat="vehicles" data-id="${v.id}" ${s.money < v.price ? 'disabled' : ''}>
          <span class="ai-icon">${v.icon}</span>
          <span class="ai-content">
            <span class="ai-title">${Utils.escapeHtml(v.name)}</span>
            <span class="ai-desc">Kos jaga: ${Utils.formatMoney(v.upkeep, s.countryId)}/thn • Gembira +${v.happiness}</span>
          </span>
          <span class="ai-right cost">${Utils.formatMoney(v.price, s.countryId)}</span>
        </button>
      `;
    });
    html += `</div>`;

    html += `<div class="section-heading">🏡 Hartanah di ${c.name} ${c.flag}</div><div class="action-list">`;
    c.assets.properties.forEach(p => {
      html += `
        <button class="action-item buy-asset-btn" data-cat="properties" data-id="${p.id}" ${s.money < p.price ? 'disabled' : ''}>
          <span class="ai-icon">${p.icon}</span>
          <span class="ai-content">
            <span class="ai-title">${Utils.escapeHtml(p.name)}</span>
            <span class="ai-desc">Nilai naik setiap tahun • Kos jaga: ${Utils.formatMoney(p.upkeep, s.countryId)}/thn</span>
          </span>
          <span class="ai-right cost">${Utils.formatMoney(p.price, s.countryId)}</span>
        </button>
      `;
    });
    html += `</div>`;

    this.open({
      icon: '🏠',
      title: 'Aset & Kekayaan',
      subtitle: `Pasaran ${c.name} ${c.flag} (${c.currency.code})`,
      bodyHtml: html
    });

    document.querySelectorAll('.buy-asset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.cat;
        const item = c.assets[cat].find(x => x.id === btn.dataset.id);
        const res = Sim.buyAsset(cat, item);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showAssets();
      });
    });

    document.querySelectorAll('.sell-asset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = Sim.sellAsset(btn.dataset.cat, btn.dataset.uid);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showAssets();
      });
    });

    const invBtn = document.getElementById('btn-invest-half');
    if (invBtn) {
      invBtn.addEventListener('click', () => {
        const res = Sim.investMoney(0.5);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showAssets();
      });
    }
    const wdrBtn = document.getElementById('btn-withdraw-inv');
    if (wdrBtn) {
      wdrBtn.addEventListener('click', () => {
        const res = Sim.withdrawInvestment();
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showAssets();
      });
    }
  },

  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // 4. MODAL HUBUNGAN (Keluarga, Rakan, Pasangan & Perkahwinan)
  // --------------------------------------------------------------------------
  showRelationships() {
    const s = GameState.current;
    GameState.ensureUpgradedState();
    const c = Utils.getCountry(s.countryId);
    const muslim = Relationships.isMuslim(s);
    const living = s.relationships.filter(r => r.alive);

    const partnerList = living.filter(r => r.id === s.partnerId);
    const friendsList = living.filter(r => r.category === 'friend' && r.id !== s.partnerId);
    const familyList = living.filter(r => r.id !== s.partnerId && r.category !== 'friend' && r.category !== 'ex');

    let html = '<div class="action-list">';
    if (s.pregnancy && s.pregnancy.active) {
      html += `
        <div class="info-banner highlight" style="background:#fdf2f8;border-color:#fbcfe8;">
          🤰 <strong>Kehamilan Sedang Berlangsung!</strong> Bayi dijangka lahir apabila anda menekan <strong>+UMUR</strong> (usia ibu: ${s.pregnancy.motherAge} thn). Jaga kesihatan &amp; kurangkan stres!
        </div>
      `;
    }
    if (s.maritalStatus && !s.married) {
      html += `
        <div class="info-banner" style="background:#f8fafc;border-color:#cbd5e1;">
          🕊️ Status Perkahwinan Semasa: <strong>${Utils.escapeHtml(s.maritalStatus)}</strong>
        </div>
      `;
    }
    if (window.LegalInheritanceEngine && LegalInheritanceEngine.canRujuk(s)) {
      const idah = s.idahState;
      html += `
        <button class="action-item" id="btn-rujuk-spouse" style="background:#f0fdf4;border-color:#86efac;">
          <span class="ai-icon">💍</span>
          <span class="ai-content">
            <span class="ai-title">Rujuk Semula bersama ${Utils.escapeHtml(idah.exSpouseName)}</span>
            <span class="ai-desc">Tempoh Idah aktif (${idah.yearsLeft} tahun berbaki • Talak ${idah.talakCount}) — peluang sekali untuk kembali sah sebagai suami isteri</span>
          </span>
          <span class="ai-right" style="color:#15803d;">Rujuk</span>
        </button>
      `;
    }
    if (s.age >= 7) {
      const friendSrc = s.age < 18 || s.education.stage === 'university' ? 'Sekolah / Kampus' : (s.job ? 'Tempat Kerja / Komuniti' : 'Komuniti');
      html += `
        <button class="action-item" id="btn-meet-friend" ${s.yearlyActions.meetFriend ? 'disabled' : ''}>
          <span class="ai-icon">🤝</span>
          <span class="ai-content">
            <span class="ai-title">Kenali Rakan Baru (${friendSrc})</span>
            <span class="ai-desc">Bina lingkaran sosial untuk sokongan emosi, rujukan kerja &amp; peluang</span>
          </span>
          <span class="ai-right">Rakan +</span>
        </button>
      `;
    }

    const minLoveAge = muslim ? 18 : 16;
    if (!s.partnerId && s.age >= minLoveAge) {
      html += `
        <button class="action-item" id="btn-find-love">
          <span class="ai-icon">${muslim ? '🤲' : '💘'}</span>
          <span class="ai-content">
            <span class="ai-title">${muslim ? `Sesi Ta'aruf & Cadangan Keluarga (${c.flag})` : `Cari Pasangan di ${s.city}, ${c.name} ${c.flag}`}</span>
            <span class="ai-desc">${muslim ? 'Kenali calon pasangan secara terhormat menuju bertunang & akad nikah' : 'Kenali pasangan tempatan melalui aktiviti sosial & janji temu'}</span>
          </span>
          <span class="ai-right">${muslim ? 'Ta\'aruf' : 'Bercinta!'}</span>
        </button>
      `;
    }
    if (s.age >= 21) {
      const adoptCost = Utils.usdToLocal(900, s.countryId);
      html += `
        <button class="action-item" id="btn-adopt-child" ${s.yearlyActions.adoptedChild ? 'disabled' : ''}>
          <span class="ai-icon">🏡</span>
          <span class="ai-content">
            <span class="ai-title">Ambil Anak Angkat</span>
            <span class="ai-desc">${muslim ? 'Beri kasih sayang kepada anak angkat (berbinkan/berbintikan Abdullah)' : 'Beri rumah yang penyayang kepada anak angkat baru'}</span>
          </span>
          <span class="ai-right cost">${Utils.formatMoney(adoptCost, s.countryId)}</span>
        </button>
      `;
    }
    if (s.age >= 18 && window.LegalInheritanceEngine) {
      html += `
        <button class="action-item" id="btn-open-wasiat-rel">
          <span class="ai-icon">📜</span>
          <span class="ai-content">
            <span class="ai-title">Urus Wasiat &amp; Harta Pusaka</span>
            <span class="ai-desc">${muslim ? 'Tetapkan Wasiat Islam (maks. 1/3 harta bersih) & semak Faraid' : `Tetapkan Wasiat Sivil ${c.name} (Sama Rata / 1 Waris / Amal)`}</span>
          </span>
          <span class="ai-right">Wasiat</span>
        </button>
      `;
    }
    html += '</div>';

    const renderList = (items) => items.map(r => {
      const rc = Utils.getCountry(r.countryId);
      const isPartner = r.id === s.partnerId;
      const isChildItem = ['Anak Lelaki', 'Anak Perempuan', 'Son', 'Daughter'].includes(r.role);
      if (isChildItem && window.Relationships && Relationships.ensureChildEducationFields) {
        Relationships.ensureChildEducationFields(s, r);
      }
      const bObj = GameState.getBeliefObj(r.belief);
      const distLabel = r.countryId !== s.countryId ? ` • ${rc.flag} Luar Negara` : '';
      const adoptTag = r.isAdopted ? ' • Anak Angkat' : '';
      const childSchoolTag = (isChildItem && r.schoolLabel)
        ? ` • 🏫 ${Utils.escapeHtml(r.schoolLabel)}${r.yearlySchoolFee > 0 ? ` (${Utils.formatMoney(r.yearlySchoolFee, s.countryId)}/thn)` : ''}`
        : '';
      const icon = isPartner ? (s.married ? '💍' : '💑')
        : r.category === 'friend' ? '🧑‍🤝‍🧑'
        : isChildItem ? '👶'
        : '👤';
      return `
        <button class="action-item rel-open-btn" data-rel-id="${r.id}">
          <span class="ai-icon">${icon}</span>
          <span class="ai-content">
            <span class="ai-title">${Utils.escapeHtml(r.name)} <small style="font-weight:600;color:#64748b;">(${r.role}, ${r.age})</small></span>
            <span class="ai-desc">${bObj.icon} ${bObj.name} • Kepercayaan ${r.trust ?? 65}%${childSchoolTag}${adoptTag}${distLabel}</span>
            <div class="rel-meter">
              <div class="rel-meter-fill" style="width:${r.closeness}%;background:${Utils.getStatColor(r.closeness)}"></div>
            </div>
          </span>
          <span class="ai-right neutral">${r.closeness}%</span>
        </button>
      `;
    }).join('');

    if (partnerList.length > 0) {
      html += `<div class="section-heading">${s.married ? '💍 Pasangan Hidup (Suami / Isteri)' : (muslim ? '🤲 Calon Ta\'aruf / Tunang' : '💘 Pasangan')}</div><div class="action-list">${renderList(partnerList)}</div>`;
    }

    html += `<div class="section-heading">🤝 Rakan-Rakan (${friendsList.length})</div>`;
    if (friendsList.length > 0) {
      html += `<div class="action-list">${renderList(friendsList)}</div>`;
    } else {
      html += `<div class="info-banner">Belum ada rakan rapat. Tekan "Kenali Rakan Baru" untuk mula membina lingkaran sosial anda!</div>`;
    }

    html += `<div class="section-heading">❤️ Keluarga (${familyList.length})</div><div class="action-list">${renderList(familyList)}</div>`;

    this.open({
      icon: '❤️',
      title: 'Hubungan & Sosial',
      subtitle: muslim ? 'Keluarga, Rakan & Laluan Pernikahan Sah' : 'Keluarga, Rakan, Cinta & Perkahwinan',
      bodyHtml: html
    });

    const rujukBtn = document.getElementById('btn-rujuk-spouse');
    if (rujukBtn) {
      rujukBtn.addEventListener('click', () => {
        const res = Relationships.rujukSpouse();
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showRelationships();
      });
    }

    const wasiatRelBtn = document.getElementById('btn-open-wasiat-rel');
    if (wasiatRelBtn) {
      wasiatRelBtn.addEventListener('click', () => this.showWasiatModal(() => this.showRelationships()));
    }

    const friendBtn = document.getElementById('btn-meet-friend');
    if (friendBtn) {
      friendBtn.addEventListener('click', () => {
        const res = Sim.meetFriend('auto');
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showRelationships();
      });
    }

    const loveBtn = document.getElementById('btn-find-love');
    if (loveBtn) {
      loveBtn.addEventListener('click', () => {
        if (window.ModeModals && ModeModals.showSocialHub) {
          ModeModals.showSocialHub('dating');
          return;
        }
        const res = Sim.meetLocalDate();
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        if (res.followUpEvent) {
          this.showEvent(res.followUpEvent);
        } else {
          this.showRelationships();
        }
      });
    }

    const adoptBtn = document.getElementById('btn-adopt-child');
    if (adoptBtn) {
      adoptBtn.addEventListener('click', () => {
        const res = Sim.adoptChild();
        if (res.openBabyNamingModal) {
          this.showBabyNamingModal(res.openBabyNamingModal, () => this.showRelationships());
          return;
        }
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showRelationships();
      });
    }

    document.querySelectorAll('.rel-open-btn').forEach(btn => {
      btn.addEventListener('click', () => this.showRelationDetail(btn.dataset.relId));
    });
  },

  showRelationDetail(relId) {
    const s = GameState.current;
    GameState.ensureUpgradedState();
    const rel = s.relationships.find(r => r.id === relId);
    if (!rel) return;

    const isPartner = rel.id === s.partnerId;
    const isFriend = rel.category === 'friend';
    const isChild = ['Anak Lelaki', 'Anak Perempuan', 'Son', 'Daughter'].includes(rel.role);
    if (isChild && window.Relationships && Relationships.ensureChildEducationFields) {
      Relationships.ensureChildEducationFields(s, rel);
    }
    const isMinorChild = isChild && rel.age < 18;
    const muslim = Relationships.isMuslim(s);
    const interfaithBlocked = isPartner && muslim && (rel.belief !== 'islam' || rel.gender === s.gender);
    const longDist = rel.countryId !== s.countryId;
    const rc = Utils.getCountry(rel.countryId);
    const bObj = GameState.getBeliefObj(rel.belief);

    const stageLabel = isPartner
      ? (s.married ? 'Berkahwin' : rel.stage === 'engaged' ? 'Bertunang' : rel.stage === 'cohabiting' ? 'Tinggal Bersama' : rel.stage === 'taaruf' ? 'Ta\'aruf' : 'Bercinta')
      : (rel.origin || rel.role);

    const trustVal = rel.trust ?? 65;
    const hasPrenupBadge = (isPartner && s.married && s.marriageMeta && s.marriageMeta.hasPrenup)
      ? ' • 🛡️ Dilindungi Prenup'
      : '';

    const parentCountUsed = s.yearlyActions[`parent_cnt_${rel.id}`] || 0;
    const eduMeta = (isMinorChild && window.Relationships && Relationships.getChildEduActionMeta)
      ? Relationships.getChildEduActionMeta(rel.age)
      : { icon: '📚', title: 'Kelas Tuisyen Tambahan (Pilihan)', desc: 'Tuisyen sampingan luar waktu sekolah', costUsd: 110 };
    const eduCost = Utils.usdToLocal(eduMeta.costUsd || 110, s.countryId);
    const healthCost = Utils.usdToLocal(120, s.countryId);

    const childSchoolFeeText = (rel.yearlySchoolFee || 0) > 0
      ? `${Utils.formatMoney(rel.yearlySchoolFee, s.countryId)}/thn`
      : 'Percuma';

    const childUpbringingHtml = isMinorChild ? `
      <div class="info-banner ${rel.isDelinquent ? '' : 'highlight'}" style="${rel.isDelinquent ? 'background:#fef2f2;border-color:#fecaca;' : ''}line-height:1.6;">
        <strong>👶 Perkembangan &amp; Persekolahan Anak (Umur ${rel.age}/17)</strong>
        ${rel.isDelinquent ? ' <span class="cat-badge" style="background:#dc2626;color:#fff;">⚠️ DELINKUEN</span>' : ''}<br/>
        🏫 Sekolah Semasa: <strong>${Utils.escapeHtml(rel.schoolLabel || 'Belum Bersekolah')}</strong> (Yuran: <strong>${childSchoolFeeText}</strong>)<br/>
        🧠 Kepintaran: <strong>${(rel.stats && rel.stats.smarts) ?? 65}%</strong> • 📚 Penjagaan Pendidikan: <strong>${rel.educationCare ?? 65}%</strong><br/>
        🩺 Penjagaan Kesihatan: <strong>${rel.healthCare ?? 75}%</strong> (Kesihatan: ${(rel.stats && rel.stats.health) ?? 80}%)<br/>
        🌟 Akhlak &amp; Moral: <strong>${rel.morals ?? 70}%</strong> • 🔥 Pemberontakan: <strong style="color:${(rel.rebelliousness ?? 10) > 65 ? '#dc2626' : 'inherit'};">${rel.rebelliousness ?? 10}%</strong><br/>
        <small style="opacity:0.8;">Tindakan keibubapaan tahun ini: <strong>${parentCountUsed}/3</strong></small>
      </div>
      <div class="section-heading">👨‍👩‍👧 Persekolahan &amp; Tindakan Keibubapaan (${parentCountUsed}/3 Tahun Ini)</div>
      <div class="action-list" style="margin-bottom:10px;">
        ${rel.age >= 4 && rel.age <= 17 ? `
          <button class="action-item" id="btn-change-child-school" style="background:#eff6ff;border-color:#93c5fd;">
            <span class="ai-icon">🏫</span>
            <span class="ai-content">
              <span class="ai-title">${rel.age <= 6 ? 'Daftar / Tukar Tadika & Prasekolah' : 'Tukar Pilihan Sekolah Anak'}</span>
              <span class="ai-desc">Semasa: ${Utils.escapeHtml(rel.schoolLabel || 'Belum Daftar')} (${childSchoolFeeText})</span>
            </span>
            <span class="ai-right" style="color:#1d4ed8;">Pilih →</span>
          </button>
        ` : ''}
        <button class="action-item parent-act-btn" data-pact="education" ${parentCountUsed >= 3 || s.yearlyActions[`parent_${rel.id}_education`] ? 'disabled' : ''}>
          <span class="ai-icon">${eduMeta.icon}</span>
          <span class="ai-content">
            <span class="ai-title">${Utils.escapeHtml(eduMeta.title)}</span>
            <span class="ai-desc">${Utils.escapeHtml(eduMeta.desc)}</span>
          </span>
          <span class="ai-right cost">${Utils.formatMoney(eduCost, s.countryId)}</span>
        </button>
        <button class="action-item parent-act-btn" data-pact="health" ${parentCountUsed >= 3 || s.yearlyActions[`parent_${rel.id}_health`] ? 'disabled' : ''}>
          <span class="ai-icon">🩺</span>
          <span class="ai-content">
            <span class="ai-title">Jaga Kesihatan / Rawatan</span>
            <span class="ai-desc">Tingkatkan Kesihatan anak &amp; kurangkan risiko sakit tenat</span>
          </span>
          <span class="ai-right cost">${Utils.formatMoney(healthCost, s.countryId)}</span>
        </button>
        <button class="action-item parent-act-btn" data-pact="morals" ${parentCountUsed >= 3 || s.yearlyActions[`parent_${rel.id}_morals`] ? 'disabled' : ''}>
          <span class="ai-icon">🌟</span>
          <span class="ai-content">
            <span class="ai-title">Didikan Akhlak &amp; Moral</span>
            <span class="ai-desc">Bentuk akhlak mulia &amp; turunkan tahap pemberontakan</span>
          </span>
          <span class="ai-right">Percuma</span>
        </button>
        <button class="action-item parent-act-btn" data-pact="quality_time" ${parentCountUsed >= 3 || s.yearlyActions[`parent_${rel.id}_quality_time`] ? 'disabled' : ''}>
          <span class="ai-icon">🎡</span>
          <span class="ai-content">
            <span class="ai-title">Luangkan Masa Bersama Anak</span>
            <span class="ai-desc">Eratkan kasih sayang &amp; tingkatkan kegembiraan keluarga</span>
          </span>
          <span class="ai-right">Percuma</span>
        </button>
      </div>
    ` : (isChild && rel.age >= 18 ? `
      <div class="info-banner highlight" style="line-height:1.6;">
        <strong>🎓 Status Pengajian &amp; Kerjaya Anak (${rel.age} Tahun)</strong><br/>
        Status: <strong>${Utils.escapeHtml(rel.schoolLabel || rel.job || 'Dewasa')}</strong><br/>
        ${rel.university ? `Institusi: <strong>${Utils.escapeHtml(rel.university)}</strong> • Bidang: <strong>${Utils.escapeHtml(rel.major || '-')}</strong><br/>` : ''}
        ${typeof rel.currentCgpa === 'number' ? `PNGK Semasa: <strong>${rel.currentCgpa.toFixed(2)}</strong>${rel.uniEnrolled ? ` • Baki Pengajian: <strong>${rel.uniYearsLeft} tahun</strong>` : ''}<br/>` : ''}
        🧠 Kepintaran: <strong>${(rel.stats && rel.stats.smarts) ?? 70}%</strong> • ❤️ Kesihatan: <strong>${(rel.stats && rel.stats.health) ?? 80}%</strong>
      </div>
    ` : '');

    const html = `
      <div class="info-banner">
        <strong>${Utils.escapeHtml(rel.name)}</strong> (${rel.role}, Umur ${rel.age})<br/>
        Agama / Pegangan: <strong>${bObj.icon} ${bObj.name}</strong> • Status: <strong>${stageLabel}${hasPrenupBadge}</strong><br/>
        Kemesraan: <strong>${rel.closeness}%</strong> • Kepercayaan: <strong>${trustVal}%</strong> • Keserasian: <strong>${rel.compatibility ?? 75}%</strong><br/>
        ${isPartner ? `
          <div style="margin-top:6px;">
            <small style="opacity:0.8;">🤝 Tahap Kepercayaan (${trustVal}%)${trustVal < 30 ? ' — ⚠️ Risiko Cerai!' : ''}</small>
            <div class="rel-meter" style="margin-top:3px;">
              <div class="rel-meter-fill" style="width:${trustVal}%;background:${Utils.getStatColor(trustVal)}"></div>
            </div>
          </div>
        ` : ''}
        Lokasi: ${rc.flag} ${rc.name}${rel.job ? ` • ${Utils.escapeHtml(rel.job)}` : ''}
      </div>
      ${isPartner && s.pregnancy && s.pregnancy.active ? `
        <div class="info-banner" style="background:#fdf2f8;border-color:#fbcfe8;">
          🤰 <strong>Sedang Hamil:</strong> Cahaya mata dijangka lahir tahun hadapan!
        </div>
      ` : ''}
      ${isPartner && s.infertilityDiagnosed ? `
        <div class="info-banner" style="background:#fff7ed;border-color:#fdba74;">
          🩺 <strong>Nota Kesuburan:</strong> Diagnosis ketidaksuburan telah direkodkan. Anda boleh memilih <strong>Ambil Anak Angkat</strong> di tab Hubungan sebagai alternatif.
        </div>
      ` : ''}
      ${childUpbringingHtml}
      ${interfaithBlocked ? `
        <div class="info-banner" style="background:#fef2f2;border-color:#fecaca;">
          ☪️ <strong>Batas Agama:</strong> Sebagai watak beragama Islam, pernikahan hanya sah bersama pasangan seakidah. Bincangkan haluan hubungan secara jujur.
        </div>
      ` : ''}
      <div class="action-list">
        <button class="action-item rel-act-btn" data-act="spend_time">
          <span class="ai-icon">${longDist ? '📱' : '☕'}</span>
          <span class="ai-content">
            <span class="ai-title">${longDist ? 'Panggilan Video & Tanya Khabar' : (muslim && isPartner && !s.married ? 'Sesi Perkenalan Terhormat' : 'Luangkan Masa Bersama')}</span>
            <span class="ai-desc">Eratkan kemesraan &amp; bina kepercayaan bersama</span>
          </span>
          <span class="ai-right">Percuma</span>
        </button>
        <button class="action-item rel-act-btn" data-act="gift">
          <span class="ai-icon">🎁</span>
          <span class="ai-content">
            <span class="ai-title">Beri Hadiah Istimewa</span>
            <span class="ai-desc">Kemesraan &amp; kepercayaan meningkat ketara</span>
          </span>
          <span class="ai-right cost">${Utils.formatMoney(Utils.usdToLocal(45, s.countryId), s.countryId)}</span>
        </button>

        ${isFriend && s.age >= 18 ? `
          <button class="action-item rel-act-btn" data-act="ask_referral">
            <span class="ai-icon">💼</span>
            <span class="ai-content">
              <span class="ai-title">Minta Rujukan Kerja / Peluang Projek</span>
              <span class="ai-desc">Perlukan Kemesraan 70%+ &amp; Kepercayaan 70%+</span>
            </span>
            <span class="ai-right">Peluang +</span>
          </button>
        ` : ''}

        ${isFriend ? `
          <button class="action-item rel-act-btn" data-act="cut_ties">
            <span class="ai-icon">🚪</span>
            <span class="ai-content">
              <span class="ai-title">Jauhkan Diri Daripada Rakan</span>
              <span class="ai-desc">Tamatkan persahabatan jika hubungan sudah toksik</span>
            </span>
            <span class="ai-right cost">Tamat</span>
          </button>
        ` : ''}

        ${interfaithBlocked ? `
          <button class="action-item rel-act-btn" data-act="interfaith_talk">
            <span class="ai-icon">☪️</span>
            <span class="ai-content">
              <span class="ai-title">Bincang Batas Agama &amp; Masa Depan</span>
              <span class="ai-desc">Tentukan sama ada pasangan terbuka memeluk Islam atau berpisah baik</span>
            </span>
            <span class="ai-right">Penting</span>
          </button>
        ` : ''}

        ${isPartner && !s.married && !muslim && rel.stage !== 'cohabiting' ? `
          <button class="action-item rel-act-btn" data-act="cohabit">
            <span class="ai-icon">🏠</span>
            <span class="ai-content">
              <span class="ai-title">Tinggal Bersama</span>
              <span class="ai-desc">Tinggal sebumbung bersama pasangan (perlu kemesraan 65%+)</span>
            </span>
            <span class="ai-right">Percuma</span>
          </button>
        ` : ''}

        ${isPartner && !s.married && rel.stage !== 'engaged' && !interfaithBlocked ? `
          <button class="action-item rel-act-btn" data-act="engage">
            <span class="ai-icon">💐</span>
            <span class="ai-content">
              <span class="ai-title">${muslim ? 'Merisik &amp; Bertunang' : 'Bertunang'}</span>
              <span class="ai-desc">Langkah rasmi menuju perkahwinan (perlu kemesraan 60%+)</span>
            </span>
            <span class="ai-right cost">${Utils.formatMoney(Utils.usdToLocal(350, s.countryId), s.countryId)}</span>
          </button>
        ` : ''}

        ${isPartner && !s.married && !interfaithBlocked ? `
          <button class="action-item rel-act-btn" data-act="propose">
            <span class="ai-icon">💍</span>
            <span class="ai-content">
              <span class="ai-title">${muslim ? 'Akad Nikah &amp; Walimatulurus' : 'Lamar &amp; Berkahwin'}</span>
              <span class="ai-desc">Sah bergelar suami isteri (perlu kemesraan 70%+)</span>
            </span>
            <span class="ai-right cost">${Utils.formatMoney(Utils.usdToLocal(1800, s.countryId), s.countryId)}</span>
          </button>
        ` : ''}

        ${isPartner && s.married ? `
          <button class="action-item rel-act-btn" data-act="family_trip">
            <span class="ai-icon">✈️</span>
            <span class="ai-content">
              <span class="ai-title">Percutian Harmoni Rumah Tangga</span>
              <span class="ai-desc">Segarkan semula kasih sayang &amp; kepercayaan suami isteri</span>
            </span>
            <span class="ai-right cost">${Utils.formatMoney(Utils.usdToLocal(450, s.countryId), s.countryId)}</span>
          </button>
        ` : ''}

        ${isPartner && s.age >= 18 && (!muslim || s.married) ? `
          <button class="action-item rel-act-btn" data-act="have_kid">
            <span class="ai-icon">👶</span>
            <span class="ai-content">
              <span class="ai-title">Timang Cahaya Mata</span>
              <span class="ai-desc">Anak akan lahir di ${Utils.getCountry(s.countryId).name} ${Utils.getCountry(s.countryId).flag}</span>
            </span>
            <span class="ai-right">Keluarga +</span>
          </button>
        ` : ''}

        ${isPartner ? `
          <button class="action-item rel-act-btn" data-act="breakup">
            <span class="ai-icon">💔</span>
            <span class="ai-content">
              <span class="ai-title">${s.married ? 'Bercerai' : 'Tamatkan Hubungan'}</span>
              <span class="ai-desc">Bawa haluan masing-masing</span>
            </span>
            <span class="ai-right cost">Tamat</span>
          </button>
        ` : ''}
        ${isChild && rel.alive ? `
          <button class="action-item" id="btn-switch-to-child" style="background:#f5f3ff;border-color:#c4b5fd;">
            <span class="ai-icon">🔄</span>
            <span class="ai-content">
              <span class="ai-title">Teruskan Sebagai Anak Ini</span>
              <span class="ai-desc">Serah legasi semasa hidup — kawalan berpindah ke Gen ${(s.generation || 1) + 1} sambil anda kekal hidup sebagai NPC</span>
            </span>
            <span class="ai-right" style="color:#6d28d9;">Tukar →</span>
          </button>
        ` : ''}
      </div>
      <button class="ghost-btn" id="rel-back-btn">← Kembali ke Hubungan</button>
    `;

    this.open({
      icon: isPartner ? (s.married ? '💍' : '💑') : isFriend ? '🧑‍🤝‍🧑' : '👤',
      title: rel.name,
      subtitle: `${rel.role} • ${bObj.icon} ${bObj.name} • ${rc.flag} ${rc.name}`,
      bodyHtml: html
    });

    const changeSchoolBtn = document.getElementById('btn-change-child-school');
    if (changeSchoolBtn) {
      changeSchoolBtn.addEventListener('click', () => {
        this.showChildSchoolSelectionModal(relId, () => this.showRelationDetail(relId), false);
      });
    }

    const switchBtn = document.getElementById('btn-switch-to-child');
    if (switchBtn) {
      switchBtn.addEventListener('click', () => this.showSwitchToChildModal(relId));
    }

    document.querySelectorAll('.rel-act-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const act = btn.dataset.act;
        if (act === 'propose' && !muslim && window.LegalInheritanceEngine) {
          this.showCivilMarriagePrenupModal(relId);
          return;
        }
        const res = Sim.interactRelation(relId, act);
        if (res.openDivorceModal) {
          this.showDivorceModal(res.openDivorceModal.partnerId, res.openDivorceModal);
          return;
        }
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        if (res.followUpEvent) {
          this.showEvent(res.followUpEvent);
        } else if (act === 'breakup' || act === 'cut_ties' || res.brokeUp || res.weddingCancelled) {
          this.showRelationships();
        } else {
          this.showRelationDetail(relId);
        }
      });
    });

    document.querySelectorAll('.parent-act-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = Sim.parentChild(relId, btn.dataset.pact);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showRelationDetail(relId);
      });
    });

    document.getElementById('rel-back-btn').addEventListener('click', () => this.showRelationships());
  },

  // --------------------------------------------------------------------------
  // 4A-SCH. MODAL PENDAFTARAN SEKOLAH ANAK (UMUR 4–6 TADIKA, 7 RENDAH, 13 MENENGAH)
  // --------------------------------------------------------------------------
  showChildSchoolSelectionModal(childId, onDone = null, isMilestonePrompt = true) {
    const s = GameState.current;
    if (!s || !s.alive) {
      if (typeof onDone === 'function') onDone();
      return;
    }
    const child = (s.relationships || []).find(r => r.id === childId && r.alive);
    if (!child || !window.Relationships) {
      if (typeof onDone === 'function') onDone();
      return;
    }
    Relationships.ensureChildEducationFields(s, child);
    const stage = Relationships.getSchoolStageForAge(child.age);
    const options = Relationships.getSchoolOptionsForStage(stage, child);
    const stageName = stage === 'tadika'
      ? 'Tadika / Prasekolah (Umur 4–6)'
      : stage === 'primary'
      ? 'Sekolah Rendah (Umur 7–12)'
      : 'Sekolah Menengah (Umur 13–17)';
    const smarts = (child.stats && child.stats.smarts) ?? 65;

    this.open({
      icon: '🏫',
      title: '🏫 Pendaftaran Sekolah Anak',
      subtitle: `${child.name} (Umur ${child.age} tahun) • ${stageName}`,
      locked: Boolean(isMilestonePrompt),
      bodyHtml: `
        <div class="info-banner highlight" style="line-height:1.6;">
          <strong>👧👦 ${Utils.escapeHtml(child.name)}</strong> kini memasuki peringkat <strong>${stageName}</strong>!<br/>
          🧠 Kepintaran Semasa: <strong>${smarts}%</strong> • 🌟 Akhlak: <strong>${child.morals ?? 70}%</strong><br/>
          <small style="opacity:0.85;">Pilih aliran sekolah untuk anak anda. Yuran sekolah akan ditolak secara automatik setiap tahun semasa +UMUR.</small>
        </div>
        <div class="action-list">
          ${options.map(opt => {
            const feeLocal = opt.feeUsd > 0 ? Utils.usdToLocal(opt.feeUsd, s.countryId) : 0;
            const feeLabel = feeLocal > 0 ? `${Utils.formatMoney(feeLocal, s.countryId)}/thn` : 'PERCUMA';
            const isCurrent = child.schoolType === opt.id;
            return `
              <button type="button" class="action-item child-school-opt-btn ${isCurrent ? 'highlight' : ''}" data-school-id="${opt.id}" ${opt.locked ? 'disabled' : ''}>
                <span class="ai-icon">${opt.icon}</span>
                <span class="ai-content">
                  <span class="ai-title">${Utils.escapeHtml(opt.label)} ${isCurrent ? '✓' : ''}</span>
                  <span class="ai-desc">${Utils.escapeHtml(opt.desc)}${opt.lockReason ? `<br/><strong style="color:#dc2626;">🔒 ${Utils.escapeHtml(opt.lockReason)}</strong>` : ''}</span>
                </span>
                <span class="ai-right ${feeLocal > 0 ? 'cost' : ''}">${feeLabel}</span>
              </button>
            `;
          }).join('')}
        </div>
        ${!isMilestonePrompt ? `<button type="button" class="ghost-btn" id="btn-school-cancel" style="margin-top:8px;">← Kembali</button>` : ''}
      `
    });

    document.querySelectorAll('.child-school-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = Relationships.enrollChildSchool(childId, btn.dataset.schoolId);
        if (!res.ok) {
          App.toast(res.msg, 'error');
          return;
        }
        this.close(true);
        App.renderAll();
        App.toast(res.msg, 'success');
        if (typeof onDone === 'function') onDone(res);
      });
    });

    const cancelBtn = document.getElementById('btn-school-cancel');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        if (typeof onDone === 'function') onDone();
        else this.close(true);
      });
    }
  },

  // --------------------------------------------------------------------------
  // 4A-UNI. MODAL PILIHAN UNIVERSITI ANAK PADA UMUR 18 TAHUN
  // --------------------------------------------------------------------------
  showChildUniversityModal(childId, onDone = null) {
    const s = GameState.current;
    if (!s || !s.alive) {
      if (typeof onDone === 'function') onDone();
      return;
    }
    const child = (s.relationships || []).find(r => r.id === childId && r.alive);
    if (!child || !window.Relationships) {
      if (typeof onDone === 'function') onDone();
      return;
    }
    const pref = child._uniPref || Relationships.generateChildUniPreference(s, child);
    child._uniPref = pref;
    const smarts = (child.stats && child.stats.smarts) ?? 65;
    const fmt = (v) => Utils.formatMoney(v, s.countryId);

    this.open({
      icon: '🎓',
      title: `🎓 Masa Depan & Universiti ${child.name}`,
      subtitle: `${child.name} (Umur 18 Tahun) • Tamat Sekolah Menengah`,
      locked: true,
      bodyHtml: `
        <div class="info-banner highlight" style="line-height:1.65;">
          <strong>🎓 Hasrat &amp; Pilihan Pengajian ${Utils.escapeHtml(child.name)}</strong><br/>
          🧠 Kepintaran: <strong>${smarts}%</strong> • 🌟 Akhlak: <strong>${child.morals ?? 70}%</strong> • 🔥 Pemberontakan: <strong>${child.rebelliousness ?? 10}%</strong><br/>
          Bidang Pilihan Anak: <strong>${Utils.escapeHtml(pref.major.label)}</strong> (${pref.major.years} tahun)<br/>
          Institusi Sasaran: <strong>${pref.tier.icon} ${Utils.escapeHtml(pref.tier.label)}</strong><br/>
          Anggaran Yuran: <strong>${fmt(pref.yearlyFeeLocal)}/thn</strong> (Jumlah: ${fmt(pref.totalFeeLocal)})
        </div>

        <div class="section-heading">Pilih Keputusan Anda Sebagai Ibu Bapa</div>
        <div class="action-list">
          <button type="button" class="action-item child-uni-choice-btn" data-decision="sponsor_full">
            <span class="ai-icon">💰</span>
            <span class="ai-content">
              <span class="ai-title">Taja Sepenuhnya</span>
              <span class="ai-desc">Bayar yuran tahunan di ${Utils.escapeHtml(pref.tier.short)} (${Utils.escapeHtml(pref.major.label)}) • +20% Hubungan &amp; +Gembira</span>
            </span>
            <span class="ai-right cost">${fmt(pref.yearlyFeeLocal)}/thn</span>
          </button>

          <button type="button" class="action-item child-uni-choice-btn" data-decision="scholarship_loan">
            <span class="ai-icon">📜</span>
            <span class="ai-content">
              <span class="ai-title">Galak Mohon Biasiswa / Pinjaman</span>
              <span class="ai-desc">${smarts >= 80 ? 'Kepintaran >= 80%: Peluang tinggi dapat Biasiswa Penuh!' : 'Jika gagal biasiswa, anak ambil pinjaman pelajaran sendiri'} • Tiada kos kepada ibu bapa</span>
            </span>
            <span class="ai-right">Percuma</span>
          </button>

          <button type="button" class="action-item child-uni-choice-btn" data-decision="suggest_cheaper">
            <span class="ai-icon">🔄</span>
            <span class="ai-content">
              <span class="ai-title">Cadang Universiti / Bidang Lebih Murah</span>
              <span class="ai-desc">Cadangkan ${Utils.escapeHtml(pref.cheaperMajor.label)} di ${Utils.escapeHtml(pref.cheaperTier.short)} • Kos rendah, risiko anak kecewa (-10 hingga -20% Hubungan)</span>
            </span>
            <span class="ai-right cost">${fmt(pref.cheaperFeeLocal)}/thn</span>
          </button>

          <button type="button" class="action-item child-uni-choice-btn" data-decision="work_immediately">
            <span class="ai-icon">💼</span>
            <span class="ai-content">
              <span class="ai-title">Suruh Terus Bekerja</span>
              <span class="ai-desc">Anak tidak ke universiti &amp; terus masuk alam pekerjaan (${pref.wantsWorkDirectly ? '-5%' : '-25%'} Hubungan)</span>
            </span>
            <span class="ai-right">Terus Kerja</span>
          </button>
        </div>
      `
    });

    document.querySelectorAll('.child-uni-choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = Relationships.resolveChildUniversityChoice(childId, btn.dataset.decision);
        this.close(true);
        App.renderAll();
        App.toast(res.msg, res.ok ? 'success' : 'error');
        if (typeof onDone === 'function') onDone(res);
      });
    });
  },

  // --------------------------------------------------------------------------
  // 4A0B. MODAL DILEMA ANAK MAHU BERHENTI BELAJAR (UMUR 15–22)
  // --------------------------------------------------------------------------
  showChildDropoutModal(childId, reason = '', onDone = null) {
    const s = GameState.current;
    if (!s || !s.alive) {
      if (typeof onDone === 'function') onDone();
      return;
    }
    const child = (s.relationships || []).find(r => r.id === childId && r.alive);
    if (!child || !window.Relationships) {
      if (typeof onDone === 'function') onDone();
      return;
    }

    const smarts = (child.stats && child.stats.smarts) ?? 65;
    const rebel = child.rebelliousness ?? 15;
    const closeness = child.closeness ?? 70;
    const wasUni = Boolean(child.uniEnrolled) || child.schoolStage === 'university';
    const stageText = wasUni
      ? `${child.university || 'Universiti'}${child.major ? ` — ${child.major}` : ''}`
      : (child.schoolLabel || 'Sekolah Menengah');
    const feeVal = Number(child.yearlySchoolFee) || 0;
    const reasonText = reason || Relationships.pickChildDropoutReason(child);

    this.open({
      icon: '⚠️',
      title: `⚠️ ${child.name} Mahu Berhenti Belajar!`,
      subtitle: `${child.name} (${child.age} Tahun) • ${stageText}`,
      locked: true,
      bodyHtml: `
        <div class="info-banner" style="background:#fffbeb;border-color:#fde68a;color:#78350f;line-height:1.6;">
          <strong>🗣️ Luahan ${Utils.escapeHtml(child.name)}:</strong><br/>
          ${Utils.escapeHtml(child.name)} datang berjumpa anda dan menyuarakan hasrat untuk berhenti belajar daripada <strong>${Utils.escapeHtml(stageText)}</strong> kerana <em>${Utils.escapeHtml(reasonText)}</em>.<br/><br/>
          🧠 Kepintaran: <strong>${smarts}%</strong> • ❤️ Hubungan: <strong>${closeness}%</strong> • 🔥 Pemberontakan: <strong>${rebel}%</strong>${typeof child.currentCgpa === 'number' ? ` • 📊 PNGK: <strong>${child.currentCgpa.toFixed(2)}</strong>` : ''}${feeVal > 0 ? `<br/>💰 Yuran Tahunan Semasa: <strong>${Utils.formatMoney(feeVal, s.countryId)}/thn</strong>` : ''}
        </div>

        <div class="section-heading">Pilih Tindakan Anda Sebagai Ibu Bapa</div>
        <div class="action-list">
          <button type="button" class="action-item child-dropout-choice-btn" data-decision="persuade">
            <span class="ai-icon">💬</span>
            <span class="ai-content">
              <span class="ai-title">Pujuk &amp; Nasihat Baik-Baik</span>
              <span class="ai-desc">Berbincang dari hati ke hati (peluang berjaya bergantung pada Hubungan &amp; Kepintaran anda; jika gagal, anak tetap berhenti)</span>
            </span>
            <span class="ai-right">Pujuk</span>
          </button>

          <button type="button" class="action-item child-dropout-choice-btn" data-decision="respect">
            <span class="ai-icon">🤝</span>
            <span class="ai-content">
              <span class="ai-title">Hormati Keputusan Anak</span>
              <span class="ai-desc">Benarkan anak berhenti secara baik (+10% Hubungan), hentikan yuran tahunan &amp; biarkan dia mula bekerja (Tak Mahir / Separa Mahir)</span>
            </span>
            <span class="ai-right">Hormati</span>
          </button>

          <button type="button" class="action-item child-dropout-choice-btn" data-decision="force">
            <span class="ai-icon">😠</span>
            <span class="ai-content">
              <span class="ai-title">Bertegas &amp; Paksa Teruskan</span>
              <span class="ai-desc">Paksa anak kekal belajar (-15% hingga -20% Hubungan &amp; +Pemberontakan; jika sangat memberontak, anak tetap berhenti &amp; -30% Hubungan!)</span>
            </span>
            <span class="ai-right cost">Bertegas</span>
          </button>
        </div>
      `
    });

    document.querySelectorAll('.child-dropout-choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = Relationships.resolveChildDropoutChoice(childId, btn.dataset.decision, reasonText);
        this.close(true);
        App.renderAll();
        App.toast(res.msg, res.stayed ? 'success' : 'culture');
        if (typeof onDone === 'function') onDone(res);
      });
    });
  },

  // --------------------------------------------------------------------------
  // 4A0. MODAL SERAH LEGASI / TUKAR KE ANAK SEMASA HIDUP
  // --------------------------------------------------------------------------
  showSwitchToChildModal(childId) {
    const s = GameState.current;
    if (!s || !s.alive) return;
    const child = (s.relationships || []).find(r => r.id === childId && r.alive);
    if (!child) return;

    const maxCash = Math.max(0, Math.floor(s.money || 0));
    const maxGift = Math.floor(maxCash * 0.5);
    const defaultGift = Math.floor(maxCash * 0.1);

    this.open({
      icon: '🔄',
      title: 'Serah Legasi / Tukar ke Anak',
      subtitle: `Berpindah ke Generasi ${(s.generation || 1) + 1} (${child.name}, Umur ${child.age})`,
      bodyHtml: `
        <div class="info-banner" style="background:#fff7ed;border-color:#fdba74;line-height:1.6;">
          <strong>⚠️ Pengesahan Serah Legasi Semasa Hidup</strong><br/>
          Kawalan permainan akan berpindah <strong>secara kekal</strong> kepada anak anda, <strong>${Utils.escapeHtml(child.name)}</strong> (Umur ${child.age} tahun).<br/>
          Watak semasa anda (<strong>${Utils.escapeHtml(s.name)}</strong>) akan terus hidup sebagai <strong>NPC ${s.gender === 'male' ? 'Bapa' : 'Ibu'}</strong> — tiada kematian, Obituari atau pembahagian Faraid/Pusaka pramatang akan berlaku sekarang.
        </div>

        ${maxGift > 0 ? `
          <div class="info-banner highlight" style="line-height:1.6;">
            <strong>🎁 Hadiah Permulaan / Elaun (Pilihan)</strong><br/>
            <small style="opacity:0.85;">Berikan sebahagian wang tunai anda (maks. 50% baki tunai) sebagai modal permulaan anak anda sebelum bertukar:</small>
            <div style="display:flex;align-items:center;gap:10px;margin-top:8px;">
              <input type="range" id="switch-gift-slider" min="0" max="${maxGift}" step="${Math.max(1, Math.floor(maxGift / 50))}" value="${defaultGift}" style="flex:1;" />
            </div>
            <div id="switch-gift-display" style="margin-top:4px;font-weight:700;color:#0f766e;">
              Hadiah Permulaan: ${Utils.formatMoney(defaultGift, s.countryId)}
            </div>
          </div>
        ` : `<div class="info-banner"><small>Tiada baki tunai tersedia untuk Hadiah Permulaan.</small></div>`}

        <button type="button" class="primary-btn" id="btn-confirm-switch-child" style="background:linear-gradient(135deg,#6d28d9,#4f46e5);">
          🔄 Sahkan &amp; Teruskan Sebagai ${Utils.escapeHtml(child.name)}
        </button>
        <button type="button" class="ghost-btn" id="btn-cancel-switch-child" style="margin-top:8px;">← Kembali</button>
      `
    });

    const slider = document.getElementById('switch-gift-slider');
    const disp = document.getElementById('switch-gift-display');
    if (slider && disp) {
      slider.addEventListener('input', (e) => {
        disp.textContent = `Hadiah Permulaan: ${Utils.formatMoney(Number(e.target.value) || 0, s.countryId)}`;
      });
    }

    document.getElementById('btn-confirm-switch-child').addEventListener('click', () => {
      const giftAmt = slider ? Number(slider.value) || 0 : 0;
      const next = GameState.switchToLivingChild(childId, giftAmt);
      if (next) {
        this.close(true);
        App.renderAll();
        App.toast(`🔄 Anda kini bermain sebagai ${next.name} (Gen ${next.generation})!`, 'culture');
        if (window.LegacyModals && LegacyModals.checkAndToastPendingPrime) {
          setTimeout(() => LegacyModals.checkAndToastPendingPrime(), 350);
        }
      }
    });

    document.getElementById('btn-cancel-switch-child').addEventListener('click', () => {
      this.showRelationDetail(childId);
    });
  },

  // --------------------------------------------------------------------------
  // 4A. MODAL PENAMAAN BAYI / ANAK ANGKAT (CUSTOM ATAU NAMA RAWAK)
  // --------------------------------------------------------------------------
  showBabyNamingModal(draft, onDone = null) {
    const s = GameState.current;
    if (!s || !draft) return;
    const c = Utils.getCountry(s.countryId);
    const isBoy = draft.gender === 'male';
    const genderLabel = isBoy ? '♂ Lelaki' : '♀ Perempuan';
    const stats = draft.stats || { smarts: 70, health: 85, looks: 75 };

    this.open({
      icon: draft.isAdopted ? '🏡' : '👶',
      title: draft.isAdopted ? 'Anak Angkat Baharu!' : 'Bayi Dilahirkan!',
      subtitle: `${genderLabel} • ${s.city}, ${c.name} ${c.flag}`,
      locked: true,
      bodyHtml: `
        <div class="info-banner highlight" style="text-align:center;">
          <div style="font-size:38px;line-height:1;">${isBoy ? '👶🏻' : '👧🏻'}</div>
          <div style="margin-top:6px;font-weight:700;">
            ${draft.isAdopted
              ? `Anak angkat ${isBoy ? 'lelaki' : 'perempuan'} (${draft.kidAge} tahun) kini menyertai keluarga anda!`
              : `Tahniah! Bayi ${isBoy ? 'lelaki' : 'perempuan'} anda selamat dilahirkan!`}
          </div>
          <div class="preview-tags" style="justify-content:center;margin-top:8px;">
            <span class="preview-tag">Jantina: ${genderLabel}</span>
            <span class="preview-tag">❤️ Kesihatan: ${stats.health}%</span>
            <span class="preview-tag">🧠 Kepintaran: ${stats.smarts}%</span>
            <span class="preview-tag">✨ Penampilan: ${stats.looks}%</span>
          </div>
        </div>

        <div class="creator-section" style="margin-top:10px;">
          <label class="creator-label" for="baby-name-input">Masukkan Nama Anak</label>
          <div class="name-input-row">
            <input type="text" id="baby-name-input" class="input-field" value="${Utils.escapeHtml(draft.suggestedName)}" maxlength="48" placeholder="Masukkan nama anak..." />
            <button type="button" id="btn-baby-random-name" class="secondary-btn" title="Jana nama rawak mengikut budaya">🎲 Nama Rawak</button>
          </div>
          <small style="opacity:0.78;display:block;margin-top:4px;">${Relationships.isMuslim(s)
            ? 'Tip: Anda boleh tulis nama panggilan ringkas (cth. "Aiman") — format bin/binti akan dilengkapkan secara automatik.'
            : 'Tip: Anda boleh tulis nama panggilan ringkas — nama keluarga akan dilengkapkan secara automatik.'}</small>
        </div>

        <button type="button" class="primary-btn" id="btn-baby-confirm-name" style="margin-top:12px;">✅ Sahkan Nama</button>
      `
    });

    const inputEl = document.getElementById('baby-name-input');
    const randBtn = document.getElementById('btn-baby-random-name');
    const confirmBtn = document.getElementById('btn-baby-confirm-name');

    if (randBtn) {
      randBtn.addEventListener('click', () => {
        const fresh = Relationships.generateBabyDraft(s, {
          gender: draft.gender,
          isAdopted: draft.isAdopted,
          isOutOfWedlock: draft.isOutOfWedlock,
          kidAge: draft.kidAge,
          partnerId: draft.partnerId,
          partnerName: draft.partnerName,
          stats: draft.stats
        });
        draft.suggestedName = fresh.suggestedName;
        if (inputEl) inputEl.value = fresh.suggestedName;
      });
    }

    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        const chosen = inputEl ? inputEl.value.trim() : draft.suggestedName;
        const res = Relationships.finalizeChildBirth(s, draft, chosen);
        this.close(true);
        App.renderAll();
        App.toast(res.msg, res.ok ? 'success' : 'error');
        if (typeof onDone === 'function') onDone(res);
      });
    }
  },

  // --------------------------------------------------------------------------
  // 4B. MODAL PERJANJIAN PRANIKAH (PRENUP) UNTUK PERKAHWINAN SIVIL
  // --------------------------------------------------------------------------
  showCivilMarriagePrenupModal(relId) {
    const s = GameState.current;
    const rel = s.relationships.find(r => r.id === relId);
    if (!rel) return;
    const c = Utils.getCountry(s.countryId);
    const ringCost = Utils.usdToLocal(1800, s.countryId);
    const prenupFee = LegalInheritanceEngine.getPrenupFeeLocal(s.countryId);
    const curNet = Math.max(0, GameState.getNetWorth());

    this.open({
      icon: '💍',
      title: `Perkahwinan Sivil (${c.name})`,
      subtitle: `Pilihan Perjanjian Pranikah (Prenup) bersama ${rel.name}`,
      bodyHtml: `
        <div class="info-banner highlight">
          <strong>🛡️ Lindungi Aset Sebelum Kahwin?</strong><br/>
          Nilai aset bersih anda sekarang ialah <strong>${Utils.formatMoney(curNet, s.countryId)}</strong>.<br/>
          Dalam Undang-undang Sivil ${c.name}, penceraian tanpa Prenup melibatkan pembahagian <strong>40–50% aset perkahwinan</strong> serta kemungkinan <strong>Alimoni</strong>.
        </div>
        <div class="action-list">
          <button class="action-item" id="btn-marry-with-prenup">
            <span class="ai-icon">🛡️</span>
            <span class="ai-content">
              <span class="ai-title">Berkahwin Dengan Perjanjian Pranikah (Prenup)</span>
              <span class="ai-desc">Melindungi 100% aset sebelum kahwin &amp; mengecualikan Alimoni jika bercerai</span>
            </span>
            <span class="ai-right cost">${Utils.formatMoney(ringCost + prenupFee, s.countryId)}</span>
          </button>
          <button class="action-item" id="btn-marry-no-prenup">
            <span class="ai-icon">💍</span>
            <span class="ai-content">
              <span class="ai-title">Berkahwin Tanpa Prenup</span>
              <span class="ai-desc">Perkahwinan sivil biasa tanpa perjanjian pranikah</span>
            </span>
            <span class="ai-right cost">${Utils.formatMoney(ringCost, s.countryId)}</span>
          </button>
        </div>
        <button class="ghost-btn" id="btn-prenup-back">← Kembali</button>
      `
    });

    const handleCivilPropose = (hasPrenup) => {
      const res = Sim.interactRelation(relId, 'propose', { hasPrenup });
      App.toast(res.msg, res.ok ? 'success' : 'error');
      App.renderAll();
      if (res.followUpEvent) {
        this.showEvent(res.followUpEvent);
      } else if (res.brokeUp || res.weddingCancelled) {
        this.showRelationships();
      } else {
        this.showRelationDetail(relId);
      }
    };
    document.getElementById('btn-marry-with-prenup').addEventListener('click', () => handleCivilPropose(true));
    document.getElementById('btn-marry-no-prenup').addEventListener('click', () => handleCivilPropose(false));
    document.getElementById('btn-prenup-back').addEventListener('click', () => this.showRelationDetail(relId));
  },

  // --------------------------------------------------------------------------
  // 4C. MODAL PROSIDING PENCERAIAN (MAHKAMAH SYARIAH & MAHKAMAH SIVIL)
  // --------------------------------------------------------------------------
  showDivorceModal(partnerId, meta = {}, opts = {}) {
    const s = GameState.current;
    GameState.ensureUpgradedState();
    const partner = s.relationships.find(r => r.id === partnerId);
    if (!partner || !window.LegalInheritanceEngine) {
      this.showRelationships();
      return;
    }

    const islamic = LegalInheritanceEngine.isSyariahApplicable(s);
    const isHusband = s.gender === 'male';
    const priorTalak = Math.max((s.marriageMeta && s.marriageMeta.talakCount) || 0, partner.talakCount || 0);

    const selectedPath = opts.path || (islamic
      ? (meta.initiatedBy === 'spouse'
          ? (isHusband ? 'khuluk' : (priorTalak >= 2 ? 'talak3' : 'talak1'))
          : (isHusband ? (priorTalak >= 2 ? 'talak3' : 'talak1') : 'fasakh'))
      : 'civil');
    const selectedMode = opts.settlementMode || (islamic ? 'sulh' : 'mediasi');

    const prev = LegalInheritanceEngine.previewDivorce(s, partner, {
      path: selectedPath,
      settlementMode: selectedMode
    });

    const fmt = (val) => Utils.formatMoney(Math.abs(val), s.countryId);
    const fmtSigned = (val) => val >= 0 ? `+${fmt(val)}` : `-${fmt(val)}`;

    let controlsHtml = '';
    let breakdownHtml = '';

    if (islamic) {
      const pathOptions = isHusband
        ? [
            ...(priorTalak < 2 ? [{ id: 'talak1', label: `📜 Talak ${priorTalak + 1} (Idah 1 Thn • Boleh Rujuk)` }] : []),
            { id: 'talak3', label: '🚫 Talak 3 (Talak Bain Kubra — Kekal)' },
            { id: 'khuluk', label: '🤝 Khuluk (Tebus Talak)' }
          ]
        : [
            { id: 'fasakh', label: '⚖️ Tuntutan Fasakh (Hakim Syarie)' },
            { id: 'khuluk', label: '💸 Khuluk (Tebus Talak)' },
            ...(meta.initiatedBy === 'spouse' ? [{ id: priorTalak >= 2 ? 'talak3' : 'talak1', label: `📜 Suami Lafaz Talak ${Math.min(3, priorTalak + 1)}` }] : [])
          ];

      controlsHtml = `
        <div class="section-heading">1. Laluan Penceraian Syariah</div>
        <div class="tab-pills" style="margin-bottom:10px;">
          ${pathOptions.map(p => `
            <button type="button" class="tab-pill div-path-pill ${p.id === selectedPath ? 'active' : ''}" data-path="${p.id}">${p.label}</button>
          `).join('')}
        </div>
        <div class="section-heading">2. Kaedah Penyelesaian Harta Sepencarian</div>
        <div class="tab-pills" style="margin-bottom:10px;">
          <button type="button" class="tab-pill div-mode-pill ${selectedMode === 'sulh' ? 'active' : ''}" data-mode="sulh">🤝 Runding Secara Baik (Sulh)</button>
          <button type="button" class="tab-pill div-mode-pill ${selectedMode === 'peguam' ? 'active' : ''}" data-mode="peguam">⚖️ Lantik Peguam Syariah</button>
        </div>
      `;

      breakdownHtml = `
        <div class="info-banner" style="line-height:1.65;">
          <strong>⚖️ Anggaran Perintah Mahkamah Syariah</strong><br/>
          Laluan: <strong>${Utils.escapeHtml(prev.pathLabel)}</strong><br/>
          Harta Sepencarian (${prev.sepencarianPct}% daripada ${fmt(prev.maritalAssets)}): <strong>${fmtSigned(prev.sepencarianDelta)}</strong><br/>
          ${Utils.escapeHtml(prev.mutaahLabel)}: <strong>${fmtSigned(prev.mutaahIdahDelta)}</strong><br/>
          Kos Guaman / Mahkamah Syariah: <strong>-${fmt(prev.legalFee)}</strong><br/>
          ${prev.minorKidsCount > 0 ? `Nafkah Anak Tahunan (${prev.minorKidsCount} anak, ${prev.nafkahYears} thn): <strong>${fmtSigned(prev.nafkahAnakAnnual)}/thn</strong><br/>Hadanah: <small>${Utils.escapeHtml(prev.hadanahText)}</small><br/>` : ''}
          <strong>Kesan Tunai Serta-Merta: ${fmtSigned(prev.netCashDelta)}</strong>
        </div>
        ${prev.inIdah
          ? `<div class="info-banner" style="background:#f0fdf4;border-color:#86efac;">⏳ <strong>Tempoh Idah (1 Tahun):</strong> Pilihan sekali <strong>Rujuk Semula</strong> akan dibuka di tab Hubungan sepanjang tempoh Idah.</div>`
          : `<div class="info-banner" style="background:#fef2f2;border-color:#fecaca;">🚫 <strong>Penceraian Kekal:</strong> Tiada pilihan Rujuk Semula untuk laluan ini.</div>`
        }
      `;
    } else {
      controlsHtml = `
        ${prev.hasPrenup
          ? `<div class="info-banner" style="background:#eff6ff;border-color:#93c5fd;">🛡️ <strong>Prenup Aktif!</strong> Aset sebelum kahwin bernilai <strong>${fmt(prev.protectedAmount)}</strong> dilindungi 100% dan Alimoni dikecualikan.</div>`
          : `<div class="info-banner" style="background:#fff7ed;border-color:#fdba74;">⚠️ <strong>Tiada Prenup:</strong> Aset perkahwinan dibahagi <strong>40–50%</strong> dan Alimoni boleh dikenakan jika terdapat jurang pendapatan.</div>`
        }
        <div class="section-heading">Kaedah Prosiding Sivil</div>
        <div class="tab-pills" style="margin-bottom:10px;">
          <button type="button" class="tab-pill div-mode-pill ${selectedMode === 'mediasi' ? 'active' : ''}" data-mode="mediasi">🤝 Mediasi / Rundingan Baik</button>
          <button type="button" class="tab-pill div-mode-pill ${selectedMode === 'litigasi' ? 'active' : ''}" data-mode="litigasi">⚖️ Litigasi Peguam Sivil</button>
        </div>
      `;

      breakdownHtml = `
        <div class="info-banner" style="line-height:1.65;">
          <strong>⚖️ Anggaran Perintah ${Utils.escapeHtml(prev.courtName)}</strong><br/>
          Pembahagian Aset (${prev.splitPct}% daripada ${fmt(prev.maritalAssets)}): <strong>-${fmt(prev.assetSplitLoss)}</strong><br/>
          Yuran Guaman Sivil: <strong>-${fmt(prev.legalFee)}</strong><br/>
          ${prev.alimonyAnnual !== 0 ? `Alimoni (${prev.alimonyYears} tahun): <strong>${fmtSigned(prev.alimonyAnnual)}/thn</strong><br/>` : 'Alimoni: <strong>Tiada</strong><br/>'}
          ${prev.minorKidsCount > 0 ? `Nafkah Anak Sivil (${prev.minorKidsCount} anak, ${prev.childSupportYears} thn): <strong>${fmtSigned(prev.childSupportAnnual)}/thn</strong><br/>Hak Jagaan: <small>${Utils.escapeHtml(prev.custodyText)}</small><br/>` : ''}
          <strong>Kesan Tunai Serta-Merta: ${fmtSigned(prev.netCashDelta)}</strong>
        </div>
      `;
    }

    const isForced = meta && meta.initiatedBy === 'spouse';
    this.open({
      icon: '⚖️',
      title: `${prev.courtName} — Penceraian`,
      subtitle: `${partner.name} • Tempoh perkahwinan: ${prev.yearsMarried} tahun`,
      locked: isForced,
      bodyHtml: `
        ${isForced ? `<div class="info-banner" style="background:#fef2f2;border-color:#fecaca;">💔 <strong>${Utils.escapeHtml(partner.name)}</strong> telah memfailkan tuntutan penceraian (${Utils.escapeHtml(meta.reason || 'kepercayaan runtuh')}).</div>` : ''}
        ${controlsHtml}
        ${breakdownHtml}
        <button class="primary-btn" id="btn-confirm-divorce" style="background:linear-gradient(135deg,#dc2626,#b91c1c);">⚖️ Sahkan Keputusan ${Utils.escapeHtml(prev.courtName)}</button>
        ${!isForced ? `<button class="ghost-btn" id="btn-cancel-divorce" style="margin-top:8px;">← Batalkan &amp; Kembali</button>` : ''}
      `
    });

    document.querySelectorAll('.div-path-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        this.showDivorceModal(partnerId, meta, { path: pill.dataset.path, settlementMode: selectedMode });
      });
    });
    document.querySelectorAll('.div-mode-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        this.showDivorceModal(partnerId, meta, { path: selectedPath, settlementMode: pill.dataset.mode });
      });
    });
    document.getElementById('btn-confirm-divorce').addEventListener('click', () => {
      const res = LegalInheritanceEngine.executeDivorce(s, partnerId, { path: selectedPath, settlementMode: selectedMode });
      this.close(true);
      App.renderAll();
      App.toast(res.msg, 'error');
    });
    const cancelBtn = document.getElementById('btn-cancel-divorce');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.showRelationDetail(partnerId));
    }
  },

  // --------------------------------------------------------------------------
  // 4D. MODAL PENGURUSAN WASIAT SEMASA HIDUP (ISLAM & SIVIL)
  // --------------------------------------------------------------------------
  showWasiatModal(onBack = null) {
    const s = GameState.current;
    GameState.ensureUpgradedState();
    const islamic = LegalInheritanceEngine.isSyariahApplicable(s);
    const c = Utils.getCountry(s.countryId);
    const livingKids = s.relationships.filter(r => ['Anak Lelaki', 'Anak Perempuan', 'Son', 'Daughter'].includes(r.role) && r.alive);

    let bodyHtml = '';
    if (islamic) {
      const curPct = (s.wasiat && s.wasiat.islamicPct) || 0;
      const pctOpts = [
        { val: 0, label: '0% (100% Faraid)' },
        { val: 10, label: '10% Wakaf / Kebajikan' },
        { val: 20, label: '20% Wakaf / Kebajikan' },
        { val: 33.33, label: '33.3% (Maksimum 1/3 Syarak)' }
      ];
      const adoptedKids = livingKids.filter(k => k.isAdopted);
      const curHibahPct = (s.wasiat && typeof s.wasiat.hibahPct === 'number')
        ? s.wasiat.hibahPct
        : (adoptedKids.length > 0 ? (adoptedKids.length === 1 ? 8 : 10) : 0);
      const curRecType = (s.wasiat && s.wasiat.hibahRecipientType) || (adoptedKids.length > 0 ? 'adopted' : 'other');
      const curRecId = (s.wasiat && s.wasiat.hibahRecipientId) || '';

      const livingSpouse = (s.married && s.partnerId)
        ? s.relationships.find(r => r.id === s.partnerId && r.alive)
        : null;
      const hibahRecipients = [livingSpouse, ...livingKids].filter(Boolean);

      const customRecipientOptions = [];
      if (adoptedKids.length > 0) {
        customRecipientOptions.push({ val: 'adopted:', label: `👶 Anak Angkat (${adoptedKids.length} orang — bukan waris Faraid)` });
      }
      if (livingSpouse) {
        customRecipientOptions.push({ val: `spouse:${livingSpouse.id}`, label: `💍 Pasangan: ${livingSpouse.name} (${livingSpouse.role})` });
      }
      for (const k of livingKids) {
        customRecipientOptions.push({ val: `child:${k.id}`, label: `👤 Anak: ${k.name} (${k.role}${k.isAdopted ? ' • Angkat' : ''})` });
      }
      customRecipientOptions.push({ val: 'other:', label: '🌍 Lain-lain / Badan Kebajikan' });
      const selectedRecKey = `${curRecType}:${curRecId}`;
      const faraidRemain = Math.max(0, Math.round((100 - curHibahPct - curPct) * 10) / 10);

      const hibahItems = [];
      const curCash = Math.max(0, s.money || 0);
      if (curCash >= 100) {
        const cash10 = Math.round(curCash * 0.10);
        const cash25 = Math.round(curCash * 0.25);
        if (cash10 > 0) hibahItems.push({ val: `cash:${cash10}`, label: `💵 Tunai 10% (${Utils.formatMoney(cash10, s.countryId)})` });
        if (cash25 > 0) hibahItems.push({ val: `cash:${cash25}`, label: `💵 Tunai 25% (${Utils.formatMoney(cash25, s.countryId)})` });
      }
      for (const p of ((s.assets && s.assets.properties) || [])) {
        hibahItems.push({ val: `property:${p.id}`, label: `🏠 ${p.name} (${Utils.formatMoney(p.value || 0, s.countryId)})` });
      }
      for (const v of ((s.assets && s.assets.vehicles) || [])) {
        hibahItems.push({ val: `vehicle:${v.id}`, label: `🚗 ${v.name} (${Utils.formatMoney(v.value || 0, s.countryId)})` });
      }
      for (const col of ((s.assets && s.assets.collectibles) || []).filter(x => x && x.isHeirloom)) {
        hibahItems.push({ val: `heirloom:${col.id}`, label: `🏛️ ${col.name} (${Utils.formatMoney(col.value || 0, s.countryId)})` });
      }

      bodyHtml = `
        <div class="info-banner highlight">
          <strong>☪️ Wasiat Islam &amp; Hukum Faraid</strong><br/>
          Menurut hukum syarak, anda boleh mewasiatkan <strong>maksimum 1/3 (33.3%)</strong> daripada harta pusaka bersih kepada badan kebajikan, wakaf atau bukan waris. Baki harta akan dibahagikan secara tepat mengikut <strong>Faraid</strong>.
        </div>
        <div class="section-heading">Pilih Peruntukan Wasiat (Semasa: ${curPct}%)</div>
        <div class="action-list">
          ${pctOpts.map(o => `
            <button class="action-item wasiat-islamic-btn ${Math.abs(curPct - o.val) < 0.1 ? 'active' : ''}" data-pct="${o.val}">
              <span class="ai-icon">📜</span>
              <span class="ai-content">
                <span class="ai-title">${o.label}</span>
                <span class="ai-desc">${o.val === 0 ? 'Semua harta bersih diagihkan kepada waris Faraid' : 'Ditolak selepas hutang sebelum pengiraan Faraid'}</span>
              </span>
              <span class="ai-right">${Math.abs(curPct - o.val) < 0.1 ? '✓ Aktif' : 'Pilih'}</span>
            </button>
          `).join('')}
        </div>

        <div class="section-heading" style="margin-top:14px;">🎁 Pengurusan Hibah (0%–100%)</div>
        <div class="info-banner" style="background:#f0f9ff;border-color:#bae6fd;line-height:1.55;">
          <strong>1. Peruntukan Hibah Tersuai (Sebelum Faraid)</strong><br/>
          <small style="opacity:0.85;">${adoptedKids.length > 0 ? 'Anak angkat bukan waris Faraid — diagih sebagai Hibah sebelum Faraid.' : 'Pilih penerima & peratusan Hibah (0%–100%). Hibah > 40% boleh mencetuskan konflik waris!'}</small>
          <div style="display:flex;flex-direction:column;gap:8px;margin-top:8px;">
            <select id="hibah-custom-recipient" class="input-field">
              ${customRecipientOptions.map(o => `<option value="${Utils.escapeHtml(o.val)}" ${o.val === selectedRecKey ? 'selected' : ''}>${Utils.escapeHtml(o.label)}</option>`).join('')}
            </select>
            <div style="display:flex;align-items:center;gap:10px;">
              <input type="range" id="hibah-pct-slider" min="0" max="100" step="1" value="${curHibahPct}" style="flex:1;" />
              <input type="number" id="hibah-pct-input" class="input-field" min="0" max="100" value="${curHibahPct}" style="width:74px;text-align:center;padding:6px;" />
              <strong>%</strong>
            </div>
            <div id="hibah-faraid-preview" style="font-size:12px;color:#0f172a;">
              Wasiat: <strong>${curPct}%</strong> • Hibah: <strong>${curHibahPct}%</strong> • Baki Faraid: <strong>${faraidRemain}%</strong>
            </div>
            <button type="button" class="secondary-btn" id="btn-save-custom-hibah" style="width:100%;">🎁 Simpan Peruntukan Hibah</button>
          </div>
        </div>

        <div class="info-banner" style="background:#f8fafc;border-color:#cbd5e1;line-height:1.55;">
          <strong>2. Hibah Semasa Hidup</strong><br/>
          <small style="opacity:0.82;">Pindah milik tunai atau aset terus kepada pasangan/anak sekarang (dikecualikan daripada Faraid kelak).</small>
          ${hibahRecipients.length > 0 && hibahItems.length > 0 ? `
            <div style="display:flex;flex-direction:column;gap:8px;margin-top:8px;">
              <select id="hibah-recipient-select" class="input-field">
                ${hibahRecipients.map(r => `<option value="${r.id}">${Utils.escapeHtml(r.name)} (${Utils.escapeHtml(r.role)})</option>`).join('')}
              </select>
              <select id="hibah-item-select" class="input-field">
                ${hibahItems.map(it => `<option value="${Utils.escapeHtml(it.val)}">${Utils.escapeHtml(it.label)}</option>`).join('')}
              </select>
              <button type="button" class="secondary-btn" id="btn-confirm-living-hibah" style="width:100%;">🎁 Sahkan Hibah Sekarang</button>
            </div>
          ` : `<div style="margin-top:6px;"><small style="opacity:0.75;">${hibahRecipients.length === 0 ? 'Tiada pasangan atau anak hidup untuk menerima Hibah.' : 'Tiada tunai atau aset tersedia untuk dihibahkan buat masa ini.'}</small></div>`}
        </div>
      `;
    } else {
      const curMode = (s.wasiat && s.wasiat.civilMode) || 'none';
      const curTarget = (s.wasiat && s.wasiat.civilTargetHeirId) || (livingKids[0] && livingKids[0].id) || '';
      const heirSelectHtml = livingKids.length > 0
        ? `
          <div style="margin:8px 0 12px;">
            <label class="creator-label">Pilih Waris Tunggal (jika pilih 1 Waris Utama)</label>
            <select id="wasiat-single-heir-select" class="input-field">
              ${livingKids.map(k => `<option value="${k.id}" ${k.id === curTarget ? 'selected' : ''}>${Utils.escapeHtml(k.name)} (${k.role}, Umur ${k.age})</option>`).join('')}
            </select>
          </div>
        `
        : `<div class="info-banner">Tiada anak hidup buat masa ini — jika pilih 1 Waris Utama, harta akan disalurkan kepada pasangan/waris terdekat.</div>`;

      const modeOpts = [
        { id: 'none', icon: '⚖️', title: 'Tiada Wasiat (Intestate)', desc: 'Lalai sivil: 50% pasangan + 50% anak-anak (atau 100% anak-anak)' },
        { id: 'equal', icon: '🤝', title: 'Wasiat Sama Rata', desc: 'Semua harta bersih dibahagi sama rata antara pasangan & anak-anak' },
        { id: 'single_heir', icon: '👑', title: 'Wasiat 1 Waris Utama', desc: 'Serahkan 100% harta bersih kepada seorang waris pilihan anda' },
        { id: 'charity', icon: '💚', title: 'Wasiat Amal & Kebajikan', desc: `Dermakan 100% harta bersih kepada tabung kebajikan ${c.name}` }
      ];

      bodyHtml = `
        <div class="info-banner highlight">
          <strong>⚖️ Wasiat Sivil (${c.name})</strong><br/>
          Tentukan bagaimana harta bersih anda (selepas hutang &amp; Cukai Pusaka ${c.name}) akan diagihkan apabila anda meninggal dunia.
        </div>
        ${heirSelectHtml}
        <div class="action-list">
          ${modeOpts.map(m => `
            <button class="action-item wasiat-civil-btn" data-mode="${m.id}">
              <span class="ai-icon">${m.icon}</span>
              <span class="ai-content">
                <span class="ai-title">${m.title}</span>
                <span class="ai-desc">${m.desc}</span>
              </span>
              <span class="ai-right">${curMode === m.id ? '✓ Aktif' : 'Pilih'}</span>
            </button>
          `).join('')}
        </div>
      `;
    }

    this.open({
      icon: '📜',
      title: 'Pengurusan Wasiat & Pusaka',
      subtitle: islamic ? 'Sistem Faraid, Wasiat & Hibah Islam' : `Undang-undang Sivil ${c.name}`,
      bodyHtml: `${bodyHtml}<button class="ghost-btn" id="btn-wasiat-back" style="margin-top:10px;">← Kembali</button>`
    });

    document.querySelectorAll('.wasiat-islamic-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = LegalInheritanceEngine.setIslamicWasiat(s, Number(btn.dataset.pct));
        App.toast(res.msg, res.ok ? 'success' : 'error');
        this.showWasiatModal(onBack);
      });
    });

    const hibahSlider = document.getElementById('hibah-pct-slider');
    const hibahInput = document.getElementById('hibah-pct-input');
    const hibahPrev = document.getElementById('hibah-faraid-preview');
    const syncHibahPreview = (rawVal) => {
      const v = Math.max(0, Math.min(100, Math.round(Number(rawVal) || 0)));
      if (hibahSlider) hibahSlider.value = String(v);
      if (hibahInput) hibahInput.value = String(v);
      const curW = Math.min((s.wasiat && s.wasiat.islamicPct) || 0, Math.max(0, 100 - v));
      const rem = Math.max(0, Math.round((100 - v - curW) * 10) / 10);
      if (hibahPrev) {
        const warn = v >= 80 ? ' • ⚠️ <strong style="color:#dc2626;">Waris akan dinafikan hak!</strong>'
          : (v > 40 ? ' • ⚠️ <strong style="color:#d97706;">Risiko konflik keluarga</strong>' : '');
        hibahPrev.innerHTML = `Wasiat: <strong>${curW}%</strong> • Hibah: <strong>${v}%</strong> • Baki Faraid: <strong>${rem}%</strong>${warn}`;
      }
    };
    if (hibahSlider) hibahSlider.addEventListener('input', (e) => syncHibahPreview(e.target.value));
    if (hibahInput) hibahInput.addEventListener('input', (e) => syncHibahPreview(e.target.value));

    const saveCustomHibahBtn = document.getElementById('btn-save-custom-hibah');
    if (saveCustomHibahBtn) {
      saveCustomHibahBtn.addEventListener('click', () => {
        const pctVal = hibahInput ? Number(hibahInput.value) : 0;
        const recSel = document.getElementById('hibah-custom-recipient');
        const [recType, recId] = (recSel && recSel.value ? recSel.value : 'other:').split(':');
        const recObj = recId ? (s.relationships || []).find(r => r.id === recId) : null;
        const recName = recObj ? recObj.name : (recType === 'adopted' ? 'Anak Angkat' : 'Lain-lain / Kebajikan');
        const res = LegalInheritanceEngine.setCustomHibah(s, {
          pct: pctVal,
          recipientType: recType || 'other',
          recipientId: recId || null,
          recipientName: recName
        });
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        if (res.backlashEvent) {
          this.showEvent(res.backlashEvent);
          return;
        }
        this.showWasiatModal(onBack);
      });
    }

    const livingHibahBtn = document.getElementById('btn-confirm-living-hibah');
    if (livingHibahBtn) {
      livingHibahBtn.addEventListener('click', () => {
        const recSel = document.getElementById('hibah-recipient-select');
        const itemSel = document.getElementById('hibah-item-select');
        if (!recSel || !itemSel || !itemSel.value) return;
        const [type, rawVal] = itemSel.value.split(':');
        const payload = type === 'cash'
          ? { recipientId: recSel.value, type: 'cash', amountLocal: Number(rawVal) }
          : { recipientId: recSel.value, type, assetId: rawVal };
        const res = LegalInheritanceEngine.giveLivingHibah(s, payload);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showWasiatModal(onBack);
      });
    }

    document.querySelectorAll('.wasiat-civil-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const sel = document.getElementById('wasiat-single-heir-select');
        const targetId = sel ? sel.value : null;
        const res = LegalInheritanceEngine.setCivilWasiat(s, btn.dataset.mode, targetId);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        if (res.backlashEvent) {
          this.showEvent(res.backlashEvent);
          return;
        }
        this.showWasiatModal(onBack);
      });
    });

    document.getElementById('btn-wasiat-back').addEventListener('click', () => {
      if (typeof onBack === 'function') onBack();
      else this.close(true);
    });
  },

  // --------------------------------------------------------------------------
  // 4E. MODAL PENYATA HARTA PUSAKA (DIPAPARKAN SEBELUM PEWARIS MENYAMBUNG)
  // --------------------------------------------------------------------------
  showEstateStatementModal(preselectedKidId = null) {
    const s = GameState.current;
    if (!s || !window.LegalInheritanceEngine) return;
    const report = LegalInheritanceEngine.calculateEstateStatement(s);
    const fmt = (val) => Utils.formatMoney(val, report.countryId);
    const livingKids = s.relationships.filter(r => ['Anak Lelaki', 'Anak Perempuan', 'Son', 'Daughter'].includes(r.role) && r.alive);

    const sharesRowsHtml = report.shares.map(sh => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid rgba(148,163,184,0.25);font-size:12.5px;">
        <div>
          <strong>${Utils.escapeHtml(sh.name)}</strong> <small style="opacity:0.75;">(${Utils.escapeHtml(sh.role)})</small><br/>
          <small style="opacity:0.8;">${Utils.escapeHtml(sh.fractionLabel)} • ${sh.pct}%</small>
        </div>
        <strong style="color:#0f766e;">${fmt(sh.amount)}</strong>
      </div>
    `).join('');

    const heirloomsHtml = report.heirlooms.length > 0
      ? `
        <div class="info-banner" style="background:#fefce8;border-color:#fde047;">
          <strong>🏛️ Pusaka Keluarga Bertanda (${report.heirlooms.length}):</strong><br/>
          ${report.heirlooms.map(h => `• ${Utils.escapeHtml(h.name)} (${fmt(h.value)})`).join('<br/>')}
          <br/><small>Semua Pusaka Keluarga bertanda akan diwarisi secara terus oleh pewaris pilihan anda.</small>
        </div>
      `
      : '';

    const heirButtonsHtml = livingKids.length > 0
      ? `
        <div class="section-heading">👑 Pilih Pewaris Untuk Sambung Generasi ${(s.generation || 1) + 1}</div>
        <div class="action-list">
          ${livingKids.map(k => {
            const exactAmt = report.getHeirAmount(k.id);
            const isPre = preselectedKidId && preselectedKidId === k.id;
            return `
              <button class="action-item estate-continue-kid-btn ${isPre ? 'highlight' : ''}" data-kid-id="${k.id}">
                <span class="ai-icon">${k.gender === 'female' ? '👧' : '👦'}</span>
                <span class="ai-content">
                  <span class="ai-title">Sambung sebagai ${Utils.escapeHtml(k.name)} (Umur ${k.age})</span>
                  <span class="ai-desc">Mewarisi bahagian tepat: <strong>${fmt(exactAmt)}</strong>${report.heirlooms.length > 0 ? ` + ${report.heirlooms.length} Pusaka Keluarga` : ''}</span>
                </span>
                <span class="ai-right">Warisi →</span>
              </button>
            `;
          }).join('')}
        </div>
      `
      : `
        <button class="primary-btn" id="btn-estate-continue-fallback" style="margin-top:8px;background:linear-gradient(135deg,#6d28d9,#4f46e5);">
          👑 Sahkan &amp; Sambung Sebagai Pewaris Waris Terdekat (Gen ${(s.generation || 1) + 1})
        </button>
      `;

    const jurisdictionBadge = report.isIslamic
      ? `<div class="info-banner" style="background:#ecfdf5;border-color:#6ee7b7;margin-bottom:8px;font-weight:700;">⚖️ Jurisdiksi: Undang-Undang Syariah (Muslim • ${Utils.escapeHtml(report.countryName)})</div>`
      : `<div class="info-banner" style="background:#eff6ff;border-color:#93c5fd;margin-bottom:8px;font-weight:700;">⚖️ Jurisdiksi: Undang-Undang Sivil (${Utils.escapeHtml(report.countryName)})</div>`;

    this.open({
      icon: '📜',
      title: 'Penyata Harta Pusaka',
      subtitle: `${report.systemLabel} • ${s.name}`,
      locked: true,
      bodyHtml: `
        ${jurisdictionBadge}
        <div class="info-banner highlight" style="line-height:1.65;">
          <strong>📊 Ringkasan Pengiraan Harta Pusaka</strong><br/>
          Sistem Undang-undang: <strong>${Utils.escapeHtml(report.systemLabel)}</strong><br/>
          Jumlah Harta Kasar: <strong>${fmt(report.grossEstate)}</strong><br/>
          Tolak Hutang &amp; Gadai Janji: <strong style="color:#dc2626;">-${fmt(report.totalDebts)}</strong><br/>
          <strong>Harta Pusaka Bersih: ${fmt(report.netEstate)}</strong><br/>
          ${report.isIslamic && report.wasiatAmount > 0 ? `Tolak ${Utils.escapeHtml(report.wasiatLabel)}: <strong>-${fmt(report.wasiatAmount)}</strong><br/>` : ''}
          ${report.isIslamic && report.hibahAnakAngkatAmount > 0 ? `Tolak ${Utils.escapeHtml(report.hibahAnakAngkatLabel || 'Hibah Anak Angkat')}: <strong style="color:#0284c7;">-${fmt(report.hibahAnakAngkatAmount)}</strong><br/>` : ''}
          ${!report.isIslamic && report.estateTaxAmount > 0 ? `Tolak Cukai Pusaka ${Utils.escapeHtml(report.countryName)} (${report.estateTaxRate}%): <strong style="color:#dc2626;">-${fmt(report.estateTaxAmount)}</strong><br/>` : ''}
          ${!report.isIslamic ? `Status Wasiat: <strong>${Utils.escapeHtml(report.wasiatLabel)}</strong><br/>` : ''}
          <strong>Jumlah Diagihkan Kepada Waris${report.isIslamic ? ' Faraid' : ''}: ${fmt(report.distributableEstate)}</strong>
        </div>

        <div class="section-heading">🧾 Pecahan Agihan Harta Pusaka</div>
        <div class="info-banner" style="padding:8px 12px;">
          ${sharesRowsHtml || '<small>Tiada baki harta bersih untuk diagihkan.</small>'}
        </div>

        ${heirloomsHtml}
        ${heirButtonsHtml}
        <button class="ghost-btn" id="btn-estate-back-obituary" style="margin-top:8px;">← Kembali ke Obituari</button>
      `
    });

    document.querySelectorAll('.estate-continue-kid-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const next = GameState.continueFamilyLegacy(btn.dataset.kidId, report);
        if (next) {
          this.close(true);
          App.renderAll();
          App.toast(`👑 Menyambung legasi sebagai ${next.name} (Gen ${next.generation})!`, 'culture');
          if (window.LegacyModals && LegacyModals.checkAndToastPendingPrime) {
            setTimeout(() => LegacyModals.checkAndToastPendingPrime(), 350);
          }
        }
      });
    });

    const fbBtn = document.getElementById('btn-estate-continue-fallback');
    if (fbBtn) {
      fbBtn.addEventListener('click', () => {
        const next = GameState.continueFamilyLegacy(null, report);
        if (next) {
          this.close(true);
          App.renderAll();
          App.toast(`👑 Menyambung Dinasti Gen ${next.generation} sebagai ${next.name}!`, 'culture');
          if (window.LegacyModals && LegacyModals.checkAndToastPendingPrime) {
            setTimeout(() => LegacyModals.checkAndToastPendingPrime(), 350);
          }
        }
      });
    }

    document.getElementById('btn-estate-back-obituary').addEventListener('click', () => {
      this.showDeathSummary();
    });
  },

  // --------------------------------------------------------------------------
  // 5. HAB AKTIVITI (Budaya Tempatan, Hijrah, Pasport, Kesihatan & Lain)
  // --------------------------------------------------------------------------
  showActivities(activeSubTab = 'deck') {
    const s = GameState.current;
    const c = Utils.getCountry(s.countryId);

    const tabsHtml = `
      <div class="tab-pills">
        <button class="tab-pill ${activeSubTab === 'deck' ? 'active' : ''}" data-sub="deck">🎲 Dek Aktiviti</button>
        <button class="tab-pill ${activeSubTab === 'culture' ? 'active' : ''}" data-sub="culture">${c.flag} Budaya</button>
        <button class="tab-pill ${activeSubTab === 'migrate' ? 'active' : ''}" data-sub="migrate">✈️ Hijrah</button>
        <button class="tab-pill ${activeSubTab === 'passport' ? 'active' : ''}" data-sub="passport">🛂 Pasport</button>
        <button class="tab-pill ${activeSubTab === 'lifestyle' ? 'active' : ''}" data-sub="lifestyle">💪 Gaya Hidup</button>
      </div>
    `;

    let contentHtml = '';

    if (activeSubTab === 'deck' && window.LegacyModals && LegacyModals.renderDynamicActivitiesTab) {
      contentHtml += LegacyModals.renderDynamicActivitiesTab(s, c);
    } else if (activeSubTab === 'culture') {
      const adapt = GameState.getCurrentAdaptation();
      contentHtml += `
        <div class="info-banner culture-box">
          <strong>${c.flag} Kehidupan di ${s.city}, ${c.name}</strong><br/>
          ${Utils.escapeHtml(c.tagline)}<br/>
          ${s.countryId !== s.birthCountryId ? `<div style="margin-top:5px;">🌍 Penyesuaian Budaya: <strong>${adapt}%</strong> (Sertai budaya tempatan untuk layak memohon PR/Warganegara!)</div>` : ''}
        </div>
        <div class="action-list">
          ${c.cultureActivities.map(act => `
            <button class="action-item culture-act-btn" data-act-id="${act.id}" ${s.yearlyActions[act.id] ? 'disabled' : ''}>
              <span class="ai-icon">${act.icon}</span>
              <span class="ai-content">
                <span class="ai-title">${Utils.escapeHtml(act.title)}</span>
                <span class="ai-desc">${Utils.escapeHtml(act.desc)}</span>
              </span>
              <span class="ai-right cost">${s.age < 18 ? 'Mak Ayah Bayar' : Utils.formatMoney(act.cost, s.countryId)}</span>
            </button>
          `).join('')}
        </div>
      `;

      if (s.countryId !== s.birthCountryId) {
        const home = Utils.getCountry(s.birthCountryId);
        const tripCost = Utils.usdToLocal(home.flightBaseUsd + 220, s.countryId);
        contentHtml += `
          <div class="section-heading">🏡 Balik Kampung &amp; Akar Budaya</div>
          <button class="action-item" id="btn-visit-home" ${s.yearlyActions.visitHome ? 'disabled' : ''}>
            <span class="ai-icon">🛫</span>
            <span class="ai-content">
              <span class="ai-title">Bercuti Pulang ke ${home.name} ${home.flag}</span>
              <span class="ai-desc">Jumpa keluarga tersayang &amp; makan juadah kegemaran zaman kecil!</span>
            </span>
            <span class="ai-right cost">${Utils.formatMoney(tripCost, s.countryId)}</span>
          </button>
        `;
      }
    } else if (activeSubTab === 'migrate') {
      if (s.age < 18) {
        contentHtml += `
          <div class="info-banner highlight">
            ✈️ <strong>Hijrah Dibuka Pada Umur 18 Tahun!</strong><br/>
            Apabila cukup 18 tahun, anda boleh berhijrah ke mana-mana daripada <strong>195 negara di dunia</strong>. Mata wang anda akan ditukar secara automatik!
          </div>
        `;
      } else {
        this._migFilter = this._migFilter || { continent: 'ALL', search: '' };
        const conts = window.WORLD_CONTINENTS || [{ id: 'ALL', label: 'Semua' }];
        const q = (this._migFilter.search || '').toLowerCase();
        const cont = this._migFilter.continent || 'ALL';

        contentHtml += `
          <div class="info-banner highlight">
            ✈️ <strong>Berhijrah dari ${c.flag} ${c.name} ke 195 Negara</strong><br/>
            Simpanan anda (${Utils.formatMoney(s.money, s.countryId)}) akan ditukar ke mata wang negara destinasi!
          </div>
          <div class="country-picker-head" style="margin-bottom:6px;">
            <input type="text" id="mig-search-input" class="input-field" value="${Utils.escapeHtml(this._migFilter.search || '')}" placeholder="🔍 Cari negara destinasi (cth: Switzerland, Brazil, Jepun)..." style="flex:1;" />
            <button type="button" id="btn-mig-random" class="random-country-btn">🎲 Rawak</button>
          </div>
          <div class="tab-pills" style="margin-bottom:8px;">
            ${conts.map(ct => `<button type="button" class="tab-pill mig-cont-pill ${ct.id === cont ? 'active' : ''}" data-mcont="${ct.id}">${ct.label}</button>`).join('')}
          </div>
        `;

        const others = Object.values(window.COUNTRIES)
          .filter(x => {
            if (x.id === s.countryId) return false;
            if (cont !== 'ALL' && x.continent !== cont) return false;
            if (q && !`${x.name} ${x.id} ${x.continent || ''} ${x.currencyCode || ''}`.toLowerCase().includes(q)) return false;
            return true;
          })
          .sort((a, b) => a.name.localeCompare(b.name));

        const shown = others.slice(0, 35);
        if (shown.length === 0) {
          contentHtml += `<div class="info-banner">Tiada negara sepadan dengan carian anda.</div>`;
        } else {
          if (others.length > shown.length) {
            contentHtml += `<div style="font-size:11.5px;color:#64748b;margin-bottom:6px;">Memaparkan ${shown.length} daripada ${others.length} negara — gunakan kotak carian atau penapis benua di atas.</div>`;
          }
          shown.forEach(dest => {
            const isCit = s.citizenships.includes(dest.id);
            const costLocal = Sim.getMigrationCostLocal(dest.id);
            const afterCost = Math.max(0, s.money - costLocal);
            const converted = Utils.convertMoney(afterCost, s.countryId, dest.id);
            const econTier = (dest.salaryMultiplier || 0.5) >= 1.1 ? 'Ekonomi Tinggi' : (dest.salaryMultiplier || 0.5) >= 0.5 ? 'Sederhana' : 'Membangun';

            contentHtml += `
              <div class="migration-card">
                <div class="mig-head">
                  <div class="mig-title">${dest.flag} ${Utils.escapeHtml(dest.name)} ${isCit ? '<span class="residency-badge citizen">Warganegara</span>' : ''}</div>
                  <span style="font-size:12px;font-weight:800;color:#dc2626;">Kos: ${Utils.formatMoney(costLocal, s.countryId)}</span>
                </div>
                <div class="mig-tags">
                  <span class="mig-tag">💱 ${dest.currency.code}</span>
                  <span class="mig-tag">💰 ${econTier}</span>
                  <span class="mig-tag">🧾 Cukai ${Math.round((dest.taxRate || 0) * 100)}%</span>
                  <span class="mig-tag">🛡️ ${dest.safetyIndex || 70}%</span>
                </div>
                <div class="mig-rate">
                  Anggaran baki selepas tiba: <strong>${Utils.formatMoney(converted, dest.id)}</strong>
                </div>
                <div class="mig-actions">
                  ${isCit ? `
                    <button class="btn-sm primary mig-go-btn" style="grid-column:span 2;" data-dest="${dest.id}" data-visa="work">
                      ✈️ Pulang ke ${Utils.escapeHtml(dest.name)} (Tanpa Visa!)
                    </button>
                  ` : `
                    <button class="btn-sm primary mig-go-btn" data-dest="${dest.id}" data-visa="work">💼 Visa Kerja</button>
                    <button class="btn-sm secondary mig-go-btn" data-dest="${dest.id}" data-visa="${s.education.hasDegree ? 'investor' : 'student'}">
                      ${s.education.hasDegree ? '💎 Visa Pelabur' : '🎓 Visa Pelajar'}
                    </button>
                  `}
                </div>
              </div>
            `;
          });
        }
      }
    } else if (activeSubTab === 'passport') {
      const birthC = Utils.getCountry(s.birthCountryId);
      const adapt = GameState.getCurrentAdaptation();
      const isCitizen = s.citizenships.includes(s.countryId);
      const beliefObj = GameState.getBeliefObj(s.belief);
      const famBeliefObj = GameState.getBeliefObj(s.familyBelief);

      const displayName = window.CharacterStatus ? CharacterStatus.getDisplayNameWithTitles(s) : s.name;
      const occ = window.CharacterStatus ? CharacterStatus.getDisplayOccupation(s) : { title: 'Tiada Pekerjaan', badge: '—', secondaryRole: null };
      const inc = window.CharacterStatus ? CharacterStatus.getTotalAnnualIncome(s) : { grossLocal: 0, netLocal: 0, breakdown: [] };
      const incBreakdownStr = inc.breakdown.length > 0
        ? `<br/><small style="opacity:0.85;">Sumber: ${inc.breakdown.map(b => `${b.icon} ${Utils.escapeHtml(b.label)} (${Utils.formatMoney(b.gross, s.countryId)}/thn)`).join(' • ')}</small>`
        : '';

      const relMeta = window.LegalInheritanceEngine
        ? LegalInheritanceEngine.getReligionMeta(s.religion)
        : { icon: beliefObj.icon, label: s.religion || beliefObj.name };
      const islamic = window.LegalInheritanceEngine && LegalInheritanceEngine.isSyariahApplicable(s);
      const wasiatSummary = islamic
        ? ((s.wasiat && s.wasiat.islamicPct > 0) ? `Wasiat Islam ${s.wasiat.islamicPct}% (${s.wasiat.islamicBeneficiary})` : '100% Faraid (Tiada Wasiat)')
        : ((s.wasiat && s.wasiat.civilMode === 'equal') ? 'Wasiat Sama Rata'
          : (s.wasiat && s.wasiat.civilMode === 'single_heir') ? 'Wasiat 1 Waris Utama'
          : (s.wasiat && s.wasiat.civilMode === 'charity') ? 'Wasiat Amal 100%'
          : 'Tiada Wasiat (Intestate)');

      const edObj = s.education || {};
      const edLvlInfo = (window.EducationData && EducationData.LEVEL_INFO[edObj.educationLevel || 'none']) || { icon: '📄', label: 'Tiada/Sekolah' };
      const edFieldObj = (window.EducationData && edObj.educationField) ? EducationData.getField(edObj.educationField) : null;
      const earnedCerts = (window.EducationData && Array.isArray(edObj.certificates))
        ? edObj.certificates.map(cid => EducationData.CERTIFICATES.find(x => x.id === cid)).filter(Boolean)
        : [];

      if (window.EduCareerEngine && EduCareerEngine.ensureFields) EduCareerEngine.ensureFields(s);
      const activeCgpa = (edObj.activeStudy && typeof edObj.activeStudy.currentCgpa === 'number') ? edObj.activeStudy.currentCgpa : null;
      const shownCgpa = activeCgpa !== null ? activeCgpa : (typeof edObj.graduatedCgpa === 'number' ? edObj.graduatedCgpa : null);
      const cgpaLabel = shownCgpa !== null ? ` • PNGK ${activeCgpa !== null ? 'Semasa' : 'Akhir'}: <strong>${shownCgpa.toFixed(2)}</strong>` : '';
      const deansBadge = edObj.hasDeansAward ? ` <span class="cat-badge rare">🏅 Anugerah Dekan (${edObj.deansAwardCount || 1}x)</span>` : '';
      contentHtml += `
        <div class="info-banner highlight">
          <strong>🛂 Biodata &amp; Pasport ${Utils.escapeHtml(displayName)}</strong><br/>
          Pekerjaan / Peranan: <strong>${occ.icon || '👤'} ${Utils.escapeHtml(occ.title)}</strong> <span class="cat-badge synergy">${Utils.escapeHtml(occ.badge)}</span>${occ.secondaryRole ? `<br/>Peranan Sampingan: <strong>${Utils.escapeHtml(occ.secondaryRole)}</strong>` : ''}<br/>
          Jumlah Tahun Bekerja: <strong>${s.totalYearsWorked || 0} tahun</strong> • Tabung (${Utils.escapeHtml(c.retirementScheme || 'KWSP')}): <strong>${Utils.formatMoney(s.retirementFund || 0, s.countryId)}</strong>${(s.pensionAnnual || 0) > 0 ? ` • Pencen: <strong>${Utils.formatMoney(s.pensionAnnual, s.countryId)}/thn</strong>` : ''}<br/>
          Pendidikan Tertinggi: <strong>${edLvlInfo.icon} ${Utils.escapeHtml(edLvlInfo.label)}${edFieldObj ? ` — ${Utils.escapeHtml(edFieldObj.name)}` : ''}</strong>${cgpaLabel}${deansBadge}<br/>
          Pendapatan Tahunan: <strong>${Utils.formatMoney(inc.grossLocal, s.countryId)}/thn</strong> (Bersih: ${Utils.formatMoney(inc.netLocal, s.countryId)}/thn)${incBreakdownStr}<br/>
          Tempat Lahir: ${birthC.flag} ${s.birthCity}, ${birthC.name} (${s.heritageLabel})<br/>
          Agama: <strong>${relMeta.icon} ${Utils.escapeHtml(relMeta.label)}</strong> • Ketahanan Jiwa: ${s.devotion || 40}%<br/>
          Status Perkahwinan: <strong>${s.married ? '💍 Berkahwin' : (s.maritalStatus ? `🕊️ ${Utils.escapeHtml(s.maritalStatus)}` : 'Bujang')}</strong><br/>
          Status Wasiat: <strong>${Utils.escapeHtml(wasiatSummary)}</strong><br/>
          Latar Keluarga: ${famBeliefObj.icon} ${famBeliefObj.name}<br/>
          Status Semasa: <strong>${c.flag} ${c.name} — ${App._residencyLabel(s.residencyStatus)}</strong> (${s.yearsInCurrentCountry} tahun)<br/>
          Kewarganegaraan: ${s.citizenships.map(id => `${Utils.getCountry(id).flag} ${Utils.getCountry(id).name}`).join(', ')}
        </div>
        ${earnedCerts.length > 0 ? `
          <div class="info-banner" style="background:#f0fdf4;border-color:#bbf7d0;">
            <strong>📜 Sijil &amp; Kursus Profesional Dimiliki (${earnedCerts.length})</strong><br/>
            ${earnedCerts.map(ct => `• ${ct.icon} <strong>${Utils.escapeHtml(ct.title)}</strong> <small style="opacity:0.8;">(${Utils.escapeHtml(ct.group)} • +${ct.salaryBonusPct}% gaji)</small>`).join('<br/>')}
          </div>
        ` : ''}
        ${s.age >= 18 && window.LegalInheritanceEngine ? `<button class="secondary-btn" id="btn-biodata-wasiat" style="width:100%;margin-bottom:10px;">📜 Urus Wasiat &amp; Perancangan Pusaka</button>` : ''}
      `;

      if (s.spiritualHistory && s.spiritualHistory.length > 0) {
        contentHtml += `
          <div class="info-banner" style="background:#f5f3ff;border-color:#ddd6fe;">
            <strong>🌌 Perjalanan Rohani (${s.spiritualHistory.length} perubahan)</strong><br/>
            ${s.spiritualHistory.map(h => {
              const fb = GameState.getBeliefObj(h.fromBelief);
              const tb = GameState.getBeliefObj(h.toBelief);
              return `• Umur ${h.age} (${h.year}): ${fb.icon} ${fb.name} → <strong>${tb.icon} ${tb.name}</strong>`;
            }).join('<br/>')}
          </div>
        `;
      }

      if (!isCitizen) {
        const nextStep = s.residencyStatus === 'PR' ? `Warganegara ${c.name}` : `Penduduk Tetap (PR)`;
        const reqText = s.residencyStatus === 'PR'
          ? 'Memerlukan 5+ tahun menetap & 65%+ Penyesuaian Budaya'
          : 'Memerlukan 2+ tahun menetap & 40%+ Penyesuaian Budaya';
        contentHtml += `
          <div class="info-banner culture-box">
            <strong>🌍 Penyesuaian Budaya di ${c.name}: ${adapt}%</strong><br/>
            Langkah Seterusnya: <strong>Mohon ${nextStep}</strong><br/>
            <small>${reqText}</small>
          </div>
          <button class="primary-btn" id="btn-upgrade-residency">🛂 Mohon ${nextStep}</button>
        `;
      }

      contentHtml += `<div class="section-heading">📖 Cop Pasport (${s.passportStamps.length})</div><div class="stamps-grid">`;
      s.passportStamps.forEach((st, i) => {
        const sc = Utils.getCountry(st.countryId);
        contentHtml += `
          <div class="stamp-card ${i === s.passportStamps.length - 1 ? 'active' : ''}">
            <div class="stamp-top"><span>${sc.flag} ${sc.name}</span><span>${st.year}</span></div>
            <div class="stamp-meta">${Utils.escapeHtml(st.city)} • Umur ${st.age}</div>
            <div class="stamp-meta"><strong>${Utils.escapeHtml(st.type)}</strong></div>
          </div>
        `;
      });
      contentHtml += `</div>`;
    } else if (activeSubTab === 'lifestyle') {
      const gymCost = Utils.usdToLocal(25, s.countryId);
      const vacationCost = s.age < 18 ? Utils.usdToLocal(40, s.countryId) : Utils.usdToLocal(180, s.countryId);
      const therapyCost = s.age < 18 ? 0 : Utils.usdToLocal(120, s.countryId);
      const beliefObj = GameState.getBeliefObj(s.belief);
      const charityCost = Utils.usdToLocal(35, s.countryId);
      const curStress = Math.round((s.alignment && s.alignment.stress) || 0);
      const stressTierLabel = curStress >= 90
        ? '🚨 Tekanan Melampau (Risiko Masuk Hospital / Strok)'
        : curStress >= 75
        ? '⚠️ Burnout / Kritikal (Jejas Kesihatan & Emosi)'
        : curStress >= 50
        ? '🟠 Stres Tinggi (-10% Peluang Kerjaya / Misi)'
        : '🟢 Terkawal';
      const stressColor = curStress >= 75 ? '#ef4444' : curStress >= 50 ? '#f59e0b' : '#22c55e';
      const activeStressIllnesses = Array.isArray(s.stressIllnesses) && s.stressIllnesses.length > 0
        ? `<div style="margin-top:4px;font-size:0.78rem;color:#fca5a5;">🩺 Penyakit Akibat Stres: <strong>${s.stressIllnesses.map(i => Utils.escapeHtml(i)).join(', ')}</strong></div>`
        : '';
      contentHtml += `
        <div class="section-heading">🏥 Kesihatan di ${c.name} (${c.healthcare.type})</div>
        <div class="info-banner">${Utils.escapeHtml(c.healthcare.desc)}</div>
        <div class="info-banner" style="border-left:3px solid ${stressColor};margin-top:6px;">
          <div>🧠 <strong>Tahap Stres Semasa: ${curStress}%</strong> — <span style="color:${stressColor};font-weight:700;">${stressTierLabel}</span></div>
          ${activeStressIllnesses}
        </div>
        <div class="action-list">
          <button class="action-item" id="act-doc-pub">
            <span class="ai-icon">🏥</span>
            <span class="ai-content">
              <span class="ai-title">Klinik Awam (${c.healthcare.type.split(' ')[0]})</span>
              <span class="ai-desc">Pemeriksaan kesihatan asas (+9–16% Kesihatan)</span>
            </span>
            <span class="ai-right cost">${c.healthcare.doctorCost === 0 ? 'PERCUMA' : Utils.formatMoney(c.healthcare.doctorCost, s.countryId)}</span>
          </button>
          <button class="action-item" id="act-doc-priv">
            <span class="ai-icon">🩺</span>
            <span class="ai-content">
              <span class="ai-title">Hospital Pakar Swasta</span>
              <span class="ai-desc">Rawatan pakar pantas (+14–24% Kesihatan)</span>
            </span>
            <span class="ai-right cost">${Utils.formatMoney(c.healthcare.privateCost, s.countryId)}</span>
          </button>
        </div>

        <div class="section-heading">🧘‍♂️ Pengurusan Stres &amp; Kesihatan Mental</div>
        <div class="action-list">
          <button class="action-item" id="act-gym" ${s.yearlyActions.gym ? 'disabled' : ''}>
            <span class="ai-icon">🏃‍♂️</span>
            <span class="ai-content">
              <span class="ai-title">Bersenam / Joging</span>
              <span class="ai-desc">Kurangkan Stres (-8 hingga -12%) &amp; tingkatkan Kesihatan</span>
            </span>
            <span class="ai-right cost">${s.age < 18 ? 'Percuma' : Utils.formatMoney(gymCost, s.countryId)}</span>
          </button>
          <button class="action-item" id="act-vacation-rest" ${s.yearlyActions.vacationRest ? 'disabled' : ''}>
            <span class="ai-icon">🏖️</span>
            <span class="ai-content">
              <span class="ai-title">Bercuti / Rehat</span>
              <span class="ai-desc">Rehatkan minda daripada tekanan (-20 hingga -35% Stres, +Gembira)</span>
            </span>
            <span class="ai-right cost">${Utils.formatMoney(vacationCost, s.countryId)}</span>
          </button>
          <button class="action-item" id="act-counseling" ${s.yearlyActions.counselingTherapy ? 'disabled' : ''}>
            <span class="ai-icon">🛋️</span>
            <span class="ai-content">
              <span class="ai-title">Sesi Kaunseling / Terapi</span>
              <span class="ai-desc">Rawatan psikologi (-25 hingga -40% Stres, bantu pulihkan Kemurungan / Insomnia)</span>
            </span>
            <span class="ai-right cost">${s.age < 18 ? 'Percuma' : Utils.formatMoney(therapyCost, s.countryId)}</span>
          </button>
          <button class="action-item" id="act-family-hobby" ${s.yearlyActions.familyHobby ? 'disabled' : ''}>
            <span class="ai-icon">🎨</span>
            <span class="ai-content">
              <span class="ai-title">Luangkan Masa Bersama Keluarga / Hobi</span>
              <span class="ai-desc">Aktiviti santai (-10 hingga -15% Stres, +Gembira &amp; mengeratkan hubungan)</span>
            </span>
            <span class="ai-right">Percuma</span>
          </button>
        </div>

        <div class="section-heading">💪 Minda, Jiwa &amp; Badan</div>
        <div class="action-list">
          <button class="action-item" id="act-spiritual" ${s.yearlyActions.spiritualPractice ? 'disabled' : ''}>
            <span class="ai-icon">${beliefObj.icon}</span>
            <span class="ai-content">
              <span class="ai-title">${Utils.escapeHtml(beliefObj.practiceTitle)} (${beliefObj.name})</span>
              <span class="ai-desc">${Utils.escapeHtml(beliefObj.practiceDesc)}</span>
            </span>
            <span class="ai-right cost">${s.age < 18 ? 'Percuma' : Utils.formatMoney(charityCost, s.countryId)}</span>
          </button>
          <button class="action-item" id="act-library" ${s.yearlyActions.library ? 'disabled' : ''}>
            <span class="ai-icon">📚</span>
            <span class="ai-content">
              <span class="ai-title">Ke Perpustakaan Awam</span>
              <span class="ai-desc">Baca buku untuk tingkatkan Kepintaran</span>
            </span>
            <span class="ai-right">Percuma</span>
          </button>
          <button class="action-item" id="act-meditate" ${s.yearlyActions.meditate ? 'disabled' : ''}>
            <span class="ai-icon">🧘</span>
            <span class="ai-content">
              <span class="ai-title">Tenangkan Fikiran di Taman</span>
              <span class="ai-desc">Tingkatkan Gembira &amp; Kesihatan (-6% Stres)</span>
            </span>
            <span class="ai-right">Percuma</span>
          </button>
          ${s.age >= 17 && !s.hasDriverLicense ? `
            <button class="action-item" id="act-driving-test">
              <span class="ai-icon">🚗</span>
              <span class="ai-content">
                <span class="ai-title">Ambil Ujian Memandu ${c.id === 'MY' ? 'JPJ' : c.name}</span>
                <span class="ai-desc">Lulus ujian jalan raya untuk dapatkan lesen memandu</span>
              </span>
              <span class="ai-right cost">${s.age < 18 ? 'Mak Ayah Bayar' : Utils.formatMoney(Utils.usdToLocal(220, s.countryId), s.countryId)}</span>
            </button>
          ` : ''}
        </div>

        ${s.age >= 16 ? `
          <div class="section-heading">🕶️ Jenayah Berisiko (Awas — Susahkan Visa!)</div>
          <div class="action-list">
            <button class="action-item crime-btn" data-crime="mencuri di kedai" ${s.yearlyActions.crime ? 'disabled' : ''}>
              <span class="ai-icon">🥷</span>
              <span class="ai-content">
                <span class="ai-title">Mencuri Kecil-kecilan</span>
                <span class="ai-desc">Hasil kecil, undang-undang ketat di SG/JP/KR!</span>
              </span>
              <span class="ai-right cost">Berisiko</span>
            </button>
            <button class="action-item crime-btn" data-crime="rompakan" ${s.yearlyActions.crime ? 'disabled' : ''}>
              <span class="ai-icon">💰</span>
              <span class="ai-content">
                <span class="ai-title">Rompakan / Skim Berisiko Tinggi</span>
                <span class="ai-desc">Untung besar atau denda berat &amp; rekod jenayah</span>
              </span>
              <span class="ai-right cost">Risiko Tinggi</span>
            </button>
          </div>
        ` : ''}
      `;
    }

    this.open({
      icon: '🌍',
      title: 'Aktiviti & Dunia',
      subtitle: `${c.flag} ${s.city}, ${c.name}`,
      bodyHtml: tabsHtml + contentHtml
    });

    document.querySelectorAll('.tab-pill').forEach(pill => {
      pill.addEventListener('click', () => this.showActivities(pill.dataset.sub));
    });

    if (activeSubTab === 'deck' && window.LegacyModals && LegacyModals.bindDynamicActivities) {
      LegacyModals.bindDynamicActivities(() => this.showActivities('deck'));
    }

    document.querySelectorAll('.culture-act-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const act = c.cultureActivities.find(a => a.id === btn.dataset.actId);
        const res = Sim.doCultureActivity(act);
        App.toast(res.msg, res.ok ? 'culture' : 'error');
        App.renderAll();
        this.showActivities('culture');
      });
    });

    const visitHomeBtn = document.getElementById('btn-visit-home');
    if (visitHomeBtn) {
      visitHomeBtn.addEventListener('click', () => {
        const home = Utils.getCountry(s.birthCountryId);
        const cost = Utils.usdToLocal(home.flightBaseUsd + 220, s.countryId);
        if (s.money < cost) {
          App.toast(`Perlukan ${Utils.formatMoney(cost, s.countryId)} untuk tiket pulang!`, 'error');
          return;
        }
        s.money -= cost;
        s.yearlyActions.visitHome = true;
        GameState.adjustStats({ happiness: 20, health: 4 });
        s.relationships.filter(r => r.alive && r.countryId === s.birthCountryId).forEach(r => {
          r.closeness = Utils.clamp(r.closeness + 15);
        });
        GameState.addJournalEntry(
          `🛫 Terbang pulang bercuti ke ${home.name} ${home.flag}! Melepas rindu dengan keluarga dan menikmati juadah tanah air!`,
          'culture'
        );
        GameState.save();
        App.renderAll();
        App.toast(`Percutian indah ke ${home.name}!`, 'success');
        this.showActivities('culture');
      });
    }

    const migSearch = document.getElementById('mig-search-input');
    if (migSearch) {
      migSearch.addEventListener('input', (e) => {
        this._migFilter = this._migFilter || { continent: 'ALL', search: '' };
        this._migFilter.search = e.target.value;
        const pos = e.target.selectionStart;
        Utils.debounceKey('mig-country-search', () => {
          this.showActivities('migrate');
          const nextInput = document.getElementById('mig-search-input');
          if (nextInput) {
            nextInput.focus();
            try { nextInput.setSelectionRange(pos, pos); } catch (err) {}
          }
        }, 160);
      });
    }

    document.querySelectorAll('.mig-cont-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        this._migFilter = this._migFilter || { continent: 'ALL', search: '' };
        this._migFilter.continent = pill.dataset.mcont;
        this.showActivities('migrate');
      });
    });

    const migRand = document.getElementById('btn-mig-random');
    if (migRand) {
      migRand.addEventListener('click', () => {
        const others = Object.values(window.COUNTRIES).filter(x => x.id !== s.countryId);
        const picked = Utils.pick(others);
        if (picked) {
          this._migFilter = { continent: 'ALL', search: picked.name };
          this.showActivities('migrate');
        }
      });
    }

    document.querySelectorAll('.mig-go-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const destId = btn.dataset.dest;
        const visaType = btn.dataset.visa;
        const spouse = Sim.getMarriedSpouse ? Sim.getMarriedSpouse(s) : null;
        if (spouse) {
          this.showSpouseMigrationDiscussionModal(destId, visaType);
          return;
        }
        const res = Sim.migrateToCountry(destId, visaType);
        if (res.ok) {
          this.close(true);
          App.renderAll();
          App.toast(res.msg, 'culture');
          if (res.arrivalEvent) {
            setTimeout(() => this.showEvent(res.arrivalEvent), 260);
          }
        } else {
          App.toast(res.msg, 'error');
          App.renderAll();
        }
      });
    });

    const biodataWasiatBtn = document.getElementById('btn-biodata-wasiat');
    if (biodataWasiatBtn) {
      biodataWasiatBtn.addEventListener('click', () => {
        this.showWasiatModal(() => this.showActivities('passport'));
      });
    }

    const resBtn = document.getElementById('btn-upgrade-residency');
    if (resBtn) {
      resBtn.addEventListener('click', () => {
        const res = Sim.upgradeResidency();
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showActivities('passport');
      });
    }

    const docPub = document.getElementById('act-doc-pub');
    if (docPub) docPub.addEventListener('click', () => {
      const res = Sim.visitDoctor(false);
      App.toast(res.msg, res.ok ? 'success' : 'error');
      App.renderAll();
    });
    const docPriv = document.getElementById('act-doc-priv');
    if (docPriv) docPriv.addEventListener('click', () => {
      const res = Sim.visitDoctor(true);
      App.toast(res.msg, res.ok ? 'success' : 'error');
      App.renderAll();
    });

    const spiritualBtn = document.getElementById('act-spiritual');
    if (spiritualBtn) spiritualBtn.addEventListener('click', () => {
      const res = Sim.doSpiritualPractice();
      App.toast(res.msg, res.ok ? 'culture' : 'error');
      App.renderAll();
      this.showActivities('lifestyle');
    });

    const gymBtn = document.getElementById('act-gym');
    if (gymBtn) gymBtn.addEventListener('click', () => {
      const res = Sim.doExerciseJogging();
      App.toast(res.msg, res.ok ? 'success' : 'error');
      App.renderAll();
      this.showActivities('lifestyle');
    });

    const vacRestBtn = document.getElementById('act-vacation-rest');
    if (vacRestBtn) vacRestBtn.addEventListener('click', () => {
      const res = Sim.takeVacationRest();
      App.toast(res.msg, res.ok ? 'success' : 'error');
      App.renderAll();
      this.showActivities('lifestyle');
    });

    const counselBtn = document.getElementById('act-counseling');
    if (counselBtn) counselBtn.addEventListener('click', () => {
      const res = Sim.attendCounselingTherapy();
      App.toast(res.msg, res.ok ? 'success' : 'error');
      App.renderAll();
      this.showActivities('lifestyle');
    });

    const famHobbyBtn = document.getElementById('act-family-hobby');
    if (famHobbyBtn) famHobbyBtn.addEventListener('click', () => {
      const res = Sim.spendFamilyHobbyTime();
      App.toast(res.msg, res.ok ? 'success' : 'error');
      App.renderAll();
      this.showActivities('lifestyle');
    });

    const libBtn = document.getElementById('act-library');
    if (libBtn) libBtn.addEventListener('click', () => {
      s.yearlyActions.library = true;
      GameState.adjustStats({ smarts: 6, happiness: 2 });
      GameState.addJournalEntry(`📚 Meluangkan petang yang tenang membaca di Perpustakaan Awam ${s.city}.`);
      GameState.save();
      App.renderAll();
      App.toast('Kepintaran +6%!', 'success');
      this.showActivities('lifestyle');
    });

    const medBtn = document.getElementById('act-meditate');
    if (medBtn) medBtn.addEventListener('click', () => {
      s.yearlyActions.meditate = true;
      GameState.adjustStats({ happiness: 8, health: 4 });
      if (typeof AlignmentEngine !== 'undefined') AlignmentEngine.adjust(s, { stress: -6 });
      GameState.addJournalEntry(`🧘 Bertenang dan berjalan santai di taman rekreasi (-6% Stres).`);
      GameState.save();
      App.renderAll();
      App.toast('Fikiran lebih tenang! (-6% Stres)', 'success');
      this.showActivities('lifestyle');
    });

    const driveBtn = document.getElementById('act-driving-test');
    if (driveBtn) driveBtn.addEventListener('click', () => {
      const res = Sim.takeDrivingTest();
      App.toast(res.msg, res.ok ? 'success' : 'error');
      App.renderAll();
      this.showActivities('lifestyle');
    });

    document.querySelectorAll('.crime-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = Sim.commitCrime(btn.dataset.crime);
        App.toast(res.msg, res.ok ? 'culture' : 'error');
        App.renderAll();
        this.showActivities('lifestyle');
      });
    });
  },

  // --------------------------------------------------------------------------
  // 6. MENU & DEWAN LEGASI
  // --------------------------------------------------------------------------
  showMenu() {
    const history = GameState.getHistory();
    const unlocked = window.KarmaEndings ? KarmaEndings.getUnlocked() : { endings: [], modes: [] };
    const totalEndings = window.KarmaEndings ? KarmaEndings.ENDINGS_CATALOG.length : 12;
    const totalModes = window.KarmaEndings ? KarmaEndings.MODES_LIST.length : 6;

    let histHtml = history.length === 0
      ? `<div class="info-banner">Belum ada rekod kehidupan tamat. Jalani kehidupan penuh untuk membuka penamat rahsia!</div>`
      : history.map(h => `
          <div class="info-banner">
            <strong>${h.ribbon.icon} ${Utils.escapeHtml(h.name)}</strong> — Umur ${h.age} thn • <strong>${h.ribbon.name}</strong><br/>
            Negara: ${h.countriesLivedIn.map(id => Utils.getCountry(id).flag).join(' ')} • Harta Akhir: ${h.netWorthFormatted}
          </div>
        `).join('');

    const endingsHtml = window.KarmaEndings ? `
      <div class="section-heading">🗝️ Penamat Rahsia (${unlocked.endings.length}/${totalEndings}) • Mod Dicuba (${unlocked.modes.length}/${totalModes})</div>
      <div class="endings-grid">
        ${KarmaEndings.ENDINGS_CATALOG.map(e => {
          const has = unlocked.endings.includes(e.id);
          return `<div class="ending-chip ${has ? 'unlocked' : 'locked'}"><span>${has ? e.icon : '🔒'}</span><span>${has ? e.title : 'Penamat Rahsia'}</span></div>`;
        }).join('')}
      </div>
    ` : '';

    const isMuted = Utils.isMuted ? Utils.isMuted() : !!window._wlMuted;

    this.open({
      icon: '🌍',
      title: 'Menu WorldLife',
      subtitle: 'Laluan Hidup, Legasi, Tetapan & Simpanan',
      bodyHtml: `
        <div class="action-list">
          <button class="action-item" id="menu-open-legacy">
            <span class="ai-icon">👑</span>
            <span class="ai-content">
              <span class="ai-title">Legasi Keluarga &amp; Pencapaian Dinasti</span>
              <span class="ai-desc">Salasilah, Reputasi Keluarga, Status Legasi &amp; Generasi Perdana</span>
            </span>
          </button>
          ${(GameState.current && window.SpecialModesEngine && SpecialModesEngine.getActiveInfo(GameState.current)) ? (() => {
            const info = SpecialModesEngine.getActiveInfo(GameState.current);
            return `
              <button class="action-item" id="menu-open-active-special">
                <span class="ai-icon">${info.def.icon}</span>
                <span class="ai-content">
                  <span class="ai-title">Mod Khas Aktif: ${Utils.escapeHtml(info.def.title)}</span>
                  <span class="ai-desc">Pangkat: ${Utils.escapeHtml(info.rank.title)} — Klik untuk buka Papan Pemuka</span>
                </span>
              </button>
            `;
          })() : ''}
          <button class="action-item" id="menu-open-social">
            <span class="ai-icon">📱</span>
            <span class="ai-content">
              <span class="ai-title">Laman Sosial, Viral &amp; Platform Jodoh</span>
              <span class="ai-desc">Bina pengikut, kerjaya viral &amp; cari pasangan</span>
            </span>
          </button>
          <button class="action-item" id="menu-open-passport">
            <span class="ai-icon">🛂</span>
            <span class="ai-content">
              <span class="ai-title">Lihat Pasport, Profil &amp; Kepercayaan</span>
              <span class="ai-desc">Semak negara, cop pasport &amp; perjalanan rohani</span>
            </span>
          </button>
          <button class="action-item" id="menu-new-life">
            <span class="ai-icon">✨</span>
            <span class="ai-content">
              <span class="ai-title">Mula Kehidupan Baru</span>
              <span class="ai-desc">Pilih negara lahir, latar belakang budaya &amp; nama baru</span>
            </span>
          </button>
        </div>

        <div class="section-heading">⚙️ Tetapan Bunyi &amp; Sandaran Data (.json)</div>
        <div class="action-list">
          <button class="action-item" id="menu-toggle-sound">
            <span class="ai-icon">${isMuted ? '🔇' : '🔊'}</span>
            <span class="ai-content">
              <span class="ai-title">Kesan Bunyi: ${isMuted ? 'Senyap (Dimatikan)' : 'Aktif'}</span>
              <span class="ai-desc">Klik untuk ${isMuted ? 'mengaktifkan semula' : 'mematikan'} kesan bunyi sintetizer ringan (0 KB)</span>
            </span>
            <span class="ai-right">${isMuted ? 'Hidupkan' : 'Senyapkan'}</span>
          </button>
          <button class="action-item" id="menu-export-save">
            <span class="ai-icon">💾</span>
            <span class="ai-content">
              <span class="ai-title">Eksport Save (.json)</span>
              <span class="ai-desc">Muat turun fail sandaran watak semasa, legasi dinasti &amp; penamat rahsia</span>
            </span>
            <span class="ai-right">Muat Turun</span>
          </button>
          <button class="action-item" id="menu-import-save">
            <span class="ai-icon">📂</span>
            <span class="ai-content">
              <span class="ai-title">Import Save (.json)</span>
              <span class="ai-desc">Muat naik &amp; sahkan fail sandaran .json untuk memulihkan permainan</span>
            </span>
            <span class="ai-right">Pilih Fail</span>
          </button>
          <input type="file" id="menu-import-file-input" accept=".json,application/json" class="hidden" />
        </div>

        ${endingsHtml}
        <div class="section-heading">🏆 Dewan Kehidupan Lalu (${history.length})</div>
        ${histHtml}
      `
    });

    document.getElementById('menu-open-legacy').addEventListener('click', () => {
      if (GameState.current && window.LegacyModals) LegacyModals.showFamilyLegacy();
    });
    const spMenuBtn = document.getElementById('menu-open-active-special');
    if (spMenuBtn) {
      spMenuBtn.addEventListener('click', () => {
        if (GameState.current && GameState.current.alive && window.SpecialModeModals) SpecialModeModals.showDashboard();
      });
    }
    document.getElementById('menu-open-social').addEventListener('click', () => {
      if (GameState.current && GameState.current.alive && window.ModeModals) ModeModals.showSocialHub('social');
    });
    document.getElementById('menu-new-life').addEventListener('click', () => {
      this.close(true);
      App.showStartScreen();
    });
    document.getElementById('menu-open-passport').addEventListener('click', () => {
      this.showActivities('passport');
    });

    document.getElementById('menu-toggle-sound').addEventListener('click', () => {
      const nextMuted = !(Utils.isMuted ? Utils.isMuted() : !!window._wlMuted);
      if (Utils.setMuted) Utils.setMuted(nextMuted);
      else window._wlMuted = nextMuted;
      if (!nextMuted && Utils.playTone) Utils.playTone('success');
      App.toast(nextMuted ? '🔇 Kesan bunyi dimatikan.' : '🔊 Kesan bunyi diaktifkan!', 'culture');
      this.showMenu();
    });

    document.getElementById('menu-export-save').addEventListener('click', () => {
      const bundle = GameState.buildExportBundle();
      const jsonStr = JSON.stringify(bundle, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const gen = (bundle.dynasty && bundle.dynasty.generation) || (bundle.current && bundle.current.generation) || 1;
      const safeName = ((bundle.current && bundle.current.name) || 'worldlife')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      a.href = url;
      a.download = `worldlife-save-gen${gen}-${safeName || 'backup'}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      App.toast('💾 Fail sandaran .json berjaya dimuat turun!', 'success');
    });

    const importBtn = document.getElementById('menu-import-save');
    const fileInput = document.getElementById('menu-import-file-input');
    importBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(String(reader.result || ''));
          const res = GameState.importBundle(parsed);
          if (!res.ok) {
            App.toast(`❌ Import gagal: ${res.msg}`, 'error');
            return;
          }
          this.close(true);
          if (GameState.current && GameState.current.alive) {
            App.showGameScreen();
            App.renderAll();
          } else {
            App.showStartScreen();
          }
          App.toast(`✅ ${res.msg}`, 'success');
        } catch (err) {
          App.toast('❌ Fail JSON tidak sah atau rosak.', 'error');
        }
      };
      reader.readAsText(file);
    });
  },

  // --------------------------------------------------------------------------
  // 7. RINGKASAN AKHIR HAYAT & SAMBUNG SEBAGAI ANAK
  // --------------------------------------------------------------------------
  showDeathSummary() {
    if (window.ModeModals && ModeModals.showLegacyObituary) {
      ModeModals.showLegacyObituary();
      return;
    }
    const s = GameState.current;
    const ribbon = GameState.computeRibbon(s);
    const c = Utils.getCountry(s.countryId);
    const birthC = Utils.getCountry(s.birthCountryId);
    const livingKids = s.relationships.filter(r => (r.role === 'Anak Lelaki' || r.role === 'Anak Perempuan' || r.role === 'Son' || r.role === 'Daughter') && r.alive);

    const kidsHtml = livingKids.length > 0 ? `
      <div class="section-heading">👑 Sambung Legasi Sebagai Anak (Gen ${(s.generation || 1) + 1})</div>
      <div class="action-list">
        ${livingKids.map(k => {
          const kc = Utils.getCountry(k.countryId);
          return `
            <button class="action-item continue-kid-btn" data-kid-id="${k.id}">
              <span class="ai-icon">${k.gender === 'female' ? '👧' : '👦'}</span>
              <span class="ai-content">
                <span class="ai-title">Main sebagai ${Utils.escapeHtml(k.name)} (Umur ${k.age})</span>
                <span class="ai-desc">Lahir di ${kc.flag} ${kc.name} • Mewarisi bahagian harta anda</span>
              </span>
              <span class="ai-right">Sambung →</span>
            </button>
          `;
        }).join('')}
      </div>
    ` : '';

    this.open({
      icon: '🕊️',
      title: 'Penghujung Perjalanan',
      subtitle: `${s.name} • Gen ${s.generation || 1} (${s.year - s.age} – ${s.year})`,
      locked: true,
      bodyHtml: `
        <div class="ribbon-hero">
          <div style="font-size:40px;line-height:1;">${ribbon.icon}</div>
          <h3 style="margin:6px 0 2px;font-family:'Outfit',sans-serif;">${Utils.escapeHtml(s.name)}</h3>
          <div style="font-size:12.5px;opacity:0.85;">Meninggal dunia pada umur ${s.age} tahun di ${s.city}, ${c.name} ${c.flag}</div>
          <div class="ribbon-badge">🏆 Reben: ${ribbon.name}</div>
          <div style="font-size:12px;margin-top:8px;opacity:0.9;">${Utils.escapeHtml(ribbon.desc)}</div>
        </div>
        <div class="summary-grid">
          <div class="summary-stat">
            <span class="lbl">Tempat Lahir</span>
            <span class="val">${birthC.flag} ${birthC.name}</span>
          </div>
          <div class="summary-stat">
            <span class="lbl">Negara Didiami</span>
            <span class="val">${s.countriesLivedIn.map(id => Utils.getCountry(id).flag).join(' ')} (${s.countriesLivedIn.length})</span>
          </div>
          <div class="summary-stat">
            <span class="lbl">Nilai Harta Akhir</span>
            <span class="val">${Utils.formatMoney(GameState.getNetWorth(), s.countryId, true)}</span>
          </div>
          <div class="summary-stat">
            <span class="lbl">Kewarganegaraan</span>
            <span class="val">${s.citizenships.map(id => Utils.getCountry(id).flag).join(' ')}</span>
          </div>
          <div class="summary-stat" style="grid-column: span 2;">
            <span class="lbl">Pegangan / Kepercayaan Akhir</span>
            <span class="val">${GameState.getBeliefObj(s.belief).icon} ${GameState.getBeliefObj(s.belief).name}</span>
          </div>
        </div>
        ${kidsHtml}
        <button class="primary-btn" id="btn-death-new-life">✨ Mula Kehidupan Baru</button>
      `
    });

    document.querySelectorAll('.continue-kid-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.LegalInheritanceEngine) {
          this.showEstateStatementModal(btn.dataset.kidId);
          return;
        }
        const next = GameState.continueAsChild(btn.dataset.kidId);
        if (next) {
          this.close(true);
          App.renderAll();
          App.toast(`Menyambung legasi sebagai ${next.name} (Gen ${next.generation})!`, 'culture');
        }
      });
    });

    document.getElementById('btn-death-new-life').addEventListener('click', () => {
      GameState.clearSave();
      this.close(true);
      App.showStartScreen();
    });
  },

  // --------------------------------------------------------------------------
  // 7. MODAL BINCANG HIJRAH BERSAMA PASANGAN (WAJIB BAGI PEMAIN BERKAHWIN)
  // --------------------------------------------------------------------------
  showSpouseMigrationDiscussionModal(destCountryId, visaType = 'work', stateOverride = null) {
    const s = GameState.current;
    if (!s) return;
    const spouse = Sim.getMarriedSpouse ? Sim.getMarriedSpouse(s) : null;
    if (!spouse) {
      const res = Sim.migrateToCountry(destCountryId, visaType);
      if (res.ok) {
        this.close(true);
        App.renderAll();
        App.toast(res.msg, 'culture');
      } else {
        App.toast(res.msg, 'error');
      }
      return;
    }

    const fromC = Utils.getCountry(s.countryId);
    const toC = Utils.getCountry(destCountryId);
    const kids = Sim.getDependentChildren ? Sim.getDependentChildren(s) : [];
    const costLocal = Sim.getMigrationCostLocal(destCountryId);

    if (s.money < costLocal) {
      App.toast(`Anda perlukan ${Utils.formatMoney(costLocal, s.countryId)} untuk tiket & yuran visa ke ${toC.name}.`, 'error');
      return;
    }

    const roll = stateOverride || Sim.rollSpouseMigrationDecision(s, destCountryId);
    const agreed = Boolean(roll.agreed);
    const persuasionUsed = Boolean(roll.persuasionUsed);
    const syariah = window.LegalInheritanceEngine && LegalInheritanceEngine.isSyariahApplicable(s);
    const courtLabel = syariah ? 'Mahkamah Syariah' : `Mahkamah Sivil ${fromC.name}`;

    let bodyHtml = `
      <div class="info-banner highlight" style="line-height:1.6;">
        <strong>✈️ Cadangan Hijrah: ${fromC.flag} ${Utils.escapeHtml(fromC.name)} → ${toC.flag} ${Utils.escapeHtml(toC.name)}</strong><br/>
        Pasangan: <strong>${Utils.escapeHtml(spouse.name)}</strong> (${Utils.escapeHtml(spouse.role)}, Kemesraan ${spouse.closeness ?? 70}%, Kepercayaan ${spouse.trust ?? 70}%)<br/>
        Anak Tanggungan (Umur &lt; 18): <strong>${kids.length > 0 ? `${kids.length} orang (${kids.map(k => Utils.escapeHtml(k.name)).join(', ')})` : 'Tiada'}</strong>
      </div>
    `;

    if (agreed) {
      bodyHtml += `
        <div class="info-banner" style="background:#f0fdf4;border-color:#86efac;color:#166534;line-height:1.6;">
          <strong>💚 ${Utils.escapeHtml(spouse.name)} Bersetuju Mengikut Anda!</strong><br/>
          <em>"${Utils.escapeHtml(roll.dialogue)}"</em><br/>
          <small style="opacity:0.9;">Pasangan anda${kids.length > 0 ? ` dan kesemua ${kids.length} orang anak tanggungan` : ''} akan berpindah bersama-sama ke ${Utils.escapeHtml(toC.name)}.</small>
        </div>
        <button type="button" class="primary-btn" id="btn-mig-spouse-confirm">
          ✈️ Teruskan Hijrah Sekeluarga ke ${Utils.escapeHtml(toC.name)} (${Utils.formatMoney(costLocal, s.countryId)})
        </button>
        <button type="button" class="ghost-btn" id="btn-mig-spouse-cancel" style="margin-top:8px;">← Batalkan &amp; Kembali</button>
      `;
    } else {
      bodyHtml += `
        <div class="info-banner" style="background:#fef2f2;border-color:#fecaca;color:#991b1b;line-height:1.6;">
          <strong>💔 ${Utils.escapeHtml(spouse.name)} Enggan Berhijrah ke ${Utils.escapeHtml(toC.name)}!</strong><br/>
          <em>"${Utils.escapeHtml(roll.dialogue)}"</em>
        </div>

        <div class="action-list">
          <button type="button" class="action-item" id="btn-mig-persuade" ${persuasionUsed ? 'disabled' : ''}>
            <span class="ai-icon">💬</span>
            <span class="ai-content">
              <span class="ai-title">Pujuk Pasangan</span>
              <span class="ai-desc">${persuasionUsed ? 'Cubaan memujuk telah digunakan dan gagal melembutkan hatinya' : '1 cubaan memujuk (~30%–45% peluang ikut Kemesraan, Kepercayaan & Kepintaran)'}</span>
            </span>
            <span class="ai-right">${persuasionUsed ? 'Gagal' : 'Cuba Pujuk'}</span>
          </button>

          <button type="button" class="action-item" id="btn-mig-spouse-cancel">
            <span class="ai-icon">❌</span>
            <span class="ai-content">
              <span class="ai-title">Batalkan Hijrah</span>
              <span class="ai-desc">Kekal menetap di ${Utils.escapeHtml(fromC.name)} demi menyelamatkan rumah tangga</span>
            </span>
            <span class="ai-right">Kekal</span>
          </button>

          <button type="button" class="action-item" id="btn-mig-stubborn-go" style="border-color:#fca5a5;background:#fff1f2;">
            <span class="ai-icon">✈️</span>
            <span class="ai-content">
              <span class="ai-title" style="color:#b91c1c;">Berkeras Hijrah Juga (Auto-Cerai)</span>
              <span class="ai-desc">Teruskan hijrah ke ${Utils.escapeHtml(toC.name)} — mencetuskan penceraian automatik (${Utils.escapeHtml(courtLabel)}). ${Utils.escapeHtml(spouse.name)} tinggal di ${Utils.escapeHtml(fromC.name)}, manakala anak-anak bawah umur (${kids.length} orang) ikut berpindah bersama anda!</span>
            </span>
            <span class="ai-right cost">Cerai &amp; Pergi</span>
          </button>
        </div>
      `;
    }

    this.open({
      icon: '✈️',
      title: '✈️ Bincang Hijrah Bersama Pasangan',
      subtitle: `${spouse.name} • Destinasi: ${toC.flag} ${toC.name}`,
      locked: true,
      bodyHtml
    });

    const confirmBtn = document.getElementById('btn-mig-spouse-confirm');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        const res = Sim.migrateToCountry(destCountryId, visaType, { spouseFollows: true });
        if (res.ok) {
          this.close(true);
          App.renderAll();
          App.toast(res.msg, 'culture');
          if (res.arrivalEvent) {
            setTimeout(() => this.showEvent(res.arrivalEvent), 260);
          }
        } else {
          App.toast(res.msg, 'error');
          App.renderAll();
          this.showActivities('migrate');
        }
      });
    }

    const persuadeBtn = document.getElementById('btn-mig-persuade');
    if (persuadeBtn && !persuasionUsed) {
      persuadeBtn.addEventListener('click', () => {
        const pRes = Sim.persuadeSpouseToMigrate(s, destCountryId);
        App.toast(pRes.msg, pRes.agreed ? 'success' : 'error');
        App.renderAll();
        this.showSpouseMigrationDiscussionModal(destCountryId, visaType, {
          agreed: pRes.agreed,
          dialogue: pRes.dialogue,
          persuasionUsed: true
        });
      });
    }

    const cancelBtn = document.getElementById('btn-mig-spouse-cancel');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        GameState.addJournalEntry(`🏡 Anda membatalkan hasrat berhijrah ke ${toC.name} demi menjaga keharmonian rumah tangga bersama ${spouse.name}.`);
        GameState.save();
        App.renderAll();
        App.toast(`Hijrah ke ${toC.name} dibatalkan — perkahwinan kekal utuh.`, 'culture');
        this.showActivities('migrate');
      });
    }

    const stubbornBtn = document.getElementById('btn-mig-stubborn-go');
    if (stubbornBtn) {
      stubbornBtn.addEventListener('click', () => {
        const res = Sim.migrateToCountry(destCountryId, visaType, {
          spouseFollows: false,
          stubbornAutoDivorce: true
        });
        if (res.ok) {
          this.close(true);
          App.renderAll();
          App.toast(res.msg, 'error');
          if (res.arrivalEvent) {
            setTimeout(() => this.showEvent(res.arrivalEvent), 260);
          }
        } else {
          App.toast(res.msg, 'error');
          App.renderAll();
          this.showActivities('migrate');
        }
      });
    }
  }
};
