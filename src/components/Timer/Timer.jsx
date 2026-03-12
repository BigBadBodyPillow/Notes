import React, { useState, useEffect } from "react";
import "./Timer.css";

//components
import { Timers } from "./Timers/Timers";

const STORAGE_KEY = "timers";

const defaultTimer = {
  id: Date.now(),
  title: "Timer",
  hours: 0,
  minutes: 5,
  seconds: 0,
};

export default function Timer() {
  const [timers, setTimers] = useState([]);

  // Load timers from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setTimers(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load timers", e);
        setTimers([defaultTimer]);
      }
    } else {
      setTimers([defaultTimer]);
    }
  }, []);

  // Save timers to localStorage whenever they change
  useEffect(() => {
    if (timers.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(timers));
    }
  }, [timers]);

  const handleAddTimer = () => {
    const newTimer = {
      id: Date.now(),
      title: "Timer",
      hours: 0,
      minutes: 5,
      seconds: 0,
    };
    setTimers([...timers, newTimer]);
  };

  const handleDeleteTimer = (id) => {
    setTimers(timers.filter((timer) => timer.id !== id));
  };

  const handleTimeSet = (id, time, title) => {
    setTimers(
      timers.map((timer) =>
        timer.id === id ? { ...timer, ...time, title } : timer,
      ),
    );
  };

  return (
    <>
      <div className="timer-container">
        {timers.map((timer) => (
          <Timers
            key={timer.id}
            id={timer.id}
            initialTitle={timer.title}
            initialTime={{
              hours: timer.hours,
              minutes: timer.minutes,
              seconds: timer.seconds,
            }}
            onTimeSet={handleTimeSet}
            onDelete={handleDeleteTimer}
          />
        ))}
        <div className="add timers">
          <span>New timer</span>
          <button onClick={handleAddTimer}>add</button>
        </div>
      </div>
    </>
  );
}
