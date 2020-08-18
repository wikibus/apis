import { mutate } from '@tpluscode/fun-ddr'
import { BrochureEvents } from './events'
import { Brochure } from '../index'

export const updateDetails = mutate<Brochure, Brochure, BrochureEvents>((current, desired) => {
  current.title = desired.title
  current.pages = desired.pages
  current.year = desired.year
  current.month = desired.month
  current.languages = desired.languages
  current.code = desired.code
  current.description = desired.description
  current.date = desired.date

  return current
})
