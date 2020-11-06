'use strict'

import { Scheduler } from './scheduler.js'

export function WorldsViewModel (handlers) {
  let versions = []
  let worlds = []
  let currentVersion = null
  let currentWorld = null
  let busy = false

  handlers = {
    onBusy: () => {},
    onChange: () => {},
    onChangeVersion: () => {},
    onChangeVersionAndWorld: () => {},
    onChangeWorld: () => {},
    onCreateWorld: () => {},
    onReady: () => {},
    onUpdateVersion: () => {},
    ...handlers
  }
  const changeScheduler = new Scheduler(handlers.onChange)

  function canUpdateCurrentVersion () {
    return ['release', 'snapshot'].indexOf(currentVersion) !== -1
  }

  Object.defineProperties(this, {
    versions: {
      get: () => versions
    },
    worlds: {
      get: () => worlds
    },
    currentVersion: {
      get: () => currentVersion,
      set: value => {
        if (currentVersion !== value) {
          currentVersion = value
          handlers.onChangeVersion(value)
          changeScheduler.schedule()
        }
      }
    },
    currentWorld: {
      get: () => currentWorld,
      set: value => {
        if (currentWorld !== value) {
          currentWorld = value
          handlers.onChangeWorld(value)
          changeScheduler.schedule()
        }
      }
    },
    busy: {
      get: () => busy,
      set: value => {
        if (busy !== value) {
          busy = value
          busy ? handlers.onBusy() : handlers.onReady()
          changeScheduler.schedule()
        }
      }
    },
    canUpdate: {
      get: () => !busy && canUpdateCurrentVersion()
    }
  })

  this.seed = null
  this.newWorldName = null

  this.loadVersionAndWorld = response => {
    versions = response.versions
    currentVersion = response.version
    this.loadWorld(response)
  }

  this.loadWorld = response => {
    worlds = response.worlds
    currentWorld = response.world
    changeScheduler.schedule()
  }

  this.updateVersion = () => {
    if (canUpdateCurrentVersion()) handlers.onUpdateVersion(currentVersion)
  }

  this.changeVersionAndWorld = () => {
    handlers.onChangeVersionAndWorld(currentVersion, currentWorld)
  }

  this.createWorld = () => {
    handlers.onCreateWorld(currentVersion, this.newWorldName, this.seed)
  }
}
