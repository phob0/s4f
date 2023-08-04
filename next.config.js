/** @type {import('next').NextConfig} */

const withTM = require("next-transpile-modules")([
  "@multiversx/sdk-dapp",
]);

const nextConfig = {
    webpack: (config) => {
      config.resolve.fallback = {
        fs: false,
        buffer: require.resolve('buffer'),
        crypto: require.resolve('crypto-browserify'),
        path: require.resolve('path-browserify'),
        stream: require.resolve('stream-browserify'),
        process: require.resolve('process/browser'),
      };

      return config;
    },
    // Related to problems with Ledger integration. Needs some more work. But finally it will be enabled.
    reactStrictMode: false,
    async rewrites() {
      if (!process.env.MULTIVERSX_PRIVATE_API) {
        return [];
      }
      return [
        {
          source: `${process.env.NEXT_PUBLIC_MULTIVERSX_API}/:path*`,
          destination: `${process.env.MULTIVERSX_PRIVATE_API}/:path*`,
        },
      ];
    },
    eslint: {
      dirs: ['components', 'config', 'hooks', 'pages', 'store', 'types', 'utils'],
    },
    images: {
      domains: ["media.elrond.com", "media.elrond.com"],
    },
  };

  const { withSuperjson } = require('next-superjson');

  module.exports = (phase, defaultConfig) => {
    const plugins = [
        withTM,
        (config) => config,
    ];

    const config = plugins.reduce(
        (acc, plugin) => {
            const update = plugin(acc);
            return typeof update === "function"
                ? update(phase, defaultConfig)
                : update;
        },
        { ...withSuperjson()(nextConfig) },
    );

    return config;
};