/*
  Information:
    vanjs main client entry point
*/

import { van } from "./triengine/dps.js";
console.log("init vanjs app...");
//const {button, input, label, div, script, pre, p, ul, li, a} = van.tags;
import { App } from "./components/app.js";

van.add(document.body, App())
