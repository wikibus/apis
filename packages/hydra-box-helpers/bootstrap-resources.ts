import Parser from '@rdfjs/parser-n3'
import type StreamClient from 'sparql-http-client/StreamClient'
import { log } from './log'

const parser = new Parser()

export async function bootstrapResources(initial: (base: string) => NodeJS.ReadableStream, client: StreamClient, baseIRI: string) {
  const initialQuads = parser.import(initial(baseIRI), { baseIRI })

  log('Bootstrapping API resources')
  return client.store.put(initialQuads)
}
