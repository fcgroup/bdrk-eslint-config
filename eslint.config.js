// Self-lint configuration: the package lints its own (CommonJS) sources using
// the base config it ships.
const base = require('./index');

module.exports = [
  ...base,
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
    },
  },
];
