import RdfResourceImpl, { RdfResource } from '@tpluscode/rdfine'
import clownface from 'clownface'
import rdf from 'rdf-ext'
import { NamedNode } from 'rdf-js'
import { Entity } from '@tpluscode/fun-ddr'
import { Initializer, ResourceNode } from '@tpluscode/rdfine/RdfResource'
import DatasetExt from 'rdf-ext/lib/Dataset'

export interface EntityResource extends RdfResource, Entity {
  id: NamedNode
}

export class RdfineEntity extends RdfResourceImpl implements EntityResource, Entity {
  constructor(term: NamedNode | ResourceNode<DatasetExt>, initializer?: Initializer<RdfResource>) {
    if ('termType' in term) {
      super(clownface({ dataset: rdf.dataset(), term, graph: term }), initializer)
    } else {
      super(term, initializer)
    }
  }

  get id(): NamedNode {
    if (super.id.termType === 'BlankNode') {
      throw new Error('Entity cannot be identified by a blank node')
    }

    return super.id
  }

  get '@id'() {
    return this.id.value
  }

  get '@type'() {
    return [...this.types.values()].map(t => t.id.value)
  }
}
