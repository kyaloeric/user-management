export default  {
    moduleFileExtensions: ["ts", "tsx", "js"],
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ['**/*.(t|j)s'],
    moduleDirectories: ["node_modules", "src"],
    coverageDirectory: './coverage',
    testEnvironment: 'node',
    roots: ['<rootDir>/src/', '<rootDir>src/tests/'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
      '^@test/(.*)$': '<rootDir>/test/$1',
    },
  };