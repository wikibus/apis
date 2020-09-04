import { NamedNode } from 'rdf-js'
import { RdfineEntity } from '@tpluscode/fun-ddr-rdfine'
import { namespace, property, Constructor } from '@tpluscode/rdfine'
import { wbo } from '@wikibus/core/namespace'
import { literal } from '@rdfjs/data-model'
import { hydra, xsd } from '@tpluscode/rdf-ns-builders'
import { Initializer } from '@tpluscode/rdfine/RdfResource'
import { WishlistItem } from '../index'
import { BaseMixin } from '../baseMixin'

export function WishlistItemMixin<Base extends Constructor<RdfineEntity>>(base: Base) {
  @namespace(wbo)
  class WishlistItemClass extends BaseMixin(base) implements WishlistItem {
    @property()
    source!: NamedNode

    @property({ initial: literal('false', xsd.boolean) })
    done!: boolean

    @property()
    user!: NamedNode

    @property()
    wishlist!: NamedNode
  }

  return WishlistItemClass
}
WishlistItemMixin.appliesTo = wbo.WishlistItem

class WishlistItemImpl extends WishlistItemMixin(RdfineEntity) {
  constructor(arg: NamedNode, init?: Initializer<WishlistItem>) {
    super(arg, init)
    this.types.add(wbo.WishlistItem)
    this.types.add(hydra.Resource)
  }
}

export default function (term: NamedNode, user: NamedNode, source: NamedNode, wishlist: NamedNode): WishlistItem {
  return new WishlistItemImpl(term, {
    user, source, wishlist,
  })
}
