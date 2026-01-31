import React from "react";

function Home() {
  return (
    <div style={{ padding: "2rem", lineHeight: "1.6" }}>
      <h2>🎧 Welcome to Album Ratings</h2>

      <section style={{ marginTop: "2rem" }}>
        <h3>🚀 Capabilities</h3>
        <ul>
          <li>📦 Full server-side CRUD for albums and songs</li>
          <li>📊 Sortable, filterable tables with inline editing</li>
          <li>✏️ Instant edits for title, rating, year, etc.</li>
          <li>🎨 Color-coded rating visuals for fast scanning</li>
          <li>🧠 REST API with backend filtering & sorting</li>
        </ul>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h3>🛠️ To Do</h3>
        <ul>
          <li>📊 Weighted average rating from song data</li>
          <li>🎵 Full album import via Spotify API</li>
          <li>🎨 Song-level rating visuals</li>
          <li>🖼️ Album cover image upload & preview</li>
          <li>🧮 Advanced statistics (distributions, trends)</li>
          <li>🧼 UI polish and layout refinement</li>
        </ul>
      </section>
    </div>
  );
}

export default Home;
