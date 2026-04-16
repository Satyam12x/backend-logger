// Writes directly to stdout for performance
// (console.log wraps in util.format which adds overhead)

export function consoleTransport(message: string): void {
  try {
    process.stdout.write(message + '\n');
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    process.stderr.write(`[request-logger] Console transport error: ${msg}\n`);
  }
}
