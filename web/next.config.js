const withPlugins = require('next-compose-plugins');
const withImages = require('next-images');
const withCSS = require('@zeit/next-css');
const path = require('path');

module.exports = withPlugins([
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
  ],
  [withCSS]
]);
