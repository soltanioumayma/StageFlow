# Livrables - Jour 2 Partie 3 : Développement Frontend & Logique Métier

## Checkpoint admission (Milieu de Journée 2)

### 📋 Livrables attendus
- ✅ Interface utilisateur dynamique codée
- ✅ Formulaire complexe avec contrôles de surface
- ✅ Persistance des données en base
- ✅ Code source poussé sur Git

### 🔗 Liens vers les livrables

**Code Frontend** :
```
https://github.com/[VOTRE_USERNAME]/StageFlow/tree/main/frontend
```

**Code Backend** :
```
https://github.com/[VOTRE_USERNAME]/StageFlow/tree/main/backend
```

**Dépôt Git complet** :
```
https://github.com/[VOTRE_USERNAME]/StageFlow
```

### 🎨 Fonctionnalités implémentées

#### Candidat
- Formulaire multi-étapes (4 étapes)
- Validation en temps réel
- Upload CV (PDF max 5Mo)
- Récapitulatif avant soumission
- Suivi de candidature par référence

#### RH
- Login JWT sécurisé
- Dashboard avec statistiques
- Liste candidatures avec filtres dynamiques
- Détail dossier complet
- Prise de décision (accepter/refuser)

### 🔧 Stack Technique

**Frontend** :
- React 18 + Vite
- Tailwind CSS (Mobile First)
- React Router v6
- React Hook Form
- Axios

**Backend** :
- Node.js + Express
- PostgreSQL
- JWT Auth
- Multer (upload)
- Nodemailer (emails)

### ✅ Démo - Saisie de données

```bash
# Lancer le backend
cd backend
npm run dev

# Lancer le frontend
cd frontend
npm run dev

# Accéder à l'app
http://localhost:3000
```

**Scénario de test** :
1. Remplir formulaire candidature (4 étapes)
2. Soumettre → Référence générée (ex: RIF-2026-0042)
3. Vérifier persistance en base :
   ```sql
   SELECT * FROM candidatures WHERE reference = 'RIF-2026-0042';
   ```

### ✅ Critères de validation
- [ ] Interface fidèle aux maquettes Figma
- [ ] Formulaire multi-étapes fonctionnel
- [ ] Données persistées en base
- [ ] Code propre et modulaire
- [ ] Mobile First responsive
- [ ] Code versionné sur Git
