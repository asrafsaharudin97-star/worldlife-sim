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
      text: 'Senyuman manis, kuil keemasan dan bau Pad Kra Pao panas menyambut anda di Negara Senyuman!',
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
    {
      id: 'uni_child_talent',
      minAge: 5, maxAge: 11,
      icon: '🎨',
      title: 'Mencungkil Bakat Selepas Sekolah',
      text: 'Guru anda melihat anda sangat aktif selepas kelas dan mencadangkan anda menyertai kelab kokurikulum.',
      choices: [
        {
          label: 'Sertai Kelab Robotik & Pengaturcaraan',
          hint: 'Pintar ++',
          outcome: 'Anda membina robot kecil dan memukau seluruh sekolah!',
          effects: { smarts: 11, happiness: 6 }
        },
        {
          label: 'Sertai Kelab Sukan & Olahraga',
          hint: 'Kesihatan ++, Penampilan +',
          outcome: 'Berlari di padang menjadikan anda lebih cergas, pantas dan popular!',
          effects: { health: 10, looks: 4, happiness: 8 }
        },
        {
          label: 'Sertai Kelas Muzik & Seni Lukis',
          hint: 'Gembira ++',
          outcome: 'Lukisan berwarna-warni anda digantung di koridor utama sekolah!',
          effects: { happiness: 13, smarts: 4 }
        }
      ]
    },
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
  ]
};
