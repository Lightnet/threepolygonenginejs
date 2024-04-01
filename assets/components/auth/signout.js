

import van from "vanjs-core";
import { Router, Link, getRouterParams, navigate } from "vanjs-routing";
const {button, input, label, div, table, tbody, tr, td} = van.tags;

const SignOutEL = () => {

  return div(
    label("Are you Sure to Logout?"),
    button("Yes"),
    button({onclick:()=>navigate("/")},"No"),
  );
}

export {
  SignOutEL
}

export default SignOutEL;