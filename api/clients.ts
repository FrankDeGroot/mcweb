import Dispatcher from "$api/dispatcher.ts";

export default class Clients {
  readonly #sockets: WebSocket[] = [];
  readonly #Dispatcher = new Dispatcher((data) => this.#send(data));

  upgrade(request: Request) {
    const { socket, response } = Deno.upgradeWebSocket(request);
    this.#connect(socket);
    return response;
  }

  #connect(socket: WebSocket) {
    socket.onopen = () => this.#add(socket);
    socket.onmessage = (e: MessageEvent<string>) =>
      this.#Dispatcher.dispatch(e.data);
    socket.onerror = (e) => {
      console.warn("socket errored:", e);
      this.#remove(socket);
    };
    socket.onclose = () => this.#remove(socket);
  }

  #add(socket: WebSocket) {
    this.#sockets.push(socket);
  }

  #remove(socket: WebSocket) {
    this.#sockets.splice(this.#sockets.indexOf(socket), 1);
  }

  #send(data: Parameters<WebSocket["send"]>[0]) {
    this.#sockets.forEach((socket) => socket.send(data));
  }
}
