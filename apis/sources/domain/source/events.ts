import { NamedNode } from 'rdf-js'

export interface SourceEvents {
  pdfUploaded: {
    fileId: NamedNode
  }
}
