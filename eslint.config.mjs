import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylisticTypeChecked,
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
      import: importPlugin
    },
    rules: {
      ...importPlugin.flatConfigs.recommended.rules,
      ...importPlugin.flatConfigs.typescript.rules,
      semi: ['error', 'always'],
      quotes: ['error', 'single', {
        avoidEscape: true
      }],
      indent: ['error', 2, {
        SwitchCase: 1
      }],
      'no-multiple-empty-lines': ['error', {
        max: 1, maxBOF: 0, maxEOF: 0
      }],
      'padded-blocks': ['error', 'never'],
      'quote-props': ['error', 'as-needed'],
      'object-curly-spacing': ['error', 'always'],
      'space-infix-ops': ['error', {
        int32Hint: false
      }],
      curly: ['error'],
      'object-curly-newline': [
        "error",
        {
          ImportDeclaration: {multiline: true}
        }
      ],
      "import/order": ["error", { "groups": ["builtin", "external", "internal"] }],
    },
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  }
);
