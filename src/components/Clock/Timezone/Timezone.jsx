import React from "react";

//assets
import DaySVG from "../../../assets/sun.svg?react";
import NightSVG from "../../../assets/moon.svg?react";

export function Timezone({ time, date, timezone, area, flag }) {
  return (
    <>
      <div className="clock" data-flag={flag}>
        <div className="light">
          <DaySVG className="day" />
          {/* <NightSVG className="night" /> */}
        </div>
        <div className="time">
          <h2>{time}</h2>
        </div>
        <div className="area">
          <p>{area}</p>
        </div>
        <div className="date">
          <p>
            {date} <span>{timezone}</span>
          </p>
        </div>
      </div>
    </>
  );
}
