'use strict'

export function GamerulesViewModel (socket, changeScheduler) {
  let state = {
    gamerules: {
      keepInventory: false
    },
    busy: false
  }
  Object.defineProperties(this, {
    keepInventory: {
      get: () => state.gamerules.keepInventory,
      set: value => {
        if (value !== state.gamerules.keepInventory) {
          state.gamerules.keepInventory = value
          socket.emit('setGamerules', { keepInventory: value })
        }
      }
    }
  })
  this.setCurrent = current => {
    state = current
  }
}
