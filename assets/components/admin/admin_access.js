/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/
import { 
  THREE, 
  ECS,
  // van 
} from "/dps.js";
import van from "vanjs-core";

const {button, div, pre, p, label} = van.tags;

function AdminPage(){

  return div({id:"admin"},
    div(
      button('Home'),
      button('Logs'),
      button('Accounts'),
      button('Tickets'),
      button('Reports'),
      button('Database'),
      button('Settings'),
    ),
    div(
      ButtonMaintenanceMode()
    ),
  )
}


function Page_Logs(){
  return div(
    
  )
}

function Page_Accounts(){
  return div(
    
  )
}

function Page_Reports(){
  return div(
    
  )
}

function Page_Tickets(){
  return div(
    
  )
}

function Page_Database(){
  return div(
    
  )
}

function Page_Settings(){
  return div(
    
  )
}

function ButtonMaintenanceMode(){

  function btn_Maintenance_on(){
    console.log("click...")
  }

  function btn_Maintenance_off(){
    console.log("click...")
  }

  return label('Maintenance Mode', 
    button({onclick:btn_Maintenance_on},'On'),
    button({onclick:btn_Maintenance_off},'Off')
  )
  
}

export {
  AdminPage,
  ButtonMaintenanceMode
}