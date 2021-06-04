export function setupState (socket, viewModels) {
  let state = {}

  function setState () {
    Object.values(viewModels).map(viewModel => viewModel.setCurrent(state))
  }

  socket
    .on('current', current => {
      state = current
      setState()
    })
    .on('changed', changed => {
      state = { ...state, ...changed }
      setState()
    })
}
