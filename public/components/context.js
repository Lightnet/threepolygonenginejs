/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

/*
  Informtion: Context
*/

//import van from 'van';
import van from "vanjs-core";
import { MessageBoard } from 'vanjs-ui';

const board = new MessageBoard({top: "20px"});
const loginState = van.state(false);
const aliasState = van.state('Guest');
const aliasDataState = van.state({});
const tokenState = van.state({});

const forumIDState = van.state("");
const boardIDState = van.state("");
const topicIDState = van.state("");
const commentIDState = van.state("");

export {
  board,
  loginState,
  aliasState,
  aliasDataState,
  tokenState,
  forumIDState,
  boardIDState,
  topicIDState,
  commentIDState
}