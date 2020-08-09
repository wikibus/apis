import asyncMiddleware from 'middleware-async'
import clownface from 'clownface'
import { query } from '@wikibus/core/namespace'
import $rdf from 'rdf-ext'
import TermSet from '@rdfjs/term-set'

export const get = asyncMiddleware(async (req, res) => {
  const types = clownface({
    dataset: req.hydra.api.dataset,
    term: [...req.hydra.resource.types],
  })

  if (req.user && req.user.id) {
    res.dataset(req.hydra.resource.dataset)
    return
  }

  const restrictedProperties = new TermSet([...types.out(query.restrict).terms])

  res.dataset(
    $rdf.dataset([...req.hydra.resource.dataset])
      .filter(quad => !restrictedProperties.has(quad.predicate)))
})
