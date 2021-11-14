import dotenv from "dotenv";
dotenv.config();

export default {
  nodeEnv: process.env.NODE_ENV,
  apiName: process.env.API_NAME,
  appUrl: process.env.APP_URL,
  port: process.env.PORT,
  dbUrl: process.env.DB_URL,
  dbName: process.env.DB_NAME,
  cookieSecret: process.env.COOKIE_SECRET,
  jwtSecret: process.env.JWT_SECRET,
  emailAddress: process.env.EMAIL_ADDRESS,
  emailClientId: process.env.EMAIL_CLIENT_ID,
  emailClientSecret: process.env.EMAIL_CLIENT_SECRET,
  emailRefreshToken: process.env.EMAIL_REFRESH_TOKEN,
  emailAccessToken: process.env.EMAIL_ACCESS_TOKEN,
  emailRedirectUri: process.env.EMAIL_REDIRECT_URI,
};
