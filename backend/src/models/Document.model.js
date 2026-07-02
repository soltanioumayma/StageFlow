// ============================================================
// models/Document.model.js
// Modèle pour la table documents
// ============================================================
const { query } = require('../config/db');

class Document {
  /**
   * Crée un nouveau document
   */
  static async create(data) {
    const {
      candidature_id,
      cv_nom_original,
      cv_chemin,
      cv_taille_octets,
      lettre_motivation
    } = data;
    const result = await query(
      `INSERT INTO documents 
         (candidature_id, cv_nom_original, cv_chemin, cv_taille_octets, lettre_motivation)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [candidature_id, cv_nom_original, cv_chemin, cv_taille_octets, lettre_motivation]
    );
    return result.rows[0];
  }

  /**
   * Récupère un document par ID de candidature
   */
  static async findByCandidatureId(candidature_id) {
    const result = await query(
      'SELECT * FROM documents WHERE candidature_id = $1',
      [candidature_id]
    );
    return result.rows[0];
  }

  /**
   * Met à jour les informations du document
   */
  static async update(candidature_id, data) {
    const {
      cv_nom_original,
      cv_chemin,
      cv_taille_octets,
      lettre_motivation
    } = data;
    const result = await query(
      `UPDATE documents 
       SET cv_nom_original = $2, cv_chemin = $3, cv_taille_octets = $4, lettre_motivation = $5
       WHERE candidature_id = $1
       RETURNING *`,
      [candidature_id, cv_nom_original, cv_chemin, cv_taille_octets, lettre_motivation]
    );
    return result.rows[0];
  }

  /**
   * Supprime le CV d'une candidature
   */
  static async deleteCV(candidature_id) {
    const result = await query(
      `UPDATE documents 
       SET cv_nom_original = NULL, cv_chemin = NULL, cv_taille_octets = NULL
       WHERE candidature_id = $1
       RETURNING *`,
      [candidature_id]
    );
    return result.rows[0];
  }
}

module.exports = Document;
