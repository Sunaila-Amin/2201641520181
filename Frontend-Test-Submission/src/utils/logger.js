// src/utils/logger.js

export function log(stack, level, pkg, message) {
  const payload = { stack, level, package: pkg, message, timestamp: new Date().toISOString() };

  // Send to your logging middleware server (replace URL if needed)
  fetch("http://localhost:4000/log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(err => {
    console.error("Failed to send log:", err);
  });
}
