import asyncMiddleware from 'middleware-async'
import { addToWishlist } from '../../domain/brochure/addToWishlist'
import { protectedResource } from '@hydrofoil/labyrinth/resource'
import { brochures, wishlistItems } from '../../repository'

export const put = protectedResource(asyncMiddleware(async (req, res, next) => {
  const brochure = await brochures.load(req.hydra.resource.term)
  const command = {
    user: req.user!.id,
  }

  const wishlistItem = await brochure.factory(addToWishlist)(command)
  const state = await wishlistItem.state

  if (state && await wishlistItems.load(state.id)) {
    res.dataset(state._selfGraph.dataset)
    return
  }

  return wishlistItem.commit(wishlistItems)
    .then(saved => {
      res.status(201)
      res.setLink('Location', saved['@id'])
      res.dataset(saved._selfGraph.dataset)
    })
    .catch(next)
}))
