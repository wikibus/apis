import path from 'path'
import express from 'express'
import { hydraBox } from '@hydrofoil/labyrinth'
import env from '@wikibus/core/env'
import { log, error } from '@wikibus/hydra-box-helpers/log'
import { bootstrapResources } from '@wikibus/hydra-box-helpers/bootstrap-resources'
import { client } from '@wikibus/sparql'
import initial from './bootstrap'

Promise.resolve()
  .then(async () => {
    const app = express()

    app.enable('trust proxy')
    await hydraBox(app, {
      codePath: __dirname,
      baseUri: env.BFF_BASE,
      defaultBase: 'https://wikibus-bff.lndo.site/',
      apiPath: path.resolve(__dirname, 'hydra'),
      sparql: {
        endpointUrl: env.SPARQL_ENDPOINT,
        user: env.maybe.SPARQL_USER,
        password: env.maybe.SPARQL_PASSWORD,
      },
    })

    await bootstrapResources(initial, client, env.BFF_BASE)

    app.listen(process.env.PORT, () => {
      log(`listening on port ${process.env.PORT}`)
    })
  })
  .catch(error)
