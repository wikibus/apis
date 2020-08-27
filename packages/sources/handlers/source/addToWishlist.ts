import asyncMiddleware from 'middleware-async'
import { ConcurrencyError } from '@tpluscode/fun-ddr/lib/errors'
import { protectedResource } from '@hydrofoil/labyrinth/resource'
import { addToWishlist } from '../../domain/brochure/addToWishlist'
import { brochures, wishlistItems } from '../../repository'

export const put = protectedResource(asyncMiddleware(async (req, res, next) => {
  const brochure = await brochures.load(req.hydra.resource.term)
  const command = {
    user: req.user!.id,
  }

  const wishlistItem = await brochure.factory(addToWishlist)(command)

  return wishlistItem.commit(wishlistItems)
    .then(saved => {
      res.status(201)
      res.setLink('Location', saved['@id'])
      res.dataset(saved._selfGraph.dataset)
    })
    .catch(async e => {
      if (!(e instanceof ConcurrencyError)) {
        throw e
      }

      const { id } = (await wishlistItem.state)!
      const existing = await (await wishlistItems.load(id)).state
      res.dataset(existing!._selfGraph.dataset)
    })
    .catch(next)
}))
