import { Constructor, namespace, property } from '@tpluscode/rdfine'
import { schema, dcat, xsd } from '@tpluscode/rdf-ns-builders'
import { RdfineEntity } from '@tpluscode/fun-ddr-rdfine'
import { NamedNode } from 'rdf-js'
import { Initializer } from '@tpluscode/rdfine/RdfResource'
import { File } from '..'

export function FileMixin<Base extends Constructor<RdfineEntity>>(base: Base) {
  @namespace(schema)
  class FileClass extends base implements File {
    constructor(...args: any[]) {
      super(...args)

      this.contentSize = `${Math.round(this.byteSize / 1024 / 1024 * 100) / 100} MB`
    }

    @property.literal({ type: String })
    contentSize!: string

    @property.literal({ path: dcat.byteSize, datatype: xsd.long })
    byteSize!: number

    @property.literal({ type: String })
    encodingFormat!: string

    @property()
    contentUrl!: NamedNode

    @property.literal()
    name!: string
  }

  return FileClass
}

FileMixin.appliesTo = schema.MediaObject

type ConstructorParams = Pick<Initializer<File>, 'byteSize' | 'encodingFormat' | 'contentUrl' | 'name'>

export default function (id: NamedNode, fileInit: ConstructorParams): File {
  class Impl extends FileMixin(RdfineEntity) {
    constructor(id: NamedNode, init: Initializer<File>) {
      super(id, init)

      this.types.add(schema.MediaObject)
    }
  }

  return new Impl(id, fileInit)
}
