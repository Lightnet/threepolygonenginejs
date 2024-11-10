/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

//import { van } from "/dps.js";
import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate, getRouterQuery } from "vanjs-routing";
import { HomeNavMenu } from "../navmenu.js";

const {div,label} = van.tags;

function Page_Novel(){
  return div(
    HomeNavMenu(),
    label('Novel')

  )
}

export {
  Page_Novel
}