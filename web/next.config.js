const withPlugins = require('next-compose-plugins');
const withImages = require('next-images');
const withCSS = require('@zeit/next-css');

module.exports = withPlugins([[withImages], [withCSS]], {
  publicRuntimeConfig: {
    API_SERVER:
      process.env.NODE_ENV === 'production'
        ? 'https://grasis-api.herokuapp.com/'
        : 'http://localhost:3000'
  }
});
