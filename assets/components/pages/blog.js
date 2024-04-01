/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate, getRouterQuery } from "vanjs-routing";
import { Blog_NavMenu } from "../blog/blog_navmenu.js";
import { BlogEL } from "../blog/blogpost.js";

const {button, div, pre, p} = van.tags

function BlogPage() {
  // van.derive(() => {
  //   console.log(getRouterQuery()); // { section: "profile" }
  // });

  return div(
    Blog_NavMenu(),
    BlogEL(),
  );
}

export{
  BlogPage
}