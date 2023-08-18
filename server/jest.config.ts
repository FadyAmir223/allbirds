import type { JestConfigWithTsJest } from 'ts-jest';
import { jsWithTsESM as tsjPreset } from 'ts-jest/presets';

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    ...tsjPreset.transform,
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  coverageReporters: ['text', 'html'],
  coverageDirectory: '<rootDir>/coverage/',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  globalSetup: '<rootDir>/dist/test/setup.js',
  globalTeardown: '<rootDir>/dist/test/teardown.js',
};

export default jestConfig;
