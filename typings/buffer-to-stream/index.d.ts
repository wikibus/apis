declare module 'buffer-to-stream' {
  import { Stream } from 'stream'

  function toStream(buffer: Buffer, chunkSize?: number): Stream;
  export = toStream
}
