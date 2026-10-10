/* AutoMaths – minigame.js v2 : QCM + texte hybride */
var MiniGameEngine=(function(){
  var S={exs:[],cur:0,themeId:'stars',cb:null,diploma:'cap',bonusChanceUsed:false,inBonus:false};
  function $i(id){return document.getElementById(id);}
  function parseVal(s){
    var r=String(s).trim().replace(/,/g,'.').replace(/\u2212/g,'-').replace(/\u00a0/g,' ');
    var superscripts={'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁻':'-'};
    var normalized='';
    var inSuper=false;
    for(var i=0;i<r.length;i++){
      var char=r[i];
      if(superscripts[char]!==undefined){
        if(!inSuper){normalized+='^';inSuper=true;}
        normalized+=superscripts[char];
      }else{
        inSuper=false;
        normalized+=char;
      }
    }
    r=normalized;
    var mFrac=r.match(/^(-?\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/);
    if(mFrac)return parseFloat(mFrac[1])/parseFloat(mFrac[2]);
    r=r.replace(/[\u00d7x\*]\s*10\^/gi,'*10^');
    var mSci=r.match(/^(-?\d+(?:\.\d+)?)\s*\*?\s*10\^(-?\d+)$/);
    if(mSci)return parseFloat(mSci[1])*Math.pow(10,parseInt(mSci[2]));
    var mPow=r.match(/^10\^(-?\d+)$/);
    if(mPow)return Math.pow(10,parseInt(mPow[1]));
    return parseFloat(r);
  }
  function normStr(s){return String(s).toLowerCase().replace(/\u2212/g,'-').replace(/\u00a0/g,' ').trim().replace(/,/g,'.').replace(/\s*(cm[\u00b2\u00b3]?|m[\u00b2\u00b3]?|km|kg|g|mg|cl|ml|dl|l|\u20ac|%|km\/h|m\/s|cm2|m2)\s*/gi,'').replace(/\s+/g,'');}
  // Extrait le nombre et l'unité d'une chaîne. Ex: '12 cm' → {num:'12', unit:'cm'}
  var UNIT_RE=/^([\d\s.,\/\-+×÷²³⁴√π]*?)\s*(cm²|m²|km\/h|m\/s|cm2|m2|cm|km|dm|mm|m|kg|mg|d[Ll]|c[Ll]|m[Ll]|[Ll]|g|€|%|°C|°)\.?\s*$/i;
  function splitUnit(s){var m=String(s).trim().match(UNIT_RE);return m?{num:m[1].trim(),unit:m[2].trim().toLowerCase()}:{num:String(s).trim(),unit:null};}
  // Normalise une unité pour comparaison (m2↔m², l↔L, etc.)
  function normUnit(u){return (u||'').toLowerCase().replace(/2$/,'²').replace(/3$/,'³');}
  function chk(ex,val){
    var correct=splitUnit(String(ex.answer));
    if(correct.unit){
      // Unité requise dans la réponse élève
      var student=splitUnit(val);
      if(!student.unit||normUnit(student.unit)!==normUnit(correct.unit))return false;
      // Unité ok — vérifier la partie numérique
      var n1=normStr(student.num),n2=normStr(correct.num);
      // Réponse attendue = une unité seule (ex : « km ») : l'unité suffit
      if(n2==='')return n1==='';
      if(n1!==''&&n1===n2)return true;
      var p1=parseVal(student.num),p2=parseVal(correct.num);
      return !isNaN(p1)&&!isNaN(p2)&&Math.abs(p1-p2)<=Math.max(0.01,Math.abs(p2)*0.005);
    }
    // Pas d'unité — logique existante
    var norm=normStr(val),ok=false;
    if(typeof ex.check==='function'){try{ok=ex.check(norm);}catch(e){}}
    if(!ok&&val!==''&&ex.answer!==undefined){var n1=norm,n2=normStr(String(ex.answer));if(n1!==''&&n1===n2)ok=true;if(!ok){var p1=parseVal(val),p2=parseVal(String(ex.answer));if(!isNaN(p1)&&!isNaN(p2)&&Math.abs(p1-p2)<=Math.max(0.01,Math.abs(p2)*0.005))ok=true;}}
    return ok;
  }
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

  /* Transforme les fractions n/d dans un texte en HTML empilé */
  function fracHtml(text){
    return String(text).replace(/(\d+)\s*\/\s*(\d+)/g, function(m,n,d){
      return '<span class="frac"><span class="frac-num">'+n+'</span><span class="frac-bar"></span><span class="frac-den">'+d+'</span></span>';
    });
  }

  /* Mode de réponse selon diplôme et index */
  function getMode(){
    var G=GAMES[S.themeId]||GAMES.stars;
    if(G.mode!=='qcm') return 'text';
    if(S.diploma==='cap') return 'qcm';
    return S.cur<5?'qcm':'text'; // BAC PRO : 5 QCM + 5 libres
  }

  /* Génération de distracteurs — la bonne réponse est TOUJOURS présente */
  function generateChoices(ex){
    var ans=String(ex.answer).trim();
    if(ex.choices && Array.isArray(ex.choices) && ex.choices.length === 3) {
      var arr = ex.choices.slice();
      if(arr.indexOf(ans) === -1) arr[0] = ans;
      return arr.sort(function(){return Math.random()-0.5;});
    }

    // ── Familles symboliques connues ──────────────────────────
    // Si la réponse appartient à une famille, les distracteurs = les autres membres
    var FAMILIES=[
      ['<','>','='],
      ['oui','non'],
      ['vrai','faux'],
      ['+','-'],
      ['pair','impair'],
      ['km','m','cm','mm','dm'],
      ['kg','g','mg'],
      ['L','dL','cL','mL'],
      ['km/h','m/s'],
      ['m²','cm²','km²','mm²','m2','cm2'],
      ['cube','pavé droit','cône','cylindre','pyramide','sphère'],
      ['croissant','décroissant','constant'],
      ['positif','négatif','nul'],
    ];
    var ansLow=ans.toLowerCase();
    for(var fi=0;fi<FAMILIES.length;fi++){
      var fam=FAMILIES[fi];
      var match=fam.filter(function(s){return s.toLowerCase()===ansLow;});
      if(match.length>0){
        // Prendre les autres membres comme distracteurs
        var others=fam.filter(function(s){return s.toLowerCase()!==ansLow;});
        others=others.sort(function(){return Math.random()-0.5;}).slice(0,2);
        while(others.length<2)others.push(others[0]||'?');
        // Restaurer la casse originale de la réponse dans les choix
        var choices=[ans,others[0],others[1]];
        return choices.sort(function(){return Math.random()-0.5;});
      }
    }

    // Détection du séparateur décimal utilisé dans la réponse
    var useComma=(ans.indexOf(',')!==-1 && ans.indexOf('.')===-1);
    var ansN=ans.replace(',','.');
    var num=parseVal(ansN);

    var distractors=[];

    // ── Fraction (ex: "3/4") ──────────────────────────────────
    var frM=ansN.match(/^(\d+)\/(\d+)$/);
    if(frM){
      var n1=parseInt(frM[1]),d1=parseInt(frM[2]);
      [[n1+1,d1],[n1-1,d1],[n1,d1+1],[n1,d1-1],[n1+2,d1],[n1,d1*2],[n1*2,d1]].forEach(function(p){
        if(p[0]>0&&p[1]>1){var s=p[0]+'/'+p[1];if(s!==ans)distractors.push(s);}
      });
    }
    // ── Nombre (entier ou décimal) ───────────────────────────
    else if(!isNaN(num)&&isFinite(num)){
      var isInt=Math.abs(num-Math.round(num))<0.001;
      var decimals=isInt?0:((ansN.split('.')[1]||'').length);
      var mult=Math.pow(10,decimals);
      var fmt=function(w){
        var s=isInt?String(Math.round(w)):w.toFixed(decimals);
        return useComma?s.replace('.',','):s;
      };
      var deltas=isInt?[1,2,3,5,10,-1,-2,-3,-5]:[1/mult,5/mult,2/mult,-1/mult,-5/mult,1,-1];
      deltas.forEach(function(d){
        var w=Math.round((num+d)*mult*10)/mult/10;
        if(w!==num&&w>=0){var s=fmt(w);if(s!==ans&&distractors.indexOf(s)===-1)distractors.push(s);}
      });
      [2,10,0.1].forEach(function(m){
        var w=Math.round(num*m*mult)/mult;
        if(w!==num&&w>=0){var s=fmt(w);if(s!==ans&&distractors.indexOf(s)===-1)distractors.push(s);}
      });
    }
    // ── Texte libre — propose variations lettres ──────────────
    else{
      // Tenter de générer des variations légèrement différentes du texte
      distractors.push(ans+'s');
      distractors.push(ans.charAt(0).toUpperCase()+ans.slice(1)+'e');
      distractors.push(ans+'x');
    }

    // Dédoublonnage + fallback
    distractors=distractors.filter(function(c){return c&&c!=='NaN'&&c!=='Infinity'&&(c!=='0'||num===0);});
    while(distractors.length<2)distractors.push(String(Math.floor(Math.random()*20+1)));

    // Mélanger les distracteurs, prendre les 2 meilleurs
    distractors=distractors.sort(function(){return Math.random()-0.5;}).slice(0,2);

    // LA BONNE RÉPONSE EST TOUJOURS DANS LES 3 CHOIX
    var choices=[ans,distractors[0],distractors[1]];
    return choices.sort(function(){return Math.random()-0.5;});
  }

  /* Shell */
  function dots(n){var h='';for(var i=0;i<n;i++)h+='<span class="mg-dot" id="mg-d'+i+'"></span>';return h;}
  function buildShell(stageHtml,n){
    return '<div class="mg-wrap">'+
      '<div class="mg-stage" id="mg-stage">'+stageHtml+'</div>'+
      '<div class="mg-card">'+
        '<div class="mg-counter" id="mg-counter">1/'+n+'</div>'+
        '<div class="mg-badge-mode" id="mg-badge-mode"></div>'+
        '<div class="mg-qtext" id="mg-qtext"></div>'+
        '<div id="mg-ans"></div>'+
        '<div class="mg-fb" id="mg-fb"></div>'+
      '</div>'+
      '<div class="mg-dots">'+dots(n)+'</div>'+
    '</div>';
  }

  /* Render question */
  function renderQ(){
    var ex=S.exs[S.cur],n=S.exs.length,mode=getMode();
    $i('mg-counter').textContent=(S.cur+1)+'/'+n;
    var bm=$i('mg-badge-mode');
    if(bm){
      var G=GAMES[S.themeId]||GAMES.stars;
      if(G.mode==='qcm'&&S.diploma!=='cap'){
        if(S.cur===5){bm.innerHTML='<span class="mg-badge-switch">✏️ Réponses libres maintenant !</span>';setTimeout(function(){bm.innerHTML='';},2500);}
        else bm.innerHTML=mode==='qcm'?'<span class="mg-badge-q">🅰 QCM</span>':'<span class="mg-badge-t">✏️ Libre</span>';
      } else bm.innerHTML='';
    }
    var qt=$i('mg-qtext');
    var qStr = String(ex.question);
    var safeQ = (qStr.indexOf('<svg') !== -1 || qStr.indexOf('<span') !== -1 || qStr.indexOf('<div') !== -1 || qStr.indexOf('<table') !== -1 || qStr.indexOf('<sup') !== -1 || qStr.indexOf('<sub') !== -1 || qStr.indexOf('<b>') !== -1) ? qStr : esc(qStr);
    qt.innerHTML=fracHtml(safeQ);
    qt.classList.add('mg-pop');setTimeout(function(){qt.classList.remove('mg-pop');},400);
    $i('mg-fb').textContent='';$i('mg-fb').className='mg-fb';
    var ans=$i('mg-ans');
    if(mode==='qcm') renderChoices(ans,ex);
    else renderInput(ans);
  }

  function renderChoices(ansDiv,ex){
    var choices=generateChoices(ex);
    ansDiv.innerHTML='<div class="mg-choices">'+choices.map(function(c,i){
      return '<button class="mg-choice" id="mg-ch'+i+'" data-val="'+esc(c)+'">'+
        '<span class="mg-ch-lbl">'+['A','B','C'][i]+'</span>'+
        '<span class="mg-ch-val">'+esc(c)+'</span></button>';
    }).join('')+'</div>';
    choices.forEach(function(c,i){$i('mg-ch'+i).addEventListener('click',function(){submitChoice(c);});});
  }

  function renderInput(ansDiv){
    if (S.keyboardOpen === undefined) {
      S.keyboardOpen = (window.innerWidth < 1024);
    }
    ansDiv.innerHTML=
      '<div class="mg-row">'+
        '<input class="mg-input" id="mg-input" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Ta réponse\u2026" inputmode="'+(S.keyboardOpen?'none':'text')+'">'+
        '<button class="mg-btn-kb'+(S.keyboardOpen?' active':'')+'" id="mg-btn-kb" type="button" title="Afficher/Masquer le clavier virtuel">⌨️</button>'+
        '<button class="mg-btn" id="mg-btn">\u2713</button>'+
      '</div>'+
      '<div class="mg-keyboard" id="mg-keyboard" style="display:'+(S.keyboardOpen?'flex':'none')+'">'+
        '<div class="mg-kb-row">'+
          '<button type="button" class="mg-kb-key" data-val="7">7</button>'+
          '<button type="button" class="mg-kb-key" data-val="8">8</button>'+
          '<button type="button" class="mg-kb-key" data-val="9">9</button>'+
          '<button type="button" class="mg-kb-key mg-kb-op" data-val="\u00d7">\u00d7</button>'+
          '<button type="button" class="mg-kb-key mg-kb-op" data-val="\u00f7">\u00f7</button>'+
          '<button type="button" class="mg-kb-key mg-kb-spec" data-val="\u221a">\u221a</button>'+
        '</div>'+
        '<div class="mg-kb-row">'+
          '<button type="button" class="mg-kb-key" data-val="4">4</button>'+
          '<button type="button" class="mg-kb-key" data-val="5">5</button>'+
          '<button type="button" class="mg-kb-key" data-val="6">6</button>'+
          '<button type="button" class="mg-kb-key mg-kb-op" data-val="+">+</button>'+
          '<button type="button" class="mg-kb-key mg-kb-op" data-val="-">-</button>'+
          '<button type="button" class="mg-kb-key mg-kb-spec" data-val="/">/</button>'+
        '</div>'+
        '<div class="mg-kb-row">'+
          '<button type="button" class="mg-kb-key" data-val="1">1</button>'+
          '<button type="button" class="mg-kb-key" data-val="2">2</button>'+
          '<button type="button" class="mg-kb-key" data-val="3">3</button>'+
          '<button type="button" class="mg-kb-key mg-kb-exp" data-val="\u00b2">\u00b2</button>'+
          '<button type="button" class="mg-kb-key mg-kb-exp" data-val="10^">10ⁿ</button>'+
          '<button type="button" class="mg-kb-key mg-kb-exp" data-val="\u00d710^">\u00d710ⁿ</button>'+
        '</div>'+
        '<div class="mg-kb-row">'+
          '<button type="button" class="mg-kb-key" data-val="0">0</button>'+
          '<button type="button" class="mg-kb-key" data-val=",">,</button>'+
          '<button type="button" class="mg-kb-key mg-kb-spec" data-val="\u03c0">\u03c0</button>'+
          '<button type="button" class="mg-kb-key mg-kb-spec" data-val="\u00b0">\u00b0</button>'+
          '<button type="button" class="mg-kb-key mg-kb-spec" data-val="=">=</button>'+
          '<button type="button" class="mg-kb-key mg-kb-del" data-val="__del">\u232b</button>'+
        '</div>'+
        '<div class="mg-kb-row">'+
          '<button type="button" class="mg-kb-key" data-val="&lt;">&lt;</button>'+
          '<button type="button" class="mg-kb-key" data-val="&gt;">&gt;</button>'+
          '<button type="button" class="mg-kb-key" data-val="\u2264">\u2264</button>'+
          '<button type="button" class="mg-kb-key" data-val="\u2265">\u2265</button>'+
          '<button type="button" class="mg-kb-key" data-val="\u2260">\u2260</button>'+
          '<button type="button" class="mg-kb-key" data-val="\u221e">\u221e</button>'+
        '</div>'+
        '<div class="mg-kb-row">'+
          '<button type="button" class="mg-kb-key mg-kb-frac" id="mg-kb-frac-toggle" data-val="__frac" title="Saisir une fraction"><span class="frac frac-mini"><span class="frac-num">a</span><span class="frac-bar"></span><span class="frac-den">b</span></span></button>'+
          '<button type="button" class="mg-kb-key mg-kb-sym" data-val="x">x</button>'+
          '<button type="button" class="mg-kb-key" data-val=" ; "> ; </button>'+
          '<button type="button" class="mg-kb-key mg-kb-sym" data-val="(">(</button>'+
          '<button type="button" class="mg-kb-key" data-val=")">)</button>'+
          '<button type="button" class="mg-kb-key mg-kb-sym" data-val="\u2212">\u2212</button>'+
        '</div>'+
        '<div class="mg-kb-row mg-kb-units" id="mg-kb-units-row" style="display:none">'+
          '<button type="button" class="mg-kb-key mg-kb-unit" data-val=" cm">cm</button>'+
          '<button type="button" class="mg-kb-key mg-kb-unit" data-val=" m">m</button>'+
          '<button type="button" class="mg-kb-key mg-kb-unit" data-val=" km">km</button>'+
          '<button type="button" class="mg-kb-key mg-kb-unit" data-val=" kg">kg</button>'+
          '<button type="button" class="mg-kb-key mg-kb-unit" data-val=" g">g</button>'+
          '<button type="button" class="mg-kb-key mg-kb-unit" data-val=" \u20ac">\u20ac</button>'+
          '<button type="button" class="mg-kb-key mg-kb-unit" data-val=" %">%</button>'+
          '<button type="button" class="mg-kb-key mg-kb-unit" data-val=" m\u00b2">m\u00b2</button>'+
          '<button type="button" class="mg-kb-key mg-kb-unit" data-val=" L">L</button>'+
          '<button type="button" class="mg-kb-key mg-kb-unit" data-val=" km/h">km/h</button>'+
        '</div>'+
        '<div class="mg-kb-row">'+
          '<button type="button" class="mg-kb-key mg-kb-native" data-val="__native" title="Passer au clavier du téléphone">\ud83d\udd24 ABC \u2013 clavier du téléphone</button>'+
        '</div>'+
      '</div>';
    var inp=$i('mg-input'),btn=$i('mg-btn');
    // Détecter l'unité de la bonne réponse
    var exUnit=splitUnit(String(S.exs[S.cur].answer)).unit;
    // Afficher badge et rangee units si unité requise
    var unitRow=$i('mg-kb-units-row');
    if(exUnit&&unitRow){
      unitRow.style.display='';
      // Mettre en evidence le bouton de l'unite requise
      var uBtns=unitRow.querySelectorAll('.mg-kb-unit');
      uBtns.forEach(function(b){
        var bUnit=splitUnit(b.dataset.val||'').unit;
        if(bUnit&&bUnit.toLowerCase()===exUnit.toLowerCase())b.classList.add('mg-kb-unit-hl');
      });
      // Badge d'info
      var badge=document.createElement('div');
      badge.className='mg-unit-badge';
      badge.innerHTML='\ud83d\udccc Unit\u00e9 requise : <strong>'+exUnit+'</strong>';
      var ansDiv=inp?inp.closest('#mg-ans'):null;
      if(ansDiv)ansDiv.insertBefore(badge,ansDiv.firstChild);
    }
    setTimeout(function(){inp.focus();},80);
    btn.addEventListener('click',submitText);
    inp.onkeydown=function(e){if(e.key==='Enter')submitText();};
    
    // Toggle clavier virtuel
    var kbBtn=$i('mg-btn-kb');
    if(kbBtn){
      kbBtn.addEventListener('click',function(){
        setVirtualKeyboard(!S.keyboardOpen);
      });
    }

    // Clavier virtuel
    var kb=$i('mg-keyboard');
    if(kb){
      kb.addEventListener('mousedown',function(e){e.preventDefault();});// prevent blur
      kb.addEventListener('click',function(e){
        var key=e.target.closest('.mg-kb-key');
        if(!key)return;
        var val=key.dataset.val;
        /* ── Bouton fraction : bascule mode fraction ── */
        if(val==='__frac'){
          toggleFracMode();
          return;
        }
        /* ── Bouton ABC : passer au clavier du téléphone ── */
        if(val==='__native'){
          setVirtualKeyboard(false);
          return;
        }
        /* ── Champ actif (input normal ou numérateur/dénominateur) ── */
        var target=document.activeElement;
        if(!target||(!target.classList.contains('mg-input')&&!target.classList.contains('mg-frac-field')))target=$i('mg-input')||$i('mg-frac-num');
        if(!target||target.disabled)return;
        var s=target.selectionStart||target.value.length,en=target.selectionEnd||s;
        if(val==='__del'){
          if(s>0){target.value=target.value.substring(0,s-1)+target.value.substring(en);target.selectionStart=target.selectionEnd=s-1;}
        } else {
          target.value=target.value.substring(0,s)+val+target.value.substring(en);
          target.selectionStart=target.selectionEnd=s+val.length;
        }
        target.focus();
      });
    }
  }

  /* ── Clavier virtuel ↔ clavier du téléphone ──
     open = true  : clavier virtuel affiché, clavier du téléphone masqué (inputmode none)
     open = false : clavier virtuel masqué, le clavier du téléphone s'ouvre (lettres) */
  function setVirtualKeyboard(open){
    S.keyboardOpen = open;
    var kb=$i('mg-keyboard');
    if(kb) kb.style.display = open ? 'flex' : 'none';
    var kbBtn=$i('mg-btn-kb');
    if(kbBtn) kbBtn.classList.toggle('active', open);
    ['mg-input','mg-frac-num','mg-frac-den'].forEach(function(id){
      var f=$i(id); if(f) f.setAttribute('inputmode', open ? 'none' : 'text');
    });
    var target=document.activeElement;
    if(!target||(!target.classList.contains('mg-input')&&!target.classList.contains('mg-frac-field')))target=$i('mg-input')||$i('mg-frac-num');
    if(target&&target.offsetParent===null)target=$i('mg-frac-num')||target;
    if(target&&!target.disabled){
      // iPhone et Android ne relisent inputmode qu'au moment du focus : on refocalise
      target.blur();
      target.focus();
    }
  }

  /* ── Mode fraction : bascule entre champ simple et double champ ── */
  function toggleFracMode(){
    var ansDiv=$i('mg-ans');
    var normalInp=$i('mg-input');
    var fracWrap=$i('mg-frac-wrap');
    var fracBtn=$i('mg-kb-frac-toggle');
    if(fracWrap){
      /* Désactiver le mode fraction → revenir au champ simple */
      var numV=($i('mg-frac-num')||{}).value||'';
      var denV=($i('mg-frac-den')||{}).value||'';
      fracWrap.remove();
      if(normalInp){normalInp.style.display='';normalInp.value=numV&&denV?numV+'/'+denV:numV;normalInp.focus();}
      if(fracBtn)fracBtn.classList.remove('mg-kb-frac-active');
    } else {
      /* Activer le mode fraction → afficher double champ */
      var prevVal=(normalInp?normalInp.value:'').trim();
      var parts=prevVal.match(/^(.*)\/(.*)$/);
      if(normalInp)normalInp.style.display='none';
      var fw=document.createElement('div');
      fw.id='mg-frac-wrap';fw.className='mg-frac-wrap';
      fw.innerHTML=
        '<div class="mg-frac-input">'+
          '<input class="mg-frac-field mg-frac-field-num" id="mg-frac-num" type="text" inputmode="'+(S.keyboardOpen?'none':'text')+'" placeholder="Num." autocomplete="off" value="'+(parts?parts[1]:'')+'">'+
          '<div class="mg-frac-input-bar"></div>'+
          '<input class="mg-frac-field mg-frac-field-den" id="mg-frac-den" type="text" inputmode="'+(S.keyboardOpen?'none':'text')+'" placeholder="Dén." autocomplete="off" value="'+(parts?parts[2]:'')+'">'+
        '</div>';
      var row=ansDiv.querySelector('.mg-row');
      if(row)row.insertBefore(fw,row.querySelector('.mg-btn'));
      if(fracBtn)fracBtn.classList.add('mg-kb-frac-active');
      /* Navigation Tab entre numérateur et dénominateur */
      var numInp=$i('mg-frac-num'),denInp=$i('mg-frac-den');
      if(numInp){
        numInp.focus();
        numInp.onkeydown=function(e){
          if(e.key==='Enter'||e.key==='Tab'){e.preventDefault();denInp.focus();}
        };
      }
      if(denInp){
        denInp.onkeydown=function(e){
          if(e.key==='Enter'){e.preventDefault();submitText();}
          if(e.key==='Tab'){e.preventDefault();numInp.focus();}
        };
      }
    }
  }

  function submitChoice(val){for(var i=0;i<3;i++){var b=$i('mg-ch'+i);if(b)b.disabled=true;}processAnswer(val);}
  function submitText(){
    /* Mode fraction ? Combiner numérateur/dénominateur */
    var fracNum=$i('mg-frac-num'),fracDen=$i('mg-frac-den');
    if(fracNum&&fracDen&&fracNum.offsetParent!==null){
      var n=fracNum.value.trim(),d=fracDen.value.trim();
      if(!n||!d)return;
      fracNum.disabled=true;fracDen.disabled=true;$i('mg-btn').disabled=true;
      processAnswer(n+'/'+d);
      return;
    }
    var inp=$i('mg-input');if(!inp)return;var v=inp.value.trim();if(!v)return;inp.disabled=true;$i('mg-btn').disabled=true;processAnswer(v);
  }

  function processAnswer(val){
    var ex=S.exs[S.cur],ok=chk(ex,val);
    ex.userAnswer=val;ex.correct=ok;
    var dot=$i('mg-d'+S.cur);if(dot)dot.classList.add(ok?'mg-dot-ok':'mg-dot-err');
    if(getMode()==='qcm'){
      for(var i=0;i<3;i++){var b=$i('mg-ch'+i);if(!b)continue;if(normStr(b.dataset.val)===normStr(String(ex.answer)))b.classList.add('mg-ch-correct');else if(normStr(b.dataset.val)===normStr(val)&&!ok)b.classList.add('mg-ch-wrong');}
    }
    var fb=$i('mg-fb');
    if(ok){fb.innerHTML='<span class="mg-ok">✓ Bonne réponse !</span>';fb.classList.add('mg-fb-ok');}
    else{fb.innerHTML='<span class="mg-err">✗ Réponse : <strong>'+fracHtml(esc(String(ex.answer)))+'</strong>'+(ex.explanation?' · <em>'+fracHtml(esc(ex.explanation))+'</em>':'')+'</span>';fb.classList.add('mg-fb-err');}
    var G=GAMES[S.themeId]||GAMES.stars;
    if(G.update)G.update(ok,S.cur,S.exs.length);
    if(window.GamificationEngine){if(ok)GamificationEngine.snd('correct');}

    /* Vérification game over (uniquement si le jeu a getLives) */
    if(!ok&&G.getLives){
      var rem=G.getLives();
      if(rem<=0){
        if(S.inBonus){
          S.inBonus=false;
          setTimeout(triggerGameOver,1200);
          return;
        } else if(!S.bonusChanceUsed){
          S.bonusChanceUsed=true;
          setTimeout(triggerBonus,1400);
          return;
        } else {
          setTimeout(triggerGameOver,1200);
          return;
        }
      }
    }
    /* Bonus réussi */
    if(ok&&S.inBonus){
      S.inBonus=false;
      if(G.restoreAllLives)G.restoreAllLives();
      showBonusSuccess();
      setTimeout(function(){S.cur++;if(S.cur>=S.exs.length)S.cb(S.exs);else renderQ();},1400);
      return;
    }
    setTimeout(function(){S.cur++;if(S.cur>=S.exs.length)S.cb(S.exs);else renderQ();},ok?1300:2200);
  }

  function triggerBonus(){
    S.inBonus=true;
    var card=document.querySelector('.mg-card');
    if(card)card.classList.add('mg-bonus-mode');
    var bm=$i('mg-badge-mode');
    if(bm)bm.innerHTML='<span class="mg-badge-bonus">🧪 CHANCE BONUS ! Bonne réponse = toutes les vies restaurées !</span>';
    var fb=$i('mg-fb');
    if(fb){fb.innerHTML='<span class="mg-bonus-hint">❤️ Dernière chance — réponds correctement !</span>';fb.className='mg-fb mg-fb-bonus';}
    var inp=$i('mg-input');if(inp)inp.disabled=false;
    var btn=$i('mg-btn');if(btn)btn.disabled=false;
    var fn=$i('mg-frac-num'),fd=$i('mg-frac-den');
    if(fn)fn.disabled=false;if(fd)fd.disabled=false;
    document.querySelectorAll('.mg-choice').forEach(function(c){c.disabled=false;c.classList.remove('mg-ch-correct','mg-ch-wrong');});
  }

  function showBonusSuccess(){
    var fb=$i('mg-fb');
    if(fb){fb.innerHTML='<span class="mg-ok">🧪 Potion ! Toutes les vies restaurées ! ♥♥♥</span>';fb.className='mg-fb mg-fb-ok';}
    var card=document.querySelector('.mg-card');
    if(card)card.classList.remove('mg-bonus-mode');
  }

  function triggerGameOver(){
    var old=$i('mg-gameover-overlay');if(old&&old.parentNode)old.parentNode.removeChild(old);
    var ov=document.createElement('div');
    ov.id='mg-gameover-overlay';ov.className='mg-gameover-overlay';
    ov.innerHTML=
      '<div class="mg-gameover-box">'+
        '<div class="mg-gameover-icon">💥</div>'+
        '<div class="mg-gameover-title">GAME OVER</div>'+
        '<div class="mg-gameover-sub">Tu as perdu toutes tes vies…</div>'+
        '<div class="mg-gameover-score">Score : <strong>'+
          S.exs.filter(function(e){return e.correct;}).length+' / '+S.exs.length+
        '</strong></div>'+
        '<div class="mg-gameover-actions">'+
          '<button class="btn-primary mg-go-retry">🔁 Réessayer</button>'+
          '<button class="btn-lesson-skip mg-go-quit">Quitter</button>'+
        '</div>'+
      '</div>';
    document.body.appendChild(ov);
    ov.querySelector('.mg-go-retry').addEventListener('click',function(){
      if(ov.parentNode)ov.parentNode.removeChild(ov);
      S.bonusChanceUsed=false;S.inBonus=false;
      if(window.app_retryExercises)window.app_retryExercises();
    });
    ov.querySelector('.mg-go-quit').addEventListener('click',function(){
      if(ov.parentNode)ov.parentNode.removeChild(ov);
      if(window.app_goToAutomatism)window.app_goToAutomatism();
    });
  }

  /* ── MINI-JEUX ──────────────────────────────────────────────── */
  var GAMES={

  /* 🚀 SPACE SHOOTER – QCM (rocket) */
  rocket:{mode:'qcm',
    stage:function(n){
      return '<div class="mg-shoot-scene">'+
        '<div class="mg-lives-bar">Vies : <span id="mg-lives">\u2665 \u2665 \u2665</span></div>'+
        '<div class="mg-kills-badge">\ud83d\udca5 <span id="mg-kills">0</span> / '+n+'</div>'+
        '<div class="mg-enemy-wrap">'+
          '<div class="mg-enemy-ufo" id="mg-ufo">\ud83d\udc7e</div>'+
          '<div class="mg-ehp-wrap"><div class="mg-ehp-fill" id="mg-ehp" style="width:100%"></div></div>'+
        '</div>'+
        '<div class="mg-lbeam" id="mg-lbeam"></div>'+
        '<div class="mg-ship-ufo" id="mg-ship">\ud83d\udef8</div>'+
        '<div class="mg-expl" id="mg-expl"></div>'+
      '</div>';
    },
    getLives:function(){
      var livesEl=$i('mg-lives');
      if(!livesEl)return 3;
      return (livesEl.textContent.match(/\u2665/g)||[]).length;
    },
    restoreAllLives:function(){
      var livesEl=$i('mg-lives');
      if(livesEl){livesEl.textContent='\u2665 \u2665 \u2665';livesEl.style.color='';}
    },
    update:function(ok,idx,total){
      var ufo=$i('mg-ufo'),ship=$i('mg-ship'),livesEl=$i('mg-lives');
      var kills=$i('mg-kills'),ehp=$i('mg-ehp'),lbeam=$i('mg-lbeam'),expl=$i('mg-expl');
      if(ok){
        if(lbeam){lbeam.classList.add('mg-lbeam-fire');setTimeout(function(){lbeam.classList.remove('mg-lbeam-fire');},500);}
        if(ufo&&expl){
          ufo.style.opacity='0';
          expl.textContent='\ud83d\udca5';expl.classList.add('mg-expl-pop');
          setTimeout(function(){
            expl.textContent='';expl.classList.remove('mg-expl-pop');
            ufo.style.opacity='1';ufo.classList.add('mg-ufo-enter');
            setTimeout(function(){ufo.classList.remove('mg-ufo-enter');},500);
          },700);
        }
        if(kills)kills.textContent=parseInt(kills.textContent||0)+1;
        if(ehp)ehp.style.width=Math.max(0,100-(idx+1)/total*100)+'%';
      } else {
        if(ufo){ufo.classList.add('mg-ufo-atk');setTimeout(function(){ufo.classList.remove('mg-ufo-atk');},600);}
        if(ship){ship.classList.add('mg-ship-hit');setTimeout(function(){ship.classList.remove('mg-ship-hit');},600);}
        if(livesEl){
          var txt=livesEl.textContent,idx2=txt.lastIndexOf('\u2665');
          if(idx2!==-1)livesEl.textContent=txt.substring(0,idx2)+'\u2661'+txt.substring(idx2+1);
          if(livesEl.textContent.indexOf('\u2665')===-1)livesEl.style.color='#ef4444';
        }
      }
    }
  },


  /* ⚡ CENTRALE ÉLECTRIQUE – QCM (lightning) */
  lightning:{mode:'qcm',
    stage:function(n){
      var cells='';
      for(var i=0;i<n;i++) cells+='<div class="mg-cell" id="mg-cell'+i+'"></div>';
      return '<div class="mg-power-scene">'+
        '<div class="mg-storm-bg">'+
          '<span class="mg-tcloud">⛈</span>'+
          '<span class="mg-tcloud mg-tcloud2">🌩</span>'+
        '</div>'+
        '<div class="mg-power-grid-wrap">'+
          '<div class="mg-power-label">⚡ RÉSEAU ÉLECTRIQUE</div>'+
          '<div class="mg-power-cells" id="mg-pcells">'+cells+'</div>'+
          '<div class="mg-power-pct" id="mg-ppct">0 %</div>'+
        '</div>'+
        '<div class="mg-cbolt-wrap">'+
          '<div class="mg-cbolt" id="mg-cbolt">⚡</div>'+
          '<div class="mg-combo-row">'+
            '<span class="mg-combo-lbl">COMBO</span>'+
            '<span class="mg-combo-num" id="mg-cnum">0</span>'+
          '</div>'+
          '<div class="mg-combo-track"><div class="mg-combo-fill" id="mg-cfill" style="width:0%"></div></div>'+
        '</div>'+
        '<div class="mg-grid-status" id="mg-gstatus">Charge le réseau !</div>'+
      '</div>';
    },
    update:function(ok,idx,total){
      // Cellule de puissance
      var cell=$i('mg-cell'+idx);
      if(cell) cell.classList.add(ok?'mg-cell-on':'mg-cell-fail');

      // Pourcentage
      var charged=0;
      for(var i=0;i<=idx;i++){var c=$i('mg-cell'+i);if(c&&c.classList.contains('mg-cell-on'))charged++;}
      var pct=Math.round(charged/total*100);
      var ppct=$i('mg-ppct');if(ppct)ppct.textContent=pct+' %';

      // Combo (stocké dans data-combo sur la scène)
      var scene=document.querySelector('.mg-power-scene');
      var combo=parseInt((scene&&scene.dataset.combo)||0);
      combo=ok?combo+1:0;
      if(scene)scene.dataset.combo=combo;
      var cnum=$i('mg-cnum');if(cnum)cnum.textContent=combo;
      var cfill=$i('mg-cfill');if(cfill)cfill.style.width=Math.min(100,combo*10)+'%';

      // Éclair central
      var cbolt=$i('mg-cbolt');
      if(cbolt){
        cbolt.classList.remove('mg-cbolt-ok','mg-cbolt-fail','mg-cbolt-hyper');
        void cbolt.offsetWidth;
        if(ok&&combo>=5) cbolt.classList.add('mg-cbolt-hyper');
        else cbolt.classList.add(ok?'mg-cbolt-ok':'mg-cbolt-fail');
      }

      // Statut
      var st=$i('mg-gstatus');
      if(st){
        if(!ok) st.textContent='💔 Court-circuit ! Combo perdu';
        else if(combo>=5) st.textContent='⚡ HYPER CHARGÉ × '+combo+' !';
        else if(pct===100) st.textContent='🏆 Réseau à 100% !';
        else st.textContent='✅ +'+Math.round(100/total)+'% — Combo '+combo;
      }
    }
  },


  /* 🍕 PIZZA CHEF – texte */
  pizza:{mode:'text',
    stage:function(n){
      var TA = window.THEME_ASSETS || {};
      var defs = '<defs>'+
        '<pattern id="mg-pat-good" patternUnits="userSpaceOnUse" width="200" height="200"><image href="'+(TA.img_pizza_good||'')+'" x="0" y="0" width="200" height="200" preserveAspectRatio="xMidYMid slice" /></pattern>'+
        '<pattern id="mg-pat-bad" patternUnits="userSpaceOnUse" width="200" height="200"><image href="'+(TA.img_pizza_bad||'')+'" x="0" y="0" width="200" height="200" preserveAspectRatio="xMidYMid slice" /></pattern>'+
      '</defs>';
      var slices='',angle=360/n;
      for(var i=0;i<n;i++){var a1=i*angle,a2=(i+1)*angle,r=78,cx=100,cy=100;var x1=cx+r*Math.sin(a1*Math.PI/180),y1=cy-r*Math.cos(a1*Math.PI/180),x2=cx+r*Math.sin(a2*Math.PI/180),y2=cy-r*Math.cos(a2*Math.PI/180);slices+='<path id="mg-sl'+i+'" d="M'+cx+','+cy+' L'+x1+','+y1+' A'+r+','+r+' 0 0,1 '+x2+','+y2+' Z" fill="#374151" stroke="#0a0e1a" stroke-width="2"/>';}
      return '<div class="mg-pizza-scene">'+
        '<div class="mg-customer" id="mg-customer">😐 Client en attente</div>'+
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="160" height="160">'+defs+'<circle cx="100" cy="100" r="80" fill="#92400e"/>'+slices+'<circle cx="100" cy="100" r="16" fill="#fbbf24"/></svg>'+
        '<div class="mg-pizza-stats">'+
          '<div id="mg-pizza-stars">☆☆☆☆☆</div>'+
          '<div class="mg-pizza-earn">+<span id="mg-pizza-earn">0</span> €</div>'+
        '</div>'+
      '</div>';
    },
    update:function(ok,idx,total){
      var sl=$i('mg-sl'+idx);if(sl)sl.setAttribute('fill',ok?'url(#mg-pat-good)':'url(#mg-pat-bad)');
      var scene=document.querySelector('.mg-pizza-scene');
      var score=parseInt((scene&&scene.dataset.score)||0)+(ok?10:0);
      if(scene)scene.dataset.score=score;
      var earn=$i('mg-pizza-earn');if(earn)earn.textContent=score;
      var stars=$i('mg-pizza-stars');
      if(stars){
        var rating=Math.round(score/total/10*5);
        stars.textContent='★'.repeat(rating)+'☆'.repeat(5-rating);
      }
      var cust=$i('mg-customer');
      if(cust){
        var maxPossible = (idx+1)*10;
        var pct = Math.round(score/maxPossible * 100);
        if(pct>=80)cust.textContent='😄 Client ravi !';
        else if(pct>=50)cust.textContent='🙂 Client satisfait';
        else cust.textContent='😦 Client déçu…';
      }
    }
  },

  /* 🧌 RPG BATTLE – QCM (scale) */
  scale:{mode:'qcm',
    stage:function(){
      return '<div class="mg-rpg-scene">'+
        '<div class="mg-rpg-hero" id="mg-hero">🧙</div>'+
        '<div class="mg-rpg-arena">'+
          '<div class="mg-rpg-vs">⚔️</div>'+
          '<div class="mg-rpg-monster" id="mg-monster">👹</div>'+
          '<div class="mg-rpg-phase" id="mg-phase">Phase 1</div>'+
        '</div>'+
        '<div id="mg-dmg-float" class="mg-dmg-float"></div>'+
        '<div class="mg-rpg-bars">'+
          '<div class="mg-rpg-bar-wrap"><span>👹</span><div class="mg-rpg-bar"><div class="mg-rpg-fill" id="mg-mhp" style="width:100%"></div></div><span id="mg-mhp-txt">100</span></div>'+
          '<div class="mg-rpg-bar-wrap"><span>🧙</span><div class="mg-rpg-bar"><div class="mg-rpg-fill mg-rpg-fill-hero" id="mg-hhp" style="width:100%"></div></div><span id="mg-hhp-txt">100</span></div>'+
        '</div>'+
        '<div class="mg-rpg-status" id="mg-rpg-st">⚔️ Lance ton sort !</div>'+
      '</div>';
    },
    getLives:function(){
      var hhp=$i('mg-hhp');return hhp?parseFloat(hhp.style.width||'100'):100;
    },
    restoreAllLives:function(){
      var hhp=$i('mg-hhp');if(hhp)hhp.style.width='100%';
      var t=$i('mg-hhp-txt');if(t)t.textContent='100';
      var st=$i('mg-rpg-st');if(st)st.textContent='♥ Potion ! Héros soigné à 100% !';
    },
    update:function(ok,idx,total){
      var mhpPct=Math.max(0,100-((idx+1)/total)*100);
      var mhp=$i('mg-mhp'),hhp=$i('mg-hhp'),mon=$i('mg-monster'),st=$i('mg-rpg-st');
      var scene=document.querySelector('.mg-rpg-scene');
      var combo=ok?(parseInt((scene&&scene.dataset.rpgCombo)||0)+1):0;
      if(scene)scene.dataset.rpgCombo=combo;
      var dmg=Math.round(100/total)+(ok&&combo>=3?Math.round(combo*5):0);
      var fl=$i('mg-dmg-float');
      if(fl){fl.textContent=(ok?'-'+dmg+' 🔥':'MISS');
        fl.className='mg-dmg-float '+(ok?'mg-dmg-ok':(combo===0?'mg-dmg-miss':''));
        void fl.offsetWidth;fl.className='mg-dmg-float '+(ok?'mg-dmg-ok-anim':'mg-dmg-miss-anim');}
      if(ok){
        if(mhp)mhp.style.width=mhpPct+'%';
        if($i('mg-mhp-txt'))$i('mg-mhp-txt').textContent=Math.round(mhpPct);
        mon.classList.add(combo>=3?'mg-monster-crit':'mg-monster-hit');
        setTimeout(function(){mon.classList.remove('mg-monster-hit','mg-monster-crit');},500);
        if(mhpPct<=0)mon.textContent='💀';
        else if(mhpPct<=30)mon.textContent='😰';
        else if(mhpPct<=60)mon.textContent='😡';
        if(st)st.textContent=combo>=3?'🔥 COMBO ×'+combo+' — Attaque critique !':(combo>=2?'⚡ Combo ×'+combo:'✅ Sort réussi !');
      } else {
        var hhpV=Math.max(0,parseFloat((hhp?hhp.style.width:'100'))-10);
        if(hhp)hhp.style.width=hhpV+'%';
        if($i('mg-hhp-txt'))$i('mg-hhp-txt').textContent=Math.round(hhpV);
        mon.classList.add('mg-monster-atk');
        setTimeout(function(){mon.classList.remove('mg-monster-atk');},500);
        if(st)st.textContent='💔 Raté — le monstre contre-attaque !';
      }
    }
  },

  /* 🎾 TENNIS – QCM (target) */
  target:{mode:'qcm',
    stage:function(){
      return '<div class="mg-tennis-scene">'+
        '<div class="mg-net"></div>'+
        '<div class="mg-tennis-player" id="mg-tplayer">🏃</div>'+
        '<div class="mg-tennis-opponent" id="mg-topponent">🤖</div>'+
        '<div class="mg-ball" id="mg-ball">🎾</div>'+
        '<div class="mg-tennis-hud">'+
          '<div class="mg-tennis-score-wrap">'+
            '<div class="mg-tennis-name">TOI</div>'+
            '<div class="mg-tennis-pts" id="mg-tpts">0</div>'+
            '<div class="mg-tennis-game" id="mg-tgame"></div>'+
          '</div>'+
          '<div class="mg-tennis-score-wrap mg-tennis-score-wrap-op">'+
            '<div class="mg-tennis-name">ROBOT</div>'+
            '<div class="mg-tennis-pts" id="mg-opts">0</div>'+
            '<div class="mg-tennis-game" id="mg-ogame"></div>'+
          '</div>'+
        '</div>'+
        '<div class="mg-tennis-status" id="mg-tstatus">Service !</div>'+
      '</div>';
    },
    update:function(ok,idx){
      var SCORES=['0','15','30','40','JEU'];
      var ball=$i('mg-ball'),st=$i('mg-tstatus');
      var tpts=$i('mg-tpts'),opts=$i('mg-opts');
      var tgame=$i('mg-tgame'),ogame=$i('mg-ogame');
      var scene=document.querySelector('.mg-tennis-scene');
      var tp=parseInt((scene&&scene.dataset.tp)||0);
      var op=parseInt((scene&&scene.dataset.op)||0);
      var tg=parseInt((scene&&scene.dataset.tg)||0);
      var og=parseInt((scene&&scene.dataset.og)||0);
      var rally=parseInt((scene&&scene.dataset.rally)||0);
      // Ball animation
      if(ball){ball.classList.remove('mg-ball-right','mg-ball-net');void ball.offsetWidth;ball.classList.add(ok?'mg-ball-right':'mg-ball-net');}
      setTimeout(function(){if(ball)ball.classList.remove('mg-ball-right','mg-ball-net');},1000);
      if(ok){
        rally++;
        tp=Math.min(tp+1,4);
        if(tp===4){tg++;tp=0;op=0;if(tgame)tgame.textContent='●'.repeat(tg);}
        if(scene)scene.dataset.rally=rally;
        if(st)st.textContent=rally>=3?'🔥 RALLY × '+rally+' !':'✅ Point !';
      } else {
        rally=0;
        op=Math.min(op+1,4);
        if(op===4){og++;op=0;tp=0;if(ogame)ogame.textContent='●'.repeat(og);}
        if(st)st.textContent='💔 Faute ! Robot marque';
      }
      if(scene){scene.dataset.tp=tp;scene.dataset.op=op;scene.dataset.tg=tg;scene.dataset.og=og;scene.dataset.rally=rally||0;}
      if(tpts)tpts.textContent=SCORES[tp]||'0';
      if(opts)opts.textContent=SCORES[op]||'0';
    }
  },

  /* 🧪 MAD SCIENTIST – QCM (gears) */
  gears:{mode:'qcm',
    stage:function(n){
      return '<div class="mg-lab-scene">'+
        '<div class="mg-lab-top">'+
          '<div class="mg-progress-formula">Formules : <span id="mg-formula-count">0</span> / '+n+'</div>'+
          '<div class="mg-formula-bar"><div class="mg-formula-fill" id="mg-fbar" style="width:0%"></div></div>'+
        '</div>'+
        '<div class="mg-tubes">'+
          '<div class="mg-tube" id="mg-tube0"><div class="mg-liquid" id="mg-liq0"></div><span>A</span><div class="mg-bubbles" id="mg-bub0"></div></div>'+
          '<div class="mg-tube" id="mg-tube1"><div class="mg-liquid" id="mg-liq1"></div><span>B</span><div class="mg-bubbles" id="mg-bub1"></div></div>'+
          '<div class="mg-tube" id="mg-tube2"><div class="mg-liquid" id="mg-liq2"></div><span>C</span><div class="mg-bubbles" id="mg-bub2"></div></div>'+
        '</div>'+
        '<div class="mg-lab-status" id="mg-lab-st">🔬 Choisis la bonne formule !</div>'+
      '</div>';
    },
    update:function(ok,idx,total){
      var st=$i('mg-lab-st'),fc=$i('mg-formula-count'),fbar=$i('mg-fbar');
      var scene=document.querySelector('.mg-lab-scene');
      var done=parseInt((scene&&scene.dataset.done)||0)+(ok?1:0);
      if(scene)scene.dataset.done=done;
      if(fc)fc.textContent=done;
      if(fbar)fbar.style.width=Math.round(done/total*100)+'%';
      // Animate tubes
      for(var i=0;i<3;i++){
        var tube=$i('mg-tube'+i),bub=$i('mg-bub'+i),liq=$i('mg-liq'+i);
        if(!tube)continue;
        if(ok){
          tube.classList.add('mg-tube-ok');
          setTimeout((function(t){return function(){t.classList.remove('mg-tube-ok');};})(tube),800);
          if(bub){
            bub.innerHTML='';
            for(var j=0;j<8;j++){
              var b=document.createElement('div');
              b.className='mg-bubble mg-bubble-bright';
              b.style.left=(Math.random()*30)+'px';
              b.style.animationDelay=(Math.random()*0.3)+'s';
              bub.appendChild(b);
            }
            setTimeout((function(b_el){return function(){if(b_el)b_el.innerHTML='';};})(bub),1000);
          }
        } else {
          tube.classList.add('mg-tube-fail');
          setTimeout((function(t){return function(){t.classList.remove('mg-tube-fail');};})(tube),800);
          if(bub){
            bub.innerHTML='';
            for(var j=0;j<6;j++){
              var b=document.createElement('div');
              b.className='mg-bubble mg-bubble-dark';
              b.style.left=(Math.random()*30)+'px';
              b.style.animationDelay=(Math.random()*0.2)+'s';
              bub.appendChild(b);
            }
            setTimeout((function(b_el){return function(){if(b_el)b_el.innerHTML='';};})(bub),1000);
          }
        }
      }
      if(st)st.textContent=ok?'✅ Synthèse réussie ! ('+done+'/'+total+')':'💥 Réaction incorrecte !';
    }
  },

  /* \u2728 CONSTELLATIONS – texte */
  stars:{mode:'text',
    _ci:0,
    stage:function(n){
      var C=[
        {name:'Orion',desc:'Le Chasseur',emoji:'\ud83d\ude4b',
         s:[[50,6],[28,24],[72,24],[38,50],[50,54],[62,50],[28,80],[74,80],[50,72],[50,90]],
         l:[[0,1],[0,2],[1,2],[1,3],[2,5],[3,4],[4,5],[3,6],[5,7],[6,8],[7,8],[8,9]]},
        {name:'Cassiopée',desc:'La Reine',emoji:'\ud83d\udc51',
         s:[[10,52],[28,16],[50,40],[72,14],[90,48],[50,62],[28,74],[72,74],[50,84],[30,90]],
         l:[[0,1],[1,2],[2,3],[3,4],[2,5],[5,6],[5,7],[6,8],[7,8],[8,9]]},
        {name:'Grande Ourse',desc:'Ursa Major',emoji:'\ud83d\udc3b',
         s:[[12,22],[26,32],[40,40],[55,46],[66,68],[80,58],[76,35],[55,58],[55,70],[40,80]],
         l:[[0,1],[1,2],[2,3],[3,6],[6,5],[5,4],[4,3],[3,7],[7,8],[8,9]]},
        {name:'Scorpion',desc:'Le Scorpion',emoji:'\ud83e\udd82',
         s:[[35,16],[50,18],[65,16],[55,36],[58,52],[64,66],[70,78],[76,88],[50,28],[38,28]],
         l:[[0,1],[1,2],[8,0],[9,8],[1,3],[3,4],[4,5],[5,6],[6,7]]},
        {name:'Cygne',desc:'Le Cygne',emoji:'\ud83e\udda2',
         s:[[50,8],[50,50],[14,50],[86,50],[50,90],[35,28],[65,28],[28,38],[72,38],[50,70]],
         l:[[0,5],[5,1],[6,1],[1,7],[7,2],[1,8],[8,3],[1,4],[4,9]]},
        {name:'Lyre',desc:'La Lyre',emoji:'\ud83c\udfb5',
         s:[[50,10],[30,32],[70,32],[28,52],[72,52],[40,68],[60,68],[48,82],[52,82],[50,90]],
         l:[[0,1],[0,2],[1,3],[2,4],[3,4],[3,5],[4,6],[5,6],[5,7],[6,8],[7,8],[8,9]]},
        {name:'G\u00e9meaux',desc:'Les G\u00e9meaux',emoji:'\u264a',
         s:[[28,10],[58,12],[35,32],[25,50],[22,68],[18,82],[52,30],[60,50],[65,68],[70,85]],
         l:[[0,1],[0,2],[2,3],[3,4],[4,5],[1,6],[6,7],[7,8],[8,9]]},
        {name:'Taureau',desc:'Le Taureau',emoji:'\ud83d\udc02',
         s:[[18,16],[52,40],[40,50],[46,62],[62,62],[82,36],[88,18],[72,14],[30,28],[38,30]],
         l:[[0,8],[8,9],[9,1],[1,2],[2,3],[3,4],[1,4],[4,5],[5,6],[5,7]]},
      ];
      var con=C[this._ci%C.length]; this._ci++;
      S.con=con;
      var useN=Math.min(n,con.s.length);
      var h='',svg='<svg id="mg-star-svg" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;"></svg>';
      for(var i=0;i<useN;i++){var p=con.s[i];h+='<div class="mg-starpt mg-sp-dim" id="mg-sp'+i+'" style="left:'+p[0]+'%;top:'+p[1]+'%">\u22c6</div>';}
      return '<div class="mg-starmap">'+svg+h+
        '<div class="mg-const-header">'+
          '<span class="mg-const-emoji">'+con.emoji+'</span>'+
          '<div>'+
            '<div class="mg-const-name" id="mg-const-name">'+con.name+' \u2014 '+con.desc+'</div>'+
            '<div class="mg-const-score" id="mg-const-score">\u2726 0/'+useN+'</div>'+
          '</div>'+
        '</div>'+
      '</div>';
    },
    update:function(ok,idx,total){
      var con=S.con; if(!con)return;
      var useN=Math.min(total,con.s.length);
      var sp=$i('mg-sp'+idx);
      if(sp){sp.classList.remove('mg-sp-dim');sp.classList.add(ok?'mg-sp-lit':'mg-sp-off');if(ok)sp.textContent='\u2605';}
      // Draw lines to all lit neighbors
      if(ok){
        var svg=$i('mg-star-svg'),mapEl=sp?sp.parentElement:null;
        if(svg&&mapEl){
          var lit={};
          for(var i=0;i<useN;i++){var s=$i('mg-sp'+i);if(s&&s.classList.contains('mg-sp-lit'))lit[i]=true;}
          con.l.forEach(function(ln){
            var a=ln[0],b=ln[1];
            if(a>=useN||b>=useN)return;
            if(!((a===idx&&lit[b])||(b===idx&&lit[a])))return;
            var lid='mg-ln-'+Math.min(a,b)+'-'+Math.max(a,b);
            if($i(lid))return;
            var s1=$i('mg-sp'+a),s2=$i('mg-sp'+b);if(!s1||!s2)return;
            var r=mapEl.getBoundingClientRect(),r1=s1.getBoundingClientRect(),r2=s2.getBoundingClientRect();
            var line=document.createElementNS('http://www.w3.org/2000/svg','line');
            line.id=lid;
            line.setAttribute('x1',r1.left-r.left+r1.width/2);line.setAttribute('y1',r1.top-r.top+r1.height/2);
            line.setAttribute('x2',r2.left-r.left+r2.width/2);line.setAttribute('y2',r2.top-r.top+r2.height/2);
            line.setAttribute('stroke','rgba(250,204,21,0.5)');line.setAttribute('stroke-width','1.5');
            svg.appendChild(line);
          });
        }
      }
      var litCount=0;
      for(var i=0;i<useN;i++){var s=$i('mg-sp'+i);if(s&&s.classList.contains('mg-sp-lit'))litCount++;}
      var cs=$i('mg-const-score');if(cs)cs.textContent='\u2726 '+litCount+'/'+useN;
      var cn=$i('mg-const-name');
      if(cn){
        if(litCount>=useN)cn.textContent='\ud83c\udf1f '+con.name.toUpperCase()+' COMPL\u00c8TE !';
        else cn.textContent=(ok?'\u2605 ':'\u2606 ')+con.name+' \u2014 '+con.desc;
      }
    }
  },


  /* 📐 GEO PUZZLE -> RAYON LASER */
  geo:{mode:'text',
    stage:function(n){
      var pts = [[10, 55]];
      for(var i=1; i<=n; i++){
        pts.push([10 + i*(290/n), (i%2===0)?85:25]);
      }
      var svg = '<svg id="mg-laser-svg" viewBox="0 0 320 110" width="320" height="110" xmlns="http://www.w3.org/2000/svg" style="background:#0f172a; border:1px solid #1e293b; border-radius:4px; margin: 0 auto; display:block; max-width: 100%;">';
      // Draw dark grid background
      for(var i=0; i<320; i+=20) svg += '<line x1="'+i+'" y1="0" x2="'+i+'" y2="110" stroke="#1e293b" stroke-width="1"/>';
      for(var i=0; i<110; i+=20) svg += '<line x1="0" y1="'+i+'" x2="320" y2="'+i+'" stroke="#1e293b" stroke-width="1"/>';
      
      // Target points (mirrors)
      for(var i=1; i<=n; i++) {
        var x = pts[i][0], y = pts[i][1];
        var isLast = (i === n);
        if (isLast) {
          svg += '<circle id="mg-lsr-tgt" cx="'+x+'" cy="'+y+'" r="8" fill="#1e293b" stroke="#3b82f6" stroke-width="2" />';
          svg += '<text x="'+x+'" y="'+(y-12)+'" fill="#93c5fd" font-size="10" font-family="sans-serif" text-anchor="middle">OBJECTIF</text>';
        } else {
          svg += '<rect id="mg-lsr-m'+(i-1)+'" x="'+(x-5)+'" y="'+(y-5)+'" width="10" height="10" fill="#334155" stroke="#475569" stroke-width="1" transform="rotate(45 '+x+' '+y+')" opacity="0.4" />';
        }
      }
      // Start point (laser cannon)
      svg += '<circle cx="10" cy="55" r="6" fill="#ef4444" stroke="#fca5a5" stroke-width="2" />';
      svg += '<path d="M 10 52 L 15 55 L 10 58 Z" fill="#ffffff"/>';
      
      svg += '</svg>';
      // Store points in a dataset
      var pStr = JSON.stringify(pts);
      return '<div class="mg-laser-scene" data-pts=\''+pStr+'\'>'+svg+
        '<div class="mg-laser-status" id="mg-lsr-st">📡 Alimentation du Laser...</div>'+
        '</div>';
    },
    update:function(ok, idx, total){
      var scene = document.querySelector('.mg-laser-scene');
      var st = $i('mg-lsr-st');
      var svg = $i('mg-laser-svg');
      if (!scene || !svg) return;
      var pts = JSON.parse(scene.dataset.pts || '[]');
      
      if (ok) {
        var p1 = pts[idx]; // previous point (idx goes 0 to n-1)
        var p2 = pts[idx+1]; // current target
        // Draw laser segment
        var line = document.createElementNS('http://www.w3.org/2000/svg','line');
        line.setAttribute('x1', p1[0]); line.setAttribute('y1', p1[1]);
        line.setAttribute('x2', p2[0]); line.setAttribute('y2', p2[1]);
        line.setAttribute('stroke', '#34d399');
        line.setAttribute('stroke-width', '3');
        line.style.filter = 'drop-shadow(0 0 4px #10b981)';
        line.classList.add('mg-laser-beam');
        // Insert before rectangles (mirrors) so beam goes under them
        svg.insertBefore(line, svg.querySelector('rect') || svg.querySelector('circle:nth-of-type(1)'));
        
        // Light up mirror
        var m = $i('mg-lsr-m'+idx);
        if (m) {
          m.setAttribute('fill', '#fde047');
          m.setAttribute('stroke', '#f59e0b');
          m.setAttribute('opacity', '1');
          m.style.transition = 'all 0.3s ease';
        }
        
        if (idx === total - 1) {
          // Reached the end!
          var tgt = $i('mg-lsr-tgt');
          if (tgt) {
            tgt.setAttribute('fill', '#10b981');
            tgt.setAttribute('stroke', '#34d399');
            tgt.setAttribute('r', '10');
            tgt.style.transition = 'all 0.3s ease';
            tgt.style.filter = 'drop-shadow(0 0 6px #34d399)';
          }
          if (st) st.textContent = '🌟 Objectif atteint ! Système en ligne.';
        } else {
          if (st) st.textContent = '⚡ Miroir '+(idx+1)+' aligné !';
        }
      } else {
        // Draw error beam
        var p1 = pts[idx];
        var errX = p1[0] + 15 + Math.random()*20;
        var errY = p1[1] + (Math.random()-0.5)*40;
        var errLine = document.createElementNS('http://www.w3.org/2000/svg','line');
        errLine.setAttribute('x1', p1[0]); errLine.setAttribute('y1', p1[1]);
        errLine.setAttribute('x2', errX); errLine.setAttribute('y2', errY);
        errLine.setAttribute('stroke', '#ef4444');
        errLine.setAttribute('stroke-width', '2');
        errLine.setAttribute('stroke-dasharray', '4,4');
        errLine.classList.add('mg-laser-err');
        svg.appendChild(errLine);
        
        // Remove it after 1 sec
        setTimeout(function(){ if(errLine.parentNode) errLine.parentNode.removeChild(errLine); }, 1000);
        
        if (st) st.textContent = '💥 Déviation ! Alignement rompu.';
      }
    }
  },

  /* 🏎 CAR RACE – QCM (chart) */
  chart:{mode:'qcm',
    stage:function(){
      return '<div class="mg-race-scene">'+
        '<div class="mg-race-hud">'+
          '<div class="mg-race-pos" id="mg-pos">🏆 1<small>er</small></div>'+
          '<div class="mg-race-speed-wrap"><span id="mg-speed-val">0</span><span class="mg-kmh"> km/h</span></div>'+
          '<div class="mg-nitro-bar-wrap"><div class="mg-nitro-lbl">NITRO</div><div class="mg-nitro-track"><div class="mg-nitro-fill" id="mg-nitro" style="width:0%"></div></div></div>'+
        '</div>'+
        '<div class="mg-track">'+
          '<div class="mg-road-lines" id="mg-road-lines"></div>'+
          '<div class="mg-racer" id="mg-racer">🏎</div>'+
          '<div class="mg-rival" id="mg-rival">🚗</div>'+
        '</div>'+
        '<div class="mg-race-status" id="mg-race-st">🏁 Prêt au départ !</div>'+
      '</div>';
    },
    update:function(ok,idx,total){
      var racer=$i('mg-racer'),rival=$i('mg-rival'),st=$i('mg-race-st');
      var pos=$i('mg-pos'),spd=$i('mg-speed-val'),nitro=$i('mg-nitro');
      var scene=document.querySelector('.mg-race-scene');
      var streak=ok?(parseInt((scene&&scene.dataset.streak)||0)+1):0;
      if(scene)scene.dataset.streak=streak;
      var pct=(idx+1)/total;
      if(racer)racer.style.left=(ok?10+pct*70:Math.max(5,10+pct*50-5))+'%';
      if(rival)rival.style.left=(ok?10+pct*50:10+pct*65)+'%';
      if(st)st.textContent=ok?'💨 Tu accélères !':'😬 Rival te dépasse !';
    }
  },

  /* 🎰 ROULETTE – QCM (dice) */
  dice:{mode:'qcm',
    stage:function(){
      var sectors=['#ef4444','#1d4ed8','#16a34a','#dc2626','#1e40af','#15803d','#b91c1c','#1d4ed8','#166534','#ef4444'];
      var svgSize=120,cx=60,cy=60,r=55,n=sectors.length;
      var segs='';for(var i=0;i<n;i++){var a1=(i/n)*2*Math.PI-Math.PI/2,a2=((i+1)/n)*2*Math.PI-Math.PI/2;var x1=cx+r*Math.cos(a1),y1=cy+r*Math.sin(a1),x2=cx+r*Math.cos(a2),y2=cy+r*Math.sin(a2);segs+='<path d="M'+cx+','+cy+' L'+x1+','+y1+' A'+r+','+r+' 0 0,1 '+x2+','+y2+' Z" fill="'+sectors[i]+'" stroke="#0a0e1a" stroke-width="1.5"/>';}
      return '<div class="mg-casino-scene">'+
        '<div class="mg-wheel-wrap">'+
          '<svg id="mg-wheel" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120" style="border-radius:50%;overflow:hidden;">'+segs+'<circle cx="60" cy="60" r="12" fill="#1f2937" stroke="#fbbf24" stroke-width="2"/><text x="60" y="64" text-anchor="middle" fill="#fbbf24" font-size="10" font-weight="900">●</text></svg>'+
          '<div class="mg-wheel-needle">▼</div>'+
        '</div>'+
        '<div class="mg-casino-right">'+
          '<div class="mg-chips-disp">Jetons<div class="mg-chips-num" id="mg-chips">100</div></div>'+
          '<div class="mg-bet-wrap">Mise<div class="mg-bet-num" id="mg-bet">10</div></div>'+
          '<div class="mg-payout" id="mg-payout">x2 si correct</div>'+
        '</div>'+
        '<div class="mg-casino-status" id="mg-casino-st">🎥 Tournez la roue !</div>'+
      '</div>';
    },
    update:function(ok,idx){
      var wheel=$i('mg-wheel'),chips=$i('mg-chips'),payout=$i('mg-payout'),st=$i('mg-casino-st');
      var scene=document.querySelector('.mg-casino-scene');
      var total=parseInt((scene&&scene.dataset.chips)||100);
      var bet=Math.min(20,Math.max(5,Math.round(total*0.1)));
      var rot=parseInt((scene&&scene.dataset.rot)||0)+(ok?Math.round(Math.random()*720+360):Math.round(Math.random()*360+180));
      if(scene){scene.dataset.rot=rot;scene.dataset.chips=ok?total+bet*2:Math.max(0,total-bet);}
      if(wheel)wheel.style.transform='rotate('+rot+'deg)';
      if(chips)chips.textContent=ok?total+bet*2:Math.max(0,total-bet);
      if(payout)payout.textContent=ok?'+'+bet*2+' 💰':'-'+bet+' 💸';
      if(st)st.textContent=ok?'🎉 Jackpot ! ×2 misé':'😢 Manqué… perte de '+bet;
    }
  },

  /* 🎵 MELODY MAKER – texte */
  music:{mode:'text',
    stage:function(n){
      var h='';for(var i=0;i<n;i++)h+='<div class="mg-note" id="mg-nt'+i+'">♩</div>';
      return '<div class="mg-music-scene"><div class="mg-staff"><div class="mg-notes-row">'+h+'</div></div><div class="mg-music-label">Notes : <span id="mg-notes-count">0</span>/'+n+'</div></div>';
    },
    update:function(ok,idx){
      var nt=$i('mg-nt'+idx);if(nt){nt.classList.add(ok?'mg-note-ok':'mg-note-err');if(ok)nt.textContent='♪';}
      var c=$i('mg-notes-count');if(ok&&c)c.textContent=parseInt(c.textContent)+1;
    }
  },

  /* 🌊 WAVE SURFER – texte */
  wave:{mode:'text',
    stage:function(n){
      return '<div class="mg-wave-scene">'+
        '<canvas id="mg-wave-canvas" width="320" height="110"></canvas>'+
        '<div class="mg-surfer" id="mg-surfer">🏄</div>'+
        '<div class="mg-wave-hud">'+
          '<div class="mg-wave-score-disp">SCORE<div class="mg-wave-score-num" id="mg-wave-score">0</div></div>'+
          '<div class="mg-wave-mult-disp">MULTI<div class="mg-wave-mult-num" id="mg-wave-mult">×1</div></div>'+
          '<div class="mg-wave-status" id="mg-wave-st">Surfe la vague 🌊</div>'+
        '</div>'+
      '</div>';
    },
    update:function(ok,idx,total){
      var surfer=$i('mg-surfer'),ws=$i('mg-wave-score'),wm=$i('mg-wave-mult'),wst=$i('mg-wave-st'),canvas=$i('mg-wave-canvas');
      var scene=document.querySelector('.mg-wave-scene');
      var streak=ok?(parseInt((scene&&scene.dataset.streak)||0)+1):0;
      var score=parseInt((scene&&scene.dataset.score)||0);
      if(scene)scene.dataset.streak=streak;
      var mult=Math.min(5,1+Math.floor(streak/2));
      var pts=ok?mult*10:0;
      score+=pts;
      if(scene)scene.dataset.score=score;
      // Draw wave
      if(canvas){
        var ctx=canvas.getContext('2d');
        ctx.clearRect(0,0,320,110);
        // Gradient fill
        var grd=ctx.createLinearGradient(0,0,0,110);
        grd.addColorStop(0,ok?'rgba(56,189,248,0.3)':'rgba(239,68,68,0.2)');
        grd.addColorStop(1,'rgba(0,0,0,0)');
        ctx.fillStyle=grd;
        ctx.strokeStyle=ok?'#38bdf8':'#ef4444';
        ctx.lineWidth=ok?3:2;
        ctx.beginPath();
        for(var x=0;x<320;x++){var y=60+35*Math.sin((x/320*(3+streak*0.3)+idx*0.6)*Math.PI)*(ok?1:0.5);if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
        ctx.lineTo(320,110);ctx.lineTo(0,110);ctx.closePath();
        ctx.fill();ctx.stroke();
      }
      // Surfer position
      if(surfer){
        surfer.style.left=Math.min(260,20+idx*(280/total))+'px';
        surfer.style.bottom=ok?(40+streak*5)+'px':'20px';
        surfer.style.transform=ok?'rotate(-'+(streak*5)+'deg)':'rotate(20deg)';
      }
      if(ws)ws.textContent=score;
      if(wm)wm.textContent='×'+mult;
      if(wst)wst.textContent=ok?(streak>=3?'🔥 TRICK ×'+streak+' ! +'+pts+'pts':'✅ +'+pts+' pts | combo '+streak):'💥 Chute ! Combo perdu';
    }
  },


  /* 🎯 TARGET ARCHER – texte */
  arrow:{mode:'text',
    stage:function(n){
      var rings='<circle cx="110" cy="80" r="55" fill="#1e293b" stroke="#334155" stroke-width="1"/>'+
        '<circle cx="110" cy="80" r="42" fill="none" stroke="#ef4444" stroke-width="8" stroke-opacity="0.3"/>'+
        '<circle cx="110" cy="80" r="28" fill="none" stroke="#f59e0b" stroke-width="8" stroke-opacity="0.4"/>'+
        '<circle cx="110" cy="80" r="14" fill="#10b981" stroke="none"/>'+
        '<circle id="mg-bullseye" cx="110" cy="80" r="6" fill="#fbbf24"/>';
      var axes='<line x1="110" y1="25" x2="110" y2="10" stroke="#475569" stroke-width="1"/>'+
        '<line x1="10" y1="80" x2="210" y2="80" stroke="#475569" stroke-width="1"/>';
      return '<div class="mg-vector-scene">'+
        '<div class="mg-archer-score-wrap"><span class="mg-archer-lbl">POINTS</span><span class="mg-archer-pts" id="mg-archer-pts">0</span></div>'+
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 160" width="220" height="160">'+axes+rings+
          '<defs><marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#60a5fa"/></marker></defs>'+
          '<line id="mg-vec-line" x1="110" y1="80" x2="110" y2="80" stroke="#60a5fa" stroke-width="2.5" marker-end="url(#arr)"/>'+
        '</svg>'+
        '<div class="mg-vector-status" id="mg-vec-status">🎯 Vise le centre !</div>'+
      '</div>';
    },
    update:function(ok,idx,total){
      var line=$i('mg-vec-line'),st=$i('mg-vec-status'),pts=$i('mg-archer-pts');
      var scene=document.querySelector('.mg-vector-scene');
      var score=parseInt((scene&&scene.dataset.score)||0);
      // Arrow lands randomly near/far from center based on ok
      var dx=ok?(Math.random()-0.5)*20:(Math.random()-0.5)*60;
      var dy=ok?(Math.random()-0.5)*20:(Math.random()-0.5)*60;
      var tx=110+dx, ty=80+dy;
      if(line){line.setAttribute('x2',tx);line.setAttribute('y2',ty);}
      var dist=Math.sqrt(dx*dx+dy*dy);
      var gained=ok?Math.round(Math.max(10,50-dist)):0;
      score+=gained;
      if(scene)scene.dataset.score=score;
      if(pts)pts.textContent=score;
      if(st){
        if(!ok)st.textContent='💨 Raté ! (à '+ Math.round(dist)+'px du centre)';
        else if(dist<8)st.textContent='💥 BULLSEYE ! +'+gained+' pts';
        else if(dist<20)st.textContent='👍 Proche ! +'+gained+' pts';
        else st.textContent='✅ +'+gained+' pts';
      }
    }
  },


  /* 💶 BANK MANAGER – texte */
  coins:{mode:'text',
    stage:function(){
      return '<div class="mg-bank-scene">'+
        '<div class="mg-bank-header">'+
          '<div class="mg-bank-level" id="mg-bank-level">🪴 Compte Bronze</div>'+
          '<div class="mg-bank-balance-wrap">🏦 Solde : <span id="mg-balance">0 €</span></div>'+
        '</div>'+
        '<div class="mg-bank-log" id="mg-bank-log"></div>'+
        '<div class="mg-bank-bar-wrap"><div class="mg-bank-bar-fill" id="mg-bank-bar" style="width:0%"></div></div>'+
        '<div class="mg-bank-status" id="mg-bank-status">📊 Calcule l’intérêt !</div>'+
      '</div>';
    },
    update:function(ok,idx,total){
      var bal=$i('mg-balance'),st=$i('mg-bank-status'),log=$i('mg-bank-log'),lvl=$i('mg-bank-level'),bar=$i('mg-bank-bar');
      var scene=document.querySelector('.mg-bank-scene');
      var v=parseFloat((scene&&scene.dataset.balance)||0);
      var gain=ok?Math.floor(Math.random()*150+50):0;
      var penalty=ok?0:Math.min(v,30);
      v=Math.max(0,v+gain-penalty);
      if(scene)scene.dataset.balance=v;
      if(bal)bal.textContent=Math.round(v)+' €';
      if(bar)bar.style.width=Math.min(100,v/2000*100)+'%';
      // Niveau
      if(lvl){
        if(v>=1500)lvl.textContent='🪷 Compte Or';
        else if(v>=800)lvl.textContent='🩩 Compte Argent';
        else lvl.textContent='🪴 Compte Bronze';
      }
      // Log
      if(log){
        var entry=document.createElement('div');
        entry.className='mg-log-entry '+(ok?'mg-log-in':'mg-log-out');
        entry.textContent=(ok?'➕ +'+gain+' € (intérêt)':'➖ -'+penalty+' € (pénalité)');
        log.insertBefore(entry,log.firstChild);
        if(log.children.length>3)log.removeChild(log.lastChild);
      }
      if(st)st.textContent=ok?'✅ Calcul juste ! Solde : '+Math.round(v)+' €':'❌ Erreur ! Pénalité -'+penalty+' €';
    }
  }

  }; // fin GAMES

  return {
    launch:function(themeId,exercises,container,onComplete,diploma){
      S.themeId=themeId;S.exs=exercises;S.cur=0;S.cb=onComplete;S.diploma=diploma||'cap';
      var G=GAMES[themeId]||GAMES.stars;
      container.innerHTML=buildShell(G.stage(exercises.length),exercises.length);
      renderQ();
    }
  };
})();
console.log('[AutoMaths] minigame.js v2 OK – QCM hybride chargé');
