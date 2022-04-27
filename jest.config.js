module.exports = {
    transform: {
        "^.+\\.(t|j)sx?$": "@swc/jest",
    },
    moduleNameMapper: {
        "^@/components/(.*)$": "<rootDir>/components/$1",
        "^@/lib/(.*)$": "<rootDir>/lib/$1",
        "^@/firebase/(.*)$": "<rootDir>/firebase/$1",
    },
    testPathIgnorePatterns: ["/fixtures.ts$"],
}
