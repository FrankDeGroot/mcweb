'use strict'

export function GamerulesViewModel (socket, changeScheduler) {
  let state = {
    gamerules: {
    },
    busy: false
  }
  Object.defineProperties(this, {
    gamerules: {
      get: () => Object.entries(state.gamerules)
        .sort(([g1, { label: label1, type: type1 }], [g2, { label: label2, type: type2 }]) => type1 < type2 ? -1 : type1 > type2 ? 1 : label1 < label2 ? -1 : label1 > label2 ? 1 : 0)
        .map(([gamerule, { label, type, value }]) => ({ disabled: state.busy, gamerule, label, type, value }))
        .map(({ disabled, gamerule, label, type, value }) => {
          const indeterminate = value !== true && value !== false
          switch (type) {
            case 'boolean':
              return {
                checked: !!value,
                disabled: disabled || indeterminate,
                gamerule,
                indeterminate,
                label,
                type
              }
            case 'integer':
              return {
                disabled,
                gamerule,
                label,
                type,
                value
              }
            default:
              return {}
          }
        })
    }
  })
  this.setCurrent = current => {
    state = current
  }
  this.setGamerule = (key, value) => {
    if (value !== state.gamerules[key].value) {
      state.gamerules[key].value = value
      socket.emit('setGamerules', { [key]: { value } })
    }
  }
}
