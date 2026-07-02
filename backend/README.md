# StageFlow – Backend API

## Installation & Lancement

```bash
# 1. Aller dans le dossier backend
cd backend

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur en mode développement
npm run dev
```

Le serveur démarre sur : **http://localhost:5000**

---

## Routes de l'API

### Publiques (sans token)

| Méthode | URL | Description |
|---------|-----|-------------|
| `GET`  | `/api/health` | Vérifier que le serveur fonctionne |
| `POST` | `/api/auth/login` | Connexion RH |
| `POST` | `/api/candidatures` | Soumettre une candidature (multipart/form-data) |
| `GET`  | `/api/candidatures/suivi?reference=RIF-2026-0042&email=xxx` | Suivre son dossier |

### Protégées (JWT requis – Header: `Authorization: Bearer <token>`)

| Méthode | URL | Description |
|---------|-----|-------------|
| `GET`   | `/api/auth/me` | Profil de l'utilisateur connecté |
| `GET`   | `/api/hr/stats` | Statistiques du dashboard |
| `GET`   | `/api/hr/candidatures` | Liste toutes les candidatures |
| `GET`   | `/api/hr/candidatures?status=en_attente` | Filtre par statut |
| `GET`   | `/api/hr/candidatures/:id` | Détail d'un dossier |
| `PATCH` | `/api/hr/candidatures/:id/decision` | Valider ou refuser |

---

## Exemple – Soumettre une candidature

```bash
curl -X POST http://localhost:5000/api/candidatures \
  -F "prenom=Oumayma" \
  -F "nom=Soltani" \
  -F "email=oumayma@gmail.com" \
  -F "telephone=+21620000001" \
  -F "etablissement=Université Iset Rades" \
  -F "specialite=Informatique de gestion" \
  -F "niveau=Master" \
  -F "type_stage=PFE" \
  -F "lien_github=https://github.com/oumaymasoltani" \
  -F "lettre_motivation=Je souhaite rejoindre Groupe RIF..." \
  -F "rgpd_accepted=true" \
  -F "cv=@/chemin/vers/mon_cv.pdf"
```

## Exemple – Login RH

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rh@grouperif.com","password":"Admin1234!"}'
```

## Exemple – Valider une candidature

```bash
curl -X PATCH http://localhost:5000/api/hr/candidatures/1/decision \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"decision":"acceptee"}'
```
