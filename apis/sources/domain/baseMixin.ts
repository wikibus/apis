import { Constructor, namespace, property } from '@tpluscode/rdfine'
import { RdfineEntity } from '@tpluscode/fun-ddr-rdfine'
import { dcterms } from '@tpluscode/rdf-ns-builders'
import { WikibusEntity } from './index'

export function BaseMixin <Base extends Constructor<RdfineEntity>>(base: Base) {
  @namespace(dcterms)
  class BaseEntity extends base implements WikibusEntity {
    @property.literal({ type: Date, initial: () => new Date() })
    created!: Date

    @property.literal({ type: Date })
    modified!: Date
  }

  return BaseEntity
}
