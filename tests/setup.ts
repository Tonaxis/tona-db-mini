// setup.ts
import { promises as fs } from "fs";
import path from "path";
import { afterAll, beforeEach } from "vitest";
import { loadConfig } from "../src/config/loader";

const config = loadConfig();

beforeEach(async () => {
  const dir = path.resolve(process.cwd(), config.baseDir);
  try {
    await fs.rm(dir, { recursive: true, force: true });
  } catch {
    // ignore errors if dir doesn't exist
  }
  await fs.mkdir(dir, { recursive: true });
});

afterAll(async () => {
  const dir = path.resolve(process.cwd(), config.baseDir);
  try {
    await fs.rm(dir, { recursive: true, force: true });
  } catch {
    // ignore errors
  }
});
