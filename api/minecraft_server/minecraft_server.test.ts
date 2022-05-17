import { inTempMcPath } from "$test/minecraft_path.ts";
import { withFakeManifestServer } from "$test/manifest_server.ts";
import { ensureCurrentPath } from "./current_path.ts";
import MinecraftServer from "./minecraft_server.ts";

Deno.test("ensureVersionDirectory", async () => {
  await inTempMcPath(async () => {
    await withFakeManifestServer(async () => {
      await ensureCurrentPath("fake");
      const minecraftServer = new MinecraftServer();
      await minecraftServer.start();
      await minecraftServer.stop();
      // TODO assert
    });
  });
});
