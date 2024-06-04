/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  setupFilesAfterEnv: [`<rootDir>/jest.setup.js`],
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
};
