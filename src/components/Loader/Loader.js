import React, { Component } from "react";
import "./style.css";

export default class Loading extends Component {
  render() {
    return (
      <div className="loader-wrapper">
        <div className="loader"></div>
      </div>
  )
  }
}