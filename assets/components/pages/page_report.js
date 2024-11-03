/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate, getRouterQuery } from "vanjs-routing";

const {button, div, pre, p, br} = van.tags

function Page_Report() {
  // van.derive(() => {
  //   console.log(getRouterQuery()); // { section: "profile" }
  // });

  return div(
    button({onclick:()=>navigate("/") }, "Back"),
    p("Report"), 
    p("Work in progress builds."), 
    
  );
}

export{
  Page_Report
}