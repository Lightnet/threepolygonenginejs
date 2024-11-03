/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate, getRouterQuery } from "vanjs-routing";
import { Forum_NavMenu } from "../forum/forum_navmenu.js";
//import {  } from "../forum/forum_board.js";
import useFetch from "/libs/useFetch.js";
import { aliasState, loginState, boardIDState, topicIDState, commentIDState } from "/components/context.js";
import { createCommentForm, displayButtonCreateComment } from "../forum/forum_comment.js";

const { div, label } = van.tags;

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

export{
  Page_Topic
}