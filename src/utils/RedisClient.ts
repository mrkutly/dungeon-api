import redis from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL;

const RedisClient = redis.createClient({ url: redisUrl });

export default RedisClient;