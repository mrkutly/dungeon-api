/* eslint-disable @typescript-eslint/no-var-requires */
require('ts-node/register');
const { databaseUrl } = require('../config');

module.exports = {

  development: {
    client: "postgresql",
    connection: databaseUrl,
    migrations: {
      tableName: "knex_migrations"
    }
  },

  staging: {
    client: "postgresql",
    connection: databaseUrl,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  production: {
    client: "postgresql",
    connection: databaseUrl,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }

};
