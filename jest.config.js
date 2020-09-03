module.exports = {
  roots: [
    '<rootDir>',
  ],
  testRegex: './apis/sources/.+/*spec\\.ts$',
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
  ],
  moduleNameMapper: {
    '@rdf-esm/(.*)': '@rdfjs/$1',
  },
}
