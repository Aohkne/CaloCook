import Redis from 'ioredis'
import dotenv from 'dotenv'
import { env } from '@/config/environment'

dotenv.config()

export const redis = new Redis(env.UPSTASH_REDIS_URL)
