/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import { THREE, ECS, van } from "/dps.js";
import { ToggleTheme } from "../theme/theme.js";
//import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate } from "vanjs-routing";
import useFetch from '/libs/useFetch.js';
import { El_CreateReportForm } from "../report/report.js";
const {button, div, span, label} = van.tags;


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
      ToggleTheme(),
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

  const elReports = div();

  function c_IsDone(){

  }

  function c_IsClose(){
    
  }

  function isBool(_is){
    return _is ? 'True' : 'False';
  }

  async function get_reports() {
    let data = await useFetch('/api/report');
    console.log(data);
    if(data){
      for(const item of data){
        console.log(item);
        van.add(elReports,
          div(
            div({style:"background:darkgray;"},
              label(item.title),
              span({style:'float:right;'},
                button({onclick:()=>c_IsDone(item.id)},`Done: ${isBool(item.isdone)}`),
                button({onclick:()=>c_IsClose(item.id )},`Close: ${isBool(item.isclose)}`),
              ),
            ),
            //br(),
            div({style:"background:lightgray;"},item.content),
          )
        );
      }
    }
  }

  get_reports();


  return div(
    AdminNavMenus(),
    div(
      label('Report'),
      El_CreateReportForm(),
      elReports,
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