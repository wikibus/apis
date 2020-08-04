import {sparql} from "@tpluscode/rdf-string";
import {schema} from '@tpluscode/rdf-ns-builders';
import {Term, Variable} from 'rdf-js';
import {SafeClownface} from 'clownface';

interface Pattern {
    subject: Variable
    predicate: Term,
    object: SafeClownface
}

export function byAuthor({ subject, object }: Pattern) {
    return sparql`
    ${subject} ${schema.author}/${schema.name} ?author .
    
    FILTER ( regex( ?author, "${object}",  "i" ) )
    `
}
