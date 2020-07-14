'use strict'

import { Messages } from './messages.js'
import { Submitter } from './submitter.js'
import { Versions } from './versions.js'
import { Worlds } from './worlds.js'

function Main() {
	const model = {
		messages: [],
		versions: [],
		worlds: [],
		version: "",
		world: "",
		changing: false,
	}

	function redraw(handler) {
		handler()
		m.redraw()
	}

	const socket = io()
		.on('message', message => {
			model.messages.push(message)
			if (model.messages.lengh > 3) {
				model.messages.shift()
			}
			m.redraw()
		})
		.on('throw', message => redraw(() => model.messages.push('Error: ' + message)))
		.on('changing', () => redraw(() => model.changing = true))
		.on('changed', () => redraw(() => model.changing = false))
		.on('current', response => {
			model.versions = response.versions
			model.version = response.version
			model.worlds = response.worlds
			model.world = response.world
			m.redraw()
		})
		.on('worlds', response => {
			model.worlds = response.worlds
			model.world = response.world
			m.redraw()
		})
		.emit('current')

	return {
		view: vnode => [
			m(Versions, {
				onchange: version => {
					socket.emit('worlds', version)
				},
				model
			}),
			m(Worlds, {
				model
			}),
			m(Submitter, {
				onsubmit: () => socket.emit('change', {
					version: model.version,
					world: model.world
				}),
				model
			}),
			m(Messages, { model }),
		]
	}
}
m.mount(document.getElementById('main'), Main)

