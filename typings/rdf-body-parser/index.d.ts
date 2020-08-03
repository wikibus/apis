import { Request } from 'express'
import SparqlHttp from 'sparql-http-client'
import { Api } from 'hydra-box'
import { DatasetCore, NamedNode, Store, Source } from 'rdf-js'
import { Params, ParamsDictionary } from 'express-serve-static-core'
import { SingleContextClownface } from 'clownface'

declare module 'express' {

  interface Request<P extends Params = ParamsDictionary> {
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
