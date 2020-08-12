import { restrictedHandler } from '@wikibus/hydra-box-helpers/handlers/restrictedResource'
import { create } from '../../../domain/brochure/create'
import asyncMiddleware from 'middleware-async'
import clownface from 'clownface'
import { RdfineEntity } from '@tpluscode/fun-ddr-rdfine'
import { Brochure } from '../../../domain'
import { BrochureMixin } from '../../../domain/brochure'
import { rdf } from '@tpluscode/rdf-ns-builders'
import { wbo } from '@wikibus/core/namespace'
import { brochures } from '../../../repository'

export const post = restrictedHandler(asyncMiddleware(async (req, res, next) => {
  const pointer = clownface({ dataset: await req.dataset() }).has(rdf.type, wbo.Brochure).toArray()[0]
  const brochure = RdfineEntity.factory.createEntity<Brochure>(pointer, [BrochureMixin])

  const contributor = req.user!.id

  create({ brochure, contributor })
    .commit(brochures)
    .then(saved => {
      res.setLink('Location', saved['@id'])
      res.status(201)
      res.dataset(saved._selfGraph.dataset)
    })
    .catch(next)
}))
