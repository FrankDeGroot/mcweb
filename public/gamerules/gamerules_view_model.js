'use strict'

export function GamerulesViewModel (socket, changeScheduler) {
  let state = {
    gamerules: {
    },
    busy: false
  }
  Object.defineProperties(this, {
    gamerules: {
      get: () => state.gamerules
    }
  })
  this.setCurrent = current => {
    state = current
  }
  this.setGamerule = (key, value) => {
    if (value !== state.gamerules[key].value) {
      state.gamerules[key].value = value
      socket.emit('setGamerules', { [key]: state.gamerules[key] })
    }
  }
}
