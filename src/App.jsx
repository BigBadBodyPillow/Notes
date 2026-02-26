import "./App.css";

// components
import RainbowLine from "./components/RainbowLine/RainbowLine";
import { Calculator } from "./components/Calculator/Calculator";

// svg
import TopographySVG from "./assets/Topography.svg?react";

function App() {
  return (
    <>
      <RainbowLine />
      <Calculator />
    </>
  );
}

export default App;
