import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

dotenv.config();

export const {
  SESSION_KEY_1,
  SESSION_KEY_2,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
  EMAIL_APP_PASSWORD,
  EMAIL_SENDER,
} = process.env;

dotenv.config({
  path: join(
    dirname(fileURLToPath(import.meta.url)),
    '..',
    '..',
    IS_PRODUCTION ? '.env.production' : '.env.development'
  ),
});

export const {
  CLIENT_DOMAIN,
  CLIENT_PORT,
  SERVER_DOMAIN,
  SERVER_PORT,
  MONGO_URL,
} = process.env;

const CLIENT_URL = CLIENT_DOMAIN + (CLIENT_PORT ? ':' + CLIENT_PORT : '');
const SERVER_URL = SERVER_DOMAIN + (SERVER_PORT ? ':' + SERVER_PORT : '');

export { IS_PRODUCTION, CLIENT_URL, SERVER_URL };
