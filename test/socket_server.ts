import { withServer } from "$test/with_server.ts";

export { port } from "$test/with_server.ts";

/**
 * Run a WebSocket server and run the test.
 * @param socketConnected handler to run when a new socket is connected.
 * @param test the test to run.
 */
export async function withSocketServer(
  socketConnected: (_: WebSocket) => void,
  test: () => void | Promise<void>,
): Promise<void> {
  await withServer(test, (request) => {
    const { socket, response } = Deno.upgradeWebSocket(request);
    socketConnected(socket);
    return response;
  });
}
