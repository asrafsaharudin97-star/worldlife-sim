/* ==========================================================================
   WorldLife — Pangkalan Data Lengkap 195 Negara Berdaulat Dunia
   (193 Negara Anggota PBB + Palestin & Kota Vatican)
   ========================================================================== */

(function () {
  const NAME_POOLS = {
    malay_sea: {
      style: 'patronymic_malay',
      male: ['Aiman', 'Hakim', 'Danish', 'Irfan', 'Syafiq', 'Haziq', 'Amirul', 'Faris', 'Asraf', 'Faiz', 'Nabil', 'Zul'],
      female: ['Aisyah', 'Nurul', 'Sofea', 'Hana', 'Izzah', 'Balqis', 'Nadia', 'Syirah', 'Amira', 'Farah', 'Liyana', 'Qistina'],
      last: ['bin Abdullah', 'bin Ismail', 'bin Rahman', 'bin Hassan', 'bin Razak', 'bin Zainal', 'bin Yusof', 'bin Saharudin'],
      lastFemale: ['binti Abdullah', 'binti Ismail', 'binti Rahman', 'binti Hassan', 'binti Razak', 'binti Zainal', 'binti Yusof']
    },
    indonesian: {
      style: 'standard',
      male: ['Budi', 'Dimas', 'Rizky', 'Fajar', 'Aditya', 'Bagas', 'Reza', 'Arif', 'Rama', 'Ilham', 'Bayu', 'Galih'],
      female: ['Siti', 'Putri', 'Dewi', 'Nadia', 'Ayu', 'Citra', 'Rina', 'Intan', 'Maya', 'Lestari', 'Zahra', 'Salsa'],
      last: ['Santoso', 'Wijaya', 'Pratama', 'Saputra', 'Hidayat', 'Kusuma', 'Nugroho', 'Siregar', 'Setiawan', 'Hakim']
    },
    thai_sea: {
      style: 'standard',
      male: ['Somchai', 'Nattapong', 'Kittisak', 'Arthit', 'Chaiwat', 'Tanakorn', 'Pichai', 'Somsak', 'Vannak', 'Sokha'],
      female: ['Ploy', 'Nattaya', 'Siriporn', 'Kanya', 'Mali', 'Chanthira', 'Pimchanok', 'Sreypov', 'Bopha', 'Thida'],
      last: ['Sukhum', 'Charoen', 'Rattanakul', 'Srisai', 'Boonmee', 'Wongwan', 'Chanthavong', 'Seng', 'Kyaw', 'Htun']
    },
    vietnamese: {
      style: 'standard',
      male: ['Minh', 'Anh', 'Duc', 'Hoang', 'Quang', 'Tuan', 'Khai', 'Nam', 'Huy', 'Long'],
      female: ['Linh', 'Mai', 'Huong', 'Trang', 'Ngoc', 'Thao', 'Vy', 'Phuong', 'Lan', 'Chi'],
      last: ['Nguyen', 'Tran', 'Le', 'Pham', 'Hoang', 'Phan', 'Vu', 'Dang', 'Bui', 'Do']
    },
    filipino: {
      style: 'standard',
      male: ['Mateo', 'Gabriel', 'Rafael', 'Miguel', 'Paolo', 'Carlo', 'Marco', 'Jericho', 'Angelo', 'Jose'],
      female: ['Maria', 'Sofia', 'Isabella', 'Camille', 'Bianca', 'Andrea', 'Clarissa', 'Bea', 'Angelica', 'Teresita'],
      last: ['Santos', 'Reyes', 'Cruz', 'Bautista', 'Ocampo', 'Garcia', 'Mendoza', 'Torres', 'Flores', 'Ramos']
    },
    east_asian_cn: {
      style: 'standard',
      male: ['Wei', 'Jian', 'Hao', 'Ming', 'Chen', 'Zhi', 'Jun', 'Bo', 'Kai', 'Yu', 'Tian', 'Long'],
      female: ['Mei', 'Lin', 'Jing', 'Xia', 'Yue', 'Hui', 'Fang', 'Lan', 'Qing', 'Xin', 'Ying', 'Shu'],
      last: ['Wang', 'Li', 'Zhang', 'Liu', 'Chen', 'Yang', 'Huang', 'Zhao', 'Wu', 'Zhou', 'Xu', 'Sun']
    },
    japanese: {
      style: 'standard',
      male: ['Haruto', 'Ren', 'Sora', 'Yuto', 'Kaito', 'Daiki', 'Takumi', 'Kenji', 'Riku', 'Shota'],
      female: ['Yui', 'Aoi', 'Sakura', 'Hina', 'Mei', 'Rin', 'Mio', 'Yuna', 'Akari', 'Saki'],
      last: ['Sato', 'Suzuki', 'Takahashi', 'Tanaka', 'Watanabe', 'Ito', 'Yamamoto', 'Nakamura', 'Kobayashi', 'Kato']
    },
    korean: {
      style: 'standard',
      male: ['Min-jun', 'Seo-jun', 'Do-yun', 'Ji-ho', 'Hyun-woo', 'Joon', 'Tae-hyung', 'Sung-min', 'Ji-hoon'],
      female: ['Seo-yeon', 'Ji-woo', 'Ha-yoon', 'Min-ji', 'Soo-jin', 'Eun-bi', 'Yuna', 'Jieun', 'Hye-jin'],
      last: ['Kim', 'Lee', 'Park', 'Choi', 'Jung', 'Kang', 'Cho', 'Yoon', 'Jang', 'Lim']
    },
    south_asian: {
      style: 'standard',
      male: ['Aarav', 'Rohan', 'Vikram', 'Arjun', 'Siddharth', 'Kabir', 'Rajesh', 'Nikhil', 'Pranav', 'Dev'],
      female: ['Ananya', 'Priya', 'Diya', 'Kavya', 'Meera', 'Sneha', 'Pooja', 'Neha', 'Riya', 'Aisha'],
      last: ['Sharma', 'Patel', 'Verma', 'Singh', 'Gupta', 'Reddy', 'Nair', 'Desai', 'Mehta', 'Perera']
    },
    south_asian_west: {
      style: 'standard',
      male: ['Bilal', 'Hamza', 'Usman', 'Tariq', 'Zain', 'Imran', 'Saad', 'Faisal', 'Hassan', 'Rafiq'],
      female: ['Ayesha', 'Fatima', 'Zara', 'Hina', 'Sana', 'Mariam', 'Nadia', 'Amina', 'Sadia', 'Farzana'],
      last: ['Khan', 'Ahmed', 'Hussain', 'Rahman', 'Malik', 'Chowdhury', 'Siddiqui', 'Qureshi', 'Karim', 'Ali']
    },
    arabic_me: {
      style: 'arabic',
      male: ['Omar', 'Youssef', 'Tariq', 'Khalid', 'Zaid', 'Rami', 'Sami', 'Karim', 'Hassan', 'Mustafa', 'Fadi', 'Nasser'],
      female: ['Layla', 'Noor', 'Mariam', 'Salma', 'Rania', 'Dina', 'Huda', 'Yasmin', 'Farah', 'Amira', 'Lina', 'Jana'],
      last: ['Al-Mansoor', 'Al-Masri', 'Haddad', 'Al-Harbi', 'Al-Rashid', 'Khoury', 'Al-Najjar', 'Mansour', 'Saleh', 'Barakat']
    },
    persian_turkic: {
      style: 'standard',
      male: ['Emre', 'Mehmet', 'Kerem', 'Darius', 'Reza', 'Arman', 'Timur', 'Nurlan', 'Aziz', 'Yusuf'],
      female: ['Elif', 'Zeynep', 'Aylin', 'Darya', 'Shirin', 'Leila', 'Amina', 'Madina', 'Gulnara', 'Selin'],
      last: ['Yilmaz', 'Kaya', 'Demir', 'Hosseini', 'Mohammadi', 'Aliev', 'Karimov', 'Nazarbayev', 'Aydin', 'Celik']
    },
    anglosphere: {
      style: 'standard',
      male: ['Liam', 'Noah', 'Oliver', 'James', 'Ethan', 'Lucas', 'Henry', 'Jack', 'Daniel', 'Samuel'],
      female: ['Olivia', 'Emma', 'Charlotte', 'Amelia', 'Sophia', 'Chloe', 'Grace', 'Hannah', 'Emily', 'Lily'],
      last: ['Smith', 'Johnson', 'Brown', 'Taylor', 'Wilson', 'Davies', 'Miller', 'Anderson', 'Clark', 'Walker']
    },
    western_europe: {
      style: 'standard',
      male: ['Lukas', 'Leon', 'Gabriel', 'Hugo', 'Louis', 'Bram', 'Noah', 'Felix', 'Jonas', 'Max'],
      female: ['Emma', 'Sophie', 'Clara', 'Lena', 'Mia', 'Chloé', 'Lotte', 'Hannah', 'Lea', 'Julia'],
      last: ['Müller', 'Schmidt', 'Bernard', 'Dubois', 'De Vries', 'Jansen', 'Weber', 'Keller', 'Moreau', 'Schneider']
    },
    southern_europe: {
      style: 'standard',
      male: ['Marco', 'Luca', 'Matteo', 'Alejandro', 'Carlos', 'Tiago', 'Nikos', 'Giorgos', 'Antonio', 'Diego'],
      female: ['Sofia', 'Giulia', 'Lucia', 'Elena', 'Maria', 'Ines', 'Chiara', 'Carmen', 'Beatriz', 'Vasiliki'],
      last: ['Rossi', 'Bianchi', 'Garcia', 'Fernandez', 'Silva', 'Ferreira', 'Papadopoulos', 'Conti', 'Romano', 'Costa']
    },
    nordic: {
      style: 'standard',
      male: ['Erik', 'Lars', 'Soren', 'Mikkel', 'Henrik', 'Oskar', 'Aksel', 'Joonas', 'Einar', 'Nils'],
      female: ['Freja', 'Astrid', 'Ingrid', 'Maja', 'Linnea', 'Aino', 'Sofie', 'Nora', 'Sigrid', 'Elsa'],
      last: ['Lindqvist', 'Johansson', 'Hansen', 'Nielsen', 'Korhonen', 'Berg', 'Solberg', 'Larsson', 'Eriksen', 'Holm']
    },
    slavic_east_eu: {
      style: 'standard',
      male: ['Aleksandr', 'Dmitri', 'Piotr', 'Jakub', 'Luka', 'Ivan', 'Marek', 'Andrei', 'Bence', 'Nikola'],
      female: ['Anastasia', 'Katarzyna', 'Zofia', 'Elena', 'Maja', 'Petra', 'Natalia', 'Ioana', 'Hanna', 'Milica'],
      last: ['Novak', 'Kowalski', 'Ivanov', 'Petrov', 'Popescu', 'Horvat', 'Kovac', 'Nagy', 'Shevchenko', 'Smirnov']
    },
    latin_american: {
      style: 'standard',
      male: ['Mateo', 'Santiago', 'Lucas', 'Gabriel', 'Diego', 'Rafael', 'Thiago', 'Alejandro', 'Bruno', 'Andres'],
      female: ['Valentina', 'Camila', 'Sofia', 'Mariana', 'Isabela', 'Lucia', 'Fernanda', 'Gabriela', 'Paula', 'Ana'],
      last: ['Silva', 'Santos', 'Oliveira', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Pereira', 'Mendoza']
    },
    west_african: {
      style: 'standard',
      male: ['Chinedu', 'Tunde', 'Kwame', 'Kofi', 'Moussa', 'Ibrahim', 'Oluwaseun', 'Adebayo', 'Seyi', 'Mamadou'],
      female: ['Amara', 'Zainab', 'Amina', 'Ngozi', 'Ama', 'Fatou', 'Chioma', 'Binta', 'Yemi', 'Aissatou'],
      last: ['Okafor', 'Balogun', 'Mensah', 'Diallo', 'Traore', 'Adeyemi', 'Boateng', 'Ndiaye', 'Eze', 'Konate']
    },
    east_african: {
      style: 'standard',
      male: ['Juma', 'Baraka', 'Dawit', 'Samuel', 'Kelvin', 'Brian', 'Yohannes', 'Abdi', 'Hassan', 'David'],
      female: ['Amina', 'Wanjiku', 'Neema', 'Selam', 'Farah', 'Grace', 'Halima', 'Bethlehem', 'Asha', 'Lydia'],
      last: ['Ochieng', 'Kamau', 'Mwangi', 'Tesfaye', 'Bekele', 'Njoroge', 'Hassan', 'Mushi', 'Kariuki', 'Abebe']
    },
    southern_african: {
      style: 'standard',
      male: ['Thabo', 'Sipho', 'Kagiso', 'Tendai', 'Tawanda', 'Lethabo', 'Liam', 'Mandla', 'Bongani', 'Pieter'],
      female: ['Lerato', 'Naledi', 'Thandiwe', 'Rudo', 'Zanele', 'Amahle', 'Chloé', 'Precious', 'Palesa', 'Anika'],
      last: ['Dlamini', 'Nkosi', 'Moyo', 'Ndlovu', 'Khumalo', 'Botha', 'Phiri', 'Banda', 'Molefe', 'Zulu']
    },
    pacific_islander: {
      style: 'standard',
      male: ['Tane', 'Sione', 'Jone', 'Semi', 'Kauri', 'Manu', 'Ioane', 'Pita', 'Ratu', 'Tevita'],
      female: ['Moana', 'Sina', 'Lani', 'Mere', 'Aroha', 'Mele', 'Talia', 'Adi', 'Leilani', 'Ana'],
      last: ['Tui', 'Vaka', 'Ratu', 'Fale', 'Koro', 'Nai', 'Savu', 'Malo', 'Tonga', 'Kava']
    }
  };

  // Format: [id, name, flag, continent, currencyCode, currencySymbol, usdRate, salaryMult, costOfLiving, taxRate, healthTier, healthCostFactor, eduQuality, safetyIndex, lifeExp, cultureGroup, capitalCity]
  const WORLD_LIST = [
    // ================= ASIA (48) =================
    ['AF','Afghanistan','🇦🇫','Asia','AFN','؋',71,0.14,0.24,0.10,'Terhad',0.25,35,28,63,'south_asian_west','Kabul'],
    ['AM','Armenia','🇦🇲','Asia','AMD','֏',390,0.34,0.40,0.20,'Subsidi',0.45,74,78,76,'slavic_east_eu','Yerevan'],
    ['AZ','Azerbaijan','🇦🇿','Asia','AZN','₼',1.7,0.38,0.42,0.14,'Subsidi',0.45,72,72,74,'persian_turkic','Baku'],
    ['BH','Bahrain','🇧🇭','Asia','BHD','BD ',0.38,0.92,0.68,0.00,'Percuma / Subsidi',0.35,80,76,79,'arabic_me','Manama'],
    ['BD','Bangladesh','🇧🇩','Asia','BDT','৳',118,0.22,0.28,0.15,'Subsidi',0.25,58,56,74,'south_asian_west','Dhaka'],
    ['BT','Bhutan','🇧🇹','Asia','BTN','Nu ',83,0.26,0.32,0.10,'Percuma',0.15,66,82,73,'south_asian','Thimphu'],
    ['BN','Brunei','🇧🇳','Asia','BND','B$',1.34,0.95,0.62,0.00,'Percuma',0.10,82,86,77,'malay_sea','Bandar Seri Begawan'],
    ['KH','Kemboja','🇰🇭','Asia','KHR','៛',4100,0.24,0.34,0.12,'Swasta / Subsidi',0.35,55,62,71,'thai_sea','Phnom Penh'],
    ['CN','China','🇨🇳','Asia','CNY','¥',7.2,0.68,0.52,0.20,'Subsidi',0.45,86,82,79,'east_asian_cn','Beijing'],
    ['CY','Cyprus','🇨🇾','Asia','EUR','€',0.92,0.82,0.72,0.22,'Percuma / Subsidi',0.35,84,82,82,'southern_europe','Nicosia'],
    ['GE','Georgia','🇬🇪','Asia','GEL','₾',2.7,0.36,0.42,0.20,'Subsidi',0.40,76,78,75,'slavic_east_eu','Tbilisi'],
    ['IN','India','🇮🇳','Asia','INR','₹',83.5,0.30,0.28,0.18,'Subsidi / Swasta',0.30,70,60,72,'south_asian','New Delhi'],
    ['ID','Indonesia','🇮🇩','Asia','IDR','Rp ',15800,0.34,0.34,0.15,'Subsidi (BPJS)',0.30,68,66,72,'indonesian','Jakarta'],
    ['IR','Iran','🇮🇷','Asia','IRR','﷼',42000,0.30,0.35,0.15,'Subsidi',0.35,74,58,77,'persian_turkic','Tehran'],
    ['IQ','Iraq','🇮🇶','Asia','IQD','IQD ',1310,0.32,0.38,0.12,'Subsidi',0.40,56,42,72,'arabic_me','Baghdad'],
    ['JP','Jepun','🇯🇵','Asia','JPY','¥',152,1.08,0.86,0.24,'Subsidi (NHI)',0.35,95,94,85,'japanese','Tokyo'],
    ['JO','Jordan','🇯🇴','Asia','JOD','JD ',0.71,0.38,0.48,0.14,'Subsidi',0.45,74,72,76,'arabic_me','Amman'],
    ['KZ','Kazakhstan','🇰🇿','Asia','KZT','₸',450,0.44,0.42,0.10,'Subsidi',0.40,78,68,74,'persian_turkic','Astana'],
    ['KW','Kuwait','🇰🇼','Asia','KWD','KD ',0.31,1.12,0.72,0.00,'Percuma / Subsidi',0.25,78,78,80,'arabic_me','Kuwait City'],
    ['KG','Kyrgyzstan','🇰🇬','Asia','KGS','сом ',89,0.24,0.32,0.10,'Subsidi',0.35,68,66,72,'persian_turkic','Bishkek'],
    ['LA','Laos','🇱🇦','Asia','LAK','₭',21000,0.20,0.32,0.12,'Terhad',0.30,54,68,69,'thai_sea','Vientiane'],
    ['LB','Lubnan','🇱🇧','Asia','LBP','L£',89000,0.28,0.46,0.14,'Swasta',0.60,72,46,76,'arabic_me','Beirut'],
    ['MY','Malaysia','🇲🇾','Asia','MYR','RM ',4.45,0.52,0.42,0.14,'Subsidi (KKM)',0.18,80,74,77,'malay_sea','Kuala Lumpur'],
    ['MV','Maldives','🇲🇻','Asia','MVR','Rf ',15.4,0.48,0.58,0.08,'Subsidi',0.40,72,78,80,'south_asian_west','Malé'],
    ['MN','Mongolia','🇲🇳','Asia','MNT','₮',3420,0.32,0.38,0.10,'Subsidi',0.35,74,70,72,'east_asian_cn','Ulaanbaatar'],
    ['MM','Myanmar','🇲🇲','Asia','MMK','K ',2100,0.18,0.28,0.10,'Terhad',0.30,50,38,67,'thai_sea','Naypyidaw'],
    ['NP','Nepal','🇳🇵','Asia','NPR','Rs ',133,0.20,0.26,0.12,'Subsidi',0.25,58,68,71,'south_asian','Kathmandu'],
    ['KP','Korea Utara','🇰🇵','Asia','KPW','₩',900,0.14,0.25,0.05,'Kerajaan',0.20,62,48,73,'korean','Pyongyang'],
    ['OM','Oman','🇴🇲','Asia','OMR','OMR ',0.38,0.92,0.62,0.00,'Percuma / Subsidi',0.25,78,86,78,'arabic_me','Muscat'],
    ['PK','Pakistan','🇵🇰','Asia','PKR','Rs ',278,0.22,0.25,0.14,'Subsidi / Swasta',0.28,55,48,68,'south_asian_west','Islamabad'],
    ['PS','Palestin','🇵🇸','Asia','ILS','₪',3.7,0.30,0.42,0.10,'Subsidi',0.35,74,40,75,'arabic_me','Baitulmaqdis / Ramallah'],
    ['PH','Filipina','🇵🇭','Asia','PHP','₱',56.5,0.32,0.36,0.18,'Subsidi / Swasta',0.38,70,58,72,'filipino','Manila'],
    ['QA','Qatar','🇶🇦','Asia','QAR','QR ',3.64,1.35,0.82,0.00,'Percuma / Subsidi',0.25,84,92,81,'arabic_me','Doha'],
    ['SA','Arab Saudi','🇸🇦','Asia','SAR','SR ',3.75,1.02,0.64,0.00,'Percuma / Subsidi',0.25,80,82,78,'arabic_me','Riyadh'],
    ['SG','Singapura','🇸🇬','Asia','SGD','S$',1.34,1.25,0.94,0.11,'Subsidi (Medisave)',0.42,96,95,84,'east_asian_cn','Singapura'],
    ['KR','Korea Selatan','🇰🇷','Asia','KRW','₩',1350,1.02,0.82,0.22,'Subsidi (NHIS)',0.32,94,90,84,'korean','Seoul'],
    ['LK','Sri Lanka','🇱🇰','Asia','LKR','Rs ',300,0.26,0.32,0.14,'Percuma',0.20,74,68,77,'south_asian','Colombo'],
    ['SY','Syria','🇸🇾','Asia','SYP','£S',13000,0.14,0.26,0.10,'Terhad',0.30,52,30,72,'arabic_me','Damsyik'],
    ['TJ','Tajikistan','🇹🇯','Asia','TJS','SM ',10.9,0.20,0.30,0.12,'Subsidi',0.30,62,64,71,'persian_turkic','Dushanbe'],
    ['TH','Thailand','🇹🇭','Asia','THB','฿',35.5,0.42,0.38,0.15,'Subsidi',0.25,74,70,79,'thai_sea','Bangkok'],
    ['TL','Timor-Leste','🇹🇱','Asia','USD','$',1,0.22,0.36,0.10,'Subsidi',0.30,54,66,70,'filipino','Dili'],
    ['TR','Turki','🇹🇷','Asia','TRY','₺',32.5,0.52,0.44,0.22,'Subsidi',0.38,78,66,78,'persian_turkic','Ankara'],
    ['TM','Turkmenistan','🇹🇲','Asia','TMT','m ',3.5,0.34,0.38,0.10,'Subsidi',0.30,66,68,70,'persian_turkic','Ashgabat'],
    ['AE','UAE (Dubai)','🇦🇪','Asia','AED','AED ',3.67,1.28,0.88,0.00,'Swasta / Insurans',0.65,86,93,80,'arabic_me','Dubai'],
    ['UZ','Uzbekistan','🇺🇿','Asia','UZS','soʻm ',12600,0.26,0.32,0.12,'Subsidi',0.32,70,72,73,'persian_turkic','Tashkent'],
    ['VN','Vietnam','🇻🇳','Asia','VND','₫',25000,0.34,0.34,0.15,'Subsidi',0.30,76,76,76,'vietnamese','Hanoi'],
    ['YE','Yaman','🇾🇪','Asia','YER','﷼',250,0.14,0.25,0.10,'Terhad',0.28,42,26,66,'arabic_me','Sanaa'],

    // ================= EUROPE (44) =================
    ['AL','Albania','🇦🇱','Europe','ALL','L ',94,0.40,0.46,0.18,'Subsidi',0.40,72,70,79,'southern_europe','Tirana'],
    ['AD','Andorra','🇦🇩','Europe','EUR','€',0.92,1.15,0.84,0.10,'Subsidi',0.35,88,92,84,'southern_europe','Andorra la Vella'],
    ['AT','Austria','🇦🇹','Europe','EUR','€',0.92,1.18,0.88,0.34,'Percuma / Subsidi',0.25,92,90,82,'western_europe','Vienna'],
    ['BY','Belarus','🇧🇾','Europe','BYN','Br ',3.25,0.42,0.42,0.13,'Percuma / Subsidi',0.30,80,68,75,'slavic_east_eu','Minsk'],
    ['BE','Belgium','🇧🇪','Europe','EUR','€',0.92,1.15,0.86,0.38,'Subsidi',0.28,91,82,82,'western_europe','Brussels'],
    ['BA','Bosnia & Herzegovina','🇧🇦','Europe','BAM','KM ',1.8,0.42,0.44,0.14,'Subsidi',0.38,72,72,77,'slavic_east_eu','Sarajevo'],
    ['BG','Bulgaria','🇧🇬','Europe','BGN','лв ',1.8,0.52,0.48,0.10,'Subsidi',0.40,78,74,75,'slavic_east_eu','Sofia'],
    ['HR','Croatia','🇭🇷','Europe','EUR','€',0.92,0.68,0.62,0.22,'Percuma / Subsidi',0.30,82,85,79,'slavic_east_eu','Zagreb'],
    ['CZ','Republik Czech','🇨🇿','Europe','CZK','Kč ',23,0.78,0.64,0.20,'Percuma / Subsidi',0.28,88,88,80,'slavic_east_eu','Prague'],
    ['DK','Denmark','🇩🇰','Europe','DKK','kr ',6.9,1.32,0.98,0.42,'Percuma',0.15,95,92,82,'nordic','Copenhagen'],
    ['EE','Estonia','🇪🇪','Europe','EUR','€',0.92,0.80,0.66,0.20,'Percuma / Subsidi',0.28,90,86,79,'nordic','Tallinn'],
    ['FI','Finland','🇫🇮','Europe','EUR','€',0.92,1.20,0.90,0.36,'Percuma',0.18,96,92,82,'nordic','Helsinki'],
    ['FR','Perancis','🇫🇷','Europe','EUR','€',0.92,1.12,0.88,0.34,'Percuma / Subsidi',0.22,90,78,83,'western_europe','Paris'],
    ['DE','Jerman','🇩🇪','Europe','EUR','€',0.92,1.22,0.86,0.36,'Subsidi',0.25,93,84,82,'western_europe','Berlin'],
    ['GR','Greece','🇬🇷','Europe','EUR','€',0.92,0.68,0.64,0.26,'Subsidi',0.38,82,76,82,'southern_europe','Athens'],
    ['HU','Hungary','🇭🇺','Europe','HUF','Ft ',365,0.62,0.54,0.15,'Subsidi',0.35,84,80,77,'slavic_east_eu','Budapest'],
    ['IS','Iceland','🇮🇸','Europe','ISK','kr ',138,1.38,1.08,0.36,'Percuma / Subsidi',0.22,93,96,83,'nordic','Reykjavik'],
    ['IE','Ireland','🇮🇪','Europe','EUR','€',0.92,1.24,0.94,0.32,'Subsidi',0.35,92,86,83,'anglosphere','Dublin'],
    ['IT','Itali','🇮🇹','Europe','EUR','€',0.92,0.98,0.80,0.33,'Percuma / Subsidi',0.25,88,78,84,'southern_europe','Rom'],
    ['LV','Latvia','🇱🇻','Europe','EUR','€',0.92,0.68,0.58,0.22,'Subsidi',0.35,84,78,76,'slavic_east_eu','Riga'],
    ['LI','Liechtenstein','🇱🇮','Europe','CHF','CHF ',0.88,1.58,1.18,0.14,'Swasta / Insurans',0.55,94,95,84,'western_europe','Vaduz'],
    ['LT','Lithuania','🇱🇹','Europe','EUR','€',0.92,0.74,0.60,0.20,'Subsidi',0.32,86,80,77,'slavic_east_eu','Vilnius'],
    ['LU','Luxembourg','🇱🇺','Europe','EUR','€',0.92,1.52,1.05,0.32,'Subsidi',0.25,92,90,83,'western_europe','Luxembourg'],
    ['MT','Malta','🇲🇹','Europe','EUR','€',0.92,0.84,0.72,0.24,'Percuma',0.20,85,84,83,'southern_europe','Valletta'],
    ['MD','Moldova','🇲🇩','Europe','MDL','L ',17.8,0.32,0.38,0.12,'Subsidi',0.35,70,68,72,'slavic_east_eu','Chisinau'],
    ['MC','Monaco','🇲🇨','Europe','EUR','€',0.92,1.65,1.25,0.00,'Swasta / Subsidi',0.50,92,95,86,'western_europe','Monaco'],
    ['ME','Montenegro','🇲🇪','Europe','EUR','€',0.92,0.48,0.50,0.15,'Subsidi',0.38,76,78,77,'slavic_east_eu','Podgorica'],
    ['NL','Belanda','🇳🇱','Europe','EUR','€',0.92,1.26,0.92,0.37,'Subsidi / Insurans',0.32,94,88,82,'western_europe','Amsterdam'],
    ['MK','Macedonia Utara','🇲🇰','Europe','MKD','ден ',56.5,0.40,0.42,0.10,'Subsidi',0.35,72,74,76,'slavic_east_eu','Skopje'],
    ['NO','Norway','🇳🇴','Europe','NOK','kr ',10.7,1.42,1.06,0.38,'Percuma',0.16,95,94,83,'nordic','Oslo'],
    ['PL','Poland','🇵🇱','Europe','PLN','zł ',4.0,0.72,0.58,0.22,'Percuma / Subsidi',0.30,88,84,79,'slavic_east_eu','Warsaw'],
    ['PT','Portugal','🇵🇹','Europe','EUR','€',0.92,0.78,0.68,0.28,'Percuma / Subsidi',0.25,86,88,82,'southern_europe','Lisbon'],
    ['RO','Romania','🇷🇴','Europe','RON','lei ',4.6,0.58,0.50,0.16,'Subsidi',0.35,80,80,76,'slavic_east_eu','Bucharest'],
    ['RU','Rusia','🇷🇺','Europe','RUB','₽',92,0.54,0.48,0.15,'Percuma / Subsidi',0.32,84,60,73,'slavic_east_eu','Moscow'],
    ['SM','San Marino','🇸🇲','Europe','EUR','€',0.92,1.08,0.82,0.20,'Percuma',0.20,88,92,84,'southern_europe','San Marino'],
    ['RS','Serbia','🇷🇸','Europe','RSD','дин ',108,0.48,0.48,0.15,'Subsidi',0.35,80,74,76,'slavic_east_eu','Belgrade'],
    ['SK','Slovakia','🇸🇰','Europe','EUR','€',0.92,0.70,0.60,0.20,'Subsidi',0.30,84,82,78,'slavic_east_eu','Bratislava'],
    ['SI','Slovenia','🇸🇮','Europe','EUR','€',0.92,0.88,0.68,0.26,'Percuma / Subsidi',0.26,90,90,82,'slavic_east_eu','Ljubljana'],
    ['ES','Sepanyol','🇪🇸','Europe','EUR','€',0.92,0.92,0.74,0.30,'Percuma',0.18,88,84,84,'southern_europe','Madrid'],
    ['SE','Sweden','🇸🇪','Europe','SEK','kr ',10.6,1.24,0.92,0.40,'Percuma',0.18,94,86,83,'nordic','Stockholm'],
    ['CH','Switzerland','🇨🇭','Europe','CHF','CHF ',0.88,1.62,1.22,0.22,'Insurans Wajib',0.55,96,95,84,'western_europe','Zurich'],
    ['UA','Ukraine','🇺🇦','Europe','UAH','₴',39,0.34,0.38,0.18,'Subsidi',0.35,80,45,73,'slavic_east_eu','Kyiv'],
    ['GB','United Kingdom','🇬🇧','Europe','GBP','£',0.79,1.15,0.92,0.28,'Percuma (NHS)',0.12,92,82,82,'anglosphere','London'],
    ['VA','Kota Vatican','🇻🇦','Europe','EUR','€',0.92,1.05,0.85,0.00,'Percuma',0.10,92,96,84,'southern_europe','Kota Vatican'],

    // ================= AFRICA (54) =================
    ['DZ','Algeria','🇩🇿','Africa','DZD','DA ',134,0.32,0.34,0.18,'Percuma / Subsidi',0.25,68,66,77,'arabic_me','Algiers'],
    ['AO','Angola','🇦🇴','Africa','AOA','Kz ',835,0.28,0.46,0.15,'Terhad',0.42,50,56,63,'southern_african','Luanda'],
    ['BJ','Benin','🇧🇯','Africa','XOF','CFA ',605,0.20,0.32,0.14,'Terhad',0.35,52,64,62,'west_african','Porto-Novo'],
    ['BW','Botswana','🇧🇼','Africa','BWP','P ',13.6,0.44,0.42,0.16,'Subsidi',0.32,70,74,69,'southern_african','Gaborone'],
    ['BF','Burkina Faso','🇧🇫','Africa','XOF','CFA ',605,0.16,0.30,0.12,'Terhad',0.30,44,44,61,'west_african','Ouagadougou'],
    ['BI','Burundi','🇧🇮','Africa','BIF','FBu ',2860,0.12,0.26,0.12,'Terhad',0.28,45,50,62,'east_african','Gitega'],
    ['CV','Cabo Verde','🇨🇻','Africa','CVE','Esc ',102,0.32,0.42,0.16,'Subsidi',0.35,68,74,75,'west_african','Praia'],
    ['CM','Cameroon','🇨🇲','Africa','XAF','FCFA ',605,0.22,0.34,0.15,'Terhad',0.35,56,54,62,'west_african','Yaoundé'],
    ['CF','Rep. Afrika Tengah','🇨🇫','Africa','XAF','FCFA ',605,0.12,0.30,0.12,'Terhad',0.30,38,34,55,'west_african','Bangui'],
    ['TD','Chad','🇹🇩','Africa','XAF','FCFA ',605,0.14,0.30,0.12,'Terhad',0.30,38,42,55,'west_african','N\'Djamena'],
    ['KM','Comoros','🇰🇲','Africa','KMF','CF ',454,0.20,0.34,0.12,'Terhad',0.30,54,68,65,'east_african','Moroni'],
    ['CG','Congo','🇨🇬','Africa','XAF','FCFA ',605,0.24,0.38,0.15,'Terhad',0.38,56,58,64,'west_african','Brazzaville'],
    ['CD','DR Congo','🇨🇩','Africa','CDF','FC ',2750,0.15,0.32,0.12,'Terhad',0.35,46,38,61,'west_african','Kinshasa'],
    ['CI','Ivory Coast','🇨🇮','Africa','XOF','CFA ',605,0.26,0.38,0.16,'Subsidi / Swasta',0.38,56,62,61,'west_african','Abidjan'],
    ['DJ','Djibouti','🇩🇯','Africa','DJF','Fdj ',177,0.30,0.46,0.15,'Terhad',0.40,54,68,64,'east_african','Djibouti'],
    ['EG','Mesir','🇪🇬','Africa','EGP','E£',47.5,0.28,0.28,0.18,'Subsidi',0.30,68,64,72,'arabic_me','Kaherah'],
    ['GQ','Guinea Khatulistiwa','🇬🇶','Africa','XAF','FCFA ',605,0.36,0.48,0.15,'Terhad',0.42,52,58,62,'west_african','Malabo'],
    ['ER','Eritrea','🇪🇷','Africa','ERN','Nfk ',15,0.14,0.28,0.10,'Terhad',0.28,48,54,67,'east_african','Asmara'],
    ['SZ','Eswatini','🇸🇿','Africa','SZL','E ',18.5,0.30,0.36,0.16,'Subsidi',0.32,60,60,61,'southern_african','Mbabane'],
    ['ET','Ethiopia','🇪🇹','Africa','ETB','Br ',57,0.18,0.28,0.15,'Subsidi',0.28,54,54,67,'east_african','Addis Ababa'],
    ['GA','Gabon','🇬🇦','Africa','XAF','FCFA ',605,0.40,0.48,0.18,'Subsidi',0.40,64,64,67,'west_african','Libreville'],
    ['GM','Gambia','🇬🇲','Africa','GMD','D ',67,0.16,0.30,0.14,'Terhad',0.30,50,66,64,'west_african','Banjul'],
    ['GH','Ghana','🇬🇭','Africa','GHS','₵',13.5,0.26,0.34,0.18,'Subsidi (NHIS)',0.32,64,72,66,'west_african','Accra'],
    ['GN','Guinea','🇬🇳','Africa','GNF','FG ',8600,0.18,0.32,0.14,'Terhad',0.32,46,54,61,'west_african','Conakry'],
    ['GW','Guinea-Bissau','🇬🇼','Africa','XOF','CFA ',605,0.15,0.30,0.12,'Terhad',0.30,44,56,60,'west_african','Bissau'],
    ['KE','Kenya','🇰🇪','Africa','KES','KSh ',130,0.28,0.36,0.20,'Subsidi / Swasta',0.35,68,60,67,'east_african','Nairobi'],
    ['LS','Lesotho','🇱🇸','Africa','LSL','L ',18.5,0.20,0.32,0.15,'Subsidi',0.30,56,56,56,'southern_african','Maseru'],
    ['LR','Liberia','🇱🇷','Africa','LRD','L$',193,0.15,0.32,0.14,'Terhad',0.30,46,60,62,'west_african','Monrovia'],
    ['LY','Libya','🇱🇾','Africa','LYD','LD ',4.85,0.38,0.38,0.10,'Subsidi',0.35,62,40,73,'arabic_me','Tripoli'],
    ['MG','Madagascar','🇲🇬','Africa','MGA','Ar ',4450,0.15,0.26,0.14,'Terhad',0.28,50,60,66,'east_african','Antananarivo'],
    ['MW','Malawi','🇲🇼','Africa','MWK','MK ',1730,0.14,0.26,0.15,'Terhad',0.28,50,66,65,'southern_african','Lilongwe'],
    ['ML','Mali','🇲🇱','Africa','XOF','CFA ',605,0.16,0.30,0.14,'Terhad',0.30,42,42,60,'west_african','Bamako'],
    ['MR','Mauritania','🇲🇷','Africa','MRU','UM ',39.6,0.22,0.32,0.14,'Terhad',0.32,48,60,66,'arabic_me','Nouakchott'],
    ['MU','Mauritius','🇲🇺','Africa','MUR','Rs ',46,0.52,0.48,0.15,'Percuma',0.20,78,82,75,'south_asian','Port Louis'],
    ['MA','Maghribi (Morocco)','🇲🇦','Africa','MAD','DH ',10,0.36,0.38,0.20,'Subsidi',0.35,68,74,76,'arabic_me','Rabat'],
    ['MZ','Mozambique','🇲🇿','Africa','MZN','MT ',64,0.16,0.30,0.15,'Terhad',0.30,48,54,62,'southern_african','Maputo'],
    ['NA','Namibia','🇳🇦','Africa','NAD','N$',18.5,0.38,0.42,0.18,'Subsidi',0.36,66,68,66,'southern_african','Windhoek'],
    ['NE','Niger','🇳🇪','Africa','XOF','CFA ',605,0.13,0.28,0.12,'Terhad',0.28,38,44,62,'west_african','Niamey'],
    ['NG','Nigeria','🇳🇬','Africa','NGN','₦',1450,0.28,0.32,0.18,'Swasta / Subsidi',0.38,60,46,61,'west_african','Lagos'],
    ['RW','Rwanda','🇷🇼','Africa','RWF','RF ',1290,0.22,0.32,0.16,'Subsidi',0.28,66,80,68,'east_african','Kigali'],
    ['ST','São Tomé & Príncipe','🇸🇹','Africa','STN','Db ',22.6,0.22,0.36,0.14,'Subsidi',0.32,58,74,70,'west_african','São Tomé'],
    ['SN','Senegal','🇸🇳','Africa','XOF','CFA ',605,0.24,0.36,0.16,'Subsidi',0.35,58,72,69,'west_african','Dakar'],
    ['SC','Seychelles','🇸🇨','Africa','SCR','SR ',13.6,0.68,0.66,0.15,'Percuma',0.22,78,82,75,'east_african','Victoria'],
    ['SL','Sierra Leone','🇸🇱','Africa','SLE','Le ',22.5,0.15,0.30,0.14,'Terhad',0.30,46,62,61,'west_african','Freetown'],
    ['SO','Somalia','🇸🇴','Africa','SOS','Sh ',570,0.12,0.28,0.08,'Terhad',0.28,36,26,58,'east_african','Mogadishu'],
    ['ZA','Afrika Selatan','🇿🇦','Africa','ZAR','R ',18.5,0.52,0.46,0.26,'Subsidi / Swasta',0.42,74,48,66,'southern_african','Johannesburg'],
    ['SS','Sudan Selatan','🇸🇸','Africa','SSP','£ ',1300,0.12,0.30,0.10,'Terhad',0.30,36,28,57,'east_african','Juba'],
    ['SD','Sudan','🇸🇩','Africa','SDG','£ ',600,0.16,0.28,0.12,'Terhad',0.30,50,32,66,'arabic_me','Khartoum'],
    ['TZ','Tanzania','🇹🇿','Africa','TZS','TSh ',2560,0.20,0.30,0.16,'Subsidi',0.30,58,70,67,'east_african','Dar es Salaam'],
    ['TG','Togo','🇹🇬','Africa','XOF','CFA ',605,0.18,0.32,0.14,'Terhad',0.32,54,64,62,'west_african','Lomé'],
    ['TN','Tunisia','🇹🇳','Africa','TND','DT ',3.1,0.34,0.36,0.20,'Subsidi',0.32,72,70,77,'arabic_me','Tunis'],
    ['UG','Uganda','🇺🇬','Africa','UGX','USh ',3800,0.18,0.30,0.16,'Subsidi',0.30,58,62,65,'east_african','Kampala'],
    ['ZM','Zambia','🇿🇲','Africa','ZMW','ZK ',25,0.22,0.32,0.18,'Subsidi',0.32,58,68,64,'southern_african','Lusaka'],
    ['ZW','Zimbabwe','🇿🇼','Africa','USD','$',1,0.20,0.36,0.16,'Terhad',0.35,60,58,62,'southern_african','Harare'],

    // ================= NORTH AMERICA (23) =================
    ['AG','Antigua & Barbuda','🇦🇬','North America','XCD','EC$',2.7,0.62,0.68,0.00,'Subsidi',0.45,74,76,78,'anglosphere','St. John\'s'],
    ['BS','Bahamas','🇧🇸','North America','BSD','B$',1,0.88,0.86,0.00,'Subsidi / Swasta',0.55,76,70,75,'anglosphere','Nassau'],
    ['BB','Barbados','🇧🇧','North America','BBD','Bds$',2,0.66,0.72,0.24,'Percuma / Subsidi',0.32,82,76,78,'anglosphere','Bridgetown'],
    ['BZ','Belize','🇧🇿','North America','BZD','BZ$',2,0.38,0.48,0.18,'Subsidi',0.40,68,60,74,'latin_american','Belmopan'],
    ['CA','Kanada','🇨🇦','North America','CAD','C$',1.36,1.22,0.92,0.30,'Percuma (Medicare)',0.18,94,88,83,'anglosphere','Toronto'],
    ['CR','Costa Rica','🇨🇷','North America','CRC','₡',510,0.52,0.56,0.18,'Percuma / Subsidi',0.28,80,74,80,'latin_american','San José'],
    ['CU','Cuba','🇨🇺','North America','CUP','$MN ',24,0.24,0.34,0.15,'Percuma',0.15,82,74,78,'latin_american','Havana'],
    ['DM','Dominica','🇩🇲','North America','XCD','EC$',2.7,0.42,0.52,0.18,'Subsidi',0.38,72,76,76,'anglosphere','Roseau'],
    ['DO','Rep. Dominika','🇩🇴','North America','DOP','RD$',59,0.42,0.46,0.18,'Subsidi / Swasta',0.42,68,60,75,'latin_american','Santo Domingo'],
    ['SV','El Salvador','🇸🇻','North America','USD','$',1,0.34,0.44,0.18,'Subsidi',0.40,66,68,74,'latin_american','San Salvador'],
    ['GD','Grenada','🇬🇩','North America','XCD','EC$',2.7,0.46,0.54,0.18,'Subsidi',0.38,74,78,76,'anglosphere','St. George\'s'],
    ['GT','Guatemala','🇬🇹','North America','GTQ','Q ',7.8,0.32,0.42,0.14,'Terhad',0.40,58,52,73,'latin_american','Guatemala City'],
    ['HT','Haiti','🇭🇹','North America','HTG','G ',132,0.15,0.34,0.10,'Terhad',0.38,44,30,64,'west_african','Port-au-Prince'],
    ['HN','Honduras','🇭🇳','North America','HNL','L ',24.7,0.28,0.40,0.16,'Terhad',0.40,58,48,73,'latin_american','Tegucigalpa'],
    ['JM','Jamaica','🇯🇲','North America','JMD','J$',155,0.38,0.50,0.22,'Subsidi',0.42,70,50,74,'anglosphere','Kingston'],
    ['MX','Mexico','🇲🇽','North America','MXN','MX$',17.2,0.52,0.48,0.24,'Subsidi / Swasta',0.40,76,52,76,'latin_american','Mexico City'],
    ['NI','Nicaragua','🇳🇮','North America','NIO','C$',36.8,0.26,0.36,0.15,'Subsidi',0.35,62,62,75,'latin_american','Managua'],
    ['PA','Panama','🇵🇦','North America','USD','$',1,0.58,0.56,0.16,'Subsidi / Swasta',0.42,74,70,79,'latin_american','Panama City'],
    ['KN','Saint Kitts & Nevis','🇰🇳','North America','XCD','EC$',2.7,0.60,0.66,0.00,'Subsidi',0.42,76,76,76,'anglosphere','Basseterre'],
    ['LC','Saint Lucia','🇱🇨','North America','XCD','EC$',2.7,0.48,0.56,0.18,'Subsidi',0.40,74,72,76,'anglosphere','Castries'],
    ['VC','St. Vincent & Grenadines','🇻🇨','North America','XCD','EC$',2.7,0.44,0.52,0.18,'Subsidi',0.38,72,72,75,'anglosphere','Kingstown'],
    ['TT','Trinidad & Tobago','🇹🇹','North America','TTD','TT$',6.8,0.62,0.56,0.22,'Percuma / Subsidi',0.32,78,58,75,'anglosphere','Port of Spain'],
    ['US','Amerika Syarikat','🇺🇸','North America','USD','$',1,1.45,1.02,0.26,'Swasta / Insurans',0.95,90,68,79,'anglosphere','New York'],

    // ================= SOUTH AMERICA (12) =================
    ['AR','Argentina','🇦🇷','South America','ARS','AR$',880,0.46,0.46,0.25,'Percuma / Subsidi',0.30,82,64,77,'latin_american','Buenos Aires'],
    ['BO','Bolivia','🇧🇴','South America','BOB','Bs ',6.9,0.28,0.34,0.13,'Subsidi',0.35,66,62,71,'latin_american','La Paz'],
    ['BR','Brazil','🇧🇷','South America','BRL','R$',5.1,0.52,0.46,0.24,'Percuma (SUS)',0.28,74,52,76,'latin_american','São Paulo'],
    ['CL','Chile','🇨🇱','South America','CLP','CL$',950,0.64,0.58,0.22,'Subsidi / Swasta',0.38,82,70,81,'latin_american','Santiago'],
    ['CO','Colombia','🇨🇴','South America','COP','COL$',3900,0.40,0.40,0.20,'Subsidi',0.35,74,54,77,'latin_american','Bogotá'],
    ['EC','Ecuador','🇪🇨','South America','USD','$',1,0.38,0.42,0.18,'Subsidi',0.36,72,54,78,'latin_american','Quito'],
    ['GY','Guyana','🇬🇾','South America','GYD','G$',209,0.52,0.48,0.22,'Subsidi',0.38,68,62,70,'anglosphere','Georgetown'],
    ['PY','Paraguay','🇵🇾','South America','PYG','₲',7400,0.36,0.38,0.10,'Subsidi',0.36,68,64,74,'latin_american','Asunción'],
    ['PE','Peru','🇵🇪','South America','PEN','S/ ',3.75,0.40,0.42,0.18,'Subsidi',0.36,72,58,77,'latin_american','Lima'],
    ['SR','Suriname','🇸🇷','South America','SRD','SR$',34,0.34,0.42,0.18,'Subsidi',0.38,68,66,73,'western_europe','Paramaribo'],
    ['UY','Uruguay','🇺🇾','South America','UYU','$U ',39,0.68,0.64,0.24,'Subsidi',0.32,84,74,78,'latin_american','Montevideo'],
    ['VE','Venezuela','🇻🇪','South America','VES','Bs.S ',36,0.20,0.38,0.16,'Terhad',0.42,64,34,73,'latin_american','Caracas'],

    // ================= OCEANIA (14) =================
    ['AU','Australia','🇦🇺','Oceania','AUD','A$',1.52,1.32,0.96,0.28,'Percuma (Medicare)',0.22,94,88,84,'anglosphere','Sydney'],
    ['FJ','Fiji','🇫🇯','Oceania','FJD','FJ$',2.25,0.38,0.46,0.16,'Subsidi',0.35,72,72,70,'pacific_islander','Suva'],
    ['KI','Kiribati','🇰🇮','Oceania','AUD','A$',1.52,0.22,0.42,0.12,'Subsidi',0.32,58,76,68,'pacific_islander','Tarawa'],
    ['MH','Kepulauan Marshall','🇲🇭','Oceania','USD','$',1,0.28,0.50,0.12,'Subsidi',0.38,62,76,69,'pacific_islander','Majuro'],
    ['FM','Mikronesia','🇫🇲','Oceania','USD','$',1,0.26,0.48,0.10,'Subsidi',0.38,62,78,70,'pacific_islander','Palikir'],
    ['NR','Nauru','🇳🇷','Oceania','AUD','A$',1.52,0.36,0.54,0.10,'Subsidi',0.38,62,78,66,'pacific_islander','Yaren'],
    ['NZ','New Zealand','🇳🇿','Oceania','NZD','NZ$',1.66,1.18,0.92,0.28,'Percuma / Subsidi',0.22,93,90,83,'anglosphere','Auckland'],
    ['PW','Palau','🇵🇼','Oceania','USD','$',1,0.48,0.60,0.12,'Subsidi',0.40,74,84,74,'pacific_islander','Ngerulmud'],
    ['PG','Papua New Guinea','🇵🇬','Oceania','PGK','K ',3.8,0.24,0.42,0.18,'Terhad',0.38,52,46,66,'pacific_islander','Port Moresby'],
    ['WS','Samoa','🇼🇸','Oceania','WST','WS$',2.75,0.30,0.44,0.14,'Subsidi',0.34,68,78,73,'pacific_islander','Apia'],
    ['SB','Kepulauan Solomon','🇸🇧','Oceania','SBD','SI$',8.5,0.22,0.42,0.14,'Terhad',0.35,56,70,71,'pacific_islander','Honiara'],
    ['TO','Tonga','🇹🇴','Oceania','TOP','T$',2.38,0.30,0.46,0.14,'Subsidi',0.34,68,80,72,'pacific_islander','Nuku\'alofa'],
    ['TV','Tuvalu','🇹🇻','Oceania','AUD','A$',1.52,0.24,0.46,0.12,'Subsidi',0.34,62,82,69,'pacific_islander','Funafuti'],
    ['VU','Vanuatu','🇻🇺','Oceania','VUV','VT ',120,0.28,0.48,0.00,'Subsidi',0.36,62,78,72,'pacific_islander','Port Vila']
  ];

  const CONTINENT_THEMES = {
    'Asia':          { primary: '#dc2626', secondary: '#1e293b', accent: '#f59e0b' },
    'Europe':        { primary: '#1d4ed8', secondary: '#0f172a', accent: '#38bdf8' },
    'Africa':        { primary: '#15803d', secondary: '#1e293b', accent: '#eab308' },
    'North America': { primary: '#2563eb', secondary: '#1e1b4b', accent: '#ef4444' },
    'South America': { primary: '#059669', secondary: '#064e3b', accent: '#facc15' },
    'Oceania':       { primary: '#0284c7', secondary: '#0c4a6e', accent: '#2dd4bf' }
  };

  function buildGeneratedCountry(row) {
    const [id, name, flag, continent, currencyCode, currencySymbol, usdRate, salaryMult, costOfLiving, taxRate, healthTier, healthCostFactor, eduQuality, safetyIndex, lifeExp, cultureGroup, capital] = row;
    const pool = NAME_POOLS[cultureGroup] || NAME_POOLS.anglosphere;
    const toLocal = (usd) => Math.max(1, Math.round(usd * usdRate));
    const sal = (baseUsd) => Math.max(100, Math.round(baseUsd * salaryMult * usdRate));

    const jobs = [
      { id: `${id.toLowerCase()}_service`, title: 'Kru Kafe & Perkhidmatan', icon: '☕', minAge: 18, reqDegree: false, salary: sal(16000), desc: `Khidmat pelanggan & kafe tempatan di ${capital}.` },
      { id: `${id.toLowerCase()}_driver`, title: 'Pemandu Logistik & Penghantaran', icon: '🚚', minAge: 18, reqDegree: false, salary: sal(20000), desc: `Menghantar kargo dan bungkusan sekitar ${name}.` },
      { id: `${id.toLowerCase()}_sales`, title: 'Eksekutif Jualan & Runcit', icon: '🛍️', minAge: 18, reqDegree: false, salary: sal(24000), desc: `Pemasaran produk tempatan di bandar ${capital}.` },
      { id: `${id.toLowerCase()}_teacher`, title: 'Guru & Pendidik', icon: '📚', minAge: 22, reqDegree: true, salary: sal(34000), desc: `Mendidik generasi muda dalam sistem pendidikan ${name}.` },
      { id: `${id.toLowerCase()}_tech`, title: 'Jurutera Perisian', icon: '💻', minAge: 22, reqDegree: true, reqSmarts: 60, salary: sal(58000), desc: `Membina sistem digital dan aplikasi di ${capital}.` },
      { id: `${id.toLowerCase()}_finance`, title: 'Penganalisis Kewangan', icon: '📈', minAge: 22, reqDegree: true, reqSmarts: 65, salary: sal(64000), desc: `Mengurus pelaburan dan perbankan di ${name}.` },
      { id: `${id.toLowerCase()}_doctor`, title: 'Pegawai Perubatan / Doktor', icon: '🩺', minAge: 24, reqDegree: true, reqSmarts: 75, salary: sal(76000), desc: `Merawat pesakit di hospital utama ${capital}.` }
    ];

    const docPublicUsd = Math.round(60 * healthCostFactor);
    const docPrivateUsd = Math.round(240 * Math.max(0.35, healthCostFactor));
    const uniAnnualUsd = Math.round((eduQuality >= 85 ? 5500 : 2800) * Math.max(0.35, costOfLiving));

    const heritageId = cultureGroup;
    const heritageLabel = `Anak Jati ${name}`;

    return {
      id,
      name,
      demonym: name,
      flag,
      continent,
      currencyCode,
      currencySymbol,
      currency: { code: currencyCode, symbol: currencySymbol, decimals: 0 },
      usdRate,
      salaryMultiplier: salaryMult,
      costOfLivingIndex: costOfLiving,
      taxRate,
      healthcareQuality: { tier: healthTier, costFactor: healthCostFactor },
      educationQuality: eduQuality,
      safetyIndex,
      baseLifeExpectancy: lifeExp,
      lifeExpectancy: lifeExp,
      cultureGroup,
      namingStyle: pool.style || 'standard',
      theme: CONTINENT_THEMES[continent] || CONTINENT_THEMES.Asia,
      tagline: `Kehidupan di ${capital}, ${name} (${continent}) — Kesihatan: ${healthTier} • Keselamatan: ${safetyIndex}%`,
      highlights: [
        `Ibu Negara: ${capital}`,
        `Cukai: ${Math.round(taxRate * 100)}%`,
        `Kesihatan: ${healthTier}`,
        `Jangka Hayat: ${lifeExp} thn`
      ],
      healthcare: {
        type: `Kesihatan ${healthTier}`,
        doctorCost: healthCostFactor <= 0.16 ? 0 : toLocal(docPublicUsd),
        privateCost: toLocal(docPrivateUsd),
        desc: `Sistem kesihatan ${name}: ${healthTier} (Kualiti pendidikan ${eduQuality}%, Indeks Keselamatan ${safetyIndex}%).`
      },
      retirementScheme: `Dana Persaraan ${name}`,
      visaFeeUsd: Math.round(280 + salaryMult * 420),
      flightBaseUsd: continent === 'Asia' ? 420 : continent === 'Europe' ? 780 : continent === 'Oceania' ? 720 : 920,
      closeCultures: [],
      cities: ({
        DE: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt'],
        FR: ['Paris', 'Lyon', 'Marseille', 'Toulouse'],
        IT: ['Rom', 'Milan', 'Naples', 'Florence'],
        ES: ['Madrid', 'Barcelona', 'Valencia', 'Seville'],
        NL: ['Amsterdam', 'Rotterdam', 'Utrecht', 'The Hague'],
        SE: ['Stockholm', 'Gothenburg', 'Malmö', 'Uppsala'],
        CH: ['Zurich', 'Geneva', 'Basel', 'Bern'],
        AT: ['Vienna', 'Salzburg', 'Graz', 'Innsbruck'],
        BE: ['Brussels', 'Antwerp', 'Ghent', 'Bruges'],
        NO: ['Oslo', 'Bergen', 'Trondheim', 'Stavanger'],
        DK: ['Copenhagen', 'Aarhus', 'Odense', 'Aalborg'],
        FI: ['Helsinki', 'Tampere', 'Turku', 'Espoo'],
        PL: ['Warsaw', 'Krakow', 'Gdansk', 'Wroclaw'],
        PT: ['Lisbon', 'Porto', 'Faro', 'Coimbra'],
        IE: ['Dublin', 'Cork', 'Galway', 'Limerick'],
        GR: ['Athens', 'Thessaloniki', 'Patras', 'Heraklion'],
        TR: ['Istanbul', 'Ankara', 'Izmir', 'Antalya'],
        SA: ['Riyadh', 'Jeddah', 'Dammam', 'Madinah'],
        AE: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman'],
        QA: ['Doha', 'Al Wakrah', 'Al Khor', 'Lusail'],
        EG: ['Kaherah', 'Alexandria', 'Giza', 'Luxor'],
        ZA: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria'],
        BR: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'],
        MX: ['Bandar Mexico', 'Guadalajara', 'Monterrey', 'Cancún'],
        AR: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza'],
        CA: ['Toronto', 'Vancouver', 'Montreal', 'Calgary'],
        NZ: ['Auckland', 'Wellington', 'Christchurch', 'Queenstown'],
        KR: ['Seoul', 'Busan', 'Incheon', 'Daegu'],
        CN: ['Beijing', 'Shanghai', 'Shenzhen', 'Guangzhou'],
        TW: ['Taipei', 'Kaohsiung', 'Taichung', 'Tainan'],
        TH: ['Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya'],
        VN: ['Ho Chi Minh', 'Hanoi', 'Da Nang', 'Hue'],
        PH: ['Manila', 'Cebu', 'Davao', 'Makati'],
        ID: ['Jakarta', 'Surabaya', 'Bandung', 'Bali'],
        SG: ['Singapura', 'Jurong', 'Tampines', 'Woodlands'],
        IN: ['Mumbai', 'New Delhi', 'Bengaluru', 'Hyderabad'],
        PK: ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi'],
        BD: ['Dhaka', 'Chittagong', 'Sylhet', 'Khulna'],
        AF: ['Kabul', 'Herat', 'Mazar-i-Sharif', 'Kandahar'],
        RU: ['Moscow', 'Saint Petersburg', 'Kazan', 'Novosibirsk'],
        UA: ['Kyiv', 'Lviv', 'Odesa', 'Kharkiv']
      }[id] || [capital, `${capital} Utara`, `${capital} Selatan`]),
      slang: ['hebat', 'mantap', 'selamat'],
      heritages: [{ id: heritageId, label: heritageLabel }],
      names: {
        [heritageId]: {
          male: pool.male,
          female: pool.female,
          last: pool.last,
          ...(pool.lastFemale ? { lastFemale: pool.lastFemale } : {})
        }
      },
      education: {
        preschool: { name: 'Prasekolah', startAge: 5 },
        primary: { name: 'Sekolah Rendah', startAge: 7, examAge: 12, examName: `Peperiksaan Rendah ${name}` },
        secondary: { name: 'Sekolah Menengah', startAge: 13, examAge: 17, examName: `Sijil Menengah Kebangsaan ${name}` },
        preU: { name: 'Kolej Pra-Universiti', startAge: 18, duration: 2 },
        universities: [`Universiti Kebangsaan ${name}`, `Institut Teknologi ${capital}`, `Universiti Antarabangsa ${capital}`],
        uniTuitionAnnual: toLocal(uniAnnualUsd),
        uniDuration: 4
      },
      festivals: [
        { name: `Hari Kebangsaan ${name}`, icon: flag, desc: `Perarakan gilang-gemilang, muzik tradisi dan bunga api di ${capital}!` },
        { name: `Festival Budaya & Makanan ${capital}`, icon: '🎉', desc: `Menikmati juadah warisan tempatan dan persembahan seni ${name}!` }
      ],
      cultureActivities: [
        { id: `${id.toLowerCase()}_food`, title: `Cuba Juadah Warisan ${name}`, icon: '🍽️', desc: `Nikmati hidangan paling terkenal di pasar tradisi ${capital}.`, cost: toLocal(Math.max(8, Math.round(25 * costOfLiving))), effects: { happiness: 11, adaptation: 10 } },
        { id: `${id.toLowerCase()}_tour`, title: `Teroka Mercu Tanda ${capital}`, icon: '🏛️', desc: `Lawati muzium, taman bersejarah dan pemandangan ikonik ${name}.`, cost: toLocal(Math.max(10, Math.round(35 * costOfLiving))), effects: { happiness: 10, smarts: 3, adaptation: 10 } },
        { id: `${id.toLowerCase()}_lang`, title: `Dalami Bahasa & Adat ${name}`, icon: '🗣️', desc: `Bergaul mesra dengan penduduk tempatan untuk penyesuaian pantas.`, cost: toLocal(Math.max(8, Math.round(20 * costOfLiving))), effects: { smarts: 4, adaptation: 14 } }
      ],
      jobs,
      assets: {
        vehicles: [
          { id: `${id.toLowerCase()}_moto`, name: `Motosikal Bandar ${name}`, icon: '🛵', price: toLocal(Math.round(2200 * Math.max(0.5, costOfLiving))), upkeep: toLocal(140), happiness: 6 },
          { id: `${id.toLowerCase()}_sedan`, name: 'Kereta Sedan Keluarga', icon: '🚗', price: toLocal(Math.round(18000 * Math.max(0.55, costOfLiving))), upkeep: toLocal(850), happiness: 14 },
          { id: `${id.toLowerCase()}_suv`, name: 'SUV Mewah Eksekutif', icon: '🚙', price: toLocal(Math.round(52000 * Math.max(0.65, costOfLiving))), upkeep: toLocal(2200), happiness: 22 }
        ],
        properties: [
          { id: `${id.toLowerCase()}_apt`, name: `Apartmen Moden di ${capital}`, icon: '🏢', price: toLocal(Math.round(95000 * Math.max(0.35, costOfLiving))), upkeep: toLocal(Math.round(1500 * costOfLiving)), happiness: 12 },
          { id: `${id.toLowerCase()}_house`, name: `Rumah Keluarga ${capital}`, icon: '🏡', price: toLocal(Math.round(260000 * Math.max(0.4, costOfLiving))), upkeep: toLocal(Math.round(3200 * costOfLiving)), happiness: 22 },
          { id: `${id.toLowerCase()}_villa`, name: `Vila Mewah ${name}`, icon: '🏰', price: toLocal(Math.round(780000 * Math.max(0.45, costOfLiving))), upkeep: toLocal(Math.round(8500 * costOfLiving)), happiness: 32 }
        ]
      }
    };
  }

  window.COUNTRIES = window.COUNTRIES || {};
  window.COUNTRY_INVESTMENTS = window.COUNTRY_INVESTMENTS || {};

  // Enrich 10 flagship countries & hydrate the other 185 sovereign countries = 195 total!
  for (const row of WORLD_LIST) {
    const [id, name, flag, continent, currencyCode, currencySymbol, usdRate, salaryMult, costOfLiving, taxRate, healthTier, healthCostFactor, eduQuality, safetyIndex, lifeExp, cultureGroup] = row;
    if (window.COUNTRIES[id]) {
      const ex = window.COUNTRIES[id];
      ex.continent = continent;
      ex.currencyCode = currencyCode;
      ex.currencySymbol = currencySymbol;
      ex.salaryMultiplier = salaryMult;
      ex.healthcareQuality = { tier: healthTier, costFactor: healthCostFactor };
      ex.educationQuality = eduQuality;
      ex.safetyIndex = safetyIndex;
      ex.baseLifeExpectancy = lifeExp;
      ex.cultureGroup = cultureGroup;
      ex.namingStyle = (NAME_POOLS[cultureGroup] && NAME_POOLS[cultureGroup].style) || 'standard';
    } else {
      window.COUNTRIES[id] = buildGeneratedCountry(row);
    }

    if (!window.COUNTRY_INVESTMENTS[id]) {
      window.COUNTRY_INVESTMENTS[id] = {
        name: `Indeks Bursa & Amanah ${name}`,
        minYield: salaryMult >= 0.9 ? 4 : 3,
        maxYield: salaryMult >= 0.9 ? 11 : 13
      };
    }
  }

  window.WORLD_CONTINENTS = [
    { id: 'ALL', label: `Semua (${Object.keys(window.COUNTRIES).length})` },
    { id: 'Asia', label: 'Asia' },
    { id: 'Europe', label: 'Eropah' },
    { id: 'Africa', label: 'Afrika' },
    { id: 'North America', label: 'Amerika Utara' },
    { id: 'South America', label: 'Amerika Selatan' },
    { id: 'Oceania', label: 'Oceania' }
  ];
})();
