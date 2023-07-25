import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

dotenv.config();

export const {
  EMAIL_APP_PASSWORD,
  SESSION_KEY_1,
  SESSION_KEY_2,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
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

const CLIENT_URL = `${CLIENT_DOMAIN}:${CLIENT_PORT}`;
export { IS_PRODUCTION, CLIENT_URL };
