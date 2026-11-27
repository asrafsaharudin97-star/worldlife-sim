# WorldLife — Global Cultural Life Simulator

A rich, BitLife-inspired life simulation game in **Bahasa Melayu** spanning **all 195 recognized sovereign countries** — featuring **Malaysia 🇲🇾** as a flagship experience alongside deep cultural, economic, and career mechanics worldwide.

When your character **migrates to another country**, the simulation dynamically adapts currency, salaries, taxes, real estate, vehicles, healthcare, education, and immigration/citizenship progression!

## How to Play
1. **Instant Play (No install required):** Open `index.html` directly in Chrome, Edge, Firefox, or Safari.
2. **Optional Local Server:** Run `python3 -m http.server 8000` inside this folder and visit `http://localhost:8000`.

## Highlights
- **All 195 Sovereign Countries:** Realistic currencies, tax brackets, salary multipliers, cost-of-living tiers, healthcare quality, local naming rules, visa → PR → Citizenship progression, and Passport Stamps.
- **10 "Peluang Sekali Seumur Hidup" Special Modes (No Static Menu):**
  - Randomly offered once per lifetime on Age-Up (plus a rare 2–4% **Birth Royalty** trigger in monarchy countries). Declining or exiting permanently locks that mode for the character's life!
  - Includes **Politik & Kepimpinan**, **Usahawan & CEO**, **Jerung Pasaran (Fund Manager)**, **Selebriti & Content Creator**, **Atlet Pro & E-Sukan**, **Sindiket & Mafia**, **Pertubuhan Rahsia / Kultus**, **Perisik Rahsia** (with 195-country covert missions & *Burn Notice*), **Kerabat Diraja**, and **Pengembara & Pemburu Rekod Dunia** (tracking unique countries out of 195).
  - Anti-repeat yearly action boards, branching dilemmas, and realistic high-stakes **Exit Risk Warnings** (*Wang Cuci Tangan*, *Burn Notice*, *Renounce Title*, *Insider Trading* Court Trials, etc.).
- **Strict Role Lock & Realistic Hard Job Hunting:**
  - **Wajib Letak Jawatan Dahulu:** Must resign from any active job or Special Mode before applying for a new job.
  - **2-Stage Competitive Hiring:** 5 applications/year cap, weighted CV screening (5–85%, never 100%) with 12 relatable HR rejection/ghosting scenarios, followed by competitive Job Interviews.
- **Lifelong Education (Up to PhD & `Dr.` Title) & 79 Careers:**
  - Study full-time or part-time across 10 fields up to PhD, earn 28 field-gated professional certificates, and climb dynamic promotion ladders.
- **82-Asset Wealth Engine:** Real estate (21), vehicles (26), investments (15), collectibles & mystery auctions (20), mortgages, market trends, heirlooms, and multi-generational inheritance.
- **70-Activity Dynamic Engine & Mini-Encounters:** Anti-repeat yearly activity decks with rare golden opportunities across 7 categories.
- **Full Crime, Court Trial, Prison & Fugitive System:** Interactive courtroom trials & lawyers, playable prison escape & riot mini-games, underground illegal emigration, plastic surgery, and fake identities.
- **Multi-Generational Dynasty & Safe Save Performance:** Heir continuation, Family Reputation, Prime Achievements, centralized HUD/Biodata/Income sync (`CharacterStatus`), `SafeStorage` quota protection, and `.json` save export/import.

## Kategori Ekonomi Negara & Kadar Cukai Yayasan
Semua **194 negara** dalam WorldLife dikelaskan kepada 4 kategori ekonomi yang menentukan **Yuran Tahunan Yayasan** dan **Cukai Korporat Yayasan** (selain **Cukai Pendapatan Peribadi** masing-masing):

| Kategori Ekonomi | Bil. Negara | Yuran Tahunan Yayasan | Cukai Korporat Yayasan | Julat Cukai Pendapatan |
| :--- | :---: | :---: | :---: | :---: |
| **Negara Pulau Bebas Cukai** | 21 | 0% | 0% | 0% – 24% |
| **Negara Maju** | 25 | 1.5% | 15% – 25% | 0% – 42% |
| **Negara Membangun** | 39 | 0.5% | 15% – 25% | 0% – 33% |
| **Negara Mundur** | 109 | 0.1% | 15% – 22% | 5% – 22% |

👉 Lihat senarai penuh semua 194 negara (Negara Pulau Bebas Cukai, Negara Maju, Negara Membangun & Negara Mundur) berserta kadar cukai masing-masing dalam **[SENARAI_NEGARA_CUKAI.md](SENARAI_NEGARA_CUKAI.md)**.

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
