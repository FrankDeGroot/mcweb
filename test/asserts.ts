import { assert, AssertionError } from "$std/testing/asserts.ts";

export async function assertDirectory(path: string) {
  const stat = await assertExists(path);
  assert(stat.isDirectory, `'${path} is not a directory`);
}

export async function assertFile(path: string) {
  const stat = await assertExists(path);
  assert(stat.isFile, `'${path} is not a file`);
}

export async function assertLink(path: string) {
  const stat = await assertExists(path);
  assert(stat.isSymlink, `${path} is not a symlink`);
}

async function assertExists(path: string) {
  try {
    return await Deno.lstat(path);
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) {
      throw new AssertionError(`Directory/File/Link '${path}' does not exist.`);
    } else throw e;
  }
}
