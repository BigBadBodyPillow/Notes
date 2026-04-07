//css
import "./Notes.css";
import { useNotes } from "../../context/NotesContext";
import Editor from "./Editor/Editor.tsx";

// assets
import PoEMirageLogo from "../../assets/7Rnjl0f.png";
import Pencil from "../../assets/pencil.svg?react";

export function Notes() {
  const { selectedNoteId, getNoteById, updateNote } = useNotes();

  const currentNote = selectedNoteId ? getNoteById(selectedNoteId) : null;

  const handleTitleChange = (e) => {
    if (currentNote) {
      updateNote(selectedNoteId, { title: e.target.value });
    }
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
      <div className={"notes-container "}>
        <div className="notes-title-container">
          <div className="image">
            <img src={PoEMirageLogo} alt="" />
            <div className="pencil">
              <Pencil />
            </div>
          </div>

          <input
            type="text"
            className="note-title-input"
            value={currentNote.title}
            // value={currentNote ? currentNote.title : ""}
            onChange={handleTitleChange}
            placeholder="Note title"
          />
        </div>
        <Editor noteId={selectedNoteId} />
      </div>
    </>
  );
}
