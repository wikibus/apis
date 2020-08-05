declare module 'hydra-box' {
  import Api = require('hydra-box/Api');
  import middleware = require('hydra-box/middleware');
  import {DatasetCore, Term} from 'rdf-js';

  namespace hydraBox {
    interface Resource {
      term: Term,
      dataset: DatasetCore,
      types: Set<Term>
    }

    interface PropertyResource extends Resource {
      property: Term;
      object: Term;
    }

    interface ResourceLoader {
      forClassOperation (term: Term): Promise<Array<Resource>>
      forPropertyOperation (term: Term): Promise<Array<PropertyResource>>
    }
  }

  const hydraBox: {
    Api: Api;
    middleware: typeof middleware;
  }

  export = hydraBox
}
