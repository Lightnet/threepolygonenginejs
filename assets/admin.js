/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/
import { THREE, ECS, van } from "/dps.js";
import { Page_Admin, Page_Logs, Page_Accounts, Page_Tickets, Page_Reports, Page_Database, Page_Settings } from "/components/admin/admin_access.js";
import { Router, Link, getRouterParams, navigate } from "vanjs-routing";
import useFetch from "../libs/useFetch.js";

const {button, div, pre, p} = van.tags;


const PageAdmin = () => {
  return Router({
    routes: [
      { path: "/admin", component:  Page_Admin},
      { path: "/admin/logs", component:  Page_Logs},
      { path: "/admin/accounts", component:  Page_Accounts},
      { path: "/admin/tickets", component:  Page_Tickets},
      { path: "/admin/reports", component:  Page_Reports},
      { path: "/admin/database", component:  Page_Database},
      { path: "/admin/settings", component:  Page_Settings},
      
    ]
  })
}

van.add(document.body, PageAdmin())

//van.add(document.body, AdminPage())
//console.log("ADMIN");