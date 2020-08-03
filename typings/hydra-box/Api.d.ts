declare module 'hydra-box/Api' {
  import { DatasetCore, NamedNode, Term } from 'rdf-js'

  namespace Api {
    interface ApiOptions {
      term?: Term;
      dataset?: DatasetCore;
      graph?: NamedNode;
      path: string;
      codePath: string;
    }

    interface Api {
      initialized: boolean;
      path: string;
      codePath: string;
      graph: NamedNode;
      dataset: DatasetCore;
      term: Term;
      init(): void;
      fromFile(filePath: string): Promise<this>;
      rebase(from: string, to: string): this;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Api extends Api.Api {}
  class Api {
    public constructor(options?: Api.ApiOptions)
    public static fromFile (filePath: string, options?: Api.ApiOptions): Promise<Api>
  }

  export = Api
}
