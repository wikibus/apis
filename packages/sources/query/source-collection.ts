import { CONSTRUCT, SELECT } from '@tpluscode/sparql-builder'
import { hydraBox } from '@wikibus/core/namespace'
import { dcterms, dtype, hydra, rdf, schema } from '@tpluscode/rdf-ns-builders'
import * as $rdf from '@rdfjs/data-model'
import { Clownface, SafeClownface, SingleContextClownface } from 'clownface'
import { loaders } from '../loader'
import { sparql } from '@tpluscode/rdf-string'
import { IriTemplate } from '@rdfine/hydra'

export function getPage(collection: SingleContextClownface, query: Clownface, variables: IriTemplate, pageSize: number) {
  const page = Number.parseInt(query.out(hydra.pageIndex).value || '1')

  const type = collection.out(hydra.manages).has(hydra.property, rdf.type).out(hydra.object).terms[0]

  const subject = $rdf.variable('source')
  const filterPatters = variables.mapping.reduce<unknown[]>((patterns, mapping) => {
    const property = mapping.property

    if (hydra.pageIndex.equals(property.id)) {
      return patterns
    }

    const value = query.out(property.id) as SafeClownface<any>
    if (value.values.length === 0) {
      return patterns
    }

    const queryPattern = mapping._selfGraph.out(hydraBox.queryPattern)
    if (!queryPattern.value) {
      return patterns
    }

    const createPattern = loaders.load(queryPattern, { basePath: __dirname })
    return [...patterns, createPattern({
      subject,
      predicate: property.id,
      object: value,
    })]
  }, [])

  const order = $rdf.variable('order')
  const title = $rdf.variable('title')

  const memberPatterns = sparql`
        ${subject} a ${type} . 
        ${filterPatters}`

  return {
    members: CONSTRUCT`?s ?p ?o. ?is ?io ?ip`.WHERE`
        {
            ${SELECT`?g`.WHERE` 
              GRAPH ?g {
                ${memberPatterns}
                
                OPTIONAL { ${subject} ${dtype.orderIndex} ${order} } .
                OPTIONAL { ${subject} ${dcterms.title} ${title} } .
              }
            `.LIMIT(pageSize).OFFSET((page - 1) * pageSize)
    .ORDER().BY(order, true).ORDER().BY(title)}
        }
        
        GRAPH ?g { ?s ?p ?o }
        optional {
         GRAPH ?g { ?g ${schema.primaryImageOfPage} ?primaryImageOfPage }
         GRAPH ?primaryImageOfPage { ?is ?io ?ip }
        }`,
    totals: SELECT`(count(${subject}) as ?count)`.WHERE`GRAPH ?g { ${memberPatterns} }`,
  }
}
