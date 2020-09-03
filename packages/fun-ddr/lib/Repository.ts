import { Repository } from '@tpluscode/fun-ddr'
import { AggregateRootImpl } from '@tpluscode/fun-ddr/lib/AggregateRootImpl'
import { EntityResource, RdfineEntity } from './RdfineEntity'
import { AggregateRoot } from '@tpluscode/fun-ddr/lib'
import { NamedNode } from 'rdf-js'
import { namedNode } from '@rdfjs/data-model'
import { CONSTRUCT, DELETE, SELECT } from '@tpluscode/sparql-builder'
import { AggregateNotFoundError, ConcurrencyError } from '@tpluscode/fun-ddr/lib/errors'
import { vaem } from '@tpluscode/rdf-ns-builders'
import StreamClient from 'sparql-http-client/StreamClient'
import rdf from 'rdf-ext'
import toStream from 'rdf-dataset-ext/toStream'
import clownface from 'clownface'
import ToQuad from 'rdf-transform-triple-to-quad'

export class SparqlRepository<E extends EntityResource, T extends Record<string, any> = Record<string, any>> implements Repository<E> {
  private client: StreamClient;
  private metaGraph = namedNode('urn:fun-ddr:meta')

  constructor(client: StreamClient) {
    this.client = client
  }

  async delete(id: string): Promise<void> {
    throw new Error('Not implemented')
  }

  async load(id: string | NamedNode): Promise<AggregateRoot<E, T>> {
    const term = typeof id === 'string' ? namedNode(id) : id

    const stream = await CONSTRUCT`?s ?p ?o`.WHERE`GRAPH ${term} { ?s ?p ?o }`.execute(this.client.query) as any
    const dataset = await rdf.dataset().import(stream.pipe(new ToQuad(term)))

    if (dataset.size === 0) {
      return new AggregateRootImpl<E, T>(new AggregateNotFoundError(term.value))
    }

    const pointer = clownface({
      dataset,
      term,
      graph: term,
    })
    const state = RdfineEntity.factory.createEntity<E>(pointer, [RdfineEntity])

    const version = await this.__getVersion(state.id) || 1
    return new AggregateRootImpl<E, T>(state, version)
  }

  async save(ar: AggregateRoot<E, T>): Promise<void> {
    const state = await ar.state
    if (!state) {
      throw new Error(`Failed to save aggregate: ${await ar.error}`)
    }

    const latestVersion = await this.__getVersion(state.id)
    const nextVersion = ar.version + 1

    if (latestVersion >= nextVersion) {
      throw new ConcurrencyError(state['@id'], latestVersion, nextVersion)
    }

    await this.client.store.put(toStream(state.pointer.dataset))
    await this.__updateVersion(state.id, nextVersion)
  }

  private async __getVersion(id: NamedNode): Promise<number> {
    const query = await SELECT`?version`
      .FROM(this.metaGraph)
      .WHERE`${id} ${vaem.revision} ?version`
      .LIMIT(1)
      .execute(this.client.query)

    for await (const result of query) {
      return parseInt(result.version.value)
    }

    return 0
  }

  private __updateVersion(id: NamedNode, version: number): Promise<void> {
    return DELETE`GRAPH ${this.metaGraph} {
        ${id} ${vaem.revision} ?version .
      }`
      .INSERT`GRAPH ${this.metaGraph} {
        ${id} ${vaem.revision} ${version} .
      }`
      .WHERE`GRAPH ${this.metaGraph} {
        OPTIONAL { ${id} ${vaem.revision} ?version . }
      }`
      .execute(this.client.query)
  }
}
