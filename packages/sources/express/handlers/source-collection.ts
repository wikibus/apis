import asyncMiddleware from 'middleware-async'
import clownface, { Clownface } from 'clownface'
import $rdf from 'rdf-ext'
import { getPage } from '../../query/source-collection'
import { hydra, rdf } from '@tpluscode/rdf-ns-builders'
import { hex, hydraBox } from '@wikibus/core/namespace'
import { IriTemplateMixin } from '@rdfine/hydra'

const pageSize = 12

function templateParamsForPage(query: Clownface, page: number) {
  const clone = clownface({ dataset: $rdf.dataset([...query.dataset]) })
    .in().toArray()[0]

  if (!clone) {
    return clownface({ dataset: $rdf.dataset() }).blankNode().addOut(hydra.pageIndex, page)
  }

  return clone.deleteOut(hydra.pageIndex).addOut(hydra.pageIndex, page)
}

export const get = asyncMiddleware(async (req, res) => {
  const dataset = $rdf.dataset([...req.hydra.resource.dataset])
  const collection = clownface({ dataset }).namedNode(req.hydra.resource.term)

  const query = clownface({ dataset: await req.dataset() })
  const template = new IriTemplateMixin.Class(req.hydra.operation.out(hydraBox.variables).toArray()[0])
  const pageQuery = getPage(collection, query, template, pageSize)

  const page = await pageQuery.members.execute(req.sparql.query)
  let total = 0
  for await (const result of await pageQuery.totals.execute(req.sparql.query)) {
    total = Number.parseInt(result.count.value)
  }
  await dataset.import(page)

  collection.namedNode(req.hydra.resource.term)
    .addOut(hydra.member, clownface({ dataset }).has(rdf.type, collection.out(hydra.manages).has(hydra.property, rdf.type).out(hydra.object)))
    .addOut(hex.currentMappings, currMappings => {
      template.mapping.forEach(mapping => {
        const property = mapping.property.id
        currMappings.addOut(property, query.out(property))
      })
    })
    .addOut(hydra.totalItems, total)
    .addOut(hydra.view, view => {
      const pageIndex = Number.parseInt(query.out(hydra.pageIndex).value || '1')
      const totalPages = Math.floor(total / pageSize) + 1

      view.addOut(rdf.type, hydra.PartialCollectionView)
      view.addOut(hydra.first, $rdf.namedNode(template.expand(templateParamsForPage(query, 1))))
      view.addOut(hydra.last, $rdf.namedNode(template.expand(templateParamsForPage(query, totalPages))))
      if (pageIndex > 1) {
        view.addOut(hydra.previous, $rdf.namedNode(template.expand(templateParamsForPage(query, pageIndex - 1))))
      }
      if (pageIndex < totalPages) {
        view.addOut(hydra.next, $rdf.namedNode(template.expand(templateParamsForPage(query, pageIndex + 1))))
      }
    })

  res.setLink(req.hydra.resource.term.value, 'canonical')
  res.dataset(dataset)
})
