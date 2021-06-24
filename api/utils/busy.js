'use strict'

let busy = false

exports.isBusy = () => busy
exports.doIfNotBusy = async action => {
  if (busy) {
    throw new Error('Already busy')
  }
  try {
    busy = true
    return await action()
  } finally {
    busy = false
  }
}
