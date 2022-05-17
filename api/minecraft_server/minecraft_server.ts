import { getCurrentPath } from "$api/minecraft_server/current_path.ts";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const buffer = new Uint8Array(1000);

export default class MinecraftServer {
  #process: Deno.Process | null = null;
  #ready: Promise<void> | null = null;

  start() {
    if (this.#process) throw new Error("Minecraft Server already running.");
    this.#process = Deno.run({
      cmd: ["java", "-jar", "server.jar"],
      cwd: getCurrentPath(),
      stdin: "piped",
      stdout: "piped",
    });
    this.#ready = new Promise<void>((resolve, reject) => {
      if (!this.#process) {
        reject("Minecraft Server not running");
      } else {
        if (!this.#process.stdout) {
          reject(new Error("Process has no stdout"));
        } else {
          const read = () => {
            if (!this.#process) {
              reject("Minecraft Server not running");
            } else {
              this.#process.stdout?.read(buffer).then((count) => {
                if (count != null) {
                  const line = decoder.decode(buffer.slice(0, count));
                  Deno.stdout.write(encoder.encode("mc: " + line));
                  if (line.match(/: Done/)) resolve();
                  setTimeout(read);
                }
              });
            }
          };
          read();
        }
      }
    });
    return this.#ready;
  }

  async stop() {
    if (!this.#process) throw new Error("Minecraft Server not running");
    if (this.#process.stdin) {
      this.#process.stdin.write(encoder.encode("stop\r"));
      await this.#process.status();
      this.#process.close();
      this.#process.stdin.close();
      this.#process.stdout?.close();
    }
  }
}
