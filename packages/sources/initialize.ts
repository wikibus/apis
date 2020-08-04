import Parser from '@rdfjs/parser-n3'
import initial from './hydra/initial'
import { log } from '@wikibus/hydra-box-helpers/log'
import type StreamClient from 'sparql-http-client/StreamClient'

const parser = new Parser()

export async function bootstrapResources(client: StreamClient, baseIRI: string) {
  const initialQuads = parser.import(initial(baseIRI), { baseIRI })

  log('Bootstrapping API resources')
  return client.store.put(initialQuads)
}
