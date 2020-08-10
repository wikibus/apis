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
import env from '@wikibus/hydra-box-helpers/env'
import Api from '@wikibus/hydra-box-helpers/setup'
import { SparqlQueryLoader } from '@wikibus/hydra-box-helpers/setup/loader'
import Client from '@wikibus/hydra-box-helpers/sparql/Client'
import { bootstrapResources } from './initialize'
import * as Hydra from '@rdfine/hydra'
import RdfResource from '@tpluscode/rdfine'
import ParsingClient from 'sparql-http-client/ParsingClient'
import { createRepositories } from './repository'

RdfResource.factory.addMixin(...Object.values(Hydra))

const baseUri = env.BASE_URI!
const endpointUrl = process.env.SPARQL_ENDPOINT!
const storeUrl = process.env.SPARQL_GRAPH_ENDPOINT!
const updateUrl = process.env.SPARQL_UPDATE_ENDPOINT!
const codePath = path.join(__dirname, 'express/handlers/')
const apiSourcePath = path.join(__dirname, 'hydra/')

const sparql = new Client({
  endpointUrl,
  updateUrl,
  storeUrl,
  baseUri,
})

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
      })
      app.use((req, _, next) => {
        req.sparql = sparql
        req.repositories = createRepositories(sparql)
        next()
      })
      app.use(hydraBox.middleware(await Api({ baseUri, codePath, apiSourcePath }), { loader }))

      app.use(function (req, res, next) {
        next(new NotFoundError())
      })
      app.use(logRequestError as any)
      app.use(httpProblemMiddleware)

      await bootstrapResources(sparql, baseUri)

      app.listen(34566, () => log('App ready'))
    }).catch(err => {
      error('Failed to start: %O', err)
      process.exit(1)
    })
  })

program.parse(process.argv)
