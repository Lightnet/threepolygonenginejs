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

export const forums = sqliteTable('forums', {
  id: integer('id').primaryKey(),  // 'id' is the column name
  aliasid: text("aliasid"),
  title: text("title"),
  content: text("content"),
  create_at: text("create_at").default(sql`CURRENT_TIME`),
  update_at: text("update_at").default(sql`CURRENT_TIME`),
  time: text("time").default(sql`CURRENT_TIME`),
  date: text("date").default(sql`CURRENT_DATE`),
  timestamp: text("timestamp").default(sql`CURRENT_TIMESTAMP`),
});

export const Board = sqliteTable('board', {
  id: integer('id').primaryKey(),  // 'id' is the column name
  aliasid: text("aliasid"),
  parentid: text("parentid"),
  title: text("title"),
  content: text("content"),
  create_at: text("create_at").default(sql`CURRENT_TIME`),
  update_at: text("update_at").default(sql`CURRENT_TIME`),
});

export const Topic = sqliteTable('topic', {
  id: integer('id').primaryKey(),  // 'id' is the column name
  aliasid: text("aliasid"),
  parentid: text("parentid"),
  title: text("title"),
  content: text("content"),
  create_at: text("create_at").default(sql`CURRENT_TIME`),
  update_at: text("update_at").default(sql`CURRENT_TIME`),
});

export const Comment = sqliteTable('comment', {
  id: integer('id').primaryKey(),  // 'id' is the column name
  aliasid: text("aliasid"),
  parentid: text("parentid"),
  title: text("title"),
  content: text("content"),
  create_at: text("create_at").default(sql`CURRENT_TIME`),
  update_at: text("update_at").default(sql`CURRENT_TIME`),
});

export const entity = sqliteTable('entity', {
  id: integer('id').primaryKey(),  // 'id' is the column name
  aliasid: text("aliasid"),
  name: text("name"),
  gameobjectid: text("gameobjectid"),
  content: text("content"),
  create_at: text("create_at").default(sql`CURRENT_TIME`),
  update_at: text("update_at").default(sql`CURRENT_TIME`),
});

