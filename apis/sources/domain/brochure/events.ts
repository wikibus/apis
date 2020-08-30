import { NamedNode } from 'rdf-js'
import { handler } from '@tpluscode/fun-ddr'

export interface BrochureEvents {
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
