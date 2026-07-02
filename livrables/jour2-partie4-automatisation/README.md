# Livrables - Jour 2 Partie 4 : Automatisation, Sécurité & Démo Finale

## Checkpoint admission (Fin de Journée 2 - Présentation finale)

### Livrables attendus
- Module d'automatisation (emails, notifications)
- Sécurité des entrées (validation, anti-injection)
- Démo parcours complet bout-en-bout
- Argumentaire technique justifiant les choix

### Liens vers les livrables

**Code final complet** : https://github.com/soltanioumayma/StageFlow

**Argumentaire technique** : ../../docs/ARGUMENTAIRE_SOUTENANCE.md

### Automatisation implémentée

**Génération de référence unique** :
- Service : backend/src/services/reference.service.js
- Format : RIF-2026-XXXX (auto-incrémenté)
- Trigger : À la soumission de candidature

**Envoi d'emails automatiques** :
- Service : backend/src/services/email.service.js
- Types : Confirmation, Acceptation, Refus
- Technologie : Nodemailer + SMTP

**Workflow de validation RH** :
- Endpoint : PATCH /api/hr/candidatures/:id/decision
- Actions : acceptee / refusee
- Effets : Mise à jour statut + Email automatique + Notification en base

### Sécurité implémentée

**Backend** :
- Authentification : JWT avec expiration 8h
- Mots de passe : Bcrypt (salt rounds = 12)
- Validation inputs : express-validator
- SQL Injection : Requêtes paramétrées
- Upload sécurisé : Multer (filtre MIME, limite 5Mo)

**Frontend** :
- XSS Protection : React escape automatique
- Validation client : React Hook Form
- Token storage : localStorage avec intercepteur Axios

### Démo Finale - Parcours complet

**Scénario bout-en-bout** :
1. Candidat soumet dossier (4 étapes) → Référence générée → Email confirmation
2. Candidat suit son dossier avec référence
3. RH se connecte (rh@grouperif.com / Admin1234!) → Dashboard
4. RH consulte et décide (acceptee/refusee)
5. Automatisation déclenchée → Email envoyé + Notification tracée

### Commandes pour la démo

```bash
# Backend
cd backend && npm install && npm run dev

# Frontend
cd frontend && npm install && npm run dev

# Base de données
psql -U postgres -d stageflow -f database/schema.sql
psql -U postgres -d stageflow -f database/seeds.sql
```

URLs : Frontend http://localhost:3000 | Backend http://localhost:5000
Compte RH : rh@grouperif.com / Admin1234!

### Critères de validation
- [ ] Automatisation fonctionne sans crash
- [ ] Emails envoyés correctement
- [ ] Sécurité inputs validée
- [ ] Parcours complet fonctionnel
- [ ] Argumentaire technique préparé
- [ ] Code final propre sur Git
