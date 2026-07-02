const { query } = require('../config/db');

class Formation {
  /**
   * Crée une nouvelle formation
   */
  static async create(data) {
    const {
      candidature_id,
      etablissement,
      specialite,
      niveau,
      type_stage,
      lien_github,
      lien_linkedin
    } = data;
    const result = await query(
      `INSERT INTO formations 
         (candidature_id, etablissement, specialite, niveau, type_stage, lien_github, lien_linkedin)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [candidature_id, etablissement, specialite, niveau, type_stage, lien_github, lien_linkedin]
    );
    return result.rows[0];
  }

  /**
   * Récupère une formation par ID de candidature
   */
  static async findByCandidatureId(candidature_id) {
    const result = await query(
      'SELECT * FROM formations WHERE candidature_id = $1',
      [candidature_id]
    );
    return result.rows[0];
  }

  /**
   * Met à jour les informations de formation
   */
  static async update(candidature_id, data) {
    const {
      etablissement,
      specialite,
      niveau,
      type_stage,
      lien_github,
      lien_linkedin
    } = data;
    const result = await query(
      `UPDATE formations 
       SET etablissement = $2, specialite = $3, niveau = $4, 
           type_stage = $5, lien_github = $6, lien_linkedin = $7
       WHERE candidature_id = $1
       RETURNING *`,
      [candidature_id, etablissement, specialite, niveau, type_stage, lien_github, lien_linkedin]
    );
    return result.rows[0];
  }

  /**
   * Cherche une candidature ACTIVE (statut 'en_attente')
   * pour un email + type_stage donnés.
   * Utilisé pour empêcher les doublons lors d'une nouvelle soumission.
   * Renvoie undefined si aucun doublon actif n'est trouvé.
   */
  static async findActiveByEmailAndTypeStage(email, type_stage) {
    const result = await query(
      `SELECT c.id, c.reference, c.status
       FROM candidatures c
       JOIN candidats cd ON cd.candidature_id = c.id
       JOIN formations f ON f.candidature_id = c.id
       WHERE LOWER(cd.email) = LOWER($1)
         AND f.type_stage = $2
         AND c.status = 'en_attente'
       LIMIT 1`,
      [email, type_stage]
    );
    return result.rows[0];
  }

  /**
   * Liste les niveaux valides
   */
  static getNiveauxValides() {
    return ['BTS', 'Licence', 'Master', 'Ingenieur', 'Doctorat', 'Autre'];
  }

  /**
   * Liste les types de stage valides
   */
  static getTypesStageValides() {
    return ['PFE', 'Stage_ete', 'Alternance', 'Observation', 'Autre'];
  }
}

module.exports = Formation;


