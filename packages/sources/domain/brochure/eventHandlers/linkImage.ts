import Events from '../../image/events'
import { sources } from '../../../repository'
import { addImage } from '../addImage'

Events.on.sourceImageUploaded(async function addImageToBrochureGraph(ev) {
  const { source, id } = ev.data

  const sourceEntity = await sources.load(source)

  return sourceEntity
    .mutation(addImage)({
      image: id,
    }).commit(sources)
})
