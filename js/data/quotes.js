/* ==========================================================================
   WorldLife — Koleksi Kata-Kata Hikmah & Falsafah Kehidupan Kontekstual
   ========================================================================== */

window.LIFE_QUOTES = [
  {
    "category": "new_life",
    "quote": "Bukan masa hidup kita yang singkat, tetapi kitalah yang terlalu banyak membazirkannya.",
    "author": "Seneca"
  },
  {
    "category": "new_life",
    "quote": "Masa anda terhad, jadi jangan bazirkannya dengan menjalani kehidupan orang lain.",
    "author": "Steve Jobs"
  },
  {
    "category": "new_life",
    "quote": "Buat apa yang anda mampu, dengan apa yang anda ada, di mana sahaja anda berada.",
    "author": "Theodore Roosevelt"
  },
  {
    "category": "new_life",
    "quote": "Hidup adalah pengembaraan yang berani, atau tiada apa-apa langsung.",
    "author": "Helen Keller"
  },
  {
    "category": "rich_or_great",
    "quote": "Apa yang kamu tinggalkan bukanlah apa yang terukir di atas batu monumen, tetapi apa yang terjalin dalam kehidupan orang lain.",
    "author": "Pericles"
  },
  {
    "category": "rich_or_great",
    "quote": "Benar-benar hidup adalah perkara paling jarang berlaku di dunia. Kebanyakan orang sekadar wujud, itu sahaja.",
    "author": "Oscar Wilde"
  },
  {
    "category": "rich_or_great",
    "quote": "Kalau hidup sekadar hidup, babi di hutan juga hidup. Kalau bekerja sekadar bekerja, kera juga bekerja.",
    "author": "Buya Hamka"
  },
  {
    "category": "rich_or_great",
    "quote": "Misi aku dalam hidup bukan sekadar untuk bertahan, tetapi untuk berkembang — dengan semangat, belas kasihan, jenaka, dan gaya.",
    "author": "Maya Angelou"
  },
  {
    "category": "struggle",
    "quote": "Jangan berdoa untuk hidup yang mudah; berdoalah agar diberi kekuatan untuk mengharungi hidup yang sukar.",
    "author": "Bruce Lee"
  },
  {
    "category": "struggle",
    "quote": "Di tengah-tengah musim sejuk yang paling dingin, aku temui bahawa di dalam diriku ada musim panas yang tidak terkalahkan.",
    "author": "Albert Camus"
  },
  {
    "category": "struggle",
    "quote": "Sesiapa yang mempunyai 'sebab' untuk hidup, mampu menanggung hampir apa sahaja 'cara' untuk bertahan.",
    "author": "Friedrich Nietzsche"
  },
  {
    "category": "struggle",
    "quote": "Hidup ialah apa yang sedang berlaku ketika anda sibuk merancang perkara lain.",
    "author": "John Lennon"
  },
  {
    "category": "tarnished",
    "quote": "Kehidupan yang tidak pernah direnungi dan dinilai tidak layak untuk dijalani.",
    "author": "Socrates"
  },
  {
    "category": "tarnished",
    "quote": "Apabila kita tidak lagi mampu mengubah sesuatu keadaan, kita dicabar untuk mengubah diri kita sendiri.",
    "author": "Viktor E. Frankl"
  },
  {
    "category": "tarnished",
    "quote": "Jangan buang masa lagi berdebat tentang bagaimana rupa manusia yang baik. Jadilah orangnya.",
    "author": "Marcus Aurelius"
  },
  {
    "category": "tarnished",
    "quote": "Hidup hanya boleh difahami apabila melihat ke belakang, tetapi ia tetap perlu dijalani ke hadapan.",
    "author": "Søren Kierkegaard"
  },
  {
    "category": "redeemed_or_prime",
    "quote": "Keberanian bukanlah ketiadaan rasa takut, tetapi kemenangan mengatasi ketakutan itu.",
    "author": "Nelson Mandela"
  },
  {
    "category": "redeemed_or_prime",
    "quote": "Hidup umpama menunggang basikal. Untuk kekal seimbang, anda mesti terus bergerak.",
    "author": "Albert Einstein"
  },
  {
    "category": "redeemed_or_prime",
    "quote": "Luka adalah tempat di mana cahaya masuk ke dalam dirimu.",
    "author": "Rumi"
  }
];

window.Quotes = {
  getByCategory(category) {
    const matches = window.LIFE_QUOTES.filter(q => q.category === category);
    const pool = matches.length > 0 ? matches : window.LIFE_QUOTES;
    return pool[Math.floor(Math.random() * pool.length)];
  },

  getContextualQuoteForState(s) {
    if (!s) return this.getByCategory('new_life');
    const dyn = window.Dynasty ? Dynasty.getData() : null;
    if (dyn && dyn.legacyStatus === 'Tarnished') {
      return this.getByCategory('tarnished');
    }
    if (dyn && (dyn.legacyStatus === 'Redeemed' || (s.generation && Dynasty.isPrime(s.generation)))) {
      return this.getByCategory('redeemed_or_prime');
    }
    const netUsd = window.GameState ? Utils.localToUsd(GameState.getNetWorth(), s.countryId) : 0;
    const a = s.alignment || {};
    if (netUsd >= 250000 || (a.peakFame || a.fame || 0) >= 55 || (a.karma || 0) >= 45) {
      return this.getByCategory('rich_or_great');
    }
    if (s.money < 0 || (s.prison && s.prison.totalServed > 0) || s.stats.happiness < 45 || (s.recentCrises && s.recentCrises.length >= 2)) {
      return this.getByCategory('struggle');
    }
    return this.getByCategory('new_life');
  },

  renderQuoteCard(quoteObj, label = 'Renungan Kehidupan') {
    if (!quoteObj) return '';
    return `
      <blockquote class="quote-card">
        <div class="qc-label">✨ ${Utils.escapeHtml(label)}</div>
        <p class="qc-text">“${Utils.escapeHtml(quoteObj.quote)}”</p>
        <footer class="qc-author">— ${Utils.escapeHtml(quoteObj.author)}</footer>
      </blockquote>
    `;
  }
};
