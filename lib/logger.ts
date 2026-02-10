export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  SECURITY = 'SECURITY',
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: string;
  message: string;
  metadata?: Record<string, any>;
}

export function log(
  level: LogLevel,
  category: string,
  message: string,
  metadata?: Record<string, any>
) {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    category,
    message,
    metadata,
  };

  // Format for console
  const prefix = `[${entry.timestamp}] [${level}] [${category}]`;
  const metadataStr = metadata ? ` ${JSON.stringify(metadata)}` : '';

  switch (level) {
    case LogLevel.ERROR:
    case LogLevel.SECURITY:
      console.error(`${prefix} ${message}${metadataStr}`);
      break;
    case LogLevel.WARN:
      console.warn(`${prefix} ${message}${metadataStr}`);
      break;
    default:
      console.log(`${prefix} ${message}${metadataStr}`);
  }

  // Future: Send to external logging service (Sentry, LogRocket, etc.)
}

// Convenience methods
export const logger = {
  info: (category: string, message: string, metadata?: Record<string, any>) =>
    log(LogLevel.INFO, category, message, metadata),

  warn: (category: string, message: string, metadata?: Record<string, any>) =>
    log(LogLevel.WARN, category, message, metadata),

  error: (category: string, message: string, metadata?: Record<string, any>) =>
    log(LogLevel.ERROR, category, message, metadata),

  security: (category: string, message: string, metadata?: Record<string, any>) =>
    log(LogLevel.SECURITY, category, message, metadata),
};
