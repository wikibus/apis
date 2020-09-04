import * as ddr from '@tpluscode/fun-ddr'
import type { DomainEventEmitter } from '@tpluscode/fun-ddr/lib'
import { WikibusEntity } from './index'

type CommandRunFunc<T extends WikibusEntity, TCommand, TEvents extends Record<string, any>> = (state: T, cmd: TCommand, emitter: DomainEventEmitter<TEvents>) => T | Promise<T>

export function mutate<A extends WikibusEntity, B, C extends Record<string, any> = Record<string, any>>(runCommand: CommandRunFunc<A, B, C>) {
  return ddr.mutate<A, B, C>(async (state, cmd, events) => {
    const newState = await runCommand(state, cmd, events)
    newState.modified = new Date()
    return newState
  })
}
