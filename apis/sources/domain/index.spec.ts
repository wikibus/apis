import { RdfineEntity } from '@tpluscode/fun-ddr-rdfine'
import { dcterms, xsd } from '@tpluscode/rdf-ns-builders'
import cf from 'clownface'
import $rdf from 'rdf-ext'
import { BaseMixin } from './baseMixin'

describe('domain/BaseMixin', () => {
  class Test extends BaseMixin(RdfineEntity) {}

  it('should set dcterms:created', () => {
    // given
    const pointer = cf({ dataset: $rdf.dataset() }).blankNode()

    // when
    const inst = new Test(pointer)

    // then
    expect(inst.created).toBeDefined()
  })

  it('should not touch existing dcterms:created', () => {
    // given
    const pointer = cf({ dataset: $rdf.dataset() })
      .blankNode()
      .addOut(dcterms.created, $rdf.literal('2020-01-10T20:30:55', xsd.dateTime))

    // when
    const inst = new Test(pointer)

    // then
    expect(inst.created).toEqual(new Date(2020, 0, 10, 20, 30, 55))
  })
})
