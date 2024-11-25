/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import { THREE, ECS, van } from "/dps.js";
//import App from "./components/app.js";
//van.add(document.body, App())

import {LoginEL} from "./components/auth/ui_login.js";

van.add(document.body, LoginEL())

console.log("login...");