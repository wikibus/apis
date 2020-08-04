import asyncMiddleware from 'middleware-async'

export const get = asyncMiddleware(async (req, res) => {
  res.dataset(req.hydra.resource.dataset)
})
