export class ChangeViewModel {
	#state = {
		versions: [],
		version: null,
		busy: false
	}
	#selectedVersion = null
	#selectedWorld = null
	#socket
	#changeScheduler
	constructor(socket, changeScheduler) {
		this.#socket = socket
		this.#changeScheduler = changeScheduler
	}
	get versions() {
		return Object.entries(this.#state.versions).map(([version, value]) => {
			return {
				label: version + (version === this.#state.version ? ' (current)' : ''),
				options: value.worlds.map(world => {
					return {
						label: version + ' ' + world + (world === value.world ? ' (current)' : ''),
						selected: version === this.#selectedVersion && world === this.#selectedWorld,
						value: JSON.stringify({
							version: version,
							world: world
						})
					}
				})
			}
		})
	}
	get versionAndWorldSelectSize() {
		const versions = Object.values(this.#state.versions)
		return versions.length + versions.map(({ worlds }) => worlds.length).reduce((a, l) => a + l, 0)
	}
	get versionAndWorldSelectDisabled() {
		return this.#state.busy
	}
	get changeButtonDisabled() {
		return this.#state.busy || (
			!this.#selectedVersion && !this.#selectedWorld
		) || (
				this.#selectedVersion === this.#state.version &&
				this.#selectedWorld === this.#state.versions[this.#selectedVersion].world
			)
	}
	set state(state) {
		this.#state = state
		if (!this.#selectedVersion ||
			!this.#state.versions[this.#selectedVersion]) {
			this.#selectedVersion = this.#state.version
			this.#selectedWorld = null
		}
		if (!this.#selectedWorld ||
			!this.#state.versions[this.#selectedVersion].worlds.includes(this.#selectedWorld)) {
			this.#selectedWorld = this.#state.versions[this.#selectedVersion].world
		}
		this.#changeScheduler.schedule()
	}
	selectVersionAndWorld(value) {
		const { version, world } = JSON.parse(value)
		this.#selectedVersion = version
		this.#selectedWorld = world
		this.#changeScheduler.schedule()
	}
	changeVersionAndWorld() {
		this.#socket.emit('change', {
			version: this.#selectedVersion,
			world: this.#selectedWorld
		})
	}
}
