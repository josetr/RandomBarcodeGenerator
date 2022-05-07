/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  assetPrefix: ".",
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        react: 'preact/compat',
        'react-dom': 'preact/compat',
      });
    }

    return config;
  },
};
