# Livrables - Jour 2 Partie 3 : Développement Frontend & Logique Métier

## Liens vers les livrables

**Code Frontend** : https://github.com/soltanioumayma/StageFlow/tree/main/frontend

**Code Backend** : https://github.com/soltanioumayma/StageFlow/tree/main/backend

**Dépôt Git complet** : https://github.com/soltanioumayma/StageFlow

## Fonctionnalités implémentées

**Candidat** :
- Formulaire multi-étapes (4 étapes)
- Validation en temps réel
- Upload CV (PDF max 5Mo)
- Récapitulatif avant soumission
- Suivi de candidature par référence

**RH** :
- Login JWT sécurisé
- Dashboard avec statistiques
- Liste candidatures avec filtres dynamiques
- Détail dossier complet
- Prise de décision (accepter/refuser)

## Stack Technique

**Frontend** : React 18 + Vite + Tailwind CSS + React Router + React Hook Form + Axios

**Backend** : Node.js + Express + PostgreSQL + JWT Auth + Multer + Nodemailer

## Démo - Saisie de données

```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev

# Accès
http://localhost:3000
```

**Scénario de test** :
1. Remplir formulaire candidature (4 étapes)
2. Soumettre → Référence générée (ex: RIF-2026-0042)
3. Vérifier persistance en base : SELECT * FROM candidatures WHERE reference = 'RIF-2026-0042';
