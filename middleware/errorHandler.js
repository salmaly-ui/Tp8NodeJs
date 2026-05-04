const handleUploadError = (err, req, res, next) => {
  let message = 'Erreur lors du téléchargement';
  let statusCode = 400;
  
  if (err.code === 'LIMIT_FILE_SIZE') {
    message = 'Un ou plusieurs fichiers dépassent la taille maximale (500 MB)';
    statusCode = 413;
  } else if (err.code === 'LIMIT_FILE_COUNT') {
    message = 'Trop de fichiers fournis (maximum 20)';
    statusCode = 413;
  } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    message = 'Paramètre de fichier invalide';
    statusCode = 400;
  } else if (err.message) {
    message = err.message;
  }
  
  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = {
  handleUploadError
};