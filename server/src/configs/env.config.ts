export const env = () => ({
  CLOUDINARY: {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  },
  DB: {
    MONGODB_URL: process.env.MONGODB_URL,
  },
  TOKENS: {
    JWT_KEY_ACCESS: process.env.JWT_KEY_ACCESS,
    ACCESS_TOKEN_EXP: process.env.ACCESS_TOKEN_EXP,
    JWT_KEY_REFRESH: process.env.JWT_KEY_REFRESH,
    REFRESH_TOKEN_EXP: process.env.REFRESH_TOKEN_EXP,
    JWT_KEY_RECOVERY: process.env.JWT_KEY_RECOVERY,
    RECOVERY_TOKEN_EXP: process.env.RECOVERY_TOKEN_EXP,
  },
  MAILER: {
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: +process.env.EMAIL_PORT,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  },
  NODE_ENV: process.env.NODE_ENV,
  PORT: +process.env.PORT,
});
