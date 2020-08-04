import { Term, Variable } from 'rdf-js'
import { SingleContextClownface } from 'clownface'

export interface Pattern {
  subject: Variable
  predicate: Term
  object: SingleContextClownface
}
