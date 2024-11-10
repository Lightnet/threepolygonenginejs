/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/
import van from "vanjs-core";
import { Modal } from "vanjs-ui";
import { HomeNavMenu } from "../navmenu.js";
import useFetch from "/libs/useFetch.js";

const {button, div, label, table, tbody, tr, td, input, textarea} = van.tags;

function Page_Message(){
  return div({id:'message'},
    HomeNavMenu(),
    label('Message'),
    El_CreateMessageForm()
  )
}

//BUTTON MODAL
function El_CreateMessageForm(){

  const isCreated = van.state(false);

  function btnMessageForm(){
    isCreated.val = false;
    van.add(document.body, Modal({closed:isCreated},
      createMessageForm({closed:isCreated})
    ));
  }

  return button({onclick:()=>btnMessageForm()},"Create Message");
}

// CREATE REPORT FORUM
function createMessageForm({closed}){

  const toAlias = van.state('test');
  const subject = van.state('test subject');
  const content = van.state('test content');

  async function btnCreateForum(){
    console.log("create report form")
    try{
      const data = await useFetch('/api/message',{
        method:'POST',
        body:JSON.stringify({
          alias: toAlias.val,
          subject: subject.val,
          content: content.val,
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

  return div({id:'createReportForm'},
    table(
      tbody(
        tr(
          td(label('To Alias:')),
          td(input({value:toAlias, oninput:e=>toAlias.val=e.target.value})),
        ),
        tr(
          td(label('Subject:')),
          td(input({value:subject, oninput:e=>subject.val=e.target.value})),
        ),
        tr(
          td({colspan:"2"},label('Content:')),
        ),
        tr(
          td({colspan:"2"},textarea({style:"width:100%; height:200px;",value:content, oninput:e=>content.val=e.target.value})),
        ),
        tr(
          button({onclick:btnCreateForum},'Send'),
          button({onclick:()=>closed.val=true},'Cancel'),
        )
      )
    )
  )
}


export {
  Page_Message,
  El_CreateMessageForm,
}