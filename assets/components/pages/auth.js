
import van from "vanjs-core";
import { SignInEL } from "../auth/signin.js";
import { SignUpEL } from "../auth/signup.js";
import SignOutEL from "../auth/signout.js";

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

export {
  SignInPage,
  SignUpPage,
  SignOutPage,
}