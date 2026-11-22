/* ==========================================================================
   WorldLife — Peristiwa Hidup, Dilema Moral & Peristiwa Luar Jangka
   Bahasa Melayu
   ========================================================================== */

window.LIFE_EVENTS = {
  moralDilemmas: [
    {
      id: 'dil_promo_vs_family',
      minAge: 24, maxAge: 56,
      condition: (s) => Boolean(s.job) && (Boolean(s.partnerId) || s.relationships.some(r => r.alive && ['Anak Lelaki', 'Anak Perempuan', 'Ibu', 'Ayah'].includes(r.role))),
      icon: '⚖️',
      title: 'Dilema: Naik Pangkat atau Keluarga?',
      text: 'Pihak pengurusan menawarkan kenaikan pangkat dengan lonjakan gaji 22%, tetapi jawatan itu menuntut anda bekerja 70 jam seminggu termasuk hujung minggu. Orang tersayang anda sudah mula merungut anda jarang ada di rumah.',
      choices: [
        {
          label: 'Terima jawatan & kejar kerjaya dahulu',
          hint: 'Gaji +22%, Kesihatan --, Hubungan --',
          journalType: 'dilemma',
          setFlag: 'neglected_family',
          customAction: (s) => {
            s.job.salary = Math.round(s.job.salary * 1.22);
            s.job.performance = Utils.clamp(s.job.performance + 10);
            s.relationships.filter(r => r.alive).forEach(r => {
              r.closeness = Utils.clamp(r.closeness - Utils.randInt(12, 20), 5, 100);
            });
            GameState.adjustStats({ health: -10, happiness: -4 });
            return {
              outcome: `Gaji anda melonjak kepada ${Utils.formatMoney(s.job.salary, s.countryId)}/thn, namun meja makan di rumah semakin sunyi dan badan anda kian lesu.`
            };
          }
        },
        {
          label: 'Tolak kenaikan pangkat demi masa bersama keluarga',
          hint: 'Hubungan +, Gembira +, Prestasi kerja --',
          journalType: 'dilemma',
          customAction: (s) => {
            s.job.performance = Utils.clamp(s.job.performance - 16, 15, 100);
            s.relationships.filter(r => r.alive).forEach(r => {
              r.closeness = Utils.clamp(r.closeness + Utils.randInt(8, 14));
            });
            GameState.adjustStats({ happiness: 8, health: 4 });
            return {
              outcome: 'Keluarga anda terharu dengan pengorbanan anda, tetapi bos jelas kecewa dan menyerahkan projek utama kepada rakan sekerja lain.'
            };
          }
        }
      ]
    },
    {
      id: 'dil_friend_loan',
      minAge: 21, maxAge: 62,
      icon: '💸',
      title: 'Dilema: Sahabat Karib Terjerat Hutang',
      text: 'Sahabat baik anda sejak kecil datang dengan mata berkaca — bisnesnya hampir muflis dan dia merayu anda meminjamkan wang simpanan atau menjadi penjamin pinjaman tidak berlesen dengan kadar faedah tinggi.',
      choices: [
        {
          label: 'Beri pinjaman daripada duit sendiri (risiko hangus)',
          hint: 'Wang --, Gembira +, integriti tinggi',
          journalType: 'dilemma',
          customAction: (s) => {
            const amt = Math.max(Utils.usdToLocal(1800, s.countryId), Math.round(Math.max(0, s.money) * 0.25));
            s.money -= amt;
            GameState.adjustStats({ happiness: 4, smarts: -2 });
            return {
              outcome: `Anda menghulurkan ${Utils.formatMoney(amt, s.countryId)} untuk menyelamatkan sahabat anda. Akaun bank anda menyusut teruk dan belum pasti bila dia mampu membayarnya semula.`
            };
          }
        },
        {
          label: 'Jadi penjamin pinjaman luar / along untuk bantu cepat',
          hint: 'Tiada keluar tunai sekarang, BAHAYA masa depan',
          journalType: 'warning',
          setFlag: 'took_shady_loan',
          customAction: (s) => {
            GameState.adjustStats({ happiness: 2, health: -4 });
            return {
              outcome: 'Anda menurunkan tandatangan sebagai penjamin pinjaman tidak berlesen itu. Sahabat anda lega buat sementara, tetapi firasat buruk menghantui anda.'
            };
          }
        },
        {
          label: 'Tolak permintaan & jaga kewangan sendiri',
          hint: 'Wang selamat, rasa bersalah & hilang sahabat',
          journalType: 'dilemma',
          setFlag: 'betrayed_friend',
          customAction: (s) => {
            GameState.adjustStats({ happiness: -10, smarts: 4 });
            return {
              outcome: 'Anda menolak dengan berat hati. Sahabat anda beredar dengan wajah kecewa dan terus memutuskan hubungan dengan anda.'
            };
          }
        }
      ]
    },
    {
      id: 'dil_bribe_contract',
      minAge: 23, maxAge: 60,
      condition: (s) => Boolean(s.job),
      icon: '💼',
      title: 'Dilema: Duit Bawah Meja',
      text: 'Seorang pembekal menghulurkan sampul tebal secara rahsia dan berjanji memasukkan komisen besar jika anda meluluskan tender syarikatnya yang tidak mematuhi piawaian keselamatan.',
      choices: [
        {
          label: 'Terima wang rasuah secara senyap',
          hint: 'Tunai +++, risiko besar pada masa depan',
          journalType: 'warning',
          setFlag: 'took_bribe',
          customAction: (s) => {
            const cash = Utils.usdToLocal(Utils.randInt(5500, 12000), s.countryId);
            s.money += cash;
            GameState.adjustStats({ happiness: -3, smarts: 2 });
            return {
              outcome: `Anda menerima ${Utils.formatMoney(cash, s.countryId)} secara rahsia. Baki akaun anda melambung, tetapi setiap bunyi telefon kini membuatkan jantung anda berdegup kencang.`
            };
          }
        },
        {
          label: 'Tolak tegas & laporkan kepada pihak atasan',
          hint: 'Integriti tinggi, risiko dipulaukan di pejabat',
          journalType: 'dilemma',
          customAction: (s) => {
            s.job.performance = Utils.clamp(s.job.performance - 10, 15, 100);
            GameState.adjustStats({ happiness: 6, health: -4, smarts: 4 });
            return {
              outcome: 'Anda mengekalkan integriti dan melaporkan cubaan rasuah itu. Namun beberapa pihak berkepentingan di pejabat mula memulaukan anda.'
            };
          }
        }
      ]
    },
    {
      id: 'dil_cheating_temptation',
      minAge: 20, maxAge: 58,
      condition: (s) => Boolean(s.partnerId),
      icon: '🔥',
      title: 'Dilema: Godaan Terlarang',
      text: 'Semasa seminar kerja di luar bandar, seorang kenalan baru yang menawan meluahkan perasaan dan mengajak anda menghabiskan malam bersama — jauh daripada pengetahuan pasangan anda.',
      choices: [
        {
          label: 'Tewas kepada godaan & rahsiakan daripada pasangan',
          hint: 'Gembira sementara, bom jangka hubungan',
          journalType: 'warning',
          setFlag: 'cheated_partner',
          customAction: (s) => {
            const partner = s.relationships.find(r => r.id === s.partnerId);
            if (partner) partner.closeness = Utils.clamp(partner.closeness - 10, 5, 100);
            GameState.adjustStats({ happiness: 4, looks: 2 });
            return {
              outcome: 'Anda merahsiakan malam itu dan pulang seperti biasa. Namun rasa bersalah mula menjarakkan hati anda daripada pasangan.'
            };
          }
        },
        {
          label: 'Tolak dengan tegas & hubungi pasangan anda malam itu juga',
          hint: 'Hubungan kukuh, ego teruji',
          journalType: 'romance',
          customAction: (s) => {
            const partner = s.relationships.find(r => r.id === s.partnerId);
            if (partner) partner.closeness = Utils.clamp(partner.closeness + 10);
            GameState.adjustStats({ happiness: 5, smarts: 3 });
            return {
              outcome: 'Anda memilih kesetiaan. Malam itu anda berbual panjang dengan pasangan dan sedar betapa berharganya kepercayaan dalam hubungan.'
            };
          }
        }
      ]
    },
    {
      id: 'dil_burnout_hustle',
      minAge: 22, maxAge: 55,
      condition: (s) => Boolean(s.job),
      icon: '🩺',
      title: 'Dilema: Badan Sudah Memberi Amaran',
      text: 'Anda sering sakit dada dan kurang tidur sejak berbulan-bulan lalu, tetapi projek besar di tempat kerja bakal menentukan bonus tahunan yang lumayan.',
      choices: [
        {
          label: 'Paksa diri teruskan kerja demi bonus besar',
          hint: 'Tunai ++, Kesihatan ---, kesan jangka panjang',
          journalType: 'warning',
          setFlag: 'neglected_health',
          customAction: (s) => {
            const bonus = Utils.usdToLocal(Utils.randInt(2800, 6000), s.countryId);
            s.money += bonus;
            s.job.performance = Utils.clamp(s.job.performance + 12);
            GameState.adjustStats({ health: -16, happiness: -6 });
            return {
              outcome: `Anda berjaya meraih bonus ${Utils.formatMoney(bonus, s.countryId)}, tetapi badan anda jelas terjejas teruk akibat tekanan melampau.`
            };
          }
        },
        {
          label: 'Ambil cuti tanpa gaji & jalani rawatan pemulihan',
          hint: 'Kesihatan ++, Tunai --, Prestasi kerja -',
          journalType: 'dilemma',
          customAction: (s) => {
            const loss = Utils.usdToLocal(1200, s.countryId);
            s.money -= loss;
            s.job.performance = Utils.clamp(s.job.performance - 10, 15, 100);
            GameState.adjustStats({ health: 14, happiness: 5 });
            return {
              outcome: `Anda mengorbankan ${Utils.formatMoney(loss, s.countryId)} dan peluang bonus demi menyelamatkan kesihatan sendiri. Doktor memuji keputusan tepat anda.`
            };
          }
        }
      ]
    },
    {
      id: 'dil_shady_scheme',
      minAge: 20, maxAge: 62,
      icon: '💎',
      title: 'Dilema: Skim Pelaburan "Pasti Untung"',
      text: 'Kenalan lama mempromosikan skim pelaburan kripto/forex yang menjanjikan pulangan 40% sebulan — malah anda akan dapat komisen besar jika mengajak rakan-rakan lain menyertainya.',
      choices: [
        {
          label: 'Sertai & ajak orang sekeliling demi komisen pantas',
          hint: 'Tunai ++ segera, risiko skandal & kes undang-undang',
          journalType: 'warning',
          setFlag: 'joined_scam_scheme',
          customAction: (s) => {
            const gain = Utils.usdToLocal(Utils.randInt(3200, 7500), s.countryId);
            s.money += gain;
            GameState.adjustStats({ happiness: 3, smarts: -4 });
            return {
              outcome: `Anda meraih komisen awal ${Utils.formatMoney(gain, s.countryId)}, tetapi jauh di sudut hati anda tahu skim ini terlalu indah untuk jadi kenyataan.`
            };
          }
        },
        {
          label: 'Tolak & beri amaran kepada rakan-rakan',
          hint: 'Selamat & beretika, bermasam muka dengan kenalan',
          journalType: 'dilemma',
          customAction: (s) => {
            GameState.adjustStats({ smarts: 6, happiness: -3 });
            return {
              outcome: 'Kenalan lama anda menuduh anda dengki dan menyekat nombor anda, tetapi anda berjaya menyelamatkan beberapa rakan daripada tertipu.'
            };
          }
        }
      ]
    }
  ],

  // --------------------------------------------------------------------------
  // 4. KEJUTAN TAK TERDUGA / KONFLIK / "BLACK SWAN" (Seimbang Tinggi & Rendah)
  // --------------------------------------------------------------------------
  blackSwans: [
    {
      id: 'bs_recession_layoff',
      minAge: 22, maxAge: 60,
      weight: 14,
      condition: (s) => Boolean(s.job),
      icon: '📉',
      title: 'Kejutan: Kemelesetan Ekonomi Mengejut!',
      text: 'Krisis ekonomi global melanda tanpa amaran! Syarikat anda mengumumkan penstrukturan semula besar-besaran hari ini.',
      choices: [
        {
          label: 'Terima pampasan kecil & diberhentikan kerja',
          hint: 'Hilang kerja, dapat pampasan kecil',
          journalType: 'warning',
          customAction: (s) => {
            const sev = Math.round(s.job.salary * 0.25);
            const oldTitle = s.job.title;
            s.money += sev;
            s.job = null;
            GameState.adjustStats({ happiness: -16, health: -5 });
            if (s.money < 0) GameState.recordCrisis('bankruptcy');
            return {
              outcome: `Anda kehilangan jawatan sebagai ${oldTitle} dan hanya menerima pampasan ${Utils.formatMoney(sev, s.countryId)}. Masa untuk bangkit mencari peluang baru.`
            };
          }
        },
        {
          label: 'Setuju pemotongan gaji 30% demi kekal bekerja',
          hint: 'Kerja selamat, gaji turun 30%, stres +',
          journalType: 'warning',
          customAction: (s) => {
            s.job.salary = Math.round(s.job.salary * 0.70);
            GameState.adjustStats({ happiness: -10, health: -6 });
            return {
              outcome: `Anda kekal bekerja, tetapi gaji dipotong kepada ${Utils.formatMoney(s.job.salary, s.countryId)}/thn sementara beban kerja bertambah dua kali ganda.`
            };
          }
        }
      ]
    },
    {
      id: 'bs_partner_betrayal',
      minAge: 20, maxAge: 65,
      weight: 12,
      condition: (s) => Boolean(s.partnerId),
      icon: '💔',
      title: 'Kejutan: Pengkhianatan Terbongkar!',
      text: 'Secara tidak sengaja anda terbaca mesej rahsia di telefon pasangan anda. Rupa-rupanya dia telah bermain kayu tiga di belakang anda sejak beberapa bulan lalu!',
      choices: [
        {
          label: 'Bersemuka & putuskan hubungan serta-merta',
          hint: 'Hati remuk, bebas daripada hubungan toksik',
          journalType: 'warning',
          customAction: (s) => {
            const partner = s.relationships.find(r => r.id === s.partnerId);
            const pName = partner ? partner.name : 'pasangan anda';
            if (partner) {
              partner.role = 'Bekas Pasangan';
              partner.closeness = 5;
            }
            const wasMarried = s.married;
            s.partnerId = null;
            s.married = false;
            if (wasMarried && s.money > 0) {
              const split = Math.round(s.money * 0.22);
              s.money -= split;
            }
            GameState.adjustStats({ happiness: -22, health: -5 });
            GameState.recordCrisis('heartbreak');
            return {
              outcome: `Hati anda hancur berkecai. Anda mengakhiri hubungan dengan ${pName}${wasMarried ? ' dan menanggung kos penceraian yang perit' : ''}.`
            };
          }
        },
        {
          label: 'Beri peluang kedua & pergi sesi kaunseling',
          hint: 'Kos kaunseling, kepercayaan rapuh',
          journalType: 'dilemma',
          customAction: (s) => {
            const partner = s.relationships.find(r => r.id === s.partnerId);
            if (partner) partner.closeness = Utils.clamp(partner.closeness - 28, 15, 100);
            const cost = Utils.usdToLocal(450, s.countryId);
            s.money -= cost;
            GameState.adjustStats({ happiness: -12, health: -3 });
            GameState.recordCrisis('heartbreak');
            return {
              outcome: `Anda cuba memaafkan demi hubungan ini (${Utils.formatMoney(cost, s.countryId)} untuk kaunseling), namun parut curiga masih belum pulih sepenuhnya.`
            };
          }
        }
      ]
    },
    {
      id: 'bs_business_scam',
      minAge: 23, maxAge: 70,
      weight: 11,
      condition: (s) => s.money > Utils.usdToLocal(1500, s.countryId) || (s.investments || 0) > 0,
      icon: '🕵️',
      title: 'Kejutan: Ditipu Rakan Kongsi & Penipuan Kewangan!',
      text: 'Anda menerima notifikasi bank yang mengejutkan — rakan perniagaan / ejen pelaburan yang anda percayai telah lesap melarikan sebahagian wang anda!',
      choices: [
        {
          label: 'Buat laporan polis & upah peguam (kos guaman tinggi)',
          hint: 'Peluang dapat balik separuh, stres ++',
          journalType: 'warning',
          customAction: (s) => {
            const loss = Math.max(Utils.usdToLocal(1500, s.countryId), Math.round(Math.max(0, s.money) * 0.22));
            const recovered = Utils.chance(0.45) ? Math.round(loss * 0.5) : 0;
            s.money -= (loss - recovered);
            GameState.adjustStats({ happiness: -14, smarts: 4 });
            if (s.money < 0) GameState.recordCrisis('bankruptcy');
            return {
              outcome: recovered > 0
                ? `Selepas perjuangan undang-undang yang memenatkan, anda berjaya mendapatkan semula ${Utils.formatMoney(recovered, s.countryId)}, tetapi masih rugi ${Utils.formatMoney(loss - recovered, s.countryId)}.`
                : `Malangnya penipu itu melarikan diri ke luar negara. Anda kerugian bersih ${Utils.formatMoney(loss, s.countryId)}.`
            };
          }
        },
        {
          label: 'Reda, telan kerugian & jadikan pengajaran',
          hint: 'Wang susut, elak tekanan mahkamah',
          journalType: 'warning',
          customAction: (s) => {
            const loss = Math.max(Utils.usdToLocal(1200, s.countryId), Math.round(Math.max(0, s.money) * 0.28));
            s.money -= loss;
            GameState.adjustStats({ happiness: -15, smarts: 5 });
            if (s.money < 0) GameState.recordCrisis('bankruptcy');
            return {
              outcome: `Anda kehilangan ${Utils.formatMoney(loss, s.countryId)} dalam sekelip mata. Pengajaran pahit ini membuatkan anda jauh lebih berhati-hati selepas ini.`
            };
          }
        }
      ]
    },
    {
      id: 'bs_health_scare',
      minAge: 25, maxAge: 82,
      weight: 12,
      icon: '🚑',
      title: 'Kejutan: Diagnosis Kesihatan Mengejut!',
      text: 'Anda tiba-tiba rebah dan dikejarkan ke hospital! Doktor memaklumkan terdapat masalah kesihatan serius yang memerlukan rawatan segera atau perubahan gaya hidup drastik.',
      choices: [
        {
          label: 'Jalani rawatan pakar intensif & rehat secukupnya',
          hint: 'Kos perubatan tinggi, kesihatan stabil semula',
          journalType: 'warning',
          customAction: (s) => {
            const c = Utils.getCountry(s.countryId);
            const bill = Math.max(c.healthcare.privateCost * 4, Utils.usdToLocal(1800, s.countryId));
            s.money -= bill;
            GameState.adjustStats({ health: -6, happiness: -8 });
            GameState.recordCrisis('illness');
            return {
              outcome: `Rawatan pakar menelan kos ${Utils.formatMoney(bill, s.countryId)}, tetapi nyawa anda terselamat dan keadaan kembali terkawal.`
            };
          }
        },
        {
          label: 'Pilih rawatan minimum & teruskan rutin biasa',
          hint: 'Jimat wang, Kesihatan ---, risiko susulan',
          journalType: 'warning',
          setFlag: 'neglected_health',
          customAction: (s) => {
            GameState.adjustStats({ health: -22, happiness: -10 });
            GameState.recordCrisis('illness');
            return {
              outcome: 'Anda memilih untuk berjimat dan keluar wad awal. Kesihatan anda merosot ketara dan doktor memberi amaran ia boleh berulang.'
            };
          }
        }
      ]
    },
    {
      id: 'bs_inheritance_drama',
      minAge: 28, maxAge: 75,
      weight: 10,
      icon: '📜',
      title: 'Konflik: Perebutan Harta Pusaka Keluarga',
      text: 'Seorang saudara jauh yang berada meninggal dunia dan meninggalkan wasiat yang kabur. Beberapa ahli keluarga mula bertelagah menuntut bahagian masing-masing!',
      choices: [
        {
          label: 'Tuntut hak anda di mahkamah',
          hint: 'Tunai ++, hubungan keluarga retak',
          journalType: 'dilemma',
          customAction: (s) => {
            const share = Utils.usdToLocal(Utils.randInt(6000, 18000), s.countryId);
            s.money += share;
            s.relationships.filter(r => r.alive && !['Isteri', 'Suami', 'Teman Wanita', 'Teman Lelaki'].includes(r.role)).forEach(r => {
              r.closeness = Utils.clamp(r.closeness - Utils.randInt(10, 18), 5, 100);
            });
            GameState.adjustStats({ happiness: -6 });
            return {
              outcome: `Anda memenangi bahagian pusaka bernilai ${Utils.formatMoney(share, s.countryId)}, tetapi suasana kenduri keluarga tidak lagi semesra dahulu.`
            };
          }
        },
        {
          label: 'Lepaskan tuntutan demi keamanan keluarga',
          hint: 'Tiada wang, hubungan erat & hati tenang',
          journalType: 'dilemma',
          customAction: (s) => {
            s.relationships.filter(r => r.alive).forEach(r => {
              r.closeness = Utils.clamp(r.closeness + 10);
            });
            GameState.adjustStats({ happiness: 8 });
            return {
              outcome: 'Anda mengalah demi menjaga silaturahim. Ramai ahli keluarga menghormati sikap matang anda, walaupun poket anda tidak bertambah.'
            };
          }
        }
      ]
    },
    {
      id: 'bs_lucky_windfall',
      minAge: 19, maxAge: 80,
      weight: 9,
      icon: '🌠',
      title: 'Tuah Luar Jangkaan: Durian Runtuh!',
      text: 'Rezeki tidak disangka! Aset lama / projek sampingan / cabutan bertuah yang anda sertai dahulu tiba-tiba membuahkan pulangan luar biasa besar!',
      choices: [
        {
          label: 'Laburkan majoriti wang ini untuk masa depan',
          hint: 'Pelaburan +++, Pintar +',
          journalType: 'milestone',
          customAction: (s) => {
            const windfall = Utils.usdToLocal(Utils.randInt(9000, 26000), s.countryId);
            s.investments = (s.investments || 0) + Math.round(windfall * 0.8);
            s.money += Math.round(windfall * 0.2);
            GameState.adjustStats({ happiness: 14, smarts: 4 });
            return {
              outcome: `Durian runtuh bernilai ${Utils.formatMoney(windfall, s.countryId)}! Anda mengukuhkan portfolio pelaburan untuk jaminan hari tua.`
            };
          }
        },
        {
          label: 'Kongsi rezeki dengan keluarga & badan amal',
          hint: 'Tunai ++, Hubungan ++, Gembira +++',
          journalType: 'milestone',
          customAction: (s) => {
            const windfall = Utils.usdToLocal(Utils.randInt(9000, 26000), s.countryId);
            const keep = Math.round(windfall * 0.65);
            s.money += keep;
            s.relationships.filter(r => r.alive).forEach(r => {
              r.closeness = Utils.clamp(r.closeness + 12);
            });
            GameState.adjustStats({ happiness: 20 });
            return {
              outcome: `Anda menyimpan ${Utils.formatMoney(keep, s.countryId)} dan mengagihkan selebihnya kepada keluarga serta kebajikan. Hati terasa sungguh lapang!`
            };
          }
        }
      ]
    },
    {
      id: 'bs_golden_mentor',
      minAge: 21, maxAge: 52,
      weight: 9,
      icon: '🚀',
      title: 'Peluang Emas: Tawaran Mentor Industri',
      text: 'Seorang tokoh industri yang kagum dengan potensi anda menawarkan bimbingan eksklusif dan projek berimpak tinggi — namun ia memerlukan komitmen penuh sepanjang tahun.',
      choices: [
        {
          label: 'Sambar peluang ini walaupun jadual padat',
          hint: 'Pintar ++, Tunai ++, Kesihatan -',
          journalType: 'milestone',
          customAction: (s) => {
            const pay = Utils.usdToLocal(Utils.randInt(4500, 11000), s.countryId);
            s.money += pay;
            if (s.job) s.job.salary = Math.round(s.job.salary * 1.12);
            GameState.adjustStats({ smarts: 10, happiness: 10, health: -7 });
            return {
              outcome: `Tahun yang amat memenatkan tetapi berbaloi! Anda meraih ${Utils.formatMoney(pay, s.countryId)} dan lonjakan besar dalam kepakaran anda.`
            };
          }
        },
        {
          label: 'Tolak secara sopan demi kesihatan mental',
          hint: 'Kesihatan +, peluang berlalu',
          journalType: 'normal',
          customAction: () => {
            GameState.adjustStats({ health: 5, happiness: 2 });
            return {
              outcome: 'Anda menjaga keseimbangan hidup sendiri, walaupun sesekali tertanya-tanya apa yang mungkin terjadi jika anda menerimanya.'
            };
          }
        }
      ]
    }
  ],

  // --------------------------------------------------------------------------
  // 5. KESAN RAMA-RAMA / AKIBAT TERSEMBUNYI (3–15 Tahun Kemudian!)
  // --------------------------------------------------------------------------
  butterflyEffects: {
    cheated_partner: {
      icon: '💣',
      title: 'Kesan Masa Lalu: Rahsia Curang Terbongkar!',
      condition: (s) => Boolean(s.partnerId),
      textFn: (s, flag) => `Selepas ${s.age - flag.setAge} tahun menyembunyikan rahsia, mesej dan gambar lama malam terlarang anda akhirnya sampai ke tangan pasangan anda hari ini!`,
      choices: [
        {
          label: 'Mengaku jujur & terima apa jua keputusan pasangan',
          hint: 'Risiko putus/cerai tinggi, tapi jujur',
          journalType: 'warning',
          resolveFlag: 'cheated_partner',
          customAction: (s) => {
            const partner = s.relationships.find(r => r.id === s.partnerId);
            const pName = partner ? partner.name : 'Pasangan anda';
            if (Utils.chance(0.65)) {
              if (partner) { partner.role = 'Bekas Pasangan'; partner.closeness = 5; }
              if (s.married && s.money > 0) s.money -= Math.round(s.money * 0.25);
              s.partnerId = null;
              s.married = false;
              GameState.adjustStats({ happiness: -24, health: -5 });
              GameState.recordCrisis('heartbreak');
              return { outcome: `${pName} tidak mampu memaafkan pembohongan bertahun-tahun itu dan menamatkan hubungan kalian buat selamanya.` };
            } else {
              if (partner) partner.closeness = Utils.clamp(partner.closeness - 35, 10, 100);
              GameState.adjustStats({ happiness: -14 });
              return { outcome: `${pName} menangis teresak-esak tetapi masih mahu mencuba menyelamatkan hubungan kalian — kepercayaan kini hampir sifar.` };
            }
          }
        },
        {
          label: 'Nafikan & cuba tutup bukti',
          hint: 'Hubungan retak teruk, stres ++',
          journalType: 'warning',
          resolveFlag: 'cheated_partner',
          customAction: (s) => {
            const partner = s.relationships.find(r => r.id === s.partnerId);
            if (partner) partner.closeness = Utils.clamp(partner.closeness - 40, 5, 100);
            GameState.adjustStats({ happiness: -18, health: -6 });
            return { outcome: 'Pasangan anda tidak mempercayai penafian anda. Rumah tangga terasa dingin dan penuh curiga.' };
          }
        }
      ]
    },

    took_shady_loan: {
      icon: '🚨',
      title: 'Kesan Masa Lalu: Pemungut Hutang Menuntut Janji!',
      textFn: (s, flag) => `Sudah ${s.age - flag.setAge} tahun sejak anda menjadi penjamin pinjaman tidak berlesen dahulu. Sahabat anda gagal membayar dan kini pemungut hutang muncul di depan pintu menuntut bayaran berganda!`,
      choices: [
        {
          label: 'Bayar penuh tuntutan faedah yang melampau',
          hint: 'Wang ---, bebas daripada ancaman',
          journalType: 'warning',
          resolveFlag: 'took_shady_loan',
          customAction: (s) => {
            const debt = Utils.usdToLocal(Utils.randInt(4500, 11000), s.countryId);
            s.money -= debt;
            GameState.adjustStats({ happiness: -14, health: -4 });
            if (s.money < 0) GameState.recordCrisis('bankruptcy');
            return { outcome: `Anda terpaksa membayar ${Utils.formatMoney(debt, s.countryId)} untuk menutup kes itu. Baki bank anda cedera teruk, tetapi keluarga selamat.` };
          }
        },
        {
          label: 'Lapor polis & hadapi ugutan mereka',
          hint: 'Jimat wang, Kesihatan --, Gembira --',
          journalType: 'warning',
          resolveFlag: 'took_shady_loan',
          customAction: (s) => {
            const fee = Utils.usdToLocal(900, s.countryId);
            s.money -= fee;
            GameState.adjustStats({ health: -14, happiness: -16 });
            return { outcome: 'Polis membuka kertas siasatan, tetapi tekanan dan gangguan daripada sindiket itu menjejaskan kesihatan dan ketenangan anda sepanjang tahun.' };
          }
        }
      ]
    },

    neglected_health: {
      icon: '🏥',
      title: 'Kesan Masa Lalu: Kesihatan Yang Diabaikan Memakan Diri',
      textFn: (s, flag) => `Amaran doktor ${s.age - flag.setAge} tahun lalu yang pernah anda abaikan kini bertukar menjadi komplikasi serius. Anda terpaksa dimasukkan ke wad kecemasan!`,
      choices: [
        {
          label: 'Jalani pembedahan & pemulihan menyeluruh',
          hint: 'Kos tinggi, selamatkan kesihatan jangka panjang',
          journalType: 'warning',
          resolveFlag: 'neglected_health',
          customAction: (s) => {
            const cost = Utils.usdToLocal(Utils.randInt(2500, 6500), s.countryId);
            s.money -= cost;
            GameState.adjustStats({ health: -10, happiness: -10 });
            GameState.recordCrisis('illness');
            return { outcome: `Pembedahan berjaya tetapi menelan kos ${Utils.formatMoney(cost, s.countryId)}. Anda berjanji tidak akan memandang ringan kesihatan lagi.` };
          }
        },
        {
          label: 'Tangguhkan pembedahan & cuba rawatan alternatif sahaja',
          hint: 'Jimat wang, Kesihatan ---',
          journalType: 'warning',
          resolveFlag: 'neglected_health',
          customAction: (s) => {
            GameState.adjustStats({ health: -24, happiness: -12 });
            GameState.recordCrisis('illness');
            return { outcome: 'Keadaan fizikal anda merosot mendadak. Aktiviti harian kini terasa jauh lebih sukar berbanding dahulu.' };
          }
        }
      ]
    },

    betrayed_friend: {
      icon: '🪞',
      title: 'Kesan Masa Lalu: Pertemuan Semula Dengan Sahabat Lama',
      textFn: (s, flag) => `Takdir menemukan anda semula dengan sahabat yang pernah anda hampakan ${s.age - flag.setAge} tahun lalu — kini dia sudah berjaya dan berada di kedudukan yang berpengaruh dalam bidang anda!`,
      choices: [
        {
          label: 'Mohon maaf dengan ikhlas atas kesilapan dahulu',
          hint: 'Peluang pulihkan hubungan atau ditolak dingin',
          journalType: 'dilemma',
          resolveFlag: 'betrayed_friend',
          customAction: (s) => {
            if (Utils.chance(0.55)) {
              GameState.adjustStats({ happiness: 10, smarts: 3 });
              return { outcome: 'Dia menghargai kejujuran anda. Walaupun tidak serapat dahulu, dendam lama akhirnya terlerai.' };
            } else {
              if (s.job) s.job.performance = Utils.clamp(s.job.performance - 14, 15, 100);
              GameState.adjustStats({ happiness: -10 });
              return { outcome: 'Dia hanya tersenyum dingin. Beberapa minggu kemudian, satu peluang besar anda tiba-tiba dibatalkan secara misteri.' };
            }
          }
        },
        {
          label: 'Berpura-pura tidak kenal & teruskan haluan sendiri',
          hint: 'Elak drama sekarang, rasa sesal kekal',
          journalType: 'normal',
          resolveFlag: 'betrayed_friend',
          customAction: () => {
            GameState.adjustStats({ happiness: -6 });
            return { outcome: 'Anda melintasinya tanpa sepatah kata, tetapi kenangan persahabatan lama itu masih menyentuh hati.' };
          }
        }
      ]
    },

    took_bribe: {
      icon: '⚖️',
      title: 'Kesan Masa Lalu: Audit Siasatan Rasuah!',
      textFn: (s, flag) => `Skandal tender yang pernah anda luluskan ${s.age - flag.setAge} tahun lalu akhirnya meletup di media! Pihak berkuasa memanggil anda untuk siasatan segera.`,
      choices: [
        {
          label: 'Beri kerjasama penuh & bayar kompaun berat',
          hint: 'Denda besar, rekod tercalar, elak penjara',
          journalType: 'warning',
          resolveFlag: 'took_bribe',
          customAction: (s) => {
            const fine = Utils.usdToLocal(Utils.randInt(8000, 18000), s.countryId);
            s.money -= fine;
            s.criminalRecord += 1;
            if (s.job && Utils.chance(0.6)) s.job = null;
            GameState.adjustStats({ happiness: -20, health: -6 });
            if (s.money < 0) GameState.recordCrisis('bankruptcy');
            return { outcome: `Anda didenda ${Utils.formatMoney(fine, s.countryId)} dan rekod anda kini tercalar teruk. Duit mudah dahulu akhirnya memakan diri.` };
          }
        },
        {
          label: 'Upah peguam elit untuk lawan kes',
          hint: 'Kos guaman mahal, 50% peluang lepas bersih',
          journalType: 'warning',
          resolveFlag: 'took_bribe',
          customAction: (s) => {
            const legal = Utils.usdToLocal(6500, s.countryId);
            s.money -= legal;
            if (Utils.chance(0.5)) {
              GameState.adjustStats({ happiness: -4 });
              return { outcome: `Peguam anda berjaya menggugurkan dakwaan kerana kekurangan bukti, tetapi anda hangus ${Utils.formatMoney(legal, s.countryId)} untuk kos guaman.` };
            } else {
              s.criminalRecord += 1;
              s.job = null;
              GameState.adjustStats({ happiness: -22, health: -8 });
              return { outcome: `Anda kalah dalam perbicaraan! Selain hangus ${Utils.formatMoney(legal, s.countryId)}, anda kehilangan pekerjaan dan menanggung rekod jenayah.` };
            }
          }
        }
      ]
    },

    neglected_family: {
      icon: '🏠',
      title: 'Kesan Masa Lalu: Rumah Besar, Hati Yang Kosong',
      textFn: (s, flag) => `Pengorbanan masa anda untuk kerjaya ${s.age - flag.setAge} tahun lalu meninggalkan jurang besar. Hari ini, orang tersayang anda meluahkan rasa terasing kerana anda jarang hadir saat mereka memerlukan.`,
      choices: [
        {
          label: 'Kurangkan beban kerja & tebus semula masa bersama',
          hint: 'Gaji -10%, Hubungan ++, Gembira ++',
          journalType: 'dilemma',
          resolveFlag: 'neglected_family',
          customAction: (s) => {
            if (s.job) s.job.salary = Math.round(s.job.salary * 0.9);
            s.relationships.filter(r => r.alive).forEach(r => {
              r.closeness = Utils.clamp(r.closeness + 18);
            });
            GameState.adjustStats({ happiness: 12, health: 6 });
            return { outcome: 'Anda memilih untuk memperlahankan rentak hidup. Perlahan-lahan, kehangatan kembali mengisi ruang rumah anda.' };
          }
        },
        {
          label: 'Pertahankan bahawa anda bekerja keras demi mereka',
          hint: 'Kerjaya utuh, hubungan makin dingin',
          journalType: 'warning',
          resolveFlag: 'neglected_family',
          customAction: (s) => {
            s.relationships.filter(r => r.alive).forEach(r => {
              r.closeness = Utils.clamp(r.closeness - 14, 5, 100);
            });
            GameState.adjustStats({ happiness: -12 });
            return { outcome: 'Penjelasan anda gagal meredakan kekecewaan mereka. Anda sedar wang tidak mampu membeli masa yang telah berlalu.' };
          }
        }
      ]
    },

    joined_scam_scheme: {
      icon: '📉',
      title: 'Kesan Masa Lalu: Skim Pelaburan Runtuh!',
      textFn: (s, flag) => `Skim cepat kaya yang pernah anda sertai ${s.age - flag.setAge} tahun lalu akhirnya tumbang! Pihak berkuasa membekukan akaun penganjur dan beberapa mangsa yang anda ajak dahulu kini menuntut ganti rugi daripada anda.`,
      choices: [
        {
          label: 'Pulangkan sebahagian wang mangsa untuk selesaikan luar mahkamah',
          hint: 'Wang --, maruah & rekod selamat',
          journalType: 'warning',
          resolveFlag: 'joined_scam_scheme',
          customAction: (s) => {
            const repay = Utils.usdToLocal(Utils.randInt(3500, 8500), s.countryId);
            s.money -= repay;
            GameState.adjustStats({ happiness: -10, smarts: 4 });
            if (s.money < 0) GameState.recordCrisis('bankruptcy');
            return { outcome: `Anda membayar ganti rugi ${Utils.formatMoney(repay, s.countryId)} bagi menebus kesilapan lalu. Berat di poket, namun lega di jiwa.` };
          }
        },
        {
          label: 'Enggan bertanggungjawab & biarkan mereka lapor polis',
          hint: 'Risiko rekod jenayah & dipulaukan',
          journalType: 'warning',
          resolveFlag: 'joined_scam_scheme',
          customAction: (s) => {
            if (Utils.chance(0.55)) s.criminalRecord += 1;
            GameState.adjustStats({ happiness: -16 });
            return { outcome: 'Nama anda tular sebagai ejen skim penipuan. Reputasi anda tercalar teruk di kalangan kenalan.' };
          }
        }
      ]
    },

    neglected_spouse: {
      icon: '💍',
      title: 'Kesan Masa Lalu: Rumah Tangga Di Ambang Retak',
      condition: (s) => Boolean(s.partnerId && s.married),
      textFn: (s, flag) => `Sudah ${s.age - flag.setAge} tahun pasangan hidup anda memendam rasa sejak anda mengabaikan perasaannya dahulu. Hari ini dia duduk di hadapan anda dengan wajah sebak dan meminta keputusan jujur tentang masa depan perkahwinan kalian.`,
      choices: [
        {
          label: 'Minta maaf dengan tulus, sertai kaunseling & baiki rumah tangga',
          hint: 'Kos kaunseling, peluang selamatkan perkahwinan',
          journalType: 'romance',
          resolveFlag: 'neglected_spouse',
          customAction: (s) => {
            const cost = Utils.usdToLocal(500, s.countryId);
            s.money -= cost;
            const spouse = s.relationships.find(r => r.id === s.partnerId);
            if (spouse) {
              spouse.closeness = Utils.clamp(spouse.closeness + 22);
              spouse.trust = Utils.clamp((spouse.trust || 50) + 20);
            }
            GameState.adjustStats({ happiness: 12 });
            return { outcome: 'Sesi luahan hati dari jiwa ke jiwa akhirnya mencairkan ketegangan bertahun-tahun. Perkahwinan kalian diberi nafas baru.' };
          }
        },
        {
          label: 'Akui hati sudah tawar & berpisah secara baik',
          hint: 'Penceraian, hati pedih, tapi masing-masing bebas',
          journalType: 'warning',
          resolveFlag: 'neglected_spouse',
          customAction: (s) => {
            const spouse = s.relationships.find(r => r.id === s.partnerId);
            const pName = spouse ? spouse.name : 'pasangan anda';
            if (spouse) {
              spouse.category = 'ex';
              spouse.role = 'Bekas Pasangan (Cerai)';
              spouse.closeness = 15;
            }
            if (s.money > 0) s.money -= Math.round(s.money * 0.18);
            s.partnerId = null;
            s.married = false;
            GameState.adjustStats({ happiness: -18 });
            GameState.recordCrisis('heartbreak');
            return { outcome: `Anda dan ${pName} akhirnya memilih jalan penceraian. Pengajaran pahit tentang pentingnya menghargai pasangan.` };
          }
        }
      ]
    }
  },

  // --------------------------------------------------------------------------
  // 6. PERISTIWA LINGKARAN RAKAN & RUMAH TANGGA (Suka Duka Sebenar)
  // --------------------------------------------------------------------------
  relationshipEvents: [
    {
      id: 'rel_friend_borrow_vanish',
      minAge: 18, maxAge: 70,
      condition: (s) => s.relationships.some(r => r.alive && r.category === 'friend') && s.money > Utils.usdToLocal(400, s.countryId),
      icon: '💸',
      title: 'Drama Rakan: Pinjam Duit Lalu Menghilang',
      textFn: (s) => {
        const f = Utils.pick(s.relationships.filter(r => r.alive && r.category === 'friend'));
        s._tmpEventNpcId = f.id;
        return `Rakan anda, ${f.name}, merayu meminjam wang kecemasan dan berjanji membayar semula bulan depan — tetapi anda tahu dia agak boros.`;
      },
      choices: [
        {
          label: 'Pinjamkan wang atas dasar persahabatan',
          hint: 'Risiko dia lesap & hilang wang, atau dia jujur',
          journalType: 'dilemma',
          customAction: (s) => {
            const f = s.relationships.find(r => r.id === s._tmpEventNpcId) || s.relationships.find(r => r.alive && r.category === 'friend');
            const amt = Math.min(Math.round(s.money * 0.18), Utils.usdToLocal(1600, s.countryId));
            s.money -= amt;
            if (Utils.chance(0.58)) {
              if (f) { f.closeness = 15; f.trust = 10; }
              GameState.adjustStats({ happiness: -12 });
              return { outcome: `Sebaik menerima ${Utils.formatMoney(amt, s.countryId)}, ${f ? f.name : 'rakan anda'} terus menyekat mesej anda dan menghilangkan diri!` };
            } else {
              s.money += amt;
              if (f) { f.closeness = Utils.clamp(f.closeness + 15); f.trust = Utils.clamp((f.trust || 60) + 18); }
              GameState.adjustStats({ happiness: 10 });
              return { outcome: `${f ? f.name : 'Rakan anda'} menepati janji dan memulangkan penuh ${Utils.formatMoney(amt, s.countryId)}! Persahabatan kalian makin utuh.` };
            }
          }
        },
        {
          label: 'Tolak secara berhemah & tawarkan bantuan bukan tunai',
          hint: 'Wang selamat, rakan mungkin terasa hati',
          journalType: 'dilemma',
          customAction: (s) => {
            const f = s.relationships.find(r => r.id === s._tmpEventNpcId);
            if (f) f.closeness = Utils.clamp(f.closeness - 14, 10, 100);
            GameState.adjustStats({ smarts: 3, happiness: -3 });
            return { outcome: `${f ? f.name : 'Rakan anda'} agak dingin selepas anda menolak, tetapi simpanan anda kekal terjaga.` };
          }
        }
      ]
    },
    {
      id: 'rel_friend_jealousy',
      minAge: 16, maxAge: 65,
      condition: (s) => s.relationships.some(r => r.alive && r.category === 'friend'),
      icon: '🐍',
      title: 'Konflik Rakan: Cemburu & Umpatan Belakang',
      textFn: (s) => {
        const f = Utils.pick(s.relationships.filter(r => r.alive && r.category === 'friend'));
        s._tmpEventNpcId = f.id;
        return `Anda terdengar khabar angin bahawa rakan anda, ${f.name}, menyebarkan cerita buruk tentang kejayaan anda di belakang anda kerana rasa iri hati.`;
      },
      choices: [
        {
          label: 'Bersemuka secara matang & minta penjelasan jujur',
          hint: 'Boleh pulih atau tamatkan persahabatan toksik',
          journalType: 'dilemma',
          customAction: (s) => {
            const f = s.relationships.find(r => r.id === s._tmpEventNpcId);
            if (Utils.chance(0.5)) {
              if (f) { f.closeness = Utils.clamp(f.closeness - 10, 20, 100); f.trust = Utils.clamp((f.trust || 50) - 18, 10, 100); }
              GameState.adjustStats({ happiness: 2, smarts: 3 });
              return { outcome: `${f ? f.name : 'Dia'} mengaku salah dan memohon maaf. Anda memaafkannya tetapi lebih berhati-hati berkongsi rahsia.` };
            } else {
              if (f) { f.alive = false; f.category = 'ex'; }
              GameState.adjustStats({ happiness: -6 });
              return { outcome: `Pertengkaran tercetus dan anda memutuskan hubungan dengan ${f ? f.name : 'rakan toksik itu'}. Lebih baik kecilkan lingkaran demi ketenangan jiwa.` };
            }
          }
        },
        {
          label: 'Balas dendam dengan menjatuhkan reputasinya pula',
          hint: 'Puas seketika, rekod karma & stres ++',
          journalType: 'warning',
          setFlag: 'betrayed_friend',
          customAction: (s) => {
            const f = s.relationships.find(r => r.id === s._tmpEventNpcId);
            if (f) { f.alive = false; f.category = 'ex'; }
            GameState.adjustStats({ happiness: -8, smarts: -2 });
            return { outcome: 'Drama antara kalian menjadi buah mulut ramai. Anda rasa puas seketika tetapi jiwa terasa kosong dan penat.' };
          }
        }
      ]
    },
    {
      id: 'rel_friend_support',
      minAge: 14, maxAge: 75,
      condition: (s) => s.relationships.some(r => r.alive && r.category === 'friend' && r.closeness >= 55),
      icon: '🤝',
      title: 'Sahabat Sejati Di Kala Sukar',
      textFn: (s) => {
        const f = Utils.pick(s.relationships.filter(r => r.alive && r.category === 'friend' && r.closeness >= 55));
        s._tmpEventNpcId = f.id;
        return `Ketika anda terasa letih dengan tekanan hidup, rakan anda ${f.name} datang mengajak minum bersama, mendengar luahan anda dan berkongsi peluang baik!`;
      },
      choices: [
        {
          label: 'Hargai kehadirannya & luahkan isi hati',
          hint: 'Gembira ++, Kemesraan & Kepercayaan ++',
          journalType: 'culture',
          customAction: (s) => {
            const f = s.relationships.find(r => r.id === s._tmpEventNpcId);
            if (f) {
              f.closeness = Utils.clamp(f.closeness + 14);
              f.trust = Utils.clamp((f.trust || 60) + 14);
            }
            GameState.adjustStats({ happiness: 14, health: 4 });
            return { outcome: `Perbualan ikhlas bersama ${f ? f.name : 'sahabat anda'} meringankan beban di dada. Sahabat sejati memang sukar dicari ganti.` };
          }
        }
      ]
    },
    {
      id: 'rel_marriage_inlaws',
      minAge: 21, maxAge: 68,
      condition: (s) => Boolean(s.married && s.partnerId),
      icon: '🏠',
      title: 'Ujian Rumah Tangga: Konflik Mentua',
      text: 'Keluarga mentua anda kerap mencampuri urusan kewangan dan cara hidup rumah tangga anda sehingga mencetuskan ketegangan dengan pasangan anda.',
      choices: [
        {
          label: 'Berdialog sopan & tetapkan sempadan sihat bersama pasangan',
          hint: 'Pasangan sokong ++, mentua terasa sedikit',
          journalType: 'dilemma',
          customAction: (s) => {
            const spouse = s.relationships.find(r => r.id === s.partnerId);
            if (spouse) {
              spouse.closeness = Utils.clamp(spouse.closeness + 12);
              spouse.trust = Utils.clamp((spouse.trust || 70) + 10);
            }
            GameState.adjustStats({ happiness: 6, smarts: 3 });
            return { outcome: 'Anda dan pasangan bersepakat menetapkan sempadan dengan penuh adab. Rumah tangga terasa lebih aman dan saling melindungi.' };
          }
        },
        {
          label: 'Abaikan rungutan pasangan demi menjaga hati orang luar',
          hint: 'Pasangan kecewa --, risiko konflik masa depan',
          journalType: 'warning',
          setFlag: 'neglected_spouse',
          customAction: (s) => {
            const spouse = s.relationships.find(r => r.id === s.partnerId);
            if (spouse) {
              spouse.closeness = Utils.clamp(spouse.closeness - 18, 10, 100);
              spouse.trust = Utils.clamp((spouse.trust || 70) - 15, 10, 100);
            }
            GameState.adjustStats({ happiness: -10 });
            return { outcome: 'Pasangan anda berasa keseorangan dan tidak dibela. Suasana di rumah menjadi dingin berminggu-minggu.' };
          }
        }
      ]
    },
    {
      id: 'rel_marriage_finance',
      minAge: 22, maxAge: 65,
      condition: (s) => Boolean(s.married && s.partnerId),
      icon: '💳',
      title: 'Ujian Rumah Tangga: Tekanan Kewangan',
      text: 'Bil bulanan, kos sara hidup dan komitmen keluarga meningkat mendadak tahun ini. Anda dan pasangan mula tertekan memikirkan bajet rumah tangga.',
      choices: [
        {
          label: 'Duduk berbincang, susun bajet jujur & berjimat bersama',
          hint: 'Kos rendah, Kepercayaan ++, Gembira - seketika',
          journalType: 'dilemma',
          customAction: (s) => {
            const spouse = s.relationships.find(r => r.id === s.partnerId);
            if (spouse) {
              spouse.trust = Utils.clamp((spouse.trust || 70) + 14);
              spouse.closeness = Utils.clamp(spouse.closeness + 8);
            }
            GameState.adjustStats({ smarts: 4, happiness: 3 });
            return { outcome: 'Kejujuran mengukuhkan perkahwinan. Kalian berjaya menyusun semula bajet tanpa menyalahkan satu sama lain.' };
          }
        },
        {
          label: 'Sembunyikan masalah wang & guna simpanan secara senyap',
          hint: 'Wang --, Kepercayaan pasangan terjejas',
          journalType: 'warning',
          setFlag: 'neglected_spouse',
          customAction: (s) => {
            const hit = Utils.usdToLocal(1400, s.countryId);
            s.money -= hit;
            const spouse = s.relationships.find(r => r.id === s.partnerId);
            if (spouse) spouse.trust = Utils.clamp((spouse.trust || 70) - 20, 10, 100);
            GameState.adjustStats({ happiness: -9, health: -4 });
            return { outcome: `Anda menanggung tekanan sendirian (${Utils.formatMoney(hit, s.countryId)} susut), dan pasangan anda mula syak ada sesuatu yang disembunyikan.` };
          }
        }
      ]
    }
  ]
};
