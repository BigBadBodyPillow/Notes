import React from "react";
import "./Timer.css";

//components
import { Timers } from "./Timers/Timers";

export default function Timer() {
  return (
    <>
      <div className="timer-container">
        <Timers />
        <Timers />
        <Timers />
        <div className="add timers">
          <span>New timer</span>
          <button>add</button>
        </div>
      </div>
    </>
  );
}
