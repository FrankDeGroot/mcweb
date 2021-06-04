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
      files: ['public/main.js'],
      globals: {
        self: 'readonly',
        uhtml: 'readonly'
      }
    },
    {
      files: ['public/rpc.js'],
      globals: {
        io: 'readonly'
      }
    },
    {
      files: ['public/**/*'],
      globals: {
        _: 'readonly'
      }
    }
  ]
}
