/* ==========================================================================
   WorldLife — Antara Muka Mod Hidup (5 Mod), Laman Sosial, Jodoh & Legasi
   Bahasa Melayu
   ========================================================================== */

window.ModeModals = {
  // --------------------------------------------------------------------------
  // 1. HAB LALUAN HIDUP (5 MOD KHAS + MOD PENJARA)
  // --------------------------------------------------------------------------
  showLifeModes(activeTab = 'crime') {
    const s = GameState.current;
    GameState.ensureUpgradedState();
    const c = Utils.getCountry(s.countryId);

    // Jika sedang di penjara, paparkan papan pemuka penjara secara automatik di bahagian atas!
    let prisonHtml = '';
    if (s.prison.inPrison) {
      prisonHtml = `
        <div class="info-banner" style="background:#fef2f2;border-color:#fca5a5;">
          <strong>⛓️ ANDA DI DALAM PENJARA (Baki ${s.prison.yearsLeft} tahun)</strong><br/>
          Kesalahan: ${Utils.escapeHtml(s.prison.crimeName || 'Kesalahan Jenayah')}<br/>
          <small>Pilih tindakan penjara di bawah atau klik +UMUR untuk menjalani hukuman.</small>
        </div>
        <div class="action-list" style="margin-bottom:12px;">
          <button class="action-item prison-act-btn" data-pact="rehab" ${s.yearlyActions.prisonAct ? 'disabled' : ''}>
            <span class="ai-icon">🕊️</span>
            <span class="ai-content">
              <span class="ai-title">Program Keinsafan &amp; Pemulihan</span>
              <span class="ai-desc">Karma ++, kurangkan Haba Polis &amp; peluang tolak 1 tahun hukuman</span>
            </span>
            <span class="ai-right">Taubat</span>
          </button>
          <button class="action-item prison-act-btn" data-pact="workout" ${s.yearlyActions.prisonAct ? 'disabled' : ''}>
            <span class="ai-icon">🏋️</span>
            <span class="ai-content">
              <span class="ai-title">Latih Fizikal &amp; Baca Buku Sel</span>
              <span class="ai-desc">Kesihatan +8%, Kepintaran +5%</span>
            </span>
            <span class="ai-right">Kuat +</span>
          </button>
          <button class="action-item prison-act-btn" data-pact="parole" ${s.yearlyActions.prisonAct ? 'disabled' : ''}>
            <span class="ai-icon">🔓</span>
            <span class="ai-content">
              <span class="ai-title">Mohon Pembebasan Parol</span>
              <span class="ai-desc">Karma tinggi meningkatkan peluang bebas awal</span>
            </span>
            <span class="ai-right">Parol</span>
          </button>
          <button class="action-item prison-act-btn" data-pact="escape" ${s.yearlyActions.prisonAct ? 'disabled' : ''}>
            <span class="ai-icon">🚨</span>
            <span class="ai-content">
              <span class="ai-title">Rancang Bolos Penjara</span>
              <span class="ai-desc">Berisiko tinggi — gagal tambah +2 tahun hukuman!</span>
            </span>
            <span class="ai-right cost">Bahaya</span>
          </button>
        </div>
      `;
    }

    const tabsHtml = `
      <div class="tab-pills">
        <button class="tab-pill mode-tab ${activeTab === 'crime' ? 'active' : ''}" data-mtab="crime">🕶️ Jenayah</button>
        <button class="tab-pill mode-tab ${activeTab === 'mafia' ? 'active' : ''}" data-mtab="mafia">🎩 Mafia</button>
        <button class="tab-pill mode-tab ${activeTab === 'artist' ? 'active' : ''}" data-mtab="artist">🎵 Artis</button>
        <button class="tab-pill mode-tab ${activeTab === 'actor' ? 'active' : ''}" data-mtab="actor">🎬 Pelakon</button>
        <button class="tab-pill mode-tab ${activeTab === 'politic' ? 'active' : ''}" data-mtab="politic">🏛️ Politik</button>
      </div>
    `;

    let body = '';

    if (activeTab === 'crime') {
      body += `
        <div class="info-banner" style="background:#fff7ed;border-color:#fed7aa;">
          <strong>🕶️ Mod Jenayah • Haba Polis: ${s.alignment.notoriety}%</strong><br/>
          Operasi Berjaya: <strong>${s.modes.crime.opsSuccess}</strong> • Rompakan Besar: <strong>${s.modes.crime.heistsDone}</strong> • Rekod Jenayah: <strong>${s.criminalRecord}</strong><br/>
          <small>Semakin tinggi Haba Polis, semakin besar risiko serbuan pasukan khas &amp; perbicaraan mahkamah!</small>
        </div>
        <div class="action-list">
          ${UnderworldModes.CRIME_OPS.map(op => `
            <button class="action-item crime-op-btn" data-op="${op.id}" ${s.yearlyActions.crimeOp || s.prison.inPrison ? 'disabled' : ''}>
              <span class="ai-icon">${op.icon}</span>
              <span class="ai-content">
                <span class="ai-title">${Utils.escapeHtml(op.name)}</span>
                <span class="ai-desc">${Utils.escapeHtml(op.desc)} (Umur ${op.minAge}+)</span>
              </span>
              <span class="ai-right cost">Haba +${op.heat}%</span>
            </button>
          `).join('')}
        </div>
      `;
    } else if (activeTab === 'mafia') {
      const m = s.modes.mafia;
      if (!m.active) {
        const synName = UnderworldModes.SYNDICATES[s.countryId] || 'Sindiket Bayangan';
        body += `
          <div class="info-banner" style="background:#1e1b4b;color:#f8fafc;border-color:#312e81;">
            <strong style="color:#fbbf24;">🎩 Mod Mafia / Sindiket (${synName})</strong><br/>
            Mulakan tangga kuasa dari <em>Ahli Baru → Askar → Penguatkuasa → Capo → Underboss → Godfather</em>.<br/>
            <small style="opacity:0.85;">Wang haram lumayan &amp; kuasa mutlak — tetapi penuh pengkhianatan, perang wilayah &amp; serbuan polis.</small>
          </div>
          <button class="primary-btn" id="btn-join-mafia" ${s.prison.inPrison ? 'disabled' : ''}>🎩 Angkat Sumpah Omertà &amp; Sertai Sindiket (Umur 18+)</button>
        `;
      } else {
        const rank = UnderworldModes.MAFIA_RANKS[m.rankIndex] || UnderworldModes.MAFIA_RANKS[0];
        const nextRank = UnderworldModes.MAFIA_RANKS[m.rankIndex + 1];
        body += `
          <div class="info-banner" style="background:#1e1b4b;color:#f8fafc;border-color:#312e81;">
            <strong style="color:#fbbf24;">🎩 ${Utils.escapeHtml(m.syndicateName)}</strong><br/>
            Pangkat: <strong>${rank.title}</strong> • Hormat Sindiket: <strong>${m.respect}%</strong><br/>
            Pendapatan Sindiket: <strong>${Utils.formatMoney(Utils.usdToLocal(rank.annualUsd, s.countryId), s.countryId)}/thn</strong><br/>
            ${nextRank ? `<small style="opacity:0.85;">Pangkat seterusnya: ${nextRank.title} (Perlu ${nextRank.reqRespect}% Hormat)</small>` : '<small style="color:#fbbf24;">👑 Anda ialah puncak tertinggi sindiket!</small>'}
          </div>
          <div class="action-list">
            <button class="action-item mafia-act-btn" data-mact="extort" ${s.yearlyActions.mafiaAct || s.prison.inPrison ? 'disabled' : ''}>
              <span class="ai-icon">💼</span>
              <span class="ai-content">
                <span class="ai-title">Kutip Wang Perlindungan</span>
                <span class="ai-desc">Pendapatan cepat, Hormat +, Haba Polis +</span>
              </span>
              <span class="ai-right">Hormat +</span>
            </button>
            <button class="action-item mafia-act-btn" data-mact="launder" ${s.yearlyActions.mafiaAct || s.prison.inPrison ? 'disabled' : ''}>
              <span class="ai-icon">🏦</span>
              <span class="ai-content">
                <span class="ai-title">Cuci Wang Haram (Money Laundering)</span>
                <span class="ai-desc">Bersihkan dana melalui syarikat proksi &amp; sejukkan Haba Polis</span>
              </span>
              <span class="ai-right">Haba -6%</span>
            </button>
            <button class="action-item mafia-act-btn" data-mact="turf_war" ${s.yearlyActions.mafiaAct || s.prison.inPrison ? 'disabled' : ''}>
              <span class="ai-icon">🔥</span>
              <span class="ai-content">
                <span class="ai-title">Lancarkan Perang Wilayah (Turf War)</span>
                <span class="ai-desc">Rampas kawasan pesaing — ganjaran gergasi, risiko cedera/ditangkap!</span>
              </span>
              <span class="ai-right cost">Bahaya</span>
            </button>
            <button class="action-item mafia-act-btn" data-mact="leave" ${s.prison.inPrison ? 'disabled' : ''}>
              <span class="ai-icon">🚪</span>
              <span class="ai-content">
                <span class="ai-title">Tinggalkan Sindiket</span>
                <span class="ai-desc">Cuba keluar daripada dunia gelap (risiko diserang sindiket!)</span>
              </span>
              <span class="ai-right cost">Keluar</span>
            </button>
          </div>
        `;
      }
    } else if (activeTab === 'artist') {
      const a = s.modes.artist;
      if (!a.active) {
        body += `
          <div class="info-banner highlight">
            <strong>🎵 Mod Artis, Muzik &amp; Seni Visual</strong><br/>
            Bina nama dari <em>Artis Jalanan/Indie → Single Viral → Kontrak Rakaman → Jelajah Arena → Ikon Budaya</em>!
          </div>
          <button class="primary-btn" id="btn-start-artist" ${s.prison.inPrison ? 'disabled' : ''}>🎵 Mulakan Kerjaya Artis (Umur 15+)</button>
        `;
      } else {
        const rank = FameModes.ARTIST_RANKS[a.rankIndex] || FameModes.ARTIST_RANKS[0];
        body += `
          <div class="info-banner highlight">
            <strong>🎵 ${rank.title}</strong><br/>
            Kemahiran Seni: <strong>${a.skill}%</strong> • Karya Dilancar: <strong>${a.releases || 0}</strong> • Anugerah: <strong>🏆 ${a.awards || 0}</strong><br/>
            Kontrak: <strong>${a.contractType === 'predatory' ? 'Mega (Potongan Royalti)' : a.contractType === 'fair' ? 'Adil (Hak Cipta Penuh)' : 'Bebas / Indie'}</strong>
          </div>
          <div class="action-list">
            <button class="action-item artist-act-btn" data-aact="release" ${s.yearlyActions.artistAct || s.prison.inPrison ? 'disabled' : ''}>
              <span class="ai-icon">💿</span>
              <span class="ai-content">
                <span class="ai-title">Lancar Single / Album / Pameran Seni</span>
                <span class="ai-desc">Peluang menjadi HIT, tarik pengikut &amp; menang anugerah!</span>
              </span>
              <span class="ai-right">Royalti ++</span>
            </button>
            <button class="action-item artist-act-btn" data-aact="tour" ${s.yearlyActions.artistAct || s.prison.inPrison ? 'disabled' : ''}>
              <span class="ai-icon">🎤</span>
              <span class="ai-content">
                <span class="ai-title">Jelajah Konsert / Pameran Arena</span>
                <span class="ai-desc">Pendapatan besar &amp; Populariti ++, risiko keletihan (burnout)</span>
              </span>
              <span class="ai-right">Tunai +++</span>
            </button>
            <button class="action-item artist-act-btn" data-aact="diss" ${s.yearlyActions.artistAct || s.prison.inPrison ? 'disabled' : ''}>
              <span class="ai-icon">🔥</span>
              <span class="ai-content">
                <span class="ai-title">Lancar Diss Track / Kontroversi Pesaing</span>
                <span class="ai-desc">Populariti meletup, tetapi Karma - &amp; risiko saman plagiat!</span>
              </span>
              <span class="ai-right cost">Drama</span>
            </button>
          </div>
        `;
      }
    } else if (activeTab === 'actor') {
      const ac = s.modes.actor;
      if (!ac.active) {
        body += `
          <div class="info-banner highlight">
            <strong>🎬 Mod Pelakon &amp; Layar Perak</strong><br/>
            Mendaki dari <em>Pelakon Tambahan → Iklan → Siri TV → Bintang Utama Filem → Ikon Global / Pengarah</em>!
          </div>
          <button class="primary-btn" id="btn-start-actor" ${s.prison.inPrison ? 'disabled' : ''}>🎬 Mulakan Kerjaya Pelakon (Umur 15+)</button>
        `;
      } else {
        const rank = FameModes.ACTOR_RANKS[ac.rankIndex] || FameModes.ACTOR_RANKS[0];
        body += `
          <div class="info-banner highlight">
            <strong>🎬 ${rank.title}</strong><br/>
            Bakat Lakonan: <strong>${ac.skill}%</strong> • Produksi: <strong>${ac.films || 0}</strong> • Trofi Filem: <strong>🏆 ${ac.awards || 0}</strong>
          </div>
          <div class="action-list">
            <button class="action-item actor-act-btn" data-acact="audition" ${s.yearlyActions.actorAct || s.prison.inPrison ? 'disabled' : ''}>
              <span class="ai-icon">🎥</span>
              <span class="ai-content">
                <span class="ai-title">Sertai Uji Bakat &amp; Penggambaran Filem</span>
                <span class="ai-desc">Bayaran tinggi, naik taraf kerjaya &amp; peluang trofi filem</span>
              </span>
              <span class="ai-right">Uji Bakat</span>
            </button>
            <button class="action-item actor-act-btn" data-acact="indie_challenge" ${s.yearlyActions.actorAct || s.prison.inPrison ? 'disabled' : ''}>
              <span class="ai-icon">🎭</span>
              <span class="ai-content">
                <span class="ai-title">Filem Indie (Pecahkan Typecasting)</span>
                <span class="ai-desc">Gaji sederhana tetapi kemahiran lakonan melonjak +18%</span>
              </span>
              <span class="ai-right">Bakat ++</span>
            </button>
            <button class="action-item actor-act-btn" data-acact="pr_stunt" ${s.yearlyActions.actorAct || s.prison.inPrison ? 'disabled' : ''}>
              <span class="ai-icon">📸</span>
              <span class="ai-content">
                <span class="ai-title">Gimik Paparazi &amp; Gosip Tabloid</span>
                <span class="ai-desc">Populariti +18% &amp; pengikut naik, Karma -8</span>
              </span>
              <span class="ai-right cost">Sensasi</span>
            </button>
          </div>
        `;
      }
    } else if (activeTab === 'politic') {
      const p = s.modes.politic;
      if (!p.active) {
        body += `
          <div class="info-banner highlight">
            <strong>🏛️ Mod Politik &amp; Kepimpinan Negara (${c.name} ${c.flag})</strong><br/>
            Pilih kem politik anda dan daki dari <em>Aktivis Belia → Ahli Majlis → Ahli Parlimen → Menteri → Perdana Menteri / Presiden</em>!
          </div>
          <div class="action-list">
            <button class="action-item start-pol-btn" data-fac="Reformasi Rakyat" ${s.prison.inPrison ? 'disabled' : ''}>
              <span class="ai-icon">🌿</span>
              <span class="ai-content">
                <span class="ai-title">Sertai Kem Reformasi Rakyat (Umur 21+)</span>
                <span class="ai-desc">Fokus integriti, ketelusan &amp; dasar kebajikan rakyat</span>
              </span>
              <span class="ai-right">Sertai</span>
            </button>
            <button class="action-item start-pol-btn" data-fac="Gabungan Elit Korporat" ${s.prison.inPrison ? 'disabled' : ''}>
              <span class="ai-icon">💼</span>
              <span class="ai-content">
                <span class="ai-title">Sertai Gabungan Elit Korporat (Umur 21+)</span>
                <span class="ai-desc">Fokus ekonomi kapitalis, kuasa lobi &amp; strategi politik keras</span>
              </span>
              <span class="ai-right">Sertai</span>
            </button>
          </div>
        `;
      } else {
        const rank = FameModes.POLITIC_RANKS[p.rankIndex] || FameModes.POLITIC_RANKS[0];
        const nextRank = FameModes.POLITIC_RANKS[p.rankIndex + 1];
        const campCost = Utils.usdToLocal(1800 * (p.rankIndex + 1), s.countryId);
        body += `
          <div class="info-banner highlight">
            <strong>🏛️ ${rank.title} (${Utils.escapeHtml(p.faction)})</strong><br/>
            Sokongan Rakyat: <strong>${p.approval}%</strong> • Dasar Lulus: <strong>${p.policiesPassed || 0}</strong><br/>
            ${nextRank ? `<small>Jawatan Seterusnya: ${nextRank.title} (Disyorkan ${nextRank.reqApproval}% Sokongan)</small>` : '<small>👑 Anda memimpin puncak tertinggi negara!</small>'}
          </div>
          <div class="action-list">
            ${nextRank ? `
              <button class="action-item pol-act-btn" data-polact="campaign" ${s.yearlyActions.politicAct || s.prison.inPrison ? 'disabled' : ''}>
                <span class="ai-icon">🗳️</span>
                <span class="ai-content">
                  <span class="ai-title">Kempen Pilihan Raya: ${nextRank.title}</span>
                  <span class="ai-desc">Bertanding untuk naik ke peringkat kepimpinan seterusnya</span>
                </span>
                <span class="ai-right cost">${Utils.formatMoney(campCost, s.countryId)}</span>
              </button>
            ` : ''}
            <button class="action-item pol-act-btn" data-polact="clean_reform" ${s.yearlyActions.politicAct || s.prison.inPrison ? 'disabled' : ''}>
              <span class="ai-icon">🌿</span>
              <span class="ai-content">
                <span class="ai-title">Luluskan Dasar Reformasi Bersih</span>
                <span class="ai-desc">Karma +16, Sokongan Rakyat +10–16%</span>
              </span>
              <span class="ai-right">Bersih +</span>
            </button>
            <button class="action-item pol-act-btn" data-polact="media_debate" ${s.yearlyActions.politicAct || s.prison.inPrison ? 'disabled' : ''}>
              <span class="ai-icon">🎙️</span>
              <span class="ai-content">
                <span class="ai-title">Sertai Debat Media Nasional</span>
                <span class="ai-desc">Uji kepintaran &amp; tarik populariti di televisyen</span>
              </span>
              <span class="ai-right">Debat</span>
            </button>
            <button class="action-item pol-act-btn" data-polact="dirty_lobby" ${s.yearlyActions.politicAct || s.prison.inPrison ? 'disabled' : ''}>
              <span class="ai-icon">💵</span>
              <span class="ai-content">
                <span class="ai-title">Terima Dana Lobi Kotor (Korup)</span>
                <span class="ai-desc">Wang tunai segera besar, tetapi risiko siasatan rasuah &amp; dipecat!</span>
              </span>
              <span class="ai-right cost">Korup</span>
            </button>
          </div>
        `;
      }
    }

    Modals.open({
      icon: '🎭',
      title: 'Laluan Hidup & 5 Mod Khas',
      subtitle: `Karma: ${s.alignment.karma} • Populariti: ${s.alignment.fame}% • Haba Polis: ${s.alignment.notoriety}%`,
      bodyHtml: prisonHtml + tabsHtml + body
    });

    document.querySelectorAll('.mode-tab').forEach(btn => {
      btn.addEventListener('click', () => this.showLifeModes(btn.dataset.mtab));
    });

    document.querySelectorAll('.prison-act-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = UnderworldModes.prisonAction(btn.dataset.pact);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showLifeModes(activeTab);
      });
    });

    document.querySelectorAll('.crime-op-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = UnderworldModes.commitCrimeOp(btn.dataset.op);
        App.toast(res.msg, res.ok ? 'culture' : 'error');
        App.renderAll();
        if (res.followUpEvent) Modals.showEvent(res.followUpEvent);
        else this.showLifeModes('crime');
      });
    });

    const joinMafiaBtn = document.getElementById('btn-join-mafia');
    if (joinMafiaBtn) {
      joinMafiaBtn.addEventListener('click', () => {
        const res = UnderworldModes.joinMafia();
        App.toast(res.msg, res.ok ? 'culture' : 'error');
        App.renderAll();
        this.showLifeModes('mafia');
      });
    }

    document.querySelectorAll('.mafia-act-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = UnderworldModes.mafiaAction(btn.dataset.mact);
        App.toast(res.msg, res.ok ? 'culture' : 'error');
        App.renderAll();
        if (res.followUpEvent) Modals.showEvent(res.followUpEvent);
        else this.showLifeModes('mafia');
      });
    });

    const startArtistBtn = document.getElementById('btn-start-artist');
    if (startArtistBtn) {
      startArtistBtn.addEventListener('click', () => {
        const res = FameModes.startArtist();
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showLifeModes('artist');
      });
    }

    document.querySelectorAll('.artist-act-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = FameModes.artistAction(btn.dataset.aact);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showLifeModes('artist');
      });
    });

    const startActorBtn = document.getElementById('btn-start-actor');
    if (startActorBtn) {
      startActorBtn.addEventListener('click', () => {
        const res = FameModes.startActor();
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showLifeModes('actor');
      });
    }

    document.querySelectorAll('.actor-act-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = FameModes.actorAction(btn.dataset.acact);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showLifeModes('actor');
      });
    });

    document.querySelectorAll('.start-pol-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = FameModes.startPolitic(btn.dataset.fac);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showLifeModes('politic');
      });
    });

    document.querySelectorAll('.pol-act-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = FameModes.politicAction(btn.dataset.polact);
        App.toast(res.msg, res.ok ? 'success' : 'error');
        App.renderAll();
        this.showLifeModes('politic');
      });
    });
  },

  // --------------------------------------------------------------------------
  // 2. HAB LAMAN SOSIAL, KERJAYA VIRAL & APLIKASI JODOH / TA'ARUF HALAL
  // --------------------------------------------------------------------------
  showSocialHub(activeTab = 'social') {
    const s = GameState.current;
    GameState.ensureUpgradedState();
    const muslim = Relationships.isMuslim(s);

    const tabsHtml = `
      <div class="tab-pills">
        <button class="tab-pill soc-tab ${activeTab === 'social' ? 'active' : ''}" data-stab="social">📱 Laman Sosial</button>
        <button class="tab-pill soc-tab ${activeTab === 'viral' ? 'active' : ''}" data-stab="viral">⚡ Kerjaya Viral</button>
        <button class="tab-pill soc-tab ${activeTab === 'dating' ? 'active' : ''}" data-stab="dating">${muslim ? '🤲 Ta\'aruf Halal' : '💘 SwipeMatch'}</button>
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
      const minAge = muslim ? 18 : 16;
      if (s.age < minAge) {
        body += `<div class="info-banner">Platform ini dibuka pada umur ${minAge} tahun.</div>`;
      } else if (s.partnerId) {
        body += `<div class="info-banner highlight">Anda sudah mempunyai pasangan aktif! Uruskan hubungan anda di tab <strong>❤️ Hubungan</strong>.</div>`;
      } else {
        const pool = (s._datingPool && s._datingPool.length > 0) ? s._datingPool : SocialMedia.generateDatingCandidates();
        body += `
          <div class="info-banner ${muslim ? 'culture-box' : 'highlight'}">
            <strong>${muslim ? '🤲 BaitulMuslim — Platform Ta\'aruf & Jodoh Halal' : '💘 SwipeMatch — Aplikasi Janji Temu'}</strong><br/>
            ${muslim
              ? 'Calon disaring untuk niat perkahwinan sah mengikut batas syariah. Namun hati manusia tetap punya ujian — kenali dengan bijak!'
              : 'Leret & pilih calon pasangan! Awas: sesetengah profil mungkin menyembunyikan <em>Red Flag</em> (kaki kikis, catfish, rahsia berkahwin) atau Jodoh Sejati!'}
          </div>
          <div class="action-list">
            ${pool.map(cand => {
              const bObj = GameState.getBeliefObj(cand.belief);
              return `
                <div class="dating-card">
                  <div class="dc-top">
                    <strong>${Utils.escapeHtml(cand.name)} <small>(${cand.age} thn)</small></strong>
                    <span class="dc-badge">✨ Rupa ${cand.looks}%</span>
                  </div>
                  <div class="dc-meta">
                    💼 ${Utils.escapeHtml(cand.job)} • 💰 ${cand.wealth}<br/>
                    ${bObj.icon} ${bObj.name} • 🤝 Keserasian ${cand.compatibility}%
                  </div>
                  <button class="btn-sm primary match-cand-btn" data-uid="${cand.uid}" style="width:100%;margin-top:8px;">
                    ${muslim ? '🤲 Mula Ta\'aruf Terhormat' : '💘 Swipe Kanan (Match!)'}
                  </button>
                </div>
              `;
            }).join('')}
          </div>
          <button class="ghost-btn" id="btn-refresh-dating" style="margin-top:8px;">🔄 Cari Senarai Calon Lain</button>
        `;
      }
    }

    Modals.open({
      icon: activeTab === 'dating' ? (muslim ? '🤲' : '💘') : '📱',
      title: activeTab === 'dating' ? (muslim ? 'Platform Ta\'aruf Halal' : 'SwipeMatch') : 'Laman Sosial & Viral',
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

    const refBtn = document.getElementById('btn-refresh-dating');
    if (refBtn) {
      refBtn.addEventListener('click', () => {
        SocialMedia.generateDatingCandidates();
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
    const beliefObj = GameState.getBeliefObj(s.belief);
    const livingKids = s.relationships.filter(r => ['Anak Lelaki', 'Anak Perempuan', 'Son', 'Daughter'].includes(r.role) && r.alive);

    const highlightsHtml = (s.highlights && s.highlights.length > 0)
      ? `<div class="obituary-box">
           <strong>📜 Detik Paling Bersejarah Dalam Hidup Anda</strong>
           <ul class="obituary-list">
             ${s.highlights.slice(-6).map(h => `<li>${h.icon} <strong>Umur ${h.age}:</strong> ${Utils.escapeHtml(h.text)}</li>`).join('')}
           </ul>
         </div>`
      : '';

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

    Modals.open({
      icon: ending.icon,
      title: 'Obituari & Laporan Legasi',
      subtitle: `${s.name} • Gen ${s.generation || 1} (${s.year - s.age} – ${s.year})`,
      locked: true,
      bodyHtml: `
        <div class="ribbon-hero">
          <div style="font-size:42px;line-height:1;">${ending.icon}</div>
          <h3 style="margin:6px 0 2px;font-family:'Outfit',sans-serif;">${Utils.escapeHtml(s.name)}</h3>
          <div style="font-size:12px;opacity:0.88;">Meninggal dunia pada umur ${s.age} tahun di ${s.city}, ${c.name} ${c.flag} (${Utils.escapeHtml(s.causeOfDeath || 'Sakit tua')})</div>
          <div class="ribbon-badge">🏆 Gelaran: ${ending.title}</div>
          <div style="font-size:12px;margin-top:8px;opacity:0.92;">${Utils.escapeHtml(ending.desc)}</div>
        </div>

        <div class="obituary-box">
          <strong>📰 Bagaimana Dunia Mengingati Anda</strong><br/>
          ${Utils.escapeHtml(ending.publicMemory)}<br/>
          <div style="margin-top:6px;"><strong>❤️ Ingatan Keluarga:</strong> ${Utils.escapeHtml(KarmaEndings.getFamilyMemory(s))}</div>
        </div>

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
            <span class="lbl">Pegangan Akhir</span>
            <span class="val">${beliefObj.icon} ${beliefObj.name}</span>
          </div>
          <div class="summary-stat">
            <span class="lbl">Status Dinasti (Gen ${s.generation || 1})</span>
            <span class="val">${window.Dynasty ? `${Dynasty.getStatusBadge(Dynasty.getData().legacyStatus).icon} ${Dynasty.getStatusBadge(Dynasty.getData().legacyStatus).label} (${Dynasty.getData().familyReputation}%)` : '🛡️ Utuh'}</span>
          </div>
          <div class="summary-stat">
            <span class="lbl">Negara Didiami</span>
            <span class="val">${s.countriesLivedIn.map(id => Utils.getCountry(id).flag).join(' ')} (${s.countriesLivedIn.length})</span>
          </div>
        </div>

        ${highlightsHtml}

        <div class="section-heading">🗝️ Penamat Rahsia Dibuka (${unlocked.endings.length} / ${KarmaEndings.ENDINGS_CATALOG.length}) • Mod Dicuba (${unlocked.modes.length} / ${KarmaEndings.MODES_LIST.length})</div>
        <div class="endings-grid">${endingsGrid}</div>

        ${kidsHtml}
        <button class="primary-btn" id="btn-continue-legacy-heir" style="margin-top:10px;background:linear-gradient(135deg,#6d28d9,#4f46e5);">
          👑 Sambung Legasi Keluarga (Main Sebagai Pewaris — Gen ${(s.generation || 1) + 1})
        </button>
        <button class="ghost-btn" id="btn-death-new-life" style="margin-top:8px;">✨ Mula Dinasti &amp; Kehidupan Baru (Gen 1)</button>
      `
    });

    const heirBtn = document.getElementById('btn-continue-legacy-heir');
    if (heirBtn) {
      heirBtn.addEventListener('click', () => {
        const next = GameState.continueFamilyLegacy();
        if (next) {
          Modals.close(true);
          App.renderAll();
          App.toast(`👑 Menyambung Dinasti Generasi ${next.generation} sebagai ${next.name}!`, 'culture');
          if (window.LegacyModals && LegacyModals.checkAndToastPendingPrime) {
            setTimeout(() => LegacyModals.checkAndToastPendingPrime(), 350);
          }
        }
      });
    }

    document.querySelectorAll('.continue-kid-btn').forEach(btn => {
      btn.addEventListener('click', () => {
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
      Modals.close(true);
      App.showStartScreen();
    });
  }
};
