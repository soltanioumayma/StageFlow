# Livrables - Jour 1 Partie 2 : Analyse Technique & Setup Base de Données

## Checkpoint admission (Fin de Journée 1)

### 📋 Livrables attendus
- ✅ Diagramme de classe / Schéma entité-association
- ✅ Structure de base de données initialisée
- ✅ Connexion réussie IDE ↔ Base de données
- ✅ Code versionné dans Git

### 🔗 Liens vers les livrables

**Diagramme de classe PlantUML** :
```
../diagramme_classe.puml
```
Pour générer l'image : https://plantuml.com/online

**Schéma SQL complet** :
```
../../database/schema.sql
```

**Seeds (données de test)** :
```
../../database/seeds.sql
```

**Dépôt Git** :
```
https://github.com/[VOTRE_USERNAME]/StageFlow
```

### 🗄️ Structure de la base de données

8 tables relationnelles :
1. **rh_users** - Comptes RH
2. **candidatures** - Dossiers centraux
3. **candidats** - Infos personnelles
4. **formations** - Profil académique
5. **documents** - Fichiers uploadés
6. **notifications** - Emails envoyés
7. **rh_notes** - Notes internes RH
8. **audit_logs** - Traces d'audit

### 🔌 Connexion Base de Données

**Configuration** : `backend/src/config/database.js`
- Host : localhost
- Port : 5432
- Database : stageflow
- User : postgres
- Password : [voir .env]

### ✅ Tests de validation

```bash
# Test connexion PostgreSQL
psql -U postgres -d stageflow -c "SELECT version();"

# Test structure tables
psql -U postgres -d stageflow -c "\dt"

# Test seeds
psql -U postgres -d stageflow -f database/seeds.sql
```

### ✅ Critères de validation
- [ ] Diagramme de classe clair et complet
- [ ] Schéma SQL versionné dans Git
- [ ] Base de données créée et accessible
- [ ] Tables et contraintes correctes
- [ ] Connexion IDE ↔ BDD fonctionnelle
