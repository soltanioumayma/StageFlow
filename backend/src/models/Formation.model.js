const { query } = require('../config/db');
const { NIVEAUX, TYPES_STAGE } = require('../utils/constants');

class Formation {
  
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

  
  static async findByCandidatureId(candidature_id) {
    const result = await query(
      'SELECT * FROM formations WHERE candidature_id = $1',
      [candidature_id]
    );
    return result.rows[0];
  }

  
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

  
  static getNiveauxValides() {
    return NIVEAUX;
  }

  
  static getTypesStageValides() {
    return TYPES_STAGE;
  }
}

module.exports = Formation;


