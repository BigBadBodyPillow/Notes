import React from "react";

//components
import { Timezone } from "./Timezone/Timezone";

//css
import "./Clock.css";

//assets
import AddSVG from "../../assets/add-circle-svgrepo-com.svg?react";

export function Clock() {
  const localArea = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <>
      <div className="clock-container">
        <Timezone area={localArea} />
        <Timezone area="Europe/London" />
        <Timezone area="Pacific/Auckland" />
        <Timezone area="America/Los_Angeles" />
        <button className="add" aria-label="add a new timer">
          <AddSVG />
        </button>
      </div>
    </>
  );
}
