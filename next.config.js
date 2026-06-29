import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  // FORZAMOS a true para que el PWA no rompa el entorno de desarrollo de StackBlitz
  disable: true, 
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    return config;
  },
};

export default withPWA(nextConfig);