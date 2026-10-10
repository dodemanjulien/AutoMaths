/* AutoMaths – gen-bac-term.js : Générateurs BAC PRO Terminale (11 automatismes)
   CORRECTIF : closures avec IIFE — v(user) correctement reçu */

function genComplementProba(){
  var exs=[];
  var favs=[['1/4','3/4'],['2/5','3/5'],['1/3','2/3'],['3/8','5/8'],['7/10','3/10'],['1/2','1/2'],['1/5','4/5'],['3/5','2/5'],['9/10','1/10']];
  for(var i=0;i<10;i++){
    var f=pick(favs),t=rnd(0,1),q,ans;
    if(t===0){q='P(A) = '+f[0]+'. P(Ā) = ?';ans=f[1];}
    else{q='P(Ā) = '+f[1]+'. P(A) = ?';ans=f[0];}
    exs.push({question:q,answer:ans,explanation:'P(Ā)=1−P(A)='+ans,
      check:(function(a){return function(v){return checkStr(v,a);};})(ans)});
  }
  return exs;
}

function genUnionIncompat(){
  var exs=[];
  for(var i=0;i<10;i++){
    var d=pick([4,5,6,8,10,12]);
    var n1=rnd(1,Math.floor(d/2)),n2=rnd(1,d-n1-1)||1;
    var pa=fr(n1,d),pb=fr(n2,d);
    var nr=n1+n2,g=gcd(nr,d),res=fr(nr/g,d/g);
    exs.push({question:'A et B incompatibles. P(A)='+pa+', P(B)='+pb+'. P(A∪B)=?',
      answer:res,explanation:'P(A∪B)=P(A)+P(B)='+res,
      check:(function(a){return function(v){return checkStr(v,a);};})(res)});
  }
  return exs;
}

function genUnionProba(){
  var exs=[];
  for(var i=0;i<10;i++){
    var d=pick([8,10,12,20]);
    var na=rnd(2,d-2),nb=rnd(2,d-2),nab=rnd(1,Math.min(na,nb)-1)||1;
    var nab2=Math.min(nab,Math.min(na,nb));
    var nU=Math.min(na+nb-nab2,d);
    var pa=fr(na,d),pb=fr(nb,d),pab=fr(nab2,d);
    var g=gcd(nU,d),res=fr(Math.round(nU/g),Math.round(d/g));
    exs.push({question:'P(A)='+pa+', P(B)='+pb+', P(A∩B)='+pab+'. P(A∪B)=?',
      answer:res,explanation:'P(A∪B)=P(A)+P(B)−P(A∩B)='+res,
      check:(function(a){return function(v){return checkStr(v,a);};})(res)});
  }
  return exs;
}

function genIntersectProba(){
  var exs=[];
  for(var i=0;i<10;i++){
    var d=pick([10,12,20,24]);
    var nU=rnd(Math.floor(d/2)+1,d-1);
    var na=rnd(2,nU-1),nb=rnd(2,nU-1);
    var nab=na+nb-nU;if(nab<1){nab=1;nU=na+nb-1;}
    var pa=fr(na,d),pb=fr(nb,d),pU=fr(nU,d);
    var g=gcd(nab,d),res=fr(Math.round(nab/g),Math.round(d/g));
    exs.push({question:'P(A)='+pa+', P(B)='+pb+', P(A∪B)='+pU+'. P(A∩B)=?',
      answer:res,explanation:'P(A∩B)=P(A)+P(B)−P(A∪B)='+res,
      check:(function(a){return function(v){return checkStr(v,a);};})(res)});
  }
  return exs;
}

function genConditionalProba(){
  var exs=[];
  for(var i=0;i<10;i++){
    var d=pick([10,12,20]),nb=rnd(3,d-2),nab=rnd(1,nb-1)||1;
    var pb=fr(nb,d),pab=fr(nab,d);
    var g=gcd(nab,nb),res=fr(Math.round(nab/g),Math.round(nb/g));
    exs.push({question:'P(A∩B)='+pab+', P(B)='+pb+'. P(A|B)=?',
      answer:res,explanation:'P(A|B)=P(A∩B)/P(B)='+res,
      check:(function(a){return function(v){return checkStr(v,a);};})(res)});
  }
  return exs;
}

function genArithSeq(){
  var exs=[];
  for(var i=0;i<10;i++){
    var u0=rnd(-5,10),r=rnd(-4,6)||1,n=rnd(3,10);
    var un=u0+n*r,t=rnd(0,2),q,ans;
    if(t===0){q='Suite arithmétique : u₀='+u0+', raison r='+r+'. u_'+n+' = ?';ans=String(un);}
    else if(t===1){q='u₀='+u0+', u_'+n+'='+un+'. Raison r = ?';ans=String(r);}
    else{var u1=u0+r,u2=u0+2*r,u3=u0+3*r;q='u₁='+u1+', u₂='+u2+', u₃='+u3+'. Raison = ?';ans=String(r);}
    exs.push({question:q,answer:ans,explanation:'u_n = u₀+n×r',
      check:(function(a){return function(v){return checkNum(v,parseFloat(a))||checkStr(v,a);};})(ans)});
  }
  return exs;
}

function genGraphicRoots() {
  var exs = [];
  for (var i = 0; i < 10; i++) {
    var type = rnd(0, 2); // 0: 0 racine, 1: 1 racine, 2: 2 racines
    var a, alpha, beta, q, ans, exp;
    var x1, x2;
    var choices = [];
    var sign = pick([-1, 1]);

    if (type === 2) {
      // demi-écart entre les racines + coefficient choisis pour que le sommet
      // ET les deux racines restent dans la fenêtre visible (|y| <= 10)
      var d = pick([1, 2, 2, 3, 3, 4]);
      var aOpts = { 1: [2, 3], 2: [0.5, 1, 2], 3: [0.5, 1], 4: [0.5] };
      a = sign * pick(aOpts[d]);
      alpha = rnd(-(8 - d), 8 - d);
      x1 = alpha - d;
      x2 = alpha + d;
      beta = -a * d * d;
      ans = x1 + " et " + x2;
      exp = "La parabole coupe l'axe des abscisses en x = " + x1 + " et x = " + x2 + ".";
      choices = ["Aucune", String(x1), ans];
    } else if (type === 1) {
      a = sign * pick([0.5, 1, 2]);
      x1 = rnd(-7, 7);
      alpha = x1;
      beta = 0;
      ans = String(x1);
      exp = "La parabole touche l'axe des abscisses en un seul point : x = " + x1 + ".";
      var fakeX = x1 > 0 ? x1 - 2 : x1 + 2;
      choices = ["Aucune", ans, Math.min(x1, fakeX) + " et " + Math.max(x1, fakeX)];
    } else {
      a = sign * pick([0.5, 1, 2]);
      alpha = rnd(-6, 6);
      beta = sign * rnd(1, 5);
      ans = "Aucune";
      exp = "La parabole ne coupe pas l'axe des abscisses. Il n'y a donc aucune racine réelle.";
      var fx = rnd(-3, 3);
      choices = [ans, String(fx), (fx - 2) + " et " + (fx + 2)];
    }
    
    q = '<div style="text-align:center;margin-bottom:0.5rem;font-size:0.9em;">Lis graphiquement les racines de la fonction du second degré.<br><small style="color:var(--text-secondary);">(Réponds "Aucune", "x1" ou "x1 et x2")</small></div>';
    
    var w = 200, h = 200, center = 100, cell = 10;
    var svg = '<svg width="100%" height="auto" viewBox="0 0 '+w+' '+h+'" xmlns="http://www.w3.org/2000/svg" style="display:block; margin: 0.5rem auto; max-width:350px; background:rgba(255,255,255,0.02); border-radius:8px; border:1px solid rgba(255,255,255,0.1);">';
    
    for (var j = 0; j <= 20; j++) {
      var pos = j * cell;
      var isAxis = (j === 10);
      var stroke = isAxis ? 'rgba(203, 213, 225, 0.6)' : 'rgba(203, 213, 225, 0.1)';
      var sw = isAxis ? '1.5' : '1';
      svg += '<line x1="0" y1="'+pos+'" x2="'+w+'" y2="'+pos+'" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
      svg += '<line x1="'+pos+'" y1="0" x2="'+pos+'" y2="'+h+'" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
    }
    svg += '<polygon points="100,0 97,5 103,5" fill="rgba(203, 213, 225, 0.6)"/>';
    svg += '<polygon points="200,100 195,97 195,103" fill="rgba(203, 213, 225, 0.6)"/>';
    svg += '<text x="90" y="112" fill="#94a3b8" font-size="10" font-family="sans-serif">O</text>';
    svg += '<text x="108" y="112" fill="#94a3b8" font-size="10" font-family="sans-serif">1</text>';
    
    // Tracé : échantillonnage fin + rupture du chemin dès que la courbe
    // sort de la fenêtre (sinon les morceaux visibles sont reliés par un
    // segment parasite et la parabole ressemble à une droite).
    var pStr = '';
    var penDown = false;
    for (var k = 0; k <= 400; k++) {
      var x = -10 + k * 0.05;
      var y = a * (x - alpha) * (x - alpha) + beta;
      if (y >= -10 && y <= 10) {
        var px = Math.round((center + x * cell) * 100) / 100;
        var py = Math.round((center - y * cell) * 100) / 100;
        pStr += (penDown ? 'L' : 'M') + px + ',' + py + ' ';
        penDown = true;
      } else {
        penDown = false;
      }
    }
    if (pStr !== '') {
      svg += '<path d="'+pStr+'" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linejoin="round" />';
    }
    svg += '</svg>';
    q += svg;
    
    exs.push({
      question: q,
      answer: ans,
      choices: choices,
      explanation: exp,
      check: (function(correct) {
        return function(v) {
          var n = normStr(v);
          var c = normStr(correct);
          if (n === c) return true;
          if (c === 'aucune' && (n === '0' || n === 'pasderacine' || n === 'aucun' || n === '∅')) return true;
          if (correct.indexOf(' et ') !== -1) {
            var parts = correct.split(' et ');
            var rev = parts[1] + ' et ' + parts[0];
            if (n === normStr(rev)) return true;
            if (n === normStr(parts[0] + ';' + parts[1])) return true;
            if (n === normStr(parts[1] + ';' + parts[0])) return true;
            if (n === normStr(parts[0] + 'et' + parts[1])) return true;
            if (n === normStr(parts[1] + 'et' + parts[0])) return true;
          }
          return false;
        };
      })(ans)
    });
  }
  return exs;
}

function genFactorizedDeg2(){
  var exs=[];
  for(var i=0;i<10;i++){
    var x1=rnd(-5,5)||1,x2=rnd(-5,5)||2,a=rnd(1,3);
    var t=rnd(0,1),q,ans;
    if(t===0){
      q='Racines x₁='+x1+' et x₂='+x2+', a='+a+'. Forme factorisée ?';
      ans=a+'(x − '+x1+')(x − '+x2+')';
    }else{
      q='Racines de f(x)='+a+'(x − '+x1+')(x − '+x2+') ? (du plus petit au plus grand)';
      ans=Math.min(x1,x2)+' et '+Math.max(x1,x2);
    }
    exs.push({question:q,answer:ans,explanation:ans,
      check:(function(a){return function(v){return checkStr(v,a);};})(ans)});
  }
  return exs;
}

function genDerivative(){
  var exs=[];
  for(var i=0;i<10;i++){
    var t=rnd(0,2),q,ans;
    if(t===0){
      var a=rnd(1,5),b=rnd(-6,6),c=rnd(-8,8);
      q='f(x)='+a+'x² '+(b>=0?'+ '+b:'− '+Math.abs(b))+'x '+(c>=0?'+ '+c:'− '+Math.abs(c))+". f'(x)=?";
      ans=(2*a)+'x '+(b>=0?'+ '+b:'− '+Math.abs(b));
    }else if(t===1){
      var a2=rnd(1,8),b2=rnd(-8,8);
      q='f(x)='+a2+'x '+(b2>=0?'+ '+b2:'− '+Math.abs(b2))+". f'(x)=?";
      ans=String(a2);
    }else{
      var c2=rnd(-10,10);
      q='f(x)='+c2+" (constante). f'(x)=?";
      ans='0';
    }
    exs.push({question:q,answer:ans,explanation:"f'(x)="+ans,
      check:(function(a){return function(v){return checkStr(v,a);};})(ans)});
  }
  return exs;
}

function genSvgVectorGraph(vectors) {
  var w = 160, h = 160, center = 80, cell = 8;
  var svg = '<svg width="100%" height="auto" viewBox="0 0 '+w+' '+h+'" xmlns="http://www.w3.org/2000/svg" style="display:block; margin: 1rem auto; max-width:350px; background:rgba(255,255,255,0.02); border-radius:8px; border:1px solid rgba(255,255,255,0.1);">';
  
  for (var i = 0; i <= 20; i++) {
    var pos = i * cell;
    var isAxis = (i === 10);
    var stroke = isAxis ? 'rgba(203, 213, 225, 0.6)' : 'rgba(203, 213, 225, 0.1)';
    var sw = isAxis ? '1.5' : '1';
    svg += '<line x1="0" y1="'+pos+'" x2="'+w+'" y2="'+pos+'" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
    svg += '<line x1="'+pos+'" y1="0" x2="'+pos+'" y2="'+h+'" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
  }
  
  svg += '<polygon points="80,0 77,5 83,5" fill="rgba(203, 213, 225, 0.6)"/>';
  svg += '<polygon points="160,80 155,77 155,83" fill="rgba(203, 213, 225, 0.6)"/>';
  svg += '<text x="70" y="92" fill="#94a3b8" font-size="10" font-family="sans-serif">O</text>';
  
  for (var i = 0; i < vectors.length; i++) {
    var v = vectors[i];
    var px1 = center + v.x1 * cell;
    var py1 = center - v.y1 * cell;
    var px2 = center + v.x2 * cell;
    var py2 = center - v.y2 * cell;
    
    var color = v.color || '#3b82f6';
    var dash = v.isDashed ? 'stroke-dasharray="4,4"' : '';
    
    svg += '<line x1="'+px1+'" y1="'+py1+'" x2="'+px2+'" y2="'+py2+'" stroke="'+color+'" stroke-width="2" '+dash+'/>';
    
    var angle = Math.atan2(py2 - py1, px2 - px1);
    var arrSize = 6;
    var ax1 = px2 - arrSize * Math.cos(angle - Math.PI/6);
    var ay1 = py2 - arrSize * Math.sin(angle - Math.PI/6);
    var ax2 = px2 - arrSize * Math.cos(angle + Math.PI/6);
    var ay2 = py2 - arrSize * Math.sin(angle + Math.PI/6);
    svg += '<polygon points="'+px2+','+py2+' '+ax1+','+ay1+' '+ax2+','+ay2+'" fill="'+color+'"/>';
    
    if (v.name) {
      var mx = (px1 + px2)/2;
      var my = (py1 + py2)/2;
      var nx = -Math.sin(angle) * 12;
      var ny = Math.cos(angle) * 12;
      svg += '<text x="'+(mx+nx)+'" y="'+(my+ny+4)+'" fill="'+color+'" font-size="12" font-weight="bold" font-family="sans-serif" text-anchor="middle">'+v.name+'</text>';
    }
  }
  svg += '</svg>';
  return svg;
}

function genVectorSum(){
  var exs=[];
  for(var i=0;i<10;i++){
    var isVisual = rnd(0,1) === 0;
    var x1, y1, x2, y2, rx, ry;
    do {
      x1 = rnd(-5, 5); y1 = rnd(-5, 5);
      x2 = rnd(-5, 5); y2 = rnd(-5, 5);
      rx = x1 + x2; ry = y1 + y2;
    } while ((x1===0 && y1===0) || (x2===0 && y2===0) || rx < -9 || rx > 9 || ry < -9 || ry > 9);
    
    var ans = '('+rx+';'+ry+')';
    var q, exp;
    
    if (isVisual) {
      var vectors = [
        { x1: 0, y1: 0, x2: x1, y2: y1, color: '#3b82f6', name: 'u' },
        { x1: x1, y1: y1, x2: rx, y2: ry, color: '#ef4444', name: 'v' },
        { x1: 0, y1: 0, x2: rx, y2: ry, color: '#10b981', name: 'u+v', isDashed: true }
      ];
      var svg = genSvgVectorGraph(vectors);
      q = '<div style="text-align:center;">En utilisant la relation de Chasles sur le graphique ci-dessous, donne les coordonnées du vecteur somme <span style="color:#10b981; font-weight:bold;">u+v</span>.</div>' + svg;
      exp = 'Le point d\'arrivée (vert) est à l\'abscisse ' + rx + ' et l\'ordonnée ' + ry + ', donc la somme est ' + ans + '.';
    } else {
      q = '<span class="vec">u</span>('+x1+';'+y1+') + <span class="vec">v</span>('+x2+';'+y2+') = (? ; ?)';
      exp = ans;
    }
    
    exs.push({question:q, answer:ans, explanation:exp, check:(function(a){return function(v){return checkStr(v,a);};})(ans)});
  }
  return exs;
}

function genDataExploitation() {
  var exs = [];
  for (var i = 0; i < 10; i++) {
    var type = rnd(0, 1); // 0: tableau croisé, 1: diagramme en barres
    var q, ans, exp;

    if (type === 0) {
      // Tableau croisé 2x2 avec totaux
      var catRow = pick([['Filles','Garçons'],['Sport','Culture'],['Midi','Soir']]);
      var catCol = pick([['Lundi','Mardi'],['Théorie','Pratique'],['Oui','Non']]);
      var v00 = rnd(8, 35), v01 = rnd(8, 35), v10 = rnd(8, 35), v11 = rnd(8, 35);
      var totR0 = v00+v01, totR1 = v10+v11;
      var totC0 = v00+v10, totC1 = v01+v11;
      var total  = totR0+totR1;

      var grid = [
        [v00,   v01,   totR0],
        [v10,   v11,   totR1],
        [totC0, totC1, total]
      ];
      var rowNames = [catRow[0], catRow[1], 'Total'];
      var colNames = [catCol[0], catCol[1], 'Total'];

      // Choisir une cellule à masquer
      var hideR = rnd(0, 2), hideC = rnd(0, 2);
      ans = String(grid[hideR][hideC]);
      grid[hideR][hideC] = '?';

      q  = '<div style="font-size:0.9em;margin-bottom:8px;">Trouve la valeur manquante&nbsp;:</div>';
      q += '<table style="border-collapse:collapse;margin:4px auto;font-size:0.85em;width:auto;">';
      q += '<tr style="background:rgba(255,255,255,0.08);">';
      q += '<th style="border:1px solid #475569;padding:4px 8px;"></th>';
      for (var c = 0; c < 3; c++) {
        q += '<th style="border:1px solid #475569;padding:4px 8px;">'+(c<2?colNames[c]:'Total')+'</th>';
      }
      q += '</tr>';
      for (var r = 0; r < 3; r++) {
        var bg = r===2 ? 'background:rgba(255,255,255,0.05);font-weight:bold;' : '';
        q += '<tr style="'+bg+'">';
        q += '<td style="border:1px solid #475569;padding:4px 8px;font-weight:bold;">'+rowNames[r]+'</td>';
        for (var c2 = 0; c2 < 3; c2++) {
          var isBold = c2===2 ? 'font-weight:bold;' : '';
          var isQ    = grid[r][c2]==='?' ? 'color:#a78bfa;font-size:1.2em;font-weight:bold;' : '';
          q += '<td style="border:1px solid #475569;padding:4px 8px;text-align:center;'+isBold+isQ+'">'+grid[r][c2]+'</td>';
        }
        q += '</tr>';
      }
      q += '</table>';
      exp = 'Dans un tableau croisé, chaque Total = somme des cases de sa ligne (ou colonne). Ici la valeur manquante était '+ans+'.';
    } else {
      // Diagramme en barres
      var themes = [
        {cats:['Lundi','Mardi','Mercredi','Jeudi'], label:'Absences (élèves)'},
        {cats:['Rouge','Bleu','Vert','Jaune'],       label:'Préférences (votes)'},
        {cats:['1ère','Terminale','CAP C1','CAP C2'],label:'Effectifs (élèves)'},
        {cats:['Jan.','Fév.','Mars'],                label:'Ventes'},
      ];
      var th = pick(themes);
      var cats = th.cats;
      // Valeurs libres — l'élève doit lire précisément sur le graphique
      var vals = cats.map(function(){ return rnd(3, 28); });
      var targetIdx = rnd(0, cats.length - 1);
      ans = String(vals[targetIdx]);

      // Arrondir le max au multiple de 2 supérieur pour des graduations propres
      var maxVal = Math.max.apply(null, vals);
      if (maxVal % 2 !== 0) maxVal += 1;
      if (maxVal < 10) maxVal = 10;

      var w = 240, h = 185, pTop = 15, pRight = 10, pBot = 32, pLeft = 36;
      var graphW = w - pLeft - pRight;
      var graphH = h - pTop - pBot;
      var barW   = graphW / cats.length * 0.55;
      var spacing= graphW / cats.length;

      var svg = '<svg width="100%" height="auto" viewBox="0 0 '+w+' '+h+'" xmlns="http://www.w3.org/2000/svg" style="display:block;margin:0.5rem auto;max-width:350px;background:rgba(255,255,255,0.02);border-radius:8px;border:1px solid rgba(255,255,255,0.1);">';
      // Axes
      svg += '<line x1="'+pLeft+'" y1="'+pTop+'" x2="'+pLeft+'" y2="'+(h-pBot)+'" stroke="#cbd5e1" stroke-width="1.5"/>';
      svg += '<line x1="'+pLeft+'" y1="'+(h-pBot)+'" x2="'+(w-pRight)+'" y2="'+(h-pBot)+'" stroke="#cbd5e1" stroke-width="1.5"/>';
      // Graduations de 2 en 2 — ligne pleine sur l'axe, pointillée sur le graphe
      var step = 2;
      for (var tv = 0; tv <= maxVal; tv += step) {
        var ty = h - pBot - (tv / maxVal) * graphH;
        var isMajor = (tv % 10 === 0); // graduation principale tous les 10
        svg += '<line x1="'+(pLeft-(isMajor?5:3))+'" y1="'+ty+'" x2="'+pLeft+'" y2="'+ty+'" stroke="#cbd5e1" stroke-width="'+(isMajor?1.5:1)+'"/>';
        if (isMajor || tv % 10 === 0 || tv === 0) {
          svg += '<text x="'+(pLeft-7)+'" y="'+(ty+4)+'" fill="#94a3b8" font-size="9" text-anchor="end">'+tv+'</text>';
        }
        if (tv > 0) svg += '<line x1="'+pLeft+'" y1="'+ty+'" x2="'+(w-pRight)+'" y2="'+ty+'" stroke="#334155" stroke-width="1" stroke-dasharray="'+(isMajor?'3,2':'1,3')+'"/>';
      }
      // Barres
      for (var b = 0; b < cats.length; b++) {
        var bh = (vals[b] / maxVal) * graphH;
        var bx = pLeft + spacing * b + (spacing - barW) / 2;
        var by = h - pBot - bh;
        var fill = b === targetIdx ? '#a78bfa' : '#3b82f6';
        svg += '<rect x="'+bx+'" y="'+by+'" width="'+barW+'" height="'+bh+'" fill="'+fill+'" rx="2"/>';
        svg += '<text x="'+(bx+barW/2)+'" y="'+(h-pBot+14)+'" fill="#cbd5e1" font-size="9" text-anchor="middle">'+cats[b]+'</text>';
      }
      svg += '</svg>';

      q = '<div style="font-size:0.9em;margin-bottom:6px;">'+th.label+' — Quelle est la valeur de la catégorie <strong style="color:#a78bfa;">'+cats[targetIdx]+'</strong>&nbsp;?</div>' + svg;
      exp = 'La barre '+cats[targetIdx]+' (en violet) atteint la valeur '+ans+' sur l\'axe vertical.';
    }

    exs.push({ question: q, answer: ans, explanation: exp, check: makeCheckStr(ans) });
  }
  return exs;
}

function genVectorScalar(){
  var exs=[];
  for(var i=0;i<10;i++){
    var isVisual = rnd(0,1) === 0;
    var k, x, y, rx, ry;
    do {
      k = rnd(-3, 3);
      if (k===0 || k===1) k = 2;
      x = rnd(-4, 4); y = rnd(-4, 4);
      rx = k * x; ry = k * y;
    } while ((x===0 && y===0) || rx < -9 || rx > 9 || ry < -9 || ry > 9);
    
    var ans = '('+rx+';'+ry+')';
    var q, exp;
    
    if (isVisual) {
      var ox = rnd(-5, 5); if (ox+x < -9 || ox+x > 9) ox = 0;
      var oy = rnd(-5, 5); if (oy+y < -9 || oy+y > 9) oy = 0;
      
      var vectors = [ { x1: ox, y1: oy, x2: ox+x, y2: oy+y, color: '#3b82f6', name: 'u' } ];
      var svg = genSvgVectorGraph(vectors);
      
      q = '<div style="text-align:center;">Lis les coordonnées du vecteur <span class="vec">u</span> sur le graphique, puis calcule les coordonnées de <b>'+k+' × <span class="vec">u</span></b>.</div>' + svg;
      exp = 'Lecture graphique : <span class="vec">u</span>('+x+';'+y+'). Donc '+k+' × <span class="vec">u</span> = ('+(k*x)+' ; '+(k*y)+') = '+ans+'.';
    } else {
      q = k+' × <span class="vec">u</span>('+x+';'+y+') = (? ; ?)';
      exp = ans;
    }
    
    exs.push({question:q, answer:ans, explanation:exp, check:(function(a){return function(v){return checkStr(v,a);};})(ans)});
  }
  return exs;
}
