import process from 'node:process';
import antfu from '@antfu/eslint-config';

export default antfu(
  {
    // TypeScript and Vue are autodetected, you can also explicitly enable them:
    typescript: true,
    vue: true,
    ignores: [
      'dist/*',
      'node_modules/*',
      '*.d.ts',
    ],
  },
  {
    rules: {
      'vue/html-self-closing': ['error', {
        html: {
          void: 'always',
          normal: 'never',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      }],
      'style/semi': [2, 'always'],
      'vue/max-attributes-per-line': [1, {
        singleline: 3,
        multiline: 1,
      }],
      'curly': [2, 'all'],
      'style/brace-style': [2, '1tbs', { allowSingleLine: true }],
      'max-statements-per-line': [2, { max: 2 }],
      'unused-imports/no-unused-vars': ['error', {
        caughtErrors: 'none',
      }],
      'no-console': process.env.NODE_ENV === 'production' ? 2 : 1,
      'style/member-delimiter-style': [2, {
        multiline: {
          delimiter: 'semi',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
        multilineDetection: 'brackets',
      }],
      'style/max-statements-per-line': ['error', { max: 3 }],
    },
  },
);
