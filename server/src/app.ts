import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import url from 'url';
import cookieParser from 'cookie-parser';

import { CLIENT_URL, IS_PRODUCTION } from './utils/loadEnv.js';
import api from './routes/api.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const app = express();

app.use(
  cors({
    origin: CLIENT_URL,
    methods: 'GET,POST,DELETE,PUT,PATCH',
    credentials: true,
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

app.use(cookieParser());

app.use(morgan(IS_PRODUCTION ? 'combined' : 'dev'));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api', api);

app.get('/*', (_, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

export default app;
