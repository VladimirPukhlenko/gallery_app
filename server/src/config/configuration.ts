require('dotenv').config();

export default () => ({
  PORT: +process.env.PORT || 3001,
  MONGODB_URL: process.env.MONGODB_URL,
  JWT_KEY: process.env.JWT_KEY,
  NODE_ENV: process.env.NODE_ENV,
  JWT_KEY_ACCESS: process.env.JWT_KEY_ACCESS,
  JWT_KEY_REFRESH: process.env.JWT_KEY_REFRESH,
  JWT_KEY_RECOVERY: process.env.JWT_KEY_RECOVERY,
});
