// https://orm.drizzle.team/kit-docs/conf

//import { drizzle } from 'drizzle-orm/better-sqlite3';
//import { eq, sql } from "drizzle-orm";
//import Database from 'better-sqlite3';

import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),  // 'id' is the column name
  alias: text('alias'),
  passphrase: text('passphrase'),  
});