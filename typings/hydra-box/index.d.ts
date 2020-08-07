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

declare module 'hydra-box/Api' {
  import { DatasetCore, NamedNode, Term } from 'rdf-js'

  namespace Api {
    interface Options {
      term?: Term;
      dataset?: DatasetCore;
      graph?: NamedNode;
      path: string;
      codePath: string;
    }
  }

  interface Api {
    initialized: boolean;
    path: string;
    codePath: string;
    graph: NamedNode;
    dataset: DatasetCore;
    term: Term;
    init(): void;
    fromFile(filePath: string, options?: Api.Options): Promise<this>;
    rebase(from: string, to: string): this;
  }

  class Api {
    public constructor(options?: Api.Options)
    public static fromFile (filePath: string, options?: Api.Options): Promise<Api>
  }

  export = Api
}
