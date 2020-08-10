import { DomainError, initialize } from '@tpluscode/fun-ddr'
import { Brochure } from '../index'
import createBrochure from '../../domain/brochure/index'
import { NamedNode } from 'rdf-js'
import { BrochureEvents } from './events'

interface CreateBrochureCommand {
  brochure: Brochure
  contributor: NamedNode
}

export const create = initialize<Brochure, CreateBrochureCommand, BrochureEvents>(({ brochure, contributor }, { emit }) => {
  if (!brochure.title) {
    throw new DomainError('', 'Cannot create brochure', 'Title missing')
  }

  const entity = createBrochure(brochure.title, contributor, {
    description: brochure.description,
    code: brochure.code,
    languages: brochure.languages.filter(l => l.termType === 'NamedNode'),
    month: brochure.month,
    year: brochure.year,
    pages: brochure.pages,
  })

  emit.created({
    title: brochure.title,
    identifier: entity.identifier,
    id: entity.id,
  })

  return entity
})
