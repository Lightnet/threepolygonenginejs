/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate } from "vanjs-routing";
import { useFetch } from "/libs/useFetch.js";
import { 
  aliasState,
  loginState
} from "/components/context.js";
const {button, input, label, div, table, tbody, tr, td,center} = van.tags;

const SignOutEL = () => {

  async function b_signout(){
    let data = await useFetch('/api/auth/signout',{
      method:'POST',
      body:JSON.stringify({api:'LOGOUT'})
    });
    console.log(data);
    if(data?.api == 'PASS'){
      console.log("OKAY");
      aliasState.val = 'Guest';
      loginState.val = false;
      navigate('/');
    }
  }

  return div(
    center(
      table(
        tbody(
          tr(
            td(
              center(label("[ ACCESS ]"))
            )
          ),
          tr(
            td(
              label("Are you sure to Logout?"),
            )
          ),
          tr(
            td({},
              button({style:"width:100%;",onclick:b_signout},"Yes"),
            )
          ),
          tr(
            td({},
              button({style:"width:100%;",onclick:()=>navigate("/")},"No"),
            )
          ),
        )
      )
    )
  );
}

export {
  SignOutEL
}

export default SignOutEL;