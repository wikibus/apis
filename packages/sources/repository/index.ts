import StreamClient from 'sparql-http-client/StreamClient'
import { SparqlRepository } from '@tpluscode/fun-ddr-rdfine'
import type { Brochure, WishlistItem } from '../domain'
import '../domain'

export function createRepositories(client: StreamClient) {
  return {
    brochures: new SparqlRepository<Brochure>(client),
    wishlistItems: new SparqlRepository<WishlistItem>(client),
  }
}
