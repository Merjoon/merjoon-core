import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylisticTypeChecked,
  {
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],
      indent: ['error', 2, { SwitchCase: 1 }],
      'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
      'padded-blocks': ['error', 'never'],
      'quote-props': ['error', 'as-needed'],
      'nonblock-statement-body-position': ['error', 'below'],
      'object-curly-spacing': ['error', 'always'],
      'no-trailing-spaces': 'error',
      'brace-style': ['error', '1tbs'],
      'space-infix-ops': ['error', { int32Hint: false }],
      'key-spacing': ['error', { afterColon: true }],
      'keyword-spacing': ['error', { before: true, after: true }],
      'space-before-blocks': ['error', 'always'],

      curly: ['error'],
    },
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  }
);
