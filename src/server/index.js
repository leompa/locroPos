import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getFirebasePublicConfig, renderFirebaseEnvModule } from '../config/firebaseConfig.js';
import { ticketsRouter } from './routes/tickets.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');
const publicDir = path.join(rootDir, 'public');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', ticketsRouter);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, app: 'LocroPOS' });
});

app.get('/api/firebase-config', (_req, res) => {
  res.json(getFirebasePublicConfig());
});

app.get('/js/config/env.js', (_req, res) => {
  res.type('application/javascript').send(renderFirebaseEnvModule());
});

app.use(express.static(publicDir, { extensions: ['html'] }));

app.get('/', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`LocroPOS local server running at http://localhost:${port}`);
});
