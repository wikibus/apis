import { Router } from 'express'
import { auth } from '@wikibus/core/namespace'
import guard = require('express-jwt-permissions')

const permission = guard()

export function restrictedHandler(...handlers: any[]) {
  const router = Router()

  router.use((req, res, next) => {
    const authRequired = req.hydra.operation.out(auth.required).value === 'true'
    const permissions = [...req.hydra.operation.out(auth.permissions).list()]

    if (authRequired || permissions.length > 0) {
      return permission.check(permissions.map(p => p.value))(req, res, next)
    }

    next()
  })
  router.use(...handlers)

  return router
}
