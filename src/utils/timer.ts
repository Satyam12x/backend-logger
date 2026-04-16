// process.hrtime.bigint() gives nanosecond precision
// Way more accurate than Date.now() which only gives milliseconds

export function startTimer(): bigint {
  return process.hrtime.bigint();
}

export function getDuration(start: bigint): number {
  const end = process.hrtime.bigint();
  const durationNs = end - start;

  // Convert nanoseconds to milliseconds
  // 1 millisecond = 1,000,000 nanoseconds
  return Number(durationNs) / 1_000_000;
}
