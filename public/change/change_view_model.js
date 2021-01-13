'use strict'

export function ChangeViewModel (handlers, changeScheduler) {
  let versionsAndWorlds = {
    versions: [],
    version: null
  }
  let selectedVersion = null
  let selectedWorld = null

  handlers = {
    onChangeVersionAndWorld: () => {},
    ...handlers
  }

  Object.defineProperties(this, {
    versions: {
      get: () => Object.entries(versionsAndWorlds.versions).map(([version, value]) => {
        return {
          label: version + (version === versionsAndWorlds.version ? ' (current)' : ''),
          options: value.worlds.map(world => {
            return {
              label: version + ' ' + world + (world === value.world ? ' (current)' : ''),
              selected: world === selectedWorld,
              value: JSON.stringify({
                version: version,
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
    if (!selectedVersion ||
        !versionsAndWorlds.versions[selectedVersion]) {
      selectedVersion = versionsAndWorlds.version
      selectedWorld = null
    }
    if (!selectedWorld ||
        !versionsAndWorlds.versions[selectedVersion].worlds.includes(selectedWorld)) {
      selectedWorld = versionsAndWorlds.versions[selectedVersion].world
    }
    changeScheduler.schedule()
  }

  this.selectVersionAndWorld = value => {
    const { version, world } = JSON.parse(value)
    selectedVersion = version
    selectedWorld = world
  }

  this.changeVersionAndWorld = () => {
    handlers.onChangeVersionAndWorld(selectedVersion, selectedWorld)
  }
}
