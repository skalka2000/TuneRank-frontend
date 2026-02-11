import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Albums from "./pages/Albums";
import AlbumPage from "./pages/AlbumPage";
import AddAlbum from "./pages/AddAlbum";
import Songs from "./pages/Songs";
import Settings from "./pages/Settings";
import Navbar from "./components/Navbar";
import './styles/main.css';
import { UserSettingsProvider } from "./context/SettingsContext";

function App() {
  return (
    <UserSettingsProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/albums" element={<Albums />} />
          <Route path="/albums/:id" element={<AlbumPage />} />
          <Route path="/albums/add" element={<AddAlbum />} />
          <Route path="/songs" element={<Songs />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </UserSettingsProvider>
  );
}

export default App;
