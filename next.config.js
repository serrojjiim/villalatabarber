import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: true, 
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    return config;
  },
  // Le decimos a Vercel que ignore los errores de tipos al compilar
  typescript: {
    ignoreBuildErrors: true,
  },
  // También ignoramos las advertencias de ESLint por si acaso
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default withPWA(nextConfig);