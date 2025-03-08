import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import imports from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
    // Base JavaScript recommended rules
    js.configs.recommended,

    // TypeScript recommended rules
    {
        files: ['resources/js/**/*.{ts,tsx}'],
        plugins: {
            '@typescript-eslint': typescriptEslint,
        },
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: { jsx: true },
            },
        },
        rules: {
            ...typescriptEslint.configs.recommended.rules,
        },
    },

    // React and React Hooks rules
    {
        files: ['resources/js/**/*.{js,ts,tsx}'],
        plugins: {
            react,
            'react-hooks': reactHooks,
        },
        languageOptions: {
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: { jsx: true },
            },
            globals: {
                browser: true,
                es2021: true,
                node: true,
            },
        },
        settings: {
            react: { version: 'detect' },
        },
        rules: {
            ...react.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
        },
    },

    // Import plugin rules
    {
        files: ['resources/js/**/*.{js,ts,tsx}'],
        plugins: {
            import: imports,
        },
        settings: {
            'import/resolver': {
                typescript: true,
                node: true,
            },
        },
        rules: {
            ...imports.configs.recommended.rules,
            ...imports.configs.typescript.rules,
        },
    },

    // JSX Accessibility rules
    {
        files: ['resources/js/**/*.{js,ts,tsx}'],
        plugins: {
            'jsx-a11y': jsxA11y,
        },
        rules: {
            ...jsxA11y.configs.recommended.rules,
        },
    },

    // Prettier integration
    {
        files: ['resources/js/**/*.{js,ts,tsx}'],
        plugins: {
            prettier,
        },
        rules: {
            ...prettierConfig.rules,
            'prettier/prettier': [
                'error',
                {
                    singleQuote: true,
                    trailingComma: 'all',
                    tabWidth: 4,
                },
            ],
        },
    },

    // Custom rules and overrides
    {
        files: ['resources/js/**/*.{js,ts,tsx}'],
        rules: {
            // General JavaScript/TypeScript Rules
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            eqeqeq: ['error', 'always'],
            curly: ['error', 'all'],

            // React Rules
            'react/prop-types': 'off',
            'react/react-in-jsx-scope': 'off',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',

            // Import Rules
            'import/order': [
                'error',
                {
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                    'newlines-between': 'always',
                    alphabetize: { order: 'asc', caseInsensitive: true },
                },
            ],
            'import/no-unresolved': 'error',

            // Accessibility Rules
            'jsx-a11y/alt-text': 'error',
            'jsx-a11y/anchor-is-valid': 'error',

            // TypeScript-Specific Rules
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
        },
    },

    // Overrides for TypeScript-specific files
    {
        files: ['*.ts', '*.tsx'],
        rules: {
            '@typescript-eslint/explicit-module-boundary-types': 'off',
        },
    },
];