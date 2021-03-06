import { protectedResource } from '@hydrofoil/labyrinth/resource'
import { create } from '../../domain/brochure/create'
import asyncMiddleware from 'middleware-async'
import clownface from 'clownface'
import { RdfineEntity } from '@tpluscode/fun-ddr-rdfine'
import { Brochure } from '../../domain'
import { BrochureMixin } from '../../domain/brochure'
import { rdf } from '@tpluscode/rdf-ns-builders'
import { wbo } from '@wikibus/core/namespace'
import { brochures } from '../../repository'
import { Sources } from '@wikibus/core/permissions'
import { updateDetails } from '../../domain/brochure/updateDetails'
import { Request } from 'express'
import { setLocation } from '../../domain/brochure/setLocation'
import { preprocess } from '../../query/source/brochure'
import createError = require('http-errors')

async function getRequestBrochure(req: Request) {
  const pointer = clownface({ dataset: await req.dataset() }).has(rdf.type, wbo.Brochure).toArray()[0]
  return RdfineEntity.factory.createEntity<Brochure>(pointer, [BrochureMixin])
}

export const post = protectedResource(asyncMiddleware(async (req, res, next) => {
  const brochure = await getRequestBrochure(req)

  const contributor = req.user!.id

  create({ brochure, contributor })
    .commit(brochures)
    .then(async saved => {
      res.setHeader('Location', saved['@id'])
      res.status(201)
      await preprocess(req, saved.pointer)
      return res.dataset(saved.pointer.dataset)
    })
    .catch(next)
}))

export const put = protectedResource(asyncMiddleware(async (req, res, next) => {
  let aggregate = await brochures.load(req.hydra.resource.term)
  const brochure = await aggregate.state
  if (req.user && brochure && req.user.permissions.includes(Sources.admin) && brochure.ownedBy(req.user.id)) {
    return next(new createError.ForbiddenError())
  }

  const requestPayload = await getRequestBrochure(req)
  aggregate = aggregate.mutation(updateDetails)(requestPayload)

  if (req.user?.permissions.includes(Sources.admin)) {
    aggregate = aggregate.mutation(setLocation)(requestPayload)
  }

  return aggregate.commit(brochures)
    .then(async saved => {
      await preprocess(req, saved.pointer)
      return res.dataset(saved.pointer.dataset)
    })
    .catch(next)
}))
