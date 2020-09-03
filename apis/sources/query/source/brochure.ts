import { Request } from 'express'
import {GraphPointer, MultiPointer} from 'clownface'
import { rdf, schema } from '@tpluscode/rdf-ns-builders'
import { wba } from '@wikibus/core/namespace'
import { Sources } from '@wikibus/core/permissions'
import { client } from '@wikibus/sparql'
import { ASK } from '@tpluscode/sparql-builder'

function hasContent(file: MultiPointer) {
  return ASK`GRAPH ${file.term} {
    ${file.term} ${schema.contentUrl} ?content .
  }`.execute(client.query)
}

export const preprocess = async (req: Request, resource: GraphPointer): Promise<void> => {
  if (!(req.user && req.user.id)) {
    return
  }

  if (!(req.user.permissions.includes(Sources.admin) || req.user.id.equals(resource.out(schema.contributor).term))) {
    return
  }

  resource.addOut(rdf.type, wba.EditableBrochure)
  req.hydra.resource.types.add(wba.EditableBrochure)

  const associatedMedia = resource.out(schema.associatedMedia)

  if (!(await hasContent(associatedMedia))) {
    resource.addOut(wba.uploadPdf, associatedMedia)
  }
}
