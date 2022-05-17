import { inTempMcPath } from "$test/minecraft_path.ts";
import { withFakeManifestServer } from "$test/manifest_server.ts";
import { assert, assertEquals } from "$std/testing/asserts.ts";
import { getServerUrl, versionExists } from "./manifest_cache.ts";

Deno.test("versionExists", async () => {
  await inTempMcPath(async () => {
    await withFakeManifestServer(async () => {
      assert(await versionExists("fake"));
      assert(!(await versionExists("doesnotexist")));
      assertEquals(
        await getServerUrl("fake"),
        "http://localhost:1024/server.jar",
      );
    });
    assert(await versionExists("fake"));
    assert(!(await versionExists("doesnotexist")));
  });
});
