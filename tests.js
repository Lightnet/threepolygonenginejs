//import { nanoid } from "nanoid";
// import { customAlphabet  } from 'nanoid/non-secure';

// const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 16)

// Generate a Nano ID
// const id = nanoid();
// console.log(`Nano ID: ${id}`);

//4lxDbSoyQM5XZY5UaORQi
//abcdefghijklmnopqrstuvwxyz
//

// https://stackoverflow.com/questions/17201450/salt-and-hash-password-in-nodejs-w-crypto
// https://medium.com/@codingsprint/how-to-hash-a-password-in-nodejs-using-crypto-package-c4deed66f814

import crypto from "crypto";
console.log(crypto);
let password= "test";
var salt = crypto.randomBytes(128).toString('base64');
var iterations = 10000;
console.log("salt: ",salt)

const genHash = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha512').toString('hex')
console.log("genHash: ",genHash)

let password1= "test";

//const result = crypto.compareSync(password1, genHash);
//console.log("result: ", result)

// const genHash1 = crypto.pbkdf2Sync(password1, salt, iterations, 64, 'sha512').toString('hex')
// if(genHash == genHash1){
//   console.log("PASS")
// }else{
//   console.log("FAIL")
// }

