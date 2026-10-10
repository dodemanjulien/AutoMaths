/* AutoMaths – lesson-hints.js : Rappels de cours courts par automatisme */
window.LESSON_HINTS = {

  /* ── CAP C1 ────────────────────────────────────────────────── */
  'c1-1': {
    title: 'Multiplication par 10, 100, 0,1…',
    rules: [
      '× 10 → déplace la virgule d\'<strong>1 rang à droite</strong>',
      '× 100 → déplace la virgule de <strong>2 rangs à droite</strong>',
      '× 0,1 → déplace la virgule d\'<strong>1 rang à gauche</strong>',
      '× 0,01 → déplace la virgule de <strong>2 rangs à gauche</strong>',
    ],
    examples: ['3,5 × 10 = 35', '3,5 × 0,1 = 0,35']
  },
  'c1-2a': {
    title: 'Calcul mental – Débutant',
    rules: [
      'Additions et soustractions <strong>sans retenue</strong> (chiffres s\'additionnent directement).',
      'Tables de multiplication de <strong>2 à 5</strong>.',
    ],
    examples: ['24 + 13 = 37', '3 × 4 = 12']
  },
  'c1-2b': {
    title: 'Calcul mental – Intermédiaire',
    rules: [
      'Additions et soustractions <strong>avec retenue</strong>.',
      'Tables complètes de <strong>2 à 12</strong>.',
    ],
    examples: ['47 + 35 = 82', '8 × 9 = 72']
  },
  'c1-2c': {
    title: 'Calcul mental – Expert',
    rules: [
      'Opérations sur <strong>grands nombres</strong> et divisions.',
      'Décompose : 348 + 215 = (300+200) + (48+15)',
    ],
    examples: ['124 × 3 = 372', '180 ÷ 12 = 15']
  },
  'c1-3': {
    title: 'Règles des signes',
    rules: [
      '<strong>+ × + = +</strong>',
      '<strong>− × − = +</strong>',
      '<strong>+ × − = −</strong>',
      'Idem pour la division.',
    ],
    examples: ['(−3) × (−4) = 12', '(−6) ÷ 2 = −3']
  },
  'c1-4a': {
    title: 'Fractions – Même dénominateur',
    rules: [
      'On additionne (ou soustrait) les <strong>numérateurs</strong>.',
      'Le <strong>dénominateur ne change pas</strong>.',
      'Simplifier si possible à la fin.',
    ],
    examples: ['2/5 + 1/5 = 3/5', '4/6 − 1/6 = 3/6 = 1/2']
  },
  'c1-4b': {
    title: 'Fractions – Dénominateurs différents',
    rules: [
      'Trouver le <strong>dénominateur commun</strong> (multiple des deux).',
      'Adapter chaque numérateur en conséquence.',
      'Puis additionner/soustraire les numérateurs.',
    ],
    examples: ['1/3 + 1/4 = 4/12 + 3/12 = 7/12', '1/2 × 2/3 = 2/6 = 1/3']
  },
  'c1-5': {
    title: 'Formes d\'une proportion',
    rules: [
      'Fraction ↔ Décimal : divise numérateur ÷ dénominateur.',
      'Décimal ↔ % : multiplie par 100.',
    ],
    examples: ['1/4 = 0,25 = 25 %', '0,3 = 30 %']
  },
  'c1-6': {
    title: 'Fraction → Décimale',
    rules: [
      'Divise le <strong>numérateur</strong> par le <strong>dénominateur</strong>.',
    ],
    examples: ['3/4 = 3 ÷ 4 = 0,75', '1/5 = 1 ÷ 5 = 0,2']
  },
  'c1-7': {
    title: 'Comparaison de décimaux',
    rules: [
      'Aligne les virgules, compare chiffre par chiffre <strong>de gauche à droite</strong>.',
    ],
    examples: ['1,3 > 1,29 (car 3 > 2 au dixième)']
  },
  'c1-8': {
    title: 'Comparaison de rationnels',
    rules: [
      'Réduis au <strong>même dénominateur</strong>, puis compare les numérateurs.',
      'Ou convertis en décimaux et compare.',
    ],
    examples: ['2/3 vs 3/4 → 8/12 vs 9/12 → 2/3 < 3/4']
  },
  'c1-9': {
    title: 'Transformation de formules',
    rules: [
      'Pour isoler une variable, <strong>fais la même opération des deux côtés</strong>.',
      'Passe un terme de l\'autre côté en changeant son signe.',
    ],
    examples: ['d = v × t → v = d ÷ t']
  },
  'c1-10': {
    title: 'Équations simples',
    rules: [
      '<strong>ax = b</strong> → x = b ÷ a',
      '<strong>a + x = b</strong> → x = b − a',
    ],
    examples: ['3x = 12 → x = 4', 'x + 5 = 9 → x = 4']
  },
  'c1-11': {
    title: 'Arrondi',
    rules: [
      'Repère le chiffre à arrondir, regarde le <strong>chiffre suivant</strong>.',
      '< 5 → on laisse, ≥ 5 → on augmente de 1.',
    ],
    examples: ['3,47 arrondi au dixième = 3,5', '2,34 arrondi au dixième = 2,3']
  },
  'c1-12': {
    title: 'Conversions de durées',
    rules: [
      '1 heure = <strong>60 minutes</strong>',
      'h → min : × 60 · min → h : ÷ 60',
    ],
    examples: ['1h30 = 90 min', '150 min = 2h30']
  },
  'c1-13': {
    title: 'Carré et racine carrée',
    rules: [
      'n² = n × n',
      '√n : quel nombre × lui-même donne n ?',
    ],
    examples: ['7² = 49', '√81 = 9']
  },
  'c1-14': {
    title: 'Conversions d\'unités',
    rules: [
      'Utilise le <strong>tableau de conversion</strong> (km, m, cm, mm…).',
      'Chaque rang = × 10 ou ÷ 10.',
    ],
    examples: ['3,5 m = 350 cm', '2,4 kg = 2400 g']
  },
  'c1-15': {
    title: 'Distance point-droite',
    rules: [
      'La distance est la <strong>perpendiculaire</strong> menée du point à la droite.',
    ],
    examples: ['Mesure le segment perpendiculaire entre le point et la droite.']
  },
  'c1-16': {
    title: 'Distance entre droites parallèles',
    rules: [
      'La distance est la longueur de la <strong>perpendiculaire commune</strong> aux deux droites.',
    ],
    examples: ['Trace un segment perpendiculaire qui relie les deux droites.']
  },

  /* ── CAP C2 ────────────────────────────────────────────────── */
  'c2-1': {
    title: 'Effectif et fréquences',
    rules: [
      'Fréquence = Effectif ÷ Effectif total',
      'Exprime en décimal ou en %.',
    ],
    examples: ['12 élèves sur 30 → 12/30 = 0,4 = 40 %']
  },
  'c2-2': {
    title: 'Moyenne d\'une série',
    rules: [
      'Moyenne = Somme des valeurs ÷ Nombre de valeurs',
    ],
    examples: ['(4 + 6 + 8 + 10) ÷ 4 = 28 ÷ 4 = 7']
  },
  'c2-3': {
    title: 'Quatrième proportionnelle',
    rules: [
      'Si a/b = c/d, alors <strong>d = b × c ÷ a</strong> (règle de trois).',
    ],
    examples: ['3/5 = 6/x → x = 5 × 6 ÷ 3 = 10']
  },
  'c2-4': {
    title: 'Coefficient de proportionnalité',
    rules: [
      '<strong>k = y ÷ x</strong> (valeur constante dans un tableau de proportionnalité).',
    ],
    examples: ['x=4, y=12 → k = 12 ÷ 4 = 3']
  },
  'c2-5': {
    title: 'Pourcentage et valeur finale',
    rules: [
      'Augmentation de t% : × (1 + t/100)',
      'Réduction de t% : × (1 − t/100)',
    ],
    examples: ['200 € + 15% = 200 × 1,15 = 230 €', '200 € − 20% = 200 × 0,8 = 160 €']
  },
  'c2-6': {
    title: 'Équation ax + b = c',
    rules: [
      'Isole x : ax = c − b, puis x = (c − b) ÷ a',
    ],
    examples: ['2x + 3 = 11 → 2x = 8 → x = 4']
  },
  'c2-7': {
    title: 'Coordonnées cartésiennes',
    rules: [
      'Un point M a pour coordonnées <strong>(abscisse ; ordonnée)</strong> → (x ; y).',
    ],
    examples: ['M(3 ; −2) : x=3, y=−2']
  },
  'c2-8': {
    title: 'Lecture graphique',
    rules: [
      '<strong>Image</strong> de a par f : lire f(a) sur l\'axe y.',
      '<strong>Antécédent</strong> de b : lire x tel que f(x) = b.',
    ],
    examples: ['f(2) = 5 (image de 2 est 5)']
  },
  'c2-9': {
    title: 'Concepts géométriques',
    rules: [
      '<strong>Médiatrice</strong> d\'un segment : droite perpendiculaire passant par son milieu.',
      'Distance AB : longueur du segment entre A et B.',
    ],
    examples: ['Si A(1;0) et B(5;0), milieu = (3;0)']
  },
  'c2-10': {
    title: 'Droites parallèles et perpendiculaires',
    rules: [
      'Deux droites sont <strong>parallèles</strong> si elles ont la même pente.',
      'Deux droites sont <strong>perpendiculaires</strong> si le produit de leurs pentes = −1.',
    ],
    examples: ['Pentes 2 et 2 → parallèles', 'Pentes 2 et −1/2 → perpendiculaires']
  },
  'c2-11': {
    title: 'Théorème de Pythagore',
    rules: [
      'Dans un triangle rectangle : <strong>c² = a² + b²</strong> (c = hypoténuse).',
    ],
    examples: ['a=3, b=4 → c = √(9+16) = √25 = 5']
  },
  'c2-12': {
    title: 'Identification de figures',
    rules: [
      'Reconnaître : carré, rectangle, losange, triangle, cercle, cube, cône, cylindre…',
    ],
    examples: ['4 côtés égaux + 4 angles droits = carré']
  },

  /* ── BAC PRO 2nde ──────────────────────────────────────────── */
  'b2-1': {
    title: 'Fréquence',
    rules: ['Fréquence = Effectif ÷ Effectif total (× 100 pour le %)'],
    examples: ['8 sur 40 → 8/40 = 0,2 = 20 %']
  },
  'b2-2': {
    title: 'Pourcentages',
    rules: [
      'Augmentation de t% : × (1 + t/100)',
      'Réduction de t% : × (1 − t/100)',
    ],
    examples: ['500 × 1,08 = 540 (augmentation 8%)']
  },
  'b2-3': {
    title: 'Décimale / fraction → %',
    rules: [
      'Décimal → % : × 100',
      'Fraction → % : (numérateur ÷ dénominateur) × 100',
    ],
    examples: ['0,35 = 35 %', '3/4 = 75 %']
  },
  'b2-4': {
    title: 'Moyenne',
    rules: ['Moyenne = Somme des valeurs ÷ Nombre de valeurs'],
    examples: ['(10+12+14) ÷ 3 = 36 ÷ 3 = 12']
  },
  'b2-5': {
    title: 'Puissances de 10',
    rules: [
      '10ⁿ × 10ᵐ = 10^(n+m)',
      '10ⁿ ÷ 10ᵐ = 10^(n−m)',
      '(10ⁿ)ᵐ = 10^(n×m)',
    ],
    examples: ['10³ × 10² = 10⁵', '10⁶ ÷ 10² = 10⁴']
  },
  'b2-6': {
    title: 'Notation scientifique',
    rules: [
      'Écrire sous la forme <strong>a × 10ⁿ</strong> avec 1 ≤ a < 10.',
    ],
    examples: ['3400 = 3,4 × 10³', '0,0056 = 5,6 × 10⁻³']
  },
  'b2-7': {
    title: 'Comparaison de fractions',
    rules: [
      'Réduis au même dénominateur, puis compare les numérateurs.',
    ],
    examples: ['3/4 vs 5/6 → 9/12 vs 10/12 → 3/4 < 5/6']
  },
  'b2-8': {
    title: 'Opérations sur fractions',
    rules: [
      'Addition/soustraction : même dénominateur obligatoire.',
      'Multiplication : numérateur × numérateur, dénominateur × dénominateur.',
    ],
    examples: ['1/3 + 1/4 = 7/12', '2/3 × 3/5 = 6/15 = 2/5']
  },
  'b2-9': {
    title: 'Développement et factorisation',
    rules: [
      '<strong>Développer</strong> : a(b+c) = ab + ac',
      '<strong>Factoriser</strong> : ab + ac = a(b+c)',
    ],
    examples: ['3(x+2) = 3x+6', '4x+12 = 4(x+3)']
  },
  'b2-10': {
    title: 'Transformation de formules',
    rules: [
      'Pour isoler une variable, applique la <strong>même opération des deux côtés</strong>.',
    ],
    examples: ['P = U × I → I = P ÷ U']
  },
  'b2-11': {
    title: 'Équation ax + b = c',
    rules: ['ax + b = c → ax = c − b → x = (c−b) ÷ a'],
    examples: ['3x − 5 = 10 → 3x = 15 → x = 5']
  },
  'b2-12': {
    title: 'Quatrième proportionnelle',
    rules: ['<strong>Règle de trois</strong> : Multiplier en diagonale puis diviser par le troisième nombre.'],
    examples: ['2 stylos = 5 € → 6 stylos = 6 × 5 ÷ 2 = 15 €']
  },
  'b2-13': {
    title: 'Échelle',
    rules: [
      'Réel → Plan : <strong>réel ÷ diviseur d\'échelle</strong>',
      'Plan → Réel : <strong>plan × diviseur d\'échelle</strong>'
    ],
    examples: ['Plan 1/100 : 5 cm sur plan = 5 × 100 = 500 cm réel']
  },
  'b2-14': {
    title: 'Repérage dans le plan',
    rules: [
      'Un point M a des coordonnées <strong>(x ; y)</strong> dans un repère.',
      'Milieu AB = ((xA+xB)/2 ; (yA+yB)/2)',
    ],
    examples: ['A(2;4) B(6;2) → Milieu = (4;3)']
  },
  'b2-15': {
    title: 'Image et antécédent',
    rules: [
      '<strong>Image</strong> de a : calculer f(a).',
      '<strong>Antécédent</strong> de b : résoudre f(x) = b.',
    ],
    examples: ['f(x)=2x+1 → f(3)=7 · f(x)=7 → x=3']
  },
  'b2-16': {
    title: 'Résolution graphique',
    rules: [
      'Tracer y = k (droite horizontale), lire l\'abscisse du point d\'intersection avec la courbe.',
    ],
    examples: ['f(x) = 3 → trouver x où la courbe coupe y=3']
  },
  'b2-17': {
    title: 'Conversions d\'unités',
    rules: [
      'Longueurs : 1 km = 1000 m · 1 m = 100 cm',
      'Aires (×100 par colonne) : 1 m² = 10 000 cm²',
      'Volumes (×1000 par colonne) : 1 m³ = 1000 L · 1 L = 1000 mL'
    ],
    examples: ['2,5 m² = 25 000 cm²', '0,3 m³ = 300 L']
  },
  'b2-18': {
    title: 'Pythagore',
    rules: ['Dans un triangle rectangle : <strong>hyp² = cath₁² + cath₂²</strong>'],
    examples: ['3²+4²=5² → triangle rectangle']
  },
  'b2-19': {
    title: 'Arrondi et valeur approchée',
    rules: [
      'Arrondi à l\'unité : regarder le premier chiffre après la virgule (≥5 → supérieur, <5 → inférieur).',
      'Valeur approchée par défaut : tronquer après la décimale demandée.',
      'Valeur approchée par excès : ajouter 1 à la décimale tronquée.'
    ],
    examples: ['7,64 arrondi à l\'unité = 8', '4,38 approché par défaut au dixième = 4,3']
  },
  'b2-20': {
    title: 'Résultat dans l\'unité adaptée',
    rules: ['Utilise le tableau de conversion. Chaque rang = ×10 ou ÷10.'],
    examples: ['4,5 km = 4500 m', '3200 g = 3,2 kg']
  },
  'b2-21': {
    title: 'Aires usuelles',
    rules: [
      'Carré : <strong>c²</strong>',
      'Rectangle : <strong>L × l</strong>',
      'Disque : <strong>π × r²</strong>',
    ],
    examples: ['Carré 5cm → 25 cm²', 'Disque r=3 → π×9 ≈ 28,3 cm²']
  },
  'b2-22': {
    title: 'Cohérence grandeur-unité',
    rules: ['Utilise ton bon sens et tes repères du quotidien pour choisir la bonne unité.'],
    examples: ['Hauteur d\'une porte : 2 m (pas 2 cm ni 2 km !)']
  },
  'b2-23': {
    title: 'Théorème de Thalès',
    rules: ['Si droites parallèles : rapports égaux <strong>AM/AB = AN/AC = MN/BC</strong>'],
    examples: ['AM=2, AB=6, AN=3 → AE = 3 × 6 ÷ 2 = 9']
  },

  /* ── BAC PRO 1ère ──────────────────────────────────────────── */
  'b1-1': {
    title: 'Probabilité simple',
    rules: ['P(A) = nombre de cas favorables ÷ nombre de cas possibles'],
    examples: ['Dé : P(pair) = 3/6 = 1/2']
  },
  'b1-2': {
    title: 'Dénombrements',
    rules: ['<strong>Principe multiplicatif</strong> : n choix puis m choix → n × m possibilités.'],
    examples: ['3 chemises × 4 pantalons = 12 tenues']
  },
  'b1-3': {
    title: 'Lecture de graphiques',
    rules: [
      'Histogramme : aire des barres = effectif.',
      'Repère l\'axe y (valeur) et x (classe).',
    ],
    examples: ['Barre entre 10 et 20, hauteur 5 → 5 individus']
  },
  'b1-4': {
    title: 'Indicateurs statistiques',
    rules: [
      '<strong>Moyenne</strong> = Σxᵢ / n',
      '<strong>Médiane</strong> : valeur centrale quand les données sont triées.',
      '<strong>Étendue</strong> = max − min',
    ],
    examples: ['Série 2,3,5,7,9 → médiane=5, étendue=7']
  },
  'b1-5': {
    title: 'Équation du 1er degré',
    rules: ['ax + b = c → x = (c − b) ÷ a'],
    examples: ['5x − 3 = 22 → 5x = 25 → x = 5']
  },
  'b1-6': {
    title: 'Inéquation',
    rules: [
      'ax + b < c → ax < c − b → x < (c−b)/a (attention : si on divise par un nombre <strong>négatif</strong>, on inverse le signe !)',
    ],
    examples: ['2x + 1 < 7 → x < 3']
  },
  'b1-7': {
    title: 'Fonction linéaire',
    rules: [
      'f(x) = <strong>kx</strong> : droite passant par l\'origine.',
      'k = pente = f(1).',
    ],
    examples: ['f(x) = 3x → f(4) = 12']
  },
  'b1-8': {
    title: 'Coefficient directeur (pente)',
    rules: ['m = (yB − yA) ÷ (xB − xA)'],
    examples: ['A(1;2) B(3;8) → m = (8−2)/(3−1) = 3']
  },
  'b1-9': {
    title: 'Droites parallèles',
    rules: ['Deux droites sont parallèles si et seulement si elles ont la <strong>même pente</strong>.'],
    examples: ['y=3x+1 et y=3x−5 sont parallèles']
  },
  'b1-10': {
    title: 'Intérêt simple',
    rules: ['<strong>I = C × t × n</strong> (C=capital, t=taux, n=durée en années)'],
    examples: ['1000 € à 3% pendant 2 ans → I = 1000 × 0,03 × 2 = 60 €']
  },
  'b1-11': {
    title: 'Vocabulaire géométrique',
    rules: [
      'Cercle : ligne courbe fermée.',
      'Disque : surface intérieure.',
      'Rayon, diamètre, corde, arc.',
    ],
    examples: ['Diamètre = 2 × rayon']
  },
  'b1-12': {
    title: 'Reconnaissance des solides',
    rules: [
      'Cube : 6 faces carrées.',
      'Pavé droit : 6 faces rectangulaires.',
      'Cylindre : 2 bases circulaires + surface latérale.',
    ],
    examples: ['Boîte de conserve → cylindre']
  },
  'b1-13': {
    title: 'Aires',
    rules: [
      'Triangle : <strong>base × hauteur ÷ 2</strong>',
      'Carré : <strong>c²</strong>  ·  Rectangle : <strong>L × l</strong>',
      'Disque : <strong>π × r²</strong>',
    ],
    examples: ['Triangle b=6, h=4 → Aire = 12']
  },
  'b1-14': {
    title: 'Volumes',
    rules: [
      'Cube : <strong>c³</strong>',
      'Pavé : <strong>L × l × h</strong>',
      'Cylindre : <strong>π × r² × h</strong>',
    ],
    examples: ['Cylindre r=2, h=5 → V = π×4×5 ≈ 62,8']
  },
  'b1-15': {
    title: 'Développement algébrique',
    rules: [
      'a(x+b) = ax + ab',
      '(x+a)(x+b) = x² + (a+b)x + ab',
    ],
    examples: ['(x+2)(x+3) = x²+5x+6']
  },
  'b1-16': {
    title: 'Lire et comparer des données',
    rules: ['Repère la plus grande (ou plus petite) valeur dans un tableau ou graphique.'],
    examples: ['A=5, B=3, C=8, D=2 → Max = C ; Min = D']
  },
  'b1-17': {
    title: 'Calculer f(a)',
    rules: ['Remplace <strong>x</strong> par la valeur donnée dans l\'expression de f(x).'],
    examples: ['f(x)=2x+3, f(4) = 2×4+3 = 11']
  },
  'b1-18': {
    title: 'Tableau de variations',
    rules: [
      '↗ = f est <strong>croissante</strong> sur cet intervalle.',
      '↘ = f est <strong>décroissante</strong> sur cet intervalle.',
      'Croît puis décroît → <strong>maximum</strong>. Décroît puis croît → <strong>minimum</strong>.',
    ],
    examples: ['f↗ sur [-5;2] puis f↘ sur [2;6] → maximum en x=2']
  },
  'b1-19': {
    title: 'Extremums d\'une courbe',
    rules: [
      'Le <strong>maximum</strong> est le point le plus haut de la courbe (sur l\'intervalle).',
      'Le <strong>minimum</strong> est le point le plus bas de la courbe (sur l\'intervalle).',
    ],
    examples: ['Parabole avec sommet (3 ; −2) → minimum = −2 en x = 3']
  },
  'b1-20': {
    title: 'Résolution graphique f(x)=c',
    rules: [
      'Trace la droite horizontale y = c.',
      'Les solutions sont les <strong>abscisses</strong> des points d\'intersection.',
    ],
    examples: ['f(x)=1 : la droite y=1 coupe la courbe en x=−2 et x=3']
  },
  'b1-21': {
    title: 'Courbe → tableau de variations',
    rules: [
      'Si la courbe monte, f est <strong>croissante</strong>.',
      'Si la courbe descend, f est <strong>décroissante</strong>.',
    ],
    examples: ['Parabole ∪ : décroissante puis croissante → minimum au sommet']
  },
  'b1-22': {
    title: 'Factorisation x²−a²',
    rules: ['<strong>x² − a² = (x − a)(x + a)</strong>'],
    examples: ['x² − 9 = (x − 3)(x + 3)']
  },

  /* ── BAC PRO Terminale ─────────────────────────────────────── */
  'bt-1': {
    title: 'Événement contraire',
    rules: ['<strong>P(Ā) = 1 − P(A)</strong>'],
    examples: ['P(A)=0,3 → P(Ā)=0,7']
  },
  'bt-2': {
    title: 'P(A∪B) – événements incompatibles',
    rules: ['Si A et B incompatibles : <strong>P(A∪B) = P(A) + P(B)</strong>'],
    examples: ['P(A)=0,2 P(B)=0,3 → P(A∪B)=0,5']
  },
  'bt-3': {
    title: 'P(A∪B) – formule générale',
    rules: ['<strong>P(A∪B) = P(A) + P(B) − P(A∩B)</strong>'],
    examples: ['P(A)=0,5 P(B)=0,4 P(A∩B)=0,2 → P(A∪B)=0,7']
  },
  'bt-4': {
    title: 'Probabilité de l\'intersection',
    rules: ['<strong>P(A∩B) = P(A) + P(B) − P(A∪B)</strong>'],
    examples: ['P(A)=0,6 P(B)=0,5 P(A∪B)=0,8 → P(A∩B)=0,3']
  },
  'bt-5': {
    title: 'Probabilité conditionnelle',
    rules: ['<strong>P(A|B) = P(A∩B) ÷ P(B)</strong>'],
    examples: ['P(A∩B)=0,2 P(B)=0,4 → P(A|B)=0,5']
  },
  'bt-6': {
    title: 'Suites arithmétiques',
    rules: [
      '<strong>uₙ = u₀ + n × r</strong> (r = raison)',
      'Chaque terme = terme précédent + r',
    ],
    examples: ['u₀=3, r=5 → u₄=3+4×5=23']
  },
  'bt-7': {
    title: 'Racines graphiques (2nd degré)',
    rules: [
      'Les racines sont les <strong>abscisses</strong> des points d\'intersection de la parabole avec l\'axe horizontal.',
      'Si elle ne coupe pas l\'axe, il n\'y a <strong>aucune</strong> racine.',
    ],
    examples: ['Coupe en x=−2 et x=3 → racines : −2 et 3']
  },
  'bt-8': {
    title: 'Forme factorisée',
    rules: [
      'Si x₁ et x₂ sont racines : <strong>a(x−x₁)(x−x₂)</strong>',
    ],
    examples: ['x²−5x+6 = (x−2)(x−3)']
  },
  'bt-9': {
    title: 'Dérivée d\'un polynôme',
    rules: [
      '(xⁿ)\' = n·xⁿ⁻¹',
      '(ax+b)\' = a',
      '(u+v)\' = u\' + v\'',
    ],
    examples: ['f(x)=3x²+2x → f\'(x)=6x+2']
  },
  'bt-10': {
    title: 'Somme de vecteurs',
    rules: [
      'Ajoute les coordonnées : <strong><span class="vec">u</span>(a;b) + <span class="vec">v</span>(c;d) = (a+c ; b+d)</strong>',
    ],
    examples: ['<span class="vec">u</span>(2;3) + <span class="vec">v</span>(1;−1) = (3;2)']
  },
  'bt-11': {
    title: 'Produit vecteur × scalaire',
    rules: ['<strong>k × <span class="vec">u</span>(a;b) = (ka ; kb)</strong>'],
    examples: ['3 × <span class="vec">u</span>(2;−1) = (6;−3)']
  },
  'bt-12': {
    title: 'Tableaux et diagrammes',
    rules: [
      '<strong>Tableau croisé</strong> : Le Total d\'une ligne (ou colonne) est la somme de ses cases.',
      '<strong>Diagramme</strong> : Lis la hauteur de la barre ou la part correspondante.'
    ],
    examples: ['Si Total = 100 et Filles = 60, alors Garçons = 100 − 60 = 40']
  }
};

console.log('[AutoMaths] lesson-hints.js OK — ' + Object.keys(window.LESSON_HINTS).length + ' rappels chargés.');
