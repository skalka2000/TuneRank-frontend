import React, { useMemo } from "react";
import "../../styles/LoadingOverlay.css";

const LYRICS = [
  "Ground control to Major Tom...",
  "Commencing countdown, engines on...",
  "Check ignition and may God's love be with you.",
];

function LoadingOverlay({ message = "Loading..." }) {
  const lyric = useMemo(() => {
    const index = Math.floor(Math.random() * LYRICS.length);
    return LYRICS[index];
  }, []);

  return (
    <div className="loading-music">
      <div className="note note1">🎵</div>
      <div className="note note2">🎶</div>
      <div className="note note3">🎵</div>
      <p style={{ marginTop: "1rem", fontStyle: "italic", maxWidth: "400px", textAlign: "center" }}>
        “{lyric}”
      </p>
      <p style={{ marginTop: "0.5rem" }}>{message}</p>
    </div>
  );
}

export default LoadingOverlay;
