export function messagesView (messagesViewModel) {
  return _`<label>Messages</label>
  <messages>${messagesViewModel.messages.map(message => _`<message>${message}</message>`)}</messages>
  <button ?disabled=${messagesViewModel.noMessages()} onclick=${() => messagesViewModel.clearMessages()}>Clear</button>`
}
