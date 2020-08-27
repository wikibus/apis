import { DomainError, factory } from '@tpluscode/fun-ddr'
import { NamedNode } from 'rdf-js'
import clownface from 'clownface-io'
import { BrochureEvents } from './events'
import { sourcesTerm, namedNode } from '@wikibus/core/dataModel'
import { schema } from '@tpluscode/rdf-ns-builders'
import { Brochure, WishlistItem } from '../index'
import create from '../wishlistItem'
import { logClownfaceIoErrors } from '@wikibus/hydra-box-helpers/log'

interface AddToWishlistCommand {
  user: NamedNode
}

export const addToWishlist = factory<Brochure, AddToWishlistCommand, WishlistItem, BrochureEvents>(async (brochure, command, emitter) => {
  const user = await clownface().namedNode(command.user).fetch()
  const userId = user.namedNode(decodeURI(command.user.value)).out(schema.identifier).value

  if (!userId) {
    logClownfaceIoErrors(user)
    throw new DomainError(brochure['@id'], 'Could not create wishlist item', 'User slug not found')
  }

  const wishlist = sourcesTerm(`wishlist/${encodeURIComponent(userId)}`)
  emitter.emit.addedToWishlist({
    brochure: brochure.id,
    user: command.user,
    wishlist,
  })

  const wishlistItem = namedNode(`${wishlist.value}/${brochure.identifier}`)
  return create(wishlistItem, command.user, brochure.id, wishlist)
})
