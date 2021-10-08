import { Server } from 'socket.io'
import { apiPort } from '../all/config.js'

export const server = new Server(apiPort)
