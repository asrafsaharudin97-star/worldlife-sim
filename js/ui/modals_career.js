/* ==========================================================================
   WorldLife — Antara Muka Pendidikan Sepanjang Hayat (Sehingga PhD),
   Sijil Profesional & Pasaran Kerja Rawak Dinamik (Bahasa Melayu)
   ========================================================================== */

window.CareerModals = {
  _activeTab: 'jobs',
  _industryFilter: 'ALL',
  _selectedField: 'computer_science',
  _selectedMode: 'full_time',
  _selectedFunding: 'cash',
  _browsingNewJob: false,

  showHub(subTab = null) {
    const s = GameState.current;
    if (!s) return;
    EduCareerEngine.ensureFields(s);
    const c = Utils.getCountry(s.countryId);

    if (subTab) this._activeTab = subTab;
    else if (s.age < 18 && this._activeTab === 'jobs') this._activeTab = 'education';

    const tab = this._activeTab;
    const tabsHtml = `
      <div class="tab-pills career-hub-tabs" style="flex-shrink:0;margin-bottom:10px;">
        <button type="button" class="tab-pill career-tab-pill ${tab === 'jobs' ? 'active' : ''}" data-ctab="jobs">💼 Pasaran Kerja</button>
        <button type="button" class="tab-pill career-tab-pill ${tab === 'education' ? 'active' : ''}" data-ctab="education">🎓 Pendidikan</button>
        <button type="button" class="tab-pill career-tab-pill ${tab === 'certs' ? 'active' : ''}" data-ctab="certs">📜 Sijil &amp; Kursus</button>
        <button type="button" class="tab-pill career-tab-pill ${tab === 'record' ? 'active' : ''}" data-ctab="record">🏆 Rekod</button>
      </div>
    `;

    let body = '';
    if (tab === 'jobs') body = this._renderJobsTab(s, c);
    else if (tab === 'education') body = this._renderEducationTab(s, c);
    else if (tab === 'certs') body = this._renderCertsTab(s, c);
    else body = this._renderRecordTab(s, c);

    const lvlInfo = EducationData.LEVEL_INFO[s.education.educationLevel] || EducationData.LEVEL_INFO.none;
    const drSuffix = (s.education.hasDoctorateTitle && !lvlInfo.short.includes('(Dr.)')) ? ' (Dr.)' : '';
    Modals.open({
      icon: '💼',
      title: 'Pendidikan & Kerjaya',
      subtitle: `${c.flag} ${c.name} • ${lvlInfo.icon} ${lvlInfo.short}${drSuffix}`,
      bodyHtml: `
        <div class="career-modal-layout">
          ${tabsHtml}
          <div id="career-tab-scroll" class="career-tab-scroll">
            ${body}
          </div>
        </div>
      `
    });

    const modalBodyEl = document.getElementById('modal-body');
    if (modalBodyEl) modalBodyEl.scrollTop = 0;
    const scrollEl = document.getElementById('career-tab-scroll');
    if (scrollEl) scrollEl.scrollTop = 0;

    this._bindHandlers(s, c, tab);
  },

  // --------------------------------------------------------------------------
  // TAB 1: PASARAN KERJA RAWAK DINAMIK & PENGURUSAN KERJAYA AKTIF
  // --------------------------------------------------------------------------
  _renderJobsTab(s, c) {
    const activeStudy = s.education && s.education.activeStudy;
    const certCount = (s.education && Array.isArray(s.education.certificates)) ? s.education.certificates.length : 0;
    let html = `
      <div class="info-banner highlight" style="margin-bottom:10px;">
        <strong>📚 Pendidikan &amp; Kursus Profesional</strong><br/>
        <small style="opacity:0.88;">
          ${activeStudy
            ? `Pengajian aktif: <strong>${Utils.escapeHtml(activeStudy.fieldName)}</strong> (Tahun ${activeStudy.yearsCompleted}/${activeStudy.totalYears}) • `
            : 'Anda boleh sambung pengajian (Diploma/Ijazah/Master/PhD) atau ambil Kursus Profesional walaupun sedang bekerja atau dalam Mod Khas! • '}
          Sijil dimiliki: <strong>${certCount}</strong>
        </small>
        <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;">
          <button type="button" class="secondary-btn" id="btn-jobs-open-edu" style="flex:1;min-width:140px;padding:7px 10px;font-size:12.5px;">🎓 Sambung Pengajian (PhD)</button>
          <button type="button" class="secondary-btn" id="btn-jobs-open-certs" style="flex:1;min-width:140px;padding:7px 10px;font-size:12.5px;">📜 Kursus Profesional</button>
        </div>
      </div>
    `;

    if ((s.isRetired || s.retired) && !s.job) {
      html += `
        <div class="info-banner" style="background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-color:#6ee7b7;margin-bottom:10px;">
          <strong>🏖️ Status Semasa: Pesara Rasmi</strong><br/>
          Tempoh Kerjaya: <strong>${s.totalYearsWorked || 0} tahun</strong> • Pencen Tahunan: <strong>${s.pensionAnnual > 0 ? `${Utils.formatMoney(s.pensionAnnual, s.countryId)}/thn` : 'Tiada (Kumpulan Wang dikeluarkan penuh)'}</strong><br/>
          <small style="opacity:0.85;">Sebagai pesara, stres tahunan anda lebih rendah. Anda masih bebas mengambil Kursus Profesional, melabur, atau kembali bekerja (pencen dijeda sementara jika bekerja penuh masa).</small>
        </div>
      `;
    }

    if (s.job) {
      EduCareerEngine.ensureFields(s);
      const ladder = Array.isArray(s.job.ladder) ? s.job.ladder : [s.job.title];
      const rankIdx = s.job.rankIndex || 0;
      const nextRank = ladder[rankIdx + 1] || null;
      const pct = Math.round(((rankIdx + 1) / ladder.length) * 100);
      const currentTenure = s.yearsInCurrentJob ?? s.job.years ?? 0;
      const totalYrs = Math.max(s.totalYearsWorked || 0, currentTenure);
      const retElig = EduCareerEngine.canRetire(s);
      const isPensionEligible = s.age >= 55 && totalYrs >= 15;
      const yrsLeftForPension = Math.max(0, 15 - totalYrs);
      const ageLeftForPension = Math.max(0, 55 - s.age);
      const pensionBadgeText = isPensionEligible
        ? '✅ Layak Pencen'
        : yrsLeftForPension > 0
          ? `⏳ Baki ${yrsLeftForPension} tahun lagi untuk pencen`
          : `⏳ Baki ${ageLeftForPension} tahun umur untuk pencen`;
      const pensionBadgeStyle = isPensionEligible
        ? 'background:#dcfce7;color:#166534;border:1px solid #86efac;'
        : 'background:#fef3c7;color:#92400e;border:1px solid #fde68a;';

      html += `
        <div class="career-active-card">
          <div class="cac-top">
            <div>
              <div class="cac-title">${s.job.icon || '💼'} ${Utils.escapeHtml(s.job.title)}</div>
              <div class="cac-sub">Gaji: <strong>${Utils.formatMoney(s.job.salary, s.countryId)}/thn</strong> • Cukai ${Math.round((c.taxRate || 0) * 100)}%</div>
              <div class="cac-sub" style="margin-top:2px;">📅 Tempoh Berkhidmat: <strong>${currentTenure} tahun</strong></div>
              <div class="cac-sub" style="margin-top:2px;color:#059669;">🏦 Tabung Persaraan (${Utils.escapeHtml(c.retirementScheme || 'KWSP')}): <strong>${Utils.formatMoney(s.retirementFund || 0, s.countryId)}</strong> (+12%/thn)</div>
            </div>
            <span class="cat-badge synergy">Pangkat ${rankIdx + 1}/${ladder.length}</span>
          </div>
          <div class="cac-bars">
            <div>
              <div class="ph-bar-lbl"><span>Prestasi Kerja</span><strong>${s.job.performance}%</strong></div>
              <div class="mini-track" style="height:7px;"><div class="mini-fill" style="width:${s.job.performance}%;background:#22c55e;"></div></div>
            </div>
            <div>
              <div class="ph-bar-lbl"><span>Tangga Pangkat</span><strong>${pct}%</strong></div>
              <div class="mini-track" style="height:7px;"><div class="mini-fill" style="width:${pct}%;background:#3b82f6;"></div></div>
            </div>
          </div>
          ${nextRank ? `<div class="cac-next">🎯 Pangkat Seterusnya: <strong>${Utils.escapeHtml(nextRank)}</strong></div>` : '<div class="cac-next">👑 Anda telah mencapai puncak tangga kerjaya ini!</div>'}
        </div>

        <div class="info-banner" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:8px;background:#f8fafc;">
          <span>📊 Jumlah Tahun Bekerja: <strong>${totalYrs} tahun</strong></span>
          <span style="font-size:11.5px;font-weight:700;padding:3px 8px;border-radius:999px;${pensionBadgeStyle}">${pensionBadgeText}</span>
        </div>

        <div class="action-list" style="margin-bottom:12px;">
          <button type="button" class="action-item" id="act-work-hard" ${s.yearlyActions.workHard ? 'disabled' : ''}>
            <span class="ai-icon">⚡</span>
            <span class="ai-content">
              <span class="ai-title">Kerja Keras &amp; Lebih Masa</span>
              <span class="ai-desc">Tingkatkan prestasi kerja &amp; peluang naik pangkat (+Stres sedikit)</span>
            </span>
            <span class="ai-right">Prestasi ++</span>
          </button>
          <button type="button" class="action-item" id="act-work-network" ${s.yearlyActions.workNetwork ? 'disabled' : ''}>
            <span class="ai-icon">🤝</span>
            <span class="ai-content">
              <span class="ai-title">Bina Rangkaian (Networking)</span>
              <span class="ai-desc">Rapat dengan pengarah &amp; tokoh industri (+Reputasi &amp; Prestasi)</span>
            </span>
            <span class="ai-right">Reputasi +</span>
          </button>
          <button type="button" class="action-item" id="act-raise" ${s.yearlyActions.askedRaise ? 'disabled' : ''}>
            <span class="ai-icon">💰</span>
            <span class="ai-content">
              <span class="ai-title">Minta Kenaikan Gaji</span>
              <span class="ai-desc">Berunding dengan majikan untuk naik gaji (+6–14%)</span>
            </span>
            <span class="ai-right">Rundingan</span>
          </button>
          <button type="button" class="action-item" id="act-retire-job" ${retElig.ok ? '' : 'style="opacity:0.75;"'}>
            <span class="ai-icon">🏖️</span>
            <span class="ai-content">
              <span class="ai-title">Bersara (Pencen)</span>
              <span class="ai-desc">${retElig.ok ? `Layak bersara penuh! Keluarkan Tabung ${Utils.formatMoney(s.retirementFund || 0, s.countryId)} + Ganjaran${isPensionEligible ? ' & Pencen Tahunan (30%–60% gaji)' : ''}` : `Syarat: Umur 55+ (kini ${s.age}) atau 20+ tahun bekerja (kini ${totalYrs} thn)`}</span>
            </span>
            <span class="ai-right" style="color:${retElig.ok ? '#059669' : '#64748b'};font-weight:700;">${retElig.ok ? 'Bersara' : 'Belum Layak'}</span>
          </button>
          <button type="button" class="action-item" id="act-quit-job">
            <span class="ai-icon">🚪</span>
            <span class="ai-content">
              <span class="ai-title">Letak Jawatan / Berhenti Kerja</span>
              <span class="ai-desc">Wajib letak jawatan dahulu sebelum boleh memohon pekerjaan lain di Pasaran Kerja</span>
            </span>
            <span class="ai-right cost">Letak Jawatan</span>
          </button>
        </div>
      `;
    }

    if (s.age < 18) {
      return html + `<div class="info-banner highlight">💼 Pasaran kerja sepenuh masa di ${c.name} dibuka pada umur <strong>18 tahun</strong>. Fokus pada pendidikan &amp; sijil dahulu!</div>`;
    }

    if (s.careerMarket.openings.length === 0 || s.careerMarket.lastMarketYear !== s.year) {
      EduCareerEngine.generateYearlyJobMarket(s);
    }

    const roleLock = EduCareerEngine.getActiveRoleLock(s);
    const rLeft = s.careerMarket.refreshesLeft ?? 2;
    const appsLeft = s.careerMarket.applicationsLeft ?? EduCareerEngine.MAX_APPLICATIONS_YEAR;
    const rejectedIds = s.careerMarket.appliedJobIdsThisYear || [];
    const indFilter = this._industryFilter || 'ALL';
    const openingObjs = s.careerMarket.openings
      .map(id => CareersData.CAREERS.find(x => x.id === id))
      .filter(Boolean);

    const filtered = openingObjs.filter(j => indFilter === 'ALL' || j.industry === indFilter);

    // BANNER AMARAN KUNCI PERANAN KETAT ("WAJIB LETAK JAWATAN DAHULU")
    if (roleLock.locked) {
      html += `
        <div class="info-banner" style="background:#fef2f2;border-color:#fca5a5;color:#7f1d1d;margin-bottom:10px;">
          <strong>🔒 WAJIB LETAK JAWATAN DAHULU!</strong><br/>
          Anda sedang memegang jawatan <strong>${Utils.escapeHtml(roleLock.roleName)}</strong>. Anda mesti letak jawatan atau keluar daripada mod semasa terlebih dahulu sebelum boleh memohon pekerjaan lain.
          <div style="margin-top:8px;">
            ${roleLock.type === 'special_mode'
              ? `<button type="button" class="ghost-btn" id="btn-jump-special-mode-exit" style="border-color:#dc2626;color:#dc2626;font-weight:800;padding:6px 10px;">🚪 Pergi Ke Mod ${Utils.escapeHtml(roleLock.shortName)} Untuk Keluar →</button>`
              : `<button type="button" class="ghost-btn" id="btn-jump-resign-job" style="border-color:#dc2626;color:#dc2626;font-weight:800;padding:6px 10px;">🚪 Letak Jawatan ${Utils.escapeHtml(roleLock.shortName)} Sekarang</button>`
            }
          </div>
        </div>
      `;
    }

    html += `
      <div class="act-engine-header" style="margin-top:4px;">
        <div class="aeh-top">
          <div>
            <div class="aeh-title">💼 Pasaran Kerja ${c.name} ${c.flag} (${openingObjs.length} Jawatan Aktif)</div>
            <div class="aeh-sub">Kuota Permohonan Tahun Ini: <strong>${appsLeft}/${EduCareerEngine.MAX_APPLICATIONS_YEAR}</strong> • Persaingan realistik!</div>
          </div>
          <button type="button" class="reroll-idea-btn" id="btn-refresh-job-market" ${rLeft <= 0 ? 'disabled' : ''}>
            🔄 Segarkan Pasaran (${rLeft}/2)
          </button>
        </div>
      </div>

      <div class="tab-pills" style="margin-bottom:10px;">
        ${CareersData.INDUSTRIES.map(ind => `
          <button type="button" class="tab-pill ind-filter-pill ${ind.id === indFilter ? 'active' : ''}" data-ind="${ind.id}">
            ${ind.icon} ${Utils.escapeHtml(ind.label)}
          </button>
        `).join('')}
      </div>
    `;

    if (filtered.length === 0) {
      html += `<div class="info-banner">Tiada jawatan dalam industri ini pada papan semasa. Pilih <strong>Semua</strong> atau klik <strong>🔄 Segarkan Pasaran Kerja</strong>!</div>`;
      return html;
    }

    html += `<div class="action-list">`;
    filtered.forEach(j => {
      const matched = EduCareerEngine.isCareerFieldMatched(s, j);
      const salary = EduCareerEngine.getCareerSalaryLocal(s, j, 0);
      const reqLvl = EducationData.LEVEL_INFO[j.minEducation] || EducationData.LEVEL_INFO.none;
      const hasCertBonus = (j.preferredCerts || []).some(cid => (s.education.certificates || []).includes(cid));
      const wasRejected = rejectedIds.includes(j.id);
      const isDisabled = roleLock.locked || wasRejected || appsLeft <= 0;
      const fieldStr = j.requiredFields === 'any'
        ? 'Mana-mana bidang'
        : j.requiredFields.map(fid => (EducationData.getField(fid) || { short: fid }).short).join('/');

      html += `
        <button type="button" class="action-item career-apply-btn ${j.isRare ? 'rare-activity' : ''} ${wasRejected ? 'act-done-card' : ''}" data-career-id="${j.id}" ${isDisabled ? 'disabled' : ''}>
          <span class="ai-icon">${j.icon}</span>
          <span class="ai-content">
            <span class="ai-title">
              ${Utils.escapeHtml(j.title)}
              ${j.isRare ? '<span class="rare-gold-tag">🌟 HEADHUNTER</span>' : ''}
            </span>
            <span class="ai-desc">
              ${wasRejected
                ? '<span class="cat-badge" style="background:#fee2e2;color:#b91c1c;">❌ Ditolak / Tiada Maklum Balas</span>'
                : (matched ? '<span class="cat-badge synergy">✓ Sesuai Kelayakan</span>' : `<span class="cat-badge">🔒 ${reqLvl.short}${j.requiredFields !== 'any' ? ` (${fieldStr})` : ''}</span>`)
              }
              ${hasCertBonus && !wasRejected ? '<span class="cat-badge rare">📜 Bonus Sijil!</span>' : ''}
              <br/>${Utils.escapeHtml(j.desc)}
            </span>
          </span>
          <span class="ai-right">
            <span class="act-status-pill ${wasRejected ? 'done' : roleLock.locked ? 'cost' : 'free'}">
              ${wasRejected ? 'Ditolak' : roleLock.locked ? '🔒 Dikunci' : `${Utils.formatMoney(salary, s.countryId)}/thn`}
            </span>
          </span>
        </button>
      `;
    });
    html += `</div>`;
    return html;
  },

  // --------------------------------------------------------------------------
  // TAB 2: PENDIDIKAN SEPANJANG HAYAT (KELAS DEWASA -> DIPLOMA -> DEGREE -> MASTER -> PhD)
  // --------------------------------------------------------------------------
  _renderEducationTab(s, c) {
    const ed = s.education;
    const lvlInfo = EducationData.LEVEL_INFO[ed.educationLevel] || EducationData.LEVEL_INFO.none;
    const fieldObj = ed.educationField ? EducationData.getField(ed.educationField) : null;
    let html = '';

    // 1) Status kanak-kanak / sekolah biasa
    if (ed.stage === 'infant') {
      html += `<div class="info-banner">👶 Anda masih kecil! ${c.education.preschool.name} bermula pada umur ${c.education.preschool.startAge} tahun.</div>`;
      return html;
    }

    if (['preschool', 'primary', 'secondary'].includes(ed.stage) && !ed.activeStudy) {
      html += `
        <div class="info-banner highlight">
          <strong>🏫 ${Utils.escapeHtml(ed.schoolName)}</strong><br/>
          Sedang belajar dalam sistem sekolah ${c.name}. Peperiksaan utama: <strong>${c.education.secondary.examName}</strong> (umur ${c.education.secondary.examAge}).
        </div>
        <div class="action-list">
          <button type="button" class="action-item" id="act-study-hard" ${s.yearlyActions.studyHard ? 'disabled' : ''}>
            <span class="ai-icon">📖</span>
            <span class="ai-content">
              <span class="ai-title">Belajar Bersungguh-sungguh</span>
              <span class="ai-desc">Tingkatkan Kepintaran &amp; peluang biasiswa masa depan</span>
            </span>
            <span class="ai-right">Pintar ++</span>
          </button>
        </div>
      `;
      return html;
    }

    // 2) Status pendidikan semasa dewasa
    const finalCgpaVal = typeof ed.graduatedCgpa === 'number' ? ed.graduatedCgpa : null;
    html += `
      <div class="info-banner highlight">
        <strong>${lvlInfo.icon} Tahap Akademik Tertinggi: ${lvlInfo.label}</strong>${fieldObj ? ` (${fieldObj.icon} ${fieldObj.name})` : ''}
        ${ed.hasDeansAward ? ` <span class="cat-badge rare">🏅 Anugerah Dekan (${ed.deansAwardCount || 1}x)</span>` : ''}<br/>
        Kepintaran: <strong>${s.stats.smarts}%</strong>${finalCgpaVal !== null ? ` • PNGK Akhir: <strong>${finalCgpaVal.toFixed(2)}</strong>` : ''} • Sijil Dimiliki: <strong>${ed.certificates.length}</strong>${ed.educationLoan > 0 ? ` • Hutang Pengajian: <strong>${Utils.formatMoney(ed.educationLoan, s.countryId)}</strong>` : ''}
      </div>
    `;

    // 3) Jika sedang dalam pengajian aktif
    if (ed.activeStudy) {
      const st = ed.activeStudy;
      const prog = EducationData.PROGRAMS.find(p => p.id === st.level);
      const pct = Math.min(100, Math.round((st.yearsCompleted / st.totalYears) * 100));
      const cgpaNum = Number((st.currentCgpa ?? st.gpa ?? 3.15).toFixed(2));
      const didStudy = Boolean(st.studiedThisYear || ed.studiedThisYear || s.yearlyActions.studyHard);
      const cgpaBadgeStyle = cgpaNum >= 4.0
        ? 'background:#fef3c7;color:#92400e;border:1px solid #f59e0b;'
        : cgpaNum < 2.0
          ? 'background:#fee2e2;color:#b91c1c;border:1px solid #fca5a5;'
          : '';
      html += `
        <div class="career-active-card">
          <div class="cac-top">
            <div>
              <div class="cac-title">${prog ? prog.icon : '🎓'} ${Utils.escapeHtml(prog ? prog.title : st.level)} — ${Utils.escapeHtml(st.fieldName)}</div>
              <div class="cac-sub">${Utils.escapeHtml(st.institution)} • ${st.mode === 'part_time' ? 'Separuh Masa (Sambil Bekerja)' : 'Sepenuh Masa'} • ${Utils.escapeHtml(st.fundingLabel)}</div>
            </div>
            <span class="cat-badge synergy" ${cgpaBadgeStyle ? `style="${cgpaBadgeStyle}"` : ''}>PNGK ${cgpaNum.toFixed(2)}${cgpaNum >= 4.0 ? ' 🏅' : ''}</span>
          </div>
          <div style="margin-top:8px;">
            <div class="ph-bar-lbl"><span>Kemajuan Pengajian</span><strong>Tahun ${st.yearsCompleted}/${st.totalYears} (${pct}%)</strong></div>
            <div class="mini-track" style="height:8px;"><div class="mini-fill" style="width:${pct}%;background:#3b82f6;"></div></div>
          </div>
          ${!didStudy ? `
            <div style="margin-top:8px;padding:7px 10px;border-radius:8px;background:#fef2f2;border:1px solid #fecaca;color:#b91c1c;font-size:12px;font-weight:600;">
              ⚠️ Anda belum mengulang kaji tahun ini! PNGK akan jatuh mendadak (-0.50 hingga -0.80) jika anda terus +UMUR tanpa belajar.
            </div>
          ` : `
            <div style="margin-top:8px;padding:6px 10px;border-radius:8px;background:#f0fdf4;border:1px solid #bbf7d0;color:#166534;font-size:12px;font-weight:600;">
              ✅ Usaha ulang kaji tahun ini direkodkan — PNGK akan meningkat/kekal pada +UMUR nanti.
            </div>
          `}
          ${cgpaNum < 2.0 ? `<div class="cac-next" style="color:#b91c1c;font-weight:700;">⚠️ Amaran Akademik: PNGK di bawah 2.00 — risiko gagal &amp; mengulang tahun!</div>` : ''}
          ${st.level === 'phd' ? `<div class="cac-next">📄 Penerbitan Jurnal PhD: <strong>${st.publications || 0} kertas</strong> • Ujian Viva menanti pada tahun akhir!</div>` : ''}
        </div>
        <div class="action-list">
          <button type="button" class="action-item" id="act-study-hard" ${didStudy ? 'disabled' : ''}>
            <span class="ai-icon">📖</span>
            <span class="ai-content">
              <span class="ai-title">Belajar / Ulang Kaji</span>
              <span class="ai-desc">${didStudy ? 'Sudah mengulang kaji tahun ini (Kepintaran & PNGK meningkat)' : 'Naikkan Kepintaran & PNGK hingga 4.00 (Anugerah Dekan) • Sedikit stres'}</span>
            </span>
            <span class="ai-right">${didStudy ? '✓ Selesai' : 'PNGK +'}</span>
          </button>
        </div>
      `;
      return html;
    }

    // 4) Borang Pendaftaran Pembelajaran Sepanjang Hayat (Dewasa / Peluang Kedua -> PhD)
    const selField = this._selectedField || 'computer_science';
    const selMode = this._selectedMode || 'full_time';
    const selFund = this._selectedFunding || 'cash';
    const famOk = EduCareerEngine.canUseFamilyFunding(s);

    html += `
      <div class="section-heading">⚙️ Tetapan Pendaftaran Pengajian</div>
      <div class="edu-config-box">
        <label class="edu-lbl">1. Pilih Bidang / Jurusan (10 Bidang):</label>
        <select id="edu-field-select" class="input-field" style="width:100%;margin-bottom:8px;">
          ${EducationData.FIELDS.map(f => `<option value="${f.id}" ${f.id === selField ? 'selected' : ''}>${f.icon} ${Utils.escapeHtml(f.name)}</option>`).join('')}
        </select>

        <label class="edu-lbl">2. Mod Pengajian:</label>
        <div class="tab-pills" style="margin-bottom:8px;">
          <button type="button" class="tab-pill edu-mode-btn ${selMode === 'full_time' ? 'active' : ''}" data-emode="full_time">🏫 Sepenuh Masa</button>
          <button type="button" class="tab-pill edu-mode-btn ${selMode === 'part_time' ? 'active' : ''}" data-emode="part_time">🌙 Separuh Masa (+1 thn, Kekal Kerja)</button>
        </div>

        <label class="edu-lbl">3. Kaedah Pembiayaan Yuran:</label>
        <div class="tab-pills">
          <button type="button" class="tab-pill edu-fund-btn ${selFund === 'cash' ? 'active' : ''}" data-efund="cash">💵 Bayar Tunai</button>
          <button type="button" class="tab-pill edu-fund-btn ${selFund === 'scholarship' ? 'active' : ''}" data-efund="scholarship">🏆 Mohon Biasiswa</button>
          <button type="button" class="tab-pill edu-fund-btn ${selFund === 'loan' ? 'active' : ''}" data-efund="loan">🏦 Pinjaman Pendidikan</button>
          <button type="button" class="tab-pill edu-fund-btn ${selFund === 'family' ? 'active' : ''}" data-efund="family" ${!famOk ? 'disabled' : ''}>👨‍👩‍👧 Tajaan Keluarga</button>
        </div>
      </div>

      <div class="section-heading">🎓 Pilih Peringkat Pengajian</div>
      <div class="action-list">
    `;

    EducationData.PROGRAMS.forEach(prog => {
      const elig = EduCareerEngine.checkProgramEligibility(s, prog.id, prog.needsField ? selField : null);
      const yrs = EduCareerEngine.getProgramDuration(s, prog.id, prog.needsField ? selField : null, selMode);
      const tuition = EduCareerEngine.getTuitionAnnual(s, prog.id, prog.needsField ? selField : null);
      const isFastTrack = prog.id === 'bachelor' && ed.educationLevel === 'diploma' && ed.educationField === selField;

      html += `
        <button type="button" class="action-item edu-enroll-btn" data-level="${prog.id}" ${!elig.ok ? 'disabled' : ''}>
          <span class="ai-icon">${prog.icon}</span>
          <span class="ai-content">
            <span class="ai-title">
              ${Utils.escapeHtml(prog.title)}
              ${isFastTrack ? '<span class="cat-badge synergy">⚡ Laluan Pantas 2 Thn!</span>' : ''}
            </span>
            <span class="ai-desc">
              ${elig.ok ? `<span class="cat-badge synergy">✓ Layak • ${yrs} Tahun</span>` : `<span class="cat-badge">🔒 ${Utils.escapeHtml(elig.reason)}</span>`}
              <br/>${Utils.escapeHtml(prog.desc)}
            </span>
          </span>
          <span class="ai-right">
            <span class="act-status-pill cost">${Utils.formatMoney(tuition, s.countryId)}/thn</span>
          </span>
        </button>
      `;
    });

    html += `</div>`;
    return html;
  },

  // --------------------------------------------------------------------------
  // TAB 3: SIJIL PROFESIONAL & KEMAHIRAN (28 SIJIL BERASASKAN BIDANG)
  // --------------------------------------------------------------------------
  _renderCertsTab(s, c) {
    const ed = s.education;
    const groups = [...new Set(EducationData.CERTIFICATES.map(x => x.group))];
    let html = `
      <div class="info-banner highlight">
        <strong>📜 Sijil Profesional &amp; Kemahiran (${ed.certificates.length}/${EducationData.CERTIFICATES.length} Dimiliki)</strong><br/>
        Sijil yang sepadan dengan bidang anda membuka kerjaya pakar dan memberi <strong>bonus gaji &amp; temu duga +10% hingga +25%</strong>!
      </div>
    `;

    groups.forEach(grp => {
      const list = EducationData.CERTIFICATES.filter(x => x.group === grp);
      html += `<div class="section-heading">📂 ${Utils.escapeHtml(grp)}</div><div class="action-list">`;
      list.forEach(cert => {
        const owned = ed.certificates.includes(cert.id);
        const elig = EduCareerEngine.checkCertificateEligibility(s, cert);
        const costLocal = Utils.usdToLocal(cert.costUsd, s.countryId);

        html += `
          <button type="button" class="action-item cert-take-btn ${owned ? 'act-done-card' : ''}" data-cert-id="${cert.id}" ${owned || !elig.ok || s.yearlyActions.tookCert ? 'disabled' : ''}>
            <span class="ai-icon">${cert.icon}</span>
            <span class="ai-content">
              <span class="ai-title">${Utils.escapeHtml(cert.title)}</span>
              <span class="ai-desc">
                ${owned ? '<span class="cat-badge synergy">✓ Dimiliki</span>' : elig.ok ? `<span class="cat-badge synergy">✓ Layak • Gaji +${cert.salaryBonusPct}%</span>` : `<span class="cat-badge">🔒 ${Utils.escapeHtml(elig.reason)}</span>`}
                <br/>${Utils.escapeHtml(cert.desc)}
              </span>
            </span>
            <span class="ai-right">
              <span class="act-status-pill ${owned ? 'done' : 'cost'}">${owned ? '✓ Lulus' : Utils.formatMoney(costLocal, s.countryId)}</span>
            </span>
          </button>
        `;
      });
      html += `</div>`;
    });

    return html;
  },

  // --------------------------------------------------------------------------
  // TAB 4: REKOD AKADEMIK, SIJIL & PINJAMAN PENDIDIKAN
  // --------------------------------------------------------------------------
  _renderRecordTab(s, c) {
    const ed = s.education;
    const lvlInfo = EducationData.LEVEL_INFO[ed.educationLevel] || EducationData.LEVEL_INFO.none;
    let html = `
      <div class="info-banner highlight">
        <strong>🎓 Profil Akademik ${Utils.escapeHtml(EduCareerEngine.getDisplayName(s))}</strong>
        ${ed.hasDeansAward ? ` <span class="cat-badge rare">🏅 Anugerah Dekan (${ed.deansAwardCount || 1}x)</span>` : ''}<br/>
        Tahap Tertinggi: <strong>${lvlInfo.icon} ${lvlInfo.label}</strong>${typeof ed.graduatedCgpa === 'number' ? ` • PNGK Akhir: <strong>${ed.graduatedCgpa.toFixed(2)}</strong>` : ''}<br/>
        Baki Pinjaman Pendidikan: <strong>${Utils.formatMoney(ed.educationLoan || 0, s.countryId)}</strong>
      </div>
    `;

    html += `<div class="section-heading">🏛️ Ijazah &amp; Kelayakan Tamat (${ed.completedDegrees.length})</div>`;
    if (ed.completedDegrees.length === 0) {
      html += `<div class="info-banner">Belum ada diploma atau ijazah tamat lagi.</div>`;
    } else {
      ed.completedDegrees.forEach(d => {
        const dGpa = typeof d.gpa === 'number' ? d.gpa.toFixed(2) : d.gpa;
        html += `
          <div class="info-banner">
            <strong>🎓 ${Utils.escapeHtml(d.title || d.level)} — ${Utils.escapeHtml(d.fieldName || 'Am')}</strong>${(d.deansAward || Number(d.gpa) >= 4.0) ? ' <span class="cat-badge rare">🏅 Anugerah Dekan</span>' : ''}<br/>
            ${Utils.escapeHtml(d.institution)} • Tahun ${d.year} • PNGK ${dGpa}${d.publications ? ` • ${d.publications} Jurnal` : ''}
          </div>
        `;
      });
    }

    html += `<div class="section-heading">📜 Sijil Profesional Dimiliki (${ed.certificates.length})</div>`;
    if (ed.certificates.length === 0) {
      html += `<div class="info-banner">Belum ada sijil profesional. Buka tab Sijil &amp; Kursus untuk meningkatkan nilai kerjaya anda!</div>`;
    } else {
      ed.certificates.forEach(cid => {
        const co = EducationData.CERTIFICATES.find(x => x.id === cid);
        if (!co) return;
        html += `
          <div class="info-banner">
            <strong>${co.icon} ${Utils.escapeHtml(co.title)}</strong><br/>
            Bonus Gaji +${co.salaryBonusPct}% • Bonus Temu Duga +${co.interviewBonus}%
          </div>
        `;
      });
    }

    const chList = Array.isArray(s.careerHistory) ? s.careerHistory : [];
    html += `<div class="section-heading">🏖️ Rekod Kerjaya &amp; Persaraan (${chList.length})</div>`;
    html += `
      <div class="info-banner" style="background:#f8fafc;">
        Jumlah Tahun Bekerja: <strong>${s.totalYearsWorked || 0} tahun</strong> •
        Tabung Persaraan (${Utils.escapeHtml(c.retirementScheme || 'KWSP')}): <strong>${Utils.formatMoney(s.retirementFund || 0, s.countryId)}</strong> •
        Pencen Tahunan: <strong>${(s.pensionAnnual || 0) > 0 ? `${Utils.formatMoney(s.pensionAnnual, s.countryId)}/thn` : 'Tiada'}</strong>
      </div>
    `;
    if (chList.length > 0) {
      chList.forEach(ch => {
        const yrsRole = ch.years ?? ch.yearsInRole ?? 0;
        const retAge = ch.ageRetired ?? ch.retiredAge ?? s.age;
        const retYear = ch.yearRetired ?? ch.retiredYear ?? s.year;
        const lump = ch.lumpSumPaid ?? ch.totalLumpSum ?? 0;
        const stLabel = ch.status || (lump > 0 || ch.pensionAnnual > 0 ? 'Bersara' : 'Tamat');
        html += `
          <div class="info-banner">
            <strong>${stLabel === 'Bersara' ? '🏖️' : '💼'} ${Utils.escapeHtml(ch.title)}</strong> <span class="cat-badge synergy">${Utils.escapeHtml(stLabel)}</span><br/>
            Tempoh: ${yrsRole} thn • Gaji Akhir: ${Utils.formatMoney(ch.finalSalary || 0, s.countryId)}/thn • Umur ${retAge} (${retYear})
            ${(ch.pensionAnnual > 0 || lump > 0) ? `<br/><small style="color:#059669;font-weight:700;">${ch.pensionAnnual > 0 ? `Pencen: ${Utils.formatMoney(ch.pensionAnnual, s.countryId)}/thn • ` : ''}Ganjaran &amp; Tabung: ${Utils.formatMoney(lump, s.countryId)}</small>` : ''}
          </div>
        `;
      });
    }

    return html;
  },

  // --------------------------------------------------------------------------
  // IKATAN PENDENGAR ACARA
  // --------------------------------------------------------------------------
  _bindHandlers(s, c, tab) {
    document.querySelectorAll('.career-tab-pill').forEach(pill => {
      pill.addEventListener('click', () => this.showHub(pill.dataset.ctab));
    });

    if (tab === 'jobs') {
      const openEduBtn = document.getElementById('btn-jobs-open-edu');
      if (openEduBtn) openEduBtn.addEventListener('click', () => this.showHub('education'));

      const openCertsBtn = document.getElementById('btn-jobs-open-certs');
      if (openCertsBtn) openCertsBtn.addEventListener('click', () => this.showHub('certs'));

      const workBtn = document.getElementById('act-work-hard');
      if (workBtn) workBtn.addEventListener('click', () => {
        const res = Sim.workHarder();
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showHub('jobs');
      });

      const netBtn = document.getElementById('act-work-network');
      if (netBtn) netBtn.addEventListener('click', () => {
        const res = EduCareerEngine.networkAtWork();
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showHub('jobs');
      });

      const raiseBtn = document.getElementById('act-raise');
      if (raiseBtn) raiseBtn.addEventListener('click', () => {
        const res = Sim.askForRaise();
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showHub('jobs');
      });

      const retireBtn = document.getElementById('act-retire-job');
      if (retireBtn) retireBtn.addEventListener('click', () => {
        const res = EduCareerEngine.retireFromJob(s);
        App.toast(res.msg, res.ok ? 'gold' : 'error');
        if (res.ok) {
          this._browsingNewJob = false;
          App.renderAll();
          this.showHub('jobs');
        }
      });

      const quitJobAction = () => {
        if (!s.job) return;
        if (!Array.isArray(s.careerHistory)) s.careerHistory = [];
        s.careerHistory.push({
          title: s.job.title,
          careerId: s.job.careerId || s.job.id || 'job',
          yearsInRole: s.job.years || 0,
          totalYearsWorked: s.totalYearsWorked || s.job.years || 0,
          finalSalary: s.job.salary || 0,
          retiredAge: s.age,
          retiredYear: s.year,
          pensionAnnual: 0,
          totalLumpSum: 0,
          status: 'Letak Jawatan'
        });
        GameState.addJournalEntry(`🚪 Anda meletak jawatan sebagai ${s.job.title}.`, 'culture');
        s.job = null;
        s.yearsInCurrentJob = 0;
        this._browsingNewJob = false;
        GameState.save();
        App.renderAll();
        App.toast('Anda telah meletak jawatan — Pasaran Kerja kini dibuka semula!', 'culture');
        this.showHub('jobs');
      };

      const quitBtn = document.getElementById('act-quit-job');
      if (quitBtn) quitBtn.addEventListener('click', quitJobAction);

      const jumpResignBtn = document.getElementById('btn-jump-resign-job');
      if (jumpResignBtn) jumpResignBtn.addEventListener('click', quitJobAction);

      const jumpSpBtn = document.getElementById('btn-jump-special-mode-exit');
      if (jumpSpBtn) jumpSpBtn.addEventListener('click', () => {
        if (window.SpecialModeModals) SpecialModeModals.showDashboard();
      });

      const refBtn = document.getElementById('btn-refresh-job-market');
      if (refBtn) refBtn.addEventListener('click', () => {
        const res = EduCareerEngine.refreshJobMarket();
        App.toast(res.msg, res.ok ? 'culture' : 'error');
        this.showHub('jobs');
      });

      document.querySelectorAll('.ind-filter-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          this._industryFilter = pill.dataset.ind || 'ALL';
          this.showHub('jobs');
        });
      });

      document.querySelectorAll('.career-apply-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const res = EduCareerEngine.applyForCareer(btn.dataset.careerId);
          App.renderAll();
          if (res.interviewEvent) {
            this._browsingNewJob = false;
            Modals.showEvent(res.interviewEvent);
            return;
          }
          App.toast(res.msg, res.ok ? 'success' : 'error');
          if (res.ok) this._browsingNewJob = false;
          this.showHub('jobs');
        });
      });
    } else if (tab === 'education') {
      const studyBtn = document.getElementById('act-study-hard');
      if (studyBtn) studyBtn.addEventListener('click', () => {
        const res = EduCareerEngine.studyHarder();
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showHub('education');
      });

      const fieldSel = document.getElementById('edu-field-select');
      if (fieldSel) fieldSel.addEventListener('change', (e) => {
        this._selectedField = e.target.value;
        this.showHub('education');
      });

      document.querySelectorAll('.edu-mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this._selectedMode = btn.dataset.emode;
          this.showHub('education');
        });
      });

      document.querySelectorAll('.edu-fund-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this._selectedFunding = btn.dataset.efund;
          this.showHub('education');
        });
      });

      document.querySelectorAll('.edu-enroll-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const level = btn.dataset.level;
          const prog = EducationData.PROGRAMS.find(p => p.id === level);
          const res = EduCareerEngine.enrollProgram({
            level,
            fieldId: prog && prog.needsField ? this._selectedField : null,
            mode: this._selectedMode,
            funding: this._selectedFunding
          });
          App.toast(res.msg, res.ok ? 'success' : 'error');
          App.renderAll();
          this.showHub('education');
        });
      });
    } else if (tab === 'certs') {
      document.querySelectorAll('.cert-take-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const res = EduCareerEngine.takeCertificate(btn.dataset.certId);
          App.toast(res.msg, res.ok ? 'success' : 'error');
          App.renderAll();
          this.showHub('certs');
        });
      });
    }
  }
};
