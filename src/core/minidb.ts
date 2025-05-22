import { loadConfig } from "../config/loader";
import { Collection } from "./collection";
import { NonArrayObject } from "./types";

/**
 * Main entry point to access collections.
 * Automatically loads user configuration and handles base directory setup.
 */
export class MiniDB {
  private baseDir: string;

  constructor() {
    const config = loadConfig();
    this.baseDir = config.baseDir;
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
