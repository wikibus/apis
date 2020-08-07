import { NamedNode } from 'rdf-js'
import { RdfineEntity } from '@tpluscode/fun-ddr-rdfine'
import { BrochureMixin } from './brochure'
import { WishlistItemMixin } from './wishlistItem'

export interface Brochure extends RdfineEntity {
  identifier: string
  title: string
}

export interface WishlistItem extends RdfineEntity {
  source: NamedNode
  done: boolean
  user: NamedNode
}

RdfineEntity.factory.addMixin(BrochureMixin)
RdfineEntity.factory.addMixin(WishlistItemMixin)
