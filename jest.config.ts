import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/main.ts',
    '!src/app.module.ts',
    '!src/**/*.dto.ts',
    '!src/**/*.interface.ts',
    '!src/**/index.ts',
    '!src/**/*.config.ts',
    '!src/**/*.module.ts',
    '!src/**/transferencia.repository.ts',
    '!src/**/*.enum.ts',
    '!src/**/typeorm/*.orm-entity.ts',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/test/',
    '/coverage/',
  ],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
};

export default config;
