/* ==========================================================================
   WorldLife — Antara Muka Penjara, Mini-Permainan Lari & Rusuhan,
   serta Hab Pasaran Gelap Pelarian (Bahasa Melayu)
   ========================================================================== */

window.PrisonModals = {
  _activeKeyHandler: null,
  _activeInterval: null,

  _cleanupMiniGame() {
    if (this._activeKeyHandler) {
      window.removeEventListener('keydown', this._activeKeyHandler);
      this._activeKeyHandler = null;
    }
    if (this._activeInterval) {
      clearInterval(this._activeInterval);
      this._activeInterval = null;
    }
  },

  // --------------------------------------------------------------------------
  // 1. HAB PENJARA & KEHIDUPAN BANDUAN
  // --------------------------------------------------------------------------
  showPrisonHub() {
    this._cleanupMiniGame();
    const s = GameState.current;
    PrisonFugitive.ensureFields(s);
    const p = s.prison;
    if (!p.inPrison) {
      App.toast('Anda tidak berada di dalam penjara.', 'culture');
      return;
    }

    const sec = PrisonFugitive.SECURITY_LABELS[p.securityLevel] || PrisonFugitive.SECURITY_LABELS.minimum;
    const reqParole = Math.max(1, Math.ceil((p.originalSentence || 2) * 0.5));
    const paroleReady = (p.yearsServed || 0) >= reqParole;
    const appealReady = (s.year - (p.lastAppealYear || -99)) >= 2;
    const c = Utils.getCountry(s.countryId);
    const bonuses = window.Dynasty ? Dynasty.getBloodlineBonuses() : {};
    const appealCost = Utils.usdToLocal(Math.round(6500 * Math.max(0.45, c.salaryMultiplier || 0.7) * (1 - (bonuses.legalCostDiscount || 0))), s.countryId);

    Modals.open({
      icon: '⛓️',
      title: 'Hab Penjara',
      subtitle: `${sec.icon} ${sec.name} • Baki ${p.yearsLeft} tahun`,
      bodyHtml: `
        <div class="prison-hero">
          <div class="ph-row">
            <div>
              <div class="ph-sec" style="color:${sec.badgeColor};">${sec.icon} ${sec.name.toUpperCase()}</div>
              <div class="ph-crime">${Utils.escapeHtml(p.crimeName || 'Kesalahan Jenayah')}</div>
            </div>
            <div class="ph-years">${p.yearsLeft}<span>thn lagi</span></div>
          </div>
          <div class="ph-bars">
            <div class="ph-bar-item">
              <div class="ph-bar-lbl"><span>👊 Hormat Banduan</span><strong>${p.respect}%</strong></div>
              <div class="mini-track" style="background:rgba(255,255,255,0.2);"><div class="mini-fill" style="width:${p.respect}%;background:#f59e0b;"></div></div>
            </div>
            <div class="ph-bar-item">
              <div class="ph-bar-lbl"><span>😇 Rekod Kelakuan</span><strong>${p.behavior}%</strong></div>
              <div class="mini-track" style="background:rgba(255,255,255,0.2);"><div class="mini-fill" style="width:${p.behavior}%;background:#22c55e;"></div></div>
            </div>
          </div>
          ${p.gangName ? `<div class="ph-gang">👊 Ahli Geng: <strong>${Utils.escapeHtml(p.gangName)}</strong> (Bonus kuasa rusuhan!)</div>` : ''}
        </div>

        <div class="prison-special-row">
          <button class="primary-btn" id="btn-prison-escape" style="background:linear-gradient(135deg,#dc2626,#991b1b);">
            🏃 Lari Dari Penjara
          </button>
          <button class="primary-btn" id="btn-prison-riot" style="background:linear-gradient(135deg,#ea580c,#c2410c);" ${s.yearlyActions.prisonRiot ? 'disabled' : ''}>
            🔥 Cetuskan Rusuhan
          </button>
        </div>

        <div class="section-heading">🏢 Aktiviti Banduan Tahunan</div>
        <div class="action-list">
          <button class="action-item pris-act" data-act="gym" ${s.yearlyActions.prison_gym ? 'disabled' : ''}>
            <span class="ai-icon">🏋️</span>
            <span class="ai-content">
              <span class="ai-title">Gim Penjara</span>
              <span class="ai-desc">Tingkatkan Kesihatan (+8%) &amp; Hormat Banduan (+)</span>
            </span>
            <span class="ai-right">Hormat +</span>
          </button>
          <button class="action-item pris-act" data-act="library" ${s.yearlyActions.prison_library ? 'disabled' : ''}>
            <span class="ai-icon">📚</span>
            <span class="ai-content">
              <span class="ai-title">Perpustakaan Penjara</span>
              <span class="ai-desc">Tingkatkan Kepintaran (+7%) &amp; Rekod Kelakuan (+)</span>
            </span>
            <span class="ai-right">Kelakuan +</span>
          </button>
          <button class="action-item pris-act" data-act="work" ${s.yearlyActions.prison_work ? 'disabled' : ''}>
            <span class="ai-icon">🧹</span>
            <span class="ai-content">
              <span class="ai-title">Kerja Penjara (Dapur / Bengkel)</span>
              <span class="ai-desc">Jana pendapatan kecil &amp; baiki Rekod Kelakuan</span>
            </span>
            <span class="ai-right">Upah +</span>
          </button>
          <button class="action-item pris-act" data-act="gang" ${s.yearlyActions.prison_gang ? 'disabled' : ''}>
            <span class="ai-icon">👊</span>
            <span class="ai-content">
              <span class="ai-title">${p.gangName ? `Misi Geng (${Utils.escapeHtml(p.gangName)})` : 'Sertai Geng Penjara'}</span>
              <span class="ai-desc">Hormat ++ &amp; bonus rusuhan, tetapi Rekod Kelakuan --</span>
            </span>
            <span class="ai-right cost">${p.gangName ? 'Misi' : 'Sertai'}</span>
          </button>
          <button class="action-item pris-act" data-act="appeal" ${!appealReady ? 'disabled' : ''}>
            <span class="ai-icon">⚖️</span>
            <span class="ai-content">
              <span class="ai-title">Mohon Rayuan Mahkamah</span>
              <span class="ai-desc">Upah peguam untuk cuba batalkan sabitan (sekali setiap 2 tahun)</span>
            </span>
            <span class="ai-right cost">${Utils.formatMoney(appealCost, s.countryId)}</span>
          </button>
          <button class="action-item pris-act" data-act="parole" ${!paroleReady || s.yearlyActions.prisonParole ? 'disabled' : ''}>
            <span class="ai-icon">🔓</span>
            <span class="ai-content">
              <span class="ai-title">Mohon Pembebasan Parol</span>
              <span class="ai-desc">${paroleReady ? `Layak! Peluang bergantung pada Rekod Kelakuan (${p.behavior}%)` : `Dibuka selepas 50% hukuman (${p.yearsServed}/${reqParole} thn)`}</span>
            </span>
            <span class="ai-right">${paroleReady ? 'Mohon' : '🔒 Kunci'}</span>
          </button>
        </div>
      `
    });

    document.getElementById('btn-prison-escape').addEventListener('click', () => this.showEscapeMiniGame());
    document.getElementById('btn-prison-riot').addEventListener('click', () => this.showRiotMiniGame());

    document.querySelectorAll('.pris-act').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = PrisonFugitive.doPrisonActivity(btn.dataset.act);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        if (!GameState.current.prison.inPrison) {
          Modals.close(true);
        } else {
          this.showPrisonHub();
        }
      });
    });
  },

  // --------------------------------------------------------------------------
  // 2. MINI-PERMAINAN LARI DARI PENJARA (GRID 7x7 ALA BITLIFE)
  // --------------------------------------------------------------------------
  showEscapeMiniGame() {
    this._cleanupMiniGame();
    const s = GameState.current;
    const secLevel = (s.prison && s.prison.securityLevel) || 'minimum';
    const mazes = PrisonFugitive.ESCAPE_MAZES[secLevel] || PrisonFugitive.ESCAPE_MAZES.minimum;
    const chosen = Utils.pick(mazes);

    const rows = chosen.grid.length;
    const cols = chosen.grid[0].length;
    const walls = new Set();
    let player = { r: rows - 1, c: 0 };
    let exit = { r: 0, c: cols - 1 };
    const guards = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const ch = chosen.grid[r][c];
        if (ch === '#') walls.add(`${r},${c}`);
        else if (ch === 'P') player = { r, c };
        else if (ch === 'E') exit = { r, c };
        else if (ch === 'G') guards.push({ r, c });
      }
    }

    let turns = 0;
    let ended = false;

    const isBlocked = (r, c) => r < 0 || r >= rows || c < 0 || c >= cols || walls.has(`${r},${c}`);

    const renderGrid = () => {
      const wrap = document.getElementById('escape-grid-board');
      const turnEl = document.getElementById('escape-turn-count');
      if (!wrap) return;
      if (turnEl) turnEl.textContent = turns;

      let html = '';
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const isW = walls.has(`${r},${c}`);
          const isP = player.r === r && player.c === c;
          const isE = exit.r === r && exit.c === c;
          const isG = guards.some(g => g.r === r && g.c === c);
          let cls = 'eg-cell';
          let icon = '';
          if (isW) { cls += ' wall'; icon = '🧱'; }
          else if (isP && isG) { cls += ' caught'; icon = '🚨'; }
          else if (isP) { cls += ' player'; icon = '🏃'; }
          else if (isG) { cls += ' guard'; icon = '👮'; }
          else if (isE) { cls += ' exit'; icon = '🚪'; }
          html += `<div class="${cls}">${icon}</div>`;
        }
      }
      wrap.innerHTML = html;
    };

    const finishGame = (won) => {
      if (ended) return;
      ended = true;
      this._cleanupMiniGame();
      const res = PrisonFugitive.resolveEscapeResult(won);
      App.renderAll();
      setTimeout(() => {
        Modals.close(true);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        if (won) {
          this.showFugitiveHub('overview');
        } else if (GameState.current.prison.inPrison) {
          this.showPrisonHub();
        }
      }, 280);
    };

    // Peraturan Gerakan Pengawal BitLife: maks 2 petak setiap giliran,
    // utamakan sejajar lajur mendatar (c) dahulu, kemudian baris menegak (r), terhalang dinding!
    const moveGuards = () => {
      for (const g of guards) {
        for (let step = 0; step < 2; step++) {
          if (g.r === player.r && g.c === player.c) break;
          let moved = false;
          if (g.c !== player.c) {
            const dc = player.c > g.c ? 1 : -1;
            if (!isBlocked(g.r, g.c + dc)) {
              g.c += dc;
              moved = true;
            }
          }
          if (!moved && g.r !== player.r) {
            const dr = player.r > g.r ? 1 : -1;
            if (!isBlocked(g.r + dr, g.c)) {
              g.r += dr;
              moved = true;
            }
          }
          if (!moved) break;
          if (g.r === player.r && g.c === player.c) break;
        }
      }
    };

    const stepPlayer = (dr, dc) => {
      if (ended) return;
      const nr = player.r + dr;
      const nc = player.c + dc;
      if (isBlocked(nr, nc)) return;

      player.r = nr;
      player.c = nc;
      turns += 1;

      if (player.r === exit.r && player.c === exit.c) {
        renderGrid();
        finishGame(true);
        return;
      }

      if (guards.some(g => g.r === player.r && g.c === player.c)) {
        renderGrid();
        finishGame(false);
        return;
      }

      moveGuards();
      renderGrid();

      if (guards.some(g => g.r === player.r && g.c === player.c)) {
        finishGame(false);
      }
    };

    Modals.open({
      icon: '🏃',
      title: 'Lari Dari Penjara!',
      subtitle: `${chosen.name} • Giliran: `,
      locked: true,
      bodyHtml: `
        <div class="info-banner" style="font-size:12px;">
          🎯 Gerakkan <strong>🏃 Banduan</strong> ke <strong>🚪 Pintu Keluar</strong>!<br/>
          👮 <strong>Pengawal</strong> bergerak 2 petak setiap giliran (utamakan mendatar dahulu) — <strong>perangkap pengawal di belakang dinding 🧱!</strong>
          <div style="margin-top:4px;">Langkah: <strong id="escape-turn-count">0</strong></div>
        </div>
        <div id="escape-grid-board" class="escape-grid" style="grid-template-columns:repeat(${cols}, 1fr);"></div>
        <div class="dpad-wrap">
          <div></div>
          <button type="button" class="dpad-btn" data-dir="up">⬆️</button>
          <div></div>
          <button type="button" class="dpad-btn" data-dir="left">⬅️</button>
          <button type="button" class="dpad-btn" data-dir="down">⬇️</button>
          <button type="button" class="dpad-btn" data-dir="right">➡️</button>
        </div>
        <button type="button" class="ghost-btn" id="btn-escape-cancel" style="margin-top:8px;">🏳️ Batalkan Cubaan Lari</button>
      `
    });

    renderGrid();

    document.querySelectorAll('.dpad-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const d = btn.dataset.dir;
        if (d === 'up') stepPlayer(-1, 0);
        else if (d === 'down') stepPlayer(1, 0);
        else if (d === 'left') stepPlayer(0, -1);
        else if (d === 'right') stepPlayer(0, 1);
      });
    });

    document.getElementById('btn-escape-cancel').addEventListener('click', () => {
      this._cleanupMiniGame();
      this.showPrisonHub();
    });

    this._activeKeyHandler = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault();
        if (e.key === 'ArrowUp' || e.key === 'w') stepPlayer(-1, 0);
        else if (e.key === 'ArrowDown' || e.key === 's') stepPlayer(1, 0);
        else if (e.key === 'ArrowLeft' || e.key === 'a') stepPlayer(0, -1);
        else if (e.key === 'ArrowRight' || e.key === 'd') stepPlayer(0, 1);
      }
    };
    window.addEventListener('keydown', this._activeKeyHandler);
  },

  // --------------------------------------------------------------------------
  // 3. MINI-PERMAINAN RUSUHAN PENJARA ("CETUSKAN RUSUHAN" — GAYA ULAR)
  // --------------------------------------------------------------------------
  showRiotMiniGame() {
    this._cleanupMiniGame();
    const s = GameState.current;
    const p = s.prison;
    const secInfo = PrisonFugitive.SECURITY_LABELS[p.securityLevel] || PrisonFugitive.SECURITY_LABELS.minimum;
    const bonusReduction = (p.gangName ? 2 : 0) + (p.respect >= 70 ? 2 : 0);
    const target = Math.max(6, secInfo.riotTarget - bonusReduction);

    const SIZE = 13;
    const obstacles = new Set(['3,3', '3,9', '9,3', '9,9', ...(p.securityLevel === 'maximum' ? ['6,3', '6,9'] : [])]);
    let snake = [{ r: 6, c: 6 }];
    let dir = { r: 0, c: 1 };
    let nextDir = { r: 0, c: 1 };
    let collected = 0;
    let ended = false;

    const spawnInmate = () => {
      for (let tries = 0; tries < 100; tries++) {
        const r = Utils.randInt(0, SIZE - 1);
        const c = Utils.randInt(0, SIZE - 1);
        if (obstacles.has(`${r},${c}`)) continue;
        if (snake.some(seg => seg.r === r && seg.c === c)) continue;
        return { r, c };
      }
      return { r: 1, c: 1 };
    };
    let inmate = spawnInmate();

    const drawRiot = () => {
      const canvas = document.getElementById('riot-canvas');
      const countEl = document.getElementById('riot-mob-count');
      if (!canvas) return;
      if (countEl) countEl.textContent = `${collected} / ${target}`;

      const ctx = canvas.getContext('2d');
      const cell = canvas.width / SIZE;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Garis grid lembut
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= SIZE; i++) {
        ctx.beginPath(); ctx.moveTo(i * cell, 0); ctx.lineTo(i * cell, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * cell); ctx.lineTo(canvas.width, i * cell); ctx.stroke();
      }

      // Halangan polis rusuhan
      obstacles.forEach(k => {
        const [r, c] = k.split(',').map(Number);
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(c * cell + 2, r * cell + 2, cell - 4, cell - 4);
        ctx.font = `${Math.floor(cell * 0.65)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🛡️', c * cell + cell / 2, r * cell + cell / 2 + 1);
      });

      // Banduan sasaran untuk direkrut
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(inmate.c * cell + cell / 2, inmate.r * cell + cell / 2, cell * 0.36, 0, Math.PI * 2);
      ctx.fill();

      // Barisan perusuh (ular)
      snake.forEach((seg, idx) => {
        ctx.fillStyle = idx === 0 ? '#f59e0b' : '#fbbf24';
        ctx.fillRect(seg.c * cell + 2, seg.r * cell + 2, cell - 4, cell - 4);
      });
    };

    const endRiot = (won) => {
      if (ended) return;
      ended = true;
      this._cleanupMiniGame();
      const res = PrisonFugitive.resolveRiotResult(won, collected, target);
      App.renderAll();
      setTimeout(() => {
        Modals.close(true);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        if (res.died) {
          Modals.showDeathSummary();
        } else if (res.escaped) {
          this.showFugitiveHub('overview');
        } else if (GameState.current.prison.inPrison) {
          this.showPrisonHub();
        }
      }, 280);
    };

    const tickRiot = () => {
      if (ended) return;
      dir = nextDir;
      const head = { r: snake[0].r + dir.r, c: snake[0].c + dir.c };

      // Semak langgar dinding, polis rusuhan, atau barisan sendiri
      if (
        head.r < 0 || head.r >= SIZE || head.c < 0 || head.c >= SIZE ||
        obstacles.has(`${head.r},${head.c}`) ||
        snake.some(seg => seg.r === head.r && seg.c === head.c)
      ) {
        endRiot(false);
        return;
      }

      snake.unshift(head);
      if (head.r === inmate.r && head.c === inmate.c) {
        collected += 1;
        if (collected >= target) {
          drawRiot();
          endRiot(true);
          return;
        }
        inmate = spawnInmate();
      } else {
        snake.pop();
      }
      drawRiot();
    };

    const setDirection = (dr, dc) => {
      if (snake.length > 1 && dir.r === -dr && dir.c === -dc) return;
      nextDir = { r: dr, c: dc };
    };

    Modals.open({
      icon: '🔥',
      title: 'Cetuskan Rusuhan Penjara!',
      subtitle: `${secInfo.name} • Sasaran: ${target} Banduan`,
      locked: true,
      bodyHtml: `
        <div class="info-banner" style="font-size:12px;">
          🔥 Kumpul <strong>🟢 Banduan</strong> untuk besarkan barisan rusuhan! Elak dinding, <strong>🛡️ Polis Rusuhan</strong> &amp; barisan anda sendiri!
          <div style="margin-top:4px;">Banduan Direkrut: <strong id="riot-mob-count">0 / ${target}</strong>${bonusReduction > 0 ? ` <small>(Bonus Geng/Hormat: -${bonusReduction})</small>` : ''}</div>
        </div>
        <div style="display:flex;justify-content:center;margin:8px 0;">
          <canvas id="riot-canvas" width="260" height="260" style="border-radius:12px;border:2px solid #334155;max-width:100%;"></canvas>
        </div>
        <div class="dpad-wrap">
          <div></div>
          <button type="button" class="dpad-btn riot-dir" data-dir="up">⬆️</button>
          <div></div>
          <button type="button" class="dpad-btn riot-dir" data-dir="left">⬅️</button>
          <button type="button" class="dpad-btn riot-dir" data-dir="down">⬇️</button>
          <button type="button" class="dpad-btn riot-dir" data-dir="right">➡️</button>
        </div>
        <button type="button" class="ghost-btn" id="btn-riot-cancel" style="margin-top:8px;">🏳️ Hentikan Rusuhan</button>
      `
    });

    drawRiot();
    const speedMs = p.securityLevel === 'maximum' ? 195 : p.securityLevel === 'medium' ? 225 : 255;
    this._activeInterval = setInterval(tickRiot, speedMs);

    document.querySelectorAll('.riot-dir').forEach(btn => {
      btn.addEventListener('click', () => {
        const d = btn.dataset.dir;
        if (d === 'up') setDirection(-1, 0);
        else if (d === 'down') setDirection(1, 0);
        else if (d === 'left') setDirection(0, -1);
        else if (d === 'right') setDirection(0, 1);
      });
    });

    document.getElementById('btn-riot-cancel').addEventListener('click', () => {
      this._cleanupMiniGame();
      this.showPrisonHub();
    });

    this._activeKeyHandler = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault();
        if (e.key === 'ArrowUp' || e.key === 'w') setDirection(-1, 0);
        else if (e.key === 'ArrowDown' || e.key === 's') setDirection(1, 0);
        else if (e.key === 'ArrowLeft' || e.key === 'a') setDirection(0, -1);
        else if (e.key === 'ArrowRight' || e.key === 'd') setDirection(0, 1);
      }
    };
    window.addEventListener('keydown', this._activeKeyHandler);
  },

  // --------------------------------------------------------------------------
  // 4. AKSES PASARAN GELAP / HIDUP DALAM PELARIAN
  // --------------------------------------------------------------------------
  showFugitiveHub(activeTab = 'overview') {
    this._cleanupMiniGame();
    const s = GameState.current;
    PrisonFugitive.ensureFields(s);
    const f = s.fugitive;
    const c = Utils.getCountry(s.countryId);

    const tabsHtml = `
      <div class="tab-pills">
        <button class="tab-pill fug-tab ${activeTab === 'overview' ? 'active' : ''}" data-ftab="overview">🕶️ Status</button>
        <button class="tab-pill fug-tab ${activeTab === 'smuggle' ? 'active' : ''}" data-ftab="smuggle">🚤 Lari Luar Negara</button>
        <button class="tab-pill fug-tab ${activeTab === 'surgery' ? 'active' : ''}" data-ftab="surgery">🎭 Tukar Wajah</button>
        <button class="tab-pill fug-tab ${activeTab === 'identity' ? 'active' : ''}" data-ftab="identity">🪪 Identiti Palsu</button>
      </div>
    `;

    let body = '';
    if (f.hiddenPast && !f.isFugitive) {
      body += `
        <div class="info-banner" style="background:#f5f3ff;border-color:#c4b5fd;">
          <strong>🌟 STATUS: IDENTITI BAHARU (MASA SILAM TERSEMBUNYI)</strong><br/>
          Nama Samaran Aktif: <strong>${Utils.escapeHtml(s.name)}</strong><br/>
          Nama Asal Dinasti: <strong>${Utils.escapeHtml(f.trueName || s.name)}</strong> (Generasi ${s.generation || 1} kekal utuh!)<br/>
          <small>Buruan polis aktif telah dihentikan. Anda bebas bekerja &amp; membina hidup semula — namun waspada jika seseorang daripada masa silam mengenali anda!</small>
        </div>
      `;
    } else if (activeTab === 'overview') {
      body += `
        <div class="prison-hero" style="background:linear-gradient(135deg,#7f1d1d,#1e1b4b);">
          <div class="ph-row">
            <div>
              <div class="ph-sec" style="color:#fca5a5;">🚨 STATUS: PELARIAN BURUAN POLIS</div>
              <div class="ph-crime">${Utils.escapeHtml(s.name)} • ${c.flag} ${c.name}</div>
            </div>
            <div class="ph-years">${f.recaptureRisk}%<span>risiko/thn</span></div>
          </div>
          <div class="mini-track" style="height:8px;background:rgba(255,255,255,0.2);margin-top:8px;">
            <div class="mini-fill" style="width:${f.recaptureRisk}%;background:#ef4444;"></div>
          </div>
          <div style="font-size:11.5px;margin-top:8px;opacity:0.9;">
            Kerja rasmi &amp; perjalanan sah disekat! Lengkapkan <strong>3 langkah sinergi</strong> di bawah untuk memadam buruan polis dan bertukar ke <strong>IDENTITI BAHARU</strong>:
          </div>
        </div>
        <div class="action-list">
          <button class="action-item fug-jump" data-ftab="smuggle">
            <span class="ai-icon">${f.smuggledAbroad ? '✅' : '🚤'}</span>
            <span class="ai-content">
              <span class="ai-title">1. Lari Ke Luar Negara (Hijrah Haram)</span>
              <span class="ai-desc">${f.smuggledAbroad ? 'Selesai! Anda sudah meloloskan diri ke luar negara.' : 'Kurangkan risiko dikesan -12% hingga -15%'}</span>
            </span>
            <span class="ai-right">${f.smuggledAbroad ? 'Selesai' : 'Buka →'}</span>
          </button>
          <button class="action-item fug-jump" data-ftab="surgery">
            <span class="ai-icon">${f.hadPlasticSurgery ? '✅' : '🎭'}</span>
            <span class="ai-content">
              <span class="ai-title">2. Pembedahan Plastik (Tukar Wajah)</span>
              <span class="ai-desc">${f.hadPlasticSurgery ? 'Selesai! Wajah anda sudah berubah sepenuhnya.' : 'Potong risiko dikesan polis sehingga separuh!'}</span>
            </span>
            <span class="ai-right">${f.hadPlasticSurgery ? 'Selesai' : 'Buka →'}</span>
          </button>
          <button class="action-item fug-jump" data-ftab="identity">
            <span class="ai-icon">${f.fakeIdentityTier === 'pro' ? '✅' : '🪪'}</span>
            <span class="ai-content">
              <span class="ai-title">3. Identiti Palsu Gred Profesional</span>
              <span class="ai-desc">${f.fakeIdentityTier === 'pro' ? 'Selesai! Pasport & rekod bersih siap.' : 'Buka semula kerjaya normal & padam jejak nama asal!'}</span>
            </span>
            <span class="ai-right">${f.fakeIdentityTier === 'pro' ? 'Selesai' : 'Buka →'}</span>
          </button>
        </div>
      `;
    } else if (activeTab === 'smuggle') {
      this._smugSearch = this._smugSearch || '';
      const q = this._smugSearch.toLowerCase();
      const dests = Object.values(window.COUNTRIES)
        .filter(x => x.id !== s.countryId && (!q || `${x.name} ${x.continent} ${x.id}`.toLowerCase().includes(q)))
        .sort((a, b) => a.name.localeCompare(b.name))
        .slice(0, 20);

      body += `
        <div class="info-banner" style="background:#fff7ed;border-color:#fed7aa;">
          <strong>🚤 Berhijrah Secara Haram (195 Negara)</strong><br/>
          Menyusup keluar melalui bot/kargo penyeludup. Ada risiko kecil (~15%) ditangkap di sempadan, tetapi jika berjaya risiko dikesan jatuh -12% hingga -15%!
        </div>
        <input type="text" id="smug-search" class="input-field" value="${Utils.escapeHtml(this._smugSearch)}" placeholder="🔍 Cari negara destinasi (cth: Brazil, Thailand, Switzerland)..." style="margin-bottom:8px;" />
        <div class="action-list">
          ${dests.map(dest => {
            const cost = Utils.usdToLocal(Math.round(2600 + (dest.flightBaseUsd || 600)), s.countryId);
            return `
              <button class="action-item smug-go-btn" data-dest="${dest.id}">
                <span class="ai-icon">${dest.flag}</span>
                <span class="ai-content">
                  <span class="ai-title">${Utils.escapeHtml(dest.name)} <small>(${dest.continent})</small></span>
                  <span class="ai-desc">Mata wang: ${dest.currency.code} • Keselamatan Sempadan: ${dest.safetyIndex || 70}%</span>
                </span>
                <span class="ai-right cost">${Utils.formatMoney(cost, s.countryId)}</span>
              </button>
            `;
          }).join('')}
        </div>
      `;
    } else if (activeTab === 'surgery') {
      const alleyCost = Utils.usdToLocal(2400, s.countryId);
      const eliteCost = Utils.usdToLocal(16000, s.countryId);
      body += `
        <div class="info-banner highlight">
          <strong>🎭 Pembedahan Plastik (Tukar Wajah)</strong><br/>
          Wajah baru memotong Risiko Dikesan Polis sebanyak 50% (sekali setiap tempoh pelarian) dan mengemas kini avatar anda!
        </div>
        <div class="action-list">
          <button class="action-item surg-btn" data-tier="alley">
            <span class="ai-icon">🩺</span>
            <span class="ai-content">
              <span class="ai-title">Klinik Haram / Doktor Lorong Gelap</span>
              <span class="ai-desc">Murah, tetapi 40% risiko gagal (merosakkan wajah/kesihatan atau lokasi bocor ke polis!)</span>
            </span>
            <span class="ai-right cost">${Utils.formatMoney(alleyCost, s.countryId)}</span>
          </button>
          <button class="action-item surg-btn" data-tier="elite">
            <span class="ai-icon">💎</span>
            <span class="ai-content">
              <span class="ai-title">Klinik Rahsia Elit</span>
              <span class="ai-desc">Sangat mahal, tetapi 88% peluang berjaya &amp; meningkatkan Penampilan!</span>
            </span>
            <span class="ai-right cost">${Utils.formatMoney(eliteCost, s.countryId)}</span>
          </button>
        </div>
      `;
    } else if (activeTab === 'identity') {
      const cheapCost = Utils.usdToLocal(2800, s.countryId);
      const proCost = Utils.usdToLocal(22000, s.countryId);
      const sampleAlias = Utils.generateName(s.countryId, s.gender);
      body += `
        <div class="info-banner highlight">
          <strong>🪪 Beli Identiti Palsu (Pasport &amp; Nama Baharu)</strong><br/>
          Nama samaran baru anda tidak memadamkan salasilah &amp; Pencapaian Generasi Perdana dinasti anda!
        </div>
        <div class="name-input-row" style="margin-bottom:10px;">
          <input type="text" id="alias-input" class="input-field" placeholder="Nama samaran baru (cth: ${Utils.escapeHtml(sampleAlias)})" maxlength="36" />
          <button type="button" id="btn-rand-alias" class="secondary-btn">🎲</button>
        </div>
        <div class="action-list">
          <button class="action-item id-buy-btn" data-tier="cheap">
            <span class="ai-icon">📄</span>
            <span class="ai-content">
              <span class="ai-title">Dokumen Murahan</span>
              <span class="ai-desc">Kurangkan risiko -9%, tetapi berisiko tinggi gagal semakan kerja/imigresen</span>
            </span>
            <span class="ai-right cost">${Utils.formatMoney(cheapCost, s.countryId)}</span>
          </button>
          <button class="action-item id-buy-btn" data-tier="pro">
            <span class="ai-icon">🛂</span>
            <span class="ai-content">
              <span class="ai-title">Identiti Gred Profesional</span>
              <span class="ai-desc">Dokumen palsu sempurna! Risiko -20%, buka semula kerja normal &amp; syarat IDENTITI BAHARU!</span>
            </span>
            <span class="ai-right cost">${Utils.formatMoney(proCost, s.countryId)}</span>
          </button>
        </div>
      `;
    }

    Modals.open({
      icon: '🕶️',
      title: 'Pasaran Gelap Pelarian',
      subtitle: f.isFugitive ? `🚨 PELARIAN • Risiko Dikesan: ${f.recaptureRisk}%` : '🌟 IDENTITI BAHARU',
      bodyHtml: tabsHtml + body
    });

    document.querySelectorAll('.fug-tab, .fug-jump').forEach(btn => {
      btn.addEventListener('click', () => this.showFugitiveHub(btn.dataset.ftab));
    });

    const smugSearch = document.getElementById('smug-search');
    if (smugSearch) {
      smugSearch.addEventListener('input', (e) => {
        this._smugSearch = e.target.value;
        const pos = e.target.selectionStart;
        Utils.debounceKey('smug-country-search', () => {
          this.showFugitiveHub('smuggle');
          const next = document.getElementById('smug-search');
          if (next) {
            next.focus();
            try { next.setSelectionRange(pos, pos); } catch (err) {}
          }
        }, 160);
      });
    }

    document.querySelectorAll('.smug-go-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = PrisonFugitive.smuggleAbroad(btn.dataset.dest);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        if (res.caught) this.showPrisonHub();
        else this.showFugitiveHub('overview');
      });
    });

    document.querySelectorAll('.surg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = PrisonFugitive.doPlasticSurgery(btn.dataset.tier);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showFugitiveHub('overview');
      });
    });

    const randAliasBtn = document.getElementById('btn-rand-alias');
    if (randAliasBtn) {
      randAliasBtn.addEventListener('click', () => {
        document.getElementById('alias-input').value = Utils.generateName(s.countryId, s.gender);
      });
    }

    document.querySelectorAll('.id-buy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const alias = (document.getElementById('alias-input') && document.getElementById('alias-input').value) || '';
        const res = PrisonFugitive.buyFakeIdentity(btn.dataset.tier, alias);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showFugitiveHub('overview');
      });
    });
  }
};
