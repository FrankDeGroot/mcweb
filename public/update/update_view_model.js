'use strict'

export function UpdateViewModel (handlers) {
  let state = {
    busy: false
  }

  handlers = {
    onUpdateVersion: () => {},
    ...handlers
  }

  Object.defineProperties(this, {
    updateReleaseButtonDisabled: {
      get: () => state.busy
    },
    updateSnapshotButtonDisabled: {
      get: () => state.busy
    }
  })

  function canUpdateVersion (version) {
    return ['release', 'snapshot'].indexOf(version) !== -1
  }

  this.updateVersion = version => {
    if (canUpdateVersion(version)) handlers.onUpdateVersion(version)
  }

  this.setCurrent = current => {
    state = current
  }
}
