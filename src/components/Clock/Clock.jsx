import React, { useEffect, useState } from "react";

//components
import { Timezone } from "./Timezone/Timezone";

//css
import "./Clock.css";

//assets
import AddSVG from "../../assets/add-circle-svgrepo-com.svg?react";

export function Clock() {
  // const now = new Date();
  // const year = now.getUTCFullYear();
  // const month = now.getUTCMonth() + 1;
  // const day = now.getUTCDate();
  // const hours = now.getUTCHours();
  // const minutes = now.getUTCMinutes();
  // const seconds = now.getUTCSeconds();

  // const currentTime = hours + ":" + minutes;
  // const localDate = now.toLocaleDateString();

  // console.log(now.toLocaleTimeString());

  // get area but remove continent
  // const area = Intl.DateTimeFormat()
  //   .resolvedOptions()
  //   .timeZone.split("/")
  //   .pop();

  const [date, setDate] = useState(new Date());
  const localDate = date.toLocaleDateString();
  const localTime = date.toLocaleTimeString(navigator.language, {
    hour: "2-digit",
    minute: "2-digit",
  });
  const area = Intl.DateTimeFormat()
    .resolvedOptions()
    .timeZone.split("/")
    .pop();

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);

    return function cleanup() {
      clearInterval(timer);
    };
  }, []);

  return (
    <>
      <div className="clock-container">
        <Timezone
          flag="🇿🇦"
          time={localTime}
          date={localDate}
          area={area}
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
