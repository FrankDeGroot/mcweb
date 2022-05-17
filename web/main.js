const { protocol, host } = window.location;
const socket = new WebSocket(
  `ws${protocol.includes("s") ? "s" : ""}://${host}`,
);
const { html, render } = uhtml;
const state = { message: "-" };
function refresh() {
  render(
    document.body,
    html`<div>
      <h1>${state.message}</h1>
      <button onclick=${() => socket.send("start")}>start</button>
      <button onclick=${() => socket.send("stop")}>stop</button>
    </div>`,
  );
}
socket.onopen = () => {
  announce("connected");
  refresh();
};
socket.onmessage = (event) => {
  announce(event.data);
  refresh();
};
function announce(message) {
  state.message = message;
  console.log(`message: ${message}`);
}
refresh();
