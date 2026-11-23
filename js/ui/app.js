/* ==========================================================================
   WorldLife — Pengawal UI Utama & Tema Negara Dinamik (Bahasa Melayu)
   ========================================================================== */

window.App = {
  creator: {
    countryId: 'MY',
    gender: 'male',
    heritageId: 'malay'
  },

  init() {
    if (Utils.loadMutePref) Utils.loadMutePref();
    this._bindGlobalEvents();
    this._initCreator();
    this._bindEntryGate();
    this._bindFirebaseListeners();

    if (window.FirebaseService && FirebaseService.isLoggedIn()) {
      GameState.setGuestMode(false);
      GameState.load();
      this.showStartScreen();
    } else {
      this.showEntryGate();
    }
  },

  _bindEntryGate() {
    const gateLoginBtn = document.getElementById('btn-gate-google-login');
    if (gateLoginBtn) {
      gateLoginBtn.addEventListener('click', async () => {
        if (!window.FirebaseService) {
          this.toast('Memuatkan Firebase... Sila cuba sebentar lagi.', 'error');
          return;
        }
        const res = await FirebaseService.signInWithGoogle();
        this.toast(res.msg, res.ok ? 'success' : 'error');
        this._renderEntryGateError();
        if (res.ok && !res.redirecting) {
          GameState.setGuestMode(false);
          this.updateGuestBanner();
          this.showStartScreen();
        }
      });
    }

    const gateGuestBtn = document.getElementById('btn-gate-guest-mode');
    if (gateGuestBtn) {
      gateGuestBtn.addEventListener('click', () => {
        this.showGuestWarningModal();
      });
    }

    const guestBannerLogin = document.getElementById('btn-guest-banner-login');
    if (guestBannerLogin) {
      guestBannerLogin.addEventListener('click', async () => {
        if (!window.FirebaseService) {
          this.toast('Memuatkan Firebase... Sila cuba sebentar lagi.', 'error');
          return;
        }
        const res = await FirebaseService.signInWithGoogle();
        this.toast(res.msg, res.ok ? 'success' : 'error');
        if (res.ok && !res.redirecting) {
          GameState.setGuestMode(false);
          this.updateGuestBanner();
          this.renderStartAuthBar();
        } else {
          this.renderStartAuthBar();
        }
      });
    }
  },

  _renderEntryGateError() {
    const box = document.getElementById('entry-gate-error');
    if (!box) return;
    const fb = window.FirebaseService;
    const authErr = fb && fb.lastAuthError ? fb.lastAuthError : null;
    if (!authErr) {
      box.innerHTML = '';
      return;
    }
    const errHost = authErr.hostname || (window.location && window.location.hostname) || '';
    box.innerHTML = `
      <div style="margin-top:10px;padding:9px 11px;border-radius:10px;background:#fef2f2;border:1px solid #fecaca;color:#991b1b;font-size:12px;line-height:1.48;">
        <strong>⚠️ Log Masuk Google Gagal</strong><br/>
        Kod Ralat: <code style="background:#fee2e2;padding:1px 5px;border-radius:4px;font-weight:700;">${Utils.escapeHtml(authErr.code)}</code><br/>
        Domain Semasa: <code style="background:#fee2e2;padding:1px 5px;border-radius:4px;font-weight:700;user-select:all;">${Utils.escapeHtml(errHost)}</code><br/>
        <span style="display:block;margin-top:4px;color:#7f1d1d;">${Utils.escapeHtml(authErr.hint || authErr.msg)}</span>
      </div>
    `;
  },

  showEntryGate() {
    const gate = document.getElementById('entry-gate-screen');
    if (gate) gate.classList.remove('hidden');
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-header').classList.add('hidden');
    document.getElementById('life-feed-container').classList.add('hidden');
    document.getElementById('game-footer').classList.add('hidden');
    this.updateGuestBanner();
    this._renderEntryGateError();
  },

  showGuestWarningModal() {
    Modals.open({
      icon: '⚠️',
      title: '⚠️ Amaran Mod Tetamu',
      subtitle: 'Progres & fail simpanan tidak akan disimpan',
      bodyHtml: `
        <div class="info-banner" style="background:#fffbeb;border-color:#fde68a;color:#92400e;line-height:1.55;">
          Dalam Mod Tetamu, fail simpanan dan progres kehidupan anda <strong>TIDAK akan disimpan</strong>. Semua data akan hilang apabila laman ditutup atau dimuat semula. Log masuk dengan Google jika anda mahu menyimpan progres anda di Cloud.
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:12px;">
          <button type="button" id="btn-guest-warn-login" class="primary-btn" style="width:100%;">
            Kembali &amp; Log Masuk Google
          </button>
          <button type="button" id="btn-guest-warn-confirm" class="secondary-btn" style="width:100%;color:#b45309;border-color:#f59e0b;background:#fffbeb;font-weight:700;">
            Faham, Teruskan Mod Tetamu
          </button>
        </div>
      `
    });

    document.getElementById('btn-guest-warn-login').addEventListener('click', async () => {
      Modals.close(true);
      if (window.FirebaseService) {
        const res = await FirebaseService.signInWithGoogle();
        this.toast(res.msg, res.ok ? 'success' : 'error');
        this._renderEntryGateError();
        if (res.ok && !res.redirecting) {
          GameState.setGuestMode(false);
          this.updateGuestBanner();
          this.showStartScreen();
        }
      }
    });

    document.getElementById('btn-guest-warn-confirm').addEventListener('click', () => {
      Modals.close(true);
      this.enterGuestMode();
    });
  },

  enterGuestMode() {
    GameState.setGuestMode(true);
    this.updateGuestBanner();
    this.showStartScreen();
    this.toast('👤 Mod Tetamu aktif — progres sesi ini tidak akan disimpan.', 'culture');
  },

  updateGuestBanner() {
    const banner = document.getElementById('guest-mode-banner');
    if (!banner) return;
    const isGuest = Boolean(window.GameState && GameState.isGuest());
    banner.classList.toggle('hidden', !isGuest);
    const contBtn = document.getElementById('btn-continue-life');
    if (contBtn) contBtn.classList.toggle('hidden', isGuest);
  },

  _bindFirebaseListeners() {
    const attach = () => {
      if (!window.FirebaseService || this._fbListenersBound) return;
      this._fbListenersBound = true;
      FirebaseService.onAuthChange((user) => {
        const nextUid = user && user.uid ? user.uid : null;
        if (this._lastAuthUid !== undefined && this._lastAuthUid !== nextUid) {
          GameState.resetSessionState({ clearCurrent: true });
        }
        this._lastAuthUid = nextUid;
        if (user) {
          GameState.setGuestMode(false);
          this.updateGuestBanner();
          const gate = document.getElementById('entry-gate-screen');
          if (gate && !gate.classList.contains('hidden')) {
            GameState.load();
            this.showStartScreen();
          }
        }
        this._renderEntryGateError();
        this.renderStartAuthBar();
      });
      FirebaseService.onSyncStateChange(() => {
        this.renderStartAuthBar();
      });
    };
    attach();
    if (!this._fbListenersBound) {
      window.addEventListener('load', attach, { once: true });
      setTimeout(attach, 400);
    }
  },

  renderStartAuthBar() {
    const bar = document.getElementById('auth-cloud-bar');
    const slotBadge = document.getElementById('creator-slot-badge');
    if (slotBadge && window.GameState) {
      const slotNum = GameState.getActiveSlotId().replace('slot_', '');
      slotBadge.innerHTML = `📂 Slot Sasaran Semasa: <strong>Slot ${slotNum}</strong> <span style="opacity:0.75;">(Tukar di "Sambung Kehidupan Disimpan")</span>`;
    }
    if (!bar) return;

    const fb = window.FirebaseService;
    if (fb && fb.isLoggedIn()) {
      const u = fb.user;
      const syncLabel = fb.syncState === 'syncing'
        ? '🔄 Menyegerak...'
        : fb.syncState === 'error'
          ? '⚠️ Ralat Sync'
          : '☁️ Disegerakkan';
      const avatarHtml = u.photoURL
        ? `<img src="${Utils.escapeHtml(u.photoURL)}" alt="" style="width:28px;height:28px;border-radius:999px;object-fit:cover;flex-shrink:0;" referrerpolicy="no-referrer" />`
        : `<span style="width:28px;height:28px;border-radius:999px;background:#e0e7ff;display:grid;place-items:center;font-size:14px;flex-shrink:0;">👤</span>`;
      bar.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 10px;border-radius:12px;background:#f8fafc;border:1px solid #e2e8f0;flex-wrap:wrap;">
          <div style="display:flex;align-items:center;gap:8px;min-width:0;">
            ${avatarHtml}
            <div style="min-width:0;">
              <div style="font-size:12.5px;font-weight:700;color:#0f172a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${Utils.escapeHtml(u.displayName || u.email || 'Pengguna Google')}</div>
              <div style="font-size:11px;color:${fb.syncState === 'error' ? '#dc2626' : '#16a34a'};font-weight:600;">${syncLabel}</div>
            </div>
          </div>
          <button type="button" id="btn-start-logout" class="secondary-btn" style="padding:5px 10px;font-size:11.5px;">Log Keluar</button>
        </div>
      `;
      const logoutBtn = document.getElementById('btn-start-logout');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
          const res = await FirebaseService.signOutUser();
          if (res.ok) {
            GameState.resetSessionState({ clearCurrent: true });
          }
          this.toast(res.msg, res.ok ? 'culture' : 'error');
          this.renderStartAuthBar();
        });
      }
    } else {
      const authErr = fb && fb.lastAuthError ? fb.lastAuthError : null;
      const errHost = (authErr && authErr.hostname) || (window.location && window.location.hostname) || '';
      const errBoxHtml = authErr ? `
        <div id="auth-error-box" style="margin-top:8px;padding:9px 11px;border-radius:10px;background:#fef2f2;border:1px solid #fecaca;color:#991b1b;font-size:12px;line-height:1.48;">
          <strong>⚠️ Log Masuk Google Gagal</strong><br/>
          Kod Ralat: <code style="background:#fee2e2;padding:1px 5px;border-radius:4px;font-weight:700;">${Utils.escapeHtml(authErr.code)}</code><br/>
          Domain Semasa: <code style="background:#fee2e2;padding:1px 5px;border-radius:4px;font-weight:700;user-select:all;">${Utils.escapeHtml(errHost)}</code><br/>
          <span style="display:block;margin-top:4px;color:#7f1d1d;">${Utils.escapeHtml(authErr.hint || authErr.msg)}</span>
        </div>
      ` : '';
      bar.innerHTML = `
        <button type="button" id="btn-start-google-login" class="secondary-btn" style="width:100%;display:flex;align-items:center;justify-content:center;gap:6px;padding:9px 12px;font-weight:700;">
          🔐 Log Masuk dengan Google (Cloud Save)
        </button>
        ${errBoxHtml}
      `;
      const loginBtn = document.getElementById('btn-start-google-login');
      if (loginBtn) {
        loginBtn.addEventListener('click', async () => {
          if (!window.FirebaseService) {
            this.toast('Memuatkan Firebase... Sila cuba sebentar lagi.', 'error');
            return;
          }
          const res = await FirebaseService.signInWithGoogle();
          this.toast(res.msg, res.ok ? 'success' : 'error');
          this.renderStartAuthBar();
          if (res.ok && !res.redirecting && window.Modals && Modals.showSaveSlotsModal) {
            Modals.showSaveSlotsModal();
          }
        });
      }
    }
  },

  // Pendengar global tunggal (didaftarkan sekali sahaja — tiada pendengar berganda)
  _bindPerfAndSoundListeners() {
    if (this._perfBound) return;
    this._perfBound = true;

    // Satu pendengar klik terwakil untuk bunyi klik halus pada semua butang
    document.addEventListener('click', (e) => {
      const btn = e.target && e.target.closest ? e.target.closest('button') : null;
      if (btn && !btn.disabled && btn.id !== 'btn-age-up') Utils.playTone('click');
    }, { passive: true });

    // Pastikan simpanan tertangguh ditulis sebelum tab ditutup / disembunyikan (mudah alih)
    const flush = () => { if (GameState.current) GameState.flushSave(); };
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flush();
    });
  },

  _bindGlobalEvents() {
    this._bindPerfAndSoundListeners();
    document.getElementById('modal-close').addEventListener('click', () => Modals.close());
    document.getElementById('modal-backdrop').addEventListener('click', (e) => {
      if (e.target.id === 'modal-backdrop') Modals.close();
    });

    document.getElementById('btn-menu').addEventListener('click', () => Modals.showMenu());
    document.getElementById('btn-passport').addEventListener('click', () => Modals.showActivities('passport'));
    document.getElementById('char-avatar').addEventListener('click', () => Modals.showActivities('passport'));
    document.getElementById('btn-open-legacy').addEventListener('click', () => {
      if (GameState.current && GameState.current.alive && window.LegacyModals) LegacyModals.showFamilyLegacy();
    });
    document.getElementById('btn-open-modes').addEventListener('click', () => {
      if (GameState.current && GameState.current.alive && window.SpecialModeModals) SpecialModeModals.showDashboard();
    });
    document.getElementById('btn-open-social').addEventListener('click', () => {
      if (GameState.current && GameState.current.alive) ModeModals.showSocialHub('social');
    });
    document.getElementById('prison-alert-bar').addEventListener('click', () => {
      if (GameState.current && GameState.current.alive && window.PrisonModals) PrisonModals.showPrisonHub();
    });
    document.getElementById('fugitive-alert-bar').addEventListener('click', () => {
      if (GameState.current && GameState.current.alive && window.PrisonModals) PrisonModals.showFugitiveHub('overview');
    });

    document.getElementById('btn-age-up').addEventListener('click', () => this.handleAgeUp());

    document.querySelectorAll('.dock-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        if (!GameState.current || !GameState.current.alive) return;
        const pr = GameState.current.prison;
        if (pr && pr.inPrison && pr.yearsLeft > 0 && tab !== 'relationships' && window.PrisonModals) {
          PrisonModals.showDetentionActivities();
          return;
        }
        if (tab === 'occupation') Modals.showOccupation();
        else if (tab === 'assets') Modals.showAssets();
        else if (tab === 'relationships') Modals.showRelationships();
        else if (tab === 'activities') Modals.showActivities('deck');
      });
    });
  },

  _initCreator() {
    this.creator.continent = 'ALL';
    this.creator.search = '';

    // Papar kata-kata hikmah "new_life" pada skrin permulaan
    const quoteWrap = document.getElementById('start-quote-wrap');
    if (quoteWrap && window.Quotes) {
      quoteWrap.innerHTML = Quotes.renderQuoteCard(Quotes.getByCategory('new_life'), 'Inspirasi Permulaan');
    }

    // Kemas kini jumlah negara dinamik
    const countEl = document.getElementById('hero-country-count');
    if (countEl) countEl.textContent = String(Object.keys(window.COUNTRIES).length);

    // Butang Negara Rawak (had maksimum 3 kali rawak)
    const randCountryBtn = document.getElementById('btn-random-country');
    if (randCountryBtn) {
      randCountryBtn.addEventListener('click', () => {
        if ((this.creator.rerollsLeft ?? 0) <= 0) return;
        const picked = this._rollRandomCountry(true);
        if (!picked) return;
        this.creator.rerollsLeft = Math.max(0, (this.creator.rerollsLeft ?? 3) - 1);
        this._syncCreatorCountry();
        this._updateRandomCountryBtn();
        this.toast(`🎲 Negara rawak terpilih: ${picked.flag} ${picked.name}!`, 'culture');
      });
    }

    document.querySelectorAll('#gender-toggle .pill-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        this.creator.gender = btn.dataset.gender;
        document.querySelectorAll('#gender-toggle .pill-opt').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this._refreshRandomPlaceholder();
      });
    });

    document.getElementById('heritage-select').addEventListener('change', (e) => {
      this.creator.heritageId = e.target.value;
      this._refreshRandomPlaceholder();
    });

    document.getElementById('btn-random-name').addEventListener('click', () => {
      const name = Utils.generateName(this.creator.countryId, this.creator.gender, this.creator.heritageId);
      document.getElementById('custom-name-input').value = name;
    });

    document.getElementById('btn-start-life').addEventListener('click', () => {
      const customName = document.getElementById('custom-name-input').value.trim();
      GameState.createNewLife({
        countryId: this.creator.countryId,
        gender: this.creator.gender,
        heritageId: this.creator.heritageId,
        customName
      });
      GameState.syncActiveSlotToCloud('new_life');
      this.showGameScreen();
      this.renderAll();
      const c = Utils.getCountry(GameState.current.countryId);
      this.toast(`Selamat datang ke ${GameState.current.city}, ${c.name} ${c.flag}!`, 'culture');
    });

    document.getElementById('btn-continue-life').addEventListener('click', () => {
      if (window.Modals && Modals.showSaveSlotsModal) {
        Modals.showSaveSlotsModal();
      }
    });

    this._initCreatorRandomCountry();
  },

  _initCreatorRandomCountry() {
    this.creator.rerollsLeft = 3;
    this._rollRandomCountry(false);
    this._syncCreatorCountry();
    this._updateRandomCountryBtn();
  },

  _rollRandomCountry(excludeCurrent = true) {
    const all = Object.values(window.COUNTRIES);
    const pool = excludeCurrent && all.length > 1
      ? all.filter(c => c.id !== this.creator.countryId)
      : all;
    const picked = Utils.pick(pool);
    if (picked) {
      this.creator.countryId = picked.id;
    }
    return picked;
  },

  _updateRandomCountryBtn() {
    const btn = document.getElementById('btn-random-country');
    if (!btn) return;
    const left = Math.max(0, this.creator.rerollsLeft ?? 0);
    if (left > 0) {
      btn.disabled = false;
      btn.textContent = `🎲 Negara Rawak (${left}/3)`;
      btn.style.opacity = '';
      btn.style.cursor = '';
    } else {
      btn.disabled = true;
      btn.textContent = '🎲 Had Rawak Tamat (0/3)';
      btn.style.opacity = '0.55';
      btn.style.cursor = 'not-allowed';
    }
  },

  _syncCreatorCountry() {
    const c = Utils.getCountry(this.creator.countryId);
    this.applyCountryTheme(c.id);

    const sel = document.getElementById('heritage-select');
    sel.innerHTML = c.heritages.map(h => `<option value="${h.id}">${h.label}</option>`).join('');
    this.creator.heritageId = c.heritages[0].id;

    const econTier = (c.salaryMultiplier || 0.5) >= 1.1 ? 'Tinggi' : (c.salaryMultiplier || 0.5) >= 0.5 ? 'Sederhana' : 'Membangun';
    const healthTier = (c.healthcareQuality && c.healthcareQuality.tier) || c.healthcare.type;

    document.getElementById('country-preview').innerHTML = `
      <strong>${c.flag} ${Utils.escapeHtml(c.name)}</strong> <small style="opacity:0.75;">(${c.continent || 'Dunia'})</small>
      <div class="preview-tags" style="margin-top:6px;">
        <span class="preview-tag">💱 ${c.currency.code} (${c.currency.symbol.trim()})</span>
        <span class="preview-tag">💰 Ekonomi: ${econTier}</span>
        <span class="preview-tag">🧾 Cukai: ${Math.round((c.taxRate || 0) * 100)}%</span>
        <span class="preview-tag">🏥 ${Utils.escapeHtml(healthTier)}</span>
        <span class="preview-tag">🎓 Pend: ${c.educationQuality || 75}%</span>
        <span class="preview-tag">🛡️ Selamat: ${c.safetyIndex || 70}%</span>
        <span class="preview-tag">❤️ Hayat: ${c.baseLifeExpectancy || c.lifeExpectancy} thn</span>
      </div>
    `;

    this._refreshRandomPlaceholder();
  },


  _refreshRandomPlaceholder() {
    const sample = Utils.generateName(this.creator.countryId, this.creator.gender, this.creator.heritageId);
    const input = document.getElementById('custom-name-input');
    input.placeholder = `cth: ${sample}`;
  },

  applyCountryTheme(countryId) {
    const c = Utils.getCountry(countryId);
    const root = document.documentElement;
    root.style.setProperty('--country-primary', c.theme.primary);
    root.style.setProperty('--country-secondary', c.theme.secondary);
    root.style.setProperty('--country-accent', c.theme.accent);
  },

  cloudProgress: { active: false, action: null, percent: 0, label: '', _timer: null },

  _getCloudProgressTitle(action) {
    if (action === 'load') return '☁️ Memuatkan Simpanan';
    if (action === 'delete') return '🗑️ Memadam Slot';
    return '☁️ Menyimpan ke Cloud';
  },

  _getCloudStageLabel(action, pct) {
    if (action === 'load') {
      if (pct >= 100) return 'Selesai dimuatkan!';
      if (pct >= 80) return 'Menyediakan dunia permainan...';
      if (pct >= 48) return 'Memuatkan data watak...';
      return 'Menyambung ke Cloud...';
    }
    if (action === 'delete') {
      if (pct >= 100) return 'Slot berjaya dipadam!';
      if (pct >= 82) return 'Mengemas kini senarai slot...';
      if (pct >= 52) return 'Memadam data slot...';
      return 'Menyambung ke Cloud...';
    }
    if (pct >= 100) return 'Berjaya disimpan!';
    if (pct >= 82) return 'Mengesahkan simpanan...';
    if (pct >= 50) return 'Menyimpan ke Cloud...';
    return 'Menyediakan data watak...';
  },

  renderCloudProgressOverlay() {
    const p = this.cloudProgress;
    let overlay = document.getElementById('global-cloud-progress-overlay');
    if (!p.active) {
      if (overlay) overlay.remove();
      return;
    }
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'global-cloud-progress-overlay';
      overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(15,23,42,0.58);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:16px;';
      overlay.innerHTML = `
        <div style="width:min(360px,92vw);background:#ffffff;border-radius:16px;padding:18px 20px;box-shadow:0 20px 48px rgba(15,23,42,0.28);border:1px solid #e2e8f0;">
          <div id="gcp-title" style="font-size:15px;font-weight:700;color:#0f172a;margin-bottom:12px;"></div>
          <div style="width:100%;height:10px;background:#e2e8f0;border-radius:999px;overflow:hidden;margin-bottom:10px;">
            <div id="gcp-bar" style="width:0%;height:100%;background:linear-gradient(90deg,#3b82f6,#2563eb);border-radius:999px;transition:width 150ms ease;"></div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:12.5px;gap:8px;">
            <span id="gcp-label" style="color:#475569;font-weight:500;"></span>
            <strong id="gcp-pct" style="color:#2563eb;font-variant-numeric:tabular-nums;">0%</strong>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
    }
    const pct = Math.min(100, Math.max(0, Math.round(p.percent)));
    const titleEl = overlay.querySelector('#gcp-title');
    const barEl = overlay.querySelector('#gcp-bar');
    const labelEl = overlay.querySelector('#gcp-label');
    const pctEl = overlay.querySelector('#gcp-pct');
    if (titleEl) titleEl.textContent = this._getCloudProgressTitle(p.action);
    if (barEl) barEl.style.width = `${pct}%`;
    if (labelEl) labelEl.textContent = p.label;
    if (pctEl) pctEl.textContent = `${pct}%`;
  },

  async runWithCloudProgress(action, taskFn) {
    if (this.cloudProgress.active) return { ok: false, busy: true };
    const p = this.cloudProgress;
    p.active = true;
    p.action = action;
    p.percent = 12;
    p.label = this._getCloudStageLabel(action, 12);
    this.renderCloudProgressOverlay();

    // Beri 1 bingkai supaya pelayar melukis overlay sebelum kerja Firestore bermula
    await new Promise(r => setTimeout(r, 30));

    p._timer = setInterval(() => {
      if (!p.active) return;
      if (p.percent < 90) {
        const step = Math.max(1, Math.round((90 - p.percent) * 0.18));
        p.percent = Math.min(90, p.percent + step);
        p.label = this._getCloudStageLabel(action, p.percent);
        this.renderCloudProgressOverlay();
      }
    }, 140);

    try {
      const result = await taskFn();
      if (p._timer) { clearInterval(p._timer); p._timer = null; }
      if (result && result.ok === false) {
        return result;
      }
      p.percent = 100;
      p.label = this._getCloudStageLabel(action, 100);
      this.renderCloudProgressOverlay();
      await new Promise(r => setTimeout(r, 350));
      return result;
    } finally {
      if (p._timer) { clearInterval(p._timer); p._timer = null; }
      p.active = false;
      p.action = null;
      p.percent = 0;
      p.label = '';
      this.renderCloudProgressOverlay();
    }
  },

  showStartScreen(opts = {}) {
    const wasInGame = !document.getElementById('game-header').classList.contains('hidden');
    if (wasInGame && GameState.current && !(opts && opts.skipSave)) {
      GameState.syncActiveSlotToCloud('main_menu');
    }
    if (opts && opts.targetSlotId) {
      GameState.current = null;
      GameState.setActiveSlotId(opts.targetSlotId);
    }

    const gate = document.getElementById('entry-gate-screen');
    if (gate) gate.classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
    document.getElementById('game-header').classList.add('hidden');
    document.getElementById('life-feed-container').classList.add('hidden');
    document.getElementById('game-footer').classList.add('hidden');

    const countEl = document.getElementById('hero-country-count');
    if (countEl) countEl.textContent = String(Object.keys(window.COUNTRIES).length);

    this._initCreatorRandomCountry();
    this.updateGuestBanner();
    this.renderStartAuthBar();
  },

  showGameScreen() {
    const gate = document.getElementById('entry-gate-screen');
    if (gate) gate.classList.add('hidden');
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-header').classList.remove('hidden');
    document.getElementById('life-feed-container').classList.remove('hidden');
    document.getElementById('game-footer').classList.remove('hidden');
    this.updateGuestBanner();

    this._feedLimit = this.FEED_PAGE_SIZE;
    this._feedSig = '';
  },

  handleAgeUp() {
    if (!GameState.current || !GameState.current.alive) return;
    Utils.playTone('age');
    this._feedLimit = this.FEED_PAGE_SIZE; // kembali ke paparan terkini setiap tahun baharu
    const { event, died, babyBirth, childMilestoneQueue } = Sim.ageUp();
    GameState.syncActiveSlotToCloud('age_up');
    this.renderAll();

    if (died) {
      setTimeout(() => Modals.showDeathSummary(), 260);
      return;
    }

    const queue = Array.isArray(childMilestoneQueue) ? [...childMilestoneQueue] : [];
    const runNextMilestone = () => {
      if (queue.length > 0) {
        const item = queue.shift();
        setTimeout(() => {
          if (item.type === 'school' && Modals.showChildSchoolSelectionModal) {
            Modals.showChildSchoolSelectionModal(item.childId, () => runNextMilestone(), true);
          } else if (item.type === 'university' && Modals.showChildUniversityModal) {
            Modals.showChildUniversityModal(item.childId, () => runNextMilestone());
          } else if (item.type === 'dropout' && Modals.showChildDropoutModal) {
            Modals.showChildDropoutModal(item.childId, item.reason, () => runNextMilestone());
          } else {
            runNextMilestone();
          }
        }, 160);
        return;
      }
      if (event) {
        setTimeout(() => Modals.showEvent(event), 160);
      }
    };

    if (babyBirth && Modals.showBabyNamingModal) {
      setTimeout(() => {
        Modals.showBabyNamingModal(babyBirth, () => runNextMilestone());
      }, 160);
    } else {
      runNextMilestone();
    }
  },

  _residencyLabel(status) {
    if (status === 'Citizen') return 'Warganegara';
    if (status === 'PR') return 'PR';
    if (status === 'Work Visa') return 'Visa Kerja';
    if (status === 'Student Visa') return 'Visa Pelajar';
    if (status === 'Investor Visa') return 'Visa Pelabur';
    return status;
  },

  renderAll() {
    const s = GameState.current;
    if (!s) return;
    const c = Utils.getCountry(s.countryId);
    const birthC = Utils.getCountry(s.birthCountryId);

    this.applyCountryTheme(s.countryId);

    document.getElementById('header-year-pill').textContent = s.year;
    document.getElementById('header-flag').textContent = c.flag;
    document.getElementById('header-country-code').textContent = c.id;

    document.querySelector('#char-avatar .avatar-emoji').textContent = (s.fugitive && s.fugitive.avatarOverride) || Utils.getAvatar(s.age, s.gender);
    document.getElementById('char-age-badge').textContent = s.age;
    document.getElementById('char-name').textContent = window.CharacterStatus
      ? CharacterStatus.getDisplayNameWithTitles(s)
      : (window.EduCareerEngine ? EduCareerEngine.getDisplayName(s) : s.name);

    const badge = document.getElementById('residency-badge');
    badge.textContent = this._residencyLabel(s.residencyStatus);
    badge.className = 'residency-badge ' + (
      s.residencyStatus === 'Citizen' ? 'citizen'
        : s.residencyStatus === 'PR' ? 'pr'
        : 'visa'
    );

    const occ = window.CharacterStatus
      ? CharacterStatus.getDisplayOccupation(s)
      : { title: s.job ? s.job.title : 'Tiada Pekerjaan', secondaryRole: null };
    const roleText = occ.secondaryRole ? `${occ.title} (${occ.secondaryRole})` : occ.title;

    document.getElementById('char-subtitle').textContent = `${roleText} • ${s.city}, ${c.name}`;

    const genPrefix = (s.generation && s.generation > 1) ? `Gen ${s.generation} • ` : '';
    const cultureTag = s.countryId === s.birthCountryId
      ? `${genPrefix}${birthC.flag} ${s.heritageLabel}`
      : `${genPrefix}Lahir ${birthC.flag} → ${c.flag} ${c.name}`;
    document.getElementById('char-culture-tag').textContent = cultureTag;

    const moneyEl = document.getElementById('char-money');
    moneyEl.textContent = Utils.formatMoney(s.money, s.countryId, true);
    moneyEl.classList.toggle('negative', s.money < 0);

    // Bar Penyesuaian Budaya (bila berhijrah ke luar negara)
    const adaptWrap = document.getElementById('adaptation-bar-wrap');
    if (s.countryId !== s.birthCountryId) {
      const adapt = GameState.getCurrentAdaptation();
      adaptWrap.classList.remove('hidden');
      document.getElementById('adaptation-label').textContent = `🌍 Penyesuaian Budaya di ${c.name} ${c.flag}`;
      document.getElementById('adaptation-val').textContent = `${adapt}%`;
      document.getElementById('adaptation-fill').style.width = `${adapt}%`;
    } else {
      adaptWrap.classList.add('hidden');
    }

    // Bar Karma, Populariti, Haba Polis, Stres, Penjara & Pelarian
    GameState.ensureUpgradedState();
    const a = s.alignment;
    const kInfo = window.KarmaEndings ? KarmaEndings.getKarmaLabel(a.karma) : { icon: '⚖️' };
    const pillKarma = document.getElementById('pill-karma');
    const pillFame = document.getElementById('pill-fame');
    const pillHeat = document.getElementById('pill-heat');
    const pillStress = document.getElementById('pill-stress');
    const prisonBar = document.getElementById('prison-alert-bar');
    const fugitiveBar = document.getElementById('fugitive-alert-bar');
    if (pillKarma) pillKarma.textContent = `${kInfo.icon} ${a.karma >= 0 ? '+' : ''}${a.karma}`;
    if (pillFame) pillFame.textContent = `⭐ ${a.fame}%`;
    if (pillHeat) {
      pillHeat.textContent = `🚔 ${a.notoriety}%`;
      pillHeat.classList.toggle('danger', a.notoriety >= 50);
    }
    if (pillStress) {
      pillStress.textContent = a.stress >= 75 ? `⚠️ Burnout ${a.stress}%` : `🧠 ${a.stress}%`;
      pillStress.classList.toggle('danger', a.stress >= 75);
    }
    if (prisonBar) {
      if (s.prison && s.prison.inPrison) {
        const isJuv = s.prison.detentionType === 'juvenile';
        prisonBar.classList.remove('hidden');
        prisonBar.textContent = isJuv
          ? `🔒 Sekolah Juvana — Baki ${s.prison.yearsLeft} tahun (Klik untuk aktiviti tahanan)`
          : `🔒 Penjara — Baki ${s.prison.yearsLeft} tahun (Klik untuk buka Hab Penjara)`;
      } else {
        prisonBar.classList.add('hidden');
      }
    }
    if (fugitiveBar) {
      if (s.fugitive && s.fugitive.isFugitive) {
        fugitiveBar.classList.remove('hidden');
        fugitiveBar.classList.remove('hidden-past');
        fugitiveBar.textContent = `🚨 PELARIAN • Risiko Dikesan Polis: ${s.fugitive.recaptureRisk}% — Klik Akses Pasaran Gelap`;
      } else if (s.fugitive && s.fugitive.hiddenPast) {
        fugitiveBar.classList.remove('hidden');
        fugitiveBar.classList.add('hidden-past');
        fugitiveBar.textContent = `🌟 IDENTITI BAHARU — Klik Status Kehidupan Baharu`;
      } else {
        fugitiveBar.classList.add('hidden');
      }
    }
    const modesBtn = document.getElementById('btn-open-modes');
    if (modesBtn && window.SpecialModesEngine) {
      const spInfo = SpecialModesEngine.getActiveInfo(s);
      if (spInfo) {
        modesBtn.classList.remove('hidden');
        modesBtn.textContent = `${spInfo.def.icon} ${spInfo.def.shortLabel}`;
        modesBtn.title = `${spInfo.def.title} — ${spInfo.rank.title}`;
      } else {
        modesBtn.classList.add('hidden');
      }
    }
    const legBtn = document.getElementById('btn-open-legacy');
    if (legBtn && window.Dynasty) {
      const d = Dynasty.getData();
      const st = Dynasty.getStatusBadge(d.legacyStatus);
      legBtn.textContent = `${d.legacyStatus === 'Tarnished' ? '💔' : d.legacyStatus === 'Redeemed' ? '🌟' : '👑'} Gen ${s.generation || d.generation || 1}`;
      legBtn.classList.toggle('tarnished', d.legacyStatus === 'Tarnished');
      legBtn.title = `Legasi Keluarga • ${st.label} (Reputasi ${d.familyReputation}%)`;
    }

    this._renderStat('happiness', s.stats.happiness);
    this._renderStat('health', s.stats.health);
    this._renderStat('smarts', s.stats.smarts);
    this._renderStat('looks', s.stats.looks);

    this._renderJournal(s);
  },

  _renderStat(key, val) {
    const fill = document.getElementById(`bar-${key}`);
    const label = document.getElementById(`val-${key}`);
    fill.style.width = `${val}%`;
    fill.style.backgroundColor = Utils.getStatColor(val);
    label.textContent = `${val}%`;
  },

  FEED_PAGE_SIZE: 25,
  _feedLimit: 25,
  _feedSig: '',

  _renderJournal(s, opts = {}) {
    const feed = document.getElementById('life-feed');
    const container = document.getElementById('life-feed-container');
    if (!feed || !Array.isArray(s.journal)) return;

    const limit = this._feedLimit || this.FEED_PAGE_SIZE;
    const lastBlock = s.journal[s.journal.length - 1];
    const sig = `${s.id}|${s.journal.length}|${lastBlock ? lastBlock.entries.length : 0}|${limit}|${s.journalTrimmedCount || 0}`;
    if (sig === this._feedSig && !opts.force) return; // tiada perubahan — elak bina semula DOM
    this._feedSig = sig;

    // Kumpul blok dari yang terbaru sehingga had catatan dicapai
    const picked = [];
    let shown = 0;
    let totalEntries = 0;
    for (const b of s.journal) totalEntries += b.entries.length;
    for (let i = s.journal.length - 1; i >= 0 && shown < limit; i--) {
      const block = s.journal[i];
      const room = limit - shown;
      const entries = block.entries.length > room ? block.entries.slice(-room) : block.entries;
      picked.unshift({ block, entries, partial: entries.length < block.entries.length });
      shown += entries.length;
    }
    const hiddenInMemory = Math.max(0, totalEntries - shown);
    const trimmedArchived = s.journalTrimmedCount || 0;

    let html = '';
    if (hiddenInMemory > 0) {
      html += `
        <div class="feed-load-older-wrap">
          <button type="button" class="feed-load-older" id="btn-feed-load-older">
            📜 Muat Sejarah Lama (${hiddenInMemory} catatan lagi)
          </button>
        </div>`;
    } else if (trimmedArchived > 0) {
      html += `<div class="feed-archived-note">🗄️ ${trimmedArchived} catatan terawal telah diarkibkan untuk menjimatkan memori.</div>`;
    }

    html += picked.map(({ block, entries, partial }) => {
      const bc = Utils.getCountry(block.countryId);
      return `
        <article class="year-block">
          <div class="year-header">
            <span>Umur: ${block.age} tahun (${block.year})${partial ? ' • …' : ''}</span>
            <span class="year-location">${bc.flag} ${Utils.escapeHtml(block.city)}, ${bc.name}</span>
          </div>
          <div class="year-entries">
            ${entries.map(e => `
              <div class="feed-entry ${e.type || 'normal'}">${Utils.escapeHtml(e.text)}</div>
            `).join('')}
          </div>
        </article>
      `;
    }).join('');

    const prevHeight = container ? container.scrollHeight : 0;
    const prevTop = container ? container.scrollTop : 0;
    feed.innerHTML = html;

    const olderBtn = document.getElementById('btn-feed-load-older');
    if (olderBtn) {
      olderBtn.addEventListener('click', () => {
        this._feedLimit = (this._feedLimit || this.FEED_PAGE_SIZE) + this.FEED_PAGE_SIZE;
        this._renderJournal(GameState.current, { keepScroll: true });
      }, { once: true });
    }

    if (!container) return;
    requestAnimationFrame(() => {
      if (opts.keepScroll) {
        // Kekalkan kedudukan bacaan apabila memuatkan sejarah lama di atas
        container.scrollTop = container.scrollHeight - prevHeight + prevTop;
      } else {
        container.scrollTop = container.scrollHeight;
      }
    });
  },

  toast(message, type = 'default') {
    if (type === 'success' || type === 'culture' || type === 'error') {
      Utils.playTone(type);
    }
    const wrap = document.getElementById('toast-container');
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = message;
    wrap.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.25s ease';
      setTimeout(() => el.remove(), 260);
    }, 2800);
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
