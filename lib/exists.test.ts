import { assert } from "$std/testing/asserts.ts";
import { join } from "$std/path/mod.ts";
import { exists } from "./exists.ts";

const { cwd, test } = Deno;

test("cwd exists", async (_t) => {
  assert(await exists(cwd()), "cwd should exist");
});

test("file does not exist", async (_t) => {
  assert(
    !(await exists(join(cwd(), "does not exist"))),
    "file should not exist",
  );
});
