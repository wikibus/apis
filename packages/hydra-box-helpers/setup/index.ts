import * as hb from 'hydra-box'
import { Api, ApiOptions } from 'hydra-box/Api'
import walk from '@fcostarodrigo/walk'

interface ApiInit {
  baseUri: string
  codePath: string
  defaultBase?: string
  apiSourcePath: string
}

export default async function ({ apiSourcePath, baseUri, codePath, defaultBase = 'urn:hydra-box:api' }: ApiInit): Promise<Api> {
  const options: ApiOptions = {
    path: '/api',
    codePath,
  }

  let api: Api
  const apiDocSources: Promise<unknown>[] = []
  for await (const file of walk(apiSourcePath) as AsyncIterable<string>) {
    if (!file.match(/\.ttl$/)) {
      continue
    }

    if (api) {
      api = await api.fromFile(file)
    } else {
      api = await hb.Api.fromFile(file, options)
    }
  }
  await Promise.all(apiDocSources)

  api.rebase(defaultBase, baseUri)
  return api
}
