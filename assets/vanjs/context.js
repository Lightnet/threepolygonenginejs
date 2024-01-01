/*
  for context for like react, preact, solid for context 

   Notes:
   need to use van.state() that update changes since js not jsx
*/
// https://stackoverflow.com/questions/12446317/change-url-without-redirecting-using-javascript
// https://developer.mozilla.org/en-US/docs/Web/API/History_API
// window.history.pushState(data, title, url);
// window.history.replaceState(data, title, url);
import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.2.1.min.js";
const {button, input, label, div, script, pre, p, ul, li, a} = van.tags;



const appState = {
  alias: van.state('Guest'),
  aliasId: van.state(''),
}
export default appState;



