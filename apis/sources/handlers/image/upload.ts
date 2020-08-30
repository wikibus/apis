import { protectedResource } from '@hydrofoil/labyrinth/resource'
import asyncMiddleware from 'middleware-async'
import { uploadImage } from '../../domain/source/uploadImage'
import multer from 'multer'
import { uploadBrochureImage, storage } from '../../services/images'
import { error } from '@wikibus/hydra-box-helpers/log'
import { images, sources } from '../../repository'

export const post = protectedResource(multer().any(), asyncMiddleware(async (req, res, next) => {
  const source = await sources.load(req.hydra.resource.term)

  const { files } = req
  if (!Array.isArray(files)) {
    throw new Error('Unexpected file upload')
  }

  const uploaded = await Promise.all(files.map(file => uploadBrochureImage(file.buffer)))

  let uploadsFailed = false
  for (const uploadedImage of uploaded) {
    const command = {
      image: uploadedImage,
    }

    const imageResource = await source.factory(uploadImage)(command)

    await imageResource.commit(images)
      .catch((e) => {
        storage.deleteImage(uploadedImage.id).catch(error)
        error('Failed to upload image: "%s"', e.message)
        uploadsFailed = true
      })
  }

  if (uploadsFailed) {
    return next(new Error('Some images failed to upload'))
  }

  await source.commit(sources)
    .then(() => {
      res.status(204)
      res.end()
    }).catch(next)
}))
