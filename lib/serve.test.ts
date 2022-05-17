import { assert } from "$std/testing/asserts.ts";
import { serve } from "./serve.ts";

const port = 1024;
let counter = 0;

Deno.test("serve", async (_t) => {
  const server = serve(
    Deno.listen({ port }),
    (_) => {
      counter++;
      return new Response(counter.toString());
    },
  );
  assert(
    await fetchResponse() === "1",
    `Should respond with 1`,
  );
  assert(
    await fetchResponse() === "2",
    `Should respond with 2`,
  );
  server.close();
});

async function fetchResponse() {
  const response = await fetch(`http://localhost:${port}`);
  return await response.text();
}
