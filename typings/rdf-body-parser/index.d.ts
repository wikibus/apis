import SparqlHttp from 'sparql-http-client'
import { Api } from 'hydra-box'
import { DatasetCore, NamedNode, Store, Source } from 'rdf-js'
import { GraphPointer } from 'clownface'

declare module 'express-serve-static-core' {

  interface Request {
    sparql: SparqlHttp;
    user?: {
      id: NamedNode
      sub: string
      permissions: string[]
    },
    hydra: {
      api: typeof Api;
      store: Store & Source;
      term: NamedNode;
      resource: {
        term: NamedNode;
        dataset: DatasetCore;
        types: Set<NamedNode>;
      };
      operation: GraphPointer
    };
  }
}
