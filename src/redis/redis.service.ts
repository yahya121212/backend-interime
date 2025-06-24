import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private client: Redis;

  constructor() {
    // Connect to Redis
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT, 10) || 6379,
      password: process.env.REDIS_PASSWORD,
    });
  }

  // Example function to set a value
  async set(key: string, value: string): Promise<string> {
    return await this.client.set(key, value);
  }

  // Example function to get a value
  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  // Close Redis connection
  async close() {
    await await this.client.quit();
  }

  // Helper function to get data from Redis or DB if not available in cache
  public async getFromCacheOrDB(key: string, fetchFromDB: Function) {
    // Try to get data from Redis
    const value = await this.get(key);
    if (value) {
      console.log('Redis');
      return JSON.parse(value);
    }
    // If not found in cache, fetch from DB and cache it
    console.log('DB');
    const data = await fetchFromDB();
    await this.set(key, JSON.stringify(data));
    return data;
  }
}
