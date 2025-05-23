import fs from "fs";
import { loadConfig } from "../config/loader";
import { mergeDefaultConfig } from "../config/merger";
import { Config } from "../config/schema";
import { Collection } from "./collection";
import { NonArrayObject } from "./types";

/**
 * Main entry point to access collections.
 * Automatically loads user configuration and handles base directory setup.
 */
export class MiniDB {
  private config: NonNullable<Required<Config>>;

  /**
   * Main entry point to access collections.
   * Automatically loads user configuration and handles base directory setup.
   * @param config Configuration options
   */
  constructor(config: Partial<Config> = {}) {
    this.config = mergeDefaultConfig({ ...loadConfig(), ...config });

    if (!this.config.baseDir) {
      throw new Error("Invalid configuration provided.");
    }

    if (!fs.existsSync(this.config.baseDir)) {
      fs.mkdirSync(this.config.baseDir, { recursive: true });
    }
  }

  /**
   * Returns a typed collection by name.
   * @param name Name of the collection
   * @returns {Collection<T>} The collection
   */
  collection<T extends NonArrayObject>(name: string): Collection<T> {
    return new Collection<T>(name, this.config);
  }
}
