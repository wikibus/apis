import {sparql, SparqlTemplateResult} from "@tpluscode/rdf-string";
import {namedNode, variable} from '@rdfjs/data-model';
import {schema} from '@tpluscode/rdf-ns-builders';
import {Term, Variable} from 'rdf-js';
import {SafeClownface} from 'clownface';

interface Pattern {
    subject: Variable
    predicate: Term,
    object: SafeClownface
}

let counter = 0
function nextVar() {
    return variable(`v${++counter}`)
}

export function byContributor({ subject, predicate, object }: Pattern) {
    return sparql`${subject} ${predicate} ${namedNode(encodeURI(object.value))} .`
}

export function withPdfOnly({ subject }: Pattern) {
    return sparql`${subject} ${schema.associatedMedia}/${schema.contentUrl} ?file .`
}

export function withoutImages({ subject }) {
    return sparql`MINUS {
        ${subject} ${schema.image} ?image
    }`
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
