import { join } from "$std/path/mod.ts";
import { assertEquals } from "$std/testing/asserts.ts";
import { assertDirectory, assertFile } from "$test/asserts.ts";
import { inTempMcPath } from "$test/minecraft_path.ts";
import { getMcPath } from "$config/config.ts";
import { ensureBasePath } from "./base_path.ts";

Deno.test("ensureBasePath", async () => {
  await inTempMcPath(async () => {
    await ensureBasePath();
    assertDirectory(getMcPath());
    const eulaFile = join(getMcPath(), "common", "eula.txt");
    assertFile(eulaFile);
    const eula = await Deno.readTextFile(eulaFile);
    assertEquals(eula, "eula=true");
    await Deno.writeTextFile(eulaFile, "eula=false");
    await ensureBasePath();
    const overwrittenEula = await Deno.readTextFile(eulaFile);
    assertEquals(overwrittenEula, "eula=false");
  });
});
