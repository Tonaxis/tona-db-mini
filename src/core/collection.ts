import fs from "fs";
import path from "path";
import { loadConfig } from "../config/loader";
import { Filter, NonArrayObject } from "./types";

/**
 * Represents a local collection backed by a JSON file.
 */
export class Collection<T extends NonArrayObject> {
  private filePath: string;
  private config = loadConfig();

  /**
   * @param collectionName Name of the collection (used as file name)
   * @param baseDir Directory where the JSON file will be stored
   */
  constructor(collectionName: string, baseDir: string) {
    const dir = path.resolve(baseDir);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    this.filePath = path.resolve(dir, `${collectionName}.json`);
    if (!fs.existsSync(this.filePath))
      fs.writeFileSync(this.filePath, "[]", "utf-8");
  }

  /**
   * Reads and parses the JSON data
   * @returns {T[]} The parsed data
   */
  private read(): T[] {
    if (!fs.existsSync(this.filePath)) {
      this.write([]);
    }

    const data = fs.readFileSync(this.filePath, "utf-8");
    return JSON.parse(data) as T[];
  }

  /**
   * Serializes and writes data to the file
   * @param data The data to write
   */
  private write(data: T[]) {
    fs.writeFileSync(
      this.filePath,
      JSON.stringify(data, null, this.config.prettyJson ? 2 : undefined),
      "utf-8"
    );
  }

  /**
   * Checks if an item matches the provided filter.
   * @param item The item to check
   * @param filter The filter to apply
   * @returns {boolean} Whether the item matches the filter
   */
  private matchesFilter(item: T, filter: Filter<T>): boolean {
    if (typeof filter === "function") return filter(item);
    return Object.entries(filter).every(
      ([key, val]) => item[key as keyof T] === val
    );
  }

  /**
   * Returns items matching the provided filter.
   * @param filter The filter to apply (object or predicate function)
   * @returns {T[]} The filtered items
   */
  get(filter: Filter<T> = {}): T[] {
    return this.read().filter((item) => this.matchesFilter(item, filter));
  }

  /**
   * Adds one or more items to the collection.
   * @param data A single item or array of items to add
   */
  add(data: T | T[]): void {
    const itemsToAdd = Array.isArray(data) ? data : [data];
    const current = this.read();
    this.write([...current, ...itemsToAdd.filter(Boolean)]);
  }

  /**
   * Deletes items matching the provided filter.
   * @param filter The filter to apply (object or predicate function)
   */
  del(filter: Filter<T> = {}): void {
    const items = this.read();
    const remaining = items.filter((item) => !this.matchesFilter(item, filter));
    this.write(remaining);
  }

  /**
   * Updates items matching the provided filter.
   * @param filter The filter to apply (object or predicate function)
   * @param data The partial data to update on each matching item
   */
  update(filter: Filter<T>, data: Partial<T>): void {
    const current = this.read();
    const updated = current.map((item) =>
      this.matchesFilter(item, filter) ? { ...item, ...data } : item
    );
    this.write(updated);
  }
}
