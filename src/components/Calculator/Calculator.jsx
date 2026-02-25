import { useState, useRef } from "react";

//css
import "./Calculator.css";

//modules
import Draggable from "react-draggable";

//svg
import CalculatorSVG from "../../assets/Calculator.svg?react";

export function Calculator() {
  const [display, setDisplay] = useState("");
  const [previousEquation, setPreviousEquation] = useState("");
  const [lastWasResult, setLastWasResult] = useState(false);
  const [calculatorVisible, setCalculatorVisible] = useState(false);

  const nodeRef = useRef(null);

  const handleClick = (value) => {
    if (value === "Clear") {
      setDisplay("");
      setPreviousEquation("");
      setLastWasResult(false);
      return;
    }

    if (value === "Delete") {
      if (lastWasResult) {
        setDisplay("");
        setLastWasResult(false);
      } else {
        setDisplay((prev) => prev.slice(0, -1));
      }
      return;
    }

    if (lastWasResult) {
      const operators = ["+", "-", "x", "/", "*"];
      if (value === "=") {
      } else if (operators.includes(value)) {
        setDisplay((prev) => prev + value);
        setPreviousEquation("");
        setLastWasResult(false);
        return;
      } else {
        setDisplay(value);
        setPreviousEquation("");
        setLastWasResult(false);
        return;
      }
    }

    if (value === "=") {
      try {
        setPreviousEquation(display);
        const expr = display.replace(/x/g, "*");
        // eslint-disable-next-line no-new-func
        const result = Function('"use strict";return (' + expr + ")")();
        setDisplay(String(result));
        setLastWasResult(true);
      } catch {
        setDisplay("Error");
        setLastWasResult(true);
      }
      return;
    }

    setDisplay((prev) => prev + value);
  };
  const toggleCalculator = () => {
    setCalculatorVisible(!calculatorVisible);
  };

  return (
    <>
      <button
        className={`calculator-toggle ${calculatorVisible ? "oppened" : ""}`}
        onClick={() => toggleCalculator()}
      >
        {/* {calculatorVisible ? "Close" : "Open"} */}

        <CalculatorSVG />
      </button>
      <Draggable
        nodeRef={nodeRef}
        handle=".handle-bar"
        bounds="body"
        // defaultPosition={{ x: 25, y: 25 }}
      >
        <div
          ref={nodeRef}
          className={
            "calculator-container " + (calculatorVisible ? " " : "hidden")
          }
          // style={{ position: 'absolute', bottom: '6.25rem', right: '18rem' }}
        >
          <div className="handle-bar"></div>
          <div className="main-calculator">
            <div className="display">
              <p className="equation">
                <span>{previousEquation}</span>
              </p>
              <span className="value">{display}</span>
            </div>
            <div className="input-group">
              <button
                className="clear controls"
                onClick={() => handleClick("Clear")}
              >
                Clear
              </button>
              <button className="controls" onClick={() => handleClick("/")}>
                /
              </button>
              <button onClick={() => handleClick("7")}>7</button>
              <button onClick={() => handleClick("8")}>8</button>
              <button onClick={() => handleClick("9")}>9</button>
              <button className="controls" onClick={() => handleClick("x")}>
                x
              </button>
              <button onClick={() => handleClick("4")}>4</button>
              <button onClick={() => handleClick("5")}>5</button>
              <button onClick={() => handleClick("6")}>6</button>
              <button className="controls" onClick={() => handleClick("-")}>
                -
              </button>
              <button onClick={() => handleClick("1")}>1</button>
              <button onClick={() => handleClick("2")}>2</button>
              <button onClick={() => handleClick("3")}>3</button>
              <button className="controls" onClick={() => handleClick("+")}>
                +
              </button>
              <button className="controls" onClick={() => handleClick(".")}>
                .
              </button>
              <button onClick={() => handleClick("0")}>0</button>
              <button
                className="equals controls"
                onClick={() => handleClick("=")}
              >
                =
              </button>
              <button
                className="delete controls"
                onClick={() => handleClick("Delete")}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </Draggable>
    </>
  );
}
