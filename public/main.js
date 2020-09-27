'use strict'

import { Messages } from './messages.js'
import { Submitter } from './submitter.js'
import { Versions } from './versions.js'
import { Worlds } from './worlds.js'
import { Updater } from './updater.js'

function Main () {
  const model = {
    messages: [],
    versions: [],
    worlds: [],
    version: '',
    world: '',
    busy: false
  }
  const socket = io()
    .on('message', message => pushMessage(message))
    .on('throw', message => redraw(() => pushMessage('Error: ' + message)))
    .on('changing', () => busy(true))
    .on('changed', () => busy(false))
    .on('updating', () => busy(true))
    .on('updated', () => busy(false))
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

  function redraw (handler) {
    handler()
    m.redraw()
  }

  function pushMessage (message) {
    model.messages.push(message)
    if (model.messages.length > 3) {
      model.messages.shift()
    }
    m.redraw()
  }

  function busy (busy) {
    model.busy = busy
    m.redraw()
    if (!busy) socket.emit('current')
  }

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
      m(Updater, {
        onupdateversion: version => socket.emit('update', { version }),
        model
      }),
      m(Messages, { model })
    ]
  }
}
m.mount(document.getElementById('main'), Main)
