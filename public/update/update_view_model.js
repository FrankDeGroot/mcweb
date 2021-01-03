'use strict'

export function UpdateViewModel (handlers) {
  handlers = {
    onUpdateVersion: () => {},
    ...handlers
  }

  function canUpdateVersion (version) {
    return ['release', 'snapshot'].indexOf(version) !== -1
  }

  this.updateVersion = version => {
    if (canUpdateVersion(version)) handlers.onUpdateVersion(version)
  }
}
