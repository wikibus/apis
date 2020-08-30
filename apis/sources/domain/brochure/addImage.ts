import { mutate } from '@tpluscode/fun-ddr'
import { NamedNode } from 'rdf-js'
import { Source } from '../index'

interface AddImageCommand {
  image: NamedNode
}

export const addImage = mutate<Source, AddImageCommand>((state, cmd) => {
  state.images = [...state.images, cmd.image]

  return state
})
