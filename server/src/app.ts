import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'

import { CLIENT_DOMAINS } from './config/env.js'
import api from './routes/api.js'

const app = express()

app.use(
  cors({
    origin: CLIENT_DOMAINS,
    methods: 'GET,POST,DELETE,PUT,PATCH',
    credentials: true,
  }),
)

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'default-src': ["'self'"],
        // blob: upload & *: other sites
        'img-src': ["'self'", 'blob:'],
      },
    },
  }),
)

app.use(express.json())

app.use(cookieParser())

app.use('/api', api)

export default app
