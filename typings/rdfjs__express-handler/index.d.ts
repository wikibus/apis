import { DatasetCore, Stream } from 'rdf-js'

declare module 'express-serve-static-core' {
  interface Request {
    dataset(): Promise<DatasetCore>;
    quadStream(): Stream;
  }

  interface Response {
    dataset(dataset: DatasetCore): void;
    quadStream(stream: Stream): void;
  }
}
