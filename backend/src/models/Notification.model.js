// ============================================================
// models/Notification.model.js
// Modèle pour la table notifications
// ============================================================
const { query } = require('../config/db');

class Notification {
  /**
   * Crée une nouvelle notification
   */
  static async create(data) {
    const {
      candidature_id,
      type_notif,
      email_dest,
      sujet,
      statut = 'envoye'
    } = data;
    const result = await query(
      `INSERT INTO notifications (candidature_id, type_notif, email_dest, sujet, statut)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [candidature_id, type_notif, email_dest, sujet, statut]
    );
    return result.rows[0];
  }

  /**
   * Récupère toutes les notifications d'une candidature
   */
  static async findByCandidatureId(candidature_id) {
    const result = await query(
      `SELECT * FROM notifications 
       WHERE candidature_id = $1 
       ORDER BY envoye_le DESC`,
      [candidature_id]
    );
    return result.rows;
  }

  /**
   * Met à jour le statut d'une notification
   */
  static async updateStatut(id, statut) {
    const result = await query(
      `UPDATE notifications 
       SET statut = $1 
       WHERE id = $2 
       RETURNING *`,
      [statut, id]
    );
    return result.rows[0];
  }

  /**
   * Liste les types de notifications valides
   */
  static getTypesValides() {
    return ['confirmation', 'acceptation', 'refus'];
  }

  /**
   * Liste les statuts valides
   */
  static getStatutsValides() {
    return ['envoye', 'echec'];
  }
}

module.exports = Notification;
