import { factory } from '@tpluscode/fun-ddr'
import { Image, Source } from '../index'
import createImage from '../image'
import { namedNode } from '@rdfjs/data-model'
import { ImageEvents } from '../image/events'

interface ImageUploadCommand {
  image: {
    id: string
    contentUrl: string
    thumbnailUrl: string
  }
}

export const uploadImage = factory<Source, ImageUploadCommand, Image, ImageEvents>((source, { image }, { emit }) => {
  const imageEntity = createImage({
    slug: image.id,
    contentUrl: namedNode(image.contentUrl),
    thumbnailUrl: namedNode(image.thumbnailUrl),
  })

  emit.sourceImageUploaded({
    id: imageEntity.id,
    source: source.id,
  })

  return imageEntity
})
