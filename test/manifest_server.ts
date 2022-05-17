import { AssertionError } from "$std/testing/asserts.ts";
import { buildFakeServer } from "$fake/build.ts";
import { setManifestUrl } from "$config/config.ts";
import { port, withServer } from "./with_server.ts";

/**
 * Start a fake manifest server and stop it after running the test.
 */
export async function withFakeManifestServer(
  test: () => Promise<void>,
): Promise<void> {
  const jarPath = await buildFakeServer();
  const baseUrl = `http://localhost:${port}`;
  setManifestUrl(`${baseUrl}/version_manifest.json`);
  await withServer(test, async (request) => {
    const path = new URL(request.url).pathname;
    switch (path) {
      case "/version_manifest.json":
        return new Response(JSON.stringify({
          latest: { release: "fake" },
          versions: [
            {
              id: "fake",
              url: `${baseUrl}/fake.json`,
            },
          ],
        }));
      case "/fake.json":
        return new Response(JSON.stringify({
          downloads: {
            server: {
              url: `${baseUrl}/server.jar`,
            },
          },
        }));
      case "/server.jar":
        return new Response(
          (await Deno.open(jarPath)).readable,
        );
      default:
        throw new AssertionError(
          `Unexpected path '${path}' used when reading manifests`,
        );
    }
  });
}
