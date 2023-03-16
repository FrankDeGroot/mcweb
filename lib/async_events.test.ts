import { AsyncEvent } from "./async_event.js"
import { expect, test } from "bun:test"

test("should invoke all handlers on emit", async () => {
	const asyncEvent = new AsyncEvent<never>()

	asyncEvent.on(() => new Promise(resolve => setTimeout(resolve, 100)))

	await asyncEvent.emit()
})
