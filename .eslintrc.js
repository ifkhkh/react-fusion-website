module.exports = {
    extends: ['eslint:recommended', 'plugin:react/recommended'],
    plugins: ['react-hooks'],
    rules: {
        indent: ['error', 4],
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
    },
    env: {
        // 设置了这个为 true 之后，就不会报 module is not define 的错
        node: true,
    },
    // Parsing error: the keyword 'import' is reserved
    parserOptions: {
        ecmaVersion: 7,
        sourceType: 'module',
        ecmaFeatures: {
            js: true,
            jsx: true,
            modules: true,
        },
    },
};
