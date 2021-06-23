export class CreateViewModel {
  #state = {
    versions: [],
    version: null,
    busy: false
  }
  #selectedVersion = null
  #newWorldName = null
  #socket
  #changeScheduler
  constructor(socket, changeScheduler) {
    this.#socket = socket
    this.#changeScheduler = changeScheduler
  }
  seed = null
  get versions() {
    return Object.keys(this.#state.versions).map(version => {
      return {
        label: version + (version === this.#state.version ? ' (current)' : ''),
        selected: version === this.#selectedVersion,
        value: version
      }
    })
  }
  get newWorldName() {
    return this.#newWorldName
  }
  set newWorldName(value) {
    if (value !== this.#newWorldName) {
      this.#newWorldName = value
      this.#changeScheduler.schedule()
    }
  }
  get versionSelectDisabled() {
    return this.#state.busy
  }
  get nameInputDisabled() {
    return this.#state.busy
  }
  get seedInputDisabled() {
    return this.#state.busy
  }
  get createButtonDisabled() {
    return this.#state.busy || !this.#newWorldName
  }
  setCurrent(current) {
    this.#state = current
    if (!this.#selectedVersion ||
      !this.#state.versions[this.#selectedVersion]) {
      this.#selectedVersion = this.#state.version
    }
    this.#changeScheduler.schedule()
  }
  selectVersion(version) {
    this.#selectedVersion = version
  }
  createWorld() {
    this.#socket.emit('create', {
      version: this.#selectedVersion,
      world: this.#newWorldName,
      seed: this.seed
    })
    this.#changeScheduler.schedule()
  }
}
