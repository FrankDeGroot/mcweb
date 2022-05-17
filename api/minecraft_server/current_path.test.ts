import { assertLink } from "$test/asserts.ts";
import { inTempMcPath } from "$test/minecraft_path.ts";
import { withFakeManifestServer } from "$test/manifest_server.ts";
import { ensureCurrentPath, getCurrentPath } from "./current_path.ts";

Deno.test("ensureCurrentPath", async () => {
  await inTempMcPath(async () => {
    await withFakeManifestServer(async () => {
      await ensureCurrentPath("fake");
      await assertLink(getCurrentPath());
      await ensureCurrentPath("fake");
    });
  });
});
