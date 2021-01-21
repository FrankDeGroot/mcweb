'use strict'

export function CreateViewModel (handlers, changeScheduler) {
  let state = {
    versions: [],
    version: null,
    busy: false
  }
  let selectedVersion = null

  handlers = {
    onCreateWorld: () => {},
    ...handlers
  }

  Object.defineProperties(this, {
    versions: {
      get: () => Object.keys(state.versions).map(version => {
        return {
          label: version + (version === state.version ? ' (current)' : ''),
          selected: version === selectedVersion,
          value: version
        }
      })
    },
    versionSelectDisabled: {
      get: () => state.busy
    },
    nameInputDisabled: {
      get: () => state.busy
    },
    seedInputDisabled: {
      get: () => state.busy
    },
    createButtonDisabled: {
      get: () => state.busy
    }
  })

  this.seed = null
  this.newWorldName = null

  this.setCurrent = current => {
    state = current
    if (!selectedVersion ||
        !state.versions[selectedVersion]) {
      selectedVersion = state.version
    }
    changeScheduler.schedule()
  }

  this.selectVersion = version => {
    selectedVersion = version
  }

  this.createWorld = () => {
    handlers.onCreateWorld(selectedVersion, this.newWorldName, this.seed)
    changeScheduler.schedule()
  }
}
