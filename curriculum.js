/* AutoMaths – curriculum.js
   window.CURRICULUM garantit l'accès global dans le bundle standalone */

window.CURRICULUM = {
  'CAP': {
    'C1': {
      label: 'C1 – 1ère année',
      automatismes: [
        { id:'c1-1',  icon:'✕', name:'Multiplication par 10, 100, 0,1, 0,01', hint:'Décimaux', generator: genMultiplyPower },
        { id:'c1-2a', icon:'🧮', name:'Calcul mental – Débutant',             hint:'Sans retenue, tables simples', generator: genMentalEasy },
        { id:'c1-2b', icon:'🧮', name:'Calcul mental – Intermédiaire',        hint:'Avec retenues, tables complètes', generator: genMentalMedium },
        { id:'c1-2c', icon:'🧮', name:'Calcul mental – Expert',               hint:'Grands nombres, divisions', generator: genMentalExpert },
        { id:'c1-3',  icon:'±', name:'Règles des signes',                       hint:'Produits et quotients', generator: genSignRule },
        { id:'c1-4a', icon:'½', name:'Fractions – Niveau 1',                      hint:'Même dénominateur (+, −)', generator: genFractionEasyC1 },
        { id:'c1-4b', icon:'½', name:'Fractions – Niveau 2',                      hint:'Dénominateurs différents (+, −, ×)', generator: genFractionMediumC1 },
        { id:'c1-5',  icon:'%', name:'Formes d\'une proportion',                hint:'Fraction, décimal, pourcentage', generator: genProportionForms },
        { id:'c1-6',  icon:'↔', name:'Fraction → décimale',                    hint:'Division', generator: genFracToDecimal },
        { id:'c1-7',  icon:'<', name:'Comparaison de décimaux',                 hint:'< > =', generator: genCompareDecimals },
        { id:'c1-8',  icon:'≤', name:'Comparaison de rationnels',               hint:'< > = avec fractions', generator: genCompareRationals },
        { id:'c1-9',  icon:'🔤', name:'Transformation de formules',             hint:'Isoler une variable', generator: genFormulaTransform },
        { id:'c1-10', icon:'x', name:'Équations simples',                       hint:'ax = b, a + x = b', generator: genSimpleEquation },
        { id:'c1-11', icon:'≈', name:'Arrondi',                                 hint:'Dixième, centième, unité', generator: genRounding },
        { id:'c1-12', icon:'⏱', name:'Conversions de durées',                  hint:'h ↔ min', generator: genTimeConversion },
        { id:'c1-13', icon:'²', name:'Carré et racine carrée',                  hint:'n², √n', generator: genSquareRoot },
        { id:'c1-14', icon:'📏', name:'Conversions d\'unités',                  hint:'m, cm, kg, L…', generator: genUnitConversionAll },
        { id:'c1-15', icon:'📐', name:'Distance point-droite',                  hint:'Perpendiculaire', generator: genDistPointLine },
        { id:'c1-16', icon:'∥', name:'Distance droites parallèles',             hint:'Perpendiculaire commune', generator: genDistParallelLines },
      ]
    },
    'C2': {
      label: 'C2 – 2ème année',
      automatismes: [
        { id:'c2-1',  icon:'📊', name:'Effectif et fréquences',         hint:'Statistiques descriptives', generator: genEffectifFreq },
        { id:'c2-2',  icon:'x̄', name:'Moyenne d\'une série',           hint:'Σxᵢ / n', generator: genMeanStat },
        { id:'c2-3',  icon:'∝', name:'Quatrième proportionnelle',       hint:'Règle de trois', generator: genFourthProp },
        { id:'c2-4',  icon:'k', name:'Coefficient de proportionnalité', hint:'k = y / x', generator: genPropCoeff },
        { id:'c2-5',  icon:'%', name:'Pourcentage et valeur finale',    hint:'Augmentation, réduction', generator: genPercentageScaleC2 },
        { id:'c2-6',  icon:'⚖', name:'Équation ax + b = c',            hint:'1er degré', generator: genLinearEquationC2 },
        { id:'c2-7',  icon:'📍', name:'Coordonnées cartésiennes',       hint:'Abscisse, ordonnée', generator: genCartesianCoords },
        { id:'c2-8',  icon:'📈', name:'Lecture graphique',              hint:'Image, antécédent', generator: genFunctionReadingC2 },
        { id:'c2-9',  icon:'📐', name:'Concepts géométriques',          hint:'Médiatrice, distance', generator: genGeometricConceptC2 },
        { id:'c2-10', icon:'∥', name:'Droites parallèles et ⊥',        hint:'Relations', generator: genParallelPerpFig },
        { id:'c2-11', icon:'△', name:'Pythagore',                       hint:'Hypoténuse et cathètes', generator: genSegmentLength },
        { id:'c2-12', icon:'🔷', name:'Identification de figures',       hint:'Polygones et solides', generator: genFigureID },
      ]
    }
  },
  'BAC PRO': {
    '2nde': {
      label: '2nde Professionnelle',
      automatismes: [
        { id:'b2-1',  icon:'📊', name:'Fréquence',                        hint:'Statistiques', generator: genFrequency2nde },
        { id:'b2-2',  icon:'%', name:'Utilisation des pourcentages',      hint:'Augmentation, réduction', generator: genPercentageUse },
        { id:'b2-3',  icon:'↔', name:'Décimale/fraction → %',            hint:'Conversions', generator: genPercentageExpr },
        { id:'b2-4',  icon:'x̄', name:'Moyenne',                          hint:'Statistiques', generator: genMean2nde },
        { id:'b2-5',  icon:'¹⁰', name:'Puissances de 10',                hint:'Multiplication, division, puissance', generator: genPowerOf10 },
        { id:'b2-6',  icon:'⚗', name:'Notation scientifique',            hint:'a × 10^n', generator: genScientificNotation },
        { id:'b2-7',  icon:'<', name:'Comparaison de fractions',          hint:'< > =', generator: genCompareFractions2nde },
        { id:'b2-8',  icon:'½', name:'Opérations sur fractions',          hint:'+, −, ×', generator: genFractionOps2nde },
        { id:'b2-9',  icon:'()', name:'Développement, factorisation',     hint:'Algèbre', generator: genAlgebraOps2nde },
        { id:'b2-10', icon:'🔤', name:'Transformation de formules',       hint:'Physique-chimie', generator: genFormulaTransform2nde },
        { id:'b2-11', icon:'x',     name:'Équation ax + b = c',             hint:'1er degré', generator: genEquation2nde },
        { id:'b2-12', icon:'∷',     name:'Quatrième proportionnelle',       hint:'Règle de trois', generator: genFourthProp2nde },
        { id:'b2-13', icon:'🗺',    name:'Application d\'une échelle',      hint:'Plan ↔ réalité', generator: genScale2nde },
        { id:'b2-14', icon:'📍',    name:'Repérage dans le plan',           hint:'Coordonnées', generator: genReperage2nde },
        { id:'b2-15', icon:'f(x)',  name:'Image et antécédent',             hint:'Lecture graphique', generator: genFuncImageAnt },
        { id:'b2-16', icon:'📈',    name:'Résolution graphique',            hint:'f(x) = k', generator: genGraphEquation2nde },
        { id:'b2-17', icon:'📐',    name:'Conversions d\'unités',           hint:'m, cm, L, m²…', generator: genUnitConversion2nde },
        { id:'b2-18', icon:'△',     name:'Pythagore et Thalès',             hint:'Hypoténuse, rapport', generator: genPythagore },
        { id:'b2-19', icon:'≈',     name:'Arrondi et valeur approchée',     hint:'Unité, dixième', generator: genRounding2nde },
        { id:'b2-20', icon:'📏',    name:'Résultat dans l\'unité adaptée',  hint:'km, m, g, L…', generator: genUnitResult },
        { id:'b2-21', icon:'▭',     name:'Aire carré, rectangle, disque',   hint:'Formules usuelles', generator: genAreaCalc2nde },
        { id:'b2-22', icon:'🧩',    name:'Cohérence grandeur-unité',        hint:'Bon ordre de grandeur', generator: genUnitCoherence2nde },
        { id:'b2-23', icon:'⊾',     name:'Théorème de Thalès',             hint:'Rapport de longueurs', generator: genThales2nde },
      ]
    },
    '1ère': {
      label: '1ère Professionnelle',
      automatismes: [
        { id:'b1-1',  icon:'🎲', name:'Probabilité simple',            hint:'P(A) = m/n', generator: genProbability1ere },
        { id:'b1-2',  icon:'🌳', name:'Dénombrements',                 hint:'Principe multiplicatif', generator: genCounting1ere },
        { id:'b1-3',  icon:'📈', name:'Lecture de graphiques',         hint:'Histogramme, diagramme', generator: genGraphReading1ere },
        { id:'b1-4',  icon:'📊', name:'Indicateurs statistiques',      hint:'Moyenne, médiane, étendue', generator: genStatIndicators },
        { id:'b1-5',  icon:'x', name:'Équation 1er degré',             hint:'ax + b = c', generator: genEquation1ere },
        { id:'b1-6',  icon:'<', name:'Inéquation',                     hint:'ax + b < c', generator: genInequality1ere },
        { id:'b1-7',  icon:'kx', name:'Fonction linéaire',             hint:'f(x) = kx', generator: genLinearFunction },
        { id:'b1-8',  icon:'m', name:'Coefficient directeur',          hint:'Pente', generator: genSlope },
        { id:'b1-9',  icon:'∥', name:'Droites parallèles',             hint:'Pentes égales', generator: genParallelLines1ere },
        { id:'b1-10', icon:'💶', name:'Intérêt simple',                hint:'I = C × t × n', generator: genInteretSimple },
        { id:'b1-11', icon:'⭕', name:'Vocabulaire géométrique',       hint:'Cercle, disque…', generator: genGeomVocab },
        { id:'b1-12', icon:'🧊', name:'Reconnaissance des solides',    hint:'Cube, cône, cylindre…', generator: genSolidRecognition },
        { id:'b1-13', icon:'▭', name:'Aires',                          hint:'Triangle, carré, disque', generator: genAreaCalc1ere },
        { id:'b1-14', icon:'🧊', name:'Volumes',                       hint:'Cube, pavé, cylindre', generator: genVolumeCalc },
        { id:'b1-15', icon:'()', name:'Développement algébrique',      hint:'a(x+b), (x+b)(x+c)', generator: genDevelopment1ere },
        { id:'b1-16', icon:'📊', name:'Association graphique/données', hint:'Lire et comparer', generator: genDataAssoc1ere },
        { id:'b1-17', icon:'f(a)', name:'Calcul de f(a)',              hint:'Image d\'un nombre', generator: genFunctionValue1ere },
        { id:'b1-18', icon:'↿', name:'Tableau de variations',          hint:'Croissant, décroissant, extremum', generator: genVariationTable1ere },
        { id:'b1-19', icon:'∧', name:'Extremums (graphique)',           hint:'Max et min d\'une courbe', generator: genExtremums1ere },
        { id:'b1-20', icon:'⩱', name:'Résolution graphique f(x)=c',   hint:'Intersection courbe/droite', generator: genGraphSolve1ere },
        { id:'b1-21', icon:'f\'', name:'Courbe → tableau de variations', hint:'Croissant, décroissant', generator: genCurveVariation1ere },
        { id:'b1-22', icon:'x²', name:'Factorisation x²−a²',          hint:'(x−a)(x+a)', generator: genFactorization1ere },
      ]
    },
    'Terminale': {
      label: 'Terminale Professionnelle',
      automatismes: [
        { id:'bt-1',  icon:'🎲', name:'P(Ā) = 1 − P(A)',              hint:'Événement contraire', generator: genComplementProba },
        { id:'bt-2',  icon:'∪', name:'P(A∪B) événements incompatibles', hint:'P(A) + P(B)', generator: genUnionIncompat },
        { id:'bt-3',  icon:'∪', name:'P(A∪B) formule générale',       hint:'P(A)+P(B)−P(A∩B)', generator: genUnionProba },
        { id:'bt-4',  icon:'∩', name:'P(A∩B)',                         hint:'Intersection', generator: genIntersectProba },
        { id:'bt-5',  icon:'|', name:'Probabilité conditionnelle',     hint:'P(A|B) = P(A∩B)/P(B)', generator: genConditionalProba },
        { id:'bt-6',  icon:'∑', name:'Suites arithmétiques',           hint:'u_n = u₀ + n×r', generator: genArithSeq },
        { id:'bt-7',  icon:'∪', name:'Racines graphiques (2nd degré)',      hint:'x où f(x)=0', generator: genGraphicRoots },
        { id:'bt-8',  icon:'()²', name:'Forme factorisée',             hint:'a(x−x₁)(x−x₂)', generator: genFactorizedDeg2 },
        { id:'bt-9',  icon:"f'", name:'Dérivée d\'un polynôme',        hint:"f'(x)", generator: genDerivative },
        { id:'bt-10', icon:'→', name:'Somme de vecteurs',              hint:'Coordonnées', generator: genVectorSum },
        { id:'bt-11', icon:'k→', name:'Produit vecteur × scalaire',   hint:'k × <span class="vec">u</span>', generator: genVectorScalar },
        { id:'bt-12', icon:'📊', name:'Tableaux croisés et diagrammes', hint:'Exploitation de données', generator: genDataExploitation },
      ]
    }
  }
};

console.log('[AutoMaths] curriculum.js OK — clés:', Object.keys(window.CURRICULUM).join(', '));
