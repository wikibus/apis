import { NamedNode } from 'rdf-js'
import { RdfineEntity } from '@tpluscode/fun-ddr-rdfine'
import { BrochureMixin } from './brochure'
import { WishlistItemMixin } from './wishlistItem'
import { ImageObject } from '@rdfine/schema'
import { Entity } from '@tpluscode/fun-ddr'
import { EntityResource } from '@tpluscode/fun-ddr-rdfine/lib/RdfineEntity'

import './brochure/eventHandlers'
import './wishlist/eventHandlers'
import { FileMixin } from './files'

export { BrochureEvents } from './brochure/events'

export interface WikibusEntity extends Entity {
  created: Date
  modified?: Date
}

export interface Source extends EntityResource, WikibusEntity {
  readonly file: NamedNode
  readonly imagesLink: NamedNode
  images: NamedNode[]
  identifier: string
}

export interface Brochure extends Source {
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
  ownedBy(userId: NamedNode): boolean
}

export interface WishlistItem extends EntityResource, WikibusEntity {
  source: NamedNode
  done: boolean
  user: NamedNode
  wishlist: NamedNode
}

export interface Image extends Omit<ImageObject, 'id'>, EntityResource {
}

export interface File extends EntityResource, WikibusEntity {
  contentSize: string
  byteSize: number
  encodingFormat: string
  contentUrl: NamedNode
  name: string
}

RdfineEntity.factory.addMixin(BrochureMixin)
RdfineEntity.factory.addMixin(WishlistItemMixin)
RdfineEntity.factory.addMixin(FileMixin)
