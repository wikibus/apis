const handler = {
  get(env: typeof process.env, prop: string) {
    if (prop === 'has') {
      return (name: string) => {
        return !!env[name]
      }
    }

    if (prop === 'production') {
      return env.NODE_ENV !== 'development'
    }

    if (prop === 'maybe') {
      return env
    }

    const value = env[prop]

    if (!value) {
      throw new Error(`Missing environment variable ${prop}`)
    }

    return value
  },
}

type KnownVariableNames = 'SOURCES_BASE'
| 'USERS_BASE'
| 'CLOUDINARY_BROCHURES_FOLDER'
| 'SPARQL_ENDPOINT'
| 'SPARQL_GRAPH_ENDPOINT'
| 'SPARQL_UPDATE_ENDPOINT'
| 'AZURE_STORAGE_CONNECTION_STRING'
| 'SPARQL_USER'
| 'SPARQL_PASSWORD'

type KnownVariables = {
  [P in KnownVariableNames]: string
}

export default new Proxy(process.env, handler) as typeof process['env'] & KnownVariables & {
  has(name: string): boolean
  maybe: KnownVariables
  production: boolean
}
