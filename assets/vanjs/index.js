// https://stackoverflow.com/questions/12446317/change-url-without-redirecting-using-javascript

import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.2.1.min.js";
const {button, input, label, div, script, pre, p, ul, li, a} = van.tags;

import appState from "./context.js";
import HomeEl from "./home.js";
import AboutEl from "./about.js";
import { BlogEL } from "./blog.js";
import { AccountEL } from "./account.js";
import { MessageEL } from "./message.js";
import { ForumPageEL } from "./forum.js";
import { GameEL } from "./game.js";
import { SettingsEL } from "./settings.js";
import { LoginEL, SignUpEL } from "./auth.js";

const AppEL = ()=>{
  //console.log('init app');
  const view = van.state('home');
  van.derive(()=>{
    console.log(appState.alias.val);
  })
  return div({id:'app'},
    div(
      button({onclick:()=>view.val='home'},'home'),
      button({onclick:()=>view.val='about'},'about')
    ),
    van.derive(()=>{
      if(view.val =='home'){
        return HomeEl();
      }
      if(view.val =='about'){
        return AboutEl();
      }
    })
  )
}
//van.add(document.body, AppEL())
const NoneEL = () => {
  return div({id:'none'},
  label('None')
  )
}

const IndexEL = () => {
  //const view = van.state('home');
  const view = van.state('forum');
  //const content = div({id:'content'});

  const content = van.derive(()=>{
    if(view.val=='home'){
      return HomeEl();
    }
    if(view.val=='login'){
      return LoginEL();
    }
    if(view.val=='signup'){
      return SignUpEL();
    }
    if(view.val=='blog'){
      return BlogEL();
    }
    if(view.val=='account'){
      return AccountEL();
    }
    if(view.val=='message'){
      return MessageEL();
    }
    if(view.val=='forum'){
      return ForumPageEL();
    }
    if(view.val=='game'){
      return GameEL();
    }
    if(view.val=='settings'){
      return SettingsEL();
    }
    return NoneEL();
  })

  function click_view(_view){
    view.val = _view
  }

  return div({id:'index'},
    div(
      button({onclick:()=>click_view('home')},'Home'),
      button({onclick:()=>click_view('login')},'Login'),
      button({onclick:()=>click_view('signup')},'Sign Up'),
      button({onclick:()=>click_view('blog')},'Blog'),
      button({onclick:()=>view.val='account'},'Account'),
      button({onclick:()=>view.val='message'},'Message'),
      button({onclick:()=>view.val='forum'},'Forum'),
      button({onclick:()=>view.val='game'},'Game'),
      button({onclick:()=>view.val='settings'},'Settings'),
    ),
    content,
  )
};

export{
  IndexEL,
}












