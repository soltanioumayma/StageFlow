// ============================================================
// middleware/upload.middleware.js
// Gère l'upload de fichiers CV avec Multer
// ============================================================
const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

// Dossier de destination des CVs
const UPLOAD_DIR = path.join(__dirname, '../../../uploads/cvs');

// Crée le dossier s'il n'existe pas
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configuration du stockage
const storage = multer.diskStorage({
  // Détermine où stocker le fichier
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  // Génère un nom de fichier unique pour éviter les collisions
  filename: (req, file, cb) => {
    const timestamp  = Date.now();
    const ext        = path.extname(file.originalname); // ".pdf"
    const safeName   = `cv_${timestamp}${ext}`;
    cb(null, safeName);
  },
});

// Filtre : accepte uniquement les fichiers PDF
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true); // Accepté
  } else {
    cb(new Error('Seuls les fichiers PDF sont acceptés.'), false);
  }
};

// Instance Multer avec les limites
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5 Mo max
  },
});

module.exports = { upload };
