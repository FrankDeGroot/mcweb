'use strict'

import { select } from './select.js'

export function Versions(onchange) {
	var versions = []
	var current = ""
	var selected = ""
	return {
		oninit: async () => {
			versions = await m.request({
				url: '/api/versions'
			})
			onchange(selected = current = await m.request({
				url: '/api/versions/current'
			}))
		},
		view: () => select(e => onchange(selected = e.target.value), versions, selected)
	}
}

