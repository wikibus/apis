import Client from './Client'
import env from '@wikibus/core/env'

const baseUri = env.BASE_URI
const endpointUrl = env.SPARQL_ENDPOINT
const storeUrl = env.SPARQL_GRAPH_ENDPOINT
const updateUrl = env.SPARQL_UPDATE_ENDPOINT

export const client = new Client({
  endpointUrl,
  updateUrl,
  storeUrl,
  baseUri,
})
