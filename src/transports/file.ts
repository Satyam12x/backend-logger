import fs from 'fs';
import path from 'path';

// One write stream per file path, reused across requests.
const streams = new Map<string, fs.WriteStream>();

function getStream(filePath: string): fs.WriteStream {
  const existing = streams.get(filePath);
  if (existing && !existing.destroyed) return existing;

  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const stream = fs.createWriteStream(filePath, { flags: 'a', encoding: 'utf-8' });

  stream.on('error', (err) => {
    process.stderr.write(`[request-logger] File transport error: ${err.message}\n`);
    streams.delete(filePath);
  });

  streams.set(filePath, stream);
  return stream;
}

export function fileTransport(message: string, filePath: string): void {
  try {
    const stream = getStream(filePath);
    stream.write(message + '\n');
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    process.stderr.write(`[request-logger] File transport error: ${msg}\n`);
  }
}

// Public API: user can call this to flush all streams on graceful shutdown.
// We intentionally do NOT call process.exit() or own signal handlers —
// a library must never hijack the host process's lifecycle.
export function closeFileTransports(): Promise<void> {
  const pending: Promise<void>[] = [];
  for (const stream of streams.values()) {
    pending.push(
      new Promise<void>((resolve) => {
        stream.end(() => resolve());
      })
    );
  }
  streams.clear();
  return Promise.all(pending).then(() => undefined);
}

// Passive best-effort flush on normal process exit.
// 'beforeExit' only fires when the event loop is idle and no user
// code has called process.exit(), so this is safe — it never races
// with user-defined SIGINT/SIGTERM handlers.
process.once('beforeExit', () => {
  for (const stream of streams.values()) {
    stream.end();
  }
  streams.clear();
});
