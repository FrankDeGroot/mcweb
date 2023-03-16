import { file, serve, Server, ServerWebSocket } from "bun"

const all = "all"

serve({
  port: 80,
  fetch(request: Request) {
    return new Response(null, {
      headers: {
        "Location": request.url.replace(/^http/, "https")
      },
      status: 301
    })
  }
})

const server = serve({
  certFile: "site.cer",
  keyFile: "site.key",
  port: 443,
  fetch(request: Request, server: Server) {
    if (request.headers.get("upgrade")?.toLocaleLowerCase() === "websocket") {
      if (server.upgrade(request)) {
        return
      } else {
        return new Response("Upgrade to WebSocket failed", { status: 500 })
      }
    }
    const path = new URL(request.url).pathname
    return new Response(file("web" + (path !== "/" ? path : "/main.html")))
  },
  error(e: Error) {
    const status = e.name === "ENOENT" ? 404 : 500
    if (status !== 404) console.error(e)
    return new Response(null, { status })
  },
  websocket: {
    open(ws: ServerWebSocket) {
      ws.subscribe(all)
    },
    message(ws: ServerWebSocket, message: string | Uint8Array) {
      ws.publish(all, "echo " + message)
    }
  }
})

setInterval(() => server.publish(all, new Date().toISOString()), 500)