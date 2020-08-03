import { Request, Response } from 'express'
import asyncMiddleware from 'middleware-async'

export const get = asyncMiddleware(async (req: Request, res: Response) => {
    res.dataset(req.hydra.resource.dataset)
})
