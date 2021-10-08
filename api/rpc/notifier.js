import * as webEvents from '../../web/events.js'
import { server } from '../server.js'

const { info, error } = console

export function notify(message) {
	info(message)
	server.emit(webEvents.messageNotification, message)
}

export async function notifyThrow(action) {
	try {
		return await action()
	} catch (err) {
		if (err.code) {
			error(err)
		} else {
			info(err)
		}
		server.emit(webEvents.errorNotification, err.code ? 'An internal error occurred' : err.message)
	}
}
