import { exists } from "$lib/exists.ts";
import { dirname, join } from "$std/path/mod.ts";
import { assert } from "$std/testing/asserts.ts";
const { chdir, cwd, remove } = Deno;
/**
 * Build the fake java server and return the path to the jar file.
 */
export async function buildFakeServer(): Promise<string> {
  const fakePath = dirname(new URL(import.meta.url).pathname);
  // The below path is excluded in .gitignore.
  const targetPath = join(fakePath, "out");
  await Deno.mkdir(targetPath, { recursive: true });
  const jarPath = join(targetPath, "server.jar");
  const sourcePath = join(fakePath, "src");
  const currentDirectory = cwd();
  const jarCreated = await getModifiedTime(jarPath);
  const sourceModified = await getModifiedTime(
    join(sourcePath, "Server.java"),
  );
  if (sourceModified > jarCreated) {
    chdir(sourcePath);
    await run([
      "javac",
      "Server.java",
      "-d",
      targetPath,
    ]);
    chdir(targetPath);
    await run([
      "jar",
      "--create",
      "--file",
      jarPath,
      "--manifest",
      join(sourcePath, "MANIFEST.MF"),
      "Server.class",
    ]);
    await remove(join(targetPath, "Server.class"));
    chdir(currentDirectory);
  }
  return jarPath;
}

async function run(cmd: string[]) {
  const process = Deno.run({
    cmd: cmd,
  });
  const status = await process.status();
  assert(status.success);
  process.close();
}

async function getModifiedTime(path: string) {
  if (await exists(path)) {
    const stat = await Deno.stat(path);
    return stat.mtime || new Date(0);
  } else {
    return new Date(0);
  }
}
