/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/
import { 
  THREE, 
  ECS,
  van 
} from "/dps.js";
//import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate } from "vanjs-routing";

const {button, div, pre, p, label} = van.tags;

// function AdminPage(){
//   return div({id:"admin"},
//     div(
//       button('Home'),
//       button('Logs'),
//       button('Accounts'),
//       button('Tickets'),
//       button('Reports'),
//       button('Database'),
//       button('Settings'),
//     ),
//     div(
//       ButtonMaintenanceMode()
//     ),
//   )
// }

function AdminNavMenus(){


  return div({id:"admin"},
    div(
      button({onclick:()=>navigate('/admin')},'Home'),
      button({onclick:()=>navigate('/admin/logs')},'Logs'),
      button({onclick:()=>navigate('/admin/accounts')},'Accounts'),
      button({onclick:()=>navigate('/admin/tickets')},'Tickets'),
      button({onclick:()=>navigate('/admin/reports')},'Reports'),
      button({onclick:()=>navigate('/admin/database')},'Database'),
      button({onclick:()=>navigate('/admin/settings')},'Settings'),
    )
  )
}

function Page_Admin(){
  return div(
    AdminNavMenus(),
    div(
      ButtonMaintenanceMode()
    ),
  )
}


function Page_Logs(){
  return div(
    AdminNavMenus(),
    div(
      label('Logs')
    ),
  )
}

function Page_Accounts(){
  return div(
    AdminNavMenus(),
    div(
      label('Accounts')
    ),
  )
}

function Page_Reports(){
  return div(
    AdminNavMenus(),
    div(
      label('Report')
    ),
  )
}

function Page_Tickets(){
  return div(
    AdminNavMenus(),
    div(
      label('Tickets')
    ),
  )
}

function Page_Database(){
  return div(
    AdminNavMenus(),
    div(
      label('Database')
    ),
  )
}

function Page_Settings(){
  return div(
    AdminNavMenus(),
    div(
      label('Settings')
    ),
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
  Page_Admin,
  Page_Logs,
  Page_Accounts,
  Page_Tickets,
  Page_Reports,
  Page_Database,
  Page_Settings,
}