# WorldLife — Simulator Kehidupan & Budaya Global

Game simulasi kehidupan ala BitLife dalam **Bahasa Melayu** yang merangkumi **semua 195 negara berdaulat di dunia** — dengan **Malaysia 🇲🇾** sebagai pengalaman utama, lengkap dengan sistem budaya, ekonomi, dan kerjaya yang mendalam di seluruh dunia.

Bila watak anda **berhijrah ke negara lain**, segalanya akan berubah secara automatik mengikut negara tersebut — daripada mata wang, gaji, cukai, hartanah, kenderaan, dan rawatan kesihatan, sehinggalah ke sistem pendidikan serta laluan imigresen dan kerakyatan!

## Cara Main
1. **Terus Main (Tak perlu pasang apa-apa):** Buka sahaja fail `index.html` menggunakan Chrome, Edge, Firefox, atau Safari.
2. **Server Tempatan (Pilihan):** Jalankan arahan `python3 -m http.server 8000` di dalam folder ini dan buka `http://localhost:8000` di pelayar anda.

## Apa Yang Menarik?
- **Semua 195 Negara Berdaulat:** Mata wang sebenar, tangga cukai, pengganda gaji, taraf kos sara hidup, kualiti kesihatan, format nama tempatan, laluan Visa → PR → Warganegara, dan koleksi Cop Pasport.
- **10 Mod Khas "Peluang Sekali Seumur Hidup" (Tiada Menu Statik):**
  - Ditawarkan secara rawak sekali seumur hidup semasa `+Umur` (termasuk peluang jarang 2–4% untuk **Lahir Sebagai Kerabat Diraja** di negara beraja). Kalau anda tolak atau keluar daripada mod ini, ia akan terkunci terus sepanjang hayat watak tersebut!
  - Merangkumi **Politik & Kepimpinan**, **Usahawan & CEO**, **Jerung Pasaran (Pengurus Dana)**, **Selebriti & Content Creator**, **Atlet Pro & E-Sukan**, **Sindiket & Mafia**, **Pertubuhan Rahsia / Kultus**, **Perisik Rahsia** (lengkap dengan misi sulit di 195 negara & *Burn Notice*), **Kerabat Diraja**, dan **Pengembara & Pemburu Rekod Dunia** (rekod negara unik yang dilawati daripada 195 negara).
  - Papan aksi tahunan tanpa pengulangan, dilema bercabang, dan **Amaran Risiko Keluar** yang realistik (*Wang Cuci Tangan*, *Burn Notice*, *Lucut Gelaran*, Perbicaraan Mahkamah *Insider Trading*, dan lain-lain).
- **Kunci Peranan Ketat & Cari Kerja Yang Betul-Betul Mencabar:**
  - **Wajib Letak Jawatan Dahulu:** Kena berhenti daripada kerja semasa atau Mod Khas dahulu sebelum boleh memohon kerja baharu.
  - **Saringan 2 Peringkat Yang Kompetitif:** Had maksimum 5 permohonan setahun, saringan CV berpemberat (5–85%, tak pernah 100%) lengkap dengan 12 senario HR tolak atau *ghosting* yang cukup realistik, diikuti sesi Temuduga Kerja yang sengit.
- **Pendidikan Sepanjang Hayat (Sampai PhD & Gelaran `Dr.`) & 79 Kerjaya:**
  - Boleh belajar sepenuh masa atau separuh masa dalam 10 bidang sehingga ke peringkat PhD, kumpul 28 sijil profesional mengikut bidang, dan panjat tangga kenaikan pangkat secara dinamik.
- **Enjin Kekayaan 82 Aset:** Hartanah (21), kenderaan (26), pelaburan (15), koleksi & lelongan misteri (20), pinjaman perumahan, trend pasaran, barang pusaka, serta pewarisan harta merentas generasi.
- **Enjin 70 Aktiviti Dinamik & Pertemuan Rawak:** Dek aktiviti tahunan tanpa pengulangan dengan peluang emas yang jarang muncul merentas 7 kategori.
- **Sistem Jenayah, Mahkamah, Penjara & Pelarian Penuh:** Perbicaraan mahkamah interaktif dengan peguam, mini-game lari dari penjara & rusuhan, hijrah haram bawah tanah, pembedahan plastik, dan identiti palsu.
- **Dinasti Merentas Generasi & Sistem Simpanan Selamat:** Sambung legasi melalui pewaris, Reputasi Keluarga, Pencapaian Utama, penyelarasan HUD/Biodata/Pendapatan berpusat (`CharacterStatus`), perlindungan kuota `SafeStorage`, serta eksport/import fail simpanan `.json`.

## Kategori Ekonomi Negara & Kadar Cukai Yayasan
Kesemua **194 negara** dalam WorldLife dibahagikan kepada 4 kategori ekonomi yang menentukan **Yuran Tahunan Yayasan** dan **Cukai Korporat Yayasan** (selain **Cukai Pendapatan Peribadi** di setiap negara):

| Kategori Ekonomi | Bil. Negara | Yuran Tahunan Yayasan | Cukai Korporat Yayasan | Julat Cukai Pendapatan |
| :--- | :---: | :---: | :---: | :---: |
| **Negara Pulau Bebas Cukai** | 21 | 0% | 0% | 0% – 24% |
| **Negara Maju** | 25 | 1.5% | 15% – 25% | 0% – 42% |
| **Negara Membangun** | 39 | 0.5% | 15% – 25% | 0% – 33% |
| **Negara Mundur** | 109 | 0.1% | 15% – 22% | 5% – 22% |

👉 Tengok senarai penuh semua 194 negara (Negara Pulau Bebas Cukai, Negara Maju, Negara Membangun & Negara Mundur) berserta kadar cukai masing-masing di sini: **[SENARAI_NEGARA_CUKAI.md](SENARAI_NEGARA_CUKAI.md)**.

### 21 Negara Pulau Bebas Cukai (0% Yuran & 0% Cukai Korporat Yayasan)

| Kod | Negara | Kod | Negara | Kod | Negara |
| :---: | :--- | :---: | :--- | :---: | :--- |
| `BS` | 🇧🇸 Bahamas | `KN` | 🇰🇳 Saint Kitts & Nevis | `WS` | 🇼🇸 Samoa |
| `BB` | 🇧🇧 Barbados | `LC` | 🇱🇨 Saint Lucia | `TO` | 🇹🇴 Tonga |
| `SC` | 🇸🇨 Seychelles | `GD` | 🇬🇩 Grenada | `TV` | 🇹🇻 Tuvalu |
| `MV` | 🇲🇻 Maldives | `DM` | 🇩🇲 Dominica | `KI` | 🇰🇮 Kiribati |
| `MU` | 🇲🇺 Mauritius | `PW` | 🇵🇼 Palau | `FJ` | 🇫🇯 Fiji |
| `VU` | 🇻🇺 Vanuatu | `MH` | 🇲🇭 Kepulauan Marshall | `MT` | 🇲🇹 Malta |
| `AG` | 🇦🇬 Antigua & Barbuda | `NR` | 🇳🇷 Nauru | `CY` | 🇨🇾 Cyprus |
