import { CONSTRUCT, SELECT } from '@tpluscode/sparql-builder'
import { hydra, ldp, rdf } from '@tpluscode/rdf-ns-builders'
import * as $rdf from '@rdfjs/data-model'
import { Clownface, SingleContextClownface } from 'clownface'
import { sparql, SparqlTemplateResult } from '@tpluscode/rdf-string'
import { IriTemplate, IriTemplateMapping } from '@rdfine/hydra'
import { Variable } from 'rdf-js'
import { loaders } from '../rdfLoaders'
import { query } from '../namespace'

function createTemplateVariablePatterns(subject: Variable, queryPointer: Clownface, basePath: string) {
  return (patterns: unknown[], mapping: IriTemplateMapping): unknown[] => {
    const property = mapping.property

    if (hydra.pageIndex.equals(property.id)) {
      return patterns
    }

    const value = queryPointer.out(property.id)
    if (value.values.length === 0) {
      return patterns
    }

    const queryFilters = mapping._selfGraph.out(query.filter)
    if (!queryFilters.value) {
      return patterns
    }

    const createPattern = loaders.load(queryFilters, { basePath })
    return [...patterns, createPattern({
      subject,
      predicate: property.id,
      object: value,
    })]
  }
}

function createManagesBlockPatterns(member: Variable) {
  return function (previous: SparqlTemplateResult, manages: SingleContextClownface): SparqlTemplateResult {
    const subject = manages.out(hydra.subject).term
    const predicate = manages.out(hydra.property).term
    const object = manages.out(hydra.object).term

    if (subject && predicate) {
      return sparql`${previous}\n${subject} ${predicate} ${member} .`
    }
    if (subject && object) {
      return sparql`${previous}\n${subject} ${member} ${object} .`
    }
    if (predicate && object) {
      return sparql`${previous}\n${member} ${predicate} ${object} .`
    }

    return previous
  }
}

type SelectBuilder = ReturnType<typeof SELECT>

function createOrdering(api: SingleContextClownface, collection: SingleContextClownface, subject: Variable): { patterns: SparqlTemplateResult; addClauses(q: SelectBuilder): SelectBuilder } {
  const orders = api.node(collection.out(rdf.type) as any).out(query.order).toArray()
  if (!orders.length) {
    return {
      patterns: sparql``,
      addClauses: q => q,
    }
  }

  let orderIndex = 0
  let patterns = sparql``
  const clauses: Array<{ variable: Variable; descending: boolean }> = []

  for (const order of orders[0].list()) {
    const propertyPath = order.out(query.path).list()
    if (!propertyPath) continue

    const path = [...propertyPath].reduce((current, prop, index) => {
      const next = index ? sparql`/${prop.term}` : sparql`${prop.term}`

      return sparql`${current}${next}`
    }, sparql``)
    const variable = $rdf.variable(`order${++orderIndex}`)

    const pattern = sparql`OPTIONAL { ${subject} ${path} ${variable} } .`
    patterns = sparql`${patterns}\n${pattern}`

    clauses.push({
      variable,
      descending: ldp.Descending.equals(order.out(query.direction).term),
    })
  }

  return {
    patterns,
    addClauses(query) {
      return clauses.reduce((orderedQuery, { variable, descending }) => {
        return orderedQuery.ORDER().BY(variable, descending)
      }, query)
    },
  }
}

export function getMemberQuery(api: SingleContextClownface, collection: SingleContextClownface, query: Clownface, variables: IriTemplate | null, pageSize: number, basePath: string) {
  const subject = $rdf.variable('member')
  const managesBlockPatterns = collection.out(hydra.manages).toArray().reduce(createManagesBlockPatterns(subject), sparql``)
  const filterPatters = variables ? variables.mapping.reduce(createTemplateVariablePatterns(subject, query, basePath), []) : []

  const order = createOrdering(api, collection, subject)

  const memberPatterns = sparql`${managesBlockPatterns}\n${filterPatters}`

  let subselect = SELECT`?g`.WHERE` 
              GRAPH ?g {
                ${memberPatterns}
                
                ${order.patterns}
              }`

  if (variables && variables.mapping.some(mapping => mapping.property.equals(hydra.pageIndex))) {
    const page = Number.parseInt(query.out(hydra.pageIndex).value || '1')
    subselect = subselect.LIMIT(pageSize).OFFSET((page - 1) * pageSize)
    subselect = order.addClauses(subselect)
  }

  return {
    members: CONSTRUCT`?s ?p ?o. ?is ?io ?ip`.WHERE`
        {
            ${subselect}
        }
        
        GRAPH ?g { ?s ?p ?o }`,
    totals: SELECT`(count(${subject}) as ?count)`.WHERE`GRAPH ?g { ${memberPatterns} }`,
  }
}
