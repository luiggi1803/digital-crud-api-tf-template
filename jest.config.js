/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageReporters: ['html', 'lcov', 'text'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/infrastructure/bootstrap/App.ts',
    '!src/**/infrastructure/repository/*DynamoRepository.ts'
  ],
  coveragePathIgnorePatterns: [
    'src/common/infrastructure/adapters',
    'src/items/infrastructure/bootstrap/HandlerCore.ts'
  ],
  testMatch: ['**/*.steps.ts', '**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'node'],
  coverageDirectory: './coverage',
  testTimeout: 30000,
  maxWorkers: '50%',
  setupFilesAfterEnv: ['./jest-setup.ts']
};
