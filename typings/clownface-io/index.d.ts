declare module 'clownface-io' {
  import {DataFactory, DatasetCore, DatasetCoreFactory, Quad, Term} from 'rdf-js';
  import Context from 'clownface/lib/Context';

  interface ClownfaceIoInit<D extends DatasetCore, T extends Term> {
    dataset: DatasetCore
    graph?: Quad['graph']
    term?: Term
    value?: string
    factory?: DataFactory & DatasetCoreFactory
    _context?: Context<D, T>
  }

  const factory: <D extends DatasetCore, T extends Term>(init?: ClownfaceIoInit<D, T>) => any
  export = factory
}
