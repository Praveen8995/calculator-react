import React from "react";

export default function InputDisplay(props) {
  const fontColor =
    props.theme === "google-theme" || props.theme === "dark theme"
      ? "var(--gBlack)"
      : null;
  const caretColor =
    props.theme === "google-theme"
      ? "var(--gBlue)"
      : props.theme === "dark theme"
      ? "var(--gBlack)"
      : null;
  return (
    <input
      style={{ color: fontColor, caretColor: caretColor }}
      className="input-display"
      value={props.displayInput}
    />
  );
}
