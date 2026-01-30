const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(react-markdown|remark-gfm|remark-parse|unified|ccount|escape-string-regexp|markdown-table|mdast-util-from-markdown|mdast-util-to-markdown|micromark|character-reference-invalid|is-decimal|is-hexadecimal|parse-entities)/)',
  ],
}

module.exports = createJestConfig(customJestConfig)
