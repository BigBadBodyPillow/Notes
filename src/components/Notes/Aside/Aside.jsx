import { useState } from "react";
//css
import "./Aside.css";

//assets
import ShrinkSVG from "../../../assets/collapse-right-svgrepo-com.svg?react";
import ExpandSVG from "../../../assets/collapse-left-svgrepo-com.svg?react";
// import AddNoteSVG from "../../../assets/add-square-svgrepo-com.svg?react";
import AddNoteSVG from "../../../assets/note.svg?react";
import AddFolderSVG from "../../../assets/folder-plus.svg?react";
import PoEMirageLogo from "../../../assets/7Rnjl0f.png";

//component
import { Note } from "./Note/Note";
import { Folder } from "./Folder/Folder";

export function Aside() {
  const [isExpanded, setIsExpanded] = useState(false);

  function toggleExpand() {
    setIsExpanded(!isExpanded);
  }
  return (
    <>
      <aside className={isExpanded ? "expanded" : ""}>
        <div className="title">
          <h3>Notes</h3>
          <button onClick={toggleExpand}>
            {isExpanded ? <ExpandSVG /> : <ShrinkSVG />}
          </button>
        </div>
        <div className="tools">
          <button className="addNote">
            <AddNoteSVG />
          </button>
          <button className="addFolder">
            <AddFolderSVG />
          </button>
          <input placeholder="search"></input>
        </div>
        <div className="notes">
          <ul>
            <Note
              image={PoEMirageLogo}
              title="titleedweas assssssssssssssssssssssssssssss"
            />
            <Folder>
              <Note
                image={PoEMirageLogo}
                title="titleedweas assssssssssssssssssssssssssssss"
              />
              <Note
                image={PoEMirageLogo}
                title="titleedweas assssssssssssssssssssssssssssss"
              />
            </Folder>
            <Note
              image={PoEMirageLogo}
              title="titleedweas assssssssssssssssssssssssssssss"
            />
          </ul>
        </div>
      </aside>
    </>
  );
}
