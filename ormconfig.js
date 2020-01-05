require('dotenv').config();

module.exports = {
  type: "postgres",
  url: process.env.DATABASE_URL,
  logging: process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test',
  synchronize: false,
  entities: [
      "dist/services/**/entity.js",
  ],
  cli: {
      entitiesDir: "entity",
  }
}