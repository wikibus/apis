import {DatasetCore, NamedNode, Term} from 'rdf-js';
import {AnyContext} from 'clownface';

declare global {
  namespace clownface {
    export interface Clownface<T extends AnyContext, D extends DatasetCore> {
      fetch(): Clownface<T, D>

      failures?: Map<Term, {
        term: NamedNode,
        value: {
          response: Response | null
          error?: Error
        }
      }>
    }
  }
}
