import { NamedNode } from 'rdf-js'
import { RdfineEntity } from '@tpluscode/fun-ddr-rdfine'
import { BrochureMixin } from './brochure'
import { WishlistItemMixin } from './wishlistItem'

export interface Source {
  readonly file: NamedNode
  readonly images: NamedNode
}

export interface Brochure extends RdfineEntity, Source {
  identifier: string
  title: string
  languages: NamedNode[]
  description?: string
  code?: string
  location?: NamedNode
  pages?: number
  date?: Date
  year?: number
  month?: number
  readonly contributor: NamedNode
  readonly wishlistItem: NamedNode
}

export interface WishlistItem extends RdfineEntity {
  source: NamedNode
  done: boolean
  user: NamedNode
}

RdfineEntity.factory.addMixin(BrochureMixin)
RdfineEntity.factory.addMixin(WishlistItemMixin)
