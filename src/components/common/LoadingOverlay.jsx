import React, { useEffect, useState } from "react";

const LYRICS = [
  "Ground control to Major Tom...",
  "Commencing countdown, engines on...",
  "Check ignition and may God's love be with you.",
  "3, 2, 1...",
  "LIFT OFF... 🚀 "
];

function LoadingOverlay({ message = "Loading...", lyrics = LYRICS }) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [fadeKey, setFadeKey] = useState(0); // used to re-trigger animation

  useEffect(() => {
    if (!lyrics || lyrics.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentLineIndex((prev) => {
        if (prev < lyrics.length - 1) {
          setFadeKey(prev + 1);
          return prev + 1;
        }
        return prev;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [lyrics]);

  const line = lyrics?.[currentLineIndex] || "🎵 ...";

  return (
    <div className="loading-music">
      <div className="note note1">🎵</div>
      <div className="note note2">🎶</div>
      <div className="note note3">🎵</div>
      <p className="lyrics-line fade-in" key={fadeKey}>
        “{line}”
      </p>
      <p className="loading-message">{message}</p>
    </div>
  );
}

export default LoadingOverlay;
