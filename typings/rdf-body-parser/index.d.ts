import SparqlHttp from 'sparql-http-client'
import { Api } from 'hydra-box'
import { DatasetCore, NamedNode, Store, Source } from 'rdf-js'
import { SingleContextClownface } from 'clownface'

declare module 'express-serve-static-core' {

  interface Request {
    sparql: SparqlHttp;
    hydra: {
      api: typeof Api;
      store: Store & Source;
      term: NamedNode;
      resource: {
        term: NamedNode;
        dataset: DatasetCore;
        types: Set<NamedNode>;
      };
      operation: SingleContextClownface
    };
  }
}
