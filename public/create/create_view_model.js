'use strict'

export function CreateViewModel (handlers, changeScheduler) {
  let versionsAndWorlds = {
    versions: [],
    version: null
  }
  let selectedVersion = null

  handlers = {
    onCreateWorld: () => {},
    ...handlers
  }

  Object.defineProperties(this, {
    versions: {
      get: () => versionsAndWorlds.versions.map(version => {
        return {
          label: version.version + (version.version === versionsAndWorlds.version ? ' (current)' : ''),
          selected: version.version === selectedVersion,
          value: version.version
        }
      })
    }
  })

  this.seed = null
  this.newWorldName = null

  this.setCurrent = current => {
    versionsAndWorlds = current
    selectedVersion = versionsAndWorlds.version
    changeScheduler.schedule()
  }

  this.selectVersion = version => {
    selectedVersion = version
  }

  this.createWorld = () => {
    handlers.onCreateWorld(selectedVersion, this.newWorldName, this.seed)
  }
}
