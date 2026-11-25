/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  testMatch: ["**/*.test.ts"],
  moduleNameMapper: {
    // marked is ESM-only in its exports map; Jest runs CommonJS, so use its UMD build.
    "^marked$": "<rootDir>/node_modules/marked/lib/marked.umd.js",
  },
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: { module: "commonjs", moduleResolution: "node10", esModuleInterop: true } }],
  },
};
