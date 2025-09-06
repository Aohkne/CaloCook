import Redis from 'ioredis'
import { env } from '@/config/environment'

export const redis = new Redis(env.UPSTASH_REDIS_URL)
