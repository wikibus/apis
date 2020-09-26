import SparqlHttp from 'sparql-http-client'
import { Api } from 'hydra-box'
import { DatasetCore, NamedNode, Store, Source } from 'rdf-js'
import { GraphPointer } from 'clownface'

declare module 'express-serve-static-core' {

  interface Request {
    sparql: SparqlHttp;
  }
}
