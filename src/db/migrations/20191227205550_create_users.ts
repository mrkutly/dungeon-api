/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Knex from "knex";


export async function up(knex: Knex): Promise<void | Error> {
  try {
    return knex.schema.createTable('users', (t) => {
      t.increments().primary();
      t.string('email').notNullable().unique();
      t.string('password');
      t.timestamps();
    });
  } catch (error) {
    return error;
  }
}


export async function down(knex: Knex): Promise<void | Error> {
  try {
    return knex.schema.dropTableIfExists('users');
  } catch (error) {
    return error;
  }
}

