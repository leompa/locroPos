import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getFirebasePublicConfig } from '../config/firebaseConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');
const publicDir = path.join(rootDir, 'public');
const pagesDir = path.join(publicDir, 'pages');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(publicDir));

app.get('/firebase-config', (_req, res) => {
  res.json(getFirebasePublicConfig());
});

const pageRoutes = ['caja', 'cocina', 'barra', 'pantalla', 'admin'];

for (const route of pageRoutes) {
  app.get(`/${route}`, (_req, res) => {
    res.sendFile(path.join(pagesDir, `${route}.html`));
  });
}

app.get('/', (_req, res) => {
  res.redirect('/caja');
});

app.listen(port, () => {
  console.log(`LocroPOS running at http://localhost:${port}`);
});
