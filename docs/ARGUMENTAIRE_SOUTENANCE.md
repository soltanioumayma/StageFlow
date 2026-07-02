# Argumentaire Technique - Soutenance StageFlow

## 📋 Présentation (5 minutes)

### 1. Introduction (30 secondes)
- **Nom du projet** : StageFlow
- **Client** : Groupe RIF
- **Axe choisi** : Flux de Travail (Formulaire de dépôt + Workflow RH + Notifications)
- **Objectif** : Digitaliser le processus de recrutement des stagiaires

### 2. Choix Techniques (1 minute)

#### Backend
- **Node.js + Express** : Stack JavaScript unifiée, rapidité de développement
- **PostgreSQL** : Base de données relationnelle robuste avec contraintes
- **Architecture MVC** : Séparation des concerns, code maintenable
- **JWT** : Authentification stateless sécurisée

#### Frontend
- **React + Vite** : Framework moderne, build ultra-rapide
- **Tailwind CSS** : Mobile First par design, responsive natif
- **React Router** : Navigation SPA fluide
- **Axios** : Client HTTP avec intercepteurs pour JWT

#### Pourquoi cette stack ?
- **Cohérence** : Full JavaScript (Node + React)
- **Performance** : Vite = HMR instantané, build optimisé
- **Productivité** : 2 jours = besoin d'outils rapides
- **Scalabilité** : Architecture modulaire extensible

### 3. Architecture & Clean Code (1 minute)

#### Backend Architecture
```
backend/
├── src/
│   ├── models/       # ORM-like pattern (6 models)
│   ├── controllers/  # Logique métier
│   ├── routes/       # Définition endpoints
│   ├── middleware/   # Auth, Upload, Validation
│   ├── services/     # Business logic (Email, Reference)
│   ├── utils/        # Helpers réutilisables
│   └── config/       # Configuration DB
```

#### Principes appliqués
- **DRY** : Utils réutilisables (validators, responseHandler, logger)
- **Single Responsibility** : Chaque classe/fonction a une responsabilité unique
- **Dependency Injection** : Services injectés dans controllers
- **Error Handling** : Centralisé avec responseHandler + logger
- **Validation** : express-validator + validators personnalisés

#### Frontend Architecture
```
frontend/
├── src/
│   ├── components/   # UI réutilisables (Button, Input, Card...)
│   ├── pages/        # Routes (6 pages)
│   ├── services/     # API calls (Axios + intercepteurs)
│   └── App.jsx       # Router principal
```

### 4. Sécurité (1 minute)

#### Backend
- **JWT** : Token avec expiration 8h
- **Bcrypt** : Hashage des mots de passe (salt rounds = 12)
- **Validation** : express-validator sur tous les inputs
- **SQL Injection** : Requêtes paramétrées (pg library)
- **File Upload** : Multer avec filtre MIME + limite 5Mo

#### Frontend
- **XSS Protection** : React escape automatique
- **CSRF** : SameSite cookies (à configurer en prod)
- **Token Storage** : localStorage (à améliorer avec httpOnly cookies)
- **Input Validation** : Validation côté client + serveur

### 5. Fonctionnalités Métier (1 minute)

#### Flux Candidat
1. **Formulaire 4 étapes** : UX progressive, réduction abandon
2. **Upload CV** : PDF max 5Mo, stockage sécurisé
3. **Référence unique** : Génération automatique (RIF-2026-XXXX)
4. **Email confirmation** : Notification automatique (Nodemailer)
5. **Suivi en temps réel** : Timeline visuelle du statut

#### Flux RH
1. **Dashboard** : Statistiques en temps réel
2. **Filtres dynamiques** : Par statut (en_attente, acceptee, refusee)
3. **Détail dossier** : Vue complète avec documents
4. **Prise de décision** : Accepter/Refuser avec email automatique
5. **Historique** : Notifications tracées en base

### 6. Mobile First & UX (30 secondes)

#### Design System
- **Couleurs** : Palette primaire bleue (accessibilité WCAG AA)
- **Typographie** : Sans-serif lisible sur mobile
- **Composants** : Touch-friendly (min 44px height)
- **Responsive** : Grid system adaptatif (mobile → desktop)

#### UX Optimisations
- **Progressive disclosure** : Formulaire multi-étapes
- **Feedback immédiat** : Validation en temps réel
- **Loading states** : Spinners sur actions async
- **Error handling** : Messages clairs et actionnables

### 7. Démo Script (30 secondes)

1. **Ouvrir frontend** : http://localhost:3000
2. **Remplir formulaire** : 4 étapes rapide
3. **Soumettre** : Montrer référence générée
4. **Suivi** : Consulter statut avec référence
5. **Login RH** : rh@grouperif.com / Admin1234!
6. **Dashboard** : Voir statistiques + liste
7. **Détail** : Ouvrir dossier + accepter
8. **Email** : Montrer notification envoyée

### 8. Points Forts & Améliorations (30 secondes)

#### Points forts
- ✅ Architecture clean et maintenable
- ✅ Sécurité multi-couches
- ✅ Mobile First responsive
- ✅ Automatisation complète (emails, références)
- ✅ Logging structuré pour debug

#### Améliorations futures
- 🔄 Tests unitaires (Jest)
- 🔄 Tests E2E (Playwright)
- 🔄 CI/CD (GitHub Actions)
- 🔄 Docker containerisation
- 🔄 httpOnly cookies pour JWT
- 🔄 WebSocket pour temps réel

### 9. Conclusion (10 secondes)

"StageFlow est un MVP fonctionnel qui répond parfaitement au besoin de digitalisation du recrutement chez Groupe RIF. L'architecture clean, la sécurité robuste et l'UX mobile-first en font une solution scalable et maintenable."

---

## 📊 Grille d'évaluation - Auto-évaluation

| Pilier | Points | Auto-évaluation | Justification |
|--------|--------|-----------------|---------------|
| Analyse & Conception | 20 | 18/20 | Schema SQL clair, models bien structurés |
| UX/UI Design | 25 | 23/25 | Mobile First, responsive, fidèle Figma |
| Code & Sécurité | 35 | 32/35 | Clean Code, validation, JWT, bcrypt |
| Fonctionnalité Métier | 10 | 10/10 | Automatisation emails, workflow complet |
| Soft Skills & Pitch | 10 | - | À évaluer pendant soutenance |

**Total estimé** : 83/100 (sans pitch)

---

## 🔧 Commandes pour la démo

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
# Exécuter database/schema.sql puis database/seeds.sql
```

**URLs** :
- Frontend : http://localhost:3000
- Backend : http://localhost:5000
- API Health : http://localhost:5000/api/health

**Comptes démo** :
- RH : rh@grouperif.com / Admin1234!
- Candidat : Créer via formulaire
