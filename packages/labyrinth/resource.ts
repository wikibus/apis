import asyncMiddleware from 'middleware-async'
import clownface from 'clownface'
import { auth, query } from './lib/namespace'
import $rdf from 'rdf-ext'
import TermSet from '@rdfjs/term-set'
import { loadLinkedResources } from './lib/query/eagerLinks'
import { Router } from 'express'
import guard = require('express-jwt-permissions')

const permission = guard()

export function protectedResource(...handlers: any[]) {
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

export const get = protectedResource(asyncMiddleware(async (req, res) => {
  const types = clownface({
    dataset: req.hydra.api.dataset,
    term: [...req.hydra.resource.types],
  })

  let dataset = $rdf.dataset([...req.hydra.resource.dataset])
  if (!(req.user && req.user.id)) {
    const restrictedProperties = new TermSet([...types.out(query.restrict).terms])
    dataset = dataset.filter(quad => !restrictedProperties.has(quad.predicate))
  }

  const pointer = clownface({ dataset, term: req.hydra.resource.term })
  res.dataset(dataset.merge(await loadLinkedResources(pointer, types.out(query.include), req.sparql)))
}))
