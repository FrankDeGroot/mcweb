'use strict'

const { get } = require('https')

exports.getStream = async url => {
  return new Promise((resolve, reject) => {
    get(url, res => {
      if (res.statusCode === 200) {
        resolve(res)
      } else {
        reject(new Error(`GET ${url} returned ${res.statusCode}`))
      }
    })
  })
}
