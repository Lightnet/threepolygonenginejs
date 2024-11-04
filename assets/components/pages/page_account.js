/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate, getRouterQuery } from "vanjs-routing";
import { HomeNavMenu } from "../navmenu.js";

const {button, div, pre, p} = van.tags

function AccountPage() {
  // van.derive(() => {
  //   console.log(getRouterQuery()); // { section: "profile" }
  // });

  return div(
    HomeNavMenu(),
    div(
      button('Info'),
    )
  );
}

export{
  AccountPage
}