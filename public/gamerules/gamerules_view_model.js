export class GamerulesViewModel {
  #state = {
    gamerules: {
    },
    busy: false
  }
  #socket
  #changeScheduler
  constructor(socket, changeScheduler) {
    this.#socket = socket
    this.#changeScheduler = changeScheduler
  }
  get gamerules() {
    return Object.entries(this.#state.gamerules)
      .sort(([g1, { label: label1, type: type1 }], [g2, { label: label2, type: type2 }]) => type1 < type2 ? -1 : type1 > type2 ? 1 : label1 < label2 ? -1 : label1 > label2 ? 1 : 0)
      .map(([gamerule, { label, type, value }]) => ({ disabled: this.#state.busy, gamerule, label, type, value }))
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
  set state(state) {
    this.#state = state
  }
  setGamerule(key, value) {
    if (value !== this.#state.gamerules[key].value) {
      this.#state.gamerules[key].value = value
      this.#socket.emit('setGamerules', { [key]: { value } })
    }
  }
}
