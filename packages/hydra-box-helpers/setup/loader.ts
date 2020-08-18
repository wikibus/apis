import { Term } from 'rdf-js'
import $rdf from 'rdf-ext'
import { PropertyResource, Resource, ResourceLoader } from 'hydra-box'
import { CONSTRUCT, SELECT } from '@tpluscode/sparql-builder'
import debug from 'debug'
import ParsingClient from 'sparql-http-client/ParsingClient'
import clownface from 'clownface'
import TermSet from '@rdfjs/term-set'
import { rdf } from '@tpluscode/rdf-ns-builders'
import { query } from '@wikibus/core/namespace'
import { Request } from 'express'
import { loaders } from '../loader'

const log = debug('hydra:store')

export class SparqlQueryLoader implements ResourceLoader {
  private readonly __client: ParsingClient
  private readonly __codePath: string

  public constructor({ client, codePath }: {client: ParsingClient; codePath: string }) {
    this.__client = client
    this.__codePath = codePath
  }

  async load(term: Term, req: Request): Promise<Resource | null> {
    const dataset = $rdf.dataset(await CONSTRUCT`?s ?p ?o`.WHERE`GRAPH ${term} { ?s ?p ?o }`.execute(this.__client.query))

    if (dataset.size === 0) {
      return null
    }

    const pointer = clownface({ dataset, term })

    const enrichment = clownface(req.hydra.api).node(pointer.out(rdf.type).terms)
      .out(query.posptrocess).map(pointer => loaders.load(pointer, { basePath: this.__codePath }))
    const resourcePointer = clownface({ dataset }).node(term)
    enrichment.forEach(enrich => enrich(req, resourcePointer))

    return {
      term,
      dataset,
      types: new TermSet(pointer.out(rdf.type).terms),
    }
  }

  async forClassOperation(term: Term, req: Request): Promise<[Resource] | []> {
    log(`loading resource ${term.value}`)
    const resource = await this.load(term, req)

    return resource ? [resource] : []
  }

  async forPropertyOperation(term: Term, req: Request): Promise<PropertyResource[]> {
    log(`loading resource ${term.value} by object usage`)
    const bindings = await SELECT`?g ?link`
      .WHERE`GRAPH ?g { ?g ?link ${term} }`
      .execute(this.__client.query)

    const candidates = await Promise.all(bindings.map<Promise<PropertyResource | null>>(async result => {
      const resource = await this.load(result.g, req)
      if (!resource) return null

      return {
        property: result.link,
        object: term,
        ...resource,
      }
    }))

    return candidates.reduce<Array<PropertyResource>>((previous, current) => {
      if (!current) return previous

      return [...previous, current]
    }, [])
  }
}
