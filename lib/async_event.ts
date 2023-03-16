type Handler<T> = (...arg: T extends never ? [] : [T]) => Promise<void>

export class AsyncEvent<T> {
	#handlers = new Set<Handler<T>>()

	on(handler: Handler<T>) {
		this.#handlers.add(handler)
	}

	async emit(...arg: T extends never ? [] : [T]) {
		for (const handler of this.#handlers.values()) {
			await handler(...arg)
		}
	}
}