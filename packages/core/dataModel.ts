import { namedNode } from '@rdfjs/data-model'
import env from './env'

export * from '@rdfjs/data-model'

export function sourcesTerm(term: string) {
  return namedNode(`${env.SOURCES_BASE}${term}`)
}

export function usersTerm(term: string) {
  return namedNode(`${env.USERS_BASE}${term}`)
}
