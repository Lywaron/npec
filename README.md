```markdown
# Recherche CSV simple — NPEC

But : fournir une page web minimale qui permet de charger un fichier CSV (local ou depuis le même dépôt) et de rechercher une information en combinant deux critères.

Fichiers fournis :
- `index.html` : page web principale.
- `style.css` : styles minimalistes.
- `app.js` : logique JavaScript (utilise PapaParse pour parser le CSV côté client).
- (Votre fichier) `Referentiel - Copie.csv` doit être placé à la racine du dépôt si vous voulez l'obtenir via le bouton "Charger Referentiel - Copie.csv".

Utilisation :
1. Déposez votre fichier CSV local dans la zone de fichier, ou cliquez sur "Charger Referentiel - Copie.csv" si le fichier est dans le dépôt.
2. Choisissez les deux colonnes à utiliser comme critères (les listes déroulantes sont peuplées automatiquement après chargement).
3. Entrez les valeurs recherchées dans les champs, puis cliquez sur "Rechercher".
   - Par défaut la recherche est "contient" (insensible à la casse). Cochez "Recherche exacte" pour une égalité stricte.
4. Les résultats s'affichent sous forme de tableau et le nombre de lignes retournées est indiqué.

Déploiement (GitHub Pages) :
- Poussez ces fichiers dans la branche `main` (ou `gh-pages`) de votre dépôt.
- Activez GitHub Pages dans les paramètres du dépôt (Settings → Pages) en choisissant la branche contenant `index.html`.
- La page sera disponible à l'URL GitHub Pages fournie par GitHub.

Remarques :
- Le script utilise PapaParse (CDN) pour un parsing robuste (gestion des guillemets, champs vides, etc.).
- L'interface laisse libre choix des deux colonnes à combiner : vous n'êtes pas obligé de préciser d'avance lesquelles. Cela vous permet d'explorer la table (ex : RNCP & CPNE, ou RNCP & NPEC final, etc.).

Si vous voulez, je peux :
- Adapter la page pour faire une recherche par correspondance exacte sur des colonnes précises par défaut (indiquez lesquelles).
- Ajouter une exportation des résultats en CSV.
- Rendre la recherche plus avancée (OR, comparateurs numériques, regex).
```