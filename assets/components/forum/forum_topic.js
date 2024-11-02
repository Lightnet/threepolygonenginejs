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
  aliasState,
  loginState,
  forumIDState,
  boardIDState,
} from "/components/context.js";

const getForumTopicEL = () => {

  return div(
    label("Topic...")
  )
}

//BOARD ID get topics
const getBoardIDTopicsEl = (_id) => {

  async function getForums(){
    try{
      const data = await useFetch('/api/forum');
      console.log(data);
      if(data){
        for(let i=0; i < data.length;i++){
          van.add(forumList,
            div(
              div({style:'background-color:#66a3ff;'},
                label(' [ Forum ] '),
                label(data[i].title),
                span({style:"float:right;"},
                  button({onclick:editForum(data[i].id)},'edit'),
                  button({onclick:editForum(data[i].id)},'Delete'),
                )
              ),
              div({style:'background-color:lightblue;height:40px;',onclick:()=>enterForum(data[i].id)},
                data[i].content
              ),
            )
          );
        }
      }
    }catch(e){
      console.log(e);
    }
  }

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
          parentid:boardIDState.val,
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
          button({onclick:btnCreateTopic},'Create'),
          button({onclick:()=>closed.val=true},'Cancel'),
        )
      )
    )
  )
}

export {
  displayButtonCreateTopic,
  getForumTopicEL,
  createTopicForm,
  getBoardIDTopicsEl
}