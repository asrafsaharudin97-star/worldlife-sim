/* ==========================================================================
   WorldLife — Enjin Hubungan Sosial, Rakan, Pasangan & Perkahwinan
   (Termasuk Peraturan Patuh Syariah untuk Watak Beragama Islam)
   ========================================================================== */

window.Relationships = {
  isMuslim(s) {
    return Boolean(s && s.belief === 'islam');
  },

  ensureRelationshipFields(s) {
    if (!s || !Array.isArray(s.relationships)) return;
    const famBelief = s.familyBelief || s.belief || 'unassigned';
    for (const r of s.relationships) {
      if (typeof r.trust !== 'number') r.trust = Utils.clamp((r.closeness || 65) + Utils.randInt(-8, 8), 20, 100);
      if (typeof r.compatibility !== 'number') r.compatibility = Utils.randInt(55, 95);
      if (!r.belief) {
        if (['Ibu', 'Ayah', 'Abang', 'Kakak', 'Adik/Abang', 'Adik/Kakak', 'Anak Lelaki', 'Anak Perempuan'].includes(r.role)) {
          r.belief = famBelief;
        } else {
          r.belief = window.LIFE_EVENTS ? window.LIFE_EVENTS.pickFamilyBelief(r.countryId || s.countryId) : 'unassigned';
        }
      }
      if (!r.category) {
        if (r.id === s.partnerId) r.category = s.married ? 'spouse' : 'partner';
        else if (r.role === 'Rakan' || r.role === 'Sahabat Karib') r.category = 'friend';
        else if (r.role === 'Bekas Pasangan') r.category = 'ex';
        else r.category = 'family';
      }
      if (r.id === s.partnerId && !r.stage) {
        if (s.married) r.stage = 'married';
        else r.stage = this.isMuslim(s) ? 'taaruf' : 'dating';
      }
    }
  },

  computeCompatibility(s, npcBelief) {
    let base = Utils.randInt(52, 92);
    if (s.belief && npcBelief && s.belief === npcBelief) base = Utils.clamp(base + 12, 40, 100);
    else if (this.isMuslim(s) && npcBelief !== 'islam') base = Utils.clamp(base - 10, 30, 85);
    return base;
  },

  // --------------------------------------------------------------------------
  // 1. RAKAN-RAKAN (Sekolah, Tempat Kerja, Komuniti)
  // --------------------------------------------------------------------------
  meetFriend(source = 'auto') {
    const s = GameState.current;
    GameState.ensureUpgradedState();
    this.ensureRelationshipFields(s);

    if (s.age < 7) return { ok: false, msg: 'Anda masih terlalu kecil — tunggu umur 7 tahun untuk cari kawan baru!' };
    if (s.yearlyActions.meetFriend) return { ok: false, msg: 'Anda sudah berkenalan dengan rakan baru tahun ini.' };

    const activeFriends = s.relationships.filter(r => r.alive && r.category === 'friend');
    if (activeFriends.length >= 6) {
      return { ok: false, msg: 'Lingkaran rakan anda sudah penuh (maksimum 6 rakan aktif).' };
    }

    const c = Utils.getCountry(s.countryId);
    let origin = source;
    if (origin === 'auto') {
      if (s.age < 18 || s.education.stage === 'university') origin = 'Sekolah / Kampus';
      else if (s.job && Utils.chance(0.55)) origin = 'Tempat Kerja';
      else origin = 'Komuniti';
    }

    const gender = Utils.chance(0.5) ? 'male' : 'female';
    const heritage = Utils.pick(c.heritages).id;
    const name = Utils.generateName(s.countryId, gender, heritage);
    const belief = window.LIFE_EVENTS ? window.LIFE_EVENTS.pickFamilyBelief(s.countryId, heritage) : 'unassigned';
    const age = Utils.clamp(s.age + Utils.randInt(-4, 5), 7, 82);
    const job = age < 18 ? 'Pelajar' : (origin === 'Tempat Kerja' && s.job ? `Rakan Sekerja (${s.job.title})` : Utils.pick(c.jobs).title);
    const compat = this.computeCompatibility(s, belief);

    const friend = {
      id: 'rel_friend_' + Date.now() + '_' + Utils.randInt(10, 99),
      name,
      role: 'Rakan',
      category: 'friend',
      origin,
      gender,
      age,
      countryId: s.countryId,
      closeness: Utils.randInt(45, 70),
      trust: Utils.randInt(45, 72),
      compatibility: compat,
      belief,
      alive: true,
      job
    };

    s.relationships.push(friend);
    s.yearlyActions.meetFriend = true;
    GameState.adjustStats({ happiness: 7, adaptation: 6 });
    const bObj = GameState.getBeliefObj(belief);
    GameState.addJournalEntry(
      `🤝 Anda berkenalan dengan rakan baru, ${name} (${age} thn, ${origin}, ${bObj.icon} ${bObj.name}) di ${s.city}.`,
      'culture'
    );
    GameState.save();
    return { ok: true, msg: `Anda kini berkawan dengan ${name} (${origin})!` };
  },

  // --------------------------------------------------------------------------
  // 2. CARI PASANGAN / TA'ARUF (Patuh Peraturan Agama)
  // --------------------------------------------------------------------------
  meetLocalDate() {
    const s = GameState.current;
    GameState.ensureUpgradedState();
    this.ensureRelationshipFields(s);
    const c = Utils.getCountry(s.countryId);

    const muslim = this.isMuslim(s);
    const minAge = muslim ? 18 : 16;
    if (s.age < minAge) {
      return {
        ok: false,
        msg: muslim
          ? 'Tunggu sehingga umur 18 tahun untuk memulakan proses ta\'aruf yang serius!'
          : 'Tunggu sehingga umur 16 tahun untuk bercinta!'
      };
    }
    if (s.partnerId) return { ok: false, msg: 'Anda sudah mempunyai pasangan!' };

    // Sentiasa pasangan berlawanan jantina (mematuhi peraturan ketat untuk watak Islam juga)
    const targetGender = s.gender === 'male' ? 'female' : 'male';
    const heritage = Utils.pick(c.heritages).id;
    const name = Utils.generateName(s.countryId, targetGender, heritage);
    const job = Utils.pick(c.jobs).title;
    const age = Utils.clamp(s.age + Utils.randInt(-3, 4), minAge, 75);

    let partnerBelief;
    if (muslim) {
      // Majoriti sesi ta'aruf memperkenalkan calon sesama Islam, namun sekali-sekala (20%) mungkin berkenalan dengan calon berlainan agama -> mencetuskan dilema batas agama!
      partnerBelief = Utils.chance(0.80)
        ? 'islam'
        : Utils.pick(['christianity', 'buddhism', 'hinduism', 'agnostic']);
    } else {
      partnerBelief = window.LIFE_EVENTS
        ? window.LIFE_EVENTS.pickFamilyBelief(s.countryId, heritage)
        : 'unassigned';
    }

    const compat = this.computeCompatibility(s, partnerBelief);
    const roleLabel = muslim
      ? (targetGender === 'female' ? 'Calon Ta\'aruf (Wanita)' : 'Calon Ta\'aruf (Lelaki)')
      : (targetGender === 'female' ? 'Teman Wanita' : 'Teman Lelaki');

    const partner = {
      id: 'rel_partner_' + Date.now(),
      name,
      role: roleLabel,
      category: 'partner',
      stage: muslim ? 'taaruf' : 'dating',
      origin: muslim ? 'Ta\'aruf / Keluarga' : 'Janji Temu',
      gender: targetGender,
      age,
      countryId: s.countryId,
      closeness: Utils.randInt(54, 76),
      trust: Utils.randInt(58, 82),
      compatibility: compat,
      belief: partnerBelief,
      alive: true,
      job
    };

    s.relationships.push(partner);
    s.partnerId = partner.id;
    GameState.adjustStats({ happiness: 12, adaptation: 8 });
    const bObj = GameState.getBeliefObj(partnerBelief);

    if (muslim && partnerBelief !== 'islam') {
      GameState.addJournalEntry(
        `🤲 Anda berkenalan dengan ${name} (${age} thn, ${job}, ${bObj.icon} ${bObj.name}) di ${s.city}. Perbezaan agama memerlukan perbincangan jujur mengenai batas syariah.`,
        'spiritual'
      );
      GameState.save();
      return {
        ok: true,
        msg: `Berkenalan dengan ${name} (${bObj.name}) — ada batas agama yang perlu dibincangkan.`,
        followUpEvent: window.LIFE_EVENTS.buildInterfaithDilemmaEvent(s, partner, 'meeting')
      };
    }

    GameState.addJournalEntry(
      muslim
        ? `🤲 Melalui ta'aruf dan cadangan keluarga di ${s.city}, anda mula mengenali ${name} (${age} thn, ${job}, ${bObj.icon} ${bObj.name}) secara terhormat menuju ke alam perkahwinan.`
        : `💘 Anda berkenalan dengan ${name} (${age} thn, ${job}, ${bObj.icon} ${bObj.name}) di ${s.city}, ${c.name} ${c.flag} dan mula bercinta!`,
      'romance'
    );
    GameState.save();
    return {
      ok: true,
      msg: muslim ? `Anda mula proses ta'aruf bersama ${name}!` : `Anda kini bercinta dengan ${name}!`
    };
  },

  // --------------------------------------------------------------------------
  // 3. INTERAKSI HUBUNGAN (Keluarga, Rakan, Pasangan, Suami/Isteri)
  // --------------------------------------------------------------------------
  interactRelation(relId, action) {
    const s = GameState.current;
    GameState.ensureUpgradedState();
    this.ensureRelationshipFields(s);

    const rel = s.relationships.find(r => r.id === relId);
    if (!rel || !rel.alive) return { ok: false, msg: 'Tidak dapat berinteraksi.' };

    const muslim = this.isMuslim(s);
    const nonRepeatable = !['engage', 'propose', 'have_kid', 'breakup', 'cohabit', 'cut_ties', 'interfaith_talk'].includes(action);
    const key = `rel_${relId}_${action}`;
    if (nonRepeatable && s.yearlyActions[key]) {
      return { ok: false, msg: `Anda sudah melakukan ini dengan ${rel.name} tahun ini.` };
    }

    const c = Utils.getCountry(s.countryId);
    const longDist = rel.countryId !== s.countryId;

    // --- Luangkan masa ---
    if (action === 'spend_time') {
      s.yearlyActions[key] = true;
      rel.closeness = Utils.clamp(rel.closeness + Utils.randInt(8, 15));
      rel.trust = Utils.clamp((rel.trust || 60) + Utils.randInt(4, 10));
      if (rel.category === 'friend' && rel.closeness >= 85 && rel.trust >= 80) {
        rel.role = 'Sahabat Karib';
      }
      GameState.adjustStats({ happiness: 7 });
      const text = longDist
        ? `📱 Membuat panggilan video mesra bertanya khabar ${rel.name} di ${Utils.getCountry(rel.countryId).name}!`
        : (muslim && rel.category === 'partner' && !s.married)
          ? `☕ Berbual secara sopan dengan ${rel.name} (ditemani keluarga/di tempat awam) untuk saling mengenali hati budi.`
          : `😊 Meluangkan masa berkualiti bersama ${rel.name} di ${s.city}.`;
      GameState.addJournalEntry(text);
      GameState.save();
      return { ok: true, msg: `Hubungan dengan ${rel.name} makin erat!` };
    }

    // --- Hadiah ---
    if (action === 'gift') {
      const cost = Utils.usdToLocal(45, s.countryId);
      if (s.money < cost) return { ok: false, msg: `Perlukan ${Utils.formatMoney(cost, s.countryId)} untuk hadiah.` };
      s.yearlyActions[key] = true;
      s.money -= cost;
      rel.closeness = Utils.clamp(rel.closeness + Utils.randInt(12, 18));
      rel.trust = Utils.clamp((rel.trust || 60) + Utils.randInt(5, 10));
      GameState.adjustStats({ happiness: 6 });
      GameState.addJournalEntry(`🎁 Menghadiahkan cenderahati (${Utils.formatMoney(cost, s.countryId)}) kepada ${rel.name}!`);
      GameState.save();
      return { ok: true, msg: `${rel.name} amat menyukai hadiah anda!` };
    }

    // --- Rakan: Minta Rujukan Kerja / Peluang Bisnes ---
    if (action === 'ask_referral') {
      if (rel.category !== 'friend') return { ok: false, msg: 'Hanya untuk rakan!' };
      if (s.age < 18) return { ok: false, msg: 'Tunggu umur 18 tahun!' };
      if (rel.closeness < 70 || (rel.trust || 0) < 70) {
        return { ok: false, msg: `Perlukan Kemesraan 70%+ & Kepercayaan 70%+ bersama ${rel.name} dahulu!` };
      }
      s.yearlyActions[key] = true;
      if (s.job) {
        const bonus = Utils.usdToLocal(Utils.randInt(600, 2200), s.countryId);
        s.money += bonus;
        s.job.performance = Utils.clamp(s.job.performance + 8);
        GameState.adjustStats({ happiness: 8 });
        GameState.addJournalEntry(
          `🤝 Rakan anda, ${rel.name}, memperkenalkan pelanggan & rujukan projek yang memberi anda pendapatan tambahan ${Utils.formatMoney(bonus, s.countryId)}!`,
          'milestone'
        );
        GameState.save();
        return { ok: true, msg: `${rel.name} membantu anda meraih ${Utils.formatMoney(bonus, s.countryId)}!` };
      } else {
        const eligible = c.jobs.filter(j => (!j.reqDegree || s.education.hasDegree));
        const picked = Utils.pick(eligible) || c.jobs[0];
        s.job = {
          id: picked.id,
          title: picked.title,
          icon: picked.icon,
          salary: Math.round(picked.salary * 1.08),
          years: 0,
          performance: 72,
          countryId: s.countryId
        };
        GameState.adjustStats({ happiness: 14 });
        GameState.addJournalEntry(
          `💼 Melalui rujukan kuat daripada sahabat anda ${rel.name}, anda terus diterima bekerja sebagai ${picked.title} (${Utils.formatMoney(s.job.salary, s.countryId)}/thn)!`,
          'milestone'
        );
        GameState.save();
        return { ok: true, msg: `Berjaya dapat kerja sebagai ${picked.title} hasil rujukan ${rel.name}!` };
      }
    }

    // --- Rakan: Putuskan Persahabatan ---
    if (action === 'cut_ties') {
      rel.alive = false; // keluarkan daripada senarai aktif
      rel.category = 'ex';
      GameState.adjustStats({ happiness: -4 });
      GameState.addJournalEntry(`🚪 Anda memilih untuk menjauhkan diri daripada ${rel.name} demi ketenangan hidup.`);
      GameState.save();
      return { ok: true, msg: `Anda tidak lagi berkawan dengan ${rel.name}.` };
    }

    // --- Bincang Batas Agama (untuk watak Islam bersama calon bukan Islam) ---
    if (action === 'interfaith_talk') {
      return {
        ok: true,
        msg: 'Membuka perbincangan jujur tentang batas agama...',
        followUpEvent: window.LIFE_EVENTS.buildInterfaithDilemmaEvent(s, rel, 'talk')
      };
    }

    // --- Tinggal Bersama Sebelum Kahwin (DISEKAT KETAT untuk watak Islam!) ---
    if (action === 'cohabit') {
      if (muslim) {
        return { ok: false, msg: 'Tidak dibenarkan bagi watak beragama Islam — teruskan melalui bertunang dan akad nikah yang sah.' };
      }
      if (s.married || rel.stage === 'cohabiting') return { ok: false, msg: 'Anda sudah tinggal bersama!' };
      if (rel.closeness < 65) return { ok: false, msg: 'Eratkan kemesraan ke 65%+ dahulu!' };
      rel.stage = 'cohabiting';
      rel.closeness = Utils.clamp(rel.closeness + 10);
      GameState.adjustStats({ happiness: 10 });
      GameState.addJournalEntry(`🏠 Anda dan ${rel.name} memutuskan untuk tinggal sebumbung di ${s.city}.`, 'romance');
      GameState.save();
      return { ok: true, msg: `Anda kini tinggal bersama ${rel.name}!` };
    }

    // --- Merisik & Bertunang ---
    if (action === 'engage') {
      if (s.married) return { ok: false, msg: 'Anda sudah berkahwin!' };
      if (rel.stage === 'engaged') return { ok: false, msg: 'Anda sudah bertunang!' };
      if (muslim && rel.belief !== 'islam') {
        return {
          ok: false,
          msg: 'Bincangkan batas agama terlebih dahulu sebelum bertunang secara sah.',
          followUpEvent: window.LIFE_EVENTS.buildInterfaithDilemmaEvent(s, rel, 'marriage_block')
        };
      }
      if (rel.closeness < 60) return { ok: false, msg: `Eratkan hubungan dengan ${rel.name} ke 60%+ dahulu!` };
      const cost = Utils.usdToLocal(350, s.countryId);
      if (s.money < cost) return { ok: false, msg: `Kos majlis merisik/bertunang ialah ${Utils.formatMoney(cost, s.countryId)}.` };
      s.money -= cost;
      rel.stage = 'engaged';
      rel.role = 'Tunang';
      rel.closeness = Utils.clamp(rel.closeness + 14);
      rel.trust = Utils.clamp((rel.trust || 65) + 12);
      GameState.adjustStats({ happiness: 16 });
      GameState.addJournalEntry(
        muslim
          ? `💍 Majlis merisik & pertunangan bersama ${rel.name} berlangsung penuh adat dan restu keluarga di ${s.city}!`
          : `💍 Anda dan ${rel.name} kini rasmi bertunang di ${s.city}!`,
        'romance'
      );
      GameState.save();
      return { ok: true, msg: `Tahniah! Anda kini bertunang dengan ${rel.name}!` };
    }

    // --- Lamar / Akad Nikah & Berkahwin ---
    if (action === 'propose') {
      if (s.married) return { ok: false, msg: 'Anda sudah berkahwin!' };
      if (muslim && rel.gender === s.gender) {
        return { ok: false, msg: 'Perkahwinan sejenis tidak dibenarkan bagi watak beragama Islam.' };
      }
      if (muslim && rel.belief !== 'islam') {
        return {
          ok: false,
          msg: 'Perkahwinan berlainan agama tidak sah bagi watak Islam. Selesaikan isu kepercayaan dahulu.',
          followUpEvent: window.LIFE_EVENTS.buildInterfaithDilemmaEvent(s, rel, 'marriage_block')
        };
      }
      if (rel.closeness < 70) return { ok: false, msg: `${rel.name} belum bersedia — eratkan kemesraan ke 70%+ dahulu!` };
      const ringCost = Utils.usdToLocal(1800, s.countryId);
      if (s.money < ringCost) return { ok: false, msg: `Kos akad nikah / kenduri kahwin ialah ${Utils.formatMoney(ringCost, s.countryId)}.` };
      s.money -= ringCost;
      s.married = true;
      rel.category = 'spouse';
      rel.stage = 'married';
      rel.role = rel.gender === 'female' ? 'Isteri' : 'Suami';
      rel.closeness = 100;
      rel.trust = Utils.clamp((rel.trust || 75) + 15);
      GameState.adjustStats({ happiness: 24, adaptation: 12 });
      GameState.addJournalEntry(
        muslim
          ? `💍 Alhamdulillah! Dengan sekali lafaz akad nikah, anda dan ${rel.name} sah bergelar suami isteri di ${s.city}, ${c.name} ${c.flag}!`
          : `💍 Anda selamat berkahwin dengan ${rel.name} dalam majlis perkahwinan indah di ${s.city}, ${c.name} ${c.flag}!`,
        'romance'
      );
      GameState.save();
      return { ok: true, msg: `Tahniah! Selamat pengantin baru bersama ${rel.name}!` };
    }

    // --- Percutian / Luangkan Masa Rumah Tangga ---
    if (action === 'family_trip') {
      if (!s.married) return { ok: false, msg: 'Hanya untuk pasangan berkahwin!' };
      const cost = Utils.usdToLocal(450, s.countryId);
      if (s.money < cost) return { ok: false, msg: `Perlukan ${Utils.formatMoney(cost, s.countryId)} untuk percutian keluarga.` };
      s.yearlyActions[key] = true;
      s.money -= cost;
      rel.closeness = Utils.clamp(rel.closeness + 18);
      rel.trust = Utils.clamp((rel.trust || 70) + 12);
      GameState.adjustStats({ happiness: 14, health: 4 });
      GameState.addJournalEntry(`✈️ Percutian manis bersama ${rel.role.toLowerCase()} anda, ${rel.name}, menyegarkan semula keharmonian rumah tangga!`, 'romance');
      GameState.save();
      return { ok: true, msg: 'Rumah tangga semakin harmoni!' };
    }

    // --- Timang Cahaya Mata (WAJIB berkahwin untuk watak Islam!) ---
    if (action === 'have_kid') {
      if (s.age < 18) return { ok: false, msg: 'Tunggu sehingga dewasa!' };
      if (muslim && !s.married) {
        return { ok: false, msg: 'Bagi watak beragama Islam, cahaya mata hanya selepas akad nikah yang sah.' };
      }
      if (s.yearlyActions.had_kid) return { ok: false, msg: 'Anda sudah menimang cahaya mata tahun ini!' };
      s.yearlyActions.had_kid = true;
      const kidGender = Utils.chance(0.5) ? 'male' : 'female';
      const heritage = (s.heritageId && c.names[s.heritageId]) ? s.heritageId : Utils.pick(c.heritages).id;
      const fatherFullName = s.gender === 'male' ? s.name : rel.name;
      const isOutOfWedlock = !s.married;
      const kidName = Utils.generateChildName({
        countryId: s.countryId,
        gender: kidGender,
        heritageId: heritage,
        belief: s.belief || 'unassigned',
        fatherFullName,
        isAdopted: false,
        isOutOfWedlock
      });
      s.relationships.push({
        id: 'rel_kid_' + Date.now(),
        name: kidName,
        role: kidGender === 'male' ? 'Anak Lelaki' : 'Anak Perempuan',
        category: 'family',
        gender: kidGender,
        age: 0,
        countryId: s.countryId,
        closeness: 100,
        trust: 100,
        compatibility: 95,
        belief: s.belief || 'unassigned',
        isAdopted: false,
        isOutOfWedlock,
        alive: true,
        job: 'Bayi'
      });
      GameState.adjustStats({ happiness: 22 });
      GameState.addJournalEntry(
        `👶 Tahniah! Anda dan ${rel.name} menimang cahaya mata ${kidGender === 'male' ? 'lelaki' : 'perempuan'}, ${kidName}, lahir di ${s.city}, ${c.name} ${c.flag}!`,
        'milestone'
      );
      GameState.save();
      return { ok: true, msg: `Bayi ${kidName} selamat dilahirkan!` };
    }

    // --- Putus / Bercerai ---
    if (action === 'breakup') {
      const wasMarried = s.married;
      s.partnerId = null;
      s.married = false;
      rel.category = 'ex';
      rel.role = wasMarried ? 'Bekas Pasangan (Cerai)' : 'Bekas Pasangan';
      rel.closeness = 15;
      rel.trust = 20;
      if (wasMarried && s.money > 0) {
        const settle = Math.round(s.money * 0.15);
        s.money -= settle;
      }
      GameState.adjustStats({ happiness: wasMarried ? -18 : -12 });
      GameState.recordCrisis('heartbreak');
      GameState.addJournalEntry(
        wasMarried
          ? `💔 Perkahwinan anda dan ${rel.name} berakhir dengan penceraian. Hati terasa berat namun hidup mesti diteruskan.`
          : `💔 Anda dan ${rel.name} membawa haluan masing-masing.`,
        'warning'
      );
      GameState.save();
      return { ok: true, msg: wasMarried ? `Anda dan ${rel.name} telah bercerai.` : `Hubungan dengan ${rel.name} berakhir.` };
    }

    return { ok: false, msg: 'Tindakan tidak dikenali.' };
  },

  // --------------------------------------------------------------------------
  // 4. AMBIL ANAK ANGKAT (Menggunakan bin/binti Abdullah bagi watak Islam)
  // --------------------------------------------------------------------------
  adoptChild() {
    const s = GameState.current;
    GameState.ensureUpgradedState();
    this.ensureRelationshipFields(s);
    const c = Utils.getCountry(s.countryId);

    if (s.age < 21) return { ok: false, msg: 'Anda perlu berumur sekurang-kurangnya 21 tahun untuk mengambil anak angkat.' };
    if (s.yearlyActions.adoptedChild) return { ok: false, msg: 'Anda sudah mengambil anak angkat tahun ini.' };

    const fee = Utils.usdToLocal(900, s.countryId);
    if (s.money < fee) return { ok: false, msg: `Kos dokumentasi pengambilan anak angkat ialah ${Utils.formatMoney(fee, s.countryId)}.` };

    s.money -= fee;
    s.yearlyActions.adoptedChild = true;
    const kidGender = Utils.chance(0.5) ? 'male' : 'female';
    const heritage = (s.heritageId && c.names[s.heritageId]) ? s.heritageId : Utils.pick(c.heritages).id;
    const kidAge = Utils.randInt(0, 5);
    const kidName = Utils.generateChildName({
      countryId: s.countryId,
      gender: kidGender,
      heritageId: heritage,
      belief: s.belief || 'unassigned',
      fatherFullName: null,
      isAdopted: true,
      isOutOfWedlock: false
    });

    s.relationships.push({
      id: 'rel_adopt_' + Date.now(),
      name: kidName,
      role: kidGender === 'male' ? 'Anak Lelaki' : 'Anak Perempuan',
      category: 'family',
      gender: kidGender,
      age: kidAge,
      countryId: s.countryId,
      closeness: 90,
      trust: 90,
      compatibility: 92,
      belief: s.belief || 'unassigned',
      isAdopted: true,
      isOutOfWedlock: false,
      alive: true,
      job: kidAge < 5 ? 'Kanak-kanak' : 'Pelajar'
    });

    GameState.adjustStats({ happiness: 20 });
    GameState.addJournalEntry(
      `🏡 Anda mengambil seorang anak angkat ${kidGender === 'male' ? 'lelaki' : 'perempuan'} berusia ${kidAge} tahun, ${kidName}, ke dalam keluarga anda di ${s.city}!`,
      'milestone'
    );
    GameState.save();
    return { ok: true, msg: `Selamat datang ke keluarga, ${kidName}!` };
  }
};
