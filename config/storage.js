// config/storage.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const moment = require('moment');

// Création des dossiers nécessaires
const ensureDirectories = () => {
  const dirs = [
    'storage/projects',
    'storage/backups',
    'storage/temp',
    'public/css',
    'public/js',
    'views',
    'routes',
    'middleware',
    'controllers',
    'data'
  ];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });
};

// Configuration Multer (stockage disque, filtres, limites)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'storage/temp';
    if (req.params.projectId) {
      folder = `storage/projects/${req.params.projectId}`;
      if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
    }
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}_${Math.round(Math.random() * 1e6)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  }
});

// Filtre : types de fichiers autorisés
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/zip', 'application/x-rar-compressed',
    'video/mp4', 'video/quicktime',
    'image/jpeg', 'image/png', 'image/webp', 'image/tiff'
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé'), false);
  }
};

// Configuration finale Multer
const uploadConfig = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500 MB
    files: 20
  }
});

// Archive d’un projet (à implémenter plus tard)
const archiveProject = (projectId, compressionLevel = 6) => {
  const projectPath = path.join('storage/projects', projectId);
  const backupPath = path.join('storage/backups', `${projectId}_${moment().format('YYYY-MM-DD_HHmmss')}.zip`);
  // Logique de zip (nécessite `archiver` ou `adm-zip`)
  return backupPath;
};

module.exports = {
  multer: () => uploadConfig,   
  ensureDirectories,
  uploadConfig,
  archiveProject
};