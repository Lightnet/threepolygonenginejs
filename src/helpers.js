// https://stackoverflow.com/questions/24597634/how-to-generate-an-array-of-the-alphabet
//import { nanoid } from 'nanoid/non-secure';
//import { customAlphabet  } from 'nanoid/non-secure';
import { customAlphabet  } from 'nanoid';
import crypto from "crypto";
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 16);

function hashPassword(_password){
  let iterations = 10000;
  let salt = crypto.randomBytes(128).toString('base64');
  const hash = crypto.pbkdf2Sync(_password, salt, iterations, 64, 'sha512').toString('hex');
  return {salt,hash}
}

function compareHashPassword(_password,_hash,_salt){
  let iterations = 10000;
  const hash = crypto.pbkdf2Sync(_password, _salt, iterations, 64, 'sha512').toString('hex');
  //return hash;
  return _hash == hash;
}

export {
  nanoid,
  hashPassword,
  compareHashPassword
}
