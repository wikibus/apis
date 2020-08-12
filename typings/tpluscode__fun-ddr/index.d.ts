import FunDDR, { Entity } from '@tpluscode/fun-ddr'
import { NamedNode } from 'rdf-js'

declare module 'express-serve-static-core' {

  interface Repository<E extends Entity> extends FunDDR.Repository<E> {
    load(id: string | NamedNode): ReturnType<FunDDR.Repository<E>['load']>
  }
}
