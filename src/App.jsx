import "./App.css";

//pages
import NotesPage from "./Pages/NotesPage";
import TimerPage from "./Pages/TimerPage";
import ClockPage from "./Pages/ClockPage";

// components
import RainbowLine from "./components/RainbowLine/RainbowLine";
import { Calculator } from "./components/Calculator/Calculator";

//assets
import NotesSVG from "./assets/note.svg?react";
import TimerSVG from "./assets/clock-hour-5.svg?react";
import ClockSVG from "./assets/earth-12-svgrepo-com.svg?react";
import { useState } from "react";

function App() {
  const [currentPage, setCurrentPage] = useState("NotesPage");

  const RenderPage = () => {
    switch (currentPage) {
      case "NotesPage":
        return <NotesPage />;
      case "TimerPage":
        return <TimerPage />;
      case "ClockPage":
        return <ClockPage />;

      default:
        return <NotesPage />;
    }
  };

  return (
    <>
      <RainbowLine />
      <main>{RenderPage()}</main>
      <nav className="navbar">
        <button
          className="notes-toggle"
          onClick={() => setCurrentPage("NotesPage")}
        >
          <NotesSVG />
        </button>
        <button
          className="timer-toggle"
          onClick={() => setCurrentPage("TimerPage")}
        >
          <TimerSVG />
        </button>
        <button
          className="clock-toggle"
          onClick={() => setCurrentPage("ClockPage")}
        >
          <ClockSVG />
        </button>
        <div className="calculator">
          <Calculator />
        </div>
      </nav>
    </>
  );
}

export default App;
