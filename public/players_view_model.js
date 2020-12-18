'use strict'

import { Scheduler } from './scheduler.js'

export function PlayersViewModel (handlers) {
  let players = []
  const changeScheduler = new Scheduler(handlers.onChange)
  Object.defineProperties(this, {
    players: {
      get: () => players
    },
    currentPlayer: {
      get: () => null,
      set: value => undefined
    },
    busy: {
      get: () => false
    }
  })
  this.loadPlayers = response => {
    players = response.allowed.map(player => player.name)
    changeScheduler.schedule()
  }
}
