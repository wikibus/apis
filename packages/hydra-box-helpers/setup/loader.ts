import { Term } from 'rdf-js'
import $rdf from 'rdf-ext'
import { PropertyResource, Resource, ResourceLoader } from 'hydra-box'
import { CONSTRUCT, SELECT } from '@tpluscode/sparql-builder'
import debug from 'debug'
import ParsingClient from 'sparql-http-client/ParsingClient'
import clownface from 'clownface'
import TermSet from '@rdfjs/term-set'
import { rdf } from '@tpluscode/rdf-ns-builders'

const log = debug('hydra:store')

export class SparqlQueryLoader implements ResourceLoader {
  private readonly __client: ParsingClient

  public constructor({ client }: {client: ParsingClient}) {
    this.__client = client
  }

  async load(term: Term): Promise<Resource | null> {
    log(`loading resource ${term.value}`)
    const dataset = $rdf.dataset(await CONSTRUCT`?s ?p ?o`.WHERE`GRAPH ${term} { ?s ?p ?o }`.execute(this.__client.query))

    if (dataset.size === 0) {
      return null
    }

    const types = new TermSet(clownface({ dataset, term }).out(rdf.type).terms)

    return {
      term,
      dataset,
      types,
    }
  }

  async forClassOperation(term: Term) {
    const resource = await this.load(term)

    return resource ? [resource] : []
  }

  async forPropertyOperation(term: Term): Promise<PropertyResource[]> {
    log(`loading resource ${term.value} by object usage`)
    const bindings = await SELECT`?g ?link ${term}`
      .WHERE`GRAPH ?g { ?g ?link ${term} }`
      .execute(this.__client.query)

    const candidates = await Promise.all(bindings.map<Promise<PropertyResource | null>>(async result => {
      const resource = await this.load(result.g)
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