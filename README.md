## ProjecHub - Gestion de projets & uploads (Node.js + Multer)

---
## demo video



https://github.com/user-attachments/assets/9c4595e7-94b0-40ba-95d8-e4a1253a8e4e

---

**Installation :** git clone <repo> -> npm install -> npm run dev -> http://localhost:3000

**Stack :** Express.js | Multer | UUID | Moment.js | FileSystem natif

**Structure :** config/storage.js (config Multer) | routes/projects.js (CRUD + upload) | storage/projects/ (fichiers projets) | views/ (HTML front) | data/projects.json (BDD) | server.js (entry point)

**Fonctionnalites :**
- Creation projet (nom, description, categorie - champ tags supprime)
- Upload multiple (20 fichiers max, 500 Mo/fichier)
- Types acceptes : PDF, DOCX, ZIP, MP4, JPG, PNG, WebP, TIFF
- Stockage organise : storage/projects/{projectId}/{fichier}
- Deplacement automatique : storage/temp/ -> dossier projet
- Nettoyage fichiers temporaires en cas d'erreur
- Consultation liste projets (cartes + metadonnees)
- Page detail projet avec telechargement fichiers
- Suppression projet (dossier + JSON)

**API endpoints :**
- POST /api/projects/create-with-assets : Creer projet + upload
- GET /api/projects/list : Liste des projets
- GET /api/projects/:projectId : Detail projet
- PUT /api/projects/:projectId/add-assets : Ajouter fichiers
- DELETE /api/projects/:projectId : Supprimer projet

**Routes front :** / (liste) | /create (formulaire) | /project/:id (detail)

**Configuration Multer :** stockage disque | destination temp/ ou projects/{id}/ | nommage timestamp_random.ext | filtre MIME (images, PDF, DOCX, archives, videos) | limites 500MB/fichier, 20 fichiers

**Variables :** PORT (defaut 3000)

**Scripts :** npm run dev (nodemon) | npm start (production) | npm run init-dirs (creation dossiers)

**Securite :** validation MIME+extension | renommage fichiers | limitation taille/nombre | nettoyage erreur | path.join anti-traversee

