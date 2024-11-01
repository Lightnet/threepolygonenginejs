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

const getForumTopicEL = () => {

  return div(
    label("Topic...")
  )
}

function displayButtonCreateTopic(){

  const isCreated = van.state(false);

  function btnCreateTopic(){
    isCreated.val = false;
    van.add(document.body, Modal({closed:isCreated},
      createTopicForm({closed:isCreated})
    ));
  }

  return button({onclick:()=>btnCreateTopic()},"Create Topic");
}


function createTopicForm({closed}){

  const forumTitle = van.state('test');
  const forumContent = van.state('test');

  async function btnCreateTopic(){
    console.log("create Topic")
    try{
      const data = await useFetch('/api/topic',{
        method:'POST',
        body:JSON.stringify({
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

  return div({id:'createTopic'},
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
          button({onclick:btnCreateBoard},'Create'),
          button({onclick:()=>closed.val=true},'Cancel'),
        )
      )
    )
  )
}

export {
  displayButtonCreateTopic,
  getForumTopicEL,
  createTopicForm
}