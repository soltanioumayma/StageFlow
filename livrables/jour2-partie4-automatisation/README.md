# Livrables - Jour 2 Partie 4 : Automatisation, Sécurité & Démo Finale

## Checkpoint admission (Fin de Journée 2 - Soutenance Finale)

### 📋 Livrables attendus
- ✅ Module d'automatisation (emails, PDF, notifications)
- ✅ Sécurité des entrées (validation, anti-injection)
- ✅ Démo parcours complet bout-en-bout
- ✅ Argumentaire technique justifiant les choix

### 🔗 Liens vers les livrables

**Code final complet** :
```
https://github.com/[VOTRE_USERNAME]/StageFlow
```

**Argumentaire technique** :
```
../../docs/ARGUMENTAIRE_SOUTENANCE.md
```

### ⚡ Automatisation implémentée

#### 1. Génération de référence unique
- Service : `backend/src/services/reference.service.js`
- Format : RIF-2026-XXXX (auto-incrémenté)
- Trigger : À la soumission de candidature

#### 2. Envoi d'emails automatiques
- Service : `backend/src/services/email.service.js`
- Types :
  - Confirmation de réception
  - Notification d'acceptation
  - Notification de refus
- Technologie : Nodemailer + SMTP

#### 3. Workflow de validation RH
- Endpoint : `PATCH /api/hr/candidatures/:id/decision`
- Actions : acceptee / refusee
- Effets :
  - Mise à jour statut candidature
  - Email automatique au candidat
  - Création notification en base
  - Log d'audit

### 🔒 Sécurité implémentée

#### Backend
- **Authentification** : JWT avec expiration 8h
- **Mots de passe** : Bcrypt (salt rounds = 12)
- **Validation inputs** : express-validator
- **SQL Injection** : Requêtes paramétrées (pg library)
- **Upload sécurisé** : Multer (filtre MIME, limite 5Mo)
- **Audit logs** : Traçabilité des actions RH

#### Frontend
- **XSS Protection** : React escape automatique
- **Validation client** : React Hook Form + validators
- **Token storage** : localStorage avec intercepteur Axios
- **CSRF** : SameSite cookies (configuré)

### 🎯 Démo Finale - Parcours complet

**Scénario bout-en-bout** :

1. **Candidat soumet dossier**
   - Formulaire 4 étapes
   - Upload CV
   - Soumission → Référence RIF-2026-0042 générée
   - Email confirmation envoyé automatiquement

2. **Candidat suit son dossier**
   - Page suivi avec référence
   - Statut visible en temps réel

3. **RH se connecte**
   - Login : rh@grouperif.com / Admin1234!
   - Dashboard avec statistiques

4. **RH consulte et décide**
   - Filtre par statut "en_attente"
   - Ouvre dossier RIF-2026-0042
   - Décide "acceptee"

5. **Automatisation déclenchée**
   - Statut mis à jour
   - Email acceptation envoyé
   - Notification tracée en base
   - Audit log créé

### 📊 Commandes pour la démo

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

### ✅ Critères de validation
- [ ] Automatisation fonctionne sans crash
- [ ] Emails envoyés correctement
- [ ] Sécurité inputs validée
- [ ] Parcours complet fonctionnel
- [ ] Argumentaire technique préparé
- [ ] Code final propre sur Git
