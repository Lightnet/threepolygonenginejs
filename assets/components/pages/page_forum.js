/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate, getRouterQuery } from "vanjs-routing";
import { displayButtonCreateForum, getForumsEL } from "../forum/forum.js";
import { Forum_NavMenu } from "../forum/forum_navmenu.js";
import { displayButtonCreateBoard } from "../forum/forum_board.js";
import useFetch from "../../libs/useFetch.js";

const { div, label } = van.tags;

function Page_Forum() {

  return div({id:'FORUM'},
    Forum_NavMenu(),
    div(
      displayButtonCreateForum(),
      getForumsEL()
    )
  );
}

function Page_ForumID() {
  
  const forumID = van.state("");
  const boardEl = div({id:"BOARDS"});

  async function getForumIDBoards(_id){
    try{
      const data = await useFetch('/api/forum/'+_id);
      console.log("get FORUM Boards:", data);
      if(data){
        //van.add(
        for(let item of data){
          console.log("item: ", item);
          van.add(boardEl, div(
            div(label(" [ Title ] "+ item.title),),
            div(label(" [ Content ] "+ item.content),)
            
          ));
        }
      }
    }catch(e){
      console.log("ERROR",e)
    }
  }

  van.derive(() => {
    const { id } = getRouterParams();
    if(id){
      //getBoards(id)
      console.log("FORUM ID: ", id);
      if(id.length > 0){
        forumID.val = id;
        getForumIDBoards(id);
      }
    }else{
    }
  });


  //const render_forum = van.derive(()=>{
  return div({id:'BOARD'},
    Forum_NavMenu(),
    div(
      displayButtonCreateBoard(),
      boardEl
      //getForumsEL()
    )
  ); 
}

export{
  Page_Forum,
  Page_ForumID
}