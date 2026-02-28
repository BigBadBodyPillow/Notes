import "./App.css";

// components
import RainbowLine from "./components/RainbowLine/RainbowLine";
import { Calculator } from "./components/Calculator/Calculator";
import { Notes } from "./components/Notes/Notes";
import { Aside } from "./components/Notes/aside/Aside";

function App() {
  return (
    <>
      <RainbowLine />
      <main>
        <Aside />
        <Notes />
      </main>
      <Calculator />
    </>
  );
}

export default App;
