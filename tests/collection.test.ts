import { afterEach, describe, expect, it } from "vitest";
import { MiniDB } from "../src/core/minidb";
import { createIsolatedDir, removeDir } from "./test-utils";

let tempDir: string;

afterEach(() => {
  if (tempDir) removeDir(tempDir);
});

describe("Collection", () => {
  it("adds a single object", () => {
    tempDir = createIsolatedDir();
    const db = new MiniDB({ baseDir: tempDir });
    const col = db.collection<{ name: string }>("addSingle");
    col.add({ name: "Alice" });
    expect(col.get()).toEqual([{ name: "Alice" }]);
  });

  it("adds multiple objects", () => {
    tempDir = createIsolatedDir();
    const db = new MiniDB({ baseDir: tempDir });
    const col = db.collection<{ name: string }>("addMultiple");
    col.add([{ name: "Bob" }, { name: "Charlie" }]);
    expect(col.get()).toHaveLength(2);
  });

  it("adds an empty object", () => {
    tempDir = createIsolatedDir();
    const db = new MiniDB({ baseDir: tempDir });
    const col = db.collection<object>("empties");
    col.del();
    col.add({});
    expect(col.get()).toEqual([{}]);
  });

  it("adds multiple empty objects", () => {
    tempDir = createIsolatedDir();
    const db = new MiniDB({ baseDir: tempDir });
    const col = db.collection<object>("empties2");
    col.del();
    col.add([{}, {}]);
    expect(col.get()).toHaveLength(2);
  });

  it("rejects circular references", () => {
    const a: any = {};
    a.self = a;
    tempDir = createIsolatedDir();
    const db = new MiniDB({ baseDir: tempDir });
    const col = db.collection<any>("bad");
    col.del();

    expect(() => col.add(a)).toThrow();
  });

  it("returns all when no filter", () => {
    tempDir = createIsolatedDir();
    const db = new MiniDB({ baseDir: tempDir });
    const col = db.collection<{ name: string }>("all");
    col.del();
    col.add([{ name: "A" }, { name: "B" }]);
    expect(col.get()).toHaveLength(2);
  });

  it("returns matching items with filter (object filter)", () => {
    tempDir = createIsolatedDir();
    const db = new MiniDB({ baseDir: tempDir });
    const col = db.collection<{ type: string }>("filter");
    col.del();
    col.add([{ type: "a" }, { type: "b" }]);
    expect(col.get({ type: "a" })).toEqual([{ type: "a" }]);
  });

  it("returns matching items with filter (function filter)", () => {
    tempDir = createIsolatedDir();
    const db = new MiniDB({ baseDir: tempDir });
    const col = db.collection<{ type: string }>("filterFunc");
    col.del();
    col.add([{ type: "a" }, { type: "b" }]);
    const filtered = col.get((item) => item.type === "b");
    expect(filtered).toEqual([{ type: "b" }]);
  });

  it("returns empty array for unmatched filter", () => {
    tempDir = createIsolatedDir();
    const db = new MiniDB({ baseDir: tempDir });
    const col = db.collection<{ age: number }>("no-match");
    col.del();
    col.add([{ age: 30 }]);
    expect(col.get({ age: 99 })).toEqual([]);
  });

  it("deletes matching item (object filter)", () => {
    tempDir = createIsolatedDir();
    const db = new MiniDB({ baseDir: tempDir });
    const col = db.collection<{ id: number }>("del1");
    col.del();
    col.add([{ id: 1 }, { id: 2 }]);
    col.del({ id: 1 });
    expect(col.get()).toEqual([{ id: 2 }]);
  });

  it("deletes matching item (function filter)", () => {
    tempDir = createIsolatedDir();
    const db = new MiniDB({ baseDir: tempDir });
    const col = db.collection<{ id: number }>("delFunc");
    col.del();
    col.add([{ id: 1 }, { id: 2 }]);
    col.del((item) => item.id === 2);
    expect(col.get()).toEqual([{ id: 1 }]);
  });

  it("delete with non-matching filter does nothing", () => {
    tempDir = createIsolatedDir();
    const db = new MiniDB({ baseDir: tempDir });
    const col = db.collection<{ id: number }>("del2");
    col.del();
    col.add([{ id: 1 }]);
    col.del({ id: 99 });
    expect(col.get()).toEqual([{ id: 1 }]);
  });

  it("delete without filter deletes all", () => {
    tempDir = createIsolatedDir();
    const db = new MiniDB({ baseDir: tempDir });
    const col = db.collection<{ val: string }>("del-all");
    col.del();
    col.add([{ val: "a" }, { val: "b" }]);
    col.del();
    expect(col.get()).toEqual([]);
  });

  it("updates matching items with object filter", () => {
    tempDir = createIsolatedDir();
    const db = new MiniDB({ baseDir: tempDir });
    const col = db.collection<{ id: number; val: string }>("update1");
    col.del();
    col.add([
      { id: 1, val: "a" },
      { id: 2, val: "b" },
    ]);
    col.update({ id: 1 }, { val: "updated" });
    expect(col.get({ id: 1 })).toEqual([{ id: 1, val: "updated" }]);
  });

  it("updates matching items with function filter", () => {
    tempDir = createIsolatedDir();
    const db = new MiniDB({ baseDir: tempDir });
    const col = db.collection<{ id: number; val: string }>("updateFunc");
    col.del();
    col.add([
      { id: 1, val: "a" },
      { id: 2, val: "b" },
    ]);
    col.update((item) => item.id === 2, { val: "updated" });
    expect(col.get({ id: 2 })).toEqual([{ id: 2, val: "updated" }]);
  });

  it("supports deeply nested objects", () => {
    tempDir = createIsolatedDir();
    const db = new MiniDB({ baseDir: tempDir });
    const col = db.collection<any>("nested");
    col.del();
    col.add({ user: { profile: { name: "Bob" } } });
    expect(col.get()).toHaveLength(1);
    expect(col.get()[0]).toHaveProperty("user.profile.name", "Bob");
  });
});
