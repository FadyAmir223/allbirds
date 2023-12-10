import url from 'url'
import path from 'path'
import dotenv from 'dotenv'
import 'dotenv/config'

const { NODE_ENV } = process.env
const IS_PRODUCTION = NODE_ENV === 'production'

dotenv.config({ path: `./.env.${IS_PRODUCTION ? NODE_ENV : 'development'}` })
dotenv.config({ path: `./.env.mongo` })

export const {
  SERVER_DOMAIN,
  SERVER_PORT,
  SESSION_KEY_1,
  SESSION_KEY_2,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
  EMAIL_APP_PASSWORD,
  EMAIL_SENDER,
} = process.env

const { MONGO_INITDB_ROOT_USERNAME, MONGO_INITDB_ROOT_PASSWORD, DB_NAME } =
  process.env

const MONGO_URL = `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@database:27017/${DB_NAME}?authSource=admin`

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

const CLIENT_DOMAINS = process.env.CLIENT_DOMAIN.split(',')
const CLIENT_DOMAIN = CLIENT_DOMAINS[0]

const SERVER_URL = `${SERVER_DOMAIN}${
  IS_PRODUCTION ? '' : ':' + SERVER_PORT
}/api`

export {
  NODE_ENV,
  IS_PRODUCTION,
  MONGO_URL,
  DB_NAME,
  CLIENT_DOMAINS,
  CLIENT_DOMAIN,
  SERVER_URL,
  __dirname,
}
