const express = require('express');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const { ensureDirectories } = require('./config/storage');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Initialisation des répertoires
ensureDirectories();

 app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

 app.use('/projects', express.static('storage/projects'));

 app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/project/:projectId', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'project-detail.html'));
});

app.get('/create', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'create-project.html'));
});

 app.use('/api/projects', require('./routes/projects'));
app.use('/api/assets', require('./routes/assets'));

// Gestion des erreurs globale
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({ 
    success: false, 
    message: err.message || 'Erreur interne du serveur' 
  });
});

app.listen(PORT, () => {
  console.log(` ProjecHub lancé sur http://localhost:${PORT}`);
  console.log(` Stockage initié: ${fs.readdirSync('storage').length} répertoires actifs`);
});