/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate, getRouterQuery } from "vanjs-routing";
import { El_CreateReportForm } from "../report/report.js";
import { HomeNavMenu } from "../navmenu.js";

const {button, div, pre, p, br} = van.tags

function Page_Report() {
  // van.derive(() => {
  //   console.log(getRouterQuery()); // { section: "profile" }
  // });

  return div(
    HomeNavMenu(),
    El_CreateReportForm(),
  );
}

export{
  Page_Report
}