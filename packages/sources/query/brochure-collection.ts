import { DESCRIBE, SELECT } from '@tpluscode/sparql-builder'
import {hydraBox, wbo} from '@wikibus/core/namespace';
import {dcterms, dtype, hydra, schema} from '@tpluscode/rdf-ns-builders';
import * as rdf from '@rdfjs/data-model'
import {Clownface, SafeClownface} from 'clownface';
import {loaders} from '../loader'

export function getPage(query: Clownface, variables: SafeClownface) {
    const page = Number.parseInt(query.out(hydra.pageIndex).value || '1')

    const brochure = rdf.variable('brochure')
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
            subject: brochure,
            predicate: property.term,
            object: value,
        })]
    }, [])

    const order = rdf.variable('order')
    const title = rdf.variable('title')

    return DESCRIBE`?brochure ?primaryImage ?primaryImageThumb`
        .WHERE`
            ${SELECT`?brochure ?primaryImage ?primaryImageThumb`.WHERE` 
              GRAPH ?g {
                ?brochure a ${wbo.Brochure} .
                OPTIONAL { ?brochure ${dtype.orderIndex} ${order} } .
                OPTIONAL { ?brochure ${dcterms.title} ${title} } .
                OPTIONAL { ?brochure ${schema.primaryImageOfPage} ?primaryImage } .
                OPTIONAL { ?brochure ${schema.primaryImageOfPage}/${schema.thumbnail} ?primaryImageThumb }
                
                ${filterPatters}
              }
            `.LIMIT(10).OFFSET((page - 1) * 10)
                .ORDER().BY(order, true).ORDER().BY(title)}
        `
}
