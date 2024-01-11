// https://orm.drizzle.team/kit-docs/conf

//import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq, sql} from "drizzle-orm";
//import Database from 'better-sqlite3';

import { text, integer, sqliteTable, SQLiteTimestamp } from "drizzle-orm/sqlite-core";

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),  // 'id' is the column name
  alias: text('alias'),
  passphrase: text('passphrase'),  
});

// https://www.answeroverflow.com/m/1125917160162742312

export const blogs = sqliteTable('blogs', {
  id: integer('id').primaryKey(),  // 'id' is the column name
  aliasid: text('aliasid'),
  title: text('title'),
  content: text('content'),
  tags: text('tags'),
  createdAt: text("created_at", { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  time: text("time").default(sql`CURRENT_TIME`),
  date: text("date").default(sql`CURRENT_DATE`),
  timestamp: text("timestamp").default(sql`CURRENT_TIMESTAMP`),
});