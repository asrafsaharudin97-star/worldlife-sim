/* ==========================================================================
   WorldLife — Peristiwa Budaya, Hijrah & Kehidupan (Bahasa Melayu)
   ========================================================================== */

window.GAME_EVENTS = {
  // --------------------------------------------------------------------------
  // PERISTIWA KETIBAAN (dicetuskan serta-merta sebaik berhijrah!)
  // --------------------------------------------------------------------------
  arrival: {
    MY: {
      id: 'arr_my',
      icon: '🇲🇾',
      title: 'Selamat Tiba di Malaysia!',
      text: 'Angin tropika menyambut anda di KLIA! Pada malam pertama, pemandu e-hailing yang peramah bertanya: "Bos, baru sampai Malaysia ke? Wajib cuba Nasi Lemak atau Roti Canai Banjir malam ni!"',
      choices: [
        {
          label: 'Terus singgah ke kedai Mamak 24 jam yang meriah',
          hint: 'Penyesuaian ++, Gembira ++',
          outcome: 'Anda pesan Teh Tarik dan Roti Canai garing sambil berbual mesra dengan penduduk tempatan. Malaysia terus terasa seperti rumah!',
          effects: { happiness: 14, adaptation: 14 },
          moneyUsd: -5
        },
        {
          label: 'Tinjau kawasan sekitar & sediakan kad Touch \'n Go',
          hint: 'Pintar +, Praktikal',
          outcome: 'Langkah bijak! Anda terus selesaikan kad SIM, pengangkutan awam dan bayaran QR DuitNow pada hari pertama.',
          effects: { smarts: 5, happiness: 8, adaptation: 10 },
          moneyUsd: -12
        }
      ]
    },
    SG: {
      id: 'arr_sg',
      icon: '🇸🇬',
      title: 'Selamat Tiba di Lapangan Terbang Changi!',
      text: 'Anda melangkah keluar melepasi air terjun Jewel Changi ke kota Singapura yang serba moden dan teratur. Pusat penjaja (hawker centre) berdekatan sedang memanggil!',
      choices: [
        {
          label: 'Beli kad EZ-Link & cari Nasi Ayam Hainan',
          hint: 'Penyesuaian ++, Gembira ++',
          outcome: 'Nasi wangi, ayam lembut, cili pedas dan Milo Dinosaur sejuk — memang shiok!',
          effects: { happiness: 14, adaptation: 14 },
          moneyUsd: -10
        },
        {
          label: 'Bersiar-siar di Marina Bay menikmati pemandangan',
          hint: 'Penuh inspirasi',
          outcome: 'Melihat lampu bandar berkilauan di Marina Bay membakar semangat anda untuk bab baru ini!',
          effects: { happiness: 12, smarts: 3, adaptation: 9 }
        }
      ]
    },
    JP: {
      id: 'arr_jp',
      icon: '🇯🇵',
      title: 'Selamat Tiba di Jepun!',
      text: 'Kereta api berlepas tepat pada saatnya, mesin layan diri bercahaya di setiap sudut, dan kedai 7-Eleven yang bersih berada tepat di bawah apartmen baru anda.',
      choices: [
        {
          label: 'Beli kad Suica & cuba kedai Ramen lewat malam',
          hint: 'Penyesuaian ++, Gembira ++',
          outcome: 'Anda menunduk hormat, menghirup ramen panas di kaunter kayu, dan terus jatuh cinta dengan Jepun!',
          effects: { happiness: 15, adaptation: 14 },
          moneyUsd: -14
        },
        {
          label: 'Daftar alamat di Pejabat Daerah & pelajari jadual sampah',
          hint: 'Pintar ++, Penyesuaian +',
          outcome: 'Pegawai daerah tersenyum mesra melihat pendaftaran kad residen anda berjalan sangat lancar!',
          effects: { smarts: 5, happiness: 7, adaptation: 12 }
        }
      ]
    },
    GB: {
      id: 'arr_gb',
      icon: '🇬🇧',
      title: 'Selamat Tiba di United Kingdom!',
      text: 'Hujan renyai menyambut anda di luar stesen sementara bas dua tingkat merah meluncur lalu. Rakan serumah mengajak anda minum teh panas atau makan malam di pekan.',
      choices: [
        {
          label: 'Minum teh panas & beli Fish and Chips segar',
          hint: 'Penyesuaian ++, Gembira ++',
          outcome: 'Dibungkus kertas dengan garam dan cuka — nikmat sungguh malam sejuk pertama anda di UK!',
          effects: { happiness: 13, adaptation: 14 },
          moneyUsd: -14
        },
        {
          label: 'Daftar klinik NHS tempatan & beli kad Oyster',
          hint: 'Persediaan bijak',
          outcome: 'Selesai dengan kemas! Rawatan kesihatan percuma NHS kini sedia untuk kehidupan baru anda.',
          effects: { smarts: 5, health: 4, adaptation: 11 }
        }
      ]
    },
    US: {
      id: 'arr_us',
      icon: '🇺🇸',
      title: 'Selamat Tiba di Amerika Syarikat!',
      text: 'Lebuh raya luas, pencakar langit gah dan hidangan saiz gergasi menyambut ketibaan anda! Semua orang menyapa "How\'s it going?" dengan senyuman lebar.',
      choices: [
        {
          label: 'Raikan dengan burger klasik & milkshake di diner',
          hint: 'Penyesuaian ++, Gembira ++',
          outcome: 'Hidangan besar, minuman isi semula percuma, dan pengalaman pertama mengira tip 20%!',
          effects: { happiness: 14, adaptation: 13 },
          moneyUsd: -25
        },
        {
          label: 'Uruskan SSN, akaun bank & pelan insurans kesihatan',
          hint: 'Pintar ++, Selamat',
          outcome: 'Menyelesaikan urusan rasmi pada minggu pertama menyelamatkan anda daripada masalah masa depan!',
          effects: { smarts: 6, health: 3, adaptation: 11 }
        }
      ]
    },
    AU: {
      id: 'arr_au',
      icon: '🇦🇺',
      title: 'Selamat Tiba di Australia!',
      text: 'Langit biru cerah dan bayu laut menyambut anda! Barista tempatan yang ceria melambai: "G\'day mate! Nak kopi Flat White petang ni?"',
      choices: [
        {
          label: 'Pesan Flat White & bersiar di tepi pantai',
          hint: 'Penyesuaian ++, Gembira ++',
          outcome: 'Kopi paling sedap pernah anda rasa ditemani matahari hangat — "No worries, mate!"',
          effects: { happiness: 15, health: 4, adaptation: 14 },
          moneyUsd: -8
        },
        {
          label: 'Daftar kad Medicare, TFN & akaun Superannuation',
          hint: 'Permulaan kemas',
          outcome: 'Pendaratan lancar! Anda kini bersedia meraih gaji tinggi Australia dan menikmati Medicare.',
          effects: { smarts: 5, happiness: 8, adaptation: 11 }
        }
      ]
    },
    KR: {
      id: 'arr_kr',
      icon: '🇰🇷',
      title: 'Selamat Tiba di Korea Selatan!',
      text: 'Papan tanda neon bergemerlapan di jalanan sibuk, aroma K-BBQ menyelerakan dan Wi-Fi sepantas kilat terus bersambung sejak di terminal!',
      choices: [
        {
          label: 'Beli kad T-money & cuba Tteokbokki pedas di gerai jalanan',
          hint: 'Penyesuaian ++, Gembira ++',
          outcome: 'Kek beras kenyal, sup kek ikan panas dan layanan mesra makcik gerai — daebak!',
          effects: { happiness: 15, adaptation: 14 },
          moneyUsd: -9
        },
        {
          label: 'Muat turun aplikasi peta & penghantaran tempatan',
          hint: 'Pintar +, Penyesuaian ++',
          outcome: 'Kini anda boleh bergerak di Seoul seperti orang tempatan dan pesan makanan tengah malam terus ke pintu!',
          effects: { smarts: 5, happiness: 9, adaptation: 13 }
        }
      ]
    },
    ID: {
      id: 'arr_id',
      icon: '🇮🇩',
      title: 'Selamat Tiba di Indonesia!',
      text: 'Senyuman mesra, deruan skuter dan haruman Sate Ayam serta Nasi Goreng menyambut kedatangan anda ke Nusantara!',
      choices: [
        {
          label: 'Nikmati Nasi Goreng Spesial & Es Kopi Susu di warung meriah',
          hint: 'Penyesuaian ++, Gembira ++',
          outcome: 'Aroma kuali berapi, keropok rangup dan perbualan santai — memang mantap!',
          effects: { happiness: 15, adaptation: 14 },
          moneyUsd: -5
        },
        {
          label: 'Pasang aplikasi Gojek/Grab & tinjau kawasan sekitar',
          hint: 'Langkah praktikal',
          outcome: 'Segalanya daripada pengangkutan hingga Martabak tengah malam kini di hujung jari!',
          effects: { smarts: 4, happiness: 9, adaptation: 12 }
        }
      ]
    },
    TH: {
      id: 'arr_th',
      icon: '🇹🇭',
      title: 'Selamat Tiba di Thailand!',
      text: 'Senyuman manis, istana keemasan dan bau Pad Kra Pao panas menyambut anda di Negara Senyuman!',
      choices: [
        {
          label: 'Terus cuba Pad Thai jalanan & Teh Ais Thai',
          hint: 'Penyesuaian ++, Gembira ++',
          outcome: 'Aroi mak! Gabungan manis, masam dan pedas di bawah sinaran lampu malam Bangkok.',
          effects: { happiness: 15, adaptation: 14 },
          moneyUsd: -5
        },
        {
          label: 'Beli kad Rabbit BTS Skytrain & belajar ucapan asas Thai',
          hint: 'Pintar +, Praktikal',
          outcome: 'Meluncur laju di atas kesesakan Bangkok sambil menyapa penduduk dengan sopan!',
          effects: { smarts: 5, happiness: 9, adaptation: 12 },
          moneyUsd: -10
        }
      ]
    },
    AE: {
      id: 'arr_ae',
      icon: '🇦🇪',
      title: 'Selamat Tiba di UAE (Dubai)!',
      text: 'Cahaya matahari memancar pada pencakar langit futuristik di tengah gurun keemasan! Paling best — anda baru masuk zon 0% cukai pendapatan!',
      choices: [
        {
          label: 'Raikan dengan Teh Karak berempah & Shawarma panas',
          hint: 'Penyesuaian ++, Gembira ++',
          outcome: 'Teh Karak beraroma buah pelaga berharga AED 2 di bawah langit berkilauan — habibi, selamat datang ke Dubai!',
          effects: { happiness: 15, adaptation: 14 },
          moneyUsd: -6
        },
        {
          label: 'Selesaikan Emirates ID, kad metro Nol & akaun bank bebas cukai',
          hint: 'Pintar ++, Lancar',
          outcome: 'Emirates ID anda siap dalam beberapa hari — segala urusan di UAE sangat pantas!',
          effects: { smarts: 5, happiness: 9, adaptation: 12 }
        }
      ]
    }
  },

  // --------------------------------------------------------------------------
  // PERISTIWA BUDAYA KHUSUS NEGARA (mengikut negara SEMASA!)
  // --------------------------------------------------------------------------
  country: {
    MY: [
      {
        id: 'my_mamak_2am',
        minAge: 14, maxAge: 70,
        icon: '🫓',
        title: 'Sesi Lepak Mamak 2:00 Pagi',
        text: 'Kawan-kawan WhatsApp "Jom mamak!" tepat sebelum perlawanan bola sepak besar bermula. Teh Tarik berbuih dan Roti Tisu menjulang tinggi di meja!',
        choices: [
          {
            label: 'Pesan Roti Canai Banjir + Teh Tarik Kaw',
            hint: 'Gembira +, Kesihatan -',
            outcome: 'Anda lepak sampai jam 3 pagi gelak ketawa dengan geng. Berbaloi sangat — syok habis!',
            effects: { happiness: 12, health: -3, adaptation: 6 },
            moneyUsd: -5
          },
          {
            label: 'Pesan Teh O Ais Limau Kurang Manis',
            hint: 'Seimbang',
            outcome: 'Dapat juga suasana lepak tanpa merosakkan tidur atau kesihatan anda.',
            effects: { happiness: 7, health: 1, adaptation: 4 },
            moneyUsd: -2
          },
          {
            label: 'Tolak pelawaan & tidur awal 8 jam',
            hint: 'Kesihatan +, Pintar +',
            outcome: 'Mereka gelar anda "bo jio" dalam grup WhatsApp, tapi anda bangun pagi dengan segar!',
            effects: { health: 6, smarts: 3, happiness: -2 }
          }
        ]
      },
      {
        id: 'my_balik_kampung',
        minAge: 7, maxAge: 80,
        icon: '🚗',
        title: 'Kesesakan Lebuhraya Balik Kampung',
        text: 'Musim perayaan sudah tiba dan Lebuhraya Utara-Selatan (PLUS) dipenuhi lampu brek merah sepanjang 30 kilometer!',
        choices: [
          {
            label: 'Bertolak jam 4 pagi & singgah R&R makan Nasi Lemak',
            hint: 'Langkah bijak!',
            outcome: 'Strategi genius! Anda berjaya elak jem, makan Nasi Lemak Bungkus panas di R&R Tapah dan tiba dengan senyuman.',
            effects: { happiness: 12, smarts: 3, adaptation: 6 },
            moneyUsd: -8
          },
          {
            label: 'Redah jem petang sambil berkaraoke lagu raya',
            hint: 'Meriah walaupun penat',
            outcome: 'Perjalanan 4 jam jadi 10 jam, tapi nyanyi lagu klasik bersama keluarga tetap mengeratkan hubungan!',
            effects: { happiness: 7, health: -3, adaptation: 5 }
          },
          {
            label: 'Raya di bandar & nikmati jalan KL yang lengang',
            hint: 'Tenang',
            outcome: 'Memandu di sekitar Kuala Lumpur tanpa kesesakan langsung terasa sungguh aman.',
            effects: { happiness: 5, health: 3 }
          }
        ]
      },
      {
        id: 'my_open_house',
        minAge: 5, maxAge: 90,
        icon: '🏮',
        title: 'Jemputan Rumah Terbuka Muhibbah',
        text: 'Jiran anda mengadakan Rumah Terbuka besar-besaran — rendang, lemang, sate, kuih-muih, Yee Sang dan murukku penuh di atas meja!',
        choices: [
          {
            label: 'Pakai pakaian tradisional & bawa buah tangan',
            hint: 'Budaya ++, Gembira ++',
            outcome: 'Tuan rumah tersenyum lebar! Anda makan tiga pusingan sate dan menambah kenalan rapat kejiranan.',
            effects: { happiness: 14, looks: 3, adaptation: 12 },
            moneyUsd: -15
          },
          {
            label: 'Singgah menjamu selera & terima/beri duit raya',
            hint: 'Meriah',
            outcome: 'Makanan sedap, ucapan mesra dan semangat Muhibbah Malaysia yang sebenar!',
            effects: { happiness: 10, adaptation: 7 },
            moneyUsd: 12
          }
        ]
      },
      {
        id: 'my_durian_king',
        minAge: 10, maxAge: 85,
        icon: '🍈',
        title: 'Gerai Durian Musang King Tepi Jalan',
        text: 'Aroma padu Durian Musang King Pahang menusuk hidung di tepi jalan. Abang gerai tersenyum: "Bos, isi lemak pahit manis, gerenti puas hati!"',
        choices: [
          {
            label: 'Belanja besar beli Musang King Gred A',
            hint: 'Mahal, Gembira ++',
            outcome: 'Isi kuning keemasan yang lemak berkrim! Siap minum air garam dari pangsa durian selepas makan.',
            effects: { happiness: 15, adaptation: 8 },
            moneyUsd: -35
          },
          {
            label: 'Pilih Durian D24 & Durian Kampung',
            hint: 'Jimat & padu',
            outcome: 'Rasa asli kampung pada separuh harga — abang gerai siap bagi buah manggis percuma!',
            effects: { happiness: 10, smarts: 2, adaptation: 6 },
            moneyUsd: -12
          },
          {
            label: 'Lari jauh-jauh dari bau durian',
            hint: 'Bukan peminat',
            outcome: 'Kawan-kawan geleng kepala tak percaya anda tidak makan raja segala buah!',
            effects: { happiness: -2, adaptation: -3 }
          }
        ]
      },
      {
        id: 'my_myvi_king',
        minAge: 18, maxAge: 75,
        icon: '🚗',
        title: 'Pertembungan Lebuhraya Dengan MyVi',
        text: 'Anda sedang memandu di lorong kanan apabila sebuah Perodua MyVi kuning menyala muncul di belakang sambil memberi lampu tinggi seperti kereta F1.',
        choices: [
          {
            label: 'Beri laluan dengan penuh hormat kepada "King of the Road"',
            hint: 'Selamat & bijak',
            outcome: 'MyVi itu menyalakan lampu kecemasan dua kali tanda terima kasih lalu lesap di ufuk!',
            effects: { smarts: 3, happiness: 5, adaptation: 6 }
          },
          {
            label: 'Enggan ke tepi & bunyikan hon balas',
            hint: 'Berisiko marah',
            outcome: 'Ketegangan 5 minit di jalan raya hanya menaikkan tekanan darah — tidak berbaloi langsung.',
            effects: { happiness: -6, health: -4 }
          }
        ]
      },
      {
        id: 'my_pasar_malam_rain',
        minAge: 8, maxAge: 80,
        icon: '⛈️',
        title: 'Hujan Ribut Mengejut di Pasar Malam',
        text: 'Sedang anda membeli Apam Balik rangup dan Char Kuey Teow, hujan lebat petang klasik Malaysia turun mencurah-curah!',
        choices: [
          {
            label: 'Berteduh bawah khemah & berborak dengan makcik gerai',
            hint: 'Mesra',
            outcome: 'Makcik siap beri karipap percuma sementara menunggu hujan reda. Mesra sungguh rakyat Malaysia!',
            effects: { happiness: 10, adaptation: 7 },
            moneyUsd: -4
          },
          {
            label: 'Berlari redah hujan sambil peluk bungkusan tapau',
            hint: 'Risiko kesihatan',
            outcome: 'Char Kuey Teow selamat kering, cuma kasut anda basah kuyup!',
            effects: { happiness: 5, health: -4 }
          }
        ]
      }
    ],

    SG: [
      {
        id: 'sg_chope_drama',
        minAge: 12, maxAge: 80,
        icon: '🧻',
        title: 'Dilema Tisu "Chope" di Hawker Centre',
        text: 'Waktu makan tengah hari di Maxwell Food Centre, satu-satunya meja kosong mempunyai sebungkus tisu terletak kemas di tengahnya.',
        choices: [
          {
            label: 'Hormati budaya "Chope" & cari tempat duduk lain',
            hint: 'Budaya ++',
            outcome: 'Anda faham undang-undang tidak bertulis Singapura! Anda berkongsi meja dengan pakcik peramah.',
            effects: { happiness: 7, smarts: 2, adaptation: 10 }
          },
          {
            label: 'Alihkan tisu tersebut dan terus duduk',
            hint: 'Kecoh!',
            outcome: 'Pekerja pejabat pulang dengan dua dulang Nasi Ayam lalu menghadiahkan renungan paling tajam!',
            effects: { happiness: -8, adaptation: -4 }
          }
        ]
      },
      {
        id: 'sg_bto_ballot',
        minAge: 21, maxAge: 55,
        icon: '🏢',
        title: 'Hari Keputusan Undian HDB BTO',
        text: 'Keputusan nombor giliran HDB BTO baru sahaja keluar di skrin anda...',
        choices: [
          {
            label: 'Semak portal dengan penuh debaran',
            hint: 'Pengalaman berguna',
            outcome: 'Steady! Anda kini mahir tentang geran perumahan, peraturan CPF dan perancangan ubah suai.',
            effects: { happiness: 9, smarts: 4, adaptation: 8 }
          },
          {
            label: 'Belanja diri sendiri Chili Crab untuk tenangkan hati',
            hint: 'Gembira +',
            outcome: 'Sama ada dapat atau tidak, Chili Crab dengan roti mantou tetap mengubati jiwa!',
            effects: { happiness: 13, adaptation: 6 },
            moneyUsd: -55
          }
        ]
      },
      {
        id: 'sg_mrt_jam',
        minAge: 14, maxAge: 75,
        icon: '🚇',
        title: 'Waktu Puncak di Platform MRT',
        text: 'Tren Laluan Timur-Barat tiba dalam keadaan penuh sesak pada pagi Isnin.',
        choices: [
          {
            label: 'Beratur kemas di belakang garisan kuning & tunggu tren seterusnya',
            hint: 'Sopan & tenang',
            outcome: 'Tren seterusnya tiba dalam 2 minit dengan ruang yang luas dan selesa!',
            effects: { happiness: 6, smarts: 2, adaptation: 7 }
          },
          {
            label: 'Beli Kopi-C Kosong & naik Grab ke tempat kerja',
            hint: 'Guna wang',
            outcome: 'Tiba dengan selesa dalam penghawa dingin, walaupun dompet sedikit terasa.',
            effects: { happiness: 8, health: 2 },
            moneyUsd: -22
          }
        ]
      }
    ],

    JP: [
      {
        id: 'jp_hanami_spot',
        minAge: 10, maxAge: 85,
        icon: '🌸',
        title: 'Musim Bunga Sakura (Hanami)',
        text: 'Pokok sakura di taman baru sahaja kembang mekar! Semua orang berebut tempat berkelah di bawah kelopak merah jambu.',
        choices: [
          {
            label: 'Bangun jam 6 pagi bentang tikar biru & bawa bento',
            hint: 'Gembira ++, Penyesuaian ++',
            outcome: 'Anda dapat lokasi terbaik di bawah pokok sakura besar. Hari musim bunga yang tidak dapat dilupakan!',
            effects: { happiness: 15, health: 3, adaptation: 11 },
            moneyUsd: -25
          },
          {
            label: 'Bersiar tenang pada waktu malam melihat Yozakura',
            hint: 'Santai',
            outcome: 'Sakura bercahaya di tepi sungai terasa seperti berada dalam filem anime.',
            effects: { happiness: 11, health: 4, adaptation: 7 }
          }
        ]
      },
      {
        id: 'jp_trash_sorting',
        minAge: 16, maxAge: 80,
        icon: '♻️',
        title: 'Jadual Asingkan Sampah 6 Kategori',
        text: 'Pagi Selasa dan anda ada penutup botol plastik, botol PET dibasuh, kotak kadbod dan sisa dapur untuk diasingkan.',
        choices: [
          {
            label: 'Semak carta majlis bandaran & asingkan dengan teliti',
            hint: 'Pintar +, Penyesuaian ++',
            outcome: 'Makcik jiran mengangguk puas hati — anda kini pakar kitar semula Jepun!',
            effects: { smarts: 4, happiness: 6, adaptation: 12 }
          },
          {
            label: 'Campak semua dalam satu plastik dan harap tiada siapa perasan',
            hint: 'Silap besar!',
            outcome: 'Pelekat merah amaran ditampal pada beg sampah anda tengah hari itu. Pengajaran berguna!',
            effects: { happiness: -7, adaptation: -4 }
          }
        ]
      },
      {
        id: 'jp_nomikai',
        minAge: 20, maxAge: 68,
        icon: '🍢',
        title: 'Makan Malam Bersama Rakan Kerja di Izakaya',
        text: 'Rakan sekerja mengajak anda ke izakaya meriah di lorong berlampu tanglung untuk menikmati sate yakitori.',
        choices: [
          {
            label: 'Sertai makan malam dengan adab sopan Jepun',
            hint: 'Budaya ++',
            outcome: 'Adab sopan anda memikat hati rakan sepasukan! Hubungan kerja bertambah mesra.',
            effects: { happiness: 12, adaptation: 12, health: -2 },
            moneyUsd: -32
          },
          {
            label: 'Minum teh oolong & makan sedikit lalu pulang awal',
            hint: 'Seimbang',
            outcome: 'Semua menghormati gaya hidup sihat anda dan mengucapkan "Otsukaresama deshita!"',
            effects: { happiness: 8, health: 3, adaptation: 7 },
            moneyUsd: -18
          }
        ]
      }
    ],

    GB: [
      {
        id: 'gb_rain_queue',
        minAge: 12, maxAge: 85,
        icon: '☔',
        title: 'Cuaca British & Budaya Beratur',
        text: 'Lima minit lepas cerah, kini hujan turun lebat di luar kedai roti — dan ada orang cuba memotong barisan!',
        choices: [
          {
            label: 'Tegur dengan sopan tapi tegas: "Excuse me, there\'s a queue"',
            hint: 'Gaya British sejati!',
            outcome: 'Seluruh barisan mengangguk penuh bangga. Anda meraikannya dengan pastri panas.',
            effects: { happiness: 11, smarts: 2, adaptation: 11 },
            moneyUsd: -6
          },
          {
            label: 'Berbual tentang cuaca dengan orang sebelah',
            hint: 'Klasik',
            outcome: 'Anda terus mesra dengan orang asing hanya dengan mengulas cuaca mendung hari itu.',
            effects: { happiness: 7, adaptation: 8 }
          }
        ]
      },
      {
        id: 'gb_sunday_roast',
        minAge: 10, maxAge: 90,
        icon: '🍽️',
        title: 'Makan Tengah Hari Sunday Roast',
        text: 'Puding Yorkshire keemasan, kentang panggang rangup dan kuiz trivia hujung minggu sedang menanti!',
        choices: [
          {
            label: 'Pesan set lengkap & ketuai pasukan kuiz trivia',
            hint: 'Pintar +, Gembira ++',
            outcome: 'Pasukan anda menang pusingan geografi dan membawa pulang hadiah £30!',
            effects: { happiness: 14, smarts: 4, adaptation: 10 },
            moneyUsd: 10
          },
          {
            label: 'Nikmati secawan teh & skon di tepi tingkap',
            hint: 'Selesa',
            outcome: 'Suasana tenang menonton hujan renyai dari dalam kafe klasik British.',
            effects: { happiness: 9, health: 2, adaptation: 6 },
            moneyUsd: -12
          }
        ]
      }
    ],

    US: [
      {
        id: 'us_tip_screen',
        minAge: 16, maxAge: 85,
        icon: '💳',
        title: 'Skrin Tip iPad di Kafe',
        text: 'Anda membeli kopi ais dan bagel. Juruwang memusingkan skrin tablet: "Pilih jumlah tip anda: 20% | 25% | 30%."',
        choices: [
          {
            label: 'Tekan 20% dengan senyuman mesra',
            hint: 'Norma tempatan',
            outcome: 'Barista bersorak "Appreciate you!" — urusan sosial gaya Amerika berjalan lancar.',
            effects: { happiness: 6, adaptation: 9 },
            moneyUsd: -14
          },
          {
            label: 'Tekan "No Tip" dengan wajah selamba',
            hint: 'Jimat tapi janggal',
            outcome: 'Anda jimat $3, cuma suasana tiba-tiba menjadi sedikit sunyi!',
            effects: { happiness: 2, smarts: 2, adaptation: 3 },
            moneyUsd: -10
          }
        ]
      },
      {
        id: 'us_thanksgiving',
        minAge: 6, maxAge: 90,
        icon: '🦃',
        title: 'Jamuan Kesyukuran (Thanksgiving)',
        text: 'Anda dijemput ke jamuan besar Thanksgiving dengan ayam belanda panggang, kentang putar dan pai labu!',
        choices: [
          {
            label: 'Masak hidangan istimewa & kongsi rasa syukur',
            hint: 'Gembira ++, Penyesuaian ++',
            outcome: 'Semua menambah hidangan masakan anda! Malam penuh kehangatan dan kesyukuran.',
            effects: { happiness: 15, adaptation: 12 },
            moneyUsd: -25
          },
          {
            label: 'Bawa pai & tonton perlawanan bola sepak Amerika',
            hint: 'Santai',
            outcome: 'Petang klasik yang kenyang dan meriah di ruang tamu.',
            effects: { happiness: 10, health: -2, adaptation: 7 },
            moneyUsd: -14
          }
        ]
      }
    ],

    AU: [
      {
        id: 'au_magpie',
        minAge: 8, maxAge: 80,
        icon: '🐦',
        title: 'Musim Burung Magpie Menjunam!',
        text: 'Bulan September di Australia — seekor burung magpie sedang mengintai anda ketika berjalan di taman!',
        choices: [
          {
            label: 'Pasang ikat kabel pada topi keledar & berjalan tenang',
            hint: 'Taktik asli Aussie',
            outcome: 'Kemahiran survival tempatan! Penunggang basikal yang lalu ketawa: "Good on ya, mate!"',
            effects: { smarts: 3, happiness: 8, adaptation: 11 }
          },
          {
            label: 'Lari lintang-pukang sambil melambai tangan',
            hint: 'Kesihatan -',
            outcome: 'Anda tersadung sedikit tapi selamat — jadi cerita kelakar sepanjang minggu!',
            effects: { happiness: 4, health: -4, adaptation: 6 }
          }
        ]
      },
      {
        id: 'au_bunnings',
        minAge: 10, maxAge: 85,
        icon: '🌭',
        title: 'Sosej Panggang Sabtu di Bunnings',
        text: 'Haruman bawang goreng di luar kedai perkakasan Bunnings membuatkan langkah anda terhenti serta-merta.',
        choices: [
          {
            label: 'Beli dua roti sosej & berborak dengan komuniti setempat',
            hint: 'Puncak budaya Australia',
            outcome: 'Menyokong tabung kelab sukan tempatan sambil menikmati sosej legenda A$3.50!',
            effects: { happiness: 13, adaptation: 11 },
            moneyUsd: -6
          },
          {
            label: 'Beli kopi Flat White gaya Melbourne',
            hint: 'Peminat kopi',
            outcome: 'Kopi berkrim sempurna — Australia memang menaikkan piawaian kopi anda selamanya.',
            effects: { happiness: 9, adaptation: 8 },
            moneyUsd: -5
          }
        ]
      }
    ],

    KR: [
      {
        id: 'kr_han_river',
        minAge: 14, maxAge: 75,
        icon: '🍗',
        title: 'Berkelah di Sungai Han & Ramyeon',
        text: 'Angin petang nyaman bertiup di Taman Sungai Han. Rakan-rakan mengajak masak ramyeon segera dan pesan ayam goreng!',
        choices: [
          {
            label: 'Pesan ayam goreng rangup + masak ramyeon tepi sungai!',
            hint: 'Gembira ++, Penyesuaian ++',
            outcome: 'Penghantar makanan jumpa tikar berkelah anda dalam 20 minit sahaja. Daebak!',
            effects: { happiness: 15, health: -2, adaptation: 12 },
            moneyUsd: -22
          },
          {
            label: 'Kayuh basikal sepanjang Sungai Han dahulu',
            hint: 'Kesihatan +, Gembira +',
            outcome: 'Pemandangan matahari terbenam Seoul plus senaman petang yang menyegarkan!',
            effects: { health: 9, happiness: 11, adaptation: 8 },
            moneyUsd: -12
          }
        ]
      },
      {
        id: 'kr_noraebang',
        minAge: 13, maxAge: 70,
        icon: '🎤',
        title: 'Pertandingan Karaoke Noraebang',
        text: 'Selepas makan K-BBQ di Hongdae, kawan-kawan menarik anda masuk ke bilik karaoke Noraebang!',
        choices: [
          {
            label: 'Tarik nada tinggi lagu balada K-Pop dengan penuh gaya',
            hint: 'Gembira ++',
            outcome: 'Skor mesin karaoke mencecah 98/100 — anda diangkat sebagai legenda bilik karaoke!',
            effects: { happiness: 14, looks: 2, adaptation: 11 },
            moneyUsd: -12
          },
          {
            label: 'Bersorak dan jaga bekalan snek untuk semua',
            hint: 'Santai',
            outcome: 'Suasana ceria, gelak tawa tak henti dan suara anda masih selamat!',
            effects: { happiness: 8, adaptation: 6 },
            moneyUsd: -8
          }
        ]
      }
    ],

    ID: [
      {
        id: 'id_17_agustus',
        minAge: 6, maxAge: 75,
        icon: '🇮🇩',
        title: 'Sukaneka Hari Kemerdekaan 17 Agustus!',
        text: 'Kejiranan anda meriah dengan sorakan pertandingan Balap Karung, Makan Keropok dan Panjat Pinang!',
        choices: [
          {
            label: 'Sertai pertandingan Makan Keropok & Lari Guni!',
            hint: 'Gembira ++, Penyesuaian ++',
            outcome: 'Anda melompat garisan penamat penuh tepung dan menang hamper snek besar!',
            effects: { happiness: 15, health: 4, adaptation: 12 },
            moneyUsd: 10
          },
          {
            label: 'Bantu gotong-royong menyediakan BBQ kejiranan',
            hint: 'Mesra komuniti',
            outcome: 'Jiran-jiran menghulurkan Sate Ayam dan Es Cendol sebagai tanda terima kasih!',
            effects: { happiness: 11, adaptation: 10 }
          }
        ]
      },
      {
        id: 'id_warung_sambal',
        minAge: 10, maxAge: 85,
        icon: '🌶️',
        title: 'Cabaran Tahap Pedas Sambal Warung',
        text: 'Di warung tepi jalan yang penuh pelanggan, tukang masak bertanya berapa biji cili padi untuk Ayam Geprek anda.',
        choices: [
          {
            label: 'Pilih Tahap 15 Ekstra Pedas ("Gaspol!")',
            hint: 'Berani!',
            outcome: 'Berair mata kepedasan, namun seluruh warung bertepuk tangan kagum dengan ketahanan anda!',
            effects: { happiness: 11, health: -2, adaptation: 11 },
            moneyUsd: -4
          },
          {
            label: 'Minta Tahap 3 Sederhana + Es Teh Manis',
            hint: 'Sedap & selamat',
            outcome: 'Gabungan sempurna ayam rangup, pedas menyengat dan teh ais manis — mantap!',
            effects: { happiness: 10, adaptation: 7 },
            moneyUsd: -3
          }
        ]
      }
    ],

    TH: [
      {
        id: 'th_songkran',
        minAge: 6, maxAge: 80,
        icon: '💦',
        title: 'Pesta Perang Air Songkran!',
        text: 'Cuaca 38°C pada bulan April dan seluruh jalan berubah menjadi pesta tembak air terbesar di dunia!',
        choices: [
          {
            label: 'Beli pistol air gergasi & sertai pesta jalanan!',
            hint: 'Gembira ++, Penyesuaian ++',
            outcome: 'Basah kuyup dari kepala hingga kaki sambil ketawa bersama penduduk tempatan!',
            effects: { happiness: 16, health: 2, adaptation: 12 },
            moneyUsd: -10
          },
          {
            label: 'Sertai upacara tradisi menghormati warga emas',
            hint: 'Tradisional & tenang',
            outcome: 'Anda menerima ucapan restu tulus untuk tahun baru yang makmur!',
            effects: { happiness: 12, smarts: 2, adaptation: 10 }
          }
        ]
      },
      {
        id: 'th_night_market',
        minAge: 12, maxAge: 85,
        icon: '🥭',
        title: 'Syurga Makanan Pasar Malam Bangkok',
        text: 'Deretan khemah putih menjual Pulut Mangga, Som Tum pedas dan udang galah bakar!',
        choices: [
          {
            label: 'Makan Pulut Mangga & Som Tum segar',
            hint: 'Aroi mak!',
            outcome: 'Mangga manis dengan santan lemak masin — memang syurga makanan!',
            effects: { happiness: 14, adaptation: 9 },
            moneyUsd: -12
          },
          {
            label: 'Tinjau gerai seni tempatan & muzik akustik',
            hint: 'Sabai-sabai',
            outcome: 'Malam Bangkok yang santai sambil membeli cenderahati unik.',
            effects: { happiness: 10, looks: 2, adaptation: 7 },
            moneyUsd: -18
          }
        ]
      }
    ],

    AE: [
      {
        id: 'ae_summer_heat',
        minAge: 10, maxAge: 85,
        icon: '☀️',
        title: 'Petang Musim Panas 48°C di Dubai',
        text: 'Bahang Julai di luar mencecah 48°C, tetapi di dalam pusat beli-belah terasa seperti musim sejuk 20°C!',
        choices: [
          {
            label: 'Main ski salji dalam Mall of the Emirates & minum Teh Karak',
            hint: 'Gaya Dubai!',
            outcome: 'Bermain salji ketika suhu luar 48°C — hanya di UAE!',
            effects: { happiness: 15, health: 4, adaptation: 11 },
            moneyUsd: -55
          },
          {
            label: 'Tunggu tengah malam untuk berjalan di pantai JBR & makan shawarma',
            hint: 'Rutin tempatan',
            outcome: 'Bandar ini hidup selepas matahari terbenam! Pemandangan Marina tengah malam sungguh memukau.',
            effects: { happiness: 12, adaptation: 10 },
            moneyUsd: -10
          }
        ]
      },
      {
        id: 'ae_desert_majlis',
        minAge: 14, maxAge: 85,
        icon: '🐪',
        title: 'Jemputan Majlis Gurun & Melihat Bintang',
        text: 'Rakan tempatan menjemput anda ke bukit pasir gurun untuk kopi Arab Gahwa, kurma Medjool dan kambing panggang.',
        choices: [
          {
            label: 'Sambut dengan tangan kanan & hayati layanan mesra Arab',
            hint: 'Budaya ++, Gembira ++',
            outcome: 'Tuan rumah amat menghargai adab anda! Berbual di bawah bintang gurun terasa magis.',
            effects: { happiness: 16, adaptation: 14 }
          },
          {
            label: 'Cuba luncur pasir dari bukit pasir tertinggi dahulu!',
            hint: 'Mendebarkan!',
            outcome: 'Penuh pasir, penuh gelak tawa dan gambar matahari terbenam yang epik!',
            effects: { happiness: 14, health: 5, adaptation: 10 }
          }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // PERISTIWA HIJRAH & KEJUTAN BUDAYA (bila tinggal di luar negara lahir!)
  // --------------------------------------------------------------------------
  migration: [
    {
      id: 'mig_share_homeland_food',
      icon: '🍲',
      title: 'Rasa Tanah Air di Perantauan',
      textFn: (state, curr, birth) =>
        `Rakan-rakan baru anda di ${curr.name} teruja ingin tahu tentang ${birth.name} ${birth.flag}. Anda menjemput mereka makan malam masakan asli dari negara asal anda!`,
      choices: [
        {
          label: 'Cari rempah ratus asli & masak jamuan istimewa tanah air',
          hint: 'Gembira ++, Penyesuaian ++',
          outcomeFn: (state, curr, birth) =>
            `Mereka terpukau dengan keenakan masakan ${birth.name}! Berkongsi budaya asal membuatkan anda lebih diterima di ${curr.name}.`,
          effects: { happiness: 16, adaptation: 14 },
          moneyUsd: -35
        },
        {
          label: 'Bawa mereka ke restoran diaspora tempatan berhampiran',
          hint: 'Malam meriah',
          outcomeFn: (state, curr, birth) =>
            `Anda bertukar cerita budaya sambil mengajar mereka kata-kata slanga kegemaran dari ${birth.name}!`,
          effects: { happiness: 12, adaptation: 10 },
          moneyUsd: -45
        }
      ]
    },
    {
      id: 'mig_homesick_festival',
      icon: '📱',
      title: 'Rindu Kampung Halaman Musim Perayaan',
      textFn: (state, curr, birth) =>
        `Media sosial penuh dengan gambar keluarga anda beraya di ${birth.name} ${birth.flag}, sedangkan hari ini ialah hari bekerja biasa di ${curr.name}.`,
      choices: [
        {
          label: 'Buat panggilan video panjang & kirim hadiah pulang ke kampung',
          hint: 'Menyentuh hati',
          outcomeFn: (state, curr, birth) =>
            `Melihat wajah keluarga mengubati rasa rindu. Ibu bapa amat bangga dengan perjuangan anda di ${curr.name}!`,
          effects: { happiness: 11, adaptation: 6 },
          moneyUsd: -60
        },
        {
          label: 'Sertai perjumpaan komuniti perantau di bandar anda',
          hint: 'Komuniti +',
          outcomeFn: (state, curr, birth) =>
            `Anda bertemu rakan perantau dari ${birth.name} di ${state.city} dan berkongsi kisah kejutan budaya yang mencuit hati!`,
          effects: { happiness: 13, adaptation: 10 },
          moneyUsd: -20
        },
        {
          label: 'Sibukkan diri dengan kerja lebih masa untuk lupa rindu',
          hint: 'Wang +, Gembira -',
          outcomeFn: () =>
            `Anda memperoleh sedikit bonus lebih masa, namun hati tetap merindui tanah air malam ini.`,
          effects: { happiness: -6, health: -3 },
          moneyUsd: 90
        }
      ]
    },
    {
      id: 'mig_slang_breakthrough',
      icon: '🗣️',
      title: 'Detik Fasih Bahasa & Slanga Tempatan',
      textFn: (state, curr) =>
        `Ketika berbual dengan pekedai di ${state.city}, mereka menggunakan slanga tempatan ("${curr.slang[0]}", "${curr.slang[1]}") dengan pantas!`,
      choices: [
        {
          label: 'Balas dengan bersahaja menggunakan ungkapan tempatan',
          hint: 'Penyesuaian ++, Pintar +',
          outcomeFn: (state, curr) =>
            `Pekedai itu ketawa gembira: "Wah, awak bercakap macam orang tempatan ${curr.name} sejati!"`,
          effects: { happiness: 13, smarts: 4, adaptation: 16 }
        },
        {
          label: 'Tersenyum sopan & minta mereka ajar maksudnya',
          hint: 'Belajar mesra',
          outcomeFn: () =>
            `Mereka dengan gembira mengajar anda ungkapan harian tempatan siap bagi snek percuma!`,
          effects: { happiness: 9, smarts: 3, adaptation: 12 }
        }
      ]
    },
    {
      id: 'mig_local_bureaucracy',
      icon: '📄',
      title: 'Urusan Dokumen & Perbankan Perantau',
      textFn: (state, curr) =>
        `Hidup di luar negara perlukan disiplin dokumen! Anda perlu memperbaharui kad residen, nombor cukai dan akaun bank ${curr.currency.code} di ${state.city}.`,
      choices: [
        {
          label: 'Sediakan semua salinan dokumen dengan lengkap & datang awal',
          hint: 'Pintar +, Lancar!',
          outcomeFn: (state, curr) =>
            `Lulus pada cubaan pertama! Menguruskan sistem rasmi ${curr.name} kini terasa mudah bagi anda.`,
          effects: { smarts: 4, happiness: 8, adaptation: 13 }
        },
        {
          label: 'Upah ejen penempatan untuk uruskan borang',
          hint: 'Guna wang, Mudah',
          outcomeFn: () =>
            `Agak mahal, tapi bebas pening kepala dan semua siap dicop dalam beberapa hari!`,
          effects: { happiness: 6, adaptation: 6 },
          moneyUsd: -180
        }
      ]
    }
  ],

  // --------------------------------------------------------------------------
  // PERISTIWA KEHIDUPAN SEJAGAT
  // --------------------------------------------------------------------------
  universal: [
    (function buildChildTalentEvent() {
      // 'popularity' dipetakan ke Populariti (alignment.fame)
      const applyFx = (fx) => {
        const { popularity, ...rest } = fx || {};
        GameState.adjustStats(rest);
        if (popularity && window.KarmaEndings) KarmaEndings.adjustAlignment({ fame: popularity });
      };
      const sub = (catIcon, catTitle, intro, options) => ({
        id: 'uni_child_talent_sub',
        icon: catIcon,
        title: catTitle,
        text: intro,
        choices: options.map(o => ({ label: o.label, outcome: o.outcome, customAction: () => { applyFx(o.effects); return {}; } }))
      });

      const categories = [
        {
          label: '🤖 Kelab Robotik & Akademik STEM',
          event: sub('🤖', 'Kelab Robotik & Akademik STEM', 'Cikgu penasihat kelab menunjukkan lima aktiviti yang boleh anda pilih. Mana satu menarik minat anda?', [
            { label: 'Robotik & Koding', outcome: 'Robot kecil anda berjaya mengikut garisan hitam di lantai — seluruh kelas bertepuk tangan!', effects: { smarts: 10, happiness: 4 } },
            { label: 'Matematik Tambahan', outcome: 'Anda mula menyelesaikan teka-teki nombor lebih pantas daripada rakan sebaya.', effects: { smarts: 12, happiness: -2 } },
            { label: 'Eksperimen Sains', outcome: 'Gunung berapi buatan anda meletus berbuih dan memenangi tempat pertama pameran sains!', effects: { smarts: 8, happiness: 6, popularity: 3 } },
            { label: 'Kelab Catur', outcome: 'Anda belajar berfikir tiga langkah ke hadapan dan menewaskan juara kelab tahun lepas.', effects: { smarts: 9, happiness: 3 } },
            { label: 'Kuiz & Pertandingan Sains', outcome: 'Pasukan anda mara ke peringkat daerah — nama anda diumumkan semasa perhimpunan!', effects: { smarts: 7, popularity: 5, happiness: 4 } }
          ])
        },
        {
          label: '⚽ Kelab Sukan & Olahraga',
          event: sub('⚽', 'Kelab Sukan & Olahraga', 'Jurulatih sekolah menyenaraikan lima sukan yang dibuka untuk pelajar baharu.', [
            { label: 'Bola Sepak', outcome: 'Gol pertama anda dalam perlawanan persahabatan membuatkan rakan sepasukan menjulang anda!', effects: { health: 9, popularity: 6, happiness: 5 } },
            { label: 'Badminton', outcome: 'Pukulan smash anda semakin tajam dan refleks anda jauh lebih pantas.', effects: { health: 8, smarts: 2, happiness: 5 } },
            { label: 'Renang', outcome: 'Anda kini mampu berenang lima pusingan kolam tanpa berhenti — badan semakin tegap!', effects: { health: 12, looks: 4 } },
            { label: 'Seni Mempertahankan Diri', outcome: 'Tali pinggang pertama anda diikat oleh jurulatih — anda lebih berdisiplin dan yakin diri.', effects: { health: 9, happiness: 4, popularity: 2 } },
            { label: 'Olahraga & Larian', outcome: 'Anda memecahkan rekod larian 100 meter peringkat sekolah!', effects: { health: 10, looks: 3, popularity: 4 } }
          ])
        },
        {
          label: '🎵 Kelas Muzik',
          event: sub('🎵', 'Kelas Muzik', 'Bilik muzik sekolah penuh dengan alat muzik. Cikgu meminta anda memilih satu bidang untuk didalami.', [
            { label: 'Gitar', outcome: 'Jari anda mula lancar memetik kord dan anda boleh mainkan lagu kegemaran sendiri!', effects: { happiness: 10, smarts: 3, popularity: 3 } },
            { label: 'Piano', outcome: 'Persembahan piano anda di hari terbuka sekolah membuatkan ibu bapa terharu.', effects: { smarts: 7, happiness: 7 } },
            { label: 'Vokal & Nyanyian', outcome: 'Suara anda dipilih untuk mengetuai koir sekolah!', effects: { happiness: 8, popularity: 7, looks: 2 } },
            { label: 'Dram & Perkusi', outcome: 'Rentak dram anda menghidupkan suasana — tetapi jiran mula mengadu bising.', effects: { happiness: 11, health: 3 } },
            { label: 'Produksi Muzik & DJ', outcome: 'Anda menggubah lagu pertama di komputer dan rakan-rakan memutarnya berulang kali.', effects: { smarts: 6, happiness: 7, popularity: 4 } }
          ])
        },
        {
          label: '🎨 Kelas Seni & Kreatif',
          event: sub('🎨', 'Kelas Seni & Kreatif', 'Guru seni mempamerkan lima aktiviti kreatif yang boleh anda sertai.', [
            { label: 'Lukisan & Cat Air', outcome: 'Lukisan berwarna-warni anda digantung di koridor utama sekolah!', effects: { happiness: 10, smarts: 4 } },
            { label: 'Fotografi', outcome: 'Gambar matahari terbenam yang anda rakam terpilih untuk kulit majalah sekolah.', effects: { smarts: 4, happiness: 7, popularity: 4 } },
            { label: 'Lakonan & Teater', outcome: 'Anda mendapat watak utama dalam pementasan akhir tahun — tepukan gemuruh!', effects: { popularity: 8, happiness: 7, looks: 2 } },
            { label: 'Rekaan Grafik', outcome: 'Poster rekaan anda digunakan untuk hari sukan sekolah.', effects: { smarts: 7, happiness: 5 } },
            { label: 'Tarian', outcome: 'Kumpulan tarian anda memukau penonton di pentas konsert sekolah!', effects: { health: 7, looks: 5, popularity: 5 } }
          ])
        },
        {
          label: '🗣️ Kelab Bahasa & Pidato',
          event: sub('🗣️', 'Kelab Bahasa & Pidato', 'Kelab bahasa menawarkan lima aktiviti untuk mengasah kemahiran berkomunikasi.', [
            { label: 'Debat', outcome: 'Hujah anda yang tajam membuatkan pihak lawan terdiam — pasukan anda menang!', effects: { smarts: 8, popularity: 5 } },
            { label: 'Pidato & Syarahan', outcome: 'Anda berdiri yakin di pentas dan memenangi pertandingan pidato peringkat sekolah.', effects: { smarts: 6, popularity: 7 } },
            { label: 'Bahasa Asing', outcome: 'Anda kini boleh berbual ringkas dalam bahasa baharu — cikgu sangat kagum!', effects: { smarts: 10, happiness: 3 } },
            { label: 'Penulisan Kreatif', outcome: 'Cerpen anda diterbitkan dalam majalah tahunan sekolah.', effects: { smarts: 7, happiness: 6 } },
            { label: 'Kelab Bercerita', outcome: 'Adik-adik tadika ketawa riang mendengar cerita yang anda sampaikan.', effects: { happiness: 8, popularity: 4, smarts: 3 } }
          ])
        }
      ];

      const discipline = (s, key) => {
        const defs = {
          hit_teacher: { name: 'memukul dan melawan cikgu', karma: -25, heat: 18, caughtChance: 0.8, severe: true },
          vandal: { name: 'merosakkan harta sekolah', karma: -12, heat: 8, caughtChance: 0.45 },
          truant: { name: 'ponteng kelas dan lepak di luar pagar', karma: -4, heat: 3, caughtChance: 0.4 },
          bully: { name: 'membuli dan memeras duit pelajar lain', karma: -15, heat: 6, caughtChance: 0.5 },
          sabotage: { name: 'mensabotaj bilik darjah dan makmal', karma: -14, heat: 9, caughtChance: 0.5 }
        };
        const d = defs[key];
        const smarts = (s.stats && s.stats.smarts) || 50;
        const caught = Utils.chance(Math.max(0.15, Math.min(0.9, d.caughtChance - (smarts - 50) / 400)));
        const adjust = (vals) => { if (window.KarmaEndings) KarmaEndings.adjustAlignment(vals); };
        let outcome = '';

        if (key === 'truant') applyFx({ smarts: -6 });
        if (key === 'bully' && !caught) {
          const loot = Utils.randInt(3, 15);
          s.money += Utils.usdToLocal(loot, s.countryId);
        }

        if (!caught) {
          adjust({ karma: Math.round(d.karma * 0.6), notoriety: key === 'truant' ? 0 : Math.round(d.heat * 0.3), stress: key === 'truant' ? -8 : 2 });
          const freeLines = {
            hit_teacher: 'Anda menolak cikgu dan melarikan diri sebelum sesiapa sempat mengecam anda. Tiada siapa membuat laporan… buat masa ini.',
            vandal: 'Meja dan dinding kelas habis diconteng dan dirosakkan, tetapi tiada saksi yang melihat anda.',
            truant: 'Anda lepak di kedai berhampiran sepanjang petang tanpa dikesan pengawas. Seronok, tetapi pelajaran semakin ketinggalan.',
            bully: 'Pelajar itu terlalu takut untuk mengadu. Anda pulang dengan duit poketnya.',
            sabotage: 'Alat makmal rosak dan kelas terpaksa dibatalkan — tiada siapa tahu angkara anda.'
          };
          return { outcome: freeLines[key], toastType: 'error' };
        }

        // Kantoi
        adjust({ karma: d.karma, notoriety: key === 'truant' ? 2 : d.heat, stress: 10 });
        s.criminalRecord = s.criminalRecord || 0;
        if (key === 'vandal' || key === 'bully') applyFx({ popularity: -8, happiness: -5 });

        if (d.severe) {
          const roll = Math.random();
          if (roll < 0.35 && window.PrisonFugitive && typeof PrisonFugitive.enterPrisonState === 'function') {
            s.criminalRecord += 1;
            PrisonFugitive.enterPrisonState(s, 'Serangan terhadap guru', 1, 'low', { detentionType: 'juvenile' });
            outcome = 'Cikgu membuat laporan polis. Anda didakwa kerana serangan dan dihantar ke Sekolah Juvana selama setahun.';
          } else if (roll < 0.75) {
            applyFx({ smarts: -8, happiness: -10, popularity: -6 });
            outcome = 'Anda dibuang sekolah serta-merta. Ibu bapa dipanggil dan nama anda dicatat dalam rekod polis.';
          } else {
            applyFx({ smarts: -4, happiness: -8 });
            outcome = 'Anda digantung sekolah selama dua minggu dan ibu bapa terpaksa menandatangani surat aku janji.';
          }
          return { outcome, toastType: 'error' };
        }

        const r = Math.random();
        if (r < 0.4) {
          outcome = `Anda kantoi ${d.name}. Guru disiplin memberi amaran keras dan memaklumkan kepada ibu bapa.`;
          applyFx({ happiness: -4 });
        } else if (r < 0.8) {
          outcome = `Anda kantoi ${d.name} dan dikenakan tahanan selepas sekolah selama seminggu.`;
          applyFx({ happiness: -7, smarts: -2 });
        } else {
          outcome = `Anda kantoi ${d.name} dan digantung sekolah. Ibu bapa sangat kecewa dengan anda.`;
          applyFx({ happiness: -10, smarts: -5, popularity: -4 });
        }
        return { outcome, toastType: 'error' };
      };

      const disciplineEvent = {
        id: 'uni_child_talent_discipline',
        icon: '🔥',
        title: 'Buat Hal & Langgar Disiplin',
        text: 'Daripada menyertai kelab, anda dan beberapa rakan nakal merancang sesuatu selepas loceng berbunyi…',
        choices: [
          { label: 'Pukul / Lawan Cikgu', journalType: 'warning', customAction: (s) => discipline(s, 'hit_teacher') },
          { label: 'Vandalisme & Rosakkan Harta Sekolah', journalType: 'warning', customAction: (s) => discipline(s, 'vandal') },
          { label: 'Ponteng Kelas & Lepak Luar Pagar', journalType: 'warning', customAction: (s) => discipline(s, 'truant') },
          { label: 'Buli & Peras Duit Pelajar Lain', journalType: 'warning', customAction: (s) => discipline(s, 'bully') },
          { label: 'Sabotaj Bilik Darjah / Makmal', journalType: 'warning', customAction: (s) => discipline(s, 'sabotage') }
        ]
      };

      return {
        id: 'uni_child_talent',
        minAge: 5, maxAge: 11,
        icon: '🎨',
        title: 'Mencungkil Bakat Selepas Sekolah',
        text: 'Guru anda melihat anda sangat aktif selepas kelas dan mencadangkan anda menyertai kelab kokurikulum. Pilih satu bidang untuk melihat aktiviti yang ditawarkan.',
        choices: [
          ...categories.map(cat => ({ label: cat.label, customAction: () => ({ nextEvent: cat.event }) })),
          {
            label: '😴 Malas nak sertai / Pulang terus ke rumah',
            hint: 'Gembira +, Pintar -',
            outcome: 'Anda menolak cadangan guru dan lebih gemar berehat serta bermain di rumah, namun perkembangan kepandaian anda sedikit terjejas.',
            effects: { smarts: -5, happiness: 3 }
          },
          { label: '🔥 Buat Hal & Langgar Disiplin', customAction: () => ({ nextEvent: disciplineEvent }) }
        ]
      };
    })(),
    {
      id: 'uni_teen_peer',
      minAge: 13, maxAge: 17,
      icon: '🎒',
      title: 'Pecutan Akhir Peperiksaan Sekolah',
      text: 'Peperiksaan besar tinggal dua minggu lagi, tetapi rakan-rakan mengajak anda bermain permainan video sepanjang hujung minggu.',
      choices: [
        {
          label: 'Tubuhkan kumpulan belajar bersama snek',
          hint: 'Pintar ++',
          outcome: 'Nota ulang kaji anda sangat berkesan! Anda menjawab ujian percubaan dengan penuh yakin.',
          effects: { smarts: 12, happiness: 3 }
        },
        {
          label: 'Main game hari Sabtu, ulang kaji tekun hari Ahad',
          hint: 'Seimbang',
          outcome: 'Keseimbangan terbaik — dapat berseronok DAN keputusan masih mantap!',
          effects: { happiness: 8, smarts: 5 }
        },
        {
          label: 'Ponteng ulang kaji demi maraton game',
          hint: 'Gembira +, Pintar -',
          outcome: 'Menang berturut-turut dalam game, tapi pen merah cikgu pada hari Isnin tiada belas kasihan.',
          effects: { happiness: 11, smarts: -7 }
        }
      ]
    },
    {
      id: 'uni_side_hustle',
      minAge: 19, maxAge: 58,
      icon: '💡',
      title: 'Peluang Perniagaan Sampingan Hujung Minggu',
      text: 'Seorang rakan mengajak anda memulakan perniagaan dalam talian menjual rekaan digital dan barangan gaya tempatan.',
      choices: [
        {
          label: 'Luangkan masa & modal kecil untuk lancarkan bersama',
          hint: 'Potensi untung!',
          outcome: 'Tempahan mula mencurah masuk! Anda meraih keuntungan lumayan dan ilmu bisnes.',
          effects: { smarts: 5, happiness: 9, health: -3 },
          moneyUsd: 850
        },
        {
          label: 'Bantu beri nasihat secara percuma sahaja',
          hint: 'Selamat & mesra',
          outcome: 'Rakan anda menghargai pandangan anda dan belanja makan malam sedap!',
          effects: { happiness: 6, smarts: 2 }
        }
      ]
    },
    {
      id: 'uni_fitness_kick',
      minAge: 20, maxAge: 68,
      icon: '🏃',
      title: 'Larian Maraton 10K Bandar',
      text: 'Bandar anda menganjurkan larian pagi 10K merentasi mercu tanda terkenal dengan pingat penamat.',
      choices: [
        {
          label: 'Berlatih bersungguh & habiskan larian 10K',
          hint: 'Kesihatan ++, Penampilan +',
          outcome: 'Melintasi garisan penamat dengan pingat berkilat terasa sungguh membanggakan!',
          effects: { health: 12, looks: 5, happiness: 11 },
          moneyUsd: -30
        },
        {
          label: 'Jadi sukarelawan di stesen minuman',
          hint: 'Mesra komuniti',
          outcome: 'Memberi sorakan kepada pelari pada waktu pagi mengisi hari anda dengan aura positif.',
          effects: { happiness: 9, health: 3 }
        }
      ]
    },
    {
      id: 'uni_windfall',
      minAge: 18, maxAge: 85,
      icon: '🎁',
      title: 'Rezeki Bonus Tidak Disangka',
      text: 'Lebihan pulangan cukai dan dividen lama baru sahaja dimasukkan ke dalam akaun bank tempatan anda!',
      choices: [
        {
          label: 'Simpan kesemuanya dalam tabung simpanan',
          hint: 'Tunai ++',
          outcome: 'Melihat baki bank melonjak memberi ketenangan fikiran yang luar biasa.',
          effects: { happiness: 9, smarts: 3 },
          moneyUsd: 1200
        },
        {
          label: 'Belanja keluarga & rakan makan besar',
          hint: 'Gembira ++, Tunai +',
          outcome: 'Anda simpan sebahagian besar dan meraikan orang tersayang dengan jamuan meriah!',
          effects: { happiness: 15 },
          moneyUsd: 750
        }
      ]
    },
    {
      id: 'uni_health_check',
      minAge: 32, maxAge: 85,
      icon: '🩺',
      title: 'Peringatan Pemeriksaan Kesihatan Tahunan',
      text: 'Anda terasa agak letih kebelakangan ini. Pemeriksaan kesihatan berkala boleh mengesan masalah lebih awal.',
      choices: [
        {
          label: 'Buat pemeriksaan penuh & jaga pemakanan',
          hint: 'Kesihatan ++',
          outcome: 'Keputusan bijak! Menjaga tidur dan vitamin membuatkan badan anda terasa 10 tahun lebih muda.',
          effects: { health: 14, happiness: 6 },
          moneyUsd: -70
        },
        {
          label: 'Minum teh herba dan abaikan sahaja',
          hint: 'Berisiko',
          outcome: 'Anda meneruskan rutin biasa, tetapi rasa lesu masih berlarutan.',
          effects: { health: -6, happiness: -2 }
        }
      ]
    },
    {
      id: 'uni_senior_wisdom',
      minAge: 62, maxAge: 100,
      icon: '📖',
      title: 'Berkongsi Kisah Hidup Dengan Generasi Muda',
      text: 'Anak cucu berkumpul di sekeliling anda, teruja mendengar kisah pengembaraan anda merentasi dekad dan negara.',
      choices: [
        {
          label: 'Tulis catatan memori & kongsi resipi kegemaran',
          hint: 'Gembira ++, Pintar +',
          outcome: 'Kisah hidup anda memberi inspirasi kepada generasi baru untuk berani bermimpi besar!',
          effects: { happiness: 16, smarts: 5 }
        },
        {
          label: 'Bawa semua minum petang bersama kuih-muih',
          hint: 'Kenangan manis',
          outcome: 'Gelak tawa bersama keluarga di meja makan ialah harta yang paling bernilai.',
          effects: { happiness: 14, health: 2 },
          moneyUsd: -60
        }
      ]
    }
  ],

  // --------------------------------------------------------------------------
  // KOLAM PERISTIWA RAWAK TAHUNAN (ANTI-ULANG, 3 PILIHAN RAWAK, TANPA SPOILER)
  // Merangkumi Kanak-kanak (1–12), Remaja (13–17), Dewasa (18–59) & Warga Emas (60+)
  // --------------------------------------------------------------------------
  ageUpRandomPool: [
    // === KANAK-KANAK (1–12) ===
    {
      id: 'rnd_child_lost_money',
      minAge: 5, maxAge: 12,
      icon: '💵',
      title: 'Jumpa Wang Tercicir di Taman Permainan',
      text: 'Ketika bermain buaian di taman, anda ternampak sekeping wang kertas terselit di bawah bangku dan tiada sesiapa kelihatan di sekitar.',
      choices: [
        { label: 'Serahkan kepada pengawal taman atau ibu bapa untuk dicari pemiliknya', tone: 'helpful', outcome: 'Pemilik sebenar akhirnya ditemui dan memuji kejujuran anda di hadapan orang ramai.' },
        { label: 'Biarkan sahaja di tempat itu supaya pemiliknya mudah menjumpainya semula', tone: 'neutral', outcome: 'Anda meneruskan permainan tanpa menyentuh wang itu dan pulang dengan hati tenang.' },
        { label: 'Simpan diam-diam dalam poket untuk beli aiskrim dan mainan', tone: 'risky', outcome: 'Anda berbelanja sakan di kedai berhampiran, namun rasa bersalah tetap menghantui fikiran.', moneyUsd: 10 },
        { label: 'Tanya budak-budak lain di taman jika ada sesiapa kehilangan duit', tone: 'helpful', outcome: 'Seorang kanak-kanak yang hampir menangis bersyukur kerana duit belanjanya ditemui semula.' }
      ]
    },
    {
      id: 'rnd_child_bully_friend',
      minAge: 6, maxAge: 12,
      icon: '🎒',
      title: 'Rakan Sekelas Dibuli di Kantin',
      text: 'Anda ternampak sekumpulan murid lebih besar mengejek dan merampas bekas makanan rakan sekelas anda yang pendiam.',
      choices: [
        { label: 'Tampil mempertahankan rakan dan panggil guru bertugas segera', tone: 'helpful', outcome: 'Guru bertugas tiba tepat pada masanya dan keberanian anda dipuji satu kelas.' },
        { label: 'Pura-pura tidak nampak dan cepat-cepat beredar ke kelas', tone: 'neutral', outcome: 'Anda mengelak daripada terlibat dalam kekecohan, tetapi rakan anda kelihatan kecewa.' },
        { label: 'Tolak pembuli itu dengan kasar hingga tercetus pergaduhan kecil', tone: 'risky', outcome: 'Keadaan menjadi kecoh dan anda turut dipanggil ke bilik guru disiplin untuk memberi penjelasan.' },
        { label: 'Ajak rakan-rakan lain datang beramai-ramai supaya pembuli itu beredar', tone: 'helpful', outcome: 'Pembuli tersebut berundur serta-merta apabila melihat ramai murid berdiri bersama rakan anda.' }
      ]
    },
    {
      id: 'rnd_child_stray_cat',
      minAge: 3, maxAge: 12,
      icon: '🐱',
      title: 'Anak Kucing Sesat Dalam Hujan',
      text: 'Hujan lebat turun pada waktu petang dan seekor anak kucing kecil menggigil kesejukan di tepi longkang hadapan rumah.',
      choices: [
        { label: 'Lap badannya dengan tuala dan berikan sedikit makanan di anjung', tone: 'helpful', outcome: 'Anak kucing itu mengiau manja dan jiran-jiran memuji sikap penyayang anda.' },
        { label: 'Perhatikan dari dalam tingkap dan biarkan ia mencari tempat berteduh sendiri', tone: 'neutral', outcome: 'Hujan reda tidak lama kemudian dan anak kucing itu berjalan pergi ke lorong sebelah.' },
        { label: 'Sorokkan anak kucing itu di dalam bilik tidur tanpa izin ibu bapa', tone: 'risky', outcome: 'Bilik anda bersepah apabila kucing itu melompat di atas meja dan ibu bapa anda terkejut besar.' }
      ]
    },
    {
      id: 'rnd_child_viral_talent',
      minAge: 4, maxAge: 12,
      icon: '📱',
      title: 'Gelagat Lucu Anda Tular di Media Sosial',
      text: 'Seorang saudara merakam aksi spontan anda menari dan menjawab soalan dengan petah di majlis keluarga lalu memuat naiknya ke internet.',
      choices: [
        { label: 'Ucap terima kasih dengan sopan apabila orang ramai menegur anda', tone: 'helpful', outcome: 'Ramai memuji adab anda yang comel dan sopan walaupun mula dikenali ramai.' },
        { label: 'Minta ibu bapa padam video itu kerana anda segan menjadi tumpuan', tone: 'neutral', outcome: 'Video diturunkan secara baik dan kehidupan harian anda kembali seperti biasa.' },
        { label: 'Buat aksi lebih nakal di hadapan kamera supaya lebih ramai ketawa', tone: 'risky', outcome: 'Klip baharu itu menarik perhatian ramai tetapi turut mengundang teguran orang dewasa.' }
      ]
    },
    {
      id: 'rnd_child_toy_dispute',
      minAge: 2, maxAge: 11,
      icon: '🧸',
      title: 'Pertengkaran Rebut Permainan di Rumah Jiran',
      text: 'Ketika berkunjung ke rumah jiran, anak jiran merampas permainan kegemaran yang anda bawa sehingga hampir rosak.',
      choices: [
        { label: 'Ajak bermain bergilir-gilir dengan penuh sabar', tone: 'helpful', outcome: 'Suasana kembali ceria dan ibu bapa jiran memuji kematangan anda berkongsi.' },
        { label: 'Simpan permainan itu dalam beg dan duduk diam di sebelah ibu bapa', tone: 'neutral', outcome: 'Tiada pertengkaran berlaku walaupun anda agak bosan sepanjang kunjungan.' },
        { label: 'Rampas semula dengan kuat hingga budak itu menangis teresak-esak', tone: 'risky', outcome: 'Suasana ruang tamu menjadi tegang seketika dan anda ditegur kerana terlalu kasar.' }
      ]
    },
    {
      id: 'rnd_child_broken_vase',
      minAge: 5, maxAge: 12,
      icon: '🏺',
      title: 'Pasu Hiasan Jiran Pecah Terkena Bola',
      text: 'Tendangan bola anda tersasar masuk ke halaman rumah jiran dan memecahkan sebuah pasu bunga kesayangan mereka.',
      choices: [
        { label: 'Ketuk pintu rumah jiran dan mengaku salah dengan jujur', tone: 'helpful', outcome: 'Jiran anda terharu dengan keberanian anda bercakap benar dan memaafkan anda.' },
        { label: 'Lari cepat-cepat balik ke rumah dan buat-buat tidak tahu', tone: 'risky', outcome: 'Kamera loceng pintu merakam kelibat anda dan berita itu sampai juga ke telinga ibu bapa.' },
        { label: 'Kutip serpihan pasu dengan berhati-hati sebelum memanggil orang dewasa', tone: 'neutral', outcome: 'Anda cuba mengemas seadanya sebelum meminta bantuan orang dewasa menyelesaikan perkara itu.' }
      ]
    },

    // === REMAJA (13–17) ===
    {
      id: 'rnd_teen_viral_video',
      minAge: 13, maxAge: 17,
      icon: '🎬',
      title: 'Video Spontan Anda Meletup Tular!',
      text: 'Klip pendek anda mengulas isu harian remaja tiba-tiba mencecah ratusan ribu tontonan semalaman dengan pelbagai komen positif dan kecaman.',
      choices: [
        { label: 'Balas komen dengan tenang dan kongsi mesej positif kepada penonton', tone: 'helpful', outcome: 'Kematangan anda membalas kritikan membuatkan ramai pengguna media sosial menghormati anda.' },
        { label: 'Tutup ruangan komen dan biarkan trend itu reda sendiri', tone: 'neutral', outcome: 'Anda menjaga ketenangan minda dengan menjauhkan diri daripada drama alam maya.' },
        { label: 'Buat video sindiran pedas membalas kecaman netizen demi tontonan', tone: 'risky', outcome: 'Perang komen semakin hangat — nama anda melonjak naik tetapi tekanan emosi turut meningkat.' },
        { label: 'Gunakan perhatian itu untuk mempromosikan kutipan derma sekolah', tone: 'helpful', outcome: 'Ramai penonton terinspirasi dan menyumbang kepada tabung kebajikan sekolah anda.' }
      ]
    },
    {
      id: 'rnd_teen_skip_school',
      minAge: 13, maxAge: 17,
      icon: '🛵',
      title: 'Rakan Ajak Ponteng & Lepak Lewat Malam',
      text: 'Sekumpulan rakan mengajak anda memanjat pagar sekolah untuk melepak di pusat permainan dan meronda di bandar hingga lewat malam.',
      choices: [
        { label: 'Tolak dengan tegas dan nasihatkan mereka agar tidak ambil risiko', tone: 'helpful', outcome: 'Beberapa rakan mula berfikir semula dan anda kekal fokus di dalam kelas.' },
        { label: 'Beri alasan ada urusan keluarga dan terus pulang ke rumah', tone: 'neutral', outcome: 'Anda berjaya mengelak daripada terjebak tanpa mencetuskan pertelingkahan.' },
        { label: 'Ikut serta demi menjaga hati kawan dan rasa keseronokan sementara', tone: 'risky', outcome: 'Rondaan pihak berkuasa dan pengawas menegur kumpulan anda di pusat bandar!' }
      ]
    },
    {
      id: 'rnd_teen_mall_wallet',
      minAge: 13, maxAge: 17,
      icon: '👛',
      title: 'Jumpa Dompet Tercicir di Pusat Beli-Belah',
      text: 'Anda menjumpai sebuah dompet kulit berisi wang tunai dan kad pengenalan di kerusi medan selera yang sesak.',
      choices: [
        { label: 'Serahkan terus ke kaunter khidmat pelanggan pusat beli-belah', tone: 'helpful', outcome: 'Pemilik dompet menghubungi kaunter tidak lama kemudian dan memuji kejujuran anda.' },
        { label: 'Tinggalkan di atas meja dan maklumkan pekerja pembersihan berdekatan', tone: 'neutral', outcome: 'Pekerja medan selera mengambil alih urusan tersebut sementara anda meneruskan perjalanan.' },
        { label: 'Ambil wang tunai di dalamnya dan tinggalkan dompet kosong di kerusi', tone: 'risky', outcome: 'Tindakan anda dirakam CCTV medan selera sehingga mengundang perhatian pengawal keselamatan!', moneyUsd: 45 }
      ]
    },
    {
      id: 'rnd_teen_group_gossip',
      minAge: 13, maxAge: 17,
      icon: '💬',
      title: 'Gosip Panas Dalam Kumpulan Sembang Sekolah',
      text: 'Seseorang menyebarkan tangkap layar perbualan peribadi seorang pelajar lain dalam kumpulan sembang besar sekolah.',
      choices: [
        { label: 'Tegur kumpulan itu supaya berhenti menyebarkan aib orang lain', tone: 'helpful', outcome: 'Tindakan berani anda menghentikan buli siber tersebut dan dihargai ramai rakan.' },
        { label: 'Senyapkan notifikasi dan jangan beri sebarang komen', tone: 'neutral', outcome: 'Anda kekal berkecuali dan tidak mengheret diri ke dalam pertelagahan pelajar.' },
        { label: 'Tambahkan komen sarkastik yang membuatkan isu semakin kecoh', tone: 'risky', outcome: 'Mesej anda tular ke kumpulan lain dan mencetuskan pertengkaran besar keesokan harinya.' }
      ]
    },
    {
      id: 'rnd_teen_counterfeit_hustle',
      minAge: 14, maxAge: 17,
      icon: '👟',
      title: 'Tawaran Jual Barang Tiruan Untung Cepat',
      text: 'Seorang kenalan menawarkan komisen lumayan jika anda membantu menjual kasut dan jam tangan tiruan kepada rakan sekolah sebagai barang asli.',
      choices: [
        { label: 'Tolak mentah-mentah kerana tidak mahu menipu pembeli', tone: 'helpful', outcome: 'Prinsip jujur anda menyelamatkan anda apabila kenalan itu akhirnya ditahan penguat kuasa.' },
        { label: 'Abaikan mesejnya dan tukar topik perbualan', tone: 'neutral', outcome: 'Anda memilih jalan selamat dan menumpukan masa pada pelajaran serta hobi.' },
        { label: 'Setuju menjual secara rahsia demi mendapatkan duit poket cepat', tone: 'risky', outcome: 'Beberapa pembeli menyedari barang itu palsu dan mengadu kepada pihak sekolah serta polis!', moneyUsd: 90 }
      ]
    },
    {
      id: 'rnd_teen_road_incident',
      minAge: 14, maxAge: 17,
      icon: '🚲',
      title: 'Insiden Basikal & Pejalan Kaki di Taman',
      text: 'Seorang warga emas terjatuh ketika cuba mengelak sekumpulan remaja yang menunggang basikal secara melulu di laluan taman.',
      choices: [
        { label: 'Berhenti segera untuk membantu warga emas itu bangun dan hubungi keluarganya', tone: 'helpful', outcome: 'Orang awam yang menyaksikan kejadian merakam dan memuji tindakan pantas anda.' },
        { label: 'Pastikan ada orang lain membantu sebelum anda meneruskan perjalanan', tone: 'neutral', outcome: 'Beberapa pengunjung taman segera menghampiri mangsa sementara anda berlalu pergi.' },
        { label: 'Pecut meninggalkan kawasan kerana bimbang dituduh terlibat sekali', tone: 'risky', outcome: 'Saksi tempatan menyangka anda sebahagian daripada kumpulan itu dan memarahi anda.' }
      ]
    },

    // === DEWASA (18–59) ===
    {
      id: 'rnd_adult_lost_wallet',
      minAge: 18, maxAge: 59,
      icon: '👛',
      title: 'Dompet Penuh Tunai Tercicir di Stesen Tren',
      text: 'Ketika bergegas pulang dari kerja, anda terjumpa sebuah dompet tebal berisi wang tunai, kad bank dan kad perniagaan di bangku stesen.',
      choices: [
        { label: 'Hubungi nombor pada kad perniagaan dan pulangkan sendiri kepada pemiliknya', tone: 'helpful', outcome: 'Pemilik dompet sangat terharu dan berkongsi kisah kejujuran anda di media sosial!' },
        { label: 'Serahkan kepada pegawai stesen bertugas dan beredar', tone: 'neutral', outcome: 'Pegawai stesen merekodkan penyerahan tersebut sementara anda sempat menaiki tren seterusnya.' },
        { label: 'Ambil wang tunai di dalamnya dan buang dompet ke dalam tong sampah', tone: 'risky', outcome: 'Kamera keselamatan stesen merakam tindakan anda dan laporan polis dibuat oleh pemiliknya!', moneyUsd: 180 },
        { label: 'Muat naik gambar hadapan dompet (tanpa info peribadi) di media sosial untuk cari pemilik', tone: 'helpful', outcome: 'Hantaran anda dikongsi ribuan orang sehingga pemilik sebenar berjaya menuntutnya.' }
      ]
    },
    {
      id: 'rnd_adult_parking_fight',
      minAge: 18, maxAge: 59,
      icon: '🚗',
      title: 'Pertengkaran Awam Rebut Petak Parkir',
      text: 'Seorang pemandu memotong barisan dan merampas petak letak kereta yang sudah lama anda tunggu sambil menjerit dengan biadab.',
      choices: [
        { label: 'Tarik nafas dalam, senyum tenang dan cari petak parkir lain', tone: 'helpful', outcome: 'Ketenangan anda meredakan suasana dan penumpang lain memuji kesabaran anda.' },
        { label: 'Beritahu pengawal keselamatan kawasan dan biarkan mereka uruskan', tone: 'neutral', outcome: 'Pengawal keselamatan menegur pemandu tersebut sementara anda teruskan urusan anda.' },
        { label: 'Bersemuka, meninggikan suara dan halang keretanya hingga orang merakam', tone: 'risky', outcome: 'Video pertengkaran anda tular di internet dan polis peronda datang meleraikan keadaan!' }
      ]
    },
    {
      id: 'rnd_adult_traffic_incident',
      minAge: 18, maxAge: 59,
      icon: '🚦',
      title: 'Insiden Trafik & Pelanggaran Kecil di Jalan Raya',
      text: 'Dalam kesesakan waktu puncak, sebuah kereta menghimpit laluan anda secara berbahaya sehingga cermin sisi bergesel.',
      choices: [
        { label: 'Berhenti di bahu jalan dengan tenang dan selesaikan laporan secara profesional', tone: 'helpful', outcome: 'Urusan tuntutan berjalan lancar tanpa pergaduhan dan saksi memuji sikap matang anda.' },
        { label: 'Catat nombor plat sahaja dan buat laporan dalam talian kemudian', tone: 'neutral', outcome: 'Anda mengelak kesesakan bertambah teruk dan meneruskan perjalanan ke destinasi.' },
        { label: 'Kejar kereta tersebut secara agresif sambil membunyikan hon tanpa henti', tone: 'risky', outcome: 'Pemanduan berbahaya anda menarik perhatian polis trafik yang sedang meronda!' }
      ]
    },
    {
      id: 'rnd_adult_shady_shortcut',
      minAge: 18, maxAge: 59,
      icon: '💼',
      title: 'Tawaran Jalan Pintas Mencurigakan',
      text: 'Seorang kenalan lama membisikkan "peluang dalaman" untuk meluluskan dokumen dan projek cepat dengan komisen tunai di bawah meja.',
      choices: [
        { label: 'Tolak tegas dan ingatkan beliau tentang akibat undang-undang', tone: 'helpful', outcome: 'Ketegasan integriti anda dihormati rakan industri apabila skim itu akhirnya dibongkar.' },
        { label: 'Beri alasan sibuk dan jarakkan diri daripadanya', tone: 'neutral', outcome: 'Anda berjaya mengelak masalah tanpa menimbulkan permusuhan terbuka.' },
        { label: 'Terima tawaran itu secara senyap demi keuntungan segera', tone: 'risky', outcome: 'Wang masuk dengan cepat, tetapi transaksi mencurigakan itu mula menarik perhatian penguat kuasa!', moneyUsd: 650 }
      ]
    },
    {
      id: 'rnd_adult_office_gossip',
      minAge: 18, maxAge: 59,
      icon: '🗣️',
      title: 'Gosip Panas & Fitnah di Tempat Kerja / Kejiranan',
      text: 'Khabar angin tidak berasas mengenai seorang rakan sekerja atau jiran tersebar luas dan orang ramai mula bertanya pendapat anda.',
      choices: [
        { label: 'Perbetulkan fakta secara berhemah dan pertahankan mangsa fitnah', tone: 'helpful', outcome: 'Pendirian adil anda mematikan gosip itu dan menaikkan rasa hormat orang sekeliling.' },
        { label: 'Katakan anda tidak tahu menahu dan tukar topik perbualan', tone: 'neutral', outcome: 'Anda kekal profesional dan tidak terheret dalam politik murahan.' },
        { label: 'Tokok tambah cerita supaya perbualan semakin hangat', tone: 'risky', outcome: 'Cerita itu berpatah balik kepada anda dan mencetuskan konfrontasi memalukan!' }
      ]
    },
    {
      id: 'rnd_adult_help_stranger',
      minAge: 18, maxAge: 59,
      icon: '🌧️',
      title: 'Bantu Pemandu Kereta Rosak Dalam Hujan',
      text: 'Sebuah keluarga terkandas di tepi jalan dengan tayar pancit ketika hujan mulai turun lebat dan hari semakin gelap.',
      choices: [
        { label: 'Berhenti bantu tukarkan tayar dan lindungi mereka dengan payung', tone: 'helpful', outcome: 'Keluarga itu amat bersyukur dan ucapan terima kasih mereka menceriakan hati anda sepanjang minggu.' },
        { label: 'Hubungi talian bantuan lebuh raya bagi pihak mereka sebelum beredar', tone: 'neutral', outcome: 'Bantuan tunda dihantar ke lokasi dan anda sempat pulang sebelum hujan makin lebat.' },
        { label: 'Rakam situasi mereka untuk dijadikan konten media sosial tanpa membantu', tone: 'risky', outcome: 'Netizen mengecam tindakan anda yang tidak berempati sehingga anda dikritik hebat!' }
      ]
    },
    {
      id: 'rnd_adult_viral_comment',
      minAge: 18, maxAge: 59,
      icon: '🔥',
      title: 'Hantaran Media Sosial Anda Tular Mengejut',
      text: 'Komen spontan anda mengenai isu kos sara hidup dan kualiti perkhidmatan awam tiba-tiba dikongsi puluhan ribu pengguna dan dipetik portal berita!',
      choices: [
        { label: 'Susuli dengan cadangan membina yang sopan dan berfakta', tone: 'helpful', outcome: 'Ramai memuji pandangan bernas anda dan pengikut anda bertambah mendadak.' },
        { label: 'Matikan notifikasi telefon dan fokus pada kehidupan sebenar', tone: 'neutral', outcome: 'Anda membiarkan perdebatan netizen berlalu tanpa menambah tekanan diri.' },
        { label: 'Berbalas hujah kasar dengan pengkritik sehingga lewat malam', tone: 'risky', outcome: 'Perdebatan bertukar toksik, emosi anda terganggu dan nama anda tular kerana kontroversi!' }
      ]
    },
    {
      id: 'rnd_adult_neighbor_row',
      minAge: 18, maxAge: 59,
      icon: '🏘️',
      title: 'Kekecohan Jiran Tengah Malam',
      text: 'Pada pukul 1 pagi, bunyi muzik terlalu kuat dan pertengkaran dari rumah jiran mengganggu tidur seluruh kawasan perumahan.',
      choices: [
        { label: 'Pergi menegur dengan sopan agar mereka memperlahankan bunyi', tone: 'helpful', outcome: 'Jiran anda memohon maaf dan memperlahankan muzik; penduduk lain berterima kasih kepada anda.' },
        { label: 'Pasang penyumbat telinga dan cuba sambung tidur', tone: 'neutral', outcome: 'Anda mengelak pertelingkahan walaupun tidur anda agak terganggu malam itu.' },
        { label: 'Balas dengan memasang bunyi bising lebih kuat hingga polis dipanggil', tone: 'risky', outcome: 'Kereta peronda polis tiba di jalan perumahan dan kedua-dua pihak diberi amaran keras!' }
      ]
    },

    // === WARGA EMAS (60+) ===
    {
      id: 'rnd_senior_scam_call',
      minAge: 60, maxAge: 115,
      icon: '📞',
      title: 'Panggilan Mencurigakan Menyamar Pegawai',
      text: 'Anda menerima panggilan telefon daripada individu yang mendakwa pegawai mahkamah dan mengugut akaun bank anda akan dibekukan jika tidak membuat pindahan segera.',
      choices: [
        { label: 'Tamatkan panggilan segera dan buat laporan polis serta beri amaran kepada jiran', tone: 'helpful', outcome: 'Tindakan pantas anda menyelamatkan beberapa warga emas lain daripada terpedaya sindiket!' },
        { label: 'Letak telefon dan sekat nombor tersebut tanpa panik', tone: 'neutral', outcome: 'Anda kekal tenang dan menyambung minum petang tanpa sebarang kerugian.' },
        { label: 'Layan panggilan dan hampir mendedahkan maklumat peribadi kerana cemas', tone: 'risky', outcome: 'Anda tersedar di saat akhir tetapi pengalaman cemas itu amat meletihkan fikiran anda.' }
      ]
    },
    {
      id: 'rnd_senior_lost_youth',
      minAge: 60, maxAge: 115,
      icon: '🧭',
      title: 'Bantu Pengunjung Sesat di Kawasan Kejiranan',
      text: 'Seorang pelancong muda kelihatan kebingungan di simpang jalan dengan bateri telefonnya yang sudah habis.',
      choices: [
        { label: 'Tunjukkan arah dengan mesra dan tumpangkan mengecas telefon sekejap', tone: 'helpful', outcome: 'Pelancong itu memuji kemurahan hati anda dan berkongsi kisah manis tentang kejiranan anda.' },
        { label: 'Beritahu arah ke balai polis atau stesen berdekatan secara ringkas', tone: 'neutral', outcome: 'Beliau mengucapkan terima kasih dan terus berjalan menuju ke stesen utama.' },
        { label: 'Halau dengan rasa curiga kerana bimbang beliau berniat buruk', tone: 'risky', outcome: 'Suasana menjadi janggal dan beberapa jiran memandang anda dengan hairan.' }
      ]
    },
    {
      id: 'rnd_senior_local_news',
      minAge: 60, maxAge: 115,
      icon: '📰',
      title: 'Wartawan Tempatan Merakam Kisah Hidup Anda',
      text: 'Seorang wartawan komuniti tertarik dengan pengalaman hidup anda yang penuh warna dan meminta temu bual singkat di kedai kopi.',
      choices: [
        { label: 'Kongsi nasihat hidup yang merendah diri dan penuh hikmah', tone: 'helpful', outcome: 'Video temu bual anda tular dan menginspirasikan ribuan anak muda seluruh negara!' },
        { label: 'Tolak secara sopan kerana lebih selesa hidup secara peribadi', tone: 'neutral', outcome: 'Wartawan itu menghormati privasi anda dan anda menikmati kopi petang dengan tenang.' },
        { label: 'Kritik keras generasi muda dan pihak berkuasa di hadapan kamera', tone: 'risky', outcome: 'Kenyataan pedas anda mencetuskan perdebatan hangat di ruangan komen berita!' }
      ]
    },
    {
      id: 'rnd_senior_fence_dispute',
      minAge: 60, maxAge: 115,
      icon: '🏡',
      title: 'Pertikaian Sempadan Pagar Dengan Jiran Baharu',
      text: 'Jiran baharu yang sedang mengubah suai rumah meletakkan bahan binaan hingga menghalang sebahagian laluan masuk rumah anda.',
      choices: [
        { label: 'Berbincang secara baik sambil menghulurkan kuih sebagai tanda mesra', tone: 'helpful', outcome: 'Jiran anda memohon maaf dan segera mengalihkan bahan binaan — hubungan kejiranan jadi akrab.' },
        { label: 'Laporkan secara rasmi melalui pihak pengurusan taman tanpa bersemuka', tone: 'neutral', outcome: 'Pihak pengurusan menyelesaikan isu itu dalam beberapa hari tanpa pertengkaran.' },
        { label: 'Baling semula bahan binaan itu ke halaman mereka dalam keadaan marah', tone: 'risky', outcome: 'Pertengkaran besar tercetus di depan rumah sehingga pihak berkuasa tempatan terpaksa campur tangan!' }
      ]
    },
    {
      id: 'rnd_child_exam_cheat',
      minAge: 7, maxAge: 12,
      icon: '📝',
      title: 'Ujian Mengejut & Nota Tiruan di Kelas',
      text: 'Guru mengumumkan kuiz mengejut hari ini. Rakan sebelah menghulurkan kertas jawapan tiruan di bawah meja sementara guru sedang menulis di papan putih.',
      choices: [
        { label: 'Tolak kertas tiruan itu dan jawab sendiri berdasarkan apa yang dipelajari', tone: 'helpful', outcome: 'Walaupun sukar, anda berjaya menjawab dengan jujur dan semakin faham topik pelajaran.' },
        { label: 'Tiru bulat-bulat jawapan rakan tanpa faham satu pun soalan', tone: 'risky', outcome: 'Anda langsung tidak belajar apa-apa dan guru mula mengesyaki jawapan anda yang pelik!' },
        { label: 'Sembunyikan kertas soalan dan pura-pura sakit perut untuk ponteng kelas', tone: 'risky', outcome: 'Taktik anda terbongkar di bilik sakit dan anda ditegur keras oleh guru disiplin.' },
        { label: 'Minta izin guru untuk ulang kaji 5 minit sebelum kuiz bermula', tone: 'neutral', outcome: 'Guru membenarkan semakan ringkas dan anda menjawab kuiz dengan tenang.' }
      ]
    },
    {
      id: 'rnd_teen_vandal_challenge',
      minAge: 13, maxAge: 17,
      icon: '🎨',
      title: 'Cabaran Tular Conteng Dinding & Berita Palsu',
      text: 'Sekumpulan remaja mencabar anda menyertai trend media sosial menyembur cat di hentian bas dan menyebarkan khabar angin palsu tentang sekolah demi tontonan.',
      choices: [
        { label: 'Tolak cabaran bodoh itu dan fokus menyiapkan projek kelas', tone: 'helpful', outcome: 'Anda mengelak masalah besar dan hasil projek anda dipuji guru serta rakan.' },
        { label: 'Sertai menconteng hentian bas sambil merakam siaran langsung', tone: 'risky', outcome: 'Video anda tular dengan kecaman hebat netizen dan peronda polis tiba di lokasi!' },
        { label: 'Sebarkan gosip palsu mengenai guru di media sosial demi perhatian', tone: 'risky', outcome: 'Fitnah anda terbongkar — reputasi anda merudum teruk dan pihak sekolah memanggil polis!' },
        { label: 'Laporkan rancangan vandalisme itu secara tanpa nama kepada pengawal', tone: 'neutral', outcome: 'Hentian bas berjaya diselamatkan daripada kerosakan tanpa anda terlibat secara langsung.' }
      ]
    },
    {
      id: 'rnd_adult_scam_hoax',
      minAge: 18, maxAge: 59,
      icon: '📲',
      title: 'Skim Cepat Kaya & Kontroversi Siaran Langsung',
      text: 'Seorang pempengaruh kontroversi mengajak anda mempromosikan skim pelaburan meragukan serta membuat kenyataan provokatif secara langsung demi trafik pantas.',
      choices: [
        { label: 'Semak fakta secara teliti dan dedahkan skim itu sebagai penipuan', tone: 'helpful', outcome: 'Pendedahan berfakta anda menyelamatkan ramai orang dan menaikkan kredibiliti anda.' },
        { label: 'Promosikan skim palsu itu secara membuta tuli demi komisen segera', tone: 'risky', outcome: 'Ramai mangsa kerugian, nama anda diboikot habis-habisan dan polis membuka kertas siasatan!', moneyUsd: 350 },
        { label: 'Mengamuk dan menghina penonton secara langsung apabila dikritik', tone: 'risky', outcome: 'Klip baran anda tular ke seluruh negara — populariti menjunam dan anda dicemuh ramai!' },
        { label: 'Tolak pelawaan tersebut secara sopan dan teruskan rutin kerja anda', tone: 'neutral', outcome: 'Anda memilih ketenangan dan menjauhkan diri daripada kontroversi murahan.' }
      ]
    },
    {
      id: 'rnd_senior_fake_remedy',
      minAge: 60, maxAge: 115,
      icon: '🧪',
      title: 'Sebaran Petua Kesihatan Palsu di Kumpulan Komuniti',
      text: 'Mesej berantai mengenai ubat mujarab tidak berdaftar tersebar luas dalam kumpulan sembang kejiranan dan ada yang mengajak anda menjualnya bersama.',
      choices: [
        { label: 'Rujuk doktor dahulu dan kongsikan fakta kesihatan sebenar kepada jiran', tone: 'helpful', outcome: 'Nasihat bijak anda mengelakkan jiran-jiran daripada membahayakan kesihatan mereka.' },
        { label: 'Percaya bulat-bulat dan jual ubat haram itu kepada jiran tanpa lesen', tone: 'risky', outcome: 'Beberapa pembeli jatuh sakit, jiran marah besar dan penguat kuasa datang menyiasat!', moneyUsd: 120 },
        { label: 'Sebarkan mesej palsu itu ke semua kumpulan sembang sambil memperlekeh doktor', tone: 'risky', outcome: 'Kenyataan melulu anda dikritik ramai ahli komuniti dan merosakkan nama baik anda.' },
        { label: 'Padam mesej berantai itu dan tidak mengulas apa-apa', tone: 'neutral', outcome: 'Anda kekal tenang dan mengelak daripada terlibat dalam perdebatan kumpulan sembang.' }
      ]
    }
  ]
};

// 28 Variasi Popup Pilihan Baharu (Anti-Ulangan & Slot Konteks Dinamik)
if (window.GAME_EVENTS && Array.isArray(GAME_EVENTS.ageUpRandomPool)) {
  GAME_EVENTS.ageUpRandomPool.push(
    // --- KANAK-KANAK & REMAJA / SEKOLAH (7) ---
    { id: 'pop_sch_arcade', minAge: 9, maxAge: 17, icon: '🕹️', title: 'Ajakan Ponteng ke Arked', text: '{rakan} mengajak anda ponteng kelas petang ini untuk mencuba mesin permainan baharu di pusat beli-belah.', choices: [
      { label: 'Tolak dan kekal di kelas', effects: { smarts: 3, happiness: -1 }, outcome: 'Anda memilih untuk menyiapkan nota kelas; guru memuji disiplin anda.' },
      { label: 'Ikut senyap-senyap untuk sejam', effects: { happiness: 5, smarts: -2 }, outcome: 'Anda berseronok di arked bersama {rakan}, namun terpaksa mengejar semula pelajaran esoknya.' }
    ]},
    { id: 'pop_sch_group', minAge: 10, maxAge: 17, icon: '📑', title: 'Projek Kumpulan Bermasalah', text: 'Tarikh akhir projek berkumpulan tinggal dua hari, tetapi ahli kumpulan lain masih belum menghantar bahagian mereka.', choices: [
      { label: 'Siapkan keseluruhan tugasan sendiri', effects: { smarts: 4, health: -2, happiness: -2 }, outcome: 'Pembentangan berjalan lancar dan markah anda cemerlang walaupun keletihan.' },
      { label: 'Laporkan secara jujur kepada guru', effects: { smarts: 2, happiness: 1 }, outcome: 'Guru membahagikan penilaian secara individu supaya usaha anda tidak sia-sia.' }
    ]},
    { id: 'pop_sch_wallet', minAge: 7, maxAge: 17, icon: '👛', title: 'Dompet Tercicir di Kantin', text: 'Anda terjumpa sebuah dompet berisi wang tunai di bawah meja kantin sekolah ketika waktu rehat.', choices: [
      { label: 'Serahkan terus ke pejabat sekolah', effects: { happiness: 4, karma: 6 }, outcome: 'Pemilik dompet itu amat lega dan berterima kasih atas kejujuran anda.' },
      { label: 'Ambil wang dan tinggalkan dompet', effects: { moneyUsd: 25, karma: -8 }, outcome: 'Anda menyimpan wang tersebut, namun rasa bersalah menghantui fikiran anda.' }
    ]},
    { id: 'pop_sch_quiz', minAge: 10, maxAge: 17, icon: '🧠', title: 'Wakil Kuiz Saat Akhir', text: 'Wakil sekolah untuk pertandingan kuiz antara daerah demam mengejut. Cikgu meminta anda menggantikannya esok.', choices: [
      { label: 'Terima cabaran dan ulang kaji malam ini', effects: { smarts: 5, happiness: 3 }, outcome: 'Anda tampil berani di pentas kuiz dan mengharumkan nama sekolah!' },
      { label: 'Tolak secara sopan kerana tidak bersedia', effects: { happiness: 1 }, outcome: 'Cikgu memahami dan mencari peserta simpanan lain.' }
    ]},
    { id: 'pop_sch_snack', minAge: 11, maxAge: 17, icon: '🍪', title: 'Perniagaan Snek Kecil-Kecilan', text: '{rakan} mencadangkan untuk menjual biskut buatan sendiri kepada rakan sekelas pada waktu rehat.', choices: [
      { label: 'Sertai sebagai rakan kongsi', effects: { moneyUsd: 45, smarts: 2, happiness: 3 }, outcome: 'Jualan habis dalam dua hari! Anda belajar asas untung rugi sejak muda.' },
      { label: 'Fokus pada pelajaran sahaja', effects: { smarts: 2 }, outcome: 'Anda memilih untuk tidak mengambil risiko melanggar peraturan sekolah.' }
    ]},
    { id: 'pop_sch_library', minAge: 8, maxAge: 17, icon: '📚', title: 'Buku Misteri di Perpustakaan', text: 'Anda terjumpa buku lama yang jarang dipinjam tentang sejarah tokoh hebat di {negara}.', choices: [
      { label: 'Pinjam dan baca sehingga habis', effects: { smarts: 4, happiness: 2 }, outcome: 'Bacaan itu membuka perspektif baharu tentang cita-cita masa depan anda.' },
      { label: 'Letak semula dan berbual dengan kawan', effects: { happiness: 3 }, outcome: 'Anda menikmati waktu rehat yang santai bersama rakan-rakan.' }
    ]},
    { id: 'pop_sch_sports', minAge: 9, maxAge: 17, icon: '🏃', title: 'Larian Merentas Desa', text: 'Hari sukan sekolah semakin hampir dan pasukan rumah sukan anda kekurangan pelari jarak jauh.', choices: [
      { label: 'Daftar dan berlatih setiap petang', effects: { health: 5, happiness: 3 }, outcome: 'Stamina anda meningkat ketara dan anda berjaya menamatkan larian dengan bangga.' },
      { label: 'Bantu sebagai petugas minuman sahaja', effects: { happiness: 2 }, outcome: 'Anda tetap menyumbang tenaga memastikan acara berjalan lancar.' }
    ]},

    // --- KERJAYA & PEJABAT (8) ---
    { id: 'pop_work_credit', minAge: 18, maxAge: 65, icon: '💼', title: 'Kredit Pembentangan Dicuri', text: 'Dalam mesyuarat pasukan {jawatan}, {rakan} membentangkan idea asal anda seolah-olah hasil kerjanya sendiri.', choices: [
      { label: 'Tunjukkan draf asal secara profesional', effects: { smarts: 3, happiness: 2 }, outcome: 'Pengurus menyedari sumbangan sebenar anda dan memuji ketegasan profesional anda.' },
      { label: 'Berdiam diri demi menjaga suasana', effects: { happiness: -4 }, outcome: 'Anda mengelak konflik, tetapi berasa tidak dihargai sepanjang minggu.' }
    ]},
    { id: 'pop_work_weekend', minAge: 18, maxAge: 65, icon: '🗓️', title: 'Tugasan Kecemasan Hujung Minggu', text: 'Pengurus meminta anda menyiapkan laporan kecemasan pada hari Sabtu untuk klien penting di {negara}.', choices: [
      { label: 'Siapkan dengan cemerlang', effects: { moneyUsd: 350, health: -3, happiness: -2 }, outcome: 'Klien berpuas hati dan pihak pengurusan memberikan elaun penghargaan.' },
      { label: 'Maklumkan anda sudah ada komitmen peribadi', effects: { happiness: 3, health: 2 }, outcome: 'Anda menjaga keseimbangan hidup dan kembali bertenaga pada hari Isnin.' }
    ]},
    { id: 'pop_work_sideproj', minAge: 18, maxAge: 65, icon: '💻', title: 'Tawaran Projek Sampingan', text: 'Seorang kenalan industri di {negara} menawarkan projek perundingan ringkas berkaitan {jawatan} pada waktu malam.', choices: [
      { label: 'Terima projek sampingan ini', effects: { moneyUsd: 600, smarts: 2, health: -2 }, outcome: 'Projek selesai tepat pada masanya dan menambah simpanan tunai anda.' },
      { label: 'Tolak untuk menjaga kesihatan diri', effects: { health: 3, happiness: 2 }, outcome: 'Anda mendapat rehat berkualiti tanpa tekanan tambahan.' }
    ]},
    { id: 'pop_work_gossip', minAge: 18, maxAge: 65, icon: '🗣️', title: 'Gosip Penstrukturan Syarikat', text: 'Khabar angin tersebar di ruang pantri bahawa beberapa jabatan bakal digabungkan hujung suku ini.', choices: [
      { label: 'Kemas kini kemahiran dan fokus prestasi', effects: { smarts: 3, happiness: 1 }, outcome: 'Persediaan rapi membuatkan kedudukan anda kekal kukuh.' },
      { label: 'Ikut berbual dan mengumpul cerita', effects: { happiness: -2 }, outcome: 'Perbualan panjang hanya menambah keresahan tanpa kepastian.' }
    ]},
    { id: 'pop_work_clash', minAge: 18, maxAge: 65, icon: '⏰', title: 'Pertembungan Jadual Penting', text: 'Mesyuarat strategi {jawatan} bertembung dengan janji temu peribadi yang sudah lama dirancang.', choices: [
      { label: 'Utamakan mesyuarat kerja', effects: { smarts: 2, happiness: -3 }, outcome: 'Kehadiran anda dihargai pasukan, namun anda perlu memujuk semula kenalan anda.' },
      { label: 'Hantar wakil dan hadir hal peribadi', effects: { happiness: 4 }, outcome: 'Urusan peribadi selesai dengan baik dan wakil anda menyampaikan nota dengan kemas.' }
    ]},
    { id: 'pop_work_mentor', minAge: 18, maxAge: 65, icon: '🧭', title: 'Pelawaan Sesi Mentor', text: 'Seorang tokoh berpengalaman dalam {jawatan} menawarkan sesi bimbingan kerjaya di {tempat}.', choices: [
      { label: 'Hadir dan catat setiap nasihat', effects: { smarts: 4, happiness: 3 }, outcome: 'Pandangan tajam beliau memberi arah jelas untuk langkah kerjaya seterusnya.' },
      { label: 'Tangguhkan ke masa lain', effects: { happiness: 1 }, outcome: 'Anda terlepas peluang berharga itu buat sementara waktu.' }
    ]},
    { id: 'pop_work_coffee', minAge: 18, maxAge: 65, icon: '☕', title: 'Rehat Kopi Bersama Rakan Sekerja', text: '{rakan} mengajak anda berehat sebentar di {tempat} selepas minggu kerja yang padat.', choices: [
      { label: 'Sertai dan belanja kopi', effects: { moneyUsd: -25, happiness: 5 }, outcome: 'Perbualan santai meredakan tekanan dan mengeratkan hubungan kerja.' },
      { label: 'Makan di meja kerja sahaja', effects: { smarts: 1, happiness: -1 }, outcome: 'Kerja siap sedikit awal tetapi hari terasa agak hambar.' }
    ]},
    { id: 'pop_work_error', minAge: 18, maxAge: 65, icon: '🔍', title: 'Kesilapan Kecil Dalam Laporan', text: 'Anda menyedari kesilapan angka kecil dalam laporan yang sudah dihantar pagi tadi.', choices: [
      { label: 'Hantar pembetulan segera secara telus', effects: { smarts: 2, karma: 4 }, outcome: 'Pihak atasan menghargai ketelusan anda sebelum angka itu digunakan.' },
      { label: 'Biarkan sahaja dengan harapan tidak disedari', effects: { happiness: -3, karma: -3 }, outcome: 'Anda gelisah sepanjang minggu memikirkan kemungkinan ia terbongkar.' }
    ]},

    // --- KEWANGAN & GAYA HIDUP (7) ---
    { id: 'pop_fin_scheme', minAge: 18, maxAge: 80, icon: '📉', title: 'Skim Pelaburan "Pasti Untung"', text: 'Kenalan lama menghubungi anda dan mempromosikan skim pelaburan luar biasa yang kononnya menggandakan wang dalam sebulan.', choices: [
      { label: 'Tolak tegas kerana kelihatan mencurigakan', effects: { smarts: 3, happiness: 2 }, outcome: 'Beberapa bulan kemudian, skim itu runtuh! Anda terselamat daripada kerugian besar.' },
      { label: 'Cuba masukkan sedikit modal', effects: { moneyUsd: -400, happiness: -5 }, outcome: 'Penganjur gagal dihubungi selepas sebulan — pengajaran mahal tentang disiplin kewangan.' }
    ]},
    { id: 'pop_fin_flashsale', minAge: 18, maxAge: 80, icon: '🏷️', title: 'Lelongan Kilat Barangan Terpakai', text: 'Satu jualan lelongan kilat barangan koleksi dan perabot berkualiti berlangsung di {tempat}.', choices: [
      { label: 'Beli barang berguna pada harga rendah', effects: { moneyUsd: -120, happiness: 5 }, outcome: 'Anda berjaya mendapatkan barangan berkualiti tinggi pada harga berbaloi.' },
      { label: 'Tinjau sahaja tanpa berbelanja', effects: { smarts: 1, happiness: 1 }, outcome: 'Anda berjaya mengawal bajet bulanan dengan berhemah.' }
    ]},
    { id: 'pop_fin_neighbor', minAge: 18, maxAge: 80, icon: '🤝', title: 'Jiran Memohon Bantuan Kecemasan', text: 'Jiran anda mengetuk pintu dan meminta pinjaman kecil kerana keretanya rosak di tepi jalan.', choices: [
      { label: 'Bantu sekadar termampu', effects: { moneyUsd: -150, karma: 6, happiness: 3 }, outcome: 'Jiran anda amat terharu dan hubungan kejiranan menjadi semakin erat.' },
      { label: 'Tolak dengan sopan kerana bajet ketat', effects: { happiness: -1 }, outcome: 'Jiran anda memahami keadaan anda dan mencari bantuan lain.' }
    ]},
    { id: 'pop_fin_gear', minAge: 18, maxAge: 80, icon: '⚙️', title: 'Peralatan Terpakai Berkualiti Tinggi', text: 'Seorang profesional di {negara} menjual peralatan kerja premium terpakai pada harga diskaun besar.', choices: [
      { label: 'Beli untuk tingkatkan produktiviti', effects: { moneyUsd: -280, smarts: 3, happiness: 3 }, outcome: 'Peralatan itu masih seperti baharu dan mempercepatkan tugasan harian anda.' },
      { label: 'Kekalkan peralatan sedia ada', effects: { happiness: 1 }, outcome: 'Simpanan tunai anda kekal terpelihara.' }
    ]},
    { id: 'pop_fin_gala', minAge: 20, maxAge: 80, icon: '🥂', title: 'Majlis Rangkaian Eksklusif', text: 'Anda menerima jemputan ke majlis rangkaian usahawan dan pelabur di {negara}.', choices: [
      { label: 'Hadir dan luaskan kenalan', effects: { moneyUsd: -180, smarts: 3, happiness: 4 }, outcome: 'Anda bertukar kad perniagaan dengan beberapa tokoh berpengaruh.' },
      { label: 'Rehat di rumah sahaja', effects: { health: 2, happiness: 2 }, outcome: 'Malam yang tenang tanpa perlu berbelanja untuk majlis formal.' }
    ]},
    { id: 'pop_fin_budget', minAge: 18, maxAge: 80, icon: '📊', title: 'Semakan Langganan Bulanan', text: 'Anda menyemak penyata bank dan mendapati beberapa langganan digital yang jarang digunakan masih aktif.', choices: [
      { label: 'Batalkan semua langganan tidak perlu', effects: { moneyUsd: 180, smarts: 2 }, outcome: 'Aliran tunai tahunan anda menjadi jauh lebih kemas.' },
      { label: 'Biarkan dahulu sehingga hujung tahun', effects: { moneyUsd: -90 }, outcome: 'Caj kecil terus ditolak secara senyap setiap bulan.' }
    ]},
    { id: 'pop_fin_cafe', minAge: 18, maxAge: 80, icon: '🍽️', title: 'Makan Malam Bersama Kenalan Lama', text: '{rakan} mengajak anda mencuba restoran baharu yang terkenal di {tempat}.', choices: [
      { label: 'Hadir dan nikmati hidangan', effects: { moneyUsd: -95, happiness: 5 }, outcome: 'Hidangan yang enak dan gelak tawa mengembalikan semangat anda.' },
      { label: 'Cadangkan tempat yang lebih jimat', effects: { moneyUsd: -25, happiness: 3 }, outcome: 'Kalian tetap menikmati perbualan mesra tanpa membazir.' }
    ]},

    // --- SOSIAL & HARIAN RAWAK (6) ---
    { id: 'pop_soc_help', minAge: 14, maxAge: 85, icon: '🤲', title: 'Orang Asing Perlukan Bantuan', text: 'Ketika berada di {tempat}, anda melihat seorang pelancong kelihatan bingung mencari arah stesen utama.', choices: [
      { label: 'Luangkan masa tunjukkan jalan', effects: { karma: 5, happiness: 4 }, outcome: 'Pelancong itu memuji keramahan penduduk {negara} sebelum meneruskan perjalanan.' },
      { label: 'Bergegas meneruskan urusan anda', effects: { happiness: -1 }, outcome: 'Anda sampai awal ke destinasi tetapi terfikir jika mereka berjaya menemui jalan.' }
    ]},
    { id: 'pop_soc_noise', minAge: 18, maxAge: 85, icon: '🔊', title: 'Jiran Bising Lewat Malam', text: 'Muzik kuat kedengaran dari rumah sebelah walaupun jam sudah melepasi tengah malam.', choices: [
      { label: 'Tegur secara baik dan tenang', effects: { happiness: 2, health: 2 }, outcome: 'Jiran anda memohon maaf dan segera memperlahankan bunyi muzik.' },
      { label: 'Pasang penyumbat telinga dan cuba tidur', effects: { health: -2, happiness: -2 }, outcome: 'Tidur anda terganggu sehingga pagi.' }
    ]},
    { id: 'pop_soc_viral', minAge: 14, maxAge: 80, icon: '📱', title: 'Klip Video Tular Secara Tak Sengaja', text: 'Reaksi spontan anda di latar belakang sebuah rakaman jalanan di {tempat} tiba-tiba tular di media sosial.', choices: [
      { label: 'Layankan dengan humor santai', effects: { happiness: 5, fame: 4 }, outcome: 'Netizen menyukai sikap bersahaja anda dan pengikut baharu mula bertambah.' },
      { label: 'Abaikan dan kekalkan privasi', effects: { happiness: 2 }, outcome: 'Tumpuan reda dalam beberapa hari dan hidup kembali tenang.' }
    ]},
    { id: 'pop_soc_volunteer', minAge: 14, maxAge: 85, icon: '🌱', title: 'Acara Sukarelawan Komuniti', text: 'Persatuan penduduk di {negara} menganjurkan gotong-royong membersihkan taman awam hujung minggu ini.', choices: [
      { label: 'Sertai sebagai sukarelawan', effects: { health: 3, karma: 6, happiness: 4 }, outcome: 'Taman kembali bersih dan anda berkenalan dengan ramai jiran mesra.' },
      { label: 'Berehat di rumah hujung minggu ini', effects: { health: 2 }, outcome: 'Anda menikmati hujung minggu yang santai.' }
    ]},
    { id: 'pop_soc_stranger', minAge: 18, maxAge: 85, icon: '💬', title: 'Perbualan Tak Dijangka di {tempat}', text: 'Sementara menunggu hujan reda di {tempat}, anda berbual rancak dengan seorang asing yang rupa-rupanya pengarah industri berpengaruh.', choices: [
      { label: 'Kongsi pandangan bernas tentang {jawatan}', effects: { smarts: 3, happiness: 4 }, outcome: 'Beliau kagum dengan kematangan fikiran anda dan berkongsi nasihat bernilai.' },
      { label: 'Berbual kosong tentang cuaca sahaja', effects: { happiness: 2 }, outcome: 'Masa menunggu berlalu pantas dengan perbualan ringan.' }
    ]},
    { id: 'pop_soc_weather', minAge: 14, maxAge: 85, icon: '🌧️', title: 'Hujan Lebat Mengejut', text: 'Hujan turun mencurah-curah ketika anda berjalan pulang berhampiran {tempat} tanpa membawa payung.', choices: [
      { label: 'Berteduh sambil menikmati minuman panas', effects: { moneyUsd: -15, happiness: 4, health: 1 }, outcome: 'Suasana hujan yang damai memberi ruang untuk anda bertenang.' },
      { label: 'Redah hujan untuk cepat sampai rumah', effects: { health: -3, happiness: 1 }, outcome: 'Anda basah kuyup tetapi sempat sampai sebelum malam.' }
    ]}
  );
}
