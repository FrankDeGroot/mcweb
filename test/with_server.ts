import { serve } from "$lib/serve.ts";
export const port = 1024;

/**
 * Starts a web server with the handler and runs the test.
 */
export async function withServer(
  test: () => void | Promise<void>,
  handler: (request: Request) => Response | Promise<Response>,
): Promise<void> {
  const server = serve(Deno.listen({ port }), handler);
  try {
    await test();
  } finally {
    server.close();
  }
}
