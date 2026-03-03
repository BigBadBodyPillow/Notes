//css
import "./Note.css";
import { useNotes } from "../../../../context/NotesContext";

//assets
import TrashSVG from "../../../../assets/trash.svg?react";

export function Note({ id, image, title }) {
  const { setSelectedNoteId, deleteNote, selectedNoteId } = useNotes();

  const handleClick = () => {
    setSelectedNoteId(id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${title}"?`)) {
      deleteNote(id);
    }
  };

  return (
    <>
      <li
        className={`note ${selectedNoteId === id ? "active" : ""}`}
        onClick={handleClick}
      >
        <img src={image} alt="" />
        <p>{title}</p>
        <button className="delete" onClick={handleDelete} title="Delete note">
          <TrashSVG />
        </button>
      </li>
    </>
  );
}
