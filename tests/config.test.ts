import fs from "fs";
import { afterEach, describe, expect, it } from "vitest";
import { loadConfig } from "../src/config/loader";
import { defaultConfig } from "../src/config/schema";
import { MiniDB } from "../src/core/minidb";

const CONFIG_FILE = "tdb-mini.config.json";

afterEach(() => {
  if (fs.existsSync(CONFIG_FILE)) {
    fs.unlinkSync(CONFIG_FILE);
  }
});

describe("Config loading", () => {
  it("uses default config if no file is present", () => {
    expect(loadConfig()).toEqual(defaultConfig);
  });

  it("loads config from file", () => {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify({ baseDir: "custom-dir" }));
    const config = loadConfig();
    expect(config.baseDir).toBe("custom-dir");
  });

  it("merges partial config with defaults", () => {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify({}));
    const config = loadConfig();
    expect(config).toEqual(defaultConfig);
  });

  it("throws if config is malformed", () => {
    fs.writeFileSync(CONFIG_FILE, "{not-json");
    expect(() => loadConfig()).toThrow();
  });

  it("writes indented JSON when prettyJson is true", () => {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify({ prettyJson: true }));
    const config = loadConfig();
    expect(config.prettyJson).toBe(true);

    const db = new MiniDB();
    const col = db.collection<{ a: number }>("pretty");
    col.add({ a: 1 });

    const writtenData = fs.readFileSync(
      config.baseDir + "/pretty.json",
      "utf-8"
    );

    expect(writtenData).toBe(JSON.stringify([{ a: 1 }], null, 2));
  });

  it("writes compact JSON when prettyJson is false", () => {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify({ prettyJson: false }));
    const config = loadConfig();
    expect(config.prettyJson).toBe(false);

    const db = new MiniDB();
    const col = db.collection<{ a: number }>("unpretty");
    col.add({ a: 1 });

    const writtenData = fs.readFileSync(
      config.baseDir + "/unpretty.json",
      "utf-8"
    );

    expect(writtenData).toBe(JSON.stringify([{ a: 1 }]));
  });
});
