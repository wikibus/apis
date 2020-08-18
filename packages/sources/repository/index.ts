import { client } from '@wikibus/sparql'
import { SparqlRepository } from '@tpluscode/fun-ddr-rdfine'
import type * as Domain from '../domain'
import '../domain'

export const sources = new SparqlRepository<Domain.Source>(client)
export const brochures = new SparqlRepository<Domain.Brochure, Domain.BrochureEvents>(client)
export const wishlistItems = new SparqlRepository<Domain.WishlistItem>(client)
export const images = new SparqlRepository<Domain.Image>(client)
