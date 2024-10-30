/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate } from "vanjs-routing";

import { AboutComponent } from "./pages/about.js";
import { HelpPage } from "./pages/help.js";
import { HomeComponent } from "./pages/home.js";
import { GamePage } from "./pages/game.js";
import { GameEditorPage } from "./pages/gameeditor.js";
import { GameObjectPage } from "./pages/gameobject.js";
import { ForgotPage, SignInPage, SignOutPage, SignUpPage } from "./pages/auth.js";
import { MessagePage } from "./pages/message.js";
import { BlogPage } from "./pages/blog.js";
import { ForumPage } from "./pages/forum.js";
import { AccountPage } from "./pages/account.js";
import { SettingPage } from "./pages/settings.js";
import useFetch from "../libs/useFetch.js";
import {
  aliasState,
  loginState
} from "/components/context.js";
//import van from 'van';

const {button, div, pre, p} = van.tags

//const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const App = () => {

  async function login_check(){
    let data = await useFetch('/api/auth/user');
    console.log('DATA: ', data);
    if(data){
      if(data.api){
        if(data.api == 'PASS'){
          console.log("[[ data.alias: ", data.alias)
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
      { path: "/", component: HomeComponent },
      { path: "/about", component: AboutComponent },
      { path: "/account", component: AccountPage },
      { path: "/signin", component: SignInPage },
      { path: "/signup", component: SignUpPage },
      { path: "/signout", component: SignOutPage },
      { path: "/forgot", component: ForgotPage },
      { path: "/settings", component: SettingPage },


      { path: "/game", component: GamePage },
      { path: "/gameobject", component: GameObjectPage },
      { path: "/gameobject/entity/:id", component: GameObjectPage },
      { path: "/gameobject/settings/:id", component: GameObjectPage },
      { path: "/editor", component: GameEditorPage },

      { path: "/message", component: MessagePage },

      { path: "/blog", component: BlogPage },
      { path: "/forum", component: ForumPage },

      { path: "/help", component: HelpPage },
      { path: "/help/:section", component: HelpPage },
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