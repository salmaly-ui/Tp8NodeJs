# ProjecHub – Gestion de projets & uploads (Node.js + Multer)

**Installation** : `git clone <repo>` → `npm install` → `npm run dev` → http://localhost:3000

**Stack** : Express, Multer, UUID, Moment, stockage disque (`storage/projects/<id>/`)

**Fonctionnalités** : création projet (nom, desc, catégorie) | upload multiple (20 fichiers, 500 Mo/fichier) | filtrage MIME (PDF, DOCX, ZIP, MP4, JPG, PNG, WebP, TIFF) | déplacement auto `temp/` → `projects/<id>/` | nettoyage fichiers temporaires en erreur | consultation/liste/suppression projet

**API** : `POST /api/projects/create-with-assets` | `GET /api/projects/list` | `GET /api/projects/:projectId` | `PUT /api/projects/:projectId/add-assets` | `DELETE /api/projects/:projectId`

**Structure** : `config/storage.js` (Multer) | `routes/projects.js` (CRUD+upload) | `storage/projects/` (fichiers) | `views/` (HTML) | `server.js` (Express)

**Env** : `PORT` (défaut 3000) | **Scripts** : `npm run dev`, `npm start`, `npm run init-dirs`

 
 
