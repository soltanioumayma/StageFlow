const { query } = require('../config/db');

class Candidature {
  
  static async create(data) {
    const { reference, status = 'en_attente', rgpd_accepted = true } = data;
    const result = await query(
      `INSERT INTO candidatures (reference, status, rgpd_accepted)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [reference, status, rgpd_accepted]
    );
    return result.rows[0];
  }

  
  static async findById(id) {
    const result = await query(
      'SELECT * FROM candidatures WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  
  static async findByReference(reference) {
    const result = await query(
      'SELECT * FROM candidatures WHERE reference = $1',
      [reference]
    );
    return result.rows[0];
  }

  
  static async updateStatus(id, status) {
    const result = await query(
      `UPDATE candidatures 
       SET status = $1, updated_at = NOW() 
       WHERE id = $2 
       RETURNING *`,
      [status, id]
    );
    return result.rows[0];
  }

  
  static async findAllWithFilters(options = {}) {
    const {
      filters = {},
      search,
      type_stage,
      niveau,
      date_from,
      date_to,
      page = 1,
      limit = 20,
      sort = 'submitted_at',
      order = 'DESC'
    } = options;

    const offset = (page - 1) * limit;
    const params = [];
    const conditions = [];

    // Build WHERE clause
    if (filters.status) {
      conditions.push(`c.status = $${params.length + 1}`);
      params.push(filters.status);
    }

    if (search) {
      conditions.push(`(
        cd.prenom ILIKE $${params.length + 1} OR 
        cd.nom ILIKE $${params.length + 2} OR 
        cd.email ILIKE $${params.length + 3} OR 
        c.reference ILIKE $${params.length + 4}
      )`);
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (type_stage) {
      conditions.push(`f.type_stage = $${params.length + 1}`);
      params.push(type_stage);
    }

    if (niveau) {
      conditions.push(`f.niveau = $${params.length + 1}`);
      params.push(niveau);
    }

    if (date_from) {
      conditions.push(`c.submitted_at >= $${params.length + 1}`);
      params.push(date_from);
    }

    if (date_to) {
      conditions.push(`c.submitted_at <= $${params.length + 1}`);
      params.push(date_to);
    }

    // Build ORDER BY clause
    const validSorts = ['submitted_at', 'nom', 'email', 'reference'];
    const sortField = validSorts.includes(sort) ? sort : 'submitted_at';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    let orderBy;
    if (sortField === 'nom') {
      orderBy = `ORDER BY cd.nom ${sortOrder}`;
    } else if (sortField === 'email') {
      orderBy = `ORDER BY cd.email ${sortOrder}`;
    } else {
      orderBy = `ORDER BY c.${sortField} ${sortOrder}`;
    }

    // Build the main query
    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
    
    const countQuery = `
      SELECT COUNT(*) as total
      FROM candidatures c
      JOIN candidats cd ON cd.candidature_id = c.id
      JOIN formations f ON f.candidature_id = c.id
      ${whereClause}
    `;

    const dataQuery = `
      SELECT 
        c.id, c.reference, c.status, c.rgpd_accepted, c.submitted_at, c.updated_at,
        cd.prenom, cd.nom, cd.email, cd.telephone,
        f.etablissement, f.specialite, f.niveau, f.type_stage, f.lien_github, f.lien_linkedin
      FROM candidatures c
      JOIN candidats cd ON cd.candidature_id = c.id
      JOIN formations f ON f.candidature_id = c.id
      ${whereClause}
      ${orderBy}
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    params.push(limit, offset);

    // Execute both queries
    const [countResult, dataResult] = await Promise.all([
      query(countQuery, params.slice(0, params.length - 2)),
      query(dataQuery, params)
    ]);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    return {
      data: dataResult.rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  }

  
  static async findAll(filters = {}) {
    let sql = 'SELECT * FROM candidatures';
    const params = [];
    const conditions = [];

    if (filters.status) {
      conditions.push(`status = $${params.length + 1}`);
      params.push(filters.status);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY submitted_at DESC';

    const result = await query(sql, params);
    return result.rows;
  }

  
  static async getStats() {
    const result = await query(
      `SELECT
         COUNT(*)                                          AS total,
         COUNT(*) FILTER (WHERE status = 'en_attente')    AS en_attente,
         COUNT(*) FILTER (WHERE status = 'acceptee')      AS acceptees,
         COUNT(*) FILTER (WHERE status = 'refusee')       AS refusees
       FROM candidatures`
    );
    return result.rows[0];
  }

  
  static async getLastReferenceOfYear(year) {
    const prefix = `RIF-${year}-`;
    const result = await query(
      `SELECT reference FROM candidatures 
       WHERE reference LIKE $1 
       ORDER BY reference DESC 
       LIMIT 1`,
      [`${prefix}%`]
    );
    return result.rows[0];
  }
}

module.exports = Candidature;



