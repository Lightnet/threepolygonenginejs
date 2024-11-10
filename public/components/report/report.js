/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import { van } from "/dps.js";
import { Modal } from "vanjs-ui";
import useFetch from "/libs/useFetch.js";
const {button, div, label, table, tbody, tr, td, input} = van.tags;


//BUTTON MODAL
function El_CreateReportForm(){

  const isCreated = van.state(false);

  function btnCreateForum(){
    isCreated.val = false;
    van.add(document.body, Modal({closed:isCreated},
      createReportForm({closed:isCreated})
    ));
  }

  return button({onclick:()=>btnCreateForum()},"Create Report");
}

// CREATE REPORT FORUM
function createReportForm({closed}){

  const forumTitle = van.state('test');
  const forumContent = van.state('test');

  async function btnCreateForum(){
    console.log("create report form")
    try{
      const data = await useFetch('/api/report',{
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

  return div({id:'createReportForm'},
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
  El_CreateReportForm
}