# StageFlow

Système de gestion des candidatures de stage pour le Groupe RIF.

## Vue d'ensemble

StageFlow est une application web moderne permettant aux candidats de déposer leurs candidatures de stage en ligne et aux équipes RH de gérer le processus de validation de manière efficace.

## Fonctionnalités

### Candidat
- Formulaire de candidature multi-étapes
- Upload de CV (PDF)
- Suivi de candidature par référence unique
- Notifications automatiques par email

### RH
- Dashboard avec statistiques en temps réel
- Gestion des candidatures (acceptation/refus)
- Filtres dynamiques par statut
- Workflow de validation automatisé

## Stack Technique

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router v6
- React Hook Form
- Axios

### Backend
- Node.js
- Express
- PostgreSQL
- JWT Authentication
- Nodemailer
- Multer

## Installation

### Prérequis
- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### Base de données
```bash
# Créer la base de données
createdb stageflow

# Exécuter le schéma
psql -U postgres -d stageflow -f database/schema.sql

# Exécuter les données de test
psql -U postgres -d stageflow -f database/seeds.sql
```

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Configurer les variables d'environnement
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Liens

- **Prototype Figma** : https://www.figma.com/design/dluMOeZUnDCpIdp2Oyxyyn/StageFlow?node-id=1-2&t=mTq5W3fbKzunZngk-1
- **Dépôt GitHub** : https://github.com/soltanioumayma/StageFlow

## Sécurité

- Authentification JWT avec expiration
- Hachage des mots de passe avec Bcrypt
- Validation des entrées (express-validator)
- Protection contre les injections SQL
- Upload sécurisé de fichiers

## Auteur

Développé dans le cadre du challenge technique Dev Web & Mobile - Groupe RIF.
