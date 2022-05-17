import { assert } from "$std/testing/asserts.ts";
import { port, withSocketServer } from "$test/socket_server.ts";

const url = `ws:/localhost:${port}`;

Deno.test("api", async () => {
  let socketConnected = false;
  await withSocketServer((webSocket) => {
    webSocket.onmessage = (event) => console.log(event.data);
    socketConnected = true;
  }, async () => {
    const s1 = new WebSocket(url);
    s1.onopen = () => s1.send("This is a test!");
    await delay();
    assert(socketConnected);
    s1.close();
  });
});

function delay() {
  return new Promise((resolve) => setTimeout(resolve, 10));
}
