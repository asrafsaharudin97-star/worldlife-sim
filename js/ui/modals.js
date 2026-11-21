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

    const choicesHtml = event.choices.map((ch, idx) => `
      <button class="choice-btn" data-choice-idx="${idx}">
        <span>${Utils.escapeHtml(ch.label)}</span>
        ${ch.hint ? `<span class="choice-hint">${Utils.escapeHtml(ch.hint)}</span>` : ''}
      </button>
    `).join('');

    this.open({
      icon: event.icon || '✨',
      title: event.title,
      subtitle: `Umur ${s.age} • ${s.city}, ${c.name} ${c.flag}`,
      locked: true,
      bodyHtml: `
        <div class="event-text">${Utils.escapeHtml(event.text)}</div>
        <div class="action-list">${choicesHtml}</div>
      `
    });

    document.querySelectorAll('#modal-body .choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.choiceIdx);
        const choice = event.choices[idx];
        const res = Sim.resolveEventChoice(event, choice) || {};
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
  showOccupation() {
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
  showAssets() {
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
    html += '</div>';

    const renderList = (items) => items.map(r => {
      const rc = Utils.getCountry(r.countryId);
      const isPartner = r.id === s.partnerId;
      const bObj = GameState.getBeliefObj(r.belief);
      const distLabel = r.countryId !== s.countryId ? ` • ${rc.flag} Luar Negara` : '';
      const adoptTag = r.isAdopted ? ' • Anak Angkat' : '';
      const icon = isPartner ? (s.married ? '💍' : '💑')
        : r.category === 'friend' ? '🧑‍🤝‍🧑'
        : ['Anak Lelaki', 'Anak Perempuan', 'Son', 'Daughter'].includes(r.role) ? '👶'
        : '👤';
      return `
        <button class="action-item rel-open-btn" data-rel-id="${r.id}">
          <span class="ai-icon">${icon}</span>
          <span class="ai-content">
            <span class="ai-title">${Utils.escapeHtml(r.name)} <small style="font-weight:600;color:#64748b;">(${r.role}, ${r.age})</small></span>
            <span class="ai-desc">${bObj.icon} ${bObj.name} • Kepercayaan ${r.trust ?? 65}% • Serasi ${r.compatibility ?? 75}%${adoptTag}${distLabel}</span>
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
    const muslim = Relationships.isMuslim(s);
    const interfaithBlocked = isPartner && muslim && (rel.belief !== 'islam' || rel.gender === s.gender);
    const longDist = rel.countryId !== s.countryId;
    const rc = Utils.getCountry(rel.countryId);
    const bObj = GameState.getBeliefObj(rel.belief);

    const stageLabel = isPartner
      ? (s.married ? 'Berkahwin' : rel.stage === 'engaged' ? 'Bertunang' : rel.stage === 'cohabiting' ? 'Tinggal Bersama' : rel.stage === 'taaruf' ? 'Ta\'aruf' : 'Bercinta')
      : (rel.origin || rel.role);

    const html = `
      <div class="info-banner">
        <strong>${Utils.escapeHtml(rel.name)}</strong> (${rel.role}, Umur ${rel.age})<br/>
        Agama / Pegangan: <strong>${bObj.icon} ${bObj.name}</strong> • Status: <strong>${stageLabel}</strong><br/>
        Kemesraan: <strong>${rel.closeness}%</strong> • Kepercayaan: <strong>${rel.trust ?? 65}%</strong> • Keserasian: <strong>${rel.compatibility ?? 75}%</strong><br/>
        Lokasi: ${rc.flag} ${rc.name}${rel.job ? ` • ${Utils.escapeHtml(rel.job)}` : ''}
      </div>
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
      </div>
      <button class="ghost-btn" id="rel-back-btn">← Kembali ke Hubungan</button>
    `;

    this.open({
      icon: isPartner ? (s.married ? '💍' : '💑') : isFriend ? '🧑‍🤝‍🧑' : '👤',
      title: rel.name,
      subtitle: `${rel.role} • ${bObj.icon} ${bObj.name} • ${rc.flag} ${rc.name}`,
      bodyHtml: html
    });

    document.querySelectorAll('.rel-act-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const act = btn.dataset.act;
        const res = Sim.interactRelation(relId, act);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        if (res.followUpEvent) {
          this.showEvent(res.followUpEvent);
        } else if (act === 'breakup' || act === 'cut_ties') {
          this.showRelationships();
        } else {
          this.showRelationDetail(relId);
        }
      });
    });

    document.getElementById('rel-back-btn').addEventListener('click', () => this.showRelationships());
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

      contentHtml += `
        <div class="info-banner highlight">
          <strong>🛂 Pasport &amp; Profil ${Utils.escapeHtml(s.name)}</strong><br/>
          Tempat Lahir: ${birthC.flag} ${s.birthCity}, ${birthC.name} (${s.heritageLabel})<br/>
          Kepercayaan / Pegangan: <strong>${beliefObj.icon} ${beliefObj.name}</strong> (Ketahanan Jiwa: ${s.devotion || 40}%)<br/>
          Latar Keluarga: ${famBeliefObj.icon} ${famBeliefObj.name}<br/>
          Status Semasa: <strong>${c.flag} ${c.name} — ${App._residencyLabel(s.residencyStatus)}</strong> (${s.yearsInCurrentCountry} tahun)<br/>
          Kewarganegaraan: ${s.citizenships.map(id => `${Utils.getCountry(id).flag} ${Utils.getCountry(id).name}`).join(', ')}
        </div>
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
      const beliefObj = GameState.getBeliefObj(s.belief);
      const charityCost = Utils.usdToLocal(35, s.countryId);
      contentHtml += `
        <div class="section-heading">🏥 Kesihatan di ${c.name} (${c.healthcare.type})</div>
        <div class="info-banner">${Utils.escapeHtml(c.healthcare.desc)}</div>
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
          <button class="action-item" id="act-gym" ${s.yearlyActions.gym ? 'disabled' : ''}>
            <span class="ai-icon">🏋️</span>
            <span class="ai-content">
              <span class="ai-title">Bersenam di Gim</span>
              <span class="ai-desc">Tingkatkan Kesihatan &amp; Penampilan</span>
            </span>
            <span class="ai-right cost">${s.age < 18 ? 'Percuma' : Utils.formatMoney(gymCost, s.countryId)}</span>
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
              <span class="ai-desc">Tingkatkan Gembira &amp; Kesihatan</span>
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
        this.showActivities('migrate');
        const nextInput = document.getElementById('mig-search-input');
        if (nextInput) {
          nextInput.focus();
          nextInput.setSelectionRange(pos, pos);
        }
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
        const res = Sim.migrateToCountry(btn.dataset.dest, btn.dataset.visa);
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
      const cost = s.age < 18 ? 0 : Utils.usdToLocal(25, s.countryId);
      if (s.money < cost) return App.toast('Wang tidak mencukupi untuk gim!', 'error');
      s.money -= cost;
      s.yearlyActions.gym = true;
      GameState.adjustStats({ health: 8, looks: 5, happiness: 4 });
      GameState.addJournalEntry(`🏋️ Bersenam bersungguh-sungguh di gim tempatan di ${s.city}!`);
      GameState.save();
      App.renderAll();
      App.toast('Kesihatan & Penampilan meningkat!', 'success');
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
      GameState.addJournalEntry(`🧘 Bertenang dan berjalan santai di taman rekreasi.`);
      GameState.save();
      App.renderAll();
      App.toast('Fikiran lebih tenang!', 'success');
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

    this.open({
      icon: '🌍',
      title: 'Menu WorldLife',
      subtitle: 'Laluan Hidup, Legasi & Penamat Rahsia',
      bodyHtml: `
        <div class="action-list">
          <button class="action-item" id="menu-open-legacy">
            <span class="ai-icon">👑</span>
            <span class="ai-content">
              <span class="ai-title">Legasi Keluarga &amp; Pencapaian Dinasti</span>
              <span class="ai-desc">Salasilah, Reputasi Keluarga, Status Legasi &amp; Generasi Perdana</span>
            </span>
          </button>
          <button class="action-item" id="menu-open-modes">
            <span class="ai-icon">🎭</span>
            <span class="ai-content">
              <span class="ai-title">Laluan Hidup &amp; 5 Mod Khas</span>
              <span class="ai-desc">Jenayah, Mafia, Artis, Pelakon &amp; Politik</span>
            </span>
          </button>
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
        ${endingsHtml}
        <div class="section-heading">🏆 Dewan Kehidupan Lalu (${history.length})</div>
        ${histHtml}
      `
    });

    document.getElementById('menu-open-legacy').addEventListener('click', () => {
      if (GameState.current && window.LegacyModals) LegacyModals.showFamilyLegacy();
    });
    document.getElementById('menu-open-modes').addEventListener('click', () => {
      if (GameState.current && GameState.current.alive && window.ModeModals) ModeModals.showLifeModes('crime');
    });
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
  }
};
