import fs from "fs";
import os from "os";
import path from "path";

export function createIsolatedDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "minidb-test-"));
}

export function removeDir(dirPath: string) {
  fs.rmSync(dirPath, { recursive: true, force: true });
}
