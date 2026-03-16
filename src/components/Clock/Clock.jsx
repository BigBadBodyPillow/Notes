import React from "react";

//css
import "./Clock.css";

//assets
import AddSVG from "../../assets/add-circle-svgrepo-com.svg?react";
import DaySVG from "../../assets/sun.svg?react";
import NightSVG from "../../assets/moon.svg?react";

export function Clock() {
  return (
    <>
      <div className="clock-container">
        <div className="clock">
          <div className="light">
            <DaySVG />
          </div>
          {/* <NightSVG /> */}
          <div className="time">
            <h2>17:38</h2>
          </div>
          <div className="area">
            <p>South Africa (Local)</p>
          </div>
          <div className="date">
            <p>
              2026/03/16 <span>+2</span>
            </p>
          </div>
        </div>

        <button className="add" aria-label="add a new timer">
          <AddSVG />
          {/* <span>+</span> */}
        </button>
      </div>
    </>
  );
}
