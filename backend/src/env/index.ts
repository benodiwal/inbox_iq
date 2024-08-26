import { z } from 'zod';
import { config } from 'dotenv';

const envSchema = z.object({
  PORT: z.string(),
  DATABASE_URL: z.string(),
  COOKIE_SECRET: z.string(),
  CLIENT_ORIGIN: z.string(),
  REDIS_URL: z.string(),
  GOOGLE_OAUTH_CLIENT_ID: z.string(),
  GOOGLE_OAUTH_CLIENT_SECRET: z.string(),
  MICROSOFT_OAUTH_CLIENT_ID: z.string(),
  MICROSOFT_OAUTH_CLIENT_SECRET: z.string(),
  MICROSOFT_TENANT_ID: z.string(),
});

export const parseEnv = (): void => {
  config();
  envSchema.parse(process.env);
};

const getEnvVar = (key: keyof z.infer<typeof envSchema>): string => {
  return process.env[key] as string;
};

export default getEnvVar;
