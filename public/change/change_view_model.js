export function ChangeViewModel (socket, changeScheduler) {
  let state = {
    versions: [],
    version: null,
    busy: false
  }
  let selectedVersion = null
  let selectedWorld = null

  Object.defineProperties(this, {
    versions: {
      get: () => Object.entries(state.versions).map(([version, value]) => {
        return {
          label: version + (version === state.version ? ' (current)' : ''),
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
    },
    versionAndWorldSelectSize: {
      get: () => {
        const versions = Object.values(state.versions)
        return versions.length + versions.map(({ worlds }) => worlds.length).reduce((a, l) => a + l, 0)
      }
    },
    versionAndWorldSelectDisabled: {
      get: () => state.busy
    },
    changeButtonDisabled: {
      get: () => state.busy || (
        !selectedVersion && !selectedWorld
      ) || (
        selectedVersion === state.version &&
            selectedWorld === state.versions[selectedVersion].world
      )
    }
  })

  this.setCurrent = current => {
    state = current
    if (!selectedVersion ||
        !state.versions[selectedVersion]) {
      selectedVersion = state.version
      selectedWorld = null
    }
    if (!selectedWorld ||
        !state.versions[selectedVersion].worlds.includes(selectedWorld)) {
      selectedWorld = state.versions[selectedVersion].world
    }
    changeScheduler.schedule()
  }

  this.selectVersionAndWorld = value => {
    const { version, world } = JSON.parse(value)
    selectedVersion = version
    selectedWorld = world
  }

  this.changeVersionAndWorld = () => {
    socket.emit('change', {
      version: selectedVersion,
      world: selectedWorld
    })
  }
}
