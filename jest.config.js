/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ["<rootDir>/setup-tests.ts"],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text'],
};
