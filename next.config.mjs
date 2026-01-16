/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
    },
    turbopack: {},
    webpack: (config) => {
        config.externals.push("@replit/vite-plugin-cartographer", "@replit/vite-plugin-dev-banner", "@replit/vite-plugin-runtime-error-modal");
        return config;
    },
};

export default nextConfig;
