-- ============================================================
-- STAGEFLOW – DATABASE SCHEMA (Student Edition)
-- Base de données : PostgreSQL
-- 6 tables simples, faciles à expliquer au jury
-- ============================================================


-- ============================================================
-- TABLE 1 : rh_users
-- QUI : Les recruteurs RH (Screens 09, 10, 11)
-- QUOI : Compte de connexion de l'espace recruteur
-- ============================================================
CREATE TABLE rh_users (
    id            SERIAL          PRIMARY KEY,
    email         VARCHAR(255)    NOT NULL UNIQUE,
    password_hash VARCHAR(255)    NOT NULL,        -- mot de passe hashé (bcrypt)
    nom           VARCHAR(100)    NOT NULL,
    prenom        VARCHAR(100)    NOT NULL,
    role          VARCHAR(20)     NOT NULL DEFAULT 'recruteur'
                    CHECK (role IN ('admin', 'recruteur')),
    created_at    TIMESTAMP       NOT NULL DEFAULT NOW()
);


-- ============================================================
-- TABLE 2 : candidatures
-- QUI : Le dossier de candidature (table centrale)
-- QUOI : Une ligne = une candidature. Contient le statut et
--        la référence visible par le candidat (ex: RIF-2026-0042)
-- ============================================================
CREATE TABLE candidatures (
    id            SERIAL          PRIMARY KEY,
    reference     VARCHAR(20)     NOT NULL UNIQUE,   -- ex: RIF-2026-0042
    status        VARCHAR(20)     NOT NULL DEFAULT 'en_attente'
                    CHECK (status IN ('en_attente', 'acceptee', 'refusee')),
    rgpd_accepted BOOLEAN         NOT NULL DEFAULT FALSE,
    submitted_at  TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP       NOT NULL DEFAULT NOW()
);


-- ============================================================
-- TABLE 3 : candidats
-- QUI : Le candidat (Screens 03 – Etape 1/4)
-- QUOI : Informations personnelles. Séparée de candidatures
--        pour respecter le RGPD (on peut supprimer les données
--        personnelles sans perdre le dossier)
-- ============================================================
CREATE TABLE candidats (
    id              SERIAL          PRIMARY KEY,
    candidature_id  INT             NOT NULL UNIQUE, -- 1 candidat = 1 candidature
    prenom          VARCHAR(100)    NOT NULL,
    nom             VARCHAR(100)    NOT NULL,
    email           VARCHAR(255)    NOT NULL,
    telephone       VARCHAR(20),

    FOREIGN KEY (candidature_id) REFERENCES candidatures(id) ON DELETE CASCADE
);


-- ============================================================
-- TABLE 4 : formations
-- QUI : Le profil académique (Screen 04 – Etape 2/4)
-- QUOI : Établissement, spécialité, niveau, type de stage,
--        liens GitHub et LinkedIn
-- ============================================================
CREATE TABLE formations (
    id              SERIAL          PRIMARY KEY,
    candidature_id  INT             NOT NULL UNIQUE, -- 1 formation = 1 candidature
    etablissement   VARCHAR(200)    NOT NULL,
    specialite      VARCHAR(200)    NOT NULL,
    niveau          VARCHAR(50)     NOT NULL
                      CHECK (niveau IN ('BTS', 'Licence', 'Master', 'Ingenieur', 'Doctorat', 'Autre')),
    type_stage      VARCHAR(50)     NOT NULL
                      CHECK (type_stage IN ('PFE', 'Stage_ete', 'Alternance', 'Observation', 'Autre')),
    lien_github     VARCHAR(500),
    lien_linkedin   VARCHAR(500),

    FOREIGN KEY (candidature_id) REFERENCES candidatures(id) ON DELETE CASCADE
);


-- ============================================================
-- TABLE 5 : documents
-- QUI : Les fichiers du dossier (Screen 05 – Etape 3/4)
-- QUOI : Chemin du CV uploadé + lettre de motivation
--        On stocke les métadonnées, pas le fichier lui-même
-- ============================================================
CREATE TABLE documents (
    id                  SERIAL          PRIMARY KEY,
    candidature_id      INT             NOT NULL UNIQUE, -- 1 document = 1 candidature
    cv_nom_original     VARCHAR(255),                    -- nom du fichier (ex: mon_cv.pdf)
    cv_chemin           VARCHAR(500),                    -- chemin dans le serveur/bucket
    cv_taille_octets    INT             CHECK (cv_taille_octets <= 5242880), -- max 5 Mo
    lettre_motivation   TEXT,

    FOREIGN KEY (candidature_id) REFERENCES candidatures(id) ON DELETE CASCADE
);


-- ============================================================
-- TABLE 6 : notifications
-- QUI : Les emails envoyés automatiquement (Axe 3 – automatisation)
-- QUOI : Chaque email envoyé est tracé ici (confirmation,
--        acceptation, refus). C'est le "journal des envois".
-- ============================================================
CREATE TABLE notifications (
    id              SERIAL          PRIMARY KEY,
    candidature_id  INT             NOT NULL,
    type_notif      VARCHAR(30)     NOT NULL
                      CHECK (type_notif IN ('confirmation', 'acceptation', 'refus')),
    email_dest      VARCHAR(255)    NOT NULL,
    sujet           VARCHAR(255)    NOT NULL,
    statut          VARCHAR(20)     NOT NULL DEFAULT 'envoye'
                      CHECK (statut IN ('envoye', 'echec')),
    envoye_le       TIMESTAMP       NOT NULL DEFAULT NOW(),

    FOREIGN KEY (candidature_id) REFERENCES candidatures(id) ON DELETE CASCADE
);


-- ============================================================
-- TABLE 7 : rh_notes
-- QUI : Notes privées des recruteurs RH
-- QUOI : Commentaires internes sur les candidatures (points forts,
--        raisons de refus, notes d'entretien, etc.)
-- ============================================================
CREATE TABLE rh_notes (
    id              SERIAL          PRIMARY KEY,
    candidature_id  INT             NOT NULL,
    rh_user_id      INT             NOT NULL,
    note            TEXT            NOT NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP       NOT NULL DEFAULT NOW(),

    FOREIGN KEY (candidature_id) REFERENCES candidatures(id) ON DELETE CASCADE,
    FOREIGN KEY (rh_user_id) REFERENCES rh_users(id) ON DELETE CASCADE
);


-- ============================================================
-- INDEX  : accélérer les recherches fréquentes
-- ============================================================
CREATE INDEX idx_candidatures_status    ON candidatures (status);
CREATE INDEX idx_candidatures_reference ON candidatures (reference);
CREATE INDEX idx_candidats_email        ON candidats (email);
CREATE INDEX idx_rh_notes_candidature   ON rh_notes (candidature_id);
CREATE INDEX idx_rh_notes_user          ON rh_notes (rh_user_id);


-- ============================================================
-- TABLE 8 : audit_logs
-- QUI : Système d'audit pour tracer toutes les actions RH
-- QUOI : Logs de sécurité et conformité pour entreprise
-- ============================================================
CREATE TABLE audit_logs (
    id            SERIAL          PRIMARY KEY,
    action        VARCHAR(50)     NOT NULL,
    user_id       INT             NOT NULL,
    user_email    VARCHAR(255)    NOT NULL,
    ip_address    VARCHAR(45),
    metadata      JSONB,
    created_at    TIMESTAMP       NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES rh_users(id) ON DELETE CASCADE
);

CREATE INDEX idx_audit_logs_user         ON audit_logs (user_id);
CREATE INDEX idx_audit_logs_action       ON audit_logs (action);
CREATE INDEX idx_audit_logs_created_at   ON audit_logs (created_at DESC);
