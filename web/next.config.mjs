/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Old artist-onboarding URL → new audience-framed surface.
      { source: "/tokenize", destination: "/for-artists", permanent: true },
    ];
  },
};

export default nextConfig;
