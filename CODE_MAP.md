# CODE_MAP.md — Rujukan Pantas Projek WorldLife

## 1. Peraturan Projek (Wajib Patuh)
- **Bahasa & Nada:** Bahasa Melayu moden, santai, semula jadi; **100% bebas unsur agama**.
- **UI Bersih:** DILARANG memaparkan `%` RNG atau nombor ganjaran stat (`+5`, `-10`) pada butang aksi.
- **HUD Muka Depan:** Kekalkan bersih — JANGAN tambah tab, butang, kad, atau ikon baharu pada HUD tanpa arahan.
- **Keserasian & Kualiti:** Kekalkan keserasian *save* lama (tiada `undefined`/`NaN`), wajib jalankan `node --check` pada setiap `.js` yang diubah, dan **DILARANG** menjalankan `git commit` / `git push` kecuali diminta.

---

## 2. Peta Fail & Tanggungjawab

| Fail | Peranan Utama | Fungsi / Objek Penting |
|---|---|---|
| `index.html` | Struktur HUD, modal tunggal, skrip (`?v=...`) | `#char-wealth-box`, `#char-money`, `#modal-overlay`, `#modal-body` |
| `css/styles.css` | Gaya penuh desktop & mudah alih | `.char-wealth`, `.wealth-amount`, `.migration-card`, `.action-item` |
| `js/engine/storage.js` | Lapisan `localStorage` kalis kuota | `SafeStorage` (`getJSON`, `setJSON`, `registerTrimmer`) |
| `js/engine/utils.js` | Utiliti mata wang, RNG, sanitasi, audio | `Utils` (`formatMoney`, `usdToLocal`, `convertMoney`, `chance`, `escapeHtml`) |
| `js/engine/state.js` | State watak, slot simpanan, generasi, aliran tunai | `GameState` (`newCharacter`, `continueAsChild`, `ensureUpgradedState`, `logCashFlow`, `recordCashFlow`, `convertCashFlowCurrency`, `save`) |
| `js/engine/simulation.js` | Enjin `+Umur`, peristiwa, hijrah, imigresen, jenayah | `Sim` (`ageUp`, `_ageUpCore`, `_pickYearlyEvent`, `resolveEventChoice`, `buildBlackmailEvent`, `migrateToCountry`) |
| `js/engine/legalInheritanceEngine.js` | Wasiat, Tabung Yayasan, Proksi Offshore, Pengurus Dana, Audit | `LegalInheritanceEngine`, `FUND_REPORT_WORKER_URL`, `depositFamilyTrust`, `withdrawFamilyTrust`, `bulkTransferToTrust`, `tickFamilyTrust` |
| `js/engine/assets_engine.js` | Hartanah, kenderaan, pelaburan, pasaran global, koleksi & lelongan | `AssetsEngine` (`generateYearlyMarket`, `checkCollectibleEligibility`, `buyCollectible`, `resolveCollectibleAuction`) |
| `js/engine/relationships.js` | Keluarga, pasangan, cincin, kahwin/kahwin lompat, perceraian | `Relationships` (`buyRing`, `interactPartner`, `elope`) |
| `js/engine/security_threats.js` | Pengawal Peribadi (5 thn), Seni Pertahankan Diri (1x/thn), Ugutan, Buang Anak | `SecurityThreats` (`hireBodyguard`, `trainMartialArts`, `disownChild`, `investigateThreat`, `tickYearlySecurity`) |
| `js/engine/education_career.js` | Sekolah, universiti, biasiswa, kerjaya & kenaikan pangkat | `EduCareerEngine` |
| `js/engine/health_medical.js` | Penyakit, rawatan, kesihatan mental/fizikal | `HealthMedicalEngine` |
| `js/engine/loans_engine.js` | Pinjaman bank, lintah darat & hutang generasi | `LoansEngine` |
| `js/engine/prison_fugitive.js` | Penjara, hukuman, cubaan lari & status buruan | `PrisonFugitive` |
| `js/engine/special_modes_engine.js` | Mod khas (Mafia, Politik, Selebriti, Atlet, dll.) | `SpecialModesEngine` |
| `js/engine/karma_endings.js` | Karma, populariti, haba polis, stres & pengakhiran | `KarmaEndings` |
| `js/engine/dynasty.js` | Reputasi dinasti & rekod merentas generasi | `Dynasty` |
| `js/engine/character_status.js` | Gelaran kehormat & ringkasan status watak | `CharacterStatus` |
| `js/services/ai_narrator.js` | Penjana naratif AI pilihan (fallback tempatan) | `AINarrator` |
| `src/services/firebase.js` | Auth Google & Cloud Sync Slot ke Firestore | `FirebaseService` |
| `js/data/*.js` | Bank data statik (negara, peristiwa, drama, aktiviti, aset, kerjaya, pendidikan, sosial, mod khas, petikan) | `COUNTRIES`, `GAME_EVENTS`, `LIFE_EVENTS`, `RelationshipDramaData`, `ActivitiesData`, `ActivitiesDeck`, `AssetsData`, `CareersData`, `EducationData`, `SocialMedia`, `SpecialModesData`, `Quotes` |
| `js/ui/app.js` | Kitaran hidup UI, `renderAll()`, pengikatan HUD & butang utama | `App` (`bindEvents`, `renderAll`, `toast`) |
| `js/ui/modals.js` | Modal teras: peristiwa, aktiviti/jenayah, hubungan, wasiat/yayasan, keselamatan, penyata aliran tunai, slot simpanan | `Modals` (`open`, `showEvent`, `showActivities`, `showRelationships`, `showWasiatModal`, `showSecurityThreatsModal`, `showCashFlowStatementModal`, `showSaveSlotsModal`) |
| `js/ui/modals_assets.js` | Hab Aset, pasaran tempatan/global, lelongan koleksi | `AssetModals` (`showHub`, `showAssets`, `showCollectibleAuctionModal`) |
| `js/ui/modals_legacy.js` | Render Dek Aktiviti dinamik & legasi keluarga | `LegacyModals` (`renderDynamicActivities`, `bindDynamicActivities`, `showFamilyLegacy`) |
| `js/ui/modals_career.js` | Hab Pendidikan & Kerjaya | `CareerModals` |
| `js/ui/modals_prison.js` | Hab Penjara & Buruan | `PrisonModals` |
| `js/ui/modals_modes.js` | Papan pemuka mod kerjaya/kehidupan | `ModeModals` |
| `js/ui/modals_special_modes.js` | Modal interaksi mod khas & sindiket | `SpecialModeModals` |

---

## 3. Peta ID UI & Modal Penting (Disahkan dari Kod Sebenar)
- **HUD Baki Bank & Penyata Aliran Tunai:**
  - Kotak boleh klik: `#char-wealth-box` (`.char-wealth`, `index.html:52`) mengandungi `#char-money` (`.wealth-amount`).
  - Listener di `js/ui/app.js` (`#char-wealth-box`) -> memanggil `Modals.showCashFlowStatementModal('all')` (`js/ui/modals.js:2027`).
- **Modal Aktiviti & Dunia:**
  - Pembuka: `Modals.showActivities(subTab)` (`js/ui/modals.js`).
  - Tab **Dek Aktiviti (`'deck'`)**: dirender oleh `LegacyModals.renderDynamicActivities()` (`js/ui/modals_legacy.js`) dengan penapis `.act-cat-filter` (**Semua**, **Sosial**, dll.) — 100% bebas aktiviti gelap/Mafia.
  - Tab **Jenayah (`'crime'`)**: dirender dalam `Modals.showActivities('crime')` (`js/ui/modals.js`), menempatkan kad **Sindiket Mafia** (`#act-join-mafia`) + semua aktiviti gelap (`crime-btn` & `dark-deck-btn`) dengan kaunter percubaan kongsi `0/3`.
- **Tabung Yayasan Keluarga & Laporan Pengurus Dana:**
  - Pembuka: `Modals.showWasiatModal()` (`js/ui/modals.js:2277`), memaparkan panel Yayasan & kad laporan `ft.latestFundReport` (`modals.js:2496`).
- **Modal Keselamatan & Ancaman:**
  - Pembuka: `Modals.showSecurityThreatsModal()` (`js/ui/modals.js:2120`).
- **Modal Popup Pilihan / Dilema & Misteri:**
  - Pembuka: `Modals.showEvent(event)` (`js/ui/modals.js:37`) -> klik `.choice-btn` memanggil `Sim.resolveEventChoice(event, choice)` (`js/engine/simulation.js`).
- **Modal Slot Simpanan & Sync Firestore:**
  - Pembuka: `Modals.showSaveSlotsModal()` (`js/ui/modals.js:3907`), disambungkan ke `GameState` + `FirebaseService`.

---

## 4. Peta Aliran Rentas Fail (Cross-File Map)
- **Aliran `+Umur` (`Sim.ageUp` -> `Sim._ageUpCore` dalam `js/engine/simulation.js`):**
  1. `ageUp()` merakam baki mula (`_m0`), memanggil `_ageUpCore()`, merekod gaji/sewa/dividen/penyelenggaraan serta pelarasan baki tidak terjelas tahunan (hanya bagi selisih dalam pusingan `+Umur` itu).
  2. `_ageUpCore()` menaikkan `age`/`year`, memanggil `GameState.resetAnnualCashFlow(s)`, dan mereset bendera tahunan: `cultureVisitedThisYear`, `scholarshipIvUsedThisYear`, `hospitalVisitedThisYear`, `collectibleAcquisitionsThisYear`, `jobAppsThisYear`, `jobActionsUsedThisYear`, `stoleMoneyIdsThisYear`, `askedMoneyCountThisYear`, `yearlyActions`, serta `martialArtsTrainedThisYear` (dalam `SecurityThreats.tickYearlySecurity`).
  3. Menjalankan `SecurityThreats.tickYearlySecurity`, `LegalInheritanceEngine.tickYearlyLegal` & `tickFamilyTrust`, `AssetsEngine.generateYearlyMarket`, `_processImmigrationRenewal`, dan memilih peristiwa tahunan (`_pickYearlyEvent`).
- **Mutasi Tunai (`money` & `GameState.logCashFlow`):**
  - Fail yang mengubah `s.money`: `simulation.js`, `legalInheritanceEngine.js`, `assets_engine.js`, `relationships.js`, `security_threats.js`, `education_career.js`, `loans_engine.js`, `special_modes_engine.js`, `activities_deck.js`, `life_events.js`, `relationshipDramaData.js`, `social_media.js`, `events.js`, `state.js`.
  - Peraturan: Panggil `GameState.logCashFlow(s, delta, label, category)` **selepas** `s.money` dikemas kini; had `state.cashFlowLog` ialah **150 rekod**. `Sim.resolveEventChoice` turut menangkap mutasi tunai popup secara automatik jika belum direkod.
- **Watak Baharu & Sambung Generasi (`js/engine/state.js`):**
  - `GameState.newCharacter()` mereset state penuh termasuk `cashFlowLog: []`, `recentPopupIds: []`, `collectibleAcquisitionsThisYear: 0`.
  - `GameState.continueAsChild()` memindahkan warisan & Yayasan, mereset `recentPopupIds: []`, dan menyemai 1 entri `"Baki Awal / Warisan Tunai"` dalam `cashFlowLog` jika ada warisan tunai.
  - Hijrah negara (`Sim.migrateToCountry`) memanggil `GameState.convertCashFlowCurrency(s, fromId, toId)`.
- **Popup & Anti-Ulangan:**
  - Bank data: `js/data/events.js`, `js/data/life_events.js`, `js/data/relationshipDramaData.js`, serta penjana dalam `simulation.js` (termasuk `buildBlackmailEvent`).
  - Pemilihan & penapisan anti-ulangan: `Sim._pickYearlyEvent(s, c)` (`js/engine/simulation.js:1563`) mengurus `s.recentPopupIds` (tetingkap 20 ID terakhir).
- **Simpanan, Slot & Backend:**
  - Tempatan: `SafeStorage` (`js/engine/storage.js`) + `GameState` (`js/engine/state.js`).
  - Cloud: `FirebaseService` (`src/services/firebase.js`).
  - Worker / AI: `AINarrator` (`js/services/ai_narrator.js`) dan `FUND_REPORT_WORKER_URL` (`js/engine/legalInheritanceEngine.js:1`).

---

## 5. Protokol Wajib Sebelum Edit (Untuk Agen Masa Depan)
1. Baca `CODE_MAP.md` dahulu sebelum menyentuh kod.
2. Jalankan carian `rg` / `grep` seluruh projek bagi ID, fungsi, atau kunci state sebelum membuat edit rentas fail agar tiada duplikat atau sasaran tersilap.
3. Selepas edit, jalankan `node --check <fail.js>` bagi semua fail yang diubah dan kemas kini `?v=...` dalam `index.html` jika perlu.
