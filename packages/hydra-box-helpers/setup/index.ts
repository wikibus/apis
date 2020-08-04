import * as hb from 'hydra-box'
import type { Api, ApiOptions } from 'hydra-box/Api'
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

  let api: Api | undefined
  const apiDocSources: Promise<unknown>[] = []
  for await (const file of walk(apiSourcePath)) {
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

  if (!api) {
    throw new Error('No API files found')
  }

  api.rebase(defaultBase, baseUri)
  return api
}
