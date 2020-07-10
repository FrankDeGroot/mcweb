'use strict'

const socket = io()

import { Messages } from './messages.js'
const messages = new Messages()
mount('messages', messages)

import { Submitter } from './submitter.js'
const submitter = new Submitter((version, world) => socket.emit('change', {
	version,
	world
}))
mount('submitter', submitter)

import { Worlds } from './worlds.js'
const worlds = new Worlds('current', submitter.setWorld)
mount('worlds', worlds)

import { Versions } from './versions.js'
const versions = new Versions(version => {
	socket.emit('worlds', version)
	submitter.setVersion(version)
})
mount('versions', versions)

socket
	.on('message', message => messages.add(message))
	.on('changing', () => submitter.disable())
	.on('changed', () => submitter.enable())
	.on('current', response => {
		versions.load(response)
		worlds.load(response.current)
	})
	.on('worlds', response => {
		worlds.load(response)
	})

socket.emit('current')

function mount(id, component) {
	m.mount(document.getElementById(id), component)
}
