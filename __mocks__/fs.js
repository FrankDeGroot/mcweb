'use strict'

const fs = jest.genMockFromModule('fs')
fs.promises = {
  access: jest.fn(),
  lstat: jest.fn(),
  mkdir: jest.fn(),
  readdir: jest.fn(),
  readFile: jest.fn(),
  readlink: jest.fn(),
  rename: jest.fn(),
  symlink: jest.fn(),
  unlink: jest.fn(),
  writeFile: jest.fn()
}
module.exports = fs
