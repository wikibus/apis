import asyncMiddleware from 'middleware-async'
import { addToWishlist } from '../../../domain/brochure/addToWishlist'
import { restrictedHandler } from '@wikibus/hydra-box-helpers/handlers/restrictedResource'

export const put = restrictedHandler(asyncMiddleware(async (req, res, next) => {
  const brochure = await req.repositories.brochures.load(req.hydra.resource.term)
  const command = {
    user: req.user!.id,
  }

  const wishlistItem = await brochure.factory(addToWishlist)(command)
  const state = await wishlistItem.state

  if (state && await req.repositories.wishlistItems.load(state.id)) {
    res.dataset(state._selfGraph.dataset)
    return
  }

  return wishlistItem.commit(req.repositories.wishlistItems)
    .then(saved => {
      res.status(201)
      res.setLink('Location', saved['@id'])
      res.dataset(saved._selfGraph.dataset)
    })
    .catch(next)
}))
