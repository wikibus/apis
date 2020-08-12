import toStream from 'buffer-to-stream'
import { promisify } from 'util'
import type { UploadResponseCallback } from 'cloudinary'
import env from '@wikibus/core/env'
import cloudinary = require('cloudinary')

const THUMB_TRANSFORMATION = env.CLOUDINARY_THUMB_TRANSFORMATION
const DEFAULT_TRANSFORMATION = env.CLOUDINARY_DEFAULT_TRANSFORMATION

const eager = [{ transformation: DEFAULT_TRANSFORMATION }, { transformation: THUMB_TRANSFORMATION }]

function uploadBuffer(buffer: Buffer, folder: string, cb: UploadResponseCallback) {
  const uploadStream = cloudinary.v2.uploader.upload_stream({
    folder,
    eager,
  }, cb)

  toStream(buffer).pipe(uploadStream)
}

export async function upload(image: Buffer, folder: string) {
  const response = await promisify(uploadBuffer)(image, folder)
  const createdImage = await cloudinary.v2.api.resource(response!.public_id)

  const defaultImage = createdImage.derived.find((derived: any) => derived.transformation === `t_${DEFAULT_TRANSFORMATION}`)
  const thumbImage = createdImage.derived.find((derived: any) => derived.transformation === `t_${THUMB_TRANSFORMATION}`)

  return {
    id: response!.public_id,
    contentUrl: defaultImage.secure_url,
    thumbnailUrl: thumbImage.secure_url,
  }
}

export async function deleteImage(publicId: string) {
  return cloudinary.v2.api.delete_resources([publicId])
}
