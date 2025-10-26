# Recherche NPEC final — GitHub Pages (gratuit)

Ce dépôt contient une mini-application **100% statique** pour rechercher le **NPEC final** à partir d’un couple **RNCP + CPNE**.

- Front : `index.html` (aucun serveur requis)
- Données : `data/index.json` (clé = `RNCP|CPNE` *normalisés* → valeur = `NPEC final`)
- Outil de génération : `builder.html` (convertit votre CSV → `data/index.json` côté navigateur)

---

## 🚀 Publication sur GitHub Pages

1. Créez un dépôt sur GitHub (ex: `recherche-npec`).
2. Uploadez tous les fichiers de ce pack (le dossier `data` inclus).
3. Allez dans **Settings → Pages** :
   - *Build and deployment* → **Source: Deploy from a branch**
   - **Branch: main** / **/ (root)**
4. Attendez ~30 secondes, votre site sera disponible à l’URL :  
   `https://<votre-utilisateur>.github.io/<nom-du-depot>/`

> Astuce : Déposez un fichier `CNAME` à la racine si vous voulez un domaine personnalisé (optionnel).

---

## 🔄 Mettre à jour les données (3–4 fois/an)

Option A — **Builder dans le navigateur** (le plus simple)  
1. Ouvrez `builder.html` **depuis GitHub Pages** (ou en local).  
2. Sélectionnez votre CSV (séparateur virgule).  
3. Vérifiez / ajustez les index colonnes : **RNCP=0, CPNE=5, NPEC final=6**.  
4. Cliquez **Construire l’index** puis **Télécharger index.json**.  
5. Dans le dépôt, remplacez `data/index.json` par le nouveau (Commit).  
6. Rechargez votre site → c’est à jour.

Option B — **Automatique via GitHub**  
- Publiez votre CSV dans le repo et utilisez une action GitHub pour régénérer `data/index.json`. (bonus avancé, non nécessaire pour un usage 3–4x/an)

---

## 🧪 Tester en local

- Ouvrez simplement `index.html` dans votre navigateur.  
- Si le navigateur bloque `fetch` en `file://`, servez le dossier avec un petit serveur local (ex: `python -m http.server`).

---

## 🛠️ Format attendu du CSV

- Séparateur : **virgule** `,`
- 7 colonnes. Par défaut :
  - Colonne 0 : **RNCP**
  - Colonne 5 : **CPNE**
  - Colonne 6 : **NPEC final**
- Une **ligne d’en-tête** (cochez/décochez dans `builder.html` selon votre fichier)

---

## 📁 Structure du dépôt

```
/ (racine)
  index.html          # UI de recherche
  builder.html        # Générateur CSV -> data/index.json
  data/
    index.json        # Vos données (clé=RNCP|CPNE -> valeur=NPEC)
  .nojekyll           # Laisser GitHub Pages servir /data tel quel
  README.md
```

---

## 🧩 Personnalisation

- Normalisation : accents supprimés, comparaison insensible à la casse.
- Gestion des doublons : dernière occurrence gagnante (modifiable dans `builder.html`).
- UI : ajustez le style dans `index.html` (CSS en tête).

Bon déploiement ! 🎉
