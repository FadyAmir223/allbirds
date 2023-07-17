import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import url from 'url';

import { CLIENT_URL, CLIENT_PORT } from './utils/loadEnv.js';
import api from './routes/api.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const clientUrl = `${CLIENT_URL}:${CLIENT_PORT}`;

const app = express();

app.use(
  cors({
    origin: clientUrl,
    credentials: true,
    methods: 'GET,POST,DELETE,PUT',
  })
);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'default-src': ["'self'"],
        'img-src': ["'self'", 'blob:'], // blob: upload & *: other sites
      },
    },
  })
);

app.use(express.json());

app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api', api);

app.get('/*', (_, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

export default app;
