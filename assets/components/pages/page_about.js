/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate, getRouterQuery } from "vanjs-routing";

const {button, div, pre, p, br} = van.tags

function AboutComponent() {
  van.derive(() => {
    console.log(getRouterQuery()); // { section: "profile" }
  });

  return div(
    button({onclick:()=>navigate("/") }, "Back"),
    p("About"), 
    p("Work in progress builds."), 
    
  );
}

export{
  AboutComponent
}