import { serve } from "$lib/serve.ts";
import { serveDir } from "$std/http/file_server.ts";
import Clients from "$api/clients.ts";

const clients = new Clients();

serve(
  Deno.listenTls({
    certFile: "site.cer",
    keyFile: "site.key",
    port: 443,
  }),
  async function (request: Request) {
    try {
      return request.headers.get("upgrade")?.toLowerCase() === "websocket"
        ? clients.upgrade(request)
        : await serveDir(request, {
          fsRoot: "web",
        });
    } catch (e) {
      console.error(e);
      return new Response(undefined, {
        status: 500,
      });
    }
  },
);

serve(
  Deno.listen({ port: 80 }),
  (request) =>
    new Response(undefined, {
      headers: {
        location: request.url.replace(/^http/, "https"),
      },
      status: 301,
    }),
);
