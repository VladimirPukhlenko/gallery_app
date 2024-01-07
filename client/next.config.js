/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  env: {
    API_URL: process.env.API_URL,
    CLOUDINARY_UPLOADPRESET: process.env.CLOUDINARY_UPLOADPRESET,
  },
};

module.exports = nextConfig;
