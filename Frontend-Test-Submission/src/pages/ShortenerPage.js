import React, { useState } from "react";
import UrlRow from "../components/UrlRow";
import UrlResults from "../components/UrlResults";
import { log } from "../utils/logger";

export default function ShortenerPage() {
  const [urls, setUrls] = useState([{ id: 1, longUrl: "", validity: "", shortcode: "" }]);
  const [results, setResults] = useState([]);

  const addRow = () => {
    if (urls.length < 5) {
      setUrls([...urls, { id: Date.now(), longUrl: "", validity: "", shortcode: "" }]);
    } else {
      alert("You can only shorten up to 5 URLs at once.");
    }
  };

  const updateRow = (id, field, value) => {
    setUrls(urls.map(u => u.id === id ? { ...u, [field]: value } : u));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newResults = urls.map(u => {
      if (!u.longUrl.startsWith("http")) {
        log("frontend", "error", "ShortenerPage", "Invalid URL format");
        return { ...u, error: "Invalid URL" };
      }

      // Auto-generate shortcode if missing
      const shortcode = u.shortcode || Math.random().toString(36).substring(2, 7);
      const validity = u.validity ? parseInt(u.validity, 10) : 30;

      log("frontend", "info", "ShortenerPage", `Shortened ${u.longUrl} with code ${shortcode}`);

      return {
        ...u,
        shortUrl: `http://localhost:3000/${shortcode}`,
        expiry: new Date(Date.now() + validity * 60000).toLocaleString(),
        clicks: []
      };
    });

    setResults([...results, ...newResults]);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>URL Shortener</h2>
      <form onSubmit={handleSubmit}>
        {urls.map((u, index) => (
          <UrlRow key={u.id} url={u} updateRow={updateRow} />
        ))}
        <button type="button" onClick={addRow}>+ Add Another URL</button>
        <button type="submit">Shorten URLs</button>
      </form>

      <UrlResults results={results} />
    </div>
  );
}
