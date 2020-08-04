import Client, { StreamClient } from 'sparql-http-client'
import { Quad, Source, Store, Stream, Term } from 'rdf-js'
import rdf from 'rdf-ext'
import { CONSTRUCT } from '@tpluscode/sparql-builder'
import { readable } from './stream-now'
import debug from 'debug'

const log = debug('hydra:store')

export class SparqlStore implements Source, Store {
  private readonly __client: StreamClient

  public constructor({ endpointUrl }: {endpointUrl: string}) {
    this.__client = new Client({
      endpointUrl,
    })
  }

  public deleteGraph(graph: Quad['graph'] | string): any {
    return undefined
  }

  public import(stream: Stream): any {
    return undefined
  }

  public remove(stream: Stream): any {
    return undefined
  }

  public removeMatches(subject?: Term | RegExp, predicate?: Term | RegExp, object?: Term | RegExp, graph?: Term | RegExp): any {
    return undefined
  }

  public match(subject?: Term | RegExp, predicate?: Term | RegExp, object?: Term, graph?: Term): Stream {
    if (graph) {
      return readable(this.__getClassResource(graph) as any, { objectMode: true })
    }

    if (object) {
      return readable(this.__getPropertyResource(object) as any, { objectMode: true })
    }

    return rdf.dataset().toStream()
  }

  private __getClassResource(term: Term) {
    log(`loading resource ${term.value}`)
    return CONSTRUCT`?s ?p ?o`.WHERE`GRAPH ${term} { ?s ?p ?o }`.execute(this.__client.query)
  }

  private async __getPropertyResource(term: Term) {
    log(`loading resource ${term.value} by object usage`)
    return CONSTRUCT`?s ?p ?o`
      .WHERE`GRAPH ?g { ?s ?p ${term} }`
      .execute(this.__client.query)
  }
}
