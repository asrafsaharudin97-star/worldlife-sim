/* ==========================================================================
   WorldLife — Data & Enjin Konflik Rumah Tangga / Hubungan (Bahasa Melayu)
   20 Senario Padat: Curang, Kewangan, Mentua, Abaikan Pasangan, Rahsia Jenayah, Isu Anak
   ========================================================================== */

window.RelationshipDramaData = {
  SCENARIOS: [
    // --- CURANG & CEMBURU (4) ---
    {
      id: 'curang_mesej_malam',
      category: 'curang',
      icon: '📱',
      title: 'Mesej Mencurigakan Tengah Malam',
      textFn: (s, p) => `Telefon ${p.name} berdering berkali-kali pada pukul 2 pagi dengan mesej manja daripada nombor tidak dikenali. Apabila ditanya, ${p.name} kelihatan gelisah dan cuba menukar topik.`,
      trustDeltaBase: -14
    },
    {
      id: 'curang_bekas_kekasih',
      category: 'curang',
      icon: '💔',
      title: 'Pertemuan Rahsia Dengan Bekas Kekasih',
      textFn: (s, p) => `Seorang kenalan memberitahu anda bahawa dia ternampak ${p.name} makan malam berdua bersama bekas kekasihnya di sebuah restoran terpencil tanpa pengetahuan anda.`,
      trustDeltaBase: -16
    },
    {
      id: 'curang_rakan_sekerja',
      category: 'curang',
      icon: '🕵️',
      title: 'Kemesraan Melampau di Pejabat',
      textFn: (s, p) => `Anda terserempak dengan mesej bergurau senda yang agak melampaui batas antara ${p.name} dan rakan sekerjanya. Hati anda mula diragui rasa curiga.`,
      trustDeltaBase: -12
    },
    {
      id: 'curang_fitnah_media',
      category: 'curang',
      icon: '📸',
      title: 'Gosip & Foto Tular',
      textFn: (s, p) => `Satu foto mesra yang mengelirukan melibatkan diri anda bersama kenalan luar tersebar di kumpulan sembang. ${p.name} menuntut penjelasan jujur dengan nada tegas.`,
      trustDeltaBase: -10
    },

    // --- KEWANGAN (4) ---
    {
      id: 'kewangan_hutang_sorok',
      category: 'kewangan',
      icon: '💳',
      title: 'Hutang Kad Kredit Disorokkan',
      textFn: (s, p) => `Penyata bank yang terjatuh mendedahkan hutang peribadi yang tidak pernah dibincangkan. ${p.name} berasa dikhianati kerana isu kewangan disembunyikan daripadanya.`,
      trustDeltaBase: -12
    },
    {
      id: 'kewangan_boros',
      category: 'kewangan',
      icon: '🛍️',
      title: 'Perbelanjaan Mewah Tanpa Perbincangan',
      textFn: (s, p) => `Berlaku pertengkaran hangat tentang perbelanjaan mewah bulan ini yang hampir menghabiskan simpanan kecemasan keluarga.`,
      trustDeltaBase: -8
    },
    {
      id: 'kewangan_pinjam_saudara',
      category: 'kewangan',
      icon: '💸',
      title: 'Pinjamkan Wang Kepada Saudara',
      textFn: (s, p) => `${p.name} berang apabila mengetahui sejumlah wang simpanan bersama telah dipinjamkan kepada kenalan tanpa persetujuan kedua-dua pihak.`,
      trustDeltaBase: -10
    },
    {
      id: 'kewangan_tekanan_bil',
      category: 'kewangan',
      icon: '📉',
      title: 'Tekanan Kos Sara Hidup',
      textFn: (s, p) => `Bil bulanan yang melambung tinggi mencetuskan ketegangan. ${p.name} merasakan beban kewangan rumah tangga tidak diagihkan secara adil.`,
      trustDeltaBase: -8
    },

    // --- MENTUA & KELUARGA (3) ---
    {
      id: 'mentua_campur_tangan',
      category: 'mentua',
      icon: '🏠',
      title: 'Campur Tangan Keluarga Mentua',
      textFn: (s, p) => `Keluarga mentua kerap masuk campur dalam keputusan peribadi rumah tangga anda. ${p.name} serba salah antara menjaga hati ibu bapa atau pasangan sendiri.`,
      trustDeltaBase: -9
    },
    {
      id: 'mentua_balik_kampung',
      category: 'mentua',
      icon: '🚗',
      title: 'Rebut Giliran Balik Kampung',
      textFn: (s, p) => `Menjelang musim cuti perayaan, pertikaman lidah tercetus mengenai giliran pulang ke kampung halaman. Masing-masing berasa keluarga sendiri dipinggirkan.`,
      trustDeltaBase: -7
    },
    {
      id: 'mentua_perbandingan',
      category: 'mentua',
      icon: '🗣️',
      title: 'Sindiran & Perbandingan Saudara',
      textFn: (s, p) => `Dalam majlis keluarga, saudara mentua membandingkan kerjaya dan gaya hidup anda secara terbuka, namun ${p.name} hanya berdiam diri tidak mempertahankan anda.`,
      trustDeltaBase: -10
    },

    // --- ABAIKAN PASANGAN (4) ---
    {
      id: 'abaikan_kerja_keras',
      category: 'abaikan',
      icon: '💼',
      title: 'Terlalu Sibuk Mengejar Kerjaya',
      textFn: (s, p) => `${p.name} meluahkan rasa sunyi kerana anda sering pulang lewat dan membawa pulang urusan kerja hingga mengabaikan masa berkualiti bersama.`,
      trustDeltaBase: -9
    },
    {
      id: 'abaikan_tarikh_penting',
      category: 'abaikan',
      icon: '🗓️',
      title: 'Terlupa Ulang Tahun Penting',
      textFn: (s, p) => `Anda terlupa sepenuhnya tarikh ulang tahun istimewa bersama ${p.name}. Wajah kecewa ${p.name} jelas menunjukkan hatinya terguris.`,
      trustDeltaBase: -8
    },
    {
      id: 'abaikan_mod_khas',
      category: 'abaikan',
      icon: '⚡',
      title: 'Tuntutan Dunia Elit & Mod Khas',
      condition: (s) => Boolean(s.activeSpecialMode),
      textFn: (s, p) => `Kesibukan melampau anda dalam dunia berprofil tinggi membuatkan ${p.name} berasa seperti orang asing di rumah sendiri. "Awak lebih sayangkan status daripada kita!"`,
      trustDeltaBase: -12
    },
    {
      id: 'abaikan_telefon',
      category: 'abaikan',
      icon: '📵',
      title: 'Dingin & Kurang Komunikasi',
      textFn: (s, p) => `Sudah berbulan-bulan perbualan di rumah hanya sekadar perkara rutin. ${p.name} menegur sikap anda yang semakin dingin dan sukar diajak berbual dari hati ke hati.`,
      trustDeltaBase: -9
    },

    // --- RAHSIA JENAYAH (2) ---
    {
      id: 'jenayah_rahsia_gelap',
      category: 'jenayah',
      icon: '🕶️',
      title: 'Rahsia Urusan Gelap Terbongkar',
      condition: (s) => (s.criminalRecord || 0) > 0 || (s.alignment && s.alignment.notoriety >= 20) || Boolean(s.activeSpecialMode && ['mafia', 'spy'].includes(s.activeSpecialMode.modeId)),
      textFn: (s, p) => `${p.name} menjumpai bukti penglibatan anda dalam urusan berisiko tinggi yang menyalahi undang-undang. ${p.name} ketakutan memikirkan keselamatan keluarga.`,
      trustDeltaBase: -18
    },
    {
      id: 'jenayah_polis_datang',
      category: 'jenayah',
      icon: '🚔',
      title: 'Bayang-Bayang Siasatan Polis',
      condition: (s) => (s.criminalRecord || 0) > 0 || (s.alignment && s.alignment.notoriety >= 30) || Boolean(s.fugitive && s.fugitive.isFugitive),
      textFn: (s, p) => `Pegawai penyiasat datang bertanyakan pergerakan anda di rumah. ${p.name} berasa sangat tertekan dan menyoal berapa banyak lagi rahsia yang anda sorokkan.`,
      trustDeltaBase: -16
    },

    // --- ISU ANAK & RUMAH TANGGA (3) ---
    {
      id: 'anak_cara_didikan',
      category: 'anak',
      icon: '🧒',
      title: 'Percanggahan Cara Mendidik Anak',
      condition: (s) => (s.relationships || []).some(r => ['Anak Lelaki', 'Anak Perempuan', 'Son', 'Daughter'].includes(r.role) && r.alive),
      textFn: (s, p) => `Anda dan ${p.name} bertelagah hebat mengenai disiplin dan hala tuju pendidikan anak-anak. Kedua-dua pihak berkeras cara masing-masing lebih tepat.`,
      trustDeltaBase: -8
    },
    {
      id: 'anak_beban_jaga',
      category: 'anak',
      icon: '🍼',
      title: 'Beban Penjagaan Anak Tidak Seimbang',
      condition: (s) => (s.relationships || []).some(r => ['Anak Lelaki', 'Anak Perempuan', 'Son', 'Daughter'].includes(r.role) && r.alive && r.age < 16),
      textFn: (s, p) => `${p.name} keletihan menguruskan anak-anak dan kerja rumah sendirian lalu meletus marah kerana merasakan anda kurang membantu.`,
      trustDeltaBase: -10
    },
    {
      id: 'rumahtangga_tugas_harian',
      category: 'anak',
      icon: '🧹',
      title: 'Isu Tanggungjawab Rumah Tangga',
      textFn: (s, p) => `Perkara kecil mengenai pengurusan rumah tangga bertukar menjadi pertengkaran besar apabila rasa tidak puas hati yang lama dipendam akhirnya terluah.`,
      trustDeltaBase: -8
    }
  ],

  getActivePartner(s) {
    if (!s || !s.partnerId || !Array.isArray(s.relationships)) return null;
    return s.relationships.find(r => r.id === s.partnerId && r.alive) || null;
  },

  computeConflictChance(s, partner) {
    if (!s || !partner || !partner.alive) return 0;
    // Asas 22% setahun (dalam julat 20–30%)
    let chance = 0.22;
    const stress = (s.alignment && s.alignment.stress) || 0;
    const notoriety = (s.alignment && s.alignment.notoriety) || 0;
    const hasCrime = (s.criminalRecord || 0) > 0 || notoriety >= 25 || Boolean(s.fugitive && s.fugitive.isFugitive);
    const inSpecialMode = Boolean(s.activeSpecialMode);

    if (stress >= 80) chance += 0.12;
    else if (stress >= 55) chance += 0.07;
    if (hasCrime) chance += 0.09;
    if (inSpecialMode) chance += 0.07;
    if ((partner.trust ?? 70) < 45) chance += 0.06;
    if ((partner.closeness ?? 70) < 45) chance += 0.05;

    return Math.min(0.55, chance);
  },

  maybeBuildYearlyConflictEvent(s) {
    const partner = this.getActivePartner(s);
    if (!partner) return null;
    if (s.age < 18) return null;

    // Jika kepercayaan atau kemesraan sudah kritikal (< 20), pasangan terus tuntut cerai/putus!
    if ((partner.trust ?? 70) < 20 || (partner.closeness ?? 70) < 20) {
      return this.buildSpouseInitiatedDivorceEvent(s, partner, 'Kepercayaan dan kemesraan yang terlalu rendah');
    }

    const prob = this.computeConflictChance(s, partner);
    if (!Utils.chance(prob)) return null;

    const eligible = this.SCENARIOS.filter(sc => !sc.condition || sc.condition(s, partner));
    if (eligible.length === 0) return null;
    const sc = Utils.pick(eligible);
    return this.buildConflictEvent(s, partner, sc);
  },

  buildConflictEvent(s, partner, sc) {
    const counselCost = Utils.usdToLocal(260, s.countryId);
    const isMarried = Boolean(s.married);
    const trustBefore = partner.trust ?? 65;

    return {
      id: `drama_${sc.id}_${s.age}`,
      icon: sc.icon || '⚡',
      title: `Konflik Hubungan: ${sc.title}`,
      text: `${sc.textFn(s, partner)}\n\nStatus bersama ${partner.name}: Kemesraan ${partner.closeness}% • Kepercayaan ${trustBefore}%.`,
      choices: [
        {
          label: '🤝 Pujuk & Bincang Secara Matang',
          hint: 'Percuma • Cuba tenangkan keadaan dan cari jalan tengah',
          customAction: (state) => {
            const p = this.getActivePartner(state);
            if (!p) return { outcome: 'Keadaan telah berlalu.' };
            const successChance = 0.55 + ((state.stats.smarts || 50) / 300) + ((p.trust || 50) / 400);
            if (Utils.chance(Math.min(0.88, successChance))) {
              p.trust = Utils.clamp((p.trust ?? 65) + Utils.randInt(5, 10), 0, 100);
              p.closeness = Utils.clamp((p.closeness ?? 65) + Utils.randInt(4, 9), 0, 100);
              GameState.adjustStats({ happiness: 4 });
              return {
                outcome: `Anda mendengar luahan ${p.name} dengan sabar dan berbincang dari hati ke hati. Salah faham berjaya dijernihkan (Kepercayaan ${p.trust}%, Kemesraan ${p.closeness}%).`,
                toastType: 'success'
              };
            }
            p.trust = Utils.clamp((p.trust ?? 65) - Utils.randInt(6, 12), 0, 100);
            p.closeness = Utils.clamp((p.closeness ?? 65) - Utils.randInt(5, 10), 0, 100);
            GameState.adjustStats({ happiness: -6 });
            if (p.trust < 20 || p.closeness < 20) {
              return {
                outcome: `Pujukan anda tidak lagi dipercayai oleh ${p.name}. Hatinya sudah tawar!`,
                nextEvent: this.buildSpouseInitiatedDivorceEvent(state, p, sc.title),
                toastType: 'error'
              };
            }
            return {
              outcome: `Perbincangan berjalan tegang dan ${p.name} masih terasa hati (Kepercayaan ${p.trust}%, Kemesraan ${p.closeness}%).`,
              toastType: 'error'
            };
          }
        },
        {
          label: `🛋️ Sesi Kaunseling Pasangan (${Utils.formatMoney(counselCost, s.countryId)})`,
          hint: 'Berbayar • Bantuan kaunselor profesional untuk pulihkan kepercayaan',
          customAction: (state) => {
            const p = this.getActivePartner(state);
            if (!p) return { outcome: 'Sesi dibatalkan.' };
            if (state.money < counselCost) {
              p.trust = Utils.clamp((p.trust ?? 65) - 6, 0, 100);
              p.closeness = Utils.clamp((p.closeness ?? 65) - 5, 0, 100);
              if (p.trust < 20 || p.closeness < 20) {
                return {
                  outcome: `Baki tidak mencukupi untuk kaunseling dan ketegangan dengan ${p.name} memuncak!`,
                  nextEvent: this.buildSpouseInitiatedDivorceEvent(state, p, sc.title),
                  toastType: 'error'
                };
              }
              return {
                outcome: `Baki wang tidak mencukupi untuk membayar yuran kaunseling (${Utils.formatMoney(counselCost, state.countryId)}). Konflik dibiarkan tergantung.`,
                toastType: 'error'
              };
            }
            state.money -= counselCost;
            p.trust = Utils.clamp((p.trust ?? 65) + Utils.randInt(11, 18), 0, 100);
            p.closeness = Utils.clamp((p.closeness ?? 65) + Utils.randInt(9, 15), 0, 100);
            if (state.alignment) state.alignment.stress = Utils.clamp((state.alignment.stress || 0) - 6, 0, 100);
            GameState.adjustStats({ happiness: 8 });
            return {
              outcome: `Sesi kaunseling (${Utils.formatMoney(counselCost, state.countryId)}) banyak membuka ruang kejujuran. Hubungan bersama ${p.name} pulih dengan lebih matang (Kepercayaan ${p.trust}%, Kemesraan ${p.closeness}%).`,
              toastType: 'success'
            };
          }
        },
        {
          label: '🔥 Bergaduh & Pertahankan Ego',
          hint: 'Risiko tinggi • Kepercayaan & kemesraan merosot teruk',
          journalType: 'warning',
          customAction: (state) => {
            const p = this.getActivePartner(state);
            if (!p) return { outcome: 'Pertengkaran berakhir.' };
            const trustDrop = Math.abs(sc.trustDeltaBase || 12) + Utils.randInt(4, 10);
            const closeDrop = Utils.randInt(10, 18);
            p.trust = Utils.clamp((p.trust ?? 65) - trustDrop, 0, 100);
            p.closeness = Utils.clamp((p.closeness ?? 65) - closeDrop, 0, 100);
            if (state.alignment) state.alignment.stress = Utils.clamp((state.alignment.stress || 0) + 10, 0, 100);
            GameState.adjustStats({ happiness: -12 });

            if (p.trust < 20 || p.closeness < 20) {
              return {
                outcome: `Pertengkaran hebat menghancurkan sisa kepercayaan ${p.name} (Kepercayaan ${p.trust}%, Kemesraan ${p.closeness}%)!`,
                nextEvent: this.buildSpouseInitiatedDivorceEvent(state, p, sc.title),
                toastType: 'error'
              };
            }
            return {
              outcome: `Anda dan ${p.name} bertengkar hebat tanpa mengalah. Suasana rumah menjadi dingin (Kepercayaan ${p.trust}%, Kemesraan ${p.closeness}%).`,
              toastType: 'error'
            };
          }
        },
        {
          label: isMarried ? '⚖️ Tuntut Cerai' : '💔 Tamatkan Hubungan',
          hint: isMarried ? 'Bawa kes penceraian ke mahkamah' : 'Berpisah dan bawa haluan masing-masing',
          journalType: 'warning',
          customAction: (state) => {
            const p = this.getActivePartner(state);
            if (!p) return { outcome: 'Hubungan telah berakhir.' };
            if (state.married) {
              return {
                outcome: `Anda memutuskan untuk memfailkan penceraian terhadap ${p.name}.`,
                openDivorceModal: { partnerId: p.id, initiatedBy: 'player', reason: sc.title },
                toastType: 'error'
              };
            }
            const res = Relationships.interactRelation(p.id, 'breakup');
            return { outcome: res.msg, toastType: 'error' };
          }
        }
      ]
    };
  },

  buildSpouseInitiatedDivorceEvent(s, partner, reason) {
    const isMarried = Boolean(s.married);
    const courtLabel = (window.LegalInheritanceEngine && LegalInheritanceEngine.isIslamic(s))
      ? 'Mahkamah Syariah'
      : `Mahkamah Sivil ${Utils.getCountry(s.countryId).name}`;

    if (!isMarried) {
      return {
        id: `partner_dump_${s.age}_${Date.now()}`,
        icon: '💔',
        title: `${partner.name} Memutuskan Hubungan`,
        text: `Akibat ${reason.toLowerCase()} (Kepercayaan ${partner.trust}%, Kemesraan ${partner.closeness}%), ${partner.name} menyatakan dia tidak sanggup lagi meneruskan hubungan ini.`,
        choices: [
          {
            label: 'Terima perpisahan dengan hati berat',
            journalType: 'warning',
            customAction: (state) => {
              const res = Relationships.interactRelation(partner.id, 'breakup');
              return { outcome: `${partner.name} meninggalkan anda. ${res.msg}`, toastType: 'error' };
            }
          }
        ]
      };
    }

    return {
      id: `spouse_divorce_${s.age}_${Date.now()}`,
      icon: '⚖️',
      title: `${partner.name} Memfailkan Penceraian!`,
      text: `Setelah kepercayaan dan kemesraan merosot ke tahap kritikal (Kepercayaan ${partner.trust}%, Kemesraan ${partner.closeness}%) susulan ${reason.toLowerCase()}, ${partner.name} telah memfailkan tuntutan penceraian di ${courtLabel}.`,
      choices: [
        {
          label: `⚖️ Hadir ke ${courtLabel}`,
          hint: 'Selesaikan prosiding penceraian, pembahagian harta & hak jagaan',
          journalType: 'warning',
          customAction: () => ({
            outcome: `${partner.name} memfailkan penceraian di ${courtLabel}.`,
            openDivorceModal: { partnerId: partner.id, initiatedBy: 'spouse', reason },
            toastType: 'error'
          })
        }
      ]
    };
  },

  // --------------------------------------------------------------------------
  // 2. DIALOG PASANGAN TIDAK MAHU ANAK (CHILDFREE REFUSAL)
  // --------------------------------------------------------------------------
  buildChildfreeRefusalEvent(s, partner) {
    return {
      id: `childfree_${partner.id}_${s.age}_${Date.now()}`,
      icon: '💬',
      title: 'Pasangan Tidak Mahu Mempunyai Anak',
      text: `Apabila anda menyuarakan hasrat untuk menimang cahaya mata, ${partner.name} menggeleng dengan tenang dan berterus terang:\n\n"Maaf sayang, saya sudah lama memikirkannya. Saya tidak mahu mempunyai anak — saya lebih selesa dengan kehidupan kita berdua."`,
      choices: [
        {
          label: '🤝 Hormati Keputusan Pasangan',
          hint: 'Terima pendiriannya dengan hati terbuka • Kemesraan & kepercayaan meningkat',
          customAction: (state) => {
            const p = state.relationships.find(r => r.id === partner.id);
            if (p) {
              p.closeness = Utils.clamp((p.closeness || 70) + 5, 0, 100);
              p.trust = Utils.clamp((p.trust || 70) + 7, 0, 100);
            }
            GameState.adjustStats({ happiness: -2 });
            return {
              outcome: `Anda menghormati pendirian ${partner.name} untuk tidak mempunyai anak. ${partner.name} amat menghargai sikap bertolak ansur anda.`,
              toastType: 'culture'
            };
          }
        },
        {
          label: '💛 Cuba Pujuk Dari Hati ke Hati',
          hint: 'Peluang rendah untuk melembutkan hatinya',
          customAction: (state) => {
            const p = state.relationships.find(r => r.id === partner.id);
            if (!p) return { outcome: 'Perbualan berakhir.' };
            const chance = 0.16 + ((p.closeness || 70) >= 90 ? 0.08 : 0);
            if (Utils.chance(chance)) {
              p.wantsChildren = true;
              p.closeness = Utils.clamp((p.closeness || 70) + 4, 0, 100);
              GameState.adjustStats({ happiness: 10 });
              return {
                outcome: `Selepas perbualan mendalam yang penuh kasih sayang, ${p.name} akhirnya membuka hati dan bersetuju untuk mempertimbangkan cahaya mata bersama anda!`,
                toastType: 'success'
              };
            }
            p.closeness = Utils.clamp((p.closeness || 70) - 5, 0, 100);
            p.trust = Utils.clamp((p.trust || 70) - 4, 0, 100);
            GameState.adjustStats({ happiness: -5 });
            return {
              outcome: `${p.name} tetap bertegas dengan pendiriannya dan meminta anda tidak terus mendesak soal anak.`,
              toastType: 'error'
            };
          }
        },
        {
          label: '🔥 Bergaduh Tentang Masa Depan Keluarga',
          hint: 'Menjejaskan kemesraan & kepercayaan',
          journalType: 'warning',
          customAction: (state) => {
            const p = state.relationships.find(r => r.id === partner.id);
            if (p) {
              p.closeness = Utils.clamp((p.closeness || 70) - 14, 0, 100);
              p.trust = Utils.clamp((p.trust || 70) - 12, 0, 100);
            }
            if (state.alignment) state.alignment.stress = Utils.clamp((state.alignment.stress || 0) + 10, 0, 100);
            GameState.adjustStats({ happiness: -10 });
            if (p && (p.trust < 20 || p.closeness < 20)) {
              return {
                outcome: `Pertengkaran soal zuriat meretakkan hubungan anda dengan ${p.name}!`,
                nextEvent: this.buildSpouseInitiatedDivorceEvent(state, p, 'Percanggahan prinsip mengenai anak'),
                toastType: 'error'
              };
            }
            return {
              outcome: `Berlaku pertengkaran hangat mengenai soal zuriat. Suasana rumah menjadi dingin bersama ${partner.name}.`,
              toastType: 'error'
            };
          }
        }
      ]
    };
  },

  // --------------------------------------------------------------------------
  // 3. PERISTIWA KEGUGURAN & SOKONGAN PASANGAN (MISCARRIAGE)
  // --------------------------------------------------------------------------
  buildMiscarriageEvent(s, partner, motherAge) {
    const pName = partner ? partner.name : 'pasangan anda';
    return {
      id: `miscarriage_${s.age}_${Date.now()}`,
      icon: '🕊️',
      title: 'Berita Duka: Keguguran',
      text: `Dengan berat hati, doktor mengesahkan kehamilan (usia ibu ${motherAge} tahun) tidak dapat diselamatkan akibat keguguran. Saat ini amat menyakitkan buat anda${partner ? ` dan ${pName}` : ''}.`,
      choices: [
        {
          label: partner ? `🤍 Saling Memeluk & Menenangkan ${pName}` : '🤍 Berehat & Rawat Jiwa Perlahan-lahan',
          hint: 'Menguatkan ikatan emosi dan memulihkan sedikit ketenangan',
          customAction: (state) => {
            if (partner) {
              const p = state.relationships.find(r => r.id === partner.id);
              if (p) {
                p.closeness = Utils.clamp((p.closeness || 70) + 8, 0, 100);
                p.trust = Utils.clamp((p.trust || 70) + 8, 0, 100);
              }
            }
            GameState.adjustStats({ happiness: 6, health: 3 });
            return {
              outcome: partner
                ? `Anda dan ${pName} saling memberi kekuatan di saat paling perit ini. Kasih sayang antara kalian semakin mendalam.`
                : 'Anda mengambil masa untuk berehat dan memulihkan kekuatan fizikal serta emosi.',
              toastType: 'culture'
            };
          }
        },
        {
          label: '🏥 Dapatkan Rawatan Susulan & Kaunseling',
          hint: 'Pulihkan kesihatan dan kurangkan tekanan emosi',
          customAction: (state) => {
            const fee = Utils.usdToLocal(180, state.countryId);
            if (state.money >= fee) state.money -= fee;
            if (state.alignment) state.alignment.stress = Utils.clamp((state.alignment.stress || 0) - 8, 0, 100);
            GameState.adjustStats({ health: 8, happiness: 5 });
            return {
              outcome: 'Rawatan susulan doktor dan sokongan kaunselor membantu memulihkan kesihatan serta semangat anda.',
              toastType: 'culture'
            };
          }
        },
        {
          label: '😔 Menyendiri & Menahan Kesedihan',
          hint: 'Tekanan emosi kekal tinggi buat sementara waktu',
          journalType: 'warning',
          customAction: (state) => {
            if (state.alignment) state.alignment.stress = Utils.clamp((state.alignment.stress || 0) + 8, 0, 100);
            GameState.adjustStats({ happiness: -6 });
            return {
              outcome: 'Anda memilih untuk menyendiri dan memendam duka kehilangan tersebut.',
              toastType: 'error'
            };
          }
        }
      ]
    };
  },

  // --------------------------------------------------------------------------
  // 4. DRAMA REMAJA & KENAKALAN ANAK (REBELLIOUSNESS > 65 / DELINQUENT)
  // --------------------------------------------------------------------------
  TEEN_DRAMA_SCENARIOS: [
    {
      id: 'ponteng_sekolah',
      icon: '🏫',
      title: 'Anak Ponteng Sekolah Berulang Kali',
      textFn: (c) => `Pengetua sekolah menghubungi anda — ${c.name} (${c.age} thn) didapati ponteng kelas beberapa hari berturut-turut dan melepak bersama rakan bermasalah.`
    },
    {
      id: 'buli_rakan',
      icon: '😠',
      title: 'Kes Buli di Sekolah',
      textFn: (c) => `Anda dipanggil ke pejabat disiplin kerana ${c.name} (${c.age} thn) terlibat dalam insiden membuli dan mengugut pelajar lain di sekolah.`
    },
    {
      id: 'lari_rumah',
      icon: '🚪',
      title: 'Anak Melarikan Diri Dari Rumah',
      textFn: (c) => `Bilik ${c.name} (${c.age} thn) kosong sejak semalam! Rakan sekolahnya memaklumkan ${c.name} merajuk kerana berasa terabai lalu lari dari rumah.`
    },
    {
      id: 'mencuri_kedai',
      icon: '🚨',
      title: 'Ditangkap Mencuri di Kedai',
      textFn: (c) => `Pengawal keselamatan pusat beli-belah menahan ${c.name} (${c.age} thn) kerana mencuri barangan berharga. Pemilik kedai memberi amaran keras untuk membuat laporan polis.`
    },
    {
      id: 'salah_guna_dadah',
      icon: '⚠️',
      title: 'Pengaruh Bahan Terlarang',
      textFn: (c) => `Anda menemui bahan terlarang di dalam beg sekolah ${c.name} (${c.age} thn). Rakan-rakan liarnya semakin mengheretnya ke kancah kerosakan!`
    }
  ],

  buildChildRebellionEvent(s, child) {
    const sc = Utils.pick(this.TEEN_DRAMA_SCENARIOS);
    const rehabCost = Utils.usdToLocal(350, s.countryId);

    return {
      id: `teen_${sc.id}_${child.id}_${s.age}`,
      icon: sc.icon,
      title: `Krisis Remaja: ${sc.title}`,
      text: `${sc.textFn(child)}\n\nKeadaan ${child.name}: Akhlak ${child.morals ?? 50}% • Pemberontakan ${child.rebelliousness ?? 65}%${child.isDelinquent ? ' • ⚠️ REMAJA BERMASALAH' : ''}.`,
      choices: [
        {
          label: '💬 Tegur Baik-Baik & Dengar Luahannya',
          hint: 'Percuma • Cuba dekati hati anak secara tenang',
          customAction: (state) => {
            const ch = state.relationships.find(r => r.id === child.id);
            if (!ch) return { outcome: 'Keadaan telah berlalu.' };
            ch.morals = Utils.clamp((ch.morals ?? 50) + Utils.randInt(6, 12), 0, 100);
            ch.rebelliousness = Utils.clamp((ch.rebelliousness ?? 65) - Utils.randInt(8, 15), 0, 100);
            ch.closeness = Utils.clamp((ch.closeness ?? 60) + 6, 0, 100);
            if (ch.rebelliousness < 55 && ch.morals >= 45) ch.isDelinquent = false;
            return {
              outcome: `Anda duduk berbincang secara tenang bersama ${ch.name}. Hatinya sedikit lembut dan berjanji cuba berubah (Pemberontakan ${ch.rebelliousness}%, Akhlak ${ch.morals}%).`,
              toastType: 'success'
            };
          }
        },
        {
          label: `🏥 Hantar Kaunseling / Pemulihan (${Utils.formatMoney(rehabCost, s.countryId)})`,
          hint: 'Berbayar • Kesan paling berkesan menurunkan pemberontakan',
          customAction: (state) => {
            const ch = state.relationships.find(r => r.id === child.id);
            if (!ch) return { outcome: 'Sesi dibatalkan.' };
            if (state.money < rehabCost) {
              ch.rebelliousness = Utils.clamp((ch.rebelliousness ?? 65) + 6, 0, 100);
              return {
                outcome: `Wang tidak mencukupi untuk kos kaunseling (${Utils.formatMoney(rehabCost, state.countryId)}). Sikap ${ch.name} masih sukar dikawal.`,
                toastType: 'error'
              };
            }
            state.money -= rehabCost;
            ch.morals = Utils.clamp((ch.morals ?? 50) + Utils.randInt(14, 22), 0, 100);
            ch.rebelliousness = Utils.clamp((ch.rebelliousness ?? 65) - Utils.randInt(20, 30), 0, 100);
            ch.educationCare = Utils.clamp((ch.educationCare ?? 50) + 10, 0, 100);
            if (ch.rebelliousness <= 60 && ch.morals >= 40) ch.isDelinquent = false;
            GameState.adjustStats({ happiness: 4 });
            return {
              outcome: `Program kaunseling & pemulihan (${Utils.formatMoney(rehabCost, state.countryId)}) banyak mengubah sikap ${ch.name} ke arah lebih positif (Pemberontakan ${ch.rebelliousness}%, Akhlak ${ch.morals}%).`,
              toastType: 'success'
            };
          }
        },
        {
          label: '⚡ Rotan / Marah Dengan Tegas',
          hint: 'Risiko hubungan renggang — kadang berkesan, kadang makin memberontak',
          journalType: 'warning',
          customAction: (state) => {
            const ch = state.relationships.find(r => r.id === child.id);
            if (!ch) return { outcome: 'Pertengkaran tamat.' };
            ch.closeness = Utils.clamp((ch.closeness ?? 60) - Utils.randInt(12, 20), 0, 100);
            if (Utils.chance(0.42)) {
              ch.rebelliousness = Utils.clamp((ch.rebelliousness ?? 65) - 10, 0, 100);
              return {
                outcome: `${ch.name} berasa takut dan mengurangkan kelakuan liar buat sementara, namun hubungannya dengan anda menjadi renggang.`,
                toastType: 'culture'
              };
            }
            ch.rebelliousness = Utils.clamp((ch.rebelliousness ?? 65) + 14, 0, 100);
            ch.morals = Utils.clamp((ch.morals ?? 50) - 6, 0, 100);
            if (ch.rebelliousness > 80 || ch.morals < 25) ch.isDelinquent = true;
            return {
              outcome: `Tindakan keras anda membuatkan ${ch.name} menyimpan dendam dan semakin memberontak (Pemberontakan ${ch.rebelliousness}%)!`,
              toastType: 'error'
            };
          }
        },
        {
          label: '🙈 Biarkan Sahaja (Tidak Ambil Peduli)',
          hint: 'Amaran • Anak berisiko tinggi menjadi remaja delinkuen / penjenayah',
          journalType: 'warning',
          customAction: (state) => {
            const ch = state.relationships.find(r => r.id === child.id);
            if (!ch) return { outcome: 'Anda mengabaikannya.' };
            ch.rebelliousness = Utils.clamp((ch.rebelliousness ?? 65) + Utils.randInt(15, 22), 0, 100);
            ch.morals = Utils.clamp((ch.morals ?? 50) - Utils.randInt(12, 18), 0, 100);
            ch.closeness = Utils.clamp((ch.closeness ?? 60) - 10, 0, 100);
            ch.isDelinquent = true;
            if (window.Dynasty) Dynasty.adjustReputation(-5);
            return {
              outcome: `Akibat dibiarkan tanpa bimbingan, ${ch.name} kini terjerumus sebagai remaja bermasalah (Delinkuen) dan semakin sukar dikawal!`,
              toastType: 'error'
            };
          }
        }
      ]
    };
  },

  // --------------------------------------------------------------------------
  // 5. MODAL BERITA DUKA / KEMATIAN ORANG TERDEKAT (KELUARGA TERDEKAT SAHAJA)
  // --------------------------------------------------------------------------
  CLOSE_FAMILY_ROLES: [
    'Suami', 'Isteri', 'Ibu', 'Ayah', 'Bapa',
    'Anak Lelaki', 'Anak Perempuan', 'Son', 'Daughter',
    'Abang', 'Kakak', 'Adik/Abang', 'Adik/Kakak'
  ],

  isCloseFamilyMember(s, npc) {
    if (!npc) return false;
    if (npc._wasSpouse) return true;
    if (s && s.married && s.partnerId === npc.id) return true;
    if (npc.category === 'spouse' || npc.category === 'family') {
      return this.CLOSE_FAMILY_ROLES.includes(npc.role);
    }
    return this.CLOSE_FAMILY_ROLES.includes(npc.role);
  },

  buildNpcDeathEvent(s, npc, cause) {
    // Hanya ahli keluarga terdekat (pasangan, anak, ibu bapa, adik-beradik) membuka modal pengurusan pengebumian penuh
    if (!this.isCloseFamilyMember(s, npc)) return null;

    const funeralCost = Utils.usdToLocal(650, s.countryId);
    const wasSpouse = Boolean(npc._wasSpouse);
    const statusNote = wasSpouse
      ? `\n\nStatus anda kini bertukar kepada ${s.gender === 'male' ? 'Duda' : 'Balu'}.`
      : '';

    return {
      id: `npc_death_${npc.id}_${s.age}_${Date.now()}`,
      icon: '🕊️',
      title: 'Berita Duka / Kematian',
      text: `Innalillahi wa inna ilaihi raji'un / Salam takziah. ${npc.role} anda, ${npc.name} (Umur ${npc.age} tahun), telah menghembuskan nafas terakhir akibat ${cause}.${statusNote}`,
      choices: [
        {
          label: `🕯️ Uruskan Pengebumian Sempurna (${Utils.formatMoney(funeralCost, s.countryId)})`,
          hint: 'Berbayar • Penghormatan terakhir terbaik (+Karma & +Reputasi Keluarga)',
          customAction: (state) => {
            if (state.money >= funeralCost) {
              state.money -= funeralCost;
            }
            if (state.alignment) state.alignment.karma = Utils.clamp((state.alignment.karma || 0) + 12, -100, 100);
            if (window.Dynasty) Dynasty.adjustReputation(6);
            GameState.adjustStats({ happiness: 5 });
            return {
              outcome: `Anda menguruskan majlis pengebumian ${npc.name} dengan penuh tertib dan penghormatan terakhir. Ramai kenalan hadir mengucapkan takziah.`,
              toastType: 'culture'
            };
          }
        },
        {
          label: '🤲 Majlis Ringkas & Doa Keluarga',
          hint: 'Sederhana • Mengenang pemergian bersama ahli keluarga terdekat',
          customAction: (state) => {
            if (state.alignment) state.alignment.karma = Utils.clamp((state.alignment.karma || 0) + 4, -100, 100);
            GameState.adjustStats({ happiness: 2 });
            return {
              outcome: `Majlis pengebumian ringkas dan bacaan doa diadakan untuk mengenang pemergian ${npc.name}.`,
              toastType: 'culture'
            };
          }
        },
        {
          label: '💔 Terlalu Sedih / Berkabung Sendirian',
          hint: 'Emosi amat terkesan oleh kehilangan ini',
          journalType: 'warning',
          customAction: (state) => {
            if (state.alignment) state.alignment.stress = Utils.clamp((state.alignment.stress || 0) + 12, 0, 100);
            GameState.adjustStats({ happiness: -8 });
            return {
              outcome: `Pemergian ${npc.name} meninggalkan luka yang amat dalam. Anda berkabung sendirian buat sekian lama.`,
              toastType: 'error'
            };
          }
        }
      ]
    };
  },

  // --------------------------------------------------------------------------
  // 6. KONFLIK HARTA KELUARGA & WARIS DINAFIKAN HAK (HIBAH TINGGI / WASIAT)
  // --------------------------------------------------------------------------
  buildHeirBacklashEvent(s, backlash) {
    if (!backlash || backlash.severity === 'none') return null;
    const heirs = backlash.disadvantagedHeirs || [];
    const heirNames = heirs.map(h => `${h.name} (${h.role})`).join(', ');
    const isSevere = backlash.severity === 'severe';

    if (isSevere) {
      return {
        id: `heir_backlash_severe_${s.age}_${Date.now()}`,
        icon: '💔',
        title: 'Waris Dinafikan Hak / Hubungan Retak',
        text: `Keluarga anda gempar apabila mengetahui keputusan anda memperuntukkan ${backlash.hibahPct}% harta kepada ${backlash.recipientLabel}, meninggalkan hampir tiada hak (${backlash.faraidLeft}%) untuk waris sah: ${heirNames}.\n\nMereka berasa amat dikhianati, menuntut penjelasan, dan ramai yang mula memutuskan hubungan dengan anda!`,
        choices: [
          {
            label: '🪨 Pertahankan Keputusan Muktamad',
            hint: 'Waris kekal terputus hubungan (Estranged) • Reputasi Keluarga merosot',
            journalType: 'warning',
            customAction: (state) => {
              for (const h of heirs) {
                const rel = state.relationships.find(r => r.id === h.id);
                if (rel) {
                  rel.closeness = 0;
                  rel.trust = 0;
                  rel.isEstranged = true;
                }
              }
              if (window.Dynasty) Dynasty.adjustReputation(-8);
              return {
                outcome: `Anda bertegas mempertahankan keputusan tersebut. ${heirNames} memutuskan hubungan sepenuhnya dengan anda.`,
                toastType: 'error'
              };
            }
          },
          {
            label: '🙏 Jelaskan Niat Baik & Minta Maaf',
            hint: 'Cuba redakan kemarahan — kesan terhad jika waris sudah terlalu kecewa',
            customAction: (state) => {
              const karma = (state.alignment && state.alignment.karma) || 0;
              const heal = karma >= 25 ? 12 : 5;
              for (const h of heirs) {
                const rel = state.relationships.find(r => r.id === h.id);
                if (rel) {
                  rel.closeness = Utils.clamp((rel.closeness || 0) + heal, 0, 100);
                  rel.trust = Utils.clamp((rel.trust || 0) + Math.round(heal / 2), 0, 100);
                }
              }
              return {
                outcome: `Anda cuba menjelaskan niat anda, namun luka di hati ${heirNames} terlalu dalam selagi pembahagian harta tidak diubah.`,
                toastType: 'error'
              };
            }
          },
          {
            label: '📜 Ubah Semula Pembahagian Harta',
            hint: 'Tetapkan semula kepada pembahagian lebih adil & pulihkan sebahagian hubungan',
            customAction: (state) => {
              if (backlash.isCivil) {
                state.wasiat.civilMode = 'equal';
                state.wasiat.civilTargetHeirId = null;
              } else {
                state.wasiat.hibahPct = 20;
                if (state.wasiat.hibahRecipientType === 'adopted') state.wasiat.hibahAdoptedPct = 20;
              }
              for (const h of heirs) {
                const rel = state.relationships.find(r => r.id === h.id);
                if (rel) {
                  rel.closeness = Utils.clamp((rel.closeness || 0) + 35, 0, 100);
                  rel.trust = Utils.clamp((rel.trust || 0) + 25, 0, 100);
                  rel.isEstranged = false;
                }
              }
              return {
                outcome: `Anda membatalkan pembahagian ekstrem tersebut dan mengembalikan hak yang lebih adil kepada waris. Hubungan bersama ${heirNames} mula pulih perlahan-lahan.`,
                toastType: 'success'
              };
            }
          }
        ]
      };
    }

    return {
      id: `heir_backlash_high_${s.age}_${Date.now()}`,
      icon: '🔥',
      title: 'Konflik Harta Keluarga',
      text: `Waris sah anda (${heirNames}) bersemuka dengan anda secara tegang selepas mengetahui ${backlash.hibahPct}% harta diperuntukkan sebagai Hibah kepada ${backlash.recipientLabel} (baki Faraid tinggal ${backlash.faraidLeft}%).`,
      choices: [
        {
          label: '🪨 Pertahankan Keputusan',
          hint: 'Hubungan & kepercayaan waris merosot lagi',
          journalType: 'warning',
          customAction: (state) => {
            for (const h of heirs) {
              const rel = state.relationships.find(r => r.id === h.id);
              if (rel) {
                rel.closeness = Utils.clamp((rel.closeness ?? 40) - 14, 0, 100);
                rel.trust = Utils.clamp((rel.trust ?? 40) - 12, 0, 100);
              }
            }
            return {
              outcome: `Anda bertegas itu hak mutlak anda semasa hidup. ${heirNames} pulang dengan rasa tidak puas hati yang mendalam.`,
              toastType: 'error'
            };
          }
        },
        {
          label: '💬 Jelaskan Niat Baik Secara Tenang',
          hint: 'Mengurangkan ketegangan jika Karma atau hubungan keluarga kukuh',
          customAction: (state) => {
            const karma = (state.alignment && state.alignment.karma) || 0;
            const boost = karma >= 20 ? 12 : 6;
            for (const h of heirs) {
              const rel = state.relationships.find(r => r.id === h.id);
              if (rel) {
                rel.closeness = Utils.clamp((rel.closeness ?? 40) + boost, 0, 100);
                rel.trust = Utils.clamp((rel.trust ?? 40) + Math.round(boost * 0.7), 0, 100);
              }
            }
            return {
              outcome: `Penjelasan jujur anda sedikit melembutkan hati ${heirNames}, walaupun mereka masih berharap pembahagian harta lebih seimbang.`,
              toastType: 'culture'
            };
          }
        },
        {
          label: '📜 Ubah Semula Pembahagian (Turunkan ke 20%)',
          hint: 'Redakan konflik keluarga dengan pembahagian lebih seimbang',
          customAction: (state) => {
            state.wasiat.hibahPct = 20;
            if (state.wasiat.hibahRecipientType === 'adopted') state.wasiat.hibahAdoptedPct = 20;
            for (const h of heirs) {
              const rel = state.relationships.find(r => r.id === h.id);
              if (rel) {
                rel.closeness = Utils.clamp((rel.closeness ?? 40) + 22, 0, 100);
                rel.trust = Utils.clamp((rel.trust ?? 40) + 15, 0, 100);
              }
            }
            return {
              outcome: `Anda melaraskan semula Hibah kepada 20% demi menjaga silaturahim keluarga. ${heirNames} berasa lega dan hubungan kembali tenang.`,
              toastType: 'success'
            };
          }
        }
      ]
    };
  }
};

