import MinecraftServer from "$api/minecraft_server/minecraft_server.ts";

export default class Dispatcher {
  readonly #send: (message: string) => void;
  readonly #minecraftServer = new MinecraftServer();

  constructor(send: (_: string) => void) {
    this.#send = send;
  }

  async dispatch(data: string) {
    switch (data) {
      case "start":
        await this.#minecraftServer.start();
        this.#send("Minecraft Running");
        break;
      case "stop":
        await this.#minecraftServer.stop();
        this.#send("Minecraft stopped");
        break;
      default:
        console.warn(`Unknown message '${data}'.`);
        break;
    }
  }
}
