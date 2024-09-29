module.exports = {
  testEnvironment: "jsdom",

  preset: "ts-jest",

  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],

  testMatch: ["<rootDir>/src/**/*.test.{ts,tsx,js,jsx}"],

  collectCoverageFrom: [
    "src/**/*.{ts,tsx,js,jsx}",
    "!src/index.tsx",
    "!**/node_modules/**",
  ],

  setupFilesAfterEnv: [
    // Importing '@testing-library/jest-dom' provides useful custom matchers for
    // asserting on DOM elements in your tests. These matchers enhance the
    // readability and expressiveness of your test assertions.
    "<rootDir>/jest.setup.ts",
  ],

  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  verbose: true,
};
