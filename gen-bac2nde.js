/* AutoMaths – gen-bac2nde.js : Générateurs BAC PRO 2nde (17 automatismes) */

function genFrequency2nde(){
  var exs=[];
  for(var i=0;i<10;i++){
    var total=pick([20,25,40,50,100,200]),part=rnd(1,total-1);
    var pct=Math.round(part/total*1000)/10;
    exs.push({question:'Sur '+total+' personnes, '+part+' ont dit oui. Fréquence en % ?',
      answer:numStr(pct),explanation:part+'/'+total+'='+numStr(pct)+'%',check:makeCheckNum(pct,0.1)});
  }
  return exs;
}

function genPercentageUse(){
  var exs=[];
  for(var i=0;i<10;i++){
    var base=pick([80,100,120,150,200,250]),pct=pick([5,10,15,20,25,30,50]);
    var t=rnd(0,1),res,q;
    if(t===0){res=Math.round(base*(1+pct/100)*100)/100;q=base+' € augmenté de '+pct+' % = ?';}
    else{res=Math.round(base*(1-pct/100)*100)/100;q=base+' € réduit de '+pct+' % = ?';}
    exs.push({question:q,answer:numStr(res),explanation:numStr(res)+' €',check:makeCheckNum(res,0.01)});
  }
  return exs;
}

function genPercentageExpr(){
  var vals=[[1,4,0.25,25],[1,2,0.5,50],[3,4,0.75,75],[1,5,0.2,20],[2,5,0.4,40],[3,5,0.6,60],[1,10,0.1,10],[3,10,0.3,30],[7,10,0.7,70]];
  var exs=[];
  for(var i=0;i<10;i++){
    var v=pick(vals),t=rnd(0,1),q;
    if(t===0){q='Convertir '+numStr(v[2])+' en pourcentage.';}
    else{q='Convertir '+fr(v[0],v[1])+' en pourcentage.';}
    exs.push({question:q,answer:numStr(v[3])+'%',explanation:numStr(v[3])+'%',check:makeCheckNum(v[3],0.1)});
  }
  return exs;
}

function genMean2nde(){
  var exs=[];
  for(var i=0;i<10;i++){
    var n=rnd(3,5),vals=[],sum=0;
    for(var j=0;j<n;j++){var x=rnd(4,18);vals.push(x);sum+=x;}
    var moy=Math.round(sum/n*10)/10;
    exs.push({question:'Calculer la moyenne de : '+vals.join(' ; '),
      answer:numStr(moy),explanation:'('+vals.join('+')+') / '+n+' = '+numStr(moy),check:makeCheckNum(moy,0.1)});
  }
  return exs;
}

function genPowerOf10(){
  var exs=[];
  for(var i=0;i<10;i++){
    var a=rnd(1,5),b=rnd(1,5),t=rnd(0,2),q,ans;
    if(t===0){q='10<sup>'+a+'</sup> × 10<sup>'+b+'</sup> = 10<sup>?</sup>';ans=String(a+b);}
    else if(t===1){q='10<sup>'+(a+b)+'</sup> ÷ 10<sup>'+b+'</sup> = 10<sup>?</sup>';ans=String(a);}
    else{q='(10<sup>'+a+'</sup>)<sup>'+b+'</sup> = 10<sup>?</sup>';ans=String(a*b);}
    exs.push({question:q,answer:ans,explanation:ans,check:makeCheckNum(parseFloat(ans))});
  }
  return exs;
}

function genScientificNotation(){
  var exs=[];
  for(var i=0;i<10;i++){
    var mant=rnd(10,99)/10,exp=rnd(-3,5);
    if(exp===0) exp=pick([-1,1]);
    var t=rnd(0,2),q,ans,expStr;
    if(t===0){
      q='Écrire '+numStr(mant)+' × 10<sup>'+exp+'</sup> en forme développée.';
      ans=numStr(Math.round(mant*Math.pow(10,exp)*1e6)/1e6);
      expStr=ans;
    }else if(t===1){
      var val=Math.round(mant*Math.pow(10,exp)*1e6)/1e6;
      q='Déterminer le nombre a dans l\'écriture scientifique a × 10<sup>n</sup> de '+numStr(val)+'. a = ?';
      ans=numStr(mant);
      expStr=ans;
    }else{
      var val=Math.round(mant*Math.pow(10,exp)*1e6)/1e6;
      q='Écrire '+numStr(val)+' sous forme d\'écriture scientifique (a × 10<sup>n</sup>).';
      ans=numStr(mant)+' × 10^'+exp;
      expStr=numStr(mant)+' × 10<sup>'+exp+'</sup>';
    }
    exs.push({question:q,answer:ans,explanation:expStr,check:makeCheckStr(ans)});
  }
  return exs;
}

function genCompareFractions2nde(){
  var exs=[];
  for(var i=0;i<10;i++){
    var d1=pick([3,4,5,6,8,10]),d2=pick([3,4,5,6,8,10]);
    var n1=rnd(1,d1),n2=rnd(1,d2);
    var sym=n1/d1<n2/d2?'<':n1/d1>n2/d2?'>':'=';
    exs.push({question:fr(n1,d1)+' ___ '+fr(n2,d2)+' (< > =)',answer:sym,
      explanation:fr(n1,d1)+' '+sym+' '+fr(n2,d2),check:makeCheckStr(sym)});
  }
  return exs;
}

function genFractionOps2nde(){
  return dedupe(function(){
    var exs=[];
    var denoms=[2,3,4,5,6,7,8,9,10,12,15];
    for(var i=0;i<10;i++){
      var d1=pick(denoms),d2=pick(denoms);
      var n1=rnd(1,d1-1),n2=rnd(1,d2-1),t=rnd(0,2),num,den,q;
      if(t===0){num=n1*d2+n2*d1;den=d1*d2;q=n1+'/'+d1+' + '+n2+'/'+d2+' = ?';}
      else if(t===1){
        if(n1/d1<n2/d2){var tmp=n1;n1=n2;n2=tmp;tmp=d1;d1=d2;d2=tmp;}
        num=Math.abs(n1*d2-n2*d1);den=d1*d2;q=n1+'/'+d1+' − '+n2+'/'+d2+' = ?';
      }
      else{num=n1*n2;den=d1*d2;q=n1+'/'+d1+' × '+n2+'/'+d2+' = ?';}
      var g=gcd(Math.abs(num),den);var ans=fr(Math.round(num/g),Math.round(den/g));
      exs.push({question:q,answer:ans,explanation:q.replace('= ?','= ')+ans,check:makeCheckStr(ans)});
    }
    return exs;
  });
}

function genAlgebraOps2nde(){
  var exs=[];
  for(var i=0;i<10;i++){
    var a=rnd(1,5),b=rnd(1,8),t=rnd(0,1),q,ans;
    if(t===0){q='Développer : '+a+'(x + '+b+')';ans=a+'x + '+(a*b);}
    else{var c=a+rnd(1,3),s=rnd(1,c-1)||1;q='Réduire : '+a+'x + '+c+'x − '+s+'x';ans=(a+c-s)+'x';}
    exs.push({question:q,answer:ans,explanation:ans,check:makeCheckStr(ans)});
  }
  return exs;
}

function genFormulaTransform2nde(){
  var fmls=[
    {q:'U = R × I. U={u}, I={i}. R = ?',v:function(){var r=rnd(2,20),i=rnd(1,10);return{u:r*i,i:i,ans:String(r)};}},
    {q:'P = U × I. P={p}, U={u}. I = ?',v:function(){var u=rnd(2,12),i=rnd(1,8);return{p:u*i,u:u,ans:String(i)};}},
    {q:'v = d ÷ t. d={d}, t={t}. v = ?',v:function(){var t=rnd(1,5),vv=rnd(2,10);return{d:t*vv,t:t,ans:String(vv)};}},
  ];
  var exs=[];
  for(var i=0;i<10;i++){
    var f=pick(fmls),vv=f.v(),q=f.q;
    for(var k in vv){if(k!=='ans')q=q.replace('{'+k+'}',vv[k]);}
    var ans=vv.ans;
    exs.push({question:q,answer:ans,explanation:'Réponse : '+ans,check:makeCheckNum(parseFloat(ans))});
  }
  return exs;
}

function genEquation2nde(){
  var exs=[];
  for(var i=0;i<10;i++){
    var t=rnd(0,1),a,x,b,c,q;
    if(t===0){a=rnd(2,10);x=rnd(-8,8)||1;b=a*x;q=a+'x = '+b+' ; x = ?';}
    else{a=rnd(1,20);x=rnd(-10,10);b=a+x;q=a+' + x = '+b+' ; x = ?';}
    exs.push({question:q,answer:String(x),explanation:'x = '+x,check:makeCheckNum(x)});
  }
  return exs;
}

function genReperage2nde(){
  var exs=[];
  for(var i=0;i<10;i++){
    var x=rnd(-6,6)||1,y=rnd(-6,6)||1,t=rnd(0,1),q,ans;
    if(t===0){q='Point A('+x+' ; '+y+'). Abscisse = ?';ans=String(x);}
    else{q='Point A('+x+' ; '+y+'). Ordonnée = ?';ans=String(y);}
    exs.push({question:q,answer:ans,explanation:ans,check:makeCheckNum(parseFloat(ans))});
  }
  return exs;
}

function genFuncImageAnt(){
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
    
    for(var j=0; j<5; j++) {
      pts.push({ x: xValues[j], y: yValues[j] });
    }
    
    // On suppose que genSvgFunctionGraph est accessible globalement (défini dans gen-cap-c2.js)
    var svg = (typeof genSvgFunctionGraph === 'function') ? genSvgFunctionGraph(pts) : '';
    
    // Choisir une question au hasard (Image ou Antécédent)
    var targetIdx = rnd(0, 4);
    var targetPoint = pts[targetIdx];
    var isImage = rnd(0, 1) === 0;
    
    var q, ans, exp;
    if (isImage) {
      q = '<div style="text-align:center;">En lisant la courbe ci-dessous, quelle est <b>l\'image</b> de ' + targetPoint.x + ' ?</div>' + svg;
      ans = String(targetPoint.y);
      exp = 'Le point d\'abscisse ' + targetPoint.x + ' a pour ordonnée ' + targetPoint.y + ' donc l\'image est ' + targetPoint.y + '.';
    } else {
      q = '<div style="text-align:center;">En lisant la courbe ci-dessous, quel est <b>l\'antécédent</b> de ' + targetPoint.y + ' ?</div>' + svg;
      ans = String(targetPoint.x);
      exp = 'Le point d\'ordonnée ' + targetPoint.y + ' a pour abscisse ' + targetPoint.x + ' donc l\'antécédent est ' + targetPoint.x + '.';
    }
    
    exs.push({question:q, answer:ans, explanation:exp, check:makeCheckNum(parseFloat(ans))});
  }
  return exs;
}

function genGraphEquation2nde(){
  var exs=[];
  for(var i=0;i<10;i++){
    var pts = [];
    var xValues = [];
    var yValues = [];
    while(xValues.length < 5) {
      var rx = rnd(-9, 9);
      if(xValues.indexOf(rx) === -1) xValues.push(rx);
    }
    xValues.sort(function(a,b){return a-b;});
    
    while(yValues.length < 5) {
      var ry = rnd(-9, 9);
      if(yValues.indexOf(ry) === -1) yValues.push(ry);
    }
    for(var j=0; j<5; j++) { pts.push({ x: xValues[j], y: yValues[j] }); }
    
    var svg = genSvgFunctionGraph(pts);
    var targetIdx = rnd(0, 4);
    var targetPoint = pts[targetIdx];
    var k = targetPoint.y;
    var x = targetPoint.x;
    
    var q = '<div style="text-align:center;">En utilisant la représentation graphique de la fonction <b>f</b> ci-dessous, <br><b>Résoudre l\'équation f(x) = ' + k + '</b></div>' + svg;
    var ans = String(x);
    var exp = 'La courbe passe par le point de coordonnées (' + x + ' ; ' + k + '), donc la solution est x = ' + x + '.';
    
    exs.push({question:q, answer:ans, explanation:exp, check:makeCheckNum(x)});
  }
  return exs;
}

function genPythagore(){
  var trips=[[3,4,5],[5,12,13],[8,15,17],[9,12,15],[6,8,10]];
  var exs=[];
  for(var i=0;i<10;i++){
    var t=pick(trips),k=rnd(1,3);
    var a=t[0]*k,b=t[1]*k,c=t[2]*k,tp=rnd(0,2),q,ans;
    
    var isVisual = rnd(0, 1) === 0;
    
    if(tp===0){ 
      ans=String(c);
      if (isVisual) {
        q = '<div style="text-align:center;">D\'après le théorème de Pythagore, trouve la longueur manquante (?) :</div>' + genSvgPythagoras(a, b, c, 'c');
      } else {
        q = 'Les côtés de l\'angle droit valent '+a+' et '+b+'. L\'hypoténuse = ?';
      }
    }
    else if(tp===1){ 
      ans=String(b);
      if (isVisual) {
        q = '<div style="text-align:center;">D\'après le théorème de Pythagore, trouve la longueur manquante (?) :</div>' + genSvgPythagoras(a, b, c, 'b');
      } else {
        q = 'L\'hypoténuse vaut '+c+', un côté de l\'angle droit vaut '+a+'. L\'autre côté = ?';
      }
    }
    else{ 
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

function genUnitResult(){
  var items=[
    {q:'Distance Paris-Lyon ≈ 400 ___',a:'km'},
    {q:'Hauteur d\'une porte ≈ 200 ___',a:'cm'},
    {q:'Masse d\'un stylo ≈ 10 ___',a:'g'},
    {q:'Contenance d\'une bouteille ≈ 0,5 ___',a:'L'},
    {q:'Vitesse autoroute ≈ 130 ___',a:'km/h'},
    {q:'Surface d\'une pièce ≈ 20 ___',a:'m²'},
  ];
  var exs=[];
  for(var i=0;i<10;i++){
    var item=pick(items);
    exs.push({question:item.q,answer:item.a,explanation:item.a,check:makeCheckStr(item.a)});
  }
  return exs;
}

function genAreaCalc2nde(){
  var exs=[];
  for(var i=0;i<10;i++){
    var t=rnd(0,3),q,res;
    if(t===0){var c=rnd(2,12);res=c*c;q='Aire d\'un carré (c = '+c+' cm) = ?';}
    else if(t===1){var l=rnd(3,12),w=rnd(2,8);res=l*w;q='Aire d\'un rectangle (L = '+l+' cm ; l = '+w+' cm) = ?';}
    else if(t===2){var r=rnd(2,8);res=Math.round(Math.PI*r*r*10)/10;q='Aire d\'un disque (R = '+r+' cm) ≈ ?';}
    else{var bv=rnd(3,12),h=rnd(2,10);res=bv*h/2;q='Aire d\'un triangle (b = '+bv+' cm ; h = '+h+' cm) = ?';}
    exs.push({question:q,answer:numStr(res)+' cm²',explanation:numStr(res)+' cm²',check:makeCheckNum(res,0.5)});
  }
  return exs;
}

/* ── b2-12 : Quatrième proportionnelle ───────────────────────── */
function genFourthProp2nde(){
  var exs=[];
  for(var i=0;i<10;i++){
    var k=rnd(2,8),a=rnd(2,8),b=rnd(2,8),t=rnd(0,2),q,ans;
    if(t===0){
      var c=a*k; ans=String(b*k);
      q=a+' est à '+b+' ce que '+c+' est à ?';
    }else if(t===1){
      var x1=rnd(2,6),x2=rnd(2,6),y1=x1*k,y2=x2*k;
      ans=String(y2);
      q='Tableau proportionnel : '+x1+' → '+y1+' ; '+x2+' → ?';
    }else{
      var unit=pick(['km','€','kg','L']),d1=rnd(2,8),d2=rnd(1,5),r1=d1*k;
      ans=String(d2*k);
      q='Si '+d1+' '+unit+' coûtent '+r1+' €, combien coûtent '+d2+' '+unit+' ?';
    }
    exs.push({question:q,answer:ans,explanation:'Règle de trois → '+ans,check:makeCheckStr(ans)});
  }
  return exs;
}

/* ── b2-13 : Application d'une échelle ───────────────────────── */
function genScale2nde(){
  var scales=[{e:'1/100',f:100},{e:'1/1000',f:1000},{e:'1/50',f:50},{e:'1/200',f:200}];
  var exs=[];
  for(var i=0;i<10;i++){
    var sc=pick(scales),t=rnd(0,1),q,ans;
    if(t===0){
      var planMes=rnd(2,15),reel=planMes*sc.f;
      ans=String(reel)+' cm';
      q='Échelle '+sc.e+'. Mesure sur plan : '+planMes+' cm. Mesure réelle = ?';
    }else{
      var reelMes=rnd(1,8)*sc.f;
      ans=numStr(reelMes/sc.f)+' cm';
      q='Échelle '+sc.e+'. Mesure réelle : '+reelMes+' cm. Mesure sur plan = ?';
    }
    exs.push({question:q,answer:ans,explanation:'→ '+ans,check:makeCheckStr(ans)});
  }
  return exs;
}

/* ── b2-17 : Conversions d'unités ────────────────────────────── */
function genUnitConversion2nde(){
  var convs=[
    {q:'3 km = ? m',a:'3000',exp:'×1000'},
    {q:'250 cm = ? m',a:'2,5',exp:'÷100'},
    {q:'0,45 m = ? cm',a:'45',exp:'×100'},
    {q:'1,2 km = ? m',a:'1200',exp:'×1000'},
    {q:'5000 mm = ? m',a:'5',exp:'÷1000'},
    {q:'2 m² = ? cm²',a:'20000',exp:'×10000'},
    {q:'50000 cm² = ? m²',a:'5',exp:'÷10000'},
    {q:'5 L = ? mL',a:'5000',exp:'×1000'},
    {q:'2500 mL = ? L',a:'2,5',exp:'÷1000'},
    {q:'0,3 m³ = ? L',a:'300',exp:'×1000'},
    {q:'4 dm³ = ? L',a:'4',exp:'1 dm³ = 1 L'},
    {q:'1,5 m = ? mm',a:'1500',exp:'×1000'},
  ];
  var exs=[];
  for(var i=0;i<10;i++){
    var c=pick(convs);
    exs.push({question:c.q,answer:c.a,explanation:c.exp+' → '+c.a,check:makeCheckStr(c.a)});
  }
  return exs;
}

/* ── b2-19 : Arrondi et valeur approchée ─────────────────────── */
function genRounding2nde(){
  var exs=[];
  for(var i=0;i<10;i++){
    var t=rnd(0,2),q,ans;
    if(t===0){
      var n=rnd(10,99)+Math.round(Math.random()*9)/10;
      ans=String(Math.round(n));
      q='Arrondir '+numStr(n)+' à l\'unité.';
      exs.push({question:q,answer:ans,explanation:'→ '+ans,check:makeCheckStr(ans)});
    }else if(t===1){
      var base=rnd(5,50),dec=Math.round(Math.random()*99+1);
      var full=parseFloat(base+'.'+dec);
      var r2=Math.round(full*10)/10;
      ans=numStr(r2);
      q='Arrondir '+numStr(full)+' au dixième.';
      exs.push({question:q,answer:ans,explanation:'→ '+ans,check:makeCheckStr(ans)});
    }else{
      var base2=rnd(2,9),frac=Math.round(Math.random()*89+11);
      var full2=parseFloat(base2+'.'+frac);
      var parDef=Math.floor(full2*10)/10;
      var parExc=Math.ceil(full2*10)/10;
      var byDef=rnd(0,1)===0;
      ans=numStr(byDef?parDef:parExc);
      q='Valeur approchée par '+(byDef?'défaut':'excès')+' au dixième de '+numStr(full2)+'.';
      exs.push({question:q,answer:ans,explanation:'→ '+ans,check:makeCheckStr(ans)});
    }
  }
  return exs;
}

/* ── b2-22 : Cohérence grandeur-unité ────────────────────────── */
function genUnitCoherence2nde(){
  var items=[
    {q:'Une personne mesure environ 1,70 ___',a:'m',choices:['m','km','cm']},
    {q:'Un stylo mesure environ 15 ___',a:'cm',choices:['m','cm','mm']},
    {q:'Un verre d\'eau contient environ 250 ___',a:'mL',choices:['L','mL','m³']},
    {q:'Un sac de courses pèse environ 5 ___',a:'kg',choices:['g','kg','t']},
    {q:'Un terrain de foot mesure environ 7 000 ___',a:'m²',choices:['cm²','m²','km²']},
    {q:'Un comprimé pèse environ 500 ___',a:'mg',choices:['g','mg','kg']},
    {q:'La distance Paris–Lyon est d\'environ 460 ___',a:'km',choices:['m','cm','km']},
    {q:'Un cube de sucre pèse environ 4 ___',a:'g',choices:['mg','g','kg']},
    {q:'Une piscine olympique contient environ 2 500 ___',a:'m³',choices:['L','dm³','m³']},
    {q:'La vitesse d\'un cycliste est d\'environ 20 ___',a:'km/h',choices:['m/s','km/h','m/min']},
    {q:'L\'épaisseur d\'un cheveu est d\'environ 0,07 ___',a:'mm',choices:['cm','mm','µm']},
    {q:'La surface de la France est d\'environ 550 000 ___',a:'km²',choices:['m²','km²','ha']},
  ];
  var exs=[];
  for(var i=0;i<10;i++){
    var item=pick(items);
    exs.push({question:item.q,answer:item.a,choices:item.choices,explanation:'L\'unité adaptée est '+item.a+'.',check:makeCheckStr(item.a)});
  }
  return exs;
}

/* ── b2-23 : Thalès ──────────────────────────────────────────── */
function genThales2nde(){
  var exs=[];
  for(var i=0;i<10;i++){
    var k=rnd(2,4),t=rnd(0,2),q,ans;
    if(t===0){
      var ab=rnd(4,10),ac=rnd(3,8),ad=ab*k;
      ans=String(ac*k);
      q='Droites parallèles (Thalès) : AB='+ab+', AD='+ad+', AC='+ac+'. Calculer AE.';
    }else if(t===1){
      var ab2=rnd(3,8),ac2=rnd(3,8),ad2=ab2*k,ae2=ac2*k;
      ans='oui';
      q='AB='+ab2+', AD='+ad2+', AC='+ac2+', AE='+ae2+'. BC ∥ DE ? (oui/non)';
    }else{
      var am=rnd(2,6),ab3=am*k;
      var r=Math.round(am/ab3*100)/100;
      ans=numStr(r);
      q='AM='+am+', AB='+ab3+'. Calculer le rapport AM/AB.';
    }
    exs.push({question:q,answer:ans,explanation:'Thalès → '+ans,check:makeCheckStr(ans)});
  }
  return exs;
}

console.log('[AutoMaths] gen-bac2nde.js OK');
