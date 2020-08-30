import { Request } from 'express'
import { GraphPointer } from 'clownface'
import { rdf, schema } from '@tpluscode/rdf-ns-builders'
import { wba } from '@wikibus/core/namespace'
import { Sources } from '@wikibus/core/permissions'

export const preprocess = (req: Request, resource: GraphPointer): void => {
  if (!(req.user && req.user.id)) {
    return
  }

  if (req.user.permissions.includes(Sources.admin) || req.user.id.equals(resource.out(schema.contributor).term)) {
    resource.addOut(rdf.type, wba.EditableBrochure)
    req.hydra.resource.types.add(wba.EditableBrochure)
  }
}
