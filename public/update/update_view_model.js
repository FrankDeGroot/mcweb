export function UpdateViewModel (socket) {
  let state = {
    busy: false
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
    if (canUpdateVersion(version)) socket.emit('update', { version })
  }

  this.setCurrent = current => {
    state = current
  }
}
