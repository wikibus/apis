import { Constructor, property } from '@tpluscode/rdfine'
import { RdfineEntity } from '@tpluscode/fun-ddr-rdfine'
import { Source } from '../index'
import { NamedNode } from 'rdf-js'
import { schema } from '@tpluscode/rdf-ns-builders'
import { wba } from '@wikibus/core/namespace'

export function SourceMixin<Base extends Constructor<RdfineEntity>>(base: Base) {
  class SourceClass extends base implements Source {
    @property({ path: schema.associatedMedia })
    file!: NamedNode

    @property({ path: wba.images })
    images!: NamedNode
  }

  return SourceClass
}
