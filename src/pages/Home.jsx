import React from "react";
import { useUserMode } from "../hooks/useUserMode";

function Home() {
  const { mode } = useUserMode();
  const isDemo = mode === "demo";

  return (
    <div className="page">
      <h2>🎧 Welcome to TuneRank</h2>

      <p>
        You are currently in <strong>{isDemo ? "Demo Mode" : "Your Mode"}</strong>.
        This app supports isolated user contexts via URL-based routing.
        Feel free to add, edit, delete, and customize your collection here.
      </p>

      <section style={{ marginTop: "2rem" }}>
        <h3>🚀 Capabilities</h3>
        <ul>
          <li>📊 View albums and songs in sortable, filterable, responsive tables</li>
          <li>🖊️ Edit any field (title, rating, year, song type, etc.) directly from the table</li>
          <li>➕ Add new albums and songs, or delete them instantly</li>
          <li>🎨 Ratings are color-coded to visually represent quality</li>
          <li>📈 Rating distribution graphs</li>
          <li>🧮 Album average rating calculated using a weighted formula</li>
          <li>📈 Advanced normalization blending logistic and linear scaling</li>
          <li>⚙️ Real-time parameter tuning in Settings (user-specific) with detailed explainations</li>
          <li>🔍 Powerful filtering across multiple fields</li>
          <li>📦 FastAPI + SQLAlchemy backend with user-scoped data</li>
          <li>📱 Fully responsive and mobile-friendly</li>
          <li>🧍 Separate user contexts for different users</li>
          <li>⚙️ Default scoring profiles</li>
          <li>🎶 Genre tagging</li>
        </ul>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h3>🛠️ Roadmap</h3>
        <ul>
          <li>🔐 Replace URL-based identity with real authentication</li>
          <li>📷 Album cover image support</li>
          <li>🎶 Filtering by genre and release decade</li>
          <li>📊 Rating graphs for filtered subsets</li>
          <li>📈 Advanced statistical analysis tools</li>
          <li>🌐 Spotify import integration</li>
          <li>🧮 Custom list creation</li>
          <li>💾 Import/export/share features</li>
          <li>🔥 Deluxe album support</li>
        </ul>
      </section>
    </div>
  );
}

export default Home;
