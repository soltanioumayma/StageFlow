#  StageFlow - Livrables Complets du Challenge

##  Axe choisi : Flux de Travail (RIF-Stages)
**Formulaire de dépôt de candidature + Workflow de validation RH + Envoi de notification automatique**

---

##  Structure des livrables

```
livrables/
├── README.md                              # Ce fichier - Index des livrables
├── diagramme_classe.puml                  # Diagramme de classe PlantUML
├── jour1-partie1-ux-ui/                   # Jour 1 Matin : UX/UI Design
│   └── README.md                          # Liens Figma + Design System
├── jour1-partie2-bdd/                     # Jour 1 Après-midi : Base de données
│   └── README.md                          # Schéma SQL + Diagramme
├── jour2-partie3-frontend/                # Jour 2 Matin : Frontend
│   └── README.md                          # Code React + Démo
└── jour2-partie4-automatisation/          # Jour 2 Après-midi : Automatisation
    └── README.md                          # Emails + Sécurité + Soutenance
```

---

##  Liens Rapides vers les Livrables

### Jour 1 - Partie 1 : UX/UI Design & Maquettage (09h00-13h00)
 **[Voir les livrables UX/UI](./jour1-partie1-ux-ui/README.md)**
- Prototype Figma interactif
- Design System (couleurs, typographies, composants)
- Parcours utilisateur complet

### Jour 1 - Partie 2 : Analyse Technique & Base de Données (14h00-18h00)
 **[Voir les livrables BDD](./jour1-partie2-bdd/README.md)**
- Diagramme de classe PlantUML
- Schéma SQL complet (8 tables)
- Tests de validation

### Jour 2 - Partie 3 : Développement Frontend & Logique Métier (09h00-13h00)
 **[Voir les livrables Frontend](./jour2-partie3-frontend/README.md)**
- Code React + Node.js
- Formulaire multi-étapes
- Démo saisie de données

### Jour 2 - Partie 4 : Automatisation, Sécurité & Soutenance (14h00-18h00)
 **[Voir les livrables Automatisation](./jour2-partie4-automatisation/README.md)**
- Automatisation emails
- Sécurité multi-couches
- Démo finale + Argumentaire

---

##  Liens Externes à Configurer

### ⚠️ À compléter manuellement :

1. **Lien Figma Prototype** :
   - Ouvrir `jour1-partie1-ux-ui/README.md`
   - Remplacer `[INSÉRER LIEN FIGMA PARTAGÉ ICI]` par votre lien Figma
   - Exemple : `https://www.figma.com/file/xxxxx/StageFlow-Prototype`

2. **Lien GitHub** :
   - Remplacer `https://github.com/[VOTRE_USERNAME]/StageFlow` dans tous les README
   - Par votre véritable URL de dépôt GitHub

---

##  Diagramme de Classe

**Fichier PlantUML** : `diagramme_classe.puml`

Pour générer l'image du diagramme :
1. Aller sur https://plantuml.com/online
2. Copier le contenu de `diagramme_classe.puml`
3. Coller dans l'éditeur
4. Télécharger l'image (PNG/SVG)
5. Ajouter l'image dans ce dossier : `diagramme_classe.png`

---

##  Checkpoints d'Admission

###  Checkpoint 1 - Milieu Journée 1 (13h00)
**Démo** : Prototype Figma interactif
**Livrables** : Lien Figma + Design System
**Validation** : Parcours utilisateur complet cliquable

###  Checkpoint 2 - Fin Journée 1 (18h00)
**Tests** : Structure BDD + Connexion IDE ↔ BDD
**Livrables** : Diagramme de classe + Schéma SQL versionné Git
**Validation** : Tables créées, contraintes respectées

###  Checkpoint 3 - Milieu Journée 2 (13h00)
**Démo** : Saisie données réelles + Persistance BDD
**Livrables** : Code source sur Git
**Validation** : Formulaire fonctionnel, données stockées

###  Checkpoint 4 - Fin Journée 2 - Soutenance (18h00)
**Démo** : Parcours complet bout-en-bout
**Livrables** : Code final + Argumentaire technique
**Validation** : Automatisation fonctionne, sécurité validée

---

## 📋 Grille d'Évaluation

| Pilier | Points | Livrables associés |
|--------|--------|-------------------|
| Analyse & Conception | 20 | `jour1-partie2-bdd/` + `diagramme_classe.puml` |
| UX/UI Design | 25 | `jour1-partie1-ux-ui/` (Figma) |
| Code & Sécurité | 35 | `jour2-partie3-frontend/` + `jour2-partie4-automatisation/` |
| Fonctionnalité Métier | 10 | `jour2-partie4-automatisation/` (Emails) |
| Soft Skills & Pitch | 10 | Soutenance orale |

**Score estimé** : 83/100 (sans pitch)

---

## 🚀 Commandes de Démonstration

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev

# Base de données
psql -U postgres -d stageflow -f database/schema.sql
psql -U postgres -d stageflow -f database/seeds.sql
```

**URLs** :
- Frontend : http://localhost:3000
- Backend : http://localhost:5000
- API Health : http://localhost:5000/api/health

**Comptes démo** :
- RH : rh@grouperif.com / Admin1234!

---

## 📝 Argumentaire Technique

Document complet : `../docs/ARGUMENTAIRE_SOUTENANCE.md`

Points clés :
- Stack JavaScript unifiée (Node + React)
- Architecture MVC + Clean Code
- Sécurité JWT + Bcrypt + Validation
- Mobile First avec Tailwind CSS
- Automatisation emails avec Nodemailer

---

## ✅ Checklist Finale

Avant la soutenance, vérifier :

- [ ] Lien Figma configuré dans `jour1-partie1-ux-ui/README.md`
- [ ] Liens GitHub configurés dans tous les README
- [ ] Diagramme de classe généré (PNG/SVG)
- [ ] Base de données initialisée avec seeds
- [ ] Backend et frontend démarrent sans erreur
- [ ] Parcours complet testé (candidat → RH → email)
- [ ] Argumentaire technique relu et maîtrisé
- [ ] Démo préparée (5 minutes max)

---

**Bon courage pour la soutenance ! 🎓**
