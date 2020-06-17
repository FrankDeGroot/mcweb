'use strict'

export function Messages() {
	const messages = []
	return {
		add: message => {
			messages.push(message)
			m.redraw()
		},
		view: () => messages.map(item => m('div', item))
	}
}
