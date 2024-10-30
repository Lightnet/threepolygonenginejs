/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/
import { THREE, ECS, van } from "./dps.js";
import { AdminPage } from "./components/admin/admin_access.js";

const {button, div, pre, p} = van.tags;

van.add(document.body, AdminPage())

console.log("ADMIN");