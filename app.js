/* AutoMaths – app.js : Contrôleur principal + Gamification */

var state = {
  diploma: null, year: null, automatisme: null,
  exercises: [], submitted: false,
  timerOn: false, timerSec: 250, timerTotal: 250, timerInterval: null,
  timerBonus: 0,
  currentCombo: 0
};

function $(id) { return document.getElementById(id); }

function showSection(name) {
  document.querySelectorAll('.step-section').forEach(function(s) { s.classList.remove('active'); });
  var el = $('step-' + name);
  if (el) { el.classList.add('active'); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  
  if (name !== 'exercises' && name !== 'results') {
    document.body.style.backgroundImage = '';
  }
}

function updateBreadcrumb(parts) {
  var bc = $('breadcrumb');
  if (!bc) return;
  bc.innerHTML = parts.map(function(p) { return '<span>' + p + '</span>'; }).join('');
}

function updateResetBtn(show) {
  var btnHome = $('btn-reset');
  var btnBack = $('btn-back');
  if (btnHome) btnHome.style.display = show ? 'inline-flex' : 'none';
  if (btnBack) btnBack.style.display = show ? 'inline-flex' : 'none';
}

/* ── XP BAR ──────────────────────────────────────────────────── */
function refreshXPBar() {
  var G = window.GamificationEngine;
  if (!G) return;
  var lv = G.getLv();
  var pct = G.getLvProgress();
  var d = G.getData();
  var lvBadge = $('level-badge');
  var fill = $('xp-bar-fill');
  var total = $('xp-total');
  if (lvBadge) lvBadge.innerHTML = lv.icon + ' ' + lv.name;
  if (fill)    fill.style.width = pct + '%';
  if (total)   total.textContent = d.xp + ' XP';
  var st = $('stat-sessions');
  if (st) st.textContent = d.sessions;
}

function renderHeroCard() {
  var G = window.GamificationEngine;
  var wrap = $('hero-card-wrap');
  if (!G || !wrap) return;
  var d = G.getData();
  if (!d.pseudo) { wrap.innerHTML = ''; return; }
  var lv = G.getLv();
  var avatar = d.avatar || '⚔️';
  var title = d.title || 'Novice';
  var coins = d.coins || 0;
  var avatarHtml = G.getAvatarHtml ? G.getAvatarHtml(avatar, 40) : avatar;
  wrap.innerHTML =
    '<div class="hero-card" id="hero-card" title="Clique pour changer de pseudo">' +
      '<div class="hero-avatar">' + avatarHtml + '</div>' +
      '<div class="hero-info">' +
        '<div class="hero-pseudo">' + escHtml(d.pseudo) + ' <span style="font-size:0.8rem;color:var(--primary-color);">[' + escHtml(title) + ']</span></div>' +
        '<div class="hero-level-label">Niveau : ' + lv.name + ' ' + lv.icon + '</div>' +
        '<div class="hero-xp-mini">' + d.xp + ' XP · 💎 ' + coins + ' Cristaux</div>' +
      '</div>' +
    '</div>';
  var hc = $('hero-card');
  if (hc) hc.addEventListener('click', function() { openPseudoModal(); });
}

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ── STATS DASHBOARD ─────────────────────────────────────────── */
function renderStats() {
  var G = window.GamificationEngine;
  if (!G) return;
  var d = G.getData();
  var grid = $('stats-grid');
  if (!grid) return;

  grid.innerHTML = '';
  if (!d.stats || Object.keys(d.stats).length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:2rem; color:var(--text-muted)">Aucune statistique disponible pour le moment. Joue quelques automatismes pour voir tes progrès !</div>';
    return;
  }

  var cur = window.CURRICULUM || {};
  var autoNameMap = {};
  for (var dipl in cur) {
    for (var lvl in cur[dipl]) {
      if (cur[dipl][lvl].automatismes) {
        cur[dipl][lvl].automatismes.forEach(function(a) { autoNameMap[a.id] = { name: a.name, icon: a.icon }; });
      }
    }
  }

  for (var autoId in d.stats) {
    var s = d.stats[autoId];
    if (s.attempts === 0) continue;
    var meta = autoNameMap[autoId] || { name: autoId, icon: '⚙️' };
    var pct = Math.round((s.correct / s.total) * 100) || 0;
    var color = pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';

    var html = '<div class="stat-card" style="background:rgba(255,255,255,0.05); border-radius:12px; padding:1rem; border:1px solid rgba(255,255,255,0.1);">' +
      '<div style="font-size:1.1rem; font-weight:600; margin-bottom:0.5rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">' + meta.icon + ' ' + meta.name + '</div>' +
      '<div style="display:flex; justify-content:space-between; margin-bottom:0.5rem; font-size:0.9rem; color:var(--text-muted)">' +
        '<span>Réussite: <strong style="color:'+color+'">' + pct + '%</strong></span>' +
        '<span>Essais: <strong>' + s.attempts + '</strong></span>' +
      '</div>' +
      '<div style="width:100%; height:8px; background:rgba(0,0,0,0.3); border-radius:4px; overflow:hidden; margin-bottom:0.5rem;">' +
        '<div style="width:'+pct+'%; height:100%; background:'+color+'; transition:width 0.5s ease;"></div>' +
      '</div>' +
      '<div style="font-size:0.8rem; color:var(--text-muted)">Max Combo: <strong>' + s.maxCombo + '</strong></div>' +
    '</div>';
    grid.innerHTML += html;
  }
  
  // Vitrine de trophées
  var tGrid = $('trophies-grid');
  if (tGrid) {
    tGrid.innerHTML = '';
    var allAch = G.getAchievements();
    var myAch = d.achievements || [];
    
    allAch.forEach(function(ach) {
      var isUnlocked = myAch.indexOf(ach.id) !== -1;
      
      var tColor = '#d4af37'; // bronze fallback
      if (ach.type === 'silver') tColor = '#c0c0c0';
      if (ach.type === 'gold') tColor = '#fbbf24';
      if (ach.type === 'platinum') tColor = '#38bdf8';
      
      var border = isUnlocked ? '2px solid ' + tColor : '2px dashed rgba(255,255,255,0.2)';
      var bg = isUnlocked ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)';
      var opacity = isUnlocked ? '1' : '0.4';
      var filter = isUnlocked ? 'none' : 'grayscale(100%)';
      
      var htmlAch = '<div style="width:120px; text-align:center; padding:1rem 0.5rem; border-radius:12px; background:'+bg+'; border:'+border+'; opacity:'+opacity+'; filter:'+filter+'; transition:transform 0.2s;">' +
        '<div style="font-size:2.5rem; margin-bottom:0.5rem;">' + ach.icon + '</div>' +
        '<div style="font-size:0.85rem; font-weight:bold; margin-bottom:0.2rem; color:'+(isUnlocked?tColor:'#aaa')+'; line-height:1.2;">' + ach.name + '</div>' +
      '</div>';
      tGrid.innerHTML += htmlAch;
    });
  }
}

/* ── BOUTIQUE ────────────────────────────────────────────────── */
function renderShop() {
  var G = window.GamificationEngine;
  if (!G) return;
  var d = G.getData();
  var items = G.getShopItems();
  
  var disp = $('shop-coins-display');
  if (disp) disp.textContent = d.coins + ' 💎';
  
  var grid = $('shop-grid');
  if (!grid) return;
  grid.innerHTML = '';
  
  items.forEach(function(item) {
    var isOwned = d.inventory.indexOf(item.id) !== -1 || item.price === 0;
    var isEquipped = (item.type === 'avatar' && d.avatar === item.icon) || (item.type === 'title' && d.title === item.title);
    
    var btnText = isEquipped ? 'Équipé' : (isOwned ? 'Équiper' : item.price + ' 💎');
    var btnClass = isEquipped ? 'btn-secondary' : 'btn-primary';
    if (isEquipped) btnClass += ' disabled';
    
    var avatarDisplay = (item.type === 'avatar' && G.getAvatarHtml)
      ? '<div style="display:flex;justify-content:center;margin-bottom:0.5rem;">' + G.getAvatarHtml(item.icon, 56) + '</div>'
      : (item.type === 'avatar' ? '<div style="font-size:3rem; margin-bottom:0.5rem;">' + item.icon + '</div>' : '<div style="font-size:1.2rem; font-weight:bold; margin-bottom:1rem; padding:1rem 0;">[' + item.title + ']</div>');
    var html = '<div class="shop-item" style="background:rgba(255,255,255,0.05); border-radius:12px; padding:1rem; border:2px solid ' + item.color + '; text-align:center;">' +
      avatarDisplay +
      '<div style="font-weight:bold; margin-bottom:0.2rem;">' + item.name + '</div>' +
      '<div style="font-size:0.8rem; color:' + item.color + '; margin-bottom:1rem; text-transform:uppercase;">' + item.rarity + '</div>' +
      '<button class="' + btnClass + '" onclick="buyShopItem(\'' + item.id + '\')" ' + (isEquipped ? 'disabled' : '') + ' style="width:100%">' + btnText + '</button>' +
    '</div>';
    
    grid.innerHTML += html;
  });
}

window.buyShopItem = function(id) {
  var G = window.GamificationEngine;
  if (!G) return;
  var res = G.buyItem(id);
  if (res.success) {
    renderShop();
    renderHeroCard();
  } else {
    alert(res.msg);
  }
};

/* ── MODAL PSEUDO ────────────────────────────────────────────── */
function openPseudoModal() {
  var ov = $('pseudo-overlay');
  if (ov) { ov.style.display = 'flex'; setTimeout(function(){ var inp=$('pseudo-input'); if(inp){inp.value='';inp.focus();} },100); }
}

function closePseudoModal(pseudo, avatar) {
  var G = window.GamificationEngine;
  if (G && pseudo && pseudo.trim()) {
    G.setPseudo(pseudo.trim());
    // Garde-fou : on n'équipe jamais une classe non débloquée
    if (avatar && (!G.isAvatarUnlocked || G.isAvatarUnlocked(avatar))) G.setAvatar(avatar);
  }
  var ov = $('pseudo-overlay');
  if (ov) ov.style.display = 'none';
  refreshXPBar(); renderHeroCard();
}

/* ── LEVEL-UP BANNER ─────────────────────────────────────────── */
function showLevelUp(lv) {
  var b = document.createElement('div');
  b.className = 'levelup-banner';
  b.innerHTML = '🎉 NIVEAU SUPÉRIEUR ! Tu es maintenant ' + lv.icon + ' <strong>' + lv.name + '</strong> !';
  document.body.appendChild(b);
  setTimeout(function() { if (b.parentNode) b.parentNode.removeChild(b); }, 3200);
  var G = window.GamificationEngine;
  if (G) G.snd('levelup');
}

/* ── XP POPUP ────────────────────────────────────────────────── */
function showXPPopup(gained, breakdown) {
  var el = document.createElement('div');
  el.className = 'xp-popup';
  el.textContent = '+' + gained + ' XP' + (breakdown ? ' · ' + breakdown : '');
  document.body.appendChild(el);
  setTimeout(function() { if (el.parentNode) el.parentNode.removeChild(el); }, 2100);
}

/* ── COMBO BADGE ─────────────────────────────────────────────── */
function showComboBadge(n) {
  var b = $('combo-badge');
  var c = $('combo-count');
  if (!b || !c) return;
  var icons = ['','','🔥','⚡','💥','🌟','🚀'];
  var icon = icons[Math.min(n, icons.length-1)] || '🌟';
  c.textContent = n;
  b.innerHTML = icon + ' Combo ×<span id="combo-count">' + n + '</span> !';
  b.classList.remove('show');
  void b.offsetWidth; // reflow
  b.classList.add('show');
  var G = window.GamificationEngine;
  if (G) G.snd('combo');
  setTimeout(function() { b.classList.remove('show'); }, 2200);
}

/* ── TIMER ───────────────────────────────────────────────────── */

/* Difficulté de chaque automatisme → secondes accordées par question.
   1 = rapide (calcul immédiat)  · 2 = moyen · 3 = long (lecture graphique,
   figure à analyser, calcul en plusieurs étapes).
   Tout id absent de cette table retombe sur DEFAULT_SEC_PER_Q. */
var TIMER_SEC_PER_LEVEL = { 1: 15, 2: 25, 3: 40 };
var DEFAULT_SEC_PER_Q = 25;

var TIMER_DIFFICULTY = {
  /* --- CAP 1ère année --- */
  'c1-1':1, 'c1-2a':1, 'c1-2b':2, 'c1-2c':3, 'c1-3':1, 'c1-4a':2, 'c1-4b':3,
  'c1-5':2, 'c1-6':2, 'c1-7':1, 'c1-8':2, 'c1-9':3, 'c1-10':2, 'c1-11':1,
  'c1-12':2, 'c1-13':1, 'c1-14':2, 'c1-15':3, 'c1-16':3,
  /* --- CAP 2ème année --- */
  'c2-1':2, 'c2-2':2, 'c2-3':2, 'c2-4':2, 'c2-5':2, 'c2-6':2, 'c2-7':2,
  'c2-8':3, 'c2-9':3, 'c2-10':3, 'c2-11':3, 'c2-12':2,
  /* --- BAC PRO 2nde --- */
  'b2-1':2, 'b2-2':2, 'b2-3':1, 'b2-4':2, 'b2-5':1, 'b2-6':2, 'b2-7':2,
  'b2-8':2, 'b2-9':3, 'b2-10':3, 'b2-11':2, 'b2-12':2, 'b2-13':3, 'b2-14':2,
  'b2-15':3, 'b2-16':3, 'b2-17':2, 'b2-18':3, 'b2-19':1, 'b2-20':2,
  'b2-21':2, 'b2-22':2, 'b2-23':3,
  /* --- BAC PRO 1ère --- */
  'b1-1':2, 'b1-2':3, 'b1-3':3, 'b1-4':3, 'b1-5':2, 'b1-6':3, 'b1-7':2,
  'b1-8':3, 'b1-9':2, 'b1-10':3, 'b1-11':1, 'b1-12':1, 'b1-13':2, 'b1-14':3,
  'b1-15':3, 'b1-16':3, 'b1-17':2, 'b1-18':3, 'b1-19':3, 'b1-20':3,
  'b1-21':3, 'b1-22':2,
  /* --- BAC PRO Terminale --- */
  'bt-1':1, 'bt-2':2, 'bt-3':2, 'bt-4':2, 'bt-5':3, 'bt-6':2, 'bt-7':3,
  'bt-8':2, 'bt-9':2, 'bt-10':2, 'bt-11':2, 'bt-12':3
};

/* Durée totale (en secondes) allouée à la série en cours. */
function computeTimerDuration() {
  var nbQ = (state.exercises && state.exercises.length) ? state.exercises.length : 10;
  var secPerQ = DEFAULT_SEC_PER_Q;
  var trainingMode = false;

  if (state.automatisme) {
    var lvl = TIMER_DIFFICULTY[state.automatisme.id];
    if (lvl && TIMER_SEC_PER_LEVEL[lvl]) secPerQ = TIMER_SEC_PER_LEVEL[lvl];

    // Mode Entraînement : +50 % de temps si l'élève est sous 50 % de réussite
    var G = window.GamificationEngine;
    if (G) {
      var d = G.getData();
      var s = d && d.stats ? d.stats[state.automatisme.id] : null;
      if (s && s.attempts > 0 && s.total > 0) {
        var pct = Math.round((s.correct / s.total) * 100);
        if (pct < 50) { secPerQ = Math.round(secPerQ * 1.5); trainingMode = true; }
      }
    }
  }

  var total = secPerQ * nbQ;
  total = Math.max(60, Math.min(600, total));          // borne 1 min – 10 min
  total = Math.round(total / 10) * 10;                  // arrondi à 10 s

  return { seconds: total, trainingMode: trainingMode };
}

function startTimer() {
  var info = computeTimerDuration();

  state.timerSec = info.seconds;
  state.timerTotal = info.seconds;
  state.timerBonus = 0;
  updateTimerDisplay();

  if (info.trainingMode) {
    setTimeout(function() { showXPPopup(0, "Temps rallongé (Mode Entraînement) 🐢"); }, 500);
  }

  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerInterval = setInterval(function() {
    state.timerSec--;
    updateTimerDisplay();
    if (state.timerSec <= 0) { clearInterval(state.timerInterval); state.timerInterval = null; submitAnswers(); }
  }, 1000);
}

function stopTimer() {
  if (state.timerInterval) { clearInterval(state.timerInterval); state.timerInterval = null; }
  // Bonus XP proportionnel à la PART de temps restante (max 6 XP),
  // pour rester équitable quelle que soit la durée allouée.
  var total = state.timerTotal || computeTimerDuration().seconds;
  state.timerBonus = Math.max(0, Math.floor(6 * (state.timerSec / total)));
}

function updateTimerDisplay() {
  var el = $('timer-display');
  if (!el) return;
  var m = Math.floor(state.timerSec / 60);
  var s = state.timerSec % 60;
  el.textContent = m + ':' + (s < 10 ? '0' : '') + s;
  el.classList.toggle('urgent', state.timerSec <= 30);
}

/* ── INIT ────────────────────────────────────────────────────── */
function initApp() {
  var cur = window.CURRICULUM;
  if (!cur) { console.error('[AutoMaths] CURRICULUM manquant'); return; }

  var G = window.GamificationEngine;

  // Pseudo au démarrage
  if (G && !G.getData().pseudo) { openPseudoModal(); }
  refreshXPBar(); renderHeroCard();

  // Avatar selector – génération dynamique via SVG
  var avatarSel = $('avatar-selector');
  var selectedAvatar = '⚔️';
  if (avatarSel && G && G.getAvatarKeys) {
    avatarSel.innerHTML = '';
    // Seules les classes débloquées (gratuites ou déjà achetées) sont proposées ;
    // les autres s'obtiennent dans la Boutique.
    var keys = G.getStarterAvatarKeys ? G.getStarterAvatarKeys() : G.getAvatarKeys();
    if (!keys.length) keys = G.getAvatarKeys().slice(0, 1);
    selectedAvatar = keys[0];
    keys.forEach(function(key, idx) {
      var el = document.createElement('div');
      el.className = 'avatar-option' + (idx === 0 ? ' selected' : '');
      el.dataset.av = key;
      el.innerHTML = G.getAvatarHtml(key, 40);
      el.addEventListener('click', function() {
        avatarSel.querySelectorAll('.avatar-option').forEach(function(a) { a.classList.remove('selected'); });
        this.classList.add('selected');
        selectedAvatar = this.dataset.av;
      });
      avatarSel.appendChild(el);
    });
  } else {
    // Fallback statique si pas de G
    var avs = document.querySelectorAll('.avatar-option');
    avs.forEach(function(el) {
      el.addEventListener('click', function() {
        avs.forEach(function(a) { a.classList.remove('selected'); });
        this.classList.add('selected');
        selectedAvatar = this.dataset.av;
      });
    });
  }

  // Confirm pseudo
  $('pseudo-confirm').addEventListener('click', function() {
    closePseudoModal($('pseudo-input').value, selectedAvatar);
    if (G) G.snd('start');
  });
  $('pseudo-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { closePseudoModal($('pseudo-input').value, selectedAvatar); if(G) G.snd('start'); }
  });

  $('btn-start').addEventListener('click', function() {
    showSection('level');
    updateBreadcrumb(['Diplôme']);
    updateResetBtn(true);
    if (G) G.snd('start');
  });

  // Tableau de bord
  $('btn-show-stats').addEventListener('click', function() {
    renderStats();
    showSection('stats');
    updateBreadcrumb(['Profil & Statistiques']);
    updateResetBtn(true);
  });
  $('btn-stats-back').addEventListener('click', goHome);

  // Boutique
  $('btn-show-shop').addEventListener('click', function() {
    renderShop();
    showSection('shop');
    updateBreadcrumb(['Boutique']);
    updateResetBtn(true);
  });
  $('btn-shop-back').addEventListener('click', goHome);

  // Export / Import
  $('btn-export-save').addEventListener('click', function() {
    if (!G) return;
    var str = G.exportSave();
    prompt('Copiez ce code de sauvegarde et gardez-le précieusement :', str);
  });
  $('btn-import-save').addEventListener('click', function() {
    if (!G) return;
    var str = prompt('Collez votre code de sauvegarde ici :');
    if (!str) return;
    if (G.importSave(str)) {
      alert('Sauvegarde restaurée avec succès !');
      refreshXPBar(); renderHeroCard(); renderStats();
    } else {
      alert('Code de sauvegarde invalide.');
    }
  });

  $('btn-back').addEventListener('click', goBack);
  $('btn-reset').addEventListener('click', goHome);
  $('logo-home-btn').addEventListener('click', goHome);

  // Sound toggle
  $('sound-toggle').addEventListener('click', function() {
    if (!G) return;
    var on = G.toggleSound();
    this.textContent = on ? '🔔' : '🔕';
  });
  if (G) { var d=G.getData(); $('sound-toggle').textContent = d.soundOn ? '🔔' : '🔕'; }

  // Reset XP
  $('btn-reset-xp').addEventListener('click', function() {
    if (!confirm('Réinitialiser toute ta progression XP ? Cette action est irréversible.')) return;
    if (G) { G.resetXP(); refreshXPBar(); renderHeroCard(); }
  });

  // Timer toggle : active/désactive ET lance/arrête réellement le décompte
  $('timer-toggle').addEventListener('click', function() {
    state.timerOn = !state.timerOn;
    this.classList.toggle('active', state.timerOn);
    var disp = $('timer-display');
    if (disp) disp.classList.toggle('visible', state.timerOn);

    var inExercise = !!($('step-exercises') && $('step-exercises').classList.contains('active'));

    if (state.timerOn) {
      // Si on est déjà en train de faire la série, le chrono démarre tout de suite.
      if (inExercise && !state.submitted) startTimer();
      else { state.timerSec = computeTimerDuration().seconds; updateTimerDisplay(); }
    } else {
      if (state.timerInterval) { clearInterval(state.timerInterval); state.timerInterval = null; }
      state.timerBonus = 0;
      state.timerSec = computeTimerDuration().seconds;
      updateTimerDisplay();
    }
  });

  // Cliquer sur l'affichage du chrono revient à cliquer sur le bouton ⏱
  var timerDisplayEl = $('timer-display');
  if (timerDisplayEl) {
    timerDisplayEl.style.cursor = 'pointer';
    timerDisplayEl.title = 'Démarrer / arrêter le chronomètre';
    timerDisplayEl.addEventListener('click', function() { $('timer-toggle').click(); });
  }

  // Scratchpad toggle
  $('btn-scratchpad-toggle').addEventListener('click', function() {
    var cvs = $('scratchpad-canvas');
    var tls = $('scratchpad-tools');
    if(cvs.classList.contains('active')) {
      cvs.classList.remove('active'); tls.classList.remove('active');
    } else {
      cvs.classList.add('active'); tls.classList.add('active');
      initScratchpad();
    }
  });
  $('btn-scratchpad-close').addEventListener('click', function() {
    $('scratchpad-canvas').classList.remove('active');
    $('scratchpad-tools').classList.remove('active');
  });

  // Print PDF
  $('btn-print-pdf').addEventListener('click', function() {
    window.print();
  });

  // Diplôme cards
  document.querySelectorAll('.diploma-card').forEach(function(card) {
    card.addEventListener('click', function() { selectDiploma(this.dataset.diploma); });
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectDiploma(this.dataset.diploma); }
    });
  });

  $('btn-submit').addEventListener('click', submitAnswers);
  $('btn-retry-same').addEventListener('click', function() {
    if (state.automatisme) { generateExercises(state.automatisme); showSection('exercises'); }
  });
  $('btn-change-auto').addEventListener('click', function() {
    renderAutomatismes(state.diploma, state.year); showSection('automatism');
  });
  $('btn-home').addEventListener('click', goHome);

  /* Boutons rappel de cours */
  $('btn-lesson-start').addEventListener('click', function() {
    if (state.automatisme) { generateExercises(state.automatisme); showSection('exercises'); }
  });
  $('btn-lesson-skip').addEventListener('click', function() {
    if (state.automatisme) { generateExercises(state.automatisme); showSection('exercises'); }
  });
}

/* ── LESSON SCREEN ────────────────────────────────────────── */
function showLesson(hint, auto) {
  var G = window.GamificationEngine;
  var meta = G ? G.getThemeMeta(auto.id) : { emoji: auto.icon || '📖' };

  /* Icône */
  var iconEl = $('lesson-icon');
  if (iconEl) {
    if (meta.img) iconEl.innerHTML = '<img src="'+meta.img+'" style="width:1.8em;height:1.8em;vertical-align:middle;border-radius:6px;">';
    else iconEl.textContent = meta.emoji || '📖';
  }

  /* Titre */
  var titleEl = $('lesson-title');
  if (titleEl) titleEl.textContent = hint.title;

  /* Règles */
  var rulesEl = $('lesson-rules');
  if (rulesEl) {
    rulesEl.innerHTML = hint.rules.map(function(r) {
      return '<li>' + r + '</li>';
    }).join('');
  }

  /* Exemples */
  var exEl = $('lesson-examples');
  if (exEl) {
    if (hint.examples && hint.examples.length) {
      exEl.innerHTML = '<div class="lesson-ex-label">💡 Exemple' + (hint.examples.length > 1 ? 's' : '') + ' :</div>' +
        hint.examples.map(function(e) {
          return '<div class="lesson-ex-item">' + (typeof fracHtml === 'function' ? fracHtml(e) : e) + '</div>';
        }).join('');
    } else {
      exEl.innerHTML = '';
    }
  }

  /* Fond thématique */
  if (meta.bg) {
    document.body.style.backgroundImage = 'url("'+meta.bg+'")';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
  }

  showSection('lesson');
  updateBreadcrumb(['Diplôme', state.diploma, state.year, auto.name, 'Rappel']);
}

function goHome() {
  if (state.timerInterval) clearInterval(state.timerInterval);
  state = { diploma:null,year:null,automatisme:null,exercises:[],submitted:false,
            timerOn:state.timerOn,timerSec:DEFAULT_SEC_PER_Q*10,timerInterval:null,timerBonus:0,currentCombo:0 };
  updateTimerDisplay();
  document.querySelectorAll('.diploma-card').forEach(function(c) { c.classList.remove('selected'); });
  var ys = $('year-selection');
  if (ys) ys.style.display = 'none';
  renderHeroCard(); refreshXPBar();
  showSection('welcome');
  updateBreadcrumb([]);
  updateResetBtn(false);
}

function goBack() {
  var currentSection = document.querySelector('.step-section.active');
  if (!currentSection) return goHome();
  
  var id = currentSection.id;
  if (id === 'step-exercises' || id === 'step-results' || id === 'step-lesson') {
    if (state.timerInterval) clearInterval(state.timerInterval);
    state.timerOn = false;
    if (state.diploma && state.year) {
      state.automatisme = null;
      renderAutomatismes(state.diploma, state.year);
      showSection('automatism');
      updateBreadcrumb(['Accueil', state.diploma, state.year]);
    } else {
      goHome();
    }
  } else if (id === 'step-automatism') {
    state.year = null;
    showSection('level');
    updateBreadcrumb(['Accueil', state.diploma]);
  } else if (id === 'step-level' || id === 'step-stats' || id === 'step-shop') {
    goHome();
  } else {
    goHome();
  }
}

/* ── DIPLOMA SELECTION ───────────────────────────────────────── */
function selectDiploma(diploma) {
  var cur = window.CURRICULUM;
  if (!cur || !cur[diploma]) return;
  state.diploma = diploma; state.year = null;
  document.querySelectorAll('.diploma-card').forEach(function(c) {
    c.classList.toggle('selected', c.dataset.diploma === diploma);
    c.setAttribute('aria-pressed', c.dataset.diploma === diploma ? 'true' : 'false');
  });
  var years = Object.keys(cur[diploma]);
  var grid = $('year-grid');
  grid.innerHTML = '';
  years.forEach(function(yr) {
    var btn = document.createElement('button');
    btn.className = 'btn-year';
    btn.textContent = cur[diploma][yr].label;
    btn.addEventListener('click', function() {
      document.querySelectorAll('.btn-year').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      selectYear(diploma, yr);
    });
    grid.appendChild(btn);
  });
  $('year-selection').style.display = 'block';
  updateBreadcrumb(['Diplôme', diploma]);
}

/* ── YEAR SELECTION ──────────────────────────────────────────── */
function selectYear(diploma, year) {
  state.year = year;
  updateBreadcrumb(['Diplôme', diploma, year]);
  renderAutomatismes(diploma, year);
  showSection('automatism');
}

/* ── AUTOMATISMES LIST ───────────────────────────────────────── */
function renderAutomatismes(diploma, year) {
  var cur = window.CURRICULUM;
  var list = cur[diploma][year].automatismes;
  var grid = $('automatism-grid');
  grid.innerHTML = '';
  list.forEach(function(auto) {
    var G = window.GamificationEngine;
    var meta = G ? G.getThemeMeta(auto.id) : { emoji: auto.icon };
    var card = document.createElement('div');
    card.className = 'automatism-card';
    card.setAttribute('role', 'button'); card.setAttribute('tabindex', '0');
    var iconHtml = meta.img ? '<img src="'+meta.img+'" style="width:2em;height:2em;border-radius:4px;box-shadow:0 0 10px rgba(0,0,0,0.5);">' : (meta.emoji || auto.icon);
    card.innerHTML =
      '<div class="auto-icon">' + iconHtml + '</div>' +
      '<div class="auto-name">' + auto.name + '</div>' +
      '<div class="auto-hint">' + auto.hint + '</div>';
    function activate() {
      state.automatisme = auto;
      if (G) G.setTheme(auto.id);
      var hint = window.LESSON_HINTS && window.LESSON_HINTS[auto.id];
      if (hint) {
        showLesson(hint, auto);
      } else {
        generateExercises(auto);
        showSection('exercises');
      }
    }
    card.addEventListener('click', activate);
    card.addEventListener('keydown', function(e) { if (e.key==='Enter'||e.key===' '){e.preventDefault();activate();} });
    grid.appendChild(card);
  });
}

/* ── GENERATE EXERCISES ──────────────────────────────────────── */
function generateExercises(auto) {
  try {
    var exercises = [];
    var seenQuestions = [];
    var attempts = 0;

    // Tente de récupérer jusqu'à 10 questions uniques
    while (exercises.length < 10 && attempts < 10) {
      attempts++;
      var batch = auto.generator();
      if (!batch || batch.length === 0) break;

      for (var i = 0; i < batch.length; i++) {
        var ex = batch[i];
        var qKey = ex.question;

        if (seenQuestions.indexOf(qKey) === -1) {
          seenQuestions.push(qKey);
          exercises.push(ex);
          if (exercises.length === 10) {
            break;
          }
        }
      }
    }

    // Si le pool est trop petit et qu'on a moins de 10 questions,
    // on remplit le reste avec des doublons.
    if (exercises.length < 10) {
      var finalBatch = auto.generator();
      for (var i = 0; i < finalBatch.length && exercises.length < 10; i++) {
        exercises.push(finalBatch[i]);
      }
    }

    state.exercises = exercises.slice(0, 10);
    state.submitted = false; state.currentCombo = 0;
    state.timerBonus = 0;
    state.timerSec = computeTimerDuration().seconds;
    renderExercises();
  } catch(err) {
    console.error('[AutoMaths] Erreur génération:', err);
    state.exercises = [];
  }
}

/* Callbacks globaux pour le Game Over dans minigame.js */
window.app_retryExercises = function() {
  if (state.automatisme) { generateExercises(state.automatisme); showSection('exercises'); }
};
window.app_goToAutomatism = function() {
  if (state.diploma && state.year) { renderAutomatismes(state.diploma, state.year); showSection('automatism'); }
};

/* ── RENDER EXERCISES ────────────────────────────────────────── */
function renderExercises() {
  var auto = state.automatisme;
  var G = window.GamificationEngine;
  var meta = (G && auto) ? G.getThemeMeta(auto.id) : { emoji:'\u2728', label:'Exercices' };

  // Theme banner
  var tEmoji = $('theme-banner-emoji');
  var tName  = $('theme-banner-name');
  if (tEmoji) {
    if (meta.img) {
      tEmoji.innerHTML = '<img src="' + meta.img + '" style="width:1.2em;height:1.2em;vertical-align:middle;border-radius:4px;box-shadow:0 0 10px rgba(0,0,0,0.5);">';
    } else {
      tEmoji.textContent = meta.emoji;
    }
  }
  if (tName && auto)  tName.textContent = auto.name;

  // Background
  if (meta.bg) {
    document.body.style.backgroundImage = 'url("' + meta.bg + '")';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
  } else {
    document.body.style.backgroundImage = '';
  }

  var metaEl = $('exercise-meta');
  if (metaEl && auto) metaEl.textContent = auto.name + ' — ' + state.exercises.length + ' questions';
  updateProgress(0);

  // Sync timer UI avec state.timerOn
  var timerDisp = $('timer-display');
  var timerToggle = $('timer-toggle');
  if (timerDisp) timerDisp.classList.toggle('visible', state.timerOn);
  if (timerToggle) timerToggle.classList.toggle('active', state.timerOn);
  if (state.timerOn) startTimer();
  else { state.timerSec = computeTimerDuration().seconds; updateTimerDisplay(); }

  // Masquer le bouton submit (géré par le mini-jeu)
  var submitBtn = $('btn-submit');
  if (submitBtn) submitBtn.style.display = 'none';

  // Résoudre le thème depuis l'emoji de la méta gamification
  var resolvedTheme = 'stars';
  if (G && auto) {
    var tmpMeta = G.getThemeMeta(auto.id);
    var emojiMap = {
      '\ud83d\ude80':'rocket',  '\u26a1':'lightning', '\ud83c\udf55':'pizza',
      '\u2694\ufe0f':'scale',     '\ud83c\udfbe':'target',   '\ud83e\uddea':'gears',
      '\ud83c\udf0c':'stars',    '\ud83d\udcd0':'geo',       '\ud83c\udfce\ufe0f':'chart',
      '\ud83c\udfb0':'dice',    '\ud83c\udfb5':'music',    '\ud83c\udf0a':'wave',
      '\ud83c\udfaf':'arrow',   '\ud83c\udfe6':'coins'
    };
    if (tmpMeta && emojiMap[tmpMeta.emoji]) resolvedTheme = emojiMap[tmpMeta.emoji];
  }

  // Lancer le mini-jeu
  var list = $('exercises-list');
  if (window.MiniGameEngine && list) {
    try {
      MiniGameEngine.launch(resolvedTheme, state.exercises, list, function(completedExs) {
        state.exercises = completedExs;
        if (state.timerOn) stopTimer();
        finishSession();
      }, state.diploma);
    } catch(err) {
      console.error('[AutoMaths] Erreur mini-jeu:', err);
    }
  }

  updateBreadcrumb([state.diploma, state.year, auto ? auto.name : '']);
}


/* ── PROGRESS BAR ────────────────────────────────────────────── */
function updateProgress(filled) {
  var pct = state.exercises.length ? (filled / state.exercises.length * 100) : 0;
  var bar = $('progress-bar');
  if (bar) bar.style.width = pct + '%';
}

/* ── PARSE / NORMALIZE ───────────────────────────────────────── */
function parseAnswerVal(s) {
  var str = String(s).replace(',','.').trim();
  var mFrac = str.match(/^(-?\d+)\s*\/\s*(\d+)/);
  if (mFrac) return parseInt(mFrac[1],10) / parseInt(mFrac[2],10);
  return parseFloat(str);
}
function normalizeStr(s) {
  return String(s).toLowerCase()
    .replace(/\u2212/g,'-').replace(/\u00a0/g,' ')
    .trim().replace(/,/g,'.')
    .replace(/\s*(cm[²³]?|m[²³]?|km|kg|g|mg|cl|ml|dl|l|\u20ac|%|km\/h|m\/h|m\/s|cm2|cm3|m2|m3)\s*/gi,'')
    .replace(/\s+/g,'');
}

/* ── FINISH SESSION (après mini-jeu) ────────────────────────── */
function finishSession() {
  var G = window.GamificationEngine;
  var correct = state.exercises.filter(function(e){ return e.correct; }).length;
  var combo = G ? G.calcMaxCombo(state.exercises) : 0;
  state.currentCombo = combo;

  var pctImmediate = state.exercises.length ? Math.round(correct / state.exercises.length * 100) : 0;
  if (G) {
    if (pctImmediate === 100) {
      setTimeout(function(){ G.snd('victory'); }, 500);
      setTimeout(triggerPerfectScoreAnimation, 600);
    }
    else if (pctImmediate >= 60) setTimeout(function(){ G.snd('combo'); }, 300);
    else setTimeout(function(){ G.snd('incorrect'); }, 300);
  }

  if (combo >= 2) setTimeout(function() { showComboBadge(combo); }, 400);
  updateProgress(correct);

  var xpResult = null;
  if (G) {
    var xpGained = G.calcXP(correct, state.exercises.length, combo, state.timerBonus);
    xpResult = G.addXP(xpGained);
    refreshXPBar();
    
    var autoId = state.automatisme ? state.automatisme.id : 'c1-1';
    if (G.addStats) G.addStats(autoId, correct, state.exercises.length, combo);
  }

  // Rétablir le bouton submit
  var submitBtn = $('btn-submit');
  if (submitBtn) submitBtn.style.display = '';

  setTimeout(function() { showResults(correct, combo, xpResult); }, 400);
}

/* ── SUBMIT ANSWERS (legacy – gardé pour compatibilité) ─────── */
function submitAnswers() {
  if (state.submitted) return;
  state.submitted = true;
  if (state.timerOn) stopTimer();

  var G = window.GamificationEngine;
  var autoId = state.automatisme ? state.automatisme.id : 'c1-1';
  var correct = 0;

  state.exercises.forEach(function(ex, i) {
    var input = $('ex-input-' + i);
    var val = input ? input.value.trim() : '';
    ex.userAnswer = val;
    var isOk = false;

    if (typeof ex.check === 'function') { try { isOk = ex.check(val); } catch(e) { isOk = false; } }
    if (!isOk && val !== '' && ex.answer !== undefined) {
      var n1 = normalizeStr(val), n2 = normalizeStr(String(ex.answer));
      if (n1 !== '' && n1 === n2) isOk = true;
      if (!isOk) {
        var p1 = parseAnswerVal(val), p2 = parseAnswerVal(String(ex.answer));
        if (!isNaN(p1) && !isNaN(p2) && Math.abs(p1-p2) <= Math.max(0.01, Math.abs(p2)*0.005)) isOk = true;
      }
    }

    ex.correct = isOk;
    if (isOk) correct++;

    var row = $('ex-row-' + i);
    var inp = $('ex-input-' + i);
    if (row) row.classList.add(isOk ? 'correct' : 'incorrect');
    if (inp) inp.classList.add(isOk ? 'correct' : 'incorrect');
  });

  // Son de résumé (un seul, pas 10 superposés)
  var pctImmediate = state.exercises.length ? Math.round(correct / state.exercises.length * 100) : 0;
  if (G) {
    if (pctImmediate === 100) setTimeout(function(){ G.snd('victory'); }, 500);
    else if (pctImmediate >= 60) setTimeout(function(){ G.snd('combo'); }, 300);
    else setTimeout(function(){ G.snd('incorrect'); }, 300);
  }

  // Combo
  var combo = G ? G.calcMaxCombo(state.exercises) : 0;
  state.currentCombo = combo;
  if (combo >= 2) setTimeout(function() { showComboBadge(combo); }, 400);

  updateProgress(correct);

  // XP
  var xpResult = null;
  if (G) {
    var xpGained = G.calcXP(correct, state.exercises.length, combo, state.timerBonus);
    xpResult = G.addXP(xpGained);
    refreshXPBar();
    if (G.addStats) G.addStats(autoId, correct, state.exercises.length, combo);
  }

  setTimeout(function() {
    showResults(correct, combo, xpResult);
  }, 900);
}

/* ── RESULTS ─────────────────────────────────────────────────── */
function showResults(correct, combo, xpResult) {
  var total = state.exercises.length;
  var pct   = total ? Math.round(correct / total * 100) : 0;
  var G     = window.GamificationEngine;
  var autoId = state.automatisme ? state.automatisme.id : 'c1-1';

  // Badge session
  var badge = pct === 100 ? '🥇' : pct >= 80 ? '🥈' : pct >= 60 ? '🥉' : '📚';

  // Message thématique
  var themeMsg = G ? G.getMessage(autoId, pct) : (pct >= 80 ? 'Excellent !' : 'Continue !');

  // Breakdown XP + Cristaux gagnés
  var xpLine = '';
  if (xpResult) {
    xpLine = '<div class="score-xp-gained">+' + xpResult.gained + ' XP</div>';

    var coinsGained = (xpResult.coinsGained !== undefined) ? xpResult.coinsGained : xpResult.gained;
    var coinsTotal  = xpResult.coinsTotal;
    if (coinsTotal === undefined && G && G.getData) { var gd = G.getData(); coinsTotal = gd ? gd.coins : undefined; }

    xpLine += '<div class="score-gems-gained">' +
              '<span class="gem-icon">💎</span>' +
              '<span class="gem-amount">+' + coinsGained + '</span>' +
              '<span class="gem-label">cristaux gagnés</span>' +
              '</div>';
    if (coinsTotal !== undefined) {
      xpLine += '<div class="score-gems-total">Total : ' + coinsTotal + ' 💎</div>';
    }
  }

  var comboLine = (combo >= 2)
    ? '<div class="score-combo-line">🔥 Meilleur combo : ×' + combo + (state.timerBonus ? ' · ⏱ Bonus chrono : +' + state.timerBonus + ' XP' : '') + '</div>'
    : (state.timerBonus ? '<div class="score-combo-line">⏱ Bonus chrono : +' + state.timerBonus + ' XP</div>' : '');

  var scoreEl = $('score-display');
  scoreEl.innerHTML =
    '<span class="session-badge">' + badge + '</span>' +
    '<div class="score-number"><span style="color:var(--accent1)">' + correct + '</span>' +
    '<span class="score-total">/' + total + '</span></div>' +
    '<div class="score-pct">' + pct + ' %</div>' +
    '<div class="score-theme-msg">' + themeMsg + '</div>' +
    comboLine + xpLine;

  // Corrections
  var wrongOnes = state.exercises.filter(function(e) { return !e.correct; });
  var fbEl = $('results-feedback');
  if (wrongOnes.length === 0) {
    fbEl.innerHTML = '<div style="text-align:center;padding:20px;color:var(--accent-green);font-weight:700;font-size:18px;">✅ Toutes les réponses sont correctes !</div>';
  } else {
    var html = '<div class="feedback-title">📋 Corrections</div>';
    wrongOnes.forEach(function(ex) {
      html += '<div class="correction-item">' +
        '<div class="correction-question">' + ex.question + '</div>' +
        '<div class="correction-user">Ta réponse : <strong>' + (ex.userAnswer||'—') + '</strong></div>' +
        '<div class="correction-answer">Réponse correcte : <strong>' + ex.answer + '</strong></div>' +
        (ex.explanation ? '<div class="correction-exp">' + ex.explanation + '</div>' : '') +
        '</div>';
    });
    fbEl.innerHTML = html;
  }

  showSection('results');

  // Particules selon score
  if (G && pct >= 80) {
    setTimeout(function(){ G.spawnParticles(autoId); }, 400);
  }
  if (xpResult && xpResult.levelUp) setTimeout(function(){ showLevelUp(xpResult.newLevel); }, 1200);
  if (xpResult) setTimeout(function(){ showXPPopup(xpResult.gained, combo>=2 ? 'Combo ×'+combo : ''); }, 600);
}

/* ── START ───────────────────────────────────────────────────── */
/* ── PERFECT SCORE ANIMATION ─────────────────────────────────── */
function triggerPerfectScoreAnimation() {
  var existing = $('mg-perfect-overlay');
  if (existing) existing.parentNode.removeChild(existing);
  var ov = document.createElement('div');
  ov.id = 'mg-perfect-overlay';
  ov.className = 'mg-perfect-overlay';
  ov.innerHTML = '<div class="mg-perfect-badge"><span class="mg-perfect-text">🏆 SANS FAUTE ! 🏆</span></div>';
  document.body.appendChild(ov);
  
  // Confetti effect
  var colors = ['#fbbf24', '#34d399', '#60a5fa', '#f472b6', '#a78bfa'];
  for(var i=0; i<40; i++) {
    var conf = document.createElement('div');
    conf.className = 'mg-confetti';
    conf.style.left = (Math.random() * 100) + '%';
    conf.style.animationDelay = (Math.random() * 0.5) + 's';
    conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    ov.appendChild(conf);
  }
  
  setTimeout(function() {
    if (ov.parentNode) ov.parentNode.removeChild(ov);
  }, 4700); // doit rester > durée de mgPerfectPop (4,5 s)
}

/* ── BROUILLON NUMÉRIQUE ─────────────────────────────────────── */
var scratchpadInitialized = false;
function initScratchpad() {
  if (scratchpadInitialized) return;
  var canvas = $('scratchpad-canvas');
  var ctx = canvas.getContext('2d');
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  var drawing = false;
  
  function getPos(e) {
    var rect = canvas.getBoundingClientRect();
    if(e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function start(e) {
    if (e.target !== canvas) return;
    e.preventDefault();
    drawing = true;
    var pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }
  function move(e) {
    if (!drawing) return;
    e.preventDefault();
    var pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }
  function stop(e) {
    if (!drawing) return;
    e.preventDefault();
    drawing = false;
    ctx.closePath();
  }

  canvas.addEventListener('mousedown', start);
  canvas.addEventListener('mousemove', move);
  canvas.addEventListener('mouseup', stop);
  canvas.addEventListener('mouseout', stop);

  canvas.addEventListener('touchstart', start, {passive: false});
  canvas.addEventListener('touchmove', move, {passive: false});
  canvas.addEventListener('touchend', stop, {passive: false});
  canvas.addEventListener('touchcancel', stop, {passive: false});

  $('btn-scratchpad-clear').addEventListener('click', function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  scratchpadInitialized = true;
}

// Initialisation globale
window.addEventListener('DOMContentLoaded', function() {
  initApp();
  
  // PWA Service Worker Registration
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => console.log('[AutoMaths PWA] Service Worker enregistré.', reg.scope))
      .catch((err) => console.error('[AutoMaths PWA] Erreur Service Worker:', err));
  }
});
