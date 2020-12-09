'use strict'

exports.pipe = async (from, to) => {
  return new Promise((resolve, reject) => {
    from
      .pipe(to)
      .on('finish', () => resolve())
      .on('error', err => reject(err))
  })
}
