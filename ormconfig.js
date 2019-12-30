require('dotenv').config();

module.exports = {
  type: "postgres",
  url: process.env.DATABASE_URL,
  logging: process.env.NODE_ENV !== 'production',
  synchronize: false,
  entities: [
      "dist/services/**/entity.js",
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
  }
}