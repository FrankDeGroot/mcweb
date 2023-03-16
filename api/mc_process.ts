import { ensureCurrentPath } from "./mc_path/current_path.js"
import { OptionsToSubprocessIO, spawn, stdout, Subprocess } from "bun"
import { AsyncEvent } from "../lib/async_event.js"

export enum ServerState {
  starting,
  started,
  stopping,
  stopped,
}

const decoder = new TextDecoder()
type ServerProcess = Subprocess<OptionsToSubprocessIO<{
  stdin: "pipe",
  stdout: "pipe",
}>>
let serverState: ServerState = ServerState.stopped
let serverProcess: ServerProcess | null = null
export const serverStateEvent = new AsyncEvent<ServerState>()

export function getServerState() {
  return serverState
}

// TODO get rid of version parameter
export async function ensureStarting(version: string) {
  if (serverProcess) return
  const currentPath = await ensureCurrentPath(version)
  changeServerState(ServerState.starting)
  serverProcess = spawn(["java", "-jar", "server.jar"], {
    cwd: currentPath,
    stdin: "pipe",
    stdout: "pipe",
  })
}

// TODO get rid of version parameter
export async function ensureStarted(version: string) {
  if (!serverProcess) return
  if (serverState === ServerState.stopped) await ensureStarting(version)
  if (serverState !== ServerState.starting) throw new Error('Server not starting')
  await new Promise<void>(async (resolve, reject) => {
    if (!serverProcess) {
      reject(new Error("Process got killed while waiting for starting to complete"))
    } else if (!serverProcess.stdout) {
      reject(new Error("Process has no stdout"))
    } else {
      const reader = serverProcess.stdout.getReader()
      const writer = stdout.writer();
      let result: ReadableStreamDefaultReadResult<any> | null = null
      do {
        result = await reader.read()
        if (result.value) {
          const text = decoder.decode(result.value)
          writer.write("mc: " + text)
          writer.flush()
          if (text.match(/: Done/)) {
            changeServerState(ServerState.started)
            resolve()
          }
        }
      } while (!result.done)
      if (serverState !== ServerState.started) reject(new Error("Server never started"))
    }
  })
}

export async function ensureStopped() {
  if (!serverProcess) return
  if (!serverProcess.stdin) throw new Error("No stdin")
  changeServerState(ServerState.stopping)
  serverProcess.stdin.write("stop\r");
  await serverProcess.exited
  serverProcess = null
  changeServerState(ServerState.stopped)
}

function changeServerState(newServerState: ServerState) {
  serverState = newServerState
  serverStateEvent.emit(serverState)
}
