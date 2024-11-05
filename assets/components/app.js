/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate } from "vanjs-routing";
import useFetch from "/libs/useFetch.js";

import {
  aliasState,
  loginState
} from "/components/context.js";

import { Page_Home } from "./pages/page_home.js";
import { Page_About } from "./pages/page_about.js";
import { HelpPage } from "./pages/page_help.js";
import { BlogPage } from "./pages/page_blog.js";

import { ForgotPage, SignInPage, SignOutPage, SignUpPage } from "./pages/page_auth.js";

import { AccountPage } from "./pages/page_account.js";
import { Page_Message } from "./messages/page_message.js";
import { Page_Setting } from "./pages/page_settings.js";
import { Page_Report } from "./pages/page_report.js";

import { Page_Game_Editor } from "./pages/page_game_editor.js";
import { Page_GameData, Page_GameData_Entities, Page_GameData_Projects, Page_GameData_Scenes, Page_GameData_Scripts } from "./game/pages_game.js";
import { Page_Topic, Page_Board, Page_Forum, Page_ForumID } from "./forum/pages_forum.js";
import { Page_Mapper_Editor } from "./mapper/page_mapper_editor.js";
import { Page_Novel } from "./novel/novel.js";


const {button, div, pre, p} = van.tags

//const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const App = () => {

  async function login_check(){
    let data = await useFetch('/api/auth/user');
    //console.log('DATA: ', data);
    if(data){
      if(data.api){
        if(data.api == 'PASS'){
          //console.log("[[ data.alias: ", data.alias)
          aliasState.val = data.alias
          loginState.val = true;
        }else{
          loginState.val = false;
        }
      }
    }
  }

  login_check();

  return Router({
    //basename: "/", // Optional base name (All links are now prefixed with '/vanjs-routing')
    routes: [
      { path: "/", component: Page_Home },
      { path: "/about", component: Page_About },
      { path: "/account", component: AccountPage },
      { path: "/signin", component: SignInPage },
      { path: "/signup", component: SignUpPage },
      { path: "/signout", component: SignOutPage },
      { path: "/forgot", component: ForgotPage },
      { path: "/settings", component: Page_Setting },

      { path: "/gamedata", component: Page_GameData },
      { path: "/gamedata/projects", component: Page_GameData_Projects },
      { path: "/gamedata/scenes", component: Page_GameData_Scenes },
      { path: "/gamedata/entities", component: Page_GameData_Entities },
      { path: "/gamedata/scripts", component: Page_GameData_Scripts },

      //{ path: "/gameobject/entity/:id", component: GameObjectPage },
      //{ path: "/gameobject/settings/:id", component: GameObjectPage },
      { path: "/editor", component: Page_Game_Editor },

      { path: "/message", component: Page_Message },

      { path: "/blog", component: BlogPage },

      { path: "/forum", component: Page_Forum },
      { path: "/forum/:id", component: Page_ForumID },
      { path: "/board/:id", component: Page_Board },
      { path: "/topic/:id", component: Page_Topic },

      { path: "/report", component: Page_Report },

      //{ path: "/help", component: HelpPage },
      //{ path: "/help/:section", component: HelpPage },

      { path: "/mapper", component: Page_Mapper_Editor },
      { path: "/novel", component: Page_Novel },
    ]
  });
}

// function BlankComponent() {
//   //return div(p("About"), Link({ href: "/" }, "Back to Home"));
//   return div(
//     label("Blank"), 
//     button({onclick:()=>navigate("/") }, "Home")
//   );
// }

// function HomeComponent() {
//   return div(
//     p("Home"), 
//     Link({ href: "/about?foo=bar" }, "Goto About"),
//     ' ',
//     Link({ href: "/help/profile" }, "Goto Help"),
//     ' ',
//     button({onclick:()=>navigate("/about?foo=bar")},'foo about'),
//     ' ',
//     button({onclick:()=>navigate("/help/profile")},'foo Help'),
//     ' ',
//   );
// }

// function AboutComponent() {
//   return div(p("About"), Link({ href: "/" }, "Back to Home"));
// }

// function HelpComponent() {
//   van.derive(() => {
//     console.log(getRouterParams()); // { section: "profile" }
//   });

//   return div(
//     p("Help"),
//     Link({ href: "/" }, "Back to Home"),
//     button({ onclick: () => navigate("/") }, "Back to Home (Imperative navigation)")
//   );
// }

//van.add(document.body, App())
export{
  App
}

export default App;