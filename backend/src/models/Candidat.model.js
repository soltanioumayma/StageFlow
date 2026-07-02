// ============================================================
// models/Candidat.model.js
// Modèle pour la table candidats
// ============================================================
const { query } = require('../config/db');

class Candidat {
  /**
   * Crée un nouveau candidat
   */
  static async create(data) {
    const { candidature_id, prenom, nom, email, telephone } = data;
    const result = await query(
      `INSERT INTO candidats (candidature_id, prenom, nom, email, telephone)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [candidature_id, prenom, nom, email, telephone]
    );
    return result.rows[0];
  }

  /**
   * Récupère un candidat par ID de candidature
   */
  static async findByCandidatureId(candidature_id) {
    const result = await query(
      'SELECT * FROM candidats WHERE candidature_id = $1',
      [candidature_id]
    );
    return result.rows[0];
  }

  /**
   * Récupère un candidat par email
   */
  static async findByEmail(email) {
    const result = await query(
      'SELECT * FROM candidats WHERE LOWER(email) = LOWER($1)',
      [email]
    );
    return result.rows[0];
  }

  /**
   * Met à jour les informations d'un candidat
   */
  static async update(candidature_id, data) {
    const { prenom, nom, email, telephone } = data;
    const result = await query(
      `UPDATE candidats 
       SET prenom = $2, nom = $3, email = $4, telephone = $5
       WHERE candidature_id = $1
       RETURNING *`,
      [candidature_id, prenom, nom, email, telephone]
    );
    return result.rows[0];
  }
}

module.exports = Candidat;
