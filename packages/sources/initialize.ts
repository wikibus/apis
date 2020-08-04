import Parser from '@rdfjs/parser-n3'
import initial from './hydra/initial';
import {log} from '@wikibus/hydra-box-helpers/log'

const parser = new Parser()

export async function bootstrapResources(client, baseIRI) {
    const initialQuads = parser.import(initial(baseIRI), { baseIRI })

    log('Bootstrapping API resources')
    return client.store.put(initialQuads)
}
