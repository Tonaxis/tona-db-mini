export function normalizeToArray<T>(data: T | T[]): T[] {
  if (Array.isArray(data)) {
    return data.length > 0 && Array.isArray(data[0])
      ? (data as T[])
      : [data as T];
  } else {
    return [data];
  }
}
