import React from "react";

export default function UrlRow({ url, updateRow }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <input
        type="text"
        placeholder="Enter long URL"
        value={url.longUrl}
        onChange={e => updateRow(url.id, "longUrl", e.target.value)}
      />
      <input
        type="number"
        placeholder="Validity (minutes)"
        value={url.validity}
        onChange={e => updateRow(url.id, "validity", e.target.value)}
      />
      <input
        type="text"
        placeholder="Custom shortcode (optional)"
        value={url.shortcode}
        onChange={e => updateRow(url.id, "shortcode", e.target.value)}
      />
    </div>
  );
}
