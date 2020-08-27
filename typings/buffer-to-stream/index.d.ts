declare module 'buffer-to-stream' {
  import { Readable } from 'stream'

  interface ToStream {
    (buffer: string | Buffer, chunkSize?: number): Readable;
  }

  const toStream: ToStream;

  export = toStream
}
