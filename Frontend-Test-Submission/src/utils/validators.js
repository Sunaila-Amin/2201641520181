export function isValidUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export function isPositiveIntegerString(val) {
  if (!val) return false;
  const n = Number(val);
  return Number.isInteger(n) && n > 0;
}
