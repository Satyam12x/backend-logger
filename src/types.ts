import { Request, Response } from 'express';

export type LogField =
  | 'method'
  | 'url'
  | 'status'
  | 'duration'
  | 'timestamp'
  | 'route'
  | 'handler'
  | 'baseUrl'
  | 'requestId'
  | 'ip'
  | 'userAgent'
  | 'headers'
  | 'body'
  | 'query'
  | 'params'
  | 'contentLength'
  | 'referer'
  | 'protocol'
  | 'hostname';

export const DEFAULT_FIELDS: LogField[] = [
  'method',
  'url',
  'status',
  'duration',
  'timestamp',
];

export type LogEntry = Partial<{
  method: string;
  url: string;
  status: number;
  duration: number;
  timestamp: string;
  route: string;
  handler: string;
  baseUrl: string;
  requestId: string;
  ip: string;
  userAgent: string;
  headers: Record<string, unknown>;
  body: unknown;
  query: Record<string, unknown>;
  params: Record<string, string | string[]>;
  contentLength: string;
  referer: string;
  protocol: string;
  hostname: string;
}>;

export type LogFormat = 'default' | 'json';
export type LogTransport = 'console' | 'file';

export interface LoggerOptions {
  /** Which fields to log. Default: ['method', 'url', 'status', 'duration', 'timestamp']. */
  fields?: LogField[];
  /** Output format. Default: 'default'. */
  format?: LogFormat;
  /** Destinations for log output. Default: ['console']. */
  transports?: LogTransport[];
  /** File path when using 'file' transport. Default: 'logs/app.log'. */
  filePath?: string;
  /** Return `true` to skip logging for a request. */
  skip?: (req: Request, res: Response) => boolean;
  /** Enable ANSI colors. Default: auto-detect from TTY. */
  colors?: boolean;
  /**
   * Header name for request ID correlation. Default: 'x-request-id'.
   * Set to `false` to disable request ID generation entirely.
   */
  requestIdHeader?: string | false;
  /** Custom request ID generator. Default: `crypto.randomUUID()`. */
  generateRequestId?: () => string;
  /**
   * Keys to redact from headers and body (case-insensitive).
   * Defaults include `authorization`, `cookie`, `password`, `token`, `x-api-key`, etc.
   * Pass an explicit array to override.
   */
  redact?: string[];
  /**
   * Max serialized size (bytes) for the `body` and `headers` fields.
   * Prevents DoS from oversized payloads bloating logs. Default: 2048.
   */
  maxFieldSize?: number;
}

// Module augmentation: adds `req.id` typing for consumers.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      /** Unique request identifier set by request-logger when enabled. */
      id?: string;
    }
  }
}
