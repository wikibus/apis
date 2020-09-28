import { turtle } from '@tpluscode/rdf-string'
import { hydra } from '@tpluscode/rdf-ns-builders'
import toStream from 'string-to-stream'
import $rdf from 'rdf-ext'
import { wba } from '@wikibus/core/namespace'
import env from '@wikibus/core/env'

const sources = $rdf.namedNode(env.SOURCES_BASE)

export default () => toStream(turtle`
<> {
    <> a ${hydra.Resource}, ${wba.EntryPoint} ;
        ${hydra.title} "wikibus.org" ;
        ${hydra.description} "Online public transport encyclopedia" ;
        ${wba.library} ${sources} ;
    .
        
    ${sources} ${hydra.title} "Library" ;
        ${hydra.description} "Collection of physical media about public transport"
    .
}
`.toString())
