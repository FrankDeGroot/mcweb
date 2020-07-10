'use strict'

import { select } from './select.js'

export function Worlds(version, onchange) {
	var worlds = []
	var current = ""
	var selected = ""
	return {
		load: async data => {
			worlds = data.worlds
			onchange(selected = current = data.current.world)
			m.redraw()
		},
		view: () => select('Worlds', value => onchange(selected = value), worlds, selected)
	}
}
