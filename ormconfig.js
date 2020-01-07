require('dotenv').config();

const ormConfigs = {
  production: {
    type: "postgres",
    url: process.env.DATABASE_URL,
    logging: false,
    synchronize: false,
    entities: [
        "dist/services/**/entity.js",
    ],
  },
}

ormConfigs.development = {
  ...ormConfigs.production,
  logging: true,
}

ormConfigs.test = {
  logging: false,
  synchronize: true,
  type: "sqlite",
  database: 'test.db',
  entities: [
    "dist/services/**/entity.js",
  ],
}


module.exports = ormConfigs[process.env.NODE_ENV];