'use strict'

import { select } from './select.js'

export function Versions(onchange) {
	var versions = []
	var current = ""
	var selected = ""
	return {
		load: async data => {
			versions = data.versions
			onchange(selected = current = data.current.version)
			m.redraw()
		},
		view: () => select('Versions', value => onchange(selected = value), versions, selected)
	}
}

