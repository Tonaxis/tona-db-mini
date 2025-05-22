/**
 * Defines the user-configurable options for MiniDB.
 */
export interface Config {
  /** Directory where collections will be stored */
  baseDir?: string;

  /** Whether to prettify the JSON output */
  prettyJson?: boolean;
}

/**
 * Default configuration used when the user does not provide one.
 */
export const defaultConfig: Required<Config> = {
  baseDir: "./tdb-mini-data",
  prettyJson: false,
};
