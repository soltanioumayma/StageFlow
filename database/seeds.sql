-- ============================================================
-- STAGEFLOW – DONNÉES DE DÉMO (seeds.sql)
-- À exécuter APRÈS schema.sql
-- Données fictives pour la démo et le jury
-- ============================================================


-- ============================================================
-- 1. Utilisateurs RH
-- Mot de passe pour tous : Admin1234!  (hashé avec bcrypt)
-- ============================================================
INSERT INTO rh_users (email, password_hash, nom, prenom, role)
VALUES
    (
        'rh@grouperif.com',
        '$2b$12$KIX9l7CZTzY6FkHq5NrXNeXcWxK3z8GcNH2/JqVS3A.J7V6dOmRyC',
        'Dupont',
        'Marie',
        'admin'
    ),
    (
        'recruteur@grouperif.com',
        '$2b$12$KIX9l7CZTzY6FkHq5NrXNeXcWxK3z8GcNH2/JqVS3A.J7V6dOmRyC',
        'Martin',
        'Jean',
        'recruteur'
    );


-- ============================================================
-- 2. Candidatures (dossiers)
-- ============================================================
INSERT INTO candidatures (reference, status, rgpd_accepted, submitted_at)
VALUES
    ('RIF-2026-0001', 'en_attente', TRUE, '2026-07-01 09:00:00'),
    ('RIF-2026-0002', 'en_attente', TRUE, '2026-07-01 10:00:00'),
    ('RIF-2026-0003', 'acceptee',   TRUE, '2026-06-30 14:00:00');


-- ============================================================
-- 3. Candidats (infos personnelles)
-- Les IDs de candidature sont 1, 2, 3 (SERIAL auto-incrémenté)
-- ============================================================
INSERT INTO candidats (candidature_id, prenom, nom, email, telephone)
VALUES
    (1, 'Oumayma', 'Soltani', 'oumayma.soltani@gmail.com', '+216 20 000 001'),
    (2, 'Malek',   'Soltani', 'malek.soltani@gmail.com',   '+216 20 000 002'),
    (3, 'Maryem',  'Soltani', 'maryem.soltani@gmail.com',  '+216 20 000 003');


-- ============================================================
-- 4. Formations (profil académique)
-- ============================================================
INSERT INTO formations (candidature_id, etablissement, specialite, niveau, type_stage, lien_github, lien_linkedin)
VALUES
    (
        1,
        'Université Iset Rades',
        'Informatique de gestion',
        'Master',
        'PFE',
        'https://github.com/oumaymasoltani',
        'https://linkedin.com/in/oumaymasoltani'
    ),
    (
        2,
        'Université Iset Rades',
        'Informatique industrielle',
        'Licence',
        'Stage_ete',
        NULL,
        NULL
    ),
    (
        3,
        'Université Iset Rades',
        'Data Science',
        'Master',
        'PFE',
        'https://github.com/maryemsoltani',
        'https://linkedin.com/in/maryemsoltani'
    );


-- ============================================================
-- 5. Documents (CV + lettre de motivation)
-- ============================================================
INSERT INTO documents (candidature_id, cv_nom_original, cv_chemin, cv_taille_octets, lettre_motivation)
VALUES
    (
        1,
        'soltani_oumayma_cv.pdf',
        'uploads/cvs/1/soltani_oumayma_cv.pdf',
        512000,
        'Je souhaite rejoindre Groupe RIF pour développer mes compétences en développement web et contribuer à vos projets innovants.'
    ),
    (
        2,
        'soltani_malek_cv.pdf',
        'uploads/cvs/2/soltani_malek_cv.pdf',
        480000,
        'Étudiant motivé souhaitant acquérir une expérience professionnelle au sein de votre équipe.'
    ),
    (
        3,
        'soltani_maryem_cv.pdf',
        'uploads/cvs/3/soltani_maryem_cv.pdf',
        620000,
        'Passionnée de Data Science, je cherche à mettre en pratique mes connaissances sur des projets réels.'
    );


-- ============================================================
-- 6. Notifications (emails envoyés)
-- ============================================================
INSERT INTO notifications (candidature_id, type_notif, email_dest, sujet, statut)
VALUES
    (
        1,
        'confirmation',
        'oumayma.soltani@gmail.com',
        'Candidature reçue – Référence RIF-2026-0001',
        'envoye'
    ),
    (
        2,
        'confirmation',
        'malek.soltani@gmail.com',
        'Candidature reçue – Référence RIF-2026-0002',
        'envoye'
    ),
    (
        3,
        'confirmation',
        'maryem.soltani@gmail.com',
        'Candidature reçue – Référence RIF-2026-0003',
        'envoye'
    ),
    (
        3,
        'acceptation',
        'maryem.soltani@gmail.com',
        'Félicitations ! Votre candidature est acceptée – Groupe RIF',
        'envoye'
    );
