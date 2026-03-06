import "./Folder.css";
import { useNotes } from "../../../../context/NotesContext";
import { Note } from "../Note/Note";
import { useState } from "react";

//assets
import PoEMirageLogo from "../../../../assets/7Rnjl0f.png";
import TrashSVG from "../../../../assets/trash.svg?react";
import AddNoteSVG from "../../../../assets/note.svg?react";

export function Folder({ id, title, children: childrenData = [] }) {
  const { deleteNote, addNote, updateNote } = useNotes();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);

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

  const handleRenameClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsEditing(true);
  };

  const handleSaveTitle = () => {
    if (editTitle.trim()) {
      updateNote(id, { title: editTitle.trim() });
    } else {
      setEditTitle(title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSaveTitle();
    } else if (e.key === "Escape") {
      setEditTitle(title);
      setIsEditing(false);
    }
  };

  return (
    <>
      <details className="folder">
        <summary>
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={handleKeyDown}
              onClick={(e) => e.stopPropagation()}
              autoFocus
              className="folder-title-input"
            />
          ) : (
            <button
              className="title"
              onClick={handleRenameClick}
              title="rename folder"
            >
              {title}
            </button>
          )}
          <button
            className="delete"
            onClick={handleDelete}
            title="Delete folder"
          >
            <TrashSVG />
          </button>
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
