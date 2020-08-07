import { RdfineEntity } from '@tpluscode/fun-ddr-rdfine'
import { Constructor, property } from '@tpluscode/rdfine'
import { Brochure } from '../index'
import { wbo } from '@wikibus/core/namespace'
import { hydra, schema } from '@tpluscode/rdf-ns-builders'
import { NamedNode } from 'rdf-js'
import { Initializer } from '@tpluscode/rdfine/RdfResource'

export function BrochureMixin<Base extends Constructor<RdfineEntity>>(base: Base) {
  class BrochureClass extends base implements Brochure {
    @property.literal({ path: schema.identifier })
    identifier!: string

    @property.literal({ path: schema.title })
    title!: string
  }

  return BrochureClass
}

BrochureMixin.appliesTo = wbo.Brochure

export default function (term: NamedNode, title: string): Brochure {
  class Impl extends BrochureMixin(RdfineEntity) {
    constructor(term: NamedNode, init: Initializer<Brochure>) {
      super(term, init)
      this.types.add(wbo.Source)
      this.types.add(wbo.Brochure)
      this.types.add(hydra.Resource)
    }
  }

  return new Impl(term, { title })
}
