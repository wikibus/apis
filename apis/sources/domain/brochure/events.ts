import { NamedNode } from 'rdf-js'
import { handler } from '@tpluscode/fun-ddr'
import { SourceEvents } from '../source/events'

export interface BrochureEvents extends SourceEvents {
  addedToWishlist: {
    brochure: NamedNode
    user: NamedNode
    wishlist: NamedNode
  }
  created: {
    title: string
    identifier: string
    id: NamedNode
  }
}

export default handler<BrochureEvents>()
