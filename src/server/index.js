import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderFirebaseEnvModule } from '../config/firebaseConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');
const publicDir = path.join(rootDir, 'public');

const app = express();
const port = process.env.PORT || 3000;

app.get('/js/config/env.js', (_req, res) => {
  res.type('application/javascript').send(renderFirebaseEnvModule());
});

app.use(express.static(publicDir, { extensions: ['html'] }));

app.get('/', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`LocroPOS running at http://localhost:${port}`);
});
