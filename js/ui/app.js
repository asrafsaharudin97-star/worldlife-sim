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

    const saved = GameState.load();
    if (saved && saved.alive) {
      document.getElementById('btn-continue-life').classList.remove('hidden');
    }
    this.showStartScreen();
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
      this.showGameScreen();
      this.renderAll();
      const c = Utils.getCountry(GameState.current.countryId);
      this.toast(`Selamat datang ke ${GameState.current.city}, ${c.name} ${c.flag}!`, 'culture');
    });

    document.getElementById('btn-continue-life').addEventListener('click', () => {
      if (GameState.current && GameState.current.alive) {
        this.showGameScreen();
        this.renderAll();
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

  showStartScreen() {
    document.getElementById('start-screen').classList.remove('hidden');
    document.getElementById('game-header').classList.add('hidden');
    document.getElementById('life-feed-container').classList.add('hidden');
    document.getElementById('game-footer').classList.add('hidden');

    const countEl = document.getElementById('hero-country-count');
    if (countEl) countEl.textContent = String(Object.keys(window.COUNTRIES).length);

    this._initCreatorRandomCountry();

    const saved = GameState.load();
    document.getElementById('btn-continue-life').classList.toggle('hidden', !(saved && saved.alive));
  },

  showGameScreen() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-header').classList.remove('hidden');
    document.getElementById('life-feed-container').classList.remove('hidden');
    document.getElementById('game-footer').classList.remove('hidden');

    this._feedLimit = this.FEED_PAGE_SIZE;
    this._feedSig = '';
  },

  handleAgeUp() {
    if (!GameState.current || !GameState.current.alive) return;
    Utils.playTone('age');
    this._feedLimit = this.FEED_PAGE_SIZE; // kembali ke paparan terkini setiap tahun baharu
    const { event, died, babyBirth, childMilestoneQueue } = Sim.ageUp();
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
        prisonBar.classList.remove('hidden');
        prisonBar.textContent = `⛓️ DI PENJARA (Baki ${s.prison.yearsLeft} thn) — Klik untuk buka Hab Penjara`;
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
