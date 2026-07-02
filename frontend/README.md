# StageFlow - Frontend

Application web responsive pour la gestion des candidatures de stage chez Groupe RIF.

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Builder pour la production
npm run build

# Prévisualiser le build de production
npm run preview
```

## 📱 Fonctionnalités

### Pour les candidats
- **Formulaire multi-étapes** : Soumission de candidature en 4 étapes
  - Étape 1 : Informations personnelles
  - Étape 2 : Formation et profil
  - Étape 3 : Documents (CV + lettre de motivation)
  - Étape 4 : Récapitulatif et validation RGPD
- **Suivi de candidature** : Consultation du statut en temps réel

### Pour les RH
- **Connexion sécurisée** : Authentification JWT
- **Dashboard** : Statistiques et liste des candidatures
- **Gestion des dossiers** : Consultation détaillée et prise de décision
- **Filtres** : Filtrage par statut

## 🛠️ Stack Technique

- **Framework** : React 18 + Vite
- **Styling** : Tailwind CSS (Mobile First)
- **Routing** : React Router v6
- **HTTP Client** : Axios
- **Forms** : React Hook Form

## 📁 Structure du projet

```
src/
├── components/      # Composants réutilisables
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Select.jsx
│   ├── Textarea.jsx
│   ├── Card.jsx
│   └── FileUpload.jsx
├── pages/          # Pages de l'application
│   ├── CandidatureForm.jsx
│   ├── SuiviCandidature.jsx
│   ├── Confirmation.jsx
│   ├── RhLogin.jsx
│   ├── RhDashboard.jsx
│   └── RhCandidatureDetail.jsx
├── services/       # Services API
│   ├── api.js
│   ├── candidatureService.js
│   ├── authService.js
│   └── hrService.js
├── App.jsx         # Router principal
├── main.jsx        # Point d'entrée
└── index.css       # Styles globaux + Tailwind
```

## 🔗 Configuration API

L'URL de l'API backend est configurée via la variable d'environnement `VITE_API_URL` dans le fichier `.env`.

```env
VITE_API_URL=http://localhost:5000/api
```

## 📱 Mobile First

L'application est conçue avec une approche Mobile First :
- Layout optimisé pour les écrans mobiles
- Design responsive adaptatif
- Touch-friendly interfaces
- Performance optimisée

## 🔐 Sécurité

- Token JWT stocké dans localStorage
- Intercepteur Axios pour l'authentification
- Redirection automatique sur token expiré
- Validation des inputs côté client

## 🧪 Tests

Pour tester l'application :

1. **Backend** : Assurez-vous que le backend tourne sur `http://localhost:5000`
2. **Frontend** : Lancez `npm run dev`
3. **Accès** : Ouvrez `http://localhost:3000`

### Comptes de démo RH
- Email : `rh@grouperif.com`
- Mot de passe : `Admin1234!`
