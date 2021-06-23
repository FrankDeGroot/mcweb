export class UpdateViewModel {
  #state = {
    busy: false
  }
  #socket
  constructor(socket) {
    this.#socket = socket
  }
  get updateReleaseButtonDisabled() {
    return this.#state.busy
  }
  get updateSnapshotButtonDisabled() {
    return this.#state.busy
  }
  #canUpdateVersion(version) {
    return ['release', 'snapshot'].indexOf(version) !== -1
  }
  updateVersion(version) {
    if (this.#canUpdateVersion(version)) this.#socket.emit('update', { version })
  }
  setCurrent(current) {
    this.#state = current
  }
}