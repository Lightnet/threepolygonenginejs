/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate, getRouterQuery } from "vanjs-routing";
import { BlogEL } from "../blog/blogpost.js";
import { HomeNavMenu } from "../navmenu.js";

const {button, div, pre, p} = van.tags

function BlogPage() {
  // van.derive(() => {
  //   console.log(getRouterQuery()); // { section: "profile" }
  // });

  return div(
    HomeNavMenu(),
    BlogEL(),
  );
}

export{
  BlogPage
}