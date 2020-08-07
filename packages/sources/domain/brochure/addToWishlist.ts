import { DomainError, factory } from '@tpluscode/fun-ddr'
import { NamedNode } from 'rdf-js'
import clownface from 'clownface-io'
import { BrochureEvents } from './events'
import { namedNode } from '@rdfjs/data-model'
import { schema } from '@tpluscode/rdf-ns-builders'
import { Brochure, WishlistItem } from '../index'
import create from '../wishlistItem'
import env from '@wikibus/hydra-box-helpers/env'

interface AddToWishlistCommand {
  user: NamedNode
}

export const addToWishlist = factory<Brochure, AddToWishlistCommand, WishlistItem, BrochureEvents>(async (brochure, command) => {
  const user = await clownface().namedNode(command.user).fetch()
  const userId = user.namedNode(decodeURI(command.user.value)).out(schema.identifier).value

  if (!userId) {
    throw new DomainError(brochure['@id'], 'Could not create wishlist item', 'User slug not found')
  }

  const wishlistUri = namedNode(`${env.BASE_URI}wishlist/${encodeURIComponent(userId)}/${brochure.identifier}`)
  return create(wishlistUri, command.user, brochure.id)
})
