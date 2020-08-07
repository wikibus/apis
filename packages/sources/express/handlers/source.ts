import asyncMiddleware from 'middleware-async'
import { namedNode } from '@rdfjs/data-model'
import { addToWishlist } from '../../domain/brochure/addToWishlist'

export const addToWishlistHandler = asyncMiddleware(async (req, res, next) => {
  const brochure = await req.repositories.brochures.load(req.hydra.resource.term)
  const command = {
    user: namedNode(req.header('user') || 'foo'),
  }

  const wishlistItem = await brochure.factory(addToWishlist)(command)
  const state = await wishlistItem.state

  if (await req.repositories.wishlistItems.load(state!.id)) {
    res.dataset(state!._selfGraph.dataset)
    return
  }

  return wishlistItem.commit(req.repositories.wishlistItems)
    .then(saved => {
      res.status(201)
      res.setLink('Location', saved['@id'])
      res.dataset(saved._selfGraph.dataset)
    })
    .catch(next)
})
