import { state } from '../../all/state.js'

export function isBusy() {
	return state.current.busy
}

export async function doIfNotBusy(action) {
	if (isBusy()) {
		throw new Error('Already busy')
	}
	try {
		state.update({ busy: true })
		return await action()
	} finally {
		state.update({ busy: false })
	}
}
