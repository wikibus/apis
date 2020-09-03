import { protectedResource } from '@hydrofoil/labyrinth/resource'
import asyncMiddleware from 'middleware-async'
import multer from 'multer'
import error from 'http-errors'
import toStream from 'buffer-to-stream'
import { sources, files } from '../../repository'
import { uploadPdf } from '../../domain/source/uploadPdf'
import { fileStorage } from '../../services/files'

const pdfUploaded = multer({
  fileFilter(req, file, callback): void {
    callback(null, file.mimetype === 'application/pdf')
  },
  limits: {
    fileSize: Number.POSITIVE_INFINITY,
    files: 1,
  },
})

export const post = protectedResource(pdfUploaded.any(), asyncMiddleware(async (req, res, next) => {
  const source = await sources.load(req.hydra.resource.term)
  const { id, identifier } = (await source.state)!

  let file
  if (req.header('content-type') === 'application/pdf') {
    file = {
      contents: req,
      byteSize: Number.parseInt(req.header('content-length') || '0'),
      name: `${identifier}.pdf`,
    }
  } else if (Array.isArray(req.files)) {
    file = {
      contents: toStream(req.files[0].buffer),
      name: req.files[0].originalname,
      byteSize: req.files[0].size,
    }
  } else {
    return next(new error.BadRequest('Unexpected file upload'))
  }

  const command = {
    ...file,
    storage: fileStorage(),
  }

  const fileAR = await source.factory(uploadPdf)(command)
  await fileAR.commit(files)

  return res.redirect(id.value)
}))
