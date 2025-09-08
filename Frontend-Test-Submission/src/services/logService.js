// wrapper so the rest of app uses simple functions
import { Log } from 'logging-middleware';

export const logInfo = (stack, pkg, message, meta) => Log(stack, 'info', pkg, message, meta);
export const logError = (stack, pkg, message, meta) => Log(stack, 'error', pkg, message, meta);
export const logWarn = (stack, pkg, message, meta) => Log(stack, 'warn', pkg, message, meta);
export const logSuccess = (stack, pkg, message, meta) => Log(stack, 'success', pkg, message, meta);
