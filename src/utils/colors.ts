// ANSI escape codes — these are special characters
// that tell the terminal to change text color
//
// How it works:
//   \x1b[32m  = "start green"
//   \x1b[0m   = "reset to normal"
//   \x1b[32mHello\x1b[0m  = prints "Hello" in green

const COLORS = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  reset: '\x1b[0m',
} as const;

// Color the status code based on its range
// 2xx = success (green), 3xx = redirect (cyan), 4xx = client error (yellow), 5xx = server error (red)
export function colorStatus(status: number): string {
  const statusStr = status.toString();

  if (status >= 500) return `${COLORS.red}${statusStr}${COLORS.reset}`;
  if (status >= 400) return `${COLORS.yellow}${statusStr}${COLORS.reset}`;
  if (status >= 300) return `${COLORS.cyan}${statusStr}${COLORS.reset}`;
  if (status >= 200) return `${COLORS.green}${statusStr}${COLORS.reset}`;

  return statusStr;
}

// Color the HTTP method
export function colorMethod(method: string): string {
  return `${COLORS.cyan}${method.padEnd(7)}${COLORS.reset}`;
}

// Color the duration based on speed
export function colorDuration(ms: number): string {
  const text = `${ms.toFixed(2)}ms`;

  if (ms > 1000) return `${COLORS.red}${text}${COLORS.reset}`;
  if (ms > 500) return `${COLORS.yellow}${text}${COLORS.reset}`;

  return `${COLORS.green}${text}${COLORS.reset}`;
}

export { COLORS };
