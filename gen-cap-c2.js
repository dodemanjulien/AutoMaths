/* AutoMaths – gen-cap-c2.js : Générateurs CAP C2 (12 automatismes) */

function genEffectifFreq(){
  var exs=[];
  for(var i=0;i<10;i++){
    var total=pick([20,25,40,50,100]),part=rnd(1,total-1);
    var pct=Math.round(part/total*1000)/10;
    var t=rnd(0,1),q,ans,v;
    if(t===0){q='Sur '+total+' élèves, '+part+' ont eu la moyenne. Fréquence en % ?';ans=numStr(pct);v=pct;}
    else{q='Effectif total : '+total+'. Fréquence : '+numStr(pct)+' %. Effectif du groupe ?';ans=String(part);v=part;}
    exs.push({question:q,answer:ans,explanation:part+'/'+total+'='+numStr(pct)+'%',check:makeCheckNum(v,0.05)});
  }
  return exs;
}

function genMeanStat(){
  var exs=[];
  for(var i=0;i<10;i++){
    var n=rnd(3,6),vals=[],sum=0;
    for(var j=0;j<n;j++){var v=rnd(5,18);vals.push(v);sum+=v;}
    var moy=Math.round(sum/n*10)/10;
    exs.push({question:'Série : '+vals.join(' ; ')+'. Calculer la moyenne.',
      answer:numStr(moy),explanation:'('+vals.join('+')+') ÷ '+n+' = '+numStr(moy),check:makeCheckNum(moy,0.1)});
  }
  return exs;
}

function genFourthProp(){
  var exs=[];
  for(var i=0;i<10;i++){
    var a=rnd(2,10),b=rnd(2,8),c=rnd(2,10);
    var d=Math.round(b*c/a*100)/100;
    exs.push({question:'Si '+a+' → '+b+', alors '+c+' → ?',
      answer:numStr(d),explanation:c+'×'+b+'÷'+a+'='+numStr(d),check:makeCheckNum(d,0.01)});
  }
  return exs;
}

function genPropCoeff(){
  var exs=[];
  for(var i=0;i<10;i++){
    var k=rnd(2,8),x=rnd(1,10);
    exs.push({question:'Tableau proportionnel : '+x+' → '+(k*x)+'. Coefficient k = ?',
      answer:String(k),explanation:'k = '+(k*x)+' ÷ '+x+' = '+k,check:makeCheckNum(k)});
  }
  return exs;
}

function genPercentageScaleC2(){
  var exs=[];
  for(var i=0;i<10;i++){
    var base=pick([50,80,100,120,200]),pct=pick([5,10,20,25,50]);
    var t=rnd(0,1),res,q;
    if(t===0){res=Math.round(base*(1+pct/100)*100)/100;q='Valeur : '+base+'. Augmentation de '+pct+' % → ?';}
    else{res=Math.round(base*(1-pct/100)*100)/100;q='Valeur : '+base+'. Réduction de '+pct+' % → ?';}
    exs.push({question:q,answer:numStr(res),explanation:numStr(res),check:makeCheckNum(res,0.1)});
  }
  return exs;
}

function genLinearEquationC2(){
  var exs=[];
  for(var i=0;i<10;i++){
    var a=rnd(1,6),x=rnd(-5,10),b=rnd(-10,10),c=a*x+b;
    exs.push({question:a+'x '+(b>=0?'+ '+b:'− '+Math.abs(b))+' = '+c+' ; x = ?',
      answer:String(x),explanation:'x = '+x,check:makeCheckNum(x)});
  }
  return exs;
}

function genCartesianCoords(){
  var exs=[];
  for(var i=0;i<10;i++){
    var x=rnd(-6,6),y=rnd(-6,6),t=rnd(0,1),q,ans;
    if(t===0){q='Point A('+x+' ; '+y+'). Abscisse = ?';ans=String(x);}
    else{q='Point A('+x+' ; '+y+'). Ordonnée = ?';ans=String(y);}
    exs.push({question:q,answer:ans,explanation:ans,check:makeCheckNum(parseFloat(ans))});
  }
  return exs;
}

/* ── Utilitaires SVG Repère Orthonormé ─────────────────────────────── */
function genSvgFunctionGraph(pts) {
  var size = 400, cell = 20, center = 200;
  var svg = '<svg width="100%" height="auto" viewBox="0 0 '+size+' '+size+'" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border:1px solid #cbd5e1; display:block; margin: 0.5rem auto; border-radius:4px; max-width:350px;">';
  
  // Quadrillage fin
  for(var i=0; i<=size; i+=cell) {
    svg += '<line x1="'+i+'" y1="0" x2="'+i+'" y2="'+size+'" stroke="#e2e8f0" stroke-width="1" />';
    svg += '<line x1="0" y1="'+i+'" x2="'+size+'" y2="'+i+'" stroke="#e2e8f0" stroke-width="1" />';
  }
  
  // Axes gras
  svg += '<line x1="'+center+'" y1="0" x2="'+center+'" y2="'+size+'" stroke="#64748b" stroke-width="2" />';
  svg += '<line x1="0" y1="'+center+'" x2="'+size+'" y2="'+center+'" stroke="#64748b" stroke-width="2" />';
  
  // Flèches des axes
  svg += '<polygon points="'+center+',0 '+(center-4)+',10 '+(center+4)+',10" fill="#64748b" />';
  svg += '<polygon points="'+size+','+center+' '+(size-10)+','+(center-4)+' '+(size-10)+','+(center+4)+'" fill="#64748b" />';
  
  // Graduations unitaires
  svg += '<line x1="'+(center+cell)+'" y1="'+(center-3)+'" x2="'+(center+cell)+'" y2="'+(center+3)+'" stroke="#64748b" stroke-width="2" />';
  svg += '<text x="'+(center+cell-4)+'" y="'+(center+16)+'" fill="#64748b" font-size="12" font-family="sans-serif">1</text>';
  
  svg += '<line x1="'+(center-3)+'" y1="'+(center-cell)+'" x2="'+(center+3)+'" y2="'+(center-cell)+'" stroke="#64748b" stroke-width="2" />';
  svg += '<text x="'+(center-14)+'" y="'+(center-cell+4)+'" fill="#64748b" font-size="12" font-family="sans-serif">1</text>';
  
  // Origine O
  svg += '<text x="'+(center-12)+'" y="'+(center+14)+'" fill="#64748b" font-size="12" font-family="sans-serif" font-weight="bold">O</text>';
  
  // Courbe (polyline)
  if (pts && pts.length > 0) {
    var pStr = '';
    for(var i=0; i<pts.length; i++){
      var px = center + pts[i].x * cell;
      var py = center - pts[i].y * cell;
      pStr += px+','+py+' ';
    }
    svg += '<polyline points="'+pStr+'" fill="none" stroke="#3b82f6" stroke-width="3" stroke-linejoin="round" />';
    
    // Points (cercles sur la courbe)
    for(var i=0; i<pts.length; i++){
      var px = center + pts[i].x * cell;
      var py = center - pts[i].y * cell;
      svg += '<circle cx="'+px+'" cy="'+py+'" r="4" fill="#1d4ed8" />';
    }
  }
  
  svg += '</svg>';
  return svg;
}

function genFunctionReadingC2(){
  var exs=[];
  for(var i=0;i<10;i++){
    // Générer 5 points avec des abscisses et ordonnées distinctes et croissantes en x
    var pts = [];
    var xValues = [];
    var yValues = [];
    // Choisir 5 X distincts entre -9 et +9, triés
    while(xValues.length < 5) {
      var rx = rnd(-9, 9);
      if(xValues.indexOf(rx) === -1) xValues.push(rx);
    }
    xValues.sort(function(a,b){return a-b;});
    
    // Choisir 5 Y distincts entre -9 et +9
    while(yValues.length < 5) {
      var ry = rnd(-9, 9);
      if(yValues.indexOf(ry) === -1) yValues.push(ry);
    }
    if (rnd(0, 1) === 0) {
      yValues.sort(function(a,b){return a-b;}); // strictement croissante
    } else {
      yValues.sort(function(a,b){return b-a;}); // strictement décroissante
    }
    
    for(var j=0; j<5; j++) {
      pts.push({ x: xValues[j], y: yValues[j] });
    }
    
    var svg = genSvgFunctionGraph(pts);
    
    // Choisir une question au hasard (Image ou Antécédent)
    var targetIdx = rnd(0, 4);
    var targetPoint = pts[targetIdx];
    var isImage = rnd(0, 1) === 0;
    
    var q, ans, exp;
    if (isImage) {
      q = '<div style="text-align:center;">En lisant la courbe ci-dessous, quelle est <b>l\'image</b> de ' + targetPoint.x + ' ?</div>' + svg;
      ans = String(targetPoint.y);
      exp = 'Le point d\'abscisse ' + targetPoint.x + ' a pour ordonnée ' + targetPoint.y + '.';
    } else {
      q = '<div style="text-align:center;">En lisant la courbe ci-dessous, quel est <b>l\'antécédent</b> de ' + targetPoint.y + ' ?</div>' + svg;
      ans = String(targetPoint.x);
      exp = 'Le point d\'ordonnée ' + targetPoint.y + ' a pour abscisse ' + targetPoint.x + '.';
    }
    
    exs.push({question:q, answer:ans, explanation:exp, check:makeCheckNum(parseFloat(ans))});
  }
  return exs;
}

function genGeometricConceptC2(){
  var items=[
    {q:'M est sur la médiatrice de [AB]. Relation ?',a:'MA=MB'},
    {q:'Deux droites perpendiculaires forment un angle de ? degrés',a:'90'},
    {q:'Point M milieu de [AB] avec A(0;0) et B(4;6). Ordonnée de M ?',a:'3'},
    {q:'La médiatrice d\'un segment est-elle perpendiculaire à lui ?',a:'oui'},
    {q:'Tout point de la médiatrice de [AB] est équidistant de A et ?',a:'B'},
  ];
  var exs=[];
  for(var i=0;i<10;i++){
    var item=pick(items);
    exs.push({question:item.q,answer:item.a,explanation:item.a,check:makeCheckNumOrStr(item.a)});
  }
  return exs;
}

function genParallelPerpFig(){
  var items=[
    {q:'d₁ ⊥ d₂ et d₂ // d₃. Relation entre d₁ et d₃ ?',a:'d₁⊥d₃'},
    {q:'d₁ // d₂ et d₂ // d₃. Relation entre d₁ et d₃ ?',a:'d₁//d₃'},
    {q:'Si d₁ ⊥ d₂ et d₁ ⊥ d₃, relation entre d₂ et d₃ ?',a:'d₂//d₃'},
    {q:'Angles alternes-internes formés par deux parallèles et une sécante : égaux ?',a:'oui'},
  ];
  var exs=[];
  for(var i=0;i<10;i++){
    var item=pick(items);
    exs.push({question:item.q,answer:item.a,explanation:item.a,check:makeCheckStr(item.a)});
  }
  return exs;
}

function genSvgPythagoras(valA, valB, valC, missingType) {
  var svg = '<svg width="100%" height="auto" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" style="display:block; margin: 1rem auto; max-width:160px; filter:drop-shadow(0 4px 6px rgba(0,0,0,0.05));">';
  var stroke = '#3b82f6', fill = 'rgba(59, 130, 246, 0.15)', sw = '3', red = '#ef4444';
  
  // Triangle rectangle
  svg += '<polygon points="30,130 130,130 30,30" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
  // Angle droit en rouge
  svg += '<polyline points="30,115 45,115 45,130" fill="none" stroke="'+red+'" stroke-width="2"/>';
  
  // Text labels
  var lblA = (missingType === 'a') ? '?' : valA;
  var lblB = (missingType === 'b') ? '?' : valB;
  var lblC = (missingType === 'c') ? '?' : valC;
  
  svg += '<text x="15" y="85" fill="#0f172a" font-size="16" font-family="sans-serif" font-weight="bold" text-anchor="middle">'+lblA+'</text>';
  svg += '<text x="80" y="150" fill="#0f172a" font-size="16" font-family="sans-serif" font-weight="bold" text-anchor="middle">'+lblB+'</text>';
  
  // Hypoténuse placée au centre du côté oblique
  svg += '<text x="95" y="75" fill="#0f172a" font-size="16" font-family="sans-serif" font-weight="bold" text-anchor="middle">'+lblC+'</text>';
  
  svg += '</svg>';
  return svg;
}

function genSegmentLength(){
  var trips=[[3,4,5],[5,12,13],[6,8,10],[8,15,17],[9,12,15]];
  var exs=[];
  for(var i=0;i<10;i++){
    var t=pick(trips),k=rnd(1,3);
    var a=t[0]*k, b=t[1]*k, c=t[2]*k, tp=rnd(0,2), q, ans;
    
    var isVisual = rnd(0, 1) === 0;
    
    if(tp===0){ // hypotenuse manquante
      ans=String(c);
      if (isVisual) {
        q = '<div style="text-align:center;">D\'après le théorème de Pythagore, trouve la longueur manquante (?) :</div>' + genSvgPythagoras(a, b, c, 'c');
      } else {
        q = 'Les côtés de l\'angle droit valent '+a+' et '+b+'. L\'hypoténuse = ?';
      }
    }
    else if(tp===1){ // côté B manquant
      ans=String(b);
      if (isVisual) {
        q = '<div style="text-align:center;">D\'après le théorème de Pythagore, trouve la longueur manquante (?) :</div>' + genSvgPythagoras(a, b, c, 'b');
      } else {
        q = 'L\'hypoténuse vaut '+c+', un côté de l\'angle droit vaut '+a+'. L\'autre côté = ?';
      }
    }
    else{ // côté A manquant
      ans=String(a);
      if (isVisual) {
        q = '<div style="text-align:center;">D\'après le théorème de Pythagore, trouve la longueur manquante (?) :</div>' + genSvgPythagoras(a, b, c, 'a');
      } else {
        q = 'L\'hypoténuse vaut '+c+', un côté de l\'angle droit vaut '+b+'. L\'autre côté = ?';
      }
    }
    exs.push({question:q,answer:ans,explanation:ans,check:makeCheckNum(parseFloat(ans),0.1)});
  }
  return exs;
}

function genSvgFigure(type) {
  var svg = '<svg width="100%" height="auto" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" style="display:block; margin: 1rem auto; max-width:160px; filter:drop-shadow(0 4px 6px rgba(0,0,0,0.05));">';
  var stroke = '#3b82f6', fill = 'rgba(59, 130, 246, 0.15)', sw = '3', red = '#ef4444';
  
  function tick(cx, cy, angle) {
    var s = Math.sin(angle), c = Math.cos(angle);
    return '<line x1="'+(cx-5*c)+'" y1="'+(cy-5*s)+'" x2="'+(cx+5*c)+'" y2="'+(cy+5*s)+'" stroke="'+stroke+'" stroke-width="2"/>';
  }
  
  if (type === 'carré') {
    svg += '<rect x="30" y="30" width="100" height="100" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
    svg += '<polyline points="30,45 45,45 45,30" fill="none" stroke="'+red+'" stroke-width="2"/>';
    svg += '<polyline points="130,45 115,45 115,30" fill="none" stroke="'+red+'" stroke-width="2"/>';
    svg += '<polyline points="130,115 115,115 115,130" fill="none" stroke="'+red+'" stroke-width="2"/>';
    svg += '<polyline points="30,115 45,115 45,130" fill="none" stroke="'+red+'" stroke-width="2"/>';
    svg += tick(80, 30, Math.PI/2); svg += tick(80, 130, Math.PI/2);
    svg += tick(30, 80, 0); svg += tick(130, 80, 0);
  } 
  else if (type === 'rectangle') {
    svg += '<rect x="10" y="40" width="140" height="80" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
    svg += '<polyline points="10,55 25,55 25,40" fill="none" stroke="'+red+'" stroke-width="2"/>';
    svg += '<polyline points="150,55 135,55 135,40" fill="none" stroke="'+red+'" stroke-width="2"/>';
    svg += '<polyline points="150,105 135,105 135,120" fill="none" stroke="'+red+'" stroke-width="2"/>';
    svg += '<polyline points="10,105 25,105 25,120" fill="none" stroke="'+red+'" stroke-width="2"/>';
    svg += tick(80, 40, Math.PI/2); svg += tick(80, 120, Math.PI/2);
    svg += tick(10, 77, 0); svg += tick(10, 83, 0);
    svg += tick(150, 77, 0); svg += tick(150, 83, 0);
  }
  else if (type === 'triangle équilatéral') {
    svg += '<polygon points="80,20 140,124 20,124" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
    svg += tick(80, 124, Math.PI/2); 
    svg += tick(110, 72, -Math.PI/6);
    svg += tick(50, 72, Math.PI/6);
  }
  else if (type === 'triangle isocèle') {
    svg += '<polygon points="80,20 120,130 40,130" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
    svg += tick(100, 75, -0.3);
    svg += tick(60, 75, 0.3);
  }
  else if (type === 'triangle rectangle') {
    svg += '<polygon points="30,130 130,130 30,30" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
    svg += '<polyline points="30,115 45,115 45,130" fill="none" stroke="'+red+'" stroke-width="2"/>';
  }
  else if (type === 'losange') {
    svg += '<polygon points="80,20 140,80 80,140 20,80" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
    svg += tick(110, 50, -Math.PI/4); svg += tick(110, 110, Math.PI/4);
    svg += tick(50, 50, Math.PI/4); svg += tick(50, 110, -Math.PI/4);
  }
  else if (type === 'cercle') {
    svg += '<circle cx="80" cy="80" r="60" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
    svg += '<circle cx="80" cy="80" r="3" fill="'+red+'" />';
  }
  else if (type === 'cube') {
    svg += '<rect x="60" y="40" width="60" height="60" fill="none" stroke="'+stroke+'" stroke-width="'+sw+'" stroke-dasharray="4,4"/>';
    svg += '<line x1="40" y1="120" x2="60" y2="100" stroke="'+stroke+'" stroke-width="'+sw+'" stroke-dasharray="4,4"/>';
    svg += '<rect x="40" y="60" width="60" height="60" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
    svg += '<line x1="40" y1="60" x2="60" y2="40" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
    svg += '<line x1="100" y1="60" x2="120" y2="40" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
    svg += '<line x1="100" y1="120" x2="120" y2="100" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
    svg += '<line x1="60" y1="40" x2="120" y2="40" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
    svg += '<line x1="120" y1="40" x2="120" y2="100" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
  }
  else if (type === 'pavé droit') {
    svg += '<rect x="50" y="50" width="80" height="50" fill="none" stroke="'+stroke+'" stroke-width="'+sw+'" stroke-dasharray="4,4"/>';
    svg += '<line x1="30" y1="120" x2="50" y2="100" stroke="'+stroke+'" stroke-width="'+sw+'" stroke-dasharray="4,4"/>';
    svg += '<rect x="30" y="70" width="80" height="50" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
    svg += '<line x1="30" y1="70" x2="50" y2="50" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
    svg += '<line x1="110" y1="70" x2="130" y2="50" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
    svg += '<line x1="110" y1="120" x2="130" y2="100" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
    svg += '<line x1="50" y1="50" x2="130" y2="50" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
    svg += '<line x1="130" y1="50" x2="130" y2="100" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
  }
  else if (type === 'cylindre') {
    svg += '<path d="M 40 120 A 40 15 0 0 1 120 120" fill="none" stroke="'+stroke+'" stroke-width="'+sw+'" stroke-dasharray="4,4"/>';
    svg += '<path d="M 40 40 L 40 120 A 40 15 0 0 0 120 120 L 120 40 Z" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
    svg += '<ellipse cx="80" cy="40" rx="40" ry="15" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
  }
  else if (type === 'cône') {
    svg += '<path d="M 40 120 A 40 15 0 0 1 120 120" fill="none" stroke="'+stroke+'" stroke-width="'+sw+'" stroke-dasharray="4,4"/>';
    svg += '<path d="M 80 20 L 40 120 A 40 15 0 0 0 120 120 Z" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
  }

  svg += '</svg>';
  return svg;
}

function genFigureID(){
  var figs=[
    {q:'4 côtés égaux, 4 angles droits. Quelle figure ?', a:'carré'},
    {q:'2 paires de côtés parallèles, 4 angles droits. Quelle figure ?', a:'rectangle'},
    {q:'3 côtés égaux. Quelle figure ?', a:'triangle équilatéral'},
    {q:'4 côtés égaux, aucun angle droit. Quelle figure ?', a:'losange'},
    {q:'Solide à base circulaire et une pointe. Quel solide ?', a:'cône'},
    {q:'Solide avec 6 faces rectangulaires. Quel solide ?', a:'pavé droit'},
    {q:'Solide avec 6 faces carrées égales. Quel solide ?', a:'cube'},
    {q:'Solide avec 2 bases circulaires parallèles et une surface latérale courbe. Quel solide ?', a:'cylindre'},
    {q:'Triangle avec un angle de 90°. Quelle figure ?', a:'triangle rectangle'},
    {q:'2 côtés égaux (mais pas tous les 3). Quelle figure ?', a:'triangle isocèle'},
    {q:'Ensemble des points situés à égale distance d\'un centre. Quelle figure ?', a:'cercle'},
  ];

  var shapes = [
    'carré', 'rectangle', 'triangle équilatéral', 'triangle isocèle', 
    'triangle rectangle', 'losange', 'cercle', 'cube', 'pavé droit', 
    'cylindre', 'cône'
  ];

  var pool = [];
  // Ajouter toutes les questions visuelles
  for (var i = 0; i < shapes.length; i++) {
    pool.push({
      isVisual: true,
      shape: shapes[i]
    });
  }
  // Ajouter toutes les questions textuelles
  for (var i = 0; i < figs.length; i++) {
    pool.push({
      isVisual: false,
      item: figs[i]
    });
  }

  // Mélanger le pool (Fisher-Yates)
  for (var i = pool.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = pool[i];
    pool[i] = pool[j];
    pool[j] = temp;
  }

  var exs=[];
  for(var i=0;i<10;i++){
    var choice = pool[i];
    var q, ans, exp;
    if (choice.isVisual) {
      var shape = choice.shape;
      q = '<div style="text-align:center;">Quel est le nom précis de la figure géométrique ci-dessous ?</div>' + genSvgFigure(shape);
      ans = shape;
      exp = 'Cette figure est un(e) ' + shape + '.';
    } else {
      var item = choice.item;
      q = item.q;
      ans = item.a;
      exp = item.a;
    }
    exs.push({question:q, answer:ans, explanation:exp, check:makeCheckStr(ans)});
  }
  return exs;
}
