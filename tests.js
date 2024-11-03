//import { nanoid } from "nanoid";
import { customAlphabet  } from 'nanoid/non-secure';

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 16)

// Generate a Nano ID
const id = nanoid();
console.log(`Nano ID: ${id}`);

//4lxDbSoyQM5XZY5UaORQi
//abcdefghijklmnopqrstuvwxyz
//

