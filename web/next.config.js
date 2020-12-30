const withPlugins = require('next-compose-plugins');
const withImages = require('next-images');
const path = require('path');

function getApiServer() {
  if (process.env.NODE_ENV !== 'production') {
    return process.env.API_SERVER_LOCAL;
  }

  if (process.env.IS_STAGING === '1') {
    return process.env.API_SERVER_STAGING;
  }

  return process.env.API_SERVER_PRODUCTION;
}

module.exports = withPlugins(
  [
    [
      withImages({
        exclude: path.resolve(__dirname, './src/assets/svg'),
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
    env: {
      NEXT_PUBLIC_HEROKU_PR_NUMBER: process.env.HEROKU_PR_NUMBER,
      NEXT_PUBLIC_API_SERVER: getApiServer()
    }
  }
);
