import React, { useEffect, useState } from "react";

//css
import "../Timer.css";

//components
import { TimeInputModal } from "./TimeInputModal";

export function Timers() {
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(true);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(300);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  function formatTime(totalSecs) {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;

    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function handleStart() {
    setStarted(true);
    setPaused(false);
  }

  function handlePause() {
    setPaused(!paused);
  }

  function handleReset() {
    setStarted(false);
    setPaused(true);
    setRemainingSeconds(totalSeconds);
  }

  function handleTimeSet(time) {
    setHours(time.hours);
    setMinutes(time.minutes);
    setSeconds(time.seconds);
    const newTotal = time.hours * 3600 + time.minutes * 60 + time.seconds;
    setRemainingSeconds(newTotal);
    setIsModalOpen(false);
    setStarted(false);
    setPaused(true);
  }

  useEffect(() => {
    if (started && !paused && remainingSeconds > 0) {
      const interval = setInterval(() => {
        setRemainingSeconds((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [started, paused, remainingSeconds]);

  useEffect(() => {
    if (remainingSeconds === 0 && started) {
      setStarted(false);
    }
  }, [remainingSeconds, started]);

  return (
    <>
      <TimeInputModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleTimeSet}
        initialTime={{ hours, minutes, seconds }}
      />
      <div className="timers" onClick={() => !started && setIsModalOpen(true)}>
        <p className="title">Title</p>
        <div className="display">
          <span className="countdown">{formatTime(remainingSeconds)}</span>
          <progress
            max={totalSeconds}
            value={totalSeconds - remainingSeconds}
          ></progress>
        </div>
        <div className="button-group">
          {started ? (
            <button
              className="pause"
              onClick={(e) => {
                e.stopPropagation();
                handlePause();
              }}
            >
              {paused ? "Resume" : "Pause"}
            </button>
          ) : (
            <button
              className="start"
              onClick={(e) => {
                e.stopPropagation();
                handleStart();
              }}
            >
              Start
            </button>
          )}
          <button
            className={`reset ${started ? "" : "disabled"}`}
            onClick={(e) => {
              e.stopPropagation();
              handleReset();
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </>
  );
}
