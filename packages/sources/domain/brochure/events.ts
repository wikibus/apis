import { NamedNode } from 'rdf-js'

export interface BrochureEvents {
  addedToWishlist: {
    brochure: NamedNode
    user: NamedNode
  }
}
