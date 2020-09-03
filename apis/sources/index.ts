import express from 'express'
import * as path from 'path'
import program from 'commander'
import authentication from '@wikibus/hydra-box-helpers/express/authentication'
import { error, log } from '@wikibus/hydra-box-helpers/log'
import env from '@wikibus/core/env'
import { hydraBox, SparqlQueryLoader } from '@hydrofoil/labyrinth'
import * as domainErrors from '@wikibus/hydra-box-helpers/error/DomainErrors'
import { client } from '@wikibus/sparql'
import { bootstrapResources } from './initialize'
import { ImageObjectBundle } from '@rdfine/schema/bundles'
import RdfResource from '@tpluscode/rdfine'
import ParsingClient from 'sparql-http-client/ParsingClient'

RdfResource.factory.addMixin(...ImageObjectBundle)

const baseUri = env.SOURCES_BASE
const endpointUrl = env.SPARQL_ENDPOINT
const codePath = __dirname
const apiPath = path.join(__dirname, 'hydra/')

program
  .action(() => {
    Promise.resolve().then(async () => {
      const app = express()

      app.enable('trust proxy')
      app.use(authentication())
      const loader = new SparqlQueryLoader({
        client: new ParsingClient({ endpointUrl }),
      })
      app.use((req, _, next) => {
        req.sparql = client
        next()
      })
      await hydraBox(app, {
        loader,
        codePath,
        apiPath,
        baseUri,
        errorMappers: Object.values(domainErrors).map(Mapper => new Mapper()),
        log,
      })

      await bootstrapResources(client, baseUri)

      app.listen(34566, () => log('App ready'))
    }).catch(err => {
      error('Failed to start: %O', err)
      process.exit(1)
    })
  })

program.parse(process.argv)
