module.exports = {
    extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:prettier/recommended'],
    plugins: ['react-hooks', 'prettier'],

    rules: {
        // 自定义 prettier 规则
        'prettier/prettier': [
            'error',
            {
                semi: true,
                trailingComma: 'all',
                singleQuote: true,
                tabWidth: 4,
                printWidth: 100,
                endOfLine: 'auto',
            },
        ],
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
