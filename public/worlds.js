'use strict'

import { select } from './select.js'

export function Worlds(version, onchange) {
	var worlds = []
	var current = ""
	var selected = ""

	async function load() {
		try {
			worlds = await m.request({
				url: '/api/versions/' + version + '/worlds'
			})
			onchange(selected = current = await m.request({
				url: '/api/versions/' + version + '/worlds/current'
			}))
		} catch(e) {
			window.alert(e)
		}
	}
	return {
		oninit: load,
		setVersion: newVersion => {
			version = newVersion
			load()
		},
		view: () => select('Worlds', value => onchange(selected = value), worlds, selected)
	}
}
