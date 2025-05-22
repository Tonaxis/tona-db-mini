import * as fs from "fs";
import * as path from "path";
import type { Config } from "./schema";
import { defaultConfig } from "./schema";

const CONFIG_FILE = "tdb-mini.config.json";

/**
 * Loads the user's configuration file and merges it with the default configuration.
 * If the file does not exist, the default configuration is used.
 *
 * @returns {Required<Config>} The complete configuration with defaults applied.
 */
export function loadConfig(): Required<Config> {
  const configPath = path.resolve(process.cwd(), CONFIG_FILE);
  let userConfig: Config = {};

  if (fs.existsSync(configPath)) {
    try {
      const raw = fs.readFileSync(configPath, "utf-8");
      userConfig = JSON.parse(raw) as Config;
    } catch (e) {
      throw new Error(
        `Failed to parse ${CONFIG_FILE}: ${(e as Error).message}`
      );
    }
  }

  return {
    ...defaultConfig,
    ...userConfig,
  };
}
