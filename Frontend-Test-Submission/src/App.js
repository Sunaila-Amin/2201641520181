import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ShortenerPage from "./pages/ShortenerPage";
import StatisticsPage from "./pages/StatisticsPage";
import RedirectHandler from "./pages/RedirectHandler";

export default function App() {
  return (
    <Router>
      <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
        <Link to="/" style={{ marginRight: "15px" }}>Shortener</Link>
        <Link to="/stats">Statistics</Link>
      </nav>

      <Routes>
        <Route path="/" element={<ShortenerPage />} />
        <Route path="/stats" element={<StatisticsPage />} />
        <Route path="/:code" element={<RedirectHandler />} />
      </Routes>
    </Router>
  );
}
