const { query } = require('../config/db');

class RhUser {
  /**
   * Crée un nouvel utilisateur RH
   */
  static async create(data) {
    const { email, password_hash, nom, prenom, role = 'recruteur' } = data;
    const result = await query(
      `INSERT INTO rh_users (email, password_hash, nom, prenom, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, nom, prenom, role, created_at`,
      [email, password_hash, nom, prenom, role]
    );
    return result.rows[0];
  }

  /**
   * Récupère un utilisateur par ID
   */
  static async findById(id) {
    const result = await query(
      'SELECT id, email, nom, prenom, role, created_at FROM rh_users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  /**
   * Récupère un utilisateur par email (avec password_hash pour auth)
   */
  static async findByEmail(email) {
    const result = await query(
      'SELECT * FROM rh_users WHERE LOWER(email) = LOWER($1)',
      [email]
    );
    return result.rows[0];
  }

  /**
   * Met à jour le mot de passe
   */
  static async updatePassword(id, password_hash) {
    const result = await query(
      `UPDATE rh_users 
       SET password_hash = $2 
       WHERE id = $1 
       RETURNING id, email, nom, prenom, role, created_at`,
      [id, password_hash]
    );
    return result.rows[0];
  }

  /**
   * Met à jour les informations de l'utilisateur
   */
  static async update(id, data) {
    const { nom, prenom, role } = data;
    const result = await query(
      `UPDATE rh_users 
       SET nom = $2, prenom = $3, role = $4
       WHERE id = $1
       RETURNING id, email, nom, prenom, role, created_at`,
      [id, nom, prenom, role]
    );
    return result.rows[0];
  }

  /**
   * Liste tous les utilisateurs RH
   */
  static async findAll() {
    const result = await query(
      'SELECT id, email, nom, prenom, role, created_at FROM rh_users ORDER BY created_at DESC'
    );
    return result.rows;
  }

  /**
   * Supprime un utilisateur
   */
  static async delete(id) {
    const result = await query(
      'DELETE FROM rh_users WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  }

  /**
   * Liste les rôles valides
   */
  static getRolesValides() {
    return ['admin', 'recruteur'];
  }
}

module.exports = RhUser;



