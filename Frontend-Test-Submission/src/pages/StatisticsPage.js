import React, { useEffect, useState } from "react";

export default function StatisticsPage() {
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("shortUrls")) || [];
    setUrls(stored);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Statistics</h2>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Short URL</th>
            <th>Original URL</th>
            <th>Created</th>
            <th>Expiry</th>
            <th>Clicks</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((u, i) => (
            <tr key={i}>
              <td>{u.shortUrl}</td>
              <td>{u.longUrl}</td>
              <td>{u.created || "N/A"}</td>
              <td>{u.expiry}</td>
              <td>{u.clicks?.length || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
