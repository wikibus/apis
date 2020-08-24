import { Router } from 'express'
import * as resource from '@hydrofoil/labyrinth/resource'

export const get = Router()

get.use((req, res, next) => {
  if (req.user) {
    res.redirect(`/wishlist/${req.user.sub}`)
    return
  }

  next()
})

get.use(resource.get as any)
