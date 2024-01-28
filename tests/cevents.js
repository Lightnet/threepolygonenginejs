

const ceven = new EventTarget();


ceven.addEventListener("valuechange", (event) => {
  console.log("change", event);
  console.log(event.detail);
});

function eventTrigger(){
  ceven.dispatchEvent(new CustomEvent("valuechange", { detail: 'test' }));
}

eventTrigger();
eventTrigger();