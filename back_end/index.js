import express from "express"
import compression from 'compression'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import cors from 'cors'
import axios from 'axios'
import serveStatic from 'serve-static'
import * as dotenv from 'dotenv'
import { createHash, createHmac } from 'crypto'

dotenv.config({ path: './back_end/.env' })

const port = process.env.PORT
const baseUrl = process.env.BASE_URL
const authUrl = process.env.AUTH_URL
const apiUrl = process.env.API_URL

const corsOptions = {
  origin: baseUrl,
}

const app = express()
app.use(cookieParser())
app.use(bodyParser.json())
app.use(compression())
app.use(cors(corsOptions))
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "connect-src": ["'self'", apiUrl, authUrl, ],
        "script-src": ["'self'", 'blob:', "'sha256-BIcUshLJeO09OXe5RD8UZOn1AV4nYRvcvT5vXbf8lyw='"],
        "frame-ancestors": ["'self'", "https://wallet.bitcoinjungle.app", "http://localhost:3100"],
        "img-src": ["'self'", 'data:', 'https://cdnjs.cloudflare.com'],
        "frame-src": ["'self'", 'https://*.incodesmile.com'],
        "object-src": ["'self'"],
      },
    },
  })
)

const setCustomCacheControl = (res, path) => {
  if (path.indexOf('/build/static/') !== -1) {
    res.setHeader('Cache-Control', 'public, max-age=2419200, immutable')
  } else if(serveStatic.mime.lookup(path) !== 'text/html') {
    res.setHeader('Cache-Control', 'public, max-age=86400')
  }
}

app.use(serveStatic('front_end/build', { index: ['index.html'], dotfiles: 'deny', setHeaders: setCustomCacheControl }))

const server = app.listen(port, '0.0.0.0', () => console.log("Listening on port", port))
server.setTimeout(1000 * 60 * 9)