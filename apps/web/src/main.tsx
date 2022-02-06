import React from "react";
import ReactDOM from "react-dom";
import { App } from "./app";
import "./styles/colors.css";
import "./styles/global.css";
import { enablePatches } from "immer";

enablePatches();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
