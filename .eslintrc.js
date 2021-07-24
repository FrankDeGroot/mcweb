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
      files: ['web/main.js'],
      globals: {
        self: 'readonly',
        uhtml: 'readonly'
      }
    },
    {
      files: ['web/rpc.js'],
      globals: {
        io: 'readonly'
      }
    },
    {
      files: ['web/**/*'],
      globals: {
        uhtml: 'readonly'
      }
    }
  ]
}
