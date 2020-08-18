import { mutate } from '@tpluscode/fun-ddr'
import { Brochure } from '../index'
import { BrochureEvents } from './events'

type SetLocationCommand = Pick<Brochure, 'location'>

export const setLocation = mutate<Brochure, SetLocationCommand, BrochureEvents>((state, { location }) => {
  state.location = location

  return state
})
