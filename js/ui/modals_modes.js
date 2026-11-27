/* ==========================================================================
   WorldLife — Antara Muka Laman Sosial, Jodoh & Legasi
   Bahasa Melayu
   ========================================================================== */

window.ModeModals = {
  // --------------------------------------------------------------------------
  // 1. ALIH HALUAN MOD KHAS (Jika dipanggil dari mana-mana rujukan lama)
  // --------------------------------------------------------------------------
  showLifeModes() {
    const s = GameState.current;
    if (!s || (s.prison && s.prison.inPrison) || !s.activeSpecialMode) {
      if (window.Modals && Modals.close) Modals.close(true);
      return;
    }
    if (window.SpecialModeModals) {
      SpecialModeModals.showDashboard();
      return;
    }
  },

  // --------------------------------------------------------------------------
  // 2. HAB LAMAN SOSIAL, KERJAYA VIRAL & APLIKASI SESI DATE
  // --------------------------------------------------------------------------
  showSocialHub(activeTab = 'social') {
    const s = GameState.current;
    GameState.ensureUpgradedState();

    if (s.prison && s.prison.inPrison) {
      Modals.open({
        icon: '🔒',
        title: 'Akses Diharamkan Dalam Tahanan',
        subtitle: s.prison.detentionType === 'juvenile' ? 'Sekolah Juvana' : 'Penjara',
        bodyHtml: `
          <div class="info-banner" style="background:#fef2f2;border-color:#fecaca;color:#991b1b;line-height:1.55;">
            🔒 <strong>Akses telefon dan media sosial diharamkan sepenuhnya di dalam tahanan.</strong><br/>
            Segala akaun media sosial, kerjaya tular dan aplikasi janji temu dikunci sepenuhnya sehingga anda tamat menjalani hukuman atau berjaya meloloskan diri.
          </div>
        `
      });
      return;
    }

    const tabsHtml = `
      <div class="tab-pills">
        <button class="tab-pill soc-tab ${activeTab === 'social' ? 'active' : ''}" data-stab="social">📱 Laman Sosial</button>
        <button class="tab-pill soc-tab ${activeTab === 'viral' ? 'active' : ''}" data-stab="viral">⚡ Kerjaya Viral</button>
        <button class="tab-pill soc-tab ${activeTab === 'dating' ? 'active' : ''}" data-stab="dating">💘 Sesi Date</button>
      </div>
    `;

    let body = '';

    if (activeTab === 'social') {
      const sm = s.socialMedia;
      body += `
        <div class="info-banner highlight">
          <strong>📱 Profil Laman Sosial Anda</strong><br/>
          Pengikut: <strong>${SocialMedia.formatFollowers(sm.followers)}</strong> • Populariti: <strong>${s.alignment.fame}%</strong><br/>
          Tular: <strong>${sm.viralHits}x</strong> • Kena Cancel: <strong>${sm.cancelledCount}x</strong>
        </div>
        <div class="section-heading">🌐 Platform Akaun (Umur 13+)</div>
        <div class="action-list">
          ${SocialMedia.PLATFORMS.map(p => {
            const joined = sm.platforms.includes(p.id);
            return `
              <button class="action-item join-plat-btn" data-plat="${p.id}" ${joined ? 'disabled' : ''}>
                <span class="ai-icon">${p.icon}</span>
                <span class="ai-content">
                  <span class="ai-title">${p.name} (${p.type})</span>
                  <span class="ai-desc">${p.desc}</span>
                </span>
                <span class="ai-right">${joined ? '✓ Aktif' : 'Daftar'}</span>
              </button>
            `;
          }).join('')}
        </div>
      `;

      if (sm.platforms.length > 0) {
        body += `
          <div class="section-heading">🎬 Strategi Konten Tahunan</div>
          <div class="action-list">
            ${SocialMedia.STRATEGIES.map(st => `
              <button class="action-item post-strat-btn" data-strat="${st.id}" ${s.yearlyActions.socialPost || s.prison.inPrison ? 'disabled' : ''}>
                <span class="ai-icon">${st.icon}</span>
                <span class="ai-content">
                  <span class="ai-title">${st.name}</span>
                  <span class="ai-desc">${st.desc}</span>
                </span>
                <span class="ai-right ${st.karma < 0 ? 'cost' : ''}">Muat Naik</span>
              </button>
            `).join('')}
            <button class="action-item" id="btn-social-sponsor" ${s.yearlyActions.socialSponsor || sm.followers < 3000 || s.prison.inPrison ? 'disabled' : ''}>
              <span class="ai-icon">💰</span>
              <span class="ai-content">
                <span class="ai-title">Terima Tajaan Jenama (Sponsorship)</span>
                <span class="ai-desc">Perlukan 3K+ pengikut — jana wang tunai daripada jenama</span>
              </span>
              <span class="ai-right">Jana $$$</span>
            </button>
          </div>
        `;
      }
    } else if (activeTab === 'viral') {
      const sm = s.socialMedia;
      body += `
        <div class="info-banner highlight">
          <strong>⚡ Laluan Kerjaya Viral &amp; Selebriti</strong><br/>
          Pengikut Anda: <strong>${SocialMedia.formatFollowers(sm.followers)}</strong> • Populariti: <strong>${s.alignment.fame}%</strong>
        </div>
        <div class="action-list">
          ${SocialMedia.VIRAL_CAREERS.map(vc => {
            const unlocked = sm.followers >= vc.minFollowers && s.alignment.fame >= vc.minFame;
            return `
              <button class="action-item viral-career-btn" data-vc="${vc.id}" ${!unlocked || s.prison.inPrison ? 'disabled' : ''}>
                <span class="ai-icon">${vc.icon}</span>
                <span class="ai-content">
                  <span class="ai-title">${vc.title}</span>
                  <span class="ai-desc">${vc.desc}<br/>Syarat: ${SocialMedia.formatFollowers(vc.minFollowers)} pengikut &amp; ${vc.minFame}% Populariti</span>
                </span>
                <span class="ai-right">${unlocked ? 'Sertai!' : '🔒 Kunci'}</span>
              </button>
            `;
          }).join('')}
        </div>
      `;
    } else if (activeTab === 'dating') {
      const minAgeAllowed = 18;
      if (s.prison && s.prison.inPrison) {
        body += `<div class="info-banner">⛓️ Aplikasi Janji Temu disekat semasa anda sedang menjalani tahanan di penjara.</div>`;
      } else if (s.age < minAgeAllowed) {
        body += `<div class="info-banner">Aplikasi Janji Temu &amp; Penapis Umur dibuka pada umur <strong>18+ tahun</strong>.</div>`;
      } else if (s.partnerId) {
        body += `<div class="info-banner highlight">Anda sudah mempunyai pasangan aktif! Uruskan hubungan anda di tab <strong>❤️ Hubungan</strong>.</div>`;
      } else {
        const curMin = Utils.clamp(Number(s._datingMinAge ?? Math.max(18, s.age - 4)) || 18, 18, 90);
        const curMax = Utils.clamp(Number(s._datingMaxAge ?? Math.min(90, s.age + 8)) || 35, curMin, 90);
        const usedSearches = s.yearlyActions.datingSearches || 0;
        const maxSearches = SocialMedia.MAX_DATING_SEARCHES_YEAR || 8;
        const leftSearches = Math.max(0, maxSearches - usedSearches);
        const pool = (s._datingPool && s._datingPool.length > 0 && s._datingPool[0].age >= curMin && s._datingPool[0].age <= curMax)
          ? s._datingPool
          : SocialMedia.generateDatingCandidates(curMin, curMax);
        const cand = pool[0];
        body += `
          <div class="info-banner highlight">
            <strong>💘 Aplikasi Janji Temu (18+)</strong><br/>
            Tetapkan julat umur calon (18–90 tahun) dan pilih <strong>❤️ Suka</strong> atau <strong>✖️ Langkau</strong>. Baki carian tahun ini: <strong>${leftSearches}/${maxSearches}</strong>.
          </div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap;">
            <label style="font-size:12.5px;font-weight:700;">🎂 Umur Min:
              <input type="number" id="dating-min-age" min="18" max="90" value="${curMin}" style="width:64px;padding:5px 8px;border-radius:8px;border:1px solid #cbd5e1;margin-left:4px;" />
            </label>
            <label style="font-size:12.5px;font-weight:700;">Umur Maks:
              <input type="number" id="dating-max-age" min="18" max="90" value="${curMax}" style="width:64px;padding:5px 8px;border-radius:8px;border:1px solid #cbd5e1;margin-left:4px;" />
            </label>
            <button type="button" class="secondary-btn" id="btn-apply-age-filter" style="padding:6px 10px;font-size:12px;">🔍 Tapis</button>
          </div>
          ${cand ? `
            <div class="dating-card">
              <div class="dc-top">
                <strong>${Utils.escapeHtml(cand.name)} <small>(${cand.age} thn)</small></strong>
                <span class="dc-badge">✨ Rupa ${cand.looks}%</span>
              </div>
              <div class="dc-meta">
                💼 ${Utils.escapeHtml(cand.job)} • 💰 ${cand.wealth}<br/>
                🤝 Keserasian ${cand.compatibility}%
              </div>
              <div style="display:flex;gap:8px;margin-top:10px;">
                <button type="button" class="btn-sm primary match-cand-btn" data-uid="${cand.uid}" style="flex:1;">
                  ❤️ Suka / Ajak Bercinta
                </button>
                <button type="button" class="btn-sm secondary skip-cand-btn" data-uid="${cand.uid}" style="flex:1;" ${leftSearches <= 0 ? 'disabled' : ''}>
                  ✖️ Langkau / Cari Lain (${leftSearches})
                </button>
              </div>
            </div>
          ` : '<div class="info-banner">Tiada calon semasa. Tekan Tapis untuk menjana calon baharu.</div>'}
        `;
      }
    }

    Modals.open({
      icon: activeTab === 'dating' ? '💘' : '📱',
      title: activeTab === 'dating' ? 'Sesi Date' : 'Laman Sosial & Viral',
      subtitle: `Pengikut: ${SocialMedia.formatFollowers(s.socialMedia.followers)} • Populariti: ${s.alignment.fame}%`,
      bodyHtml: tabsHtml + body
    });

    document.querySelectorAll('.soc-tab').forEach(btn => {
      btn.addEventListener('click', () => this.showSocialHub(btn.dataset.stab));
    });

    document.querySelectorAll('.join-plat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = SocialMedia.joinPlatform(btn.dataset.plat);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showSocialHub('social');
      });
    });

    document.querySelectorAll('.post-strat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = SocialMedia.postContent(btn.dataset.strat);
        App.toast(res.msg, res.ok ? 'culture' : 'error');
        App.renderAll();
        this.showSocialHub('social');
      });
    });

    const sponBtn = document.getElementById('btn-social-sponsor');
    if (sponBtn) {
      sponBtn.addEventListener('click', () => {
        const res = SocialMedia.takeSponsorship();
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showSocialHub('social');
      });
    }

    document.querySelectorAll('.viral-career-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = SocialMedia.joinViralCareer(btn.dataset.vc);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showSocialHub('viral');
      });
    });

    document.querySelectorAll('.match-cand-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = SocialMedia.matchCandidate(btn.dataset.uid);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        if (res.followUpEvent) Modals.showEvent(res.followUpEvent);
        else if (res.ok) Modals.showRelationships();
        else this.showSocialHub('dating');
      });
    });

    document.querySelectorAll('.skip-cand-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = SocialMedia.skipCandidate(btn.dataset.uid);
        if (!res.ok) App.toast(res.msg, 'error');
        this.showSocialHub('dating');
      });
    });

    const applyFilterBtn = document.getElementById('btn-apply-age-filter');
    if (applyFilterBtn) {
      applyFilterBtn.addEventListener('click', () => {
        const minEl = document.getElementById('dating-min-age');
        const maxEl = document.getElementById('dating-max-age');
        let minVal = Utils.clamp(Number(minEl ? minEl.value : 18) || 18, 18, 90);
        let maxVal = Utils.clamp(Number(maxEl ? maxEl.value : 35) || 35, 18, 90);
        if (minVal > maxVal) maxVal = minVal;
        SocialMedia.generateDatingCandidates(minVal, maxVal);
        GameState.save();
        this.showSocialHub('dating');
      });
    }
  },

  // --------------------------------------------------------------------------
  // 3. SKRIN AKHIR HAYAT — OBITUARI LEGASI & PENJEJAK PENAMAT RAHSIA
  // --------------------------------------------------------------------------
  showLegacyObituary() {
    const s = GameState.current;
    GameState.ensureUpgradedState();
    const ending = KarmaEndings.evaluateEnding(s);
    const karmaInfo = KarmaEndings.getKarmaLabel(s.alignment.karma);
    const unlocked = KarmaEndings.getUnlocked();
    const c = Utils.getCountry(s.countryId);
    const birthC = Utils.getCountry(s.birthCountryId);
    const livingKids = s.relationships.filter(r => ['Anak Lelaki', 'Anak Perempuan', 'Son', 'Daughter'].includes(r.role) && r.alive);

    const highlightsHtml = (s.highlights && s.highlights.length > 0)
      ? `<div class="obituary-box">
           <strong>📜 Detik Paling Bersejarah Dalam Hidup Anda</strong>
           <ul class="obituary-list">
             ${s.highlights.slice(-6).map(h => `<li>${h.icon} <strong>Umur ${h.age}:</strong> ${Utils.escapeHtml(h.text)}</li>`).join('')}
           </ul>
         </div>`
      : '';

    const eligibleHeirs = (window.GameState && GameState.getEligibleHeirs) ? GameState.getEligibleHeirs(s) : livingKids;
    const hasTrust = Boolean(s.familyTrust && s.familyTrust.active);
    const kidsHtml = eligibleHeirs.length > 0 ? `
      <div class="section-heading">👑 Sambung Legasi Sebagai Pewaris (Gen ${(s.generation || 1) + 1})</div>
      <div class="action-list">
        ${eligibleHeirs.map(k => {
          const kc = Utils.getCountry(k.countryId || s.countryId);
          return `
            <button class="action-item continue-kid-btn" data-kid-id="${k.id}">
              <span class="ai-icon">${k.gender === 'female' ? '👧' : '👦'}</span>
              <span class="ai-content">
                <span class="ai-title">Main sebagai ${Utils.escapeHtml(k.name)} (Umur ${k.age})${k.isAdopted ? ' <span class="cat-badge">Anak Angkat</span>' : ''}</span>
                <span class="ai-desc">Lahir di ${kc.flag} ${kc.name} • Mewarisi harta${hasTrust && !s.familyTrust.lapsed ? ' &amp; Tabung Yayasan Keluarga (0% cukai)' : ' pusaka anda'}</span>
              </span>
              <span class="ai-right">Sambung →</span>
            </button>
          `;
        }).join('')}
      </div>
    ` : `
      <div class="info-banner" style="background:#fef2f2;border-color:#fca5a5;color:#7f1d1d;margin-top:10px;line-height:1.55;">
        <strong>🕊️ Tamat Legasi (Tiada Pewaris)</strong><br/>
        ${Utils.escapeHtml(s.name)} meninggal dunia tanpa meninggalkan sebarang anak kandung atau anak angkat yang masih hidup. Salasilah generasi ini telah berakhir.${hasTrust ? ' Tabung Yayasan Keluarga turut dibubarkan dan ditutup bersama berakhirnya keturunan ini.' : ''}
      </div>
    `;

    const endingsGrid = KarmaEndings.ENDINGS_CATALOG.map(e => {
      const has = unlocked.endings.includes(e.id);
      const isThis = e.id === ending.id;
      return `
        <div class="ending-chip ${has ? 'unlocked' : 'locked'} ${isThis ? 'current' : ''}">
          <span>${has ? e.icon : '🔒'}</span>
          <span>${has ? e.title : 'Penamat Rahsia'}</span>
        </div>
      `;
    }).join('');

    const posthumous = (window.CharacterStatus && CharacterStatus.evaluatePosthumousDegree)
      ? CharacterStatus.evaluatePosthumousDegree(s)
      : null;
    const titledName = window.CharacterStatus ? CharacterStatus.getDisplayNameWithTitles(s) : s.name;
    const finalOcc = window.CharacterStatus ? CharacterStatus.getDisplayOccupation(s) : { title: s.job ? s.job.title : 'Tiada Pekerjaan', icon: '💼' };
    const peakRoleText = s.peakRole || finalOcc.title;

    const posthumousHtml = posthumous ? `
      <div class="info-banner highlight" style="background:#fefce8;border-color:#fde047;margin-bottom:10px;">
        <strong>${posthumous.icon} ${Utils.escapeHtml(posthumous.displayLine)}</strong><br/>
        <small>${Utils.escapeHtml(posthumous.legacyNote)}</small>
      </div>
    ` : '';

    Modals.open({
      icon: ending.icon,
      title: 'Obituari & Laporan Legasi',
      subtitle: `${titledName} • Gen ${s.generation || 1} (${s.year - s.age} – ${s.year})`,
      locked: true,
      bodyHtml: `
        <div class="ribbon-hero">
          <div style="font-size:42px;line-height:1;">${ending.icon}</div>
          <h3 style="margin:6px 0 2px;font-family:'Outfit',sans-serif;">${Utils.escapeHtml(titledName)}</h3>
          <div style="font-size:12px;opacity:0.88;">Meninggal dunia pada umur ${s.age} tahun di ${s.city}, ${c.name} ${c.flag} (${Utils.escapeHtml(s.causeOfDeath || 'Sakit tua')})</div>
          <div style="font-size:12px;opacity:0.92;margin-top:3px;">${finalOcc.icon || '💼'} Peranan Akhir: <strong>${Utils.escapeHtml(finalOcc.title)}</strong>${peakRoleText && peakRoleText !== finalOcc.title ? ` • Puncak Kerjaya: <strong>${Utils.escapeHtml(peakRoleText)}</strong>` : ''}</div>
          <div class="ribbon-badge">🏆 Gelaran: ${ending.title}</div>
          <div style="font-size:12px;margin-top:8px;opacity:0.92;">${Utils.escapeHtml(ending.desc)}</div>
        </div>

        ${posthumousHtml}

        <div class="obituary-box">
          <strong>📰 Bagaimana Dunia Mengingati Anda</strong><br/>
          ${Utils.escapeHtml(ending.publicMemory)}<br/>
          <div style="margin-top:6px;"><strong>❤️ Ingatan Keluarga:</strong> ${Utils.escapeHtml(KarmaEndings.getFamilyMemory(s))}</div>
        </div>
        ${window.Quotes ? Quotes.renderQuoteCard(Quotes.getContextualQuoteForState(s), 'Kata Hikmah Buat Perjalanan Anda') : ''}

        <div class="summary-grid">
          <div class="summary-stat">
            <span class="lbl">Harta Akhir</span>
            <span class="val">${Utils.formatMoney(GameState.getNetWorth(), s.countryId, true)}</span>
          </div>
          <div class="summary-stat">
            <span class="lbl">Keputusan Karma</span>
            <span class="val" style="color:${karmaInfo.color};">${karmaInfo.icon} ${s.alignment.karma} (${karmaInfo.text})</span>
          </div>
          <div class="summary-stat">
            <span class="lbl">Populariti Tertinggi</span>
            <span class="val">⭐ ${s.alignment.peakFame || s.alignment.fame}% • ${SocialMedia.formatFollowers(s.socialMedia.followers)} Pengikut</span>
          </div>
          <div class="summary-stat">
            <span class="lbl">Status Dinasti (Gen ${s.generation || 1})</span>
            <span class="val">${window.Dynasty ? `${Dynasty.getStatusBadge(Dynasty.getData().legacyStatus).icon} ${Dynasty.getStatusBadge(Dynasty.getData().legacyStatus).label} (${Dynasty.getData().familyReputation}%)` : '🛡️ Utuh'}</span>
          </div>
          <div class="summary-stat">
            <span class="lbl">Negara Didiami</span>
            <span class="val">${s.countriesLivedIn.map(id => Utils.getCountry(id).flag).join(' → ')} (${s.countriesLivedIn.length})</span>
          </div>
        </div>

        ${highlightsHtml}

        <div class="section-heading">🗝️ Penamat Rahsia Dibuka (${unlocked.endings.length} / ${KarmaEndings.ENDINGS_CATALOG.length}) • Mod Dicuba (${unlocked.modes.length} / ${KarmaEndings.MODES_LIST.length})</div>
        <div class="endings-grid">${endingsGrid}</div>

        ${kidsHtml}
        <button class="${eligibleHeirs.length === 0 ? 'primary-btn' : 'ghost-btn'}" id="btn-death-new-life" style="margin-top:10px;width:100%;">🌱 Mulakan Watak Baharu (Gen 1)</button>
      `
    });

    document.querySelectorAll('.continue-kid-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.LegalInheritanceEngine && Modals.showEstateStatementModal) {
          Modals.showEstateStatementModal(btn.dataset.kidId);
          return;
        }
        const next = GameState.continueFamilyLegacy(btn.dataset.kidId);
        if (next) {
          Modals.close(true);
          App.renderAll();
          App.toast(`👑 Menyambung legasi sebagai ${next.name} (Gen ${next.generation})!`, 'culture');
          if (window.LegacyModals && LegacyModals.checkAndToastPendingPrime) {
            setTimeout(() => LegacyModals.checkAndToastPendingPrime(), 350);
          }
        }
      });
    });

    document.getElementById('btn-death-new-life').addEventListener('click', () => {
      GameState.clearSave();
      if (GameState.resetSessionState) GameState.resetSessionState({ clearCurrent: true });
      Modals.close(true);
      App.showStartScreen({ skipSave: true });
    });
  }
};
