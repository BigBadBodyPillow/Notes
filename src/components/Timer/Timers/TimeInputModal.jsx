import React, { useState } from "react";

export function TimeInputModal({
  title,
  isOpen,
  onClose,
  onConfirm,
  initialTime,
}) {
  const [timerTitle, setTimerTitle] = useState(title || "Title x");
  const [hours, setHours] = useState(initialTime.hours || 0);
  const [minutes, setMinutes] = useState(initialTime.minutes || 0);
  const [seconds, setSeconds] = useState(initialTime.seconds || 0);

  const handleConfirm = () => {
    onConfirm({ hours, minutes, seconds });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Timer</h2>

        <div className="title-inputs">
          <label>Title</label>
          <input type="text" placeholder={timerTitle} />
        </div>

        <div className="time-inputs">
          <div className="input-group">
            <label>Hours</label>
            <input
              type="number"
              min="0"
              max="23"
              value={hours}
              onChange={(e) =>
                setHours(
                  Math.max(0, Math.min(23, parseInt(e.target.value) || 0)),
                )
              }
            />
          </div>

          <div className="input-group">
            <label>Minutes</label>
            <input
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={(e) =>
                setMinutes(
                  Math.max(0, Math.min(59, parseInt(e.target.value) || 0)),
                )
              }
            />
          </div>

          <div className="input-group">
            <label>Seconds</label>
            <input
              type="number"
              min="0"
              max="59"
              value={seconds}
              onChange={(e) =>
                setSeconds(
                  Math.max(0, Math.min(59, parseInt(e.target.value) || 0)),
                )
              }
            />
          </div>
        </div>

        <div className="modal-buttons">
          <button className="save" onClick={handleConfirm}>
            Save
          </button>
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
