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

  let dataset = $rdf.dataset([...req.hydra.resource.dataset])
  if (!(req.user && req.user.id)) {
    const restrictedProperties = new TermSet([...types.out(query.restrict).terms])
    dataset = dataset.filter(quad => !restrictedProperties.has(quad.predicate))
  }

  const pointer = clownface({ dataset, term: req.hydra.resource.term })
  res.dataset(dataset.merge(await loadLinkedResources(pointer, types.out(query.include), req.sparql)))
}))
