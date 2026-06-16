export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  operation: string;
  userId?: string;
  result?: 'success' | 'failure';
  metadata?: Record<string, unknown>;
}

/**
 * Gera um log estruturado em JSON com informações padronizadas.
 *
 * Formato:
 * {
 *   "timestamp": "2025-01-15T14:30:00.000-03:00",
 *   "level": "info",
 *   "operation": "auth.login",
 *   "userId": "uuid-or-email",
 *   "result": "success|failure",
 *   "metadata": { "ip": "...", "userAgent": "..." }
 * }
 */
function formatLog(entry: LogEntry): string {
  return JSON.stringify(entry);
}

function createLogEntry(
  level: LogLevel,
  operation: string,
  options?: {
    userId?: string;
    result?: 'success' | 'failure';
    metadata?: Record<string, unknown>;
  }
): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    operation,
    ...(options?.userId && { userId: options.userId }),
    ...(options?.result && { result: options.result }),
    ...(options?.metadata && { metadata: options.metadata }),
  };
}

export const logger = {
  info(
    operation: string,
    options?: {
      userId?: string;
      result?: 'success' | 'failure';
      metadata?: Record<string, unknown>;
    }
  ): void {
    const entry = createLogEntry('info', operation, options);
    process.stdout.write(formatLog(entry) + '\n');
  },

  warn(
    operation: string,
    options?: {
      userId?: string;
      result?: 'success' | 'failure';
      metadata?: Record<string, unknown>;
    }
  ): void {
    const entry = createLogEntry('warn', operation, options);
    process.stdout.write(formatLog(entry) + '\n');
  },

  error(
    operation: string,
    options?: {
      userId?: string;
      result?: 'success' | 'failure';
      metadata?: Record<string, unknown>;
    }
  ): void {
    const entry = createLogEntry('error', operation, options);
    process.stderr.write(formatLog(entry) + '\n');
  },

  debug(
    operation: string,
    options?: {
      userId?: string;
      result?: 'success' | 'failure';
      metadata?: Record<string, unknown>;
    }
  ): void {
    if (process.env.NODE_ENV === 'development' || process.env.LOG_LEVEL === 'debug') {
      const entry = createLogEntry('debug', operation, options);
      process.stdout.write(formatLog(entry) + '\n');
    }
  },
};

export default logger;
