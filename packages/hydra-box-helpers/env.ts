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

export default new Proxy(process.env, handler)
