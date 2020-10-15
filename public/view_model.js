'use strict'

export function ViewModel (handlers) {
  // Non-breaking spaces!
  const emptyMessages = [' ', ' ']
  let messages = [...emptyMessages]
  let versions = []
  let worlds = []
  let currentVersion = null
  let currentWorld = null
  let busy = false
  let changeScheduled = false

  function scheduleChange () {
    if (handlers.onChange && !changeScheduled) {
      setTimeout(() => {
        changeScheduled = false
        handlers.onChange()
      }, 0)
      // changeScheduled = true
    }
  }

  Object.defineProperties(this, {
    messages: {
      get: () => messages
    },
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
          handlers.onChangeVersion && handlers.onChangeVersion(value)
          scheduleChange()
        }
      }
    },
    currentWorld: {
      get: () => currentWorld,
      set: value => {
        if (currentWorld !== value) {
          currentWorld = value
          handlers.onChangeWorld && handlers.onChangeWorld(value)
          scheduleChange()
        }
      }
    },
    busy: {
      get: () => busy,
      set: value => {
        if (busy !== value) {
          busy = value
          busy ? handlers.onBusy && handlers.onBusy() : handlers.onReady && handlers.onReady()
          scheduleChange()
        }
      }
    },
    canUpdate: {
      get: () => !busy && ['release', 'snapshot'].indexOf(currentVersion) !== -1
    }
  })

  this.seed = null
  this.newWorldName = null

  this.pushMessage = message => {
    messages.unshift(message)
    messages.splice(emptyMessages.length)
    scheduleChange()
  }

  this.pushError = error => {
    this.pushMessage(`Error: ${error}`)
  }

  this.clearMessages = () => {
    messages = [...emptyMessages]
    scheduleChange()
  }

  this.loadVersionAndWorld = response => {
    versions = response.versions
    currentVersion = response.version
    this.loadWorld(response)
  }

  this.loadWorld = response => {
    worlds = response.worlds
    currentWorld = response.world
    scheduleChange()
  }

  this.updateVersion = version => {
    handlers.onUpdateVersion && handlers.onUpdateVersion(currentVersion)
  }

  this.changeVersionAndWorld = () => {
    handlers.onChangeVersionAndWorld && handlers.onChangeVersionAndWorld(currentVersion, currentWorld)
  }

  this.createWorld = () => {
    handlers.onCreateWorld && handlers.onCreateWorld(currentVersion, this.seed, this.newWorldName)
  }
}
