import chokidar from 'chokidar'
import { spawn } from 'child_process'

const { error, log } = console

let apiProcess = null

function rerun() {
  if (apiProcess) {
    log('Killing API Process')
    apiProcess.kill()
  } else {
    run()
  }
}

function run() {
  log('Spawning API Process')
  apiProcess = spawn(process.argv0, ['--unhandled-rejections=strict', 'api/index.mjs'], {
    stdio: ['pipe', 'inherit', 'inherit']
  })
    .on('error', err => {
      error('API Process spawn error', err)
    })
    .on('close', (code, signal) => {
      apiProcess = null
      if (signal) {
        log('API Process killed with', signal)
      } else {
        log('API Process exited with', code)
        if (code) {
          log('Waiting for error to be fixed before restarting')
          return
        }
      }
      run()
    })
}

const apiWatcher = chokidar.watch('api').on('ready', () => {
  apiWatcher.on('all', () => rerun())
})

const webWatcher = chokidar.watch('web').on('ready', () => {
  webWatcher.on('all', () => apiProcess && apiProcess.stdin.write('r\n'))
})

run()
