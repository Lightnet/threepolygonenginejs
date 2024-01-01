/*
  Information:
    vanjs main client entry point
*/
import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.2.1.min.js"

console.log("test vanjs");
//const {button, input, label, div, script, pre, p, ul, li, a} = van.tags;
import { IndexEL } from "./vanjs/index.js";

van.add(document.body, IndexEL())
