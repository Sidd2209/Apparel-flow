export function typedAll<T>(stmt: any): T[] {
  return stmt.all() as T[];
} 