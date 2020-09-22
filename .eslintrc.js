module.exports = {
  env: {
    es2021: true,
    jest: true,
    node: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
  },
  overrides: [
    {
      files: ['public/*'],
      globals: {
        io: 'readonly',
        m: 'readonly',
        polythene: 'readonly'
      }
    }
  ]
}
