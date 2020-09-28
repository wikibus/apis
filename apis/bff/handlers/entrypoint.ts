import express from 'express'
import $rdf from 'rdf-ext'
import cf from 'clownface'
import { hydra } from '@tpluscode/rdf-ns-builders'
import { wba } from '@wikibus/core/namespace'

export function get(req: express.Request, res: express.Response) {
  const graph = cf(req.hydra.resource)

  if (process.env.DATA_SHEETS) {
    graph.addOut(wba.dataSheets, $rdf.namedNode(process.env.DATA_SHEETS), link => {
      link.addOut(hydra.title, 'Data sheets')
      link.addOut(hydra.description, 'Technical data gathered from brochures, books, etc')
    })
  }

  return res.dataset(req.hydra.resource.dataset)
}
