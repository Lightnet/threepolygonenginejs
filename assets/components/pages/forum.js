/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate, getRouterQuery } from "vanjs-routing";
import { createForumEL, getForumsEL } from "../forum/forum.js";
import { Forum_NavMenu } from "../forum/forum_navmenu.js";

const { div } = van.tags

function ForumPage() {
  // van.derive(() => {
  //   console.log(getRouterQuery()); // { section: "profile" }
  // });

  return div(
    Forum_NavMenu(),
    div(
      createForumEL(),
      getForumsEL()
    )
    
  );
}

export{
  ForumPage
}