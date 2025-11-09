/**
 * logger.ts - Centralized Logging System
 *
 * Provides environment-aware logging with proper levels.
 * - Development: All logs enabled
 * - Production: Only warn and error
 * - Can be extended for external logging services (Sentry, etc.)
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
  enabled: boolean;
  minLevel: LogLevel;
  includeTimestamp: boolean;
  includeContext: boolean;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private config: LoggerConfig;
  private context: string;

  constructor(context: string = 'App', config?: Partial<LoggerConfig>) {
    this.context = context;
    this.config = {
      enabled: true,
      minLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
      includeTimestamp: process.env.NODE_ENV === 'development',
      includeContext: true,
      ...config,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) return false;
    return LOG_LEVELS[level] >= LOG_LEVELS[this.config.minLevel];
  }

  private formatMessage(level: LogLevel, message: string, ...args: any[]): any[] {
    const parts: any[] = [];

    if (this.config.includeTimestamp) {
      const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
      parts.push(`[${timestamp}]`);
    }

    if (this.config.includeContext) {
      parts.push(`[${this.context}]`);
    }

    parts.push(message);

    if (args.length > 0) {
      parts.push(...args);
    }

    return parts;
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.log(...this.formatMessage('debug', message, ...args));
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.info(...this.formatMessage('info', message, ...args));
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(...this.formatMessage('warn', message, ...args));
    }
  }

  error(message: string, ...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error(...this.formatMessage('error', message, ...args));
    }
  }

  /**
   * Create a child logger with a specific context
   */
  child(context: string): Logger {
    return new Logger(`${this.context}:${context}`, this.config);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

// Default logger instance
export const logger = new Logger('Game');

// Context-specific loggers
export const engineLogger = new Logger('Engine');
export const storageLogger = new Logger('Storage');
export const actionLogger = new Logger('Actions');
export const uiLogger = new Logger('UI');

// Factory function for custom loggers
export function createLogger(context: string, config?: Partial<LoggerConfig>): Logger {
  return new Logger(context, config);
}

// Export Logger class for advanced usage
export { Logger };
export type { LoggerConfig, LogLevel };
