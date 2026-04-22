/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['puppeteer-core', '@sparticuz/chromium'],
  async headers() {
    return [
      {
        source: '/verbindingswiel',
        headers: [
          { key: 'Content-Security-Policy', value: "frame-ancestors *;" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
