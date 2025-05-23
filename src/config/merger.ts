import type { Config } from "./schema";
import { defaultConfig } from "./schema";

/**
 * Merges the user's configuration file with the default configuration.
 * If the file does not exist, the default configuration is used.
 * @param config The user's configuration
 * @returns {NonNullable<Required<Config>>} The complete configuration with defaults applied.
 */
export function mergeDefaultConfig(
  config: Partial<Config>
): NonNullable<Required<Config>> {
  return {
    baseDir: config.baseDir ?? defaultConfig.baseDir,
    prettyJson: config.prettyJson ?? defaultConfig.prettyJson,
  };
}
