import cors from 'cors'
import express from 'express'
import * as hydraBox from 'hydra-box'
import * as path from 'path'
import program from 'commander'
import { NotFoundError } from '@wikibus/hydra-box-helpers/error'
import { httpProblemMiddleware } from '@wikibus/hydra-box-helpers/express/problemDetails'
import authentication from '@wikibus/hydra-box-helpers/express/authentication'
import { logRequest, logRequestError } from '@wikibus/hydra-box-helpers/express/logger'
import { error, log } from '@wikibus/hydra-box-helpers/log'
import env from '@wikibus/core/env'
import Api from '@wikibus/hydra-box-helpers/setup'
import { SparqlQueryLoader } from '@wikibus/hydra-box-helpers/setup/loader'
import { client } from '@wikibus/sparql'
import { bootstrapResources } from './initialize'
import * as Hydra from '@rdfine/hydra'
import { ImageObjectBundle } from '@rdfine/schema/bundles'
import RdfResource from '@tpluscode/rdfine'
import ParsingClient from 'sparql-http-client/ParsingClient'

RdfResource.factory.addMixin(...Object.values(Hydra))
RdfResource.factory.addMixin(...ImageObjectBundle)

const baseUri = env.BASE_URI!
const endpointUrl = env.SPARQL_ENDPOINT
const codePath = __dirname
const apiSourcePath = path.join(__dirname, 'hydra/')

program
  .action(() => {
    Promise.resolve().then(async () => {
      const app = express()

      app.enable('trust proxy')
      app.use(logRequest as any)
      app.use(cors({
        exposedHeaders: ['link', 'location'],
      }))
      app.use(authentication(process.env.NODE_ENV !== 'development'))
      const loader = new SparqlQueryLoader({
        client: new ParsingClient({ endpointUrl }),
        codePath,
      })
      app.use((req, _, next) => {
        req.sparql = client
        next()
      })
      app.use(hydraBox.middleware(await Api({ baseUri, codePath, apiSourcePath }), { loader }))

      app.use(function (req, res, next) {
        next(new NotFoundError())
      })
      app.use(logRequestError as any)
      app.use(httpProblemMiddleware)

      await bootstrapResources(client, baseUri)

      app.listen(34566, () => log('App ready'))
    }).catch(err => {
      error('Failed to start: %O', err)
      process.exit(1)
    })
  })

program.parse(process.argv)
