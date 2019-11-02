import React from "react";
import {
  faChevronRight,
  faChevronLeft
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SideDrawer(props) {
  const toggleThemeClass =
    props.theme === "google-theme"
      ? "ripple-google"
      : props.theme === "android"
      ? "ripple-android"
      : "ripple-numpad";
  const mainBgColor =
    props.theme === "google-theme"
      ? "var(--gBlue)"
      : props.theme === "android"
      ? "var(--aGreen)"
      : null;
  const fontColor =
    props.theme === "google-theme"
      ? "var(--gaWhite)"
      : props.theme === "android"
      ? "var(--gBlack)"
      : null;
  const shadow =
    props.theme === "google-theme"
      ? "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,1px 1px 0 #000"
      : props.theme === "android"
      ? "-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff,1px 1px 0 #fff"
      : null;

  const inverseFont = props.inverse ? 600 : null;

  return (
    <div
      className="extra-operators"
      style={{
        right: props.sideDrawerOpen ? "0px" : "-189px",
        backgroundColor: mainBgColor
      }}
    >
      <button className="drag-sym" onClick={props.toggleSideDrawer}>
        <FontAwesomeIcon
          icon={props.sideDrawerOpen ? faChevronRight : faChevronLeft}
          color={fontColor}
        />
      </button>
      <button
        className={toggleThemeClass}
        style={{
          color: fontColor,
          textShadow: shadow,
          fontWeight: inverseFont
        }}
        value={props.inverse ? "sin⁻¹(" : "sin("}
        onClick={e => props.handleSideDrawerKeys(e.target.value)}
      >
        {props.inverse ? "sin⁻¹" : "sin"}
      </button>
      <button
        value={props.inverse ? "²" : "√"}
        className={toggleThemeClass}
        style={{ color: fontColor, textShadow: shadow }}
        onClick={e => props.handleSideDrawerKeys(e.target.value)}
      >
        {props.inverse ? <>&#215;&#178;</> : <>&#8730;</>}
      </button>
    </div>
  );
}
