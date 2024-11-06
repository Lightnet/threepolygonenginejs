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
const {button, div, label, table, tbody, tr, td, input,textarea, span, br} = van.tags;

function GameDataNavMenus(){
  return div(
    button({onclick:()=>navigate('/gamedata')},'Home'),
    button({onclick:()=>navigate('/gamedata/projects')},'Projects'),
    button({onclick:()=>navigate('/gamedata/scenes')},'Scenes'),
    button({onclick:()=>navigate('/gamedata/entities')},'Entities'),
    button({onclick:()=>navigate('/gamedata/scripts')},'Scripts'),
  )
}

//===============================================
// MODAL
//===============================================

// UI BUTTON CREATE PROJECT
function El_CreateProjectForm(){
  const isCreated = van.state(false);
  function btnCreateForum(){
    isCreated.val = false;
    van.add(document.body, Modal({closed:isCreated},
      createProjectForm({closed:isCreated})
    ));
  }
  return button({onclick:()=>btnCreateForum()},"Create Project");
}

// CREATE PROJECT FORM
function createProjectForm({closed}){

  const _name = van.state('test');
  const content = van.state('');

  async function btnCreateProject(){
    console.log("create project form");
    try{
      const data = await useFetch('/api/project',{
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

  return div({id:'createProjectForm'},
    table(
      tbody(
        tr(
          td(label('Name:')),
          td(input({value:_name, oninput:e=>_name.val=e.target.value})),
        ),
        tr(
          td(label('Content:')),
          td(input({value:content, oninput:e=>content.val=e.target.value})),
        ),
        tr(
          button({onclick:btnCreateProject},'Create'),
          button({onclick:()=>closed.val=true},'Cancel'),
        )
      )
    )
  )
}

// PROJECT LIST
function El_ProjectList(){

  const Elprojects = div();
  const Elmodal = div();
  const projects = van.state([]);
  const currentID = van.state("");
  const projectName = van.state("");

  const isDeleteModal = van.state(false);

  function editID(_id){
    console.log("EDIT:", _id);
  }

  function deleteID(_id){
    currentID.val = _id;
    console.log("DELETE:", _id);
    for(const item of projects.val){
      if(item.id == _id){
        projectName.val = item.name;
      }
    }
    van.add(document.body, Modal({closed:isDeleteModal},
      DeletePostEL({closed:isDeleteModal})
    ));
  }

  async function queryDeleteID(){
    try {
      let data = await useFetch('/api/project/'+currentID.val,{
        method:'DELETE'
      });
      console.log("DELETE from url:", data);
      getProjects();

    } catch (error) {
      
    }
  }

  function DeletePostEL({closed}){

    function c_ConfirmDelete(){
      console.log("delete close");
      queryDeleteID();
      closed.val = true;
    }
    function c_ConfirmClose(){
      console.log("close");
      closed.val = true;
    }
    return div({},
      label('Confirm Delete Project:'),
      br(),
      label('Project ID:'+ currentID.val),
      br(),
      label('Project Name:'+ projectName.val),
      br(),
      button({onclick:()=>c_ConfirmDelete()},'Delete'),
      button({onclick:()=>c_ConfirmClose()},'Cancel'),
    );
  }

  function loadID(_id){
    console.log("Load:", _id);
  }

  async function getProjects(){
    try {
      Elprojects.innerHTML = '';
      let data = await useFetch('/api/project');
      console.log(data);
      if(data){
        projects.val = data;
        for(const item of data){
          console.log(item);
          van.add(Elprojects,div({style:"width:100%;"},
            label('[ ID: '+item.id+' ]'),
            label('[ Name: '+item.name+' ]'),
            label('[ Created: '+item.create_at+' ]'),
            span({style:""},
              button({onclick:()=>editID(item.id)},'Edit'),
              button({onclick:()=>loadID(item.id)},'Load'),
              button({onclick:()=>deleteID(item.id)},'Delete'),
            ),
          ))
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  getProjects();

  return div(
    Elprojects,
    Elmodal,
  )
}

//BUTTON ENTITY MODAL
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

//BUTTON SCRIPT MODAL
function El_CreateScriptForm(){
  const isCreated = van.state(false);
  function btnCreateForm(){
    isCreated.val = false;
    van.add(document.body, Modal({closed:isCreated},
      createScriptForm({closed:isCreated})
    ));
  }
  return button({onclick:()=>btnCreateForm()},"Create Script");
}

// CREATE SCRIPT FORM
function createScriptForm({closed}){
  const _name = van.state('test');
  const content = van.state('');
  async function btnCreateForum(){
    console.log("create entity form")
    try{
      const data = await useFetch('/api/script',{
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

  return div({id:'createScriptForm'},
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

function El_ScriptList(){

  const ElScripts = div();
  const Elmodal = div();
  const scripts = van.state([]);
  const currentID = van.state("");
  const scriptName = van.state("");

  function editID(_id){
    console.log("EDIT:", _id);
  }

  function deleteID(_id){
    currentID.val = _id;
    console.log("DELETE:", _id);
    for(const item of scripts.val){
      if(item.id == _id){
        scriptName.val = item.name;
      }
    }
    // van.add(document.body, Modal({closed:isDeleteModal},
    //   DeletePostEL({closed:isDeleteModal})
    // ));
  }

  function loadID(_id){
    console.log("Load:", _id);
  }

  async function getScripts(){
    try {
      ElScripts.innerHTML = '';
      let data = await useFetch('/api/script');
      console.log(data);
      if(data){
        scripts.val = data;
        for(const item of data){
          console.log(item);
          van.add(ElScripts,div({style:"width:100%;"},
            label('[ ID: '+item.id+' ]'),
            label('[ Name: '+item.name+' ]'),
            label('[ Created: '+item.create_at+' ]'),
            span({style:""},
              button({onclick:()=>editID(item.id)},'Edit'),
              button({onclick:()=>loadID(item.id)},'Load'),
              button({onclick:()=>deleteID(item.id)},'Delete'),
            ),
          ))
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  getScripts();

  return div(
    ElScripts,
    Elmodal,
  )
}

//BUTTON SCENE MODAL
function El_CreateSceneForm(){
  const isCreated = van.state(false);
  function btnCreateForm(){
    isCreated.val = false;
    van.add(document.body, Modal({closed:isCreated},
      createSceneForm({closed:isCreated})
    ));
  }
  return button({onclick:()=>btnCreateForm()},"Create Scene");
}

// CREATE SCRIPT FORM
function createSceneForm({closed}){
  const _name = van.state('test');
  const content = van.state('');
  async function btnCreateForum(){
    console.log("create scene form")
    try{
      const data = await useFetch('/api/scene',{
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

  return div({id:'createSceneForm'},
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
  El_CreateProjectForm,
  El_CreateScriptForm,
  El_CreateSceneForm,

  El_ProjectList,
  El_ScriptList,
}