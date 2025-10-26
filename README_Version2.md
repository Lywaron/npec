```markdown
# Recherche fichier Excel/CSV — NPEC

But : fournir une page web minimale qui permet de charger un fichier Excel (.xlsx, .xls, .xlsb) ou CSV (local ou depuis le même dépôt) et de rechercher une information en combinant deux critères.

Fichiers fournis :
- `index.html` : page web principale (inclut SheetJS et PapaParse via CDN).
- `style.css` : styles minimalistes.
- `app.js` : logique JavaScript pour parser Excel et CSV puis filtrer par deux colonnes.
- (Votre fichier) `Referentiel - Copie.xlsx` ou `Referentiel - Copie.csv` doit être placé à la racine du dépôt si vous voulez l'obtenir via le bouton "Charger Referentiel - Copie.xlsx".

Formats supportés :
- Excel : .xlsx, .xls, .xlsb (lecture avec SheetJS)
- CSV : .csv (parsing avec PapaParse)

Utilisation :
1. Déposez votre fichier local dans la zone (ou drag & drop), ou cliquez sur "Charger Referentiel - Copie.xlsx" si le fichier est présent à la racine du dépôt.
   - Le bouton tente d'abord Referentiel - Copie.xlsx puis fallback sur .xls/.xlsb/.csv.
2. Choisissez les deux colonnes à utiliser comme critères (les listes déroulantes sont peuplées automatiquement après chargement).
3. Entrez les valeurs recherchées dans les champs, puis cliquez sur "Rechercher".
   - Par défaut la recherche est "contient" (insensible à la casse). Cochez "Recherche exacte" pour une égalité stricte.
4. Les résultats s'affichent sous forme de tableau et le nombre de lignes retournées est indiqué.

Déploiement (GitHub Pages) :
- Poussez ces fichiers dans la branche `main` (ou `gh-pages`) de votre dépôt.
- Placez votre fichier `Referentiel - Copie.xlsx` (ou .csv) à la racine si vous souhaitez le charger via le bouton "Charger Referentiel - Copie.xlsx".
- Activez GitHub Pages dans les paramètres du dépôt (Settings → Pages) en choisissant la branche contenant `index.html`.
- La page sera disponible à l'URL GitHub Pages fournie par GitHub.

Remarques :
- Le script prend par défaut la première feuille Excel du fichier. Si vous souhaitez choisir une autre feuille, je peux ajouter un sélecteur de feuille.
- Les cellules vides sont converties en chaînes vides pour éviter les valeurs undefined.
- Si vous voulez uniquement accepter Excel et supprimer PapaParse, dites-le et j'enlèverai le support CSV pour alléger la page.

```