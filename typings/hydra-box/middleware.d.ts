declare module 'hydra-box/middleware' {
  import { Router } from 'express'
  import Api = require('hydra-box/Api')
  import {ResourceLoader} from 'hydra-box';

  interface Options {
    baseIriFromRequest?: boolean
    loader?: ResourceLoader
    store?: any
  }

  function middleware(api: Api, options: Options): Router

  export = middleware
}
