import {Request} from 'express'
import asyncMiddleware from 'middleware-async'
import clownface from 'clownface-io'
import $rdf from 'rdf-ext'
import { getPage } from '../../query/source-collection';
import { hydra, rdf } from '@tpluscode/rdf-ns-builders';
import { hex, hydraBox } from '@wikibus/core/namespace';

export const get = asyncMiddleware(async (req: Request, res) => {
    const dataset = $rdf.dataset([...req.hydra.resource.dataset])
    const collection = clownface({ dataset }).namedNode(req.hydra.resource.term)

    const query = clownface({ dataset: await req.dataset() })
    const template = req.hydra.operation.out(hydraBox.variables)
    const pageQuery = getPage(collection, query, template)

    const page = await pageQuery.execute(req.sparql.query)
    await dataset.import(page)

    collection.namedNode(req.hydra.resource.term)
        .addOut(hydra.member, clownface({ dataset }).has(rdf.type, collection.out(hydra.manages).has(hydra.property, rdf.type).out(hydra.object)))
        .addOut(hex.currentMappings, currMappings => {
            template.out(hydra.mapping).forEach(mapping => {
                const property = mapping.out(hydra.property)
                currMappings.addOut(property, query.out(property))
            })
        })
        .addOut(hydra.view)

    res.setLink(req.hydra.resource.term.value, 'canonical')
    res.dataset(dataset)
})
