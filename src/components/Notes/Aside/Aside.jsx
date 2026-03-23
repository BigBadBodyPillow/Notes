import { useState } from "react";
//css
import "./Aside.css";

//assets
import ImportSVG from "../../../assets/file-download.svg?react";
import ExportSVG from "../../../assets/file-upload.svg?react";
import ShrinkSVG from "../../../assets/collapse-right-svgrepo-com.svg?react";
import ExpandSVG from "../../../assets/collapse-left-svgrepo-com.svg?react";
import AddNoteSVG from "../../../assets/note.svg?react";
import AddFolderSVG from "../../../assets/folder-plus.svg?react";
import PoEMirageLogo from "../../../assets/7Rnjl0f.png";

//component
import { Note } from "./Note/Note";
import { Folder } from "./Folder/Folder";
import { useNotes } from "../../../context/NotesContext";

export function Aside() {
  const [isClosed, setIsClosed] = useState(false);
  const {
    addNote,
    addFolder,
    searchTerm,
    setSearchTerm,
    getFilteredNotes,
    exportNotes,
    importNotes,
  } = useNotes();

  function toggleExpand() {
    setIsClosed(!isClosed);
  }

  const handleAddNote = () => {
    addNote();
  };

  const handleAddFolder = () => {
    addFolder();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleExport = () => {
    exportNotes();
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      importNotes(file)
        .then(() => {
          // alert("Notes imported successfully!");
          e.target.value = "";
        })
        .catch((error) => {
          // alert("Failed to import notes: " + error.message);
          e.target.value = "";
        });
    }
  };

  const filteredNotes = getFilteredNotes();

  const renderNotes = (items) => {
    return items.map((item) =>
      item.type === "folder" ? (
        <Folder
          key={item.id}
          id={item.id}
          title={item.title}
          children={item.children}
        />
      ) : (
        <Note
          key={item.id}
          id={item.id}
          image={PoEMirageLogo}
          title={item.title}
        />
      ),
    );
  };

  return (
    <>
      <aside className={isClosed ? "closed" : ""}>
        <div className="title">
          <h3>Notes</h3>
          <button onClick={toggleExpand}>
            {isClosed ? <ExpandSVG /> : <ShrinkSVG />}
          </button>
        </div>
        <div className="tools">
          <input
            placeholder="search notes..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <div className="button-group">
            <button
              className="addNote"
              onClick={handleAddNote}
              title="Add note"
            >
              <AddNoteSVG />
              <span>Note</span>
            </button>
            <button
              className="addFolder"
              onClick={handleAddFolder}
              title="Add folder"
            >
              <AddFolderSVG />
              <span>Folder</span>
            </button>
          </div>

          {/* <button className="export" onClick={handleExport} title="Export">
            <ExportSVG />
          </button>
          <label className="import" title="Import">
            <ImportSVG />
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: "none" }}
            />
          </label> */}
        </div>
        <div className="notes">
          <ul>{renderNotes(filteredNotes)}</ul>
        </div>

        <div className="button-group bottom">
          <button
            className="export"
            title="export notes"
            onClick={handleExport}
          >
            <ExportSVG />
            <span>Export</span>
          </button>
          <label className="import" title="Import notes">
            <ImportSVG />
            <span>Import </span>
            <input type="file" accept=".json" onChange={handleImport} />
          </label>
        </div>
      </aside>
    </>
  );
}
