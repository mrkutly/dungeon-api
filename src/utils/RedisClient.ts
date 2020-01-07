import redis from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL;

let RedisClient;

if (process.env.NODE_ENV === 'test') {
  RedisClient = {
    get: (path, cb) => { },
    set: (path, data) => { },
  } as redis.RedisClient;
} else {
  RedisClient = redis.createClient({ url: redisUrl });
}

export default RedisClient;