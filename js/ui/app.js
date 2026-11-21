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
    this._bindGlobalEvents();
    this._initCreator();

    const saved = GameState.load();
    if (saved && saved.alive) {
      document.getElementById('btn-continue-life').classList.remove('hidden');
    }
    this.showStartScreen();
  },

  _bindGlobalEvents() {
    document.getElementById('modal-close').addEventListener('click', () => Modals.close());
    document.getElementById('modal-backdrop').addEventListener('click', (e) => {
      if (e.target.id === 'modal-backdrop') Modals.close();
    });

    document.getElementById('btn-menu').addEventListener('click', () => Modals.showMenu());
    document.getElementById('btn-passport').addEventListener('click', () => Modals.showActivities('passport'));
    document.getElementById('char-avatar').addEventListener('click', () => Modals.showActivities('passport'));

    document.getElementById('btn-age-up').addEventListener('click', () => this.handleAgeUp());

    document.querySelectorAll('.dock-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        if (!GameState.current || !GameState.current.alive) return;
        if (tab === 'occupation') Modals.showOccupation();
        else if (tab === 'assets') Modals.showAssets();
        else if (tab === 'relationships') Modals.showRelationships();
        else if (tab === 'activities') Modals.showActivities('culture');
      });
    });
  },

  _initCreator() {
    const grid = document.getElementById('country-grid');
    grid.innerHTML = Object.values(window.COUNTRIES).map(c => `
      <button type="button" class="country-card-opt ${c.id === this.creator.countryId ? 'selected' : ''}" data-cid="${c.id}">
        <span class="cc-flag">${c.flag}</span>
        <span>
          <span class="cc-name">${c.name}</span>
          <span class="cc-curr">${c.currency.code} • ${c.currency.symbol.trim()}</span>
        </span>
      </button>
    `).join('');

    grid.querySelectorAll('.country-card-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        this.creator.countryId = btn.dataset.cid;
        grid.querySelectorAll('.country-card-opt').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this._syncCreatorCountry();
      });
    });

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

    this._syncCreatorCountry();
  },

  _syncCreatorCountry() {
    const c = Utils.getCountry(this.creator.countryId);
    this.applyCountryTheme(c.id);

    const sel = document.getElementById('heritage-select');
    sel.innerHTML = c.heritages.map(h => `<option value="${h.id}">${h.label}</option>`).join('');
    this.creator.heritageId = c.heritages[0].id;

    document.getElementById('country-preview').innerHTML = `
      <strong>${c.flag} Pratonton Budaya ${c.name}</strong> — ${Utils.escapeHtml(c.tagline)}
      <div class="preview-tags">
        ${c.highlights.map(t => `<span class="preview-tag">${Utils.escapeHtml(t)}</span>`).join('')}
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

    const saved = GameState.load();
    document.getElementById('btn-continue-life').classList.toggle('hidden', !(saved && saved.alive));
    this._syncCreatorCountry();
  },

  showGameScreen() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-header').classList.remove('hidden');
    document.getElementById('life-feed-container').classList.remove('hidden');
    document.getElementById('game-footer').classList.remove('hidden');
  },

  handleAgeUp() {
    if (!GameState.current || !GameState.current.alive) return;
    Utils.playTone('age');
    const { event, died } = Sim.ageUp();
    this.renderAll();

    if (died) {
      setTimeout(() => Modals.showDeathSummary(), 260);
    } else if (event) {
      setTimeout(() => Modals.showEvent(event), 160);
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

    document.querySelector('#char-avatar .avatar-emoji').textContent = Utils.getAvatar(s.age, s.gender);
    document.getElementById('char-age-badge').textContent = s.age;
    document.getElementById('char-name').textContent = s.name;

    const badge = document.getElementById('residency-badge');
    badge.textContent = this._residencyLabel(s.residencyStatus);
    badge.className = 'residency-badge ' + (
      s.residencyStatus === 'Citizen' ? 'citizen'
        : s.residencyStatus === 'PR' ? 'pr'
        : 'visa'
    );

    const roleText = s.job
      ? s.job.title
      : s.education.stage === 'university'
        ? `Pelajar di ${s.education.universityName}`
        : s.education.schoolName
          ? s.education.schoolName
          : s.age < 5 ? 'Kanak-kanak' : 'Tiada Pekerjaan';

    document.getElementById('char-subtitle').textContent = `${roleText} • ${s.city}, ${c.name}`;

    const genPrefix = (s.generation && s.generation > 1) ? `Gen ${s.generation} • ` : '';
    const beliefObj = GameState.getBeliefObj(s.belief);
    const beliefSnippet = ` • ${beliefObj.icon} ${beliefObj.name}`;
    const cultureTag = s.countryId === s.birthCountryId
      ? `${genPrefix}${birthC.flag} ${s.heritageLabel}${beliefSnippet}`
      : `${genPrefix}Lahir ${birthC.flag} → ${c.flag} ${c.name}${beliefSnippet}`;
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

  _renderJournal(s) {
    const feed = document.getElementById('life-feed');
    const recent = s.journal.slice(-30);

    feed.innerHTML = recent.map(block => {
      const bc = Utils.getCountry(block.countryId);
      return `
        <article class="year-block">
          <div class="year-header">
            <span>Umur: ${block.age} tahun (${block.year})</span>
            <span class="year-location">${bc.flag} ${Utils.escapeHtml(block.city)}, ${bc.name}</span>
          </div>
          <div class="year-entries">
            ${block.entries.map(e => `
              <div class="feed-entry ${e.type || 'normal'}">${Utils.escapeHtml(e.text)}</div>
            `).join('')}
          </div>
        </article>
      `;
    }).join('');

    const container = document.getElementById('life-feed-container');
    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
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
