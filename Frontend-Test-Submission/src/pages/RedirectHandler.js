import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { log } from "../utils/logger";

export default function RedirectHandler() {
  const { code } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("shortUrls")) || [];
    const match = stored.find(r => r.shortUrl.endsWith(code));

    if (match) {
      log("frontend", "info", "RedirectHandler", `Redirecting ${code} to ${match.longUrl}`);
      window.location.href = match.longUrl;
    } else {
      log("frontend", "error", "RedirectHandler", `Shortcode ${code} not found`);
      navigate("/");
    }
  }, [code, navigate]);

  return <p>Redirecting...</p>;
}
