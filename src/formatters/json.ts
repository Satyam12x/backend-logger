import { LogEntry } from '../types';
import { safeStringify } from '../utils/sanitize';

// Structured JSON — one entry per line.
// Uses safeStringify to handle circular refs, bigints, and oversized values
// without ever throwing (a logger must never crash the server).

export function jsonFormat(entry: LogEntry, maxFieldSize: number = 2048): string {
  // Pre-serialize large fields so they can be size-capped individually,
  // then merge back into a single JSON line.
  const safeEntry: Record<string, unknown> = { ...entry };

  if (safeEntry.body !== undefined) {
    safeEntry.body = parseIfJson(safeStringify(safeEntry.body, maxFieldSize));
  }
  if (safeEntry.headers !== undefined) {
    safeEntry.headers = parseIfJson(safeStringify(safeEntry.headers, maxFieldSize));
  }

  return safeStringify(safeEntry, maxFieldSize * 4);
}

// Parse back into an object if the string is valid JSON; otherwise
// return the string as-is (e.g., '[TRUNCATED]' fallbacks).
function parseIfJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
