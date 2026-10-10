/* AutoMaths – gen-cap-c1.js : Générateurs CAP C1 (16 automatismes)
   Utilitaires partagés + helpers makeCheck* pour closures correctes */

/* ── Utilitaires ─────────────────────────────────────────────── */
function rnd(a,b){return Math.floor(Math.random()*(b-a+1))+a;}
function pick(arr){return arr[rnd(0,arr.length-1)];}
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){var t=b;b=a%b;a=t;}return a;}
function fr(n,d){if(d===0)return String(n);var g=gcd(Math.abs(n),Math.abs(d));return (Math.round(n/g))+'/'+(Math.round(d/g));}
function numStr(x){return String(x).replace('.',',');}

function checkNum(val,expected,tol){
  tol=tol!==undefined?tol:0.01;
  var v=parseFloat(String(val).replace(',','.'));
  return !isNaN(v)&&Math.abs(v-expected)<=tol;
}
function checkStr(val,expected){
  function norm(s){
    return String(s).trim()
      .replace(/\u2212/g,'-')   // − unicode MINUS → ASCII
      .replace(/\u00a0/g,' ')   // espace insécable
      .toLowerCase().replace(/\s/g,'');
  }
  return norm(val)===norm(expected);
}

/* Helpers closures — capturent la valeur au moment de l'appel */
function makeCheckNum(exp,tol){return function(v){return checkNum(v,exp,tol!==undefined?tol:0.01);};}
function makeCheckStr(exp){return function(v){return checkStr(v,exp);};}

/* Anti-doublons : garantit 10 exercices uniques (par question) */
function dedupe(genFn, maxAttempts) {
  maxAttempts = maxAttempts || 200;
  var seen = {}, result = [], attempts = 0;
  while (result.length < 10 && attempts < maxAttempts) {
    var batch = genFn();
    for (var i = 0; i < batch.length && result.length < 10; i++) {
      var key = batch[i].question;
      if (!seen[key]) { seen[key] = true; result.push(batch[i]); }
    }
    attempts++;
  }
  return result;
}
function makeCheckNumOrStr(exp){return function(v){return checkNum(v,parseFloat(String(exp).replace(',','.')),0.01)||checkStr(v,exp);};}

/* ── c1-1 : Multiplication par 10, 100, 0,1, 0,01 ─────────── */
function genMultiplyPower(){
  var exs=[];
  var mult=[10,100,1000,0.1,0.01];
  for(var i=0;i<10;i++){
    var a=rnd(1,999)/10, m=pick(mult);
    var res=Math.round(a*m*10000)/10000;
    exs.push({question:numStr(a)+' × '+numStr(m)+' = ?',answer:numStr(res),
      explanation:numStr(a)+' × '+numStr(m)+' = '+numStr(res),check:makeCheckNum(res,0.0001)});
  }
  return exs;
}

/* ── c1-2 : Calcul mental (3 niveaux) ──────────────────────── */

/* Débutant : sans retenue, tables simples */
function genMentalEasy(){
  return dedupe(function(){
    var exs=[];
    for(var i=0;i<10;i++){
      var t=rnd(0,2),a,b,res,q;
      if(t===0){
        /* Addition sans retenue : unités + unités < 10, dizaines + dizaines < 10 */
        var u1=rnd(1,4),u2=rnd(1,9-u1-1),d1=rnd(1,4),d2=rnd(1,9-d1-1);
        a=d1*10+u1; b=d2*10+u2; res=a+b; q=a+' + '+b+' = ?';
      } else if(t===1){
        /* Soustraction sans retenue : chiffre a >= chiffre b à chaque rang */
        var du1=rnd(3,9),du2=rnd(1,du1-1),dd1=rnd(2,9),dd2=rnd(1,dd1-1);
        a=dd1*10+du1; b=dd2*10+du2; res=a-b; q=a+' − '+b+' = ?';
      } else {
        /* Tables de 2 à 5 */
        a=rnd(2,5); b=rnd(2,9); res=a*b; q=a+' × '+b+' = ?';
      }
      exs.push({question:q,answer:String(res),explanation:q.replace('= ?','= '+res),check:makeCheckNum(res)});
    }
    return exs;
  });
}

/* Intermédiaire : avec retenues, tables complètes */
function genMentalMedium(){
  return dedupe(function(){
    var exs=[];
    for(var i=0;i<10;i++){
      var t=rnd(0,2),a,b,res,q;
      if(t===0){
        /* Addition avec retenue obligatoire */
        var u1=rnd(5,9),u2=rnd(10-u1,9);
        a=rnd(1,8)*10+u1; b=rnd(1,8)*10+u2; res=a+b; q=a+' + '+b+' = ?';
      } else if(t===1){
        /* Soustraction avec retenue obligatoire (unité de a < unité de b) */
        var su1=rnd(0,4),su2=rnd(su1+1,9);
        a=rnd(3,9)*10+su1; b=rnd(1,Math.floor(a/10)-1)*10+su2;
        if(a<=b){a=rnd(50,99);b=rnd(10,a-1);}
        res=a-b; q=a+' − '+b+' = ?';
      } else {
        /* Tables complètes 2-12 */
        a=rnd(2,12); b=rnd(2,12); res=a*b; q=a+' × '+b+' = ?';
      }
      exs.push({question:q,answer:String(res),explanation:q.replace('= ?','= '+res),check:makeCheckNum(res)});
    }
    return exs;
  });
}

/* Expert : grands nombres, divisions, opérations combinées */
function genMentalExpert(){
  return dedupe(function(){
    var exs=[];
    for(var i=0;i<10;i++){
      var t=rnd(0,3),a,b,res,q;
      if(t===0){
        /* Addition à 3 chiffres */
        a=rnd(100,499); b=rnd(100,499); res=a+b; q=a+' + '+b+' = ?';
      } else if(t===1){
        /* Soustraction à 3 chiffres avec retenue */
        a=rnd(200,999); b=rnd(100,a-1); res=a-b; q=a+' − '+b+' = ?';
      } else if(t===2){
        /* Multiplications difficiles (2 chiffres × 1 chiffre) */
        a=rnd(12,50); b=rnd(3,9); res=a*b; q=a+' × '+b+' = ?';
      } else {
        /* Divisions exactes */
        b=rnd(2,12); res=rnd(3,15); a=b*res; q=a+' ÷ '+b+' = ?';
      }
      exs.push({question:q,answer:String(res),explanation:q.replace('= ?','= '+res),check:makeCheckNum(res)});
    }
    return exs;
  });
}

/* Compatibilité : l'ancien nom redirige vers le niveau intermédiaire */
function genMentalArithmetic(){ return genMentalMedium(); }

/* ── c1-3 : Règles des signes ───────────────────────────────── */
function genSignRule(){
  var exs=[];
  for(var i=0;i<10;i++){
    var a=(rnd(0,1)?1:-1)*rnd(1,12),b=(rnd(0,1)?1:-1)*rnd(1,12);
    var t=rnd(0,1),res,q;
    if(t===0){res=a*b;q='('+a+') × ('+b+') = ?';}
    else{if(b===0)b=1;a=b*rnd(1,6)*(rnd(0,1)?1:-1);res=a/b;q='('+a+') ÷ ('+b+') = ?';}
    if(!Number.isInteger(res)){a=b*rnd(1,6)*(rnd(0,1)?1:-1);res=a/b;}
    exs.push({question:q,answer:String(res),explanation:q.replace('= ?','= '+res),check:makeCheckNum(res)});
  }
  return exs;
}

/* ── c1-4a : Fractions – Niveau 1 (même dénominateur) ─────── */
/* Additions et soustractions uniquement avec le MÊME dénominateur */
function genFractionEasyC1(){
  return dedupe(function(){
    var exs=[];
    var denoms=[2,3,4,5,6,8,10];
    for(var i=0;i<10;i++){
      var d=pick(denoms);
      var t=rnd(0,1),n1,n2,num,den,q;
      if(t===0){
        /* Addition même dénominateur */
        n1=rnd(1,d-1); n2=rnd(1,d-n1); /* on évite que n1+n2 > d pour rester < 1 si possible */
        if(n1+n2>=d){ n2=rnd(1,d-1); } /* sinon on accepte > 1 */
        num=n1+n2; den=d;
        q=n1+'/'+d+' + '+n2+'/'+d+' = ?';
      } else {
        /* Soustraction même dénominateur (résultat > 0) */
        n1=rnd(2,d-1); n2=rnd(1,n1-1);
        num=n1-n2; den=d;
        q=n1+'/'+d+' − '+n2+'/'+d+' = ?';
      }
      var g=gcd(Math.abs(num),Math.abs(den));
      var ansNum=Math.round(num/g), ansDen=Math.round(den/g);
      var ans = (ansDen===1) ? String(ansNum) : fr(ansNum,ansDen);
      exs.push({question:q,answer:ans,explanation:q.replace('= ?','= ')+ans,check:makeCheckStr(ans)});
    }
    return exs;
  });
}

/* ── c1-4b : Fractions – Niveau 2 (dénominateurs différents) ── */
/* Additions, soustractions et multiplications avec dénominateurs DIFFÉRENTS */
function genFractionMediumC1(){
  return dedupe(function(){
    var exs=[];
    var denoms=[2,3,4,5,6,10];
    for(var i=0;i<10;i++){
      var d1=pick(denoms),d2;
      /* S'assurer d2 ≠ d1 */
      do{ d2=pick(denoms); } while(d2===d1);
      var n1=rnd(1,d1-1), n2=rnd(1,d2-1);
      var t=rnd(0,2),num,den,q;
      if(t===0){
        /* Addition dénominateurs différents */
        num=n1*d2+n2*d1; den=d1*d2;
        q=n1+'/'+d1+' + '+n2+'/'+d2+' = ?';
      } else if(t===1){
        /* Soustraction (on s'assure que n1/d1 > n2/d2) */
        if(n1*d2 <= n2*d1){ var tmp=n1;n1=n2;n2=tmp; tmp=d1;d1=d2;d2=tmp; }
        num=n1*d2-n2*d1; den=d1*d2;
        q=n1+'/'+d1+' − '+n2+'/'+d2+' = ?';
      } else {
        /* Multiplication */
        num=n1*n2; den=d1*d2;
        q=n1+'/'+d1+' × '+n2+'/'+d2+' = ?';
      }
      var g=gcd(Math.abs(num),Math.abs(den));
      var ansNum=Math.round(num/g), ansDen=Math.round(den/g);
      var ans = (ansDen===1) ? String(ansNum) : fr(ansNum,ansDen);
      exs.push({question:q,answer:ans,explanation:q.replace('= ?','= ')+ans,check:makeCheckStr(ans)});
    }
    return exs;
  });
}

/* ── c1-5 : Proportion ──────────────────────────────────────── */
function genProportionForms(){
  var exs=[];
  var fs=[[1,4,0.25,25],[1,2,0.5,50],[3,4,0.75,75],[1,5,0.2,20],[2,5,0.4,40],[3,5,0.6,60],[4,5,0.8,80],[1,10,0.1,10],[3,10,0.3,30],[7,10,0.7,70]];
  for(var i=0;i<10;i++){
    var f=pick(fs),t=rnd(0,2),q,ans,v;
    if(t===0){q=fr(f[0],f[1])+' = ? %';ans=numStr(f[3]);v=f[3];}
    else if(t===1){q=numStr(f[2])+' = ? %';ans=numStr(f[3]);v=f[3];}
    else{q=numStr(f[3])+' % = ? (décimal)';ans=numStr(f[2]);v=f[2];}
    exs.push({question:q,answer:ans,explanation:fr(f[0],f[1])+'='+numStr(f[2])+'='+numStr(f[3])+'%',check:makeCheckNum(v,0.01)});
  }
  return exs;
}

/* ── c1-6 : Fraction → décimale ────────────────────────────── */
function genFracToDecimal(){
  var exs=[];
  for(var i=0;i<10;i++){
    var d=pick([2,4,5,8,10,20,25]),n=rnd(1,3*d);
    var res=Math.round(n/d*10000)/10000;
    var ans=numStr(res);
    exs.push({question:n+'/'+d+' = ?',answer:ans,explanation:n+'/'+d+' = '+ans,check:makeCheckNum(res,0.0001)});
  }
  return exs;
}

/* ── c1-7 : Comparaison décimaux ────────────────────────────── */
function genCompareDecimals(){
  var exs=[];
  for(var i=0;i<10;i++){
    var b=rnd(1,9);
    var d1=Math.round((b+rnd(0,99)/100)*100)/100;
    var d2=Math.round((b+rnd(0,99)/100)*100)/100;
    var sym=d1<d2?'<':d1>d2?'>':'=';
    exs.push({question:numStr(d1)+' ___ '+numStr(d2)+' (< > =)',answer:sym,
      explanation:numStr(d1)+' '+sym+' '+numStr(d2),check:makeCheckStr(sym)});
  }
  return exs;
}

/* ── c1-8 : Comparaison fractions ──────────────────────────── */
function genCompareRationals(){
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

/* ── c1-9 : Transformation de formules ─────────────────────── */
function genFormulaTransform(){
  var exs=[];
  var fmls=[
    {q:'P = L × ℓ. P={p}, ℓ={l}. L = ?',v:function(){var L=rnd(2,10),l=rnd(2,10);return{p:L*l,l:l,ans:String(L)};}},
    {q:'d = v × t. d={d}, v={v}. t = ?',v:function(){var v=rnd(2,10),t=rnd(1,8);return{d:v*t,v:v,ans:String(t)};}},
    {q:'I = U ÷ R. I={i}, R={r}. U = ?',v:function(){var r=rnd(2,10),i=rnd(1,8);return{i:i,r:r,ans:String(i*r)};}},
  ];
  for(var i=0;i<10;i++){
    var f=pick(fmls),vv=f.v(),q2=f.q;
    for(var k in vv){if(k!=='ans')q2=q2.replace('{'+k+'}',vv[k]);}
    var ans=vv.ans;
    exs.push({question:q2,answer:ans,explanation:'Réponse : '+ans,check:makeCheckNum(parseFloat(ans))});
  }
  return exs;
}

/* ── c1-10 : Équations simples ──────────────────────────────── */
function genSimpleEquation(){
  var exs=[];
  for(var i=0;i<10;i++){
    var t=rnd(0,1),a,x,b,q;
    if(t===0){a=rnd(2,12);x=rnd(1,10);b=a*x;q=a+'x = '+b+' ; x = ?';}
    else{a=rnd(1,20);x=rnd(1,15);b=a+x;q=a+' + x = '+b+' ; x = ?';}
    exs.push({question:q,answer:String(x),explanation:'x = '+x,check:makeCheckNum(x)});
  }
  return exs;
}

/* ── c1-11 : Arrondi ────────────────────────────────────────── */
function genRounding(){
  var exs=[];
  var prec=[{n:'dixième',pre:'au',g:'le',f:10},{n:'centième',pre:'au',g:'le',f:100},{n:'unité',pre:"à l'",g:'la',f:1}];
  for(var i=0;i<10;i++){
    var p=pick(prec);
    var val=Math.round((rnd(10,999)/100+rnd(0,9)/1000)*1000)/1000;
    var res=Math.round(val*p.f)/p.f;
    exs.push({question:'Arrondir '+numStr(val)+' '+p.pre+p.n+' '+p.g+' plus proche',
      answer:numStr(res),explanation:'≈ '+numStr(res),check:makeCheckNum(res,0.001)});
  }
  return exs;
}

/* ── c1-12 : Conversions durées ─────────────────────────────── */
function genTimeConversion(){
  var exs=[];
  for(var i=0;i<10;i++){
    var t=rnd(0,1),q,ans;
    if(t===0){var h=rnd(1,5),m=rnd(0,59);ans=String(h*60+m);q=h+'h '+m+'min = ? min';}
    else{var mn=rnd(61,300);var hh=Math.floor(mn/60),mm=mn%60;ans=hh+'h'+mm;q=mn+' min = ? (ex: 1h35)';}
    exs.push({question:q,answer:ans,explanation:ans,check:makeCheckNumOrStr(ans)});
  }
  return exs;
}

/* ── c1-13 : Carré et racine carrée ─────────────────────────── */
function genSquareRoot(){
  var exs=[];
  var sq=[1,4,9,16,25,36,49,64,81,100,121,144,169,196,225];
  for(var i=0;i<10;i++){
    var t=rnd(0,1),q,ans,res;
    if(t===0){var n=rnd(2,15);res=n*n;ans=String(res);q=n+'² = ?';}
    else{var s=pick(sq);res=Math.round(Math.sqrt(s));ans=String(res);q='√'+s+' = ?';}
    exs.push({question:q,answer:ans,explanation:q.replace('= ?','= ')+ans,check:makeCheckNum(res)});
  }
  return exs;
}

/* ── c1-14 : Conversions d'unités ───────────────────────────── */
function genUnitConversionAll(){
  var exs=[];
  var cvs=[
    {q:'{n} km = ? m',f:function(n){return n*1000;}},
    {q:'{n} m = ? cm',f:function(n){return n*100;}},
    {q:'{n} cm = ? mm',f:function(n){return n*10;}},
    {q:'{n} kg = ? g',f:function(n){return n*1000;}},
    {q:'{n} L = ? mL',f:function(n){return n*1000;}},
    {q:'{n} m³ = ? L',f:function(n){return n*1000;}},
  ];
  for(var i=0;i<10;i++){
    var c=pick(cvs),n=rnd(1,20),res=c.f(n);
    var q=c.q.replace('{n}',String(n));
    exs.push({question:q,answer:numStr(res),explanation:numStr(res),check:makeCheckNum(res)});
  }
  return exs;
}

/* ── Utilitaires SVG Géométrie ─────────────────────────────── */
function genSvgGrid() {
  var size = 400, cell = 20;
  var svg = '<svg width="100%" height="auto" viewBox="0 0 '+size+' '+size+'" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border:1px solid #cbd5e1; display:block; margin: 0.5rem auto; border-radius:4px; max-width:300px;">';
  for(var i=0; i<=size; i+=cell) {
    svg += '<line x1="'+i+'" y1="0" x2="'+i+'" y2="'+size+'" stroke="#e2e8f0" stroke-width="1" />';
    svg += '<line x1="0" y1="'+i+'" x2="'+size+'" y2="'+i+'" stroke="#e2e8f0" stroke-width="1" />';
  }
  return svg;
}

/* ── c1-15 : Distance point-droite ──────────────────────────── */
function genDistPointLine(){
  var exs=[];
  for(var i=0; i<10; i++){
    var isHoriz = rnd(0,1) === 0;
    var d = rnd(3, 14); // distance en carreaux plus grande (grille 20x20)
    var lPos = rnd(1, 19); // position de la droite n'importe où entre 1 et 19
    
    // On s'assure que pPos1 reste dans les limites du quadrillage (1 à 19)
    var pPos1;
    if (lPos - d >= 1 && lPos + d <= 19) {
      pPos1 = lPos + (rnd(0,1)===0 ? d : -d);
    } else if (lPos + d <= 19) {
      pPos1 = lPos + d;
    } else if (lPos - d >= 1) {
      pPos1 = lPos - d;
    } else {
      // Sécurité si ça déborde (très rare avec 1..19 et 3..14)
      lPos = rnd(1, 19 - d);
      pPos1 = lPos + d;
    }
    
    var pPos2 = rnd(1, 19); // l'autre coordonnée
    
    var svg = genSvgGrid();
    if (isHoriz) {
      svg += '<line x1="0" y1="'+(lPos*20)+'" x2="400" y2="'+(lPos*20)+'" stroke="#ef4444" stroke-width="3" />';
      svg += '<text x="5" y="'+(lPos*20 - 5)+'" fill="#ef4444" font-weight="bold" font-family="sans-serif" font-size="14">(D)</text>';
      svg += '<circle cx="'+(pPos2*20)+'" cy="'+(pPos1*20)+'" r="6" fill="#3b82f6" />';
      svg += '<text x="'+(pPos2*20 + 8)+'" y="'+(pPos1*20 - 8)+'" fill="#3b82f6" font-weight="bold" font-family="sans-serif" font-size="14">P</text>';
    } else {
      svg += '<line x1="'+(lPos*20)+'" y1="0" x2="'+(lPos*20)+'" y2="400" stroke="#ef4444" stroke-width="3" />';
      svg += '<text x="'+(lPos*20 + 5)+'" y="15" fill="#ef4444" font-weight="bold" font-family="sans-serif" font-size="14">(D)</text>';
      svg += '<circle cx="'+(pPos1*20)+'" cy="'+(pPos2*20)+'" r="6" fill="#3b82f6" />';
      svg += '<text x="'+(pPos1*20 + 8)+'" y="'+(pPos2*20 - 8)+'" fill="#3b82f6" font-weight="bold" font-family="sans-serif" font-size="14">P</text>';
    }
    svg += '</svg>';
    
    var q = '<div style="text-align:center;">Quelle est la distance du point P à la droite (D) ?<br><span style="font-size:0.85rem;color:var(--text-muted);">(1 carreau = 1 unité)</span></div>' + svg;
    
    exs.push({
      question: q,
      answer: String(Math.abs(d)),
      explanation: 'La distance est de ' + Math.abs(d) + ' carreaux.',
      check: makeCheckNum(Math.abs(d))
    });
  }
  return exs;
}

/* ── c1-16 : Distance droites parallèles ────────────────────── */
function genDistParallelLines(){
  var exs=[];
  for(var i=0; i<10; i++){
    var isHoriz = rnd(0,1) === 0;
    var d = rnd(3, 14); // distance en carreaux
    var l1Pos = rnd(1, 19 - d);
    var l2Pos = l1Pos + d;
    
    var svg = genSvgGrid();
    if (isHoriz) {
      svg += '<line x1="0" y1="'+(l1Pos*20)+'" x2="400" y2="'+(l1Pos*20)+'" stroke="#ef4444" stroke-width="3" />';
      svg += '<text x="5" y="'+(l1Pos*20 - 5)+'" fill="#ef4444" font-weight="bold" font-family="sans-serif" font-size="14">(d₁)</text>';
      svg += '<line x1="0" y1="'+(l2Pos*20)+'" x2="400" y2="'+(l2Pos*20)+'" stroke="#3b82f6" stroke-width="3" />';
      svg += '<text x="5" y="'+(l2Pos*20 - 5)+'" fill="#3b82f6" font-weight="bold" font-family="sans-serif" font-size="14">(d₂)</text>';
    } else {
      svg += '<line x1="'+(l1Pos*20)+'" y1="0" x2="'+(l1Pos*20)+'" y2="400" stroke="#ef4444" stroke-width="3" />';
      svg += '<text x="'+(l1Pos*20 + 5)+'" y="15" fill="#ef4444" font-weight="bold" font-family="sans-serif" font-size="14">(d₁)</text>';
      svg += '<line x1="'+(l2Pos*20)+'" y1="0" x2="'+(l2Pos*20)+'" y2="400" stroke="#3b82f6" stroke-width="3" />';
      svg += '<text x="'+(l2Pos*20 + 5)+'" y="15" fill="#3b82f6" font-weight="bold" font-family="sans-serif" font-size="14">(d₂)</text>';
    }
    svg += '</svg>';
    
    var q = '<div style="text-align:center;">Quelle est la distance entre les droites parallèles (d₁) et (d₂) ?<br><span style="font-size:0.85rem;color:var(--text-muted);">(1 carreau = 1 unité)</span></div>' + svg;
    
    exs.push({
      question: q,
      answer: String(d),
      explanation: 'La distance est de ' + d + ' carreaux.',
      check: makeCheckNum(d)
    });
  }
  return exs;
}
