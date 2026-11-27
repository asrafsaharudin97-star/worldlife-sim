/* ==========================================================================
   WorldLife — Modal Interaktif (Peristiwa, Kerjaya, Aset, Hijrah, Pasport)
   Bahasa Melayu
   ========================================================================== */

window.Modals = {
  locked: false,
  _slotModalReqId: 0,

  open({ icon = '✨', title, subtitle = '', bodyHtml = '', locked = false, _isSlotModalRender = false }) {
    if (!_isSlotModalRender) this._slotModalReqId += 1;
    if (window.PrisonModals && typeof PrisonModals._cleanupMiniGame === 'function') {
      PrisonModals._cleanupMiniGame();
    }
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
    this._slotModalReqId += 1;
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
        if (GameState.current && !GameState.current.alive) {
          this.close(true);
          App.renderAll();
          setTimeout(() => this.showDeathSummary(), 200);
          return;
        }
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
              <span class="ai-desc">Pergi tuisyen &amp; ulang kaji nota pelajaran</span>
            </span>
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
              <span class="ai-desc">Buat persediaan rapi untuk peperiksaan universiti</span>
            </span>
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
              <span class="ai-desc">Berikan komitmen penuh terhadap tugasan di tempat kerja</span>
            </span>
          </button>
          <button class="action-item" id="act-raise" ${s.yearlyActions.askedRaise ? 'disabled' : ''}>
            <span class="ai-icon">💰</span>
            <span class="ai-content">
              <span class="ai-title">Minta Kenaikan Gaji</span>
              <span class="ai-desc">Berunding dengan majikan untuk semakan gaji</span>
            </span>
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
    const living = s.relationships.filter(r => r.alive);

    const inPrison = Boolean(s.prison && s.prison.inPrison);
    const partnerList = living.filter(r => r.id === s.partnerId);
    const friendsList = living.filter(r => r.category === 'friend' && r.id !== s.partnerId);
    const familyList = living.filter(r => r.id !== s.partnerId && r.category !== 'friend' && r.category !== 'ex');

    let html = '<div class="action-list">';
    if (inPrison) {
      html += `
        <div class="info-banner" style="background:#fef2f2;border-color:#fecaca;color:#991b1b;line-height:1.55;margin-bottom:8px;">
          🔒 <strong>Terputus Hubungan — Anda tidak dibenarkan berjumpa keluarga, rakan, atau pasangan sehingga hari dibebaskan.</strong><br/>
          Segala pertemuan, panggilan, pemberian hadiah dan tindakan luar dikunci sepenuhnya sepanjang tempoh tahanan.
        </div>
      `;
    }
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
    if (s.age >= 7) {
      const friendSrc = s.age < 18 || s.education.stage === 'university' ? 'Sekolah / Kampus' : (s.job ? 'Tempat Kerja / Komuniti' : 'Komuniti');
      html += `
        <button class="action-item" id="btn-meet-friend" ${s.yearlyActions.meetFriend || inPrison ? 'disabled' : ''}>
          <span class="ai-icon">🤝</span>
          <span class="ai-content">
            <span class="ai-title">Kenali Rakan Baru (${friendSrc})</span>
            <span class="ai-desc">${inPrison ? 'Dikunci semasa dalam tahanan' : 'Bina lingkaran sosial untuk sokongan emosi, rujukan kerja &amp; peluang'}</span>
          </span>
          <span class="ai-right">Kenali</span>
        </button>
      `;
    }

    const minLoveAge = 16;
    if (!s.partnerId && s.age >= minLoveAge) {
      html += `
        <button class="action-item" id="btn-find-love" ${inPrison ? 'disabled' : ''}>
          <span class="ai-icon">💘</span>
          <span class="ai-content">
            <span class="ai-title">Sesi Date (${s.city}, ${c.name} ${Utils.renderFlagHtml(c.id, c.flag)})</span>
            <span class="ai-desc">${inPrison ? 'Dikunci semasa dalam tahanan' : 'Kenali calon pasangan baharu melalui Sesi Date'}</span>
          </span>
          <span class="ai-right">Sesi Date</span>
        </button>
      `;
    }
    if (s.partnerId && partnerList.length > 0) {
      html += `
        <button class="action-item" id="btn-cheat-partner" ${s.yearlyActions.cheatedThisYear || inPrison ? 'disabled' : ''}>
          <span class="ai-icon">💔</span>
          <span class="ai-content">
            <span class="ai-title">Curang dengan Orang Lain</span>
            <span class="ai-desc">${inPrison ? 'Dikunci semasa dalam tahanan' : (s.yearlyActions.cheatedThisYear ? 'Sudah bermain kayu tiga tahun ini' : 'Menjalin hubungan sulit di belakang pasangan')}</span>
          </span>
        </button>
      `;
    }
    if (s.age >= 21) {
      const adoptCost = Utils.usdToLocal(900, s.countryId);
      html += `
        <button class="action-item" id="btn-adopt-child" ${s.yearlyActions.adoptedChild || inPrison ? 'disabled' : ''}>
          <span class="ai-icon">🏡</span>
          <span class="ai-content">
            <span class="ai-title">Ambil Anak Angkat</span>
            <span class="ai-desc">${inPrison ? 'Dikunci semasa dalam tahanan' : 'Beri rumah yang penyayang kepada anak angkat baru'}</span>
          </span>
          <span class="ai-right cost">${Utils.formatMoney(adoptCost, s.countryId)}</span>
        </button>
      `;
    }
    if (s.age >= 18 && window.LegalInheritanceEngine) {
      html += `
        <button class="action-item" id="btn-open-wasiat-rel" ${inPrison ? 'disabled' : ''}>
          <span class="ai-icon">📜</span>
          <span class="ai-content">
            <span class="ai-title">Urus Wasiat &amp; Harta Pusaka</span>
            <span class="ai-desc">${inPrison ? 'Dikunci semasa dalam tahanan' : `Tetapkan Wasiat Sivil ${c.name} (Sama Rata / 1 Waris / Amal)`}</span>
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
            <span class="ai-desc">Kepercayaan ${r.trust ?? 65}%${childSchoolTag}${adoptTag}${distLabel}</span>
            <div class="rel-meter">
              <div class="rel-meter-fill" style="width:${r.closeness}%;background:${Utils.getStatColor(r.closeness)}"></div>
            </div>
          </span>
          <span class="ai-right neutral">${r.closeness}%</span>
        </button>
      `;
    }).join('');

    if (partnerList.length > 0) {
      html += `<div class="section-heading">${s.married ? '💍 Pasangan Hidup (Suami / Isteri)' : '💘 Sesi Date / Pasangan'}</div><div class="action-list">${renderList(partnerList)}</div>`;
    }

    html += `<div class="section-heading">🤝 Rakan-Rakan (${friendsList.length})</div>`;
    if (friendsList.length > 0) {
      html += `<div class="action-list">${renderList(friendsList)}</div>`;
    } else {
      html += `<div class="info-banner">Belum ada rakan rapat. Tekan "Kenali Rakan Baru" untuk mula membina lingkaran sosial anda!</div>`;
    }

    html += `<div class="section-heading">❤️ Keluarga (${familyList.length})</div><div class="action-list">${renderList(familyList)}</div>`;

    const deceasedList = Array.isArray(s.deceasedHistory) ? s.deceasedHistory : [];
    if (deceasedList.length > 0) {
      html += `<div class="section-heading">🕊️ Dalam Kenangan / Sejarah Kematian (${deceasedList.length})</div>`;
      html += `<div class="action-list">${deceasedList.map(d => `
        <div class="info-banner" style="margin-bottom:6px;">
          <strong>🕊️ ${Utils.escapeHtml(d.name)}</strong> <small style="color:#64748b;">(${Utils.escapeHtml(d.role)} • Umur ${d.age} thn)</small><br/>
          <small style="color:#475569;">Punca: ${Utils.escapeHtml(d.cause)} • Tahun ${d.year} (Umur anda: ${d.playerAge} thn)</small>
        </div>
      `).join('')}</div>`;
    }

    this.open({
      icon: '❤️',
      title: 'Hubungan & Sosial',
      subtitle: 'Keluarga, Rakan, Cinta & Perkahwinan',
      bodyHtml: html
    });

    const cheatBtn = document.getElementById('btn-cheat-partner');
    if (cheatBtn) {
      cheatBtn.addEventListener('click', () => {
        const res = Relationships.attemptCheat();
        if (res.confrontation) {
          this.showCheatConfrontationModal(res.confrontation);
          return;
        }
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showRelationships();
      });
    }

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
    const isParent = ['Ibu', 'Ayah', 'Mother', 'Father'].includes(rel.role);
    const isSibling = /Abang|Kakak|Adik|Sibling/i.test(rel.role || '');
    const isFriend = rel.category === 'friend';
    const canAskMoney = s.age >= 6 && (isParent || isPartner || isSibling || isFriend);
    const askedMoneyThisYear = Boolean(s.yearlyActions[`rel_${rel.id}_ask_money`]);
    const canStealMoney = s.age >= 7 && (isParent || isPartner || isSibling || isFriend);
    const stoleMoneyThisYear = Array.isArray(s.stoleMoneyIdsThisYear) && s.stoleMoneyIdsThisYear.includes(rel.id);
    const isChild = ['Anak Lelaki', 'Anak Perempuan', 'Son', 'Daughter'].includes(rel.role);
    if (isChild && window.Relationships && Relationships.ensureChildEducationFields) {
      Relationships.ensureChildEducationFields(s, rel);
    }
    const isMinorChild = isChild && rel.age < 18;
    const longDist = rel.countryId !== s.countryId;
    const rc = Utils.getCountry(rel.countryId);

    const stageLabel = isPartner
      ? (s.married ? 'Berkahwin' : rel.stage === 'engaged' ? 'Bertunang' : rel.stage === 'cohabiting' ? 'Tinggal Bersama' : 'Sesi Date')
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

    const inPrison = Boolean(s.prison && s.prison.inPrison);
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
      ${!inPrison ? `
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
      ` : ''}
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
        Status: <strong>${stageLabel}${hasPrenupBadge}</strong><br/>
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
      ${inPrison ? `
        <div class="info-banner" style="background:#fef2f2;border-color:#fecaca;color:#991b1b;line-height:1.55;">
          🔒 <strong>Terputus Hubungan — Anda tidak dibenarkan berjumpa keluarga, rakan, atau pasangan sehingga hari dibebaskan.</strong>
        </div>
      ` : ''}
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
      
      <div class="action-list">
        <button class="action-item rel-act-btn" data-act="spend_time" ${inPrison ? 'disabled' : ''}>
          <span class="ai-icon">${longDist ? '📱' : '☕'}</span>
          <span class="ai-content">
            <span class="ai-title">${longDist ? 'Panggilan Video & Tanya Khabar' : (isPartner && !s.married ? 'Sesi Date' : 'Luangkan Masa Bersama')}</span>
            <span class="ai-desc">${inPrison ? 'Dikunci semasa dalam tahanan' : 'Luangkan masa berkualiti bersama'}</span>
          </span>
          <span class="ai-right">Percuma</span>
        </button>
        <button class="action-item rel-act-btn" data-act="gift" ${inPrison ? 'disabled' : ''}>
          <span class="ai-icon">🎁</span>
          <span class="ai-content">
            <span class="ai-title">Beri Hadiah Istimewa</span>
            <span class="ai-desc">${inPrison ? 'Dikunci semasa dalam tahanan' : 'Berikan hadiah sebagai tanda ingatan'}</span>
          </span>
          <span class="ai-right cost">${Utils.formatMoney(Utils.usdToLocal(45, s.countryId), s.countryId)}</span>
        </button>
        ${canAskMoney ? `
          <button class="action-item rel-act-btn" data-act="ask_money" ${askedMoneyThisYear || inPrison ? 'disabled' : ''}>
            <span class="ai-icon">💸</span>
            <span class="ai-content">
              <span class="ai-title">Minta Duit</span>
              <span class="ai-desc">${inPrison ? 'Dikunci semasa dalam tahanan' : (askedMoneyThisYear ? 'Sudah meminta bantuan wang tahun ini' : 'Cuba minta bantuan wang tunai')}</span>
            </span>
          </button>
        ` : ''}
        ${canStealMoney ? `
          <button class="action-item rel-act-btn" data-act="steal_money" ${stoleMoneyThisYear || inPrison ? 'disabled' : ''}>
            <span class="ai-icon">🕵️</span>
            <span class="ai-content">
              <span class="ai-title">Curi Duit</span>
              <span class="ai-desc">${inPrison ? 'Dikunci semasa dalam tahanan' : (stoleMoneyThisYear ? 'Sudah mencuba mencuri wang daripadanya tahun ini' : 'Cuba ambil wang tunai secara senyap-senyap')}</span>
            </span>
          </button>
        ` : ''}

        ${isFriend && s.age >= 18 ? `
          <button class="action-item rel-act-btn" data-act="ask_referral" ${inPrison ? 'disabled' : ''}>
            <span class="ai-icon">💼</span>
            <span class="ai-content">
              <span class="ai-title">Minta Rujukan Kerja / Peluang Projek</span>
              <span class="ai-desc">${inPrison ? 'Dikunci semasa dalam tahanan' : 'Perlukan Kemesraan 70%+ &amp; Kepercayaan 70%+'}</span>
            </span>
            <span class="ai-right">Minta</span>
          </button>
        ` : ''}

        ${isFriend && s.age >= 6 ? `
          <button class="action-item rel-act-btn" data-act="cut_ties" ${inPrison ? 'disabled' : ''}>
            <span class="ai-icon">💔</span>
            <span class="ai-content">
              <span class="ai-title">Putus Kawan</span>
              <span class="ai-desc">${inPrison ? 'Dikunci semasa dalam tahanan' : 'Tamatkan persahabatan ini secara muktamad'}</span>
            </span>
          </button>
        ` : ''}

        ${isPartner && !s.married && rel.stage !== 'cohabiting' ? `
          <button class="action-item rel-act-btn" data-act="cohabit" ${inPrison ? 'disabled' : ''}>
            <span class="ai-icon">🏠</span>
            <span class="ai-content">
              <span class="ai-title">Tinggal Bersama</span>
              <span class="ai-desc">${inPrison ? 'Dikunci semasa dalam tahanan' : 'Tinggal sebumbung bersama pasangan (perlu kemesraan 65%+)'}</span>
            </span>
            <span class="ai-right">Percuma</span>
          </button>
        ` : ''}

        ${isPartner && !s.married && rel.stage !== 'engaged' ? `
          <button class="action-item rel-act-btn" data-act="engage" ${inPrison ? 'disabled' : ''}>
            <span class="ai-icon">💐</span>
            <span class="ai-content">
              <span class="ai-title">Bertunang</span>
              <span class="ai-desc">${inPrison ? 'Dikunci semasa dalam tahanan' : 'Langkah rasmi menuju perkahwinan (perlu kemesraan 60%+)'}</span>
            </span>
            <span class="ai-right cost">${Utils.formatMoney(Utils.usdToLocal(350, s.countryId), s.countryId)}</span>
          </button>
        ` : ''}

        ${isPartner && !s.married ? `
          <button class="action-item rel-act-btn" data-act="propose" ${inPrison ? 'disabled' : ''}>
            <span class="ai-icon">💍</span>
            <span class="ai-content">
              <span class="ai-title">Lamar &amp; Majlis Perkahwinan</span>
              <span class="ai-desc">${inPrison ? 'Dikunci semasa dalam tahanan' : 'Sah bergelar suami isteri (perlu kemesraan 70%+)'}</span>
            </span>
            <span class="ai-right cost">${Utils.formatMoney(Utils.usdToLocal(1800, s.countryId), s.countryId)}</span>
          </button>
        ` : ''}

        ${isPartner && s.married ? `
          <button class="action-item rel-act-btn" data-act="family_trip" ${inPrison ? 'disabled' : ''}>
            <span class="ai-icon">✈️</span>
            <span class="ai-content">
              <span class="ai-title">Percutian Harmoni Rumah Tangga</span>
              <span class="ai-desc">${inPrison ? 'Dikunci semasa dalam tahanan' : 'Luangkan masa bercuti bersama pasangan'}</span>
            </span>
            <span class="ai-right cost">${Utils.formatMoney(Utils.usdToLocal(450, s.countryId), s.countryId)}</span>
          </button>
        ` : ''}

        ${isPartner && s.age >= 18 ? `
          <button class="action-item rel-act-btn" data-act="have_kid" ${!s.married || inPrison ? 'disabled' : ''}>
            <span class="ai-icon">👶</span>
            <span class="ai-content">
              <span class="ai-title">Timang Cahaya Mata</span>
              <span class="ai-desc">${inPrison ? 'Dikunci semasa dalam tahanan' : (!s.married ? 'Perlu berkahwin terlebih dahulu' : `Anak akan lahir di ${Utils.getCountry(s.countryId).name} ${Utils.getCountry(s.countryId).flag}`)}</span>
            </span>
            <span class="ai-right">${!s.married ? '🔒 Kunci' : 'Rancang'}</span>
          </button>
        ` : ''}

        ${isPartner ? `
          <button class="action-item rel-act-btn" data-act="breakup" ${inPrison ? 'disabled' : ''}>
            <span class="ai-icon">💔</span>
            <span class="ai-content">
              <span class="ai-title">${s.married ? 'Cerai' : 'Putus Pasangan'}</span>
              <span class="ai-desc">${inPrison ? 'Dikunci semasa dalam tahanan' : 'Bawa haluan masing-masing'}</span>
            </span>
          </button>
        ` : ''}
        ${isChild && rel.alive ? `
          <button class="action-item" id="btn-switch-to-child" style="background:#f5f3ff;border-color:#c4b5fd;" ${inPrison ? 'disabled' : ''}>
            <span class="ai-icon">🔄</span>
            <span class="ai-content">
              <span class="ai-title">Teruskan Sebagai Anak Ini</span>
              <span class="ai-desc">${inPrison ? 'Dikunci semasa dalam tahanan' : `Serah legasi semasa hidup — kawalan berpindah ke Gen ${(s.generation || 1) + 1} sambil anda kekal hidup sebagai NPC`}</span>
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
      subtitle: `${rel.role} • ${rc.flag} ${rc.name}`,
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
        if (act === 'propose' && window.LegalInheritanceEngine) {
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

  showCheatConfrontationModal(info) {
    const titleText = info.wasMarried ? 'Konfrontasi Curang!' : 'Kantoi Curang!';
    const descText = `${info.partnerName} menemui bukti anda curang dengan orang lain dan kini bersemuka dengan anda dalam keadaan marah. Apa tindakan anda?`;

    this.open({
      icon: '💔',
      title: titleText,
      subtitle: `Bersemuka dengan ${info.partnerName}`,
      locked: true,
      bodyHtml: `
        <div class="event-text">${Utils.escapeHtml(descText)}</div>
        <div class="action-list">
          <button class="choice-btn cheat-choice-btn" data-choice="lie" style="white-space:normal;text-align:left;">
            <span class="choice-title">🤥 Tipu &amp; Berdalih</span>
          </button>
          <button class="choice-btn cheat-choice-btn" data-choice="apologize" style="white-space:normal;text-align:left;">
            <span class="choice-title">😔 Mengaku &amp; Minta Maaf</span>
          </button>
          <button class="choice-btn cheat-choice-btn" data-choice="breakup" style="white-space:normal;text-align:left;">
            <span class="choice-title">🚪 Mengaku &amp; Putus Terus</span>
          </button>
        </div>
      `
    });

    document.querySelectorAll('#modal-body .cheat-choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = Relationships.resolveCheatConfrontation(info.partnerId, btn.dataset.choice);
        this.close(true);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showRelationships();
      });
    });
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
              <span class="ai-desc">Bayar yuran tahunan di ${Utils.escapeHtml(pref.tier.short)} (${Utils.escapeHtml(pref.major.label)})</span>
            </span>
            <span class="ai-right cost">${fmt(pref.yearlyFeeLocal)}/thn</span>
          </button>

          <button type="button" class="action-item child-uni-choice-btn" data-decision="scholarship_loan">
            <span class="ai-icon">📜</span>
            <span class="ai-content">
              <span class="ai-title">Galak Mohon Biasiswa / Pinjaman</span>
              <span class="ai-desc">Anak memohon biasiswa atau pinjaman pelajaran sendiri tanpa kos kepada ibu bapa</span>
            </span>
            <span class="ai-right">Percuma</span>
          </button>

          <button type="button" class="action-item child-uni-choice-btn" data-decision="suggest_cheaper">
            <span class="ai-icon">🔄</span>
            <span class="ai-content">
              <span class="ai-title">Cadang Universiti / Bidang Lebih Murah</span>
              <span class="ai-desc">Cadangkan ${Utils.escapeHtml(pref.cheaperMajor.label)} di ${Utils.escapeHtml(pref.cheaperTier.short)}</span>
            </span>
            <span class="ai-right cost">${fmt(pref.cheaperFeeLocal)}/thn</span>
          </button>

          <button type="button" class="action-item child-uni-choice-btn" data-decision="work_immediately">
            <span class="ai-icon">💼</span>
            <span class="ai-content">
              <span class="ai-title">Suruh Terus Bekerja</span>
              <span class="ai-desc">Anak tidak ke universiti &amp; terus masuk alam pekerjaan</span>
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
              <span class="ai-desc">Berbincang dari hati ke hati untuk memujuk anak meneruskan pengajian</span>
            </span>
            <span class="ai-right">Pujuk</span>
          </button>

          <button type="button" class="action-item child-dropout-choice-btn" data-decision="respect">
            <span class="ai-icon">🤝</span>
            <span class="ai-content">
              <span class="ai-title">Hormati Keputusan Anak</span>
              <span class="ai-desc">Benarkan anak berhenti secara baik, hentikan yuran tahunan &amp; biarkan dia mula bekerja</span>
            </span>
            <span class="ai-right">Hormati</span>
          </button>

          <button type="button" class="action-item child-dropout-choice-btn" data-decision="force">
            <span class="ai-icon">😠</span>
            <span class="ai-content">
              <span class="ai-title">Bertegas &amp; Paksa Teruskan</span>
              <span class="ai-desc">Bertegas meminta anak meneruskan pengajian walaupun dia membantah</span>
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
          Watak semasa anda (<strong>${Utils.escapeHtml(s.name)}</strong>) akan terus hidup sebagai <strong>NPC ${s.gender === 'male' ? 'Bapa' : 'Ibu'}</strong> — tiada kematian, Obituari atau pembahagian harta pusaka pramatang akan berlaku sekarang.
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
  // 4B. MODAL PERJANJIAN PRA-PERKAHWINAN (PRENUP) UNTUK PERKAHWINAN SIVIL
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
      subtitle: `Pilihan Perjanjian Pra-Perkahwinan (Prenup) bersama ${rel.name}`,
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
              <span class="ai-title">Berkahwin Dengan Perjanjian Pra-Perkahwinan (Prenup)</span>
              <span class="ai-desc">Melindungi 100% aset sebelum kahwin &amp; mengecualikan Alimoni jika bercerai</span>
            </span>
            <span class="ai-right cost">${Utils.formatMoney(ringCost + prenupFee, s.countryId)}</span>
          </button>
          <button class="action-item" id="btn-marry-no-prenup">
            <span class="ai-icon">💍</span>
            <span class="ai-content">
              <span class="ai-title">Berkahwin Tanpa Prenup</span>
              <span class="ai-desc">Perkahwinan sivil biasa tanpa perjanjian pra-perkahwinan</span>
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
  // 4C. MODAL PROSIDING PENCERAIAN (MAHKAMAH SIVIL)
  // --------------------------------------------------------------------------
  showDivorceModal(partnerId, meta = {}, opts = {}) {
    const s = GameState.current;
    const partner = (s.relationships || []).find(r => r.id === partnerId);
    if (!partner || !window.LegalInheritanceEngine) {
      this.showRelationships();
      return;
    }

    const selectedMode = opts.settlementMode || 'mutual';
    const prev = LegalInheritanceEngine.previewDivorce(s, partner, { settlementMode: selectedMode });
    const fmt = (v) => Utils.formatMoney(v, s.countryId);

    this.open({
      icon: '⚖️',
      title: 'Prosiding Perceraian Sivil',
      subtitle: `${partner.name} • ${prev.courtLabel}`,
      bodyHtml: `
        <div class="info-banner" style="background:#fef2f2;border-color:#fecaca;color:#991b1b;">
          <strong>⚖️ ${prev.courtLabel}:</strong> ${Utils.escapeHtml(prev.summary)}
        </div>

        <div class="section-heading">Pilih Laluan Penyelesaian</div>
        <div class="tab-pills" style="margin-bottom:8px;">
          <button type="button" class="tab-pill div-mode-pill ${selectedMode === 'mutual' ? 'active' : ''}" data-mode="mutual">🤝 Persetujuan Bersama</button>
          <button type="button" class="tab-pill div-mode-pill ${selectedMode === 'contested' ? 'active' : ''}" data-mode="contested">⚖️ Bertikai di Mahkamah</button>
        </div>

        <div class="info-banner">
          <div>💼 Yuran Guaman: <strong>${fmt(prev.legalFeeLocal)}</strong></div>
          <div>🏠 Pembahagian Harta (${prev.splitPct}%): <strong>${fmt(prev.settlementLocal)}</strong></div>
          ${prev.alimonyAnnualLocal > 0 ? `<div>📅 Nafkah Tahunan: <strong>${fmt(prev.alimonyAnnualLocal)}/thn</strong> (${prev.alimonyYears} tahun)</div>` : '<div>✅ Tiada nafkah berkala dikenakan.</div>'}
          ${prev.hasPrenup ? '<div style="color:#16a34a;margin-top:4px;">🛡️ Perjanjian Pra-Perkahwinan (Prenup) aktif.</div>' : ''}
        </div>

        <div style="display:flex;gap:8px;margin-top:10px;">
          <button type="button" class="primary-btn" id="btn-confirm-divorce" style="flex:1;background:#dc2626;">⚖️ Sahkan Perceraian</button>
          <button type="button" class="secondary-btn" id="btn-cancel-divorce" style="flex:1;">Batal</button>
        </div>
      `
    });

    document.querySelectorAll('.div-mode-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        this.showDivorceModal(partnerId, meta, { settlementMode: pill.dataset.mode });
      });
    });

    document.getElementById('btn-cancel-divorce').addEventListener('click', () => this.showRelationships());
    document.getElementById('btn-confirm-divorce').addEventListener('click', () => {
      const res = LegalInheritanceEngine.executeDivorce(s, partnerId, { settlementMode: selectedMode });
      App.renderAll();
      App.toast(res.msg, res.ok ? 'warning' : 'error');
      this.showRelationships();
    });
  },

  showWasiatModal(onBack = null) {
    const s = GameState.current;
    if (!s || !window.LegalInheritanceEngine) return;
    LegalInheritanceEngine.ensureLegalFields(s);
    LegalInheritanceEngine.ensureFamilyTrust(s);
    const report = LegalInheritanceEngine.calculateEstateStatement(s);
    const fmt = (v) => Utils.formatMoney(v, s.countryId);
    const curMode = (s.legal.wasiat && (s.legal.wasiat.willType || s.legal.wasiat.mode)) || 'equal';
    const ft = s.familyTrust;
    const inPrison = Boolean(s.prison && s.prison.inPrison);
    const trustLocked = s.age < 18 || inPrison;
    const setupFee = LegalInheritanceEngine.getTrustSetupFee(s);
    const annualFee = LegalInheritanceEngine.getTrustAnnualFee(s);
    const trustAssetsVal = LegalInheritanceEngine.getTrustAssetsValue(s);
    const trustInvsVal = LegalInheritanceEngine.getTrustInvestmentsValue(s);
    const trustNetWorth = LegalInheritanceEngine.getTrustNetWorth(s);
    const perf = LegalInheritanceEngine.getTrustPerformancePct(s);
    const corpTaxPct = Math.round(LegalInheritanceEngine.getCorporateTaxRate(s) * 100);
    const selectedMgrYears = [1, 2, 3, 5].includes(Number(this._trustMgrYears)) ? Number(this._trustMgrYears) : 1;
    this._trustMgrYears = selectedMgrYears;
    const mgrOffers = LegalInheritanceEngine.getFundManagerOffers(s, selectedMgrYears);
    const ownedProps = (s.assets && Array.isArray(s.assets.properties)) ? s.assets.properties : [];
    const ownedVehs = (s.assets && Array.isArray(s.assets.vehicles)) ? s.assets.vehicles : [];
    const ownedInvs = Object.entries((s.assets && s.assets.portfolio) || {}).filter(([, p]) => p && p.units > 0);
    const trustAssets = Array.isArray(ft.assets) ? ft.assets : [];
    const trustInvs = Array.isArray(ft.investments) ? ft.investments.filter(h => h && h.units > 0) : [];
    const trustStatusLabel = !ft.active
      ? 'Tidak Aktif'
      : ft.lapsed
        ? '⚠️ Tergantung (Tunggakan Yuran)'
        : 'Aktif (Bebas Cukai Pusaka)';
    const trustStatusBg = !ft.active ? '#f1f5f9' : ft.lapsed ? '#fef3c7' : '#dcfce7';
    const trustStatusColor = !ft.active ? '#475569' : ft.lapsed ? '#92400e' : '#166534';
    const mgrTierLabels = { junior: 'Pengurus Dana Junior', profesional: 'Pengurus Korporat Profesional', elit: 'Pengurus Dana Elit (Padu)' };
    const perfBadge = perf.hasBaseline
      ? `<span class="cat-badge" style="background:${perf.pct >= 0 ? '#dcfce7' : '#fee2e2'};color:${perf.pct >= 0 ? '#166534' : '#991b1b'};">${perf.pct >= 0 ? '📈 +' : '📉 '}${perf.pct}%</span>`
      : `<span class="cat-badge" style="background:#f1f5f9;color:#475569;">📊 0.0%</span>`;

    this.open({
      icon: '📜',
      title: 'Pengurusan Wasiat & Yayasan Keluarga',
      subtitle: 'Undang-Undang Sivil & Tabung Yayasan Keluarga',
      bodyHtml: `
        <div class="info-banner highlight">
          <strong>🏛️ Sistem Pewarisan:</strong> ${Utils.escapeHtml(report.systemName)}<br/>
          <strong>📜 Wasiat Semasa:</strong> ${Utils.escapeHtml(LegalInheritanceEngine.getWasiatSummary(s))}<br/>
          Harta Peribadi Boleh Agih: <strong>${fmt(report.distributable)}</strong>${report.taxRatePct > 0 ? ` (Cukai Pusaka ${report.taxRatePct}%)` : ' (0% Cukai Pusaka)'}
        </div>
        ${(window.GameState && GameState.getEligibleHeirs && GameState.getEligibleHeirs(s).length === 0) ? `
          <div class="info-banner" style="background:#fffbeb;border-color:#fde68a;color:#92400e;font-size:12px;margin-top:8px;">
            ⚠️ <strong>Tiada Pewaris Aktif:</strong> Anda belum mempunyai anak kandung atau anak angkat yang masih hidup. Jika anda meninggal dunia sekarang, legasi &amp; yayasan akan tamat dan anda perlu memulakan watak baharu.
          </div>
        ` : ''}

        <div class="section-heading">🏛️ Tabung Yayasan Keluarga (Eksklusif Pewaris Pemain)</div>
        <div class="migration-card" style="border-color:${ft.active && !ft.lapsed ? '#22c55e' : ft.lapsed ? '#f59e0b' : '#cbd5e1'};margin-bottom:12px;">
          <div class="mig-head">
            <div class="mig-title">🏛️ Tabung Yayasan Keluarga</div>
            <span class="cat-badge" style="background:${trustStatusBg};color:${trustStatusColor};">${trustStatusLabel}</span>
          </div>
          ${ft.active ? (() => {
            const curC = Utils.getCountry(s.countryId);
            const isUsd = !curC || (curC.currency && curC.currency.code === 'USD') || Number(curC.usdRate) === 1;
            const rateStr = curC && typeof curC.usdRate === 'number'
              ? (curC.usdRate >= 10 ? curC.usdRate.toLocaleString('en-US', { maximumFractionDigits: 2 }) : curC.usdRate.toFixed(2))
              : '1';
            const rateLabel = isUsd
              ? 'Mata Wang Semasa: <strong>USD (Asas)</strong>'
              : `Kadar Tukaran: <strong>1 USD = ${rateStr} ${Utils.escapeHtml((curC.currency && curC.currency.code) || '')}</strong>`;
            const netUsdEq = Utils.formatUsdEquivalent ? Utils.formatUsdEquivalent(trustNetWorth, s.countryId) : null;
            const cashUsdEq = Utils.formatUsdEquivalent ? Utils.formatUsdEquivalent(ft.balance, s.countryId) : null;
            return `
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:8px 10px;margin-bottom:8px;font-size:12px;line-height:1.58;">
              <div>👑 <strong>Pengasas:</strong> ${Utils.escapeHtml(ft.founderName || s.name)} (Gen ${ft.founderGen || s.generation || 1}) • <strong>Aktif: ${ft.yearsActive || 0} tahun</strong></div>
              <div style="font-size:11px;color:#64748b;margin-top:2px;">💱 ${rateLabel}</div>
              <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:6px;flex-wrap:wrap;margin-top:5px;">
                <div>
                  <span>💰 <strong>Jumlah Nilai Bersih Yayasan:</strong> <strong style="color:#059669;">${fmt(trustNetWorth)}</strong></span>
                  ${netUsdEq ? `<div style="font-size:11px;color:#64748b;line-height:1.3;">${netUsdEq}</div>` : ''}
                </div>
                <span>Prestasi: ${perfBadge}</span>
              </div>
              <div style="font-size:11.5px;color:#475569;margin-top:5px;">
                <div>
                  Baki Tunai Yayasan: <strong>${fmt(ft.balance)}</strong>
                  ${cashUsdEq ? `<span style="font-size:10.5px;color:#64748b;margin-left:4px;">(${cashUsdEq})</span>` : ''}
                </div>
                Pelaburan (${trustInvs.length}): <strong>${fmt(trustInvsVal)}</strong> • Aset (${trustAssets.length}): <strong>${fmt(trustAssetsVal)}</strong><br/>
                Kadar Yuran Tetap: <strong>1.5% setahun</strong> (${fmt(annualFee)}/thn) • Cukai Korporat Jualan: <strong>${corpTaxPct}%</strong>
              </div>
            </div>`;
          })() : `
            <div style="font-size:12px;color:#475569;line-height:1.55;margin-bottom:10px;">
              Tubuhkan Tabung Yayasan Keluarga untuk melindungi tunai, hartanah, kenderaan &amp; pelaburan agar 100% diwarisi eksklusif oleh watak pemain generasi seterusnya (0% cukai pusaka &amp; 0% bahagian NPC).
            </div>
          `}
          ${trustLocked ? `
            <div class="info-banner" style="font-size:11.5px;margin-bottom:0;">
              🔒 Pengurusan Tabung Yayasan Keluarga hanya dibenarkan untuk umur 18+ dan di luar tahanan.
            </div>
          ` : !ft.active ? `
            <button type="button" class="primary-btn" id="btn-trust-setup" style="width:100%;">
              🏛️ Tubuhkan Yayasan Keluarga (${fmt(setupFee)})
            </button>
          ` : `
            ${ft.lapsed ? `
              <button type="button" class="primary-btn" id="btn-trust-reactivate" style="width:100%;margin-bottom:8px;background:#d97706;">
                🔄 Langsaikan Yuran &amp; Aktifkan Semula (${fmt(annualFee)})
              </button>
            ` : ''}
            <div style="display:flex;gap:6px;margin-bottom:8px;">
              <input type="number" id="input-trust-amount" class="form-input" min="1" placeholder="Jumlah (${Utils.getCountry(s.countryId).currency.symbol})" style="flex:1;padding:8px 10px;border-radius:8px;border:1px solid var(--border);background:var(--card-bg);color:var(--text);" />
            </div>
            <div style="display:flex;gap:6px;margin-bottom:10px;">
              <button type="button" class="btn-sm primary" id="btn-trust-deposit" style="flex:1;">💰 Masukkan Dana ke Yayasan</button>
              <button type="button" class="btn-sm secondary" id="btn-trust-withdraw" style="flex:1;">💵 Keluarkan Dana Yayasan</button>
            </div>

            <div class="section-heading" style="margin-top:6px;">👔 Pengurus Dana Yayasan</div>
            <div class="info-banner" style="font-size:11.5px;margin-bottom:8px;background:${ft.fundManager ? '#f0fdf4' : '#fef2f2'};border-color:${ft.fundManager ? '#86efac' : '#fca5a5'};color:${ft.fundManager ? '#166534' : '#991b1b'};">
              ${ft.fundManager
                ? `👔 Aktif: <strong>${Utils.escapeHtml(ft.fundManager.name)}</strong> (${mgrTierLabels[ft.fundManager.tier] || ft.fundManager.tier}) • <strong>Baki Kontrak: ${ft.fundManager.yearsLeft} tahun</strong>`
                : '⚠️ <strong>Tiada Pengurus Dana Aktif!</strong> Yayasan tanpa pengurus berisiko tinggi menghadapi pecah amanah dan pemantauan kerajaan.'}
            </div>
            <div class="tab-pills" style="margin-bottom:8px;">
              ${[1, 2, 3, 5].map(y => `
                <button type="button" class="tab-pill btn-trust-mgr-years ${selectedMgrYears === y ? 'active' : ''}" data-years="${y}">${y} Tahun</button>
              `).join('')}
            </div>
            <div class="action-list" style="margin-bottom:10px;">
              ${mgrOffers.map(m => `
                <button type="button" class="action-item btn-hire-trust-mgr" data-tier="${m.tier}" data-years="${m.years}">
                  <span class="ai-icon">${m.icon}</span>
                  <span class="ai-content">
                    <span class="ai-title">${Utils.escapeHtml(m.title)} (${m.years} Thn)</span>
                    <span class="ai-desc">${Utils.escapeHtml(m.desc)}</span>
                  </span>
                  <span class="ai-right cost">${fmt(m.cost)}</span>
                </button>
              `).join('')}
            </div>

            ${trustAssets.length > 0 ? `
              <div class="section-heading" style="margin-top:6px;">🏛️ Aset Dalam Yayasan (${trustAssets.length})</div>
              ${trustAssets.map(a => {
                const isProp = a.trustAssetType === 'property';
                const isCol = a.trustAssetType === 'collectible';
                const cond = Utils.clamp(typeof a.condition === 'number' ? a.condition : 80, 0, 100);
                const repairCost = isProp && window.AssetsEngine ? AssetsEngine.getPropertyRepairCost(s, a) : 0;
                return `
                  <div class="migration-card" style="padding:8px 10px;margin-bottom:8px;">
                    <div class="mig-head">
                      <div class="mig-title">${a.icon || '🏛️'} ${Utils.escapeHtml(a.name)} ${isProp && a.rented ? '<span class="cat-badge synergy">Disewakan</span>' : ''}${isCol && a.isDisplayed ? '<span class="cat-badge synergy">🏛️ Dipamerkan</span>' : ''}</div>
                      <strong>${fmt(a.value || 0)}</strong>
                    </div>
                    <div style="font-size:11.5px;color:#475569;margin-bottom:6px;">
                      ${isProp ? `Hartanah Yayasan • Kondisi: <strong>${cond}%</strong>${cond <= 50 ? ' (Perlu baik pulih >50%)' : ''}` : isCol ? 'Koleksi / Pusaka Yayasan' : 'Kenderaan Yayasan'}
                    </div>
                    <div style="display:flex;gap:5px;flex-wrap:wrap;">
                      ${isProp ? `<button type="button" class="btn-sm primary btn-trust-rent-prop" data-uid="${a.uid}" style="flex:1;">${a.rented ? 'Henti Sewa' : '🔑 Sewakan'}</button>` : ''}
                      ${isProp ? `<button type="button" class="btn-sm secondary btn-trust-repair-prop" data-uid="${a.uid}" style="flex:1;" ${cond >= 100 ? 'disabled' : ''}>🔧 Baik Pulih${cond < 100 ? ` (${fmt(repairCost)})` : ''}</button>` : ''}
                      ${isCol ? `<button type="button" class="btn-sm primary btn-trust-disp-col" data-uid="${a.uid}" style="flex:1;">${a.isDisplayed ? '📦 Henti Pamer' : '🏛️ Pamerkan'}</button>` : ''}
                      <button type="button" class="btn-sm secondary btn-trust-sell-asset" data-uid="${a.uid}" style="flex:1;color:#dc2626;">${isCol ? '🔨 Lelong' : '💵 Jual'} (Cukai ${corpTaxPct}%)</button>
                      <button type="button" class="btn-sm secondary btn-trust-out-asset" data-uid="${a.uid}" style="flex:1;">📤 Keluarkan</button>
                    </div>
                  </div>
                `;
              }).join('')}
            ` : ''}

            ${trustInvs.length > 0 ? `
              <div class="section-heading" style="margin-top:6px;">📈 Pelaburan Dalam Yayasan (${trustInvs.length})</div>
              ${trustInvs.map(h => {
                const inst = (window.AssetsData && AssetsData.INVESTMENTS) ? AssetsData.INVESTMENTS.find(x => x.id === h.instId) : null;
                const uPrice = LegalInheritanceEngine.getTrustInvestmentUnitPrice(s, h);
                const curVal = Math.round(h.units * uPrice);
                return `
                  <div class="migration-card" style="padding:8px 10px;margin-bottom:8px;">
                    <div class="mig-head">
                      <div class="mig-title">${inst ? inst.icon : '📈'} ${Utils.escapeHtml(inst ? inst.name : h.instId)}</div>
                      <strong>${fmt(curVal)}</strong>
                    </div>
                    <div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:6px;">
                      <button type="button" class="btn-sm secondary btn-trust-sell-inv" data-inst="${h.instId}" data-frac="0.25" style="flex:1;">Jual 25%</button>
                      <button type="button" class="btn-sm secondary btn-trust-sell-inv" data-inst="${h.instId}" data-frac="0.5" style="flex:1;">Jual 50%</button>
                      <button type="button" class="btn-sm primary btn-trust-sell-inv" data-inst="${h.instId}" data-frac="1" style="flex:1;">Jual 100%</button>
                      <button type="button" class="btn-sm secondary btn-trust-out-inv" data-inst="${h.instId}" style="flex:1;">📤 Keluarkan</button>
                    </div>
                  </div>
                `;
              }).join('')}
            ` : ''}

            <div class="section-heading" style="margin-top:6px;">🏠 Pindahkan Aset &amp; Pelaburan ke Yayasan</div>
            ${(ownedProps.length + ownedVehs.length + ownedInvs.length) === 0 ? `
              <div style="font-size:11.5px;color:#64748b;margin-bottom:8px;">Tiada hartanah, kenderaan atau pelaburan peribadi untuk dipindahkan.</div>
            ` : `
              <div class="action-list" style="margin-bottom:10px;">
                ${ownedProps.map(p => `
                  <button type="button" class="action-item btn-trust-in-asset" data-atype="property" data-uid="${p.uid}">
                    <span class="ai-icon">${p.icon || '🏠'}</span>
                    <span class="ai-content">
                      <span class="ai-title">${Utils.escapeHtml(p.name)}</span>
                      <span class="ai-desc">Hartanah • Nilai: ${fmt(p.value || 0)}</span>
                    </span>
                    <span class="ai-right free">Pindah →</span>
                  </button>
                `).join('')}
                ${ownedVehs.map(v => `
                  <button type="button" class="action-item btn-trust-in-asset" data-atype="vehicle" data-uid="${v.uid}">
                    <span class="ai-icon">${v.icon || '🚗'}</span>
                    <span class="ai-content">
                      <span class="ai-title">${Utils.escapeHtml(v.name)}</span>
                      <span class="ai-desc">Kenderaan • Nilai: ${fmt(v.value || 0)}</span>
                    </span>
                    <span class="ai-right free">Pindah →</span>
                  </button>
                `).join('')}
                ${ownedInvs.map(([instId, pos]) => {
                  const inst = (window.AssetsData && AssetsData.INVESTMENTS) ? AssetsData.INVESTMENTS.find(x => x.id === instId) : null;
                  const uPrice = LegalInheritanceEngine.getTrustInvestmentUnitPrice(s, { instId, units: pos.units, totalCost: pos.totalCost });
                  const val = Math.round(pos.units * uPrice);
                  return `
                  <button type="button" class="action-item btn-trust-in-inv" data-inst="${instId}">
                    <span class="ai-icon">${inst ? inst.icon : '📈'}</span>
                    <span class="ai-content">
                      <span class="ai-title">${Utils.escapeHtml(inst ? inst.name : instId)}</span>
                      <span class="ai-desc">Pelaburan • Nilai Semasa: ${fmt(val)}</span>
                    </span>
                    <span class="ai-right free">Pindah →</span>
                  </button>`;
                }).join('')}
              </div>
            `}

            <button type="button" class="ghost-btn" id="btn-trust-dissolve" style="width:100%;border-color:#fca5a5;color:#dc2626;font-weight:700;">
              ❌ Bubarkan Yayasan
            </button>
          `}
        </div>

        <div class="section-heading">Pilih Mod Pembahagian Wasiat (Harta Peribadi)</div>
        <div class="action-list">
          <button type="button" class="action-item civil-wasiat-btn" data-mode="equal">
            <span class="ai-icon">⚖️</span>
            <span class="ai-content">
              <span class="ai-title">Pembahagian Sama Rata ${curMode === 'equal' ? '✓' : ''}</span>
              <span class="ai-desc">Pasangan &amp; semua anak (kandung serta anak angkat) menerima bahagian adil</span>
            </span>
          </button>
          <button type="button" class="action-item civil-wasiat-btn" data-mode="spouse_all">
            <span class="ai-icon">💍</span>
            <span class="ai-content">
              <span class="ai-title">100% Kepada Pasangan ${curMode === 'spouse_all' ? '✓' : ''}</span>
              <span class="ai-desc">Seluruh harta pusaka peribadi diserahkan kepada pasangan hidup anda</span>
            </span>
          </button>
          <button type="button" class="action-item civil-wasiat-btn" data-mode="charity">
            <span class="ai-icon">🤝</span>
            <span class="ai-content">
              <span class="ai-title">100% Yayasan Kebajikan ${curMode === 'charity' ? '✓' : ''}</span>
              <span class="ai-desc">Dermakan seluruh harta pusaka peribadi kepada tabung kebajikan awam</span>
            </span>
          </button>
        </div>

        <button type="button" class="secondary-btn" id="btn-wasiat-back" style="width:100%;margin-top:8px;">← Kembali</button>
      `
    });

    document.querySelectorAll('.civil-wasiat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = LegalInheritanceEngine.setCivilWasiat(s, btn.dataset.mode);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showWasiatModal(onBack);
      });
    });

    const setupBtn = document.getElementById('btn-trust-setup');
    if (setupBtn) setupBtn.addEventListener('click', () => {
      const res = LegalInheritanceEngine.setupFamilyTrust(s);
      App.toast(res.msg, res.ok ? 'success' : 'error');
      App.renderAll();
      this.showWasiatModal(onBack);
    });

    const reactBtn = document.getElementById('btn-trust-reactivate');
    if (reactBtn) reactBtn.addEventListener('click', () => {
      const res = LegalInheritanceEngine.payTrustArrearsAndReactivate(s);
      App.toast(res.msg, res.ok ? 'success' : 'error');
      App.renderAll();
      this.showWasiatModal(onBack);
    });

    const depBtn = document.getElementById('btn-trust-deposit');
    if (depBtn) depBtn.addEventListener('click', () => {
      const inp = document.getElementById('input-trust-amount');
      const amt = inp && inp.value ? Number(inp.value) : Math.max(0, Math.round(s.money * 0.25));
      const res = LegalInheritanceEngine.depositFamilyTrust(s, amt);
      App.toast(res.msg, res.ok ? 'success' : 'error');
      App.renderAll();
      this.showWasiatModal(onBack);
    });

    const wdrBtn = document.getElementById('btn-trust-withdraw');
    if (wdrBtn) wdrBtn.addEventListener('click', () => {
      const inp = document.getElementById('input-trust-amount');
      const amt = inp && inp.value ? Number(inp.value) : Math.max(0, Math.round(ft.balance * 0.25));
      const res = LegalInheritanceEngine.withdrawFamilyTrust(s, amt);
      App.toast(res.msg, res.ok ? 'success' : 'error');
      App.renderAll();
      this.showWasiatModal(onBack);
    });

    document.querySelectorAll('.btn-trust-mgr-years').forEach(btn => {
      btn.addEventListener('click', () => {
        this._trustMgrYears = Number(btn.dataset.years) || 1;
        this.showWasiatModal(onBack);
      });
    });

    document.querySelectorAll('.btn-hire-trust-mgr').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = LegalInheritanceEngine.hireFundManager(s, btn.dataset.tier, Number(btn.dataset.years) || 1);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showWasiatModal(onBack);
      });
    });

    document.querySelectorAll('.btn-trust-in-asset').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = LegalInheritanceEngine.transferAssetToTrust(s, btn.dataset.atype, btn.dataset.uid);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showWasiatModal(onBack);
      });
    });

    document.querySelectorAll('.btn-trust-out-asset').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = LegalInheritanceEngine.withdrawAssetFromTrust(s, btn.dataset.uid);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showWasiatModal(onBack);
      });
    });

    document.querySelectorAll('.btn-trust-in-inv').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = LegalInheritanceEngine.transferInvestmentToTrust(s, btn.dataset.inst);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showWasiatModal(onBack);
      });
    });

    document.querySelectorAll('.btn-trust-out-inv').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = LegalInheritanceEngine.withdrawInvestmentFromTrust(s, btn.dataset.inst);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showWasiatModal(onBack);
      });
    });

    document.querySelectorAll('.btn-trust-rent-prop').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = LegalInheritanceEngine.toggleRentTrustProperty(s, btn.dataset.uid);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showWasiatModal(onBack);
      });
    });

    document.querySelectorAll('.btn-trust-repair-prop').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = LegalInheritanceEngine.repairTrustProperty(s, btn.dataset.uid);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showWasiatModal(onBack);
      });
    });

    document.querySelectorAll('.btn-trust-disp-col').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = LegalInheritanceEngine.toggleDisplayTrustCollectible(s, btn.dataset.uid);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showWasiatModal(onBack);
      });
    });

    document.querySelectorAll('.btn-trust-sell-asset').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = LegalInheritanceEngine.sellTrustAsset(s, btn.dataset.uid);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showWasiatModal(onBack);
      });
    });

    document.querySelectorAll('.btn-trust-sell-inv').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = LegalInheritanceEngine.sellTrustInvestment(s, btn.dataset.inst, Number(btn.dataset.frac) || 1);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showWasiatModal(onBack);
      });
    });

    const disBtn = document.getElementById('btn-trust-dissolve');
    if (disBtn) disBtn.addEventListener('click', () => {
      const res = LegalInheritanceEngine.dissolveFamilyTrust(s);
      App.toast(res.msg, res.ok ? 'culture' : 'error');
      App.renderAll();
      this.showWasiatModal(onBack);
    });

    document.getElementById('btn-wasiat-back').addEventListener('click', () => {
      if (typeof onBack === 'function') onBack();
      else this.close();
    });
  },

  showRoyalHonorOfferModal(offer, onDone = null) {
    const s = GameState.current;
    if (!s || !offer || !window.CharacterStatus) {
      if (typeof onDone === 'function') onDone();
      return;
    }
    const fmt = (v) => Utils.formatMoney(v, s.countryId);
    const a = s.alignment || {};
    const stats = s.stats || {};
    const netWorth = (window.GameState && GameState.getPersonalNetWorth) ? GameState.getPersonalNetWorth(s) : (s.money || 0);
    const wealth = Math.max(0, netWorth || 0);

    this.open({
      icon: offer.icon || '🏅',
      title: 'Istiadat Pengurniaan Darjah Kebesaran',
      subtitle: `Tawaran Gelaran "${offer.title}"`,
      bodyHtml: `
        <div class="info-banner highlight" style="background:linear-gradient(135deg,#fffbeb,#fef3c7);border-color:#f59e0b;color:#78350f;">
          <div style="font-size:15px;font-weight:800;margin-bottom:4px;">${offer.icon} Tahniah! Anda Layak Dianugerahkan Gelaran "${Utils.escapeHtml(offer.title)}"</div>
          <div style="font-size:13px;line-height:1.45;">${Utils.escapeHtml(offer.desc)}</div>
        </div>

        <div class="section-heading">Syarat Kelayakan Yang Dipenuhi</div>
        <div class="info-banner" style="font-size:12.5px;line-height:1.6;">
          ⭐ Populariti: <strong>${a.fame || 0}%</strong> (&gt; 70%) ✓<br/>
          ✨ Penampilan: <strong>${stats.looks || 0}%</strong> (&gt; 50%) ✓<br/>
          🚔 Haba Polis: <strong>${a.notoriety || 0}%</strong> (= 0%) ✓<br/>
          ⚖️ Karma: <strong>${(a.karma || 0) >= 0 ? '+' : ''}${a.karma || 0}</strong> (Baik) ✓<br/>
          💰 Harta Peribadi Semasa: <strong>${fmt(wealth)}</strong> (${Utils.escapeHtml(offer.wealthLabel)}) ✓
        </div>

        <div style="display:flex;flex-direction:column;gap:8px;margin-top:12px;">
          <button type="button" class="primary-btn" id="btn-accept-royal-honor" style="width:100%;">
            ${offer.icon} Terima Gelaran ${Utils.escapeHtml(offer.title)}
          </button>
          <button type="button" class="secondary-btn" id="btn-decline-royal-honor" style="width:100%;">
            🙏 Tolak Pangkat Ini
          </button>
        </div>
      `
    });

    document.getElementById('btn-accept-royal-honor').addEventListener('click', () => {
      CharacterStatus.acceptRoyalHonor(s, offer);
      App.toast(`Tahniah! Gelaran ${offer.title} kini terpapar di dashboard anda!`, 'success');
      App.renderAll();
      this.close();
      if (typeof onDone === 'function') onDone();
    });

    document.getElementById('btn-decline-royal-honor').addEventListener('click', () => {
      CharacterStatus.declineRoyalHonor(s, offer);
      App.toast(`Anda menolak pangkat ${offer.title} dengan penuh rendah diri.`, 'info');
      App.renderAll();
      this.close();
      if (typeof onDone === 'function') onDone();
    });
  },

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

    const jurisdictionBadge = `<div class=\"info-banner\" style=\"background:#eff6ff;border-color:#bfdbfe;margin-bottom:8px;font-weight:700;\">⚖️ Sistem Pewarisan: ${Utils.escapeHtml(report.systemName || 'Undang-Undang Sivil & Wasiat')}</div>`;

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
          ${report.estateTax > 0 ? `Tolak Cukai Pusaka ${Utils.escapeHtml(report.countryName)} (${report.estateTaxRate}%): <strong style="color:#dc2626;">-${fmt(report.estateTaxAmount)}</strong><br/>` : ''}
          Status Wasiat: <strong>${Utils.escapeHtml(report.wasiatLabel)}</strong><br/>
          <strong>Jumlah Diagihkan Kepada Waris: ${fmt(report.distributableEstate)}</strong>
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
    // Semasa ditahan, semua aktiviti dunia luar disembunyikan sepenuhnya
    if (s && s.prison && s.prison.inPrison && s.prison.yearsLeft > 0 && window.PrisonModals) {
      PrisonModals.showDetentionActivities();
      return;
    }
    const c = Utils.getCountry(s.countryId);

    const tabsHtml = `
      <div class="tab-pills">
        <button class="tab-pill ${activeSubTab === 'deck' ? 'active' : ''}" data-sub="deck">🎲 Dek Aktiviti</button>
        <button class="tab-pill ${activeSubTab === 'culture' ? 'active' : ''}" data-sub="culture">${Utils.renderFlagHtml(c.id, c.flag)} Budaya</button>
        <button class="tab-pill ${activeSubTab === 'migrate' ? 'active' : ''}" data-sub="migrate">✈️ Hijrah</button>
        <button class="tab-pill ${activeSubTab === 'passport' ? 'active' : ''}" data-sub="passport">🛂 Pasport</button>
        <button class="tab-pill ${activeSubTab === 'lifestyle' ? 'active' : ''}" data-sub="lifestyle">💪 Gaya Hidup</button>
        <button class="tab-pill ${activeSubTab === 'crime' ? 'active' : ''}" data-sub="crime">🕶️ Jenayah</button>
      </div>
    `;

    let contentHtml = '';

    if (activeSubTab === 'deck' && window.LegacyModals && LegacyModals.renderDynamicActivitiesTab) {
      contentHtml += LegacyModals.renderDynamicActivitiesTab(s, c);
    } else if (activeSubTab === 'culture') {
      const adapt = GameState.getCurrentAdaptation();
      const parentCovers = s.age < 18 && GameState.hasLivingParent(s);
      const cultureDone = Boolean(s.cultureVisitedThisYear);
      contentHtml += `
        <div class="info-banner culture-box">
          <strong>${Utils.renderFlagHtml(c.id, c.flag)} Kehidupan di ${s.city}, ${c.name}</strong><br/>
          ${Utils.escapeHtml(c.tagline)}<br/>
          ${s.countryId !== s.birthCountryId ? `<div style="margin-top:5px;">🌍 Penyesuaian Budaya: <strong>${adapt}%</strong> (Sertai budaya tempatan untuk layak memohon PR/Warganegara!)</div>` : ''}
        </div>
        <div class="action-list">
          ${c.cultureActivities.map(act => {
            const done = cultureDone || Boolean(s.yearlyActions[act.id]);
            return `
            <button class="action-item culture-act-btn" data-act-id="${act.id}" ${done ? 'disabled' : ''}>
              <span class="ai-icon">${act.icon}</span>
              <span class="ai-content">
                <span class="ai-title">${Utils.escapeHtml(act.title)}</span>
                <span class="ai-desc">${done ? 'Selesai tahun ini' : Utils.escapeHtml(act.desc)}</span>
              </span>
              <span class="ai-right cost">${done ? 'Selesai tahun ini' : (parentCovers ? 'Mak Ayah Bayar' : Utils.formatMoney(act.cost, s.countryId))}</span>
            </button>
          `;
          }).join('')}
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
              <span class="ai-title">Bercuti Pulang ke ${home.name} ${Utils.renderFlagHtml(home.id, home.flag)}</span>
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

      const displayName = window.CharacterStatus ? CharacterStatus.getDisplayNameWithTitles(s) : s.name;
      const occ = window.CharacterStatus ? CharacterStatus.getDisplayOccupation(s) : { title: 'Tiada Pekerjaan', badge: '—', secondaryRole: null };
      const inc = window.CharacterStatus ? CharacterStatus.getTotalAnnualIncome(s) : { grossLocal: 0, netLocal: 0, breakdown: [] };
      const incBreakdownStr = inc.breakdown.length > 0
        ? `<br/><small style="opacity:0.85;">Sumber: ${inc.breakdown.map(b => `${b.icon} ${Utils.escapeHtml(b.label)} (${Utils.formatMoney(b.gross, s.countryId)}/thn)`).join(' • ')}</small>`
        : '';

      const wasiatSummary = (window.LegalInheritanceEngine && LegalInheritanceEngine.getWasiatSummary)
        ? LegalInheritanceEngine.getWasiatSummary(s)
        : ((s.legal && s.legal.wasiat && s.legal.wasiat.mode) ? `Mod Wasiat: ${s.legal.wasiat.mode}` : 'Pembahagian Sama Rata');

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
          Status Perkahwinan: <strong>${s.married ? '💍 Berkahwin' : (s.maritalStatus ? `🕊️ ${Utils.escapeHtml(s.maritalStatus)}` : 'Bujang')}</strong><br/>
          Status Wasiat: <strong>${Utils.escapeHtml(wasiatSummary)}</strong><br/>
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


      if (!isCitizen) {
        const nextStep = s.residencyStatus === 'PR' ? `Warganegara ${c.name}` : `Penduduk Tetap (PR)`;
        const reqYears = s.residencyStatus === 'PR' ? 20 : 7;
        const reqText = s.residencyStatus === 'PR'
          ? `Memerlukan 20+ tahun menetap (${s.yearsInCurrentCountry}/20 thn) & 65%+ Penyesuaian Budaya`
          : `Memerlukan 7+ tahun menetap (${s.yearsInCurrentCountry}/7 thn) & 40%+ Penyesuaian Budaya`;
        const renewalInfo = (window.Sim && Sim.getImmigrationRenewalInfo) ? Sim.getImmigrationRenewalInfo(s) : { applies: false };
        const renewalHtml = renewalInfo && renewalInfo.applies ? `
          <div style="margin-top:6px;padding-top:6px;border-top:1px dashed #cbd5e1;font-size:11.5px;color:#334155;">
            🔄 Pembaharuan ${Utils.escapeHtml(renewalInfo.label)}: <strong>setiap ${renewalInfo.intervalYears} tahun</strong> (auto-tolak)<br/>
            ⏳ Pembaharuan Seterusnya: <strong>${renewalInfo.yearsUntilRenewal} tahun lagi</strong> (Umur ${renewalInfo.nextRenewalAge}) • Anggaran Yuran: <strong>${Utils.formatMoney(renewalInfo.feeLocal, s.countryId)}</strong>
          </div>
        ` : '';
        contentHtml += `
          <div class="info-banner culture-box">
            <strong>🌍 Penyesuaian Budaya di ${c.name}: ${adapt}%</strong><br/>
            Langkah Seterusnya: <strong>Mohon ${nextStep}</strong><br/>
            <small>${reqText}</small>
            ${renewalHtml}
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
      const usedActs = Array.isArray(s.yearlyActions.usedActivitiesThisYear) ? s.yearlyActions.usedActivitiesThisYear : [];
      const docPubDone = usedActs.includes('doc_pub');
      const docPrivDone = usedActs.includes('doc_priv');
      const canAffordPub = c.healthcare.doctorCost === 0 || s.money >= c.healthcare.doctorCost;
      const canAffordPriv = c.healthcare.privateCost === 0 || s.money >= c.healthcare.privateCost;
      const canAffordGym = s.age < 18 || s.money >= gymCost;
      const canAffordVac = s.money >= vacationCost;
      const canAffordTherapy = s.age < 18 || s.money >= therapyCost;
      const canAffordCharity = s.age < 18 || s.money >= charityCost;
      contentHtml += `
        <div class="section-heading">🏥 Kesihatan di ${c.name} (${c.healthcare.type})</div>
        <div class="info-banner">${Utils.escapeHtml(c.healthcare.desc)}</div>
        <div class="info-banner" style="border-left:3px solid ${stressColor};margin-top:6px;">
          <div>🧠 <strong>Tahap Stres Semasa: ${curStress}%</strong> — <span style="color:${stressColor};font-weight:700;">${stressTierLabel}</span></div>
          ${activeStressIllnesses}
        </div>
        <div class="action-list">
          <button class="action-item" id="btn-open-hospital" style="border-color:${Array.isArray(s.illnesses) && s.illnesses.length > 0 ? '#ef4444' : '#3b82f6'};">
            <span class="ai-icon">🏥</span>
            <span class="ai-content">
              <span class="ai-title">Hospital &amp; Klinik${Array.isArray(s.illnesses) && s.illnesses.length > 0 ? ` (${s.illnesses.length} Penyakit Aktif)` : ''}</span>
              <span class="ai-desc">${(s.prison && s.prison.inPrison) ? 'Klinik Penjara — rawatan asas semasa dalam tahanan' : 'Pemeriksaan kesihatan, Klinik Awam, Hospital Pakar Swasta, rawatan penyakit &amp; Cuti Sakit (MC)'}</span>
            </span>
            <span class="ai-right">${Array.isArray(s.illnesses) && s.illnesses.length > 0 ? 'Rawat →' : 'Buka →'}</span>
          </button>
        </div>

        <div class="section-heading">🧘‍♂️ Pengurusan Stres &amp; Kesihatan Mental</div>
        <div class="action-list">
          <button class="action-item" id="act-gym" ${s.yearlyActions.gym || !canAffordGym ? 'disabled' : ''}>
            <span class="ai-icon">🏃‍♂️</span>
            <span class="ai-content">
              <span class="ai-title">Bersenam / Joging</span>
              <span class="ai-desc">${s.yearlyActions.gym ? 'Selesai tahun ini' : 'Lakukan aktiviti kecergasan fizikal secara aktif'}</span>
            </span>
            <span class="ai-right cost">${s.yearlyActions.gym ? 'Selesai tahun ini' : (s.age < 18 ? 'Percuma' : Utils.formatMoney(gymCost, s.countryId))}</span>
          </button>
          <button class="action-item" id="act-vacation-rest" ${s.yearlyActions.vacationRest || !canAffordVac ? 'disabled' : ''}>
            <span class="ai-icon">🏖️</span>
            <span class="ai-content">
              <span class="ai-title">Bercuti / Rehat</span>
              <span class="ai-desc">${s.yearlyActions.vacationRest ? 'Selesai tahun ini' : 'Luangkan masa bercuti &amp; rehatkan minda'}</span>
            </span>
            <span class="ai-right cost">${s.yearlyActions.vacationRest ? 'Selesai tahun ini' : Utils.formatMoney(vacationCost, s.countryId)}</span>
          </button>
          <button class="action-item" id="act-counseling" ${s.yearlyActions.counselingTherapy || !canAffordTherapy ? 'disabled' : ''}>
            <span class="ai-icon">🛋️</span>
            <span class="ai-content">
              <span class="ai-title">Sesi Kaunseling / Terapi</span>
              <span class="ai-desc">${s.yearlyActions.counselingTherapy ? 'Selesai tahun ini' : 'Dapatkan bantuan pakar psikologi untuk kesejahteraan mental'}</span>
            </span>
            <span class="ai-right cost">${s.yearlyActions.counselingTherapy ? 'Selesai tahun ini' : (s.age < 18 ? 'Percuma' : Utils.formatMoney(therapyCost, s.countryId))}</span>
          </button>
          <button class="action-item" id="act-family-hobby" ${s.yearlyActions.familyHobby ? 'disabled' : ''}>
            <span class="ai-icon">🎨</span>
            <span class="ai-content">
              <span class="ai-title">Luangkan Masa Bersama Keluarga / Hobi</span>
              <span class="ai-desc">${s.yearlyActions.familyHobby ? 'Selesai tahun ini' : 'Aktiviti santai bersama orang tersayang &amp; hobi kegemaran'}</span>
            </span>
            <span class="ai-right">${s.yearlyActions.familyHobby ? 'Selesai tahun ini' : 'Percuma'}</span>
          </button>
          <button class="action-item" id="act-meditate" ${s.yearlyActions.meditate ? 'disabled' : ''}>
            <span class="ai-icon">🧘</span>
            <span class="ai-content">
              <span class="ai-title">Tenangkan Fikiran di Taman</span>
              <span class="ai-desc">${s.yearlyActions.meditate ? 'Selesai tahun ini' : 'Ambil angin segar &amp; tenangkan fikiran di taman'}</span>
            </span>
            <span class="ai-right">${s.yearlyActions.meditate ? 'Selesai tahun ini' : 'Percuma'}</span>
          </button>
        </div>

        <div class="section-heading">💪 Minda &amp; Pembangunan Diri</div>
        <div class="action-list">
          <button class="action-item" id="act-community-charity" ${s.yearlyActions.communityCharity || !canAffordCharity ? 'disabled' : ''}>
            <span class="ai-icon">🤝</span>
            <span class="ai-content">
              <span class="ai-title">Sukarelawan &amp; Kebajikan Komuniti</span>
              <span class="ai-desc">${s.yearlyActions.communityCharity ? 'Selesai tahun ini' : 'Luangkan masa membantu komuniti setempat dan menyumbang kepada kebajikan'}</span>
            </span>
            <span class="ai-right cost">${s.yearlyActions.communityCharity ? 'Selesai tahun ini' : (s.age < 18 ? 'Percuma' : Utils.formatMoney(charityCost, s.countryId))}</span>
          </button>
          <button class="action-item" id="act-library" ${s.yearlyActions.library ? 'disabled' : ''}>
            <span class="ai-icon">📚</span>
            <span class="ai-content">
              <span class="ai-title">Ke Perpustakaan Awam</span>
              <span class="ai-desc">${s.yearlyActions.library ? 'Selesai tahun ini' : 'Luangkan masa membaca bahan ilmiah di perpustakaan'}</span>
            </span>
            <span class="ai-right">${s.yearlyActions.library ? 'Selesai tahun ini' : 'Percuma'}</span>
          </button>
        </div>

        ${(s.age >= 18 || (s.age >= 16 && !(s.licenses && s.licenses.moto && s.licenses.car))) ? `
          <div class="section-heading">🏛️ Perkhidmatan &amp; Urusan Rasmi</div>
          <div class="action-list">
            ${s.age >= 18 ? `
              <button class="action-item" id="btn-open-loans" style="border-color:${Array.isArray(s.loans) && s.loans.length > 0 ? '#f59e0b' : '#3b82f6'};">
                <span class="ai-icon">💳</span>
                <span class="ai-content">
                  <span class="ai-title">Pinjaman &amp; Hutang${Array.isArray(s.loans) && s.loans.length > 0 ? ` (${s.loans.length} Aktif)` : ''}</span>
                  <span class="ai-desc">Pinjaman Bank, Skor Kredit, Pinjaman Ah Long &amp; bayaran ansuran hutang</span>
                </span>
                <span class="ai-right">Buka →</span>
              </button>
            ` : ''}
            ${s.age >= 16 && !(s.licenses && s.licenses.moto && s.licenses.car) ? `
              <button class="action-item" id="act-driving-test" ${s.prison && s.prison.inPrison ? 'disabled' : ''}>
                <span class="ai-icon">🪪</span>
                <span class="ai-content">
                  <span class="ai-title">Ambil Lesen Memandu</span>
                  <span class="ai-desc">Lesen Motosikal (16+) &amp; Lesen Kereta (17+) di Institut Memandu</span>
                </span>
                <span class="ai-right">Buka →</span>
              </button>
            ` : ''}
          </div>
        ` : ''}
      `;
    } else if (activeSubTab === 'crime') {
      const crimeOpts = s.age >= 14 ? Sim.getYearlyCrimeOptions(s) : [];
      const doneIds = Array.isArray(s.yearlyActions.crimesDoneIds) ? s.yearlyActions.crimesDoneIds : [];
      const usedAttempts = s.yearlyActions.crimeCount || 0;
      const maxAttempts = 3;
      const crimesDoneTotal = s.crimesCommitted || 0;
      const crimRep = s.criminalRep || 0;
      const heat = (s.alignment && s.alignment.notoriety) || 0;
      const isMafiaMember = Boolean(s.activeSpecialMode && s.activeSpecialMode.modeId === 'mafia');
      const spInfo = isMafiaMember && window.SpecialModesEngine ? SpecialModesEngine.getActiveInfo(s) : null;

      const mafiaCardHtml = isMafiaMember && spInfo ? `
        <button class="action-item" id="act-open-mafia-panel">
          <span class="ai-icon">🕶️</span>
          <span class="ai-content">
            <span class="ai-title">Panel Sindiket Mafia • ${Utils.escapeHtml(spInfo.rank.title)}</span>
            <span class="ai-desc">Pangkat ${spInfo.state.rankIndex + 1}/${spInfo.def.ranks.length} • Reputasi Ketua: ${spInfo.state.metric1}% • Buka Misi, Sumbangan &amp; Keluar Mafia</span>
          </span>
          <span class="ai-right"><span class="act-status-pill free">Buka Panel →</span></span>
        </button>
      ` : s.age < 18 ? `
        <button class="action-item" disabled>
          <span class="ai-icon">🕶️</span>
          <span class="ai-content">
            <span class="ai-title">Sertai Mafia / Sindiket</span>
            <span class="ai-desc">Laluan organisasi jenayah terancang</span>
          </span>
          <span class="ai-right"><span class="act-status-pill done">Terbuka umur 18+</span></span>
        </button>
      ` : `
        <button class="action-item" id="act-join-mafia" ${s.yearlyActions.mafiaApply ? 'disabled' : ''}>
          <span class="ai-icon">🕶️</span>
          <span class="ai-content">
            <span class="ai-title">Cuba Sertai Mafia / Sindiket</span>
            <span class="ai-desc">${s.yearlyActions.mafiaApply ? 'Cubaan tahun ini sudah digunakan (had 1x setahun)' : 'Mohon menyertai organisasi Mafia (peluang rawak • had 1x setahun)'}</span>
          </span>
          <span class="ai-right"><span class="act-status-pill ${s.yearlyActions.mafiaApply ? 'done' : 'free'}">${s.yearlyActions.mafiaApply ? 'Selesai tahun ini' : 'Cuba Sertai →'}</span></span>
        </button>
      `;

      contentHtml += `
        <div class="info-banner" style="border-left:4px solid #334155;">
          <strong>🕶️ Jenayah &amp; Aktiviti Gelap</strong><br/>
          <span style="font-size:12px;">Operasi Berjaya: <strong>${crimesDoneTotal}</strong> • Reputasi Gelap: <strong>${crimRep}%</strong> • Haba Polis: <strong>${heat}%</strong></span>
        </div>
        ${heat > 0 ? `
          <div class="action-list" style="margin-bottom:10px;">
            <button type="button" class="action-item" id="btn-cool-police-heat" ${s.yearlyActions.coolHeatTried ? 'disabled' : ''}>
              <span class="ai-icon">🕵️</span>
              <span class="ai-content">
                <span class="ai-title">Aktiviti Rawak Kurangkan Haba Polis</span>
                <span class="ai-desc">${s.yearlyActions.coolHeatTried ? 'Sudah dicuba tahun ini' : 'Cuba aktiviti rawak untuk sejukkan haba polis (mungkin berkurangan atau tiada perubahan)'}</span>
              </span>
            </button>
          </div>
        ` : ''}
        <div class="section-heading">🕶️ Sindiket Mafia</div>
        <div class="action-list" style="margin-bottom:10px;">
          ${mafiaCardHtml}
        </div>
        ${s.age >= 14 ? `
          <div class="section-heading">Pilihan Aktiviti Gelap Tahun Ini (Percubaan: ${usedAttempts}/${maxAttempts})</div>
          <div class="action-list">
            ${crimeOpts.map(cr => {
              const isDone = doneIds.includes(cr.id) || usedAttempts >= maxAttempts;
              return `
                <button class="action-item crime-btn" data-crime="${cr.id}" ${isDone ? 'disabled' : ''}>
                  <span class="ai-icon">${cr.icon}</span>
                  <span class="ai-content">
                    <span class="ai-title">${Utils.escapeHtml(cr.title)}</span>
                    <span class="ai-desc">${Utils.escapeHtml(cr.desc)}</span>
                  </span>
                </button>
              `;
            }).join('')}
          </div>
        ` : `<div class="info-banner">Aktiviti jenayah jalanan dibuka pada umur 14+, manakala Sindiket Mafia terbuka pada umur 18+.</div>`}
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

    const openHospitalBtn = document.getElementById('btn-open-hospital');
    if (openHospitalBtn) openHospitalBtn.addEventListener('click', () => {
      this.showHospitalModal();
    });

    const openLoansBtn = document.getElementById('btn-open-loans');
    if (openLoansBtn) openLoansBtn.addEventListener('click', () => {
      this.showLoansModal('bank');
    });

    const docPub = document.getElementById('act-doc-pub');
    if (docPub) docPub.addEventListener('click', () => {
      const res = Sim.visitDoctor(false);
      App.toast(res.msg, res.ok ? 'success' : 'error');
      App.renderAll();
      this.showActivities('lifestyle');
    });
    const docPriv = document.getElementById('act-doc-priv');
    if (docPriv) docPriv.addEventListener('click', () => {
      const res = Sim.visitDoctor(true);
      App.toast(res.msg, res.ok ? 'success' : 'error');
      App.renderAll();
      this.showActivities('lifestyle');
    });

    const charityBtn = document.getElementById('act-community-charity');
    if (charityBtn) charityBtn.addEventListener('click', () => {
      const res = Sim.doCommunityCharity();
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
      const gain = Utils.randInt(1, 3);
      GameState.adjustStats({ smarts: gain, happiness: 2 });
      GameState.addJournalEntry(`📚 Meluangkan petang yang tenang membaca di Perpustakaan Awam ${s.city}.`);
      GameState.save();
      App.renderAll();
      App.toast(`Sesi membaca selesai!`, 'success');
      this.showActivities('lifestyle');
    });

    const medBtn = document.getElementById('act-meditate');
    if (medBtn) medBtn.addEventListener('click', () => {
      s.yearlyActions.meditate = true;
      GameState.adjustStats({ happiness: 8, health: 4 });
      if (window.KarmaEndings) KarmaEndings.adjustAlignment({ stress: -6 });
      GameState.addJournalEntry(`🧘 Bertenang dan berjalan santai di taman rekreasi.`);
      GameState.save();
      App.renderAll();
      App.toast('Fikiran lebih tenang!', 'success');
      this.showActivities('lifestyle');
    });

    const driveBtn = document.getElementById('act-driving-test');
    if (driveBtn) driveBtn.addEventListener('click', () => {
      if (window.AssetModals && AssetModals.showLicenseHubModal) {
        AssetModals.showLicenseHubModal(() => this.showActivities('lifestyle'));
        return;
      }
      const res = Sim.takeDrivingTest('car');
      App.toast(res.msg, res.ok ? 'success' : 'error');
      App.renderAll();
      this.showActivities('lifestyle');
    });

    const coolHeatBtn = document.getElementById('btn-cool-police-heat');
    if (coolHeatBtn) {
      coolHeatBtn.addEventListener('click', () => {
        const res = Sim.tryRandomCoolHeatActivity();
        App.toast(res.msg, !res.ok ? 'error' : (res.unchanged ? 'info' : 'success'));
        App.renderAll();
        this.showActivities('crime');
      });
    }

    document.querySelectorAll('.crime-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = Sim.commitCrime(btn.dataset.crime);
        App.toast(res.msg, res.ok ? 'culture' : 'error');
        App.renderAll();
        if (res.arrestEvent) {
          this.showEvent(res.arrestEvent);
        } else {
          this.showActivities('crime');
        }
      });
    });

    const openMafiaPanelBtn = document.getElementById('act-open-mafia-panel');
    if (openMafiaPanelBtn) openMafiaPanelBtn.addEventListener('click', () => {
      if (window.SpecialModeModals) SpecialModeModals.showDashboard();
    });

    const joinMafiaBtn = document.getElementById('act-join-mafia');
    if (joinMafiaBtn) joinMafiaBtn.addEventListener('click', () => {
      const res = Sim.applyToJoinMafia(s);
      App.toast(res.msg, res.ok ? 'success' : 'error');
      App.renderAll();
      if (res.ok && window.SpecialModeModals) {
        SpecialModeModals.showDashboard();
      } else {
        this.showActivities('crime');
      }
    });
  },

  // --------------------------------------------------------------------------
  // 5B. PENGURUS SLOT SIMPANAN (5 SLOT + GOOGLE CLOUD SAVE)
  // --------------------------------------------------------------------------
  _formatSlotTime(ts) {
    if (!ts) return 'Baru disimpan';
    try {
      const d = new Date(ts);
      return d.toLocaleString('ms-MY', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch (e) {
      return 'Baru disimpan';
    }
  },

  async showSaveSlotsModal(confirmDeleteSlotId = null, lastOpError = null, openedFrom = null) {
    const fb = window.FirebaseService;
    const reqId = ++this._slotModalReqId;
    if (openedFrom !== null && openedFrom !== undefined) {
      this._slotModalOpenedFrom = openedFrom;
    } else if (!this._slotModalOpenedFrom) {
      this._slotModalOpenedFrom = 'main';
    }
    const backSource = this._slotModalOpenedFrom;

    this.open({
      icon: '☁️',
      title: 'Slot Simpanan & Cloud Save',
      subtitle: 'Urus sehingga 5 kehidupan berasingan (Slot 1 – Slot 5)',
      bodyHtml: `<div class="info-banner">🔄 Memuatkan senarai slot terus dari pelayan Cloud...</div>`,
      _isSlotModalRender: true
    });

    const {
      slots,
      isCloud,
      activeSlotId,
      cloudError,
      offline,
      source,
      totalBytes,
      errorDetail,
      errorMsg
    } = await GameState.getMergedSlots();
    if (reqId !== this._slotModalReqId) return;
    if (window.App && App.renderStartAuthBar) App.renderStartAuthBar();

    const formatSyncTime = (ts) => {
      if (!ts) return '';
      const d = new Date(ts);
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      return `${hh}:${mm}`;
    };
    const formatKB = (bytes) => {
      const b = Number(bytes || 0);
      if (!b || b <= 0) return '0 KB';
      if (b < 1024) return '1 KB';
      return `${Math.round(b / 1024)} KB`;
    };

    const isGuest = Boolean(window.GameState && GameState.isGuest && GameState.isGuest());
    const syncTimeStr = (isCloud && fb.syncState === 'synced' && fb.lastSyncAt) ? ` (${formatSyncTime(fb.lastSyncAt)})` : '';
    let syncBadgeText = isGuest ? '👤 Mod Tetamu (Tiada Simpanan)' : '💾 Mod Tempatan';
    let syncBadgeColor = '#475569';
    if (isCloud) {
      if (fb.syncState === 'syncing') {
        syncBadgeText = '🔄 Menyegerak...';
        syncBadgeColor = '#2563eb';
      } else if (fb.syncState === 'offline' || offline) {
        syncBadgeText = '⚠️ Mod Luar Talian';
        syncBadgeColor = '#d97706';
      } else if (fb.syncState === 'error' || cloudError) {
        syncBadgeText = `⚠️ Ralat Sync${fb.syncErrorDetail ? `: ${Utils.escapeHtml(fb.syncErrorDetail)}` : ''}`;
        syncBadgeColor = '#dc2626';
      } else if (fb.syncState === 'synced') {
        syncBadgeText = `☁️ Disegerakkan${syncTimeStr}`;
        syncBadgeColor = '#16a34a';
      } else {
        syncBadgeText = '☁️ Sedia';
        syncBadgeColor = '#475569';
      }
    }

    const backBarHtml = `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px;flex-wrap:wrap;">
        <button type="button" id="slots-btn-back" class="secondary-btn" style="padding:6px 12px;font-size:12px;font-weight:700;display:inline-flex;align-items:center;gap:5px;">
          ← Kembali${backSource === 'menu' ? ' ke Menu' : ''}
        </button>
        ${isCloud ? `<button type="button" id="slots-btn-force-sync" class="btn-sm primary" style="padding:6px 10px;font-size:11.5px;">🔄 Segerak Cloud Sekarang</button>` : ''}
      </div>
    `;

    let authBarHtml = '';
    if (isCloud) {
      const u = fb.user;
      const shortUid = (fb.getShortUid && fb.getShortUid()) || String(u.uid || '').slice(-6);
      const effectiveSource = source || fb.lastSyncSource;
      const sourceLabel = effectiveSource === 'server'
        ? 'Pelayan'
        : effectiveSource === 'cache'
          ? 'Cache'
          : '—';
      const bytesForDiag = totalBytes || fb.lastPayloadBytes || 0;
      const avatar = u.photoURL
        ? `<img src="${Utils.escapeHtml(u.photoURL)}" alt="" style="width:34px;height:34px;border-radius:999px;object-fit:cover;flex-shrink:0;" referrerpolicy="no-referrer" />`
        : `<span style="width:34px;height:34px;border-radius:999px;background:#e0e7ff;display:grid;place-items:center;font-size:16px;flex-shrink:0;">👤</span>`;
      authBarHtml = `
        <div class="info-banner" style="background:#f8fafc;">
          <div style="display:flex;align-items:center;gap:10px;min-width:0;">
            ${avatar}
            <div style="min-width:0;flex:1;">
              <div style="font-weight:700;font-size:13px;color:#0f172a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${Utils.escapeHtml(u.displayName || u.email || 'Pengguna Google')}</div>
              <div style="font-size:11.5px;font-weight:600;color:${syncBadgeColor};">${syncBadgeText}</div>
            </div>
          </div>
          <div style="margin-top:8px;padding-top:7px;border-top:1px dashed #e2e8f0;display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:11px;color:#64748b;font-weight:600;">
            <span>🪪 ID: <code style="background:#e2e8f0;color:#0f172a;padding:1px 5px;border-radius:4px;">${Utils.escapeHtml(shortUid)}</code></span>
            <span>•</span>
            <span>📡 Sumber: <strong style="color:${effectiveSource === 'server' ? '#15803d' : '#b45309'};">${sourceLabel}</strong></span>
            <span>•</span>
            <span>📦 Saiz: <strong>${formatKB(bytesForDiag)}</strong></span>
          </div>
        </div>
      `;
    } else {
      const authErr = fb && fb.lastAuthError ? fb.lastAuthError : null;
      const errHost = (authErr && authErr.hostname) || (window.location && window.location.hostname) || '';
      const errBoxHtml = authErr ? `
        <div id="slots-auth-error-box" style="margin-top:8px;padding:9px 11px;border-radius:10px;background:#fef2f2;border:1px solid #fecaca;color:#991b1b;font-size:12px;line-height:1.48;">
          <strong>⚠️ Log Masuk Google Gagal</strong><br/>
          Kod Ralat: <code style="background:#fee2e2;padding:1px 5px;border-radius:4px;font-weight:700;">${Utils.escapeHtml(authErr.code)}</code><br/>
          Domain Semasa: <code style="background:#fee2e2;padding:1px 5px;border-radius:4px;font-weight:700;user-select:all;">${Utils.escapeHtml(errHost)}</code><br/>
          <span style="display:block;margin-top:4px;color:#7f1d1d;">${Utils.escapeHtml(authErr.hint || authErr.msg)}</span>
        </div>
      ` : '';
      authBarHtml = `
        <div class="info-banner" style="background:${isGuest ? '#fffbeb' : '#f8fafc'};${isGuest ? 'border-color:#fde68a;color:#92400e;' : ''}">
          <div style="font-size:12px;color:${isGuest ? '#92400e' : '#475569'};margin-bottom:8px;">
            ${isGuest
              ? '⚠️ <strong>Mod Tetamu:</strong> Progres sesi ini disimpan sementara dalam memori sahaja dan <strong>TIDAK disimpan</strong> secara tempatan atau ke Cloud. Log masuk dengan Google untuk menyimpan permainan anda.'
              : '💾 <strong>Mod Tempatan:</strong> Simpanan anda kini disimpan dalam pelayar ini. Log masuk Google untuk menyegerakkan semua 5 slot ke Cloud.'}
          </div>
          <button type="button" id="slots-btn-login" class="primary-btn" style="width:100%;">🔐 Log Masuk dengan Google (Cloud Save)</button>
          ${errBoxHtml}
        </div>
      `;
    }

    const opErrorBanner = lastOpError ? `
      <div class="info-banner" style="background:#fef2f2;border-color:#fecaca;color:#991b1b;font-size:12px;line-height:1.45;">
        <strong>❌ Operasi Cloud Gagal</strong><br/>
        <span>${Utils.escapeHtml(lastOpError)}</span>
      </div>
    ` : '';

    const cloudErrorBanner = cloudError ? (offline ? `
      <div class="info-banner" style="background:#fffbeb;border-color:#fde68a;color:#92400e;display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
        <div style="font-size:12px;line-height:1.45;">
          <strong>⚠️ Mod Luar Talian</strong> (${Utils.escapeHtml(errorDetail || 'offline')})<br/>
          ${source === 'cache'
            ? 'Memaparkan salinan daripada <strong>Cache</strong> pelayar. Sambung internet &amp; tekan <em>Segerak Cloud Sekarang</em> untuk menarik data terkini dari pelayan.'
            : `${Utils.escapeHtml(errorMsg || 'Tiada sambungan internet ke pelayan Cloud.')}`}
          <br/><span style="opacity:0.9;">Tindakan menulis/memadam dikunci sementara bagi melindungi simpanan Cloud anda.</span>
        </div>
        <button type="button" id="slots-btn-retry-cloud" class="btn-sm primary" style="background:#d97706;">🔄 Cuba Lagi</button>
      </div>
    ` : `
      <div class="info-banner" style="background:#fef2f2;border-color:#fecaca;color:#991b1b;display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
        <div style="font-size:12px;line-height:1.45;">
          <strong>❌ Ralat Pelayan Cloud</strong> (<code style="background:#fee2e2;padding:1px 4px;border-radius:4px;">${Utils.escapeHtml(errorDetail || 'unknown')}</code>)<br/>
          ${Utils.escapeHtml(errorMsg || 'Gagal memuatkan senarai slot dari pelayan Firestore.')}<br/>
          Tindakan menimpa atau mencipta slot baru dikunci sementara bagi melindungi simpanan Cloud anda.
        </div>
        <button type="button" id="slots-btn-retry-cloud" class="btn-sm primary" style="background:#dc2626;">🔄 Cuba Lagi</button>
      </div>
    `) : '';

    const canSaveCurrentHere = Boolean(isCloud && !cloudError && !GameState.isGuestMode && GameState.current);

    const slotsHtml = GameState.SLOT_IDS.map((slotId, idx) => {
      const slotNum = idx + 1;
      const item = slots[slotId];
      const isActive = slotId === activeSlotId;
      if (!item) {
        return `
          <div class="migration-card" style="border-style:dashed;background:#f8fafc;">
            <div class="mig-head">
              <div class="mig-title">📂 Slot ${slotNum} ${isActive ? '<span class="cat-badge synergy">Aktif</span>' : ''}</div>
              <span style="font-size:11.5px;color:#64748b;">${cloudError ? 'Status Cloud Tidak Pasti' : 'Kosong'}</span>
            </div>
            <div style="display:flex;flex-direction:column;gap:6px;margin-top:6px;">
              ${canSaveCurrentHere ? `
                <button type="button" class="btn-sm primary slot-save-current-btn" data-slot="${slotId}" style="width:100%;" ${cloudError ? 'disabled' : ''}>
                  💾 Simpan Permainan Semasa di Sini
                </button>
              ` : ''}
              <button type="button" class="btn-sm ${canSaveCurrentHere ? 'secondary' : 'primary'} slot-new-btn" data-slot="${slotId}" style="width:100%;" ${cloudError ? 'disabled' : ''}>
                ${cloudError ? '🔒 Dikunci (Luar Talian / Ralat)' : '➕ Mula Kehidupan Baru di Slot Ini'}
              </button>
            </div>
          </div>
        `;
      }

      const confirming = confirmDeleteSlotId === slotId;
      const srcBadge = isCloud
        ? (item.source === 'cache'
            ? '<span class="cat-badge" style="background:#fef3c7;color:#92400e;">📦 Cache</span>'
            : '<span class="cat-badge synergy">☁️ Cloud</span>')
        : '<span class="cat-badge">💾 Tempatan</span>';

      return `
        <div class="migration-card" style="${isActive ? 'border-color:#3b82f6;' : ''}">
          <div class="mig-head">
            <div class="mig-title">
              ${item.countryFlag || '🌍'} ${Utils.escapeHtml(item.characterName)}
              ${isActive ? '<span class="cat-badge synergy">Aktif</span>' : ''}
            </div>
            ${srcBadge}
          </div>
          <div style="font-size:12px;color:#475569;line-height:1.5;margin-bottom:8px;">
            <strong>Slot ${slotNum}</strong> • Umur <strong>${item.age} thn</strong> • Gen ${item.generation || 1} • ${Utils.escapeHtml(item.country || 'Dunia')}<br/>
            💼 ${Utils.escapeHtml(item.career || 'Tiada Kerjaya')} • 💰 <strong>${Utils.escapeHtml(item.netWorthFormatted || String(item.netWorth || 0))}</strong><br/>
            <span style="font-size:11px;opacity:0.8;">🕒 Disimpan: ${Utils.escapeHtml(this._formatSlotTime(item.updatedAt || item.savedAt))}</span>
          </div>
          ${confirming ? `
            <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:8px;margin-bottom:6px;font-size:12px;color:#991b1b;">
              ⚠️ Pasti mahu memadam <strong>Slot ${slotNum} (${Utils.escapeHtml(item.characterName)})</strong> secara kekal dari Cloud? Slot lain tidak akan terjejas.
              <div style="display:flex;gap:6px;margin-top:6px;">
                <button type="button" class="btn-sm primary slot-confirm-del-btn" data-slot="${slotId}" style="flex:1;background:#dc2626;" ${cloudError ? 'disabled' : ''}>🗑️ Ya, Padam</button>
                <button type="button" class="btn-sm secondary slot-cancel-del-btn" style="flex:1;">Batal</button>
              </div>
            </div>
          ` : `
            ${canSaveCurrentHere ? `
              <button type="button" class="btn-sm primary slot-save-current-btn" data-slot="${slotId}" style="width:100%;margin-bottom:6px;">
                ${isActive ? '💾 Kemas Kini Simpanan' : '💾 Timpa dengan Permainan Semasa'}
              </button>
            ` : ''}
            <div class="mig-actions" style="grid-template-columns:repeat(2,1fr);">
              <button type="button" class="btn-sm ${canSaveCurrentHere ? 'secondary' : 'primary'} slot-load-btn" data-slot="${slotId}">▶ Muatkan</button>
              <button type="button" class="btn-sm secondary slot-del-btn" data-slot="${slotId}" style="color:#dc2626;" ${cloudError ? 'disabled' : ''}>🗑️ Padam</button>
            </div>
          `}
        </div>
      `;
    }).join('');

    this.open({
      icon: '☁️',
      title: 'Slot Simpanan & Cloud Save',
      subtitle: 'Urus sehingga 5 kehidupan berasingan (Slot 1 – Slot 5)',
      bodyHtml: `
        ${backBarHtml}
        ${authBarHtml}
        ${opErrorBanner}
        ${cloudErrorBanner}
        <div class="section-heading">📂 Senarai Slot Simpanan (Slot 1 – Slot 5)</div>
        ${slotsHtml}
      `
    });

    const backBtn = document.getElementById('slots-btn-back');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (backSource === 'menu') {
          this.showMenu();
        } else {
          this.close(true);
        }
      });
    }

    const retryCloudBtn = document.getElementById('slots-btn-retry-cloud');
    if (retryCloudBtn) {
      retryCloudBtn.addEventListener('click', () => this.showSaveSlotsModal(null, null));
    }

    const forceSyncBtn = document.getElementById('slots-btn-force-sync');
    if (forceSyncBtn) {
      forceSyncBtn.addEventListener('click', async () => {
        forceSyncBtn.disabled = true;
        forceSyncBtn.textContent = '🔄 Menyegerak...';
        const res = await GameState.pullCloudAndRefreshActive();
        if (res && res.cloudError) {
          const errText = `${res.errorDetail || 'error'}: ${res.errorMsg || 'Gagal menghubungi pelayan Cloud.'}`;
          App.toast(`⚠️ ${errText}`, 'error');
          this.showSaveSlotsModal(null, errText);
          return;
        }
        if (res && res.updated) {
          App.renderAll();
          App.toast('☁️ Simpanan terkini berjaya ditarik terus dari pelayan Cloud!', 'success');
        } else {
          App.toast('☁️ Semua slot sudah 100% selaras dengan pelayan Cloud.', 'success');
        }
        this.showSaveSlotsModal(null, null);
      });
    }

    const loginBtn = document.getElementById('slots-btn-login');
    if (loginBtn) {
      loginBtn.addEventListener('click', async () => {
        if (!window.FirebaseService) {
          App.toast('Perkhidmatan Firebase sedang dimuatkan...', 'error');
          return;
        }
        const res = await FirebaseService.signInWithGoogle();
        App.toast(res.msg, res.ok ? 'success' : 'error');
        if (App.renderStartAuthBar) App.renderStartAuthBar();
        this.showSaveSlotsModal();
      });
    }

    document.querySelectorAll('.slot-load-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const sid = btn.dataset.slot;
        const item = slots[sid];
        if (!item) return;
        const res = await App.runWithCloudProgress('load', async () => {
          const curActive = GameState.getActiveSlotId({ allowNull: true });
          if (GameState.current && curActive && curActive !== sid) {
            await GameState.syncActiveSlotToCloud('switch_slot');
          }
          GameState.loadSlotPayload(sid, item);
          return { ok: true };
        });
        if (res && res.busy) return;
        this.close(true);
        App.showGameScreen();
        App.renderAll();
        if (GameState.current && !GameState.current.alive) {
          setTimeout(() => this.showDeathSummary(), 200);
        } else {
          App.toast(`▶ Menyambung Slot ${sid.replace('slot_', '')}: ${item.characterName}`, 'success');
        }
      });
    });

    document.querySelectorAll('.slot-save-current-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const sid = btn.dataset.slot;
        if (!sid) return;
        const res = await App.handleSaveCurrentToSlot(sid, slots[sid] || null);
        if (res && (res.busy || res.cancelled)) return;
        this.showSaveSlotsModal(null, res && res.ok === false ? (res.msg || 'Gagal menyimpan ke pelayan Cloud.') : null);
      });
    });

    document.querySelectorAll('#modal-body .slot-new-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const sid = btn.dataset.slot;
        if (!sid) return;
        btn.disabled = true;

        // 1. Jika sedang bermain di slot lain, simpan & segerakkan slot semasa dahulu secara selamat sebelum menukar activeSlotId
        const prevSlotId = GameState.getActiveSlotId({ allowNull: true });
        if (GameState.current && prevSlotId && prevSlotId !== sid) {
          const syncRes = await App.runWithCloudProgress('save', async () => {
            try {
              return await GameState.saveSlotDirectToCloud(prevSlotId, GameState.current);
            } catch (err) {
              console.warn('[Slots] Gagal segerak cloud sebelum tukar slot:', err);
              return { ok: false, msg: 'Gagal menyegerak slot sebelum ini ke Cloud.' };
            }
          });
          if (syncRes && syncRes.busy) {
            btn.disabled = false;
            return;
          }
          if (syncRes && syncRes.ok === false) {
            App.toast(syncRes.msg || 'Cloud Save gagal, meneruskan ke slot baharu...', 'error');
          }
        }

        // 2. Kosongkan watak aktif dalam memori sebelum menukar activeSlotId supaya slot baharu tidak ditimpa
        GameState.cancelPendingAutoSave();
        GameState.current = null;
        GameState.setActiveSlotId(sid);

        // 3. Tutup modal serta-merta dan buka skrin Cipta Watak Baru untuk slot ini
        this.close(true);
        App.showStartScreen({ targetSlotId: sid, skipSave: true });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        App.toast(`📂 Sedia mencipta watak baru di Slot ${sid.replace('slot_', '')}!`, 'culture');
      });
    });

    document.querySelectorAll('.slot-del-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.showSaveSlotsModal(btn.dataset.slot);
      });
    });

    document.querySelectorAll('.slot-cancel-del-btn').forEach(btn => {
      btn.addEventListener('click', () => this.showSaveSlotsModal(null, null));
    });

    document.querySelectorAll('.slot-confirm-del-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const sid = btn.dataset.slot;
        let res = null;
        try {
          res = await App.runWithCloudProgress('delete', () => GameState.deleteSlot(sid));
          if (res && res.busy) return;
          App.toast((res && res.msg) || 'Slot telah dipadam.', res && res.ok === false ? 'error' : 'culture');
        } catch (err) {
          res = { ok: false, msg: 'Gagal memadam slot simpanan.' };
          App.toast(res.msg, 'error');
        } finally {
          if (App.cloudProgress && App.cloudProgress.active) {
            App.cloudProgress.active = false;
            App.renderCloudProgressOverlay();
          }
          if (!res || !res.busy) {
            this.showSaveSlotsModal(null, res && res.ok === false ? (res.msg || 'Gagal memadam slot.') : null);
          }
        }
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
            Negara: ${h.countriesLivedIn.map(id => Utils.getCountry(id).flag).join(' → ')} • Harta Akhir: ${h.netWorthFormatted}
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
    const activeSlotNum = GameState.getActiveSlotId().replace('slot_', '');
    const isCloudLoggedIn = Boolean(window.FirebaseService && FirebaseService.isLoggedIn());
    const toddlerLocked = Boolean(window.App && App._isToddlerLocked && App._isToddlerLocked());
    const inPrison = Boolean(GameState.current && GameState.current.prison && GameState.current.prison.inPrison);

    this.open({
      icon: '🌍',
      title: 'Menu WorldLife',
      subtitle: `Slot Aktif: Slot ${activeSlotNum} • Legasi, Tetapan & Cloud Save`,
      bodyHtml: `
        <div class="action-list">
          <button class="action-item" id="menu-open-slots">
            <span class="ai-icon">📂</span>
            <span class="ai-content">
              <span class="ai-title">Urus Slot Simpanan (Slot 1 – Slot 5)</span>
              <span class="ai-desc">${isCloudLoggedIn ? '☁️ Cloud Save Aktif — Tukar, sambung atau padam slot' : 'Simpanan tempatan & Log Masuk Google Cloud Save'}</span>
            </span>
          </button>
          <button class="action-item" id="menu-cloud-sync">
            <span class="ai-icon">☁️</span>
            <span class="ai-content">
              <span class="ai-title">Simpan ke Cloud (Slot ${activeSlotNum})</span>
              <span class="ai-desc">${isCloudLoggedIn ? 'Segerakkan kemajuan terkini ke Firestore Cloud' : 'Log masuk Google untuk menyimpan ke Cloud'}</span>
            </span>
          </button>
          <button class="action-item" id="menu-open-legacy" ${toddlerLocked ? 'disabled' : ''}>
            <span class="ai-icon">👑</span>
            <span class="ai-content">
              <span class="ai-title">Legasi Keluarga &amp; Pencapaian Dinasti</span>
              <span class="ai-desc">${toddlerLocked ? 'Dibuka selepas umur 4 tahun' : 'Salasilah, Reputasi Keluarga, Status Legasi &amp; Generasi Perdana'}</span>
            </span>
          </button>
          ${(!inPrison && GameState.current && window.SpecialModesEngine && SpecialModesEngine.getActiveInfo(GameState.current)) ? (() => {
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
          <button class="action-item" id="menu-open-social" ${toddlerLocked || inPrison ? 'disabled' : ''}>
            <span class="ai-icon">📱</span>
            <span class="ai-content">
              <span class="ai-title">Laman Sosial, Viral &amp; Sesi Date</span>
              <span class="ai-desc">${inPrison ? 'Akses telefon dan media sosial diharamkan sepenuhnya di dalam tahanan.' : (toddlerLocked ? 'Dibuka selepas umur 4 tahun' : 'Bina pengikut, kerjaya viral &amp; cari pasangan')}</span>
            </span>
          </button>
          <button class="action-item" id="menu-open-passport" ${toddlerLocked || inPrison ? 'disabled' : ''}>
            <span class="ai-icon">🛂</span>
            <span class="ai-content">
              <span class="ai-title">Lihat Pasport &amp; Profil</span>
              <span class="ai-desc">${inPrison ? 'Pasport ditahan sehingga hari pembebasan' : (toddlerLocked ? 'Dibuka selepas umur 4 tahun' : 'Semak negara, cop pasport &amp; biodata')}</span>
            </span>
          </button>
          <button class="action-item" id="menu-new-life">
            <span class="ai-icon">✨</span>
            <span class="ai-content">
              <span class="ai-title">Kembali ke Menu Utama / Watak Baru</span>
              <span class="ai-desc">Simpan automatik &amp; kembali ke skrin utama</span>
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
          ${isCloudLoggedIn ? `
          <button class="action-item" id="menu-logout" style="border-color:#fecaca;background:#fef2f2;">
            <span class="ai-icon">🚪</span>
            <span class="ai-content">
              <span class="ai-title" style="color:#b91c1c;">Log Keluar Akaun Google</span>
              <span class="ai-desc" style="color:#991b1b;">Tutup sesi Cloud Save dan kembali ke skrin log masuk</span>
            </span>
            <span class="ai-right" style="color:#dc2626;font-weight:700;">Log Keluar</span>
          </button>` : ''}
        </div>

        ${endingsHtml}
        <div class="section-heading">🏆 Dewan Kehidupan Lalu (${history.length})</div>
        ${histHtml}
      `
    });

    document.getElementById('menu-open-slots').addEventListener('click', () => {
      this.showSaveSlotsModal(null, null, 'menu');
    });
    document.getElementById('menu-cloud-sync').addEventListener('click', async () => {
      if (!window.FirebaseService || !FirebaseService.isLoggedIn()) {
        this.showSaveSlotsModal(null, null, 'menu');
        return;
      }
      const res = await App.runWithCloudProgress('save', () => GameState.syncActiveSlotToCloud('manual'));
      if (res && res.busy) return;
      App.toast(res.msg, res.ok ? 'success' : 'error');
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

    const menuLogoutBtn = document.getElementById('menu-logout');
    if (menuLogoutBtn) {
      menuLogoutBtn.addEventListener('click', async () => {
        const confirmed = window.confirm('Pasti mahu log keluar daripada akaun ini? Pastikan kemajuan terkini sudah disimpan.');
        if (!confirmed) return;
        const uidBefore = (window.FirebaseService && FirebaseService.user && FirebaseService.user.uid) || null;
        const res = await FirebaseService.signOutUser();
        if (res && res.ok) {
          if (uidBefore && GameState.clearAccountLocalCache) GameState.clearAccountLocalCache(uidBefore);
          GameState.resetSessionState({ clearCurrent: true });
          this.close(true);
          if (window.App) {
            if (App.renderStartAuthBar) App.renderStartAuthBar();
            if (App.showEntryGate) App.showEntryGate();
          }
        }
        App.toast((res && res.msg) || 'Anda telah log keluar.', res && res.ok ? 'culture' : 'error');
      });
    }

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
            <span class="val">${s.countriesLivedIn.map(id => Utils.getCountry(id).flag).join(' → ')} (${s.countriesLivedIn.length})</span>
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
    const courtLabel = `Mahkamah Sivil ${fromC.name}`;

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
  },

  // ==========================================================================
  // HOSPITAL & KLINIK (PENYAKIT RAWAK, RAWATAN & CUTI SAKIT MC)
  // ==========================================================================
  showHospitalModal() {
    const s = GameState.current;
    if (!s || !window.HealthMedicalEngine) return;
    HealthMedicalEngine.ensureFields(s);
    const c = Utils.getCountry(s.countryId);
    const inPrison = Boolean(s.prison && s.prison.inPrison);
    const illnesses = Array.isArray(s.illnesses) ? s.illnesses : [];
    const pubCostInfo = HealthMedicalEngine.getTreatmentCost(s, inPrison ? 'prison' : 'public');
    const privCostInfo = HealthMedicalEngine.getTreatmentCost(s, 'private');
    const checkupCostInfo = HealthMedicalEngine.getTreatmentCost(s, inPrison ? 'prison' : 'checkup');
    const checkupDone = Boolean(s.yearlyActions && s.yearlyActions.healthCheckup);
    const canTakeMc = HealthMedicalEngine.hasLegitimateJob(s) && illnesses.length > 0;
    const mcLeft = Math.max(0, HealthMedicalEngine.MAX_MC_PER_YEAR - (s.mcCountThisYear || 0));

    const fmtCost = (info) => info.parentCovers
      ? 'Mak Ayah Bayar'
      : (info.cost <= 0 ? 'PERCUMA' : Utils.formatMoney(info.cost, s.countryId));

    const illnessHtml = illnesses.length === 0
      ? `<div class="info-banner" style="background:#ecfdf5;border-color:#6ee7b7;color:#065f46;margin-bottom:10px;">
           🌿 <strong>Anda sedang sihat!</strong> Tiada penyakit aktif dikesan buat masa ini.
         </div>`
      : illnesses.map(ill => {
          const sev = HealthMedicalEngine.SEVERITY_META[ill.severity] || HealthMedicalEngine.SEVERITY_META.ringan;
          return `
            <div class="migration-card" style="border-color:${sev.border};margin-bottom:10px;">
              <div class="mig-head">
                <div class="mig-title">${ill.icon || '🤒'} ${Utils.escapeHtml(ill.name)}</div>
                <span class="cat-badge" style="background:${sev.bg};color:${sev.color};border:1px solid ${sev.border};">${sev.label}</span>
              </div>
              <div style="font-size:11.5px;color:#475569;margin-bottom:8px;">
                Tempoh dihidapi: <strong>${ill.yearsActive || 0} tahun</strong>
              </div>
              <div class="action-list">
                ${inPrison ? `
                  <button type="button" class="action-item hosp-treat-btn" data-ill-id="${ill.id}" data-tier="prison">
                    <span class="ai-icon">🏥</span>
                    <span class="ai-content">
                      <span class="ai-title">Rawatan Klinik Penjara</span>
                      <span class="ai-desc">Pemeriksaan asas dan ubat tahan sakit daripada pegawai perubatan penjara</span>
                    </span>
                    <span class="ai-right free">PERCUMA</span>
                  </button>
                ` : `
                  <button type="button" class="action-item hosp-treat-btn" data-ill-id="${ill.id}" data-tier="public">
                    <span class="ai-icon">🏥</span>
                    <span class="ai-content">
                      <span class="ai-title">Rawatan Klinik / Hospital Kerajaan</span>
                      <span class="ai-desc">Rawatan bersubsidi oleh doktor bertauliah dengan kos mampu milik</span>
                    </span>
                    <span class="ai-right cost">${fmtCost(pubCostInfo)}</span>
                  </button>
                  <button type="button" class="action-item hosp-treat-btn" data-ill-id="${ill.id}" data-tier="private">
                    <span class="ai-icon">🩺</span>
                    <span class="ai-content">
                      <span class="ai-title">Hospital Pakar Swasta</span>
                      <span class="ai-desc">Rawatan pakar menyeluruh dengan peralatan moden untuk penyakit sederhana &amp; kritikal</span>
                    </span>
                    <span class="ai-right cost">${fmtCost(privCostInfo)}</span>
                  </button>
                `}
              </div>
            </div>
          `;
        }).join('');

    this.open({
      icon: '🏥',
      title: inPrison ? 'Klinik Penjara' : 'Hospital & Klinik',
      subtitle: inPrison ? 'Rawatan asas semasa dalam tahanan' : `${c.name} • Kesihatan: ${Math.round(s.stats.health)}%`,
      bodyHtml: `
        ${inPrison ? `
          <div class="info-banner" style="background:#fef2f2;border-color:#fca5a5;color:#7f1d1d;margin-bottom:10px;">
            🔒 <strong>Akses Hospital Luar Disekat:</strong> Anda hanya boleh menggunakan Klinik Penjara sehingga dibebaskan.
          </div>
        ` : ''}

        <div class="section-heading">🤒 Status Penyakit Aktif (${illnesses.length})</div>
        ${illnessHtml}

        ${canTakeMc ? `
          <div class="section-heading">📄 Cuti Sakit (MC) Pekerjaan</div>
          <div class="action-list" style="margin-bottom:12px;">
            <button type="button" class="action-item" id="hosp-request-mc" ${mcLeft <= 0 ? 'disabled' : ''}>
              <span class="ai-icon">📄</span>
              <span class="ai-content">
                <span class="ai-title">Minta Sijil Cuti Sakit (MC)</span>
                <span class="ai-desc">Rehatkan diri daripada tugas kerja (MC tahun ini: ${s.mcCountThisYear || 0}/${HealthMedicalEngine.MAX_MC_PER_YEAR}${s.mcWarnings > 0 ? ` • Amaran HR: ${s.mcWarnings}` : ''})</span>
              </span>
              <span class="ai-right">${mcLeft <= 0 ? 'Had Tamat' : 'Mohon MC'}</span>
            </button>
          </div>
        ` : ''}

        <div class="section-heading">🩺 Penjagaan Kesihatan Berkala</div>
        <div class="action-list">
          <button type="button" class="action-item ${checkupDone ? 'act-done-card' : ''}" id="hosp-checkup-btn" ${checkupDone ? 'disabled' : ''}>
            <span class="ai-icon">🩺</span>
            <span class="ai-content">
              <span class="ai-title">Pemeriksaan Kesihatan</span>
              <span class="ai-desc">${checkupDone ? 'Selesai tahun ini' : 'Jalani pemeriksaan berkala untuk mengekalkan tahap kesihatan badan'}</span>
            </span>
            <span class="ai-right cost">${checkupDone ? 'Selesai Tahun Ini' : fmtCost(checkupCostInfo)}</span>
          </button>
        </div>
      `
    });

    document.querySelectorAll('.hosp-treat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = HealthMedicalEngine.treatIllness(s, btn.dataset.illId, btn.dataset.tier);
        App.toast(res.msg, res.ok ? (res.cured ? 'success' : 'culture') : 'error');
        App.renderAll();
        this.showHospitalModal();
      });
    });

    const hospMcBtn = document.getElementById('hosp-request-mc');
    if (hospMcBtn) {
      hospMcBtn.addEventListener('click', () => {
        const res = HealthMedicalEngine.requestMedicalLeave(s);
        App.toast(res.msg, res.fired ? 'error' : res.warning ? 'culture' : (res.ok ? 'success' : 'error'));
        App.renderAll();
        this.showHospitalModal();
      });
    }

    const checkupBtn = document.getElementById('hosp-checkup-btn');
    if (checkupBtn) {
      checkupBtn.addEventListener('click', () => {
        const res = HealthMedicalEngine.doHealthCheckup(s);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showHospitalModal();
      });
    }
  },

  // ==========================================================================
  // PINJAMAN & HUTANG (PINJAMAN BANK, SKOR KREDIT & PINJAMAN AH LONG)
  // ==========================================================================
  showLoansModal(activeTab = 'bank') {
    const s = GameState.current;
    if (!s || !window.LoansEngine) return;
    LoansEngine.ensureFields(s);
    const prof = LoansEngine.calculateCreditProfile(s);
    const totalDebt = LoansEngine.getTotalDebt(s);
    const inPrison = Boolean(s.prison && s.prison.inPrison);
    const loans = Array.isArray(s.loans) ? s.loans : [];

    const activeLoansHtml = loans.length === 0
      ? `<div class="info-banner" style="background:#f8fafc;margin-bottom:10px;">Tiada hutang aktif buat masa ini.</div>`
      : loans.map(l => {
          const isAl = l.lenderType === 'ahlong';
          const due = Math.min(l.balance, l.yearlyDue);
          return `
            <div class="migration-card" style="border-color:${isAl ? '#ef4444' : '#3b82f6'};margin-bottom:10px;">
              <div class="mig-head">
                <div class="mig-title">${isAl ? '🦈' : '🏦'} ${Utils.escapeHtml(l.lenderName)}</div>
                <strong style="color:#dc2626;">${Utils.formatMoney(l.balance, s.countryId)}</strong>
              </div>
              <div style="font-size:11.5px;color:#475569;margin-bottom:8px;">
                Faedah Tahunan: <strong>${Math.round(l.interestRate * 100)}%/thn</strong> • Ansuran: <strong>${Utils.formatMoney(due, s.countryId)}/thn</strong>
                ${l.missedPayments > 0 ? `<br/><span style="color:#dc2626;font-weight:700;">⚠️ Tertunggak ${l.missedPayments} tahun!</span>` : ''}
              </div>
              <div style="display:flex;gap:6px;">
                <button type="button" class="btn-sm loan-pay-inst" data-loan-id="${l.id}" style="flex:1;" ${l.paidThisYear ? 'disabled' : ''}>
                  ${l.paidThisYear ? '✓ Ansuran Tahun Ini Dibayar' : '💵 Bayar Ansuran Tahun Ini'}
                </button>
                <button type="button" class="btn-sm secondary loan-pay-full" data-loan-id="${l.id}" style="flex:1;">
                  💰 Langsaikan Penuh
                </button>
              </div>
            </div>
          `;
        }).join('');

    let tabBody = '';
    if (activeTab === 'bank') {
      const bankOffers = LoansEngine.getBankOffers(s);
      const bankCount = loans.filter(l => l.lenderType === 'bank').length;
      if (prof.autoReject) {
        tabBody = `<div class="info-banner" style="background:#fef2f2;border-color:#fca5a5;color:#7f1d1d;">🔒 <strong>Permohonan Bank Ditolak:</strong> ${Utils.escapeHtml(prof.reason || 'Tidak layak memohon pinjaman bank buat masa ini.')}</div>`;
      } else {
        tabBody = `
          <div class="info-banner" style="margin-bottom:8px;">
            Pinjaman bank aktif: <strong>${bankCount}/${LoansEngine.MAX_BANK_LOANS}</strong> • Kadar faedah anggaran: <strong>${Math.round((prof.interestRate || 0.16) * 100)}%/thn</strong>
          </div>
          <div class="action-list">
            ${bankOffers.map(o => `
              <button type="button" class="action-item loan-apply-bank" data-offer-id="${o.id}" ${bankCount >= LoansEngine.MAX_BANK_LOANS || inPrison ? 'disabled' : ''}>
                <span class="ai-icon">🏦</span>
                <span class="ai-content">
                  <span class="ai-title">${Utils.escapeHtml(o.title)} (${Utils.formatMoney(o.principal, s.countryId)})</span>
                  <span class="ai-desc">Ansuran anggaran: ${Utils.formatMoney(o.yearlyDue, s.countryId)}/thn • Tempoh ${o.years} tahun</span>
                </span>
                <span class="ai-right free">Mohon</span>
              </button>
            `).join('')}
          </div>
        `;
      }
    } else {
      const alOffers = LoansEngine.getAhLongOffers(s);
      const alCount = loans.filter(l => l.lenderType === 'ahlong').length;
      tabBody = `
        <div class="info-banner" style="background:#fef2f2;border-color:#fca5a5;color:#7f1d1d;margin-bottom:8px;">
          ⚠️ <strong>Tiada semakan kredit • Faedah sangat tinggi • Risiko gangguan melampau jika lewat bayar!</strong><br/>
          Pinjaman Ah Long aktif: <strong>${alCount}/${LoansEngine.MAX_AHLONG_LOANS}</strong>
        </div>
        <div class="action-list">
          ${alOffers.map(o => `
            <button type="button" class="action-item loan-apply-ahlong" data-offer-id="${o.id}" ${alCount >= LoansEngine.MAX_AHLONG_LOANS || inPrison || s.age < 18 ? 'disabled' : ''}>
              <span class="ai-icon">🦈</span>
              <span class="ai-content">
                <span class="ai-title">${Utils.escapeHtml(o.title)} (${Utils.formatMoney(o.principal, s.countryId)})</span>
                <span class="ai-desc">Faedah ${Math.round(o.interestRate * 100)}%/thn berganda • Ansuran awal: ${Utils.formatMoney(o.yearlyDue, s.countryId)}/thn</span>
              </span>
              <span class="ai-right cost">Ambil Tunai</span>
            </button>
          `).join('')}
        </div>
      `;
    }

    this.open({
      icon: '💳',
      title: 'Pinjaman & Hutang',
      subtitle: `Baki Bank: ${Utils.formatMoney(s.money, s.countryId)} • Jumlah Hutang: ${Utils.formatMoney(totalDebt, s.countryId)}`,
      bodyHtml: `
        <div class="info-banner" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:10px;background:#f8fafc;">
          <span>📊 Skor Kredit: <strong>${prof.score}</strong> / 850</span>
          <span style="font-size:11.5px;font-weight:700;padding:3px 8px;border-radius:999px;background:${prof.bg};color:${prof.color};">${prof.label}</span>
        </div>

        <div class="section-heading">📋 Senarai Hutang Aktif (${loans.length})</div>
        ${activeLoansHtml}

        <div class="tab-pills" style="margin-top:10px;margin-bottom:10px;">
          <button type="button" class="tab-pill loan-tab-btn ${activeTab === 'bank' ? 'active' : ''}" data-loan-tab="bank">🏦 Pinjaman Bank</button>
          <button type="button" class="tab-pill loan-tab-btn ${activeTab === 'ahlong' ? 'active' : ''}" data-loan-tab="ahlong">🦈 Pinjaman Ah Long (Tanpa Syarat)</button>
        </div>

        ${tabBody}
      `
    });

    document.querySelectorAll('.loan-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => this.showLoansModal(btn.dataset.loanTab));
    });

    document.querySelectorAll('.loan-apply-bank').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = LoansEngine.takeBankLoan(s, btn.dataset.offerId);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showLoansModal('bank');
      });
    });

    document.querySelectorAll('.loan-apply-ahlong').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = LoansEngine.takeAhLongLoan(s, btn.dataset.offerId);
        App.toast(res.msg, res.ok ? 'culture' : 'error');
        App.renderAll();
        this.showLoansModal('ahlong');
      });
    });

    document.querySelectorAll('.loan-pay-inst').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = LoansEngine.payInstallment(s, btn.dataset.loanId);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showLoansModal(activeTab);
      });
    });

    document.querySelectorAll('.loan-pay-full').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = LoansEngine.payOffLoan(s, btn.dataset.loanId);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showLoansModal(activeTab);
      });
    });
  }
};
