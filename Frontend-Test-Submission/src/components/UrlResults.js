import React from "react";
import { Link } from "react-router-dom";

export default function UrlResults({ results }) {
  if (!results.length) return null;

  return (
    <div>
      <h3>Results</h3>
      <ul>
        {results.map((r, i) => (
          <li key={i}>
            Original: {r.longUrl} <br />
            Short: <Link to={`/${r.shortUrl.split("/").pop()}`}>{r.shortUrl}</Link> <br />
            Expires: {r.expiry} <br />
            {r.error && <span style={{ color: "red" }}>{r.error}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
