import { NamedNode } from 'rdf-js'
import { handler } from '@tpluscode/fun-ddr'

export interface ImageEvents {
  sourceImageUploaded: {
    id: NamedNode
    source: NamedNode
  }
}

export default handler<ImageEvents>()
