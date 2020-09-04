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
  transformIgnorePatterns: [
    'node_modules/(?!(fun-ddr-rdfine)/)',
  ],
}
