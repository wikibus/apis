import { sparql, SparqlTemplateResult } from '@tpluscode/rdf-string'
import { namedNode, variable } from '@rdfjs/data-model'
import { Pattern } from './index'

let counter = 0
function nextVar() {
  return variable(`v${++counter}`)
}

export function byTitle({ subject, predicate, object }: Pattern) {
  const variable = nextVar()
  return sparql`
    ${subject} ${predicate} ${variable} .
    
    FILTER (regex(${variable}, "${object.value}", 'i'))`
}

export function byLanguage({ subject, predicate, object }: Pattern) {
  const existsFilters = object.values.reduce<SparqlTemplateResult | null>((patterns, language) => {
    const pattern = sparql`EXISTS { ${subject} ${predicate} ${namedNode(language)} }`

    if (patterns === null) {
      return pattern
    }

    return sparql`${patterns} || ${pattern}`
  }, null)

  return sparql`FILTER ( ${existsFilters} )`
}
