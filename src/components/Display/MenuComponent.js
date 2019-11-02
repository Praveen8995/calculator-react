import React, { Component } from "react";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export default class Menu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDropDown: false
    };
  }

  handleClick = () => {
    if (!this.state.showDropDown) {
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }
    this.setState(prevState => ({
      showDropDown: !prevState.showDropDown
    }));
  };

  handleOutsideClick = e => {
    if (this.node.contains(e.target)) {
      return;
    }

    this.handleClick();
  };

  render() {
    const fontColor =
      this.props.theme === "google-theme" || this.props.theme === "dark theme"
        ? "var(--gBlack)"
        : "var(--mdBlue)";
    const IconColor =
      this.props.theme === "google-theme" || this.props.theme === "dark theme"
        ? "var(--altGrey)"
        : "var(--altGrey)";
    const radDegColor =
      this.props.theme === "google-theme"
        ? "var(--gaWhite)"
        : this.props.theme === "dark theme"
        ? "var(--gBlack)"
        : null;
    const shadow =
      this.props.theme === "google-theme"
        ? "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,1px 1px 0 #000"
        : null;
    const mainBgColor =
      this.props.theme === "google-theme" || this.props.theme === "dark theme"
        ? "var(--gaWhite)"
        : null;

    const linkStyle = { textDecoration: "none", color: fontColor };
    return (
      <div>
        <div
          ref={node => {
            this.node = node;
          }}
          className="menu-icon"
          onClick={this.handleClick}
        >
          <FontAwesomeIcon icon={faEllipsisV} color={IconColor} />
        </div>
        <div
          className="dropdown-content"
          style={{
            display: this.state.showDropDown ? "block" : "none",
            backgroundColor: mainBgColor
          }}
        >
          <ul>
            <li>
              <Link style={linkStyle} to="/settings">
                Themes settings
              </Link>
            </li>
          </ul>
        </div>
        <div
          style={{ color: radDegColor, textShadow: shadow }}
          className="rad-deg"
        >
        </div>
      </div>
    );
  }
}
