import React, { useEffect, useState } from "react";

//components
import { Timezone } from "./Timezone/Timezone";

//css
import "./Clock.css";

//assets
import AddSVG from "../../assets/add-circle-svgrepo-com.svg?react";

//package
import ct from "countries-and-timezones";

export function Clock() {
  const [clocks, setClocks] = useState([
    { id: 1, area: "America/Los_Angeles" },
    { id: 2, area: "America/New_York" },
    { id: 3, area: "Europe/London" },
    { id: 4, area: "Asia/Shanghai" },
    { id: 5, area: "Pacific/Auckland" },
  ]);
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const localArea = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const allTimezones = Object.keys(ct.getAllTimezones());

  const addClock = () => {
    if (selectedTimezone && !clocks.some((c) => c.area === selectedTimezone)) {
      const newId = Date.now();
      setClocks([...clocks, { id: newId, area: selectedTimezone }]);
      setSelectedTimezone("");
    }
  };

  const removeClock = (id) => {
    setClocks(clocks.filter((c) => c.id !== id));
  };

  return (
    <>
      <div className="clock-container">
        <Timezone area={localArea} />
        {clocks.map((clock) => (
          <Timezone
            key={clock.id}
            area={clock.area}
            onDelete={() => removeClock(clock.id)}
          />
        ))}
        <div className="add-section">
          <input
            type="text"
            list="timezones"
            value={selectedTimezone}
            onChange={(e) => setSelectedTimezone(e.target.value)}
            placeholder="Search for a timezone"
          />
          <datalist id="timezones">
            {allTimezones.map((timezone) => (
              <option key={timezone} value={timezone}>
                {timezone}
                {/* {timezone.split("/").pop().replaceAll("_", " ")} */}
              </option>
            ))}
          </datalist>
          <button
            className="add-timezone"
            onClick={addClock}
            aria-label="add a new clock"
          >
            <AddSVG />
          </button>
        </div>
      </div>
    </>
  );
}
