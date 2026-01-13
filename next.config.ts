import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                port: "",
                pathname: "/dtba0ac6x/**",
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                pathname: "**",
            },
        ],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: "5mb",
        },
    },
};

export default withNextIntl(nextConfig);
