/*
  Project Name: threepolygonenginejs
  License: MIT
  Created By: Lightnet
  GitHub: https://github.com/Lightnet/threepolygonenginejs
  
*/

/*
  Informtion: Context
*/

import van from 'van';
import { MessageBoard } from 'vanjs-ui';

const board = new MessageBoard({top: "20px"});
const loginState = van.state(false);
const aliasState = van.state('Guest');
const aliasDataState = van.state({});
const tokenState = van.state({});

export{
  board,
  loginState,
  aliasState,
  aliasDataState,
  tokenState,
}