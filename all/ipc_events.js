import * as webEvents from '../web/events.js'

export const apiReady = 'apiReady'
export const relayedError = 'relayedError'
export const reloadWeb = webEvents.reload
export const state = webEvents.state
export const startMinecraft = webEvents.startMinecraft
export const stopMinecraft = webEvents.stopMinecraft
export const sendMinecraft = webEvents.sendMinecraft
export const receiveMinecraft = webEvents.receiveMinecraft
export const messageNotification = webEvents.messageNotification
export const errorNotification = webEvents.errorNotification
