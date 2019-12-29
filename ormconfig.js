require('dotenv').config();

module.exports = {
  type: "postgres",
  url: process.env.DATABASE_URL,
  logging: true,
  synchronize: false,
  entities: [
      "dist/services/database/entity/*.js"
  ],
  subscribers: [
      "dist/services/database/subscriber/*.js"
  ],
  entitySchemas: [
      "dist/services/database/schema/*.json"
  ],
  migrations: [
      "dist/services/database/migration/*.js"
  ],
  cli: {
      entitiesDir: "entity",
      migrationsDir: "migration",
      subscribersDir: "subscriber"
  }
}