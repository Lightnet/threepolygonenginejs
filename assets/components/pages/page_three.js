/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate, getRouterQuery } from "vanjs-routing";

const {button, div, pre, p} = van.tags

function Page_Threejs() {
  van.derive(() => {
    console.log(getRouterQuery()); // { section: "profile" }
  });

  return div(
    p("About"), Link({ href: "/" }, "Back to Home")
  );
}

export{
  Page_Threejs
}