import { spawn } from "bun"
import { mkdir, rm, stat } from "fs/promises"
import { dirname, join } from "path"

/**
 * Build the fake java server and return the path to the jar file.
 */
export async function buildFakeServer(): Promise<string> {
  const fakePath = dirname(new URL(import.meta.url).pathname)
  // The below path is excluded in .gitignore.
  const targetPath = join(fakePath, "out")
  await mkdir(targetPath, { recursive: true })
  const jarPath = join(targetPath, "server.jar")
  const sourcePath = join(fakePath, "src")
  const currentDirectory = process.cwd()
  const jarCreated = await getModifiedTime(jarPath)
  const sourceModified = await getModifiedTime(
    join(sourcePath, "Server.java"),
  )
  if (sourceModified > jarCreated) {
    process.chdir(sourcePath)
    await run([
      "javac",
      "Server.java",
      "-d",
      targetPath,
    ])
    process.chdir(targetPath)
    await run([
      "jar",
      "--create",
      "--file",
      jarPath,
      "--manifest",
      join(sourcePath, "MANIFEST.MF"),
      "Server.class",
    ])
    await rm(join(targetPath, "Server.class"))
    process.chdir(currentDirectory)
  }
  return jarPath
}

async function run(cmd: string[]) {
  const process = spawn(cmd)
  await process.exited
  if (process.exitCode !== 0) {
    throw new Error("Process failed with " + process.exitCode)
  }
}

async function getModifiedTime(path: string) {
  try {
    const s = await stat(path)
    return s.mtime || new Date(0)
  } catch {
    return new Date(0)
  }
}
