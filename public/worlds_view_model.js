'use strict'

import { ChangeScheduler } from './change_scheduler.js'

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
  const changeScheduler = new ChangeScheduler(handlers.onChange)

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
          changeScheduler.scheduleChange()
        }
      }
    },
    currentWorld: {
      get: () => currentWorld,
      set: value => {
        if (currentWorld !== value) {
          currentWorld = value
          handlers.onChangeWorld(value)
          changeScheduler.scheduleChange()
        }
      }
    },
    busy: {
      get: () => busy,
      set: value => {
        if (busy !== value) {
          busy = value
          busy ? handlers.onBusy() : handlers.onReady()
          changeScheduler.scheduleChange()
        }
      }
    },
    canUpdate: {
      get: () => !busy && ['release', 'snapshot'].indexOf(currentVersion) !== -1
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
    changeScheduler.scheduleChange()
  }

  this.updateVersion = version => {
    handlers.onUpdateVersion(currentVersion)
  }

  this.changeVersionAndWorld = () => {
    handlers.onChangeVersionAndWorld(currentVersion, currentWorld)
  }

  this.createWorld = () => {
    handlers.onCreateWorld(currentVersion, this.newWorldName, this.seed)
  }
}
