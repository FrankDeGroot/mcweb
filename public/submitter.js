'use strict'

export function Submitter() {
	return {
		view: vnode => m(polythene.Button, {
			label: 'Change',
			events: {
				onclick: e => vnode.attrs.onsubmit()
			},
			disabled: vnode.attrs.model.busy ? 'disabled' : undefined
		})
	}
}

