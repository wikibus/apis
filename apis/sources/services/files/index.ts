import { Readable } from 'stream'
import { NamedNode } from 'rdf-js'
import { namedNode } from '@rdfjs/data-model'
import env from '@wikibus/core/env'
import { AzureBlobService } from '@wikibus/azure'

export interface FileStorage {
  upload(name: string, folder: string, contentType: string, stream: Readable): Promise<NamedNode>
}

export const fileStorage = (): FileStorage => {
  if (env.production) {
    return AzureBlobService
  }

  return {
    async upload(): Promise<NamedNode> {
      return namedNode('foo')
    },
  }
}
