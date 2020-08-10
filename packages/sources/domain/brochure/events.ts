import { NamedNode } from 'rdf-js'

export interface BrochureEvents {
  addedToWishlist: {
    brochure: NamedNode
    user: NamedNode
  }
  created: {
    title: string
    identifier: string
    id: NamedNode
  }
}
