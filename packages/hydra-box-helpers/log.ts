import debug, { Debugger } from 'debug'

export const log = debug('app')
export const warning = log.extend('warning')
export const error = log.extend('error')

export function logClownfaceIoErrors(response: any, log: Debugger = error) {
  [...response.failures].forEach(([term, { error }]) => {
    if (error) {
      log(`Failed to fetch ${term.value}: ${error.message}`)
    }
  })
}
