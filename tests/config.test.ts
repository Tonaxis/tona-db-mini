import fs from "fs";
import path from "path";
import { afterEach, describe, expect, it } from "vitest";
import { loadConfig } from "../src/config/loader";
import { defaultConfig } from "../src/config/schema";
import { MiniDB } from "../src/core/minidb";
import { createIsolatedDir, removeDir } from "./test-utils";

const CONFIG_FILE = "tdb-mini.config.json";
let tempDir: string;

afterEach(() => {
  if (fs.existsSync(CONFIG_FILE)) fs.unlinkSync(CONFIG_FILE);
  if (tempDir) removeDir(tempDir);
});

describe("Config loading", () => {
  it("returns default config when no file is present", () => {
    const config = loadConfig();
    expect(config).toEqual(defaultConfig);
  });

  it("merges config file values over defaults", () => {
    tempDir = createIsolatedDir();
    fs.writeFileSync(
      CONFIG_FILE,
      JSON.stringify({ baseDir: tempDir, prettyJson: false })
    );
    const config = loadConfig();
    expect(config.baseDir).toBe(tempDir);
    expect(config.prettyJson).toBe(false);
  });

  it("writes indented JSON when prettyJson is true", () => {
    tempDir = createIsolatedDir();
    fs.writeFileSync(
      CONFIG_FILE,
      JSON.stringify({ baseDir: tempDir, prettyJson: true })
    );

    const db = new MiniDB();
    const col = db.collection<{ a: number }>("pretty");
    col.add({ a: 1 });

    const filePath = path.join(tempDir, "pretty.json");
    const written = fs.readFileSync(filePath, "utf-8");
    expect(written).toBe(JSON.stringify([{ a: 1 }], null, 2));
  });

  it("writes compact JSON when prettyJson is false", () => {
    tempDir = createIsolatedDir();
    fs.writeFileSync(
      CONFIG_FILE,
      JSON.stringify({ baseDir: tempDir, prettyJson: false })
    );

    const db = new MiniDB();
    const col = db.collection<{ b: number }>("compact");
    col.add({ b: 2 });

    const filePath = path.join(tempDir, "compact.json");
    const written = fs.readFileSync(filePath, "utf-8");
    expect(written).toBe(JSON.stringify([{ b: 2 }]));
  });

  it("merges config file values over defaults", () => {
    tempDir = createIsolatedDir();
    fs.writeFileSync(
      CONFIG_FILE,
      JSON.stringify({ baseDir: tempDir, prettyJson: false })
    );
    const config = loadConfig();
    expect(config.baseDir).toBe(tempDir);
    expect(config.prettyJson).toBe(false);
  });

  it("merges incomplete config values over defaults", () => {
    tempDir = createIsolatedDir();
    fs.writeFileSync(CONFIG_FILE, JSON.stringify({ baseDir: tempDir }));
    const config = loadConfig();
    expect(config.baseDir).toBe(tempDir);
    expect(config.prettyJson).toBe(defaultConfig.prettyJson);
  });
});
