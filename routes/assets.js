const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Charger la base projets
const DATA_FILE = 'data/projects.json';
const loadProjects = () => {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (err) {
    return { projects: [] };
  }
};

// GET /api/assets/:assetId → métadonnées de l’asset
router.get('/:assetId', (req, res) => {
  const data = loadProjects();
  let foundAsset = null;
  let parentProject = null;

  for (const project of data.projects) {
    const asset = project.assets.find(a => a.id === req.params.assetId);
    if (asset) {
      foundAsset = asset;
      parentProject = { id: project.id, name: project.name };
      break;
    }
  }

  if (!foundAsset) {
    return res.status(404).json({ success: false, message: 'Asset non trouvé' });
  }

  res.json({
    success: true,
    asset: foundAsset,
    project: parentProject
  });
});

// DELETE /api/assets/:assetId → supprimer l’asset
router.delete('/:assetId', (req, res) => {
  const data = loadProjects();
  let assetDeleted = false;
  let projectIndex = -1;
  let assetIndex = -1;

  for (let i = 0; i < data.projects.length; i++) {
    const assetIdx = data.projects[i].assets.findIndex(a => a.id === req.params.assetId);
    if (assetIdx !== -1) {
      projectIndex = i;
      assetIndex = assetIdx;
      break;
    }
  }

  if (projectIndex === -1) {
    return res.status(404).json({ success: false, message: 'Asset non trouvé' });
  }

  const asset = data.projects[projectIndex].assets[assetIndex];
  const filePath = path.join(__dirname, '..', asset.path);

  // Supprimer le fichier physique
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  // Supprimer l’entrée JSON
  data.projects[projectIndex].assets.splice(assetIndex, 1);
  data.projects[projectIndex].updatedAt = new Date().toISOString();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

  res.json({ success: true, message: 'Asset supprimé' });
});

module.exports = router;