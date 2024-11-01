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

import {
  aliasState,
  loginState,
  boardIDState
} from "/components/context.js";


const { div, label } = van.tags;

// DEFAULT GET PULBIC FORUMS
function Page_Forum() {

  return div({id:'FORUM'},
    Forum_NavMenu(),
    div(
      displayButtonCreateForum(),
      getForumsEL()
    )
  );
}

// GET CURRENT FORUM ID
function Page_ForumID() {
  
  const forumID = van.state("");
  const boardEl = div({id:"BOARDS"});

  function getBoardID(_id){
    boardIDState.val = _id;
    navigate('/board/'+_id);
  }

  async function getForumIDBoards(_id){
    try{
      const data = await useFetch('/api/forum/'+_id);
      console.log("get FORUM Boards:", data);
      if(data){
        //van.add(
        for(let item of data){
          console.log("item: ", item);
          van.add(boardEl, div(
            div(label("[Board] [ Title ] "+ item.title),),
            div(label({onclick:()=>getBoardID(item.id)}," [ Content ] "+ item.content),)
            
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
    }
  });

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