//css
import "./Notes.css";
import { useNotes } from "../../context/NotesContext";
import Editor from "./Editor/Editor.tsx";

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
        <input
          type="text"
          className="note-title-input"
          value={currentNote.title}
          // value={currentNote ? currentNote.title : ""}
          onChange={handleTitleChange}
          placeholder="Note title"
        />
        <Editor noteId={selectedNoteId} />
      </div>
    </>
  );
}
