import Parser from '@rdfjs/parser-n3'
import rdf from 'rdf-ext'
import initial from './hydra/initial';

const parser = new Parser()

export async function bootstrapResources(client, baseIRI) {
    const initialQuads = parser.import(initial(baseIRI), { baseIRI })

    const dataset = await rdf.dataset().import(initialQuads)

    return client.store.put(dataset.toStream())
}
