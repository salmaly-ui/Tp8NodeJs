const fs = require('fs');
const path = require('path');

const directories = [
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

console.log(' Initialisation des répertoires...');

directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✓ Créé: ${dir}`);
  } else {
    console.log(`✓ Existe: ${dir}`);
  }
});

// Créer le fichier de données JSON s'il n'existe pas
const dataFile = 'data/projects.json';
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify({ projects: [] }, null, 2));
  console.log(`✓ Créé: ${dataFile}`);
}

console.log('\n Initialisation complète!');