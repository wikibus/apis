import { BlobServiceClient } from '@azure/storage-blob'
import { Readable } from 'stream'
import { NamedNode } from 'rdf-js'
import env from '@wikibus/core/env'
import { namedNode } from '@wikibus/core/dataModel'

export const AzureBlobService = {
  async upload(name: string, container: string, blobContentType: string, stream: Readable): Promise<NamedNode> {
    const client = BlobServiceClient.fromConnectionString(env.AZURE_STORAGE_CONNECTION_STRING)

    const blob = client.getContainerClient(container)
    const created = await blob.createIfNotExists()
    if (created.succeeded) {
      await blob.setAccessPolicy('blob')
    }

    const blobClient = blob.getBlobClient(name).getBlockBlobClient()
    await blobClient.uploadStream(stream, undefined, undefined, {
      blobHTTPHeaders: {
        blobContentType,
      },
    })

    return namedNode(blob.url)
  },
}
