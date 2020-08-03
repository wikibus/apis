declare module 'eventstore/lib/eventstore' {
  import EventStream from 'eventstore/lib/eventStream'

  interface Query {
    aggregateId: string;
  }

  class Eventstore {
    public init(cb?: (err: Error) => void): void
    public getEventStream(queryOrId: Query | string, cb: (err: Error, stream: EventStream) => void): void
  }

  export = Eventstore
}

declare module 'eventstore/lib/event' {
  class Event<T = unknown> {
    public readonly streamId: string;
    public readonly aggregateId: string;
    public readonly payload: T;
  }

  export = Event
}

declare module 'eventstore/lib/eventStream' {
  import Event from 'eventstore/lib/event'

  class EventStream {
    public readonly streamId: string;
    public readonly aggregateId: string;
    public readonly events: Event[];
    public lastRevision: number;
    public currentRevision(): number;
    public addEvent(event: object): void
    public addEvents(events: object[])
    public commit(cb: Function): void
  }

  export = EventStream
}

declare module 'eventstore' {
  import Eventstore from 'eventstore/lib/eventstore'

  interface MongoOptions {
    url?: string;
    eventsCollectionName?: string;
  }

  interface AzureTableStorageOptions {
    storageAccount: string;
    storageAccessKey: string;
    storageTableHost: string;
    eventsTableName?: string;
    snapshotsTableName?: string;
    timeout?: number;
    emitStoreEvents?: boolean;
  }

  interface StoreOptions {
    type: string;
  }

  interface Factory {
    (options?: StoreOptions & (MongoOptions | AzureTableStorageOptions)): Eventstore;
  }

  const eventstore: Factory

  export = eventstore
}
