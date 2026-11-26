/* ==========================================================================
   WorldLife — Antara Muka Papan Pemuka Mod Khas "Peluang Sekali Seumur Hidup"
   & Modal Amaran Risiko Keluar Mod (Bahasa Melayu)
   ========================================================================== */

window.SpecialModeModals = {
  showDashboard(opts = {}) {
    const s = GameState.current;
    if (!s || !window.SpecialModesEngine) return;
    const inPrison = Boolean(s.prison && s.prison.inPrison);
    const info = SpecialModesEngine.getActiveInfo(s);
    if (inPrison || !info) {
      if (window.Modals && Modals.close) Modals.close(true);
      if (!opts.silent && !inPrison) {
        App.toast('Tiada Mod Khas aktif sekarang — teruskan hidup untuk menanti Peluang Sekali Seumur Hidup!', 'culture');
      }
      return;
    }

    const { def, state: am, rank } = info;
    if (!Array.isArray(am.currentBoard) || am.currentBoard.length === 0) {
      SpecialModesEngine.generateBoard(s, false);
    }

    const nextRank = def.ranks[am.rankIndex + 1] || null;
    const annualLocal = Utils.usdToLocal(SpecialModesEngine.getActiveAnnualUsd(s), s.countryId);
    const ceoEq = def.id === 'ceo' ? SpecialModesEngine.getCeoEquityLocal(s) : 0;

    const m1Color = def.metric1.dangerHigh
      ? (am.metric1 >= 60 ? '#dc2626' : '#f59e0b')
      : (am.metric1 >= 65 ? '#22c55e' : '#3b82f6');
    const m2Color = def.metric2.dangerHigh
      ? (am.metric2 >= 50 ? '#dc2626' : am.metric2 >= 30 ? '#f59e0b' : '#22c55e')
      : (am.metric2 >= 65 ? '#22c55e' : '#f59e0b');

    const maxActs = SpecialModesEngine.MAX_ACTIONS_YEAR || 3;
    const aLeft = Math.max(0, am.actionsLeftThisYear ?? maxActs);
    const usedActs = Math.min(maxActs, Math.max(0, maxActs - aLeft));
    const rLeft = am.rerollsLeft ?? 1;
    const pips = Array.from({ length: maxActs }, (_, i) =>
      `<span class="energy-pip ${i < usedActs ? 'full' : 'empty'}">⚡</span>`
    ).join('');

    const boardItems = (am.currentBoard || [])
      .map(id => def.actions.find(a => a.id === id))
      .filter(Boolean);

    const actionsHtml = boardItems.map(act => {
      const done = Boolean(s.yearlyActions[`sp_${def.id}_${act.id}`]);
      const cd = (am.cooldowns && am.cooldowns[act.id]) || 0;
      const disabled = done || cd > 0 || aLeft <= 0 || inPrison;
      return `
        <button type="button" class="action-item sp-mode-act-btn ${act.isRare ? 'rare-activity' : ''} ${done ? 'act-done-card' : ''}" data-act-id="${act.id}" ${disabled ? 'disabled' : ''}>
          <span class="ai-icon">${act.icon}</span>
          <span class="ai-content">
            <span class="ai-title">
              ${Utils.escapeHtml(act.title)}
              ${act.isRare ? '<span class="rare-gold-tag">🌟 PELUANG EMAS</span>' : ''}
            </span>
            <span class="ai-desc">
              ${cd > 0 ? `<span class="cat-badge" style="background:#f1f5f9;color:#475569;">⏳ Bertenang (${cd} thn)</span><br/>` : ''}
              ${Utils.escapeHtml(act.desc)}
            </span>
          </span>
          <span class="ai-right">
            <span class="act-status-pill ${done || cd > 0 ? 'done' : 'free'}">${done ? '✓ Selesai' : cd > 0 ? '⏳ Rehat' : 'Laksana →'}</span>
          </span>
        </button>
      `;
    }).join('');

    Modals.open({
      icon: def.icon,
      title: def.title,
      subtitle: `${rank.title} • Tahun ke-${am.yearsInMode + 1} dalam mod`,
      bodyHtml: `
        <div class="career-active-card">
          <div class="cac-top">
            <div>
              <div class="cac-title">${def.icon} ${Utils.escapeHtml(rank.title)}</div>
              <div class="cac-sub">
                Pendapatan Mod: <strong>${Utils.formatMoney(annualLocal, s.countryId, true)}/thn</strong>
                ${ceoEq > 0 ? ` • Ekuiti Syarikat: <strong style="color:#fde047;">${Utils.formatMoney(ceoEq, s.countryId, true)}</strong>` : ''}
              </div>
            </div>
            <span class="cat-badge synergy">Pangkat ${am.rankIndex + 1}/${def.ranks.length}</span>
          </div>

          <div class="cac-bars">
            <div>
              <div class="ph-bar-lbl">
                <span>${def.metric1.icon} ${Utils.escapeHtml(def.metric1.label)}</span>
                <strong>${def.id === 'explorer' ? `${(s.countriesVisited || []).length}/195 Negara (${am.metric1}%)` : `${am.metric1}%`}</strong>
              </div>
              <div class="mini-track" style="height:7px;"><div class="mini-fill" style="width:${am.metric1}%;background:${m1Color};"></div></div>
            </div>
            <div>
              <div class="ph-bar-lbl"><span>${def.metric2.icon} ${Utils.escapeHtml(def.metric2.label)}</span><strong>${am.metric2}%</strong></div>
              <div class="mini-track" style="height:7px;"><div class="mini-fill" style="width:${am.metric2}%;background:${m2Color};"></div></div>
            </div>
          </div>

          ${nextRank
            ? `<div class="cac-next">🎯 Pangkat Seterusnya: <strong>${Utils.escapeHtml(nextRank.title)}</strong> (Perlu ${nextRank.reqYears} thn &amp; ${nextRank.reqM1}% ${Utils.escapeHtml(def.metric1.label)})</div>`
            : `<div class="cac-next">👑 Anda telah mencapai puncak tertinggi ${Utils.escapeHtml(def.title)}!</div>`
          }
        </div>

        <div class="act-engine-header">
          <div class="aeh-top">
            <div>
              <div class="aeh-title">⚡ Agenda Mod Tahun ${s.year}</div>
              <div class="aeh-sub">4–5 tindakan rawak anti-ulang + Risiko Nyata &amp; Dilema</div>
            </div>
            <button type="button" class="reroll-idea-btn" id="btn-sp-reroll" ${rLeft <= 0 ? 'disabled' : ''}>
              🎲 Cari Idea Lain (${rLeft}/1)
            </button>
          </div>
          <div class="aeh-energy-bar">
            <span class="aeh-energy-lbl">Tindakan Tahun Ini: <strong>${usedActs}/${maxActs}</strong></span>
            <span class="aeh-energy-pips">${pips}</span>
          </div>
        </div>

        <div class="action-list" style="margin-bottom:12px;">${actionsHtml}</div>

        ${def.id === 'mafia' ? `
          <button type="button" class="action-item" id="btn-mafia-tribute" style="margin-bottom:10px;" ${s.yearlyActions.mafiaTribute || inPrison ? 'disabled' : ''}>
            <span class="ai-icon">💼</span>
            <span class="ai-content">
              <span class="ai-title">Sumbang Wang Besar Kepada Ketua Sindiket</span>
              <span class="ai-desc">Naikkan reputasi anda di mata Ketua untuk peluang naik pangkat • Risiko Haba Polis tinggi!</span>
            </span>
            <span class="ai-right cost">${Utils.formatMoney(Utils.usdToLocal(15000 * (am.rankIndex + 1), s.countryId), s.countryId, true)}</span>
          </button>
        ` : ''}

        <button type="button" class="ghost-btn" id="btn-sp-exit-prompt" style="border-color:#fca5a5;color:#dc2626;font-weight:800;">
          ${def.id === 'royalty' ? '👑 Buang Gelaran Diraja (Renounce Title)' : `🚪 Keluar / Letak Jawatan Daripada ${Utils.escapeHtml(def.shortLabel)}`}
        </button>
      `
    });

    const tributeBtn = document.getElementById('btn-mafia-tribute');
    if (tributeBtn) {
      tributeBtn.addEventListener('click', () => {
        const res = SpecialModesEngine.contributeMafiaTribute();
        App.renderAll();
        if ((s.prison && s.prison.inPrison) || !SpecialModesEngine.getActiveInfo(s)) {
          Modals.close(true);
          App.toast(res.msg, res.ok ? 'success' : 'error');
          return;
        }
        App.toast(res.msg, res.ok ? 'success' : 'error');
        this.showDashboard({ silent: true });
      });
    }

    const rerollBtn = document.getElementById('btn-sp-reroll');
    if (rerollBtn) {
      rerollBtn.addEventListener('click', () => {
        const res = SpecialModesEngine.rerollBoard();
        if ((s.prison && s.prison.inPrison) || !SpecialModesEngine.getActiveInfo(s)) {
          Modals.close(true);
          App.renderAll();
          return;
        }
        App.toast(res.msg, res.ok ? 'culture' : 'error');
        this.showDashboard({ silent: true });
      });
    }

    document.querySelectorAll('.sp-mode-act-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = SpecialModesEngine.performAction(btn.dataset.actId);
        App.renderAll();
        if (res.died) {
          Modals.close(true);
          if (window.ModeModals && ModeModals.showLegacyObituary) ModeModals.showLegacyObituary();
          return;
        }
        if ((s.prison && s.prison.inPrison) || !SpecialModesEngine.getActiveInfo(s)) {
          Modals.close(true);
          App.toast(res.msg, res.ok ? 'success' : 'error');
          return;
        }
        if (res.dilemmaEvent) {
          Modals.showEvent(res.dilemmaEvent);
          return;
        }
        const tType = res.outcomeTier === 'partial' ? 'culture' : (res.ok ? 'success' : 'error');
        App.toast(res.msg, tType);
        this.showDashboard({ silent: true });
      });
    });

    const exitPromptBtn = document.getElementById('btn-sp-exit-prompt');
    if (exitPromptBtn) {
      exitPromptBtn.addEventListener('click', () => this.showExitConfirmation());
    }
  },

  // --------------------------------------------------------------------------
  // MODAL AMARAN RISIKO KELUAR MOD (PENGESAHAN + KUNCI KEKAL SEUMUR HIDUP)
  // --------------------------------------------------------------------------
  showExitConfirmation() {
    const s = GameState.current;
    const info = SpecialModesEngine.getActiveInfo(s);
    if (!info) return;
    const { def, state: am, rank } = info;
    const isCeo = def.id === 'ceo';
    const isMafia = def.id === 'mafia';
    const ceoEq = isCeo ? SpecialModesEngine.getCeoEquityLocal(s) : 0;

    Modals.open({
      icon: '⚠️',
      title: 'Amaran Risiko Keluar Mod',
      subtitle: `${def.icon} ${def.title} (${rank.title})`,
      bodyHtml: `
        <div class="info-banner" style="background:#fef2f2;border-color:#fca5a5;color:#7f1d1d;">
          <strong>⚠️ KEPUTUSAN MUKTAMAD — SEKALI SEUMUR HIDUP!</strong><br/>
          ${Utils.escapeHtml(def.exitWarning)}
        </div>
        <div class="action-list">
          ${isCeo ? `
            <button type="button" class="action-item sp-confirm-exit" data-choice="sell">
              <span class="ai-icon">💰</span>
              <span class="ai-content">
                <span class="ai-title">Jual Syarikat (Anggaran Ekuiti: ${Utils.formatMoney(ceoEq, s.countryId, true)})</span>
                <span class="ai-desc">Tertakluk cukai keuntungan modal 20% &amp; risiko saman jika penilaian rendah (&lt;35%)</span>
              </span>
              <span class="ai-right cost">Jual &amp; Keluar</span>
            </button>
            <button type="button" class="action-item sp-confirm-exit" data-choice="close">
              <span class="ai-icon">🔒</span>
              <span class="ai-content">
                <span class="ai-title">Tutup Operasi Syarikat</span>
                <span class="ai-desc">Selesaikan hutang pampasan pekerja &amp; kesan Reputasi Keluarga (-8%)</span>
              </span>
              <span class="ai-right cost">Tutup</span>
            </button>
          ` : isMafia ? `
            <button type="button" class="action-item sp-confirm-exit" data-choice="mafia_risk_life">
              <span class="ai-icon">💀</span>
              <span class="ai-content">
                <span class="ai-title">Pertaruhkan Nyawa</span>
                <span class="ai-desc">Risiko sangat tinggi dibunuh skuad sindiket atau cedera parah</span>
              </span>
              <span class="ai-right cost">Risiko Maut</span>
            </button>
            <button type="button" class="action-item sp-confirm-exit" data-choice="mafia_flee">
              <span class="ai-icon">✈️</span>
              <span class="ai-content">
                <span class="ai-title">Lari Sejauh Mungkin</span>
                <span class="ai-desc">Hijrah kecemasan ke luar negara &amp; hilang akses lama, masih berisiko diburu</span>
              </span>
              <span class="ai-right cost">Lari</span>
            </button>
            <button type="button" class="action-item sp-confirm-exit" data-choice="mafia_final_mission">
              <span class="ai-icon">🎯</span>
              <span class="ai-content">
                <span class="ai-title">Selesaikan Misi Khas Keluar Sindiket</span>
                <span class="ai-desc">Misi terakhir tanpa ditangkap polis — jika tertangkap, penjara seumur hidup!</span>
              </span>
              <span class="ai-right cost">Misi Akhir</span>
            </button>
          ` : `
            <button type="button" class="action-item sp-confirm-exit" data-choice="standard">
              <span class="ai-icon">🚪</span>
              <span class="ai-content">
                <span class="ai-title">Sah Keluar &amp; Kunci Mod ${Utils.escapeHtml(def.shortLabel)} Selamanya</span>
                <span class="ai-desc">Terima segala risiko keluar di atas dan tamatkan mod ini</span>
              </span>
              <span class="ai-right cost">Sah Keluar</span>
            </button>
          `}
          <button type="button" class="action-item" id="btn-sp-cancel-exit">
            <span class="ai-icon">↩️</span>
            <span class="ai-content">
              <span class="ai-title">Batal &amp; Kekal Dalam Mod</span>
              <span class="ai-desc">Kembali ke Papan Pemuka ${Utils.escapeHtml(def.title)}</span>
            </span>
            <span class="ai-right">Kembali</span>
          </button>
        </div>
      `
    });

    document.getElementById('btn-sp-cancel-exit').addEventListener('click', () => this.showDashboard());
    document.querySelectorAll('.sp-confirm-exit').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = SpecialModesEngine.exitSpecialMode(btn.dataset.choice);
        App.renderAll();
        if (res.died) {
          Modals.close(true);
          if (window.ModeModals && ModeModals.showLegacyObituary) ModeModals.showLegacyObituary();
          return;
        }
        if (res.followUpEvent) {
          Modals.showEvent(res.followUpEvent);
          return;
        }
        Modals.close(true);
        App.toast(res.msg, 'culture');
      });
    });
  }
};
