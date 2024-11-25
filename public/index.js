/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

// https://developer.mozilla.org/en-US/docs/Web/CSS/:root
// https://stackoverflow.com/questions/77494641/use-data-theme-variable-value-in-css
import van from "vanjs-core";
import App from "./components/app.js";
import { UIStyle } from "/components/theme/theme.js";
//const {style} = van.tags;

van.add(document.head, UIStyle);
van.add(document.body, App());