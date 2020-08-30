import { RdfineEntity } from '@tpluscode/fun-ddr-rdfine'
import { Image } from '../index'
import * as Schema from '@rdfine/schema'
import { hydra, schema } from '@tpluscode/rdf-ns-builders'
import { namedNode } from '@rdfjs/data-model'
import env from '@wikibus/core/env'
import { Initializer } from '@tpluscode/rdfine/RdfResource'
import { NamedNode } from 'rdf-js'

interface ImageInit {
  slug: string
  contentUrl: NamedNode
  thumbnailUrl: NamedNode
}

export default function create({ slug, contentUrl, thumbnailUrl }: ImageInit): Image {
  class Impl extends Schema.ImageObjectMixin(RdfineEntity) {
    constructor(term: NamedNode, init: Initializer<Image>) {
      super(term, init)

      this.types.add(hydra.Resource)
      this.types.add(schema.ImageObject)
    }
  }

  const id = namedNode(`${env.BASE_URI}image/${encodeURIComponent(slug)}`)

  return new Impl(id, {
    types: [schema.ImageObject],
    contentUrl,
    thumbnail: {
      types: [schema.ImageObject],
      contentUrl: thumbnailUrl,
    },
  })
}
