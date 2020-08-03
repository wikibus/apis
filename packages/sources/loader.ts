const LoaderRegistry = require('rdf-loaders-registry')
const EcmaScriptLoader = require('rdf-loader-code/ecmaScript')
const EcmaScriptLiteralLoader = require('rdf-loader-code/ecmaScriptLiteral')

export const loaders = new LoaderRegistry()
EcmaScriptLoader.register(loaders)
EcmaScriptLiteralLoader.register(loaders)
