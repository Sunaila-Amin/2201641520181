// Logging-Middleware/index.js
const QUEUE_KEY = 'logging_middleware_failed_queue';

function getLogServerUrl() {
  if (typeof window !== 'undefined' && window.__LOG_SERVER_URL__) return window.__LOG_SERVER_URL__;
  // default for local testing
  return 'http://localhost:4000/logs';
}

async function sendPayload(payload) {
  try {
    const res = await fetch(getLogServerUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch {
    return false;
  }
}

function enqueueFailed(payload) {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    arr.push(payload);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(arr));
  } catch {}
}

async function flushQueue() {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    if (!raw) return;
    const queue = JSON.parse(raw);
    const remaining = [];
    for (const p of queue) {
      const ok = await sendPayload(p);
      if (!ok) remaining.push(p);
    }
    if (remaining.length) localStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
    else localStorage.removeItem(QUEUE_KEY);
  } catch {}
}

/**
 * Public API:
 * Log(stack, level, pkg, message, meta?)
 */
export async function Log(stack, level, pkg, message, meta) {
  const payload = {
    stack,
    level,
    package: pkg,
    message,
    timestamp: new Date().toISOString(),
    meta: meta || {}
  };

  // attempt to flush previous queue (best-effort)
  flushQueue().catch(() => {});

  const sent = await sendPayload(payload);
  if (!sent) enqueueFailed(payload);
}
