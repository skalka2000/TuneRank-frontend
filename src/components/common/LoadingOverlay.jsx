import React, { useEffect, useState } from "react";
import "../../styles/LoadingOverlay.css";

const LYRICS = [
  "Ground control to Major Tom...",
  "Commencing countdown, engines on...",
  "Check ignition and may God's love be with you.",
  "LIFT OFF 🚀..."
];

function LoadingOverlay({ message = "Loading...", lyrics = LYRICS }) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  useEffect(() => {
    if (!lyrics || lyrics.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentLineIndex(prev => {
        if (prev < lyrics.length - 1) {
          return prev + 1;
        }
        return prev; // stay on last line
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [lyrics]);

  const line = lyrics?.[currentLineIndex] || "🎵 ...";

  return (
    <div className="loading-music">
      <div className="note note1">🎵</div>
      <div className="note note2">🎶</div>
      <div className="note note3">🎵</div>
      <p
        style={{
          marginTop: "1rem",
          fontStyle: "italic",
          maxWidth: "400px",
          textAlign: "center",
          transition: "opacity 0.5s",
        }}
      >
        “{line}”
      </p>
      <p style={{ marginTop: "0.5rem" }}>{message}</p>
    </div>
  );
}

export default LoadingOverlay;
