import {CONSTRUCT, SELECT} from '@tpluscode/sparql-builder'
import {hydraBox} from '@wikibus/core/namespace';
import {dcterms, dtype, hydra, rdf, schema} from '@tpluscode/rdf-ns-builders';
import * as $rdf from '@rdfjs/data-model'
import {Clownface, SafeClownface, SingleContextClownface} from 'clownface';
import {loaders} from '../loader'

export function getPage(collection: SingleContextClownface, query: Clownface, variables: SafeClownface) {
    const page = Number.parseInt(query.out(hydra.pageIndex).value || '1')

    const type = collection.out(hydra.manages).has(hydra.property, rdf.type).out(hydra.object).terms[0]

    const subject = $rdf.variable('source')
    const filterPatters = variables.out(hydra.mapping).toArray().reduce((patterns, mapping) => {
        const property = mapping.out(hydra.property) as SafeClownface<any>

        if (hydra.pageIndex.equals(property.term)) {
            return patterns
        }

        const value = query.out(property) as SafeClownface<any>
        if (value.values.length === 0) {
            return patterns
        }

        const queryPattern = mapping.out(hydraBox.queryPattern)
        if (!queryPattern.value) {
            return patterns
        }

        const createPattern = loaders.load(queryPattern, {basePath: __dirname})
        return [...patterns, createPattern({
            subject,
            predicate: property.term,
            object: value,
        })]
    }, [])

    const order = $rdf.variable('order')
    const title = $rdf.variable('title')

    return CONSTRUCT`?s ?p ?o. ?is ?io ?ip`
        .WHERE`
        {
            ${SELECT`?g`.WHERE` 
              GRAPH ?g {
                ${subject} a ${type} .
                OPTIONAL { ${subject} ${dtype.orderIndex} ${order} } .
                OPTIONAL { ${subject} ${dcterms.title} ${title} } .
                
                ${filterPatters}
              }
            `.LIMIT(10).OFFSET((page - 1) * 10)
                .ORDER().BY(order, true).ORDER().BY(title)}
        }
        
        GRAPH ?g { ?s ?p ?o }
        optional {
         GRAPH ?g { ?g ${schema.primaryImageOfPage} ?primaryImageOfPage }
         GRAPH ?primaryImageOfPage { ?is ?io ?ip }
        }
        `
}
