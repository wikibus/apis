declare module 'hydra-box/middleware' {
  import { Router } from 'express'
  import { Api } from 'hydra-box/Api'

  function middleware(api: Api, store: any): Router

  export = middleware
}
