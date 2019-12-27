import { Client } from 'pg';
import { databaseUrl } from '../config';

const ssl = process.env.NODE_ENV === 'production';

const client = new Client({
  connectionString: databaseUrl,
  ssl
});

client.connect();

