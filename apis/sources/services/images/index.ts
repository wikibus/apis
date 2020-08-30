import * as cloudinary from '@wikibus/cloudinary'
import env from '@wikibus/core/env'

interface UploadedImage {
  id: string
  contentUrl: string
  thumbnailUrl: string
}

export const storage = cloudinary

export interface ImageStorage {
  upload(image: Buffer, folder: string): Promise<UploadedImage>
  deleteImage(publicId: string): Promise<void>
}

export function uploadBrochureImage(image: Buffer): Promise<UploadedImage> {
  return storage.upload(image, env.CLOUDINARY_BROCHURES_FOLDER)
}
