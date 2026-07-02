// ============================================================
// models/RhNote.model.js
// Modèle pour la table rh_notes
// ============================================================
const { query } = require('../config/db');

class RhNote {
  /**
   * Crée une nouvelle note RH
   */
  static async create(data) {
    const { candidature_id, rh_user_id, note } = data;
    const result = await query(
      `INSERT INTO rh_notes (candidature_id, rh_user_id, note)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [candidature_id, rh_user_id, note]
    );
    return result.rows[0];
  }

  /**
   * Récupère toutes les notes pour une candidature
   */
  static async findByCandidatureId(candidature_id) {
    const result = await query(
      `SELECT rn.*, ru.prenom, ru.nom 
       FROM rh_notes rn
       JOIN rh_users ru ON ru.id = rn.rh_user_id
       WHERE rn.candidature_id = $1
       ORDER BY rn.created_at DESC`,
      [candidature_id]
    );
    return result.rows;
  }

  /**
   * Met à jour une note
   */
  static async update(id, note) {
    const result = await query(
      `UPDATE rh_notes 
       SET note = $1, updated_at = NOW() 
       WHERE id = $2 
       RETURNING *`,
      [note, id]
    );
    return result.rows[0];
  }

  /**
   * Supprime une note
   */
  static async delete(id) {
    const result = await query(
      'DELETE FROM rh_notes WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }

  /**
   * Récupère une note par ID
   */
  static async findById(id) {
    const result = await query(
      'SELECT * FROM rh_notes WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }
}

module.exports = RhNote;
