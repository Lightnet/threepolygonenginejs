/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import { van } from "/dps.js";
import { Modal } from "vanjs-ui";
import useFetch from "/libs/useFetch.js";
import { Router, Link, getRouterParams, navigate, getRouterQuery } from "vanjs-routing";
const {button, div, label, table, tbody, tr, td, input,textarea} = van.tags;

function GameDataNavMenus(){
  return div(
    button({onclick:()=>navigate('/gamedata')},'Home'),
    button({onclick:()=>navigate('/gamedata/entities')},'Entities'),
    button({onclick:()=>navigate('/gamedata/scenes')},'Scenes'),
    button({onclick:()=>navigate('/gamedata/projects')},'Projects'),
    button({onclick:()=>navigate('/gamedata/scripts')},'Scripts'),
  )
}

//===============================================
// MODAL
//===============================================

//BUTTON MODAL
function El_CreateEntityForm(){

  const isCreated = van.state(false);

  function btnCreateForum(){
    isCreated.val = false;
    van.add(document.body, Modal({closed:isCreated},
      createEntityForm({closed:isCreated})
    ));
  }

  return button({onclick:()=>btnCreateForum()},"Create Entity");
}

// CREATE ENTITY FORM
function createEntityForm({closed}){

  const _name = van.state('test');
  const content = van.state(JSON.stringify({
    "id":"0000",
    "position":{
      "x":"0",
      "y":"0",
      "z":"0"
    }
  }));

  async function btnCreateForum(){
    console.log("create entity form")
    try{
      const data = await useFetch('/api/entity',{
        method:'POST',
        body:JSON.stringify({
          name:_name.val,
          content:content.val,
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
          td(label('Name:')),
          td(input({value:_name, oninput:e=>_name.val=e.target.value})),
        ),
        tr(
          td(label('Content:')),
          td(textarea({style:"width:100%;height:200px;",value:content, oninput:e=>content.val=e.target.value})),
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
  GameDataNavMenus,
  El_CreateEntityForm,

}