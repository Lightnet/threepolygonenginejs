// node and bun js server test

// https://gist.github.com/elundmark/38d3596a883521cb24f5

/*
async function* nextFrame(fps) {
  let then = performance.now();
  const interval = 1000 / fps;
  let delta = 0;

  while (true) {
    let now = await new Promise(requestAnimationFrame);
    if (now - then < interval - delta) continue;
    delta = Math.min(interval, delta + now - then - interval);
    then = now;

    yield now;
  }
}

// I use it like this:
//for await (const time of nextFrame(30)) {//fps
  // ... render code
  //console.log("test?");
}
*/
// https://gist.github.com/raohmaru/af6c2f86b7214627f049ae1ba52981ba
const callbacks = [];
const fpsInterval = 1000 / 60;
let time = performance.now();

function requestAnimationFrameLoop() {
    const now = performance.now();
    const delta = now - time;
    console.log(delta)
    if (delta >= fpsInterval) {
        // Adjust next execution time in case this loop took longer to execute
        time = now - (delta % fpsInterval);
        //console.log(time)
        // Clone array in case callbacks pushes more functions to it
        const funcs = callbacks.slice();
        callbacks.length = 0;
        for (let i = 0; i < funcs.length; i++) {
            funcs[i] && funcs[i](now, delta);
        }
    } else {
        setImmediate(requestAnimationFrameLoop);
    }
}

function requestAnimationFrame(func) {
    callbacks.push(func);
    if (callbacks.length === 1) {
        setImmediate(requestAnimationFrameLoop);
    }
    return callbacks.length - 1;
}

function cancelAnimationFrame(id) {
    callbacks[id] = undefined;
}

var test = requestAnimationFrame(()=>{
  console.log("test");
})

function loopTest(){
  requestAnimationFrame(loopTest);
  console.log("test loop");
}

loopTest();