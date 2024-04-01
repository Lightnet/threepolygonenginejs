/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

import van from "vanjs-core";
import { SignInEL } from "../auth/signin.js";
import { SignUpEL } from "../auth/signup.js";
import SignOutEL from "../auth/signout.js";
import { ForgotEL } from "../auth/forgot.js";

const { div } = van.tags;

function SignInPage(){
  return div(
    SignInEL()
  );
}

function SignUpPage(){
  return div(
    SignUpEL()
  )
}

function SignOutPage(){
  return div(
    SignOutEL()
  )
}

function ForgotPage(){
  return div(
    ForgotEL()
  )
}

export {
  SignInPage,
  SignUpPage,
  SignOutPage,
  ForgotPage,
}