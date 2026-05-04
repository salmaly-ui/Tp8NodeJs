const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const { multer: getUploader } = require('../config/storage');

const DATA_FILE = 'data/projects.json';

// Charger les données
const loadProjects = () => {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (err) {
    return { projects: [] };
  }
};

const saveProjects = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Helper : déplacer un fichier du dossier temporaire vers le dossier projet
function moveFileToProject(file, projectFolder) {
  const oldPath = file.path;                      // ex: storage/temp/xxx.jpg
  const newPath = path.join(projectFolder, file.filename);
  if (!fs.existsSync(projectFolder)) {
    fs.mkdirSync(projectFolder, { recursive: true });
  }
  fs.renameSync(oldPath, newPath);
  return newPath;
}

// Création d’un projet avec upload de fichiers
router.post('/create-with-assets', getUploader().array('projectAssets', 20), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier n\'a été téléchargé'
      });
    }

    const { projectName, projectDescription, category, tags } = req.body;
    const projectId = `proj_${uuidv4().slice(0, 8)}`;
    const projectFolder = path.join('storage', 'projects', projectId);

    // Créer le dossier du projet
    if (!fs.existsSync(projectFolder)) {
      fs.mkdirSync(projectFolder, { recursive: true });
    }

    // Déplacer chaque fichier et construire la liste des assets
    const assets = [];
    for (const file of req.files) {
      const newPath = moveFileToProject(file, projectFolder);
      assets.push({
        id: `asset_${uuidv4().slice(0, 8)}`,
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: newPath,
        uploadedAt: moment().toISOString(),
        version: 1
      });
    }

    const newProject = {
      id: projectId,
      name: projectName,
      description: projectDescription,
      category: category || 'general',
      status: 'draft',
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString(),
      assets: assets,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      collaborators: []
    };

    const data = loadProjects();
    data.projects.push(newProject);
    saveProjects(data);

    res.json({
      success: true,
      message: 'Projet créé avec succès',
      project: newProject
    });

  } catch (err) {
    // Nettoyage des fichiers temporaires en cas d’erreur
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
    }
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// Liste des projets
router.get('/list', (req, res) => {
  try {
    const data = loadProjects();
    res.json({
      success: true,
      total: data.projects.length,
      projects: data.projects
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// Détail d’un projet
router.get('/:projectId', (req, res) => {
  try {
    const data = loadProjects();
    const project = data.projects.find(p => p.id === req.params.projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }
    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// Ajout d’assets à un projet existant
router.put('/:projectId/add-assets', getUploader().array('projectAssets', 20), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier n\'a été téléchargé'
      });
    }

    const data = loadProjects();
    const projectIndex = data.projects.findIndex(p => p.id === req.params.projectId);
    if (projectIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }

    const project = data.projects[projectIndex];
    const projectFolder = path.join('storage', 'projects', project.id);

    // Créer le dossier s'il n'existe pas (normalement il existe déjà)
    if (!fs.existsSync(projectFolder)) {
      fs.mkdirSync(projectFolder, { recursive: true });
    }

    const newAssets = [];
    for (const file of req.files) {
      const newPath = moveFileToProject(file, projectFolder);
      newAssets.push({
        id: `asset_${uuidv4().slice(0, 8)}`,
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: newPath,
        uploadedAt: moment().toISOString(),
        version: (project.assets.length + newAssets.length) / 5 + 1
      });
    }

    project.assets.push(...newAssets);
    project.updatedAt = moment().toISOString();
    saveProjects(data);

    res.json({
      success: true,
      message: `${newAssets.length} asset(s) ajouté(s)`,
      assets: newAssets
    });

  } catch (err) {
    // Nettoyage des fichiers temporaires en cas d’erreur
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
    }
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// Suppression d’un projet (supprime aussi le dossier et les fichiers)
router.delete('/:projectId', (req, res) => {
  try {
    const data = loadProjects();
    const projectIndex = data.projects.findIndex(p => p.id === req.params.projectId);
    if (projectIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }

    const project = data.projects[projectIndex];
    const projectPath = path.join('storage', 'projects', project.id);
    if (fs.existsSync(projectPath)) {
      fs.rmSync(projectPath, { recursive: true, force: true });
    }

    data.projects.splice(projectIndex, 1);
    saveProjects(data);

    res.json({
      success: true,
      message: 'Projet supprimé avec succès'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;