const { protocol, host } = window.location;
const socket = new WebSocket(
  `ws${protocol.includes("s") ? "s" : ""}://${host}`,
);
let elements
const state = new Proxy({ message: "-" }, {
  set(o, p, v) {
    if (!elements) {
      elements = document.querySelectorAll(`[data="${p}"]`)
    }
    for (const el of elements) {
      el.innerText = v
    }
    return Reflect.set(o, p, v)
  }
});
socket.onopen = () => {
  announce("connected")
}
socket.onmessage = event => {
  announce(event.data)
}
function announce(message) {
  state.message = message
  console.log(`message: ${message}`)
}
