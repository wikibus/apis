import { Router } from 'express'
import * as resource from '@wikibus/hydra-box-helpers/handlers/hydraResource'

export const get = Router()

get.use((req, res, next) => {
  if ((req as any).user) {
    res.redirect(`/wishlist/${(req as any).user.sub}`)
    return
  }

  next()
})

get.use(resource.get as any)
