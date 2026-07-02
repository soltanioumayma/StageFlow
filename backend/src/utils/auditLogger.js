const { Pool } = require('pg');
const logger = require('./logger');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Types d'actions d'audit
 */
const AuditAction = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  VIEW_CANDIDATURE: 'VIEW_CANDIDATURE',
  ACCEPT_CANDIDATURE: 'ACCEPT_CANDIDATURE',
  REJECT_CANDIDATURE: 'REJECT_CANDIDATURE',
  ADD_NOTE: 'ADD_NOTE',
  UPDATE_NOTE: 'UPDATE_NOTE',
  DELETE_NOTE: 'DELETE_NOTE',
  EXPORT_CANDIDATURES: 'EXPORT_CANDIDATURES',
  VIEW_DASHBOARD: 'VIEW_DASHBOARD',
};

/**
 * Enregistre une action d'audit dans la base de données
 * @param {Object} data - Données de l'audit
 * @param {string} data.action - Type d'action
 * @param {number} data.user_id - ID de l'utilisateur RH
 * @param {string} data.user_email - Email de l'utilisateur
 * @param {string} data.ip_address - Adresse IP
 * @param {Object} data.metadata - Métadonnées additionnelles (JSON)
 */
const logAudit = async (data) => {
  const { action, user_id, user_email, ip_address, metadata = {} } = data;

  try {
    const query = `
      INSERT INTO audit_logs (action, user_id, user_email, ip_address, metadata, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING id
    `;
    
    const values = [
      action,
      user_id,
      user_email,
      ip_address,
      JSON.stringify(metadata),
    ];

    const result = await pool.query(query, values);
    logger.info('Audit log enregistré', { auditId: result.rows[0].id, action, user_id });
    return result.rows[0].id;
  } catch (err) {
    logger.error('Erreur enregistrement audit log', { error: err.message, action, user_id });
    // Ne pas bloquer l'application si l'audit échoue
  }
};

/**
 * Récupère les logs d'audit pour un utilisateur
 */
const getAuditLogsByUser = async (userId, limit = 100) => {
  try {
    const query = `
      SELECT * FROM audit_logs
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2
    `;
    const result = await pool.query(query, [userId, limit]);
    return result.rows;
  } catch (err) {
    logger.error('Erreur récupération audit logs', { error: err.message, userId });
    return [];
  }
};

/**
 * Récupère les logs d'audit pour une action spécifique
 */
const getAuditLogsByAction = async (action, limit = 100) => {
  try {
    const query = `
      SELECT * FROM audit_logs
      WHERE action = $1
      ORDER BY created_at DESC
      LIMIT $2
    `;
    const result = await pool.query(query, [action, limit]);
    return result.rows;
  } catch (err) {
    logger.error('Erreur récupération audit logs par action', { error: err.message, action });
    return [];
  }
};

module.exports = {
  AuditAction,
  logAudit,
  getAuditLogsByUser,
  getAuditLogsByAction,
};



