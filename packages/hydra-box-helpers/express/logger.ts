import { Request } from 'express'
import { log } from '../log'

const requestLogger = log.extend('request')
const requestErrorLogger = requestLogger.extend('error')
const headersLogger = requestLogger.extend('headers')

export function logRequest (req: Request, res, next) {
  requestLogger(`${req.method} ${req.url}`)

  if (headersLogger.enabled) {
    headersLogger(`${Object.entries(req.headers).map(([header, value]) => `${header}: '${value}'`).join('\n')}`)
  }

  res.on('finish', () => {
    requestLogger(`Status ${res.statusCode}`)
  })

  next()
}

export function logRequestError (err, req, res, next) {
  requestErrorLogger('Request failed: %o', err)
  next(err)
}
