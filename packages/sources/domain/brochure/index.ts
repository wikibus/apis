import { RdfineEntity } from '@tpluscode/fun-ddr-rdfine'
import { Constructor, property } from '@tpluscode/rdfine'
import { Brochure } from '../index'
import { bibo, opus, wba, wbo } from '@wikibus/core/namespace'
import { dcterms, hydra, rdfs, schema, xsd } from '@tpluscode/rdf-ns-builders'
import { NamedNode } from 'rdf-js'
import { Initializer } from '@tpluscode/rdfine/RdfResource'
import { literal, namedNode } from '@rdfjs/data-model'
import env from '@wikibus/core/env'
import { SourceMixin } from '../source'
import URLSlugify = require('url-slugify')

const urlSlugify = new URLSlugify()

export function BrochureMixin<Base extends Constructor<RdfineEntity>>(base: Base) {
  class BrochureClass extends SourceMixin(base) implements Brochure {
    @property.literal({ path: dcterms.title })
    title!: string

    @property.literal({ path: dcterms.identifier })
    code?: string;

    @property.literal({ path: dcterms.date })
    date?: Date;

    @property.literal({ path: rdfs.comment })
    description?: string;

    @property({ path: dcterms.language, values: 'array' })
    languages!: NamedNode[];

    @property({ path: schema.containedInPlace })
    location?: NamedNode;

    @property.literal({ path: bibo.pages, type: Number })
    pages?: number;

    @property({ path: wba.wishlistItem })
    wishlistItem!: NamedNode

    @property({ path: schema.contributor })
    contributor!: NamedNode

    get month() {
      const { value } = this._selfGraph.out(opus.month)
      if (value) {
        return parseInt(value)
      }

      return undefined
    }

    set month(value) {
      this._selfGraph.deleteOut(opus.month)
      if (value) {
        this._selfGraph.addOut(opus.month, literal(value.toString(), xsd.gMonth))
      }
    }

    get year() {
      const { value } = this._selfGraph.out(opus.year)
      if (value) {
        return parseInt(value)
      }

      return undefined
    }

    set year(value) {
      this._selfGraph.deleteOut(opus.year)
      if (value) {
        this._selfGraph.addOut(opus.year, literal(value.toString(), xsd.gYear))
      }
    }

    ownedBy(userId: NamedNode) {
      return this.contributor.equals(userId)
    }
  }

  return BrochureClass
}

BrochureMixin.appliesTo = wbo.Brochure

export default function (title: string, contributor: NamedNode, moreProps?: Initializer<Brochure>): Brochure {
  class Impl extends BrochureMixin(RdfineEntity) {
    constructor(slug: string, init: Initializer<Brochure>) {
      const id = namedNode(`${env.BASE_URI}brochure/${slug}`)

      super(id, { ...moreProps, ...init })
      this.types.add(wbo.Source)
      this.types.add(wbo.Brochure)
      this.types.add(hydra.Resource)

      this.identifier = slug
      this.file = namedNode(`${id.value}/file`)
      this.imagesLink = namedNode(`${id.value}/images`)
    }
  }

  const slug = urlSlugify.slugify(title)
  return new Impl(slug, { title, contributor })
}
