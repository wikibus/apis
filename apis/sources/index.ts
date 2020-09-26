import express from 'express'
import * as path from 'path'
import program from 'commander'
import authentication from '@wikibus/hydra-box-helpers/express/authentication'
import { error, log } from '@wikibus/hydra-box-helpers/log'
import env from '@wikibus/core/env'
import { hydraBox } from '@hydrofoil/labyrinth'
import * as domainErrors from '@wikibus/hydra-box-helpers/error/DomainErrors'
import { client } from '@wikibus/sparql'
import { bootstrapResources } from './initialize'
import { ImageObjectBundle } from '@rdfine/schema/bundles'
import RdfResource from '@tpluscode/rdfine'

RdfResource.factory.addMixin(...ImageObjectBundle)

const baseUri = env.SOURCES_BASE
const codePath = __dirname
const apiPath = path.join(__dirname, 'hydra/')

program
  .action(() => {
    Promise.resolve().then(async () => {
      const app = express()

      app.enable('trust proxy')
      app.use(authentication())
      await hydraBox(app, {
        codePath,
        apiPath,
        baseUri,
        defaultBase: 'https://wikibus-sources.lndo.site/',
        errorMappers: Object.values(domainErrors).map(Mapper => new Mapper()),
        sparql: {
          endpointUrl: env.SPARQL_ENDPOINT,
          updateUrl: env.SPARQL_UPDATE_ENDPOINT,
          user: env.maybe.SPARQL_USER,
          password: env.maybe.SPARQL_PASSWORD,
        },
      })

      await bootstrapResources(client, baseUri)

      app.listen(34566, () => log('App ready'))
    }).catch(err => {
      error('Failed to start: %O', err)
      process.exit(1)
    })
  })

program.parse(process.argv)
