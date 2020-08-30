import Events from '../../brochure/events'
import { INSERT } from '@tpluscode/sparql-builder'
import { hydra, rdf, rdfs } from '@tpluscode/rdf-ns-builders'
import { wba, wbo } from '@wikibus/core/namespace'
import { client } from '@wikibus/sparql'

export const initializeCollectionWhenAddedToWishlist = Events.on.addedToWishlist(function initializeCollection({ data }) {
  return INSERT.DATA`GRAPH ${data.wishlist} {
    ${data.wishlist} a ${hydra.Collection}, ${wba.WishlistCollection} ;
    ${rdfs.label} "My wishlist" ;
    ${hydra.manages} [
      ${hydra.object} ${data.user} ;
      ${hydra.property} ${wbo.user}
    ] , [
      ${hydra.object} ${wbo.WishlistItem} ;
      ${hydra.property} ${rdf.type}
    ] ;
    ${wbo.user} ${data.user}
  }`.execute(client.query)
})
