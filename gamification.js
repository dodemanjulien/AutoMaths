/* AutoMaths – gamification.js : Moteur de gamification complet */

var GamificationEngine = (function () {

  /* ── NIVEAUX ─────────────────────────────────────────────────── */
  var LEVELS = [
    { name: 'Apprenti',  minXP: 0,    icon: '🌱', color: '#6ee7b7' },
    { name: 'Initié',    minXP: 300,  icon: '⭐', color: '#60a5fa' },
    { name: 'Habile',    minXP: 750,  icon: '💫', color: '#a78bfa' },
    { name: 'Expert',    minXP: 1500, icon: '🔥', color: '#fb923c' },
    { name: 'Maître',    minXP: 2500, icon: '⚡', color: '#f59e0b' },
    { name: 'Sage',      minXP: 4000, icon: '🏆', color: '#fbbf24' }
  ];

  /* ── THÈMES PAR AUTOMATISME ──────────────────────────────────── */
  var THEMES = {
    'c1-1':'rocket',  'c1-2a':'lightning','c1-2b':'lightning','c1-2c':'lightning',
    'c1-3':'lightning','c1-4a':'pizza',   'c1-4b':'pizza',
    'c1-5':'pizza',   'c1-6':'pizza',    'c1-7':'scale',    'c1-8':'scale',
    'c1-9':'scale',   'c1-10':'scale',   'c1-11':'target',  'c1-12':'gears',
    'c1-13':'stars',  'c1-14':'gears',   'c1-15':'geo',     'c1-16':'geo',
    'c2-1':'chart',   'c2-2':'chart',    'c2-3':'scale',    'c2-4':'rocket',
    'c2-5':'pizza',   'c2-6':'scale',    'c2-7':'stars',    'c2-8':'chart',
    'c2-9':'geo',     'c2-10':'geo',     'c2-11':'geo',     'c2-12':'geo',
    'b2-1':'chart',   'b2-2':'pizza',    'b2-3':'pizza',    'b2-4':'chart',
    'b2-5':'rocket',  'b2-6':'stars',    'b2-7':'scale',    'b2-8':'pizza',
    'b2-9':'scale',   'b2-10':'gears',   'b2-11':'scale',   'b2-14':'stars',
    'b2-15':'chart',  'b2-16':'chart',   'b2-18':'geo',     'b2-20':'gears',
    'b2-21':'geo',
    'b1-1':'dice',    'b1-2':'dice',     'b1-3':'chart',    'b1-4':'chart',
    'b1-5':'scale',   'b1-6':'scale',    'b1-7':'chart',    'b1-8':'chart',
    'b1-9':'geo',     'b1-10':'coins',   'b1-11':'geo',     'b1-12':'geo',
    'b1-13':'geo',    'b1-14':'geo',     'b1-15':'scale',
    'bt-1':'dice',    'bt-2':'dice',     'bt-3':'dice',     'bt-4':'dice',
    'bt-5':'dice',    'bt-6':'music',    'bt-7':'scale',    'bt-8':'scale',
    'bt-9':'wave',    'bt-10':'arrow',   'bt-11':'arrow'
  };

  var TA = window.THEME_ASSETS || {};
  var THEME_META = {
    rocket:    { emoji:'🚀', label:'Shoot\'em up !',    colors:['#f59e0b','#ef4444','#fbbf24'], bg: TA.bg_rocket, img: TA.icon_rocket },
    lightning: { emoji:'⚡',   label:'Centrale !',      colors:['#fbbf24','#fb923c','#fde68a'], bg: TA.bg_lightning, img: TA.icon_lightning },
    pizza:     { emoji:'🍕', label:'Pizza Chef !',    colors:['#ef4444','#f59e0b','#fde68a'], bg: TA.bg_pizza, img: TA.icon_pizza, pizzaGood: TA.img_pizza_good, pizzaBad: TA.img_pizza_bad },
    scale:     { emoji:'⚔️',   label:'RPG Battle !',    colors:['#60a5fa','#93c5fd','#a78bfa'], bg: TA.bg_scale, img: TA.icon_scale },
    target:    { emoji:'🎾', label:'Tennis !',         colors:['#10b981','#34d399','#fbbf24'], bg: TA.bg_target, img: TA.icon_target },
    gears:     { emoji:'🧪', label:'Labo !',            colors:['#34d399','#10b981','#a78bfa'], bg: TA.bg_gears, img: TA.icon_gears },
    stars:     { emoji:'🌌', label:'Constellations !', colors:['#818cf8','#a78bfa','#fbbf24'], bg: TA.bg_stars, img: TA.icon_stars },
    geo:       { emoji:'📐', label:'Géométrie !',   colors:['#60a5fa','#34d399','#a78bfa'], bg: TA.bg_geo, img: TA.icon_geo },
    chart:     { emoji:'🏎️', label:'Course !',          colors:['#f59e0b','#ef4444','#fbbf24'], bg: TA.bg_chart, img: TA.icon_chart },
    dice:      { emoji:'🎰', label:'Casino !',          colors:['#ef4444','#fbbf24','#60a5fa'], bg: TA.bg_dice, img: TA.icon_dice },
    music:     { emoji:'🎵', label:'Mélodie !',        colors:['#a78bfa','#60a5fa','#f9a8d4'], bg: TA.bg_music, img: TA.icon_music },
    wave:      { emoji:'🌊', label:'Surf !',            colors:['#60a5fa','#0ea5e9','#38bdf8'], bg: TA.bg_wave, img: TA.icon_wave },
    arrow:     { emoji:'🎯', label:'Archer !',           colors:['#ef4444','#f59e0b','#fbbf24'], bg: TA.bg_arrow, img: TA.icon_arrow },
    coins:     { emoji:'🏦', label:'Banque !',           colors:['#fbbf24','#f59e0b','#10b981'], bg: TA.bg_coins, img: TA.icon_coins }
  };

  /* ── MESSAGES THÉMATIQUES ────────────────────────────────────── */
  var MESSAGES = {
    rocket:    ['🚀 Tu as décollé à toute vitesse ! Score parfait !','🚀 Bien joué, la fusée est en route !','🚀 Tu prends de l\'altitude !','🚀 On reste au sol… mais ça va décoller !'],
    lightning: ['⚡ Tu es plus rapide que l\'éclair !','⚡ Belle vitesse de calcul !','⚡ Tu commences à voir l\'éclair…','⚡ L\'éclair viendra avec de l\'entraînement !'],
    pizza:     ['🍕 Pizza entière ! Parfait !','🍕 Presque toute la pizza, excellent !','🍕 Tu as eu la moitié de la pizza…','🍕 Juste une miette… Entraîne-toi encore !'],
    scale:     ['⚖ Parfait équilibre ! Tu maîtrises les deux plateaux !','⚖ La balance est presque parfaite !','⚖ Un peu de déséquilibre encore…','⚖ La balance penche fort… Révise !'],
    target:    ['🎯 Dans le mille ! Score parfait !','🎯 Presque dans le centre !','🎯 Tu touches la cible, mais pas le centre.','🎯 Tu as raté la cible, réessaie !'],
    gears:     ['🔄 Toutes les conversions à la perfection !','🔄 Les engrenages tournent bien !','🔄 Quelques grincements dans la machine…','🔄 La machine grippe ! Reprends les conversions.'],
    stars:     ['✨ Tu brilles comme une supernova !','✨ Tes étoiles brillent fort !','✨ Une belle étoile filante…','✨ L\'étoile cherche encore sa trajectoire !'],
    geo:       ['📐 Géomètre parfait ! Toutes les figures sont au carré !','📐 Bonne maîtrise géométrique !','📐 Quelques angles à retravailler…','📐 Retourne à la règle et au compas !'],
    chart:     ['📊 Courbe parfaite ! Statisticien en herbe !','📊 Belle tendance à la hausse !','📊 La courbe oscille encore…','📊 La courbe est en berne, mais ça peut remonter !'],
    dice:      ['🎲 Jackpot total ! Probabilité de 100% !','🎲 Les dés roulent bien pour toi !','🎲 Mi-chance, mi-calcul…','🎲 Les dés ne sont pas en ta faveur… encore !'],
    music:     ['🎵 Mélodie parfaite ! Toutes les notes sont là !','🎵 Belle harmonie dans tes calculs !','🎵 Quelques fausses notes…','🎵 La partition est difficile, reprends-la !'],
    wave:      ['🌊 Tu surfes parfaitement sur les dérivées !','🌊 Belle vague de bonnes réponses !','🌊 La vague te porte à moitié…','🌊 La vague t\'a emporté… Résiste !'],
    arrow:     ['🏹 Toutes les flèches dans le mille !','🏹 Bonne direction vectorielle !','🏹 Tes vecteurs partent dans le bon sens…','🏹 Les vecteurs sont dans tous les sens !'],
    coins:     ['💶 Tu gères ton argent à la perfection !','💶 Bons intérêts pour toi !','💶 Quelques euros de perdus…','💶 Tu as besoin de revoir tes comptes !']
  };

  /* ── STORAGE ─────────────────────────────────────────────────── */
  var KEY = 'automaths_v2';
  var data = { pseudo: null, xp: 0, sessions: 0, bestPct: 0, soundOn: true, stats: {}, avatar: '⚔️', title: 'Novice', coins: 0, inventory: [], achievements: [] };

  function load() {
    try { var s = localStorage.getItem(KEY); if (s) { var d = JSON.parse(s); data = Object.assign(data, d); } } catch(e) {}
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch(e) {}
  }
  load();

  /* Helpers UTF-8 <-> Base64 (compatibles avec les emojis et les accents) */
  function utf8ToB64(str) {
    try {
      // Méthode moderne : TextEncoder
      var bytes = new TextEncoder().encode(str);
      var binary = '';
      for (var i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
      return btoa(binary);
    } catch(e) {
      // Fallback : encodeURIComponent
      return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(m, p) { return String.fromCharCode(parseInt(p, 16)); }));
    }
  }
  function b64ToUtf8(b64) {
    try {
      var binary = atob(b64);
      var bytes = new Uint8Array(binary.length);
      for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      return new TextDecoder().decode(bytes);
    } catch(e) {
      return decodeURIComponent(atob(b64).split('').map(function(c) { return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2); }).join(''));
    }
  }

  function exportSave() { return utf8ToB64(JSON.stringify(data)); }
  function importSave(str) {
    try {
      var d = JSON.parse(b64ToUtf8(str));
      if (d.xp !== undefined) { data = Object.assign(data, d); save(); return true; }
    } catch(e) {}
    return false;
  }

  /* ── NIVEAUX ─────────────────────────────────────────────────── */
  function getLv(xp) {
    for (var i = LEVELS.length - 1; i >= 0; i--) { if (xp >= LEVELS[i].minXP) return LEVELS[i]; }
    return LEVELS[0];
  }
  function getNextLv(xp) {
    for (var i = 0; i < LEVELS.length; i++) { if (xp < LEVELS[i].minXP) return LEVELS[i]; }
    return null;
  }
  function getLvProgress(xp) {
    var cur = getLv(xp), nxt = getNextLv(xp);
    if (!nxt) return 100;
    return Math.round((xp - cur.minXP) / (nxt.minXP - cur.minXP) * 100);
  }

  /* ── XP, COINS & STATS ───────────────────────────────────────── */
  function calcXP(correct, total, combo, timerBonus) {
    var base    = correct * 3;
    var perfect = (correct === total && total > 0) ? 15 : 0;
    var comboB  = combo > 1 ? (combo - 1) * 2 : 0;
    return base + perfect + comboB + (timerBonus || 0);
  }

  function addXP(amount) {
    var oldLv = getLv(data.xp);
    data.xp += amount; 
    data.coins += amount; // 1 XP = 1 Cristal 💎
    data.sessions++;
    save();
    var newLv = getLv(data.xp);
    checkAchievements();
    return { gained: amount, total: data.xp,
             coinsGained: amount, coinsTotal: data.coins,
             levelUp: newLv.name !== oldLv.name, newLevel: newLv };
  }

  function addStats(autoId, correct, total, combo) {
    if (!data.stats) data.stats = {};
    if (!data.stats[autoId]) data.stats[autoId] = { attempts: 0, correct: 0, total: 0, maxCombo: 0, lastScores: [] };
    var s = data.stats[autoId];
    s.attempts++;
    s.correct += correct;
    s.total += total;
    s.maxCombo = Math.max(s.maxCombo || 0, combo);
    if (!s.lastScores) s.lastScores = [];
    s.lastScores.push({ c: correct, t: total, ts: Date.now() });
    if (s.lastScores.length > 5) s.lastScores.shift();
    save();
    checkAchievements();
  }

  function resetXP() { data.xp = 0; data.coins = 0; data.sessions = 0; data.bestPct = 0; data.stats = {}; data.inventory = []; data.achievements = []; data.avatar = '⚔️'; data.title = 'Novice'; save(); }

  /* ── BOUTIQUE (SHOP) ─────────────────────────────────────────── */
  var SHOP_ITEMS = [
    { id: 'av_mage', type: 'avatar', name: 'Mage de Glace', icon: '🪄', price: 0, rarity: 'common', color: '#94a3b8' },
    { id: 'av_archer', type: 'avatar', name: 'Tireur d\'Élite', icon: '🏹', price: 0, rarity: 'common', color: '#94a3b8' },
    { id: 'av_ninja', type: 'avatar', name: 'Ninja de l\'Ombre', icon: '🥷', price: 100, rarity: 'rare', color: '#3b82f6' },
    { id: 'av_robot', type: 'avatar', name: 'Mecha-Calculateur', icon: '🤖', price: 250, rarity: 'epic', color: '#a855f7' },
    { id: 'av_king', type: 'avatar', name: 'Roi des Maths', icon: '👑', price: 600, rarity: 'legendary', color: '#eab308' },
    { id: 'av_dragon', type: 'avatar', name: 'Dragon Ancien', icon: '🐉', price: 1000, rarity: 'legendary', color: '#eab308' },
    
    // Titres généraux
    { id: 'ti_novice', type: 'title', name: 'Novice', title: 'Novice', price: 0, rarity: 'common', color: '#94a3b8' },
    { id: 'ti_calculator', type: 'title', name: 'Le Calculateur', title: 'Le Calculateur', price: 150, rarity: 'rare', color: '#3b82f6' },
    { id: 'ti_veteran', type: 'title', name: 'Vétéran', title: 'Vétéran', price: 400, rarity: 'epic', color: '#a855f7' },
    { id: 'ti_destroyer', type: 'title', name: 'Le Destructeur', title: 'Le Destructeur', price: 600, rarity: 'epic', color: '#a855f7' },
    { id: 'ti_god', type: 'title', name: 'Dieu des Maths', title: 'Dieu des Maths', price: 1500, rarity: 'legendary', color: '#eab308' },
    
    // Titres liés aux automatismes
    { id: 'ti_fraction', type: 'title', name: 'Maître des Parts', title: 'Le Fractionniste', price: 200, rarity: 'rare', color: '#3b82f6' },
    { id: 'ti_mental', type: 'title', name: 'Flash', title: 'Le Mentaliste', price: 250, rarity: 'rare', color: '#3b82f6' },
    { id: 'ti_algebra', type: 'title', name: 'Inconnu(e)', title: 'Seigneur de l\'Algèbre', price: 300, rarity: 'epic', color: '#a855f7' },
    { id: 'ti_geo', type: 'title', name: 'Géomètre', title: 'L\'Arpenteur', price: 300, rarity: 'epic', color: '#a855f7' },
    { id: 'ti_stat', type: 'title', name: 'Analyste', title: 'Le Statisticien', price: 200, rarity: 'rare', color: '#3b82f6' },
    { id: 'ti_time', type: 'title', name: 'Maitre du Temps', title: 'L\'Horloger', price: 250, rarity: 'rare', color: '#3b82f6' }
  ];

  function getShopItems() { return SHOP_ITEMS; }
  
  function buyItem(id) {
    var item = SHOP_ITEMS.find(function(i) { return i.id === id; });
    if (!item) return { success: false, msg: "Objet introuvable." };
    if (data.inventory.indexOf(id) !== -1 || (item.price === 0)) {
      if (item.type === 'avatar') data.avatar = item.icon;
      else if (item.type === 'title') data.title = item.title;
      save();
      return { success: true, equipped: true, msg: "Objet équipé !" };
    }
    if (data.coins >= item.price) {
      data.coins -= item.price;
      data.inventory.push(id);
      if (item.type === 'avatar') data.avatar = item.icon;
      else if (item.type === 'title') data.title = item.title;
      save();
      snd('victory');
      return { success: true, equipped: true, msg: "Objet acheté et équipé !" };
    }
    return { success: false, msg: "Fonds insuffisants." };
  }

  /* ── SUCCÈS (ACHIEVEMENTS) ────────────────────────────────────── */
  var ACHIEVEMENTS = [
    { id: 'ach_first', name: 'Premier Pas', desc: 'Complète ta première session', icon: '🍼', type: 'bronze', color: '#d4af37' }, // fallback bronze color
    { id: 'ach_combo5', name: 'Chauffé à blanc', desc: 'Atteins un combo de 5', icon: '🔥', type: 'bronze' },
    { id: 'ach_combo10', name: 'Inarrêtable', desc: 'Atteins un combo de 10', icon: '☄️', type: 'silver' },
    { id: 'ach_night', name: 'L\'Oiseau de Nuit', desc: 'Joue après 21h', icon: '🦉', type: 'silver' },
    { id: 'ach_level5', name: 'L\'Ascension', desc: 'Atteins le Niveau 5', icon: '📈', type: 'silver' },
    { id: 'ach_grind10', name: 'Acharnement', desc: 'Joue 10 fois au même automatisme', icon: '🔁', type: 'silver' },
    { id: 'ach_perfect', name: 'Perfection absolue', desc: 'Fais un sans faute (100%)', icon: '🎯', type: 'gold' },
    { id: 'ach_perfect5', name: 'L\'Élite', desc: 'Fais 5 sans fautes (100%)', icon: '🏆', type: 'gold' },
    { id: 'ach_all', name: 'AutoMaths Master', desc: 'Débloque tous les autres trophées', icon: '💠', type: 'platinum' }
  ];

  function getAchievements() { return ACHIEVEMENTS; }

  function checkAchievements() {
    var newlyUnlocked = [];
    if (!data.achievements) data.achievements = [];
    
    function unlock(id) {
      if (data.achievements.indexOf(id) === -1) {
        data.achievements.push(id);
        newlyUnlocked.push(ACHIEVEMENTS.find(function(a){return a.id===id;}));
      }
    }

    if (data.sessions >= 1) unlock('ach_first');
    
    var maxC = 0, perfs = 0, maxGrind = 0;
    for (var k in data.stats) {
      var s = data.stats[k];
      maxC = Math.max(maxC, s.maxCombo);
      maxGrind = Math.max(maxGrind, s.attempts);
      s.lastScores.forEach(function(sc) { if(sc.c === sc.t && sc.t > 0) perfs++; });
    }
    if (maxC >= 5) unlock('ach_combo5');
    if (maxC >= 10) unlock('ach_combo10');
    if (perfs >= 1) unlock('ach_perfect');
    if (perfs >= 5) unlock('ach_perfect5');
    if (maxGrind >= 10) unlock('ach_grind10');
    
    var currentLevelNum = 1;
    for (var i = LEVELS.length - 1; i >= 0; i--) {
      if (data.xp >= LEVELS[i].minXP) {
        currentLevelNum = i + 1;
        break;
      }
    }
    if (currentLevelNum >= 5) unlock('ach_level5');

    var hour = new Date().getHours();
    if (hour >= 21 || hour < 4) unlock('ach_night');

    // Platinum Check
    if (data.achievements.length >= ACHIEVEMENTS.length - 1 && data.achievements.indexOf('ach_all') === -1) {
      unlock('ach_all');
    }

    if (newlyUnlocked.length > 0) {
      save();
      newlyUnlocked.forEach(function(a) { showAchievementPopup(a); });
    }
  }

  function showAchievementPopup(ach) {
    if (typeof document === 'undefined') return;
    var el = document.createElement('div');
    el.className = 'achievement-popup ' + (ach.type || 'bronze');
    var color = '#d4af37'; // default bronze
    if (ach.type === 'silver') color = '#c0c0c0';
    if (ach.type === 'gold') color = '#fbbf24';
    if (ach.type === 'platinum') color = '#38bdf8';
    
    el.style.borderColor = color;
    el.style.boxShadow = '0 10px 25px ' + color + '40';
    
    el.innerHTML = '<div style="font-size:2.2rem;margin-right:1rem;">'+ach.icon+'</div><div><div style="font-weight:bold;color:'+color+';text-transform:uppercase;font-size:0.8rem;letter-spacing:1px;">Trophée '+ach.type+'</div><div style="font-weight:bold;font-size:1.1rem;margin-bottom:2px;">'+ach.name+'</div><div style="font-size:0.85rem;color:#94a3b8;">'+ach.desc+'</div></div>';
    document.body.appendChild(el);
    setTimeout(function() { el.classList.add('show'); }, 100);
    snd('combo');
    setTimeout(function() { 
      el.classList.remove('show'); 
      setTimeout(function(){ if(el.parentNode)el.parentNode.removeChild(el); }, 500);
    }, 4000);
  }

  /* ── COMBO ───────────────────────────────────────────────────── */
  function calcMaxCombo(exs) {
    var max = 0, cur = 0;
    for (var i = 0; i < exs.length; i++) { if (exs[i].correct) { cur++; max = Math.max(max, cur); } else cur = 0; }
    return max;
  }

  /* ── THÈME ───────────────────────────────────────────────────── */
  function getTheme(autoId) { return THEMES[autoId] || 'stars'; }
  function getThemeMeta(autoId) { return THEME_META[getTheme(autoId)] || THEME_META.stars; }
  function getMessage(autoId, pct) {
    var msgs = MESSAGES[getTheme(autoId)] || MESSAGES.stars;
    var idx = pct === 100 ? 0 : pct >= 80 ? 1 : pct >= 40 ? 2 : 3;
    return msgs[idx];
  }

  /* ── WEB AUDIO ───────────────────────────────────────────────── */
  var actx = null;
  function ctx() {
    if (!actx) try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
    return actx;
  }
  function tone(f, type, t0, dur, vol, c) {
    var o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(c.destination);
    o.type = type; o.frequency.setValueAtTime(f, t0);
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    o.start(t0); o.stop(t0 + dur + 0.02);
  }

  var THEME_NOTES = {
    rocket:    [392,523,659,784],  lightning: [440,554,659,880],
    pizza:     [523,659,784,1047], scale:     [349,440,523,698],
    target:    [880,1047,1319,1047],gears:    [330,440,554,440],
    stars:     [659,784,988,1319], geo:       [440,523,659,784],
    chart:     [392,494,587,784],  dice:      [523,523,659,784],
    music:     [523,659,784,1047], wave:      [440,494,554,659],
    arrow:     [392,523,659,880],  coins:     [523,659,784,1047]
  };

  function snd(type) {
    if (!data.soundOn) return;
    var c = ctx(); if (!c) return;
    var t = c.currentTime;
    if (type === 'correct') {
      var f = THEME_NOTES[_curTheme] || THEME_NOTES.stars;
      f.forEach(function(freq, i) { tone(freq,'sine',t+i*0.07,0.25,0.13,c); });
    } else if (type === 'incorrect') {
      tone(200,'sawtooth',t,0.15,0.08,c);
      tone(180,'sawtooth',t+0.1,0.15,0.07,c);
      tone(160,'sawtooth',t+0.2,0.2,0.06,c);
    } else if (type === 'combo') {
      [523,659,784,1047,1319].slice(0,3).forEach(function(f,i){tone(f,'triangle',t+i*0.06,0.3,0.17,c);});
    } else if (type === 'levelup') {
      [523,659,784,1047,784,1047,1319].forEach(function(f,i){tone(f,'triangle',t+i*0.1,0.35,0.2,c);});
    } else if (type === 'victory') {
      var seq=[523,523,523,415,466,523,466,523], tt=t;
      seq.forEach(function(f,i){tone(f,'triangle',tt,0.18,0.2,c);tt+=0.15;});
    } else if (type === 'start') {
      tone(523,'sine',t,0.1,0.12,c); tone(659,'sine',t+0.13,0.12,0.12,c);
    } else if (type === 'dice') {
      for(var i=0;i<4;i++) tone(200+Math.random()*400,'square',t+i*0.05,0.05,0.06,c);
    } else if (type === 'rocket') {
      var o=c.createOscillator(),g=c.createGain();
      o.connect(g);g.connect(c.destination);
      o.type='sawtooth';o.frequency.setValueAtTime(80,t);
      o.frequency.linearRampToValueAtTime(600,t+1.2);
      g.gain.setValueAtTime(0.12,t);g.gain.exponentialRampToValueAtTime(0.001,t+1.3);
      o.start(t);o.stop(t+1.4);
    }
  }

  var _curTheme = 'stars';
  function setTheme(autoId) { _curTheme = getTheme(autoId); }

  /* ── PARTICULES ──────────────────────────────────────────────── */
  function spawnParticles(autoId) {
    var themeId = getTheme(autoId);
    var meta = THEME_META[themeId] || THEME_META.stars;
    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    var cx = canvas.getContext('2d');
    var count = 72;
    var ps = [];
    for (var i = 0; i < count; i++) {
      ps.push({
        x: Math.random() * canvas.width,
        y: -10 - Math.random() * 80,
        vx: (Math.random() - 0.5) * 5,
        vy: 2 + Math.random() * 5,
        size: 7 + Math.random() * 14,
        color: meta.colors[Math.floor(Math.random() * meta.colors.length)],
        rot: Math.random() * Math.PI * 2,
        rotV: (Math.random() - 0.5) * 0.15,
        emoji: (i % 5 === 0) ? meta.emoji : null,
        alpha: 1
      });
    }
    var start = performance.now();
    var dur = 3200;
    function draw(now) {
      var elapsed = now - start;
      cx.clearRect(0, 0, canvas.width, canvas.height);
      var alive = false;
      ps.forEach(function(p) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.rot += p.rotV;
        p.alpha = Math.max(0, 1 - (elapsed / dur) * 1.1);
        if (p.alpha <= 0 || p.y > canvas.height + 20) return;
        alive = true;
        cx.save();
        cx.globalAlpha = p.alpha;
        cx.translate(p.x, p.y);
        cx.rotate(p.rot);
        if (p.emoji) {
          cx.font = p.size * 1.4 + 'px serif';
          cx.textAlign = 'center'; cx.textBaseline = 'middle';
          cx.fillText(p.emoji, 0, 0);
        } else {
          cx.fillStyle = p.color;
          cx.beginPath();
          if (themeId === 'geo') {
            cx.moveTo(0, -p.size); cx.lineTo(p.size, p.size); cx.lineTo(-p.size, p.size); cx.closePath();
          } else if (themeId === 'dice') {
            cx.roundRect ? cx.roundRect(-p.size/2,-p.size/2,p.size,p.size,3) :
              cx.rect(-p.size/2,-p.size/2,p.size,p.size);
          } else {
            cx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          }
          cx.fill();
        }
        cx.restore();
      });
      if (alive && elapsed < dur + 500) requestAnimationFrame(draw);
      else { if (canvas.parentNode) canvas.parentNode.removeChild(canvas); }
    }
    requestAnimationFrame(draw);

    if (themeId === 'rocket') snd('rocket');
    else if (themeId === 'dice') snd('dice');
  }

  /* ── AVATARS SVG (compatibilité navigateurs anciens) ────────── */
  var AVATAR_SVGS = {
    '⚔️': '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><line x1="8" y1="32" x2="32" y2="8" stroke="#e2e8f0" stroke-width="3" stroke-linecap="round"/><line x1="8" y1="8" x2="32" y2="32" stroke="#e2e8f0" stroke-width="3" stroke-linecap="round"/><circle cx="20" cy="20" r="4" fill="#f59e0b"/><line x1="6" y1="10" x2="12" y2="6" stroke="#e2e8f0" stroke-width="2" stroke-linecap="round"/><line x1="6" y1="6" x2="10" y2="10" stroke="#e2e8f0" stroke-width="2" stroke-linecap="round"/><line x1="28" y1="34" x2="34" y2="30" stroke="#e2e8f0" stroke-width="2" stroke-linecap="round"/><line x1="30" y1="34" x2="34" y2="34" stroke="#e2e8f0" stroke-width="2" stroke-linecap="round"/></svg>',
    '🪄': '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><line x1="8" y1="32" x2="26" y2="14" stroke="#a78bfa" stroke-width="3" stroke-linecap="round"/><polygon points="28,4 30,10 36,12 30,14 28,20 26,14 20,12 26,10" fill="#fbbf24"/><circle cx="28" cy="12" r="2" fill="#fff"/></svg>',
    '🏹': '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M12 6 Q2 20 12 34" fill="none" stroke="#f97316" stroke-width="3" stroke-linecap="round"/><line x1="12" y1="6" x2="12" y2="34" stroke="#d97706" stroke-width="1.5"/><line x1="12" y1="20" x2="36" y2="20" stroke="#e2e8f0" stroke-width="2" stroke-linecap="round"/><polygon points="36,20 30,16 30,24" fill="#e2e8f0"/></svg>',
    '🥷': '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="17" r="12" fill="#374151"/><rect x="8" y="13" width="24" height="8" rx="4" fill="#111827"/><circle cx="15" cy="17" r="2.5" fill="#f0f4ff"/><circle cx="25" cy="17" r="2.5" fill="#f0f4ff"/><circle cx="15.5" cy="17" r="1" fill="#111"/><circle cx="25.5" cy="17" r="1" fill="#111"/><path d="M14 33 L20 28 L26 33" fill="#374151"/></svg>',
    '🤖': '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="12" width="20" height="18" rx="4" fill="#64748b"/><rect x="14" y="17" width="5" height="5" rx="1" fill="#38bdf8"/><rect x="21" y="17" width="5" height="5" rx="1" fill="#38bdf8"/><line x1="20" y1="5" x2="20" y2="12" stroke="#94a3b8" stroke-width="2"/><circle cx="20" cy="4" r="2.5" fill="#f59e0b"/><rect x="16" y="26" width="8" height="2" rx="1" fill="#94a3b8"/><rect x="6" y="18" width="4" height="6" rx="2" fill="#475569"/><rect x="30" y="18" width="4" height="6" rx="2" fill="#475569"/></svg>',
    '👑': '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><polygon points="4,30 8,12 16,22 20,8 24,22 32,12 36,30" fill="#eab308"/><rect x="4" y="30" width="32" height="5" rx="2" fill="#ca8a04"/><circle cx="20" cy="14" r="2" fill="#ef4444"/><circle cx="12" cy="18" r="1.5" fill="#3b82f6"/><circle cx="28" cy="18" r="1.5" fill="#3b82f6"/></svg>',
    '🐉': '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M8 30 Q6 16 18 10 Q28 5 32 14 Q36 22 28 26 L24 30 Z" fill="#22c55e"/><path d="M8 30 Q6 16 18 10" fill="none" stroke="#16a34a" stroke-width="1"/><circle cx="27" cy="15" r="2.5" fill="#fbbf24"/><circle cx="27.5" cy="15" r="1" fill="#111"/><path d="M18 10 L16 3 M21 7 L21 1 M24 7 L27 3" stroke="#16a34a" stroke-width="2" stroke-linecap="round"/><path d="M8 30 Q5 32 4 30 Q6 28 8 30" fill="#ef4444"/></svg>'
  };

  function getAvatarHtml(emoji, size) {
    size = size || 40;
    var svg = AVATAR_SVGS[emoji];
    if (svg) {
      return '<span class="avatar-svg" style="display:inline-flex;align-items:center;justify-content:center;width:'+size+'px;height:'+size+'px;">' + svg + '</span>';
    }
    // Fallback : afficher l'emoji tel quel
    return '<span style="font-size:'+Math.round(size*0.6)+'px;line-height:1;">' + emoji + '</span>';
  }

  function getAvatarKeys() {
    var keys = [];
    for (var k in AVATAR_SVGS) { keys.push(k); }
    return keys;
  }

  /* Classes réellement disponibles à la création du profil :
     la classe par défaut + celles à 0 💎 + celles déjà achetées.
     Les autres se débloquent uniquement dans la Boutique. */
  function isAvatarUnlocked(emoji) {
    var item = null;
    for (var i = 0; i < SHOP_ITEMS.length; i++) {
      if (SHOP_ITEMS[i].type === 'avatar' && SHOP_ITEMS[i].icon === emoji) { item = SHOP_ITEMS[i]; break; }
    }
    if (!item) return true;                              // classe de base, hors boutique
    if (item.price === 0) return true;                   // classe gratuite
    return (data.inventory || []).indexOf(item.id) !== -1; // déjà achetée
  }

  function getStarterAvatarKeys() {
    return getAvatarKeys().filter(isAvatarUnlocked);
  }

  /* ── API PUBLIQUE ────────────────────────────────────────────── */
  return {
    /* data */
    getData: function() { return data; },
    setPseudo: function(p) { data.pseudo = p; save(); },
    setAvatar: function(a) { data.avatar = a; save(); },
    resetXP: resetXP,
    toggleSound: function() { data.soundOn = !data.soundOn; save(); return data.soundOn; },
    exportSave: exportSave,
    importSave: importSave,
    /* levels */
    getLv: function() { return getLv(data.xp); },
    getNextLv: function() { return getNextLv(data.xp); },
    getLvProgress: function() { return getLvProgress(data.xp); },
    getAllLevels: function() { return LEVELS; },
    /* xp */
    calcXP: calcXP,
    addXP: addXP,
    addStats: addStats,
    /* shop & achievements */
    getShopItems: getShopItems,
    buyItem: buyItem,
    getAchievements: getAchievements,
    /* combo */
    calcMaxCombo: calcMaxCombo,
    /* theme */
    setTheme: setTheme,
    getThemeMeta: getThemeMeta,
    getMessage: getMessage,
    /* sound */
    snd: snd,
    /* particles */
    spawnParticles: spawnParticles,
    /* avatars */
    getAvatarHtml: getAvatarHtml,
    getAvatarKeys: getAvatarKeys,
    getStarterAvatarKeys: getStarterAvatarKeys,
    isAvatarUnlocked: isAvatarUnlocked
  };
})();

console.log('[AutoMaths] gamification.js OK');
