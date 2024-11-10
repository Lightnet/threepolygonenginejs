/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
import { Modal } from "vanjs-ui";
import {useFetch} from "/libs/useFetch.js";

const {button, input, label, div, span, script, pre, p, ul, li, a, table, tbody, tr,td} = van.tags;

import {
  //aliasState,
  //loginState,
  //forumIDState,
  //boardIDState,
  topicIDState,
} from "/components/context.js";

function displayButtonCreateComment(){

  const isCreated = van.state(false);

  function btnCreateTopic(){
    isCreated.val = false;
    van.add(document.body, Modal({closed:isCreated},
      createCommentForm({closed:isCreated})
    ));
  }

  return button({onclick:()=>btnCreateTopic()},"Create Comment");
}

function createCommentForm({closed}){

  const forumTitle = van.state('test');
  const forumContent = van.state('test');

  async function btnCreateTopic(){
    console.log("create Topic")
    try{
      const data = await useFetch('/api/comment',{
        method:'POST',
        body:JSON.stringify({
          parentid:topicIDState.val,
          title:forumTitle.val,
          content:forumContent.val,
        })
      });
      console.log(data);
      if(closed){
        closed.val = true;
      }
    }catch(e){
      console.log("ERROR",e)
    }
  }

  return div({id:'createComment'},
    table(
      tbody(
        tr(
          td(label('Title:')),
          td(input({value:forumTitle, oninput:e=>forumTitle.val=e.target.value})),
        ),
        tr(
          td(label('Content:')),
          td(input({value:forumContent, oninput:e=>forumContent.val=e.target.value})),
        ),
        tr(
          button({onclick:btnCreateTopic},'Create'),
          button({onclick:()=>closed.val=true},'Cancel'),
        )
      )
    )
  )
}

export {
  createCommentForm,
  displayButtonCreateComment,
}