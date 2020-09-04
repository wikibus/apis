import { Constructor, property } from '@tpluscode/rdfine'
import { RdfineEntity } from '@tpluscode/fun-ddr-rdfine'
import { NamedNode } from 'rdf-js'
import { schema } from '@tpluscode/rdf-ns-builders'
import { wba } from '@wikibus/core/namespace'
import { Source } from '../index'
import { BaseMixin } from '../baseMixin'

export function SourceMixin<Base extends Constructor<RdfineEntity>>(base: Base) {
  class SourceClass extends BaseMixin(base) implements Source {
    @property({ path: schema.associatedMedia })
    file!: NamedNode

    @property({ path: wba.images })
    imagesLink!: NamedNode

    @property({ path: schema.image, values: 'array' })
    images!: NamedNode[]

    @property.literal({ path: schema.identifier })
    identifier!: string
  }

  return SourceClass
}
