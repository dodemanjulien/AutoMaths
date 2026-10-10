# Changelog AutoMaths

Toutes les modifications notables apportées au projet AutoMaths seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.5] - 2026-10-10

### Ajouté
- **Bouton « ABC – clavier du téléphone »** en bas du clavier virtuel : il masque le clavier virtuel et ouvre le clavier du téléphone pour écrire des lettres. Le bouton ⌨️ ramène le clavier virtuel. Le choix est conservé d'une question à l'autre.

### Corrigé
- Quand le clavier virtuel était masqué avec ⌨️, le clavier du téléphone ne s'ouvrait pas non plus : il n'y avait plus aucun moyen d'écrire sur téléphone.
- Pas de correction automatique ni de majuscule automatique dans le champ réponse.
- Badge de version du pied de page mis à jour.

## [1.4.4] - 2026-10-10

### Corrigé
- **Repérage dans le plan (BAC 2nde)** : les questions s'appuient maintenant sur un vrai repère gradué (de −7 à 7) avec le ou les points placés. Quatre types : lire l'abscisse, lire l'ordonnée, lire les coordonnées d'un point, lire les coordonnées d'un point parmi trois (pièges : x et y inversés, point symétrique). Les coordonnées s'écrivent (x ; y), avec ou sans parenthèses.
- **Rappel de cours** : ajout de la règle « abscisse sur l'axe horizontal, ordonnée sur l'axe vertical ».

## [1.4.3] - 2026-10-10

### Amélioré
- **Résultat dans l'unité adaptée (BAC 2nde)** : 46 situations au lieu de 6 (km, m, cm, mm, kg, g, mg, L, cL, mL, km/h, m/s, m², cm²).
- **Pas de répétition** : une même question ne revient pas avant 3 parties (mémorisé dans le navigateur de l'élève, fonction `pickFresh` réutilisable pour d'autres automatismes).

## [1.4.2] - 2026-10-10

### Corrigé
- **Mini-jeux, réponses « unité seule »** (ex : *Résultat dans l'unité adaptée*, BAC 2nde) : une bonne réponse comme « km » ou « m² » était comptée fausse. Elle est maintenant acceptée (QCM et saisie libre, majuscules indifférentes, m2 = m²).
- **Unités d'aire** : « cm² » n'est plus accepté à la place de « m² » (et inversement).

## [1.4.1] - 2026-10-10

### Corrigé
- **Pythagore (CAP C2 et BAC 2nde)** : les mesures des côtés sont de nouveau visibles sur la figure du triangle (texte clair sur fond sombre, « ? » en jaune ; texte foncé à l'impression).
- **index.html** : charge tous les scripts (images des thèmes, rappels de cours, mini-jeux) comme la version standalone.

### Ajouté
- **Mise en ligne sur GitHub Pages** : https://dodemanjulien.github.io/AutoMaths/ (fonctionne sur iPhone, contrairement à l'ouverture du fichier HTML en aperçu).

## [1.4.0] - 2026-06-14

### Ajouté
- **Bouton de masquage du clavier virtuel** : Ajout d'une touche `⌨️` dans le champ de réponse pour masquer/afficher le clavier virtuel à la demande.
- **Support des calculs avec puissances dans l'évaluation** : Possibilité de saisir des expressions avec puissances (ex: `10^5`, `1.5×10^-3`) directement évaluées de manière équivalente.
- **Nouvelles questions d'écriture scientifique** : Ajout d'un troisième type de question demandant de convertir des nombres sous forme d'écriture scientifique complète ($a \times 10^n$).
- **Touches puissances de 10** : Ajout des touches `10ⁿ` et `×10ⁿ` sur le clavier virtuel.

### Amélioré
- **Restauration de genSvgFigure** : Correction et restauration des tracés SVG des cylindres et cônes.
- **Algorithme anti-doublon global** : Plus de répétition de questions identiques au sein d'une même session de 10 questions.
- **Adaptation au support (Desktop vs Mobile)** :
  - Sur ordinateur : Affichage côte-à-côte sur deux colonnes (animation de jeu à gauche, fiche de travail à droite) et clavier replié par défaut.
  - Sur mobile : Affichage vertical ultra-compact et clavier déplié par défaut.
- **Sauvegarde et Emojis** : Correction du bug d'exportation de sauvegarde qui bloquait avec les caractères non-Latin-1 (comme les émojis ou caractères accentués).
- **Notation scientifique** : Remplacement du terme "Mantisse" par "nombre a" pour plus de clarté pour les élèves et affichage des puissances en exposant HTML au lieu de caret (`^`).

## [1.3.2] - 2026-05-20

### Amélioré
- **Résolution graphique f(x)=c (BAC 1ère)** :
  - **Solutions entières garanties** : Parabole et droite y=c conçues pour toujours se croiser sur des abscisses entières exactes.
  - **Flexibilité de saisie** : Validation insensible à l'ordre des solutions (ex: "-1 et 3" ou "3 et -1" sont acceptés de manière équivalente).
  - **Pédagogie rééquilibrée** : Distribution des types de questions corrigée pour n'avoir que ~10% de cas sans solution.
  - **Bouton Zoom** : Option 🔎 **Zoom** qui permet d'afficher en grand le graphique SVG au sein d'une fenêtre modale à fond flouté.
  - **Clarté visuelle** : Ajout de graduations tous les 2 unités et de points orange distincts aux intersections.
- **Tableaux de variations (BAC 1ère)** :
  - Remplacement de l'affichage textuel simple par de véritables **tableaux de variations générés dynamiquement en SVG**, avec flèches de variation bleues et alignement fluide des extremums.

## [1.3.1] - 2026-05-14

### Ajouté
- **Système de Game Over** pour les jeux avec des vies (Space Shooter 🚀 et RPG Battle ⚔️) :
  - Lorsque toutes les vies sont perdues pour la **première fois**, la question courante se réaffiche en **mode Bonus** (bordure dorée clignotante, badge 🧪 potion). Une bonne réponse restaure toutes les vies et le jeu continue.
  - Si la réponse bonus est **incorrecte** (ou si les vies tombent à zéro une deuxième fois), un overlay **GAME OVER** s'affiche avec animation, le score partiel, et deux boutons : **🔁 Réessayer** (relance la session) et **Quitter** (retour au menu des automatismes).


## [1.3.0] - 2026-05-14

### Ajouté
- **Rappels de cours** : Avant chaque automatisme, un écran intercalé affiche un rappel pédagogique court (2–4 règles clés + exemples concrets). Couvre les **74 automatismes** de tous les niveaux (CAP C1/C2, BAC PRO 2nde/1ère/Terminale). Les exemples de fractions utilisent l'affichage empilé. Bouton "Passer →" disponible pour les élèves qui n'en ont pas besoin.

## [1.2.3] - 2026-05-14

### Ajouté
- **Fractions CAP C1 – Deux niveaux de difficulté** : L'automatisme "Fractions" unique a été remplacé par deux entrées distinctes dans le curriculum :
  - **Niveau 1** (`c1-4a`) : Additions et soustractions avec le *même dénominateur* uniquement (ex : 2/5 + 1/5). Idéal pour introduire le concept.
  - **Niveau 2** (`c1-4b`) : Additions, soustractions et multiplications avec des *dénominateurs différents* (ex : 1/3 + 1/4). Passage à la mise au même dénominateur.

## [1.2.2] - 2026-05-14

### Amélioré
- **Mini-jeu Pizza Chef** :
  - Immersion visuelle accrue : au lieu d'un simple disque de couleur, le jeu affiche désormais de véritables images de parts de pizza générées par IA (une pizza délicieuse pour les bonnes réponses, et une pizza incongrue avec des ingrédients bizarres pour les erreurs).
  - Ajustement de l'humeur du client : le statut (ravi, satisfait, déçu) est dorénavant calculé de manière proportionnelle à l'avancement du jeu, permettant au client d'être positif dès la première bonne réponse au lieu d'être jugé sur le score final.

## [1.2.1] - 2026-05-11

### Amélioré
- **Fractions CAP C1 (Adaptation Pédagogique)** : Simplification de l'automatisme pour le rendre plus accessible aux élèves en difficulté. Suppression des soustractions et des divisions. Utilisation exclusive de dénominateurs très simples (2, 3, 4, 5, 6, 10). De plus, dans 50% des additions, les deux fractions ont désormais le même dénominateur.
- **Intégration Graphique IA** : Génération et intégration des 7 dernières icônes 3D thématiques pour les mini-jeux (Géométrie, Course, Casino, Mélodie, Surf, Archer, Banque). L'ensemble des 14 thèmes (fonds d'écran + icônes) est désormais 100% complet et intégré au jeu !

## [1.2.0] - 2026-05-10

### Ajouté
- **Calcul mental en 3 niveaux de difficulté** :
  - **Débutant** : Additions et soustractions sans retenue, tables de multiplication de 2 à 5.
  - **Intermédiaire** : Additions et soustractions avec retenues obligatoires, tables complètes (2 à 12).
  - **Expert** : Opérations à 3 chiffres, multiplications à deux chiffres, divisions exactes.
- **Système anti-doublons (`dedupe`)** : Fonction utilitaire garantissant 10 exercices uniques par session pour tous les générateurs.

### Amélioré
- **Fractions CAP C1** : Ajout des opérations de soustraction et de division en plus de l'addition et la multiplication. Pool de dénominateurs élargi (2 à 20, incluant 7, 9, 12, 15, 20). Résultats entiers affichés sans dénominateur inutile.
- **Fractions BAC 2nde** : Même enrichissement (dénominateurs diversifiés, soustraction avec vérification du signe, anti-doublons).
- **Affichage des fractions empilées** : Les fractions sont désormais affichées en format mathématique (numérateur au-dessus, barre horizontale, dénominateur en dessous) dans les questions, les réponses et le feedback.
- **Clavier virtuel : mode fraction** : Nouveau bouton `a/b` dans le clavier qui bascule vers un double champ de saisie (numérateur / dénominateur) avec barre de séparation visuelle. Navigation Tab entre les deux champs.

### Modifié
- Le curriculum CAP C1 passe de 16 à 18 automatismes (l'ancien "Calcul mental" unique est remplacé par 3 entrées distinctes).

## [1.1.0] - 2026-05-09

### Ajouté
- **Système de Gamification Complet** : 
  - Système d'XP (points d'expérience) avec passage de niveaux (Apprenti, Initié, Maître, Grand Maître, Légende).
  - Jauge de combo interactive qui augmente au fil des bonnes réponses consécutives.
  - Fenêtre modale de création de profil (pseudo du joueur enregistré localement).
- **Moteur Visuel et UI (Glassmorphism)** :
  - Refonte graphique totale utilisant des effets "glassmorphism" (flou d'arrière-plan, transparence, bordures subtiles).
  - Animations fluides CSS3 (boutons, barres d'XP, particules).
- **Images Haute Qualité "Nano Banana"** :
  - Intégration de fonds d'écran 3D vibrants pour 14 mini-jeux (convertis en Base64 pour le mode standalone).
  - Début de l'intégration des icônes 3D pour le menu principal (Fusée, Éclair, Pizza, etc.).
- **Nouveaux Mini-Jeux** :
  - Ajout des modes interactifs QCM générés automatiquement.
  - Thèmes : RPG Battle (scale), Tennis (target), Car Race (chart), Casino Roulette (dice), Space Shooter (rocket), Labo Scientifique (gears), etc.
- **Saisie Scientifique Renforcée** :
  - Nouveau clavier virtuel dynamique intégrant une rangée spécifique pour les unités de mesure (cm, m², kg, €, etc.).
  - Validation stricte des unités : une réponse correcte mathématiquement est refusée si l'unité est omise alors qu'elle est attendue.
  - Badge visuel "Unité requise" affiché lors des exercices nécessitant une unité.
- Pied de page avec la version officielle et le nom du créateur (Dodeman Julien).

### Modifié
- Le fichier `build.ps1` gère maintenant l'intégration des assets graphiques Base64 depuis `theme_assets.js` pour conserver l'aspect 100% hors-ligne (Standalone).
- L'algorithme de vérification (`chk` dans `minigame.js`) nettoie intelligemment les chaînes et normalise la casse et les espaces.
- Amélioration de l'expérience mobile (le clavier virtuel masque le clavier natif du téléphone pour plus de confort).

### Corrigé
- Résolution du problème d'équivalence fractionnaire : l'application comprend désormais qu'une réponse `1/2` équivaut à `0.5`.
- Stabilité accrue lors de la génération d'exercices depuis le Curriculum complet (CAP et Bac Pro).

---

*Développé avec passion pour l'enseignement professionnel.*
