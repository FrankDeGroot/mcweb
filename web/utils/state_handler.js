export function setupStateHandling(socket, viewModels) {
  let state = {}

  function setState() {
    viewModels.forEach(viewModel => {
      viewModel.state = state
    })
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