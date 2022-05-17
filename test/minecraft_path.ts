import { join } from "$std/path/mod.ts";
import { setMcPath } from "$config/config.ts";

/**
 * Make temp MC directory for a test and delete it after running the supplied test.
 * @param test The test that needs a temp MC directory.
 */
export async function inTempMcPath(
  test: () => void | Promise<void>,
): Promise<void> {
  const tempPath = await Deno.makeTempDir();
  try {
    setMcPath(join(tempPath, "mc"));
    await test();
  } finally {
    await Deno.remove(tempPath, { recursive: true });
  }
}
