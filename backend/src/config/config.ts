import dotenv from 'dotenv';

dotenv.config();

const LOGGER_LEVEL = process.env.LOGGER_LEVEL;

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'defaultSecret';
const JWT_REFRESH_AGE = Number(
    process.env.JWT_REFRESH_AGE || 30 * 24 * 60 * 60 * 1000);
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'defaultSecret';

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_FROM = process.env.EMAIL_FROM || "yarosgrerefe@gmail.com";
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_PORT = Number(process.env.EMAIL_PORT || 587);
const EMAIL_SECURITY = process.env.EMAIL_SECURITY === 'true';
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.ethereal.email';

const APP_PORT = Number(process.env.APP_PORT || 5000);
const APP_URL = process.env.APP_URL || `http://localhost:${APP_PORT}`
const CLIENT_URL = process.env.CLIENT_URL || `http://localhost:${APP_PORT}`;
export const config = {
  logger: {
    level: LOGGER_LEVEL
  },
  jwt: {
    refreshSecret: JWT_REFRESH_SECRET,
    accessSecret: JWT_ACCESS_SECRET,
    refreshAge: JWT_REFRESH_AGE
  },
  server: {
    port: APP_PORT,
    url: APP_URL
  },
  client: {
    url: CLIENT_URL
  },
  mailer: {
    username: EMAIL_USER,
    from: EMAIL_FROM,
    password: EMAIL_PASS,
    port: EMAIL_PORT,
    security: EMAIL_SECURITY,
    host: EMAIL_HOST,
  },
}