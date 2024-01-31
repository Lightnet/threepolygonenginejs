//testing

import { TriECSEngine } from "./triengine/triecsengine.js";

class TriECS_Sample extends TriECSEngine {
  constructor(args={}){
    super(args);
  }
}

const app = new TriECS_Sample();
app.run();