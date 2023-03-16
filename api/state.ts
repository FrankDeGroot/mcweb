import { AsyncEvent } from "../lib/async_event.js"
import { getCurrentVersion } from "./mc_path/current_path.js"
import { getRelease, getSnapshot, getVersions } from "./manifest/cache.js"
import { ServerState, serverStateEvent } from "./mc_process.js"

export type State = {
	busy: boolean,
	//TODO Update this with handlers on onCurrentPathChange.
	current: string | null,
	ready: boolean,
	release: string,
	running: boolean,
	snapshot: string,
	versions: string[],
}

export const stateChangedEvent = new AsyncEvent<Partial<State>>

export async function fullState() {
	return state
}

let state: State = {
	busy: false,
	current: getCurrentVersion(),
	ready: false,
	release: await getRelease(),
	running: false,
	snapshot: await getSnapshot(),
	versions: await getVersions(),
}

serverStateEvent.on(async serverState => {
	switch (serverState) {
		case ServerState.starting:
			stateChangedEvent.emit({ ready: false, running: true })
			break;
		case ServerState.started:
			stateChangedEvent.emit({ ready: true, running: true })
			break;
		case ServerState.stopping:
			stateChangedEvent.emit({ ready: false, running: false })
			break;
		case ServerState.stopped:
			stateChangedEvent.emit({ ready: false, running: false })
			break;
	}
})