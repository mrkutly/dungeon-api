import knexConfig from './knexfile';
import knex from 'knex';

const environment = process.env.NODE_ENV || 'development';

export default knex(knexConfig[environment]);