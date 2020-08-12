import asyncMiddleware from 'middleware-async'
import clownface from 'clownface'
import { query } from '@wikibus/core/namespace'
import $rdf from 'rdf-ext'
import TermSet from '@rdfjs/term-set'
import { restrictedHandler } from './restrictedResource'
import { loadLinkedResources } from '../query/eagerLinks'

export const get = restrictedHandler(asyncMiddleware(async (req, res) => {
  const types = clownface({
    dataset: req.hydra.api.dataset,
    term: [...req.hydra.resource.types],
  })
  const pointer = clownface(req.hydra.resource)

  if (req.user && req.user.id) {
    res.dataset($rdf.dataset([...req.hydra.resource.dataset])
      .merge(await loadLinkedResources(pointer, types.out(query.include), req.sparql)))
    return
  }

  const restrictedProperties = new TermSet([...types.out(query.restrict).terms])

  res.dataset($rdf.dataset([...req.hydra.resource.dataset])
    .filter(quad => !restrictedProperties.has(quad.predicate))
    .merge(await loadLinkedResources(pointer, types.out(query.include), req.sparql)))
}))
