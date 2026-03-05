import "./App.css";

// components
import RainbowLine from "./components/RainbowLine/RainbowLine";
import { Calculator } from "./components/Calculator/Calculator";
import { Notes } from "./components/Notes/Notes";
import { Aside } from "./components/Notes/Aside/Aside";
import { NotesProvider } from "./context/NotesContext";

//assets
import NotesSVG from "./assets/note.svg?react";
import TimerSVG from "./assets/clock-hour-5.svg?react";
import ClockSVG from "./assets/earth-12-svgrepo-com.svg?react";

function App() {
  return (
    <NotesProvider>
      <>
        <RainbowLine />
        <main>
          <Aside />
          <Notes />
        </main>
        <div className="navbar">
          <button className="notes-toggle">
            <NotesSVG />
          </button>
          <button className="timer-toggle">
            <TimerSVG />
          </button>
          <button className="clock-toggle">
            <ClockSVG />
          </button>
          <div className="calculator">
            <Calculator />
          </div>
        </div>
      </>
    </NotesProvider>
  );
}

export default App;
