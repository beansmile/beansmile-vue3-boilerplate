module.exports = {
  extends: '@antfu',
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
    '@typescript-eslint/semi': [2, 'always'],
  },
};
