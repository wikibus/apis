import express from 'express'
import program from 'commander'
import clownface from 'clownface'
import $rdf from 'rdf-ext'
import rdfHandler from '@rdfjs/express-handler'
import absoluteUrl from 'absolute-url'
import { log } from '@wikibus/hydra-box-helpers/log'
import RdfResource from '@tpluscode/rdfine'
import { PersonBundle, ImageObjectBundle } from '@rdfine/schema/bundles'
import { PersonMixin } from '@rdfine/schema'
import { namedNode } from '@rdfjs/data-model'
import { schema } from '@tpluscode/rdf-ns-builders'

RdfResource.factory.addMixin(...PersonBundle)
RdfResource.factory.addMixin(...ImageObjectBundle)

program
  .action(() => {
    const app = express()

    app.use(rdfHandler())
    app.use(absoluteUrl())
    app.get('/user/:id', (req: any, res: any) => {
      const userPointer = clownface({ dataset: $rdf.dataset() }).namedNode(req.absoluteUrl())

      const person = new PersonMixin.Class(userPointer, {
        name: 'John Doe',
        identifierLiteral: req.params.id,
        image: {
          types: [schema.ImageObject],
          contentUrl: namedNode('https://lorempixel.com/300/300/people'),
        },
      })

      res.dataset(person._selfGraph.dataset)
    })

    app.listen(34666, () => log('App ready'))
  })

program.parse(process.argv)
