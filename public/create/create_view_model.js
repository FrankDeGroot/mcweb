'use strict'

export function CreateViewModel (handlers, changeScheduler) {
  let state = {
    versions: [],
    version: null,
    busy: false
  }
  let selectedVersion = null
  let newWorldName = null

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
    newWorldName: {
      get: () => newWorldName,
      set: value => {
        if (value !== newWorldName) {
          newWorldName = value
          changeScheduler.schedule()
        }
      }
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
      get: () => state.busy || !newWorldName
    }
  })

  this.seed = null

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
