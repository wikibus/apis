import { sparql } from '@tpluscode/rdf-string'
import { namedNode } from '@rdfjs/data-model'
import { schema } from '@tpluscode/rdf-ns-builders'
import { Pattern } from './index'

export function byContributor({ subject, predicate, object }: Pattern) {
  return sparql`${subject} ${predicate} ${namedNode(encodeURI(object.value))} .`
}

export function withPdfOnly({ subject }: Pattern) {
  return sparql`${subject} ${schema.associatedMedia}/${schema.contentUrl} ?file .`
}

export function withoutImages({ subject }: Pattern) {
  return sparql`MINUS {
        ${subject} ${schema.image} ?image
    }`
}
