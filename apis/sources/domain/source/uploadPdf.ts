import { factory } from '@tpluscode/fun-ddr'
import { Source, File } from '../index'
import { Readable } from 'stream'
import { SourceEvents } from './events'
import newFile from '../files'
import { FileStorage } from '../../services/files'

interface UploadPdfCommand {
  contents: Readable
  name: string
  byteSize: number
  storage: FileStorage
}

const encodingFormat = 'application/pdf'

export const uploadPdf = factory<Source, UploadPdfCommand, File, SourceEvents>(async (source, { name, storage, contents, byteSize }, { emit }) => {
  const contentUrl = await storage.upload(name, `source_${source.identifier}`, encodingFormat, contents)

  const file = newFile(source.file, {
    name,
    byteSize,
    contentUrl,
    encodingFormat,
  })

  emit.pdfUploaded({
    fileId: file.id,
  })

  return file
})
