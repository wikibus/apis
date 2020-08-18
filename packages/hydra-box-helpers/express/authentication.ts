import * as e from 'express'
import { namedNode } from '@rdfjs/data-model'
import { Router } from 'express'
import jwt = require('express-jwt');
import jwksRsa = require('jwks-rsa')

const createJwtHandler = (credentialsRequired: boolean) => jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://wikibus.eu.auth0.com/.well-known/jwks.json',
  }),

  // Validate the audience and the issuer.
  audience: 'https://wikibus.org',
  issuer: 'https://wikibus.eu.auth0.com/',
  algorithms: ['RS256'],
  credentialsRequired,
})

function devAuthHandler(req: e.Request, res: e.Response, next: e.NextFunction) {
  const sub = req.header('X-User')

  if (!req.user && sub) {
    const permissionHeader = req.headers['x-permission']
    const permissions = typeof permissionHeader === 'string' ? [permissionHeader] : permissionHeader || []

    req.user = {
      sub,
      permissions,
    } as any
  }

  next()
}

function setUserUri(req: e.Request, _: e.Response, next: e.NextFunction) {
  if (req.user) {
    req.user.id = namedNode(`https://users.wikibus.org/user/${encodeURIComponent(req.user.sub)}`)
  }

  next()
}

export default (production: boolean) => {
  const router = Router()

  router.use(createJwtHandler(false))

  if (!production) {
    router.use(devAuthHandler as any)
  }
  router.use(setUserUri as any)

  return router
}