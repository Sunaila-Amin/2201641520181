import React, { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { logInfo, logWarn, logError, logSuccess } from '../services/logService';

const UrlContext = createContext();
const STORAGE_KEY = 'url_shortener_data_v1';

function generateRandomShortcode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export function UrlProvider({ children }) {
  const [urls, setUrls] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
    } catch {}
  }, [urls]);

  const exists = (code) => urls.some((u) => u.shortcode === code);

  function createShortUrl(longUrl, minutes, preferred) {
    const validityMin = Number.isInteger(minutes) && minutes > 0 ? minutes : 30;
    const createdAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + validityMin * 60_000).toISOString();

    if (preferred) {
      const re = /^[A-Za-z0-9_-]{3,20}$/;
      if (!re.test(preferred)) {
        logError('frontend', 'UrlProvider', `Invalid shortcode format: ${preferred}`, { longUrl });
        return { success: false, error: 'Invalid shortcode format (3-20 alphanumeric/_/-)' };
      }
      if (exists(preferred)) {
        logWarn('frontend', 'UrlProvider', `Shortcode collision: ${preferred}`, { longUrl });
        return { success: false, error: 'Shortcode already taken' };
      }
      const short = { shortcode: preferred, longUrl, createdAt, expiresAt, clicks: [] };
      setUrls((s) => [short, ...s]);
      logSuccess('frontend', 'UrlProvider', `Created short URL ${preferred}`, { longUrl, expiresAt });
      return { success: true, data: short };
    }

    let tries = 0;
    let code = generateRandomShortcode();
    while (exists(code) && tries < 5) {
      code = generateRandomShortcode();
      tries++;
    }
    if (exists(code)) code = `${code}-${uuidv4().slice(0, 4)}`;

    const short = { shortcode: code, longUrl, createdAt, expiresAt, clicks: [] };
    setUrls((s) => [short, ...s]);
    logInfo('frontend', 'UrlProvider', `Created short URL ${code}`, { longUrl, expiresAt });
    return { success: true, data: short };
  }

  const findByShortcode = (code) => urls.find((u) => u.shortcode === code);

  const recordClick = (shortcode, source) => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown';
    const e = { timestamp: new Date().toISOString(), source, geo: tz };
    setUrls((current) =>
      current.map((u) => (u.shortcode === shortcode ? { ...u, clicks: [...u.clicks, e] } : u))
    );
    logInfo('frontend', 'UrlProvider', `Recorded click for ${shortcode}`, { source, geo: tz });
  };

  return <UrlContext.Provider value={{ urls, createShortUrl, findByShortcode, recordClick }}>{children}</UrlContext.Provider>;
}

export function useUrlContext() {
  const ctx = useContext(UrlContext);
  if (!ctx) throw new Error('useUrlContext must be used inside UrlProvider');
  return ctx;
}
