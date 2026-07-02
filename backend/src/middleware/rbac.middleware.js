
/**
 * Définition des rôles et permissions
 */
const Role = {
  ADMIN: 'admin',
  RECRUTEUR: 'recruteur',
  LECTEUR: 'lecteur',
};

/**
 * Définition des permissions par rôle
 */
const Permissions = {
  [Role.ADMIN]: {
    canViewAll: true,
    canDecide: true,
    canAddNotes: true,
    canDeleteNotes: true,
    canExport: true,
    canManageUsers: true,
    canViewAuditLogs: true,
  },
  [Role.RECRUTEUR]: {
    canViewAll: true,
    canDecide: true,
    canAddNotes: true,
    canDeleteNotes: true, // Seulement ses propres notes
    canExport: true,
    canManageUsers: false,
    canViewAuditLogs: false,
  },
  [Role.LECTEUR]: {
    canViewAll: true,
    canDecide: false,
    canAddNotes: true,
    canDeleteNotes: false,
    canExport: false,
    canManageUsers: false,
    canViewAuditLogs: false,
  },
};

/**
 * Middleware pour vérifier si l'utilisateur a une permission spécifique
 */
const hasPermission = (permission) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    
    if (!userRole) {
      return res.status(403).json({
        success: false,
        message: 'Rôle non défini',
      });
    }

    const rolePermissions = Permissions[userRole];
    
    if (!rolePermissions || !rolePermissions[permission]) {
      return res.status(403).json({
        success: false,
        message: 'Permission refusée',
      });
    }

    next();
  };
};

/**
 * Middleware pour vérifier si l'utilisateur a un rôle spécifique
 */
const hasRole = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé. Rôle insuffisant.',
      });
    }

    next();
  };
};

/**
 * Middleware pour vérifier que l'utilisateur est admin
 */
const isAdmin = hasRole(Role.ADMIN);

/**
 * Middleware pour vérifier que l'utilisateur peut prendre des décisions
 */
const canDecide = hasPermission('canDecide');

/**
 * Middleware pour vérifier que l'utilisateur peut exporter
 */
const canExport = hasPermission('canExport');

module.exports = {
  Role,
  Permissions,
  hasPermission,
  hasRole,
  isAdmin,
  canDecide,
  canExport,
};



