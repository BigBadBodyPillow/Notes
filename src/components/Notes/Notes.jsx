import { useNotes } from "../../context/NotesContext";
import { useState } from "react";

// components
import Editor from "./Editor/Editor.tsx";
//css
import "./Notes.css";

// assets
import PoEMirageLogo from "../../assets/7Rnjl0f.png";
import Pencil from "../../assets/pencil.svg?react";

export function Notes() {
  const { selectedNoteId, getNoteById, updateNote } = useNotes();
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [imageFileInput, setImageFileInput] = useState(null);

  const currentNote = selectedNoteId ? getNoteById(selectedNoteId) : null;

  const handleTitleChange = (e) => {
    if (currentNote) {
      updateNote(selectedNoteId, { title: e.target.value });
    }
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageDataUrl = event.target.result;
        updateNote(selectedNoteId, { image: imageDataUrl });
        setShowImagePicker(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Open file dialog when clicking the image container
  const handleImageClick = () => {
    setShowImagePicker(true);
  };

  if (!currentNote) {
    return (
      <>
        <div className="notes-container none-selected"></div>
      </>
    );
  }

  return (
    <>
      {showImagePicker && (
        <input
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          style={{ display: "none" }}
          ref={(el) => {
            setImageFileInput(el);
            if (el) {
              el.click();
            }
          }}
        />
      )}
      <div className={"notes-container "}>
        <div className="notes-title-container">
          <div className="image" onClick={handleImageClick}>
            <img src={currentNote.image || PoEMirageLogo} alt="" />
            <div className="pencil">
              <Pencil />
            </div>
          </div>

          <input
            type="text"
            className="note-title-input"
            value={currentNote.title}
            onChange={handleTitleChange}
            placeholder="Note title"
          />
        </div>
        <Editor noteId={selectedNoteId} />
      </div>
    </>
  );
}
