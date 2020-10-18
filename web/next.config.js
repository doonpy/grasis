const withPlugins = require('next-compose-plugins');
const withImages = require('next-images');
const path = require('path');

module.exports = withPlugins(
  [
    [
      withImages({
        exclude: path.resolve(__dirname, 'assets/svg'),
        webpack: (config) => {
          config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack']
          });

          return config;
        }
      })
    ]
  ],
  {
    distDir: 'dist',
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true
    },
    env: {
      NEXT_PUBLIC_HEROKU_PR_NUMBER: process.env.HEROKU_PR_NUMBER
    }
  }
);
