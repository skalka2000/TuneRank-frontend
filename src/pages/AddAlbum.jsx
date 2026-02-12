import React from "react";
import { useNavigate } from "react-router-dom";
import AddAlbumForm from "../components/AddAlbumForm";
import { addAlbum } from "../api/albums";
import { useUserMode } from "../hooks/useUserMode";

function AddAlbum() {
  const navigate = useNavigate();
  const { userId, mode } = useUserMode();

  const handleCancel = () => {
    navigate(`/${mode}/albums`);
  };

  const handleAddAlbum = async (album) => {
    try {
      await addAlbum(album, userId);
      navigate(`/${mode}/albums`);
    } catch (err) {
      console.log("Failed to add album: ", album);
      console.error(err.message);
    }
  };

  return (
    <div className="page">
      <h2>Add Album</h2>
      <AddAlbumForm
        onSubmit={handleAddAlbum}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default AddAlbum;
