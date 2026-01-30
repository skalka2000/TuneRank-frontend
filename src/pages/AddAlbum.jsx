import React from "react";
import { useNavigate } from "react-router-dom";
import AddAlbumForm from "../components/AddAlbumForm";
import { addAlbum } from "../api/albums";


function AddAlbum() {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/albums");
  };


  const handleAddAlbum = async (album) => {
    try {
        await addAlbum(album);
        navigate("/albums");
    } catch (err) {
        console.log("Failed to add album: ", album)
        console.error(err.message)
    }
  };

  return (
    <div>
      <h2>Add Album</h2>
      <AddAlbumForm onSubmit={handleAddAlbum} onCancel={handleCancel} />
    </div>
  );
}

export default AddAlbum;
