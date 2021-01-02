'use strict'

import { Scheduler } from './scheduler.js'

export function WorldsViewModel (handlers) {
  let versionsAndWorlds = {
    versions: [],
    version: null
  }
  let selectedVersion = null
  let selectedWorld = null
  let busy = false

  handlers = {
    onChange: () => {},
    onChangeVersionAndWorld: () => {},
    onCreateWorld: () => {},
    onReady: () => {},
    onUpdateVersion: () => {},
    ...handlers
  }
  const changeScheduler = new Scheduler(handlers.onChange)

  function canUpdateVersion (version) {
    return ['release', 'snapshot'].indexOf(version) !== -1
  }

  Object.defineProperties(this, {
    versions: {
      get: () => versionsAndWorlds.versions.map(version => {
        return {
          label: version.version + (version.version === versionsAndWorlds.version ? ' (current)' : ''),
          options: version.worlds.map(world => {
            return {
              label: version.version + ' ' + world + (world === version.world ? ' (current)' : ''),
              selected: world === selectedWorld,
              value: JSON.stringify({
                version: version.version,
                world: world
              })
            }
          }),
          selected: version.version === versionsAndWorlds.version,
          value: version.version
        }
      })
    },
    busy: {
      get: () => busy,
      set: value => {
        if (busy !== value) {
          busy = value
          if (!busy) handlers.onReady()
          changeScheduler.schedule()
        }
      }
    }
  })

  this.seed = null
  this.newWorldName = null

  this.loadVersionAndWorld = response => {
    versionsAndWorlds = response
    selectedVersion = versionsAndWorlds.version
    selectedWorld = versionsAndWorlds.versions.find(v => v.version === versionsAndWorlds.version).world
    changeScheduler.schedule()
  }

  this.updateVersion = version => {
    if (canUpdateVersion(version)) handlers.onUpdateVersion(version)
  }

  this.selectVersion = version => {
    selectedVersion = version
    selectedWorld = null
  }

  this.selectVersionAndWorld = value => {
    value = JSON.parse(value)
    selectedVersion = value.version
    selectedWorld = value.world
  }

  this.changeVersionAndWorld = () => {
    handlers.onChangeVersionAndWorld(selectedVersion, selectedWorld)
  }

  this.createWorld = () => {
    handlers.onCreateWorld(selectedVersion, this.newWorldName, this.seed)
  }
}
