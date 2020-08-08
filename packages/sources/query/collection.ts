import { CONSTRUCT, SELECT } from '@tpluscode/sparql-builder'
import type { SparqlGraphQueryExecutable } from '@tpluscode/sparql-builder/lib'
import { hydraBox } from '@wikibus/core/namespace'
import { dcterms, dtype, hydra } from '@tpluscode/rdf-ns-builders'
import * as $rdf from '@rdfjs/data-model'
import { Clownface, SingleContextClownface } from 'clownface'
import { loaders } from '../loader'
import { sparql, SparqlTemplateResult } from '@tpluscode/rdf-string'
import { IriTemplate, IriTemplateMapping } from '@rdfine/hydra'
import { NamedNode, Variable } from 'rdf-js'

function createTemplateVariablePatterns(subject: Variable, query: Clownface) {
  return (patterns: unknown[], mapping: IriTemplateMapping): unknown[] => {
    const property = mapping.property

    if (hydra.pageIndex.equals(property.id)) {
      return patterns
    }

    const value = query.out(property.id)
    if (value.values.length === 0) {
      return patterns
    }

    const queryPattern = mapping._selfGraph.out(hydraBox.queryPattern)
    if (!queryPattern.value) {
      return patterns
    }

    const createPattern = loaders.load(queryPattern, { basePath: __dirname })
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

export function getMemberQuery(collection: SingleContextClownface, query: Clownface, variables: IriTemplate | null, pageSize: number) {
  const subject = $rdf.variable('member')
  const managesBlockPatterns = collection.out(hydra.manages).toArray().reduce(createManagesBlockPatterns(subject), sparql``)
  const filterPatters = variables ? variables.mapping.reduce(createTemplateVariablePatterns(subject, query), []) : []

  const order = $rdf.variable('order')
  const title = $rdf.variable('title')

  const memberPatterns = sparql`${managesBlockPatterns}\n${filterPatters}`

  let subselect = SELECT`?g`.WHERE` 
              GRAPH ?g {
                ${memberPatterns}
                
                OPTIONAL { ${subject} ${dtype.orderIndex} ${order} } .
                OPTIONAL { ${subject} ${dcterms.title} ${title} } .
              }`

  if (variables && variables.mapping.some(mapping => mapping.property.equals(hydra.pageIndex))) {
    const page = Number.parseInt(query.out(hydra.pageIndex).value || '1')
    subselect = subselect
      .LIMIT(pageSize).OFFSET((page - 1) * pageSize)
      .ORDER().BY(order, true)
      .ORDER().BY(title)
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

export function getLinkedResources(collection: SingleContextClownface, property: NamedNode): SparqlGraphQueryExecutable | null {
  const linked = collection.out(hydra.member).out(property)

  if (linked.values.length === 0) {
    return null
  }

  return [...linked.terms].reduce((current, graph) => {
    if (graph.termType === 'NamedNode') {
      return current.FROM(graph)
    }

    return current
  }, CONSTRUCT`?s ?p ?o`.WHERE`?s ?p ?o`)
}
