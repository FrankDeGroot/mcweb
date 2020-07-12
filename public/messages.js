'use strict'

export function Messages() {
	return {
		view: vnode => vnode.attrs.model.messages.map(item => m('div', item))
	}
}
