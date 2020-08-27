const handler = {
  get(env: typeof process.env, prop: string) {
    if (prop === 'has') {
      return (name: string) => {
        return !!env[name]
      }
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
  SOURCES_BASE: string
  USERS_BASE: string
  CLOUDINARY_BROCHURES_FOLDER: string
  SPARQL_ENDPOINT: string
  SPARQL_GRAPH_ENDPOINT: string
  SPARQL_UPDATE_ENDPOINT: string
}
