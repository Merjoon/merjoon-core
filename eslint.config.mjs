import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylisticTypeChecked,
  prettierConfig,
  {
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"]
        }
      }
    },
    plugins: {
      import: importPlugin,
      prettier: prettierPlugin
    },
    rules: {
      ...importPlugin.flatConfigs.recommended.rules,
      ...importPlugin.flatConfigs.typescript.rules,
      'prettier/prettier': [
        'error',
        {
          semi: true,
          singleQuote: true,
          tabWidth: 2,
          useTabs: false,
          trailingComma: 'all',
          bracketSpacing: true,
          arrowParens: 'always',
          printWidth: 100,
          endOfLine: 'lf',
        }
      ],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          "selector": "variable",
          "modifiers": ["const"],
          "format": ["camelCase", "UPPER_CASE"]
        },
      ],
      "no-console": "error",
      semi: ['error', 'always'],
      quotes: ['error', 'single', {
        avoidEscape: true
      }],
      indent: ['error', 2, {
        SwitchCase: 1
      }],
      'no-multiple-empty-lines': ['error', {
        max: 1,
        maxBOF: 0,
        maxEOF: 0
      }],
      'padded-blocks': ['error', 'never'],
      'quote-props': ['error', 'as-needed'],
      'object-curly-spacing': ['error', 'always'],
      'space-infix-ops': ['error', {
        int32Hint: false
      }],
      curly: ['error'],
      'object-curly-newline': [
        'error',
        {
          ObjectExpression: { multiline: true, minProperties: 1 },
          ImportDeclaration: { multiline: true },
          ExportDeclaration: { multiline: true },
        }
      ],


      "import/order": ["error", {
        "groups": ["builtin", "external", "internal"]
      }],
      eqeqeq: ['error', 'always'],
    },
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  }
);