/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate, getRouterQuery } from "vanjs-routing";
import { Forum_NavMenu } from "../forum/forum_navmenu.js";
import useFetch from "/libs/useFetch.js";
import { displayButtonCreateTopic } from "../forum/forum_topic.js";
import { aliasState, loginState, boardIDState } from "/components/context.js";

const { div, label } = van.tags;

function PageBoard() {

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

export{
  PageBoard
}