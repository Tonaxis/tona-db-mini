import fs from "fs";
import { loadConfig } from "../config/loader";
import { Config } from "../config/schema";
import { Collection } from "./collection";
import { NonArrayObject } from "./types";

/**
 * Main entry point to access collections.
 * Automatically loads user configuration and handles base directory setup.
 */
export class MiniDB {
  private baseDir: string;

  /**
   * Main entry point to access collections.
   * Automatically loads user configuration and handles base directory setup.
   * @param config Configuration options
   */
  constructor(config?: Config) {
    const mergedConfig = { ...loadConfig(), ...config };
    this.baseDir = mergedConfig.baseDir;

    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  /**
   * Returns a typed collection by name.
   * @param name Name of the collection
   * @returns {Collection<T>} The collection
   */
  collection<T extends NonArrayObject>(name: string): Collection<T> {
    return new Collection<T>(name, this.baseDir);
  }
}
