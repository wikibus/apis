import BaseClient from 'sparql-http-client/BaseClient'
import StreamQuery from 'sparql-http-client/StreamQuery';
import {Quad, Term} from 'rdf-js';
import StreamStore from 'sparql-http-client/StreamStore';
import {CONSTRUCT, INSERT} from '@tpluscode/sparql-builder';
import {sparql, SparqlTemplateResult} from '@tpluscode/rdf-string';
import Endpoint from 'sparql-http-client/Endpoint';
import * as SparqlHttp from 'sparql-http-client';
import toString from 'stream-to-string'

function graphPattern(graph, data) {
    if(graph.termType === 'DefaultGraph') {
        return sparql`${data}`
    }

    return sparql`GRAPH ${graph} { ${data} }`
}

class SparqlUpdateStore extends StreamStore {
    readonly client: StreamQuery

    constructor({ endpoint, factory, maxQuadsPerRequest }) {
        super({ endpoint, factory, maxQuadsPerRequest } as any);

        this.client = new StreamQuery({ endpoint, factory })
    }

    read ({ graph }: { graph: Term }) {
        return CONSTRUCT`?s ?p ?o`.WHERE`${graphPattern(graph, '?s ?p ?o')}`.execute(this.client)
    }

    async writeRequest (method, graph: Term, stream: any) {
        const quadData = await toString(stream)
        let query: SparqlTemplateResult

        const graphRef = sparql`${graph.termType === 'DefaultGraph' ? 'DEFAULT' : sparql`GRAPH ${graph}`}`
        switch (method.toUpperCase()) {
            case 'PUT':
                query = sparql`
                    DROP SILENT ${graphRef};
                    INSERT DATA {
                      ${graphPattern(graph, quadData)}
                    }
                `
                break;
            case 'DELETE':
                query = sparql`DROP ${graphRef}`
                break;
            case 'POST':
                query = INSERT.DATA`${graphPattern(graph, quadData)}`._getTemplateResult()
                break
            default:
                throw new Error(`Unexpected HTTP method ${method}`)
        }

        return this.client.update(query.toString())
    }
}

export default class HybridClient extends BaseClient<StreamQuery, Quad, SparqlUpdateStore> {
    constructor(options: SparqlHttp.StreamClientOptions) {
        super({
            endpoint: new Endpoint(options),
            Query: StreamQuery,
            Store: SparqlUpdateStore,
            ...options,
        });
    }
}
