/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate, getRouterQuery } from "vanjs-routing";
import { displayButtonCreateForum, getForumsEL } from "./forum.js";
import { Forum_NavMenu } from "./forum_navmenu.js";

import useFetch from "/libs/useFetch.js";
import { aliasState, boardIDState, topicIDState, commentIDState } from "/components/context.js";

import { displayButtonCreateComment } from "./forum_comment.js";
import { displayButtonCreateBoard } from "./forum_board.js";
import { displayButtonCreateTopic } from "./forum_topic.js";

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

// GET CURRENT FORUM ID for boards
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
            div({style:'',class:"cheader"},label("[Board] [ Title ] "+ item.title),),
            div({style:'min-height:40px;',class:"ccontent",onclick:()=>getBoardID(item.id)},label(" [ Content ] "+ item.content),)
            
          ));
        }
      }
    }catch(e){
      console.log("ERROR",e)
    }
  }

  //get forums
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
    )
  ); 
}

// PAGE BOARD
function Page_Board() {

  const topicEl = div('TOPICS');

  van.derive(() => {
    //console.log("getRouterParams >> ",getRouterParams()); 
    const { id } = getRouterParams();
    if(id){
      boardIDState.val = id;
      getBoardIDTopics(id);
    }
  });

  function getBoardID(_id){
    boardIDState.val = _id;
    navigate('/topic/'+_id);
  }

  async function getBoardIDTopics(_id){
    try{
      const data = await useFetch('/api/board/'+_id);
      console.log(data);
      if(data){
        for(let item of data){
          console.log("item: ", item);
          van.add(topicEl, div(
            div({style:'',class:"cheader"},label("[Board] [ Title ] "+ item.title),),
            div({style:'min-height:40px;',class:"ccontent",onclick:()=>getBoardID(item.id)},label(" [ Content ] "+ item.content),)
          ));
        }
      }
    }catch(e){
      console.log(e);
    }
  }

  return div(
    Forum_NavMenu(),
    div(
      displayButtonCreateTopic(),
      topicEl
    )
  )
}

// PAGE TOPIC
function Page_Topic() {
  const topicEl = div();

  van.derive(() => {
    console.log("Page_Topic getRouterParams >> ",getRouterParams()); 
    const { id } = getRouterParams();

    if(id){
      topicIDState.val = id;
      getTopicIDComments(id);
    }
  });

  function getCommentID(_id){
    commentIDState.val = _id;
    //navigate('/comment/'+_id);
  }

  async function getTopicIDComments(_id){
    try{
      //const data = await useFetch('/api/board/'+_id);
      const data = await useFetch('/api/topic/'+_id);
      console.log(data);
      if(data){
        for(let item of data){
          console.log("item: ", item);
          van.add(topicEl, div(
            div({style:'',class:"cheader"},label("[Comment] [ Title ] "+ item.title),),
            div({style:'min-height:40px;',class:"ccontent",onclick:()=>getCommentID(item.id)},label(" [ Content ] "+ item.content),)
          ));
        }
      }
    }catch(e){
      console.log(e);
    }
  }

  return div(
    Forum_NavMenu(),
    div(
      displayButtonCreateComment(),
      topicEl
    )
  )
}

// PAGE COMMENT
function Page_Comment() {
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
  Page_Forum,
  Page_ForumID,
  Page_Board,
  Page_Topic,
  Page_Comment,
}