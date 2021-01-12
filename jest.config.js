module.exports = {
    roots: ["<rootDir>/src"],
    clearMocks: true,
    globals: {
        "ts-jest": {
            babelConfig: true,
            tsConfig: "<rootDir>/tsconfig.json"
        }
    },

    transform: {
        "^.+\\.ts$": "ts-jest",
        "^.+.ts$": "ts-jest"
    },
    preset: "ts-jest",
    moduleNameMapper: {
        // .scss and .css fiels will instead import styleMock.ts
        "\\.(s)?css$": "<rootDir>/src//__mock__/styleMock.ts"
    },
    transformIgnorePatterns: ["/node_modules"],
    testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/lib/"],
    preset: "ts-jest"
};
