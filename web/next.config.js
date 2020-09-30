const withPlugins = require('next-compose-plugins');
const withImages = require('next-images');
const withSass = require('@zeit/next-sass');
const withCSS = require('@zeit/next-css');

module.exports = withPlugins([[withSass], [withImages], [withCSS]], {
  publicRuntimeConfig: {
    API_SERVER:
      process.env.NODE_ENV === 'production'
        ? 'https://grasis-api.herokuapp.com/'
        : 'http://localhost:3000'
  }
});
