export function serve(
  listener: Deno.Listener,
  handler: (_: Request) => Response | Promise<Response>,
) {
  const httpCons: Deno.HttpConn[] = [];
  (async () => {
    for await (const conn of listener) {
      (async () => {
        const httpCon = Deno.serveHttp(conn);
        httpCons.push(httpCon);
        for await (const { respondWith, request } of httpCon) {
          respondWith(handler(request));
        }
      })();
    }
  })();
  return {
    close: () => {
      httpCons.forEach((httpCon) => httpCon.close());
      listener.close();
    },
  };
}
