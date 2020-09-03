import create from './index'
import { namedNode } from '@rdfjs/data-model'
import { schema } from '@tpluscode/rdf-ns-builders'

describe('domain/File', () => {
  it('calculates megabyte size', () => {
    // when
    const file = create(namedNode('/brochure/foo/file'), {
      byteSize: 46837253,
      encodingFormat: 'application/pdf',
      contentUrl: namedNode('urn:storage:url'),
    })

    // then
    expect(file.contentSize).toBe('44.67 MB')
  })

  it('appends segment to parent id', () => {
    // when
    const file = create(namedNode('/brochure/foo/file'), {
      byteSize: 0,
      encodingFormat: 'application/pdf',
      contentUrl: namedNode('urn:storage:url'),
    })

    // then
    expect(file.id.value).toBe('/brochure/foo/file')
  })

  it('sets rdf type', () => {
    // when
    const file = create(namedNode('/brochure/foo/file'), {
      byteSize: 0,
      encodingFormat: 'application/pdf',
      contentUrl: namedNode('urn:storage:url'),
    })

    // then
    expect(file.types.has(schema.MediaObject)).toBeTruthy()
  })
})
