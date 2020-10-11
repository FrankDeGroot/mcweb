'use strict'

import { Messages } from './messages.js'
import { Changer } from './changer.js'
import { Versions } from './versions.js'
import { Worlds } from './worlds.js'
import { Updater } from './updater.js'
import { Creator } from './creator.js'

function Main () {
  // Non-breaking spaces!
  const emptyMessages = [' ', ' ']
  const model = {
    messages: [...emptyMessages],
    versions: [],
    worlds: [],
    version: '',
    world: '',
    seed: '',
    busy: false,
    canUpdate: false
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
      model.busy = false
      model.canUpdate = canUpdate(response.version)
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
    model.messages.unshift(message)
    model.messages.splice(emptyMessages.length)
    m.redraw()
  }

  function busy (busy) {
    model.busy = busy
    m.redraw()
    if (!busy) socket.emit('current')
  }

  function canUpdate (version) {
    return ['release', 'snapshot'].indexOf(model.version) !== -1
  }

  return {
    view: vnode => [
      m(Versions, {
        onChangeVersion: version => {
          model.version = version
          model.canUpdate = canUpdate(version)
          socket.emit('worlds', version)
        },
        model
      }),
      m(Updater, {
        onUpdateVersion: version => socket.emit('update', { version }),
        model
      }),
      m(Worlds, {
        onChangeWorld: world => {
          model.world = world
        },
        model
      }),
      m(Changer, {
        onChangeVersionAndWorld: () => socket.emit('change', {
          version: model.version,
          world: model.world
        }),
        model
      }),
      m(Creator, {
        onCreateWorld: seed => socket.emit('create', {
          version: model.version,
          world: model.world,
          seed
        }),
        model
      }),
      m(Messages, {
        onClearMessages: () => {
          model.messages = [...emptyMessages]
          m.redraw()
        },
        model
      })
    ]
  }
}
m.mount(document.getElementById('main'), Main)
