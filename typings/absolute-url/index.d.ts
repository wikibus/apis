// Type definitions for absolute-url 1.2
// Project: https://github.com/zazukoians/absolute-url
// Definitions by: tpluscode <https://github.com/tpluscode>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped


declare module 'absolute-url' {
  import { RequestHandler, Request } from "express";
  interface AbsoluteUrl {
    (): RequestHandler;

    attach(req: Request): void;
  }

  const middleware: AbsoluteUrl;

  export = middleware;
}
