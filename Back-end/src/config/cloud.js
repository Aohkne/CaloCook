import { OAuth2Client } from 'google-auth-library'
import { env } from '@/config/environment'

export const cloud = new OAuth2Client(env.YOUR_GOOGLE_CLIENT_ID)
