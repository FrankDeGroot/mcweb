import { assertDirectory, assertFile, assertLink } from "$test/asserts.ts";
import { inTempMcPath } from "$test/minecraft_path.ts";
import { withFakeManifestServer } from "$test/manifest_server.ts";
import { assertEquals } from "$std/testing/asserts.ts";
import { join } from "$std/path/mod.ts";
import { getMcPath } from "$config/config.ts";
import { ensureVersionPath } from "./version_path.ts";

const decoder = new TextDecoder();

Deno.test("ensureVersionDirectory", async () => {
  await inTempMcPath(async () => {
    await withFakeManifestServer(async () => {
      await ensureVersionPath("fake");
      await assertDirectory(getMcPath());
      const versionPath = join(getMcPath(), "fake");
      await assertDirectory(versionPath);
      const serverPath = join(versionPath, "server.jar");
      await assertFile(serverPath);
      const eulaPath = join(versionPath, "eula.txt");
      await assertLink(eulaPath);
      const eula = decoder.decode(await Deno.readFile(eulaPath));
      assertEquals(eula, "eula=true");
    });
  });
});
