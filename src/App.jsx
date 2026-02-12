import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Albums from "./pages/Albums";
import AlbumPage from "./pages/AlbumPage";
import AddAlbum from "./pages/AddAlbum";
import Songs from "./pages/Songs";
import Settings from "./pages/Settings";
import Navbar from "./components/Navbar";
import "./styles/main.css";
import { UserSettingsProvider } from "./context/SettingsContext";

function App() {
  return (
    
    <Router>
      <UserSettingsProvider>
        <Navbar />
        <Routes>
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/demo" />} />

          {/* All routes under :mode */}
          <Route path="/:mode" element={<Home />} />
          <Route path="/:mode/albums" element={<Albums />} />
          <Route path="/:mode/albums/add" element={<AddAlbum />} />
          <Route path="/:mode/albums/:id" element={<AlbumPage />} />
          <Route path="/:mode/songs" element={<Songs />} />
          <Route path="/:mode/settings" element={<Settings />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/demo" />} />
        </Routes>
      </UserSettingsProvider>  
    </Router>
  );
}

export default App;
