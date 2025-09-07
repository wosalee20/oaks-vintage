/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xlresisprwpvaklxlduc.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  compiler: {
    styledComponents: true, // displayName+ssr hashing stability
  },

  // ✅ Don’t fail production builds on lint problems
  eslint: { ignoreDuringBuilds: true },

  // ✅ Tell Next the real project root (fixes “inferred workspace root” caveat)
  outputFileTracingRoot: __dirname,
};

module.exports = nextConfig;
