'use strict'

import { Scheduler } from '../scheduler.js'

export function ChangeViewModel (handlers) {
  let versionsAndWorlds = {
    versions: [],
    version: null
  }
  let selectedVersion = null
  let selectedWorld = null

  handlers = {
    onChange: () => {},
    onChangeVersionAndWorld: () => {},
    ...handlers
  }
  const changeScheduler = new Scheduler(handlers.onChange)

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
          })
        }
      })
    }
  })

  this.setCurrent = current => {
    versionsAndWorlds = current
    selectedVersion = versionsAndWorlds.version
    selectedWorld = versionsAndWorlds.versions.find(v => v.version === versionsAndWorlds.version).world
    changeScheduler.schedule()
  }

  this.selectVersionAndWorld = value => {
    value = JSON.parse(value)
    selectedVersion = value.version
    selectedWorld = value.world
  }

  this.changeVersionAndWorld = () => {
    handlers.onChangeVersionAndWorld(selectedVersion, selectedWorld)
  }
}
