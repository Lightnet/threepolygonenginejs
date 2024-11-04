/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
import { Modal } from "vanjs-ui";
import {useFetch} from "/libs/useFetch.js";
import { aliasState, forumIDState } from "/components/context.js";

const {button, input, label, div, span, script, table, tbody, tr,td} = van.tags;

function displayButtonCreateBoard(){

  const isCreated = van.state(false);

  function btnCreateBoard(){
    isCreated.val = false;
    van.add(document.body, Modal({closed:isCreated},
      createBoardForm({closed:isCreated})
    ));
  }

  return button({onclick:()=>btnCreateBoard()},"Create Board");
}

function createBoardForm({closed}){

  const forumTitle = van.state('test');
  const forumContent = van.state('test');

  async function btnCreateBoard(){
    console.log("create board")
    try{
      const data = await useFetch('/api/board',{
        method:'POST',
        body:JSON.stringify({
          parentid:forumIDState.val,
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

  return div({id:'createBoard'},
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
  displayButtonCreateBoard,
  createBoardForm
}