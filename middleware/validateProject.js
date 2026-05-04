const validateProjectData = (req, res, next) => {
  const { projectName, category } = req.body;
  
  const errors = [];
  
  if (!projectName || projectName.trim().length < 3) {
    errors.push('Le nom du projet doit contenir au moins 3 caractères');
  }
  
  if (!category || !['web-design', 'graphic-design', 'video', 'software', 'general'].includes(category)) {
    errors.push('Catégorie invalide');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Validation échouée',
      errors 
    });
  }
  
  next();
};

const validateFileSize = (maxSizeMB = 500) => {
  return (req, res, next) => {
    if (!req.files) {
      return res.status(400).json({ 
        success: false, 
        message: 'Aucun fichier n\'a été fourni' 
      });
    }
    
    const maxBytes = maxSizeMB * 1024 * 1024;
    
    for (const file of req.files) {
      if (file.size > maxBytes) {
        return res.status(413).json({ 
          success: false, 
          message: `Le fichier ${file.originalname} dépasse ${maxSizeMB}MB`
        });
      }
    }
    
    next();
  };
};

module.exports = {
  validateProjectData,
  validateFileSize
};