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

    const value = env[prop]

    if (!value) {
      throw new Error(`Missing environment variable ${prop}`)
    }

    return value
  },
}

export default new Proxy(process.env, handler) as typeof process['env'] & {
  has(name: string): boolean
  production: boolean
  SOURCES_BASE: string
  USERS_BASE: string
  CLOUDINARY_BROCHURES_FOLDER: string
  SPARQL_ENDPOINT: string
  SPARQL_GRAPH_ENDPOINT: string
  SPARQL_UPDATE_ENDPOINT: string
  AZURE_STORAGE_CONNECTION_STRING: string
}
