'use strict'

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
	worlds.setVersion(version)
	submitter.setVersion(version)
})
mount('versions', versions)

const socket = io()
socket
	.on('message', message => messages.add(message))
	.on('changing', () => submitter.disable())
	.on('changed', () => submitter.enable())

function mount(id, component) {
	m.mount(document.getElementById(id), component)
}
