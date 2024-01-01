import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.2.1.min.js";

// https://github.com/vanjs-org/van/discussions/78
van._mount = function (target, component) {
	if (!!target) {
		van._mount.__ = van.state(true);
		van.add(target, () => {
			if (!van._mount.__.val) {
				return null;
			}
			return component();
		});
	} else {
		van._mount.__.val = false;
	}
};

const ufetch = async (url, options)=>{
  try {
    if(options?.method){
    }else{
      options.method='POST';
    }
    options.headers={
      'Content-Type':'application/json',
    };
    const resp = await fetch(url,options)
    const data = await resp.json();
    //console.log(data)
    return data;
  } catch (error) {
    console.log("error: ",error);
    return {api:"TryError"};
  }
}
// https://stackoverflow.com/questions/34863788/how-to-check-if-an-element-has-been-loaded-on-a-page-before-running-a-script
/**
 * Wait for an element before resolving a promise
 * @param {String} querySelector - Selector of element to wait for
 * @param {Integer} timeout - Milliseconds to wait before timing out, or 0 for no timeout              
 */
function waitForElement(querySelector, timeout){
  return new Promise((resolve, reject)=>{
    var timer = false;
    if(document.querySelectorAll(querySelector).length) return resolve();
    const observer = new MutationObserver(()=>{
      if(document.querySelectorAll(querySelector).length){
        observer.disconnect();
        if(timer !== false) clearTimeout(timer);
        return resolve();
      }
    });
    observer.observe(document.body, {
      childList: true, 
      subtree: true
    });
    if(timeout) timer = setTimeout(()=>{
      observer.disconnect();
      reject();
    }, timeout);
  });
}

export {
  ufetch,
  waitForElement,

}