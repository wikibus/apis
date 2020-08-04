declare module 'hydra-box' {
  import Api = require('hydra-box/Api');
  import middleware = require('hydra-box/middleware');

  const hydraBox: {
    Api: Api;
    middleware: typeof middleware;
  }

  export = hydraBox
}
