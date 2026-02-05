import React from "react";

function Home() {
  return (
    <div className="page">
      <h2>🎧 Welcome to TuneRank</h2>
      <p>
        Rate, customize and analyze albums and their songs with flexible controls and real-time updates.
      </p>

      <section style={{ marginTop: "2rem" }}>
        <h3>🚀 Capabilities</h3>
        <ul>
          <li>📊 View albums and songs in sortable, filterable, responsive tables</li>
          <li>🖊️ Edit any field (title, rating, year, interlude flag, etc.) directly from the table</li>
          <li>➕ Add new albums and songs, or delete them instantly</li>
          <li>🎨 Ratings are color-coded to visually represent quality</li>
          <li>📈 Rating distribution graphs</li>
          <li>🧮 Album average rating is calculated using a weighted formula</li>
          <li>📈 Advanced normalization blending logistic and linear scaling for nuanced score adjustment</li>
          <li>⚙️ Fine-tuned parameters with real-time visual feedback in the Settings panel</li>
          <li>🔍 Filter songs by artist, album, rating, interlude status, and more</li>
          <li>📦 Backed by a FastAPI + SQLAlchemy RESTful backend</li>
          <li>🖥️ The backend server is fully hosted and running</li>
          <li>🌐 The app is live and accessible <a href="https://tunerank-frontend.onrender.com/" target="_blank" rel="noopener noreferrer">here</a></li>
          <li>📱 Fully responsive and supports mobile usage</li>
        </ul>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h3>🛠️ To Do</h3>
        <ul>
          <li>📷 Album cover image support</li>
          <li>📐 Polish the UI</li>
          <li>🎶 Add genres to albums</li>
          <li>📊 Rating distribution graphs for filtered input</li>
          <li>📈 Add advanced statistics and rating analysis tools</li>
          <li>🌐 Integrate with Spotify to import entire albums</li>
          <li>🧮 Create and manage custom lists</li>
          <li>🔐 User login/authentication</li>
          <li>⚙️ Persistent user settings</li>
          <li>🧍 User-specific ratings</li>
          <li>💾 Import/export/share/save data features</li>
          <li>⚙️ Include interlude weight and min_weight in Settings</li>
          <li>⚙️ Include default profiles in Settings</li>
        </ul>
      </section>
    </div>
  );
}

export default Home;
