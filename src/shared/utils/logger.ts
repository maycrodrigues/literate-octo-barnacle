type LogLevel = 'info' | 'warn' | 'error';
type LogMeta = Record<string, unknown> | undefined;

const writeLog = (level: LogLevel, payload: Record<string, unknown>) => {
  const line = JSON.stringify(payload);
  if (level === 'error') {
    console.error(line);
    return;
  }
  if (level === 'warn') {
    console.warn(line);
    return;
  }
  console.log(line);
};

const nowIso = () => new Date().toISOString();

const basePayload = (level: LogLevel, message: string, meta: LogMeta) => {
  const payload: Record<string, unknown> = { level, timestamp: nowIso(), message };
  if (meta) Object.assign(payload, meta);
  return payload;
};

const contextPayload = (context: string, message: string, meta: LogMeta) => {
  const payload: Record<string, unknown> = { level: 'info', context, timestamp: nowIso(), message };
  if (meta) Object.assign(payload, meta);
  return payload;
};

export const logger = {
  info: (message: string, meta?: LogMeta) => writeLog('info', basePayload('info', message, meta)),
  error: (message: string, meta?: LogMeta) => writeLog('error', basePayload('error', message, meta)),
  warn: (message: string, meta?: LogMeta) => writeLog('warn', basePayload('warn', message, meta)),
  demand: (message: string, meta?: LogMeta) => writeLog('info', contextPayload('DEMAND', message, meta)),
  contact: (message: string, meta?: LogMeta) => writeLog('info', contextPayload('CONTACT', message, meta)),
  member: (message: string, meta?: LogMeta) => writeLog('info', contextPayload('MEMBERS', message, meta)),
  settings: (message: string, meta?: LogMeta) => writeLog('info', contextPayload('SETTINGS', message, meta))
};
