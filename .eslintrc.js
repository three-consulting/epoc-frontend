module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: ["strict", "eslint:recommended", "plugin:react/recommended", "plugin:@typescript-eslint/recommended"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: "module",
    },
    plugins: ["react", "@typescript-eslint"],
    rules: {
        quotes: 0,
        semi: 0,
        indent: 0,
        "template-curly-spacing": 0,
        "array-bracket-spacing": 0,
        "func-style": 0,
        "array-element-newline": 0,
        "no-confusing-arrow": 0,
        "comma-dangle": 0,
        complexity: 0,
        "filenames/match-regex": 0,
        "id-blacklist": 0,
    },
    settings: {
        react: {
            version: "detect",
        },
    },
}
