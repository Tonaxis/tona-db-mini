/**
 * A filter is a partial match of an object of type T.
 */
export type Filter<T extends object> =
  | {
      [K in keyof T]?: T[K];
    }
  | ((item: T) => boolean);

/**
 * An object that is not an array
 */
export type NonArrayObject = { [key: string]: any } & { length?: never };
