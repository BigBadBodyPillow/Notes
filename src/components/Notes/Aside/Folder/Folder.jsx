import "./Folder.css";
import { useNotes } from "../../../../context/NotesContext";
import { Note } from "../Note/Note";

//assets
import PoEMirageLogo from "../../../../assets/7Rnjl0f.png";
import TrashSVG from "../../../../assets/trash.svg?react";
import AddNoteSVG from "../../../../assets/note.svg?react";

export function Folder({ id, title, children: childrenData = [] }) {
  const { deleteNote, addNote } = useNotes();

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete folder "${title}"?`)) {
      deleteNote(id);
    }
  };

  const handleAddNote = (e) => {
    e.stopPropagation();
    addNote(id);
  };

  return (
    <>
      <details className="folder">
        <summary>
          <span className="title">{title}</span>
          {/* <div className="folder-actions" onClick={(e) => e.stopPropagation()}> */}
          {/* <button
              className="add-note-btn"
              onClick={handleAddNote}
              title="Add note to folder"
            >
              +📝
            </button> */}
          <button
            className="delete"
            onClick={handleDelete}
            title="Delete folder"
          >
            <TrashSVG />
          </button>
          {/* </div> */}
        </summary>
        <ul>
          {childrenData && childrenData.length > 0
            ? childrenData.map((child) =>
                child.type === "folder" ? (
                  <Folder
                    key={child.id}
                    id={child.id}
                    title={child.title}
                    children={child.children}
                  />
                ) : (
                  <Note
                    key={child.id}
                    id={child.id}
                    image={PoEMirageLogo}
                    title={child.title}
                  />
                ),
              )
            : // <li className="empty">Empty folder</li>
              ""}
        </ul>
        <button
          className="add-note"
          onClick={handleAddNote}
          title="Add note to folder"
        >
          <AddNoteSVG />
          <span>Add Note</span>
        </button>
      </details>
    </>
  );
}
