// https://stackoverflow.com/questions/24597634/how-to-generate-an-array-of-the-alphabet
//import { nanoid } from 'nanoid/non-secure';
//import { customAlphabet  } from 'nanoid/non-secure';
import { customAlphabet  } from 'nanoid';

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 16);


export {
  nanoid
}
