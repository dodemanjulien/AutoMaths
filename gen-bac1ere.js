/* AutoMaths – gen-bac1ere.js : Générateurs BAC PRO 1ère (15 automatismes) */

function genProbability1ere(){
  var exs=[];
  for(var i=0;i<10;i++){
    var total=pick([4,5,6,8,10,12,20]),fav=rnd(1,total-1);
    var g=gcd(fav,total),ans=fr(fav/g,total/g);
    exs.push({question:'Urne : '+total+' boules dont '+fav+' rouges. P(rouge) = ?',
      answer:ans,explanation:'P(rouge) = '+ans,check:makeCheckStr(ans)});
  }
  return exs;
}

function genCounting1ere(){
  var exs=[];
  for(var i=0;i<10;i++){
    var a=rnd(2,5),b=rnd(2,5),t=rnd(0,1),q;
    if(t===0){q='Menu : '+a+' entrées et '+b+' plats. Combien de menus possibles ?';}
    else{q='Arbre : '+a+' premières branches, chacune avec '+b+' secondes. Nombre de feuilles ?';}
    exs.push({question:q,answer:String(a*b),explanation:a+' × '+b+' = '+(a*b),check:makeCheckNum(a*b)});
  }
  return exs;
}

function genSvgBarChart(categories, values) {
  var maxVal = Math.max.apply(null, values);
  if (maxVal === 0) maxVal = 10;
  
  var w = 160, h = 160, pTop = 15, pRight = 10, pBot = 25, pLeft = 25;
  var graphW = w - pLeft - pRight;
  var graphH = h - pTop - pBot;
  
  var svg = '<svg width="100%" height="auto" viewBox="0 0 '+w+' '+h+'" xmlns="http://www.w3.org/2000/svg" style="display:block; margin: 1rem auto; max-width:350px; font-family:sans-serif; background:rgba(255,255,255,0.02); border-radius:8px; border:1px solid rgba(255,255,255,0.1);">';
  
  svg += '<line x1="'+pLeft+'" y1="'+pTop+'" x2="'+pLeft+'" y2="'+(h-pBot)+'" stroke="#cbd5e1" stroke-width="1.5"/>';
  svg += '<line x1="'+pLeft+'" y1="'+(h-pBot)+'" x2="'+(w-pRight)+'" y2="'+(h-pBot)+'" stroke="#cbd5e1" stroke-width="1.5"/>';
  
  var tickVals = [0, Math.ceil(maxVal/2), maxVal];
  for (var i = 0; i < tickVals.length; i++) {
    var v = tickVals[i];
    var ty = (h - pBot) - (v / maxVal) * graphH;
    svg += '<line x1="'+(pLeft-3)+'" y1="'+ty+'" x2="'+pLeft+'" y2="'+ty+'" stroke="#cbd5e1" stroke-width="1"/>';
    if (v >= 0) svg += '<text x="'+(pLeft-5)+'" y="'+(ty+4)+'" fill="#94a3b8" font-size="10" text-anchor="end">'+v+'</text>';
  }
  
  var barW = (graphW / categories.length) * 0.6;
  var spacing = graphW / categories.length;
  
  for(var i=0; i<categories.length; i++) {
    var cat = categories[i];
    var val = values[i];
    var barH = (val / maxVal) * graphH;
    var bx = pLeft + (i+0.5)*spacing - barW/2;
    var by = (h - pBot) - barH;
    
    svg += '<rect x="'+bx+'" y="'+by+'" width="'+barW+'" height="'+barH+'" fill="#3b82f6" rx="2" ry="2" />';
    svg += '<text x="'+(pLeft + (i+0.5)*spacing)+'" y="'+(h-pBot+12)+'" fill="#94a3b8" font-size="11" font-weight="bold" text-anchor="middle">'+cat+'</text>';
  }
  
  svg += '</svg>';
  return svg;
}

function genGraphReading1ere(){
  var exs=[];
  for(var i=0;i<10;i++){
    var graphType = rnd(0, 2); // 0=barres, 1=secteurs, 2=boîte à moustaches

    if (graphType === 0) {
      // ── Diagramme en barres ──────────────────────────────────
      var catCount = rnd(3, 5), categories = [], values = [], letters = ['A','B','C','D','E'];
      for(var j=0; j<catCount; j++){ categories.push(letters[j]); values.push(rnd(2,10)); }
      var svgB = genSvgBarChart(categories, values);
      var qType = rnd(0, 2);
      if (qType === 0) {
        var idx = rnd(0, catCount-1);
        var qb = '<div style="text-align:center;">Effectif de la catégorie <b>'+categories[idx]+'</b> ?</div>'+svgB;
        var ansb = String(values[idx]);
        var others = values.filter(function(v){return v!==values[idx];}).sort(function(){return Math.random()-0.5;}).slice(0,2);
        while(others.length<2) others.push(rnd(1,10));
        exs.push({question:qb,answer:ansb,choices:[ansb,String(others[0]),String(others[1])],explanation:'Barre '+categories[idx]+' = '+ansb+'.',check:makeCheckStr(ansb)});
      } else if (qType === 1) {
        var maxV=-1,maxC=''; for(var j=0;j<catCount;j++){if(values[j]>maxV){maxV=values[j];maxC=categories[j];}}
        exs.push({question:'<div style="text-align:center;">Quelle catégorie a le <b>plus grand</b> effectif ?</div>'+svgB,answer:maxC,choices:categories.slice().sort(function(){return Math.random()-0.5;}).slice(0,3),explanation:'Plus haute barre : '+maxC+'.',check:makeCheckStr(maxC)});
      } else {
        var minV=999,minC=''; for(var j=0;j<catCount;j++){if(values[j]<minV){minV=values[j];minC=categories[j];}}
        exs.push({question:'<div style="text-align:center;">Quelle catégorie a le <b>plus petit</b> effectif ?</div>'+svgB,answer:minC,choices:categories.slice().sort(function(){return Math.random()-0.5;}).slice(0,3),explanation:'Plus basse barre : '+minC+'.',check:makeCheckStr(minC)});
      }

    } else if (graphType === 1) {
      // ── Diagramme en secteurs (camembert) ────────────────────
      var themes = [['Rouge','Bleu','Vert'],['Voiture','Vélo','Marche'],['Sport','Musique','Autre'],['Lundi','Mardi','Mercredi']];
      var thm = pick(themes);
      var pcts = [rnd(20,50), rnd(15,35)];
      pcts.push(100-pcts[0]-pcts[1]);
      if (pcts[2] < 5) { i--; continue; }
      var cx=100,cy=100,r=75,svgW=260,svgH=200;
      var svgP = '<svg width="100%" height="auto" viewBox="0 0 '+svgW+' '+svgH+'" xmlns="http://www.w3.org/2000/svg" style="display:block;margin:0.5rem auto;max-width:320px;">';
      var colors=['#3b82f6','#f59e0b','#10b981'];
      var startA = -Math.PI/2;
      for(var s=0;s<3;s++){
        var sweep=(pcts[s]/100)*2*Math.PI, endA=startA+sweep;
        var x1=cx+r*Math.cos(startA),y1=cy+r*Math.sin(startA);
        var x2=cx+r*Math.cos(endA),y2=cy+r*Math.sin(endA);
        svgP += '<path d="M'+cx+','+cy+' L'+x1.toFixed(1)+','+y1.toFixed(1)+' A'+r+','+r+' 0 '+(sweep>Math.PI?1:0)+',1 '+x2.toFixed(1)+','+y2.toFixed(1)+' Z" fill="'+colors[s]+'"/>';
        var midA=startA+sweep/2;
        svgP += '<text x="'+(cx+r*0.62*Math.cos(midA)).toFixed(1)+'" y="'+(cy+r*0.62*Math.sin(midA)+4).toFixed(1)+'" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">'+pcts[s]+'%</text>';
        svgP += '<rect x="185" y="'+(15+s*20)+'" width="11" height="11" fill="'+colors[s]+'"/>';
        svgP += '<text x="200" y="'+(25+s*20)+'" fill="#94a3b8" font-size="10">'+thm[s]+'</text>';
        startA=endA;
      }
      svgP += '</svg>';
      var tIdx=rnd(0,2);
      var ansp=String(pcts[tIdx])+'%';
      var o1=String(pcts[(tIdx+1)%3])+'%', o2=String(pcts[(tIdx+2)%3])+'%';
      exs.push({question:'<div style="text-align:center;">Quel est le pourcentage de <b>'+thm[tIdx]+'</b> ?</div>'+svgP,answer:ansp,choices:[ansp,o1,o2].sort(function(){return Math.random()-0.5;}),explanation:'Part '+thm[tIdx]+' = '+pcts[tIdx]+'%.',check:makeCheckStr(ansp)});

    } else {
      // ── Boîte à moustaches ───────────────────────────────────
      var mn=rnd(5,20), q1=mn+rnd(3,8), med=q1+rnd(3,8), q3=med+rnd(3,8), mx=q3+rnd(3,8);
      var bw=300,bh=80,py=40,scale=(bw-20)/(mx-mn+8),offset=4;
      function bx(v){return Math.round((v-mn+offset)*scale);}
      var svgM='<svg width="100%" height="auto" viewBox="0 0 '+bw+' '+bh+'" xmlns="http://www.w3.org/2000/svg" style="display:block;margin:0.5rem auto;max-width:350px;">';
      svgM+='<line x1="'+bx(mn)+'" y1="'+py+'" x2="'+bx(mx)+'" y2="'+py+'" stroke="#cbd5e1" stroke-width="1.5"/>';
      [[mn],[mx]].forEach(function(a){svgM+='<line x1="'+bx(a[0])+'" y1="'+(py-10)+'" x2="'+bx(a[0])+'" y2="'+(py+10)+'" stroke="#94a3b8" stroke-width="2"/>';});
      svgM+='<line x1="'+bx(mn)+'" y1="'+py+'" x2="'+bx(q1)+'" y2="'+py+'" stroke="#94a3b8" stroke-width="2"/>';
      svgM+='<line x1="'+bx(q3)+'" y1="'+py+'" x2="'+bx(mx)+'" y2="'+py+'" stroke="#94a3b8" stroke-width="2"/>';
      svgM+='<rect x="'+bx(q1)+'" y="'+(py-15)+'" width="'+(bx(q3)-bx(q1))+'" height="30" fill="#3b82f680" stroke="#3b82f6" stroke-width="2"/>';
      svgM+='<line x1="'+bx(med)+'" y1="'+(py-15)+'" x2="'+bx(med)+'" y2="'+(py+15)+'" stroke="#f59e0b" stroke-width="3"/>';
      [[mn,'min'],[q1,'Q1'],[med,'Méd.'],[q3,'Q3'],[mx,'max']].forEach(function(a){
        svgM+='<text x="'+bx(a[0])+'" y="'+(py+28)+'" fill="#94a3b8" font-size="9" text-anchor="middle">'+a[0]+'</text>';
        svgM+='<text x="'+bx(a[0])+'" y="'+(py-20)+'" fill="#64748b" font-size="8" text-anchor="middle">'+a[1]+'</text>';
      });
      svgM+='</svg>';
      var qIdx=rnd(0,3);
      var qLabels=['minimum','médiane','maximum','étendue'],qAnss=[mn,med,mx,mx-mn];
      var ansm=String(qAnss[qIdx]);
      var aa2=String(qAnss[(qIdx+1)%4]),aa3=String(qAnss[(qIdx+2)%4]);
      exs.push({question:'<div style="text-align:center;">Quel est le <b>'+qLabels[qIdx]+'</b> d\'après cette boîte à moustaches ?</div>'+svgM,answer:ansm,choices:[ansm,aa2,aa3].sort(function(){return Math.random()-0.5;}),explanation:qLabels[qIdx]+' = '+ansm+'.',check:makeCheckStr(ansm)});
    }
  }
  return exs;
}

function genStatIndicators(){
  var exs=[];
  for(var i=0;i<10;i++){
    var n=rnd(4,7),vals=[],sum=0;
    for(var j=0;j<n;j++)vals.push(rnd(5,20));
    vals.forEach(function(x){sum+=x;});
    vals.sort(function(a,b){return a-b;});
    var moy=Math.round(sum/n*10)/10;
    var et=vals[vals.length-1]-vals[0];
    var med=n%2===0?(vals[n/2-1]+vals[n/2])/2:vals[Math.floor(n/2)];
    var t=rnd(0,2),q,ans;
    if(t===0){q='Série : '+vals.join(' ; ')+'. Moyenne ?';ans=numStr(moy);}
    else if(t===1){q='Série : '+vals.join(' ; ')+'. Étendue ?';ans=String(et);}
    else{q='Série : '+vals.join(' ; ')+'. Médiane ?';ans=numStr(med);}
    exs.push({question:q,answer:ans,explanation:ans,check:makeCheckNum(parseFloat(String(ans).replace(',','.')),0.1)});
  }
  return exs;
}

function genEquation1ere(){
  var exs=[];
  for(var i=0;i<10;i++){
    var a=rnd(1,6),x=rnd(-8,8)||1,b=rnd(-10,10),c=a*x+b;
    exs.push({question:a+'x '+(b>=0?'+ '+b:'− '+Math.abs(b))+' = '+c+' ; x = ?',
      answer:String(x),explanation:'x = '+x,check:makeCheckNum(x)});
  }
  return exs;
}

function genInequality1ere(){
  var exs=[];
  var signs=['<','≤','>','≥'];
  for(var i=0;i<10;i++){
    var a=rnd(1,5),x=rnd(-5,5),b=rnd(-8,8),c=a*x+b,sgn=pick(signs);
    exs.push({question:a+'x '+(b>=0?'+ '+b:'− '+Math.abs(b))+' '+sgn+' '+c+' ; x '+sgn+' ?',
      answer:String(x),explanation:'x '+sgn+' '+x,check:makeCheckNum(x)});
  }
  return exs;
}

function genLinearFunction(){
  var exs=[];
  for(var i=0;i<10;i++){
    var t = rnd(0, 2); // 0=graphique k, 1=image graphique, 2=reconnaissance proportionnalité
    if (t === 2) {
      // ── Reconnaissance de proportionnalité ──────────────────────
      var isP = rnd(0,1)===0, kp=rnd(1,5), bp=rnd(1,4);
      var xV=[1,2,3,4], yV=xV.map(function(x){return isP?kp*x:kp*x+bp;});
      var tbl='<table style="border-collapse:collapse;margin:6px auto;font-size:0.9em;"><tr style="background:rgba(255,255,255,0.08);"><td style="border:1px solid #475569;padding:3px 8px;">x</td>';
      xV.forEach(function(v){tbl+='<td style="border:1px solid #475569;padding:3px 8px;text-align:center;">'+v+'</td>';});
      tbl+='</tr><tr><td style="border:1px solid #475569;padding:3px 8px;">y</td>';
      yV.forEach(function(v){tbl+='<td style="border:1px solid #475569;padding:3px 8px;text-align:center;">'+v+'</td>';});
      tbl+='</tr></table>';
      var ansp=isP?'oui':'non';
      exs.push({question:'<div style="text-align:center;margin-bottom:6px;">Situation de proportionnalité ?</div>'+tbl,answer:ansp,choices:['oui','non','impossible à dire'],explanation:isP?'y/x = '+kp+' constant : proportionnel.':'y/x varie : non proportionnel (y='+kp+'x+'+bp+').',check:makeCheckStr(ansp)});
    } else {
      var k=0; while(k===0) k=rnd(-3,3);
      var pts=[{x:0,y:0}];
      var xO=(k>0)?rnd(1,Math.floor(10/k)):rnd(1,Math.floor(10/-k));
      pts.push({x:xO,y:k*xO}); pts.push({x:-xO,y:-k*xO});
      pts.sort(function(a,b){return a.x-b.x;});
      var svgL=genSvgFunctionGraph(pts);
      var q,ans,exp;
      if(t===0){
        q='<div style="text-align:center;">Représentation de <b>f(x)=kx</b>. Quel est <b>k</b> ?</div>'+svgL;
        ans=String(k); exp='k = '+(k>0?'':'−')+Math.abs(k)+'.';
      }else{
        var xq=rnd(0,1)===0?xO:-xO;
        q='<div style="text-align:center;">Image de <b>'+xq+'</b> ?</div>'+svgL;
        ans=String(k*xq); exp='f('+xq+')='+k+'×'+xq+'='+(k*xq)+'.';
      }
      exs.push({question:q,answer:ans,explanation:exp,check:makeCheckNum(parseFloat(ans))});
    }
  }
  return exs;
}

function genSlope(){
  var exs=[];
  for(var i=0;i<10;i++){
    var m = rnd(-3, 3);
    while (m === 0) m = rnd(-3, 3);
    var p = rnd(-5, 5);
    
    var validX = [];
    for(var x = -10; x <= 10; x++) {
      var y = m*x + p;
      if (y >= -10 && y <= 10) validX.push(x);
    }
    
    if (validX.length < 2) { i--; continue; }
    
    var xA = validX[rnd(0, validX.length-2)];
    var validXB = validX.filter(function(v){ return v > xA; });
    if (validXB.length === 0) { i--; continue; }
    var xB = pick(validXB);
    
    var yA = m*xA + p;
    var yB = m*xB + p;
    
    var xMin = validX[0], xMax = validX[validX.length-1];
    var yMin = m*xMin + p, yMax = m*xMax + p;
    var ptsToPlot = [ {x: xMin, y: yMin}, {x: xA, y: yA}, {x: xB, y: yB}, {x: xMax, y: yMax} ];
    
    var uniquePts = [];
    var seen = {};
    for(var j=0; j<ptsToPlot.length; j++) {
      var pt = ptsToPlot[j];
      var key = pt.x + '_' + pt.y;
      if (!seen[key]) { seen[key] = true; uniquePts.push(pt); }
    }
    uniquePts.sort(function(a,b){return a.x - b.x;});
    
    var svg = genSvgFunctionGraph(uniquePts);
    
    var cell = 160 / 20; 
    var center = 80; 
    var ax = center + xA * cell, ay = center - yA * cell;
    var bx = center + xB * cell, by = center - yB * cell;
    
    var inject = '<text x="'+(ax-8)+'" y="'+(ay-8)+'" fill="#0f172a" font-weight="bold" font-size="12">A</text>';
    inject += '<text x="'+(bx+8)+'" y="'+(by-8)+'" fill="#0f172a" font-weight="bold" font-size="12">B</text>';
    
    svg = svg.replace('</svg>', inject + '</svg>');
    
    var q = '<div style="text-align:center;">En t\'aidant du graphique ci-dessous, calcule le <b>coefficient directeur</b> de la droite (AB).</div>' + svg;
    var ans = String(m);
    var exp = 'En partant de A vers B, on se décale de ' + (xB - xA) + ' en abscisse, et on ' + (yB > yA ? 'monte' : 'descend') + ' de ' + Math.abs(yB - yA) + ' en ordonnée. Pente = ' + (yB - yA) + ' / ' + (xB - xA) + ' = ' + m + '.';
    
    exs.push({question:q, answer:ans, explanation:exp, check:makeCheckNum(m)});
  }
  return exs;
}

function genParallelLines1ere(){
  var exs=[];
  for(var i=0;i<10;i++){
    var a=rnd(1,5),b=rnd(-6,6);
    exs.push({question:'d : y = '+a+'x '+(b>=0?'+ '+b:'− '+Math.abs(b))+'. Pente d\'une droite parallèle à d = ?',
      answer:String(a),explanation:'Pentes égales = '+a,check:makeCheckNum(a)});
  }
  return exs;
}

function genInteretSimple(){
  var exs=[];
  for(var i=0;i<10;i++){
    var C=pick([500,1000,2000,3000]),t=rnd(2,8)/100,n=rnd(1,5);
    var I=Math.round(C*t*n*100)/100,A=C+I;
    var tp=rnd(0,1),q,ans;
    if(tp===0){q='Capital '+C+' €, taux '+(t*100)+' %/an, durée '+n+' an(s). Intérêt = ?';ans=numStr(I);}
    else{q='Capital '+C+' €, taux '+(t*100)+' %/an, durée '+n+' an(s). Valeur acquise = ?';ans=numStr(A);}
    exs.push({question:q,answer:ans+' €',explanation:ans+' €',check:makeCheckNum(parseFloat(String(ans).replace(',','.')),0.01)});
  }
  return exs;
}

function genGeomVocab(){
  var items=[
    {q:'Formule longueur cercle de rayon r ?',a:'2πr'},
    {q:'Formule aire disque de rayon r ?',a:'πr²'},
    {q:'Le diamètre = combien de fois le rayon ?',a:'2'},
    {q:'Aire disque rayon 5 cm ≈ ? cm² (π≈3,14)',a:'78,5'},
    {q:'Périmètre d\'un carré de côté 4 cm ?',a:'16'},
  ];
  var exs=[];
  for(var i=0;i<10;i++){
    var item=pick(items);
    exs.push({question:item.q,answer:item.a,explanation:item.a,check:makeCheckNumOrStr(item.a)});
  }
  return exs;
}

function genSolidRecognition(){
  var items=[
    {q:'Solide à 6 faces carrées égales ?',a:'cube'},
    {q:'Solide à base rectangulaire et 4 faces rectangulaires ?',a:'pavé droit'},
    {q:'Solide à base circulaire et une pointe ?',a:'cône'},
    {q:'Solide à deux bases circulaires parallèles ?',a:'cylindre'},
    {q:'Solide à base carrée et 4 faces triangulaires ?',a:'pyramide'},
  ];
  var exs=[];
  for(var i=0;i<10;i++){
    var item=pick(items);
    exs.push({question:item.q,answer:item.a,explanation:item.a,check:makeCheckStr(item.a)});
  }
  return exs;
}

function genAreaCalc1ere(){
  var exs=[];
  for(var i=0;i<10;i++){
    var t=rnd(0,3),q,res;
    if(t===0){var bv=rnd(3,12),h=rnd(2,10);res=bv*h/2;q='Aire d\'un triangle (b = '+bv+' cm ; h = '+h+' cm) = ?';}
    else if(t===1){var c=rnd(2,12);res=c*c;q='Aire d\'un carré (c = '+c+' cm) = ?';}
    else if(t===2){var l=rnd(3,15),w=rnd(2,10);res=l*w;q='Aire d\'un rectangle (L = '+l+' cm ; l = '+w+' cm) = ?';}
    else{var r=rnd(2,8);res=Math.round(Math.PI*r*r*10)/10;q='Aire d\'un disque (R = '+r+' cm) ≈ ?';}
    exs.push({question:q,answer:numStr(res)+' cm²',explanation:numStr(res)+' cm²',check:makeCheckNum(res,0.5)});
  }
  return exs;
}

function genVolumeCalc(){
  var exs=[];
  for(var i=0;i<10;i++){
    var t=rnd(0,2),q,res;
    if(t===0){var a=rnd(2,8);res=a*a*a;q='Volume d\'un cube (c = '+a+' cm) = ?';}
    else if(t===1){var l=rnd(3,10),w=rnd(2,6),h=rnd(2,6);res=l*w*h;q='Volume d\'un pavé droit (L = '+l+' cm ; l = '+w+' cm ; h = '+h+' cm) = ?';}
    else{var r=rnd(2,6),h2=rnd(3,10);res=Math.round(Math.PI*r*r*h2*10)/10;q='Volume d\'un cylindre (R = '+r+' cm ; h = '+h2+' cm) ≈ ?';}
    exs.push({question:q,answer:numStr(res)+' cm³',explanation:numStr(res)+' cm³',check:makeCheckNum(res,1)});
  }
  return exs;
}

function genDevelopment1ere(){
  var exs=[];
  for(var i=0;i<10;i++){
    var a=rnd(1,5),b=rnd(-5,5)||1,t=rnd(0,1),q,ans;
    if(t===0){
      q='Développer : '+a+'(x '+(b>=0?'+ '+b:'− '+Math.abs(b))+')';
      var prod=a*b;
      ans=a+'x '+(prod>=0?'+ '+prod:'− '+Math.abs(prod));
    }else{
      var c=rnd(-5,5)||1;
      q='Développer : (x '+(b>=0?'+ '+b:'− '+Math.abs(b))+')'+'(x '+(c>=0?'+ '+c:'− '+Math.abs(c))+')';
      var bc=b+c,p2=b*c;
      ans='x² '+(bc!==0?(bc>=0?'+ '+bc:'− '+Math.abs(bc))+'x ':'')+' '+(p2>=0?'+ '+p2:'− '+Math.abs(p2));
    }
    exs.push({question:q,answer:ans,explanation:ans,check:makeCheckStr(ans)});
  }
  return exs;
}

/* ── b1-16 : Association graphique ↔ données ─────────────────── */
function genDataAssoc1ere() {
  var exs = [];
  for (var i = 0; i < 10; i++) {
    var cats = ['A','B','C','D'];
    var vals = [rnd(2,9), rnd(2,9), rnd(2,9), rnd(2,9)];
    var targetIdx = rnd(0, 1); // 0 = plus grand, 1 = plus petit
    var sorted = vals.slice().sort(function(a,b){return a-b;});
    var q, ans, exp;
    if (targetIdx === 0) {
      var maxV = sorted[sorted.length-1];
      var maxCat = cats[vals.indexOf(maxV)];
      ans = maxCat;
      exp = 'La plus grande valeur est ' + maxV + ', pour la catégorie ' + maxCat + '.';
      q = 'Voici les effectifs : ' + cats.map(function(c,i){ return c+'='+vals[i]; }).join(', ') + '. Quelle catégorie a la valeur la plus élevée ?';
    } else {
      var minV = sorted[0];
      var minCat = cats[vals.indexOf(minV)];
      ans = minCat;
      exp = 'La plus petite valeur est ' + minV + ', pour la catégorie ' + minCat + '.';
      q = 'Voici les effectifs : ' + cats.map(function(c,i){ return c+'='+vals[i]; }).join(', ') + '. Quelle catégorie a la valeur la plus faible ?';
    }
    exs.push({question:q, answer:ans, choices:cats.slice().sort(function(){return Math.random()-0.5;}).slice(0,3), explanation:exp, check:makeCheckStr(ans)});
  }
  return exs;
}

/* ── b1-17 : Calcul de f(a) ──────────────────────────────────── */
function genFunctionValue1ere() {
  var exs = [];
  for (var i = 0; i < 10; i++) {
    var t = rnd(0, 2);
    var q, ans;
    if (t === 0) {
      var a = rnd(1,4), b = rnd(-5,5), x = rnd(-3,5);
      var res = a*x + b;
      q = 'f(x) = '+a+'x '+(b>=0?'+ '+b:'− '+Math.abs(b))+'. Calculer f('+x+').';
      ans = String(res);
      var exp = a+'×'+x+' '+(b>=0?'+ '+b:'− '+Math.abs(b))+' = '+res;
      exs.push({question:q, answer:ans, explanation:exp, check:makeCheckStr(ans)});
    } else if (t === 1) {
      var a2 = pick([-2,-1,1,2]), s = rnd(-4,4), x2 = rnd(-3,4);
      var res2 = a2*(x2-s)*(x2-s);
      q = 'f(x) = '+a2+'(x '+(s>=0?'− '+s:'+ '+Math.abs(s))+')². Calculer f('+x2+').';
      ans = String(res2);
      exs.push({question:q, answer:ans, explanation:a2+'×('+x2+(s>=0?'−'+s:'+'+Math.abs(s))+')² = '+res2, check:makeCheckStr(ans)});
    } else {
      var k = rnd(1,5), x3 = rnd(1,8);
      var res3 = k*x3;
      q = 'f est linéaire et f(1) = '+k+'. Calculer f('+x3+').';
      ans = String(res3);
      exs.push({question:q, answer:ans, explanation:'f(x)='+k+'x → f('+x3+')='+res3, check:makeCheckStr(ans)});
    }
  }
  return exs;
}

/* ── b1-18 : Tableau de variations → comportement ─────────────── */
function genSvgVariationTable(xValues, yValues, variations) {
  var w = 320, h = 100;
  var svg = '<svg width="100%" height="auto" viewBox="0 0 '+w+' '+h+'" xmlns="http://www.w3.org/2000/svg" style="display:block; margin: 1rem auto; max-width:320px; font-family:sans-serif; background:rgba(255,255,255,0.02); border-radius:8px; border:1px solid rgba(255,255,255,0.1);">';
  
  // Separation lines
  svg += '<line x1="0" y1="35" x2="'+w+'" y2="35" stroke="#cbd5e1" stroke-width="1.5"/>';
  svg += '<line x1="50" y1="0" x2="50" y2="'+h+'" stroke="#cbd5e1" stroke-width="1.5"/>';
  
  // Labels
  svg += '<text x="25" y="22" fill="#94a3b8" font-size="12" font-weight="bold" text-anchor="middle">x</text>';
  svg += '<text x="25" y="70" fill="#94a3b8" font-size="12" font-weight="bold" text-anchor="middle">f(x)</text>';
  
  var numCols = xValues.length;
  var colW = (w - 50) / numCols;
  
  // Plot X values
  for (var i = 0; i < numCols; i++) {
    var cx = 50 + colW * (i + 0.5);
    svg += '<text x="'+cx+'" y="22" fill="#f0f4ff" font-size="12" font-weight="bold" text-anchor="middle">'+xValues[i]+'</text>';
  }
  
  // Plot Variations and Y values
  for (var i = 0; i < numCols; i++) {
    var cx = 50 + colW * (i + 0.5);
    var yVal = yValues[i];
    var isTop = false;
    
    if (i === 0) {
      isTop = (variations[0] === 'down');
    } else if (i === numCols - 1) {
      isTop = (variations[i-1] === 'up');
    } else {
      isTop = (variations[i-1] === 'up' && variations[i] === 'down');
    }
    
    var cy = isTop ? 52 : 88;
    svg += '<text x="'+cx+'" y="'+cy+'" fill="#cbd5e1" font-size="11" font-weight="bold" text-anchor="middle">'+yVal+'</text>';
  }
  
  // Draw arrows
  for (var i = 0; i < variations.length; i++) {
    var cxStart = 50 + colW * (i + 0.5);
    var cxEnd = 50 + colW * (i + 1.5);
    var xStart = cxStart + 18;
    var xEnd = cxEnd - 18;
    
    var isUp = (variations[i] === 'up');
    var yStart = isUp ? 82 : 55;
    var yEnd = isUp ? 55 : 82;
    
    // Draw arrow line
    svg += '<line x1="'+xStart+'" y1="'+yStart+'" x2="'+xEnd+'" y2="'+yEnd+'" stroke="#3b82f6" stroke-width="2" />';
    
    // Draw arrowhead
    var angle = Math.atan2(yEnd - yStart, xEnd - xStart);
    var arrowSize = 6;
    var xHead1 = xEnd - arrowSize * Math.cos(angle - Math.PI/6);
    var yHead1 = yEnd - arrowSize * Math.sin(angle - Math.PI/6);
    var xHead2 = xEnd - arrowSize * Math.cos(angle + Math.PI/6);
    var yHead2 = yEnd - arrowSize * Math.sin(angle + Math.PI/6);
    
    svg += '<polygon points="'+xEnd+','+yEnd+' '+xHead1+','+yHead1+' '+xHead2+','+yHead2+'" fill="#3b82f6" />';
  }
  
  svg += '</svg>';
  return svg;
}

function genVariationTable1ere() {
  var exs = [];
  for (var i = 0; i < 10; i++) {
    var t = rnd(0, 3);
    var q, ans, exp, choices;
    if (t === 0) {
      var x1=rnd(-5,-1), y1=rnd(3,10), x2=rnd(1,5), y2=rnd(-8,-1);
      var svg = genSvgVariationTable([x1, x2], [y1, y2], ['down']);
      q = '<div style="text-align:center; margin-bottom: 8px;">D\'après ce tableau de variations, quel est le comportement de la fonction <b>f</b> sur ['+x1+' ; '+x2+'] ?</div>' + svg;
      ans = 'décroissante'; choices = ['croissante','décroissante','constante'];
      exp = 'Les flèches du tableau descendent, donc f est décroissante.';
    } else if (t === 1) {
      var x1=rnd(-5,-1), y1=rnd(-8,-1), x2=rnd(1,5), y2=rnd(3,10);
      var svg = genSvgVariationTable([x1, x2], [y1, y2], ['up']);
      q = '<div style="text-align:center; margin-bottom: 8px;">D\'après ce tableau de variations, quel est le comportement de la fonction <b>f</b> sur ['+x1+' ; '+x2+'] ?</div>' + svg;
      ans = 'croissante'; choices = ['croissante','décroissante','constante'];
      exp = 'Les flèches du tableau montent, donc f est croissante.';
    } else if (t === 2) {
      var xm=rnd(-3,0), ymax=rnd(4,10), xa=rnd(-5,-4), xb=rnd(2,5), ya=rnd(-5,0), yb=rnd(-5,0);
      var svg = genSvgVariationTable([xa, xm, xb], [ya, ymax, yb], ['up', 'down']);
      q = '<div style="text-align:center; margin-bottom: 8px;">D\'après ce tableau de variations, quel extremum la fonction <b>f</b> admet-elle en x = '+xm+' ?</div>' + svg;
      ans = 'maximum'; choices = ['maximum','minimum','ni maximum ni minimum'];
      exp = 'La fonction croît puis décroît. Elle atteint un maximum égal à '+ymax+' en x = '+xm+'.';
    } else {
      var xm=rnd(0,3), ymin=rnd(-10,-4), xa=rnd(-5,-2), xb=rnd(4,6), ya=rnd(0,5), yb=rnd(0,5);
      var svg = genSvgVariationTable([xa, xm, xb], [ya, ymin, yb], ['down', 'up']);
      q = '<div style="text-align:center; margin-bottom: 8px;">D\'après ce tableau de variations, quel extremum la fonction <b>f</b> admet-elle en x = '+xm+' ?</div>' + svg;
      ans = 'minimum'; choices = ['maximum','minimum','ni maximum ni minimum'];
      exp = 'La fonction décroît puis croît. Elle atteint un minimum égal à '+ymin+' en x = '+xm+'.';
    }
    exs.push({question:q, answer:ans, choices:choices, explanation:exp, check:makeCheckStr(ans)});
  }
  return exs;
}

/* ── b1-19 : Extremums d'une fonction (graphique) ──────────────── */
function genExtremums1ere() {
  var exs = [];
  for (var i = 0; i < 10; i++) {
    var a = pick([-1,1,-2,2]);
    var alpha = rnd(-4,4), beta = a>0 ? rnd(-8,-1) : rnd(1,8);
    var xMin = -9, xMax = 9;
    var pts = [];
    for (var x = xMin; x <= xMax; x += 0.5) {
      var y = a*(x-alpha)*(x-alpha) + beta;
      if (y >= -9.5 && y <= 9.5) pts.push({x:x, y:y});
    }
    var svg = (typeof genSvgFunctionGraph === 'function') ? genSvgFunctionGraph(pts) : '';
    // Marquer le sommet
    var px_center = 200 + alpha*20;
    var py_center = 200 - beta*20;
    svg = svg.replace('</svg>', '<circle cx="'+px_center+'" cy="'+py_center+'" r="6" fill="#f59e0b" stroke="#fff" stroke-width="2"/></svg>');

    var t = rnd(0, 1);
    var q, ans, exp;
    if (t === 0) {
      ans = String(beta);
      var extremType = a > 0 ? 'minimum' : 'maximum';
      q = '<div style="text-align:center;">Quel est le '+extremType+' de f ?</div>' + svg;
      exp = 'Le sommet (en jaune) est en ('+alpha+' ; '+beta+'). Le '+extremType+' vaut '+beta+'.';
    } else {
      ans = String(alpha);
      var extremType2 = a > 0 ? 'minimum' : 'maximum';
      q = '<div style="text-align:center;">En quelle valeur de x la fonction admet-elle son '+extremType2+' ?</div>' + svg;
      exp = 'Le sommet (en jaune) est en x = '+alpha+'. La fonction admet son '+extremType2+' en x = '+alpha+'.';
    }
    exs.push({question:q, answer:ans, explanation:exp, check:makeCheckStr(ans)});
  }
  return exs;
}

/* ── b1-20 : Résolution graphique f(x)=c ─────────────────────── */
/* Compteur pour les IDs SVG uniques */
var _ggsCount = 0;
function genGraphSolve1ere() {
  var exs = [];
  for (var i = 0; i < 10; i++) {
    var a     = pick([-1, 1]);
    var alpha = rnd(-3, 3);   // sommet (entier, bien centré)
    var beta  = rnd(-3, 3);   // ordonnée du sommet (entier)

    /* ── Type d'exercice ────────────────────────────────────── */
    var roll = Math.random();
    // 65% → 2 solutions entières, 25% → tangente, 10% → aucune
    var caseType = roll < 0.65 ? 0 : roll < 0.90 ? 1 : 2;

    var c, sols;

    if (caseType === 0) {
      // 2 solutions entières exactes : x = alpha ± d  (d entier ≥ 1)
      var d = rnd(1, 3);
      // f(alpha ± d) = a*d² + beta = c  → c entier garanti
      c = beta + a * d * d;
      if (Math.abs(alpha - d) > 8 || Math.abs(alpha + d) > 8) { i--; continue; }
      if (c < -8 || c > 8) { i--; continue; }
      sols = [alpha - d, alpha + d];

    } else if (caseType === 1) {
      // Tangente : droite y = beta touche le sommet (solution unique = alpha)
      c = beta;
      if (Math.abs(alpha) > 8 || c < -8 || c > 8) { i--; continue; }
      sols = [alpha];

    } else {
      // Aucune solution : c hors de portée de la courbe
      // a=1 → minimum = beta → prendre c < beta - 1
      // a=-1 → maximum = beta → prendre c > beta + 1
      c = a === 1 ? beta - rnd(1, 3) : beta + rnd(1, 3);
      if (c < -9 || c > 9) { i--; continue; }
      sols = [];
    }

    /* ── Tracé de la parabole ───────────────────────────────── */
    var pts = [];
    for (var x = -10; x <= 10; x += 0.5) {
      var y = a * (x - alpha) * (x - alpha) + beta;
      if (y >= -9.5 && y <= 9.5) pts.push({ x: x, y: y });
    }
    if (pts.length < 4) { i--; continue; }

    var svg = (typeof genSvgFunctionGraph === 'function') ? genSvgFunctionGraph(pts) : '';
    if (!svg) { i--; continue; }

    /* ── Droite y = c en rouge pointillé ────────────────────── */
    var pyC = 200 - c * 20;
    if (pyC >= 5 && pyC <= 395) {
      svg = svg.replace('</svg>',
        '<line x1="0" y1="' + pyC + '" x2="400" y2="' + pyC +
        '" stroke="#ef4444" stroke-width="2" stroke-dasharray="6,3"/>' +
        '<text x="8" y="' + (pyC - 5) + '" fill="#ef4444" font-size="13" font-weight="bold">y=' + c + '</text>' +
        '</svg>');
    }

    /* ── Points d'intersection en orange ───────────────────── */
    var markers = '';
    for (var si = 0; si < sols.length; si++) {
      var sx  = sols[si];
      var spx = 200 + sx * 20;
      var spy = 200 - c * 20;
      markers += '<circle cx="' + spx + '" cy="' + spy +
                 '" r="7" fill="#f59e0b" stroke="#fff" stroke-width="2"/>';
    }

    /* ── Labels lisibles sur les axes (tous les 2 unités) ───── */
    var axisLbls = '';
    for (var xl = -8; xl <= 8; xl += 2) {
      if (xl !== 0) {
        axisLbls += '<text x="' + (200 + xl * 20) + '" y="218" fill="#64748b" ' +
                    'font-size="9" text-anchor="middle">' + xl + '</text>';
      }
    }
    for (var yl = -8; yl <= 8; yl += 2) {
      if (yl !== 0) {
        axisLbls += '<text x="186" y="' + (200 - yl * 20 + 4) + '" fill="#64748b" ' +
                    'font-size="9" text-anchor="end">' + yl + '</text>';
      }
    }
    svg = svg.replace('</svg>', axisLbls + markers + '</svg>');

    /* ── Conteneur avec bouton Zoom ─────────────────────────── */
    _ggsCount++;
    var svgId = 'ggs_' + _ggsCount;
    svg = svg.replace('<svg ', '<svg id="' + svgId + '" ');
    var wrappedQ =
      '<div style="text-align:center;">Résoudre graphiquement <b>f(x) = ' + c +
      '</b> (droite rouge)</div>' +
      '<div class="mg-graph-wrap">' +
        svg +
        '<button class="mg-zoom-btn" onclick="openGraphZoom(\'' + svgId +
        '\')" title="Agrandir le graphique">🔎 Zoom</button>' +
      '</div>';

    /* ── Réponse et vérification ────────────────────────────── */
    var ans, exp;
    if (sols.length === 2) {
      ans = sols[0] + ' et ' + sols[1];
      exp = 'La courbe coupe y=' + c + ' en x=' + sols[0] + ' et x=' + sols[1] + '.';
    } else if (sols.length === 1) {
      ans = String(sols[0]);
      exp = 'La courbe est tangente à y=' + c + ' en x=' + sols[0] + '.';
    } else {
      ans = 'Aucune';
      exp = 'La droite y=' + c + ' ne coupe pas la courbe : aucune solution.';
    }

    exs.push({
      question:    wrappedQ,
      answer:      ans,
      explanation: exp,
      check: (function(solArr) {
        return function(v) {
          var norm = String(v).toLowerCase()
            .replace(/\u2212/g, '-').replace(/\s+/g, '').replace(/,/g, '.');

          /* Aucune solution */
          if (solArr.length === 0) {
            return norm === 'aucune' || norm === 'aucun' ||
                   norm.indexOf('aucun') !== -1 || norm === '0';
          }

          /* 1 solution */
          if (solArr.length === 1) {
            var p = parseFloat(norm);
            return !isNaN(p) && Math.abs(p - solArr[0]) < 0.1;
          }

          /* 2 solutions — ordre quelconque */
          var nums = norm.match(/-?\d+(\.\d+)?/g);
          if (!nums || nums.length < 2) return false;
          var inp = nums.map(Number).sort(function(a,b){return a-b;});
          var ref = solArr.slice().sort(function(a,b){return a-b;});
          return Math.abs(inp[0]-ref[0]) < 0.1 && Math.abs(inp[1]-ref[1]) < 0.1;
        };
      })(sols)
    });
  }
  return exs;
}

/* ── Modal de zoom pour les graphiques ───────────────────────── */
window.openGraphZoom = function(svgId) {
  var svgEl = document.getElementById(svgId);
  if (!svgEl) return;
  var overlay = document.createElement('div');
  overlay.className = 'graph-zoom-overlay';
  overlay.innerHTML =
    '<div class="graph-zoom-modal">' +
      '<button class="graph-zoom-close" ' +
        'onclick="this.closest(\'.graph-zoom-overlay\').remove()">✕ Fermer</button>' +
      '<div class="graph-zoom-content">' + svgEl.outerHTML + '</div>' +
    '</div>';
  document.body.appendChild(overlay);
  var ms = overlay.querySelector('svg');
  if (ms) { ms.style.width = '100%'; ms.style.maxWidth = '100%'; }
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) overlay.remove();
  });
};

/* ── b1-21 : Courbe → tableau de variations ─────────────────────── */
function genCurveVariation1ere() {
  var exs = [];
  for (var i = 0; i < 10; i++) {
    var a = pick([-1,1,-2,2]);
    var alpha = rnd(-3,3), beta = rnd(-5,5);
    var pts = [];
    for (var x = -9; x <= 9; x += 0.5) {
      var y = a*(x-alpha)*(x-alpha) + beta;
      if (y >= -9 && y <= 9) pts.push({x:x, y:y});
    }
    var svg = (typeof genSvgFunctionGraph === 'function') ? genSvgFunctionGraph(pts) : '';
    var t = rnd(0, 2);
    var q, ans, choices, exp;
    if (t === 0) {
      var xTest = alpha + rnd(1,3);
      var behavior = a > 0 ? 'croissante' : 'décroissante';
      ans = behavior; choices = ['croissante','décroissante','constante'];
      q = '<div style="text-align:center;">Sur l\'intervalle ['+alpha+' ; '+(alpha+4)+'], f est…</div>' + svg;
      exp = 'À droite du sommet x='+alpha+', f est '+(a>0?'croissante (a>0)':'décroissante (a<0)')+'.';
    } else if (t === 1) {
      var behavior2 = a > 0 ? 'décroissante' : 'croissante';
      ans = behavior2; choices = ['croissante','décroissante','constante'];
      q = '<div style="text-align:center;">Sur l\'intervalle ['+(alpha-4)+' ; '+alpha+'], f est…</div>' + svg;
      exp = 'À gauche du sommet x='+alpha+', f est '+(a>0?'décroissante':'croissante')+'.';
    } else {
      var extremType = a > 0 ? 'minimum' : 'maximum';
      ans = extremType; choices = ['maximum','minimum','ni maximum ni minimum'];
      q = '<div style="text-align:center;">La fonction représentée admet-elle un maximum, un minimum ou ni l\'un ni l\'autre ?</div>' + svg;
      exp = 'La parabole est ouverte vers le '+(a>0?'haut (minimum)':'bas (maximum)')+'.';
    }
    exs.push({question:q, answer:ans, choices:choices, explanation:exp, check:makeCheckStr(ans)});
  }
  return exs;
}

/* ── b1-22 : Factorisation x²−a² ────────────────────────────────── */
function genFactorization1ere() {
  var exs = [];
  for (var i = 0; i < 10; i++) {
    var a = rnd(1, 9);
    var a2 = a*a;
    var t = rnd(0, 1);
    var q, ans, exp;
    if (t === 0) {
      q = 'Factoriser : x² − ' + a2;
      ans = '(x − '+a+')(x + '+a+')';
      exp = 'Identité remarquable : x² − '+a2+' = (x − '+a+')(x + '+a+')';
    } else {
      ans = String(a2);
      q = '(x − '+a+')(x + '+a+') se développe en x² − ?';
      exp = '(x−'+a+')(x+'+a+') = x² − '+a2;
    }
    exs.push({question:q, answer:ans, explanation:exp, check:makeCheckStr(ans)});
  }
  return exs;
}

console.log('[AutoMaths] gen-bac1ere.js OK');
