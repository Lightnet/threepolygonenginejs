/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "van";
import { Modal } from "vanjs-ui";
import { Router, Link, getRouterParams, navigate } from "vanjs-routing";
import {forumIDState} from "/components/context.js";
import useFetch from "../../libs/useFetch.js";

const {button, input, label, div, span, script, pre, p, ul, li, a, table, tbody, tr,td} = van.tags;


const getForumsEL = () => {

  const forumList = div();

  function editForum(id){
    console.log(id)
  }

  function deleteForum(id){

  }

  function enterForum(id){
    console.log("Forum ID: ",id);
    forumIDState.val = id;
    navigate('/forum/'+id);
  }

  async function getForums(){
    try{
      const data = await useFetch('/api/forum');
      console.log(data);
      if(data){
        for(let i=0; i < data.length;i++){
          van.add(forumList,
            div(
              div({style:'',class:'cheader'},
                label(' [ Forum ] '),
                label(data[i].title),
                span({style:"float:right;"},
                  button({onclick:editForum(data[i].id)},'edit'),
                  button({onclick:editForum(data[i].id)},'Delete'),
                )
              ),
              div({style:'min-height:40px;', class:'ccontent',onclick:()=>enterForum(data[i].id)},
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

  getForums();

  return div(forumList);
}
//BUTTON MODAL
function displayButtonCreateForum(){

  const isCreated = van.state(false);

  function btnCreateForum(){
    isCreated.val = false;
    van.add(document.body, Modal({closed:isCreated},
      createForumForm({closed:isCreated})
    ));
  }

  return button({onclick:()=>btnCreateForum()},"Create Forum");
}
// CREATE FORUM
function createForumForm({closed}){

  const forumTitle = van.state('test');
  const forumContent = van.state('test');

  async function btnCreateForum(){
    console.log("create forum")
    try{
      const data = await useFetch('/api/forum',{
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

  return div({id:'createForum'},
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
          button({onclick:btnCreateForum},'Create'),
          button({onclick:()=>closed.val=true},'Cancel'),
        )
      )
    )
  )
}

export {
  displayButtonCreateForum,
  getForumsEL
}