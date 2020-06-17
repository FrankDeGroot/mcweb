'use strict'

export function Submitter(onsubmit) {
	var version
	var world
	var enabled = true
	return {
		setVersion: newVersion => version = newVersion,
		setWorld: newWorld => world = newWorld,
		enable: () => {
			enabled = true
			m.redraw()
		},
		disable: () => {
			enabled = false
			m.redraw()
		},
		view: () => m('button', {
			onclick: e => onsubmit(version, world),
			disabled: enabled ? undefined : 'disabled'
		}, 'Change')
	}
}

