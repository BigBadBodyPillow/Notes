import React from "react";

//components
import { Timezone } from "./Timezone/Timezone";

//css
import "./Clock.css";

//assets
import AddSVG from "../../assets/add-circle-svgrepo-com.svg?react";

export function Clock() {
  return (
    <>
      <div className="clock-container">
        <Timezone
          flag="🇿🇦"
          time="17:38"
          date="2026/03/16"
          area="South Africa (Local)"
          timezone="+2"
        />
        <Timezone
          flag="🇺🇸"
          time="13:22"
          date="2025/12/06"
          area="Another Place"
          timezone="+222"
        />
        <Timezone
          flag="🇳🇿"
          time="03:44"
          date="1926/09/23"
          area="Sasda sdasd"
          timezone="+12"
        />
        <button className="add" aria-label="add a new timer">
          <AddSVG />
        </button>
      </div>
    </>
  );
}
