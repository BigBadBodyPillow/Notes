import React, { useEffect, useState } from "react";

//package
import ct from "countries-and-timezones";

//assets
import DaySVG from "../../../assets/sun.svg?react";
import NightSVG from "../../../assets/moon.svg?react";
import TrashSVG from "../../../assets/trash.svg?react";

export function Timezone({ area, onDelete }) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  const timeArea = area;
  const timeAreaInfo = ct.getTimezone(timeArea);
  const offset = timeAreaInfo.utcOffsetStr;
  const countryCode = timeAreaInfo.countries[0];
  const countryFlag = getFlagEmoji(countryCode);
  /* remove the contident then replace all _'s with spaces.*/
  /* eg: America/Los_Angele -> Los Angeles*/
  const location = area.split("/").pop().replaceAll("_", " ");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const timeOptions = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: area,
      };
      const dateOptions = {
        timeZone: area,
      };
      const timeInfo = new Intl.DateTimeFormat("en-UK", timeOptions);
      const dateInfo = new Intl.DateTimeFormat("en-UK", dateOptions);
      const time = timeInfo.format(now);
      const date = dateInfo.format(now);

      setTime(time);
      setDate(date);
    };

    // Update immediately
    updateClock();

    const intervalId = setInterval(updateClock, 1000);

    return () => clearInterval(intervalId);
  }, [area]);

  //source https://gomakethings.com/getting-emoji-from-country-codes-with-vanilla-javascript/
  function getFlagEmoji(countryCode) {
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }

  return (
    <>
      <div className="clock" data-flag={countryFlag}>
        <div className="light">
          {time >= "06:00" && time <= "19:00" ? (
            <DaySVG className="day" />
          ) : (
            <NightSVG className="night" />
          )}
        </div>
        <div className="time">
          <h2>{time}</h2>
        </div>
        <div className="area">
          <p>{location}</p>
        </div>
        <div className="date">
          <p>
            {date}&nbsp;<span>{offset}</span>
            {/* <span>{timezone >= 0 ? "+" + timezone : "-" + timezone}</span> */}
          </p>
        </div>
        {onDelete && (
          <button
            className="delete"
            onClick={onDelete}
            aria-label="delete this clock"
          >
            <TrashSVG />
          </button>
        )}
      </div>
    </>
  );
}
