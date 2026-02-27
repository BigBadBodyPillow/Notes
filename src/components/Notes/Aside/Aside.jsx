import { useState } from "react";
//css
import "./Aside.css";

//icons
import ExpandSVG from "../../../assets/collapse-right-svgrepo-com.svg?react";
import ShrinkSVG from "../../../assets/collapse-left-svgrepo-com.svg?react";

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
      </aside>
    </>
  );
}
