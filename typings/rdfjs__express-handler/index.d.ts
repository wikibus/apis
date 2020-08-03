import { Params, ParamsDictionary } from 'express-serve-static-core'
import { DatasetCore, Stream } from 'rdf-js'

declare module 'express' {
  interface Request<P extends Params = ParamsDictionary> {
    dataset(): Promise<DatasetCore>;
    quadStream(): Stream;
  }

  interface Response {
    dataset(dataset: DatasetCore): void;
    quadStream(stream: Stream): void;
  }
}
