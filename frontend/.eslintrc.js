const rules = {
  'max-len': ['error', 120, 2, { ignoreUrls: true }],
  'no-console': [0],
  'no-restricted-syntax': 'off',
  'no-continue': 'off',
  'no-underscore-dangle': 'off',
  'import/extensions': 'off',
  'import/no-unresolved': 'off',
  'operator-linebreak': 'off',
  'implicit-arrow-linebreak': 'off',
  'react/destructuring-assignment': 'off',
  'jsx-a11y/click-events-have-key-events': 'off',
  'jsx-a11y/no-static-element-interactions': 'off',
  'react/jsx-one-expression-per-line': 'off',
  'react/jsx-filename-extension': [2, { extensions: ['.ts', '.tsx'] }],
  'react/function-component-definition': 'off',
  'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  'lines-between-class-members': [
    'error',
    'always',
    { exceptAfterSingleLine: true },
  ],
};

module.exports = {
  extends: ['airbnb', 'plugin:prettier/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  rules,
  env: {
    browser: true,
    commonjs: true,
    node: true,
    jest: true,
    es6: true,
  },
  plugins: ['react', 'react-hooks', 'jsx-a11y', '@typescript-eslint'],
  settings: {
    ecmascript: 6,
    jsx: true,
    'import/resolver': {
      node: {
        paths: ['src'],
      },
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    react: {
      pragma: 'React',
      version: '16.8',
    },
  },
};
