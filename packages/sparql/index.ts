import Client from './Client'
import env from '@wikibus/core/env'

const baseUri = env.SOURCES_BASE
const endpointUrl = env.SPARQL_ENDPOINT
const updateUrl = env.SPARQL_UPDATE_ENDPOINT
const user = env.maybe.SPARQL_USER
const password = env.maybe.SPARQL_PASSWORD

export const client = new Client({
  endpointUrl,
  updateUrl,
  baseUri,
  user,
  password,
})
