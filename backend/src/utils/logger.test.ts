import { describe, it, expect, vi, beforeEach, afterEach, MockInstance } from 'vitest';
import { logger } from './logger';

describe('logger', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let stdoutSpy: MockInstance<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let stderrSpy: MockInstance<any>;

  beforeEach(() => {
    stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should output structured JSON with required fields for info level', () => {
    logger.info('auth.login', {
      userId: 'user-123',
      result: 'success',
      metadata: { ip: '192.168.1.1', userAgent: 'Mozilla/5.0' },
    });

    expect(stdoutSpy).toHaveBeenCalledTimes(1);
    const output = stdoutSpy.mock.calls[0][0] as string;
    const parsed = JSON.parse(output.trim());

    expect(parsed).toMatchObject({
      level: 'info',
      operation: 'auth.login',
      userId: 'user-123',
      result: 'success',
      metadata: { ip: '192.168.1.1', userAgent: 'Mozilla/5.0' },
    });
    expect(parsed.timestamp).toBeDefined();
    expect(new Date(parsed.timestamp).toISOString()).toBe(parsed.timestamp);
  });

  it('should output to stderr for error level', () => {
    logger.error('database.connection', {
      userId: 'admin@test.com',
      result: 'failure',
    });

    expect(stderrSpy).toHaveBeenCalledTimes(1);
    const output = stderrSpy.mock.calls[0][0] as string;
    const parsed = JSON.parse(output.trim());

    expect(parsed.level).toBe('error');
    expect(parsed.operation).toBe('database.connection');
    expect(parsed.userId).toBe('admin@test.com');
    expect(parsed.result).toBe('failure');
  });

  it('should output warn level to stdout', () => {
    logger.warn('auth.rateLimit', { userId: 'user-456' });

    expect(stdoutSpy).toHaveBeenCalledTimes(1);
    const output = stdoutSpy.mock.calls[0][0] as string;
    const parsed = JSON.parse(output.trim());

    expect(parsed.level).toBe('warn');
    expect(parsed.operation).toBe('auth.rateLimit');
  });

  it('should omit optional fields when not provided', () => {
    logger.info('server.startup');

    const output = stdoutSpy.mock.calls[0][0] as string;
    const parsed = JSON.parse(output.trim());

    expect(parsed.level).toBe('info');
    expect(parsed.operation).toBe('server.startup');
    expect(parsed).not.toHaveProperty('userId');
    expect(parsed).not.toHaveProperty('result');
    expect(parsed).not.toHaveProperty('metadata');
  });

  it('should include timestamp in ISO format', () => {
    const before = new Date();
    logger.info('test.timestamp');
    const after = new Date();

    const output = stdoutSpy.mock.calls[0][0] as string;
    const parsed = JSON.parse(output.trim());
    const logDate = new Date(parsed.timestamp);

    expect(logDate.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(logDate.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it('should not output debug logs when not in development', () => {
    const originalEnv = process.env.NODE_ENV;
    const originalLogLevel = process.env.LOG_LEVEL;
    process.env.NODE_ENV = 'production';
    delete process.env.LOG_LEVEL;

    logger.debug('test.debug');

    expect(stdoutSpy).not.toHaveBeenCalled();

    process.env.NODE_ENV = originalEnv;
    process.env.LOG_LEVEL = originalLogLevel;
  });

  it('should output debug logs in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    logger.debug('test.debug', { userId: 'dev-user' });

    expect(stdoutSpy).toHaveBeenCalledTimes(1);
    const output = stdoutSpy.mock.calls[0][0] as string;
    const parsed = JSON.parse(output.trim());

    expect(parsed.level).toBe('debug');
    expect(parsed.operation).toBe('test.debug');

    process.env.NODE_ENV = originalEnv;
  });
});
