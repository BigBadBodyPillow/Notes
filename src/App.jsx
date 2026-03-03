import "./App.css";

// components
import RainbowLine from "./components/RainbowLine/RainbowLine";
import { Calculator } from "./components/Calculator/Calculator";
import { Notes } from "./components/Notes/Notes";
import { Aside } from "./components/Notes/Aside/Aside";
import { NotesProvider } from "./context/NotesContext";

function App() {
  return (
    <NotesProvider>
      <>
        <RainbowLine />
        <main>
          <Aside />
          <Notes />
        </main>
        <div className="tools">
          <Calculator />
        </div>
      </>
    </NotesProvider>
  );
}

export default App;
