/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate, getRouterQuery } from "vanjs-routing";
import { Forum_NavMenu } from "../forum/forum_navmenu.js";
import { displayButtonCreateBoard, getForumBoardEL } from "../forum/forum_board.js";

const { div } = van.tags;

function PageBoard() {
  van.derive(() => {
    console.log("[BOARD] FORUM ID:>> ",getRouterQuery()); // { section: "profile" }
    console.log("getRouterParams >> ",getRouterParams()); 
  });

  return div(
    Forum_NavMenu(),
    div(
      displayButtonCreateBoard(),
      getForumBoardEL()
    )
  )
}

export{
  PageBoard
}